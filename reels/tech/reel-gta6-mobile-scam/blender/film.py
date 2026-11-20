"""Full film (Cycles CPU, one continuous world): scam hook -> console vs phone -> scan into thermal (bars, fan, hotspot, throttle) -> scan back to the official store -> pull-back.
Every frame is a pure function of t; cues come from ../site/timing.js (voice words). One process renders frames [f0,f1) at 12 fps into outdir as 1080x1920 PNGs.
usage: python3 film.py outdir f0 f1 [w=720] [h=1280] [samples=12]"""
import sys; sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from common import *
OUT = sys.argv[1]; F0 = int(sys.argv[2]); F1 = int(sys.argv[3]); Cfg.W = int(sys.argv[4]) if len(sys.argv) > 4 else 720; Cfg.H = int(sys.argv[5]) if len(sys.argv) > 5 else 1280; Cfg.SMP = int(sys.argv[6]) if len(sys.argv) > 6 else 12
os.makedirs(OUT, exist_ok=True); FPS = 12
_tj = open(os.path.join(R, 'site', 'timing.js')).read(); TMJ = json.loads(_tj[_tj.index('=') + 1:].rstrip().rstrip(';')); SEN = {s['id']: s for s in TMJ['sentences']}; DUR = TMJ['end']
def ST(i): return SEN[i]['t0']
def SE(i): return SEN[i]['t1']
def WS(sid, subs, fb):
    s = SEN[sid]
    for k in range(s['k0'], s['k1'] + 1):
        w = TMJ['words'][k][0]
        if any(x in w for x in subs): return TMJ['words'][k][1]
    return s['t0'] + fb
T_STAMP = WS('s1', ['वायरस', 'वाइरस', 'virus', 'Virus', 'वायरस।'], 3.0)
T_SC1 = ST('s4') - .3; T_SC1E = T_SC1 + 1.4; T_SC2 = ST('s8') - .2; T_SC2E = T_SC2 + 1.3
sc = setup(.13, 1.0, raw=True); TH = {}; VIS = {}; objs = []; visonly = []
def reg(o, th, vis):
    TH[o] = th; VIS[o] = vis; objs.append(o); o.data.materials.append(vis); return o
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 4, -.5)); fl = bpy.context.object; fl.scale = (40, 40, 1); reg(fl, thermal_mat(22), pbr(hexc('0d1116'), .12))
cardA = card_png('/tmp/mscam/f_cardA.png', [('MOBILE EDITION', 34, '#f1f3f8'), ('FREE  .  APK  .  v1.0', 28, '#8d99a6')], '#ff4b3a', big='GTA 6')
cardO = card_png('/tmp/mscam/f_cardO.png', [('GTA San Andreas', 34, '#f1f3f8'), ('Rockstar Games', 28, '#8d99a6'), ('Official store', 26, '#7dffa0')], '#7dffa0', big='STORE')
matA = img_mat(cardA, 1.0); matO = img_mat(cardO, 1.0)
ph_th = thermal_mat(31, hot=38, hot_pos=(0, .2), hot_r=.3); sc_th = thermal_mat(33, hot=39, hot_pos=(0, .2), hot_r=.3)
pb = reg(box((0, 0, 0), (.5, .06, 1.0), None, .035), ph_th, pbr(hexc('15191e'), .28, .7))
bpy.ops.mesh.primitive_plane_add(size=1); ps = bpy.context.object; ps.scale = (.46, .93, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); ps.rotation_euler = (math.radians(90), 0, 0); reg(ps, sc_th, matA); ps.parent = pb; ps.location = (0, -.034, 0); ps.rotation_euler = (math.radians(90), 0, 0)
con = reg(box((3.5, .3, .4), (.7, 1.85, 2.8), None, .08), thermal_mat(46, hot=70, hot_pos=(0, 1.2), hot_r=.9), pbr(hexc('dfe3e8'), .3, 0))
core = reg(box((0, 0, 0), (.3, 1.9, 2.5), None, .04), thermal_mat(40), pbr(hexc('0a0c10'), .4, .2)); core.parent = con
fan = bpy.data.objects.new('fan', None); bpy.context.scene.collection.objects.link(fan); fan.parent = con; fan.location = (-.37, -.55, 0.2); fan.rotation_euler = (0, math.radians(90), 0)
for i in range(8):
    b = reg(box((0, 0, 0), (.04, .4, .02), None, 0), thermal_mat(58), pbr(hexc('3b424b'), .35, .9)); b.parent = fan; b.rotation_euler = (0, 0, math.radians(i * 45))
