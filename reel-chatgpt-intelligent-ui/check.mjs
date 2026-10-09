// Strict layout lint for this reel: per scene page, sampled over the whole timeline (served over HTTP like the renderer).
// Checks: (1) stage children inside x 150..918 and above y 1270 (caption band), (2) headline/eyebrow fit and clear of the stage,
// (3) text overflowing its card, (4) unintended overlaps between stage children (collages/overlays are marked data-collage / .ov),
// (5) caption pill vs content, (6) caption wrapping to 3 lines.
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const step = Number(process.argv[2] || 0.25), a0 = Number(process.argv[3] || 0), a1 = Number(process.argv[4] || 1e9);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__ready, null, { timeout: 90000 });
const dur = await p.evaluate(() => window.__reelDurationSec), starts = await p.evaluate(() => window.DATA.scenes.map((s) => s.start));
const found = new Map(); const add = (k, t) => { if (!found.has(k)) found.set(k, []); found.get(k).push(t); };
for (let t = a0; t < Math.min(dur, a1); t += step) {
  const out = await p.evaluate(({ t, starts }) => {
    window.__seek(t); const res = [], R = (n) => n.getBoundingClientRect();
    const si = starts.filter((s) => t >= s).length - 1, lt = t - starts[si]; const pg = document.getElementById('p' + si);
    const nm = (n) => (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 16);
    const eb = pg.querySelector('.eb'), h = pg.querySelector('.h'), stg = pg.querySelector('.stage');
    if (lt > 0.9) {
      const hr = R(h); if (hr.right > 930) res.push(`HEAD-TOO-WIDE ${Math.round(hr.right)}`);
      [...h.querySelectorAll('.l')].forEach((l) => { const r = R(l); if (r.right > 930 || l.scrollWidth > l.clientWidth + 4) res.push(`HEAD-LINE-OVERFLOW "${nm(l)}" right ${Math.round(r.right)}`); });
      if (h.children.length > 2) res.push('HEAD-3-LINES');
      const er = R(eb); if (er.right > 930) res.push(`EYEBROW-TOO-WIDE ${Math.round(er.right)}`);
      if (R(h).bottom > 452) res.push(`HEAD-HITS-STAGE bottom ${Math.round(R(h).bottom)}`);
    }
    const items = [];
    if (lt > 0.75) [...stg.children].forEach((n) => {
      const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.9) return; const r = R(n); if (r.width < 2) return;
      const tag = (n.className || '').toString().slice(0, 14) || n.tagName; items.push({ n, r, tag, txt: nm(n) });
      if (r.left < 140 || r.right > 928) res.push(`SAFE-X "${tag}|${nm(n)}" ${Math.round(r.left)}..${Math.round(r.right)}`);
      if (r.bottom > 1272 && !n.id.startsWith('pc')) res.push(`SAFE-Y "${tag}|${nm(n)}" bottom ${Math.round(r.bottom)}`);
      // text escaping its card
      if (n.classList.contains('card')) n.querySelectorAll('*').forEach((c) => { if (!(c instanceof SVGElement) && [...c.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim())) { const cr = R(c); if (cr.right > r.right + 6 || cr.left < r.left - 6 || cr.bottom > r.bottom + 6) res.push(`TEXT-OUT-OF-CARD "${nm(c)}" in "${nm(n)}"`); if (c.scrollWidth > c.clientWidth + 4 && getComputedStyle(c).display !== 'inline') res.push(`TEXT-OVERFLOW "${nm(c)}"`); } });
    });
    if (!stg.dataset.collage) for (let a = 0; a < items.length; a++) for (let c = a + 1; c < items.length; c++) {
      const A = items[a], B = items[c]; if ([A, B].some((x) => x.n.classList.contains('ov') || x.n.classList.contains('stamp') || x.n.id.startsWith('pc'))) continue;
      const ox = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left), oy = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
      if (ox > 16 && oy > 16) res.push(`OVERLAP "${A.tag}|${A.txt}" × "${B.tag}|${B.txt}"`);
    }
    const cap = document.getElementById('cap'), ci = document.getElementById('capin');
    if (cap.style.display !== 'none') { const cr = R(ci); items.forEach((i) => { if (i.r.bottom > cr.top - 6 && !i.n.id.startsWith('pc')) res.push(`CAPTION-HIT "${i.tag}|${i.txt}" bottom ${Math.round(i.r.bottom)}`); }); if (cr.height > 150) res.push(`CAPTION-3-LINES ${Math.round(cr.height)}`); if (cr.bottom > 1480) res.push(`CAPTION-LOW ${Math.round(cr.bottom)}`); }
    return res;
  }, { t, starts });
  out.forEach((m) => add(m.replace(/ bottom \d+/, '').replace(/\d+\.\.\d+/, ''), t));
}
for (const [k, ts] of found) console.log(`${k}  @ ${ts[0].toFixed(2)}s..${ts[ts.length - 1].toFixed(2)}s (${ts.length})`);
console.log('check done:', found.size, 'distinct issues over', dur.toFixed(1), 's');
await b.close(); await srv.close();
