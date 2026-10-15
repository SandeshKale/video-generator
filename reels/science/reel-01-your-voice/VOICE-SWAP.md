# Swapping in the avatar voice (Friday)

The current video uses a **scratch voice** (Kokoro, `tts_scratch.py`) so the 30 s timeline could be built and timed. The real voice is the avatar-clip audio (same as the trading-pipeline reel).

1. Generate the three parts from `avatar-prompts.md` (Part 1 first) and put the MP4s in `avatar/`.
2. Stitch: extract audio, trim each part at its pause, join with the designed silences (about 1.15 s between Part 1 and Part 2 for the "higher or lower?" guess, and about 1.4 s after "say anything." inside Part 3). The trading reel's `reels/tech/reel-ai-trading-pipeline/avatar/stitch.py` is the pattern (DROP / END / GAP). Output `vo/voice.wav`.
3. Dereverb/EQ the same way as the SynthID reel (`reels/tech/reel-synthid-check/dereverb.py`) if the clips are roomy.
4. `PYTHONPATH=/tmp/stub python3 timing_from_voice.py vo/voice.wav` rewrites `timing.json` (aligns Whisper words to the script lines; it warns about any line it could not anchor).
5. `bun build.mjs` (copies timing into `site/timing.js`), then dump events once (`bun shot.mjs 1,4,7,10,11.5,12.8,15,17,19,21,24,28 ev ev` → `events.json`), `python3 audio_full.py vo/voice.wav`.
6. Re-run the checks (`bun check.mjs`, `bun ../../../scripts/change-cadence.mjs reels/science/reel-01-your-voice/site`), render, mux `audio/final.wav` with loudnorm (-14 LUFS), review frames.
**Budget:** the reel must stay at 30 s. If the avatar read is longer than about 28.5 s of speech plus pauses, trim pauses before touching the pace. All scene cuts, word cues, captions and SFX follow the new timing automatically.
**Known assumptions:** captions are spread across each line's span by character count (so they stay in step even if Whisper mishears a word).
