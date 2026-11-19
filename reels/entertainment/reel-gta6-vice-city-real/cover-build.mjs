// Cover: grid-first (central 3:4 safe). NASA night-lights Florida with a ring on Miami, title "FAKE CITY / REAL PLACE" (4 words).
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const prof = 'data:image/jpeg;base64,' + b64(join(D, 'site/img/profile.jpg')), night = 'data:image/jpeg;base64,' + b64(join(D, 'site/img/fl_night.jpg'));
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#040a14;position:relative;font-family:Anton}
.map{position:absolute;left:-900px;top:-150px;width:1800px;height:1800px;background:url(${night}) center/100% 100%;filter:saturate(1.15) brightness(1.25)}
.shade{position:absolute;left:0;right:0;bottom:0;height:900px;background:linear-gradient(to top,#040a14 25%,rgba(4,10,20,0))}
.ring{position:absolute;left:662px;top:894px;width:300px;height:300px;margin:-150px 0 0 -150px;border:14px solid #ffa21f;border-radius:50%;box-shadow:0 0 50px #ffa21f}
.ring.r2{width:480px;height:480px;margin:-240px 0 0 -240px;opacity:.4;border-width:8px}
.t1{position:absolute;left:0;width:1080px;text-align:center;top:1120px;font-size:190px;line-height:1;color:#eef3f6;text-shadow:0 8px 30px rgba(0,0,0,.8)}
.t2{position:absolute;left:90px;width:900px;text-align:center;top:1320px;font-size:190px;line-height:1;color:#071a2b;background:#ffa21f;padding:12px 0 0}
.face{position:absolute;right:110px;top:1600px;width:150px;height:150px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #040a14;overflow:hidden}.face img{width:100%;height:100%;object-fit:cover}
</style><div class=map></div><div class=shade></div><div class=ring></div><div class="ring r2"></div><div class=t1>FAKE CITY</div><div class=t2>REAL PLACE</div><div class=face><img src="${prof}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
