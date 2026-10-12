# Walnut card-catalogue cabinet: 4 x 6 = 24 drawers, each with a brass label holder and a ring pull.
# One drawer (OPEN) can be pulled out with its cards visible and one card lifted.
# Writes site/3d/<name>.png (transparent) + site/3d/<name>.json (projected label-plate centres and corners,
# so the page sets the label text in DOM type and can light a plate on cue).
# Run: python3 blender/cabinet.py <name> <pull 0..1> <lift 0..1> [spp] [view]
import bpy, sys, os, json, math, mathutils
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, os.path.dirname(__file__))
from common import setup, mat, area, bev, cam_persp

a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
NAME = a[0] if a else 'cabinet'; PULL = float(a[1]) if len(a) > 1 else 0.0; LIFT = float(a[2]) if len(a) > 2 else 0.0
SPP = int(a[3]) if len(a) > 3 else 40; VIEW = a[4] if len(a) > 4 else 'hero'
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', '3d')
COLS, ROWS, DW, DH, G = 4, 6, 0.36, 0.22, 0.022
OPEN = (1, 0)  # col, row (row 0 = top): the top row, so the lifted card reads against open air
W = COLS * DW + (COLS + 1) * G; H = ROWS * DH + (ROWS + 1) * G; D = 0.62; Z0 = 0.34
sc = setup(res=(1080, 1240), samples=SPP)
sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.20, 0.13, 0.09, 1)
sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.25

def walnut(name, scale=6.0, dark=1.0):
    # long horizontal grain: noise stretched along X, plus a faint figure wave; dark oiled walnut tones
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (0.35, 9, 9)
    ns = nt.nodes.new('ShaderNodeTexNoise'); ns.inputs['Scale'].default_value = scale; ns.inputs['Detail'].default_value = 8; ns.inputs['Roughness'].default_value = 0.6
    ramp = nt.nodes.new('ShaderNodeValToRGB'); e = ramp.color_ramp.elements
    e[0].position = 0.35; e[0].color = (0.035 * dark, 0.017 * dark, 0.009 * dark, 1); e[1].position = 0.7; e[1].color = (0.10 * dark, 0.05 * dark, 0.026 * dark, 1)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], ns.inputs['Vector'])
    nt.links.new(ns.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.38
    b.inputs['Coat Weight'].default_value = 0.4; b.inputs['Coat Roughness'].default_value = 0.18
    return m

WOOD = walnut('walnut'); WOOD2 = walnut('walnut2', 8.0, 1.25)
BRASS = mat('brass', (0.78, 0.55, 0.22, 1), metal=1.0, rough=0.28)
CARD = mat("card", (0.86, 0.81, 0.68, 1), rough=0.75)
LABEL = mat("label", (0.80, 0.75, 0.62, 1), rough=0.8)
SHADOW = mat('inside', (0.03, 0.015, 0.01, 1), rough=0.9)

def box(name, loc, size, m, b=0.004):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m)
    if b: bev(o, b, 2)
    return o

# carcass: back, sides, top, bottom, dividers
box('top', (0, D / 2, Z0 + H + 0.03), (W + 0.08, D + 0.06, 0.06), WOOD2, 0.012)
box('plinth', (0, D / 2 + 0.02, Z0 - 0.04), (W + 0.04, D, 0.08), WOOD2, 0.01)
box('back', (0, D, Z0 + H / 2), (W, 0.02, H), WOOD, 0)
for sx in (-1, 1): box('side', (sx * (W / 2 - G / 2), D / 2, Z0 + H / 2), (G, D, H), WOOD2, 0.004)
for r in range(ROWS + 1): box('rail', (0, D / 2, Z0 + H - r * (DH + G) - G / 2), (W, D, G), WOOD2, 0.003)
for c in range(1, COLS): box('stile', (-W / 2 + c * (DW + G) + G / 2, D / 2, Z0 + H / 2), (G, D, H), WOOD2, 0.003)
box('base', (0, D / 2 + 0.02, (Z0 - 0.08) / 2), (W - 0.02, D - 0.04, Z0 - 0.08), WOOD2, 0.01)

