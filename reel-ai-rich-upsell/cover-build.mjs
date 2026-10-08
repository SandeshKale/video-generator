// Cover — grid-first rules (.claude/skills/cover-art/SKILL.md). Accent = this reel's own turquoise/ivory/ink/coral boarding-pass system.
// One focal object (a boarding pass stamped "+$198"), 5 words total, designed inside the 1080x1440 grid window (y 240-1680).
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const A = '../assets/fonts/';
const tab = (n, px) => { const s = readFileSync(join(__dirname, `../assets/icons/tabler/${n}.svg`), 'utf8'); const p = [...s.matchAll(/<(path|circle|rect|line|polyline)[^>]*>/g)].map((m) => m[0]).filter((x) => !/M0 0h24v24H0z/.test(x)).join(''); return `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`; };
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:BC;font-weight:800;src:url(${A}barlow-condensed/barlow-condensed-latin-800-normal.woff2);font-display:block}
@font-face{font-family:SM;font-weight:700;src:url(${A}space-mono/space-mono-latin-700-normal.woff2);font-display:block}
:root{--tq:#00b3a3;--iv:#fbf6ea;--ink:#0d1f1e;--co:#ff4f4a}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--tq)}
.arcs{position:absolute;inset:0;background:radial-gradient(circle at 20% 110%,transparent 0 520px,rgba(251,246,234,.18) 520px 524px,transparent 524px 700px,rgba(251,246,234,.12) 700px 703px,transparent 703px),radial-gradient(circle at 95% -5%,transparent 0 380px,rgba(251,246,234,.16) 380px 383px,transparent 383px 560px,rgba(251,246,234,.1) 560px 563px,transparent 563px)}
.air{position:absolute;left:0;right:0;top:250px;height:34px;background:repeating-linear-gradient(115deg,var(--co) 0 26px,var(--iv) 26px 52px,var(--ink) 52px 78px,var(--iv) 78px 104px)}
.tk{position:absolute;left:110px;top:470px;width:860px;height:470px;background:var(--iv);border-radius:30px;transform:rotate(-4deg);filter:drop-shadow(0 16px 0 rgba(13,31,30,.35))}
.tk i{position:absolute;width:60px;height:60px;border-radius:50%;background:var(--tq);top:205px}
.perf{position:absolute;top:30px;bottom:30px;left:610px;border-left:5px dashed rgba(13,31,30,.35)}
.code{position:absolute;font:800 150px/0.9 BC;color:var(--ink)}
.lab{position:absolute;font:700 22px SM;letter-spacing:.14em;color:rgba(13,31,30,.6)}
.bar{position:absolute;left:640px;top:330px;width:190px;height:60px;background:repeating-linear-gradient(90deg,var(--ink) 0 4px,transparent 4px 8px,var(--ink) 8px 10px,transparent 10px 15px)}
.st{position:absolute;left:160px;top:620px;font:800 270px/0.85 BC;color:var(--co);background:rgba(251,246,234,.96);border:14px solid var(--co);padding:6px 30px;transform:rotate(-6deg);white-space:nowrap}
.tb{position:absolute;left:0;right:0;top:1125px;height:395px;background:var(--ink);border-top:12px solid var(--co)}
.t1,.t2{position:absolute;left:90px;font:800 164px/0.9 BC;text-transform:uppercase;white-space:nowrap}
.t1{top:1145px;color:var(--iv)}.t2{top:1300px;color:#ff8c88}
.face{position:absolute;left:775px;top:1462px;width:210px;height:210px;border-radius:50%;object-fit:cover;border:10px solid var(--co);box-shadow:0 0 0 8px var(--ink)}
.badge{position:absolute;left:90px;top:300px;width:120px;height:120px;border-radius:50%;background:var(--ink);color:var(--iv);padding:26px;border:6px solid var(--iv)}
</style><body><div class="arcs"></div><div class="air"></div>
<div class="badge">${tab('plane', 66)}</div>
<div class="tk"><i style="left:-30px"></i><i style="right:-30px"></i><div class="perf"></div>
 <div class="lab" style="left:50px;top:36px">PROFILE B · FICTIONAL · EXAMPLE</div>
 <div class="code" style="left:50px;top:80px">NYC</div><div style="position:absolute;left:350px;top:100px;color:var(--ink)">${tab('plane', 110)}</div><div class="code" style="left:490px;top:80px">LON</div>
 <div class="bar"></div></div>
<div class="st">+$198</div>
<div class="tb"></div><div class="t1">AI THINKS</div><div class="t2">YOU'RE RICH</div>
<img class="face" src="../reel-app/public/profile.jpg">
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(500);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
