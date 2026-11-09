import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root='/home/user/video-generator/reels/tech/reel-spam-call-roast/site3d';
const srv = http.createServer((q, r) => { const f = path.join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { r.writeHead(200); r.end(fs.readFileSync(f)); } catch { r.writeHead(404); r.end(); } }).listen(8795);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8795/'); await p.waitForFunction('window.__ready===true'); await p.evaluate(()=>{window.__skipRender=true});
const dur = await p.evaluate(()=>window.__reelDurationSec); for (let t=0;t<dur;t+=2) await p.evaluate(t=>window.__seek(t),t);
const ws = await p.evaluate(()=>window.__ws); for (const [k,v] of Object.entries(ws)) console.log(k.padEnd(28), v[0]==='MISS'?'MISS':'    ', v[0], 't=',v[1], 'sent', v[2], '-', v[3]); await b.close(); srv.close();
