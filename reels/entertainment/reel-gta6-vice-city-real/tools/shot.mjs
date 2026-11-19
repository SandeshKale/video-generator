import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = '/home/user/video-generator/reels/entertainment/reel-gta6-vice-city-real/site';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } }); }).listen(8841);
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto('http://127.0.0.1:8841/' + (process.argv[2] || 'mock.html')); await p.waitForFunction('window.__ready===true', null, { timeout: 60000 });
for (const t of process.argv.slice(3).map(Number)) { await p.evaluate(t => window.__seek(t), t); await p.screenshot({ path: `/tmp/gta6/m/t${t}.png` }); }
await b.close(); srv.close();
