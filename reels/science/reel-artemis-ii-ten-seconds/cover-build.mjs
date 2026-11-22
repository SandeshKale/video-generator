// Cover: grid-first (central 3:4 safe, key content y 420-1500). Four real NASA frames of the same second under an orange T+ clock, title ONE LIFTOFF. SIX CAMERAS. (4 words). Credit: footage NASA.
import { chromium } from 'playwright'; import fs from 'node:fs'; import { join, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url)), A = join(D, '../../../assets'), b64 = p => fs.readFileSync(p).toString('base64');
const font = (fam, w, f) => `@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(f)});font-display:block}`;
const img = n => 'data:image/jpeg;base64,' + b64(join(D, 'tex', n + '.jpg')), prof = 'data:image/jpeg;base64,' + b64(join(A, 'brand/nerdlogic-profile.jpg'));
const html = `<!doctype html><meta charset=utf-8><style>
${font('Anton', 400, join(A, 'fonts/anton/anton-latin-400-normal.woff2'))}${font('Mono', 700, join(A, 'fonts/ibm-plex-mono/ibm-plex-mono-latin-700-normal.woff2'))}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#06080A;position:relative;font-family:Anton}
.clk{position:absolute;left:150px;top:430px;width:780px;height:210px;background:#FF5B1F;color:#06080A;font-size:150px;line-height:250px;text-align:center;letter-spacing:.02em}
.lab{position:absolute;left:170px;top:440px;font:700 24px Mono;color:#06080A;letter-spacing:.08em}
.g{position:absolute;left:150px;top:660px;width:780px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.g div{height:262px;background-size:cover;background-position:center;border:2px solid #26303A;position:relative}
.g span{position:absolute;left:8px;top:8px;background:#06080A;color:#F2F5F7;font:700 20px Mono;padding:4px 10px 4px 28px}
.g span:before{content:"";position:absolute;left:8px;top:8px;width:12px;height:12px;background:#FF5B1F}
.t1{position:absolute;left:150px;top:1225px;font-size:122px;line-height:1;color:#FF5B1F}
.t2{position:absolute;left:150px;top:1350px;font-size:122px;line-height:1;color:#F2F5F7}
.face{position:absolute;right:162px;top:1370px;width:110px;height:110px;border-radius:50%;border:6px solid #b4f000;box-shadow:0 0 0 6px #06080A;overflow:hidden}.face img{width:100%;height:100%;object-fit:cover}
</style><div class=clk>T+00:02</div><div class=lab>ARTEMIS II · 1 APR 2026</div>
<div class=g><div style="background-image:url(${img('vab')});background-position:40% 40%"><span>VAB ROOF</span></div><div style="background-image:url(${img('flag')})"><span>FLAG</span></div><div style="background-image:url(${img('wb')})"><span>WB-57</span></div><div style="background-image:url(${img('orion')});background-position:50% 40%"><span>ORION CAM</span></div></div>
<div class=t1>ONE LIFTOFF.</div><div class=t2>SIX CAMERAS.</div><div class=face><img src="${prof}"></div></html>`;
fs.writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(600); await p.screenshot({ path: join(D, 'cover.png') }); await b.close(); console.log('cover ok');
