# CLAUDE.md

Guidance for Claude (or any agent) working in this repository. This repo
generates Instagram-Reel-style vertical (1080×1920, 9:16) MP4 videos from
self-contained HTML animations, rendered deterministically with headless
Chromium + ffmpeg. Read this before creating or editing a reel.

## Core render contract (read this first)

Every reel — whether a plain `.html` file or a bundled app — must expose
exactly two globals once its DOM/state is ready:

```js
window.__reelDurationSec = <number>;   // total video length, seconds
window.__seek = function(t) { ... };   // renders the EXACT visual state at time t
```

`scripts/render.mjs` is the only thing that ever calls `__seek`. It:

1. Loads the source (`file://` for a single HTML file, or a local
   `http://127.0.0.1` static server for a directory source — see
   "Directory sources" below).
2. Reads `window.__reelDurationSec`.
3. For `i` from `0` to `round(duration * 60)`:
   - calls `page.evaluate(t => window.__seek(t), i / 60)`
   - screenshots the page to `frame-000123.png`
4. Encodes the PNG sequence with ffmpeg:
   `libx264, yuv420p, preset medium, crf 18, 60fps, +faststart`.

**`__seek(t)` must be a pure function of `t`.** No `setTimeout`, no
`requestAnimationFrame` loops, no CSS `@keyframes`/`transition` driven by the
browser's own clock, no mutable counters that accumulate across calls. The
render loop calls `__seek` at fixed 1/60s virtual-time steps, but each
`page.screenshot()` takes a *variable* amount of real wall-clock time — any
animation not explicitly parameterized by the `t` argument will drift out of
sync and look jittery/wrong-speed in the final video. This is the single
most important invariant in this codebase; violating it is the most common
way a render looks broken despite "working" when eyeballed live in a
browser.

If you want to reuse one of the pre-vendored CSS/SMIL animation packs under
`assets/animations/` (which are all real-time-clock by default), the fix is
to pause it and set a negative `animation-delay` equal to `-t` inside
`__seek`:

```css
.loader { animation-play-state: paused; }
```
```js
window.__seek = function(t) {
  el.style.animationDelay = `-${t}s`;
};
```

Full detail and the reasoning behind it is in `assets/ATTRIBUTION.md` under
"Using `animations/*` with the render pipeline".

## Every reel needs its own visual identity — hard, non-negotiable rule

`reel-openai-loop-method` was first built by copying
`reel-anthropic-rundown-ios/build.mjs` as a template and only swapping the
script content — same dot-grid/hatch texture, same streamline gutters, same
card style, same color wash, same `reel-app/src/humaaans` character. This
was called out explicitly and strongly: reusing a prior reel's palette,
background texture, component language, or character is not acceptable,
even when the underlying layout mechanics (safe-zone, band system, GSAP
entrances) are legitimately worth reusing. **Every new reel needs a
genuinely distinct design system**, decided before writing any scene markup:

- **Color palette** — pick new accent colors; don't default to whatever the
  last reel used. `reel-anthropic-rundown-ios` is green/blue/amber on navy;
  `reel-openai-loop-method` is cyan/magenta on near-black. The next reel
  needs a third combination, not a variation on either.
- **Background texture/motion language** — the *kind* of background motion
  should differ, not just its color. Rundown-ios uses a drifting dot-grid +
  diagonal hatch; loop-method uses a graph-paper grid + horizontal scanline
  sweep + vertical data-readout gutters (replacing dots entirely). Pick a
  texture metaphor that fits the new reel's topic.
- **Component language** — rundown-ios uses rounded-rect cards and pill
  chips; loop-method uses angular clip-corner panels and monospace
  bracket-tags. Don't reuse one reel's card/chip shape verbatim in the next.
- **Typography** — see "Typography" below; pick a display font suited to
  the new reel, don't reflexively reach for whatever the last reel used.
- **Characters** — see "Character variety" below; never reuse the exact
  same humaaans pose (or, ideally, the same pose+colors) across reels, and
  don't reuse the same pose twice *within* one reel either.

