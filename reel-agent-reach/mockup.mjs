// Throwaway mockup (delete once the full build supersedes it): 3 scenes of the "Field Notebook" visual system.
import fs from 'node:fs'; import path from 'node:path'; import { chromium } from 'playwright';
const out = path.resolve('mockup'); const prof = '../../reel-app/public/profile.jpg';
const ico = n => { const s = fs.readFileSync(`../assets/icons/tabler/${n}.svg`, 'utf8'); return s.replace(/<svg[^>]*>/, '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'); };
const brand = n => fs.readFileSync(`../assets/icons/simple-icons/${n}.svg`, 'utf8').replace(/<svg([^>]*)>/, (m, a) => `<svg${a.replace(/fill="[^"]*"/, '')} fill="currentColor">`);
const INK = '#14110f', RED = '#e63946', BONE = '#f3ecdf', SAGE = '#9bb89a', BUTTER = '#f2c14e';
// Reach mascot: cherry glove. mode 'open' | 'point'
const hand = (mode, rot = 0, w = 260) => mode === 'point'
 ? `<svg viewBox="0 0 300 200" width="${w}" style="transform:rotate(${rot}deg);filter:drop-shadow(0 10px 14px rgba(20,17,15,.35))"><g stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" fill="${RED}">
  <rect x="226" y="52" width="66" height="100" rx="12" fill="${BONE}"/><path d="M244 52v100" stroke-width="8"/>
  <rect x="8" y="64" width="150" height="36" rx="18"/><rect x="104" y="26" width="104" height="44" rx="22"/><rect x="96" y="56" width="140" height="104" rx="32"/><rect x="84" y="104" width="58" height="26" rx="13"/><rect x="84" y="130" width="58" height="26" rx="13"/></g></svg>`
 : `<svg viewBox="0 0 220 300" width="${w}" style="transform:rotate(${rot}deg);filter:drop-shadow(0 10px 14px rgba(20,17,15,.35))"><g stroke="${INK}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" fill="${RED}">
  <rect x="62" y="205" width="96" height="90" rx="14" fill="${BONE}"/><rect x="62" y="232" width="96" height="14" fill="${INK}" stroke="none"/>
  <rect x="40" y="46" width="32" height="130" rx="16"/><rect x="76" y="14" width="34" height="160" rx="17"/><rect x="114" y="22" width="34" height="154" rx="17"/><rect x="152" y="54" width="32" height="124" rx="16"/><rect x="2" y="120" width="76" height="34" rx="17" transform="rotate(-34 40 137)"/><rect x="38" y="116" width="148" height="100" rx="34"/></g></svg>`;
