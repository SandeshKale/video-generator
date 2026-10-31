"""Render a contact sheet of .glb models (3/4 view, studio light), to eyeball a library batch.
    python3 preview.py out.png model1.glb model2.glb ...   [env: COLS=4 CELL=320 SPP=12]
"""
import bpy, sys, os, math, mathutils
from PIL import Image, ImageDraw

def render_one(path, out, cell, spp):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=path)
    objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    lo = mathutils.Vector((1e9,) * 3); hi = mathutils.Vector((-1e9,) * 3)
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c)
            lo = mathutils.Vector((min(lo[i], w[i]) for i in range(3))); hi = mathutils.Vector((max(hi[i], w[i]) for i in range(3)))
    ctr = (lo + hi) / 2; r = max((hi - lo).length / 2, 1e-4)
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = spp; sc.cycles.device = 'CPU'
    sc.render.resolution_x = sc.render.resolution_y = cell; sc.render.film_transparent = False
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.55, 0.58, 0.62, 1); bg.inputs[1].default_value = 1.0
    cam = bpy.data.objects.new('c', bpy.data.cameras.new('c')); sc.collection.objects.link(cam); sc.camera = cam
    cam.data.lens = 50; d = r * 3.1
    cam.location = ctr + mathutils.Vector((d * 0.62, -d * 0.62, d * 0.38))     # Blender is Z-up after import
    cam.rotation_euler = (ctr - cam.location).to_track_quat('-Z', 'Y').to_euler()
    for loc, e in (((3, -4, 6), 3.0), ((-4, 2, 3), 1.2)):
        l = bpy.data.objects.new('l', bpy.data.lights.new('l', 'SUN')); l.data.energy = e; l.rotation_euler = (math.radians(50), 0, math.radians(35 if e > 2 else -120)); sc.collection.objects.link(l)
    sc.render.filepath = out; bpy.ops.render.render(write_still=True)

if __name__ == '__main__':
    out = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else sys.argv[-0]
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    out, files = args[0], args[1:]
    cols = int(os.environ.get('COLS', 4)); cell = int(os.environ.get('CELL', 320)); spp = int(os.environ.get('SPP', 12))
    tiles = []
    for i, f in enumerate(files):
        t = f'/tmp/_prev_{i}.png'; render_one(f, t, cell, spp); tiles.append((os.path.basename(f)[:-4], t))
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * cell, rows * cell), (40, 40, 44)); dr = ImageDraw.Draw(sheet)
    for i, (n, t) in enumerate(tiles):
        x, y = (i % cols) * cell, (i // cols) * cell; sheet.paste(Image.open(t).convert('RGB'), (x, y)); dr.text((x + 6, y + 6), n, fill=(255, 255, 255))
    sheet.save(out); print('sheet', out, len(tiles))
