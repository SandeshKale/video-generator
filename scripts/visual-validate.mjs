#!/usr/bin/env bun
// STRICT visual validation for site/-style reels (window.__seek + #fx > .c layers). Run before shipping any reel.
// Unlike reel check.mjs (layer boxes, exempts stamp/chips/badge/label/big, skips 1 s of entrance, ignores images/notches)
// this reports: (1) layer-vs-layer overlaps with NO type exemptions, (2) collisions between text/media atoms INSIDE a layer,
// (3) text overflowing its own box / clipped, (4) anything left of 150 or right of 918 (except .notch), (5) caption collisions.
// Usage: bun scripts/visual-validate.mjs <site-dir> [step=0.25] [t0] [t1]     exit code 1 if any finding.
import { chromium } from 'playwright';
import { serveDir } from './static-server.mjs';
const [dir, stepArg, a0, a1] = process.argv.slice(2);
if (!dir) { console.error('usage: visual-validate.mjs <site-dir> [step] [t0] [t1]'); process.exit(2); }
const step = Number(stepArg || 0.25);
const srv = await serveDir(dir);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__seek, null, { timeout: 90000 });
const dur = await p.evaluate(() => window.__reelDurationSec);
const found = new Map();
const add = (k, t) => { k = k.replace(/\(\d+×\d+( px at y≈\d+)?\)/, '').replace(/ x -?\d+\.\.-?\d+/, '').replace(/bottom \d+ vs pill top \d+/, '').replace(/ \(\d+>\d+\)/, ''); if (!found.has(k)) found.set(k, []); found.get(k).push(t); };
for (let t = Number(a0 || 0); t < Math.min(dur, Number(a1 || 1e9)); t += step) {
  const out = await p.evaluate((t) => {
    window.__seek(t);
    const res = [], R = (n) => n.getBoundingClientRect();
    const vis = (n) => { for (let e = n; e && e.id !== 'fx'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.6) return false; } return true; };
    const layers = [];
    document.querySelectorAll('#fx > .c').forEach((w) => {
      if (w.style.display === 'none' || w.dataset.nc) return;
      if (parseFloat(w.style.opacity || 1) < 0.9 || t - parseFloat(w.dataset.t0) < 0.6) return;   // let entrances settle (0.6 s), not 1.0 s
      const atoms = []; let box = null;
      w.querySelectorAll('*').forEach((n) => {
        if (n.classList.contains('notch') || n.tagName === 'IMG' || !vis(n)) return;   // images are clipped by their frame; judged via the frame, not the scaled <img>
        const r = R(n); if (r.width < 2 || r.height < 2) return;
        if (!box) box = { l: r.left, t: r.top, r: r.right, b: r.bottom }; else { box.l = Math.min(box.l, r.left); box.t = Math.min(box.t, r.top); box.r = Math.max(box.r, r.right); box.b = Math.max(box.b, r.bottom); }
        const own = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
        if (own || n.tagName === 'svg') atoms.push({ n, r, own, tag: n.tagName.toLowerCase(), txt: (n.textContent || '').trim().slice(0, 24) });
        // (3) text overflowing its own element or clipped
        if (own && n.scrollWidth > n.clientWidth + 3 && getComputedStyle(n).display !== 'inline') res.push(`TEXT-OVERFLOW ${w.dataset.type} "${(n.textContent || '').trim().slice(0, 28)}" (${n.scrollWidth}>${n.clientWidth})`);
      });
      if (!box) return;
      layers.push({ type: w.dataset.type, box, atoms });
      if (box.l < 148 || box.r > 920) res.push(`SAFE-ZONE ${w.dataset.type} x ${Math.round(box.l)}..${Math.round(box.r)}`);
      // (2) atoms inside the layer that collide (text vs text/media, no ancestor relation)
      for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) {
        const A = atoms[i], B = atoms[j]; if (A.n.contains(B.n) || B.n.contains(A.n)) continue;
        if (!(A.own || B.own)) continue;
        const ox = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left), oy = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
        if (ox > 6 && oy > 6 && (A.own && B.own || ox * oy > 600)) res.push(`INNER-OVERLAP ${w.dataset.type}: "${A.txt}" × "${B.txt}" (${Math.round(ox)}×${Math.round(oy)})`);
      }
    });
    // (1) layer vs layer, no exemptions
    for (let a = 0; a < layers.length; a++) for (let c = a + 1; c < layers.length; c++) {
      const A = layers[a].box, B = layers[c].box;
      const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l), oy = Math.min(A.b, B.b) - Math.max(A.t, B.t);
      if (ox > 4 && oy > 4) res.push(`LAYER-OVERLAP ${layers[a].type} × ${layers[c].type} (${Math.round(ox)}×${Math.round(oy)} px at y≈${Math.round(Math.max(A.t, B.t))})`);
    }
    // (5) caption
    const cap = document.getElementById('cap'), ci = document.getElementById('capin');
    if (parseFloat(cap.style.opacity || 0) > 0.5) { const cr = R(ci); layers.forEach((L) => { if (L.box.b > cr.top - 4 && L.box.t < cr.bottom && L.box.r > cr.left && L.box.l < cr.right) res.push(`CAPTION-HIT ${L.type} bottom ${Math.round(L.box.b)} vs pill top ${Math.round(cr.top)}`); });
      if (cr.height > 190) res.push(`CAPTION-3-LINES height ${Math.round(cr.height)}`); }
    return res;
  }, t);
  out.forEach((k) => add(k, t));
}
let n = 0;
for (const [k, ts] of found) { n++; console.log(`${k}  @ ${ts[0].toFixed(2)}s..${ts[ts.length - 1].toFixed(2)}s (${ts.length} samples)`); }
console.log(`visual-validate: ${n} distinct findings over ${dur.toFixed(1)} s (step ${step})`);
await b.close(); await srv.close(); process.exit(n ? 1 : 0);
