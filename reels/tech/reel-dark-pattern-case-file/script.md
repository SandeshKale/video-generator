# "Khud ka exam, khud ki copy-checking" — the dark-pattern case file (draft v1 for approval, 11 Nov 2026)

Working title on screen: **CASE NO. 13: The Apps That Pleaded Not Guilty.** Hinglish voice-over only (cloned voice, 0.92x, flow gate, no pause injection), ~80 s, vertical 1080x1920 at 30 fps.
Feedback driving this one (creator, 10 Nov): *"your sarcasm level and wit level is too low"* and *"use one of the relevant styles from opuscar"*.

## Style (Lemo-Opuscar record, required before mockup)
- **Slug:** `halftone-dossier` (read in full, incl. its "not" paragraph). Runner-up: `game-show` (call-and-response rounds, judgement words), rejected because its candy/bouncy mood would soften the sarcasm; the dossier's bureaucratic seriousness *is* the joke engine.
- **Why it fits:** the topic is a trial of platforms ("accused"), exhibits are real documents (declaration vs findings vs penalty orders), verdicts are stamps. A deadpan paper file reading out absurd facts is the cheapest, loudest way to be sarcastic without a cartoon cast.
- **3 invariants kept:** (1) the whole film is paper with halftone-dot shading (no gradients), overprinted flat inks + misregistered headline shadows; (2) bureaucratic apparatus in every frame: case number, numbered exhibits, file chips, rubber stamps that slam with shake + flash + sound; (3) cards are the subtitles: one headline per beat + a dark caption bar with the keyword in the highlight ink, and a silence before each verdict stamp.
- **What we adapt (our rules win):** the style is a flat 2D page, but the standing rule is everything 3D with authored cinematic camera. So the dossier is a **3D desk**: folders, paper sheets, stamps, a height-chart wall and a pinned evidence board are real three.js meshes under a **halftone print shader** (dot-screen overprint post pass, new technique). Camera moves come from the style's own vocabulary (pan across the pinned board, snap zoom into a halftone detail, pull back to reveal the desk, folder slide) as authored shots. No cartoon people: the "accused" are name plates / mugshot-style cards with generic initials, not logos or mascots. Own palette and fonts (below), not the demo's.
- **Voice:** the style says dry deadpan report voice; we keep our cloned Hinglish voice at 0.92x, deadpan *delivery by writing* (short flat sentences, one twist at the end of each), no mugging.

## Benchmark to beat (previous reel = `reel-spam-call-roast` v2)
Ceiling: continuous 3D colony, ~17 authored shots, ELI5 objects built on words, 0 lint findings; weakness: jokes were mild, mostly explanatory; frames calm; sarcasm in the script was one-note.
This reel does at least three things it didn't: (1) **a joke engine** (every beat ends in a twist line that passes the four truth tests); (2) **new technique:** halftone/dot-screen overprint print shader + 3D rubber-stamp slams with shake, flash and silence-before-verdict; (3) **new data object:** a 23-folder "self-certified CLEAN" wall whose stamps flip to FAIL on 16, leaving 7 (the claim vs the audit as one physical object); (4) real regulator text as exhibits (button labels the CCPA actually flagged).

## Why this reel
- Fresh and checkable: LocalCircles 8 Jul 2026 + Rajya Sabha reply reported 4 Aug 2026 + 26 self-declarations Nov 2025 (`research/sources.md`).
- Relatable to every Indian phone owner (pre-ticked boxes, "No, I will take risk" buttons, the ₹10 donation); high send-to-a-friend value ("tag the friend who always clicks the wrong button").
- Passes the storytelling gate: protagonist = *your checkout screen*; obstacle = it was built to trick you; reversal = the companies *certified themselves clean*, then an outside audit said 16 of 23 weren't; honest ending = the audit is a survey with its own tool, not a court verdict, and the fines so far total ₹20 lakh.
- Evidence note: Instagram report data is old (12 Oct) and thin; the pick rests on story + fresh news, not on measured views.

**One-sentence story test:** *India banned 13 sneaky checkout tricks, so 26 companies wrote to the government that they use none, but an outside audit found 16 of the 23 it checked still do, and the penalties so far are ₹1 lakh per pre-ticked box, so the exam is still being marked by the students.*

## Look
Archive-manila desk and paper (`#efe3c8`), dark ink **navy-black `#14182b`** (outlines, text, caption bar), overprint shadow **cobalt `#2f4bd6`**, highlight **marigold `#ffb800`**, alarm/stamp **tomato `#e5322d`**, "clean/approved" **sea green `#1f9d6a`**. Meaning: green stamp = what they claimed; red stamp = what was found; marigold = the number to read. Fonts: **Alfa Slab One** headlines (black slab, already vendored), **Bagel Fat One** or **Rubik 800** for numerals/names (pick one that is vendored; vendor if not), **JetBrains Mono 800** for case numbers/HUD, **Inter 800** captions. Different from spam-call (navy/tangerine) and billionaire (blush/plum).

