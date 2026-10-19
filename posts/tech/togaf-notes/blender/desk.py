# Photoreal flat-lay of one handwritten notebook page on a dark plank desk, lit by a low warm window sun through blinds.
# Notebook = card back cover + page stack + the handwritten top page (tex/pN.png, alpha = punched spiral holes, slight curl)
# + a wire spiral through the holes. Props (gel pen, highlighter, mug, sticky note) move per page so the set doesn't repeat.
# Run: PAGE=3 python3 blender/desk.py   (bpy, Cycles CPU)  -> renders/raw_pN.png (16-bit, AgX), graded later by grade.py
import bpy, bmesh, math, os, sys, mathutils
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(H)
sys.path.insert(0, os.path.join(ROOT, '../../../reels/tech/reel-ai-trading-pipeline/blender'))
from common import setup, mat, area, bev
P = int(os.environ.get('PAGE', 1)); SPP = int(os.environ.get('SPP', 96)); RES = (int(os.environ.get('W', 1350)), int(os.environ.get('H', 1688)))
def srgb(h, a=1):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (a,)
# per-page variation: notebook yaw (deg), pen [x, y, yaw], highlighter [x, y, yaw, colour], mug corner, sun yaw, sticky
V = {1: dict(rot=-2.2, pen=(-0.012, -0.108, 186), hl=(-0.03, 0.128, 4, '#f5e21c'), mug=(.122, .15), sun=-38, sticky=(.083, -.07, 9, 1)),
     2: dict(rot=1.6, pen=(0.01, -0.108, 174), hl=(0.04, -0.137, -3, '#ff5fa8'), mug=(-.122, .15), sun=-30, sticky=None),
     3: dict(rot=-1.2, pen=(-0.02, -0.108, 183), hl=(-0.05, -0.137, 182, '#6fe36f'), mug=(.122, -.15), sun=-42, sticky=None),
     4: dict(rot=2.4, pen=(0.015, -0.108, 177), hl=(0.02, 0.128, 176, '#f5e21c'), mug=(-.122, -.15), sun=-34, sticky=None),
     5: dict(rot=-2.8, pen=(0, -0.108, 188), hl=(-0.04, 0.128, 3, '#5fc8ff'), mug=(.122, .15), sun=-40, sticky=None),
     6: dict(rot=1.2, pen=(-0.01, -0.108, 172), hl=(0.05, -0.137, -5, '#ff5fa8'), mug=(.122, -.15), sun=-28, sticky=None),
     7: dict(rot=-1.8, pen=(0.02, -0.108, 185), hl=(-0.02, -0.137, 178, '#6fe36f'), mug=(-.122, .15), sun=-36, sticky=None),
     8: dict(rot=2.0, pen=(-0.015, -0.108, 176), hl=(0.03, 0.128, -4, '#f5e21c'), mug=(.122, .15), sun=-44, sticky=None)}[P]
sc = setup(RES, SPP); sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
sc.render.film_transparent = False; sc.render.image_settings.color_depth = '16'; sc.cycles.max_bounces = 6
w = sc.world; nt = w.node_tree; bg = nt.nodes['Background']; env = nt.nodes.new('ShaderNodeTexEnvironment')
env.image = bpy.data.images.load(os.path.join(ROOT, '../../../assets/hdri/brown_photostudio_02.hdr')); nt.links.new(env.outputs[0], bg.inputs[0]); bg.inputs[1].default_value = .09

def img_mat(name, path, rough=.6, bump=0., alpha=False, rough_from_img=False, spec=.4):
    m = bpy.data.materials.new(name); m.use_nodes = True; t = m.node_tree; b = t.nodes['Principled BSDF']
    im = t.nodes.new('ShaderNodeTexImage'); im.image = bpy.data.images.load(path); im.interpolation = 'Cubic'
    t.links.new(im.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = rough; b.inputs['Specular IOR Level'].default_value = spec
    if alpha: t.links.new(im.outputs['Alpha'], b.inputs['Alpha'])
    if bump:
        bw = t.nodes.new('ShaderNodeRGBToBW'); t.links.new(im.outputs['Color'], bw.inputs[0]); bp = t.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump
        t.links.new(bw.outputs[0], bp.inputs['Height']); t.links.new(bp.outputs[0], b.inputs['Normal'])
        if rough_from_img:
            mr = t.nodes.new('ShaderNodeMapRange'); mr.inputs[3].default_value = .72; mr.inputs[4].default_value = .42; t.links.new(bw.outputs[0], mr.inputs[0]); t.links.new(mr.outputs[0], b.inputs['Roughness'])
    return m, t, b
def box(name, loc, size, m, bevel=0.0, seg=3, rot=0.):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    if bevel: bev(o, bevel, seg)
    o.rotation_euler[2] = math.radians(rot); o.data.materials.append(m); return o
def cyl(name, loc, r, depth, m, rot=(0, 0, 0), verts=48):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts); o = bpy.context.object; o.name = name; o.data.materials.append(m)
    bpy.ops.object.shade_smooth(); return o

