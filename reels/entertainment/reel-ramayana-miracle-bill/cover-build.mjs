// Cover: grid-first. Two bars (moon trip vs film), title "VFX KA BILL" (3 words), all inside the central 3:4 crop. Rendered once with Playwright.
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const prof = 'data:image/jpeg;base64,' + b64(join(D, 'site/img/profile.jpg'));
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}
${font('Inter', 800, join(A, 'fonts/inter/inter-latin-800-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#02040a;position:relative;font-family:Anton}
.grid{position:absolute;inset:0;background:linear-gradient(rgba(169,216,240,.07) 1px,transparent 1px) 0 0/60px 60px,linear-gradient(90deg,rgba(169,216,240,.07) 1px,transparent 1px) 0 0/60px 60px}
.gl{position:absolute;left:-200px;top:300px;width:800px;height:900px;background:radial-gradient(closest-side,rgba(169,216,240,.3),transparent)}
.gr{position:absolute;right:-200px;top:200px;width:800px;height:1000px;background:radial-gradient(closest-side,rgba(255,178,91,.4),transparent)}
.bar{position:absolute;bottom:760px;width:250px;border:6px solid;box-shadow:0 0 60px currentColor}
.b1{left:215px;height:410px;color:#a9d8f0;background:rgba(169,216,240,.28)}
.b2{left:615px;height:620px;color:#ffb25b;background:rgba(255,178,91,.3)}
.b2 i{position:absolute;left:-6px;right:-6px;top:-70px;height:70px;background:rgba(255,107,136,.45);border:6px solid #ff6b88}
.moon{position:absolute;left:270px;top:560px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e8f6ff,#7aa6bf 60%,#34506a);box-shadow:0 0 50px rgba(169,216,240,.7)}
.n{position:absolute;font:800 64px/1 Inter;letter-spacing:-.02em;text-shadow:0 6px 20px rgba(0,0,0,.8)}
.t1{position:absolute;left:0;width:1080px;text-align:center;top:1180px;font-size:250px;line-height:1;color:#f1f3f8;text-shadow:0 10px 30px rgba(0,0,0,.8)}
.t2{position:absolute;left:0;width:1080px;text-align:center;top:1440px;font-size:250px;line-height:1;color:#ffb25b;text-shadow:0 10px 30px rgba(0,0,0,.8)}
.face{position:absolute;right:110px;top:1650px;width:150px;height:150px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #02040a,0 0 34px rgba(180,240,0,.6);overflow:hidden}.face img{width:100%;height:100%;object-fit:cover}
</style><div class=grid></div><div class=gl></div><div class=gr></div>
<div class=moon></div><div class="bar b1"></div><div class="bar b2"><i></i></div>
<div class=n style="left:215px;width:250px;text-align:center;top:1020px;font-size:50px;color:#a9d8f0">615 CR</div><div class=n style="left:615px;width:250px;text-align:center;top:1020px;color:#ffb25b;font-size:40px">835–900 CR</div>
<div class=t1>VFX KA</div><div class=t2>BILL</div>
<div class=face><img src="${prof}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(500); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
