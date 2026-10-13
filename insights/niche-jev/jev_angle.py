"""Pick the angle inside the winning niche."""
import json, random, sys
sys.path.insert(0, '.')
from jev_niche import CREATOR, PLATFORM
from typesafe_sdk import TypeSafeClient, Choice, Score
A = {
 "cosmic_awe": "Science awe at big scales: space, black holes, the size of the universe, deep time.",
 "everyday_you": "Science of everyday things and your own body and brain: what happens inside you when you crack a knuckle, why you remember songs, how a microwave or a phone actually works. Explains research, never gives health advice.",
 "engineering_inside": "How machines and megastructures work inside: engines, chips, dams, rockets, cut-away 3D views.",
 "what_if": "Hypothetical science scenarios: what if the Moon vanished, what if you fell into Earth's core.",
 "psychology_advice": "Psychology self-improvement advice: how to stop procrastinating, fix habits, handle anxiety.",
}
c = TypeSafeClient(); out = []
for seed in range(3):
  keys = list(A); random.Random(seed).shuffle(keys)
  d = json.loads(c.system_one(model="jev-latest", state={"creator": CREATOR, "platform_facts": PLATFORM, "angles": {k: A[k] for k in keys}},
      questions={"best": Choice(instructions="Which ONE content angle will get the most SENDS/shares and follows from non-followers for this creator's new science-explainer channels, while staying monetizable?", criteria={k: k for k in keys})}).model_dump_json())["answers"]["best"]
  out.append(d); print(seed, d["choice"], {k: round(v, 3) for k, v in sorted(d["probabilities"].items(), key=lambda x: -x[1])})
for k, v in A.items():
  d = json.loads(c.system_one(model="jev-latest", state={"creator": CREATOR, "angle": v},
      questions={"share": Score(instructions="How likely is a viewer to send a well-made short with this angle to a friend?", criteria=["very low","low","moderate","high","very high"])}).model_dump_json())["answers"]["share"]
  out.append({k: d}); print(k, round(d["score"], 2))
json.dump(out, open(sys.argv[1], "w"), indent=1)
