// Cover v2 — grid-first rules (.claude/skills/cover-art/SKILL.md). Accent = this reel's own paper/ink/orange/cobalt spec-sheet system.
// Designed inside the 1080x1440 grid window (y 240-1680); key content y 420-1500; top-right + bottom-left corners clear.
import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const robot = (() => { const s = readFileSync('../../../assets/icons/tabler/robot.svg', 'utf8'); return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${[...s.matchAll(/<(path|circle|rect|line)[^>]*>/g)].map((m) => m[0]).filter((p) => !/M0 0h24v24H0z/.test(p)).join('')}</svg>`; })();
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:'Fr';font-weight:900;src:url('../../../assets/fonts/fraunces/fraunces-latin-900-normal.woff2');font-display:block}
@font-face{font-family:'JB';font-weight:700;src:url('../../../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'Fr';font-weight:900;font-style:italic;src:url('../../../assets/fonts/fraunces/fraunces-latin-900-italic.woff2');font-display:block}
:root{--paper:#f1ede4;--ink:#101114;--cob:#2f5cff;--org:#ff5a1f}
*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1920px;overflow:hidden;background:var(--paper)}
.g{position:absolute;inset:0;background-image:linear-gradient(rgba(16,17,20,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(16,17,20,.08) 1px,transparent 1px);background-size:54px 54px}
.print{position:absolute;left:215px;top:420px;width:650px;height:730px;background:#fff;padding:20px 20px 80px;box-shadow:0 30px 50px rgba(16,17,20,.35);transform:rotate(-3deg)}
.ph{width:100%;height:100%;background:url(shots/atlas-closeup.jpg) 50% 18%/cover}
.tape{position:absolute;width:170px;height:46px;background:rgba(255,205,90,.85);box-shadow:0 2px 6px rgba(0,0,0,.25)}
.badge{position:absolute;left:90px;top:300px;width:120px;height:120px;border-radius:50%;background:var(--ink);color:var(--paper);padding:26px;border:6px solid var(--org);z-index:3}
.cap{position:absolute;left:24px;bottom:22px;font:700 24px JB;letter-spacing:.14em;color:#6b665c}
.tb{position:absolute;left:0;right:0;top:1130px;height:400px;background:var(--ink);border-top:14px solid var(--org)}
.t1{position:absolute;left:90px;top:1150px;font:900 italic 250px/1 Fr;color:var(--org);letter-spacing:-.04em;white-space:nowrap}
.t2{position:absolute;left:90px;top:1390px;font:900 112px/1 Fr;color:var(--paper);letter-spacing:-.035em;white-space:nowrap}
.face{position:absolute;left:775px;top:1462px;width:210px;height:210px;border-radius:50%;object-fit:cover;border:10px solid var(--org);box-shadow:0 0 0 8px var(--ink)}
</style><body><div class=g></div>
<div class=badge>${robot}</div>
<div class=print><div class=tape style="left:-40px;top:-18px;transform:rotate(-10deg)"></div><div class=tape style="right:-40px;top:-14px;transform:rotate(9deg)"></div><div class=ph></div><div class=cap>AI-GENERATED IMAGE</div></div>
<div class=tb></div><div class=t1>Strike</div><div class=t2>over a robot</div>
<img class=face src="../../../prototypes/reel-app/public/profile.jpg">
</body>`;
await writeFile('cover.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + process.cwd() + '/cover.html'); await p.waitForTimeout(600);
await p.screenshot({ path: 'cover.png' }); await b.close(); console.log('cover.png');
