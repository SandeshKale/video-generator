"""Score candidate topics for the first 10 science reels."""
import json, sys
sys.path.insert(0, '.')
from jev_niche import CREATOR
from typesafe_sdk import TypeSafeClient, Score
T = {
 "knuckle_crack": "What actually happens when you crack your knuckles: a gas cavity forms in the joint fluid (MRI study); a doctor cracked one hand for 60 years and found no arthritis difference.",
 "phone_cold": "Why your phone dies faster in the cold: lithium ions move slower, internal resistance rises, the phone shuts down early even with charge left.",
 "cells_replaced": "You replace about 330 billion of your cells every day, nearly 4 million every second; the 'new body every 7 years' idea is a myth.",
 "bacteria_ratio": "The '10 bacteria for every human cell' claim is wrong: it is about 1.3 to 1, and one bowel movement can tip the ratio.",
 "tickle_self": "Why you can't tickle yourself: your brain predicts your own touch and cancels it.",
 "onion_tears": "Why onions make you cry: cutting releases an enzyme that makes a tear gas molecule, discovered in 2002.",
 "microwave": "How a microwave really heats food: it spins water molecules billions of times a second; it doesn't heat from the inside out.",
 "hiccups": "Hiccups may be a leftover from our fish/amphibian ancestors' gill breathing; your vocal cords snap shut 35 ms after the diaphragm jerks.",
 "goosebumps": "Goosebumps aren't useless: the same muscles and nerves tell hair follicle stem cells to grow hair (2020 study).",
 "wrinkly_fingers": "Wrinkly fingers in the bath are not water soaking in: your nerves cause them, and they may improve grip on wet things.",
 "voice_recording": "Why your voice sounds weird on recordings: you normally hear yourself through your skull bones, which makes it sound deeper.",
 "brain_freeze": "What brain freeze actually is: a blood vessel behind your face swells suddenly when cold hits the roof of your mouth.",
 "noise_cancel": "How noise-cancelling headphones erase sound: they play the exact opposite sound wave.",
 "touchscreen_gloves": "Why your touchscreen ignores gloves: it senses the electric charge of your skin, not pressure.",
 "sun_light_age": "The sunlight on your skin left the Sun 8 minutes ago, but the energy took tens of thousands of years to escape the Sun's core.",
 "sun_size": "About 1.3 million Earths would fit inside the Sun.",
 "stardust": "Almost every atom in your body heavier than hydrogen was made inside a star.",
 "brain_sleep_clean": "Your brain may wash itself while you sleep, but scientists now disagree about it.",
 "yawn_contagious": "Why yawns are contagious, and why scientists still argue about it.",
 "static_shock": "Why you get shocked touching a door handle in winter: dry air lets charge build up on you.",
 "eye_blind_spot": "Every eye has a blind spot where the optic nerve exits; your brain paints over the hole with a guess.",
 "pins_needles": "What 'pins and needles' really is: a squeezed nerve misfiring as blood flow returns.",
}
c = TypeSafeClient(); out = {}
L = ["very low", "low", "moderate", "high", "very high"]
qs = {
 "send": Score(instructions="How likely is a viewer to SEND a well-made 25-second short on this topic to a friend or family member?", criteria=L),
 "stop": Score(instructions="How likely is the opening claim to stop a scrolling stranger in the first 3 seconds?", criteria=L),
 "visual": Score(instructions="How strong a visual payoff can 3D cut-away animation and motion graphics give this topic (no real footage)?", criteria=L),
 "surprise": Score(instructions="How surprising is this to an average adult?", criteria=L),
}
for k, v in T.items():
  a = json.loads(c.system_one(model="jev-latest", state={"creator": CREATOR, "topic": v}, questions=qs).model_dump_json())["answers"]
  out[k] = {q: round(a[q]["score"], 2) for q in qs}
  out[k]["total"] = round(.35*out[k]["send"] + .3*out[k]["stop"] + .2*out[k]["visual"] + .15*out[k]["surprise"], 2)
for k, v in sorted(out.items(), key=lambda x: -x[1]["total"]): print(f"{k:20s}", v)
json.dump(out, open(sys.argv[1], "w"), indent=1)
