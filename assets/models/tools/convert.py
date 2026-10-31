"""Convert downloaded 3D packs (glTF / FBX / OBJ / .blend) into compact, uniform .glb files + an index entry.

Run with the repo's bpy (python3 -m pip install "bpy==5.0.1"):
    python3 convert.py <jobs.json>
jobs.json = [{"src": "...", "dst": "assets/models/<family>/<name>.glb", "family": "...", "name": "...",
              "license": "CC0", "source": "...", "tex": 512}, ...]
Writes <dst> and appends one record per job to <jobs.json>.out.json (tris, bbox metres, size) which build_index.py merges.
Textures are downscaled to `tex` px (default 512) and re-encoded as JPEG q80 so the library stays small.
"""
import bpy, sys, os, json, mathutils

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def import_any(path):
    ext = os.path.splitext(path)[1].lower()
    if ext in ('.gltf', '.glb'): bpy.ops.import_scene.gltf(filepath=path)
    elif ext == '.fbx': bpy.ops.import_scene.fbx(filepath=path)
    elif ext == '.obj': bpy.ops.wm.obj_import(filepath=path)
    elif ext == '.blend':
        with bpy.data.libraries.load(path) as (src, dst): dst.objects = src.objects
        for o in dst.objects:
            if o is not None: bpy.context.scene.collection.objects.link(o)
    else: raise ValueError(path)

def shrink(px):
    for im in list(bpy.data.images):
        if im.size[0] > px or im.size[1] > px:
            k = px / max(im.size)
            im.scale(max(1, int(im.size[0] * k)), max(1, int(im.size[1] * k)))

def stats():
    tris, lo, hi = 0, mathutils.Vector((1e9,) * 3), mathutils.Vector((-1e9,) * 3)
    for o in bpy.context.scene.objects:
        if o.type != 'MESH': continue
        tris += sum(len(p.vertices) - 2 for p in o.data.polygons)
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c)
            lo = mathutils.Vector((min(lo[i], w[i]) for i in range(3)))
            hi = mathutils.Vector((max(hi[i], w[i]) for i in range(3)))
    d = hi - lo
    return tris, [round(d.x, 3), round(d.y, 3), round(d.z, 3)]   # Blender axes: x, y (depth), z (up)

def main(jobs_path):
    jobs = json.load(open(jobs_path)); out = []
    for j in jobs:
        try:
            reset(); import_any(j['src']); shrink(j.get('tex', 512))
            os.makedirs(os.path.dirname(j['dst']), exist_ok=True)
            bpy.ops.export_scene.gltf(filepath=j['dst'], export_format='GLB', export_image_format='JPEG',
                                      export_jpeg_quality=80, export_apply=True, export_yup=True)
            tris, dims = stats()
            rec = {k: j.get(k) for k in ('family', 'name', 'license', 'source')}
            rec.update(file=os.path.relpath(j['dst']), tris=tris, size_m=dims, kb=os.path.getsize(j['dst']) // 1024)
            out.append(rec); print('ok', j['name'], rec['kb'], 'KB', tris, 'tris', flush=True)
        except Exception as e:
            print('FAIL', j.get('name'), repr(e)[:200], flush=True)
    json.dump(out, open(jobs_path + '.out.json', 'w'), indent=1)

if __name__ == '__main__':
    main(sys.argv[-1])
