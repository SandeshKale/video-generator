# Jailer 2, Hindi version: "A quarter of the shows. Six percent of the money." (Hindi avatar reel, ~52 s)

Status: **script, fact ledger, avatar prompts and caption done; no mockup or build yet.** Next gate: a 3-scene card/data mockup for approval, then clips from the creator, then the build. Facts read 16 Oct 2026; re-verify numbers the day of posting (trackers revise).

## Why this reel
- **Picked from data (rule: pick from real performance):** Google Trends India 16 Oct: Jailer 2 ≈ 74 (24 h average, 0–100, relative to four other titles) vs Drishyam 3 ≈ 6.5; the only clear breakout in the one comparison that ran (Google blocked further calls). Daily-trends RSS had almost no entertainment, so the audience searches by title. See `../reel-hanuman-ansh-two-crore/topic.md` and `alt-jailer2-screen-war.md` for the other candidates.
- **Own account:** `insights/report.md` (fetched 12 Oct, 4 days old): median 185 views, best reel 610 views (3.3×, a tech reel). Entertainment has no history (Ramayana review unposted), so this is a test; re-run the report 48 h after posting.
- **Masses and classes:** masses get "Rajini's film, Hindi, where do I watch it"; classes get the show-count vs money gap. The conclusion is left for the viewer to draw.

## Benchmark to beat (previous reel: `reel-ramayana-trailer-review`, "decent output")
Its ceiling: card-style annotated stills, small borderless avatar, ambient scan band, 11 scenes timed to words. Its weaknesses (user): overlapping components, typos, motion not tasteful enough, named people without pictures, sparse scene starts. This reel must do better on all five and add:
1. **A bespoke data object per scene (no still-with-caption scenes):** 100-dot show grid → coin stacks → per-show towers → 10× bars, built from the real numbers.
2. **New technique:** dots become coins (FLIP): the 100-show grid's Hindi dots fly into a money bar so show share and money share are the same objects on screen; towers grow from the coins.
3. **Lint before render:** a new `check.mjs` with bounding-box overlap tests for every text/label/card at entrance +0.7 s, mid and end (all scenes), a safe-zone test, and a spell-check pass over all on-screen strings; no scene start sparser than 0.3 s (key object arrives within the crossfade).
4. **Tasteful motion plan:** each scene has one signature move (ticket tear, dot-to-coin flight, tower growth with overshoot, stamp slam, odometer), staggered entrances, ambient layers kept subtle; match-cut: the coin bar of scene 4 is the base of scene 5's towers.
5. **Named things get a visual at their word:** film name = official poster if the creator supplies it (else typographic title card); chains named = text chips (no logos in the library; nominative text only); no real person is named in the voice, so no likeness is needed (and none is generated).

## Fact ledger (tier B = trade tracker or press; nothing here is primary data)
| # | Fact | Source | Tier | Note |
|---|---|---|---|---|
| 1 | Jailer 2 opened 15 Oct 2026 | Bollywood Hungama, The Week | B | |
| 2 | Day 1 India: net ₹59.70 cr, gross ₹70.25 cr; overseas ₹55 cr; worldwide ₹125.25 cr; **16,599 shows** | The Week 16 Oct, citing Sacnilk | B | Early-evening live figure was ₹45.40 cr net / 14,469 shows (ETV Bharat, 15 Oct): trackers revise; use the final, call it "tracker figure" |
| 3 | By language (net, shows): Tamil ₹43.35 cr, 9,326 · Telugu ₹12.50 cr, 2,792 · **Hindi ₹3.50 cr, 4,371** · Kannada ₹35 lakh, 110 | same | B | sums to ₹59.70 cr and 16,599 |
| 4 | Original Jailer (2023) day 1 Hindi ₹35 lakh (7,461 total shows) | same | B | Hindi 3.50 cr ÷ 35 lakh = **10×** (exact) |
| 5 | Hindi version not released in PVR INOX / Cinepolis / Miraj; reportedly because of a planned OTT window ~4 weeks after release; fewer screens, lower average ticket price | Bollywood Hungama 14 Oct | B | "Reports suggest": say "reported". The Week 16 Oct: disagreements over digital windows with chains "may have limited" the opening |
| 6 | Advance: Hindi 39,485 tickets for 15 Oct; India ~18 lakh day-1 tickets (₹37 cr) | BH, ETV Bharat | B | not used in the voice |
| **D1** | Hindi share of shows 4,371 / 16,599 = **26.3%** ("1 in 4") | my arithmetic | C | |
| **D2** | Hindi share of net 3.50 / 59.70 = **5.9%** ("6%") | my arithmetic | C | |
| **D3** | Net per show: Tamil ≈ ₹46,500 · Telugu ≈ ₹44,800 · Kannada ≈ ₹31,800 · **Hindi ≈ ₹8,000** · all ≈ ₹36,000 | my arithmetic | C | Hindi ≈ 17% of Tamil. Label "MY ARITHMETIC FROM TRACKER FIGURES". Shows ≠ seats: bigger rooms and higher prices raise per-show money |
Cautions: do not claim why Hindi per-show is low as fact (small screens, lower prices, show timings are reported or likely, not proven); do not name or mock any person; religion/politics not involved; do not mix with the Malayalam or Hindi Drishyam titles; if the Drishyam week-3 show demand (BH 14 Oct) is mentioned, say "wanted" and note the outcome is unknown.

