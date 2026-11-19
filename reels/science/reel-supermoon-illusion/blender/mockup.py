"""Mockup stills for the supermoon reel, all rendered in Blender (Cycles CPU): A orbit (flat), B equal moons (illusion), C diya ghat payoff.
usage: python3 mockup.py [scene A|B|C|all] [w=720] [h=1280] [samples=12]"""
import bpy, sys, math, os, random, time
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D); TEX = os.path.join(R, 'tex'); OUT = '/tmp/moon/mock'; os.makedirs(OUT, exist_ok=True)
WHICH = sys.argv[1] if len(sys.argv) > 1 else 'all'; W = int(sys.argv[2]) if len(sys.argv) > 2 else 720; H = int(sys.argv[3]) if len(sys.argv) > 3 else 1280; SMP = int(sys.argv[4]) if len(sys.argv) > 4 else 12
def _lin(v): return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
def hexc(h, a=1): h = h.lstrip('#'); return tuple(_lin(int(h[i:i+2], 16) / 255) for i in (0, 2, 4)) + (a,)
NIGHT, RING1, RING2, CREAM, AMBER, TEAL, SUN, MINT, BLUE, INK = [hexc(x) for x in ('0b1230', '141c4a', '1e2a6a', 'f3e7c9', 'ff9d2e', '35d0c0', 'ffc84a', '3fd8ae', '4d7cfe', '070b1e')]
def setup():
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SMP; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.max_bounces = 4; sc.render.resolution_x = W; sc.render.resolution_y = H; sc.render.threads = 4; sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = NIGHT; bg.inputs[1].default_value = 1.0
    return sc
def flat(col, name='f'):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = col; e.inputs[1].default_value = 1.0; o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def disc(x, y, r, col, z=0, seg=64):
    bpy.ops.mesh.primitive_circle_add(vertices=seg, radius=r, fill_type='NGON', location=(x, y, z)); o = bpy.context.object; o.data.materials.append(flat(col)); return o
def glow(x, y, r, col, z=0): disc(x, y, r * 2.2, RING2, z - .02); disc(x, y, r * 1.55, RING1 if False else hexc('2b3a8c'), z - .01); return disc(x, y, r, col, z)
def ring(x, y, rx, ry, col, w=.03, z=0, dash=False):
    bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=w, major_segments=96, minor_segments=8, location=(x, y, z)); o = bpy.context.object; o.scale = (rx, ry, 1); o.data.materials.append(flat(col)); return o
def text(s, x, y, size, col, font=None, align='LEFT', z=0, rot=0, rx=0):
    font = font or ('anton' if size >= .5 else 'plexmono')   # variable-font-derived TTFs (Inter, Manrope, Sora, Azeret) break in Blender; Anton and Plex Mono are clean
    bpy.ops.object.text_add(location=(x, y, z)); o = bpy.context.object; o.data.body = s; o.data.size = size; o.data.align_x = align; o.data.font = bpy.data.fonts.load(os.path.join(D, 'fonts', font + '.ttf')); o.data.extrude = 0.0; o.data.materials.append(flat(col)); o.rotation_euler = (math.radians(rx), 0, math.radians(rot)); return o
def bar(x0, x1, y, col, t=.05, z=0):
    bpy.ops.mesh.primitive_cube_add(location=((x0 + x1) / 2, y, z)); o = bpy.context.object; o.scale = ((x1 - x0) / 2, t / 2, .001); o.data.materials.append(flat(col)); 
    for xx in (x0, x1): bpy.ops.mesh.primitive_cube_add(location=(xx, y, z)); k = bpy.context.object; k.scale = (t / 2, .12, .001); k.data.materials.append(flat(col))
def moon_sphere(x, y, z, r, rot=(math.radians(90), 0, math.radians(-90))):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=r, location=(x, y, z)); o = bpy.context.object; bpy.ops.object.shade_smooth()
    m = bpy.data.materials.new('moon'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(os.path.join(TEX, 'moon_color_2k.jpg')); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[1].default_value = 1.1
    nt.links.new(tx.outputs[0], e.inputs[0]); out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], out.inputs[0]); o.data.materials.append(m); o.rotation_euler = rot; return o
def camera(sc, loc, rot, ortho=None, lens=38):
    c = bpy.data.cameras.new('c'); o = bpy.data.objects.new('c', c); sc.collection.objects.link(o); sc.camera = o; o.location = loc; o.rotation_euler = tuple(math.radians(a) for a in rot)
    if ortho: c.type = 'ORTHO'; c.sensor_fit = 'VERTICAL'; c.ortho_scale = ortho
    else: c.lens = lens
def render(sc, name):
    t0 = time.time(); sc.render.filepath = f'{OUT}/{name}.png'; bpy.ops.render.render(write_still=True); print(f'{name}: {time.time()-t0:.1f} s', flush=True)
