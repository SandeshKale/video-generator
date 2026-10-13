// Throwaway: series-frame mockup for reel #01 (3 scenes, 3 families). Not the full build.
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { humaaansFull } from '../../../gif-ai-work-treadmill/hum.mjs';
const R = new URL('../../../', import.meta.url).pathname;
const ph = (n) => readFileSync(`${R}assets/icons/phosphor/bold/${n}-bold.svg`, 'utf8').replace('<svg ', '<svg class="ic" ');
const font = (fam, w, f) => `@font-face{font-family:'${fam}';font-weight:${w};src:url('../../../assets/fonts/${f}.woff2');font-display:block}`;
const J = JSON.parse(readFileSync(new URL('./3d/head.json', import.meta.url)));
const wince = humaaansFull('standing', 'standing-1', { coatColor: '#cfd8e6', shirtColor: '#eef2f7', pantColor: '#2c3b5a', skinColor: '#c68a5b', hairColor: '#1b2230', shoeColor: '#eef2f7' });

// head placement helper: image 1000x1100 px scaled by s at (L,T)
const H = (s, L, T) => ({ s, L, T, p: (k) => [Math.round(L + J[k][0] * s), Math.round(T + J[k][1] * s)] });
const reg = (id) => `<svg class="regs" width="1080" height="1920"><defs><pattern id="rp${id}" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M45 38v14M38 45h14" stroke="rgba(82,227,255,.14)" stroke-width="2"/></pattern></defs><rect width="1080" height="1920" fill="url(#rp${id})"/>
<g stroke="rgba(82,227,255,.45)" stroke-width="3" fill="none"><path d="M150 176v-28h28"/><path d="M918 176v-28h-28"/><path d="M150 1502v28h28"/><path d="M918 1502v28h-28"/></g></svg>`;
const chrome = (id, eyebrow, src) => `${reg(id)}
<div class="badge"><i></i>WHAT'S ACTUALLY HAPPENING · #01</div>
<div class="eyebrow">// ${eyebrow}</div>
<div class="rule"></div><div class="src">${src}</div>`;
const ruler = (x, y0, y1, pxcm, label) => {
  let t = ''; const major = pxcm * 5; let k = 0;
  for (let y = y0; y <= y1; y += pxcm) { const mj = Math.abs(((y - y0) / major) % 1) < 1e-6; t += `<path d="M${x} ${y}h${mj ? -26 : -14}" stroke="#52e3ff" stroke-width="${mj ? 3 : 2}" opacity="${mj ? 1 : .6}"/>`; if (mj) t += `<text x="${x - 50}" y="${y + 6}" class="rt" text-anchor="start">${k * 5}</text>`; if (mj) k++; }
  return `<svg class="ruler" width="140" height="${y1 - y0 + 80}" style="left:${x - 60}px;top:${y0 - 30}px" viewBox="${x - 60} ${y0 - 30} 140 ${y1 - y0 + 80}"><path d="M${x} ${y0}V${y1}" stroke="#52e3ff" stroke-width="3"/>${t}<text x="${x - 50}" y="${y1 + 36}" class="rt">${label}</text></svg>`;
};
const cap = (a, hi, b) => `<div class="cap"><span>${a}</span> <b>${hi}</b>${b.startsWith('.') ? '' : ' '}<span>${b}</span></div>`;

