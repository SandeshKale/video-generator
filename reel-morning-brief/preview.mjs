// Screenshot the page at given times: bun preview.mjs out-dir t1 t2 ...  (or "scenes" = each scene at +0.8 s, mid, end-0.4 s)
import { chromium } from 'playwright';
import fs from 'node:fs';
import { serveDir } from '../scripts/static-server.mjs';
const [out, ...ts] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('PAGEERROR', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__ready, null, { timeout: 90000 });
let times = ts.map(Number);
if (ts[0] === 'scenes') { const sc = await p.evaluate(() => window.SC), T = await p.evaluate(() => window.TOTAL); times = []; sc.forEach((s, i) => { const e = i + 1 < sc.length ? sc[i + 1] : T; times.push(s + .8, (s + e) / 2, e - .4); }); }
for (const t of times) { await p.evaluate((t) => window.__seek(t), t); await p.screenshot({ path: `${out}/t${t.toFixed(2).padStart(6, '0')}.png` }); }
console.log(times.length, 'shots'); await b.close(); await srv.close();
