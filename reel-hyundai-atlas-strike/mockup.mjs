// Throwaway mockup of the "Spec Sheet / Teardown" visual system — 4 scenes (delete once build.mjs supersedes).
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const css = `
@font-face{font-family:'Fr';font-weight:900;src:url('../assets/fonts/fraunces/fraunces-latin-900-normal.woff2');}
@font-face{font-family:'Fr';font-weight:900;font-style:italic;src:url('../assets/fonts/fraunces/fraunces-latin-900-italic.woff2');}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2');}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');}
:root{--paper:#f1ede4;--ink:#101114;--cob:#2f5cff;--org:#ff5a1f;--mut:#8a857a;}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--paper);font-family:Inter;color:var(--ink)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(16,17,20,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(16,17,20,.07) 1px,transparent 1px);background-size:54px 54px}
.grid2{position:absolute;inset:0;background-image:linear-gradient(rgba(16,17,20,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(16,17,20,.05) 1px,transparent 1px);background-size:270px 270px;background-position:27px 27px;mix-blend-mode:multiply}
.top{position:absolute;left:150px;right:162px;top:150px;display:flex;justify-content:space-between;font:700 22px JBMono;letter-spacing:.1em;color:var(--ink)}
.top b{color:var(--cob)}
.rule{position:absolute;left:150px;right:162px;top:192px;border-top:3px solid var(--ink)}
.fr{font-family:Fr;font-weight:900;letter-spacing:-.03em;line-height:.94}
.mono{font-family:JBMono;font-weight:700}
.print{position:absolute;background:#fff;padding:14px 14px 46px;box-shadow:0 22px 40px rgba(16,17,20,.28),0 2px 0 rgba(16,17,20,.1)}
.print .ph{width:100%;height:100%;background-size:cover;background-position:center;filter:contrast(1.05) saturate(.95)}
.print .cap{position:absolute;left:14px;right:14px;bottom:12px;font:700 15px JBMono;letter-spacing:.1em;color:var(--mut)}
.tape{position:absolute;width:120px;height:34px;background:rgba(255,220,120,.72);transform:rotate(-8deg);box-shadow:0 2px 6px rgba(0,0,0,.2)}
.stamp{position:absolute;border:6px solid var(--org);color:var(--org);font:900 44px/1 Fr;letter-spacing:-.01em;padding:8px 20px;text-transform:uppercase;transform:rotate(-8deg);background:rgba(241,237,228,.6)}
.chip{display:inline-block;font:700 22px JBMono;letter-spacing:.08em;padding:10px 18px;border:2.5px solid var(--ink);background:var(--paper)}
.cap-pill{position:absolute;left:150px;right:162px;bottom:455px;display:flex;justify-content:center}
.cap-pill div{background:rgba(16,17,20,.9);color:#f1ede4;border-radius:16px;padding:14px 28px 16px;font:700 46px/1.2 Inter;text-align:center}
.cap-pill b{color:#ffb08f;font-weight:700}
.co{position:absolute;font:700 20px JBMono;letter-spacing:.08em}
.dot{position:absolute;width:22px;height:22px;border:3px solid var(--org);border-radius:50%;background:var(--paper)}
.dot::after{content:'';position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;background:var(--org);border-radius:50%}
`;
const page = (inner) => `<!doctype html><meta charset=utf8><style>${css}</style><body><div class=grid></div><div class=grid2></div>${inner}</body>`;
const hdr = (n, r = 'REV A') => `<div class=top><span>SPEC SHEET Nº <b>${n}</b> · ATLAS × HYUNDAI</span><span>${r}</span></div><div class=rule></div>`;

// A: hook
const A = page(`${hdr('01')}
<div class=fr style="position:absolute;left:150px;top:250px;font-size:128px;width:800px">They went<br>on strike.</div>
<div class=fr style="position:absolute;left:150px;top:520px;font-size:128px;color:var(--org);font-style:italic;width:800px">Over a<br>robot.</div>
<div class=print style="left:420px;top:790px;width:500px;height:640px;transform:rotate(3deg)"><div class=tape style="left:-30px;top:-14px"></div><div class=tape style="right:-30px;top:-10px;transform:rotate(9deg)"></div><div class=ph style="background-image:url(shots/atlas-hero.png)"></div><div class=cap>FIG. 1 · ATLAS (PRODUCTION)</div></div>
<div class=stamp style="left:150px;top:880px">First of its kind</div>
<div class="chip mono" style="position:absolute;left:150px;top:1060px">ULSAN · JULY 13–15</div>
<div class="chip mono" style="position:absolute;left:150px;top:1130px;background:var(--ink);color:var(--paper)">~40,000 MEMBERS</div>
<div class=dot style="left:735px;top:900px"></div><div style="position:absolute;left:560px;top:911px;width:175px;border-top:3px solid var(--org)"></div><div class=co style="left:420px;top:880px;color:var(--org)">ROBOT</div>
<div class=cap-pill><div>Workers at Hyundai just went on <b>strike.</b></div></div>`);

