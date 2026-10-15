# Hack Zone #01 "Brain won't switch off? Write this." — v2 build notes (15 Oct 2026)

**Files:** `reel.mp4` (1080x1920@60, 47.1 s, CRF 22, 7.2 MB), `cover.png` (sticky-note desk), `caption.md`, `deliverables/printable-list-{A5,phone}.pdf`, `dm-prompt.md`, `script.md` (v2 script and design), `site/` (page), `voice2/` (OmniVoice generation, picker, assembler), `audio2.py` (score + SFX + mix), `timing_from_voice2.py`, `tools/events.mjs`, `check.mjs`, `cover-build.mjs`, `printable-build.mjs`.

**What changed after the "pathetic output" feedback**
1. Voice: OmniVoice (k2-fsa/OmniVoice) zero-shot cloned from the Adam voice (Kokoro `am_adam` reference clip), reading ONE paragraph as 5 whole takes (2 seeds each); flow check + closest-to-Adam pick. Similarity to the reference 0.93-0.97. 44.4 s read at ~3.4 words/s.
2. Script: rewritten as a single flowing paragraph (see script.md).
3. Visuals: rebuilt as a coherent top-down desk (one camera, one lamp, consistent shadows) with physical motion: gravity drops with one bounce, sliding with friction, lift-and-flick, the pen carried and writing at its real speed, a camera rise for the comparison, desk clearing, recap note dropping. Canvas 2D, pure function of t. Old WebGL/Blender plate version removed (history keeps it).
4. Music and SFX: new composed score (66 BPM, F major) with bars aligned to story cues, motion-driven physical SFX and CC0 UI samples (`audio2.py`).

**Measured:** `check.mjs` 0 DOM issues; contact sheets (screenshots at 30+ times) and 18 frames of the final MP4 including the slice join at 24 s; mix -14.0 LUFS, -2.6 dBTP, voice over bed+SFX median 27.9 dB, minimum 13.6 dB (voiced frames, targets 19/13). **Not auditioned by ear** (voice, score, SFX): please listen before posting.

**Known gaps (stated, not hidden)**
- `change-cadence` still flags 7 stretches of 2.25-6 s: the visuals in them are deliberate holds or small motions (pen writing, the thought-loop, the sleep-lab traces, dots, a pulsing bookmark, confetti) that fall under the checker's whole-frame threshold. A full-frame stripe overlay passed the threshold but made the picture messy, so it was removed.
- Runtime 47 s (the ~38 s plan was set before the voice read slower/longer as a paragraph).
- "Adam" was interpreted as the Kokoro `am_adam` voice used on earlier reels; if a different Adam voice is meant, swap `voice2/ref_adam.wav` and re-run `voice2/gen.py`.
- Disk: the RealVisXL weights (6.9 GB) and the Qwen3-TTS cache were removed from the HF cache to fit OmniVoice (3.3 GB); they re-download on demand.
- Sticky "8 OPEN LOOPS" counter is literal (8 notes) while the voice says "a hundred tabs" as a figure of speech.

**Pitfalls hit:** the HF xet download stalled at 1.8 GB (fix: `HF_HUB_DISABLE_XET=1`); a `sed` on `os.environ.get(...)` silently did not match; the per-frame canvas blur had cost 8 s/frame (cache the sprites); `jiwer`/`faster-whisper` live in `/tmp/qwenenv`, OmniVoice in `/tmp/ttsenv`; an empty `#cap` pill rendered as a dark blob until opacity was set.
