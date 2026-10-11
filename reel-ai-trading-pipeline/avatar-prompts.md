# Avatar prompts — "A trading bot that can't panic." (6 parts × ≤ 15 s)
**Built on `AVATAR-PROMPT-TEMPLATE.md`, with every earlier guardrail kept:**
- tone first, identity lock, eyes always back on the lens;
- ≤ 2 nods, blinks every 3–5 s and none in the first second;
- no hand gestures, ≤ 1 stressed word per sentence;
- **no on-screen text or subtitles**;
- the same photo, framing, light and attire across all six parts;
- each prompt is ~2.5–2.9k characters (limit 4000).

**The hook (0–3 s):** Part 1 opens with real energy on "TradingView just plugged straight into Claude!": bright, a confident smile, a bit more pace, still no shouting or wide eyes. After 3 s it settles into the usual calm.

## Pronunciation (new: prevents the "tokenizer → Transiter" problem)
Two layers of protection:
1. **Each prompt has a PRONUNCIATION line** covering only the hard words in that part.
2. **Risky words are already written the way they should be spoken** in the SCRIPT lines.
   - "F&O" → "F and O"; "FY25" → "F Y twenty-five"; "IP" → "I-P"; "Cowork" → "Co-work"; "webhook" → "web-hook".
   - The avatar reads the spelling literally, so symbols and abbreviations never reach it.
   - The on-screen captions still show the proper forms (F&O, FY25, static IP, Cowork, webhook); I fix them in the edit.

| Word | Say it as | Where |
|---|---|---|
| TradingView | "trading view" (two clear words) | P1, P2, P3 |
| Claude | "klawd" (rhymes with *clawed*, one syllable) | P1, P2, P4 |
| Claude Code | "klawd code" | P2, P4 |
| Pine Script | "pine script" (like the tree) | P3 |
| webhook | "WEB-hook" (two syllables, stress on WEB) | P3, P4 |
| two-factor | "two factor" | P3 |
| static IP | "static eye-pee" (spell I and P) | P4 |
| Cowork | "co-WORK" (like *coworker* without *-er*) | P5 |
| SEBI | "SAY-bee" (two syllables; never spell the letters) | P6 |
| F&O | "eff and oh" | P6 |
| FY25 | "eff wye twenty-five" | P6 |

**How to run:** use the same photo for all six parts. **Generate Part 1 first and check:**
- Does the 0–3 s hook feel energetic but natural?
- Is "TradingView" two clear words?
- Is "Claude" said as one syllable ("klawd"), not "clow-dee" or "clod"?

If yes, run the rest. **After each part, listen to its pronunciation-table words before moving on.** If one is off, regenerate that part with the phonetic spelling swapped into the SCRIPT line, e.g. "klawd" for "Claude" or "SAY-bee" for "SEBI". I also check every clip with Whisper on arrival and flag any word it can't recognise.

**Ending:** Part 6 keeps "follow for the build" (a promise of a follow-up build reel). If you'd rather not commit to that, use the shortened line, which ends "follow for more".

## Part 1 of 6  (2856 characters, 28 words)

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend walking you through a smart setup over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical head-and-shoulders, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a plain black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes (brighter and more open only in the 0-3s hook). Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words. No hand gestures.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate.
VOICE: warm, calm, conversational Indian-English accent at an everyday pace (a touch brighter and quicker only in the 0-3s hook), with small human pauses at commas and between sentences. Gentle intonation; at most one lightly stressed word per sentence; slightly softer on asides. No announcer tone, no sing-song, no robotic flatness.
PRONUNCIATION: 'TradingView' = two clear words, 'trading view'. 'Claude' = 'klawd' (rhymes with 'clawed', one syllable).
MOOD BY SECTION: 0-3s ENTHUSIASTIC AND ENGAGING: bright, energetic delivery with a confident open smile, a little more vocal energy and a slightly quicker pace, like excitedly sharing big news with a friend; eyes locked on the lens; still natural (no shouting, no wide-eyed acting, no head bobbing); 3-9s settle into a dry, knowing tone, a faint smile on 'Not a get-rich bot', one small nod on 'disciplined'; 9-14s calm and confident on 'Four blocks'.
SCRIPT: "TradingView just plugged straight into Claude! So I asked Claude to build me a trading pipeline. Not a get-rich bot. A disciplined one, that can't panic. Four blocks."
TIMING: begin speaking at 0.0 s, no lead-in (this is the opening hook). Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

*Shortened line if it overruns 15 s:* "TradingView just plugged straight into Claude! So I asked Claude to build a trading pipeline. Not a get-rich bot. A disciplined one. Four blocks."

## Part 2 of 6  (2468 characters, 31 words)

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend walking you through a smart setup over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical head-and-shoulders, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a plain black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes. Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words. No hand gestures.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate.
VOICE: warm, calm, conversational Indian-English accent at an everyday pace, with small human pauses at commas and between sentences. Gentle intonation; at most one lightly stressed word per sentence; slightly softer on asides. No announcer tone, no sing-song, no robotic flatness.
PRONUNCIATION: 'TradingView's' = 'trading views'. 'Claude' = 'klawd'. 'Claude Code' = 'klawd code'.
MOOD BY SECTION: 0-5s clear and practical, like naming a step; 5-11s steady and informative, nearly still; 11-14s wry and approving on 'It can't place trades. Good.', one small nod on 'Good'.
SCRIPT: "Block one: the brain. Add TradingView's official connector to Claude. One command in Claude Code. Now it reads charts, runs screeners, pulls news, and sets alerts. It can't place trades. Good."
TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

