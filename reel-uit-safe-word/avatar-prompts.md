# Avatar prompts: Use It Today #01, "Ask me this one question" (2 parts × ≤ 15 s), v2

**What's new in v2 (your feedback, 13 Oct):**
- **Hands (new rule R14):** two or three subtle, slightly restrained gestures per part (open palm or a gentle "one point"), kept low near the chest, then back to rest. Each gesture lands on a key line. The framing is now **mid-chest up** so the hands can show. Guardrails: natural five-finger hands, no pointing at the camera, no waving.
- **Voice tone (new rule R15):**
  - grounded and warm, with chest resonance
  - a dry, close-mic sound with no echo or reverb
  - natural pitch movement: lighter on the question, lower and slower on the key instruction, a short pause before the most important line, statements ending downward
  - each mood section also says how the voice should move

Everything else stays as before:
- R1–R13 still apply.
- The hook is still bright and engaging.
- Use the same photo for both parts.
- `scripts/check-avatar-prompts.py` now enforces R14 and R15.

## Pronunciation
| Word | Say it as | Where |
|---|---|---|
| AI | "A-I" (spell the letters) | P1 |
| safe | clear, not swallowed (it's the comment keyword) | P2 end |

**How to run:** generate Part 1 first and check:
- **Hands:** they move 2–3 times, stay small and low, and have five normal fingers with no merging. If you see artifacts, regenerate.
- **Voice:** the question sounds lighter, "copy anyone's voice" drops lower, and there's no echo.
- **Hook and eyes:** the hook feels engaging, the eyes stay on the lens, and the clip finishes by ~14.2 s.

Then run Part 2 and send both MP4s.

## Part 1 of 2 — hook  (3381 characters, 27 words)

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend giving you a useful safety tip over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying or airbrushing.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a plain black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes (brighter and more open only in the 0-3s hook). Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words.
- Hands: subtle, slightly restrained gestures that support the words, like a calm, credible expert: two or three small, slow movements per clip, low near the chest, then back to rest; open palm or a gentle 'one point' only. Natural five-finger hands, no pointing at the camera, no waving or fast movements.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech, moderate opening.
VOICE: warm, grounded, conversational Indian-English accent with natural chest resonance, at an everyday pace (a touch brighter and quicker only in the 0-3s hook); sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement like real conversation: lighter and slightly higher on a question, lower and a touch slower on the key instruction, a short pause before the most important line, statements ending downward. Small pauses at commas; at most one lightly stressed word per sentence. No announcer tone, no sing-song, no robotic flatness.
PRONUNCIATION: 'A-I' = spell the two letters. No other unusual words.
MOOD BY SECTION: 0-3s ENTHUSIASTIC AND ENGAGING: bright, alert delivery with a knowing half-smile and a little more vocal energy, like sharing a protective trick; eyes locked on the lens; still natural (no shouting, no wide-eyed acting, no head bobbing); a light brow lift and a small open-palm gesture on 'ask me one question'; 3-9s settle into a quieter, lower, concerned tone, a slight inner-brow raise on 'copy anyone's voice'; 9-14s warm and reassuring, voice lifting gently, one small nod on 'thirty-second fix'.
SCRIPT: "If I ever call you crying, asking for money... ask me one question first. Because scammers can now copy anyone's voice with A-I. Here's the thirty-second fix."
TIMING: begin speaking at 0.0 s, no lead-in (this is the opening hook). Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, teeth distortion, plastic skin, extra or merged fingers, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

## Part 2 of 2 — the fix  (3016 characters, 34 words)

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend giving you a useful safety tip over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying or airbrushing.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a plain black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes. Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words.
- Hands: subtle, slightly restrained gestures that support the words, like a calm, credible expert: two or three small, slow movements per clip, low near the chest, then back to rest; open palm or a gentle 'one point' only. Natural five-finger hands, no pointing at the camera, no waving or fast movements.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech, moderate opening.
VOICE: warm, grounded, conversational Indian-English accent with natural chest resonance, at an everyday pace; sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement like real conversation: lighter and slightly higher on a question, lower and a touch slower on the key instruction, a short pause before the most important line, statements ending downward. Small pauses at commas; at most one lightly stressed word per sentence. No announcer tone, no sing-song, no robotic flatness.
PRONUNCIATION: No unusual words. Say 'safe' clearly at the end.
MOOD BY SECTION: 0-5s calm and practical, an easy instructive tone, a small 'one point' hand gesture on 'safe word'; 5-10s lower, slower and firm, nearly still, a small calm downward palm on 'hang up'; 10-14s warm and sincere, softer voice, one small nod on 'your parents'.
SCRIPT: "Pick a family safe word today. Say it in person, never online. If a call needs money urgently, hang up, call back, and ask for the word. Send this to your parents. Comment safe."
TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, teeth distortion, plastic skin, extra or merged fingers, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```
