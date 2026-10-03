// Throwaway mockup of the "Control Room" visual system — 4 landscape scenes (delete once build.mjs supersedes).
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const css = `
@font-face{font-family:'Unb';font-weight:800;src:url('../assets/fonts/unbounded/unbounded-latin-800-normal.woff2');}
@font-face{font-family:'Unb';font-weight:900;src:url('../assets/fonts/unbounded/unbounded-latin-900-normal.woff2');}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2');}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');}
:root{--bg:#070b12;--org:#ff8a1f;--ice:#e6f1ff;--grn:#3dff9a;--red:#ff3355;--dim:#7f93ad;--line:#2a3a52;}
*{box-sizing:border-box;margin:0}
html,body{width:1920px;height:1080px;background:#000;overflow:hidden;font-family:Inter;color:var(--ice)}
.bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:saturate(.8) contrast(1.08) brightness(.62)}
.tint{position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,11,18,.88),rgba(7,11,18,.45) 55%,rgba(7,11,18,.8)),radial-gradient(ellipse at 20% 100%,rgba(255,138,31,.14),transparent 60%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(127,147,173,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(127,147,173,.07) 1px,transparent 1px);background-size:60px 60px}
.vg{position:absolute;inset:0;box-shadow:inset 0 0 240px 30px rgba(0,0,0,.7)}
.top{position:absolute;left:60px;right:60px;top:34px;display:flex;justify-content:space-between;align-items:center;font:700 20px JBMono;letter-spacing:.12em;color:var(--dim)}
.top b{color:var(--org)} .top .ok{color:var(--grn)}
.eyebrow{position:absolute;left:60px;top:84px;font:700 24px JBMono;letter-spacing:.16em;color:var(--org);border-left:6px solid var(--org);padding-left:16px}
.u{font-family:Unb;font-weight:900;text-transform:uppercase;letter-spacing:-.02em;line-height:1.02}
.mono{font-family:JBMono;font-weight:700}
.panel{position:absolute;background:linear-gradient(180deg,rgba(14,22,36,.92),rgba(8,13,22,.94));border:1.5px solid var(--line);border-top:3px solid var(--org);box-shadow:0 26px 70px rgba(0,0,0,.6)}
.tag{font:700 17px JBMono;letter-spacing:.14em;color:var(--dim)}
.cap{position:absolute;left:0;right:0;bottom:62px;display:flex;justify-content:center}
.cap div{background:rgba(5,8,14,.82);border:1.5px solid rgba(255,255,255,.1);border-radius:16px;padding:14px 32px 16px;font:700 44px/1.2 Inter;text-align:center;max-width:1500px;color:#e6f1ff}
.cap b{color:var(--org);font-weight:700}
`;
const wrap = (img, inner, extra = '', eb = '', topr = '') => `<!doctype html><meta charset=utf8><style>${css}${extra}</style><body>
<div class=bg style="background-image:url(shots/${img}.png)"></div><div class=tint></div><div class=grid></div><div class=vg></div>
<div class=top><span><b>●</b> GRID // CONTROL ROOM</span><span>${topr}</span><span class=ok>60.00 Hz · NOMINAL</span></div>${eb ? `<div class=eyebrow>${eb}</div>` : ''}${inner}</body>`;

