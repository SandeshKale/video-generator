"""OTP journey: one continuous Monsoon-Noir city, camera swings through it. Pure function of frame index.
usage: python3 world.py <f0> <f1> <outdir> [W H samples]   (fps 15; timing from ../timing.json)
Amber = the OTP packet, cyan = network, red = the fake caller. Seeded; no wall-clock anywhere."""
import bpy, math, random, sys, os, json
import numpy as np, mathutils
from scipy.interpolate import CubicSpline, PchipInterpolator
HERE = os.path.dirname(os.path.abspath(__file__))
F0, F1, OUT = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
W = int(sys.argv[4]) if len(sys.argv) > 4 else 540; H = int(sys.argv[5]) if len(sys.argv) > 5 else 960; SAMP = int(sys.argv[6]) if len(sys.argv) > 6 else 14
FPS = int(os.environ.get('FPS', '12')); DUR = 66.0
os.makedirs(OUT, exist_ok=True); random.seed(7)
V = mathutils.Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMP; sc.cycles.use_denoising = True
sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 2; sc.cycles.volume_bounces = 0; sc.cycles.volume_step_rate = 3.0; sc.cycles.volume_max_steps = 24
sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.image_settings.file_format = 'PNG'; sc.render.use_persistent_data = True
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree
bgn = nt.nodes['Background']; tcw = nt.nodes.new('ShaderNodeTexCoord'); sepw = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tcw.outputs['Generated'], sepw.inputs[0])
rampw = nt.nodes.new('ShaderNodeValToRGB'); rampw.color_ramp.elements[0].position = 0.42; rampw.color_ramp.elements[0].color = (0.05, 0.34, 0.42, 1); rampw.color_ramp.elements[1].position = 0.78; rampw.color_ramp.elements[1].color = (0.004, 0.02, 0.035, 1)
nt.links.new(sepw.outputs['Z'], rampw.inputs[0]); nt.links.new(rampw.outputs[0], bgn.inputs[0]); bgn.inputs[1].default_value = 1.6
vol = nt.nodes.new('ShaderNodeVolumeScatter'); vol.inputs['Density'].default_value = 0.0065; vol.inputs['Color'].default_value = (0.4, 0.65, 0.75, 1)
if os.environ.get('FOG','0')=='1': nt.links.new(vol.outputs[0], nt.nodes['World Output'].inputs['Volume'])
AMB = (1.0, 0.5, 0.1, 1); CY = (0.05, 0.75, 0.95, 1); RED = (1.0, 0.06, 0.08, 1); GRN = (0.2, 1.0, 0.5, 1)
def emit(name, col, s):
    m = bpy.data.materials.new(name); m.use_nodes = True; n = m.node_tree
    for x in list(n.nodes): n.nodes.remove(x)
    e = n.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = col; e.inputs[1].default_value = s
    o = n.nodes.new('ShaderNodeOutputMaterial'); n.links.new(e.outputs[0], o.inputs[0]); return m
