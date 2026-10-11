# "A trading bot that can't panic." — Claude + TradingView pipeline (tutorial reel, ~80 s, 6 avatar parts)

**Logline:** TradingView just plugged straight into Claude. Here's the pipeline, built entirely with Claude, in four blocks, with discipline built in:
1. **Brain:** Claude reads TradingView through the official connector.
2. **Signal:** Claude writes the Pine Script strategy, you backtest it, and you create the webhook alert.
3. **Hands:** Claude Code writes a small webhook server that enforces your risk rules and sends orders to your broker's API.
4. **Supervisor:** a Claude Cowork scheduled task reviews the trade log every evening, and nothing changes until you approve it.

It ends on the honest part (SEBI: 91 % of F&O traders lost money in FY25) and "paper trade first".

**Format:** tutorial / how-to (standing rule):
- a numbered **4-block tracker** on screen throughout;
- **every command big, typed, held ≥ 2 s**;
- an honest catches beat;
- a **save-worthy recap card held ≥ 2.5 s**;
- CTA = Save + Follow.

All facts are in `topic.md` (tier A, read today).

**Why it's compelling:**
- it's a fresh, real news peg (the official TradingView MCP, 16 Sep 2026);
- "build my own trading bot with AI" is a high-desire topic;
- the twist is *discipline*, not riches: a bot that follows your rules and can't panic-sell;
- it's India-specific and current (static IP mandatory from 1 Apr 2026);
- the honest closing stat builds trust, and the steps are save-worthy.

## Benchmark to beat (standing rule)
Previous ceiling: `reel-ai-reads-tokens` ("AI can't read.", 74 s, 11 families). It had:
- real token-split captions;
- a Blender name block that cracks into two;
- a mocap token race;
- an X-ray rhyme board;
- the first **beat-locked score**, **peak-aligned SFX** and a **numeric mix report** (voice over music + SFX: median 19.7 dB, min 11.1 dB).

Its weaknesses:
1. The 3D objects were mostly static props (one split, one spin).
2. The host sat in the same corner tile in most scenes.
3. The real photos were small plates.
4. The scenes cut on an ink wipe with no camera continuity between them.
5. The audio was measured but never auditioned.

