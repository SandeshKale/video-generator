# "Light ulti chalti hai" — how ray tracing works (Hinglish explainer, draft v1, 4 Nov 2026)
Status: **research + script + shot list for approval (nothing built).** Replaces the parked Pushpak draft (`reels/science/reel-pushpak-lands-itself/`, kept as-is). Method: `docs/STORYTELLING-GUIDE.md`, `docs/QUALITY-FLOOR.md`, authored cinematic camera, "expert sketcher" scene rule. Creator asks carried over: **premium 3D assets, spatial camera.**

## 0. Why this reel
- Insights data is stale (12 Oct); the pick rests on the creator's request + the storytelling filter. Personal anchor = **the puddle in a game on your phone/PC**. Evergreen, no news dependency.
- Honesty frame, said on screen: the "backwards light" is a computing trick, not what nature does; "10 Giga Rays/s" is NVIDIA's claimed peak; games are hybrids.

## 1. Benchmark to beat (previous = `reel-ram-setu-from-above`)
Ram Setu: schematic land, simple models, mostly top-down, flat shading. This reel must beat it by:
1. **A real ray tracer on screen.** A tiny path tracer runs in the shader; its sample index is a pure function of `t`. The viewer watches 1 ray per pixel (grain) -> 8 -> 64 converge into a clean image, then a denoise pass cleans the 1-ray image. The explanation *is* the render.
2. **Premium assets:** chrome sphere, glass sphere, brushed-metal and glossy-floor materials, studio HDRI (`assets/hdri`), soft area light, bloom + depth of field, physical-material gradients; a Cornell-box-style room as the "set"; a hero puddle street scene (Quaternius/Poly Haven props from `assets/models`) lit by the same HDRI.
3. **Spatial camera:** moves through the scene along the rays themselves: a dolly *with* a ray from the eye through a pixel to the sphere and its bounce, an orbit around the shadow geometry, a crane through the BVH boxes narrowing to one triangle. Authored shots, locked between.
4. Beat-by-beat construction (frame, then objects, then rays, then answer) with a "THIS IS CALLED" card per term (ray, bounce, shadow ray, BVH, denoiser). Lints at 0.

## 2. Story line
- **Protagonist:** one pixel on your screen.
- **Want:** to know its own colour, including what is *behind* you in the puddle.
- **Obstacle:** light from a lamp sends billions of rays and almost none reach the eye; simulating all of them is hopeless. Faking reflections (screen tricks) fails the moment the object is off-screen.
- **Carried question (first 8 s):** "Puddle mein woh building kaise dikh rahi hai jo screen par hai hi nahi?"
- **Reversal:** don't follow light from the lamp; **send the ray from the eye, backwards.** Only rays that matter are ever computed.
- **Complication / payoff chain:** each ray asks "what did I hit?" (BVH makes that fast) -> reflect, shadow-ray, bounce -> too few rays = grain -> denoise.
- **Honest ending:** even RTX gives a few rays per pixel + a denoiser; games still mix in rasterisation. 10 Giga Rays/s is a vendor peak.
- **One-sentence test:** *We wanted a pixel to know what is reflected in a puddle, but nature's light has too many rays and screen tricks can't see off-screen, therefore we send one ray backwards from the eye and ask what it hit, so we get real reflections and shadows, but only with a few rays and a denoiser.*

