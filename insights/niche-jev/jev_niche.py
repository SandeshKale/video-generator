"""Ask TypeSafe Jev to rate candidate niches from researched fact sheets.

Run: TYPESAFE_API_KEY=... python -I jev_niche.py out.json
"""
import json, random, sys
from typesafe_sdk import TypeSafeClient, Choice, Score, Noul

CREATOR = (
    "Creator: one person based in India (IST), English-language content. Existing Instagram account @sandesh.explains: "
    "6 followers, 21 AI-news/AI-tutorial reels in 5 weeks, median 185 views, median 75% skip in first 3 s, median 4.5 s "
    "average watch on 60-96 s reels, 0 shares on every reel, saves only on how-to reels. "
    "Production pipeline (strong): deterministic code-rendered motion graphics, data-visualisation components, Blender 3D "
    "objects and rooms, photoreal AI stills with depth-parallax camera moves, mocap-driven 2D figures, illustrated characters, "
    "cloned voice of the creator and an AI avatar of the creator, synthesized music and SFX. Each video takes hours of CPU. "
    "Pipeline (weak): no real camera footage, no real food, no real people or family, no live sports footage, no real "
    "photography portfolio. New channels planned on Instagram Reels, YouTube Shorts and TikTok."
)

PLATFORM = (
    "Platform facts (Oct 2026): TikTok has been banned in India since June 2020 and the ban was still in force per Aug 2025 "
    "reporting; TikTok Creator Rewards requires 10k followers, videos over 1 minute and residence in eligible countries "
    "(US, UK, DE, FR, BR, MX, CA etc., not India). YouTube clarified on 16 Jul 2026 that these are not monetizable: "
    "template-based near-identical videos, emotionally manipulative content, and AI personas giving health, finance, legal or "
    "medical advice; enforcement reviews whole channels; 16 AI-heavy channels with 35M subscribers were terminated or wiped "
    "in Jan 2026. YouTube Shorts RPM ranges $0.02-$1.48 by niche (AIR, 274 channels); Shorts RPM for India-audience channels "
    "is roughly INR 5-30; a US view is worth roughly 5-15x an India view. Instagram: sends per reach is the strongest signal "
    "for reaching non-followers (Mosseri), April 2026 originality rules demote reposted/unoriginal content, max 5 hashtags. "
    "Industry engagement benchmarks: Rival IQ all-industry Instagram median 0.36%, higher education 2.1%; Socialinsider "
    "overall Instagram 0.45% (Q2 2026); DashSocial views-based engagement: food & beverage about 2.5%, health & wellness "
    "about 1.8%, children & baby about 1.6%. Per-niche Reels engagement figures such as 'education 3.8%' or 'volleyball "
    "5.9%' could not be traced to a primary study."
)

