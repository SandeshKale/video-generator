# Getting the assets that need a login or a browser

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

## What I check when you push them

Licence against the table above, polygon count and scale (`INDEX.json` size column), a contact-sheet look, then the credit line in `assets/ATTRIBUTION.md`.
If anything is unclear I will leave it out of the repo and tell you why.
