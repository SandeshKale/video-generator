#!/usr/bin/env node
// Assembles reel.html for "You Don't Need a Mac Team to Ship an iOS App"
// from real files in assets/ and reel-app/src/humaaans/ — no hand-copied
// SVG path data, so nothing here can silently diverge from the source files.
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

// ---- brand logos (solid black fill) -> recolorable via currentColor ----
async function brandLogo(path) {
  const src = await read(A(path));
  const inner = src.match(/<svg[^>]*viewBox="([^"]+)"[\s\S]*?<g>([\s\S]*)<\/g>\s*<\/svg>/);
  const viewBox = inner[1];
  const body = inner[2].replace(/ fill="#000000"/g, '');
  return `<svg viewBox="${viewBox}" fill="currentColor">${body}</svg>`;
}

// ---- brand logos with a fixed white badge background (e.g. Notion) ----
// keep original colors as-is; recoloring via currentColor would make the
// dark mark disappear against its own white background square.
async function brandLogoAsIs(path) {
  const src = await read(A(path));
  const m = src.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);
  return `<svg viewBox="${m[1]}">${m[2]}</svg>`;
}

// ---- flowbite illustrations: keep full multi-color art as-is ----
async function flowbiteIllustration(name) {
  const src = await read(A(`illustrations/flowbite/3d/light/${name}.svg`));
  const m = src.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);
  return `<svg viewBox="${m[1]}">${m[2]}</svg>`;
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
    deviceMobile, fileText, tag, gitCommit, photo, shieldCheck, circleCheck,
    currencyDollar, clock, search, listCheck, archive, upload,
    alertTriangle, key, lock, alertCircle, messageCircle, arrowRight, terminal2,
  ] = await Promise.all([
    'device-mobile', 'file-text', 'tag', 'git-commit', 'photo', 'shield-check', 'circle-check',
    'currency-dollar', 'clock', 'search', 'list-check', 'archive', 'upload',
    'alert-triangle', 'key', 'lock', 'alert-circle', 'message-circle', 'arrow-right', 'terminal-2',
  ].map(tablerIcon));

  const apple = await brandLogo('logos/gilbarbara/apple.svg');
  const openai = await brandLogo('logos/gilbarbara/openai-icon.svg');
  const notion = await brandLogoAsIs('logos/gilbarbara/notion-icon.svg');

  const manQuestionMarks = await flowbiteIllustration('man-question-marks');
  const authFormFields = await flowbiteIllustration('authentication-form-fields');
  const documentFolders = await flowbiteIllustration('document-folders');
  const passwordLockKey = await flowbiteIllustration('password-lock-key');

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

  const profileB64 = (await read('/tmp/pic_b64.txt', 'utf8')).trim();

  const icons = {
    deviceMobile, fileText, tag, gitCommit, photo, shieldCheck, circleCheck,
    currencyDollar, clock, search, listCheck, archive, upload,
    alertTriangle, key, lock, alertCircle, messageCircle, arrowRight, terminal2,
    rocket: await tablerIcon('rocket'),
  };

  const html = buildHtml({ icons, apple, openai, notion, manQuestionMarks, authFormFields, documentFolders, passwordLockKey, humanSvg, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function chip(icon, label, id) {
  return `<div class="chip" id="${id}"><span class="chip-icon">${icon}</span><span>${label}</span></div>`;
}

function buildHtml({ icons: I, apple, openai, notion, manQuestionMarks, authFormFields, documentFolders, passwordLockKey, humanSvg, profileB64 }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-rundown-ios-codex</title>
<style>
html,body{margin:0;padding:0;width:1080px;height:1920px;background:#0e0e12;overflow:hidden;font-family:'Poppins','Segoe UI',sans-serif;}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}
.bg-wash{position:absolute;inset:0;will-change:transform,opacity;
  background:
    radial-gradient(ellipse 820px 620px at 24% 16%, rgba(96,64,214,0.34), transparent 62%),
    radial-gradient(ellipse 900px 700px at 80% 86%, rgba(24,144,190,0.28), transparent 62%),
    radial-gradient(ellipse 520px 400px at 55% 50%, rgba(74,222,128,0.08), transparent 70%),
    linear-gradient(180deg,#0e0e12,#15121f 50%,#0e0e12);}

/* Textured moving background: a slow-drifting dot grid + a slower diagonal
   hatch layer (parallax), standing in for the old per-scene watermark icon.
   Kept very low-opacity and driven off window.__seek(t) each frame, same
   as everything else, so it never desyncs and never fights the foreground
   for attention. */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-dots{position:absolute;inset:-80px;background-image:radial-gradient(circle, rgba(255,255,255,0.09) 1.8px, transparent 1.8px);background-size:48px 48px;}
.bg-hatch{position:absolute;inset:-120px;background-image:repeating-linear-gradient(118deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 2px, transparent 2px, transparent 68px);}
.bg-glow{position:absolute;inset:-80px;background-image:radial-gradient(circle 240px, rgba(74,222,128,0.05), transparent 70%);}

.chrome-top{position:absolute;top:0;left:0;right:0;height:110px;background:linear-gradient(180deg,rgba(0,0,0,0.5),transparent);}
.brand-pic{position:absolute;top:56px;right:40px;width:76px;height:76px;border-radius:50%;border:3px solid rgba(255,255,255,0.92);object-fit:cover;z-index:50;will-change:transform;}
.progress{position:absolute;bottom:26px;left:40px;right:40px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:#fff;width:0%;}

.safe{position:absolute;top:150px;left:0;right:0;bottom:50px;z-index:1;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 48px;box-sizing:border-box;}
.scene.active{display:flex;}

/* Three equal-height bands span the whole safe area so a scene's content
   is distributed across the full frame instead of clumping at the top
   and leaving the bottom half empty. */
.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;position:relative;}
.band-top{flex:1.15 1 0;}
.band-bottom{padding-bottom:8px;}

.visual{width:100%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;position:relative;will-change:transform,opacity;z-index:1;}
.headline{color:#fff;font-size:74px;font-weight:800;text-align:center;line-height:1.15;letter-spacing:-0.5px;width:100%;will-change:transform,opacity;z-index:1;}
.headline .acc{color:#4ade80;}
.headline .amb{color:#fbbf24;}
.sub{color:#b9c6da;font-size:40px;font-weight:600;text-align:center;line-height:1.32;width:100%;will-change:transform,opacity;z-index:1;}
.strike{text-decoration:line-through;color:#6b7280;}

.chips{width:100%;display:flex;flex-direction:column;gap:20px;z-index:1;}
.chip-row{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;}
.chip{display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.08);border:2px solid rgba(255,255,255,0.2);border-radius:20px;padding:24px 32px;color:#fff;font-size:36px;font-weight:700;will-change:transform,opacity;}
.chip-icon{width:44px;height:44px;flex:0 0 44px;color:#4ade80;}
.chip-icon svg{width:100%;height:100%;}
.chip.amber .chip-icon{color:#fbbf24;}
.chip.red .chip-icon{color:#f87171;}

.icon-badge{width:100%;height:100%;color:#fff;}
.icon-badge svg{width:100%;height:100%;}

.stack{display:flex;flex-direction:column;align-items:center;gap:8px;}
.big-stat{color:#fbbf24;font-size:120px;font-weight:900;line-height:1;letter-spacing:-1px;}
.stat-label{color:#b9c6da;font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-top:8px;}

.warn-banner{display:flex;align-items:center;gap:18px;background:rgba(248,113,113,0.16);border:2px solid rgba(248,113,113,0.55);border-radius:20px;padding:26px 34px;color:#fecaca;font-size:38px;font-weight:800;will-change:transform,opacity;}
.warn-banner svg{width:50px;height:50px;flex:0 0 50px;color:#f87171;}

.cta-card{background:rgba(255,255,255,0.08);border:2px solid rgba(255,255,255,0.18);border-radius:30px;padding:48px 64px;display:flex;flex-direction:column;align-items:center;gap:22px;will-change:transform,opacity;}
.cta-pic{width:160px;height:160px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,0.92);}
.cta-main{color:#fff;font-size:64px;font-weight:800;}
.cta-sub{color:#a8c0f5;font-size:38px;font-weight:600;}
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
<div class="chrome-top"></div>
<img class="brand-pic" id="brandpic" alt="" src="data:image/jpeg;base64,${profileB64}">

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:04 -->
  <div class="scene" id="sc1">
    <div class="band band-top">
      <div class="visual" id="s1visual" style="width:900px;height:700px;">
        <div class="icon-badge" id="s1human" style="width:400px;height:508px;position:absolute;left:10px;top:0;">${humanSvg}</div>
        <div class="icon-badge" id="s1apple" style="width:280px;height:344px;position:absolute;right:0px;top:30px;">${apple}</div>
        <div class="icon-badge" id="s1phone" style="width:190px;height:190px;position:absolute;right:170px;bottom:0;color:#b9c6da;">${I.deviceMobile}</div>
      </div>
    </div>
    <div class="band">
      <div class="headline" id="s1head">I shipped an iPhone app to the <span class="acc">App&nbsp;Store</span> without opening Xcode once.</div>
    </div>
    <div class="band band-bottom">
      <div class="chips">
        <div class="chip-row">
          ${chip(icons_rocket(I), 'One AI agent, one checklist', 's1chip1')}
        </div>
        <div class="chip-row">
          ${chip(I.deviceMobile, 'Real App Store release', 's1chip2')}
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 2: TWIST 0:04-0:08 -->
  <div class="scene" id="sc2">
    <div class="band band-top">
      <div class="visual" id="s2visual" style="width:780px;height:780px;">${manQuestionMarks}</div>
    </div>
    <div class="band">
      <div class="headline" id="s2head" style="font-size:84px;">Well... <span class="strike" id="s2strike">almost</span>.</div>
      <div class="sub" id="s2sub">There's still one Mac-only click.</div>
    </div>
    <div class="band band-bottom">
      <div class="chips">
        <div class="chip-row">
          ${chip(I.terminal2, 'Xcode still has to sign it', 's2chip1')}
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 3: REFRAME 0:08-0:14 -->
  <div class="scene" id="sc3">
    <div class="band">
      <div class="headline" id="s3head" style="font-size:66px;">The system: let AI run the checklist. You click only what Apple locks.</div>
    </div>
    <div class="band band-top">
      <div class="chip-row" style="width:100%;align-items:center;">
        <div class="stack" id="s3codex" style="background:rgba(255,255,255,0.07);border:2px solid rgba(255,255,255,0.18);border-radius:30px;padding:52px 38px;width:290px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:124px;height:124px;">${openai}</div>
          <div style="color:#fff;font-size:34px;font-weight:800;margin-top:16px;">Codex</div>
          <div style="color:#b9c6da;font-size:26px;font-weight:600;">scans &amp; audits</div>
        </div>
        <div class="icon-badge" id="s3arrow" style="width:76px;height:76px;align-self:center;color:#8b96a8;">${I.arrowRight}</div>
        <div class="stack" id="s3xcode" style="background:rgba(255,255,255,0.07);border:2px solid rgba(255,255,255,0.18);border-radius:30px;padding:52px 38px;width:290px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:124px;height:124px;color:#fff;">${I.terminal2}</div>
          <div style="color:#fff;font-size:34px;font-weight:800;margin-top:16px;">Xcode</div>
          <div style="color:#b9c6da;font-size:26px;font-weight:600;">builds &amp; signs</div>
        </div>
      </div>
    </div>
    <div class="band band-bottom">
      <div class="icon-badge" id="s3apple" style="width:150px;height:180px;">${apple}</div>
      <div class="sub" id="s3sub2" style="font-size:34px;">Apple Developer owns membership.</div>
    </div>
  </div>

  <!-- SCENE 4: STEP 1 0:14-0:20 -->
  <div class="scene" id="sc4">
    <div class="band">
      <div class="headline" id="s4head" style="font-size:66px;">Step 1 &mdash; Point Codex at your project folder.</div>
    </div>
    <div class="band band-top">
      <div class="visual" id="s4ringwrap" style="width:660px;height:660px;">
        <svg viewBox="0 0 200 200" style="width:100%;height:100%;">
          <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="11"/>
          <circle id="s4ring" cx="100" cy="100" r="86" fill="none" stroke="#4ade80" stroke-width="11" stroke-linecap="round" transform="rotate(-90 100 100)"/>
        </svg>
        <div class="icon-badge" style="width:92px;height:92px;position:absolute;color:#b9c6da;">${I.fileText}</div>
      </div>
    </div>
    <div class="band band-bottom">
      <div class="chips">
        <div class="chip-row">
          ${chip(I.tag, 'Version', 's4c0')}
          ${chip(I.gitCommit, 'Build #', 's4c1')}
          ${chip(I.photo, 'Icon', 's4c2')}
        </div>
        <div class="chip-row">
          ${chip(I.shieldCheck, 'Signing', 's4c3')}
          ${chip(I.circleCheck, 'Simulator', 's4c4')}
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 5: STEP 2 0:20-0:26 -->
  <div class="scene" id="sc5">
    <div class="band">
      <div class="headline" id="s5head" style="font-size:66px;">Step 2 &mdash; Apple Developer Program.</div>
    </div>
    <div class="band band-top">
      <div class="chip-row">
        <div class="stack" id="s5cost" style="background:rgba(251,191,36,0.12);border:2px solid rgba(251,191,36,0.45);border-radius:30px;padding:54px 46px;width:320px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:84px;height:84px;color:#fbbf24;">${I.currencyDollar}</div>
          <div class="big-stat" id="s5costnum">$0</div>
          <div class="stat-label">per year</div>
        </div>
        <div class="stack" id="s5time" style="background:rgba(251,191,36,0.12);border:2px solid rgba(251,191,36,0.45);border-radius:30px;padding:54px 46px;width:320px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:84px;height:84px;color:#fbbf24;">${I.clock}</div>
          <div class="big-stat" id="s5timenum">0h</div>
          <div class="stat-label">to approve</div>
        </div>
      </div>
    </div>
    <div class="band band-bottom">
      <div class="sub" id="s5sub">Start this first &mdash; it's the only step with a waiting line.</div>
      <div class="icon-badge" id="s5apple" style="width:118px;height:142px;">${apple}</div>
    </div>
  </div>

  <!-- SCENE 6: STEP 3 0:26-0:34 -->
  <div class="scene" id="sc6">
    <div class="band">
      <div class="headline" id="s6head" style="font-size:66px;">Step 3 &mdash; Codex audits the release gaps.</div>
    </div>
    <div class="band band-top">
      <div class="visual" id="s6illus" style="width:640px;height:640px;">${authFormFields}</div>
      <div class="icon-badge" id="s6search" style="width:80px;height:80px;position:absolute;color:#4ade80;">${I.search}</div>
    </div>
    <div class="band band-bottom">
      <div class="chips">
        <div class="chip-row">
          ${chip(I.listCheck, 'Export compliance', 's6c0')}
          ${chip(I.shieldCheck, 'Signing team', 's6c1')}
        </div>
        <div class="sub" id="s6sub" style="font-size:36px;">Every check shows its evidence.</div>
      </div>
    </div>
  </div>

  <!-- SCENE 7: STEP 4 0:34-0:42 -->
  <div class="scene" id="sc7">
    <div class="band">
      <div class="headline" id="s7head" style="font-size:62px;">Step 4 &mdash; Docs, archive, upload.</div>
    </div>
    <div class="band band-top">
      <div class="chip-row" style="width:100%;align-items:flex-start;">
        <div class="stack" id="s7docs" style="width:290px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:210px;height:210px;">${documentFolders}</div>
          <div class="icon-badge" style="width:52px;height:52px;margin-top:10px;">${notion}</div>
          <div style="color:#b9c6da;font-size:26px;font-weight:600;margin-top:6px;">privacy + support</div>
        </div>
        <div class="stack" id="s7arch" style="width:290px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:112px;height:112px;color:#fff;">${I.archive}</div>
          <div style="color:#fff;font-size:30px;font-weight:800;margin-top:12px;">Archive</div>
          <div style="color:#b9c6da;font-size:26px;font-weight:600;">in Xcode</div>
        </div>
        <div class="stack" id="s7upload" style="width:290px;will-change:transform,opacity;">
          <div class="icon-badge" style="width:112px;height:112px;color:#4ade80;">${I.upload}</div>
          <div style="color:#fff;font-size:30px;font-weight:800;margin-top:12px;">Upload</div>
          <div style="color:#b9c6da;font-size:26px;font-weight:600;">App Store Connect</div>
        </div>
      </div>
    </div>
    <div class="band band-bottom">
      <div class="icon-badge" id="s7apple" style="width:112px;height:136px;">${apple}</div>
      <div class="sub" id="s7sub2" style="font-size:34px;">Same bundle ID, start to finish.</div>
    </div>
  </div>

  <!-- SCENE 8: WARNING 0:42-0:50 -->
  <div class="scene" id="sc8">
    <div class="band band-top">
      <div class="visual" id="s8illus" style="width:700px;height:700px;">${passwordLockKey}</div>
    </div>
    <div class="band">
      <div class="warn-banner" id="s8warn">${I.alertTriangle}<span>Never paste passwords or 2FA codes into Codex.</span></div>
    </div>
    <div class="band band-bottom">
      <div class="chip-row">
        <div class="chip red"><span class="chip-icon">${I.lock}</span><span>Passwords</span></div>
        <div class="chip red"><span class="chip-icon">${I.key}</span><span>2FA codes</span></div>
      </div>
      <div class="sub" id="s8sub2" style="font-size:34px;">Do those steps yourself, in Apple's own surfaces.</div>
    </div>
  </div>

  <!-- SCENE 9: PRO TIP 0:50-0:55 -->
  <div class="scene" id="sc9">
    <div class="band">
      <div class="headline" id="s9head" style="font-size:66px;">Pro tip:</div>
    </div>
    <div class="band band-top">
      <div class="chip-row" style="width:100%;align-items:center;">
        <div class="icon-badge" id="s9err" style="width:130px;height:130px;color:#f87171;">${I.alertCircle}</div>
        <div class="icon-badge" id="s9arrow1" style="width:68px;height:68px;color:#8b96a8;">${I.arrowRight}</div>
        <div class="icon-badge" id="s9chat" style="width:130px;height:130px;color:#fff;">${I.messageCircle}</div>
        <div class="icon-badge" id="s9arrow2" style="width:68px;height:68px;color:#8b96a8;">${I.arrowRight}</div>
        <div class="icon-badge" id="s9check" style="width:130px;height:130px;color:#4ade80;">${I.circleCheck}</div>
      </div>
    </div>
    <div class="band band-bottom">
      <div class="sub" id="s9sub" style="font-size:42px;">Paste the exact Apple error into Codex. Ask for the smallest next step.</div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:55-1:00 -->
  <div class="scene" id="sc10">
    <div class="band band-top">
      <div class="icon-badge" id="s10human" style="width:400px;height:508px;">${humanSvg}</div>
    </div>
    <div class="band">
      <div class="cta-card" id="s10card">
        <img class="cta-pic" src="data:image/jpeg;base64,${profileB64}" alt="">
        <div class="cta-main">@sandesh.explains</div>
        <div class="cta-sub">linkedin /sandesh-kale</div>
      </div>
    </div>
    <div class="band band-bottom">
      <div class="chips">
        <div class="chip-row">
          ${chip(I.rocket, 'More AI workflow breakdowns weekly', 's10chip')}
        </div>
      </div>
    </div>
  </div>

</div>

<div class="progress"><div class="progress-fill" id="progress"></div></div>

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

// --- extra entrance styles for tumbling / dropping / running motion ---
function easeOutBack(x){ var c1=1.70158, c3=c1+1; x=clamp(x,0,1); return 1 + c3*Math.pow(x-1,3) + c1*Math.pow(x-1,2); }
function easeOutBounce(x){
  x = clamp(x,0,1);
  var n1=7.5625, d1=2.75;
  if (x < 1/d1) return n1*x*x;
  if (x < 2/d1) { x -= 1.5/d1; return n1*x*x + 0.75; }
  if (x < 2.5/d1) { x -= 2.25/d1; return n1*x*x + 0.9375; }
  x -= 2.625/d1; return n1*x*x + 0.984375;
}
// Drops from above and bounces to a settled stop — for icons/chips that
// should feel like they landed with a bit of weight.
function dropIn(el, e, dropHeight, rotateDeg){
  if(!el) return;
  var ee = clamp(e,0,1);
  var b = easeOutBounce(ee);
  el.style.opacity = clamp(ee*3,0,1);
  el.style.transform = 'translateY(' + (dropHeight*(1-b)) + 'px) rotate(' + ((rotateDeg||0)*(1-b)) + 'deg)';
}
// Rotates in from an angle while popping past 100% scale and settling —
// for elements that should feel like they tumbled into frame.
function tumbleIn(el, e, rotateFromDeg){
  if(!el) return;
  var ee = clamp(e,0,1);
  var b = easeOutBack(ee);
  el.style.opacity = clamp(ee*2.4,0,1);
  el.style.transform = 'rotate(' + ((rotateFromDeg||90)*(1-b)) + 'deg) scale(' + (0.55+0.45*b) + ')';
}
// Slides in horizontally with a slight lean, like it ran into place.
function runIn(el, e, fromX){
  if(!el) return;
  var ee = clamp(e,0,1);
  var eo = eoc(ee);
  el.style.opacity = clamp(ee*2.6,0,1);
  el.style.transform = 'translateX(' + ((fromX||0)*(1-eo)) + 'px) rotate(' + (-7*(1-eo)) + 'deg)';
}

var C4 = 2*Math.PI*86;
$('s4ring').style.strokeDasharray = C4;
$('s4ring').style.strokeDashoffset = C4;

var SCENES = [
  { start: 0,  duration: 4, el: $('sc1'), render: function(t){
      runIn($('s1human'), t/0.55, -180);
      dropIn($('s1apple'), (t-0.2)/0.55, -260, 22);
      tumbleIn($('s1phone'), (t-0.4)/0.5, -110);
      enter($('s1head'), eoc((t-0.35)/0.55), 22, 1 + 0.012*Math.sin(t*2));
      dropIn($('s1chip1'), (t-0.85)/0.4, -120, -8);
      dropIn($('s1chip2'), (t-1.05)/0.4, -120, 8);
  }},
  { start: 4,  duration: 4, el: $('sc2'), render: function(t){
      tumbleIn($('s2visual'), t/0.55, -140);
      enter($('s2head'), eoc((t-0.15)/0.5), 20, 1);
      $('s2strike').style.opacity = t > 0.9 ? 1 : 0.15;
      enter($('s2sub'), eoc((t-1.1)/0.5), 18, 1);
      dropIn($('s2chip1'), (t-1.5)/0.4, -110, 10);
  }},
  { start: 8,  duration: 6, el: $('sc3'), render: function(t){
      enter($('s3head'), eoc(t/0.55), 20, 1);
      dropIn($('s3codex'), (t-0.35)/0.5, -220, -14);
      runIn($('s3arrow'), (t-0.55)/0.4, -70);
      dropIn($('s3xcode'), (t-0.7)/0.5, -220, 14);
      tumbleIn($('s3apple'), (t-1.1)/0.5, 130);
      enter($('s3sub2'), eoc((t-1.35)/0.5), 16, 1);
  }},
  { start: 14, duration: 6, el: $('sc4'), render: function(t){
      enter($('s4head'), eoc(t/0.5), 20, 1);
      var re = eoc((t-0.2)/1.6);
      $('s4ring').style.strokeDashoffset = C4 * (1-re);
      $('s4ring').style.strokeOpacity = 0.75 + 0.25*Math.sin(t*2.1);
      $('s4ringwrap').style.opacity = 0.3 + 0.7*eoc((t-0.1)/0.5);
      var rots = [-14,-7,0,7,14];
      ['s4c0','s4c1','s4c2','s4c3','s4c4'].forEach(function(id,i){
        dropIn($(id), (t-0.6-0.13*i)/0.4, -140, rots[i]);
      });
  }},
  { start: 20, duration: 6, el: $('sc5'), render: function(t){
      enter($('s5head'), eoc(t/0.5), 20, 1);
      dropIn($('s5cost'), (t-0.3)/0.5, -240, -12);
      dropIn($('s5time'), (t-0.45)/0.5, -240, 12);
      $('s5costnum').textContent = '$' + Math.round(99*eoc((t-0.35)/0.9));
      $('s5timenum').textContent = Math.round(48*eoc((t-0.5)/0.9)) + 'h';
      enter($('s5sub'), eoc((t-1.3)/0.5), 18, 1);
      tumbleIn($('s5apple'), (t-1.6)/0.5, -110);
  }},
  { start: 26, duration: 8, el: $('sc6'), render: function(t){
      enter($('s6head'), eoc(t/0.5), 20, 1);
      tumbleIn($('s6illus'), (t-0.25)/0.6, -130);
      var sx = 130 + 260*((t*0.5) % 1);
      $('s6search').style.left = sx + 'px';
      $('s6search').style.top = (170 + 60*Math.sin(t*1.3)) + 'px';
      $('s6search').style.opacity = t > 0.6 ? 0.9 : 0;
      $('s6c0') && dropIn($('s6c0'), (t-1.0)/0.4, -120, -10);
      $('s6c1') && dropIn($('s6c1'), (t-1.2)/0.4, -120, 10);
      enter($('s6sub'), eoc((t-1.6)/0.5), 18, 1);
  }},
  { start: 34, duration: 8, el: $('sc7'), render: function(t){
      enter($('s7head'), eoc(t/0.5), 20, 1);
      dropIn($('s7docs'), (t-0.3)/0.5, -200, -10);
      dropIn($('s7arch'), (t-0.55)/0.5, -200, 0);
      dropIn($('s7upload'), (t-0.8)/0.5, -200, 10);
      tumbleIn($('s7apple'), (t-1.3)/0.5, 120);
      enter($('s7sub2'), eoc((t-1.55)/0.5), 16, 1);
  }},
  { start: 42, duration: 8, el: $('sc8'), render: function(t){
      dropIn($('s8illus'), t/0.6, -260, -6);
      var we = eoc((t-0.5)/0.5);
      $('s8warn').style.opacity = we;
      var shakeX = t < 0.85 ? Math.sin(t*38) * 8 : 0;
      $('s8warn').style.transform = 'translateY(' + (18*(1-we)) + 'px) translateX(' + shakeX + 'px)';
      dropIn(document.querySelectorAll('#sc8 .chip')[0], (t-1.0)/0.4, -140, -12);
      dropIn(document.querySelectorAll('#sc8 .chip')[1], (t-1.15)/0.4, -140, 12);
      enter($('s8sub2'), eoc((t-1.5)/0.5), 16, 1);
  }},
  { start: 50, duration: 5, el: $('sc9'), render: function(t){
      enter($('s9head'), eoc(t/0.4), 18, 1);
      dropIn($('s9err'), (t-0.25)/0.4, -180, -14);
      runIn($('s9arrow1'), (t-0.45)/0.3, -50);
      dropIn($('s9chat'), (t-0.6)/0.4, -180, 0);
      runIn($('s9arrow2'), (t-0.8)/0.3, -50);
      dropIn($('s9check'), (t-0.95)/0.4, -180, 14);
      enter($('s9sub'), eoc((t-1.4)/0.5), 18, 1);
  }},
  { start: 55, duration: 5, el: $('sc10'), render: function(t){
      runIn($('s10human'), t/0.55, -200);
      dropIn($('s10card'), (t-0.3)/0.5, -160, 0);
      dropIn($('s10chip'), (t-0.8)/0.4, -110, 8);
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
  $('brandpic').style.transform = 'scale(' + (1 + 0.02*Math.sin(t*1.8)) + ')';
  $('progress').style.width = (100*clamp(t/window.__reelDurationSec,0,1)) + '%';

  // Textured moving background: dot grid drifts one way, hatch lines drift
  // the other (parallax), a soft glow drifts slowly on its own path. All
  // deterministic in t, all low-opacity so foreground always reads first.
  $('bgdots').style.transform = 'translate(' + ((t*13)%48) + 'px,' + ((t*9)%48) + 'px)';
  $('bghatch').style.transform = 'translate(' + (-(t*10)%68) + 'px, ' + ((t*4)%68) + 'px)';
  $('bgglow').style.transform = 'translate(' + (140*Math.sin(t*0.18)) + 'px, ' + (220*Math.cos(t*0.13)) + 'px)';
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

function icons_rocket(I) { return I.rocket; }

main().catch((err) => { console.error(err); process.exit(1); });
