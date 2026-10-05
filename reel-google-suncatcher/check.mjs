// Pre-render layout lint: samples the timeline and reports (a) foreground layers intersecting the caption pill, (b) layers spilling off-canvas, (c) layer-vs-layer overlaps (non-inset/stamp pairs).
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const step = Number(process.argv[2] || 0.5), t0 = Number(process.argv[3] || 0), t1 = Number(process.argv[4] || 1e9);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__seek, null, { timeout: 90000 });
const dur = await p.evaluate(() => window.__reelDurationSec);
const issues = new Map();
for (let t = Math.max(0, t0); t < Math.min(dur, t1); t += step) {
  const r = await p.evaluate((t) => {
    window.__seek(t);
    const out = [], cap = document.getElementById('cap'), ci = document.getElementById('capin');
    const capOn = parseFloat(cap.style.opacity || 0) > 0.5, cr = ci.getBoundingClientRect();
    const items = [];
    document.querySelectorAll('#fx > .c').forEach((w) => {
      if (w.style.display === 'none' || w.dataset.nc) return;
      const op = parseFloat(w.style.opacity || 1); if (op < 0.85) return;
      if (t - parseFloat(w.dataset.t0) < 1.0) return; // let entrance finish
      let b = null; w.querySelectorAll('*').forEach((n) => { if (n.classList && n.classList.contains('tape')) return; const r = n.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return; if (!b) b = { left: r.left, top: r.top, right: r.right, bottom: r.bottom }; else { b.left = Math.min(b.left, r.left); b.top = Math.min(b.top, r.top); b.right = Math.max(b.right, r.right); b.bottom = Math.max(b.bottom, r.bottom); } }); if (!b) return;
      items.push({ type: w.dataset.type, x: b.left, y: b.top, r: b.right, b: b.bottom });
    });
    for (const i of items) {
      if (capOn && i.b > cr.top + 4 && i.y < cr.bottom && i.r > cr.left && i.x < cr.right) out.push(`${i.type} hits caption (bottom ${Math.round(i.b)} vs pill top ${Math.round(cr.top)})`);
      if (i.r > 925 || i.b > 1530 || i.x < 110) out.push(`${i.type} off-canvas (${Math.round(i.x)},${Math.round(i.y)})-(${Math.round(i.r)},${Math.round(i.b)})`);
    }
    for (let a = 0; a < items.length; a++) for (let c = a + 1; c < items.length; c++) {
      const A = items[a], B = items[c]; if (['stamp', 'chips'].includes(A.type) || ['stamp', 'chips'].includes(B.type)) continue;
      const ox = Math.min(A.r, B.r) - Math.max(A.x, B.x), oy = Math.min(A.b, B.b) - Math.max(A.y, B.y);
      if (ox > 8 && oy > 8) out.push(`overlap ${A.type}×${B.type} (${Math.round(ox)}×${Math.round(oy)}px)`);
    }
    return out;
  }, t);
  for (const m of r) { const k = m; if (!issues.has(k)) issues.set(k, []); issues.get(k).push(t); }
}
for (const [k, ts] of issues) console.log(`${k}  @ ${ts[0].toFixed(1)}s..${ts[ts.length - 1].toFixed(1)}s (${ts.length} samples)`);
console.log('check done:', issues.size, 'distinct issues over', dur.toFixed(1), 's');
await b.close(); await srv.close();
