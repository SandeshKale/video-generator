"""OTP journey v2 look-dev: ONE readable route, five distinct landmarks, one hero token.
usage: SHOT=<name> python3 route.py <out.png> [W H samples]
Coherence rules: the route always runs 'up' the screen (+Y); every landmark has a unique silhouette AND a lit in-world sign;
the OTP is a single amber token with its digits, always the brightest thing in frame. Cyan = network, red = the fake caller."""
import sys, os, math, random
_out = sys.argv[1]; _rest = sys.argv[2:]
sys.argv = [sys.argv[0], '0', '0', _out] + _rest
_s = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'world.py')).read()
exec(_s[:_s.index("bpy.ops.mesh.primitive_plane_add(size=300")])     # scene, materials, helpers (emit, windows, prin, box, txt-less)
exec(_s[_s.index("def foggy"):_s.index("for m_ in (mat_a")])
SHOT = os.environ.get('SHOT', 'wide')
random.seed(11)
cream = prin('cream', (0.55, 0.5, 0.42, 1), 0.45); slate = prin('slate', (0.05, 0.075, 0.09, 1), 0.35, 0.4); brass = prin('brass', (0.55, 0.32, 0.08, 1), 0.3, 0.9)
steel = prin('steel', (0.18, 0.22, 0.26, 1), 0.3, 0.8); rack = prin('rack', (0.03, 0.04, 0.05, 1), 0.4, 0.6); paper = prin('paper', (0.75, 0.72, 0.65, 1), 0.6)
warm = emit('warm', (1.0, 0.55, 0.15, 1), 3.0); led = emit('led', CY, 3.0); redn = emit('rednn', RED, 6.0); signm = emit('sign', (0.95, 0.9, 0.8, 1), 3.0)
floor = prin('floor', (0.012, 0.03, 0.04, 1), 0.18, 0.5)
for m_ in (cream, slate, brass, steel, rack, paper, floor): foggy(m_)
bpy.ops.mesh.primitive_plane_add(size=900, location=(0, 120, 0)); bpy.context.object.data.materials.append(floor)
def cyl(loc, r, h, m, rot=(0, 0, 0), v=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=v, radius=r, depth=h, location=loc, rotation=rot); o = bpy.context.object; o.data.materials.append(m); return o
def tor(loc, R, r, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=48, minor_segments=12); o = bpy.context.object; o.data.materials.append(m); return o
def sign(body, loc, size, m=None, rot=(math.pi / 2, 0, 0)):
    bpy.ops.object.text_add(location=loc, rotation=rot); t = bpy.context.object; t.data.body = body; t.data.size = size; t.data.extrude = size * 0.08; t.data.align_x = 'CENTER'; t.data.align_y = 'CENTER'; t.data.materials.append(m or signm); return t
def plight(loc, col, e, r=3, kind='POINT'):
    bpy.ops.object.light_add(type=kind, location=loc); l = bpy.context.object; l.data.color = col; l.data.energy = e
    if kind == 'POINT': l.data.shadow_soft_size = r
    return l
STN = dict(bank=(-18, 0), gate=(16, 62), core=(-16, 126), tower=(20, 190), home=(-8, 256), booth=(52, 238))
# ---- 1 BANK: columns, pediment, vault door, brass trim ----
bx, by = STN['bank']
box((bx, by, 0), (30, 20, 1.2), slate); box((bx, by, 1.2), (26, 16, 14), cream); box((bx, by - 8.1, 1.2), (24, 0.6, 14.4), slate)
for i in range(7): cyl((bx - 11 + i * 3.66, by - 9.5, 8.2), 0.9, 14, cream)
box((bx, by - 9.5, 15.2), (27, 3.2, 1.2), brass)
bpy.ops.mesh.primitive_cone_add(vertices=3, radius1=14, radius2=14, depth=3.2, location=(bx, by - 9.5, 18.4), rotation=(math.pi / 2, 0, math.pi / 2)); pd = bpy.context.object; pd.scale = (1, 0.42, 1); pd.data.materials.append(brass)
cyl((bx, by - 8.3, 6.0), 4.2, 0.8, steel, rot=(math.pi / 2, 0, 0), v=48); tor((bx, by - 8.8, 6.0), 4.2, 0.35, warm, rot=(math.pi / 2, 0, 0))
cyl((bx, by - 9.0, 6.0), 1.0, 0.6, brass, rot=(math.pi / 2, 0, 0))
sign('BANK', (bx, by - 12.2, 15.2), 1.5, signm); plight((bx, by - 14, 6), (1.0, 0.6, 0.2), 14000, 3)
# ---- 2 SMS GATEWAY: sorting hall, conveyor, scanner arch, envelopes ----
gx, gy = STN['gate']
box((gx, gy, 0), (26, 18, 0.8), slate); box((gx, gy + 3, 0.8), (24, 12, 7), steel); box((gx, gy - 5.5, 0.8), (24, 0.8, 7), steel)
box((gx, gy - 2, 1.2), (30, 3.2, 1.0), rack)
tor((gx, gy - 2, 3.4), 3.6, 0.35, led, rot=(math.pi / 2, 0, 0)); tor((gx + 6, gy - 2, 3.4), 3.6, 0.2, led, rot=(math.pi / 2, 0, 0))
envs = []
for i in range(7):
    e = box((gx - 12 + i * 4, gy - 2, 2.2), (1.9, 0.12, 1.3), paper); box((gx - 12 + i * 4, gy - 2.1, 2.7), (0.5, 0.05, 0.5), redn); envs.append(e)
