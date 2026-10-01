#!/usr/bin/env node
/**
 * Renders a self-contained animated reel HTML file to a 4K 60fps MP4.
 *
 * Usage: node scripts/render.mjs <source.html> <output.mp4>
 *
 * Follows the render recipe used by html-video's Hyperframes adapter
 * (https://github.com/nexu-io/html-video — packages/adapter-hyperframes):
 * headless Chromium loads the self-contained animated HTML, then ffmpeg
 * (libx264) encodes the capture to MP4.
 *
 * The source templates expose window.__seek(t) / __reelDurationSec instead
 * of relying on real-time CSS/GSAP playback, so instead of Hyperframes'
 * wall-clock recordVideo path we drive __seek() deterministically once per
 * output frame and screenshot each step — this guarantees an exact 60fps
 * frame count with no dropped/duplicated frames, then hands the PNG
 * sequence to ffmpeg exactly like the adapter's webm->mp4 step. Duration is
 * read from the page's own window.__reelDurationSec so each template is
 * free to define its own scene timeline/length.
 *
 * <source> may be either a plain HTML file (loaded directly over file://)
 * or a directory (a Vite `dist/` build) — Chromium enforces CORS on
 * `type="module"` scripts even over file://, which breaks a bare file://
 * load of a Vite build (its entry script is always a module), so directory
 * sources are served over a local http://127.0.0.1 static server instead.
 */
import { chromium } from 'playwright';
import { mkdir, mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { serveDir } from './static-server.mjs';

const [, , sourceArg, outputArg, scaleArg] = process.argv;

if (!sourceArg || !outputArg) {
  console.error('Usage: node scripts/render.mjs <source.html|dist-dir> <output.mp4> [scale]');
  console.error('  scale: deviceScaleFactor, default 1 (1080x1920 Full HD). Pass 2 for 2160x3840 4K.');
  process.exit(1);
}

const SOURCE_PATH = resolve(sourceArg);
const OUTPUT_MP4 = resolve(outputArg);

// Source documents are a fixed 1080x1920 (9:16) canvas. deviceScaleFactor 1
// renders it at the native 1080x1920 (Full HD); deviceScaleFactor 2 renders
// it at 2160x3840 (4K UHD) — both at native pixel density, no upscaling.
// Full HD is the default per standing instruction: always render in Full
// HD, never 4K (4K capture is dramatically slower in this environment's
// software-rendered/swiftshader Chromium — a 58s reel took ~3hrs projected
// at scale 2 vs ~15min at scale 1 — and 1080x1920 is plenty for Reels).
const CSS_WIDTH = Number(process.env.REEL_W || 1080);
const CSS_HEIGHT = Number(process.env.REEL_H || 1920);
const SCALE = scaleArg ? Number(scaleArg) : 1;
const FPS = Number(process.env.REEL_FPS || 60);

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
    proc.on('error', reject);
    proc.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

async function main() {
  await mkdir(dirname(OUTPUT_MP4), { recursive: true });
  const frameDir = await mkdtemp(join(tmpdir(), 'reel-frames-'));

  // Playwright's expected Chromium revision can drift ahead of whatever
  // build is actually sitting in PLAYWRIGHT_BROWSERS_PATH (see CLAUDE.md's
  // "Playwright's Chromium download must stay version-pinned" note) —
  // fall back to the pre-provisioned build's own executable when present
  // rather than failing with a confusing "executable doesn't exist" error.
  const preProvisionedChromium = '/opt/pw-browsers/chromium';
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--force-color-profile=srgb'],
    ...(existsSync(preProvisionedChromium) ? { executablePath: preProvisionedChromium } : {}),
  });

  let server;
  try {
    const isDir = (await stat(SOURCE_PATH)).isDirectory();
    let entryUrl;
    if (isDir) {
      server = await serveDir(SOURCE_PATH);
      entryUrl = `${server.url}/index.html`;
      console.log(`Serving ${SOURCE_PATH} at ${server.url}`);
    } else {
      entryUrl = pathToFileURL(SOURCE_PATH).href;
    }

    const page = await browser.newPage({
      viewport: { width: CSS_WIDTH, height: CSS_HEIGHT },
      deviceScaleFactor: SCALE,
    });

    const cdp = SCALE === 1 ? await page.context().newCDPSession(page) : null;
    await page.goto(entryUrl, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof window.__seek === 'function');

    const DURATION_SEC = await page.evaluate(() => window.__reelDurationSec);
    if (typeof DURATION_SEC !== 'number' || !(DURATION_SEC > 0)) {
      throw new Error(`window.__reelDurationSec is not a positive number: ${DURATION_SEC}`);
    }

    const totalFrames = Math.round(DURATION_SEC * FPS);
    console.log(`Source: ${SOURCE_PATH}`);
    console.log(`Duration: ${DURATION_SEC}s -> ${totalFrames} frames at ${CSS_WIDTH * SCALE}x${CSS_HEIGHT * SCALE}, ${FPS}fps...`);

    for (let i = 0; i < totalFrames; i++) {
      const t = i / FPS;
      await page.evaluate((tt) => window.__seek(tt), t);
      const frameName = `frame-${String(i).padStart(6, '0')}.png`;
      if (cdp) {
        // Lossless PNG, but Chromium's fast-compression mode: ~2.7x faster than the default
        // encoder on textured frames (the encoder, not layout, dominated per-frame time).
        const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
        await writeFile(join(frameDir, frameName), Buffer.from(data, 'base64'));
      } else {
        await page.screenshot({ path: join(frameDir, frameName) });
      }
      if (i % (FPS * 2) === 0) {
        console.log(`  frame ${i}/${totalFrames} (t=${t.toFixed(2)}s)`);
      }
    }

    console.log('All frames captured. Encoding with ffmpeg...');

    await runFfmpeg([
      '-y',
      '-framerate', String(FPS),
      '-i', join(frameDir, 'frame-%06d.png'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'medium',
      '-crf', '18',
      '-r', String(FPS),
      '-movflags', '+faststart',
      OUTPUT_MP4,
    ]);

    console.log(`Done: ${OUTPUT_MP4}`);
  } finally {
    await browser.close();
    if (server) await server.close();
    await rm(frameDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
