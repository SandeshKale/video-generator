# Brass balance scale as three aligned ortho layers (stand / beam / pan) so the beam can tip as a function of t in the page.
import sys, math; sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import *
part = sys.argv[1]; out = sys.argv[2]; sc = setup((1000, 1000), 32)
brass = mat('brass', (0.95, 0.68, 0.22, 1), 1.0, 0.24); dark = mat('dark', (0.45, 0.28, 0.08, 1), 1.0, 0.35)
def cyl(r, d, loc, rot=(0, 0, 0), m=brass): bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, rotation=rot, vertices=48); o = bpy.context.object; o.data.materials.append(m); return o
def sph(r, loc, m=brass): bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=48, ring_count=24); o = bpy.context.object; o.data.materials.append(m); return o
if part == 'stand':
    cyl(0.9, 0.12, (0, 0, 0.06)); cyl(0.62, 0.16, (0, 0, 0.2)); cyl(0.1, 1.9, (0, 0, 1.2)); sph(0.16, (0, 0, 0.95)); sph(0.18, (0, 0, 2.2 - 0.12))
if part == 'beam':
    cyl(0.07, 3.0, (0, 0, 2.2), (0, math.pi / 2, 0)); sph(0.2, (0, 0, 2.2), dark); sph(0.1, (-1.5, 0, 2.2)); sph(0.1, (1.5, 0, 2.2)); cyl(0.04, 0.5, (0, 0, 2.5)); sph(0.07, (0, 0, 2.77))
if part == 'pan':
    # hangs from a point at (0,0,2.2); pan rim at z=1.1
    for k in range(3):
        a = k * 2 * math.pi / 3; wire(sc, [(0, 0, 2.2), (0.5 * math.cos(a), 0.5 * math.sin(a), 1.12)], brass, 0.012)
    bpy.ops.mesh.primitive_cone_add(radius1=0.58, radius2=0.52, depth=0.16, location=(0, 0, 1.06), vertices=64); o = bpy.context.object; o.data.materials.append(brass)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.55, minor_radius=0.03, location=(0, 0, 1.14)); o = bpy.context.object; o.data.materials.append(brass); sph(0.05, (0, 0, 2.2))
area((2, -4, 4), (math.radians(60), 0, math.radians(20)), 4, 300); area((-3, -3, 2), (math.radians(70), 0, math.radians(-40)), 4, 220); area((0, -2, 5), (math.radians(20), 0, 0), 5, 160)
cam_ortho(sc, (0, 1.7), 4.2)
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
