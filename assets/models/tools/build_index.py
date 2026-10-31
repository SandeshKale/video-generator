"""Scan assets/models/**/*.glb (pure Python, no Blender) and write assets/models/INDEX.json + the tables in README.md.
    python3 assets/models/tools/build_index.py
size_xyz_m = world bounding box (glTF Y-up metres: x, height, z).
"""
import json, os, struct, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAMILIES = {   # directory -> (label, licence, source url template, note)
    'polyhaven': ('Poly Haven props', 'CC0', 'https://polyhaven.com/a/{name}', 'PBR scans, 512 px textures'),
    'kenney/city': ('Kenney city starter kit', 'CC0', 'https://github.com/KenneyNL/Starter-Kit-City-Builder', 'flat-shaded low-poly'),
    'kenney/racing': ('Kenney racing starter kit', 'CC0', 'https://github.com/KenneyNL/Starter-Kit-Racing', 'flat-shaded low-poly vehicles/scenery'),
    'quaternius/buildings': ('Quaternius Buildings (2019)', 'CC0', 'https://quaternius.com/packs/buildings.html', 'coloured'),
    'quaternius/simplebuildings': ('Quaternius Simple Buildings (2017)', 'CC0', 'https://quaternius.com/packs/simplebuildings.html', 'CLAY: untextured, tint in scene'),
    'quaternius/publictransport': ('Quaternius Public Transport (2017)', 'CC0', 'https://quaternius.com/packs/publictransport.html', 'CLAY: untextured, tint in scene'),
    'quaternius/streets': ('Quaternius Modular Streets', 'CC0', 'https://quaternius.com/packs/modularstreets.html', 'coloured, snap-together road tiles'),
    'quaternius/cars': ('Quaternius Realistic Cars (2018)', 'CC0', 'https://quaternius.com/packs/cars.html', ''),
    'quaternius/cyberpunk': ('Quaternius Cyberpunk Game Kit', 'CC0', 'https://quaternius.com/packs/cyberpunkgamekit.html', ''),
    'procedural': ('Procedural (this repo)', 'CC0 (own work)', 'assets/models/procedural/build_props.py', 'EM_* materials are emissive'),
}

def _mat(n):
    import numpy as np
    if 'matrix' in n: return np.array(n['matrix']).reshape(4, 4).T
    t = n.get('translation', [0, 0, 0]); q = n.get('rotation', [0, 0, 0, 1]); sc = n.get('scale', [1, 1, 1])
    x, y, z, w = q
    R = np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                  [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                  [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])
    M = np.eye(4); M[:3, :3] = R * np.array(sc); M[:3, 3] = t; return M

def glb_info(path):
    import numpy as np, itertools
    with open(path, 'rb') as f:
        f.read(12); n, t = struct.unpack('<II', f.read(8)); js = json.loads(f.read(n))
    tris, pts = 0, []
    def walk(i, M):
        nonlocal tris
        nd = js['nodes'][i]; M = M @ _mat(nd)
        if 'mesh' in nd:
            for p in js['meshes'][nd['mesh']]['primitives']:
                if 'indices' in p: tris += js['accessors'][p['indices']]['count'] // 3
                a = js['accessors'][p['attributes']['POSITION']]
                if 'min' in a:
                    for c in itertools.product(*zip(a['min'], a['max'])): pts.append((M @ np.array([*c, 1]))[:3])
        for c in nd.get('children', []): walk(c, M)
    for r in js['scenes'][js.get('scene', 0)]['nodes']: walk(r, np.eye(4))
    P = np.array(pts); d = P.max(0) - P.min(0)
    return tris, [round(float(v), 3) for v in d]   # x, y(up), z in glTF Y-up metres

def main():
    recs = []
    for path in sorted(glob.glob(ROOT + '/**/*.glb', recursive=True)):
        rel = os.path.relpath(path, ROOT); d = os.path.dirname(rel); name = os.path.basename(rel)[:-4]
        fam = FAMILIES.get(d)
        if not fam: print('unclassified', rel); continue
        tris, size = glb_info(path)
        recs.append(dict(file='assets/models/' + rel, family=d, name=name, tris=tris, size_xyz_m=size, kb=os.path.getsize(path) // 1024,
                         license=fam[1], source=fam[2].format(name=name), note=fam[3]))
    json.dump(recs, open(ROOT + '/INDEX.json', 'w'), indent=1)
    lines = ['| family | models | KB | licence | source | note |', '|---|---|---|---|---|---|']
    for d, (label, lic, src, note) in FAMILIES.items():
        r = [x for x in recs if x['family'] == d]
        if r: lines.append(f"| `{d}` {label} | {len(r)} | {sum(x['kb'] for x in r)} | {lic} | {src.replace('{name}', '…')} | {note} |")
    open(ROOT + '/.families.md', 'w').write('\n'.join(lines) + '\n')
    print(len(recs), 'models,', sum(x['kb'] for x in recs) // 1024, 'MB'); print('\n'.join(lines))

main()
