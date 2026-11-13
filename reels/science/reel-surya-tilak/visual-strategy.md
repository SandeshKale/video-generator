# Surya Tilak — visual strategy (13 Nov 2026, for approval before script and mockups)

Working title: **"Sooraj ko mandir ke andar kaise laaye?"** · ~95-110 s · Hinglish voice-over only · 1080×1920, 30 fps · nerdlogic.co

## 1. Story spine (storytelling gate, draft)
- **Protagonist:** one sunbeam. **Goal:** reach a 58 mm spot on Ram Lalla's forehead, deep inside a stone temple, at noon on Ram Navami.
- **Obstacle 1:** the sanctum is on the ground floor under three storeys of stone; noon sun is ~65-75° up, it cannot shine in through the door.
- **Therefore:** a periscope. Mirror 1 on the top floor catches the Sun, sends it north; brass pipes, three more mirrors, four lenses bring it down and focus it.
- **But (the reversal):** old sun-temples work because the Sun returns to the same place on the same **solar** date. Ram Navami is a **lunar** date: 17 April, then 6 April, then 27 March. The Sun is ~10° lower or higher each year. A fixed mirror would miss.
- **Therefore:** astronomers computed the Sun's noon height for 19 Ram Navamis; after 19 years the dates repeat (235 moons ≈ 19 years, off by ~2 hours). One mirror, 19 settings, turned by hand once a year, about 5° in all.
- **But:** the Earth keeps turning. The Sun moves its own width in ~2 minutes, so the tilak can only last a few minutes. No motor, no electricity, no artificial light: if it is cloudy, there is no tilak.
- **Ending (honest, warm):** brass, glass, arithmetic and a clear sky. Callback to frame 0's dark sanctum, now lit.
- **One-sentence test:** "A sunbeam has to reach a forehead under three floors of stone on a date that moves every year, so Indian scientists built a hand-set brass periscope with 19 positions."
- **Open loops:** (hook) "no bulb, no wire: how?" → paid at the periscope; (mid) "why did the 2024 setting not work in 2025?" → paid at the 19-year wheel; (late) "why only a few minutes?" → paid at the Sun-width scene.

