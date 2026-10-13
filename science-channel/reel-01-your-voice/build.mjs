// Generates site/index.html (+ timing.js) for reel #01 "You've never heard YOU" (full build, 30 s).
// Run: bun build.mjs   then: bun ../../scripts/render.mjs site out.mp4
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { peep } from '../../assets/illustrations/open-peeps/compose.mjs';
const R = new URL('../../', import.meta.url).pathname, HERE = new URL('./', import.meta.url).pathname, S = HERE + 'site/';
for (const d of ['fonts', 'media', 'shots', 'depth', 'ear']) mkdirSync(S + d, { recursive: true });
const cp = (a, b) => copyFileSync(a, b);
for (const f of ['familjen-grotesk/familjen-grotesk-latin-700-normal', 'familjen-grotesk/familjen-grotesk-latin-600-normal', 'fragment-mono/fragment-mono-latin-400-normal', 'inter/inter-latin-700-normal', 'inter/inter-latin-600-normal']) cp(`${R}assets/fonts/${f}.woff2`, S + 'fonts/' + f.split('/')[1] + '.woff2');
cp(R + 'assets/animations/rough/rough.min.js', S + 'rough.min.js');
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
#badge{position:absolute;left:150px;top:150px;display:flex;gap:12px;align-items:center;font:400 21px/1 Frag;letter-spacing:.13em;border:1.5px solid rgba(236,241,248,.3);border-radius:999px;padding:11px 20px 11px 16px;background:rgba(6,11,22,.62);backdrop-filter:blur(10px)}
#badge i{width:12px;height:12px;border-radius:50%;background:var(--cy);box-shadow:0 0 14px var(--cy)}
#trk{position:absolute;left:728px;top:150px;display:flex;gap:8px}
#trk b{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font:600 19px Fam;color:rgba(236,241,248,.35);border:1.5px solid rgba(236,241,248,.2);background:rgba(6,11,22,.55)}
#trk b.on{color:var(--ink)}#trk b.c1.on{background:var(--cy);border-color:var(--cy)}#trk b.c2.on{background:var(--co);border-color:var(--co)}#trk b.c3.on{background:var(--am);border-color:var(--am)}#trk b.c4.on{background:var(--li);border-color:var(--li)}
#eyebrow{position:absolute;left:150px;top:214px;font:400 25px/1 Frag;letter-spacing:.12em;color:var(--cy);text-shadow:0 0 18px rgba(92,230,255,.5);white-space:nowrap}
#aitag{position:absolute;left:776px;top:210px;font:400 16px/1 Frag;letter-spacing:.12em;color:rgba(236,241,248,.8);border:1.5px solid rgba(236,241,248,.4);border-radius:8px;padding:7px 10px;background:rgba(6,11,22,.6)}
#rule{position:absolute;left:150px;top:1496px;width:768px;border-top:3px dashed rgba(92,230,255,.55)}
#src{position:absolute;left:150px;top:1506px;width:768px;font:400 15.5px/1.2 Frag;letter-spacing:.08em;color:rgba(236,241,248,.66)}
#cap.long{font-size:36px}#cap{position:absolute;left:150px;top:1356px;width:768px;min-height:122px;border-radius:26px;background:rgba(5,9,18,.88);border:1.5px solid rgba(236,241,248,.16);backdrop-filter:blur(14px);padding:20px 24px;text-align:center;font:700 40px/1.3 InterX;box-shadow:0 18px 50px rgba(0,0,0,.45)}
#cap .cw{padding:1px 8px;border-radius:8px;display:inline-block}#cap .cw.on{background:var(--tx);color:var(--ink)}
.hl{position:absolute;left:150px;top:262px;margin:0;width:768px;font:700 120px/1 Fam;letter-spacing:-.035em;text-shadow:0 6px 26px rgba(0,0,0,.65)}
.hl.m{font-size:104px}
.hl .w{display:inline-block;will-change:transform,opacity}
.blk{display:inline-block;padding:0 .14em;border-radius:.1em;color:var(--ink);background:var(--co);text-shadow:none;box-shadow:0 0 40px rgba(255,90,77,.45)}
.coralt{color:var(--co);text-shadow:0 0 30px rgba(255,90,77,.45),0 6px 26px rgba(0,0,0,.6)}
.glass{background:linear-gradient(160deg,rgba(26,42,74,.72),rgba(8,14,28,.82));border:1.5px solid rgba(120,200,255,.28);border-radius:28px;backdrop-filter:blur(18px);box-shadow:0 30px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.12)}
.chips{position:absolute;left:150px;top:1262px;display:flex;gap:12px;white-space:nowrap}
.chip{transform-origin:left center;display:inline-flex;gap:11px;align-items:center;font:400 19px/1 Frag;letter-spacing:.08em;border-radius:999px;padding:12px 17px;border:2px solid;background:rgba(6,11,22,.72);backdrop-filter:blur(8px)}
.chip i{width:13px;height:13px;border-radius:50%}.chip .ic{width:25px;height:25px}
.chip.cy{color:var(--cy);border-color:var(--cy)}.chip.cy i{background:var(--cy)}.chip.co{color:var(--co);border-color:var(--co)}.chip.co i{background:var(--co)}
.chip.am{color:var(--ink);background:var(--am);border-color:var(--am);box-shadow:0 0 34px rgba(255,189,58,.4)}.chip.li{color:var(--ink);background:var(--li);border-color:var(--li);box-shadow:0 0 34px rgba(191,255,69,.4)}.chip.dim{color:rgba(236,241,248,.78);border-color:rgba(236,241,248,.32)}
.ic{fill:currentColor;width:30px;height:30px;display:block}
.tag{position:absolute;font:400 18px/1.5 Frag;letter-spacing:.12em;white-space:nowrap;background:rgba(6,11,22,.78);border-radius:10px;padding:6px 12px}
.phone{position:absolute;width:206px;height:250px;border-radius:36px;background:linear-gradient(160deg,#16213f,#0a1226);border:3px solid #3a4d78;box-shadow:0 26px 60px rgba(0,0,0,.6),0 0 46px rgba(92,230,255,.2),inset 0 0 0 2px rgba(255,255,255,.05)}
.phone .pn{position:absolute;left:68px;top:12px;width:70px;height:16px;border-radius:9px;background:#050a14}
.vn{position:absolute;left:14px;right:14px;top:56px;background:linear-gradient(160deg,#1a2a52,#12203f);border:1.5px solid rgba(92,230,255,.45);border-radius:18px;padding:12px}
.vn .top{display:flex;justify-content:space-between;font:400 13px Frag;letter-spacing:.06em;color:rgba(236,241,248,.74);margin-bottom:10px}
.vn .row{display:flex;gap:10px;align-items:center}.vn b{width:40px;height:40px;border-radius:50%;background:var(--cy);color:var(--ink);display:grid;place-items:center;flex:none}.vn b .ic{width:20px;height:20px}
.bars{display:flex;gap:3px;align-items:center;height:44px;width:112px;overflow:hidden}.bars i{display:block;width:4px;border-radius:2px;background:var(--cy);flex:none}
.rec{margin-top:12px;font:400 12.5px Frag;letter-spacing:.14em;color:var(--cy)}
.peepcard{position:absolute;overflow:hidden;border-radius:26px}.peepcard .peep{position:absolute;left:-26px;top:-4px;width:270px;height:auto}#peep8 .peep{left:-20px;top:-10px;width:640px}
.ugh{position:absolute;font:600 24px/1 Fam;border:2px solid var(--cy);border-radius:999px;padding:7px 14px;background:rgba(6,11,22,.86)}
.lens{position:absolute;left:0;top:0;width:1080px;height:1920px}.lens img{position:absolute;transform-origin:0 0}
.vp{position:absolute;border-radius:50%;overflow:hidden;background:radial-gradient(circle,#0c1c34,#060c18)}
.panel{position:absolute;left:150px;top:596px;width:768px;height:636px}
.lab{position:absolute;display:grid;gap:5px}.lab .k{font:400 17px Frag;letter-spacing:.14em;color:rgba(236,241,248,.82)}.lab .v{font:700 34px/1.05 Fam;letter-spacing:-.02em}.lab .v.co{color:var(--co)}
.lab .ico .ic{width:34px;height:34px}.lab .ico.c{color:var(--cy)}.lab .ico.o{color:var(--co)}
.hand{position:absolute;width:96px;color:var(--li);filter:drop-shadow(0 4px 12px rgba(0,0,0,.7)) drop-shadow(0 0 16px rgba(191,255,69,.45))}.hand .ic{width:96px;height:96px}
.arrowcard{position:absolute;left:150px;width:768px;height:226px;border-radius:30px;display:flex;align-items:center;gap:30px;padding:0 44px;font:700 112px/1 Fam;letter-spacing:-.04em}
.fol{display:inline-flex;gap:16px;align-items:center;font:700 54px/1 Fam;letter-spacing:-.01em;color:var(--ink);background:var(--li);border-radius:999px;padding:24px 46px 24px 34px;box-shadow:0 0 60px rgba(191,255,69,.45)}.fol .ic{width:52px;height:52px}
#dust,#grain{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;pointer-events:none}
#dust{mix-blend-mode:screen;opacity:.5}#grain{mix-blend-mode:multiply;opacity:.2}
#vig{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none;background:radial-gradient(ellipse 80% 70% at 50% 46%,transparent 40%,rgba(2,5,12,.62) 100%)}
#flash{position:absolute;left:0;top:0;width:1080px;height:1920px;pointer-events:none;background:#bff3ff;opacity:0;mix-blend-mode:screen}
`;
const words = (txt) => txt.split(' ').map((w) => (w.startsWith('{') ? `<span class="w ${w.slice(1, w.indexOf('}'))}">${w.slice(w.indexOf('}') + 1)}</span>` : `<span class="w">${w}</span>`)).join(' ');
const H = (id, txt, cls = '') => `<h1 class="hl ${cls}" id="${id}">${words(txt)}</h1>`;
const legend = '<span class="chip cy"><i></i>AIR ROUTE</span><span class="chip co"><i></i>BONE ROUTE</span>';
const earimgs = (k) => Array.from({ length: 16 }, (_, i) => `<img class="ef${k}" src="ear/ear_${String(i).padStart(2, '0')}.png" style="position:absolute;left:0;top:0;opacity:0">`).join('');
const html = `<!doctype html><meta charset="utf-8"><title>reel 01</title><style>${css}</style>
<div id="stage"><canvas id="gl" width="1080" height="1920"></canvas>
<div class="scrim" id="scrim" style="background:linear-gradient(180deg,rgba(5,9,18,.88) 0,rgba(5,9,18,.55) 24%,rgba(5,9,18,0) 36%,rgba(5,9,18,0) 70%,rgba(5,9,18,.7) 100%)"></div>

<section class="scene" id="s1">${H('h1', "You've never heard {blk}YOU")}
<div class="lens" id="lens1"><img id="xr1" src="shots/xray_skull.jpg"><svg class="abs" id="lsvg1" width="1080" height="1920"></svg></div>
<svg class="abs" id="lrim1" width="1080" height="1920"></svg><svg class="abs" id="waves1" width="1080" height="1920"></svg>
<div class="tag" id="bonetag" style="color:var(--co)">BONE ROUTE · INSIDE THE SKULL</div>
<div class="phone glass" id="phone1" style="left:696px;top:1008px"><div class="pn"></div><div class="vn"><div class="top"><span>Voice note</span><span>0:07</span></div><div class="row"><b>${ph('play')}</b><div class="bars" id="pbars1"></div></div><div class="rec">YOUR RECORDING</div></div></div>
<div class="peepcard glass" id="peep1" style="left:150px;top:1012px;width:216px;height:236px">${wincer}</div><div class="ugh" id="ugh1" style="left:316px;top:972px">ugh</div>
<div class="chips" id="chips1">${legend}</div></section>

<section class="scene" id="s2">${H('h2', 'Air. And {coralt}bone.', 'm')}
<div class="vp" id="vp2"><div id="ew2" style="position:absolute;left:0;top:0">${earimgs(2)}</div></div><svg class="abs" id="rt2" width="1080" height="1920"></svg>
<div class="tag" id="airtag2" style="color:var(--cy)">AIR · THROUGH THE EAR CANAL</div><div class="tag" id="bonetag2" style="color:var(--co)">BONE · THROUGH THE SKULL</div>
<div class="chips" id="chips2">${legend}</div></section>

<section class="scene" id="s3">${H('h3', 'Only you get the {coralt}bone.', 'm')}
<div class="vp" id="vp3"><div id="ew3" style="position:absolute;left:0;top:0">${earimgs(3)}</div></div><svg class="abs" id="rt3" width="1080" height="1920"></svg><svg class="abs" id="crowd" width="1080" height="1920"></svg>
<div class="tag" id="crowdtag" style="color:var(--cy)">EVERYONE ELSE · AIR ONLY</div>
<div class="chips" id="chips3">${legend}</div></section>

<section class="scene" id="s4">${H('h4', 'A recording misses {coralt}bone.', 'm')}
<svg class="abs" id="waves4" width="1080" height="1920"></svg>
<div class="phone glass" id="phone4" style="left:600px;top:985px;width:318px;height:272px"><div class="pn" style="left:124px;width:70px"></div>
<div class="vn" style="top:56px;left:18px;right:18px;padding:14px"><div class="top" style="font-size:15px"><span>Voice note</span><span>0:07</span></div><div class="row"><b style="width:54px;height:54px">${ph('microphone')}</b><div class="bars" id="pbars4" style="width:170px;height:54px"></div></div><div class="rec" style="font-size:13px">AIR ONLY · NO BONE ROUTE</div></div></div>
<svg class="abs" id="snap4" width="1080" height="1920"></svg>
<div class="tag" id="snaptag" style="color:var(--co)">NO BONE ROUTE IN A RECORDING</div>
<div class="chips" id="chips4">${legend}</div></section>

<section class="scene" id="s5">${H('h5', 'Higher or {coralt}lower?')}
<div class="arrowcard glass" id="acU" style="top:600px;color:var(--cy)"><span class="ic" style="width:112px;height:112px">${ph('arrow-up')}</span>HIGHER</div>
<div class="arrowcard glass" id="acD" style="top:858px;color:var(--co)"><span class="ic" style="width:112px;height:112px">${ph('arrow-down')}</span>LOWER</div>
<svg class="abs" id="guess5" width="1080" height="1920"></svg>
<div class="chips" id="chips5"><span class="chip dim">GUESS BEFORE YOU SCROLL</span></div></section>

<section class="scene" id="s6">${H('h6', 'Theory vs. {coralt}study', 'm')}
<div class="panel glass" id="panel"></div><svg class="abs" id="poll" width="1080" height="1920"></svg>
<div class="lab" id="labA" style="left:300px;top:626px;width:230px"><div class="ico c">${ph('book-open')}</div><span class="k">THEORY</span><b class="v">HIGHER ↑</b></div>
<div class="lab" id="labB" style="left:622px;top:626px;width:280px"><div class="ico o">${ph('flask')}</div><span class="k">2025 STUDY</span><b class="v co">MOST SAID<br>LOWER ↓</b></div>
<div id="thumb" style="position:absolute;left:262px;top:978px;width:190px;height:190px;border-radius:50%;border:3px solid #5ce6ff;box-shadow:0 0 30px rgba(92,230,255,.35);background:url(shots/head_a.jpg) -87px -113px/300px auto"></div><div class="tag" id="thumbl" style="left:236px;top:1180px;color:rgba(236,241,248,.8);background:none;padding:0">YOU, PLAYING IT BACK</div>
<svg class="abs" id="rough6" width="1080" height="1920"></svg>
<div class="chips" id="chips6"><span class="chip am" id="amber"><span class="ic">${ph('warning')}</span>SCIENTISTS DISAGREE</span><span class="chip dim">DIRECTION ONLY, NOT SIZE</span></div></section>

<section class="scene" id="s8">${H('h8', 'Who {coralt}hates voice notes?', 'm')}
<div class="peepcard glass" id="peep8" style="left:330px;top:610px;width:588px;height:640px">${hater}</div>
<div class="phone glass" id="bub8" style="left:150px;top:690px;width:300px;height:120px;border-radius:24px"><div class="vn" style="left:10px;right:10px;top:12px;padding:10px"><div class="row"><b>${ph('play')}</b><div class="bars" id="pbars8" style="width:150px"></div><span style="font:400 14px Frag;color:#5ce6ff">0:07</span></div></div></div>
<svg class="abs" id="rough8" width="1080" height="1920"></svg>
<div class="tag" id="seen8" style="left:150px;top:850px;color:rgba(236,241,248,.85)">SEEN · NEVER PLAYED</div>
<div class="chips" id="chips8"><span class="chip cy" id="sendchip"><span class="ic">${ph('paper-plane-tilt')}</span>SEND THIS TO THEM</span></div></section>

<section class="scene" id="s9">${H('h9', 'Plug your {coralt}ears.', 'm')}<h1 class="hl" id="h11"><span class="w">Only</span> <span class="w coralt">you</span><br><span class="w">hear</span> <span class="w">it.</span></h1>
<div class="lens" id="lens9"><img id="xr9" src="shots/xray_skull.jpg"><svg class="abs" id="lsvg9" width="1080" height="1920"></svg></div>
<svg class="abs" id="lrim9" width="1080" height="1920"></svg>
<div class="tag" id="airtag9" style="color:var(--cy);line-height:1.5"><span class="ic" style="width:22px;height:22px;display:inline-block;vertical-align:-4px">${ph('speaker-x')}</span><br>AIR ROUTE<br>BLOCKED</div>
<div class="hand" id="hand9">${ph('hand-palm')}</div>
<div class="chips" id="chips9"><span class="chip li" id="tryit"><span class="ic">${ph('ear')}</span>TRY IT · FINGERS ON EARS, GENTLY</span><span class="chip cy" id="muf"><svg width="48" height="24" viewBox="0 0 52 26"><path d="M0 6h20c12 0 16 4 18 16h14" fill="none" stroke="#5ce6ff" stroke-width="3"/></svg>MUFFLED</span></div>
<div class="chips" id="chips9b" style="left:150px"><span class="chip dim" id="hp"><span class="ic">${ph('headphones')}</span>HEADPHONES HELP</span></div></section>

<section class="scene" id="s12">
<svg class="abs" id="endsvg" width="1080" height="1920"></svg>
<div id="endt" style="position:absolute;left:150px;top:380px;width:768px"><div style="font:400 24px/1 Frag;letter-spacing:.14em;color:var(--cy)">// WHAT'S ACTUALLY HAPPENING</div>
<div style="font:700 118px/.98 Fam;letter-spacing:-.04em;margin-top:26px;text-shadow:0 6px 30px rgba(0,0,0,.6)"><span class="w" id="e1" style="display:inline-block">Inside you,</span><br><span class="w" id="e2" style="display:inline-block">in <span class="coralt">30 seconds.</span></span></div></div>
<div class="glass" id="next12" style="position:absolute;left:150px;top:900px;width:768px;padding:30px 34px"><div style="font:400 20px/1 Frag;letter-spacing:.14em;color:rgba(236,241,248,.7)">NEXT</div><div style="font:700 62px/1.04 Fam;letter-spacing:-.03em;margin-top:14px"><span class="coralt" id="n4m">4 million</span> <span>new cells a second</span></div></div>
<div id="tick12" style="position:absolute;left:150px;top:1282px;width:768px;height:56px;overflow:hidden;border-top:1.5px solid rgba(92,230,255,.4);border-bottom:1.5px solid rgba(92,230,255,.4);-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)"><div id="tickin" style="position:absolute;left:0;top:0;line-height:56px;white-space:nowrap;font:400 22px/56px Frag;letter-spacing:.14em;color:rgba(236,241,248,.85)">COMING UP · #02 4 MILLION NEW CELLS A SECOND · #03 THE 10-TO-1 BACTERIA THING IS WRONG · #04 THIS LIGHT IS ANCIENT · #05 THERE IS A HOLE IN YOUR VISION · COMING UP · #02 4 MILLION NEW CELLS A SECOND · #03 THE 10-TO-1 BACTERIA THING IS WRONG · #04 THIS LIGHT IS ANCIENT ·</div></div>
<div id="fol12" style="position:absolute;left:150px;top:1160px;transform-origin:left center"><span class="fol"><span class="ic">${ph('sparkle')}</span>FOLLOW</span></div></section>

<video id="dust" src="media/dust-particles.webm" muted playsinline preload="auto"></video><video id="grain" src="media/film-grain.webm" muted playsinline preload="auto"></video>
<div id="vig"></div>
<div id="badge"><i></i><span>WHAT'S ACTUALLY HAPPENING · #01</span></div><div id="trk">${[1, 2, 3, 4].map((n) => `<b class="c${n}" id="t${n}">${n}</b>`).join('')}</div>
<div id="eyebrow"></div><div id="aitag">AI IMAGE</div><div id="rule"></div><div id="src"></div><div id="cap"></div>
<div id="flash"></div></div>
<script src="rough.min.js"></script><script src="gl2.js"></script><script src="anchors.js"></script><script src="timing.js"></script><script src="ear/ear.js"></script><script src="main.js"></script>`;
writeFileSync(S + 'index.html', html);
console.log('site/index.html written', html.length);
