// Generates site/index.html (+ timing.js) for reel #01 "You've never heard YOU" (v3: less text, more polish, cloned voice).
// Run: bun build.mjs   then: bun ../../scripts/render.mjs site out.mp4
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { peep } from '../../assets/illustrations/open-peeps/compose.mjs';
const R = new URL('../../', import.meta.url).pathname, HERE = new URL('./', import.meta.url).pathname, S = HERE + 'site/';
for (const d of ['fonts', 'media', 'shots', 'depth', 'ear']) mkdirSync(S + d, { recursive: true });
const cp = (a, b) => copyFileSync(a, b);
for (const f of ['familjen-grotesk/familjen-grotesk-latin-700-normal', 'familjen-grotesk/familjen-grotesk-latin-600-normal', 'fragment-mono/fragment-mono-latin-400-normal', 'inter/inter-latin-700-normal', 'inter/inter-latin-600-normal']) cp(`${R}assets/fonts/${f}.woff2`, S + 'fonts/' + f.split('/')[1] + '.woff2');
cp(R + 'assets/animations/rough/rough.min.js', S + 'rough.min.js');
cp(R + 'reel-app/public/profile.jpg', S + 'media/profile.jpg');
for (const f of ['dust-particles', 'film-grain']) cp(`${R}assets/animations/video-overlay/${f}.webm`, S + `media/${f}.webm`);
for (const d of ['shots', 'depth']) if (existsSync(HERE + d)) for (const f of readdirSync(HERE + d)) if (/\.(jpg|png)$/.test(f) && !(d === 'shots' && f.endsWith('.png'))) cp(`${HERE}${d}/${f}`, `${S}${d}/${f}`);
if (existsSync(S + 'ear/ear.json')) writeFileSync(S + 'ear/ear.js', 'window.EAR=' + readFileSync(S + 'ear/ear.json', 'utf8') + ';'); else writeFileSync(S + 'ear/ear.js', 'window.EAR={frames:[]};');
const TM = JSON.parse(readFileSync(HERE + 'timing.json', 'utf8')); writeFileSync(S + 'timing.js', 'window.TM=' + JSON.stringify(TM) + ';');
const ph = (n) => readFileSync(`${R}assets/icons/phosphor/bold/${n}-bold.svg`, 'utf8').replace('<svg ', '<svg class="ic" ');
const wincer = peep({ pose: 'bust/Device', hair: 'MediumShort', face: 'ConcernedFear', stroke: '#ecf1f8', bg: '#12213d' }).replace('<svg ', '<svg class="peep" ');
const hater = peep({ pose: 'bust/Whatever', hair: 'Pomp', face: 'Contempt', stroke: '#ecf1f8', bg: '#12213d' }).replace('<svg ', '<svg class="peep" ');

