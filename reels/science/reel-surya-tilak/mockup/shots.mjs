import { chromium } from 'playwright'; import { spawn } from 'node:child_process';
const root = new URL('../../../../', import.meta.url).pathname, out = process.argv[2] || '/tmp/scr/surya';
const srv = spawn('python3', ['-m', 'http.server', '8823', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const s of (process.argv[3] || '1,2,3').split(',')) {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', s, e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CON', s, m.text()); });
  await p.goto(`http://127.0.0.1:8823/reels/science/reel-surya-tilak/mockup/index.html?s=${s}`); await p.waitForFunction('window.__ready===true', null, { timeout: 120000 });
  await p.screenshot({ path: `${out}/m${s}.png` }); await p.close(); console.log('shot', s);
}
await b.close(); srv.kill();
