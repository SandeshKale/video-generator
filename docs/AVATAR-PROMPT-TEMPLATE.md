# Avatar prompt template (subtle / natural) — reuse for every host reel

Generated from the Oct 2026 feedback: "improve and tighten the avatar prompts for a more natural and subtle feel". Use `reels/tech/reel-ai-offline-laptop/avatar-prompts.md` as the worked example; replace only MOOD BY SECTION, SCRIPT and TIMING per part.

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend explaining something over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes. Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words.
- Hands: subtle, slightly restrained gestures that support the words, like a credible expert explaining calmly: two or three small, slow movements per clip, kept low near the chest, then back to rest. Open palm or a gentle 'one point' hand shape only. Natural five-finger hands, no pointing at the camera, no waving, no fast or repeated movements, no hands crossing the face.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate.
VOICE: warm, grounded, conversational Indian-English accent with natural chest resonance, at an everyday pace; sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement like real conversation: lighter and slightly higher on a question, lower and a touch slower on the key instruction, a short pause before the most important line, statements ending downward. Small human pauses at commas and between sentences; at most one lightly stressed word per sentence; slightly softer on asides. No announcer tone, no sing-song, no robotic flatness.
MOOD BY SECTION: {beats}
SCRIPT: "{script}"
TIMING: begin speaking at {start}. Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

