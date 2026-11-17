# Pala reel: photoreal plates (colour + inverse-depth) in Blender Cycles. usage: python plates.py <assets> <outdir> <plate A..I> <W> <H> <samples>
import bpy, math, sys, random
import numpy as np
from mathutils import Vector, Euler
D, OUTD, SHOT, W, H, SPP = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
import os
OUT = f'{OUTD}/plate_{SHOT}.png'; FOVK = 1.25
WORK = D.rsplit('/', 1)[0]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; c = sc.cycles; c.device = 'CPU'; c.samples = SPP; c.use_denoising = True; c.denoiser = 'OPENIMAGEDENOISE'
c.max_bounces = 6; c.volume_bounces = 1; c.volume_step_rate = 2.0
sc.render.resolution_x = W; sc.render.resolution_y = H; sc.render.filepath = OUT; sc.render.threads_mode = 'AUTO'
sc.view_settings.view_transform = 'AgX'
try: sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception: pass
random.seed(11); RNG = np.random.default_rng(11)

SH = dict(
 A=dict(hdri='bloem_field_sunrise', rot=3.1, strength=1.0, exposure=0.0, frost=.8, burn=0, mist=.012),
 B=dict(hdri='bloem_field_sunrise', rot=3.1, strength=1.0, exposure=0.0, frost=.55, burn=1, mist=.01),
 C=dict(hdri='rogland_clear_night', rot=1.0, strength=1.6, exposure=0.0, frost=.35, burn=0, mist=0),
 D=dict(hdri='rogland_clear_night', rot=2.2, strength=1.8, exposure=0.0, frost=.25, burn=0, mist=0),
 E=dict(hdri='rogland_clear_night', rot=1.0, strength=1.5, exposure=0.0, frost=.5, burn=0, mist=.5),
 F=dict(hdri='bloem_field_sunrise', rot=.6, strength=.7, exposure=-.2, frost=0.0, burn=0, mist=0),
 G=dict(hdri='misty_dawn', rot=1.5, strength=.9, exposure=-.1, frost=.7, burn=0, mist=0),
 I=dict(hdri='rogland_clear_night', rot=1.0, strength=1.6, exposure=0.0, frost=.35, burn=0, mist=0))[SHOT]

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
def frostify(mat, frost, burn=0):
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
    out = mx.outputs[0]
    if burn:
        nb = n.new('ShaderNodeTexNoise'); nb.inputs['Scale'].default_value = 7; nb.inputs['Detail'].default_value = 5
        mb = n.new('ShaderNodeMapRange'); mb.inputs[1].default_value = .46; mb.inputs[2].default_value = .6; l.new(nb.outputs['Fac'], mb.inputs[0])
        bx = n.new('ShaderNodeMixRGB'); l.new(mb.outputs[0], bx.inputs[0]); l.new(out, bx.inputs[1]); bx.inputs[2].default_value = (.07, .045, .02, 1); out = bx.outputs[0]
    l.new(out, b.inputs['Base Color'])
PL = []
for m, keep, s in [('nettle_plant', ('tall_a', 'tall_b', 'medium_a', 'medium_b'), 2.3), ('weed_plant_02', ('_a_', '_b_'), 1.5)]:
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=f'{D}/{m}/{m}.gltf')
    for o in [o for o in bpy.data.objects if o not in before]:
        if o.type == 'MESH' and any(k in o.name for k in keep):
            for ms in o.material_slots: frostify(ms.material, SH['frost'], SH['burn'])
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

def cam_(loc, look, lens, fstop=None, focus=None): return camera(loc, look, lens / FOVK, fstop, focus)
NIGHT_SUN = lambda r=(50, 35), e=.11: sun((math.radians(r[0]), 0, math.radians(r[1])), e, (.62, .74, 1), .02)
if SHOT == 'A':
    thermo((.02, .75, .86), .12, f'{WORK}/thermo_4.png', zc=.86, size=.4)
    cam_((.36, -.62, .5), (.2, 3.2, .78), 28, 2.4, (.02, .75, .86)); mist(SH['mist'], 2.5, falloff=4.0)
    sun((math.radians(86), 0, math.radians(-118)), .9, (1, .72, .5), .06)
