// Cover v2 — hologram-hud palette (near-black navy, violet wireframe, lime = the one ray that counts). Grid-first: 3:4 crop band y 240-1680, <=5 words.
import { writeFileSync, copyFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url)), A = '../../../assets/fonts/';
const sph = (cx, cy, r) => { let s = ''; for (let i = 1; i < 6; i++) { const ry = r * Math.sin(i * Math.PI / 6), y = cy - r * Math.cos(i * Math.PI / 6), rx = Math.sqrt(r * r - (y - cy) ** 2); s += `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${rx * .22}" fill="none" stroke="#b9b2ff" stroke-opacity=".7" stroke-width="3"/>`; } for (let i = 0; i < 6; i++) s += `<ellipse cx="${cx}" cy="${cy}" rx="${r * Math.abs(Math.cos(i * Math.PI / 6))}" ry="${r}" fill="none" stroke="#b9b2ff" stroke-opacity=".7" stroke-width="3"/>`; return s + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eef0ff" stroke-width="5"/>`; };
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Mono;src:url(${A}share-tech-mono/share-tech-mono-latin-400-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#070812}
.dots{position:absolute;inset:0;background:radial-gradient(#4a4488 2.2px,transparent 2.6px) 0 0/54px 54px;opacity:.55}
svg{position:absolute;left:0;top:0}
.t{position:absolute;left:90px;top:250px;font:400 175px/.92 Anton;color:#eef0ff;letter-spacing:-.005em}.t b{font-weight:400;color:#b4f000}
.tag{position:absolute;left:90px;top:1545px;padding:16px 26px;border:4px solid #b4f000;color:#b4f000;font:400 40px/1 Mono;letter-spacing:.12em;background:#070812}
.chip{position:absolute;left:520px;top:1505px;height:130px;padding:0 30px 0 210px;display:flex;align-items:center;background:#0a0f1d;border:4px solid #b4f000;border-radius:8px;font:800 44px Inter,Arial;color:#eaffd0;white-space:nowrap}.chip i{color:#b4f000;font-style:normal}
.face{position:absolute;left:505px;top:1480px;width:180px;z-index:2;height:180px;border-radius:50%;object-fit:cover;border:8px solid #b4f000;box-shadow:0 0 0 8px #070812}
</style><body><div class="dots"></div><svg width="1080" height="1920" viewBox="0 0 1080 1920">
<g transform="translate(0 360)"><defs><filter id="g"><feGaussianBlur stdDeviation="9"/></filter></defs>
<ellipse cx="540" cy="1050" rx="520" ry="120" fill="none" stroke="#7c6cff" stroke-opacity=".6" stroke-width="3"/><ellipse cx="540" cy="1050" rx="380" ry="85" fill="none" stroke="#7c6cff" stroke-opacity=".4" stroke-width="3" stroke-dasharray="18 14"/>
<g stroke="#7c6cff" stroke-width="3" fill="none" stroke-opacity=".9">${[0,1,2,3].map(i=>`<rect x="${760+i*0}" y="${700}" width="0" height="0"/>`).join('')}<path d="M740 1050V760h90v290M850 1050V680h110v370"/><path d="M740 900h90M740 830h90M850 800h110M850 880h110M850 960h110"/></g>
${sph(430, 1000, 150)}
<g filter="url(#g)"><path d="M120 760L400 880" stroke="#eef0ff" stroke-width="12"/><path d="M475 900L790 740" stroke="#b4f000" stroke-width="12"/></g>
<path d="M120 760L400 880" stroke="#eef0ff" stroke-width="7" stroke-linecap="round"/><path d="M475 900L790 740" stroke="#b4f000" stroke-width="7" stroke-linecap="round"/>
<g stroke="#eef0ff" stroke-width="5" fill="none"><path d="M120 735l-48 26 48 26z"/><circle cx="52" cy="761" r="16"/></g>
<g stroke="#b4f000" stroke-width="5"><path d="M792 705l38 38M830 705l-38 38" transform="translate(0 0)"/></g>
</g></svg><div class="t">LIGHT<br>ULTI<br><b>CHALTI</b><br>HAI</div>
<div class="tag">RAY TRACING</div><img class="face" src="../../../assets/brand/nerdlogic-profile.jpg"><div class="chip">nerdlogic<i>.co</i></div></body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch({ args: ['--no-sandbox'] }), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400); await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover ok');
