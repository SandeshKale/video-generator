// Grid-first cover: giant J450-style cylinder with a note fanning out, banned film reel, 4-word title, face chip bottom-right.
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('site/assets/fonts/anton/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'BR';font-weight:800;src:url('site/assets/fonts/bricolage-grotesque/bricolage-grotesque-latin-800-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{position:relative;background:#f3e3c8;font-family:'AN',sans-serif}
.bg{position:absolute;inset:0;background:radial-gradient(620px 620px at 50% 40%,#fff7e8 0,transparent 70%),repeating-linear-gradient(135deg,rgba(226,103,74,.14) 0 22px,transparent 22px 66px),#f3e3c8}
.floor{position:absolute;left:0;right:0;top:960px;height:90px;background:#e1c595}
.band{position:absolute;left:0;right:0;top:1050px;height:520px;background:#2a2438}
.t{position:absolute;left:84px;top:1085px;font-size:214px;line-height:.94;color:#fbf1df;text-transform:uppercase}
.t b{font-weight:400;color:#ffd166}
.face{position:absolute;right:86px;top:1340px;width:196px;height:196px;border-radius:50%;border:10px solid #fbf1df;box-shadow:10px 10px 0 #e2674a;background:url(site/profile.jpg) center/cover}
.note{position:absolute;padding:20px 26px 24px;border-radius:10px;font:800 50px/1.08 'BR',sans-serif;color:#2a2438;box-shadow:0 22px 34px rgba(42,36,56,.28);width:360px}
.note:before{content:'';position:absolute;left:50%;top:-16px;width:110px;height:30px;margin-left:-55px;background:rgba(255,255,255,.7);border-radius:4px}
</style><div class="bg"></div><div class="floor"></div>
<svg style="position:absolute;left:0;top:300px;overflow:visible" width="1080" height="760" viewBox="0 0 1080 760">
 <ellipse cx="330" cy="676" rx="200" ry="26" fill="rgba(42,36,56,.2)"/>
 <g transform="translate(330 362) scale(5)"><rect x="-26" y="-60" width="52" height="120" rx="26" fill="#d9dde3" stroke="#aab1bb" stroke-width="2.4"/><rect x="-26" y="-60" width="52" height="30" rx="15" fill="#c3c9d1"/><circle cx="0" cy="-12" r="16" fill="#2a2438"/><circle cx="0" cy="-12" r="9" fill="#e2674a"/><circle cx="-3.4" cy="-15.4" r="3.4" fill="#fff"/><rect x="-20" y="22" width="40" height="5" rx="2.5" fill="#aab1bb"/></g>
 <g transform="translate(850 190)"><circle r="120" fill="#fff" stroke="#2a2438" stroke-width="14"/><circle r="22" fill="#2a2438"/>${[0,60,120,180,240,300].map((a)=>`<circle cx="${(62*Math.cos(a*Math.PI/180)).toFixed(1)}" cy="${(62*Math.sin(a*Math.PI/180)).toFixed(1)}" r="20" fill="#2a2438"/>`).join('')}<circle r="150" fill="none" stroke="#e2674a" stroke-width="28"/><path d="M-106 -106 L106 106" stroke="#e2674a" stroke-width="28" stroke-linecap="round"/></g>
</svg>
<div class="note" style="left:560px;top:620px;background:#ffd166;transform:rotate(5deg)">Someone walked in</div>
<div class="note" style="left:600px;top:790px;background:#bfe8d7;transform:rotate(-4deg);width:340px">Dog on the couch</div>
<div class="band"></div><div class="t">No <b>video.</b><br>At all.</div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(700);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
