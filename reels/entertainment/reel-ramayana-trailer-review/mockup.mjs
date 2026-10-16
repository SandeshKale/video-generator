// 3-scene approval mockup (static frames): footage still + kinetic type | bespoke SVG timeline | annotated poster collage. Avatar tile = profile photo placeholder.
import { chromium } from '../../../node_modules/playwright/index.mjs';
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const U=p=>pathToFileURL(path.resolve(p)).href, A='../../../assets/fonts/';
const ff=(f,w,u)=>`@font-face{font-family:'${f}';font-weight:${w};src:url('${U(A+u)}');font-display:block}`;
const css=`${ff('Anton',400,'anton/anton-latin-400-normal.woff2')}${ff('Inter',600,'inter/inter-latin-600-normal.woff2')}${ff('Inter',700,'inter/inter-latin-700-normal.woff2')}${ff('JB',700,'jetbrains-mono/jetbrains-mono-latin-700-normal.woff2')}
*{box-sizing:border-box;margin:0}body{width:1080px;height:1920px;background:#12100d;color:#f3ecdc;font-family:Inter;position:relative;overflow:hidden}
.grain{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 2px,transparent 2px 4px)}
.eye{position:absolute;left:150px;top:150px;font:700 28px JB;letter-spacing:.14em;color:#ffb703}
.dot{display:inline-block;width:16px;height:16px;border-radius:50%;background:#ff4d2e;margin-right:12px}
.step{position:absolute;right:170px;top:150px;font:700 24px JB;color:#12100d;background:#ffb703;padding:6px 12px}
.h{position:absolute;left:150px;width:770px;font:400 118px/1 Anton;text-transform:uppercase;text-shadow:0 4px 12px rgba(0,0,0,.55)}
.h b{color:#ff4d2e;font-weight:400}
.av{position:absolute;left:150px;top:1010px;width:430px;height:430px;border:8px solid #ffb703;border-radius:28px;overflow:hidden;background:#000;box-shadow:0 14px 40px rgba(0,0,0,.6)}
.av img{width:100%;height:100%;object-fit:cover}.av i{position:absolute;left:12px;top:12px;font:700 18px JB;font-style:normal;background:#ff4d2e;color:#12100d;padding:3px 8px}
.chips{position:absolute;left:620px;top:1010px;width:298px;display:flex;flex-direction:column;gap:14px}
.chip{border:3px solid #ffb703;padding:12px 14px;font:700 24px/1.2 JB;color:#f3ecdc;background:rgba(18,16,13,.8)}.chip.r{border-color:#ff4d2e}
.cap{position:absolute;left:150px;width:768px;top:1470px;background:rgba(0,0,0,.72);border-left:8px solid #ffb703;padding:18px 24px;font:700 40px/1.25 Inter;text-align:left}
.rule{position:absolute;left:150px;width:768px;top:1425px;height:0;border-top:4px dashed #ff4d2e}
.fr{position:absolute;left:0;width:1080px;overflow:hidden}.fr img{width:100%;height:100%;object-fit:cover}
.note{position:absolute;font:700 22px JB;color:#9a917c;left:150px;top:1600px;width:768px}
`;
const avatar=`<div class="av"><img src="${U('../../../prototypes/reel-app/public/profile.jpg')}"><i>AVATAR HOST (PLACEHOLDER)</i></div>`;
const base=(inner,step,eye)=>`<meta charset=utf-8><style>${css}</style><div class="eye"><span class="dot"></span>${eye}</div><div class="step">${step}</div>${inner}${avatar}<div class="rule"></div>`;
const scenes={
'A-hook':base(`
 <div class="fr" style="top:0;height:1000px"><img src="${U('frames/g_42.png')}" style="filter:brightness(.55) saturate(1.1)"></div>
 <div style="position:absolute;inset:0;height:1000px;background:linear-gradient(#12100d 0,transparent 25%,transparent 55%,#12100d 100%)"></div>
 <div class="h" style="top:560px">New trailer.<br><b>One thing you missed.</b></div>
 <div class="chips"><div class="chip">OCT 15 · SONY<br>NEW TRAILER</div><div class="chip r">IN THEATRES<br>NOV 5 · IMAX</div></div>
 <div class="cap">Ramayana's new trailer is out. And this time, it feels different.</div>`,'1/4','// THE NEW TRAILER · WHAT I NOTICED'),
'B-entry-order':base(`
 <div class="h" style="top:240px;font-size:104px">Who walks in <b>first?</b></div>
 <svg style="position:absolute;left:150px;top:660px;width:768px;height:340px" viewBox="0 0 768 380">
  <rect x="0" y="150" width="768" height="26" fill="#2a251c"/>
  <rect x="0" y="150" width="${768*39.3/156.6}" height="26" fill="#ff4d2e"/>
  <circle cx="${768*39.3/156.6}" cy="163" r="26" fill="#ff4d2e" stroke="#12100d" stroke-width="6"/>
  <circle cx="${768*73.5/156.6}" cy="163" r="26" fill="#ffb703" stroke="#12100d" stroke-width="6"/>
  <text x="${768*39.3/156.6}" y="60" fill="#ff4d2e" font-family="Anton" font-size="64" text-anchor="middle">RAVANA</text>
  <text x="${768*73.5/156.6}" y="60" fill="#ffb703" font-family="Anton" font-size="64" text-anchor="middle">RAM</text>
  <text x="${768*39.3/156.6}" y="240" fill="#f3ecdc" font-family="JB" font-weight="700" font-size="30" text-anchor="middle">0:39</text>
  <text x="${768*73.5/156.6}" y="240" fill="#f3ecdc" font-family="JB" font-weight="700" font-size="30" text-anchor="middle">1:13</text>
  <rect x="${768*39.3/156.6+30}" y="290" width="${768*34.2/156.6-60}" height="14" fill="#ffb703"/><text x="${768*56/156.6}" y="350" fill="#ffb703" font-family="Inter" font-weight="700" font-size="30" text-anchor="middle">34 seconds apart</text>
 </svg>
 <div style="position:absolute;left:150px;top:480px;width:330px;height:170px;border:6px solid #ff4d2e;overflow:hidden"><img src="${U('frames/g_42.png')}" style="width:100%;height:100%;object-fit:cover"></div><div style="position:absolute;left:588px;top:480px;width:330px;height:170px;border:6px solid #ffb703;overflow:hidden"><img src="${U('frames/g_63.png')}" style="width:100%;height:100%;object-fit:cover"></div>
 <div class="chips"><div class="chip r">LOUD · BRIGHT<br>VILLAIN</div><div class="chip">QUIET · DARK<br>HERO</div></div>
 <div class="cap">The villain walks in loud. The hero arrives quiet, in the dark.</div>`,'3/4','// ENTRY ORDER'),
'C-poster':base(`
 <div class="h" style="top:230px;font-size:104px">No star's name.<br><b>Only the story.</b></div>
 <div class="fr" style="top:620px;left:150px;width:768px;height:332px;border:6px solid #ffb703"><img src="${U('frames/end.png')}"></div>
 <div style="position:absolute;left:170px;top:625px;width:520px;height:62px;border:6px solid #ff4d2e"></div>
 <div style="position:absolute;left:700px;top:700px;font:700 24px JB;background:#ff4d2e;color:#12100d;padding:6px 10px">NO CAST NAMES</div>
 <div class="chips"><div class="chip r">0 ACTOR<br>NAMES</div><div class="chip">FOLLOW FOR<br>MORE REVIEWS</div></div>
 <div class="cap">Even the poster sells the story, not a star. Verdict: in the theatre.</div>`,'4/4','// THE END POSTER'),
};
const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920}});
for(const [n,h] of Object.entries(scenes)){fs.writeFileSync(`mockup/${n}.html`,h);await pg.goto(U(`mockup/${n}.html`));await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(300);await pg.screenshot({path:`mockup/${n}.png`});}
await b.close();
