import { chromium } from 'playwright'; import { spawn } from 'node:child_process';
const srv = spawn('python3', ['-m', 'http.server', '8835', '--bind', '127.0.0.1'], { cwd: '/home/user/video-generator/', stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(`http://127.0.0.1:8835/reels/science/reel-jatayu-flight/site/index.html`); await p.waitForFunction('window.__ready===true', null, { timeout: 120000 });
let i = 0; for (const tilt of [-.25, 0]) for (const rot of [0, 1.05, 2.1, 3.15, 4.2, 5.25]) { await p.evaluate(([r, tl]) => { window.__dbg('SKY2.rotation.y=' + r + ';SKY2.rotation.x=' + tl); window.__seek(89.5); }, [rot, tilt]); await p.screenshot({ path: `/tmp/scr/jat/sky/s${i++}.jpg`, quality: 70, type: 'jpeg' }); }
await b.close(); srv.kill();
