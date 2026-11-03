// dumps window.EV (sound events defined by the page) and the scene boundaries -> audio/events.json
import { chromium } from 'playwright'; import { pathToFileURL } from 'node:url'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url'; import { writeFileSync } from 'node:fs'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '..', 'site3d');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8781);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8781/'); await p.waitForFunction('window.__ready===true', null, { timeout: 60000 });
const d = await p.evaluate(() => ({ ev: window.EV, dur: window.__reelDurationSec, B: window.__B }));
writeFileSync(join(H, '..', 'audio', 'events.json'), JSON.stringify(d, null, 1)); console.log(d.ev.length, 'events', d.dur); await b.close(); srv.close();
