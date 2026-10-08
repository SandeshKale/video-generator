# Reel script — "The robot's cartwheel was a human's first" (draft v1, 2026-10-08)

Format 9:16, 1080×1920@60, ~67 s, Kokoro `am_adam` base ≈1.1, no filler clips, hook payoff by ~3 s.
**Purpose:** a showcase for the new BVH→2D-rig character system (`ANIMATION-RESOURCES-NOTES.md`): one rig, two skins (human mocap suit / robot), driven by clips that are pure functions of `t`. The story is *about* motion capture, so the character is the content, not decoration.

## Why this story
- **Fresh and visual:** Science Robotics paper "BeyondMimic" covered Sept 10 2026 (UC Berkeley + Stanford); ZEST (Boston Dynamics + RAI Institute) covered Aug 12 2026; humanoid-robot moves are the most-shared tech clips of 2026 (Unitree moonwalk fall 5M+ views, May).
- **The character IS the proof:** a cartwheel, a spin kick and a sprint are exactly what a mocap-driven rig shows best; a viewer sees the human clip and the robot copy side by side.
- **Hard numbers in most scenes:** 2.5 h, 30 clips, 77 people, 70.8 %, 10 h, 7,000 iterations, 1 GPU.
- **Fits the benchmark asks:** bright palette (next-reel headroom note), new character system, no chat-privacy/agent-misbehaviour repeat.

## Voice-over (≈190 words, ~67 s)
1. This robot just did a cartwheel. A human did it first.
2. Researchers at Berkeley and Stanford gave a Unitree G1 humanoid about two and a half hours of human motion capture. Walking, running, dancing, martial arts, cartwheels.
3. It doesn't copy frame by frame. A reward system scores how closely it tracks the move, and punishes jerky motion, unsafe joints, and bumping into itself.
4. Two AI models compress those moves into a compact code, then plan new sequences from it. Sprints. Spin kicks. Aerial cartwheels.
5. Thirty clips ran on the real robot. Joystick control and obstacle avoidance worked without retraining.
6. Does it look human? Seventy-seven people compared its walking and running with Unitree's standard controller. In seventy point eight percent of comparisons, the new one looked more natural.
7. Boston Dynamics and the RAI Institute built a similar system, ZEST. It learns from mocap, video, or animator keyframes. About ten hours of training, one GPU.
8. The catch, per ZEST's authors: flat, non-slippery floors only, and no moves it hasn't seen.
9. Every robot flip starts as someone's dance. Whose motion is it? Tell me below. Follow for the next AI story.

## Fact table (confidence tiers)
**A — one detailed report of a peer-reviewed paper (TechXplore, Sept 10 2026) — label "per the paper / as reported"**
- **BeyondMimic**, *Science Robotics* 2026, DOI 10.1126/scirobotics.adx8924; UC Berkeley + Stanford; authors include Qiayuan Liao and Takara E. Truong. Robot: **Unitree G1**.
- Trained on **~2.5 hours of human motion data** (walking, running, dancing, martial arts, jumping, cartwheels, other agile moves), retargeted to the G1's proportions.
- Reinforcement learning rewards motion-tracking accuracy; penalties discourage **jerky movements, unsafe joint positions and unwanted body contact**. A **variational autoencoder** compresses actions into a latent space; a **diffusion model** predicts sequences and is guided at test time toward new objectives.
- Validated in simulation, then **30 representative clips on the real G1**: balancing poses, dancing, crawling, sprinting, kicks, spinning jumps, aerial cartwheels. Authors: "mastery of a wide range of highly agile behaviors, including aerial cartwheels, spin kicks, flip kicks, and sprinting."
- Without task-specific retraining: motion inpainting, joystick teleoperation, obstacle avoidance; skills **transferred to hardware zero-shot**.
- **User study: 77 participants**, walking/running vs Unitree's standard controller: in **70.8 %** of comparisons BeyondMimic was rated "more humanlike and natural."
**B — one outlet (Interesting Engineering, Aug 12 2026) — label "as reported"**
- **ZEST** (Zero-shot Embodied Skill Transfer): RAI Institute + Boston Dynamics. Learns from **mocap, single-camera video, keyframe animation**; robots **Atlas, Unitree G1, Spot**. Atlas skills: crawling, forward rolls, cartwheels, army crawling, breakdancing; video-derived: dancing, soccer kick, box climbing; Spot: backflip, barrel roll. **~10 h training per policy, ~7,000 iterations, single NVIDIA L4 GPU**. Limits: **flat, non-slippery environments; no generalisation to completely unseen movements**.
**C — do NOT say**
- That BeyondMimic's training clips come from CMU or any specific dataset (not stated); that the robot "learned from our rig/clips".
- Sprint speeds or per-task success rates (not reported).
- That robots "replace" dancers/actors, or any claim about who owns motion data (the closing line is a question only).
- That the G1 does cartwheels "reliably"/outdoors; hedge with "in the paper's tests".
- The 70.8 % applies to **comparisons of walking/running motions** vs Unitree's controller, **not** to all behaviours.
- On-screen figures are **illustrations driven by licence-clean mocap (CMU) — label "ILLUSTRATION · NOT THE ROBOT'S FOOTAGE"**.

