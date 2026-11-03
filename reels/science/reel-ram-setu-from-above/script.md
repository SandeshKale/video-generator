# "99.98% paani ke neeche" — Ram Setu from above: what satellites can and cannot tell (Hinglish explainer, draft v1, 3 Nov 2026)

Status: **research + script + shot list for approval (nothing built).** Method: `docs/STORYTELLING-GUIDE.md`, `docs/QUALITY-FLOOR.md`, the cinematic-camera rule (authored shots only, locked off between), bird's-eye brief (creator, 3 Nov 2026: "more bird's eye view camera angles and shots"). Sources and tiers: `research/sources.md` (the paper itself was unreachable from this sandbox, so its numbers are tier B until read).

## 0. Why this reel (evidence block)
- `insights/report.md` is 22 days old and covers 21 reels at 6 followers: too thin to decide. The pick rests on the creator's request (a Ramayana-film tie-in, bird's-eye camera) and the storytelling filter below. `reel-tags.json` is updated when it ships.
- Honesty frame, said in the voice and on screen: **a satellite study measures shape, depth and volume; it says nothing about who made it or about any epic.** The reel neither supports nor disputes belief; it shows what the laser measured.

## 1. Benchmark to beat (previous = `reel-district-ticket-rush`)
District: authored shots, voxel crowds, 3D labels, terminal pane, lints at 0. This reel must beat it by: (1) **almost every shot is top-down or high-oblique** (the camera descends from orbit and stays above); (2) a **photon point cloud that accumulates into a surface** (laser returns land as points along six beam tracks, then the heightfield rises out of them); (3) a **contour-line shader on a real-looking bathymetry mesh** with a live depth readout under the camera; (4) **two rulers (29 km vs ~48 km) laid on the same map** so the discrepancy is seen, not told; (5) the label placement system (`PL`) reused so both lints stay at 0.

## 2. Story line (guide 2.1)
- **Protagonist:** the strip of shoals between Rameswaram and Mannar, the real place behind the film's best-known set piece.
- **Want:** to be understood from the one view everyone has seen: from above.
- **Obstacle:** from above you mostly see water: 99.98 % of it is submerged, and published lengths disagree (29 vs ~48 km).
- **Carried question (first 8 s):** "Ek satellite asal mein kya bata sakta hai, aur kya nahi?"
- **Reversal:** the thing looks like a faint pale line, but a laser from 500-ish km up draws it as a 10 m-resolution relief map, and the *shape* tells a sea-and-sediment story (asymmetric slopes), not just "a line".
- **Honest ending:** the study gives shape, depth, volume; **not** origin or any story. Say so.
- **One-sentence test:** *We wanted to know what satellites can tell about Ram Setu, but from above it is almost all underwater and the lengths disagree, therefore a laser satellite mapped the seabed, so we can say it is a 29 km chain of shoals joining Dhanushkodi and Talaimannar shaped by currents, but not who or why.*

## 3. Beat sheet (But / Therefore) and open loops
| # | Beat | Connector | Fact (tier) | Bird's-eye picture (build order) |
|---|---|---|---|---|
| 1 | Hook | - | film Diwali 2026 (B); 99.98 % submerged (B) | orbit view of India + Sri Lanka, camera plunges toward the Palk Strait; the headline "99.98 %" |
| 2 | Plant | therefore | ESA Sentinel-2 shows a pale line (B) | straight-down satellite-style plate of the strait, pale curved line, two island labels |
| 3 | But: mostly underwater | but | 0.02 % above mean sea level (B) | a waterline plane drops over the relief: only specks stay dry; counter 0.02 % |
| 4 | Therefore: a laser | therefore | ICESat-2 green laser, ~40 m, 0.2 M photons, Oct 2018 - Oct 2023, 10 m grid (B) | satellite crosses the strait overhead, six beams (verify), photon points fall and pile into a point cloud |
| 5 | But: two lengths | but | ~48 km (ESA coverage) vs ~29 km (paper) (B) | two rulers on the same map; end points shown; "likely different end points" (our reading) |
| 6 | Therefore: the shape talks | therefore | crest undulating, sudden depths, +-1.5 km zone; asymmetric slopes; more material from Gulf of Mannar (B) | heightfield rises with contours; sediment arrows from both seas, thicker from the Mannar side |
| 7 | Honest limit | but | study does not address origin (B, our reading of silence) | split card: MEASURED / NOT MEASURED; "origin" stays blank |
| 8 | Reframe + CTA | therefore | recap numbers | camera lifts out to the full map; the strip glows; end card |

