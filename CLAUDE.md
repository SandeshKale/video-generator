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
  arg, default `2`) determines the actual pixel output:
  - `2` (default) → 2160×3840, 4K UHD.
  - `1` → 1080×1920, native Full HD.
  - Both are captured at native pixel density — never upscaled.
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

## Cover images

**See `.claude/skills/cover-art/SKILL.md` for the full step-by-step
pattern** (asset reuse, hero-graphic composition ideas, house-style
carryover rules, rendering snippet, and a pre-ship checklist) — invoke it
whenever a reel needs a cover. The summary below is kept for context but
the skill is the authoritative, up-to-date version.

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
