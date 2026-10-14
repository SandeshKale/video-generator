// 30 fps preview (every 2nd frame of the 60 fps timeline) piped straight into ffmpeg.
import { chromium } from 'playwright'; import { spawn } from 'node:child_process';
import { serveDir } from '../../../scripts/static-server.mjs';
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto(`${srv.url}/index.html`); await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
const dur = await p.evaluate(() => window.__reelDurationSec); const out = process.argv[2];
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'fast', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const n = Math.round(dur * 30);
for (let i = 0; i < n; i++) { await p.evaluate((t) => window.__seek(t), i / 30); const buf = await p.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); if (i % 30 === 0) console.log('t', (i / 30).toFixed(0)); }
ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); console.log('done', out); process.exit(0);
