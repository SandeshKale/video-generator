// Cover (grid-first rules, .claude/skills/cover-art/SKILL.md): designed inside the 1080x1440 grid window (y 240-1680), key content
// y 420-1500, play icon (top-right) and view badge (bottom-left) kept clear, 5 words, one focal object.
// Cover-exclusive hero: the host, cut out, with neutrino tracks shooting straight through him on a bright cyan ground (the reel is
// dark; the cover is bright so the tile pops on a dark grid). Palette, fonts and the 1 cm2 detector square come from "Cloud Chamber".
// The host is his own face (the cut-out avatar frame), so the face chip is the hero itself.
// Run: bun cover-build.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const A = '../../../assets/fonts/';
function ih(k, s) { let x = (Math.imul(k, 2654435761) ^ Math.imul(s, 2246822519)) >>> 0; x = Math.imul(x ^ (x >>> 16), 2246822507) >>> 0; x = Math.imul(x ^ (x >>> 13), 3266489909) >>> 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967296 }
let back = '', front = '';
for (let k = 0; k < 150; k++) {
  const x = ih(k, 1) * 1500 - 300, y = ih(k, 2) * 2200 - 200, L = 120 + ih(k, 3) * 260, w = 2 + ih(k, 4) * 5, o = .35 + ih(k, 5) * .6;
  const s = `<i style="left:${x}px;top:${y}px;height:${L}px;width:${w}px;opacity:${o}"></i>`;
  if (ih(k, 6) < .3) front += s; else back += s;
}
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:FC;font-weight:600;src:url(site/fonts/fira-code-latin-600-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:radial-gradient(900px 900px at 50% 42%,#c9f4ff 0%,#7fdcf6 45%,#2aa9d6 100%)}
.r i{position:absolute;background:linear-gradient(180deg,rgba(3,5,10,0),#03050a);border-radius:3px;transform:rotate(-26.6deg);transform-origin:50% 100%}
.r.f i{background:linear-gradient(180deg,rgba(255,255,255,0),#ffffff);box-shadow:0 0 12px rgba(255,255,255,.9)}
.host{position:absolute;left:-20px;top:300px;width:1120px;height:1120px;filter:drop-shadow(0 30px 40px rgba(3,5,10,.45))}
.sq{position:absolute;left:690px;top:830px;width:130px;height:130px;border:6px solid #ff4fd8;box-shadow:0 0 22px #ff4fd8}
.sq b{position:absolute;left:-6px;top:138px;font:600 30px FC;color:#03050a;background:#ff4fd8;padding:4px 10px;white-space:nowrap}
.badge{position:absolute;left:90px;top:1080px;padding:10px 20px 8px;background:#03050a;color:#9fe8ff;font:600 34px FC;letter-spacing:.08em;border-radius:10px}
.tb{position:absolute;left:0;right:0;top:1150px;height:350px;background:#03050a;border-top:12px solid #ff4fd8}
.t1,.t2{position:absolute;left:90px;font-family:Anton;line-height:.9;white-space:nowrap;text-transform:uppercase}
.t1{top:1178px;font-size:146px;color:#9fe8ff}.t2{top:1322px;font-size:146px;color:#f3ece0}
</style><body>
<div class="r">${back}</div>
<img class="host" src="cover-host.png">
<div class="r f">${front}</div>
<div class="sq"><b>1 cm²</b></div>
<div class="badge">100,000,000,000 / s</div>
<div class="tb"></div><div class="t1">You're being</div><div class="t2">shot right now</div>
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