def windows(name, base, la, lb, density, scale):
    m = bpy.data.materials.new(name); m.use_nodes = True; n = m.node_tree
    for x in list(n.nodes): n.nodes.remove(x)
    tc = n.nodes.new('ShaderNodeTexCoord'); mp = n.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = scale; n.links.new(tc.outputs['Object'], mp.inputs[0])
    fl = n.nodes.new('ShaderNodeVectorMath'); fl.operation = 'FLOOR'; n.links.new(mp.outputs[0], fl.inputs[0])
    fr = n.nodes.new('ShaderNodeVectorMath'); fr.operation = 'FRACTION'; n.links.new(mp.outputs[0], fr.inputs[0])
    wn = n.nodes.new('ShaderNodeTexWhiteNoise'); wn.noise_dimensions = '3D'; n.links.new(fl.outputs[0], wn.inputs['Vector'])
    thr = n.nodes.new('ShaderNodeMath'); thr.operation = 'GREATER_THAN'; thr.inputs[1].default_value = 1 - density; n.links.new(wn.outputs['Value'], thr.inputs[0])
    sx = n.nodes.new('ShaderNodeSeparateXYZ'); n.links.new(fr.outputs[0], sx.inputs[0])
    def band(ch):
        a = n.nodes.new('ShaderNodeMath'); a.operation = 'GREATER_THAN'; a.inputs[1].default_value = 0.28; n.links.new(sx.outputs[ch], a.inputs[0])
        b = n.nodes.new('ShaderNodeMath'); b.operation = 'LESS_THAN'; b.inputs[1].default_value = 0.72; n.links.new(sx.outputs[ch], b.inputs[0])
        c = n.nodes.new('ShaderNodeMath'); c.operation = 'MULTIPLY'; n.links.new(a.outputs[0], c.inputs[0]); n.links.new(b.outputs[0], c.inputs[1]); return c
    bz = band('Z'); bxy = n.nodes.new('ShaderNodeMath'); bxy.operation = 'MULTIPLY'; bxa = band('X'); bya = band('Y'); mx = n.nodes.new('ShaderNodeMath'); mx.operation = 'MAXIMUM'
    n.links.new(bxa.outputs[0], mx.inputs[0]); n.links.new(bya.outputs[0], mx.inputs[1]); n.links.new(bz.outputs[0], bxy.inputs[0]); n.links.new(mx.outputs[0], bxy.inputs[1])
    mask = n.nodes.new('ShaderNodeMath'); mask.operation = 'MULTIPLY'; n.links.new(thr.outputs[0], mask.inputs[0]); n.links.new(bxy.outputs[0], mask.inputs[1])
    pick = n.nodes.new('ShaderNodeMath'); pick.operation = 'GREATER_THAN'; pick.inputs[1].default_value = 0.5; n.links.new(wn.outputs['Value'], pick.inputs[0])
    mc = n.nodes.new('ShaderNodeMix'); mc.data_type = 'RGBA'; mc.inputs[6].default_value = la; mc.inputs[7].default_value = lb; n.links.new(pick.outputs[0], mc.inputs[0])
    em = n.nodes.new('ShaderNodeEmission'); em.inputs[1].default_value = 1.7; n.links.new(mc.outputs[2], em.inputs[0])
    bs = n.nodes.new('ShaderNodeBsdfPrincipled'); bs.inputs['Base Color'].default_value = base; bs.inputs['Roughness'].default_value = 0.25; bs.inputs['Metallic'].default_value = 0.6
    mx2 = n.nodes.new('ShaderNodeMixShader'); n.links.new(mask.outputs[0], mx2.inputs[0]); n.links.new(bs.outputs[0], mx2.inputs[1]); n.links.new(em.outputs[0], mx2.inputs[2])
    o = n.nodes.new('ShaderNodeOutputMaterial'); n.links.new(mx2.outputs[0], o.inputs[0]); return m
def prin(name, col, r=0.5, met=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = col; b.inputs['Roughness'].default_value = r; b.inputs['Metallic'].default_value = met; return m
DIMC = (0.0, 0.32, 0.55, 1); DIMW = (0.75, 0.42, 0.16, 1)
mat_a = windows('winA', (0.02, 0.05, 0.065, 1), DIMC, DIMW, 0.32, (0.3, 0.3, 0.27)); mat_b = windows('winB', (0.03, 0.04, 0.05, 1), DIMC, DIMC, 0.22, (0.25, 0.25, 0.22))
amber = emit('amber', AMB, 16); cyan = emit('cyan', CY, 8); red = emit('red', RED, 14); green = emit('green', GRN, 10)
roof = prin('roof', (0.03, 0.045, 0.055, 1), 0.5); wet = prin('wet', (0.01, 0.018, 0.022, 1), 0.12, 0.3); blk = prin('sil', (0.004, 0.004, 0.006, 1), 0.8)
def box(loc, size, m):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(loc[0], loc[1], loc[2] + size[2] / 2)); o = bpy.context.object; o.scale = size; o.data.materials.append(m); bpy.ops.object.transform_apply(scale=True); return o
bpy.ops.mesh.primitive_plane_add(size=300, location=(0, 0, 0)); bpy.context.object.data.materials.append(wet)
P = 22; N = 7; SKIP = [(0, 0), (3, 0), (-2, -3), (1, -2), (2, 3), (-3, 2)]
for gx in range(-N, N + 1):
    for gy in range(-N, N + 1):
        if (gx, gy) in SKIP: continue
        x, y = gx * P, gy * P; d = math.hypot(gx, gy); h = max(7, random.uniform(10, 46) * (1.25 - d / 14)); s = random.uniform(11, 15)
        m = mat_a if random.random() < .6 else mat_b
        box((x, y, 0), (s, s + random.uniform(-2, 2), h), m)
        if h > 24 and random.random() < .6: box((x, y, h), (s * .6, s * .6, random.uniform(4, 9)), m)     # setback crown
        if h > 30 and random.random() < .5: box((x + s * .2, y, h), (0.5, 0.5, random.uniform(8, 16)), roof)  # antenna mast
