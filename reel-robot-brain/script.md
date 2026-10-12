# "A chatbot just beat 40 robot brains." GPT-6 Astra as a robot policy (news explainer, no avatar, ~62 s)

**Logline:** researchers handed GPT-6 Astra a robot with no fine-tuning for any of the tasks. It looks through cameras and answers with move commands. On RoboDojo's 42 tasks it ranked first against 40 robot policies, at 22% success. An older model managed under 1%. It also stacks blocks, folds clothes and plays piano with two robot hands. Then the twist: on real arms the team **stopped testing for safety**, after unsafe moves damaged equipment.

**Why it works:**
- It's surprising and visual (robots doing chores, a piano).
- It's relatable ("will it fold my laundry?").
- It carries hard numbers, a rival (Claude) on the real-arm test, and an honest twist.
- It fits the cartwheel-robot register the creator asked for: few numbers, heavy on motion.

**No avatar:** the voice is Kokoro `am_michael`, base speed 1.08, hook a touch faster at 1.12.
- Sentence-level synthesis with per-sentence speed and pauses.
- No synthetic fillers.
- Word timestamps drive the captions and cues.
- The CTA still shows the profile photo + @sandesh.explains (house rule).

## Facts (A = primary source read today, 12 Oct 2026; B = secondary)
**Paper (A):** "An Unexpected Robot Policy: Early Evaluations of GPT-6 Astra on RoboDojo and Beyond", arXiv 2609.24170, submitted 21 Sep 2026; Zhang, Wang, Ouyang et al.
1. **"LLM as policy" without task-specific fine-tuning.**
   - Each turn the model sees camera images and must call `move_eef` (world-frame grasp targets plus a note) or `give_up`.
   - Plain software plans the joint path and runs it at 25 Hz.
   - Budget: 100 model calls per episode, at medium reasoning effort.
2. **RoboDojo (simulation):**
   - 42 tasks, 50 episodes each (2,100 trials), compared with 40 public policies.
   - **Astra: 22.48% average success, Score 28.97, rank 1.**
   - The next four: DM0.5 19.34%; GalaxeaVLA G0.5 14.88%; Xiaomi-Robotics-1 13.93%; OpenWAM-α 11.92%.
   - **GPT-5.5: 0.88%**; DeepSeek-Flash 1.92% (10 episodes per task).
3. **Strong on understanding, weak on precision:**
   - Best Scores: stack_blocks 88.1, general_pickup 84.0, **fold_clothes 76.4**.
   - Zero: **plug_in_charger 0.0**, make_kong 0.0, swap_blocks 0.0 (Scores).
   - Success 0% on insert_tubes, play_tic_tac_toe, store_laptop_and_headphones, fill_pen_holder.
   - The authors say it's weak on "precision, dynamic control, or complex bimanual coordination".
4. **Piano** (RoboPianist, two Shadow hands, outside the benchmark protocol): the model **wrote a controller**.
   - Two-hand "Twinkle Twinkle": F1 **0.902**, vs **0.886 for the RL reference replay**.
   - Chopin nocturne excerpt: F1 0.599, below its 0.9 target.
5. **Real robots:**
   - "Real-robot evaluation was stopped for safety."
   - The model "repeatedly issued physically unreasonable or unsafe actions", and some incidents damaged equipment. **No person was injured.**
   - The arms were ARX X5, Piper and Piper X. No incident count is given.
   - Quote: "Aggregate benchmark performance therefore does not establish reliable or safe physical control."
6. **Humanoid** (qualitative only): fold a shirt "corners first, neatness stalled"; toast into the slot failed; pouring water spilled a bit.

**Independent real-arm test (A):** Robocurve, "GPT-6 Astra on robotic manipulation", 4 Sep 2026; bimanual I2RT YAM arms; 20 trials per task.
7. **Block into bowl:**
   - **Astra 19/20 (95%)**, 2.5 min, $0.94 per run.
   - **Claude Fable 5.1 8/20 (40%)**, 6.8 min, $2.12.
   - Fable 5 1/20.
8. **Puzzle piece into groove:** **Astra 2/20, Fable 5.1 2/20** (a tie); Fable 5 0/20.
9. **Robocurve's own caveats:**
   - different rigs and days, not interleaved;
   - grading was operator-judged with the model known;
   - list prices;
   - medium effort only.

**Background (B):** GPT-6 Astra is OpenAI's model released 3 Sep 2026 with staged access.

**Don't say (C):**
- "never trained on robots" (contamination is unquantified; say "no fine-tuning for these tasks");
- "22% beats humans", or that it's "safe";
- that it broke anything in a home;
- any incident count.

## Benchmark to beat (standing rule)
Previous ceiling: `reel-ai-trading-pipeline` (70 s, 11 families, cable match cuts, a Blender rack that changes state, a mocap doorman, a voice-per-block score).

