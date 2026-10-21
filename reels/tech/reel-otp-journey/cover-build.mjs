// Grid-first cover: giant amber OTP + "NEVER SAY THIS CODE" (4 words + the code), everything inside the 3:4 grid window (y 240-1680) and clear of the
// play icon (top-right) and view badge (bottom-left). Backdrop = a still of the reel's own 3D city (dimmed), hero = typographic code that never appears this large in the reel.
import { chromium } from '../../../node_modules/playwright/index.mjs'; import fs from 'node:fs'; import path from 'node:path';
const D = path.dirname(new URL(import.meta.url).pathname); const F = '../../../assets/fonts';
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:AN;src:url(${F}/anton/anton-latin-400-normal.woff2) format('woff2');font-display:block}
@font-face{font-family:PM;font-weight:600;src:url(${F}/ibm-plex-mono/ibm-plex-mono-latin-600-normal.woff2) format('woff2');font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;background:#041016;overflow:hidden;position:relative}
#bg{position:absolute;inset:0;background:url(cover-bg.png) center/cover;filter:saturate(1.25) contrast(1.1) brightness(1.25) blur(1.5px);transform:scale(1.15)}
#sh{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(4,16,22,0) 0,rgba(4,16,22,.7) 80%),linear-gradient(180deg,rgba(4,16,22,.55),rgba(4,16,22,.1) 40%,rgba(4,16,22,.7))}
#chip{position:absolute;left:110px;top:440px;padding:10px 22px;border:4px solid #ff9d3c;border-radius:10px;font:600 34px/1 PM;letter-spacing:.14em;color:#ff9d3c;background:rgba(4,16,22,.7)}
#code{position:absolute;left:0;width:1080px;top:600px;text-align:center;font:400 300px/1 AN;letter-spacing:.02em;color:#ffb35a;text-shadow:0 0 40px rgba(255,157,60,.85),0 0 110px rgba(255,120,30,.55),0 10px 30px rgba(0,0,0,.6)}
#t1{position:absolute;left:110px;top:960px;font:400 214px/.98 AN;color:#f1e8d6;text-transform:uppercase;text-shadow:0 8px 30px rgba(0,0,0,.8)}
#t2{position:absolute;left:110px;top:1160px;font:400 214px/.98 AN;color:#1b1004;background:#ff3b3b;color:#f1e8d6;padding:0 26px;text-transform:uppercase;text-shadow:none}
#pf{position:absolute;right:110px;top:1400px;width:190px;height:190px;border-radius:50%;background:url(site/profile.jpg) center/cover;border:8px solid #f1e8d6;box-shadow:0 0 0 8px #ff9d3c,0 14px 34px rgba(0,0,0,.7)}
</style></head><body><div id="bg"></div><div id="sh"></div><div id="chip">OTP</div><div id="code">482917</div><div id="t1">Never say</div><div id="t2">this code</div><div id="pf"></div></body></html>`;
fs.writeFileSync(path.join(D, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.join(D, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
await p.screenshot({ path: path.join(D, 'cover.png') }); await b.close(); console.log('cover.png');
