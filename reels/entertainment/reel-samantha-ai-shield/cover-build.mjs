// Cover (grid-first rules, .claude/skills/cover-art/SKILL.md): inside the 1080x1440 grid window (y 240-1680), key content y 420-1500, play icon (top-right) and view
// badge (bottom-left) kept clear, 4 words, one focal object. Cover-exclusive hero: one giant blank mannequin mask (the reel's through-line object) with a
// saffron TAKEN DOWN stamp across it on a hot-pink halftone ground, the creator's chip bottom-right. No real person's face is generated or shown.
// Run: bun cover-build.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const F = 'site/fonts/';
const mask = (cx, cy, h, col) => `<svg style="position:absolute;left:${cx - h * .4}px;top:${cy - h * .6}px" width="${h * .8}" height="${h * 1.15}" viewBox="${-.4 * h} ${-.6 * h} ${.8 * h} ${1.15 * h}">
<path d="M0 ${-.52 * h} C${.30 * h} ${-.52 * h} ${.31 * h} ${-.14 * h} ${.16 * h} ${.09 * h} C${.11 * h} ${.17 * h} ${-.11 * h} ${.17 * h} ${-.16 * h} ${.09 * h} C${-.31 * h} ${-.14 * h} ${-.30 * h} ${-.52 * h} 0 ${-.52 * h}Z M${-.075 * h} ${.1 * h} h${.15 * h} v${.16 * h} h${-.15 * h}Z M${-.34 * h} ${.5 * h} C${-.34 * h} ${.28 * h} ${-.12 * h} ${.24 * h} 0 ${.24 * h} C${.12 * h} ${.24 * h} ${.34 * h} ${.28 * h} ${.34 * h} ${.5 * h}Z" fill="${col}" stroke="#14101a" stroke-width="${h * .022}" stroke-linejoin="round"/>
<path d="M${-.2 * h} ${-.18 * h} Q0 ${-.1 * h} ${.2 * h} ${-.18 * h} M0 ${-.5 * h} L0 ${.08 * h}" fill="none" stroke="rgba(20,16,26,.28)" stroke-width="${h * .009}"/></svg>`;
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:AN;src:url(${F}anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:BG;src:url(${F}bungee-latin-400-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#ff2d78}
.dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.28) 4px,transparent 5px);background-size:30px 30px;background-position:0 0}
.dots2{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(20,16,26,.14) 2px,transparent 3px);background-size:30px 30px;background-position:15px 15px}
.glow{position:absolute;left:140px;top:380px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(244,236,216,.9),rgba(244,236,216,0) 68%)}
.stamp{position:absolute;left:180px;top:720px;width:720px;height:200px;border:14px solid #ffb000;color:#ffb000;font:400 84px/172px BG;white-space:nowrap;text-align:center;transform:rotate(-9deg);background:rgba(20,16,26,.82);letter-spacing:.02em}
.badge{position:absolute;left:90px;top:300px;padding:10px 22px 6px;background:#14101a;color:#f4ecd8;font:400 44px/1 AN;letter-spacing:.08em}
.tb{position:absolute;left:0;right:0;top:1150px;height:350px;background:#14101a;border-top:12px solid #00b8ad}
.t1,.t2{position:absolute;left:90px;font-family:AN;line-height:.9;white-space:nowrap;text-transform:uppercase}
.t1{top:1175px;font-size:150px;color:#f4ecd8}.t2{top:1320px;font-size:150px;color:#ffb000}
.face{position:absolute;left:810px;top:930px;width:180px;height:180px;border-radius:50%;object-fit:cover;border:9px solid #14101a;box-shadow:0 0 0 7px #00b8ad}
</style><body><div class="dots"></div><div class="dots2"></div><div class="glow"></div>
${mask(540, 700, 640, '#00b8ad')}
<div class="stamp">TAKEN DOWN</div>
<div class="badge">AI DEEPFAKES</div>
<div class="tb"></div><div class="t1">TAKE HER FACE</div><div class="t2">DOWN</div>
<img class="face" src="site/profile.jpg">
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
