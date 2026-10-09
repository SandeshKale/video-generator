# Character-animation resources — what's usable in THIS pipeline (verified Oct 8, 2026)

Source: a user-supplied list of "premium character animation" GitHub repos. Each repo below was opened and checked for what it contains and its licence. The list's framing is 3D/Blender/Unreal; this repo renders **deterministic HTML/SVG/WebGL as a pure function of `t`** on a CPU-only box. So the question per resource is: can its *data or ideas* drive a `t`-driven 2D/2.5D character, and is it legal for a monetised channel?

| Resource | What it really is (verified) | Licence (verified) | Usable here? |
|---|---|---|---|
| **CMU mocap (BVH mirror)** `una-dinosauria/cmu-mocap` | CMU motion-capture library as `.bvh` (Bruce Hahne port), with spreadsheet/text indexes | README: CMU and the porter "say that you can do whatever you want with the data" (full terms in `READMEFIRST.txt`) | **Yes — the only clearly commercial-safe mocap source in the list.** Walk/run/gesture/idle clips for a 2D/2.5D rig. Read `READMEFIRST.txt` and keep a copy in `assets/` provenance before vendoring. |
| **Bandai Namco Research Motion Dataset** | 2 BVH datasets: 17 content types × 15 styles (36,673 frames) and 10 types, locomotion/hands, 7 styles (384,931 frames); 3 professional actors; Blender scripts (MIT) | **CC BY-NC 4.0 — non-commercial** | **No for this channel** (monetised/brand content is not non-commercial). Fine for private research/prototyping only. The list's "premium, use directly" framing hides this. |
| **Ready Player Me animation library** | 200+ FBX clips (locomotion/dance/expression/idle), retargeted to RPM feminine/masculine armatures, Git-LFS | "free as in beer"; FAQ: **only for Ready Player Me avatars** (binding terms in LICENSE.md, not read) | **No** — needs RPM skeletons/FBX tooling; we have neither and shouldn't depend on the restriction. |
| **FreeMoCap** | Markerless multi-camera mocap, Python 3.9–3.11, CPU extra available | AGPL-3.0 | Research tool for *capturing our own motion* (e.g. recording the creator's gestures). AGPL: use as a tool, don't embed in shipped code. Needs cameras; output format not confirmed on the page. |
| **EasyMocap** | Fits SMPL-family models to (multi-view) video; keypoints/meshes | licence text not seen — treat as unknown/research-restricted | Skip until licence checked; heavy deps. |
| **AI4Animation** | SIGGRAPH research code (mostly Unity; 2026 NumPy/PyTorch remake `AI4AnimationPy`) | "only for research or education… not freely available for commercial use"; mocap data **CC BY-NC 4.0** | **No** (non-commercial). Ideas only (phase-functioned motion, foot-contact). |
| **awesome-cc0** (`madjin`) | Link list of CC0 3D/texture/sound assets (e.g. 300 CC0 VRM+FBX avatars, Quaternius packs, The Base Mesh, Base Meshes glTF) | list is CC0-focused; per-entry terms vary ("search specifically for CC0") | **Maybe.** Quaternius/CC0 rigged characters are the realistic way to get 3D characters without licence risk; rigging not confirmed per entry. |
| **gamedev-free-resources** (`teamgravitydev`) | Real repo; link list (Unity/Unreal store pages, Kenney, OpenGameArt, Mixamo…) | none for the list; each linked asset has its own terms | Discovery only; mostly engine-store content we can't use. |
| **MB-Lab, Blender↔UE exporters, Sketchfab add-on, "Game Rig Tools", "Plasticity scripts"** | Blender/UE workflow tools | not checked (MB-Lab is a Blender add-on; the rest are DCC plumbing) | Not applicable: no Blender/UE in this environment; "Plasticity cleanup scripts" in the list is unverified/likely mislabelled. |

**Claims in the source list that don't hold up:** "premium, ready to use" for Bandai Namco and AI4Animation data (both **non-commercial**); "apply to any rigged character" for Ready Player Me (explicitly **RPM-only**); "Mixamo auto-rig or Rokoko retarget" are external GUI/online tools we can't run headless here.

## What *is* worth taking (ideas that fit a deterministic 2D/2.5D reel)

1. **BVH → 2D pose track, evaluated purely from `t`.** A BVH is a hierarchy + per-frame joint rotations. In JS: parse once at build time to JSON (frame time, per-joint Euler), do forward kinematics, project orthographically (or with a fixed camera yaw) → 2D joint positions. `pose(t)` = linear interpolation between frames `floor(t*fps)` and `+1` (slerp for rotations). No state, so it satisfies the `__seek` contract. Cost: tiny.
2. **Drive our existing characters.** `assets/illustrations/humaaans-react` poses are static; a 12-joint 2D rig (torso, head, 2×upper/lower arm, 2×upper/lower leg) built from capsule SVG shapes or a stylised silhouette in each reel's palette could be animated by CMU walk/idle/gesture clips. The "characters" feedback ("never reuse the same pose") becomes easier: same rig, different clips and palettes.
3. **Foot-sliding clean-up** (the list's pro tip, real): when mapping a clip to a 2D rig with a fixed ground line, lock the stance foot while its Y is below a threshold and translate the root instead. Do it at build time, not per frame.
4. **Loop-friendly clips** (idle/walk cycles) → blend first/last frame over ~0.3 s so the GIF/reel loop closes (matches the loop-closure check in `MOTION-DESIGNER-NOTES.md`).
5. **Our own motion via FreeMoCap (AGPL, as a tool)**: record the creator's real gestures once, export to our JSON pose track, and use as a signature avatar — unique and licence-clean if it works.
6. **Phase/contact ideas from AI4Animation** (ideas only, no code/data): derive foot-contact flags from the foot's vertical velocity to time footstep SFX in `sfx.py`.

## Constraints / risks
- Sandbox is CPU-only; real-time 3D (WebGL skinning of FBX/glTF) is possible in headless Chromium (software GL) but slow; 2D SVG rigs render at the usual speed.
- FBX isn't loadable without extra tooling; BVH is plain text, trivial to parse. Prefer BVH/glTF.
- Licence hygiene: only **CMU** (and CC0 packs) are safe for a monetised channel from this list. Record the source and `READMEFIRST.txt` terms in `assets/ATTRIBUTION.md` before adding any clip.
- Not yet implemented — this note records evaluation only.

## Suggested next step (if you want it)
A small feasibility demo: vendor 3–4 CMU clips (walk, idle, point/gesture, wave), write `bvh2json.mjs` + a 12-joint SVG rig that is a pure function of `t`, render a 6-second test GIF in one reel palette, and check the loop and foot-sliding. If it looks good, it becomes a new character system for future reels/GIFs.

## Round 2 (Oct 9, 2026) — facial/AI-motion/world-building list, licences checked

Checked LICENSE files directly where reachable (raw.githubusercontent) and by search otherwise. Verdict for *this monetised channel*:

| Repo | Licence found | Verdict |
|---|---|---|
| DanielSWolf/rhubarb-lip-sync | MIT (deps MIT/BSD) | **USE** — audio → mouth-shape (viseme) timings; maps onto 2D mouth sprites as a pure function of `t`. Best immediate win (gives a talking host character). Not yet integrated. |
| princeton-vl/infinigen | BSD-3 | Licence fine, but Blender/GPU-heavy 3D; not practical on this CPU sandbox for 2D reels. Parked. |
| VAST-AI-Research/UniRig | MIT (code) | Fine licence; irrelevant to the 2D rig and needs a GPU. Parked. |
| NVIDIA/Audio2Face-3D | SDK reportedly MIT; models NVIDIA Open Model License (commercial OK per model cards); NIM container + Audio2Emotion stricter | Needs a 3D face rig + GPU; not a fit for the 2D pipeline. Parked; re-read licence before any use. |
| Tencent-Hunyuan/HY-Motion-1.0 | Tencent community licence (proprietary; reports say territory excludes EU/UK/South Korea; large-platform MAU cap) | **Avoid** unless legal sign-off — territory terms unresolved. Also GPU-sized. |
| ubisoft/ubisoft-laforge-animation-dataset (LAFAN1) | CC BY-NC-ND 4.0 | **DO NOT USE** (non-commercial, no derivatives). |
| facebookresearch/ai4animationpy | CC BY-NC 4.0 | **DO NOT USE** (non-commercial). |
| readyplayerme/animation-library | RPM licence: only with Ready Player Me avatars; no redistribution of (modified) animations | **DO NOT USE** with our own rigs. |
| madjin/awesome-cc0 | CC0 (the list itself) | Pointer list only — each linked asset has its own licence; verify per asset. |
| una-dinosauria/cmu-mocap, HF gbionics/cmu-fbx | CMU terms (free incl. commercial; acknowledgment requested) | Already used (see `assets/mocap/cmu/`). |
| Poly Haven (via Blender add-ons) | CC0 | Usable for backgrounds/textures/HDRI stills; no Blender needed to download from the site. |

Plan from this: (1) integrate Rhubarb viseme JSON → mouth shapes for a talking character; (2) keep expanding with CMU clips + hand-authored keyframes (the approach that shipped `reel-robot-cartwheel`); (3) never pull LAFAN1 / AI4Animation / RPM clips.
