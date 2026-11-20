"""Animated mockup shots (Cycles CPU, 12 fps source): A scam hook (push-in, orbiting file cards, dust, stamp slam + shake), B visible->thermal scan then bars, spinning fan, rising phone hotspot, dolly to the phone.
usage: python3 anim.py A|B [w=540] [h=960] [samples=14] [t0=0] [t1=..]"""
import sys; sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from common import *
SHOT = sys.argv[1]; Cfg.W = int(sys.argv[2]) if len(sys.argv) > 2 else 540; Cfg.H = int(sys.argv[3]) if len(sys.argv) > 3 else 960; Cfg.SMP = int(sys.argv[4]) if len(sys.argv) > 4 else 14
FPS = 12; OUT = f'/tmp/mscam/anim/{SHOT}'; os.makedirs(OUT, exist_ok=True)
def phone_obj(x, screen_vis, screen_th=None, body_vis=None, body_th=None):
    b = box((x, 0, 0), (.5, .06, 1.0), body_vis or pbr(hexc('15191e'), .28, .7), .035)
    bpy.ops.mesh.primitive_plane_add(size=1); s = bpy.context.object; s.scale = (.46, .93, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); s.rotation_euler = (math.radians(90), 0, 0); s.location = (x, -.034, 0)
    s.data.materials.append(screen_vis); return b, s
def shot_A():
    sc = setup('040507', .05); W_ = Cfg
    fl = bpy.data.objects.new('x', None)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 4, -.5)); f = bpy.context.object; f.scale = (40, 40, 1); f.data.materials.append(pbr(hexc('0d1116'), .12, .0)); 
    key = area((2.6, -3.2, 3.0), 3.2, 420, (1, .93, .85), (0, 0, 0)); rim = area((-3.2, 2.0, 1.6), 2.4, 260, (.35, .75, .95), (0, 0, 0)); kick = area((1.5, -1.5, -.2), 1.4, 0, (1, .2, .1), (0, 0, 0))
    card = card_png('/tmp/mscam/cardA.png', [('MOBILE EDITION', 34, '#f1f3f8'), ('FREE  .  APK  .  v1.0', 28, '#8d99a6')], '#ff4b3a', big='GTA 6')
    pb, ps = phone_obj(0, img_mat(card, 1.0)); cam = camera((0.9, -5, .6), (0, 0, .05), 50, 2.2, 3.5)
    names = (('gta6_mobile.apk', '#ffd27a'), ('FREE_UC_GIFT.exe', '#ff8f7a'), ('gta6_beta.zip', '#ffd27a'), ('PASSWORD.txt', '#ff8f7a'), ('gta6_crack.rar', '#ffd27a'), ('LOGIN_BOT.dll', '#ff8f7a'))
    cards = []
    for k, (nm, col) in enumerate(names):
        c = box((0, 0, 0), (.46, .18, .02), pbr(hexc('2a333d'), .5, 0, hexc('2a333d'), .7), .012); tx = text(nm, (0, 0, 0), .036, hexc(col[1:]), cam); cards.append((c, tx, k))
    bg = []; rng = random.Random(7)
    for side in (-1, 1):
        for i in range(16):
            y = 2.5 + i * .85; z = rng.uniform(-.2, 1.6); col = hexc(rng.choice(['ffb21f', 'ff4b3a', 'ff8f3a'])); o = box((side * rng.uniform(1.8, 3.4), y, z), (.5, .02, .22), emit(col, rng.uniform(.5, 1.6)), 0); o.rotation_euler = (0, 0, math.radians(side * -25)); bg.append(o)
    dst = dust(70, 3, (3.6, 3.0, 2.4), (0, 1.0, .4), .014)
    stamp = box((0, 0, 0), (.74, .22, .05), emit(TOMATO, .9), .015); stext = text('MALWARE', (0, 0, 0), .13, hexc('0b0f13'), cam, 'anton', 'CENTER')
    h1 = hud('GTA 6 MOBILE?', cam, -.44, .40, .062, CREAM, 3, 'anton'); h2 = hud('= VIRUS', cam, -.44, .335, .062, TOMATO, 3, 'anton'); h3 = hud('FAKE INSTALLER · OUR OWN GRAPHIC', cam, -.44, -.17, .014, MUTE, 3)
    TS = 2.3
    def anim(t):
        pose = kf([(0, (.9, -5.0, .6, 0, 0, .05)), (TS - .3, (.12, -3.1, .1, 0, 0, .05)), (5.0, (-.35, -3.0, .12, 0, 0, .05))], t)
        sh = .035 * math.exp(-max(0, t - TS) / .13) * (1 if t >= TS else 0); loc = (pose[0] + sh * math.sin(t * 90), pose[1], pose[2] + sh * math.cos(t * 77)); aim(cam, loc, pose[3:])
        cam.data.dof.focus_distance = (Vector(loc) - Vector((0, 0, 0))).length
        pb.rotation_euler = (0, 0, math.radians(8 * math.sin(t * .8))); ps.rotation_euler = (math.radians(90), 0, math.radians(8 * math.sin(t * .8))); pb.location.z = .03 * math.sin(t * 1.3); ps.location = (-.034 * math.sin(math.radians(8 * math.sin(t * .8))) * 0 + 0, -.034, pb.location.z)
        ps.location.x = .034 * math.sin(math.radians(8 * math.sin(t * .8)))
        for c, tx, k in cards:
            th = t * (.55 + .05 * k) + k * 1.05; r = 1.05 + .18 * (k % 3); x = r * math.cos(th); y = .9 * math.sin(th) * .8 + .15; z = .5 * math.sin(th * 1.3 + k) + .1
            c.location = (x, y, z); c.rotation_euler = facing(cam, 14 * math.sin(th)); tx.location = c.location + (Vector((-.19, 0, -.015)) @ facing(cam, 14 * math.sin(th)).to_matrix().transposed()) + Vector((0, -.02, 0)); tx.rotation_euler = facing(cam, 14 * math.sin(th))
        dust_step(dst, t)
        on = t >= TS; p = eo((t - TS) / .16); stamp.hide_render = stext.hide_render = not on; h2.hide_render = not (t >= TS + .15)
        pos = Vector((.02, -.5, -.14)) + Vector((0, -1.4 * (1 - p), .6 * (1 - p))); sc_ = 1 + 1.1 * (1 - p)
        stamp.location = pos; stamp.scale = (sc_, sc_, 1); stamp.rotation_euler = facing(cam, 8); stext.location = pos + Vector((0, -.04, 0)); stext.scale = (sc_, sc_, 1); stext.rotation_euler = facing(cam, 8)
        kick.data.energy = 900 * math.exp(-max(0, t - TS) / .5) * (1 if on else 0) + (160 if on else 0)
    return anim, 5.0
