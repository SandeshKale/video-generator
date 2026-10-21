# Script: "What did Ramayana's ₹4,000 crore buy?" — Ramayana (the film) trivia, 60 s, **Hindi voice only**, English on screen, FAST (R17)

Folder: `reels/entertainment/reel-ramayana-movie-trivia/` · Drafted 21 Oct 2026 · Built to the "mom's photo" reference rules (`docs/REFERENCE-REEL-PACKET-JOURNEY.md`).
One sentence: *a ₹4,000 crore, two-part film: follow the money into its cast, its sound and its action, then look at the one thing the trailer itself reveals (measured by me).* Goal: reach + shares + comments ("did the hero arrive last on purpose?").
Not a repeat: `reel-ramayana-trailer-review` was a critique and `reel-ramayana-book-now` was ticket logistics. This reel is **film trivia**; it reuses their assets.

## Why now
Part 1 opens this November (Wikipedia/Sony: 5 Nov worldwide, premiere event 27 Oct at the Academy Museum, Los Angeles; Part 2 at Diwali 2027); the new trailer is from 15 Oct; Yash's budget clarification ran on 16 Oct ([The Week](https://www.theweek.in/news/entertainment/2026/10/16/yash-clarifies-ramayana-budget-fact-check.html)). The budget is the most argued number online, so it is the hook.

## Benchmark to beat
Previous Ramayana reels: card-style stills + corner avatar (trailer review), parallax stills + ticket tear (book now). New here: (1) **an itemised receipt as the through-line object**: every fact prints a line item on a thermal receipt that is also the camera's path (the receipt scrolls as the one continuous move), ending on a stamped line **"NOT IN THE BUDGET — MEASURED"**; (2) **the whole asset library for this film in one reel** (18 trailer stills with depth parallax, 10 TMDB ID portraits, the trailer file for measured data objects, name cards where no photo exists); (3) **a measured data object nobody else made**: a trailer timeline strip showing "RAVANA" named at 0:39 and "RAM" at 1:13 over a luma curve that dips at Ram's entrance.

## Language (creator, 21 Oct 2026): Hindi only
Voice-over (the avatar) is **Hindi only**; every on-screen word (headlines, receipt lines, name cards, captions, stamps) stays **English**; captions are English subtitles timed to each Hindi phrase (same method as the Samantha Hindi reel: `timing_hi.py`-style character-proportional spread over the real pauses). Hindi text below is exactly what is in `avatar-prompts.md`; numbers are spelled as spoken. Latin "Sandesh Explains" is kept so it is said as the channel name.

