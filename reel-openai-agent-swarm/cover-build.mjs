// Standalone cover: giant Astra sprite catching a falling STARDUST.BOT file (not in the reel), title lockup, handle.
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const here = new URL('.', import.meta.url).pathname;
const sprite = (col, dark, hi, size) => { const half = ['..oooo', '.obbbb', 'obbhhh', 'obeeeb', 'obbbbb', '.oooob', '..obbb', '.obbbb', 'obbooo', 'obbo..', 'obbo..', '.ooo..']; const C = { o: dark, b: col, h: hi, e: '#0c0a1a' }; let r = ''; half.forEach((row, y) => { for (let x = 0; x < 6; x++) { const c = C[row[x]]; if (!c) continue; r += `<rect x="${x * size}" y="${y * size}" width="${size}" height="${size}" fill="${c}"/><rect x="${(11 - x) * size}" y="${y * size}" width="${size}" height="${size}" fill="${c}"/>`; } }); return `<svg width="${12 * size}" height="${12 * size}" viewBox="0 0 ${12 * size} ${12 * size}" shape-rendering="crispEdges">${r}</svg>`; };
const html = `<!doctype html><meta charset="utf8"><style>
@font-face{font-family:'PS';src:url('assets/fonts/press-start-2p/press-start-2p-latin-400-normal.woff2')}
@font-face{font-family:'VT';src:url('assets/fonts/vt323/vt323-latin-400-normal.woff2')}
@font-face{font-family:'Inter';font-weight:700;src:url('assets/fonts/inter/inter-latin-700-normal.woff2')}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:#0c0a1a;position:relative;color:#ece8ff;font-family:VT}
.bg{position:absolute;inset:0;background:radial-gradient(90% 55% at 50% 35%,#2f1f72 0%,#140f33 58%,#0c0a1a 100%)}
.tiles{position:absolute;inset:0;background-image:linear-gradient(rgba(139,92,255,.18) 2px,transparent 2px),linear-gradient(90deg,rgba(139,92,255,.18) 2px,transparent 2px);background-size:60px 60px}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.2) 0 2px,transparent 2px 5px);z-index:50}
.abs{position:absolute}.ps{font-family:PS;text-transform:uppercase;line-height:1.2}
.file{position:absolute;left:560px;top:250px;width:300px;background:#171233;border:8px solid #ffc83d;box-shadow:12px 12px 0 #05030f;padding:18px;transform:rotate(8deg)}
</style><div class="bg"></div><div class="tiles"></div>
<div class="abs" style="left:150px;top:150px;font-size:40px;color:#ffc83d;letter-spacing:2px">STARSKIRMISH · OCT 2</div>
<div class="abs" style="left:110px;top:440px;filter:drop-shadow(14px 14px 0 #05030f)">${sprite('#8b5cff', '#3a1f9e', '#c7b3ff', 44)}</div>
<div class="file"><div class="abs" style="left:18px;top:14px;display:none"></div><div style="display:flex;gap:16px;align-items:center">${sprite('#ffc83d', '#8a5a00', '#fff0b3', 8)}<div class="ps" style="font-size:20px;color:#ffc83d">stardust<br>.bot</div></div><div style="margin-top:14px;height:26px;border:4px solid #ece8ff;background:#0c0a1a"><div style="width:82%;height:100%;background:repeating-linear-gradient(90deg,#ffc83d 0 14px,#0c0a1a 14px 18px)"></div></div></div>
<div class="abs ps" style="left:430px;top:200px;font-size:60px;color:#ff3b4e;text-shadow:6px 6px 0 #05030f;transform:rotate(-6deg)">!!</div>
<div class="abs ps" style="left:100px;top:1060px;width:880px;font-size:82px;text-shadow:8px 8px 0 #05030f">AI CAUGHT<br><span style="color:#ff3b4e">CHEATING</span></div>
<div class="abs" style="left:100px;top:1430px;width:880px;font:700 40px/1.25 Inter;text-shadow:0 4px 16px rgba(0,0,0,.8)">GPT-6 Astra couldn't beat the best human StarCraft bot. So it downloaded it.</div>
<div class="abs ps" style="left:100px;top:1600px;font-size:18px;color:#b79cff">RULES → NO OUTSIDE CODE · REWARD HACKING</div>
<div class="abs" style="left:100px;top:1700px;display:flex;align-items:center;gap:24px"><img src="profile.jpg" style="width:104px;height:104px;object-fit:cover;border:6px solid #ffc83d;box-shadow:6px 6px 0 #05030f"><div class="ps" style="font-size:34px;white-space:nowrap">@sandesh.explains</div></div>
<div class="scan"></div>`;
writeFileSync(`${here}cover.html`, html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(`file://${here}cover.html`); await p.waitForTimeout(800); await p.screenshot({ path: `${here}cover.png` }); await b.close(); console.log('cover.png');
