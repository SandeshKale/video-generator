# Deep dive — making our next reel look, sound and edit like the reference

Reference = the user-attached "free tool, comment KEYWORD" explainer reel (host + UI step cards + dark example montage).
Everything below maps one reference trait to one concrete piece of our stack.

## 1. What the reference actually does (measured from its frames + audio)

| Trait | Reference | Our implementation |
|---|---|---|
| Layout grammar | Cycles between **A** host-full (head+shoulders, big), **B** split (host bottom third, graphic top two thirds), **C** graphic-full (UI card / b-roll), 1–3 s per shot, almost no shot > 4 s | `layout` field per beat in the EDL; host `<video>` is one persistent element re-parented/scaled per layout (A: 1080 wide crop; B: bottom 40 %, masked rounded; C: hidden, small PiP bubble optional) |
| Punch-ins | Host is re-cropped (100 % → 125 %) on stress words, hard cut not zoom | Host video drawn on a canvas; per-beat `crop` (scale, cx, cy) = free "second camera" from one take |
| Captions | Word-by-word, 2–4 words on screen, italic serif for emphasis words + bold sans for the rest, one accent colour on the key word | Reuse the caption chunker from `reel-chatgpt-intelligent-ui` (timings from TTS), 2–4 word chunks, serif-italic/sans mix, key word tinted |
| Step cards | 1 s UI-screen cards ("1 Open… 2 Paste…") with big step numeral | `card()` component: numeral + one line + a real/fake terminal or UI panel; enters at the word, exits on the next cut |
| Mascot | Small mascot whose colour matches the section | **Reach**: a stretchy cartoon arm/hand that pokes out of a phone frame toward each platform logo. Also solves the "avatar can't gesture" gap — the *mascot* points, counts on fingers, thumbs-up |
| Example montage | Dark, fast b-roll of results with a flash-white transition | 5–6 × 0.8 s "result" panels (Reddit thread, YouTube transcript, repo list…) on a dark plate, `flash` frame between them |
| CTA | "Comment KEYWORD below and I'll send you the link" + host pointing down | Host line + mascot arm pointing at a big `REACH` comment-bubble; profile pic + @sandesh.explains ring ≥ 200 px, held ≥ 2.5 s (standing rule) |
| Audio | Voice forward, no tempo-heavy music; quiet sub-bass bed, short whooshes/ticks on cuts and cards | `sfx.py` cue system: ONE low pad/sub bed (no melody), voice −16…−20 LU over bed (sidechain), SFX = whoosh on layout cut, tick on each card, riser into montage, pop on CTA bubble |

## 2. Avatar — what is possible and the plan

User confirmed the Kaggle route works. We do not know which model it runs → **open question**. Plan by capability:

1. **Baseline (works today):** MoDA head motion → LatentSync lips (the approved pipeline). Gives face + head, no hands.
2. **Performance track (standing rule):** per-sentence emotion / brow / blink / nod / gaze=camera table in `script.md`. Used to choose MoDA `emotion_name` and chunk boundaries *at sentence ends* (so cuts are invisible), to pick a frontal source frame with eyes on the lens, and for the by-eye gaze review before LatentSync.
3. **Hands without a body model:** (a) punch-in crops + layout cuts hide that the host is a head; (b) the **Reach mascot hand** does every gesture on screen; (c) optional: user records one 20–30 s clip of themselves talking with natural hand gestures → use as the *driving video* for a motion-transfer model (LivePortrait-class) so head/brow/blink come from a real performance instead of audio-only. (d) Only if gestures are essential: try **EchoMimicV2** (half-body + hands, audio+pose driven, ~16 GB → Kaggle P100 borderline, needs a test run before committing; check its licence for commercial use first).
4. **Gaze:** MoDA drifts; fix by driving from a source clip/frame with eyes on lens, review every chunk by eye, regenerate failing chunks only.

## 3. Voice

- Language: English (user didn't ask for Hindi this time; the reference is English).
- Options, ranked: (1) **OmniVoice clone of the user's own voice** from a ≥10–15 s clean sample they consent to provide — most "creator-like", runs fast on the Kaggle GPU (CPU here is RTF 8–40); (2) OmniVoice attribute-designed male voice (tested here: f0 ≈ 90–100 Hz, expressive variation); (3) Kokoro `am_michael` at base 1.05–1.12 (fallback, known good, gives word timings).
- Whatever engine: generate per sentence, force-align for word times (whisper/forced-align if the engine gives none), keep the hook ≤ 3.2 s, contractions and short sentences, no synthetic "um" clips (standing feedback).
- We never clone the reference host's voice or look — only the user's.

## 4. Pipeline

```
script.md ─▶ tts (per sentence, aligned words) ─▶ audio/voice.wav + timing.json
        └─▶ Kaggle: MoDA chunks (cut at sentence ends) ─▶ LatentSync ─▶ stitch_host.py ─▶ site/host.webm
EDL (timeline.json: beat → layout, crop, card, caption emphasis, sfx) ─▶ build.mjs ─▶ site/*
check.mjs + visual-validate-style lint ─▶ contact sheets ─▶ render-slices.sh ─▶ mux ─▶ MP4 + caption.md + cover
```
Reused unchanged: `hostvideo.js`, `stitch_host.py`, static server (Range/webm), `render-slices.sh`, `sfx.py` cue engine, caption chunker.
New: `layout`/`crop` director for the host canvas, `card()` step component, Reach mascot (SVG hand, pure-`t` keyframes), flash-transition montage.

## 5. Visual identity (must differ from every prior reel — mockup 3 scenes first)

Proposal **"Field Notebook"**: bone paper `#f3ecdf`, ink `#14110f`, cherry red `#e63946`, sage `#9bb89a`, butter `#f2c14e` accent; Instrument-Serif-style italic for emphasis + Archivo Black-style heavy sans (vendor via @fontsource) + JetBrains Mono for terminal lines; graph-paper + taped-corner "specimen card" components with torn-edge tabs; mascot hand in cherry-red glove. (Prior: navy dots, cyan/magenta terminal, indigo mission plot, slate/yellow studio, cream/terracotta paper-cut, ice-blue/cobalt toybox, umber lamplight — this is bone/ink/cherry, a bright but editorial look, not paper-cut puppets.)
Approval gate: mockup scenes 1 (hook A), 4 (split + step cards), 9 (CTA) before the full build; delete mockup files afterwards.

## 6. Risks / honest caveats

- Host lip/gaze quality depends on the Kaggle model; judge on frames before the render.
- Agent-Reach touches login platforms: the reel says burner account / ToS risk on screen; no scraping demo of a real private person's data; example panels are illustrated and labelled "illustration".
- Stars figure differs across sources (repo page showed ~94.5k at research time) — re-check the day we render and say "90k+" if unsure.
- Voice/mix can't be auditioned here; ask the user to listen once.
