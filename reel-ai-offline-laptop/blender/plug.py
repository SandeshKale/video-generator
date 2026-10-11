# A power plug pulled out of a cloud-powered socket: 10 frames, plug slides away and the cord goes taut. Usage: python3 plug.py outdir
import sys, math; sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import *
out = sys.argv[1]; N = 10
sc = setup((800, 600), 30)
cream = mat('cream', (0.95, 0.92, 0.84, 1), 0.0, 0.4); ink = mat('ink', (0.07, 0.08, 0.09, 1), 0.0, 0.5); chrome = mat('chrome', (0.9, 0.92, 0.95, 1), 1.0, 0.15); coral = mat('coral', (1.0, 0.35, 0.27, 1), 0.0, 0.45); teal = mat('teal', (0.1, 0.76, 0.7, 1), 0.0, 0.4)
def box(sz, loc, m, bw=0.03):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.scale = sz; o.data.materials.append(m); bev(o, bw, 3); return o
def sph(r, loc, m): bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=40, ring_count=20); o = bpy.context.object; o.data.materials.append(m); return o
# cloud (coral): cluster of spheres, sits right/top
for (x, z, r) in [(1.9, 1.9, .55), (2.4, 2.05, .7), (2.95, 1.9, .5), (2.4, 1.6, .65), (1.95, 1.6, .45), (2.9, 1.62, .45)]: sph(r, (x, 0, z), coral)
# socket block (ink) with two slots, teal frame
box((0.5, 0.9, 1.1), (-1.55, 0, 1.0), ink, 0.05); box((0.08, 0.5, 0.7), (-1.28, 0, 1.0), teal, 0.02)
for dz in (-0.18, 0.18): box((0.06, 0.05, 0.26), (-1.27, 0, 1.0 + dz), chrome, 0.005)
cord = None
def build(px):
    global cord
    if cord is not None: bpy.data.objects.remove(cord, do_unlink=True)
    a = (px + 0.55, 0, 1.0); b = (2.3, 0, 1.55); sag = max(0.0, 0.9 - (px + 1.0) * 0.6)
    pts = []
    for k in range(25):
        u = k / 24; x = a[0] + (b[0] - a[0]) * u; z = a[2] + (b[2] - a[2]) * u - math.sin(u * math.pi) * sag
        pts.append((x, 0, z))
    cord = wire(sc, pts, ink, 0.05)
plug = box((0.7, 0.8, 0.9), (0, 0, 1.0), cream, 0.08)
pr = [box((0.35, 0.06, 0.16), (0, 0, 1.0), chrome, 0.005) for _ in range(2)]
shadow_floor()
area((2.5, -4, 4), (math.radians(55), 0, math.radians(20)), 3.5, 150); area((-3, -3, 3), (math.radians(60), 0, math.radians(-30)), 3.0, 70); area((0, 0, 5), (0, 0, 0), 4.0, 60)
cam_persp(sc, (0.9, -7.2, 2.0), (0.7, 0, 1.4), 40)
for i in range(N):
    t = i / (N - 1); e = t * t * (3 - 2 * t); px = -0.95 + 1.5 * e
    plug.location = (px, 0, 1.0); plug.rotation_euler = (0, 0, 0.12 * math.sin(t * math.pi))
    for j, dz in enumerate((-0.18, 0.18)): pr[j].location = (px - 0.52, 0, 1.0 + dz)
    build(px); sc.render.filepath = f'{out}/plug_{i:02d}.png'; bpy.ops.render.render(write_still=True)
