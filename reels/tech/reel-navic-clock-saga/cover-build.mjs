// Grid-first cover for "The clock that broke India's GPS" (Ground Station). The hero (a cracked amber clock dial in front of the night Earth and a satellite) is cover-only.
// bun reels/tech/reel-navic-clock-saga/cover-build.mjs  -> cover.html + cover.png (1080x1920; the profile grid shows y 240-1680)
import { writeFileSync } from 'node:fs'; import { chromium } from 'playwright'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url));
let ticks = ''; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r0 = i % 5 ? 300 : 280, r1 = 322; ticks += `<line x1="${400 + Math.sin(a) * r0}" y1="${400 - Math.cos(a) * r0}" x2="${400 + Math.sin(a) * r1}" y2="${400 - Math.cos(a) * r1}" stroke="#ffb020" stroke-width="${i % 5 ? 4 : 9}"/>`; }
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'Anton';src:url('cover-assets/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'IBM Plex Mono';font-weight:700;src:url('cover-assets/plexmono-700.woff2');font-display:block}
html,body{margin:0;background:#031417}
#c{position:relative;width:1080px;height:1920px;overflow:hidden;background:radial-gradient(ellipse at 50% 36%,#0d3a44 0%,#06222a 55%,#031417 100%);font-family:Anton,sans-serif}
.earth{position:absolute;left:-380px;top:260px;width:1900px;opacity:.55;-webkit-mask-image:radial-gradient(ellipse at 50% 42%,#000 25%,transparent 70%)}
.clk{position:absolute;left:140px;top:360px;width:800px;height:800px;filter:drop-shadow(0 0 60px rgba(255,176,32,.55))}
.sat{position:absolute;left:600px;top:350px;width:640px;transform:rotate(-14deg);filter:drop-shadow(0 20px 40px rgba(0,0,0,.6))}
.t1{position:absolute;left:90px;top:1150px;font-size:200px;line-height:.95;color:#f4efe3;text-shadow:0 8px 30px rgba(0,0,0,.8)}
.t2{position:absolute;left:90px;top:1330px;font-size:220px;line-height:1;color:#1a1000;background:#ffb020;padding:0 30px;transform:skewX(-6deg);transform-origin:0 100%}
.face{position:absolute;left:790px;top:1500px;width:160px;height:160px;border-radius:50%;border:7px solid #f4efe3;box-shadow:0 0 0 6px #ffb020,0 0 50px 8px rgba(255,176,32,.5);overflow:hidden}
.face img{width:100%;height:100%;object-fit:cover}
.num{position:absolute;left:90px;top:440px;font:700 38px 'IBM Plex Mono';letter-spacing:.16em;color:#55b8ff;border:3px solid #55b8ff;padding:8px 18px;background:rgba(3,20,23,.75)}
</style><div id="c">
<img class="earth" src="cover-assets/earth-a.png">
<svg class="clk" viewBox="0 0 800 800"><circle cx="400" cy="400" r="352" fill="#031417" fill-opacity=".92" stroke="#ffb020" stroke-width="22"/>${ticks}
<line x1="400" y1="400" x2="400" y2="150" stroke="#ffb020" stroke-width="22" stroke-linecap="round"/><line x1="400" y1="400" x2="560" y2="470" stroke="#f4efe3" stroke-width="18" stroke-linecap="round"/><circle cx="400" cy="400" r="26" fill="#ffb020"/>
<path d="M610 120 L520 300 L590 330 L470 520 L540 560 L430 760" fill="none" stroke="#ff4a3d" stroke-width="12" stroke-linejoin="round"/><path d="M520 300 L440 280 M470 520 L380 500" fill="none" stroke="#ff4a3d" stroke-width="8"/></svg>
<img class="sat" src="cover-assets/sat.png">
<div class="num">№ 02</div>
<div class="t1">GPS LOST</div><div class="t2">ITS CLOCK</div>
<div class="face"><img src="cover-assets/profile.jpg"></div>
</div>`;
writeFileSync(join(H, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(H, 'cover.html')); await p.waitForTimeout(900); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: join(H, 'cover.png') }); await b.close(); console.log('cover ok');