*Shortened line if it overruns 15 s:* "Block one: the brain. Add TradingView's official connector to Claude, one command in Claude Code. It reads charts, screeners, news, sets alerts. It can't place trades. Good."

## Part 3 of 6  (2479 characters, 32 words)

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend walking you through a smart setup over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical head-and-shoulders, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a plain black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes. Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words. No hand gestures.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate.
VOICE: warm, calm, conversational Indian-English accent at an everyday pace, with small human pauses at commas and between sentences. Gentle intonation; at most one lightly stressed word per sentence; slightly softer on asides. No announcer tone, no sing-song, no robotic flatness.
PRONUNCIATION: 'Pine Script' = 'pine script' (like the tree). 'TradingView' = 'trading view'. 'web-hook' = 'WEB-hook' (two syllables, stress on WEB). 'two-factor' = 'two factor'.
MOOD BY SECTION: 0-7s clear and practical; 7-14s firm and clear on 'you create yourself', slight focus in the eyes, no smile.
SCRIPT: "Block two: the signal. Ask Claude to write your strategy in Pine Script, then backtest it in TradingView. The web-hook alert, you create yourself. It needs two-factor login, and a paid plan."
TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

*Shortened line if it overruns 15 s:* "Block two: the signal. Claude writes your strategy in Pine Script; backtest it in TradingView. The web-hook alert, you create yourself. It needs two-factor login and a paid plan."

## Part 4 of 6  (2451 characters, 33 words)

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend walking you through a smart setup over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical head-and-shoulders, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a plain black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes. Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words. No hand gestures.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate.
VOICE: warm, calm, conversational Indian-English accent at an everyday pace, with small human pauses at commas and between sentences. Gentle intonation; at most one lightly stressed word per sentence; slightly softer on asides. No announcer tone, no sing-song, no robotic flatness.
PRONUNCIATION: 'Claude Code' = 'klawd code'. 'web-hook' = 'WEB-hook'. 'static I-P' = 'static eye-pee' (spell the letters I and P).
MOOD BY SECTION: 0-8s clear and practical, steady pace; 8-14s a serious heads-up on 'In India', slight inner-brow raise and a slight lean toward the lens.
SCRIPT: "Block three: the hands. Claude Code writes a small web-hook server. It checks a secret, your risk limits, then sends the order to your broker. In India, that needs a static I-P now."
TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

*Shortened line if it overruns 15 s:* "Block three: the hands. Claude Code writes a small web-hook server. It checks a secret and your risk limits, then sends the order to your broker. In India, that needs a static I-P now."

## Part 5 of 6  (2374 characters, 29 words)

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend walking you through a smart setup over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical head-and-shoulders, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a plain black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes. Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words. No hand gestures.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate.
VOICE: warm, calm, conversational Indian-English accent at an everyday pace, with small human pauses at commas and between sentences. Gentle intonation; at most one lightly stressed word per sentence; slightly softer on asides. No announcer tone, no sing-song, no robotic flatness.
PRONUNCIATION: 'Co-work' = 'co-WORK' (like 'coworker' without the -er).
MOOD BY SECTION: 0-9s calm and practical; 9-14s reassuring and warm on 'Nothing changes until you approve it', one small nod on 'approve'.
SCRIPT: "Block four: the supervisor. A Co-work scheduled task reads your trade log every evening, even with your laptop off, and flags anything weird. Nothing changes until you approve it."
TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

*Shortened line if it overruns 15 s:* "Block four: the supervisor. A Co-work scheduled task reads your trade log every evening, even with your laptop off, and flags anything weird. You approve every change."

## Part 6 of 6  (2575 characters, 34 words)

```
Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is natural, relaxed and understated, like a friend walking you through a smart setup over coffee. Not an announcer, not a presenter, not acting.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical head-and-shoulders, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a plain black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (keep it subtle):
- Gaze: soft, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: neutral-warm with a faint natural smile that comes and goes. Eyebrows move only slightly and only with meaning. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: nearly still, with natural breathing and micro-movement. At most two small nods in the whole clip, on key words. No hand gestures.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate.
VOICE: warm, calm, conversational Indian-English accent at an everyday pace, with small human pauses at commas and between sentences. Gentle intonation; at most one lightly stressed word per sentence; slightly softer on asides. No announcer tone, no sing-song, no robotic flatness.
PRONUNCIATION: 'SEBI' = 'SAY-bee' (two syllables, never spell the letters). 'F and O' = 'eff and oh'. 'F Y twenty-five' = spell 'eff wye', then 'twenty-five'.
MOOD BY SECTION: 0-8s sober and sincere, no smile, slight inner-brow raise on 'ninety-one percent', head still; 8-10s firm on 'Paper trade first'; 10-14s warm and friendly for the ask, a small lean toward the lens on 'follow', eyes dead-on the lens.
SCRIPT: "Now, the honest part. SEBI found ninety-one percent of F and O traders lost money in F Y twenty-five. A bot just loses faster. Paper trade first. Save this, and follow for the build."
TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s, then rest silently with a relaxed closed mouth until 15 s.
AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles.
```

*Shortened line if it overruns 15 s:* "The honest part: SEBI found ninety-one percent of F and O traders lost money in F Y twenty-five. A bot loses faster. Paper trade first. Save this, and follow for more."
