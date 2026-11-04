# "Pilot nahi, engine nahi" — ISRO's Pushpak lands itself (Hinglish explainer, draft v1, 4 Nov 2026)
Status: **script + shot list for approval (nothing built).** Method: `docs/STORYTELLING-GUIDE.md`, `docs/QUALITY-FLOOR.md`, authored cinematic camera. Creator feedback 4 Nov 2026: **"need more polished and premium 3d assets in this one; better and more spatial camera movements."**

## 0. Why this reel
- Insights data is stale (12 Oct); pick rests on the creator's brief (bird's-eye shots, Ramayana-adjacent) + storytelling filter. Only the *name* links to the Ramayana (Pushpaka Vimana); the reel says so and claims nothing more.
- Honesty frame: LEX-03 was a **landing test from a helicopter at 4.5 km**, not a return from space. Re-entry was HEX-01 (2016); orbital return is future and undated.

## 1. Benchmark to beat (previous = `reel-ram-setu-from-above`)
Ram Setu: schematic land, simple satellite, flat-lit meshes, mostly top-down. This reel must beat it by:
1. **Premium hero asset:** a detailed Pushpak model (double-delta wing, twin rudders, black/white tile mosaic with normal-mapped tile grid, carbon nose cap, landing gear, braking-chute pack) in `MeshPhysicalMaterial` with a **HDRI environment map** (`assets/hdri`), clearcoat, contact shadows, **bloom + depth-of-field + subtle film grade** (the "headroom" items in QUALITY-FLOOR). Plus a real-looking **Chinook (tandem rotors, motion-blurred discs)**, runway with markings/edge lights, Chitradurga terrain (rocky granite hills, dry scrub) with atmospheric haze.
2. **Spatial camera, not just top-down:** 3-D paths with parallax through foreground objects: release **orbit** around the belly hook, **chase/dive** behind the vehicle through haze, a **spline fly-along** of the real approach corridor, **low-level truck** along the runway as it flares, **crane-up + orbit** at touchdown. Camera is always an authored shot (named move, from -> to, ease), locked off between.
3. **Plan-view chart that is the actual lesson:** a 3-D glide-path diagram (altitude ladder, 500 m sideways offset, centreline) drawn step by step, then the real flight flies *through* it.
4. Reuse the proven engine, label system (`PL/PLM`), lints at 0.

## 2. Story line
- **Protagonist:** Pushpak, a 1.75-tonne winged ISRO vehicle with no engine and no pilot.
- **Want:** to land on a runway like a plane, so rockets can one day be reused.
- **Obstacle:** after it is dropped there is no second try: no thrust, glide only, and in LEX-03 it was released ~500 m to the *side* of the runway, with a tailwind.
- **Carried question (first 8 s):** "Bina engine, bina pilot: ek rocket-jaisa vehicle runway par kaise utre?"
- **Reversal:** height is not the hard part, **sideways is**. It must slide sideways (cross-range) while falling, using five sensors (inertial, radar altimeter, air data, pseudolite, NavIC), and finish on the centreline.
- **Honest ending:** this proved the *landing*. The *return from orbit* is still ahead (no date).
- **One-sentence test:** *We wanted a launch vehicle that lands itself, but with no engine and a sideways error there is no second try, therefore ISRO dropped Pushpak from 4.5 km and it steered itself with five sensors, so we can say it can land on a runway centreline, but not yet come back from orbit.*

## 3. Beat sheet (But / Therefore) and open loops
| # | Beat | Connector | Fact (tier) | Spatial picture |
|---|---|---|---|---|
| 1 | Hook | - | Chitradurga, 23 Jun 2024; 4.5 km (B) | night-to-dawn plateau, Chinook cruise, **crane-down + orbit** to the belly hook as Pushpak hangs |
| 2 | Name plant | therefore | Pushpak = Pushpaka Vimana (B) | low orbit of the vehicle, name stencil glows; "naam Ramayana se, kaam asli" |
| 3 | Release | but | no engine, no pilot (B) | hook opens; **chase cam** behind and below as it falls away; altitude ladder 4.5 km |
| 4 | Problem drawn | but | 500 m offset, tailwind (B) | **top-down chart builds**: runway, centreline, 500 m offset ruler, glide cone |
| 5 | Five senses | therefore | IMU, radar altimeter, air data, pseudolite, NavIC (B) | five sensor beams light on the model on their words, each with a data chip |
| 6 | The S-turn | therefore | cross-range correction (B) | **spline fly-along** of the real path through the drawn corridor; error ruler 500 m -> 0 |
| 7 | Touchdown | therefore | centreline; parachute to ~100 km/h; brakes + steering (B) | **low-level truck** along runway, flare, gear contact, chute opens, **orbit-up** |
| 8 | Honest limit | but | HEX-01 2016 re-entry, splashdown, not recovered; orbital return undated (B) | split plate: DONE (LEX x3) / NOT YET (orbit return); the second stays blank |
| 9 | Reframe + CTA | therefore | recap | pull-back over the airstrip to the full plateau; end card |

**Loop ledger:** L1 "kaise utre?" (8 s -> ~85 s) · L2 "naam kyun Pushpak?" (planted 20 s -> paid 30 s) · L3 "sideways kaise?" (45 s -> 75 s) · L4 "kya abhi baaki hai?" (promised 20 s -> 95 s).
Light moment: "Ravana ka vimana kahani mein; yeh wala runway par." Human detail: Chitradurga named; no people needed.

