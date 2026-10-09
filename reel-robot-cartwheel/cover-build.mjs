// Grid-first cover: one giant mid-flip robot (solid) chasing the human's pink outline, 4-word title, face chip bottom-right (clear of the view badge).
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('site/assets/fonts/anton/anton-latin-400-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:#ffd23f;position:relative;font-family:'AN',sans-serif}
.rays{position:absolute;left:-300px;top:60px;width:1680px;height:1680px;border-radius:50%;background:repeating-conic-gradient(from 0deg at 50% 50%,#ffc61a 0 7.5deg,#ffd23f 7.5deg 15deg);-webkit-mask:radial-gradient(circle at 50% 50%,#000 0,#000 36%,transparent 62%);mask:radial-gradient(circle at 50% 50%,#000 0,#000 36%,transparent 62%);transform:translate(0,-230px)}
.dots{position:absolute;inset:0;background:radial-gradient(circle,rgba(16,20,38,.2) 3px,transparent 3.2px) 0 0/54px 54px}
.band{position:absolute;left:0;right:0;top:1040px;height:540px;background:#101426;border-top:12px solid #101426}
.band:before{content:'';position:absolute;left:0;right:0;top:-34px;height:22px;background:repeating-linear-gradient(135deg,#ff3d7f 0 26px,#101426 26px 52px)}
.hero{position:absolute;left:0;top:250px}
.t{position:absolute;left:84px;top:1085px;font-size:206px;line-height:.94;color:#f5f7fa;text-transform:uppercase;text-shadow:0 8px 0 rgba(0,0,0,.35)}
.t b{font-weight:400;color:#ff3d7f}
.face{position:absolute;right:86px;top:1345px;width:196px;height:196px;border-radius:50%;border:10px solid #f5f7fa;box-shadow:10px 10px 0 #ff3d7f;background:url(site/profile.jpg) center/cover}
</style><div class="rays"></div><div class="dots"></div><svg class="hero" width="1080" height="780" viewBox="0 0 1080 780" id="hero"></svg><div class="band"></div>
<div class="t">Human did<br>it <b>first</b></div><div class="face"></div>
<script src="site/mocap.js"></script><script src="site/rig.js"></script><script>
var G=750,s='';
s+='<path d="M60 620 C 300 150, 700 150, 960 580" fill="none" stroke="#101426" stroke-width="8" stroke-dasharray="4 22" stroke-linecap="round" opacity=".55"/>';
s+='<line x1="30" y1="'+G+'" x2="1050" y2="'+G+'" stroke="#101426" stroke-width="12"/>';
// speed lines behind the human frames
[[40,300],[70,380],[30,470],[90,560]].forEach(function(q){s+='<line x1="'+q[0]+'" y1="'+q[1]+'" x2="'+(q[0]+110)+'" y2="'+q[1]+'" stroke="#101426" stroke-width="8" stroke-linecap="round" opacity=".35"/>';});
// human mocap-suit frames: solid, growing opacity, all different phases of the same cartwheel
[[.9,130,.5],[1.3,285,.65],[1.7,440,.8],[2.1,595,1]].forEach(function(q){var P=RIG.sample('cart',q[0],{inplace:true});s+='<g transform="translate('+q[1]+' '+G+') scale(.78)" opacity="'+q[2]+'">'+RIG.svg(P,'human')+'</g>';});
// landing dust where hands/feet meet the floor
[[100,.5],[250,.6],[420,.7]].forEach(function(q){s+='<circle cx="'+q[0]+'" cy="'+(G-6)+'" r="26" fill="#ff3d7f" opacity="'+q[1]+'"/>';});
// the robot: big, front, mid-cartwheel
var big=RIG.sample('cart',2.15,{inplace:true});
s+='<g transform="translate(850 '+G+') scale(1.5)">'+RIG.svg(big,'robot')+'</g>';
document.getElementById('hero').innerHTML=s;
</script>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(600);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
