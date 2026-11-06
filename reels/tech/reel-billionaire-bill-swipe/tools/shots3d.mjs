// usage: bun tools/shots3d.mjs t1 t2 ...  -> /tmp/scr/qcr/f_<t>.png (serves site3d over http like render.mjs)
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site3d');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8793);
const b = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('CONSOLE', m.text().slice(0, 200)); });
await p.goto('http://127.0.0.1:8793/'); await p.waitForFunction('window.__ready===true', null, { timeout: 20000 });

const t0 = Date.now();
for (const a of process.argv.slice(2)) { const t = Number(a); await p.evaluate(t => window.__seek(t), t); await p.screenshot({ path: `/tmp/scr/qcr/f_${a}.png` }); }
console.log('ms/frame', Math.round((Date.now() - t0) / Math.max(1, process.argv.length - 2)));
await b.close(); srv.close();
