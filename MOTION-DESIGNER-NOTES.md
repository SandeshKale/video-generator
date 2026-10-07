# Notes from `kaventro/motion-designer` (MIT) — what to borrow for this repo

Source: https://github.com/kaventro/motion-designer (a Claude Code skill: films from code, music/voiceover/QA tooling).
Read in full on 2026-10-07 (SKILL.md + `reference/*.md` + `scripts/check.mjs`, `scripts/render.mjs`, `templates/shared/fx.js`).
Its core idea is the same as ours — *every frame is a pure function of time, `seek(t)`* — so most of it transfers directly.
Nothing below is implemented yet unless marked **DONE**. Priorities are my recommendation, not a decision.

## 1. Sync the film to a beat grid, not only to the voice (HIGH for non-voiced / music-led reels)
- Time everything as story beats `B(n)` on a BPM grid; whole bars → the film loops; the biggest reveal lands on the
  music's *drop*; scenes change on bar lines; "something moves on every beat".
- **Holds**: after every result the viewer must read, insert whole beats of hold (`[at, len]`) so later actions stay on
  the beat. One visual change per beat; an action takes 0.3–0.5 s, then its result holds 1–2 s.
- For our voiced reels the voice is the clock, so a cheap hybrid: in `sfx.py`, quantise scene-start SFX/whooshes and
  cue crossfades to the nearest beat of that cue's tempo, and put the stamp/impact on the drop beat.

## 2. Reading-time rule → add a lint (HIGH)
"Give each line that has to be read **0.5 s plus ⅓ s per word**, counted from when its last word has landed and
stopped moving." Our `check.mjs` finds overlaps and edge spills but not "gone too soon". Add: for every text layer,
`t1 - (landedAt) ≥ 0.5 + 0.33·words`. Also: text that matters ≥ ~20 px on the stage (we already use much larger).

## 3. Review loop with sub-agents and a scoring rubric (HIGH)
- Split the film into ~12 s stretches; spawn one clean-context reviewer per stretch and kind (`overview` @0.5 s,
  `transitions` @0.05 s ±0.3 s around each cut, `text` @2× scale, `phone` @360 px wide), all at once.
- Reviewers return text only, scored 1–10 on **hook, readability, motion, variety, composition, sync, accuracy**;
  loop until every report says `clean` and every score ≥ 8. Pictures never stay in the main session's context.
- Their failure catalogue is worth copying: cut labels ("Uncategori…"), descenders clipped by a mask (mask height ≥
  1.3 × font-size), text crossed by motion, one-frame flash of a layer in its end position (show it at the same `t`
  its motion starts), layers popping without motion, drift making a held screen crawl.
- We can do this with the `Agent` tool + contact sheets (`preview.mjs` already makes stills).

## 4. Determinism checks worth adding to `check.mjs` (MEDIUM)
Theirs (`scripts/check.mjs`): (a) static scan of the film's source for `Math.random`, `Date.now/new Date()/performance.now`,
`setTimeout/setInterval/requestAnimationFrame`, CSS `transition`/`animation`/`@keyframes`; (b) no page error on any
frame (every 0.05 s); (c) **loop closes** (frame after the last == first); (d) **same pixels whatever the seek
order** (catches carried state, caches keyed on the wrong thing, fractional-pixel text); (e) single-file build equals
the sources. Traps they name: round the resting position of text (`Math.round`) — Chrome may draw half a pixel apart
depending on what was drawn before; `clamp(spring())` when overshoot would uncover something; give each layer one
owner per property; show a layer only when its motion starts.

## 5. Motion vocabulary and taste (MEDIUM — vocabulary for mockups/briefs)
- Named moves: **arrive** (ease-out/spring with a touch of overshoot), **settle** (spring, damping ≥ 0.86),
  **depart** (ease-in, *faster* than arrival, last in first out), **snap** (UI state change), **glide** (camera,
  0.8–1.2 s, only *between* actions), **drift** (≈0.8 %/s over holds so a held frame is never frozen).
- Text rises in masks 0.35–0.45 s, staggered 0.06–0.1 s per line; leaves faster (0.25–0.3 s), last line first.
- **One relay object** (a dot, a row, a line) travels the whole film so first and last frames rhyme.
- **An accent with one meaning** ("now / just changed"): new values arrive in the accent and cool to ink.
- **One signature effect per video**; constant effects stay quiet (grain 0.08–0.15). Effects mark moments.
- Transitions come from the content's own shapes (a row opens into the window, a dot becomes the screen), not
  crossfades/blur-ins. Our wipe-bar is fine for news reels but this is the "designed" alternative.

## 6. Effects library worth porting as pure-`t` helpers (MEDIUM)
From `fx.js`: `hash(i,seed)`, `noise(x,seed)`, `stepOf(t,rate)`, `stagger(t,t0,i,gap,dur)` (keep n·gap < 0.5 s),
`sequence(t, shots)` with joins `cut dissolve push cover zoom whip wipe iris`, `split(el,"char"|"word",masked)`,
`typewriter`+`caret`, `scramble` (letters resolve out of flicker), `countUp` (tabular-nums), `drawPath`, `wipe`, `iris`,
`sweep` (shine through letters), `shake` (settles), `handheld`, `kenBurns`, `glitch`, `grain/vignette/scan/leak` layers,
`confetti` (closed form). We have hand-rolled versions of several; `scramble`, `sweep`, `iris`, `whip` join and
`shake` on the drop would be new.

