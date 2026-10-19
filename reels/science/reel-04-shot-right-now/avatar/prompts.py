#!/usr/bin/env python3
"""Write avatar-prompts.md (English, FAST pace, R17) for "You're being shot right now" from one shared block, so every part
keeps identical identity, framing and performance lines (R2) and differs only in PRONUNCIATION, MOOD and SCRIPT.
Check with: python3 scripts/check-avatar-prompts.py reels/science/reel-04-shot-right-now/avatar-prompts.md"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REEL = os.path.dirname(HERE)

HEAD = """Create a photorealistic vertical 15-second talking-head video from the attached photo. A fast, amazed science explainer: a friend who just learned something wild about physics. Quick and electric, but natural, not an announcer.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (expressive and playful, never over the top):
- Gaze: steady, engaged eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: lively and amazed, with bright eyes, a quick genuine smile and a short brow lift on the surprising numbers, then back to warm neutral. No mugging, no cartoonish faces, no wide-eyed acting, no cheek bunching.
- Head and body: alive but controlled micro-movements. At most two small nods in the whole clip, on key words.
- Hands: subtle, slightly restrained gestures: two or three small, smooth movements per clip, low near the chest, then back to rest. Open palm or a gentle 'one point' hand shape only. Natural five-finger hands, no pointing at the camera, no waving, no counting on fingers, no repeated movements.
- Blinks: natural, roughly every 3-5 s, none in the first second.
- Mouth: crisp, accurate lip sync at a fast speaking rate; clear consonants; do not over-articulate."""

VOICE = "VOICE: speak in ENGLISH with a natural Indian accent. PACE: FAST AND PUNCHY: rapid, high-energy, about three and a half words per second, very short breath pauses, yet every syllable and number lands clearly; never slurred. Warm, grounded, chest-resonant; sounds close to a good microphone in a quiet room (dry, no echo or reverb). Natural pitch movement: lighter and rising on questions, a split-second pause before the most surprising number, statements ending downward. Big numbers crisp; at most one lightly stressed word per sentence. No announcer tone, no sing-song, no robotic flatness, no filler sounds."

HOOK = "0-3s ENTHUSIASTIC AND ENGAGING: bright, energetic, a confident open smile, quick, a small lean-in, still natural (no shouting, no wide-eyed acting, no head bobbing), dead-on at the lens"
T1 = "TIMING: begin speaking at 0.0 s, no lead-in. Finish by about 14.2 s at the latest (aim for about 13.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
TN = "TIMING: begin speaking at about 0.3 s. Finish by about 14.2 s at the latest (aim for about 13.5 s), every sentence fully completed; then rest silently with a relaxed closed mouth until 15 s."
AVOID = "AVOID: morphing, identity drift, flicker, jaw drop, teeth distortion, plastic skin, exaggerated expressions, glitchy lip sync, slowing down, long pauses, any on-screen text or subtitles."

PARTS = [
    ("hook: neutrinos through your thumbnail (0–15 s)",
     "'neutrinos' = 'new-TREE-nos', 'centimetre' = 'SEN-ti-mee-ter'",
     HOOK + "; 3-9s fast and amazed, a quick brow lift on 'Sixty-five billion'; 9-14s playful and conspiratorial, a faint smile on 'through your bed'.",
     "In the time you took to read this, a hundred billion particles shot through your thumbnail. Neutrinos. Sixty-five billion per square centimetre, every second, straight from the Sun's core. And at night? They come up through the Earth, through your bed, through you."),
    ("muons and Einstein (15–30 s)",
     "'muons' = 'MYOO-ons', 'microseconds' = 'MY-kro-seconds', 'Einstein' = 'INE-stine'",
     "0-6s quick and vivid, one open-palm gesture low near the chest on 'rain down muons'; 6-11s puzzled then delighted, a short brow lift on 'Why?'; 11-14s confident, a small nod on 'every second'.",
     "Now look up. Fifteen kilometres above you, cosmic rays smash into air and rain down muons. A muon lives two microseconds, so it should die within a kilometre. Yet it reaches you. Why? Einstein. Near light speed, its clock slows down. One crosses your palm every second."),
    ("you are radioactive + space dust (30–45 s)",
     "'potassium' = 'puh-TASS-ee-um', 'radioactivity' = 'ray-dee-oh-ak-TIV-i-tee', 'kilometres' = 'KIL-oh-mee-ters'",
     "0-6s surprised and playful, a quick genuine smile on 'bananas'; 6-14s fast and impressed, one gentle one-point hand shape on 'seventy kilometres per second'.",
     "Now look inside you. Every second, about four thousand potassium atoms in your body decay. That's the radioactivity of over two hundred and fifty bananas. Meanwhile, Earth sweeps up forty-four tonnes of space dust a day, slamming in at up to seventy kilometres per second."),
    ("you are not sitting still + follow (45–60 s)",
     "'galaxy' = 'GAL-uk-see', 'Sandesh' = 'sun-DAYSH'",
     "0-5s teasing, a quick brow lift on 'sitting still'; 5-10s building speed and energy, one open-palm gesture on 'eight hundred thousand'; 10-14s warm and direct, a small lean-in, dead-on at the lens, a small nod on 'Follow'.",
     "And you think you're sitting still? You're spinning at sixteen hundred kilometres an hour, orbiting the Sun at a hundred and seven thousand, and racing around the galaxy at over eight hundred thousand. All of this, right now, to you. Follow Sandesh Explains."),
]

INTRO = """# Avatar prompts: "You're being shot right now" (fast English voice, R17)

- Use the same photo for every part: `prototypes/reel-app/public/profile.jpg`.
- **This reel runs in FAST mode (R17)**, as you asked: about 3.5 words a second, ~45 words per 15 s part. Generate **Part 1 first** and check that the pace is fast but every number is still clear before running the rest. If the tool cuts a sentence off, tell me and I'll trim that part by 3–4 words.
- Each prompt is under 4000 characters and passes `scripts/check-avatar-prompts.py` (0 FAIL).
- Check every clip for hand artifacts (extra or merged fingers) and for burned-in subtitles; regenerate any part that has them.
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
