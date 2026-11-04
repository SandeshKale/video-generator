// Cover — grid-first rules. Survey Sheet palette: signal-orange ground, deep ink, chalk, turquoise contours. Words: "99.98%", "UNDERWATER", "RAM SETU".
import { writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url)), A = '../../../assets/fonts/';
let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
// contour bands around a wavy ridge, plus laser photon dots
let paths = ''; for (let k = 0; k < 9; k++) { const off = k * 26; let up = '', dn = ''; for (let i = 0; i <= 40; i++) { const x = 20 + i * 22, y = 300 + Math.sin(i * .35) * 70 + i * 3; up += `${i ? 'L' : 'M'}${x},${y - 20 - off} `; dn += `${i ? 'L' : 'M'}${x},${y + 20 + off} `; } paths += `<path d="${up}" /><path d="${dn}" />`; }
let ridge = ''; for (let i = 0; i <= 40; i++) { const x = 20 + i * 22, y = 300 + Math.sin(i * .35) * 70 + i * 3; ridge += `${i ? 'L' : 'M'}${x},${y} `; }
let dots = ''; for (let i = 0; i < 90; i++) { const t = rnd(), x = 20 + t * 880, y = 300 + Math.sin(t * 40 * .35) * 70 + t * 40 * 3 + (rnd() - .5) * 60; dots += `<circle cx="${x}" cy="${y}" r="${3 + rnd() * 3}" fill="#ff7a1a"/>`; }
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Mono;font-weight:600;src:url(site3d/fonts/martian-700.woff2);font-display:block}
:root{--or:#ff7a1a;--ink:#06141f;--ch:#eef2ee;--tq:#3fd0c9}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--or)}
.grid{position:absolute;inset:0;background:linear-gradient(rgba(6,20,31,.12) 2px,transparent 2px) 0 0/90px 90px,linear-gradient(90deg,rgba(6,20,31,.12) 2px,transparent 2px) 0 0/90px 90px}
.card{position:absolute;left:60px;top:470px;width:960px;height:760px;background:var(--ink);border:10px solid var(--ch);box-shadow:16px 18px 0 rgba(6,20,31,.55);overflow:hidden}
svg{position:absolute;left:20px;top:150px}
.n{position:absolute;left:30px;top:-6px;font:400 282px/1 Anton;color:var(--ch);letter-spacing:-.01em}
.t{position:absolute;left:34px;top:560px;font:400 150px/1 Anton;color:var(--or);white-space:nowrap}
.tag{position:absolute;left:60px;top:1290px;padding:16px 28px;background:var(--ink);border:6px solid var(--ch);color:var(--tq);font:600 40px/1 Mono;letter-spacing:.08em}
.face{position:absolute;left:770px;top:1290px;width:215px;height:215px;border-radius:50%;object-fit:cover;border:12px solid var(--ch);box-shadow:0 0 0 10px var(--ink)}
</style><body><div class="grid"></div><div class="card"><svg width="940" height="520" viewBox="0 0 940 520"><g fill="none" stroke="#3fd0c9" stroke-width="2.5" opacity=".75">${paths}</g><path d="${ridge}" fill="none" stroke="#eef2ee" stroke-width="10" stroke-linecap="round"/>${dots}</svg><div class="n">99.98%</div><div class="t">UNDERWATER</div></div><div class="tag">RAM SETU</div><img class="face" src="../../../prototypes/reel-app/public/profile.jpg"></body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