rg = reg(box((0, 0, 0), (.9, .9, .03), None, .12), thermal_mat(50), pbr(hexc('151a20'), .3, .6)); rg.parent = fan; rg.location = (0, 0, -.02)
key = area((2.6, -3.6, 3.0), 3.2, 460, (1, .93, .85), (0, 0, 0)); rim = area((-3.2, 2.0, 1.7), 2.4, 280, (.35, .75, .95), (0, 0, 0)); kick = area((1.5, -1.5, -.2), 1.4, 0, (1, .2, .1), (0, 0, 0)); gkick = area((-1.0, -1.6, .3), 1.4, 0, (.3, 1, .5), (0, 0, 0))
cam = camera((.9, -5, .6), (0, 0, .05), 50, 2.2, 3.5)
names = (('gta6_mobile.apk', '#ffd27a'), ('FREE_UC_GIFT.exe', '#ff8f7a'), ('gta6_beta.zip', '#ffd27a'), ('PASSWORD.txt', '#ff8f7a'), ('gta6_crack.rar', '#ffd27a'), ('LOGIN_BOT.dll', '#ff8f7a')); cards = []
for k, (nm, col) in enumerate(names):
    c = box((0, 0, 0), (.46, .18, .02), pbr(hexc('2a333d'), .5, 0, hexc('2a333d'), .7), .012); tx = text(nm, (0, 0, 0), .036, hexc(col[1:]), cam); cards.append((c, tx, k)); visonly += [c, tx]
rng = random.Random(7); bg = []
for side in (-1, 1):
    for i in range(16):
        y = 2.5 + i * .85; z = rng.uniform(-.2, 1.6); col = hexc(rng.choice(['ffb21f', 'ff4b3a', 'ff8f3a'])); o = box((side * rng.uniform(1.8, 3.4), y, z), (.5, .02, .22), emit(col, rng.uniform(.5, 1.6)), 0); o.rotation_euler = (0, 0, math.radians(side * -25)); bg.append(o); visonly.append(o)
dst = dust(70, 3, (3.6, 3.0, 2.4), (0, 1.0, .4), .014); visonly += [d[0] for d in dst]
stamp = box((0, 0, 0), (.74, .22, .05), emit(TOMATO, .9), .015); stext = text('MALWARE', (0, 0, 0), .13, hexc('0b0f13'), cam, 'anton', 'CENTER'); visonly += [stamp, stext]
# labels: (obj, t_on, t_off, kind) kind 'vis' (main pass) or 'ov' (overlay pass, thermal)
labs = []
def L(kind, s, u, v, frac, col, t_on, t_off=1e9, font='plexmono', dist=3, align='LEFT'):
    o = hud(s, cam, u, v, frac, col, dist if kind == 'vis' else 6, font, align); labs.append((o, t_on, t_off, kind)); return o
