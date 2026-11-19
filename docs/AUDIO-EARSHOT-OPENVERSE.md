# Audio department: Openverse + earshot (standing rule from 19 Nov 2026)

Creator rule: every next reel uses **Openverse** (open-licence recordings) and **earshot** (`Leonxlnx/earshot`, MIT: a bank of 252 code-made sound effects plus listening tools) for the audio department, next to the reel's own voice-over. The old all-synth `audio_mix.py` SFX are no longer enough on their own.

## Openverse (works from this sandbox, anonymous)
- `python3 scripts/openverse_audio.py search "whoosh" --n 8 --max-dur 4` lists commercially usable audio (cc0, pdm, by, by-sa; NonCommercial and NoDerivatives are filtered out). `... get <id> <dir>` downloads it and appends a paste-ready line to `<dir>/CREDITS.md`.
- `api.openverse.org/v1/audio/` answers 200 with a descriptive User-Agent; the website `openverse.org` is behind Cloudflare (403).
- Licence rules: cc0/pdm need no credit; by/by-sa need the credit line in the caption (and by-sa makes an adapted recording share-alike, so use it unmodified or avoid). Re-check the licence on the landing page before posting. Put every used file in `audio/CREDITS.md` and in `caption.md`.
- Pick by listening evidence, not title: run `earshot describe` / `earshot rank "<description>" files...` on the candidates and keep the best.

## earshot (installed with `uv tool install "earshot @ git+https://github.com/Leonxlnx/earshot"`, CPU only, needs ffmpeg)
- `earshot sfx list` / `earshot sfx render ID -o x.wav --dur --apex --pitch` renders a bank effect aimed at a picture moment; `earshot kit init/render/check` builds a whole film's effect kit with measured sync points (`launch` preset mixes against the music bed and the cut, no models loaded).
- `earshot describe|match|rank|find` tell an agent what a file sounds like and which Openverse candidate fits a description; `earshot timeline|critique FILE --video V` is the numeric listening check on the finished MP4 (sync of sound to cuts, loudness, scorecard); `earshot measure` gives LUFS/true-peak without models.
- Each CLI call loads models (~20-40 s); for many calls use one Python script (`from earshot import api`) or the MCP server.
- It does not replace the mix rules: voice over music/SFX targets, ducking, `mix-report.json` and the "not auditioned" disclosure still apply. `earshot critique` is evidence, not a listen by a person.
- Process: (1) in `script.md` add an **audio brief** (per scene: music cue, 3-6 SFX with the moment each lands on); (2) fill it from the earshot bank first, Openverse for real recordings (ambience, foley, music beds); (3) verify with `earshot timeline/critique` on the final MP4; (4) credits in `caption.md`.
