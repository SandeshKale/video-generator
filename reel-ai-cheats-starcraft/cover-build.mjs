// Cover v2 — grid-first rules (.claude/skills/cover-art/SKILL.md). Accent = this reel's own violet/gold/red retro-RTS palette.
// Designed inside the 1080x1440 grid window (y 240-1680); key content y 420-1500; top-right + bottom-left corners clear.
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const A = '../assets/fonts/';
const oai = readFileSync(join(__dirname, '../assets/logos/gilbarbara/openai-icon.svg'), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<svg [^>]*>/, '<svg viewBox="0 0 256 260" fill="currentColor">').replace(/<title>.*?<\/title>/, '').replace(/ fill="[^"]*"/g, '').replace(/<svg /, '<svg fill="currentColor" ');
// the reel's own 12x12 mirrored sprite, drawn big in gold (the bot it stole)
const half = ['..oooo', '.obbbb', 'obbhhh', 'obeeeb', 'obbbbb', '.oooob', '..obbb', '.obbbb', 'obbooo', 'obbo..', 'obbo..', '.ooo..'];
const C = { o: '#7a4a00', b: '#ffc83d', h: '#fff0b3', e: '#0c0a1a' }, S = 50; let sp = '';
half.forEach((row, y) => { for (let x = 0; x < 6; x++) { const c = C[row[x]]; if (!c) continue; for (const xx of [x, 11 - x]) sp += `<rect x="${xx * S}" y="${y * S}" width="${S}" height="${S}" fill="${c}"/>`; } });
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:PS;src:url(${A}press-start-2p/press-start-2p-latin-400-normal.woff2);font-display:block}
:root{--bg:#6a3dff;--ink:#0c0a1a;--gold:#ffc83d;--red:#ff3b4e;--ice:#ece8ff}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--bg)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(236,232,255,.14) 3px,transparent 3px),linear-gradient(90deg,rgba(236,232,255,.14) 3px,transparent 3px);background-size:60px 60px}
.hero{position:absolute;left:240px;top:440px;filter:drop-shadow(16px 16px 0 #1a0f55)}
.br{position:absolute;width:90px;height:90px;border:14px solid var(--red)}
.rec{position:absolute;left:760px;top:410px;font:400 34px PS;color:var(--red);background:var(--ink);padding:12px 18px;border:6px solid var(--red)}
.tb{position:absolute;left:0;right:0;top:1090px;height:400px;background:var(--ink);border-top:14px solid var(--red)}
.t1{position:absolute;left:90px;top:1150px;font:400 148px/1 PS;color:var(--red);white-space:nowrap;text-shadow:8px 8px 0 #3a0a14}
.t2{position:absolute;left:90px;top:1330px;font:400 108px/1 PS;color:var(--gold);white-space:nowrap;text-shadow:7px 7px 0 #5a3d00}
.logo{position:absolute;left:90px;top:300px;width:110px;height:110px;border-radius:50%;background:var(--ink);border:6px solid var(--ice);color:var(--ice);padding:24px}
.face{position:absolute;left:775px;top:1462px;width:210px;height:210px;border-radius:50%;object-fit:cover;border:10px solid var(--gold);box-shadow:0 0 0 8px var(--ink)}
</style><body><div class="grid"></div>
<div class="logo">${oai}</div>
<div class="br" style="left:200px;top:400px;border-right:0;border-bottom:0"></div><div class="br" style="left:840px;top:400px;border-left:0;border-bottom:0;display:none"></div>
<div class="br" style="left:200px;top:1000px;border-right:0;border-top:0"></div><div class="br" style="left:790px;top:1000px;border-left:0;border-top:0"></div>
<div class="br" style="left:790px;top:400px;border-left:0;border-bottom:0"></div>
<div class="rec"><i style="display:inline-block;width:22px;height:22px;border-radius:50%;background:var(--red);margin-right:14px"></i>REC</div>
<svg class="hero" width="${12 * S}" height="${12 * S}" viewBox="0 0 ${12 * S} ${12 * S}" shape-rendering="crispEdges" style="left:240px;top:450px;width:600px;height:600px">${sp}</svg>
<div class="tb"></div><div class="t1">CAUGHT</div><div class="t2">CHEATING</div>
<img class="face" src="../reel-app/public/profile.jpg">
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(500);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
