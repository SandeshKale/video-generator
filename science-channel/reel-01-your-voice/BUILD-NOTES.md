# Build notes: reel #01 "You've never heard YOU" (30 s, 1080x1920@60)

**Files:** `reel.mp4` (21 MB, with scratch voice), `cover.png`, `caption.md` (caption, top-5 hashtags, pinned comment, alt text, platform settings), `avatar-prompts.md`, `VOICE-SWAP.md`, `site/` (the page), `build.mjs`, `audio_full.py`, `check.mjs`, `trans_sheet.jpg` (frames inside every transition, from the final MP4), `sheet.jpg` (six scene frames).

## What is in it (12 beats, 9 scene types)
Hook (photoreal AI head + generated X-ray lens, coral bone ring, voice-note phone, Open Peeps wince) → **dive into the lens** → Blender ear/cochlea macro with the air route (cyan) and bone route (coral) drawn on projected points → audience row lights up (air only) → whip pan → mic-phone with the bone route snapping off → **dive into the mic** → "higher or lower?" guess beat with a closing timer ring → poll (theory vs 2025 study, amber chip, hand-drawn circle) → whip pan → friend who never plays the voice note (rough X, share chip) → vertical tilt → plugged ears (lens, plug, hand, headphones chip) → muffled silence (mix low-passed, photo softens) → "Only you hear it." with a ring burst on "ever" → dive through the ring → end card (next-episode tease, FOLLOW press, scrolling coming-up tape) → last 0.45 s crossfades to frame 0 for a seamless loop.
All scene cuts, word cues, captions and SFX derive from `timing.js` (voice line and word times), so swapping the voice re-times the whole reel.

## Asset families (11)
Photoreal AI still + depth parallax (head), generated X-ray image (lens contents and plates), Blender 3D (ear canal, ossicles, cochlea in a wire plate; 16 camera positions scrubbed by t), Open Peeps (two different people and poses), bespoke SVG data objects (routes, rings, diverging bars, timer ring, audience row), rough.js hand-drawn marks, Phosphor icons, real-footage overlays (dust + film grain), kinetic type and live captions, synth score + event SFX aligned to the page's event list, voice (scratch now).
Tried and dropped earlier: Blender mannequin head, humaaans.

## Validated
- `bun ../../scripts/change-cadence.mjs science-channel/reel-01-your-voice/site` → **0 stretches over 2 s** (longest gap 1.25 s; it flagged a 2.5 s static stretch in the poll scene at first, fixed with a scan band, a ghost bar, ripples and a bobbing arrow).
- `bun check.mjs` (safe zone x 150-918 / y 140-1536, caption band, overlaps between text components, sampled every 0.5 s): 7 remaining items, all deliberate: the voice-note bubble sliding in from the left edge at 18.3 s, the bubble and "SEEN" tag laid over the friend card, and the poll labels over their panel.
- Frames: 24 inside the transitions plus 6 scene frames from the final MP4, and a 24-frame sweep from the page before rendering.
- Audio: -14.6 LUFS, true peak -1.2 dBFS. Voice over music is **15.7 dB** on the scratch voice (target 16-20; the creator has asked for music to stay audible, so I kept it at the low end).
- Frame 0 is fully composed and moving; the voice starts at 0.00 s; no scene transition before 3.3 s.

## Not validated / known weak spots
- **The voice is a scratch voice (Kokoro).** Nothing about pacing, accent or mix is final until the avatar clips are stitched in; the numbers above must be re-measured after the swap.
- **Audio not auditioned** (no playback here), only measured.
- The generated portrait is 576x1024 upscaled, so it is soft at the closest push; the ear macro is clean but diagrammatic. A higher-resolution portrait pass is possible (about 15 min per image).
- The caption highlight follows each line by character count (so it stays in step with any voice), not the true word times; a mis-timed word is possible by about 0.2 s.
- Not yet downloaded to a phone: check the safe zone on a real device before posting.
- The disclosure for the generated people and images is on every frame ("AI IMAGE") and in the caption.
