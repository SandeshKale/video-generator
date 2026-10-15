# Reel script — "Apple's rumored camera that doesn't record" (~69 s, 9 scenes, ~195 words)

Topic chosen by the user. Rumor-level story: **everything is "reportedly" / "per Gurman"**; Apple has announced nothing.
Voice: Kokoro am_adam, base 1.1 (generated, 68.7 s). A recurring on-screen host **Pip** lip-syncs to the whole voice-over (Rhubarb viseme cues).

## Narration
1. **Hook (0–3.3 s)** Apple's rumored home camera won't record video. At all.
2. It's code-named J450, per Bloomberg's Mark Gurman. A small metal cylinder, about the size of an oversized lip balm, with a slow, low frame rate eye.
3. So what does it do? It watches the room, and writes. Someone walks in, you get a note. The dog hops on the couch, you get a note. In Gurman's words: you're not getting anything but text descriptions.
4. It reportedly recognizes the people who live there, and pets, and tells you when someone comes or goes.
5. Apple's pitch is privacy. An alternative to mass surveillance, because there's no footage to watch, leak, or stream.
6. But here's the catch. If someone breaks in, what do you hand the police? A note saying a person entered the kitchen. No clip. No proof for your insurer.
7. And it's not alone. Reports say Apple and Google are rethinking what recording even means, with gadgets that transcribe and summarize, without saving the video.
8. Don't pencil it in yet. Apple hasn't announced this camera, and it's reportedly not due until twenty twenty seven. The smart home display it pairs with could show up as soon as this month.
9. So would you trade the footage for the privacy? Tell me below. Follow for the next tech story.

## Fact tiers (A = multi-outlet; B = single outlet / rumor detail; C = don't say)
| Claim | Tier | Source |
|---|---|---|
| Apple reportedly developing a home camera, codename J450, **no video recording**, text descriptions only | A (rumor) | Bloomberg's Mark Gurman (Power On podcast); PetaPixel, Notebookcheck, tbreak, NewsBytes |
| Gurman quote: "You're not getting anything but text descriptions." | A | Notebookcheck |
| Small metal cylinder (compared to an oversized lip balm tube), low-frame-rate sensor | A | Notebookcheck / Gurman |
| Reportedly recognizes household members entering/leaving, and pets | B | Notebookcheck |
| Apple pitched it as an alternative to mass surveillance (Gurman's framing) | A | PetaPixel / tbreak summaries |
| No footage → no clips for police/insurers (Gurman acknowledged the practical problem) | A | Notebookcheck, tbreak |
| Companion to smart home display J490, as early as Oct 2026; camera reportedly 2027 | A (reports differ on dates) | Notebookcheck, tbreak |
| Apple/Google rethinking "recording" for always-on devices (AirPods/Watch transcribe & summarize) | **B** — The Verge citing Gurman, rumored; "reports say" | aiweekly digest of The Verge |
| Where processing happens (on-device vs cloud) | unconfirmed — **not claimed** | — |

**Do NOT say:** that Apple announced/confirmed anything; a price or a launch date for the camera; "on-device"/"cloud"; that it "can't be hacked"; that it replaces Ring/Nest; any claim about what the notes will literally say (all on-screen notes are labelled illustration). The PetaPixel fetch was blocked (403) — facts were cross-checked from Notebookcheck's page and search summaries of PetaPixel/tbreak/NewsBytes.

## Visual system — "Dollhouse Cutaway" (new: warm paper-cut, soft shadows, no hard borders)
Cream wallpaper + diagonal stripe, **terracotta · teal · butter · sage** on aubergine ink; Bricolage Grotesque 800 + Inter + Space Mono. Components are rounded paper cut-outs with soft shadows and taped **sticky notes** (the on-screen "text descriptions" motif), not slate/ink-border cards. Fixed layout so the story scans: **top = the cutaway room (768×470)**, **bottom-left = Pip the host**, **bottom-right = the corkboard of notes**.

## Characters and motion (all from CMU mocap + hand-authored keys; zero numbers)
- **Pip (host)**: round-headed teal-sweater character; mouth shapes A–H/X driven by **Rhubarb** cues, deterministic blink, body gestures from CMU 18_08 ("explain with hand gestures") and 13_27 (wave/point).
- **Housemate** (walk loop 02_01, sit 13_01, dance 55_01), **burglar** (CMU 17_03 "walk stealthily"), **police officer** (CMU 111_25 shrug), **dog** (authored from the quadruped rig).
- **The camera**: aluminium cylinder with a single blinking eye; **spits sticky notes** onto the corkboard.

## Animation spec
1. **Hook**: housemate walks in; the camera's eye blinks; a film reel gets a red ban; stamp NO VIDEO slams; first note flies to the corkboard at ~2 s. Frame 0 already composed (host talking from 0.00 s).
2. **J450 reveal**: the cylinder rotates on a turntable next to a lip-balm tube (same height, slides into place); the camera's "eye" shows **smooth vs 4-fps stutter** side by side (a walker moving smoothly on the left, stepping on the right) — "slow eye" shown, not stated.
3. **Notes, not footage**: viewfinder with 4 fps stutter; each event (walk-in, dog hops on couch, door closes) prints a taped note onto the board with a typewriter reveal.
4. **Recognition**: household members get a green tag, a stranger a "?" tag; the dog gets a bone tag; a door swings open/closed as they come and go.
5. **Privacy**: old camera = a film reel streaming up a cable to a cloud where a hacker hand grabs it; new camera = the same grab finds only sticky notes (hand pulls a note, shrugs).
6. **The catch**: burglar tiptoes across the kitchen; the camera prints a note; the officer arrives, asks for footage, the camera hands over the note, the officer shrugs (CMU shrug) and a "NO CLIP" stamp lands; insurer clipboard shakes its head.
7. **Industry shift**: three gadgets (earbuds, watch, glasses) each with a REC light that clicks off and a speech-bubble of text popping out instead.
8. **Caution**: a calendar page peels to a "later" page; a UNANNOUNCED stamp; a rumor-cloud drifts past; the smart display ("pairs with") slides in beside the camera.
9. **CTA**: seesaw "FOOTAGE ↔ PRIVACY" tilts; Pip points to the corkboard, profile photo (≥200 px), @sandesh.explains, FOLLOW held ≥3 s.

## Eyebrows (content-specific)
`// A CAMERA WITH NO FILM` · `// J450 · THE LIP-BALM EYE` · `// NOTES, NOT FOOTAGE` · `// IT KNOWS WHO LIVES HERE` · `// NOTHING TO LEAK` · `// WHAT DO YOU HAND THE POLICE?` · `// "RECORDING" IS BEING REDEFINED` · `// RUMOR · UNANNOUNCED` · `// FOOTAGE OR PRIVACY?`

## Retention plan
Voice at 0.00 s, Pip talking on frame 0, first payoff (stamp + note) by ~3 s, no scene change before 3.26 s, a new visual gag every ~5 s; the burglar/officer-shrug beat at ~38 s is the mid-video twist.

## Compliance & credits
Caption says "rumor, per Bloomberg's Mark Gurman; Apple has not announced this"; "illustration, not an Apple product"; CMU acknowledgment line; Rhubarb (MIT) noted in repo attribution only.
