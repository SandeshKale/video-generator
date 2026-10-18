// Cover (grid-first rules, .claude/skills/cover-art/SKILL.md): designed inside the 1080x1440 grid window (y 240-1680),
// key content y 420-1500, top-right play icon and bottom-left view badge kept clear, 3 words, one focal object.
// Cover-exclusive hero: the four official posters fanned like a hand of cards, King in front, under two searchlights
// (the reel never shows a hand of cards). Palette, fonts and marquee bulbs come from the reel's own "Premiere Night" system.
// Run: bun cover-build.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const A = '../../../assets/fonts/';
const fan = [['fauzi', '#3fa9ff', -24, 250, 690], ['dune', '#ffae3d', -9, 400, 640], ['avengers', '#8bff4a', 7, 560, 640], ['king', '#ff2e4d', 0, 400, 560]];
let cards = '';
for (const [f, c, r, x, y] of fan) {
  const big = f === 'king', w = big ? 330 : 280, h = big ? 495 : 420;
  cards += `<div class="card${big ? ' big' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${r}deg);border-color:${c};background-image:url(site/img/${f}.jpg)"></div>`;
}
let bulbs = ''; const bx = 370, by = 530, bw = 390, bh = 555, per = 2 * (bw + bh), n = 44;
for (let i = 0; i < n; i++) {
  const d = i / n * per; let x, y;
  if (d < bw) { x = d; y = 0 } else if (d < bw + bh) { x = bw; y = d - bw } else if (d < 2 * bw + bh) { x = bw - (d - bw - bh); y = bh } else { x = 0; y = bh - (d - 2 * bw - bh) }
  const lit = i % 3 === 0; bulbs += `<i style="left:${bx + x}px;top:${by + y}px;background:${lit ? '#fff2c4' : '#8a6a3c'};${lit ? 'box-shadow:0 0 14px 4px rgba(255,211,77,.9)' : ''}"></i>`;
}
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:BB;src:url(${A}bebas-neue/bebas-neue-latin-400-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:radial-gradient(1100px 900px at 50% 45%,#3a2246 0%,#1a0f22 60%,#0d0811 100%)}
.beam{position:absolute;top:-300px;width:420px;height:1900px;transform-origin:50% 100%;opacity:.42;mix-blend-mode:screen;filter:blur(8px);
 background:linear-gradient(0deg,rgba(255,211,77,0),rgba(255,226,150,.9) 8%,rgba(255,211,77,.2) 60%,rgba(255,211,77,0));clip-path:polygon(44% 100%,56% 100%,100% 0,0 0)}
.card{position:absolute;border:7px solid;border-radius:14px;background:center/cover no-repeat;box-shadow:0 30px 60px rgba(0,0,0,.65)}
.card.big{box-shadow:0 0 0 10px #2a1a12,0 40px 80px rgba(0,0,0,.75)}
i{position:absolute;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%}
.badge{position:absolute;left:90px;top:300px;padding:12px 22px 6px;background:#ffd34d;color:#120b17;font:400 44px/1 BB;letter-spacing:.1em;border-radius:10px}
.tb{position:absolute;left:0;right:0;top:1150px;height:350px;background:#ff2e4d;border-top:12px solid #ffd34d}
.t1,.t2{position:absolute;left:90px;font-family:Anton;line-height:.9;white-space:nowrap;text-transform:uppercase}
.t1{top:1175px;font-size:150px;color:#120b17}.t2{top:1320px;font-size:150px;color:#f3ece0}
.face{position:absolute;left:810px;top:930px;width:180px;height:180px;border-radius:50%;object-fit:cover;border:9px solid #ffd34d;box-shadow:0 0 0 7px #120b17}
</style><body>
<div class="beam" style="left:-40px;transform:rotate(-16deg)"></div><div class="beam" style="left:700px;transform:rotate(18deg)"></div>
<div class="badge">DEC 2026</div>
${cards}${bulbs}
<div class="tb"></div><div class="t1">SRK VS</div><div class="t2">HOLLYWOOD</div>
<img class="face" src="site/profile.jpg">
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
