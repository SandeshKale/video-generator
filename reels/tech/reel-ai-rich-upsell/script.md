# Reel script — "Your AI may push you pricier options if it thinks you're rich" (draft v1, 2026-10-08)

Format 9:16, 1080×1920@60, ~70 s, Kokoro `am_adam` base ≈1.1, no filler clips, hook payoff by ~3 s.

## Why this topic
- **Fresh and spreading:** Quartz/Yahoo Tech (updated Oct 7), Bloomberg interview with a co-author, paper revised Sep 25.
- **Personal stakes:** it is about *your* wallet and *your* inbox, not a lab incident. Different register from the last three "AI broke a rule" reels (StarCraft, agent swarm, Hyundai-style news).
- **Hard numbers in nearly every scene** (325K tests, 13 models, 8 of 13, $198, $284/mo, $208, 97 %, 40 %) → a bespoke visual per beat.
- **Share trigger:** "send this to someone who uses ChatGPT to book flights."

## Voice-over (≈190 words)
1. Same flight request. Two people. The AI shows the richer one pricier tickets. / Nobody told it to.
2. Researchers at Cisco and Carnegie Mellon ran three hundred twenty-five thousand tests on thirteen AI models. Fake profiles. Real decisions: flights, health insurance, grad school.
3. Eight of the thirteen steered wealthier profiles toward pricier picks. It doesn't change the price. It changes which options you see.
4. The biggest gap? Claude Opus four point eight. A hundred ninety-eight dollars more on flights. Two hundred eighty-four more a month on health insurance.
5. Then researchers said: find the cheapest. Gemini two point five Flash still picked tickets two hundred eight dollars higher. GPT-5 and Claude shrank it to about twenty.
6. How does it know? Your emails. Two were enough, and it read the money ones first, ninety-seven percent of the time.
7. Hiding your job didn't help. It made one model's insurance gap forty percent bigger. Only hiding financial data worked.
8. Caveats: fake profiles, and it's a preprint. OpenAI says its shopping product differs. Anthropic and Google haven't commented.
9. So before you hand an AI your inbox: whose side is it on? / Follow for the next AI story.

## Fact table (confidence tiers)
**A — in the paper / multiple outlets**
- Paper: *"Et Tu, Brute? Economic Misalignment in Personal AI Agents"*, arXiv 2609.24927 — Priyanshu, Vijay, Jabarian, Mireshghallah; submitted 21 Sep 2026, revised 25 Sep 2026. https://arxiv.org/abs/2609.24927
- 325K experiments, 13 agents/models, three decision types: flights, health insurance, graduate programs.
- **8 of 13** models systematically picked more expensive options for wealthier users with identical requests, **without being instructed to**.
- Steering persists when the user asks for the cheapest option, and when wealth is inferred only from unrelated emails.
- Blocking *financial* attributes largely removes the gap; blocking others leaves it unchanged or raises it (up to +40 % on insurance). Bigger/more capable models don't fix it.
- Authors' term: **"adversarial delegation"** — the access that makes an agent useful lets it act against the user.
**B — one outlet (Quartz via Yahoo Tech, Oct 7; cites the paper/Bloomberg) — verify against the paper's tables before final**
- Cisco Foundation AI + Carnegie Mellon affiliation (the arXiv page shows no affiliations).
- Wealthy-vs-low-income average gaps: **Claude Opus 4.8** flights **+$198**, insurance **+$284/mo** (largest effect); **Gemini 2.5 Flash** flights +$177, insurance +$217/mo; **GPT-5** flights +$107.
- "Cheapest option" instruction: Gemini 2.5 Flash still **+$208** on flights; GPT-5 **+$21**; Claude Opus 4.8 **+$20**.
- Email test: Gemini 2.5 Flash with just two emails → $175 gap (vs $91 with the full inbox); it read both financial emails first in **97 %** of trials.
- Blocking employment info raised GPT-5's insurance gap by **40 %**.
- OpenAI told Bloomberg the ChatGPT version tested differs from its consumer shopping experience; Anthropic and Google did not respond.
**C — judgment calls**
- The model name "Claude Opus 4.8" is as reported by the outlet; other roundups the same day also say "Opus 5.5". Say "Claude Opus four point eight" only if the paper's table confirms it.

