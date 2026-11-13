// render one mockup scene as a silent MP4: node anim.mjs <scene> <out.mp4> [fps]
import { chromium } from 'playwright'; import { spawn } from 'node:child_process';
const [, , SCN = '7', OUT = '/tmp/scr/pushpak/teardown.mp4', FPS = '30'] = process.argv, fps = +FPS;
const root = new URL('../../../../', import.meta.url).pathname;
const srv = spawn('python3', ['-m', 'http.server', '8812', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(`http://127.0.0.1:8812/reels/science/reel-pushpak-anatomy/mockup/index.html?s=${SCN}`); await p.waitForFunction('window.__ready===true', null, { timeout: 120000 });
const dur = await p.evaluate(() => window.__reelDurationSec), n = Math.round(dur * fps);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < n; i++) { await p.evaluate(t => window.__seek(t), i / fps); const buf = await p.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (i % 30 === 0) console.log('frame', i, '/', n); }
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); srv.kill(); console.log('done', OUT);