NICHES = {
    "ai_tools": (
        "AI tools reviews and hacks (e.g. 'this AI tool does X in Y seconds'). Affiliate programs pay 20-30% recurring for "
        "12 months (Jasper 25-30%, ElevenLabs ~20-22%, Synthesia ~25%, HeyGen ~20%). Audience is high-intent. Thousands of "
        "AI creators, including accounts with millions of followers, cover the same tool launches the same day; tools change "
        "monthly so content dates fast. YouTube lists 'basic tutorials that duplicate material already on the platform' "
        "under repetitive content. This creator has already posted 21 AI reels with 0 shares and a 185-view median; "
        "tutorial reels got a few saves. Estimated TikTok RPM for tech $1.5-2 (blog estimates). Pipeline fit: high "
        "(UI mock-ups, typed prompts, data components)."
    ),
    "personal_finance": (
        "Personal finance and investing education (budgets, compound interest, credit, index funds). Highest-CPM niche "
        "(long-form $15-50 estimated; Shorts finance RPM about $0.15-0.25 for US audiences). YouTube will not monetize AI "
        "personas giving finance advice, and this creator's on-screen host and voice are an AI avatar / cloned voice. In "
        "India, SEBI has removed over 70,000 misleading posts and accounts since Oct 2024, barred regulated brokers/platforms "
        "from associating with unregistered people who give advice or return claims, and ordered large refunds from "
        "finfluencers (e.g. Rs 546 crore impounded, Dec 2025). Trust takes long to build; very crowded with credentialed "
        "creators. Pipeline fit: high for animated charts and calculators."
    ),
    "psychology_self_improvement": (
        "Psychology and self-improvement explainers (why you procrastinate, cognitive biases, habits, social behaviour). "
        "Animated psychology channel Psych2Go has about 13.1M YouTube subscribers; content is highly relatable and "
        "'send this to someone who...' shareable. Mental-health advice is health-adjacent, so AI-persona advice is a YouTube "
        "monetization risk unless framed as explained research. Monetization: low ad RPM, digital products (planners, "
        "journals), app affiliates. Competition high, many low-effort quote-style accounts. Pipeline fit: high (illustrated "
        "characters, mocap figures, diagrams)."
    ),
    "fitness_wellness": (
        "Faceless fitness and wellness (workouts, routines, meal prep). DashSocial health & wellness engagement about 1.8%. "
        "Audiences expect real bodies demonstrating form; animated or AI demos are less credible. Health advice from an AI "
        "persona is not monetizable on YouTube. Strong sponsorship market (supplements, apps). Very saturated with real "
        "trainers. Pipeline fit: low-medium (mocap figures can show movements, but no real footage)."
    ),
    "science_how_it_works": (
        "Science and how-things-work explainers built on awe (what happens inside X, how Y actually works, scale "
        "comparisons, 'what if'). Animated shorts channel Zack D. Films has about 27.7M YouTube subscribers (July 2026); "
        "Kurzgesagt about 25M; The Infographics Show about 14-15M. Awe is reported as the top emotional trigger for viral "
        "reels. Education & Science is the highest-paying long-form YouTube niche in AIR's 2026 data (median RPM $10.22), "
        "Shorts education RPM about $0.08-0.15 US. Evergreen, global English audience (mostly US/UK views possible from "
        "India), no regulatory risk, broadly shareable. Competition is high at the top but the bar is production quality, "
        "which is this pipeline's strength. Monetization: ads, sponsorships (learning apps), long-form spin-offs, books. "
        "Pipeline fit: very high (Blender 3D, depth parallax, data viz, scale animations)."
    ),
    "history_what_if": (
        "History and 'what if' visual stories (lost cities, how ancient people did X, alternate history). Large faceless "
        "genre on Shorts; AI-generated story and fake-trailer channels were among those terminated by YouTube in Jan 2026, "
        "so originality and accuracy matter. Evergreen, shareable, global audience. Monetization: ads, long-form spin-offs, "
        "sponsorships. Pipeline fit: high (photoreal stills with parallax, maps, 3D)."
    ),
    "general_how_to_hacks": (
        "General how-to and life hacks (phone tricks, home hacks, productivity). Strong saves; many hacks need real-world "
        "demonstration footage. Very crowded, frequently copied. YouTube flags basic tutorials that duplicate existing "
        "material as repetitive. Pipeline fit: medium."
    ),
    "food_cooking": (
        "Food and cooking. DashSocial food & beverage engagement about 2.5%, universal appeal, strong shares. Requires real "
        "food footage; AI-generated food reads as fake. Pipeline fit: very low."
    ),
    "parenting_family": (
        "Parenting and family. DashSocial children & baby engagement about 1.6%. Built on trust and real family life; "
        "kids' content has extra platform restrictions. Pipeline fit: very low."
    ),
    "motivation_quotes": (
        "Motivation and quotes. Easiest to produce, high share rate historically, extremely saturated, and the format most "
        "exposed to YouTube's template/repetitive non-monetization rule and Instagram's originality demotion. Low follow "
        "conversion, low ad RPM. Pipeline fit: high but under-uses it."
    ),
    "aesthetic_interiors": (
        "Aesthetic, design and interiors (room makeovers, design styles explained). Visual-first; home-decor affiliates and "
        "sponsorships. Competes with real interior designers and Pinterest-style accounts; AI interiors are common and "
        "viewers distrust them. Pipeline fit: medium-high (Blender rooms, photoreal stills)."
    ),
    "sports_micro_niche": (
        "Sports micro-niche (volleyball, hockey). Claimed 5-6% engagement could not be verified. Requires match footage that "
        "is rights-protected; small passionate audience; India audience for these sports is small. Pipeline fit: low "
        "(tactics boards and mocap possible)."
    ),
    "photography": (
        "Photography tips. Visual-first, but credibility needs the creator's own real photos and camera footage. "
        "Pipeline fit: low."
    ),
}

