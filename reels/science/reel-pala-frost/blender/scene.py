# Pala reel: photoreal field scene in Blender Cycles. usage: python scene.py <assets> <out.png> <shot 1-4> <W> <H> <samples>
import bpy, math, sys, random
import numpy as np
from mathutils import Vector, Euler
D, OUT, SHOT, W, H, SPP = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
WORK = D.rsplit('/', 1)[0]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; c = sc.cycles; c.device = 'CPU'; c.samples = SPP; c.use_denoising = True; c.denoiser = 'OPENIMAGEDENOISE'
c.max_bounces = 6; c.volume_bounces = 1; c.volume_step_rate = 2.0
sc.render.resolution_x = W; sc.render.resolution_y = H; sc.render.filepath = OUT; sc.render.threads_mode = 'AUTO'
sc.view_settings.view_transform = 'AgX'
try: sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception: pass
random.seed(11); RNG = np.random.default_rng(11)

SH = {1: dict(hdri='bloem_field_sunrise', rot=3.1, strength=1.0, exposure=0.0, frost=.8, mist=.012),
      2: dict(hdri='rogland_clear_night', rot=1.0, strength=1.6, exposure=0.0, frost=.35, mist=0),
      3: dict(hdri='rogland_clear_night', rot=2.2, strength=1.8, exposure=0.0, frost=.25, mist=0),
      4: dict(hdri='rogland_clear_night', rot=1.0, strength=1.5, exposure=0.0, frost=.5, mist=.5)}[SHOT]

# ---------------- terrain ----------------
def terrain(x, y):
    s = np.clip((y - 6) / 14, 0, 1); s = s * s * (3 - 2 * s); return -1.5 * s + 0.25 * np.clip((y - 30) / 20, 0, 1)
ROW = 0.7
def ridge(x): return 0.085 * np.cos(2 * math.pi * x / ROW)
def height(x, y): return terrain(x, y) + ridge(x)
def grid(x0, x1, y0, y1, step, name, withridge=True):
    xs = np.arange(x0, x1 + step / 2, step); ys = np.arange(y0, y1 + step / 2, step); X, Y = np.meshgrid(xs, ys)
    Z = terrain(X, Y) + (ridge(X) if withridge else 0) + (RNG.normal(0, .006, X.shape) if withridge else 0)
    nx, ny = len(xs), len(ys); v = np.stack([X, Y, Z], -1).reshape(-1, 3)
    i = np.arange((ny - 1) * nx).reshape(ny - 1, nx)[:, :-1].ravel(); f = np.stack([i, i + 1, i + nx + 1, i + nx], -1)
    me = bpy.data.meshes.new(name); me.from_pydata(v.tolist(), [], f.tolist())
    uv = me.uv_layers.new(name='uv'); li = np.zeros(len(me.loops), dtype=np.int32); me.loops.foreach_get('vertex_index', li)
    uvs = np.stack([v[li, 0] / 1.6, v[li, 1] / 1.6], -1).ravel(); uv.data.foreach_set('uv', uvs)
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me); sc.collection.objects.link(o); return o
def img(p, cs='sRGB'):
    i = bpy.data.images.load(p); i.colorspace_settings.name = cs; return i
