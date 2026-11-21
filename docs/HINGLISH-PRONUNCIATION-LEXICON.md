# Hinglish pronunciation lexicon for the OmniVoice clone (22 Nov 2026)

Measured with `videos/entertainment/video-ramayana-prime-focus-bet/voice/lex_test.py`: each word is spoken in the carrier "सुनिए, <word>, बस यही शब्द बोलना है।" with the liked cloned voice, then heard back by Whisper (hi). **Evidence from a transcriber, not a listen by a person.** Raw results: `voice/lex_results.json`.

## Rule of thumb
The model fails on **Urdu-origin nukta clusters** (`र्ज़`, `ख़्व`) and on **aspirated य-clusters** (`ब्याज`). It does well on everyday Hinglish and English loan words. When a word fails, **swap it for the word a Hinglish speaker would actually say** (सैलरी, इंटरेस्ट, लोन) rather than fighting the spelling.

## Table (spoken form `B` to put in the TTS text)
| Word | Write in B | Heard as | Verdict |
|---|---|---|---|
| debt (karz) | **कर्ज़ा** (or कर्जा) | कर्जा, 100% on 2 seeds | use. `कर्ज़` / `क़र्ज़` were heard as "कर्स" on 4 takes: never use |
| expense | ख़र्चा or खर्चा | खर्चा | ok |
| salary | **सैलरी** | सैलरी | use. तनख़्वाह heard "तन्क्वा": avoid |
| interest | **इंटरेस्ट** (ब्याज heard "भ्याज" both spellings) | to verify in the next take | use |
| loss | घाटा / नुक़सान | ok | ok |
| Prime Focus | प्राइम फ़ोकस | ok | ok |
| VFX | वी एफ़ एक्स | VFX | ok |
| percent / revenue | परसेंट / रेवेन्यू | ok | ok |
| garage | गैराज | गेराज | ok |
| Oscar | ऑस्कर | औसकर (75%) | borderline: listen |
| DNEG | डी-नेग heard "दीनेक"; spelled-out letters failed | | listen; if bad say "डी नेग" or the full name Double Negative (डबल नेगेटिव) |
| strike (hadtaal) | हड़ताल heard "हर्ताल" | | prefer "स्ट्राइक" |
| 1995 | उन्नीस सौ पचानवे | numerals | ok |
| big numbers | write every part ("दो हज़ार आठ सौ पचासी"): the clone dropped "सौ" in "अट्ठाईस सौ पचासी" | | spell fully |

## References for the Hindi side
- क़र्ज़ has two dictionary pronunciations, /kəɾz/ and /qəɾz/ (Persian قرض; Wiktionary mirror, 2023); finance sites also write it *karza*/*karj*.
- Nukta letters (क़ ख़ ग़ ज़ फ़) come from Arabic/Persian loans; everyday speakers often drop the dot, and schwa deletion changes the real sound (Wikipedia: Nuqta; Hindustani orthography; UT Austin Hindi resource).
