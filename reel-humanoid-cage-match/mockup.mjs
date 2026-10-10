// Throwaway mockup (delete once the full build supersedes it): 3 scenes of the "Fight Poster Riso" system, 1080x1920.
import fs from 'node:fs'; import { chromium } from 'playwright';
const KR = '#d8c4a3', BL = '#2338ff', RD = '#ff4326', INK = '#1b1630';
const fighter = (c = BL, g = RD) => `<svg viewBox="0 0 400 600"><g stroke="${c}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">
 <path d="M150 330 L128 560 H182 L205 400 L228 560 H284 L262 330Z" fill="${c}"/><path d="M135 330h135v36h-135z" fill="${g}" stroke="${g}"/>
 <path d="M140 160 L260 160 L275 335 H128Z" fill="none"/><rect x="140" y="150" width="120" height="190" rx="30" fill="${KR}"/>
 <circle cx="200" cy="95" r="46" fill="${KR}"/><path d="M155 80 h92" stroke="${g}" stroke-width="16"/>
 <path d="M146 190 L96 250 L128 120" fill="none"/><path d="M254 190 L300 262 L282 140" fill="none"/>
 <circle cx="128" cy="116" r="38" fill="${g}" stroke="${g}"/><circle cx="284" cy="136" r="38" fill="${g}" stroke="${g}"/>
 <path d="M180 112 q20 14 40 0" fill="none" stroke-width="8"/></g></svg>`;
const robot = (c = RD, g = BL) => `<svg viewBox="0 0 400 600"><g stroke="${c}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">
 <rect x="150" y="30" width="100" height="84" rx="14" fill="${KR}"/><rect x="164" y="62" width="72" height="20" rx="6" fill="${g}" stroke="${g}"/><path d="M200 30 V6" /><circle cx="200" cy="6" r="8" fill="${c}"/>
 <rect x="110" y="132" width="180" height="200" rx="18" fill="${KR}"/><rect x="146" y="170" width="108" height="64" rx="8" fill="none"/><circle cx="200" cy="270" r="14" fill="${g}" stroke="${g}"/>
 <circle cx="110" cy="160" r="22" fill="${c}"/><circle cx="290" cy="160" r="22" fill="${c}"/>
 <path d="M96 170 L66 262 L130 130" fill="none" stroke-width="22"/><path d="M304 170 L338 258 L274 136" fill="none" stroke-width="22"/>
 <rect x="96" y="96" width="62" height="54" rx="10" fill="${g}" stroke="${g}"/><rect x="246" y="116" width="62" height="54" rx="10" fill="${g}" stroke="${g}"/>
 <rect x="130" y="332" width="140" height="40" rx="8" fill="${c}"/><path d="M150 372 L140 560 H190 L200 420 M250 372 L262 560 H312 L296 420" fill="none" stroke-width="26"/>
 <circle cx="146" cy="470" r="14" fill="${g}" stroke="${g}"/><circle cx="270" cy="470" r="14" fill="${g}" stroke="${g}"/></g></svg>`;
const pilot = (c = BL) => `<svg viewBox="0 0 400 420"><g stroke="${c}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">
 <rect x="130" y="230" width="140" height="170" rx="26" fill="none"/><rect x="104" y="300" width="192" height="90" rx="22" fill="${c}" opacity=".25" stroke="none"/>
 <circle cx="200" cy="110" r="50" fill="${KR}"/><rect x="140" y="88" width="120" height="50" rx="22" fill="${c}"/><path d="M146 112 H110 M254 112 H290" />
 <path d="M150 260 L98 330 L168 352" fill="none"/><path d="M250 260 L302 330 L232 352" fill="none"/>
 <rect x="150" y="334" width="100" height="44" rx="22" fill="${KR}"/><circle cx="178" cy="356" r="8" fill="${c}"/><circle cx="222" cy="356" r="8" fill="${c}"/></g></svg>`;
