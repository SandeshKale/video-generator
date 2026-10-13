# Mockup review v2: reel #01 "You've never heard YOU" (animated preview)

**Open `preview.mp4`** (15 s, 1080x1920@60, designed sound but **no voice**: the voice-over will come from your avatar clips). Stills: `sheet.jpg` (six moments), `trans_sheet.jpg` (frames inside both transitions, taken from the final MP4). `build.mjs` + `site/` are the reusable foundation of the full build; `audio.py` is the preview sound design.

## What changed since v1, per your feedback
| Feedback | Change |
|---|---|
| 1. More polished | Real photographic head as the plate, cinematic grade (cool shadows, vignette, grain, dust), glass panels with backdrop blur, glowing signal colours, step tracker (1-4, top right), kinetic type, a hand-drawn rough.js circle, a stamped amber chip with a screen shake, live sound arcs and a playing voice-note waveform. |
| 2. Change the big type | The last line is now **"Only you hear it."** (two lines, coral on "you"). The caption pill keeps the full sentence, so the two no longer repeat each other. |
| 3. More realistic | The mannequin is gone. The head is an **AI-generated photoreal portrait (RealVisXL), mirrored so the face looks right, with depth-map parallax**; the X-ray inside the lens is a **generated radiograph registered to the ear**, so the skull, jaw and ear canal line up with the face. Fictional person: it needs an "AI IMAGE" tag in the full build (see below). |
| 4. Logical pose | The wince is now an Open Peeps bust **holding a device with a worried face** (instead of a figure running away), in a glass card next to the phone. |
| Cinematic camera moves | The camera is a real parameter: slow push-in with parallax on the plate; **lens push-through** (0 → 4.9 s: the camera dives into the X-ray lens, flash, you emerge inside the X-ray plate for the poll); **whip pan with motion blur and a short bloom** from the poll to the plugged-ears scene (9.3 → 10.2 s); the plugged-ears scene pushes in slowly; the photo softens and desaturates during the muffled moment. Elements enter on their own beats (springy overshoot), not all at once. |
| More asset families | See the audit below. |
| Voice = trading pipeline | `avatar-prompts.md`: three prompts (≤ 15 s each) for the same avatar, rules R1-R15 applied, 0 FAIL on the checker (one length warning on Part 1, 3507 of 4000 chars). Only the avatar's **audio** is used; no face in this reel. The designed pauses are inserted in the edit. |

## Asset-family audit (the question "would more families improve anything?")
| Family | In v2 | Verdict |
|---|---|---|
| Photoreal AI still + depth parallax | head plate, X-ray plate | **Core** of the realism; keeps the camera moves honest |
| Generated X-ray image | lens contents, poll background | **New and the biggest single upgrade** (realistic inside view, lens is logical) |
| Open Peeps | wince card | Right tone for "illustrated person", logical poses available |
| Bespoke SVG data objects | diverging bars, rings, arcs, tracker | Needed; all pure functions of t |
| rough.js | hand-drawn circle | Small, adds a human mark |
| Phosphor icons | book, flask, warning, ear, hand, speaker | Fine |
| Real-footage overlays | dust (screen) + film grain (multiply) | **Helps**: removes the "clean render" look; keep grain low |
| Kinetic type | word-by-word headlines, stamp | Helps |
| Audio family | synth bed, whooshes, bar ticks, stamp, muffled low-pass | Helps; the muffle demonstrates the claim |
| **Tried and removed:** Blender mannequin head | v1 | **Hurt**: next to a photoreal head it looks like a toy. Blender should do **objects**, not people. |
| **Tried and removed:** humaaans | v1 | Poses are walking/running; none holds a phone logically |
| Not used (no job in these scenes): CMU mocap, Lottie, Unsplash, GSAP | | Skipped on purpose; adding them would be decoration |
**For the full build, worth adding:** a Blender macro of the **ear canal + cochlea** (glass, emissive routes) for "two routes to your ears", and a glossy Blender phone for the hook; CC0 UI ticks from `assets/sfx/uisfx` under the bar rises. That makes 9-10 families with every one doing a job.

## Honest limits and open points
- **Realism and AI disclosure:** the head is a generated, fictional person. Every use needs a visible "AI IMAGE" tag (and the caption line), and I wrote the script's "no real person on screen" as "no real person" (a fictional face is allowed, but say it).
- **Plate resolution:** generated at 576x1024 and upscaled 1.9x; it reads soft on a phone only at the very closest push. A second pass at a higher resolution is possible if you want it sharper (about 15 minutes per image on this CPU).
- **Face looks closed-mouth** (it is a still). That's fine because the voice is off-screen here; the face-open test (reels #05-#07) will use your avatar.
- **Quiet tail:** frame-to-frame motion never drops to zero (min mean diff 1.0 on a 0-255 scale), but the last ~2.5 s only has slow changes (swelling rings, pulsing chip). Under the 2-second change rule the full build must add a visible event there (for example a ripple on the "ever" word or the end-card pop).
- **AI IMAGE tag** is on every frame, top right of the eyebrow row.
- **Not run yet (they need the final timeline):** `check.mjs`, `visual-validate.mjs`, `change-cadence.mjs`. Checked by eye: contact sheets of six moments and ten frames inside the transitions, on the final MP4.
- **Not auditioned:** no playback here; levels measured only (peak -1.9 dBFS, mean -15 dB).
- Timeline is compressed to 15 s for the preview; the real reel runs 30 s on the script's beat sheet.

## Please decide
1. Is the look polished enough, and is the **realistic AI portrait + generated X-ray** the direction? (If you prefer a different person, hair or gender, say so before the full build; a new portrait takes ~8 min.)
2. Is **"Only you hear it."** the big line you want?
3. OK to add the Blender ear-canal macro and phone for the full build?
4. When you're ready on Friday: generate **Part 1** from `avatar-prompts.md` and send it.
