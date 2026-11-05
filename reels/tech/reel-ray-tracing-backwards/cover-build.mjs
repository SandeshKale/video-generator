// Cover — grid-first rules (3:4 crop band, <=5 words, constant structure). Optical Bench palette: tungsten ground, matte-black card, chalk type, ice reflection ray.
import { writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url)), A = '../../../assets/fonts/';
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Mono;font-weight:600;src:url(site3d/fonts/martian-600.woff2);font-display:block}
:root{--tu:#ffc46b;--ink:#07080b;--ch:#eef2ee;--ice:#7fd6ff;--hot:#fffaf0}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--tu)}
.grid{position:absolute;inset:0;background:linear-gradient(rgba(7,8,11,.1) 2px,transparent 2px) 0 0/90px 90px,linear-gradient(90deg,rgba(7,8,11,.1) 2px,transparent 2px) 0 0/90px 90px}
.card{position:absolute;left:60px;top:470px;width:960px;height:760px;background:var(--ink);border:10px solid var(--ch);box-shadow:16px 18px 0 rgba(7,8,11,.55);overflow:hidden}
svg{position:absolute;left:0;top:0}
.n{position:absolute;left:34px;top:30px;font:400 150px/.95 Anton;color:var(--ch);letter-spacing:-.005em}
.n b{font-weight:400;color:var(--tu)}
.tag{position:absolute;left:60px;top:1290px;padding:16px 28px;background:var(--ink);border:6px solid var(--ch);color:var(--ice);font:600 40px/1 Mono;letter-spacing:.08em}
.face{position:absolute;left:770px;top:1290px;width:215px;height:215px;border-radius:50%;object-fit:cover;border:12px solid var(--ch);box-shadow:0 0 0 10px var(--ink)}
</style><body><div class="grid"></div><div class="card"><svg width="940" height="740" viewBox="0 0 940 740">
<defs><radialGradient id="g" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#9fb4d4"/><stop offset=".7" stop-color="#2b3548"/><stop offset="1" stop-color="#07080b"/></radialGradient><filter id="b"><feGaussianBlur stdDeviation="7"/></filter></defs>
<g stroke="#eef2ee" stroke-opacity=".12" stroke-width="2">${Array.from({length:12},(_,i)=>`<path d="M0 ${380+i*34}H940"/>`).join('')}</g>
<rect x="38" y="470" width="120" height="86" rx="10" fill="#20232b" stroke="#eef2ee" stroke-width="5"/><circle cx="168" cy="513" r="30" fill="#0a1630" stroke="#fffaf0" stroke-width="7"/>
<path d="M198 513 L420 600" stroke="#fffaf0" stroke-width="12" filter="url(#b)" opacity=".8"/><path d="M198 513 L420 600" stroke="#fffaf0" stroke-width="7" stroke-linecap="round"/>
<circle cx="470" cy="610" r="110" fill="url(#g)"/><circle cx="470" cy="610" r="110" fill="none" stroke="#eef2ee" stroke-width="4" opacity=".5"/>
<path d="M436 506 L690 392" stroke="#7fd6ff" stroke-width="12" filter="url(#b)" opacity=".85"/><path d="M436 506 L690 392" stroke="#7fd6ff" stroke-width="7" stroke-linecap="round"/><path d="M690 392 l-26 4 l12 22z" fill="#7fd6ff"/>
<g transform="translate(700 270)"><rect width="190" height="330" fill="#14161d" stroke="#eef2ee" stroke-width="5"/>${Array.from({length:30},(_,i)=>{const r=Math.floor(i/5),c=i%5,on=((i*7+3)%5)<3;return on?`<rect x="${16+c*34}" y="${18+r*50}" width="20" height="28" fill="${i%4?'#ffc46b':'#7fd6ff'}"/>`:''}).join('')}<rect x="-10" y="-14" width="210" height="18" fill="#7fd6ff"/></g>
</svg><div class="n">LIGHT<br><b>ULTI</b> CHALTI<br>HAI</div></div><div class="tag">RAY TRACING</div><img class="face" src="../../../prototypes/reel-app/public/profile.jpg"></body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
