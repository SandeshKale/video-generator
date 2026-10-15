# Reel script — "722 math papers, one prompt, three withdrawn" (~65 s, 9 scenes, ~200 words)

**Why this topic (researched Oct 9, 2026):** the freshest story that is both a wow-number *and* has a twist. Oct 6 OpenAI posts 722 AI-written math manuscripts (unreleased model, "one prompt, one agent"); Oct 7 it withdraws three over a sign error; mathematicians split on process. It is the most-shared AI item of the week after the Ben Affleck clip, hasn't been covered in this repo, and it avoids a repeat of the "agents escaped" angle (Wikimedia "rogue agents" was the runner-up; Arizona AI-victim-video ruling third, too sensitive).

## Narration (Kokoro am_adam, base 1.1, no filler clips)
1. **Hook (0–3.2 s)** OpenAI dropped 722 math papers. One day later, three vanished.
2. On October sixth, they landed on GitHub, written by a model OpenAI hasn't released. About four thousand problems went in. Seven hundred twenty-two manuscripts came out.
3. OpenAI says almost every one came from a single prompt, handed to a single AI agent. About three hours of thinking each.
4. The claims are huge. Progress on the Hodge conjecture. A zero-free region for the Riemann zeta function. Problems mathematicians have chased for decades.
5. But checking is the bottleneck. Only some come with computer-verified proofs, and an OpenAI spokesperson said roughly half were released unconfirmed.
6. Then came a sign error. A plus that should've been a minus. One argument collapsed, and two papers built on it fell too. Three withdrawn. Fourteen more revised.
7. Cornell's Alex Townsend expects more errors. MIT's Andrew Sutherland called the fast fix responsible, but says single-agent claims stay unverified until others can replicate them.
8. And the model is still locked away. An advisory group at the Institute for Advanced Study asked labs to publish prompts and compute. OpenAI told Scientific American it isn't bound by that.
9. So is this the start of AI doing real math, or a very fast way to make mistakes? Tell me below. Follow for the next AI story.

## Fact tiers (A = multi-outlet, B = single outlet / OpenAI's own claim, C = don't say)
| Claim | Tier | Source |
|---|---|---|
| 722 manuscripts, public GitHub repo `openai/math`, Oct 6, apache-2.0 | A | The Next Web, SiliconANGLE, Retraction Watch |
| Grouped in 372 families of results (so 722 ≠ 722 solved problems) | A | TNW, Retraction Watch |
| ~4,000 problems attempted; ~3 h ChatGPT Pro thinking per result (average) | A (OpenAI figures) | TNW, SiliconANGLE |
| Almost every result from one prompt to one agent (some may have taken several tries) | B — OpenAI spokesperson via Scientific American; say "OpenAI says" | SciAm, aiweekly |
| Model unreleased; same model as the Sept Navier–Stokes claim | A | TNW |
| Claims: Hodge conjecture for CM abelian varieties; zero-free region for Riemann zeta | A (claims, not verified) | TNW |
| Roughly 50% released unconfirmed (OpenAI spokesperson) | A | Retraction Watch |
| Only 162 of 722 have a computer-checked main result | **B → not in script** (single source) | cellcog / repo catalog |
| Oct 7: 3 manuscripts withdrawn (sign error; one argument + construction used by two dependents), 14 revised | A | Retraction Watch, aiweekly |
| Found in OpenAI's own internal audit; announced by research lead Dan Roberts on X | A | Retraction Watch |
| Townsend (Cornell): "not surprising", expects more errors | A | Retraction Watch |
| Sutherland (MIT): quick response "the responsible thing to do"; single-agent claims unverified until replicated | A | Retraction Watch, SciAm |
| AGMAI (IAS-hosted) Sept 29 guidelines: publish prompts, time, compute | A | TNW |
| OpenAI "is not bound by these recommendations" (to SciAm) | B — attribute to SciAm | SciAm excerpt |

**Do NOT say:** that OpenAI "solved" the Hodge conjecture or Riemann hypothesis (they are *claims*, unreviewed); "722 problems solved"; "peer-reviewed"; that mathematicians found the sign error (OpenAI says internal audit); that the withdrawn papers were the Hodge/zeta headline results; the 25-Fields-Medalists declaration, the Buckmaster/Anthropic attribution dispute and "719 papers left" (single sources); any claim that the Wikimedia/"escaped agents" stories are related. Show no real person's face; the two mathematicians are generic chalk silhouettes with university names only.

