# Singapore haze UGC — Grok Imagine prompt pack v2 (30 s, news-explainer style)

**v2 changes (from the first test clip):** (1) CNA-style framing: camera far back, he is ~45 % of frame height and the landmark is the star of the shot, so scale reads right; (2) background people: very few, small, slow, real-time speed; (3) 3 b-roll cutaways with nobody in them; (4) he always moves while he talks (walk-and-talk, gestures, a look to the landmark). Identity/outfit rules unchanged.

**Structure (7 generations, ≈ 30 s after trimming):** 4 anchor clips (A1–A4, speaking) + 3 b-roll clips (B1–B3, no people, voice-over). Every anchor line is short (≤ 16 words) and ends on a closed-mouth beat, so lip-sync drift never builds up. The edit cuts b-roll over the voice-over and adds the PSI graphic.

| Time | Clip | Place | Voice |
|---|---|---|---|
| 0–5 | A1 anchor | Marina Bay promenade, Marina Bay Sands behind | on camera |
| 5–8 | B1 b-roll | dim sun over MBS skyline | voice-over |
| 8–14 | A2 anchor | HDB estate walkway | on camera |
| 14–16.5 | B2 b-roll | hazy skyline from the Marina Barrage side | voice-over |
| 16.5–19 | B3 b-roll | MRT station glass gates, hazy daylight | voice-over |
| 19–25 | A3 anchor | Supertree Grove, Gardens by the Bay | on camera |
| 25–30 | A4 anchor | Orchard Road pavement | on camera |

## Script (≈ 80 words)
- **A1 (0–5):** "That orange sun isn't a filter. It's haze, and it's back."
- **B1 (5–8), voice-over:** "It's smoke from fires in Sumatra and Kalimantan,"
- **A2 (8–14):** "blown our way by south-easterly winds. NEA tracks it with the PSI."
- **B2+B3 (14–19), voice-over:** "Up to 100 is fine. 101 to 200, unhealthy. Above 200, very unhealthy."
- **A3 (19–25):** "When it's unhealthy, skip hard outdoor workouts, and take extra care with lung or heart issues."
- **A4 (25–30):** "Check haze dot gov dot S G before you plan your day. Follow for more."

Facts (tier A, haze.gov.sg and NEA, read 17 Oct 2026): PSI 0–100 Good to Moderate, 101–200 Unhealthy, 201–300 Very Unhealthy, 301+ Hazardous; smoke from fires in Kalimantan and southern Sumatra drifts here on south-easterly or easterly winds; the 17 Oct haze.gov.sg summary lists Singapore stations at Unhealthy to Very Unhealthy. "Vulnerable persons" is not defined on the page, so the line stays general.

## Step 0 — one reference still (use as the start image of every anchor clip)
Upload your face photo (`prototypes/reel-app/public/profile.jpg`) to Grok Imagine (image mode):

> Photorealistic wide full-body photo of the exact man in the reference photo, same face, same black rectangular glasses, same trimmed dark beard and moustache, same short dark wavy hair. He is 5 ft 6 in (168 cm), compact average build, standing relaxed on a wide waterfront promenade, seen from about 9 m away with a 28 mm phone lens at chest height: his whole body from head to white sneakers fills only about 45 % of the frame height, with plenty of open ground and sky around him. Outfit: plain light-blue short-sleeved cotton shirt, dark navy chinos, white minimalist sneakers, no watch, no cap, no jewellery. Natural skin texture, no retouching, no text, no logos. Vertical 9:16.

Check: face, beard line, glasses; he must look **small in the frame**, not filling it.

## Shared block (paste at the top of every ANCHOR clip prompt, unchanged)
> UGC-style news-explainer video, vertical 9:16, shot by a camera operator on a gimbal, smooth and stable (very slight natural sway only), 28 mm phone lens at chest height. The camera stays 8–10 m away from the man. He is exactly the person in the start image: same face, glasses, beard, hair, light-blue short-sleeved shirt, navy chinos, white sneakers; 5 ft 6 in (168 cm), compact build, natural human proportions, five fingers per hand. WIDE FRAMING: his whole body, head to shoes, occupies only about 40–50 % of the frame height, placed on the left or right third; the landmark behind him is large, 150–300 m away, and fills the upper half of the frame. Singapore haze: milky grey-beige sky, the sun a dim pale-orange disc, distant buildings fading into haze, soft diffused light, no hard shadows, slight warm cast, humid tropical air. BACKGROUND PEOPLE: at most 3 or 4, small and far away, walking at a slow relaxed strolling pace in real time, no running, no fast or jerky motion, nobody passes close to him; the rest of the background is almost still. No readable text, signs, logos or licence plates. No subtitles.

