#!/usr/bin/env python3
"""Write avatar-prompts.md (English, FAST pace, R17) for "You're being shot right now" from one shared block, so every part
keeps identical identity, framing and performance lines (R2) and differs only in PRONUNCIATION, MOOD and SCRIPT.
Check with: python3 scripts/check-avatar-prompts.py reels/science/reel-04-shot-right-now/avatar-prompts.md"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REEL = os.path.dirname(HERE)

HEAD = """Create a photorealistic vertical 15-second talking-head video from the attached photo. A fast, sassy Bollywood-gossip explainer: a friend leaning in over chai with the juicy part, then the real fact. Quick, knowing and playful, but natural, not an announcer.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (expressive and playful, never over the top):
- Gaze: steady, engaged eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: lively and knowing, with bright eyes, a short brow lift on the juicy beats, then back to a serious, composed neutral. Serious topic (a person's face and voice misused): no smiling or laughing, except a faint brief smile on the last line. No mugging, no cartoonish faces, no wide-eyed acting, no cheek bunching.
- Head and body: alive but controlled micro-movements. At most two small nods in the whole clip, on key words.
- Hands: subtle, slightly restrained gestures: two or three small, smooth movements per clip, low near the chest, then back to rest. Open palm or a gentle 'one point' hand shape only. Natural five-finger hands, no pointing at the camera, no waving, no counting on fingers, no repeated movements.
- Blinks: natural, roughly every 3-5 s, none in the first second.
- Mouth: crisp, accurate lip sync at a fast speaking rate; clear consonants; do not over-articulate."""

VOICE = "VOICE: speak in ENGLISH with a natural Indian accent. PACE: FAST AND PUNCHY: rapid, high-energy, about three and a half words per second, very short breath pauses, yet every syllable and number lands clearly; never slurred. Warm, grounded, chest-resonant; sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement: lighter and rising on questions, a split-second pause before the most surprising number, statements ending downward. Big numbers crisp; at most one lightly stressed word per sentence. No announcer tone, no sing-song, no robotic flatness, no filler sounds."

HOOK = "0-3s ENTHUSIASTIC AND ENGAGING: bright, energetic, serious and sharp, no smile, quick, a small lean-in, still natural (no shouting, no wide-eyed acting, no head bobbing), dead-on at the lens"
T1 = "TIMING: begin speaking at 0.0 s, no lead-in. Finish by about 14.2 s at the latest (aim for about 13.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
TN = "TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s at the latest (aim for about 13.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
AVOID = "AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, slowing down, long pauses, any on-screen text or subtitles."

PARTS = [
    ("hook: a judge says take her face down (0–15 s)",
     "'Samantha' = 'suh-MAN-thuh', 'Prabhu' = 'PRUH-boo', 'Bombay' = 'BOM-bay', 'deepfakes' = 'DEEP-fakes'",
     HOOK + "; 3-9s fast and incredulous, a quick brow lift on 'her face and her voice'; 9-14s crisp and firm, a small decisive nod on 'Hers'.",
     "A judge just told the internet: take her face down. Samantha Ruth Prabhu went to Bombay High Court on October first, because AI deepfakes of her face and her voice were everywhere. The interim order? Remove them. Her name, her image, her voice. Hers."),
    ("she is not alone (15–30 s)",
     "'Preity Zinta' = 'PREE-tee ZIN-tuh', 'chatbots' = 'CHAT-bots', 'Meta' = 'MEH-tuh'",
     "0-5s knowing and serious, a brow lift on 'not alone'; 5-11s quick and incredulous, one open-palm gesture low near the chest on 'two hundred seventy-five links'; 11-14s grounded, a small nod on 'same shield'.",
     "And she's not alone. In July, Preity Zinta got the same order from the same court. Two hundred seventy-five links: deepfakes, morphed photos, AI chatbots pretending to be her. Google, Meta and X had to pull them. Bollywood's big names are queuing for the same shield."),
    ("what personality rights are (30–45 s)",
     "'personality' = 'per-suh-NAL-i-tee', 'interim' = 'IN-ter-im', 'December' = 'dih-SEM-ber'",
     "0-5s explanatory and sharp, one gentle one-point hand shape on 'Personality rights'; 5-11s clear and grounded, a small nod on 'without asking'; 11-14s a touch of drama, a short brow lift on 'interim'.",
     "So what is it? Personality rights. Your face, your name, your voice are yours. No AI company gets to sell them without asking. Careful though, this order is interim, not final. The next hearing is in December. The fight isn't over."),
    ("the twist + follow (45–60 s)",
     "'Sandesh' = 'sun-DAYSH', 'clone' = 'klohn'",
     "0-5s dry and direct, a quick brow lift on 'needs a lawyer'; 5-10s warm and serious, a small lean-in on 'can be cloned too'; 10-14s direct and warm, a faint brief smile only on 'Follow Sandesh Explains', dead-on at the lens.",
     "Here's the twist. A star needs a lawyer. You don't have one. But your voice can be cloned too, from just a few seconds of audio. Before you post that voice note, think twice. Follow Sandesh Explains."),
]

INTRO = """# Avatar prompts: "A judge just told the internet: take her face down" (fast English voice, R17)

- Use the same photo for every part: `prototypes/reel-app/public/profile.jpg`.
- **FAST mode (R17):** about 3.5 words a second, ~45 words per 15 s part. Generate **Part 1 first** and check the pace is fast but every name and number is clear before running the rest. If the tool cuts a sentence off, tell me and I will shorten the line.
- 4 parts. Each prompt is under 4000 characters and passes `scripts/check-avatar-prompts.py` (0 FAIL).
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
    path = os.path.join(REEL, "avatar-prompts.md")
    open(path, "w", encoding="utf8").write(out)
    print(path)


build()
