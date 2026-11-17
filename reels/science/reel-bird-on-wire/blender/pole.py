# Bird on the wire: photoreal dusk pole line with an animated procedural bird, in Blender Cycles.
# usage: python pole.py <ph assets dir> <outdir> <shot wide|macro> <W> <H> <spp> <f0> <f1>   (frames f0..f1 inclusive, 12 fps clip; f0==f1 renders one still)
import bpy, math, sys, random, time
import os
import numpy as np
from mathutils import Vector, Euler
D, OUTD, SHOT, W, H, SPP, F0, F1 = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6]), int(sys.argv[7]), int(sys.argv[8])
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; c = sc.cycles; c.device = 'CPU'; c.samples = SPP; c.use_denoising = True; c.denoiser = 'OPENIMAGEDENOISE'; c.max_bounces = 5
sc.render.resolution_x = W; sc.render.resolution_y = H; sc.render.fps = 12; sc.view_settings.view_transform = 'AgX'
try: sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception: pass
random.seed(3); RNG = np.random.default_rng(3)
def img(p, cs='sRGB'):
    i = bpy.data.images.load(p); i.colorspace_settings.name = cs; return i
def mat(name, col, rough=.5, metal=0.0, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    for k, v in kw.items(): b.inputs[k.replace('_', ' ')].default_value = v
    return m
def link(o, m): o.data.materials.append(m); return o
def smooth(o):
    for p in o.data.polygons: p.use_smooth = True
# ---- world (golden hour) ----
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; n = w.node_tree.nodes; l = w.node_tree.links
e = n.new('ShaderNodeTexEnvironment'); e.image = bpy.data.images.load('/home/user/video-generator/assets/hdri/aarfontein_sunrise.hdr'); mp = n.new('ShaderNodeMapping'); tc = n.new('ShaderNodeTexCoord')
l.new(tc.outputs['Generated'], mp.inputs[0]); mp.inputs['Rotation'].default_value = (0, 0, math.radians(float(os.environ.get('HROT', '114')))); l.new(mp.outputs[0], e.inputs[0]); bg = n['Background']; l.new(e.outputs[0], bg.inputs['Color']); bg.inputs['Strength'].default_value = float(os.environ.get('HSTR', '0.9'))
# ---- ground ----
bpy.ops.mesh.primitive_plane_add(size=6000, location=(0, 0, 0)); g = bpy.context.object
gm = bpy.data.materials.new('soil'); gm.use_nodes = True; gn = gm.node_tree.nodes; gl = gm.node_tree.links; gb = gn['Principled BSDF']
uv = gn.new('ShaderNodeTexCoord'); mpx = gn.new('ShaderNodeMapping'); mpx.inputs['Scale'].default_value = (1200, 1200, 1200); gl.new(uv.outputs['UV'], mpx.inputs[0])
t1 = gn.new('ShaderNodeTexImage'); t1.image = img(f'{D}/tex/farm_soil_Diffuse.jpg'); gl.new(mpx.outputs[0], t1.inputs[0]); gl.new(t1.outputs[0], gb.inputs['Base Color'])
t2 = gn.new('ShaderNodeTexImage'); t2.image = img(f'{D}/tex/farm_soil_Rough.jpg', 'Non-Color'); gl.new(mpx.outputs[0], t2.inputs[0]); gl.new(t2.outputs[0], gb.inputs['Roughness'])
t3 = gn.new('ShaderNodeTexImage'); t3.image = img(f'{D}/tex/farm_soil_nor_gl.jpg', 'Non-Color'); gl.new(mpx.outputs[0], t3.inputs[0]); nm = gn.new('ShaderNodeNormalMap'); gl.new(t3.outputs[0], nm.inputs['Color']); gl.new(nm.outputs[0], gb.inputs['Normal'])
g.data.materials.append(gm)
# ---- poles ----
CONC = mat('concrete', (.30, .28, .26), .85)
nz = CONC.node_tree.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 80; bp = CONC.node_tree.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = .35
CONC.node_tree.links.new(nz.outputs['Fac'], bp.inputs['Height']); CONC.node_tree.links.new(bp.outputs[0], CONC.node_tree.nodes['Principled BSDF'].inputs['Normal'])
STEEL = mat('steel', (.2, .21, .22), .5, 1.0); POR = mat('porcelain', (.55, .5, .42), .15, 0.0, Coat_Weight=.6)
ZA = 8.5; WIRE_Y = (-.72, 0.0, .72); WZ = ZA + .36
def pole(x):
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=.17, radius2=.12, depth=9.0, location=(x, 0, 4.5)); p = bpy.context.object; link(p, CONC); smooth(p)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0, ZA)); a = bpy.context.object; a.scale = (.08, 2.0, .07); link(a, STEEL)
    for y in WIRE_Y:
        bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=.035, depth=.16, location=(x, y, ZA + .115)); i1 = bpy.context.object; link(i1, POR); smooth(i1)
        bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=.055, depth=.04, location=(x, y, ZA + .2)); i2 = bpy.context.object; link(i2, POR); smooth(i2)
