# Jailer 2, Hindi version: "₹125 crore worldwide. ₹3.5 crore in Hindi. Why?" (Hindi avatar reel, 5 parts, ~65 s)

Status: **v2 (16 Oct 2026, evening): facts re-validated against five trackers, lead number changed to the worldwide opening, more dialogue (5 parts), brisker pace. No mockup or build yet.** Next gate: a 3-scene card/data mockup for approval, then clips from the creator, then the build. Facts read 16 Oct 2026; re-verify numbers the day of posting (trackers revise).

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

## Fact validation (16 Oct 2026, evening; every number cross-checked, status per claim)
Trackers disagree because they use different cut-off times, coverage and gross-vs-net; none is an audited figure and **Sun Pictures has not published an official figure that I could find**. Every number in the voice is "tracker figure"; ranges are shown so nothing is overstated.
| # | Claim | Sources read | Verdict |
|---|---|---|---|
| 1 | Opened Thu **15 Oct 2026** (Tamil, Rajinikanth, dir. Nelson Dilipkumar, Sun Pictures) | Bollywood Hungama (BH), The Week, Wikipedia | CONFIRMED |
| 2 | **Worldwide day 1 ≈ ₹125 cr** | Sacnilk via The Week ₹125.25 cr · IWMBuzz ₹127.25 cr · Pinkvilla ₹124 cr · TrackTollywood ₹130+ cr · Filmibeat "₹125 cr" | CONFIRMED as a range ₹124–130 cr gross; say "सवा सौ करोड़ के आसपास" |
| 3 | India day 1: **net ₹59.70 cr**, gross ₹67–72 cr; overseas ≈ ₹55–58 cr (US$6.0M) | Sacnilk via The Week and IWMBuzz (₹59.70 cr net, > ₹70.25 cr gross); Pinkvilla ₹67 cr gross, US$6.025M overseas; TrackTollywood ₹72.05 cr | CONFIRMED (net from one tracker, gross range from four) |
| 4 | **16,599 shows**, occupancy 55.4%, footfalls 3,746,734 | Sacnilk via IWMBuzz (18:58 IST 16 Oct) and The Week | SINGLE tracker (Sacnilk); consistent between its two syndications |
| 5 | Language (net, shows, occupancy): Tamil ₹43.35 cr, 9,326, 70.8% · Telugu ₹12.50 cr, 2,792, 56.2% · **Hindi ₹3.50 cr, 4,371, 20%** · Kannada ₹35 lakh, 110, 54% | Sacnilk via IWMBuzz + The Week (identical) | SINGLE tracker. **Hindi range across sources/time: ₹2.75 cr (Pinkvilla sidebar headline), ₹2.81 cr (partial, ETV Bharat 15 Oct night), ₹3.50 cr (final).** Use the final, say "साढ़े तीन करोड़ के क़रीब, ट्रैकर के मुताबिक़" |
| 6 | Hindi day 1 vs the first Jailer's Hindi day 1 (₹35 lakh) = **10×** | Only The Week/Sacnilk gives ₹35 lakh; another outlet: 2023 Hindi **5-day** total ≈ ₹1.25 cr (consistent: day 1 of ₹35 lakh fits) | SINGLE source, plausible; say "पहले जेलर से दस गुना" with the source on screen; drop if not re-confirmed on posting day |
| 7 | Hindi version **not in PVR INOX / Cinepolis (and Miraj)**: reported OTT-window dispute (chains want an **8-week** theatrical window for Hindi films; Sun Pictures agreed a **4-week** window, OTT around November) | Deccan Herald, The Week (12 Oct), BH (14 Oct), Nation Pat, High On Films | REPORTED by several outlets; **the film's team said the Hindi release goes ahead on 15 Oct** (North India: Pen Marudhar Entertainment); "does not mean unavailable at every cinema". Say "रिपोर्ट के मुताबिक़" |
| 8 | Ranking: third-biggest Tamil opening worldwide (after Coolie ₹151 cr, Leo ₹143 cr) | Pinkvilla (and TrackTollywood, "2nd biggest of Rajinikanth's career") | SINGLE-ish; **not used** in the voice |
| ✗ | BH's own table shows **₹2.56 cr day 1, 3,498 shows, 895 venues** | BH movie page | **Not comparable**: BH covers far fewer shows (3,498 vs 16,599), which explains the "20× gap" I noted earlier. Do not quote it for totals |
**What changed from v1:** (a) lead with ₹125 cr worldwide, Hindi ₹3.5 cr becomes the surprise; (b) the occupancy figures (Hindi 20% vs Tamil 70.8%) are the real explanation for the low Hindi take and replace my earlier "cheaper tickets, fewer screens" guess as the main thread; (c) the chain dispute is now stated with its actual terms (8 vs 4 weeks) and its caveat; (d) the BH table is dropped.
Derived (my arithmetic from Sacnilk's language rows, label on screen): Hindi = 26.3% of shows (4,371 / 16,599) but 5.9% of net (3.50 / 59.70); net per show: Tamil ≈ ₹46,500, Telugu ≈ ₹44,800, Kannada ≈ ₹31,800, **Hindi ≈ ₹8,000**, all ≈ ₹36,000. Occupancy gap explains most of the per-show gap: Tamil 70.8% ÷ Hindi 20% = 3.5×; per-show gap is 5.8×; the remaining ≈ 1.6× is ticket price, room size and show mix (not separable from these numbers).
Cautions: never claim why the chains refused (reported dispute only); no person named or mocked; if the Drishyam week-3 dispute is mentioned, outcome unknown; religion/politics absent.

## Hindi voice-over v2 (five 15 s avatar parts, 30–34 words, brisk ~3 words/s, finish by ~13 s; v1 had four parts of 26–32 words)
1. "रुकिए! जेलर टू ने पहले ही दिन दुनिया भर में सवा सौ करोड़ के आसपास कमाए। पर हिंदी वर्ज़न? सिर्फ़ साढ़े तीन करोड़। ऐसा क्यों हुआ? चलिए, आँकड़ों से समझते हैं।"
2. "ट्रैकर के मुताबिक़ पहले दिन लगभग सोलह हज़ार छह सौ शो चले, हिंदी के चार हज़ार तीन सौ से ज़्यादा, यानी हर चार में एक। और हिंदी ओपनिंग पहले जेलर से दस गुना रही।"
3. "अब कमाई देखिए। हिंदी का हिस्सा शोज़ में चौथाई था, कमाई में सिर्फ़ छह प्रतिशत। और हिंदी के शो सिर्फ़ बीस प्रतिशत भरे थे, जबकि तमिल के क़रीब इकहत्तर प्रतिशत। ये फ़र्क़ बड़ा है।"
4. "एक शो की औसत कमाई तमिल में क़रीब छियालीस हज़ार रुपये, हिंदी में सिर्फ़ आठ हज़ार। ये मेरा हिसाब है। यानी हिंदी में अस्सी प्रतिशत सीटें ख़ाली रहीं। पर क्यों?"
5. "रिपोर्ट के मुताबिक़ बड़ी चेन आठ हफ़्ते की विंडो चाहती थीं, फ़िल्म चार हफ़्ते में ओटीटी पर आ सकती है। आपके शहर में हिंदी जेलर कहाँ चल रहा है? कमेंट करिए, और फ़ॉलो करिए।"
Logic chain: huge film → Hindi tiny (hook + question) → shows were not scarce (1 in 4) and Hindi still opened 10× the first film → but money was only 6% because shows were 80% empty → per-show gap → the reported reason (window dispute) → your city? The "10×" now sits in part 2 where it answers "was Hindi weak?" (no, it was big for Hindi) before the occupancy twist. 
English captions (subtitles, proofread): (P1) "Hold on! Jailer 2 earned about ₹125 crore worldwide on day one." "But the Hindi version? Only ₹3.5 crore." "Why? Let's look at the numbers." (P2) "Per the tracker, about 16,600 shows ran on day one, 4,300+ in Hindi: one in four." "And the Hindi opening was 10× the first Jailer's." (P3) "Now the money. Hindi was a quarter of the shows but only 6% of the earnings." "Hindi shows were 20% full; Tamil, about 71%." "That's a big gap." (P4) "Average per show: about ₹46,000 in Tamil, ₹8,000 in Hindi." "That's my arithmetic." "So 80% of Hindi seats stayed empty. But why?" (P5) "Reportedly, big chains wanted an 8-week window; the film may reach OTT in 4." "Where is Hindi Jailer playing in your city? Comment, and follow."

## Screenplay (10 scenes, ~6 s each: faster cuts; times come from `avatar/words.json`; scene starts land on the cue words)
| # | Voice cue | On screen (English, proofread) | Primary visual family | Signature move |
|---|---|---|---|---|
| 1 | "दुनिया भर में सवा सौ करोड़" | Eyebrow `// JAILER 2 · DAY 1`; counter "₹125 cr+ WORLDWIDE (TRACKERS ₹124–130 CR)"; ticket stub | **Kinetic type + CSS-3D ticket (or Blender)**; poster if supplied | ticket tears, odometer to 125 |
| 2 | "पर हिंदी वर्ज़न? सिर्फ़ साढ़े तीन करोड़" | Same bar shrinks to a sliver: "HINDI ₹3.5 CR NET"; "?" pulses | **Bespoke SVG bars** | the 125 bar collapses to the Hindi sliver (scale contrast) |
| 3 | "सोलह हज़ार छह सौ शो … हर चार में एक" | 100-dot grid: 26 pink Hindi dots; "16,599 SHOWS · 4,371 HINDI" | **Bespoke SVG data mosaic** | dots fill row by row, Hindi dots pulse |
| 4 | "दस गुना" | Bars: 2023 Hindi ₹35 lakh vs 2026 ₹3.50 cr; stamp "10×" (source chip) | **Bespoke bars + stamp** | stamp slams with a small shake |
| 5 | "कमाई … सिर्फ़ छह प्रतिशत" | Dots fly to a ₹100 bar: Hindi 6 | **FLIP dots→coins money bar** | dot-to-coin flight; bar splits 94 / 6 |
| 6 | "बीस प्रतिशत भरे … इकहत्तर" | Two ring gauges 20% (pink) vs 70.8% (aqua), small rings 56.2 / 54 | **SVG ring gauges + odometers** | rings sweep with overshoot |
| 7 | "औसत कमाई … अस्सी प्रतिशत सीटें ख़ाली" | Towers ₹46k / ₹45k / ₹32k / ₹8k; cinema seat map 20% filled; tag "MY ARITHMETIC FROM TRACKER FIGURES" | **Bespoke SVG towers + seat grid** | towers grow; empty seats dim in a wave |
| 8 | "पर क्यों? … आठ हफ़्ते … चार हफ़्ते" | Timeline bars 8 weeks vs 4 weeks (REPORTED) | **Bespoke timeline + Phosphor icons** | 8-week bar draws, 4-week bar overtakes with a tick |
| 9 | "बड़ी चेन" | Chips PVR INOX · CINEPOLIS (+ MIRAJ per BH) "REPORTED: HINDI NOT SCREENED"; "team: Hindi release on as planned" | **rough.js strokes + real-footage dust overlay** | hand-drawn strikes, then a hand-drawn "not everywhere" caveat |
| 10 | "कहाँ चल रहा है? … फ़ॉलो" | "Where is it playing near you?"; profile ring + @sandesh_explains; COMMENT YOUR CITY; FOLLOW | **Branded CTA + avatar tile** | typed city names loop |
Families: kinetic type, CSS-3D/Blender ticket, bespoke SVG data (several kinds), FLIP coins, rough.js, Phosphor icons, real-footage overlay, poster/title card, avatar host, synth score + CC0 UI SFX = **10 (≥ 5)**; no family in more than 4 scenes except bespoke SVG (varied objects). Avatar small and borderless bottom-right, caption beside it, content ≤ y 1210.

## Visual identity (new; not Film Leader, not any earlier reel)
"Matinee Ticket Roll": oxblood-black `#1a0c10` ground with a faint perforated-roll texture and a slow ticket-number drift; cream paper `#f3e9d2`; **meaning-coded:** Hindi = hot pink `#ff3d7f`, Tamil = aqua `#2ee6d6`, Telugu = lavender `#a58bff`, Kannada = lime `#c6f432`, money = cream. Fonts: Archivo Black (headlines) + Martian Mono (labels/tickets) + Inter (captions). Component language: ticket stubs with notched edges and tear lines (not rounded cards or clip-corner panels).

## Performance track (R10)
| Part | Beat | Brow | Head | Gaze |
|---|---|---|---|---|
| 1 | "रुकिए!" 0–3 s (energetic, brisk) | lift | lean-in | lens |
| 1 | "हिंदी वर्ज़न … नहीं है" | slight inner raise | still | lens |
| 1 | "ये कैसे हुआ?" | raise | lean-in | lens |
| 2 | "आँकड़े" | easy | still | lens |
| 2 | "हर चार में एक" | still | nod | lens |
| 3 | "सिर्फ़ छह प्रतिशत" | slight raise | one-point gesture | lens |
| 3 | "मेरा हिसाब" | soft | faint smile | lens |
| 2 | "दस गुना" | lift | still | lens |
| 4 | "पर क्यों?" | inner raise | slight lean | lens |
| 5 | "रिपोर्ट के मुताबिक़" | slight raise | nod | lens |
| 5 | CTA | warm | nod | lens, dead-on |

## QA checklist for the build (from the Ramayana feedback)
1. Overlap: every scene sampled at entrance +0.7 s, mid, end−0.4 s, bounding boxes of all text/labels/cards must not intersect (except named deliberate overlays); phone-size contact sheet.
2. Typos: print every on-screen string and caption line to `copy.txt`, run a spell/number check against the ledger (16,599 · 4,371 · 59.70 · 3.50 · 46,483 · 8,007 · 26.3% · 5.9%), read it once end to end.
3. Motion: one signature move per scene (table), eased only, no scene start sparser than 0.3 s.
4. Named things: poster/title card at "जेलर टू"; chain names as text chips; no person named, no likeness.
5. `change-cadence` 0 stretches; ambient motion first.
6. Voice flow (clips): complete sentences, ends by ~13 s, Hindi pronounced as in the table; Whisper check, hand-fix `words.json`.

## Pace notes (user: speed up)
Voice: brisk (~3 words/s) with tight pauses in the prompts; each part ends by ~13 s so no sentence is cut. Visuals: ~6 s scenes (10 in ~65 s), 0.3 s crossfades, entrances start inside the crossfade, ambient motion on every hold. Re-time from `words.json` after the clips arrive; if a clip comes out slow, trim the extra short sentence in that part (P1 "चलिए, आँकड़ों से समझते हैं", P3 "ये फ़र्क़ बड़ा है", P4 "पर क्यों?") rather than speeding the audio (no tempo change rule).

## Open items
Mockup approval (3 scenes from 3 families); the creator to supply the official Jailer 2 poster if wanted (credit: Sun Pictures); confirm the multiplex status and numbers the morning of posting; avatar clips (Part 1 first).
