#!/usr/bin/env python3
"""Write avatar-prompts.md (English, FAST pace R17) for "Where did your 20 rupees go?" (UPI chai journey).
Same shared block in every part (R2); parts differ only in PRONUNCIATION, MOOD and SCRIPT.
Check: python3 scripts/check-avatar-prompts.py reels/tech/reel-upi-chai-journey/avatar-prompts.md"""
import os
HERE = os.path.dirname(os.path.abspath(__file__)); REEL = os.path.dirname(HERE)

HEAD = """Create a photorealistic vertical 15-second talking-head video from the attached photo. A curious, friendly explainer: a friend at a chai stall showing you what really happens when you tap Pay. Clear, quick and warm, natural, not an announcer.
IDENTITY: match the photo exactly in every frame (face shape, eyes, nose, mouth, jaw, skin texture, hair, beard, glasses, apparent age). No beautifying, slimming or airbrushing. If no clear face is visible, do not generate.
FRAMING: vertical medium close-up from mid-chest up, hands visible near the lower edge when they move, eyes in the upper third, camera locked on a tripod (no zoom, pan or shake). Soft cinematic key light with gentle fill on a black background with depth. Attire: exactly as in the photo, static. Keep framing, light and attire identical across all parts.
PERFORMANCE (natural and curious):
- Gaze: steady, engaged eye contact with the lens; tiny natural eye movements that always return to the lens. Never stare, never look away.
- Face: warm and curious with a faint natural smile that comes and goes; eyebrows move only slightly and only with meaning (a small lift on a question or the key number). Serious and concerned, no smile, when money goes missing. No wide smiles, no raised-brow acting, no cheek bunching.
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
    ("hook: your twenty rupees (0–15 s)",
     "'UPI' = 'YOO-pee-eye', 'rupees' = 'roo-PEEZ', 'chai' = 'chye'",
     HOOK + "; 3-9s curious and quick, a brow lift on 'four systems'; 9-14s clear and friendly, a small nod on 'remember its ID number'.",
     "You just paid twenty rupees for chai. In the next few seconds that payment crosses four systems, and over eight hundred million UPI payments do the same every day. Let's slow it down and follow yours. Remember its ID number, because you'll need it at the end."),
    ("the request and the switch (15–30 s)",
     "'NPCI' = 'EN-P-C-I', 'QR' = 'Q-R', 'chai wala' = 'chye WAH-lah'",
     "0-5s clear and explanatory, one gentle one-point hand shape on 'You tap Pay'; 5-10s curious, a brow lift on 'the middle of everything'; 10-14s grounded, a small nod on 'passes messages between banks'.",
     "You tap Pay. Your app sends one request: twenty rupees, from you, to the chai wala's QR. It goes to a bank, then to the middle of everything, the NPCI switch. It doesn't hold your money. It only passes messages between banks."),
    ("debit, credit, green tick (30–45 s)",
     "'debit' = 'DEB-it', 'balance' = 'BAL-uns'",
     "0-5s clear and steady, one open palm low near the chest on 'take twenty rupees'; 5-10s steady, a small nod on 'says yes'; 10-14s light and satisfied, a faint smile on 'green tick'.",
     "Message one goes to your bank: take twenty rupees. It checks your balance and your PIN, and says yes. Message two goes to the chai wala's bank: add twenty rupees. Another yes. Both come back the same road, and your phone shows the green tick."),
    ("the catch and the follow (45–60 s)",
     "'RBI' = 'R-B-I', 'Sandesh' = 'sun-DAYSH', 'reversed' = 'ri-VERST'",
     "0-5s concerned and serious, no smile, a brow lift on 'never answers'; 5-10s direct and grounded, a small nod on 'reversed'; 10-14s warm and direct, a faint brief smile only on 'Follow Sandesh Explains', dead-on at the lens.",
     "But sometimes your bank says yes and the other side never answers. Money gone, nothing paid. That's when you need that ID. Under RBI's rules it must be reversed within five days, or the bank owes you a hundred rupees a day. Save this. Follow Sandesh Explains."),
]

INTRO = """# Avatar prompts: "Where did your 20 rupees go?" (UPI chai journey, fast English voice, R17)

- Use the same photo for every part: `prototypes/reel-app/public/profile.jpg`.
- **FAST mode (R17):** about 3 words a second, ~44 words per 15 s part. Generate **Part 1 first**, check the pace is brisk but every number is clear, then run the rest. If the tool cuts a sentence off, tell me and I will shorten the line.
- Mood follows the content (R18): friendly and curious for the journey, serious (no smile) when the money goes missing, a faint smile only on the final CTA.
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