## 3. Beat sheet (But / Therefore) and open loops
| # | Beat | Connector | Fact (tier) | Sketch built in order |
|---|---|---|---|---|
| 1 | Hook | - | off-screen reflection (B, to confirm) | street puddle at dusk: building reflected; camera tilts down; the reflection sharpens; headline question |
| 2 | Nature's way | therefore | lamp emits endless rays, few reach eye | lamp, room, thousands of thin rays spray; counter of "reached eye" stays near zero; cull the wasted ones red |
| 3 | But: hopeless | but | cost | one pixel highlighted; only 3 of thousands of rays reach it |
| 4 | The flip | therefore | backwards from eye | camera + screen grid built; ONE ray leaves the eye through ONE pixel; THIS IS CALLED: PRIMARY RAY |
| 5 | What did I hit? | therefore | intersection | ray hits the chrome sphere; surface normal arrow; pixel takes the colour |
| 6 | Reflection | therefore | bounce | mirror ray bounces off sphere toward the building and returns its colour -> the puddle answer |
| 7 | Shadow | therefore | shadow ray | a ray from the hit point to the lamp; blocker in between -> dark; no blocker -> lit |
| 8 | But: too slow | but | millions of triangles | boxes-in-boxes (BVH) built step by step; ~27 levels for 100 M triangles (derived) |
| 9 | History | therefore | Appel 1968, Whitted 1979-80, Cars 2006 = 17 h/frame (B+) | timeline built along a runway-like ruler; the frame time shrinks |
| 10 | Hardware | therefore | RTX 2018, claimed 10 Giga Rays/s | counter; derived "~80 rays/pixel/frame at the claimed peak" |
| 11 | But: noise | but | few rays -> grain | 1 ray per pixel image, then 8, 64; denoise pass cleans the 1-ray image |
| 12 | Honest limit + CTA | but | hybrid rendering; vendor peak | split chart REAL RAYS / GUESSED; end card |

**Loop ledger:** L1 "puddle mein building kaise?" (8 s -> 55 s) · L2 "kitni kirnein?" (25 s -> 80 s) · L3 "itne triangles mein kaise dhoondhe?" (50 s -> 70 s) · L4 "game mein sach mein itni kirnein?" (promised 75 s -> 95 s).
Light moment: "light ne kabhi nahi socha tha ki usse ulta chalaya jayega." Human detail: none needed; the anchor is your own puddle.

## 4. Voice-over (Roman Hinglish master; Devanagari B text and number spelling after approval)
| id | Line |
|---|---|
| h1 | Is game ke puddle mein ek building dikh rahi hai jo screen par hai hi nahi. Yeh kaise mumkin hai? Jawab ek ulti soch mein hai: roshni ko ulta chalana. |
| p1 | Asli duniya mein ek bulb se roshni ki arbon kirnein nikalti hain. Zyadatar deewaron mein kho jaati hain. Bahut kam hi aankh tak pahunchti hain. |
| p2 | Computer ke liye yeh bada nuksaan hai: arbon kirnein banao, aur kaam ki sirf chand. |
| r1 | Ray tracing ulta karta hai. Aankh se, har pixel se, ek kiran bahar ki taraf bhejo. Ise primary ray kehte hain. |
| r2 | Kiran kisi cheez se takrati hai aur ek hi sawaal puchti hai: tum kya ho, aur tumhara rang kya hai? |
| b1 | Agar cheez sheeshe jaisi hai to kiran uchhal kar doosri kiran banti hai. Wahi kiran peeche khadi building tak jaati hai, isliye puddle mein woh dikhti hai, chahe screen par na ho. |
| s1 | Phir ek kiran roshni ki taraf jaati hai. Raaste mein kuch aaya to chhaya, nahi aaya to roshni. Shadow bhi ek sawaal hai. |
| v1 | Par scene mein karodon triangles hote hain. Har kiran sab check kare to ek frame bhi na bane. |
| v2 | Isliye computer dibbe ke andar dibbe banata hai, jise BVH kehte hain. Das crore triangles mein bhi lagbhag sattais baar dibbe check karke jawab mil jata hai, yeh ideal hisaab hai. |
| y1 | Idea naya nahi hai. 1968 mein Arthur Appel ne pehla version likha. 1979-80 mein Turner Whitted ne uchhalti aur sheeshe se guzarti kirnein judin. 2006 mein Pixar ki film Cars ka ek frame banane mein ausatan satrah ghante lage. |
| y2 | Phir 2018 mein NVIDIA ne RTX card dikhaya, jisme isi kaam ke liye alag hardware hai. Company ka daawa: das arab kirnein prati second tak. |
| m1 | Math karo. Full HD screen, saath frame prati second, yaani lagbhag saadhe bara crore pixel har second. Daawa sahi maano to kaagaz par lagbhag assi kirnein har pixel ke liye. |
| n1 | Par asli game mein bahut kam kirnein milti hain, isliye tasveer daane-daane wali banti hai. Phir ek denoiser us shor ko saaf karta hai. |
| e1 | To jo aap dekhte ho, woh kuch asli kirnein hain aur baaki andaza. Aur zyadatar game ab bhi purane tareeke ke saath mila kar bante hain. |
| f1 | Agli baar puddle mein peeche ki building dikhe, to yaad rakhna: kisi ne aankh se ek kiran ulti bheji aur pixel ne poocha, mere peeche kya hai? |
| cta | Yeh us dost ko bhejiye jo kehta hai graphics sirf GPU ka khel hai. Like, share aur subscribe karein, Sandesh Explains. |
~340 words, ~125 s at 2.7 w/s. Trim candidates: p2, y2, v1.

