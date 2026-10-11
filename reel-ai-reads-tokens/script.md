# "AI can't read." — script + screenplay (explainer/hack reel, ~66 s, 5 avatar parts)

**Logline:** "ChatGPT has never read a single word you've typed!" (said with real energy in the first 3 s), then "To AI, my name isn't Sandesh. It's Sand… esh." AI has never seen a single word you've typed: it sees **tokens**. That one idea explains:
- the strawberry failure;
- why "I love you" costs more in Hindi;
- why AI is priced and "remembers" in tokens;
- how it writes, one token at a time. Then the twist: when researchers looked inside, **it had picked the rhyme before writing the line.**

It ends with a hack anyone can do in 10 seconds: type your name into OpenAI's free tokenizer and comment how many pieces you are.

**Format:** *mind-blowing explainer with a hands-on hack.* Universal and evergreen. The numbers are **measured first-hand** (`research/measure.py`), so anyone can reproduce them.
**Viral mechanics:**
- an enthusiastic, surprising claim in the first 3 seconds ("ChatGPT has never read a single word you've typed!"), paid off on screen by the typed words shattering into tokens;
- the name split right after it;
- a personal, comparable result ("I'm two, what are you?") that people post in the comments;
- an India-first romantic stat ("I love you" 3 vs 6 vs 24);
- a share-worthy "wait, it plans ahead?" twist;
- a save-worthy recap.

**Voice:** the creator's avatar, 5 clips ≤ 15 s, in the subtle prompt style, with one creative beat: the name split on "Sand… esh" (repeated as a callback, "I'm two", at the end).

## Benchmark to beat (standing rule)
Previous ceiling: `reel-ai-offline-laptop` ("Wi-Fi off. AI on.", 73 s, 11 families). It had a split-flap step board, a streaming terminal, memory bins with depth-occluded robots, Blender lid/plug frame sequences, and a recap card. Its **weaknesses**:
- the host was a side window and never part of the gag;
- the S4 lower third and the narrow S9 host left empty-looking frames;
- the terminal output was only illustrative;
- the ~360 px contact-sheet pass was skipped;
- the mix was never auditioned.

This reel does what none did before:
1. **Real tokenized captions (new technique).** Every caption is split at its *actual* `o200k` token boundaries (computed offline from the voice transcript with tiktoken). Each token gets a pastel highlight, like a tokenizer view. The whole reel is quietly demonstrating its own thesis.
2. **One SFX per token.** A soft letterpress "clack" fires on each token boundary in the hero captions and tokenizer panels. It's driven from the same token list, so sound and picture can't drift.
3. **The host is the gag.** It opens with an energetic claim, "ChatGPT has never read a single word you've typed!", paid off on screen as the viewer's own typed message shatters into tokens and then numbers. His name is then split by the avatar's delivery ("Sand… esh") and by a Blender letterpress block that cracks into SAND | ESH. The CTA closes the loop with "I'm two".
4. **A token race (mocap):** two CMU-mocap runners cross the same sentence on stepping stones, one stone per token. The English runner takes 16 steps, the Hindi runner 30, and a faint ghost runner on the old tokenizer takes 91. The same figures then feed a "memory jar" (context window) that fills faster.
5. **An "X-ray" of a model writing a couplet:** line 1 types out; a feature lamp labelled "rabbit" lights up *before* line 2 starts; line 2 then lands on "rabbit". A small toggle shows the paper's interventions (suppress → "habit", inject → "green").
6. **Blender letterpress objects:** a SANDESH type block that splits, an opaque " strawberry" metal sort whose letters are hidden inside (an X-ray shows them blurred), and a probability roulette of next-token sorts whose spin follows `t`.
7. **QA carried over:**
   - occupancy ≥ 65 %;
   - 2 render slices at a time;
   - contact sheets at full size **and ~360 px**;
   - voice/music spectral check;
   - a host-crop frame-diff on the final MP4;
   - a **caption-token check** (the captions' token splits must equal tiktoken's output for each line).

