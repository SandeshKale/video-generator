# script-v2.md — "Gali ka Game" (ray tracing + DLSS, rebuilt from zero)

Draft for approval, 12 Nov 2026. Replaces the glass-studio version (`script.md`, shipped as `reel.mp4`), which the creator called pathetic: it wasn't ELI5, and its abstract glass plates meant nothing to an ordinary viewer.

## 0. What went wrong last time, and the rule for this one
- **Last time:** the analogies (dot-to-dot, sticker to poster, flip-book) were *spoken*, but on screen they were glass slabs, bars and plates in a black studio. Nobody owns those objects.
- **This time, one test for every scene:** *Would a 10th-pass viewer in a village recognise the object on screen before any word is spoken?*
  - Every idea is shown as something from daily life: a jaali window, a well with the moon in it, a thread, rangoli dots, a cinema hoarding painter, a flip-book in the corner of a notebook.
  - The English term (pixel, ray tracing, DLSS) is named only **after** its everyday picture is on screen. It's named once, on a "ISKO KEHTE HAIN" card.
  - Plain Hindi: no word a school student wouldn't say, and every number is a picture.

## 1. One-sentence story
GTA 6 is coming, and in games like it 15 of every 16 dots on the screen may never be drawn by the computer. **But** drawing even one picture means sending a thread of light from your eye through 83 lakh holes, 60 times a second. **Therefore** the graphics card cheats three ways (rangoli dots, a hoarding painter, a flip-book), which adds up to 1 of 16. **But** a pre-drawn flip-book can't hear your button, and GTA 6 is on consoles, where DLSS (NVIDIA's PC feature) doesn't apply.

## 2. The world: one mohalla at dusk, one continuous camera
Everything happens in one small Indian lane (gali) at blue hour: a chai stall, a jaali window, a well, a wall being painted with a film hoarding, a rangoli at a doorstep, and a school kid's notebook on the stall's bench.

The camera starts on the phone in the kid's hand at the chai stall, flies through the lane object by object, and returns to the phone at the end. There is no black studio. The game on the phone is our own made-up sunny coast city (it looks like a crime-game city, but it isn't GTA's map, logo or characters).

The people are voxel figures (blocky, faceless), per the standing rule.

## 3. Style (Lemo-Opuscar)
- **Choice: `tilt-shift` (Tilt-Shift Miniature).** The script is an "everyday rule / ELI5" story that lives in one real place.
  - Tilt-shift makes a real-looking place read as a tabletop model: saturated sunny paint, a sharp band with blur above and below, and time-lapse stutter for crowds and traffic.
  - That makes a mohalla catchy and toy-like without cartoon people, and the sharp band always points the eye at the one object that matters.
- **Invariants kept:**
  1. A high, oblique vantage with a moving blur band on the subject. Close-ups only at "intimate" moments: inside the jaali, at the well, at the notebook.
  2. Saturated, freshly painted colour with clean blue shadows, and the subject as the one saturated thing in the band.
  3. A time-lapse clock / speed readout whenever speed matters: "x60 tasveer har second", "1 tasveer = 17 ghante".
- **Adapted:**
  - Vertical 1080x1920 at 30 fps.
  - Dusk instead of noon, so the phone screen and the lamps glow.
  - Subtitles are our plain small caption rule, not the style's signage panels.
  - Titles live in the world: painted on the hoarding, chalked on the wall, written in the notebook.
- **Runner-up: `brick-toy`.** It's catchy, but a plastic-brick world is less familiar to a village viewer than a real lane seen as a model.

