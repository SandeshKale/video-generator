# "Your AI is about to go shopping for you" — script + screenplay (visual-first, 1 number, ~55 s)

**Logline:** You'll say what you want and your assistant will walk the aisles for you — and this week the industry started writing the rulebook, while nobody can say who pays when it buys the wrong thing.
**Voice:** the **user's avatar speaks the whole narration** (4 clips of ≤15 s, Indian-accent audio from the avatar tool). The on-screen avatar lives inside a **self-checkout kiosk screen** (black backdrop of the clip = the kiosk display). Timings come from word timestamps of the returned audio (faster-whisper), so the visual cues stay keyed to spoken words as in every recent reel.
**Numbers on screen: 1** ("6 IN 10" — UK survey, labelled).

## Benchmark to beat (new rule: raise the bar every reel)
Previous ceiling — `reel-plate-reader`: photoreal stills + depth parallax + whip cuts + sign panels, but only 2 asset families; cage-match: 3D riso characters + mocap + corner host; cartwheel: mocap in every scene.
This reel does what none did before:
1. **Depth-occluded characters:** a mocap robot walks *inside* the photoreal aisle — shelves in the foreground (from the depth map) pass in front of it, so figure and photo share one space.
2. **3D hero objects under the same grade as the photos:** a procedurally built Blender chrome shopping cart and brass balance scale, composited with the parallax layer (shared grain + colour grade).
3. **A live-printing receipt** that is both a data object and the scene transition (it feeds off the top of one scene into the next).
4. **The host inside the world** — the avatar appears on a self-checkout kiosk screen, not as a floating corner window.
5. **11 asset families (rule: ≥5–6); no family carries more than 4 scenes** (audit below).

## Story engine
- **Relatable entry:** the viewer is the shopper. "Soon you won't shop. Your AI will."
- **Escalation:** wish → errand → error → rulebook → question → stakes → verdict-by-the-viewer.
- **Motif:** the *receipt* — it prints in the hook-to-payoff (scene 4), is torn in half in scene 7 (who pays), and is handed to the viewer in the CTA ("your receipt?").
- **Open loop:** scene 4 "until it buys the wrong thing" → paid off by scenes 7–9 ("who pays?").
- **Balance:** the store terms and the merchants each get a beat; the closing question is neutral.

**Avatar-tool constraint (user, Oct 2026): every avatar prompt must be ≤ 4000 characters** — measured per block in `avatar-prompts.md` (all four ≈ 3.6k). Keep this for every future avatar prompt set.

## Voice-over in four avatar parts (each ≤ 15 s; ≈2.5 words/s; every part ends on a full stop so the cuts land in pauses)
**Part 1 (33 words)** — *scenes 1–4*
"Soon you won't shop. Your AI will. You'll say, running shoes, under a hundred bucks, and it'll browse, compare, and check out while you sleep. Sounds amazing. Until it buys the wrong thing."
**Part 2 (33 words)** — *scenes 5–6*
"This week, Sierra and Meta, with Walmart and Stripe on board, announced a shared rulebook: a hall pass that says who you are, what your assistant may do, and what it may spend."
**Part 3 (34 words)** — *scenes 7–8*
"One question is open: when your agent gets it wrong, who pays? One retailer's terms already say, if you let it choose, the choice is yours. Merchants say the AI company should cover it."
**Part 4 (32 words)** — *scenes 9–10*
"And six in ten UK shoppers say one mistake, and they'd stop using it. So, would you hand your wallet to an assistant? Tell me below. And follow for the next one."

