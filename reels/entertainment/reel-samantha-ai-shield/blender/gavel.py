# Judge's gavel + sound block: 14 transparent frames of one swing (raise -> strike -> rebound -> settle), scrubbed by t on the page.
# The gavel pivots about the handle end; angle is the keyframe. Frame 6 is the strike (head on the block).
# Run: python3 blender/gavel.py   env: SPP RES
import bpy, math, os, sys, mathutils
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(H)
sys.path.insert(0, os.path.join(ROOT, '../../tech/reel-ai-trading-pipeline/blender'))
from common import setup, mat, area, cam_persp, bev
W, Hh = [int(v) for v in os.environ.get('RES', '560x600').split('x')]; SPP = int(os.environ.get('SPP', 14))
OUT = os.path.join(ROOT, 'site/3d'); os.makedirs(OUT, exist_ok=True)
def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (1,)
sc = setup((W, Hh), SPP); sc.view_settings.view_transform = 'AgX'
wood = mat('wood', srgb('#6b3a1e'), 0, .38); dark = mat('dark', srgb('#3b1f10'), 0, .45); brass = mat('brass', srgb('#e0a526'), 1, .22)
def cyl(r, d, loc, rot, m, bevel=.02):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, rotation=rot, vertices=48); o = bpy.context.object; o.data.materials.append(m)
    bpy.ops.object.shade_smooth(); bev(o, bevel, 3); return o
# sound block: round walnut disc with a brass rim
cyl(.78, .34, (0, 0, .17), (0, 0, 0), dark, .04); cyl(.8, .06, (0, 0, .06), (0, 0, 0), brass, .01)
P = (1.7, 0, .64); piv = bpy.data.objects.new('pivot', None); sc.collection.objects.link(piv); piv.location = P
head = cyl(.3, 1.0, (0, 0, 0), (math.pi / 2, 0, 0), wood, .035); head.location = (P[0] - 1.7, 0, P[1] + P[2])
bands = [cyl(.31, .07, (P[0] - 1.7, dy, P[2]), (math.pi / 2, 0, 0), brass, .008) for dy in (-.42, .42)]
handle = cyl(.07, 1.75, (P[0] - .85, 0, P[2]), (0, math.pi / 2, 0), wood, .015)
for o in [head, handle] + bands: o.parent = piv; o.matrix_parent_inverse = piv.matrix_world.inverted()
bpy.ops.mesh.primitive_plane_add(size=9, location=(0, 0, 0)); sc.objects[-1].is_shadow_catcher = True
area((-2.2, -3, 4.2), (math.radians(40), 0, math.radians(-30)), 3.4, 420, (1, .93, .82))
area((3, -1.5, 2.2), (math.radians(60), 0, math.radians(110)), 2.4, 160, (.6, .9, 1))
cam_persp(sc, (0.4, -6.2, 2.7), (0.5, 0, 1.15), 48)
ANG = [62, 61, 54, 40, 24, 9, 0, 11, 17, 11, 5, 1.5, 0, 0]
for i, a in enumerate(ANG):
    piv.rotation_euler = (0, math.radians(a), 0); sc.render.filepath = f'{OUT}/gavel_{i:02d}.png'; bpy.ops.render.render(write_still=True); print('frame', i, flush=True)
