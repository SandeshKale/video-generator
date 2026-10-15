# "Claude just moved into your Google Sheets." (tutorial reel, cloned voice, no avatar, ~38 s)

**Genre:** tutorial / how-to (standing rule).
**Promise to the viewer:** three steps to put Claude inside Google Sheets (and Docs and Slides), plus one prompt you can copy.

## Why this reel (standing rule: decided from `insights/report.md`, Grok pull of 12 Oct 2026)
The data covers 21 reels and 6 followers, so it gives hints, not proof.
- **The problem is the first 3 seconds and the length, not the topic.**
  - Skip rates run from 59% to 87%, so the 3-second hold is 13–41%.
  - Average watch is 3.2–7.5 s on reels of 50–96 s.
  - Saves and shares are about 0 per reel, so no topic signal exists yet.
  - **This reel is ≤ 40 s and its payoff is on screen from frame 0.**
- **Almost all views come from strangers.** 3,672 of 3,839 views in 30 days came from non-followers (`audience.json`). Each reel is a cold test, and only the opening earns more distribution.
- **Best reel: report row 1,** "Agents made writing code the cheap part" (22 Sep).
  - 610 views (3.3× median), the lowest skip rate (59%) and the longest average watch (7.5 s).
  - It opens on a blunt, declarative claim, not a news setup. **This reel copies that hook shape:** a one-sentence claim, spoken from 0.0 s.
- **Bottom 3 reels: rows 19–21** (13–15 views).
  - Two of them open on a long setup sentence ("Over 310,000 people did the exact same thing this month…", "OpenAI's own AI agents broke out of their test environment…").
  - **This reel avoids that:** its hook line is 7 words.
- **`trends.md` #3:** "Claude now works inside Google Docs, Sheets and Slides" (6 Oct).
  - The @claudeai post had ~13.2M impressions, the highest-reach official AI post in the 7-day scan. Type: tutorial.
  - This audience already uses Sheets.
- **`trends.md` creator scan:** 4 of the top 5 AI reels this month are practical Claude/ChatGPT tips (333K–500K views each). This reel is the same kind of practical tip.
- **Re-check:** run `report` again 48 h after this reel goes live, and compare its skip rate with the 0.59–0.87 band.

## Facts (tier A: read first-hand on 12 Oct 2026)
**Source:** Claude, "Claude now works in Google Docs, Sheets and Slides" (claude.com/resources/articles/claude-now-works-in-google-docs-sheets-and-slides, dated 6 Oct 2026).
1. **Name and availability:** the add-on is "Claude for Google Workspace". It is "in public beta on all paid Claude plans".
2. **Install** from the **Google Workspace Marketplace**.
3. **Menu path:** "open a file and go to **Extensions > Claude > Open Claude**."
4. **Sheets:** "Claude can write formulas, build pivot tables and native Sheets charts, and add new tabs."
5. **Python:** "For joins or data cleaning, it can pull a range into Python and write the results back into the sheet."
6. **Docs:** "Claude can fix a sentence or restyle a heading in place without touching the surrounding formatting." Larger rewrites come as suggestion cards you apply or dismiss.
7. **Slides:** "Claude can build new slides from your deck's layouts and themes, so they match the rest of the deck." It also checks for overlapping or off-slide elements and hard-to-read text.
8. **Edit modes:**
   - **"Ask before edits"** is the default: "each change appears as an approval card with a summary and Claude waits for your approval".
   - **"Accept all edits"** applies changes without stopping.
9. **Access:** Claude's access to files follows your existing Google sharing permissions.
10. **Admins:**
    - On Team and Enterprise, an owner or primary owner must enable the Docs/Sheets/Slides **connectors** first.
    - Admins can deploy the add-on to a domain or to selected groups from the Google Admin console.
    - **The article does not say whether the add-on itself needs admin approval.**

**Don't say (C):**
- that it works on free plans;
- that it works on mobile or in Excel;
- a setup time ("in 30 seconds");
- that it *never* edits without asking. "Accept all edits" exists, so say **"by default"**;
- that a work account definitely needs an admin. Say **"may need your admin's okay"**;
- that it is out of beta.