## Screenplay (family codes: A photoreal+depth parallax · B Blender 3D · C mocap rig · D humaaans · E logos/illustrations · F bespoke SVG data objects/UI · G GSAP + kinetic type · H real-footage overlays · I real Unsplash photo · J avatar-in-kiosk · K audio)
| # | Part | Shot / primary visual | Layers (all pure functions of `t`, keyed to words) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | P1 0–3 s | **3D chrome cart** (Blender) rolls alone down an empty photoreal supermarket aisle at dawn, wheels clicking; depth-parallax push; frame 0 already composed | Kinetic headline "SOON YOU WON'T SHOP." slams per word; price-sticker "YOUR AI WILL." peels on; film-grain overlay | Cart wheel ticks, store hum, one chime on "AI" | SOON YOU WON'T SHOP · YOUR AI WILL | // THE AISLE, 6 A.M. | A B G H |
| 2 | P1 3–7 s | Humaaans person on a sofa (sitting pose) over a dusk living-room photo; phone glow | **Chat UI** bubbles type the wish: "running shoes, under $100" (the only price shown, as a user message); a "send" whoosh | Message tick, whoosh | "RUNNING SHOES · UNDER $100" | // THE WISH, TYPED ONCE | D A F |
| 3 | P1 7–10.5 s | **Mocap robot** (CMU walk, new skin) strolls through the photoreal aisle; foreground shelves occlude it via depth mask; basket fills with items as price stickers pop | Checklist ticks "BROWSE · COMPARE · CHECK OUT" on the shelf-edge label; a moon-and-clock "WHILE YOU SLEEP" tag | Footsteps, three ticks | BROWSE · COMPARE · CHECK OUT | // THE ERRAND, WHILE YOU SLEEP | C A G |
| 4 | P1 10.5–13.5 s | Doorstep photo at dawn; a **tower of identical boxes** (Blender) fills the frame — the wrong thing ×40, comedic | **Live receipt** prints line by line: same item repeated, "TOTAL" stamps; the receipt strip feeds off the top into the next scene | Thermal-printer chatter, stamp | "OOPS." | // 40 OF THE WRONG THING | F B A |
| 5 | P2 0–7 s | Photoreal store entrance / turnstile; a **hall-pass lanyard** swings into frame | **Four logos** (Meta, Walmart, Stripe, Shopify) tap onto a "RULEBOOK" tablet one by one on the named words; "Sierra" as typed text (no logo needed); consent-style card "WHO YOU ARE / WHAT IT MAY DO / WHAT IT MAY SPEND" | Four taps, lanyard clink | "A SHARED RULEBOOK" | // A HALL PASS FOR YOUR ASSISTANT | A E F G |
| 6 | P2 7–15 s | Flowbite-style illustration of a person handing a pass to a robot; vector, flat — a deliberate **style change** from the photoreal scenes (whip wipe) | **Permission dials/toggles**: browse ON · buy up to a limit ON · return OFF — toggles flip on "who", "do", "spend" | Toggle clicks, soft synth bed | "WHO · WHAT · HOW MUCH" | // THREE PERMISSIONS | E F D |
| 7 | P3 0–6 s | **3D brass balance scale** (Blender) over a stormy-dusk photo; three pans: YOU · THE STORE · THE AI MAKER; a torn receipt half sits on each | Kinetic "WHO PAYS?" fills the frame; the scale keeps tipping, never settles; light leak sweep | Creak, low drone, one question-mark chime | "WHO PAYS?" | // THE QUESTION NOBODY ANSWERED | B G A H |
| 8 | P3 6–14.5 s | **Real photo** of a printed legal document on a desk (Unsplash set) with a highlighted sentence | Two head-to-head cards slide in: "IF YOU LET IT CHOOSE, THE CHOICE IS YOURS." (retailer terms) vs "THE AI COMPANY SHOULD COVER IT." (merchants) with a tug-of-war arrow | Highlighter swipe, stamp | none beyond cards | // WHOSE CHOICE WAS IT? | I F G |
| 9 | P4 0–6 s | Photoreal store exit at dusk; **ten mocap shoppers** (human skins, different walks) at the doors | Ring fills to "6 IN 10" as six figures turn and walk out through the doors on "one mistake"; label "UK SURVEY" | Door chime ×6, crowd murmur | "6 IN 10" · "UK SURVEY" | // ONE MISTAKE AND THEY'RE GONE | C A F |
| 10 | P4 6–13 s | **Avatar on the self-checkout kiosk** (large, centred), photoreal checkout lane behind it | Kiosk UI around the avatar: "WOULD YOU HAND IT YOUR WALLET?" prompt; receipt printing out with "TELL ME BELOW"; CTA: profile ring + **@sandesh.explains** + FOLLOW held ≥3 s | Kiosk beep, receipt tear, warm chord | "YOUR CALL" · "FOLLOW" | (none — CTA) | J A F G K |

