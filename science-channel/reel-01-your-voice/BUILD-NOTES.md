# Build notes: reel #01 "You've never heard YOU" (v3, 31 s, 1080x1920@60)

**v3 (14 Oct 2026) after feedback "too much text, polish missing, voice-over is enough".** No avatar video. Files: `reel.mp4` (22 MB), `cover.png`, `caption.md`, `site/` (`main3.js` is the page logic; `main.js` is the retired v2), `build.mjs`, `voice/` (Qwen3-TTS clone pipeline: `qgen_all.py`, `pick.py`, `assemble.py`), `audio_full.py`, `check.mjs`, `trans_sheet.jpg`.

## What changed
- Text: tracker, eyebrow, source line, tags and chip rows removed. Left: opening headline, "AIR/BONE", "2025", THEORY/STUDY, "SCIENTISTS DISAGREE", "TRY IT", "Only you hear it.", end card. Captions are 2-3 word chunks, key word coloured.
- Voice: the creator's trading-reel voice cloned with Qwen3-TTS (ICL, 3 seeds per line, scored by Whisper WER, speaker similarity, accent margin). 10 lines incl. a spoken CTA "Follow for the next one." Designed silences: 1.15 s guess beat, 1.45 s muffled try-it.
- Visuals: glossy lens rims, bigger single-idea scenes (crowd row + coral "you", pillars + 2025, paper plane to the friend, crossed voice note), glossier Blender ear frames (no wire cage, coat/subsurface, depth of field), branded end card (profile photo, @sandesh_explains, FOLLOW, NEXT teaser) held ~3 s.

## Validated
- `check.mjs`: 5 items, all deliberate (labels on the poll panel, voice-note bubble sliding over the friend card, hand at the ear, fixed to stay inside x>=152).
- `change-cadence`: 0 stretches over 2 s (longest 1.50 s).
- Frames of the final MP4 inside all 8 transitions + first/last + loop seam (`trans_sheet.jpg`): clean.
- Audio: -14.5 LUFS, true peak -2.6 dBFS (loudnorm), voice over music 16.5 dB on voiced frames (before loudnorm).

## Not validated
- Voice and mix measured, not auditioned. Cloned-voice pronunciation of "2025" (read "twenty twenty-five"/"2025") unchecked by ear.
- Portrait is 576x1024 upscaled (soft at closest push). Phone safe-zone not checked on a device.
- Caption chunk timing is proportional by characters within each line.

## v4 fix (14 Oct 2026)
- Removed the skull/X-ray (void plate, dark lens interiors with the coral cochlea ring) and both cartoon doodles (hook = REC tile, friend scene = chat panel). New profile photo and `@sandesh_explains` on the end card and cover chip.
- Voice rebuilt as breath-group takes (`voice/lines_v5.json`, Qwen ICL, 3 seeds each), picked by `voice/pick2.py` (flow check: transcript, pauses <= 0.55 s, 2.3-3.6 words/s, onset, ending), no pause cutting or tempo change, `voice/assemble2.py` designed gaps only. One known soft flag: p2a has a 0.58 s comma pause after "ears,". Not auditioned by ear.
- `change-cadence`: 0 stretches over 2 s (scan band added to the try-it lens). Reviewed 12 page frames and 7 frames of the final MP4. Mix: loudnorm -14 LUFS, voice over music 16.3 dB (voiced frames).