# desk: dark planks (Unsplash photo, real wood), ~12 cm planks
dm, dt, db = img_mat('desk', os.path.join(H, 'wood.jpg'), .55, bump=.25, rough_from_img=True, spec=.35)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0)); desk = bpy.context.object; desk.scale = (.79, .5, 1); bpy.ops.object.transform_apply(scale=True); desk.data.materials.append(dm)

# notebook group (rotated per page about the origin)
nb = bpy.data.objects.new('nb', None); sc.collection.objects.link(nb)
PWm, PHm = .160, .224
cover = box('cover', (0, -.004, .0015), (.172, .238, .003), mat('cover', srgb('#2b3a4f'), 0, .62), .0012)
edge = mat('edge', srgb('#ece6d6'), 0, .85)
stack = box('stack', (0, -.003, .0055), (.1585, .222, .005), edge, .0006)
# top page: subdivided grid with a gentle curl (bottom-right corner lifts, slight wave)
bm = bmesh.new(); NX, NY = 64, 90
verts = [[bm.verts.new(((i / NX - .5) * PWm, (j / NY - .5) * PHm, 0)) for i in range(NX + 1)] for j in range(NY + 1)]
for j in range(NY):
    for i in range(NX): bm.faces.new((verts[j][i], verts[j][i + 1], verts[j + 1][i + 1], verts[j + 1][i]))
uv = bm.loops.layers.uv.new()
for f in bm.faces:
    for lo in f.loops: lo[uv].uv = (lo.vert.co.x / PWm + .5, lo.vert.co.y / PHm + .5)
for v in bm.verts:
    u, t = v.co.x / PWm + .5, v.co.y / PHm + .5
    lift = (0 if V['sticky'] else .0055) * max(0, (u - .72) / .28) ** 2 * max(0, (.3 - t) / .3) ** 1.5 + .0008 * math.sin(t * 7.3 + 1.1) * (1 - t) + .0011 * (1 - t) ** 3
    v.co.z = .0083 + lift
me = bpy.data.meshes.new('page'); bm.to_mesh(me); page = bpy.data.objects.new('page', me); sc.collection.objects.link(page)
for poly in me.polygons: poly.use_smooth = True
pm, pt, pb = img_mat('paper', os.path.join(ROOT, f'tex/p{P}.png'), .82, alpha=True, spec=.28)
nz = pt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 900; nz.inputs['Detail'].default_value = 6
bp = pt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .045; pt.links.new(nz.outputs['Fac'], bp.inputs['Height']); pt.links.new(bp.outputs[0], pb.inputs['Normal'])
page.data.materials.append(pm); page.location = (0, -.003, 0)
# wire spiral through the punched holes (hole centres at 36 + 72k px, 46 px from the top edge)
wire_m = mat('wire', srgb('#9aa0a6'), 1.0, .28)
for k in range(22):
    x = ((36 + 72 * k) / 1600 - .5) * PWm; y = -.003 + PHm / 2 - 46 / 2240 * PHm
    bpy.ops.mesh.primitive_torus_add(major_radius=.0072, minor_radius=.00075, location=(x, y + .0028, .0084), rotation=(0, math.radians(90), 0), major_segments=40, minor_segments=10)
    r = bpy.context.object; r.data.materials.append(wire_m); bpy.ops.object.shade_smooth(); r.rotation_euler = (math.radians(-8), math.radians(90), 0); r.parent = nb
for o in (cover, stack, page): o.parent = nb
nb.rotation_euler[2] = math.radians(V['rot'])

# gel pen: matte black barrel, chrome clip + tip
def pen(x, y, yaw):
    g = bpy.data.objects.new('pen', None); sc.collection.objects.link(g)
    body = cyl('barrel', (0, 0, 0), .0052, .118, mat('barrel', srgb('#16171b'), 0, .38), rot=(0, math.radians(90), 0))
    grip = cyl('grip', (-.046, 0, 0), .0056, .03, mat('grip', srgb('#2a2d33'), 0, .75), rot=(0, math.radians(90), 0))
    tip = cyl('cone', (-.066, 0, 0), .0035, .012, mat('chrome', srgb('#c9ccd1'), 1, .18), rot=(0, math.radians(90), 0))
    cap = cyl('cap', (.05, 0, .0002), .0058, .03, mat('capb', srgb('#1d2f86'), 0, .35), rot=(0, math.radians(90), 0))
    clip = box('clip', (.05, 0, .0064), (.034, .0028, .0012), mat('chrome2', srgb('#d6d8dc'), 1, .15), .0004)
    for o in (body, grip, tip, cap, clip): o.parent = g
    g.location = (x, y, .0058); g.rotation_euler[2] = math.radians(yaw)
