#!/usr/bin/env node
// Assembles reel.html for "The Loop Method — Get Better Results From ChatGPT"
// from real files in assets/ and reel-app/src/humaaans/ — no hand-copied
// SVG path data, so nothing here can silently diverge from the source files.
//
// Applies the house rules accumulated in CLAUDE.md since the last reel:
//   - GSAP-driven entrances (dropIn/tumbleIn/runIn), vendored in assets/animations/gsap/
//   - Hard safe-zone exclusion: nothing in top ~150px, bottom ~400px, right ~190px
//     (Instagram's own UI chrome + phone status bar/notch cover those regions)
//   - Typography house style: vendored Poppins (display) + Inter (body) fonts,
//     off-white (not pure #fff) text with a soft text-shadow over the moving
//     texture background, em-based letter-spacing scale, one gradient-text
//     hero moment
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const A = (p) => join(ROOT, 'assets', p);

async function read(p) { return readFile(p, 'utf8'); }

// ---- tabler icons: extract <path .../> tags, re-wrap with our own stroke/size ----
async function tablerIcon(name) {
  const src = await read(A(`icons/tabler/${name}.svg`));
  const paths = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join('');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

// ---- feather icons: some use <circle>/<line>, not just <path> — grab the
// whole inner markup generically instead of only matching <path> tags ----
async function featherIcon(name) {
  const src = await read(A(`icons/feather/${name}.svg`));
  const m = src.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${m[1]}</svg>`;
}

// ---- brand logos (solid black fill) -> recolorable via currentColor ----
async function brandLogo(path) {
  const src = await read(A(path));
  const inner = src.match(/<svg[^>]*viewBox="([^"]+)"[\s\S]*?<g>([\s\S]*)<\/g>\s*<\/svg>/);
  const viewBox = inner[1];
  const body = inner[2].replace(/ fill="#000000"/g, '');
  return `<svg viewBox="${viewBox}" fill="currentColor">${body}</svg>`;
}

// ---- humaaans body-part JSX -> plain static SVG group ----
async function humaaansPart(relPath) {
  const src = await read(join(ROOT, 'reel-app/src/humaaans', relPath));
  const body = src
    .replace(/^[\s\S]*?=>\s*\(/, '')
    .replace(/\);\s*export default[\s\S]*$/, '')
    .replace(/strokeWidth=\{1\}/g, 'stroke-width="1"')
    .replace(/fillRule="evenodd"/g, 'fill-rule="evenodd"');
  return body.trim();
}

async function main() {
  const [
    pencil, photo, target, search, school, circleCheck, alertCircle,
    settings, refresh, repeat, arrowRight, bulb, rocket, sparkles, users,
  ] = await Promise.all([
    'pencil', 'photo', 'target', 'search', 'school', 'circle-check', 'alert-circle',
    'settings', 'refresh', 'repeat', 'arrow-right', 'bulb', 'rocket', 'sparkles', 'users',
  ].map(tablerIcon));

  const bookmark = await featherIcon('bookmark');
  const scissors = await featherIcon('scissors');
  const openai = await brandLogo('logos/gilbarbara/openai-icon.svg');

  const humanHead = await humaaansPart('head/Short.jsx');
  const humanTorso = await humaaansPart('torso/PointingUp.jsx');
  const humanBottom = await humaaansPart('bottom/SkinnyJeans.jsx');
  const humanSvg = `<svg viewBox="0 0 380 480">
    <g fill-rule="evenodd" stroke-width="1">
      <g transform="translate(40.000000, 31.000000)">
        <g transform="translate(82.000000, 0.000000)">${humanHead}</g>
        <g transform="translate(0.000000, 187.000000)">${humanBottom}</g>
        <g transform="translate(22.000000, 82.000000)">${humanTorso}</g>
      </g>
    </g>
  </svg>`;

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  const icons = {
    pencil, photo, scissors, target, search, school, circleCheck, alertCircle,
    settings, refresh, repeat, arrowRight, bulb, rocket, sparkles, bookmark, users,
  };

  const html = buildHtml({ icons, openai, humanSvg, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function chip(icon, label, id, extra) {
  return `<div class="chip${extra ? ' ' + extra : ''}" id="${id}"><span class="chip-icon">${icon}</span><span>${label}</span></div>`;
}

function buildHtml({ icons: I, openai, humanSvg, profileB64 }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-openai-loop-method</title>
<style>
@font-face{font-family:'Poppins';font-weight:800;font-style:normal;src:url('../assets/fonts/poppins/poppins-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Poppins';font-weight:900;font-style:normal;src:url('../assets/fonts/poppins/poppins-latin-900-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:500;font-style:normal;src:url('../assets/fonts/inter/inter-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;font-style:normal;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;font-style:normal;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}

html,body{margin:0;padding:0;width:1080px;height:1920px;background:#0e0e12;overflow:hidden;font-family:'Inter','Segoe UI',sans-serif;}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}
.bg-wash{position:absolute;inset:0;will-change:transform,opacity;
  background:
    radial-gradient(ellipse 820px 620px at 22% 18%, rgba(16,163,127,0.30), transparent 62%),
    radial-gradient(ellipse 900px 700px at 82% 84%, rgba(59,130,246,0.26), transparent 62%),
    radial-gradient(ellipse 520px 400px at 55% 50%, rgba(236,72,153,0.07), transparent 70%),
    linear-gradient(180deg,#0e0e12,#171320 50%,#0e0e12);}

/* Textured moving background: same approach as the rundown-ios reel —
   a slow-drifting dot grid + diagonal hatch (parallax) + soft glow, all
   parameterized by t inside window.__seek, never real-time CSS. */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-dots{position:absolute;inset:-80px;background-image:radial-gradient(circle, rgba(255,255,255,0.14) 2.2px, transparent 2.2px);background-size:50px 50px;}
.bg-hatch{position:absolute;inset:-120px;background-image:repeating-linear-gradient(118deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 2px, transparent 2px, transparent 68px);}
.bg-glow{position:absolute;inset:-80px;background-image:radial-gradient(circle 260px, rgba(16,163,127,0.08), transparent 70%);}

/* Gutter streamline accents. The right one is pulled in to sit just inside
   the hard right safe-zone boundary (see .safe below) instead of at a fixed
   distance from the physical edge — Instagram's own action-icon rail draws
   over roughly the outer 15% of the frame regardless of what we put there. */
.streamline{position:absolute;top:150px;bottom:400px;width:2px;background:repeating-linear-gradient(180deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 10px, transparent 10px, transparent 26px);z-index:0;}
.streamline.left{left:64px;}
.streamline.right{right:210px;}
.stream-dot{position:absolute;width:10px;height:10px;border-radius:50%;left:-4px;box-shadow:0 0 12px 3px currentColor;}

/* Hard safe-zone box. Nothing scene content renders outside this box:
   top 150px (status bar/notch + Instagram's top icon row), right 190px
   (Instagram's like/comment/share/save/audio rail), bottom 400px
   (Instagram's username/caption/audio-credit block). This is the enforced
   layout primitive CLAUDE.md's safe-zone section called for. */
.safe{position:absolute;top:150px;left:0;right:190px;bottom:400px;z-index:1;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 40px;box-sizing:border-box;}
.scene.active{display:flex;}

.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;position:relative;}
.band-top{flex:1.25 1 0;}
.band-bottom{padding-bottom:8px;}
.band-tight{flex:0.62 1 0;}
/* A single merged band (replaces a thin band-top + band-bottom pair) so a
   scene's visual and its sub-line sit together as one group in the middle
   of the frame instead of as two separately-centered islands with a dead
   gap between them — the fix for the "empty space" problem the 3-equal-
   band split caused when a scene's content was smaller than a full band's
   height. */
.band-content{flex:2.25 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;position:relative;}
/* Big, very low-opacity icon sitting behind a band-content's real content,
   purely as texture to fill the space a small icon/chip-row would
   otherwise leave dead — same "texture, never foreground competition"
   rule as .bg-dots/.bg-hatch, just per-scene and content-relevant instead
   of frame-wide. */
.bg-icon-huge{position:absolute;top:50%;left:50%;color:rgba(255,255,255,0.055);pointer-events:none;z-index:0;}
.bg-icon-huge svg{width:100%;height:100%;}

.visual{width:100%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;position:relative;will-change:transform,opacity;z-index:1;}

/* Typography house style: Poppins for display/headline, Inter for
   everything else; off-white (not pure #fff) + a soft text-shadow since
   every scene sits on top of the moving bg-dots/bg-hatch texture. */
.headline{font-family:'Poppins',sans-serif;color:#f1f3f8;font-size:70px;font-weight:800;text-align:center;line-height:1.14;letter-spacing:-0.03em;width:100%;text-shadow:0 4px 12px rgba(0,0,0,.5), 0 1px 3px rgba(0,0,0,.8);will-change:transform,opacity;z-index:1;}
.headline .acc{color:#34d399;}
.headline .amb{color:#fbbf24;}
.headline .grad{background:linear-gradient(180deg,#f1f3f8,#94a3b8);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.sub{font-family:'Inter',sans-serif;color:#b9c6da;font-size:38px;font-weight:600;text-align:center;line-height:1.4;width:100%;text-shadow:0 3px 10px rgba(0,0,0,.45);will-change:transform,opacity;z-index:1;}

.chips{width:100%;display:flex;flex-direction:column;gap:18px;z-index:1;}
.chip-row{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;}
.chip{font-family:'Inter',sans-serif;display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.08);border:2px solid rgba(255,255,255,0.2);border-radius:20px;padding:22px 30px;color:#f1f3f8;font-size:32px;font-weight:700;will-change:transform,opacity;}
.chip-icon{width:42px;height:42px;flex:0 0 42px;color:#34d399;}
.chip-icon svg{width:100%;height:100%;}
.chip.active{background:rgba(52,211,153,0.14);border-color:rgba(52,211,153,0.55);}
.chip.amber .chip-icon{color:#fbbf24;}

.icon-badge{width:100%;height:100%;color:#f1f3f8;}
.icon-badge svg{width:100%;height:100%;}

.stack{display:flex;flex-direction:column;align-items:center;gap:6px;}
.stack-label{font-family:'Inter',sans-serif;color:#f1f3f8;font-size:30px;font-weight:700;margin-top:14px;}
.stack-sub{font-family:'Inter',sans-serif;color:#b9c6da;font-size:24px;font-weight:600;letter-spacing:0.01em;}

.eyebrow{font-family:'Inter',sans-serif;color:#8b96a8;font-size:26px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;}
.big-stat{font-family:'Poppins',sans-serif;font-size:150px;font-weight:900;line-height:1;letter-spacing:-0.02em;background:linear-gradient(180deg,#f1f3f8,#94a3b8);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:none;}

.tip-card{width:100%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.16);border-radius:36px;padding:44px 40px;box-sizing:border-box;display:flex;align-items:center;gap:26px;will-change:transform,opacity;}
.tip-card svg{width:64px;height:64px;flex:0 0 64px;color:#fbbf24;}
.tip-card span{font-family:'Inter',sans-serif;color:#fef3c7;font-size:36px;font-weight:700;line-height:1.32;}

.cta-card{background:rgba(255,255,255,0.08);border:2px solid rgba(255,255,255,0.18);border-radius:30px;padding:44px 60px;display:flex;flex-direction:column;align-items:center;gap:20px;will-change:transform,opacity;}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,0.92);}
.cta-main{font-family:'Poppins',sans-serif;color:#f1f3f8;font-size:58px;font-weight:800;letter-spacing:-0.02em;}
.cta-sub{font-family:'Inter',sans-serif;color:#a8c0f5;font-size:34px;font-weight:600;}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:#f1f3f8;width:0%;}
svg{overflow:visible;}
</style>
</head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-wash" id="bgwash"></div>
<div class="bg-texture">
  <div class="bg-hatch" id="bghatch"></div>
  <div class="bg-dots" id="bgdots"></div>
  <div class="bg-glow" id="bgglow"></div>
</div>
<div class="streamline left">
  <div class="stream-dot" id="sdot0" style="color:#34d399;"></div>
  <div class="stream-dot" id="sdot1" style="color:#60a5fa;"></div>
  <div class="stream-dot" id="sdot2" style="color:#34d399;"></div>
</div>
<div class="streamline right">
  <div class="stream-dot" id="sdot3" style="color:#fbbf24;"></div>
  <div class="stream-dot" id="sdot4" style="color:#34d399;"></div>
  <div class="stream-dot" id="sdot5" style="color:#60a5fa;"></div>
</div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 -->
  <div class="scene" id="sc1">
    <div class="band band-top">
      <div class="visual" id="s1visual" style="width:820px;height:640px;">
        <div class="icon-badge" id="s1human" style="width:340px;height:432px;position:absolute;left:20px;top:20px;">${humanSvg}</div>
        <div class="icon-badge" id="s1pencil" style="width:130px;height:130px;position:absolute;right:80px;top:0;color:#b9c6da;">${I.pencil}</div>
        <div class="icon-badge" id="s1photo" style="width:130px;height:130px;position:absolute;right:0;top:190px;color:#b9c6da;">${I.photo}</div>
        <div class="icon-badge" id="s1scissors" style="width:120px;height:120px;position:absolute;right:110px;bottom:0;color:#b9c6da;">${I.scissors}</div>
      </div>
    </div>
    <div class="band band-tight">
      <div class="headline" id="s1head">My ChatGPT workflow works... but the <span class="amb">quality keeps drifting</span>.</div>
    </div>
    <div class="band band-bottom">
      <div class="chips">
        <div class="chip-row">
          ${chip(I.rocket, 'Writing, editing, images — same story', 's1chip1')}
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 2: REVEAL 0:05-0:09 -->
  <div class="scene" id="sc2">
    <div class="band band-top">
      <div class="visual" id="s2visual" style="width:320px;height:392px;">${openai}</div>
    </div>
    <div class="band">
      <div class="headline" id="s2head">There's a fix: <span class="grad">The Loop Method.</span></div>
      <div class="sub" id="s2sub">3 loops. That's it.</div>
    </div>
    <div class="band band-bottom">
      <div class="chips">
        <div class="chip-row">
          ${chip(I.sparkles, 'One prompt, reusable forever', 's2chip1')}
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 3: STEP 1 0:09-0:15 -->
  <div class="scene" id="sc3">
    <div class="band band-tight">
      <div class="headline" id="s3head" style="font-size:62px;">Step 1 — Pick a workflow that needs improvement.</div>
    </div>
    <div class="band-content">
      <div class="bg-icon-huge" id="s3bgicon" style="width:640px;height:640px;margin:-320px 0 0 -320px;">${I.target}</div>
      <div class="chip-row" style="width:100%;align-items:center;justify-content:center;">
        ${chip(I.pencil, 'Writing', 's3c0')}
        ${chip(I.scissors, 'Editing', 's3c1')}
        ${chip(I.photo, 'Images', 's3c2', 'active')}
      </div>
      <div class="sub" id="s3sub">Something that works, but needs cleanup every time.</div>
    </div>
  </div>

  <!-- SCENE 4: STEP 2 0:15-0:22 -->
  <div class="scene" id="sc4">
    <div class="band band-tight">
      <div class="headline" id="s4head" style="font-size:62px;">Step 2 — Build a 3-agent review panel.</div>
    </div>
    <div class="band-content">
      <div class="bg-icon-huge" id="s4bgicon" style="width:600px;height:600px;margin:-300px 0 0 -300px;">${I.users}</div>
      <div class="chip-row" style="width:100%;align-items:flex-start;justify-content:center;flex-wrap:nowrap;">
        <div class="stack" id="s4quality" style="background:rgba(255,255,255,0.07);border:2px solid rgba(255,255,255,0.18);border-radius:28px;padding:34px 18px;width:240px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:92px;height:92px;color:#34d399;">${I.target}</div>
          <div class="stack-label">Quality</div>
          <div class="stack-sub">reviewer</div>
        </div>
        <div class="stack" id="s4prompt" style="background:rgba(255,255,255,0.07);border:2px solid rgba(255,255,255,0.18);border-radius:28px;padding:34px 18px;width:240px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:92px;height:92px;color:#60a5fa;">${I.search}</div>
          <div class="stack-label">Prompt</div>
          <div class="stack-sub">reviewer</div>
        </div>
        <div class="stack" id="s4expert" style="background:rgba(255,255,255,0.07);border:2px solid rgba(255,255,255,0.18);border-radius:28px;padding:34px 18px;width:240px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:92px;height:92px;color:#fbbf24;">${I.school}</div>
          <div class="stack-label">Subject</div>
          <div class="stack-sub">matter expert</div>
        </div>
      </div>
      <div class="sub" id="s4sub2">Each one checks a different thing.</div>
    </div>
  </div>

  <!-- SCENE 5: STEP 3 0:22-0:28 -->
  <div class="scene" id="sc5">
    <div class="band band-tight">
      <div class="headline" id="s5head" style="font-size:62px;">Step 3 — Define "done" before you start.</div>
    </div>
    <div class="band-content">
      <div class="bg-icon-huge" id="s5bgicon" style="width:620px;height:620px;margin:-310px 0 0 -310px;">${I.circleCheck}</div>
      <div id="s5card" style="width:100%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.16);border-radius:32px;padding:48px 44px;box-sizing:border-box;will-change:transform,opacity;">
        <div class="chips">
          <div class="chip-row" style="justify-content:flex-start;">${chip(I.circleCheck, 'Consistent dimensions', 's5c0')}</div>
          <div class="chip-row" style="justify-content:flex-start;">${chip(I.circleCheck, 'Shared visual style', 's5c1')}</div>
          <div class="chip-row" style="justify-content:flex-start;">${chip(I.circleCheck, 'Recognizable details', 's5c2')}</div>
        </div>
      </div>
      <div class="sub" id="s5sub">3–5 checks the output must pass.</div>
    </div>
  </div>

  <!-- SCENE 6: STEP 4 (the loop) 0:28-0:39 -->
  <div class="scene" id="sc6">
    <div class="band band-tight">
      <div class="headline" id="s6head" style="font-size:62px;">Step 4 — Run exactly 3 loops.</div>
    </div>
    <div class="band band-top">
      <div class="visual" id="s6loopwrap" style="width:520px;height:520px;">
        <div class="icon-badge" id="s6refresh" style="width:520px;height:520px;position:absolute;color:rgba(255,255,255,0.10);">${I.refresh}</div>
        <div class="big-stat" id="s6num">1</div>
      </div>
      <div class="eyebrow" id="s6loopword">LOOP</div>
    </div>
    <div class="band band-bottom">
      <div id="s6card" style="width:100%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.16);border-radius:32px;padding:34px 20px;box-sizing:border-box;will-change:transform,opacity;">
        <div class="chip-row" style="width:100%;align-items:center;justify-content:space-between;flex-wrap:nowrap;">
          <div class="icon-badge" id="s6i0" style="width:76px;height:76px;color:#f87171;">${I.alertCircle}</div>
          <div class="icon-badge" id="s6a0" style="width:40px;height:40px;color:#8b96a8;">${I.arrowRight}</div>
          <div class="icon-badge" id="s6i1" style="width:76px;height:76px;color:#f1f3f8;">${I.settings}</div>
          <div class="icon-badge" id="s6a1" style="width:40px;height:40px;color:#8b96a8;">${I.arrowRight}</div>
          <div class="icon-badge" id="s6i2" style="width:76px;height:76px;color:#60a5fa;">${I.repeat}</div>
          <div class="icon-badge" id="s6a2" style="width:40px;height:40px;color:#8b96a8;">${I.arrowRight}</div>
          <div class="icon-badge" id="s6i3" style="width:76px;height:76px;color:#34d399;">${I.circleCheck}</div>
        </div>
      </div>
      <div class="sub" id="s6sub" style="font-size:34px;">Fix the workflow, not the output.</div>
    </div>
  </div>

  <!-- SCENE 7: STEP 5 0:39-0:45 -->
  <div class="scene" id="sc7">
    <div class="band band-tight">
      <div class="headline" id="s7head" style="font-size:62px;">Step 5 — Test on a brand-new example.</div>
    </div>
    <div class="band-content">
      <div class="bg-icon-huge" id="s7bgicon" style="width:600px;height:600px;margin:-300px 0 0 -300px;">${I.rocket}</div>
      <div class="chip-row" style="width:100%;align-items:center;justify-content:center;">
        <div class="icon-badge" id="s7new" style="width:150px;height:150px;color:#b9c6da;">${I.sparkles}</div>
        <div class="icon-badge" id="s7arrow" style="width:80px;height:80px;color:#8b96a8;">${I.arrowRight}</div>
        <div class="icon-badge" id="s7check1" style="width:126px;height:126px;color:#34d399;">${I.circleCheck}</div>
        <div class="icon-badge" id="s7check2" style="width:126px;height:126px;color:#34d399;">${I.circleCheck}</div>
        <div class="icon-badge" id="s7check3" style="width:126px;height:126px;color:#34d399;">${I.circleCheck}</div>
      </div>
      <div class="sub" id="s7sub">Same workflow, zero rebuilding.</div>
      <div class="chips">
        <div class="chip-row">${chip(I.circleCheck, 'Passes every check, ship it', 's7chip1')}</div>
      </div>
    </div>
  </div>

  <!-- SCENE 8: PRO TIP 0:45-0:51 -->
  <div class="scene" id="sc8">
    <div class="band band-tight">
      <div class="eyebrow" id="s8eyebrow" style="font-size:32px;text-align:center;width:100%;">PRO TIP</div>
    </div>
    <div class="band-content">
      <div class="bg-icon-huge" id="s8bgicon" style="width:680px;height:680px;margin:-340px 0 0 -340px;">${I.bulb}</div>
      <div class="tip-card" id="s8card" style="padding:60px 52px;gap:34px;">
        <div class="icon-badge" style="width:84px;height:84px;flex:0 0 84px;color:#fbbf24;">${I.bulb}</div>
        <span style="font-size:42px;">Fix the workflow, not the output — or you're patching forever.</span>
      </div>
    </div>
  </div>

  <!-- SCENE 9: SAVE TIP 0:51-0:55 -->
  <div class="scene" id="sc9">
    <div class="band band-tight">
      <div class="headline" id="s9head" style="font-size:58px;">Save the loop prompt.</div>
    </div>
    <div class="band-content">
      <div class="bg-icon-huge" id="s9bgicon" style="width:680px;height:680px;margin:-340px 0 0 -340px;">${I.bookmark}</div>
      <div class="icon-badge" id="s9bookmark" style="width:260px;height:260px;color:#fbbf24;">${I.bookmark}</div>
      <div class="sub" id="s9sub">Reuse it any time quality drifts.</div>
      <div class="chips">
        <div class="chip-row">${chip(I.sparkles, 'One prompt. Every workflow.', 's9chip1')}</div>
      </div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:55-1:00 -->
  <div class="scene" id="sc10">
    <div class="band band-top">
      <div class="icon-badge" id="s10human" style="width:340px;height:432px;">${humanSvg}</div>
    </div>
    <div class="band">
      <div class="cta-card" id="s10card">
        <img class="cta-pic" src="data:image/jpeg;base64,${profileB64}" alt="">
        <div class="cta-main">@sandesh.explains</div>
        <div class="cta-sub">linkedin /sandesh-kale</div>
      </div>
    </div>
  </div>

</div>

<div class="progress"><div class="progress-fill" id="progress"></div></div>

<script src="../assets/animations/gsap/gsap.min.js"></script>
<script>
function $(id){ return document.getElementById(id); }
function clamp(v,lo,hi){ return Math.max(lo, Math.min(hi, v)); }
function eoc(x){ x = clamp(x,0,1); return 1 - Math.pow(1-x,3); }

function enter(el, e, driftY, extraScale){
  if(!el) return;
  var ee = clamp(e,0,1);
  el.style.opacity = 0.25 + 0.75*ee;
  el.style.transform = 'translateY(' + (driftY*(1-ee)) + 'px) scale(' + ((0.92+0.08*ee) * (extraScale||1)) + ')';
}

// --- GSAP-driven entrance helpers (assets/animations/gsap/gsap.min.js) ---
// Each helper builds a single paused gsap.timeline() per element (memoized
// on the element, since every call site always passes the same params for
// a given element) and scrubs it with tl.progress(e) — never tl.play().
// Pure function of the e/t passed in from window.__seek, same contract
// as everywhere else in this repo.
var __entranceTl = new WeakMap();
function scrubTl(el, cacheKey, buildTl, e){
  if(!el || typeof gsap === 'undefined') return;
  var cached = __entranceTl.get(el);
  if(!cached || cached.key !== cacheKey){
    cached = { key: cacheKey, tl: buildTl() };
    __entranceTl.set(el, cached);
  }
  cached.tl.progress(clamp(e,0,1));
}
function dropIn(el, e, dropHeight, rotateDeg){
  scrubTl(el, 'drop:' + dropHeight + ':' + rotateDeg, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/3, ease: 'none' }, 0);
    tl.fromTo(el, { y: dropHeight || 0, rotation: rotateDeg || 0 },
                   { y: 0, rotation: 0, duration: 1, ease: 'bounce.out' }, 0);
    return tl;
  }, e);
}
function tumbleIn(el, e, rotateFromDeg){
  scrubTl(el, 'tumble:' + rotateFromDeg, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/2.4, ease: 'none' }, 0);
    tl.fromTo(el, { rotation: rotateFromDeg || 90, scale: 0.55 },
                   { rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }, 0);
    return tl;
  }, e);
}
function runIn(el, e, fromX){
  scrubTl(el, 'run:' + fromX, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/2.6, ease: 'none' }, 0);
    tl.fromTo(el, { x: fromX || 0, rotation: -7 },
                   { x: 0, rotation: 0, duration: 1, ease: 'power2.out' }, 0);
    return tl;
  }, e);
}

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), render: function(t){
      runIn($('s1human'), t/0.55, -180);
      tumbleIn($('s1pencil'), (t-0.25)/0.4, 60);
      tumbleIn($('s1photo'), (t-0.4)/0.4, -50);
      tumbleIn($('s1scissors'), (t-0.55)/0.4, 70);
      enter($('s1head'), eoc((t-0.5)/0.55), 22, 1);
      dropIn($('s1chip1'), (t-1.1)/0.4, -120, -6);
  }},
  { start: 5, duration: 4, el: $('sc2'), render: function(t){
      dropIn($('s2visual'), t/0.5, -240, 0);
      enter($('s2head'), eoc((t-0.3)/0.5), 20, 1);
      enter($('s2sub'), eoc((t-0.55)/0.5), 18, 1);
      dropIn($('s2chip1'), (t-1.0)/0.4, -110, 8);
  }},
  { start: 9, duration: 6, el: $('sc3'), render: function(t){
      enter($('s3head'), eoc(t/0.5), 20, 1);
      dropIn($('s3c0'), (t-0.35)/0.4, -140, -10);
      dropIn($('s3c1'), (t-0.5)/0.4, -140, 0);
      dropIn($('s3c2'), (t-0.65)/0.4, -140, 10);
      enter($('s3sub'), eoc((t-1.2)/0.5), 18, 1);
  }},
  { start: 15, duration: 7, el: $('sc4'), render: function(t){
      enter($('s4head'), eoc(t/0.5), 20, 1);
      dropIn($('s4quality'), (t-0.3)/0.5, -220, -12);
      dropIn($('s4prompt'), (t-0.5)/0.5, -220, 0);
      dropIn($('s4expert'), (t-0.7)/0.5, -220, 12);
      enter($('s4sub2'), eoc((t-1.3)/0.5), 18, 1);
  }},
  { start: 22, duration: 6, el: $('sc5'), render: function(t){
      enter($('s5head'), eoc(t/0.5), 20, 1);
      enter($('s5card'), eoc((t-0.15)/0.5), 24, 1);
      dropIn($('s5c0'), (t-0.4)/0.4, -100, -6);
      dropIn($('s5c1'), (t-0.6)/0.4, -100, 0);
      dropIn($('s5c2'), (t-0.8)/0.4, -100, 6);
      enter($('s5sub'), eoc((t-1.3)/0.5), 18, 1);
  }},
  { start: 28, duration: 10, el: $('sc6'), render: function(t){
      enter($('s6head'), eoc(t/0.5), 20, 1);
      $('s6loopwrap').style.opacity = eoc((t-0.15)/0.5);
      $('s6refresh').style.transform = 'rotate(' + (t*40) + 'deg)';
      var loopT = clamp(t - 0.3, 0, 999);
      var loopIdx = Math.min(2, Math.floor(loopT / 2.6));
      $('s6num').textContent = String(loopIdx + 1);
      $('s6loopword').style.opacity = eoc((t-0.3)/0.4);
      enter($('s6card'), eoc((t-1.0)/0.5), 24, 1);
      dropIn($('s6i0'), (t-1.3)/0.35, -100, -8);
      runIn($('s6a0'), (t-1.5)/0.3, -30);
      dropIn($('s6i1'), (t-1.65)/0.35, -100, 0);
      runIn($('s6a1'), (t-1.85)/0.3, -30);
      dropIn($('s6i2'), (t-2.0)/0.35, -100, 0);
      runIn($('s6a2'), (t-2.2)/0.3, -30);
      dropIn($('s6i3'), (t-2.35)/0.35, -100, 8);
      enter($('s6sub'), eoc((t-3.2)/0.5), 18, 1);
  }},
  { start: 38, duration: 6, el: $('sc7'), render: function(t){
      enter($('s7head'), eoc(t/0.5), 20, 1);
      dropIn($('s7new'), (t-0.35)/0.4, -140, -8);
      runIn($('s7arrow'), (t-0.55)/0.3, -40);
      dropIn($('s7check1'), (t-0.75)/0.35, -120, -8);
      dropIn($('s7check2'), (t-0.9)/0.35, -120, 0);
      dropIn($('s7check3'), (t-1.05)/0.35, -120, 8);
      enter($('s7sub'), eoc((t-1.5)/0.5), 18, 1);
      dropIn($('s7chip1'), (t-1.9)/0.4, -110, -6);
  }},
  { start: 44, duration: 6, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.4), 16, 1);
      enter($('s8card'), eoc((t-0.25)/0.5), 26, 1);
  }},
  { start: 50, duration: 5, el: $('sc9'), render: function(t){
      enter($('s9head'), eoc(t/0.45), 20, 1);
      dropIn($('s9bookmark'), (t-0.3)/0.55, -220, -10);
      enter($('s9sub'), eoc((t-0.75)/0.5), 18, 1);
      dropIn($('s9chip1'), (t-1.1)/0.4, -110, 6);
  }},
  { start: 55, duration: 5, el: $('sc10'), render: function(t){
      runIn($('s10human'), t/0.55, -200);
      dropIn($('s10card'), (t-0.3)/0.5, -160, 0);
  }}
];

window.__reelDurationSec = 60.0;
var marker = $('marker');
var started = false;

window.__seek = function(t){
  if (!started) { marker.style.display='none'; started = true; }
  SCENES.forEach(function(scene){
    var active = t >= scene.start && t < scene.start + scene.duration;
    scene.el.classList.toggle('active', active);
    if (active) scene.render(clamp(t - scene.start, 0, scene.duration));
  });
  $('bgwash').style.opacity = 0.75 + 0.25*Math.sin(t*1.05);
  $('bgwash').style.transform = 'scale(' + (1 + 0.05*Math.sin(t*0.85)) + ')';
  $('progress').style.width = (100*clamp(t/window.__reelDurationSec,0,1)) + '%';

  $('bgdots').style.transform = 'translate(' + ((t*13)%48) + 'px,' + ((t*9)%48) + 'px)';
  $('bghatch').style.transform = 'translate(' + (-(t*10)%68) + 'px, ' + ((t*4)%68) + 'px)';
  $('bgglow').style.transform = 'translate(' + (140*Math.sin(t*0.18)) + 'px, ' + (220*Math.cos(t*0.13)) + 'px)';

  var streamH = 1920 - 150 - 400;
  for (var si = 0; si < 6; si++) {
    var speed = 0.14 + si * 0.015;
    var phase = (t * speed + si / 6) % 1;
    $('sdot' + si).style.top = (phase * streamH) + 'px';
    $('sdot' + si).style.opacity = 0.35 + 0.35 * Math.sin(phase * Math.PI);
  }
};

window.__autoplay = function(){
  var start = performance.now();
  function tick(){
    var t = (performance.now()-start)/1000;
    window.__seek(t);
    if (t < window.__reelDurationSec) requestAnimationFrame(tick);
  }
  tick();
};
</script>
</body>
</html>`;
}

main().catch((err) => { console.error(err); process.exit(1); });
