# Lemo-Opuscar style index — pick the style from the script (added 9 Nov 2026)

Source: `lemomo-ai/lemo-opuscar` (code and docs MIT; its demo films and stills are CC BY 4.0 and are **not** vendored). Vendored here, text only (1.6 MB): `assets/lemo-styles/styles/<slug>/{STYLE.md,style.json}` for all 66 styles, `assets/lemo-styles/DIRECTOR.md` (directing method), `TECHNIQUE.md` (build pipeline), `styles/README.md` (upstream index), `INDEX.json` (machine-readable copy of the table below), licence file. Films built from our own look are the creator's own: no LemoLab credit needed; if a film reuses a style's recipe closely, say "style inspired by Lemo-Opuscar" in the caption.

## 1. How to use it (standing procedure for every new reel)
1. **Right after the script is approved (or while scripting), choose the style from this page.** Classify the script by **topic type** and **story shape** (table 2), take the top 1-2 styles, read each one's `STYLE.md` **in full** (invariants: look, colour, type, motion, camera grammar, sound palette, native moves, pitfalls) and check its "not" paragraph.
2. **Write the choice into `script.md`** as a "Style" block: slug, why it fits this script (topic type + shape), the 3 invariants we keep, what we adapt (see section 3), and the runner-up. A reel without a recorded style choice is not ready for mockup.
3. **`STYLE.md` is fixed, everything else is ours** (Lemo's own rule): keep the style's look/camera/sound grammar, direct story, shots and timings from our script. Never bend the topic toward the style's demo film; write our own treatment before opening `DEMO`-type material.
4. **Our standing rules still win:** own visual identity per reel (palette/fonts must not repeat the previous reel; a style gives the *grammar*, we pick the colours within its constraints), vertical 1080×1920 with the safe zones, authored cinematic camera (no drift), spatial 3D where the style allows it, no cartoon people (voxel/brick/mocap or non-human casts only), honesty labels, validation gates, slow natural voice.
5. Read `assets/lemo-styles/DIRECTOR.md` once per reel for: benchmark first, shape the story, sound/rhythm/camera priority ("sound, rhythm, camera, directing" in that order), delivery checks. Read `TECHNIQUE.md` when changing the pipeline (their pipeline = timeline → web page `render(t)` → headless Chrome frame by frame, which is the same contract as our `window.__seek(t)`).

## 2. Pick by script type (topic → styles; first = default)
| Script looks like… | Choose | Why / what it gives |
|---|---|---|
| **An everyday rule / ELI5 of how a system treats you** (spam calls, queues, fees, cancellation traps) | `isometric-picture-book`, `memphis-diorama`, `tilt-shift`, `lowpoly-island` | one real place built as a toy-like world, rules shown as things that happen in it; calm ELI5 flow |
| **Numbers over time, growth, a trend** | `dataviz`, `transit-map`, `data-physical`, `iso-infographic` | the chart *is* the story; `transit-map`/`data-physical` make data physical and spatial |
| **A process or supply chain, step by step** | `iso-infographic`, `circuit-board`, `blueprint`, `isometric-picture-book` | flows drawn as routes; steps appear in spoken order |
| **How a product/chip/device works** | `teardown`, `hologram-hud`, `blueprint`, `glass-product`, `desktop-flythrough` | exploded views, scan-to-wireframe, spec walkthroughs |
| **A software/AI tool tutorial** | `living-screencast`, `desktop-flythrough`, `dark-keynote`, `ascii-crt` | the interface is the star; a non-human mascot can act out the steps |
| **News roundup / "this week" / social news with the sound off** | `caption-news`, `news-package`, `telestrator` | fastest legible grammar for our Instagram news reels |
| **Fact-check, myth-busting, reconstruction ("it was never posted")** | `visual-investigation`, `archive-lighttable`, `kino-montage`, `caption-news` | evidence on a desk, claim vs record |
| **Comedy / roast / pet-like humour** | `halftone-dossier`, `game-show`, `microgame`, `caption-news` (no cartoon people: keep casts as objects/voxel) | joke-friendly rhythm and visual punchlines |
| **Science explainer (real phenomenon)** | `microscope`, `lidar-survey`, `satellite-briefing`, `whiteboard`, `chalkboard`, `watercolor`, `engraving` | real imagery or hand-drawn teaching grammar; nothing frightening |
| **History / anniversary / "how it started"** | `newsreel`, `archive-lighttable`, `kino-montage`, `silent-film` | archive grammar; needs real archive material or honest stand-ins |
| **Kids / bedtime / very simple first-principles** | `crayon-book`, `whiteboard`, `brick-toy`, `paper-popup` | gentle pacing, one idea per page (cast must stay non-human or voxel/brick) |
| **Culture, festival, folk story** | `papercut-red`, `paper-lantern`, `ukiyoe`, `ink-wash`, `shadow-puppet`, `stained-glass` | respectful tradition-based looks; never for roast jokes |
| **Games, nostalgia, retro tech** | `pixel-rpg`, `hd-2d`, `microgame`, `ascii-crt` | game grammar and sound |
| **Brand/launch/title sequence** | `swiss-motion`, `spy-titles`, `art-deco`, `glass-product`, `dark-keynote` | identity-led openers |
| **Travel, place, calm** | `printed-long-take`, `silkscreen-poster`, `urban-sketch`, `watercolor`, `tilt-shift` | one unbroken move through a place |
| **Energy, networks, infrastructure** | `circuit-board`, `transit-map`, `iso-infographic`, `white-model` | networks drawn as lines/boards |

**Quick tie-breakers:** (a) needs real imagery/data and we have none → skip 🎬 styles or say so; (b) wants a spatial world with a travelling camera → prefer **3D** styles; (c) comedy with a serious fact → pair a calm style (`isometric-picture-book`, `dataviz`) with sarcastic voice, not a cartoon style; (d) the previous reel used the style family → pick a different family (variety rule).

## 3. How each style maps to our pipeline
- **Our engine** = three.js premium pass (PMREM, DoF, bloom) + DOM header/captions, `window.__seek(t)`; Lemo's = web page `render(t)` in headless Chrome: identical contract, so their `STYLE.md` camera/motion/sound rules transfer directly. 2D styles (hand-drawn, print, type) are built as canvas/DOM/shader pages with the same `__seek`; 3D styles as three.js scenes.
- **Aspect:** their default is 1920×1080 at 24 fps; ours is **1080×1920 at 30 fps (render at 30, mux 30)**. Re-compose every layout for the tall frame and our safe zones (y 232-1290 content, captions 1338-1500, x 156-918).
- **Voice:** ours = cloned Hinglish voice at 0.92× with the flow gate (no pause injection); their Kokoro/edge-tts guidance is secondary. Subtitles burned in and a `.srt` are fine.
- **Sound:** adopt their sound-palette notes per style (each `STYLE.md` has one) on top of our `audio_mix.py` cue system; loudness −14 LUFS is the same.
- **Real-asset styles (🎬):** their films use real data/imagery with licences; we only use them with real, licensed material (NASA/ESO/Unsplash in `assets/`, the creator's own data) and label stand-ins honestly.
- **Characters (🧍):** keep the *style grammar* (palette, motion, camera) but cast voxel/brick/object actors or mascots; never humaaans/cartoon people.
- **Do not copy** a style's demo layouts, characters, or text; do not name inspirations on screen (their rule too).
