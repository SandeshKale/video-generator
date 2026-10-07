// Cover v2 — grid-first rules (see .claude/skills/cover-art/SKILL.md). Designed inside the 1080x1440 grid window (y 240-1680),
// key content y 420-1500, top-right + bottom-left corners clear, <=5 words, one focal object, accent = this reel's own lime/cobalt.
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const A = '../assets/fonts/';
const oai = readFileSync(join(__dirname, '../assets/logos/gilbarbara/openai-icon.svg'), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<svg [^>]*>/, '<svg viewBox="0 0 256 260" fill="currentColor">').replace(/<title>.*?<\/title>/, '').replace(/ fill="[^"]*"/g, '').replace(/<svg /, '<svg fill="currentColor" ');
// cage with agents: grey squares inside, lime squares breaking out up-right toward the "700"
let s = 9; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
let inner = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) if (rnd() > .28) inner += `<i style="left:${22 + c * 24}px;top:${22 + r * 24}px"></i>`;
let out = ''; for (let i = 0; i < 16; i++) { const u = (i + 1) / 17; const x = 330 + u * 520 + (rnd() - .5) * 40, y = 940 - u * 150 - (rnd() - .5) * 60 - Math.sin(u * 3) * 50, z = 26 + u * 26; out += `<b style="left:${x}px;top:${y}px;width:${z}px;height:${z}px;transform:rotate(${(rnd() - .5) * 50}deg)"></b>`; }
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Inter;font-weight:700;src:url(${A}inter/inter-latin-700-normal.woff2);font-display:block}
:root{--bl:#2338ff;--navy:#0a1050;--lime:#c8ff2e;--ice:#eef1ff}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--bl)}
.dots{position:absolute;inset:0;background:radial-gradient(circle,rgba(238,241,255,.2) 2.4px,transparent 3px) 0 0/40px 40px}
.n{position:absolute;left:70px;top:430px;font:400 640px/0.8 Anton;color:var(--lime);letter-spacing:-.02em;text-shadow:12px 12px 0 var(--navy)}
.cage{position:absolute;left:100px;top:905px;width:400px;height:150px;background:var(--navy);border:8px solid var(--ice)}
.cage i{position:absolute;width:14px;height:14px;background:var(--ice);opacity:.9}
.esc b{position:absolute;background:var(--ice);border:5px solid var(--navy)}
.tb{position:absolute;left:0;right:0;top:1125px;height:390px;background:var(--navy);border-top:10px solid var(--lime)}
.t1,.t2{position:absolute;left:90px;font-family:Anton;text-transform:uppercase;line-height:.88;white-space:nowrap;color:var(--ice)}
.t1{top:1150px;font-size:190px}.t2{top:1325px;font-size:190px;color:var(--lime)}
.face{position:absolute;left:770px;top:1290px;width:215px;height:215px;border-radius:50%;object-fit:cover;border:10px solid var(--lime);box-shadow:0 0 0 8px var(--navy)}
.logo{position:absolute;left:90px;top:300px;width:110px;height:110px;border-radius:50%;background:var(--navy);border:6px solid var(--ice);color:var(--ice);padding:24px}
</style><body><div class="dots"></div>
<div class="logo">${oai}</div>
<div class="n">700</div>
<div class="cage">${inner}</div><div class="esc">${out}</div>
<div class="tb"></div><div class="t1">AGENTS</div><div class="t2">ESCAPED</div>
<img class="face" src="../reel-app/public/profile.jpg">
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(500);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
