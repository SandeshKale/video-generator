# "Sabke paas bayaan hain, saboot nahi" — the Nvidia CEO "spy plot" case file (draft v1 for approval, 11 Nov 2026)

Topic set by the creator (11 Nov): Jensen Huang's alleged affair with a suspected Chinese spy. Hinglish voice-over only (cloned voice, 0.92x, flow gate), ~85 s, 1080x1920 at 30 fps, English/Roman on screen.
Replaces the parked dark-pattern draft (`reels/tech/reel-dark-pattern-case-file/`, kept as a spare).
Creator notes carried in: sarcasm and wit must be higher; use an Opuscar style.

## Handling rules (live story, real named people: non-negotiable)
1. **Only attributed facts.** The affair is confirmed by Huang's own letter (8 Nov). The *spy* part is a NYT report of a US intelligence memo that is **not public, not proven, denied by China**; Nvidia's board says it has no reason to believe secrets were compromised. Every on-screen claim carries its source label (`research/sources.md`), and the film says what is unproven out loud (beat 6).
2. **The sarcasm aims at the evidence gap and the institutions' statements, never at the people.** No jokes about sex, the marriage, Huang's family, or Alice Huang's looks, motives or character; no "honey trap" framing; no implication he leaked anything. The one jokey fact about her is the surname coincidence ("not related"), and it is reported fact.
3. **No likeness of any real person** (no generated faces, no cartoons of them): the accused are name plates and file folders with initials. Real photos only if licensed; none planned.
4. **"Alleged / reportedly / NYT says" stays on screen** wherever the spy claim appears. China's and Megaspeed's denials are shown with equal weight. Nothing is stated as "who is right".
5. Re-run the news search the morning of posting; if a finding, charge or clearance lands, the script changes.
6. Banned list from `docs/STYLE-ROAST-EXPLAINER.md` respected (no tragedy, religion, caste, profanity). The wife and children appear only in the quoted letter line, read straight.

