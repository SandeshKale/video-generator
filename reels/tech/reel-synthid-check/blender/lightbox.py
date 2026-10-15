# Blender lightbox for the SynthID reel: a glass slab (a "photo" printed dark) on a cream table; a lamp bar slides over it on a
# rail, and a hidden dot pattern inside the slab glows only where the lamp's light band is (the hold-it-to-the-light idea).
# Frames b00..bNN: lamp x from left to right, pattern emission follows the band. Pure function of frame index (used by t).
#   python3 lightbox.py <out_dir> [frames=24] [samples=14]
import bpy, math, sys, os, random, mathutils
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'reel-morning-brief', 'blender'))
from common import setup, mat, area, bev, cam_persp

out = sys.argv[1]; N = int(sys.argv[2]) if len(sys.argv) > 2 else 24; SAMPLES = int(sys.argv[3]) if len(sys.argv) > 3 else 14
os.makedirs(out, exist_ok=True)
sc = setup(res=(900, 760), samples=SAMPLES)
sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.95, 0.91, 0.80, 1)
sc.world.node_tree.nodes['Background'].inputs[1].default_value = .55

def hexc(h, a=1):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c) + (a,)
def emit(name, col, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = col; e.inputs[1].default_value = strength
    o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m, e
M = dict(table=mat('table', hexc('#e9dfc3'), rough=.7), slab=mat('slab', hexc('#13243d'), rough=.18), frame=mat('frame', hexc('#0e6b5a'), rough=.35),
         brass=mat('brass', hexc('#c9962b'), metal=.9, rough=.28), rail=mat('rail', hexc('#2b3a52'), rough=.4))
lamp_m, lamp_e = emit('lamp', (1, .93, .72, 1), 4.0)

def box(loc, size, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(m)
    if bevel: bev(o, bevel, 3)
    return o
SW, SH, ST = 6.0, 4.0, .28                # slab width (x), depth (y), thickness
box((0, 0, -.2), (13, 9, .4), M['table'])                    # table
box((0, 0, ST / 2), (SW + .5, SH + .5, ST), M['frame'], .06)  # frame under the slab
slab = box((0, 0, ST + .1), (SW, SH, .2), M['slab'], .04)     # the dark "photo"
# hidden pattern: a field of small dots (emissive) laid just above the slab; each dot gets its own material so strength can vary by x
random.seed(5); dots = []
for j in range(11):
    for i in range(17):
        x = (i - 8) * .34 + (.17 if j % 2 else 0); y = (j - 5) * .34
        if abs(x) > SW / 2 - .25 or abs(y) > SH / 2 - .2: continue
        bpy.ops.mesh.primitive_uv_sphere_add(radius=.06, location=(x, y, ST + .21), segments=10, ring_count=6); d = bpy.context.object
        m = bpy.data.materials.new('d%d' % len(dots)); m.use_nodes = True; pb = m.node_tree.nodes['Principled BSDF']
        pb.inputs['Base Color'].default_value = hexc('#13243d'); pb.inputs['Roughness'].default_value = .18
        pb.inputs['Emission Color'].default_value = hexc('#7fd0e6'); pb.inputs['Emission Strength'].default_value = 0.0
        d.data.materials.append(m); dots.append((d, pb.inputs['Emission Strength'], x))
# the lamp: a bright bar on a rail above the slab (visible) + an area light that follows it
rail = box((0, SH / 2 + .45, 1.55), (SW + 3.4, .12, .12), M['rail'])
bar = box((0, 0, 1.5), (.55, SH + 1.0, .22), lamp_m, .05)
carr = box((0, SH / 2 + .45, 1.5), (.7, .22, .3), M['brass'], .04)
bpy.ops.object.light_add(type='AREA', location=(0, 0, 1.9)); L = bpy.context.object; L.data.size = .6; L.data.size_y = SH + 1.0; L.data.energy = 380; L.data.color = (1, .9, .7)
area((-5, -6, 8), (math.radians(40), 0, math.radians(-35)), 8, 380); area((6, -3, 5), (math.radians(60), 0, math.radians(55)), 5, 160)
cam_persp(sc, (1.6, -7.4, 5.2), (0.0, 0.1, 0.5), lens=40)

def ease(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
for f in ([int(x) for x in os.environ['ONLY'].split(',')] if os.environ.get('ONLY') else range(N)):
    p = f / (N - 1); lx = -SW / 2 - 1.2 + ease(p) * (SW + 2.4)
    bar.location.x = lx; L.location.x = lx; carr.location.x = lx
    for (d, e, x) in dots:
        k = math.exp(-((x - lx) / 1.05) ** 2)              # soft band around the lamp
        e.default_value = 9.0 * k
    sc.render.filepath = os.path.join(out, f'b{f:02d}.png'); bpy.ops.render.render(write_still=True); print('frame', f, flush=True)
print('BOXDONE', flush=True)
