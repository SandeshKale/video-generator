# "Nobody grades their own code." Claudex Loop, Claude × GPT-6 Astra (tutorial reel, ~62 s, 5 avatar parts)

**Logline:** most of us let one AI plan, build and grade its own work. Claudex Loop, a free Claude Code skill, makes two rival models check each other:
1. Claude writes the plan.
2. GPT-6 Astra (in Codex) attacks it with evidence, round after round, until it's approved.
3. They swap sides: one builds, and the other inspects the finished code in a fresh session.
4. "Whoever builds never grades it." Change the plan after approval and the approval is void.

**Format:** tutorial / how-to (standing rule):
- a step tracker on screen throughout;
- tier-A commands typed big and held ≥ 2 s;
- an honest catches beat;
- a save-worthy recap ≥ 2.5 s;
- CTA = Save + Follow.

## Facts (tier A: read first-hand today, 11 Oct 2026, from the repo README and `references/runtime.md`)
Repo: `github.com/chaseai-yt/claudex-loop` (MIT; by Chase AI; previously `grill-me-codex` / `crucible`). It's a community project, not an Anthropic or OpenAI product.
1. **The loop, starting in Claude Code:**
   - requirements and the plan come from the current Claude session;
   - **Codex reviews the plan**;
   - Claude builds by default;
   - **a fresh Codex session inspects the final code**.
   Starting in Codex mirrors this. `builder=codex` makes Codex the builder, and **the inspector is always the other provider**.
2. **The four phases:** recon → requirements → plan review → build and inspect. The README's tagline: "**Whoever built it never grades it**".
3. **Plan review:**
   - the other provider returns **evidence-backed findings**;
   - the verdict is `APPROVED` / `REVISE` / `BLOCKED`;
   - **round cap `rounds` = 5 by default**;
   - fix rounds max 2; inspections max 2.
4. **Models:** "Use **Claude Fable 5.1** and **GPT-6 Astra** when selected and available on your accounts, or retain each CLI's configured model." Example: `reviewer_model=gpt-6-astra`. There's no silent fallback.
5. **Approval is bound to the plan's SHA-256:** "Changing the plan invalidates it." Later code changes need another inspection.
6. **Reviewers are read-only:**
   - Codex runs in a read-only sandbox;
   - Claude gets only Read/Glob/Grep, with no MCP.
7. **Install (Claude Code plugin), shown verbatim:**
   `/plugin marketplace add chaseai-yt/claudex-loop`
   `/plugin install claudex-loop@claudex-loop`
   Then, e.g., `claudex this feature — plan and implement it` or `claudex this feature, builder=codex, reviewer_model=gpt-6-astra`.
8. **Requirements:**
   - both CLIs installed and logged in (`codex login status`, `claude auth status`);
   - Python 3.10+;
   - no extra API keys.
9. **Honest limits, from the README:**
   - "A clean structured result does not prove the model is right."
   - "Zero findings is valid; a large number of findings is not a quality score."
   - The 55-findings CRM run "is an illustrative run, not a controlled benchmark."
10. **GPT-6 Astra:**
    - OpenAI, 3 Sep 2026;
    - staged access;
    - $10 / $50 per M tokens (several outlets; used only as a caption footnote if at all).

**Don't say (C):**
- that it's official or made by Anthropic or OpenAI;
- that it makes code bug-free;
- any speed or quality benchmark (none exists);
- that it's free to run (the skill is free; the two subscriptions aren't).

## What the reference reel did, and what this one does better
The reference (32 s, AI-explainer creator, "comment CLAUDEX" CTA):
- talking head in the bottom half and a graphic in the top half;
- clean white motion cards: logos, a PLAN.md card, an orbit of two logos;
- B-roll of the creator at a desk;
- word-pop captions;
- ~30 cuts.

**Its strengths (kept):**
- a hook in the first 3 s;
- one simple idea (two models check each other);
- a fast pace and a short runtime;
- a keyword CTA.