// ---------- F0: hook ----------
const h0 = H(0.58, 150, 585); const sk0 = h0.p('skull'), mo0 = h0.p('mouth');
const waves0 = [64, 104, 144].map((r, i) => { const a0 = -52 * Math.PI / 180, a1 = 6 * Math.PI / 180; const p = (a) => [mo0[0] + r * Math.cos(a), mo0[1] + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `<path d="M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}" stroke="#52e3ff" stroke-width="${6 - i}" fill="none" stroke-linecap="round" opacity="${1 - i * .24}"/>`; }).join('');
const bars = Array.from({ length: 15 }, (_, i) => { const hgt = 10 + Math.abs(Math.sin(i * 1.7) * 26 + Math.sin(i * .6) * 10); return `<i style="height:${hgt.toFixed(0)}px;opacity:${i < 9 ? 1 : .45}"></i>`; }).join('');
const F0 = `<section class="frame" id="f0">${chrome('0', 'VOICE NOTE, PLAYED BACK', 'SRC · HULLAR, SCIENTIFIC AMERICAN · TIER A')}
<h1 class="hl">You've never<br>heard <span class="blk coral">YOU</span></h1>
${ruler(204, 612, 1212, 28, 'CM')}
<img class="head" src="3d/head_closed.png" style="left:${h0.L}px;top:${h0.T}px;width:${1000 * h0.s}px">
<div class="lens" style="left:${sk0[0] - 178}px;top:${sk0[1] - 178}px"><img src="3d/head_cut.png" style="left:${h0.L - (sk0[0] - 178)}px;top:${h0.T - (sk0[1] - 178)}px;width:${1000 * h0.s}px">
<svg width="356" height="356" viewBox="0 0 356 356"><circle cx="178" cy="178" r="46" fill="none" stroke="#ff5a4d" stroke-width="8"/><circle cx="178" cy="178" r="74" fill="none" stroke="#ff5a4d" stroke-width="3" opacity=".55"/><circle cx="178" cy="178" r="102" fill="none" stroke="#ff5a4d" stroke-width="2" opacity=".28"/><circle cx="178" cy="178" r="19" fill="#ff5a4d" opacity=".85"/></svg></div>
<svg class="lensrim" width="392" height="392" style="left:${sk0[0] - 196}px;top:${sk0[1] - 196}px" viewBox="0 0 392 392"><circle cx="196" cy="196" r="182" fill="none" stroke="#52e3ff" stroke-width="4"/><circle cx="196" cy="196" r="190" fill="none" stroke="#52e3ff" stroke-width="10" stroke-dasharray="2 13" opacity=".7"/></svg>
<div class="tag" style="left:${sk0[0] - 178}px;top:${sk0[1] - 226}px;color:#ff5a4d">BONE ROUTE · INSIDE THE SKULL</div>
<svg class="abs" width="1080" height="1920">${waves0}</svg>
<div class="phone"><div class="pn"></div><div class="vn"><div class="top"><span>Voice note</span><span>0:07</span></div><div class="row"><b>${ph('play')}</b><div class="bars">${bars}</div></div><div class="rec">YOUR RECORDING</div></div></div>
<div class="fig">${wince}</div><div class="ugh">ugh</div>
<div class="chips"><span class="chip cy"><i></i>AIR ROUTE</span><span class="chip co"><i></i>BONE ROUTE</span></div>
${cap("You've", 'never', 'heard your own voice<br>the way everyone else does.')}
</section>`;

// ---------- F1: poll ----------
const F1 = `<section class="frame" id="f1">${chrome('1', 'THE 2025 SURPRISE', 'SRC · WALTER ET AL. 2025, CAN. ACOUSTICS 53(3)')}
<h1 class="hl">Higher or<br><span class="coralt" id="lw">lower?</span></h1>
<div class="panel"></div>
<svg class="abs" width="1080" height="1920" id="pollsvg">
<defs><pattern id="hat" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v14" stroke="#52e3ff" stroke-width="3" opacity=".55"/></pattern></defs>
<path d="M214 640V1196" stroke="#52e3ff" stroke-width="3"/>
${Array.from({ length: 19 }, (_, i) => `<path d="M214 ${640 + i * 31}h${i % 3 === 0 ? 24 : 12}" stroke="#52e3ff" stroke-width="2" opacity="${i % 3 === 0 ? 1 : .55}"/>`).join('')}
${[790, 1090].map((y) => `<path d="M250 ${y}H890" stroke="#e9eef5" stroke-width="1" opacity=".09"/>`).join('')}
<text x="236" y="634" class="rt">PITCH</text>
<path d="M240 940H890" stroke="#e9eef5" stroke-width="2" stroke-dasharray="6 8" opacity=".6"/>
<rect x="300" y="740" width="200" height="200" fill="url(#hat)" stroke="#52e3ff" stroke-width="4" stroke-dasharray="10 8"/>
<rect x="570" y="940" width="200" height="270" fill="#ff5a4d"/>
<path d="M670 990v170m-36-36 36 38 36-38" stroke="#0a1220" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M400 900v-110m-32 32 32-36 32 36" stroke="#52e3ff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<div class="lab" style="left:300px;top:626px;width:230px"><div class="ico c">${ph('book-open')}</div><span class="k">THEORY</span><b class="v">HIGHER ↑</b></div>
<div class="lab" style="left:622px;top:626px;width:280px"><div class="ico o">${ph('flask')}</div><span class="k">2025 STUDY</span><b class="v co" id="lv">MOST SAID<br>LOWER ↓</b></div>
<svg class="abs" width="1080" height="1920" id="roughsvg"></svg>
<img class="head" src="3d/head_closed.png" style="left:262px;top:972px;width:170px;-webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent)"><div class="tag" style="left:240px;top:1196px;color:rgba(233,238,245,.7)">YOU, PLAYING IT BACK</div>
<div class="chips sm" style="top:1262px"><span class="chip am big"><span class="ic">${ph('warning')}</span>SCIENTISTS DISAGREE</span><span class="chip dim">DIRECTION ONLY, NOT SIZE</span></div>
${cap('A 2025 study: most people heard', 'lower', '.')}
</section>`;

// ---------- F2: plugged ears ----------
const h2 = H(0.6, 266, 566); const sk2 = h2.p('skull');
const F2 = `<section class="frame" id="f2">${chrome('2', 'EARS PLUGGED · BONE ROUTE ONLY', 'SRC · HULLAR, SCIENTIFIC AMERICAN · TIER A')}
<h1 class="hl s2">Nobody else will ever hear the version <span class="coralt">you hear.</span></h1>
${ruler(204, 640, 1180, 29, 'CM')}
<svg class="abs" width="1080" height="1920"><circle cx="${sk2[0]}" cy="${sk2[1]}" r="312" fill="none" stroke="#52e3ff" stroke-width="4" opacity=".7"/><circle cx="${sk2[0]}" cy="${sk2[1]}" r="322" fill="none" stroke="#52e3ff" stroke-width="10" stroke-dasharray="2 14" opacity=".5"/></svg>
<img class="head" src="3d/head_cutplug.png" style="left:${h2.L}px;top:${h2.T}px;width:${1000 * h2.s}px">
<svg class="abs" width="1080" height="1920"><defs><radialGradient id="glow"><stop offset="0" stop-color="#ff5a4d" stop-opacity=".55"/><stop offset="1" stop-color="#ff5a4d" stop-opacity="0"/></radialGradient></defs>
<circle cx="${sk2[0]}" cy="${sk2[1] + 24}" r="150" fill="url(#glow)"/>
<circle cx="${sk2[0]}" cy="${sk2[1] + 24}" r="44" fill="none" stroke="#ff5a4d" stroke-width="9"/><circle cx="${sk2[0]}" cy="${sk2[1] + 24}" r="86" fill="none" stroke="#ff5a4d" stroke-width="5" opacity=".7"/><circle cx="${sk2[0]}" cy="${sk2[1] + 24}" r="128" fill="none" stroke="#ff5a4d" stroke-width="3" opacity=".4"/><circle cx="${sk2[0]}" cy="${sk2[1] + 24}" r="20" fill="#ff5a4d"/>
<g stroke="#52e3ff" stroke-width="5" fill="none" stroke-dasharray="4 12" opacity=".35" stroke-linecap="round"><path d="M800 760a70 70 0 0 1 0 110"/><path d="M830 735a105 105 0 0 1 0 160"/></g></svg>
<div class="tag" style="left:668px;top:742px;color:#52e3ff;opacity:.9;line-height:1.5"><span class="ic sm">${ph('speaker-x')}</span><br>AIR ROUTE<br>BLOCKED</div>
<div class="tag" style="left:${sk2[0] - 62}px;top:${sk2[1] + 236}px;color:#ff5a4d">BONE ROUTE</div>
<div class="hand l">${ph('hand-palm')}</div><div class="hand r">${ph('hand-palm')}</div>
<div class="chips sm" style="top:1262px"><span class="chip li big"><span class="ic">${ph('ear')}</span>TRY IT · FINGERS ON EARS, GENTLY</span><span class="chip cy"><svg width="52" height="26" viewBox="0 0 52 26"><path d="M0 6h20c12 0 16 4 18 16h14" fill="none" stroke="#52e3ff" stroke-width="3"/></svg>MUFFLED</span></div>
${cap('Nobody else will', 'ever', 'hear the version you hear.')}
</section>`;

const css = `${font('Familjen', 700, 'familjen-grotesk/familjen-grotesk-latin-700-normal')}${font('Familjen', 600, 'familjen-grotesk/familjen-grotesk-latin-600-normal')}${font('Frag', 400, 'fragment-mono/fragment-mono-latin-400-normal')}${font('InterX', 700, 'inter/inter-latin-700-normal')}${font('InterX', 600, 'inter/inter-latin-600-normal')}
:root{--ink:#0a1220;--cy:#52e3ff;--co:#ff5a4d;--li:#b8ff3d;--am:#ffb938;--tx:#e9eef5}
*{box-sizing:border-box}body{margin:0;background:#000}
.frame{position:relative;width:1080px;height:1920px;overflow:hidden;color:var(--tx);font-family:InterX;background:radial-gradient(900px 900px at 50% 44%,#16264a 0,#0c1528 52%,#060b15 100%)}
.frame::after{content:"";position:absolute;left:0;right:0;top:760px;height:240px;background:linear-gradient(transparent,rgba(82,227,255,.05),transparent);pointer-events:none}
.regs,.abs{position:absolute;left:0;top:0;pointer-events:none}
.badge{position:absolute;left:150px;top:150px;display:flex;gap:12px;align-items:center;font:400 21px/1 Frag;letter-spacing:.13em;color:var(--tx);border:1.5px solid rgba(233,238,245,.28);border-radius:999px;padding:11px 20px 11px 16px;background:rgba(6,10,18,.6)}
.badge i{width:12px;height:12px;border-radius:50%;background:var(--cy);box-shadow:0 0 12px var(--cy)}
.eyebrow{position:absolute;left:150px;top:214px;font:400 25px/1 Frag;letter-spacing:.12em;color:var(--cy)}
.hl{position:absolute;left:150px;top:262px;margin:0;width:768px;font:700 118px/1.0 Familjen;letter-spacing:-.035em;text-shadow:0 4px 14px rgba(0,0,0,.5)}
.hl.s2{font-size:84px;line-height:1.04;letter-spacing:-.03em;top:262px}
.blk{display:inline-block;padding:0 .14em;margin-left:.04em;border-radius:.1em;color:var(--ink);text-shadow:none}.blk.coral{background:var(--co)}
.coralt{color:var(--co)}
.rule{position:absolute;left:150px;top:1496px;width:768px;border-top:3px dashed rgba(82,227,255,.55)}
.src{position:absolute;left:150px;top:1506px;width:768px;font:400 15.5px/1.2 Frag;letter-spacing:.08em;color:rgba(233,238,245,.62)}
.head{position:absolute;-webkit-mask-image:linear-gradient(#000 82%,transparent 100%);mask-image:linear-gradient(#000 82%,transparent 100%)}
.lens{position:absolute;width:356px;height:356px;border-radius:50%;overflow:hidden;background:#0a1220;box-shadow:inset 0 0 0 2px rgba(82,227,255,.35)}.lens img{position:absolute}.lens svg{position:absolute;left:0;top:0}
.lensrim{position:absolute;pointer-events:none}
.tag{position:absolute;font:400 18px/1 Frag;letter-spacing:.12em;white-space:nowrap}
.ruler{position:absolute}.rt{font:400 16px Frag;fill:#52e3ff;letter-spacing:.08em}.rt.big{font-size:20px;letter-spacing:.14em}
.phone{position:absolute;left:710px;top:752px;width:206px;height:236px;border-radius:36px;background:#0e1830;border:3px solid #34476e;box-shadow:0 20px 50px rgba(0,0,0,.5),0 0 40px rgba(82,227,255,.14)}
.phone .pn{position:absolute;left:68px;top:12px;width:70px;height:16px;border-radius:9px;background:#060b15}
.vn{position:absolute;left:14px;right:14px;top:56px;background:#17254a;border:1.5px solid rgba(82,227,255,.4);border-radius:18px;padding:12px}
.vn .top{display:flex;justify-content:space-between;font:400 13px Frag;letter-spacing:.06em;color:rgba(233,238,245,.7);margin-bottom:10px}
.vn .row{display:flex;gap:10px;align-items:center}.vn b{width:40px;height:40px;border-radius:50%;background:var(--cy);color:var(--ink);display:grid;place-items:center;flex:none}.vn b .ic{width:20px;height:20px}
.bars{display:flex;gap:3px;align-items:center;height:44px}.bars i{display:block;width:4px;border-radius:2px;background:var(--cy)}
.rec{margin:12px 0 0;font:400 12.5px Frag;letter-spacing:.14em;color:var(--cy)}
.ic{fill:currentColor;width:30px;height:30px;display:block}.ic.sm{width:20px;height:20px;display:inline-block;vertical-align:-4px}
.fig{position:absolute;left:728px;top:1022px;width:192px;transform:scaleX(-1)}.fig svg{width:100%;height:auto}
.ugh{position:absolute;left:812px;top:984px;font:600 24px/1 Familjen;color:var(--tx);border:2px solid var(--cy);border-radius:999px;padding:7px 14px;background:rgba(6,10,18,.8)}
.chips{position:absolute;left:150px;top:1262px;display:flex;gap:12px;flex-wrap:nowrap}
.chip{display:inline-flex;gap:12px;align-items:center;font:400 21px/1 Frag;letter-spacing:.1em;border-radius:999px;padding:13px 20px;border:2px solid;background:rgba(6,10,18,.7);white-space:nowrap}
.chip i{width:14px;height:14px;border-radius:50%}.chip.cy{color:var(--cy);border-color:var(--cy)}.chip.cy i{background:var(--cy)}.chip.co{color:var(--co);border-color:var(--co)}.chip.co i{background:var(--co)}
.chip.am{color:var(--ink);background:var(--am);border-color:var(--am)}.chip.li{color:var(--ink);background:var(--li);border-color:var(--li)}.chip.dim{color:rgba(233,238,245,.75);border-color:rgba(233,238,245,.3)}
.chip .ic{width:26px;height:26px}.chip.big{padding:12px 18px 12px 12px;font-weight:400}.chips.sm .chip{font-size:18.5px;letter-spacing:.07em;padding:12px 16px}.chips.sm .chip .ic{width:24px;height:24px}
.cap{position:absolute;left:150px;top:1356px;width:768px;min-height:122px;border-radius:26px;background:rgba(6,10,18,.92);border:1.5px solid rgba(233,238,245,.16);padding:20px 24px;text-align:center;font:700 40px/1.3 InterX;color:var(--tx)}
.cap b{background:var(--tx);color:var(--ink);padding:1px 10px;border-radius:8px}
.panel{position:absolute;left:150px;top:596px;width:768px;height:636px;border-radius:26px;background:rgba(10,18,32,.72);border:2px solid rgba(82,227,255,.3)}
.lab{position:absolute;display:grid;gap:5px}.lab .k{font:400 17px Frag;letter-spacing:.14em;color:rgba(233,238,245,.8)}.lab .v{font:700 34px/1.05 Familjen;letter-spacing:-.02em}.lab .v.co{color:var(--co)}
.lab .ico{width:34px;height:34px}.lab .ico .ic{width:34px;height:34px}.lab .ico.c{color:var(--cy)}.lab .ico.o{color:var(--co)}
.foot{position:absolute;left:150px;top:1330px;font:400 15px Frag;letter-spacing:.1em;color:rgba(233,238,245,.0)}
.hand{position:absolute;width:96px;color:var(--li);filter:drop-shadow(0 4px 10px rgba(0,0,0,.6))}.hand .ic{width:96px;height:96px}.hand.l{left:300px;top:922px;transform:rotate(18deg)}.hand.r{left:688px;top:868px;transform:scaleX(-1) rotate(18deg)}
`;
const html = `<!doctype html><meta charset="utf-8"><style>${css}</style><body>${F0}${F1}${F2}<script src="../../../assets/animations/rough/rough.min.js"></script><script>
const svg=document.getElementById('roughsvg');const rc=rough.svg(svg);
svg.appendChild(rc.ellipse(760,714,316,170,{stroke:'#ff5a4d',strokeWidth:4,roughness:1.8,seed:7}));
</script>`;
writeFileSync(new URL('./mockup.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./mockup.html', import.meta.url).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(700);
for (const id of ['f0', 'f1', 'f2']) await (await p.$('#' + id)).screenshot({ path: new URL(`./v1_${id}.png`, import.meta.url).pathname });
await b.close();
