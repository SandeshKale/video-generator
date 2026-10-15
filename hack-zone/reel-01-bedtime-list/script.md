# Shorts brief: "Brain won't switch off? Write this." (Hack Zone #01): topic + script for approval

Aspect: 9:16 (1080×1920@60)
Target seconds: 32 (hard ceiling 34; the end card is part of it)
Language: English (en-IN, cloned creator voice, no avatar video)
Series: **Hack Zone** (new series on @sandesh_explains: wellness, psychology and productivity hacks you can try tonight). Separate from the science series *What's Actually Happening*; the science series frame (cyan/coral/ink) is **not** reused.
Genre: tutorial / how-to (standing rule: numbered step tracker throughout, each instruction held ≥ 2 s, honest "catch" beat, save-worthy recap card ≥ 2.5 s, CTA = Save + Follow).

## Why this topic
- **You asked for a wellness / psychology / productivity hack.** This one sits on all three: sleep (wellness), why unfinished goals nag (psychology), and a to-do list (productivity).
- **It is a real hack with a lab result,** not a vibe: a polysomnography study (the sleep-lab gold standard) and a second study on why a *specific plan* quiets unfinished goals. Both read today (tier A, at abstract level; the full texts are paywalled, so effect sizes are not quoted).
- **It is doable in 5 minutes tonight with a pen,** which is what makes a hack reel get saved.
- **Alternative considered (not chosen):** the "physiological sigh" (Balban et al. 2023, Cell Reports Medicine, remote RCT, 108 people, 28 days). Real and tier A, but the effect is modest (cyclic sighing raised positive affect more than mindfulness; anxiety did not differ between groups; small groups, self-reported, 4 weeks) and it is already widely covered. It would be a strong **Hack Zone #02**.
- **Instagram data:** `insights/ig-posts.json` is from 12 Oct and belongs to the suspended account, so it is history, not a signal. The standing lessons still apply: the first 3 s carry the question, the voice starts at 0.00 s, and the payoff is something people save.

