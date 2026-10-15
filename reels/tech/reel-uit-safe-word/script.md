# Use It Today (safe word): "Ask me this one question" (family safe word vs AI voice-clone scams)

**Series:** Use It Today (see `insights/next-10-reels.md`). **Runtime:** about 30 s. **Host:** your AI avatar (no filming). The avatar is full frame for the hook, then a corner circle. **Keyword:** SAFE → `dm-prompt.md`.

## Why this reel
- `insights/growth-diagnosis.md`: 0 shares in 21 reels, 75% skipped in the first 3 s, 4.5 s average watch, no face early on, reels 60–96 s long.
- This reel targets sends: "send this to your parents" is the strongest reason to share in this audience. It is short (30 s), opens on a face (the avatar) at 0.0 s, and gives the viewer something to do today.
- **Test variable (from the plan's test matrix):** avatar face + avatar voice for the whole reel (variant A). Reel 2 is the opposite: no face, cloned voice.

## Facts (tier A only on screen)
| Claim | Source | Tier |
|---|---|---|
| The FBI advises: "Create a secret word or phrase with your family to verify their identity." The same PSA says to hang up and call back on a known number. | FBI IC3 PSA I-120324-PSA, 3 Dec 2024, https://www.ic3.gov/PSA/2024/PSA241203 | A |
| India: report cyber financial fraud by calling **1930** (24×7) or at **cybercrime.gov.in** | I4C/MHA, https://i4c.mha.gov.in/ncrp.aspx ; PIB releases | A |
| A 2023 McAfee survey: 47% of Indian adults had experienced, or knew someone who had experienced, an AI voice scam | Business Standard on McAfee's survey (2023, 1,010 Indian respondents) | B: not on screen; may go in the caption as "a 2023 survey" |
| "3 seconds of audio is enough to clone a voice" | Not confirmed from a primary source | C: don't say it. The script says "copy anyone's voice" with no number. |

## Script (spoken: 2 avatar parts, 15 s each)
**Part 1 (hook, 0–15 s):** "If I ever call you crying, asking for money... ask me one question first. Because scammers can now copy anyone's voice with A-I. Here's the thirty-second fix."
**Part 2 (15–30 s):** "Pick a family safe word today. Say it in person, never online. If a call needs money urgently, hang up, call back, and ask for the word. Send this to your parents. Comment safe."

## Beats and visuals (series frame: `USE IT TODAY · #NN (number set at posting)` badge, end card)
| t (s) | Spoken | On screen (≤6 words in the first 1.5 s) | Asset families |
|---|---|---|---|
| 0.0–2.2 | "If I ever call you crying, asking for money…" | Avatar **full frame**; text **"ASK ME THIS FIRST"**; a phone ring hit on frame 0 | avatar video, kinetic type, SFX |
| 2.2–5.5 | "…ask me one question first." | Avatar shrinks to the corner circle; a fake incoming-call screen "Beta 📞 calling…" slides in. A red "AI VOICE" waveform pulses over the caller ID | bespoke DOM phone UI, SVG waveform |
| 5.5–9.5 | "scammers can now copy anyone's voice with A-I" | A real voice-note waveform (left) is copied into a clone waveform (right), with a match meter filling up, labelled ILLUSTRATION | SVG waveform morph, meter |
| 9.5–12 | "Here's the thirty-second fix." | Step tracker 1 / 2 / 3 drops in | step tracker (series) |
| 12–15.5 | "Pick a family safe word today." | Step 1: a sticky note "our word: ______" (blurred); humaaans family of three (new pose and colours) | humaaans, rough.js note |
| 15.5–19 | "Say it in person, never online." | Step 2: a chat bubble with the word crossed out by a rough.js strike; "IN PERSON ONLY" stamp | rough.js, stamp |
| 19–24.5 | "If a call needs money urgently, hang up, call back, and ask for the word." | Step 3: three icons in a row (hang up → call back on saved number → ask the word), a green check. Source chip "FBI advice · Dec 2024" | Phosphor icons, flow row, source chip |
| 24.5–27 | "Send this to your parents." | Big share prompt: a paper-plane icon plus "SEND TO PARENTS". Avatar circle nods | kinetic type, avatar |
| 27–30 | "Comment safe." | **End card:** "Comment **SAFE** → I'll DM you the family checklist", profile ring, @sandesh.explains, save icon. Small line: "Scammed? Call **1930** · cybercrime.gov.in" | series end card |

## Performance track (what to check on the avatar clips)
| Line | Expression | Head | Blink |
|---|---|---|---|
| "If I ever call you crying…" | bright, alert, half-smile; brow lift on the question | slight lean-in | none in the first second |
| "copy anyone's voice" | inner-brow raise (concern) | still | after "first." |
| "thirty-second fix" | warm, confident | one small nod | — |
| "Pick a family safe word today" | calm, practical | still | after "today." |
| "hang up, call back" | firm, steady | still | — |
| "Send this to your parents" | warm, sincere | one small nod | — |

## Honesty
- The call screen and waveforms are labelled ILLUSTRATION. No real person's voice is cloned in this reel.
- On screen, we only use the FBI line and the 1930 helpline (both tier A).

## Audio plan
Tense-but-warm pulse at about 100 bpm: muted plucks, a soft heartbeat kick, and a phone-ring hit at frame 0 that resolves on "fix". Step clicks, a stamp thump, a paper-plane whoosh on "Send", and a soft chime on the end card. The avatar's voice is dereverbed and EQ'd with the chain from `reels/tech/reel-synthid-check/dereverb.py`, with music about 14–16 dB under the voice.
