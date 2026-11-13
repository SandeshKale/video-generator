// Cover — grid-first (3:4 crop band y 240-1680, <=5 words). Gali ka Game palette: dusk lane, amber = real, pink = AI. Hero = the kid's-eye view of the phone grid (15 AI + 1 ASLI) in the lane, re-framed for the cover.
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), site = join(H, 'site'), A = join(H, '../../../../assets/fonts/');
const mime = { '.json': 'application/json', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary', '.svg': 'image/svg+xml' };
const srv = http.createServer((q, r) => { const f = join(site, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); try { const d = fs.readFileSync(f); r.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } }).listen(8801);
const b = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] }); let p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8801/'); await p.waitForFunction('window.__ready===true', null, { timeout: 90000 });
await p.evaluate(() => { window.__seek(6.6); }); const url = await p.evaluate(() => document.getElementById('gl').toDataURL('image/png')); await p.close();
const prof = fs.readFileSync(join(H, '../../../../assets/brand/nerdlogic-profile.jpg')).toString('base64');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Inter;font-weight:800;src:url(${A}inter/inter-latin-800-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#1b2350}
.hero{position:absolute;left:0;top:130px;width:1080px;height:1920px;background:url(${url}) 0 0/100% 100%}
.t{position:absolute;left:90px;top:270px;font:400 170px/.95 Anton;color:#f1f3f8;letter-spacing:-.005em;text-shadow:0 6px 30px rgba(0,0,0,.8)}.t b{font-weight:400;color:#ff3f8e}.t i{font-style:normal;color:#ffb21e}
.sub{position:absolute;left:94px;top:780px;font:800 38px Inter;letter-spacing:.2em;color:#ffb21e;text-shadow:0 3px 12px rgba(0,0,0,.7)}
.chip{position:absolute;left:300px;top:1545px;height:130px;padding:0 30px 0 210px;display:flex;align-items:center;background:#0a0f1d;border:4px solid #b4f000;border-radius:8px;font:800 44px Inter;color:#eaffd0;white-space:nowrap}.chip em{color:#b4f000;font-style:normal}
.face{position:absolute;left:285px;top:1525px;width:180px;height:180px;border-radius:50%;object-fit:cover;border:8px solid #b4f000;box-shadow:0 0 0 8px #0d1330;z-index:2}
</style><body><div class="hero"></div><div class="t"><i>15</i> / 16<br>PIXEL<br><b>AI KE?</b></div><div class="sub">EK GALI MEIN SAMJHO</div><img class="face" src="data:image/jpeg;base64,${prof}"><div class="chip">nerdlogic<em>.co</em></div></body>`;
fs.writeFileSync(join(H, 'cover.html'), html);
p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(H, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500); await p.screenshot({ path: join(H, 'cover.png') }); await b.close(); srv.close(); console.log('cover ok');
