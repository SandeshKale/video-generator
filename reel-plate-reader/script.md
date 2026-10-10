# "Somebody keeps notes on your car" — script + screenplay (visual-first, 2 numbers, ~62 s)

**Logline:** A commute you've made a thousand times has a witness you never noticed — and this year, people started asking what it writes down.
**Format:** vertical 1080×1920 @60, ~62 s, English VO (local Kokoro, base ≈1.08, sentence-level pacing; no filler clips), on-screen English only.
**Numbers on screen: 2** ("36 states" — NPR's count; "100+ towns" — one watchdog's tally). Everything else is shown, not counted.

## Story engine (why it should hold attention)
- **Relatable entry:** the viewer is the character. "Your car" — not "a company".
- **Reveal in 3 s:** the hook promises a secret witness; the first push-in lands on the pole camera by 2.4 s.
- **One motif, paid off twice:** the quiet *click* (shutter tick). It plays when the camera reads the plate (beat 3) and returns, alone, over the closing shot where the driver passes the pole again (beat 10) — same frame as the opening, now with a glance.
- **A character arc without people:** the *plate* is our protagonist — ordinary → noticed → logged → searched → redacted → (viewer's question).
- **Both sides get a beat (5 and 9), so the question at the end is honest.**
- **Escalation curve:** quiet (1–3) → pattern/stakes (4–5) → agency (6–7) → conflict (8–9) → choice (10).
- **Open loop:** beat 6 opens "…if anyone had searched it" and 7 pays it off one scene later.

## Voice-over (final text; sentence-level, written for the ear)
1. "Your car has a daily routine. Somebody's keeping notes."
2. "On your way to work there's a small gray camera on a pole. You've never once looked up at it."
3. "It doesn't film you. It reads your plate, then writes down the time, the place, and which way you were headed."
4. "Do that all over town, and it isn't a snapshot anymore. It's a diary of your week."
5. "Police say that diary finds stolen cars and missing people. And they're not wrong."
6. "But who gets to read it? This summer, a free site let drivers type in their plate and see if anyone had searched it."
7. "Some people got a yes. Then, reportedly, the company trimmed what its logs show: fewer names, fewer reasons."
8. "So people stopped asking nicely. Cameras were vandalized in at least thirty-six states, and towns started cancelling, more than a hundred, by one watchdog's count."
9. "Neighbors who want every stolen car found. Neighbors who want one day without a diary. Both think they're being sensible."
10. "So which side are you on? Tell me below. And follow for the next one."

~160 words → ≈62 s at base 1.08 (hook sentence a touch faster, beats 5 and 10 slower). Hook payoff (pole camera) must land ≤3 s: shorten beat 1 if the timing misses.

## Screenplay
Legend — **SHOT:** photoreal AI still (RealVisXL, people-free) with depth-parallax move · **LAYERS:** foreground components built in the new visual system · **SFX/MUSIC:** from `sfx.py` cue system · **EYEBROW:** content-specific, one per scene (none names a story beat).

| # | t (est.) | SHOT + camera | LAYERS / motion (all pure functions of t, keyed to VO words) | SFX · music | On-screen words | Eyebrow |
|---|---|---|---|---|---|---|
| 1 | 0–3.0 | Dawn commute: a rain-wet two-lane road seen through a windshield, hood lamp-lit, sun breaking over a ridge. Slow push-in, wipers rest. | Frame 0 already composed: a green highway-sign panel "MORNING COMMUTE" top-left; a **scan reticle** locks onto the car ahead's plate (fictional "ABC·1234") at word "notes"; reticle corners snap in with a hairline *tick* | Soft engine bed, single pad; tick on "notes" | "SOMEBODY'S KEEPING NOTES" (4 w) | // THE SAME ROAD, EVERY DAY |
| 2 | 3.0–8.5 | Gray box camera on a utility pole against a pale sky; rack-focus parallax from road-level to the pole. | Sign panel slides in "POLE 14"; a dashed **road-line** runs down the left gutter (progress bar for the whole reel); a tiny **eye icon** blinks when the camera is named | Wind, distant traffic, camera-servo micro whirr | "NEVER LOOKED UP" | // THE GRAY BOX ABOVE THE ROAD |
| 3 | 8.5–17 | Same road, car passes under the pole in a motion-blurred pan (parallax + whip). | **Plate close-up** as an SVG reflective plate; OCR boxes draw around characters; three **data tags** fly off the plate and pin to the road: `08:14` `OAK ST` `→ NORTH`; the *click* motif (shutter tick) on each tag | Three ticks, rising glass pluck | (none beyond tags) | // WHAT THE CAMERA WRITES DOWN |
| 4 | 17–23.5 | Top-down night city grid made from the shots' depth map (stylised, still photoreal), slow tilt. | Hundreds of pins appear along a route; a **diary page** (Instrument Serif italic) stacks over the map: "Mon — home 7:52 / work 8:14 / gym 6:03 / home 9:40"; pages flip, route thread draws day by day | Page flips, soft piano motif | "A DIARY OF YOUR WEEK" | // MONDAY TO SUNDAY, ONE CAR |
| 5 | 23.5–29 | Recovered-car moment: a lone sedan under sodium light in an empty lot, blue-red wash on its roof (no people). Slow dolly. | Green **FOUND** sticker stamps onto a "STOLEN" tag; second sticker "MISSING → HOME" on a milk-carton-style card; both pop on the words "stolen cars", "missing people"; a small balanced chip "THEY'RE NOT WRONG" | Low bass hit, warm resolve | "THEY'RE NOT WRONG" | // WHY POLICE WANT THE DIARY |
| 6 | 29–36 | Laptop-lit desk at night — keyboard glow only, screen content composited in. | **Search UI** (new component): plate field types "ABC·1234" letter-by-letter; "SEARCH" press; scanning bar; text "free site · public records · incomplete" | Typing ticks, wait bed | "ANYONE SEARCHED?" | // A FREE LOOKUP, THIS SUMMER |
| 7 | 36–43.5 | Close-up of a printed audit sheet being pulled across a table (no hands: sheet slides). | **Ledger**: rows `AGENCY · TIME · REASON`; black **redaction bars** wipe over NAME and REASON columns on "trimmed"; first row stamps "SEARCHED" | Stamp thud, paper rasp, then silence | "SOME GOT A YES" | // THE LOG LOSES ITS NAMES |
| 8 | 43.5–52 | Pole camera again, now lens splashed with paint (stylised, tasteful); camera cut-away to a town hall façade with a "COUNCIL VOTE" board. | **Two counters** only: "36 STATES" (NPR count) and "100+ TOWNS" (one watchdog's count) as highway **exit signs** that slide in; town names ticker-cross-out in red "CONTRACT ENDED" | Crowd murmur swell, rising suspense | "36 STATES" · "100+ TOWNS" | // WHEN ASKING STOPPED WORKING |
| 9 | 52–58 | Split frame: left a quiet suburban cul-de-sac with a camera; right the same street at dusk with no camera. Slow match-dissolve between them. | Two **sign panels** hold the opposing lines ("EVERY STOLEN CAR FOUND" / "ONE DAY, NO DIARY"); a balance needle between them swings and settles at the exact centre | Single sustained note, no beat | "BOTH SOUND SENSIBLE" | // TWO STREETS, ONE POLE |
| 10 | 58–67 | The opening windshield road again; the car passes the pole camera — this time we **tilt up to the lens**; the shutter tick plays once, alone. Then clean CTA card. | Reticle appears but **doesn't lock** (rack-focus pulls past it); CTA: circular profile photo ring + **@sandesh.explains** + FOLLOW chip, held ≥3 s; question chip "WHICH SIDE?" above the safe area | The single tick; warm final chord; no outro drone | "WHICH SIDE?" · "FOLLOW" | (none — CTA scene) |

## Visual identity — "Highway Signage" (new; checked against all prior reels)
- **Palette:** asphalt `#15181c`, reflective-sheeting white `#f4f6f2`, highway green `#0a6b43`, retro-reflective amber `#ffb400`, signal red `#e5322d` (only for redaction/vandalism beats). Not used before: green + amber on asphalt.
- **Background texture:** none abstract — the *photoreal shot itself* is the background (depth parallax + grade + grain), kept secondary under a 55 % asphalt scrim; a **dashed road line** in the left gutter is the persistent motion element (progress bar, travels as the story advances).
- **Component language:** US highway-sign panels (rounded rectangle, inset white border, corner radius 18 px), exit-number tabs, license-plate shapes with embossed characters, reflective-sheeting diamond micro-texture on panels (SVG pattern), road-marking dashes. No cards/pills/clip-corner panels from earlier reels.
- **Typography:** **Archivo Black** (display, ≤ 768 px wide — the lint catches overflow), **Inter** (body), **DM Mono** (plate, timestamps, logs), **Instrument Serif italic** (the "diary" voice, beat 4 only). All unused so far (Archivo Black, DM Mono, Instrument Serif) or reused as neutral body (Inter).
- **Motion language:** camera-driven — parallax pushes, rack-focus, whip pans — plus reticle snaps and shutter ticks. GSAP-scrubbed entrances (`scrubTl`), no CSS clocks.
- **Characters:** none. The plate is the protagonist; the *absence of faces* is the point and avoids generated-people artifacts.

## Asset plan — the most premium set available here
| Need | Asset | Why / notes |
|---|---|---|
| 8 hero photos (people-free) | **RealVisXL V5 Lightning** (local, CPU bf16): road dawn, pole camera, motion-blur pan, night map from depth, lonely sedan, desk glow, audit sheet, town-hall/cul-de-sac pair | Photoreal is the premium tier used in the landscape benchmark. ~3–4 min per 576×1024 image with 5 steps → ~35 min batch in the background. Every photo carries "AI IMAGE". Plates and any text are **composited**, never generated (SDXL garbles them) |
| Parallax + camera moves | **Depth-Anything-V2-Small** + WebGL depth-parallax shader from `video-ai-bubble-v2/site/engine.js`, adapted to 9:16 (whip-pan transitions, grade, vignette, grain, dust) | Gives the "filmed" feel the flat reels lacked |
| Texture accents | `assets/animations/video-overlay/` (film grain with `multiply`, dust, light leak) on beats 1, 5, 10 | Real footage texture, used sparingly (≈12 ms/seek) |
| Entrances | **GSAP** `scrubTl` helpers (`dropIn`, `tumbleIn`, `runIn`) | Tested easing, deterministic |
| Icons | tabler (`eye`, `map-pin`, `camera`, `search`, `clock`, `scale`) | No logos needed; the camera maker is never shown |
| Audio | Local **Kokoro** voice (`am_michael`, base ≈1.08) with word timestamps; `sfx.py` five-cue score + new SFX (shutter tick, camera servo, typing, redaction rasp, stamp) | Tick motif needs a clean synthesized click with fixed pitch so the closing single tick reads as a callback |
| Cover | Grid-first template: photoreal pole-camera crop, big plate-shaped title "NOTES ON YOUR CAR" (≤5 words), face chip bottom-right, accent from this reel (highway green/amber) | |

## Rules from CLAUDE.md applied here
Frame 0 fully composed; voice from 0.00 s; no scene transition before 3 s; captions word-by-word, band y 1330–1490 reserved, dark pill; safe zone (x 150–918, y 140–1536); mid-scene density — key layers enter within 0.7 s of each scene start; eyebrows content-specific (checked: none is an outline label like "the reveal"); CTA ≥3 s with profile photo + handle; a "AI IMAGE" tag on every generated photo; strict validation (`check.mjs`, contact sheets, final-MP4 frame review) before any MP4 is sent; render at Full HD; ≤30 MiB share encode.

## Next steps (awaiting your go)
1. **Mockup (per the identity rule):** 3 scenes — 1 (windshield + reticle), 3 (plate + data tags), 6 (search UI) — in the Highway Signage system for approval.
2. Generate the 8 stills + depth maps in the background while you review.
3. Full build → lint + contact sheets → render → cover, caption, hashtags.
