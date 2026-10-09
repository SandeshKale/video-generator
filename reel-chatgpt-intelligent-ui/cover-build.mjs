// Grid-first cover: one giant Cursor mascot about to press a huge cobalt button, torn grey text wall behind it, 3-word title, face chip bottom-right.
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('site/assets/fonts/anton/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'FR';font-weight:700;src:url('site/assets/fonts/fredoka/fredoka-latin-700-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{position:relative;background:#eaf1ff;font-family:'AN',sans-serif}
.bg{position:absolute;inset:0}
.wf{position:absolute;border:4px solid #c3d0f2;border-radius:30px;background:rgba(255,255,255,.4)}
.wf.f{border:5px solid #14182b;box-shadow:8px 8px 0 #14182b}
.wall{position:absolute;left:60px;top:560px;width:520px;height:560px;border:5px solid #8b95b8;border-radius:34px;background:#f3f6ff;box-shadow:10px 10px 0 #8b95b8;transform:rotate(-7deg);overflow:hidden}
.wall i{position:absolute;left:36px;height:20px;border-radius:10px;background:#aeb7d3}
.btn{position:absolute;left:300px;top:500px;width:640px;height:200px;border:8px solid #14182b;border-radius:100px;background:#2b50ff;box-shadow:14px 14px 0 #14182b;color:#f3f6ff;font:700 104px/184px 'FR';text-align:right;padding-right:64px;transform:rotate(2deg)}
.band{position:absolute;left:0;right:0;top:1060px;height:500px;background:#14182b}
.t{position:absolute;left:78px;top:1080px;font-size:236px;line-height:.98;color:#eef2ff;text-transform:uppercase;letter-spacing:-.005em}
.t b{font-weight:400;color:#ffe14d}
.face{position:absolute;right:80px;top:1360px;width:200px;height:200px;border-radius:50%;border:10px solid #eef2ff;box-shadow:10px 10px 0 #ff8a1f;background:url(site/profile.jpg) center/cover}
</style><div class="bg">
${[[30,40,300,260,0],[390,10,260,150,0],[760,60,300,300,0],[-60,330,230,300,1],[880,420,230,260,2],[-40,1580,300,300,3],[420,1620,300,280,0],[780,1600,300,280,4]].map((b,i)=>`<div class="wf${b[4]?' f':''}" style="left:${b[0]}px;top:${b[1]}px;width:${b[2]}px;height:${b[3]}px;${b[4]?'background:'+['#','#b9c7ff','#ffcf9f','#fff0a0','#b9c7ff'][b[4]]:''}"></div>`).join('')}</div>
<div class="wall">${[60,104,148,220,264,308,352,424,468,512,556].map((y,i)=>`<i style="top:${y}px;right:${[110,40,170,40,70,40,230,40,100,40,260][i]}px"></i>`).join('')}<div style="position:absolute;right:-40px;top:-20px;width:200px;height:200px;background:linear-gradient(225deg,#eaf1ff 50%,#d0d8ef 50%);border-bottom-left-radius:34px"></div></div>
<div class="btn">Tap me</div>
<svg style="position:absolute;left:300px;top:575px;overflow:visible" width="384" height="456" viewBox="0 0 160 190"><g transform="rotate(-16 40 40)" style="filter:drop-shadow(14px 16px 0 rgba(20,24,43,.3))">
 <path d="M18 12 L18 150 L52 118 L78 176 L108 163 L82 106 L128 106 Z" fill="#fff" stroke="#14182b" stroke-width="5.5" stroke-linejoin="round"/>
 <ellipse cx="48" cy="62" rx="17" ry="17" fill="#fff" stroke="#14182b" stroke-width="4"/><ellipse cx="82" cy="70" rx="15" ry="15" fill="#fff" stroke="#14182b" stroke-width="4"/>
 <circle cx="54" cy="66" r="7" fill="#14182b"/><circle cx="88" cy="74" r="6" fill="#14182b"/><ellipse cx="64" cy="102" rx="12" ry="10" fill="#14182b"/></g></svg>
<div class="band"></div><div class="t">Chat box.<br><b>Gone.</b></div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(800);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
