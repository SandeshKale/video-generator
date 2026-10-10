# Animation assets plan — higher-quality, licence-checked (Oct 10, 2026)

**Approach:** real rigged 3D characters rendered in Blender with a custom two-ink riso toon shader (+ outline), exported as transparent VP9 WebM clips and seeked in the page (`currentTime=(frame+.5)/fps`, Range server — verified approach from the glove clips). Much higher quality than hand-drawn SVG shapes.

| Asset | Source | Licence | Used for | Status |
|---|---|---|---|---|
| **Animated Robot** (14 actions: Idle, Punch, Death, Dance, ThumbsUp, Yes, No, Wave, Walk, Run, Jump…) | Quaternius, itch.io `lowpoly-robot` | CC0 (License.txt in the zip) | the humanoid fighter robots; Punch, Death (head pops off, matches the story), Idle, Dance | **Downloaded + loads in Blender 5.0; Punch/Death frames render (CPU ~0.2 s/frame)** |
| **Animated Human** (Idle, Jump, Punch, Run, Walk, Work, Death) | Quaternius, OpenGameArt | CC0 | the human fighter + the seated pilot (Work) | Downloaded (blend); to test-render |
| Universal Animation Library (120+ humanoid anims incl. combat/emotes) | Quaternius itch | QAL v1.0 (Aug 2026): commercial use of renders OK, no credit; **must not redistribute the assets** | extra boxing/guard/knock-down clips if the Human pack is not enough | optional |
| Animated Mech Pack | Quaternius (Drive folder) | listed CC0 (site now QAL) | optional 4th robot design | Drive folder download failed (quota); optional |
| Own assets | `reel-agent-reach/blender/glove.py` approach | mine | VR headset, gamepad, controller buttons, bell, ring (procedural) | to build |

**Repo rule:** raw third-party model files are NOT committed (QAL forbids redistributing assets; keeps repo small). `fetch-assets.sh` re-downloads them into `assets/quaternius/` (git-ignored). Only our own renders (WebM) and scripts are committed.

**Shader:** 3-band cel shading in two inks (ultramarine + coral) on cream, halftone texture in the shade band, inverted-hull outline in deep ink, mild misregistration offset between ink passes (render each ink as a separate pass → composite with `multiply` in the page).
