# Tripod turnstile turntable: 12 frames over 120 deg (3-fold symmetry => seamless loop). Usage: python3 turnstile.py outdir
import sys, math; sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import *
out = sys.argv[1]; N = 12
sc = setup((620, 700), 30)
chrome = mat('chrome', (0.9, 0.92, 0.95, 1), 1.0, 0.12); org = mat('org', (1.0, 0.3, 0.02, 1), 0.0, 0.35); ink = mat('ink', (0.06, 0.06, 0.06, 1), 0.0, 0.5); bone = mat('bone', (0.93, 0.9, 0.84, 1), 0.0, 0.4)
def cyl(r, d, loc, m, rot=(0, 0, 0)): bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, rotation=rot, vertices=48); o = bpy.context.object; o.data.materials.append(m); return o
# body: ink housing with orange coin plate and bone sign
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.55)); h = bpy.context.object; h.scale = (0.5, 0.5, 1.1); h.data.materials.append(ink); bev(h, 0.05, 4)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.26, 0.82)); p = bpy.context.object; p.scale = (0.34, 0.02, 0.3); p.data.materials.append(org); bev(p, 0.01, 2)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.265, 0.84)); sl = bpy.context.object; sl.scale = (0.2, 0.02, 0.04); sl.data.materials.append(ink)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.13)); t = bpy.context.object; t.scale = (0.56, 0.56, 0.05); t.data.materials.append(chrome); bev(t, 0.02, 3)
cyl(0.09, 0.3, (0, 0, 1.3), chrome)
# rotor (parented to an empty so we can spin it)
bpy.ops.object.empty_add(location=(0, 0, 0)); rot = bpy.context.object
for k in range(3):
    a = k * 2 * math.pi / 3
    bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.95, location=(0.47 * math.cos(a), 0.47 * math.sin(a), 1.3 - 0.0), rotation=(0, math.pi / 2, a), vertices=24)
    arm = bpy.context.object; arm.data.materials.append(chrome); arm.parent = rot
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.055, location=(0.94 * math.cos(a), 0.94 * math.sin(a), 1.3)); s = bpy.context.object; s.data.materials.append(org); s.parent = rot
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=(0, 0, 1.3)); c = bpy.context.object; c.data.materials.append(chrome); c.parent = rot
shadow_floor()
area((2.5, -3, 4), (math.radians(55), 0, math.radians(30)), 3.5, 160); area((-3, 2, 3), (math.radians(60), 0, math.radians(-130)), 3.0, 80, (1, .9, .8)); area((0, 0, 5), (0, 0, 0), 4.0, 70)
cam_persp(sc, (1.9, -2.6, 1.6), (0, 0, 1.0), 40)
for i in range(N):
    rot.rotation_euler = (0, 0, i * (2 * math.pi / 3) / N); sc.render.filepath = f'{out}/ts_{i:02d}.png'; bpy.ops.render.render(write_still=True)