## 5. Facts ledger
See `research/sources.md`. Tier B/vendor-claim items stay labelled REPORTED / "NVIDIA CLAIMS" on screen. Derived numbers (124.4 M px/s, ~80 rays/pixel, ~27 levels) are shown with their formula and "ideal/peak".

## 6. Visual identity ("Optical Bench")
Not Showtime, NavIC teal/amber, Survey Sheet, or Flight Range. **Matte-black optical table** with a faint measured grid, warm **tungsten `#ffc46b` = light source**, **white-hot `#fffaf0` = primary ray (from the eye)**, **ice blue `#7fd6ff` = reflection ray**, **violet `#b07cff` = shadow ray**, **coral `#ff6b5e` = wasted / noisy**, **sage `#9be3b0` = denoised/answer**. Fonts: Gloock (display serif, new) + Sometype Mono + Inter; cover in Anton. Components: ray-label tags with a coloured tick, lens-barrel frame corners, aperture-ring step tracker.

## 7. Asset families (>= 6)
In-shader path tracer (real) · premium PBR 3D set (chrome/glass/brushed metal, HDRI, bloom, DoF) · Quaternius/Poly Haven street + building props in a puddle scene · bespoke 3-D data objects (ray fans, BVH boxes, counters, timeline ruler, split chart) · typographic cards + captions · layered score and SFX · cloned voice. No people.

## 8. New technique
**Progressive path tracing as a pure function of `t`:** sample index `n(t)` drives hash-seeded jitter, so the same `t` always draws the same noise; accumulate analytically (render n samples in one pass at low n, a baked 64-sample reference for the clean state, cross-faded by shot). Plus a joint bilateral denoise pass to show the "after".

## 9. Authored spatial shot list (`time | move | from -> to | ease | motivation`)
| # | Scene | Shots |
|---|---|---|
| 1 | Puddle | **low crane-down + tilt** from the skyline to the puddle surface; lock; focus pull to the reflection |
| 2 | Nature's rays | **pull-back + orbit** 60 deg around the lamp as rays spray; lock on the eye gets 3 hits |
| 3 | Hopeless | **push-in** to the single pixel on the screen plane; lock |
| 4 | The flip | **dolly with the ray** from eye through the pixel toward the sphere; lock at contact |
| 5 | Hit | **orbit** 90 deg around the contact point; normal arrow; lock |
| 6 | Reflection | **follow** the bounce ray to the building, **whip-tilt** back to the pixel |
| 7 | Shadow | **truck** parallel to the shadow ray; lock on the blocker |
| 8 | BVH | **crane through** nested boxes narrowing to one triangle; pedestal-down |
| 9 | History | **locked** frontal timeline; slow **truck** along it |
| 10 | Hardware | **push-in** on the counter; lock |
| 11 | Noise | **locked** on the 1 -> 8 -> 64 sample strip; cut-in to the denoise wipe |
| 12 | Limit + CTA | **pull-back** to the full bench; end card |
Cuts: <= 2 dips; scenes hand over by a continuous move.

