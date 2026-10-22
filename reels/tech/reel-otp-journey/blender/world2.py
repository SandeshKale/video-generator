"""OTP journey v2: the animated route world. usage: FPS=15 python3 world2.py <f0> <f1> <outdir> [W H samples]
Static scene = route.py (five landmarks on one cyan route, skyline). Everything that moves is a pure function of t, keyed to timing.json (voice).
Hero = one amber token with its digits + a lifetime ring; camera = chase cam with a lag + holds at landmarks. Million-dot field = the floor grid."""
import sys, os, math, json, random
F0, F1, OUTD = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]; _rest = sys.argv[4:]
sys.argv = [sys.argv[0], OUTD] + _rest
HERE = os.path.dirname(os.path.abspath(__file__))
_src = open(os.path.join(HERE, 'route.py')).read()
exec(_src[:_src.index("# ---- hero token ----")])
import numpy as np
from scipy.interpolate import PchipInterpolator
sc.render.use_persistent_data = True
TM = json.load(open(os.path.join(HERE, '..', 'timing.json')))
def K(si, ci, ab): return TM['sentences'][si]['clauses'][ci][ab]
a_bank = K(2, 0, 'a'); a_gate = K(4, 0, 'a'); a_core = K(4, 1, 'a'); a_tow = K(4, 2, 'a'); tow_end = K(4, 2, 'b'); a_air = K(5, 0, 'a'); a_late = K(5, 1, 'a')
a_type = K(6, 0, 'a'); a_match = K(6, 1, 'a'); a_pass = K(6, 2, 'a'); a_dead = K(7, 0, 'a'); a_block = K(7, 1, 'a'); a_guess = K(8, 0, 'a'); guess_end = K(8, 0, 'b')
a_you = K(9, 0, 'a'); a_theirs = K(9, 1, 'a'); a_rush = K(10, 0, 'a'); a_isnt = K(10, 1, 'a'); a_own = K(10, 2, 'a'); own_end = K(10, 2, 'b'); a_never = K(11, 0, 'a'); a_1930 = K(12, 0, 'a'); a_cta = K(13, 0, 'a')
END = 66.0; FPSV = FPS
# ---- extra materials / objects ----
ringm = emit('ringm', (1.0, 0.42, 0.06, 1), 0.6)
for r_ in pulse_rings: r_.data.materials[0] = ringm; r_.rotation_euler = (0, 0, 0)
def grid_floor():
    m = bpy.data.materials.new('dots'); m.use_nodes = True; n = m.node_tree
    for x in list(n.nodes): n.nodes.remove(x)
    tc = n.nodes.new('ShaderNodeTexCoord'); fr = n.nodes.new('ShaderNodeVectorMath'); fr.operation = 'FRACTION'; n.links.new(tc.outputs['Object'], fr.inputs[0])
    sp = n.nodes.new('ShaderNodeSeparateXYZ'); n.links.new(fr.outputs[0], sp.inputs[0])
    ax = n.nodes.new('ShaderNodeMath'); ax.operation = 'LESS_THAN'; ax.inputs[1].default_value = 0.045; n.links.new(sp.outputs['X'], ax.inputs[0])
    ay = n.nodes.new('ShaderNodeMath'); ay.operation = 'LESS_THAN'; ay.inputs[1].default_value = 0.045; n.links.new(sp.outputs['Y'], ay.inputs[0])
    mx = n.nodes.new('ShaderNodeMath'); mx.operation = 'MAXIMUM'; n.links.new(ax.outputs[0], mx.inputs[0]); n.links.new(ay.outputs[0], mx.inputs[1])
    sc_ = n.nodes.new('ShaderNodeMath'); sc_.operation = 'MULTIPLY'; sc_.inputs[1].default_value = 0.5; n.links.new(mx.outputs[0], sc_.inputs[0])
    em = n.nodes.new('ShaderNodeEmission'); em.inputs[0].default_value = (0.04, 0.45, 0.65, 1); em.inputs[1].default_value = 0.45
    tr = n.nodes.new('ShaderNodeBsdfTransparent'); ms = n.nodes.new('ShaderNodeMixShader'); n.links.new(sc_.outputs[0], ms.inputs[0]); n.links.new(tr.outputs[0], ms.inputs[1]); n.links.new(em.outputs[0], ms.inputs[2])
    o = n.nodes.new('ShaderNodeOutputMaterial'); n.links.new(ms.outputs[0], o.inputs[0]); return m
