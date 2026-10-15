# Tool-tile wall for scene 5: the official TradingView connector's 35 tools as metal key-caps on an aluminium plate
# (7 x 5: 25 read = blue, 10 write = amber). Four read keys are engraved CHARTS / SCREENER / NEWS / ALERTS.
# Renders two states with the same camera: site/3d/tiles_off.png (all dark) and tiles_on.png (every key backlit);
# the page reveals keys one by one by masking tiles_on with circles at the projected key centres (site/3d/tiles.json).
# Run: python3 blender/tiles.py [spp]
import bpy, math, sys, os, json
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, os.path.dirname(__file__)); from common import setup, mat, area, bev, cam_persp
SPP = int(sys.argv[1]) if len(sys.argv) > 1 else 32
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', '3d'); FONT = '/tmp/bf/ChakraPetch-Bold.ttf'
def srgb(h): h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return tuple(((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92 for v in c) + (1,)
COLS, ROWS, P = 7, 5, 0.62
LAB = {(0, 0): 'CHARTS', (2, 0): 'SCREENER', (4, 0): 'NEWS', (6, 0): 'ALERTS'}
RES = (1000, 760); centers = {}
for STATE in ('off', 'on'):
    sc = setup(res=RES, samples=SPP)
    plate = mat('plate', srgb('#c9ced4'), metal=0.9, rough=0.35); capm = mat('cap', srgb('#1b1e22'), metal=0.3, rough=0.4); ink = mat('ink', srgb('#eef1f4'), rough=0.5)
    def emis(name, col, s):
        m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = srgb('#1b1e22')
        b.inputs['Emission Color'].default_value = srgb(col); b.inputs['Emission Strength'].default_value = s; return m
    font = bpy.data.fonts.load(FONT)
    W, H = COLS * P + 0.3, ROWS * P + 0.3
    bpy.ops.mesh.primitive_cube_add(size=1); pl = bpy.context.object; pl.scale = (W, H, 0.12); pl.location = (0, 0, -0.06); pl.data.materials.append(plate); bev(pl, 0.03, 2)
    keys = []
    for r in range(ROWS):
        for c in range(COLS):
            i = r * COLS + c; write = i >= 25; x = (c - (COLS - 1) / 2) * P; y = ((ROWS - 1) / 2 - r) * P
            bpy.ops.mesh.primitive_cube_add(size=1); k = bpy.context.object; k.scale = (P * 0.84, P * 0.84, 0.16); k.location = (x, y, 0.08); bev(k, 0.06, 3)
            k.data.materials.append(capm)
            # backlit ring under each key
            bpy.ops.mesh.primitive_cube_add(size=1); g = bpy.context.object; g.scale = (P * 0.9, P * 0.9, 0.02); g.location = (x, y, 0.005)
            g.data.materials.append(emis('g%d' % i, '#ff8a00' if write else '#2f7bff', 6.0) if STATE == 'on' else mat('go%d' % i, srgb('#0d0f11'), rough=0.6))
            # key top glyph: label text for the four named keys, a small dot otherwise
            if (c, r) in LAB:
                cu = bpy.data.curves.new('t', 'FONT'); cu.body = LAB[(c, r)]; cu.font = font; cu.size = 0.125; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.extrude = 0.003
                o = bpy.data.objects.new('t', cu); sc.collection.objects.link(o); o.location = (x, y, 0.165)
                o.data.materials.append(emis('lt%d' % i, '#cfe2ff', 3.0) if STATE == 'on' else ink)
            else:
                bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.01, location=(x, y + 0.12, 0.165)); bpy.context.object.data.materials.append(emis('d%d' % i, '#ff8a00' if write else '#2f7bff', 4.0) if STATE == 'on' else ink)
            keys.append((i, (x, y, 0.16)))
    area((-3, -4, 6), (math.radians(35), 0, math.radians(-30)), 6, 700); area((4, -3, 3), (math.radians(60), 0, math.radians(50)), 4, 260, (0.85, 0.9, 1))
    cam_persp(sc, (0, -5.2, 5.4), (0, -0.1, 0), lens=48)
    if STATE == 'off':
        bpy.context.view_layer.update()
        for i, p in keys:
            v = world_to_camera_view(sc, sc.camera, __import__('mathutils').Vector(p)); centers[i] = [round(v.x * RES[0], 1), round((1 - v.y) * RES[1], 1)]
    sc.render.filepath = os.path.join(OUT, 'tiles_%s.png' % STATE); bpy.ops.render.render(write_still=True)
open(os.path.join(OUT, 'tiles.js'), 'w').write('window.TILES=' + json.dumps({'res': RES, 'c': [centers[i] for i in range(35)]}) + ';\n')
json.dump({'res': RES, 'c': [centers[i] for i in range(35)], 'named': {LAB[k]: k[1] * COLS + k[0] for k in LAB}}, open(os.path.join(OUT, 'tiles.json'), 'w'))
print('done')
