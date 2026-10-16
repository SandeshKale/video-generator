# Build notes: Ramayana trailer review (Oct 2026)
- 55.2 s, 1080×1920@60, avatar clips p1–p4 (544², Hindi), all speech ended by 13.1 s per clip (v3 script + short extra sentences).
- Look: Film Leader (graphite, amber, vermilion; Anton + Inter + JetBrains Mono). Small borderless feathered avatar bottom-right, English caption beside it.
- Page: `site/` (11 scenes timed from `avatar/words.json`), pure-`t` motion: slow push-ins, draw-on annotations, timeline/gauge growth, pops, scan band, crossfade with push. `site/frames/` and `frames/` are gitignored (Sony footage).
- Audio: `audio.py` (drone + pulse + SFX, voice-ducked). Mix −14.5 LUFS, peak −3.8 dBFS, voice over music+SFX 23.3 dB (voiced frames). Not auditioned.
- Validated: `change-cadence` 0 stretches over 2 s; frames of the final MP4 at all cuts; host crop frame diff (moving).
- Known gaps: scene starts are sparse for ~0.3–0.6 s (headline in, stage content a beat later); no `check.mjs` overlap lint for this page; Hindi pronunciation of the avatar not verified by a native listener; `10×?` is a question, not a claim.
- Footage use: stills only (frames from the supplied trailer), commentary context, trailer audio not used.
