# "Chaand bada hai, ya dimaag?" — supermoon × moon illusion × Dev Deepawali (~80 s, Hinglish voice-over, nerdlogic.co)
Folder `reels/science/reel-supermoon-illusion/`. Post 22–23 Nov, re-share 24 Nov evening. **Blender-first** (all animation rendered in Blender) + **earshot / Openverse audio** (standing rules, 19 Nov 2026).

## Why this reel
- Creator-supplied plan (19 Nov 2026): festival eve, mythology-meets-science lane, cheap Cycles scene (textured spheres + one orbit + instanced diyas).
- `insights/report.md` is stale (12 Oct, old account); account lessons that apply: first fact by ~8 s, follow ask before the last payoff, honest ending.
- **Corrections to the plan** (see `research/sources.md`): "14 % bigger / 30 % brighter" is NASA's *maximum versus the year's faintest full moon*, not this November's value (Star Walk: ~6.5 % / ~13.5 % versus an average full moon, tier B) → voiced as "zyada se zyada"; distance voiced "lagbhag 3 lakh 61 hazaar km"; "three in a row" and the December distance are tier B (outlets differ by ~90 km); the Ponzo explanation is *one leading idea*, NASA says the cause is still debated.
- **Overlap:** shipped `reel-dev-deepawali` already uses 24 Nov's full Moon (Pleiades twist). Post this as a pair a day apart, or skip one.
- Script length: 9 sentences, 224 words ≈ 83 s at 2.7 w/s (the plan said 155 words / 60 s; the first draft was 268 words). Cut the "December and January" line or the finger test if it must be shorter.

## Storytelling gate (docs/STORYTELLING-GUIDE.md)
Protagonist: the Moon on Dev Deepawali night. Obstacle: everyone says it looks huge — is it? Reversal: the real supermoon gain is "up to 14 %" and the big horizon Moon is mostly the illusion; the viewer's own eye + fingernail is the test. Honest ending: the illusion's cause is still debated; faith and measurement kept apart.
One sentence: *"The supermoon is at most 14 % bigger, and the huge Moon over the ghats is mostly your brain — measure it with a fingernail."*
But/Therefore: Moon looks huge **but** an egg-shaped orbit only makes it up to 14 % bigger → therefore ask what else is going on **but** a horizon Moon measures the same as a high one (NASA photos) → therefore it's perception (one leading explanation: Ponzo) → therefore go outside and measure.

## Style (Lemo-Opuscar) — REVISED 19 Nov after the creator's feedback "depth in 3d is missing": the flat `flat-space-explainer` mockup was dropped. The reel is lit 3D with perspective cameras, depth of field, real spheres, glossy water and a real landscape (closest family: `data-physical`). The flat notes below are kept only for the palette/labels. Original choice: `flat-space-explainer` (runner-up `data-physical`)
Why: the story is sizes to scale (14 %, equal moons), an orbit and a ruler. Invariants kept: flat opaque shapes on a deep night-blue ground, one shade step, true scale inside a frame, sun-yellow = "look here" pointer, rings that lock with a spring. Adapted: rendered in Blender (shadeless flat materials, orthographic cameras, hard-edged "glow" as two solid discs), no SVG; the guide character is dropped (non-human lens mascot is optional later); the one exception to flatness is the real NASA Moon texture on the "photo" Moon in the illusion and festival shots (labelled NASA). Captions plain 40 px (house rule overrides the style's subtitle band).
Palette (own): night `#0b1230` / rings `#141c4a` `#1e2a6a`; moon cream `#f3e7c9`; diya amber `#ff9d2e`; "measure" teal `#35d0c0`; belief marigold kept for the festival shots only. Fonts: Jost 700 (vendor) + Inter + a mono. 

## Benchmark to beat (previous reel `reel-gta6-vice-city-real`)
Its ceiling: three.js map world with real NASA imagery, authored camera, 3D stamp. Beats: (1) **first Blender-rendered film** (Cycles CPU, measured), (2) a **true-scale comparison shot** where one Moon is scaled 1.14 against 1.00 and a fingernail ruler measures both, (3) **instanced-diya payoff** on a ghat built from boxes with a real moon texture, (4) real NASA Moon Kit data used as displacement + colour. Families (≥ 5): Blender 3D (all), NASA imagery/data, flat data objects (orbit, ruler, bars), instanced particles (diyas), kinetic type, audio family (earshot bank + Openverse CC0 + cloned voice).

## Render budget — MEASURED (probe `blender/probe.py`, Blender 5.0.1 bpy, Cycles CPU, 4 cores)
Heaviest shot (ghat steps + 300 instanced emissive diyas + textured moon), same scene each time:
| resolution | samples | s/frame | 1,440 frames (60 s @ 24 fps) |
|---|---|---|---|
| 1080×1920 | 24 | 10.7 | 4.3 h |
| 1080×1920 | 16 | 9.2 | 3.7 h |
| 720×1280 | 12 | 3.9 | 1.6 h |
| 540×960 | 8 | 2.2 | 0.9 h |
The plan's estimate (1–4 s/frame) was optimistic by ~3×: time scales with pixels, barely with samples (fixed overhead: denoise + scene). **Decision:** render at 720×1280 (~4 s/frame) and upscale 1.5× with a light sharpen, keep slow shots at 12 fps and frame-double (halves their cost), render in 12 resumable chunks with a Monitor. The probe frame showed the moon texture working but the diyas/steps composition was not yet framed (it is a timing probe, not a layout).
