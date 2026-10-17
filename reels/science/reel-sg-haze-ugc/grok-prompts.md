# Singapore haze UGC — Grok Imagine prompt pack (30 s = 5 × 6 s clips)

**Why this is split the way it is:** each clip is one location, one action, ≤ 6 s, started from the **same full-body reference still**, so identity, outfit and body proportions cannot drift. Only clips 1 and 5 have visible lip-sync speech; clips 2–4 are voice-over with the mouth closed, which hides lip-sync drift. We join them in the edit (match cuts on movement, captions, PSI graphic, grade, mix).

**Facts (tier A, read 17 Oct 2026, haze.gov.sg + NEA):** PSI 0–100 Good to Moderate, 101–200 Unhealthy, 201–300 Very Unhealthy, 301+ Hazardous. 1-hr PM2.5 bands: Normal 0–55, Elevated 56–150, High 151–250, Very High 251+ µg/m³. NEA: smoke from fires in Kalimantan and southern Sumatra drifts to Singapore under prevailing south-easterly/easterly winds. haze.gov.sg summary 17 Oct: stations in Singapore and Peninsular Malaysia "Unhealthy to Very Unhealthy". Health line "vulnerable persons" is not defined on the page: keep the wording general.

## Script (≈ 75 words)
1. **0–6 s, on camera:** "That orange sun isn't a filter. It's haze, and it's back in Singapore."
2. **6–24 s, voice-over (mouth closed in clips 2–4):** "Smoke from fires in Sumatra and Kalimantan, blown our way by south-easterly winds. NEA tracks it with the PSI: up to a hundred is fine, a hundred and one to two hundred is unhealthy, above two hundred, very unhealthy. When it's unhealthy, skip hard outdoor workouts, and take extra care if you have lung or heart issues."
3. **24–30 s, on camera:** "Check the PSI on haze dot gov dot S G before you plan your day. Follow for more."

## Step 0 — one full-body reference still (do this first, reuse for all clips)
Upload `prototypes/reel-app/public/profile.jpg` (your face photo) to Grok Imagine (image mode) with:

> Photorealistic full-body photo of the exact man in the reference photo, same face, same black rectangular glasses, same trimmed dark beard and moustache, same short dark wavy hair. He is 5 ft 6 in (168 cm) tall with a compact, average build: standing relaxed, head to white sneakers fully visible, feet on the ground, arms natural. Outfit: plain light-blue short-sleeved cotton shirt, dark navy chinos, white minimalist sneakers, no watch, no cap, no jewellery. Plain, softly lit outdoor pavement background. Shot on a smartphone, natural skin texture, no retouching, no text, no logos. Vertical 9:16.

Pick the one that looks most like you (check the beard line, glasses, ears). **Use that exact still as the start image of every clip below.** If a clip drifts, regenerate that clip only.

## Shared block (paste at the top of every clip prompt, unchanged)
> UGC smartphone video, vertical 9:16, handheld with natural slight shake, main phone camera (about 24 mm), natural phone colour and mild noise, not cinematic, no slow motion, no filters, no lens flare. The man is exactly the person in the start image: same face, glasses, beard, hair, same light-blue short-sleeved shirt, navy chinos, white sneakers; 5 ft 6 in (168 cm), compact build, natural human proportions, hands with five normal fingers. FULL BODY stays in frame, head to shoes. Singapore haze conditions: milky grey-beige sky, the sun a dim pale-orange disc, distant buildings fading into haze, soft diffused light with no hard shadows, slight warm cast, humid tropical air. No readable text, signs, logos or licence plates anywhere in the frame. No subtitles. Everyone else in the shot is a distant, blurred passer-by.

## Clip 1 — hook (6 s), Marina Bay waterfront promenade
> [shared block] Location: the Marina Bay waterfront promenade with the Marina Bay Sands towers softly fading into haze behind him, the Helix Bridge area on the right. A friend films him from about 3 m away at chest height. He stands in the middle, full body visible, looks at the camera, then glances up at the dim orange sun and back, and says in a relaxed natural Singapore-English voice: "That orange sun isn't a filter. It's haze, and it's back in Singapore." Faint natural smile, one blink, small natural hand gesture toward the sky at "sun". Real room-less outdoor ambience, light breeze, distant traffic. Camera slowly pushes in 20 cm.

## Clip 2 — source (6 s, voice-over, mouth closed), HDB heartland void deck
> [shared block] Location: a typical Singapore HDB housing estate: void deck with a covered walkway, tall point-block flats rising into thick haze, a basketball court beyond. He walks slowly from left to right along the walkway, full body visible, looks up at the grey-beige sky, mouth closed, calm concerned expression, one hand shading his eyes. Camera tracks him sideways at the same walking pace, steady. Distant ambience only, no speech.

## Clip 3 — the PSI (6 s, voice-over, mouth closed), MRT station concourse
> [shared block] Location: the covered concourse of a Singapore MRT station, glass fare gates in the background (the gate top reaches about his hip), commuters blurred in the distance, daylight coming in hazy. He stops, takes his phone from his pocket, glances at it (screen not visible to camera) and tilts it slightly toward the camera with his other hand pointing at it, mouth closed. Camera holds a medium-wide full-body shot, very slight handheld drift. Ambient station sound only, no speech.

## Clip 4 — advice (6 s, voice-over, mouth closed), Gardens by the Bay Supertree Grove
> [shared block] Location: Supertree Grove at Gardens by the Bay, the Supertrees looming into haze, a walkway with railing at his waist-to-hip height. He leans one forearm on the railing, looks across the hazy skyline, then turns and starts walking away from the camera along the walkway, mouth closed, relaxed pace. Full body visible throughout, camera follows 4 m behind. Ambient sound only, no speech.

## Clip 5 — call to action (6 s), Orchard Road
> [shared block] Location: a wide Orchard Road pavement, shopfronts and rain trees along the road, tall buildings fading into haze. He walks toward the camera for two steps, stops, full body visible, looks straight into the lens, and says warmly in a relaxed Singapore-English voice: "Check the PSI on haze dot gov dot S G before you plan your day. Follow for more." Small natural smile, one nod on "Follow". Light traffic ambience. He holds the last pose still for the final 0.7 s with a relaxed closed-mouth smile.

## Rules we are working to
- **Voice:** Grok's own speech is a bonus. If it sounds off, we replace the voice in the edit with your avatar voice; that is why clips 2–4 are mouth-closed and clips 1 and 5 end with a still closed-mouth beat (easy to re-time).
- **Body check on each clip:** he must be 168 cm: head roughly 1/7.5 of body height, shoulders about 1.4 head-widths... in short, no tall/lanky drift. Fare-gate top ≈ hip, waist-high railing ≈ waist. Regenerate if he looks 6 ft.
- **Face check:** compare each clip's first and last frame with the reference: glasses frame shape, beard edge, hairline.
- **Disclosure:** these are AI-generated scenes of Singapore places with your AI likeness, not real footage. The caption carries the avatar disclosure line, and the edit adds a small "AI-generated scenes" tag; haze facts come from NEA/haze.gov.sg and are cited on screen.
- **Edit plan (what I do):** assemble the five clips with match cuts, English captions (word-highlighted, safe zone), a PSI band bar (0–100 / 101–200 / 201–300 / 301+, with the reading the day you post), source line "haze.gov.sg / NEA, read <date>", a haze-colour grade across all clips for consistency, VO mix (−14 LUFS, voice ≥ 19 dB over ambience), cover.
