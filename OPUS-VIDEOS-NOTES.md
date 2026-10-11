# External reference — `yihui-dev/awesome-opus5-5-videos` (indexed 11 Oct 2026)

**What it is:** a curated list of viral videos (mostly posted on X, Sep–Oct 2026) made by asking Claude Opus 5.5 to write the animation as code (HTML/Canvas/SVG/GSAP/Three.js/GLSL, some Remotion/HyperFrames). It's MIT-licensed as a list, but **every video and prompt belongs to its creator**: learn from the techniques, never copy a prompt or a look verbatim.
- **Size:** 513 entries and 459 distinct prompts.
- **Categories:** motion 317, interactive 70, explainer 67, 3D 59.
- **Tech tags:** canvas 351, svg 219, threejs 147, shader 104, gsap 100, css 68, audio 36, particles 26.

**How to look things up again:**
- **All the data:** `https://raw.githubusercontent.com/yihui-dev/awesome-opus5-5-videos/main/data/videos.json` is one array of `{slug, author, post_url, category, tech_tags, prompt, prompt_partial, poster_url, skillry_url, added}`.
- **Download:** `curl` it into the scratchpad; WebFetch only returns summaries.
- **Per-entry pages:** `prompts/<slug>.md` in the repo, and a live remake at `skillry.dev/ai-videos/opus-5-5/<slug>`.
- **What's in the list:** the dominant prompt is the one-liner "15-second motion-graphics showreel, go all out" (≈40 copies). The useful material is in the ~30 long, structured prompts listed under "Entries worth re-reading" below.

## What the best entries do (techniques to steal, mapped to this repo)
Each entry below has a status: **DONE** = already in our pipeline; **ADOPT** = do it from the next build on; **TRY** = worth a test.

1. **Every style is computed from time inside `seek(t)`**: no CSS animations, no timers, no state between frames. The structured prompts all state this, and the real-footage ones extract clips to JPEG sequences and make seek await image decodes. **DONE** (our core contract).
2. **Beat grid as the master clock.**
   - Analyse the song (tempo, beat grid, energy per bar, the drop) with numpy, then calibrate the grid to the real kick hits.
   - **Every cut sits on a downbeat and every UI hit on a beat.** One entry wrote the music note by note in Python, reading *the same beat file as the visuals*, so on-screen events and musical blips land on the same frame.
   - **ADOPT:** our voice-led reels can't move cuts, so do the reverse. Generate the score from `events.json` and `SC` (scene starts): put a downbeat or stinger exactly on each cut, and quantise small UI hits to the nearest 1/8 note when within ±60 ms.
   - Our `sfx.py` cue system already switches cues at scene starts. What's missing is beat-locking the cue *bars* to the cut times (choose BPM per cue so the cut lands on bar 1).
3. **Real motion blur:** render 3 subframes per frame (t − 1/240, t, t + 1/240) and blend them with ffmpeg `tmix`. **TRY** on fast moves only: it triples capture cost, so gate it to whips and big entrances, or render those slices at 3× and `tmix` just those.
4. **SFX placement by measured peak:** align each effect so its *measured peak*, not its file start, lands on the event. **ADOPT** in `sfx.py`: compute each synthesized SFX's argmax(|x|) and offset by it.
5. **Restraint list for a "high-end minimal" look:**
   - one idea per shot, lots of empty space, one accent colour;
   - one clean sans with tight tracking;
   - masked type reveals, match cuts, **one consistent camera language**.
   - **Banned:** shockwave rings, particle bursts, RGB split, camera shake, lens flares, neon glows, grid floors, flashing backgrounds, bouncy easing.

   **Note:** our reels often use bounce entrances and small jolts. Pick per reel; for a premium or tutorial register, prefer this restraint list.
6. **"Avoid frames and texts on the corners, which are typical AI giveaways"** (two creators flagged this). Our eyebrow tags and corner labels risk reading as AI template chrome. **ADOPT:** no decorative corner HUD text, and every label must carry real information (source, unit, step).
7. **One strong formal idea per scene; simulate the real thing.** The best explainer prompt asks for a *real* random walk, not a drawing of one, real numbers with honest uncertainty, visual gags, callbacks, and a parallel timeline of context. **DONE in spirit** (`reel-ai-reads-tokens` uses real token splits). Keep pushing: compute, don't depict.
8. **Self-review loops (the black-hole lab entry):**
   - Three rounds; each round has **two reviewer agents** who each list 9–10 issues ranked P0/P1/P2, and **one fixer**.
   - Every P0 is fixed; where reviewers disagree, pick one and log why.
   - **Back up before each round**, screenshot after it, and **roll back** anything that can't be fixed.
   - Round themes: (1) materials/lighting + UI/type, (2) camera/interaction + science-communication, (3) a "design director decides whether it ships" + visual QA/perf.

   **ADOPT** as the shape of our strict-validation rule's reviewer step (`MOTION-DESIGNER-NOTES.md` 7-axis rubric). Run it only when the user asks for sub-agents.
