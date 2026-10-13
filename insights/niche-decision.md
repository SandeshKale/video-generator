# Which niche for the new Reels / Shorts / TikTok channels (13 Oct 2026)

**Decision: science and "how things work" explainers, focused on everyday things and your own body and brain.**
Jev picked it in every head-to-head run: 14 of 14 across 2 models, shuffled option orders, a facts-only re-run and a money-first framing.
Your research recommended AI tools reviews. That came 6th of 13.

How it was decided: I checked each niche against sources (below), wrote a fact sheet per niche, and had TypeSafe's **Jev** decision model (`jev-1.13.0`, via `JEV_API_KEY`) score all 13 niches on 8 criteria, then choose one head-to-head.
The scripts and raw outputs are in `insights/niche-jev/` and can be re-run.

## 1. Corrections to the research you started from

| Claim in the research | What checking found |
|---|---|
| Per-niche Reels engagement: "Education 3.8%", "Food 3.5%", "Volleyball 5.9%" and others | **Couldn't trace any of these to a primary study.** Sources that could be checked show far lower numbers. Socialinsider's overall Instagram rate is 0.45% (Q2 2026). Rival IQ's all-industry median is 0.36%, with higher education at 2.1%. DashSocial's views-based rates are about 2.5% for food & beverage, 1.8% for health & wellness and 1.6% for children & baby. Treat the ranking table in the research as unreliable. |
| "Tech & Software 0.33% engagement" | That is a *brand-account* benchmark (Rival IQ style), not a creator one. It can't tell you whether a creator's niche will grow. |
| "Launch on TikTok too" | **TikTok has been banned in India since June 2020**, and the ban was still in force per Aug 2025 reporting. TikTok Creator Rewards also requires residence in an eligible country (US/UK/DE/FR/BR/MX/CA…, not India), 10k followers and videos over 1 minute. Start with Instagram + YouTube Shorts. Add TikTok only if you have a legitimate non-India setup. |
| "Faceless finance / fitness are ideal for a pipeline" | Since **16 Jul 2026, YouTube won't monetize AI personas giving health, finance, legal or medical advice**. It also won't monetize template-based, near-identical videos, and it reviews whole channels. Your host is an AI avatar with a cloned voice, so finance and fitness are the two worst fits. In India, finance has another problem: **SEBI** has removed 70,000+ posts and accounts since Oct 2024 and bars brokers and platforms from tie-ups with unregistered people who give advice. That cuts off the finance affiliate model the research relies on. |
| "AI tools reviews pay 20–50% recurring" | The usual rate is **20–30% recurring for 12 months**: Jasper 25–30%, ElevenLabs 20–22%, Synthesia ~25%, HeyGen ~20%. "50%" offers are usually tiered or one-time. |
| Shorts income | Shorts RPM ranges **$0.02–$1.48** by niche (AIR, 274 channels). Shorts aimed at Indian audiences earn roughly **₹5–30 per 1,000**, and a US view is worth about 5–15× an Indian one. Ad revenue from Shorts alone will be small in year 1 for any niche. Growth and a global English audience matter more than the niche's CPM. |

## 2. What the niches look like with checked facts

| Niche | Key facts | Fit for your pipeline and situation |
|---|---|---|
| **Science / how it works** | Zack D. Films (animated shorts) ~27.7M subs (Jul 2026); Kurzgesagt ~25M; Infographics Show ~14–15M. Education & Science has the highest long-form median RPM, **$10.22** (AIR 2026). Evergreen, global, no regulatory risk. | Very high: Blender 3D, depth parallax, scale animations and data viz are exactly what this genre rewards. |
| Psychology / self-improvement | Psych2Go (animated) ~13.1M subs. Very relatable, and the most shareable niche in Jev's scoring. Advice-style mental-health content from an AI persona is a YouTube monetization risk. | High, if it explains research and doesn't give advice. |
| History / what-if | Large faceless genre. YouTube's Jan 2026 sweep (16 channels, 35M subs) hit AI story and fake-trailer channels. | High, but accuracy and originality are under scrutiny. |
| AI tools reviews | Affiliate rates as above. The same launches get covered the same day by million-follower accounts, and content dates within weeks. **Your own 21 AI reels: 0 shares, 185 median views, 75% skip.** | UI mock-ups are easy, but you have no edge here and the content isn't evergreen. |
| Personal finance | Highest CPM (long-form estimated at $15–50). YouTube's AI-persona rule and SEBI rules apply (see section 1). | Poor, because of the avatar and India regulation. |
| Fitness / wellness | ~1.8% views-based engagement (DashSocial). Viewers expect real bodies showing form. Health advice from an AI persona isn't monetizable. | Low. |
| Motivation / quotes | Easy and shareable, but it's the format most exposed to the template/repetitive rule and Instagram's originality demotion. Poor follow conversion. | Under-uses the pipeline. |
| Aesthetic / interiors | Home-decor affiliates exist. Viewers distrust AI interiors. | Medium (Blender rooms). |
| How-to hacks | Saves well, but most hacks need real demo footage. YouTube lists "basic tutorials that duplicate existing material" as repetitive. | Medium. |
| Food, parenting, photography, sports micro-niches | They need real food, family, photos or rights-protected match footage. The sports engagement claims couldn't be verified. | Very low. |