box((0, 0, 0), (16, 16, 95), mat_a); box((0, 0, 95), (12, 12, 10), roof); box((0, 0, 105), (0.6, 0.6, 12), roof)
box((3 * P, 0, 0), (30, 20, 16), mat_b); box((1 * P, -2 * P, 0), (22, 14, 8), mat_b); box((2 * P, 3 * P, 0), (16, 16, 60), mat_a)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=5, radius2=0.6, depth=70, location=(-2 * P, -3 * P, 35)); bpy.context.object.data.materials.append(mat_b)
HOME = (-3 * P, 2 * P); box((HOME[0], HOME[1], 0), (14, 14, 38), mat_b)
# phone on the home roof edge, screen facing the city
dvec = V((0.83, -0.55, 0)).normalized(); PH = V((-61.6, 42.4, 38.0)); th = math.atan2(dvec.x, -dvec.y)
box((PH.x - 0.0, PH.y, 37.0), (1.4, 1.4, 1.0), roof)     # parapet block under the phone
PHB = PH + V((0, 0, 0.0))
bpy.ops.mesh.primitive_cube_add(size=1, location=PHB + V((0, 0, 0.078))); ph = bpy.context.object; ph.scale = (0.0725, 0.008, 0.15); ph.rotation_euler = (0, 0, th); ph.data.materials.append(prin('phone', (0.02, 0.02, 0.025, 1), 0.25, 0.8))
bpy.ops.mesh.primitive_plane_add(size=1, location=PHB + V((0, 0, 0.078)) + dvec * 0.0045); sc_ = bpy.context.object; sc_.scale = (0.066, 0.14, 1); sc_.rotation_euler = (math.pi / 2, 0, th)
scr = emit('screen', (0.02, 0.05, 0.06, 1), 0.4); sc_.data.materials.append(scr)
def txt(body, loc, rot, size, mat, ext=0.1):
    bpy.ops.object.text_add(location=loc, rotation=rot); t = bpy.context.object; t.data.body = body; t.data.size = size; t.data.extrude = size * ext; t.data.align_x = 'CENTER'; t.data.align_y = 'CENTER'; t.data.materials.append(mat); return t
scr_txt = txt('482917', PHB + V((0, 0, 0.086)) + dvec * 0.0052, (math.pi / 2, 0, th), 0.020, amber, 0.02)
# lanes (cyan fibre) on the ground
def lane(pts, m, r=0.35):
    cu = bpy.data.curves.new('l', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts): sp.points[i].co = (p[0], p[1], p[2], 1)
    ob = bpy.data.objects.new('l', cu); sc.collection.objects.link(ob); ob.data.materials.append(m); return ob
for pts in ([(0, 11, .4), (0, 88, .4)], [(0, 11, .4), (66, 11, .4), (66, 0, .4)], [(66, 11, .4), (66, -55, .4), (-33, -55, .4)], [(33, -33, .4), (33, 11, .4)], [(-33, 11, .4), (55, 11, .4), (55, 57, .4)], [(-33, 11, .4), (-55, 11, .4), (-55, 44, .4)]):
    lane(pts, cyan)
