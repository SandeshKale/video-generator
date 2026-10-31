# Reference voice-over analysis (style only)
Supplied by the creator on 31 Oct 2026: a 160 s, 720x1280 Hinglish systems explainer ("System Design . 018") with one male narrator.
Only **measurements** are stored here. The video, its audio and its transcript are third-party material and are not committed; its script, structure and visuals are not reused and its voice is not cloned.

| Measure | Value |
|---|---|
| Duration / speech time | 160.1 s / 110.0 s (speech ratio 0.69) |
| Speech chunks | 152 |
| Pauses 80-200 / 200-400 / 400-800 / 0.8-1.5 s / >1.5 s | 62 / 24 / 33 / 17 / 0 (median gap 0.19 s, mean 0.33 s) |
| Pauses >= 0.4 s | 50 (one every 3.2 s) |
| Words/s overall / while talking (Whisper tokens) | 3.45 / 5.03 (about 10 syllables/s while talking) |
| Words per sentence | median 9, IQR 7-11, max 18 |
| Pitch | median 112 Hz, p10-p90 83-161 Hz (11.4 semitones) |
| Pitch variation | 3.56 semitones std per 2 s window (1.23-6.85) |
| Phrase endings | 68% fall, median -4.0 semitones (tail minus head) |
| Voiced loudness range p10-p90 | 11 dB (-23.4 to -12.4 dBFS-ish, uncalibrated) |

Method: `analyse_prosody.py` (librosa RMS + pYIN) on a 16 kHz mono extract; transcript by faster-whisper medium (Hindi) for word counts and pause positions.
Structural observations (patterns, not content): short sentences; define -> name -> pause ("इसे X कहते हैं।"); rhetorical question then answer; long pause after every named term and after each reveal; English only for nouns/terms; direct question to the viewer at the end.
