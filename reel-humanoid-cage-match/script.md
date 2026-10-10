# Script — "The robot didn't fight. A gamer did." (target 62–68 s, English VO = user's cloned voice, ~150 words)

Facts per `topic.md` (tiers A/B). Every figure is labelled "ILLUSTRATION · NOT FOOTAGE". Attribution rule: anything REK or its partner claims is spoken as "the company says" / "its partner says".

| # | ~t | Spoken line | Visual centerpiece (riso poster system) | Eyebrow (content-specific) | Number |
|---|---|---|---|---|---|
| 1 | 0–3.2 | "This robot cage fight went viral. But no AI was fighting." | VS splash: fighter (blue) vs robot (red) in a ring, ink-stamp slam "NO AI WAS FIGHTING"; frame 0 already composed | // 1 HUMAN, 3 ROBOTS | — |
| 2 | 3.2–8 | "A content creator stepped into a cage in San Francisco, and fought three humanoids." | Three robot silhouettes slide into the ring one by one with a counter ticking 1-2-3; ticket stub "SF · SEPT 18" | // THREE ROBOTS, ONE CAGE | 3 |
| 3 | 8–14 | "A small Unitree G1 first. Then two modified T800s, with kicks up to eight hundred fifty pounds, the company says." | Weight-scale gauge needle swings to **850 LB** with a "COMPANY CLAIM" stamp; G1 small, T800s tall (size ladder) | // A KICK, ON PAPER | 850 lb |
| 4 | 14–18 | "Robots versus humans, right? Here's the twist." | Poster rips open (paper tear) revealing the pilot booth behind; host sticker nods | // WHO IS REALLY FIGHTING | — |
| 5 | 18–25 | "Every robot had a human pilot, driving it live with VR gear or a gamepad, its partner says." | **Pilot mirror**: VR-headset pilot (top) and robot (bottom) driven by the same boxing mocap; control strings from the pilot's hands to the robot; controller-button HUD flashes on each punch | // PILOTED, NOT AUTONOMOUS | — |
| 6 | 25–31 | "The AI? It only keeps the robot upright." | **Balance dial**: needle wobbles when a punch lands and the AI levels it; label "AI = BALANCE ONLY" | // THE AI'S ONLY JOB | — |
| 7 | 31–38 | "Balance is the hard part. The fighting? A video game with a body." | Split: left a gamepad, right a robot body, joined by an equals sign that flips to a plug-in cable | // BALANCE IS HARD | — |
| 8 | 38–45 | "Its pilots even qualified in a simulator. Three thousand, six hundred seventy matches." | Simulator grid of 3,670 tiny pip-matches filling in rows (counter), two winner tickets fly out to "SF" | // QUALIFIED IN A SIMULATOR | 3,670 |
| 9 | 45–55 | "Eight million views later, California stepped in. A cease-and-desist, twelve days after the fight." | Letter slides in; typed lines; stamp APPROVAL REQUIRED slams; views counter 0 → 8.2M; date chips SEPT 18 → SEPT 30 | // 12 DAYS TO A CEASE-AND-DESIST | 8.2M, 12 d |
| 10 | 55–65 | "So is it a robot fight, or a video game with a body? Tell me below." + CTA | Poster closes: bell rings; profile photo ring + @sandesh.explains + FOLLOW held ≥3 s; host sticker (avatar) points down | — | — |

Notes
- Hook ≤3.2 s; frame 0 fully composed; voice starts at 0.00 s; no scene transition before 3 s.
- Numbers on screen: 3, 850, 3,670, 8.2M, 12 (days = Sept 18 → Sept 30). "8.2M" is YouTube views per SFist on Oct 7; spoken as "eight million".
- REK claims (850 lb, who won) are attributed or omitted. The creator is "a content creator", no name on screen.
- Host (avatar from the Kaggle run): sticker commentator in beats 1, 4, 7, 10 only (cut-out WebM), never over captions.
- Captions: word-by-word, band y 1330–1490 reserved, dark pill.
- Audio: punchy percussion-led bed (boxing-gym tempo ~100 bpm), bell ding on beats 1 and 10, glove thwack on each punch, servo whirr under the robot, paper-tear, stamp thud, typewriter ticks on the letter, crowd swell on 8.2M.

## Visual identity — "Fight Poster Riso" (new)
Kraft paper `#d8c4a3`, two inks only: electric blue `#2338ff` and vermilion `#ff4326` (overlap multiplies to violet-black). Halftone dots, print misregistration jitter (2–3 px offset between the two ink layers, animated), ink-stamp slams, ticket stubs, torn paper edges. Type: Anton (headlines), Barlow Condensed (labels), Inter 600 (body). Mascots: riso fighter + riso robot + VR pilot (all new vector designs, not the cartwheel rig skins, not humaaans).
Mocap: CMU boxing/punch clips driving a 2D rig for fighter, robot (damped/delayed) and pilot (smooth) — boxing clip file to be located in the CMU mirror at build time (fallback: existing `135_04` kick + `88_06` spin + authored punches).