## 7. Render quality knobs (MEDIUM)
- **Motion blur** (`render.mjs --blur N`): render N sub-frames per frame across a 180° shutter and average with
  ffmpeg `tmix`. Costs N× time. Our 74 s reel rendered in ~3 min on 4 slices, so `--blur 4` (~12 min) is affordable for
  fast-move reels (whips, slams). Not for 4K — we stay at Full HD.
- **Deband**: `gradfun=1.2:16` at encode (never per-frame noise in the film) — would have helped our dark/gradient covers
  and the GIF banding we hit.
- Deliverables beyond mp4: muted **loop** (`-an -c:v copy`), **poster** PNG (the hero frame), a 1080 copy, a
  **single self-contained HTML** (fonts/images inlined; `build_single.py`), and a README with the beat map.
- Frame 0 must be a finished frame (feeds use it as the thumbnail) — we already enforce this for the hook.

## 8. Voice and mix (MEDIUM)
- Two engines: **Chatterbox** (most natural; clone a 10–20 s sample; `exaggeration` 0.5–0.7, `cfg_weight` 0.3–0.5;
  3 takes per line, keep the one whose intonation moves most; ~4 GB, slow) and **Kokoro** (54 voices, fast). We only
  use Kokoro; Chatterbox is the answer to "voice is flat" if the sandbox can fetch it (needs GPU-ish speed; untested).
- Script rules: one idea per line (4–12 words), line starts *after* the action it describes, ≥1 s between lines,
  speech < ⅔ of the film, numbers written as spoken ("four fifty"), per-line `until` allows ≤1.2× speed-up to hit a
  sync point. Per-take checks: length 0.7–1.7× a plain reading, no inner gap > 0.7 s.
- Mix chain: high-pass, presence, compressor, de-ess; music at ~0.26 with a dip at 2.6 kHz and ducking; −16 LUFS,
  −1.5 dBTP. **Targets: voice 16–20 dB above the music while speaking; music −5…−9 dB below the voice between lines.**
  Print those two numbers after every mix (our `sfx.py` only loudnorms; it never reports the balance).

## 9. Music brief (MEDIUM)
- Write a **sound brief** before choosing a track: the music's *role* (leads vs bed), tempo from pace (calm 90–110,
  energetic 118–128), an **energy map** per scene (sparse hook → lift on reveal → steady → calm end), texture from the
  look, never generic epic/EDM for a calm brand. A bed under words: no lead melody, lots of space.
- `beats.py` bar table: `hits` (busy-ness), `bright` (centroid), `fill` (spectrum taken), `crest`. **A bed has fill ≤ 30 %,
  crest ≥ 12 dB, not busy.** Drops/breakdowns land 4/8/16 bars apart. A take that fails is dropped, not mixed lower.
- SFX: **one sound per action that matters; a sound for everything is noise.** Their set: tick, click, pop, thud,
  whoosh (pan toward entry side), swish, blip (pitch climbs), chime, hop — tuned to the music's key. Ours: similar,
  not key-tuned (cheap win: transpose pitched SFX to the cue's key).
- They generate music with ACE-Step 1.5 (needs a GPU); we use numpy synth. Not applicable here, but their caption style
  ("full sentences: feel, genre, drums, 3–4 instruments, space, what it's for. No vocals.") is a good brief template.

## 10. Styles catalogue → idea bank for our per-reel identities (LOW–MEDIUM)
Seven whole-decision styles, each = canvas + type + accent + motion + camera + one **signature move**:
Brand-native, Meadow (soft green, rounded, brand dot becomes screen), Warm ink (paper, shapes become windows),
Midnight (dark, a "now" line runs through every scene; keep backgrounds flat or `--deband`), Field guide (paper +
contour lines, a route line that draws the logo and underlines the end), Paper and ink (white, one oversized ≤6-word
line, accent full stop that becomes the logo dot), Color block (stage colour changes on bar lines; each scene's colour
is the colour of the button just tapped). **Idea to steal: every reel gets a named *signature move* in its brief.**

## 11. Process habits (LOW, but cheap)
- Write a `## Status` block at the end of the brief after every step so a fresh session can resume.
- Keep context small: reviewers look at pictures; read code by `grep -n` ranges; run renders in the background.
- Label illustrative numbers ("Example data"); invent fictional data for app films; confirm every feature exists.
- Rights: record music/voice licences in a `SOURCE.md`; Chatterbox output carries an inaudible watermark; Kokoro is
  Apache-2.0; never clone a real person's voice without consent.

## Not applicable / skip
Phone/desktop device frames, SF Symbols packing, web-app UI capture, App Store preview rules, macOS `say`.
