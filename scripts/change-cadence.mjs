// 2-second change rule (creator, 13 Oct 2026): "something on screen changes at least every 2 seconds".
// Samples a reel page every STEP s, measures how much the picture changed since the previous sample (grey, 1/10 scale,
// caption band and Instagram UI zones masked out so word highlighting alone doesn't count), marks a "visible change" when
// the mean absolute difference is ≥ THR (0–255), and reports every stretch longer than MAXGAP s without one.
//   bun scripts/change-cadence.mjs <reel>/site [maxgap=2] [step=0.25] [thr=2.0]
import { chromium } from 'playwright';
import { serveDir } from './static-server.mjs';
const [site, MAXGAP = '2', STEP = '0.25', THR = '2.0'] = process.argv.slice(2);
const srv = await serveDir(new URL(site, 'file://' + process.cwd() + '/').pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__ready !== false && window.__seek, null, { timeout: 120000 });
const dur = await p.evaluate(() => window.__reelDurationSec);
await p.evaluate(() => { const c = document.createElement('canvas'); c.width = 108; c.height = 192; c.id = '__cc'; window.__cc = c; });
let prev = null, lastChange = 0, worst = 0; const gaps = [], step = +STEP;
for (let t = 0; t <= dur + 1e-6; t += step) {
  await p.evaluate((t) => window.__seek(t), t);
  const buf = await p.screenshot({ type: 'png' });
  const g = await p.evaluate(async (b64) => {          // decode + downscale + grey inside the page
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = window.__cc, x = c.getContext('2d'); x.drawImage(im, 0, 0, 108, 192); const d = x.getImageData(0, 0, 108, 192).data, out = [];
    for (let i = 0; i < d.length; i += 4) out.push(.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]); return out;
  }, buf.toString('base64'));
  if (prev) {
    let s = 0, n = 0;
    for (let y = 0; y < 192; y++) { if (y < 14 || (y >= 132 && y < 150) || y >= 154) continue;   // top UI, caption band, bottom UI
      for (let x = 15; x < 92; x++) { s += Math.abs(g[y * 108 + x] - prev[y * 108 + x]); n++; } }
    const m = s / n;
    if (m >= +THR) { const gap = t - lastChange; if (gap > +MAXGAP) gaps.push([lastChange, t]); worst = Math.max(worst, gap); lastChange = t; }
  }
  prev = g;
}
if (dur - lastChange > +MAXGAP) gaps.push([lastChange, dur]);
for (const [a, z] of gaps) console.log(`STATIC ${a.toFixed(2)}s → ${z.toFixed(2)}s (${(z - a).toFixed(2)} s with no visible change)`);
console.log(`change-cadence: ${gaps.length} stretch(es) over ${MAXGAP} s · longest gap ${Math.max(worst, dur - lastChange).toFixed(2)} s · ${dur.toFixed(1)} s checked`);
await b.close(); await srv.close();
