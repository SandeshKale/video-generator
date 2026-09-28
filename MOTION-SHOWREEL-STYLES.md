# Motion-showreel style catalog

A reserve of abstract motion-graphics styles for intro stings / full
"showreel" reels, in the family proven out by
`reel-motion-showreel-demo/` (approved as a feasibility demo — see that
folder's `build.mjs` for the reference implementation of shot 1-4:
starburst, morphing-shape-with-gizmo, wave grid, closing wordmark).

**Purpose**: a lookup table for the *next* time a showreel/sting is
wanted, so the design decision starts from "which of these" instead of
from a blank page. Each entry below is deliberately distinct (per
`CLAUDE.md`'s "every reel needs its own visual identity" rule) and comes
with a concrete build technique already checked against this repo's real
constraint: **everything must be a pure, deterministic function of `t`**
— no live physics sims, no WebGL, no `requestAnimationFrame` loops, no
`Math.random()`. Where a technique below needs "randomness" (jitter,
particle scatter), use a **seeded deterministic pseudo-random function**
(e.g. a small hash of the element's index, not `Math.random()`) so the
same `t` always produces the same frame — see `reel-motion-showreel-demo`
and every reel's background texture for the existing pattern.

Sourced partly from current (2026) motion-design trend coverage
(kinetic typography, glitch-as-transition, isometric/blueprint SaaS
explainers, liquid-glass/mesh-gradient UI, modular editorial collage —
see search summary at the bottom) and partly from direct CSS/SVG
feasibility analysis against this repo's Playwright/ffmpeg pipeline.

---

## 1. Kinetic Typography Sting
**Mood**: punchy, wordmark-forward, works as a 3-5s opener.
**Motif**: one word/phrase per beat, letters individually animated
(stretch, rotate-in, snap into place) rather than the whole line fading.
**Build**: split the phrase into `<span>` per letter/word at build time;
each span gets a GSAP `scrubTl` entrance (`tumbleIn`-style rotate+scale,
staggered by index × a fixed offset) so the whole word assembles as `t`
advances. Letters mid-flight can carry a slight blur (`filter:
blur(Npx)` interpolated with speed, not real motion blur but a passable
substitute) that clears as they land.
**Distinct from what's built**: this repo's existing reels animate whole
headlines as one block; per-letter assembly hasn't been used yet.

## 2. Glitch / Data-Corruption Transition
**Mood**: disruption, "something broke/changed," good for a "leak" or
"breaking" hook.
**Motif**: RGB channel splitting + horizontal scanline tearing, used as
a *transition* between two states rather than a constant background.
**Build**: three stacked copies of the same text/shape, each offset a
few px in a different direction with `mix-blend-mode: screen` and a
color filter (red/green/blue), offset amount driven by a deterministic
noise function of `t` (e.g. `Math.sin(t*97.3)*Math.sin(t*13.7)`, a cheap
non-repeating-looking but fully deterministic wiggle — never
`Math.random()`). Scanline tearing: a handful of horizontal bands via
`clip-path: inset(...)` with each band's x-offset likewise a function of
`t` and its own index-seeded phase.
**Caution**: keep it to short transition bursts (under ~0.3s of virtual
time) — held glitch reads as broken video, not a style choice, same
"keep transitions subtle" lesson as the TRANS crossfade rule.

## 3. Isometric Blueprint / Technical Schematic
**Mood**: precise, engineering/infrastructure, good for "how it's built"
or hardware-adjacent topics.
**Motif**: thin cyan/white lines on navy, isometric-tilted panels,
dimension-line callouts, a grid that reads like CAD software.
**Build**: `transform: rotateX(55deg) rotateY(0) rotateZ(45deg)` (fixed
camera angle, no orbit) on a container to fake isometric perspective for
flat panels/icons; blueprint grid via the same `repeating-linear-
gradient` technique already used for every reel's background grid, just
recolored; "drawing on" a line/shape via `stroke-dasharray` +
`stroke-dashoffset` interpolated by `t` (classic SVG line-draw reveal,
fully deterministic).
**Feasibility**: high — this is CSS 3D transforms on flat layers, not
real 3D geometry, so it stays cheap to render and screenshot.

## 4. Liquid Glass / Frosted Orbs
**Mood**: soft, premium, futuristic — good for an AI/"invisible
technology" topic (matches this year's "glass and floating orbs for
data/encryption" trend).
**Motif**: translucent frosted panels (`backdrop-filter: blur()`) over
soft drifting gradient orbs.
**Build**: 2-3 large radial-gradient "orb" divs drifting along
Lissajous-style paths (`x = cx + A*sin(t*f1), y = cy + B*cos(t*f2)`,
same closed-form-drift technique every reel's background glow already
uses) behind a `backdrop-filter: blur(24px)` panel holding the headline.
**Caution**: `backdrop-filter` is Chromium-supported and should
screenshot fine, but hand-verify at least once before committing to a
full build — it's not yet used anywhere in this repo.

## 5. Particle Field (deterministic, not a physics sim)
**Mood**: airy, generative, ambient — a background texture more than a
hero motif on its own.
**Motif**: dozens of small dots/glyphs drifting on independent paths.
**Build**: precompute N particles at build time, each with a random-but-
fixed (seeded by index, computed once, not per-frame) path: e.g.
`x_i(t) = x0_i + r_i*sin(t*speed_i + phase_i)`. This is exactly the
"streamline dot" / "helix glow dot" technique already used in three
reels here, generalized to a full-field background instead of two
gutters. **This is the one legitimate way to get particle-field texture
in this repo** — never reach for tsParticles (see `assets/ATTRIBUTION.md`
for why it was rejected: live physics sim, no seek API).

## 6. Retro Terminal / CRT Boot Sequence
**Mood**: hacker/hardware nostalgia, distinct from `loop-method`'s
modern dark-UI "Terminal/Signal" system — this one leans literal CRT
monitor, not sleek software UI.
**Motif**: green/amber phosphor monospace text typing onto a curved-
screen vignette, horizontal scanline sweep, boot-sequence readouts
counting up.
**Build**: typewriter reveal via `text.slice(0, n)` where `n` is a
function of `t` (already used in every reel's bridge component); CRT
vignette via a radial `box-shadow`/gradient overlay; scanline sweep via
a thin horizontal gradient band whose `top` position is `(t * speed) %
height`; chromatic fringe via the same RGB-offset trick as style 2, held
constant and subtle instead of used as a glitch burst.

## 7. Brutalist / Swiss Grid
**Mood**: raw, confident, editorial — huge type, hard cuts, no easing.
**Motif**: oversized single words filling most of the frame, strict
grid alignment, one accent color on black/white, cuts instead of fades.
**Build**: this is the *easiest* style on this list — it's mostly about
restraint: skip GSAP easing (use `eio`/hard steps instead of
`bounce.out`/`back.out`), skip the TRANS crossfade (hard cuts on
purpose), max out type size within the safe zone. The "effect" is
typographic discipline, not new CSS technique.
**Note**: hard cuts contradict the house "keep transitions subtle"
crossfade rule for *content* reels — reserve this style for a sting/
intro only, not a full 10-scene story reel, unless a future reel's tone
explicitly calls for rawness over polish.

## 8. Modular Editorial Collage
**Mood**: magazine-layout energy, good for a "roundup"/"here's 5 things"
structure.
**Motif**: framed rectangular panels (photos/icons/stat cards) that
slide/stack in from frame edges in a staggered sequence, torn-paper or
hard-cut-corner edges, overlapping at slight rotations.
**Build**: each panel is a normal `.petri`-style card (this repo already
has the card-language and `dropIn`/`runIn` entrance primitives); the new
part is deliberately *overlapping* panels at slight independent
rotations (`rotate(-3deg)`, `rotate(2deg)`, etc., fixed per panel, not
animated) instead of the usual clean vertical stack — a layout change,
not a new animation primitive.

## 9. Mesh Gradient / Chromatic Wash
**Mood**: colorful, Stripe/Linear-style abstract backdrop, works well
behind minimal bold type for a "hero stat" moment.
**Motif**: 3-4 soft, large, overlapping radial gradients in saturated
hues, slowly drifting and color-shifting.
**Build**: same drifting-glow technique as style 4/every reel's existing
background glow blobs, just more of them, more saturated, and covering
the full frame instead of staying subtle/low-opacity. Genuinely just a
"turn the existing glow technique up" style, cheapest to prototype.

## 10. Wireframe Line-Draw Reveal
**Mood**: precise, "it's being constructed live" — good for a product-
build or step-by-step reel.
**Motif**: shapes/icons draw themselves on stroke-by-stroke, like a pen
plotting them in real time.
**Build**: `stroke-dasharray` = path length, `stroke-dashoffset`
interpolated from `pathLength` to `0` as a function of local `t` — the
same SVG line-draw primitive as style 3, applied to icon/logo outlines
rather than blueprint grids. Get each path's real length via
`path.getTotalLength()` at build/runtime (same API already used for the
DNA-helix traveling-dot effect in `reel-anthropic-bio-lab`).

## 11. Ribbon / Flow-Line
**Mood**: fluid, continuous, good for a "journey"/"flow" narrative.
**Motif**: one continuous bezier ribbon twisting and looping through
the frame, occasionally passing near/through text or icons.
**Build**: an SVG `<path>` with a `d` attribute defined as several
keyframe shapes, interpolated by `t` (either hand-written cubic-bezier
lerping between two `d` strings with matching point counts, or GSAP's
MorphSVG-equivalent behavior faked with a manually-computed `d` string
per frame). More build effort than the others on this list — prototype
small before committing to a full reel.

## 12. Depth-Stack Card Flip
**Mood**: "before/after" or step-reveal, tactile.
**Motif**: cards flip/rotate in 3D (`perspective` + `rotateY`) to reveal
new content, stacked with a slight parallax offset.
**Build**: `transform: perspective(1200px) rotateY(Ndeg)` on a card,
`N` driven by eased `t`; back-face content hidden via `backface-
visibility: hidden` on a second absolutely-positioned face rotated
180deg from the front. Standard CSS 3D flip-card technique, deterministic
by construction since it's just a transform value as a function of `t`.

---

## Picking one for a specific reel

- **Sting/intro (3-8s, prepended to a content reel)**: styles 1, 2, 6,
  or 9 read best short and loud.
- **Full showreel (the `reel-motion-showreel-demo` format, 12-20s,
  no narrative content)**: combine 3-4 of these as sequential "shots"
  the way the demo does (identity → morph → rhythm → sign-off) —
  pick shots whose *techniques* don't overlap (e.g. don't pair two
  line-draw styles back to back) so each shot still feels distinct.
- **Full content reel's background language** (replacing dot-grid/
  hatch/scanline/etc. for a brand-new topic reel): styles 3, 4, 5, 9,
  and 10 are the ones built to run *underneath* readable foreground
  content for 60s, not just as a standalone hero moment — the others
  are too visually loud to sit behind body text for a full reel.

Before committing to any of these for a real reel: mock up 2-3
representative frames/shots and get sign-off first, same as every other
reel's visual-identity approval step in `CLAUDE.md`.

## Trend sources consulted (2026)

Kinetic typography, glitch-as-intentional-transition, modular collage,
and liquid-glass/mesh-gradient described above are corroborated by
current motion-design trend writeups: Renderforest's 2026 logo-animation
trends, GarageFarm's 16 animation trends, VideoBolt's 2026 motion
graphics trends, Envato's 11 motion design trends, and ContentBeta's
top motion graphics styles for SaaS (2026) — general industry-trend
summaries, not sources of any code or asset, used only to sanity-check
which directions are current rather than dated.
