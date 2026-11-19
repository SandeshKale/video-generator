
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
    o = parent_cam(hud(s, cam, u, v, frac, col, dist=dist, font=font, align=align), cam); items.append((o, t_on, t_off)); return o
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
        label(items, cam, 'THE MOON LOOKS HUGE.', -.44, -.22, .03, CREAM, 0.2, 1e9, 'anton', 14)
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
    label(items, cam, 'SAME MOON.', -.44, .40, .07, CREAM, s5, 1e9, 'anton'); label(items, cam, 'DIFFERENT BRAIN.', -.44, .33, .07, SUN, s5 + 2.0, 1e9, 'anton')
    label(items, cam, 'HIGH', -.44, .22, .024, MUTE, s5 + 1.0, 1e9); label(items, cam, 'HORIZON', -.44, -.08, .024, MUTE, s5 + 1.0, 1e9)
    label(items, cam, 'same width', .13, .16, .022, TEAL, s5 + 3.0, 1e9); label(items, cam, 'same width', .13, -.14, .022, TEAL, s5 + 3.0, 1e9); label(items, cam, 'NASA: photos show equal width', -.44, -.46, .02, MUTE, s5 + 3.0, 1e9)
    label(items, cam, 'THE MOON ILLUSION', -.44, -.40, .03, CREAM, s6, s7, 'anton'); label(items, cam, 'DEBATED: ONE MAIN EXPLANATION', -.44, -.45, .02, SUN, s6 + 1.0, s7)
    label(items, cam, 'FINGERNAIL TEST  ·  arm out', -.44, -.40, .026, CREAM, s7, 1e9); label(items, cam, 'nail ~1°  ·  moon ~0.5°  ·  both look the same size', -.44, -.45, .018, SUN, s7 + 1.5, 1e9)
    def animate(t):
        for o in calip: o.hide_render = not (t >= s5 + 3.0)
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
