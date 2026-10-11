# "I'm not him." — the AI clone confesses (script + screenplay, ~70 s, 5 avatar parts)

**Logline:** The host of this channel says "Hi, I'm Sandesh. Actually… no." Then he admits he's the creator's AI clone, shows how little audio a voice clone needs, acts out the midnight "Ma, it's me" call, hands over the FBI's fix (a family safe word), and finally **fails the safe-word test on camera**. The weak spot is the reel's own host, and the reel shows how to beat it.
**Format:** a confession that turns into a public-service trick. It's built to be shared, not just watched. The CTA is **Send to the family group + Save + Follow**.
**Voice:** the creator's avatar, 5 clips ≤ 15 s, in the subtle prompt style (`avatar-prompts.md`), with two deliberate creative beats: a held pause after "Actually…" and **1.5 s of silence** during the test. Word times come from faster-whisper, as before.
**Facts:** all tier A (see `topic.md`). On screen: 3 s → 85 % match (McAfee researchers, 2023) · 47 % of Indians surveyed faced it or knew someone (20 % + 27 %) vs 25 % global · 70 % not confident they can tell · 77 % of victims lost money · FBI IC3 PSA, 3 Dec 2024: "Create a secret word or phrase with your family" · optional: OpenAI Voice Engine 15 s sample (2024, not publicly released).

## Why this one should travel
1. **The first 1.5 s interrupt the scroll:** a normal "Hi, I'm Sandesh" that takes itself back. Nobody expects a creator's avatar to out itself.
2. **Fear, then relief, then a task:** "could fool your mom", then the midnight call, then a one-word fix you can set up tonight.
3. **Indian and family-specific:** Ma, Papa, the midnight call, the family WhatsApp group. It's the exact share trigger ("send this to the family group").
4. **A safe comment hook:** "Ask me your family's safe word. *Not in the comments!*" It's funny, it gets people commenting, and it tells them not to post their real word.
5. **Honest by construction:** the AI disclosure comes in the first 2 s, an "AI CLONE" tag stays on the host the whole time, and the reel teaches defence only.

## Benchmark to beat (standing rule)
Previous ceiling: `reel-ai-offline-laptop` ("Wi-Fi off. AI on.", 73 s, 11 families). It had a split-flap step board, a streaming terminal, memory bins with depth-occluded robots, Blender laptop and plug frame sequences, and a recap card. Its **weaknesses**:
- the host was a window *beside* the story, never part of it;
- the S4 lower third and the narrow S9 host left empty-looking frames;
- the terminal output was illustrative, not real;
- contact sheets were only reviewed at full size (the ~360 px pass was skipped);
- the audio mix was never auditioned.

This reel does what none did before:
1. **The host is the subject.** The avatar *is* the story (an AI clone talking about AI clones), so every host appearance carries meaning: confession, line-up, video call, failed test.
2. **A face-tracked overlay on the avatar (new technique):** OpenCV face detection runs offline on `host.webm`, giving a per-frame face box (`site/facetrack.js`). A wireframe "clone mesh", landmark ticks and the FBI-tell callouts (glasses, teeth, eyes, lip-sync) follow the real head. All of it is a pure function of `t`.
3. **The clone line-up:** four copies of the host feed, each a different number of seconds into the clip (so they move independently) and each graded differently. They stand against a police height chart next to a polaroid of the real photo labelled ORIGINAL.
4. **A real stopwatch, not an illustration:** on "That's shorter than this sentence" a stopwatch times *the actual sentence the clone is speaking* (from the word timestamps). The 3.00 s mark lands mid-sentence and stamps "ENOUGH FOR AN 85 % MATCH". Nothing on screen is made up.
5. **Blender letter-wheel padlock** (procedural; five letter wheels whose rotation follows `t`): it spins while the fix is explained, and in the test it brute-forces, fails and shows DENIED.
6. **A new transition grammar, "photocopier pass":** a bright copier light-bar sweeps the frame, and the next scene appears as a fresh copy with a slight halftone/toner degradation that clears. Each "copy" is a clone of the last.
7. **Silence as a beat:** music and SFX drop to room tone for the 1.5 s the clone "doesn't know". It's the first deliberate dead-air moment in any reel here.
8. **QA carried over:**
   - occupancy check ≥ 65 %;
   - 2 render slices at a time;
   - contact sheets reviewed at full size **and ~360 px**;
   - a spectral balance check of voice versus music;
   - a host-crop frame-diff on the final MP4;
   - a check that the face-track stays locked (mesh-centre vs face-centre error ≤ 12 px on sampled frames).