elif SHOT == 'B':   # frost-burnt leaves, close, dawn
    cam_((.18, -.12, .34), (.05, .9, .38), 40, 1.8, (.06, .55, .38))
    sun((math.radians(84), 0, math.radians(-120)), .8, (1, .72, .5), .05)
elif SHOT == 'C':
    thermo((.3, 2.0, 1.22), -.1, f'{WORK}/thermo_4.png', zc=1.3, size=.46)
    thermo((.3, .8, .2), .1, f'{WORK}/thermo_m1.png', tilt=-.45, stake=False, size=.4)
    cam_((.52, -.5, .42), (.26, 1.3, .45), 24, 5.6, (.3, .8, .2)); NIGHT_SUN()
elif SHOT == 'D':
    cam_((.34, -.35, .1), (-.05, .7, .95), 22, 2.2, (0, .2, .4)); NIGHT_SUN((62, 200), .16)
elif SHOT == 'E':   # cold air pooling in the low field
    cam_((0, -3.0, 2.0), (0, 15, -1.1), 24, None, None); mist(.5, -.3, y0=3, falloff=1.9); NIGHT_SUN((58, 40), .12)
elif SHOT == 'F':   # evening irrigation: water in the furrows
    bpy.ops.mesh.primitive_plane_add(size=1); wp = bpy.context.object; wp.scale = (22, 36, 1); wp.location = (0, 12, -.012)
    wm = bpy.data.materials.new('water'); wm.use_nodes = True; wb = wm.node_tree.nodes['Principled BSDF']; wb.inputs['Base Color'].default_value = (.02, .03, .03, 1); wb.inputs['Roughness'].default_value = .035; wb.inputs['IOR'].default_value = 1.33; wb.inputs['Metallic'].default_value = 0.0
    nz = wm.node_tree.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 60; bp = wm.node_tree.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .02; wm.node_tree.links.new(nz.outputs['Fac'], bp.inputs['Height']); wm.node_tree.links.new(bp.outputs[0], wb.inputs['Normal']); wp.data.materials.append(wm)
    cam_((.35, -.9, .2), (.35, 4.5, .1), 28, 2.4, (.35, 1.5, .0)); sun((math.radians(80), 0, math.radians(-100)), 1.6, (1, .62, .35), .05)
