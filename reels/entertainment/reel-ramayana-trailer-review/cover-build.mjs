// Cover: split-screen of the two entrances (bright villain / dark hero). Designed inside the 3:4 grid crop (y 240-1680), <=5 words.
import { chromium } from '../../../node_modules/playwright/index.mjs';
import path from 'node:path'; import { pathToFileURL } from 'node:url';
const U=p=>pathToFileURL(path.resolve(p)).href, F=f=>U('../../../assets/fonts/'+f);
const html=`<meta charset=utf-8><style>@font-face{font-family:Anton;src:url('${F('anton/anton-latin-400-normal.woff2')}')}@font-face{font-family:JB;font-weight:700;src:url('${F('jetbrains-mono/jetbrains-mono-latin-700-normal.woff2')}')}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;background:#12100d;position:relative;overflow:hidden}
.a,.b{position:absolute;left:0;width:1080px;overflow:hidden}.a{top:240px;height:760px;clip-path:polygon(0 0,100% 0,100% 82%,0 100%)}.b{top:760px;height:920px;clip-path:polygon(0 18%,100% 0,100% 100%,0 100%)}
.a img{width:1500px;margin-left:-300px;margin-top:-10px}.b img{width:1500px;margin-left:-330px;margin-top:-50px;filter:brightness(1.5) contrast(1.1)}
.line{position:absolute;left:-40px;top:905px;width:1200px;height:12px;background:#ffb703;transform:rotate(-4.6deg);box-shadow:0 0 30px #ffb703}
h1{position:absolute;left:90px;right:90px;top:1130px;font:400 170px/.95 Anton;text-transform:uppercase;color:#f3ecdc;text-shadow:0 6px 22px rgba(0,0,0,.85)}h1 b{color:#ff4d2e;font-weight:400}
.t1,.t2{position:absolute;font:700 34px JB;letter-spacing:.12em;padding:8px 16px;background:#12100d;color:#ffb703}.t1{left:90px;top:300px}.t2{left:90px;top:1000px;color:#ff4d2e}
.chip{position:absolute;left:90px;top:1560px;display:flex;align-items:center;gap:18px;font:700 34px JB;color:#f3ecdc;text-shadow:0 2px 8px #000}.chip img{width:90px;height:90px;border-radius:50%;border:5px solid #ffb703;object-fit:cover}</style>
<div class="a"><img src="${U('frames/g_42.png')}"></div><div class="b"><img src="${U('frames/g_68.png')}"></div><div class="line"></div>
<div class="t1">0:39 · RAVANA</div><div class="t2">1:13 · RAM</div><h1>Who walks in <b>first?</b></h1>
<div class="chip"><img src="${U('../../../prototypes/reel-app/public/profile.jpg')}">@sandesh_explains</div>`;
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
await pg.setContent(html);await pg.waitForTimeout(800);
// setContent has no file base: load via goto instead
import fs from 'node:fs';fs.writeFileSync('out/cover.html',html);await pg.goto(U('out/cover.html'));await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(600);
await pg.screenshot({path:'cover.png'});await b.close();
