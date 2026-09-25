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
| `photos/servicestack/` | [ServiceStack/images](https://github.com/ServiceStack/images) | Sourced from [Unsplash](https://unsplash.com) — free for commercial and personal use, no attribution required | 30 of 147 hero photos (2560x1000), evenly sampled for variety. |
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

**Lottie** and **Rive** were not pulled at all: their runtimes
(`lottie-web`, `@lottiefiles/lottie-player`, `@rive-app/*`) are npm
packages, same as above, and the actual ready-made *animations* live on
hosted platforms (lottiefiles.com, Rive's community marketplace) rather
than in a git repo — there's nothing to `git clone`. If a reel wants a
specific free Lottie/Rive file, it'd need to be downloaded individually
from those sites by name, with its own license check (LottieFiles' free
tier and Rive community files carry per-file terms, not a blanket repo
license).

## Not pulled from this round of sources, and why

- **LogoDet-3K, Logo-2K+, FlickrLogos-32** — these are ML training/detection datasets (bounding-box annotated), not asset libraries. Wrong shape for reel assets; skip unless this repo starts doing logo-detection model training.
- **Brandfetch / Logo.dev / unavatar.io / favicon-service pipeline** — these are live lookup APIs, not a one-time downloadable dump. Fits a "fetch a specific brand's logo on demand" workflow better than a pre-populated asset folder; can wire this up separately if a reel needs a brand not covered above.
- **VectorLogoZone** — repo is actually named `VectorLogoZone/vectorlogozone` (not `.../logos`); heavy overlap with `simple-icons` + `gilbarbara/logos` already pulled, skipped for this round to avoid redundant near-duplicates. Can pull specific brands from it on request.
- **thesvg.org** — appears to be a hosted site/library rather than a plain git-clonable asset repo; no direct source found to pull from.

## Not included (from the previous round), and why

- **`bradtraversy/design-resources-for-developers`**, **`neutraltone/awesome-stock-resources`**, **`MrPeker/awesome-illustrations`**, **`darelova/Awesome-Design-Resources-List`** — these are curated *link lists* (Markdown pages pointing to Freepik, Unsplash, dribbble, etc.), not repos containing actual downloadable asset files. Nothing to pull.
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
