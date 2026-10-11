# Topic — "Software is over?" (a developer rebuilds Adobe's apps for free after a cancellation fee)

Chosen 11 Oct 2026. Trending on TechSpot (highest engagement of the week, 604k "hotness"), Yahoo Tech/Gadget Review, TweakTown, Cybernews, Ars Technica, HN (Oct 6). Relatable (everyone has fought a subscription), visual (seven apps, a cancel maze, a repo), two-sided (Adobe denies wrongdoing; the project is alpha), and it has hard numbers.

**Disclosure note:** the clones were reportedly written with Claude Opus 5.5 (Anthropic = the maker of the assistant that wrote this script). Keep it as a reported fact, no promotion; say so in the first comment.

## Fact table (tier A = 2+ independent outlets / primary; B = single outlet or secondary; C = do not state)
| Fact | Tier | Source(s) |
|---|---|---|
| Developer **Brandon Thomas** (Artcraft) released **seven free, open-source apps** replacing Photoshop, Illustrator, Premiere, Lightroom, After Effects, InDesign, Acrobat Pro | A | TechSpot, Gadget Review/Yahoo, TweakTown, Superpower Daily |
| Names: PhotoCraft, VectorCraft, FilmCraft, LightCraft, EffectCraft, DesignCraft, PrintCraft | A | Gadget Review, Martin Cid |
| Built over **a weekend** with **Claude Opus 5.5** (one outlet says "Opus 5") in **Rust**; WebAssembly browser versions | A (model version B) | Martin Cid, Gadget Review, Superpower Daily |
| Licences **MIT and Apache-2.0** | A | Gadget Review, GitHub repo page (checked 11 Oct) |
| Thomas: "Software is over." / "bit by the dark pattern cancellation fee one too many times" | A | TechSpot, Gadget Review |
| He calls them "clean-room replacements" (his characterisation, not a legal finding) | A | all |
| "Super early alpha"; users report basic-functionality problems | A | TechSpot, Gadget Review, Superpower Daily |
| Promise walked back: Reddit "100% parity within a month" → HN "99% parity… measured in months, not years" | A | Martin Cid, Superpower Daily |
| Adobe early-termination fee on annual-paid-monthly plans = **half of the remaining payments** | A | Adobe support (via trade press), Gadget Review |
| **March 13 2026**: DOJ announced a **proposed $150M** settlement (ROSCA): **$75M civil penalty + $75M in free services** | A | Verdict (Reuters), Videomaker, ProVideoCoalition, Digital Camera World |
| Government alleged the fee was obscured and cancelling was needlessly drawn out; **Adobe denies wrongdoing**; needs **court approval** | A | same |
| Settlement requires clearer fee disclosure up front + easier cancellation; it did **not** remove the fee | B | trade press summary |
| **artcraft repo: 14.6k stars, 2.3k forks** on GitHub (checked 11 Oct 2026, github.com/storytold/artcraft); PhotoCraft repo "23,303 stars on Oct 8" and ">42,000 stars across the seven repos in 8 days" | repo 14.6k = A (first-hand); 23k/42k = B/C (secondary re-posts) → use 14.6k only, re-check on render day |
| HN thread > 120 points (Oct 6) | B | secondary |
| PhotoCraft opens/saves PSD; layers, masks, adjustment layers, 70+ filters; other six "much further behind" | B | iFun.de via Martin Cid |
| Adobe has not publicly responded to Artcraft (in coverage so far); Ars Technica flags possible trade-dress scrutiny | A | Gadget Review, Martin Cid |
| Free, processes files locally, no account; JSON/MCP command-line control; Thomas plans to fund via tokens for Artcraft's own AI tools | B | Martin Cid |
| Adobe stock −37% YTD by June; CEO Narayen to step down | B | Martin Cid — **do not use** |
| Digital Camera World: settlement < 3 days of quarterly revenue | B (an estimate) | **do not use** |
| Whether Artcraft ever matches Adobe; legal outcome; real user numbers | C | say nothing |

## Balance
- Adobe denies wrongdoing and the deal is only proposed. Artcraft is alpha, built by one developer, with maintenance, trade-dress and "stars ≠ users" caveats. Do not say Adobe "was caught" or that Artcraft "kills" anything.
- Never show Adobe/Artcraft UI screenshots; all UIs are our own designs. Names as text; logos only nominatively if the library has them (check `assets/icons/simple-icons`).

## Sources
- TechSpot — "Software is over": Developer uses AI to build free Adobe clones… (8 Oct 2026) https://www.techspot.com/news/114136-software-over-developer-uses-ai-build-free-adobe.html
- Gadget Review via Yahoo Tech (9 Oct) https://tech.yahoo.com/ai/claude/articles/software-over-developer-uses-ai-174550981.html
- Martin Cid — Adobe's cancellation fee is now the pitch… https://www.martincid.com/technology-sv/adobe-cancellation-fee-ai-photoshop-clones-artcraft/
- Superpower Daily (7 Oct) https://superpowerdaily.com/posts/artcraft-releases-seven-open-source-adobe-alternatives-still-in-early-alpha
- TweakTown https://www.tweaktown.com/news/113989/developer-says-software-is-over-after-using-ai-to-recreate-adobes-entire-creative-cloud-suite-for-free/index.html
- Verdict (Reuters) / Videomaker / ProVideoCoalition / Digital Camera World — Adobe $150M DOJ settlement (13 Mar 2026)
- GitHub: https://github.com/storytold/artcraft
