# "Ghar ka patthar paani pe tairta hai? Space se dikhta hai" — script, style, shot list (DRAFT for approval)
Folder `reels/science/reel-pumice-raft/` · Hinglish voice-over only · nerdlogic.co end card · CTA "follow aur share" · ~60 s · Blender-first, all 3D

## Why this reel
Creator plan 20 Nov 2026 (pumice / floating stone + Ram Setu legend). Account data: Ramayana-linked science reels did best; open-loop hook + guaranteed payoff. News peg: NASA Earth Observatory, 4 Jun 2026 pumice rafts at the Admiralty Islands. Facts/tiers: `research/sources.md`.

## Storytelling gate
- Protagonist: a grey stone on your palm. Obstacle: stones sink. Reversal: this one floats, and a raft of them is big enough for satellites to see. Honest ending: science explains floating stones; the Ram Setu story stays a story (never claimed to be pumice).
- One-sentence test: "A volcano froths lava into stone full of sealed air bubbles, so it floats, and when billions float together satellites can photograph the raft."
- Open loops: s1 "ye patthar paani mein dooba nahi" -> paid s3 (bubbles); s4 "space se dikhta hai" -> paid s6 (satellite plate); Ram Setu line s8 framed as kahani.

## Script (≈150 words, 4 anticipation beats)
1. (0-4 s) Ye patthar... paani mein daalo. Dooba? Nahi. Tair gaya.
2. (4-12 s) Isse pumice kehte hain. Ye jwalamukhi ke jhaag se bana patthar hai, andar hazaaron chhote hawa ke bulbule band hain.
3. (12-22 s) Bulbule patthar ko paani se halka rakhte hain, isliye ye tairta hai. Jab tak paani andar nahi bhar jaata, ye doobta nahi.
4. (22-32 s) Ab socho, ek jwalamukhi se arabon tukde. Mai 2026 mein Papua New Guinea ke paas samundar ke neeche eruption hua, aur NASA ke satellites ne use dekha.
5. (32-46 s) Jun mein pumice ke raft Admiralty Islands tak pahunche. Space se ye samundar par ek lambi parat jaisa dikhta hai. NASA ke mutabik aise raft mahino se saalon tak tair sakte hain. 2012 mein ek raft shuru mein lagbhag 400 vargkilometre ka tha.
6. (46-55 s) Ramayana mein tairte patthar ki kahani hai, Ram Setu ki. Wo aastha aur kahani hai; science sirf itna batata hai ki tairne wale patthar asli hote hain.
7. (55-62 s) Aapke ghar mein asli pumice hai: paon ghisne wala patthar. Paani mein daal ke dekho. Follow aur share karo, nerdlogic dot co.

## Style (Lemo-Opuscar record)
- **Style:** `satellite-briefing` (read in full 20 Nov 2026), runner-up `microscope` (for the stone-bubble scale).
- **Why:** the story is one continuous change of scale (stone in the hand -> bubbles -> ocean -> raft from orbit) with real satellite plates as evidence; "scale is the camera".
- **Invariants kept:** (1) real NASA imagery plate as the evidence, graded to analyst grey with true colour only at the turn; (2) thin white measurement lines/one amber reading per screen; (3) camera never stops, log-space dive and climb, no crossfades between unrelated places.
- **Adapted:** the ground is a Blender 3D scene (displaced ocean + instanced pumice raft + the real MODIS plate mapped on a curved Earth patch) not a 2D shader; all labels via `scripts/blender_text.py` (crisp, final-res overlay pass); real photos not required for the stone (procedural 3D pumice).
- **Our rules win:** 1080x1920/30 fps, authored locked camera, no people, plain 40 px captions, honesty labels (illustration vs real plate), Blender renders everything that moves.

## Visual identity
Deep ocean ink `#06131a`, analyst grey, pumice cream `#d9cfc0`, amber reading `#ffb347`, sea-glass teal for water; Barlow Condensed (readings), IBM Plex Mono (instruments), Inter (captions). Not the supermoon night-blue, not the scam-reel graphite/iron.

## Benchmark to beat (previous: GTA scam reel "Thermal Desk")
Adds: (1) a true powers-of-ten dive across 4 scales in one camera path, (2) real NASA plate integrated as an object in the Blender scene, (3) **crisp final-resolution text layer** (fixes the soft-text feedback), (4) instanced 50,000-piece pumice raft with physics-free analytic bobbing, (5) 24 fps source at final resolution for key shots (not 12 fps upscaled).

## Asset families (≥5)
| Scene | Primary visual | Families |
|---|---|---|
| s1-2 | pumice stone macro, floats in a glass of water | Blender 3D (procedural stone, water, caustics), crisp text layer |
| s3 | cutaway: bubbles in the stone, air cells | Blender 3D, data object (density bar stone vs water) |
| s4-5 | dive from ocean to orbit over the Bismarck Sea | Blender 3D globe patch, real NASA GIBS plate, instrument HUD |
| s5 | raft growing across the plate with time scan | real imagery, instanced 3D raft, range line + readout |
| s6 | the legend: a floating stone beside a bridge silhouette | Blender 3D, text (kahani label) |
| s7 | your pumice stone (foot scrub) in a bucket + CTA | Blender 3D, end card, earshot SFX, cloned voice |
Families used: 6 (Blender 3D props/water, real NASA imagery plate, instanced raft particles, data/HUD instruments via crisp text layer, earshot SFX + cloned voice, glass/caustics lighting).

## Shot list (authored; locked between moves)
| t | line | camera | object | label |
|---|---|---|---|---|
| 0-4 | 1 | locked macro, then 0.4 s push on splash | stone dropped into water, floats, bobs | "DOOBA? NAHI." |
| 4-12 | 2 | slow orbit 40 deg around stone on water | stone close-up, bubbles pore texture | "PUMICE" |
| 12-22 | 3 | dolly into the stone, cutaway slice | air cells glow; density bar 0.3 vs 1.0 (ILLUSTRATIVE) | "BULBULE = HALKA" |
| 22-32 | 4 | crane up from sea to high oblique | ocean, vent plume, Bismarck Sea plate rises | "MAI 2026 · BISMARCK SEA" |
| 32-46 | 5 | dive-to-nadir then climb, range line | MODIS plate, raft scan front, 400 km² square for scale | "NASA / MODIS" |
| 46-55 | 6 | whip pan to dusk shoreline | floating stone and bridge silhouette | "KAHANI · AASTHA" |
| 55-62 | 7 | pull-back to bucket, end card | foot-scrub pumice in bucket, nerdlogic.co | CTA |

## Audio brief
Water drop and plop on s1, glassy bubble ticks s3, low sub swell on the dive, scan sweep, soft bell for the legend, dry-then-wet palette; earshot first, Openverse CC0 if a host downloads.

## Guardrails
No Ram Setu = pumice claim. No "Sicily" or unverified Nov numbers. NASA credit on screen/caption, no logo/endorsement. Raft scale labelled "approx." Home-test: "asli volcanic pumice" only (many scrubbing stones are not).
