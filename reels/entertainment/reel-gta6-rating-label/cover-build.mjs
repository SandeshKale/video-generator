// Cover: grid-first (central 3:4 safe, key content y 420-1500). Real Miami-night stock footage frame in the style's print grade, red band title, creator chip. Words: STEAMY? READ THE LABEL (4).
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const prof = 'data:image/jpeg;base64,' + b64(join(A, 'brand/nerdlogic-profile.jpg')), win = 'data:image/png;base64,' + b64(join(D, 'tex/cover_window.png'));
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}${font('Inter', 800, join(A, 'fonts/inter/inter-latin-800-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#EFE5D3;position:relative;font-family:Anton}
.win{position:absolute;left:90px;top:430px;width:900px;height:560px;background:url(${win}) center/cover;border:8px solid #17122B}
.band{position:absolute;left:-120px;width:1320px;top:900px;height:290px;background:#F0364F;transform:rotate(-8deg);transform-origin:50% 50%}
.t1{position:absolute;left:0;width:1080px;text-align:center;top:890px;font-size:250px;line-height:1;color:#EFE5D3;transform:rotate(-8deg)}
.t2{position:absolute;left:110px;top:1230px;width:860px;text-align:center;font-size:138px;line-height:1;white-space:nowrap;color:#EFE5D3;background:#17122B;padding:26px 0 0;height:190px}
.tag{display:none;font:800 30px Inter;letter-spacing:.14em;color:#17122B}
.face{position:absolute;right:100px;top:1445px;width:130px;height:130px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #17122B;overflow:hidden;background:#17122B}.face img{width:100%;height:100%;object-fit:cover}
</style><div class=win></div><div class=band></div><div class=t1>STEAMY?</div><div class=t2>READ THE LABEL</div><div class=face><img src="${prof}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