## Voice-over in five avatar parts (≤ 15 s each; 144 words in total)
**Part 1 (28 words; the first ~3 s are the enthusiastic hook line)** — *scenes 1–3*
"ChatGPT has never read a single word you've typed! Not one. To AI, my name isn't Sandesh. It's Sand… esh. Two pieces. Here's what it actually sees."
**Part 2 (28 words)** — *scenes 4–5*
"Tokens. Little chunks of text, turned into numbers. In a sentence, 'strawberry' is one single token. That's why AI famously miscounted its R's. It never saw the letters."
**Part 3 (29 words)** — *scenes 6–7*
"Now the wild part. 'I love you' is three tokens. In Hindi, it's six. On an older model, twenty-four. And AI is priced in tokens, and remembers in tokens."
**Part 4 (33 words)** — *scenes 8–9*
"Then it writes one token at a time, picking a likely next piece. Just autocomplete? Not quite. When Anthropic looked inside a Claude model, it had picked the rhyme before writing the line."
**Part 5 (25 words)** — *scenes 10–11*
"So try this. Search 'OpenAI tokenizer', type your name, and comment how many pieces you are. I'm two. Save this, and follow for more."

## Performance track (standing host rule; gaze always on the lens)
| Part · sentence | Emotion | Brow | Head | Blink | Notes |
|---|---|---|---|---|---|
| P1 "ChatGPT has never read a single word you've typed! Not one." (0–3 s) | **enthusiastic and engaging**: bright, a confident open smile, a bit more vocal energy and pace, like sharing an amazing discovery | lively but natural lift on "never" | small lean-in | none (first second) | Energy without shouting or wide-eyed acting; eyes locked on the lens. |
| P1 "To AI, my name isn't Sandesh. It's Sand… esh." | settles into a playful deadpan | tiny lift on "esh" | still | after "Not one." | ~0.4 s closed-mouth gap between "Sand" and "esh"; a faint smile after. |
| P1 "Two pieces. Here's what it actually sees." | amused, intriguing | — | one small nod on "Two pieces" | — | |
| P2 "Tokens. Little chunks of text…" | clear, explaining | neutral | still | sentence break | Dry facts mean stillness. |
| P2 "…miscounted its R's. It never saw the letters." | light, a touch wry | slight lift on "never saw" | one small nod | after "R's." | |
| P3 "Now the wild part." | leaning into a surprise | slight lift | slight lean-in | — | |
| P3 "'I love you' is three tokens. In Hindi, it's six…" | warm, a faint smile | — | still | — | Keep it light, not romantic acting. |
| P3 "And AI is priced in tokens, and remembers in tokens." | steady, informative | — | one small nod on "remembers" | sentence break | |
| P4 "Then it writes one token at a time…" | calm, explaining | neutral | still | — | |
| P4 "Just autocomplete? Not quite." | a genuine question, then a knowing half-smile | slight lift on the question | — | after "quite." | |
| P4 "…it had picked the rhyme before writing the line." | quietly amazed | slight lift on "before" | slight lean-in | — | The "mind-blown" beat, kept small. |
| P5 "So try this… comment how many pieces you are." | friendly, inviting | relaxed | — | sentence break | |
| P5 "I'm two." | dry, playful callback | — | tiny tilt | — | |
| P5 "Save this, and follow for more." | warm, easy | relaxed | small lean-in on "follow" | — | Dead-on camera. |

## Screenplay
Family codes: A photoreal AI still + depth parallax · B Blender 3D · C mocap rig · D humaaans · E logos/icons · F bespoke SVG/DOM objects · G kinetic type · H real-footage overlays · I real Unsplash photo · J avatar host · K audio. Times are estimates (≈ 2.2 words/s) and are retimed from the clips.