**Creator check:** please confirm in your own Google account that the menu reads **Extensions → Claude → Open Claude**, and that "Ask before edits" is the default.

## Benchmark to beat: `reel-morning-brief` (Dawn Edition, 63 s)
**Its weaknesses:**
1. 63 s is far past the 3–7.5 s that viewers actually watch. The payoff landed at 2.6 s, but the reel kept asking for another minute.
2. The two full-bleed image scenes fell below 65% occupancy.
3. The step scenes were all "instruction card + metaphor object beside it", so the steps looked alike.
4. The cut grammar (a sunrise wipe) needed a fix because it overprinted both scenes.
5. Its generated image needed hand-painting (the laptop screen came back open and lit).

**This reel does what none did before:**
1. **The first reel built to the data:** ≤ 40 s, a 7-word hook, payoff by 2.0 s, and no cut before 2.8 s.
2. **A cells-to-chart morph (new technique).** The same DOM cells physically become the chart: each total cell flies (FLIP, a pure function of `t`) to become the top of a bar, and the bar grows under it. The hook's chart is literally made out of the data, not swapped in.
3. **A Blender 3D spreadsheet board (new 3D object).** An extruded grid of tiles, rendered as a 24-frame sequence scrubbed by `t`. Messy tiles (tilted, wrong heights, tomato-red) settle into a flat, clean grid, then three columns rise into a 3D bar chart. It's used once in the hook and again, reversed, for the "Python" beat.
4. **The approval card as a physical object:** a card slides out with a summary, the cursor taps **Approve**, and only then do the cells change. The "by default it asks" fact is shown happening, not just said.
5. **Hand-drawn layer (first use in a reel):** rough.js marker underlines that draw themselves under each clause of the prompt, plus naive-icons (coloured hand-drawn icons). The colleague is a humaaans sitting pose never used before (sitting-1), recoloured to the palette, at a desk with a laptop that shows the results.
6. **Grid-snap cuts (new transition grammar).** The outgoing scene breaks into 6×10 cell tiles that flip away in a diagonal wave, revealing the next scene under them. Both scenes are opaque, so nothing overprints. Each cut takes 0.30 s.

## Voice-over (the creator's cloned voice: Qwen3-TTS ICL, morning-brief setup; 10 lines, 110 words, ~39 s at ~2.8 words/s)
1. (hook, a touch faster, said like a discovery) "Claude just moved into your Google Sheets."
2. "Messy data in. Clean table, pivot, and a chart out."
3. "Step one. Get Claude from the Google Workspace Marketplace."
4. "Step two. Open a sheet, then Extensions, Claude, Open Claude."
5. "Step three. Ask it like a colleague: clean this up, total sales by month, and chart it."
6. "Messy joins? It pulls the range into Python and writes the result back."
7. "By default, it asks before every edit, so nothing changes behind your back."
8. "It works in Docs and Slides too."
9. (slower) "The catch: it's a beta, it needs a paid plan, and work accounts may need your admin's okay."
10. (warm, direct to camera-voice) "Comment Sheets, and I'll send you the prompt."

