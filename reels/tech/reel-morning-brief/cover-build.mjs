// Grid-first cover: sunrise ground (indigo -> coral -> butter, the reel's own wall-clock sky), one still life the reel
// never shows — a folded "7 a.m. Edition" lying under the Blender alarm clock with its hands on 7:00 — then the ink title
// block "WRITTEN WHILE I SLEPT." (4 words, Anton), the "7 A.M." corner badge and the face chip bottom-right.
// Run: bun cover-build.mjs
import { writeFileSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';
const J = JSON.parse(readFileSync(new URL('./site/3d/clock.json', import.meta.url)));
const K = 540 / J.w, CX = 545, CY = 340;   // clock image placed at (CX, CY), scaled to 560 px wide
function at(a, r) { const c = J.c, x = J.x, y = J.y; return [CX + (c[0] + (y[0] - c[0]) * Math.cos(a) * r + (x[0] - c[0]) * Math.sin(a) * r) * K, CY + (c[1] + (y[1] - c[1]) * Math.cos(a) * r + (x[1] - c[1]) * Math.sin(a) * r) * K]; }
const C = [CX + J.c[0] * K, CY + J.c[1] * K], H = at(7 / 12 * 2 * Math.PI, .5), M = at(0, .78), w = Math.hypot(J.x[0] - J.c[0], J.x[1] - J.c[1]) * K;
const hands = `<line x1="${C[0]}" y1="${C[1]}" x2="${H[0]}" y2="${H[1]}" stroke="#1d1d24" stroke-width="${w * .09}" stroke-linecap="round"/><line x1="${C[0]}" y1="${C[1]}" x2="${M[0]}" y2="${M[1]}" stroke="#1d1d24" stroke-width="${w * .06}" stroke-linecap="round"/><circle cx="${C[0]}" cy="${C[1]}" r="${w * .07}" fill="#ff5a3c"/>`;
const col = (h) => `<div class="c"><h4>${h}</h4>${[92, 78, 86, 64, 80].map((v) => `<i style="width:${v}%"></i>`).join('')}</div>`;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('site/fonts/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'NR';font-weight:800;src:url('site/fonts/newsreader-latin-800-normal.woff2');font-display:block}
@font-face{font-family:'RM';font-weight:700;src:url('site/fonts/red-hat-mono-latin-700-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{position:relative;background:linear-gradient(180deg,#2b2f6e 0,#6b5a9e 16%,#d9849a 34%,#ff9b7a 52%,#ffc89a 70%,#ffe9c8 100%)}
.sun{position:absolute;left:140px;top:560px;width:800px;height:800px;border-radius:50%;background:radial-gradient(rgba(255,240,200,.85),rgba(255,200,140,.25) 45%,transparent 70%)}
.np{position:absolute;left:80px;top:610px;width:640px;height:430px;transform:rotate(-7deg);background:#fffaf1;border-radius:4px;padding:26px 32px;box-shadow:0 30px 50px rgba(90,30,40,.4)}
.np:after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:linear-gradient(90deg,rgba(0,0,0,.05),rgba(0,0,0,.14),rgba(0,0,0,.05))}
.mh{font:800 54px/1 NR;letter-spacing:-.03em;color:#1d1d24;border-bottom:6px double #1d1d24;padding-bottom:12px}
.cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:20px}
.c h4{font:700 17px RM;letter-spacing:.14em;color:#ff5a3c;border-bottom:2px solid #1d1d24;padding-bottom:6px;margin-bottom:12px}
.c i{display:block;height:14px;border-radius:7px;background:#e3d9c8;margin-bottom:14px}
.clk{position:absolute;left:${CX}px;top:${CY}px;width:540px;filter:drop-shadow(0 30px 34px rgba(90,30,40,.4));-webkit-mask:radial-gradient(closest-side,#000 70%,transparent 100%)}
.hs{position:absolute;left:0;top:0}
.bd{position:absolute;left:90px;top:440px;transform:rotate(-4deg);background:#1d1d24;color:#fffaf1;font:700 50px/1 RM;letter-spacing:.06em;padding:14px 22px;border-radius:8px;box-shadow:0 12px 24px rgba(0,0,0,.35)}
.bd b{color:#ff8a6a}
.blk{position:absolute;left:60px;right:60px;top:1100px;height:400px;background:#1d1d24;border-radius:14px;padding:40px 46px;box-shadow:0 22px 50px rgba(60,20,30,.45);border-top:6px double #fffaf1}
.t{font:400 142px/1.08 AN;color:#fff4e8;text-transform:uppercase}.t b{font-weight:400;color:#1d1d24;background:#ff8a6a;padding:0 16px;display:inline-block;line-height:1.06;margin-top:8px}
.face{position:absolute;right:84px;top:1330px;width:170px;height:170px;border-radius:50%;border:10px solid #fffaf1;box-shadow:0 0 0 6px #ff5a3c,0 14px 30px rgba(0,0,0,.4);background:url(site/profile.jpg) center/cover;z-index:3}
</style><div class="sun"></div><div class="np"><div class="mh">The 7 a.m. Edition</div><div class="cols">${col('MEETINGS')}${col('NEEDS ME')}${col('PROMISED')}</div></div>
<img class="clk" src="site/3d/clock.png"><svg class="hs" width="1080" height="1920">${hands}</svg>
<div class="bd"><b>7</b> A.M.</div>
<div class="blk"><div class="t">Written while<br><b>I slept.</b></div></div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(900);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
