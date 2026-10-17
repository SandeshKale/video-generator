// Cover for the Jailer 2 Hindi reel. Grid-first (3:4 crop y240-1680, key content y420-1500, view badge bottom-left kept clear).
// Hero = a cascade of three ticket stubs (not used in the reel). Title in Anton, 2 lines, 4 words. Run: bun cover-build.mjs
import { writeFileSync } from 'node:fs'; import { chromium } from '../../../node_modules/playwright/index.mjs'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url));
const stub = (x, y, rot, bg, fg, lab, val, sc = 1) => `<div class="tk" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg) scale(${sc});background:${bg};color:${fg}"><div class="tl">${lab}</div><div class="tv">${val}</div><div class="perf"></div><div class="st">ADMIT ONE</div></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Anton;src:url(cover-assets/anton.woff2);font-display:block}
@font-face{font-family:MM;font-weight:700;src:url(site/fonts/martian-mono-latin-700-normal.woff2);font-display:block}
*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:radial-gradient(900px 700px at 70% 38%,#7a1f3c 0,#3a0f1f 55%,#1a0c10 100%);position:relative;font-family:Anton}
.grid{position:absolute;inset:0;background-image:radial-gradient(rgba(243,233,210,.07) 2px,transparent 2.5px);background-size:44px 44px}
.tk{position:absolute;width:640px;height:250px;border-radius:22px;padding:30px 44px;box-shadow:0 24px 60px rgba(0,0,0,.55);transform-origin:center}
.tl{font-family:MM;font-weight:700;font-size:28px;letter-spacing:.14em}.tv{font-size:140px;line-height:1.05;letter-spacing:-.01em}
.perf{position:absolute;right:150px;top:0;bottom:0;border-left:5px dashed rgba(26,12,16,.35)}
.st{position:absolute;right:20px;top:50%;transform:translateY(-50%) rotate(90deg);font-family:MM;font-weight:700;font-size:22px;letter-spacing:.2em}
.t{position:absolute;left:90px;top:440px;color:#f3e9d2;font-size:215px;line-height:.95;white-space:nowrap;letter-spacing:-.01em;text-shadow:0 8px 24px rgba(0,0,0,.6)}
.t span{display:inline-block;background:#ff3d7f;color:#1a0c10;padding:0 26px;margin-top:14px;text-shadow:none}
.chip{position:absolute;right:90px;top:1330px;width:210px;height:210px;border-radius:50%;border:9px solid #ff3d7f;box-shadow:0 0 0 8px rgba(26,12,16,.85),0 14px 40px rgba(0,0,0,.6);overflow:hidden}
.chip img{width:100%;height:100%;object-fit:cover}
</style></head><body><div class="grid"></div>
${stub(330, 930, -7, '#a58bff', '#1a0c10', 'TELUGU · SHOWS', '2,792')}
${stub(250, 1070, 4, '#2ee6d6', '#1a0c10', 'TAMIL · SHOWS', '9,326')}
${stub(110, 1210, -3, '#f3e9d2', '#1a0c10', 'HINDI · NET', '₹3.5 CR')}
<div class="t">JAILER 2<br><span>HINDI: 6%</span></div>
<div class="chip"><img src="cover-assets/profile.jpg"></div></body></html>`;
writeFileSync(join(D, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(D, 'cover.html')); await p.waitForTimeout(500); await p.screenshot({ path: join(D, 'cover.png') }); await b.close();