**Its weaknesses:**
1. 70 s is long, with skip risk mid-reel.
2. An abstract metaphor (rack and cables) that had to be explained.
3. The Blender objects were static state frames (plugged/unplugged), not motion.
4. The avatar tile shared the frame with every scene.

**This reel does what none did before:**
1. **Real articulated 3D motion.** A procedural Blender **bimanual robot rig** (two 6-DoF arms with grippers) animated by IK. It's rendered as frame sequences per action (reach, grasp, lift, place, fumble, jerk), and the page scrubs them by `t`. These are the first moving 3D characters in the repo, not static props.
2. **Robot-POV tri-camera HUD:**
   - three feeds (TOP, LEFT WRIST, RIGHT WRIST), as in the real harness;
   - the model's turn prints live as a tool call: `move_eef({left: [0.42, 0.18, 0.06], grip: close})`, with an ILLUSTRATIVE label;
   - the arm then moves to that exact pose.
   It shows *how* a chatbot drives a robot. No reel has shown the mechanism this literally.
3. **A 2,100-trial dot field.** 42 columns × 50 dots fill as a pure function of `t`. Each column lights at its task's real Score ratio (best tasks bright, zero tasks dark), and the field collapses into the 22.48% bar. It's a data object built from the paper's own per-task table.
4. **Leaderboard elevator.** Astra's card rises past 40 policy cards to rank 1, with the four named runners-up shown with their real numbers; GPT-5.5 sits at the bottom at 0.88%.
5. **A shorter runtime:** ~62 s, ~158 words.
6. **The first light palette in four reels** (headroom note from the glass-diary benchmark).

## Voice-over (Kokoro `am_michael`; 13 sentences; ~158 words, ~62 s)
1. (hook, speed 1.12) "A chatbot just beat forty robot brains, at their own job."
2. "And nobody fine-tuned it for a single one of these tasks."
3. "Researchers gave GPT-6 Astra a pair of robot arms. Each turn, it looks through the cameras, and says where the gripper should go."
4. "Forty-two tasks. Two thousand one hundred tries. It came first, at twenty-two percent."
5. "Sounds low? An older OpenAI model, GPT-5.5, scored under one."
6. "It's great when the job needs understanding. Stacking blocks. Folding clothes."
7. "It's hopeless at precision. Plug in a charger? Zero."
8. "It even wrote its own controller, and played Twinkle Twinkle with two robot hands, slightly better than the trained baseline."
9. "On real arms, it dropped a block in a bowl nineteen times out of twenty. Claude managed eight."
10. "A puzzle piece into its slot? Two out of twenty. For both."
11. (slower, 0.98) "Then the real test. The team stopped its real-robot trials for safety. It kept making unsafe moves, and damaged equipment."
12. "Their own words: a high score doesn't mean safe control."
13. (warm) "So, would you let it fold your laundry? Follow for more."

**Claim check per line:**
- 1: rank 1 vs 40 public policies (fact 2).
- 2: no task-specific fine-tuning (fact 1).
- 3: `move_eef` from camera views; bimanual (facts 1, 7).
- 4: 42 tasks / 2,100 trials / 22.48% (fact 2).
- 5: 0.88% (fact 2).
- 6: stack 88.1 / fold 76.4 Scores (fact 3). The screen says "Score", not "% success".
- 7: plug_in_charger 0.0 (fact 3).
- 8: F1 0.902 vs 0.886 (fact 4). "Trained baseline" = the RL reference replay; on screen: "RL reference".
- 9: 19/20 vs 8/20 (fact 7), with the "different rigs and days" chip.
- 10: 2/20 tie (fact 8).
- 11: "stopped for safety … unsafe actions … damaged equipment … no one hurt" (fact 5). "No one was hurt" goes on screen.
- 12: paraphrase of the quote; the exact quote goes on screen (fact 5).

**Pronunciation map for TTS:** "GPT-6" → "G P T six"; "GPT-5.5" → "G P T five point five"; "Astra" → "Astra"; "Claude" → "Claude". `build.mjs` merges the spoken forms back for captions (the `fixW` pattern).

## Screenplay
Family codes:
- A: photoreal AI still + depth parallax
- B: Blender 3D
- C: mocap rig
- D: humaaans
- E: logos/icons
- F: bespoke SVG/DOM objects
- G: kinetic type
- H: real-footage overlays
- I: real Unsplash photo
- K: audio

There's no J (avatar) this time. Times are estimates (≈ 2.55 words/s) and will be retimed from the TTS word timestamps.

