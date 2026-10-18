# Blender centrepiece for the battery roast: a bed corner with a phone charging under the pillow.
# A: 9 frames, the pillow lifts off the hot phone (orange glow underneath) -> site/3d/bed_a0..8.png (scrubbed by t)
# B: 1 frame, the phone cooling on a bedside table in blue light -> site/3d/bed_b.png
# Also writes site/3d/bed.js: projected 2D anchors (phone centre, pillow front) per frame, for DOM overlays.
# Run: python3 blender/bed.py   (bpy module, Cycles CPU)
import bpy, math, os, json, sys, mathutils
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../reel-ai-trading-pipeline/blender'))
from common import setup, mat, area, wire, bev, cam_persp
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../site/3d'); os.makedirs(OUT, exist_ok=True)
RES = (820, 700); SPP = int(os.environ.get('SPP', 40)); ONLY = os.environ.get('ONLY', 'AB'); FR = os.environ.get('FRAMES')  # FRAMES='0,8' renders only those A frames (tests)
def srgb(h, a=1):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (a,)
def box(name, loc, size, m, bevel=0.04, seg=4, sub=0):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    if bevel: bev(o, bevel, seg)
    if sub: o.modifiers.new('s', 'SUBSURF').levels = sub; o.modifiers['s'].render_levels = sub
    o.data.materials.append(m); bpy.ops.object.shade_smooth(); return o
def emit(name, col, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = col; e.inputs[1].default_value = strength
    o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def phone(loc, rz, screen):
    body = box('phone', loc, (0.40, 0.82, 0.045), mat('ph', srgb('#1b1d22'), 0.4, 0.3), 0.03, 4)
    scr = box('screen', (loc[0], loc[1], loc[2] + 0.024), (0.36, 0.76, 0.004), screen, 0.0)
    for o in (body, scr): o.rotation_euler[2] = rz
    return body
def anchors(sc, objs):
    cam = sc.camera; r = {}
    for k, p in objs.items():
        v = world_to_camera_view(sc, cam, mathutils.Vector(p)); r[k] = [round(v.x * RES[0], 1), round((1 - v.y) * RES[1], 1)]
    return r

def scene_a():
    sc = setup(RES, SPP); sc.render.film_transparent = True; sc.view_settings.view_transform = 'AgX'
    sheet = mat('sheet', srgb('#efe8dc'), 0, 0.85); duvet = mat('duvet', srgb('#8fb4d0'), 0, 0.9); pill = mat('pill', srgb('#fbf6ee'), 0, 0.8)
    box('mattress', (0, 0, 0.22), (3.4, 2.4, 0.44), sheet, 0.08, 5)
    box('duvet', (0, -0.86, 0.5), (3.5, 0.78, 0.16), duvet, 0.07, 5, sub=1)
    box('headboard', (0, 1.28, 0.95), (3.5, 0.18, 1.5), mat('hb', srgb('#9aa9b8'), 0, 0.7), 0.08, 4)
    ph = phone((0.05, 0.28, 0.468), math.radians(-12), emit('scr', srgb('#ff7a2a'), 2.2))
    wire(sc, [(0.0, 0.0, 0.47), (-0.25, -0.05, 0.47), (-0.9, 0.05, 0.47), (-1.5, 0.3, 0.46), (-1.72, 0.3, 0.2), (-1.74, 0.3, -0.2)], mat('cab', srgb('#f2f2f2'), 0, 0.4), 0.012)
    hinge = bpy.data.objects.new('hinge', None); sc.collection.objects.link(hinge); hinge.location = (0, 0.98, 0.47)
    pl = box('pillow', (0, 0.5, 0.64), (1.75, 0.92, 0.34), pill, 0.12, 3, sub=2)
    pl.parent = hinge; pl.matrix_parent_inverse = hinge.matrix_world.inverted()
    bpy.ops.object.light_add(type='POINT', location=(0.05, 0.3, 0.56)); hot = bpy.context.object; hot.data.energy = 45; hot.data.color = (1, 0.42, 0.12); hot.data.shadow_soft_size = 0.3
    area((-2.2, -2.4, 4.0), (math.radians(40), 0, math.radians(-35)), 3.5, 260, (1, 0.96, 0.9))
    area((2.6, -1.5, 2.5), (math.radians(55), 0, math.radians(50)), 3, 70, (0.85, 0.9, 1))
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0)); bpy.context.object.is_shadow_catcher = True
    cam_persp(sc, (0.0, -3.0, 4.6), (0.0, 0.32, 0.4), 40)
    ANG = [0, -4, -11, -20, -31, -43, -55, -64, -70]; A = []
    for i, a in enumerate(ANG):
        hinge.rotation_euler[0] = math.radians(a); bpy.context.view_layer.update()
        front = pl.matrix_world @ mathutils.Vector((0, -0.46, 0))
        sc.render.filepath = f'{OUT}/bed_a{i}.png'
        if 'A' in ONLY and (not FR or str(i) in FR.split(',')): bpy.ops.render.render(write_still=True); print('A', i, flush=True)
        A.append(anchors(sc, {'phone': (0.05, 0.28, 0.5), 'front': tuple(front), 'top': (0.0, 0.6, 1.0)}))
    return A

def scene_b():
    sc = setup(RES, SPP); sc.render.film_transparent = True; sc.view_settings.view_transform = 'AgX'
    wood = mat('wood', srgb('#c9935f'), 0, 0.55)
    box('table', (0, 0, 0.45), (1.6, 1.1, 0.9), wood, 0.05, 4)
    box('drawer', (0, -0.56, 0.48), (1.2, 0.03, 0.34), mat('dr', srgb('#b98252'), 0, 0.5), 0.02, 3)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(0, -0.6, 0.48)); bpy.context.object.data.materials.append(mat('knob', srgb('#e9d9b9'), 0.6, 0.3))
    phone((0.05, 0.05, 0.925), math.radians(18), emit('scr2', srgb('#39c5ff'), 0.8))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=0.08, location=(-0.5, 0.25, 0.94)); bpy.context.object.data.materials.append(mat('mug', srgb('#f4efe6'), 0, 0.35))
    area((-1.8, -2.0, 3.0), (math.radians(45), 0, math.radians(-40)), 3, 170, (0.75, 0.86, 1))
    area((2.0, -1.2, 2.2), (math.radians(55), 0, math.radians(50)), 2.5, 60, (0.9, 0.95, 1))
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0)); bpy.context.object.is_shadow_catcher = True
    cam_persp(sc, (0.0, -3.1, 2.75), (0.0, 0.0, 0.62), 45)
    sc.render.filepath = f'{OUT}/bed_b.png'
    if 'B' in ONLY: bpy.ops.render.render(write_still=True); print('B', flush=True)
    return anchors(sc, {'phone': (0.05, 0.05, 0.95)})

A = scene_a() if 'A' in ONLY or not os.path.exists(f'{OUT}/bed.js') else None
B = scene_b()
if A is None: A = json.loads(open(f'{OUT}/bed.js').read().split('=', 1)[1].rstrip(';\n'))['A']
open(f'{OUT}/bed.js', 'w').write('window.BED=' + json.dumps({'res': RES, 'A': A, 'B': B}) + ';\n')
print('wrote anchors')
