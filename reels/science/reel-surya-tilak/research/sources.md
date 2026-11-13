# Surya Tilak — fact ledger (research 13 Nov 2026)

Tiers: **A** = primary document read first-hand · **B** = named scientist/agency as reported by press (attribute on screen as REPORTED) · **C** = repeated but unconfirmed, do not say · **CALC** = our own calculation (label OUR CALCULATION).
Not opened first-hand: the PIB release itself (pib.gov.in returned 403 from this sandbox; read through NewsMonks' copy and Drishti IAS), Deccan Herald, Telegraph and India Today pages (blocked). **Before posting: open PIB PRID 2018141 and the PTI 2025/2026 reports on a normal connection.**

## 1. What it is
| # | Fact | Tier | Source |
|---|---|---|---|
| W1 | A beam of sunlight is steered onto the forehead of the Ram Lalla idol at noon on Ram Navami (Chaitra), Ram Janmabhoomi Mandir, Ayodhya | B | PIB via NewsMonks; Wikipedia "Surya Tilak" |
| W2 | First done 17 Apr 2024; again 6 Apr 2025; 2026 at the temple on 27 Mar (most of India marked Ram Navami on 26 Mar) | B | Wikipedia; PTI via Deccan Herald (search summary); India TV 27 Mar 2026 |
| W3 | Detailed design by CSIR-CBRI Roorkee; optical design consultancy + sun-position calculations + on-site alignment by Indian Institute of Astrophysics (IIA), Bengaluru; parts made by Optica (Optics & Allied Engg Pvt Ltd), Bengaluru | B | PIB via NewsMonks/Drishti; ETV Bharat 16 Apr 2024; Business Today 17 Apr 2024 |
| W4 | Scaled model validated at Roorkee; full-scale model validated at Optica, Bengaluru, Mar 2024 | B | Business Today |

## 2. The machine
| # | Fact | Tier | Source |
|---|---|---|---|
| M1 | 2024 (temple unfinished): **4 mirrors + 2 lenses**, light taken from the second floor (temporary) | B | PIB via NewsMonks/Drishti; PTI (CBRI's S K Panigrahi) via Deccan Herald summary |
| M2 | Final design: **4 mirrors + 4 lenses**; 2025 run used the completed **third floor** with two extra lenses | B | same |
| M3 | Light enters through an aperture at the top floor; the **first mirror's tilt** sends the rays **north** to the second mirror; the last lens and mirror put the spot on the idol, which **faces east** | B | ETV Bharat, Business Today (CBRI) |
| M4 | Pipes, elbows, enclosures are **brass**, inside surfaces black powder-coated to stop stray light | B | ETV Bharat, Business Today, India TV |
| M5 | An **infrared filter glass** at the top aperture limits heat reaching the idol | B | same |
| M6 | No electricity, battery, iron or steel in the system; manually operated | B | Science India magazine (K. Das, Mar-Apr 2024) |
| M7 | Planned tilak size **58 mm** | B | CBRI scientist via ETV Bharat/Business Today/India TV |
| M8 | Duration: "about 3 to 3.5 minutes, with 2 minutes of full illumination" (CBRI, 2024); ~4 min observed 2025 (HT via Wikipedia); 2026: PTI ~9 min vs India TV 3-3.5 min (conflict) | B | as named. **On screen: "a few minutes"; quote only the CBRI 2024 design figure.** |
| M9 | Does not work under cloud or rain; no artificial light is used as a substitute ("because of the faith and belief of our people" — D P Kanungo, CBRI) | B | Business Today |
| M10 | Mirrors and lenses sit in holders that can be reached and cleaned | B | PIB via NewsMonks; Science India |
| M11 | "19-gear gearbox" | **C** | Drishti IAS / blogs only. PIB wording is a **manual annual shift of the first mirror**. Do not say gearbox; say "19 settings". |

## 3. The calendar problem (the reversal of the story)
| # | Fact | Tier | Source |
|---|---|---|---|
| C1 | Ram Navami follows the lunar calendar, so its Gregorian date moves each year; the Sun's position at noon on that day therefore changes each year | B | PIB via NewsMonks; CBRI (Panigrahi): "the date of Shri Ram Navami repeats every 19 years" |
| C2 | IIA worked out the Ram Navami dates for one 19-year cycle and the Sun's sky position (noon elevation) for each of the 19 | B | PIB; Science India |
| C3 | Dates fall between about 25 Mar and 21 Apr | B | Science India (Hindu Calendar app) |
| C4 | The first mirror is shifted by hand once a year before Ram Navami | B | PIB via NewsMonks; Science India |
| C5 | The system tolerates a 1-2 day shift of the date; the spot's duration changes | B | PIB |
| C6 | 19 solar years ≈ 235 lunar months: 235 × 29.530589 d = 6939.69 d; 19 × 365.2422 d = 6939.60 d; **difference ≈ 0.087 day ≈ 2 hours** (Metonic cycle) | CALC | `research/calc.md` |

## 4. Our calculations (label OUR CALCULATION)
Ayodhya 26.80° N, 82.19° E. Noon elevation = 90° − latitude + solar declination.
| Date | Declination | Sun's height at local noon | Local solar noon (IST) |
|---|---|---|---|
| 17 Apr 2024 | +10.6° | **73.8°** | 12:00.7 |
| 6 Apr 2025 | +6.2° | **69.4°** | 12:04 |
| 27 Mar 2026 | +2.4° | **65.6°** | 12:07 |
| earliest (25 Mar) | +1.6° | 64.8° | 12:08 |
| latest (21 Apr) | +11.7° | 74.9° | 12:00 |
- Spread over the cycle ≈ **10°** of Sun height; a mirror turns the beam by twice its own tilt, so the first mirror needs only ≈ **5°** of travel.
- The Sun crosses the sky at 15°/hour = 0.25°/min and is 0.53° wide: it moves **its own width in about 2 minutes**, which matches CBRI's "2 minutes of full illumination" (why the tilak cannot last long without a tracking motor).
- Beam path length, mirror sizes, focal lengths: **not published**. Anything drawn is SCHEMATIC.

## 5. Temple facts
| # | Fact | Tier | Source |
|---|---|---|---|
| T1 | 161 ft tall, 380 × 250 ft, three storeys, each 20 ft; Nagara style; 392 pillars | B | Shri Ram Janmbhoomi Teerth Kshetra as reported (DT Next, Drishti) |
| T2 | Idol: 51 inches, dark stone from Karnataka, sculptor Arun Yogiraj, child form (Balak Ram), in the ground-floor sanctum | B | same |

## 6. Older sun alignments (contrast only, one line in the film)
| # | Fact | Tier | Source |
|---|---|---|---|
| O1 | Gavi Gangadhareshwara, Bengaluru: setting sunlight passes an arch, windows and Nandi's horns onto the idol around 14 Jan; studied by B S Shylaja | B | Bhavana magazine (search summary) — open before use |
| O2 | These work by the building's own fixed orientation on a **solar** date. Ram Navami is a **lunar** date, so a fixed opening cannot work: hence an adjustable mirror | CALC/argument | follows from C1 |

## 7. Not to say
- No "ancient technology" claim: the system is a 2024 design by named Indian institutes.
- No gearbox, no pipe lengths, no focal lengths, no mirror sizes (unpublished).
- No 2026 duration figure (sources conflict).
- No "exactly 12:00" (local solar noon is 12:00-12:08 IST; reports say "noon"/Abhijit Muhurat).
- The idol is never modelled or drawn: a soft light form/plain niche and the spot only. Temple model is a generic Nagara section labelled SCHEMATIC · NOT THE TEMPLE'S DRAWINGS. No jokes; respectful tone.