def scene_A():
    sc = setup(); camera(sc, (0, 0, 20), (0, 0, 0), ortho=13.5)
    ring(0, .5, 2.9, 3.6, hexc('3a47a8'), w=.03, z=-.2)                                    # egg-shaped orbit, eccentricity EXAGGERATED
    glow(0, -1.66, .6, BLUE, z=0); disc(.13, -1.8, .55, hexc('3a5fd9'), z=.01)             # Earth at one focus, one shade step
    glow(0, -3.1, .3, CREAM, z=.02); ring(0, -3.1, .75, .75, SUN, w=.05, z=.03)            # moon at perigee, locked ring
    glow(0, 4.1, .22, hexc('9aa0d8'), z=.02)                                               # moon at apogee (dimmer, smaller)
    text('PERIGEE', 1.0, -3.0, .34, SUN); text('about 361,000 km', 1.0, -3.55, .28, CREAM)
    text('APOGEE', 1.0, 3.95, .3, hexc('9298d4'))
    text('SUPERMOON', -3.5, 5.7, 1.1, CREAM); text('UP TO +14% vs the faintest full moon', -3.5, 5.0, .3, SUN)
    text('orbit shape exaggerated', -3.5, -6.0, .26, hexc('9298d4')); text('NASA: up to 14% bigger, 30% brighter', -3.5, -6.45, .26, hexc('9298d4'))
    render(sc, 'A_orbit')
def scene_B():
    sc = setup(); camera(sc, (0, 0, 20), (0, 0, 0), ortho=15)
    moon_sphere(0, 2.6, 0, 1.0)                                                            # high moon
    moon_sphere(0, -1.5, 0, 1.0)                                                           # horizon moon: same radius
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -3.9, .5)); g = bpy.context.object; g.scale = (12, 2.6, 1); g.data.materials.append(flat(hexc('070b1e')))
    random.seed(4)
    for i in range(14):                                                                     # tree silhouettes
        x = -2.9 + i * .45 + random.uniform(-.1, .1); h = random.uniform(.9, 2.0); bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=.28, depth=h, location=(x, -2.65 + h / 2 - .1, .6)); c = bpy.context.object; c.rotation_euler = (math.pi / 2, 0, 0); c.data.materials.append(flat(hexc('050818')))
    bar(-1.0, 1.0, 1.15, TEAL, z=.2); bar(-1.0, 1.0, -2.75, TEAL, z=.7)                    # equal rulers
    text('HIGH', -3.4, 3.7, .4, hexc('9298d4')); text('HORIZON', -3.4, -.4, .4, hexc('9298d4')); text('same width', 1.2, 1.05, .34, TEAL, z=.2); text('same width', 1.2, -2.9, .34, TEAL, z=.8)
    text('SAME MOON.', -3.6, 6.7, 1.0, CREAM); text('DIFFERENT BRAIN.', -3.6, 5.5, 1.0, SUN); text('NASA: photos show equal width', -3.6, -6.8, .3, hexc('9298d4'))
    render(sc, 'B_illusion')
def scene_C():
    sc = setup(); camera(sc, (0, -9.5, 3.6), (80, 0, 0), lens=30)
    stone = bpy.data.materials.new('stone'); stone.use_nodes = True; b = stone.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = hexc('6a5040'); b.inputs['Roughness'].default_value = .9
    for i in range(9):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -.2 + i * 1.15, .25 - i * .0 + i * .32)); o = bpy.context.object; o.scale = (9, 1.15, .5 + i * .0); o.data.materials.append(stone)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=.1); bowl = bpy.context.object; bowl.scale = (1, 1, .45); bowl.location = (0, 0, -50); bowl.data.materials.append(flat(hexc('c0662a')))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=.04); fl = bpy.context.object; fl.scale = (.8, .8, 1.8); fl.location = (0, 0, -50 + .09); m = bpy.data.materials.new('fl'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = AMBER; b.inputs['Emission Color'].default_value = AMBER; b.inputs['Emission Strength'].default_value = 40; fl.data.materials.append(m)
    col = bpy.data.collections.new('diya'); sc.collection.children.link(col)
    for o in (bowl, fl):
        for c in o.users_collection: c.objects.unlink(o)
        col.objects.link(o)
    col.instance_offset = (0, 0, -50); random.seed(3)
    for i in range(360):
        r = i // 40; inst = bpy.data.objects.new(f'd{i}', None); inst.instance_type = 'COLLECTION'; inst.instance_collection = col; inst.location = (random.uniform(-4.2, 4.2), -.2 + r * 1.15 + random.uniform(-.35, .35), .55 + r * .32); inst.scale = (1.8,) * 3; sc.collection.objects.link(inst)
    moon_sphere(0, 26, 9.5, 4.2)
    sun = bpy.data.lights.new('s', 'SUN'); sun.energy = 2.5; sun.color = (.7, .8, 1); so = bpy.data.objects.new('s', sun); so.rotation_euler = (math.radians(60), 0, math.radians(20)); sc.collection.objects.link(so)
    text('DEV DEEPAWALI', -1.8, -4.0, .55, CREAM, z=1.7, rx=90); text('KARTIK PURNIMA · 24 NOV', -1.8, -4.0, .22, SUN, z=1.25, rx=90)
    render(sc, 'C_ghat')
for nm, fn in (('A', scene_A), ('B', scene_B), ('C', scene_C)):
    if WHICH in ('all', nm): fn()
