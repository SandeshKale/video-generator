// Cover (grid-first rules, .claude/skills/cover-art/SKILL.md): designed inside the 1080x1440 grid window (y 240-1680),
// key content y 420-1500, top-right play icon and bottom-left view badge kept clear, 4 words, one focal object.
// Cover-exclusive hero: the battery mascot stewing in a cooking pot with the pillow as its lid (no pot appears in the reel).
// Palette, tiles and mascot drawing come from the reel's own "Kitchen Timer" system.
// Run: bun cover-build.mjs [en|hi]
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const V = process.argv[2] || 'en';
const A = '../../../assets/fonts/';
const T = { en: ['STOP COOKING', 'YOUR BATTERY'], hi: ['STOP COOKING', 'YOUR BATTERY'] }[V];
const mascot = `<svg viewBox="0 0 200 300" width="260" height="390" overflow="visible">
 <rect x="78" y="8" width="44" height="28" rx="7" fill="#141414"/>
 <rect x="28" y="30" width="144" height="252" rx="30" fill="#e0218a" stroke="#141414" stroke-width="9"/>
 <rect x="52" y="60" width="14" height="150" rx="7" fill="#fff" opacity=".35"/>
 <circle cx="72" cy="116" r="25" fill="#fff" stroke="#141414" stroke-width="6"/><circle cx="128" cy="116" r="25" fill="#fff" stroke="#141414" stroke-width="6"/>
 <circle cx="80" cy="110" r="10" fill="#141414"/><circle cx="136" cy="110" r="10" fill="#141414"/>
 <path d="M54 90 L92 80 M108 80 L146 90" stroke="#141414" stroke-width="7" stroke-linecap="round"/>
 <path d="M88 186 a12 14 0 1 0 24 0 a12 14 0 1 0 -24 0" fill="#141414"/>
 <ellipse cx="58" cy="158" rx="13" ry="8" fill="#ff7aa8" opacity=".9"/><ellipse cx="142" cy="158" rx="13" ry="8" fill="#ff7aa8" opacity=".9"/>
 <path transform="translate(170,70)" d="M0 0 C-7 10 -9 16 0 20 C9 16 7 10 0 0Z" fill="#7cc7ff" stroke="#141414" stroke-width="3"/>
 <path transform="translate(26,128)" d="M0 0 C-7 10 -9 16 0 20 C9 16 7 10 0 0Z" fill="#7cc7ff" stroke="#141414" stroke-width="3"/>
 <text x="100" y="256" text-anchor="middle" font-family="Unb" font-weight="900" font-size="30" fill="#fffaf0">100%</text></svg>`;
let flames = ''; for (let i = 0; i < 6; i++) flames += `<path transform="translate(${180 + i * 90},1050) scale(${i % 2 ? 1 : .85})" d="M0 0 C-34 -30 -20 -70 0 -110 C8 -70 40 -60 34 -20 C30 0 14 6 0 0Z" fill="${i % 2 ? '#ff6a2b' : '#d7261e'}" stroke="#141414" stroke-width="6"/>`;
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Unb;font-weight:900;src:url(${A}unbounded/unbounded-latin-900-normal.woff2);font-display:block}
@font-face{font-family:GM;font-weight:600;src:url(${A}geist-mono/geist-mono-latin-600-normal.woff2);font-display:block}
:root{--bg:#f6f3ec;--tile:#e7e0d2;--ink:#141414;--heat:#ff6a2b;--red:#d7261e;--mag:#e0218a;--paper:#fffaf0}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--bg)}
.tiles{position:absolute;inset:0;background-image:linear-gradient(var(--tile) 3px,transparent 3px),linear-gradient(90deg,var(--tile) 3px,transparent 3px);background-size:130px 130px}
.glow{position:absolute;inset:0;background:radial-gradient(760px 620px at 50% 760px,rgba(255,106,43,.55),rgba(255,106,43,.12) 60%,transparent 80%)}
.badge{position:absolute;left:90px;top:300px;padding:12px 22px;background:var(--ink);color:var(--paper);font:600 30px GM;letter-spacing:.12em;border-radius:12px}
.mas{position:absolute;left:330px;top:440px;transform:rotate(-6deg)}
.pot{position:absolute;left:110px;top:700px;width:680px;height:340px}
.lid{position:absolute;left:440px;top:400px;width:390px;height:150px;border-radius:70px;background:var(--paper);border:9px solid var(--ink);transform:rotate(24deg);box-shadow:8px 10px 0 rgba(20,20,20,.25)}
.lid:after{content:"";position:absolute;left:60px;right:60px;top:56px;border-top:6px dashed #d9cfbd}
.steam path{fill:none;stroke:#8f867c;stroke-width:16;stroke-linecap:round}
.tb{position:absolute;left:0;right:0;top:1125px;height:390px;background:var(--ink);border-top:12px solid var(--heat)}
.t1,.t2{position:absolute;left:90px;font-family:Anton;text-transform:uppercase;line-height:.88;white-space:nowrap;color:var(--paper)}
.t1{top:1160px;font-size:168px}.t2{top:1330px;font-size:168px;color:var(--heat)}
.face{position:absolute;left:800px;top:900px;width:190px;height:190px;border-radius:50%;object-fit:cover;border:10px solid var(--heat);box-shadow:0 0 0 8px var(--ink)}
</style><body><div class="tiles"></div><div class="glow"></div>
<div class="badge">ROASTED #01</div>
<svg class="steam" style="position:absolute;left:0;top:0;width:1080px;height:1920px"><path d="M230 640 c-30 -50 30 -80 0 -130 c-30 -50 30 -80 0 -130"/><path d="M310 600 c-24 -40 24 -64 0 -104 c-24 -40 24 -64 0 -104"/></svg>
<div class="lid"></div>
<div class="mas">${mascot}</div>
<svg class="pot" viewBox="0 0 720 360"><rect x="40" y="70" width="640" height="250" rx="40" fill="#d7261e" stroke="#141414" stroke-width="12"/><rect x="0" y="40" width="720" height="60" rx="30" fill="#ff6a2b" stroke="#141414" stroke-width="12"/><rect x="-40" y="120" width="70" height="40" rx="20" fill="#141414"/><rect x="690" y="120" width="70" height="40" rx="20" fill="#141414"/><path d="M110 180 q40 -26 80 0 t80 0" fill="none" stroke="#fffaf0" stroke-width="10" stroke-linecap="round" opacity=".7"/></svg>
<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px">${flames}</svg>
<div class="tb"></div><div class="t1">${T[0]}</div><div class="t2">${T[1]}</div>
<img class="face" src="../../../prototypes/reel-app/public/profile.jpg">
</body>`;
writeFileSync(join(__dirname, `cover-${V}.html`), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, `cover-${V}.html`)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.screenshot({ path: join(__dirname, `cover-${V}.png`) }); await b.close(); console.log(`cover-${V}.png`);
