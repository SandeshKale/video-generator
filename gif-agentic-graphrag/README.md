# Agentic GraphRAG architecture GIF

`agentic-graphrag.gif` — 1280×720, 22 s seamless loop, 12 fps (~11 MB). Pure function of `t` (`app.js`), rendered with
`REEL_W=1280 REEL_H=720 REEL_FPS=12 node ../scripts/render.mjs . out/arch.mp4` then palette-optimised to GIF:
`ffmpeg -i out/arch.mp4 -vf "fps=12,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" arch.gif`

Gotcha: soft radial-gradient backgrounds band badly in GIF palettes — keep the background flat.

It is a *reference* architecture (index: chunk → LLM entity/relation extraction → vector + graph + BM25 stores; query: planner → router →
ANN / graph walk / BM25 → RRF fusion → cross-encoder rerank → memory → generate → verify → loop), synthesised from 2026 surveys, not one vendor's product.
Sources: SoK Agentic RAG (arXiv 2603.07379), Agentic GraphRAG survey (SSRN 6713979), Engineering the RAG Stack (arXiv 2601.05264), production hybrid-search/rerank write-ups.