# sun + orb + lights
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(60), 0, math.radians(30))); sun = bpy.context.object; sun.data.energy = 0.22; sun.data.color = (0.5, 0.75, 1)
orb_mat = emit('orb', AMB, 40); bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=24, ring_count=12); orb = bpy.context.object; orb.data.materials.append(orb_mat)
bpy.ops.object.light_add(type='POINT'); orb_l = bpy.context.object; orb_l.data.color = AMB[:3]; orb_l.data.shadow_soft_size = 1.5
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=16, ring_count=8); ghost = bpy.context.object; ghost.data.materials.append(emit('ghost', (0.7, 0.45, 0.25, 1), 6))
bpy.ops.object.light_add(type='POINT'); phone_l = bpy.context.object; phone_l.data.color = AMB[:3]; phone_l.data.energy = 0.6; phone_l.data.shadow_soft_size = 0.05; phone_l.location = PHB + V((0, 0, .1)) + dvec * .12
# bank digits on the tower face
bank_txt = txt('482917', (0, -8.5, 66), (math.pi / 2, 0, 0), 5.0, amber, 0.12); bank_l = None
bpy.ops.object.light_add(type='POINT', location=(0, -22, 66)); bank_l = bpy.context.object; bank_l.data.color = AMB[:3]; bank_l.data.shadow_soft_size = 8
# red caller on the perch roof
PR = V((2 * P, 3 * P, 60.0)); box((PR.x, PR.y, 59.6), (15, 15, 0.4), roof)
sdir = V((-0.83, -0.55, 0)).normalized()   # faces the home phone side
bpy.ops.mesh.primitive_cylinder_add(radius=0.46, depth=1.3, location=PR + V((0, 0, 0.7))); sil1 = bpy.context.object; sil1.data.materials.append(blk)
bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.6, radius2=0.4, depth=0.7, location=PR + V((0, 0, 1.6))); bpy.context.object.data.materials.append(blk)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.26, location=PR + V((0, 0, 2.13))); bpy.context.object.data.materials.append(blk)
bpy.ops.mesh.primitive_cube_add(size=1, location=PR + V((0, 0, 1.75)) + sdir * 0.62); rp = bpy.context.object; rp.scale = (0.2, 0.03, 0.34); rp.rotation_euler = (0, 0, math.atan2(sdir.x, -sdir.y)); rp.data.materials.append(red)
bpy.ops.object.light_add(type='POINT', location=PR + V((0, 0, 1.8)) + sdir * 1.0); rl = bpy.context.object; rl.data.color = RED[:3]; rl.data.energy = 400; rl.data.shadow_soft_size = 0.6
RPH = PR + V((0, 0, 1.75)) + sdir * 0.62
# red lane = Catmull path caller phone -> home phone
RL_PTS = [RPH, V((15, 62, 70)), V((-20, 55, 64)), V((-48, 46, 48)), PH + V((0, 0, 0.3))]
rl_t = np.linspace(0, 1, len(RL_PTS)); rcs = CubicSpline(rl_t, np.array([[p.x, p.y, p.z] for p in RL_PTS]))
def redpos(u): u = min(max(u, 0), 1); return V(tuple(rcs(u)))
rlane = lane([tuple(redpos(i / 40)) for i in range(41)], red, 0.12)
used_t = txt('USED', PH + V((0, 0, 0.30)) + dvec * 0.35, (math.pi / 2, 0, th), 0.06, red, 0.1); blk_t = txt('BLOCKED', PH + V((0, 0, 0.17)) + dvec * 0.35, (math.pi / 2, 0, th), 0.045, red, 0.1)
tick = [box((0, 0, 0), (0.004, 0.004, 0.004), green), box((0, 0, 0), (0.004, 0.004, 0.004), green)]
for i, (l_, a_, ox, oz) in enumerate([(0.022, -40, -0.011, 0.0), (0.04, 50, 0.014, 0.008)]):
    o = tick[i]; o.dimensions = (l_, 0.004, 0.006); o.rotation_euler = (0, math.radians(a_), th); o.location = PHB + V((0, 0, 0.07)) + dvec * 0.0058 + V((ox * dvec.y * -1, ox * dvec.x, oz))
# swarm of random digits (s8) + burn-out sparks (s7)
swarm = [txt('000000', V((-45 + random.uniform(-22, 22), 15 + random.uniform(-22, 22), 55 + random.uniform(-12, 18))), (math.pi / 2, 0, random.uniform(-.6, .6)), 2.2, amber, 0.05) for _ in range(10)]
sparks = []
for i in range(40):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=8, ring_count=4); o = bpy.context.object; o.data.materials.append(amber); sparks.append((o, V((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(.5, 2.5))).normalized() * random.uniform(.5, 1.6), random.uniform(.5, 1.0)))
# ---------- timeline ----------
def spl(keys):
    ts = np.array([k[0] for k in keys]); vs = np.array([k[1:] for k in keys], dtype=float); f = PchipInterpolator(ts, vs, axis=0); return lambda t: f(min(max(t, ts[0]), ts[-1]))