elif SHOT == 'G':   # a seedling bed half under polythene
    bpy.ops.mesh.primitive_cube_add(size=1); bd = bpy.context.object; bd.scale = (1.0, 2.6, .05); bd.location = (0, 2.4, .06); bd.data.materials.append(SOIL)
    for i in range(70):
        me, s_, m = PL[random.randrange(len(PL))]; o = bpy.data.objects.new('sd%d' % i, me); pc.objects.link(o); o.location = (random.uniform(-.45, .45), random.uniform(1.2, 3.6), .09); sx = .55 * random.uniform(.8, 1.2); o.scale = (sx, sx, sx); o.rotation_euler = Euler((0, 0, random.uniform(0, 6.28)))
    # polythene tunnel over y 2.2..3.6
    nu, nv = 40, 60; us = np.linspace(0, math.pi, nu); vs = np.linspace(2.0, 3.6, nv); verts = []
    for v_ in vs:
        for u_ in us: verts.append(((.5 * math.cos(u_)) * 1.0 + 0.0, v_, .1 + .38 * math.sin(u_) + .012 * math.sin(v_ * 31) * math.sin(u_ * 7)))
    faces = [(j * nu + i, j * nu + i + 1, (j + 1) * nu + i + 1, (j + 1) * nu + i) for j in range(nv - 1) for i in range(nu - 1)]
    me = bpy.data.meshes.new('poly'); me.from_pydata(verts, [], faces); po = bpy.data.objects.new('poly', me); sc.collection.objects.link(po)
    for p_ in me.polygons: p_.use_smooth = True
    pm = bpy.data.materials.new('polythene'); pm.use_nodes = True; pb = pm.node_tree.nodes['Principled BSDF']; pb.inputs['Base Color'].default_value = (.9, .95, 1, 1); pb.inputs['Roughness'].default_value = .07; pb.inputs['Transmission Weight'].default_value = 0.0; pb.inputs['Alpha'].default_value = .22; pb.inputs['IOR'].default_value = 1.15; pm.blend_method='BLEND' if hasattr(pm,'blend_method') else None
    nz = pm.node_tree.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 90; nz.inputs['Detail'].default_value = 5; bp = pm.node_tree.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .08; pm.node_tree.links.new(nz.outputs['Fac'], bp.inputs['Height']); pm.node_tree.links.new(bp.outputs[0], pb.inputs['Normal']); po.data.materials.append(pm)
    for y_ in np.linspace(2.05, 3.55, 5):   # hoops
        pts = [(.5 * math.cos(u), y_, .1 + .38 * math.sin(u)) for u in np.linspace(0, math.pi, 24)]
        cu = bpy.data.curves.new('hp', 'CURVE'); cu.dimensions = '3D'; sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
        for k_, p3 in enumerate(pts): sp.points[k_].co = (*p3, 1)
        cu.bevel_depth = .006; ho = bpy.data.objects.new('hp', cu); sc.collection.objects.link(ho); ho.data.materials.append(pmat('wire', (.5, .5, .52), .4, Metallic=1.0))
    cam_((.5, .6, .75), (0, 2.7, .12), 30, 3.2, (0, 2.7, .12)); sun((math.radians(78), 0, math.radians(-110)), .5, (.75, .82, 1), .05)
elif SHOT == 'I':   # wide night: the two thermometers set out for the test
    thermo((.32, 2.9, 1.22), -.1, f'{WORK}/thermo_4.png', zc=1.3, size=.5)
    thermo((-.1, 1.4, .2), .1, f'{WORK}/thermo_m1.png', tilt=-.45, stake=False, size=.44)
    cam_((.05, -.5, .7), (.1, 3.6, .55), 30, None, None); NIGHT_SUN((50, 35), .12)

# ---- colour plate, then a cheap second render for the depth pass (Z, 4 samples, no denoise, no DoF) ----
bpy.ops.render.render(write_still=True)
sc.render.image_settings.media_type = 'MULTI_LAYER_IMAGE'; sc.render.image_settings.file_format = 'OPEN_EXR_MULTILAYER'; sc.render.filepath = f'{OUTD}/depth_{SHOT}.exr'
bpy.context.view_layer.use_pass_z = True; c.samples = 4; c.use_denoising = False
if sc.camera.data.dof.use_dof: sc.camera.data.dof.use_dof = False
bpy.ops.render.render(write_still=True)
import OpenEXR
from PIL import Image
f = OpenEXR.File(f'{OUTD}/depth_{SHOT}.exr'); zp = [p for p in f.parts if 'Depth' in str(p)][0]; z = np.array(list(zp.channels.values())[0].pixels, dtype=np.float32); z = z[..., 0] if z.ndim == 3 else z; key = 'Depth.Z'
z = np.where(z > 1e8, 1e4, z); inv = 1.0 / np.maximum(z, 1e-3); d = np.clip((inv - 1 / 60) / (1 / .3 - 1 / 60), 0, 1)
Image.fromarray((d * 65535).astype(np.uint16)).save(f'{OUTD}/depth_{SHOT}.png'); os.remove(f'{OUTD}/depth_{SHOT}.exr')
print('DONE', OUT, key)
