# TRIBE v2 (facebookresearch/tribev2) — can we run our visuals against it? (assessed 18 Nov 2026)

**What it is.** A multimodal brain-encoding model: given video, audio and/or text it predicts the fMRI response of an *average* subject on the fsaverage5 cortical mesh (~20k vertices, shape `(n_timesteps, n_vertices)`, offset 5 s for hemodynamic lag). Released by Meta FAIR in March 2026; paper arXiv 2605.04326; weights `facebook/tribev2` on Hugging Face. It is an encoder (stimulus → brain), not a decoder.

**Verified from the repo/model card (read 18 Nov):**
- Licence **CC BY-NC 4.0** (code and weights). Non-commercial.
- Inference = `TribeModel.from_pretrained("facebook/tribev2")`, `get_events_dataframe(video_path=...)`, `predict(events=df)`.
- Encoders it pulls in: **Llama-3.2-3B (gated on Hugging Face: needs an accepted licence and a read token)**, V-JEPA2 (ViT-G, 64-frame clips), Wav2Vec-BERT, DINOv2-large. Dependencies pin torch 2.5–2.6, Python 3.11+.
- Hardware needs are not stated; the video/text encoders are large.

**Why it cannot run in this sandbox:** 4 CPU cores, 15 GB RAM, **~2.7 GB free disk allowance** (the encoders alone are several GB), no GPU, and the gated Llama weights need the creator's own Hugging Face token (never written to a file). A Colab GPU session run by the creator (like `lipsync-colab/`) is the realistic route; untested.

**What its output would and would not tell us.**
- It gives a per-second predicted cortical activation map for an average adult, trained on mostly English-language naturalistic movie/audio/text datasets. Our reel is silent (mockup) or Hinglish (final), so audio/text would be out of distribution.
- Predicted activation is **not** a measure of retention, saves, shares or "quality". Nothing in the paper or card validates it for Instagram performance. It can show *where in time* visual / auditory / language-network predictions flatten or peak, which is at most a hint to compare two cuts, never a score.

**Licence decision (open).** The channel is monetised. Using a CC BY-NC model to evaluate or optimise commercial content is plausibly "commercial use" of the model; this is a legal judgement, not ours. Until the creator decides: **do not put TRIBE v2 in the pipeline, do not ship its outputs, do not depend on it.** If the creator wants a personal, non-revenue experiment, the plan is a Colab notebook (`tribe_colab/`): upload the mockup/final MP4, run `predict`, reduce the (t, 20k) array to per-second ROI curves with a surface atlas, plot against the shot list. Needs the creator's HF token and Llama-3.2 access.
