# Next reel: "ultra-realistic movie visuals + choreographed camera" (17 Nov 2026)

## What the brief needs, and what this machine can honestly do
Realism is a rendering problem, not a topic problem, so the route comes first. Tested today on this box (4 CPUs, no GPU):

| Route | Realism | Camera choreography | Cost / blocker |
|---|---|---|---|
| **A. Blender Cycles (path tracer) for people-free subjects** (space, rock, atmosphere, machines) | Film-grade lighting, real shadows and glints; as real as the textures we feed it | Any move at all, keyframed, motion blur, DoF | **Tested: `pip install bpy` works (Blender 5.3). A simple lit rock at 540×960, 48 samples, denoised = 9.8 s a frame.** Roughly 4× at 1080×1920. ~600 animated frames ≈ 3 h at 810×1440. Needs resumable chunks and the session kept alive |
| **B. Real photos/footage + depth parallax** (NASA, Wikimedia) | Real by definition | Short, shallow moves only | Good for Earth, Moon, sky, ground plates; cannot fly through |
| **C. Hosted video generation** (Figma Weave, or the creator's own tool as with the avatar clips) | Highest for people and nature | Prompt-driven, less exact | **Weave still reports the account as not linked** (link at app.weavy.ai → profile → Figma; credits need approval). The creator's own generator would need shot prompts |
| D. three.js (our current engine) | Stylised; the Dev Deepawali look | Fully authored | Cannot reach "movie real"; stays for explainer reels |

**Rule that follows:** people are the hard thing for A and B (and our own rule bans cartoon humans), so pick a subject with **no characters** and build it as photoreal **objects, light and space**. My test rock (`insights/geminids-2026/cycles_test.png`) is crude on purpose (a timing test), but it proves the pipeline; the real build adds photographic surface textures (OSIRIS-REx Bennu imagery, public domain), a real star field, real Earth plates, film grain, lens bloom and DoF.

## Shortlist (ranked for this brief)
| # | Topic | Why it is cinematic | Hook | Verified so far | Honest limits | Fit |
|---|---|---|---|---|---|---|
| **1** | **The Geminids: shooting stars that come from a rock, not a comet** (peak night 13–14 Dec) | One unbroken camera ride is possible: Phaethon's surface → a sand-grain leaves → crosses space → hits air at 35 km/s → burns → the viewer's sky. Pure space, rock, light: Route A's best case | "14 December ki raat jo taare tootenge, woh ek chattaan ke tukde hain." | See ledger below | Phaethon has never been imaged up close: the model is an impression from radar shape + a Bennu-like surface, labelled | **Best.** Timely (3.5 weeks), sendable take-away, a real mystery |
| 2 | Delhi's smog is a lid (temperature inversion) | A camera rises through layered haze at dawn; strong stake for Indian viewers | "Delhi ki hawa upar kyon nahi jaati?" | Not researched yet | Volumetric smoke is the slowest thing to path-trace; needs real AQI data | Strong stake, heavier render |
| 3 | Ramayana tie-in: how far is "100 yojana" of ocean? (Hanuman's leap as a flight over Palk Strait) | Aerial camera over real coast + ocean | Film tie-in (account's best performer) | Ram Setu data already in the repo | Needs a body in the air; ocean realism is expensive; Ram Setu and Jatayu already cover this area | Good tie-in, hard realism |
| 4 | A real Ramayana-linked place from the air (Sigiriya / Lanka candidates) | Real aerial photos with parallax | "Kya yeh Ravan ki Lanka thi?" | Not researched | Disputed identification; photo licences | Route B only, so less "movie" |

## Recommendation: #1, the Geminids
**Why it fits the brief:** nothing in it needs a person; the story is one object travelling a very long way, which is exactly what a choreographed camera is for; and every visual (rock, grain, atmosphere, streak) is something Cycles does well.

**Why it fits the channel:** the same "the sky answers the question" formula as Dev Deepawali, but with a different reversal (rock vs comet) and a different take-away (go outside on a named night). Using the Instagram data: film-linked reels did best, this one is not film-linked, so it leans on the sendable-take-away and 3-second visual spectacle instead; it should be judged on saves and sends, not views.

### One-sentence story
The shooting stars on 13–14 December are sand grains from a 5 km rock that behaves like a comet; nobody has seen where they come from up close, and a Japanese probe launching in 2028 will go and look.

### Draft beat sheet (But / Therefore), about 70–75 s
1. **Hook (0–6 s):** camera already moving in the dark; a grain streaks across the frame. "14 December ki raat jo taara toota dikhega, woh asal mein ek chattaan ka tukda hai."
2. **Plant (6–14 s):** shooting stars are usually comet crumbs. **BUT** the Geminids are different: their parent is 3200 Phaethon, a rock about 5 km across (NASA says 5.10 km, ESA 5.8: show a range), found in 1983 by the IRAS satellite; Fred Whipple linked it to the shower.
3. **Ride (14–40 s), the one long camera move:** the camera follows a grain off Phaethon's surface; Phaethon swings closer to the Sun than Mercury (ESA: about 21 million km, 524-day orbit); the surface is scorched; **BUT** a rock should not shed anything. **THEREFORE** (the 2023 SOHO finding): its brightening in sodium light, the "rock comet" label, and the fact that sodium alone cannot explain the stream.
4. **Dark moment (40–48 s):** the shower is young: 10–20 meteors an hour in the mid-1800s, up to about 120 now (NASA). Something broke off, maybe less than 1,000 years ago; nobody has seen it.
5. **Impact (48–58 s):** the grain meets air at 35 km/s (NASA), yellow, dense (2–3 g/cc vs 0.3 for comet dust). A strike through the sky, then the viewer's own sky.
6. **Take-away (58–68 s):** moon sets by about 8:45–9:40 pm (our calculation, 20% lit); the radiant (near Castor) is 52–63° high at midnight and almost overhead at 2 am from Delhi, Varanasi, Mumbai and Chennai; look away from the radiant, wait twenty minutes, expect 40–50 an hour under a dark sky. "Isse kisi ko bhejo jiske saath chhat par baithoge."
7. **Follow ask, then the last payoff (68–75 s):** the real mission: JAXA's DESTINY+ launches in 2028 and flies by Phaethon in 2030; the answer is coming.

### Camera choreography idea (one hero shot + five support shots)
`0 s` tracking a streak past a locked-off star field → `6–14 s` slow orbit of Phaethon (the reveal of scale with a distant Sun) → `14–40 s` the **single continuous ride**: a pedestal-up off the surface, a long arc around the sunward limb with lens flare and DoF racking from rock to grain, a pull-back that reveals the Earth as a tiny blue disc, then a fall toward it → `40–48 s` locked-off slow push (stillness for the dark moment) → `48–58 s` whip into the atmosphere, follow the burning grain, cut on the streak to the ground view (a real Geminid photo plate with parallax, credited) → `58 s+` pull-back to the viewer's rooftop sky.

## Fact ledger (tiered; read first-hand today unless noted)
| Claim | Tier | Source |
|---|---|---|
| Peak night 13–14 Dec 2026; EarthSky predicts 05:44 UTC on 14 Dec; activity roughly 4–20 Dec | B | EarthSky, Telescope Advisor, Farmers' Almanac (search results; one outlier says gibbous moon: wrong) |
| Geminids 35 km/s; up to 120/hour at perfect conditions, about 40–50 under dark skies; yellow, bright; grains 2–3 g/cc vs 0.3 for comet dust; first seen mid-1800s at 10–20/hour | **A** | NASA Science, Geminids page (fetched) |
| 3200 Phaethon: 5.10 km across, 1.4-year orbit, found 11 Oct 1983 by IRAS, Whipple linked it to the Geminids, possibly "dead comet" or "rock comet", spectra like a rocky asteroid, no ordinary tail | **A** | NASA Science (fetched) |
| ESA gives 5.8 km, 524-day orbit, about 21 million km at perihelion; the tail is **sodium**, not dust (SOHO, Zhang et al. 2023); sodium alone cannot explain the stream; possible mass-loss event < 1,000 years ago | B | ESA "SOHO chases asteroid's tail" and Planetary Science Journal paper (search summary; **open the paper first**) |
| DESTINY+ launches in JAXA fiscal year 2028 on an H3 rocket as a rideshare with ESA's RAMSES; Phaethon flyby FY2030 (an abstract says November 2030) | B | JAXA DESTINY+ notice (destiny.isas.jaxa.jp), DLR 28 May 2026, JpGU 2025 abstract (search summaries; **open the JAXA notice first**) |
| Moon 20% lit on 13 Dec; moonset 20:46 Varanasi, 21:04 Delhi, 21:16 Chennai, 21:38 Mumbai; radiant (RA 7h28m, Dec +32°) altitude 52–63° at midnight and 71–84° at 2 am | **A (ours)** | PyEphem 4.2.1, `gem.py` (to be saved with the reel) |

Not usable: Gaganyaan G1 (no confirmed date; Q4 2026 target only), so no launch tie-in.

## Decisions for you
1. **Topic:** the Geminids (recommended), or one of 2–4?
2. **Realism route:** A (Blender Cycles, built here) as recommended, with real NASA/Wikimedia plates for Earth and the ground sky. If you want true video-generation realism, link Figma to Weave (or tell me your generator) and I will write shot prompts.
3. **Look and length:** movie grade (anamorphic flare, grain, DoF, letterboxed-feel colour) with a 70–75 s runtime, and a hand-built score. OK?
4. **Publish:** target 11–12 Dec so the reel is live before the 13–14 Dec peak.
