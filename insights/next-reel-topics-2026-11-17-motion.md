# Next reel, take 3: ultra-real AND in motion, for a 10th-pass village viewer (17 Nov 2026)

## What went wrong with the pala reel (so the next one does not repeat it)
`reel-pala-frost` was eight still renders with a slow depth-parallax push. The only things that moved were the camera and some overlay arrows, so it read as a slideshow. Nothing in the world itself moved: no leaf, water, cloud, rain, light or person. **The new rule for the next reel: the subject of every scene must move by itself, and the motion must be the explanation.** The pala reel is left exactly as shipped.

## Topic filter (what makes a topic work for this viewer)
1. It touches their field, roof, water, animals or family, and they can do or check something tonight.
2. The explanation *is* a motion (something grows, flows, falls, branches, spreads), so animation is the content, not decoration.
3. Spectacular enough to be filmed in a path tracer: light, water, fire, cloud, rain.
4. Facts available at tier A from an Indian or international primary source.
5. No cartoon people. Humans only as voxel, brick or mocap figures (standing rule).

## Shortlist (scored)
| # | Topic | Village stake | The motion that explains it | Realism route | Facts today | Season |
|---|---|---|---|---|---|---|
| **1** | **Lightning: "Bijli kisan par hi kyon girti hai?"** | NCRB: 2,825 lightning deaths in 2024 (+10.4% on 2,560 in 2023), secondary sources; top states MP 577, Bihar 360, UP 275, Odisha 249, Chhattisgarh 241. Most victims are people working outdoors | A leader climbs down in 50 m steps and branches; a positive streamer rises from the tallest thing (a tree, a person standing upright); they meet; the return stroke flashes up the channel. Then the same field with a person crouched. Rain, wind and flash relight on every frame | Cycles night plates **lit three ways** (dark, flash from left, flash from right) so the flash relights the real scene; bolt grown by a deterministic procedural stepper; rain and cloud as shader layers; one brick-figure farmer running, then crouching | NOAA/NSSL leader-and-streamer sequence (A, read today); NDMA advice via news summaries (B: **open the NDMA PDF first**, the IMD copy 404s); NCRB figure B | Peak Mar–Jun and monsoon; evergreen safety; best posted late Feb to March |
| 2 | Kohra (fog): "Subah khet par dhundh kahan se aati hai?" | Dec–Jan fog stops buses and trains, hurts rabi crops | Warm moist air meets the cold ground; droplets form and the fog **flows downhill** like water, thickening in low fields | Volumetric fog in Cycles is slow; shader fog over plates is cheap | Basic meteorology; need IMD fog definition (visibility under 1 km) first-hand | **Now (Nov–Jan)** |
| 3 | Borewell: "Zameen ke neeche paani kahan se aata hai?" | every farm; CGWB 2025 stage of extraction 60.63% (news summary of PIB) | Rain soaks down through soil layers into the aquifer; the borewell pulls it back up; the level sinks as more is drawn than returns | Cutaway earth with water flow shader | B; open PIB PRID 2220203 | evergreen |
| 4 | Cloudburst / "Baadal phat gaya" | hill and plains flash floods | A cloud holds droplets aloft until an updraught fails and everything drops at once | Volumetric cloud: heavy | Need IMD definition (100 mm/h over a small area) first-hand | Monsoon |
| 5 | Snakebite: what actually saves a life | ~58,000 deaths a year | Venom path and the time cost of the ojha detour | Macro animal realism is the hardest thing here | B; medical advice must come from NAPSE/WHO documents I have not opened | Monsoon |