bpy.ops.mesh.primitive_plane_add(size=900, location=(0, 120, 0.05)); bpy.context.object.data.materials.append(grid_floor())
LIT = V((-34, 226, 0))
box((LIT.x - 0.5, LIT.y - 0.5, 0.05), (1, 1, 0.35), amber); bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=700, location=(LIT.x, LIT.y, 350)); bpy.context.object.data.materials.append(emit('beam', (1.0, 0.45, 0.08, 1), 2.0))
bpy.ops.object.light_add(type='POINT', location=(LIT.x, LIT.y, 3)); beam_l = bpy.context.object; beam_l.data.color = AMB[:3]; beam_l.data.energy = 6000; beam_l.data.shadow_soft_size = 2
beam_objs = [o for o in bpy.data.objects if o.type == 'MESH' and abs(o.location.z - 350) < 1]
# hero token
orb_col = emit('orb2', (1.0, 0.32, 0.03, 1), 1.6); bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=32, ring_count=16); orb = bpy.context.object; orb.data.materials.append(orb_col)
halo = emit('halo', (1.0, 0.4, 0.05, 1), 0.7); bpy.ops.mesh.primitive_torus_add(major_radius=1.0, minor_radius=0.05, major_segments=48, minor_segments=8); ring = bpy.context.object; ring.data.materials.append(halo)
dig = sign('482917', (0, 0, 0), 1.0, amber)
bpy.ops.object.light_add(type='POINT'); orb_l = bpy.context.object; orb_l.data.color = AMB[:3]; orb_l.data.shadow_soft_size = 1.5
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(50), 0, math.radians(20))); sn = bpy.context.object; sn.data.energy = 0.5; sn.data.color = (0.5, 0.75, 1)
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=20, ring_count=10); ghost = bpy.context.object; ghost.data.materials.append(emit('ghost2', (0.6, 0.4, 0.25, 1), 0.7))
env = box((0, 0, 0), (1, 1, 1), paper); env.scale = (3.0, 0.18, 1.9)
# phone screen text, tick, stamps
HX, HY = hx, hy; SCY = HY - 0.8; SCZ = 29.3
scr_txt = sign('482917', (HX, SCY, SCZ + 1.6), 1.25, amber); scr_mat = screen.data.materials[0]
tick_a = box((0, 0, 0), (1, 1, 1), green); tick_b = box((0, 0, 0), (1, 1, 1), green)
tick_a.dimensions = (1.5, 0.25, 0.4); tick_a.rotation_euler = (0, math.radians(45), 0); tick_a.location = (HX - 0.9, SCY - 0.1, SCZ - 2.0)
tick_b.dimensions = (3.4, 0.25, 0.4); tick_b.rotation_euler = (0, math.radians(-50), 0); tick_b.location = (HX + 0.7, SCY - 0.1, SCZ - 1.6)
used_s = sign('USED', (HX + 8, HY - 8, 33), 1.8, redn); blk_s = sign('BLOCKED', (HX + 8, HY - 8, 30.5), 1.4, redn)
beacon_s = sign('1930', (tx, ty - 3.5, 66), 3.4, led)
shield = tor((-18, -18, 9), 6.5, 0.35, led, rot=(math.pi / 2, 0, 0))
# the red tether (booth phone -> token / home phone)
BP = V((sx_ - 3.0, sy_ - 5.0, 23.4)); HP = V((HX, HY - 1.2, 29.3))
tcu = bpy.data.curves.new('t', 'CURVE'); tcu.dimensions = '3D'; tcu.bevel_depth = 0.12; tsp = tcu.splines.new('POLY'); tsp.points.add(11)
tether = bpy.data.objects.new('t', tcu); sc.collection.objects.link(tether); tether.data.materials.append(red)
def set_tether(a, b, sag=2.0):
    for i in range(12):
        u = i / 11; p = a.lerp(b, u); p.z -= sag * 4 * u * (1 - u); tsp.points[i].co = (p.x, p.y, p.z, 1)
