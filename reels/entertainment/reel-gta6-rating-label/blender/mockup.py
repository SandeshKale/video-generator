"""Mockup scenes for the GTA VI rating-label reel (Lemo `visual-investigation`, own palette). Blender 5 via the bpy module.
usage: /usr/bin/python3 mockup.py SCENE T OUT.png   (SCENE = A | B | C, T = 0..1 local progress)
Beauty pass 720x1280, text in a crisp overlay pass at 1080x1920 (scripts/blender_text.py), composited at 1080x1920.
Every frame is a pure function of T. Camera: straight down, lens 36 -> world height = camera height (12 u), 1 px = 1/160 u."""
import sys, os, math, time, bpy
sys.path.insert(0, '/home/user/video-generator/scripts'); import blender_text as BT
SCENE, T, OUT = sys.argv[-3], float(sys.argv[-2]), sys.argv[-1]
t_start = time.time()
BW, BH = 720, 1280
INK = '#ECEAE4'; GREY = '#8B9097'; DIM = '#4A4F57'; ACC = '#FF3D81'; PANEL = '#14161C'; HAIR = '#2E3238'; GROUND = '#0B0C0E'
def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (1,)
def ss(x): x = max(0, min(1, x)); return x * x * (3 - 2 * x)
def seg(t, a, b): return ss((t - a) / (b - a))
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 16; sc.cycles.use_denoising = True
sc.view_settings.view_transform = 'Standard'; sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = BW, BH, 100
BT.init(1080, 1920)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = lin('#050607'); w.node_tree.nodes['Background'].inputs[1].default_value = 1.0
cd = bpy.data.cameras.new('c'); cd.lens = 36; cd.dof.use_dof = False; cam = bpy.data.objects.new('c', cd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (0, 0, 12); cam.rotation_euler = (0, 0, 0)
sun = bpy.data.lights.new('s', 'SUN'); sun.energy = 1.25; sun.angle = .12; so = bpy.data.objects.new('s', sun); so.rotation_euler = (math.radians(14), math.radians(-10), 0); sc.collection.objects.link(so)
PX = 160.0
def wx(x): return (x - 540) / PX
def wy(y): return (960 - y) / PX
def mat(c, rough=.6, emit=0.0):
    m = bpy.data.materials.new('m'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = lin(c); b.inputs['Roughness'].default_value = rough; b.inputs['Specular IOR Level'].default_value = .2
    if emit: b.inputs['Base Color'].default_value = (0, 0, 0, 1); b.inputs['Emission Color'].default_value = lin(c); b.inputs['Emission Strength'].default_value = emit
    return m
def box(x0, y0, x1, y1, z, h, m, bevel=0.012):
    """px rectangle (top-left x0,y0 → bottom-right x1,y1), base at z, height h."""
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.object
    o.scale = ((x1 - x0) / PX, (y1 - y0) / PX, h); o.location = (wx((x0 + x1) / 2), wy((y0 + y1) / 2), z + h / 2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        bv = o.modifiers.new('b', 'BEVEL'); bv.width = bevel; bv.segments = 2
    o.data.materials.append(m); return o
def ring_dashed(x0, y0, x1, y1, z, m, dash=26, gap=16, th=4):
    for (ax, ay, bx, by) in ((x0, y0, x1, y0), (x0, y1, x1, y1), (x0, y0, x0, y1), (x1, y0, x1, y1)):
        L = math.hypot(bx - ax, by - ay); n = int(L // (dash + gap)); ux, uy = (bx - ax) / L, (by - ay) / L
        for i in range(n + 1):
            s0 = i * (dash + gap); s1 = min(L, s0 + dash)
            if s1 <= s0: continue
            xa, ya, xb, yb = ax + ux * s0, ay + uy * s0, ax + ux * s1, ay + uy * s1
            box(min(xa, xb) - th / 2, min(ya, yb) - th / 2, max(xa, xb) + th / 2, max(ya, yb) + th / 2, z, .02, m, 0)
def disc(x, y, r, z, h, m):
    bpy.ops.mesh.primitive_cylinder_add(radius=r / PX, depth=h, vertices=64, location=(wx(x), wy(y), z + h / 2)); o = bpy.context.object; o.data.materials.append(m); return o
desk = box(-400, -400, 1480, 2320, -.05, .05, mat(GROUND, .85), 0)
M_PANEL, M_HAIR, M_ACC, M_ACCD, M_DIM = mat(PANEL, .55), mat(HAIR, .5), mat(ACC, .4, 1.0), mat(ACC, .4, 1.0), mat(DIM, .5, .6)
def card(x0, y0, x1, y1, dashed=False, lift=.06):
    box(x0 - 3, y0 - 3, x1 + 3, y1 + 3, 0, lift * .6, M_HAIR, .006)
    c = box(x0, y0, x1, y1, 0, lift, M_PANEL, .01)
    if dashed: ring_dashed(x0 + 8, y0 + 8, x1 - 8, y1 - 8, lift, M_ACC)
    return c
TXT = []
def txt(s, font, px, fill, x, y, align='left', outline=None):
    o = BT.label(cam, s, font, px, fill=fill, u=(x - 540) / 1080, v=(960 - y) / 1920, dist=6, outline=outline, align=align); TXT.append(o); return o
def tag(x, y, s, fill=GREY): txt(s, BT.PLEX_SEMI, 30, fill, x, y)
HEAD = BT.INTER_XBOLD; MONO = BT.PLEX_SEMI; MONOB = BT.PLEX_BOLD

if SCENE == 'A':
    # one finding: the US label is the same seven descriptors as GTA V (one table, two tick columns)
    tag(170, 300, 'ESRB · LISTING', ACC)
    txt('SAME 7 LABELS', HEAD, 92, INK, 170, 385)
    txt('GTA V and GTA VI, line by line', MONO, 30, GREY, 170, 470)
    rows = ['Blood and Gore', 'Intense Violence', 'Mature Humor', 'Nudity', 'Strong Language', 'Strong Sexual Content', 'Drugs and Alcohol']
    Y0 = 560; card(170, Y0, 918, Y0 + 650)
    txt('DESCRIPTOR', MONO, 26, GREY, 196, Y0 + 52); txt('GTA V', MONOB, 28, INK, 662, Y0 + 52, align='center'); txt('GTA VI', MONOB, 28, INK, 810, Y0 + 52, align='center')
    box(196, Y0 + 90, 892, Y0 + 94, .06, .01, M_HAIR, 0)
    for i, r in enumerate(rows):
        ry = Y0 + 150 + i * 68; hot = (i == 5); a = seg(T, .12, .5) if hot else 0
        if hot: box(184, ry - 31, 184 + 720 * a, ry + 31, .06, .03, M_ACC, 0)
        txt(r, MONO, 28, '#0B0C0E' if (hot and a > .9) else INK, 196, ry)
        for cx, k in ((662, 0), (810, 1)):
            on = seg(T, .3 + i * .045 + k * .02, .42 + i * .045 + k * .02)
            if on > .02:
                col = M_ACC if not hot else mat('#0B0C0E', .5, .0)
                box(cx - 17 * on, ry - 17 * on, cx + 17 * on, ry + 17 * on, .10 if hot else .06, .03, col if not (hot and a > .9) else mat('#0B0C0E', .5), 0)
    k = seg(T, .8, .95)
    if k > .5: txt('7 of 7 match · ESRB pages, 22 Nov', MONO, 28, ACC, 170, 1262)
elif SCENE == 'B':
    tag(170, 300, 'PEGI · LISTING', ACC)
    txt('POSTED.', HEAD, 84, INK, 170, 385); txt('THEN PULLED.', HEAD, 84, INK, 170, 475)
    txt('Same board, two versions of one page', MONO, 28, GREY, 170, 550)
    cards = [(640, 820, 'PEGI 18 · summary posted', ['earlier text, reported:', 'not shown here'], False, 'PEGI · LISTING'),
             (900, 1060, '[ summary text removed ]', ['REPORTED · NOT CONFIRMED'], True, 'PEGI · PULLED'),
             (1150, 1350, 'Page today: short summary', ['“action-adventure game set in an', 'open-world version of the fictional', 'state of Leonida”'], False, 'PEGI · PAGE TODAY')]
    # timeline spine
    p = seg(T, .05, .8); box(204, 680, 208, 680 + 620 * p, .02, .02, M_ACC, 0)
    for i, (y0, y1, title, lines, dashed, tg) in enumerate(cards):
        a = seg(T, .05 + i * .2, .3 + i * .2)
        if a < .02: continue
        yc = (y0 + y1) / 2; disc(206, yc, 16 * a, .02, .06, M_ACC if dashed else M_DIM)
        card(290, y0 + (1 - a) * 30, 918, y1 + (1 - a) * 30, dashed)
        tag(310, y0 - 26, tg, ACC if dashed else GREY)
        txt(title, HEAD, 40, INK, 316, y0 + 48)
        for j, l in enumerate(lines): txt(l, MONO, 28, GREY if not dashed else ACC, 316, y0 + 100 + j * 40)
elif SCENE == 'C':
    tag(170, 300, 'THREE BOARDS · ONE GAME', ACC)
    txt('SAME GAME.', HEAD, 84, INK, 170, 385); txt('NEW WORDS.', HEAD, 84, INK, 170, 475)
    txt('What each board put on its listing', MONO, 28, GREY, 170, 550)
    items = [('M', '17+', 'ESRB', 'Strong Sexual Content', 'ESRB · LISTING', False),
             ('18', 'PEGI', 'PEGI', 'icon: Sex', 'PEGI · PAGE', False),
             ('AU', 'NZ', 'STORE LISTINGS', 'wording: “sex scenes”', 'AU/NZ · STORE', True)]
    for i, (b1, b2, name, line, tg, unres) in enumerate(items):
        y0 = 640 + i * 225; a = seg(T, .06 + i * .22, .3 + i * .22)
        if a < .02: continue
        yo = (1 - a) * 28
        card(170, y0 + yo, 918, y0 + 195 + yo, unres)
        disc(285, y0 + 98 + yo, 62, .06, .05, M_ACC if not unres else M_DIM)
        txt(b1, HEAD, 64 if len(b1) < 3 else 54, '#0B0C0E' if not unres else INK, 285, y0 + 98 + yo, align='center')
        tag(390, y0 + 46 + yo, tg, ACC if not unres else GREY)
        txt(name, HEAD, 44, INK, 390, y0 + 100 + yo)
        txt(line, MONO, 28, GREY, 390, y0 + 156 + yo)
    k = seg(T, .8, .96); txt('level: reports differ · not voiced', MONO, 28, ACC if k > .5 else DIM, 170, 1330)

# render beauty, overlay, composite
bpy.context.view_layer.update()
os.makedirs(os.path.dirname(OUT) or '.', exist_ok=True)
beauty = OUT.replace('.png', '_b.png'); over = OUT.replace('.png', '_o.png')
all_geo = [o for o in bpy.context.scene.objects if o.type == 'MESH' and o not in TXT]
for o in TXT: o.hide_render = True
sc.render.filepath = beauty; t0 = time.time(); bpy.ops.render.render(write_still=True); tb = time.time() - t0
for o in TXT: o.hide_render = False
t0 = time.time(); BT.render_overlay(over, TXT, all_geo + [so]); to = time.time() - t0
BT.composite(beauty, over, OUT)
print(f'SCENE {SCENE} T={T}: beauty {tb:.1f}s overlay {to:.1f}s total {time.time() - t_start:.1f}s')
