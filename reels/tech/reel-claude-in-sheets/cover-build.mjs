// Grid-first cover: the reel's violet cell-grid ground; one object the reel never shows — a giant selected spreadsheet cell
// (violet selection ring + fill handle) holding the Claude and Sheets marks, with three sunflower bars growing out of its top
// edge — then the plum title block "CLAUDE MOVED INTO SHEETS." (4 words, Anton), the "3 STEPS" corner badge and the face chip
// bottom-right, in the same slots as the earlier covers. Run: bun cover-build.mjs (needs bun assets-build.mjs first)
import { writeFileSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';
const A = new URL('../../../assets/', import.meta.url).pathname;
const mark = (n, col) => readFileSync(A + 'icons/simple-icons/' + n + '.svg', 'utf8').replace('<svg ', `<svg fill="${col}" width="150" height="150" `);
const bars = [[380, 210], [560, 300], [740, 400]].map(([x, h], i) =>
  `<div class="bar" style="left:${x}px;top:${770 - h}px;height:${h + 30}px"><i style="height:${[34, 48, 62][i]}%"></i></div>`).join('');
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('../../../assets/fonts/anton/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'AZ';font-weight:700;src:url('site/fonts/azeret-mono-latin-700-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{position:relative;background-color:#4b22c9;background-image:linear-gradient(rgba(255,255,255,.08) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.08) 2px,transparent 2px);background-size:180px 180px;background-position:-30px -20px}
.glow{position:absolute;left:140px;top:300px;width:800px;height:800px;border-radius:50%;background:radial-gradient(rgba(255,214,90,.42),rgba(255,195,26,.12) 45%,transparent 70%)}
.fl{position:absolute;width:176px;height:176px;background:#fff;border-radius:4px}
.bar{position:absolute;width:150px;background:#ffc31a;border:6px solid #23142d;border-bottom:none;border-radius:16px 16px 0 0;box-shadow:16px 0 0 -2px rgba(35,20,45,.35)}
.bar i{position:absolute;left:0;right:0;bottom:0;background:rgba(255,255,255,.28)}
.cell{position:absolute;left:110px;top:760px;width:860px;height:300px;transform:rotate(-3deg);background:#fbfdfc;border:6px solid #23142d;border-radius:26px;
  box-shadow:0 0 0 14px #7a3cff,0 0 0 20px #23142d,0 40px 70px rgba(20,8,60,.55);display:flex;align-items:center;justify-content:center;gap:70px}
.cell .h{position:absolute;right:-36px;bottom:-36px;width:64px;height:64px;background:#ffc31a;border:7px solid #23142d;border-radius:12px}
.cell .ref{position:absolute;left:26px;top:18px;font:700 30px AZ;letter-spacing:.12em;color:#7a3cff}
.plus{font:400 150px/1 AN;color:#23142d}
.bd{position:absolute;left:90px;top:440px;transform:rotate(-4deg);background:#23142d;color:#f6f1ff;font:700 50px/1 AZ;letter-spacing:.06em;padding:14px 22px;border-radius:8px;box-shadow:0 12px 24px rgba(0,0,0,.35)}
.bd b{color:#ffc31a}
.blk{position:absolute;left:60px;right:60px;top:1100px;height:400px;background:#23142d;border-radius:14px;padding:44px 46px;box-shadow:0 22px 50px rgba(20,8,60,.55);border-top:8px solid #ffc31a}
.t{font:400 138px/1.06 AN;color:#f6f1ff;text-transform:uppercase}.t b{font-weight:400;color:#23142d;background:#ffc31a;padding:0 16px;display:inline-block;line-height:1.04;margin-top:8px}
.face{position:absolute;right:84px;top:1330px;width:170px;height:170px;border-radius:50%;border:10px solid #f6f1ff;box-shadow:0 0 0 6px #ffc31a,0 14px 30px rgba(0,0,0,.45);background:url(site/profile.jpg) center/cover;z-index:3}
</style><div class="glow"></div>
${[[330, 160], [870, 520], [150, 1090]].map(([x, y]) => `<div class="fl" style="left:${x}px;top:${y}px;opacity:.07"></div>`).join('')}
${bars}
<div class="cell"><span class="ref">B7</span>${mark('claude', '#d97757')}<span class="plus">+</span>${mark('googlesheets', '#11a08f')}<span class="h"></span></div>
<div class="bd"><b>3</b> STEPS</div>
<div class="blk"><div class="t">Claude moved<br><b>into Sheets.</b></div></div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(900);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
