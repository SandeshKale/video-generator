"""Cold-lit dark-store aisle plate for 'Itna jaldi kaise?' (mockup scene C).
    python3 blender/aisle.py out.png [w h samples]
Library props only: assets/models/polyhaven (steel shelves, crates, cardboard), plus procedural milk-pack boxes (box primitives) coloured with the reel's code:
blue = store, yellow = shelf, green = pack. Frosted-white light, cold-chain palette; camera at the aisle mouth looking toward the dispatch shutter."""
import bpy, sys, os, math, random
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'assets', 'models', 'tools')); from load_model import place
out = sys.argv[1]; W = int(sys.argv[2]) if len(sys.argv) > 2 else 540; Hh = int(sys.argv[3]) if len(sys.argv) > 3 else 960; SPP = int(sys.argv[4]) if len(sys.argv) > 4 else 24
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = SPP; sc.cycles.device = 'CPU'; sc.cycles.use_denoising = True
sc.render.threads_mode = 'FIXED'; sc.render.threads = 2; sc.render.resolution_x, sc.render.resolution_y = W, Hh; sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'; sc.view_settings.exposure = -1.3
def mat(name, rgb, rough=.5, metal=0, emit=0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    c = [x / 255 for x in rgb]; c = [x ** 2.2 for x in c]; b.inputs['Base Color'].default_value = (*c, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emit: b.inputs['Emission Color'].default_value = (*c, 1); b.inputs['Emission Strength'].default_value = emit
    return m
def box(name, size, loc, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2); bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m); return o
# world: soft cold white
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (.86, .93, .96, 1); bg.inputs[1].default_value = .18
AL = 14.0                                                  # aisle length (m), along +Y; camera at y = -1, shutter at y = AL
floor = mat('floor', (150, 168, 178), .22); wall = mat('wall', (205, 219, 226), .7); shut = mat('shutter', (176, 190, 198), .45, .6)
box('floor', (6, AL + 4, .1), (0, AL / 2, -.05), floor); box('ceil', (6, AL + 4, .1), (0, AL / 2, 3.2), wall)
box('back', (6, .1, 3.2), (0, AL + .8, 1.6), shut)
for i in range(16): box('rib', (3.6, .03, .06), (0, AL + .72, .3 + i * .17), mat('rib', (150, 164, 173), .4, .7))
box('wallL', (.1, AL + 4, 3.2), (-3, AL / 2, 1.6), wall); box('wallR', (.1, AL + 4, 3.2), (3, AL / 2, 1.6), wall)
# floor markings: yellow dispatch line + blue/green lane edges
box('line_dispatch', (3.2, .22, .012), (0, AL - 1.1, .005), mat('y', (255, 194, 26), .5)); box('lane_l', (.08, AL, .012), (-.95, AL / 2, .005), mat('b', (31, 111, 255), .5)); box('lane_r', (.08, AL, .012), (.95, AL / 2, .005), mat('g', (23, 178, 106), .5))
# lights: long cold strips + a warm accent at the dispatch end
for k in range(7):
    ly = 1.0 + k * 2.1; l = bpy.data.objects.new(f'strip{k}', bpy.data.lights.new(f'strip{k}', 'AREA')); l.data.energy = 380; l.data.size = 2.2; l.data.size_y = .25; l.data.color = (.86, .94, 1); l.location = (0, ly, 3.1); l.rotation_euler = (0, 0, 0); sc.collection.objects.link(l)
    box(f'tube{k}', (2.2, .22, .04), (0, ly, 3.15), mat('tube', (240, 250, 255), .3, 0, 6))
# shelving bays both sides (assets/models polyhaven steel shelves), then stock
random.seed(11)
packs = [mat('pk_blue', (31, 111, 255), .45), mat('pk_white', (238, 244, 247), .5), mat('pk_yel', (255, 194, 26), .45), mat('pk_grn', (23, 178, 106), .45), mat('pk_red', (255, 59, 31), .45)]
SH = 2.15
for side in (-1, 1):
    for b in range(5):
        y = 2.2 + b * 2.35; root = place('polyhaven/steel_frame_shelves_01', loc=(side * 1.55, y, 0), rot_z=(90 if side < 0 else -90), height=SH)
        for lvl in range(5):                                   # procedural milk packs / boxes on five levels, denser toward the dispatch end
            z0 = .08 + lvl * .42
            for j in range(7):
                if random.random() < (.55 + .06 * b):
                    sx, sy, sz = .16 + random.random() * .06, .09, .2 + random.random() * .05
                    box('pack', (sy, sx, sz), (side * (1.43 + random.random() * .1), y - 1.0 + j * .3 + random.random() * .05, z0 + sz / 2 + .02), random.choice(packs))
# camera: aisle mouth, eye level 1.35 m, looking at the dispatch shutter
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = 24; cam.data.sensor_width = 36
cam.location = (0, -1.2, 1.35); cam.rotation_euler = (math.radians(86), 0, 0)
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
