import { chromium } from 'playwright'; import { spawn } from 'node:child_process';
const root = new URL('../../../../', import.meta.url).pathname, out = process.argv[2] || '/tmp/scr/surya';
const srv = spawn('python3', ['-m', 'http.server', '8833', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CON', m.text()); });
  await p.goto(`http://127.0.0.1:8833/reels/science/reel-surya-tilak/site/index.html`); await p.waitForFunction('window.__ready===true', null, { timeout: 120000 });
console.log('cues missed', await p.evaluate(() => JSON.stringify(window.__cue || [])), 'dur', await p.evaluate(() => window.__reelDurationSec));
for (const s of (process.argv[3] || '1').split(',')) { await p.evaluate(t => window.__seek(+t), s); await p.waitForTimeout(150); await p.screenshot({ path: `${out}/f_${s}.png` }); console.log('shot', s); }
await p.close();
await b.close(); srv.kill();
