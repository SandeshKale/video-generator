# Lip-sync the host (Apple camera reel) — steps

Goal: re-sync the host's mouth to the voice-over with LatentSync on a free Colab GPU. Head motion is kept.

## Files in this folder
- `steps.md` — this file
- `LatentSync_lipsync.ipynb` — the Colab notebook
- `lipsync-input.zip` — the 7 head-motion clips (c0..c6 .mp4) and voice chunks (c0..c6 .wav), 8.4 MB
- `lipsync-out.zip` — YOU create this at the end (step 6) and put it here / send it back

## Steps
1. Open https://colab.research.google.com → File → Upload notebook → choose `LatentSync_lipsync.ipynb`
   (or, from Drive, right-click the notebook → Open with → Google Colaboratory).
2. Runtime → Change runtime type → **T4 GPU** → Save.
3. In the left file panel (folder icon), upload `lipsync-input.zip` to `/content`.
   (If you skip this, the second cell opens an upload button.)
4. Runtime → **Run all**. Takes roughly 40–90 min on a free T4 (estimate). Cells: GPU check → inputs → install (5–8 min)
   → weights (~5 GB) → lip-sync 7 clips → preview → zip.
5. If Colab disconnects, reconnect and re-run the clip cell (step 5 in the notebook) — finished clips are skipped.
6. At the end `lipsync-out.zip` downloads automatically. Put it in this folder and tell Claude, or send it in chat.

## If something fails
- Install error: re-run that cell once, then the weights cell.
- Out of memory: restart the runtime and re-run; don't force LatentSync 1.6 on a 15 GB GPU.
- Paste the error text to Claude.

## What Claude does next
Stitches the 7 results into the host video (`tools/stitch_host.py`), re-renders the reel, and checks on the final MP4 that the mouth moves.