def soil_mat(frost):
    m = bpy.data.materials.new('soil'); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links; b = n['Principled BSDF']
    uv = n.new('ShaderNodeUVMap'); d = n.new('ShaderNodeTexImage'); d.image = img(f'{D}/tex/farm_soil_Diffuse.jpg'); l.new(uv.outputs[0], d.inputs[0])
    r = n.new('ShaderNodeTexImage'); r.image = img(f'{D}/tex/farm_soil_Rough.jpg', 'Non-Color'); l.new(uv.outputs[0], r.inputs[0])
    nm = n.new('ShaderNodeTexImage'); nm.image = img(f'{D}/tex/farm_soil_nor_gl.jpg', 'Non-Color'); l.new(uv.outputs[0], nm.inputs[0]); nmap = n.new('ShaderNodeNormalMap'); nmap.inputs['Strength'].default_value = 1.6; l.new(nm.outputs[0], nmap.inputs['Color'])
    dk = n.new('ShaderNodeMixRGB'); dk.blend_type = 'MULTIPLY'; dk.inputs[0].default_value = 1; dk.inputs[2].default_value = (.5, .43, .38, 1); l.new(d.outputs[0], dk.inputs[1])
    # frost: white on up-facing, noisy, stronger on ridge tops (object z relative to terrain is baked into noise only)
    geo = n.new('ShaderNodeNewGeometry'); sep = n.new('ShaderNodeSeparateXYZ'); l.new(geo.outputs['Normal'], sep.inputs[0])
    no = n.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value = 55; no.inputs['Detail'].default_value = 8
    no2 = n.new('ShaderNodeTexNoise'); no2.inputs['Scale'].default_value = 3.5
    mr = n.new('ShaderNodeMapRange'); mr.inputs[1].default_value = .42; mr.inputs[2].default_value = .62; l.new(no.outputs['Fac'], mr.inputs[0])
    mu = n.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; l.new(mr.outputs[0], mu.inputs[0]); mr2 = n.new('ShaderNodeMapRange'); mr2.inputs[1].default_value = .3; mr2.inputs[2].default_value = .7; l.new(no2.outputs['Fac'], mr2.inputs[0]); l.new(mr2.outputs[0], mu.inputs[1])
    mu2 = n.new('ShaderNodeMath'); mu2.operation = 'MULTIPLY'; mu2.inputs[1].default_value = frost; l.new(mu.outputs[0], mu2.inputs[0])
    mx = n.new('ShaderNodeMixRGB'); l.new(mu2.outputs[0], mx.inputs[0]); l.new(dk.outputs[0], mx.inputs[1]); mx.inputs[2].default_value = (.86, .9, .97, 1)
    l.new(mx.outputs[0], b.inputs['Base Color']); l.new(r.outputs[0], b.inputs['Roughness']); l.new(nmap.outputs[0], b.inputs['Normal']); return m
SOIL = soil_mat(SH['frost'])
g1 = grid(-11, 11, -5, 30, .07, 'field'); g1.data.materials.append(SOIL)
g2 = grid(-160, 160, -40, 300, 4, 'far', False); g2.location.z = -.09; g2.data.materials.append(SOIL)

# ---------------- plants (Poly Haven scans, instanced) ----------------
def frostify(mat, frost):
    if not mat or not mat.use_nodes: return
    n = mat.node_tree.nodes; l = mat.node_tree.links; b = next((x for x in n if x.type == 'BSDF_PRINCIPLED'), None)
    if not b: return
    src = b.inputs['Base Color'].links[0].from_socket if b.inputs['Base Color'].links else None
    geo = n.new('ShaderNodeNewGeometry'); sep = n.new('ShaderNodeSeparateXYZ'); l.new(geo.outputs['Normal'], sep.inputs[0])
    ab = n.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'; l.new(sep.outputs['Z'], ab.inputs[0])
    up = n.new('ShaderNodeMapRange'); up.inputs[1].default_value = .35; up.inputs[2].default_value = 1.0; l.new(ab.outputs[0], up.inputs[0])
    no = n.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value = 420; no.inputs['Detail'].default_value = 6
    mr = n.new('ShaderNodeMapRange'); mr.inputs[1].default_value = .44; mr.inputs[2].default_value = .58; l.new(no.outputs['Fac'], mr.inputs[0])
    mu = n.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; l.new(up.outputs[0], mu.inputs[0]); l.new(mr.outputs[0], mu.inputs[1])
    mu2 = n.new('ShaderNodeMath'); mu2.operation = 'MULTIPLY'; mu2.inputs[1].default_value = frost; l.new(mu.outputs[0], mu2.inputs[0])
    mx = n.new('ShaderNodeMixRGB'); l.new(mu2.outputs[0], mx.inputs[0]); mx.inputs[2].default_value = (.9, .94, 1, 1)
    if src: l.new(src, mx.inputs[1])
    else: mx.inputs[1].default_value = b.inputs['Base Color'].default_value
    l.new(mx.outputs[0], b.inputs['Base Color'])
