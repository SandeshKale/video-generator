# "Software is over?" — script + screenplay (visual-first, ~72 s, 5 avatar parts)

**Logline:** One developer got hit with a cancellation fee too many, so he rebuilt seven of Adobe's apps in a weekend, for free — and now everyone is asking whether software is over. Adobe denies wrongdoing, the apps are alpha, and the honest answer is "not yet, but subscriptions just got a rival."
**Voice:** the creator's avatar again (5 clips ≤15 s, Indian-accent audio, expressive — see `avatar-prompts.md`). Word times from faster-whisper, exactly as in `reel-ai-shopping-agent`.
**Numbers on screen (all tier A unless marked):** 7 apps · 1 weekend · 14.6K GitHub stars (first-hand, 11 Oct; B-tier 23K/42K figures *not* used) · half of what's left (the fee) · $150M = $75M + $75M · 13 March 2026 · "100% in a month" → "99% in months".
**Disclosure:** the clones were reportedly written with Claude Opus 5.5 (the maker of this assistant). Stated as reported fact, once; flagged in the first comment.

## Benchmark to beat (standing rule)
Previous ceiling — `reel-ai-shopping-agent` ("Checkout Lane", 59 s, 11 families): depth-occluded mocap robot, three Blender stills under one grade, avatar in a reacting kiosk, receipt motif. Its **measured weaknesses**, which this reel must fix: (1) the host sat in the same small corner window for ~85 % of the runtime; (2) every Blender object was a *still* — nothing 3D actually moved; (3) the bespoke objects were cards/boxes, no scene showed something being *built*; (4) several scenes were thin for their first 0.5–1 s and the lower-left stayed empty; (5) mocap figures were single stick-skins in one scene each; (6) no measured density check; (7) the mix was never auditioned.
This reel does what that one did not:
1. **Host choreography** — the avatar is never a static tile. Full-width call window (hook) → shrinks into a webcam tile when the story turns → becomes an IDE webcam tile → hijacks the frame for the question → CTA stage. He *reacts* (the retention modal "X" closes on his gesture beat; the tile flashes lime on "free", orange on "fee").
2. **3D that moves:** a Blender **turnstile turntable** (12-frame spritesheet scrubbed by `t`, lit to match the lobby photo, shadow-catcher contact shadow) and a **CSS-3D exploded layer stack** built from Blender-rendered glass slabs that fly apart and re-assemble with real perspective.
3. **Show-the-build scenes:** a t-driven Rust-style code stream + file tree + progress bar where an editor canvas fills in layer by layer (our own invented UI, never Adobe's), plus a crew of **three depth-occluded mocap robots** hauling seven labelled crates through a photoreal workshop.
4. **A background that tells the story:** the **fine-print wall** (tiny scrolling terms-and-conditions text) dissolves into **lime code rain** at the moment the story turns from "the trap" to "the free alternative"; it dissolves back for the Adobe-side beat.
5. **Five unique bespoke objects** (dark-pattern cancel modal, odometer, 12-month fee calendar, $150M split bar, parity gauge) — none is a re-skin of a previous reel's card.
6. **New QA:** `check.mjs` gains an **occupancy check** (≥ 65 % of 90-px safe-area cells hold a foreground element at entrance + 0.4 s) and the render is verified with `ebur128` + a voice-vs-music spectral check.

## Story engine
- **Relatable entry:** everyone has fought a subscription. Open on the trap itself (a dark-pattern cancel dialog).
- **Escalation:** fee → rebuild → seven apps → "software is over" → how (open source, free) → why (the half-of-what's-left fee, the $150M proposal) → the other side (Adobe denies; alpha; parity walk-back) → verdict → viewer's call.
- **Motif:** the *cancel button* — huge and orange when it's the trap, tiny and grey in the dark pattern, a lime **"fork"** button at the end.
- **Open loop:** "Is it?" (end of part 1) → answered at the start of part 5 ("Not yet.").
- **Balance:** the government's allegation and Adobe's denial each get a beat; the project's own caveats get a beat; the closing question is neutral.

## Voice-over in five avatar parts (each ≤15 s; every part ends on a full stop)
**Part 1 (33 words)** — *scenes 1–4*
"One developer got hit with one cancellation fee too many. So he rebuilt Photoshop. Then Premiere. Then five more Adobe apps, in a weekend, for free. He says, software is over. Is it?"
**Part 2 (≈33 words)** — *scenes 5–6*
"They're called Artcraft. Seven open-source apps, written in Rust, with Claude Opus five point five. The main repo already has over fourteen thousand GitHub stars. Free, local, no account."
**Part 3 (33 words)** — *scenes 7–8*
"The trigger: Adobe's early termination fee. Cancel a monthly-billed annual plan, and you can owe half of what's left. In March, the Justice Department proposed a hundred and fifty million dollar settlement over it."
**Part 4 (31 words)** — *scenes 9–10*
"Adobe denies wrongdoing, and the deal still needs a judge. And Brandon Thomas now calls the apps super early alpha. He promised full parity in a month. Now he says, months."
**Part 5 (≈34 words)** — *scenes 11–12*
"So, is software over? Not yet. But subscriptions just got a rival. So, would you swap a subscription for a free alpha you can fork? Tell me below. And follow for the next one."

## Screenplay (family codes: A photoreal+depth parallax · B Blender 3D · C mocap rig · D humaaans · E logos/illustrations · F bespoke SVG/DOM data objects/UI · G kinetic type/GSAP-style entrances · H real-footage overlays · I real Unsplash photo · J avatar host · K audio). Times are estimates (≈2.4 w/s) and get retimed from the returned clips.
| # | Part · time | Shot / primary visual | Layers (all pure functions of `t`, keyed to words) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | P1 0–3.3 | **Host in a wide call window** (top 60 %) over the orange **fine-print wall**; frame 0 already composed | Dark-pattern **cancel modal** pops in front: huge orange "KEEP MY PLAN", tiny grey "continue to cancel"; a fee line types itself; headline "ONE FEE TOO MANY." slams per word; film-grain | modal ping, error buzz, click | ONE FEE TOO MANY. | // ONE FEE TOO MANY | J F G H |
| 2 | P1 3.3–6.4 | **CSS-3D exploded layer stack** (Blender glass slabs: background · shapes · text · mask · adjustment) assembling; host shrinks to a corner webcam tile; cursor clicks the modal's × | Layer-name tags fly in; "PHOTOSHOP → PHOTOCRAFT" arrow chip; wall begins to turn to code | whoosh, layer snaps ×5, power-up | PHOTOSHOP → PHOTOCRAFT | // PHOTOSHOP, REBUILT FROM BEHAVIOUR | B F G J |
| 3 | P1 6.4–11 | **Photoreal night workshop** (A): **three mocap robots** (C) haul crates labelled with the other six app names + "FREE" sticker along a conveyor past racks (depth occlusion) | Weekend bar **SAT → SUN** fills; crate count 2 → 7 lands on "five more"; "FREE" lime sticker on "free" | footsteps, crate thuds, bell | PREMIERE · ILLUSTRATOR · LIGHTROOM · AFTER EFFECTS · INDESIGN · ACROBAT | // SEVEN APPS, ONE WEEKEND | A C F G |
| 4 | P1 11–14.5 | **Bare quote** type "SOFTWARE IS OVER" huge, host large with raised brow; a marker draws the **"?"** and it swings | Attribution line "— Brandon Thomas, Artcraft developer"; wall fully gone, code rain begins | marker squeak, question chime | "SOFTWARE IS OVER" ? | // THE BOAST | G J F |
| 5 | P2 0–6.2 | **Invented IDE window** (lime on ink): file tree filling with seven crates, **Rust-style code typing**, `cargo build` bar, licence badges MIT · APACHE-2.0; host = webcam tile top-right | Rust + Anthropic marks as nominative logos (if in library) else text chips; commit stream gutter | typing, build ticks, success chime | ARTCRAFT · 7 APPS · RUST · MIT / APACHE-2.0 · BUILT WITH CLAUDE OPUS 5.5 | // OPEN SOURCE, WRITTEN IN RUST | F E G J |
| 6 | P2 6.2–14.4 | **Real Unsplash laptop photo** (parallax pan) + **odometer** counting to **14.6K** with star icons rocketing up; 3 crossed-out chips: SUBSCRIPTION · UPLOAD · ACCOUNT | "GitHub · 11 Oct" source tag; humaaans figure relaxing (lime coat) | odometer ticks ×14, ping | 14.6K ★ · FREE · LOCAL · NO ACCOUNT | // 14.6K STARS IN DAYS | I F D G |
| 7 | P3 0–9 | **Blender turnstile turntable** (B) in a photoreal lobby (A); **12-month fee calendar**: 6 paid tiles solid, 6 remaining striped; half of the remaining ones drain into a coin meter that jams the turnstile | "HALF OF WHAT'S LEFT" chip; coin SFX per tile; orange wall returns behind the lobby | coin drops, turnstile clunk, buzzer | EARLY TERMINATION FEE · 50 % OF WHAT'S LEFT (illustrative months) | // THE HALF-OF-WHAT'S-LEFT FEE | B A F |
| 8 | P3 9–14.5 | **$150M split bar** slams, halves into **$75M penalty + $75M free services**; real photo of glass towers (I) as bed | Stamp "PROPOSED · 13 MAR 2026"; gavel icon; "needs court approval" chip arrives in scene 9 | stamp thud, ledger tick | $150M · $75M + $75M · PROPOSED | // A PROPOSED $150M DEAL | F I G E |
| 9 | P4 0–9 | **Split screen, two bespoke modals**: top "THE GOVERNMENT ALLEGED: fee obscured, exit drawn out"; bottom "ADOBE: denies wrongdoing" + "NEEDS COURT APPROVAL"; below, humaaans figure squints at an **ALPHA** stamp + "known issues" ticker | Highlighter swipes on the two sentences; wall flickers back | highlighter, stamp, low drone | NEEDS COURT APPROVAL · SUPER EARLY ALPHA | // TWO READINGS, ONE FEE · AND ONE ALPHA | F D E H |
| 10 | P4 9–14.3 | **Parity gauge**: needle sits at "100 % — IN 1 MONTH (Reddit)", swings down to "99 % — IN MONTHS (HN)" while a calendar flips | Two attributed quote tags; confetti of "TODO" sticky notes | needle tick, calendar flip, sigh synth | 100 % IN A MONTH → 99 % IN MONTHS | // FROM A MONTH TO MONTHS | F G D |
| 11 | P5 0–6.5 | **Turnstile spins open onto a lime door**; kinetic "NOT YET." then **head-to-head VS**: SUBSCRIPTION (orange, lock) vs FREE ALPHA (lime, fork), bugs included | Wall → code rain final dissolve | clunk, door chime, VS slam | NOT YET. · SUBSCRIPTION vs FREE ALPHA | // THE EXIT GOT A RIVAL | B G E F |
| 12 | P5 6.5–end | **Host hijacks the frame**; parody retention modal "Are you sure you want to swap?" with SWAP / STAY poll buttons; **CTA**: profile ring + @sandesh.explains + FOLLOW held ≥3 s | Host tile flashes lime on "follow" | ping, button taps, warm chord | WOULD YOU SWAP? · TELL ME BELOW · FOLLOW | (none — CTA) | J F E G K |

**Asset-mix audit (≥ 5–6 families, none primary in > 4 scenes, every scene ≥ 2 families):** families used **11/11**. Primary family per scene: J, B, C, G, F, I, B, F, D, F, B, J — no two neighbours equal; B primary in 2, 7, 11 (3 scenes — a moving turntable each time), F primary in 5, 8, 10 (three *different* objects: IDE, split bar, gauge), J in 1 and 12. Every scene has ≥ 3 families.

## Visual identity — "Fine Print" (checked against every prior reel)
- **Palette:** ink `#12110f`, **safety-orange `#ff6a13` = the trap**, **electric-lime `#c6f135` = the open alternative**, bone paper `#efe9dc`, fine-print grey `#8a867c`. Orange/lime are *semantic*: orange where Adobe's fee/maze is the subject, lime where Artcraft/open source is. (No navy/cyan/magenta/indigo/amber-on-slate combos used before.)
- **Texture / motion language:** the **fine-print wall** (7 px mono T&C text, scrolling, orange-tinted) ↔ **code rain** (lime columns). The wall→rain dissolve is the story device, driven by `t`.
- **Component language:** **OS window chrome** (title bar + three dots), dark-pattern buttons (huge vs tiny), checkbox rows, commit rows, file tree, distressed ink stamps, tape strips. No POS bezels, no receipts, no clip-corner panels, no glass.
- **Typography:** display **Barlow Condensed 800** (new to reels), **JetBrains Mono** for code/fine print, **Inter** body; cover in **Anton** on orange.
- **Characters:** a *different* humaaans pose/colours from `reel-ai-shopping-agent` (sit2, st20 used there): use standing/sitting poses not yet used, coat lime.
- **3D/photo unification:** every Blender object and photo gets the same grade (cool highlights, warm shadows) + grain; the turnstile is lit from the lobby photo's key direction.
- **Cover:** grid-first, orange accent: one giant **"CANCEL" button being crushed by a lime "FORK"**? (decide in cover step) — title "SOFTWARE IS OVER?" ≤ 5 words, face chip bottom-right.

## Audio plan
Avatar clips = voice. Score: **dark-pattern muzak** (soft jazz-pop parody that detunes) for trap scenes → **driving lime synth arps** for build scenes → bright resolve at the CTA; event SFX keyed to words (modal ping, click, layer snap, typing, crate thud, odometer ticks, coin, turnstile clunk, stamp, gauge tick, poll bleeps). Sidechain-duck under the voice; −15 LUFS; verify with `ebur128` and a voice/music spectral balance check.

## Production notes / risks
- **Neutrality:** never "Adobe got caught"; "the government alleged / Adobe denies"; the deal is *proposed*. Say "clean-room" only as his claim. Alpha, one developer, trade-dress question stay in.
- **No Adobe/Artcraft UI copies**; all UIs are invented. Adobe name as text; logos only if in the library and only nominatively.
- **14.6K stars** is first-hand (github.com/storytold/artcraft, 11 Oct) — re-check on render day; if it moved, update the odometer + line ("fourteen thousand" stays true while ≥14,000).
- **Compute:** photoreal stills ×4 (workshop, lobby, + two backups) at ~7 min each; Blender: layer slabs (5), turnstile ×12 frames, glass towers not needed (real photo). Keep disk > 1 GB free.
- **Host reactions need per-part performance tracks** (in `avatar-prompts.md`) — gaze on the lens, brow/nod on stress words.

## Next steps (awaiting your go on topic + script)
1. You run the 5 avatar prompts and send the clips back (MP4 with audio).
2. Meanwhile I mock up **3 scenes from 3 different families** — scene 2 (B layer stack), scene 3 (A+C robot crew), scene 10 (F parity gauge) — in the Fine Print system for approval, and start the stills/Blender renders.
