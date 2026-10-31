// Layout lint: text overlaps, safe zone (x 150-918, y 130-1536), caption band hits, text clipped by its box.   bun tools/check.mjs [step=0.25]
import { chromium } from 'playwright'; import { pathToFileURL } from 'node:url'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)); const step = Number(process.argv[2] || .25);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(pathToFileURL(join(H, '..', 'site', 'index.html')).href); await p.waitForFunction('window.__ready===true', null, { timeout: 60000 });
const B = await p.evaluate(() => window.__B); const out = [];
for (let t = 0.3; t < B[B.length - 1] - .05; t += step) {
  const si = B.findIndex((x, i) => t >= x && t < B[i + 1]); if (t < B[si] + .7 && si > 0) continue;               // settle 0.7 s after each cut
  const r = await p.evaluate((t) => {
    window.__seek(t); const sc = [...document.querySelectorAll('.scene')].find(e => e.style.display === 'block' && e.style.zIndex === '2'); if (!sc) return [];
    const items = []; const own = (e) => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
    const els = []; sc.querySelectorAll('*').forEach(e => { if (!own(e)) return; els.push(e); if (e.closest('svg') && e.tagName !== 'text' && e.tagName !== 'tspan') return; let o = 1, q = e; while (q && q !== sc) { o *= +(getComputedStyle(q).opacity); q = q.parentElement; } if (o < .25) return; const r = e.getBoundingClientRect(); if (r.width < 2) return; items.push({ k: (e.textContent || '').trim().slice(0, 22), x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, n: els.length - 1 }); }); items.forEach(a => { a.anc = items.filter(c => c !== a && els[c.n].contains(els[a.n]) || c !== a && els[a.n].contains(els[c.n])).map(c => c.n); });
    const cap = document.querySelector('#cap > div'); const cr = cap ? cap.getBoundingClientRect() : null; return { items, cr: cr && { x0: cr.left, y0: cr.top, x1: cr.right, y1: cr.bottom } };
  }, t);
  if (!r.items) continue; const it = r.items;
  for (let i = 0; i < it.length; i++) {
    const a = it[i]; if (a.x0 < 146 || a.x1 > 922 || a.y0 < 126 || a.y1 > 1540) out.push(`t=${t.toFixed(2)} SAFE "${a.k}" [${a.x0 | 0},${a.y0 | 0},${a.x1 | 0},${a.y1 | 0}]`);
    if (r.cr && a.y1 > r.cr.y0 - 4 && a.y0 < r.cr.y1 + 4 && a.x1 > r.cr.x0 && a.x0 < r.cr.x1) out.push(`t=${t.toFixed(2)} CAPTION "${a.k}" [${a.x0 | 0},${a.y0 | 0},${a.x1 | 0},${a.y1 | 0}]`);
    for (let j = i + 1; j < it.length; j++) { const c = it[j]; const w = Math.min(a.x1, c.x1) - Math.max(a.x0, c.x0), h = Math.min(a.y1, c.y1) - Math.max(a.y0, c.y0); if (w > 6 && h > 6 && w * h > 150) { const ca = (a.x0 <= c.x0 && a.x1 >= c.x1 && a.y0 <= c.y0 && a.y1 >= c.y1) || (c.x0 <= a.x0 && c.x1 >= a.x1 && c.y0 <= a.y0 && c.y1 >= a.y1); if (!ca && !a.anc.includes(c.n)) out.push(`t=${t.toFixed(2)} OVERLAP "${a.k}" x "${c.k}" ${w | 0}x${h | 0}`); } }
  }
}
const seen = new Set(); out.forEach(l => { const key = l.replace(/^t=[\d.]+ /, ''); if (!seen.has(key)) { seen.add(key); console.log(l); } }); console.log('findings', out.length, 'unique', seen.size); await b.close();