for px in (-30, 0, 30, 60): pole(px)
# ---- wires: three spans with sag, aluminium + a travelling emissive pulse (current flows ALONG the wire) ----
WIREM = mat('alu', (.62, .64, .66), .38, 1.0)
wn = WIREM.node_tree.nodes; wl = WIREM.node_tree.links; wb = wn['Principled BSDF']
wv = wn.new('ShaderNodeTexWave'); wv.wave_type = 'BANDS'; wv.bands_direction = 'X'; wv.inputs['Scale'].default_value = .35; wv.inputs['Distortion'].default_value = 0; wv.inputs['Detail'].default_value = 0
wco = wn.new('ShaderNodeTexCoord'); wmp = wn.new('ShaderNodeMapping'); wl.new(wco.outputs['Object'], wmp.inputs[0]); wl.new(wmp.outputs[0], wv.inputs['Vector'])
cr = wn.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position = .72; cr.color_ramp.elements[1].position = .95; cr.color_ramp.elements[1].color = (1, .30, .06, 1); cr.color_ramp.elements[0].color = (0, 0, 0, 1); wl.new(wv.outputs['Fac'], cr.inputs[0])
wl.new(cr.outputs['Color'], wb.inputs['Emission Color']); wb.inputs['Emission Strength'].default_value = 1.6
def sag(x):
    x0 = math.floor(x / 30) * 30; t = (x - x0 - 15) / 15; return WZ - .75 * (1 - t * t)
WIRES = []
for wy in WIRE_Y:
    cu = bpy.data.curves.new('w', 'CURVE'); cu.dimensions = '3D'; sp = cu.splines.new('POLY'); xs = np.linspace(-30, 60, 121); sp.points.add(len(xs) - 1)
    for k, x in enumerate(xs): sp.points[k].co = (x, wy, sag(x), 1)
    cu.bevel_depth = .0095; cu.bevel_resolution = 3; ob = bpy.data.objects.new('wire', cu); sc.collection.objects.link(ob); link(ob, WIREM); WIRES.append(ob)
# ---- scrub along the horizon: CC0 Poly Haven shrub_03 instances ----
import glob
gl_ = glob.glob(f'{D}/shrub_03/*.gltf')
if gl_:
    bpy.ops.import_scene.gltf(filepath=gl_[0]); imp = [o for o in bpy.context.selected_objects]
    base = imp[:]; 
    for o in base: o.location = (0, 0, -50)
    meshes = [o for o in base if o.type == 'MESH']
    for k in range(34):
        x = random.uniform(-80, 120); y = random.uniform(12, 90); sc_ = random.uniform(1.5, 3.2); rz = random.uniform(0, 6.28)
        for o in meshes:
            d_ = o.copy(); d_.data = o.data; sc.collection.objects.link(d_); d_.parent = None; d_.matrix_world = o.matrix_world.copy()
            d_.location = (x, y, 0); d_.scale = (sc_, sc_, sc_); d_.rotation_euler = (0, 0, rz)
    for o in base: bpy.data.objects.remove(o, do_unlink=True)
