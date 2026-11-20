"""Mockup (3 scenes, real Cycles renders, measured s/frame): A scam phone (visible), B thermal desk (two-pass sensor sim + instruments), C official store (visible).
usage: python3 mockup.py [A|B|C|all]"""
import sys; sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from common import *
OUT = '/tmp/mscam/mock'; os.makedirs(OUT, exist_ok=True); WHICH = sys.argv[1] if len(sys.argv) > 1 else 'all'; TIMES = {}
def phone(loc, rot=(0, 0, 0), screen=None, body=None):
    o = box(loc, (.5, .06, 1.0), body or pbr(hexc('15191e'), .3, .6), .035); o.rotation_euler = tuple(math.radians(a) for a in rot)
    bpy.ops.mesh.primitive_plane_add(size=1); s = bpy.context.object; s.scale = (.46, .93, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); s.rotation_euler = (math.radians(90), 0, 0); s.location = (0, -.032, 0); s.parent = o
    if screen: s.data.materials.append(screen)
    return o, s
def console(loc, rot, mat_body, mat_core):
    b = box(loc, (.7, 1.85, 2.8), mat_body, .08); b.rotation_euler = tuple(math.radians(a) for a in rot); c = box((0, 0, 0), (.3, 1.9, 2.5), mat_core, .04); c.parent = b; return b
def desk(mat): 
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 1.5, -.5)); d = bpy.context.object; d.scale = (60, 60, 1); d.data.materials.append(mat); return d
def scene_A():
    sc = setup('0b0f13', .15); desk(pbr(hexc('11161b'), .35)); area((2.5, -3, 3), 3, 260, (1, .93, .85), (0, 0, 0)); area((-3, 1, 1.5), 2, 120, (.4, .75, .9), (0, 0, 0))
    card = card_png('/tmp/mscam/cardA.png', [('MOBILE EDITION', 34, '#f1f3f8'), ('FREE  .  APK  .  v1.0', 28, '#8d99a6')], '#ff4b3a', big='GTA 6')
    p, s = phone((0, 0, 0), (0, 0, 0), img_mat(card, 1.0)); cam = camera((0, -2.9, .1), (0, 0, .1), 50, 4.0, 2.9)
    for k, (nm, x, z, ry) in enumerate((('gta6_mobile.apk', -.5, .50, 10), ('FREE_UC_GIFT.exe', .52, .22, -12), ('gta6_beta.zip', -.5, -.30, 8))):
        c = box((x, .25 + .1 * k, z), (.42, .17, .02), pbr(hexc('2a333d'), .5, 0, hexc('2a333d'), .6), .012); c.rotation_euler = facing(cam, ry); tx = text(nm, (x - .19, .235 + .1 * k, z - .04), .035, hexc('ffd27a'), cam); tx.rotation_euler = facing(cam, ry)
        tx.location = c.location + (Vector((-.19, 0, -.018)) @ facing(cam, ry).to_matrix().transposed())
    st = box((.02, -.5, -.14), (.74, .22, .05), emit(TOMATO, 0.9), .015); st.rotation_euler = facing(cam, 8); t = text('MALWARE', (0, -.54, -.14), .13, hexc('0b0f13'), cam, 'anton', 'CENTER'); t.rotation_euler = facing(cam, 8); t.location = st.location + Vector((0, -.04, 0))
    hud('GTA 6 MOBILE?', cam, -.44, .40, .062, CREAM, 3, 'anton'); hud('= VIRUS', cam, -.44, .335, .062, TOMATO, 3, 'anton'); hud('FAKE INSTALLER · OUR OWN GRAPHIC', cam, -.44, -.455, .017, MUTE, 3)
    TIMES['A'] = render(f'{OUT}/A_scam.png')
