# Blender-first animation (standing rule from 19 Nov 2026)

Creator rule: **all animation, including the background and everything on screen, is made and rendered in Blender** (`import bpy`, version 5.0.1 is installed as a Python module; there is no `blender` binary). This ends the three.js-in-the-page approach used for the 3D-world reels (`reel-gta6-vice-city-real`, `reel-gilli-danda-sweet-spot`, ...), which stay as shipped.

Practical pipeline for the next reel (to be proven on its mockup, then recorded here):
1. Build every scene in Blender (objects, backgrounds, camera moves as authored keyframes, text as Blender text objects or projected overlays), animate by keyframes/drivers that are pure functions of frame, render the whole film as a frame sequence (Eevee if the CPU box allows it, else Cycles with low samples; measure seconds per frame on the mockup first).
2. Keep `window.__seek(t)` as the render contract: the page may only display the Blender output (an image sequence or VP9 `<video>` seeked per frame) plus the unavoidable DOM layers (captions, end card with the profile photo). Anything that moves, glows, flies or builds up is rendered by Blender, not by CSS/three.js.
3. Plan render time before scripting: CPU only, 4 cores. A 60-90 s reel at 30 fps is ~2,000-2,700 frames; budget seconds per frame and cut samples/resolution of backgrounds first. Render in resumable chunks and keep a Monitor active (the container is reclaimed while idle).
4. Disk: the box has ~3 GB free; render to a compressed video per chunk, not raw PNG spools, and delete finished work dirs.
5. The mockup (3 scenes, 3 families) must already be Blender renders, with the measured frame time stated.