# ---- bird (procedural sparrow, 15 cm): body, head, beak, tail, wings, legs; animated by keyframes ----
BX = 3.0; BY = WIRE_Y[1]; BZ = sag(BX) + .0095 + .016   # standing on the middle wire
FEA = bpy.data.materials.new('feather'); FEA.use_nodes = True; fn = FEA.node_tree.nodes; fl = FEA.node_tree.links; fb = fn['Principled BSDF']
fb.inputs['Roughness'].default_value = .6; fb.inputs['Sheen Weight'].default_value = .4
fc = fn.new('ShaderNodeTexNoise'); fc.inputs['Scale'].default_value = 140; fc.inputs['Detail'].default_value = 8; fr = fn.new('ShaderNodeValToRGB')
fr.color_ramp.elements[0].color = (.045, .03, .02, 1); fr.color_ramp.elements[1].color = (.20, .125, .07, 1); fl.new(fc.outputs['Fac'], fr.inputs[0]); fl.new(fr.outputs['Color'], fb.inputs['Base Color'])
fbp = fn.new('ShaderNodeBump'); fbp.inputs['Strength'].default_value = .5; fl.new(fc.outputs['Fac'], fbp.inputs['Height']); fl.new(fbp.outputs[0], fb.inputs['Normal'])
BEAK = mat('beak', (.25, .2, .12), .4); EYE = mat('eye', (.01, .01, .01), .05, 0.0, Coat_Weight=1.0)
def ell(name, loc, scl, m, parent=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=20, radius=1.0, location=loc); o = bpy.context.object; o.name = name; o.scale = scl; o.rotation_euler = rot; link(o, m); smooth(o)
    if parent: o.parent = parent; o.matrix_parent_inverse = parent.matrix_world.inverted()
    return o
root = bpy.data.objects.new('bird', None); sc.collection.objects.link(root); root.location = (BX, BY, BZ + .05); root.rotation_euler = (0, 0, math.radians(float(os.environ.get('BROT', '235'))))   # faces +x? (rotated to face the camera side)
body = ell('body', (BX, BY, BZ + .05), (.064, .036, .042), FEA, root, (0, math.radians(-8), 0))
head = bpy.data.objects.new('headpivot', None); sc.collection.objects.link(head); head.location = (BX + .05, BY, BZ + .083); head.parent = root; head.matrix_parent_inverse = root.matrix_world.inverted()
hh = ell('head', (BX + .05, BY, BZ + .085), (.032, .027, .028), FEA, head); hh.matrix_parent_inverse = head.matrix_world.inverted() @ Matrix if False else hh.matrix_parent_inverse
bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=.011, radius2=.001, depth=.026, location=(BX + .092, BY, BZ + .084), rotation=(0, math.radians(90), 0)); bk = bpy.context.object; link(bk, BEAK); bk.parent = head; bk.matrix_parent_inverse = head.matrix_world.inverted()
for sy in (-1, 1): ell('eye', (BX + .072, BY + sy * .018, BZ + .092), (.0055, .0055, .0055), EYE, head)
tail = bpy.data.objects.new('tailpivot', None); sc.collection.objects.link(tail); tail.location = (BX - .055, BY, BZ + .055); tail.parent = root; tail.matrix_parent_inverse = root.matrix_world.inverted()
bpy.ops.mesh.primitive_cube_add(size=1, location=(BX - .105, BY, BZ + .045)); tl = bpy.context.object; tl.scale = (.08, .028, .006); tl.rotation_euler = (0, math.radians(14), 0); link(tl, FEA); tl.parent = tail; tl.matrix_parent_inverse = tail.matrix_world.inverted()
for sy in (-1, 1): ell('wing', (BX - .018, BY + sy * .030, BZ + .052), (.058, .007, .021), FEA, root, (0, math.radians(-4), math.radians(sy * 5)))
for sy in (-1, 1):
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=.0022, depth=.04, location=(BX + .005, BY + sy * .012, BZ + .026)); lg = bpy.context.object; link(lg, BEAK); lg.parent = root; lg.matrix_parent_inverse = root.matrix_world.inverted()
    for tx in (-.012, .0, .012):
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=.0016, depth=.016, location=(BX + .005 + tx, BY + sy * .012, BZ + .006), rotation=(math.radians(90), 0, 0)); tt = bpy.context.object; link(tt, BEAK); tt.parent = root; tt.matrix_parent_inverse = root.matrix_world.inverted()
# animation: 12 fps clip, 24 frames: wire sway (damped), body bob, head turn, tail flick
def key(o, prop, frame, val): setattr(o, prop, val); o.keyframe_insert(prop, frame=frame)
for fr_ in range(1, 25):
    t = (fr_ - 1) / 12.0
    root.location = (BX, BY, BZ + .05 + .004 * math.sin(t * 5.0) * math.exp(-t * .4)); root.keyframe_insert('location', frame=fr_)
    head.rotation_euler = (0, math.radians(8 * math.sin(t * 2.2)), math.radians(55 * math.sin(t * 1.7) if 0.4 < t < 1.7 else 0)); head.keyframe_insert('rotation_euler', frame=fr_)
    tail.rotation_euler = (0, math.radians(10 * (math.sin(t * 9) if 1.0 < t < 1.4 else 0)), 0); tail.keyframe_insert('rotation_euler', frame=fr_)
