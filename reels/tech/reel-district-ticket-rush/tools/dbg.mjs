import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root='/home/user/video-generator/reels/tech/reel-district-ticket-rush/site3d';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8780);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8780/'); await p.waitForFunction('window.__ready===true'); await p.evaluate(()=>{window.__skipRender=true});
for (const t of process.argv.slice(2).map(Number)) console.log(t, JSON.stringify(await p.evaluate(t=>{window.__seek(t);return window.__lbRects().map(r=>[r.txt,Math.round(r.l),Math.round(r.r),Math.round(r.t),Math.round(r.b)])},t)));
await b.close(); srv.close();
