// usage: bun v2/tools/view.mjs name px py pz tx ty tz fov [t]  -> /tmp/scr/gta2/v_<name>.png
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8797);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 300)); });
await p.goto('http://127.0.0.1:8797/'); await p.waitForFunction('window.__ready===true', null, { timeout: 90000 });
const views = JSON.parse(process.argv[2]);
for (const v of views) { await p.evaluate(v => window.__view(v.p, v.q, v.f, v.t), v); await p.screenshot({ path: `/tmp/scr/gta2/v_${v.n}.png` }); }
await b.close(); srv.close();
