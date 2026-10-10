// Cover on the approved cartwheel-cover template: full-bleed colour + sunburst rays, hero face-off scene on a ground line,
// hazard-stripe edge, dark title block (2 lines, accent word), creator face chip bottom-right. Palette = this reel's riso ultramarine/coral/yellow/ink.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url)); const A = '../assets/fonts/';
let rays = ''; for (let i = 0; i < 24; i++) rays += `<polygon points="540,640 ${540 + 1500 * Math.cos((i * 15 - 3) * Math.PI / 180)},${640 + 1500 * Math.sin((i * 15 - 3) * Math.PI / 180)} ${540 + 1500 * Math.cos((i * 15 + 3) * Math.PI / 180)},${640 + 1500 * Math.sin((i * 15 + 3) * Math.PI / 180)}" fill="#ffffff" opacity=".13"/>`;
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
:root{--bl:#2b3bff;--co:#ff5a36;--yel:#ffd23f;--ink:#14123a;--cr:#f6efe2}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--bl)}
svg.r{position:absolute;inset:0}
.dots{position:absolute;inset:0;background:radial-gradient(rgba(246,239,226,.28) 3px,transparent 3.6px) 0 0/48px 48px}
.arc{position:absolute;left:0;top:0}
.gl{position:absolute;left:0;right:0;top:985px;height:14px;background:var(--ink)}
.hu{position:absolute;left:-20px;top:350px;width:720px;filter:drop-shadow(10px 10px 0 #14123a)}
.ro{position:absolute;left:380px;top:372px;width:720px;transform:scaleX(-1);filter:drop-shadow(-10px 10px 0 #14123a)}
.vs{position:absolute;left:390px;top:480px;width:300px;height:300px;background:var(--yel);clip-path:polygon(50% 0,60% 24%,86% 12%,76% 38%,100% 50%,76% 62%,86% 88%,60% 76%,50% 100%,40% 76%,14% 88%,24% 62%,0 50%,24% 38%,14% 12%,40% 24%)}
.vst{position:absolute;left:390px;top:560px;width:300px;text-align:center;font:400 120px/1 Anton;color:var(--ink)}
.hz{position:absolute;left:0;right:0;top:1000px;height:44px;background:repeating-linear-gradient(135deg,var(--co) 0 28px,var(--ink) 28px 56px)}
.tb{position:absolute;left:0;right:0;top:1044px;height:520px;background:var(--ink)}
.t{position:absolute;left:70px;font-family:Anton;text-transform:uppercase;line-height:.92;white-space:nowrap;color:#f6f2ea}
.t1{top:1090px;font-size:178px}.t2{top:1270px;font-size:178px}.t2 b{color:var(--co);font-weight:400}
.face{position:absolute;left:872px;top:1340px;width:170px;height:170px;border-radius:50%;object-fit:cover;border:10px solid var(--cr);box-shadow:0 0 0 8px var(--co)}
</style><body><svg class="r" viewBox="0 0 1080 1920">${rays}</svg><div class="dots"></div>
<svg class="arc" width="1080" height="1000"><path d="M120 380 Q540 90 960 380" fill="none" stroke="#f6efe2" stroke-width="8" stroke-dasharray="4 22" stroke-linecap="round"/></svg>
<div class="gl"></div><img class="hu" src="site/cover-human_punch.png"><img class="ro" src="site/cover-robot_punch.png"><div class="vs"></div><div class="vst">VS</div>
<div class="hz"></div><div class="tb"></div><div class="t t1">THE ROBOT</div><div class="t t2">DIDN'T <b>FIGHT</b></div>
<img class="face" src="../reel-app/public/profile.jpg"></body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
