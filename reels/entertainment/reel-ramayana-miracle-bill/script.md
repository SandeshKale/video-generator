# Reel: "VFX ka Bill" (series idea: Chamatkar ka Bill) — the bill for computed light (Ramayana: Part 1)
Folder `reels/entertainment/reel-ramayana-miracle-bill/` · ~80 s · Hinglish voice-over (cloned voice), English on screen · nerdlogic.co · CTA "share aur follow"

## Why this reel
Creator-chosen topic (18 Nov 2026): the film wave (Part 1 released ~5 Nov 2026) + the account's film tie-in formula (film moment → real thing → honest limit). Instagram data on file is the 19 Oct snapshot (`insights/ig-posts.json`, old account), so the decision is the creator's; earlier Ramayana reels exist (`reel-ramayana-trailer-review`, `-movie-trivia`, `-book-now`), so this one deliberately avoids trivia/review and is a physics-and-cost explainer. Existing film-tie-in benchmarks to follow: `reel-jatayu-flight`, `reel-sone-ki-lanka`, `reel-surya-tilak`.

## One-sentence story
Sunlight on a wall costs nothing, but the same ray on a screen has to be computed, so the miracle on the big screen arrives with a bill — and the people who built Interstellar's black hole show that the bill is physics, not trickery.

## But / Therefore beat sheet
1. Chandrayaan-3 reached the Moon for ₹615 cr **but** Ramayana P1 is reported at ₹835–900 cr: showing a miracle costs more than flying to the Moon? (open loop: why?)
2. A real sunbeam is free: it just goes **but** on a screen nothing exists until someone computes where each ray goes → **therefore** every ray is a question the computer must answer (the bill).
3. This film's producer runs DNEG, which paid that bill in Interstellar: some frames ~100 h (reported) → **therefore** they ended up with two real physics papers: their light is physics.
4. **But** a miracle also needs bodies: ~42 infrared cameras on the capture floor (cinematographer) → Kumbhakarna, Hanuman, Asuras come from captured movement.
5. **Therefore** Jatayu: entirely CG, only two live actors in the scene (cinematographer): each wing, each shadow is computed (payoff of the Jatayu reel).
6. **But** the real total is unknown: render hours, power, scope of budgets are not public; reported budgets conflict (₹835–900 cr Part 1; ~₹4,000 cr both parts, makers). Honest ending.
7. Callback: the sunbeam on the wall is free; the one on the screen has a bill. CTA.

## Voice-over (Roman master; Devanagari version goes in `script.json` at the voice step)
| id | line | fact carried |
|---|---|---|
| s1 | Chandrayaan-3 chaand tak 615 crore mein pahuncha. Ramayana Part 1 ka reported budget: 835 se 900 crore. Chaand par jaana sasta, aur chamatkar dikhana mehnga? Aisa kyun? | #1, #2 |
| s2 | Asli duniya mein sooraj ki kiran muft hai. Deewar par girti hai, aur bas chali jaati hai. Kisi ko hisaab nahi lagta. | — |
| s3 | Parde par kuch pehle se maujood nahi hota. Har kiran ke liye computer ko poochna padta hai: ye kahan girti hai? Kahan mudti hai? Kahan rukti hai? Isi sawaal ka bill lagta hai. | mechanism |
| s4 | Is film ke producer Namit Malhotra ki company DNEG ye bill pehle bhi bhar chuki hai. Interstellar ka black hole yaad hai? Reports ke mutabik kuch frame ek-ek ke liye sau ghante tak render hue. | #4, #6 |
| s5 | Aur us kaam par do asli science paper chhape. Yaani wahan roshni ka khel physics ka tha, jaadu ka nahi. | #5 |
| s6 | Ab Ramayana ki taraf. Cinematographer Pankaj Kumar ke mutabik, motion capture floor par karib bayalis infrared camera the. | #7 |
| s7 | Kumbhakarna, Hanuman, asur: jahan asli actor nahi, wahan unki chaal capture ki gayi. | #7 |
| s8 | Aur Jatayu? Unke shabdon mein, Jatayu poori tarah CG hai. Us scene mein sirf do asli actor the: Yash aur Sai Pallavi. | #8 |
| s9 | Yaani har pankh, har chhaya, un par padti har kiran ganit se aayi. | tie-back |
| s10 | Poora bill kitna? Ye abhi kisi ne nahi bataya. Render ke ghante aur bijli ka kharcha public nahi hai. Budget ke aankde bhi alag-alag hain: Part 1 ke liye 835 se 900 crore, aur do hisson ka milakar, makers ke mutabik, 4,000 crore. | #2, #3 |
| s11 | Ye tulna adhoori hai, ek mission ki aur ek film ki. Par sawal asli hai: jab agli baar parde par roshni ki ek kiran dikhe, yaad rakhna, asli duniya mein wo muft thi. | honesty + callback |
| s12 | Aisi aur kahaniyan chahiye? nerdlogic.co ko follow karo, aur share karo. | CTA |
~190 words, target ~80 s at ~2.5 words/s with designed pauses.

