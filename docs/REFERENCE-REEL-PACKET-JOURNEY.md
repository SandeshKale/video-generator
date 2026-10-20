# Reference reel study: "The photo your mom just sent" (20 Oct 2026)

Supplied by the creator as the bar for **all future reels**: *"this kind of animation, motion, live action integration, clarity of thought and flow of speech."*
Source video: 162.3 s, 720x1280, 30 fps, English, one creator-on-camera plus a continuous 3D world (not ours; study, never copy wording, shots or look).
Method used by its author: the public skills in `goodnight000/cstack` (`video-script`, `animated-video`, `video-edit`, `asset-library`; read 20 Oct 2026, cloned read-only to `/home/user/goodnight000/cstack`). Section 6 maps those skills onto this repo.

## 1. What the reel is

One question, one object, one journey. A photo your mom sends travels phone -> tower -> routers -> Pacific cable -> LA -> your phone in 200 ms, and **the film itself is that journey**: a single camera "follows the packet" through a continuous 3D world, with a millisecond clock that counts up in the corner (000 -> 200 ms, labelled "slowed 750x" in speech). It is 2.7x our usual length (162 s vs 50-70 s) and still holds because every 10-15 s something new is *caused* by the previous thing.

## 2. Script and flow of speech (the biggest transferable lesson)

Timestamped from Whisper (small). Structure, with the exact job of each beat:

