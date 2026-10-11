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