// ---- A: hook ----
const A = wrap('substation-night', `
<div class="u" style="position:absolute;left:60px;top:150px;font-size:92px;width:1100px">The bottleneck<br>isn't <span style="color:var(--org)">silicon</span></div>
${[['GPU CHIPS', 'AVAILABLE', 'LEAD TIME: MONTHS', 'var(--grn)', 'GPU-01'], ['TRANSFORMERS', 'BACKORDERED', 'LEAD TIME: 3–5 YEARS', 'var(--red)', 'XFMR-03'], ['POWER PLANT', 'NOT BUILT YET', 'ONLINE: 2030–2032', 'var(--red)', 'GEN-07']].map(([n, s, l, c, tg], i) => `
<div class=panel style="left:${60 + i * 400}px;top:470px;width:370px;height:210px;padding:22px 26px;border-top-color:${c}">
 <div class=tag>${tg}</div><div class=u style="font-size:34px;margin-top:8px">${n}</div>
 <div class=mono style="margin-top:16px;font-size:26px;color:${c}">● ${s}</div><div class=tag style="margin-top:10px">${l}</div></div>`).join('')}
<svg style="position:absolute;left:60px;top:730px" width="1200" height="150" viewBox="0 0 1200 150" fill="none" stroke-linecap="round">
 <g stroke="#7f93ad" stroke-width="4"><path d="M20 75H190"/><path d="M290 75H470"/><path d="M570 75H760"/><path d="M860 75H1180"/></g>
 <g stroke="#e6f1ff" stroke-width="4"><circle cx="240" cy="75" r="44" fill="#0b1422"/><path d="M215 75h50M240 50v50" /></g>
 <g stroke="#ff3355" stroke-width="5"><circle cx="520" cy="75" r="46" fill="#1a0b12"/><circle cx="520" cy="75" r="46" stroke-dasharray="10 8"/><path d="M500 55l40 40M540 55l-40 40"/></g>
 <g stroke="#7f93ad" stroke-width="4"><rect x="800" y="35" width="60" height="80" fill="#0b1422"/><path d="M810 55h40M810 75h40M810 95h40"/></g>
 <g fill="#ff8a1f"><circle cx="70" cy="75" r="8"/><circle cx="130" cy="75" r="8"/><circle cx="330" cy="75" r="8"/><circle cx="400" cy="75" r="8"/></g>
 <text x="190" y="140" fill="#7f93ad" font-family="JBMono" font-size="17" letter-spacing="2">GENERATION</text><text x="460" y="140" fill="#ff3355" font-family="JBMono" font-size="17" letter-spacing="2">TRANSFORMER · FAULT</text><text x="770" y="140" fill="#7f93ad" font-family="JBMono" font-size="17" letter-spacing="2">DATA CENTER</text></svg>
<div style="position:absolute;right:60px;top:150px;width:520px" class=panel><div style="padding:22px 26px"><div class=tag>LIVE BACKLOG TICKER</div>
 <div class=mono style="margin-top:14px;font-size:24px;line-height:2;color:var(--ice)">H100 WAITLIST <span style="color:var(--grn)">▼ easing</span><br>XFMR LEAD TIME <span style="color:var(--red)">▲ 3–5 YRS</span><br>SWITCHGEAR <span style="color:var(--red)">SOLD OUT → 2028</span><br>GAS TURBINES <span style="color:var(--red)">116 GW BACKLOG</span></div></div></div>
<div class=cap><div>It's a transformer. A wire. A <b>power plant</b> that doesn't exist yet.</div></div>`, '', '// THE BOTTLENECK ISN\'T SILICON', 'SUBSTATION 04 · NIGHT');

