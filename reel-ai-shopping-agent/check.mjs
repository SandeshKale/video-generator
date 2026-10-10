// Layout lint: per scene child (visible) -> safe zone x 140..930, caption band hits, text overflow, pairwise overlaps. Kiosk is the only deliberate overlay.
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const step = Number(process.argv[2] || 0.25);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__ready, null, { timeout: 90000 }); await p.waitForTimeout(1000);
const dur = await p.evaluate(() => window.__reelDurationSec), starts = await p.evaluate(() => window.SC);
const found = new Map(); const add = (k, t) => { if (!found.has(k)) found.set(k, []); found.get(k).push(t); };
for (let t = 0; t < dur; t += step) {
  const out = await p.evaluate(async ({ t, starts }) => {
    await window.__seek(t); const res = [], R = (n) => n.getBoundingClientRect();
    const si = starts.filter((s) => t >= s).length - 1; if (t - starts[si] < 0.9 && si > 0) return res; if (si < 9 && t > starts[si + 1] - 0.3) return res;
    const sc = document.querySelectorAll('.sc')[si], items = [], cr = R(document.getElementById('cap')), kr = R(document.getElementById('kiosk'));
    [...sc.children].forEach((n) => {
      const cs = getComputedStyle(n); if (cs.display === 'none' || parseFloat(cs.opacity) < 0.85) return; if (n.tagName === 'CANVAS') return;
      const r = R(n); if (r.width < 4 || r.height < 4) return; const txt = (n.textContent || '').trim().slice(0, 18); const tag = n.className === 'tag';
      if (!txt) return; items.push({ txt, l: r.left, t: r.top, r: r.right, b: r.bottom, tag });
      if (r.left < 140 || r.right > 925) res.push(`SAFE-X "${txt}" ${Math.round(r.left)}..${Math.round(r.right)}`);
      if (r.bottom > cr.top - 4 && r.top < cr.bottom) res.push(`CAPTION-HIT "${txt}" bottom ${Math.round(r.bottom)}`);
      if (r.top < 140) res.push(`SAFE-TOP "${txt}" ${Math.round(r.top)}`);
      const ox = Math.min(r.right, kr.right) - Math.max(r.left, kr.left), oy = Math.min(r.bottom, kr.bottom) - Math.max(r.top, kr.top); if (ox > 6 && oy > 6 && si < 9) res.push(`KIOSK-HIT "${txt}"`);
      n.querySelectorAll('*').forEach((c) => { if ([...c.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) && c.scrollWidth > c.clientWidth + 3 && getComputedStyle(c).display !== 'inline') res.push(`OVERFLOW "${txt}"`); });
    });
    for (let a = 0; a < items.length; a++) for (let c = a + 1; c < items.length; c++) { const A = items[a], B = items[c]; const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l), oy = Math.min(A.b, B.b) - Math.max(A.t, B.t); if (ox > 4 && oy > 4) res.push(`OVERLAP "${A.txt}" x "${B.txt}"`); }
    return res;
  }, { t, starts });
  out.forEach((m) => add(m, t));
}
for (const [k, ts] of found) console.log(`${k}  @ ${ts[0].toFixed(2)}s..${ts[ts.length - 1].toFixed(2)}s (${ts.length})`);
console.log('check done:', found.size, 'distinct issues over', dur.toFixed(1), 's');
await b.close(); await srv.close();