## Visual system proposal — "Chalkboard Lab" (new; not slate/yellow, not terminal, not lamp)
- **Palette:** deep board green-black `#101c18`, chalk white `#eef2e6`, chalk yellow `#ffd84a`, coral red-pen `#ff6b5b`, aqua `#5fe3d0`. Dark, so it compresses small (~15 MB).
- **Texture/motion:** board with faint eraser smudges and a slowly drifting chalk-dust field; every line is *drawn* (stroke-dashoffset by `t`) with a deterministic hand-wobble (pre-baked offsets, not live noise); scene change = an eraser block sweeping across (0.25 s, leaves smudge), not a crossfade.
- **Components:** chalk-outline frames, taped paper sheets, red-pen circles/strike-throughs, rubber stamps; **fonts** Bricolage Grotesque 800 (headlines) + Inter + Space Mono.
- **Characters:** a chalk-drawn little lab robot ("the agent") and two generic chalk mathematician silhouettes — new art, not the mocap rig, not humaaans.

## Animation spec (motion-first, every scene has independently moving parts)
1. **Paper avalanche** — sheets rain from the top into a heap in a GitHub-ish crate; three sheets peel off right with red WITHDRAWN stamps at "vanished" (payoff ~2.6 s). Frame 0 already mid-fall, headline "722 PAPERS / 3 GONE" composed.
2. **The machine** — 4,000 chalk dots stream into a desk-sized robot; most bounce off a filter bar, 722 sheets slide out and stack; a counter ticks only as a small readout, the stacks are the visual.
3. **One prompt** — a single blinking prompt box → one agent → a conveyor of papers; a clock face spins 3 h per sheet, each sheet gets a taped stamp.
4. **The big claims** — a Riemann-zeta ripple/zero-line drawn live on one board half, a K3-surface blob morphing on the other, each tagged "CLAIMED"; decades-timeline ticks scroll underneath.
5. **The checking bottleneck** — a wall of paper cells; a green "Lean-checked" sweep lights only some; the rest stay chalk-grey, a half/half divider wipes in at "roughly half".
6. **The sign error** — a three-paper domino chain; a "+" glyph flips to "−" under a red-pen circle; dominoes topple; three stamps; 14 pages get red-pen edits fluttering in.
7. **The reaction** — two chalk silhouettes at boards with speech bubbles typed in chalk; tiny "?" particles float up at "unverified".
8. **The locked model** — the robot in a padlocked glass cabinet; a three-item checklist (PROMPTS · TIME · COMPUTE) shown as requested; a "NOT BOUND" stamp lands on it.
9. **CTA** — two-sided seesaw "REAL MATH ↔ FAST MISTAKES" tilting; profile photo (≥200 px), @sandesh.explains, FOLLOW, held ≥3 s.

## Eyebrows (content-specific, not beat labels)
`// 722 MANUSCRIPTS, 372 FAMILIES` · `// 4,000 IN, 722 OUT` · `// ONE PROMPT, ONE AGENT` · `// CLAIMED, NOT CONFIRMED` · `// ROUGHLY HALF UNCONFIRMED` · `// A + THAT WAS A −` · `// "UNVERIFIED UNTIL REPLICATED"` · `// PROMPTS, TIME, COMPUTE` · `// MATH OR MISTAKES?`

## Retention plan
Payoff (stamps on three sheets) by 2.6 s; no scene cut before 3.1 s; a new stamp/flip/domino lands every ~4 s; the reveal of the sign error at ~42 s is the mid-video twist; captions word-highlighted; ≤2 caption lines.

## Compliance
Caption states "illustration, not OpenAI's papers"; sources: Retraction Watch (Oct 8), The Next Web (Oct 7), Scientific American (Oct 7, via excerpts), AI Weekly. Not the user's maker involved — no disclosure needed; keep "claims / says" language throughout.

## Hook alternatives
A) "OpenAI dropped 722 math papers. One day later, three vanished." (chosen) B) "One prompt. 722 math papers. Then the retractions started." C) "A plus sign that should've been a minus just sank three AI math papers."
