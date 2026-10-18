#!/usr/bin/env python3
"""Write avatar-prompts-hi.md and avatar-prompts-en.md from one shared block, so both
languages keep identical identity, framing and performance lines (R2) and differ only in
VOICE, PRONUNCIATION, MOOD and SCRIPT. Check with scripts/check-avatar-prompts.py."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REEL = os.path.dirname(HERE)

HEAD = """Create a photorealistic vertical 15-second talking-head video from the attached photo. The delivery is lively, playful and teasing, like a friend roasting you over chai, then helping. Not an announcer, not a presenter, not cartoonish.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (expressive and playful, never over the top):
- Gaze: warm, steady eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: expressive and playfully sarcastic: amused eyes, a knowing half-smirk on the punchlines, a quick one-sided eyebrow lift on a punchline, then back to a warm neutral. No mugging, no cartoonish faces, no wide-eyed acting, no cheek bunching.
- Head and body: relaxed and alive, small natural head tilts with the jokes. At most two small nods in the whole clip, on key words.
- Hands: subtle, slightly restrained gestures: two or three small, slow movements per clip, low near the chest, then back to rest. Open palm or a gentle 'one point' hand shape only. Natural five-finger hands, no pointing at the camera, no waving, no counting on fingers, no fast or repeated movements.
- Blinks: natural, roughly every 3-5 seconds, none in the first second.
- Mouth: natural speech movement with moderate opening; do not over-articulate."""

VOICE = {
    'hi': "VOICE: speak in HINDI (everyday spoken Hindi; English words like charge, percent, limit, gaming, cover said as Indians say them). Warm, grounded, chest-resonant and teasing; sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement: lighter and higher on a question, lower and a touch slower on the numbers, a short pause just before each punchline, which lands with a little extra bite, never shouted. Slightly brisk pace, statements ending downward. Small human pauses at commas; at most one lightly stressed word per sentence. No announcer tone, no sing-song, no robotic flatness, no filler sounds.",
    'en': "VOICE: speak in ENGLISH with a warm, conversational Indian-English accent. Grounded, chest-resonant and teasing; sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement: lighter and higher on a question, lower and a touch slower on the numbers, a short pause just before each punchline, which lands with a little extra bite, never shouted. Slightly brisk pace, statements ending downward. Small human pauses at commas; at most one lightly stressed word per sentence. No announcer tone, no sing-song, no robotic flatness, no filler sounds.",
}

HOOK = "0-3s ENTHUSIASTIC AND ENGAGING: energetic, a confident teasing grin, a little quicker, a small lean-in, still natural (no shouting, no wide-eyed acting, no head bobbing), dead-on at the lens"
T1 = "TIMING: begin speaking at 0.0 s, no lead-in. Finish by about 14.2 s at the latest (aim for about 12.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
TN = "TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s at the latest (aim for about 12.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
AVOID = "AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, any on-screen text or subtitles."

PARTS = {
    'hi': [
        ("hook: the pillow and the slow cooking (0–15 s)",
         "'तकिये' = 'ta-kee-ye', 'आँच' = 'aanch', 'दुश्मन' = 'dush-man'",
         HOOK + "; 3-7s sarcastic delight, a half-smirk on 'बधाई हो'; 7-12s matter-of-fact, one gentle one-point hand shape on 'दो दुश्मन'.",
         "फ़ोन रात भर तकिये के नीचे चार्ज करते हो? बधाई हो, बैटरी को धीमी आँच पर पका रहे हो। गर्मी और फुल चार्ज: बैटरी के दो दुश्मन।"),
        ("the buffet and the tandoor (15–30 s)",
         "'बुफ़े' = 'boo-fay', 'ठूँसकर' = 'thoons-kar', 'तंदूर' = 'tan-door'",
         "0-5s smug and playful, a slow knowing nod on 'बुफ़े'; 5-10s building teasing energy, one small open-palm gesture on 'मोटा कवर'; 10-13s a short pause, then the punchline with a quick one-sided brow lift on 'तंदूर'.",
         "सौ परसेंट पर घंटों बैठना, बुफ़े के बाद ठूँसकर लेटने जैसा है। ऊपर से चार्जिंग में गेमिंग, मोटा कवर, और तकिया? अब ये फ़ोन नहीं, तंदूर है।"),
        ("the lab numbers and the kebab (30–45 s)",
         "'पैंसठ' = 'pain-sath', 'पच्चीस' = 'pach-chees', 'छियानवे' = 'chhi-yaan-ve', 'कबाब' = 'ka-baab'",
         "0-7s mock-serious lab voice, slower and clear on the numbers, eyebrows level, one gentle one-point hand shape on 'पैंसठ'; 7-10s lighter and curious on the question; 10-13s a short pause, then a grin and a small nod on 'कबाब'.",
         "लैब टेस्ट: चालीस डिग्री, सौ परसेंट पर एक साल, बची पैंसठ परसेंट। पच्चीस डिग्री, चालीस परसेंट पर? छियानवे। आप बैटरी नहीं, कबाब बना रहे हो।"),
        ("the fix and the send (45–60 s)",
         "'इलाज' = 'i-laaj', 'अस्सी' = 'as-see', 'सुलाओ' = 'su-laa-o', 'तंदूर' = 'tan-door'",
         "0-6s warm and genuinely helpful, one small open-palm gesture on 'अस्सी परसेंट'; 6-9s a real, warm smile on 'आप खुश'; 9-13s a cheeky grin and a small lean-in, dead-on at the lens on 'भेजो'.",
         "इलाज सिंपल: अस्सी परसेंट लिमिट ऑन करो, फ़ोन को ठंडी जगह सुलाओ। बैटरी खुश, आप खुश। और ये उस दोस्त को भेजो, जिसका फ़ोन तंदूर में सोता है।"),
    ],
    'en': [
        ("hook: the pillow and the slow cooking (0–15 s)",
         "'pillow' = 'PIL-oh', 'slow-cooking' = 'slow COOK-ing', 'enemies' = 'EN-uh-meez'",
         HOOK + "; 3-7s sarcastic delight, a half-smirk on 'Congratulations'; 7-12s matter-of-fact, one gentle one-point hand shape on 'two worst enemies'.",
         "Charging your phone under the pillow all night? Congratulations. You're slow-cooking your battery, every single night. Heat and a full charge are its two worst enemies."),
        ("the buffet and the oven (15–30 s)",
         "'buffet' = 'boo-FAY', 'oven' = 'UH-vun'",
         "0-5s smug and playful, a slow knowing nod on 'buffet'; 5-10s building teasing energy, one small open-palm gesture on 'a thick case'; 10-13s a short pause, then the punchline with a quick one-sided brow lift on 'oven'.",
         "Sitting at a hundred percent for hours is like lying down after a buffet. Add gaming while charging, a thick case, and a pillow? That's not a phone. That's an oven."),
        ("the lab numbers and the roast (30–45 s)",
         "'sixty-five' = 'SIX-tee FIVE', 'ninety-six' = 'NINE-tee SIX', 'roasting' = 'ROHST-ing'",
         "0-7s mock-serious lab voice, slower and clear on the numbers, eyebrows level, one gentle one-point hand shape on 'sixty-five'; 7-10s lighter and curious on the question; 10-13s a short pause, then a grin and a small nod on 'roasting'.",
         "In a lab test, a year at forty degrees and a hundred percent left sixty-five percent. At twenty-five degrees and forty percent? Ninety-six. You're not charging a battery. You're roasting it."),
        ("the fix and the send (45–60 s)",
         "'eighty' = 'AY-tee', 'oven' = 'UH-vun'",
         "0-6s warm and genuinely helpful, one small open-palm gesture on 'eighty percent'; 6-9s a real, warm smile on 'happy you'; 9-13s a cheeky grin and a small lean-in, dead-on at the lens on 'send this'.",
         "The fix: turn on the eighty percent limit, and let it sleep somewhere cool. Happy battery, happy you. Now send this to the friend whose phone sleeps in an oven."),
    ],
}

INTRO = {
    'hi': "# Avatar prompts: Roast of Your Phone Battery, **Hindi voice (Version H)**",
    'en': "# Avatar prompts: Roast of Your Phone Battery, **English voice (Version E)**",
}

COMMON_NOTES = """
- Use the same photo for every part in **both** language sets: `prototypes/reel-app/public/profile.jpg`. The Hindi and English parts share identical identity, framing and performance lines, so the two renders match.
- Generate **Part 1 first** and review it (hook energy in 0–3 s, playful smirk on the punchline, eyes on the lens) before running the rest.
- Each prompt is under 4000 characters and passes `scripts/check-avatar-prompts.py` (0 FAIL).
- Check every clip for hand artifacts (extra or merged fingers) and regenerate any part that has them. Also check for burned-in subtitles.
- Send the clips back named `p1.mp4`…`p4.mp4` (please say whether they are the Hindi or the English set).
"""


def build(lang):
    rows = [INTRO[lang], COMMON_NOTES, "## Pronunciation table (listen for these in each clip)\n", "| Word | Say it like |", "|---|---|"]
    seen = set()
    for _, pron, _, _ in PARTS[lang]:
        for pair in pron.split(", '"):
            w, say = pair.strip("'").split("' = '")
            if w not in seen:
                seen.add(w)
                rows.append(f"| {w} | {say.strip(chr(39))} |")
    out = "\n".join(rows) + "\n\n"
    for i, (title, pron, mood, script) in enumerate(PARTS[lang], 1):
        body = "\n".join([HEAD, VOICE[lang], f"PRONUNCIATION: {pron}", f"MOOD BY SECTION: {mood}",
                          f'SCRIPT: "{script}"', T1 if i == 1 else TN, AVOID])
        out += f"\n## Part {i} of 4 — {title}\n\n```\n{body}\n```\n\n{len(body)} characters · {len(script.split())} words\n"
    path = os.path.join(REEL, f"avatar-prompts-{lang}.md")
    open(path, "w", encoding="utf8").write(out)
    print(path)


for lang in ("hi", "en"):
    build(lang)