const css = `
@font-face{font-family:An;src:url('../assets/anton-latin-400-normal.woff2')}
@font-face{font-family:BC;font-weight:800;src:url('../assets/barlow-condensed-latin-800-normal.woff2')}
@font-face{font-family:BC;font-weight:600;src:url('../assets/barlow-condensed-latin-600-normal.woff2')}
@font-face{font-family:IN;font-weight:600;src:url('../assets/inter-latin-600-normal.woff2')}
*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:${KR};position:relative;font-family:IN;color:${BL}}
.ht{position:absolute;inset:0;background-image:radial-gradient(${BL}33 2.2px,transparent 2.6px);background-size:22px 22px;mask-image:linear-gradient(180deg,#000 0,transparent 55%)}
.ht2{position:absolute;inset:0;background-image:radial-gradient(${RD}33 2.2px,transparent 2.6px);background-size:22px 22px;background-position:11px 11px;mask-image:linear-gradient(0deg,#000 0,transparent 50%)}
.a{position:absolute}.mx{mix-blend-mode:multiply}
.eb{position:absolute;left:150px;top:160px;font:800 34px BC;letter-spacing:.14em;color:${BL};border:4px solid ${BL};padding:6px 16px;transform:rotate(-1.5deg)}
.cap{position:absolute;left:120px;right:120px;top:1340px;text-align:center;font:800 70px/1 BC;color:#fff;background:${INK};padding:16px 28px;border-radius:14px}
.stub{position:absolute;background:#f3e9d4;border:4px solid ${INK};color:${INK};font:800 34px BC;letter-spacing:.06em;padding:12px 24px}
.stamp{position:absolute;border:10px solid ${RD};color:${RD};font:800 74px/1 BC;padding:6px 26px;transform:rotate(-8deg);mix-blend-mode:multiply;letter-spacing:.04em}
.big{position:absolute;font:400 150px/.92 An;text-transform:uppercase}
`;
const mis = (svg, dx = 4) => `<div class="a mx" style="inset:0">${svg}</div>`;
const S = {
 s1: `<div class=ht></div><div class=ht2></div><div class=eb>// 1 HUMAN, 3 ROBOTS</div>
 <div class="big" style="left:130px;top:250px;color:${BL}">No AI was</div><div class="big" style="left:130px;top:392px;color:${RD}">fighting.</div>
 <div class="a mx" style="left:90px;top:640px;width:430px">${fighter(BL, RD)}</div>
 <div class="a mx" style="left:560px;top:640px;width:430px;transform:scaleX(-1)">${robot(RD, BL)}</div>
 <div class="a" style="left:0;right:0;top:1160px;height:14px;background:${INK}"></div><div class="a" style="left:0;right:0;top:1110px;height:10px;background:${RD}"></div><div class="a" style="left:0;right:0;top:1060px;height:10px;background:${BL}"></div>
 <div class="stamp" style="left:430px;top:900px;font-size:110px;transform:rotate(-6deg);background:${KR}">VS</div>
 <div class="stub" style="left:150px;top:1200px;transform:rotate(-2deg)">SF · SEPT 18</div><div class="stub" style="left:560px;top:1214px;transform:rotate(2deg)">ILLUSTRATION · NOT FOOTAGE</div>
 <div class=cap>This robot cage fight went viral.</div>`,
 s5: `<div class=ht></div><div class=ht2></div><div class=eb>// PILOTED, NOT AUTONOMOUS</div>
 <div class="a mx" style="left:290px;top:230px;width:500px">${pilot(BL)}</div>
 <div class="stub" style="left:90px;top:560px;transform:rotate(-3deg)">PILOT · VR + GAMEPAD</div>
 <svg class=a style="left:0;top:0" width=1080 height=1920 fill=none stroke="${INK}" stroke-width=5 stroke-dasharray="4 14" stroke-linecap=round><path d="M390 600 C 250 720 250 800 360 930"/><path d="M690 600 C 830 720 830 800 720 930"/><path d="M540 440 C 540 650 540 760 540 880"/></svg>
 <div class="a mx" style="left:290px;top:800px;width:500px">${robot(RD, BL)}</div>
 <div class="a" style="left:130px;top:1120px;width:200px;display:flex;gap:12px;flex-wrap:wrap">${['A','B','X','Y'].map((b,i)=>`<div style="width:84px;height:84px;border-radius:50%;border:6px solid ${i==2?RD:BL};background:${i==2?RD:'transparent'};color:${i==2?KR:BL};font:800 46px/72px BC;text-align:center">${b}</div>`).join('')}</div>
 <div class="a" style="left:790px;top:1090px;width:210px;height:150px"><svg viewBox="0 0 210 130"><path d="M10 120 A95 95 0 0 1 200 120" fill="none" stroke="${INK}" stroke-width="12"/><path d="M60 120 A50 50 0 0 1 150 120" fill="none" stroke="${RD}" stroke-width="12"/><path d="M105 120 L128 44" stroke="${BL}" stroke-width="10" stroke-linecap="round"/><circle cx="105" cy="120" r="12" fill="${BL}"/></svg><div style="font:800 28px BC;color:${INK};text-align:center;margin-top:-6px">AI = BALANCE ONLY</div></div>
 <div class=cap>Every robot had a human pilot.</div>`,
 s9: `<div class=ht></div><div class=ht2></div><div class=eb>// 12 DAYS TO A CEASE-AND-DESIST</div>
 <div class="a" style="left:190px;top:300px;width:700px;height:820px;background:#f6eedc;border:5px solid ${INK};box-shadow:14px 14px 0 ${BL};transform:rotate(-2deg);padding:56px 52px;color:${INK}">
  <div style="font:800 40px BC;letter-spacing:.1em">STATE ATHLETIC COMMISSION</div><div style="height:6px;background:${INK};margin:14px 0 24px"></div>
  <div style="font:600 30px/1.5 IN">Re: <b>unsanctioned human vs. humanoid cage match</b></div><br>
  <div style="font:600 28px/1.55 IN">…barred from holding, promoting, or advertising any boxing or mixed martial arts contest or exhibition involving humans without prior approval.</div>
  <div style="position:absolute;left:52px;bottom:48px;font:800 36px BC;letter-spacing:.08em">SEPT 30 ← SEPT 18</div></div>
 <div class="stamp" style="left:300px;top:760px;font-size:96px">APPROVAL<br>REQUIRED</div>
 <div class="big" style="left:150px;top:1160px;color:${BL};font-size:190px">8.2M</div><div class="a" style="left:640px;top:1240px;font:800 54px BC;color:${RD};letter-spacing:.06em">VIEWS</div>
 <div class="stub" style="left:620px;top:1160px;transform:rotate(3deg);font-size:28px">YOUTUBE · AS OF OCT 7</div>
 <div class=cap>California stepped in.</div>`
};
fs.mkdirSync('mock', { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [k, h] of Object.entries(S)) { fs.writeFileSync(`mock/${k}.html`, `<!doctype html><meta charset=utf8><style>${css}</style><body>${h}</body>`); await p.goto('file://' + process.cwd() + `/mock/${k}.html`); await p.waitForTimeout(500); await p.screenshot({ path: `mock/${k}.png` }); }
await b.close();
