# "Game ke 16 mein se 15 pixel asli nahi!" — script + design record (draft for approval, 12 Nov 2026)

Remake of `reel-ray-tracing-backwards` from scratch. Creator feedback on v2: *script weak, not ELI5; visuals hard to follow; glass-product would be better. Bring in NVIDIA, DLSS and gaming-industry ideas; use GTA VI (launching soon) as the hook and build a similar-looking world; be ELI5; the speaker must be enthusiastic.*

## Why this reel (rule: pick from data)
No fresh Instagram pull is possible here (Instagram answers 429, last committed report is old), so the topic is the creator's direct ask. Timing evidence: GTA VI launches **19 Nov 2026** (7 days from today), which is the biggest gaming moment of the year. The reel rides it honestly: GTA VI is the *hook*, not the subject of any claim (see "do not claim" in `research/sources.md`).

## Story line (storytelling gate)
- **Protagonist:** the shiny city on your game screen (a GTA-like coast city) and the GPU drawing it.
- **Want:** every puddle, neon sign and car window shows real, bouncing light, 60 times a second.
- **Obstacle:** real light needs billions of calculations per pixel; a Pixar film frame took ~17 hours (average, reported), a game has 1/60 s: about **3.7 million times** less time.
- **Turn:** the GPU stops trying to do it all. It cheats three clever ways, each one an AI artist filling in the gaps.
- **Payoff + reframe:** NVIDIA claims **15 of every 16 pixels** on a 4K frame can be AI-made (one setting). Next time a puddle shows a building, you know it is a few real rays plus a very good guess. Honest limit: the AI frames can't read your controller, and GTA VI itself has not confirmed any of this.
- **One-sentence test:** *A game city wants real light 60 times a second, but that is 3.7 million times too slow, therefore the GPU draws a rough picture and AI paints the rest, so most pixels you see were guessed, and that is fine.*
- **Carried question (asked at 0:05, answered at 1:25):** "Toh phir puddle mein building kaun banata hai?"

## ELI5 rules for this script (checked line by line)
1. Every idea gets **one thing a 7-year-old already owns**: torch + mirror, dot-to-dot, a tiny sticker blown up, a flip-book.
2. **One new word per scene**, said *after* the picture exists, then the plain-words twin ("Ray Reconstruction, yaani dots jod ke tasveer").
3. Short sentences, concrete verbs, a question the child would ask ("Par kyun?"), then the answer.
4. **Show it before you name it**; the picture does the work with captions muted.
5. Numbers: one per beat, said twice (voice, then big on screen), every one traceable to `research/sources.md`.

## Voice (enthusiastic) — plan
- Script written for an excited friend: exclamations, "Suno!", "Socho!", rising questions, a stretched key word, then a **pause after every reveal** (0.8-1.1 s) so the energy has contrast.
- Pipeline: OmniVoice clone of the creator (as in the other Hinglish reels) with the pause rules from `scripts/pause_rules.py`; A/B the hook line at two speeds and with an energetic reference; pick by measured pitch variation and loudness dynamics plus the Whisper coverage gate. **Constraint:** the clone copies the reference's delivery, and the creator's 15 s reference is calm. A 15-second *excited* recording from the creator would make this much better; without it I raise energy through text, pacing and pauses only, and I cannot hear the result here (flag in delivery).
- Spoken CTA: "... लाइक, शेयर और सब्सक्राइब करें, नर्डलॉजिक डॉट सी ओ को।" (same take style as the last two reels).

## The spoken script (Roman Hinglish master; Devanagari version is written after approval)