## Script (Hindi VO ≈ 172 words, 4 parts of 40–46 words; English subtitle in italics)
| Time | Hindi (spoken) / English subtitle | What the viewer sees (event) | Asset |
|---|---|---|---|
| 0–3 | "रामायण का बजट बताया जा रहा है चार हज़ार करोड़ रुपये।" / *Ramayana's budget is reportedly four thousand crore rupees.* | Frame 0 composed: receipt header **RAMAYANA · PART 1 + 2**, **₹4,000 CR · REPORTED**, a trailer still behind (burning city), HUD `0/5 LINE ITEMS` | `fire-ring` still, receipt |
| 3–12 | "पर यश कहते हैं, ये दोनों पार्ट, इफ़ेक्ट्स, रिलीज़ और मार्केटिंग, सबका है। तो इस पैसे में मिला क्या?" / *But Yash says that covers both parts, effects, release and marketing. So what did it buy?* | The ₹4,000 CR bar **splits into PART 1 / PART 2** and a four-way breakdown (VFX · RELEASE · MARKETING · PRODUCTION), "per Yash, 16 Oct"; **Yash portrait (big)** enters beside it; host signposts | `yash.jpg`, data bar |
| 12–15 | "चार चीज़ें जो आप देख-सुन सकते हैं, और एक जो मैंने ख़ुद नापी।" / *Four things you can see and hear, and one I measured myself.* | Slots 1–4 dashed placeholders; slot 5 stamps **MEASURED BY ME** and pins (planted setup) | receipt skeleton |
| 15–30 | "पहली चीज़, कास्ट। अरुण गोविल उन्नीस सौ सत्तासी के टीवी रामायण में राम बने थे। अब वो राम के पिता, दशरथ बने हैं। राम हैं रणबीर कपूर, सीता साई पल्लवी, और रावण यश, जो इस फ़िल्म के को-प्रोड्यूसर भी हैं।" / *First, the cast. Arun Govil played Rama in the 1987 TV Ramayan. Now he plays Rama's father, Dasharatha. Ranbir Kapoor is Rama, Sai Pallavi is Sita, and Yash, a co-producer, is Ravana.* | Receipt prints "1 · CAST". **Name card ARUN GOVIL · RAMA (1987 TV) → DASHARATHA** flips; then three **big portraits in turn** (Ranbir, Sai Pallavi, Yash), each over its trailer still (`ram-face`, `sita`, `ravana-snow`) with a name plate; Sunny Deol / Ravi Dubey / Rakul as small "also in" chips | `ranbir`, `sai_pallavi`, `yash`, stills |
| 30–45 | "दूसरी चीज़, संगीत: हैन्स ज़िमर और ए. आर. रहमान। ज़िमर के लिए भारतीय पौराणिक गाथा पर ये पहला काम है, और रहमान ने इसे डरावना कहा। तीसरी, एक्शन: टेरी नोटरी ने रणबीर को ट्रेन किया, और स्टंट डायरेक्टर हैं गाय नॉरिस, फ़्यूरियोसा वाले।" / *Second, the sound: Hans Zimmer and A. R. Rahman. For Zimmer this is his first Indian mythological saga, and Rahman called scoring it terrifying. Third, the action: Terry Notary trained Ranbir, and Guy Norris, of Furiosa, is the stunt director.* | "2 · SOUND": **Zimmer and Rahman portraits (big, side by side)** with a live waveform of the reel's own mix between them, quote chip "terrifying — A. R. Rahman" (Sanskrit-verse chip); "3 · ACTION": `ram-aim` + `lightning` stills, name cards **TERRY NOTARY · ACTION**, **GUY NORRIS · STUNTS** | portraits, waveform, stills |
| 45–60 | "अब वो चीज़ जो मैंने नापी। मैंने पंद्रह अक्टूबर का ट्रेलर फ़्रेम-दर-फ़्रेम देखा। रावण का नाम राम से चौंतीस सेकंड पहले आता है, और राम की एंट्री ट्रेलर का सबसे अंधेरा हिस्सा है। क्या हीरो जानबूझकर आख़िर में आया? कमेंट करिए। Sandesh Explains को फ़ॉलो कीजिए।" / *Now the one I measured. I checked the 15 October trailer frame by frame. Ravana is named 34 seconds before Rama, and Rama's entrance is the darkest stretch. Did the hero arrive last on purpose? Comment. Follow Sandesh Explains.* | Pinned slot 5 becomes the **trailer timeline strip**: 156 s bar, claret **RAVANA 0:39** flag, gold **RAM 1:13** flag, a "34 s" bracket and a luma curve dipping at Ram's entrance (mean luma 42 vs 64.5; OPINION tag); stills `ravana-snow`, `ram-walk` as ≤ 2.5 s evidence; end card: profile photo, **@sandeshexplains**, FOLLOW; receipt prints "TOTAL: 5 FACTS" | measured object, end card |