// B: teardown
const B = page(`${hdr('02')}
<div class=print style="left:150px;top:250px;width:470px;height:880px;transform:rotate(-1.5deg)"><div class=tape style="left:-26px;top:-12px"></div><div class=ph style="background-image:url(shots/atlas-hero.png);background-position:50% 30%"></div><div class=cap>FIG. 2 · ATLAS, TEARDOWN</div></div>
<svg style="position:absolute;left:0;top:0" width="1080" height="1920"><g stroke="#2f5cff" stroke-width="3" fill="none"><path d="M120 300V1090"/><path d="M104 300h32M104 1090h32"/></g>
<g stroke="#ff5a1f" stroke-width="3" fill="none"><path d="M360 470H640L660 440H880"/><path d="M400 680H640L660 650H880"/><path d="M380 860H640L660 830H880"/><path d="M420 1010H640L660 980H880"/></g></svg>
<div class=dot style="left:349px;top:459px"></div><div class=dot style="left:389px;top:669px"></div><div class=dot style="left:369px;top:849px"></div><div class=dot style="left:409px;top:999px"></div>
<div class=mono style="position:absolute;left:30px;top:640px;transform:rotate(-90deg);transform-origin:left top;width:300px;font-size:22px;color:var(--cob)">190 CM · 6′2″</div>
<div style="position:absolute;left:660px;top:370px"><div class=fr style="font-size:104px">56</div><div class=mono style="font-size:20px;color:var(--mut)">DEGREES OF FREEDOM</div></div>
<div style="position:absolute;left:660px;top:580px"><div class=fr style="font-size:104px;color:var(--cob)">50<span style="font-size:48px"> kg</span></div><div class=mono style="font-size:20px;color:var(--mut)">PAYLOAD · 30 KG SUSTAINED</div></div>
<div style="position:absolute;left:660px;top:760px"><div class=fr style="font-size:104px">4<span style="font-size:48px"> hrs</span></div><div class=mono style="font-size:20px;color:var(--mut)">BATTERY · 3-MIN SWAP</div></div>
<div style="position:absolute;left:660px;top:910px"><div class=chip style="font-size:20px;border-color:var(--org);color:var(--org)">REACH 2.3 M</div></div>
<div class=cap-pill><div>Meet Atlas. Six foot two. <b>Fifty-six</b> joints.</div></div>`);

// C: price ladder
const C = page(`${hdr('04')}
<div class=fr style="position:absolute;left:150px;top:250px;font-size:92px;width:800px">What does one<br>cost? <span style="color:var(--org);font-style:italic">Nobody says.</span></div>
<div class=mono style="position:absolute;left:150px;top:470px;font-size:21px;color:var(--mut)">NO OFFICIAL PRICE · ANALYST ESTIMATES</div>
<div style="position:absolute;left:150px;top:540px;width:360px;height:500px;background:var(--cob);box-shadow:8px 8px 0 var(--ink)"><div class=fr style="color:#fff;font-size:76px;padding:24px 22px">$130–<br>140K</div><div class=mono style="color:#cfd8ff;padding:0 22px;font-size:19px;line-height:1.5">EARLY UNITS<br>(ANALYST EST.)</div></div>
<div style="position:absolute;left:560px;top:880px;width:358px;height:160px;background:var(--org);box-shadow:8px 8px 0 var(--ink)"><div class=fr style="color:#fff;font-size:76px;padding:20px 22px 0">~$30K</div><div class=mono style="color:#ffe2d6;padding:0 22px;font-size:19px">HYUNDAI'S TARGET</div></div>
<svg style="position:absolute;left:0;top:0" width="1080" height="1920"><path d="M520 600C560 600 540 760 560 900" stroke="#101114" stroke-width="4" fill="none" stroke-dasharray="10 8"/><path d="M552 884l8 22 14-18" stroke="#101114" stroke-width="4" fill="none"/></svg>
<div style="position:absolute;left:150px;top:1090px;width:768px"><div class=mono style="font-size:20px;margin-bottom:10px">…AFTER 50,000 ROBOTS BUILT</div><div style="height:34px;border:3px solid var(--ink);position:relative;background:#fff"><div style="position:absolute;left:0;top:0;bottom:0;width:6%;background:var(--org)"></div></div><div class=mono style="display:flex;justify-content:space-between;font-size:18px;margin-top:8px"><span>0</span><span>25,000</span><span>50,000</span></div></div>
<div class=chip style="position:absolute;left:150px;top:1190px;font-size:20px">BOSTON DYNAMICS: PARTS COST −60 TO −80%</div>
<div class=print style="left:690px;top:300px;width:230px;height:290px;transform:rotate(5deg);padding:8px 8px 30px"><div class=tape style="left:50px;top:-16px;width:90px;height:26px"></div><div class=ph style="background-image:url(shots/robot-factory-line.png)"></div></div>
<div class=cap-pill><div>Analysts say about <b>a hundred and thirty thousand</b> dollars.</div></div>`);