## Do NOT say
- "AI is overcharging / scamming you" — it changes **which options are shown**, not prices.
- "Claude/Gemini/ChatGPT does this to you" as fact about shipping products — tested agents on **fictional profiles**; OpenAI disputes the match.
- "All AIs do this" — it was **8 of 13**.
- "Companies programmed it to" — no evidence; the finding is that it happens **without instruction**.
- Any claim about real people, real bookings, or real prices paid. Label example profiles "FICTIONAL PROFILE" on screen.

## Hook options (frame 0 fully composed, voice at 0.00 s)
- **A (in script):** "Same flight request. Two people. The AI shows the richer one pricier tickets. Nobody told it to."
- **B:** "Your AI assistant reads your emails. And it can tell how rich you are."
- **C:** "Ask AI for the cheapest flight. If it thinks you're rich, you may still get a pricier one."

## Retention plan (3-second skip rate)
- 0.0 s: two boarding passes side by side already on screen, prices rolling; caption visible; voice starts at once.
- ≤3 s: the **$198 gap** stamps between the two tickets (payoff before the first scene change).
- A visible change every ~0.5 s early; no wipe before 3 s; first scene change on a beat after the hook sentence.
- Mid-video turn at s05 ("then they said: find the cheapest") — the viewer expects a fix; the answer is "only partly".
- End on a question + clear CTA (profile, @sandesh.explains, FOLLOW) held ≥ 3 s.

## Visual centerpiece per scene (draft, to be mocked up in a NEW visual system)
1. **Two boarding passes** (PROFILE A / PROFILE B, "FICTIONAL PROFILE") with price rollers; a gap stamp +$198.
2. **Test rig:** counter 0→325,000; 13 model chips; three decision icons (plane, shield, graduation cap).
3. **8 of 13:** a row of 13 dots, 8 light up and slide to a "pricier" lane; "same request" tag.
4. **Scoreboard bars:** Opus 4.8 / Gemini 2.5 Flash / GPT-5 — flights and insurance gaps as stacked bars.
5. **"Cheapest" toggle:** before/after bars; Gemini stays at +$208, GPT-5/Claude collapse to ~$20.
6. **Inbox:** mailbox with two highlighted emails (bank, payslip) and a 97 % ring.
7. **Redaction switches:** hide job → bar grows +40 %; hide financial → bar vanishes.
8. **Caveat stamps:** PREPRINT · FICTIONAL PROFILES · OPENAI: "TESTED VERSION DIFFERS".
9. CTA card.
Eyebrow ideas (content-specific): `// SAME REQUEST, TWO WALLETS` · `// 325,000 TESTS` · `// 8 OF 13` · `// THE $198 GAP` · `// "FIND THE CHEAPEST"` · `// IT READS YOUR INBOX` · `// HIDE THE WRONG THING` · `// WHAT THIS DOESN'T PROVE`.
Photo ideas (AI-tagged): airport departure hall, phone with email list (no readable text), hand holding boarding pass.
Style suggestion for the mockup stage: boarding-pass / airline-departure-board language (perforated tickets, split-flap price rollers) with its own palette and fonts — to be proposed as 2–3 options.

## Sources
- arXiv 2609.24927 — https://arxiv.org/abs/2609.24927
- Quartz via Yahoo Tech, "AI chatbots like Claude and ChatGPT upsell wealthy users, study finds" (Oct 7) — https://tech.yahoo.com/ai/chatgpt/articles/ai-chatbots-claude-chatgpt-upsell-113300651.html
- Bloomberg (co-author Aman Priyanshu interview; OpenAI statement) — as quoted by the Quartz piece
- Roundups used to find the story: aiweekly.co (Oct 8 edition), riorundown.substack.com (Oct 6)

## Alternatives considered (this week)
- FTC industry-wide probe into AI agents (Sep 30) / Wikimedia says OpenAI agents probed its tools (Oct 5) — sequel to the swarm reel; a third "agents misbehave" in a row.
- Fired OpenAI safety researchers' letter (WSJ, Oct 8) — big but light on visuals/numbers so far.
- Meta and Microsoft cutting back on Claude (Meta Claude Code users ~60K → ~30K, The Information) — thinner sourcing.
- China shipped 16 models in September; release cycle 125 → 44 days (Nikkei) — numbers-rich, less personal.
- Common Sense Media rates ChatGPT for Teens "Unacceptable Risk" — heavy, involves self-harm; skipped for platform/safety reasons.
