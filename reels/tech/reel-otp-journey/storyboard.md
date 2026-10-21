# Storyboard: "Your OTP lived 4 minutes." (OTP journey, Hindi, ~60 s) — DRAFT FOR APPROVAL

Nothing is built yet. This is the plan only. Folder: `reels/tech/reel-otp-journey/`.

## Idea in one line
A 6-digit OTP is followed from the bank's server to your phone and back. A single web-swinging camera travels through a 3D night city built in Blender, so the city is the network and the camera is the code. The reel ends on the one rule: nobody real ever asks for it.

## Look: "Monsoon Noir" in 3D (new for this reel, not reused from earlier reels)
- Ground: teal-black night, wet streets, rain streaks, volumetric fog.
- Colour has one meaning each. Amber = the OTP (the only warm, saturated thing). Cyan = the network (towers, fibre, lanes). Red = danger (the fake caller, the stolen use). Cream = text.
- Fonts: Instrument Serif for chapter titles, Inter 700 for captions, IBM Plex Mono for HUD. Cover in Anton on amber.
- HUD (DOM overlay, so it stays crisp and `t`-driven): top-left location tag (`BANK SERVER` > `SMS GATEWAY` > `TELECOM CORE` > `TOWER` > `YOUR PHONE`), top-right OTP lifetime clock counting down, bottom-left caption in Hindi-English sense units (number word in amber).

## Camera grammar: the spider-swing
- The camera is a Bezier path in Blender with **pendulum arcs**: it launches off a building edge, swings in a long arc around a tower (camera rolls into the turn, 10-15 degrees), releases at the top of the arc (brief weightless float, slow), then free-falls and catches the next anchor (a soft "thwip" settle).
- Faint **web lines** (thin emissive curves) from the camera to each anchor, visible for about 0.4 s at each launch and catch. They are the visual rhythm.
- Speed pattern: fast swing, slow float, fast swing. Never a constant dolly. Hard cuts: **0** in the world; the 4 host "perches" are the only places the camera stops.
- Hand-held feel: a tiny noise-driven shake, bigger on landings. All camera values come from a keyed curve, so the world and the HUD can be re-timed if the voice changes.

## Shot list (times are targets; final timing comes from the avatar clips' word times)

