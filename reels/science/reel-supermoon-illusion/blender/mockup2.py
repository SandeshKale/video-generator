"""Mockup v2 (3D depth): perspective cameras, lit spheres with real NASA/Blue Marble textures, depth of field, instanced diyas, a real landscape.
usage: python3 mockup2.py [A|B|C|all] [w=720] [h=1280] [samples=24]"""
import bpy, sys, math, os, random, time
from mathutils import Vector
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D); TEX = os.path.join(R, 'tex'); OUT = '/tmp/moon/mock2'; os.makedirs(OUT, exist_ok=True)
WHICH = sys.argv[1] if len(sys.argv) > 1 else 'all'; W = int(sys.argv[2]) if len(sys.argv) > 2 else 720; H = int(sys.argv[3]) if len(sys.argv) > 3 else 1280; SMP = int(sys.argv[4]) if len(sys.argv) > 4 else 24
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
def render(name):
    sc = bpy.context.scene; t0 = time.time(); sc.render.filepath = f'{OUT}/{name}.png'; bpy.ops.render.render(write_still=True); print(f'{name}: {time.time()-t0:.1f} s', flush=True)
def stars(n=500, rad=180):
    random.seed(2)
    for i in range(n):
        v = Vector((random.gauss(0, 1), random.gauss(0, 1), random.gauss(0, 1))).normalized() * rad; bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(.12, .35), location=v); bpy.context.object.data.materials.append(emit(hexc('cfd6ff'), 3))
def world_glow(top='03051a', horizon='1b2a66', power=1.0):
    w = bpy.context.scene.world; nt = w.node_tree; nt.nodes.clear(); tc = nt.nodes.new('ShaderNodeTexCoord'); sp = nt.nodes.new('ShaderNodeSeparateXYZ'); cr = nt.nodes.new('ShaderNodeValToRGB'); bg = nt.nodes.new('ShaderNodeBackground'); out = nt.nodes.new('ShaderNodeOutputWorld')
    nt.links.new(tc.outputs['Generated'], sp.inputs[0]); mp = nt.nodes.new('ShaderNodeMapRange'); mp.inputs[1].default_value = .5; mp.inputs[2].default_value = .75; mp.inputs[3].default_value = 0; mp.inputs[4].default_value = 1
    nt.links.new(sp.outputs['Z'], mp.inputs[0]); nt.links.new(mp.outputs[0], cr.inputs[0]); cr.color_ramp.elements[0].position = 0; cr.color_ramp.elements[0].color = hexc(horizon); cr.color_ramp.elements[1].position = 1; cr.color_ramp.elements[1].color = hexc(top)
    bg.inputs[1].default_value = power; nt.links.new(cr.outputs[0], bg.inputs[0]); nt.links.new(bg.outputs[0], out.inputs[0])
def scene_A():
    sc = setup('03051a', .5); stars(); sun((50, 0, 40), 4.0, (1, .96, .9))
    sphere(0, 0, 0, 1.15, tex_mat('earth_2k.jpg', .6), rot=(math.radians(75), 0, math.radians(200)))
    a, e = 6.0, 0.5; pts = []
    for i in range(160):
        t = i * math.pi * 2 / 160; r = a * (1 - e * e) / (1 + e * math.cos(t)); pts.append((r * math.sin(t), r * math.cos(t), 0))   # long axis along y, perigee at (0, 3)
    tube(pts, hexc('5b6cf0'), .04); mm = tex_mat('moon_color_2k.jpg', 1.0)
    sphere(0, 3.0, 0, .5, mm); sphere(0, -9.0, 0, .34, mm)
    cam = camera((5, -11, 20), (0, -3.2, 0), lens=48, fstop=2.6, focus=23)
    tube([(.95 * math.sin(t), 3 + .95 * math.cos(t), 0) for t in [i * math.pi * 2 / 48 for i in range(48)]], SUN, .05)
    hud('SUPERMOON', cam, -.44, .39, .075, CREAM, dist=20); hud('UP TO +14% vs the faintest full moon', cam, -.44, .345, .022, SUN, dist=20, font='plexmono')
    hud('PERIGEE: about 361,000 km', cam, -.44, .29, .026, SUN, dist=20, font='plexmono'); hud('APOGEE', cam, .12, -.37, .025, MUTE, dist=20, font='plexmono')
    hud('orbit shape exaggerated', cam, -.44, -.47, .018, MUTE, dist=20, font='plexmono')
    render('A_orbit')