## Beat sheet (But/Therefore, with connectors) and the joke ladder
Voice lines are Hinglish drafts; final text is rewritten for the ear and gated (one take per breath group). Joke tags: **[F]** = the joke is a plain reading of a real fact, **[A]** = analogy (labelled), **[M]** = myth corrected. Every joke must survive "remove the joke, does the fact still stand?".

| # | Time | Voice (draft) | Picture (3D desk, shot) | Fact (tier) | Joke / truth test |
|---|---|---|---|---|---|
| 1 | 0-8 | "Chhabbees companies ne sarkar ko likh ke diya: hamare app mein koi dark pattern nahi hai. Matlab khud ka exam, khud ki copy-checking. Aur result? Sab pass." | Frame 0: 26 manila folders on a desk, each already stamped **SELF-CERTIFIED: CLEAN** (green), slam on the word "pass"; headline **CASE NO. 13** | 26 self-declarations, Nov 2025 (B) | [F] exam analogy is the joke; fact = they declared after self-audits |
| 2 | 8-20 | "Dark pattern kya hai? Jab app aapse wo karwa le jo aap karna nahi chahte, aur aapko lage ye aapka hi idea tha. Sarkar ne 2023 mein aisi terah tarah ki tricks ki list banayi. Gin ke terah." | Pull back to a wall of 13 numbered halftone tags that pop on the count; snap zoom on four with ILLUSTRATIVE mini-interfaces (pre-ticked box, "No, I will take risk" button, countdown, a price that grows) | 13 specified patterns, 30 Nov 2023 (B) | [F] "aapka hi idea" = definition in plain words; the interfaces are labelled ILLUSTRATIVE |
| 3 | 20-33 | "Exhibit A: ek airline ka button. 'Nahi, main risk loonga.' Matlab insurance nahi li toh aap jua khel rahe ho. CCPA ne bola, badlo. Ab likha hai: 'Nahi, main ise trip mein add nahi karna chahta.' Wahi button, bas thoda kam dramatic." | Exhibit A card on the desk, two button plates swap with a flip; stamp **REWORDED** | IndiGo wording change, no penalty reported; McAfee "Accept Risk" / "Renew Now", added "Skip" (B, via Rajya Sabha reply as reported) | [F] real strings; the sarcasm is only the reading. Name the airline only because the reply names it |
| 4 | 33-46 | "Exhibit B: sazaa. Saat cases, kul bees lakh rupaye. Pre-ticked dabba? Ek lakh. Pehle se chuna hua daan, dus rupaye? Paanch lakh. Hisaab simple hai: dabba jitna chhota, jurmana utna bada." | Height-chart wall: seven name plates with a halftone bar each (7/5/3/2/1/1/1); stamp **FINED** on each, silence before the last; the marigold ₹20 lakh numeral grows in dots | Zepto ₹7 L, Physics Wallah ₹5 L (pre-selected ₹10 donation), Anuj Jindal ₹3 L, FirstCry ₹2 L, PharmEasy/McAfee/SpiceJet ₹1 L each (B) | **Check the last joke:** "dabba jitna chhota, jurmana utna bada" is false (the fines are not tied to box size): replace in final with a true line: "Pre-ticked dabba ke liye ek lakh. Sunne mein bada lagta hai, jab tak aap company ka quarter result na dekho." (only if a revenue fact is verified; otherwise cut to "Pre-ticked dabba: ek lakh rupaye. Tick pehle se tha, jurmana baad mein.") |
| 5 | 46-60 | "Ab twist. Jin 23 ne kaha 'hum saaf hain', unka bahar se audit hua. Teis mein se solah mein phir bhi dark pattern mile. Sirf saat pass hue. Yaani khud ko khud ne diye sau mein se tees." | The 23-folder CLEAN wall: green stamps flip to red **FAIL** on 16, 7 stay green; a counter reads 16 / 7; a dot-chart of 30% fills | LocalCircles: ~23 self-declared, 16 still found, 7 passed (B); 7/23 ≈ 30% (our arithmetic) | [F] "tees" is 7 ÷ 23 ≈ 30%, labelled our maths; "audit hua" = LocalCircles survey, not court (stated in beat 6) |
| 6 | 60-72 | "Ek baat sach sach: ye audit LocalCircles ka hai, unka apna AI tool. Adalat ka faisla nahi. Par jab 'maine khud likha' aur 'bahar se dekha' mein itna fark ho, toh sawal banta hai: exam kaun check kar raha hai?" | Folder slides away; a magnifier-snap on the small print "survey, not a court finding"; caption bar in cobalt | LocalCircles: AI detection engine + 250,000+ consumer complaints (B); CCPA keeps watching non-filers (B) | the honest beat (one sentence of doubt, not a retraction) |
| 7 | 72-82 | "Agli baar koi button aapko sharminda kare, 'nahi, main risk loonga', screenshot lo. Aur jo dost hamesha galat button dabata hai, usse ye bhejo. Like, share aur subscribe karein, Sandesh Explains." | End card: profile photo + **@sandeshexplains** + LIKE/SHARE/SUBSCRIBE stamps slamming one by one; desk pull-back; a final stamp **CASE OPEN** | CTA per the Hindi-reel YouTube rule | [A] "dost jo galat button dabata hai" is the share-bait |

