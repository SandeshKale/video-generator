// Cover v2 (grid-first rules): LiDAR Survey look. Hero = the real NASA HLS plate (clouds filled) with the traced chain in amber; title "99.98% UNDERWATER"; nerdlogic.co chip.
import { writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url)), A = '../../../assets/fonts/';
const CHP = [[720, 590], [760, 610], [830, 650], [900, 700], [980, 735], [1060, 760], [1150, 775], [1220, 755], [1280, 720]];
const cx0 = 620, cy0 = 400, cw = 760, ch = 555, W = 960, Hh = 640, k = W / cw;   /* crop of the plate shown in the card */
const pts = CHP.map(([x, y]) => `${((x - cx0) * k).toFixed(1)},${((y - cy0) * (Hh / ch)).toFixed(1)}`).join(' ');
let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; let dots = '';
for (let i = 0; i < 7; i++) { const x0 = 60 + i * 120 + rnd() * 30; for (let j = 0; j < 40; j++) { const t = j / 39, x = x0 + t * 260 - 130 * 0, y = 40 + t * 560; dots += `<circle cx="${(x + (rnd() - .5) * 8).toFixed(1)}" cy="${(y + (rnd() - .5) * 8).toFixed(1)}" r="${(1.6 + rnd() * 1.8).toFixed(1)}" fill="#e2f3dc" opacity="${(.45 + rnd() * .5).toFixed(2)}"/>`; } }
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Plex;font-weight:600;src:url(site3d2/fonts/plex-600.woff2);font-display:block}
:root{--bg:#05080a;--am:#ffb347;--fr:#d4fff0;--lime:#b4f000}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--bg)}
.grid{position:absolute;inset:0;background:linear-gradient(rgba(212,255,240,.05) 2px,transparent 2px) 0 0/90px 90px,linear-gradient(90deg,rgba(212,255,240,.05) 2px,transparent 2px) 0 0/90px 90px}
.card{position:absolute;left:60px;top:430px;width:960px;height:640px;border:6px solid var(--fr);box-shadow:0 0 0 12px var(--bg),0 0 60px 6px rgba(212,255,240,.18);overflow:hidden;background:url(cover-assets/hls-clean.png) -${cx0 * k}px -${cy0 * (Hh / ch)}px/${2048 * k}px ${960 * (Hh / ch)}px no-repeat}
svg{position:absolute;left:0;top:0}
.n{position:absolute;left:52px;top:1108px;font:400 222px/1 Anton;color:var(--am);letter-spacing:-.01em;text-shadow:0 6px 0 rgba(0,0,0,.5)}
.t{position:absolute;left:56px;top:1318px;font:400 118px/1 Anton;color:#eef7ee;white-space:nowrap}
.tag{position:absolute;left:60px;top:392px;padding:10px 20px;background:var(--bg);border:3px solid var(--am);color:var(--am);font:600 30px/1 Plex;letter-spacing:.1em}
.face{position:absolute;left:800px;top:1215px;width:200px;height:200px;border-radius:50%;object-fit:cover;border:8px solid var(--lime);box-shadow:0 0 0 8px var(--bg),0 0 40px 6px rgba(180,240,0,.4)}
.hn{position:absolute;left:760px;top:1432px;width:280px;text-align:center;font:600 30px/1 Plex;color:var(--fr);letter-spacing:.04em}
</style><body><div class="grid"></div><div class="card"><svg width="960" height="640" viewBox="0 0 960 640"><g>${dots}</g><polyline points="${pts}" fill="none" stroke="#ffb347" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
<div class="tag">RAM SETU · REAL NASA DATA</div><div class="n">99.98%</div><div class="t">UNDERWATER</div><img class="face" src="site3d2/img/profile.jpg"><div class="hn">nerdlogic.co</div></body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(700); await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
