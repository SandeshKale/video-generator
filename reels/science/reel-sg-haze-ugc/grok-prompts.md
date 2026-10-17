# Singapore haze UGC — Grok Imagine prompt pack v3 (≈ 34 s, calm news-explainer)

**v3 changes (from test clip 2):** (1) the **start image decides the framing**, so every anchor clip now gets its own wide location still (you were 90 % of the frame because the old still was a close shot); (2) camera **locked off**, he walks toward it; (3) haze density fixed in the still so it doesn't fade in; (4) **calm, soothing, friendly voice** and **8 full sentences** with natural pauses; (5) gestures written as a sequence, not tied to words; (6) a 4th b-roll and a slightly longer cut (≈ 34 s) so more sentences fit without rushing the voice.

**Structure (8 generations):** 4 anchor clips (A1–A4, speaking) + 4 b-roll (B1–B4, voice-over). Anchor clips hold ≤ 2 sentences each (≤ 15 words per clip, ≤ 6 s) and end on a closed-mouth beat.

| Time | Clip | Place | Voice |
|---|---|---|---|
| 0–5 | A1 | Marina Bay promenade, Marina Bay Sands behind | on camera: sentence 1 |
| 5–8 | B1 | dim sun over the MBS skyline | voice-over: sentence 2 |
| 8–14 | A2 | HDB estate walkway | on camera: sentences 3–4 |
| 14–20.5 | B2 + B3 | skyline from the Marina Barrage side, MRT fare gates | voice-over: sentence 5 (PSI bands) |
| 20.5–25 | A3 | Supertree Grove, Gardens by the Bay | on camera: sentence 6 |
| 25–29 | B4 | N95 mask and a window view at home | voice-over: sentence 7 |
| 29–34.5 | A4 | Orchard Road | on camera: sentence 8 |

## Script — 8 full sentences (≈ 86 words, calm pace ≈ 2.5 words/s)
1. **A1:** "That orange sun isn't a filter. It's haze, and it's back in Singapore."
2. **B1 (VO):** "It's smoke from fires in Sumatra and Kalimantan."
3. **A2:** "On south-easterly winds, it drifts our way. NEA tracks it with the PSI."
4. **B2+B3 (VO):** "Up to 100 is fine. From 101 to 200, it's unhealthy. Above 200, it's very unhealthy."
5. **A3:** "On an unhealthy day, go easy on hard outdoor workouts."
6. **B4 (VO):** "And if you have lung or heart issues, take extra care."
7. **A4:** "Check haze dot gov dot S G before you plan your day, and follow for more."

(Sentence counting: A2 holds two short sentences, so the pack has 8 sentences in total.)

Facts (tier A, haze.gov.sg and NEA, read 17 Oct 2026): PSI 0–100 Good to Moderate, 101–200 Unhealthy, 201–300 Very Unhealthy, 301+ Hazardous; smoke from fires in Kalimantan and southern Sumatra drifts here on south-easterly or easterly winds; the 17 Oct haze.gov.sg summary lists Singapore stations at Unhealthy to Very Unhealthy. "Vulnerable persons" is not defined on the page, so the health line stays general.

## Voice direction (paste at the end of every ANCHOR prompt)
> VOICE: soothing, calm, friendly and unhurried, like a trusted friend explaining something reassuring: warm low-to-mid pitch, soft natural Singapore-English, gentle smile in the voice. Complete sentences, each ending with a relaxed falling tone, a short natural breath pause (about 0.3 s) between sentences. No announcer tone, no excitement, no sing-song, no raised pitch at sentence ends. Clean, dry, close-mic sound without echo.

## Step 0 — master reference (once)
Upload your face photo (`prototypes/reel-app/public/profile.jpg`) to Grok Imagine (image mode):

> Photorealistic full-body photo of the exact man in the reference photo, same face, same black rectangular glasses, same trimmed dark beard and moustache, same short dark wavy hair. He is 5 ft 6 in (168 cm), compact average build. Outfit: plain light-blue short-sleeved cotton shirt, dark navy chinos, white minimalist sneakers, no watch, no cap, no jewellery. Neutral relaxed standing pose in an open outdoor plaza. Natural skin texture, no retouching, no text or logos. Vertical 9:16.

## Step 0b — one wide start still per anchor location (this fixes the scale)
Use the master reference as the person reference for each. **Check that he looks small in the frame**, standing mid-ground with empty ground in front of him.

Common still block:
> Wide establishing photo, vertical 9:16, 28 mm phone lens on a tripod at chest height, camera about 12 m from the man. The man (exactly the person in the reference, 5 ft 6 in, light-blue short-sleeved shirt, navy chinos, white sneakers) stands in the middle distance on the left or right third, his whole body from head to shoes about 35–40 % of the frame height, with about 15 % empty paving below his feet and the landmark large behind him filling the upper half. Haze at its FINAL density: milky grey-beige sky, the sun a dim pale-orange disc clearly visible, the landmark clearly visible but softened by haze, distant buildings fading, soft diffused light, no hard shadows. The whole ground is the same grey paving stones. At most 2 small distant people. No text, signs or logos.

