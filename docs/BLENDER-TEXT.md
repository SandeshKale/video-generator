# Crisp text in Blender-first reels (standing fix, 20 Nov 2026)

Problem (creator: "text rendering is piss poor"): Blender 3D text rendered at 720x1280, 12 samples, denoised, depth-of-field, then Lanczos-upscaled to 1080x1920 came out soft and thin, small HUD labels turned to mush, and Devanagari cannot be shaped by Blender text.

Fix: `scripts/blender_text.py`
1. Every string is a shaped (PIL + raqm, so Devanagari works), 3x supersampled transparent PNG with outline/shadow (`text_png`).
2. `label(cam, ...)` puts it on a camera-parented plane sized so 1 texture pixel = 1/3 final pixel (emission + alpha only, invisible to glossy/diffuse/shadow, animate with `set_alpha`).
3. `render_overlay()` renders ONLY the text objects at the FINAL resolution (1080x1920), transparent, Standard view, no denoise, no DOF; `composite()` alpha-composites that over the (upscaled) beauty pass.
Text is therefore never upscaled, denoised or blurred. Works for thermal/overlay passes too (text goes in the overlay pass).

Rules: HUD cap-height >= 30 px, line text >= 40 px, weight SemiBold+, outline 3 px on busy grounds, fonts from `assets/fonts` (woff2 loads in PIL), Devanagari via `DEVA_BOLD`. Headlines that must be 3D (extruded, slammed, orbiting) may stay 3D but get a crisp texture face, never the extruded curve alone at beauty resolution. Test every new reel's text with a 1:1 crop of a final-resolution frame before the full render.
Existing reels (e.g. `reel-gta6-mobile-scam`) stay as shipped.