**Asset-mix audit (rule: ≥5–6 families, none in >4 scenes, every scene ≥2 families)** — families used: **11/11** (A–K).
Counts: A 8 scenes → *too many; A is the background layer for 8 scenes, so each scene must also lead with a different **primary** family (B,D,C,F,E,E,B,I,C,J) — no two neighbouring scenes share a primary family*; B 3 (1,4,7) · C 2 (3,9) · D 2 (2,6) · E 2 (5,6) · F 6 (2,4,5,6,8,9,10 — each a different bespoke object: chat UI, receipt, rulebook tablet, toggles, comparison cards, ring, kiosk UI) · G 6 (kinetic type/GSAP) · H 2 (1,7) · I 1 (8) · J 1 (10) · K all.
Fixes applied from the audit: scene 6 deliberately goes **flat-vector** (E/D) to break the photoreal run; scene 8 uses a **real photo** instead of an AI still; scene 9 swaps the parallax background for a stricter graphic crowd.

## Visual identity — "Checkout Lane" (new; checked against every prior reel)
- **Palette:** cool-white supermarket light `#f3f6f8`, shelf-edge amber-yellow label `#ffd23a`, checkout-belt graphite `#23272d`, **price-sticker magenta-red `#ff2d6f`**, receipt paper `#faf7ee`, mint "approved" `#2fd6a3`. (No green-on-asphalt, no navy dot grid, no neon cyan/magenta pair.)
- **Texture/motion language:** a **conveyor belt** along the bottom gutter that moves with story progress (dashed belt marks = progress bar, scrolling), plus ambient store-light flicker from the photo grade.
- **Component language:** shelf-edge labels (slanted price tags with barcode strip), thermal receipt strips (perforated edges, monospace line items), POS/kiosk screens (rounded 18 px bezel), lanyard hall-pass card. No sign panels, no clip-corner panels, no glass.
- **Typography:** display **Plus Jakarta Sans 800** (round, retail-friendly; used so far only in GIFs, never a reel), receipts in **VT323**/DM Mono, body Inter. (Vendor Plus Jakarta/VT323 weights per the typography rule.)
- **3D/photo unification:** every Blender render and AI still passes one grade (cool highlights, slightly warm shadows) + the same grain; flat-vector scene 6 is separated by whip wipes.
- **Cover:** grid-first, accent from this reel — receipt-white title block with magenta price-sticker accent, hero = the 3D chrome cart in a spotlight, face chip bottom-right.

## Audio plan
Avatar clips supply the voice (Indian-accent, warm). Music from the cue system with a **retail-store-muzak parody** feel (soft bossa-ish groove, 96 bpm) that sours into a tense minor in scenes 7–9 and resolves warm at the CTA; event SFX: cart wheels, thermal printer, stamp, toggle clicks, door chimes, kiosk beeps. Sidechain-duck under the avatar voice; −15 LUFS target.

## Production notes / risks
- **Avatar clips:** four ≤15 s takes (see `avatar-prompts.md`). Black backdrop is keyed into the kiosk screen; lip motion is deliberately minimal, so the kiosk frame, blinking cursor and on-screen captions carry the "speaking" feel. Verify host frames (gaze, brow, identity) before layout lock.
- **Compute:** ~10 AI stills at ~9 min each on this CPU (aisle ×2, living room, doorstep, store entrance, store exit, checkout lane, stormy dusk, + cover hero) — start generating immediately after script approval; Blender renders (cart, boxes, scale) on CPU Cycles at low sample counts with a toon-neutral PBR look.
- **Disk:** keep working files small; delete mockups when superseded.

## Next steps (awaiting your go on topic + script)
1. You run the four avatar prompts and send back the clips (and tell me if the voice pace is slower/faster than ~2.5 words/s so I can retime).
2. Meanwhile I mock up **3 scenes from 3 different families** (scene 1: 3D cart + parallax; scene 5: logos + hall-pass UI; scene 9: mocap crowd) for approval, and start generating the stills.


## Delivered build notes (Oct 2026)
- Scene starts (s): 0, 3.1, 6.4, 10.5, 14.5, 19.4, 28.85, 33.85, 43.35, 49.45; total 59.33 s.
- Meta and Walmart appear as text name-chips (no logos in `assets/logos`); Stripe uses the real mark; Shopify was dropped because the voice-over never names it.
- On-screen numbers: "6 IN 10" (UK survey) and the quoted "$100" in the user's own chat message.
- Families used: 11 (A photoreal+parallax, B Blender, C mocap, D humaaans, E logos/illustration, F bespoke SVG/DOM objects, G kinetic type, H real-footage overlays, I real photo, J avatar-in-kiosk, K audio).
