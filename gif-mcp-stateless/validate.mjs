import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(800);
const seen = new Set(); let moving = 0, prev = '';
for (let t = 0; t < 8; t += 0.25) {
  const r = await p.evaluate((t) => { window.__seek(t);
    const tx = [...document.querySelectorAll('text')].filter((e) => !e.getAttribute('textLength') && e.getAttribute('opacity') !== '0').map((e) => { const r = e.getBoundingClientRect(); return { s: e.textContent, x: r.left, y: r.top, r: r.right, b: r.bottom, fs: +e.getAttribute('font-size') }; });
    const out = [];
    tx.forEach((a, i) => { if (a.x < 30 || a.r > 1050 || a.y < 10 || a.b > 1340) out.push('bounds ' + a.s); if (a.fs < 18) out.push('small ' + a.s);
      tx.slice(i + 1).forEach((c) => { if (a.x < c.r - 1 && c.x < a.r - 1 && a.y < c.b - 1 && c.y < a.b - 1) out.push('text-overlap ' + a.s + ' | ' + c.s); }); });
    document.querySelectorAll('rect[width="46"][height="30"]').forEach((e) => { const g = e.parentNode; if (+g.getAttribute('opacity') < .5) return; const q = e.getBoundingClientRect();
      tx.forEach((a) => { if (q.left < a.r - 2 && a.x < q.right - 2 && q.top < a.b - 2 && a.y < q.bottom - 2) out.push('letter-over-text ' + a.s); }); });
    return { out, sig: [...document.querySelectorAll('g[transform],circle,rect,line,path')].map((e) => (e.getAttribute('transform') || '') + (e.getAttribute('opacity') || '') + (e.getAttribute('d') || '')).join('|') }; }, t);
  r.out.forEach((o) => seen.add(o)); if (r.sig !== prev) moving++; prev = r.sig;
}
console.log([...seen].join('\n') || 'no text findings'); console.log('changing frames', moving, '/32');
await b.close();