## Voice-over in five avatar parts (≤ 15 s each; about 155 words in total)
**Part 1 (29 words)** — *scenes 1–3*
"Hi, I'm Sandesh. Actually… no. I'm not. I'm his AI clone. He typed this, I'm saying it. And if I can fool you, I could fool your mom."
**Part 2 (29 words)** — *scenes 4–5*
"Here's the scary part. McAfee researchers needed just three seconds of someone's audio to clone a voice with an eighty-five percent match. Three seconds. That's shorter than this sentence."
**Part 3 (33 words)** — *scenes 6–8*
"Picture your mom's phone at midnight. Your voice: 'Ma, it's me. I had an accident. Send money. Don't tell Papa.' Almost half of Indians surveyed had faced this, or knew someone who had."
**Part 4 (35 words)** — *scenes 9–10*
"The FBI's fix is simple. Pick a family safe word, something that's never been online. Not your pet's name. A call asks for money? Ask for the word. No word? Hang up and call back."
**Part 5 (29 words + a 1.5 s silence)** — *scenes 11–12*
"So, ask me your family's safe word. Not in the comments! … [silence] … I don't know it. That's the point. Set one tonight, send this to the family group, and follow."

## Performance track (standing host rule: eyes, brows, head, blinks per sentence; gaze always on the lens)
| Part · sentence | Emotion | Brow | Head | Blink | Notes |
|---|---|---|---|---|---|
| P1 "Hi, I'm Sandesh." | easy, friendly, normal | neutral | still | none (first second) | Must look like any ordinary video. |
| P1 "Actually… no. I'm not." | a small knowing smile | very slight lift on "Actually" | tiny tilt in the pause | at the pause | The pause after "Actually" is about 0.6 s. |
| P1 "I'm his AI clone. He typed this, I'm saying it." | calm, matter-of-fact, faintly amused | neutral | one small nod on "clone" | after "clone." | |
| P1 "…I could fool your mom." | quieter, sincere | slight inner-brow raise | slight lean-in | none | Dead-on camera. |
| P2 "Here's the scary part…" | level, informative | neutral | still | sentence break | Dry facts mean stillness. |
| P2 "Three seconds. That's shorter than this sentence." | light, a touch wry | slight lift on "shorter" | one small nod on "Three seconds" | after "seconds." | |
| P3 "Picture your mom's phone at midnight." | low, storytelling | neutral | still | — | |
| P3 the quoted line | **slightly hushed and hurried, like a phone call; still restrained** | faint worry | still | none | No crying, no acting big. |
| P3 "Almost half of Indians…" | back to normal voice, serious | neutral | small nod on "half" | sentence break | |
| P4 "The FBI's fix is simple…" | reassuring, practical | relaxed | still | — | |
| P4 "Not your pet's name." | faint smile | — | — | after it | |
| P4 "No word? Hang up and call back." | firm, calm | slight focus | one small nod on "call back" | — | |
| P5 "So, ask me your family's safe word." | playful challenge | slight lift | slight lean-in | — | |
| P5 "Not in the comments!" | quick, amused aside | — | — | — | |
| P5 [1.5 s silence] | closed mouth, faint knowing smile | still | still | one natural blink | Eyes on the lens throughout. |
| P5 "I don't know it. That's the point…" | warm, sincere, then easy for the CTA | relaxed | small lean-in on "follow" | after "point." | |

## Screenplay
Family codes: A photoreal AI still + depth parallax · B Blender 3D · C mocap rig · D humaaans · E logos/icons · F bespoke SVG/DOM objects · G kinetic type · H real-footage overlays · I real Unsplash photo · J avatar host · K audio. Times are estimates (≈ 2.3 words/s) and are retimed from the clips.

