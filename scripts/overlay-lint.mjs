// usage: bun scripts/overlay-lint.mjs <reel-site-dir> [step=0.25]
// Quality-floor lint for any reel page that exposes window.__seek: samples the timeline and checks every visible DOM element inside #stage
// (except canvases and elements marked data-ov / data-mq) for: SAFE (outside x 150-918, y 150-1536), CAP (hits the caption band #cap) and OVERLAP (two overlay boxes intersect).
// Pages may set window.__skipRender=true support to skip WebGL work. Deliberate overlays: mark the element data-ov="1".
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const dir = path.resolve(process.argv[2] || '.'), STEP = Number(process.argv[3] || .25);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.webm': 'video/webm', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const f = path.join(dir, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(0);
const port = srv.address().port, b = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] }), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto(`http://127.0.0.1:${port}/`); await p.waitForFunction('window.__ready===true', null, { timeout: 90000 }); await p.evaluate(() => { window.__skipRender = true; });
const DUR = await p.evaluate(() => window.__reelDurationSec), seen = new Map(); let n = 0;
for (let t = 0; t < DUR; t += STEP) {
  const f = await p.evaluate(t => { window.__seek(t); const st = document.getElementById('stage'), cap = document.getElementById('cap'), cr = cap && cap.firstElementChild ? cap.firstElementChild.getBoundingClientRect() : null; const out = [], items = [];
    st.querySelectorAll('*').forEach(e => { if (e.closest('canvas,#vig,#flash,#cap,[data-ov],[data-mq],svg')) return; if (!e.children.length && !(e.textContent || '').trim() && e.tagName !== 'IMG') return; if (e.children.length && e.tagName !== 'IMG') { const own = Array.from(e.childNodes).some(c => c.nodeType === 3 && c.textContent.trim()); if (!own && !/(card|tag|scope|ask)/.test(e.className || '')) return; }
      let o = 1, q = e; while (q && q !== st) { const cs = getComputedStyle(q); if (cs.display === 'none') { o = 0; break; } o *= +cs.opacity; q = q.parentElement; } if (o < .25) return; const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return; if (r.right < 0 || r.left > 1080 || r.bottom < 0 || r.top > 1920) return; items.push({ k: ((e.textContent || e.tagName) + '').trim().replace(/\s+/g, ' ').slice(0, 26), x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, e }); });
    items.forEach(a => { if (a.x0 < 146 || a.x1 > 922 || a.y0 < 138 || a.y1 > 1540) out.push(['SAFE', a.k, Math.round(a.x0) + ',' + Math.round(a.y0) + ',' + Math.round(a.x1) + ',' + Math.round(a.y1)]); if (cr && a.x0 < cr.right && a.x1 > cr.left && a.y0 < cr.bottom && a.y1 > cr.top && cr.width > 2) out.push(['CAP', a.k, Math.round(a.y0) + '-' + Math.round(a.y1)]); });
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) { const a = items[i], c = items[j]; if (a.e.contains(c.e) || c.e.contains(a.e)) continue; const w = Math.min(a.x1, c.x1) - Math.max(a.x0, c.x0), h = Math.min(a.y1, c.y1) - Math.max(a.y0, c.y0); if (w > 6 && h > 6) out.push(['OVERLAP', a.k + ' x ' + c.k, Math.round(w) + 'x' + Math.round(h)]); }
    return out; }, t);
  f.forEach(x => { const key = x[0] + '|' + x[1]; if (!seen.has(key)) seen.set(key, { t, x }); }); n++;
}
for (const [, v] of seen) console.log('t=' + v.t.toFixed(2), v.x.join(' '));
console.log(`overlay-lint: ${seen.size} unique finding(s) over ${n} samples (${DUR.toFixed(1)} s, step ${STEP})`);
await b.close(); srv.close();
