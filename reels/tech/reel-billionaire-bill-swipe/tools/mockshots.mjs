import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site3d'); fs.mkdirSync('/tmp/scr/bmock', { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'mock.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8791);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto('http://127.0.0.1:8791/'); await p.waitForFunction('window.__ready===true', null, { timeout: 60000 });
for (const a of process.argv.slice(2)) { const [n, v] = a.split(':'); await p.evaluate(([n, v]) => window.__mock(n, v), [n, v || '']); await p.screenshot({ path: `/tmp/scr/bmock/${n}${v || ''}.png` }); console.log('ok', a); }
await b.close(); srv.close();
