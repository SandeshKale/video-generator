# Design-polish notes

A checklist of small, concrete design techniques for the next reel build —
sourced from surveying [craft.gustavofior.com](https://craft.gustavofior.com)
(a design-engineering demo site; not code we use, just well-organized
naming for techniques worth applying). Everything below is plain
CSS/SVG, portable with zero dependency, and compatible with the
deterministic `window.__seek(t)` contract — most of it is refinement to
patterns this repo already has, not new machinery.

Items from that site that **don't** apply are skipped: `Interruptibility`,
`Hover Restraint`, `Shared Layout`, `Scroll Fades` are about live,
user-triggered interaction — this repo's timeline is fully scrubbed, not
interactive, so nothing gets "interrupted" or "hovered."

## Directly actionable

- **Tabular numbers on anything that counts up/down.** `font-variant-
  numeric: tabular-nums;` on any animated stat/counter/timecode (the
  `.stat-big` hero numbers, progress-bar percentages, HUD frame counters
  in `reel-motion-showreel-demo`) so digit width doesn't jitter as the
  value changes — currently not applied anywhere in this repo; cheap,
  zero-risk fix.
- **Nested border-radius formula.** When a card has an inner element
  (icon badge, image) inset by padding `p` from a card with radius `R`,
  the inner element's radius should be `R - p`, not an arbitrary rounder/
  flatter value — reads as "cut from the same shape" instead of two
  unrelated rounded rects. Apply wherever a reel nests a rounded icon
  container inside a rounded card.
- **Shadows instead of hard borders for elevation.** A layered soft
  `box-shadow` (e.g. `0 1px 2px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.25)`)
  reads as "lifted" more convincingly than a 1-2px border, and doesn't
  fight with this repo's existing thin accent-color borders on cards —
  use shadow for depth, keep the accent border for identity/color, don't
  rely on the border alone to separate a card from a busy background.
- **Squircle corners for a hero card/badge.** True squircles (superellipse,
  not circular-arc `border-radius`) read noticeably smoother at large
  sizes. Approximate via an SVG `<path>` with a superellipse formula, or
  accept a large `border-radius` (40-50% of the shorter side) as a cheap
  stand-in — reserve for a single hero moment per reel (a cover's brand
  mark, a CTA profile frame), not every card, same "one gradient moment"
  restraint rule this repo already applies to gradient text.
- **Icon morph via blur+scale+fade, not a hard swap.** When a scene needs
  to swap one icon for another (e.g. showing a "before" icon becoming an
  "after" icon), cross-dissolve with a slight blur+scale on the outgoing
  icon rather than an instant `display` toggle — both icons render
  simultaneously for a short `t` window, blur/opacity/scale each a
  function of local progress, same pattern as the existing TRANS
  scene-crossfade just applied to a smaller element.
- **Exits faster and quieter than entrances.** This repo's `TRANS`
  scene-crossfade currently eases in and out symmetrically. Craft's
  framing — "leave faster and quieter than you came" — suggests a real
  refinement: shorten the fade-out window relative to fade-in (e.g.
  `TRANS_OUT = TRANS_IN * 0.6`) and/or reduce the drift distance on exit,
  so scenes feel like they're being dismissed deliberately rather than
  mirroring their own entrance in reverse. Worth trying on the next
  reel's crossfade and comparing against the current symmetric version.
- **Ease-out for anything that reads as "triggered by this scene," ease-
  in-out for anything ambient.** Already this repo's de facto practice
  (`dropIn`/`tumbleIn`/`runIn` all use overshoot/ease-out curves for
  entrances) — worth stating explicitly so a new reel's hand-rolled
  `enter()` calls don't default to linear or ease-in-out for content that
  should feel snappy.
- **Grow from the trigger point, not from zero/center.** A "scale
  entrance" reads better when the element's transform-origin is set to
  wherever it conceptually comes from (e.g. a stat card growing from the
  icon that introduced it) rather than always scaling from its own
  center. Small `transform-origin` change, meaningfully better feel for
  a hero-stat reveal.

## Already covered by this repo's existing rules

- **Letter-spacing tightened on big text, loosened on small text** — this
  repo's own "Typography house style" section in `CLAUDE.md` already
  codifies this exact rule (tighter tracking on headlines, positive
  tracking on small uppercase labels). No change needed, just a second
  independent source confirming the existing rule is right.
- **Noise/grain for texture** — already solved via
  `assets/animations/video-overlay/film-grain.webm` (see "Video overlays"
  in `CLAUDE.md`), rather than a CSS noise filter.
- **OKLCH for perceptually-even lightness steps** — worth using when
  hand-picking a new reel's palette variants (e.g. a duotone's light/dark
  steps) instead of eyeballing hex lightness, but this repo's palettes
  are already hand-tuned per reel and read well; treat as an optional
  refinement for whoever picks the next reel's exact hex values, not a
  required change.

## Not applicable here

Interruptibility, hover restraint, shared-layout transitions, scroll
fades — all describe live, user-driven UI interaction. This repo's
output is a linear, pre-rendered video with no runtime interaction, so
none of these have a meaningful equivalent.
