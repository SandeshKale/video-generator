// Strict layout lint for this reel (pages are plain DOM, not #fx layers). Per page child: (1) overlaps (stamp×card is the one deliberate overlay),
// (2) safe zone x 150..918, y 170..1272, (3) caption hits, (4) text overflow, (5) rig figure clipped by its stage, (6) headline vs content.
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const step = Number(process.argv[2] || 0.25), a0 = Number(process.argv[3] || 0), a1 = Number(process.argv[4] || 1e9);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__seek, null, { timeout: 90000 });
const dur = await p.evaluate(() => window.__reelDurationSec), starts = await p.evaluate(() => window.DATA.scenes.map((s) => s.start));
const found = new Map(); const add = (k, t) => { if (!found.has(k)) found.set(k, []); found.get(k).push(t); };
for (let t = a0; t < Math.min(dur, a1); t += step) {
  const out = await p.evaluate(({ t, starts }) => {
    window.__seek(t); const res = [], R = (n) => n.getBoundingClientRect();
    const si = starts.filter((s) => t >= s).length - 1; if (t - starts[si] < 0.7 && si > 0) return res;
    const pg = document.getElementById('p' + si); const items = [];
    [...pg.children].forEach((n) => {
      const cs = getComputedStyle(n); if (cs.display === 'none' || parseFloat(cs.opacity) < 0.85) return;
      if (n.tagName.toLowerCase()==='svg') return; const r = R(n); if (r.width < 2) return;
      const kind = n.classList.contains('stampp') ? 'stamp' : n.classList.contains('chip') ? 'chip' : (n.classList.contains('room')||n.classList.contains('hostwin')||n.classList.contains('pad')||n.classList.contains('cta')) ? 'card' : n.classList.contains('h') ? 'head' : n.classList.contains('eb') ? 'eyebrow' : 'other';
      // transform overshoot is judged on the settled box only
      items.push({ kind, txt: (n.textContent || '').trim().slice(0, 18), l: r.left, t: r.top, r: r.right, b: r.bottom, n });
      if (kind !== 'other' && (r.left < 148 || r.right > 920)) res.push(`SAFE-X ${kind} "${(n.textContent || '').trim().slice(0, 18)}" ${Math.round(r.left)}..${Math.round(r.right)}`);
      if (r.bottom > 1274 && kind !== 'other') res.push(`SAFE-Y ${kind} "${(n.textContent || '').trim().slice(0, 18)}" bottom ${Math.round(r.bottom)}`);
      n.querySelectorAll('*').forEach((c) => { if ([...c.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) && c.scrollWidth > c.clientWidth + 3 && getComputedStyle(c).display !== 'inline' && !(c instanceof SVGElement)) res.push(`TEXT-OVERFLOW ${kind} "${(c.textContent || '').trim().slice(0, 20)}"`); });
      // rig figures clipped by their stage
      n.querySelectorAll('div').forEach((st) => { const sv = st.querySelector(':scope > svg'); if (!sv || st.dataset.noclip) return; const g = sv.firstChild.lastChild; if (!g || g.nodeName !== 'g') return; const gr = R(g), sr = R(st); if (gr.width < 2) return;
        if (gr.left < sr.left - 6 || gr.right > sr.right + 6 || gr.top < sr.top - 6 || gr.bottom > sr.bottom + 6) res.push(`FIGURE-CLIPPED in ${kind} "${(n.textContent || '').trim().slice(0, 14)}" (${Math.round(gr.left - sr.left)},${Math.round(gr.top - sr.top)})-(${Math.round(gr.right - sr.right)},${Math.round(gr.bottom - sr.bottom)})`); });
    });
    const pad = pg.querySelector('.pad'); if (pad) { const pr = pad.getBoundingClientRect(); const ns = [...pad.querySelectorAll('.note')].filter((n) => parseFloat(n.style.opacity || 0) > 0.9 && t - parseFloat(n.dataset.at || 0) > 0.6).map((n) => ({ n, r: n.getBoundingClientRect() }));
      ns.forEach(({ n, r }) => { if (r.left < pr.left + 6 || r.right > pr.right - 6 || r.bottom > pr.bottom - 6 || r.top < pr.top + 4) res.push(`NOTE-OUT-OF-PAD "${n.textContent.slice(0, 22)}"`); });
      for (let a = 0; a < ns.length; a++) for (let c = a + 1; c < ns.length; c++) { const A = ns[a].r, B = ns[c].r; const ox = Math.min(A.right, B.right) - Math.max(A.left, B.left), oy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top); if (ox > 18 && oy > 14) res.push(`NOTE-OVERLAP "${ns[a].n.textContent.slice(0, 16)}" × "${ns[c].n.textContent.slice(0, 16)}" (${Math.round(ox)}×${Math.round(oy)})`); } }
    for (let a = 0; a < items.length; a++) for (let c = a + 1; c < items.length; c++) {
      const A = items[a], B = items[c]; const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l), oy = Math.min(A.b, B.b) - Math.max(A.t, B.t);
      if (ox > 4 && oy > 4) { const ks = [A.kind, B.kind].sort().join('×'); if (ks === 'card×stamp') continue; res.push(`OVERLAP ${A.kind} "${A.txt}" × ${B.kind} "${B.txt}" (${Math.round(ox)}×${Math.round(oy)} at y≈${Math.round(Math.max(A.t, B.t))})`); }
    }
    const cap = document.getElementById('cap'), ci = document.getElementById('capin');
    if (parseFloat(cap.style.opacity || 0) > 0.5) { const cr = R(ci); items.forEach((i) => { if (i.b > cr.top - 4 && i.t < cr.bottom) res.push(`CAPTION-HIT ${i.kind} "${i.txt}" bottom ${Math.round(i.b)}`); }); if (cr.height > 190) res.push(`CAPTION-3-LINES ${Math.round(cr.height)}`); }
    return res;
  }, { t, starts });
  out.forEach((m) => add(m.replace(/\(-?\d+,-?\d+\)-\(-?\d+,-?\d+\)/, '').replace(/\(\d+×\d+ at y≈\d+\)/, '').replace(/bottom \d+/, ''), t));
}
for (const [k, ts] of found) console.log(`${k}  @ ${ts[0].toFixed(2)}s..${ts[ts.length - 1].toFixed(2)}s (${ts.length})`);
console.log('check done:', found.size, 'distinct issues over', dur.toFixed(1), 's');
await b.close(); await srv.close();
