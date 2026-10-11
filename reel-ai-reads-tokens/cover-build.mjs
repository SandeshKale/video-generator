// Grid-first cover: newsprint + halftone, giant Blender letterpress block split into SAND | ESH (the reel's hook), pastel token
// chips, ink title block "AI CAN'T READ." in Anton, face chip bottom-right. ≤5 words. Run: bun cover-build.mjs
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('site/fonts/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'PM';font-weight:700;src:url('site/fonts/ibm-plex-mono-latin-700-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:#f3efe4;position:relative;font-family:'AN',sans-serif}
.ht{position:absolute;inset:0;background:radial-gradient(circle,rgba(23,23,26,.13) 3px,transparent 3.4px) 0 0/30px 30px;-webkit-mask:radial-gradient(ellipse at 50% 38%,transparent 30%,#000 75%)}
.glow{position:absolute;left:-120px;top:360px;width:1320px;height:760px;background:radial-gradient(ellipse at 50% 50%,rgba(196,181,255,.55),transparent 62%)}
.blk{position:absolute;left:-60px;top:380px;width:1200px;height:768px;background:url(site/3d/sand_11.png) center/contain no-repeat;filter:drop-shadow(0 30px 30px rgba(23,23,26,.35))}
.ch{position:absolute;font:700 40px/1 PM;padding:12px 18px;border:4px solid #17171a;box-shadow:7px 7px 0 #17171a}
.t2{position:absolute;left:400px;top:400px;transform:rotate(-5deg);background:#fbf8f0;font:400 66px/1 AN;padding:10px 22px;border:5px solid #17171a;box-shadow:9px 9px 0 #17171a}
.blk2{position:absolute;left:60px;right:60px;top:1080px;height:440px;background:#17171a;padding:28px 46px;box-shadow:16px 16px 0 #c4b5ff}
.t{font-size:200px;line-height:.98;color:#f3efe4;text-transform:uppercase}.t b{font-weight:400;background:#ffc79a;color:#17171a;padding:0 16px}
.face{position:absolute;right:84px;top:1330px;width:170px;height:170px;border-radius:50%;border:10px solid #f3efe4;box-shadow:10px 10px 0 #9be8cf;background:url(site/profile.jpg) center/cover;z-index:3}
</style><div class="ht"></div><div class="glow"></div><div class="blk"></div>
<div class="t2">2 TOKENS</div>
<div class="blk2"><div class="t">AI can't<br><b>read.</b></div></div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(900);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
