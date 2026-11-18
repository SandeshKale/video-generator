// Cover: grid-first. Two PMO portraits, each stamped with the same ₹18 CR, title "SAME PRICE. SAME DEAL?" (4 words). Rendered once with Playwright.
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const img = n => 'data:image/jpeg;base64,' + b64(join(D, 'site/img', n));
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}
${font('Teko', 700, join(A, 'fonts/teko/teko-latin-700-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#0c0f14;position:relative;font-family:Anton}
.glowL{position:absolute;left:-300px;top:200px;width:900px;height:1300px;background:radial-gradient(closest-side,rgba(42,109,244,.55),transparent)}
.glowR{position:absolute;right:-300px;top:200px;width:900px;height:1300px;background:radial-gradient(closest-side,rgba(224,36,58,.55),transparent)}
.card{position:absolute;width:420px;height:590px;border-radius:14px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.65)}
.card img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.card.l{left:110px;top:470px;border:8px solid #2a6df4;transform:rotate(-4deg)}.card.r{left:550px;top:500px;border:8px solid #e0243a;transform:rotate(4deg)}
.amt{position:absolute;padding:4px 22px 0;background:rgba(12,15,20,.9);border-radius:10px;font:700 150px/1 Teko;color:#f4f1e8;text-shadow:0 8px 26px rgba(0,0,0,.75);letter-spacing:-1px}
.amt small{font-size:60px;letter-spacing:.06em;margin-left:8px}
.eq{position:absolute;left:0;width:1080px;top:880px;text-align:center;font:700 170px/1 Teko;color:#f5b82e;text-shadow:0 8px 26px rgba(0,0,0,.8)}
.t1{position:absolute;left:100px;top:1130px;font-size:180px;line-height:1;color:#f4f1e8;text-shadow:0 8px 28px rgba(0,0,0,.7);text-transform:uppercase}
.t2{position:absolute;left:100px;top:1318px;font-size:180px;line-height:1;color:#10131a;background:#f5b82e;padding:0 24px;text-transform:uppercase}
.face{position:absolute;right:110px;top:1510px;width:150px;height:150px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #0c0f14,0 0 34px rgba(180,240,0,.6);overflow:hidden}.face img{width:100%;height:100%;object-fit:cover}
</style><div class=glowL></div><div class=glowR></div>
<div class="card l"><img src="${img('hardik-pmo-crop.jpg')}"></div><div class="card r"><img src="${img('arshdeep-pmo-crop.jpg')}"></div>
<div class=amt style="left:150px;top:900px;color:#8fb4ff;border:5px solid #2a6df4">₹18<small>CR</small></div><div class=amt style="left:610px;top:920px;color:#ff7f90;border:5px solid #e0243a">₹18<small>CR</small></div>
<div class=t1>Same price.</div><div class=t2>Same deal?</div>
<div class=face><img src="${img('profile.jpg')}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(500); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
