"""Full film renderer (Blender Cycles, CPU). One process = one shot segment, every frame a pure function of t.
usage: python3 film.py SHOT t0 t1 fps outdir [w=720] [h=1280] [samples=12] [start_frame=0]
SHOT in GHAT | ORBIT | SKY ; t0/t1 are absolute reel seconds; sentence times come from ../site/timing.js (so a new voice re-times everything)."""
import bpy, sys, math, os, random, time, json, re
from mathutils import Vector
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D); TEX = os.path.join(R, 'tex')
SHOT = sys.argv[1]; T0 = float(sys.argv[2]); T1 = float(sys.argv[3]); FPS = float(sys.argv[4]); OUT = sys.argv[5]; os.makedirs(OUT, exist_ok=True)
W = int(sys.argv[6]) if len(sys.argv) > 6 else 720; H = int(sys.argv[7]) if len(sys.argv) > 7 else 1280; SMP = int(sys.argv[8]) if len(sys.argv) > 8 else 12; F0 = int(sys.argv[9]) if len(sys.argv) > 9 else 0
_tj = open(os.path.join(R, 'site', 'timing.js')).read(); TMJ = json.loads(_tj[_tj.index('=') + 1:].rstrip().rstrip(';'))
ST = {s['id']: s['t0'] for s in TMJ['sentences']}
def _lin(v): return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
def hexc(h, a=1): h = h.lstrip('#'); return tuple(_lin(int(h[i:i+2], 16) / 255) for i in (0, 2, 4)) + (a,)
CREAM, AMBER, TEAL, SUN, MUTE = hexc('f3e7c9'), hexc('ff9d2e'), hexc('35d0c0'), hexc('ffc84a'), hexc('9298d4')
def setup(bgcol='05081c', bgstr=1.0):
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SMP; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.max_bounces = 6; sc.cycles.glossy_bounces = 4; sc.render.resolution_x = W; sc.render.resolution_y = H; sc.render.threads = 4; sc.view_settings.view_transform = 'AgX'
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = hexc(bgcol); bg.inputs[1].default_value = bgstr; return sc
def emit(col, s=1.0):
    m = bpy.data.materials.new('e'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = col; e.inputs[1].default_value = s; o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def pbr(col, rough=.8, metal=0, emission=None, es=0):
    m = bpy.data.materials.new('p'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = col; b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emission: b.inputs['Emission Color'].default_value = emission; b.inputs['Emission Strength'].default_value = es
    return m
def tex_mat(img, rough=1.0, emis=0.0):
    m = bpy.data.materials.new('t'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']; tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(os.path.join(TEX, img)); nt.links.new(tx.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = rough
    if emis: nt.links.new(tx.outputs['Color'], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = emis
    return m
def sphere(x, y, z, r, mat, rot=(math.radians(90), 0, math.radians(-90)), seg=96):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, radius=r, location=(x, y, z)); o = bpy.context.object; bpy.ops.object.shade_smooth(); o.data.materials.append(mat); o.rotation_euler = rot; return o
def sun(rot, energy, col=(1, 1, 1)):
    l = bpy.data.lights.new('s', 'SUN'); l.energy = energy; l.color = col; o = bpy.data.objects.new('s', l); o.rotation_euler = tuple(math.radians(a) for a in rot); bpy.context.scene.collection.objects.link(o)
def camera(loc, look, lens=35, fstop=None, focus=None):
    sc = bpy.context.scene; c = bpy.data.cameras.new('c'); o = bpy.data.objects.new('c', c); sc.collection.objects.link(o); sc.camera = o; o.location = loc; c.lens = lens
    d = Vector(look) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    if fstop: c.dof.use_dof = True; c.dof.aperture_fstop = fstop; c.dof.focus_distance = focus or d.length
    return o
def hud(s, cam, u, v, frac, col, dist=12, font=None, align='LEFT'):
    """screen-anchored 3D text: u,v in [-.5,.5] of frame width/height, frac = text height as a fraction of frame height, placed `dist` in front of the camera."""
    vf = 2 * math.atan(18 / cam.data.lens); hh = dist * math.tan(vf / 2); hw = hh * (W / H)
    bpy.context.view_layer.update(); M = cam.matrix_world; loc = M @ Vector((u * 2 * hw, v * 2 * hh, -dist)); o = text(s, tuple(loc), frac * 2 * hh, col, cam, font); o.data.align_x = align; return o
def text(s, loc, size, col, cam, font=None):
    font = font or ('anton' if size >= .5 else 'plexmono')
    bpy.ops.object.text_add(location=loc); o = bpy.context.object; o.data.body = s; o.data.size = size; o.data.font = bpy.data.fonts.load(os.path.join(D, 'fonts', font + '.ttf')); o.data.extrude = size * .06; o.data.bevel_depth = 0
    o.data.materials.append(emit(col)); o.rotation_euler = cam.rotation_euler.copy(); return o
def tube(points, col, r=.04):
    cu = bpy.data.curves.new('c', 'CURVE'); cu.dimensions = '3D'; sp = cu.splines.new('POLY'); sp.points.add(len(points) - 1)
    for p, q in zip(sp.points, points): p.co = (q[0], q[1], q[2], 1)
    sp.use_cyclic_u = True; cu.bevel_depth = r; cu.bevel_resolution = 3; o = bpy.data.objects.new('o', cu); bpy.context.scene.collection.objects.link(o); o.data.materials.append(emit(col, 2.5)); return o
def stars(n=500, rad=180):
    random.seed(2)
    for i in range(n):
        v = Vector((random.gauss(0, 1), random.gauss(0, 1), random.gauss(0, 1))).normalized() * rad; bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(.12, .35), location=v); bpy.context.object.data.materials.append(emit(hexc('cfd6ff'), 3))
def world_glow(top='03051a', horizon='1b2a66', power=1.0):
    w = bpy.context.scene.world; nt = w.node_tree; nt.nodes.clear(); tc = nt.nodes.new('ShaderNodeTexCoord'); sp = nt.nodes.new('ShaderNodeSeparateXYZ'); cr = nt.nodes.new('ShaderNodeValToRGB'); bg = nt.nodes.new('ShaderNodeBackground'); out = nt.nodes.new('ShaderNodeOutputWorld')
    nt.links.new(tc.outputs['Generated'], sp.inputs[0]); mp = nt.nodes.new('ShaderNodeMapRange'); mp.inputs[1].default_value = .5; mp.inputs[2].default_value = .75; mp.inputs[3].default_value = 0; mp.inputs[4].default_value = 1
    nt.links.new(sp.outputs['Z'], mp.inputs[0]); nt.links.new(mp.outputs[0], cr.inputs[0]); cr.color_ramp.elements[0].position = 0; cr.color_ramp.elements[0].color = hexc(horizon); cr.color_ramp.elements[1].position = 1; cr.color_ramp.elements[1].color = hexc(top)
    bg.inputs[1].default_value = power; nt.links.new(cr.outputs[0], bg.inputs[0]); nt.links.new(bg.outputs[0], out.inputs[0])

def parent_cam(o, cam):
    o.parent = cam; o.matrix_parent_inverse = cam.matrix_world.inverted(); return o
def ss(x): x = max(0.0, min(1.0, x)); return x * x * (3 - 2 * x)
def kf(keys, t):
    """keys [(t, (v...)), ...] sorted; smoothstep between neighbours; locked outside."""
    if t <= keys[0][0]: return keys[0][1]
    for (ta, a), (tb, b) in zip(keys, keys[1:]):
        if t <= tb:
            u = ss((t - ta) / (tb - ta)); return tuple(x + (y - x) * u for x, y in zip(a, b))
    return keys[-1][1]
def aim(cam, loc, look):
    cam.location = loc; d = Vector(look) - Vector(loc); cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
def label(items, cam, s, u, v, frac, col, t_on, t_off=1e9, font='plexmono', dist=12, align='LEFT'):
    o = parent_cam(hud(s, cam, u, v, frac, col, dist=dist, font=font, align=align), cam); o.visible_glossy = False; o.visible_diffuse = False; o.visible_shadow = False; o.visible_transmission = False; items.append((o, t_on, t_off)); return o
def set_labels(items, t):
    for o, a, b in items: o.hide_render = not (a <= t < b); o.hide_viewport = o.hide_render

def shot_ghat(final=False):
    sc = setup('050a24', .8); world_glow('02040f', '1b2560', 1.0); sun((62, 0, 25), 1.6, (.65, .75, 1.0)); stone = pbr(hexc('6a5040'), .85)
    for i in range(10):
        bpy.ops.mesh.primitive_cube_add(location=(0, 1 + i * 1.2, .3 + i * .36)); o = bpy.context.object; o.scale = (11, .6, .3 + i * .18); o.data.materials.append(stone)
        bm = o.modifiers.new('b', 'BEVEL'); bm.width = .05; bm.segments = 2
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -30, -.02)); w = bpy.context.object; w.scale = (200, 90, 1); w.data.materials.append(pbr(hexc('060b22'), .04))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=.1); bowl = bpy.context.object; bowl.scale = (1, 1, .45); bowl.location = (0, 0, -50); bowl.data.materials.append(pbr(hexc('c0662a'), .7))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=.04); fl = bpy.context.object; fl.scale = (.8, .8, 1.9); fl.location = (0, 0, -50 + .1); fl.data.materials.append(pbr(AMBER, .5, emission=AMBER, es=60))
    col = bpy.data.collections.new('diya'); sc.collection.children.link(col); col.instance_offset = (0, 0, -50)
    for o in (bowl, fl):
        for c in o.users_collection: c.objects.unlink(o)
        col.objects.link(o)
    random.seed(3); insts = []
    for i in range(420):
        r = i // 42; inst = bpy.data.objects.new(f'd{i}', None); inst.instance_type = 'COLLECTION'; inst.instance_collection = col; inst.location = (random.uniform(-5, 5), 1 + r * 1.2 + random.uniform(-.4, .4) - .25, .62 + r * .36); inst.scale = (2.0,) * 3; sc.collection.objects.link(inst)
    floaters = []
    for i in range(7):
        inst = bpy.data.objects.new(f'f{i}', None); inst.instance_type = 'COLLECTION'; inst.instance_collection = col; x0 = random.uniform(-3.5, 3.5); y0 = random.uniform(-9, -3); inst.location = (x0, y0, .08); inst.scale = (3.2,) * 3; sc.collection.objects.link(inst); floaters.append((inst, x0, y0, random.uniform(0, 6.28)))
    moon = sphere(2.5, 70, 26, 8.5, tex_mat('moon_color_2k.jpg', 1.0, emis=1.0))
    cam = camera((0, -13, 2.2), (0, 6, 4.0), lens=30, fstop=1.6, focus=16); items = []
    if not final:
        label(items, cam, 'DEV DEEPAWALI', -.44, .40, .06, CREAM, 0, 1e9, 'anton', 14); label(items, cam, 'KARTIK PURNIMA  ·  24 NOV', -.44, .355, .02, SUN, 0, 1e9, 'plexmono', 14)
        label(items, cam, 'THE MOON LOOKS HUGE.', -.44, .30, .03, CREAM, 0.2, 1e9, 'anton', 14)
    else:
        a = ST['s8']
        label(items, cam, 'FAITH: YOURS.', -.44, .40, .06, CREAM, a, 1e9, 'anton', 14); label(items, cam, 'THE SKY: MEASURABLE.', -.44, .34, .06, SUN, a + 2.2, 1e9, 'anton', 14)
    def animate(t):
        tt = t - T0; dur = max(.01, T1 - T0)
        p = kf([(0, (0, -13, 2.2, 0, 6, 4.0)), (dur, (0, -10.5, 2.5, 0, 6, 4.6))], tt) if not final else kf([(0, (0, -10.5, 2.5, 0, 6, 4.6)), (dur, (0, -13, 2.2, 0, 6, 4.0))], tt)
        aim(cam, p[:3], p[3:]); moon.location.z = 26 + 1.2 * ss(tt / dur) if not final else 27.2 - 1.2 * ss(tt / dur)
        for inst, x0, y0, ph in floaters: inst.location = (x0 + .25 * math.sin(t * .6 + ph), y0 + .12 * math.cos(t * .5 + ph), .08)
        set_labels(items, t)
    return animate

