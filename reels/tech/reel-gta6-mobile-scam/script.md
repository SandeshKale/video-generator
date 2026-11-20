# "GTA 6 ka mobile download: game nahi, virus" — script, style, shot list

Folder: `reels/tech/reel-gta6-mobile-scam/` · Hinglish voice-over only · nerdlogic.co end card · CTA "follow aur share" · target ~80 s (the story earns it: 222 words at ~2.7 w/s)

## Why this reel (data + topic)
- Creator plan 20 Nov 2026 ("next GTA VI topic"): launch was 19 Nov, the search "GTA 6 mobile download" is live, and the scam wave (fake installers, APKs, betas, giveaways) is documented by security firms. It is the natural sequel to `reel-gta6-vice-city-real`, which ended on "phone pe nahi".
- Account data: GTA-linked and film-linked reels did best (see `insights/`); a question hook + myth-bust + protective forward is the proven lane. Audience is phone-first and mostly console-less, so "kya phone pe chalega?" is *their* question.
- Facts and tiers: `research/sources.md`. Corrections to the plan are listed there (whole-PS5 ~200 W instead of "chip 180 W"; throttling numbers are 20-minute stress tests on named flagships, not "10 minutes of a game"; Netflix trilogy / Remote Play / GadgetsNow dropped).

## Storytelling gate (docs/STORYTELLING-GUIDE.md)
- **Protagonist:** the viewer's own phone (and their bank account). **Obstacle:** a download that looks free. **Reversal:** the "game" is the malware, and the phone physically cannot run the real one. **Honest ending:** the only official GTA on mobile is Rockstar's old San Andreas, from the official store; the throttling tests are harsher than games.
- **One-sentence test:** "Searching for a GTA 6 mobile download gets you malware, because the game is console-only and a phone's chip would throttle long before it could run it."
- But/Therefore chain: you search → BUT the file is malware (s1-s2) → THEREFORE check the truth: console-only (s3) → BUT why not phone? 10 lakh crore operations a second and ~200 W (s4-s5) → THEREFORE a phone heats and slows down (s6-s7) → BUT you can still play real GTA on a phone, the official one (s8) → THEREFORE forward this (s9-s10). Open loop planted in s1 ("virus"), paid in s2/s9; "garam chip" planted in s5 (pankha, heat sink), paid in s6.

## Style (Lemo-Opuscar record)
- **Style:** `thermal-camera` (read in full 20 Nov 2026), runner-up `security-xray`.
- **Why it fits:** the story's physics is heat (a console that needs a fan and 200 W vs a phone that cannot shed heat), and the style's native move "two eyes, one place" lets the same desk show the ordinary picture first (the fake download card) and the heat picture when the physics starts. The scan line is the cut between the scam half and the hardware half and back at the payoff.
- **Invariants kept:** (1) temperature is the picture: grayscale temperature render mapped through one iron palette with a visible scale bar; (2) it looks like a sensor (coarse grid, noise, column stripes, softness); (3) instruments are diegetic (scale with range, spot meters with readings, REC timestamp), plus one pale-green verdict colour reserved for the payoff.
- **What we adapt:** the visible half is a real PBR render (graphite desk, phone and console as simple objects, our own screen graphics); instruments are 3D text rendered by Blender in an overlay pass; palette: graphite ground, iron palette for heat, tomato for scam, pale green `#7DFFA0` for verified-official only.
- **Our rules win:** vertical 1080×1920 / 30 fps, authored camera (locked between moves), no cartoon people (no people at all), honesty labels (ILLUSTRATIVE temperatures; stress test ≠ game), plain 40 px captions, Blender renders everything that moves.

## Visual identity
Graphite desk `#101418`, iron palette (black → indigo → magenta → orange → yellow → white) for heat, tomato `#ff4b3a` for the scam, pale green `#7DFFA0` for official. Anton (headlines) + IBM Plex Mono (instruments) + Inter (captions). Not the supermoon night-blue, not the GTA map navy.

## Benchmark to beat (previous reel: `reel-supermoon-illusion`)
Ceiling: first Blender-first film (3 shots, locked labels, simple objects). This reel adds: (1) **a two-pass thermal pipeline** (grayscale temperature render + sensor simulation + diegetic instruments), (2) **a scene that changes state with the story** (the same desk goes visible → heat → visible), (3) **animated data objects built in Blender** (TFLOPS/RAM/watt bars growing beside the console, a throttle bar that falls as the phone heats), (4) real PBR hardware props at honest relative scale.

