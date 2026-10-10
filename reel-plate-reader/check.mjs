// Layout lint: per scene child (visible, text/box items; video clips excluded from overlap) -> safe zone x 90..930, y 130..1300, caption hits, text overflow, pairwise overlaps.
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const step = Number(process.argv[2] || 0.25);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__ready, null, { timeout: 90000 }); await p.waitForTimeout(1500);
const dur = await p.evaluate(() => window.__reelDurationSec), starts = await p.evaluate(() => window.BEATS.map((x) => x[0]));
const found = new Map(); const add = (k, t) => { if (!found.has(k)) found.set(k, []); found.get(k).push(t); };
for (let t = 0; t < dur; t += step) {
  const out = await p.evaluate(async ({ t, starts }) => {
    await window.__seek(t); const res = [], R = (n) => n.getBoundingClientRect();
    const si = starts.filter((s) => t >= s).length - 1; if (t - starts[si] < 0.8 && si > 0) return res;
    const sc = document.querySelectorAll('.sc')[si], items = [];
    const cap = document.getElementById('cap'), cr = R(cap);
    const all = [...sc.children, ...[]];
    all.forEach((n) => {
      const cs = getComputedStyle(n); if (cs.display === 'none' || parseFloat(cs.opacity) < 0.85) return;
      const r = R(n); if (r.width < 4 || r.height < 4) return;
      const txt = (n.textContent || '').trim().slice(0, 16), isV = !!n.querySelector('video') || n.tagName === 'VIDEO';
      if (n.classList.contains('stamp') || /^(VS|ILLUS)/.test(txt)) {}
      const kind = isV ? 'clip' : 'box';
      items.push({ kind, txt, l: r.left, t: r.top, r: r.right, b: r.bottom });
      if (!isV && txt && (r.left < 140 || r.right > 945)) res.push(`SAFE-X "${txt}" ${Math.round(r.left)}..${Math.round(r.right)}`);
      if (txt && r.bottom > 1300 && r.top < 1500 && !isV && n.className !== 'cap') res.push(`BAND "${txt}" bottom ${Math.round(r.bottom)}`);
      n.querySelectorAll('*').forEach((c) => { if ([...c.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) && c.scrollWidth > c.clientWidth + 3 && getComputedStyle(c).display !== 'inline') res.push(`OVERFLOW "${txt}"`); });
      if (txt && !isV && r.bottom > cr.top - 6 && r.top < cr.bottom && cr.height > 10) res.push(`CAPTION-HIT "${txt}" bottom ${Math.round(r.bottom)} cap ${Math.round(cr.top)}`);
    });
    for (let a = 0; a < items.length; a++) for (let c = a + 1; c < items.length; c++) {
      const A = items[a], B = items[c]; if (A.kind === 'clip' || B.kind === 'clip' || !A.txt || !B.txt) continue;
      const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l), oy = Math.min(A.b, B.b) - Math.max(A.t, B.t);
      if (ox > 4 && oy > 4) res.push(`OVERLAP "${A.txt}" x "${B.txt}"`);
    }
    if (cr.bottom > 1536) res.push('CAPTION below safe zone ' + Math.round(cr.bottom));
    return res;
  }, { t, starts });
  out.forEach((m) => add(m, t));
}
for (const [k, ts] of found) console.log(`${k}  @ ${ts[0].toFixed(2)}s..${ts[ts.length - 1].toFixed(2)}s (${ts.length})`);
console.log('check done:', found.size, 'distinct issues over', dur.toFixed(1), 's');
await b.close(); await srv.close();
