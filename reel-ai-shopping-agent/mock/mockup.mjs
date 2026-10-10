// Throwaway mockup of the "Checkout Lane" system — scenes 1 (3D cart + parallax aisle + kinetic type), 5 (logos + hall-pass/consent UI), 9 (mocap crowd + ring). Delete once the full build supersedes it.
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const here = dirname(fileURLToPath(import.meta.url)), A = '../../assets/fonts/';
const has = (n) => existsSync(join(here, '../shots', n + '.png'));
const bg = (n, alt) => `url(../shots/${has(n) ? n : alt}.png)`;
const stripe = readFileSync(join(here, 'stripe.svg'), 'utf8').replace(/<svg /, '<svg style="height:60px;width:auto" '), shop = readFileSync(join(here, 'shopify.svg'), 'utf8').replace(/<svg /, '<svg style="height:60px;width:auto" ');
const css = `
@font-face{font-family:PJ;font-weight:800;src:url(${A}plus-jakarta-sans/plus-jakarta-sans-latin-800-normal.woff2);font-display:block}
@font-face{font-family:PJ7;font-weight:700;src:url(${A}plus-jakarta-sans/plus-jakarta-sans-latin-700-normal.woff2);font-display:block}
@font-face{font-family:VT;src:url(${A}vt323/vt323-latin-400-normal.woff2);font-display:block}
@font-face{font-family:IN;font-weight:700;src:url(${A}inter/inter-latin-700-normal.woff2);font-display:block}
:root{--wh:#f3f6f8;--am:#ffd23a;--gr:#23272d;--rd:#ff2d6f;--rp:#faf7ee;--mt:#2fd6a3}
*{box-sizing:border-box;margin:0}body{background:#000;display:flex}
.f{position:relative;width:1080px;height:1920px;overflow:hidden;background:#cfd8e0;flex:none;font-family:IN}
.ph{position:absolute;inset:0;background-size:cover;background-position:center}
.grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(35,39,45,.55) 0%,rgba(35,39,45,.08) 30%,rgba(35,39,45,.12) 60%,rgba(35,39,45,.8) 100%)}
.vig{position:absolute;inset:0;box-shadow:inset 0 0 260px 30px rgba(10,14,20,.55)}
.a{position:absolute}
.belt{position:absolute;left:150px;right:150px;top:1276px;height:16px;border-radius:8px;background:repeating-linear-gradient(90deg,#23272d 0 36px,#3a4048 36px 44px);box-shadow:0 0 0 3px rgba(243,246,248,.5)}
.shelf{position:absolute;background:var(--am);color:var(--gr);font:800 28px/1 PJ;letter-spacing:.06em;padding:12px 24px 12px 20px;transform:skewX(-10deg);box-shadow:0 8px 18px rgba(0,0,0,.35)}
.shelf span{display:inline-block;transform:skewX(10deg)}
.bar{position:absolute;right:10px;bottom:-12px;width:90px;height:12px;background:repeating-linear-gradient(90deg,#23272d 0 3px,transparent 3px 6px,#23272d 6px 7px,transparent 7px 11px)}
.big{position:absolute;font:800 112px/.95 PJ;color:var(--wh);letter-spacing:-.03em;text-shadow:0 8px 24px rgba(0,0,0,.55),0 2px 4px rgba(0,0,0,.6)}
.big em{font-style:normal;background:var(--rd);padding:0 16px;border-radius:12px;box-decoration-break:clone}
.sticker{position:absolute;background:var(--rd);color:#fff;font:800 62px/1 PJ;padding:20px 34px;border-radius:50% / 40%;transform:rotate(-6deg);box-shadow:0 14px 30px rgba(0,0,0,.45),inset 0 0 0 5px rgba(255,255,255,.35);letter-spacing:-.01em}
.tag{position:absolute;left:190px;top:1236px;font:700 20px/1 monospace;letter-spacing:.14em;color:#fff;background:rgba(35,39,45,.85);padding:7px 11px;border-radius:6px}
.cap{position:absolute;left:90px;right:90px;top:1310px;text-align:center;font:700 52px/1.1 IN;color:var(--wh);background:var(--gr);padding:18px 26px;border-radius:14px;border-bottom:6px solid var(--rd)}
.cap b{color:var(--am)}
.pos{position:absolute;background:#171a1f;border-radius:34px;padding:22px;box-shadow:0 30px 60px rgba(0,0,0,.55),inset 0 0 0 3px #3a4048}
.scr{background:var(--rp);border-radius:18px;padding:30px 34px;color:#1b1d21}
.row{display:flex;align-items:center;justify-content:space-between;border-top:3px dashed rgba(27,29,33,.25);padding:20px 0;font:800 32px/1 PJ;letter-spacing:.01em}
.tg{width:84px;height:46px;border-radius:23px;background:var(--mt);position:relative}.tg:after{content:"";position:absolute;right:5px;top:5px;width:36px;height:36px;border-radius:50%;background:#fff}
.chip{display:inline-flex;align-items:center;justify-content:center;height:84px;padding:0 26px;border-radius:16px;background:#fff;box-shadow:0 8px 18px rgba(0,0,0,.18);font:800 32px/1 PJ;letter-spacing:.02em;color:#23272d}
.lan{position:absolute;width:520px;height:300px;background:var(--wh);border-radius:26px;box-shadow:0 24px 50px rgba(0,0,0,.5);padding:34px 40px}
.ring{position:absolute;width:380px;height:380px}
`;
const f1 = `<div class="f"><div class="ph" style="background-image:${bg('aisle_dawn', 'aisle_dawn')};background-color:#aab7c2"></div><div class="grade"></div><div class="vig"></div>
<div class="shelf" style="left:190px;top:170px"><span>// THE AISLE, 6 A.M.</span><div class="bar"></div></div>
<div class="big" style="left:190px;top:290px;width:700px">SOON YOU<br>WON'T <em>SHOP.</em></div>
<img class="a" src="cart.png" style="left:150px;top:560px;width:800px;filter:drop-shadow(0 30px 24px rgba(0,0,0,.4))">
<div class="sticker" style="left:560px;top:520px">YOUR AI WILL.</div>
<div class="belt"></div><div class="tag">AI IMAGE · 3D RENDER</div><div class="cap">Soon you won't shop. <b>Your AI will.</b></div></div>`;
const f5 = `<div class="f"><div class="ph" style="background-image:${bg('store_exit', 'aisle_dawn')};background-color:#aab7c2"></div><div class="grade"></div><div class="vig"></div>
<div class="shelf" style="left:190px;top:170px"><span>// A HALL PASS FOR YOUR ASSISTANT</span><div class="bar"></div></div>
<div class="lan" style="left:280px;top:250px;transform:rotate(-4deg)"><div style="width:90px;height:18px;border-radius:9px;background:#23272d;margin:-22px auto 18px"></div><div style="font:700 22px/1 monospace;letter-spacing:.2em;color:#6b7280">AGENT PASS</div><div style="font:800 60px/1.05 PJ;margin-top:14px;color:#23272d">VISITING<br><span style="color:var(--rd)">ASSISTANT</span></div></div>
<div class="pos" style="left:150px;top:600px;width:780px"><div class="scr"><div style="font:400 34px/1 VT;letter-spacing:.14em;color:#6b7280;margin-bottom:14px">SHARED RULEBOOK · CONSENT</div>
<div class="row"><span>WHO YOU ARE</span><div class="tg"></div></div><div class="row"><span>WHAT IT MAY DO</span><div class="tg"></div></div><div class="row"><span>WHAT IT MAY SPEND</span><div class="tg"></div></div></div></div>
<div class="a" style="left:150px;top:1050px;width:780px;display:flex;gap:16px;flex-wrap:wrap"><span class="chip">META</span><span class="chip">WALMART</span><span class="chip">${stripe}</span><span class="chip">${shop}</span></div>
<div class="belt"></div><div class="tag">AI IMAGE · LOGOS IDENTIFY NAMED PARTNERS</div><div class="cap">Sierra and Meta, with Walmart and <b>Stripe</b> on board.</div></div>`;
const f9 = `<div class="f"><div class="ph" style="background-image:${bg('store_exit', 'aisle_dawn')};background-color:#aab7c2"></div><div class="grade"></div><div class="vig"></div>
<div class="shelf" style="left:190px;top:170px"><span>// ONE MISTAKE AND THEY'RE GONE</span><div class="bar"></div></div>
<svg class="ring" style="left:150px;top:290px" viewBox="0 0 380 380"><circle cx="190" cy="190" r="150" fill="none" stroke="rgba(243,246,248,.35)" stroke-width="34"/><circle cx="190" cy="190" r="150" fill="none" stroke="#ff2d6f" stroke-width="34" stroke-linecap="round" stroke-dasharray="565 942" transform="rotate(-90 190 190)"/></svg>
<div class="a" style="left:150px;top:420px;width:380px;text-align:center;font:800 100px/1 PJ;color:var(--wh);text-shadow:0 6px 18px rgba(0,0,0,.6)">6<span style="font-size:46px"> IN </span>10</div>
<div class="shelf" style="left:560px;top:400px"><span>UK SURVEY</span><div class="bar"></div></div>
<svg id="crowd" class="a" style="left:0;top:700px" width="1080" height="560" viewBox="0 0 1080 560"></svg>
<div class="belt"></div><div class="tag">AI IMAGE · MOCAP FIGURES · ILLUSTRATIVE</div><div class="cap">Six in ten say <b>one mistake</b>, and they'd stop using it.</div></div>`;
const html = `<!doctype html><meta charset=utf8><style>${css}</style><body>${f1}${f5}${f9}<script src="mocap.js"></script><script src="rig.js"></script><script>
var C=['#ff2d6f','#2fd6a3','#ffd23a','#5b6cff','#23272d','#ff2d6f','#2fd6a3','#ffd23a','#5b6cff','#23272d'];
var h='';for(var i=0;i<10;i++){var P=RIG.sample('walk',(i*0.37)%2.0,{loop:true,inplace:true});var left=i<6;var x=110+i*95+(i%2)*20,y=520-(i%2)*40,sc=0.62-(i%2)*0.07;
 h+='<g transform="translate('+x+','+y+') scale('+(left?-sc:sc)+','+sc+')" opacity="'+(left?1:0.9)+'">'+RIG.svg(P,'human',{pal:{body:C[i],back:'#14123a55',edge:'#23272d'}})+'</g>';}
document.getElementById('crowd').innerHTML=h;</script>`;
writeFileSync(join(here, 'mock.html'), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 3240, height: 1920 } });
await p.goto('file://' + join(here, 'mock.html')); await p.waitForTimeout(900);
const fr = await p.$$('.f'); for (let i = 0; i < 3; i++) await fr[i].screenshot({ path: join(here, `scene${[1, 5, 9][i]}.png`) });
await b.close(); console.log('ok');