**Loop ledger:** L1 "what can a satellite tell?" (8 s -> ~100 s) · L2 "how do you see underwater?" (35 s -> 60 s) · L3 "29 or 48?" (70 s -> 85 s) · L4 "what is NOT measured?" (promised at 10 s -> 100 s). Always >= 2 live after 10 s.
Light moment: "yeh satellite ka naksha hai, kisi film ka VFX nahi". Human detail: Rameswaram, Dhanushkodi, Mannar, Talaimannar named on the map.

## 4. Voice-over (Roman Hinglish master; Devanagari B text and number spelling are produced after approval)
| id | Line |
|---|---|
| h1 | Ramayana film Diwali pe aa rahi hai (reported), aur uska sabse mashhoor set piece samundar ke upar ek pul hai. Par asli samundar mein ek asli ret-patti hai, aur uska 99.98 percent hissa paani ke neeche hai. |
| h2 | Satellite ne use naapa hai. To sawaal yeh hai: ek satellite asal mein kya bata sakta hai, aur kya nahi? |
| p1 | Upar se dekho to Rameswaram aur Mannar ke beech ek halki si patti dikhti hai. Europe ke Sentinel-2 satellite ki tasveer mein bhi yahi patti dikhti hai. |
| b1 | Par yeh patti zyadatar paani ke neeche hai. Study ke mutabik samundar ki satah ke upar sirf 0.02 percent hai. |
| b2 | To paani ke neeche ka naksha banta kaise hai? Laser se. |
| m1 | NASA ka ICESat-2 satellite hare laser ki kirnein neeche phenkta hai. Roshni samundar ki tali tak jaati hai aur lautti hai, lagbhag chalis meter gehrai tak. |
| m2 | ISRO ke vaigyanikon ne 2018 se 2023 tak ka data liya: lagbhag do lakh photon, aur dus meter ki resolution ka naksha. |
| l1 | Ab ek ajeeb baat. Kahin 48 kilometre likha milta hai, kahin 29. Study ne Dhanushkodi se Talaimannar tak ki shoals ki zanjeer naapi: lagbhag 29 kilometre. |
| l2 | Shayad number isliye alag hain ki naapne ke chhor alag hain. Yeh meri samajh hai, kisi source ne yeh nahi kaha. |
| r1 | Naksha aur kuch dikhata hai. Zanjeer ke dono taraf lagbhag dedh kilometre tak tal bahut ubad-khabad hai, aur gehrai achanak badalti hai. |
| r2 | Dhaal bhi dono taraf ek jaisi nahi. Study kehti hai ki Mannar ki khaadi se zyada mitti aati hai, Palk Strait se kam. Yaani samundar ne ise aakaar diya hai. |
| j1 | Naksha yeh bhi dikhata hai ki yeh Dhanushkodi aur Talaimannar ka samundar ke neeche ka silsila hai. |
| e1 | Ek zaroori baat: yeh study aakaar, gehrai aur matra naapti hai, lagbhag ek ghan kilometre. Yeh nahi batati ki ise kisne banaya, aur kisi kahani ki baat bhi nahi karti. |
| f1 | To film dekhte waqt yaad rakhna: pul kahani ka hai, par ret-patti asli hai. Lagbhag 29 kilometre, 99.98 percent paani ke neeche, laser se naapi hui. |
| cta | Yeh us dost ko bhejiye jo har baat par bahas karta hai. Like, share aur subscribe karein, Sandesh Explains. |
~330 words, ~120-130 s with pauses at 2.7 w/s. Trim candidates: m2, j1.