def shot_orbit():
    sc = setup('03051a', .5); stars(); sun((50, 0, 40), 4.0, (1, .96, .9))
    sphere(0, 0, 0, 1.15, tex_mat('earth_2k.jpg', .6), rot=(math.radians(75), 0, math.radians(200)))
    a, e = 6.0, 0.5; pts = []
    for i in range(160):
        th = i * math.pi * 2 / 160; r = a * (1 - e * e) / (1 + e * math.cos(th)); pts.append((r * math.sin(th), r * math.cos(th), 0))
    tube(pts, hexc('5b6cf0'), .04); mm = tex_mat('moon_color_2k.jpg', 1.0)
    moon = sphere(0, 3.0, 0, .5, mm); ghost = sphere(0, -9.0, 0, .34, mm)
    ring = tube([(.95 * math.sin(th), 3 + .95 * math.cos(th), 0) for th in [i * math.pi * 2 / 48 for i in range(48)]], SUN, .05)
    cam = camera((5, -11, 20), (0, -3.2, 0), lens=48, fstop=2.6, focus=23); items = []
    s2, s3, s4, s5 = ST['s2'], ST['s3'], ST['s4'], ST['s5']
    label(items, cam, 'THE MOON ORBITS IN AN EGG SHAPE', -.44, .42, .022, CREAM, s2 + .3, s3, 'plexmono', 20)
    label(items, cam, 'SUPERMOON', -.44, .39, .075, CREAM, s3, 1e9, 'anton', 20); label(items, cam, 'NASA: UP TO 14% BIGGER', -.44, .345, .022, SUN, s3 + .5, 1e9, 'plexmono', 20)
    label(items, cam, 'PERIGEE  ~361,000 km', -.44, .29, .026, SUN, s2 + 3.0, 1e9, 'plexmono', 20); label(items, cam, 'APOGEE', .12, -.37, .025, MUTE, s2 + 3.0, 1e9, 'plexmono', 20)
    label(items, cam, 'orbit shape exaggerated', -.44, -.47, .018, MUTE, s2 + .3, 1e9, 'plexmono', 20)
    label(items, cam, 'DEC + JAN: NEAR PERIGEE TOO', -.44, -.40, .024, TEAL, s4, 1e9, 'plexmono', 20)
    def orbit_pos(f):    # f 0..1 : apogee -> perigee along the true ellipse (angle from apogee)
        th = math.pi * (1 - f); r = a * (1 - e * e) / (1 + e * math.cos(th)); return (r * math.sin(th), r * math.cos(th), 0)
    def animate(t):
        f = ss((t - (s2 + .5)) / (s3 - s2 - 1.0)); x, y, z = orbit_pos(f)
        moon.location = (x, y, 0); k = (.34 + (.5 - .34) * f) / .5; moon.scale = (k, k, k); ghost.hide_render = f > .98
        ring.hide_render = not (f > .95)
        ph = kf([(0, (5, -11, 20, 0, -3.2, 0)), (s3 - T0 + 1.5, (5, -11, 20, 0, -3.2, 0)), (s4 - T0, (3.5, -3.5, 12, 0, 3.0, 0))], t - T0)
        aim(cam, ph[:3], ph[3:]); set_labels(items, t)
    return animate