| # | Time | Primary visual | Layers (pure functions of `t`, keyed to words) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | 0–3.0 | **Frame 0 composed:** the Blender bimanual rig mid-reach over a lab table, a chat bubble "pick up the red block" docked to its "head" | A mini leaderboard flicks 40 grey cards down and one OpenAI card up to **#1** on "beat" | servo whir, card flicks, chime | A CHATBOT BEAT 40 ROBOT BRAINS | — (hook frame) | B F E G K |
| 2 | 3.0–5.6 | **"NO FINE-TUNING" stamp** over a stack of 42 task cards that fan out (stack blocks, fold clothes, plug in charger…) | Each card carries a tiny tabler icon | card fan, stamp | 0 TASK-SPECIFIC TRAINING | // 42 TASKS, ZERO PRACTICE | F G E |
| 3 | 5.6–11.5 | **Robot-POV tri-camera HUD:** TOP + LEFT WRIST + RIGHT WRIST feeds (Blender renders from three cameras) | The tool call types `move_eef({left:[0.42,0.18,0.06], grip:"close"})` (ILLUSTRATIVE), then the rig executes it; a turn counter "CALL 7/100" | keyboard ticks, servo | IT LOOKS. IT SAYS WHERE TO MOVE. | // HOW A CHATBOT DRIVES ARMS | B F G |
| 4 | 11.5–15.5 | **The 2,100-trial dot field** (42 × 50), lighting column by column at each task's Score | Counters TASKS 42 · TRIES 2,100; the field collapses into a big bar **22.48%** | rising arpeggio of ticks | 1ST PLACE · 22% | // RANKED ON ROBODOJO | F G K |
| 5 | 15.5–19.0 | **Leaderboard elevator:** five real rows (Astra 22.48 · DM0.5 19.34 · GalaxeaVLA 14.88 · Xiaomi-Robotics-1 13.93 · OpenWAM-α 11.92) + GPT-5.5 **0.88** dropping to the floor | A ×25 jump chip (22.48 ÷ 0.88) | elevator ding, low thud | GPT-5.5: 0.88% | // FROM UNDER 1% TO FIRST | F E G |
| 6 | 19.0–22.6 | **Photoreal bright lab bench** (AI image, no people) with parallax; the Blender arms composited in, stacking blocks, then folding a shirt (fabric as a simple cloth sim render) | Score chips STACK 88.1 · FOLD 76.4 | soft clacks, cloth swish | GOOD AT UNDERSTANDING | // WHERE IT SHINES | A B F H |
| 7 | 22.6–25.6 | **The fumble:** a gripper jitters around a phone charger port in a tight macro render and misses | Big **0** slams down; chips INSERT TUBES 0% · TIC-TAC-TOE 0% · FILL PEN HOLDER 0% | buzzer, clatter | PLUG IN A CHARGER? ZERO. | // WHERE IT BREAKS | B F G K |
| 8 | 25.6–32.0 | **Two robot hands on a piano** (Blender hands on keys, keys depress on the melody's notes) with a piano roll scrolling | F1 meter 0.902 vs RL reference 0.886; "IT WROTE ITS OWN CONTROLLER" code card; Chopin 0.599 chip | the actual "Twinkle" melody synthesised, note-locked to the keys | 0.902 vs 0.886 | // THE PIANO DETOUR | B F K G |
| 9 | 32.0–37.2 | **Real-arm head-to-head:** split frame with OpenAI and Anthropic logos (nominative); 20 bowls each, filling with ✓/✗ | **19/20** vs **8/20**, with time 2.5 vs 6.8 min and cost $0.94 vs $2.12; caveat chip "different rigs & days · Robocurve, 4 Sep" | ball-drop plinks per trial | BLOCK → BOWL: 19 vs 8 | // ROBOCURVE'S BOWL TEST | F E G |
| 10 | 37.2–40.4 | **Same split, puzzle task:** both rows mostly ✗; a 0–4 stage ladder shows both stalling at stage 3 ("above the groove") | **2/20 = 2/20** tie badge | stall tone ×2 | PUZZLE: 2 vs 2 | // THE LAST CENTIMETRE | F G |
| 11 | 40.4–48.5 | **Mood shift:** a photoreal empty lab at dusk (AI image) behind a **mocap human operator** hitting a big E-STOP (CMU walk + reach clip), as the Blender arm freezes mid-jerk | Incident card: "REAL-ROBOT EVALUATION WAS STOPPED FOR SAFETY" · arms ARX X5 · PIPER · PIPER X · "NO ONE WAS HURT"; film-grain overlay | alarm chirp, hard stop, silence | STOPPED FOR SAFETY | // WHY THE REAL TRIALS ENDED | A C F H |
| 12 | 48.5–53.0 | **The quote alone:** "Aggregate benchmark performance therefore does not establish reliable or safe physical control." with the authors' paper ID under it | A slow push-in; nothing else on screen (a deliberate beat) | low pad | (the quote) | // THE AUTHORS, IN THEIR WORDS | G F |
| 13 | 53.0–end | **CTA and recap:** a humaaans character holding a laundry basket while the robot arm hovers, plus a recap strip (#1 of 41 · 22% · stack ✓ fold ✓ plug ✗ · real trials stopped) | Profile photo ring + @sandesh.explains + FOLLOW (≥ 3 s); a real Unsplash living-room/wardrobe photo plate behind, if one fits | warm resolve chord | WOULD YOU LET IT FOLD YOUR LAUNDRY? | (none: CTA) | D I F G K |

**Asset-mix audit:**
- Families used: **10** (A, B, C, D, E, F, G, H, I, K).
- Primary visual by scene: B · F · B · F · F · A · B · B · F · F · A · G · D.
  - Neighbours 4/5 and 9/10 share family F, but with very different objects (dot field → leaderboard; bowls → stage ladder).
  - If that's too close, scene 5 can become a Blender "podium" render instead.
- Primary counts: B 4, F 5 (one over the soft cap; scene 5 is the swap candidate), A 2, G 1, D 1.
- Every scene has ≥ 2 families.

## Visual identity: "Clean Room" (checked against every prior reel)
- **Palette (light, new):**
  - lab white `#f3f5f2`, with brushed aluminium `#c9ced3` for the arms;
  - **cobalt `#2b4bdc`** for Astra and "the model's turn";
  - **signal tomato `#ff5136`** for fails and zeros;
  - **success green `#14b26a`**;
  - **caution-tape yellow `#ffd23d`** for warnings and the stop;
  - graphite ink `#1b1f24` for text.
  No previous reel used a white lab base with cobalt and caution tape.
- **Texture / motion language:**
  - faint floor-tape grid and calibration crosshairs;
  - a slow, subtle **camera-sensor scan line** on the robot-POV feeds;
  - motion comes from the **arms themselves** (real IK moves), not background drift.
- **Component language:**
  - tri-camera HUD frames with crosshairs;
  - a tool-call console;
  - the trial dot field;
  - leaderboard rows with rank tabs;
  - bowls of ✓/✗;
  - a 0–4 stage ladder;
  - a piano roll + F1 meter;
  - an incident card with caution-tape edges;
  - a bare quote.
- **Typography (new to reels):**
  - **Darker Grotesque 900** for headlines (tall and condensed, engineering-label feel);
  - **Azeret Mono 600** for tool calls, numbers and tags;
  - **Inter 700** for captions;
  - cover in **Anton** (house rule).
  Both new families get vendored via `@fontsource` (OFL).
- **Characters:**
  - the Blender bimanual rig (new, procedural);
  - a CMU mocap operator (walk + reach) in scene 11;
  - one humaaans pose (with a basket or holding something) not used in the last five reels.
- **Cover (grid-first, ≤ 5 words):**
  - options: **"CHATBOT. ROBOT BRAIN. #1."**, **"IT FOLDS. IT CAN'T PLUG."** or **"22% BEAT 40 ROBOTS"**;
  - hero: the bimanual arms holding a folded shirt, with a #1 rank tab;
  - face chip bottom-right.

## Audio plan
- **Score:** a clean electronic "lab" cue:
  - plucks and servo-like FM blips;
  - tempo rises through the leaderboard;
  - the scene-8 piano cue plays the real "Twinkle" melody, note-locked to the rendered keys;
  - it drops to a single drone with a hard stop for the safety beat;
  - a warm resolve for the CTA.
  Beat-locked cuts and peak-aligned SFX, as in the tokens reel.
- **Voice:** Kokoro `am_michael`, per-sentence speed (hook 1.12, body 1.08, safety beat 0.98), with 0.25–0.45 s pauses between sentences.
- **Targets:**
  - voice over music + SFX: median ≥ 19 dB, min ≥ 11 dB;
  - −14 LUFS, ≤ −1 dBTP;
  - mix report + spectrograms.

## Honesty guardrails
- Every robot visual is labelled "ILLUSTRATION · NOT THE STUDY'S FOOTAGE".
- Tool-call text is labelled ILLUSTRATIVE.
- AI images carry an "AI IMAGE" tag.
- "Score" and "success rate" are never mixed up on screen.
- The Robocurve caveats appear as a chip.
- The caption discloses that the reel was made with Claude, and that Claude is one of the models compared (it lost the bowl test and tied the puzzle).

## Decisions for the creator
1. **Voice:** Kokoro `am_michael` (as in the suncatcher and StarCraft reels), or a different Kokoro voice? A real recording of your own voice over this script would also work, and would be the most natural.
2. **Cover line:** pick one of the three above.
3. **Next step:** a 3-scene mockup (scenes 3, 4 and 11, from three different families), as usual before the full build.