- **S1:** "… Location: the Marina Bay waterfront promenade, the three Marina Bay Sands towers behind him, Helix Bridge to the right."
- **S2:** "… Location: a long covered walkway of a Singapore HDB estate, tall point-block flats rising into haze behind him."
- **S3:** "… Location: the elevated walkway at Supertree Grove, Gardens by the Bay, the Supertrees behind him, a hip-high railing beside him."
- **S4:** "… Location: a wide Orchard Road pavement with rain trees, tall buildings fading into haze behind him."

## Shared anchor block (paste at the top of every ANCHOR clip prompt, unchanged)
> Start from the start image and KEEP ITS EXACT FRAMING, camera distance and haze density for the whole clip. UGC news-explainer video, vertical 9:16. The camera is LOCKED OFF on a tripod: no camera movement, no zoom, no tilt, no follow. The man walks slowly toward the camera, so he gradually grows from about 35 % to about 55 % of the frame height, whole body always visible with ground below his feet. He is exactly the person in the start image: same face, glasses, beard, hair, light-blue short-sleeved shirt, navy chinos, white sneakers, 5 ft 6 in, natural proportions, five fingers per hand. Constant haze density from the first frame to the last, no fog fade-in or fade-out; the same grey paving throughout. BACKGROUND PEOPLE: at most 2 or 3, small and far away, strolling slowly in real time; nobody runs, nobody passes near him; everything else stays still. No readable text, signs, logos or licence plates. No subtitles.

## A1 — hook (5 s), start image S1
> [shared anchor block] He is already walking in the first frame and begins speaking at 0.0 s. First half: he looks into the lens and says "That orange sun isn't a filter." Then a small pause, he glances up at the sun for a moment with one open palm lifted to shoulder height, and says "It's haze, and it's back in Singapore." His gaze returns to the lens for the final word and he finishes with a closed-mouth gentle smile. [VOICE block]

## A2 — source (6 s), start image S2
> [shared anchor block] He walks slowly toward the camera along the covered walkway. He says "On south-easterly winds, it drifts our way." while one open hand sweeps gently left to right at chest height; a short breath pause; then "NEA tracks it with the PSI." with one finger lifted at chest height. He ends with a calm closed-mouth beat. [VOICE block]

## A3 — advice (5 s), start image S3
> [shared anchor block] He walks slowly toward the camera along the walkway and says calmly "On an unhealthy day, go easy on hard outdoor workouts." with a gentle downward press of one open palm at the middle of the sentence, kind and reassuring expression, small nod at the end, then a closed-mouth smile. [VOICE block]

## A4 — call to action (6 s), start image S4
> [shared anchor block] He walks slowly toward the camera, stops for the last two seconds, looks straight into the lens and says warmly "Check haze dot gov dot S G before you plan your day, and follow for more." One small nod on "follow", then a relaxed closed-mouth smile held for the last 0.7 s. [VOICE block]

## B-roll (text-to-video, no people in focus, 6 s each, we use 3–4 s)
Shared block: *Documentary smartphone footage, vertical 9:16, stable, real time (no time-lapse, no slow motion), Singapore haze: milky grey-beige sky, dim pale-orange sun, soft diffused light. No people close to the camera, no readable text or logos.*
- **B1:** the Marina Bay Sands skyline across the water, the dim orange sun above the towers; a very slow 10 cm push-in; two tiny boats far away.
- **B2:** the Singapore central skyline from the Marina Barrage side, buildings fading layer by layer into haze, a slow lateral pan; a few distant cars moving slowly on a far road.
- **B3:** the glass fare gates and concourse of an MRT station, hazy daylight at the open end, two or three commuters far away walking slowly; the camera glides slowly forward at hip height.
- **B4:** a calm home interior in daylight: a window view of a hazy HDB estate, an N95 mask lying on a wooden table beside a glass of water; a slow push-in toward the window. No people.

## Checks per clip
- **Scale:** at the start of A-clips he is ~35 % of frame height, at the end ~55 %, feet always in frame with ground below. If he fills the frame, regenerate the still, not the clip.
- **Face:** compare first and last frame with the master reference (glasses shape, beard, hairline); Grok tends to make the beard fuller.
- **Haze:** constant brightness from first to last frame (I measure it); the sun visible.
- **Voice:** calm, warm, falling sentence ends; ≈ 0.3 s pauses; no rush. If a clip rushes, regenerate it or I re-voice it with your avatar voice in the edit.
- **Background people:** strolling pace; if the crowd races, append "the whole scene is calm, quiet and real-time".
- **Disclosure:** AI-generated scenes and AI likeness; the caption carries the avatar disclosure line and the edit adds a small "AI-generated scenes" tag.
- **Edit (me):** match cuts on movement, word-highlighted captions in the safe zone, a PSI band bar with the day's reading and "haze.gov.sg / NEA", one haze grade across all clips, voice mixed at −14 LUFS with ambience ≥ 19 dB under the voice, cover.
