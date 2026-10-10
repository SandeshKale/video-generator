// Throwaway mockup of the "Highway Signage" system: scenes 1, 3, 6. Delete once the full build supersedes it.
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const here = dirname(fileURLToPath(import.meta.url)), A = '../../assets/fonts/';
const bg = (n, fb) => existsSync(join(here, '../shots', n + '.png')) ? `url(../shots/${n}.png)` : fb;
const css = `
@font-face{font-family:AB;src:url(${A}archivo-black/archivo-black-latin-400-normal.woff2);font-display:block}
@font-face{font-family:DM;font-weight:500;src:url(${A}dm-mono/dm-mono-latin-500-normal.woff2);font-display:block}
@font-face{font-family:IN;font-weight:700;src:url(${A}inter/inter-latin-700-normal.woff2);font-display:block}
@font-face{font-family:IS;font-style:italic;src:url(${A}instrument-serif/instrument-serif-latin-400-italic.woff2);font-display:block}
:root{--as:#15181c;--wh:#f4f6f2;--gr:#0a6b43;--am:#ffb400;--rd:#e5322d}
*{box-sizing:border-box;margin:0}body{background:#000;display:flex;gap:0}
.f{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--as);flex:none}
.ph{position:absolute;inset:0;background-size:cover;background-position:center}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(21,24,28,.78) 0%,rgba(21,24,28,.28) 28%,rgba(21,24,28,.35) 62%,rgba(21,24,28,.9) 100%)}
.vig{position:absolute;inset:0;box-shadow:inset 0 0 260px 40px rgba(0,0,0,.55)}
.a{position:absolute}
.road{left:150px;top:0;bottom:0;width:6px;background:repeating-linear-gradient(180deg,var(--am) 0 46px,transparent 46px 92px);opacity:.85}
.sign{position:absolute;background:var(--gr);color:var(--wh);border:8px solid var(--wh);border-radius:22px;box-shadow:0 0 0 6px var(--gr),0 18px 40px rgba(0,0,0,.45);
 background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.06) 0 3px,transparent 3px 14px)}
.sign:after{content:"";position:absolute;inset:6px;border:2px solid rgba(255,255,255,.55);border-radius:14px;pointer-events:none}
.tab{font:500 30px/1 DM;letter-spacing:.14em;padding:12px 24px;border-width:6px;border-radius:16px}
.h{font:400 80px/1 AB;letter-spacing:-.01em;padding:34px 40px;text-transform:uppercase}
.h em{font-style:normal;color:var(--am)}
.tag{position:absolute;font:500 22px/1 DM;letter-spacing:.14em;color:#fff;background:rgba(21,24,28,.85);padding:8px 12px;border-radius:6px}
.cap{position:absolute;left:90px;right:90px;top:1330px;text-align:center;font:700 54px/1.1 IN;color:var(--wh);background:var(--as);padding:18px 26px;border-radius:14px;border-bottom:6px solid var(--am)}
.cap b{color:var(--am)}
.plate{position:absolute;background:var(--wh);border:6px solid #1c1f24;border-radius:20px;box-shadow:0 14px 30px rgba(0,0,0,.5);text-align:center;color:#14171b;
 background-image:repeating-linear-gradient(45deg,rgba(0,0,0,.035) 0 2px,transparent 2px 9px)}
.plate .st{font:700 20px/1 IN;letter-spacing:.3em;color:var(--gr);margin-top:12px}
.plate .nm{font:500 120px/1.05 DM;letter-spacing:.06em;text-shadow:1px 1px 0 #fff,-1px -1px 0 rgba(0,0,0,.25)}
.ret i{position:absolute;width:56px;height:56px;border:8px solid var(--am)}
`;
const plate = (css_, big) => `<div class="plate" style="${css_}"><div class="st">ANYSTATE</div><div class="nm" style="${big ? '' : 'font-size:64px'}">ABC·1234</div></div>`;
const frame = (n, inner) => `<div class="f" id="f${n}">${inner}</div>`;
const shell = (photo, fb) => `<div class="ph" style="background-image:${bg(photo, fb)};background-color:#2a3138"></div><div class="scrim"></div><div class="vig"></div><div class="a road"></div>`;
const s1 = frame(1, shell('road_dawn', 'linear-gradient(#e8a85a,#3a4650 55%,#15181c)') +
 `<div class="sign tab" style="left:190px;top:170px">MORNING COMMUTE</div>
 <div class="sign h" style="left:190px;top:300px;width:700px">SOMEBODY'S<br>KEEPING <em>NOTES</em></div>
 <div class="a ret" style="left:380px;top:845px;width:320px;height:200px">${'<i style="left:0;top:0;border-right:0;border-bottom:0"></i><i style="right:0;top:0;border-left:0;border-bottom:0"></i><i style="left:0;bottom:0;border-right:0;border-top:0"></i><i style="right:0;bottom:0;border-left:0;border-top:0"></i>'}</div>
 ${plate('left:400px;top:870px;width:280px;height:150px', false).replace('font-size:64px','font-size:46px')}
 <div class="tag" style="left:190px;top:1250px">AI IMAGE</div>
 <div class="cap">Your car has a daily routine.<br><b>Somebody's keeping notes.</b></div>`);
