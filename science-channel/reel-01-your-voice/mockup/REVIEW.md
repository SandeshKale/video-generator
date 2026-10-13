# Mockup review: reel #01 "You've never heard YOU" (series frame v1)

Files: `v1_f0.png` (frame 0), `v1_f1.png` (poll, 15.2-17.5 s), `v1_f2.png` (plugged ears, 25.4-28.4 s), `sheet1.jpg` (all three), `sheet_phone.jpg` (360 px phone-feed size). Source: `mockup.mjs` (throwaway, delete after the full build).

## The system (fixed for the whole channel, D2)
- Ground: deep ink `#0a1220` with a radiograph look: faint "+" registration grid, viewfinder corner marks at the safe-zone corners, a soft scan band.
- Meaning-coded colour (same in every reel): **cyan `#52e3ff`** hidden/inside/air, **coral `#ff5a4d`** the surprising number or the bone route, **lime `#b8ff3d`** try it yourself, **amber `#ffb938`** scientists disagree.
- Type: Familjen Grotesk 700 (headlines), Fragment Mono (labels, tracked caps), Inter 700 (captions). All vendored in `assets/fonts/` (new: Familjen Grotesk, Fragment Mono).
- Fixed frame: badge + status dot, mono eyebrow with `//`, headline with one coral word, centrepiece, chip row, source line under a dashed rule, caption pill. Signature objects: the **X-ray lens** (frame 0: a circular cut-away over the head; frame 2: a lens ring around the whole section) and the **zoom ruler** (left edge, cm ticks computed from the head's real pixel scale).

## Asset families in these three scenes (5 of the reel's 7)
| Scene | Families |
|---|---|
| Frame 0 | Blender 3D head (closed render + coronal cut-away seen through the lens), humaaans (standing-1, recoloured, wincing), bespoke SVG (phone voice note, sound arcs, coral ring), kinetic type + caption |
| Poll | Bespoke diverging-bar data object (hatched outline = hypothesis, solid = finding), rough.js hand-drawn circle, Phosphor icons (book, flask, warning), Blender head thumbnail |
| Plugged ears | Blender cut-away with lime ear plugs, SVG ring swell + blocked-air arcs, Phosphor hands/ear icons, kinetic type |
Not yet shown (arrive in the full build): audio design (the muffled mix), the end card, the "friend ignores a voice note" scene.

## Blender
`../blender/head.py` renders three states (`MODE=closed|cut|cutplug`) at the same camera, and writes `3d/head.json` with projected anchor points (mouth, ears, canal ends, skull centre), so the page draws the routes and rings on exact positions. The cut is a bisect through both ears; the cranium, bone ring, cavity and brain are flat decals so the section reads as a graphic plate.

## Facts check
- The poll bars show **direction only** (chip says so). No sample size is shown: only the abstract of Walter et al. 2025 was read.
- "Theory: higher" and "most said lower" are the script's F4 and F5. No Hz or percentages anywhere.

## Checks run
- Safe zone and caption band: only the ruler's SVG padding is outside x 150, none of its ink; nothing else crosses x 150-918 / y 140-1536 or the caption band (all three frames).
- Not yet run (full build only): `check.mjs`, `visual-validate.mjs`, `change-cadence.mjs` (these need the timeline).

## Please decide
1. **Look:** approve this series frame (D2), or name what to change.
2. **Frame 2 caption:** the big line and the caption pill carry the same sentence. Options: keep both (series rule: captions always on), or swap the big type for "ONLY YOU HEAR IT." (a line already in the script as "Only you get the bone").
3. **Head style:** a smooth porcelain mannequin with ink hair. If you want a more realistic or a more cartoon head, say so before the full build.
4. **Wince figure:** humaaans standing-1 is a recoil pose, with a small "ugh" bubble. A different pose can be swapped in.
