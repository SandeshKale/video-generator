# Avatar prompt template (subtle / natural) — reuse for every host reel

Generated from the Oct 2026 feedback: "improve and tighten the avatar prompts for a more natural and subtle feel". Use `reel-ai-offline-laptop/avatar-prompts.md` as the worked example; replace only MOOD BY SECTION, SCRIPT and TIMING per part.

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend explaining something over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical head-and-shoulders, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a black background with depth. Attire: suit, static.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes. Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words. No hand gestures.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate.
VOICE: warm, calm, conversational Indian-English accent at an everyday pace, with small human pauses at commas and between sentences. Gentle intonation; at most one lightly stressed word per sentence; slightly softer on asides. No announcer tone, no sing-song, no robotic flatness.
MOOD BY SECTION: {beats}
SCRIPT: "{script}"
TIMING: begin speaking at {start}. Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

**Rules of thumb**
- Keep it under ~2.6k characters (the tool's limit is 4000); every extra directive is another thing to over-perform.
- One mood note per ~5 s section, never per word. No timed brow/smile commands.
- Always: eyes on the lens, blinks every 3-5 s (none in the first second), ≤ 2 nods, no hand gestures, no on-screen text.
- Voice: conversational pace, ≤ 1 stressed word per sentence, no pitch-rise/drop rules.
- Generate Part 1 first and review before running the rest.

**Pronunciation (added Oct 2026, after the avatar's "tokenizer" came out as "Transiter"):**
- Add a `PRONUNCIATION:` line to each part, listing only that part's hard words with a respelling (e.g. 'Claude' = 'klawd', 'SEBI' = 'SAY-bee').
- Write abbreviations and symbols in the SCRIPT line the way they should be spoken: "F and O", "F Y twenty-five", "static I-P", "Co-work", "web-hook". The captions get the proper forms back in the edit.
- Put a pronunciation table at the top of `avatar-prompts.md`, so the creator can listen for those words in each clip before generating the next one.

## Rules log: every avatar instruction so far, in one place (Oct 2026)

Before delivering prompts, **run `python3 scripts/check-avatar-prompts.py <reel>/avatar-prompts.md` and get 0 FAIL**. It checks R1–R13 below. The template above is the starting point; this log wins where they differ.

| # | Rule | Source |
|---|---|---|
| R1 | Identity lock: match the photo exactly in every frame; no beautifying. | Shopping-agent reel (distortion: "pathetic. everything is distorted") |
| R2 | Camera on a tripod, black background with depth; **framing, light and attire identical across all parts** (same photo). | Shopping / tokens reels |
| R3 | **≤ 4000 characters per prompt** (hard limit). Aim for ~2.2–2.9k, because every extra directive gets over-performed. | Creator: "avatar prompts need to be max 4000 characters long" |
| R4 | **Part 1, 0–3 s: ENTHUSIASTIC AND ENGAGING.** Bright, energetic, a confident open smile, a little quicker, still natural (no shouting, no wide eyes, no head bobbing). After 3 s it settles. Only Part 1 gets this. | Creator: "make the avatar say something interesting from 0s to 3s in an enthusiastic and engaging manner" (tokens reel) |
| R5 | **MOOD BY SECTION:** 2–3 time sections per part, with at most one light word-anchored cue per section (a nod, a brow lift, a faint smile or a lean on a key word). Never cues per word. | Creator: "improve and tighten the avatar prompts for more natural and subtle feel" (offline-laptop template) |
| R6 | **Eyes always on the lens.** Tiny eye movements always return to the lens; the hook and CTA are dead-on camera. | Creator: "the host needs to keep on looking at the camera instead of here and there" |
| R7 | Blinks every 3–5 s and none in the first second; ideally on clause boundaries. | Same message: "eye, blinking and eyebrow expressions match the script" |
| R8 | **Restraint:** ≤ 2 small nods per clip, no hand gestures, faint smile only, no raised-brow acting, no cheek bunching. | Subtle template |
| R9 | **Voice:** warm, conversational Indian-English, everyday pace (slightly slow, not fast), small pauses, ≤ 1 stressed word per sentence, tonal change carried by the mood sections. **No synthetic um/uh.** | Creator: "voiceover should be expressive enough with tonal changes" and "uh and ums are not natural enough. Person is speaking too fast" |
| R10 | **Expressions and head movement follow the script:** a brow lift on questions, an inner-brow raise on a "catch", a nod on the key line, a lean-in on the hook and CTA, stillness on dry facts. Only a light cue per section in the prompt (R5); the full per-sentence table lives in `script.md` for checking the clips. | Creator: "head movement should match the script" |
| R11 | **PRONUNCIATION line in every part** for that part's hard words. Write the SCRIPT in spoken form: no digits or symbols ("G P T six", "builder equals Codex", "A-I"). | Creator: "clearly mention the pronunciation for complex words to avoid tokenizer like issues" |
| R12 | ≤ ~34 words per 15 s part. Part 1 begins speaking at 0.0 s and the others at about 0.3 s. Finish by ~14.2 s, then a silent closed mouth. | Pacing feedback; stitch needs the tail |
| R13 | **No on-screen text or subtitles** (the avatar tool burned subtitles into the adobe clips). | Adobe-clones reel |

**What went wrong on the Claudex reel, and why this log exists:** the first draft passed the template but packed in extra word cues. The "fix" then overcorrected. It stripped every cue (against R10) and toned down the 0–3 s hook (against R4), because R4 lived only in past prompts and chat, not in the template. Both are now written down here and enforced by the checker.

**Known gaps in older shipped sets** (left as shipped; they don't need regenerating):
- The tokens reel predates R11 and has no PRONUNCIATION lines; "tokenizer" came out as "Transiter".
- Trading-reel Part 3 says "Claude" without a respelling.
