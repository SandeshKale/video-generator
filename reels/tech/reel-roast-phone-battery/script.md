# Reel — "Roast of Your Phone Battery" v2 (≈ 50 s, Hinglish voice, English on screen)

Folder: `reels/tech/reel-roast-phone-battery/` · Series: **Roasted & Explained #01** · Style: `docs/STYLE-ROAST-EXPLAINER.md` (six beats, truth tests on every joke, dark dial ≤ 3, **no deadpan: high-energy hook in the first 2–3 s, expressive sarcastic host**).

## What changed from v1 (creator: "could be better")
| v1 weakness | v2 fix |
|---|---|
| Hook was a generic metaphor ("your battery is breaking up with you") that took ~3 s to land and named no habit | Hook is a **specific, relatable accusation** in under 2.5 s: "फ़ोन रात भर तकिये के नीचे चार्ज करते हो?" with a visual jolt at 0.4 s (the pillow flips and the phone is glowing hot) |
| Jokes were unrelated one-offs (breakup, buffet, "space") | **One escalating running gag, a cooking ladder:** slow cooking (P1) → tandoor (P2) → kebab (P3) → "the friend whose phone sleeps in a tandoor" (P4 callback). Each rung is hotter and funnier, and each rung carries a fact |
| "Three hates" list was predictable (heat, full charge, case) | The rule of three is now **three habits that stack heat**: gaming while charging, a thick case, the pillow. The third is the absurd-but-true one |
| Two numbers, one of them a dry spec (500 cycles) | **The lab table is the centrepiece:** 65% vs 96% after a year, with Apple's 35 °C limit on screen. The 500-cycle spec moves to an on-screen chip |
| Fix only covered iPhone 15+ | Fix covers **every phone**: 80% Charge Limit (iPhone 15+), Optimized Battery Charging (older iPhones), "Protect battery"-style settings (many Androids) |
| Pillow warning unverified | **Verified word for word** on Apple's iPhone safety page (F8) |

## Why this reel
- The creator chose the comedy-explainer genre and this topic (18 Oct 2026). The committed `insights/` stats come from the old, suspended account, so this pick rests on `docs/COMEDY-EXPLAINER-RESEARCH.md`, not on data. Re-run `scripts/ig_insights.py report` 48 h after posting.
- Universal, evergreen and safe to roast (our own habits plus an object). Every joke carries a hard number, the fix takes 10 seconds, and "send this to the friend who…" is a natural share.

## Benchmark to beat (previous reel: Ramayana booking, 53.6 s)
Its ceiling was depth-parallax real stills, a tearing ticket, language stubs, a ₹ split bar, a cut-out host and 0 change-cadence stretches. Its weaknesses were a slow pace (1.7 words/s), flat 2D objects and no character. **This reel adds:**
1. **A non-human mascot that acts:** a googly-eyed battery whose face, sweat and charge react to each fact (a pure function of `t`).
2. **A through-line heat dial** (an oven knob plus a thermometer, top right) that turns up one notch per rung of the cooking ladder (LOW → TANDOOR → KEBAB → OFF on the fix). It is the step tracker and the match-cut object: each cut is a quarter-turn of the knob.
3. **A Blender centrepiece that changes state:** a pillow on a bed with a phone under it. Cool at first, then an orange glow, then heat shimmer and steam, then the phone lifted out onto a cool desk at the fix. Lighting states are cross-faded by `t`, as in the morning-brief bedroom.
4. **An accurate "chart crime":** the Battery University table drawn as four thermometers filling and then draining.
5. **The series' truth-marker grammar** (`REAL FACT`, `ANALOGY`, `MYTH`).

