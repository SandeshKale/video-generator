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

## Repository map

```
video-generator/
├── scripts/
│   ├── render.mjs            Generic renderer: node scripts/render.mjs <src> <out.mp4> [scale]
│   └── static-server.mjs     Zero-dep Node http server, used only for directory sources
├── assets/                   Curated third-party icon/illustration/logo/photo/animation library
│   └── ATTRIBUTION.md        License table per source + the animation-seeking caveat above
├── reel-anthropic-opus-5-5/          Reel 1 (template-based, hand-written HTML + profile pic substitution)
├── reel-anthropic-opus-5-5-v2/       Reel 1, v2 (denser)
├── reel-anthropic-rundown-ios/       Reel 2 (programmatically built from build.mjs)
├── reel-app/                         React/Vite POC proving the contract also works from a bundled app
├── package.json                      Root deps: playwright
├── README.md                         User-facing overview and quick start
└── CLAUDE.md                         This file
```

## `scripts/render.mjs`

```
node scripts/render.mjs <source.html|dist-dir> <output.mp4> [scale]
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

### 2. Generated HTML via a Node build script (`reel-anthropic-rundown-ios/build.mjs`)

Used when a reel needs many real icons/logos/illustrations pulled from
`assets/` rather than a handful of hand-copied inline SVGs — keeps the
curated asset folder as the single source of truth instead of risking drift
from copy-pasted SVG markup. **`reel.html` in this folder is a generated
artifact — never hand-edit it.** Edit `build.mjs` and regenerate:

```bash
cd reel-anthropic-rundown-ios && node build.mjs
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
  - `humaaansPart(relPath)` — converts humaaans body-part files (authored as
    React/JSX components with embedded SVG path data) to plain static SVG:
    regex-replaces JSX-cased attributes (`strokeWidth={1}` →
    `stroke-width="1"`, `fillRule="evenodd"` → `fill-rule="evenodd"`) and
    strips the component wrapper.
- **`buildHtml({...})`** — the template-literal function that emits the full
  HTML document: CSS (`<style>`), scene markup (10 scenes), and the
  `<script>` block containing the `SCENES` array and `window.__seek`.
- **Entrance-animation helpers** (defined inside the generated `<script>`,
  all driven by an eased progress value `e ∈ [0,1]` computed from `t`):
  - `dropIn(el, e, dropHeight, rotateDeg)` — bounce-drop entrance
    (`easeOutBounce`), for "falling into place" elements.
  - `tumbleIn(el, e, rotateFromDeg)` — rotate+scale entrance
    (`easeOutBack`), slight overshoot, for a "tumbling in" feel.
  - `runIn(el, e, fromX)` — horizontal slide+tilt entrance (`easeOutCubic`),
    for a "running in from the side" feel.
  - Use these instead of the older generic `enter()` helper when you want
    more kinetic, less uniform motion — mixing all three across a scene's
    elements is what gives the rundown-ios reel its "tumbling, dropping,
    running" character per the brief that shaped it.

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
  - **Bias primary text/content toward the upper-middle third** of the
    remaining safe area — it's the zone Instagram never covers regardless
    of caption length or UI state.
  - Not yet encoded as an enforced layout primitive (e.g. a CSS
    `.safe-zone` class with `pointer-events`/visual guide, or a lint check
    in `build.mjs`) — until it is, treat this as a manual checklist item on
    every scene: before finalizing a scene's layout, ask "would this element
    survive Instagram's own UI drawn on top of the bottom 20% and right
    15%?" If a future reel keeps tripping on this, add that enforced
    primitive rather than continuing to eyeball it.

Verify visually, don't just trust the code: use Playwright to screenshot the
page at several representative `t` values while iterating (`page.evaluate(t
=> window.__seek(t), someT)` then `page.screenshot(...)`), and actually look
at the images. Several bugs in this repo's history (icon overflow, invisible
logo marks, over-large empty bands) were only caught this way, not by
reading the generated CSS/markup.

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

## Known platform limits worth knowing about

- File-delivery tooling in this environment (`SendUserFile`) has a **30 MiB
  upload limit**. A CRF-18 Full HD 60s render can exceed this (~34MB
  observed). If so, re-encode at a higher CRF (see "Encoding" above) rather
  than reducing resolution/framerate, and mention to the user that a
  slightly more compressed version was sent for that reason.
