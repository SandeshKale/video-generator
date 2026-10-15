// Cover v1 for Hack Zone #01 — grid-first rules (.claude/skills/cover-art/SKILL.md): designed inside the 1080x1440 grid window (y 240-1680),
// key content y 420-1500, top-right + bottom-left corners clear, <=5 words, one focal object, this reel's own spruce/tangerine/mint.
import { writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url)); const A = '../../../assets/fonts/';
// ghost "tabs" drifting behind the hero (shapes only, no text)
const ghosts = [[70, 470, 300, 180, -6, .35], [700, 440, 300, 180, 7, .3], [40, 800, 250, 150, 5, .28], [780, 780, 260, 156, -5, .3], [560, 1010, 300, 180, 4, .22]]
  .map(([x, y, w, h, r, o]) => `<div class="gh" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${r}deg);opacity:${o}"><i></i><i></i><i></i><b></b></div>`).join('');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Mar;font-weight:500;src:url(${A}martian-mono/martian-mono-latin-500-normal.woff2);font-display:block}
:root{--sp:#0d2b2a;--ink:#101a1a;--tang:#ff7a1a;--mint:#8ef0c8;--paper:#f4ecd8}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#14423f 0%,var(--sp) 62%,#071918 100%)}
.gh{position:absolute;border:6px solid var(--tang);border-radius:30px;background:linear-gradient(180deg,rgba(255,150,70,.28),rgba(255,122,26,.08))}
.gh i{position:absolute;top:22px;width:14px;height:14px;border-radius:50%;background:var(--tang)}.gh i:nth-child(1){left:26px}.gh i:nth-child(2){left:50px}.gh i:nth-child(3){left:74px}
.gh b{position:absolute;right:20px;top:18px;width:26px;height:26px;border-radius:50%;background:#ff5a4f}
.hero{position:absolute;left:110px;top:520px;width:860px;height:640px;border:14px solid var(--tang);border-radius:70px;background:linear-gradient(180deg,rgba(255,150,70,.34),rgba(255,122,26,.12));box-shadow:0 0 120px rgba(255,122,26,.35),0 30px 80px rgba(0,0,0,.5)}
.hero i{position:absolute;top:52px;width:30px;height:30px;border-radius:50%;background:var(--tang)}.hero i:nth-child(1){left:64px}.hero i:nth-child(2){left:112px}.hero i:nth-child(3){left:160px}
.hero b{position:absolute;right:56px;top:40px;width:62px;height:62px;border-radius:50%;background:#ff5a4f;color:#fff;font:800 40px/62px sans-serif;text-align:center}
.n{position:absolute;left:0;right:0;top:50px;text-align:center;font:400 600px/1 Anton;color:var(--paper);letter-spacing:-.02em;text-shadow:12px 12px 0 var(--ink)}
.tb{position:absolute;left:0;right:0;top:1180px;height:400px;background:var(--ink);border-top:12px solid var(--mint)}
.t1,.t2{position:absolute;left:90px;font-family:Anton;text-transform:uppercase;line-height:.9;white-space:nowrap}
.t1{top:1225px;font-size:150px;color:var(--paper)}.t2{top:1380px;font-size:150px;color:var(--mint)}
.face{position:absolute;left:790px;top:1310px;width:190px;height:190px;border-radius:50%;object-fit:cover;border:10px solid var(--mint);box-shadow:0 0 0 8px var(--ink),0 0 50px rgba(142,240,200,.5)}
.badge{position:absolute;left:100px;top:300px;font:500 40px Mar;letter-spacing:.1em;color:var(--ink);background:var(--mint);border-radius:999px;padding:14px 34px}
</style><body>${ghosts}<div class="badge">#01</div>
<div class="hero"><i></i><i></i><i></i><b>!</b><div class="n">14</div></div>
<div class="tb"></div><div class="t1">TABS OPEN</div><div class="t2">WRITE THIS</div>
<img class="face" src="../../../prototypes/reel-app/public/profile.jpg">
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
