# Quality floor for every reel (set by the creator, 1 Nov 2026 — NON-NEGOTIABLE, never to be lowered)

Creator: *"This was a decent output. This needs to be a new checkpoint in terms of visual quality and animation that you can never come down from. All the future reels have to be above this level. This is non negotiable."*

The checkpoint is `reels/tech/reel-navic-clock-saga` v3 (the 3D-world film). "Decent" is the creator's own word for it: **it is the floor, not the target.** A new reel that is flatter, sparser, less continuous or less polished than this one must not be shipped, whatever its topic. Every new reel must beat it in at least one visible way *and* match it in every row below.

## What the floor consists of (all rows are required)

| # | Requirement | How it is proven before sending |
|---|---|---|
| 1 | **A real world, not panels.** Every scene is a lit 3D (or equivalently deep, camera-driven) set; flat DOM cards over a static sprite are not a scene. Data lives *in* the set (rays, discs, bars on a floor, dials, orbits), labels are anchored to 3D points. | Contact sheet at ≥3 times per scene: every frame shows depth, a light source and perspective. |
| 2 | **A travelling camera and few cuts.** The camera moves in every scene (push, orbit, descent, tracking); scenes hand over by continuous moves (powers-of-ten climb, descent, tracked launch) and at most ~1 hard cut (dip) per 15–20 s. | List the cuts: ≤ 1 per 15 s; `window.__B` times. |
| 3 | **A personal anchor at both ends** (an object the viewer owns: the phone's blue dot, the milk pot) and the last shot returns to it changed. | First and last frame pair. |
| 4 | **Named terms.** Each new technical term gets a "THIS IS CALLED / term / one-line meaning" card at the moment it is spoken. | grep the cards against the script's terms. |
| 5 | **One honest idea per scene, shown as the real phenomenon**, with truth labels (illustrative / not to scale / slowed N×). | Script table: scene → idea → object. |
| 6 | **Never static, never rushed.** *(Creator, 1 Nov 2026: the 2-second change rule is removed as a gate because it rushed the story.)* A key visual holds for its full comprehension time; the frame is alive through continuous motion that serves the explanation (camera drift, a pulse travelling the thing being explained, a value ticking), not through swapping content. `change-cadence` is now an *advisory* report: read its long stretches, and for each decide "is the viewer learning something or watching nothing?" — fix only the latter. | Contact sheet at 1 s steps: every hold is a deliberate explanatory beat. |
| 6b | **Every explainer scene is a sketch drawn in logical order.** One question per scene; the picture is *built in the order the explanation is spoken* (axes → objects → relationships → the answer), each element appearing on its word, with the previous step staying visible so the logic accumulates. A scene that is only a labelled beauty shot (Earth + tags) fails. | Scene table: scene → question → build order → the one thing that must be understood. |
| 7 | **Layout is clean.** `bun scripts/overlay-lint.mjs <site> 0.25` reports **0 findings** (safe zone x 150–918 / y 150–1536, caption band, overlays colliding with each other). Deliberate overlays are marked `data-ov` and named in the notes. Projected labels are clamped into the safe box. | The command's last line. |
| 8 | **Frames of the FINAL MP4 are reviewed**: frame 0, inside every cut, every scene midpoint, the slice joins, the end card, at full size and ~360 px. A page screenshot is not enough. | Contact sheet of the MP4 attached to the delivery notes. |
| 9 | **Voice, timing, mix** meet the standing audio rules (voice over music median ≥ 19 dB, min ≥ 13 dB, −14 LUFS) and the script passes the storytelling gate; audio not auditioned → say so. | `mix-report.json`, `script.md` gate. |
| 10 | **Branded CTA and end card** held ≥ 2.5 s (profile photo, handle, action), purpose-built cover (not a frame grab). | End-card frames; `cover.png`. |
| 11 | **Own visual identity** (palette, type, component language) and a new technique, per the earlier standing rules. | `script.md` "Benchmark to beat". |

## How to start a reel at this level (so it never starts below it)
- Copy the **engine pieces** from `reels/tech/reel-navic-clock-saga/site3d/` (`head.js` = renderer, Earth shader, satellites, rays, phone, pad; `tail.js` = camera helpers `calc/apply/camG`, `mkDial`, `tubeLine`, `put()` overlay manager, per-scene functions `SCN[i]`). three.js is vendored in `assets/animations/three/` (MIT). Render with `REEL_FPS=30` and two parallel slices (`tools/render3d.sh`).
- Plan the **camera path first** (one world, one through-line object), then scenes, then overlays. Write the shot list as `time | line | camera | object | label`.
- Run `overlay-lint` and `change-cadence` **while building**, not at the end; fix the lint if a human can see a problem it missed.

## Known headroom (the next reel must close these; do not call the floor "done")
- Close-range Earth/ground textures are blocky during fast climbs (use higher-res tiles or a blurred LOD).
- Procedural satellites/rockets are simple; use real models (`assets/models/nasa/`, `assets/models/`) with proper materials and an environment map.
- Add real bloom / depth of field (a post pass) and subtle camera shake on impacts.
- Real footage or photos at the personal-anchor ends (the viewer's own object).
- A listening pass on voice and mix (not possible in this sandbox).