9. **Verification before render:**
   - "Probe 20 or more frames before the full render; fix anything cluttered, overlapping or hard to read."
   - "Render stills of every scene and review them critically, check transitions frame by frame, **measure the audio mix numerically**."
   - **DONE/ADOPT:** we do contact sheets and `check.mjs`. Add a numeric mix report (voice vs music dB per spoken segment) to every reel's delivery.
10. **Storyboard on the beat grid before code:** show every timing first. **ADOPT** in the script stage: the screenplay table already has times, so add bar numbers when the score is beat-locked.
11. **Preserve-3d gotcha:** never set `opacity` or `filter` on a `preserve-3d` element, because it flattens and both faces show; fade a wrapper instead. Also measure element positions at runtime for match cuts. **ADOPT** (relevant to our CSS-3D stacks).
12. **Camera language:** "slow and polished — one continuous camera over one desktop, no hard cuts; pushes/pulls/pans 1.5–3 s on gentle ease-in-out, half the speed you'd default to; motion blur on fast moves; light film grain; oversized cursor." **TRY** for a product/UI reel: our reels cut a lot, and a one-take camera is a distinct grammar we haven't used.
13. **Infinite zoom / scale journeys** (desktop → point in space → phone; hillside → observable universe) and **"poster breaking out of its own frame"** are recurring viral forms. Both are pure-`t` friendly (nested transforms with exponential scale). **TRY** as a cold-open or transition grammar.
14. **Full-stack autonomous explainer brief (60 s photon journey):**
    - a script and the best TTS available;
    - burned-in captions (sound-off viewing);
    - an **original score that changes with each scene**;
    - SFX synced to every on-screen action;
    - **music ducks under the voice, mastered to streaming loudness**;
    - deliver the source too.

    **DONE** structurally (`sfx.py`, captions, avatar voice). The bar to keep: sound design tied to *every* action, with the mix measured.
15. **Procedural 3D with provenance:** the Blender Market Street 1906 entry builds a sourced data file first (footprints, heights, materials, each with source and confidence), then **reusable generators**, assembling the scene from the data so every object traces back to a fact. **ADOPT** for data-driven 3D (e.g. a model-size bin wall built from a CSV of real sizes).
16. **Real assets, not placeholder cards:**
    - real footage clips;
    - accurate app recreations with real icons;
    - real app UI copy matched to the source post.

    **Repo stance:** brand UIs only nominatively and labelled; never impersonate a product's real interface as genuine.
17. **Remotion / HyperFrames** dominate the tool mentions (37 / 14). Our engine (plain HTML + `__seek` + Playwright + ffmpeg) is equivalent and stays. Remotion's useful idea is *frame-number-first* thinking (`useCurrentFrame()`), which matches ours.

## Entries worth re-reading (slugs; open `prompts/<slug>.md` or the JSON)
- **Structured production briefs:**
  - `twoclipping-000267`: beat-grid launch-video template with inputs, direction, banned list, build and gotchas.
  - `astrothewizard-618782`: a 60 s autonomous explainer with full audio, captions and verification loops.
  - `jake11moran-414633`: one-camera desktop teaser.
  - `jhylee95-452427`: score synced so every cut lands on a beat.
- **Explainers:**
  - `emollick-019567`: recursion, where every explanation is in a radically different style.
  - `ror-fly-880547` and `sarut0bisasuke-069973`: recipe explainers, ingredients and measurements entering the glass.
  - `alex-prompter-997524`: 5-scene business explainer — problem, what I do, 3 steps, proof, name.
- **Interactive explainers (take-apart engines, black-hole lab):**
  - `voxyz-ai-345550`: the 3-round, 2-reviewer + 1-fixer loop.
  - `konstantinsaifo-501736`: Raptor 3 rocket-engine cutaway.
  - `stefanostraus-971191`: pistons vs magnets.
- **Audio-led:**
  - `iniyanai-856596`: music written in code, real switch recordings as beats, every cut timed to the beat.
  - `apoorvjain25-309680`: Python-composed music sharing a beat file with the visuals.
- **3D:**
  - `alexalbert-274839`: Blender procedural with a sourced data file.
  - `0xwast3-222104`: parse → mass → rig → skin → pack, a modeller-style construction pipeline.
- **Style references:**
  - `anjmaxx-459455`: papery K-pop music video with a character sheet first, then supporting cast.
  - `paranoidamerica-686717`: ballpoint + "postcards in space" collage with SDXL assets, composited.
  - `eric-khun-667455`: a hand-drawn mascot with researched cultural details.

## Applied to the next build (`reel-ai-reads-tokens`), if the user approves continuing
- Beat-lock each music cue so scene cuts land on bar 1.
- Shift SFX by measured peak.
- Numeric mix report: voice-over-music dB per spoken word span (target 16–20 dB), integrated LUFS and true peak.
- No decorative corner text.
- Fade wrappers, not `preserve-3d` elements.
- Probe ≥ 20 frames before the full render.
