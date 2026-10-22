# Script: "Your OTP lived minutes." (OTP journey) — ~64 s Hindi voice-over, no host, English on screen, one continuous Blender city

Folder `reels/tech/reel-otp-journey/` · built 21 Oct 2026. Storyboard: `storyboard.md` (approved, v2 dialogue). Voice: Kokoro `hm_omega` (Hindi), one take per sentence, no pause cutting, no tempo change (`voice.py`).

## Why this reel
Picked by the creator from options (OTP journey, relatable daily topic, NPCI/RBI-adjacent but not UPI transfer). Evergreen safety explainer with a Hindi/YouTube CTA (Like, Share and Subscribe).

## Benchmark to beat (UPI chai reel v2, reel-04)
1. A real 3D world with a physical camera: one continuous spider-swing move through a Blender city, 0 hard cuts in 66 s (the previous reels were 2D layers or Blender objects).
2. The camera is the narrator: every swing, float and dive is keyed to a spoken clause (`blender/world.py` reads `timing.json` times).
3. Planted-then-paid: the code is tagged "for this payment" at 4.7 s and the fake caller wants exactly that code at 45.5 s.

## Facts (tier A = regulator read; B = secondary; C = not used)
| Claim as spoken | Tier | Source / note |
|---|---|---|
| A 6-digit code is one of 10 lakh | A (maths) | 000000-999999 = 1,000,000 |
| Never share OTP; genuine banks / RBI don't ask for confidential info | A | RBI press release (Jan 2022), prid=53185; PIB Fact Check on fake RBI calls |
| Helpline 1930 (national cybercrime) | B | Kerala Police notice; I4C portal cybercrime.gov.in; "24x7" is the official position, not spoken |
| "Made for this payment", "dies in a few minutes", "several wrong tries block it" | B/C | typical bank behaviour, **bank-specific**; spoken generically; on-screen "MINUTES", no exact time, "LIFETIME" bar is ILLUSTRATIVE |
| Route SMS gateway > telecom core > tower > phone; weak network = late OTP | B | general SMS delivery path; simplified, labelled ILLUSTRATION |
| Fake caller | — | faceless silhouette, no brand, agency or number; labelled "NOT A REAL PERSON" |

## Voice script (Hindi, with the English caption shown on screen) — see `script.json` / `timing.json`
Hook (0 s): "आपके फ़ोन पर अभी एक ओटीपी आया।" Frame 0 is already the phone with the amber code, rain, headline "THIS CODE DIES IN MINUTES".
Chapters: I · THE CODE (bank makes it) · II · THE ROAD (gateway > core > tower > air) · III · THE MATCH (typed, matched, single use, blocked) · IV · THE ASK (fake caller; "your payment" flips to "their payment") · calm city + 1930 · CTA end card.

## Asset families (>= 5)
1. Blender 3D city (procedural, Cycles) with a keyed spider-swing camera, depth of field, per-frame orb and lights  2. Extruded 3D digits, web-line, red lane, silhouette, phone model  3. Canvas post: bloom/halation, vignette, seeded grain, deterministic rain  4. DOM HUD: tag, hop counter, OTP lifetime bar, chapter titles (Instrument Serif), stamps (Anton), captions on a scrim  5. Synth score + SFX (rain bed, drone, heartbeat pulse, relay clicks, stamps, bells)  6. Hindi TTS voice-over with phoneme-duration word timing  7. End card (profile photo, handle, LIKE / SHARE / SUBSCRIBE). Families used: 7.

## QA plan
Contact sheet of the camera path before the full render; `check.mjs`-style safe-zone checks on the page; `scripts/change-cadence.mjs`; frames inside every camera whip; mix report (voice over music + SFX >= 19 dB median / >= 13 dB min); voice and mix not auditioned by ear.

## Limits stated honestly
The city is procedural boxes (not photoreal); the world is rendered at 540x960, 12 fps and interpolated to 60 fps. Kokoro Hindi reads flatter than a human; pronunciation of ओटीपी/एसएमएस/सैंडेश should be heard once.

## Result v2 (22 Oct 2026, after creator feedback: "confusing, no coherence, cheap quality, story doesn't translate visually" + "polish the voice")
`reel-hi.mp4`: 61.2 s, 1080x1920 @ 60 fps, share encode 29.7 MiB (the 159 MB master is local, not committed). Redesign in `storyboard-v2.md`: ONE route (cyan line, always up the screen) through five unmistakable landmarks with lit signs (columned BANK, SMS GATEWAY sorting hall, TELECOM CORE racks, RADIO TOWER, YOUR PHONE monument), one hero amber token with its digits and a shrinking lifetime ring, chase camera keyed to the voice cues; the facts are pictures (million-cell floor with one lit cell, a dim token that stalls = weak network, red tether dragging the token to the FAKE CALLER booth, the red line stopped by a shield at the bank).
Voice: OmniVoice voice design (male, middle-aged, low pitch, Indian accent), Hindi, one take per sentence, Whisper-checked against the script (scores 0.80-0.98, no internal gap over 0.4 s), no pause cutting or tempo change; 58.1 s. Not auditioned by ear.
World: 918 Cycles frames at 720x1280, 14 samples, 15 fps (`blender/world2.py`, static scene `blender/route.py`), interpolated to 60 fps (`blender/assemble.sh`). Page: simplified HUD (location tag, 5-step route tracker, stamps, captions), light grain, rain.
Validated: contact sheets of the page at 19 times and of the final MP4 at 19 times, frames across the slice join at 30.6 s (seamless); `change-cadence` 0 stretches over 2 s (longest gap 0.25 s); headline on frame 0, voice at 0.00 s; end card held 3.9 s; mix -15.0 LUFS / -1.5 dBTP, voice over music + SFX median 24.0 dB, min 14.1 dB. Not validated: no overlap lint, voice and mix not auditioned.
Known weaknesses: procedural boxes (stylised, not photoreal); 15 fps source interpolated; a mirrored 3D sign flashes in the pull-back at ~2 s; some captions sit over bright windows.
Lesson: a container restart wiped `/tmp` (883 rendered frames and the Python packages). Keep long-render outputs on persistent disk (`frames_v2/`, ignored by git) and make renders resumable.
