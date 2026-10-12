# Hero twin-bell alarm clock in sunrise coral with chrome bells, rendered once with a blank dial (12 hour ticks only).
# The page draws the hands in SVG over the projected dial (site/3d/clock.json: centre + 3 o'clock + 12 o'clock points),
# so the time is an exact function of t. Run: python3 blender/clock.py [spp]
import bpy, sys, os, json, math, mathutils
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, os.path.dirname(__file__))
from common import setup, mat, area, bev, cam_persp
SPP = int(sys.argv[1]) if len(sys.argv) > 1 else 48
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', '3d')
sc = setup(res=(900, 1000), samples=SPP)
sc.world.node_tree.nodes['Background'].inputs[0].default_value = (1.0, 0.86, 0.74, 1); sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.2
CORAL = mat('coral', (0.95, 0.30, 0.20, 1), metal=0.15, rough=0.3); CHROME = mat('chrome', (0.9, 0.9, 0.92, 1), metal=1.0, rough=0.15)
DIAL = mat('dial', (0.98, 0.95, 0.88, 1), rough=0.55); INK = mat('ink', (0.1, 0.1, 0.13, 1), rough=0.4); GLASS = mat('glass', (1, 1, 1, 1), rough=0.02)
GLASS.node_tree.nodes['Principled BSDF'].inputs['Transmission Weight'].default_value = 1.0
R = 1.0
def cyl(r, d, loc, m, rot=(math.pi / 2, 0, 0), b=0.0, verts=96):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, rotation=rot, vertices=verts); o = bpy.context.object; o.data.materials.append(m)
    if b: bev(o, b, 4)
    bpy.ops.object.shade_smooth(); return o
cyl(R, 0.55, (0, 0, 0), CORAL, b=0.12)                       # body
bpy.ops.mesh.primitive_torus_add(major_radius=R * 0.94, minor_radius=0.075, location=(0, -0.28, 0), rotation=(math.pi / 2, 0, 0), major_segments=96); bpy.context.object.data.materials.append(CHROME); bpy.ops.object.shade_smooth()   # front bezel ring
cyl(R * 0.88, 0.02, (0, -0.27, 0), DIAL)                    # dial
for h in range(12):                                         # hour ticks
    a = h / 12 * 2 * math.pi; L = 0.16 if h % 3 == 0 else 0.09
    x, z = math.sin(a) * (R * 0.88 - 0.06 - L / 2), math.cos(a) * (R * 0.88 - 0.06 - L / 2)
    bpy.ops.mesh.primitive_cube_add(location=(x, -0.285, z), rotation=(0, a, 0)); t = bpy.context.object; t.scale = (0.025 if h % 3 else 0.04, 0.005, L / 2); t.data.materials.append(INK)
cyl(0.05, 0.03, (0, -0.30, 0), CHROME)                      # centre cap
for s in (-1, 1):                                           # bells + posts + feet
    a = math.radians(38 * s)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.42, location=(math.sin(a) * 1.18, 0.02, math.cos(a) * 1.18)); b = bpy.context.object
    b.scale = (1, 1, 0.62); b.rotation_euler = (0, a, 0); b.data.materials.append(CHROME); bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.5, location=(math.sin(a) * 0.95, 0.02, math.cos(a) * 0.95), rotation=(0, a, 0)); bpy.context.object.data.materials.append(CHROME)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.5, location=(s * 0.62, 0.0, -1.05), rotation=(0, math.radians(-25 * s), 0)); bpy.context.object.data.materials.append(CHROME)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, location=(s * 0.73, 0.0, -1.28)); bpy.context.object.data.materials.append(CHROME); bpy.ops.object.shade_smooth()
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.5, location=(0, 0.02, 1.2)); bpy.context.object.data.materials.append(CHROME)   # hammer
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, location=(0, 0.02, 1.45)); bpy.context.object.data.materials.append(CHROME); bpy.ops.object.shade_smooth()
bpy.ops.mesh.primitive_torus_add(major_radius=0.32, minor_radius=0.045, location=(0, 0.02, 1.25), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(CHROME)
bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, -1.37)); bpy.context.object.is_shadow_catcher = True
area((-2.5, -3.5, 3), (math.radians(55), 0, math.radians(-35)), 3.5, 170, (1.0, 0.86, 0.72))
area((3.0, -1.5, 1.0), (math.radians(80), 0, math.radians(60)), 2.5, 60, (0.75, 0.85, 1.0))
area((0, 3, 3), (math.radians(-45), 0, 0), 3, 120, (1.0, 0.95, 0.9))
cam_persp(sc, (3.3, -4.6, 1.5), (0.0, 0.1, 0.1), 50)
bpy.context.view_layer.update()
def P(v):
    q = world_to_camera_view(sc, sc.camera, mathutils.Vector(v)); return [round(q.x * sc.render.resolution_x, 1), round((1 - q.y) * sc.render.resolution_y, 1)]
r = R * 0.88
json.dump({'w': 900, 'h': 1000, 'c': P((0, -0.30, 0)), 'x': P((r, -0.30, 0)), 'y': P((0, -0.30, r))}, open(os.path.join(OUT, 'clock.json'), 'w'))
sc.render.filepath = os.path.join(OUT, 'clock.png'); bpy.ops.render.render(write_still=True); print('wrote clock')
