// Layout lint for the page: bounding-box overlaps of [data-b] elements (same scene), safe zone (x 150-918 for text blocks, y <= 1210 for stage), caption/avatar band, text overflow.
// bun site/check.mjs [step=0.5] [t0 t1 ...]  -> prints findings per sample time. Deliberate overlays are listed in ALLOW.
import { chromium } from '../../../../node_modules/playwright/index.mjs';
import { serveDir } from '../../../../scripts/static-server.mjs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const server = await serveDir(root); const url = server.url || `http://127.0.0.1:${server.port}/`;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(url); await pg.waitForFunction(() => window.__ready !== false);
const times = process.argv.slice(2).map(Number).filter(x => !isNaN(x));
const ALLOW = [['rc', 'st']];
let n = 0;
for (const t of times) {
  await pg.evaluate(t => window.__seek(t), t);
  const res = await pg.evaluate(() => {
    const out = [], sc = [...document.querySelectorAll('#scenes > .sc')].filter(e => e.style.display !== 'none' && +e.style.opacity > .85);
    for (const s of sc) {
      const els = [...s.querySelectorAll('[data-b]')].filter(e => +getComputedStyle(e).opacity > .5).map(e => ({ k: e.dataset.b, r: e.getBoundingClientRect(), e }));
      for (const a of els) {
        const r = a.r; if (r.width < 2 || r.height < 2) continue;
        if (r.bottom > 1222 && a.k !== 'src') out.push(`BOTTOM ${a.k} bottom=${Math.round(r.bottom)}`);
        if (r.right > 928 && !['tick','h','src'].includes(a.k)) out.push(`RIGHT ${a.k} right=${Math.round(r.right)}`);
        if (r.left < 110) out.push(`LEFT ${a.k} left=${Math.round(r.left)}`);
        if (a.e.scrollWidth > a.e.clientWidth + 2 && getComputedStyle(a.e).overflow !== 'hidden' && !['ticket','stub'].includes(a.k)) out.push(`OVERFLOW ${a.k}`);
        for (const c of els) if (a.k < c.k) { const q = c.r, w = Math.min(r.right, q.right) - Math.max(r.left, q.left), h = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
          if (w > 4 && h > 4) out.push(`OVERLAP ${a.k} × ${c.k} (${Math.round(w)}×${Math.round(h)})`); }
      }
    }
    return out;
  });
  const f = res.filter(x => !ALLOW.some(([a, b]) => x.includes(a) && x.includes(b)));
  if (f.length) { console.log('t=' + t, f.join(' | ')); n += f.length }
}
console.log(`check: ${n} finding(s) over ${times.length} sample time(s)`); await b.close(); server.close?.();
