# 3D model library (`assets/models/`)

Web-ready `.glb` props for Blender (`bpy`) reel scenes and for three.js/WebGL pages. Everything here is **CC0 / public domain** — no attribution
required, commercial use fine (the channel is monetised) — and every file is listed with its source in `INDEX.json`.
Added Oct 2026 from the creator's source list (low-poly city, scooter, server rack, phone, warehouse shelving, kitchen props, UI, fonts).

## Use it

```python
# inside a reel's blender/*.py (bpy 5.0.1; see tools/load_model.py)
import sys; sys.path.insert(0, '../../../assets/models/tools'); from load_model import place
place('procedural/delivery_scooter', loc=(0, 0, 0), rot_z=90, height=1.25)      # `height` rescales to real metres
place('quaternius/simplebuildings/Bank', loc=(10, 0, 0), tint=(0.3, 0.55, 0.9))  # clay packs: tint to the reel's palette
place('procedural/cell_tower', loc=(14, -14, 0), height=22, emission=(1, .2, .2, 8))   # 'EM_*' materials = LEDs/windows/screens
```

* Packs use **different unit scales** (Quaternius street tile = 2 m, Kenney tile = 1 m, Poly Haven = real metres). `INDEX.json` has each model's
  world bounding box (`size_xyz_m` = x, height, z); pass `height=` to `place()` and compose from there — do not eyeball.
* Pick by eye from `previews/*.jpg` (contact sheets, one per family).
* Re-render a look from several camera angles with `tools/preview.py`; for a **scrubbed** Blender sequence follow the existing reels
  (`reels/tech/reel-otp-journey/blender/` for a camera-through-city, `reels/tech/reel-ai-trading-pipeline/blender/` for object state changes).
* Colours: the 2019 Quaternius buildings, streets, Kenney kits and Poly Haven props carry their own colours/textures. The **2017 Quaternius packs
  (simple buildings, public transport) are clay** — their colours lived in legacy Blender-Internal materials that no current importer reads, so
  `tint` them (a house with emissive windows in the reel's accent colour reads as designed, not as unfinished).
* Procedural props (`procedural/build_props.py`) are our own geometry: `server_rack` (40 U, LED strips), `smartphone` (iPhone-15-Pro-style titanium
  frame, Dynamic Island, 3 lenses; the **`screen`** quad has a 0..1 UV — put a UI frame from `assets/ui-kit/` on it), `delivery_scooter` (+ top box),
  `delivery_bag`, `gas_stove_with_pot`, `milk_pouch`, `cell_tower` (lattice, 3 sector panels, dish, beacon), `map_pin`.
  Re-run `python3 assets/models/procedural/build_props.py [name]` after editing one.

## What is in it

| family | models | KB | licence | source | note |
|---|---|---|---|---|---|
| `polyhaven` Poly Haven props | 50 | 29394 | CC0 | https://polyhaven.com/a/… | PBR scans, 512 px textures |
| `kenney/city` Kenney city starter kit | 15 | 347 | CC0 | https://github.com/KenneyNL/Starter-Kit-City-Builder | flat-shaded low-poly |
| `kenney/racing` Kenney racing starter kit | 8 | 641 | CC0 | https://github.com/KenneyNL/Starter-Kit-Racing | flat-shaded low-poly vehicles/scenery |
| `quaternius/buildings` Quaternius Buildings (2019) | 9 | 5968 | CC0 | https://quaternius.com/packs/buildings.html | coloured |
| `quaternius/simplebuildings` Quaternius Simple Buildings (2017) | 10 | 2061 | CC0 | https://quaternius.com/packs/simplebuildings.html | CLAY: untextured, tint in scene |
| `quaternius/publictransport` Quaternius Public Transport (2017) | 12 | 658 | CC0 | https://quaternius.com/packs/publictransport.html | CLAY: untextured, tint in scene |
| `quaternius/streets` Quaternius Modular Streets | 24 | 761 | CC0 | https://quaternius.com/packs/modularstreets.html | coloured, snap-together road tiles |
| `quaternius/cars` Quaternius Realistic Cars (2018) | 7 | 1152 | CC0 | https://quaternius.com/packs/cars.html |  |
| `quaternius/cyberpunk` Quaternius Cyberpunk Game Kit | 53 | 3380 | CC0 | https://quaternius.com/packs/cyberpunkgamekit.html |  |
| `procedural` Procedural (this repo) | 8 | 1548 | CC0 (own work) | assets/models/procedural/build_props.py | EM_* materials are emissive |

## Rebuilding / adding packs

```bash
python3 -m pip install "bpy==5.0.1" numpy pillow          # plain pip is Python 3.13's; this installs Blender as a module
python3 assets/models/tools/convert.py jobs.json          # glTF/FBX/OBJ/.blend -> .glb, textures <= 512 px JPEG q80
python3 assets/models/tools/build_index.py                # INDEX.json + the table above
python3 assets/models/tools/preview.py out.jpg a.glb b.glb   # contact sheet (COLS, CELL, SPP env vars)
```

Download routes that worked from this sandbox (others are blocked or need a login — see below):

* **Poly Haven** — `https://api.polyhaven.com/files/<id>` → glTF `1k` set. Send a descriptive `User-Agent`; the default Python one gets HTTP 403.
* **Quaternius** — each pack page links a public Google Drive folder; `python3 -m pip install gdown`, then `gdown --folder <url>` (the folder
  download is slow, ~10-20 min for the bigger packs; run it in the background and keep the output on disk, not `/tmp`, if the container may restart).
  Use the **OBJ** files (the MTL carries colours; the FBX importer marks materials fully transparent on the 2019 packs).
* **Kenney** — `kenney.nl` returns 403 here, but his GitHub starter kits clone fine and their README states CC0:
  `git clone --depth 1 https://github.com/KenneyNL/Starter-Kit-City-Builder` (also `Starter-Kit-Racing`).

## Not vendored from the creator's list, and why

* **Kenney City Kit (Commercial / Suburban / Industrial)** — only on kenney.nl (HTTP 403 from here). The city starter kit above is the part of it that is on GitHub.
  Drop the three zips into a folder and run `convert.py` if you download them yourself.
* **Sketchfab models** (delivery scooter, server rack, warehouse shelving, iPhone 15 Pro, low-poly city) — need a logged-in account/API token, and the
  licence is set per model by each author (it can be CC-BY, or forbid redistribution), so each one has to be checked before use. We built equivalents from scratch under `procedural/` and used CC0 Poly Haven/Kenney/Quaternius instead.
  If a specific Sketchfab model is wanted, check its licence, download the glTF yourself and add it with `convert.py` (keep the author credit in `INDEX.json`).
* **Quaternius Downtown City MegaKit / Modular Sci-Fi MegaKit** — their pack pages point to itch.io downloads, which I did not try (the Drive-hosted packs are what is vendored). The Cyberpunk Game Kit's enemies, characters, pickups and turrets were left out (game pieces, and no cartoon humans); the Drive download of those was stopped.
* **Figma Community UI kits** (Blinkit-UI, grocery/delivery kits) — Figma file downloads need a Figma account, and Blinkit-UI is a real brand's UI (CC BY 4.0 + trademark).
  Generic equivalents are in `assets/ui-kit/` (own work); do not copy a real company's UI or logo into a reel.
* **Freesound / YouTube Audio Library / Pixabay audio** — login/captcha-gated. The repo already has CC0 UI samples (`assets/sfx/uisfx/`) and the synth score system.
* **Fonts** — JetBrains Mono, Space Mono and Inter were already vendored in `assets/fonts/`.
