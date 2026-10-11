# SANDESH letterpress type block that cracks into two token blocks: SAND (peach) | ESH (mint).
# Renders a frame sequence site/3d/sand_00..NN.png scrubbed by t in the reel (0 = joined, last = split).
# Run: python3 blender/typeblock.py [nframes] [samples]
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(__file__)); from common import setup, mat, area, bev, cam_persp, shadow_floor
N = int(sys.argv[1]) if len(sys.argv) > 1 else 12; SPP = int(sys.argv[2]) if len(sys.argv) > 2 else 48
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', '3d'); os.makedirs(OUT, exist_ok=True)
FONT = '/tmp/bf/AlfaSlabOne.ttf'
def srgb(h): h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return tuple(((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92 for v in c) + (1,)
sc = setup(res=(1000, 640), samples=SPP)
lead = mat('lead', srgb('#5d6066'), metal=0.85, rough=0.38); lead_dk = mat('leaddk', srgb('#3a3c41'), metal=0.8, rough=0.45)
inks = {'SAND': mat('peach', srgb('#ffad73'), rough=0.6), 'ESH': mat('mint', srgb('#5fd6b0'), rough=0.6)}
font = bpy.data.fonts.load(FONT)
def block(word, x0, padL, padR):
    cu = bpy.data.curves.new(word, 'FONT'); cu.body = word; cu.font = font; cu.size = 1.0; cu.extrude = 0.07; cu.align_x = 'LEFT'; cu.align_y = 'BOTTOM'
    tx = bpy.data.objects.new(word, cu); sc.collection.objects.link(tx); tx.data.materials.append(inks[word]); bpy.context.view_layer.update()
    w, h = tx.dimensions.x, tx.dimensions.y; pad = 0.16; bw = w + padL + padR
    bpy.ops.mesh.primitive_cube_add(size=1); b = bpy.context.object; b.scale = (bw, h + pad * 2, 0.62); b.location = (x0 + bw / 2, 0, 0.31)
    b.data.materials.append(lead); bev(b, 0.04, 3)
    # nick (the groove on a real type sort) on the front face
    bpy.ops.mesh.primitive_cube_add(size=1); n = bpy.context.object; n.scale = (bw + .002, 0.03, 0.05); n.location = (b.location.x, -(h + pad * 2) / 2 - 0.005, 0.2); n.data.materials.append(lead_dk)
    tx.location = (x0 + padL, -h / 2, 0.62 + 0.035)
    root = bpy.data.objects.new(word + '_root', None); sc.collection.objects.link(root)
    for o in (b, n, tx): o.parent = root
    return root, bw
rS, wS = block('SAND', 0, 0.18, 0.05); rE, wE = block('ESH', 0, 0.07, 0.18)
total = wS + wE
# place both at origin-centred layout (children were built at x0=0, so offset roots)
rS.location = (-total / 2, 0, 0); rE.location = (-total / 2 + wS, 0, 0)
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, 0)); bpy.context.object.is_shadow_catcher = True
area((-2.5, -4, 6), (math.radians(40), 0, math.radians(-25)), 5, 650)
area((4, -2, 3), (math.radians(60), 0, math.radians(60)), 3, 300, (0.9, 0.95, 1))
area((0, 4, 3), (math.radians(-60), 0, 0), 4, 250)
cam_persp(sc, (0, -6.6, 4.6), (0, 0, 0.35), lens=50)
def ease(u): return 1 - (1 - u) ** 3
for f in range(N):
    u = ease(f / max(1, N - 1))
    rS.location = (-total / 2 - 0.42 * u, -0.05 * u, 0.0); rS.rotation_euler = (0, 0, math.radians(5 * u))
    rE.location = (-total / 2 + wS + 0.42 * u, 0.12 * u, 0.0); rE.rotation_euler = (0, 0, math.radians(-7 * u))
    sc.render.filepath = os.path.join(OUT, 'sand_%02d.png' % f); bpy.ops.render.render(write_still=True)
print('done', N)