| # | Part · time | Primary visual | Layers (all pure functions of `t`, keyed to words/tokens) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | P1 0–3.0 | **The host big and energetic**, frame 0 fully composed (captions at t = 0) | A chat box below the host already holds a typed message ("explain my phone bill"). On "never read" it **cracks into pastel token chips**, and on "Not one" each chip flips to its **number** (real token IDs). Token-coloured captions from frame 0. | key taps, a glass-crack clack, number ticks | NEVER READ A WORD YOU TYPED | — (hook frame) | J F G K |
| 2 | P1 3.0–7.2 | **Blender letterpress block SANDESH** cracks into two inked blocks, SAND (peach) and ESH (mint), exactly on the avatar's split | A counter clacks to "2 TOKENS"; the host moves to a corner "type case" frame; "measured with OpenAI's tokenizer, o200k" chip | 2 clacks, a press thunk | SAND · ESH = 2 TOKENS | // SAND + ESH = ME | B J F E |
| 3 | P1 7.2–14 | **Photoreal letterpress type case** (AI image, no people, labelled) with a depth-parallax push into the drawers, plus a **tokenizer strip** of real splits (ChatGPT → Chat·GPT, unbelievable → un·bel·ievable) | "You typed" words drop into the drawers and come out the other side as their real token IDs; halftone grain overlay | type rattle, a drawer ding | HERE'S WHAT IT ACTUALLY SEES | // WHAT IT ACTUALLY SEES | A F G H |
| 4 | P2 0–7.4 | **Blender opaque metal sort " strawberry"** (one block), its letters hidden inside; an X-ray sweep shows them blurred | The question "How many r's in strawberry?" as 7 colour tokens; "1 TOKEN" stamp | clack ×7, x-ray hum | TOKENS = CHUNKS → NUMBERS · STRAWBERRY = 1 TOKEN | // ONE CHUNK, NOT TEN LETTERS | B F G |
| 5 | P2 7.4–14 | **humaaans reader with a magnifier** that can't see inside the block; a "famous answer" bubble 2 vs truth 3 (TechCrunch 2024 chip) | Letters s-t-r-a-w-b-e-r-r-y appear only as *we* see them, with the R's circled | buzzer, chime | IT NEVER SAW THE LETTERS | // WHY IT MISCOUNTED THE R'S | D F G E |
| 6 | P3 0–8 | **Token race (mocap):** stepping stones, one per token. "I love you" runner: 3 hops. Hindi runner: 6 hops. Ghost runner on the older tokenizer: 24 hops. | Stones are the actual tokens (Devanagari pieces on the Hindi stones); lap counters; "own measurement" chip | step clacks at each hop | 3 · 6 · 24 TOKENS | // "I LOVE YOU" IN TOKENS | C F G |
| 7 | P3 8–14.4 | **Memory jar + price tag**: a jar labelled CONTEXT WINDOW fills with token marbles, faster for Hindi; a price tag "PER 1M TOKENS" | Chip: "up to 15× more tokens in some languages, NeurIPS 2023"; a real Unsplash photo of a desk/notebook behind (chosen at build) | marbles, register ding | PRICED IN TOKENS · REMEMBERS IN TOKENS | // WHERE TOKENS COST YOU | F I G |
| 8 | P4 0–6.5 | **Blender next-token roulette**: type sorts on a wheel spin; a sentence writes itself one token at a time as the wheel stops | Probability bars without numbers, labelled ILLUSTRATION; "1 TOKEN AT A TIME" tracker | ratchet clicks, clack per token | ONE TOKEN AT A TIME | // HOW IT WRITES | B F G K |
| 9 | P4 6.5–14.6 | **The X-ray**: the couplet "He saw a carrot and had to grab it," types out; a feature lamp **"rabbit" lights before line 2 begins**; line 2 lands "…like a starving rabbit". The toggle shows suppress → "habit", inject → "green". | humaaans poet at a desk; Anthropic wordmark on the source chip ("Anthropic research, Mar 2025 · Claude 3.5 Haiku"); a tiny footnote "their method sees only a fraction of the computation" | lamp ping, soft whoosh | IT PICKED THE RHYME FIRST | // IT PLANS AHEAD | F D E G |
| 10 | P5 0–7 | **Try-it hack**: a phone mock (generic, no OS chrome) searches "OpenAI tokenizer" and a name types in; tokens colour as they type | A real Unsplash photo of a hand/phone or desk; a comment box: "Sandesh → 2. You?" | typing, clacks | TYPE YOUR NAME · HOW MANY PIECES ARE YOU? | // TRY IT: YOUR NAME | I F E G |
| 11 | P5 7–end | **Recap card** (save-worthy, held ≥ 2.5 s): "AI READS TOKENS: 1 · not letters (strawberry = 1 token) 2 · Hindi takes more (I love you: 3 vs 6) 3 · it writes 1 token at a time, and plans ahead" | **CTA**: profile photo in a ring + @sandesh.explains + FOLLOW, and a "I'M 2 TOKENS. YOU?" sticker; held ≥ 3 s | warm chord, final press thunk | SAVE · FOLLOW · I'M 2 TOKENS | (none — CTA) | F J G K |