## 3. Jev's scores

The 8 criteria were each scored 0–4 and averaged over `jev-latest` and `jev-preview`. The composite uses weights I fixed before the run: shares 20%, pipeline fit 15%, policy safety 15%, standout odds 12%, monetization 12%, 3-s hook 10%, series/follow 8%, evergreen 8%. **"Sound launch?"** is Jev's yes/no probability that the niche is a sound launch choice.

| Rank | Niche | Composite /100 | Sound launch? | Shares | Pipeline fit | Policy safety | Standout | Hook | Money | Series | Evergreen |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | **Science / how it works** | **63** | **0.79** | 1.4 | 3.7 | 3.0 | 1.9 | 2.9 | 1.1 | 3.6 | 3.6 |
| 2 | Psychology / self-improvement | 50 | 0.55 | **1.8** | 2.8 | 1.8 | 1.9 | 2.0 | 0.6 | 3.1 | 2.4 |
| 3 | History / what-if | 48 | 0.52 | 1.2 | 2.7 | 1.3 | 1.9 | 2.5 | 0.7 | 2.9 | 3.4 |
| 4 | Aesthetic / interiors | 36 | 0.29 | 0.8 | 1.5 | 2.2 | 1.1 | 2.1 | 0.7 | 1.9 | 1.8 |
| 5 | How-to hacks | 28 | 0.21 | 0.6 | 1.2 | 1.9 | 1.1 | 1.4 | 0.5 | 1.6 | 0.9 |
| 6 | AI tools reviews | 26 | 0.21 | 0.4 | 2.0 | 1.5 | 0.7 | 1.7 | 0.6 | 1.1 | 0.1 |
| 7 | Motivation / quotes | 26 | 0.12 | 1.6 | 1.3 | 0.8 | 1.0 | 1.8 | 0.1 | 0.5 | 0.4 |
| 8 | Personal finance | 22 | 0.14 | 0.3 | 1.4 | 0.0 | 0.6 | 1.8 | 0.1 | 1.4 | 2.6 |
| 9 | Fitness / wellness | 20 | 0.14 | 0.4 | 0.8 | 1.2 | 0.6 | 1.0 | 0.3 | 1.0 | 1.5 |
| 10 | Sports micro-niche | 18 | 0.08 | 0.3 | 0.7 | 1.7 | 0.6 | 1.3 | 0.1 | 0.6 | 0.4 |
| 11 | Photography | 17 | 0.08 | 0.4 | 0.2 | 1.5 | 0.3 | 0.9 | 0.1 | 0.7 | 1.9 |
| 12 | Food / cooking | 15 | 0.07 | 1.3 | 0.0 | 1.2 | 0.1 | 0.3 | 0.0 | 0.2 | 1.3 |
| 13 | Parenting / family | 11 | 0.06 | 0.4 | 0.0 | 0.9 | 0.3 | 0.7 | 0.0 | 0.3 | 1.2 |

**Head-to-head choice across all 13 niches:** science won 8 of 8 runs (2 models × 4 shuffled orders), each at probability 1.0.

**Bias check.** I wrote the fact sheets myself, so I re-ran the choice with neutral, facts-only sheets for the 5 contenders, with no fit verdicts and no adjectives:
- Growth framing: science won 3 of 3 (0.92–0.96). Psychology was next at 0.03–0.06.
- Money-first framing: science still won 3 of 3 (0.62–0.76). AI tools came second (0.22–0.35), so affiliate money is AI tools' only real argument.

**Angle within science.** Jev favoured **everyday things and your own body and brain** (0.41–0.52) over cosmic awe (0.26–0.31), engineering cut-aways and what-ifs. This margin is soft, so A/B test the top two angles.

**Science's weak spot is shares (1.4/4); psychology scored higher (1.8).** That's why the angle is "you": your brain, your body, things you touch every day. Explaining the research behind behaviour borrows psychology's relatability without its advice risk.

## 4. What this means for the channel

- **Concept:** one 20–35 s question per video about something the viewer does or touches every day. For example: "What actually happens when you crack your knuckles", "Why your phone dies faster in the cold", "Your brain deletes this every night". Cut-away 3D on the object or body part, a scale or number reveal, and one surprising payoff by about 1.5 s.
- **Format rules** (from `growth-diagnosis.md`, which was based on your own data):
  - Frame 0 shows one object plus 3–5 words about *you*.
  - Voice starts at 0.0 s.
  - Keep videos to 20–35 s.
  - End on a "send this to someone who…" line instead of a long CTA.