def d_(k): return PH + dvec * k
cam_k = [
 (0.0,  *(PH + dvec * 0.40 + V((0, 0, 0.09))), *(PH + V((0, 0, 0.085))), 80, 0),
 (0.9,  *(PH + dvec * 1.4 + V((0, 0, 0.5))),  *(PH + V((0, 0, 0.12))), 55, 0),
 (1.7,  *(PH + dvec * 5 + V((0, 0, 3.5))),    *(PH + V((0, 0, 0.8)).lerp(V((-20, 8, 48)), 0.3)), 35, -4),
 (2.27, *V((-44, 34, 52)), *V((-20, 0, 56)), 28, -6),
 (3.4,  *V((-52, -22, 64)), *V((-4, -10, 66)), 26, -9),
 (4.69, *V((-34, -70, 54)), *V((0, -8, 68)), 24, -9),
 (6.6,  *V((-14, -42, 66)), *V((0, -8, 67)), 24, -4),
 (8.13, *V((12, -32, 80)), *V((0, 0, 84)), 26, 0),
 (10.0, *V((30, 8, 92)), *V((0, 0, 92)), 26, 3),
 (11.8, *V((16, 32, 100)), *V((0, 0, 94)), 26, 5),
 (13.19, *V((-8, 34, 98)), *V((0, -4, 80)), 26, 3),
 (14.5, *V((18, 16, 90)), *V((4, -18, 62)), 26, 5),
 (15.6, *V((38, -6, 58)), *V((14, -32, 34)), 24, 8),
 (16.73, *V((42, -58, 28)), *V((22, -44, 9)), 24, 6),
 (18.0, *V((26, -72, 30)), *V((44, -22, 24)), 24, -7),
 (19.28, *V((88, -22, 34)), *V((66, 0, 18)), 24, -8),
 (20.6, *V((82, 30, 66)), *V((36, -14, 70)), 24, 6),
 (22.03, *V((-6, -40, 104)), *V((-40, -62, 76)), 24, 6),
 (23.3, *V((-14, -56, 88)), *V((-44, -66, 72)), 26, 4),
 (25.0, *V((-34, -66, 104)), *V((-58, -34, 90)), 24, -6),
 (27.2, *V((-98, 10, 84)), *V((-66, 6, 70)), 24, 7),
 (29.2, *(PH + dvec * 9 + V((0, 0, 7))), *(PH + V((0, 0, 0.3))), 30, 0),
 (30.2, *(PH + dvec * 3.5 + V((0, 0, 1.6))), *(PH + V((0, 0, 0.1))), 45, 0),
 (31.2, *(PH + dvec * 0.9 + V((0, 0, 0.25))), *(PH + V((0, 0, 0.09))), 60, 0),
 (32.8, *(PH + dvec * 0.46 + V((0, 0, 0.1))), *(PH + V((0, 0, 0.085))), 80, 0),
 (34.5, *(PH + dvec * 1.5 + V((0, 0, 0.7))), *(PH + V((0, 0, 0.3))), 60, 0),
 (38.6, *(PH + dvec * 5 + V((0, 0, 3))), *(PH + V((0, 0, 0.9))), 40, 0),
 (39.6, *(PH + dvec * 8 + V((0, 0, 11))), *V((-48, 20, 52)), 30, -4),
 (41.5, *V((-40, 70, 88)), *V((-45, 15, 58)), 26, 8),
 (43.0, *V((-34, 80, 54)), *(PH + V((0, 0, 0.5))), 26, -4),
 (45.2, *(PH + dvec * 5 + V((0, 0, 2.4))), *(PH + V((0, 0, 0.3))), 34, 0),
 (47.0, *V((-18, 56, 78)), *V((-30, 50, 56)), 26, 6),
 (49.0, *V((22, 84, 74)), *V((-4, 54, 60)), 26, -5),
 (51.0, *(PR + V((7.5, 6, 3.6))), *V((26, 52, 60)), 30, 4),
 (52.6, *(PR + V((5.2, 4.2, 2.6))), *(PR + V((-6, -6, 2.2))), 34, 3),
 (53.6, *V((40, 40, 100)), *V((0, 0, 92)), 24, -8),
 (54.9, *V((26, -22, 98)), *V((0, 0, 96)), 26, 0),
 (56.4, *V((0, -60, 110)), *V((0, 0, 60)), 22, 0),
 (59.4, *V((0, -170, 150)), *V((0, 0, 40)), 20, 0),
 (61.6, *V((-100, -10, 80)), *V((-66, 40, 36)), 24, 5),
 (63.6, *(PH + dvec * 4.5 + V((0, 0, 2.2))), *(PH + V((0, 0, 0.2))), 36, 0),
 (66.0, *(PH + dvec * 0.7 + V((0, 0, 0.12))), *(PH + V((0, 0, 0.085))), 70, 0)]