WH = hexc('f1f3f8')
L('vis', 'GTA 6 MOBILE?', -.44, .40, .062, CREAM, 0, ST('s3') - .4, 'anton'); L('vis', '= VIRUS', -.44, .335, .062, TOMATO, T_STAMP + .15, ST('s3') - .4, 'anton'); L('vis', 'FAKE INSTALLER · OUR OWN GRAPHIC', -.44, -.17, .014, MUTE, 0, ST('s3') - .4)
L('vis', 'PASSWORD STEALER', -.44, .27, .03, TOMATO, ST('s2') + .3, ST('s3') - .4, 'plexmono')
L('vis', 'REPORTED BY SECURITY FIRMS', -.44, .23, .016, MUTE, ST('s2') + .3, ST('s3') - .4)
L('vis', 'PS5 + XBOX SERIES', -.44, .30, .04, GREEN, WS('s3', ['PS5', 'प्ले', 'Play'], 1.5), T_SC1, 'anton'); L('vis', 'MOBILE: NOT ANNOUNCED', -.44, -.12, .02, TOMATO, WS('s3', ['मोबाइल', 'मोबा', 'Mobile', 'mobile'], 3.5), T_SC1, 'plexmono'); L('vis', 'PC: NOT YET', -.44, -.155, .02, TOMATO, WS('s3', ['पी', 'PC'], 5.5), T_SC1)
L('vis', 'OFFICIAL STORE ONLY', -.44, .40, .06, GREEN, T_SC2E, ST('s9') - .2, 'anton'); L('vis', 'San Andreas on mobile since 2013', -.44, .35, .02, MUTE, T_SC2E + .3, ST('s9') - .2); L('vis', 'name only · no Rockstar art', -.44, .325, .014, MUTE, T_SC2E + .3, ST('s9') - .2)
L('vis', 'SEND THIS TO ONE FRIEND', -.44, .40, .045, CREAM, ST('s9'), 1e9, 'anton')
# thermal instruments
lut = iron_lut(24); scale_bars = [hudbox(cam, .405, -.12 + .0125 * k + .006, .04, .0128, tuple(lut[k]) + (1,), 6) for k in range(24)]
inst = [(o, T_SC1E, T_SC2, 'ov') for o in scale_bars]
for s_, u, v, fr, col in (('70.0 C', .33, .185, .018, WH), ('15.0 C', .33, -.125, .018, WH), ('TEMPERATURES ILLUSTRATIVE', -.44, -.145, .014, WH)): inst.append((hud(s_, cam, u, v, fr, col, 6), T_SC1E, T_SC2, 'ov'))
rec = hud('REC 00:00', cam, -.44, .45, .02, WH, 6); sp1 = hud('Sp1  68.4 C', cam, .02, .0, .024, WH, 6); sp2 = hud('Sp2  31.0 C', cam, -.44, -.10, .024, WH, 6); inst += [(rec, T_SC1E, T_SC2, 'ov'), (sp1, WS('s5', ['वाट', 'वॉट', 'watt', 'Watt'], 1.0) - .5, T_SC2, 'ov'), (sp2, ST('s6'), T_SC2, 'ov')]
bars = []
for i, (lab, frac, t_on) in enumerate((('10.28 TFLOPS', 1.0, WS('s4', ['10', 'पॉइंट', 'point'], 2.0)), ('16 GB MEMORY', .8, WS('s4', ['सोलह', 'solah', '16'], 6.5)), ('~200 W  WHOLE CONSOLE', .9, WS('s5', ['दो', 'सौ', '200'], 1.0)))):
    v = .385 - .075 * i; l = hud(lab, cam, -.44, v + .022, .016, WH, 6); b = hudbar(cam, -.44, v, .62 * frac, .012, hexc('ffb21f'), 6); inst += [(l, t_on, T_SC2, 'ov'), (b, t_on, T_SC2, 'ov')]; bars.append((b, t_on))
T6 = ST('s6'); spd_l = hud('GPU SPEED  100%', cam, -.44, -.045, .016, WH, 6); spd_b = hudbar(cam, -.44, -.075, .5, .012, hexc('7dffa0'), 6); thr = hud('STRESS TEST, NOT A GAME', cam, -.44, -.165, .013, WH, 6)
inst += [(spd_l, T6 + .5, T_SC2, 'ov'), (spd_b, T6 + .5, T_SC2, 'ov'), (thr, ST('s7'), T_SC2, 'ov')]; labs += inst
# green shield (verdict) for s8
bpy.ops.mesh.primitive_torus_add(location=(.3, -.35, .56), major_radius=.12, minor_radius=.022); ring = bpy.context.object; ring.rotation_euler = (math.radians(90), 0, 0); ring.data.materials.append(emit(GREEN, 2.0))
ck1 = box((.265, -.35, .535), (.025, .025, .07), emit(GREEN, 2.0), 0); ck1.rotation_euler = (0, math.radians(-40), 0); ck2 = box((.33, -.35, .58), (.025, .025, .15), emit(GREEN, 2.0), 0); ck2.rotation_euler = (0, math.radians(40), 0); shield = [ring, ck1, ck2]; visonly += shield
def POSE(t):
    s1, s2, s3, s4, s5, s6, s7, s8, s9 = (ST(f's{i}') for i in range(1, 10))
    keys = [(0, (.9, -5.0, .6, 0, 0, .05)), (T_STAMP - .3, (.12, -3.1, .1, 0, 0, .05)), (s3 - .5, (-.35, -3.0, .12, 0, 0, .05)), (s3 + .9, (0, -6.3, .9, -.15, 0, .3)), (T_SC1, (.05, -6.4, 1.2, 0, 0, .35)), (s5, (.55, -6.3, 1.25, 0, 0, .35)), (s6 - .1, (.55, -6.3, 1.25, 0, 0, .35)), (s6 + 2.2, (-.9, -3.5, .2, -1.0, 0, .05)), (s7 + 2.5, (-.9, -3.5, .2, -1.0, 0, .05)), (T_SC2E + .8, (0, -3.0, .12, 0, 0, .05)), (s9 + 1.0, (0, -3.0, .12, 0, 0, .05)), (s9 + 5.0, (.25, -4.8, .45, 0, 0, .1))]
    return kf(keys, t)
