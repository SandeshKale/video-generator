# Reel — "You're being shot right now" (≈ 60 s, fast English avatar, physics-true particle visuals)

Folder: `reels/science/reel-04-shot-right-now/`. Creator brief (19 Oct 2026): "next viral reel… next level visuals… break all benchmarks… avatar as fast as it can be to pack in more content in 60 s… visually extremely overwhelming yet making complete sense and adhering to physics at all points… be wild and creative."

## Why this reel
- **Topic search, 19 Oct 2026.** I scanned this week's science news: ScienceDaily's top stories, the 2024 YR4 asteroid (Moon impact now ruled out) and Starship Flight 15 (no date; sources conflict).
  - No single news item combined a strong hook, verifiable numbers *and* a visual that is physics all the way down.
  - The "invisible things hitting you right now" idea does. It's evergreen and second-person ("you", "your thumbnail", "your bed", "your body"). It packs five jaw-drop numbers, each with a primary source, and every one of them is a real physical process that can be simulated, not illustrated.
- **Instagram data:** `insights/report.md` (old account, fetched 12 Oct, before the suspension) is too thin to pick a topic. The only usable signals:
  - 75% of viewers skipped in the first 3 s, and average watch was 3–7 s.
  - So frame 0 must already be moving, with a number exploding on screen, and the voice must start at 0.00 s.
  - Re-run the report 48 h after this reel is live.
- **Viral mechanics:**
  - **A live counter that's literally true.** The neutrino counter shows how many passed through 1 cm² since you pressed play, at the real rate. Viewers can feel the number grow as they watch.
  - **Second-person stakes** ("through your bed").
  - **Shareable "wait, what?" facts** (bananas, Einstein, 44 tonnes a day).
  - **A save-worthy final speed stack.**

## Benchmark to beat
Previous ceilings:
- `reel-ai-trading-pipeline` (polish bar; cable match cuts and a stateful rack);
- `reel-02-cells` (cinematic WebGL plates, bloom, light-body);
- `reel-king-december-clash` (through-line film strip, marquee bulbs, Blender clapper).

What this reel does that none did:
1. **Physics-true particle simulation as the main visual, not decoration.** Every particle has a real trajectory:
   - neutrinos in straight lines from the Sun's direction, passing through Earth;
   - muons near-vertical, with the measured cos²θ angular spread;
   - meteors that decelerate and ablate;
   - decays with isotropic emission.
   A WebGL streak renderer draws motion blur analytically (streak = v × shutter), so 20k+ particles stay sharp and correct at 60 fps.
2. **Honest time-scale HUD.** Whenever motion is slowed or sped up, a readout says by how much ("SLOWED ×10¹¹"), so the overwhelming visuals still make sense.
3. **A real-time counter as the through-line.** A 1 cm² detector window flies through every scene. Its three counters (neutrinos, muons, decays inside you) run at the true physical rates for the whole reel, ending at **≈ 3.9 trillion neutrinos** after 60 s.
4. **Relativity you can see.** A twin-clock object: the muon's own clock vs the ground clock (γ ≈ 23), next to a "classical death line" at 660 m that muons fly past.
5. **A Heitler air-shower cascade.** A cosmic-ray proton hits the air at 15 km and its shower doubles every splitting length until the particles run out of energy. It's drawn as a branching tree with an altitude ruler.
6. **A Blender rigid-body simulation.** About 260 bananas, the radioactivity-equivalent of your body, fall and pile up under gravity (baked rigid-body physics, not keyframed). Green decay flashes fire inside the pile at a slowed, labelled rate.
7. **A powers-of-ten speed-stack pull-out** with motions that are correct at every scale:
   - Earth spins (1,670 km/h at the equator, ~1,580 in Mumbai);
   - Earth orbits (107,000 km/h);
   - the Sun circles the galaxy (828,000 km/h) with the planets trailing in a tilted helix.
   It deliberately fixes the famous wrong "vortex" video, where the Sun leads its planets like a comet.

