// Cover — grid-first rules. Showtime palette: hot magenta ground, ivory ticket, stage black, cyan system. <=5 words: "SAMAY RAINA" stub + "12,569" + "AAPKE AAGE".
import { writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url)), A = '../../../assets/fonts/';
let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
// a row of blocky (voxel) people, ink silhouettes with cyan heads, standing below the ticket
let ppl = ''; for (let i = 0; i < 17; i++) { const x = 20 + i * 62 + (rnd() - .5) * 14, sc = .9 + rnd() * .35, col = i % 5 === 2 ? '#22e1ff' : '#07080c'; ppl += `<div class="p" style="left:${x}px;transform:scale(${sc});transform-origin:50% 100%"><b class="h" style="background:${i % 5 === 2 ? '#07080c' : '#22e1ff'}"></b><b class="bd" style="background:${col}"></b><b class="lg"></b></div>`; }
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Bungee;src:url(site3d/fonts/bungee-400.woff2);font-display:block}
:root{--mag:#ff2d78;--ink:#07080c;--ivo:#f6f2e8;--cy:#22e1ff}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--mag)}
.dots{position:absolute;inset:0;background:radial-gradient(circle,rgba(7,8,12,.16) 3px,transparent 3.5px) 0 0/42px 42px}
.beam{position:absolute;top:-100px;width:260px;height:1400px;background:linear-gradient(rgba(255,255,255,.28),transparent);transform-origin:50% 0;clip-path:polygon(40% 0,60% 0,100% 100%,0 100%)}
.tk{position:absolute;left:70px;top:520px;width:940px;height:540px;background:var(--ivo);transform:rotate(-5deg);box-shadow:16px 20px 0 var(--ink);
 -webkit-mask:radial-gradient(circle 44px at 0 50%,transparent 98%,#000 100%),radial-gradient(circle 44px at 100% 50%,transparent 98%,#000 100%);-webkit-mask-composite:source-in;mask-composite:intersect}
.tkb{position:absolute;left:70px;top:520px;width:940px;height:540px;transform:rotate(-5deg)}
.n{position:absolute;left:40px;top:70px;font:400 252px/1 Anton;color:var(--ink);letter-spacing:-.01em}
.ah{position:absolute;left:46px;top:360px;font:400 135px/1 Anton;color:var(--mag);letter-spacing:.005em;white-space:nowrap}
.perf{position:absolute;right:236px;top:40px;bottom:40px;border-left:8px dashed var(--ink);opacity:.55}
.stub{position:absolute;right:0;top:0;bottom:0;width:236px;background:var(--ink);display:flex;align-items:center;justify-content:center}
.stub span{display:block;transform:rotate(90deg);white-space:nowrap;font:400 54px/1 Bungee;color:var(--cy);letter-spacing:.04em}
.row{position:absolute;left:0;right:0;top:1130px;height:300px}
.p{position:absolute;bottom:0;width:44px;height:200px}
.p b{position:absolute;display:block;left:50%;transform:translateX(-50%)}
.p .h{width:30px;height:30px;top:0}.p .bd{width:42px;height:78px;top:34px}.p .lg{width:32px;height:52px;top:116px;background:#07080c}
.gnd{position:absolute;left:0;right:0;top:1430px;height:12px;background:var(--ink)}
.face{position:absolute;left:760px;top:1262px;width:230px;height:230px;border-radius:50%;object-fit:cover;border:12px solid var(--ivo);box-shadow:0 0 0 10px var(--ink)}
</style><body><div class="dots"></div><div class="beam" style="left:60px;transform:rotate(14deg)"></div><div class="beam" style="left:780px;transform:rotate(-16deg)"></div>
<div class="tk"></div>
<div class="tkb"><div class="n">12,569</div><div class="ah">AAPKE AAGE</div><div class="perf"></div><div class="stub"><span>SAMAY RAINA</span></div></div>
<div class="row">${ppl}</div><div class="gnd"></div><img class="face" src="../../../prototypes/reel-app/public/profile.jpg"></body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
