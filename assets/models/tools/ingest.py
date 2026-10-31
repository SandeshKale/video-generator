"""Convert a folder of downloaded 3D files (glTF/GLB/FBX/OBJ/.blend) into the library with credit metadata.

    python3 assets/models/tools/ingest.py <src_dir> <family> --license "CC-BY 4.0" --author "Name" --url https://… [--tex 512]

<family> is a path under assets/models, e.g. `sketchfab/delivery-scooter` or `kenney/city-commercial`. Every model found under <src_dir> becomes
assets/models/<family>/<name>.glb (textures <= --tex px), and <family>/CREDITS.json records licence/author/url so `build_index.py` lists it.
Needs bpy (python3 -m pip install "bpy==5.0.1" numpy pillow). Run build_index.py afterwards.
"""
import argparse, json, os, subprocess, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('family')
ap.add_argument('--license', required=True); ap.add_argument('--author', default=''); ap.add_argument('--url', default=''); ap.add_argument('--tex', type=int, default=512)
a = ap.parse_args()
PREF = ['.glb', '.gltf', '.obj', '.fbx', '.blend']          # prefer glTF; OBJ before FBX (FBX imports can lose colours/alpha)
found = {}
for ext in PREF:
    for p in sorted(glob.glob(os.path.join(a.src, '**', '*' + ext), recursive=True)):
        key = os.path.splitext(os.path.relpath(p, a.src))[0].lower()
        found.setdefault(key, p)                            # first preferred format wins per model name
jobs = []
for key, p in found.items():
    name = os.path.basename(key).replace(' ', '_')
    jobs.append(dict(src=os.path.abspath(p), dst=os.path.join(ROOT, a.family, name + '.glb'), family=a.family, name=name, license=a.license, source=a.url, tex=a.tex))
if not jobs: sys.exit('no models found under ' + a.src)
os.makedirs(os.path.join(ROOT, a.family), exist_ok=True)
jf = os.path.join(ROOT, a.family, '.jobs.json'); json.dump(jobs, open(jf, 'w'))
subprocess.run([sys.executable, os.path.join(HERE, 'convert.py'), jf], check=True); os.remove(jf)
if os.path.exists(jf + '.out.json'): os.remove(jf + '.out.json')
json.dump(dict(license=a.license, author=a.author, url=a.url), open(os.path.join(ROOT, a.family, 'CREDITS.json'), 'w'), indent=1)
print('ingested', len(jobs), 'models into assets/models/' + a.family, '— now run build_index.py')
