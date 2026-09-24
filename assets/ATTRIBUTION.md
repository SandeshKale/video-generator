# Asset sources & licenses

Curated assets pulled into this repo for reuse when generating reels. Each
source keeps its own license file alongside its files; check that file
before using an asset commercially if you need certainty beyond the summary
below.

## Included

| Path | Source | License | What was pulled |
|---|---|---|---|
| `icons/tabler/` | [tabler/tabler-icons](https://github.com/tabler/tabler-icons) | MIT | ~180 outline SVG icons curated for reel use (arrows, charts, money, social/media, UI, devices, alerts). Full set has 5,000+; see `LICENSE` in this folder. |
| `icons/feather/` | [feathericons/feather](https://github.com/feathericons/feather) | MIT | Full set (287 SVGs) — the whole set is small and cohesive, so nothing was trimmed. |
| `icons/simple-icons/` | [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons) | CC0 (see `LICENSE.md`) | ~100 brand/logo SVGs for platforms and tools likely to show up in reels (Instagram, LinkedIn, X, YouTube, TikTok, GitHub, OpenAI, Anthropic, Stripe, etc.). Full set has 3,000+ brands. |
| `illustrations/flowbite/` | [themesberg/flowbite-illustrations](https://github.com/themesberg/flowbite-illustrations) | MIT | Full set (107 SVGs, ~3MB) — small enough to keep entirely. |
| `illustrations/bioicons/` | [duerrsimon/bioicons](https://github.com/duerrsimon/bioicons) | Mixed — license varies **per icon**, encoded in the folder name (`cc-0/`, `cc-by-sa-4.0/`, etc.); the repo's own `LICENSE` (MIT) covers only the webapp code, not the icons themselves | A small (~34 icon) sample from the more general-purpose categories (Machine Learning, Computer Hardware, People, General Items, Lab Apparatus). This repo is mostly biology/chemistry-specific and not a great fit for social reels — kept as a token set per the source list. |
| `photos/servicestack/` | [ServiceStack/images](https://github.com/ServiceStack/images) | Sourced from [Unsplash](https://unsplash.com) — free for commercial and personal use, no attribution required | 30 of 147 hero photos (2560x1000), evenly sampled for variety. |
| `logos/gilbarbara/` | [gilbarbara/logos](https://github.com/gilbarbara/logos) | CC0 (see `LICENSE.txt`) — **but note:** CC0 covers the SVG *files themselves*; the brand marks depicted are still trademarks of their respective owners | ~137 dev-tooling/cloud/language/SaaS logos (AWS, Azure, GCP, Kubernetes, Docker, React, Python, OpenAI, Anthropic, etc.) curated out of ~1,900 available. |
| `logos/svg-logos/` | [detain/svg-logos](https://github.com/detain/svg-logos) | **No license — mirror of [WorldVectorLogo](https://worldvectorlogo.com)**; logos are trademarks/copyrighted artwork of their owners, use for identification only (see Legal note below) | 69 recognizable tech/hardware/enterprise logos (Intel-adjacent hardware makers, IBM, Cisco, Dell, Atlassian, Cloudflare, etc.) curated out of ~120,000 files — the full repo is a generic WorldVectorLogo mirror, not tech-specific. |
| `logos/unilogo/` | [zhoudaxia233/UniLogo](https://github.com/zhoudaxia233/UniLogo) | Repo code is MIT (see `LICENSE`); the university crests/wordmarks themselves are each institution's own mark | 36 transparent PNG logos for top research/engineering universities (MIT, Stanford, CMU, Oxford, Cambridge, ETH Zurich, IITs, Tsinghua, etc.) curated out of 835. |

## Not pulled from this round of sources, and why

- **LogoDet-3K, Logo-2K+, FlickrLogos-32** — these are ML training/detection datasets (bounding-box annotated), not asset libraries. Wrong shape for reel assets; skip unless this repo starts doing logo-detection model training.
- **Brandfetch / Logo.dev / unavatar.io / favicon-service pipeline** — these are live lookup APIs, not a one-time downloadable dump. Fits a "fetch a specific brand's logo on demand" workflow better than a pre-populated asset folder; can wire this up separately if a reel needs a brand not covered above.
- **VectorLogoZone** — repo is actually named `VectorLogoZone/vectorlogozone` (not `.../logos`); heavy overlap with `simple-icons` + `gilbarbara/logos` already pulled, skipped for this round to avoid redundant near-duplicates. Can pull specific brands from it on request.
- **thesvg.org** — appears to be a hosted site/library rather than a plain git-clonable asset repo; no direct source found to pull from.

## Not included (from the previous round), and why

- **`bradtraversy/design-resources-for-developers`**, **`neutraltone/awesome-stock-resources`**, **`MrPeker/awesome-illustrations`**, **`darelova/Awesome-Design-Resources-List`** — these are curated *link lists* (Markdown pages pointing to Freepik, Unsplash, dribbble, etc.), not repos containing actual downloadable asset files. Nothing to pull.
- **`lukaszadam/illustrations`** — no longer exists at that path (404/renamed/removed); couldn't locate a successor repo.
- **`jktzes/humaaans`** — assets are React components with SVG path data embedded in JSX (`.js` files), not standalone `.svg` files. Not directly usable in the plain-HTML reel templates this repo renders; would need custom extraction/conversion to be useful here.

## Legal note on logos specifically

Company/university logos are trademarks (and often copyrighted artwork) even
when the file itself ships under a permissive license like CC0 or MIT —
that license covers the SVG/PNG file, not the mark it depicts. Using a logo
to *identify* a real company/product/institution in a reel (e.g. "this is
what OpenAI charges vs. Anthropic") is generally fine (nominative use);
implying endorsement, using a logo as your own brand mark, or shipping it
inside a commercial product/template pack is not. `logos/svg-logos/` in
particular is a straight mirror of WorldVectorLogo with no license grant at
all — treat everything in that folder as "for reference/identification in
a reel, not for redistribution as a standalone asset."

## Using these in a reel template

Icons/illustrations are plain SVG files — inline them directly into a reel's HTML (`<svg>...</svg>` content) or reference via `<img src="...">` / a `data:` URI, same as the profile picture substitution pattern already used in `reel-anthropic-opus-5-5*/reel.html.tmpl`. Photos are standard JPEGs, usable as background images or `<img>` sources.