def shot_B():
    sc = setup(.13, 1.0, raw=True); sc.render.film_transparent = False
    TH = {}; VIS = {}; objs = []; hots = []
    def reg(o, th, vis): TH[o] = th; VIS[o] = vis; objs.append(o); o.data.materials.append(vis); return o
    fl_th = thermal_mat(22); fl_vis = pbr(hexc('0d1116'), .12)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 4, -.5)); f = bpy.context.object; f.scale = (40, 40, 1); reg(f, fl_th, fl_vis)
    ph_th = thermal_mat(31, hot=38, hot_pos=(0, .2), hot_r=.3); sc_th = thermal_mat(33, hot=39, hot_pos=(0, .2), hot_r=.3)
    p = reg(box((-1.0, 0, 0), (.5, .06, 1.0), None, .035), ph_th, pbr(hexc('15191e'), .28, .7))
    bpy.ops.mesh.primitive_plane_add(size=1); s = bpy.context.object; s.scale = (.46, .93, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); s.rotation_euler = (math.radians(90), 0, 0); s.location = (-1.0, -.034, 0)
    reg(s, sc_th, img_mat(card_png('/tmp/mscam/cardB.png', [('GTA 6', 40, '#f1f3f8'), ('loading...', 26, '#8d99a6')], '#ff4b3a', big='GTA 6'), 1.0))
    con_th = thermal_mat(46, hot=70, hot_pos=(0, 1.2), hot_r=.9)
    con = reg(box((.62, .3, .4), (.7, 1.85, 2.8), None, .08), con_th, pbr(hexc('dfe3e8'), .3, 0))
    core = reg(box((0, 0, 0), (.3, 1.9, 2.5), None, .04), thermal_mat(40), pbr(hexc('0a0c10'), .4, .2)); core.parent = con
    fan = bpy.data.objects.new('fan', None); bpy.context.scene.collection.objects.link(fan); fan.parent = con; fan.location = (-.37, -.55, 0.2); fan.rotation_euler = (0, math.radians(90), 0)
    blades = []
    for i in range(8):
        b = box((0, 0, 0), (.04, .4, .02), None, 0); reg(b, thermal_mat(58), pbr(hexc('3b424b'), .35, .9)); b.parent = fan; b.location = (0, 0, 0); b.rotation_euler = (0, 0, math.radians(i * 45)); blades.append(b)
    ring = box((0, 0, 0), (.9, .9, .03), None, .12); reg(ring, thermal_mat(50), pbr(hexc('151a20'), .3, .6)); ring.parent = fan; ring.location = (0, 0, -.02)
    key = area((2.6, -4.0, 3.0), 3.2, 520, (1, .95, .88), (0, 0, 0)); rim = area((-3.2, 2.0, 1.8), 2.4, 300, (.35, .75, .95), (0, 0, 0))
    cam = camera((.4, -7.0, 1.6), (0, 0, .35), 34, 2.4, 6.5); cam.data.dof.use_dof = False
    WH = hexc('f1f3f8'); ov = []; lut = iron_lut(24)
    for k in range(24): ov.append(hudbox(cam, .405, -.12 + .0125 * k + .006, .04, .0128, tuple(lut[k]) + (1,), 6))
    t70 = hud('70.0 C', cam, .33, .185, .018, WH, 6); t15 = hud('15.0 C', cam, .33, -.125, .018, WH, 6); rec = hud('REC 00:00', cam, -.44, .45, .02, WH, 6); sp1 = hud('Sp1  68.4 C', cam, .02, .00, .024, WH, 6); sp2 = hud('Sp2  31.0 C', cam, -.44, -.10, .024, WH, 6); note = hud('TEMPERATURES ILLUSTRATIVE', cam, -.44, -.145, .014, WH, 6)
    ov += [t70, t15, rec, sp1, sp2, note]
    labs = []; bars = []
    for i, (lab, frac) in enumerate((('10.28 TFLOPS', 1.0), ('16 GB MEMORY', .8), ('~200 W  WHOLE CONSOLE', .9))):
        v = .385 - .075 * i; l = hud(lab, cam, -.44, v + .022, .016, WH, 6); b = hudbar(cam, -.44, v, .62 * frac, .012, hexc('ffb21f'), 6); labs.append(l); bars.append((b, i)); ov += [l, b]
    spd_l = hud('GPU SPEED  100%', cam, -.44, -.045, .016, WH, 6); spd_b = hudbar(cam, -.44, -.075, .5, .012, hexc('7dffa0'), 6); thr = hud('STRESS TEST, NOT A GAME', cam, -.44, -.165, .013, WH, 6); ov += [spd_l, spd_b, thr]
    TSC = 1.4; DUR = 6.0
    def pose(t): return kf([(0, (.45, -7.0, 1.6, 0, 0, .35)), (TSC, (0, -6.4, 1.3, 0, 0, .35)), (3.5, (.55, -6.3, 1.25, 0, 0, .35)), (5.0, (-.9, -3.5, .2, -1.0, 0, .05))], t)
    def mats(mode):
        for o in objs: o.data.materials[0] = TH[o] if mode == 'th' else VIS[o]
    def passmode(m):
        if m == 'th': sc.view_settings.view_transform = 'Raw'; set_world(sc, gray=(18 - 15) / 55); sc.render.film_transparent = False; cam.data.dof.use_dof = False; mats('th')
        elif m == 'vis': sc.view_settings.view_transform = 'AgX'; set_world(sc, color=hexc('040507'), strength=.05); sc.render.film_transparent = False; cam.data.dof.use_dof = True; mats('vis')
        else: sc.view_settings.view_transform = 'Raw'; sc.render.film_transparent = True; sc.render.image_settings.color_mode = 'RGBA'
    def anim_scene(t):
        pz = pose(t); aim(cam, pz[:3], pz[3:]); cam.data.dof.focus_distance = (Vector(pz[:3]) - Vector((0, 0, 0))).length
        con.rotation_euler = (0, 0, math.radians(28 + 9 * math.sin(t * .7))); fan.rotation_euler = (0, math.radians(90), t * 14)
        hot = 31 + 15 * ss((t - 2.8) / 2.6); rad = .3 + .3 * ss((t - 2.8) / 2.6)
        for mat in (ph_th, sc_th):
            mr = [n for n in mat.node_tree.nodes if n.type == 'MAP_RANGE'][0]; mr.inputs[3].default_value = (hot + (2 if mat is sc_th else 0) - 15) / 55; mr.inputs[2].default_value = rad
        rec.data.body = f'REC 00:{int(t):02d}'; sp1.data.body = f'Sp1  {68.4 + .4 * math.sin(t * 9):.1f} C'; sp2.data.body = f'Sp2  {hot - 2 + 2:.1f} C'
        for b, i in bars: b.scale.x = max(.001, eo((t - (TSC + .2 + .25 * i)) / .9))
        sp = 1 - .55 * ss((t - 3.4) / 2.2); spd_b.scale.x = max(.001, sp * eo((t - 3.2) / .5)); spd_l.data.body = f'GPU SPEED  {int(sp * 100)}%'
        vis_ov = t >= TSC
        for o in ov: o.hide_render = True
        return vis_ov
    return (anim_scene, passmode, objs, ov, TSC, DUR)
