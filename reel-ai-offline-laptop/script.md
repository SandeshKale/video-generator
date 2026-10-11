# "Wi-Fi off. AI on." — script + screenplay (tutorial reel, ~70 s, 5 avatar parts)

**Logline:** A private AI that still answers when the Wi-Fi is off — set up in three steps: install Ollama, pick a model that fits your memory, flip the Wi-Fi off. Plus one bonus (it's an API) and two honest catches.
**Format:** *teach-a-trick.* Every step shows the exact command big, typed, and held long enough to screenshot; a numbered step board tracks 1/3 → 3/3; the last scene is a **save-worthy recap card** (the Save button is this format's CTA, next to Follow).
**Voice:** the creator's avatar, 5 clips ≤15 s, **new subtler prompt style** (see `avatar-prompts.md`). Word times from faster-whisper, as before.
**Numbers on screen (all tier A, ollama.com 11 Oct):** 3 steps · 16 GB RAM · 14 GB (gpt-oss:20b) · 6.6–9.5 GB (gemma4:e4b) · 128K context · port 11434. No speeds, no benchmark scores.

## Benchmark to beat (standing rule)
Previous ceiling — `reel-ai-adobe-clones` ("Fine Print", 73 s, 11 families): host choreography, moving Blender objects (layer stack, turnstile), depth-occluded robot crew, five bespoke objects, wall→code-rain dissolve. Its **measured weaknesses**: (1) the Blender turnstile read as a pedestal, not a gate — 3D objects must be *instantly* legible at phone size; (2) several scenes' lower thirds stayed empty (S8, S9); (3) nothing was *teachable* — no step-by-step, no copy-ready command; (4) the host only changed border colour, never reacted to the content; (5) avatar subtitles were burned into the clips (cropped, costing resolution); (6) 3 of 5 render slices crashed under 4-way parallelism; (7) the mix was never auditioned.
This reel does what none did before:
1. **A real tutorial grammar:** numbered **split-flap step board** (new component — digits/letters flip per `t`), a **copy-ready command box** (large mono, typed char by char, highlighted token, held ≥ 2 s), step tracker `1/3 → 3/3`, and a **recap card** built to be screenshotted.
2. **Streaming terminal:** a `t`-driven terminal where a prompt is typed and the answer *streams* token by token (clearly labelled illustrative), with a live **Wi-Fi bar meter that decays to 0** and an **airplane-mode switch** that flips on "off" — the whole frame's *cloud* elements (cloud icon, ↑↓ arrows) drain to grey the instant it flips (a pure-`t` grade on those layers).
3. **"Will it fit?" memory bins:** robots (mocap, depth-occluded behind the real racks again) carry crates sized by *real* download sizes (gemma4:e2b 4.6–7.5 GB … gpt-oss:20b 14 GB … 120b 65 GB) into 8 / 16 / 24 GB RAM bins; the 120b crate doesn't fit anything. Data object + character + 3D in one.
4. **Blender done properly this time:** a **laptop whose lid opens (12-frame sequence scrubbed by `t`)** and a **power-plug-pulling-out-of-a-cloud** sequence; both designed first as silhouettes and checked at thumbnail size. Lit to match the runway/airport photos.
5. **Host reacts:** the host tile shows a live `WI-FI` badge that goes OFF with the meter; on "bonus" it pops a `localhost:11434` chip; on the catches it narrows to a "careful" stance (tile shrinks, border → coral).
6. **QA upgrades:** the occupancy check from the last reel stays (≥65 % at +0.4 s/+1.5 s), render slices run **2 at a time** (no crashes), `ebur128` + **a spectral voice/music balance check**, and the host crop rule (burned-in subtitles) is built in from frame 0.

## Story engine
- **Relatable entry:** everyone is tired of subscriptions and "is my data safe in the cloud?" Open with the proof (Wi-Fi off, still answers).
- **Teach in a clean 3 + 1:** install → pick (fit to RAM) → prove (Wi-Fi off) → bonus (local API).
- **Motif:** the **signal bars** — full in the cloud, 0 when local. Cloud = coral (dependency), local = teal (yours).
- **Honest ending:** two catches (slower/less capable than the biggest cloud models *usually*; `-cloud` tags aren't local) before the CTA — credibility is what makes a tutorial get saved.

## Voice-over in five avatar parts (each ≤15 s)
**Part 1 (25 words)** — *scenes 1–3*
"Here's an AI that still answers when the Wi-Fi is off. No subscription. No cloud. It just runs on your laptop. Three steps. Let's go."
**Part 2 (31 words)** — *scene 4*
"Step one: install Ollama. On a Mac or Linux, paste one line into the terminal. On Windows, one line in PowerShell. Or just download the app from ollama dot com. It's free."
**Part 3 (33 words)** — *scenes 5–6*
"Step two: pick a model that fits your memory. Got sixteen gigs of RAM? Run G-P-T O-S-S, twenty B. That's about fourteen gigabytes. Less memory? Try Gemma four, E four B."
**Part 4 (35 words)** — *scenes 7–8*
"Step three: turn the Wi-Fi off. Ask it anything. It still answers, because the model lives on your machine. Bonus: it also runs a local API, so your own apps can talk to it."
**Part 5 (35 words)** — *scenes 9–10*
"Two catches. It's usually slower than the big cloud models, and any model tagged cloud isn't local. Save this for later, tell me which model you try first, and follow for the next hack."

## Screenplay (family codes: A photoreal+depth parallax · B Blender 3D · C mocap rig · D humaaans · E logos/illustrations · F bespoke SVG/DOM objects · G kinetic type/GSAP-style · H real-footage overlays · I real Unsplash photo · J avatar host · K audio). Times ≈ estimates (2.4 w/s), retimed from the clips.
| # | Part · time | Shot / primary visual | Layers (all pure functions of `t`, keyed to words) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | P1 0–3.8 | **Blender laptop, lid already open** on a night-runway photo; host in a wide boarding-pass window above it; frame 0 fully composed | **Wi-Fi meter** (4 bars) top-right; headline "WI-FI OFF." slams; airplane-mode switch flips on "off" and the meter drops to 0; screen of the laptop glows teal | switch click, power-down blip, soft chime | WI-FI OFF. · AI ON. | // WI-FI OFF, AI ON | B A F G J |
| 2 | P1 3.8–8 | **Blender plug pulling out of a cloud** (frame sequence) while coral chips SUBSCRIPTION and CLOUD get crossed out | Cloud icon drains to grey; "RUNS ON YOUR LAPTOP" teal sticker; host tile shrinks to corner | plug pull, 2 stamps | NO SUBSCRIPTION · NO CLOUD | // UNPLUGGED FROM THE CLOUD | B F G E |
| 3 | P1 8–12.6 | **Split-flap step board** flips in: `1 INSTALL · 2 PICK A MODEL · 3 WI-FI OFF · +1 BONUS: API`; runway centre-line dashes rush toward camera | Flip digits settle row by row; "3 STEPS" boarding-pass ticket | flaps ×12, ding | 3 STEPS | // THE ROUTE | F G A H |
| 4 | P2 0–14.4 | **Step 1 — Install.** Three terminal/OS panels: macOS·Linux `curl -fsSL https://ollama.com/install.sh \| sh`, Windows `irm https://ollama.com/install.ps1 \| iex`, or "DOWNLOAD THE APP · ollama.com"; step tracker 1/3 | Commands type on their words; copy-ready highlight; Apple + generic OS badges; "FREE" teal sticker; mocap robot hands a boxed installer over the desk | typing, enter, ding | the two one-liners + ollama.com | // STEP 1 · ONE LINE | F E C G |
| 5 | P3 0–7.5 | **Step 2 — Will it fit?** memory bins 8 / 16 / 24 GB; robots carry crates (4.6–7.5, 6.6–9.5, 7.7–8.0, **14**, 16–19, 19–20, **65** GB) — the 65 GB crate bounces off | Bin lights teal when a crate fits, coral when not; "16 GB → gpt-oss:20b (14 GB)" caption chip | crate thuds, buzz | 16 GB · 14 GB · 65 GB doesn't fit | // STEP 2 · WILL IT FIT? | C F A G |
| 6 | P3 7.5–14.8 | **Command box** `ollama run gpt-oss:20b` big, typed, held; second line `ollama run gemma4:e4b` (6.6–9.5 GB); chips: OPENAI'S OPEN MODEL · APACHE-2.0 · 128K CONTEXT; photoreal laptop detail (Unsplash) behind | Highlighted `gpt-oss:20b` token pulses; OpenAI logo (nominative) + Google DeepMind text chip | typing, enter | `ollama run gpt-oss:20b` · `ollama run gemma4:e4b` | // STEP 2 · THE COMMAND | F I E G |
| 7 | P4 0–8 | **Step 3 — Wi-Fi off.** Airplane-mode switch flips; Wi-Fi meter 4 → 0; **streaming terminal**: a prompt is typed ("Explain DNS like I'm ten") and the answer streams in (illustrative); cloud layers go grey | "ILLUSTRATIVE OUTPUT" tag; host tile WI-FI badge OFF; humaaans person leaning back with a mug | switch click, stream ticks, ding | WI-FI OFF · STILL ANSWERS | // STEP 3 · WI-FI OFF | F B D J |
| 8 | P4 8–14.5 | **Bonus — it's an API**: node diagram YOUR APPS → `localhost:11434/v1` → MODEL with a small code snippet (`base_url="http://localhost:11434/v1"`), "OPENAI-COMPATIBLE" chip | Packets travel along the wire; Blender plug (re-used, now plugging *into* the laptop) snaps in | plug snap, packet blips | `http://localhost:11434/v1` | // BONUS · IT'S AN API TOO | F B G |
| 9 | P5 0–8 | **Two catches**: card 1 "USUALLY SLOWER THAN BIG CLOUD MODELS" (speed gauge icon, no numbers); card 2 model list: `gpt-oss:20b` ✓ vs `gpt-oss:20b-cloud` ✗ with a coral cloud badge "RUNS ON OLLAMA'S SERVERS" | Host tile narrows into "careful" stance; wall of coral cloud icons | warning ping ×2 | -cloud ≠ local | // TWO CATCHES | F G E J |
| 10 | P5 8–end | **Recap card** (boarding-pass style): `1 INSTALL · 2 RUN A MODEL THAT FITS · 3 WI-FI OFF · +API`, a **Save** icon pulses; **CTA**: profile ring + @sandesh.explains + FOLLOW held ≥3 s | Card is screenshot-sized and stays ≥ 2.5 s before the CTA enters beside it | ticket tear, warm chord | SAVE THIS · FOLLOW | (none — CTA) | F D G J K |

**Asset-mix audit (≥ 5–6 families; none primary in > 4 scenes; every scene ≥ 2 families):** families used **11/11**. Primary visual per scene, chosen so no two neighbours match: **B** (laptop) · **B** (plug/cloud) · **A** (full-bleed runway photo, flap board as overlay) · **F** (install terminals) · **C** (robots + memory bins) · **I** (real laptop photo leads, command box overlays) · **F** (streaming terminal) · **B** (Blender laptop/plug leads, diagram overlays) · **E** (model-list illustration with logos) · **D** (humaaans person screenshotting the recap card). Counts: B 3, F 2, A 1, C 1, I 1, E 1, D 1 — within the ≤ 4 rule; every scene carries ≥ 3 families (see table).

## Visual identity — "Airplane Mode" (checked against every prior reel)
- **Palette:** runway charcoal `#15181b`, boarding-pass cream `#f4ecd8`, **signal-teal `#19c2b4` = local / yours / ON**, **alarm-coral `#ff5a45` = cloud / dependency / OFF**, taxiway amber `#ffbf3c` (small highlights only). New to reels: no teal+coral+charcoal combination exists so far.
- **Texture / motion language:** a **night-runway perspective** — dashed centre-line and edge lights streaming toward camera (pure `t`), replacing walls/rain/dots/belts; it slows to a stop when the Wi-Fi goes off ("parked").
- **Component language:** **boarding-pass tickets** (perforated tear-off edge, barcode strip, route line), the **split-flap departure board**, the **terminal pane**, **signal-bar meter**, **airplane-mode switch**. No windows-with-traffic-light dots (that was Fine Print), no POS bezels, no receipts.
- **Typography:** display **Unbounded 800/900** (extended — size headlines for ≤ 760 px, the lint catches overflows), **Space Mono 700** for commands/boarding-pass fields, **Inter 700** body; cover in **Anton**.
- **Characters:** humaaans poses not yet used (shopping: sit2, st20; adobe: st5, sit4) — e.g. `sit3`, `st12`, `st18`; teal/coral/cream overrides. Mocap robots for the bins scene use a cream/teal skin.
- **Cover (grid-first):** hero = the open Blender laptop with a huge "no Wi-Fi" symbol; title ≤ 5 words **"WI-FI OFF. AI ON."**; accent teal on charcoal with cream title block; face chip bottom-right.

## Audio plan
Avatar clips = voice. Score: **airport-lounge chill** (soft pads, slow bossa pulse) for the hook; **tidy steady groove** for steps 1–2; a **hush** (cue drops to near-silence, only room tone + the stream ticks) for step 3 to sell "offline"; bright resolve for the CTA. SFX: switch click, plug pull/snap, flaps, typing, crate thuds, stream ticks, warning pings, ticket tear. Sidechain-duck under the voice; −15 LUFS; verify with `ebur128` and a voice-vs-music band check.

## Production notes / risks
- **Illustrative output only** — we do not claim a measured run. On-screen disclaimer in scenes 7 and 9.
- **Pronunciation:** "Ollama" (oh-LAH-muh), "G-P-T O-S-S", "Gemma", "E four B", "A-P-I", "PowerShell"; part 3 may need the shortened line if the tool trips on the model names.
- **Brand use:** Apple/OpenAI marks only nominatively; "Ollama" and "Gemma" as text (no logos in the library).
- **Compute:** one new photo (night runway, ~7 min), laptop lid sequence (12 frames), plug-and-cloud sequence (10 frames) in Blender — render **before** anything else so CPU isn't contended. Keep disk > 1 GB free.

## Next steps (awaiting your go on topic + script)
1. You run the 5 avatar prompts (new, subtler style) and send the clips; **generate Part 1 first and eyeball it** — if it still feels too performed, tell me what and I'll tighten once more before you run the rest.
2. Meanwhile I mock up **3 scenes from 3 families** — scene 1 (B laptop + F Wi-Fi meter), scene 5 (C robots + F memory bins), scene 7 (F streaming terminal + switch) — for approval, and start the Blender renders and the runway still.