const base = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:'Archivo Black';src:url('../../assets/fonts/archivo-black/archivo-black-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'Instrument Serif';src:url('../../assets/fonts/instrument-serif/instrument-serif-latin-400-italic.woff2');font-style:italic;font-display:block}
@font-face{font-family:'Instrument Serif';src:url('../../assets/fonts/instrument-serif/instrument-serif-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'JetBrains Mono';src:url('../../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');font-weight:700;font-display:block}
*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:${BONE};position:relative;font-family:'Archivo Black';color:${INK};
 background-image:linear-gradient(rgba(20,17,15,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(20,17,15,.07) 1px,transparent 1px);background-size:60px 60px}
.abs{position:absolute}.serif{font-family:'Instrument Serif';font-style:italic;font-weight:400}.mono{font-family:'JetBrains Mono';font-weight:700}
.tag{position:absolute;font-family:'JetBrains Mono';font-weight:700;font-size:28px;letter-spacing:.16em;color:${INK};background:${BUTTER};padding:8px 16px;border:3px solid ${INK};transform:rotate(-2deg)}
.host{position:absolute;border:6px solid ${INK};border-radius:28px;overflow:hidden;background:#cfc7b8;box-shadow:10px 10px 0 ${INK}}
.host img{position:absolute;width:100%;height:100%;object-fit:cover}
.cap{position:absolute;left:0;right:0;text-align:center;font-size:84px;line-height:1.02;letter-spacing:-.03em;text-shadow:none}
.cap b{background:${BONE};padding:2px 18px;border:5px solid ${INK};display:inline-block;box-shadow:7px 7px 0 ${INK};font-weight:400}
.cap .serif{font-size:104px;color:${RED}}
.card{position:absolute;background:#fffaf0;border:5px solid ${INK};box-shadow:9px 9px 0 ${INK};padding:22px 28px}
.card:before{content:'';position:absolute;top:-22px;left:50%;width:120px;height:40px;margin-left:-60px;background:rgba(242,193,78,.85);border:3px solid ${INK};transform:rotate(-3deg)}
.nt:before{display:none}.num{font-family:'Instrument Serif';font-style:italic;font-size:150px;line-height:.8;color:${RED}}
.safe{display:none}
</style><body>`;
const scenes = {
 s1: `${base}
 <div class=tag style="left:150px;top:150px">// AGENT WITHOUT EYES</div>
 <div class=host style="left:70px;top:230px;width:940px;height:1270px"><img src="${prof}" style="object-position:50% 20%;transform:scale(1.12)"></div>
 <div class=abs style="left:760px;top:140px">${hand('open', 14, 190)}</div>
 <div class=abs style="left:150px;top:1420px;width:768px;font-size:30px;line-height:1.2;text-align:left" ></div>
 <div class=cap style="top:1170px"><b>Your AI agent is</b><br><span class=serif style="background:${BONE};padding:0 24px;border:5px solid ${INK};box-shadow:7px 7px 0 ${INK};display:inline-block;margin-top:18px">basically blind.</span></div>`,
 s4: `${base}
 <div class=tag style="left:150px;top:150px">// ONE LINE, AGENT INSTALLS ITSELF</div>
 <div class=card style="left:170px;top:270px;width:640px;transform:rotate(-2deg)"><div class=abs style="display:none"></div><div style="display:flex;gap:26px;align-items:center"><div class=num>1</div><div style="font-size:44px;line-height:1.05">COPY THE<br>INSTALL LINK</div></div></div>
 <div class=card style="left:240px;top:520px;width:640px;transform:rotate(1.6deg);background:${BUTTER}"><div style="display:flex;gap:26px;align-items:center"><div class=num style="color:${INK}">2</div><div style="font-size:44px;line-height:1.05">PASTE IT IN<br>YOUR AGENT</div></div></div>
 <div class=card style="left:180px;top:770px;width:700px;transform:rotate(-1deg);background:${INK};color:${BONE}"><div class=mono style="font-size:30px;line-height:1.5;color:${SAGE}">$ agent-reach install<br><span style="color:${BONE}">&gt; checking environment…</span><br><span style="color:${BUTTER}">&gt; web ✓  youtube ✓  github ✓  rss ✓</span><span style="color:${RED}"> █</span></div></div>
 <div class=abs style="left:690px;top:610px">${hand('point', 0, 240)}</div>
 <div class=abs style="left:0;right:0;top:1040px;height:120px;background:${INK}"></div>
 <div class=cap style="top:1052px;font-size:76px;color:${BONE}"><span style="color:${BONE}">Setup is </span><span class=serif style="color:${BUTTER};font-size:100px">one line.</span></div>
 <div class=host style="left:70px;top:1190px;width:940px;height:346px;box-shadow:8px 8px 0 ${RED}"><img src="${prof}" style="object-position:50% 52%"></div>`,
 s10: `${base}
 <div class=tag style="left:150px;top:150px">// THE LINK IS IN YOUR DMS</div>
 <div class=host style="left:70px;top:230px;width:940px;height:760px"><img src="${prof}" style="object-position:50% 20%;transform:scale(1.2) translateY(2%)"></div>
 <div class=abs style="left:720px;top:700px">${hand('point', -90, 260)}</div>
 <div class=cap style="top:1020px;font-size:78px"><b>Want the link?</b></div>
 <div class=card style="left:150px;top:1180px;width:700px;border-radius:34px;padding:26px 34px"><div style="display:flex;align-items:center;gap:26px"><img src="${prof}" style="width:136px;height:136px;border-radius:50%;object-fit:cover;object-position:50% 20%;border:6px solid ${RED};box-shadow:0 0 0 5px ${INK}"><div><div class=mono style="font-size:30px;color:#6b6258">@sandesh.explains</div><div style="font-size:66px;line-height:1;margin-top:6px">COMMENT <span style="background:${RED};color:${BONE};padding:0 14px;border-radius:12px;display:inline-block;transform:rotate(-2deg)">REACH</span></div></div></div></div>
 <div class="card nt" style="left:210px;top:1400px;width:600px;padding:14px 24px;background:${SAGE};transform:rotate(1deg)"><div class=mono style="font-size:26px">&gt; REACH  →  link lands in your DMs</div></div>`
};
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [k, h] of Object.entries(scenes)) { fs.writeFileSync(`${out}/${k}.html`, h); await pg.goto('file://' + `${out}/${k}.html`); await pg.waitForTimeout(500); await pg.screenshot({ path: `${out}/${k}.png` }); }
await b.close();