## A1 — hook (5 s), Marina Bay promenade
> [shared block] Location: the Marina Bay waterfront promenade, Marina Bay Sands' three towers rising large behind him in the haze, Helix Bridge further right. He walks slowly toward the camera, 4 relaxed steps, speaking naturally to the lens in a relaxed Singapore-English voice: "That orange sun isn't a filter. It's haze, and it's back." On "sun" he looks up and gestures once toward the sky with an open palm at shoulder height, on "back" he looks into the lens with a small knowing nod. Closed-mouth beat for the last half second. Light breeze, distant ambience.

## A2 — source (6 s), HDB estate walkway
> [shared block] Location: a Singapore HDB estate: a long covered walkway beside tall point-block flats rising into thick haze, a quiet playground far behind. He walks slowly along the walkway from right to left while the camera tracks him sideways at the same pace, speaking to the camera: "blown our way by south-easterly winds. NEA tracks it with the PSI." On "winds" he sweeps one open hand left to right at chest height, on "PSI" he lightly counts one finger. Closed-mouth beat at the end. Ambient estate sound, very few distant residents.

## A3 — advice (6 s), Supertree Grove at Gardens by the Bay
> [shared block] Location: Supertree Grove, the Supertrees looming large into the haze behind him, a wide elevated walkway with a railing at his hip height. He walks slowly along the walkway, then stops and turns toward the camera, speaking calmly: "When it's unhealthy, skip hard outdoor workouts, and take extra care with lung or heart issues." On "skip" a small shake of the open hand, on "lung or heart" he touches his chest once. Serious but warm. Closed-mouth beat at the end. Very few distant visitors, slow.

## A4 — call to action (5 s), Orchard Road
> [shared block] Location: a wide Orchard Road pavement with rain trees and tall buildings fading into the haze, light slow traffic far off. He walks toward the camera for 3 steps, stops, looks straight into the lens and says warmly: "Check haze dot gov dot S G before you plan your day. Follow for more." Small natural smile, one nod on "Follow". Holds a relaxed closed-mouth smile for the last 0.7 s.

## B-roll (no people in focus, no text, 6 s each, we use 2.5–3 s)
Shared b-roll block: *Documentary-style smartphone footage, vertical 9:16, stable, real time (no time-lapse, no slow motion), Singapore haze: milky grey-beige sky, dim pale-orange sun, soft diffused light. No people close to camera, no readable text or logos.*
- **B1:** the Marina Bay Sands skyline across the water with the dim orange sun disc above the towers; very slow 10 cm push-in; a couple of tiny boats far away.
- **B2:** the Singapore central skyline seen from the Marina Barrage side, buildings fading layer by layer into haze, a slow lateral pan; a few distant cars on a road, moving slowly.
- **B3:** the glass fare gates and concourse of an MRT station, hazy daylight at the open end, two or three commuters far away standing or walking slowly; camera slowly glides forward.

## Checks per clip (we go through these together)
- **Scale:** he must look about 168 cm next to a 1 m railing (railing at hip) and next to the fare gates (gate top ≈ hip). If he fills the frame or the landmark looks tiny, regenerate with "camera 10 m away".
- **Face:** compare first and last frame with the reference (glasses shape, beard edge).
- **Motion:** he walks and gestures; background people strolling slowly. If the crowd races, append "the whole scene is real-time, calm, quiet".
- **Voice:** Grok's own speech is a bonus; if it sounds off we replace it with your avatar voice in the edit (the closed-mouth beats help re-timing).
- **Disclosure:** AI-generated scenes and AI likeness; the caption carries the avatar disclosure line and the edit adds a small "AI-generated scenes" tag.
- **Edit (me):** match cuts on movement, word-highlighted captions in the safe zone, a PSI band bar with the day's reading and a source line "haze.gov.sg / NEA", one haze grade across all clips, mix at −14 LUFS with voice ≥ 19 dB over ambience, cover.