**Practical workflow**: before building all of a new reel's scenes, mock up
2-3 representative scenes in the proposed new visual system (a small
throwaway `mockup.mjs` + static HTML, screenshotted with Playwright) and
get them approved before committing to the full build — this is what
avoided a wasted full rebuild when the first loop-method attempt reused
rundown-ios's system. Delete the mockup files once the full build
supersedes them (don't leave stale mockup HTML/scripts committed).

The one thing that *should* carry over between reels unchanged is the
**mechanics**, not the look: the `window.__seek(t)` contract, the safe-zone
box, the GSAP-scrubbed entrance pattern, the signal-bridge-style
gap-filling requirement (see "Layout system" below), and the typography
*rules* (contrast, shadow, letter-spacing scale) — just applied through
each reel's own distinct palette/fonts/components.

## Repository map

```
video-generator/
├── scripts/
│   ├── render.mjs            Generic renderer: bun scripts/render.mjs <src> <out.mp4> [scale]
│   └── static-server.mjs     Zero-dep Node-API http server, used only for directory sources
├── assets/                   Curated third-party icon/illustration/logo/photo/animation/font library
│   ├── fonts/                 Vendored webfonts (Poppins, Inter, JetBrains Mono, Space Grotesk, ...) — see "Typography" below
│   ├── animations/gsap/       Vendored GSAP core (gsap.min.js) — see "Entrance animations" below
│   ├── animations/lottie/     Vendored lottie-web runtime (lottie.min.js) — see "Lottie" below
│   ├── animations/video-overlay/ 3 real-footage texture clips (grain/leaks/dust) — see "Video overlays" below
│   ├── illustrations/humaaans-react/  24 pre-composed humaaans character poses — see "Character variety" below
│   └── ATTRIBUTION.md        License table per source + the animation-seeking caveat above
├── reel-anthropic-opus-5-5/          Reel 1 (template-based, hand-written HTML + profile pic substitution)
├── reel-anthropic-opus-5-5-v2/       Reel 1, v2 (denser)
├── reel-anthropic-rundown-ios/       Reel 2 (programmatically built from build.mjs; navy dot-grid/streamline visual system)
├── reel-openai-loop-method/          Reel 3 (programmatically built; cyan/magenta "Terminal/Signal" visual system —
│                                       see build.mjs, and cover-build.mjs for its purpose-built cover image)
├── reel-app/                         React/Vite POC proving the contract also works from a bundled app
├── package.json / bun.lock            Root deps (Bun-managed): playwright, gsap
├── README.md                         User-facing overview and quick start
└── CLAUDE.md                         This file
```

**Runtime/package manager: Bun**, not Node/npm. `bun install` resolves
`package.json` against the committed `bun.lock` (a human-readable text
lockfile — diff and commit it like any other source file, unlike npm's
`package-lock.json`); every script in this repo (`render.mjs`,
`static-server.mjs`, every reel's `build.mjs`/`cover-build.mjs`) is run
with `bun <script>` instead of `node <script>`. This is a drop-in swap —
none of these scripts use anything beyond standard `node:fs`/`node:path`/
`node:http`/`node:child_process` APIs, which Bun implements natively, so
no source changes were needed to move off Node. `reel-app/` (the Vite
POC) is likewise installed and built with `bun install` / `bun run
build`; Vite's own CLI is unchanged, only the package manager invoking it
is different.

**Playwright's Chromium download must stay version-pinned.** This repo
pins `playwright` to an exact version (not a caret range) in
`package.json` precisely so `bun install` resolves to the same
`playwright-core` build whose expected Chromium revision matches whatever
build is already sitting in `PLAYWRIGHT_BROWSERS_PATH` — letting the
version float can silently resolve to a newer `playwright-core` that
expects a Chromium revision nobody has downloaded yet, which fails at
render time with a confusing "executable doesn't exist" error rather than
an install-time one. If you ever bump the `playwright` version
intentionally, re-run `npx/bunx playwright install chromium` (or confirm
the environment's pre-provisioned browser cache covers the new revision)
before trusting a render.

## `scripts/render.mjs`

```
bun scripts/render.mjs <source.html|dist-dir> <output.mp4> [scale]
```

- **Source resolution**: `stat()`s the source path. If it's a directory
  (e.g. a Vite `dist/` build), spins up `scripts/static-server.mjs` and
  loads `index.html` over `http://127.0.0.1:<port>/`. If it's a file, loads
  it directly via `pathToFileURL(...)` (`file://`).
  - **Why directories need a server**: Chromium enforces CORS on
    `type="module"` `<script>` tags even when loaded over `file://`. Vite's
    build output always uses `type="module"` entry scripts, so a bare
    `file://` load of `dist/index.html` silently fails to run any JS. Plain
    hand-written reel HTML files use classic (non-module) `<script>` tags
    and load fine over `file://` directly — no server needed for those.
- **Canvas size**: source documents are always authored at a fixed CSS size
  of 1080×1920 (9:16 vertical). `deviceScaleFactor` (the optional `scale`
  arg, default `1`) determines the actual pixel output:
  - `1` (default) → 1080×1920, native Full HD.
  - `2` → 2160×3840, 4K UHD.
  - Both are captured at native pixel density — never upscaled.
  - **Always render at Full HD (scale 1) — never 4K (scale 2) — standing
    instruction.** 4K capture is dramatically slower in this repo's
    typical execution environment: a 58s reel measured ~20 frames/min at
    scale 2 (headless Chromium falls back to a software/swiftshader GL
    renderer there, and compositing cost scales with pixel count), a
    ~3 hour projected render, versus ~4 frames/sec at scale 1, under 15
    minutes for the same reel. Full HD is also plenty of resolution for
    an Instagram Reels upload. Don't pass `2` unless a human explicitly
    asks for a 4K render for a specific reason.
- **Frame rate**: hardcoded to 60fps. Total frame count = `round(duration *
  60)`, duration read from `window.__reelDurationSec` on the loaded page.
- **Encoding**: `ffmpeg -framerate 60 -i frame-%06d.png -c:v libx264 -pix_fmt
  yuv420p -preset medium -crf 18 -r 60 -movflags +faststart <output>`.
  CRF 18 is visually near-lossless but produces large files (a 60s Full HD
  render can be 30MB+). If a render needs to be smaller (e.g. to fit a
  platform's upload size limit), re-encode the already-produced MP4 at a
  higher CRF rather than re-running the full Chromium capture pass — it's
  much faster and the frame content is identical:
  ```bash
  ffmpeg -y -i big.mp4 -c:v libx264 -preset medium -crf 23 \
    -pix_fmt yuv420p -movflags +faststart smaller.mp4
  ```
  This is a lossy re-encode of an already-lossy file — fine for delivery,
  but if a *pristine* smaller file is ever needed, re-render from the PNG
  frames at the target CRF directly instead.

## Two authoring patterns used in this repo

### 1. Plain self-contained HTML (`reel-anthropic-opus-5-5*/reel.html`)

A single `.html` file with inline `<style>` and `<script>`. Scenes are
`<div class="scene" id="sceneN">` elements shown/hidden by a `SCENES` array
of `{start, duration, el}` entries; `window.__seek(t)` finds the active
scene(s) for `t`, toggles `display`, and calls a per-scene render routine
that sets `opacity`/`transform` on child elements based on local elapsed
time within the scene. `reel-anthropic-opus-5-5/reel.html.tmpl` shows the
templated form (`{{PROFILE_PIC_B64}}` substitution) used to generate a
variant with a different profile picture.

### 2. Generated HTML via a Node build script (`reel-anthropic-rundown-ios/build.mjs`, `reel-openai-loop-method/build.mjs`)

This is now the standard pattern for a new reel — two live examples exist
(`reel-anthropic-rundown-ios` and `reel-openai-loop-method`), each with its
own fully distinct visual system built on the same underlying `build.mjs`
structure (see "Every reel needs its own visual identity" above). Used
when a reel needs many real icons/logos/illustrations pulled from
`assets/` rather than a handful of hand-copied inline SVGs — keeps the
curated asset folder as the single source of truth instead of risking drift
from copy-pasted SVG markup. **`reel.html` in this folder is a generated
artifact — never hand-edit it.** Edit `build.mjs` and regenerate:

```bash
cd reel-anthropic-rundown-ios && bun build.mjs
```

Key pieces of `build.mjs`:

- **Asset-reading helpers** (read real files out of `../assets/`, never
  hand-copied):
  - `tablerIcon(name)` — extracts `<path.../>` from a tabler-icons SVG,
    wraps it in a `viewBox="0 0 24 24" fill="none" stroke="currentColor"`
    outline-icon shell.
  - `brandLogo(path)` — for solid-black-fill brand marks (Apple, OpenAI):
    strips the hardcoded `fill="#000000"` and sets `fill="currentColor"` on
    the wrapping `<svg>` so the logo's color can be controlled via CSS.
  - `brandLogoAsIs(path)` — keeps original fill colors untouched. Needed for
    logos like Notion's, which layer a white background-square path under a
    black mark path — recoloring via `currentColor` makes the mark invisible
    against its own (also recolored) white square.
  - `flowbiteIllustration(name)` — keeps full multi-color illustration SVGs
    as-is.
  - `humaaansPart(relPath)` — the older pattern: converts a single humaaans
    body-part file (authored as a React/JSX component with embedded SVG
    path data) to plain static SVG, regex-replacing JSX-cased attributes
    (`strokeWidth={1}` → `stroke-width="1"`, `fillRule="evenodd"` →
    `fill-rule="evenodd"`), then manually stitches head+torso+bottom
    together with hardcoded `translate()` offsets. **Prefer `humaaansFull()`
    for new reels** (see "Character variety (humaaans)" below) — it works
    on full pre-composed poses with resolvable color props instead of
    manually-positioned parts, and gives access to 24 poses instead of one.
    `humaaansPart`/the single curated `reel-app/src/humaaans` figure are
    kept only because `reel-anthropic-rundown-ios` still depends on them;
    don't extend that pattern further.
    strips the component wrapper.
- **`buildHtml({...})`** — the template-literal function that emits the full
  HTML document: CSS (`<style>`), scene markup (10 scenes), and the
  `<script>` block containing the `SCENES` array and `window.__seek`.
- **Entrance-animation helpers** (defined inside the generated `<script>`,
  all driven by an eased progress value `e ∈ [0,1]` computed from `t`, and
  built on **GSAP** — `assets/animations/gsap/gsap.min.js`, vendored core
  build, loaded via a plain `<script src="../assets/animations/gsap/gsap.min.js">`
  tag so it works over `file://`):
  - `scrubTl(el, cacheKey, buildTl, e)` — the shared primitive. Builds a
    `gsap.timeline({ paused: true })` once per element (memoized on the
    element via a `WeakMap`, keyed by `cacheKey` so the same element can be
    reused with different params without going stale) and scrubs it with
    `tl.progress(clamp(e, 0, 1))` — **never `tl.play()`**. This keeps every
    entrance a pure function of `e` (and therefore of `t`), same invariant
    as the rest of the render contract, while getting GSAP's tested easing
    curves instead of hand-rolled bounce/back/cubic math.
  - `dropIn(el, e, dropHeight, rotateDeg)` — bounce-drop entrance
    (`ease: 'bounce.out'`), for "falling into place" elements.
  - `tumbleIn(el, e, rotateFromDeg)` — rotate+scale entrance
    (`ease: 'back.out(1.7)'`), slight overshoot, for a "tumbling in" feel.
  - `runIn(el, e, fromX)` — horizontal slide+tilt entrance
    (`ease: 'power2.out'`), for a "running in from the side" feel.
  - Use these instead of the older generic `enter()` helper (still present,
    plain CSS `transform`/`opacity` interpolation, no GSAP) when you want
    more kinetic, less uniform motion — mixing all three across a scene's
    elements is what gives these reels their "tumbling, dropping, running"
    character. `reel-openai-loop-method/build.mjs` has the same three
    helpers verbatim — copy that block into a new reel rather than
    re-deriving it, but keep `enter()`'s plain-CSS fallback for anything
    that doesn't need the extra weight of a GSAP timeline.

## Lottie — for motion-designer-authored animations

`assets/animations/lottie/lottie.min.js` (vendored the same way as GSAP —
see `assets/ATTRIBUTION.md` for the full license/usage note) plays back
After Effects animations exported via the Bodymovin/Lottie plugin. It's
a second, narrower exception to "engines aren't assets": a Lottie export
is a baked keyframe timeline, and `anim.goToAndStop(frame, true)` +
`anim.totalFrames` is a clean match for `window.__seek(t)`, same
principle as GSAP's `tl.progress(e)`.

Use this only when a motion designer hands you an actual `.json`
Bodymovin export to bring in — it's a playback runtime, not a source of
animations; nothing under `assets/animations/lottie/` is itself an
animation to reuse. Reach for GSAP's `dropIn`/`tumbleIn`/`runIn` first
for anything a JS timeline can express — Lottie is worth the extra
weight specifically when a scene needs something only After
Effects can author reasonably (complex character animation, hand-drawn
frame-by-frame work, elaborate masking).

**Two non-obvious things that will break this if skipped** (verified by
hand — the JSON schema is unforgiving about both):

1. **Inline the JSON as `animationData`, never load it via `path`.**
   `path` triggers an XHR fetch, which hangs forever under `file://` —
   the exact same CORS class of bug as Vite's `type="module"` scripts
   (see "Directory sources" below). `build.mjs` should `JSON.parse` the
   exported file at build time and inline the object into the generated
   `<script>`, the same way a profile picture gets inlined as base64
   rather than referenced by URL.
2. **Seek using `e * (anim.totalFrames - 1)`, not `e * anim.totalFrames`.**
   Valid frame indices are `0..totalFrames-1`; asking for frame
   `totalFrames` overshoots by one and lottie-web holds an unexpected
   in-between value at exactly `e = 1` (confirmed by hand-testing a
   scale-keyframe animation — off by one frame produced a visibly wrong
   final value instead of the authored end state).

```js
function lottieSeek(anim, e) {
  if (!anim || !anim.totalFrames) return;
  anim.goToAndStop(clamp(e, 0, 1) * (anim.totalFrames - 1), true);
}
// inside window.__seek(t): lottieSeek(anim, (t - scene.start) / scene.duration);
```

**tsParticles and p5.js were evaluated for generative backgrounds and
deliberately not vendored** — see `assets/ATTRIBUTION.md` for why
(tsParticles is a live physics sim with no deterministic-seek API;
p5.js is safe but not enough of a win over this repo's existing
CSS/SVG-driven textures to justify the dependency weight). Don't reach
for tsParticles for a reel background — it cannot be made to satisfy
the core render contract without patching its internals.

## Video overlays — real footage textures (film grain, light leaks, dust)

`assets/animations/video-overlay/` holds a small set of transparent-mood
texture clips (`light-leak-dust.webm`, `dust-particles.webm`,
`film-grain.webm` — see `assets/ATTRIBUTION.md` for sourcing/license)
sourced from Pixabay and re-encoded to VP9/WebM. This is a fourth,
narrower exception to "engines aren't assets" in the same family as
GSAP/Lottie: a plain HTML `<video>` element's `currentTime` + `seeked`
event is itself a deterministic seek primitive, no different in kind from
`tl.progress(e)` or `anim.goToAndStop(frame, true)`.

```js
function videoSeek(videoEl, t) {
  return new Promise((resolve) => {
    function onSeeked() { videoEl.removeEventListener('seeked', onSeeked); resolve(); }
    videoEl.addEventListener('seeked', onSeeked);
    videoEl.currentTime = t;
  });
}
// inside an async window.__seek(t):
await videoSeek(overlayEl, (localFrame + 0.5) / overlayFps);
```

**Two things that will break this if skipped** (hand-verified with
synthetic frame-numbered test clips before vendoring — see
`assets/ATTRIBUTION.md` for the full verification writeup):

1. **The overlay file must be VP9/WebM, never H.264/MP4.** This repo's
   pinned Playwright Chromium (`headless_shell`) cannot decode H.264 at
   all — `video.error.code` comes back `4`
   (`MEDIA_ERR_SRC_NOT_SUPPORTED`), because open-source Chromium builds
   don't ship the proprietary decoder. Every stock-video site defaults to
   MP4 downloads, so transcode before vendoring:
   `ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -vf scale=1080:-2
   out.webm` (the scale flag also cuts 4K source footage down to this
   repo's canvas width — no reel needs more).
2. **Seek to the middle of the frame's window, not its exact boundary.**
   `t = (frame + 0.5) / fps`, not `t = frame / fps` — landing exactly on
   a boundary risks an off-by-one from floating-point rounding, the same
   class of bug as Lottie's `totalFrames - 1` fix. Verified correct
   across both a single-keyframe ("long GOP") encode and an
   all-intraframe encode, seeking forward and backward — real video
   seeking through B/P frames decodes precisely, it isn't snapped to
   keyframes.

**Cost worth knowing before overusing this:** ~12ms per seek-and-capture
round-trip in testing. One overlay running for a full 60s/60fps render
adds roughly 45s of render time — fine for a texture on 2-3 scenes, not
something to put on every scene of every reel. `film-grain.webm`
specifically is white with black scratches (a photographed film-damage
texture, not synthetic grain) — composite it with `mix-blend-mode:
multiply` so the white background stays neutral and only the marks
darken what's underneath.

## Scene-to-scene transitions

Hard cuts between scenes work but feel abrupt; a short crossfade reads as
more polished without calling attention to itself. Pattern from
`reel-openai-loop-method/build.mjs`'s `window.__seek`:

- Each scene's visibility window is extended backward by a small
  `TRANS` constant (e.g. `0.32` seconds). For `raw = t - scene.start`:
  - `raw < 0` (still in the pre-roll/overlap with the previous scene):
    opacity eases `0 → 1` and the scene drifts in a small amount
    (`translateY`, ~20px) as `raw` approaches `0`.
  - `raw > duration - TRANS` (approaching the next scene): opacity eases
    `1 → 0` with the same small drift, in the *opposite* direction.
  - Otherwise: fully visible, `scene.render(t)` runs normally.
- This means **two scenes render simultaneously during the overlap
  window** — `.scene` visibility can no longer be a single CSS
  `.active` class toggle; drive `display`/`opacity`/`transform` directly
  via `style.*` in `__seek` instead.
- Skip the fade-out on the very last scene (`i === SCENES.length - 1`) —
  fading the final scene to nothing right before the video ends looks like
  a bug, not a transition.
- **Keep it subtle.** A short opacity+small-drift crossfade, not a wipe,
  zoom, spin, or any transition effect that draws attention to itself —
  explicitly requested as "cool but not over the top." If a transition
  effect is noticeable as an *effect* rather than just a smooth handoff,
  it's too much.

## Character variety (humaaans)

Early reels (`reel-anthropic-rundown-ios`, and the first draft of
`reel-openai-loop-method`) all reused the exact same single humaaans
figure — assembled from `reel-app/src/humaaans/{head/Short.jsx,
torso/PointingUp.jsx, bottom/SkinnyJeans.jsx}` — including using it *twice
in the same reel* (hook scene and CTA scene). This was called out
explicitly: reusing one character everywhere reads as templated, not
designed.

**Use `assets/illustrations/humaaans-react/` instead** — 24 full
pre-composed "standing" poses (plus several "sitting" poses), vendored
from the `react-humaaans` npm package (MIT). Unlike the old
`reel-app/src/humaaans` set (three separate body-part files manually
stitched together with hardcoded `translate()` offsets), each pose here is
one self-contained file with its own color props already resolved —
`standing/standing-N/StandingN.js`. Extraction pattern (see
`reel-openai-loop-method/build.mjs`'s `humaaansFull()`):

1. Read the pose file's source text.
2. Parse its `defaultProps` block (`skinColor`, `hairColor`, `shoeColor`,
   `coatColor`, `shirtColor`, `pantColor`) via regex — or pass an
   `overrides` object to recolor specific props for a given reel's palette
   (e.g. `{ coatColor: '#0e7c86' }` to tint a character toward a reel's
   accent color).
3. Extract the inner `<svg>...</svg>` markup and substitute every
   `{propName}` JSX interpolation with its resolved hex value, plus the
   couple of `{darken(propName)}` calls (a small hand-rolled HSL-darken
   helper in `build.mjs`, ~10% lightness reduction, replicating what the
   source's `tinycolor2`-based `darken()` does — no need to vendor
   `tinycolor2` itself for one operation).
4. Wrap the result as `<svg viewBox="0 0 380 480">...</svg>` — same
   viewBox the old single-figure set used, so it drops into existing
   sizing/positioning code unchanged.

**Rule going forward**: pick a *different* pose (and consider different
color overrides) for each character appearance, both across reels and
within a single reel if it uses more than one. Never reuse the exact same
`standing-N` pose+color combination twice. `assets/illustrations/humaaans-react/LICENSE.md`
has the full provenance note.

## Motion-showreel styles (intro stings / abstract showreel reels)

`MOTION-SHOWREEL-STYLES.md` (repo root) is a reserve catalog of abstract
motion-graphics styles for a standalone showreel/sting — kinetic
typography, glitch transitions, isometric blueprint, liquid glass,
particle fields, CRT terminal, brutalist type, and more — each with a
concrete `t`-driven CSS/SVG build technique already checked against this
repo's deterministic-seek constraint. `reel-motion-showreel-demo/`
(starburst → morphing shape with a live rotation gizmo → wave grid →
closing wordmark, all wrapped in fake-editor HUD chrome) is the approved
feasibility demo/reference implementation for this whole category. Check
the catalog before inventing a new showreel/sting style from scratch.

## Design-polish notes

`DESIGN-POLISH-NOTES.md` (repo root) is a checklist of small, concrete
CSS/SVG techniques for the next reel build — tabular numbers on counters,
the nested-border-radius formula, shadow-based elevation, squircle
corners, icon-morph crossfades, and an asymmetric (faster/quieter) exit
timing for the scene crossfade. All zero-dependency, all compatible with
the deterministic `window.__seek(t)` contract. Skim it when polishing a
new reel's component details.

## Scene eyebrow/tag copy must be content-specific, never a generic reused label

`// STAT CALLOUT` was copy-pasted verbatim as a scene-9 eyebrow across
**four separate reels** (`reel-anthropic-bio-lab`, `reel-claude-price-war`,
`reel-meta-muse-takeover`, `reel-openai-pro-max`) before this was caught —
a scene-type label standing in for what should have been a line specific
to that scene's actual number (e.g. bio-lab's "26% of Anthropic's own AI
R&D led by Claude" got the same tag as price-war's "22% of a monthly
budget" and muse-takeover's "5:1 giants joined vs. blocked" — three
unrelated stats, one interchangeable label). The eyebrow/mono-label tag
above a headline or stat should read like a caption written for *that*
number, not a category name for the slot it fills — compare the fix
(`// THE HANDOFF`, `// THE REAL COST`, `// THE SCOREBOARD`, `// THE NEW
CEILING` — one per reel's actual stat) against the generic version. This
generalizes past just the stat scene: any `// EYEBROW` tag in a new
reel's `build.mjs` should be written fresh for its own scene's content,
never reused from a previous reel's structurally-similar scene, and
worth a quick grep across a new reel's own scenes for accidental
duplicates before considering it done.

## Creative benchmark — what made the strongest reels actually work

`reel-openai-pro-max` ("$500/Month"), `reel-claude-price-war`, and
`reel-openai-loop-method` are this repo's high bar — explicitly named by
the user as the standard to clear. `reel-ai-roast-me` was explicitly
called out as falling short ("low on creativity and frames are too
empty") even after a density pass added more cards/chips to it. Comparing
them side by side, the gap isn't card count — it's *what kind* of visual
each scene builds. This section is a checklist to apply to the next
reel's script/mockup, not a note to go rebuild roast-me.

**The actual differences, concretely:**

- **Real, specific numbers everywhere, not one stat plus vague sentences.**
  Price-war's scenes cite exact prices (`$0.10 / $0.50`, `$2 / $10`),
  exact percentages (`22% weekly limit`), exact durations (`4 hours`),
  named benchmarks (`beats Fable 5.1`) — nearly every scene carries 2-4
  concrete data points, not one headline claim restated in different
  words. Roast-me had exactly one real number (310,000+) and filled the
  rest with abstract restatement ("no relationship on the line," "it's
  not reading you"). Before scripting a new reel, list out every hard
  number/fact available on the topic and make sure most scenes anchor to
  one, the way a real news segment would.
- **A bespoke, literal data-visualization centerpiece per key beat — not
  a reusable card with a new sentence in it.** This is the single biggest
  gap. Compare:
  - `reel-openai-pro-max`'s `priceTag()` ladder (scene 3): four pricing
    tiers stacked with escalating visual weight so the *jump* from $200
    to $500 is something you see, not just read.
  - `reel-claude-price-war`'s `ticket` component (`.ticket` + `.stamp`):
    a dashed-border receipt card with multiple `label → value` rows and a
    rotated rubber-stamp verdict (`-50%`, `4 HOURS`, `WINNING`) punched
    in the corner — used differently in every scene it appears in because
    each scene's *data* differs, not just its wrapper text.
  - `reel-openai-loop-method`'s scene 6: a **live circular progress
    ring** (SVG `stroke-dasharray`/`stroke-dashoffset`, t-driven) with a
    counting number in the center (`1` → `2` → `3`) synced to a `LOOP 1/3`
    label, plus an actual **icon → arrow → icon → arrow → icon** flow row
    showing a real process pipeline. This reads as "designed motion
    graphics," not "a styled div."
  A reusable card component (this reel's scorch-card, price-war's
  ticket, whatever) is fine as connective tissue between scenes, but at
  least 2-4 scenes per reel need something built specifically for that
  scene's data — a ladder, a ring, a stamped receipt, a ticker — that
  would look wrong or empty in any other scene.
- **Head-to-head / comparison visual language when the topic has two
  sides.** Price-war puts real OpenAI and Anthropic logos side by side
  with explicit win/lose color coding (`.brand-badge.win` /
  `.brand-badge.lose`) rather than describing the comparison in prose.
  If a topic has a rival, a before/after, or a such-vs-such shape, show
  both sides as objects on screen, not as two sentences.
- **Explicit narrative scaffolding via a numbered step tracker.**
  `checkpointHead(current, total, id)` (price-war) and `stepHead(current,
  total, id)` (loop-method) render a small `CHECKPOINT 2/5` /
  `STEP 4/5` readout with a dot-progress row, so the viewer always knows
  where they are in the story. Any reel with a sequence (steps, stages,
  checkpoints) should make that sequence visible on screen, not just
  implicit in the voiceover-style copy.
- **A persistent scrolling ticker-tape marquee for a data-heavy topic.**
  Price-war runs two full-width marquees (top and bottom gutters,
  `.ticker-top`/`.ticker-bottom`) scrolling real headline fragments and
  numbers (`SOL -50%`, `OPUS 5.5 BENCHMARK LEADER`, `22% BUDGET`) on a
  continuous loop for the *entire* reel — ambient reinforcement of the
  story's data density, and it doubles as gutter-filling texture. Worth
  reaching for specifically on a numbers-heavy topic (pricing, market,
  benchmarks) — not a fit for every reel's tone.
- **A real quote with real attribution.** Price-war's scene 7 is a bare
  quote (`"My go-to agent changed to Claude Code with this release." —
  Ben's Bites, this week`) — no card, no chip, just large type and a
  named source. It reads as reported fact, which is a different kind of
  credible than a stylized card making the same claim anonymously. Use
  a real, findable quote when the research turns one up, attributed by
  name.

**Practical takeaway for scripting the next reel**: after drafting the
10-scene script, go back through it and ask *"what is the one object I
could put on screen that makes this scene's specific claim visually
obvious, using this topic's own real numbers?"* for every scene — not
"which existing component do I drop this text into." If the honest
answer is "just a headline and a supporting sentence," that scene needs
either a sharper fact to hang it on or to be merged with a neighbor.

### Banned: an eyebrow tag that names the storytelling beat instead of the story

Caught on `reel-openai-dots-vs-grok`'s mockup — a scene's eyebrow read
`// THE REVEAL`. That's the *scriptwriting* label for that beat (the
working title used while outlining "1. Hook, 2. Timeline, 3. The
Reveal, 4. Spec comparison..."), copied straight onto the screen instead
of being replaced with something about the actual story. Flagged
immediately as reading "like a script guideline" — first misdiagnosed
as the supporting sentence beneath it, but the eyebrow itself was the
bug: it announces a narrative device to the viewer ("now I reveal
something to you") rather than naming what the scene is actually
about.

**The distinction, concretely**: `// THE CATCH` (used in prior reels) is
fine — "catch" names a real qualifier *in the story itself* (there's an
actual catch to the price cut, the discount, whatever). `// THE REVEAL`
is not fine — "reveal" names a *storytelling technique being performed
on the viewer*, not a fact about the topic. Same test applies to any
outline-stage label: `// THE TWIST`, `// THE SETUP`, `// THE PAYOFF`,
`// THE HOOK` are all scriptwriting vocabulary and read the same way if
they end up on screen unchanged. Before finalizing a new reel's eyebrow
copy, check every single one against "does this describe the topic, or
does it describe the beat's job in my outline?" — if it's the latter,
replace it with the content-specific version (this reel's fix:
`// THE REVEAL` → `// THE REDIRECT`, naming the actual mechanism
the story is about, not the narrative move the scene makes).

## Cover images

**See `.claude/skills/cover-art/SKILL.md` for the full step-by-step
pattern** (asset reuse, hero-graphic composition ideas, house-style
carryover rules, rendering snippet, and a pre-ship checklist) — invoke it
whenever a reel needs a cover. The summary below is kept for context but
the skill is the authoritative, up-to-date version. **Grid-first rules (3:4 crop, view-count badge, ≤5 words, constant structure) now override the older lockup — read them before designing any cover. The cover's accent/palette always comes from its own reel; there is no fixed brand accent (user decision).**

A reel's Instagram cover/thumbnail should be a **purpose-built design**,
not a screenshot pulled from the middle of the reel. A frame grab was
tried first for `reel-openai-loop-method` and explicitly rejected: "why
pull out a frame from the reel only... be creative." The fix —
`reel-openai-loop-method/cover-build.mjs` — is a small standalone script
(reuses the reel's own icon/logo extraction helpers, duplicated locally
rather than imported, since there's no shared module between reel folders
yet) that composes a dedicated single-frame layout: a custom hero graphic
that doesn't appear anywhere in the reel itself (an orbiting-icon ring
around the brand mark, one icon per step, in this case), a large title
lockup, a one-line subtitle, and a small branding footer. Rendered once
with Playwright (`page.screenshot()` on the standalone `cover.html`, no
`__seek` loop needed since it's a single static composition) to a PNG.

Pattern for a new reel's cover: write a `cover-build.mjs` alongside the
reel's `build.mjs`, reusing that reel's own visual system (colors, fonts,
component shapes) but inventing a genuinely new composition for the
thumbnail — not a scene from the video.

## Layout system — avoiding empty/dead frame regions

This repo has been iterated hard on **not leaving large empty regions of the
1080×1920 frame** (an explicit, repeated user requirement: "85% of the frame
should be filled with components and animations" / "Empty space I still
see"). If you add or edit a scene, apply these patterns:

- **Three-band layout**: each `.scene` is split into `.band` flex children
  (top/mid/bottom) so content spans the full vertical safe area instead of
  clustering in the visual center. `.band-top { flex: 1.25 1 0; }` (tuned
  down from 1.4, which over-inflated icon-only bands into looking *more*
  empty, not less). `.band-tight { flex: 0.62 1 0; }` for bands that hold
  only a short headline and don't need much vertical room.
- **Textured animated background** (`.bg-dots`, `.bg-hatch`, `.bg-glow`) —
  a low-opacity, slowly drifting dot grid + diagonal hatch + soft glow, all
  parameterized by `t` inside `__seek` (never CSS `@keyframes`). Kept at
  `z-index: 0` and low opacity so it reads as texture, not a competing
  foreground element. This replaced an earlier per-scene "large watermark
  icon" approach that the user found visually flat/repetitive.
- **Gutter "streamline" accents** — two vertical dashed lines in the left
  (`left: 64px`) and right (`right: 64px`) gutters, each carrying 3 glowing
  dots (`.stream-dot`, `box-shadow: 0 0 12px 3px currentColor`) that travel
  top-to-bottom on a continuous staggered loop, driven by `t`:
  ```js
  var streamH = 1920 - 150 - 50;
  for (var si = 0; si < 6; si++) {
    var speed = 0.14 + si * 0.015;
    var phase = (t * speed + si / 6) % 1;
    $('sdot' + si).style.top = (phase * streamH) + 'px';
    $('sdot' + si).style.opacity = 0.35 + 0.35 * Math.sin(phase * Math.PI);
  }
  ```
  These fill the otherwise-unused far-left/far-right vertical strips
  without competing with centered foreground content.
- **Card-wrapping sparse content**: a small row of icons/arrows floating
  alone in a large flex band reads as "empty space" even if technically
  non-empty. Wrap such rows in a semi-transparent bordered rounded-rect
  "card" div (matching the app's existing card style) to give them visual
  mass — see `#s7card` / `#s9card` in `reel-anthropic-rundown-ios/build.mjs`
  for the pattern. Prefer this over just increasing flex-basis on the
  containing band — that alone tends to make sparse content look *more*
  isolated, not less.
- **9:16 safe-zone guidance — treat as a hard requirement, not a
  suggestion.** Confirmed with a real on-device screenshot (Instagram Reels
  playback, iPhone 13 Pro Max) of `reel-anthropic-rundown-ios`: a caption
  pill ("Xcode still has to sign it") placed near the bottom of the
  1080×1920 canvas visually collided with Instagram's own UI chrome
  (username, caption text, audio credit) that Instagram overlays on top of
  the video — the app doesn't letterbox around a reel's content, it draws
  its own controls directly over the bottom and right edges of the frame.
  Any reel content placed there will look overlapped/cramped in the actual
  app, even though it renders perfectly clean in isolation (which is why
  this wasn't caught by screenshotting the raw MP4/HTML during
  development — always mentally check final placement against Instagram's
  own chrome, not just the bare frame).
  - **Bottom ~20% (bottom ~384px of the 1920px canvas, i.e. `y > 1536`)**:
    reserve for nothing. No pills, captions, CTAs, or icons should render
    here — this is exactly where Instagram draws the username, caption
    text (2-3 lines), audio attribution, and the progress bar.
  - **Right ~15% (right ~162px of the 1080px canvas, i.e. `x > 918`)**:
    reserve for nothing. This is where Instagram draws its vertical action
    rail (like/comment/share/save/audio-thumbnail icons).
  - **Left and right ~15% can also be physically cropped out of the
    picture, not just covered by UI — confirmed on `reel-anthropic-bio-lab`
    with a real on-device Reels-playback screenshot.** The DNA-helix
    gutters (`left:36px`/`right:36px`, 120px wide) were completely
    invisible in actual playback — not dimmed or overlapped, just entirely
    gone, on *both* the left edge (which has no Instagram UI overlay at
    all) and the right. This is a different mechanism from the action-rail
    finding above: Instagram Reels scales/crops the source video itself to
    fill a device's screen aspect ratio, and on a screen taller/narrower
    than exactly 9:16 (common — most modern phones are closer to 19.5:9 or
    20:9), that crop eats a meaningful slice off *both* left and right
    edges, independent of anything Instagram draws on top. Observed impact
    was severe enough to erase a 120px-wide element starting 36px from the
    edge entirely, meaning the real crop is well beyond the 15px
    action-rail margin — treat **~150-190px from each edge (matching this
    repo's own `.safe` content margin)** as the realistic limit of what
    survives on an arbitrary device, not just the 918px/162px UI-overlay
    boundary. **Practical rule: any decorative edge element (gutters,
    streamline dots, side accents) must be positioned with the same inset
    as the content safe-zone, never anchored near the raw canvas edge —
    "36px from the edge" is not a safe distance even though nothing else
    is drawn on top of it there.** `reel-anthropic-rundown-ios`'s
    `.streamline` gutters (`left:64px`/`right:64px`) have the same latent
    risk and should get the same inward fix whenever that reel is next
    touched.
  - **Top ~7-8% (top ~140px of the 1920px canvas, i.e. `y < 140`)**: also
    reserve for nothing, for two separate reasons that stack: (1) the
    phone's own status bar / notch / Dynamic Island physically covers this
    strip regardless of app, and (2) Instagram draws its own top overlay
    (back caret top-left, camera/create icon top-right) over roughly the
    same band on top of that. The same rundown-ios screenshot showed a
    small circular profile picture placed near the top-right corner —
    right where Instagram's own top-right icon sits — reading as
    cramped/half-obscured rather than as a clean brand mark.
  - **Bias primary text/content toward the upper-middle third** of the
    remaining safe area — it's the zone Instagram never covers regardless
    of caption length or UI state.
  - **Small brand/profile elements need deliberate contrast, not just
    placement.** The same screenshot showed a small (84px) circular profile
    picture that was hard to make out at a glance — it sat close in tone to
    a large pale illustration behind it, so the border/edge that should
    separate it from the background didn't read clearly at real playback
    size/compression (a render viewed as a still frame during development
    looks crisper than the same frame does after Instagram's own
    video-compression pass and at actual on-screen size). When placing a
    profile picture or small brand mark: keep it clear of the top exclusion
    zone above, give it a border/shadow with enough contrast to separate it
    from *any* background content behind it (not just the background it
    happened to be checked against during development), and prefer
    checking it at roughly its real on-screen size rather than only in a
    full-frame screenshot, where small details are easy to misjudge as
    "clear enough."
  - Not yet encoded as an enforced layout primitive (e.g. a CSS
    `.safe-zone` class with `pointer-events`/visual guide, or a lint check
    in `build.mjs`) — until it is, treat this as a manual checklist item on
    every scene: before finalizing a scene's layout, ask "would this element
    survive Instagram's own UI drawn on top of the top ~8%, bottom ~20%,
    and right ~15%, and is every small/brand element still legible at real
    on-screen size against whatever's behind it?" If a future reel keeps
    tripping on this, add that enforced primitive rather than continuing to
    eyeball it.
- **The gap between a headline/step-head band and the content block below
  it is a hard, non-negotiable fill requirement — not a place for a
  decorative glyph.** Confirmed by hand-annotated screenshots (red
  scribbles marking the exact dead zone) across six scenes of the Loop
  Method reel — a single small caret character (`▾`) sitting in that gap
  still reads as empty space, even though technically non-blank. The fix
  that actually worked: a **signal bridge** component —
  `reel-openai-loop-method/build.mjs`'s `.signal-bridge` (`.sig-wire` +
  `.sig-pulse` + `.sig-readout` + `.sig-cursor`, driven by the `sigBridge()`
  JS helper) — a short vertical "data wire" with a traveling glow pulse,
  feeding into a **terminal-style typewriter line that is specific to that
  scene's content** (e.g. `> spinning up 3 reviewer roles...` on the
  review-panel step, `> saving prompt as "loop-method.v1"...` on the save
  step), with a steady blinking cursor once typing finishes. This is the
  pattern to reuse (adapted to each reel's own visual system/theme, not
  copy-pasted verbatim) any time a band-tight-header-then-content layout
  leaves a gap:
  - **It must be content-aware, not generic filler.** Every line is written
    for the specific scene it sits in — restating or extending what that
    scene is about — never a stock phrase reused across scenes. A reader
    should be able to tell which scene they're on from the readout line
    alone.
  - **It must be a real, deliberately-designed component, not a background
    watermark icon.** A large, low-opacity ghost icon behind the content
    was tried earlier in this same reel and was explicitly rejected as
    "cheap" — see the git history around that fix. The bar is: does this
    look like it was designed on purpose for this exact spot, or does it
    look like padding? If it's the latter, it doesn't satisfy this rule.
  - **It must still be `t`-driven and deterministic** — a real wire pulse,
    typewriter character reveal, and cursor blink computed from local
    scene time (see `sigBridge()`), never a real-time CSS animation.
  - Apply this to *every* scene that has a distinct header band followed by
    a content band with a visible gap between them — which in practice has
    been most step/beat scenes in every reel built so far. A scene whose
    content already fills that gap on its own (e.g. a big hero visual
    starting right under the headline) doesn't need it.

Verify visually, don't just trust the code: use Playwright to screenshot the
page at several representative `t` values while iterating (`page.evaluate(t
=> window.__seek(t), someT)` then `page.screenshot(...)`), and actually look
at the images. Several bugs in this repo's history (icon overflow, invisible
logo marks, over-large empty bands) were only caught this way, not by
reading the generated CSS/markup.

## Typography house style

- **Fonts must be vendored, not assumed present, and never system fonts
  described as if a real font ("Poppins" etc.) is being used.** Chromium
  headless has no reason to have any particular font installed — an
  unavailable `font-family` silently falls back to whatever generic sans
  the container happens to have, and every reel through `reel-anthropic-*`
  did exactly this for months without anyone noticing (checked with
  `fc-list` — Poppins was never actually installed; the rendered output
  was a fallback font that merely looked close enough not to be flagged).
  **Vendoring pattern** (used for Poppins/Inter/JetBrains Mono/Space
  Grotesk, all in `assets/fonts/<family>/`): install the `@fontsource/*`
  npm package with `bun add --no-save @fontsource/<name>` (OFL-licensed,
  ships real `.woff2` files per weight), copy only the specific weight(s)
  actually used out of `node_modules/@fontsource/<name>/files/` into
  `assets/fonts/<name>/`, then `bun remove @fontsource/<name>` — the repo
  keeps the extracted font files, not the npm dependency. Reference them with
  `@font-face` + a relative `url('../assets/fonts/<name>/<file>.woff2')` in
  the reel's `<style>`, with `font-display: block` (so a frame captured
  before the font loads doesn't silently fall back and desync from later
  frames that did load it in time). Update `assets/fonts/LICENSE-OFL.txt`
  with each new family.
- **Pick a display font that suits each reel's own visual identity — don't
  reflexively reuse the last reel's font.** `reel-anthropic-rundown-ios`
  uses Poppins; `reel-openai-loop-method` switched to **Space Grotesk**
  after feedback that fonts should be "bigger and more fun" — a display
  font with more character/personality than a plain geometric sans, while
  staying legible at reel sizes. Every reel should still pair a display
  font (headlines/stats, weight 700+) with a neutral body font (Inter,
  body/sub/caption text) and, if the reel's theme calls for it, a
  monospace family for labels/tags/terminal-style text (JetBrains Mono in
  the Terminal/Signal system) — but *which* display font is a per-reel
  design decision, part of "every reel needs its own visual identity"
  above.
- **Never pure `#fff` for headline/body text.** Use a slightly tinted
  off-white instead (e.g. `#f1f3f8`/`#eef8fb`, or Tailwind's
  `slate-50`/`slate-200` range). This matters *specifically* in this repo
  because every scene's text sits directly on top of a moving textured
  background, and pure white against any moving background visually
  "vibrates."
- **Give headline/body text a soft text-shadow when it sits over the
  textured background or any illustration**, not just a flat color:
  `text-shadow: 0 4px 12px rgba(0,0,0,.5), 0 1px 3px rgba(0,0,0,.8);` A
  large soft shadow, not a harsh 1px drop shadow. This is the single
  highest-value fix for legibility given every scene in this repo overlays
  text on moving texture.
  - **Gotcha**: `text-shadow` is inherited by child elements. A gradient-text
    span (`background: linear-gradient(...); background-clip: text; color:
    transparent;`) inside a headline that has its own `text-shadow` will
    inherit that shadow — and since the fill is transparent, the *shadow*
    becomes the only visible thing, rendering as a solid dark silhouette
    instead of the intended gradient. This actually happened in
    `reel-openai-loop-method`'s first build. Fix: explicitly set
    `text-shadow: none` on the gradient-text span, and use `filter:
    drop-shadow(...)` on that span instead if it still needs a glow (unlike
    `text-shadow`, `drop-shadow` works correctly on a transparent-fill
    clipped-background element).
- **Letter-spacing scale**, keyed off font size, not one fixed value
  everywhere:
  - Large headlines (~60-90px): `-0.02em` to `-0.04em` (i.e. roughly
    -1.5px to -3px at 74px — the current `.headline`'s `-0.5px` is too
    weak to read as intentional tightening).
  - Body/sub text: default (`0`), don't tighten.
  - Small uppercase labels/eyebrows (`STAT-LABEL`, chip badges like
    `ERROR`/`FIXED`): `0.1em`-`0.2em` positive tracking + `font-weight:
    500-600`. The existing `.stat-label` (`1.5px` at 28px ≈ 0.05em) is in
    the right direction but could go a bit further.
- **Line-height**: tight (`1.1`-`1.2`) for headlines, loose (`1.5`-`1.6`)
  for any longer body/paragraph text. Current `.headline` (`1.15`) and
  `.sub` (`1.32`) are close to right already — the sub could loosen
  slightly if a scene ever needs 3+ lines of body copy.
- **Gradient text** (`background: linear-gradient(...); background-clip:
  text; color: transparent;`) is a good option for a single hero
  stat/headline per reel (e.g. a big number or the reel's core claim) to
  give it a "premium" metallic feel — don't overuse it, one gradient
  moment per reel reads as a highlight; gradient on every headline reads
  as noise.
- Apply all of the above starting with the next reel built from scratch;
  retrofitting an already-shipped reel is optional and only worth it if
  that reel is getting re-rendered anyway for another reason.

## Directory sources & the module-script/CORS gotcha

`reel-app/` is a React + Vite proof-of-concept validating that the same
`window.__seek` contract works when the DOM is built once by React and then
mutated imperatively per-frame (React should **not** re-render on every
`__seek` call — see `reel-app/src/Reel.jsx`: refs are set up once in a
mount-only `useEffect`, and `__seek` does direct `ref.current.style.x = ...`
mutation, never `setState`). Because Vite's build output uses `type="module"`
scripts, `reel-app/dist/` must be rendered via `scripts/render.mjs`'s
directory-source path (local HTTP server), not `file://` — see "Source
resolution" above.

## Assets (`assets/`)

A curated pull from several open-source repos (icons, illustrations, brand
logos, photos, CSS/SMIL animation packs). Full per-source license table and
provenance in `assets/ATTRIBUTION.md` — **read it before**:

- Using a brand/company logo in a new reel (trademark/nominative-use notes —
  using a logo to *identify* a real product is fine, implying endorsement or
  redistributing it as your own asset is not; `assets/logos/svg-logos/` in
  particular carries no license grant at all and is for
  reference/identification only).
- Wiring up anything under `assets/animations/` (all real-time-clock by
  default — see the seeking technique above; required, not optional, for
  correctness under this repo's render pipeline).
- Adding a font or a character pose — see "Typography house style" and
  "Character variety (humaaans)" above for the vendoring patterns
  (`bun add --no-save`, extract, `bun remove`) used for
  `assets/fonts/` and `assets/illustrations/humaaans-react/`. The same
  pattern applies to any future third-party npm-distributed asset: vendor
  the extracted files into `assets/`, not the npm dependency itself.

**`assets/photos/servicestack/`** — 147 real Unsplash-sourced JPEGs
(2560x1000, ~30MB total), no attribution required. Unlike everything
else built so far, no reel has actually used a real photo yet — every
reel's visual identity has been abstract CSS/SVG-driven texture (dot-grid,
graph-grid, ticker-tape, ripples, price-staircase). A photo is trivially
compatible with the render contract (it's just a static
`background-image`, nothing to seek), but using one as a scene's hero
background is a *design* decision, not a mechanical one — pick a photo
whose subject/mood actually fits that reel's topic (architecture for a
hardware story, macro/texture for an abstract concept, etc.), not a
generic "photo behind text" filler, and keep the same off-white
text/soft-shadow/contrast rules from "Typography house style" for
anything overlaid on it. If a reel needs a specific photo not covered by
this set, don't fetch one ad hoc — check `assets/ATTRIBUTION.md`'s
"Real-photo sourcing repos evaluated" note first, since most obvious-
looking "bulk photo dataset" repos on GitHub turn out to be metadata-only
or link-lists, not actual files.

## Git / workflow conventions observed in this repo

- Every reel-generation session works on a dedicated branch
  (`claude/reel-generation-*`), commits after each meaningful milestone
  (build script change → regenerate → re-render → commit), and pushes
  regularly rather than batching everything into one commit.
- Rendered `.mp4` files **are** committed to the repo (not gitignored) —
  only `node_modules/` and `*.log` are ignored (see root `.gitignore`).
  Given MP4s can be tens of MB, avoid keeping multiple redundant large
  renders of the same reel around once a final version is settled — delete
  superseded uncompressed/oversized renders rather than accumulating them.
- Commit messages should be descriptive of *why*, not just *what* (e.g. "Fix
  Notion logo recolor stripping its background square" rather than "update
  build.mjs").
- Design-approval mockup files (a throwaway `mockup.mjs` + static HTML used
  to get sign-off on a new visual system before the full build — see
  "Every reel needs its own visual identity" above) should be deleted once
  the full `build.mjs`/`reel.html` supersedes them — don't leave stale
  mockups committed alongside the finished reel.
- **Standard deliverable set for a finished reel**, beyond the rendered
  MP4 itself: an elaborate Instagram caption (restating each scene's
  content in prose, not just a one-liner), a hashtag set (~25-30 tags,
  mixing broad and niche), and a purpose-built cover image (see "Cover
  images" above — never a frame grab). Produce these once a reel's design
  is finalized, not before — captions/hashtags reference the reel's actual
  final script, and the cover reuses the reel's finalized palette.

## Known platform limits worth knowing about

- File-delivery tooling in this environment (`SendUserFile`) has a **30 MiB
  upload limit**. A CRF-18 Full HD 60s render can exceed this (~34MB
  observed on the brighter navy dot-grid reel). If so, re-encode at a
  higher CRF (see "Encoding" above) rather than reducing
  resolution/framerate, and mention to the user that a slightly more
  compressed version was sent for that reason.
- **A darker, lower-contrast color palette compresses to a meaningfully
  smaller file at the same CRF than a brighter one.** The near-black
  cyan/magenta "Terminal/Signal" reel rendered at ~14-17MB at identical
  settings (CRF 18, same resolution/duration/framerate) where the brighter
  navy/dot-grid reel needed ~34MB and a CRF bump to fit the 30MB limit —
  worth factoring in when picking a new reel's background brightness if
  staying under the delivery limit without an extra re-encode pass
  matters.

## Landscape long-form benchmark — `video-ai-bubble-v2/` (16:9, 1920×1080@60, ~7 min)

The user called this "better than the previous one" and set it as the bar the next landscape video must **top in every aspect** (script, visuals, motion, audio, polish). v1 (`video-ai-bubble-machine/`, flat sticker graphics, 12 chapters, ~12 min) was rejected for: slow/low-quality animation, not engaging, too long, no real-world imagery, nothing ultra-realistic. Don't regress to that style.

**Recipe that worked (reuse, then improve):**
- Script: beat-level (87 beats / 28 scenes, ~1000 words), hook in the first 10 s, open loops, a mid-video twist, "what to watch" close. Every scene anchored to hard numbers; the sourced fact table lives in the v1 `facts.md`.
- Imagery: local photoreal generation (`imggen.py`, RealVisXL V5 Lightning bf16, 1344×768, ~70–100 s/image on 4 CPUs) → `depthgen.py` (Depth-Anything-V2-Small) → WebGL depth-parallax shader with camera moves, whip-pan transitions, grade/vignette/grain, dust motes (`site/engine.js`). Stock-photo hosts are blocked from this sandbox; Figma Weave (hosted generative models) is an untried route that needs the user to link it and approve credits.
- Overlay graphics: `site/comps.js` component set (num, bars, cols, ring, gauge, graph with traveling coins, ledger, dominoes, cells, timeline, list, quote, stamp, chips, card), all pure functions of `t`; scenes are declared in `timeline.mjs` with times relative to voice beats/words ("b2", "w1.4"), resolved by `build.mjs` from `timing.json`.
- Audio: Kokoro `af_heart` voice with word timestamps (`tts2.py`), numpy-synth music + SFX derived from the layer events, sidechain-ducked and loudnormed (`sfx.py`). Captions are word-highlighted from the same timings.
- Render: `render-slices.sh` — 8 time slices via `REEL_START/REEL_END`, 4 in parallel, ~45 min total, concat + mux. `scripts/render.mjs` now streams frames into ffmpeg (no PNG spool).

**Pitfalls hit (don't repeat):**
- Spooling PNG frames for 4 parallel long slices exhausted the disk allowance (silent `write` failures) — keep the ffmpeg pipe.
- `pkill -f`/`pgrep -f` with the pattern in the same command line kills/matches the invoking shell (exit 144). Wait on PIDs instead.
- Absolute-positioned overlay stacks must be sized from real heights (two meters overlapped; timeline labels sat on the line). Screenshot every distinct layout, not just one frame per scene, before launching a 45-minute render.
- Generated people can carry artifacts (a bunny-suit shot had rabbit ears) — prefer people-free prompts or check every image.
- Master at CRF 17 with film grain is ~2 GB; deliver a CRF-28 share encode (~51 MB, fits GitHub) and a ≤30 MiB preview for chat.

**Known headroom to beat next time:** more genuinely real/photographic imagery, higher-fidelity voice than Kokoro (richer prosody), fewer repeated overlay chip/card forms, stronger per-scene bespoke visuals, sharper thumbnail, and a pre-render automated layout-overlap check.

## Reel feedback log — `reel-openai-agents-escaped` ("decent output"); applies to every reel from now on

Benchmark order of precedence: **each new reel must beat the previous reel in every aspect** (script, visuals, motion, voice, audio, CTA, polish). When starting a reel, list the previous reel's weaknesses below and fix all of them before adding anything new.

1. **Captions must never collide with foreground content or busy background detail.** The word-highlight caption block sits at y≈1330–1490; graphics ended at ~1250–1300 and some (scanner, quote, folders) ran into it, and captions also sat over bright rack/LED texture. Rules: reserve the caption band as a no-go zone in layout (content ≤ y 1270 for 1–2 caption lines, ≤ 1220 for 3), give captions a dark scrim/pill behind them (not just a text-shadow), keep to ≤2 lines (shorten beats or reduce font) and run an automated check that no layer's bounding box intersects the caption box at any sampled time (extend the planned pre-render overlap checker).
2. **The end CTA must be unmistakable and branded.** Last scene needs: the creator's profile picture (`reel-app/public/profile.jpg`, circular, high-contrast ring, ≥200px) + handle **@sandesh.explains** (large, readable) + a clear single action ("Follow for the follow-up"), held on screen ≥2.5 s with the voiceover saying the ask. A question stamp alone ("Would you?") is not a CTA. Keep it inside the safe zone (above y 1536, inside x 150–918).
3. **Use far more foreground imagery, animation and components.** Every scene should layer: photoreal cut-outs/inset photos or screenshots-style panels, brand logos (`assets/logos`, nominative use), icons (tabler), characters/hands/devices where useful, animated charts/maps/flows, particles, and kinetic type — not one panel over a dim background. Target ≥4 distinct foreground elements per scene, with continuous motion (parallax inset photos, travelling lines, counters, tickers). Backgrounds must stay secondary.
4. **Voice-over must be more nuanced and natural.** Kokoro `af_heart` reads flat/uniform. Next reel: (a) write the script for the ear (contractions, rhythm, emphasis, short punchy sentences, questions), (b) add SSML-like control via per-phrase speed/pauses and varied sentence splitting in `tts.py`, (c) evaluate better engines available offline (OmniVoice is cached in the HF hub dir; try its expressive/emotion controls, plus other Kokoro voices) with A/B takes of the hook line, and pick by listening to spectral/prosody variation, (d) add breaths/micro-pauses and slight pitch/speed variation on key numbers, (e) consider mixing in room tone. Don't ship the default flat read.
5. **Always top the previous reel's benchmark** — see the log above; this list is cumulative.


## Reel benchmark — `reel-google-suncatcher` ("Orbital Mission Plot")

Latest vertical benchmark (96 s, 1080×1920@60, indigo/magenta/mint, Syne + Space Mono). What to keep and what to beat:
- **Kept**: timeline DSL (`timeline.mjs` + `build.mjs`), sentence-level Kokoro `am_michael` voice, `check.mjs` layout lint (0 issues), 5 time slices via `render-slices.sh`, purpose-built `cover-build.mjs` cover, CTA with profile photo + @sandesh.explains + FOLLOW held ≥3 s.
- **Photos are AI-generated** (RealVisXL) — every `photo` component carries a visible "AI IMAGE" tag and the caption says so. Never caption a generated image as if it were real footage.
- **Image-gen speed**: ~11–15 min/img at 640×1152 on a cold host, ~3–4 min at ≤576 px with 5 steps. Generate small prints at small sizes from the start; kill+restart the generator to change sizes (it skips existing files).
- **Pitfall**: Syne 800 is very wide — size headlines for ≤768 px (the lint catches overflows); a bad Python patch once wiped `mockup.mjs` (patch a copy / use git before scripted rewrites).
- **Known headroom**: runtime 96 s (aim ≤80 by cutting script to ~170 words), mid-scene frames still sparse before layers enter (bring key layers in within ~1 s of scene start), no real footage/screens.


## Reel benchmark — `reel-ai-cheats-starcraft` ("Retro RTS Console", 52 s)

Built from the user's pointers: lower the 3-second skip rate, more natural voice, varied music, proper SFX.
- **3-second hook**: voice starts at 0.00 s (`LEAD=0`, leading silence trimmed in `tts.py`), frame 0 is already fully composed (stamp, arena, a terminal line typed), captions visible at t=0, no scene transition before 3 s, payoff (download bar fills, slot swap) lands by ~3.5 s.
- **Voice**: sentence-level Kokoro `am_michael`, spoken fillers (`um,` / `uh,`) get their own slower/softer clips with small breaths (`synth_s` in `tts.py`); keep fillers out of the hook. `5.5` is spoken "5 5" — `build.mjs` `fixW` merges it back for captions.
- **Music**: `sfx.py` now composes five cues that switch by scene (urgent chip alert → briefing groove → suspense → reflective bells → bright outro) with 0.9 s crossfades, plus ~15 event-driven SFX (stamp+glitch, typing, download climb, swap, hop, buzz, rewind, jump, alarm, 1UP). Verified distinct tempo/brightness per cue with librosa. Reuse the cue system, change the genres per reel.
- **Pitfalls**: `note(kind, m, dur, ...)` — don't name a duration `d` (collides with the ADSR decay kwarg). `ln -sfn` onto an existing dir makes a nested link. A scripted rewrite once wiped a file — commit first.
- **Headroom**: only ~20 s of the scene content moves independently of the voice; consider more ambient motion (blinking cursor, idle sprites already) in sparse beats, and real footage if ever available.


## Standing feedback (Oct 2026) — voice pace, fillers, GIF variety

- **Voice pace**: the 52 s StarCraft reel (Kokoro base speed 1.3) was "too fast to understand". Use **base ≈ 1.05–1.12** (slightly slower, not slow); keep the hook sentence only a touch faster than the rest. Re-check word timestamps so the hook payoff still lands near 3 s by shortening the hook text, not by speeding it up.
- **Fillers**: separate "um"/"uh" clips sounded unnatural. Don't insert synthetic fillers as separate clips; prefer natural phrasing, commas and short pauses (or at most one inline hesitation as part of the same take with an ellipsis). Don't regenerate shipped reels for this; apply it to new ones.
- **Every new reel must top the benchmark set by previous reels** (see the benchmark sections above).
- **GIFs**: every new GIF must differ from the previous GIF in **orientation (alternate horizontal/vertical), visual style, format/layout and palette**. Previous GIFs: `gif-agentic-graphrag` (horizontal 1600x900, dark forest-green + lime/sky/coral/amber, SVG blueprint flow diagram with numbered connectors); `gif-ai-work-treadmill` (vertical 4:5, pop-art yellow/blue/pink, humaaans runner on a treadmill + burst stat badges); `gif-agent-security` (horizontal 16:9, light isometric layered-architecture diagram, indigo/blue/teal/slate with emerald/rose/amber signals, Plus Jakarta Sans — the "professional LinkedIn architecture" register the user preferred for LinkedIn; pop-art is fine for Instagram-style, not LinkedIn); `gif-mcp-stateless` (vertical 4:5 1080×1350, dark charcoal + postal red/airmail blue/kraft + reply green, Bricolage Grotesque 800 + Inter + JetBrains Mono; sorting-hub metaphor for MCP's stateless spec, 8 letters in flight + gateway + 4 servers + off-ramp clock + SDK equalizer + ticker — next GIF should be horizontal and use a new palette); `gif-agent-metro` (horizontal 1600×900, dark midnight-plum transit map, yellow/aqua/lavender ticket classes + coral/orchid/blue lines, Unbounded + Inter + JetBrains Mono, 6 trains + gates + departures board + neighbour networks; **user: static-looking slides are rejected — 'agentic graphrag' (dense, ~25 independently moving parts) is the gold standard; propose wild/abstract metaphors and approve before building**); `gif-agent-front-door/v2` (vertical 4:5 1080×1350, light architecture diagram with extruded cards, navy + orange + teal, Plus Jakarta Sans; user rejected the cartoon facade `facade-v1` and asked for the diagram register of the two earlier LinkedIn GIFs — next GIF should be horizontal and use a new palette). A first vertical attempt (cream/navy/coral bar-chart infographic) was rejected as "just a text slide": **a GIF must lead with a visual metaphor/illustration (character, object, scene), keep text to a short headline + number badges, and be bold/catchy** — not a text-and-chart slide. Humaaans extraction for SVG scenes: `gif-ai-work-treadmill/hum.mjs` (`humaaansFull`).

- **LinkedIn GIF/post visuals — approved style and a standing layout rule** (user approved `gif-agent-security`): professional, architecture-oriented, light, clean. For every future LinkedIn visual: **everything must be legible** (body text ≥ ~18 px at 1600×900 canvas, ≥ ~22 px at 1080-wide; check at the final GIF scale, not just the full-res screenshot), **use the empty space in the frame** (no dead corners or large blank bands; scale up the hero diagram, add purposeful elements such as legends, callouts, stat chips), but **do not over-clutter** (leave breathing room between elements, ≤ ~5 numbered items, one clear focal visual). Check legibility and balance on a downscaled frame before delivering.

## External reference — `MOTION-DESIGNER-NOTES.md`

Distilled lessons from `kaventro/motion-designer` (MIT): beat-grid timing and holds, the reading-time rule (0.5 s + ⅓ s/word), sub-agent reviewers with a 7-axis scoring rubric, determinism checks (seek-order, loop closure, banned APIs), a pure-`t` effects list, motion-blur/deband render knobs, mix-balance targets (voice 16–20 dB over music), and a sound-brief method. Skim it before planning a reel's timing, QA or audio; items are *not* implemented unless the note says DONE.

## External reference — `ANIMATION-RESOURCES-NOTES.md`

Verified evaluation of a user-supplied character-animation/mocap repo list (CMU BVH, Bandai Namco, Ready Player Me, FreeMoCap, EasyMocap, AI4Animation, CC0 lists): which are **licence-safe for this monetised channel** (CMU, CC0 packs), which are **non-commercial/RPM-only traps** (Bandai Namco, AI4Animation, Ready Player Me), and a plan for driving 2D/2.5D rigs from BVH as a pure function of `t`. Read it before pulling in any third-party motion data. Not implemented yet.

## STANDING RULE — strict visual validation before shipping any reel (user instruction, Oct 2026)

`reel-ai-rich-upsell` shipped with several components overlapping (chips colliding with each other, a tag on top of
email text, a chips row past the safe zone) even though `check.mjs` printed "0 issues". The lint was too lenient. From now on
**a reel is not shipped, and no MP4 is sent to the user, until all of this has been done and passes**:

1. `bun scripts/visual-validate.mjs <reel>/site 0.25` → **0 unexplained findings**. It has no type exemptions, checks
   collisions *inside* layers (chip×chip, tag×text), text overflow/clipping, the 150–918 safe zone and caption hits, and starts
   0.6 s after each layer's entrance. Every remaining finding must be a deliberate overlay (e.g. a stamp on a ticket) and be
   named as such in the reel's notes; anything else gets fixed and re-validated.
2. Also run the reel's own `check.mjs` (keep both; neither replaces the other).
3. **Look at the pixels, not just the numbers:** contact sheets of every scene at ≥3 times (entrance +0.7 s, mid, just before
   exit) plus every scene transition, viewed at full size, then at ~360 px wide (phone feed). Better: spawn reviewer sub-agents
   with the 7-axis rubric from `MOTION-DESIGNER-NOTES.md` and ship only when every score ≥ 8 and every report says `clean`.
4. Layouts must be sized from real measured heights/widths (flex-wrap rows of chips need their widths checked; animated
   scale transforms must not make neighbours collide). Re-run 1–3 after **every** fix and after any re-render of a slice.
5. State in the delivery message what was validated and the result; if anything was knowingly left, say so explicitly.
Reminder: when a lint is "clean" but a human sees overlap, fix the lint first (add the missing check), then the reel.

## Reel benchmark — `reel-ai-chat-not-diary` ("Glass Diary by Lamplight", 75 s)

Latest vertical benchmark (Oct 2026): umber night + amber lamplight + ice-glass panels + wax-seal crimson; Sora 800 + Fraunces italic (diary ink) + Inter + JetBrains Mono. Sensitive-news handling is part of the benchmark:
- **Unnamed private individual, "alleged / charged, not convicted" language throughout, redaction bars instead of the threat text, balanced closing question.** The script discloses that the story involves the model's own maker and stays strictly on attributed reporting; every figure has a tier (A multi-outlet / B single outlet / C not to say) in `script.md`.
- **Mid-scene density fix:** key layers arrive in the first 0.3–0.7 s of each scene (heads/shells independent of the voice), so no frame is blank while waiting for a word; voice-synced items (stamps, rows) land on their words.
- **Pitfalls hit:** `el(tag,cls,html,st)` argument order silently dropped icons (extra arg ignored); layer `t1` is the layer's *end* time (don't reuse it as a component param); `hl` can't be both a head-word flag and a time key; `text-shadow` on the head swallowed the gradient accent (set `text-shadow:none` on `.hl`); transforms applied before an entrance starts inflate bounding boxes in the validators (apply only when `u>=0`); `pkill -f render` kills your own shell — kill PIDs.
- **Validated:** `visual-validate.mjs` 0 findings, `check.mjs` 0 issues, contact sheets at full size and ~360 px, 25 final-video frames incl. all transitions.
- **Headroom:** no photography or real footage (abstract glass/diary objects only), still ~6 distinct component families; next reel should try a bright/light palette (the dark lamp look is now used here and in earlier covers).

## Reel benchmark — `reel-robot-cartwheel` ("Studio Slate", 65 s, mocap-driven rig)

Bright slate/yellow/pink; Outfit 800 + Inter + Space Mono; cover in Anton on yellow. **New mechanic:** `bvh2json.mjs` turns CMU BVH clips into 2D joint tracks (`site/mocap.js`), `site/rig.js` draws one 12-joint rig in two skins (human mocap suit / robot / ghost outline) sampled as a pure function of `t` (loop-cropped walk/run, `damp` for the stiff-controller look, `rotate`/`shift` for authored flips and slips). Scenes are plain DOM pages in `site/app.js` (no layer DSL): every scene has independently moving figures, not number cards.
- Lint: `check.mjs` (page-child overlaps, safe zone, caption hits, text overflow, figure-clipped-by-stage) — 0 issues at 0.125 s. `scripts/visual-validate.mjs` assumes `#fx > .c` layers and is vacuous for this reel; use `check.mjs` + contact sheets instead.
- Pitfalls: ground lines/shadows must live in the Stage background (unscaled), not inside the scaled figure group; ghost outline drawn *over* the robot or it hides; hard-cut page swap (no crossfade — overprinted text looked broken); caption picker must prefer the latest chunk; mocap clips are ≤4 s, so loop/clamp deliberately.
- Credit line "mocap.cs.cmu.edu … NSF EIA-0196217" is in `caption.md`; figures are labelled "ILLUSTRATION · NOT THE ROBOT'S FOOTAGE".
- Headroom: no real footage; scene-start frames are still airy for ~0.2 s; music reuses the synth cue system with new genres.

## Reel benchmark — `reel-apple-camera-no-video` ("Dollhouse Cutaway", 69 s, talking host + paper puppets)

Warm cream/terracotta/teal/butter paper-cut look; Bricolage Grotesque 800 + Inter + Space Mono; cover in Anton. **New mechanics:** (1) `site/puppet.js` — layered, clothed paper-puppet characters (shaped torso, mitten hands, hair/ears/glasses, head-turn, bun/pompom secondary motion) placed on CMU mocap joints via two-point transforms; far limbs darker; `bust`/`front` options for a frontal host. (2) **Rhubarb lip-sync** (MIT, run offline on `audio/voice16.wav` with `-d dialog.txt`) → `site/mouth.js` cues → `K.viseme(t)` drives Pip's 9 mouth shapes; deterministic blink. (3) Fixed layout so the story scans: cutaway room on top, host bottom-left, sticky-note corkboard bottom-right (notes in 4 fixed slots, ≤2 lines).
- Lint: `check.mjs` (page-child overlaps, safe zone, caption hits, text overflow, figure clipping, **note-out-of-pad / note-overlap**) — 0 issues at 0.125 s. `scripts/visual-validate.mjs` is vacuous here (no `#fx` layers). Reviewed contact sheets (every scene at +0.8 s/mid/end−0.4 s) and 12 frames of the final MP4; audio mix not auditioned.
- Pitfalls: `PUP.svg` face param must be continuous (-1..1) for head turns; foot-locked walking = clip time from screen x (`walkAt`); `rig.sample` loop needs `Math.max(0,…)` after the cycle subtraction (float edge crashed a render); note slots beat free placement; 3D (bpy) is not renderable at video scale on this CPU box (see ANIMATION-RESOURCES-NOTES.md round 3).
- Headroom: bodies are side-projected mocap (no torso turns); passing characters overlap in 2D; no real footage.

- **Update (Oct 2026): host = the creator's own photo, lip-synced.** `reel-apple-camera-no-video/site/photohost.js` animates `profile.jpg` (1408²) as a *photo puppet*: Rhubarb cues → a feathered jaw patch drops (D/C/E/F/G/H/B shapes blend over 70 ms) over a painted dark mouth cavity with teeth/tongue, plus head sway/bob from the cues; Pip (the cartoon host) was removed. Per-window instances (`win.__ph`), crop window 960×1030 source px. Blink overlay was tried and dropped (eyelid blobs over glasses looked bad). Heavier tools (SadTalker, Wav2Lip, LivePortrait) need GPU + large checkpoints and several carry non-commercial terms — not used.

- **Update 2 (Oct 2026): host mouth = MLS-warped viseme images.** `reel-apple-camera-no-video/tools/mls_visemes.py` pre-warps the photo's lower face for the 9 Rhubarb shapes with Moving-Least-Squares (affine) control points (jaw/chin/lower-lip follow the drop, corners pinned, painted dark mouth + teeth/tongue), writes `site/vis/v_*.png`; `site/photohost.js` cross-fades prev→cur viseme (70 ms) under a feathered mask. Replaced the earlier jaw-patch translation (visible seam/ghosting). Natural-looking, but a deformation of a still: real talking-head quality still needs a GPU model (HF ZeroGPU token or a paid API).

- **Update 3 (Oct 2026): host = MoDA talking-head video (hosted, GPU).** The MLS warp was replaced by real model output: `multimodalart/MoDA-fast-talking-head` (HF Space via `gradio_client`, `/generate_motion`, needs a user-supplied HF token passed as an env var — never written to a file or commit) run on `profile.jpg` (512² crop) + the voice-over split at silences into 7 chunks (~10 s each, ~15 s generation per chunk). Chunks are snapped to the 25 fps grid, stitched, and encoded to `site/host.webm` (VP9; headless Chromium can't decode H.264). `site/hostvideo.js` seeks the visible scene's `<video>` to `(frame+.5)/25` on `seeked`; `app.js` `seek()` now returns a Promise. `photohost.js`/`tools/mls_visemes.py` stay as the CPU fallback. Result looks natural (real jaw/cheek/head motion); chunk joins are not visible because cuts fall in pauses.
  - **Pitfall (video seeking in renders):** the first MoDA render shipped with a *frozen* host: page screenshots over `file://` showed motion, but `scripts/render.mjs` serves directory sources over HTTP and `static-server.mjs` had no `Range` support or `.webm` MIME, so `<video>.currentTime` changes never produced new frames. Fixed in `static-server.mjs` (206 range responses, `video/webm`), and `hostvideo.js` copies each seeked frame into a `<canvas>`. **Always verify a video-driven element on the final MP4** (frame-diff of the host crop at several times, `mean diff` ≈ 2 when moving, ≈ 0 when frozen), not only on a `file://` screenshot.
