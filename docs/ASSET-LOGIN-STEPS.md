# Getting the assets that need a login or a browser

_Two lists so far: **Part A** (31 Oct, low-poly city / props / UI) and **Part B** (31 Oct, space / Earth / captions / audio, at the bottom). The hand-off steps right below apply to both._

These are the items from the "equivalent assets" list that the sandbox could not fetch (login, captcha, or a blocked site).
Everything else is already in `assets/models/`, `assets/ui-kit/` and `assets/animations/hud-parts/` (see `assets/models/README.md`).
Site layouts change; the steps below are the general route, so adjust to what the page shows.

## How to hand the files over (the same for every item)

1. Download the **glTF/GLB** version when there is a choice (OBJ is second best; FBX is last, it can lose colours).
2. Put the raw download, unzipped, in `assets/_incoming/<source>/<name>/` and add a `SOURCE.txt` next to it with 4 lines:
   ```
   url:     <the page you downloaded it from>
   author:  <creator's name or handle>
   license: <exactly what the page says: CC0, CC BY 4.0, ...>
   checked: <date you read the licence>
   ```
3. Push to `main`, then tell me the folder names. I convert them (`assets/models/tools/ingest.py`), render a contact sheet, add credits and commit.
   Or do it yourself: `python3 assets/models/tools/ingest.py assets/_incoming/<source>/<name> <family> --license "CC0" --author "Name" --url <page>`
   then `python3 assets/models/tools/build_index.py` (needs `python3 -m pip install "bpy==5.0.1" numpy pillow`).
4. Delete the raw folder after conversion if it is large (`assets/_incoming/` is a hand-off area, not the library).

**Licence rule of thumb for this channel (monetised):** CC0 / public domain — use freely. CC BY — fine, but the credit must go in the reel's caption
(and `INDEX.json`). CC BY-NC, "editorial only", "personal use", "standard licence / no redistribution" or "no AI" — do **not** use, and do not commit the file to the repo.
If the licence is not stated on the page, skip the model.

## 1. Sketchfab models (account needed)

What was wanted: delivery scooter, server rack, warehouse shelving, iPhone 15 Pro (Dynamic Island), low-poly city.
We already have our own scooter, rack, shelving (Poly Haven), phone and city (Quaternius/Kenney); download from Sketchfab only if you want a specific look.

1. Create a free Sketchfab account and log in.
2. Search with these terms, then open **Filters → Downloadable** and **License → CC0 or CC Attribution** (also tick "Free"):
   - `delivery scooter low poly`, `low poly delivery electric scooter`
   - `server rack low poly`
   - `warehouse shelving low poly`, `warehouse racking`
   - `iPhone 15 Pro Max`, `iPhone 15 Pro`
   - `low poly city game ready`
3. On the model page read the **License** box on the right. Write the author and licence into `SOURCE.txt`.
4. Click **Download 3D model** → choose **glTF** (Autoconverted format is fine) → unzip into `assets/_incoming/sketchfab/<model-name>/`.
5. Skip anything marked "Editorial", "Standard" or "Personal", and be careful with phone models: an Apple-branded model with the logo is a trademark issue, so prefer one without the logo (our own `procedural/smartphone` already works).

## 2. Kenney City Kit packs: Commercial, Suburban, Industrial (no login, but the site is blocked from the sandbox)

1. In a normal browser open https://kenney.nl/assets/city-kit-commercial , `…/city-kit-suburban`, `…/city-kit-industrial`.
2. Click **Download** → it gives a zip (the free download is CC0; "support Kenney" donations are optional).
3. Unzip; use the **GLB format** folder if present. Put each in `assets/_incoming/kenney/city-commercial/` (etc.).
4. `SOURCE.txt`: author Kenney, licence CC0 (the zip contains `License.txt`; copy it into the folder).

## 3. Quaternius itch.io packs: Downtown City MegaKit, Modular Sci-Fi MegaKit

1. Open https://quaternius.itch.io/downtown-city-megakit and https://quaternius.itch.io/modular-sci-fi-megakit .
2. Click **Download Now**. If it asks for a price, "No thanks, just take me to the downloads" is the free path (support him if you can).
3. Download the pack zip (look for the **glTF** one; the megakits also ship FBX/OBJ/Blend). Unzip into `assets/_incoming/quaternius/<pack>/`.
4. Licence: CC0 (stated on the pack page). Put that in `SOURCE.txt`. These packs are large; tell me if you want only a subset converted.

## 4. Figma Community UI kits: Blinkit-UI, Grocery Delivery App UI Kit, Delivery App UI Kit

