# Space & Earth assets (`assets/space/`, added 31 Oct 2026)

Black-hole visualisations, Earth and sky maps, deep-space photography and a ready Blender Earth, all free to use with the credit lines below.
Satellite/antenna **3D models** are in `assets/models/nasa/`, the **caption rig** in `assets/animations/caption-rig/`, extra **sounds** in `assets/sfx/kenney/`.

| folder | what | licence / credit |
|---|---|---|
| `video/nasa-agn-{beauty,accretiondisk,jet}-loop.webm` | 10 s seamless 1280×720 15 fps loops of NASA's illustrated black hole with accretion disk, corona and jet (SVS 14922 "Anatomy of an Active Galactic Nucleus") | public domain · credit "NASA's Goddard Space Flight Center / Scientific Visualization Studio" |
| `video/nasa-types-of-black-holes-vertical.webm` | 50 s 720×1280 NASA explainer visual (SVS 14905), **audio removed** (the original has licensed music); it has NASA's own on-screen labels ("Artist's concept", mass ranges) burned in | same; do not remove the "Artist's concept" label when it is shown |
| `black-hole-stills/*.jpg` | 17 NASA SVS wallpapers (SVS 14146): 1080×1920 phone and 1920×1080 desktop stills — accretion disk, doubly-warped black hole, galactic centre, Hercules A, binary black holes, star shredding | public domain · "NASA" (some are composites with other missions' data, see the SVS page 14146) |
| `earth/blue-marble-topo-bathy-5400.jpg` | NASA Blue Marble with topography/bathymetry (Visible Earth 73909), 5400×2700 | NASA, free to use · "NASA Earth Observatory / Visible Earth" |
| `earth/black-marble-2012-8192.jpg` | NASA Black Marble 2012 night lights (Visible Earth 79765, VIIRS), downscaled from 13500×6750 to 8192×4096 | same |
| `earth/clouds-combined-2048.jpg` | NASA composite cloud map (Visible Earth 57747), 2048×1024 | same |
| `earth/ocean-mask-2048.png` | **ours**: ocean/land mask derived from the Blue Marble colours (for glossy seas) | CC0 |
| `earth/earth-blender-test.jpg` | test frame from `blender/earth.py` | CC0 (derived from the NASA maps) |
| `stars/hipparcos-star-map-2880.jpg`, `tycho-star-map-2880.jpg` | NASA 3D Resources star maps (equirectangular) for a starry sky | NASA, free to use |
| `planets/{moon,mars,venus,jupiter,saturn}.jpg` | NASA 3D Resources planet maps (Moon 1913², others 720–1440 wide) | NASA, free to use |
| `images/*.jpg` | 10 ESO / ESA-Hubble photographs (Milky Way panorama, Milky Way centre, M87 black hole, deep fields, Pillars of Creation, Sombrero, Pinwheel, Orion, Omega Centauri) | **CC BY 4.0 — the credit line in the table below must be visible** |
| `blender/earth.py` | builds a realistic Earth in Blender: day map + glossy oceans, city lights on the dark side (masked by the sun direction), cloud shell, atmosphere rim, star sky | CC0 (own work) |

## NASA terms (what to remember)
NASA media (SVS, Visible Earth, 3D Resources) may be used without permission if the use is factual and does **not imply NASA endorsement**; acknowledge NASA as the source.
The **NASA insignia / "meatball" / worm logos** are not free to use — do not put them in a reel, and do not use NASA content in a way that suggests NASA made or approved the reel.
SVS says its content is public domain unless noted; some SVS *videos* carry licensed music (we stripped the audio). Some 3D-resource models include NASA logos in their textures — check before showing a close-up.

## ESO / ESA-Hubble credit lines (CC BY 4.0 — mandatory, visible)
Put the line below in the reel (a small caption line at the image's scene) and in the post caption. The full set is also in `images/CREDITS.json`.

| file | credit line to show (mandatory) | licence | source |
|---|---|---|---|
| `images/milky-way-panorama-eso.jpg` | ESO/S. Brunier | CC BY 4.0 | https://www.eso.org/public/images/eso0932a/ |
| `images/m87-black-hole-eht.jpg` | EHT Collaboration | CC BY 4.0 | https://www.eso.org/public/images/eso1907a/ |
| `images/milky-way-centre-vista-mosaic.jpg` | ESO/VVV Survey/D. Minniti Acknowledgement: Ignacio Toledo, Martin Kornmesser | CC BY 4.0 | https://www.eso.org/public/images/eso1242a/ |
| `images/hubble-extreme-deep-field.jpg` | NASA, ESA, G. Illingworth, D. Magee, and P. Oesch (University of California, Santa Cruz), R. Bouwens (Leiden University), and the HUDF09 Team | CC BY 4.0 | https://esahubble.org/images/heic1214a/ |
| `images/hubble-ultra-deep-field.jpg` | NASA, ESA, and S. Beckwith (STScI) and the HUDF Team | CC BY 4.0 | https://esahubble.org/images/heic0406a/ |
| `images/pillars-of-creation-hubble.jpg` | NASA, ESA/Hubble and the Hubble Heritage Team | CC BY 4.0 | https://esahubble.org/images/heic1501a/ |
| `images/sombrero-galaxy-hubble.jpg` | NASA/ESA and The Hubble Heritage Team (STScI/AURA) | CC BY 4.0 | https://esahubble.org/images/opo0328a/ |
| `images/pinwheel-galaxy-hubble.jpg` | Image: European Space Agency & NASA Acknowledgements: Project Investigators for the original Hubble data: K.D. Kuntz (GSFC), F. Bresolin (University of Hawaii), J. Trauger (JPL), J. Mould (NOAO), and Y.-H. Chu (University of Illinois, Urbana) Image processing: Davide De Martin (ESA/Hubble) CFHT image: Canada-France-Hawaii Telescope/J.-C. Cuillandre/Coelum NOAO image: George Jacoby, Bruce Bohannan, Mark Hanna/NOAO/AURA/NSF | CC BY 4.0 | https://esahubble.org/images/heic0602a/ |
| `images/orion-nebula-hubble.jpg` | NASA, ESA, M. Robberto (Space Telescope Science Institute/ESA) and the Hubble Space Telescope Orion Treasury Project Team | CC BY 4.0 | https://esahubble.org/images/heic0601a/ |
| `images/omega-centauri-hubble.jpg` | NASA, ESA and the Hubble Heritage Team (STScI/AURA) Acknowlegement: A. Cool (San Francisco State Univ.) and J. Anderson (STScI) | CC BY 4.0 | https://esahubble.org/images/heic0809a/ |

## Using the Blender Earth
```python
import sys; sys.path.insert(0, 'assets/space/blender'); from earth import build_earth
earth = build_earth(sun_dir=(1, -0.55, 0.35), res=(1080, 1920), lon_deg=70)   # radius 1.0; camera is framed on the terminator
# animate: earth.rotation_euler.z = radians(-20 + t * 6)  (spin), earth.children = Clouds/Atmosphere; move 'Sun' for a moving terminator
```
Or one test frame: `python3 assets/space/blender/earth.py out.png 70` (1280×720, 40 samples, ~1 min on 4 CPUs). The night side shows only real city lights
(the NASA night image carries a dim blue underlay that the script thresholds away). For a **vertical** reel pass `res=(1080, 1920)` and a smaller `cam_dist`.

## Notes
- Big masters were not kept: Black Marble is 8192 px (original 13500), the AGN loops are 720p VP9 (originals 4K ProRes, 340 MB each). Re-download from the SVS/Visible Earth pages if a 4K plate is needed.
- Video is VP9/WebM on purpose (the pinned headless Chromium cannot decode H.264); see CLAUDE.md "Video overlays" for the seek pattern (`currentTime` + `seeked`).
- 10 s loops at 15 fps: set `video.playbackRate`-free seeking by `(t % 10)`, do not rely on playback.
