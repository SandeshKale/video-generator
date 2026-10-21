#!/usr/bin/env python3
"""Write avatar-prompts.md (English, FAST pace R17) for "What did Ramayana's 4,000 crore buy?".
Same shared block in every part (R2); parts differ only in PRONUNCIATION, MOOD and SCRIPT.
Check: python3 scripts/check-avatar-prompts.py reels/tech/reel-ramayana-trivia/avatar-prompts.md"""
import os
HERE = os.path.dirname(os.path.abspath(__file__)); REEL = os.path.dirname(HERE)

HEAD = """Create a photorealistic vertical 15-second talking-head video from the attached photo. A curious, friendly trivia explainer: a friend sharing surprising, true facts about a big upcoming film, respectfully. Clear, quick and warm, natural, not an announcer.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (natural and curious):
- Gaze: steady, engaged eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: warm and curious with a faint natural smile that comes and goes; eyebrows move only slightly and only with meaning (a small lift on a question or the key number). Respectful and even-handed about the film and the people in it. No wide smiles, no raised-brow acting, no cheek bunching.
- Head and body: alive but controlled micro-movements. At most two small nods in the whole clip, on key words.
- Hands: subtle, slightly restrained gestures: two or three small, smooth movements per clip, low near the chest, then back to rest. Open palm or a gentle 'one point' hand shape only. Natural five-finger hands, no pointing at the camera, no waving, no counting on fingers, no repeated movements.
- Blinks: natural, roughly every 3-5 s, none in the first second.
- Mouth: crisp, accurate lip sync at a brisk speaking rate; clear consonants; do not over-articulate."""

VOICE = "VOICE: speak in ENGLISH with a natural Indian accent. PACE: FAST AND PUNCHY: brisk, high-energy, about three words per second, very short breath pauses, yet every syllable and number lands clearly; never slurred. Warm, grounded, chest-resonant; sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement: lighter and rising on questions, a split-second pause before the most surprising number, statements ending downward. Big numbers crisp; at most one lightly stressed word per sentence. No announcer tone, no sing-song, no robotic flatness, no filler sounds."

HOOK = "0-3s ENTHUSIASTIC AND ENGAGING: bright, energetic, a confident open smile, a little quicker, a small lean-in, still natural (no shouting, no wide-eyed acting, no head bobbing), dead-on at the lens"
T1 = "TIMING: begin speaking at 0.0 s, no lead-in. Finish by about 14.2 s at the latest (aim for about 13.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
TN = "TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s at the latest (aim for about 13.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
AVOID = "AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, slowing down, long pauses, any on-screen text or subtitles."

PARTS = [
    ("hook: what did four thousand crore buy? (0–15 s)",
     "'Ramayana' = 'rah-MAH-yuh-nuh', 'crore' = 'kror', 'rupees' = 'roo-PEEZ', 'Yash' = 'yash'",
     HOOK + "; 3-9s curious and brisk, a brow lift on 'both parts'; 9-14s clear and playful, a small nod on 'one I measured myself'.",
     "The Ramayana's budget is reportedly four thousand crore rupees. But Yash says that covers both parts, plus effects, worldwide release and marketing. So what did the money buy? Four things you can see and hear, and one I measured myself."),
    ("the cast (15–30 s)",
     "'Arun Govil' = 'uh-RUN GOH-vil', 'Dasharatha' = 'duh-suh-RUH-thuh', 'Ranbir' = 'RUN-beer', 'Sai Pallavi' = 'sigh puh-LUH-vee', 'Ravana' = 'RAH-vuh-nuh'",
     "0-5s curious, a brow lift on 'played Rama'; 5-10s steady, a small nod on 'Rama's father'; 10-14s light and clear, one open palm low near the chest on 'who is also a producer'.",
     "First, the cast. Arun Govil played Rama in the nineteen eighty-seven TV Ramayan. Now he plays Rama's father, Dasharatha. Ranbir Kapoor is Rama, Sai Pallavi is Sita, and Yash, who is also a co-producer of the film, plays Ravana."),
    ("sound and action (30–45 s)",
     "'Hans Zimmer' = 'hans ZIM-er', 'Rahman' = 'RAH-mun', 'Terry Notary' = 'TERRY NOH-tuh-ree', 'Guy Norris' = 'guy NOR-iss', 'Furiosa' = 'fyoo-REE-oh-suh'",
     "0-5s clear and steady, a brow lift on 'first Indian mythological saga'; 5-10s grounded, a small nod on 'terrifying'; 10-14s brisk, one gentle one-point hand shape on 'Mad Max'.",
     "Second, the sound: Hans Zimmer and A. R. Rahman. Zimmer says it's his first Indian mythological saga, and Rahman called scoring it terrifying. Third, the action: Terry Notary trained Ranbir, and Guy Norris, of Mad Max Furiosa, is the stunt director."),
    ("the measured one and the follow (45–60 s)",
     "'Sandesh' = 'sun-DAYSH', 'Ravana' = 'RAH-vuh-nuh', 'Rama' = 'RAH-muh'",
     "0-5s direct and curious, a brow lift on 'the one I measured'; 5-10s grounded, a small nod on 'thirty-four seconds'; 10-14s warm and direct, a faint brief smile only on 'Follow Sandesh Explains', dead-on at the lens.",
     "Now the one I measured. I checked the October fifteenth trailer frame by frame. Ravana is named thirty-four seconds before Rama, and Rama's entrance is the darkest stretch. Did the hero arrive last on purpose? Comment. Follow Sandesh Explains."),
]

INTRO = """# Avatar prompts: "What did Ramayana's ₹4,000 crore buy?" (Ramayana movie trivia, fast English voice, R17)

- Use the same photo for every part: `prototypes/reel-app/public/profile.jpg`.
- **FAST mode (R17):** about 3 words a second, ~44 words per 15 s part. Generate **Part 1 first**, check the pace is brisk but every number is clear, then run the rest. If the tool cuts a sentence off, tell me and I will shorten the line.
- Mood follows the content (R18): curious and light for film trivia; respectful of the epic and of the people named (no mocking, no spoilers or insults); a faint smile only on the final CTA.
- 4 parts. Each prompt is under 4000 characters and passes `scripts/check-avatar-prompts.py`.
- Check every clip for hand artifacts and burned-in subtitles; regenerate any part that has them.
- Send the clips back named `p1.mp4`…`p4.mp4`.
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
