// Generates site/index.html (+ timing.js) for reel #02 "Four million. Every second." (cells). Run: bun build.mjs ; then bun ../../scripts/render.mjs site out.mp4
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
const R = new URL('../../', import.meta.url).pathname, HERE = new URL('./', import.meta.url).pathname, S = HERE + 'site/';
for (const d of ['fonts', 'media', 'plates']) mkdirSync(S + d, { recursive: true });
const cp = (a, b) => copyFileSync(a, b);
for (const f of ['familjen-grotesk/familjen-grotesk-latin-700-normal', 'familjen-grotesk/familjen-grotesk-latin-600-normal', 'fragment-mono/fragment-mono-latin-400-normal', 'inter/inter-latin-700-normal']) cp(`${R}assets/fonts/${f}.woff2`, S + 'fonts/' + f.split('/')[1] + '.woff2');
cp(R + 'reel-app/public/profile.jpg', S + 'media/profile.jpg');
for (const f of ['dust-particles', 'film-grain']) cp(`${R}assets/animations/video-overlay/${f}.webm`, S + `media/${f}.webm`);
const TM = JSON.parse(readFileSync(HERE + 'timing.json', 'utf8')); writeFileSync(S + 'timing.js', 'window.TM=' + JSON.stringify(TM) + ';');
const ph = (n) => readFileSync(`${R}assets/icons/phosphor/bold/${n}-bold.svg`, 'utf8').replace('<svg ', '<svg class="ic" ');
// happy Open Doodle, recoloured to the reel's palette (lime accent, light ink) and cropped to the figure
const doodle = readFileSync(`${R}assets/illustrations/open-doodles/GroovyDoodle.svg`, 'utf8').replace(/\{\{accent\}\}/g, '#c6ff4a').replace(/\{\{ink\}\}/g, '#f1ece6').replace(/viewBox="[^"]*"/, 'viewBox="60 40 900 760"').replace('<svg ', '<svg class="dd" preserveAspectRatio="xMidYMid meet" ');
const ff = (fam, w, f) => `@font-face{font-family:'${fam}';font-weight:${w};src:url('fonts/${f}.woff2');font-display:block}`;
const css = `${ff('Fam', 700, 'familjen-grotesk-latin-700-normal')}${ff('Fam', 600, 'familjen-grotesk-latin-600-normal')}${ff('Frag', 400, 'fragment-mono-latin-400-normal')}${ff('InterX', 700, 'inter-latin-700-normal')}
:root{--li:#c6ff4a;--co:#ff4d3d;--am:#ffb43a;--cy:#5ce6ff;--tx:#f1ece6;--ink:#0a0f1a}
*{box-sizing:border-box}html,body{margin:0;background:#000;overflow:hidden}
#stage{position:relative;width:1080px;height:1920px;overflow:hidden;background:#05070d;font-family:InterX;color:var(--tx)}
#gl,#fx{position:absolute;left:0;top:0;width:1080px;height:1920px}#fx{display:none}
.sc{position:absolute;left:0;top:0;width:1080px;height:1920px;display:none;will-change:transform,opacity}
.ic{fill:currentColor;width:30px;height:30px;display:block}.ic .ic{width:100%;height:100%}
#cntwrap{position:absolute;left:150px;width:768px;top:214px;text-align:center;will-change:transform}
#cnt{display:inline-flex;font:400 112px/1 Frag;letter-spacing:-.02em;color:#f4ffd8;text-shadow:0 0 40px rgba(198,255,74,.55),0 6px 30px rgba(0,0,0,.6);height:112px;overflow:hidden}
#cnt .d{display:block;width:.6em;height:112px;overflow:hidden;position:relative}#cnt .d i{display:block;font-style:normal;height:112px;text-align:center}#cnt .sp{display:block;width:.3em}
#cntlab{font:400 24px/1 Frag;letter-spacing:.22em;color:rgba(241,236,230,.85);margin-top:16px;text-shadow:0 2px 14px rgba(0,0,0,.8)}
#cap{position:absolute;left:150px;top:1346px;width:768px;height:132px;display:flex;align-items:center;justify-content:center;pointer-events:none}
#cap div{display:none;white-space:nowrap;padding:12px 32px 16px;border-radius:26px;background:rgba(5,9,18,.8);border:1.5px solid rgba(241,236,230,.14);backdrop-filter:blur(14px);font:700 64px/1.1 Fam;letter-spacing:-.02em;box-shadow:0 18px 50px rgba(0,0,0,.5);text-shadow:0 3px 14px rgba(0,0,0,.55)}
#cap .k-li{color:var(--li)}#cap .k-co{color:#ff6a5a}#cap .k-am{color:var(--am)}#cap .k-cy{color:var(--cy)}
#ill{position:absolute;left:150px;top:148px;font:400 15px/1 Frag;letter-spacing:.12em;color:rgba(241,236,230,.78);border:1.5px solid rgba(241,236,230,.3);border-radius:8px;padding:6px 9px;background:rgba(6,11,22,.5)}
.big{position:absolute;left:150px;width:768px;text-align:center;font:700 150px/.95 Fam;letter-spacing:-.045em;white-space:nowrap;will-change:transform,opacity}
.glass{background:linear-gradient(160deg,rgba(50,40,60,.72),rgba(10,14,28,.84));border:1.5px solid rgba(255,230,200,.22);border-radius:30px;backdrop-filter:blur(18px);box-shadow:0 34px 90px rgba(0,0,0,.6),inset 0 1.5px 0 rgba(255,255,255,.14)}
.dd{position:absolute;left:0;top:0;width:100%;height:100%}
.pill{display:inline-flex;gap:16px;align-items:center;font:700 66px/1 Fam;letter-spacing:-.01em;color:var(--ink);background:var(--li);border-radius:999px;padding:28px 56px 28px 40px;box-shadow:0 0 70px rgba(198,255,74,.5),0 14px 36px rgba(0,0,0,.45);transform-origin:center}.pill .ic{width:62px;height:62px}
#dust,#grain{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;pointer-events:none}#dust{mix-blend-mode:screen;opacity:.32}#grain{mix-blend-mode:multiply;opacity:.12}
`;
const html = `<!doctype html><meta charset="utf-8"><title>reel 02 cells</title><style>${css}</style>
<div id="stage"><canvas id="gl" width="1080" height="1920"></canvas><canvas id="fx" width="1080" height="1920"></canvas>
<video id="dust" src="media/dust-particles.webm" muted playsinline preload="auto"></video><video id="grain" src="media/film-grain.webm" muted playsinline preload="auto"></video>

<section class="sc" id="sc3"><div id="pct" class="big" style="top:560px;font-size:150px;color:#ff6a5a;text-shadow:0 0 60px rgba(255,77,61,.5),0 8px 30px rgba(0,0,0,.6)">≈86%</div>
<div id="days" class="big" style="top:1196px;font-size:76px;letter-spacing:-.02em;color:#f1ece6;text-shadow:0 6px 26px rgba(0,0,0,.7)">0 DAYS</div></section>
<section class="sc" id="sc4"><div id="d35" class="big" style="top:930px;color:#fff1d2;text-shadow:0 0 50px rgba(0,0,0,.75),0 6px 24px rgba(0,0,0,.8),0 0 80px rgba(255,150,40,.5)">3–5 DAYS</div></section>
<section class="sc" id="sc5"><div class="glass" id="cal" style="position:absolute;left:668px;top:350px;width:250px;height:250px;overflow:hidden;text-align:center"><div style="font:400 20px/1 Frag;letter-spacing:.2em;color:rgba(241,236,230,.75);margin-top:26px">YEAR</div><div id="calnum" style="font:700 120px/1 Fam;letter-spacing:-.04em;margin-top:6px">1</div><div style="font:400 20px/1 Frag;letter-spacing:.2em;color:rgba(241,236,230,.75);margin-top:6px">OF 7</div>
<svg id="strike" width="250" height="250" style="position:absolute;left:0;top:0"><path d="M24 214 L226 36" stroke="#ff4d3d" stroke-width="12" stroke-linecap="round" fill="none" stroke-dasharray="290" stroke-dashoffset="290" style="filter:drop-shadow(0 0 12px rgba(255,77,61,.7))"/></svg></div></section>
<section class="sc" id="sc7"><div class="glass" id="friend" style="position:absolute;left:150px;top:620px;width:768px;height:690px;overflow:hidden">${doodle}</div>
<div class="glass" id="bubble" style="position:absolute;left:250px;top:440px;width:668px;padding:26px 34px;border-radius:34px 34px 8px 34px;font:700 54px/1.1 Fam;letter-spacing:-.02em;color:var(--tx)">I'm a new person now. <span style="color:var(--li);display:inline-block;width:40px;height:40px;vertical-align:-6px">${ph('sparkle')}</span></div></section>
<section class="sc" id="sc9"><div id="av" style="position:absolute;left:380px;top:520px;width:320px;height:320px;border-radius:50%;background:url(media/profile.jpg) center/cover;border:6px solid var(--li);box-shadow:0 0 0 10px rgba(198,255,74,.18),0 0 70px rgba(198,255,74,.4),0 24px 60px rgba(0,0,0,.6)"></div>
<div id="hd" style="position:absolute;left:150px;top:880px;width:768px;text-align:center;font:700 74px/1 Fam;letter-spacing:-.03em;text-shadow:0 6px 26px rgba(0,0,0,.6)">@sandesh.explains</div>
<div id="fol" style="position:absolute;left:150px;top:1020px;width:768px;display:flex;justify-content:center"><span class="pill"><span class="ic">${ph('plus-circle')}</span>FOLLOW</span></div></section>

<div id="cntwrap"><div id="cnt"></div><div id="cntlab">SINCE YOU PRESSED PLAY</div></div>
<div id="ill">ILLUSTRATION · NOT A MICROSCOPE IMAGE</div><div id="cap"></div></div>
<script src="gl3.js"></script><script src="timing.js"></script><script src="main.js"></script>`;
writeFileSync(S + 'index.html', html); console.log('site/index.html written', html.length);
