// Grid-first cover: the reel's data-blue on brushed metal, the finished Blender rack (all 4 blocks patched and lit) as the
// hero over a candlestick chart, graphite title block "TRADING BOT CAN'T PANIC." (4 words) in Anton, face chip bottom-right. Run: bun cover-build.mjs
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
function candles(){let r=11,p=60;const B=[],R=()=>{r=(r*16807)%2147483647;return r/2147483647};for(let i=0;i<22;i++){const op=p,cl=p+(R()-.3)*8,hi=Math.max(op,cl)+R()*3,lo=Math.min(op,cl)-R()*3;p=cl;B.push([op,hi,lo,cl])}
const mx=Math.max(...B.map(b=>b[1])),mn=Math.min(...B.map(b=>b[2])),Y=v=>790-(v-mn)/(mx-mn)*760;let o='<svg width="100%" height="100%" viewBox="0 0 1000 800" preserveAspectRatio="none">';
B.forEach((b,i)=>{const x=24+i*45.5,c=b[3]>=b[0]?'#3ee07a':'#ff4d4d';o+='<line x1="'+x+'" x2="'+x+'" y1="'+Y(b[1])+'" y2="'+Y(b[2])+'" stroke="'+c+'" stroke-width="5"/><rect x="'+(x-14)+'" y="'+Math.min(Y(b[0]),Y(b[3]))+'" width="28" height="'+Math.max(6,Math.abs(Y(b[0])-Y(b[3])))+'" rx="3" fill="'+c+'" stroke="#0b2a66" stroke-width="3"/>'});return o+'</svg>'}
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('site/fonts/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'CP';font-weight:700;src:url('site/fonts/chakra-petch-latin-700-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:radial-gradient(ellipse at 50% 36%,#5b9bff 0,#2f7bff 38%,#123a8c 100%);position:relative;font-family:'AN',sans-serif}
.br{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 4px)}
.rk{position:absolute;left:150px;top:560px;width:780px;height:640px;background:url(site/3d/rack_4.png) center/contain no-repeat;filter:drop-shadow(0 34px 40px rgba(0,0,0,.45))}
.bd{position:absolute;left:150px;top:560px;transform:rotate(-4deg);background:#141619;color:#7ee02a;font:700 54px/1 CP;padding:12px 22px;border-radius:8px;box-shadow:0 12px 24px rgba(0,0,0,.4)}
.blk{position:absolute;left:60px;right:60px;top:1080px;height:440px;background:#141619;border-radius:14px;padding:44px 46px;box-shadow:0 22px 50px rgba(0,0,0,.45)}
.blk:before{content:"";position:absolute;left:30px;right:30px;top:-3px;height:7px;background:repeating-linear-gradient(90deg,#7ee02a 0 34px,transparent 34px 48px)}
.t{font-size:136px;line-height:1.1;color:#eef1f4;text-transform:uppercase}.t b{font-weight:400;color:#141619;background:#7ee02a;padding:0 16px;display:inline-block;line-height:1.08;margin-top:6px}
.face{position:absolute;right:84px;top:1330px;width:170px;height:170px;border-radius:50%;border:10px solid #eef1f4;box-shadow:0 0 0 6px #7ee02a;background:url(site/profile.jpg) center/cover;z-index:3}
.cd{position:absolute;left:40px;top:280px;width:1000px;height:560px;opacity:.95;filter:drop-shadow(0 8px 14px rgba(0,0,0,.3))}
</style><div class="br"></div><div class="cd">${candles()}</div><div class="rk"></div><div class="bd">4 BLOCKS</div>
<div class="blk"><div class="t">Trading bot<br><b>can't panic.</b></div></div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(900);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
