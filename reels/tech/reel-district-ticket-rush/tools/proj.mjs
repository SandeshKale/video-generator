// usage: bun tools/proj.mjs <t> "x,y,z" ...  -> screen px of world points at time t
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site3d');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8769);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto('http://127.0.0.1:8769/'); await p.waitForFunction('window.__ready===true', null, { timeout: 90000 }); await p.evaluate(() => { window.__skipRender = true; });
const t = Number(process.argv[2]); await p.evaluate(t => window.__seek(t), t);
for (const a of process.argv.slice(3)) { const [x, y, z] = a.split(',').map(Number); console.log(a, '->', await p.evaluate(([x, y, z]) => window.__proj(x, y, z), [x, y, z])); }
await b.close(); srv.close();
