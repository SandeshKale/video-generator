<div align="center">

# 🎬 video-generator

**Deterministic, frame-accurate pipelines for Instagram-Reel-style 9:16 MP4s — built from self-contained HTML animations.**

Headless Chromium for capture · ffmpeg for encoding · zero reliance on the browser's clock

![format](https://img.shields.io/badge/format-9%3A16%20vertical-blueviolet)
![fps](https://img.shields.io/badge/framerate-60fps-informational)
![codec](https://img.shields.io/badge/codec-H.264%20%2F%20libx264-lightgrey)
![renderer](https://img.shields.io/badge/renderer-Playwright%20%2B%20Chromium-2ea44f)

</div>

---

## Contents

- [How it works](#-how-it-works)
- [Repository layout](#-repository-layout)
- [Quick start](#-quick-start)
- [Building a reel from source](#-building-a-reel-from-source)
- [The deterministic-seek contract](#-the-deterministic-seek-contract)
- [Assets](#-assets)
- [Reels in this repo](#-reels-in-this-repo)
- [Further reading](#-further-reading)

---

## ✨ How it works

Each reel is authored as a single HTML document (or, in one case, a small
React/Vite app) that exposes a **deterministic seek function**. A generic
render script drives that function frame-by-frame and encodes the
resulting PNG sequence into an MP4 — there is no reliance on the
browser's real-time clock, so every render is bit-for-bit reproducible
and frame-accurate at 60fps.

```
   HTML / React source              scripts/render.mjs                 ffmpeg
┌────────────────────┐        ┌─────────────────────────┐        ┌───────────────┐
│  window.__seek(t)   │  ───▶  │  for i in 0..duration*60 │  ───▶  │  libx264       │
│  __reelDurationSec  │        │   seek(i/60) → screenshot │        │  yuv420p, crf18 │
└────────────────────┘        └─────────────────────────┘        └───────────────┘
      pure fn of t                 1 PNG frame per tick              faststart .mp4
```

> [!IMPORTANT]
> **Every reel has its own visual identity** — its own color palette,
> background-motion language, component shapes, typography, and character
> art. Nothing about a reel's *look* carries over from the previous one;
> only the underlying **mechanics** are shared — the deterministic-seek
> contract, the safe-zone rules, and the GSAP entrance-animation pattern.
>
> See **[`CLAUDE.md`](./CLAUDE.md)** for the full technical contract,
> conventions, and gotchas — kept up to date with everything learned
> building each reel, and worth re-reading after time away from this repo.

---

## 🗂 Repository layout

```
video-generator/
├── scripts/                     Shared render tooling (not reel-specific)
│   ├── render.mjs                 Generic HTML→MP4 renderer (Playwright + ffmpeg)
│   └── static-server.mjs          Zero-dependency static file server (for dist/ sources)
│
├── assets/                      Curated, license-tracked third-party asset library
│   ├── icons/                     tabler, feather, simple-icons (brand logos)
│   ├── illustrations/             flowbite, bioicons, humaaans-react (24 character poses)
│   ├── logos/                     gilbarbara, svg-logos, unilogo
│   ├── photos/                    servicestack (Unsplash-sourced)
│   ├── fonts/                     Vendored webfonts (Poppins, Inter, JetBrains Mono, Space Grotesk, ...)
│   ├── animations/                CSS/SMIL animation packs, plus a vendored GSAP core build
│   └── ATTRIBUTION.md             Full source/license table + render-pipeline caveats
│
├── .claude/skills/               Reusable Claude Code skills for building this repo's reels
│   └── cover-art/                 Purpose-built Instagram cover/thumbnail design pattern
│
├── reel-anthropic-opus-5-5/     Reel · "Opus 5.5 pricing" (template + build output)
├── reel-anthropic-opus-5-5-v2/  Reel · v2 of the above, denser/more animated
│
├── reel-anthropic-rundown-ios/  Reel · "Ship an iOS app without a Mac team"
│   ├── build.mjs                   Assembles reel.html from real asset files
│   ├── reel.html                   Generated output — never hand-edit, regenerate via build.mjs
│   ├── asset-plan.pdf              Scene-by-scene asset/manifest plan (reference doc)
│   └── reel-fullhd60-compressed.mp4  Delivered Full HD 60fps render (CRF 23, ~20MB)
│
├── reel-openai-loop-method/     Reel · "The Loop Method" (ChatGPT workflow-iteration system)
│   ├── build.mjs                   Assembles reel.html — cyan/magenta "Terminal/Signal" system
│   ├── reel.html                   Generated output — never hand-edit, regenerate via build.mjs
│   ├── cover-build.mjs             Purpose-built cover image generator (not a frame grab)
│   ├── cover.png                   Rendered cover/thumbnail image
│   └── reel-fullhd60.mp4           Delivered Full HD 60fps render
│
├── reel-app/                    React/Vite proof-of-concept for the same rendering contract
├── package.json                 Root deps (playwright) + `npm run render` script
└── README.md / CLAUDE.md        This file / agent-facing technical guide
```

---

## 🚀 Quick start

```bash
npm install                        # installs Playwright (root) — run once
npx playwright install chromium    # if Chromium isn't already present

# Render a plain self-contained HTML reel (Full HD, 60fps)
node scripts/render.mjs reel-openai-loop-method/reel.html \
     reel-openai-loop-method/reel-fullhd60.mp4 1

# Render at 4K (deviceScaleFactor 2 — this is the default, scale arg optional)
node scripts/render.mjs reel-anthropic-opus-5-5/reel.html \
     reel-anthropic-opus-5-5/reel-4k60.mp4

# Render a directory-based source (e.g. a Vite build's dist/ folder)
npm --prefix reel-app run build
node scripts/render.mjs reel-app/dist reel-app/reel-poc-4k60.mp4
```

### `scripts/render.mjs` usage

```
node scripts/render.mjs <source.html|dist-dir> <output.mp4> [scale]
```

| Argument | Meaning |
|---|---|
| `source` | A single self-contained `.html` file (loaded via `file://`), or a directory such as a Vite `dist/` build (served locally over HTTP — Chromium enforces CORS on `type="module"` scripts even over `file://`) |
| `output` | Destination `.mp4` path |
| `scale` *(optional)* | `deviceScaleFactor`. Defaults to `2` → renders the 1080×1920 canvas at native **2160×3840 (4K UHD)**. Pass `1` for native **1080×1920 (Full HD)** |

Output is always **60fps H.264** (`libx264`, `yuv420p`, `crf 18`, `+faststart`), duration taken from the page's own `window.__reelDurationSec`.

---

## 🛠 Building a reel from source

Every generated reel's `reel.html` is a **generated file** — never
hand-edit it. Its source of truth is that reel's own `build.mjs`, which
reads real SVGs/fonts out of `assets/` and assembles the full HTML
document (styles, markup, per-scene animation logic) via template
literals. To change anything about a reel:

```bash
cd reel-openai-loop-method      # or reel-anthropic-rundown-ios
node build.mjs                                             # regenerates reel.html
node ../scripts/render.mjs reel.html reel-fullhd60.mp4 1   # re-render
```

If the resulting MP4 is too large to deliver (e.g. exceeds a host's
upload limit), re-encode at a higher CRF rather than re-rendering from
scratch:

```bash
ffmpeg -y -i reel-fullhd60.mp4 -c:v libx264 -preset medium -crf 23 \
  -pix_fmt yuv420p -movflags +faststart reel-fullhd60-compressed.mp4
```

A new reel's cover/thumbnail image should be a **purpose-built design**
(its own `cover-build.mjs` → `cover.html` → a single Playwright
screenshot), never a frame pulled from the video — see the
**[`cover-art` skill](./.claude/skills/cover-art/SKILL.md)** and
`reel-openai-loop-method/cover-build.mjs` for the pattern.

---

## 🔁 The deterministic-seek contract

Every reel, regardless of how it's authored, must expose:

```js
window.__reelDurationSec = <number>;   // total duration in seconds
window.__seek = function(t) { ... };   // pure function: render the exact
                                        // visual state at time t (seconds)
```

`window.__seek(t)` must be **idempotent and driven entirely by `t`** — no
`setTimeout`, no CSS `@keyframes`/`animation` running on the browser's
real clock, no accumulated state. The render script calls `__seek(i / 60)`
once per output frame (`i = 0 .. duration*60`) and screenshots after each
call; because each screenshot takes a variable amount of wall-clock time,
any animation not explicitly driven by the `t` argument will desync or
jitter in the final video.

> [!TIP]
> See `assets/ATTRIBUTION.md` for the specific technique (negative
> `animation-delay` seeking) needed to reuse one of the pre-built
> CSS/SMIL animation packs under `assets/animations/`, and `CLAUDE.md`'s
> "Entrance animations" section for the GSAP-based `dropIn` /
> `tumbleIn` / `runIn` helpers both generated reels use, which apply the
> same `t`-driven-only rule through `tl.progress(e)` scrubbing rather
> than `tl.play()`.

Full details, conventions, and known gotchas live in **[`CLAUDE.md`](./CLAUDE.md)**, including:

- The hard **9:16 safe-zone rule** — nothing in the top ~150px / bottom ~400px / right ~190px, where a phone's own chrome and Instagram's own UI draw over a reel regardless of content.
- The **"every reel needs its own visual identity"** rule.
- The **signal-bridge** pattern for filling the gap between a scene's headline and its content.
- **Character variety** via `assets/illustrations/humaaans-react/`.
- The **typography house style** — vendored fonts, off-white (never pure white) text, text-shadow for legibility over moving backgrounds, a letter-spacing scale.

---

## 📦 Assets

`assets/` is a curated pull of several open-source icon, illustration,
logo, photo, font, and CSS-animation repositories, license-tracked per
source in **[`assets/ATTRIBUTION.md`](./assets/ATTRIBUTION.md)**. Read that
file before:

- 🏷️ Using a brand/company logo in a new reel — trademark/nominative-use caveats.
- 🎞️ Wiring up anything under `assets/animations/` — real-time-clock caveat above.
- 🔤 Adding a new font or character pose — both are vendored the same way: install the npm package with `--no-save`, extract only the needed files, then `npm uninstall` — the repo keeps the extracted files, not the dependency.

---

## 🎞 Reels in this repo

| Folder | Topic | Format | Visual system |
|---|---|---|---|
| `reel-anthropic-opus-5-5/` | Opus 5.5 pricing announcement | 4K 60fps, 21s | Template-based (`reel.html.tmpl` + profile pic substitution) |
| `reel-anthropic-opus-5-5-v2/` | Same topic, v2 | 4K 60fps | Denser scene composition, more elements per frame |
| `reel-anthropic-rundown-ios/` | Shipping an iOS app without a Mac, via Codex + Xcode + App Store Connect | Full HD 60fps, 60s | Navy background · green/blue/amber accents · drifting dot-grid + hatch texture · gutter "streamline" dots · rounded-rect cards · Poppins/Inter |
| `reel-openai-loop-method/` | "The Loop Method" — a 5-step system for tightening up a drifting ChatGPT workflow | Full HD 60fps, 60s | Near-black background · cyan/magenta accents · graph-grid + scanline + vertical data-readout gutters · angular clip-corner panels · monospace bracket-tags · Space Grotesk/Inter/JetBrains Mono · "signal bridge" terminal-readout bridging every headline-to-content gap · subtle crossfade transitions · purpose-built cover image |
| `reel-app/` | Proof-of-concept: same `window.__seek` contract driven from React/Vite instead of plain HTML | 4K 60fps | Validates the render pipeline works with a bundled `type="module"` app served over HTTP, not just `file://` |

Each finished reel's **standard deliverable set**: the rendered MP4, an
elaborate Instagram caption, a hashtag set, and a purpose-built cover
image (see the [`cover-art` skill](./.claude/skills/cover-art/SKILL.md))
— produced once the reel's design and content are finalized.

---

## 📚 Further reading

| Doc | What's in it |
|---|---|
| **[`CLAUDE.md`](./CLAUDE.md)** | The full agent/contributor technical guide — render contract, visual-identity rules, layout system, typography house style, git conventions |
| **[`assets/ATTRIBUTION.md`](./assets/ATTRIBUTION.md)** | License table per asset source, plus the animation-seeking caveat |
| **[`.claude/skills/cover-art/SKILL.md`](./.claude/skills/cover-art/SKILL.md)** | Step-by-step pattern for designing a reel's cover/thumbnail |

<div align="center">

—

Built with 🎨 HTML/CSS, 🎬 Playwright, and ⚙️ ffmpeg — no video editor required.

</div>