## Camera plan (the "mom's photo" rule: one continuous world, travelling camera, ≤ 1 hard cut per 20 s)
The whole reel is **one camera moving down a single, very tall thermal receipt** (a vertical scroll in a lit, slightly 3D-tilted world with parallax layers: stills far, receipt mid, stamps and portraits near). No scene cuts at all (0 hard cuts planned; the only fast move is a 0.4 s whip-pan sideways into the trailer strip at 45 s, a camera move not a cut).
| Time | Camera move (cause → effect) | Hand-over to the next beat |
|---|---|---|
| 0–3 | locked wide on the receipt head; slow push on the ₹ line (anticipation) | the bar splits and the paper **feeds upward**, camera tilts down with it |
| 3–15 | glide down the receipt; the Part 1/Part 2 split bar is in the foreground; slots 1–5 appear | camera settles on slot 1 as it prints "CAST" |
| 15–30 | dolly in on slot 1; each portrait is a **card thrown forward out of the receipt** (parallax: portrait large and near, still behind it far) | the last card slides back; paper feeds on, camera drifts left to "SOUND" |
| 30–45 | arc left→right between the Zimmer and Rahman portraits with the waveform as the bridge; then push toward "ACTION" stills | whip-pan right (0.4 s, motion blur) onto the pinned slot 5 |
| 45–60 | slot 5 unrolls into the trailer strip; camera pulls back to show the whole strip, then rises to the end card on the receipt's last line | the receipt's torn end becomes the CTA card |
Each hand-over is a **match move** (paper feed, card throw, whip) with a printer/whoosh SFX on the move.

## Portrait sizing (creator: "portraits should be big")
- **Hero portraits** (Ranbir, Sai Pallavi, Yash; Zimmer and Rahman when they are the subject): **≥ 560 × 720 px** on the 1080 × 1920 canvas (about 52 % of the width, 37 % of the height), inside the safe zone (x 150–918, y 140–1536), with a name plate (Big Shoulders, ≥ 56 px) and a one-line role chip; TMDB `h632` source is 632 px tall, so use it at ≤ 720 px or fetch the `original` size to avoid upscaling softness.
- **Pairs** (Zimmer + Rahman): two portraits **≥ 400 × 520 px** each, side by side with the waveform between.
- **"Also in" chips** (Sunny Deol, Ravi Dubey, Rakul): smaller but still **≥ 200 × 260 px**, never tiny circles.
- Portraits are always upright, un-cropped at the face, with a thin gold rim and soft shadow so they separate from any still behind them; label "REAL PHOTO · TMDB" at ≥ 22 px.