**Asset-mix audit:**
- **Families used: 11/11.**
- **Primary visual by scene (no two neighbours match):** J · B · A · B · D · C · F · B · F · I · F.
- **Primary counts:** F 3, B 3, J 1, A 1, D 1, C 1, I 1. All ≤ 4.
- **Families per scene:** every scene carries ≥ 3 families.
- **Separation:** the photoreal scene (3) and the photo scenes (7, 10) are separated from flat-vector scenes by a "press-plate" wipe: a slab of ink rolls across and the next scene is printed on.

## Visual identity — "Letterpress Tokenizer" (checked against every prior reel)
- **Palette (the first light palette since `reel-chatgpt-intelligent-ui`):**
  - newsprint `#f3efe4` (base);
  - press ink `#17171a`;
  - **token highlighters** in four pastels that cycle per token: peach `#ffc79a`, mint `#9be8cf`, lilac `#c4b5ff`, sky `#9fd6ff`;
  - one hot accent, **press-red `#e8432e`**, only for "wrong" answers and the stamp.
  - The pastel-cycle token colouring is the reel's signature; no earlier reel uses a multi-pastel system.
- **Texture / motion language:**
  - a faint **paper fibre + halftone ink** field;
  - **ink-roller wipes** between scenes;
  - letterpress "press" punches (a quick 1-frame squash on entrance);
  - captions that slide in **token by token** like sorts being set in a composing stick.
  No dots, belts, runways, rain or scanlines.
- **Component language:**
  - metal type sorts and type-case drawers;
  - composing-stick caption bar;
  - stepping-stone tokens;
  - the memory jar;
  - the X-ray "feature lamp" board;
  - press-proof cards with registration marks.
  No boarding passes, tickets, receipts or terminals.
- **Typography:** display **Alfa Slab One** (wood-type slab; new, vendor via `@fontsource/alfa-slab-one`), tokens and IDs in **IBM Plex Mono 600** (new), body **Inter 700**, Devanagari tokens in **Noto Sans Devanagari 700** (new, needed to render Hindi correctly); cover in **Anton** (house rule).
- **Characters:** two humaaans poses not used recently (a reader with a magnifier, a poet at a desk), with newsprint and pastel overrides. The mocap runners are ink-silhouette skins with a pastel token on the chest.
- **Cover (grid-first, ≤ 5 words):** **"AI CAN'T READ."** with a hero of the SANDESH type block split into SAND | ESH; newsprint with an ink title block and a pastel token highlight under "READ"; face chip bottom-right.

## Audio plan
- **Cue 1 (P1), playful:** a pizzicato-and-typewriter groove.
- **Cue 2 (P2), curious:** plucked minor.
- **Cue 3 (P3), bright race:** marimba runs locked to the runners' hops.
- **Cue 4 (P4), wonder:** a soft pad that swells exactly when the "rabbit" lamp lights *before* line 2.
- **Cue 5 (P5), warm resolve:** under the hack and the CTA.
- **SFX:** a **letterpress clack on every token boundary** in hero text (rate-limited to ≥ 70 ms apart so it never machine-guns), ink-roller swish on wipes, the press thunk on stamps.
- **Mix:** voice 16–20 dB over music, −14 LUFS, plus the spectral voice/music check.

## Risks and fallbacks
- **The 0–3 s energy** is the one place the prompt asks for more than "subtle": if it tips into over-acting (wide eyes, head bobbing), regenerate Part 1 only.
- **"Sand… esh"** might come out as a glitch rather than a deliberate pause. If so, I'll take the clean "Sandesh" and build the split in the edit (a 0.4 s freeze-hold on a closed-mouth frame). The prompt asks for a natural pause.
- **Tokenizer model:** what's measured is the public `o200k_base` (GPT-4o family / gpt-oss) and `cl100k_base` (GPT-4 era). Newer, unpublished tokenizers may split differently, so the screen always names the tokenizer and the voice says "AI", not "ChatGPT", for the measured facts.
- **Strawberry:** we say AI *famously miscounted* (past tense), not that it still does.
- **Probability bars:** no real logits are available offline, so the bars are labelled ILLUSTRATION with no numbers.
- **Disclosure:** the rhyme result is Anthropic research about Claude, and this script was drafted with Claude; the caption says so.
