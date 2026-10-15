import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(800);
let bad = 0;
for (let t = 0; t < 8; t += 0.25) {
  const r = await p.evaluate((t) => { window.__seek(t);
    const tx = [...document.querySelectorAll('text')].map((e) => { const r = e.getBoundingClientRect(); return { s: e.textContent, x: r.left, y: r.top, r: r.right, b: r.bottom, fs: +e.getAttribute('font-size') }; });
    const out = [];
    tx.forEach((a, i) => { if (a.x < 40 || a.r > 1040 || a.y < 20 || a.b > 1330) out.push('bounds ' + a.s); if (a.fs < 22) out.push('small ' + a.s);
      tx.slice(i + 1).forEach((c) => { if (a.x < c.r - 1 && c.x < a.r - 1 && a.y < c.b - 1 && c.y < a.b - 1) out.push('overlap ' + a.s + ' | ' + c.s); }); });
    return out; }, t);
  if (r.length) { bad += r.length; console.log(t, r); }
}
console.log('findings:', bad); await b.close();