| Time | Beat | What it does |
|---|---|---|
| 0-15 | Hook + stake | "Right now, 4,000 m below the Pacific, a beam of light is travelling to Los Angeles at 200,000 km/s. It is carrying a photo your mom just sent." Concrete place, number, and **a viewer-owned object** (their mom's photo) in the first 9 s. Frame 0 is already a full composition (headline, glowing beam on the sea floor, a real caption). |
| 15-20 | Contract | "Let's slow down those 200 ms 750 times so we can see everything that happens to the photo." Tells the viewer the scale rule once, then every scene obeys it. |
| 20-45 | Problem 1 | Phone only knows 1s and 0s -> 16 million of them -> encrypted ("to an interceptor, random numbers") -> too big -> 1,500 packets, each labelled. **Plants a hook for later:** "Remember those packet numbers, because your phone is going to need them at the end." |
| 45-78 | Problem 2 | Radio -> tower -> light into fibre. "This next part is the most impressive part": no machine knows the whole path; each router does one thing; a broken link means another route. |
| 78-110 | Problem 3 | The ocean cable: garden-hose thick, hair-thin glass, ~600 cables carry 99% of intercontinental data ("most people assume satellites, but the cables do"), repeaters every few dozen km, 12,000 km in 60 ms. |
| 110-137 | Pay-off of the planted hook | 150 ms LA, packets arrive in the wrong order, three lost, the numbers let the phone sort them and re-request exactly three. 1,500 arrive, decrypt, screen lights at 200 ms. |
| 137-162 | Recap + meaning | 1858 telegraph: 16 h for 98 words vs 0.2 s today; "no country owns the internet... billions of machines whose owners have never met follow the same agreement: when a stranger's packets arrive, pass them on." Lands on the opening experience (mom's phone) and on a single emotional idea. |

Properties to copy:
- **A chain of causes**, not a list of components: each part is the previous part's problem (too big -> split -> needs numbering -> numbers fix the loss at the end).
- **One concrete example followed all the way through** (packet #0847 gets a yellow tag, is followed on screen from phone to LA, and is the one that is "lost").
- **A planted setup and a paid-off ending** ("remember the packet numbers" at 43 s, used at 122 s).
- **Honesty markers:** "slowed 750 times", "only about as thick as a garden hose", "about 600 cables"; every number on screen equals the voice.
- **A busted myth as a retention beat** (satellites) and an **"impressive part" signpost** before the mechanism.
- **Sentences are complete and spoken, ~2.7 words/s**, plain words, contractions avoided but never jargon without a body ("repeater" is shown while it is said). No filler; the only silences are breaths between beats.
- **Ends on the recap test:** every part (encrypt, split, route, cable, repair, reassemble) reappears in the last 25 s, and it lands back on "your mom's phone".

## 3. Visual system (what the eye sees)

- **One world, one camera, many places.** Only 4 hard cuts in the whole reel (scene-change detector at 0.3: 14.9, 20.4, 44.7, 87.4 s plus the host-reveal cuts at 134-149 s). Everything else is a *travelling* camera or a match move: bokeh -> phone screen -> pixels become binary rain -> binary rain becomes a golden packet field -> a packet rises through the city -> tower -> cable -> router rack -> seabed. The edit is the journey.
- **Meaning-coded colour.** Deep navy world; **amber/gold = the packet and anything that carries it** (the only warm, saturated thing in frame), cyan-blue = infrastructure, light, the clock; **red = loss** (the "1,497 / 1,500" counter turns red, three red tiles). A colour keeps its meaning all film.
- **A live through-line HUD.** Top-right ms clock counts in real time of the *slowed* film (000, 001, 003, 009, 020, 023, 073, 154, 168, 195, 200), top-left a "location + depth" tag; mid-reel counters (99%, 12,000 km, 60 ms, 1,497/1,500) appear only on their word and leave.
- **A bespoke object for every claim:** hair-thin fibre bundle next to a garden-hose-scale sheath; a wireframe globe with cable arcs lit for 99%; a repeater with glowing bands; a tile field of 1,500 numbered packets with three red empties; ship + telegraph cable for 1858; a wall of 1s and 0s with a padlock for encryption.
- **Real-world anchors** at the beginning and end: a real phone UI (iMessage with the actual photo of a meal, "Mom, what are you up to?"), a real photo of food, 2 s of a thumb. Photoreal food photo and phone make the abstraction personal.
- **Caption style:** Bebas-like condensed bold white, one short phrase, bottom third (~y 76%), with the numeric word in **amber** ("200 milliseconds", "16 million", "99%", "60 milliseconds"); hook headline in glowing amber at the top for the first 3 s. Captions are sense units, never word-by-word.
- **Frame density:** median frame-to-frame change at 4 fps is high (9.3); the longest quiet stretch is 1.25 s. Motion is mostly *camera and many small parts*, not a drifting hero.

## 4. Live-action integration (the host)

- The creator appears in **9 short windows, about 30 s of 162 s (~18%)**, always chest-up, full 9:16, framed *below* the animation story so the world sits behind and around him.
- **He is composited into the world, not slated on top:** same navy grade, the room's own lights match the scene (cool blue rim on hair/shoulders, warm amber spill when a packet tag floats beside him), CG tags (#0847, #0346, #0828 ...) float *behind and beside* him and a router-cable ring (blue lines with gold pulses) wraps around his head height. In the 20-s scene the cables run behind his head; in the LA scene the binary wall is behind him.
- **When he shows up and why:** to *signpost* (the contract at 15 s, the "remember these" at 42 s, the "most impressive part" at 57 s, the satellite myth at 92 s, the "this is where the numbers matter" at 122 s, decrypt at 131 s, the meaning at 149 s). He is the reaction/emphasis layer; the world does the mechanism. Never talks over a mechanism he is not pointing at.
- **Eyes on lens, hands doing small deictic gestures** (pointing up for "satellites", thumb and finger for "tiny"), a lav mic in shot, natural expression. Cuts to/from him land on speech boundaries, not mid-word.
- **Framing was planned for the composite** (the skill: plan what stands behind and around the presenter from the start; chest-up with room above the head fails; light must agree with the plate).

## 5. Motion and audio

- Motion grammar (from `animated-video` + motion kit): every beat has an *event* (cut, send, hit, copy) and the camera answers it (anticipation + settle); parts arrive staggered, not together; effects are punctuation, brief, hero kept in view; real camera moves (dolly, crane, orbit, whip ~7-10 frames), not generic pans; shake only on hits. Weight: big masses smooth, small parts click.
- Measured (our tools): -14.2 LUFS, -1.2 dBTP, LRA 2.3 (a very even, voice-forward master). Voice is dry and close; music is a low bed with whooshes/clicks/risers on events (relay clicks, sonar ping, underwater ambience, servo, glass ting in the cstack SFX library). Effects land *after* the cue word's onset, never on it.
- Audio was cue-sheet driven: sound events come from the same constants that draw the picture (change a beat, its sound moves).

## 6. How the author's pipeline works (cstack skills)

1. **`video-script`**: ideas judged by **stake** (who beyond insiders cares), **first two sentences** (answer or raise the hook), **proof** (what the viewer sees); script written as *time | spoken line | on-screen picture | capture needed*; explainer rules: chain of problems, one traced example, written-to-be-seen, analogies true under an expert check, recap test.
2. **`animated-video` (Remotion + three.js, deterministic)**: brainstorm the pictures in a *fresh agent with no rules*, pick in a second agent (clarity, surprise, spectacle, cost), user approves concept + beat sheet, lock style from side-by-side style frames, **audio spine first** (word timestamps -> `cue("phrase")` so a new voice re-times the film), key-frame board, parallel shot builds, review by frame strips + audio measurements, **mute test** (a fresh judge describes the silent, caption-less film second by second; every claim must be recoverable), restart rule if the whole cut is rejected.
3. **`video-edit`**: speech cuts, eyes-on-lens trimming, real logos/photos on named words, caption mechanics, voice processed minimally to -14 LUFS.
4. **`asset-library`**: reusable bundles (globe, iMessage iPhone, designed sounds, realism kit, motion kit) so each film starts higher.
5. Realistic 3D rules: scale in metres, roughness-driven realism, light from sky/emissives, haze, one tone-map, supersample, seeded everything; hands/faces are where real-time CG fails first, so keep CG people out and use the real host.

## 7. Gap analysis vs this repo (honest)

| Aspect | Reference reel | Our usual reel | Gap |
|---|---|---|---|
| Continuity | One travelling camera; 4 cuts in 162 s | 8-11 scene cuts / 60 s with tile or wipe transitions | **Large.** We cut; they travel. |
| Spatial world | Continuous 3D world (phone, city, tower, router, seabed, LA) | Per-scene DOM/canvas pages; Blender used for objects | Large: no persistent world or camera. |
| Host integration | Host *inside* the scene lighting, CG behind/around him, ~18% screen time, signposting role | Avatar tile in a corner (or cut-out bottom-right) | Medium-large: we have good mattes, not a lit, world-coupled composite. |
| Speech | One cause chain, planted setup + payoff, concrete traced example, ~2.7 w/s, plain | Dense facts, many numbers, faster | Medium: copy the chain/payoff discipline; keep our fact tiering. |
| Quantity of time | 162 s works because each 10-15 s adds a new cause | We cap at ~60-75 s | Not a gap if every 15 s has a new problem. |
| Through-line HUD | ms clock + location tag, counters only on their word | We do this (reel-04, battery dial) | Parity. |
| Captions | One accent word per phrase, bottom third, hook headline top | Pill with highlighted word | Parity; theirs is cleaner (no pill). |
| Audio | -14 LUFS, voice forward, event SFX after cue words | Same method | Parity. |
| Review | Mute test, strips of consecutive frames, judge agents | Contact sheets + lint + cadence | Add the **mute test** and **fresh-agent brainstorm/pick**. |

## 8. What to carry into every next reel (see CLAUDE.md standing rule)

Make the *question a journey of one object*, write the script as a **cause chain with one traced example and one planted-then-paid setup**, build **one continuous world and camera** (travel, don't cut; at most one hard cut per 20-25 s), **place the host inside that world's light** with CG behind and around them and use them to signpost, keep **colour meaning** and a **live HUD**, put the stake on a *viewer-owned object* in the first 9 s, finish with a **recap that revisits every part and lands on the opening experience**, and run the **mute test**.
