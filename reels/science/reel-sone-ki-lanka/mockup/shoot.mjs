import { chromium } from 'playwright'; import { spawn } from 'node:child_process';
const srv = spawn('python3', ['-m', 'http.server', '8841', '--bind', '127.0.0.1'], { cwd: '/home/user/video-generator/', stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const s of (process.argv[2] || '1,2,3,4,5,6').split(',')) { const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', s, e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CON', s, m.text()); });
  await p.goto(`http://127.0.0.1:8841/reels/science/reel-sone-ki-lanka/mockup/index.html?s=${s}`); await p.waitForFunction('window.__ready===true', null, { timeout: 150000 }); await p.waitForTimeout(400); await p.screenshot({ path: `/home/user/video-generator/reels/science/reel-sone-ki-lanka/mockup/mock-${s}.png` }); console.log('shot', s); await p.close(); }
await b.close(); srv.kill();
