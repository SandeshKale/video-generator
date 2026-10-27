// Screenshot the GIF page at the given times: bun shots.mjs <outdir> t1 t2 ...  (also prints text that had to be shrunk below 14.5 px)
import { chromium } from 'playwright';
const [out, ...ts] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('CONERR', m.text()); });
await p.goto('file://' + new URL('./index.html', import.meta.url).pathname); await p.waitForFunction(() => window.__ready === true); await p.waitForTimeout(300);
console.log('shrunk below 14.5px:', JSON.stringify(await p.evaluate(() => window.__fitBad)));
for (const t of ts.map(Number)) { await p.evaluate((t) => window.__seek(t), t); await p.screenshot({ path: `${out}/f-${t}.png` }); }
await b.close();