## Benchmark to beat (reels #01 v4, #02, #03 brief)
What they reached: #01 photoreal head + Blender ear macro + lens dives; #02 one uncut camera, Blender cell sprites, WebGL bloom/DOF grade; #03 a 68k-point census + a Blender balance scale.
What this reel does that none did:
1. **A through-line object that is also the step tracker:** a row of **open tabs** (14 pending tasks, tangerine) across the top. Each step visibly *closes tabs*, so the tracker, the story and the "mental noise" are one object. Every cut keeps the strip in place.
2. **The audio is the argument:** a murmuring "mental noise" bed whose loudness is driven by the number of open tabs (a pure function of the page's tab count). When the last tab closes, the room tone drops to near silence. Never done here, and measurable.
3. **A hand-written list in real time:** a pen writes the to-dos with deterministic stroke-by-stroke text (SVG path draw, no handwriting font needed), and a vague item ("TAXES") is crossed out and rewritten as a specific next action ("CALL ACCOUNTANT, 10 AM"). Step 3 is *shown*, not told.
4. **A Blender lamp-and-notebook macro in three lighting states** (warm, dimmer, dim) that crossfade as the tabs close. A calm crafted object, not a UI.
5. **Mix target raised and measured:** voice over music median ≥ 19 dB, min ≥ 13 dB (standing rule).
6. Voice recorded as breath-group takes with the `pick2.py` flow check from the start.

## First frame (readable with sound off)
Frame 0 is already moving: the dark spruce-green screen, 14 tangerine tabs across the top flickering with small badges, a murmur of overlapping whispers already audible, the Blender lamp and an open notebook in the lower half. Top-third text: **"BRAIN WON'T SWITCH OFF?"** (y 200–520). Voice starts at 0.00 s.

## Question that cannot be answered until the end
Does writing a list actually help you fall asleep? (Answered at ~21 s with the lab result, then qualified with the catch.)

## Spoken lines (≤ 12 words each; numbers spelled the way they sound)
1. Can't switch your brain off at night? Try this.
2. Step one: pen and paper. Five minutes.
3. Step two: write everything you still need to do.
4. Step three: be specific.
5. Unfinished goals keep looping in your head. A specific plan can quiet them.
6. In a sleep lab, people writing to-dos fell asleep faster than people listing what they'd done.
7. The catch: fifty-seven healthy young adults. One study.
8. Save this for tonight. Follow for more hacks.

(8 takes, 72 words. At the cloned voice's ~2.8 words/s that is ~26 s of speech, designed silences ~2.5 s, end card ~2.5 s: about 31 s.) Breath-group takes: 1, 2+3, 4, 5, 6, 7, 8 (the step sentences share one take only if the flow check passes; otherwise one take each).
**Sync constraints:** tabs 1-5 close on "write everything" (line 3); "TAXES" is struck through and rewritten on "be specific" (line 4); the murmur bed drops by ~12 dB over line 5; the recap card holds ≥ 2.5 s under line 8.

## On-screen text budget (≤ 8 elements + captions)
1. BRAIN WON'T SWITCH OFF? (frame 0)
2. step tracker chips 1 / 2 / 3
3. the handwritten list (the content of the hack, not a label)
4. TAXES → CALL ACCOUNTANT, 10 AM (illustrative; labelled ILLUSTRATIVE)
5. "57 healthy adults · 18-30 · one lab study" amber catch chip
6. recap card: PEN + PAPER · 5 MIN · EVERYTHING YOU STILL NEED TO DO · BE SPECIFIC
7. end card (profile photo, @sandesh_explains, SAVE + FOLLOW)

## Fact ledger (every spoken claim has an id; read 15 Oct 2026)

| Id | Claim | Tier | Source |
|---|---|---|---|
| F1 | 57 healthy young adults aged 18-30 wrote for 5 minutes before overnight polysomnography in a sleep lab | A (abstract) | Scullin, Krueger, Ballard, Pruett & Bliwise (2018), "The effects of bedtime writing on difficulty falling asleep: A polysomnographic study comparing to-do lists and completed activity lists", *Journal of Experimental Psychology: General* 147(1):139-146, doi:10.1037/xge0000374 (read via Europe PMC) |
| F2 | Participants were randomly assigned to write a to-do list or a list of completed activities | A | same |
| F3 | "Participants in the to-do list condition fell asleep significantly faster than those in the completed-list condition" | A | same |
| F4 | The more specifically the to-do list was written, the faster participants fell asleep | A | same |
| F5 | Unfinished goals intrude on unrelated tasks; letting people write specific plans for them removed those effects | A (abstract) | Masicampo & Baumeister (2011), "Consider it done! Plan making can eliminate the cognitive effects of unfulfilled goals", *J Pers Soc Psychol* 101(4):667-683, doi:10.1037/a0024192 (read via Europe PMC) |
| F6 | The sleep study's participants were healthy young adults, so it is unknown whether it generalises to people with insomnia; anxiety and personality were not examined | A/B | Baylor release by Scullin (Jan 2018); researcher quotes |

**Deliberately not claimed:**
- Any number of minutes saved. The popular "9 minutes" and "15 minutes" figures came from press write-ups and are **not in the abstract**; the full text is paywalled, so they are left out.
- That the list works *because* of the Masicampo mechanism. The sleep study did not test the mechanism; the spoken line says unfinished goals loop and a specific plan "can quiet them" (two separate findings), and the caption says the link is a hypothesis.
- Anything about insomnia, anxiety, children, shift workers or medication. No health advice beyond "try it".
- "Scientists proved…" or "cures": the claim is one lab study, one finding, young healthy adults.

**Do not say (C):** "writing in a journal about your day helps you sleep" (the completed-activities list did *not* help in that study); any "in just X minutes you will fall asleep" promise.

## Catch (said and shown, line 7)
57 healthy young adults, one study, a lab not a bedroom; whether it works for people with insomnia is not known (the lead author's own caveat). It is an experiment you can run on yourself, not a treatment.

## Spine
When you want your brain to switch off at night, you watch 14 open tabs close one by one as a pen turns worries into specific next actions, and the room goes quiet. A proof line and an honest catch end it.
- **Drama (mismatch):** you are exhausted but your mind is a browser with 14 tabs open.
- **Antagonist:** the unfinished list in your head.
- **Change:** from noise to quiet, shown and heard.
- **Rasas:** Shanta (calm) after a short Adbhuta/anxious open; one light Hasya beat when "TAXES" is struck through.

## Loop map

| Loop | Opens | Wants | Closes | Escalation |
|---|---|---|---|---|
| L-A: "can I switch it off?" | 0.0 s (frame 0 + line 1) | a fix | 11.5 s (step 3 done, tabs close) | curiosity |
| L-B: "do I have to do something fancy?" | 2.8 s (step 1) | the steps | 11.5 s | curiosity |
| L-C: "why would a list quiet it?" | 12.0 s (line 5) | the reason | 17.5 s | surprise |
| L-D: "does it really work?" | 17.5 s (line 6 setup) | the evidence | 24.5 s (lab result + catch) | credibility |
| Replay loop | 31.0 s | the noise again | frame 0 | last frame is a quiet room; the first is a loud one |

Also used: a pattern interrupt ≤ every 2 s via ambient layers (tab flicker, lamp glow breathing, pen tip, murmur waveform), never by cutting a hero visual; a save line (line 8) at ~88%; a comment trigger ("Reply TONIGHT and I'll send the printable list").

## Shot list (~32 s)

| t (s) | Hero visual (holds for its reading time) | Ambient motion | Sound |
|---|---|---|---|
| 0.0-3.0 | 14 tabs open over the lamp-and-notebook macro; "BRAIN WON'T SWITCH OFF?" | tab badges flicker, lamp breathes | murmur bed at full, voice L1 |
| 3.0-6.0 | Step 1/3: pen + paper, a 5:00 timer starts | timer ticks, dust motes | page rustle, voice L2 |
| 6.0-12.0 | Step 2/3: the pen writes 5 real-looking tasks; tabs 1-5 close as each is written | pen tip glow, ink dry-down | pen scratch per item, soft click per tab, murmur thins |
| 12.0-16.0 | Step 3/3: "TAXES" struck (rough stroke) and rewritten "CALL ACCOUNTANT, 10 AM"; tabs 6-14 close in a cascade | lamp dims one step, tab cascade | clicks, a low warm chord |
| 16.0-21.5 | "why": a single tab left, glowing, then a plan beside it and it closes; the room is quiet | tiny stars of dust, slow push-in | murmur drops ~12 dB, voice L5 |
| 21.5-27.0 | proof: two lists side by side (TO-DO vs DONE) with a "fell asleep faster" bar in the TO-DO side (no minute value) + amber chip "57 HEALTHY ADULTS 18-30 · ONE LAB STUDY" | lamp dims again, bar glints | soft tone on the verdict, voice L6-L7 |
| 27.0-32.0 | recap card (≥ 2.5 s), then end card with photo + SAVE + FOLLOW | pulse ring, drifting dot | music resolves, voice L8 |

## Asset families (≥ 6; no cartoon people)

| # | Family | Where |
|---|---|---|
| 1 | Blender 3D: lamp + notebook + pen macro in 3 lighting states (real materials: paper, brass lamp, ballpoint) | all scenes |
| 2 | Bespoke DOM/SVG **tab strip** (the signature object + step tracker): new | all scenes |
| 3 | Deterministic handwriting: SVG stroke-draw text, pen tip | scenes 3-4 |
| 4 | rough.js strokes (strike-through, circle on the last tab), fixed seed | scenes 4-5 |
| 5 | Kinetic type, chunked captions, recap card | all |
| 6 | Real-footage overlays (dust-particles; grain only on the proof beat) | scenes 2-6 |
| 7 | Photoreal AI still + depth parallax (the dark bedroom window behind the lamp; tagged AI IMAGE) | scenes 1, 5 |
| 8 | The creator's photo (end card) | scene 8 |
| 9 | Audio family: **tab-count-driven murmur bed**, event SFX (pen, page, click), cloned voice | all |

Families used: **9 (≥ 5)**. No scene is photo + panel + text only; no family is used in more than 4 scenes except type, tabs and audio.

## Look (Hack Zone series frame, new)
Spruce-green night `#0d2b2a`, paper `#f4ecd8`, tangerine `#ff7a1a` (= open / unfinished), mint `#8ef0c8` (= closed / done), ink `#101a1a`, amber `#f2c14e` (= caveat). Meaning-coded: tangerine open, mint closed, amber caveat. Fonts to settle at the mockup (not used by recent reels): Instrument Serif italic for headlines, Manrope 800, Martian Mono for numbers; Anton on the cover.

## Audio plan
Score: no music for the first 3 s, only the murmur and a low drone; a warm pad enters as tabs close; resolves in the last 4 s. Murmur = layered band-passed noise with formant-like peaks, level = f(open tabs). Voice-activity ducking, 1.2-4.5 kHz carve, loudnorm −14 LUFS. **Targets: voice over music median ≥ 19 dB, min ≥ 13 dB (voiced frames).** Measured, not auditioned.

## Voice
Cloned creator voice (Qwen3-TTS ICL), breath-group takes, three seeds each, `pick2.py` flow check (transcript exact, no internal pause > 0.55 s, 2.3-3.6 words/s, no clipped onset), no pause cutting or tempo change, "fifty-seven" spelled, voice starts at 0.00 s.

## Instagram caption draft (≤ 700 characters)
```
Brain won't switch off? Try this tonight. 👇
1. Pen and paper, 5 minutes.
2. Write everything you still need to do.
3. Be specific: not "taxes" but "call the accountant, 10 am".
In a sleep-lab study of 57 healthy adults (18-30), those who wrote a to-do list fell asleep significantly faster than those who listed what they'd already done, and the more specific the list, the faster. Another study found that making a specific plan stops unfinished goals intruding on your thoughts. Why the list helps sleep isn't proven.
Not medical advice. One small study, young healthy adults.
Sources: Scullin et al., J Exp Psychol Gen 2018; Masicampo & Baumeister, JPSP 2011.
🤖 Voice: AI-generated (a likeness of mine). Script and research are mine; I use Claude to help build these.
#Sleep #Productivity #Psychology #LifeHack #HackZone
```
(~690 characters.) Hashtag roles: topic #Sleep, intent #LifeHack, audience #Productivity, niche #Psychology, series #HackZone. Check each tag's post count in the app before posting; swap any outside ~20K-2M (series tag excepted).

## What I need from you before the mockup
1. Approve the topic (the bedtime to-do list) and the 8 spoken lines. Or say "do the physiological sigh first" and I will rewrite for that.
2. Approve **Hack Zone** as a new series name and the palette direction (spruce / tangerine / mint). I will mock up 3 scenes in 3 families: the tab strip over the Blender lamp-and-notebook, the pen writing "TAXES → CALL ACCOUNTANT", and the quiet-room proof beat.
3. OK with the cloned voice (default) instead of the avatar?
