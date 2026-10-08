import fs from 'node:fs';
import { chromium } from 'playwright';
const A = '../../assets/';
const tab = (n, px = 56) => { const s = fs.readFileSync(`../../assets/icons/tabler/${n}.svg`, 'utf8'); const p = [...s.matchAll(/<(path|circle|rect|line|polyline)[^>]*>/g)].map((m) => m[0]).filter((x) => !/M0 0h24v24H0z/.test(x)).join(''); return `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`; };
const css = `
@font-face{font-family:BC;font-weight:800;src:url(${A}fonts/barlow-condensed/barlow-condensed-latin-800-normal.woff2)}
@font-face{font-family:BC;font-weight:600;src:url(${A}fonts/barlow-condensed/barlow-condensed-latin-600-normal.woff2)}
@font-face{font-family:SM;font-weight:700;src:url(${A}fonts/space-mono/space-mono-latin-700-normal.woff2)}
@font-face{font-family:Inter;font-weight:700;src:url(${A}fonts/inter/inter-latin-700-normal.woff2)}
:root{--tq:#00b3a3;--tq2:#009a8c;--iv:#fbf6ea;--ink:#0d1f1e;--co:#ff4f4a}
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--tq);font-family:Inter;color:var(--ink)}
.arcs{position:absolute;inset:0;background:
 radial-gradient(circle at 20% 110%,transparent 0 520px,rgba(251,246,234,.16) 520px 524px,transparent 524px 700px,rgba(251,246,234,.12) 700px 703px,transparent 703px),
 radial-gradient(circle at 95% -5%,transparent 0 380px,rgba(251,246,234,.14) 380px 383px,transparent 383px 560px,rgba(251,246,234,.10) 560px 563px,transparent 563px)}
.air{position:absolute;left:0;right:0;top:140px;height:30px;background:repeating-linear-gradient(115deg,var(--co) 0 26px,var(--iv) 26px 52px,var(--ink) 52px 78px,var(--iv) 78px 104px)}
.ml{position:absolute;top:0;bottom:0;width:2px;background:rgba(251,246,234,.3)}
.eb{position:absolute;left:150px;font:700 26px SM;letter-spacing:.08em;color:var(--iv);text-transform:uppercase;white-space:nowrap}
.h{position:absolute;left:150px;font-family:BC;font-weight:800;text-transform:uppercase;line-height:1.02;color:var(--iv);white-space:nowrap;text-shadow:0 5px 0 rgba(13,31,30,.35)}
.h i{font-style:normal;display:inline-block;line-height:.95;background:var(--co);padding:0 14px;color:var(--iv);text-shadow:none}
.ph{position:absolute;overflow:hidden;border:5px solid var(--iv);background:var(--tq2)}
.ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:contrast(1.05) saturate(1.05)}
.ph:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,179,163,.25),rgba(13,31,30,.35))}
.tag{position:absolute;left:10px;top:10px;z-index:3;background:var(--iv);color:var(--ink);font:700 15px SM;letter-spacing:.1em;padding:4px 9px}
.tk{position:absolute;background:var(--iv);border-radius:22px;filter:drop-shadow(0 10px 0 rgba(13,31,30,.35))}
.tk:before,.tk:after{content:"";position:absolute;width:44px;height:44px;border-radius:50%;background:var(--tq);top:50%;margin-top:-22px}
.tk:before{left:-22px}.tk:after{right:-22px}
.perf{position:absolute;top:22px;bottom:22px;width:0;border-left:4px dashed rgba(13,31,30,.35)}
.lab{font:700 17px SM;letter-spacing:.14em;text-transform:uppercase;color:rgba(13,31,30,.6)}
.code{font:800 118px/0.9 BC;color:var(--ink)}
.flaps{display:flex;gap:6px}
.fl{width:38px;height:74px;background:var(--ink);color:var(--iv);font:800 58px/74px BC;text-align:center;border-radius:8px;position:relative}
.fl:after{content:"";position:absolute;left:0;right:0;top:36px;height:3px;background:rgba(251,246,234,.25)}
.fl.co{background:var(--co)}
.stamp{position:absolute;border:7px solid var(--co);color:var(--co);background:rgba(251,246,234,.92);font:800 74px BC;padding:2px 22px;transform:rotate(-8deg);text-transform:uppercase;white-space:nowrap}
.chip{display:inline-block;font:700 22px SM;letter-spacing:.1em;text-transform:uppercase;padding:9px 16px;border:3px solid var(--iv);color:var(--iv);background:rgba(13,31,30,.55);white-space:nowrap}
.chip.c{background:var(--co);border-color:var(--co)}
.chip.i{background:var(--iv);color:var(--ink);border-color:var(--iv)}
.cap{position:absolute;left:150px;right:162px;top:1340px;height:150px;background:var(--ink);border:4px solid var(--iv);color:var(--iv);font:700 46px Inter;text-align:center;padding:26px 24px;line-height:1.2}
.cap b{color:#ffb4b1}
.bar{position:absolute;height:44px;background:var(--ink)}
`;
const cap = (t) => `<div class="cap">${t}</div>`;
const fl = (s, co) => `<div class="flaps">${[...s].map((c) => `<div class="fl${co ? ' co' : ''}">${c}</div>`).join('')}</div>`;
const ticket = (y, who, price, label, co) => `
<div class="tk" style="left:150px;top:${y}px;width:768px;height:250px">
  <div class="perf" style="left:560px"></div>
  <div class="lab" style="position:absolute;left:34px;top:22px">${who} · FICTIONAL PROFILE</div>
  <div class="code" style="position:absolute;left:34px;top:62px">NYC</div>
  <div style="position:absolute;left:210px;top:72px;color:var(--ink)">${tab('plane', 70)}</div>
  <div class="code" style="position:absolute;left:300px;top:62px">LON</div>
  <div class="lab" style="position:absolute;left:34px;top:190px">${label}</div>
  <div style="position:absolute;left:572px;top:28px"><div class="lab" style="margin-bottom:8px">EXAMPLE PRICE</div>${fl('$' + price, co)}</div>
  <div style="position:absolute;left:590px;top:176px;width:150px;height:40px;background:repeating-linear-gradient(90deg,var(--ink) 0 3px,transparent 3px 6px,var(--ink) 6px 7px,transparent 7px 11px)"></div>
</div>`;
const S = {};
S[1] = `<div class="air"></div>
<div class="eb" style="top:198px">// SAME REQUEST, TWO WALLETS</div>
<div class="h" style="top:246px;font-size:150px">Same request.<br><i>Pricier</i> tickets.</div>
<div class="ph" style="left:150px;top:540px;width:768px;height:190px"><div class="tag">AI IMAGE</div><img src="../shots/airport-gate.png"></div>
${ticket(690, 'PROFILE A', '412', 'ASKED: FLIGHT TO LONDON', false)}
${ticket(960, 'PROFILE B', '610', 'ASKED: FLIGHT TO LONDON', true)}
<div class="stamp" style="left:560px;top:880px">+$198</div>
<div style="position:absolute;left:150px;top:1235px;display:flex;gap:12px"><span class="chip i">SAME REQUEST</span><span class="chip">NO INSTRUCTION</span><span class="chip">EXAMPLE PRICES</span></div>
${cap('The AI shows the <b>richer one</b> pricier tickets.')}`;
S[2] = `<div class="air"></div>
<div class="eb" style="top:198px">// 325,000 TESTS · 13 MODELS</div>
<div class="h" style="top:238px;font-size:300px;letter-spacing:-.01em">325,000</div>
<div class="h" style="top:500px;font-size:96px">tests on <i>13</i> AI models</div>
<div class="ph" style="left:150px;top:640px;width:768px;height:230px"><div class="tag">AI IMAGE</div><img src="../shots/laptop-flights.png"></div>
<div style="position:absolute;left:150px;top:900px;width:768px;display:flex;gap:14px">
 ${[['plane', 'FLIGHTS'], ['shield-check', 'HEALTH INSURANCE'], ['school', 'GRAD SCHOOL']].map(([ic, t]) => `<div style="flex:1;background:var(--iv);border-radius:18px;padding:20px 14px;text-align:center;filter:drop-shadow(0 8px 0 rgba(13,31,30,.35))">${tab(ic, 64)}<div class="lab" style="margin-top:10px;color:var(--ink);font-size:16px">${t}</div></div>`).join('')}
</div>
<div style="position:absolute;left:150px;top:1085px;width:768px;display:flex;flex-wrap:wrap;gap:8px">${Array.from({ length: 13 }, (_, i) => `<div style="width:54px;height:54px;border-radius:50%;background:${i < 8 ? 'var(--co)' : 'rgba(13,31,30,.55)'};border:3px solid var(--iv)"></div>`).join('')}<div class="lab" style="color:var(--iv);align-self:center;margin-left:8px;font-size:20px">13 AGENTS · 4 FAMILIES</div></div>
<div style="position:absolute;left:150px;top:1235px"><span class="chip c">FICTIONAL PROFILES</span> <span class="chip">PREPRINT</span></div>
${cap('Fake profiles. <b>Real decisions.</b>')}`;
const row = (y, name, f, ins, big) => `<div style="position:absolute;left:150px;top:${y}px;width:768px;height:210px;background:var(--iv);border-radius:20px;filter:drop-shadow(0 8px 0 rgba(13,31,30,.35));${big ? 'outline:6px solid var(--co);outline-offset:-6px' : ''}">
 <div style="position:absolute;left:28px;top:16px;font:800 52px BC;text-transform:uppercase">${name}</div>
 <div class="lab" style="position:absolute;left:28px;top:80px;font-size:16px">FLIGHTS</div><div class="bar" style="left:150px;top:72px;width:${f * 2.2}px;background:${big ? 'var(--co)' : 'var(--ink)'}"></div><div style="position:absolute;left:${150 + f * 2.2 + 12}px;top:70px;font:800 44px BC">+$${f}</div>
 <div class="lab" style="position:absolute;left:28px;top:146px;font-size:16px">INSURANCE</div>${ins ? `<div class="bar" style="left:150px;top:138px;width:${ins * 1.35}px;background:${big ? 'var(--co)' : 'var(--ink)'}"></div><div style="position:absolute;left:${150 + ins * 1.35 + 12}px;top:136px;font:800 44px BC">+$${ins}/mo</div>` : `<div style="position:absolute;left:150px;top:138px;font:800 38px BC;opacity:.5">NOT IN SOURCE</div>`}</div>`;
