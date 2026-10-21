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

## Result (21 Oct 2026)
`reel-hi.mp4`: 66.0 s, 1080x1920 @ 60 fps, share encode 15 MB (the 698 MB CRF-18 master is not committed). World: 793 Blender frames (Cycles, 540x960, 12 fps, seeded) motion-interpolated to 60 fps (`blender/assemble.sh`, `site/world.webm`), seeked per frame by the page.
Validated: contact sheets of the page at 16 times and of the final MP4 at 15 times (incl. the 33 s slice join, seamless); `change-cadence` 0 stretches over 2 s (longest 1.00 s); headline visible on frame 0, voice starts at 0.00 s; end card (photo, @sandeshexplains, LIKE/SHARE/SUBSCRIBE) held 3.9 s; mix -14.8 LUFS / -1.5 dBTP, voice over music + SFX median 24.4 dB, min 14.3 dB (voiced 250 ms windows). Not validated: no `check.mjs` overlap lint was written for this page (layout judged on frames), voice and mix not auditioned by ear.
Known weaknesses: procedural box city (not photoreal); 12 fps source interpolated (slight edge warp in the fastest swings); some captions sit over bright windows (scrim helps); Kokoro Hindi is flatter than a human read; "FAKE CALLER" tag is briefly crossed by a lit window at ~52 s.