gline = bpy.data.curves.new('g', 'CURVE'); gline.dimensions = '3D'; gline.bevel_depth = 0.35; gsp = gline.splines.new('POLY'); gsp.points.add(1)
gobj = bpy.data.objects.new('g', gline); sc.collection.objects.link(gobj); gobj.data.materials.append(red)
sparks = []
for i in range(40):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=8, ring_count=4); o = bpy.context.object; o.data.materials.append(amber)
    sparks.append((o, V((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(.2, 1.6))).normalized() * random.uniform(2, 7), random.uniform(.6, 1.0)))
# ---------- timeline ----------
def spl(keys):
    ts = np.array([k[0] for k in keys], dtype=float); vs = np.array([k[1:] for k in keys], dtype=float); f = PchipInterpolator(ts, vs, axis=0)
    return lambda t: f(min(max(t, ts[0]), ts[-1]))
B = V((-18, -13.5, 11.5)); SCR = V((HX, HY - 3.0, SCZ)); BOOTH_PH = V((sx_ - 3, sy_ - 5, 23.6))
tk = [(0, *B, 0.0), (a_bank, *B, 0.01), (a_bank + 0.9, *B, 1.2), (a_gate, *B, 1.2),
      (a_gate + 1.0, -6, 28, 36, 1.0), (a_gate + 1.7, 4, 58, 4.6, 0.8), (a_core - 0.08, 28, 58, 4.6, 0.8),
      (a_core + 0.9, 12, 96, 30, 0.9), (a_core + 1.8, -16, 117, 5.2, 0.9), (a_tow - 0.05, -16, 136, 5.2, 0.9),
      (a_tow + 1.0, 0, 166, 42, 1.0), (tow_end, tx, ty - 2.2, 58.5, 1.4), (a_air, tx, ty - 2.2, 58.5, 1.4),
      (a_air + 1.8, 8, 222, 80, 1.0), (a_late + 1.9, -4, 244, 52, 0.95), (a_type - 0.5, HX, SCR.y, SCZ + 0.3, 0.9), (a_type, HX, SCR.y + 2.0, SCZ + 0.3, 0.0),
      (a_type + 0.1, HX, SCR.y + 2.0, SCZ + 0.3, 0.0), (a_rush, HX, SCR.y + 2.0, SCZ + 0.3, 0.01), (a_rush + 0.8, HX, SCR.y, SCZ + 1.0, 1.0),
      (a_own - 0.5, 4, 238, 46, 1.0), (a_own + 1.0, 30, 226, 52, 0.95), (own_end, BOOTH_PH.x - 0.3, BOOTH_PH.y - 1.0, BOOTH_PH.z + 0.4, 0.9), (own_end + 0.5, BOOTH_PH.x, BOOTH_PH.y, BOOTH_PH.z, 0.0), (END, BOOTH_PH.x, BOOTH_PH.y, BOOTH_PH.z, 0.0)]