## Style (Lemo-Opuscar index, 99 styles, refreshed 18 Nov)
- **Choice: `dark-documentary` ("Radar Sweep Documentary")**, runner-up `oscilloscope-math`. STYLE.md read in full. Topic type: a cost/physics explainer about *light*; story shape: one cause chain with an honest ending. The style's own premise — "the world is black until a scan passes" — is the reel's thesis: a real room is lit for free, a screen's world exists only where something has computed it.
- **Invariants kept:** (1) nothing is lit by ambient light; every object appears only when an analytic scan front reaches it, then settles into echoes (contours, range rings, wireframe) — one shared scan function per space; (2) facts are instrument readings in small mono type next to the object, written on by the scan, with a source tag on every figure; (3) one warm accent only for the target/signal (the ray / the bill), everything else cold, a cold rim on each hero.
- **Adapted:** vertical 1080×1920 at 30 fps (style asks 24); English on screen only (the style's Chinese line is dropped per the DIRECTOR rule); captions plain 40 px per our rule instead of the style's subtitle patch; title in a thin humanist sans — our vendored set has no IBM Plex Sans, so Inter 200 + JetBrains Mono 300 (to confirm weights are vendored); palette ours: black, cold ice `#a9d8f0`, one ember accent `#ffb25b` (not violet/lime/amber-on-navy of earlier reels), red only for a value over a limit.
- **Not this style:** LiDAR Survey (we use no measured scan data here), Hologram HUD (no floating chrome panels).
- Native moves used: the scan reveal, scan rewrites time (night room → sunlit room, labels erased by the second scan), motion echo (voxel actor after-images), radial ping (opening and ending), instrument readings written by the scan, CRT-to-scan is not used. Demo-difference check (DIRECTOR §11): opening, signature shot, camera path, score shape, ending must differ from the demo — ours opens on a *cost comparison traced by the scan*, signature shot = a continuous one-take dolly through a dark room that the scan builds, ending on echoes fading to black after a radial ping.

## Benchmark to beat (standing rule)
Previous ceiling: `reel-ipl-swap-purse` (bespoke 3D data objects + photo cards, 75 s) and the `reel-surya-tilak` v3 light-shaft glass temple. This reel must do things neither did:
1. **A shared analytic scan** that builds every scene (no hard cuts; max 1 scan-wipe per ~20 s) — the whole 80 s is one traveling world.
2. **A real gravitational-lensing shader** (Schwarzschild null geodesics: rays bending around a mass, photon ring) shown as the "physics of light" proof — nobody in the repo has bent light.
3. **42 capture cameras as a ring of instanced cones** lighting one by one around a voxel performer with wireframe after-images, and a **fully wireframe CG bird** vs two live actors, held as a comparison.
4. **≥ 9 distinct authored camera moves** (dolly, crane up, orbit, lateral track, pedestal, push-in, pull-back-and-up, whip pan, radial-ping reveal) plus one continuous oner.
New technique to introduce: the lensing shader + scan-rewrite-time transition.

## Shot list (authored camera; locked between moves)
| t (s) | line | move | object | readout (source) |
|---|---|---|---|---|
| 0–11 | s1 | radial ping, then slow dolly-in on two instrument traces rising (Moon landing marker vs film frame marker) | two bars scanned into existence over a black plane; a lunar sphere and a film-frame rectangle | `CHANDRAYAAN-3 ₹615 CR (REPORTED)` vs `RAMAYANA P1 ₹835–900 CR (REPORTED)` |
| 11–21 | s2 | lateral track along a dark room wall to a window | wall, dust, sun shaft (free) | `REAL SUNLIGHT: 0 CALCULATIONS` |
| 21–33 | s3 | crane up as the scan plane sweeps; rays leave a camera point and ask "?" at each surface | room built by scan; ray bundle; rolling counter (illustrative) | `ONE RAY = ONE QUESTION` |
| 33–47 | s4–s5 | orbit around the lensing mass; push into the photon ring; scan rewrites the room into a star field | rays bending, accretion ring, paper citation typed | `SOME FRAMES UP TO ~100 H (REPORTED)` · `CQG 32 (2015) 065001 · AJP 2015` |
| 47–58 | s6–s7 | whip pan to a ring; orbit + lateral track beside a voxel performer | 42 camera cones lighting 1…42, mocap after-images | `ABOUT 42 IR CAMERAS (CINEMATOGRAPHER, THR INDIA)` |
| 58–68 | s8–s9 | low push-in, then pedestal/crane up | scan builds a huge wireframe bird over two tiny voxel actors | `LIVE ACTORS: 2` vs `JATAYU: ENTIRELY CG` |
| 68–76 | s10 | locked frame, cursors measure | ledger of knowns/unknowns | `RENDER HOURS: NOT PUBLIC` · `POWER: NOT PUBLIC` · `P1 835–900` · `BOTH ~4,000 (MAKERS)` |
| 76–84 | s11–s12 | pull back and up; radial ping; echoes fade; end card | the first sunlit wall, now with a ping | end card nerdlogic.co, FOLLOW · SHARE |

## Asset families (need ≥ 6; scene → family)
three.js analytic-scan shader world (all), analytic physics (S4 lensing), instanced geometry (rays, 42 cones, voxel performer/actors), DOM/canvas instrument readouts + kinetic type (all), real film still (hook or S7, ≤2.5 s, credited) or typographic title, real data/typography from the arXiv listing (S4 citation), real-footage overlay (dust/grain webm, S2 and S8), Moon texture from `assets/space` (S1), synth score + sonar-ping SFX + cloned voice (all). Count: 8. Audit: no family in > 4 scenes except the engine itself; no scene with < 2 families.

## Honesty and handling rules
- "Reported"/attributed labels on every money figure; Chandrayaan vs film comparison is called incomplete in s11.
- No actor likenesses, no Lanka/creature copy, no film design copy; stills ≤ 2.5 s, credited.
- The lensing scene is labelled "ILLUSTRATION · SCHWARZSCHILD (NON-SPINNING)": Interstellar's black hole spins (Kerr), ours does not; we do not claim to reproduce it.
- Not claimed: Yash scanned by 86 cameras; 10-head shoot days; box office; render hours/power for Ramayana.
- Tone: awe, not mockery; no "Ravan jhootha" framing.

## Publish kit (draft)
- Cover: "VFX KA BILL" (3 words, creator-chosen 18 Nov) over a cold-ice sunbeam hitting an ember-colored rupee mark? decide at cover step; check on the 3-up grid.
- Hashtags: to be set with the creator (the IPL set was creator-chosen); candidates #Ramayana #VFX #Interstellar #IndianCinema #Physics.
- Open-first before posting: THR India interview full text, DNEG/Wired 100 h source, current budget reports, release-date wording.
