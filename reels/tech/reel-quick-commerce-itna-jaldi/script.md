# "Itna jaldi kaise?" — how quick commerce really works (Hinglish, ~62 s)

Status: **script v2 + voice plan; visual mockup not built yet** (CLAUDE.md: mock up 3 scenes in 3 families and get approval before the full build).
Voice-over only, no avatar. Hinglish: Hindi grammar in Devanagari, English terms in Latin (master text in `script.json`, field `A`; all-Devanagari respelling in `B`).
Research it rests on: `insights/india-topics-research-2026-10-31.md` (pick C) and `docs/HINGLISH-VOICEOVER-GUIDE.md`.

## Why this reel (evidence, per the standing rule)
- `insights/report.md` (12 Oct 2026, 19 days old): 21 reels, **0 shares on every reel**, median 3-s skip 75%, median watch 4.5 s. This topic is built around a "send this to someone who uses Blinkit" reaction and a 3-second contradiction (told to drop "10 minutes", yet the milk still arrives that fast). Evidence is thin (1–2 reels per tag), so this is a hypothesis; re-run the report 48 h after posting.
- Scoring in the topic research: 84/100 (share-bait 5, India relevance 5, visual payoff 5, facts 3, timing 3).
- The reference voice-over the creator supplied (a 160 s Hinglish systems explainer) shows the pattern this format needs: **articulation ≈ 5 words/s with 31% of the time spent in pauses**, a pause after every named term, and ~9-word sentences. Measured numbers in the guide. Its script, structure and visuals are **not** reused (the story below is our own research); only the delivery style is matched. Its voice is not cloned.

## Benchmark to beat
Previous vertical ceiling: `reel-04-shot-right-now` (physics honesty, labelled factors, live HUD counters, bespoke object per scene) and `reel-ai-shopping-agent` (kiosk, Blender layers under one grade). This reel must beat them on:
1. **A through-line object:** one *order slip* (thermal-receipt strip) that is printed in scene 1, travels with the order through the three decisions (store → shelf → pick) and is torn off at the door; each cut is a match cut along the slip (the trading-pipeline "cable" idea in a new form).
2. **A system seen from inside, with real mechanics and no invented numbers:** geofence drawing itself around a PIN code, fast-movers sliding toward the dispatch end of the aisle, the pick route with eggs last, the pigeonhole scan. Every illustrative quantity is labelled ILLUSTRATIVE.
3. **New technique:** the t-driven geofence + grid-cell + ray-cast HUD parts (`assets/animations/hud-parts/`) inside a Blender-lit warehouse, and the highlighted caption rig (`assets/animations/caption-rig/`) for the first time in a shipped reel.
4. **Voice:** the first reel with a measured, reference-matched Hinglish cadence (pause budget, term-reveal pauses, locked voice, phoneme-fixed brand names) and an automated take-QA pass.

## Facts ledger (tiers: A primary · B reputable secondary · C single/uncertain)
| # | Line it supports | Fact | Source | Tier |
|---|---|---|---|:-:|
| 1 | hook | India's government (labour ministry) was **reportedly** said to have ordered Blinkit, Zepto and Swiggy to stop promoting "10-minute" delivery, at a closed-door meeting the previous Saturday; reported 13 Jan 2026; concerns cited: rash riding and low pay for missed deadlines | Reuters 13 Jan 2026 (via MarketScreener) | B (two unnamed sources; never say "banned") |
| 2 | w2 | Blinkit's tagline changed from "Grocery in 10 minutes" to "Groceries & more" (Wayback, per Reuters) | same | B |
| 3 | d1a | Dark stores are small fulfilment hubs; each order is tied to **one** store; geofence/geospatial lookup picks it | Forbes India "Dark stores explained"; industry explainers | B (generic model, no company claims) |
| 4 | d1 (on-screen) | Stores sit **2–3 km** from customers | CBRE dark-store report; Instamart ~2 km | B |
| 5 | d2 | Stock is forecast **by PIN code**; festivals and cricket matches are the spikes; fast-movers sit nearest dispatch | Forbes India | B |
| 6 | d3a/d3b | Packer's handheld shows bin locations; every item's barcode (EAN) is scanned; fragile items (eggs) are picked **last**; order goes into a colour-coded pigeonhole; **rider scans without entering the store** | Forbes India | B |
| 7 | s1 | Blinkit network **2,751 dark stores** (+308 net in Jul–Sep 2026); target 3,500+ by Mar 2027 | Eternal Q2 FY27 results, 21 Oct 2026 (YourStory, Kotak Neo, PTI via Tribune) | B → get Eternal's shareholder letter (A) before posting |
| 8 | s1 | Blinkit **net order value ₹20,940 crore** in Jul–Sep 2026, **+79.3% YoY** | same | B (same upgrade) |
| 9 | optional | Instamart 1,240 dark stores in 133 cities; Zepto 1,139 (Mar 2026) | PTI via Tribune | B |

