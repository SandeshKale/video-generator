# Reel: GTA VI — "Double GTA V? Not so fast." (working title; ~65 s, Hinglish voice-over, nerdlogic.co)

Status: SCRIPT + STYLE RECORD, awaiting creator approval before mockup. Facts: `research/sources.md`.

## Why this reel (picked from the repo, not repeated)
Existing GTA reels cover graphics (fake-pixels), the map (vice-city-real) and the scam (mobile-scam). This is the missing angle: **the money**, and it is *this week's* headline (Sensor Tower, 19 Nov: "$1.84 B, more than double GTA V's record"). Account data is thin (6 followers, median 185 views); film/Ramayana-linked and numbers reels did best per CLAUDE.md, and a "shapes drawn to scale" story gives the first-3-second visual a number the eye can compare.

## Story (storytelling gate)
- **Protagonist:** one red dot = one copy of the game.
- **Obstacle/reversal:** the headline says VI beat GTA V's record by 2.25× — **but the two numbers run on different clocks** (V: first 24 hours; VI: months of pre-orders + launch day). The "record" cannot be called yet.
- **Honest ending:** nobody official has said the real number; Take-Two's own figure is what settles it.
- **One-sentence test:** *GTA 6 looks like it doubled GTA V's record, BUT the two numbers measure different time, THEREFORE the real record is still unknown until Take-Two says it.* ✔
- **But/Therefore sheet:** (1) one dot = one copy, one big square = GTA V's best day → (2) VI's square is 2.25× bigger, record broken → BUT (3) cut the VI square: most of it is months of pre-orders, not a day → THEREFORE (4) put both on the same clock and the picture changes: unknown hole → (5) who bought: 75/25 split → (6) what to watch: Take-Two's own number.
- **Open loops:** "Kya record sach mein toota?" (0 s) → answered "abhi nahi bola ja sakta" (≈55 s) with the exact thing to watch.

## Script (draft, ear-first, ~170 words ≈ 65 s at ~2.7 w/s)
1. "GTA 6 ne ek hi din mein GTA 5 ka record tod diya. Aisa headline kehta hai." *(hook, number on screen from frame 0)*
2. "Pehle ek dot lijiye. Ek dot, ek copy."
3. "GTA 5 ke pehle chaubees ghante: gyarah point do ek million copy, kareeb aath sau solah million dollar. Yeh ek bada square."
4. "Ab GTA 6: Sensor Tower ke andaze se, ek point aath chaar billion dollar, unnees million copy. Square do guna se bhi bada."
5. "Lekin ruko. Do guna... kis cheez ka?"
6. "GTA 5 ka number, sirf chaubees ghante ka hai. GTA 6 ka number mein mahino ke pre-order bhi jude hain."
7. "Yaani ek taraf ek din. Doosri taraf, mahine aur ek din."
8. "Ek din ka hissa kitna hai? Yeh koi nahi jaanta. Isliye is square mein ek khaali jagah hai."
9. "Bechne wale kaun? Andaze se, paintees... nahi, pachattar pratishat PlayStation, baaki Xbox."
10. "Aur yeh sab andaaza hai. Take-Two ne abhi sahi number nahi bataya."
11. "Toh record toota ya nahi? Us din ka number aane do, phir bolenge."
12. CTA: "Aise numbers ko aakaar mein dekhna ho toh follow kijiye, nerd logic dot co." (Instagram CTA = follow + share; the YouTube like/share/subscribe CTA only if posted there.)
Spell-for-TTS and Whisper checks follow `docs/HINGLISH-PRONUNCIATION-LEXICON.md` (spell every part of big numbers, "Sensor Tower" and "Take-Two" in Devanagari).

## Style (Lemo-Opuscar record)
- **Slug: `bauhaus-shapes`** (Graphic & Type). Runner-up: `data-physical` (already used on `reel-sone-ki-lanka`, so not chosen).
- **Why it fits:** topic type "a set of numbers shown as shapes to scale / finance, no characters"; story shape = comparison that flips on a hidden condition. Its core rule, *area is the amount*, makes "2.25× bigger" and "an empty hole where the unknown day-one share would be" literal. The style's **Cut** motion (compass circle, lift out, paper hole) is exactly the reversal beat.
- **3 invariants kept:** (1) shapes are amounts: area ∝ dollars/copies, never resized for effect; (2) roles: circle = copies/what moves, square = money/what weighs, triangle = time; (3) visible construction grid that draws first and retracts, light matte paper ground, no gradients/shadows/outlines, type only names things.
- **What we adapt:** palette (own, see below, not Klein/Sorbet); the Chinese subtitle line is dropped (language on screen = the film's: English labels + our plain 40 px captions, not the style's corner block, per the caption rule); 1080×1920 at 30 fps with the safe zones (content y 232–1290, x 156–918); comparison squares stacked vertically, whole in frame ≥ 2.5 s before they are read out.
- **Palette (new for this series):** paper `#EEF2E8`, protagonist coral `#F0503C` (the dot/copies), field ink-blue `#1B3FA8` (GTA VI total), pivot sun `#F2B91C` (GTA V's square), secondary `#C7D3CC`, ink `#14202B`. Fonts: Jost (style default; vendor if absent) + Inter captions. Cover in Anton.
- **Honesty labels:** "ESTIMATE · Sensor Tower" on VI's square, "GUINNESS · 24 H" on V's; the cut-out hole is labelled "day-one share: unknown".

## Pipeline note (Blender-first rule, 19 Nov)
The style is flat 2D, but the standing rule says Blender renders everything that moves. Plan: orthographic camera, emission-only flat materials (no lighting), shapes scaled by area, paper tooth added in compositing, text through `scripts/blender_text.py`. **Mockup must be real Blender renders with measured s/frame** (3 scenes from 3 families: the square-area comparison, the Cut/hole reversal, the 75/25 ring) before the full build.

## Asset families (≥5, per scene) — to confirm at mockup
Blender flat-shape renders (1–8) · crisp-text overlay (all) · kinetic type/counters (1,3,4) · bespoke data objects: area squares, hole, split ring (3–9) · real-footage/paper texture finish (all) · audio family: marimba/kalimba score + geometry SFX + cloned voice (all) · real photo: none (no Rockstar imagery, deliberately).

## Open items before posting
Re-check for an official Take-Two/Rockstar number (would change the ending), re-open FOX 5/Sensor Tower tracker, confirm which edition price Sensor Tower assumed, one human listen to the Hinglish numbers and the CTA brand.