const ff = (fam, w, f) => `@font-face{font-family:'${fam}';font-weight:${w};src:url('fonts/${f}.woff2');font-display:block}`;
const css = `${ff('Fam', 700, 'familjen-grotesk-latin-700-normal')}${ff('Fam', 600, 'familjen-grotesk-latin-600-normal')}${ff('Frag', 400, 'fragment-mono-latin-400-normal')}${ff('InterX', 700, 'inter-latin-700-normal')}${ff('InterX', 600, 'inter-latin-600-normal')}
:root{--ink:#070d1a;--cy:#5ce6ff;--co:#ff5a4d;--li:#bfff45;--am:#ffbd3a;--tx:#ecf1f8}
*{box-sizing:border-box}html,body{margin:0;background:#000;overflow:hidden}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:#070d1a;font-family:InterX;color:var(--tx)}
#gl{position:absolute;left:0;top:0;width:1080px;height:1920px}
.abs{position:absolute;left:0;top:0}
.scene{position:absolute;left:0;top:0;width:1080px;height:1920px;will-change:transform,opacity;display:none}
.scrim{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none}
#aitag{position:absolute;left:150px;top:148px;font:400 15px/1 Frag;letter-spacing:.12em;color:rgba(236,241,248,.78);border:1.5px solid rgba(236,241,248,.34);border-radius:8px;padding:6px 9px;background:rgba(6,11,22,.55)}
#cap{position:absolute;left:150px;top:1346px;width:768px;height:132px;display:flex;align-items:center;justify-content:center;pointer-events:none}
#cap .cc{display:none;white-space:nowrap;padding:12px 32px 16px;border-radius:26px;background:rgba(5,9,18,.84);border:1.5px solid rgba(236,241,248,.16);backdrop-filter:blur(14px);font:700 64px/1.1 Fam;letter-spacing:-.02em;box-shadow:0 18px 50px rgba(0,0,0,.5);text-shadow:0 3px 14px rgba(0,0,0,.55)}
#cap .k-cy{color:var(--cy)}#cap .k-co{color:var(--co)}#cap .k-li{color:var(--li)}#cap .k-am{color:var(--am)}
.hl{position:absolute;left:150px;top:262px;margin:0;width:768px;font:700 124px/.98 Fam;letter-spacing:-.04em;text-shadow:0 6px 26px rgba(0,0,0,.65)}
.hl .w{display:inline-block;will-change:transform,opacity}
.blk{display:inline-block;padding:0 .14em;border-radius:.1em;color:var(--ink);background:var(--co);text-shadow:none;box-shadow:0 0 40px rgba(255,90,77,.45)}
.coralt{color:var(--co);text-shadow:0 0 30px rgba(255,90,77,.45),0 6px 26px rgba(0,0,0,.6)}
.glass{background:linear-gradient(160deg,rgba(30,48,84,.74),rgba(8,14,28,.84));border:1.5px solid rgba(150,210,255,.3);border-radius:30px;backdrop-filter:blur(18px);box-shadow:0 34px 90px rgba(0,0,0,.6),inset 0 1.5px 0 rgba(255,255,255,.16),inset 0 -30px 60px rgba(0,0,0,.25)}
.big{position:absolute;font:700 196px/.9 Fam;letter-spacing:-.05em;white-space:nowrap;will-change:transform,opacity}
.big.cy{color:var(--cy);text-shadow:0 0 50px rgba(92,230,255,.5),0 8px 30px rgba(0,0,0,.6)}.big.co{color:var(--co);text-shadow:0 0 50px rgba(255,90,77,.5),0 8px 30px rgba(0,0,0,.6)}
.ic{fill:currentColor;width:30px;height:30px;display:block}.ic .ic{width:100%;height:100%}
.round{position:absolute;border-radius:50%;display:grid;place-items:center}
.phone{position:absolute;width:206px;height:250px;border-radius:36px;background:linear-gradient(160deg,#16213f,#0a1226);border:3px solid #3a4d78;box-shadow:0 26px 60px rgba(0,0,0,.6),0 0 46px rgba(92,230,255,.2),inset 0 0 0 2px rgba(255,255,255,.05)}
.phone .pn{position:absolute;left:68px;top:12px;width:70px;height:16px;border-radius:9px;background:#050a14}
.vn{position:absolute;left:14px;right:14px;top:56px;background:linear-gradient(160deg,#1a2a52,#12203f);border:1.5px solid rgba(92,230,255,.45);border-radius:18px;padding:12px}
.vn .top{display:flex;justify-content:space-between;font:400 13px Frag;letter-spacing:.06em;color:rgba(236,241,248,.74);margin-bottom:10px}
.vn .row{display:flex;gap:10px;align-items:center}.vn b{width:40px;height:40px;border-radius:50%;background:var(--cy);color:var(--ink);display:grid;place-items:center;flex:none}.vn b .ic{width:20px;height:20px}
.bars{display:flex;gap:3px;align-items:center;height:44px;width:112px;overflow:hidden}.bars i{display:block;width:4px;border-radius:2px;background:var(--cy);flex:none}
.peepcard{position:absolute;overflow:hidden;border-radius:30px}.peepcard .peep{position:absolute;left:-26px;top:-4px;width:270px;height:auto}#peep8 .peep{left:-24px;top:44px;width:700px}
.lens{position:absolute;left:0;top:0;width:1080px;height:1920px}.lens img{position:absolute;transform-origin:0 0}
.vp{position:absolute;border-radius:50%;overflow:hidden;background:radial-gradient(circle,#0c1c34,#060c18)}
.lab{position:absolute;display:flex;gap:12px;align-items:center;font:700 40px/1 Fam;letter-spacing:-.01em}.lab .ic{width:46px;height:46px}.lab.c{color:var(--cy)}.lab.o{color:var(--co)}
.panel{position:absolute;left:150px;top:596px;width:768px;height:640px}
.arrowcard{position:absolute;left:150px;width:768px;height:226px;border-radius:32px;display:flex;align-items:center;gap:30px;padding:0 44px;font:700 118px/1 Fam;letter-spacing:-.04em}
.hand{position:absolute;width:110px;color:var(--li);filter:drop-shadow(0 4px 12px rgba(0,0,0,.7)) drop-shadow(0 0 16px rgba(191,255,69,.45))}.hand .ic{width:110px;height:110px}
.pill{display:inline-flex;gap:14px;align-items:center;font:700 44px/1 Fam;letter-spacing:-.01em;border-radius:999px;padding:18px 34px 18px 26px;white-space:nowrap;transform-origin:left center}.pill .ic{width:46px;height:46px}
.pill.li{color:var(--ink);background:var(--li);box-shadow:0 0 50px rgba(191,255,69,.45),0 10px 30px rgba(0,0,0,.4)}.pill.am{color:var(--ink);background:var(--am);box-shadow:0 0 46px rgba(255,189,58,.45),0 10px 30px rgba(0,0,0,.4)}
.fol{display:inline-flex;gap:18px;align-items:center;font:700 66px/1 Fam;letter-spacing:-.01em;color:var(--ink);background:var(--li);border-radius:999px;padding:28px 56px 28px 40px;box-shadow:0 0 70px rgba(191,255,69,.5),0 14px 36px rgba(0,0,0,.45)}.fol .ic{width:62px;height:62px}
#dust,#grain{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;pointer-events:none}
#dust{mix-blend-mode:screen;opacity:.45}#grain{mix-blend-mode:multiply;opacity:.16}
#vig{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none;background:radial-gradient(ellipse 80% 70% at 50% 46%,transparent 40%,rgba(2,5,12,.62) 100%)}
#flash{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none;background:#bff3ff;opacity:0;mix-blend-mode:screen}
`;
const words = (txt) => txt.split(' ').map((w) => (w.startsWith('{') ? `<span class="w ${w.slice(1, w.indexOf('}'))}">${w.slice(w.indexOf('}') + 1)}</span>` : `<span class="w">${w}</span>`)).join(' ');
const H = (id, txt, cls = '') => `<h1 class="hl ${cls}" id="${id}">${words(txt)}</h1>`;
const earimgs = (k) => Array.from({ length: 16 }, (_, i) => `<img class="ef${k}" src="ear/ear_${String(i).padStart(2, '0')}.png" style="position:absolute;left:0;top:0;opacity:0">`).join('');
const html = `<!doctype html><meta charset="utf-8"><title>reel 01</title><style>${css}</style>
<div id="stage"><canvas id="gl" width="1080" height="1920"></canvas>
<div class="scrim" id="scrim" style="background:linear-gradient(180deg,rgba(5,9,18,.88) 0,rgba(5,9,18,.55) 24%,rgba(5,9,18,0) 36%,rgba(5,9,18,0) 70%,rgba(5,9,18,.7) 100%)"></div>

<section class="scene" id="s1">${H('h1', "You've never heard {blk}YOU")}
<div class="lens" id="lens1"><img id="xr1" src="shots/xray_skull.jpg"><svg class="abs" id="lsvg1" width="1080" height="1920"></svg></div>
<svg class="abs" id="lrim1" width="1080" height="1920"></svg><svg class="abs" id="waves1" width="1080" height="1920"></svg>
<div class="phone glass" id="phone1" style="left:696px;top:1008px"><div class="pn"></div><div class="vn"><div class="top"><span>Voice note</span><span>0:07</span></div><div class="row"><b>${ph('play')}</b><div class="bars" id="pbars1"></div></div></div></div>
<div class="peepcard glass" id="peep1" style="left:150px;top:1012px;width:216px;height:236px">${wincer}</div></section>

<section class="scene" id="s2">
<div class="vp" id="vp2"><div id="ew2" style="position:absolute;left:0;top:0">${earimgs(2)}</div></div><svg class="abs" id="rt2" width="1080" height="1920"></svg><svg class="abs" id="rim2" width="1080" height="1920"></svg>
<div class="big cy" id="bw2a" style="left:150px;top:196px">AIR</div><div class="big co" id="bw2b" style="left:470px;top:1086px">BONE</div></section>

<section class="scene" id="s3">
<div class="vp" id="vp3"><div id="ew3" style="position:absolute;left:0;top:0">${earimgs(3)}</div></div><svg class="abs" id="rt3" width="1080" height="1920"></svg><svg class="abs" id="rim3" width="1080" height="1920"></svg><svg class="abs" id="crowd" width="1080" height="1920"></svg></section>

<section class="scene" id="s4">
<svg class="abs" id="waves4" width="1080" height="1920"></svg>
<div class="phone glass" id="phone4" style="left:600px;top:985px;width:318px;height:272px"><div class="pn" style="left:124px;width:70px"></div>
<div class="vn" style="top:56px;left:18px;right:18px;padding:14px"><div class="row"><b style="width:60px;height:60px">${ph('microphone')}</b><div class="bars" id="pbars4" style="width:176px;height:60px"></div></div></div></div>
<svg class="abs" id="snap4" width="1080" height="1920"></svg></section>

<section class="scene" id="s5">
<div class="arrowcard glass" id="acU" style="top:430px;color:var(--cy)"><span class="ic" style="width:118px;height:118px">${ph('arrow-up')}</span>HIGHER</div>
<div class="arrowcard glass" id="acD" style="top:960px;color:var(--co)"><span class="ic" style="width:118px;height:118px">${ph('arrow-down')}</span>LOWER</div>
<svg class="abs" id="guess5" width="1080" height="1920"></svg></section>

<section class="scene" id="s6">
<div class="big" id="y2025" style="left:150px;top:224px;font-size:250px;color:var(--tx);text-shadow:0 8px 34px rgba(0,0,0,.6)">2025</div>
<div class="round glass" id="flask6" style="left:722px;top:262px;width:196px;height:196px;color:var(--co)"><span class="ic" style="width:104px;height:104px">${ph('flask')}</span></div>
<div class="panel glass" id="panel"></div><svg class="abs" id="poll" width="1080" height="1920"></svg>
<div class="lab c" id="labA" style="left:300px;top:636px"><span class="ic">${ph('book-open')}</span>THEORY</div>
<div class="lab o" id="labB" style="left:600px;top:636px"><span class="ic">${ph('flask')}</span>STUDY</div>
<svg class="abs" id="rough6" width="1080" height="1920"></svg>
<div style="position:absolute;left:150px;top:1252px;width:768px;display:flex;justify-content:center"><span class="pill am" id="amber"><span class="ic">${ph('warning')}</span>SCIENTISTS DISAGREE</span></div></section>

<section class="scene" id="s8">
<div class="peepcard glass" id="peep8" style="left:330px;top:440px;width:588px;height:660px">${hater}</div>
<div class="phone glass" id="bub8" style="left:150px;top:560px;width:300px;height:120px;border-radius:26px"><div class="vn" style="left:10px;right:10px;top:12px;padding:10px"><div class="row"><b>${ph('play')}</b><div class="bars" id="pbars8" style="width:150px"></div><span style="font:400 14px Frag;color:#5ce6ff">0:07</span></div></div></div>
<svg class="abs" id="rough8" width="1080" height="1920"></svg>
<svg class="abs" id="fly8" width="1080" height="1920"></svg>
<div class="round" id="send8" style="left:150px;top:1010px;width:150px;height:150px;background:var(--li);color:var(--ink);box-shadow:0 0 60px rgba(191,255,69,.5),0 14px 34px rgba(0,0,0,.45)"><span class="ic" style="width:78px;height:78px">${ph('paper-plane-tilt')}</span></div></section>

<section class="scene" id="s9"><h1 class="hl" id="h11" style="top:190px;font-size:108px"><span class="w">Only</span> <span class="w coralt">you</span><br><span class="w">hear</span> <span class="w">it.</span></h1>
<div class="lens" id="lens9"><img id="xr9" src="shots/xray_skull.jpg"><svg class="abs" id="lsvg9" width="1080" height="1920"></svg></div>
<svg class="abs" id="lrim9" width="1080" height="1920"></svg>
<div class="round glass" id="spk9" style="left:722px;top:1010px;width:150px;height:150px;color:var(--cy)"><span class="ic" style="width:80px;height:80px">${ph('speaker-x')}</span></div>
<div class="hand" id="hand9">${ph('hand-palm')}</div>
<div style="position:absolute;left:150px;top:1180px"><span class="pill li" id="tryit"><span class="ic">${ph('ear')}</span>TRY IT</span></div></section>

<section class="scene" id="s12">
<svg class="abs" id="endsvg" width="1080" height="1920"></svg>
<div style="position:absolute;left:150px;top:340px;width:768px;text-align:center;font:400 22px/1 Frag;letter-spacing:.16em;color:var(--cy)" id="brand12">WHAT'S ACTUALLY HAPPENING</div>
<div id="av12" style="position:absolute;left:380px;top:420px;width:320px;height:320px;border-radius:50%;background:url(media/profile.jpg) center/cover;border:6px solid var(--li);box-shadow:0 0 0 10px rgba(191,255,69,.18),0 0 70px rgba(191,255,69,.4),0 24px 60px rgba(0,0,0,.6)"></div>
<div id="hd12" style="position:absolute;left:150px;top:790px;width:768px;text-align:center;font:700 74px/1 Fam;letter-spacing:-.03em;text-shadow:0 6px 26px rgba(0,0,0,.6)">@sandesh.explains</div>
<div id="fol12" style="position:absolute;left:150px;top:930px;width:768px;display:flex;justify-content:center"><span class="fol"><span class="ic">${ph('plus-circle')}</span>FOLLOW</span></div>
<div class="glass" id="next12" style="position:absolute;left:150px;top:1140px;width:768px;padding:26px 34px;overflow:hidden"><div style="font:400 20px/1 Frag;letter-spacing:.16em;color:rgba(236,241,248,.72)">NEXT</div><div style="font:700 56px/1.04 Fam;letter-spacing:-.03em;margin-top:12px"><span class="coralt" id="n4m">4 million</span> new cells a second</div><div id="sweep12" style="position:absolute;top:0;bottom:0;width:140px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.16),transparent);transform:skewX(-14deg)"></div></div></section>

<video id="dust" src="media/dust-particles.webm" muted playsinline preload="auto"></video><video id="grain" src="media/film-grain.webm" muted playsinline preload="auto"></video>
<div id="vig"></div>
<div id="aitag">AI IMAGE</div><div id="cap"></div>
<div id="flash"></div></div>
<script src="rough.min.js"></script><script src="gl2.js"></script><script src="anchors.js"></script><script src="timing.js"></script><script src="ear/ear.js"></script><script src="main3.js"></script>`;
writeFileSync(S + 'index.html', html);
console.log('site/index.html written', html.length);