const s3 = frame(3, shell('pass_pan', 'linear-gradient(#9fb0bd,#3b444c 60%,#15181c)') +
 `<div class="sign tab" style="left:190px;top:170px">WHAT THE CAMERA WRITES DOWN</div>
 <div class="plate" style="left:150px;top:540px;width:780px;height:390px"><div class="st">ANYSTATE</div><div class="nm" style="font-size:88px;margin-top:50px;white-space:nowrap;letter-spacing:0">${'ABC·1234'.split('').map(c => c === '·' ? '<span style="padding:0 8px">·</span>' : `<span style="display:inline-block;border:4px solid var(--am);margin:0 3px;padding:0 6px;border-radius:6px">${c}</span>`).join('')}</div></div>
 <div class="sign tab" style="left:190px;top:1030px;font-size:44px;padding:18px 30px">08:14</div>
 <div class="sign tab" style="left:430px;top:1090px;font-size:44px;padding:18px 30px">OAK ST</div>
 <div class="sign tab" style="left:680px;top:1030px;font-size:44px;padding:18px 30px">→ NORTH</div>
 <div class="tag" style="left:190px;top:1250px">AI IMAGE</div>
 <div class="cap">It reads your plate, then writes down<br>the <b>time</b>, the <b>place</b>, and which way.</div>`);
const s6 = frame(6, shell('desk_glow', 'linear-gradient(#0e1a22,#15181c)') +
 `<div class="sign tab" style="left:190px;top:170px">A FREE LOOKUP, THIS SUMMER</div>
 <div class="sign h" style="left:190px;top:300px;width:700px;font-size:78px">ANYONE <em>SEARCHED?</em></div>
 <div class="a" style="left:190px;top:760px;width:700px;background:var(--wh);border:8px solid var(--gr);border-radius:20px;padding:28px 34px;box-shadow:0 18px 40px rgba(0,0,0,.5)">
  <div style="font:500 24px/1 DM;letter-spacing:.2em;color:var(--gr)">YOUR PLATE</div>
  <div style="font:500 96px/1.2 DM;letter-spacing:.06em;color:#14171b">ABC·1234<span style="color:var(--am)">▌</span></div></div>
 <div class="a" style="left:190px;top:1010px;width:700px;height:92px;background:var(--am);border-radius:16px;font:400 46px/92px AB;text-align:center;color:#15181c;letter-spacing:.06em;box-shadow:0 8px 0 #b27d00">SEARCH</div>
 <div class="a" style="left:190px;top:1140px;width:700px;font:500 26px/1.4 DM;color:var(--wh);letter-spacing:.06em;text-shadow:0 2px 8px rgba(0,0,0,.8)">free site · public records · incomplete</div>
 <div class="tag" style="left:190px;top:1250px">AI IMAGE · FICTIONAL PLATE</div>
 <div class="cap">A free site let drivers type in a plate<br>and see if <b>anyone had searched it.</b></div>`);
const html = `<!doctype html><meta charset=utf8><style>${css}</style><body>${s1}${s3}${s6}</body>`;
writeFileSync(join(here, 'mock.html'), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 3240, height: 1920 } });
await p.goto('file://' + join(here, 'mock.html')); await p.waitForTimeout(900);
for (const n of [1, 3, 6]) await (await p.$('#f' + n)).screenshot({ path: join(here, `scene${n}.png`) });
await b.close(); console.log('ok');