We already built a generic equivalent in `assets/ui-kit/`. Use these only as layout reference or if you want more screens.

1. Log in to Figma (free), open the kit's Community page, click **Open in Figma** (it copies the file to your drafts).
2. Check the licence line on the Community page (Blinkit-UI was listed as CC BY 4.0).
3. In the file select the screen frames → right panel **Export**: SVG (or PNG @3x) → **Export**; put the files in `assets/_incoming/figma/<kit-name>/`.
4. **Do not put a real company's UI or logo in a reel** as if it were ours. Blinkit is a real brand: CC BY covers the file, not the trademark. Re-skin it
   (our generic names, our palette) before it goes on screen. Anything with a real logo stays out of the repo.

## 5. Audio: SFX and music

The repo already has CC0 UI sounds (`assets/sfx/uisfx/`) and a synth score system. Add more only for a specific need.

| Source | Login? | Steps | Licence caution |
|---|---|---|---|
| Freesound.org | free account | search → open a sound → **Download**; filter **License: Creative Commons 0** | CC0 is free to use; "Attribution" needs a credit in the caption; avoid "Attribution NonCommercial" |
| Pixabay (pixabay.com/sound-effects, /music) | none, but a human check | download the mp3 | Pixabay Content Licence: free for commercial use, but **you may not redistribute the raw file** — keep it out of the repo, commit only the finished mix |
| YouTube Audio Library | Google account (YouTube Studio → Audio Library) | filter "No attribution required" | some tracks require a credit; never commit the raw file |
| Epidemic Sound / Artlist | paid subscription | download from your account | licensed to the account only: **never commit the raw file**; use it inside the finished reel only |

Put audio you may legally commit in `assets/sfx/<pack>/` with a `LICENSE` note; put everything else outside the repo and keep only the rendered reel.

## 6. Optional extras (if you want more props later)

- **BlenderKit** (free account, Blender add-on or website): filter **CC0**; search `saucepan`, `gas stove`, `milk pouch`, `scooter`. Download glTF/Blend, same hand-off.
- **CGTrader free models**: free account; only models whose licence says **Royalty Free** *and* allows redistribution. Many forbid putting the raw file in a repo; if unsure, skip.
- **Mixamo** (Adobe login): animated humanoids; the files may not be redistributed, and we avoid cartoon people anyway. Not recommended.

## Part A (cont.): what I check when you push them

Licence against the table above, polygon count and scale (`INDEX.json` size column), a contact-sheet look, then the credit line in `assets/ATTRIBUTION.md`.
If anything is unclear I will leave it out of the repo and tell you why.


---

# Part B — space, Earth, typography, captions and audio (second list, 31 Oct 2026)

## B0. What I already fetched from this list (nothing to do)

| Item on your list | Status | Where |
|---|---|---|
| NASA SVS black-hole / accretion-disk visuals | **done** | `assets/space/video/` (3 seamless 10 s AGN loops, 1 vertical explainer, audio stripped) and `assets/space/black-hole-stills/` (17 wallpapers, 1080×1920 and 1920×1080) |
| NASA / Hubble / ESO image archives | **done** (10 images, CC BY 4.0, credit lines recorded) | `assets/space/images/` + `CREDITS.json` |
| NASA Black Marble night lights | **done** (VIIRS 2012, 8192×4096) plus Blue Marble day map and NASA clouds | `assets/space/earth/` |
| Blender "realistic Earth with night lights / atmosphere" | **built as a script** from the NASA maps, test frame checked | `assets/space/blender/earth.py` |
| NASA 3D Resources (Satellite Kit, DSN 70 m antenna) | **done**: 22 models incl. Satellite Kit parts, DSN 34 m + 70 m, TDRS, GOES, DSCOVR, Landsat 8, TESS, Hubble, JWST | `assets/models/nasa/` |
| Star sky / planet maps | **done** (NASA Hipparcos + Tycho star maps, Moon/Mars/Venus/Jupiter/Saturn) | `assets/space/stars/`, `assets/space/planets/` |
| City/buildings (CC0 low-poly packs) | already done in Part A | `assets/models/quaternius/`, `kenney/` |
| Caption face (Inter ExtraBold / Roboto / Archivo) | **done**: Inter 800, Roboto 500/700/900, Archivo 600–900 vendored | `assets/fonts/` |
| Word-by-word highlighted captions (yellow chip + keyword tints) | **built** as a pure-`t` rig with a demo | `assets/animations/caption-rig/` |
| Ambient / whoosh-type sounds | **partly**: Kenney CC0 city ambience bed, placement/removal thuds, engines, skid, impact | `assets/sfx/kenney/` |

