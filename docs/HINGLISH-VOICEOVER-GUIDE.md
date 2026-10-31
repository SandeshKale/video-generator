# Hinglish voice-over guide: pronunciation, cadence and natural flow (31 Oct 2026)

How to write, generate and check a Hinglish (Hindi grammar + English terms) voice-over so English words sound right, the rhythm sounds spoken, and the delivery feels natural.
Built from (1) measurements of the creator's reference voice-over, (2) published guidance and papers, and (3) our own experiments with OmniVoice on this CPU box.
**Honesty note:** nothing here could be *heard* by me. Measurements (transcripts, pauses, pitch, round-trip recognition) catch what numbers can catch; the creator's ear is the final test, which is why a sample pack is delivered with it.

## TL;DR — ten rules
1. **Write the master in mixed script** (Hindi in Devanagari, English terms in Latin) and keep an **all-Devanagari respelling** of every line; for OmniVoice **synthesise from the respelling** (best accuracy, most expressive, Indian-accented English words). Never romanised Hindi.
2. **One sentence = one take.** Never cut a sentence into separate takes; it strands the intonation.
3. **Punctuation does not make pauses** inside a take (comma 0 ms, `।` ≈ 330 ms). **Inject** pauses at the commas and between sentences instead.
4. **Pause budget from the reference:** ≈ 30% of the runtime is silence; a stop ≥ 0.4 s every ~3 s; **0.8–1.2 s after every named term, question and reveal**; 0.2–0.3 s at commas.
5. **Rate:** plan 3.3 words/s overall; articulate at ≈ 4.4 words/s (`speed` 1.18). Intelligibility held up to 1.2.
6. **Sentences ~9 words**, rarely > 15; one stressed word each; ask-then-answer; "define → name → pause".
7. **English only for nouns/terms;** verbs and grammar stay Hindi; switch at phrase edges.
8. **Spoken numbers** ("दस minute", "पौने तीन हज़ार", "करीब इक्कीस हज़ार करोड़"), not digit strings.
9. **Hard words get a respelling** (geofence → जियोफेंस, PIN code → पिन कोड); phoneme tags, non-verbal tags and clone prompts did **not** help.
10. **Check by numbers, then by ear:** Whisper round-trip ≥ 95% per line, every brand/term hit, pause histogram in band, one pitch register; the creator listens before any render. Nothing here was heard by me.

## 1. What the reference does (measured, 160 s vertical explainer, one male narrator)

Third-party reference supplied by the creator **for voice-over style only**. Its script, structure and visuals are not reused, and its voice is not cloned or imitated. Numbers come from my own analysis of its audio (Whisper medium transcript + energy/pitch tracking).

