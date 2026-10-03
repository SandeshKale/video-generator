// Throwaway mockup of the "Incident File" visual system — 3 representative scenes (delete once build.mjs supersedes).
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const css = `
@font-face{font-family:'Barlow';font-weight:800;src:url('../assets/fonts/barlow-condensed/barlow-condensed-latin-800-normal.woff2');}
@font-face{font-family:'Barlow';font-weight:600;src:url('../assets/fonts/barlow-condensed/barlow-condensed-latin-600-normal.woff2');}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2');}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');}
:root{--y:#ffd400;--r:#ff3b2f;--ink:#0d0c0b;--paper:#e9e3d2;--cream:#f2eee3;}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1920px;background:#000;overflow:hidden;font-family:Inter}
.bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:saturate(.85) contrast(1.08)}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,6,5,.62),rgba(8,6,5,.25) 38%,rgba(8,6,5,.55) 70%,rgba(8,6,5,.92))}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 2px,transparent 2px 5px);mix-blend-mode:multiply}
.vig{position:absolute;inset:0;box-shadow:inset 0 0 260px 40px rgba(0,0,0,.75)}
.brk{position:absolute;width:70px;height:70px;border:5px solid var(--y);opacity:.9}
.tl{left:70px;top:150px;border-right:0;border-bottom:0}.tr{right:70px;top:150px;border-left:0;border-bottom:0}
.bl{left:70px;bottom:400px;border-right:0;border-top:0}.br{right:70px;bottom:400px;border-left:0;border-top:0}
.hud{position:absolute;left:150px;top:176px;font:700 26px JBMono;letter-spacing:.12em;color:var(--y);display:flex;gap:18px;align-items:center}
.rec{width:20px;height:20px;border-radius:50%;background:var(--r);box-shadow:0 0 14px var(--r)}
.tc{position:absolute;right:170px;top:176px;font:700 26px JBMono;color:#f2eee3;opacity:.85}
.disp{font-family:Barlow;font-weight:800;text-transform:uppercase;line-height:.88;letter-spacing:.01em}
.tape{display:inline-block;background:var(--y);color:var(--ink);padding:10px 26px 6px;transform:rotate(-1.6deg);box-shadow:0 10px 30px rgba(0,0,0,.55)}
.cap{position:absolute;left:150px;right:170px;bottom:430px;text-align:center;font:700 50px/1.18 Inter;color:#f2eee3;text-shadow:0 4px 20px rgba(0,0,0,.95)}
.cap b{color:var(--y);font-weight:700}
.log{font:700 30px/1.7 JBMono;color:#d9d4c4}.log .ok{color:#8a8576}.log .bad{color:var(--r)}.log .y{color:var(--y)}
`;
const hud = (cam, tc) => `<div class="hud"><span class="rec"></span>${cam}</div><div class="tc">${tc}</div><div class="brk tl"></div><div class="brk tr"></div><div class="brk bl"></div><div class="brk br"></div>`;
const base = (img, inner, extra = '') => `<!doctype html><meta charset=utf8><style>${css}${extra}</style><body><div class=bg style="background-image:url(shots/${img}.png)"></div><div class=shade></div><div class=scan></div><div class=vig></div>${inner}</body>`;

const A = base('aisle', `${hud('CAM 04 · SANDBOX-EVAL', 'JUL 2026 · 03:14:07')}
<div style="position:absolute;left:150px;right:170px;top:420px">
 <div class="disp" style="font-size:236px;color:var(--cream);text-shadow:0 8px 40px rgba(0,0,0,.8)">Contain-<br>ment</div>
 <div class="disp" style="font-size:236px;margin-top:6px"><span class="tape" style="background:var(--r);color:#fff7ee">Breach</span></div>
 <div class="log" style="margin-top:70px;background:rgba(10,8,7,.72);border-left:8px solid var(--y);padding:26px 34px">
  <div><span class="y">&gt;</span> sandbox .......... <span class="bad">ESCAPED</span></div>
  <div><span class="y">&gt;</span> egress filter ..... <span class="bad">BYPASSED</span></div>
  <div><span class="y">&gt;</span> target ............ <span class="y">huggingface</span><span class="y"> ▌</span></div></div></div>
<div class="cap">OpenAI's own agents <b>broke out</b> of their test environment.</div>`);