SCALE5 = lambda lo, hi: [f"very {lo}", lo, "moderate", hi, f"very {hi}"]

def score_questions():
    return {
        "shareability": Score(
            instructions="Given the creator, platform facts and niche notes in state, how likely is a well-made short in this niche to be SENT/shared by non-followers (shares per reach)?",
            criteria=SCALE5("low", "high")),
        "scroll_stop": Score(
            instructions="How strong can the first 3 seconds be in this niche, using only this creator's pipeline (no real footage)?",
            criteria=SCALE5("weak", "strong")),
        "pipeline_fit": Score(
            instructions="How well does this creator's production pipeline (strengths and weaknesses in state) fit what audiences in this niche expect?",
            criteria=SCALE5("poor", "good")),
        "monetization": Score(
            instructions="Realistic monetization potential in the first 12 months for THIS India-based creator across Instagram, YouTube Shorts and TikTok, considering the platform facts and the niche's regulatory limits.",
            criteria=SCALE5("low", "high")),
        "policy_safety": Score(
            instructions="How safe is this niche from demonetization, takedowns or regulatory trouble for a channel using an AI avatar / cloned voice and AI imagery (YouTube July 2026 rules, Instagram originality rules, SEBI where relevant)?",
            criteria=SCALE5("unsafe", "safe")),
        "standout_odds": Score(
            instructions="How likely is a brand-new account with zero followers to stand out against existing competition in this niche, given this creator's production quality?",
            criteria=SCALE5("unlikely", "likely")),
        "series_follow": Score(
            instructions="How well does this niche support a recognisable repeating series that converts viewers into followers?",
            criteria=SCALE5("poor", "good")),
        "evergreen": Score(
            instructions="How long do videos in this niche stay relevant and keep getting views?",
            criteria=SCALE5("short-lived", "long-lived")),
        "recommend": Noul(
            instructions="Is this niche a sound choice for THIS creator to launch new channels aimed at maximum engagement and follower growth?",
            criteria={"true": "Yes, a sound launch niche for this creator", "false": "No, a poor launch niche for this creator"}),
    }

WEIGHTS = {"shareability": .20, "pipeline_fit": .15, "policy_safety": .15, "standout_odds": .12,
           "scroll_stop": .10, "monetization": .12, "series_follow": .08, "evergreen": .08}

def main(out):
    c = TypeSafeClient()
    res = {"weights": WEIGHTS, "per_niche": {}, "choice": []}
    for model in ("jev-latest", "jev-preview"):
        for k, notes in NICHES.items():
            r = c.system_one(model=model, state={"creator": CREATOR, "platform_facts": PLATFORM, "niche": notes},
                             questions=score_questions())
            d = json.loads(r.model_dump_json())
            res["per_niche"].setdefault(k, {})[model] = d["answers"]
            res.setdefault("served", {})[model] = d["model"]
            print(model, k, {q: round(a.get("score", a.get("noul", 0)), 2) for q, a in d["answers"].items()}, flush=True)
        # Head-to-head choice, with the niche order shuffled to check for position bias.
        for seed in range(4):
            keys = list(NICHES)
            random.Random(seed).shuffle(keys)
            state = {"creator": CREATOR, "platform_facts": PLATFORM,
                     "candidate_niches": {k: NICHES[k] for k in keys}}
            q = {"best": Choice(
                instructions="Which ONE niche should this creator launch new Instagram Reels / YouTube Shorts / TikTok channels in, to gain maximum engagement and followers while staying monetizable and policy-safe?",
                criteria={k: k.replace("_", " ") for k in keys})}
            d = json.loads(c.system_one(model=model, state=state, questions=q).model_dump_json())
            a = d["answers"]["best"]
            res["choice"].append({"model": model, "seed": seed, "order": keys, **a})
            top = sorted(a["probabilities"].items(), key=lambda x: -x[1])[:4]
            print(model, "choice seed", seed, a["choice"], round(a["confidence"], 2), top, flush=True)
    json.dump(res, open(out, "w"), indent=1)

if __name__ == "__main__":
    main(sys.argv[1])