## 2. Style record (Lemo index)
- **Chosen: `white-model` (Projection on White Model), adapted.** Topic type: real engineered system inside a real building, light is the actor. Invariants kept: (1) the model never changes, only the light on it does; (2) **the Sun is a real directional light computed from Ayodhya's latitude and the real date/time**, with real shadows; (3) transitions are light changes on one take, not cuts. Adapted: we have no licensed CAD of the temple, so the model is **our own generic Nagara cut-away, labelled SCHEMATIC · NOT THE TEMPLE'S DRAWINGS** (the style asks for real geometry; we say so on screen); matte warm-white sandstone instead of pure white; vertical frame; plain 40 px captions.
- **Runner-up:** `teardown` (rejected: used for Pushpak, and the periscope is better understood in place than exploded). Third: `blueprint`.
- **Palette (new, not Pushpak's gold/lapis):** matte ivory stone `#efe7d8`, deep garnet-black room `#170a0c`, **saffron-white sunlight** `#ffd9a0` → hot core `#fff6e0`, brass `#b8893a`, one cool accent **moon silver-blue** `#9fc4ff` used only for the lunar calendar, vermilion `#e23b1f` only for the final tilak spot. Brand lime only on the end card.
- **Fonts:** Rozha One (display, Devanagari-capable, newly vendored) + Martian Mono (instruments) + Inter (captions).

## 3. Visual pillars (what makes it the best-looking reel in the repo)
1. **Real volumetric light.** The beam is a ray-marched shaft through dusty air (analytic in-scatter in a shader), with dust motes that light up only inside it. Every mirror bounce and lens focus is computed from real reflection/refraction (the ray-tracing reel's helpers), so the spot on the wall is where physics puts it.
2. **A real Sun.** One directional light from the NOAA solar position for Ayodhya; scrubbing the date/clock on screen actually moves the beam. The 2024 → 2025 → 2026 misses are real misses computed by the model, then fixed by tilting mirror 1.
3. **One continuous descent.** Camera rides the beam from the shikhar aperture down the brass pipe through three floors to the sanctum: a single authored crane-down with locked holds at each mirror (no cuts until the calendar cut-away).
4. **Bespoke objects per claim:** (a) cut-away temple section with a noon-sun protractor; (b) brass periscope with IR-filter glass (heat shown as a red component stopped at the aperture); (c) lens pair shrinking the beam to a 58 mm spot with a real ruler; (d) Sun-vs-Moon orrery: a calendar ring where the lunar date marker slides over the solar ring (Mar 25 → Apr 21); (e) the 19-notch brass setting wheel; (f) Sun-width scene: a disc sliding off the mirror in 2 minutes with a live clock; (g) cloud passing = beam gone.
5. **Meaning-coded light:** saffron = sunlight, silver-blue = Moon/lunar date, vermilion = the tilak spot only. HUD: date, clock (IST), Sun height in degrees: all live and true.
6. **Respect rule:** the idol is never modelled. The sanctum shows a plain dark stone niche with a soft glow form; the film shows the spot of light, not a face.

## 4. Scene plan (expert-sketcher order; each built on its spoken words)
| # | Question | Picture (built step by step) | Camera (authored) | Truth label |
|---|---|---|---|---|
| 1 Hook | No bulb, no wire: how does light land here? | Dark sanctum, one 58 mm spot arrives; ruler "58 mm" | locked close, slow push on the word "kaise" | REPORTED · CBRI |
| 2 | Why can't the Sun just shine in? | Cut-away temple: 3 floors × 20 ft, noon Sun at 74° drawn with a protractor, ray hits the roof | crane up from sanctum to outside, lock on the section | SCHEMATIC MODEL · OUR CALCULATION |
| 3 | The periscope | Aperture + IR glass (heat stops), mirror 1 tilts, beam goes north, mirror 2, down the brass pipe | ride the beam: crane down 3 floors, lock at each mirror | 4 MIRRORS + 4 LENSES · REPORTED |
| 4 | How a wide beam becomes a tilak | Lenses squeeze the shaft; last mirror turns it east onto the niche; spot sharpens | dolly along the last leg, macro on the spot | SIZES NOT PUBLISHED · SCHEMATIC |
| 5 | The problem | Date flips 17 Apr 2024 → 6 Apr 2025: the real Sun drops 4.4°, the spot slides off the niche | locked wide section; whip to mirror 1 | OUR CALCULATION |
| 6 | Why the date moves | Orrery/calendar ring: Moon marker laps the Sun ring; Ram Navami dots scatter between 25 Mar and 21 Apr | cut-away set, slow orbit | REPORTED · IIA |
| 7 | The fix: 19 settings | 235 moons vs 19 years bars (2 h apart); brass wheel with 19 notches; a hand-turn clicks mirror 1 by a fraction of 5°; spot returns | macro on the wheel, pull back to beam | "19 settings": REPORTED; 5°, 2 h: OUR CALCULATION |
| 8 | Why only minutes | Clock runs 30×: Sun disc slides its own width, spot crosses the niche and leaves; a cloud kills the beam | locked, then tilt up the pipe to the sky | 30× · OUR CALCULATION |
| 9 Close | What it took | Pull back through the whole section, beam on, labels: brass · glass · arithmetic · clear sky; end card LIKE/SHARE/SUBSCRIBE + nerdlogic.co | one long pull-back | — |

## 5. Benchmark to beat (Pushpak, Ram Setu v2, ray-tracing v2)
New here: (1) volumetric light shafts + lit dust as the hero; (2) a physically computed Sun that the story scrubs; (3) a whole-film single descent shot; (4) optical elements that really reflect/refract the beam; (5) score that follows the light (bowed glass/vibraphone for held light, tanpura floor, temple bell only at the landing, silence when the cloud passes).

## 6. Asset families (≥6)
three.js PBR stone + brass (Poly Haven CC0 textures/HDRI), volumetric shader, analytic optics, real solar ephemeris, NASA Sun/Moon imagery for the orrery, canvas instruments (protractor, ruler, clock, calendar ring), kinetic type, synth score + SFX, cloned voice.

## 7. Risks and open checks
- Open PIB PRID 2018141, the PTI 2025 "third floor" report and the 2026 PTI report first-hand before posting.
- Geometry inside the temple is unpublished: every dimension of the periscope is schematic and says so.
- Topic is devotional: no jokes, no "was it real" framing, no likeness of the idol.
- Instagram data: `insights/ig-posts.json` is from the suspended account; heritage × science (Ram Setu) is the only comparable signal.
