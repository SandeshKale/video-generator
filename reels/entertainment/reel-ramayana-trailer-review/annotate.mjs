// Builds 1080x1920 annotated screengrab cards from the trailer frames (frames/ is gitignored: copyrighted footage).
import { chromium } from '../../../node_modules/playwright/index.mjs';
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const A='../../../assets/fonts/';
const font=(f,w,u)=>`@font-face{font-family:'${f}';font-weight:${w};src:url('${pathToFileURL(path.resolve(A+u))}');font-display:block}`;
const css=`${font('Anton',400,'anton/anton-latin-400-normal.woff2')}${font('Inter',600,'inter/inter-latin-600-normal.woff2')}${font('Inter',700,'inter/inter-latin-700-normal.woff2')}${font('JB',700,'jetbrains-mono/jetbrains-mono-latin-700-normal.woff2')}
*{box-sizing:border-box;margin:0}body{width:1080px;height:1920px;background:#12100d;color:#f3ecdc;font-family:Inter;position:relative;overflow:hidden}
.perf{position:absolute;left:0;right:0;height:34px;background:repeating-linear-gradient(90deg,#12100d 0 22px,#2a251c 22px 44px)}
.eye{position:absolute;left:120px;top:150px;font:700 30px JB;letter-spacing:.14em;color:#ffb703}
.h{position:absolute;left:120px;right:120px;top:205px;font:400 92px/1.02 Anton;text-transform:uppercase;letter-spacing:.01em;text-shadow:0 4px 12px rgba(0,0,0,.5)}
.h b{color:#ff4d2e;font-weight:400}
.fr{position:absolute;left:0;top:640px;width:1080px;height:608px;overflow:hidden;border-top:6px solid #ffb703;border-bottom:6px solid #ffb703}
.fr img{width:100%;height:100%;object-fit:cover}
svg{position:absolute;left:0;top:0;width:1080px;height:608px}
.lab{position:absolute;font:700 26px JB;background:#ff4d2e;color:#12100d;padding:8px 14px;letter-spacing:.04em;white-space:nowrap}
.stat{position:absolute;left:120px;top:1300px;font:400 190px/1 Anton;color:#ffb703}
.stat small{font:700 40px Inter;color:#f3ecdc;margin-left:20px;letter-spacing:0}
.t{position:absolute;left:120px;right:200px;top:1500px;font:600 34px/1.35 Inter;color:#eee6d3}
.av{position:absolute;left:610px;top:1320px;width:300px;height:340px;-webkit-mask-image:radial-gradient(ellipse 50% 52% at 50% 46%,#000 62%,transparent 100%);mask-image:radial-gradient(ellipse 50% 52% at 50% 46%,#000 62%,transparent 100%)}.av img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.mock .stat small{display:block;margin:0;font-size:34px}.mock .stat{font-size:170px}.mock .t{right:480px;font-size:30px;top:1530px}.mock .src{top:1745px;right:120px}
.src{position:absolute;left:120px;right:200px;top:1740px;font:700 21px/1.4 JB;color:#9a917c;letter-spacing:.04em}
.tag{position:absolute;right:120px;top:96px;font:700 24px JB;color:#12100d;background:#ffb703;padding:6px 12px}`;
const circ=(x,y,r)=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.8}" fill="none" stroke="#ff4d2e" stroke-width="7" stroke-dasharray="3 0"/>`;
const rect=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#ff4d2e" stroke-width="7"/>`;
const arrow=(x1,y1,x2,y2)=>`<defs><marker id="a" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10z" fill="#ff4d2e"/></marker></defs><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ff4d2e" stroke-width="7" marker-end="url(#a)"/>`;
// frame is 1280x720 shown cover-cropped into 1080x608 (scale .84375, vertical crop ~0)
const S=1080/1280, oy=(720*S-608)/2;
const P=(x,y)=>[x*S,y*S-oy];
const cards=[
 {n:'01-ravana-first',img:'g_42.png',eye:'// WHO GETS INTRODUCED FIRST',h:'Ravana is named <b>34 seconds</b> before Ram',
  mk:()=>{const[x,y]=P(610,300);return circ(x,y,110)+`<div class="lab" style="left:560px;top:30px">0:39 · "RAVANA…"</div>`},
  stat:'34 s',unit:'gap',tm:'Ravana is named at 0:39. Ram, at 1:13.',t:'"Ravana" is first spoken at 0:39. "Ram" is first spoken at 1:13. The villain also gets the first full speech.',src:'MEASURED: Whisper transcript of the uploaded trailer (Ravana 39.3 s, Ram 73.5 s). Frame ~0:42.'},
 {n:'02-villain-hero-shot',img:'g_50.png',eye:'// WHERE THE POSTER FRAMES GO',h:'The best-lit <b>hero shot</b> goes to the villain',
  mk:()=>{const[x,y]=P(590,390);return circ(x,y,170)+arrow(930,520,760,430)+`<div class="lab" style="left:640px;top:520px">WARM SKY · LOW ANGLE</div>`},
  stat:'0:50',unit:'Ravana on the pile',t:'A low angle, a gold sky and a spear: it is framed like a hero poster. My read: it is the trailer\'s most confident image, and it is not Ram\'s.',src:'OPINION (labelled). Frame at 0:50 of the uploaded trailer.'},
 {n:'03-ram-dark',img:'g_68.png',eye:'// RAM WALKS IN',h:'His entrance is the <b>darkest</b> stretch',
  mk:()=>{const[x,y]=P(640,430);return rect(x-90,y-120,180,300)+`<div class="lab" style="left:60px;top:40px">1:08 · FOREST, NEAR-BLACK</div>`},
  stat:'−35%',unit:'brightness',tm:'Ram\'s entrance is the darkest and quietest stretch.',t:'Between 1:02 and 1:15 the picture averages 42/255 luma against 64.5 for the whole trailer. The same ten seconds (1:10–1:20) are also the quietest of the audio.',src:'MEASURED: mean luma per 1-fps frame; EBU R128 per 10 s window (−20.6 LUFS, quietest). Frame 1:08 (25/255).'},
 {n:'04-giant-murk',img:'g_70.png',eye:'// THE BIG CREATURE SHOT',h:'The giant is <b>hidden in the dark</b>',
  mk:()=>{const[x,y]=P(920,330);return circ(x,y,200)+`<div class="lab" style="left:60px;top:40px">1:10 · LUMA 26 / 255</div>`},
  stat:'26',unit:'of 255',t:'This frame is darker than 136 of the other 155 frames I sampled. My read: low-key light is a smart way to sell a huge CG body while the effects are still being finished, which the producer has said they are.',src:'MEASURED: frame luma rank (20th darkest of 156). OPINION: reading of intent. Producer quote via Onmanorama / Outlook India, July 2026.'},
 {n:'05-ten-seconds-of-logos',img:'g_9.png',eye:'// BEFORE THE STORY STARTS',h:'Four logos, then <b>one</b> story shot',
  mk:()=>{const[x,y]=P(640,360);return rect(x-250,y-170,500,330)+`<div class="lab" style="left:60px;top:40px">0:09 · STUDIO MARKS</div>`},
  stat:'~10 s',unit:'of cards',t:'The first story shot with nothing over it lands at about 0:11. Around 15% of the 2:36 runtime is cards, logos and the end poster.',src:'MEASURED: frame-by-frame review of the uploaded file (1280×720, 156.6 s). The percentage is approximate.'},
 {n:'06-who-is-credited',img:'end.png',eye:'// THE END POSTER',h:'Billed: a director, a producer, <b>two other films</b>',
  mk:()=>{return rect(140,8,420,64)+rect(225,368,295,50)+`<div class="lab" style="left:600px;top:30px">NO CAST NAMES</div>`},
  stat:'0',unit:'actor names',tm:'The poster sells the story, not a star.',t:'The poster credits Namit Malhotra and Nitesh Tiwari, and sells the film on "The Odyssey and Dune". No actor\'s name appears on any card in the trailer that I could find.',src:'CHECKED: 1-fps frames of the whole file plus the full-size end poster. Tiny print could hide a name; I did not find one.'},
 {n:'07-ram-calm',img:'g_63.png',eye:'// ONE FRAME THAT WORKS',h:'The practical-looking <b>close-up</b> lands best',
  mk:()=>{const[x,y]=P(782,215);return circ(x,y,100)+`<div class="lab" style="left:60px;top:40px">1:03 · REAL FACE, REAL LIGHT</div>`},
  stat:'1:03',unit:'Ram, close-up',t:'A turn to camera, a bow, wet-looking forest: texture the wide CG shots do not give. My read: more of this would help.',src:'OPINION (labelled). Frame at 1:03 of the uploaded trailer.'},
];
const MOCK=process.env.MOCK==='1';
const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920}});
for(const c of cards.filter(c=>!MOCK||['01-ravana-first','03-ram-dark','06-who-is-credited'].includes(c.n))){
 const html=`<meta charset=utf-8><style>${css}</style><body class="${MOCK?'mock':''}">${MOCK?`<div class="av"><img src="${pathToFileURL(path.resolve('../../../prototypes/reel-app/public/profile.jpg'))}"></div>`:''}<div class="perf" style="top:40px"></div><div class="perf" style="bottom:40px"></div><div class="eye">${c.eye}</div><div class="tag">TRAILER REVIEW</div><div class="h">${c.h}</div>
 <div class="fr"><img src="${pathToFileURL(path.resolve('frames/'+c.img))}"><svg viewBox="0 0 1080 608">${c.mk()}</svg>${(c.mk().match(/<div[\s\S]*$/)||[''])[0]}</div>
 <div class="stat">${c.stat}<small>${c.unit}</small></div><div class="t">${MOCK&&c.tm?c.tm:c.t}</div><div class="src">${c.src}</div>`.replace(/(<svg[^>]*>)([\s\S]*?)<div[\s\S]*?<\/div>(<\/svg>)/,'$1$2$3');
 const od=MOCK?'mockup/':'out/';fs.mkdirSync(od,{recursive:true});fs.writeFileSync(od+c.n+'.html',html);
 await pg.goto(pathToFileURL(path.resolve(od+c.n+'.html')).href); await pg.evaluate(()=>document.fonts.ready); await pg.waitForTimeout(300);
 await pg.screenshot({path:od+c.n+'.png'});
}
await b.close();
