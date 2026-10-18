# Reel — "Roast of Your Phone Battery" (≈ 50 s, Hinglish voice, English on screen)

Folder: `reels/tech/reel-roast-phone-battery/` · Series: **Roasted & Explained #01** · Style: `docs/STYLE-ROAST-EXPLAINER.md` (six beats, truth tests on every joke, dark dial ≤ 3, **no deadpan: high-energy hook in the first 2–3 s, expressive sarcastic host**).

## Why this reel
- The creator chose the comedy-explainer genre and this topic (18 Oct 2026). The Instagram data rule still applies: the committed `insights/` stats are from the old, suspended account and contain one roast reel with too few views to judge, so this pick rests on the research in `docs/COMEDY-EXPLAINER-RESEARCH.md`, not on data. Re-run `scripts/ig_insights.py report` 48 h after posting.
- Universal (everyone owns a phone and watches its battery health drop), evergreen, safe to roast (an object and our own habits), every joke can carry a hard number, and the fix is actionable today, which makes it a "send this to that friend" reel.

## Benchmark to beat (previous reel: Ramayana booking, 53.6 s)
Its ceiling: depth-parallax real stills in a cinema window, a tearing ticket, five language stubs, a ₹ split bar, a cut-out host, 0 change-cadence stretches. Its weaknesses: slow avatar pace (1.7 words/s, 53 s for ~87 words), mostly flat 2D objects, no character. **This reel does at least 3 new things:**
1. **A non-human mascot that acts**: a battery character with googly eyes whose charge level, face and sweat react to each fact (heat = sweating, 100% overnight = bloated "food coma", 80% limit = relieved), a pure function of `t`.
2. **A truth-marker system** (`REAL FACT`, `ANALOGY`, `MYTH`) as the series' constant visual grammar.
3. **An accurate "chart crime"**: a capacity-decay chart that looks dramatic but plots the real Battery University storage table.
4. Faster delivery: ~104 words in 4 parts, aim ≤ 50 s.