**Not to claim:** a store radius as a Blinkit fact, picking-seconds, SKU counts, rider pay, "banned/illegal", the FY26 order counts from the Substack, any "10-minute budget" as real (show it only as an ILLUSTRATIVE schematic).
*(Row 1 wording: the voice says "से कहा गया" (was told) and the screen carries "REPORTED · Reuters · 13 Jan 2026".)*

## Script (time | voice | picture | capture) — durations are estimates until the take QA is run
Voice line IDs match `script.json`. Pause marks: `,` ≈ short, `।` ≈ sentence, **bold word = the term-reveal (pause after it)**.

| t (s) | id | Voice (master `A`) | Picture | Families |
|---|---|---|---|---|
| 0.0–3.2 | h1 | Blinkit और Zepto से कहा गया, दस minute बोलना बंद करो। | frame 0 is already full: the slip prints "10 MIN" and a stopwatch stamp strikes it; label REPORTED · Reuters · 13 Jan 2026 | typographic, SVG, caption rig |
| 3.2–6.2 | h2 | फिर भी दूध उतनी ही जल्दी आता है। कैसे? | milk pouch drops onto a doorstep; city at dusk behind; slip keeps printing | Blender (milk pouch, city), GSAP drop |
| 6.2–13 | p1 | राइडर की speed नहीं, असली खेल order करने से पहले हो चुका होता है। तीन फ़ैसले, और तीनों, आपके tap से पहले। | scooter rushes, then freezes mid-street; the slip splits into three tabs (STORE · SHELF · PACK), tracker appears | Blender (scooter, streets), HUD tracker |
| 13–22 | d1a, d1b | पहला, कौन सा store। हर dark store का नक्शे पर एक घेरा है, जिसे **geofence** कहते हैं। आपका order उसी store को जाता है, जिसके घेरे में आप हों। | top-down city; polygons draw themselves around stores; your phone dot sits in exactly one; "2–3 km (CBRE)" tag | HUD geofence, Kenney/Quaternius city, phone UI |
| 22–31 | d2 | दूसरा, shelf पर क्या रखना है। ये हर PIN code के हिसाब से, पहले से forecast होता है, त्योहार और cricket match के साथ। | Blender aisle with steel shelves; per-PIN forecast bars spike on a festival and a match marker (ILLUSTRATIVE); fast-movers slide to the dispatch end | Blender (shelves, crates), HUD barChart |
| 31–42 | d3a | तीसरा, packing। Packer के handheld पर, हर item का bin दिखता है। Barcode scan होता है, और अंडे? सबसे आख़िर में। | handheld UI lights bins in route order; scan beam per item; eggs tile glides last | smartphone/handheld UI kit, HUD rayCast, Phosphor icons |
| 42–49 | d3b | राइडर अंदर आता ही नहीं, बस अपना bag scan करता है, और निकल जाता है। | pigeonhole grid (colour-coded cells light), scooter at the door scans the bag, slip torn off | HUD gridCells, Blender scooter, delivery bag |
| 49–56 | w1, w2 | तो दस minute का वादा, सिर्फ़ marketing नहीं था। Reuters के मुताबिक, चिंता rider की speed की थी, और देर होने पर, कम pay की। अब Blinkit खुद को, Groceries and more कहता है। घड़ी बदली, system नहीं। | typographic quote strip from the report; the slip's "10 MIN" line replaced by "GROCERIES & MORE"; clock stamp fades | typographic, caption rig |
| 56–61 | s1 | अकेले Blinkit के, पौने तीन हज़ार dark stores हैं। तीन महीनों में, orders की value, करीब इक्कीस हज़ार करोड़ रुपये। | counters: 2,751 stores (+308), ₹20,940 cr (+79.3%); bar rises; source line Eternal Q2 FY27 | HUD barChart/counters |
| 61–64 | c1, c2 | क्या दस minute का वादा, वापस आना चाहिए? कमेंट में बताओ। Sandesh Explains को, like, share और subscribe करना। | end card held ≥ 2.5 s: profile photo, @sandeshexplains, LIKE · SHARE · SUBSCRIBE, comment question | branded CTA, audio |

