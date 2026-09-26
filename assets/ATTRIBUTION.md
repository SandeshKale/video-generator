# Asset sources & licenses

Curated assets pulled into this repo for reuse when generating reels. Each
source keeps its own license file alongside its files; check that file
before using an asset commercially if you need certainty beyond the summary
below.

## Included

| Path | Source | License | What was pulled |
|---|---|---|---|
| `icons/tabler/` | [tabler/tabler-icons](https://github.com/tabler/tabler-icons) | MIT | ~180 outline SVG icons curated for reel use (arrows, charts, money, social/media, UI, devices, alerts). Full set has 5,000+; see `LICENSE` in this folder. |
| `icons/feather/` | [feathericons/feather](https://github.com/feathericons/feather) | MIT | Full set (287 SVGs) — the whole set is small and cohesive, so nothing was trimmed. |
| `icons/simple-icons/` | [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons) | CC0 (see `LICENSE.md`) | ~100 brand/logo SVGs for platforms and tools likely to show up in reels (Instagram, LinkedIn, X, YouTube, TikTok, GitHub, OpenAI, Anthropic, Stripe, etc.). Full set has 3,000+ brands. |
| `illustrations/flowbite/` | [themesberg/flowbite-illustrations](https://github.com/themesberg/flowbite-illustrations) | MIT | Full set (107 SVGs, ~3MB) — small enough to keep entirely. |
| `illustrations/bioicons/` | [duerrsimon/bioicons](https://github.com/duerrsimon/bioicons) | Mixed — license varies **per icon**, encoded in the folder name (`cc-0/`, `cc-by-sa-4.0/`, etc.); the repo's own `LICENSE` (MIT) covers only the webapp code, not the icons themselves | A small (~34 icon) sample from the more general-purpose categories (Machine Learning, Computer Hardware, People, General Items, Lab Apparatus). This repo is mostly biology/chemistry-specific and not a great fit for social reels — kept as a token set per the source list. |
| `photos/servicestack/` | [ServiceStack/images](https://github.com/ServiceStack/images) | Sourced from [Unsplash](https://unsplash.com) — free for commercial and personal use, no attribution required | Full set — all 147 hero photos (2560x1000, ~30MB total). Expanded from an initial 30-photo sample once real usage started calling for more topic variety (architecture, nature, abstract/texture, macro) than a small subset could cover. Hand-spot-checked a random sample across categories for watermarks/branding before expanding — none found, consistent with Unsplash's own no-watermark policy. |
| `logos/gilbarbara/` | [gilbarbara/logos](https://github.com/gilbarbara/logos) | CC0 (see `LICENSE.txt`) — **but note:** CC0 covers the SVG *files themselves*; the brand marks depicted are still trademarks of their respective owners | ~137 dev-tooling/cloud/language/SaaS logos (AWS, Azure, GCP, Kubernetes, Docker, React, Python, OpenAI, Anthropic, etc.) curated out of ~1,900 available. |
| `logos/svg-logos/` | [detain/svg-logos](https://github.com/detain/svg-logos) | **No license — mirror of [WorldVectorLogo](https://worldvectorlogo.com)**; logos are trademarks/copyrighted artwork of their owners, use for identification only (see Legal note below) | 69 recognizable tech/hardware/enterprise logos (Intel-adjacent hardware makers, IBM, Cisco, Dell, Atlassian, Cloudflare, etc.) curated out of ~120,000 files — the full repo is a generic WorldVectorLogo mirror, not tech-specific. |
| `logos/unilogo/` | [zhoudaxia233/UniLogo](https://github.com/zhoudaxia233/UniLogo) | Repo code is MIT (see `LICENSE`); the university crests/wordmarks themselves are each institution's own mark | 36 transparent PNG logos for top research/engineering universities (MIT, Stanford, CMU, Oxford, Cambridge, ETH Zurich, IITs, Tsinghua, etc.) curated out of 835. |
| `animations/svg-loaders/` | [SamHerbert/svg-loaders](https://github.com/SamHerbert/svg-loaders) | MIT | Full set — 12 small SMIL-animated SVG spinners. |
| `animations/svg-spinners/` | [n3r4zzurr0/svg-spinners](https://github.com/n3r4zzurr0/svg-spinners) | MIT | Full set — 90+ SVG spinners (both CSS- and SMIL-animated variants). |
| `animations/spinkit/` | [tobiasahlin/SpinKit](https://github.com/tobiasahlin/SpinKit) | MIT | `spinkit.css` (+min) — CSS-only spinner classes. |
| `animations/three-dots/` | [nzbin/three-dots](https://github.com/nzbin/three-dots) | MIT | `dist/` — compiled CSS three-dot loading animations. |
| `animations/loaders-css/` | [ConnorAtherton/loaders.css](https://github.com/ConnorAtherton/loaders.css) | MIT (stated in README, no separate LICENSE file upstream — excerpt saved as `LICENSE.md` here) | `loaders.css` (+min) — CSS-only loader animations. |
| `animations/css-loaders/` | [lukehaas/css-loaders](https://github.com/lukehaas/css-loaders) | MIT | `css/` — full set of single-element CSS loaders. |
| `animations/animate-css/` | [animate-css/animate.css](https://github.com/animate-css/animate.css) | **Hippocratic License 2.1**, not MIT — an "ethical source" license with human-rights-compliance conditions layered on top of otherwise-permissive terms. Read `LICENSE` before using commercially. | `animate.css` (+min, +compat) — the standard `animate__*` entrance/exit/attention class library. |
| `animations/magic-css/` | [miniMAC/magic](https://github.com/miniMAC/magic) | MIT | `dist/` — one-liner CSS entrance/exit transition classes. |
| `animations/csshake/` | [elrumordelaluz/csshake](https://github.com/elrumordelaluz/csshake) | MIT | `dist/` — shake/bounce CSS micro-animation classes. |
| `animations/hover-css/` | [IanLunn/Hover](https://github.com/IanLunn/Hover) | MIT | `hover.css` (+min) — hover-triggered CSS transition classes. |
| `animations/gsap/` | [greensock/GSAP](https://github.com/greensock/GSAP) (via [npm: gsap](https://www.npmjs.com/package/gsap), v3.15.0) | GSAP Standard "no charge" license (free for this use — see `LICENSE.md` in this folder); **not MIT** | `gsap.min.js` — core animation engine only (no bonus/club plugins). Loaded as a classic `<script>` tag (works over `file://`, no bundler needed) so plain self-contained-HTML reels can use it. |
| `animations/lottie/` | [airbnb/lottie-web](https://github.com/airbnb/lottie-web) (via [npm: lottie-web](https://www.npmjs.com/package/lottie-web), v5.13.0) | MIT | `lottie.min.js` — the full SVG-renderer build (not `lottie_light`, which drops expression support some AE exports rely on). A second GSAP-style exception to "engines aren't assets" (see below) — its `goToAndStop(frame, true)` + `totalFrames` API is a clean, native fit for `window.__seek(t)`. No bundled `.json` animation files are included — see the note below on why those still have to be sourced per-reel. |
| `animations/video-overlay/` | [Pixabay](https://pixabay.com) (3 individual clips — see `LICENSE.md` in this folder for each source URL) | [Pixabay License](https://pixabay.com/service/license-summary/) — free for commercial use, no attribution required | 3 texture overlays (`light-leak-dust.webm`, `dust-particles.webm`, `film-grain.webm`), transcoded from the source MP4s to VP9/WebM and scaled to 1080px wide (230KB-2.3MB each, down from 8-98MB). A third GSAP/Lottie-style exception — `video.currentTime` + the `seeked` event is a clean fit for `window.__seek(t)`, hand-verified (see "Video overlays" below) before vendoring. |
| `fonts/poppins/`, `fonts/inter/`, `fonts/jetbrains-mono/`, `fonts/space-grotesk/` | Google Fonts / JetBrains releases, repackaged via the `@fontsource/*` npm packages (v5.3.0) | SIL Open Font License 1.1 — see `LICENSE-OFL.txt` in `fonts/` | Specific `.woff2` weights only (not full family ranges) extracted from each `@fontsource` package's `files/` directory — `bun add --no-save @fontsource/<name>`, copy the needed weight(s), `bun remove @fontsource/<name>`. Loaded per reel via `@font-face` + a relative `url(...)`. |
| `illustrations/humaaans-react/` | [react-humaaans on npm](https://www.npmjs.com/package/react-humaaans) v1.0.1 (original art: [humaaans.com](https://www.humaaans.com) by Pablo Stanley) | MIT (react-humaaans package; no separate upstream LICENSE file) | 24 full pre-composed "standing" character poses + several "sitting" poses, as React source files with resolvable color props — see `illustrations/humaaans-react/LICENSE.md` for the extraction pattern (`humaaansFull()` in a reel's `build.mjs`). Supersedes the older single-figure `reel-app/src/humaaans/` set (still present, used by `reel-anthropic-rundown-ios`) for any new reel — use a different pose per character appearance instead of reusing one figure everywhere. |

## ⚠️ Using `animations/*` with the render pipeline — read before using

Everything under `animations/` is CSS `@keyframes` / SMIL, driven by the
**browser's own real-time clock**, not by `window.__seek(t)`. That's a
problem for this repo's render pipeline specifically: `scripts/render.mjs`
steps through virtual time in fixed 1/60s increments, but each
`page.screenshot()` call takes a variable amount of *wall-clock* time. An
autonomous CSS-clock animation drifts out of sync with everything else in
the scene — it'll play back at the wrong, jittery speed in the encoded
video, because the video assumes 1 captured frame = exactly 1/60s of
animation time.

**To use one of these assets correctly, it must be seeked, not left
autonomous.** The standard trick: pause it globally, then set a *negative*
`animation-delay` equal to `-t` so the browser deterministically renders
exactly what the animation looks like at virtual time `t`:

```css
.loader { animation-play-state: paused; }
```
```js
// inside window.__seek(t), per animated element:
el.style.animationDelay = `-${t}s`;
```

This is the same freeze-then-seek approach `html-video`'s Hyperframes
adapter uses for its own font-load race (see `render.ts` notes referenced
earlier in this project) — same idea, applied per-element instead of
page-wide. `animate.css`/`magic.css`/`hover.css` classes are typically
single-run (not `infinite`), so this matters most for the spinner/loader
packs, which loop forever by design.

## Libraries deliberately not vendored (they're code, not assets)

The animation *engines* named alongside these packs — **anime.js**,
**Vivus**, **KUTE.js**, **flubber**, **mo.js**, **rough-notation**,
**motion** (Framer Motion), **lazy-line-painter**, **walkway**,
**progressbar.js** — are JS libraries, not media files, so they don't
belong in `assets/`. If a reel needs one, `bun add` it into
`reel-app/` (the React/Vite POC) as a normal dependency instead.

**GSAP is the one exception, and it *is* now vendored** (as
`animations/gsap/gsap.min.js`, see the table above), specifically because
its timeline API has a native `.progress()` / `.seek(t)`, which maps almost
exactly onto this project's `window.__seek(t)` contract — a GSAP timeline
can be driven deterministically frame-by-frame (`tl.progress(e)` inside
`__seek`, timeline built once with `paused: true`, never played) with far
less manual `animation-delay` bookkeeping than raw CSS keyframes, and with
built-in, well-tested easing curves (`bounce.out`, `back.out(1.7)`,
`power3.out`, etc.) in place of hand-rolled easing math. It's vendored as a
plain minified UMD build (not the npm ESM/CJS entry) so it loads via a
classic `<script>` tag and works over `file://` in the plain self-contained
HTML reels, not just in the `reel-app/` bundle. See
`reel-anthropic-rundown-ios/build.mjs`'s `dropIn`/`tumbleIn`/`runIn`
helpers for the pattern.

**Lottie's runtime is now the second exception (see the table above),
but no `.json` animation files are bundled with it.** A Lottie/Bodymovin
export is itself a baked keyframe timeline (not a live simulation), which
is exactly why `lottie-web` was safe to add: `anim.goToAndStop(frame,
true)` lets `__seek(t)` land on an exact frame deterministically, same
principle as GSAP's `tl.progress(e)`. What's still missing is the actual
*animations* — those live on hosted platforms (lottiefiles.com) or come
from a motion designer's own After Effects + Bodymovin export, not from a
git-clonable asset repo, so there's nothing to pull in bulk. If a reel
wants a specific Lottie file, source it individually (with its own
license check — LottieFiles' free tier carries per-file terms, not a
blanket license) and inline the `.json` into that reel's `build.mjs`.
Usage pattern:

```js
// vendored runtime, classic <script> tag (works over file://):
// <script src="../assets/animations/lottie/lottie.min.js"></script>
var anim = lottie.loadAnimation({
  container: document.getElementById('lottie-mount'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  // Use animationData (an inlined JS object), never `path`. `path` does
  // an XHR fetch for the JSON — verified this hangs forever under
  // file://, the same class of CORS gotcha this repo already knows
  // about from Vite's type="module" scripts. build.mjs should
  // JSON.parse the exported file at build time and inline it, exactly
  // like a reel's other embedded assets (e.g. the base64 profile pic).
  animationData: LOTTIE_JSON_INLINED_AT_BUILD_TIME,
});
function lottieSeek(anim, e) {
  if (!anim || !anim.totalFrames) return;
  // totalFrames - 1, not totalFrames: valid frame indices are
  // 0..totalFrames-1, so e=1 * totalFrames overshoots by one frame and
  // lottie-web holds an unexpected in-between value at that exact edge.
  anim.goToAndStop(clamp(e, 0, 1) * (anim.totalFrames - 1), true);
}
// inside window.__seek(t): lottieSeek(anim, (t - sceneStart) / sceneDuration);
```

**Rive** (`@rive-app/*`) was considered and skipped for now: its runtime
is WASM-based and its state-machine model doesn't expose as simple a
"jump to normalized progress" primitive as Lottie's frame-indexed
timeline — revisit only if a specific reel needs Rive-authored content
and the seek story is worth solving for that one case.

**tsParticles and p5.js were evaluated for generative/particle
backgrounds and deliberately not vendored.** tsParticles is a live
physics simulation (particles integrate velocity/gravity/collisions
every tick via its own internal `requestAnimationFrame` loop) with no
public "render exactly this normalized time `t`" API — forcing it to be
deterministic would mean patching its internal update loop, which risks
reintroducing exactly the real-time-clock drift this repo's core render
contract (see `CLAUDE.md`) exists to rule out. p5.js's `noLoop()` +
manual `redraw()` *is* safe (the sketch's own `draw()` is fully
author-controlled, same as any hand-rolled canvas/SVG texture already in
this repo), but it adds a ~1MB dependency for what boils down to a
`noise()` convenience function — not enough of a win over the existing
CSS/SVG-driven background textures to justify vendoring. If a future
reel's background genuinely needs Perlin/simplex noise, a small
standalone noise function is cheaper than the whole library.

## Video overlays — the H.264 gotcha, and why Mixkit was skipped

`animations/video-overlay/` (see the table above) works the same way
Lottie does: `<video>` + `currentTime` + the `seeked` event is a native,
already-deterministic seek API — a fourth "engine that's actually a
render-contract-compatible adapter" alongside GSAP/Lottie. Hand-verified
before vendoring (synthetic frame-numbered test clips, both a
single-keyframe and an all-intraframe encode, seeked forward and
backward): landing exactly on a frame boundary (`t = frame/fps`) risks an
off-by-one from float rounding — same class of bug as Lottie's
`totalFrames - 1` fix — so always seek to **the middle of the frame's
window**, `t = (frame + 0.5) / fps`, same principle as `lottieSeek`:

```js
function videoSeek(videoEl, t) {
  return new Promise((resolve) => {
    function onSeeked() { videoEl.removeEventListener('seeked', onSeeked); resolve(); }
    videoEl.addEventListener('seeked', onSeeked);
    videoEl.currentTime = t;
  });
}
// inside an async __seek(t): await videoSeek(overlayEl, (localFrame + 0.5) / overlayFps);
```

**The one non-negotiable gotcha: this repo's pinned Playwright Chromium
(`headless_shell`) cannot decode H.264/MP4 at all** — `video.error.code`
comes back `4` (`MEDIA_ERR_SRC_NOT_SUPPORTED`), because open-source
Chromium builds don't ship the proprietary H.264 decoder. VP9/WebM loads
and seeks perfectly. Every stock-video site defaults to MP4 downloads, so
**any video overlay must be transcoded to WebM before vendoring** —
`ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 out.webm` (add `-vf
scale=1080:-2` to also cut it down to this repo's canvas width; source
stock footage is routinely 4K, which is both unnecessary weight and,
before transcoding, a multi-tens-of-MB file). This also has a real
performance cost worth knowing before overusing it: ~12ms per
seek-and-screenshot round-trip in testing, so one overlay active for a
full 60s/60fps render adds roughly 45s to render time.

**Mixkit was evaluated and rejected as a source.** Its category pages
advertise "Mixkit License, free commercial use," but per-clip pages don't
consistently honor that — several free-tier downloads (checked by hand,
not assumed from the category blurb) turned out to be gated behind
"Mixkit Restricted License" (personal use only), with true commercial
clearance requiring an Envato Elements subscription. Its download links
are also JS-gated (no static file URL in the page HTML), making them
unfetchable by a script even before the license question. **Pixabay was
used instead** — the Pixabay License is unambiguous (commercial use,
modification, no attribution, across the whole site, not per-clip), and
individual video pages embed a direct `cdn.pixabay.com/.../<id>_large.mp4`
URL that's fetchable without a browser session.

## Not pulled from this round of sources, and why

- **LogoDet-3K, Logo-2K+, FlickrLogos-32** — these are ML training/detection datasets (bounding-box annotated), not asset libraries. Wrong shape for reel assets; skip unless this repo starts doing logo-detection model training.
- **Brandfetch / Logo.dev / unavatar.io / favicon-service pipeline** — these are live lookup APIs, not a one-time downloadable dump. Fits a "fetch a specific brand's logo on demand" workflow better than a pre-populated asset folder; can wire this up separately if a reel needs a brand not covered above.
- **VectorLogoZone** — repo is actually named `VectorLogoZone/vectorlogozone` (not `.../logos`); heavy overlap with `simple-icons` + `gilbarbara/logos` already pulled, skipped for this round to avoid redundant near-duplicates. Can pull specific brands from it on request.
- **thesvg.org** — appears to be a hosted site/library rather than a plain git-clonable asset repo; no direct source found to pull from.

## Not included (from the previous round), and why

- **`bradtraversy/design-resources-for-developers`**, **`neutraltone/awesome-stock-resources`**, **`MrPeker/awesome-illustrations`**, **`darelova/Awesome-Design-Resources-List`** — these are curated *link lists* (Markdown pages pointing to Freepik, Unsplash, dribbble, etc.), not repos containing actual downloadable asset files. Nothing to pull.

## Real-photo sourcing repos evaluated (and why the actual pull was elsewhere)

A round of suggested "high-quality real photo" repos was checked before
expanding `photos/servicestack/` above — verified by hand (fetching each
repo's README), not taken at face value, since several turned out not to
contain what their names implied:

- **`unsplash/datasets`** — metadata/CSV only (photo IDs, keywords, search
  terms, and URLs), not image binaries, and its own terms explicitly state
  "it cannot be used to redistribute the images contained within." Not
  usable for vendoring regardless of interest — pulling from it would mean
  scraping each URL individually (thousands of HTTP requests) and would
  still violate the dataset's own redistribution restriction.
- **`cj-mills/pexels-dataset`** — same shape: this GitHub repo holds only
  `attributes_df.json`/`tags.txt` metadata; the actual image files live on
  separate Kaggle dataset pages ("Pexels 110k 512p/768p JPEG"), which
  aren't a git-clonable source and carry their own separate terms to check.
- **`castano/image-datasets`**, **`neutraltone/awesome-stock-resources`**,
  **`jennybc/free-photos`** — curated *link lists* pointing to other sites
  (Unsplash, Pexels, Kaboompics, CC0.photo, etc.), same category as the
  design-resource lists above. Nothing to clone.
- **`jparkerweb/random-pexels-image`**, **`xcollantes/free-stock-images-mcp`**
  — live API wrappers requiring a runtime Pexels/Unsplash API key, not a
  pre-populated asset dump. Would fit a "fetch a specific photo on demand"
  workflow (same shape as the Brandfetch/Logo.dev note above), not this
  repo's "curate once, vendor the files" pattern — revisit only if a reel
  ever needs a truly dynamic, script-driven photo (not a hand-picked one).

**What actually happened instead**: `photos/servicestack/` (already in
this repo, see the table above) turned out to be exactly what those repos
were gesturing at but didn't deliver — a real, git-clonable collection of
actual Unsplash-sourced JPEGs with a permissive, redistribution-friendly
license. It was already partially vendored (30 of 147); the fix was
pulling the rest of an already-good source rather than chasing new ones
that don't actually bundle files. Random-sampled several across categories
(architecture, coastal/aerial, macro/nature) and visually confirmed no
watermarks before expanding — consistent with Unsplash's own no-watermark
policy, but worth checking by hand rather than assuming.
- **`lukaszadam/illustrations`** — no longer exists at that path (404/renamed/removed); couldn't locate a successor repo.
- **`jktzes/humaaans`** — assets are React components with SVG path data embedded in JSX (`.js` files), not standalone `.svg` files. A single figure was hand-extracted from a source like this early on (`reel-app/src/humaaans/`, three separate body-part files manually stitched together) — usable, but painstaking per-part work, and it left every reel reusing the exact same one figure. **Resolved later** via `illustrations/humaaans-react/` (see the main table above): the `react-humaaans` npm package ships 24 full pre-composed poses per file with resolvable color props, extractable in a few lines of regex — no more manual part-stitching, and real character variety across reels.

## Legal note on logos specifically

Company/university logos are trademarks (and often copyrighted artwork) even
when the file itself ships under a permissive license like CC0 or MIT —
that license covers the SVG/PNG file, not the mark it depicts. Using a logo
to *identify* a real company/product/institution in a reel (e.g. "this is
what OpenAI charges vs. Anthropic") is generally fine (nominative use);
implying endorsement, using a logo as your own brand mark, or shipping it
inside a commercial product/template pack is not. `logos/svg-logos/` in
particular is a straight mirror of WorldVectorLogo with no license grant at
all — treat everything in that folder as "for reference/identification in
a reel, not for redistribution as a standalone asset."

## Using these in a reel template

Icons/illustrations are plain SVG files — inline them directly into a reel's HTML (`<svg>...</svg>` content) or reference via `<img src="...">` / a `data:` URI, same as the profile picture substitution pattern already used in `reel-anthropic-opus-5-5*/reel.html.tmpl`. Photos are standard JPEGs, usable as background images or `<img>` sources.
