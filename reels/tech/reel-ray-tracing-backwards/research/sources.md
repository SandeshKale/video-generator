# Sources and tiers (searched 4 Nov 2026; primary pages still to be read)
| Fact | Source | Tier |
|---|---|---|
| Appel 1968 (IBM, "Some Techniques for Shading Machine Renderings of Solids") = first ray-casting for rendering | Wikipedia "Ray tracing (graphics)", Wang (CEUR Vol-3150) | B |
| Whitted: recursive ray tracing (reflection + refraction), presented SIGGRAPH 1979, published CACM 1980 ("An Improved Illumination Model for Shaded Display") | same | B (say "1979-80") |
| Cars (2006) = first Pixar feature to use ray tracing; average 17 h per frame | D23 "Cars is Released" (Disney's own site) | B+ ; read Christensen, "Ray Tracing for the Movie Cars" |
| NVIDIA Turing/RTX, SIGGRAPH 2018: "up to 10 Giga Rays/s" (GTX 1080 Ti ~1.1 in software) | NVIDIA Turing whitepaper / developer blog | A for "NVIDIA claims"; the number itself is a vendor peak |
| RT cores do BVH traversal + ray-triangle tests; denoising on tensor cores; few rays per pixel + denoise | NVIDIA developer blog | A (vendor) |
**Derived, labelled on screen:** 1920x1080x60 = 124.4 M pixels/s; 10e9 / 124.4e6 = ~80 rays per pixel per frame at the *claimed peak*. Ideal binary BVH over 100 M triangles = log2(1e8) = ~27 levels (real BVHs are wider/uneven: say "about").
**Never on screen:** "74 minutes" for Whitted's image (single weak blog), Monsters University "29 hours/frame" (trivia site), any benchmark FPS, any claim that light "really" works backwards.
**Before building:** read Whitted 1980, the NVIDIA whitepaper section on RT cores, Christensen Cars paper; confirm the "screen-space reflections cannot show off-screen objects" limitation in Unreal/NVIDIA docs (hook claim, currently B).