let dots = ''; const lit = new Set([2, 9, 13, 17, 21, 26, 30, 33, 38, 41, 45, 50, 52, 7, 24, 36, 47, 54, 5, 19, 28, 43, 11, 15, 31, 40, 48, 3, 22, 35, 49, 1, 8, 12, 20, 25, 29, 37, 42, 46, 51, 53, 4, 10, 16, 23, 27, 32, 34, 39, 44, 0, 6, 14, 18]);
for (let i = 0; i < 55; i++) dots += `<i style="${true ? 'background:var(--r);box-shadow:0 0 16px var(--r)' : 'background:#3a3732'}"></i>`;
const B = base('grid', `${hud('CAM 11 · WEB-TRAFFIC', 'SEP 2026 · 22:41:55')}
<div style="position:absolute;left:150px;right:170px;top:250px">
 <div class="disp" style="font-size:340px;color:var(--y);line-height:.8;text-shadow:0 10px 50px rgba(0,0,0,.8)">55</div>
 <div class="disp" style="font-size:76px;color:var(--cream);margin-top:6px">websites showed agent traffic</div>
 <div style="margin-top:30px;background:rgba(10,8,7,.74);padding:24px 28px;border:2px solid #4a463d"><div class="grid">${dots}</div></div>
 <div style="margin-top:26px;display:flex;gap:18px"><span class="tape disp" style="font-size:54px">SEC</span><span class="tape disp" style="font-size:54px;transform:rotate(1.4deg)">CDC</span><span class="tape disp" style="font-size:54px">Census</span></div>
 <div style="margin-top:18px;font:700 22px JBMono;color:#b9b3a2;letter-spacing:.06em">OBSERVED BY INDEPENDENT RESEARCHERS · NOT CONFIRMED BREACHES</div></div>
<div class="cap">Independent researchers found agent traffic on <b>fifty-five</b> websites.</div>`, `.grid{display:grid;grid-template-columns:repeat(11,1fr);gap:12px}.grid i{aspect-ratio:1;border-radius:50%;display:block}`);

const file = (tab, head, stamp, c, rot, top) => `<div class="file" style="top:${top}px;transform:rotate(${rot}deg)"><div class="tabf" style="background:${c}">${tab}</div>
<div class="body"><div class="disp" style="font-size:70px;color:#1a1814">${head}</div>
<div class="redact"><s style="width:62%"></s><s style="width:84%"></s><s style="width:41%"></s></div>
<div class="stamp" style="color:${c === 'var(--y)' ? '#b80f05' : '#b80f05'}">${stamp}</div></div></div>`;
const C = base('control', `${hud('CAM 07 · REGULATORS', 'OCT 2026 · 09:02:31')}
${file('CASE FILE 01', 'California AG', 'SUBPOENA SERVED', 'var(--y)', -2, 330)}
${file('CASE FILE 02', 'FTC', 'INDUSTRY-WIDE PROBE', 'var(--y)', 1.6, 640)}
${file('CASE FILE 03', '15 states', 'RECORDS REQUESTED', 'var(--y)', -1.2, 950)}
<div class="cap" style="bottom:430px">A <b>subpoena</b>, a federal probe, and fifteen states.</div>`,
  `.file{position:absolute;left:150px;right:170px;filter:drop-shadow(0 22px 34px rgba(0,0,0,.65))}
.tabf{display:inline-block;font:700 26px JBMono;letter-spacing:.14em;color:#1a1814;padding:10px 28px 8px;border-radius:14px 14px 0 0}
.body{background:var(--paper);padding:26px 34px 30px;position:relative;border-radius:0 8px 8px 8px;background-image:linear-gradient(180deg,rgba(255,255,255,.35),rgba(0,0,0,.06))}
.redact{margin:18px 0 6px;display:flex;flex-direction:column;gap:11px}.redact s{display:block;height:20px;background:#15130f}
.stamp{position:absolute;right:26px;bottom:20px;font:800 40px/1 Barlow;letter-spacing:.06em;border:5px solid #b80f05;padding:6px 16px 3px;transform:rotate(-7deg);opacity:.92;text-transform:uppercase}`);

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [n, h] of [['A-breach', A], ['B-55sites', B], ['C-regulators', C]]) {
  await writeFile(`mock-${n}.html`, h);
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto(`file://${process.cwd()}/mock-${n}.html`); await p.waitForTimeout(500);
  await p.screenshot({ path: `mock-${n}.png` }); await p.close();
}
await b.close();