tok = spl(tk)
def tokpos(t): k = tok(t); return V((float(k[0]), float(k[1]), float(k[2]))), float(k[3])
# camera keys: explicit holds + chase segments generated from the token path
ck = []
def add(t, pos, tgt, lens, roll=0): ck.append((t, *pos, *tgt, lens, roll))
ph_f = V((HX, HY, SCZ))
add(0.0, (HX, HY - 11.5, SCZ), ph_f, 36); add(1.0, (HX - 1.5, HY - 13.5, SCZ + 1.2), ph_f, 34); add(2.1, (HX - 7, HY - 28, 37), ph_f + V((0, -40, -8)), 30, -3)
add(2.7, (-4, 215, 62), (-14, 140, 24), 28, -5); add(3.5, (2, 120, 70), (-16, 40, 20), 26, 4); add(4.4, (-14, 22, 46), (-18, -8, 12), 26, -3)
add(a_bank, (-30, -40, 16), B + V((0, 0, 1)), 30, -3); add(a_bank + 3.4, (-22, -34, 13), B + V((0, 0, 1)), 30, 0)
add(a_bank + 4.6, (-40, -30, 15), B + V((2, 0, 0)), 28, 3); add(a_bank + 6.8, (-18, -38, 19), B, 28, 0); add(a_gate - 0.3, (0, -30, 17), B, 28, 3)
def chase(t0, t1, step, side, back, up, lens, rollamp, lead=0.5, lag=0.7):
    tt = t0
    while tt <= t1 + 1e-6:
        p, s = tokpos(tt - lag); q, _ = tokpos(tt + lead); sd = side * math.sin(tt * 1.7)
        add(tt, p + V((sd, -back, up)), q + V((0, 2, 1.2)), lens, rollamp * math.sin(tt * 1.7 + 1)); tt += step