## Facts (tier A = official manufacturer page; B = established reference)
| # | Fact | Tier | Source (read 18 Oct 2026) |
|---|---|---|---|
| F1 | Batteries of iPhone 14 and earlier are designed to keep 80% of original capacity at 500 complete charge cycles; iPhone 15 models at 1,000 (ideal conditions). A cycle = 100% of capacity, from one charge or several partial ones added up. | A | Apple, Battery Service page (via [TechSpot](https://www.techspot.com/news/101972-apple-doubles-iphone-15-advertised-battery-lifespan-ahead.html) and [apple.com/batteries/service](https://www.apple.com/bh/batteries/service/)) |
| F2 | iPhone works best at 0–35 °C ambient; ideal comfort zone 16–22 °C; **above 35 °C can permanently damage battery capacity**; cold is temporary. | A | [Apple, Maximizing battery performance](https://www.apple.com/batteries/maximizing-performance/) |
| F3 | Charging inside certain cases can generate excess heat; remove the case if it gets hot while charging. | A | same Apple page |
| F4 | Stored for one year at 25 °C: kept at 40% → about 96% capacity; kept at 100% → about 80%. At 40 °C: 85% vs 65%. "The worst situation is keeping a fully charged battery at elevated temperatures." | B | [Battery University BU-808](https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries) |
| F5 | Partial charging is fine for lithium-ion (no "memory"); Apple advises against fully discharging for storage. | A/B | Apple page (storage advice); BU-808 ("Partial discharge on Li-ion is fine") |
| F6 | iPhone 15 and later: Settings › Battery › Charging, set a charge limit from 80% to 100% in 5% steps; at 80% it charges to about 80% and resumes at 75%; it occasionally charges to 100% to calibrate. | A | [Apple Support 108055](https://support.apple.com/108055) |
| F7 | Many Android phones have a charge limit (Samsung: "Protect battery"); the exact limit varies by model and software. | B (not confirmed on Samsung's own support page) | say "many Androids", no percentage |
| F8 | Don't charge a phone under a pillow, blanket or your body. | A (Apple's iPhone safety guidance; **verify the current wording on apple.com before production**) | Apple "Important safety information" for iPhone |

## Voice-over (Hinglish in Devanagari, 4 avatar parts, ≤ 28 words each)
1. **P1 (24 words), hook + plain truth:** "रुकिए! आपके फ़ोन की बैटरी धीरे-धीरे आपसे ब्रेकअप कर रही है, और गलती आपकी है। हर फुल चार्ज साइकिल उसे थोड़ा बूढ़ा करती है।"
2. **P2 (28), the number + the analogy:** "ऐपल कहता है, पुराने आईफ़ोन की बैटरी पाँच सौ फुल साइकिल में अस्सी परसेंट रह जाती है। और रात भर सौ परसेंट? बुफ़े के बाद ठूँसकर लेटने जैसा।"
3. **P3 (28), three hates + the dark turn:** "इसे तीन चीज़ों से नफ़रत है: गर्मी, फुल चार्ज, और मोटे कवर में चार्जिंग। गर्मी और फुल चार्ज साथ हों, तो साल भर में बचती है पैंसठ परसेंट।"
4. **P4 (26), fix + toast + send:** "इलाज: अस्सी परसेंट चार्ज लिमिट ऑन करो, फ़ोन ठंडा रखो। वो ब्रेकअप नहीं, बस स्पेस चाहती है। तकिये के नीचे चार्ज करने वाले दोस्त को भेजो।"

English captions: P1 "Hold on! Your phone's battery is slowly breaking up with you, and it's your fault. Every full charge cycle ages it a little." · P2 "Apple says older iPhone batteries drop to 80% after 500 full cycles. And sitting at 100% all night? That's lying down stuffed after a buffet." · P3 "It hates three things: heat, a full charge, and charging inside a thick case. Heat plus a full charge, and a year later only 65% is left." · P4 "The fix: turn on the 80% charge limit and keep it cool. It's not a breakup. It just wants space. Send this to the friend who charges under the pillow."

## Joke table (every joke carries a fact; target = punch direction)
| t (s, est.) | Beat | Line (gist) | Fact carried | Engine | Target |
|---|---|---|---|---|---|
| 0–3 | Hook roast | "Your battery is breaking up with you, and it's your fault." | Capacity loss is real and partly driven by how we charge (F1, F4) | Personification | the viewer's habits (playful, self-included) |
| 3–7 | Plain truth | "Every full charge cycle ages it a little." | F1 cycle definition | — (`REAL FACT`) | — |
| 7–12 | Number | "500 full cycles → 80%." | F1 | — (`REAL FACT`, iPhone 15: 1,000) | — |
| 12–16 | Analogy | "100% all night = lying down stuffed after a buffet." | Full charge at high voltage stresses Li-ion (F4: "keeping a fully charged battery…") | Analogy (`ANALOGY` tag) | the battery |
| 16–24 | Escalation ×3 | heat · full charge · charging in a thick case | F2, F4, F3 | Rule of three (the third is the surprise) | our habits |
| 24–30 | Dark turn | "Heat plus full charge: a year later, 65% left." | F4 (40 °C, 100%, 1 year → 65%; labelled "lab storage test") | Understatement + chart crime | physics |
| 30–36 | Myth (on screen only) | "Drain it to 0% to 'reset' it?" `MYTH` | F5 | Feigned ignorance → correction within 2 s | the myth |
| 36–46 | Fix + toast | "80% limit, keep it cool. It's not a breakup, it just wants space." | F6, F2 | Callback (breakup) | — |
| 46–50 | Send CTA | "Send this to the friend who charges under the pillow." | F8 | Callback + self-own | the friend (affectionate) |

Dark dial: 2, with one moment at 3 (the 65% "cooking" beat). Banned-list check: no people mocked, no religion, no tragedy, no profanity. All four truth tests pass on paper; the F8 wording and F1's source page are re-checked on production day.

## Screenplay (≈ 50 s; re-timed from the real avatar word times)
Look ("Charging Bay", light palette, new for this account's reels): warm off-white ground `#f6f3ec` with a faint charging-dot grid; **meaning-coded colours**: battery green `#1fbf5b` = health, heat orange `#ff6a2b` = heat, magenta `#e0218a` = full-charge stress, cyan `#1e9bff` = the fix, ink `#141414`. Fonts: **Unbounded 800/900** (headlines), **Geist Mono 600** (tags, truth markers), Inter (captions). Host: cut-out avatar bottom-right, as in the Ramayana reel. Through-line object: **the battery mascot** in every scene, changing state.

| # | Time | Voice | Visual (centrepiece) | Families |
|---|---|---|---|---|
| 1 | 0–3 | "रुकिए! … ब्रेकअप … गलती आपकी है" | Frame 0 already composed: the mascot battery (googly eyes, 79% health) turns away from the phone; a magenta **"IT'S NOT ME, IT'S YOU"** stamp slams at ~1.2 s with a zoom punch; host grinning | SVG mascot, kinetic type, SFX (rubber boing + slam) |
| 2 | 3–7 | "हर फुल चार्ज साइकिल…" | Cycle odometer: two half-charges add up to **1 CYCLE** (partial bars stack); `REAL FACT` stamp | data object, icons |
| 3 | 7–12 | "पाँच सौ फुल साइकिल … अस्सी परसेंट" | Health gauge 100% → 80% across a 500-cycle track; side chip "iPhone 15: 1,000"; source line "Apple" | data object, mock iOS **Battery Health** pane (ILLUSTRATIVE) |
| 4 | 12–16 | "रात भर सौ परसेंट? बुफ़े…" | `ANALOGY` tag; mascot bloated at 100% lying on a plate, a moon and clock 2:47 AM | SVG mascot, Unsplash photo (night/bedroom) |
| 5 | 16–24 | "गर्मी, फुल चार्ज, मोटे कवर" | **Hate list** of 3 cards stamped one per word: thermometer (35 °C line), 100% bar, a thick case with heat waves; mascot sweating | icons (Phosphor), stamps, real-footage heat shimmer overlay |
| 6 | 24–30 | "साल भर में … पैंसठ परसेंट" | **Accurate chart crime**: four bars from the storage table (96 / 80 / 85 / 65), the 40 °C·100% bar burning orange; tag "1-YEAR LAB STORAGE TEST" | data object, overlay |
| 7 | 30–36 | (music beat, no voice line; on screen) | `MYTH` stamp on "Drain to 0% to reset it?" → `REAL FACT`: "Partial charging is fine." | kinetic type, stamps |
| 8 | 36–46 | "अस्सी परसेंट लिमिट … ठंडा … स्पेस" | Mock **Settings › Battery › Charging** slider snapping to 80% (ILLUSTRATIVE); mascot relieved, puts on sunglasses in the shade; chip "Many Androids: 'Protect battery'" | mock UI, mascot |
| 9 | 46–50+ | "तकिये के नीचे … भेजो" | CTA: profile photo ring + **@sandesh_explains** + FOLLOW, a pillow with a "NO CHARGING UNDER HERE" sign, a "SEND TO: that friend" button pulsing | profile, kinetic, SFX |

**Asset families: 8** (SVG mascot; bespoke data objects; mock UI panes; Phosphor/tabler icons; Unsplash photo; real-footage overlay; kinetic type + truth stamps; audio: score + CC0 rubber/arcade SFX). Scene 7 has no voice; if the four parts end up shorter, it is covered by music and on-screen text (≤ 4 s).

## Performance track (for the avatar prompts)
- P1: 0–3 s ENTHUSIASTIC AND ENGAGING (R4): quick, a confident grin, a small lean-in on "ब्रेकअप", eyebrows up on "गलती आपकी है"; then settle into an amused, knowing tone.
- P2: playful; a smirk and a slight head tilt on the buffet line.
- P3: counting energy on the three hates (one small one-point gesture), a mock-serious drop on "पैंसठ परसेंट".
- P4: helpful and warm on the fix, a genuine smile on "बस स्पेस चाहती है", a cheeky grin on the pillow line.

## Next
1. Creator OK on this script.
2. Avatar prompts (4 parts, checker 0 FAIL), Part 1 first.
3. Mockup of 3 scenes (1 hook, 6 chart crime, 8 settings fix) for the new look and the mascot.
