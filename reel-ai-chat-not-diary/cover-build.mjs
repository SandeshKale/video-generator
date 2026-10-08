// Cover — grid-first rules (.claude/skills/cover-art/SKILL.md). Accent = this reel's own Glass Diary by Lamplight system (umber / amber / ice glass / wax-seal crimson).
// One focal object (a lit diary under a glass chat window, stamped with a wax seal), 3 words, designed inside the 1080x1440 grid window (y 240-1680).
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const A = '../assets/fonts/';
const tab = (n, px, col = 'currentColor', sw = 1.6) => { const s = readFileSync(join(__dirname, `../assets/icons/tabler/${n}.svg`), 'utf8'); const p = [...s.matchAll(/<(path|circle|rect|line|polyline)[^>]*>/g)].map((m) => m[0]).filter((x) => !/M0 0h24v24H0z/.test(x)).join(''); return `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`; };
const motes = Array.from({ length: 40 }, (_, i) => { const r = (k) => { const x = Math.sin(i * 91.7 + k * 13.1) * 43758.5453; return x - Math.floor(x); }; return `<i style="left:${(120 + r(1) * 840).toFixed(0)}px;top:${(300 + r(2) * 1000).toFixed(0)}px;width:${(3 + r(3) * 6).toFixed(1)}px;height:${(3 + r(3) * 6).toFixed(1)}px;opacity:${(.4 + r(4) * .6).toFixed(2)}"></i>`; }).join('');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:SO;font-weight:800;src:url(${A}sora/sora-latin-800-normal.woff2);font-display:block}
@font-face{font-family:FR;font-weight:900;font-style:italic;src:url(${A}fraunces/fraunces-latin-900-italic.woff2);font-display:block}
@font-face{font-family:JB;font-weight:700;src:url(${A}jetbrains-mono/jetbrains-mono-latin-700-normal.woff2);font-display:block}
:root{--amber:#ffbf5e;--txt:#fff0d6;--ink:#241f4d}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#120d08}
.bg{position:absolute;inset:0;background:radial-gradient(760px 700px at 50% 38%,#ffcf7a 0%,#e08a1f 22%,#7a4710 48%,#2a1a0b 74%,#120d08 100%)}
.cone{position:absolute;left:0;top:200px;width:1080px;height:1300px;background:conic-gradient(from 180deg at 84% -2%,transparent 0 12deg,rgba(255,226,170,.30) 12deg 40deg,transparent 40deg);filter:blur(24px)}
.m i{position:absolute;border-radius:50%;background:#fff2cf;box-shadow:0 0 10px 3px rgba(255,214,140,.8)}
.book{position:absolute;left:100px;top:470px;width:880px;height:560px;border-radius:30px;background:linear-gradient(160deg,#5a3418,#2b190b);box-shadow:0 40px 80px rgba(0,0,0,.7),inset 0 2px 0 rgba(255,200,140,.3);transform:rotate(-4deg)}
.pg{position:absolute;top:26px;height:508px;width:400px;background:repeating-linear-gradient(180deg,transparent 0 42px,rgba(36,31,77,.2) 42px 44px),linear-gradient(90deg,#f0e0b8,#fbf1d8 40%,#f4e6c2);box-shadow:inset 0 0 36px rgba(120,80,30,.3)}
.pl{left:24px;border-radius:14px 4px 4px 14px}.pr{right:24px;border-radius:4px 14px 14px 4px}
.sp{position:absolute;left:50%;top:26px;width:40px;height:508px;margin-left:-20px;background:linear-gradient(90deg,transparent,rgba(60,35,12,.55) 50%,transparent)}
.ink{position:absolute;font:900 italic 46px/1 FR;color:var(--ink)}
.rd{position:absolute;height:30px;background:#14101e;border-radius:4px}
.gl{position:absolute;left:420px;top:50px;width:420px;height:460px;border-radius:28px;background:linear-gradient(135deg,rgba(191,234,245,.5),rgba(191,234,245,.1) 60%);border:2px solid rgba(235,250,255,.7);box-shadow:inset 0 2px 0 rgba(255,255,255,.7),0 30px 60px rgba(0,0,0,.5);transform:rotate(-2deg)}
.bub{position:absolute;border-radius:30px;height:58px}
.seal{position:absolute;left:80px;top:910px;width:250px;height:250px;border-radius:50%;background:radial-gradient(circle at 36% 30%,#f2747b,#c8353f 45%,#7d1824 100%);box-shadow:0 20px 40px rgba(0,0,0,.6),inset 0 -8px 20px rgba(0,0,0,.35),inset 0 6px 12px rgba(255,200,200,.4);display:flex;align-items:center;justify-content:center;transform:rotate(-8deg)}
.seal::before{content:'';position:absolute;inset:22px;border-radius:50%;border:5px dashed rgba(255,225,215,.7)}
.tb{position:absolute;left:0;right:0;top:1180px;height:340px;background:rgba(14,10,6,.94);border-top:10px solid var(--amber)}
.t1,.t2{position:absolute;left:90px;font:800 168px/0.9 SO;text-transform:uppercase;white-space:nowrap;letter-spacing:-.045em}
.t1{top:1196px;color:var(--txt)}.t2{top:1340px;color:var(--amber)}
.face{position:absolute;left:790px;top:1450px;width:200px;height:200px;border-radius:50%;object-fit:cover;border:10px solid var(--amber);box-shadow:0 0 0 8px #120d08,0 0 40px rgba(255,191,94,.6)}
</style><body><div class="bg"></div><div class="cone"></div><div class="m">${motes}</div>
<div class="book"><div class="pg pl"><div class="ink" style="left:30px;top:16px">Sept. 26</div><div class="ink" style="left:30px;top:70px;font-size:40px">dear diary,</div>
 <div class="rd" style="left:30px;top:140px;width:330px"></div><div class="rd" style="left:30px;top:190px;width:270px"></div><div class="rd" style="left:30px;top:240px;width:340px"></div><div class="rd" style="left:30px;top:290px;width:210px"></div></div>
 <div class="pg pr"><div class="rd" style="left:34px;top:40px;width:300px;background:#2a2147"></div><div class="rd" style="left:34px;top:90px;width:250px;background:#2a2147"></div></div><div class="sp"></div>
 <div class="gl"><div class="bub" style="left:26px;top:36px;width:250px;background:rgba(255,255,255,.34);border:2px solid rgba(255,255,255,.7)"></div><div class="bub" style="left:100px;top:118px;width:290px;background:rgba(255,191,94,.6);border:2px solid rgba(255,225,170,.9)"></div><div class="bub" style="left:26px;top:200px;width:160px;background:rgba(255,255,255,.34);border:2px solid rgba(255,255,255,.7)"></div></div>
 <div style="position:absolute;left:520px;top:300px;color:#ffbf5e;filter:drop-shadow(0 0 16px rgba(255,191,94,.9))">${tab('search', 200, '#ffd27a', 1.5)}</div></div>
<div class="seal">${tab('eye', 130, '#ffe8e0', 1.6)}</div>
<div class="tb"></div><div class="t1">NOT A</div><div class="t2">DIARY.</div>
<img class="face" src="../reel-app/public/profile.jpg">
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(600);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
