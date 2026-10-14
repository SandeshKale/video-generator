# Shorts brief: "Four million. Every second." (reel #02, What's Actually Happening) — cinematic cut

Aspect — 9:16 (1080×1920@60)
Target seconds — 32 (hard ceiling 33; the end card is part of it)
Language — English (en-IN voice, cloned creator voice, no avatar video)
Sibling long-form (if any) — none. Series slot #02 in `science-channel/plan-first-10.md` (this brief supersedes that entry; two corrections are listed under "Claims changed").
New facts — none beyond the ledger. Every spoken claim has a ledger id.
Mode — retrospective (published science). The only live element is a counter that runs for the whole reel.

Method: Monkey Magic Shorts spine (write the last line first, question in frame one, progressive reveal, cut on the answer, loop), light explainer mode. **New this reel: the visual grammar is cinematic, not HUD-and-cards** (see "Cinematic direction"). Reel #01 is the baseline to beat.

## First frame (readable with sound off)
Frame 0 is already moving and fully composed: the camera is *inside a capillary*, a river of translucent red blood cells sweeping past in slow motion, shallow depth of field, one cell in sharp focus drifting toward the lens. A large counter sits in the upper third and is already rolling: **`0 000 000 → …`** in mono digits, with one short caption under it: **"SINCE YOU PRESSED PLAY"** (approved wording; the "average rate, reference adult" footnote lives in the post caption, not on screen). The counter *is* the headline. Voice starts at 0.00 s. Captions are visible at 0.00 s.

## Question that cannot be answered until the end
How many cells has your body replaced while you watched this? (Answered in the last 6 seconds: the counter crosses 100,000,000 on screen, with the voice saying it.)

## Delay beats
1. third: *where* the cells come from and go (blood river → bone-marrow factory), a visible number you can sanity-check
2. second: the gut lining is rebuilt in **days**, not years
3. human crumb + myth: "a brand-new body every seven years?", "not quite": a wave of renewal sweeps a body and **stops at the brain**
4. share line, then the counter pays off

## Last frame (the answer)
Pull back until the whole body is a galaxy of points. The counter crosses **100,000,000** with a sub-bass hit and a lens-flare streak, then the end card holds. The loop: the counter is still running at the end and the last frame cross-fades to the first, so the replay starts from "0" with the new number already implied.

## Spoken lines (12 words or fewer each)
1. While I say this, your body replaces millions of cells.
2. About four million. Every second.
3. Most are blood cells. A red blood cell lasts about four months.
4. Your gut lining? Three to five days.
5. A brand-new body every seven years? Not quite.
6. Most of your brain's neurons are never replaced.
7. Send this to the friend who says they're a new person.
8. Since you pressed play: about a hundred million.
9. Follow for the next one.