| Measure | Reference | What it means for us |
|---|---|---|
| Length / speech time | 160 s, speech 110 s | **31% of the runtime is pauses.** The pace comes from rhythm, not rushing. |
| Rate overall | ≈ 3.45 words/s (≈ 207 wpm by Whisper's word count) | plan scripts at **3.3 words/s overall** (≈ 63 s for 208 words) |
| Rate while talking | ≈ 5.0 words/s (≈ 10 syllables/s) | fast *inside* a phrase, then a real stop |
| Sentence length | median **9 words** (IQR 7–11, max 18) | one idea per sentence; > 15 words only when it builds to a reveal |
| Pauses | 152 speech chunks; 62 micro (80–200 ms), 24 short (200–400), **33 mid (400–800), 17 long (0.8–1.5 s)**, none > 1.5 s; median gap 0.19 s | a stop ≥ 0.4 s about **every 3 s** |
| Where the long pauses fall | after a **named term** ("…जिसे geofence कहते हैं।"), after a rhetorical question ("इतनी जल्दी कैसे?"), after a reveal line, before a topic switch | pause *after* the key word so the picture lands, never before it |
| Pitch | male, median **112 Hz**, p10–p90 83–161 Hz (≈ 11 semitones) | a low, warm voice with a wide range; flat TTS is the opposite |
| Liveliness | pitch std ≈ **3.6 semitones** per 2 s window (1.2–6.9) | lively, but controlled: no singing, no monotone |
| Phrase endings | 68% of phrases end lower than they start (median −4 semitones) | statements fall; questions rise |
| Loudness | voiced range ≈ 11 dB (p10–p90) | gentle dynamics: emphasis is pitch/length, not shouting |
| Address | informal "तुम", 9–11-word sentences, direct questions ("तुम्हारा दूध वहाँ था ही क्यों?") | we use "आप" by default (wider audience); same structure |
| Code-mix | roughly a quarter of the words are English, **all nouns/terms** (dark store, order, map, stock, shelf…); verbs and glue stay Hindi | switch language at phrase edges, keep grammar Hindi |
| Naming pattern | define → **"इसे X कहते हैं।"** → pause | a repeatable "term reveal" beat, used once per concept |
| Ending | a direct question to the viewer ("कमेंट में बताओ") | CTA = a real question |

## 2. What the literature and vendor docs agree on

| Topic | Guidance | Source (how strong) |
|---|---|---|
| Script | write **each language in its own script**: Hindi in Devanagari, English in Latin; romanised Hindi degrades quality ("आपका order confirm हो गया है" good, "Aapka order confirm ho gaya hai" bad) | Sarvam TTS best-practice docs (vendor, but explicit); a Springer code-mixed TTS paper reaches the same split (published) |
| Counter-view | some systems normalise everything to Devanagari by transliterating English first, and report gains when trained that way | arXiv 2312.01103 (research, low-resource); a Hinglish TTS repo reports 4.7/5 intelligibility across all script variants (self-reported) → **test with your engine; we did (section 4)** |
| Punctuation | `,` short pause; `।` ends a Hindi sentence, `.` an English one; `!` emphasis with pause; `…` sparingly; a line break is a longer pause | Sarvam docs |
| Sentence length | short; long sentences cause unnatural breathing; never split mid-sentence (it strands intonation) | Sarvam docs |
| Numbers | write them the way they should sound, or use grouped digits (`5,00,000`) with a normaliser; set the language to the one whose number conventions you want | Sarvam docs |
| Brands/names | keep them in Latin; use a pronunciation dictionary / override, not ad-hoc respelling | Sarvam docs; OmniVoice has inline phoneme tags (below) |
| Switching | switch at phrase boundaries, not mid-clause; keep the mix ratio steady; keep common loanwords (phone, plan, order) in English | vendor guides (weak, marketing sources) |
| Schwa | Hindi text-to-speech mostly fails on **schwa deletion** (which written "a" is not spoken: "Ramesh", not "Ra-ma-sha"); rules alone are not enough | Arora et al., ACL 2020 (published) |
| Hindi prosody | declaratives fall; **yes/no questions rise on the final verb group**; non-final content words carry rising accents; **focus = bigger pitch excursion + longer duration, then the rest of the phrase is compressed** | Hindi-Urdu prosody papers (Patil 2008, Harnsberger, Butt & Jabeen) |
| English words in Indian speech | the English sounds are mapped to Indian ones: **/t d/ become retroflex ʈ ɖ**, /θ ð/ become dental stops ("think" ≈ "tink"), **/v w/ often merge**, plosives are unaspirated, rhythm is syllable-timed | ICPhS 2019, teaching summaries (status of v/w merger is disputed) |
| Pace | vendors suggest 130–160 wpm and slower for dense content; **no Hindi-specific explainer benchmark exists** — hence our reference measurement | vendor blogs (weak) |

## 3. Our experiments (OmniVoice, local CPU, one male "voice design" speaker, 10 real lines of the reel script)

Method: every line was synthesised from the same words written three ways, transcribed back with Whisper medium, and compared with the intended reading after reducing both to a coarse **sound skeleton** (vowel signs dropped, ट/त, ड/द, श/ष/स merged, so "दार्क"≈"डार्क"). "Terms" = how well the English words in the line were recovered. Prosody = pitch statistics of the output. **All numbers are machine proxies; a human ear can disagree.**

### 3.1 Script format (10 lines × 3 formats = 30 takes)

| Format | Takes | Whole-line match % | English-term match % | Pitch std (semitones) | Pitch range p10–p90 (st) | Mean pitch (Hz) |
|---|--:|--:|--:|--:|--:|--:|
| **B** all-Devanagari, English respelled ("डार्क स्टोर", "जियोफेंस") | 10 | **96.4** | **93.8** | **3.83** | **9.3** | 138 ± 10 |
| A mixed script ("dark store" in Latin) | 10 | 95.6 | 90.2 | 2.79 | 6.9 | 124 ± 17 |
| C romanised Hinglish ("dark store dhoondhta hai") | 10 | 93.4 | 89.8 | 1.62 | 4.2 | 106 ± 8 |
| *reference voice-over* | — | — | — | *3.56* | *11.4* | *112* |

What it shows:
- **B is best on accuracy and on liveliness** (pitch variation 3.8 st is closest to the reference's 3.6). **C is the worst and the flattest** (1.6 st = near-monotone), which agrees with the vendors' "never write Hindi in Roman letters".
- A (the vendors' recommendation) is close but a little less accurate with *this* engine. Likely reason (my inference, not proven): a Latin-spelled English word is read by an English letter-to-sound path and sounds like a foreign accent dropped into Hindi, whereas a Devanagari-spelled word is read by Hindi rules and comes out **Indian-accented**, as real Hinglish speakers say it (ऑर्डर with a retroflex ड़/ट, "स्टॉक" not "stock"). The survey literature describes the opposite failure ("strong foreign accent") for systems that apply a foreign phone set to a monolingual voice.
- The **speaker changes with the script**: mean pitch moved from 106 Hz (C) to 138 Hz (B) for the same voice description. Do not mix formats within a reel.
- **Failures are word-specific, not format-specific.** In every format "geofence" came back as "जी ओ फेन्स" (75% match) and "PIN code" as "पिंग कोड"/"पिंकोड"; "चीज़ stock" ran together. These are the words that need a respelling or a pronunciation override.

**Decision for OmniVoice:** write the master in mixed script (readable, correct for vendor engines like Sarvam), but **synthesise from the all-Devanagari respelling** (`script.json`, field `B`). Keep one table of respellings and use it for every reel.

### 3.2 Pauses: punctuation does almost nothing inside one take

Same words, different marks (single generation, silence ≥ 200 ms counted):

| Mark | Pause produced |
|---|---|
| comma `,` | **none** |
| plain / double newline | none (240 ms in one of two runs) |
| ellipsis `…` | 300 ms, only at the end |
| em dash `—` | 230 ms |
| exclamation `!` | 300 ms |
| danda `।` | 330 ms |
| question `?` | 380 ms (and a rise) |

The reference pauses ≥ 0.4 s **every ~3 s** and long (0.8–1.2 s) after each reveal. A single TTS take cannot do that, and cutting a sentence into separate takes strands the intonation (also Sarvam's warning). **What works:** keep each sentence as one take, then *inject* the silence (section 4, step 3).

### 3.3 Speed and exact length

| `speed` | length of the same line | whole-line match |
|---|--:|--:|
| 0.9 | 9.32 s | 95.2 |
| 1.0 | 8.44 s | 93.5 |
| 1.1 | 7.96 s | 92.7 |
| 1.2 | 7.22 s | 94.3 |

Intelligibility did not fall up to 1.2. The model's natural articulation is ≈ 3.8 Whisper-words/s vs the reference's 5.0, so **speed ≈ 1.18** (≈ 4.4 w/s) is the baseline. `duration=` (fixed seconds) lands within ≈ 3% of the target (4.83→4.98 s, 5.68→5.77 s, 6.53→6.37 s), so it can fit a line to a picture slot; use it only for ±15% changes.

### 3.4 Things that did **not** help (or hurt)

| Tried | Result | Rule |
|---|---|---|
| Phoneme override `[JH IY1 OW0 F EH2 N S]` for brand/loan words (OmniVoice's CMU syntax) | not better than plain text (still "जिवाफिन्स", "ब्लिंकिद") | not a fix for Indian-accented English; use Devanagari respelling instead |
| Voice **clone prompt** from the best take, to lock the speaker | pitch spread the same (σ ≈ 3.4 Hz vs 3.3 Hz for repeated design takes); no measurable gain | a fixed `instruct` + a pitch-closeness check is enough; clone only if timbre drifts audibly |
| Non-verbal tags `[question-ah]`, `[confirmation-en]`, `[sigh]`, `[surprise-oh]` inside a line | added 0.5–0.6 s and **changed the first word** ("आ अंडे"; "गडी" for "घड़ी"; [sigh] shortened the line to 1.78 s) | do not put tags in a script; use sentence shape for surprise |
| Many ellipses / exclamations for rhythm | each adds a pause only at the end of the take, never inside | use the injector |

## 4. The pipeline (script → voice → QA), implemented in `reels/tech/reel-quick-commerce-itna-jaldi/voice/build_voice.py`

1. **Write for the ear** (section 5), keeping a mixed-script master (field `A`) and an all-Devanagari respelling (field `B`) per line.
2. **Generate each sentence as one take** from `B` with a fixed voice description (`male, middle-aged, low pitch, indian accent`), `speed 1.18`, up to 3 seeds.
3. **Pick the take** by (0.6 × whole-line match + 0.4 × term match); stop early at ≥ 96 / ≥ 95. Reject takes whose pitch is > 10 Hz from the reel's median, or with an internal gap > 0.55 s.
4. **Inject the pauses:** Whisper word timestamps align the script's commas to the take; cut at the lowest-energy point within ±100 ms and insert 0.24 s; sentence gaps 0.45–0.7 s; **term reveal, question and beat change 0.8–1.1 s** (reference band). No tempo change after generation.
5. **QA report** per line and for the reel: match %, term hits, pitch, rate (words/s), pause histogram versus the reference, total length. Anything outside the band is re-rolled or the line is rewritten.
6. **Listen** (creator): the numbers cannot hear a wrong stress, a flat question or a "foreign" English word.

## 5. Writing rules for natural Hinglish (what the reference does, checked against the research)

**Sentence shape**
- One idea per sentence; **median 9 words**, rarely > 15. Fragments are allowed for punch ("तीन फ़ैसले।").
- **Define → name → pause:** "…एक घेरा है, जिसे geofence कहते हैं।" and give the term its own pause (0.8–1.2 s) so the picture can land.
- **Ask, then answer.** A rhetorical question gets a rise on its last verb group and a 0.9–1.0 s beat ("इतनी जल्दी कैसे?"). One-word questions work ("और अंडे?").
- **One stressed word per sentence.** Hindi marks focus with a bigger pitch swing and longer duration, then *compresses* what follows, so put the key word early in its clause and do not stack three English terms in a row.
- End statements on a fall; do not end a statement on an English noun that the TTS may lift like a question.

**Code-switching**
- Hindi grammar, **English nouns and terms**: order, store, shelf, scan, forecast. Switch at phrase edges, never mid-verb. About a quarter of the words English is the reference's level.
- Keep the *spoken* form of numbers in the text: "दस minute" (not "10 minute"), "पौने तीन हज़ार" (2,751), "करीब इक्कीस हज़ार करोड़" (₹20,940 crore). Hindi idioms ("पौने तीन", "करीब") sound spoken; digit strings sound read.
- Brand names are said the way Indians say them: ब्लिंकिट, ज़ेप्टो, स्विगी, रॉयटर्स. One spelling per word across the whole script.
- No Roman-letter Hindi anywhere in the TTS input.

**Register**
- Colloquial verbs ("हो चुका होता है", "भगाएँगे"), not literary ones. Address: **आप** by default (the reference uses "तुम"; switch with a find-and-replace if the channel prefers).
- Avoid fillers ("um", "uh") as separate clips (standing repo rule); one inline hesitation at most.

**Breath and timing**
- Plan **3.3 words/s over the whole reel** (articulation ≈ 4.4 w/s plus ~30% silence). Longest unbroken run ≈ 9 s.
- Every claim line is followed by a pause equal to the time the picture needs to show it.

## 6. Pronunciation table for this reel (field B respelling, how it should sound)

| On screen / master (A) | Spoken form (B) | Sounds like | Notes |
|---|---|---|---|
| Blinkit | ब्लिंकिट | BLING-kit | final t, not d (the ASR heard "ब्लिंकिद" in some takes: check by ear) |
| Zepto | ज़ेप्टो | ZEP-to | nukta ज़ |
| Swiggy | स्विगी | SWIG-ee | |
| dark store | डार्क स्टोर | DARK STOR | retroflex ड/ट is the natural Indian rendering |
| geofence | जियोफेंस | JEE-o-fens | the word that failed in every format; 3 syllables |
| PIN code | पिन कोड | pin kod | not "पिंग" |
| forecast / demand | फ़ोरकास्ट / डिमांड | | |
| packer, handheld, barcode, scan | पैकर, हैंडहेल्ड, बारकोड, स्कैन | | |
| pigeonhole | पिजनहोल | PIJ-an-hol | |
| Reuters | रॉयटर्स | ROY-ters | |
| Groceries and more | ग्रोसरीज़ एंड मोर | | |
| like, share, subscribe | लाइक, शेयर और सब्सक्राइब | | |
| Sandesh Explains | संदेश एक्सप्लेन्स | san-DESH ex-PLAINS | the creator's name: say it as they do and keep it fixed |
| ₹20,940 crore / 2,751 | करीब इक्कीस हज़ार करोड़ / पौने तीन हज़ार | | rounded, spoken idiom |

**If the creator's avatar tool is used instead of TTS:** give it the same `B` text plus this table as a PRONUNCIATION block in the prompt (the repo's `check-avatar-prompts.py` rules R1–R18 still apply), keep digits out, and run the returned clips through the same Whisper round trip and pause check.

## 7. What is still unknown

- **No listening test was possible here.** Stress placement, whether the English words sound "Indian enough", the warmth of the voice and the feel of the question rises are unverified.
- The match scores use Whisper, which itself mishears English words in Hindi mode; they are a floor-checker, not a MOS.
- One voice description, one engine; the creator's avatar voice and other engines (Sarvam Bulbul, IndicF5, Parler) were **not** compared. Self-reported claims about them (4.7/5 intelligibility; English WER 0.78 → 0.22 after a fine-tune) are from the projects' own pages.
- The reference was analysed for style only; "tum"-address, pause lengths and rates are *its* choices, which we adopted as a target for this reel.

## 8. Sources
- Sarvam, "Best Practices for Writing Text for TTS" (script split, danda, ellipsis, chunking, numbers): https://docs.sarvam.ai/api-reference-docs/api-guides-tutorials/text-to-speech/best-practices
- Sarvam pronunciation dictionary: https://docs.sarvam.ai/api-reference-docs/api-guides-tutorials/text-to-speech/pronunciation-dictionary
- Code-Mixed TTS under Low-Resource Constraints (Devanagari normalisation): https://arxiv.org/abs/2312.01103
- Speech Synthesis of Code-Mixed Text (Sitaram & Black 2016): https://aclanthology.org/L16-1546/
- Supervised Grapheme-to-Phoneme Conversion of Orthographic Schwas in Hindi and Punjabi (ACL 2020): https://aclanthology.org/2020.acl-main.696
- A Systematic Review of Hindi Prosody: https://arxiv.org/abs/1705.03247 ; Focus, Word Order and Intonation in Hindi (Patil et al.): https://ojs.ub.uni-konstanz.de/jsal/index.php/jsal/article/view/3
- Indian English consonants (ICPhS 2019 v/w status): https://assta.org/proceedings/ICPhS2019/papers/ICPhS_1431.pdf
- Indic Parler-TTS model card: https://huggingface.co/ai4bharat/indic-parler-tts ; Hinglish TTS project: https://github.com/harrrshall/hinglish-tts
- OmniVoice (k2-fsa; inline phoneme/non-verbal syntax, `speed`, `duration`): package source read locally.