**Its weaknesses (fixed):**
1. **It explains with logos, not with a picture of the mechanism.** Most graphics are brand cards (Claude logo, "ChatGPT-6 Astra" title, two icons orbiting). You never *see* a review round, a finding, a verdict or the swap. We make the mechanism the visual: a rally, a scoreboard, finding stickers on the plan, a verdict and a swap of sides.
2. **The roles are half-right.** It says "Claude plans, Astra audits; then Astra builds, Claude audits". That's one configuration (`builder=codex`). By default Claude builds and a *fresh* Codex session inspects. We show the real rule: **the inspector is always the other model**.
3. **No how-to.** "Comment and I'll send it" hides the setup. We show the two real install commands, held for a screenshot, plus the one-line prompt.
4. **No catches.** It needs two paid CLIs, it's slower, it's a community project, and a clean review isn't proof. We say so.
5. **It misses the cleverest detail:** approval is tied to the plan's fingerprint, so edit the plan and the approval is void. It's visual and memorable.
6. **The split screen halves the host** and shows the graphic only at postage-stamp size. We use full-frame scenes with the host as a moving tile.

## Benchmark to beat (standing rule)
Previous ceiling: `reel-ai-trading-pipeline` ("A bot that can't panic.", 70 s, 11 families). It had:
- cable match-cuts;
- a Blender rack that changes state;
- a key-wall reveal;
- a mocap doorman;
- a synth score that gains a voice per block.

**Its weaknesses:**
1. It ran 70 s, long for a tutorial (skip risk mid-reel).
2. The core metaphor (rack and cables) was abstract: viewers had to be told what each module meant.
3. The two "sides" of the story (the rules vs the bot) were never shown as opponents.
4. The host stayed a small tile until the CTA.

**This reel does what none did before:**
1. **The frame *is* the table.** A Blender top-down table-tennis table fills the 9:16 frame:
   - the net runs across the middle;
   - **Claude's half is at the bottom (terracotta), Astra's at the top (graphite)**;
   - the **plan (a PLAN.md page) is the ball** and crosses the net once per review round.
   It's intuitive at a glance: a back-and-forth until someone wins the point.
2. **A 180° camera orbit as the role swap.** One continuous Blender camera move rotates the whole table, so **the players change ends** on "switch sides". It's a rendered frame sequence scrubbed by `t`, the first full-scene 3D camera move in the repo.
3. **A live scoreboard as the data object:**
   - ROUND 1/5 … 3/5;
   - REVISE (amber) → REVISE → **APPROVED** (mint);
   - a findings counter;
   - styled like a broadcast sports bug, with real numbers from the README (cap 5, fix 2, inspections 2).
4. **Finding stickers that stick to the ball.** Each return lands evidence stickers ("no rollback", "untested edge case", "missing auth check"; illustrative) on the PLAN page, and Claude's next serve shows them crossed out.
5. **A plan fingerprint seal:**
   - the approved plan gets a wax-seal stamp with a short SHA-256 (`a91f…`);
   - a hand edits one line, **the seal cracks** and turns VOID;
   - a real fact, made physical.
6. **A shorter runtime:** ~62 s with five parts (vs 70 s), and the install takes one held screen instead of a block per step.

## Voice-over in five avatar parts (≤ 15 s each; ~158 words, ~62 s at base pace 1.0)
**Part 1: hook (33 words).** The first ~3 s are the energetic hook question.
"Would you let a student grade their own exam? Because that's how most of us use AI. One model plans, builds, and grades itself. This free skill fixes that, with two rival models."

**Part 2: the rally (31 words)**
"It's called Claudex Loop. Claude writes the plan. Then GPT-6 Astra, inside Codex, attacks it with evidence. They go back and forth, up to five rounds, until the plan's approved."

**Part 3: the swap (33 words)**
"Then they switch sides. One builds, and the other inspects the finished code, in a fresh session. Whoever builds never grades it. Change the plan after approval? The approval's void."

**Part 4: setup (30 words)**
"Setup is two commands in Claude Code. Add the marketplace, then install the plugin. Then just type: claudex this feature. Want Astra to build instead? Add builder equals codex."

**Part 5: the catch + CTA (31 words)**
"The catch? You need Claude Code and Codex, both logged in, and it's slower. A clean review isn't proof either. Still beats marking your own exam. Save this, and follow for more."

