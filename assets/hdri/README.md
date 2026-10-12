# HDRIs (Poly Haven, CC0)
1k Radiance `.hdr` environment maps from polyhaven.com (CC0 / public domain, no attribution required; credited anyway):
studio — `brown_photostudio_02`, `blue_photo_studio`; sunrise/dusk — `aarfontein_dawn_2`, `aarfontein_sunrise`, `aarfontein_dusk`; night — `blaubeuren_night`, `clarens_night_01`; interior — `aft_lounge`.
Use in Blender with an Environment Texture node on the World (`bpy.data.images.load(path)`). 1k is plenty for lighting; for visible backgrounds fetch 2k+ from `https://api.polyhaven.com/files/<id>` (the sandbox can reach it).
