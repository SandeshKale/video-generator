// Cover: grid-first (central 3:4 safe). Dedicated Blender stone render floating on bright water; title "ROCK THAT / FLOATS" (3 words). Palette from the reel: sea teal + amber.
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const prof = 'data:image/jpeg;base64,' + b64(join(A, 'brand/nerdlogic-profile.jpg')), st = 'data:image/png;base64,' + b64(join(D, 'tex/cover_stone.png'));
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:linear-gradient(to bottom,#cfeef5 0%,#8bd3e3 38%,#1b8fa8 70%,#0b4f63 100%);position:relative;font-family:Anton}
.stone{position:absolute;left:0;top:240px;width:1080px;height:1200px;background:url(${st}) center/cover;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 22%,#000 78%,transparent 100%)}
.t1{position:absolute;left:0;width:1080px;text-align:center;top:1085px;font-size:215px;line-height:1;color:#06202b;text-shadow:0 6px 0 rgba(255,255,255,.35)}
.t2{position:absolute;left:230px;width:620px;text-align:center;top:1290px;font-size:215px;line-height:1;color:#06202b;background:#ffb347;padding:16px 0 0;transform:rotate(-2deg)}
.face{position:absolute;right:120px;top:1485px;width:130px;height:130px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #06202b;overflow:hidden}.face img{width:100%;height:100%;object-fit:cover}
</style><div class=stone></div><div class=t1>ROCK THAT</div><div class=t2>FLOATS</div><div class=face><img src="${prof}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