## 10. Mockup plan (3 scenes, 3 families)
(a) puddle hook with premium PBR/HDRI/DoF, (b) the flip: eye ray through a pixel to a chrome sphere with normal + bounce, (c) the 1 / 8 / 64 sample strip with denoise (real in-shader path tracer). Stills for approval; no full build before.

## 11. Schedule
Approve script -> read Whitted, NVIDIA whitepaper, Christensen; fix tiers -> Devanagari voice + cloned takes (start first) -> mockup stills in parallel -> build + lints -> render 2 slices -> frame review -> cover + caption.

---
# v2 rebuild (12 Nov 2026): Hologram HUD look, nerdlogic.co CTA
Why: creator asked to repeat the Opuscar style process for this reel, plus the new spoken CTA and rebrand. Only the closing voice take is replaced (the final "yeh us dost ko..." sentence becomes its own take `g13`; the `g12` closing line "agli baar puddle mein..." is trimmed from the shipped take, not regenerated).

## Style (Lemo-Opuscar record)
- **Slug:** `hologram-hud`. **Runner-up:** `glass-product` (light and glass in a dark-field studio, but a product-launch grammar and a premium-PBR look we already used in v1); `blueprint` rejected (2D only, "3D rendering never").
- **Why it fits (topic type: how a device/technique works; shape: reversal + mechanism chain):** the script is rays and boxes. The style's moves map one to one: **scan growth** = the puddle street scanned into light (hook), **target lock + rolling value** = the primary ray locking onto its pixel/hit point (PRIMARY RAY), **teardown one layer deeper** = the BVH built level by level, **rolling digits as the payoff** = 27 boxes per ray, ~80 rays per pixel, the 10 giga-rays claim, **chip accumulation** = the history dates, **solid hologram once** = the denoised final image.
- **Invariants kept:** (1) the subject is always a line wireframe made of light on a projector pad above a fading dot grid, never a rendered object; (2) one cold hue + one accent that is spent only on locked values (a number or ray turns accent colour at the frame it becomes true); (3) text lives on dark plates, rolling values lock right to left at 24 fps with glyph scramble, targets snap in oversized at 45 degrees and flash on the downbeat.
- **Adapted (our rules win):** palette violet `#7c6cff` + lime `#b4f000` (lime = the nerdlogic.co brand, spent only on what is locked); Rajdhani + Share Tech Mono (+ Inter for captions); vertical 1080x1920 at 30 fps; authored camera only; no people; the previous reel's "Optical Bench" PBR look and its planar-puddle/path-tracer shader scenes are replaced, except the real shader path tracer panels (1 / 8 / 64 rays), which stay as the one honest "real render" family inside the hologram frame.

## Benchmark to beat (previous = v1 "Optical Bench")
v1 was a premium PBR bench with eleven dip-cut scenes. v2: (1) one continuous projector-pad world instead of dip cuts between 8 of 11 scenes (the pad, the dot grid and the HUD frame never leave); (2) every claim is a number that *rolls* and turns lime when locked; (3) the BVH is built live from real triangle data (levels appear one by one, one hot path in lime); (4) CTA + brand per the new rule.

## Mockup (12 Nov 2026, three scenes for approval): `mockup-light-scan.png`
A puddle street scanned into light with the off-screen tower and its reflection; one primary ray locking onto its pixel with a bounce to the building; the BVH on a torus knot. Not yet built: the other eight scenes, the 1/8/64 real path-tracer panels inside the HUD frame, the history chips, the end card.