## Fact ledger (tier A = primary or quoted by the named person; B = reputable secondary read 21 Oct; "REPORTED" on screen for B; M = measured by me)
| # | Claim as worded | Tier | Source | Note |
|---|---|---|---|---|
| M1 | Budget reportedly ₹4,000 crore (about $500 million); Yash: it covers both parts and includes VFX, global distribution and international marketing | A (Yash's statement) / B (the number) | [The Week, 16 Oct](https://www.theweek.in/news/entertainment/2026/10/16/yash-clarifies-ramayana-budget-fact-check.html); ETV Bharat quotes Namit Malhotra: "mounted on a budget of Rs 4000 crore" for the two parts | Cinemaview notes no audited number; one outlet's ₹835 crore Part 1 estimate is NOT used. Say "reportedly". |
| M2 | Arun Govil played Rama in Ramanand Sagar's 1987 *Ramayan*; he plays Dasharatha here | B | IBTimes India (set photos leaked Apr 2024), Wikipedia cast list, WION | Strong, widely reported; Govil publicly discussed why he first refused (WION). |
| M3 | Ranbir Kapoor (Rama), Sai Pallavi (Sita), Yash (Ravana; Hindi film debut), Sunny Deol (Hanuman), Ravi Dubey (Lakshmana), Rakul Preet Singh (Shurpanakha) | B | Wikipedia cast list (flagged "may contain unverified text"), The Week | Only name what two sources agree on in the voice: Ranbir, Sai Pallavi, Yash. "Co-producer" via Monster Mind Creations (The Week, ETV, Wikipedia). Hanuman not shown in the trailer: use portrait of Sunny Deol only as "also in" chip, never a likeness. |
| M4 | Music by Hans Zimmer and A. R. Rahman; Zimmer says it is his first Indian mythological saga; Rahman: "It's terrifying for both of us, scoring something so iconic" | A (quotes) | Hollywood Reporter India interviews (Jan 2026), DT Next/PTI | Do not say "first Indian film" (Wikipedia notes "To the Moon" for *Fateh*, 2025). Sanskrit verses: Rahman added them to Zimmer's soundscape (Gulf News). |
| M5 | Terry Notary trained Ranbir; Guy Norris is the stunt director (Furiosa) | B | Wikipedia crew list; Gulf News (Ranbir on Norris: "two action set pieces") | Notary's exact credit is "action director" per Wikipedia; spoken "trained Ranbir" per reports. |
| M6 | Ravana is named 34 s before Rama in the 15 Oct trailer; Rama's entrance is the darkest stretch (mean luma 42 vs 64.5) | M | Measured from the Sony "NEW TRAILER" file, see `../reel-ramayana-trailer-review/script.md` | Say "I measured". The "on purpose?" reading is an opinion and the question is the CTA. |
| Skip | Ranbir plays Parashurama/Vishnu too | C | Only Wikipedia; no other source in my search | Do NOT use. |
| Skip | Working title "God Power"; "Ravana Tandav" release; Kajal as Mandodari | C | single anonymous / single wiki source | Do NOT use. |
| Bonus (caption) | MrBeast attended the Mumbai promo event on 26 Sept; 10,000+ people on the film (Malhotra); reported 59,000 screens; first announced in 2017 as a trilogy; Part 1 wrapped by 1 July 2025 | B | ThePrint, Khaleej Times (MrBeast); ETV Bharat (10,000); Outlook (59,000); Wikipedia | Caption only, "reported". |

## Asset inventory (everything we hold for this film)
- **18 trailer stills + depth maps:** `../reel-ramayana-book-now/frames/*.jpg` and `site/depth/*.png` (army-field, army-wide, bird-flock, city-crowd, credits-card, end-card, fire-ring, imax-card, jatayu-fly, lightning, ram-aim, ram-face, ram-lakshman, ram-walk, ravana-snow, sita-temple, sita, title) → parallax hero for every scene (≤ 2.5 s each).
- **10 ID portraits** (TMDB): `site/img/*.jpg` (Ranbir, Sai Pallavi, Yash, Sunny Deol, Ravi Dubey, Rakul, Nitesh Tiwari, Namit Malhotra, Hans Zimmer, A. R. Rahman).
- **Trailer file** (creator upload) → measured timeline strip and luma curve.
- **Earlier analysis** (`../reel-ramayana-trailer-review/`): shot counts, cut rhythm, luma, audio LUFS, the annotated cards in `out/` (use as references, not re-used).
- **Existing build code to reuse:** `../reel-ramayana-book-now/site/gl.js` (parallax), `check.mjs`, `preview.mjs`.
- **Not available:** photos of Arun Govil, Lara Dutta, Kajal Aggarwal, Terry Notary, Guy Norris (use typographic name cards); any official Part 1 poster (TMDB lists only Part Two, id 1383500); film audio (muted always).

## Asset families (9)
1. Trailer stills + depth parallax · 2. Real ID portraits (TMDB) · 3. Receipt/ledger component with line-item printing, stamps (bespoke SVG/DOM) · 4. Measured data object (trailer timeline strip + luma curve from the real file) · 5. Live waveform object (the reel's own voice/music envelope) · 6. Budget bar split (Part 1/Part 2, four cost blocks) · 7. Name cards + kinetic captions (number word in accent colour) · 8. Real-footage dust overlay (low) + rough.js hand-drawn circles/underlines · 9. Avatar host cut-out + synth score (tense low strings + percussion; no sampled film music) with CC0 UI SFX (printer clicks, stamp).

## Look (own identity; not Premiere Night plum/gold, not Film Leader)
"Production Receipt": ink-blue night `#0a1a2f`, thermal-paper off-white `#f5f1e6`, rupee-green `#1f9d6b` = money, claret `#8e1b2d` = the trailer's villain/Ravana accent, gold `#d9a53a` = Rama/measured flags. Display **Big Shoulders Display 800** (needs vendoring) + **Cutive Mono** (receipt) + **Inter**; cover in Anton on thermal paper. Component language: perforated receipt edges, rubber-stamp verdicts, barcode footer with the date. Texture: paper grain and printer-roller shimmer. No dot-grid, no clip-corner panels, no tickets (used in book-now).

## Host performance track (R6/R7/R10/R18; Hindi)
Hook bright (R4); brow lift on "both parts"; nod on "one I measured myself"; steady 15–45; faint smile on nothing but the CTA; brow lift on "I measured"; nod on "thirty-four seconds"; dead-on at the lens for the question. Host windows (chest-up, rim-lit in gold to match the receipt light): 3–12, 14–17, 26–29, 45–52, 56–60 (~20 %).

## Critical-rule compliance checklist (all must be true before shipping)
1. Continuous world / camera plan above; ≤ 1 hard cut per 20 s (here 0); every beat an event with a camera answer.
2. Host inside the world's light (gold rim, receipt-paper bounce on the shoulders), chest-up, ~20 % of runtime, signposting only; avatar rule R18 (no smiles except the CTA).
3. Own visual identity (Production Receipt); ≥ 9 asset families; new technique: **the receipt as the camera path** + the measured trailer strip.
4. Hook in the first 3 s: frame 0 fully composed, voice from 0.0 s; payoff of "one I measured" lands at 45–52 s (planted at 12 s).
5. HUD through-line (line-item counter, running ₹ total); meaning-coded colour (green = money, claret = Ravana, gold = Rama/measured).
6. Safe zones (top 140, bottom 384, right 162; 150 px side inset), caption band clear, **no overlapping components** (`check.mjs` at entrance +0.7 s / mid / end), no typos (proof-read Hindi-to-English subtitles and names).
7. 2-second change rule via ambient layers (paper-feed shimmer, stamp pulses, waveform), never by cutting a hero.
8. Voice: avatar clips, Whisper-timed; mix voice over music ≥ 19 dB median / ≥ 13 dB min, −14 LUFS (measured, not auditioned).
9. QA: mute test with a fresh agent, consecutive-frame strips of the whip-pan, frames inside every move, host-crop frame diff on the MP4, contact sheet vs `reel-04` and the Samantha reel.
10. Guardrails below; handle on end card **@sandeshexplains**.

## Guardrails
No likeness of any real person generated or drawn; portraits only as labelled ID photos; trailer stills ≤ 2.5 s with commentary and trailer audio muted; money figure always "reportedly"; no film spoilers beyond the trailer; respectful tone toward the epic and the people named; the "hero arrives last" line is an opinion question, not an accusation.

## Caption draft (finalise after build)
Line 1: "Do you think Rama's entrance was dark on purpose? Comment YES or NO." · body: the five facts with "reported" tags, bonus facts · avatar disclosure · sources (The Week, Hollywood Reporter India, Gulf News, IBTimes, Wikipedia; trailer stills © Sony Pictures / Prime Focus; portraits TMDB) · `#Ramayana #BollywoodNews #FilmTrivia #RanbirKapoor #SandeshExplains`.

## Open decisions
1. A Hindi voice version later? (The Samantha reel did both.)
2. If you can upload the 30 Jul trailer, I can add a side-by-side measured comparison and a better "caught" beat.
3. Do you want Arun Govil's line kept (it is the best trivia, but check it feels right for your audience), or swapped for the "announced in 2017 as a trilogy, first planned for 2021" origin story?
