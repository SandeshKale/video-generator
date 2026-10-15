# A wall of identical delivery boxes ("the wrong thing x40"): 5 wide x 8 high, kraft with a magenta band.
import sys, random, math; sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import *
out = sys.argv[1]; sc = setup((900, 1100), 36); random.seed(11)
kraft = mat('kraft', (0.6, 0.38, 0.2, 1), 0, 0.7); band = mat('band', (0.9, 0.02, 0.2, 1), 0, 0.4); tape = mat('tape', (0.9, 0.82, 0.62, 1), 0, 0.5)
for r in range(8):
    for c in range(5):
        x = (c - 2) * 0.62 + (0.31 if r % 2 else 0) + random.uniform(-.015, .015); z = 0.25 + r * 0.5
        if abs(x) > 1.45: continue
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, random.uniform(-.03, .03), z), rotation=(0, 0, random.uniform(-.05, .05))); o = bpy.context.object; o.scale = (0.58, 0.5, 0.46); o.data.materials.append(kraft); bev(o, 0.02, 2)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -0.26, z), rotation=(0, 0, 0)); b = bpy.context.object; b.scale = (0.5, 0.012, 0.13); b.data.materials.append(band)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, -0.26, z + 0.2), rotation=(0, 0, 0)); b = bpy.context.object; b.scale = (0.06, 0.013, 0.08); b.data.materials.append(tape)
shadow_floor()
area((2.5, -4, 4.5), (math.radians(55), 0, math.radians(25)), 4, 170); area((-3, -3, 3), (math.radians(60), 0, math.radians(-30)), 4, 90); area((0, 0, 6), (0, 0, 0), 5, 60)
cam_persp(sc, (0.6, -7.2, 2.6), (0, 0, 1.9), 46)
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
