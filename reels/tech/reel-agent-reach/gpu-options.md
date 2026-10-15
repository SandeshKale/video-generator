# GPU options — what is in the kit, what was evaluated and held back (Oct 9, 2026)

| Option | In `AgentReach_GPU.ipynb`? | Notes |
|---|---|---|
| OmniVoice voice clone (your voice) | **Yes** | Apache-2.0 repo; use only your own voice. 3–10 s refs. |
| LatentSync 1.5 lip-sync on your real footage | **Yes** | 1.6 (512 px) auto-selected only on ≥20 GB GPUs. |
| faster-whisper word timings / take scoring | **Yes** | `small.en`; large-v3 not needed for English captions. |
| EchoMimicV2 (audio → half-body with hands) | No | Needs a **half-body photo** of you (the clip is face only). Repo Apache-2.0 but "intended for academic research", weights licence **not stated** → not safe to ship on a monetised channel until verified. Heavy install (torch 2.5.1 + xformers + torchao, ~16 GB). Experiment only. |
| MoDA head motion (script-matched emotion) | No | Fallback for beats where no real footage fits; HF Space exists; weights licence to verify. |
| LivePortrait (retarget / eye control) | No | README names no licence for weights, no gaze-correction mode; InsightFace terms to verify. Not a fix for the below-lens gaze. |
| GFPGAN face sharpening of LatentSync output | No | Apache-2.0 code, weights licence unstated; frame-wise restoration flickers — only worth it if the 256 px mouth softness is visible at host size. Decide after the first output. |
| Gaze correction toward the lens | No | No open, commercially clean tool verified → **re-record looking into the lens** (see `recording-guide.md`). |
| Photoreal image gen (RealVisXL), music gen | No | Not needed for this reel's design; MusicGen weights are non-commercial. Synth music from `sfx.py` stays. |
