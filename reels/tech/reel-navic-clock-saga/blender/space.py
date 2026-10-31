"""Sprites/plates for 'The clock that broke India's GPS' (Ground Station): a navigation-satellite stand-in built from the NASA satellite-kit parts
(illustrative, NOT the real NavIC bus) and a GSLV-style launch plate (procedural rocket).   python3 blender/space.py <sat|rocket|launch> out.png [spp]"""
import bpy, sys, os, math
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'assets', 'models', 'tools')); from load_model import place
what, out = sys.argv[1], sys.argv[2]; SPP = int(sys.argv[3]) if len(sys.argv) > 3 else 32
AMB, SKY, RED = (255, 176, 32), (85, 184, 255), (255, 74, 61)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = SPP; sc.cycles.device = 'CPU'; sc.cycles.use_denoising = True
sc.render.threads_mode = 'FIXED'; sc.render.threads = 3; sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - High Contrast'
sc.render.film_transparent = (what != 'launch'); sc.render.image_settings.color_mode = 'RGBA'
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (.004, .02, .026, 1); bg.inputs[1].default_value = .7
def light(kind, loc, rgb, energy, size=1.0, look=None):
    d = bpy.data.lights.new('l', kind); d.energy = energy; d.color = [x / 255 for x in rgb]
    if kind == 'AREA': d.size = size
    o = bpy.data.objects.new('l', d); o.location = loc; sc.collection.objects.link(o)
    if look is not None:
        t = bpy.data.objects.new('t', None); t.location = look; sc.collection.objects.link(t); c = o.constraints.new('TRACK_TO'); c.target = t; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    return o
def camera(loc, look, lens, W, H):
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = lens; cam.data.sensor_width = 36; cam.location = loc
    t = bpy.data.objects.new('ct', None); t.location = look; sc.collection.objects.link(t); c = cam.constraints.new('TRACK_TO'); c.target = t; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    sc.render.resolution_x, sc.render.resolution_y = W, H
def mat(name, rgb, rough=.5, metal=0, emit=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; c = [(x / 255) ** 2.2 for x in rgb]
    b.inputs['Base Color'].default_value = (*c, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit: b.inputs['Emission Color'].default_value = (*c, 1); b.inputs['Emission Strength'].default_value = emit
    return m
def cyl(r, h, loc, m, seg=48):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, vertices=seg); o = bpy.context.object; o.data.materials.append(m); return o
def cone(r1, r2, h, loc, m):
    bpy.ops.mesh.primitive_cone_add(radius1=r1, radius2=r2, depth=h, location=loc, vertices=48); o = bpy.context.object; o.data.materials.append(m); return o
def box(size, loc, m):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2); bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m); return o
def rim(look, k=1.0):
    light('AREA', (look[0] + 2.4, look[1] - 1.6, look[2] + 1.0), AMB, 300 * k, 1.8, look); light('AREA', (look[0] - 2.6, look[1] - 1.4, look[2] + .6), SKY, 420 * k, 2.0, look)
    light('AREA', (look[0], look[1] - 2.4, look[2] + 2.2), (230, 235, 255), 160 * k, 2.2, look)
if what == 'sat':      # procedural navigation-satellite stand-in: gold-foil bus, two solar wings, a dish and a clock window (illustrative, not the real NavIC bus)
    gold = mat('gold', (200, 140, 40), .28, .9); pan = mat('pan', (18, 40, 90), .25, .7); fr = mat('fr', (200, 205, 215), .4, .8); dk = mat('dk', (30, 36, 44), .5, .5)
    box((1.0, .9, 1.2), (0, 0, 0), gold); box((.9, .02, .5), (0, -.46, .05), mat('win', (255, 176, 32), .3, 0, 3))
    for sx in (-1, 1):
        box((.12, .12, .12), (sx * .56, 0, 0), fr); box((.5, .06, .06), (sx * .85, 0, 0), fr)
        for k in range(3): box((.9, .03, 1.1), (sx * (1.55 + k * .98), 0, 0), pan); box((.9, .035, .03), (sx * (1.55 + k * .98), 0, .0), fr)
    cone(.05, .5, .35, (0, 0, .78), fr); cyl(.025, .5, (0, 0, 1.15), fr, 16); box((.5, .5, .08), (0, 0, -.64), dk); cone(.22, .05, .3, (0, .2, -.9), dk)
    camera((4.2, -7.5, 3.0), (0, 0, 0), 38, 1400, 1000); rim((0, 0, 0), 5.0)
elif what == 'rocket':
    wh = mat('wh', (230, 232, 238), .35, .1); dk = mat('dk', (40, 48, 58), .5, .6); org = mat('org', (255, 120, 40), .5)
    cyl(.5, 6.0, (0, 0, 3.0), wh); cone(.5, .12, 1.4, (0, 0, 6.7), wh); cyl(.52, .25, (0, 0, 6.0), dk); cyl(.48, .18, (0, 0, 1.0), org)
    for a in (45, 135, 225, 315): cyl(.2, 3.2, (math.cos(math.radians(a)) * .72, math.sin(math.radians(a)) * .72, 1.7), wh, 32); cone(.2, .05, .5, (math.cos(math.radians(a)) * .72, math.sin(math.radians(a)) * .72, 3.55), wh)
    cyl(.4, .5, (0, 0, -.2), dk, 32)
    camera((5.5, -9.5, 3.4), (0, 0, 3.4), 40, 800, 1600); rim((0, 0, 3.4), 2.2)
elif what == 'launch':      # 1080x1920 night plate: pad tower, rocket, flame glow, ground haze
    wh = mat('wh', (225, 228, 235), .35, .1); dk = mat('dk', (30, 38, 46), .6, .5); fl = mat('fl', (255, 176, 32), .5, 0, 30); fl2 = mat('fl2', (255, 230, 150), .5, 0, 60)
    gr = mat('gr', (6, 16, 18), .4)
    box((60, 60, .1), (0, 0, -.05), gr)
    # (the rocket itself is the animated `rocket.png` sprite on the page; this plate is the pad, tower and lighting)
    # launch tower (lattice)
    for z in range(0, 16): box((.14, .14, 1.0), (-2.2, .6, z * .75 + .5), dk); box((.14, .14, 1.0), (-1.4, .6, z * .75 + .5), dk); box((.9, .08, .08), (-1.8, .6, z * .75 + .8), dk)
    box((2.2, 2.2, .3), (0, 0, .15), dk)
    light('POINT', (0, 0, 1.2), AMB, 2500); light('AREA', (6, -8, 6), SKY, 2200, 6, (0, 0, 4)); light('AREA', (-6, -6, 3), (255, 150, 80), 1400, 4, (0, 0, 4))
    camera((7.5, -13.0, 4.2), (0, 0, 4.4), 36, 1080, 1920)
if what != 'launch' and what != 'rocket': pass
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
