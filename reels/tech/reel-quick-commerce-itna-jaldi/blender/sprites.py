"""Transparent sprites / small plates for 'Itna jaldi kaise?' (Neon Dispatch).
   python3 blender/sprites.py <scooter|pouch|phone|bag|doorstep> out.png [spp]
Library models only (assets/models/procedural). Lit by the reel's three colours: orange (order), violet (store), lime (stock).
`phone` also writes out.json with the projected screen-quad corners so the page can map a DOM screen onto it (CSS homography)."""
import bpy, sys, os, math, json, mathutils
from bpy_extras.object_utils import world_to_camera_view
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'assets', 'models', 'tools')); from load_model import place
what, out = sys.argv[1], sys.argv[2]; SPP = int(sys.argv[3]) if len(sys.argv) > 3 else 32
ORANGE, VIOLET, LIME, PINK = (255, 106, 26), (123, 77, 255), (198, 255, 26), (255, 45, 122)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = SPP; sc.cycles.device = 'CPU'; sc.cycles.use_denoising = True
sc.render.threads_mode = 'FIXED'; sc.render.threads = 3; sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - High Contrast'
sc.render.film_transparent = (what != 'doorstep'); sc.render.image_settings.color_mode = 'RGBA'
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (.02, .02, .06, 1); bg.inputs[1].default_value = .6
def light(kind, loc, rgb, energy, size=1.0, look=None):
    d = bpy.data.lights.new('l', kind); d.energy = energy; d.color = [x / 255 for x in rgb]
    if kind == 'AREA': d.size = size
    o = bpy.data.objects.new('l', d); o.location = loc; sc.collection.objects.link(o)
    if look is not None:
        t = bpy.data.objects.new('t', None); t.location = look; sc.collection.objects.link(t); c = o.constraints.new('TRACK_TO'); c.target = t; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    return o
def camera(loc, look, lens=50, W=1000, H=1000):
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = lens; cam.data.sensor_width = 36; cam.location = loc
    t = bpy.data.objects.new('ct', None); t.location = look; sc.collection.objects.link(t); c = cam.constraints.new('TRACK_TO'); c.target = t; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
    sc.render.resolution_x, sc.render.resolution_y = W, H; return cam
def mat(name, rgb, rough=.5, emit=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; c = [(x / 255) ** 2.2 for x in rgb]
    b.inputs['Base Color'].default_value = (*c, 1); b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*c, 1); b.inputs['Emission Strength'].default_value = emit
    return m
def box(size, loc, m):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2); bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m); return o
def rim(look, k=1.0):
    light('AREA', (look[0] + 2.2, look[1] - 1.5, look[2] + .8), ORANGE, 260 * k, 1.6, look); light('AREA', (look[0] - 2.4, look[1] - 1.2, look[2] + .6), VIOLET, 320 * k, 1.8, look)
    light('AREA', (look[0], look[1] - 2.2, look[2] + 2.0), (210, 220, 255), 150 * k, 2.0, look); light('POINT', (look[0] + .2, look[1] + 1.4, look[2] + .5), LIME, 120 * k)
if what == 'scooter':
    r = place('procedural/delivery_scooter', rot_z=0, height=1.3)     # scooter faces +x in model space? we render side-on from -y
    camera((0.0, -3.4, 0.62), (0, 0, 0.62), 50, 1500, 1000); rim((0, 0, .6), 1.7)
    bpy.ops.mesh.primitive_plane_add(size=0.01, location=(0, 0, -5))
elif what == 'pouch':
    r = place('procedural/milk_pouch', rot_z=-18, height=.3); r.rotation_euler = (math.radians(8), math.radians(-6), math.radians(-18))
    camera((0.0, -0.5, .17), (0, 0, .15), 50, 800, 800); rim((0, 0, .15), .12)
elif what == 'bag':
    r = place('procedural/delivery_bag', rot_z=-25, height=.55)
    camera((0.0, -1.3, .45), (0, 0, .25), 50, 900, 900); rim((0, 0, .25), .5)
elif what == 'phone':
    r = place('procedural/smartphone', rot_z=0, height=.147)
    bpy.context.view_layer.update(); meshes = [o for o in bpy.data.objects if o.type == 'MESH']; scr = [o for o in meshes if o.name == 'screen'][0]
    for s in scr.material_slots:
        b = s.material.node_tree.nodes['Principled BSDF']; b.inputs['Emission Strength'].default_value = 0; b.inputs['Base Color'].default_value = (.01, .01, .02, 1)
    sy = sum((scr.matrix_world @ v.co).y for v in scr.data.vertices) / len(scr.data.vertices); fy = sum((o.matrix_world @ mathutils.Vector(c)).y for o in meshes if o.name == 'frame' for c in o.bound_box) / 8
    side = 1 if sy > fy else -1
    r.rotation_euler = (math.radians(-8), 0, math.radians(14 if side < 0 else -14)); r.location = (0, 0, 0)
    cam = camera((0, side * .30, .075), (0, 0, .075), 50, 900, 1500); rim((0, 0, .075), .05)
    bpy.context.view_layer.update()
    pts = []
    for v in scr.data.vertices:
        p = world_to_camera_view(sc, cam, scr.matrix_world @ v.co); pts.append((p.x * sc.render.resolution_x, (1 - p.y) * sc.render.resolution_y))
    tl = min(pts, key=lambda p: p[0] + p[1]); br = max(pts, key=lambda p: p[0] + p[1]); tr = max(pts, key=lambda p: p[0] - p[1]); bl = min(pts, key=lambda p: p[0] - p[1])
    json.dump(dict(tl=tl, tr=tr, br=br, bl=bl, w=900, h=1500), open(out.replace('.png', '.json'), 'w'))
elif what == 'doorstep':
    W, H = 1080, 1920; wall = mat('wall', (24, 20, 52), .55); door = mat('door', (40, 30, 90), .35); step = mat('step', (60, 55, 95), .5); floor = mat('fl', (14, 14, 28), .25)
    box((9, .3, 8), (0, 1.0, 3.6), wall); box((2.1, .12, 3.4), (0, .84, 1.7), door); box((2.7, 1.1, .22), (0, .2, .11), step); box((12, 8, .1), (0, -2.5, -.05), floor)
    box((.18, .18, .5), (-2.0, .8, 2.3), mat('lamp', ORANGE, .4, 14)); box((.07, .07, 3.3), (1.25, .8, 1.7), mat('ed', LIME, .4, 7)); box((.07, .07, 3.3), (-1.25, .8, 1.7), mat('ed2', LIME, .4, 7))
    box((.5, .05, .22), (1.55, .8, 1.3), mat('bell', VIOLET, .3, 10))
    cam = camera((0, -7.5, 1.9), (0, 0, 1.55), 34, W, H)
    light('POINT', (-2.0, .1, 2.4), ORANGE, 900); light('AREA', (3, -3, 2.5), VIOLET, 900, 3, (0, 0, 1)); light('AREA', (-1, -2, 4), LIME, 200, 3, (0, 0, .3))
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
