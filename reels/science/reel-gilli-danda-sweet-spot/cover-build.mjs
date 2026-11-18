// Cover: grid-first (central 3:4 safe). A gilli flipping off a stone, force arrow at its end, title "SAHI JAGAH" (2 words).
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const prof = 'data:image/jpeg;base64,' + b64(join(D, 'site/img/profile.jpg'));
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}${font('Inter', 800, join(A, 'fonts/inter/inter-latin-800-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#F1E6D3;position:relative;font-family:Anton}
.ln{position:absolute;left:-200px;right:-200px;height:8px;background:#DCCDB4}
.stone{position:absolute;left:300px;top:1010px;width:260px;height:130px;border-radius:50%;background:#DCCDB4;border:10px solid #8b7c64}
.g{position:absolute;border:10px solid #7a1f10;background:#E8472A;width:520px;height:64px;border-radius:6px}
.g1{left:250px;top:970px;transform:rotate(-24deg)}
.gg{opacity:.28;border-color:#E8472A}
.ar{position:absolute;left:640px;top:620px;width:20px;height:300px;background:#E7B53C;border-radius:6px}.ah{position:absolute;left:615px;top:900px;width:0;height:0;border-left:35px solid transparent;border-right:35px solid transparent;border-top:70px solid #E7B53C}
.t1{position:absolute;left:0;width:1080px;text-align:center;top:1135px;font-size:300px;line-height:1;color:#2A2118}
.t2{position:absolute;left:0;width:1080px;text-align:center;top:1440px;font-size:300px;line-height:1;color:#F1E6D3;background:#E8472A;padding:10px 0 0}
.face{position:absolute;right:110px;top:240px;width:150px;height:150px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #1f1a14;overflow:hidden}.face img{width:100%;height:100%;object-fit:cover}
.tag{position:absolute;left:170px;top:300px;font:800 44px Inter;color:#2A2118;letter-spacing:-.01em}
</style>
<div class="ln" style="top:700px"></div><div class="ln" style="top:1010px;height:12px"></div>
<div class="g gg" style="left:180px;top:690px;transform:rotate(60deg)"></div><div class="g gg" style="left:120px;top:820px;transform:rotate(20deg)"></div>
<div class=stone></div><div class="g g1"></div><div class=ar></div><div class=ah></div>
<div class=tag>force × distance</div>
<div class=t1>SAHI</div><div class=t2>JAGAH</div>
<div class=face><img src="${prof}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(500); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