S[3] = `<div class="air"></div>
<div class="eb" style="top:198px">// THE $198 GAP</div>
<div class="h" style="top:238px;font-size:140px">Richer profile.<br><i>Bigger</i> bill.</div>
${row(530, 'Claude Opus 4.8', 198, 284, true)}
${row(780, 'Gemini 2.5 Flash', 177, 217, false)}
${row(1030, 'GPT-5', 107, null, false)}
<div style="position:absolute;left:150px;top:1262px" class="lab"><span style="color:var(--iv)">AVG. GAP, WEALTHY VS LOW-INCOME PROFILE · SOURCE: QUARTZ / ARXIV 2609.24927</span></div>
${cap('Claude Opus 4.8: <b>$198</b> more on flights.')}`;
S[4] = `<div class="air"></div>
<div class="eb" style="top:198px">// IT READS YOUR INBOX</div>
<div class="h" style="top:238px;font-size:150px">Two emails.<br><i>That's</i> enough.</div>
<div class="ph" style="left:150px;top:540px;width:768px;height:190px"><div class="tag">AI IMAGE</div><img src="../shots/phone-inbox.png"></div>
<div style="position:absolute;left:150px;top:760px;width:560px;background:var(--iv);border-radius:20px;padding:16px 18px;filter:drop-shadow(0 8px 0 rgba(13,31,30,.35))">
 ${[['Bank statement ready', 'FIRST', 1], ['Payslip — September', 'FIRST', 1], ['Weekend brunch ideas', '', 0], ['Coupon: 20% off pizza', '', 0]].map(([s, t, hi]) => `<div style="display:flex;align-items:center;gap:12px;padding:12px 10px;margin:4px 0;border-radius:12px;${hi ? 'background:#ffe3e1;outline:4px solid var(--co);outline-offset:-4px' : 'opacity:.55'}"><span style="color:var(--ink)">${tab('mail', 36)}</span><span style="font:700 28px Inter;flex:1">${s}</span>${t ? `<span class="chip c" style="font-size:15px;padding:4px 8px">READ ${t}</span>` : ''}</div>`).join('')}
</div>
<div style="position:absolute;left:730px;top:775px;width:188px;height:188px"><svg width="188" height="188" viewBox="0 0 188 188"><circle cx="94" cy="94" r="76" fill="none" stroke="rgba(13,31,30,.25)" stroke-width="22"/><circle cx="94" cy="94" r="76" fill="none" stroke="#ff4f4a" stroke-width="22" stroke-dasharray="${2 * Math.PI * 76}" stroke-dashoffset="${2 * Math.PI * 76 * 0.03}" transform="rotate(-90 94 94)"/><text x="94" y="108" text-anchor="middle" font-family="BC" font-weight="800" font-size="58" fill="#fbf6ea">97%</text></svg><div class="lab" style="color:var(--iv);text-align:center;font-size:14px;margin-top:2px">MONEY MAILS FIRST</div></div>
<div style="position:absolute;left:150px;top:1135px"><span class="chip">IN ONE TEST</span> <span class="chip c">GEMINI 2.5 FLASH</span></div>
${cap('Two were enough — and it read the <b>money ones first</b>.')}`;
S[5] = `<div class="air"></div>
<div class="eb" style="top:198px">// WHOSE SIDE IS IT ON?</div>
<div class="h" style="top:238px;font-size:132px">Before you hand<br>an AI your <i>inbox</i></div>
<div class="tk" style="left:150px;top:640px;width:768px;height:380px"><div class="perf" style="left:560px"></div>
 <img src="../../reel-app/public/profile.jpg" style="position:absolute;left:34px;top:48px;width:260px;height:260px;border-radius:50%;object-fit:cover;border:10px solid var(--co);box-shadow:0 0 0 6px var(--ink)">
 <div style="position:absolute;left:320px;top:70px"><div class="lab">PASSENGER</div><div style="font:800 54px/0.95 BC;text-transform:uppercase;margin-top:6px">@sandesh<br>.explains</div></div>
 <div style="position:absolute;left:34px;top:325px" class="lab">GATE · NEXT AI STORY</div>
 <div style="position:absolute;left:590px;top:200px;background:var(--co);color:var(--iv);font:800 56px BC;padding:10px 18px;border-radius:10px;transform:rotate(-4deg)">FOLLOW<br>→</div></div>
<div class="ph" style="left:150px;top:1060px;width:768px;height:180px"><div class="tag">AI IMAGE</div><img src="../shots/pass-table.png"></div>
${cap('<b>Follow</b> for the next AI story.')}`;
fs.mkdirSync('out', { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const k in S) { fs.writeFileSync(`m${k}.html`, `<!doctype html><meta charset=utf8><style>${css}</style><body><div class="arcs"></div><div class="ml" style="left:149px"></div><div class="ml" style="left:917px"></div>${S[k]}</body>`); await p.goto('file://' + process.cwd() + `/m${k}.html`); await p.waitForTimeout(700); await p.screenshot({ path: `out/m${k}.png` }); }
await b.close();
