# Blender centrepiece for "date locked": a film clapperboard whose clapstick snaps shut.
# 9 frames, clapstick open 34 deg -> 0 (closed) -> site/3d/clap0..8.png, scrubbed by t on the word "बदलेगी".
# The slate's chalk areas are left blank; site/3d/clap.js holds the projected corners so the page sets the text in DOM type.
# Run: python3 blender/clapper.py   (bpy module, Cycles CPU)
import bpy, math, os, json, sys, mathutils
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../tech/reel-ai-trading-pipeline/blender'))
from common import setup, mat, area, bev, cam_persp
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../site/3d'); os.makedirs(OUT, exist_ok=True)
RES = (760, 700); SPP = int(os.environ.get('SPP', 40)); FR = os.environ.get('FRAMES')
def srgb(h, a=1):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (a,)
def box(name, loc, size, m, bevel=0.02, seg=3):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    if bevel: bev(o, bevel, seg)
    o.data.materials.append(m); return o
def stripes(name, sign=1):
    # diagonal black/white bands in object space (classic clapstick)
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = 0.35
    tc = nt.nodes.new('ShaderNodeTexCoord'); sp = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sp.inputs[0])
    ad = nt.nodes.new('ShaderNodeMath'); ad.operation = 'ADD' if sign > 0 else 'SUBTRACT'; nt.links.new(sp.outputs[0], ad.inputs[0]); nt.links.new(sp.outputs[2], ad.inputs[1])
    mu = nt.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = 2.6; nt.links.new(ad.outputs[0], mu.inputs[0])
    fr = nt.nodes.new('ShaderNodeMath'); fr.operation = 'FRACT'; nt.links.new(mu.outputs[0], fr.inputs[0])
    gt = nt.nodes.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.5; nt.links.new(fr.outputs[0], gt.inputs[0])
    mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.inputs[6].default_value = srgb('#121214'); mx.inputs[7].default_value = srgb('#f2efe8')
    nt.links.new(gt.outputs[0], mx.inputs[0]); nt.links.new(mx.outputs[2], b.inputs['Base Color']); return m

sc = setup(RES, SPP); sc.render.film_transparent = True; sc.view_settings.view_transform = 'AgX'
board = mat('board', srgb('#0e0d11'), 0, 0.6); chalk = mat('chalk', srgb('#151419'), 0, 0.9); line = mat('line', srgb('#d9d4ca'), 0, 0.7)
hinge_m = mat('hinge', srgb('#b9b4ac'), 0.9, 0.25)
# slate: x across, z up, y depth (front face at y=-0.05)
box('slate', (0, 0, 0), (3.0, 0.1, 2.2), board, 0.03)
for zz in (0.42, -0.18): box('rule', (0, -0.052, zz), (2.8, 0.004, 0.025), line, 0)
box('vrule', (0.2, -0.052, -0.48), (0.025, 0.004, 0.6), line, 0)
box('base_strip', (0, -0.002, 1.18), (3.0, 0.1, 0.16), stripes('st0'), 0.01)
hinge = bpy.data.objects.new('hinge', None); sc.collection.objects.link(hinge); hinge.location = (-1.5, 0, 1.28)
stick = box('stick', (0, 0, 1.36), (3.0, 0.1, 0.16), stripes('st1', -1), 0.01)
stick.parent = hinge; stick.matrix_parent_inverse = hinge.matrix_world.inverted()
bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=0.16, location=(-1.42, 0, 1.28), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(hinge_m)
area((-2.5, -3.5, 3.2), (math.radians(55), 0, math.radians(-35)), 3.5, 380, (1, 0.93, 0.88))
area((3.0, -2.5, 1.0), (math.radians(80), 0, math.radians(50)), 3, 140, (0.85, 0.9, 1))
area((0, 2.5, 3.0), (math.radians(-40), 0, 0), 3, 160, (1, 0.35, 0.3))  # crimson rim from behind
cam_persp(sc, (0.55, -7.0, 1.2), (0.0, 0.0, 0.95), 46)
ANG = [27, 26, 23.5, 19.5, 14, 8.5, 4, 1.2, 0]; A = []
def anchors(objs):
    r = {}
    for k, p in objs.items():
        v = world_to_camera_view(sc, sc.camera, mathutils.Vector(p)); r[k] = [round(v.x * RES[0], 1), round((1 - v.y) * RES[1], 1)]
    return r
for i, a in enumerate(ANG):
    hinge.rotation_euler[1] = math.radians(-a); bpy.context.view_layer.update()
    tip = stick.matrix_world @ mathutils.Vector((1.5, 0, 0.08))
    sc.render.filepath = f'{OUT}/clap{i}.png'
    if not FR or str(i) in FR.split(','): bpy.ops.render.render(write_still=True); print('clap', i, flush=True)
    A.append(anchors({'tip': tuple(tip)}))
# chalk areas (front face y=-0.055): row 1 (z 0.42..1.05), row 2 (z -0.18..0.42), row 3 left/right (z -1.05..-0.18)
P = anchors({'r1tl': (-1.4, -0.055, 1.05), 'r1br': (1.4, -0.055, 0.44), 'r2tl': (-1.4, -0.055, 0.40), 'r2br': (1.4, -0.055, -0.16),
             'r3tl': (-1.4, -0.055, -0.2), 'r3m': (0.2, -0.055, -1.05), 'r3br': (1.4, -0.055, -1.05)})
open(f'{OUT}/clap.js', 'w').write('window.CLAP=' + json.dumps({'res': RES, 'A': A, 'P': P}) + ';\n')
print('done')