## Hook options (frame 0 fully composed, voice at 0.00 s)
- **A (in script):** "This robot just did a cartwheel. A human did it first."
- **B:** "Every robot backflip you've seen started as a person in a mocap suit."
- **C:** "Two and a half hours of human motion taught a robot to cartwheel."

## Retention plan (3-second skip rate)
- 0.0 s: stage already composed; the human figure mid-cartwheel on the left, the robot figure mirroring on the right; caption visible; voice at once.
- ≤3 s: **"2.5 HRS OF MOCAP"** stamp slams between them (payoff before the first scene change).
- A visible change every ~0.5 s early; no wipe before 3 s; the figure is ALWAYS moving (clip loops), so every scene has motion independent of the voice.
- Mid-video turn: s06 "Does it look human?" → the 70.8 % ring; s08 "The catch" → robot slips on a wet-floor sign.
- End on a question + CTA (profile, @sandesh.explains, FOLLOW) held ≥ 3 s; the figures take a bow.

## Visual centerpiece per scene (to be built with the BVH→rig system; mockups cover s01, s04, s06)
1. **Twin stage:** human (black suit, white markers) and robot (same rig, metal skin) on a studio floor; cartwheel clip; timeline scrubber with keyframe diamonds; `2.5 HRS` stamp.
2. **Clip shelf:** 5 clip cards (WALK · RUN · DANCE · MARTIAL ARTS · CARTWHEEL) as film slates, each with a tiny looping figure; counter 0→2.5 h.
3. **Reward meter:** one figure tracking a ghost target; "TRACKING ✓" green; penalties as three red tags that flash when the figure jerks / bends a joint wrong / clips itself.
4. **Latent grid:** 12 tiny pose thumbnails in a grid, a glowing path connects 4 of them (sprint → spin kick → flip kick → cartwheel); the big figure plays the path.
5. **30 clips:** 30 dots filling in; joystick + obstacle icons; "NO RETRAINING" stamp.
6. **70.8 % ring** with two walkers (stiff vs natural) and 77 tiny people icons.
7. **ZEST card:** three inputs (mocap / video / keyframes) → Atlas, G1, Spot silhouettes; counters 10 h · 7,000 · 1 GPU.
8. **Flat floor only:** the robot slides on a wet-floor sign; "FLAT · NON-SLIPPERY" and "NO UNSEEN MOVES" tags.
9. **CTA** with both figures bowing.
Eyebrows (content-specific): `// 2.5 HOURS OF HUMAN MOTION` · `// THE SCORECARD` · `// A VOCABULARY OF MOVES` · `// 30 CLIPS · NO RETRAINING` · `// 70.8% MORE HUMAN-LIKE` · `// ZEST · ATLAS · SPOT` · `// FLAT FLOORS ONLY` · `// SOMEONE'S DANCE FIRST`.

## Style proposal (NEW system, bright): "Studio Slate"
Light studio-grey set with a calibrated floor grid, ink-black suit figure with retro-reflective marker dots, hard-edged white slate cards with 4 px ink borders and offset shadows, hot-pink + sunshine-yellow accents, sky-blue skeleton overlays. Outfit 800 + Inter + Space Mono. (First bright reel since the dark-palette run.)

## Sources
- TechXplore, "Humanoid robot learns to sprint and perform spin kicks using AI trained on human motion data" (Sept 10 2026) — https://techxplore.com/news/2026-09-humanoid-robot-sprint-ai-human.html
- Interesting Engineering, "Humanoid robots master crawling, cartwheel and backflips using motion data, animation" (Aug 12 2026) — https://interestingengineering.com/ai-robotics/humanoid-robot-master-complex-movements
- *Science Robotics* paper DOI 10.1126/scirobotics.adx8924 (not opened directly; via TechXplore)
- Motion data for our illustration: CMU mocap BVH mirror (`una-dinosauria/cmu-mocap`), terms in `READMEFIRST.txt` to be recorded before use.

## Alternatives considered
- NVIDIA SONIC / Kimodo text-to-motion; Dyna Robotics DYNA-2 (1M+ hours of human video); Unitree moonwalk-fall clip (May, 5M+ views). BeyondMimic wins on freshness, verifiable numbers and visual fit.