## Recommendation: lightning
It has the strongest stake (people dying while working in the open), the most violent and beautiful motion in nature, and the mechanism is a literal sequence the viewer watches build: **the tallest thing reaches up to meet it**. That one idea is the reversal: it is not luck, and standing up straight in a flat field makes you the tallest thing. The remedy is physical and checkable (crouch, feet together, leave the water, leave the tree, get into a pukka building or a closed vehicle).
**Timing caveat:** the peak season is Mar–Jun, so this is best released in late Feb or March. If you want something that is true *this week*, kohra (#2) is the seasonal pick and uses the same engine (moving fog instead of a bolt). I would build lightning now and hold the release.

## How the motion would actually be built on this machine (honest costs)
Cycles on 4 CPUs is far too slow for a fully path-traced animation (a trivial rock took 9.8 s per 540×960 frame at 48 samples; a field scene is several times that, and 76 s at 30 fps is about 2,300 frames). So realism and motion are split:
1. **Photoreal base = a few Cycles plates, each lit several ways** (night, flash-left, flash-right, dawn). A lightning flash relights the *real* scene by cross-fading between lighting states on the exact frame of the strike, with the cast shadows jumping. This is the trick that makes a procedural bolt look filmed.
2. **Everything that moves is procedural and a pure function of `t`:** the stepped leader and its branches grown step by step with a deterministic hash, the rising streamer, rain streaks with depth, wind sway on foliage layers (render foreground plants as separate alpha layers, then displace them), cloud and mist from animated noise shaders, ripples on a pond, grass, birds leaving the tree.
3. **One or two short true Cycles animations** (3–4 s at 12 fps, interpolated) only for hero beats, after a measured timing test in the mockup.
4. **A brick or voxel farmer** (allowed by the standing rule) who works, sees the sky change, runs, then crouches, animated procedurally from a few keyframes; a second figure standing under a tree for the wrong choice.
5. **Authored camera moves that follow the action**, not a drifting parallax: a push as the leader descends, a whip to the tree, a pull-back at the strike.
Mockup first (three scenes from three families, per the standing rule), with a measured frame time, before the full build.

## Draft story spine (But / Therefore, ~70–80 s, Hinglish)
1. Hook: a flat field, a farmer and one tall tree; the sky turns; the voice starts on the first frame. "Bijli girne se pehle hota kya hai?"
2. The cloud charges; a leader steps down in jumps, branching.
3. BUT the ground answers: something rises from the tallest thing to meet it (tree, then the farmer).
4. They connect: the flash, the shadows jump, thunder arrives late (count the seconds).
5. Honest numbers: 2,825 deaths in 2024 (reported); where they happen; why outdoor workers.
6. What to do: crouch, feet together, leave the water, not under the tree, a pukka building or closed vehicle; a person struck is safe to touch (NDMA via summaries, to be opened first).
7. Follow ask, then the last payoff: the same field, the farmer crouched, the bolt hits the tree instead.

## Fact ledger so far
| Claim | Tier | Source |
|---|---|---|
| Stepped leaders move down in steps of about 50 m, branching; ground objects send positive streamers up, usually from the tallest objects; contact gives the return stroke; lightning can still strike open ground | **A** (read today) | NOAA/NSSL Severe Weather 101, NOAA JetStream, weather.gov |
| 2,825 lightning deaths in 2024, +10.4% on 2,560 in 2023; MP 577, Bihar 360, UP 275, Odisha 249, Chhattisgarh 241 | B | Secondary summaries of NCRB ADSI 2024 (**open the NCRB report first**) |
| Open-field advice: crouch on the balls of the feet, feet together, head tucked, hands over ears, do not lie flat; leave water and paddy fields; avoid trees, metal, power lines; get into a pukka building or hard-top vehicle; a struck person carries no charge, give CPR | B | News summaries of NDMA/IMD do's and don'ts (**open the NDMA PDF first**; the IMD link returned 404) |
| Damini (IITM Pune) lightning alert app still promoted in Dec 2025 and June 2026; alert radius and lead time vary by source (20–40 km; 30 min to 2 h) | B | India TV Dec 2025; a June 2026 college notice (**confirm on the Play Store; give no lead time unless read first-hand**) |

## Decisions for you
1. **Topic:** lightning (recommended, release late Feb/March) or kohra (true now)?
2. **Motion bar:** OK with "photoreal plates relit by the flash + procedural leader, rain, sway, cloud and a brick-figure farmer", plus 1–2 short true Cycles animations if the timing test allows?
3. **Voice and CTA:** same Hinglish clone, follow ask before the last payoff, nerdlogic.co end card?
