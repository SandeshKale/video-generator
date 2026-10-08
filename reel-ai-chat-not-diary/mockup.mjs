// Throwaway mockup (delete once the full build supersedes it): "Glass Diary by Lamplight" visual system, 3 sample scenes.
import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ic = (n, s = 44, c = 'currentColor', sw = 1.7) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${icon(n)}</svg>`;
const motes = Array.from({ length: 34 }, (_, i) => { const r = (k) => { const x = Math.sin(i * 91.7 + k * 13.1) * 43758.5453; return x - Math.floor(x); };
  const y = 180 + r(1) * 1050, x = 380 + r(2) * 560 - (y - 180) * 0.12; return `<i class="mote" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${(2 + r(3) * 4).toFixed(1)}px;height:${(2 + r(3) * 4).toFixed(1)}px;opacity:${(0.25 + r(4) * 0.6).toFixed(2)}"></i>`; }).join('');
const css = `
@font-face{font-family:'SO';font-weight:800;src:url('../assets/fonts/sora/sora-latin-800-normal.woff2');font-display:block}
@font-face{font-family:'SO';font-weight:700;src:url('../assets/fonts/sora/sora-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'FR';font-weight:900;font-style:italic;src:url('../assets/fonts/fraunces/fraunces-latin-900-italic.woff2');font-display:block}
@font-face{font-family:'IN';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'JB';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');font-display:block}
:root{--amber:#ffbf5e;--amber2:#ff9d2e;--ice:#bfeaf5;--seal:#c8353f;--cream:#f3e6c6;--ink:#241f4d;--txt:#fff0d6;--mute:#c9b48a}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#120d08;font-family:'IN',sans-serif;color:var(--txt)}
#w{position:absolute;inset:0;overflow:hidden;background:radial-gradient(900px 760px at 80% 4%,#6a4617 0%,#3a2812 34%,#1b130a 66%,#0e0a06 100%)}
.cone{position:absolute;left:0;top:140px;width:1080px;height:1300px;background:conic-gradient(from 180deg at 84% -2%,transparent 0 12deg,rgba(255,191,94,.20) 12deg 38deg,transparent 38deg);filter:blur(26px)}
.cone2{position:absolute;left:200px;top:560px;width:900px;height:900px;background:radial-gradient(closest-side,rgba(255,176,70,.18),transparent)}
.vig{position:absolute;inset:0;background:radial-gradient(closest-side at 50% 52%,transparent 62%,rgba(0,0,0,.55))}
.mote{position:absolute;border-radius:50%;background:#ffd89a;box-shadow:0 0 8px 2px rgba(255,200,120,.6)}
.eb{position:absolute;left:150px;top:176px;font:700 24px 'JB';letter-spacing:.16em;color:var(--amber);text-transform:uppercase;white-space:nowrap}
.h{position:absolute;left:150px;top:226px;font:800 96px/1.02 'SO';letter-spacing:-.035em;text-transform:uppercase;color:var(--txt);text-shadow:0 6px 24px rgba(0,0,0,.55);white-space:nowrap}
.h em{font-style:normal;text-shadow:none;background:linear-gradient(180deg,#ffe6a8,#ff9d2e);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 14px rgba(255,157,46,.45))}
.glass{position:absolute;background:linear-gradient(135deg,rgba(255,255,255,.17),rgba(255,255,255,.04) 55%,rgba(191,234,245,.07));border:1.5px solid rgba(220,245,255,.42);border-radius:30px;box-shadow:inset 0 1.5px 0 rgba(255,255,255,.55),inset 0 0 46px rgba(160,220,255,.09),0 26px 54px rgba(0,0,0,.5);backdrop-filter:blur(3px);overflow:hidden}
.glass::before{content:'';position:absolute;left:-20%;top:-60%;width:60%;height:220%;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.16) 48%,transparent 62%);transform:rotate(8deg);pointer-events:none}
.chip{position:absolute;display:inline-flex;align-items:center;gap:10px;padding:11px 20px;border-radius:999px;font:700 22px 'JB';letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.06));border:1.5px solid rgba(220,245,255,.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 10px 24px rgba(0,0,0,.4);color:var(--txt)}
.chip.a{background:linear-gradient(135deg,#ffcf7a,#ff9d2e);color:#2a1706;border-color:#ffe2a8}
.chip.s{background:linear-gradient(135deg,#d84a54,#9a2230);border-color:#ff9aa1;color:#fff4e8}
.lab{font:700 20px 'JB';letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.seal{position:absolute;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle at 36% 30%,#ef6b73,#c8353f 45%,#7d1824 100%);box-shadow:0 14px 28px rgba(0,0,0,.55),inset 0 -6px 14px rgba(0,0,0,.35),inset 0 4px 8px rgba(255,200,200,.35);display:flex;align-items:center;justify-content:center;color:#ffe8e0}
.seal::before{content:'';position:absolute;inset:14px;border-radius:50%;border:3px dashed rgba(255,225,215,.65)}
.cap{position:absolute;left:150px;right:162px;top:1340px;display:flex;justify-content:center}
.cap div{background:rgba(14,10,6,.78);border:3px solid rgba(255,240,214,.8);border-radius:22px;padding:20px 26px;font:700 46px/1.18 'IN';text-align:center;color:var(--txt)}
.cap b{color:var(--amber)}
.pg{position:absolute;inset:0;display:none}.pg.on{display:block}
/* diary */
.book{position:absolute;left:130px;top:610px;width:808px;height:500px;border-radius:26px;background:linear-gradient(160deg,#4a2c15,#2b190b);box-shadow:0 36px 70px rgba(0,0,0,.65),inset 0 2px 0 rgba(255,200,140,.25)}
.page{position:absolute;top:22px;height:456px;width:372px;background:repeating-linear-gradient(180deg,transparent 0 37px,rgba(36,31,77,.18) 37px 39px),linear-gradient(90deg,#ead9b3,#f6ebd0 40%,#f0e1bd);box-shadow:inset 0 0 30px rgba(120,80,30,.28)}
.page.l{left:20px;border-radius:12px 4px 4px 12px;transform:perspective(900px) rotateY(2deg)}
.page.r{right:20px;border-radius:4px 12px 12px 4px;transform:perspective(900px) rotateY(-2deg)}
.spine{position:absolute;left:50%;top:22px;width:34px;height:456px;margin-left:-17px;background:linear-gradient(90deg,transparent,rgba(60,35,12,.55) 50%,transparent)}
.ink{position:absolute;font:900 italic 38px/1 'FR';color:var(--ink)}
.rd{position:absolute;height:26px;background:#14101e;border-radius:3px}
.fl{position:absolute;color:var(--amber);filter:drop-shadow(0 0 10px rgba(255,191,94,.6))}
`;
const lamp = `<div class="cone"></div><div class="cone2"></div>${motes}<div class="vig"></div>`;
const caps = (h) => `<div class="cap"><div>${h}</div></div>`;
// ----- Scene 1: hook -----
const s1 = `<div class="pg on" id="p1">${lamp}
<div class="eb">// DEAR DIARY…</div>
<div class="h">SHE USED<br>AN AI CHAT<br>LIKE A <em>DIARY</em></div>
<div class="book"><div class="page l">
  <div class="ink" style="left:26px;top:12px">Sept. 26</div>
  <div class="ink" style="left:26px;top:52px;font-size:34px">dear diary,</div>
  <div class="rd" style="left:26px;top:104px;width:300px"></div><div class="rd" style="left:26px;top:143px;width:250px"></div><div class="rd" style="left:26px;top:182px;width:318px"></div><div class="rd" style="left:26px;top:221px;width:190px"></div>
</div><div class="page r">
  <div class="rd" style="left:30px;top:30px;width:290px;background:#2a2147"></div><div class="rd" style="left:30px;top:69px;width:240px;background:#2a2147"></div>
  <div class="ink" style="left:30px;top:150px;font-size:30px;color:#6a5f9a">sept. 27 —</div><div class="rd" style="left:30px;top:195px;width:260px"></div>
</div><div class="spine"></div>
<div class="glass" style="left:392px;top:46px;width:380px;height:392px;border-radius:24px;background:linear-gradient(135deg,rgba(191,234,245,.34),rgba(191,234,245,.08) 60%);transform:rotate(-2deg)">
  
  <div style="position:absolute;left:28px;top:70px;width:300px;height:56px;border-radius:28px;background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.5)"></div>
  <div style="position:absolute;left:96px;top:146px;width:340px;height:56px;border-radius:28px;background:rgba(255,191,94,.4);border:1.5px solid rgba(255,225,170,.7)"></div>
</div></div>
<div class="fl" style="left:670px;top:880px">${ic('search', 120, '#ffbf5e', 1.5)}</div>
<div class="seal" style="left:120px;top:1020px;transform:rotate(-8deg)">${ic('eye', 76, '#ffe8e0', 1.6)}</div>
<div class="chip s" style="left:300px;top:1062px;transform:rotate(-3deg)">HUMAN REVIEW</div>
<div class="glass" style="left:150px;top:1200px;width:768px;height:90px;border-radius:24px"></div>
<div style="position:absolute;left:176px;top:1220px" class="lab">MESSAGE · SEP 26</div>
<div class="rd" style="left:520px;top:1226px;width:360px;background:rgba(10,8,6,.9)"></div>
<div class="chip" style="left:560px;top:1148px;font-size:20px">FLORIDA · ALLEGED</div>
${caps('She used an AI chatbot like a <b>diary.</b>')}
</div>`;
// ----- Scene 3: funnel -----
const st = (y, icn, ttl, sub, hl, col) => `<div class="glass" style="left:150px;top:${y}px;width:768px;height:128px;${hl ? 'border-color:#ffd48a;box-shadow:inset 0 1.5px 0 rgba(255,255,255,.6),0 0 60px rgba(255,170,60,.45),0 26px 54px rgba(0,0,0,.5)' : ''}"><div style="position:absolute;left:28px;top:30px;color:${col}">${ic(icn, 68, col, 1.6)}</div><div style="position:absolute;left:128px;top:24px;font:800 36px 'SO';letter-spacing:-.02em;text-transform:uppercase;color:${hl ? '#ffe6a8' : 'var(--txt)'}">${ttl}</div><div style="position:absolute;left:128px;top:76px;font:700 24px 'IN';color:var(--mute)">${sub}</div></div>`;
const tube = (y, n = 3) => `<div style="position:absolute;left:520px;top:${y}px;width:28px;height:60px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.04));border:1.5px solid rgba(220,245,255,.4)"></div>` + Array.from({ length: n }, (_, i) => `<i class="mote" style="left:${528 + (i % 2) * 4}px;top:${y + 8 + i * 16}px;width:12px;height:12px;background:#ffbf5e;opacity:.95"></i>`).join('');
const s3 = `<div class="pg" id="p3">${lamp}
<div class="eb">// FLAGGED → HUMAN → POLICE</div>
<div class="h">A <em>HUMAN</em><br>READ IT</div>
${st(470, 'message-circle', 'The chat', 'sent like a private diary entry', 0, '#bfeaf5')}${tube(598)}
${st(658, 'flag', 'Automated flag', 'key phrases · threatening content', 0, '#ffbf5e')}${tube(786)}
${st(846, 'eye', 'Human reviewer', 'serious flags only · decides what next', 1, '#ffd48a')}${tube(974)}
${st(1034, 'shield-check', 'Report to police', 'if a credible threat is judged', 0, '#ff8a92')}
<div class="seal" style="left:760px;top:830px;width:130px;height:130px;transform:rotate(10deg)">${ic('search', 60, '#ffe8e0', 1.7)}</div>
<div class="chip a" style="left:150px;top:1186px">ANTHROPIC SAYS IT MONITORS CHATS</div>
<div class="chip" style="left:150px;top:1252px;font-size:20px">REPORTED · NOT INDEPENDENTLY VERIFIED</div>
${caps('Serious flags can reach a <b>human reviewer.</b>')}
</div>`;
// ----- Scene 8: transparency gap -----
const jar = (x, lvl, hatch, num, lbl, col) => `<div class="glass" style="left:${x}px;top:560px;width:360px;height:440px;border-radius:44px 44px 70px 70px">
<div style="position:absolute;left:0;right:0;bottom:0;height:${lvl}px;background:${hatch ? `repeating-linear-gradient(135deg,rgba(255,191,94,.55) 0 14px,rgba(255,191,94,.18) 14px 28px)` : 'transparent'}"></div>
<div style="position:absolute;left:0;right:0;top:${hatch ? 110 : 130}px;text-align:center;font:800 ${hatch ? 84 : 180}px/1 'SO';color:${col};text-shadow:0 8px 28px rgba(0,0,0,.5)">${num}</div></div>
<div class="lab" style="position:absolute;left:${x}px;top:1016px;width:360px;text-align:center;font-size:20px;line-height:1.3;color:var(--txt)">${lbl}</div>`;
const s8 = `<div class="pg" id="p8">${lamp}
<div class="eb">// ZERO, BUT NOT COUNTED</div>
<div class="h"><em>ZERO.</em><br>BUT NOT<br>COUNTED.</div>
${jar(150, 0, 0, '0', 'POLICE EMERGENCY REQUESTS<br>H2 2025', '#fff0d6')}
${jar(558, 250, 1, '?', 'REPORTS THE COMPANY<br>MAKES ITSELF', '#ffe6a8')}
<div class="chip s" style="left:600px;top:520px;transform:rotate(5deg)">NOT COUNTED</div>
<div class="glass" style="left:150px;top:1118px;width:768px;height:150px"><div style="position:absolute;left:28px;top:22px" class="lab">emergency standard in the report</div><div style="position:absolute;left:28px;top:58px;font:900 italic 34px/1.15 'FR';color:#ffe6a8;width:710px">“danger of death or serious physical injury to a person”</div></div>
${caps('But it doesn’t count reports the company <b>makes itself.</b>')}
</div>`;
writeFileSync(new URL('./mockup.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><style>${css}</style></head><body><div id="w">${s1}${s3}${s8}</div><script>var q=new URLSearchParams(location.search).get('s')||'1';document.querySelectorAll('.pg').forEach(function(p){p.classList.toggle('on',p.id==='p'+q);});</script></body></html>`);
console.log('mockup.html');