## Asset families per scene (target ≥ 5)
| Scene | Primary visual | Families |
|---|---|---|
| s1-s2 scam | phone + fake download card, MALWARE stamp slam | Blender 3D props, own screen texture (PIL), 3D kinetic type, earshot SFX |
| s3 truth | console box vs phone box, check/cross markers | Blender 3D props, data markers |
| s4-s5 power | thermal desk: TFLOPS/RAM/watt bars, fan spin | thermal sensor sim, animated data objects, earshot drone/whoosh |
| s6-s7 throttle | phone hotspot rises, speed bar falls | thermal sim, data object, spot meter instruments |
| s8 official | visible desk, official-store card (text only, no Rockstar art) | Blender PBR, own screen texture, audio family |
| s9-s10 CTA | pull-back, shield, end card | Blender, end-card DOM, cloned voice |
Families used: 6 (Blender 3D props, own screen textures, thermal sensor simulation, animated data objects, kinetic 3D type, audio family: earshot SFX + cloned voice). Audit: no family in more than 4 scenes, no scene with fewer than 2.

## Shot list (camera locked between moves, authored keys)
| t (from voice) | line | camera | object | label |
|---|---|---|---|---|
| s1 0-4 s | hook | push-in 0.5 m on the phone, locked at 1.5 s | phone, fake card, MALWARE stamp drops on "virus" | "GTA 6 MOBILE?" / "= VIRUS" |
| s2 | security firms | locked, stamp already down; card shows generic "installer.apk" | phone | "PASSWORD STEALER" tag |
| s3 | console only | truck right to console box, phone left, ✓ / ✗ markers on "sirf PS5 aur Xbox", "mobile: not announced" | console, phone | platform chips |
| s4 | 10.28 TFLOPS | scan line crosses to thermal view; crane up 0.4 m; bars grow on the numbers (10.28, 16 GB) | console + phone | TFLOPS / RAM bars, scale bar |
| s5 | ~200 W | locked; watt counter rolls to ~200; console fan spins, hot-spot tracker on the exhaust | console | spot meter "Sp1", "~200 W" |
| s6 | throttling | dolly to the phone; hotspot rises 31→46 °C ILLUSTRATIVE; speed bar falls 100→45 % | phone | spot meter "Sp2", speed bar, "STRESS TEST ≠ GAME" |
| s7 | tests harsher | locked | phone | small note |
| s8 | official | scan line back to visible; push to phone showing official-store card | phone, card | "OFFICIAL STORE ONLY" in pale green |
| s9-s10 | forward it | pull-back, shield; end card | phone + shield | end card |

## Audio brief
Cold sparse score (glass/celesta, a low pulse that quickens in s4-s6), a faint fan hum under the thermal half, scan sweep (earshot riser) at the cuts, stamp thud on "virus", counter ticks on the bars, fan whoosh, throttle "down" tone, official-store soft ding on s8, CTA chime. Earshot bank first; Openverse CC0 only if a host downloads (freesound CDN and Wikimedia were blocked on 19 Nov).

## Guardrails
Never show or link a real scam site/APK; the fake card is our own graphic. Zero Rockstar assets or logos; "official store" card is typography only. "Announce nahi hua", never "kabhi nahi". Throttling = reviewed flagships in 20-minute stress tests; real games usually load chips less (voiced in s7). Temperatures are ILLUSTRATIVE.

## Delivery notes (as built, 20 Nov 2026)
- **Film:** one continuous Blender (Cycles CPU) world, 12 fps source at 720x1280 upscaled to 1080x1920 (Lanczos + light sharpen), 892 frames; thermal half = grayscale temperature pass -> iron palette + sensor simulation + a separate overlay pass for the instruments; scan-line wipes between visible and thermal. Cues come from the voice words (`blender/film.py` reads `site/timing.js`).
- **Measured:** ~7-9 s/frame (visible 9, thermal 3 passes ~8) -> ~2 h for the film; page render 12 chunks ~15 min.
- **Voice:** OmniVoice clone, 10 breath groups, speed 0.92; every sentence heard (Whisper spells GTA/Latin words oddly); the CTA take was heard as "follow शेर करिये nerdlogic .co" ("और" not heard): **needs one human listen**; the "10.28 teraflops" line (g4) should also be listened to.
- **Audio:** earshot bank renders on picture moments (stamp riser + sub + impact, scan risers/whooshes, tinks on the bars, downlifter on the throttle, bells on the official card, CTA chime) + a thermal-camera fan hum under the thermal half; no Openverse file (hosts blocked); mix -14.4 LUFS, -1.2 dBTP, voice over music+SFX median 21.4 dB, p10 14.0, min 8.6 dB on soft word tails (below the 13 dB target). Not auditioned.
- **Validated:** `overlay-lint` 0 findings (0.5 s step, 149 samples); contact sheets of the film and of the final MP4 incl. both scans and the end card; label overprint at s9 found on the film sheet and fixed (official labels end at s9) and the last three segments re-rendered; cover checked at phone size.
- **Known limits:** console is a generic "PS5-class" model; 12 fps source; thermal temperatures illustrative; labels are English only; voice and mix not auditioned; Openverse not used. `blender/anim.py` is kept because `cover_hero.py` reuses its hook scene.
