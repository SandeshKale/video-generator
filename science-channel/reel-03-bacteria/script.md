# Shorts brief: "Ten to one? Wrong." (reel #03, What's Actually Happening): topic + script for approval

Aspect: 9:16 (1080×1920@60)
Target seconds: 31 (hard ceiling 33; the end card is part of it)
Language: English (en-IN, cloned creator voice, no avatar video)
Series slot: #03 in `science-channel/plan-first-10.md` (this brief supersedes that entry; one claim in it is corrected below).
Mode: retrospective (published science), light explainer.

## Why this reel
- **Order and tests:** `plan-first-10.md` puts it third, on the highest-share list ("Send this to the friend who still quotes ten to one"). It is a myth-bust with a number, the format the plan's growth diagnosis asked for (75% skipped in 3 s; 0 shares).
- **Evidence from the data:** `insights/ig-posts.json` is from 12 Oct 2026 and belongs to the suspended account, so it is history, not a signal for this one. Nothing fresh could be fetched from this sandbox. The only usable lesson is the old one: 3-s hold and shares are the weak spots, so frame 0 carries the question and the voice starts at 0.00 s.
- **Source quality:** a single peer-reviewed paper, read in full today (tier A). No second-hand claims in the spoken lines.
- **Variety:** the first two reels were *a head* and *blood cells*. This one is a **census**: no body, no interior, no microscope. It is about *counting*, drawn as a physical scale.