## 5. Facts ledger
Tier B (abstract as reported): 29 km, 0.02 % above MSL, Oct 2018 - Oct 2023, 0.2 M photons, 10 m grid, ~40 m laser depth, +-1.5 km undulating zone, ~1 km3, asymmetric slopes with the Mannar-side material transport. Tier B: ~48 km ESA coverage, film dates. Derived: 99.98 % = 100 - 0.02. **Never on screen:** "11 channels", budget figures, any origin or construction claim, depth ranges until the paper is read, "99.8 %".
**Must do before the full build:** read the paper (open access) and ESA's page; replace every tier-B number with a first-hand one or keep it labelled REPORTED.

## 6. Visual identity (new)
Not Showtime (magenta/cyan on stage-black), not NavIC teal/amber. **"Survey Sheet"**: deep ocean ink `#06141f`, bathymetric blues (shallow turquoise `#3fd0c9` to deep `#0b3a5a`), **sand `#e8d9a8` = land/dry**, **signal orange `#ff7a1a` = the laser and everything measured**, **chalk `#eef2ee`** for contours and type. Fonts: Archivo Black (headlines) + Martian Mono (readouts) + Inter (body); cover in Anton. Component language: survey-chart frames with tick-mark rulers, crosshair corner marks, contour lines, depth readout chips (rectangular with cut corner ticks, not District's ticket stubs).

## 7. Asset families (>= 6; per scene in the table below)
NASA/ESA imagery plate (`assets/space` Blue Marble, credit lines on screen) · three.js procedural heightfield + contour shader · instanced photon point cloud (deterministic) · NASA satellite model for ICESat-2 stand-in (`assets/models/nasa`, label "illustrative model") · bespoke data objects (waterline counter, two rulers, sediment arrows, readout chips) · SVG/Canvas survey frame and depth readout · layered score + SFX · cloned voice. No cartoon people, no human figures needed.

## 8. New technique
**Photon-to-surface:** ~6,000 orange points fall from the beam lines (pure function of t, hash-born), settle at their seabed heights, then a heightfield mesh and contour lines fade in beneath them and the points dissolve into it: the viewer watches a laser return become a map.

## 9. Storyboard and authored bird's-eye shot list (`time | move | from -> to | motivation`)
| # | Scene | Question | Shots |
|---|---|---|---|
| 1 | Orbit drop | what is this about? | straight-down orbit view of India/Sri Lanka; **crane-down** to the Palk Strait (d 60 -> 14), locked on arrival |
| 2 | The pale line | what do we see? | **locked straight-down** over the strait plate; slow **truck** west-to-east along the line only if it earns it (else locked) |
| 3 | Waterline | how much is dry? | **tilt** from straight-down to ~60 deg while the waterline plane lowers; **locked** on the 0.02 % counter |
| 4 | The laser pass | how do we see underwater? | **follow** the satellite along its track (high oblique, 70 deg), then **crane-up** to straight-down to see six beam tracks |
| 5 | Two rulers | 29 or 48? | **locked straight-down**, rulers draw on, then a **pull-back** to show both end points |
| 6 | The relief | what does the shape say? | **orbit** 90 deg around the rising heightfield at ~55 deg; **locked** top-down for the sediment arrows |
| 7 | Not measured | what is not answered? | **locked straight-down** on a split chart with a blank "origin" cell |
| 8 | Lift-out | so what now? | **crane-up** back to orbit, strip glows; end card |
Cuts: <= 2 dips; every scene hands over by a continuous crane/tilt.

## 10. Mockup plan (3 scenes, 3 families)
(a) orbit-to-strait descent with Blue Marble plate + readout chips, (b) the photon-to-surface moment (point cloud + beams + contours), (c) the two-ruler map with sediment arrows. Stills sent for approval before any build.

## 11. Schedule
Approve script -> read the paper + ESA page and fix tiers -> Devanagari voice script + cloned-voice takes (CPU, ~1.5-3 h, start first) -> mockup stills in parallel -> build + lints -> render 2 slices -> frame review -> cover + caption.