| # | Part · time | Primary visual | Layers (all pure functions of `t`, keyed to words) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | P1 0–3.2 | **The host, big, like any normal video** (frame 0 fully composed, captions at t = 0) | On "Actually" the frame freezes for 2 frames and a copier light-bar sweeps down. Behind it a **face-tracked violet wireframe mesh** and landmark ticks lock onto the face. An "AI CLONE" tag snaps to the shoulder. Halftone grain. | tape-stop blip, copier whirr | HI, I'M SANDESH. → ~~SANDESH~~ AI CLONE | — (hook frame, no eyebrow) | J F G H |
| 2 | P1 3.2–8.6 | **Police line-up**: height-chart wall (5′0″–6′6″) with 4 clone tiles (the same host feed offset in time and graded differently) plus a peach-framed polaroid of the real photo labelled ORIGINAL; placards CLONE 01–04 | "He typed this": a real keyboard photo inset (Unsplash) with the script typing on a teleprompter strip. "I'm saying it": a voice waveform flows out of the clone tiles. | typewriter, placard clacks | ORIGINAL · CLONE 01–04 · HE TYPED THIS · I'M SAYING IT | // ONE ORIGINAL, FOUR COPIES | F J I G |
| 3 | P1 8.6–14 | **"Check me" forensic close-up** of the host: callout lines from the face-track to EYES · TEETH · GLASSES · LIP-SYNC · LAG, each ticking "looks fine?" in turn (FBI's own list of tells) | A humaaans mom (peach overrides) slides in, phone in hand, on "your mom". Tabler icons on each callout. A chip: "FBI's list of deepfake tells". | tick ×5, soft sting | CHECK ME. · COULD I FOOL YOUR MOM? | // THE FBI'S CHECKLIST, ON ME | J F D E |
| 4 | P2 0–6.8 | **Blender "voiceprint" sculpture**: a procedurally extruded waveform ribbon that gets *photocopied* (a second ribbon peels off a copier glass, frames scrubbed by `t`) | A 3 s ruler under it; a counter 0 → 85 % match; a chip "McAfee researchers · 2023 test" | copier, rising tone | 3 SECONDS → 85 % MATCH | // 3 SECONDS OF YOUR VOICE | B F G K |
| 5 | P2 6.8–14 | **The live stopwatch**: the sentence "That's shorter than this sentence" types along a timeline and a stopwatch times it from the real word timestamps. The 3.00 s mark lands and stamps ENOUGH. | A small photoreal inset (AI image, labelled) of a phone on a tripod recording a story. Side chips: 70 % CAN'T TELL · OPENAI: 15 s SAMPLE (2024, NOT PUBLIC). | stopwatch ticks, stamp | 3.00 s · ENOUGH | // SHORTER THAN THIS SENTENCE | G F A |
| 6 | P3 0–3.6 | **Photoreal midnight bedroom** (AI image, no people): a nightstand, a phone lighting up, a clock at 00:00. Depth-parallax push-in. | The phone screen is composited: INCOMING · "Beta ♥". Window blue light, dust overlay. | room tone, a generic phone ring (synth, no branded tune) | 00:00 · INCOMING | // 12:00 AM, MOM'S PHONE | A F H |
| 7 | P3 3.6–9.4 | **The clone inside the call screen**: the host feed in a video-call UI on the phone, tagged "AI CLONE" | The quoted line appears as violet bubbles, word-synced. An urgency meter. A second humaaans mom pose, worried, reaching for her wallet. | heartbeat, bubble pops | MA, IT'S ME · ACCIDENT · SEND MONEY · DON'T TELL PAPA | // THE MIDNIGHT SCRIPT | J D F G |
| 8 | P3 9.4–14.6 | **100 mocap walkers** fill a 10 × 10 grid (cream-skinned rig, looping walk, staggered). 20 turn violet (victims) and 27 turn light violet (knew one) = **47 %**, against a **25 % global** bar. | Legend; chip "McAfee survey · 1,010 Indian adults · 2023" | soft blips, count tick | 47 % · 20 + 27 · GLOBAL 25 % | // ALMOST 1 IN 2 INDIANS | C F G |
| 9 | P4 0–7.2 | **Blender letter-wheel padlock** (5 wheels) spinning to "?????", in peach brass | A checklist builds: ✓ NEVER ONLINE · ✗ PET'S NAME · ✗ BIRTHDAY · ✗ HOME CITY (bad examples get struck through). Chip: "FBI · IC3 PSA · Dec 2024". | wheel clicks, strike swipes | FAMILY SAFE WORD · NEVER ONLINE | // THE FBI'S ONE-WORD FIX | B F E G |
| 10 | P4 7.2–14.6 | **Call-flow board**: CALL ASKS FOR MONEY → ASK FOR THE WORD → no word → HANG UP → CALL BACK ON THE SAVED NUMBER. A traveling pulse walks the path. | A humaaans dad character (another pose) with a phone; a real Unsplash photo of an old landline/phone as an inset (if one exists in the set); tabler phone-off / phone-out icons | path pulses, hang-up click | NO WORD? HANG UP. CALL BACK. | // NO WORD, NO MONEY | F D I E |
| 11 | P5 0–7 | **The test**: the host big again, a password field and a comment box below. On "Not in the comments!" the comment box gets stamped NOT HERE 🙂. In the **1.5 s silence** the padlock brute-forces, fails, and shows DENIED. Then the host **pixel-dissolves** at the edges (shader on the host canvas) while the face mesh flickers out. | Music cuts to room tone in the silence | silence, then denied buzz | ASK ME YOUR SAFE WORD · NOT IN THE COMMENTS · ACCESS DENIED | // TEST THE CLONE | J B F K |
| 12 | P5 7–end | **Save-worthy recap card**: "FAMILY SAFE WORD: 1 never online · 2 money call → ask for it · 3 no word → hang up, call back" (held ≥ 2.5 s) | **CTA**: the real profile photo in a peach ring as THE ORIGINAL + @sandesh.explains + FOLLOW, plus a SEND TO FAMILY GROUP button (tabler brand-whatsapp icon, nominative) and a Save icon; held ≥ 3 s | warm chord, copier "final print" | SET ONE TONIGHT · SEND TO FAMILY GROUP · FOLLOW | (none — CTA) | F E J G K |

**Asset-mix audit:**
- **Families used: 11/11 (≥ 5–6).**
- **Primary visual by scene (no two neighbours match):** J · F · J · B · G · A · J · C · B · F · J · F.
- **Primary counts:** J 4, F 3, B 2, G 1, A 1, C 1. All ≤ 4.
- **Families per scene:** every scene carries ≥ 3 families.
- **Separation:** photoreal scenes (5 inset, 6) are separated from flat-vector ones by the copier-pass wipe, not blended.

## Visual identity — "Copy Room / Line-Up" (checked against every prior reel)
- **Palette:**
  - midnight ink `#11142c` (base);
  - line-up bone `#ece6da` (walls, cards);
  - **UV violet `#7a5cff` = synthetic / clone**;
  - **warm peach `#ffb48a` = human / real / family**;
  - signal red `#ff3b4a` only for DENIED/scam words;
  - toner black `#0b0b0e`.
  Violet against peach is new to this repo (previous reels: teal/coral, orange/lime, amber/magenta, umber/amber, slate/yellow, cobalt/tangerine…).
- **Texture / motion language:** **photocopier and halftone**. A drifting halftone dot field with toner speckle, copier light-bar passes as transitions, and "copy-of-a-copy" degradation that clears. No runway, rain, belts, dot grids or scanline gutters.
- **Component language:**
  - police height-chart wall;
  - line-up placards;
  - polaroid with a peach tape strip;
  - forensic callout lines with ticks;
  - letter-wheel padlock;
  - phone call screens;
  - stamped photocopy cards with a punched hole and a "COPY" watermark.
  No boarding passes, receipts, terminals or windows with traffic-light dots.
- **Typography:** display **Big Shoulders Display 900** (new; vendor via `@fontsource/big-shoulders-display`) for placards and headlines, **IBM Plex Mono 600** (new) for tags and stopwatches, **Inter 700** for captions; cover in **Anton** (house rule).
- **Characters:** three humaaans poses not used in the last three reels (mom ×2 with different poses, dad ×1), with peach/violet overrides. The mocap rig uses a cream skin with violet "infected" state.
- **Cover (grid-first, ≤ 5 words):** **"I'M NOT HIM."** with a hero of four clone tiles in a line-up and the real-photo polaroid stamped ORIGINAL; violet on midnight with a bone title block; face chip bottom-right. (This one reads instantly in the grid: four identical faces.)

## Audio plan
- **Cue 1 (P1), uncanny-playful:** a detuned music-box motif that "glitches" (pitch wobble) on "Actually".
- **Cue 2 (P2), clinical pulse:** a ticking synth, with the stopwatch ticks locked to the beat.
- **Cue 3 (P3), dark midnight ambience:** low drone, room tone, the phone ring, a heartbeat under the quoted line.
- **Cue 4 (P4), confident:** light percussion with a major lift on "call back".
- **Cue 5 (P5):** a **full drop to room tone for the silence**, then a warm resolve chord under the CTA.
- **SFX:** copier whirr on every transition, padlock clicks, the denied buzz, bubble pops, placard clacks.
- **Mix:** voice 16–20 dB over music (`MOTION-DESIGNER-NOTES.md` target), loudness −14 LUFS, spectral check of voice vs music. I'll try to audition at least the silence beat by checking its waveform and RMS.

## Risks and fallbacks
- **The avatar tool might refuse or over-act the quoted scam line.** Fallback for Part 3: "Picture your mom's phone at midnight. Your voice, asking for money. Urgently. Secretly. Almost half of Indians surveyed had faced this, or knew someone who had." The quote then appears only as on-screen bubbles.
- **The tool might not hold a 1.5 s silence.** Fallback: split Part 5 at the pause, or I insert the silence in the edit (freeze-hold of a closed-mouth frame, cut at the pause). Both are fine, and the edit version is deterministic.
- **"Same voice" is not claimed**, unless you confirm the avatar's voice is trained on yours (then P1 can say "Same face, same voice").
- **Face-track:** if the OpenCV track jitters, I smooth it with a fixed-window average computed offline (still a pure lookup by frame).
- **Line-up feeds:** four simultaneous `<video>` seeks per frame cost render time. One decode is reused and drawn to four canvases with time offsets taken from a pre-extracted frame strip.