| # | Time | Voice (Hindi draft, English gist) | World and camera | HUD and on-screen objects | Sound |
|---|---|---|---|---|---|
| 1 | 0-3.5 | "आपके फ़ोन पर अभी एक OTP आया। छह अंक, दस लाख में से एक।" (An OTP just arrived. Six digits, one in a million.) | Frame 0 is already composed: macro on a phone in a hand, rain on the window, the 6 digits glowing amber. The camera pulls back fast through the window into the street (first swing). | Headline top: placeholder "YOUR OTP LIVED MINUTES". Clock starts. Counter "1 in 1,000,000". | Rain, notification ping, sub hit on the pull-back. |
| 2 | 3.5-8.5 | "बैंक का सर्वर इसे आपके इसी पेमेंट के लिए बनाता है।" (The bank's server makes it for this very payment.) | A swing over the rooftops into a glass tower, BANK SERVER. A number wheel 000000-999999 spins and snaps to the code; the code is tagged `FOR THIS PAYMENT`. Ch. I title `I · THE CODE`. | Location tag `BANK SERVER`. Label ILLUSTRATION. | Dial ticks, lock-click, chime on the last digit. |
| 3 | 8.5-15 | Host perch 1: "किसी और पेमेंट पर यह नहीं चलेगा, और कुछ ही मिनट में ख़त्म हो जाता है।" (It won't work on any other payment, and it dies within minutes.) | Perch on the bank roof. Host chest-up, cyan rim, amber spill; behind him the code's amber glow dims as the lifetime clock runs down. | Lifetime bar shrinking (labelled ILLUSTRATIVE). | Calm bed, a soft tick-down. |
| 4 | 15-22 | "फिर यह SMS बनकर SMS गेटवे जाता है, वहाँ से आपकी टेलीकॉम कंपनी के कोर में," (Then it becomes an SMS, goes to the SMS gateway, then into your telecom company's core,) | Ch. II `II · THE ROAD`. Long swing across a river of cyan fibre lanes; the packet rides ahead of the camera. Gateway is a small switching yard, the telecom core a wide low building of glowing racks. | Tag `SMS GATEWAY`, then `TELECOM CORE`. | Relay clicks, rising tone. |
| 5 | 22-30 | "और सबसे पास के टावर से हवा में आपके फ़ोन तक। पूरे रास्ते में कुछ सेकंड लगते हैं, इसीलिए नेटवर्क कमज़ोर हो तो OTP देर से आता है।" (...and from the nearest tower through the air to your phone. A few seconds, which is why a weak network delays the OTP.) | A final arc to a radio tower; the code leaves it as a ring pulse. A second, dim ring fades before reaching a far phone (the weak-network case) while the near phone gets it. | Tag `TOWER`, `YOUR PHONE`. Hop counter 1-4. | Tower hum, pulse whoosh. |
| 6 | 30-38 | "आप कोड डालते हैं, बैंक मिलाता है, पेमेंट पास। एक बार इस्तेमाल हुआ तो कोड बेकार, और कई ग़लत कोशिशों पर ट्रांज़ैक्शन ब्लॉक।" (You type it, the bank matches it, payment passes. Used once it is dead; several wrong tries block the transaction.) | Ch. III `III · THE MATCH`. The camera dives back down the street into your window and the phone. A finger types the digits (macro); a green tick builds from the lanes; the amber code burns out into the sky. Second try with the same code gets a red `USED`. | Stamps `✔ APPROVED`, `USED ONCE`, `BLOCKED AFTER WRONG TRIES` (verify). | Key taps, tick chime. |
| 7 | 38-45 | Host perch 2: "इसलिए कोड का अंदाज़ा लगाना बेकार है। असली कमज़ोरी आप हैं: कोड बोल दिया, तो पेमेंट उसका।" (So guessing the code is pointless. The weak link is you: say the code aloud and the payment is theirs.) | Perch on a lit rooftop across from your window. Host serious, small deictic point at the phone below. | Hint of the red lane at the edge of frame. | Wind, a low drone starts. |
| 8 | 45-53 | "कोई बैंक अफ़सर बनकर जल्दी मचाए और यही कोड माँगे, तो वह आपकी पहचान नहीं, अपना पेमेंट पास करा रहा है।" (If a "bank officer" rushes you and asks for this code, he isn't verifying you, he is approving his own payment.) | Ch. IV `IV · THE ASK`. The camera swings to a rooftop where a faceless red silhouette holds a phone; a red lane pulls on the amber code; the stamp flips from `YOUR PAYMENT` to `THEIR PAYMENT`. | Red `FAKE CALLER` tag; no real brand or agency. | Phone ring, risk hit. |
| 9 | 53-60 | Host perch 3 + CTA: "असली बैंक कभी OTP नहीं माँगता। ठगी हो जाए तो तुरंत एक-नौ-तीन-शून्य पर कॉल करिए। लाइक, शेयर और सब्सक्राइब करिए, Sandesh Explains को।" (A real bank never asks. If you're scammed, call 1930 at once. Like, share and subscribe to Sandesh Explains.) | Camera lands on the roof of the tallest tower where we began; rain eases; host big, city behind. | End card held 2.5 s+: profile photo, **@sandeshexplains**, LIKE / SHARE / SUBSCRIBE, "NEVER SHARE · NO BANK ASKS", helpline chip. | Resolve chord, rain softens. |

Host appears at 3 perches (about 17 s, about 28 %); a fourth short one can be added in shot 7 if the voice needs it. The host is composited into the 3D plate: same teal grade, a cyan rim light, an amber spill from the code.

## Recap test
Shot 9 is the same rooftop as shot 2. The amber code, the tower, the road and the red line are each revisited before the end card.

## Chain of causes (for the script)
You ask for a code > the bank makes one specific to this payment > it must travel (telecom, tower) > it reaches you > only the match approves it > so a stranger who gets it can approve something instead of you > so nobody real asks for it. Planted setup: shot 4 "tagged for this transaction"; pay-off: shot 8, where the fake caller wants the same thing.

## Facts to verify before any script is locked (none read first-hand yet)
1. OTP lifetime: banks differ (often a few minutes). I will NOT claim "4 minutes" or "5:00" unless a source says it; the headline above is a placeholder and could become "a few minutes".
2. "1 in 1,000,000" is maths for a 6-digit code (0 to 999999) and is safe.
3. The OTP SMS usually names the amount and merchant. True for most bank SMS but depends on the bank; show as "typical".
4. RBI's authentication directions (issued 25 Sep 2025, domestic from 1 Apr 2026) require an extra dynamic factor for digital payments; this is a secondary-source summary and the RBI page needs reading.
5. "No human saw it" (shot 6): SMS gateways can log content; I will cut this line unless a source supports it.
6. "No real bank asks for OTP": the standard warning on bank and RBI awareness pages; I will cite one.
7. The fake caller is shown as a silhouette with no brand, no police agency, no real number. It is labelled illustration.

## Blender 3D plan (and the honest cost)
- Procedural city in `bpy`: instanced box buildings with emissive window grids (random on/off by a fixed seed), towers, a river of lane curves, a telecom building, a tall bank tower, 3 hero rooftops (perches), wet-road reflections, rain streaks, volume fog. The OTP digits are extruded text with an emissive amber material, the web lines are curve objects, and the camera follows a keyed path with the swing physics.
- Render budget is the risk. This box has 4 CPUs and no GPU. 60 s at 60 fps is 3,600 frames. I will render the world at **540x960 or 720x1280, 24 fps, 1,440 frames**, Cycles at low samples with the denoiser, then bring it to 1080x1920@60 with ffmpeg (motion-interpolated, or frame-blended with a fixed seed so it stays deterministic) and add the HUD, captions and host on top in the page. HUD and host stay crisp because they are DOM.
- **First step after approval is a 20-frame render test** to measure seconds per frame. If it is more than about 25 s/frame, I cut samples, shorten the city, bake the fog, or split the world into 3 camera legs rendered in parallel. I will tell you the numbers before committing to the full render.
- Page contract unchanged: `__seek(t)` picks the pre-rendered frame for `t` (as in the Blender sequences in other reels), so the render stays a pure function of `t`.

## Asset families (>= 6)
Blender 3D city (primary) · extruded 3D digits and web curves · cut-out avatar host composited into the plate · DOM HUD and kinetic captions · tabler icons and stamps · real-footage overlays (rain/dust, low) · synth score and designed SFX (rain, relays, thwip) · a real hand-and-phone photo or footage insert for frame 0 (to source).

## Benchmark to beat (reel-04 and the UPI chai reel)
1. A real 3D world with a physical camera move, not 2D layers.
2. The camera is the narrator: the swing rhythm carries the beats.
3. The host is lit into the plate.

## What happens after you approve
1. Revise the storyboard per your notes. 2. Read the primary sources for the ledger. 3. Final Hindi script + 4 avatar prompts (0 FAIL check). 4. 20-frame Blender render test and report the cost. 5. A 3-frame look mockup for approval. 6. Only then the full build, validation and render.

---

# REVISION v2 (user: faster, denser, no generic lines): the shot table above already uses this dialogue

Dropped: "let's follow it back", "we're slowing it down", "just imagine", all throat-clearing. The slow-down factor stays as an on-screen label only (build rule), never spoken. Every sentence carries a fact. FAST mode: 4 parts x 45-48 words (~3.1 w/s), 188 words, still ends at about 60 s. Shot times below shift slightly (the camera acts on the words); shot order is unchanged.

| Part | Time | Hindi line (draft) | Facts carried | Shots |
|---|---|---|---|---|
| 1 | 0-15 | आपके फ़ोन पर अभी एक OTP आया। छह अंक, दस लाख में से एक। बैंक का सर्वर इसे आपके इसी पेमेंट के लिए बनाता है। किसी और पेमेंट पर यह नहीं चलेगा, और कुछ ही मिनट में ख़त्म हो जाता है। | 6 digits = 1 in 1,000,000 (maths); made per payment (verify); expires in minutes (bank-specific, no exact number spoken) | 1-4 (phone, bank tower, number wheel, perch 1 on "ख़त्म") |
| 2 | 15-30 | फिर यह SMS बनकर SMS गेटवे जाता है, वहाँ से आपकी टेलीकॉम कंपनी के कोर में, और सबसे पास के टावर से हवा में आपके फ़ोन तक। पूरे रास्ते में कुछ सेकंड लगते हैं, इसीलिए नेटवर्क कमज़ोर हो तो OTP देर से आता है। | 4 hops: gateway > telecom core > tower > phone; seconds; weak network = late OTP (general, verify) | 5 (the long swing over the fibre river to the tower) |
| 3 | 30-45 | आप कोड डालते हैं, बैंक मिलाता है, पेमेंट पास। एक बार इस्तेमाल हुआ तो कोड बेकार, और कई ग़लत कोशिशों पर ट्रांज़ैक्शन ब्लॉक। इसलिए कोड का अंदाज़ा लगाना बेकार है। असली कमज़ोरी आप हैं: कोड बोल दिया, तो पेमेंट उसका। | single use; wrong attempts blocked (verify); the weak link is the person | 6-7 (tower perch short, dive to phone, tick, code burns out) |
| 4 | 45-60 | कोई बैंक अफ़सर बनकर जल्दी मचाए और यही कोड माँगे, तो वह आपकी पहचान नहीं, अपना पेमेंट पास करा रहा है। असली बैंक कभी OTP नहीं माँगता। ठगी हो जाए तो तुरंत एक-नौ-तीन-शून्य पर कॉल करिए। लाइक, शेयर और सब्सक्राइब करिए, Sandesh Explains को। | urgency tactic; "your OTP approves THEIR payment"; no bank asks; national cybercrime helpline 1930 (verify on the official site); CTA | 8-9 (red caller, perch 3, end card) |

Changes vs v1:
- The host perches now signpost without filler: perch 1 sits on "ख़त्म हो जाता है" (the expiry), perch 2 is shortened to a 2 s cut-in on "टावर", perch 3 holds the warning plus the CTA.
- New concrete content: the 4 hops by name, the "weak network = late OTP" effect, single use, blocked after wrong attempts, the helpline.
- Cut: the "no human saw it" claim, the "slowed 100x" speech, every "let's"/"imagine" opener.

Still to verify first-hand before the script is locked: OTP validity and attempt limits (bank or RBI pages), "made per payment", the 1930 helpline wording, and "no bank asks for OTP" (an RBI/bank awareness page).
