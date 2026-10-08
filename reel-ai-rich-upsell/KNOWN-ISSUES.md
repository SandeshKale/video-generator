# Known visual issues in the shipped render (NOT fixed, per user instruction on 2026-10-08)

Found by `bun scripts/visual-validate.mjs reel-ai-rich-upsell/site 0.25` after the reel was already delivered; the older
`check.mjs` reported 0 issues because it exempts `chips`, `stamp`, `badge`, `label`, `big` layers, skips the first 1.0 s
of every layer, and only compares whole-layer boxes (never collisions *inside* a layer).

Real defects (details in `validate-report.txt`):
- **Chips overlap each other** inside the `chips` layer — s02 ("CISCO FOUNDATION AI × CMU" × "FICTIONAL PROFILES"),
  s05 (GEMINI/GPT-5/OPUS chips), s06 (IN ONE TEST / GEMINI 2.5 FLASH / TWO-EMAIL CAP), s07 (INSURANCE GAP × UP TO +40%).
- **Inbox:** the "READ FIRST" tag collides with the email subject text (s06).
- **Safe zone:** the s02 chips row extends outside x 150–918 at times.
Intentional overlays (stamp on ticket, stamp on the "cheapest" card) are listed as LAYER-OVERLAP and are expected.