**Families used: 9** (Blender 3D, HUD data objects, phone/handheld UI kit, city packs, Phosphor icons, GSAP entrances, caption rig/kinetic type, footage overlay (dust on the CTA only), Kenney/synth audio). Audit: no scene is photo+panel+text only; the Blender and HUD families alternate with typographic scenes; no family appears in more than 4 scenes.
Safe zones: captions ≤ 2 lines above y ≈ 1270 for content, caption band reserved, bottom 20% and right 15% empty.

## Visual identity (to be mocked up, not decided)
Must differ from: navy/amber (rundown-ios), cyan/magenta (loop-method), indigo/magenta/mint (suncatcher), graphite+aluminium (trading), cream/terracotta (apple-camera), store-white/amber/magenta (shopping-agent), ink/orange/lime (adobe), newsprint (tokens), violet (sheets), banknote cream/navy (synthid), umber/amber (diary), enamel tiles (battery), plum/gold (king), cloud-chamber (reel-04), midnight indigo/saffron (coupon GIF).
Proposed direction for the mockup: **"Cold-chain & thermal receipt"** — frost-white and refrigerated-aisle blue-grey ground, a single saturated **price-tag vermilion** for the *reported order*, **pigeonhole** primary-colour cells (blue/yellow/green) as the three-decision code, and thermal-paper cream for the slip; a condensed grotesque for headlines (a face not yet used in a reel; chosen at mockup time) + a receipt mono. Three alternatives will be shown in the mockup step so the creator can choose.

## Voice plan (details and measurements in the guide)
- Engine: OmniVoice (local, Hindi) with a **locked voice** (clone prompt from the first accepted take) and **phoneme-tagged brand names**; the creator's avatar clips remain the alternative (same pronunciation table, `B` text).
- Target delivery from the reference: ~3.3–3.5 words/s over the whole reel, articulation 4.5–5 words/s, pauses 31% of runtime, sentence median 9 words, term-reveal pause 0.8–1.2 s, phrase endings fall ~4 semitones, questions rise.
- Take QA: Whisper round-trip skeleton ≥ 95% per line, every brand/term hit, pause histogram within the reference band, f0 within ±8 Hz of the anchor, no internal gap > 0.55 s except designed ones. **Not auditioned by ear in this environment** — the creator should listen to the sample pack first.

## Caption / CTA notes
Hinglish caption on Instagram; YouTube sheet per the Hindi-reel rule (title, description, tags); CTA = comment question + LIKE · SHARE · SUBSCRIBE; end card `@sandeshexplains`. Avatar disclosure line not needed (no avatar); AI-voice disclosure line yes ("Voice: AI-generated").
