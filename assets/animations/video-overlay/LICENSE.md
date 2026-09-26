# Video overlays — provenance and license

Three transparent-mood texture overlays, sourced from [Pixabay](https://pixabay.com)
and transcoded to VP9/WebM (see `CLAUDE.md`'s "Video overlays" section for
why WebM, not the source MP4, is required). All are released under the
[Pixabay License](https://pixabay.com/service/license-summary/): free for
commercial and non-commercial use, modification allowed, no attribution
required, no resale as a standalone asset.

| File | Source | Original |
|---|---|---|
| `light-leak-dust.webm` | [pixabay.com/videos/leak-light-dust-film-overlay-270109](https://pixabay.com/videos/leak-light-dust-film-overlay-270109/) | 4K, trimmed to source length, scaled to 1080px wide |
| `dust-particles.webm` | [pixabay.com/videos/dust-particles-snow-dark-black-3227](https://pixabay.com/videos/dust-particles-snow-dark-black-3227/) | 1080p, audio stripped, scaled to 1080px wide |
| `film-grain.webm` | [pixabay.com/videos/texture-grain-background-old-257448](https://pixabay.com/videos/texture-grain-background-old-257448/) | 4K, trimmed to first 6s, scaled to 1080px wide (source clip is a loopable scratches/dust texture, not literal photochemical grain) |

All three were re-encoded from the original MP4 to VP9/WebM at CRF 34-36,
scaled to 1080px width (matching this repo's canvas width — no reel needs
a wider source), audio removed. This shrank them from 8-98MB down to
230KB-2.3MB, and — more importantly — made them actually playable: see
`CLAUDE.md` for why H.264/MP4 does not decode at all in this repo's
pinned Playwright Chromium build.

`film-grain.webm` is white with black scratches/dust marks (a photographed
film-damage overlay, not a synthetic grain texture) — composite it with
`mix-blend-mode: multiply` so the white background stays neutral and only
the dark marks darken whatever is underneath.