- **Series identity:** use a fixed opening, a series name and a fixed palette per channel. This repo currently requires a new visual identity for every reel. That's right for one-off reels but works against a recognisable series. **You need to decide this:** I suggest keeping variety inside a fixed frame.
- **Host:** keep the AI avatar off advice and on explanation. Disclose it in the caption (as the Use It Today template already does). Science explainers aren't in YouTube's sensitive-advice category. Body/brain topics must stay "what research shows", never "what you should do".
- **Platforms:** launch on Instagram Reels and YouTube Shorts with the same edit. Aim for an English, global (US/UK-heavy) audience, because that's where Shorts RPM and sponsorships are. Leave TikTok out unless you have a legal non-India setup.
- **Money, realistically:** Shorts ad share will be small in year 1. Revenue comes later from learning-app sponsorships and long-form spin-offs, which pay the $10 RPM tier. AI tools can still be an occasional segment ("the app that measures this") for affiliate links, without making it the channel.

## 5. Caveats

- Jev only weighs the facts it's given, and I compiled those facts. Its output is a structured second opinion, not market data. The facts-only re-run reduces this bias but doesn't remove it.
- Most third-party numbers here come from vendor blogs and trackers. Primary sources were available only for the YouTube policy coverage, the TikTok/India ban reporting and SEBI's actions.
- Subscriber counts are tracker snapshots: Zack D. Films from Jul 2026, Psych2Go from Jun 2026.
- Real validation will come from your first 10 posts. Re-run `scripts/ig_insights.py report` 48 h after each one. Change course if skip rate stays above 60% or shares stay at 0.

## Sources
- Engagement: [Socialinsider 2026 Instagram benchmarks](https://www.socialinsider.io/blog/instagram-benchmark-report/), [DashSocial 2026 H1 Instagram benchmark (PDF)](https://pages.dashsocial.com/hubfs/social-media-benchmark/2026/H1/instagram.pdf), [Rival IQ benchmark reports](https://www.rivaliq.com/benchmark-reports/), [Colorlib summary](https://colorlib.com/wp/instagram-engagement-rate/)
- YouTube policy: [TechRepublic](https://techrepublic.com/article/news-youtube-ai-video-monetization-rules), [Tubefilter](https://www.tubefilter.com/?p=193128), [Metricool](https://metricool.com/youtube-ai-content-rules-monetization/), [HackerNoon](https://hackernoon.com/youtubes-ai-slop-crackdown-cant-tell-a-directed-ai-film-from-a-bot-farm), [AIR timeline](https://air.io/en/monetization/youtube-monetization-policy-changes-2026-a-complete-dated-timeline)
- Shorts RPM: [AIR 274-channel study](https://air.io/en/air-data-findings/what-is-youtube-shorts-rpm-in-your-niche-in-2026), [ShortSync](https://www.shortsync.app/resources/how-much-do-youtube-shorts-pay-2026), [upGrowth India CPM](https://upgrowth.in/youtube-cpm-india-guide-2026/)
- TikTok: [TechCrunch, Aug 2025](https://techcrunch.com/2025/08/22/tiktok-denies-india-comeback-after-reports-of-website-going-live), [Storyboard18](https://www.storyboard18.com/amp/brand-makers/tiktok-ban-in-india-still-stands-company-clarifies-after-brief-website-access-79505.htm), [ShortSync Creator Rewards guide](https://www.shortsync.app/resources/tiktok-creator-rewards-program-2026), [elev8or RPM](https://www.elev8or.io/blog/tiktok-creator-rewards-rpm-2026)
- SEBI: [Outlook Business](https://www.outlookbusiness.com/markets/sebi-amends-rules-to-regulate-finfluencers), [Mondaq](https://webiis08.mondaq.com/india/securities/1726258/sebis-crackdown-on-finfluencers-regulations-and-enforcement), [Outlook Money](https://www.outlookmoney.com/amp/story/news/sebis-crackdown-on-unregistered-finfluencers-key-measures-by-the-regulator)
- Affiliates: [Tapfiliate](https://tapfiliate.com/blog/best-ai-affiliate-programs-gp/), [AI Studios](https://www.aistudios.com/best/best-ai-video-affiliate-programs-in-2026-compared)
- Channels: [Zack D. Films stats](https://www.speakrj.com/audit/report/zackdfilms/youtube), [Psych2Go stats](https://creatordb.app/creatorstats/psych2go/), [Vidpros faceless channel list](https://vidpros.com/top-faceless-youtube-channels/)
- Signals: [eClincher, Mosseri's ranking signals](https://www.eclincher.com/articles/how-the-instagram-algorithm-works-in-2026)
- Jev: [OpenRouter Jev docs](https://openrouter.ai/docs/guides/community/jev), [TypeSafe Python SDK](https://docs.typesafe.ai/sdk/python)