(74 words. At the cloned voice's ~2.8 words/s that is ~26 s of speech; designed silences ~3 s; end card ~3 s.)
**Sync constraint:** the counter is exactly `3.82 M × t` (330 bn ÷ 86,400 s = 3.82 M/s). It reads ~95 M when line 8 says "a hundred million" and crosses 100,000,000 at **t = 26.2 s**, the first beat of line 9's lead-in. Assemble the voice so line 8 ends at 25.6–26.2 s, not the other way round.

## Spine
When you want to know how many cells your body has replaced while you watched this (a number nobody ever sees), you ride the camera through the places where it happens (blood, gut) and discover most of the "new body" story is wrong where it matters (your neurons stay), and you leave believing you are **constantly being rebuilt, but not rebuilt from scratch** (belief at frame one: "I'm basically the same body forever" or "I'm a new person every 7 years").

- **Drama (mismatch):** you feel like one continuous person; your body is silently swapping out millions of parts per second.
- **Antagonist:** time itself (a running clock you can't see).
- **Goal:** know the number.
- **Change:** from "a vague idea that cells get replaced" to "a precise rate, and an exact list of what is and isn't replaced". Shown by a counter, a body-wide wave that stops at the brain, and the payoff.
- **Rasas (2, Short tier):** Adbhuta (scale: millions per second, journey inside you) and Hasya (the "new person" friend, one light beat).
- **Why (project motive, present tense):** this series shows what is actually happening inside you. Not spoken (no room in 32 s); lives in the bio, badge and caption.

## Write-the-last-line-first check
- Last line (answer): "Since you pressed play: about a hundred million."
- First line (question): "While I say this, your body replaces millions of cells."
- Everything between delays the number without changing subject: where, how fast per tissue, what is *not* replaced. The end echoes the start (counter at 0 → counter at 100 M), so a replay reads as one continuous measurement.

## Loop map

| Loop | Opens | Wants | Closes | Escalation |
|---|---|---|---|---|
| L-A: "millions of what, how many?" | 0.0 s (line 1 + running counter) | the exact rate | 4.8 s (line 2: about four million per second) | curiosity |
| L-B: "where do they all go?" | 4.8 s | which tissues | 12.0 s (blood ~86 %, gut in days) | curiosity → surprise |
| L-C: "do I get a whole new body?" | 12.4 s (line 5's question, a visible 7-year calendar) | the verdict | 17.8 s (line 6: the neurons stay) | controversy (myth) |
| L-D: "how many *so far*?" | 0.0 s (never explicitly closed until the end) | to see the counter hit the big number | 26.2 s (crosses 100,000,000) | participation (the viewer *is* the clock) |
| Replay loop | 31.5 s (cross-fade to frame 0) | to watch the number climb again | frame 0 | the last frame's number already counted |

Also used: a pattern interrupt every ≤ 2 s (change-cadence rule), a share line at 58 % of runtime (after two rewards: the rate and the myth bust), a comment trigger, and a held-back payoff in the last 6 s.

## Cinematic direction (the bar for this reel)
Reel #01 (v3) is clean but still reads as *layered UI over two photo plates*. For #02 the screen is **a lit space the camera moves through**, not a stage with cards on it. Rules:

1. **One uncut camera.** No whip pans, no card flips, no cross-dissolves between unrelated plates. A single camera path `{x, y, z, roll, fov, focus}` as a pure function of `t` carries us from capillary → marrow → back out → gut → the body → the galaxy. Each "cut" is a **match move**: we fly *through* an opening (a vessel wall, a pore, a villus gap) and arrive in the next space.
2. **Real depth in every shot.** Each space is rendered in Blender (Cycles) as separate far / mid / near layers with a Z pass, composited in WebGL with per-layer parallax, **depth-of-field and rack focus driven by `t`**, motion blur on the fast layer, volumetric light shafts and haze. At least three depth layers in every shot, and a foreground element passing close to the lens (out-of-focus bokeh) at least once per scene.
3. **Physical materials, not flat icons.** Red blood cells are biconcave discs with transmission/subsurface and a soft rim light. Gut villi are glossy, wet, and pink-amber. Neurons are thin glowing filaments with emission. Everything reads as *a microscope-photography-meets-film* look, labelled **"ILLUSTRATION · not a microscope image"**.
4. **A cinematic grade, on top of everything:** filmic S-curve, bloom/halation on highlights, subtle chromatic aberration toward the frame edges, anamorphic streak on the big flashes, deband + film grain, and a slow handheld drift (≤ 6 px) so the frame is alive even when the subject is still.
5. **Light is the narrative.** *Newly made* cells enter as a lime-white spark that cools to the cell's own colour; *old* cells dim. Colour carries meaning, not labels: **crimson = blood, amber = gut, cyan = neurons (permanent), lime = newly made.** No text legend.
6. **Text budget: ≤ 6 on-screen text elements for the whole reel** (the counter + its short caption, "≈ 86 %", "120 DAYS", "3–5 DAYS", a struck-through "7 YEARS", the end card) plus chunked captions. Anything else must be a picture.
7. **Sound is half the immersion.** Interior scenes sit in a low-passed, slightly reverberant "inside the body" bed (heartbeat-like sub pulse at 60 bpm, fluid whoosh swells that follow the camera's speed, Doppler-style passes when a cell rushes the lens); exterior scenes (body, galaxy) open the filter to full range. Counter milestones (1 M, 10 M, 100 M) get sub-bass hits. All aligned to the page's own event list.

### Shot list (camera path, ~32 s)

| Clock | Spoken | Shot (camera moves through…) | Depth layers | New particle/visual | Src |
|---|---|---|---|---|---|
| 0.0–3.4 | 1 | **Inside a capillary.** Slow-motion river of blood cells passes; one cell in focus drifts to the lens, then rack focus to the stream behind it. Counter rolling from frame 0. | cell stream far/mid; two bokeh cells near; vessel-wall haze | counter odometer (digits roll) | F1 |
| 3.4–5.4 | 2 | Camera accelerates along the vessel and **punches through the wall into the bone-marrow cavity**: a lit cave of budding cells. "~4 M/s" reads as **a visible spray of ~4,000 sparks per second** (1 spark = 1,000 cells; legend is the counter's tiny caption). | marrow cave far; cell clusters mid; sparks near | lime-white emission, deterministic | F1 |
| 5.4–10.0 | 3 | Camera rides **out with the new cells** into a wide vessel; the stream resolves into a ring that fills to **≈ 86 %** crimson (the rest amber). One red cell is followed: a thin ring around it counts up to **120 DAYS** while its colour dulls and a fresh crimson cell swaps in beside it. | stream; ring (mid); followed cell (near, in focus) | day-ring, colour dull | F2, F3 |
| 10.0–12.4 | 4 | Camera exits the vessel and **dives into the intestine**: a tunnel of glossy villi; the amber cells on the tips shed in a slow cascade while a pale-lime wave rises from the base; **3–5 DAYS** inks in. | villi rows far/mid/near; shed cells as bokeh | wave of "new" colour | F4 |
| 12.4–15.8 | 5 | Pull back **through the gut wall** into a full-body figure (a generated X-ray plate, as in #01, so the series stays one world). A **7-year calendar** flips in the corner; a renewal wave sweeps the body head-to-toe… and "7 YEARS" gets crossed out as the wave **stops at the brain**. | body plate; wave layer; calendar (near) | struck stamp | F5, F7 |
| 15.8–19.0 | 6 | Camera pushes into the skull: a **constellation of cyan neurons** that do not change while a lime wave passes around them without touching. Held for the line. | neuron cloud 3 layers; wave as backlight | steady glow | F5 |
| 19.0–23.0 | 7 | Light, human beat: pull out of the head to a happy doodle friend (palette-matched, recoloured to the reel's colours) with a chat bubble "I'm a new person now ✨"; the counter ticks in the corner, a paper plane flies. | doodle card (near); counter; soft blurred body behind | paper plane | share line |
| 23.0–26.4 | 8 | **The payoff.** The body shrinks into the distance; the camera pulls back through a field of lime sparks (every spark ≈ 1 M cells) while the counter races up to **100,000,000**; flash, sub-bass hit, anamorphic streak. | spark field 3 layers; body silhouette far | the big number | F1, F8 |
| 26.4–32.0 | 9 + end card | Hold on the counter (it keeps running); profile photo, @sandesh.explains, FOLLOW. Last 0.45 s cross-fades to frame 0. | end card | follow press | |

Every row changes the picture at least every 2 s, and several rows contain two changes. Verify with `bun scripts/change-cadence.mjs`.

## Hook variants (same body, only the first line changes)

| ID | First line | Why | Predicted risk |
|---|---|---|---|
| H1 (main) | While I say this, your body replaces millions of cells. | The counter proves it live; a claim about *you* | "millions of cells" is vague until line 2 |
| H2 | By tomorrow, about 330 billion of your cells will be new. | A bigger, truer headline number | 330 billion has no feel; the counter does |
| H3 | The lining of your gut is replaced in days. | The most surprising single fact | narrower; no counter synergy |

## Fact ledger (all read first-hand on 14 Oct 2026 from the full text of Sender & Milo 2021, *Nature Medicine* 27:45–48, via a PDF copy; doi 10.1038/s41591-020-01182-9)

| ID | Fact | Where in the paper | Tier |
|---|---|---|---|
| F1 | Total turnover of the human body is **0.33 ± 0.02 × 10¹² (330 ± 20 billion) cells per day, "equal to about 4 million cells s⁻¹"**. | Results, ¶ "We found that the total turnover rate…" | A |
| F2 | **About 86 %** of these cells are blood cells (mostly of bone-marrow origin); almost all of the remaining 14 % are gut cells. (The abstract says "close to 90 %" and a later sentence "≈ 80 %": the paper is not self-consistent, so we say "most" aloud and show "≈ 86 %" with the reference-adult footnote.) | Results; Abstract | A |
| F3 | Erythrocyte lifespan **110–120 days** is "well established"; they contribute over half the daily turnover by number. | Methods, uncertainty ¶ | A |
| F4 | Lifespan of gut epithelia: **3–5 days**. | Introduction ("from 3–5 d for gut epithelia, to years (and even a lifetime) for cardiomyocytes or neurons") | A |
| F5 | "Not all parts of the human body are ever replaced (for example, **most brain neurons and cells of the eye lens**, which we calculate to constitute altogether ≈ 0.5 % of the cells in the human body) and hence **complete turnover never happens**." | Discussion | A |
| F6 | A reference 70 kg person with 30 trillion host cells produces this number of cells **every 80 days** and the 46 kg of cellular mass **every year and a half**. | Discussion | A (caption only; not spoken: it invites the "so it *is* a new body" misreading) |
| F7 | Reference person = healthy male aged 20–30, 70 kg, 170 cm; rates vary with sex, age and health. | Intro | A (on-screen footnote: "REFERENCE ADULT") |
| F8 | The counter value = 330 bn ÷ 86,400 s = **3.82 M/s × t**; 100,000,000 at t = 26.2 s. Derived, so say "about" and label it "AVERAGE RATE". | arithmetic on F1 | derived |
| F9 | "A brand-new body every seven years" is a popular idea. Its origin has **not** been traced here, so the script frames it as something "you've heard", not as an attributed claim, and rebuts it only with F5. | — | no claim |
| F10 | Making new cells costs about 1 % of the body's resting metabolic rate. | Methods | A (**not used**; reserved for a follow-up) |

## Claims changed or removed (vs `plan-first-10.md` #02)
- "close to **90 %** by count are blood cells" → **≈ 86 %** (the paper's results sentence; abstract differs). Corrected in the plan.
- "A coral counter ticks at 3.8 M/s" kept, but it now starts from 0 at "press play" and is labelled as an *average rate for a reference adult*, to avoid implying a measured live count.
- "Caveat: most of your brain's neurons stay with you for life" → spoken as "most of your brain's neurons are **never replaced**" (F5 wording), because the adult brain does make some new neurons in places; we do not say *all*.
- Spalding & Frisén 2005 ("most cells are younger than you") was **not** used: only a press summary was read, not the paper.
- "A new body every 7 years" is shown as a question and answered "not quite", with no claim about where the number comes from (F9).

## Voice and sound direction
- **Voice:** the creator's voice cloned with Qwen3-TTS (ICL, accent kept; same pipeline as #01: `voice/qgen_all.py`, `pick.py`, `assemble.py`). Calm, curious, a touch of awe on "four million". One stressed word per line: "millions" (1), "four" (2), "four months" (3), "days" (4), "Not quite" (5), "never" (6), "hundred" (8). The hook line a little faster, line 8 slower and lower.
- **Designed pauses:** 0.25 s before line 2 (the number lands), 0.8 s before line 5's "Not quite" (the myth beat), 0.5 s after line 6, 0.5 s before line 8.
- **Music (new score, not the #01 pad):** a restrained pulse at 60 bpm that is literally a heartbeat in the interior scenes, a slow string-like pad that rises with the counter, **no drums until the payoff**; at 26.2 s a sub drop + a single high shimmer. Voice 16–20 dB over music on voiced frames.
- **Interior/exterior mix:** a low-pass (≈ 3.5 kHz) + short plate on the music and SFX in scenes 1–6, opened to full range in scenes 7–9. A sparkle on each counter million (every 10 M after 10 M).

## On-screen text rules
- Captions: 2–3 word chunks, one at a time, key word coloured (same system as #01), inside x 150–918, caption band y 1346–1478.
- Everything else inside x 150–918, y 140–1536; the counter sits at y ≈ 220–420, over the top darkening scrim.
- English only. Disclosure tag "AI IMAGE" stays for the generated body plate; the Blender plates carry "ILLUSTRATION" in the caption and alt text.

## Caption (300–700 characters)

> About four million. Every second. 🧬
> Your body replaces about 330 billion cells a day. Roughly 86% of them are blood cells, and a red blood cell lasts about four months. The lining of your gut turns over in 3–5 days. By count, your body makes about 30 trillion cells every 80 days, yet most of your brain's neurons are never replaced. So no, it isn't a brand-new body every seven years.
> The counter in the video runs at the average rate for a reference adult (a healthy 70 kg adult aged 20–30). Rates vary with age, sex and health.
> 🤖 Voice: AI-generated (a likeness of mine). Visuals are illustrations; the body image is AI-generated. Script and research are mine.
> Source: Sender & Milo 2021, Nature Medicine 27:45–48.
> #Cells #DidYouKnow #BodyFacts #HumanBody #WhatsActuallyHappening

(~640 characters. Check each hashtag's post count against `insights/hashtag-research.md` before posting.)
**Pinned comment:** "Guess: how many cells since you pressed play? Check the counter at the end. What did you get?"

## Asset families (≥ 6 required, each scene a different primary family from its neighbours)
1. **Blender volumetric 3D plates** (capillary, marrow cave, vessel ring, villi tunnel, neuron cloud; far/mid/near + Z)
2. **WebGL depth-parallax + DOF/grade engine** (reuse `gl.js`, extended with rack focus, bloom, chromatic aberration, anamorphic streak)
3. **Deterministic particle emission** (spark fields tied to the counter; seeded, pure `t`)
4. **Bespoke data objects**: odometer counter, ≈ 86 % ring, 120-day ring, 7-year calendar, struck stamp
5. **AI-generated photoreal/X-ray body plate** (RealVisXL + Depth-Anything), shared with #01's world
6. **Open Doodles** friend (recoloured to the reel's palette, happy)
7. **Phosphor icons** (paper plane, follow) + kinetic type and chunked captions
8. **Real-footage overlays** (dust, film grain; light leak not used: it strobes)
9. **Audio family**: cloned voice, heartbeat/pad/sub score, interior/exterior filter, counter-milestone hits
Family count: 9. Primary family by scene: 1 Blender, 2 Blender+particles, 3 Blender+data, 4 Blender, 5 AI body plate, 6 Blender, 7 Open Doodles, 8 particles, 9 data+photo.

## Benchmark to beat
Previous reel's ceiling (`reel-01-your-voice` v3): clean, text-light, photoreal AI head + X-ray lens, Blender ear macro scrubbed by `t`, whip/dive/tilt transitions, glass cards, chunked captions, branded end card. What it still *is*: layered UI over two photo plates; the Blender object is a single small macro; transitions are graphic wipes.
New things #02 does that #01 did not (≥ 3 required):
1. **A single uncut camera path through real 3D spaces** with match-move "cuts" (no wipes, no cards flipping).
2. **Depth of field and rack focus driven by `t`**, plus bokeh foreground cells and volumetric haze, composited per layer.
3. **A live counter that is the story**, physically tied to a particle emission and to the voice (the number crosses 100 M on the word).
4. **Light-as-meaning colour system** with no legend (crimson/amber/cyan/lime).
5. **An interior-vs-exterior mix** (the audio filter itself tells you whether you're inside the body).
6. **A cinematic grade pass** (bloom/halation, chromatic aberration, anamorphic streak, handheld drift, deband).
Targets: 3-s hold ≥ 55 %, average watch ≥ 14 s (> 40 % of runtime), shares ≥ 10 per 1,000 reached, comments ≥ 5 per 1,000.

## Production plan for the cinematic bar (what has to be built, and the budget)
| Item | Method | CPU budget (4 cores) |
|---|---|---|
| Blender scenes: capillary, marrow, vessel ring, villi tunnel, neuron cloud | procedural meshes (biconcave disc via lathe, instanced; villi via displaced cylinders; neurons via curve bevels), Cycles 64–96 spp, denoise, 1080×1920 plates for far/mid/near, + Z + AO passes | ~4–8 min per plate; about 6 scenes × 3 layers ≈ 2–3 h wall time, run alone (no other CPU jobs) |
| Camera path | one JSON path in the page, plates reprojected with parallax (depth maps) rather than re-rendered per frame | negligible |
| DOF / rack focus | per-pixel blur radius from the Z pass in the GL shader (two-pass separable), focus distance = f(t) | render cost only |
| Particles | seeded instanced points on a GL canvas, ≤ 60k live, rate = counter | render cost only |
| Body plate | one RealVisXL generation (X-ray, full body, 576×1024), Depth-Anything | ~15 min |
| Voice | Qwen3-TTS ICL, 9 lines × 3 seeds | ~45 min, run alone |
| Render | 32 s × 60 = 1,920 frames at ~1 s/frame | ~30–40 min |

**Honest risk:** a Blender-rendered *stills-plus-parallax* approach gives rack focus and parallax but **not** parallax-correct motion *through* an opening (the fly-through). The mockup must test that the vessel-wall and villi "match moves" read convincingly with plates only. If not, fall back to **short Blender frame sequences (24 fps, 2 s each, ~48 frames at 640 px, then upscaled)** for just those two moves.

## Audit and open items
- **Mockup before full build (required):** three scenes from three families: shot 1 (capillary plate + counter + rack focus), shot 4 (gut tunnel + shedding wave), shot 8 (spark field + payoff). Approve the look before building all 9.
- **Creator approvals (14 Oct 2026): done.** "ILLUSTRATION" label OK; AI-generated body plate OK; counter caption shortened to "SINCE YOU PRESSED PLAY".
- **GAP: myth origin (F9).** Trace where "a new body every seven years" comes from if we ever want to attribute it. Until then it stays "you've heard".
- **GAP: F2 inconsistency** (abstract "close to 90 %", text "about 86 %"). Using 86 % with the paper's own sentence; double-check against the published HTML version when possible (the PDF copy was read, not the publisher page).
- **Disclosure:** AI voice and AI-generated body image. Set Meta's "AI info" and YouTube's "altered or synthetic content".
- **Safety:** no health advice, no claims about individual turnover. The post caption says *average rate, reference adult* (the on-screen caption is only "SINCE YOU PRESSED PLAY").
- **Production checks still to run:** `check.mjs`, `scripts/change-cadence.mjs`, caption-band check, contact sheets at full and phone size, a frame-by-frame check of the DOF/rack focus and of the match moves, and a headphone listen for the interior/exterior mix (measured, not auditioned).

## Sources
- Sender R, Milo R. [The distribution of cellular turnover in the human body](https://doi.org/10.1038/s41591-020-01182-9). *Nature Medicine* 27, 45–48 (2021). Full text read 14 Oct 2026 via the [PDF copy](https://www.Gwern.net/doc/biology/2021-sender.pdf); data and code: github.com/milo-lab/cellular_turnover.
- Related: Sender R, Fuchs S, Milo R. Revised estimates for the number of human and bacteria cells in the body. *PLOS Biology* (2016), for the 30 trillion count (used in #03).
