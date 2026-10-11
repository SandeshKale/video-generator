# Procedural laptop: aluminium base, key grid, trackpad, lid at a given angle with a glowing teal screen. Usage: python3 laptop.py out.png [lid_deg]
import sys, math; sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import *
out = sys.argv[1]; lid = float(sys.argv[2]) if len(sys.argv) > 2 else 108
sc = setup((900, 800), 32)
alu = mat('alu', (0.78, 0.8, 0.82, 1), 1.0, 0.28); dark = mat('dark', (0.05, 0.055, 0.06, 1), 0.0, 0.5); key = mat('key', (0.1, 0.11, 0.12, 1), 0.0, 0.45)
scr = mat('scr', (0.04, 0.5, 0.46, 1), 0.0, 0.4); b = scr.node_tree.nodes['Principled BSDF']; b.inputs['Emission Color'].default_value = (0.1, 0.8, 0.7, 1); b.inputs['Emission Strength'].default_value = 0.65
ui = mat('ui', (0.95, 0.93, 0.85, 1), 0.0, 0.5); b2 = ui.node_tree.nodes['Principled BSDF']; b2.inputs['Emission Color'].default_value = (0.95, 0.93, 0.85, 1); b2.inputs['Emission Strength'].default_value = 0.9
coral = mat('coral', (1.0, 0.35, 0.27, 1), 0.0, 0.4)
def box(sz, loc, m, bw=0.02, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot); o = bpy.context.object; o.scale = sz; o.data.materials.append(m); bev(o, bw, 3); return o
W, Dp = 3.4, 2.3
box((W, Dp, 0.14), (0, 0, 0.07), alu, 0.05)                                   # base
for r in range(5):                                                             # keys
    for c in range(13): box((0.2, 0.2, 0.05), (-1.5 + c * 0.25, 0.55 - r * 0.25 + (0.0), 0.16), key, 0.01)
box((1.1, 0.7, 0.02), (0, -0.78, 0.15), dark, 0.02)                           # trackpad
# lid pivots on the back edge (y = +Dp/2) of the base; build it around an empty at the hinge
bpy.ops.object.empty_add(location=(0, Dp / 2, 0.14)); hinge = bpy.context.object
lidb = box((W, 0.08, 2.15), (0, 0, 1.075), alu, 0.05); lidb.parent = hinge
scrp = box((W - 0.22, 0.02, 1.93), (0, -0.05, 1.08), scr, 0.01); scrp.parent = hinge
for i, (y, w) in enumerate([(1.55, 1.6), (1.2, 2.2), (0.9, 1.1), (0.6, 1.8)]):  # screen UI lines (terminal-ish)
    bx = box((w, 0.02, 0.07), (-1.35 + w / 2, -0.07, y), ui, 0.005); bx.parent = hinge
bx = box((0.16, 0.02, 0.16), (1.25, -0.07, 0.3), coral, 0.01); bx.parent = hinge
hinge.rotation_euler = (math.radians(lid - 90), 0, 0)                          # 90 = vertical; >90 leans back
shadow_floor()
area((2.5, -3.5, 4), (math.radians(55), 0, math.radians(25)), 3.5, 200); area((-3, -2, 2.5), (math.radians(65), 0, math.radians(-40)), 3.0, 80, (0.8, 1.0, 0.95)); area((0, 3, 3), (math.radians(110), 0, 0), 3.0, 90, (1.0, 0.9, 0.9))
cam_persp(sc, (3.6, -5.2, 2.6), (0, 0, 1.0), 45)
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