def passmode(m):
    sc.render.resolution_x, sc.render.resolution_y = Cfg.W, Cfg.H; sc.cycles.samples = Cfg.SMP
    if m == 'th':
        sc.view_settings.view_transform = 'Raw'; set_world(sc, gray=(18 - 15) / 55); sc.render.film_transparent = False; cam.data.dof.use_dof = False
        for o in objs: o.data.materials[0] = TH[o]
    elif m == 'vis':
        sc.view_settings.view_transform = 'AgX'; set_world(sc, color=hexc('040507'), strength=.05); sc.render.film_transparent = False; cam.data.dof.use_dof = True
        for o in objs: o.data.materials[0] = VIS[o]
    else: sc.view_settings.view_transform = 'Raw'; sc.render.film_transparent = True; sc.render.image_settings.color_mode = 'RGBA'; cam.data.dof.use_dof = False
def state(t):
    s3 = ST('s3'); pz = POSE(t); loc = (pz[0], pz[1], pz[2])
    sh = .035 * math.exp(-max(0, t - T_STAMP) / .13) * (1 if T_STAMP <= t < T_STAMP + 1 else 0); aim(cam, (loc[0] + sh * math.sin(t * 90), loc[1], loc[2] + sh * math.cos(t * 77)), pz[3:]); cam.data.dof.focus_distance = (Vector(loc) - Vector((pb.location.x, 0, 0))).length
    # phone / console choreography
    px = -1.0 * ss((t - s3) / .9) + 1.0 * ss((t - T_SC2) / 1.0); cx = 3.5 - 2.88 * ss((t - s3) / .9) + 2.88 * ss((t - T_SC2) / 1.0)
    yaw = 8 * math.sin(t * .8) * (1 - ss((t - s3) / .8)) + 8 * math.sin(t * .8) * ss((t - T_SC2E) / .8)
    pb.rotation_euler = (0, 0, math.radians(yaw)); pb.location = (px, 0, .03 * math.sin(t * 1.3) * (1 if (t < s3 or t > T_SC2E) else 0)); ps.rotation_euler = (math.radians(90), 0, 0)
    con.location = (cx, .3, .4); con.rotation_euler = (0, 0, math.radians(28 + 9 * math.sin(t * .7))); fan.rotation_euler = (0, math.radians(90), t * 14)
    hot = 31 + 15 * ss((t - T6) / 7.0); rad = .3 + .3 * ss((t - T6) / 7.0)
    for mat in (ph_th, sc_th):
        mr = [n for n in mat.node_tree.nodes if n.type == 'MAP_RANGE'][0]; mr.inputs[3].default_value = (hot + (2 if mat is sc_th else 0) - 15) / 55; mr.inputs[2].default_value = rad
    ps.data.materials[0] = matO if t >= T_SC2 else matA; VIS[ps] = matO if t >= T_SC2 else matA
    for c, tx, k in cards:
        out = ss((t - (s3 - .6)) / .6); th = t * (.55 + .05 * k) + k * 1.05; r = (1.05 + .18 * (k % 3)) * (1 + 1.5 * out); x = r * math.cos(th); y = .72 * math.sin(th) + .15; z = .5 * math.sin(th * 1.3 + k) + .1
        c.location = (x, y, z); c.rotation_euler = facing(cam, 14 * math.sin(th)); tx.location = c.location + (Vector((-.19, 0, -.015)) @ facing(cam, 14 * math.sin(th)).to_matrix().transposed()) + Vector((0, -.02, 0)); tx.rotation_euler = facing(cam, 14 * math.sin(th))
        c.hide_render = tx.hide_render = (t >= s3 - .1)
    dust_step(dst, t)
    on = T_STAMP <= t < s3 - .3; p = eo((t - T_STAMP) / .16); stamp.hide_render = stext.hide_render = not on; pos = Vector((.02 + px, -.5, -.14)) + Vector((0, -1.4 * (1 - p), .6 * (1 - p))); sc_ = 1 + 1.1 * (1 - p)
    stamp.location = pos; stamp.scale = (sc_, sc_, 1); stamp.rotation_euler = facing(cam, 8); stext.location = pos + Vector((0, -.04, 0)); stext.scale = (sc_, sc_, 1); stext.rotation_euler = facing(cam, 8)
    kick.data.energy = (900 * math.exp(-max(0, t - T_STAMP) / .5) + 160) if on else 0; gkick.data.energy = 600 * ss((t - T_SC2E) / .6) * (1 if t < ST('s9') + 3 else 0)
    sh_on = t >= T_SC2E + .5
    for o in shield: o.hide_render = not sh_on; o.location.x = o.location.x
    rec.data.body = f'REC 00:{int(max(0, t - T_SC1E)):02d}'; sp1.data.body = f'Sp1  {68.4 + .4 * math.sin(t * 9):.1f} C'; sp2.data.body = f'Sp2  {hot:.1f} C'
    for b, t_on in bars: b.scale.x = max(.001, eo((t - t_on) / .9))
    spd = 1 - .55 * ss((t - T6 - .5) / 6.0); spd_b.scale.x = max(.001, spd * eo((t - T6 - .5) / .5)); spd_l.data.body = f'GPU SPEED  {int(spd * 100)}%'
