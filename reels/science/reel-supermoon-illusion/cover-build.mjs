// Cover: grid-first (central 3:4 safe). A Blender-rendered Moon with a +14% ring (NASA's maximum) and the title "BIG MOON? / 14% TRUE" (4 words).
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const prof = 'data:image/jpeg;base64,' + b64(join(A, 'brand/nerdlogic-profile.jpg')), moon = 'data:image/png;base64,' + b64(join(D, 'tex/cover_moon.png'));
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:radial-gradient(circle at 50% 36%,#16286b 0%,#0b1230 55%,#05081c 100%);position:relative;font-family:Anton}
.moon{position:absolute;left:215px;top:350px;width:650px;height:650px;background:url(${moon}) center/cover;filter:drop-shadow(0 0 60px rgba(243,231,201,.35))}
.ring{position:absolute;left:182px;top:317px;width:716px;height:716px;border:8px solid #ff9d2e;border-radius:50%;box-shadow:0 0 40px rgba(255,157,46,.7)}
.tag{position:absolute;left:640px;top:268px;font:700 40px 'Anton';letter-spacing:.06em;color:#05081c;background:#ff9d2e;padding:8px 22px 0;transform:rotate(-4deg)}
.t1{position:absolute;left:0;width:1080px;text-align:center;top:1085px;font-size:210px;line-height:1;color:#f3e7c9;text-shadow:0 8px 30px rgba(0,0,0,.8)}
.t2{position:absolute;left:150px;width:780px;text-align:center;top:1300px;font-size:210px;line-height:1;color:#05081c;background:#ff9d2e;padding:14px 0 0}
.face{position:absolute;right:130px;top:1585px;width:140px;height:140px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #05081c;overflow:hidden}.face img{width:100%;height:100%;object-fit:cover}
</style><div class=moon></div><div class=ring></div><div class=tag>+14% MAX</div><div class=t1>BIG MOON?</div><div class=t2>14% TRUE</div><div class=face><img src="${prof}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
