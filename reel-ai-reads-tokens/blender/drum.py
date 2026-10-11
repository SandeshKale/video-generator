# Next-token drum: a 12-sided letterpress drum, each face carries one token sort. 24 frames = one full turn (15 deg/frame).
# Face i is square to camera at frame 2*i. Renders site/3d/drum_00..23.png. Run: python3 blender/drum.py [frames] [spp]
import bpy, math, sys, os, bmesh
sys.path.insert(0, os.path.dirname(__file__)); from common import setup, mat, area, bev, cam_persp
NF = int(sys.argv[1]) if len(sys.argv) > 1 else 24; SPP = int(sys.argv[2]) if len(sys.argv) > 2 else 24
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', '3d'); FONT = '/tmp/bf/AlfaSlabOne.ttf'
TOK = ['It', ' writes', ' one', ' token', ' at', ' a', ' time', ' cat', ' rhyme', ' piece', ' word', ' next']
def srgb(h): h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return tuple(((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92 for v in c) + (1,)
sc = setup(res=(900, 760), samples=SPP)
lead = mat('lead', srgb('#5d6066'), metal=0.85, rough=0.38); axle = mat('axle', srgb('#2a2b30'), metal=0.9, rough=0.3)
inks = [mat('i%d' % i, srgb(c), rough=0.6) for i, c in enumerate(['#ffad73', '#5fd6b0', '#a493ff', '#6fbff5'])]
font = bpy.data.fonts.load(FONT)
R = 1.25; L = 3.4; root = bpy.data.objects.new('drum', None); sc.collection.objects.link(root)
bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=R, depth=L, rotation=(0, math.pi / 2, 0)); cyl = bpy.context.object; cyl.data.materials.append(lead); bev(cyl, 0.03, 2); cyl.parent = root
cyl.rotation_mode = 'ZYX'; cyl.rotation_euler = (0, math.pi / 2, math.radians(15))  # spin about its own axis first: a flat face looks at -Y
for side in (-1, 1):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.22, depth=0.5, location=(side * (L / 2 + 0.2), 0, 0), rotation=(0, math.pi / 2, 0)); a = bpy.context.object; a.data.materials.append(axle); a.parent = root
apo = R * math.cos(math.pi / 12)
for i, tk in enumerate(TOK):
    cu = bpy.data.curves.new('t%d' % i, 'FONT'); cu.body = tk.strip(); cu.font = font; cu.size = 0.42; cu.extrude = 0.05; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'
    ob = bpy.data.objects.new('t%d' % i, cu); sc.collection.objects.link(ob); ob.data.materials.append(inks[i % 4])
    ang = i * 2 * math.pi / 12   # face i sits at +ang; a drum rotation of +ang about X brings it to the front
    ob.location = (0, -(apo + 0.05) * math.cos(ang), (apo + 0.05) * math.sin(ang))
    ob.rotation_euler = (math.pi / 2 - ang, 0, 0); ob.parent = root
    bpy.context.view_layer.update()
    if ob.dimensions.x > L * 0.86: s = L * 0.86 / ob.dimensions.x; ob.scale = (s, s, s)
area((-3, -5, 5), (math.radians(45), 0, math.radians(-30)), 5, 700); area((4, -3, 1), (math.radians(80), 0, math.radians(60)), 3, 260, (0.9, 0.95, 1)); area((0, 3, 4), (math.radians(-50), 0, 0), 4, 250)
cam_persp(sc, (0, -6.8, 0.6), (0, 0, 0), lens=55)
for f in range(NF):
    root.rotation_euler = (math.radians(360 / NF * f), 0, 0)
    sc.render.filepath = os.path.join(OUT, 'drum_%02d.png' % f); bpy.ops.render.render(write_still=True)
print('done', NF)
