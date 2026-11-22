# Reel: Artemis II "ten seconds" — one launch, six cameras, then the catch (~75 s, Hinglish voice-over, nerdlogic.co)

Status: TOPIC + STYLE + FOOTAGE PLAN, awaiting creator approval before the Blender mockup. Facts and footage: `research/sources.md`.

## Why this reel
Creator brief (22 Nov 2026): "next topic footage-heavy, a new Opuscar style". NASA publishes dozens of **real, multi-camera clips of the same event** (Artemis II liftoff, 1 Apr 2026; splashdown, 10 Apr) that download from this sandbox and are largely free to use editorially. Nothing in this repo has used real footage as the main material; account data favours film/space-linked stories (Ramayana/space reels). Not a repeat of the earlier space reels (Earth, supermoon): this one is footage, not renders.

## Story (storytelling gate)
- **Protagonist:** one liftoff, seen by six cameras at once. **Obstacle/reversal:** the crew went farther from Earth than any humans ever, **but they only looped the Moon; the next flight (Artemis III, 2027) won't go there either; the landing is Artemis IV, early 2028.**
- **One-sentence test:** *Artemis II carried people farther from Earth than ever before, BUT it only circled the Moon, THEREFORE the real landing is two flights away and dated 2028, not next.* ✔
- **Open loops:** "chhe camere, ek pal" (0 s) → "kitni door gaye?" (≈ 35 s) → "utare kyun nahi?" (≈ 50 s) → "agla flight bhi nahi" (≈ 60 s).
- **Beats:** (1) cold open on the pad, six cells assemble; (2) real-time T−10 → 0 with the cell count rising and the clock leading, narrator silent before zero; (3) T+ ascent from four angles; (4) "9 days, 1 hour, 32 minutes later" splashdown; (5) the distance record (press-reported, labelled); (6) the catch: loop, no landing; Artemis III 2027 = Earth-orbit docking; Artemis IV early 2028 = landing; dates may move; (7) CTA.

## Draft script (Hinglish, ear-first, ~140 words, to be tightened)
1. "Ek April, shaam saade chhe baje. Ek rocket, chhe camere, ek hi pal."
2. "Ye Artemis Do hai. Pachaas saal se zyada baad, insaan phir Chaand ki taraf."
3. *(silence; native countdown; T−10 → liftoff)*
4. "Nau din, ek ghanta, battees minute baad, Orion Pacific mein utra, San Diego ke paas."
5. "Beech mein chaar log Earth se itni door gaye, jitni pehle koi insaan nahi gaya. Kareeb chaar lakh saat hazaar kilometre. Press reports ke mutabik."
6. "Par utre nahi. Sirf Chaand ka chakkar."
7. "Agla flight, Artemis Teen, 2027: wo bhi Chaand par nahi jayega. Dharti ke paas lander se docking ka test."
8. "Utarna Artemis Chaar mein hai: 2028 ki shuruaat, NASA ke mutabik. Dates badal sakti hain."
9. "Aisi asli footage wali kahaniyan chahiye? nerd logic dot co ko follow aur share kijiye."
(Spell numbers for TTS; "ESRB"-style acronyms not used; check Whisper's heard text per take; CTA brand pronunciation needs a human listen.)

## Style (Lemo-Opuscar record)
- **Slug: `countdown`** (Live Countdown Split-screen; an edit style: real footage of one event with a known zero, shown in real time, a clock that ticks every second, the screen splitting into more cells as zero nears, one picture at zero). Runner-up: `caption-news`. **New to this repo** (earlier styles: kino-montage, bauhaus-shapes, visual-investigation, data-physical, tilt-shift, …).
- **Why it fits:** topic type = launch / event with a known zero; story shape = anticipation, payoff, then consequence and a catch. Its rules (screen time = event time, cells show the same second, cut points are real calls, silence before zero) turn the NASA multi-camera material into the whole film.
- **3 invariants kept:** (1) real time for the launch window: one mapping `M = t − T0`, every cell synced to the clock or marked "NOT SYNCED"; (2) the clock is the lead (ticks each second, flips state at zero: ground → orange); (3) cell count rises toward zero (1→2→4→6), merges to one picture at zero, a few cells again after zero.
- **What we adapt:** 1080×1920 portrait so cells stack in a 2×3 / 1×3 grid inside the safe zone (y 232–1290, captions 1338–1500); English labels + Hinglish voice, no Chinese; own palette tweak inside the style's rules (ground `#06080A`, accent orange `#FF5B1F` stays the "now/synced" colour); plain 40 px captions (creator rule) instead of the style's transcript box; the narrator's Hinglish is marked orange; slow-motion sources are used only if played at real speed or labelled "SLOW-MO ×N".
- **Burned-in text:** the Orion camera's UTC clock and the flag shot's mission timer are used to sync, then cropped or `delogo`'d; NASA insignia never shown.

## Pipeline (Blender-first rule)
Cells are video planes in Blender (the `film.py` flat-plane pattern from `reel-gta6-rating-label`: graded frame sequences cached per clip/offset/cell size, one frame = one pure function of t, crisp text through `scripts/blender_text.py`, 1080×1920, 4 samples ≈ 1.8 s/frame). Footage prep: extract frames by film frame number with per-camera offsets measured once from the burned-in clocks / ignition flash. Audio: NASA native launch-coverage audio under the countdown (to verify), earshot SFX bank + a code-made score that goes silent a quarter-second before zero, cloned Hinglish voice.

## Asset families (≥5): real NASA multi-camera footage · Blender flat-plane cells and clock digits · NASA fact page shown as a document cell (our screenshot of nasa.gov, not retyped) · data drawn by us (T+ altitude/range readout from public values only, second countdown to the next milestone) · kinetic type (clock, captions) · audio family (native commentary, score, SFX, cloned voice).

## Open before the mockup
1. Creator OK with topic, style, and **no crew faces/names** (NASA rule for commercial use).
2. Verify the live-coverage clip carries the countdown audio; else the clock is silent-visual plus our SFX ticks.
3. Measure each camera's offset (clocks / ignition) and decide which cells are synced; causeway/balcony clips are slow-motion.
4. Confirm liftoff time and NASA's own distance number (only AP found), or voice the AP figure as "press reports".
5. Read NASA's page on how to credit; add "Footage: NASA" on screen and in the caption.