// ---- B: Amazon deal ----
const arc = (cx, cy, r, a0, a1) => { const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`; };
const frac = 690 / 1790, a0 = Math.PI, a1 = Math.PI + Math.PI * frac;
const B = wrap('nuclear-plant', `
<div class=u style="position:absolute;left:60px;top:150px;font-size:70px;width:900px">Amazon × Constellation</div>
<div class=mono style="position:absolute;left:60px;top:240px;font-size:26px;color:var(--ice);letter-spacing:.1em">20-YEAR POWER PURCHASE AGREEMENT · OCT 1 2026</div>
<div class=panel style="left:60px;top:310px;width:620px;height:430px"><div style="padding:22px 28px"><div class=tag>CALVERT CLIFFS · MD · OUTPUT ALLOCATION</div>
<svg width="560" height="300" viewBox="0 0 560 300"><path d="${arc(280, 250, 220, Math.PI, 2 * Math.PI)}" stroke="#2a3a52" stroke-width="34" fill="none"/>
<path d="${arc(280, 250, 220, a0, a1)}" stroke="#ff8a1f" stroke-width="34" fill="none" style="filter:drop-shadow(0 0 14px #ff8a1f)"/>
<text x="280" y="215" text-anchor="middle" fill="#e6f1ff" font-family="Unb" font-weight="900" font-size="84">690</text><text x="280" y="248" text-anchor="middle" fill="#ff8a1f" font-family="JBMono" font-weight="700" font-size="24" letter-spacing="3">MW → AMAZON</text>
<text x="60" y="290" fill="#7f93ad" font-family="JBMono" font-weight="700" font-size="18">0</text><text x="500" y="290" fill="#7f93ad" font-family="JBMono" font-weight="700" font-size="18">1,790 MW</text></svg>
<div class=mono style="font-size:22px;color:var(--dim);margin-top:2px">= 39% of the plant · plant ≈ 40% of Maryland's electricity</div></div></div>
${[['20', 'YEARS', 'contract term'], ['$3B', 'INVESTED', 'to expand & relicense'], ['+190', 'MW', 'new capacity 2030–32']].map(([n, u, s], i) => `
<div class=panel style="left:${720 + i * 380}px;top:310px;width:350px;height:200px;padding:20px 24px"><div class=u style="font-size:70px;color:var(--org)">${n}</div><div class=mono style="font-size:26px;color:var(--ice)">${u}</div><div class=tag style="margin-top:8px">${s}</div></div>`).join('')}
<div class=panel style="left:720px;top:540px;width:1140px;height:200px;padding:20px 28px"><div class=tag>TIMELINE · WHEN THE POWER ACTUALLY SHOWS UP</div>
<div style="position:relative;margin-top:44px;height:8px;background:#2a3a52;border-radius:4px"><div style="position:absolute;left:0;width:9%;height:8px;background:var(--org);border-radius:4px"></div>
${[[0, '2026', 'DEAL SIGNED'], [38, '2030–32', '+190 MW ONLINE'], [48, '2034/36', 'LICENSES END'], [98, '2046', 'DEAL ENDS']].map(([p, y, l], i) => `<div style="position:absolute;left:${p}%;top:-30px;transform:translateX(${p > 90 ? '-100%' : '-6px'})"><div style="width:16px;height:16px;border-radius:50%;background:${i === 1 ? 'var(--org)' : '#e6f1ff'};margin-bottom:22px;box-shadow:0 0 12px ${i === 1 ? '#ff8a1f' : 'transparent'}"></div><div class=u style="font-size:22px;white-space:nowrap">${y}</div><div class=tag style="white-space:nowrap">${l}</div></div>`).join('')}</div></div>
<div class=cap><div>Six hundred ninety megawatts from <b>one plant</b> in Maryland.</div></div>`, '', '// 690 MW · 20 YEARS', 'CALVERT CLIFFS · LUSBY, MD');

// ---- C: PJM staircase + bill ----
const bars = [[28.92, '2024/25', 'var(--grn)'], [329.17, '2026/27', 'var(--org)'], [333.44, '2027/28', 'var(--red)']];
const C = wrap('suburb-dusk', `
<div class=u style="position:absolute;left:60px;top:150px;font-size:64px;width:1000px">Capacity price: <span style="color:var(--org)">10×</span> in two years</div>
<div class=panel style="left:60px;top:260px;width:1010px;height:560px"><div style="padding:20px 28px"><div class=tag>PJM CAPACITY AUCTION · $ PER MW-DAY</div>
<div style="position:absolute;left:28px;right:28px;top:110px;bottom:70px;border-bottom:3px solid #2a3a52">
 <div style="position:absolute;left:0;right:0;top:0;border-top:2px dashed var(--red)"></div><div class=mono style="position:absolute;right:0;top:-30px;font-size:20px;color:var(--red)">PRICE CAP $333.44</div>
 ${bars.map(([v, y, c], i) => { const h = Math.max(14, v / 333.44 * 330); return `<div style="position:absolute;left:${60 + i * 320}px;bottom:0;width:230px;height:${h}px;background:linear-gradient(180deg,${c},${c}55);box-shadow:0 0 36px ${c}55"></div><div class=u style="position:absolute;left:${60 + i * 320}px;bottom:${h + 14}px;width:230px;text-align:center;font-size:40px">$${v}</div><div class=mono style="position:absolute;left:${60 + i * 320}px;bottom:-44px;width:230px;text-align:center;font-size:22px;color:var(--dim)">${y}${i === 2 ? ' · CAP' : ''}</div>`; }).join('')}
</div></div></div>
<div class=panel style="left:1110px;top:260px;width:750px;height:560px;border-top-color:var(--red)"><div style="padding:22px 30px"><div class=tag>YOUR UTILITY BILL · ILLUSTRATIVE LAYOUT</div>
 ${[['Energy supply', 62], ['Delivery & wires', 48], ['Taxes & fees', 36]].map(([l, w]) => `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;font:700 26px Inter;color:var(--dim)"><span>${l}</span><span style="display:block;height:20px;width:${w * 3}px;background:#25344b"></span></div>`).join('')}
 <div style="margin-top:28px;border:3px solid var(--red);background:rgba(255,51,85,.10);padding:20px 24px"><div class=mono style="font-size:20px;color:var(--red);letter-spacing:.12em">CAPACITY CHARGE (PJM)</div>
 <div class=u style="font-size:72px;margin-top:8px">+$16–18<span style="font-size:30px"> /mo</span></div><div class=tag style="margin-top:6px">ESTIMATED · W. MARYLAND $18 · OHIO $16</div></div>
 <div class=mono style="margin-top:22px;font-size:22px;color:var(--ice)">63% OF ONE YEAR'S INCREASE → DATA CENTERS ($9.3B)</div></div></div>
<div class=cap><div>Three hundred thirty-three dollars. <b>The price cap.</b></div></div>`, '', '// $29 → $329 → $333', 'PJM INTERCONNECTION · 13 STATES');

// ---- D: CTA ----
const D = wrap('home-window-night', `
<div style="position:absolute;left:100px;top:220px;width:900px">
 <div style="display:flex;align-items:center;gap:44px"><div style="width:270px;height:270px;border-radius:50%;padding:8px;background:conic-gradient(var(--org),#ffd29a,var(--org));box-shadow:0 0 60px rgba(255,138,31,.55)"><img src="../reel-app/public/profile.jpg" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:6px solid #070b12"></div>
 <div><div class=mono style="font-size:26px;color:var(--org);letter-spacing:.16em">LIKED THE BREAKDOWN?</div><div class=u style="font-size:78px;margin-top:10px">@sandesh<br>.explains</div></div></div>
 <div style="margin-top:50px;display:inline-flex;align-items:center;gap:20px;background:var(--org);color:#1a0d00;border-radius:60px;padding:22px 54px"><span class=u style="font-size:54px">FOLLOW</span><span style="font-size:54px">＋</span></div>
 <div class=mono style="margin-top:24px;font-size:24px;color:var(--ice)">NEW DEEP-DIVE EVERY WEEK · TECH · AI · MONEY</div></div>
<div class=panel style="left:1090px;top:230px;width:760px;height:430px"><div style="padding:26px 34px"><div class=tag>UP NEXT · NEW EPISODE</div>
 <div class=u style="font-size:62px;margin-top:14px">The custom<br>chip war</div>
 <div class=mono style="margin-top:20px;font-size:24px;line-height:1.9;color:var(--ice)">GOOGLE TPU &nbsp;→&nbsp; BROADCOM<br>AMAZON TRAINIUM &nbsp;→&nbsp; OPENAI × BROADCOM<br><span style="color:var(--org)">VS. NVIDIA'S 90% INFERENCE SHARE?</span></div></div></div>
<div class=cap><div>Follow for the next breakdown: <b>the custom chip war.</b></div></div>`, '', '// YOUR BILL IS PART OF THE AI RACE', 'WINDOW · NIGHT');

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [n, h] of [['A-hook', A], ['B-deal', B], ['C-bill', C], ['D-cta', D]]) {
  await writeFile(`mock-${n}.html`, h);
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(`file://${process.cwd()}/mock-${n}.html`); await p.waitForTimeout(600);
  await p.screenshot({ path: `mock-${n}.png` }); await p.close();
}
await b.close();
