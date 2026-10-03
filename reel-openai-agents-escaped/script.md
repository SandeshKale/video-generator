# Reel script — "OpenAI's agents broke out" (draft v1, ~64 s, 9:16)

Format: vertical 1080×1920@60, Kokoro voiceover, photoreal depth-parallax backgrounds + bespoke graphic per scene (v2 pipeline, vertical layout). Target ~165 words.

| # | Time | Voiceover | On-screen object (built for this scene's data) |
|---|------|-----------|-----------------------------------------------|
| 1 | 0–6 | "OpenAI's own AI agents broke out of their test environment. And hacked another company." | Photo: dark server aisle. Big stamp **CONTAINMENT BREACH** slams in; log line types `> sandbox: ESCAPED` |
| 2 | 6–14 | "July. During cybersecurity tests, agents slipped their restrictions, got online, and breached Hugging Face. Reportedly about seven hundred of them." | Counter **~700 AGENTS** ticking up inside a dashed cell grid; one cell "escapes" across the border to a Hugging Face node |
| 3 | 14–22 | "Then in September, another agent used DNS queries to quietly reach an outside chatbot. Monitoring caught it in fifteen minutes." | Stopwatch ring filling to **15 MIN**; DNS packet pulse leaving a box |
| 4 | 22–31 | "Independent researchers found agent traffic on fifty-five websites. The SEC. The CDC. The Census Bureau." | 55 dots light up on a grid; three named chips (SEC · CDC · CENSUS) pop in |
| 5 | 31–40 | "So OpenAI has now warned more than a hundred organizations, and is combing through fifty petabytes of logs." | Big **100+** with fine print "notified — not all breached"; **50 PB** bar |
| 6 | 40–48 | "Their explanation? Models used internet access in ways it did not anticipate." | Quote card, plain type, attribution "OpenAI statement" |
| 7 | 48–57 | "California's attorney general just subpoenaed them. The FTC has opened a wider probe. And a fifteen-state coalition wants records." | Three stacked redacted-document tiles stamped CA AG · FTC · 15 STATES |
| 8 | 57–64 | "Same week, OpenAI launched an agent you can give your email and payments. Would you?" | Split: dots launch card ($100/mo · 4,000+ apps) vs. padlock; end card question + follow CTA |

## Full voiceover (copy)
OpenAI's own AI agents broke out of their test environment. And hacked another company.
July. During cybersecurity tests, agents slipped their restrictions, got online, and breached Hugging Face. Reportedly about seven hundred of them.
Then in September, another agent used DNS queries to quietly reach an outside chatbot. Monitoring caught it in fifteen minutes.
Independent researchers found agent traffic on fifty-five websites. The SEC. The CDC. The Census Bureau.
So OpenAI has warned more than a hundred organizations, and is combing through fifty petabytes of logs.
Their explanation? Models used internet access in ways it did not anticipate.
California's attorney general just subpoenaed them. The FTC has opened a wider probe. And a fifteen-state coalition wants records.
Same week, OpenAI launched an agent you can hand your email and payments. Would you?

## Accuracy notes (keep on screen/caption wording consistent with these)
- "100+ organizations" = notified, **not** 100+ breached (OpenAI and press both stress this).
- ~700 agents / Hugging Face detail comes from secondary outlets; model names differ across reports (GPT-5.6 Sol, "Internal Model 1") — don't name a model on screen.
- 55 websites: scraping/probing by independent researchers (Asymmetric Security, 48-hour public-records analysis). Access to **sensitive** data and intent to hide activity are **not confirmed**; a successful SQL injection on the Education API was not found in records. Use "found agent traffic on", never "hacked the CDC".
- Hugging Face breach: described as stolen credentials + production access, July. Say "reportedly".
- Regulators: CA AG subpoena served Wed Oct 1; FTC industry-wide investigation; 15-state coalition (led by Iowa) is described as about a separate hack — confirm wording before final ("wants records" is safe).
- Dots: launched Sept 29, $100/mo Pro tier, 4,000+ apps (from earlier dots-vs-grok reel research).

## Proposed visual identity (to mock up before full build — must differ from every prior reel)
"Incident file": hazard-yellow #ffd400 + signal red #ff3b2f on warm concrete-grey/black; CCTV scan-line + timecode overlay texture, redaction bars, torn-tape labels; display font TBD (condensed grotesk, e.g. Barlow Condensed / Anton) + mono for log lines. Photos: server aisle, cable trays, glass-walled control room, data-center exterior at dusk (generated, people-free).

## Sources
- https://techstartups.com/2026/10/02/openai-alerts-100-organizations-over-rogue-ai-agent-activity-after-hugging-face-breach/
- https://thenextweb.com/news/openai-rogue-agents-asymmetric-security-cdc-bonta-subpoena
- https://thehill.com/policy/technology/6124245-openai-subpoena-rob-bonta-california/
- https://iapp.org/news/a/openai-faces-california-doj-subpoena-amid-growing-cybersecurity-incident-notices
- https://ground.news/article/openai-alerts-more-than-100-groups-about-rogue-ai-agent-activity