def composite_B(t, anim_scene, passmode, objs, ov, TSC, i):
    sc = bpy.context.scene; ovl = anim_scene(t); sc.render.resolution_x, sc.render.resolution_y = Cfg.W, Cfg.H; sc.cycles.samples = Cfg.SMP
    passmode('th'); [setattr(o, 'hide_render', False) for o in objs]; sc.render.filepath = f'{OUT}/g.png'; bpy.ops.render.render(write_still=True)
    g = np.asarray(Image.open(f'{OUT}/g.png').convert('L'), float) / 255; th = Image.fromarray(sensor(g, 1080, 1920, seed=i))
    if t < TSC + .05:
        passmode('vis'); sc.render.filepath = f'{OUT}/v.png'; bpy.ops.render.render(write_still=True); vis = Image.open(f'{OUT}/v.png').convert('RGB').resize((1080, 1920), Image.BICUBIC)
        x = int(1080 * ss(t / TSC)); out = vis.copy(); out.paste(th.crop((0, 0, x, 1920)), (0, 0)); d = ImageDraw.Draw(out); d.rectangle([x - 2, 0, x + 2, 1920], fill=(255, 250, 235)); th = out
    if ovl:
        [setattr(o, 'hide_render', True) for o in objs]; passmode('ov'); anim_scene(t); [setattr(o, 'hide_render', False) for o in ov]; sc.render.filepath = f'{OUT}/o.png'; bpy.ops.render.render(write_still=True)
        o_ = Image.open(f'{OUT}/o.png').convert('RGBA').resize((1080, 1920), Image.BICUBIC); th = th.convert('RGBA'); th.alpha_composite(o_); th = th.convert('RGB')
    th.save(f'{OUT}/f{i:04d}.png')
if SHOT == 'A':
    anim, DUR = shot_A(); sc = bpy.context.scene; tot = 0
    for i in range(int(DUR * FPS)):
        t = i / FPS; anim(t); t0 = time.time(); sc.render.filepath = f'{OUT}/f{i:04d}.png'; bpy.ops.render.render(write_still=True); tot += time.time() - t0; print(f'A {i+1}/{int(DUR*FPS)} {time.time()-t0:.1f}s', flush=True)
    print('AVG', round(tot / int(DUR * FPS), 1))
else:
    anim_scene, passmode, objs, ov, TSC, DUR = shot_B(); tot = 0
    for i in range(int(DUR * FPS)):
        t = i / FPS; t0 = time.time(); composite_B(t, anim_scene, passmode, objs, ov, TSC, i); tot += time.time() - t0; print(f'B {i+1}/{int(DUR*FPS)} {time.time()-t0:.1f}s', flush=True)
    print('AVG', round(tot / int(DUR * FPS), 1))
