// Lint every 0.1 s of the loop: text outside the canvas or its panel, text smaller than 17 px, text-on-text overlaps
// (packets/glows are exempt: they are moving dots, not text). Also reports how many sampled frames change.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.goto('file://' + new URL('./index.html', import.meta.url).pathname); await p.waitForTimeout(800);
const seen = new Map(); let moving = 0, prev = '';
for (let i = 0; i < 100; i++) {
  const t = i / 10;
  const r = await p.evaluate((t) => { window.__seek(t);
    const vis = (e) => { for (let n = e; n && n.tagName !== 'svg'; n = n.parentNode) if (n.getAttribute && n.getAttribute('opacity') === '0') return false; return true; };
    const tx = [...document.querySelectorAll('text')].filter((e) => e.textContent.trim() && vis(e) && !(e.closest('.aul') && e.getBoundingClientRect().top < 300)).map((e) => { const r = e.getBoundingClientRect(); return { s: e.textContent, x: r.left, y: r.top, r: r.right, b: r.bottom, fs: +e.getAttribute('font-size') }; });
    const out = [];
    tx.forEach((a, i) => { if (a.x < 14 || a.r > 1066 || a.y < 8 || a.b > 1342) out.push('bounds ' + a.s); if (a.fs < 17) out.push('small ' + a.s);
      if (a.x > 818 && a.x < 1040 && a.r > 1038) out.push('audit-overflow ' + a.s);
      tx.slice(i + 1).forEach((c) => { if (a.x < c.r - 2 && c.x < a.r - 2 && a.y < c.b - 3 && c.y < a.b - 3) out.push('text-overlap ' + a.s + ' | ' + c.s); }); });
    return { out, sig: document.getElementById('s').innerHTML.length + '|' + [...document.querySelectorAll('circle,rect,g')].map((e) => (e.getAttribute('transform') || '') + (e.getAttribute('opacity') || '') + (e.getAttribute('x') || '') + (e.getAttribute('width') || '')).join('').length + document.getElementById('s').innerHTML.slice(-3000) }; }, t);
  r.out.forEach((o) => { if (!seen.has(o)) seen.set(o, []); seen.get(o).push(t); }); if (r.sig !== prev) moving++; prev = r.sig;
}
for (const [k, ts] of seen) console.log(k, '@', ts[0].toFixed(1), '..', ts[ts.length - 1].toFixed(1), `(${ts.length})`);
console.log(seen.size ? seen.size + ' findings' : 'no text findings', '· changing frames', moving, '/100');
await b.close();
