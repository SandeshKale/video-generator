Vendored from the `react-humaaans` npm package (v1.0.1), MIT licensed
(per its package.json — no separate LICENSE file ships in the package).

Source: https://www.npmjs.com/package/react-humaaans
Original artwork: humaaans.com by Pablo Stanley (also CC0-style free-use
per the original project's own terms).

Contains 24 full pre-composed "standing" poses and several "sitting"
poses as React components (`standing/standing-N/StandingN.js`,
`sitting/sitting-N/SittingN.js`). Each file's `defaultProps` gives the
default skin/hair/shoe/coat/shirt/pant colors; `build.mjs`'s
`humaaansFull()` helper extracts the inner SVG markup and substitutes
color props (including a couple of `darken(color)` calls) into literal
hex values, producing a static SVG — same idea as the single figure
(`reel-app/src/humaaans/`) used in earlier reels, but with the variety
of poses that single curated set never had.

Use a different pose per reel (and per character within a reel, when a
reel uses more than one) — reusing the exact same pose across reels
reads as a template stamped out, not a new piece.