## Facts (tier A = manufacturer page read today; B = established reference)
| # | Fact | Tier | Source (read 18 Oct 2026) |
|---|---|---|---|
| F1 | iPhone 14 and earlier: designed to keep 80% of original capacity at 500 complete charge cycles; iPhone 15 models: 1,000 (ideal conditions). | A | Apple, Battery Service page ([apple.com/batteries/service](https://www.apple.com/bh/batteries/service/)) |
| F2 | iPhone works best at 0–35 °C ambient; ideal comfort zone 16–22 °C; **above 35 °C can permanently damage battery capacity**. | A | [Apple, Maximizing battery performance](https://www.apple.com/batteries/maximizing-performance/) |
| F3 | Charging inside certain cases can generate excess heat; take the case off if it gets hot while charging. | A | same Apple page |
| F4 | Stored for one year at 25 °C: kept at 40% → ~96% capacity; kept at 100% → ~80%. At 40 °C: 85% vs **65%**. "The worst situation is keeping a fully charged battery at elevated temperatures." | B | [Battery University BU-808](https://batteryuniversity.com/article/bu-808-how-to-prolong-lithium-based-batteries) |
| F5 | Phones get warm while charging and under heavy use (gaming); heat adds up. | B (general; worded as "heats it more", no number) | Apple page (warm while charging) |
| F6 | iPhone 15 and later: "choose a charge limit between 80 percent and 100 percent in 5 percent increments." Older iPhones: Optimized Battery Charging "will delay charging past 80 percent in certain situations" to "reduce the wear on your battery." | A | [Apple Support 108055](https://support.apple.com/108055) |
| F7 | Many Android phones have a charge-limit setting (Samsung: "Protect battery"); the limit varies by model. | B | say "many Androids", no percentage |
| F8 | "Don't sleep on a device, power adapter, or wireless charger, or place them under a blanket, pillow, or your body, when it's connected to a power source." Keep it "in a well-ventilated area when in use or charging." | **A (verified verbatim)** | [Apple, Important safety information for iPhone](https://support.apple.com/guide/iphone/important-safety-information-iph301fc905/ios) |

## Voice-over (Hinglish in Devanagari, 4 avatar parts, ≤ 28 words each, finish by ~12.5 s)
1. **P1 (27 words), hook roast + plain truth:** "फ़ोन रात भर तकिये के नीचे चार्ज करते हो? बधाई हो, बैटरी को धीमी आँच पर पका रहे हो। गर्मी और फुल चार्ज: बैटरी के दो दुश्मन।"
2. **P2 (27), analogy + escalation ×3:** "सौ परसेंट पर घंटों बैठना, बुफ़े के बाद ठूँसकर लेटने जैसा है। ऊपर से चार्जिंग में गेमिंग, मोटा कवर, और तकिया? अब ये फ़ोन नहीं, तंदूर है।"
3. **P3 (25), the dark turn with the numbers:** "लैब टेस्ट: चालीस डिग्री, सौ परसेंट पर एक साल, बची पैंसठ परसेंट। पच्चीस डिग्री, चालीस परसेंट पर? छियानवे। आप बैटरी नहीं, कबाब बना रहे हो।"
4. **P4 (28), fix + toast + callback + send:** "इलाज सिंपल: अस्सी परसेंट लिमिट ऑन करो, फ़ोन को ठंडी जगह सुलाओ। बैटरी खुश, आप खुश। और ये उस दोस्त को भेजो, जिसका फ़ोन तंदूर में सोता है।"

**English captions (on screen):**
- **P1:** "Charging your phone under the pillow all night? Congrats, you're slow-cooking the battery. Heat and a full charge: its two enemies."
- **P2:** "Sitting at 100% for hours is like lying down stuffed after a buffet. Add gaming while charging, a thick case, and a pillow? That's not a phone anymore, it's a tandoor."
- **P3:** "Lab test: a year at 40 °C and 100% left 65%. At 25 °C and 40%? 96%. You're not charging a battery, you're making a kebab."
- **P4:** "The fix is simple: turn on the 80% limit and let it sleep somewhere cool. Happy battery, happy you. Now send this to the friend whose phone sleeps in a tandoor."

## Joke table (each joke carries a fact; target = who the punch is aimed at)
| t (s, est.) | Beat | Line (gist) | Fact carried | Engine | Target | Marker |
|---|---|---|---|---|---|---|
| 0–2.4 | Hook roast | "Charging it under the pillow all night?" | F8 (Apple says don't) | Direct accusation + visual reveal | the viewer's habit (playful) | — |
| 2.4–5 | Hook punch | "you're slow-cooking the battery" | F4 (heat × time) | Literalisation, rung 1 of the ladder | the habit | — |
| 5–8 | Plain truth | "Heat and a full charge: its two enemies." | F2, F4 | said straight | — | `REAL FACT` |
| 8–13 | Analogy | "100% for hours = lying down stuffed after a buffet." | F4 (a full charge held for long is stress) | Analogy | the battery | `ANALOGY` |
| 13–19 | Escalation ×3 | gaming while charging · thick case · pillow → "it's a tandoor" | F5, F3, F8 | Rule of three, rung 2 | our habits | `REAL FACT` ×3 |
| 19–27 | Dark turn | "65%… 96%… you're making a kebab." | F4 (labelled "1-year lab storage test") | Understatement + an accurate chart crime, rung 3 | physics | `REAL FACT` |
| 27–31 | Fix | "80% limit, sleep it somewhere cool." | F6, F7, F2 | — (helpful) | — | `REAL FACT` |
| 31–34 | Toast | "Happy battery, happy you." | — (the sincere beat) | Warm reversal | — | — |
| 34–40 | Callback + send CTA | "the friend whose phone sleeps in a tandoor" | F8 | Callback to rung 2 | the friend (affectionate) | — |
| on screen only, 27–31 | Myth | "Drain it to 0% to 'reset' it?" → `MYTH`. "Partial charging is fine." | BU-808 | Quick correction | the myth | `MYTH` |

- **Dark dial:** 2, with one moment at 3 (the kebab).
- **Banned-list check:** no people mocked, no religion, region, tragedy or profanity; food jokes only.
- **Truth tests:**
  - Remove the jokes, and the facts still teach the lesson.
  - The cooking ladder maps correctly: more heat for longer means more damage.
  - The only myth shown is the debunked one.
  - Every number has a source on screen.

## Screenplay (≈ 50 s; re-timed from the real avatar word times)
**Look, "Kitchen Timer":** light, warm off-white `#f6f3ec` with a faint enamel-tile grid. The colours are meaning-coded:
- battery green `#1fbf5b` = health
- heat orange `#ff6a2b` = heat, deepening to tandoor red `#d7261e`
- magenta `#e0218a` = full-charge stress
- cyan `#1e9bff` = the fix and cool
- ink `#141414` for text

Fonts: **Unbounded 800/900** for headlines, **Geist Mono 600** for tags and truth markers, Inter for captions; the cover is in Anton. The host is the cut-out avatar, bottom right. The through-line is the **heat dial** (top right) plus the **battery mascot** in every scene.

| # | Time | Voice | Visual (centrepiece) | Asset families |
|---|---|---|---|---|
| 1 | 0–2.4 | "फ़ोन रात भर तकिये के नीचे…?" | **Frame 0:** a Blender bed and pillow, with an orange glow leaking from under the pillow and steam wisps. 0.4 s: the pillow flips up (whoosh) to reveal the mascot at 100%, sweating and plugged in. 1.2 s: a 2:47 AM clock chip. Big kinetic headline **"UNDER THE PILLOW?"** | Blender 3D, SVG mascot, kinetic type, SFX |
| 2 | 2.4–5 | "…धीमी आँच पर पका रहे हो" | Heat dial snaps to **LOW · SLOW-COOK**; a pot lid lands on the phone with a clang and the **"SLOW-COOKING"** stamp slams; the host does an eyebrow-up grin | through-line dial, stamp, footage heat-shimmer overlay |
| 3 | 5–8 | "गर्मी और फुल चार्ज…" | Two "enemy" cards slide in: a thermometer (the 35 °C line, "Apple: above 35 °C can permanently damage capacity") and a 100% bar in magenta; `REAL FACT` stamp | Phosphor icons, bespoke data cards |
| 4 | 8–13 | "सौ परसेंट पर घंटों… बुफ़े…" | `ANALOGY` tag; the mascot swells at 100% beside an empty buffet plate and loosens a belt; a "4 h at 100%" timer chip ticks | SVG mascot, real Unsplash photo (plate/table) |
| 5 | 13–19 | "गेमिंग, मोटा कवर, तकिया… तंदूर" | **Heat stack:** three blocks drop onto the phone, one per word (gamepad, thick case, pillow), each pushing the thermometer up; the dial clicks to **TANDOOR**; the clay-oven silhouette closes around the phone | GSAP drop-ins, icons, through-line dial |
| 6 | 19–27 | "लैब टेस्ट… पैंसठ… छियानवे… कबाब" | **Chart crime done right:** four thermometers (25 °C/40%, 25 °C/100%, 40 °C/40%, 40 °C/100%) drain to 96 / 80 / 85 / **65**. The 65 one chars red, and a skewer slides through the battery on "कबाब". Tag: "1-YEAR LAB STORAGE TEST · BATTERY UNIVERSITY BU-808" | bespoke data object, kinetic counters |
| 7 | 27–31 | "इलाज: अस्सी परसेंट लिमिट…" | The dial turns to **OFF** (cyan). A mock **Settings › Battery › Charging** pane (ILLUSTRATIVE) snaps its slider to 80%. Chips: "iPhone 15+: Charge Limit", "Older iPhones: Optimized Battery Charging", "Many Androids: 'Protect battery'". Side strip: `MYTH` "Drain to 0% to reset?" → "Partial charging is fine" | mock UI pane, chips, stamps |
| 8 | 31–34 | "ठंडी जगह… बैटरी खुश" | Blender cool state: the phone is lifted onto a bedside table in blue light; the mascot cools from orange to green and puts on sunglasses | Blender 3D, mascot |
| 9 | 34–40+ | "उस दोस्त को भेजो… तंदूर में सोता है" | CTA: profile-photo ring + **@sandesh_explains** + FOLLOW. A pillow wears an Apple-quoted sign: "Don't charge under a pillow (Apple)". A **"SEND TO: that friend"** button pulses every 1.5 s and the tandoor icon blinks | profile, kinetic type, SFX |

**Asset families: 9.** Blender 3D; SVG mascot; bespoke data objects; mock UI pane; Phosphor icons; Unsplash photo; footage heat-shimmer/dust overlay; kinetic type + truth stamps + GSAP entrances; audio (a score that gets "hotter" with each rung, plus CC0 kitchen/rubber SFX: lid clang, sizzle, oven ding, whoosh). No scene shares a primary family with its neighbour.

**Ambient motion for the 2 s rule:** steam wisps, the dial needle wobble, the thermometer creep, a ticking timer chip, mascot blinks and sweat drops. The hero visuals hold for their reading time.

## Performance track (for the avatar prompts; R4 hook)
- **P1:** 0–3 s ENTHUSIASTIC AND ENGAGING. A mock-suspicious squint and lean-in on "तकिये के नीचे?", eyebrows up. Then a big sarcastic "बधाई हो" with a grin, and a matter-of-fact settle on "दो दुश्मन".
- **P2:** playful. A slow, smug nod on the buffet line; counting energy on the three habits (one small one-two-three), building to a delighted "तंदूर है!"
- **P3:** mock-serious lab voice on the numbers (slower, clear, eyebrows level), then a deadpan beat and a grin on "कबाब बना रहे हो". The beat is a pause, not a flat performance; the energy stays up.
- **P4:** warm and helpful on the fix, a genuine smile on "बैटरी खुश, आप खुश", a cheeky grin and lean-in on the send line, eyes on the lens.

## Next
1. Creator OK on this script.
2. Avatar prompts (4 parts, checker 0 FAIL), Part 1 first.
3. Mockup of 3 scenes from 3 families: 1 (Blender pillow hook), 6 (thermometer chart crime), 7 (settings fix).