## 4. Spoken script (Hinglish, very plain, enthusiastic; about 300 words, about 110 s)
| # | Time | Line (Roman; it will be voiced in Devanagari) | What the eye sees (built in this order) |
|---|---|---|---|
| 1 | 0-7 | "GTA 6 aa raha hai! Par ek baat sunke chaunk jaoge. Aise game ki tasveer ke har 16 dabbon mein se 15, computer ne banaye hi nahi. AI ne andaaza lagaya!" | Frame 0: the kid's phone at the chai stall, with the sunny game city on it. The screen splits into a 4x4 grid. 15 tiles flip to pink with an "AI" stamp and one stays amber with an "ASLI" stamp. A slam on "AI". |
| 2 | 7-19 | "Pehle samjho, tasveer hoti kya hai. Jaali wali khidki dekho. Har chhed se bas ek rang dikhta hai. Phone ki screen bhi aisi hi jaali hai. Har chhed ko pixel kehte hain. Aur 4K screen mein aise 83 lakh chhed hain!" | The camera flies from the phone to a carved sandstone jaali in the lane. Behind it is the street, and each hole shows one flat colour. The jaali shrinks onto the phone screen grid. Card: "ISKO KEHTE HAIN: PIXEL". A counter rolls to 83,00,000. |
| 3 | 19-31 | "Har chhed ka rang aata kahaan se hai? Roshni se. Raat ko kuen mein chaand dikhta hai na? Chaand ki roshni paani se takraati hai, mudti hai, aur aapki aankh tak aati hai." | The camera reaches the well. The moon is in the water. A glowing line goes moon → water → bends → the voxel kid's eye. A small "TAKRAAYI, MUDI" tag at the bounce. |
| 4 | 31-44 | "Game yahi kaam ulta karta hai. Aankh se har chhed ki taraf ek dhaaga bhejo. Dhaaga jahaan takraaye, wahaan se poochho: yahaan kitni roshni hai? Isko ray tracing kehte hain." | Back at the jaali, from behind the kid's head. Glowing threads leave his eye, one through each hole, and hit the well, a lamp and a wall. Each hole lights with the colour its thread found. Card: "RAY TRACING". |
| 5 | 44-56 | "Par ek tasveer ke liye 83 lakh dhaage. Aur ek second mein 60 tasveerein. Yaani har second, pachaas crore dhaage! Film Cars ki ek tasveer banane mein, 17 ghante lage the." | Thread spools pile up in the lane until they bury the stall, with a "x60 HAR SECOND" readout. A wall clock spins through 17 hours for one frame, labelled "Cars: 17 ghante / tasveer (reported)". |
| 6 | 56-68 | "Toh graphics card jugaad karta hai. Pehla jugaad: kam dhaage bhejo. Tasveer bindiyon wali banti hai, jaise rangoli ke bindu. Phir AI, ek maahir rangoli wali ki tarah, bindu jodkar poori tasveer bana deta hai. NVIDIA ise Ray Reconstruction kehta hai." | A doorstep rangoli. The dots are a real path-traced image with few rays (a real noisy render). Chalk lines join the dots stroke by stroke and the full picture appears (a real denoise). Card: "RAY RECONSTRUCTION". |
| 7 | 68-80 | "Doosra jugaad: tasveer chhoti banao, chaar mein se sirf ek pixel. Phir AI use bada aur saaf kar deta hai, jaise cinema ka painter, chhoti si photo dekhkar, bada poster bana deta hai. Yeh hai DLSS." | A film hoarding on bamboo scaffolding. A small photo is clipped to it, and a voxel painter on a ladder paints the big poster from it. Close-up: a blocky 1-in-4 version becomes sharp. Card: "DLSS SUPER RESOLUTION". |
| 8 | 80-92 | "Teesra jugaad: copy ke kone par banayi flip-book yaad hai? Card ek asli tasveer banata hai, aur beech ki teen tasveerein, AI khud bana deta hai. Isko Frame Generation kehte hain." | The notebook on the bench. Its corner flips: a cricket ball flies across the pages. Page 1 is amber (ASLI), pages 2-4 are pink (AI, drawn in between). Card: "MULTI FRAME GENERATION". |
| 9 | 92-100 | "Ab jodo. Chaar mein se ek pixel, aur chaar mein se ek tasveer. Ek baata solah! Isliye NVIDIA kehta hai, 16 mein se 15 pixel AI ke." | Back to the phone grid from the hook. Row x column builds: 1/4 x 1/4 = 1/16. 15 tiles go pink and 1 stays amber. A tag: "NVIDIA ka daawa, ek khaas setting par". |
| 10 | 100-112 | "Par ek pench hai. Flip-book ke pehle se bane panne, aapka button nahi sunte. Isliye thoda lag lagta hai. Aur GTA 6 abhi PS5 aur Xbox par aa raha hai. DLSS, NVIDIA ke PC card ka feature hai. Rockstar ne nahi bataya ki GTA 6 mein yeh hoga." | The kid presses a button and the AI pages carry on regardless, with a "LAG" readout. Then two boxes on the stall: a console (GTA 6, 19 Nov) and a PC with an NVIDIA card (DLSS). A dashed line between them, marked "Rockstar: confirm nahi". |
| 11 | 112-118 | "Aisi aur seedhi baatein ke liye, like, share aur subscribe karein, nerdlogic dot co ko!" | The camera pulls up over the lane at night, with every lamp lit. End card: logo, nerdlogic.co, and LIKE · SHARE · SUBSCRIBE appearing on their words. |