cams = spl([(k[0], *k[1:]) for k in cam_k])
orb_k = [(13.7, 0, -9, 66), (14.8, 4, -16, 62), (15.8, 14, -30, 34), (16.73, 22, -44, 10.5), (18.0, 40, -26, 26), (19.28, 66, 0, 18.5), (20.6, 44, -26, 70), (22.0, 6, -42, 94), (22.45, -44, -66, 73),
         (24.6, -50, -52, 98), (27.0, -66, -4, 84), (28.8, -64, 26, 56), (29.7, PH.x, PH.y, PH.z + 0.22)]
orbp = spl(orb_k)
def orb_state(t):
    """returns (pos, radius)"""
    if 13.7 <= t <= 29.7:
        p = V(tuple(orbp(t))); r = 0.9 if t < 22.45 else 1.0
        if 22.45 <= t <= 23.3: r = 1.0 + 3.0 * (1 - abs((t - 22.45) / 0.85 - 0.5) * 2)   # ring pulse swell at the tower
        if t > 28.8: r = max(0.01, 1.0 * (29.7 - t) / 0.9)
        return p, r
    if 46.4 <= t <= 52.5:
        u = (t - 46.4) / (52.5 - 46.4); u = u * u * (3 - 2 * u); p = redpos(1 - u); return p + V((0, 0, 0.0)), 0.8 if u > .02 else 0.01
    return None, 0
ghost_p = lambda t: V(120 * 0 + (-44 + (80 + 44) * min(max((t - 23.7) / 3.2, 0), 1) ** 0.8), -66 + (70 + 66) * min(max((t - 23.7) / 3.2, 0), 1) ** 0.8, 76 - 36 * min(max((t - 23.7) / 3.2, 0), 1))
def setv(o, vis): o.hide_render = not vis; o.hide_viewport = not vis
camd = bpy.data.cameras.new('c'); camd.dof.use_dof = True; camd.dof.aperture_fstop = 4.0; cam = bpy.data.objects.new('c', camd); sc.collection.objects.link(cam); sc.camera = cam
def foggy(m, k=0.0085, col=(0.05, 0.27, 0.34, 1)):
    n = m.node_tree; out = [x for x in n.nodes if x.type == 'OUTPUT_MATERIAL'][0]; src = out.inputs['Surface'].links[0].from_socket
    cd = n.nodes.new('ShaderNodeCameraData'); ex = n.nodes.new('ShaderNodeMath'); ex.operation = 'MULTIPLY'; ex.inputs[1].default_value = -k; n.links.new(cd.outputs['View Z Depth'], ex.inputs[0])
    e2 = n.nodes.new('ShaderNodeMath'); e2.operation = 'EXPONENT' if False else 'POWER'; e2.inputs[0].default_value = 2.718; n.links.new(ex.outputs[0], e2.inputs[1])
    inv = n.nodes.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1.0; n.links.new(e2.outputs[0], inv.inputs[1])
    sc_ = n.nodes.new('ShaderNodeMath'); sc_.operation = 'MULTIPLY'; sc_.inputs[1].default_value = 0.9; n.links.new(inv.outputs[0], sc_.inputs[0])
    fe = n.nodes.new('ShaderNodeEmission'); fe.inputs[0].default_value = col; fe.inputs[1].default_value = 0.6
    mx = n.nodes.new('ShaderNodeMixShader'); n.links.new(sc_.outputs[0], mx.inputs[0]); n.links.new(src, mx.inputs[1]); n.links.new(fe.outputs[0], mx.inputs[2]); n.links.new(mx.outputs[0], out.inputs['Surface'])
