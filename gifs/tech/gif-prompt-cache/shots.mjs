// Screenshot the GIF page at the given times: bun shots.mjs <outdir> t1 t2 ...
import { chromium } from 'playwright';
const [out, ...ts] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto('file://' + new URL('./index.html', import.meta.url).pathname); await p.waitForTimeout(800);
for (const t of ts.map(Number)) { await p.evaluate((t) => window.__seek(t), t); await p.screenshot({ path: `${out}/f-${t}.png` }); }
await b.close();