Delivery: the same cloned voice, but faster and brighter (exclamations, questions). It pauses after every reveal: "pixel", "ray tracing", "ek baata solah".

## 5. Asset families (target ≥ 8, never fewer than 6)
| # | Family | Where |
|---|---|---|
| 1 | Real GLB models (Quaternius buildings, Kenney streets, Poly Haven tea set / street lamps / TV / crates, procedural smartphone and scooter) | The whole mohalla, the stall, the phone |
| 2 | Procedural 3D built for this reel | Jaali (cut sandstone), well with water, hoarding plus bamboo scaffold, notebook flip-book, rangoli floor, thread spools |
| 3 | Voxel figures (instanced, faceless) | The kid, the painter, people in the lane in time-lapse |
| 4 | A real GPU path tracer (shader, from the ray-tracing reel) | The rangoli dots (few rays) and the AI fill (denoise), on our own game city |
| 5 | Photoreal AI still + depth parallax (RealVisXL), labelled "AI IMAGE" | The sunny coast game city on the phone screen and in the hoarding photo |
| 6 | rough.js hand-drawn strokes (fixed seed) | Chalk lines joining the rangoli dots, flip-book drawings, notebook doodles |
| 7 | Icons and logos (naive-icons, simple-icons NVIDIA, PlayStation/Xbox marks) | The catch scene, used nominatively |
| 8 | Kinetic type and counters | 83,00,000 roll, x60 readout, 17-hour clock, 1/4 x 1/4 = 1/16 |
| 9 | Real-footage overlay (dust-particles.webm) | Dusk air in the lane |
| 10 | Audio: synth score plus CC0 uisfx samples plus the cloned voice | A bright tabla-and-synth groove, a click per stamp, a chalk scratch, page flips |

Neighbouring scenes always change their primary family: jaali (procedural) → well (GLB + light) → threads (procedural lines) → spools (instanced) → rangoli (path tracer + rough.js) → hoarding (AI photo + voxel painter) → notebook (rough.js) → grid (kinetic type).

## 6. Benchmark to beat (the shipped glass version and NavIC v4)
1. Every scene's main object is something the viewer owns or sees daily (the shipped version had none).
2. One continuous world that the camera travels through, with ≤ 1 dip-cut per 20 s (the shipped version was a black studio between objects).
3. **New technique:** a tilt-shift blur band that follows the subject (projected each frame) on a sunlit, saturated miniature, plus time-lapse stutter for the crowd. The path tracer is reused as the rangoli dots.
4. Bright and saturated (the shipped version was dark in scenes 1-2).

## 7. Honesty (unchanged from `research/sources.md`)
- **15/16** = NVIDIA's own claim for one setting (DLSS Super Resolution Performance + 4x Frame Generation, at 4K). Labelled as a claim, never as a measurement.
- **Ray Reconstruction** improves the light but isn't part of the 16 count; the script keeps them apart.
- **GTA 6** is out 19 Nov 2026 on PS5 / Xbox Series X|S with no PC date, and Rockstar hasn't confirmed ray tracing or upscalers. The game city is made up and labelled as such.
- **Cars 17 h** = reported D23 figure. **50 crore** = 83 lakh x 60, our own arithmetic.
- Generated images carry an "AI IMAGE" tag. The rangoli dots and fill are a simulation on our own image, not NVIDIA's network.

## 8. Next, after approval
1. Mockup of 3 scenes from 3 families: the hook phone grid, the jaali + threads, and the rangoli path-tracer. Shown as stills at full size and phone size.
2. Then: voice, the full build, lints, the final-MP4 frame review and the mix.