def highlighter(x, y, yaw, col):
    g = bpy.data.objects.new('hl', None); sc.collection.objects.link(g)
    b = box('hlbody', (0, 0, 0), (.11, .022, .016), mat('hlb', srgb(col), 0, .45), .0055, 5)
    c = box('hlcap', (.066, 0, 0), (.03, .0235, .0172), mat('hlc', srgb('#202226'), 0, .4), .006, 5)
    for o in (b, c): o.parent = g
    g.location = (x, y, .0082); g.rotation_euler[2] = math.radians(yaw)
def mug(x, y):
    cer = mat('ceramic', srgb('#e9e4da'), 0, .12)
    outer = cyl('mug', (x, y, .045), .042, .09, cer, verts=96); inner = cyl('coffee', (x, y, .082), .038, .002, mat('coffee', srgb('#2a170b'), 0, .05), verts=96)
    bpy.ops.mesh.primitive_torus_add(major_radius=.024, minor_radius=.0065, location=(x + (.06 if x > 0 else -.06), y, .05), rotation=(math.radians(90), 0, 0)); hd = bpy.context.object; hd.data.materials.append(cer); bpy.ops.object.shade_smooth()
pen(*V['pen']); highlighter(*V['hl']); mug(*V['mug'])
# sticky note with its own handwriting (tex/sticky{n}.png), slight curl at the free end
if V['sticky']:
    sx, sy, syaw, sn = V['sticky']
    bm = bmesh.new(); S = .076; NN = 24
    vv = [[bm.verts.new(((i / NN - .5) * S, (j / NN - .5) * S, 0)) for i in range(NN + 1)] for j in range(NN + 1)]
    for j in range(NN):
        for i in range(NN): bm.faces.new((vv[j][i], vv[j][i + 1], vv[j + 1][i + 1], vv[j + 1][i]))
    uv = bm.loops.layers.uv.new()
    for f in bm.faces:
        for lo in f.loops: lo[uv].uv = (lo.vert.co.x / S + .5, lo.vert.co.y / S + .5)
    for v in bm.verts: t = v.co.y / S + .5; v.co.z = .0102 + .006 * max(0, (.45 - t) / .45) ** 2.2
    me2 = bpy.data.meshes.new('sticky'); bm.to_mesh(me2); st = bpy.data.objects.new('sticky', me2); sc.collection.objects.link(st)
    for poly in me2.polygons: poly.use_smooth = True
    sm, _, _ = img_mat('sticky', os.path.join(ROOT, f'tex/sticky{sn}.png'), .7, spec=.25); st.data.materials.append(sm)
    st.location = (sx, sy, 0); st.rotation_euler[2] = math.radians(syaw)

# light: low warm window sun through venetian blinds (slats only shade the left/top of the frame) + soft cool bounce
bpy.ops.object.light_add(type='SUN'); sun = bpy.context.object; sun.data.energy = 5.8; sun.data.color = (1.0, .84, .66); sun.data.angle = math.radians(.9)
sun.rotation_euler = (math.radians(52), 0, math.radians(V['sun']))
sd = sun.matrix_world.to_quaternion() @ mathutils.Vector((0, 0, 1))     # direction towards the sun
slat_m = mat('slat', srgb('#202020'), 0, .9)
for k in range(11 if os.environ.get('SLATS', '1') == '1' else 0):
    c = mathutils.Vector((-.135, .2 - k * .034, 0)) + sd * .16
    s = box('slat', tuple(c), (.13, .017, .002), slat_m); s.rotation_euler = sun.rotation_euler.copy(); s.visible_camera = False
    s.visible_glossy = False
area((.5, -.4, .9), (math.radians(40), 0, math.radians(55)), 1.2, 12, (.82, .88, 1.0))
# camera: phone-like 4:5 frame, almost straight down with a slight tilt, mild depth of field
cam = bpy.data.cameras.new('cam'); cam.lens = 42; cam.sensor_width = 36; cam.dof.use_dof = True; cam.dof.aperture_fstop = 6.3
co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
co.location = (0.004, -.055, .315); co.rotation_euler = (math.radians(9), 0, math.radians(.6)); cam.dof.focus_distance = .318
sc.render.filepath = os.path.join(ROOT, f'renders/raw_p{P}.png')
bpy.ops.render.render(write_still=True); print('rendered', P, flush=True)