chase(a_gate + 0.2, a_tow + 0.6, 0.4, 7, 16, 8, 28, 7)
add(tow_end + 0.1, (34, 140, 40), (tx, ty, 46), 26, 4); add(a_air + 0.5, (38, 150, 52), (tx, ty, 56), 26, 4)
chase(a_air + 1.6, a_late + 1.6, 0.5, 9, 14, 8, 26, 6, 0.6, 0.9)
add(a_type - 0.5, (HX - 6, HY - 20, 33), V((HX, HY, 30)), 30, 0); add(a_type, (HX, HY - 14, 30.5), V((HX, HY, SCZ)), 32, 0); add(a_pass + 0.7, (HX, HY - 9.5, 29.8), V((HX, HY, SCZ)), 30, 0)
add(a_dead, (HX + 2, HY - 15, 31), V((HX, HY, SCZ)), 30, 0); add(a_block, (HX + 5, HY - 22, 34), V((HX, HY, 30)), 30, 2); add(a_guess - 0.1, (LIT.x + 5, LIT.y - 9, 6), LIT + V((0, 0, 0.5)), 38, 0)
add(a_guess + 0.7, (LIT.x + 8, LIT.y - 12, 60), LIT, 26, 0); add(a_guess + 2.1, (LIT.x + 10, LIT.y - 14, 520), LIT, 24, 0)
add(a_you - 0.3, (LIT.x + 10, LIT.y - 14, 520), LIT, 24, 0); add(a_you + 0.5, (20, 190, 64), V((sx_, sy_, 22)), 28, 4); add(a_theirs, (30, 205, 34), V((sx_, sy_, 22)), 30, 3); add(a_rush - 0.2, (36, 208, 34), V((sx_ - 2, sy_ - 6, 24)), 30, 3)
add(a_rush + 0.8, (HX + 4, HY - 14, 36), V((HX, HY - 2, 31)), 30, 0)
chase(a_rush + 1.4, own_end - 0.3, 0.5, 6, 18, 8, 28, 5, 0.6, 0.9)
add(own_end + 0.2, (30, 214, 28), V((sx_ - 2, sy_ - 5, 24)), 32, 0); add(a_never - 0.1, (34, 200, 50), (-18, -10, 10), 26, -4); add(a_never + 0.5, (-34, -36, 15), V((-18, -14, 9)), 30, -3); add(a_never + 2.2, (-30, -40, 17), V((-18, -14, 9)), 30, 0)
add(a_1930 - 0.1, (-30, -40, 17), V((-18, -14, 9)), 30, 0); add(a_1930 + 1.4, (70, -70, 70), (0, 120, 20), 22, 0); add(a_1930 + 3.0, (90, -50, 100), (10, 150, 30), 20, 0)
add(a_cta, (46, 150, 66), (HX, HY, 28), 26, 3); add(a_cta + 2.3, (HX - 6, HY - 32, 38), V((HX, HY, SCZ)), 28, 0); add(END, (HX, HY - 14, 30.5), V((HX, HY, SCZ)), 34, 0)
ck.sort(key=lambda r: r[0]); cams = spl(ck)
camd = bpy.data.cameras.new('c'); camd.dof.use_dof = True; cam = bpy.data.objects.new('c', camd); sc.collection.objects.link(cam); sc.camera = cam
def setv(o, v): o.hide_render = not v; o.hide_viewport = not v
code = '482917'; rng_ = random.Random(2)
FR = [int(x) for x in os.environ['FRAMES'].split(',')] if os.environ.get('FRAMES') else range(F0, F1 + 1)
for f in FR:
    t = f / FPSV; rnd = random.Random(f * 977 + 3)
    k = cams(t); pos = V((float(k[0]), float(k[1]), float(k[2]))); tgt = V((float(k[3]), float(k[4]), float(k[5])))
    sh = 0.01 if t < 2 else 0.12; pos += V((math.sin(t * 7.1), math.sin(t * 5.3 + 1), math.sin(t * 6.2 + 2))) * sh
    cam.location = pos; q = (tgt - pos).to_track_quat('-Z', 'Y'); r = mathutils.Matrix.Rotation(math.radians(float(k[7])), 3, (tgt - pos).normalized()); cam.rotation_euler = (r @ q.to_matrix()).to_euler()
    camd.lens = float(k[6]); d = max(1.0, (tgt - pos).length); camd.dof.focus_distance = d; camd.dof.aperture_fstop = 5.0 if d < 60 else 11.0
    # token + lifetime ring + digits
    p, s = tokpos(t); bob = 0.25 * math.sin(t * 2.4) if (a_bank + 1 < t < a_gate) else 0
    show = s > 0.03
    for o in (orb, ring, dig, orb_l): setv(o, show)
    if show:
        orb.location = p + V((0, 0, bob)); orb.scale = (s,) * 3
        life = 1 - 0.9 * min(1, max(0, (t - a_bank) / (a_type - a_bank))) if t < a_type else 0.55
        ring.location = orb.location; ring.scale = (s * 2.1 * life + 0.01,) * 3; ring.rotation_euler = (cam.location - ring.location).to_track_quat('Z', 'Y').to_euler()
        dig.location = orb.location + V((0, 0, s * 2.9)); dig.scale = (s * 1.9,) * 3; dig.rotation_euler = (cam.location - dig.location).to_track_quat('Z', 'Y').to_euler()
        dig.data.body = (''.join(rnd.choice('0123456789') for _ in range(6)) if a_bank < t < a_bank + 2.1 else code)
        orb_l.location = orb.location; orb_l.data.energy = 5000 * s * s
        red_mix = min(1, max(0, (t - a_isnt) / max(0.5, own_end - a_isnt))) if t > a_rush else 0
        orb_col.node_tree.nodes['Emission'].inputs[0].default_value = (1.0, 0.32 - 0.3 * red_mix, 0.03 + 0.02 * red_mix, 1); halo.node_tree.nodes['Emission'].inputs[0].default_value = (1.0, 0.4 - 0.38 * red_mix, 0.05, 1)
    # envelope around the token on the gateway conveyor
    on_belt = a_gate + 1.6 < t < a_core
    setv(env, on_belt)
    if on_belt: env.location = p + V((0, 0.7, -0.2))
    # ghost token (weak network case)
    gt = (t - a_air) / 2.6
    if 0 <= gt <= 1.6:
        setv(ghost, True); u = min(gt, 1.0) ** 0.7; ghost.location = V((tx, ty - 2.2, 58.5)).lerp(V((78, 205, 44)), u) + V((0, 0, 3 * math.sin(gt * 9)))
        sg = 0.9 * max(0.03, 1 - max(0, gt - 1.0) / 0.6) * (1 if rnd.random() > 0.3 else 0.4); ghost.scale = (sg,) * 3
    else: setv(ghost, False)
    # tower pulse rings
    for i, r_ in enumerate(pulse_rings):
        u = (t - tow_end - i * 0.45) / 1.7
        if 0 <= u <= 1 and t < a_air + 0.8: setv(r_, True); sc_r = 2.0 + u * 55; r_.scale = (sc_r,) * 3; r_.location = (tx, ty, 54)
        else: setv(r_, False)
    setv(beacon_s, t >= a_1930); beacon_s.rotation_euler = (cam.location - beacon_s.location).to_track_quat('Z', 'Y').to_euler()
    # phone screen
    on = t < 2.6 or t >= a_type - 0.4
    scr_mat.node_tree.nodes['Emission'].inputs[0].default_value = (0.015, 0.07, 0.11, 1) if on else (0.01, 0.02, 0.03, 1)
    scr_mat.node_tree.nodes['Emission'].inputs[1].default_value = 1.2 if on else 0.3
    if t < 2.6: setv(scr_txt, True); scr_txt.data.body = code
    elif a_type - 0.4 <= t < a_type: setv(scr_txt, True); scr_txt.data.body = ''
    elif a_type <= t < K(8, 0, 'a') - 0.2:
        n = min(6, int((t - a_type) / 0.15) + 1); setv(scr_txt, True); scr_txt.data.body = code[:n]
    else: setv(scr_txt, False)
    for o in (tick_a, tick_b): setv(o, a_match + 0.3 <= t < a_guess - 0.3)
    setv(used_s, a_dead + 0.4 <= t < a_guess - 0.1); setv(blk_s, a_block + 0.4 <= t < a_guess - 0.1)
    # sparks: phone burst after the code is used, shield burst when the red line is blocked
    def burst(t0, origin):
        for o, v, life in sparks:
            a_ = (t - t0) / (2.2 * life)
            if 0 <= a_ < 1: setv(o, True); o.location = origin + v * (a_ * 2.5) + V((0, 0, -1.2 * a_ * a_)); s_ = 0.16 * (1 - a_); o.scale = (s_,) * 3
            else: setv(o, False)
    if a_dead - 0.4 <= t < a_dead + 2.4: burst(a_dead - 0.4, V((HX, HY - 2.0, SCZ)))
    elif a_never + 1.3 <= t < a_never + 3.8: burst(a_never + 1.3, V((-18, -18, 9)))
    else:
        for o, v, life in sparks: setv(o, False)
    # red tether to the booth phone (grows toward home, then drags the token) + the red ground line to the bank shield
    if a_you + 0.6 <= t < a_never:
        if t < a_rush: u = min(1, (t - (a_you + 0.6)) / (a_rush - a_you - 0.6)); setv(tether, True); set_tether(BOOTH_PH, BOOTH_PH.lerp(HP + V((0, -1.5, 0.5)), u), 3.0)
        elif t < own_end + 0.4: setv(tether, True); set_tether(BOOTH_PH, p, 2.0)
        else: setv(tether, False)
    else: setv(tether, False)
    if a_never + 0.1 <= t < a_never + 1.5:
        u = min(1, (t - a_never - 0.1) / 1.2); setv(gobj, True); gsp.points[0].co = (-18, -70, 0.6, 1); e = V((-18, -70, 0.6)).lerp(V((-18, -19, 0.6)), u); gsp.points[1].co = (e.x, e.y, e.z, 1)
    else: setv(gobj, False)
    setv(shield, a_never <= t < a_never + 3.6); shield.scale = (1, 1, 1) if t > a_never + 0.4 else (0.01 + (t - a_never) * 2.4,) * 3
    # the one lit cell (1 in a million) glows only while we look at it
    bl = 1 if a_guess - 0.6 <= t < a_you + 0.8 else 0
    for o in beam_objs: setv(o, bool(bl))
    beam_l.data.energy = 8000 * bl
    sc.render.filepath = os.path.join(OUTD, 'f%04d.png' % f); bpy.ops.render.render(write_still=True)
