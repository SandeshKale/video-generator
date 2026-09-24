---
name: cover-art
description: Build a purpose-built Instagram cover/thumbnail image for a finished reel in this repo. Use whenever a reel needs a cover photo — never grab a frame from the rendered video.
---

# Cover art for a reel

A reel's cover/thumbnail is a **standalone design**, not a frame pulled from
the video. This was explicit, repeated feedback in this repo's history
("why pull out a frame from the reel only... be creative") and the fix —
`reel-openai-loop-method/cover-build.mjs` — is the template every future
cover should follow. Produce the cover only once the reel's design and
script are finalized (it reuses the reel's finished palette/fonts/assets).

## The pattern

Write a small standalone `cover-build.mjs` next to that reel's `build.mjs`.
It does not touch `__seek`/`__reelDurationSec` at all — it's a single
static composition, rendered once:

1. **Reuse the reel's own asset-extraction helpers** (`tablerIcon()`,
   `brandLogo()`, etc.) by copying them into `cover-build.mjs` — there's no
   shared module between reel folders yet, so duplicate locally rather
   than importing from the reel's `build.mjs`.
2. **Reuse the reel's finished visual system verbatim** — same
   `@font-face` declarations, same color tokens, same background texture
   language (grid/scanline/dot-grid/whatever that reel settled on), same
   panel/component shapes. The cover must look like it belongs to that
   specific reel, not like a generic template.
3. **Invent a genuinely new composition that appears nowhere in the reel
   itself.** This is the part that actually matters — a cover that reuses
   an in-reel layout reads as a frame grab even if it's technically a
   fresh render. The loop-method cover's hero was an orbiting-icon ring
   around the brand mark (one icon per step, arranged at even angles
   around a circle) — a shape that never appears in any of the reel's 10
   scenes. Invent an equivalent hero graphic for each new reel: something
   that visually summarizes the reel's topic/structure at a glance
   (a ring, a stack, a path/flow diagram, a radial burst — whatever fits
   the topic) rather than reusing a scene layout.
4. **Standard content lockup**, top to bottom:
   - A short eyebrow line (monospace/tracked-caps, e.g. `// AI WORKFLOW
     SYSTEM · 5 STEPS`) establishing the category.
   - The hero graphic (the new composition from step 3).
   - A large title lockup — the reel's actual title, one or two words
     picked out in the accent color with a distinguishing treatment (a
     wavy underline, a gradient, a bracket) so it doesn't read as flat
     text.
   - A one-line subtitle stating the reel's core promise/hook in plain
     language.
   - Optionally, a compact one-line summary of the structure (e.g.
     `PICK → PANEL → DEFINE → LOOP×3 → TEST`) if the reel has a named
     step sequence — gives the thumbnail information density without
     adding another visual element.
   - A small branding footer: profile picture (circular, bordered,
     glowing in the accent color per the "small brand elements need
     contrast" rule below) + handle.
5. **Render with Playwright, not the render pipeline.** No `scripts/
   render.mjs`, no `__seek` loop — just load `cover.html` and take a
   single `page.screenshot()` at the 1080×1920 canvas size. See
   "Rendering" below for the exact snippet.

## Composing the hero graphic

The hero is the one element that must be invented fresh per reel — it's
what separates "designed cover" from "screenshot with a title slapped on
it." Some starting shapes to adapt, not copy:

- **Orbiting ring** (used for loop-method): N nodes evenly spaced around a
  circle (`angle = -90 + i * (360/N)`, position via
  `x = cx + R*cos(angle), y = cy + R*sin(angle)`), one icon per step/topic
  point, with the brand/topic mark centered inside the ring.
- **Ascending stack**: offset cards/panels in a diagonal cascade, for a
  reel about layers or progression.
- **Radial burst**: icons fanning out from a center point along straight
  spokes, for a reel about one thing branching into several.
- **Path/flow line**: a bent or curved connector threading through 3-5
  icon nodes left-to-right or top-to-bottom, for a reel about a sequence.

Whatever shape is picked, it should be buildable with plain absolute
positioning + trig in the template literal (see loop-method's `orbit`
array/`orbitNodes` map) — no need for a canvas/SVG library.

## Rules carried over from the reel's own design system

These are non-negotiable house rules (see `CLAUDE.md`), and apply to a
cover exactly as they apply to reel scenes:

- **Vendored fonts only** — never a bare `font-family: 'Poppins'` etc.
  without an accompanying `@font-face` pointing at
  `assets/fonts/<family>/*.woff2`. `font-display: block` so the
  screenshot never fires before the font loads.
- **No pure `#fff`** for headline/body text — a tinted off-white
  (`#eef8fb`, `#f1f3f8`, etc.).
- **Soft text-shadow** on headline/subtitle text sitting over the
  textured background (`text-shadow: 0 6px 20px rgba(0,0,0,.7)` or
  similar) — the cover has the same "text over moving/textured
  background" legibility problem as any reel scene, even though it's a
  static render.
- **Gradient-text gotcha**: if the title uses a `background-clip: text;
  color: transparent` span, set `text-shadow: none` on that span
  explicitly and use `filter: drop-shadow(...)` instead if it needs a
  glow — an inherited `text-shadow` on a transparent fill renders as a
  solid dark silhouette, not a gradient.
- **Small brand elements need deliberate contrast** — a profile picture or
  small mark needs a real border/glow (not just placement) to separate it
  from whatever's behind it; check it near its real on-screen size, not
  just in the full 1080×1920 frame, where small details are easy to
  misjudge as "clear enough."
- **This is the one visual asset in a reel's deliverable set that does
  *not* need its own from-scratch palette** — it should look like it was
  cut from the same cloth as the reel it's promoting. (The
  "every reel needs its own visual identity" rule is about differentiating
  reels from each other, not differentiating a reel's cover from that same
  reel.)

## Rendering

```js
// at the end of cover-build.mjs, after writing cover.html
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${join(__dirname, 'cover.html')}`);
await page.waitForTimeout(300); // let @font-face + images settle
await page.screenshot({ path: join(__dirname, 'cover.png') });
await browser.close();
```

(`reel-openai-loop-method/cover-build.mjs` itself stops at writing
`cover.html` and was screenshotted via a separate Playwright call in that
session — either approach is fine; inlining the screenshot call as above
is simpler for a new reel.)

## Checklist before calling a cover done

- [ ] Does the hero graphic appear anywhere in the reel's actual scenes?
      If yes, redesign it — it must be cover-exclusive.
- [ ] Do the fonts/colors/component shapes match the finished reel, not an
      earlier draft of it?
- [ ] Is every font `@font-face`-declared against a real vendored
      `.woff2`, not assumed present?
- [ ] Is all headline/body text off-white with a soft shadow, not pure
      white on bare background?
- [ ] If any text uses a gradient-clip span, is `text-shadow: none` set on
      it explicitly?
- [ ] Does the profile picture / brand mark have a real border+glow, and
      does it still read clearly at roughly real on-screen thumbnail size?
- [ ] Title, subtitle, and (if applicable) step-summary line all present
      and legible at a glance — this image has to work as a scroll-stopping
      thumbnail, not just as a nice full-size render.

Reference implementation: `reel-openai-loop-method/cover-build.mjs` (and
its output `reel-openai-loop-method/cover.png`) — read it end to end
before writing a new reel's cover script.