**Rules of thumb**
- Keep it under ~3.4k characters (the tool's limit is 4000); every extra directive is another thing to over-perform.
- One mood note per ~5 s section, never per word. No timed brow/smile commands.
- Always: eyes on the lens, blinks every 3-5 s (none in the first second), ≤ 2 nods, 2–3 small restrained hand gestures (R14), no on-screen text.
- Voice: conversational pace, ≤ 1 stressed word per sentence, no pitch-rise/drop rules.
- Generate Part 1 first and review before running the rest.

**Pronunciation (added Oct 2026, after the avatar's "tokenizer" came out as "Transiter"):**
- Add a `PRONUNCIATION:` line to each part, listing only that part's hard words with a respelling (e.g. 'Claude' = 'klawd', 'SEBI' = 'SAY-bee').
- Write abbreviations and symbols in the SCRIPT line the way they should be spoken: "F and O", "F Y twenty-five", "static I-P", "Co-work", "web-hook". The captions get the proper forms back in the edit.
- Put a pronunciation table at the top of `avatar-prompts.md`, so the creator can listen for those words in each clip before generating the next one.

## Rules log: every avatar instruction so far, in one place (Oct 2026)

Before delivering prompts, **run `python3 scripts/check-avatar-prompts.py <reel>/avatar-prompts.md` and get 0 FAIL**. It checks R1–R16 below. The template above is the starting point; this log wins where they differ.

| # | Rule | Source |
|---|---|---|
| R1 | Identity lock: match the photo exactly in every frame; no beautifying. | Shopping-agent reel (distortion: "pathetic. everything is distorted") |
| R2 | Camera on a tripod, black background with depth; **framing, light and attire identical across all parts** (same photo). | Shopping / tokens reels |
| R3 | **≤ 4000 characters per prompt** (hard limit). Aim for ~2.6–3.4k (the hands and voice lines from R14/R15 add about 500), because every extra directive gets over-performed. | Creator: "avatar prompts need to be max 4000 characters long" |
| R4 | **Part 1, 0–3 s: ENTHUSIASTIC AND ENGAGING.** Bright, energetic, a confident open smile, a little quicker, still natural (no shouting, no wide eyes, no head bobbing). After 3 s it settles. Only Part 1 gets this. | Creator: "make the avatar say something interesting from 0s to 3s in an enthusiastic and engaging manner" (tokens reel) |
| R5 | **MOOD BY SECTION:** 2–3 time sections per part, with at most one light word-anchored cue per section (a nod, a brow lift, a faint smile or a lean on a key word). Never cues per word. | Creator: "improve and tighten the avatar prompts for more natural and subtle feel" (offline-laptop template) |
| R6 | **Eyes always on the lens.** Tiny eye movements always return to the lens; the hook and CTA are dead-on camera. | Creator: "the host needs to keep on looking at the camera instead of here and there" |
| R7 | Blinks every 3–5 s and none in the first second; ideally on clause boundaries. | Same message: "eye, blinking and eyebrow expressions match the script" |
| R8 | **Restraint:** ≤ 2 small nods per clip, faint smile only, no raised-brow acting, no cheek bunching. (*Hands: superseded by R14.* This used to say "no hand gestures".) | Subtle template |
| R9 | **Voice:** warm, conversational Indian-English, everyday pace (slightly slow, not fast), small pauses, ≤ 1 stressed word per sentence, tonal change carried by the mood sections. **No synthetic um/uh.** | Creator: "voiceover should be expressive enough with tonal changes" and "uh and ums are not natural enough. Person is speaking too fast" |
| R10 | **Expressions and head movement follow the script:** a brow lift on questions, an inner-brow raise on a "catch", a nod on the key line, a lean-in on the hook and CTA, stillness on dry facts. Only a light cue per section in the prompt (R5); the full per-sentence table lives in `script.md` for checking the clips. | Creator: "head movement should match the script" |
| R11 | **PRONUNCIATION line in every part** for that part's hard words. Write the SCRIPT in spoken form: no digits or symbols ("G P T six", "builder equals Codex", "A-I"). | Creator: "clearly mention the pronunciation for complex words to avoid tokenizer like issues" |
| R12 | ≤ ~34 words per 15 s part. Part 1 begins speaking at 0.0 s and the others at about 0.3 s. Finish by ~14.2 s, then a silent closed mouth. | Pacing feedback; stitch needs the tail |
| R13 | **No on-screen text or subtitles** (the avatar tool burned subtitles into the adobe clips). | Adobe-clones reel |
| R14 | **Hands: subtle, slightly restrained gestures** for credibility. Use 2–3 small, slow movements per clip, kept low near the chest and then back to rest. Allowed shapes: an open palm or a gentle 'one point'. Framing is mid-chest up, so the hands show. Natural five-finger hands; no pointing at the camera, no waving, no fast or repeated motions. At most one gesture cue per mood section, tied to a key word, and counted together with nods. **Check every clip for hand artifacts** (extra or merged fingers) and regenerate a part that has any. | Creator, 13 Oct 2026: "involve subtle and slightly restrained hand gestures as well for the avatar to improve credibility" |
| R15 | **Voice tone:** grounded and warm with chest resonance; dry, close-mic sound (no echo or reverb). Natural pitch movement: lighter on questions, lower and slower on the key instruction, a short pause before the most important line, statements ending downward. Keep R9's limits (≤ 1 stressed word per sentence, no sing-song). | Creator, 13 Oct 2026: "toning of the voiceover can also be a bit better", following the SynthID feedback "a lot of reverb… clean, sharp with right amount of bass" |
| R16 | **Comedy / roast hosts are expressive, not deadpan.** Declare `PERFORMANCE (expressive and playful, never over the top):` and replace R8's face line with an expressive one: amused eyes, a knowing half-smirk and a quick one-sided brow lift on punchlines, then back to warm neutral. It must keep the guardrail "No mugging, no cartoonish faces, no wide-eyed acting, no cheek bunching". Nods (≤ 2), gaze, blinks, hands and voice limits are unchanged; the voice gets a short pause before each punchline, which lands with a little bite, not shouted. | Creator, 18 Oct 2026: "no deadpan hosting. first 2-3s have to be hooky" (`docs/STYLE-ROAST-EXPLAINER.md` B7) |
| R17 | **Fast mode, only when the creator asks for it.** Declare `PACE: FAST AND PUNCHY` in the VOICE line: brisk, rapid, high-energy delivery that still lands every syllable, very short breath pauses, numbers said crisply. Up to ~48 words per 15 s part (36–46 is the target), still finishing by ~14.2 s. R9's "everyday pace" does not apply in this mode; every other rule does. | Creator, 19 Oct 2026: "avatar videos need to be as fast as they can be to pack in more and more content in 60s" |

**What went wrong on the Claudex reel, and why this log exists:** the first draft passed the template but packed in extra word cues. The "fix" then overcorrected. It stripped every cue (against R10) and toned down the 0–3 s hook (against R4), because R4 lived only in past prompts and chat, not in the template. Both are now written down here and enforced by the checker.

**Known gaps in older shipped sets** (left as shipped; they don't need regenerating):
- The tokens reel predates R11 and has no PRONUNCIATION lines; "tokenizer" came out as "Transiter".
- Trading-reel Part 3 says "Claude" without a respelling.
