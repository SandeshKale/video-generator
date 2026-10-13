// Layout lint for the Sheets reel: per visible scene child -> safe zone (x 140..925, y >= 140), caption-band hits, text
// overflow inside any descendant, pairwise overlaps between text-bearing children, the global step tracker vs scene content,
// and occupancy (>= 65% of 90 px safe-area cells covered at entrance +0.4 s and +1.5 s).
//   bun check.mjs [step=0.125]
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const step = Number(process.argv[2] || 0.125);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__ready, null, { timeout: 90000 });
const dur = await p.evaluate(() => window.__reelDurationSec), SC = await p.evaluate(() => window.SC);
const found = new Map(); const add = (k, t) => { if (!found.has(k)) found.set(k, []); found.get(k).push(t); };
for (let i = 0; i < SC.length; i++) for (const dt of [0.4, 1.5]) {
  const t = SC[i] + dt; if (i + 1 < SC.length && t > SC[i + 1] - 0.2) continue;
  const r = await p.evaluate(async ({ t, i }) => {
    await window.__seek(t); const sc = document.getElementById('s' + (i + 1));
    const rects = [...sc.children].filter((n) => !n.classList.contains('fl') && n.tagName !== 'VIDEO' && parseFloat(getComputedStyle(n).opacity) > 0.3).map((n) => n.getBoundingClientRect()).filter((q) => q.width > 6 && q.height > 6 && q.width < 1000);
    let hit = 0, tot = 0; for (let y = 220; y < 1290; y += 90) for (let x = 150; x < 918; x += 90) { tot++; if (rects.some((q) => q.left < x + 90 && q.right > x && q.top < y + 90 && q.bottom > y)) hit++; } return hit / tot;
  }, { t, i });
  if (r < 0.65) add(`OCCUPANCY scene ${i + 1} @ +${dt}s = ${(r * 100).toFixed(0)}%`, t);
}
for (let t = 0; t < dur; t += step) {
  const out = await p.evaluate(async ({ t, SC }) => {
    await window.__seek(t); const res = [], R = (n) => n.getBoundingClientRect();
    let si = 0; SC.forEach((s, i) => { if (t >= s) si = i; });
    if (si > 0 && t - SC[si] < 0.7) return res; if (si < SC.length - 1 && t > SC[si + 1] - 0.25) return res;   // entrances / cuts
    const sc = document.getElementById('s' + (si + 1)), cr = R(document.getElementById('cap')), capOn = parseFloat(getComputedStyle(document.getElementById('cap')).opacity) > 0;
    const trk = document.getElementById('trk'), tr = getComputedStyle(trk).display !== 'none' ? R(trk) : null;
    const items = [];
    [...sc.children].forEach((n) => {
      const cs = getComputedStyle(n); if (cs.display === 'none' || parseFloat(cs.opacity) < 0.85 || n.classList.contains('fl') || n.tagName === 'VIDEO') return;
      const r = R(n); if (r.width < 4 || r.height < 4) return;
      const txt = (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 22) || n.id || n.tagName;
      const full = r.width >= 1000 && r.height >= 1800;   // full-frame stroke overlays (rough.js svg)
      if (!full) {
        if (r.left < 140 || r.right > 925) res.push(`SAFE-X "${txt}" ${Math.round(r.left)}..${Math.round(r.right)}`);
        if (r.top < 140) res.push(`SAFE-TOP "${txt}" ${Math.round(r.top)}`);
        if (capOn && r.bottom > cr.top - 4 && r.top < cr.bottom) res.push(`CAPTION-HIT "${txt}" bottom ${Math.round(r.bottom)}`);
        if (tr && r.top < tr.bottom + 6 && r.bottom > tr.top && r.left < tr.right && r.right > tr.left) res.push(`TRACKER-HIT "${txt}"`);
      }
      n.querySelectorAll('*').forEach((c) => {
        if (![...c.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim())) return; const ccs = getComputedStyle(c);
        let op = 1; for (let q = c; q && q !== n; q = q.parentElement) { const qs = getComputedStyle(q); op *= parseFloat(qs.opacity); if (qs.display === 'none') op = 0; }
        if (op < 0.5) return;   // not visible yet (pre-entrance) or faded out
        if (ccs.display !== 'inline' && (c.scrollWidth > c.clientWidth + 3 || c.scrollHeight > c.clientHeight + 4) && ccs.overflow !== 'visible') res.push(`OVERFLOW "${txt}" in "${c.textContent.trim().slice(0, 20)}"`);
        const cr2 = R(c), pr = R(n); if (ccs.display !== 'inline' && cr2.width > 0 && (cr2.right > pr.right + 2 || cr2.left < pr.left - 2)) res.push(`OUT-OF-BOX "${c.textContent.trim().slice(0, 20)}" in "${txt}"`);
      });
      if (!full && (n.textContent || '').trim()) items.push({ txt, l: r.left, t: r.top, r: r.right, b: r.bottom, ov: !!n.dataset.ov });
    });
    for (let a = 0; a < items.length; a++) for (let c = a + 1; c < items.length; c++) { const A = items[a], B = items[c]; if (A.ov || B.ov) continue; const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l), oy = Math.min(A.b, B.b) - Math.max(A.t, B.t); if (ox > 4 && oy > 4) res.push(`OVERLAP "${A.txt}" x "${B.txt}"`); }
    return res;
  }, { t, SC });
  out.forEach((m) => add(m, t));
}
for (const [k, ts] of found) console.log(`${k}  @ ${ts[0].toFixed(2)}s..${ts[ts.length - 1].toFixed(2)}s (${ts.length})`);
console.log('check done:', found.size, 'distinct issues over', dur.toFixed(1), 's');
await b.close(); await srv.close();
