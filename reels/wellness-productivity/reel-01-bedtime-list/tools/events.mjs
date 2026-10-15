// Dumps window.EV (the page's own cue list: pane closes, pen strokes, strike, stamp, chips...) to events.json so audio.py aligns SFX to the visuals.
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(process.env.SITE || 'site'); const M = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webm': 'video/webm', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (p.endsWith('/')) p += 'index.html'; fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': M[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); }).listen(0);
const b = await chromium.launch({ args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(`http://127.0.0.1:${srv.address().port}/`); await pg.waitForFunction('window.__ready===true', null, { timeout: 90000 });
const ev = await pg.evaluate(() => ({ EV: window.EV, PEN: window.PEN, NBM: window.NBM, dur: window.__reelDurationSec })); fs.writeFileSync('events.json', JSON.stringify(ev)); console.log('events', ev.EV.length, 'dur', ev.dur);
await b.close(); srv.close();