**Claim check per line:**
- "free skill": MIT repo. The catch line makes clear both CLIs are needed.
- "Claude writes the plan … Astra, inside Codex, attacks it with evidence": facts 1, 3, 4. The on-screen chip says "GPT-6 Astra · or your Codex model".
- "up to five rounds": the `rounds` default (fact 3).
- "One builds, the other inspects … fresh session": fact 1.
- "Whoever builds never grades it": the repo tagline (fact 2).
- "approval's void": fact 5.
- "two commands … claudex this feature … builder equals codex": fact 7.
- "both logged in … slower … isn't proof": facts 8–9. "Slower" follows from extra review rounds by design; on screen it reads "more rounds = more time".

## Performance track (host rule: gaze on the lens; ≤ 2 nods per clip; blinks at clause breaks)
| Part · line | Emotion | Brow | Head | Notes |
|---|---|---|---|---|
| P1 "Would you let a student grade their own exam?" (0–3 s) | **playful, curious, bright** | a genuine lift on "their own" | slight lean-in | A real question, with energy, no shouting. |
| P1 "One model plans, builds, and grades itself." | dry, knowing | neutral | still | |
| P1 "This free skill fixes that…" | warm, confident | slight lift on "two rival" | one small nod | |
| P2 "It's called Claudex Loop…" | clear, practical | neutral | still | Dry facts = stillness. |
| P2 "…until the plan's approved." | satisfied | relaxed | small nod on "approved" | |
| P3 "Then they switch sides." | a little playful | slight lift | still | |
| P3 "Whoever builds never grades it." | firm, the key line | slight focus | one nod | The money line. |
| P3 "Change the plan after approval? The approval's void." | wry | small lift on "void" | still | |
| P4 setup | calm, helpful | neutral | still | Slower over the commands. |
| P5 "The catch?…" | honest, sincere | slight inner raise | still | No smile. |
| P5 "Save this, and follow for more." | warm, friendly | relaxed | lean-in | Dead-on camera. |

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
- J: avatar host
- K: audio

Times are estimates (≈ 2.4 words/s) and will be retimed from the clips.

