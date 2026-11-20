// Cover: grid-first (central 3:4 safe). Blender hero (scam phone + MALWARE stamp) with the title "GTA 6 APK? / = VIRUS" (4 words).
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const prof = 'data:image/jpeg;base64,' + b64(join(A, 'brand/nerdlogic-profile.jpg')), hero = 'data:image/png;base64,' + b64(join(D, 'tex/cover_hero.png'));
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#040507;position:relative;font-family:Anton}
.hero{position:absolute;left:0;top:130px;width:1080px;height:1350px;background:url(${hero}) center/cover}
.shade{position:absolute;left:0;right:0;bottom:0;height:760px;background:linear-gradient(to top,#040507 30%,rgba(4,5,7,0))}
.t1{position:absolute;left:0;width:1080px;text-align:center;top:1085px;font-size:215px;line-height:1;color:#f1f3f8;text-shadow:0 8px 30px rgba(0,0,0,.85)}
.t2{position:absolute;left:150px;width:780px;text-align:center;top:1300px;font-size:200px;line-height:1;color:#0b0f13;background:#ff4b3a;padding:14px 0 0;white-space:nowrap}
.face{position:absolute;right:130px;top:1585px;width:140px;height:140px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #070a0d;overflow:hidden}.face img{width:100%;height:100%;object-fit:cover}
</style><div class=hero></div><div class=shade></div><div class=t1>GTA 6 APK?</div><div class=t2>= VIRUS</div><div class=face><img src="${prof}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