for fr_ in range(1, 25):
    wmp.inputs['Location'].default_value[0] = -(fr_ - 1) / 24.0 * 2.857; wmp.inputs['Location'].keyframe_insert('default_value', frame=fr_, index=0)
# ---- sun and camera ----
def cam(loc, look, lens, fstop=None, focus=None):
    bpy.ops.object.camera_add(location=loc); cm = bpy.context.object; sc.camera = cm; cm.data.lens = lens; cm.data.sensor_fit = 'VERTICAL'; cm.data.sensor_height = 36
    d = Vector(look) - Vector(loc); cm.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    if fstop: cm.data.dof.use_dof = True; cm.data.dof.aperture_fstop = fstop; cm.data.dof.focus_distance = (Vector(focus) - Vector(loc)).length
    return cm
if SHOT == 'wide': cam((-20, -9, 1.4), (3, 0, 7.4), 32, 8.0, (0, 0, 8.5))
elif SHOT == 'sil': cam((-8.5, -2.6, 1.2), (3.0, 0, 7.6), 36, 6.3, (BX, BY, BZ))
elif SHOT == 'rack': RACK = cam((BX - 1.7, -0.30, BZ - .02), (BX + .2, BY, BZ + .05), 85, 2.0, (BX - 1.2, BY, BZ))
elif SHOT == 'macro': cam((BX + .06, -.62, BZ + .10), (BX, BY, BZ + .04), 85, 2.8, (BX, BY, BZ + .05))
else: cam((BX + .5, -1.4, BZ + .02), (BX, BY, BZ + .03), 70, 4.0, (BX, BY, BZ))
# ---- render ----
sc.frame_start, sc.frame_end = F0, F1; T0 = time.time(); n_ = 0
for fr_ in range(F0, F1 + 1):
    if SHOT == 'rack': RACK.data.dof.focus_distance = 0.55 + (1.75 - 0.55) * min(1, max(0, (fr_ - 6) / 12.0))   # rack focus from the pulsing wire to the bird
    sc.frame_set(fr_); sc.render.filepath = f'{OUTD}/{SHOT}_{fr_:03d}.png'; t1_ = time.time(); bpy.ops.render.render(write_still=True); n_ += 1
    print(f'FRAME {fr_} {time.time() - t1_:.1f}s', flush=True)
print(f'TOTAL {n_} frames {time.time() - T0:.1f}s avg {(time.time() - T0) / n_:.1f}s per frame at {W}x{H} {SPP}spp', flush=True)