| # | Beat (connector) | Line | Words |
|---|---|---|---:|
| 1 | **Hook** | GTA 6, **19 November!** Par socho, aise games mein ek tasveer ke **16 mein se 15 pixel** asli hote hi nahi! NVIDIA ka khud ka daawa hai! | 28 |
| 2 | Plant (promise + question) | Toh phir gaadi ke neeche puddle mein woh building kaun banata hai? Chalo, bachchon ki tarah samjhte hain, aur end mein main batata hoon, aapke controller ka kya hota hai! | 31 |
| 3 | Rung 1: light | Pehle: puddle mein building kyun dikhti hai? **Torch ko sheeshe par maaro**, roshni uchhalti hai! Bas yehi reflection hai! | 19 |
| 4 | **BUT** | **Par** computer ke liye? Ek sooraj se arbon kirnein, har kirna kai baar uchhalti hai! Sabko follow karna, **naamumkin!** | 19 |
| 5 | **THEREFORE** | **Toh** computer ulta chalta hai! Aankh se ek kiran bhejo, har pixel ke liye ek, jahan takraye, wahan ka rang utha lo! Isse kehte hain **ray tracing!** | 28 |
| 6 | Rung 2: scale **BUT** | **Par** 4K screen mein 83 lakh pixel hain! Har pixel ki kai kirnein, aur har second saath baar! Pixar ki Cars ka ek frame, sattrah ghante! Game ko milta hai, ek-saathva hissa second ka! Matlab chhattis lakh guna tez! | 38 |
| 7 | Dark moment (pause) | Seedha hisaab? **Namumkin.** (pause 1.0 s) | 3 |
| 8 | **THEREFORE** | **Toh** GPU ne kiya jugaad! Ek nahi, teen! | 8 |
| 9 | Cheat 1 (frost to clear) | Jugaad ek: **kam kirnein!** Sirf thode dots, dhundhli tasveer. Phir **AI artist** dots jod ke poori tasveer bana deta hai, bilkul dot-to-dot jaisa! Ise kehte hain **Ray Reconstruction!** | 33 |
| 10 | Cheat 2 (lens) | Jugaad do: **chhoti tasveer banao!** Chaar mein se sirf ek pixel! Phir AI use bada karke sharp kar deta hai, jaise chhote sticker ko bade poster mein! Yeh hai **DLSS Super Resolution!** | 36 |
| 11 | Cheat 3 (exploded flip-book) | Jugaad teen: **flip-book!** Aap frame ek banao, AI beech ke frame khud banata hai! NVIDIA kehta hai, ek asli frame ke peeche paanch tak! **Multi Frame Generation!** | 31 |
| 12 | Reversal (the number) | Ab teeno jodo: 4K ke teis million pixel mein se sirf do million asli! Baaki **16 mein se 15, AI!** (pause) NVIDIA ka daawa hai. | 28 |
| 13 | The catch (honest) | **Par** catch! AI wale frame ne aapka button press dekha hi nahi! Isliye lag aata hai. NVIDIA ka jawab: Reflex. Aur GTA 6 console par hai, DLSS NVIDIA PC ka hai, Rockstar ne ye sab confirm nahi kiya! | 40 |
| 14 | Payoff + reframe | Toh agli baar jab puddle mein building dikhe, yaad rakhna: **kuch kirnein asli, baaki AI ka andaza!** Aur woh bhi saath baar har second! | 25 |
| 15 | CTA | Yeh us dost ko bhejo jo kehta hai "game mein sab asli hai"! Like, share aur subscribe karo, nerdlogic dot co! | 21 |
| | | | **≈ 388** |

Runtime estimate: 388 words at ~3.3 w/s ≈ 118 s with pauses, which is **too long for the beat**; cut candidates, in order: line 2's second sentence (move the controller promise into line 1's carry), lines 10-11 trimmed by one clause each, line 6's Cars line stays (it is the dark-moment setup). Target ≤ 100 s (≈ 320 words). The final length is set after the first voice take, not by speeding the voice up.

### Connector check (BUT / THEREFORE only)
1→2 *but who draws the puddle?* · 2→3 *therefore start with light* · 3→4 **but** too many rays · 4→5 **therefore** go backwards · 5→6 **but** 83 lakh pixels × 60 · 6→7 **therefore** impossible · 7→8 **therefore** cheat · 8→9-11 **therefore** three cheats · 11→12 **therefore** add them up · 12→13 **but** the catch · 13→14 **therefore** what to remember.

### Open-loop ledger
| Loop | Opens (s) | Closes (s) | Progress cue between |
|---|---:|---:|---|
| "16 mein se 15 asli nahi?" | 0 | ~72 | each cheat lights 1-2 cells of a 16-cell plate (4 → 8 → 15 at the end) |
| "Puddle mein building kaun banata hai?" | 8 | ~88 | puddle seen small in every scene corner; the answer is the last shot |
| "Controller ka kya hota hai?" (promise) | 14 | ~78 | a faint controller icon on the timeline from the flip-book scene |
| "Seedha hisaab?" | ~46 | ~49 | the 3.7 M x bar |