for m_ in (mat_a, mat_b, roof, wet): foggy(m_)
code = '482917'
for f in range(F0, F1 + 1):
    t = f / FPS; rnd = random.Random(f * 977 + 3)
    k = cams(t); pos = V((float(k[0]), float(k[1]), float(k[2]))); tgt = V((float(k[3]), float(k[4]), float(k[5])))
    sh = 0.0004 if t < 3 else 0.06; pos += V((math.sin(t * 7.1), math.sin(t * 5.3 + 1), math.sin(t * 6.2 + 2))) * sh   # hand-held breathing
    cam.location = pos; q = (tgt - pos).to_track_quat('-Z', 'Y'); roll = mathutils.Matrix.Rotation(math.radians(float(k[7])), 3, (tgt - pos).normalized()); cam.rotation_euler = (roll @ q.to_matrix()).to_euler()
    camd.lens = float(k[6]); camd.dof.focus_distance = (tgt - pos).length
    camd.dof.aperture_fstop = 2.8 if (tgt - pos).length < 3 else 8.0
    # orb
    p, r = orb_state(t)
    if p is None or r <= 0.02: setv(orb, False); orb_l.data.energy = 0
    else: setv(orb, True); orb.location = p; orb.scale = (r, r, r); orb_l.location = p; orb_l.data.energy = 9000 * r * r
    # ghost (weak-network case)
    if 23.7 <= t <= 27.4: setv(ghost, True); ghost.location = ghost_p(t); s_ = 0.8 * max(0.05, 1 - max(0, t - 25.4) / 2) * (1 if rnd.random() > .25 else 0.3); ghost.scale = (s_, s_, s_)
    else: setv(ghost, False)
    # bank digits: scramble, then lock, then hand over to the orb
    if 4.5 <= t < 13.7:
        setv(bank_txt, True); bank_txt.data.body = ''.join(rnd.choice('0123456789') for _ in range(6)) if t < 6.8 else code; sc_s = min(1, (t - 4.5) / 0.4); bank_txt.scale = (sc_s,) * 3; bank_l.data.energy = 14000 * sc_s
    else: setv(bank_txt, False); bank_l.data.energy = 0
    # phone screen / typing / tick
    on = t < 2.6 or t >= 29.7
    scr.node_tree.nodes['Emission'].inputs[0].default_value = (0.02, 0.05, 0.06, 1) if not on else (0.05, 0.08, 0.1, 1)
    if t < 2.6 or 29.7 <= t < 30.2: setv(scr_txt, True); scr_txt.data.body = code
    elif 30.2 <= t < 59.5:
        n = min(6, int((t - 30.2) / 0.15)); setv(scr_txt, n > 0); scr_txt.data.body = code[:n]
    else: setv(scr_txt, False)
    for o in tick: setv(o, 32.3 <= t < 59.5)
    phone_l.data.energy = 0.6 if on and not (t >= 59.5) else 0.05
    setv(used_t, 35.7 <= t < 38.8); setv(blk_t, 37.1 <= t < 38.8)
    # sparks (burn-out of the used code)
    for o, v, life in sparks:
        a = (t - 33.7) / (2.6 * life)
        if 0 <= a < 1: setv(o, True); o.location = PH + V((0, 0, 0.24)) + v * (0.9 * a * 6 * 0.1 + a * 0.5); s_ = 0.012 * (1 - a); o.scale = (s_, s_, s_)
        else: setv(o, False)
    # digit swarm (guessing is pointless)
    for i, o in enumerate(swarm):
        if 38.9 <= t < 41.6: setv(o, True); o.data.body = ''.join(rnd.choice('0123456789') for _ in range(6))
        else: setv(o, False)
    # red lane + caller
    setv(rlane, 42.5 <= t < 53.6); rlane.data.materials[0] = red
    rl.data.energy = 400 if 42.5 <= t < 53.6 else 120
    sc.render.filepath = os.path.join(OUT, 'f%04d.png' % f); bpy.ops.render.render(write_still=True)