plates = []
def drawer(c, r, pull):
    x = -W / 2 + G + c * (DW + G) + DW / 2; z = Z0 + H - G - r * (DH + G) - DH / 2; y = -pull * 0.42
    objs = []
    objs.append(box('face', (x, y - 0.012, z), (DW - 0.006, 0.03, DH - 0.006), WOOD, 0.006))
    # brass label holder (frame) + cream label card
    px, pz = x, z + 0.035
    objs.append(box('holder', (px, y - 0.03, pz), (0.15, 0.008, 0.062), BRASS, 0.003))
    objs.append(box('label', (px, y - 0.035, pz), (0.13, 0.004, 0.044), LABEL, 0))
    # ring pull
    bpy.ops.mesh.primitive_torus_add(location=(x, y - 0.045, z - 0.045), rotation=(math.pi / 2, 0, 0), major_radius=0.026, minor_radius=0.005)
    t = bpy.context.object; t.data.materials.append(BRASS); objs.append(t)
    objs.append(box('ringmount', (x, y - 0.03, z - 0.022), (0.03, 0.01, 0.014), BRASS, 0.002))
    for s in (-1, 1): bpy.ops.mesh.primitive_cylinder_add(location=(px + s * 0.068, y - 0.035, pz), rotation=(math.pi / 2, 0, 0), radius=0.004, depth=0.006); bpy.context.object.data.materials.append(BRASS)
    plates.append(dict(c=c, r=r, p=(px, y - 0.04, pz)))
    if pull > 0:  # drawer box with cards
        L = 0.5; yb = y + L / 2
        box('dfloor', (x, yb, z - DH / 2 + 0.015), (DW - 0.03, L, 0.012), WOOD2, 0)
        for s in (-1, 1): box('dside', (x + s * (DW / 2 - 0.02), yb, z - 0.01), (0.012, L, DH - 0.06), WOOD2, 0.002)
        box('dback', (x, y + L, z - 0.01), (DW - 0.03, 0.012, DH - 0.06), WOOD2, 0)
        box('dark', (x, yb + 0.05, z - 0.03), (DW - 0.06, L - 0.12, 0.01), SHADOW, 0)
        n = 22
        for i in range(n):
            cy = y + 0.05 + i * 0.019; ch = 0.13 + (0.012 if i % 5 == 0 else 0)
            lift = LIFT * 0.24 if i == 3 else 0
            cd = box('card', (x, cy, z - DH / 2 + 0.02 + ch / 2 + lift), (DW - 0.06, 0.0025, ch), CARD, 0)
            cd.rotation_euler[0] = math.radians(-8 + (i % 3) * 1.5)
            if i % 5 == 0:  # tab
                box('tab', (x - 0.09 + (i % 3) * 0.09, cy, z - DH / 2 + 0.02 + ch + 0.012 + lift), (0.06, 0.0025, 0.024), CARD, 0)
            if i == 3: plates.append(dict(card=True, p=(x, cy - 0.003, z - DH / 2 + 0.02 + ch / 2 + lift + 0.03)))
for c in range(COLS):
    for r in range(ROWS): drawer(c, r, PULL if (c, r) == OPEN else 0.0)

# floor (warm boards) + reading-lamp light
bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0)); bpy.context.object.is_shadow_catcher = True
area((-1.6, -1.8, 3.2), (math.radians(40), math.radians(-25), 0), 1.2, 520, (1.0, 0.78, 0.5))
area((2.4, -2.0, 1.4), (math.radians(80), 0, math.radians(50)), 2.5, 120, (0.75, 0.82, 1.0))
area((0, 2.5, 3), (math.radians(-40), 0, 0), 3, 160, (1.0, 0.85, 0.6))
VIEWS = {'hero': ((1.0, -2.45, 1.75), (0.0, 0.25, 1.0), 40), 'front': ((0.0, -3.6, 1.15), (0.0, 0.2, 1.05), 42), 'close': ((0.55, -1.35, 1.55), (-0.02, 0.0, 1.12), 40), 'cover': ((1.0, -2.45, 1.95), (-0.19, -0.25, 1.72), 95)}
loc, tgt, lens = VIEWS[VIEW]
cam_persp(sc, loc, tgt, lens)
bpy.context.view_layer.update()
res = sc.render
out = []
for p in plates:
    v = world_to_camera_view(sc, sc.camera, mathutils.Vector(p['p']))
    d = {k: p[k] for k in p if k != 'p'}; d['x'] = round(v.x * res.resolution_x, 1); d['y'] = round((1 - v.y) * res.resolution_y, 1)
    # plate width in px (project its two ends)
    a1 = world_to_camera_view(sc, sc.camera, mathutils.Vector((p['p'][0] - 0.065, p['p'][1], p['p'][2])))
    a2 = world_to_camera_view(sc, sc.camera, mathutils.Vector((p['p'][0] + 0.065, p['p'][1], p['p'][2])))
    d['w'] = round((a2.x - a1.x) * res.resolution_x, 1); d['skew'] = round(math.degrees(math.atan2((a1.y - a2.y) * res.resolution_y, (a2.x - a1.x) * res.resolution_x)), 2)
    out.append(d)
sc.render.filepath = os.path.join(OUT, NAME + '.png')
json.dump(dict(w=res.resolution_x, h=res.resolution_y, plates=out), open(os.path.join(OUT, NAME + '.json'), 'w'))
bpy.ops.render.render(write_still=True)
print('wrote', sc.render.filepath)