## 4. Voice-over (Roman Hinglish master; Devanagari + number spelling after approval)
| id | Line |
|---|---|
| h1 | Saadhe char kilometre ooper, ek Chinook helicopter ke neeche ek chhota sa vimaan latka hai. Na usme engine hai, na pilot. Sawaal: yeh runway par khud kaise utrega? |
| n1 | Iska naam Pushpak hai, Ramayana ke ud'ne wale vimaan ke naam par. Naam kahani se, par kaam bilkul asli hai. |
| r1 | Hook khulta hai. Ab iske paas sirf gravity hai aur hawa. Doosra mauka nahi milega. |
| p1 | Aur yeh kaam aasaan nahi: isse runway ke seedhe upar nahi, lagbhag paanch sau metre side mein chhoda gaya, upar se tailwind bhi. |
| s1 | Isliye ISRO ne isme paanch tarah ke sensor lagaye: inertial sensor, radar altimeter, hawa ka dabaav naapne wala system, pseudolite, aur NavIC. |
| s2 | Sab milkar batate hain: main kahan hoon, kitna neeche hoon, aur runway ki line se kitna door. |
| c1 | Asli mushkil unchai nahi, side ki doori thi. Pushpak ne girte girte S-shape mod lekar apni galti paanch sau metre se shunya ki. |
| t1 | Phir runway ki beech wali line par seedha utra. Brake parachute ne raftaar lagbhag sau kilometre prati ghanta tak ghatayi, phir pahiyon ke brake aur steering ne rok diya. |
| e1 | Ek zaroori baat: yeh helicopter se chhoda gaya landing test tha. Space se wapsi nahi. Woh 2016 mein sirf ek baar hui thi, aur tab vehicle samundar mein gira aur wapas nahi mila. Orbit se laut'na abhi baaki hai, aur uski koi tareekh tay nahi. |
| f1 | To agli baar jab Pushpak naam sunna, yaad rakhna: kahani udti thi, yeh wala khud utarta hai. Saadhe char kilometre se, bina pilot ke, runway ki beech wali line par. |
| cta | Yeh us dost ko bhejiye jo kehta hai "space tech sirf Amerika ke paas hai". Like, share aur subscribe karein, Sandesh Explains. |
~280 words, ~105 s at 2.7 w/s. Trim candidates: s2, n1.

## 5. Facts ledger
Tier B throughout (Wikipedia citing ISRO/PIB, press); see `research/sources.md`. **Never on screen:** touchdown speed (only "~100 km/h after the chute"), runway length, sink rate, orbital-return date, "320 km/h", dollar/rupee budgets. **Before the full build:** read the ISRO LEX-03 release and keep every B number labelled REPORTED until then.

## 6. Visual identity ("Flight Test Range")
Not Survey Sheet. Bright **high-key dawn range**: warm sand-granite `#c9a77c` plateau, sky gradient from pre-dawn indigo `#1b2a4a` to peach `#ffb07a`, **ISRO-saffron `#ff8a1f` = Pushpak and everything measured**, **range-radio green `#3fe08f` = sensor/guidance**, **warning red `#ff4d4d` = error to correct**, chalk-white type. Fonts: Oswald 700 (headlines, new) + JetBrains Mono (readouts) + Inter; cover in Anton. Components: telemetry strips with tick marks, range-safety corner brackets, glide-path ladders.

## 7. Asset families (>= 6)
Premium PBR hero models (Pushpak, Chinook) + HDRI/bloom/DoF · procedural Chitradurga terrain with haze · 3-D glide-path chart and rulers · sensor beams + data chips (bespoke objects) · Poly Haven runway/props where useful (`assets/models`) · NavIC satellite from `assets/models/nasa` stand-in with "illustrative" label · layered score + SFX · cloned voice. No people.

## 8. New technique
**Premium-render pass:** HDRI image-based lighting on physical materials, tiled normal maps for the thermal tiles, bloom on guidance beams, depth-of-field with focus pulls between shots, and **spline cameras** (CatmullRom position + look-at targets) instead of straight-line moves.

## 9. Authored spatial shot list (`time | move | from -> to | ease | motivation`)
| # | Scene | Shots |
|---|---|---|
| 1 | Hook | **crane-down + arc** from wide plateau to the hook (d 90 -> 12, arc 70 deg), focus pull to the vehicle; lock |
| 2 | Name | **low orbit** 120 deg around the nose/tail stencil; lock on the name |
| 3 | Release | **chase** behind-below on a spline as it falls; lock when the ladder reaches 3 km |
| 4 | Chart | **crane-up** to top-down; lock while the chart builds; **tilt** to 55 deg to show glide cone |
| 5 | Sensors | **orbit** 90 deg around the vehicle; **push-in** on each beam word; lock |
| 6 | S-turn | **spline fly-along** from above-behind through the corridor, banking with the vehicle; end **pedestal** down |
| 7 | Touchdown | **low truck** parallel to the runway, **pan** with the flare, then **orbit-up** 180 deg as the chute opens |
| 8 | Limit | **locked** top-down split plate |
| 9 | Lift-out | **pull-back + crane-up** over the airstrip to the plateau; end card |
Cuts: <= 2 dips; every scene hands over by a continuous move.

## 10. Mockup plan (3 scenes, 3 families)
(a) hook: Chinook + hanging Pushpak close-up with HDRI/bloom/DoF (premium-asset proof), (b) 3-D glide-path chart with the 500 m offset ruler, (c) low-level touchdown frame with chute and haze. Stills first; no full build before approval.

## 11. Schedule
Approve script -> read ISRO release, fix tiers -> Devanagari voice + cloned takes (start first) -> mockup stills in parallel -> build + lints -> render 2 slices -> frame review -> cover + caption.
