// Grid-first cover: one giant 3D chrome cart in a magenta spotlight on cool store white, receipt-paper title block, face chip bottom-right (clear of the view badge).
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('site/fonts/anton-latin-400-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:#f3f6f8;position:relative;font-family:'AN',sans-serif}
.spot{position:absolute;left:-120px;top:180px;width:1320px;height:1320px;border-radius:50%;background:radial-gradient(circle,#ff2d6f 0 38%,#ff5b8d 38% 50%,#ffd23a 50% 51%,transparent 51.5%)}
.lines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(35,39,45,.06) 0 3px,transparent 3px 90px)}
.cart{position:absolute;left:-20px;top:135px;width:1120px;height:1244px;background:url(site/3d/cart.png) center/contain no-repeat;filter:drop-shadow(0 40px 30px rgba(35,39,45,.45))}
.blk{position:absolute;left:60px;right:60px;top:1080px;height:430px;background:#faf7ee;border:10px solid #23272d;box-shadow:16px 16px 0 #23272d;padding:28px 44px}
.blk:after{content:'';position:absolute;left:-10px;right:-10px;bottom:-34px;height:24px;background:repeating-linear-gradient(135deg,#23272d 0 26px,#ffd23a 26px 52px)}
.t{font-size:162px;line-height:.98;color:#23272d;text-transform:uppercase}.t b{font-weight:400;color:#ff2d6f}
.stk{position:absolute;right:70px;top:430px;width:210px;height:210px;border-radius:50%;background:#ffd23a;border:10px solid #23272d;display:flex;align-items:center;justify-content:center;font-size:170px;color:#23272d;transform:rotate(10deg);box-shadow:8px 8px 0 #23272d}
.face{position:absolute;right:84px;top:1330px;width:170px;height:170px;border-radius:50%;border:10px solid #f3f6f8;box-shadow:10px 10px 0 #23272d;background:url(site/profile.jpg) center/cover;z-index:3}
</style><div class="lines"></div><div class="spot"></div><div class="cart"></div><div class="stk">?</div><div class="blk"><div class="t">AI shops.<br><b>Who pays?</b></div></div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(600);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