def shot_sky():
    sc = setup('050a24', 1.0); world_glow('02040f', '23327a', 1.2); camloc = Vector((0, 0, 2.0)); pitch = 20; sun((70, 0, 20), 0.9, (.6, .7, 1.0))
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 150, 0)); g = bpy.context.object; g.scale = (800, 800, 1); g.data.materials.append(pbr(hexc('0e1636'), .9))
    d = 300; r = d * math.tan(math.radians(4.3)); mm = tex_mat('moon_color_2k.jpg', 1.0, emis=1.5)
    def at(elev, dist=d): return camloc + Vector((0, math.cos(math.radians(elev)), math.sin(math.radians(elev)))) * dist
    calip = []
    for elev in (31, 7.0):
        c = at(elev); sphere(*c, r, mm)
        b = bpy.ops.mesh.primitive_cube_add(location=c + Vector((0, 0, -r * 1.35))); b = bpy.context.object; b.scale = (r, 1.0, .35); b.data.materials.append(emit(TEAL, 3)); calip.append(b)
        for sx in (-1, 1): bpy.ops.mesh.primitive_cube_add(location=c + Vector((sx * r, 0, -r * 1.35))); k = bpy.context.object; k.scale = (.5, 1.0, 4.5); k.data.materials.append(emit(TEAL, 3)); calip.append(k)
    random.seed(5); tm = pbr(hexc('01030a'), .9)
    for i in range(110):
        y = random.uniform(24, 190); x = random.uniform(-.7, .7) * y * 1.0; h = y * math.tan(math.radians(random.uniform(2.0, 9.0)))
        bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=h * .2, depth=h, location=(x, y, h / 2)); bpy.context.object.data.materials.append(tm)
    # Ponzo rails: two converging lines on the ground (railway-track illusion), only shown on the explanation sentence
    rails = []
    for sx in (-1, 1):
        rails.append(tube([(sx * 6, 8, .02), (sx * .6, 120, .02)], hexc('f3e7c9'), .05)) if False else None
    for sx in (-1, 1):
        cu = bpy.data.curves.new('r', 'CURVE'); cu.dimensions = '3D'; sp = cu.splines.new('POLY'); sp.points.add(1); sp.points[0].co = (sx * 7, 10, .03, 1); sp.points[1].co = (sx * .5, 190, .03, 1); cu.bevel_depth = .09
        o = bpy.data.objects.new('r', cu); bpy.context.scene.collection.objects.link(o); o.data.materials.append(emit(hexc('f3e7c9'), 2)); rails.append(o)
    # fingernail: ~1 deg wide at arm's length, pale capsule just in front of the low moon
    nd = 120; nw = nd * math.tan(math.radians(1.0)); bpy.ops.mesh.primitive_cube_add(location=at(7.0, nd)); nail = bpy.context.object; nail.scale = (nw / 2, .4, nw / 1.6); nail.data.materials.append(emit(hexc('f2c7b8'), 1.6))
    bm = nail.modifiers.new('b', 'BEVEL'); bm.width = nw * .18; bm.segments = 4
    cam = camera((0, 0, 2.0), (0, math.cos(math.radians(pitch)) * 10, 2.0 + math.sin(math.radians(pitch)) * 10), lens=26); items = []
    s5, s6, s7, s8 = ST['s5'], ST['s6'], ST['s7'], ST['s8']
    label(items, cam, 'SAME MOON.', -.44, .40, .07, CREAM, s5, s6, 'anton', 4); label(items, cam, 'DIFFERENT BRAIN.', -.44, .33, .07, SUN, s5 + 2.0, s6, 'anton', 4)
    label(items, cam, 'HIGH', -.44, .22, .024, MUTE, s5 + 1.0, s6, 'plexmono', 4); label(items, cam, 'HORIZON', -.44, -.08, .024, MUTE, s5 + 1.0, s6, 'plexmono', 4)
    label(items, cam, 'same width', .13, .16, .022, TEAL, s5 + 3.0, s6, 'plexmono', 4); label(items, cam, 'same width', .13, -.14, .022, TEAL, s5 + 3.0, s6, 'plexmono', 4); label(items, cam, 'NASA: photos show equal width', -.44, -.46, .02, MUTE, s5 + 3.0, s6, 'plexmono', 4)
    label(items, cam, 'THE MOON ILLUSION', -.44, -.40, .03, CREAM, s6, s7, 'anton', 4); label(items, cam, 'DEBATED: ONE MAIN EXPLANATION', -.44, -.45, .02, SUN, s6 + 1.0, s7, 'plexmono', 4)
    label(items, cam, 'FINGERNAIL TEST  ·  arm out', -.44, -.40, .026, CREAM, s7, 1e9, 'plexmono', 4); label(items, cam, 'nail ~1°  ·  moon ~0.5°', -.44, -.45, .018, SUN, s7 + 1.5, 1e9, 'plexmono', 4)
    def animate(t):
        for o in calip: o.hide_render = not (s5 + 3.0 <= t < s6)
        for o in rails: o.hide_render = not (s6 <= t < s7)
        nail.hide_render = not (t >= s7)
        pit = kf([(0, (20,)), (s6 - T0, (20,)), (s6 - T0 + 1.5, (14,)), (s7 - T0, (14,)), (s7 - T0 + 1.5, (9,))], t - T0)[0]
        aim(cam, (0, 0, 2.0), (0, math.cos(math.radians(pit)) * 10, 2.0 + math.sin(math.radians(pit)) * 10)); set_labels(items, t)
    return animate

anim = {'GHAT': lambda: shot_ghat(False), 'GHAT2': lambda: shot_ghat(True), 'ORBIT': shot_orbit, 'SKY': shot_sky}[SHOT]()
n = int(round((T1 - T0) * FPS)); sc = bpy.context.scene; tot = 0.0
for i in range(F0, n):
    t = T0 + i / FPS; anim(t); t0 = time.time(); sc.render.filepath = f'{OUT}/f{i:05d}.png'; bpy.ops.render.render(write_still=True); dt = time.time() - t0; tot += dt
    print(f'{SHOT} {i+1}/{n} {dt:.1f}s', flush=True)