PL = []
for m, keep, s in [('nettle_plant', ('tall_a', 'tall_b', 'medium_a', 'medium_b'), 2.3), ('weed_plant_02', ('_a_', '_b_'), 1.5)]:
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f'{D}/{m}/{m}.gltf')
    for o in [o for o in bpy.data.objects if o not in before]:
        if o.type == 'MESH' and any(k in o.name for k in keep):
            for ms in o.material_slots: frostify(ms.material, SH['frost'])
            PL.append((o.data, s, m))
        o.hide_render = True; o.hide_viewport = True
        for col in list(o.users_collection): col.objects.unlink(o)
pc = bpy.data.collections.new('plants'); sc.collection.children.link(pc)
k = 0
for xi in np.arange(-10.5, 10.6, ROW):
    y = -4.5 + random.random() * .3
    while y < 29.5:
        if not (SHOT in (2, 3) and abs(xi) < .4 and 0.1 < y < 1.0 and False):
            me, s, m = random.choice(PL[:4]) if random.random() < .8 else random.choice(PL[4:])
            o = bpy.data.objects.new('p%d' % k, me); k += 1; pc.objects.link(o)
            x = xi + random.uniform(-.05, .05); sx = s * random.uniform(.8, 1.25)
            o.location = (x, y, float(terrain(np.float64(x), np.float64(y)) + 0.075)); o.rotation_euler = Euler((random.uniform(-.08, .08), random.uniform(-.08, .08), random.uniform(0, 6.28))); o.scale = (sx, sx, sx * random.uniform(.9, 1.15))
        y += random.uniform(.24, .4)
print('PLANTS', k)

