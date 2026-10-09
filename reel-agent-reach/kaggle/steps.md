# Agent-Reach reel — GPU stage (Kaggle) — steps

What it does: clones **your voice** from your own clip, speaks the 21 script lines, then re-draws your mouth on **your real footage** (LatentSync) to match. One notebook, nothing to upload — it downloads your clip from the Drive link by itself.

## Run it
1. kaggle.com → **Create → New Notebook** → **File → Import Notebook** → choose `AgentReach_GPU.ipynb` (from this folder).
2. Right panel → **Session options**: **Accelerator = GPU P100** (or T4 x2), **Internet = On**, Persistence = *Variables and Files*.
3. **Run All**. About 1–1.5 h (install 10 min, voice ~15 min, LatentSync ~30–60 min). If it stops, press Run All again — finished steps are skipped.
4. When the last cell prints the zip size, open the right panel → **Output** → download `agentreach-out.zip` (about 60–80 MB).
5. Put `agentreach-out.zip` in this Drive folder (set "anyone with the link") and tell me, or attach it in chat.

## What's in the zip
`vo/s01..s21.wav` (cloned voice, best take per line) · `host/sXX.mp4` (lip-synced host clips, 25 fps, 1080×1440) · `timing.json` (word timings) · `take_report.json` (all takes + scores) · `groups.json`, `config.json`.

## If something fails
- **Install error:** re-run that cell once.
- **Out of memory in the LatentSync cell:** *Run → Restart session*, then Run All.
- **Clip download fails (cell 3):** upload `dji_mimo_…mp4` to the notebook as `/kaggle/working/work/real.mp4` and re-run cell 3.
- Paste any error text back to me.

## Notes
- Only your own voice and face are used, for your own reels.
- Your clip looks slightly below the lens (screen glare visible in the glasses). That limits the "looking at camera" rule for this reel; the planned re-record (script in `recording-guide.md`) fixes it.