## Hindi voice-over (four 15 s avatar parts, 26–32 words each, finish by ~12.5 s)
1. "रुकिए! जेलर टू पहले ही दिन छा गया। पर हिंदी वर्ज़न बड़ी मल्टीप्लेक्स चेन में नहीं है। फिर भी उसने साढ़े तीन करोड़ कमाए। ये कैसे हुआ?"
2. "पहले आँकड़े देखिए। ट्रैकर के मुताबिक़ पहले दिन लगभग सोलह हज़ार छह सौ शो चले। हिंदी के थे चार हज़ार तीन सौ से ज़्यादा, यानी हर चार में एक।"
3. "लेकिन कमाई देखिए। हिंदी का हिस्सा शोज़ में चौथाई था, कमाई में सिर्फ़ छह प्रतिशत। एक शो की औसत कमाई तमिल में छियालीस हज़ार, हिंदी में आठ हज़ार रुपये। ये मेरा हिसाब है।"
4. "वजह शायद कम स्क्रीन और सस्ते टिकट हैं। फिर भी हिंदी ओपनिंग पहले जेलर से दस गुना रही। आपके शहर में कहाँ चल रहा है? कमेंट करिए, और फ़ॉलो करिए।"
Why this reads logically: claim (Hindi did well without the big chains) → evidence 1 (a quarter of the shows) → evidence 2 (a sixth of the money per show) → possible reasons + the 10× fact + the viewer's question. Concrete numbers, one idea per sentence, short sentences; the derived numbers are said as "मेरा हिसाब". "10×" is the real Hindi ratio vs the 2023 film (₹35 lakh → ₹3.50 cr), not a claim about quality.
English captions (subtitles, on screen): (P1) "Hold on! Jailer 2 took off on day one." "But the Hindi version isn't in the big multiplex chains." "Still, it earned ₹3.5 crore." "How?" (P2) "First, the numbers." "Per the tracker, about 16,600 shows ran on day one." "Over 4,300 were Hindi: one in every four." (P3) "Now look at the money." "Hindi was a quarter of the shows, but only 6% of the earnings." "Average per show: about ₹46,000 in Tamil, ₹8,000 in Hindi." "That's my arithmetic." (P4) "Likely reasons: fewer screens and cheaper tickets." "Still, the Hindi opening was 10× the first Jailer's." "Where is it playing in your city?" "Comment, and follow."