def show(kind, t):
    for o, a, b, k in labs: o.hide_render = not (k == kind and a <= t < b)
def vis_render(t, path):
    passmode('vis'); show('vis', t); [setattr(o, 'hide_render', False if o not in visonly else o.hide_render) for o in objs]; sc.render.filepath = path; bpy.ops.render.render(write_still=True)
def frame(i):
    t = i / FPS; state(t); passmode('th'); mode = 'th' if (T_SC1E <= t < T_SC2) else ('vis' if (t < T_SC1 or t >= T_SC2E) else 'scan')
    for o in objs: o.hide_render = False
    for o in visonly: o.hide_render = True if mode == 'th' else o.hide_render
    if mode == 'vis':
        vis_render(t, f'{OUT}/v.png'); im = Image.open(f'{OUT}/v.png').convert('RGB').resize((1080, 1920), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 60, 2))
    else:
        for o in visonly: o.hide_render = True
        show('none', t); sc.render.filepath = f'{OUT}/g.png'; bpy.ops.render.render(write_still=True); g = np.asarray(Image.open(f'{OUT}/g.png').convert('L'), float) / 255; th = Image.fromarray(sensor(g, 1080, 1920, seed=i))
        if mode == 'scan':
            vis_render(t, f'{OUT}/v.png'); vis = Image.open(f'{OUT}/v.png').convert('RGB').resize((1080, 1920), Image.LANCZOS)
            u = ss((t - T_SC1) / 1.4) if t < T_SC2 else ss((t - T_SC2) / 1.3); x = int(1080 * u)
            if t < T_SC2: out = vis.copy(); out.paste(th.crop((0, 0, x, 1920)), (0, 0))
            else: out = th.copy(); out.paste(vis.crop((0, 0, x, 1920)), (0, 0))
            ImageDraw.Draw(out).rectangle([x - 2, 0, x + 2, 1920], fill=(255, 250, 235)); im = out
        else: im = th
        if t >= T_SC1E + .05 and t < T_SC2 - .1:
            for o in objs: o.hide_render = True
            for o in visonly: o.hide_render = True
            passmode('ov'); show('ov', t); sc.render.filepath = f'{OUT}/o.png'; bpy.ops.render.render(write_still=True)
            o_ = Image.open(f'{OUT}/o.png').convert('RGBA').resize((1080, 1920), Image.BICUBIC); im = im.convert('RGBA'); im.alpha_composite(o_); im = im.convert('RGB')
    im.save(f'{OUT}/f{i:04d}.png')
N = int(round(DUR * FPS)); t00 = time.time()
for i in range(F0, min(F1, N)):
    if os.path.exists(f'{OUT}/f{i:04d}.png'): continue
    t0 = time.time(); frame(i); print(f'{i+1}/{N} {time.time()-t0:.1f}s', flush=True)
print('DONE', F0, min(F1, N), round(time.time() - t00))