## Facts (read 19 Oct 2026; tier A = primary/official, B = solid secondary, R = rounded/approximate on screen)
| # | Fact | Tier | Source |
|---|---|---|---|
| F1 | Solar neutrino flux at Earth ≈ **65 billion per cm² per second** (pp neutrinos ~60 billion); essentially unchanged at night because neutrinos barely interact with Earth. | A/B | CEA *Clefs* (cea.fr …035a044cribierGB.pdf); Raffelt lecture "66 billion" (indico.nbi.ku.dk); Super-Kamiokande day/night studies |
| F2 | Cosmic-ray muons reach sea level at ≈ **1 per cm² per minute**; produced ~15 km up; rest lifetime **2.2 µs** → ~660 m classically; they arrive because of time dilation (γ ~10–50). A palm (~100 cm²) sees ~1–2 per second. | A/B | HST/CERN teaching page (hst-archive.web.cern.ch …lifecalc.htm); Wikipedia "Experimental testing of time dilation" (Rossi–Hall) |
| F3 | A 70 kg adult carries ~16.7 mg of K-40 → **≈ 3,850–4,300 decays per second**; said as "about four thousand". | A/B | Wikipedia "Potassium-40" |
| F4 | A banana ≈ **15 Bq** (banana equivalent dose) → 4,000 / 15 ≈ 267 → "over two hundred and fifty bananas". | B | Wikipedia "Banana equivalent dose" |
| F5 | **≈ 44,000 kg (48.5 US tons) of meteoritic material falls on Earth each day** → ~0.5 kg every second; meteors hit the atmosphere at **11–72 km/s** and burn ~80–120 km up. | A | NASA Science "Meteors & Meteorites" |
| F6 | Speeds: rotation **1,670 km/h** at the equator (~1,580 km/h in Mumbai, 19° N); orbit **≈ 107,000 km/h** (29.8 km/s); Sun around the galaxy **≈ 828,000 km/h** (230 km/s). | A | NASA (Earth facts, Solar System) |
| F7 | Light/neutrinos take **8 min 20 s** from the Sun. | A | NASA |
| F8 | Optional on-screen extra: the "Oh-My-God" cosmic ray (1991) had **3.2×10²⁰ eV ≈ 51 J** in one proton, the energy of a cricket ball (160 g) at ~90 km/h. | B | Wikipedia "Oh-My-God particle" (ball maths: v = √(2·51/0.16) ≈ 25 m/s) |

On-screen rounding rule: every number shown matches its source within the rounding stated in the VO ("about", "over", "up to").

## Voice-over (English, FAST mode R17, 4 avatar parts, 43–47 words each)
1. **P1 hook (43):** "In the time you took to read this, a hundred billion particles shot through your thumbnail. Neutrinos. Sixty-five billion per square centimetre, every second, straight from the Sun's core. And at night? They come up through the Earth, through your bed, through you."
2. **P2 muons (47):** "Now look up. Fifteen kilometres above you, cosmic rays smash into air and rain down muons. A muon lives two microseconds, so it should die within a kilometre. Yet it reaches you. Why? Einstein. Near light speed, its clock slows down. One crosses your palm every second."
3. **P3 inside you + dust (45):** "Now look inside you. Every second, about four thousand potassium atoms in your body decay. That's the radioactivity of over two hundred and fifty bananas. Meanwhile, Earth sweeps up forty-four tonnes of space dust a day, slamming in at up to seventy kilometres per second."
4. **P4 speed stack + CTA (43):** "And you think you're sitting still? You're spinning at sixteen hundred kilometres an hour, orbiting the Sun at a hundred and seven thousand, and racing around the galaxy at over eight hundred thousand. All of this, right now, to you. Follow Sandesh Explains."

## Look ("Cloud Chamber")
- **Ground and grade:**
  - Ground: near-black space blue `#03050a`, with a faint cloud-chamber haze that is a real vapour-trail metaphor; particle tracks leave condensation trails that fade.
  - Grade: filmic, with bloom on hot tracks and slight anamorphic streaks.
- **Meaning-coded particle colours** (no legend needed after scene 1):
  - neutrino = ghost cyan `#9fe8ff`;
  - muon = magenta `#ff4fd8`;
  - cosmic-ray shower = hot orange `#ff8a2a`;
  - radioactive decay = uranium-glass green `#9dff5a`;
  - meteor = amber `#ffc66b`;
  - speed = white-gold `#fff3c4`.
- **Type:** an expanded heavy display face for numbers (new for this reel), a mono for HUD readouts, and Inter for captions.
- **Through-line:** the **1 cm² detector window** (a crosshair square with three live counters) is in every scene. It's the match-cut object: it shrinks into a thumbnail, rides a neutrino into the Sun, becomes the ground detector under the air shower, slides inside the banana pile, then pulls back through the powers-of-ten zoom.

