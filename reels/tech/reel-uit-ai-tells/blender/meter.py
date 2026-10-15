# "AI-O-METER": a brushed-aluminium analog VU-style meter (glass window, cream dial with a green → amber → red arc, black needle,
# a red "tell" lamp and two knobs). Frames m00..m(N-1): needle from the green end (plain human writing) to the red end (AI tells);
# the lamp lights in the red zone. The page picks a frame by value v in [0,1], so the needle moves as a pure function of t.
# Also writes ../site/3d/meter.json with projected anchor points (dial label spots) for DOM labels.
#   blender -b -P meter.py -- [N=17] [spp=24]
import bpy, math, sys, os, json, mathutils
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, os.path.dirname(__file__)); from common import setup, mat, area, bev, cam_persp
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
N = int(argv[0]) if argv else 17; SPP = int(argv[1]) if len(argv) > 1 else 24
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', '3d'); os.makedirs(OUT, exist_ok=True)
def srgb(h): h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return tuple(((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92 for v in c) + (1,)
def emis(name, col, s):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = srgb(col)
    b.inputs['Emission Color'].default_value = srgb(col); b.inputs['Emission Strength'].default_value = s; return m, b
def cube(loc, size, m, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot); o = bpy.context.object; o.scale = size; o.data.materials.append(m)
    if bevel: bev(o, bevel, 3)
    return o
sc = setup(res=(900, 760), samples=SPP)
sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.55, 0.58, 0.62, 1); sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.35
alu = mat('alu', srgb('#c3c8ce'), metal=0.92, rough=0.3); dark = mat('dark', srgb('#17191c'), metal=0.4, rough=0.45)
dial = mat('dial', srgb('#efe8d6'), rough=0.6); ink = mat('ink', srgb('#1b1b1b'), rough=0.5); knob = mat('knob', srgb('#1d2024'), metal=0.3, rough=0.35)
glass = bpy.data.materials.new('glass'); glass.use_nodes = True; gb = glass.node_tree.nodes['Principled BSDF']
gb.inputs['Base Color'].default_value = (1, 1, 1, 1); gb.inputs['Roughness'].default_value = 0.04; gb.inputs['Transmission Weight'].default_value = 1.0; gb.inputs['IOR'].default_value = 1.45; gb.inputs['Alpha'].default_value = 0.18
W, H, D = 3.4, 2.4, 0.9
cube((0, 0, 0), (W, D, H), alu, 0.08)                                    # body
cube((0, -D / 2 - 0.01, 0.25), (W - 0.5, 0.04, H - 1.0), dark, 0.04)     # window bezel
cube((0, -D / 2 - 0.02, 0.25), (W - 0.7, 0.03, H - 1.2), dial, 0.02)     # dial plate
PV = (0, -D / 2 - 0.06, -0.38)                                           # needle pivot (bottom centre of the dial)
R = 1.05; ZONES = [('#37c26b', -50, -12), ('#f2b233', -12, 12), ('#ff4d3d', 12, 50)]
for col, a0, a1 in ZONES:                                                # coloured arc made of small segments
    zm = mat('z' + col, srgb(col), rough=0.5)
    for k in range(10):
        a = math.radians(a0 + (a1 - a0) * (k + .5) / 10)
        cube((PV[0] + R * math.sin(a), PV[1] + 0.005, PV[2] + R * math.cos(a)), (0.1, 0.01, 0.07), zm, rot=(0, a, 0))
for k in range(11):                                                      # tick marks
    a = math.radians(-50 + 10 * k); r2 = R - 0.14
    cube((PV[0] + r2 * math.sin(a), PV[1] + 0.004, PV[2] + r2 * math.cos(a)), (0.015, 0.01, 0.12 if k % 5 == 0 else 0.07), ink, rot=(0, a, 0))
bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.05, location=(PV[0], PV[1] - 0.01, PV[2]), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(dark)
cube((0, -D / 2 - 0.08, 0.25), (W - 0.7, 0.02, H - 1.2), glass)          # glass
for x in (-0.9, 0.9):                                                    # knobs
    bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=0.2, location=(x, -D / 2 - 0.1, -0.88), rotation=(math.pi / 2, 0, 0)); o = bpy.context.object; o.data.materials.append(knob); bev(o, 0.03, 2)
lamp_m, lamp_b = emis('lamp', '#ff4d3d', 0.0)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=(0, -D / 2 - 0.05, -0.88)); bpy.context.object.data.materials.append(lamp_m)
cube((0, -D / 2 - 0.02, -0.88), (0.36, 0.02, 0.36), dark, 0.03)
needle = cube((0, 0, 0), (0.03, 0.02, 1.0), ink)                          # needle, pivoted via an empty
bpy.ops.object.empty_add(location=PV); piv = bpy.context.object
needle.parent = piv; needle.location = (0, -0.03, 0.5)
area((-4, -6, 5), (math.radians(50), 0, math.radians(-35)), 6, 700); area((5, -4, 2), (math.radians(70), 0, math.radians(50)), 4, 280)
area((0, 3, 4), (math.radians(-40), 0, 0), 5, 300)
cam_persp(sc, (1.4, -8.6, 2.2), (0, 0, 0.0), lens=52)
bpy.context.view_layer.update()
def proj(p):
    v = world_to_camera_view(sc, sc.camera, mathutils.Vector(p)); return [round(v.x, 4), round(1 - v.y, 4)]
anchors = {'pivot': proj(PV), 'green': proj((PV[0] + (R + .28) * math.sin(math.radians(-40)), PV[1], PV[2] + (R + .28) * math.cos(math.radians(-40)))),
           'red': proj((PV[0] + (R + .28) * math.sin(math.radians(40)), PV[1], PV[2] + (R + .28) * math.cos(math.radians(40)))),
           'plate': proj((0, -D / 2, 0.98)), 'lamp': proj((0, -D / 2, -0.88))}
json.dump(anchors, open(os.path.join(OUT, 'meter.json'), 'w'))
ONLY = [int(x) for x in os.environ.get('ONLY', '').split(',') if x]
for f in (ONLY or range(N)):
    v = f / (N - 1); a = math.radians(-50 + 100 * v)
    piv.rotation_euler = (0, a, 0); lamp_b.inputs['Emission Strength'].default_value = 12.0 * max(0, (v - 0.62) / 0.38)
    sc.render.filepath = os.path.join(OUT, f'm{f:02d}.png'); bpy.ops.render.render(write_still=True); print('frame', f, flush=True)
print('METERDONE', flush=True)
