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

## Not included, and why

- **`bradtraversy/design-resources-for-developers`**, **`neutraltone/awesome-stock-resources`**, **`MrPeker/awesome-illustrations`**, **`darelova/Awesome-Design-Resources-List`** — these are curated *link lists* (Markdown pages pointing to Freepik, Unsplash, dribbble, etc.), not repos containing actual downloadable asset files. Nothing to pull.
- **`lukaszadam/illustrations`** — no longer exists at that path (404/renamed/removed); couldn't locate a successor repo.
- **`jktzes/humaaans`** — assets are React components with SVG path data embedded in JSX (`.js` files), not standalone `.svg` files. Not directly usable in the plain-HTML reel templates this repo renders; would need custom extraction/conversion to be useful here.

## Using these in a reel template

Icons/illustrations are plain SVG files — inline them directly into a reel's HTML (`<svg>...</svg>` content) or reference via `<img src="...">` / a `data:` URI, same as the profile picture substitution pattern already used in `reel-anthropic-opus-5-5*/reel.html.tmpl`. Photos are standard JPEGs, usable as background images or `<img>` sources.