| # | Part · time | Primary visual | Layers (pure functions of `t`, keyed to words) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | P1 0–3.0 | **Host big**, frame 0 fully composed: an exam sheet slides in beside them, and **the same hand that wrote the answers marks it A+** | Red-pen tick strokes draw on; a stamp reads "GRADED BY: THE STUDENT" | pen scratch, stamp | GRADE YOUR OWN EXAM? | — (hook frame) | J F G K |
| 2 | P1 3.0–8.5 | **One humaaans figure doing three jobs**: three role hats (PLAN · BUILD · GRADE) stack on one head, and the score card flips to 10/10 | "ONE MODEL" label; a smug ✓✓✓ row; the host tile shrinks to the corner | three pops, ding | ONE MODEL. PLANS, BUILDS, GRADES ITSELF. | // THE SELF-GRADING PROBLEM | D F G |
| 3 | P1 8.5–14.4 | **The Blender table reveal**: the camera drops from high above onto a top-down table-tennis table filling the frame | Claude mark (terracotta) on the bottom half, OpenAI mark (graphite) on the top half (nominative logos); "FREE SKILL · MIT" chip; step tracker appears (1 PLAN · 2 RALLY · 3 SWAP · 4 SETUP) | whoosh, ball tap | TWO RIVAL MODELS | // TWO MODELS, ONE TABLE | B E F |
| 4 | P2 0–5.0 | **Claude serves the plan**: a PLAN.md page folds into a glowing ball and crosses the net | Typing PLAN.md card (Goal · Steps · Acceptance checks · Proof command); tracker 1/4 | paper fold, serve pop | CLAUDE WRITES THE PLAN | // ROUND 1 · THE SERVE | B F G |
| 5 | P2 5.0–10.5 | **Astra returns it with evidence**: the ball comes back carrying finding stickers (illustrative: "no rollback", "untested edge case", "auth check missing") | **Scoreboard bug**: ROUND 1/5 · REVISE (amber) · FINDINGS 3; chip "GPT-6 Astra · or your Codex model"; real-footage dust overlay in the spotlight | ball smack, sticker slaps ×3 | ASTRA ATTACKS IT · WITH EVIDENCE | // ROUND 1 · THE RETURN | B F E H |
| 6 | P2 10.5–14.6 | **Rally montage**: rounds 2 and 3 in quick cuts; stickers get crossed out on each serve; the scoreboard ticks 2/5 REVISE → **3/5 APPROVED** (mint flash) | Max-rounds rail "CAP: 5 ROUNDS"; tracker 2/4 | rally taps accelerating, buzzer | UP TO 5 ROUNDS → APPROVED | // THE RALLY | B F G K |
| 7 | P3 0–4.0 | **The 180° camera orbit**: the whole table rotates and the players change ends | Role labels flip: PLANNER/REVIEWER → BUILDER/INSPECTOR; tracker 3/4 | long whoosh | THEY SWITCH SIDES | // SAME TABLE, NEW JOBS | B G |
| 8 | P3 4.0–9.0 | **Mocap figures as builder and inspector**: a robot rig *builds* (a wall of code blocks stacking up) while a second figure walks in from a "FRESH SESSION" door and inspects with a magnifier | Rule banner: **"WHOEVER BUILDS NEVER GRADES IT"** (repo tagline, quoted); chips "builder=claude (default)" · "builder=codex" · "inspector = the other one" | footsteps, door, block clunks | WHOEVER BUILDS NEVER GRADES IT | // THE ONE RULE | C F G |
| 9 | P3 9.0–14.6 | **The fingerprint seal**: the approved PLAN.md gets a wax seal "APPROVED · sha256 a91f…"; a cursor edits one line; **the seal cracks → VOID** | Hash characters scramble to a new value; footnote "approval = this exact plan" | seal stamp, crack | EDIT THE PLAN → APPROVAL VOID | // APPROVAL IS LOCKED TO THE PLAN | F G K |
| 10 | P4 0–9.0 | **Command screen over a real desk photo** (Unsplash keyboard/monitor plate, parallax drift), commands typed big and each **held ≥ 2 s**: `/plugin marketplace add chaseai-yt/claudex-loop` → `/plugin install claudex-loop@claudex-loop` | Tracker 4/4; Claude Code logo; "STEP 1 · STEP 2" pins | typing, enter clunks | 2 COMMANDS · IN CLAUDE CODE | // SETUP IN 2 COMMANDS | I F E G |
| 11 | P4 9.0–14.4 | **The prompt line** `claudex this feature` typed, then `, builder=codex` slides in; a mini table shows who does what for each builder choice | Mini table: DEFAULT: Claude builds · Codex inspects / builder=codex: Codex builds · Claude inspects | typing, toggle click | builder=codex → ASTRA BUILDS | // ONE LINE TO START | F G |
| 12 | P5 0–8.0 | **Photoreal empty arena after the match** (AI still, no people): a dim spotlight, scattered balls, a scoreboard in the dark; depth-parallax push | Three catch cards drop in: "CLAUDE CODE + CODEX, BOTH LOGGED IN" · "MORE ROUNDS = MORE TIME" · "A CLEAN REVIEW ISN'T PROOF" (README quote chip); "COMMUNITY PROJECT · MIT" | low drone, card thuds | THE CATCH | // WHAT IT WON'T DO | A F G H |
| 13 | P5 8.0–end | **Recap card** (save-worthy, ≥ 2.5 s): the table from above with the 4 steps written on it like court markings (1 CLAUDE PLANS · 2 ASTRA ATTACKS ×≤5 · 3 SWAP: OTHER MODEL INSPECTS · 4 TWO COMMANDS), plus the two commands | **CTA**: the host grows to a large ring + @sandesh.explains + FOLLOW + SAVE (≥ 3 s) | warm resolve chord, final ball bounce | SAVE THIS · FOLLOW FOR MORE | (none: CTA) | B J F G K |