## Style (Lemo-Opuscar) — recorded before mockup
- **Slug:** `glass-product` (creator's pick). Runner-up: `hologram-hud` (used on v2, judged hard to follow). 
- **Why it fits:** its native moves map one-to-one on the concepts: *frost to clear* = the AI denoiser, *lensing* = Super Resolution magnifying a tiny tile grid, *exploded view and snap* = the flip-book of generated frames, *light that travels inside* = the ray, *caustics* = the reflection landing in the puddle. The invisible thing the "product" does (turn few rays into a full picture) becomes light inside glass.
- **Three invariants kept:** (1) one hero object of glass, metal and light in an infinite black studio, strip lights behind (no photo HDRI), sweep strip behind the camera; (2) exactly one accent family reserved for light, everything else neutral; (3) ultra-thin wide-tracked titles with a glint; silence as a tool before the reveal. (The style's frosted-glass subtitle slab is **dropped**: creator rule, 12 Nov 2026, captions are plain small text with no background or border.)
- **What we adapt (our rules win):** the hero is a fictional **glass city block** ("Neon Coast": palms, towers with lit windows, a coast road with a convertible, a sun disc, a puddle) so the viewer sees a GTA-like world, never a real map/asset/logo; the camera follows **authored shots, locked between moves** (no ambient drift); 30 fps vertical 1080x1920 with safe zones; the voice is **enthusiastic**, not "restrained launch-like"; ELI5 captions in Roman Hinglish; cuts on beats, not dissolves (kept).
- **Palette (new for this series):** black studio + clear/frosted glass; accent family **sunset amber → rose** for light (real rays amber, AI-made rose); brand lime only on the end card ring/handle. Type: Inter Tight 200/300 for titles, Inter 800 for captions at **40 px, plain text (no pill/border/background), word tinted amber**, inside the 1330-1450 band.

## Scene table (expert-sketcher test: question, build order, picture that carries it)
Camera grammar from the style, as authored shots; "AF" = asset families.

| # | Time (approx) | Question the scene answers | Built in this order (on the spoken words) | Camera | AF |
|---|---|---|---|---|---|
| 1 | 0-8 | What is this world? | strip-light sweep draws the glass block's contour in the dark → city lights up inside → puddle glints → title "16 / 16" with 15 cells glowing rose, 1 amber | sweep, slow push | glass 3D, kinetic type |
| 2 | 8-17 | What are we explaining? | camera drops to the puddle; building reflection appears in it; "?" tag | low macro, rack focus | glass 3D, shader |
| 3 | 17-27 | Why does a puddle show a building? | amber light thread: sun → tower → puddle surface → eye; a torch-and-mirror pair beside it | side orbit | light-in-glass, icons |
| 4 | 27-36 | Why can't the computer follow all light? | thread fans into a glass cloud of hundreds, each bouncing; counter climbs; cloud floods the block | high 3/4 orbit | data object, particles |
| 5 | 36-46 | What is the trick? | a glass eye lens in front, a pixel plate (grid) in between; ONE thread per cell, back into the city; cell takes the hit colour | front, slight push | glass 3D, data object |
| 6 | 46-58 | Why is that too slow? | plate grows to 83 lakh cells (counter); two bars: 17 h vs 1/60 s sliver → "36 lakh x"; silence, block dims | straight-on, pull-back | data object, type |
| 7 | 58-70 | Cheat 1: how can few rays be enough? | plate with sparse amber dots (noisy) on frosted glass → frost clears and AI paints the image (rose wash) | macro, rack focus | shader sim, glass |
| 8 | 70-82 | Cheat 2: how can a small picture become big? | tiny 4-cell tile → glass dome lens magnifies → big sharp tile (rose upsample) | macro through dome | lens, shader sim |
| 9 | 82-94 | Cheat 3: how to get extra frames? | six glass frame slides in exploded line: 1 amber (real) + rose (AI) between; snaps shut on the beat; timeline with controller pulse | exploded view, orbit | exploded view, data object |
| 10 | 94-102 | What does it all add up to? | 16-cell plate fills: 1 amber, 15 rose; bar 33 M → 2 M | top-down macro | data object |
| 11 | 102-112 | What is the catch? | controller pulse travels the timeline, skips rose frames, reaches next amber frame (lag bracket); Reflex shortens it; title card "GTA VI · 19 NOV · PS5 / XBOX · DLSS = NVIDIA PC · NOT CONFIRMED" | front, locked | data object, type |
| 12 | 112-120 | Back to the puddle | block returns, puddle reflection in caustic ring; end card (nerdlogic.co ring + LIKE/SHARE/SUBSCRIBE on their words) | pull-back into negative space | glass 3D, brand |

Asset families used: **6** (physical glass 3D render; shader simulation of noise / denoise / upscale run on the film's own city; bespoke data objects (pixel plates, counters, bars, timeline); kinetic type + frosted captions; synth score + CC0 UI/glass foley; brand end card). Mix audit: no family in more than 8 scenes; every scene has ≥ 2.
Mockup must show **3 scenes from different families**: scene 1 (glass hero), scene 7 (frost-to-clear shader), scene 9 (exploded flip-book).

## Benchmark to beat — `reel-ray-tracing-backwards` v2
Ceiling: hologram wireframes on a pad, real shader path-tracer panels, labels as HUD plates; judged "script weak, not ELI5, visuals hard to understand".
New here: (1) **a real glass-render look** (transmission, dispersion, strip-light studio, caustics), the first film with it; (2) **the film runs the three cheats on its own picture** (live noise → denoise → upscale → frame-interpolate shaders applied to the city, with factor labels), so each claim is *seen*, not narrated; (3) **GTA-like world as the hero + a 16-cell plate through-line** that fills as the cheats stack (4 → 8 → 15); (4) enthusiastic ELI5 script with a kid-level object per concept.

## Honesty labels on screen
"ILLUSTRATIVE · NEON COAST IS A MADE-UP CITY" (scene 1 and 12 kicker) · "NVIDIA CLAIM" (15/16, up to 5 frames) · "CARS: AVG, REPORTED" · "PAPER MATH" for 36 lakh x · "SIMPLIFIED" on the controller timeline · "NOT CONFIRMED BY ROCKSTAR".

## Status
- [x] Creator approved script + style + mockup
- [x] Devanagari spoken text + voice (no A/B: creator supplied no reference)
- [x] Mockup (3 scenes) approved
- [x] Full build, overlay-lint 0, render, cover, caption, CLAUDE.md entry
- Cold-read gate: **not ticked** (no fresh reviewer run; creator is the reviewer at this step).