## Screenplay (timings come from `avatar/words.json`; scene starts land on the cue words)
| # | Voice cue | On screen (English, proofread) | Primary visual family | Signature move |
|---|---|---|---|---|
| 1 | "रुकिए… छा गया" | Eyebrow `// JAILER 2 · HINDI DAY 1`; headline "Hindi Jailer 2: **₹3.50 cr**"; ticket stub with perforation | **Kinetic type + CSS-3D ticket (or Blender render)**; poster if supplied | ticket tears along the perforation, counter 0→3.50 |
| 2 | "बड़ी मल्टीप्लेक्स चेन में नहीं" | Chips PVR INOX · CINEPOLIS · MIRAJ with "NO HINDI VERSION (REPORTED)"; "39,485 Hindi tickets sold in advance for day 1" (BH) | **rough.js strokes + Phosphor icons** | chips get hand-drawn strikes, a ticket count ticks up |
| 3 | "सोलह हज़ार छह सौ … हर चार में एक" | 100-dot grid: 26 pink Hindi, 74 others; "16,599 shows · 4,371 Hindi" | **Bespoke SVG data mosaic** | dots fill row by row; Hindi dots pulse |
| 4 | "कमाई … सिर्फ़ छह प्रतिशत" | Dots fly to a ₹100 bar: Hindi gets 6 | **FLIP dots→coins money bar** | dot-to-coin flight; bar splits 94 / 6 |
| 5 | "एक शो की औसत कमाई" | Towers: Tamil ₹46k · Telugu ₹45k · Kannada ₹32k · Hindi ₹8k; tag "MY ARITHMETIC FROM TRACKER FIGURES" | **Bespoke SVG towers (coin stacks) + odometer counters** | towers grow with overshoot; bar of scene 4 becomes the base |
| 6 | "वजह शायद कम स्क्रीन…" | Three chips: FEWER SCREENS · LOWER TICKET PRICE · OTT WINDOW ~4 WEEKS (all "REPORTED") | **Phosphor icons + real-footage dust overlay** | chips drop in staggered |
| 7 | "दस गुना" | Bars: 2023 Hindi ₹35 lakh vs 2026 ₹3.50 cr; stamp "10×" | **Bespoke bars + stamp** | stamp slams with screen shake (small) |
| 8 | "कहाँ चल रहा है? … फ़ॉलो" | "Where is it playing near you?"; profile ring + @sandesh_explains; COMMENT YOUR CITY; FOLLOW | **Branded CTA + avatar tile** | typed city names loop in the comment box |
Families used: kinetic type/ticker, CSS-3D (or Blender) ticket, rough.js, Phosphor icons, bespoke SVG data, FLIP coins, real-footage overlay, poster/title card, avatar host, synth score + CC0 UI SFX = **10 (≥ 5)**. Max any family in ≤ 4 scenes (bespoke SVG used in 3–5, 7). Avatar small and borderless bottom-right, English caption beside it (the Ramayana layout), content ≤ y 1210.

## Visual identity (new; not Film Leader, not any earlier reel)
"Matinee Ticket Roll": oxblood-black `#1a0c10` ground with a faint perforated-roll texture and a slow ticket-number drift; cream paper `#f3e9d2`; **meaning-coded:** Hindi = hot pink `#ff3d7f`, Tamil = aqua `#2ee6d6`, Telugu = lavender `#a58bff`, Kannada = lime `#c6f432`, money = cream. Fonts: Archivo Black (headlines) + Martian Mono (labels/tickets) + Inter (captions). Component language: ticket stubs with notched edges and tear lines (not rounded cards or clip-corner panels).

## Performance track (R10)
| Part | Beat | Brow | Head | Gaze |
|---|---|---|---|---|
| 1 | "रुकिए!" 0–3 s | lift | lean-in | lens |
| 1 | "हिंदी वर्ज़न … नहीं है" | slight inner raise | still | lens |
| 1 | "ये कैसे हुआ?" | raise | lean-in | lens |
| 2 | "आँकड़े" | easy | still | lens |
| 2 | "हर चार में एक" | still | nod | lens |
| 3 | "सिर्फ़ छह प्रतिशत" | slight raise | one-point gesture | lens |
| 3 | "मेरा हिसाब" | soft | faint smile | lens |
| 4 | "शायद" | slight raise | nod | lens |
| 4 | "दस गुना" | lift | still | lens |
| 4 | CTA | warm | nod | lens, dead-on |

## QA checklist for the build (from the Ramayana feedback)
1. Overlap: every scene sampled at entrance +0.7 s, mid, end−0.4 s, bounding boxes of all text/labels/cards must not intersect (except named deliberate overlays); phone-size contact sheet.
2. Typos: print every on-screen string and caption line to `copy.txt`, run a spell/number check against the ledger (16,599 · 4,371 · 59.70 · 3.50 · 46,483 · 8,007 · 26.3% · 5.9%), read it once end to end.
3. Motion: one signature move per scene (table), eased only, no scene start sparser than 0.3 s.
4. Named things: poster/title card at "जेलर टू"; chain names as text chips; no person named, no likeness.
5. `change-cadence` 0 stretches; ambient motion first.
6. Voice flow (clips): complete sentences, ends by ~13 s, Hindi pronounced as in the table; Whisper check, hand-fix `words.json`.

## Open items
Mockup approval (3 scenes from 3 families); the creator to supply the official Jailer 2 poster if wanted (credit: Sun Pictures); confirm the multiplex status and numbers the morning of posting; avatar clips (Part 1 first).
