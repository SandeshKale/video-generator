#!/usr/bin/env python3
"""Write avatar-prompts.md (Hindi, FAST pace R17) for "Wrong UPI transfer: get your money back" (cinematic UPI reel).
Same shared block in every part (R2); parts differ only in PRONUNCIATION, MOOD and SCRIPT.
Check: python3 scripts/check-avatar-prompts.py reels/tech/reel-upi-chai-journey/avatar-prompts.md"""
import os
HERE = os.path.dirname(os.path.abspath(__file__)); REEL = os.path.dirname(HERE)

HEAD = """Create a photorealistic vertical 15-second talking-head video from the attached photo. A calm, serious, helpful explainer: a friend who has seen this go wrong and knows exactly what to do, reassuring but direct. Clear, quick and warm, natural, not an announcer.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (natural and curious):
- Gaze: steady, engaged eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: warm and curious with a faint natural smile that comes and goes; eyebrows move only slightly and only with meaning (a small lift on a question or the key number). Serious and concerned, no smile, when money goes missing. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: alive but controlled micro-movements. At most two small nods in the whole clip, on key words.
- Hands: subtle, slightly restrained gestures: two or three small, smooth movements per clip, low near the chest, then back to rest. Open palm or a gentle 'one point' hand shape only. Natural five-finger hands, no pointing at the camera, no waving, no counting on fingers, no repeated movements.
- Blinks: natural, roughly every 3-5 s, none in the first second.
- Mouth: crisp, accurate lip sync at a brisk speaking rate; clear consonants; do not over-articulate."""

VOICE = "VOICE: speak in HINDI (everyday spoken Hindi; English words like UPI, QR, PIN, NPCI, RBI, app, bank, request, balance said as Indians say them). PACE: FAST AND PUNCHY: brisk, high-energy, clear, very short breath pauses, yet every syllable and number lands clearly; never slurred. Warm, grounded, chest-resonant; sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement: lighter and rising on questions, a split-second pause before the most surprising number, statements ending downward, with at most one lightly stressed word per sentence. Big numbers crisp. No announcer tone, no sing-song, no robotic flatness, no filler sounds."

HOOK = "0-3s ENTHUSIASTIC AND ENGAGING: bright, energetic, serious and sharp, no smile, a small lean-in, still natural (no shouting, no wide-eyed acting, no head bobbing), dead-on at the lens"
T1 = "TIMING: begin speaking at 0.0 s, no lead-in. Finish by about 14.2 s at the latest (aim for about 13.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
TN = "TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s at the latest (aim for about 13.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
AVOID = "AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, slowing down, long pauses, any on-screen text or subtitles."