This reel does what none did before:
1. **One continuous signal path (new camera grammar, from `OPUS-VIDEOS-NOTES.md` #12).**
   - A single glowing **patch cable** runs through the whole reel; the camera *follows the pulse* from module to module.
   - Every scene change is a **match cut** along the cable (the pulse exits one frame edge and enters the next at the same spot), not a wipe.
   - The cable's colour encodes what travels on it: data (blue), alert (amber), order (red/green), approval (lime).
2. **A Blender modular rack that *changes state*.** Four eurorack-style modules (BRAIN, SIGNAL, HANDS, SUPERVISOR), each a frame sequence where a patch cable is plugged in, its LED lights and its knob turns. Scenes 2, 8 and 13 show the rack filling up block by block; the finished rack is the recap.
3. **A live, deterministic candlestick chart.** A seeded price series is drawn bar by bar as a pure function of `t`; an illustrative EMA-cross strategy marks entries and exits. It's labelled ILLUSTRATIVE, with no P&L numbers.
4. **The real alert JSON on screen,** built from TradingView's documented placeholders (`{{ticker}}`, `{{strategy.order.action}}`, `{{strategy.order.contracts}}`) and typed live. The real `claude mcp add` command is held for the screenshot.
5. **A mocap "doorman" at the risk gate:** a rigged robot checks each order packet (secret ✓, size ✓, daily loss ✓, kill switch ✓) and bounces a bad one. CMU mocap: walk + gesture clips.
6. **Subframe motion blur (TRY from the notes)** on the fast cable whips only. Render those time windows at 3 subframes and `tmix` them.
7. **Audio:**
   - the beat-locked cue system from the last reel;
   - a modular-synth score (arpeggiated sequencer that gains a voice per block);
   - SFX for jack plug-ins, LED blips and the gate buzz, peak-aligned;
   - the mix report shipped again.
   - **New this time:** a listening pass via spectrogram images and loudness curves of every scene boundary, since I can't play audio here.

## Voice-over in six avatar parts (≤ 15 s each; ~184 words, ~80 s)
**Part 1 — hook (29 words)** *(the first ~3 s are the enthusiastic hook line)*
"TradingView just plugged straight into Claude! So I asked Claude to build me a trading pipeline. Not a get-rich bot. A disciplined one, that can't panic. Four blocks."
**Part 2 — block 1, the brain (32 words)**
"Block one: the brain. Add TradingView's official connector to Claude. One command in Claude Code. Now it reads charts, runs screeners, pulls news, and sets alerts. It can't place trades. Good."
**Part 3 — block 2, the signal (33 words)**
"Block two: the signal. Ask Claude to write your strategy in Pine Script, then backtest it in TradingView. The webhook alert, you create yourself. It needs two-factor login and a paid plan."
**Part 4 — block 3, the hands (33 words)**
"Block three: the hands. Claude Code writes a small webhook server. It checks a secret, your risk limits, then sends the order to your broker. In India, that needs a static IP now."
**Part 5 — block 4, the supervisor (29 words)**
"Block four: the supervisor. A Cowork scheduled task reads your trade log every evening, even with your laptop off, and flags anything weird. Nothing changes until you approve it."
**Part 6 — the honest part + CTA (31 words)**
"Now, the honest part. SEBI found ninety-one percent of F&O traders lost money in FY25. A bot just loses faster. Paper trade first. Save this, and follow for the build."

**Claim check per line:**
- "plugged straight into Claude": official MCP connector (fact 1).
- "it reads charts, runs screeners, pulls news, and sets alerts": the documented tools, and alerts are simple price alerts (facts 3–4).
- "It can't place trades": no order tools (fact 4).
- "you create [the webhook alert] yourself… two-factor… paid plan": facts 4–6.
- "checks a secret, your risk limits": our server design, shown as ILLUSTRATIVE code.
- "static IP now": fact 9.
- "even with your laptop off": fact 8; the trade log must live in a connector (e.g. a Google Sheet the server appends to), not on the laptop.
- "91 %… FY25": fact 14.
- "follow for the build": a promise of a follow-up build reel. If you don't want to commit to that, use "follow for more".

## Performance track (host rule: gaze on the lens; ≤ 2 nods per clip; blinks at clause breaks)
| Part · line | Emotion | Brow | Head | Notes |
|---|---|---|---|---|
| P1 "TradingView just plugged straight into Claude!" (0–3 s) | **enthusiastic, newsy, bright** | lively lift on "straight into" | slight lean-in | The energetic hook, kept natural (no shouting, no wide eyes). |
| P1 "Not a get-rich bot. A disciplined one, that can't panic." | dry, knowing smile | slight lift on "can't panic" | one small nod on "disciplined" | |
| P2 "Block one: the brain…" | clear, practical | neutral | still | Dry facts mean stillness. |
| P2 "It can't place trades. Good." | wry, approving | slight lift | small nod on "Good" | |
| P3 "The webhook alert, you create yourself." | firm, clear | slight focus | still | |
| P4 "In India, that needs a static IP now." | serious, a heads-up | slight inner raise | slight lean-in | |
| P5 "Nothing changes until you approve it." | calm, reassuring | relaxed | small nod on "approve" | |
| P6 "Now, the honest part… lost money in FY25." | sober, sincere | slight inner raise | still | No smile here. |
| P6 "Paper trade first. Save this…" | warm, friendly | relaxed | lean-in on "follow" | Dead-on camera. |

## Screenplay
Family codes: A photoreal AI still + depth parallax · B Blender 3D · C mocap rig · D humaaans · E logos/icons · F bespoke SVG/DOM objects · G kinetic type · H real-footage overlays · I real Unsplash photo · J avatar host · K audio. Times are estimates (≈ 2.3 words/s), retimed from the clips.

| # | Part · time | Primary visual | Layers (pure functions of `t`, keyed to words) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | P1 0–3.2 | **The host big**, frame 0 fully composed | A blue patch cable whips in from the top edge and **plugs into a jack labelled CLAUDE** on the host frame on "plugged". A live candle chart starts drawing behind it. Anthropic logo + "TradingView MCP · beta · 16 Sep 2026" chip. | cable whip, jack click, spark | TRADINGVIEW → CLAUDE | — (hook frame) | J F E K |
| 2 | P1 3.2–8 | **Blender modular rack**, 4 empty modules (BRAIN · SIGNAL · HANDS · SUPERVISOR), panel LEDs off | A "GET-RICH BOT" sticker slaps on and is **stamped ✗** on "Not a get-rich bot"; the cable pulse travels to the rack | stamp, LED ticks | NOT A GET-RICH BOT | // BUILT BY CLAUDE, RUN BY RULES | B G F |
| 3 | P1 8–13.6 | **Photoreal night trading desk** (AI image, no people, monitors glowing), depth-parallax push | The 4-block tracker drops in (1 · 2 · 3 · 4); a "CAN'T PANIC" oscilloscope line stays flat while a candle chart swings wildly behind it | tracker clacks | 4 BLOCKS · CAN'T PANIC | // ONE PIPELINE, FOUR BLOCKS | A F G H |
| 4 | P2 0–6.5 | **Command box** (terminal pane), typed and held ≥ 2 s: `claude mcp add --transport http mcp-tradingview https://mcp.tradingview.com/mcp`, then `/mcp` → "authorize in browser" | Tracker 1/4 lit; the rack's BRAIN module gets its cable (Blender frame sequence: jack in, LED on) as an inset | typing, jack click | 1 · THE BRAIN | // BLOCK 1 · ONE COMMAND | F B G |
| 5 | P2 6.5–14.5 | **Blender tool-tile wall:** 35 metal key-caps (25 read, 10 write) light up as CHARTS ✓ SCREENER ✓ NEWS ✓ ALERTS ✓, then **ORDERS ✗** drops in red on "can't place trades" | A humaaans character gives a thumbs-up on "Good."; source chip "tradingview.com/mcp/docs" | ticks ×4, buzz, soft ding | IT CAN'T PLACE TRADES. GOOD. | // WHAT THE CONNECTOR CAN DO | B F D E |
| 6 | P3 0–6.5 | **Pine Script panel** typing an illustrative EMA-cross strategy (labelled ILLUSTRATIVE) next to a **live candle chart** that marks entries/exits as bars draw | A strategy-tester strip with an equity curve and no numbers; tracker 2/4 | typing, entry/exit blips | 2 · THE SIGNAL · BACKTEST FIRST | // BLOCK 2 · YOUR RULES IN CODE | F G K |
| 7 | P3 6.5–14.6 | **The alert JSON typed over a real keyboard photo** (Unsplash, plate with parallax drift), using real placeholders: `{"secret":"•••","symbol":"{{ticker}}","side":"{{strategy.order.action}}","qty":"{{strategy.order.contracts}}"}` | A 2FA padlock clicks shut; chips PAID PLAN · PORTS 80/443 · 3 s TIMEOUT · YOU CREATE IT; the amber cable carries a pulse out | typing, padlock click | YOU CREATE THE WEBHOOK ALERT | // BLOCK 2 · THE ALERT IS YOURS | I F E G |
| 8 | P4 0–7.5 | **Blender rack: the HANDS module** plugs in; the red/green order cable lights | Inset: illustrative FastAPI-style server code (FastAPI logo, nominative) with 3 checks ticking: SECRET ✓ RISK LIMITS ✓ MARKET HOURS ✓; tracker 3/4 | jack click, check ticks | 3 · THE HANDS | // BLOCK 3 · A SERVER YOU OWN | B F E |
| 9 | P4 7.5–14.6 | **Mocap robot doorman at the risk gate:** order packets walk up; 3 pass, and one oversized packet ("QTY 500") is **bounced** | Static-IP card: "API ORDERS NEED A STATIC IP · INDIA · FROM 1 APR 2026", plus "≤ 10 ORDERS/SEC · NO STRATEGY REGISTRATION"; a real Unsplash city-at-night photo behind the card | footsteps, gate buzz, thunk | STATIC IP · NOW MANDATORY | // BLOCK 3 · INDIA'S NEW RULE | C F I |
| 10 | P5 0–7 | **Cowork scheduled-task card:** "Review today's trades · WEEKDAYS 6:30 PM · runs remotely" with a moon icon, laptop lid closed | Tracker 4/4; the rack's SUPERVISOR module lights; a trade-log sheet (Google Sheet style, ILLUSTRATIVE rows) scrolls and one row gets flagged amber | page flips, flag ping | 4 · THE SUPERVISOR · EVEN WITH YOUR LAPTOP OFF | // BLOCK 4 · EVERY EVENING | F D G |
| 11 | P5 7–14.4 | **Approval card on a phone** ("Claude suggests: lower max size 2 → 1 · APPROVE / REJECT") held by a humaaans character | The lime approval cable runs back to the rack; "NOTHING CHANGES WITHOUT YOU" | soft ding on approve | YOU APPROVE EVERY CHANGE | // YOU STAY THE BOSS | D F G |
| 12 | P6 0–8 | **The honest data:** a 100-dot grid with 91 dots turning red, plus a ₹1,05,603 crore counter | Source chip "SEBI study · Jul 2025 · FY25"; "A BOT JUST LOSES FASTER" kinetic line; the candle chart stalls and flatlines | low drone, counter ticks | 91 % LOST MONEY · FY25 | // WHAT SEBI FOUND | F G K |
| 13 | P6 8–end | **Recap card** (save-worthy, ≥ 2.5 s): the **completed Blender rack**, all 4 modules lit, with labels 1 BRAIN (connector) · 2 SIGNAL (Pine + alert) · 3 HANDS (server + limits + static IP) · 4 SUPERVISOR (Cowork task); rules strip: PAPER TRADE FIRST · HARD LIMITS · YOU APPROVE | **CTA**: host ring + @sandesh.explains + FOLLOW + SAVE (≥ 3 s); "Not financial advice" footer | warm resolve chord | SAVE THIS · FOLLOW | (none — CTA) | B J F G K |

**Asset-mix audit:**
- **Families used: 11/11.**
- **Primary visual by scene (no two neighbours match):** J · B · A · F · B · F · I · B · C · F · D · F · B.
- **Primary counts:** B 4, F 4, J 1, A 1, I 1, C 1, D 1. All ≤ 4.
- **Families per scene:** every scene has ≥ 3 families.

## Visual identity — "Patch Bay" (checked against every prior reel)
- **Palette:**
  - brushed-aluminium panels `#d6dade` on graphite `#141619`;
  - cable colours with meaning: **data blue `#2f7bff`**, **alert amber `#ffb000`**, **buy green `#22c55e`** / **sell red `#ff4b4b`** (order cable), **approval lime `#b8f23a`**;
  - panel screen-print in off-white `#eef1f4`.
  The rack-metal + multi-cable system is new; no prior reel used aluminium panels or meaning-coded cables.
- **Texture / motion language:**
  - brushed-metal grain;
  - faint panel screws and silkscreen ticks;
  - **LED meters** and **patch cables with travelling pulses**;
  - one continuous signal path the camera follows, joined by **match cuts**.
  No paper, dots, runways or ink wipes.
- **Component language:**
  - eurorack modules (knobs, jacks, LEDs, silkscreen labels);
  - a terminal pane;
  - a JSON card;
  - a candle chart;
  - a risk gate with checks;
  - a scheduled-task card;
  - a phone approval card;
  - the dot-grid stat.
- **Typography (all new):**
  - **Chakra Petch 700** for headlines and panel labels (technical, squared);
  - **Martian Mono 600** for commands, JSON and tags;
  - **Inter 700** for captions;
  - cover in **Anton** (house rule).
- **Characters:**
  - humaaans: two poses not used in the last four reels;
  - mocap robot doorman: the robot skin re-coloured aluminium + amber.
- **Cover (grid-first, ≤ 5 words):** **"CLAUDE TRADES? NO."** or **"A BOT THAT CAN'T PANIC"**. Hero = the lit 4-module Blender rack with cables; graphite with an aluminium title block; face chip bottom-right.

## Audio plan (carries the last reel's measured mix method)
- **Score:** a modular-synth sequencer that **adds one voice per block** (block 1 bass pulse, 2 arpeggio, 3 drums, 4 pad).
- **Beat lock:** every match cut lands on a downbeat.
- **The honest part:** drops to a single low drone, then a warm resolve for the CTA.
- **SFX:** jack plug-ins, LED blips, typing, gate buzz, page flips, the approve ding. All peak-aligned and band-carved under the voice.
- **Targets:** voice over music + SFX median ≥ 19 dB, min ≥ 11 dB; −14 LUFS, ≤ −1 dBTP.
- **Deliverables:** the mix report plus per-scene spectrogram images.

## Compliance and honesty guardrails (on screen and in the caption)
- **"Not financial advice":**
  - shown in the CTA footer and the caption;
  - no strategy is recommended;
  - the EMA cross is labelled ILLUSTRATIVE;
  - no returns, win rates or P&L numbers are shown.
- **Claude's role:** Claude is shown as **builder and supervisor, never the decision-maker**. Orders come only from rules the viewer writes, and changes need the viewer's approval.
- **Regulation:** the static IP is described as an India rule for API orders (Zerodha and the NSE/SEBI framework). The orders-per-second threshold is shown as "≤ 10/sec: no strategy registration"; for anything more, the screen says "check your broker".
- **Unofficial tools:** no third-party or unofficial TradingView MCPs; only the official connector.
- **TradingView's interface:** not recreated as genuine. Mock alert/JSON cards are generic and labelled ILLUSTRATIVE; logos are used nominatively.

## Risks / open questions for the creator
1. **"Follow for the build":** do you want to commit to a follow-up reel that actually builds the server? If not, Part 6 ends "follow for more".
2. **Broker named on screen:** use Zerodha Kite Connect as the example (its Personal API plan is free and can place orders; it needs a static IP), or keep it generic ("your broker's API")?
3. **Avatar prompts:** they follow the same subtle template, with the energetic 0–3 s hook in Part 1. I'll write them once you approve this script.