**Claim check per line:**
- 1: facts 1–3 (once it's installed; the steps follow immediately).
- 2: fact 4 (formulas, pivot tables, charts).
- 3: fact 2.
- 4: fact 3.
- 5: facts 4–5; the prompt is our own example.
- 6: fact 5.
- 7: fact 8 ("by default").
- 8: facts 6–7.
- 9: facts 1 and 10.
- 10: creator decision (12 Oct): comment-keyword CTA; every commenter gets the prompt by DM (`dm-prompt.md`).

**Spoken forms:**
- "Python" as written.
- No URLs, and no menu arrows spoken (just commas: "Extensions, Claude, Open Claude").

**Pace:** the voice-only runtime is ~38 s, and with the edit gaps the reel should land at **≤ 40 s**. If the takes come in longer, cut line 8 into line 9's scene as an on-screen chip rather than speeding up the voice (pace rule: base ≈ 1.05–1.12, never "too fast to understand").

## The first 3 seconds (hook design)
- **0.0 s, frame 0:** a big, slightly tilted sheet fills the frame.
  - The data is visibly messy: mixed date formats, "₹1,200" next to "1200", a duplicate row, two cells flagged in tomato red.
  - A Claude side pane is already open on the right. Its prompt bubble reads "clean this up, total by month, chart it", and the approval card says "6 changes · Approve".
  - The caption "Claude just moved into your Google Sheets" is on screen. The voice starts at 0.0.
- **0.7 s:** the cursor taps **Approve**.
  - The messy cells snap clean in a diagonal ripple: dates align and the duplicate row folds away.
  - A highlighter-yellow sweep follows the ripple.
- **1.4 s:** the monthly totals appear. A formula ghost, `=SUMIFS(…)`, floats above the column for 0.5 s.
- **2.0 s:** **payoff.** The total cells fly up and become the tops of bars, and a chart builds out of them (the cells-to-chart morph).
  - A small "PIVOT ✓" tab drops onto the tab bar.
- **No cut before 2.8 s.** The open question that carries the viewer forward is: *how do I get this?*

## Screenplay
**Family codes:**
- B: Blender 3D
- D: Open Peeps (hand-drawn people)
- E: logos/icons (Google Sheets/Docs/Slides marks from simple-icons and the Anthropic mark, nominative use; Phosphor icons)
- F: bespoke SVG/DOM objects
- G: kinetic type / counters
- H: real-footage overlay
- I: real Unsplash photo
- K: audio (score + SFX + voice)

Times are estimates; everything is retimed from the voice.

| # | Time | Primary visual | Layers keyed to words | On-screen words (≤ 6 big) | Eyebrow | Families |
|---|---|---|---|---|---|---|
| 1 | 0–2.8 | **The messy sheet cleans itself and becomes a chart** (DOM sheet + side pane + approval card + cells-to-chart morph) | Approve tap 0.7 s; clean ripple; `=SUMIFS` ghost; bars from cells 2.0 s; PIVOT ✓ tab | CLAUDE IN YOUR SHEET | (hook, none) | F G K |
| 2 | 2.8–6.4 | **Blender spreadsheet board:** tomato-red messy tiles settle into a clean grid, then three columns rise into a 3D bar chart | Three stamps on their words: CLEAN TABLE · PIVOT · CHART; step tracker ①②③ drops in at the end | MESSY IN → CHART OUT | // RAW ROWS TO A REAL CHART | B G E |
| 3 | 6.4–10.2 | **Step 1, big:** a Marketplace search bar types "Claude for Google Workspace", then an install card with an **INSTALL** button that presses; the Anthropic mark and the Sheets/Docs/Slides marks sit as "works in" chips | Tracker ① lights; the exact name is held ≥ 2 s | 1 · GOOGLE WORKSPACE MARKETPLACE | // STEP 1 · INSTALL THE ADD-ON | F E G |
| 4 | 10.2–14.0 | **Step 2, big:** the menu path as a huge cascading dropdown: **Extensions ▸ Claude ▸ Open Claude**, each item lighting on its word, then the side pane slides in | Whole path held ≥ 2.5 s (screenshot-worthy) | 2 · EXTENSIONS ▸ CLAUDE ▸ OPEN CLAUDE | // STEP 2 · THE MENU PATH | F G |
| 5 | 14.0–20.0 | **Step 3:** a **colleague at a desk** (humaaans sitting-1, sunflower coat) gestures at a flat-drawn **laptop** whose screen shows the sheet and Claude's pane; the prompt types big in a speech bubble: "Clean this up, total sales by month, and chart it." | **rough.js** marker underline under each clause on its word; the laptop's cells clean up, totals fill, bars rise; result lines appear in the pane: CLEANED 214 ROWS · 12 MONTHS SUMMED · CHART ADDED (RESULTS ILLUSTRATIVE); naive-icons coffee mug | 3 · ASK LIKE A COLLEAGUE | // STEP 3 · ONE PROMPT, THREE JOBS | D E F G |
| 6 | 20.0–24.4 | **The Python beat:** two misaligned tables (ORDERS, CUSTOMERS) drawn as cell strips; a range gets lassoed, drops into a `python` code tile that types `merge(orders, customers)`, and the joined result slides back into the sheet; the Blender board plays reversed behind it, dimmed | "range → Python → back into the sheet" path arrows | JOINS? IT USES PYTHON | // TWO TABLES, ONE MERGE | F B G |
| 7 | 24.4–28.6 | **The approval card, big:** a card "3 changes: fix dates · remove 1 duplicate · add SUM row" with **Approve / Dismiss**; nothing changes until the tap, then the cells update | A small "ASK BEFORE EDITS · DEFAULT" switch label; a padlock opens on the tap | NOTHING CHANGES UNTIL YOU TAP | // YOUR OKAY FIRST | F E G |
| 8 | 28.6–30.6 | **Three app cards fan out** (Sheets, Docs, Slides marks) with one fact each: DOCS: edits in place · SLIDES: matches your theme · SHEETS: formulas, pivots, charts | Cards flip in on "Docs" and "Slides" | DOCS AND SLIDES TOO | // SAME PANE, THREE APPS | E F G |
| 9 | 30.6–35.6 | **The catch, as three red-flagged cells** in a mini sheet: BETA · PAID PLANS ONLY · WORK ACCOUNT: ASK YOUR ADMIN; film-grain texture under a dimmed backdrop | Each cell flags on its word; the score drops to a drone | THE CATCH | // BEFORE YOU INSTALL | F G H |
| 10 | 35.6–end (≥ 3 s) | **Recap card, save-worthy (≥ 2.5 s):** the 3 steps + the prompt in one cell block, laid out like a pinned sheet; then **CTA:** profile ring + @sandesh.explains + a comment bubble typing "SHEETS" + "I'll DM you the prompt" | Light leak on the CTA | COMMENT "SHEETS" → GET THE PROMPT | (none: CTA) | F G H K |

**Asset-mix audit:**
- Families used: **9** (B, D, E, F, G, H, I, K, plus the hand-drawn layer: rough.js strokes + naive-icons). The Unsplash photo (I) moves from scene 5 to scene 8 (Docs and Slides cards over a real photo).
- Primary visual by scene: F · B · F · F · D+I · F · F · E · F · F. F (the DOM sheet language) is the reel's spine, which suits a sheet tutorial, but it changes object every scene: the live sheet, a Marketplace card, a dropdown cascade, cell strips with a code tile, an approval card, the catch cells, the recap.
- **Flag:** F is primary in more than 4 scenes. It's acceptable here because each step's hero must be the literal instruction (the creator's mockup rule from the morning brief). To compensate:
  - scenes 2 (Blender) and 5 (Open Peeps over a real photo) break the run;
  - scene 6 layers Blender behind the code tile.
  Every scene has ≥ 2 families.

## Visual identity: "Cell Shock" (checked against every prior reel)
- **Palette (changed 12 Oct after a measured comparison; see "Decisions"):**
  - ground: **electric violet `#4b22c9`** with a faint white cell grid;
  - headlines: **lavender-white `#f6f1ff`** with a **sunflower `#ffc31a`** highlight word (soft dark text-shadow);
  - cards (sheet, panes, bubbles): white with **plum-black `#23142d`** ink borders;
  - **violet `#7a3cff`** stays the Claude accent *inside* white cards (selection ring, pane border);
  - **tomato `#ff5233`** (mess, errors, the catch); **sunflower** (totals, bars, highlights); **sea-teal `#11a08f`** (approved, done).
  No prior reel uses a saturated violet ground.
- **Texture / motion language:**
  - **cells, not pattern.** The background is a very faint oversized cell grid (one cell = 180 px) whose cells occasionally flash faint white as if being "computed". The flashes run on a deterministic hash of the cell and `t`.
  - Highlighter sweeps.
  No dots, scanlines, cables, paper grain or light parallelograms.
- **Component language:**
  - cells and ranges with violet selection rings and fill handles;
  - a side pane;
  - approval cards;
  - dropdown cascades;
  - tab chips at the bottom of the sheet;
  - formula ghosts.
  These are generic spreadsheet language, recreated in our own palette, not Google's UI.
- **Typography (new to reels):**
  - **Rubik 800** (display: rounded, friendly, bold at phone size);
  - **Azeret Mono** (formulas, cell refs, menu paths);
  - **Inter** (captions);
  - cover in **Anton**.
  Both new fonts to be vendored via `@fontsource` (OFL).
- **Character:** humaaans sitting-1 (never used before), recoloured: sunflower coat, plum trousers, teal seat. Open Peeps was tried in the first mockup and rejected by the creator (unrelated pose, black and white).
- **Cover (grid-first, ≤ 5 words):**
  - options: **"CLAUDE IS IN SHEETS"**, **"YOUR SHEET HAS CLAUDE"** or **"MESSY SHEET → CHART"**;
  - hero: a 3D bar chart rising out of a messy grid;
  - mint-chalk ground with a violet selection ring.

## Audio plan
- **Score:** a quick, light "office pop" cue at ~112 BPM (plucked synth, finger snaps, a marimba lead). The cue thins to a single sustained drone under the catch and resolves bright under the CTA. Cuts are beat-locked.
- **SFX** (uisfx CC0 packs first, peak-aligned):
  - a soft tap on Approve;
  - a cascading tick ripple for the clean-up;
  - a whoosh-pop as the cells fly into bars;
  - typing;
  - menu clicks;
  - a code "run" blip;
  - a padlock click;
  - a card flip;
  - three soft alert ticks on the catch.
- **Targets:**
  - voice over music + SFX: median ≥ 19 dB, min ≥ 11 dB;
  - −14.0 LUFS, ≤ −1 dBTP;
  - a mix report.

## Honesty guardrails
- Every sheet, pane, menu and card is recreated generically in our palette and labelled **ILLUSTRATIVE**. They are not screenshots of Google's or Anthropic's UI, and they don't copy Google's trade dress.
- The example data is invented and generic (e.g. "Store A, Store B", round amounts; no real names).
- The result chips (214 rows, 12 months) are illustrative and labelled as such.
- Google Sheets/Docs/Slides marks and the Anthropic mark are used nominatively, to identify the products.
- The desk is a real Unsplash photo (no tag needed, but it's credited in the caption as PHOTO · UNSPLASH).
- The caption says:
  - it's Anthropic's add-on, in beta, on paid plans;
  - approval is the default, not the only mode;
  - Team and Enterprise owners enable the connectors.

## Decisions (answered 12 Oct)
1. **CTA:** switched to **"Comment Sheets, and I'll send you the prompt."**
   - This overrides "follow for more" for this reel only.
   - The promise must be kept: every commenter gets the prompt in `dm-prompt.md`, sent by hand or through ManyChat (Meta's official API). Never use InstaPy-style automation.
   - The caption repeats the ask on its first line: "Comment SHEETS and I'll DM you the prompt 👇".
2. **Menu path confirmed** by the creator in their own account: Extensions → Claude → Open Claude.
3. **Mockup:** 3 scenes in 3 families:
   - 1: the hook sheet with the cells-to-chart morph (F);
   - 2: the Blender board (B);
   - 5: Open Peeps over the Unsplash desk (D + I).
   Plus a voice sample of lines 1–2.

## Decisions (round 2, 12 Oct)
1. **Character:** the Open Peeps figure was "completely unrelated" and black and white. It's replaced by a coloured humaaans colleague at a desk with a laptop showing the sheet and results, plus rough.js underlines and a naive-icons mug.
2. **Voice clean-up:** line 1 had a ~0.2 s sound before "Claude". `voice/clean.py` now cuts pre- and post-speech blobs and softens isolated clicks and breaths, logged in `vo/clean_report.json`. Line 1 now starts directly on "Claude" (0.47 s earlier).
3. **Board framing:** the Blender camera was pulled back (lens 43) so the whole board, all corners included, stays in frame. Frames are cropped to their shared bounding box, and the stamps now sit in a row under the board.
4. **Background palette:** compared mint, electric violet and deep plum on the hook and step frames at phone size.
   - On mint, the white sheet barely separated from the ground (≈1.1:1 luminance contrast) and the hook read washed out.
   - Violet gives ≈10:1 for the sheet and the headline and ≈7:1 for the sunflower highlight.
   - Plum muddied the sunflower flashes and is close to earlier dark reels.
   **Changed to violet.**
