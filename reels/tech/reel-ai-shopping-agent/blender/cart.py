# Procedural chrome shopping cart with colourful products, rendered on a transparent film (Cycles CPU, low samples).
# Usage: python3 cart.py out.png [yaw_deg]
import bpy, math, sys, mathutils
out = sys.argv[1]; yaw = float(sys.argv[2]) if len(sys.argv) > 2 else -35
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 40; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 900, 1000; sc.render.film_transparent = True
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
# world: soft cool-white studio
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.82, 0.88, 0.95, 1); bg.inputs[1].default_value = 0.45
sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
def mat(name, col, metal=0.0, rough=0.4, emit=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = col; b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = col; b.inputs['Emission Strength'].default_value = emit
    return m
chrome = mat('chrome', (0.9, 0.92, 0.95, 1), 1.0, 0.08); handle = mat('handle', (0.9, 0.02, 0.18, 1), 0.0, 0.35); wheelm = mat('wheel', (0.05, 0.05, 0.06, 1), 0.0, 0.6)
def wire(points, mat_, r=0.011):
    cu = bpy.data.curves.new('c', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3
    sp = cu.splines.new('POLY'); sp.points.add(len(points) - 1)
    for i, p in enumerate(points): sp.points[i].co = (p[0], p[1], p[2], 1)
    ob = bpy.data.objects.new('w', cu); sc.collection.objects.link(ob); ob.data.materials.append(mat_); return ob
# basket: tapered wire box (x length, y width, z up)
TL, TW, TZ, BL, BW, BZ = 1.0, 0.62, 1.05, 0.72, 0.46, 0.55
def corner(l, wd, z, sx, sy): return (sx * l / 2, sy * wd / 2, z)
for lev in range(5):
    u = lev / 4; l = BL + (TL - BL) * u; wd = BW + (TW - BW) * u; z = BZ + (TZ - BZ) * u
    wire([corner(l, wd, z, 1, 1), corner(l, wd, z, 1, -1), corner(l, wd, z, -1, -1), corner(l, wd, z, -1, 1), corner(l, wd, z, 1, 1)], chrome, 0.012 if lev == 4 else 0.008)
nverts = 9
for i in range(nverts + 1):
    t = -1 + 2 * i / nverts
    wire([(t * BL / 2, BW / 2, BZ), (t * TL / 2, TW / 2, TZ)], chrome, 0.007); wire([(t * BL / 2, -BW / 2, BZ), (t * TL / 2, -TW / 2, TZ)], chrome, 0.007)
for i in range(6):
    t = -1 + 2 * i / 5
    wire([(BL / 2, t * BW / 2, BZ), (TL / 2, t * TW / 2, TZ)], chrome, 0.007); wire([(-BL / 2, t * BW / 2, BZ), (-TL / 2, t * TW / 2, TZ)], chrome, 0.007)
for k in range(8):
    y = -BW / 2 + BW * k / 7
    wire([(-BL / 2, y, BZ), (BL / 2, y, BZ)], chrome, 0.007)
for sx, sy in [(1, 1), (1, -1), (-1, 1), (-1, -1)]:
    wire([(sx * BL / 2 * 0.92, sy * BW / 2 * 0.92, BZ), (sx * 0.45, sy * 0.25, 0.22)], chrome, 0.014)
# chassis, legs, wheels, handle
wire([(-0.45, 0.25, 0.22), (0.45, 0.25, 0.22), (0.45, -0.25, 0.22), (-0.45, -0.25, 0.22), (-0.45, 0.25, 0.22)], chrome, 0.018)
for sx, sy in [(1, 1), (1, -1), (-1, 1), (-1, -1)]:
    wire([(sx * 0.45, sy * 0.25, 0.22), (sx * 0.45, sy * 0.25, 0.1)], chrome, 0.016)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.085, depth=0.06, location=(sx * 0.45, sy * 0.31, 0.085), rotation=(math.pi / 2, 0, 0)); o = bpy.context.object; o.data.materials.append(wheelm)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.07, location=(sx * 0.45, sy * 0.31, 0.085), rotation=(math.pi / 2, 0, 0)); o = bpy.context.object; o.data.materials.append(chrome)
wire([(-0.56, 0.31, 0.62), (-0.56, 0.31, TZ + 0.02), (-0.7, 0.31, TZ + 0.2), (-0.7, -0.31, TZ + 0.2), (-0.56, -0.31, TZ + 0.02), (-0.56, -0.31, 0.62)], chrome, 0.017)
bpy.ops.mesh.primitive_cylinder_add(radius=0.034, depth=0.62, location=(-0.7, 0, TZ + 0.2), rotation=(math.pi / 2, 0, 0)); o = bpy.context.object; o.data.materials.append(handle)
# products in the basket
cols = [(0.9, 0.02, 0.18, 1), (0.02, 0.6, 0.38, 1), (0.95, 0.62, 0.02, 1), (0.08, 0.14, 0.9, 1), (0.95, 0.22, 0.02, 1)]
import random; random.seed(4)
for i in range(7):
    c = cols[i % len(cols)]; m = mat('p%d' % i, c, 0.0, 0.35); sx = random.uniform(0.18, 0.28); sy = random.uniform(0.16, 0.22); sz = random.uniform(0.2, 0.34)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.3 + 0.18 * (i % 4) + random.uniform(-.03, .03), -0.14 + 0.28 * (i // 4) + random.uniform(-.04, .04), BZ + 0.02 + sz / 2), rotation=(0, 0, random.uniform(-0.4, 0.4)))
    o = bpy.context.object; o.scale = (sx, sy, sz); o.data.materials.append(m); bpy.ops.object.modifier_add(type='BEVEL'); o.modifiers['Bevel'].width = 0.015; o.modifiers['Bevel'].segments = 3
# shadow catcher floor
bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0)); fl = bpy.context.object; fl.is_shadow_catcher = True
# lights: big soft boxes for chrome reflections
def area(loc, rot, size, energy, col=(1, 1, 1)):
    bpy.ops.object.light_add(type='AREA', location=loc, rotation=rot); l = bpy.context.object; l.data.energy = energy; l.data.size = size; l.data.color = col
area((2.5, -3, 3.5), (math.radians(55), 0, math.radians(35)), 3.5, 230); area((-3, 2.5, 2.5), (math.radians(65), 0, math.radians(-130)), 3.0, 130, (1, 0.9, 0.95)); area((0, 0, 4.5), (0, 0, 0), 4.0, 120)
# camera, 3/4 view
cam = bpy.data.cameras.new('cam'); cam.lens = 55; co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
r = 4.3; a = math.radians(yaw); co.location = (r * math.cos(a) * -1, r * math.sin(a), 1.35)
d = mathutils.Vector((0, 0, 0.62)) - co.location; co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
sc.render.filepath = out; bpy.ops.render.render(write_still=True); print('rendered', out)
