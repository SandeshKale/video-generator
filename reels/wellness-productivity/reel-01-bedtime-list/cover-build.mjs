// Cover v2 (sticky-note desk) for Hack Zone #01 — grid-first rules (.claude/skills/cover-art/SKILL.md): designed inside the 1080x1440 grid window (y 240-1680),
// key content y 420-1500, top-right + bottom-left corners clear, <=5 words, one focal object, this reel's own spruce/tangerine/mint.
import { writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url)); const A = '../../../assets/fonts/';
// sticky notes scattered on the walnut desk (shapes only, no text), one hero note holds the number
const ghosts = [[90, 480, 250, 250, -9, '#f2c14e'], [700, 470, 260, 260, 8, '#ff9a3c'], [60, 790, 230, 230, 6, '#ffb84d'], [780, 800, 250, 250, -7, '#ff8a5b'], [330, 440, 220, 220, 3, '#ffd98a']]
  .map(([x, y, w, h, r, c]) => `<div class="gh" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${r}deg);background:linear-gradient(135deg,#fff3cf,${c} 12%,${c})"></div>`).join('');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Mar;font-weight:500;src:url(${A}martian-mono/martian-mono-latin-500-normal.woff2);font-display:block}
:root{--sp:#0d2b2a;--ink:#101a1a;--tang:#ff7a1a;--mint:#8ef0c8;--paper:#f4ecd8}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:repeating-linear-gradient(0deg,rgba(0,0,0,.10) 0 2px,transparent 2px 9px),radial-gradient(ellipse at 22% 28%,#6b4a30 0%,#33241a 55%,#150d08 100%)}
.gh{position:absolute;border-radius:10px;box-shadow:18px 26px 40px rgba(0,0,0,.55)}
.hero{position:absolute;left:190px;top:500px;width:700px;height:660px;border-radius:14px;transform:rotate(-4deg);background:linear-gradient(135deg,#fff3cf,#ff9a3c 10%,#ff8a3c);box-shadow:26px 38px 60px rgba(0,0,0,.6)}
.hero:before{content:'';position:absolute;left:0;right:0;top:0;height:46px;background:rgba(0,0,0,.08)}
.n{position:absolute;left:0;right:0;top:20px;text-align:center;font:400 640px/1 Anton;color:#2a1a08;letter-spacing:-.02em}
.tb{position:absolute;left:0;right:0;top:1180px;height:400px;background:var(--ink);border-top:12px solid var(--mint)}
.t1,.t2{position:absolute;left:90px;font-family:Anton;text-transform:uppercase;line-height:.9;white-space:nowrap}
.t1{top:1225px;font-size:150px;color:var(--paper)}.t2{top:1380px;font-size:150px;color:var(--mint)}
.face{position:absolute;left:790px;top:1310px;width:190px;height:190px;border-radius:50%;object-fit:cover;border:10px solid var(--mint);box-shadow:0 0 0 8px var(--ink),0 0 50px rgba(142,240,200,.5)}
.badge{position:absolute;left:100px;top:300px;font:500 40px Mar;letter-spacing:.1em;color:var(--ink);background:var(--mint);border-radius:999px;padding:14px 34px}
</style><body>${ghosts}<div class="badge">#01</div>
<div class="hero"><div class="n">8</div></div>
<div class="tb"></div><div class="t1">LOOPS OPEN</div><div class="t2">WRITE THIS</div>
<img class="face" src="../../../prototypes/reel-app/public/profile.jpg">
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
