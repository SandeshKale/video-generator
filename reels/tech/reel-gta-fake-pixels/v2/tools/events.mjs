import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site');
const mime = { '.json': 'application/json', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8799);
const b = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('PE', e.message));
await p.goto('http://127.0.0.1:8799/'); await p.waitForFunction('window.__ready===true', null, { timeout: 90000 });
const d = await p.evaluate(() => ({ ev: window.EV, dur: window.__reelDurationSec, B: window.B.SCN.map(function (s) { return s.t0; }).concat([window.__reelDurationSec]), ws: window.__ws || [] }));
fs.writeFileSync(join(H, '..', 'audio', 'events.json'), JSON.stringify(d, null, 1)); console.log(d.ev.length, 'events', d.dur, 'misses:', d.ws.join(' ; ')); await b.close(); srv.close();
