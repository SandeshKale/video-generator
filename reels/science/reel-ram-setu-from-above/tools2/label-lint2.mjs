// usage: bun tools/label-lint.mjs [step=0.25] : checks the 3D label sprites of the v4 scenes against the safe zone, the caption band and each other
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site3d2'), step = Number(process.argv[2] || .25);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8792);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8792/'); await p.waitForFunction('window.__ready===true', null, { timeout: 90000 }); await p.evaluate(() => { window.__skipRender = true; });
const dur = await p.evaluate(() => window.__reelDurationSec), seen = new Map();
for (let t = 0; t < dur; t += step) { const rs = await p.evaluate(t => { window.__seek(t); return window.__lbRects ? window.__lbRects() : []; }, t);
  rs.forEach((r, i) => { const m = []; if (r.l < 146) m.push('SAFE-L ' + Math.round(r.l)); if (r.r > 922) m.push('SAFE-R ' + Math.round(r.r)); if (r.t < 150) m.push('TOP ' + Math.round(r.t)); if (r.b > 1330) m.push('CAPTION ' + Math.round(r.b));
    rs.forEach((o, j) => { if (j > i && Math.min(r.r, o.r) - Math.max(r.l, o.l) > 8 && Math.min(r.b, o.b) - Math.max(r.t, o.t) > 8) m.push('OVERLAP with #' + j); });
    m.forEach(x => { const k = x.split(' ')[0] + '@' + Math.round(t); if (!seen.has(k)) seen.set(k, `t=${t.toFixed(2)} label#${i} [${r.txt}] ${x}`); }); }); }
for (const v of seen.values()) console.log(v); console.log('label-lint:', seen.size, 'finding(s)'); await b.close(); srv.close();