## Screenplay (re-timed to the real avatar word times later)
| # | VO | Visual (physics) | Asset families |
|---|---|---|---|
| 1 | "In the time you took to read this…" | Frame 0 is already busy:<br>• the detector window fills the screen, slowed ×10¹¹;<br>• cyan neutrino streaks rain through it diagonally from the Sun's direction (thousands at once);<br>• the counter explodes from 0 to 100 billion by 1.5 s;<br>• the headline sits in the top third. | WebGL particle field, kinetic type, HUD data object |
| 2 | "…Sixty-five billion per cm²… from the Sun's core" | Pull out along the streaks: the 1 cm² window shrinks to a dot on Earth, then the Sun appears.<br>• Core cut-away: pp-chain fusion (4 protons → helium + 2 neutrinos, a short particle animation).<br>• Neutrinos leave in straight lines; the light-time readout says 8 min 20 s. | WebGL Sun shader, particle sim, data callouts |
| 3 | "…at night? up through the Earth, through your bed" | Earth cross-section (crust, mantle, core). The same straight streaks pass through all of it and exit on the night side; a "0.000…% stopped" readout. | Blender Earth cutaway plate (or a NASA Blue Marble texture), particles |
| 4 | "Now look up. Fifteen km… cosmic rays… muons" | Altitude ruler (0–15 km). A proton (orange) hits a nitrogen nucleus; the Heitler cascade tree branches downward and muons (magenta) peel off toward the ground. | Bespoke cascade data object, particles |
| 5 | "lives two microseconds… should die within a km… Einstein" | Twin clocks (muon vs ground clock, γ ≈ 23).<br>• A dashed "classical death line" at 660 m that muons fly past.<br>• A Lorentz-factor gauge.<br>• A real Unsplash star-field photo behind. | Data objects, photo, particles |
| 6 | "One crosses your palm every second" | The detector window at ground level; a magenta track stabs through it about every 0.6 s (the true rate for ~100 cm²); the counter ticks. | HUD, particles |
| 7 | "Now look inside you… four thousand… decay" | Cut inside: the detector window slides into darkness; green decay bursts (isotropic β/γ tracks) at the real rate, labelled "REAL TIME". | Particles, HUD |
| 8 | "…two hundred and fifty bananas" | Blender rigid-body sim: ~260 bananas pour in and pile up under gravity, with green flashes inside the pile. | Blender 3D rigid body |
| 9 | "Earth sweeps up 44 tonnes… 70 km/s" | Earth's limb from orbit: amber meteors decelerate and ablate at 80–120 km, with glowing trails and an ionised-wake afterglow; readout "0.5 kg / s". | WebGL plate + particles, photo |
| 10 | "you think you're sitting still?" | Powers-of-ten pull-out with true motions and stacking speed odometers:<br>• the room;<br>• Earth spinning (1,670 km/h);<br>• the orbit (107,000 km/h);<br>• the galactic helix with the planets trailing correctly (828,000 km/h). | WebGL orbital sim, Unsplash star-trail photo (real rotation evidence), odometers |
| 11 | "All of this, right now… Follow" | All layers return at once around the detector window: the final counters freeze, the profile photo, @sandeshexplains, FOLLOW. | Everything + end card |

**Families used: 9** (≥ 6 required):
1. WebGL particle simulation;
2. WebGL shader plates (Sun, Earth limb);
3. Blender 3D (rigid-body bananas, Earth cutaway);
4. real Unsplash photos (star field, star trails);
5. bespoke data objects (counters, twin clocks, cascade tree, odometers);
6. kinetic type;
7. footage overlay (dust / grain);
8. avatar host;
9. audio family (score, physics-synced SFX, voice).

## Physics guardrails (checked before render)
- Neutrino tracks: perfectly straight and never deflected by matter; they all come from the Sun's direction; there is no "absorption" except the honest "~0%" readout.
- Muon arrival angles follow cos²θ around the vertical; muon tracks are straight; decays (classical death) are shown only on the dashed "without relativity" ghost layer.
- Shower: particle count doubles per splitting step and energy halves; the cascade stops when energy falls below critical. The tree widens with depth and never runs upward.
- Decays: isotropic emission directions, with no preferred axis; the rate label is honest ("REAL TIME" or "SLOWED ×N").
- Bananas: baked rigid-body physics (gravity 9.81, friction and restitution set); no keyframed bodies.
- Meteors: they decelerate (never accelerate) and brighten, then fade as they ablate. Entry angles are varied; they burn out above ~70 km.
- Orbits: Earth rotates west to east (counter-clockwise seen from above the North Pole) and orbits counter-clockwise. The Sun's galactic motion carries the whole system; the planets trail and lead correctly in a helix inclined ~60° to the direction of motion. The Sun never "leads like a comet".
- Every time-scale change is labelled on screen.

## Validation plan
- `check.mjs` (overlaps, safe zone, caption band).
- `change-cadence.mjs` (the particle fields will dominate).
- Contact sheets at full and phone size.
- Frames inside every cut and the host-crop diff on the final MP4.
- A mix report (voice over music ≥ 19 dB median, ≥ 13 dB min).
- A per-scene physics checklist against the guardrails above.
