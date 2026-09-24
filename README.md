# video-generator

Pipeline for producing Instagram-Reel-style vertical (9:16) MP4 videos from
self-contained, deterministic HTML animations, using headless Chromium
(Playwright) for frame capture and ffmpeg for encoding.

Each reel is authored as a single HTML document (or, in one case, a small
React/Vite app) that exposes a deterministic seek function. A generic render
script drives that function frame-by-frame and encodes the resulting PNG
sequence into an MP4 — there is no reliance on the browser's real-time clock,
so every render is bit-for-bit reproducible and frame-accurate at 60fps.

See `CLAUDE.md` for the full technical contract, conventions, and gotchas an
agent (or a new contributor) needs before touching this repo.

## Repository layout

```
video-generator/
├── scripts/                     Shared render tooling (not reel-specific)
│   ├── render.mjs                 Generic HTML→MP4 renderer (Playwright + ffmpeg)
│   └── static-server.mjs          Zero-dependency static file server (for dist/ sources)
├── assets/                      Curated, license-tracked third-party asset library
│   ├── icons/                     tabler, feather, simple-icons (brand logos)
│   ├── illustrations/             flowbite, bioicons
│   ├── logos/                     gilbarbara, svg-logos, unilogo
│   ├── photos/                    servicestack (Unsplash-sourced)
│   ├── animations/                CSS/SMIL animation packs (loaders, spinners, entrance/exit classes)
│   └── ATTRIBUTION.md             Full source/license table + render-pipeline caveats
├── reel-anthropic-opus-5-5/     Reel: "Opus 5.5 pricing" (template + build output)
├── reel-anthropic-opus-5-5-v2/  Reel: v2 of the above, denser/more animated
├── reel-anthropic-rundown-ios/  Reel: "Ship an iOS app without a Mac team"
│   ├── build.mjs                   Node script that assembles reel.html from real asset files
│   ├── reel.html                   Generated output (do not hand-edit — regenerate via build.mjs)
│   ├── asset-plan.pdf              Scene-by-scene asset/manifest plan (reference doc)
│   └── reel-fullhd60-compressed.mp4  Delivered Full HD 60fps render (CRF 23, ~20MB)
├── reel-app/                    React/Vite proof-of-concept for the same rendering contract
├── package.json                 Root deps (playwright) + `npm run render` script
└── README.md / CLAUDE.md        This file / agent-facing technical guide
```

## Quick start

```bash
npm install                # installs Playwright (root) — run once
npx playwright install chromium   # if Chromium isn't already present

# Render a plain self-contained HTML reel (Full HD, 60fps)
node scripts/render.mjs reel-anthropic-rundown-ios/reel.html \
     reel-anthropic-rundown-ios/reel-fullhd60.mp4 1

# Render at 4K (deviceScaleFactor 2 — this is the default, scale arg optional)
node scripts/render.mjs reel-anthropic-opus-5-5/reel.html \
     reel-anthropic-opus-5-5/reel-4k60.mp4

# Render a directory-based source (e.g. a Vite build's dist/ folder)
npm --prefix reel-app run build
node scripts/render.mjs reel-app/dist reel-app/reel-poc-4k60.mp4
```

`scripts/render.mjs` usage:

```
node scripts/render.mjs <source.html|dist-dir> <output.mp4> [scale]
```

- `source`: either a single self-contained `.html` file (loaded via `file://`)
  or a directory such as a Vite `dist/` build (served locally over HTTP,
  because Chromium enforces CORS on `type="module"` scripts even over
  `file://`).
- `output`: destination `.mp4` path.
- `scale` (optional): `deviceScaleFactor`. Defaults to `2` → renders the
  1080×1920 canvas at native 2160×3840 (4K UHD). Pass `1` for native
  1080×1920 (Full HD).
- Output is always 60fps H.264 (`libx264`, `yuv420p`, `crf 18`,
  `+faststart`), duration taken from the page's own
  `window.__reelDurationSec`.

## Building the rundown-ios reel from source

`reel-anthropic-rundown-ios/reel.html` is a **generated file** — never hand-edit
it. Its source of truth is `build.mjs`, which reads real SVGs out of
`assets/` (icons, brand logos, illustrations) and assembles the full HTML
document (styles, markup, per-scene animation logic) via template literals.
To change anything about that reel:

```bash
cd reel-anthropic-rundown-ios
node build.mjs                 # regenerates reel.html
node ../scripts/render.mjs reel.html reel-fullhd60.mp4 1   # re-render
```

If the resulting MP4 is too large to deliver (e.g. exceeds a host's upload
limit), re-encode at a higher CRF rather than re-rendering from scratch:

```bash
ffmpeg -y -i reel-fullhd60.mp4 -c:v libx264 -preset medium -crf 23 \
  -pix_fmt yuv420p -movflags +faststart reel-fullhd60-compressed.mp4
```

## The deterministic-seek contract

Every reel, regardless of how it's authored, must expose:

```js
window.__reelDurationSec = <number>;   // total duration in seconds
window.__seek = function(t) { ... };   // pure function: render the exact
                                        // visual state at time t (seconds)
```

`window.__seek(t)` must be **idempotent and driven entirely by `t`** — no
`setTimeout`, no CSS `@keyframes`/`animation` running on the browser's real
clock, no accumulated state. The render script calls `__seek(i / 60)` once
per output frame (`i = 0 .. duration*60`) and screenshots after each call;
because each screenshot takes a variable amount of wall-clock time, any
animation not explicitly driven by the `t` argument will desync/jitter in
the final video. See `assets/ATTRIBUTION.md` for the specific technique
(negative `animation-delay` seeking) needed if you want to reuse one of the
pre-built CSS/SMIL animation packs under `assets/animations/`.

Full details, conventions, and known gotchas: **`CLAUDE.md`**.

## Assets

`assets/` is a curated pull of several open-source icon, illustration, logo,
photo, and CSS-animation repositories, license-tracked per source in
`assets/ATTRIBUTION.md`. Read that file before adding a new reel that uses
brand logos (trademark/nominative-use caveats) or before wiring up any of
the `animations/` packs (real-time-clock caveat above).

## Reels in this repo

| Folder | Topic | Format | Notes |
|---|---|---|---|
| `reel-anthropic-opus-5-5/` | Opus 5.5 pricing announcement | 4K 60fps, 21s | Template-based (`reel.html.tmpl` + profile pic substitution) |
| `reel-anthropic-opus-5-5-v2/` | Same topic, v2 | 4K 60fps | Denser scene composition, more elements per frame |
| `reel-anthropic-rundown-ios/` | Shipping an iOS app without a Mac, via Codex + Xcode + App Store Connect | Full HD 60fps, 60s | Built programmatically from real asset SVGs via `build.mjs`; 10 scenes, textured animated background, gutter "streamline" accents, card-wrapped content bands tuned to avoid empty frame regions |
| `reel-app/` | Proof-of-concept: same `window.__seek` contract driven from React/Vite instead of plain HTML | 4K 60fps | Validates that the render pipeline works with a bundled `type="module"` app served over HTTP, not just `file://` |