## Style (Lemo-Opuscar record)
- **Slug:** `halftone-dossier` (STYLE.md read in full, incl. "not" paragraph). Runner-up: `visual-investigation` (claim vs record on an evidence desk); not chosen because the dossier's stamps and "case number" deadpan give more joke surface, but its "claim vs record" idea is borrowed for beat 4.
- **Why it fits:** the whole story is "what's confirmed, what's alleged, what's denied": a case file with stamped statuses (CONFIRMED / ALLEGED / DENIED / UNPROVEN) is the honest and the funny form at once.
- **3 invariants kept:** paper + halftone-dot shading + flat overprint inks with misregistered headline shadows; bureaucratic apparatus in every frame (case number, numbered exhibits, status stamps that slam with shake + flash + sound); cards are the subtitles (headline + dark caption bar, keyword in the highlight ink), silence before each stamp.
- **What we adapt:** the style is a flat page; our rules require 3D + authored camera, so the dossier is a **3D desk** (folders, sheets, stamps, evidence board as meshes) under a **halftone print shader** (dot-screen overprint post pass: this reel's new technique, shared with the parked dark-pattern draft). Camera moves come from the style's vocabulary (pan across the pinned board, snap zoom on a halftone detail, pull back to reveal the desk). Fresh palette and fonts (below).

## Benchmark to beat (previous = `reel-spam-call-roast` v2)
Ceiling: a continuous 3D colony, ~17 authored shots, ELI5 objects, 0 lint findings. Weakness the creator named: sarcasm/wit too low. This reel adds: (1) **a status-stamp system** (CONFIRMED / ALLEGED / DENIED / UNPROVEN) that makes the deadpan structural: the joke is the pile of stamps; (2) **new technique:** halftone/dot-screen overprint shader + 3D stamp slams with silence before each verdict; (3) **a new data object:** the "everyone's evidence" board where each statement is a folder whose evidence slot is empty (four folders, four empty slots); (4) honesty as a scene (beat 6), not a footnote.

## Look
Manila desk `#ead9b4`, ink `#13172a`, overprint cobalt `#2c4bd8`, highlight marigold `#ffb300`, **DENIED** tomato `#e1362f`, **CONFIRMED** sea green `#1d9a69`, **ALLEGED** violet `#7b4bd0`, **UNPROVEN** grey-brown `#8a7a62`. Fonts: Alfa Slab One (headlines), Rubik 800 (numerals/names), JetBrains Mono 800 (case no., HUD), Inter 800 (captions). New vs spam-call (navy/tangerine) and billionaire (blush/plum).

## Story line and test
Protagonist: **the file itself** (what is confirmed vs reported). Want: a straight answer. Obstacle: everyone has a statement, nobody has published evidence. Reversal: the confirmed part is a letter about a marriage; the "spy" part is a memo no one has seen. Honest ending: no charge, no public finding, probe ongoing.
**One sentence:** *The CEO of the company whose chips run the AI boom confessed to an affair, but the claim that it was a spy plot rests on a memo nobody has published, so after three denials and one probe, the only thing everyone agrees on is that nobody has shown the evidence.*

## Beat sheet and joke ladder
Hinglish drafts; final is rewritten for the ear and gated. Tags: [F] joke is a plain reading of a real fact, [A] analogy (labelled). Every joke passes "remove it, does the fact still stand?".

| # | Time | Voice (draft) | Picture (3D desk) | Fact (tier) | Joke / test |
|---|---|---|---|---|---|
| 1 | 0-9 | "Duniya ki sabse keemti chip company ke boss ne ek chitthi likhi. Chitthi mein maafi hai, jaanch hai, aur teen desh jinke paas bayaan poore hain... aur saboot? Wo pata nahi." | Frame 0: a folder labelled FILE NVDA-1108; 3 stamps slam in a row on the beats "chitthi / jaanch / bayaan": CONFIRMED, ALLEGED, DENIED; silence, then the last stamp UNPROVEN on "saboot" | letter + probe + denials (B) | [F] the stamp count is the joke; "teen desh" = US (NYT-reported), China, Singapore statements; keep "teen" only if the final script names all three |
| 2 | 9-22 | "Pehle jo pakka hai. Aath November ko Jensen Huang ne chitthi mein likha: maine apni biwi se bewafai ki. Maafi maangi. Company ne bahar ke vakeelon se jaanch shuru ki. Yahan tak sab confirmed hai. Ab shuru hota hai 'reportedly'." | Sheet 1 typed on the desk, quoted line in large type, green CONFIRMED; then the sheet slides under and the word REPORTEDLY stamps in violet | letter 8 Nov, investigation (B) | the twist is "ab shuru hota hai reportedly" [F]; the letter line is read straight (rule 6) |
| 3 | 22-36 | "Ab 'reportedly'. New York Times ke mutabiq, America ke officials maante hain ki Alice Huang, Singapore ki chip-kharidne wali company Megaspeed ki purani executive, China ki intelligence ke liye kaam karti thi. Same surname, koi rishta nahi. Haan, sabse pehle wahi check hua." | A name plate A.H. + a Megaspeed folder; a mini export gate with crates marked ILLUSTRATIVE; stamps ALLEGED and, beside the plate, a NOT RELATED tag | NYT via AP/Neuron (B); not related (B); Megaspeed suspicions not established (B) | [F] surname coincidence is the joke; no comment on her; stamp text "NYT SAYS; MEMO NOT PUBLISHED" |
| 4 | 36-52 | "Ab sabka bayaan suniye. Nvidia ka board: secrets leak hone ka koi kaaran nahi. China: bina saboot ki badnaami. Singapore: humne to unhe kabhi investigate hi nahi kiya. Aur America ka memo? Kisi ne dikhaya nahi. Chaar folder, chaar bayaan, evidence ke chaar khaali khaane." | Pinned evidence board: four folders slide in one per statement; a dotted EVIDENCE slot on each fills with a halftone question mark instead of a document; camera pans along the board | board, China (Guo Jiakun), Singapore MHA 31 Oct, memo not public (B) | [F] "khaali khaane" = the memo isn't public and no statement cites documents; each label attributed; China's denial shown with equal weight |
| 5 | 52-64 | "Aapko isse kya? Aapka chatbot, aapka AI app, sab usi company ke chips par chalte hain. Isliye ek CEO ki chitthi aayi, aur pre-market mein share lagbhag paanch percent gira. Chip ek, bhaav roz ka." | Desk pulls back; a halftone bar chart on the wall drops ~5%; ILLUSTRATIVE chip crate icon on the desk; a status chip "AP: ~5% PRE-MARKET, 9 NOV" | ~5% pre-market (AP via Boston Globe) (B) | [F] no company-wide "$330B" unless body opened; "bhaav roz ka" is a plain statement |
| 6 | 64-76 | "Ab sach sach: ye kya nahi pata. Koi charge nahi. Kisi ne public mein ye nahi dikhaya ki wo China ke liye kaam karti thi. Aur ye bhi nahi ki unhone koi secret bataya. Yaani abhi: ek confirmed chitthi, ek reported memo, aur ek bahut lamba 'pata nahi'." | A list sheet with three struck-through lines "NO CHARGE / NO PUBLIC FINDING / NO PUBLIC EVIDENCE"; stamp UNPROVEN slams alone after a silence | The Neuron unproven list (B) | the honest beat; "bahut lamba pata nahi" [F] |
| 7 | 76-86 | "Is tarah ki khabar ka ek hi niyam hai: pehle dekho kisne kaha, phir dekho saboot kahan hai. Ye us dost ko bhejiye jo har forward par yakeen kar leta hai. Like, share aur subscribe karein, Sandesh Explains." | Desk pull-back; end card: profile photo + @sandeshexplains + LIKE/SHARE/SUBSCRIBE stamps slam one by one; final stamp CASE OPEN | CTA per the Hindi-reel YouTube rule | [A] share-bait line |

**Open loops:** L1 (frame 0) "saboot?" answered in beats 4 and 6; L2 (beat 2) "reportedly" pays off in beat 3; L3 (beat 5) "aapko isse kya?" answered in the same beat. **Sarcasm audit:** every beat ends on a flat twist; the stamps carry the deadpan; no joke needs an unsupported number; every named person/company appears only as in the cited reports.

## Shot list (authored, locked between moves)
1. 0.0-6.0 | locked wide on the folder; three slam shakes on the beats | - | - | stamps land alone
2. 6.0-9.0 | slow push to the UNPROVEN stamp | wide -> medium | ease-in-out | the question
3. 9.0-22.0 | dolly in on sheet 1, then pull back as REPORTEDLY stamps | medium -> close -> wide | ease-in-out | the pivot
4. 22.0-36.0 | pan from the A.H. plate to the Megaspeed folder, snap zoom on the NOT RELATED tag, back | pan + snap | ease-out | the surname beat
5. 36.0-52.0 | track along the evidence board, one folder per statement, lock on the four empty slots | pan -> locked | ease-in-out | "chaar khaali khaane"
6. 52.0-64.0 | crane up and pull back to the wall chart | close -> wide | ease-in-out | stakes
7. 64.0-76.0 | slow push to the struck-through list; lock for the stamp | wide -> close | ease-in-out | honesty
8. 76.0-86.0 | pull back to the whole desk, lock for the end card | close -> wide | ease-out | "one case among many"

## Asset families (>= 6) and mix audit
| Scene | Primary | Others |
|---|---|---|
| 1 | 3D desk + folder (procedural 3D) | halftone print shader (new), stamp SFX, kinetic type |
| 2 | typed sheet + stamp (3D type) | paper-dust webm overlay (never the strobing leak) |
| 3 | name plate + mini export gate (procedural 3D) | Phosphor/tabler icons as textures |
| 4 | pinned evidence board (3D) | halftone question-mark textures |
| 5 | halftone bar chart wall (data object) | Unsplash desk/wood photo as table texture |
| 6 | struck-through list sheet | typewriter CC0 uisfx |
| 7 | end-card stamps + profile photo | synth score |
Families: 7 (3D procedural, print shader, icon textures, kinetic type/stamps, footage overlay, real photo, audio). No family in more than 4 scenes; none under 2.

## Audio
Style palette: synth kick/snare/clap, 8th-note square bass, marimba pluck, finger snaps; foley: stamp boom + click, paper slides, folder flaps, typewriter. **0.4 s of music silence before the stamps in beats 1, 6 and 7.** Voice over music median >= 19 dB, min >= 13 dB; -14 LUFS, TP <= -1.

## Gates before delivery
Re-check the story the morning of posting (rule 5); tier-A upgrade of Nvidia's letter and board statement; storytelling cold read (not available: flag); `label-lint` 0; `overlay-lint` 0; frames at every cut, join and the end card; mix report; **voice not auditioned** flag; proof-read every string; `insights/reel-tags.json` entry.

## Decisions for the creator
1. Approve this framing: confirmed letter vs reported spy claim, sarcasm aimed at the evidence gap, no jokes about the people. (The affair itself is not a joke source.)
2. Name Alice Huang on screen (widely reported by NYT/AP) or use only "a former Megaspeed executive"? Recommended: initials plate "A.H." plus "former Megaspeed executive", full name only in the caption with the source.
3. The "$330B" market-value line: I could not read it in the article body, so I left it out; say if you want me to chase it.
4. Time-sensitive: this should post within ~2 days; developments (a House briefing proposed for 18 Nov, probe results) may change the story.
