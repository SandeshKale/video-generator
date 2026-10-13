// Grid-first cover: banknote-cream ground, the reel's Blender lightbox (dots lit by the lamp) as the hero object tilted like a print,
// a green "WATERMARK FOUND" stamp (illustrative, as in the reel) slammed across it, the navy title block "IS THIS CLIP AI?" (Anton,
// 4 words), the "3 STEPS" corner badge and the face chip bottom-right, same slots as the earlier covers. Run: bun cover-build.mjs
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('../assets/fonts/anton/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'CH';font-weight:700;src:url('site/fonts/chivo-mono-latin-700-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{position:relative;background:#f2ead3;background-image:repeating-linear-gradient(0deg,rgba(14,107,90,.12) 0 2px,transparent 2px 22px),repeating-linear-gradient(90deg,rgba(19,36,61,.06) 0 2px,transparent 2px 30px)}
.ros{position:absolute;left:-180px;top:1100px;width:520px;height:520px;border-radius:50%;background:repeating-radial-gradient(circle,rgba(14,107,90,.2) 0 2px,transparent 2px 14px)}
.hero{position:absolute;left:70px;top:330px;width:940px;height:700px;transform:rotate(-3deg);border:8px solid #13243d;border-radius:26px;overflow:hidden;box-shadow:0 0 0 14px #faf4e0,0 0 0 20px #13243d,0 40px 70px rgba(19,36,61,.4);background:#13243d url(site/3d/lightbox/b14.png) center 40%/118% auto no-repeat}
.stamp{position:absolute;left:300px;top:690px;transform:rotate(-8deg);font:700 66px/1.1 CH;letter-spacing:.06em;color:#0e6b5a;text-align:center;border:11px double #0e6b5a;border-radius:16px;padding:20px 30px;background:rgba(250,244,224,.96);box-shadow:0 18px 40px rgba(19,36,61,.4)}
.stamp small{display:block;font-size:22px;letter-spacing:.2em;margin-top:8px;opacity:.85}
.bd{position:absolute;left:70px;top:200px;transform:rotate(-4deg);background:#e2412c;color:#f6efdc;font:700 50px/1 CH;letter-spacing:.06em;padding:14px 24px;border-radius:8px;box-shadow:0 12px 24px rgba(19,36,61,.35)}
.blk{position:absolute;left:60px;right:60px;top:1100px;height:400px;background:#13243d;border-radius:14px;padding:44px 46px;box-shadow:0 22px 50px rgba(19,36,61,.5);border-top:8px solid #c9962b}
.t{font:400 150px/1.05 AN;color:#f6efdc;text-transform:uppercase}.t b{font-weight:400;color:#f6efdc;background:#e2412c;padding:0 16px;display:inline-block;line-height:1.04;margin-top:8px}
.face{position:absolute;right:84px;top:1330px;width:170px;height:170px;border-radius:50%;border:10px solid #f6efdc;box-shadow:0 0 0 6px #c9962b,0 14px 30px rgba(0,0,0,.45);background:url(site/photos/profile.jpg) center/cover;z-index:3}
</style><div class="ros"></div><div class="hero"></div><div class="stamp">WATERMARK<br>FOUND<small>ILLUSTRATIVE</small></div><div class="bd">3 STEPS</div>
<div class="blk"><div class="t">Is this<br><b>clip AI?</b></div></div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(900);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