**Asset-mix audit:**
- Families used: **11 / 11**.
- Primary visual by scene (no two neighbours match): J · D · B · B* · B* · B* · B · C · F · I · F · A · B. *Scenes 4–6 are one continuous rally shot, intentionally one family; variety comes from the scoreboard, stickers and overlay layers.*
- Primary counts: B 6 (one continuous set, the reel's spine). This is over the "≤ 4" rule of thumb, deliberately. If you'd rather keep the rule, scene 6 can become a scoreboard-only data cut (F).
- Every scene has ≥ 2 families, and most have 3–4.

## Visual identity: "Championship Rally" (checked against every prior reel)
- **Palette (new):**
  - arena night `#070c1c`;
  - **table blue `#1747a6`**;
  - chalk-white court lines `#f2f5fb`;
  - **Claude terracotta `#e2703a`** (bottom half);
  - **Astra graphite-silver `#c3cad6`** on charcoal `#1d2128` (top half);
  - verdicts: **APPROVED mint `#3fe39a`**, **REVISE amber `#ffc23d`**, **BLOCKED red `#ff4d5e`**.
  No prior reel used a sports-broadcast blue or a split warm/cool frame.
- **Texture / motion language:**
  - a top-down court with line markings;
  - spotlight falloff and lens flare on serves;
  - motion trails on the ball;
  - **scoreboard flips**;
  - **sticker slaps**;
  - **one 180° camera orbit**.
  No cables, rack metal, paper, dots or ink wipes.
- **Component language:**
  - broadcast scoreboard bug;
  - PLAN.md page / ball;
  - evidence stickers;
  - wax fingerprint seal;
  - role labels;
  - command terminal;
  - who-does-what mini table;
  - catch cards;
  - court-marking recap.
- **Typography (all new to reels):**
  - **Teko 600** (sports-broadcast condensed) for headlines and the scoreboard;
  - **Red Hat Mono 600** for commands, the hash and tags;
  - **Inter 700** for captions;
  - cover in **Anton** (house rule).
  Teko and Red Hat Mono get vendored via `@fontsource` (OFL).
- **Characters:**
  - one humaaans pose (scene 2) not used in the last five reels;
  - mocap builder robot + inspector (CMU walk + reach/inspect gestures), recoloured terracotta and graphite.
- **Cover (grid-first, ≤ 5 words):**
  - options: **"NOBODY GRADES THEIR OWN CODE"**, **"TWO AIs. ONE RULE."** or **"CLAUDE vs ASTRA: REVIEWED"**;
  - hero: the top-down table with the PLAN ball mid-net and the scoreboard reading APPROVED;
  - face chip bottom-right.

## Audio plan
- **Score:** a sports-broadcast cue:
  - a punchy stinger on the hook;
  - a tight rhythmic bed for the rally whose tempo ramps with each round;
  - a whoosh-riser through the 180° orbit;
  - a sparse low drone for the catch;
  - a warm resolve for the CTA.
  Beat-locked cuts.
- **SFX (peak-aligned, band-carved under the voice):**
  - pen scratch, stamp, ball taps and smacks, sticker slaps;
  - buzzer on APPROVED, orbit whoosh, door and footsteps, wax seal and crack;
  - typing and enter.
- **Targets:**
  - voice over music + SFX: median ≥ 19 dB, min ≥ 11 dB;
  - −14 LUFS, ≤ −1 dBTP;
  - mix report + per-scene spectrograms.

## Honesty guardrails
- On screen in scene 3: "COMMUNITY PROJECT · MIT · github.com/chaseai-yt/claudex-loop". It isn't shown as an Anthropic or OpenAI product, and the logos are nominative.
- Finding stickers, the hash value and the code blocks are labelled ILLUSTRATIVE.
- The Astra chip always says "or your Codex model", since the model is whatever your CLI is set to.
- The caption discloses that the reel was made with Claude and that the topic includes Claude.
- It also credits the original project author (Chase AI) and names the idea's source pattern (Peter Steinberger's Codex-as-builder, per the README).

## Decisions for the creator
1. **CTA:** "Save this, and follow for more" (house rule), or the reference's comment-keyword DM ("comment LOOP and I'll send it")? Only choose the keyword if you have DM automation set up.
2. **The primary-family rule:** keep the continuous table as the spine (B in 6 scenes), or swap scene 6 for a data cut?
3. **Avatar prompts** are in `avatar-prompts.md` (5 parts). Generate Part 1 first and check the hook energy and the pronunciation of "Claudex", "Codex" and "Astra".