## B1. Solar System Scope texture pack (CC BY 4.0) — blocked from the sandbox

`solarsystemscope.com` does not connect from here (connection fails, no HTTP answer), so nothing was downloaded. We do not strictly need it: the NASA day, night and cloud maps above cover the same Earth.
Get it only if you want its extra maps (specular, normal/bump, 8k clouds, planets).

1. Open https://www.solarsystemscope.com/textures/ in a browser (no login).
2. Download the Earth set: day map, night map, clouds, specular, normal (2k is enough for 1080×1920; 8k only for close-ups). Add the planets you need.
3. Unzip into `assets/_incoming/space/solar-system-scope/` and write `SOURCE.txt` (url, "Solar System Scope", **CC BY 4.0**, date). Read the licence line on the page; as of my knowledge it requires crediting "Solar System Scope" (and it states the textures derive from NASA data).
4. **Credit in every reel that shows them** (caption line + post caption). I will add it to `assets/space/README.md`.

## B2. Stock space footage: Pexels, Pixabay, Vecteezy, Videezy — blocked or login-only

| Site | What happened here | What you do |
|---|---|---|
| Pexels | HTTP 403 for non-browser clients (it also wants an API key for scripted access) | search "milky way", filter **Vertical** (or 4K to crop), download the **HD/1080p** file. Licence: free for commercial use, attribution not required; you may not sell or redistribute the **unmodified** clip as stock |
| Pixabay | HTTP 403 (bot/captcha check) | same route; Pixabay Content Licence: free for commercial use, **no standalone redistribution** of the file |
| Vecteezy | needs a free account to download; free licence **requires attribution** (use the exact text on the clip's page), Pro is paid | log in, download the clip, copy the attribution line into `SOURCE.txt` |
| Videezy | needs a free account; free clips need attribution, some clips are "Pro" only | same as Vecteezy |

For all four: (a) put the original in `assets/_incoming/space/<site>/<clip>/` with `SOURCE.txt` (url, licence name, attribution text, date checked);
(b) **I will transcode it** to a short VP9/WebM (`ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -vf scale=1080:-2 out.webm`, because the headless Chromium cannot decode H.264);
(c) because their licences forbid redistributing the raw footage as stock, **tell me if the repo is public**: if it is, keep the raw clip out of Git (give me the file another way, or let me commit only the short transcoded, modified clip) — I will not push these to a public repo without your OK.
Tip: the NASA/ESO/Hubble material already in `assets/space/` covers a Milky Way and black-hole look without any of these licences.

## B3. Sketchfab and CGTrader GPS-satellite / satellite-dish models — login

NASA's own models (TDRS, GOES, Landsat 8, DSCOVR, TESS, DSN dishes, Satellite Kit) are now in `assets/models/nasa/` and replace most of this. If you still want a *GPS* satellite or a particular dish:
use the Sketchfab steps in Part A §1 (search `GPS satellite`, `satellite dish`; filter Downloadable + CC0/CC-BY; download glTF; `SOURCE.txt` with author/licence).
**CGTrader**: free account; premium/"GPS satellite" models are paid and their licence normally forbids redistributing the raw file — if you buy one, keep it out of the repo and give me only the render.

## B4. Google Earth Studio (realistic Earth fly-throughs with real geography) — Google account, approval, desktop Chrome

I cannot run it here (it needs your Google account and a Chrome session).
1. Go to https://earth.google.com/studio/ and sign in. If it shows a request form, apply for access (it was gated by approval when I last knew it).
2. Create a project, set start/end camera keyframes (it animates 3D Earth with real terrain, buildings and clouds), set the size to **1080×1920** and 30 or 60 fps.
3. **Render** → it exports a **PNG sequence (zip)**. Unzip into `assets/_incoming/google-earth-studio/<project>/frames/` and add `SOURCE.txt` (project name, keyframes, date).
4. **Terms to check before using in a monetised reel:** Google's attribution rules (https://about.google/brand-resources/ and https://www.google.com/permissions/geoguidelines/) — the output must carry the on-screen Google Earth / data-provider attribution that Studio bakes in or requires. I did not verify the current terms; read them first.
5. I will turn the PNG sequence into a VP9 clip, or scrub the frames by `t` like the Blender sequences already in the repo.
Alternative that needs nothing: `assets/space/blender/earth.py` (NASA maps) for stylised/space views.

## B5. NASA Black Marble — higher-res or newer composites (optional, free Earthdata login)

We have the 2012 Black Marble (8192 px). Newer yearly/monthly VIIRS composites (`VNP46`) are at https://blackmarble.gsfc.nasa.gov/ and need a free **NASA Earthdata** account (https://urs.earthdata.nasa.gov/). If you want them: log in, download a global tile set or the pre-rendered global PNG, put it in `assets/_incoming/space/black-marble/` with `SOURCE.txt` (product name, year), and I will stitch/downscale it.

## B6. Blender tutorials (YouTube) — cannot be watched or downloaded here

I cannot play videos. What those tutorials teach is already scripted from the maps I could fetch:
- **Realistic Earth with night lights / atmosphere shader** → `assets/space/blender/earth.py` (day map + glossy oceans, thresholded city lights masked by the sun, cloud shell, limb glow). If you want a specific look from a tutorial (e.g. a volumetric atmosphere, auroras), paste the video link plus a timestamp or a screenshot of the node tree and I will rebuild that part.
- **Realistic black-hole build** (accretion disk shader + gravitational lens): not built; we use NASA's illustrated loops and stills instead. If you want a Blender-native one, send a node-tree screenshot or the `.blend` from the tutorial's description page (check its licence) and I will adapt it into `assets/space/blender/`.

## B7. Typography you named but cannot be vendored

- **SF Pro Display Bold**: Apple's licence limits SF fonts to mockups/designs for Apple platforms; do **not** put it in the repo or a published reel. Use Inter ExtraBold (vendored), which is the intended free stand-in.
- **Helvetica Now Bold**: paid Monotype font; only if you own a licence — then keep the file out of the repo and tell me, I will reference it from a local path. Free stand-ins vendored: Inter, Roboto, Archivo.

## B8. Caption tools: CapCut, Submagic, Jumbo-style templates, After Effects rigs — accounts / paid / desktop apps

Not needed: the caption rig (`assets/animations/caption-rig/captions.js`) renders the same style (yellow rounded chip on the spoken word, keyword tints, dark scrim, ≤2 lines) from the reel's own word timings.
If you want a *specific* look from one of those tools: screenshot 3–4 frames (and say which words are tinted) and I will match the chip shape, tints and pop timing in the rig.
If you have an After Effects caption rig you own: export it with the Bodymovin/Lottie plugin and send the `.json`; the repo's Lottie runtime plays it by `t` (see CLAUDE.md "Lottie").

## B9. Audio: cinematic ambient bed, risers, whooshes — Epidemic Sound, Artlist, YouTube Audio Library, Pixabay Music, Freesound

Licence rules and per-site steps are in Part A §5. For this list specifically:
- **Freesound** (free account): search `cinematic riser`, `whoosh`, `drone ambient`, `deep space ambience`; filter **License: Creative Commons 0**. Put files in `assets/_incoming/audio/freesound/` with the sound's URL and licence in `SOURCE.txt`.
- **Pixabay Music / sound effects** and **YouTube Audio Library**: download, but **do not commit the raw files** (redistribution is not allowed); give me the track name and I will use it only in the mixed reel, or tell me to keep it local.
- **Epidemic Sound / Artlist**: paid, licensed to your account — never in the repo; send the file for the one reel only, outside Git.
- Already in the repo: CC0 UI sounds (`assets/sfx/uisfx/`), Kenney city ambience/thuds/engines (`assets/sfx/kenney/`), and the synth score system that builds drones, risers and hits per reel.

## B10. Pipeline note (After Effects / DaVinci / Premiere)

This repo renders with Blender + headless Chromium + ffmpeg and has no After Effects step. For "3D-tracked AR Earth over host footage": the Earth is `earth.py` rendered with a transparent background (`scene.render.film_transparent = True`, PNG/RGBA frames), and the host video stays the avatar clip; compositing is done in the page (`<video>` + canvas), as in the avatar reels. If you want true camera tracking of handheld footage, that needs a tracker (Blender's motion tracking can do it) and your footage; tell me when you have a clip.

## Quick checklist for you (everything above, ranked by usefulness)

1. Kenney City Kit packs (Part A §2) — free, no login, high value for city reels.
2. Pexels / Pixabay Milky Way clip(s) (B2) — only if the NASA/ESO plates are not enough.
3. Solar System Scope pack (B1) — only for extra Earth maps.
4. Google Earth Studio renders (B4) — when a reel needs real geography.
5. Freesound CC0 riser/whoosh/drone packs (B9).