sign('SMS GATEWAY', (gx, gy - 6.2, 9.4), 1.5, signm); plight((gx, gy - 8, 5), CY[:3], 9000, 3)
# ---- 3 TELECOM CORE: long server hall, racks with LEDs ----
cx_, cy_ = STN['core']
box((cx_, cy_, 0), (36, 18, 0.8), slate); box((cx_, cy_ + 8, 0.8), (36, 0.8, 9), steel); box((cx_ - 17.6, cy_, 0.8), (0.8, 16, 9), steel); box((cx_ + 17.6, cy_, 0.8), (0.8, 16, 9), steel); box((cx_, cy_, 9.8), (36, 18, 0.8), steel)
rr = random.Random(3)
for row in (-4.5, 4.5):
    for i in range(10):
        box((cx_ - 15 + i * 3.3, cy_ + row, 0.8), (1.9, 1.4, 5.2), rack)
        for k in range(6):
            if rr.random() > .25: box((cx_ - 15 + i * 3.3, cy_ + row - 0.75, 1.6 + k * .75), (1.5, 0.05, 0.12), led)
sign('TELECOM CORE', (cx_, cy_ - 9.4, 12.2), 1.6, signm); plight((cx_, cy_ - 4, 5), CY[:3], 12000, 4)
# ---- 4 RADIO TOWER: lattice legs, rungs, dishes, pulse rings ----
tx, ty = STN['tower']
for sx, sy in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
    leg = cyl((tx + sx * 2.6, ty + sy * 2.6, 22), 0.28, 46, steel); leg.rotation_euler = (math.atan2(sy * 2.2, 22) * -1, math.atan2(sx * 2.2, 22), 0)
for k in range(1, 8): box((tx, ty, k * 5.2), (5.6 - k * 0.55, 5.6 - k * 0.55, 0.22), steel)
cyl((tx, ty, 49), 0.35, 12, steel); box((tx, ty - 1, 45), (3, 0.5, 1.6), steel); box((tx, ty + 1, 41), (2.4, 0.5, 1.2), steel)
cyl((tx, ty, 56), 0.9, 0.9, warm, v=16); box((tx, ty, 0), (14, 14, 0.8), slate)
sign('RADIO TOWER', (tx, ty - 8.5, 4.0), 2.0, signm); plight((tx, ty - 6, 12), CY[:3], 9000, 3)
pulse_rings = [tor((tx, ty, 54), 1.0, 0.18, amber) for _ in range(3)]
# ---- 5 HOME: block with a giant phone monument on the roof ----
hx, hy = STN['home']
box((hx, hy, 0), (20, 16, 24), mat_b); box((hx, hy, 24), (16, 12, 0.8), slate)
PHN = (hx, hy, 24.8); box((PHN[0], PHN[1], PHN[2]), (6, 4, 0.5), steel)
phone = box((hx, hy - 0.4, 25.3), (4.2, 0.45, 8.0), prin('phone', (0.01, 0.012, 0.015, 1), 0.2, 0.9)); screen = box((hx, hy - 0.68, 25.7), (3.7, 0.08, 7.2), emit('scr', (0.04, 0.09, 0.12, 1), 0.8))
sign('YOUR PHONE', (hx, hy - 8.5, 9.0), 2.2, signm); plight((hx, hy - 8, 26), (1.0, 0.6, 0.2), 6000, 2)
# ---- scam booth: dark rooftop, red neon, faceless silhouette ----
sx_, sy_ = STN['booth']
box((sx_, sy_, 0), (12, 12, 20), slate); box((sx_, sy_, 20), (14, 14, 0.8), roof)
sign('FAKE CALLER', (sx_ - 7.5, sy_ - 7.2, 25.5), 1.6, redn); plight((sx_ - 3, sy_ - 6, 22), RED[:3], 3500, 2)
cyl((sx_ - 3, sy_ - 3.5, 21.9), 0.45, 1.5, blk); bpy.ops.mesh.primitive_uv_sphere_add(radius=0.3, location=(sx_ - 3, sy_ - 3.5, 23.0)); bpy.context.object.data.materials.append(blk)
# ---- the route ----
def route(pts, m, r=0.45):
    cu = bpy.data.curves.new('r', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts): sp.points[i].co = (p[0], p[1], p[2], 1)
    sp.order_u = 4; ob = bpy.data.objects.new('r', cu); sc.collection.objects.link(ob); ob.data.materials.append(m); return ob
