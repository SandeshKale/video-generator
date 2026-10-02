import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const ts = process.argv.slice(2).map(Number);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('console', m => console.log('console', m.text()));
await p.goto(srv.url + '/index.html'); await p.waitForTimeout(6000);
console.log(await p.title(), await p.evaluate(() => window.__reelDurationSec));
for (const t of ts) { const s = Date.now(); await p.evaluate(t => window.__seek(t), t); await p.screenshot({ path: `/tmp/pv-${t}.png` }); console.log(t, Date.now() - s, 'ms'); }
await b.close(); await srv.close();
