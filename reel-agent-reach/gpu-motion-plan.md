# GPU / animation tasks beyond the avatar — what this reel uses (Oct 9, 2026)

Honest finding first: cel-shaded 3D is cheap. The Reach glove renders at ~0.15 s/frame **on this CPU box** (Blender Cycles, emission toon shader, 600 px), so it needed no GPU. The GPU earns its keep on *generative* work and on heavier Blender scenes.

| # | Task | Where it runs | Used in (beat) | Status |
|---|---|---|---|---|
| 1 | **3D Reach glove**, procedural, cel-shaded, pure-function-of-t clips (wave, peek, count 1-4, point down/left, thumbs-up) → alpha WebM | CPU here (Blender `bpy`) | hook peek (s01), counting platforms (s07), point at tiles (s08), CTA point-down (s19-21) | **Done**: `blender/glove.py`, `blender/clips.json`, `site/mascot/*.webm`; alpha + seeking verified in Chromium over the Range server |
| 2 | **Host cut-out (video matting)** so graphics sit behind/around the host, sticker outline, text behind head | CPU is enough (RVM / rembg per slice); GPU optional | layouts A/B | Next, after the lip-synced clips arrive |
| 3 | **Generated object photos** (eye, switchboard, cables, magnifier, newspapers, radar dish, rotary phone) → cut-outs → torn-edge collage on bone paper, cover hero | **Kaggle GPU** (RealVisXL Lightning, OpenRAIL++ commercial OK) | s02 (eyes), s12 (switchboard), cover, montage tiles | Notebook `AgentReach_GPU_extras.ipynb` in Drive |
| 4 | **AI video inserts** (eye opening, server-room dolly, hands on switchboard), 24 fps by interpolation | **Kaggle GPU** (CogVideoX-2b, Apache-2.0; 720×480 → used as ≤600 px inset windows) | s02 hook insert, s14-17 montage backdrop | same notebook; always tagged "AI VIDEO" |
| 5 | **3D patch-cord switchboard** scene (cords with physics, sparks) for "It's a switchboard over tools" | CPU toon first; Cycles GPU if we want real materials | s12 | planned (Blender) |
| 6 | **Paper transitions** (page curl / torn edge, taped card drop with cloth) | CPU/GPU Blender, alpha WebM | between beats | planned |
| 7 | **Depth parallax** of the generated stills (Depth-Anything-V2-Small, Apache-2.0) | CPU is enough | montage, cover | after stills arrive |
| 8 | Frame interpolation of the 25 fps host to 50/60 (RIFE), face upscaling | GPU nice-to-have | host layer | only if the host looks steppy next to 60 fps graphics |

Held back (licence or fit): EchoMimicV2, LivePortrait, GFPGAN (see `gpu-options.md`); MusicGen (non-commercial); text/UI generation by video models (they garble text, so UI panels stay as real HTML).

Labels: every generated still/clip carries an on-screen "AI IMAGE" / "AI VIDEO" tag and the caption says so.