def scene_B():
    sc = setup('050a24', 1.0); world_glow('02040f', '23327a', 1.2); camloc = Vector((0, 0, 2.0)); pitch = 20
    sun((70, 0, 20), 0.9, (.6, .7, 1.0))
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 150, 0)); g = bpy.context.object; g.scale = (800, 800, 1); g.data.materials.append(pbr(hexc('0e1636'), .9))
    d = 300; r = d * math.tan(math.radians(4.3)); mm = tex_mat('moon_color_2k.jpg', 1.0, emis=1.5)
    def at(elev, dist=d): return camloc + Vector((0, math.cos(math.radians(elev)), math.sin(math.radians(elev)))) * dist
    for elev in (31, 7.0):
        c = at(elev); sphere(*c, r, mm)
        bpy.ops.mesh.primitive_cube_add(location=c + Vector((0, 0, -r * 1.35))); b = bpy.context.object; b.scale = (r, 1.0, .35); b.data.materials.append(emit(TEAL, 3))      # caliper exactly one moon wide (equal angular width)
        for sx in (-1, 1): bpy.ops.mesh.primitive_cube_add(location=c + Vector((sx * r, 0, -r * 1.35))); k = bpy.context.object; k.scale = (.5, 1.0, 4.5); k.data.materials.append(emit(TEAL, 3))
    random.seed(5); tm = pbr(hexc('01030a'), .9)
    for i in range(110):
        y = random.uniform(24, 190); x = random.uniform(-.7, .7) * y * 1.0; h = y * math.tan(math.radians(random.uniform(2.0, 9.0)))
        bpy.ops.mesh.primitive_cone_add(vertices=7, radius1=h * .2, depth=h, location=(x, y, h / 2)); bpy.context.object.data.materials.append(tm)
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=h * .03, depth=h * .22, location=(x, y, h * .11)); bpy.context.object.data.materials.append(tm)
    cam = camera((0, 0, 2.0), (0, math.cos(math.radians(pitch)) * 10, 2.0 + math.sin(math.radians(pitch)) * 10), lens=26)
    hud('SAME MOON.', cam, -.44, .40, .07, CREAM); hud('DIFFERENT BRAIN.', cam, -.44, .33, .07, SUN)
    hud('HIGH', cam, -.44, .22, .024, MUTE, font='plexmono'); hud('HORIZON', cam, -.44, -.08, .024, MUTE, font='plexmono')
    hud('same width', cam, .13, .16, .022, TEAL, font='plexmono'); hud('same width', cam, .13, -.14, .022, TEAL, font='plexmono'); hud('NASA: photos show equal width', cam, -.44, -.46, .02, MUTE, font='plexmono')
    render('B_illusion')
def scene_C():
    sc = setup('050a24', .8); world_glow('02040f', '1b2560', 1.0); sun((62, 0, 25), 1.6, (.65, .75, 1.0)); stone = pbr(hexc('6a5040'), .85)
    for i in range(10):
        bpy.ops.mesh.primitive_cube_add(location=(0, 1 + i * 1.2, .3 + i * .36)); o = bpy.context.object; o.scale = (11, .6, .3 + i * .18); o.data.materials.append(stone)
        bm = o.modifiers.new('b', 'BEVEL'); bm.width = .05; bm.segments = 2
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -30, -.02)); w = bpy.context.object; w.scale = (200, 90, 1); w.data.materials.append(pbr(hexc('060b22'), .04))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, radius=.1); bowl = bpy.context.object; bowl.scale = (1, 1, .45); bowl.location = (0, 0, -50); bowl.data.materials.append(pbr(hexc('c0662a'), .7))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=8, radius=.04); fl = bpy.context.object; fl.scale = (.8, .8, 1.9); fl.location = (0, 0, -50 + .1); fl.data.materials.append(pbr(AMBER, .5, emission=AMBER, es=60))
    col = bpy.data.collections.new('diya'); sc.collection.children.link(col); col.instance_offset = (0, 0, -50)
    for o in (bowl, fl):
        for c in o.users_collection: c.objects.unlink(o)
        col.objects.link(o)
    random.seed(3)
    for i in range(420):
        r = i // 42; inst = bpy.data.objects.new(f'd{i}', None); inst.instance_type = 'COLLECTION'; inst.instance_collection = col; inst.location = (random.uniform(-5, 5), 1 + r * 1.2 + random.uniform(-.4, .4) - .25, .62 + r * .36); inst.scale = (2.0,) * 3; sc.collection.objects.link(inst)
    for i in range(7):
        inst = bpy.data.objects.new(f'f{i}', None); inst.instance_type = 'COLLECTION'; inst.instance_collection = col; inst.location = (random.uniform(-3.5, 3.5), random.uniform(-9, -3), .08); inst.scale = (3.2,) * 3; sc.collection.objects.link(inst)
    sphere(2.5, 70, 26, 8.5, tex_mat('moon_color_2k.jpg', 1.0, emis=1.0))
    cam = camera((0, -13, 2.2), (0, 6, 4.0), lens=30, fstop=1.6, focus=16)
    hud('DEV DEEPAWALI', cam, -.44, .40, .06, CREAM, dist=14); hud('KARTIK PURNIMA · 24 NOV', cam, -.44, .355, .02, SUN, dist=14, font='plexmono')
    render('C_ghat')
for nm, fn in (('A', scene_A), ('B', scene_B), ('C', scene_C)):
    if WHICH in ('all', nm): fn()