P = [STN[k] for k in ('bank', 'gate', 'core', 'tower', 'home')]
route([(p[0], p[1] - 12, 0.5) for p in P], cyan, 0.5)
route([(sx_ - 4, sy_ - 8, 0.5), (36, 200, 0.5), (14, 222, 0.5), (hx + 6, hy - 10, 0.5)], red, 0.4)
# ---- distant skyline (soft background only) ----
rs = random.Random(5)
for i in range(70):
    a = rs.uniform(-0.9, 0.9) + math.pi / 2; r = rs.uniform(260, 420); x = r * math.cos(a) * 1.4; y = 120 + r * math.sin(a) * 0.9
    box((x, y, 0), (rs.uniform(14, 28), rs.uniform(14, 28), rs.uniform(40, 140)), mat_a if rs.random() < .6 else mat_b)
# ---- hero token ----
orb_mat = emit('orb2', (1.0, 0.32, 0.03, 1), 1.6); bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=32, ring_count=16); orb = bpy.context.object; orb.data.materials.append(orb_mat)
halo = emit('halo', (1.0, 0.4, 0.05, 1), 0.7); bpy.ops.mesh.primitive_torus_add(major_radius=1.0, minor_radius=0.05, major_segments=48, minor_segments=8); ring = bpy.context.object; ring.data.materials.append(halo)
dig = sign('482917', (0, 0, 0), 1.0, amber)
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(50), 0, math.radians(20))); sn = bpy.context.object; sn.data.energy = 0.5; sn.data.color = (0.5, 0.75, 1)
def token(pos, s=1.3, cam_loc=None, dsize=1.3):
    orb.location = pos; orb.scale = (s, s, s); ring.location = pos; ring.scale = (s * 2.1, s * 2.1, s * 2.1)
    dig.location = (pos[0], pos[1], pos[2] + s * 2.9); dig.scale = (s * dsize * 1.5,) * 3
    pl = plight(pos, AMB[:3], 6000 * s * s, 1.5)
    if cam_loc:
        for o in (dig, ring): o.rotation_euler = (cam_loc - o.location).to_track_quat('Z', 'Y').to_euler() if o is dig else (cam_loc - o.location).to_track_quat('Z', 'Y').to_euler()
def cam(loc, tgt, lens=30, roll=0):
    cd = bpy.data.cameras.new('c'); cd.lens = lens; cd.dof.use_dof = True; cd.dof.focus_distance = (V(tgt) - V(loc)).length; cd.dof.aperture_fstop = 6.0
    co = bpy.data.objects.new('c', cd); sc.collection.objects.link(co); sc.camera = co; co.location = loc
    q = (V(tgt) - co.location).to_track_quat('-Z', 'Y'); r = mathutils.Matrix.Rotation(math.radians(roll), 3, (V(tgt) - co.location).normalized()); co.rotation_euler = (r @ q.to_matrix()).to_euler(); return co
if SHOT == 'wide':     # establishing map: the whole route, token at the bank
    c = cam(V((48, -34, 46)), (0, 110, 8), 22, 0); token(V((STN['bank'][0], STN['bank'][1] - 13, 10)), 2.6, c.location, 1.6)
elif SHOT == 'bank':   # token + digits snapping above the vault door
    c = cam(V((-34, -42, 16)), (-18, -6, 11), 32, -4); token(V((-18, -13.5, 11.5)), 1.1, c.location, 1.2)
elif SHOT == 'core':   # chase view: token flying between rack rows toward the tower
    c = cam(V((-16, 100, 9)), (-16, 140, 6), 28, 0); token(V((-16, 117, 6.5)), 0.9, c.location, 1.0)
elif SHOT == 'tower':  # token at the top, ring pulses leaving
    for i, r_ in enumerate(pulse_rings): r_.location = (tx, ty, 54); r_.scale = (3.5 + i * 4, 3.5 + i * 4, 3.5 + i * 4); r_.rotation_euler = (math.pi / 2, 0, 0)
    c = cam(V((34, 140, 40)), (20, 190, 44), 26, 4); token(V((tx, ty - 2.2, 58.5)), 1.5, c.location, 1.3)
elif SHOT == 'ask':    # fake caller's red line reaching toward the phone monument
    c = cam(V((8, 214, 30)), (26, 244, 22), 24, 5); token(V((hx + 12, hy - 12, 27)), 1.4, c.location, 1.3)
sc.render.filepath = os.path.join(_out, SHOT + '.png'); bpy.ops.render.render(write_still=True)