PARTS = [
    ("hook: ग़लत नंबर पर पाँच हज़ार (0–15 s)",
     "'यूपीआई' = 'YOO-pee-eye', 'आरआरएन' = 'R-R-N', 'कैंसल' = 'CAN-sal', 'पेमेंट' = 'PAY-ment'",
     HOOK + "; 3-9s serious and quick, a brow lift on 'पाँच हज़ार'; 9-14s steady and reassuring, a small nod on 'सेव कर लीजिए'.",
     "रात के ग्यारह बजे आपने पाँच हज़ार रुपये भेजे, और अगले ही सेकंड समझ आया: नंबर किसी और का था। यूपीआई पेमेंट कैंसल नहीं होता। तो अब? चलिए देखते हैं पैसा वापस कैसे आता है, और वो एक नंबर जो आपको सेव कर लेना चाहिए।"),
    ("पहला कदम: रसीद और सीधी बात (15–30 s)",
     "'स्क्रीनशॉट' = 'screen-shot', 'रेफ़रेंस' = 'REF-rence', 'आरआरएन' = 'R-R-N', 'रिफ़ंड' = 'REE-fund'",
     "0-5s calm and clear, one gentle one-point hand shape on 'स्क्रीनशॉट'; 5-10s steady, a small nod on 'आपकी रसीद'; 10-14s warm and practical, one open palm low near the chest on 'नया यूपीआई पेमेंट'.",
     "पहला कदम: स्क्रीनशॉट लीजिए। उसमें बारह अंकों का रेफ़रेंस नंबर होता है, आरआरएन। यही आपकी रसीद है, इसे संभालकर रखिए। फिर जिसे भेजा, अगर वो जान-पहचान का है, तो सीधे उसी से रिफ़ंड माँगिए: नया यूपीआई पेमेंट।"),
    ("ऐप, फिर बैंक (30–45 s)",
     "'चार्जबैक' = 'CHARJ-back', 'क्रेडिट' = 'CRED-it', 'रिपोर्ट अ प्रॉब्लम' = 'ri-PORT uh PROB-lum', 'सहमति' = 'sa-ha-MA-ti'",
     "0-5s clear and steady, a small nod on 'ऐप में शिकायत'; 5-10s practical, one gentle one-point hand shape on 'चार्जबैक'; 10-14s serious and direct, a brow lift on 'सामने वाले की सहमति'.",
     "नहीं माना या अनजान है? ऐप में हेल्प से शिकायत डालिए: रिपोर्ट अ प्रॉब्लम। फिर बैंक में आरआरएन बताकर ग़लत क्रेडिट का चार्जबैक माँगिए। बैंक सामने वाले के बैंक से बात करता है, पर पैसे सिर्फ़ सामने वाले की सहमति से लौटते हैं।"),
    ("आख़िरी रास्ता और चेतावनी (45–60 s)",
     "'एनपीसीआई' = 'EN-P-C-I', 'आरबीआई' = 'R-B-I', 'पिन' = 'pin', 'सब्सक्राइब' = 'sub-SKRIBE', 'Sandesh' = 'sun-DAYSH'",
     "0-5s direct and grounded, a small nod on 'एनपीसीआई'; 5-10s serious, a brow lift on 'कभी पिन नहीं'; 10-14s warm and direct, a faint brief smile only on 'सब्सक्राइब करिए', dead-on at the lens.",
     "फिर भी हल न हो, तो एनपीसीआई की वेबसाइट पर शिकायत डालिए, और तीस दिन बाद आरबीआई के पास जाइए। और याद रखिए: पैसे पाने के लिए कभी पिन नहीं डालना पड़ता। लाइक, शेयर और सब्सक्राइब करिए, Sandesh Explains को।"),
]

INTRO = """# Avatar prompts: "ग़लत नंबर पर पैसे भेज दिए?" (UPI wrong transfer, cinematic reel) — **Hindi voice only** (fast, R17)

- Use the same photo for every part: `prototypes/reel-app/public/profile.jpg`.
- 4 parts of about 15 s = 60 s. **Hindi-only**; everything on screen stays English with English subtitles.
- **FAST mode (R17)** in Hindi: ~40–46 words per 15 s part. Generate **Part 1 first** and check the pace is brisk but every number (पाँच हज़ार, बारह अंकों, तीस दिन) is clear before running the rest. If the tool cuts a sentence off, tell me and I will shorten the line.
- Mood follows the content (R18): tense and serious about the lost money, calm and practical through the steps, a faint smile only on the final सब्सक्राइब line.
- The last part ends with the Hindi-reel YouTube CTA: **लाइक, शेयर और सब्सक्राइब करिए, Sandesh Explains को।**
- Each prompt is under 4000 characters and passes `scripts/check-avatar-prompts.py`.
- Check every clip for hand artifacts and burned-in subtitles; regenerate any part that has them.
- Send the clips back named `p1.mp4`…`p4.mp4`.
- "Sandesh Explains" stays in English letters so the tool says it as the channel name.
"""

def build():
    rows = [INTRO, "## Pronunciation table (listen for these in each clip)\n", "| Word | Say it like |", "|---|---|"]
    seen = set()
    for _, pron, _, _ in PARTS:
        for pair in pron.split(", '"):
            w, say = pair.strip("'").split("' = '")
            if w not in seen:
                seen.add(w); rows.append(f"| {w} | {say.strip(chr(39))} |")
    out = "\n".join(rows) + "\n\n"
    for i, (title, pron, mood, script) in enumerate(PARTS, 1):
        body = "\n".join([HEAD, VOICE, f"PRONUNCIATION: {pron}", f"MOOD BY SECTION: {mood}", f'SCRIPT: "{script}"', T1 if i == 1 else TN, AVOID])
        out += f"\n## Part {i} of 4 — {title}\n\n```\n{body}\n```\n\n{len(body)} characters · {len(script.split())} words\n"
    p = os.path.join(REEL, "avatar-prompts.md"); open(p, "w", encoding="utf8").write(out); print(p)
build()
