// Layout lint for reel #01: safe zone, caption band, and overlaps between text-bearing components (sampled every 0.5 s, 0.6 s after each scene entrance).
import { chromium } from 'playwright';
import { serveDir } from '../../scripts/static-server.mjs';
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto(`${srv.url}/index.html`); await p.waitForFunction(() => window.__ready === true, null, { timeout: 90000 });
const SEL = '.hl .w,.chip,.tag,.lab,.panel,.peepcard,.phone,.arrowcard,#next12,#fol12,#thumb,.hand,#tick12,#endt > div,#cap';
const out = new Map();
for (let t = 0.3; t < 29.6; t += 0.5) {
  await p.evaluate((t) => window.__seek(t), t);
  const r = await p.evaluate((SEL) => {
    const res = []; document.querySelectorAll(SEL).forEach((e) => {
      const sc = e.closest('.scene'); if (sc && sc.style.display === 'none') return; let o = 1, n = e; while (n && n.id !== 'stage') { o *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; } if (o < .5) return;
      const x = e.getBoundingClientRect(); if (x.width < 2) return; const id = (e.id || e.className.toString().split(' ')[0] || e.tagName) + (e.textContent ? ':' + e.textContent.trim().slice(0, 16) : '');
      res.push({ id, L: x.left, T: x.top, R: x.right, B: x.bottom, cap: !!e.closest('#cap') || e.id === 'cap', tr: !!sc && getComputedStyle(sc).transform !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(getComputedStyle(sc).transform) });
    }); return res; }, SEL);
  for (const a of r) { if (a.tr) continue; const bad = [];
    if (a.L < 146 || a.R > 922) bad.push('X'); if (a.T < 138 || a.B > 1538) bad.push('Y'); if (!a.cap && a.B > 1345 && a.T < 1490 && !/chip/.test(a.id)) bad.push('CAPBAND');
    if (bad.length) { const k = a.id + ' ' + bad.join(','); if (!out.has(k)) out.set(k, []); out.get(k).push(t.toFixed(1)); } }
  for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { const a = r[i], c = r[j]; if (a.tr || c.tr || a.cap || c.cap) continue;
    const w = Math.min(a.R, c.R) - Math.max(a.L, c.L), h = Math.min(a.B, c.B) - Math.max(a.T, c.T); if (w > 14 && h > 14) { const k = `OVERLAP ${a.id} × ${c.id}`; if (!out.has(k)) out.set(k, []); out.get(k).push(t.toFixed(1)); } }
}
for (const [k, v] of out) console.log(k, '@', v.slice(0, 6).join(','), v.length > 6 ? `(+${v.length - 6})` : '');
console.log('issues:', out.size); await b.close(); process.exit(0);
