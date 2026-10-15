# Reels (1080×1920, 9:16)
One folder per reel (`reel-<slug>/`), grouped by content category:

| Category | What goes here |
|---|---|
| `tech/` | AI and tech news explainers, tutorials, "Use It Today" series |
| `science/` | Science channel reels (nothing frightening; see CLAUDE.md taste rules) |
| `wellness-productivity/` | Hack Zone series: psychology, wellness, productivity hacks |

Render: `bun scripts/render.mjs reels/<category>/<reel>/site out.mp4 1` (from the repo root; always scale 1).
