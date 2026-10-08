import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(800);
let bad = 0; const seen = new Set(); let moving = 0;
for (let t = 0; t < 8; t += 0.25) {
  const r = await p.evaluate((t) => { window.__seek(t);
    const tx = [...document.querySelectorAll('text')].filter((e) => !e.closest('[opacity="0"]')).map((e) => { const r = e.getBoundingClientRect(); return { s: e.textContent, x: r.left, y: r.top, r: r.right, b: r.bottom, fs: +e.getAttribute('font-size') }; });
    const out = [];
    tx.forEach((a, i) => { if (a.x < 24 || a.r > 1576 || a.y < 12 || a.b > 888) out.push('bounds ' + a.s); if (a.fs < 18) out.push('small ' + a.s);
      tx.slice(i + 1).forEach((c) => { if (a.x < c.r - 1 && c.x < a.r - 1 && a.y < c.b - 1 && c.y < a.b - 1) out.push('text-overlap ' + a.s + ' | ' + c.s); }); });
    // trains over text
    document.querySelectorAll('g[transform] > rect[width="68"]').forEach((tr) => { const q = tr.getBoundingClientRect();
      tx.forEach((a) => { if (q.left < a.r - 2 && a.x < q.right - 2 && q.top < a.b - 2 && a.y < q.bottom - 2) out.push('train-over-text ' + a.s); }); });
    const sig = [...document.querySelectorAll('g[transform],circle,line,rect')].map((e) => e.getAttribute('transform') || e.getAttribute('cx') || e.getAttribute('opacity') || '').join('|');
    return { out, sig }; }, t);
  r.out.forEach((o) => seen.add(o)); bad += r.out.length;
  if (t > 0) { if (r.sig !== globalThis.prev) moving++; } globalThis.prev = r.sig;
}
console.log([...seen].join('\n')); console.log('findings:', bad, 'distinct:', seen.size, 'changing frames:', moving + '/31');
const n = await p.evaluate(() => { const a = {}; window.__seek(1); document.querySelectorAll('g,circle,line,rect').forEach((e, i) => { a[i] = (e.getAttribute('transform') || '') + (e.getAttribute('cx') || '') + (e.getAttribute('opacity') || '') + (e.getAttribute('stroke-width') || ''); }); window.__seek(3.1); let c = 0; document.querySelectorAll('g,circle,line,rect').forEach((e, i) => { if (a[i] !== (e.getAttribute('transform') || '') + (e.getAttribute('cx') || '') + (e.getAttribute('opacity') || '') + (e.getAttribute('stroke-width') || '')) c++; }); return c; });
console.log('animated elements between t=1 and t=3.1:', n);
await b.close();
