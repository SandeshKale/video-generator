#!/usr/bin/env node
/**
 * Renders reel-anthropic-opus-5-5/reel.html to a 4K 60fps MP4.
 *
 * Follows the render recipe used by html-video's Hyperframes adapter
 * (https://github.com/nexu-io/html-video — packages/adapter-hyperframes):
 * headless Chromium loads the self-contained animated HTML, then ffmpeg
 * (libx264) encodes the capture to MP4.
 *
 * The source template exposes window.__seek(t) / __reelDurationSec instead
 * of relying on real-time CSS/GSAP playback, so instead of Hyperframes'
 * wall-clock recordVideo path we drive __seek() deterministically once per
 * output frame and screenshot each step — this guarantees an exact 60fps
 * frame count with no dropped/duplicated frames, then hands the PNG
 * sequence to ffmpeg exactly like the adapter's webm->mp4 step.
 */
import { chromium } from 'playwright';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SOURCE_HTML = join(ROOT, 'reel-anthropic-opus-5-5', 'reel.html');
const OUTPUT_MP4 = join(ROOT, 'reel-anthropic-opus-5-5', 'reel-4k60.mp4');

// Source document is a fixed 1080x1920 (9:16) canvas. deviceScaleFactor 2
// renders it at 2160x3840 — 4K UHD for vertical/portrait video.
const CSS_WIDTH = 1080;
const CSS_HEIGHT = 1920;
const SCALE = 2;
const FPS = 60;
const DURATION_SEC = 21.0; // window.__reelDurationSec in reel.html

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

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--force-color-profile=srgb'],
  });

  try {
    const page = await browser.newPage({
      viewport: { width: CSS_WIDTH, height: CSS_HEIGHT },
      deviceScaleFactor: SCALE,
    });

    const fileUrl = pathToFileURL(SOURCE_HTML).href;
    await page.goto(fileUrl, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof window.__seek === 'function');

    const totalFrames = Math.round(DURATION_SEC * FPS);
    console.log(`Rendering ${totalFrames} frames at ${CSS_WIDTH * SCALE}x${CSS_HEIGHT * SCALE}, ${FPS}fps...`);

    for (let i = 0; i < totalFrames; i++) {
      const t = i / FPS;
      await page.evaluate((tt) => window.__seek(tt), t);
      const frameName = `frame-${String(i).padStart(6, '0')}.png`;
      await page.screenshot({ path: join(frameDir, frameName) });
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
    await rm(frameDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