# ---------------- thermometers ----------------
def pmat(name, col, rough=.5, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough
    for a, v in kw.items(): b.inputs[a].default_value = v
    return m
WOOD = pmat('wood', (.25, .15, .08), .8)
def thermo(loc, rz, tex, tilt=0.0, stake=True, zc=1.25, size=.34):
    root = bpy.data.objects.new('th', None); sc.collection.objects.link(root)
    w = size * .24
    bpy.ops.mesh.primitive_cube_add(size=1); p = bpy.context.object; p.scale = (w, .012, size); p.parent = root; p.location = (0, 0, 0)
    m = bpy.data.materials.new('face'); m.use_nodes = True; n = m.node_tree.nodes; l = m.node_tree.links; b = n['Principled BSDF']; t = n.new('ShaderNodeTexImage'); t.image = img(tex); tc = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping')
    mp.inputs['Location'].default_value = (.5, .5, .5); l.new(tc.outputs['Object'], mp.inputs[0]); sx = n.new('ShaderNodeSeparateXYZ'); l.new(mp.outputs[0], sx.inputs[0]); cb = n.new('ShaderNodeCombineXYZ'); l.new(sx.outputs['X'], cb.inputs['X']); l.new(sx.outputs['Z'], cb.inputs['Y']); l.new(cb.outputs[0], t.inputs[0])
    l.new(t.outputs[0], b.inputs['Base Color']); b.inputs['Roughness'].default_value = .35; p.data.materials.append(m)
    bpy.ops.mesh.primitive_cylinder_add(radius=w * .07, depth=size * .78, vertices=24); g = bpy.context.object; g.parent = root; g.location = (0, -.012, size * .03); g.data.materials.append(pmat('glass', (1, 1, 1), .03, **{'Transmission Weight': 1.0, 'IOR': 1.45}))
    if stake:
        bpy.ops.mesh.primitive_cube_add(size=1); s = bpy.context.object; s.scale = (.035, .035, zc + size * .6); s.parent = root; s.location = (0, .03, -(zc + size * .6) / 2 + size * .55); s.data.materials.append(WOOD)
    root.location = loc; root.rotation_euler = Euler((tilt, 0, rz)); return root

# ---------------- world ----------------
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; n = w.node_tree.nodes; l = w.node_tree.links
e = n.new('ShaderNodeTexEnvironment'); e.image = bpy.data.images.load(f"{D}/hdri/{SH['hdri']}.hdr"); mp = n.new('ShaderNodeMapping'); tc = n.new('ShaderNodeTexCoord'); l.new(tc.outputs['Generated'], mp.inputs[0]); mp.inputs['Rotation'].default_value = (0, 0, SH['rot']); l.new(mp.outputs[0], e.inputs[0])
l.new(e.outputs[0], n['Background'].inputs[0]); n['Background'].inputs[1].default_value = SH['strength']
sc.view_settings.exposure = SH['exposure']
def sun(rot, energy, col, angle=.03):
    bpy.ops.object.light_add(type='SUN', rotation=rot); s = bpy.context.object; s.data.energy = energy; s.data.color = col; s.data.angle = angle; return s
def mist(dens, top, y0=-6, y1=120, falloff=1.0):
    bpy.ops.mesh.primitive_cube_add(size=1); v = bpy.context.object; v.scale = (300, y1 - y0, 6); v.location = (0, (y0 + y1) / 2, -1.6 + 3)
    m = bpy.data.materials.new('mist'); m.use_nodes = True; nn = m.node_tree.nodes; ll = m.node_tree.links; nn.remove(nn['Principled BSDF'])
    pv = nn.new('ShaderNodeVolumeScatter'); pv.inputs['Color'].default_value = (.82, .88, 1, 1); pv.inputs['Anisotropy'].default_value = .3
    geo = nn.new('ShaderNodeNewGeometry'); sp = nn.new('ShaderNodeSeparateXYZ'); ll.new(geo.outputs['Position'], sp.inputs[0])
    mr = nn.new('ShaderNodeMapRange'); mr.inputs[1].default_value = top; mr.inputs[2].default_value = top - falloff; mr.inputs[3].default_value = 0; mr.inputs[4].default_value = dens; ll.new(sp.outputs['Z'], mr.inputs[0])
    no = nn.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value = .12; no.inputs['Detail'].default_value = 3; mu = nn.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; ll.new(mr.outputs[0], mu.inputs[0]); mr2 = nn.new('ShaderNodeMapRange'); mr2.inputs[1].default_value = .3; mr2.inputs[2].default_value = .75; mr2.inputs[3].default_value = .35; ll.new(no.outputs['Fac'], mr2.inputs[0]); ll.new(mr2.outputs[0], mu.inputs[1])
    ll.new(mu.outputs[0], pv.inputs['Density']); ll.new(pv.outputs[0], nn['Material Output'].inputs['Volume']); v.data.materials.append(m)
def camera(loc, look, lens, fstop=None, focus=None):
    bpy.ops.object.camera_add(location=loc); cam = bpy.context.object; sc.camera = cam; cam.data.lens = lens; cam.data.sensor_fit = 'VERTICAL'; cam.data.sensor_height = 36
    d = Vector(look) - Vector(loc); cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    if fstop: cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = fstop; cam.data.dof.focus_distance = (Vector(focus) - Vector(loc)).length
    return cam

if SHOT == 1:    # dawn, the white field, a thermometer reading 4 in the foreground
    thermo((.02, .75, .86), .12, f'{WORK}/thermo_4.png', zc=.86, size=.4)
    camera((.36, -.62, .5), (.2, 3.2, .78), 28, 2.4, (.02, .75, .86)); mist(SH['mist'], 2.5, falloff=4.0)
    sun((math.radians(86), 0, math.radians(-118)), .9, (1, .72, .5), .06)
elif SHOT == 2:  # night: one thermometer at chest height, one down by the leaf
    thermo((.3, 2.0, 1.22), -.1, f'{WORK}/thermo_4.png', zc=1.3, size=.46)
    thermo((.3, .8, .2), .1, f'{WORK}/thermo_m1.png', tilt=-.45, stake=False, size=.4)
    camera((.52, -.5, .42), (.26, 1.3, .45), 24, 5.6, (.3, .8, .2))
    sun((math.radians(50), 0, math.radians(35)), .11, (.62, .74, 1), .02)
elif SHOT == 3:  # one plant against the clear night sky, looking up
    camera((.34, -.35, .1), (-.05, .7, .95), 22, 2.2, (0, .2, .4))
    sun((math.radians(62), 0, math.radians(200)), .16, (.62, .74, 1), .02)
elif SHOT == 4:  # cold air pooling: high view down the slope into the low field
    camera((0, -4.5, 3.4), (0, 16, -1.2), 26, None, None); mist(.1, -.05, y0=2, falloff=1.5)
    sun((math.radians(58), 0, math.radians(40)), .12, (.62, .74, 1), .02)
bpy.ops.render.render(write_still=True); print('DONE', OUT)