// D: settlement receipt
const D = page(`${hdr('09')}
<div style="position:absolute;left:150px;top:240px;width:768px;background:#fffdf8;box-shadow:0 20px 40px rgba(16,17,20,.25);padding:34px 40px 40px;transform:rotate(-.8deg)">
 <div class=mono style="font-size:19px;letter-spacing:.12em;color:var(--mut)">RECEIPT · HYUNDAI MOTOR × UNION · AUG 2026</div>
 <div style="border-top:3px dashed var(--ink);margin:16px 0"></div>
 ${[['BASE PAY', '+₩100,000 /mo'], ['BONUS', '> 400% of monthly pay'], ['RETIREMENT AGE', '60 → 65*'], ['NEW TECHNICAL JOBS', '+500 in 2 yrs'], ['ROBOT PLANS', 'shared with union']].map(([k, v], i) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:13px 0;border-bottom:2px solid rgba(16,17,20,.12)"><span class=mono style="font-size:22px">${k}</span><span class=fr style="font-size:${i === 3 ? 50 : 38}px;color:${i === 3 ? 'var(--cob)' : 'var(--ink)'}">${v}</span></div>`).join('')}
 <div class=mono style="font-size:15px;color:var(--mut);margin-top:12px">*DEPENDS ON LEGAL CHANGES</div>
 <div style="margin-top:22px"><div class=mono style="font-size:19px;margin-bottom:8px">UNION VOTE · AUG 31 · 31,166 BALLOTS</div><div style="display:flex;height:46px;border:3px solid var(--ink)"><div style="width:61.55%;background:var(--cob)"></div><div style="flex:1;background:var(--org)"></div></div><div class=mono style="display:flex;justify-content:space-between;font-size:20px;margin-top:6px"><span style="color:var(--cob)">61.55% YES</span><span style="color:var(--org)">38.23% NO</span></div></div>
</div>
<div class=stamp style="left:640px;top:210px;font-size:54px;border-color:var(--cob);color:var(--cob);transform:rotate(10deg)">Settled</div>
<div class=cap-pill><div>A raise. Retirement at sixty-five. <b>Five hundred</b> new jobs.</div></div>`);

// E: CTA
const E = page(`${hdr('11', 'END')}
<div class=print style="left:560px;top:260px;width:360px;height:460px;transform:rotate(4deg)"><div class=tape style="left:100px;top:-14px"></div><div class=ph style="background-image:url(shots/robot-silhouette.png)"></div><div class=cap>FIG. 11 · NEXT SHIFT?</div></div>
<div class=fr style="position:absolute;left:150px;top:260px;font-size:84px;width:420px">Would you work next to one?</div>
<div style="position:absolute;left:150px;top:560px;display:flex;gap:14px"><span class=chip style="background:var(--cob);color:#fff;border-color:var(--cob)">YES</span><span class=chip style="background:var(--org);color:#fff;border-color:var(--org)">NO</span></div>
<div style="position:absolute;left:150px;top:800px;display:flex;align-items:center;gap:30px"><div style="width:230px;height:230px;border-radius:50%;padding:7px;background:conic-gradient(var(--cob),#9fb5ff,var(--org),var(--cob))"><img src="../reel-app/public/profile.jpg" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:6px solid var(--paper)"></div><div><div class=mono style="font-size:20px;color:var(--mut);letter-spacing:.14em">NEW BREAKDOWN EVERY WEEK</div><div class=fr style="font-size:62px;margin-top:8px">@sandesh<br>.explains</div></div></div>
<div style="position:absolute;left:150px;top:1120px;display:inline-flex;align-items:center;gap:18px;background:var(--ink);color:var(--paper);padding:22px 52px;box-shadow:8px 8px 0 var(--cob)"><span class=fr style="font-size:52px;color:var(--paper)">FOLLOW</span><span style="font-size:48px">＋</span></div>
<div class=cap-pill><div>Follow for <b>what happens next.</b></div></div>`);

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [n, h] of [['A-hook', A], ['B-teardown', B], ['C-price', C], ['D-receipt', D], ['E-cta', E]]) {
  await writeFile(`mock-${n}.html`, h);
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto(`file://${process.cwd()}/mock-${n}.html`); await p.waitForTimeout(600);
  await p.screenshot({ path: `mock-${n}.png` }); await p.close();
}
await b.close();