def scene_B():
    sc = setup(0.13, 1.0, raw=True); sc.view_settings.view_transform = 'Raw'; Cfg.W, Cfg.H = 540, 960; sc.render.resolution_x, sc.render.resolution_y = 540, 960
    scn = []; scn.append(desk(thermal_mat(22)))
    p = box((-1.0, 0, 0), (.5, .06, 1.0), thermal_mat(31, hot=39, hot_pos=(0, .2), hot_r=.45), .035); scn.append(p)
    bpy.ops.mesh.primitive_plane_add(size=1); scr = bpy.context.object; scr.scale = (.46, .93, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); scr.rotation_euler = (math.radians(90), 0, 0); scr.location = (-1.0, -.034, 0); scr.data.materials.append(thermal_mat(33, hot=40, hot_pos=(0, .2), hot_r=.45)); scn.append(scr)
    c = box((.62, .3, .4), (.7, 1.85, 2.8), thermal_mat(46, hot=70, hot_pos=(0, 1.2), hot_r=.9), .08); c.rotation_euler = (0, 0, math.radians(32)); scn.append(c)
    cam = camera((0, -6.4, 1.3), (0, 0, .35), 34); hudo = []
    # instruments (overlay pass)
    strip = Image.new('RGB', (16, 256)); lut = (iron_lut(256) * 255).astype('uint8'); [strip.putpixel((x, 255 - y), tuple(lut[y])) for x in range(16) for y in range(256)]; strip.save('/tmp/mscam/strip.png')
    bpy.ops.mesh.primitive_plane_add(size=1); sp = bpy.context.object; sp.scale = (.16, 3.0, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    m = bpy.data.materials.new('s'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load('/tmp/mscam/strip.png'); tx.image.colorspace_settings.name = 'Non-Color'; e = nt.nodes.new('ShaderNodeEmission'); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(tx.outputs[0], e.inputs[0]); nt.links.new(e.outputs[0], o.inputs[0]); sp.data.materials.append(m)
    sp.location = (0, 0, 0); sp.parent = None; bpy.data.objects.remove(sp)
    WH = hexc('f1f3f8'); cs = hudbox(cam, .40, .12, .035, .30, (1, 1, 1, 1), 6); bpy.data.objects.remove(cs)
    # colour scale: 24 stacked bars from the iron palette
    lut = iron_lut(24)
    for k in range(24):
        c = tuple(lut[k]) + (1,); hudo.append(hudbox(cam, .405, -.12 + .0125 * k + .006, .04, .0128, c, 6))
    hudo += [hud('70.0 C', cam, .33, .185, .018, WH, 6), hud('15.0 C', cam, .33, -.125, .018, WH, 6), hud('REC 00:23', cam, -.44, .45, .02, WH, 6),
             hud('Sp1  68.4 C', cam, .02, .00, .024, WH, 6), hud('Sp2  36.2 C', cam, -.44, -.10, .024, WH, 6), hud('TEMPERATURES ILLUSTRATIVE', cam, -.44, -.145, .014, WH, 6)]
    for i, (lab, frac) in enumerate((('10.28 TFLOPS', 1.0), ('16 GB MEMORY', .8), ('~200 W  WHOLE CONSOLE', .9))):
        v = .385 - .075 * i; hudo.append(hud(lab, cam, -.44, v + .022, .016, WH, 6)); hudo.append(hudbox(cam, -.44, v, .62 * frac, .012, hexc('ffb21f'), 6))
    sc.render.film_transparent = False
    Tt = time.time(); [setattr(o, 'hide_render', True) for o in hudo]; sc.render.filepath = f'{OUT}/B_gray.png'; bpy.ops.render.render(write_still=True); t1 = time.time() - Tt
    [setattr(o, 'hide_render', True) for o in scn]; [setattr(o, 'hide_render', False) for o in hudo]; sc.render.film_transparent = True; sc.render.image_settings.color_mode = 'RGBA'; sc.render.filepath = f'{OUT}/B_ov.png'; Tt = time.time(); bpy.ops.render.render(write_still=True); t2 = time.time() - Tt
    g = np.asarray(Image.open(f'{OUT}/B_gray.png').convert('L'), float) / 255; base = Image.fromarray(sensor(g, 1080, 1920)); ov = Image.open(f'{OUT}/B_ov.png').convert('RGBA').resize((1080, 1920), Image.BICUBIC); base.paste(ov, (0, 0), ov); base.save(f'{OUT}/B_thermal.png'); TIMES['B'] = t1 + t2
def scene_C():
    sc = setup('0b0f13', .15); desk(pbr(hexc('11161b'), .35)); area((2.5, -3, 3), 3, 260, (1, .96, .9), (0, 0, 0)); area((-3, 1, 1.5), 2, 120, (.4, .75, .9), (0, 0, 0))
    card = card_png('/tmp/mscam/cardC.png', [('GTA San Andreas', 34, '#f1f3f8'), ('Rockstar Games', 28, '#8d99a6'), ('Official store', 26, '#7dffa0')], '#7dffa0', big='STORE')
    p, s = phone((0, 0, 0), (0, 0, 0), img_mat(card, 1.0)); cam = camera((0, -2.9, .1), (0, 0, .1), 50, 4.0, 2.9)
    bpy.ops.mesh.primitive_torus_add(location=(.3, -.35, .56), major_radius=.12, minor_radius=.022); r = bpy.context.object; r.rotation_euler = (math.radians(90), 0, 0); r.data.materials.append(emit(GREEN, 2.0))
    a = box((.265, -.35, .535), (.025, .025, .07), emit(GREEN, 2.0), 0); a.rotation_euler = (0, math.radians(-40), 0); b2 = box((.33, -.35, .58), (.025, .025, .15), emit(GREEN, 2.0), 0); b2.rotation_euler = (0, math.radians(40), 0)
    hud('OFFICIAL STORE', cam, -.44, .40, .062, GREEN, 3, 'anton'); hud('ONLY.', cam, -.44, .335, .062, CREAM, 3, 'anton'); hud('San Andreas on mobile since 2013 · name only, no Rockstar art', cam, -.44, -.455, .015, MUTE, 3)
    TIMES['C'] = render(f'{OUT}/C_official.png')
from mathutils import Matrix
for nm, fn in (('A', scene_A), ('B', scene_B), ('C', scene_C)):
    if WHICH in ('all', nm): fn()
print('TIMES', json.dumps({k: round(v, 1) for k, v in TIMES.items()}))
