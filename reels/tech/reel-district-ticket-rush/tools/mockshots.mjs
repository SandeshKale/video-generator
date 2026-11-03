// usage: bun tools/mockshots.mjs M1:1 M1:2 ... -> /tmp/scr/dmock/<scene>_<step>.png
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site3d');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'mock.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8771);
fs.mkdirSync('/tmp/scr/dmock', { recursive: true });
const b = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 300)); });
await p.goto('http://127.0.0.1:8771/'); await p.waitForFunction('window.__ready===true', null, { timeout: 90000 });
for (const a of process.argv.slice(2)) { const [s, st] = a.split(':'); await p.evaluate(([s, st]) => window.__mock(s, +st), [s, st]); await p.screenshot({ path: `/tmp/scr/dmock/${s}_${st}.png` }); console.log('ok', a); }
await b.close(); srv.close();
