"""Bias check: facts-only sheets (no 'pipeline fit' verdicts or adjectives) for the 5 contenders, plus a money-first framing."""
import json, random, sys
sys.path.insert(0, '.')
from jev_niche import CREATOR, PLATFORM
from typesafe_sdk import TypeSafeClient, Choice
N = {
 "ai_tools": "AI tool reviews and hacks. Affiliate programs: Jasper 25-30%, ElevenLabs 20-22%, Synthesia 25%, HeyGen 20%, recurring 12 months. Large AI creators cover the same launches the same day. Tools change monthly. This creator's 21 AI reels: 0 shares, 185 median views.",
 "personal_finance": "Personal finance education. Long-form CPM estimated $15-50; Shorts finance RPM $0.15-0.25 (US). YouTube does not monetize AI personas giving finance advice. SEBI removed 70,000+ posts/accounts since Oct 2024 and bars regulated entities from tie-ups with unregistered advice-givers.",
 "psychology": "Psychology and self-improvement explainers. Psych2Go (animated) about 13.1M subscribers. Mental-health advice by an AI persona is not monetizable on YouTube. Monetization mostly digital products and app affiliates.",
 "science": "Science and how-things-work explainers. Zack D. Films (animated shorts) about 27.7M subscribers; Kurzgesagt about 25M; Infographics Show about 14-15M. Education & Science long-form median RPM $10.22 (AIR 2026); Shorts education RPM $0.08-0.15 (US). Requires 3D/animation production.",
 "history": "History and what-if stories. Large faceless genre. AI story and fake-trailer channels were among those YouTube terminated in Jan 2026. Requires accuracy and original visuals.",
}
c = TypeSafeClient(); out = []
prompts = {
 "growth": "Which ONE niche gives this creator the best chance of maximum engagement and follower growth on new Reels/Shorts/TikTok channels?",
 "money": "Which ONE niche gives this creator the most money in the first 12 months, given the platform and regulatory facts?",
}
for name, ins in prompts.items():
  for seed in range(3):
    keys = list(N); random.Random(seed).shuffle(keys)
    d = json.loads(c.system_one(model="jev-latest", state={"creator": CREATOR, "platform_facts": PLATFORM, "candidate_niches": {k: N[k] for k in keys}},
        questions={"best": Choice(instructions=ins, criteria={k: k for k in keys})}).model_dump_json())["answers"]["best"]
    out.append({"framing": name, "seed": seed, **d})
    print(name, seed, d["choice"], {k: round(v, 3) for k, v in sorted(d["probabilities"].items(), key=lambda x: -x[1])})
json.dump(out, open(sys.argv[1], "w"), indent=1)
