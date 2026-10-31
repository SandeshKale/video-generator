"""Neon dusk city plate for 'Itna jaldi kaise?' (mockup v2 scene B): Kenney city blocks (CC0) tinted to night, vivid coloured light pools,
the procedural delivery scooter on the road, and a violet geofence ring on the ground.   python3 blender/city.py out.png [w h spp]"""
import bpy, sys, os, math, random
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'assets', 'models', 'tools')); from load_model import place
out = sys.argv[1]; W = int(sys.argv[2]) if len(sys.argv) > 2 else 540; Hh = int(sys.argv[3]) if len(sys.argv) > 3 else 960; SPP = int(sys.argv[4]) if len(sys.argv) > 4 else 24
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = SPP; sc.cycles.device = 'CPU'; sc.cycles.use_denoising = True
sc.render.threads_mode = 'FIXED'; sc.render.threads = 2; sc.render.resolution_x, sc.render.resolution_y = W, Hh
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - High Contrast'; sc.view_settings.exposure = 0.0
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (.012, .014, .045, 1); bg.inputs[1].default_value = 1.0
def mat(name, rgb, rough=.5, emit=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; c = [(x / 255) ** 2.2 for x in rgb]
    b.inputs['Base Color'].default_value = (*c, 1); b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*c, 1); b.inputs['Emission Strength'].default_value = emit
    return m
def light(kind, loc, rgb, energy, size=1.0, rot=(0, 0, 0)):
    d = bpy.data.lights.new('l', kind); d.energy = energy; d.color = [x / 255 for x in rgb]
    if kind == 'AREA': d.size = size
    if kind == 'POINT': d.shadow_soft_size = .25
    o = bpy.data.objects.new('l', d); o.location = loc; o.rotation_euler = rot; sc.collection.objects.link(o); return o
T = 3.0
ORANGE, VIOLET, LIME, PINK = (255, 106, 26), (123, 77, 255), (198, 255, 26), (255, 45, 122)
# ground: dark asphalt slab so lights pool on it
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, -.02)); g = bpy.context.object; g.data.materials.append(mat('ground', (14, 14, 24), .35))
random.seed(5); bld = ['building-small-a', 'building-small-b', 'building-small-c', 'building-small-d', 'building-garage']
for gx in range(-3, 4):
    for gy in range(-3, 4):
        x, y = gx * T, gy * T
        if gx == 0 and gy == 0: place('kenney/city/road-intersection', loc=(x, y, 0), scale=T)
        elif gx == 0: place('kenney/city/road-straight', loc=(x, y, 0), rot_z=90, scale=T)
        elif gy == 0: place('kenney/city/road-straight', loc=(x, y, 0), scale=T)
        else:
            b = random.choice(bld); place('kenney/city/' + b, loc=(x, y, 0), rot_z=random.choice([0, 90, 180, 270]), scale=T * (.5 + random.random() * .22), tint=(.10, .09, .2))
# the scooter, on the road toward the camera, headlamp on
sco = place('procedural/delivery_scooter', loc=(0.5, -3.6, 0), rot_z=-90, height=1.5)
light('SPOT', (0.5, -2.8, .7), ORANGE, 900); bpy.data.objects[-1].rotation_euler = (math.radians(95), 0, math.radians(0))
# geofence ring (violet, emissive) around the intersection, lying on the road
bpy.ops.mesh.primitive_torus_add(location=(0, 0, .03), major_radius=7.0, minor_radius=.07, major_segments=96); r = bpy.context.object; r.data.materials.append(mat('ring', VIOLET, .4, 18))
bpy.ops.mesh.primitive_torus_add(location=(0, 0, .03), major_radius=3.0, minor_radius=.05, major_segments=64); r2 = bpy.context.object; r2.data.materials.append(mat('ring2', LIME, .4, 14))
# customer pin: the map pin on the near-left block, glowing orange
pin = place('procedural/map_pin', loc=(-3.2, -3.4, 2.4), height=1.6); 
# light pools: street lamps (orange), violet and lime wash from the sides, pink accent behind
for k, (x, y) in enumerate([(-1.6, -9), (1.6, -5), (-1.6, -1), (1.6, 3), (-1.6, 7)]): light('POINT', (x, y, 3.2), ORANGE, 700)
light('AREA', (-9, -2, 4), VIOLET, 5200, 7, (math.radians(90), 0, math.radians(-90))); light('AREA', (9, 2, 4), LIME, 2200, 6, (math.radians(90), 0, math.radians(90)))
light('POINT', (0, 8, 5), PINK, 1800); light('AREA', (0, 0, 14), (170, 190, 255), 900, 12)
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = 38; cam.data.sensor_width = 36
cam.location = (8, -14, 17)
d = bpy.data.objects.new('t', None); d.location = (-.5, 0, .8); sc.collection.objects.link(d)
c = cam.constraints.new('TRACK_TO'); c.target = d; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