**Open loops:** L1 (frame 0) "sab pass?" is answered in beat 5; L2 (beat 2) "terah ki list" pays off as the 13-tag wall and returns for the recap; L3 (beat 4) "dabba chhota" teaser pays off in beat 7's "galat button".
**Sarcasm audit (to hit the creator's note):** every beat ends on a flat twist sentence; the stamps do the deadpan; no joke relies on a made-up number; banned list respected (no religion, caste, politics, tragedy, profanity); named companies only where the CCPA/Rajya Sabha reply names them, "alleged" not needed for regulator orders, "LocalCircles says" for the audit.

## Shot list (authored; `time | move | from -> to | ease | motivation`)
1. 0.0-3.0 | locked wide on the 26 folders; slam shake on "pass" | - | - | stamp lands alone
2. 3.0-8.0 | slow dolly in on one folder | wide -> medium | ease-in-out | the one under scrutiny
3. 8.0-12.0 | pull back and crane up to reveal the 13-tag wall | medium -> overhead wide | ease-in-out | "list"
4. 12.0-20.0 | snap zoom to each mini-interface on its tag, back to wide between | wide <-> close | ease-out | one example per count
5. 20.0-33.0 | pan along the desk to Exhibit A; fixed close on the two button plates | pan -> locked | ease-in-out | the swap
6. 33.0-46.0 | track along the height-chart wall, one plate per stamp | pan | ease-in-out | seven fines
7. 46.0-60.0 | crane up over the 23-folder wall, then lock top-down for the flips | crane -> locked | ease-in-out | the audit
8. 60.0-72.0 | slow push to a magnifier on the small print | wide -> close | ease-in-out | honesty
9. 72.0-82.0 | pull back to reveal the whole desk, locked for the end card | close -> wide | ease-out | "one case among many"
Camera is locked between moves (no drift).

## Asset families (>= 6) and mix audit
| Scene | Primary family | Others |
|---|---|---|
| 1 | three.js 3D desk + folders (family 2/procedural 3D) | halftone print shader (new), kinetic type, stamp SFX |
| 2 | procedural 3D wall of tags + illustrative interface plates (SVG/canvas textures) | Phosphor/tabler icons |
| 3 | button-plate flip (3D) + real-string exhibit cards | real-footage paper-dust overlay (`dust-particles.webm`, never the strobing leak) |
| 4 | 3D height-chart bars, halftone numeral | Unsplash desk/wood photo as the table texture (real photo family) |
| 5 | 23-folder instanced stamp wall (data object) | counter, dot-chart |
| 6 | magnifier + small-print 3D sheet | caption bar |
| 7 | end-card stamps, profile photo | synth score + CC0 uisfx stamps/typewriter samples |
Families used: 7 (3D procedural, shader/print, icons+SVG textures, kinetic type/stamps, footage overlay, real photo, audio/score). No family in more than 4 scenes; no scene under 2 families.

## Audio plan
Sound palette from the style: synth kick/snare/clap, 8th-note square bass, marimba pluck, finger snaps; foley = stamp boom + click (crackle for the big ones), paper slides, folder flaps, typewriter, camera shutter, pops per glyph. **Empty the music for 0.4 s before each verdict stamp** (beats 1, 4, 5, 7). Voice over music median >= 19 dB, min >= 13 dB (skip soft SFX over word spans). -14 LUFS, TP <= -1.

## Gates before delivery
Storytelling gate (cold read: not available, flag), `label-lint` 0, `overlay-lint` 0, frames at every cut/slice join/end card, mix report, *voice not auditioned* flag, `check` that every on-screen string is proof-read, tier-A upgrade of facts #4 and #8 (Rajya Sabha PDF, PIB) before posting.

## Open decisions for the creator
1. Style: `halftone-dossier` on a 3D desk (recommended) or `game-show`?
2. The joke on beat 4 needs a true replacement (see table); choose the simple "Tick pehle se tha, jurmana baad mein" unless you want me to research company revenues for a scale joke.
3. Name the airline and the apps (as the regulator reply does) or keep "ek airline, ek quick-commerce app"? Recommended: name them, they are in an official reply.
