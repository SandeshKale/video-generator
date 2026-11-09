// usage: bun tools/poses.mjs "t|px,py,pz|lx,ly,lz|fov" ...  -> /tmp/scr/qcr/p_<i>.png
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site3d');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8795);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto('http://127.0.0.1:8795/'); await p.waitForFunction('window.__ready===true', null, { timeout: 90000 });
let i = 0; for (const a of process.argv.slice(2)) { const [t, pp, ll, f] = a.split('|'); await p.evaluate(([t, pp, ll, f]) => { window.__camO = { p: pp.split(',').map(Number), l: ll.split(',').map(Number), f: Number(f) }; window.__seek(Number(t)); }, [t, pp, ll, f]); await p.screenshot({ path: `/tmp/scr/qcr/p_${i++}.png` }); }
await b.close(); srv.close();