## Benchmark to beat (reels #01 v4 and #02)
What they achieved: #01 photoreal head plate + Blender ear macro + lens dives + breath-group voice; #02 one uncut camera, Blender red-cell sprites, light-body figure, counter payoff, WebGL bloom/DOF grade.
What #03 does that neither did:
1. **A 68,000-point census** (1 dot = 1 billion cells: 38,000 cyan bacteria dots, 30,000 coral human-cell dots) rendered as an instanced WebGL point cloud that **morphs between formations** (plain → scale pans → ratio meter). Never done in this repo.
2. **A crafted 3D centrepiece that changes state with the story:** a Blender brass-and-glass balance scale in ortho layers (stand / beam / pans), tipped by a pure function of `t`. It balances on **count**, then a **second scale** shows the same two crowds on **mass** and slams to one side (0.2 kg vs 70 kg).
3. **A ratio needle** (a gauge with a 1.0 line) that the toilet beat pushes below 1. A new data object, built for this claim and no other.
4. **Mix target raised and measured:** voice over music median ≥ 19 dB, min ≥ 13 dB (the standing rule; #01 v4 was 16.3).
5. **Sound design with a story:** the score is silent on the count and swells only when the pans move; one designed SFX per beat (stamp, brass clink on balance, thud on the mass slam, a soft falling sweep for the dip).
6. Voice recorded as breath-group takes with the `pick2.py` flow check from the start (no pause cutting, no tempo change).

## First frame (readable with sound off)
Frame 0 is already moving and fully composed: a dark plain seen from above-front, tens of thousands of points (cyan on the left, coral on the right) drifting like a crowd; top third: the counter **"38 : 30"** is not yet shown. Text: **"TEN TO ONE?"** in the top third (y 200–520), already with a hairline rough stroke starting to cross it. Voice starts at 0.00 s.

## Question that cannot be answered until the end
Who really wins the count: your bacteria or your own cells? (First answered at ~12 s: about even. The surprise that closes it: it can dip below one after a trip to the toilet.)

## Delay beats
1. myth: ten to one is *old* (1970s)
2. the 2016 recount: two numbers (38 vs 30 trillion)
3. the verdict: about one to one
4. the weight twist: 200 g, 0.3% of you
5. the closer: the ratio can fall below one after a toilet visit

## Last frame (the answer)
The needle sits just under 1.0 and the two crowds are almost the same size; the end card holds. The last frame cross-fades to frame 0 (the two crowds, ten-to-one stamp), so a replay reads as one loop.

## Spoken lines (≤ 12 words each; numbers spelled the way they sound)
1. You've heard bacteria outnumber your cells ten to one.
2. That's from the nineteen seventies. It's out of date.
3. A twenty sixteen count: about thirty-eight trillion bacteria. Thirty trillion human cells.
4. The real ratio is about one to one.
5. And all of those bacteria weigh about two hundred grams.
6. After a trip to the toilet, the ratio can dip below one.
7. Send this to the friend who still says ten to one.
8. Follow for the next one.

(8 takes, 74 words. At the cloned voice's ~2.8 words/s that is ~26 s of speech, designed silences ~3 s, end card ~2 s: about 31 s.) Recorded as breath-group takes: 1+2, 3+4, 5, 6, 7, 8.
**Sync constraints:** the coral and cyan counters land on the words "thirty-eight trillion" and "thirty trillion" (line 3); the scale balances on "about one to one" (line 4); the mass slam lands on "two hundred grams" (line 5); the needle crosses 1.0 on "dip below one" (line 6).

## On-screen text budget (≤ 6 elements + captions)
1. **TEN TO ONE?** (frame 0, struck through at 3.4 s)
2. **38 trillion** (cyan) and **30 trillion** (coral) tags on the two crowds
3. **≈ 1 : 1**
4. **0.2 kg** (mass slam)
5. amber caveat chip: **70 KG ADULT MALE · ±25%** (the paper's reference man and the ratio's uncertainty)
6. end card (profile photo, @sandesh_explains, FOLLOW)
No other labels.

## Fact ledger (every spoken claim has an id)

| Id | Claim | Tier | Source (read 15 Oct 2026) |
|---|---|---|---|
| F1 | The widely repeated figure was 10:1 (even 100:1) bacteria to human cells | A | Sender, Fuchs, Milo 2016, *PLOS Biology* 14(8): e1002533, "Revised Estimates for the Number of Human and Bacteria Cells in the Body", Discussion ("Updating the ratio ... from 10:1 or 100:1 to closer to 1:1") |
| F2 | That figure dates from the 1970s | A | same paper: the ~10^14 bacteria estimate "dates back to the 1970s" and traces to Luckey |
| F3 | For a 70 kg "reference man" (20-30 years, 170 cm): about 3.8 × 10^13 bacteria and about 3.0 × 10^13 human cells | A | same paper |
| F4 | Ratio about 1.3 (uncertainty 25%; 53% variation across men); "about 1:1 ... should replace the 10:1 or 100:1 values" | A | same paper, Results |
| F5 | Bacteria weigh about 0.2 kg wet (50-100 g dry), about 0.3% of body weight | A | same paper |
| F6 | About 90% of the bacteria are in the colon, and each defecation reduces colon content by a quarter to a third | A | same paper, Box 1 |
| F7 | After a trip to the toilet the ratio can dip below 1 | **Derived** (labelled "can") | arithmetic from F3 and F6: 3.8e13 × 0.9 = 3.4e13 in the colon; losing 25-33% removes 0.9-1.1e13, leaving about 2.7-2.9e13, below 3.0e13 human cells. Within the paper's 25% uncertainty |

**Claims changed from the plan (13 Oct draft):**
- The plan said the toilet line is "a direct paraphrase of the paper's discussion" and that the paper says each trip "may flip the ratio". **The paper does not use those words** (checked: "flip" and "toilet" do not appear). The paper only states that a defecation event reduces colon content by a quarter to a third. The line is now explicitly **derived** from that, worded "can dip below one", and the caption says so.
- The plan said bacteria weigh "about 0.2 kg" (confirmed) and "ratio about 1.3 : 1" (confirmed).

**Do not say (C):**
- "Ten to one is a myth that scientists invented" (the paper says it is an old estimate that was widely repeated; who first stated the *ratio* is not established by the paper).
- "You are half bacteria" / "you are 50% bacteria" (wrong framing; it is about counts, not identity or mass).
- Any claim about women, children or other body sizes (the estimate is for the 70 kg reference man; the paper notes variation).
- Any health advice (no probiotics, no hygiene claims).

## Caveats shown or said
- On screen: amber chip "70 KG ADULT MALE · ±25%".
- In the caption: the reference-man definition, the 25% uncertainty, that the toilet beat is derived, and that bacteria vs *nucleated* human cells is about 10:1 under a different definition (the paper's own side note), so "ten to one" is not meaningless, just not the headline number. (Said only in the caption: no room in 31 s.)

## Spine
When you want to know who wins the count between your bacteria and your own cells, you watch two crowds be counted and weighed, and discover the famous 10:1 is old, the real count is a near tie, and the weight is almost nothing.
- **Drama (mismatch):** a "fact" everyone repeats vs. a recount nobody mentions.
- **Antagonist:** the repeated number.
- **Change:** from "they outnumber me ten to one" to "about even, and tiny by weight".
- **Rasas:** Adbhuta (the crowd scale) and Hasya (the toilet closer, one light beat).

## Loop map

| Loop | Opens | Wants | Closes | Escalation |
|---|---|---|---|---|
| L-A: "is ten to one true?" | 0.0 s (frame 0 text + line 1) | the verdict | 11.8 s (line 4: about one to one) | curiosity → surprise |
| L-B: "so what do the numbers say?" | 3.4 s (the 1970s stamp) | both counts | 11.0 s (line 3) | curiosity |
| L-C: "and how heavy are they?" | 11.8 s (a second, empty scale appears) | the weight | 17.0 s (line 5: 200 g) | surprise |
| L-D: "so who really wins?" | 17.0 s (needle near 1.0) | the final count | 22.5 s (line 6: below one) | participation + humour |
| Replay loop | 30.5 s | the crowds again | frame 0 | last frame matches first |

Also used: a pattern interrupt every ≤ 2 s (see below: ambient motion layers, never cutting a hero visual), a share line at ~78% (line 7), a comment trigger ("Reply with the friend you're sending this to"), a held-back closer.

## Shot list (camera path ~31 s; one continuous move through one world)

| t (s) | Camera / world | Hero visual (holds for its reading time) | Ambient motion (change ≤ every 1.5 s) | Sound |
|---|---|---|---|---|
| 0.0-3.2 | Low pull-back over the plain; focus racks from near cyan crowd to far coral crowd | two crowds of 38k/30k points; "TEN TO ONE?" | crowd drift, shimmer on points, slow rim light sweep | sub drone, room tone; voice L1 |
| 3.2-6.0 | Rise to a 3/4 view | a rubber stamp "1970s" hits the text; rough stroke crosses "TEN TO ONE"; a calendar roll back to 1970s | dust motes, a light sweep across the plain | stamp + paper, typewriter tick |
| 6.2-11.6 | Crowds gather into two **piles on the pans** of the brass scale (Blender ortho layers) | scale pans filling; counters 38 / 30 trillion on their words | dots flowing into the pans, beam micro-sway, glints on brass | brass clink as pans settle; voice L3 |
| 11.8-14.2 | Slow push-in | beam settles level; **≈ 1 : 1** odometer; amber chip "70 KG ADULT MALE · ±25%" | beam tremor then rest, particles settling | soft chime on balance |
| 14.6-19.0 | Cut by match move to a **second scale** under it (mass) | 0.2 kg bacteria pile vs a 70 kg block: pans slam | dust kick, beam overshoot, the 0.2 kg tag pulses | thud + sub hit; voice L5 |
| 19.4-24.0 | Pull back to the ratio **needle** gauge | needle at 1.3; a toilet-visit beat (a quarter-to-a-third of the cyan crowd drains down a chute) pushes it below 1.0 | needle jitter, scale numbers rolling | falling sweep, then a warm resolve; voice L6 |
| 24.4-27.6 | Hold wide | both crowds almost equal; share line as caption + small lime "SEND" nudge | crowd drift, light sweep | music lift; voice L7 |
| 28.0-31.0 | Dolly to end card | creator photo, @sandesh_explains, FOLLOW; the last frame fades back to frame 0 | pulse ring, a drifting dot trail every ~1.5 s | music resolves; voice L8 |

## Asset-family audit (≥ 6; no cartoon people)

| # | Family | Where |
|---|---|---|
| 1 | **WebGL instanced point cloud** (68k points, morph targets, DOF, bloom): **new** | scenes 1-3, 6 |
| 2 | **Blender 3D**: brass-and-glass balance scale (stand/beam/pan ortho layers), a 70 kg ingot, glass dish | scenes 3-5 |
| 3 | Bespoke SVG/DOM data objects: ratio odometer, mass tag, needle gauge with a 1.0 line, caveat chip | scenes 4-6 |
| 4 | rough.js hand-drawn strokes (strike on "TEN TO ONE?", circle on 1.0), fixed seed | scenes 1, 2, 6 |
| 5 | Kinetic type / counters / chunked captions | all |
| 6 | Real-footage overlays (dust-particles, film-grain on the stamp beat only) | scenes 2, 3, 7 |
| 7 | The creator's photo (end card), Phosphor/simple-icons for the stamp mark | scene 8 |
| 8 | Audio family: score that moves with the pans, event-aligned SFX, cloned voice | all |

Families used: **8 (≥ 5)**. No scene is photo + panel + text only; no family appears in more than 4 scenes except type and audio.

## Visual identity (series frame, plan decision D2)
Series palette, meaning-coded: **cyan = bacteria (hidden/inside), coral = your human cells (the surprising number), amber = caveat, lime = try/share nudge, ink ground.** Fonts: not Familjen/Fragment/Anton: pick a new display face at the mockup (candidates already vendored: Syne, Sora, Unbounded, Instrument Serif) plus Martian Mono for numbers; Anton on the cover.

## Audio plan
Score: a hushed drone for the count; every pan movement adds a brass-toned plucked voice; the mass slam is the only time the sub opens up; resolves warm at the end. Voice-activity ducking, 1.2-4.5 kHz carve, loudnorm −14 LUFS, **targets: voice over music median ≥ 19 dB and min ≥ 13 dB** (measured on voiced frames); the mix is measured, not auditioned (say so in delivery).

## Voice
Cloned creator voice (Qwen3-TTS ICL), **one take per breath group, three seeds each, `pick2.py` flow check** (transcript exact, no internal pause > 0.55 s, 2.3-3.6 words/s, no clipped onset), no pause cutting or tempo change; "twenty sixteen" spelled; hook starts at 0.00 s.

## Instagram caption draft (≤ 700 characters; the first line is the hook)
```
Ten to one? That number is from the 1970s. 👇
A 2016 recount for a 70 kg adult man: about 38 trillion bacteria and 30 trillion human cells, close to 1 : 1 (±25%). Together the bacteria weigh about 0.2 kg. Each trip to the toilet clears a quarter to a third of the colon, so the ratio can dip below 1 (my arithmetic from the paper). Against nucleated human cells only, it is still about 10 : 1, a matter of definition.
Source: Sender, Fuchs & Milo, PLOS Biology 2016.
🤖 Voice: AI-generated (a likeness of mine). The script and research are mine; I use Claude to help build these.
#Microbiome #DidYouKnow #BodyFacts #Science #WhatsActuallyHappening
```
Hashtag roles: topic (#Microbiome), intent (#DidYouKnow), audience (#BodyFacts), niche keyword (#Science), series (#WhatsActuallyHappening). Check each tag's post count before posting.

## What I need from you before the mockup
1. Approve the topic and the 8 spoken lines (or change a line).
2. Approve the **8-line voice script as breath-group takes** (1+2, 3+4, 5, 6, 7, 8).
3. Approve the concept: *a physical scale and a 68k-point census*, no body, no cartoon people.
Then the mockup (per CLAUDE.md, 3 scenes from 3 families): the census plain, the Blender balance scale, the ratio needle.
