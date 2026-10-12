# Blender spreadsheet board for the Sheets reel: a 7x9 grid of cell tiles on a plum base.
# Frames 0..N-1 (scrubbed by t on the page): messy (tumbled, raised, tomato-flagged) -> tiles settle flat in a
# diagonal ripple -> a violet selection frame lands on the front row -> six front-row cells rise into bars.
#   python3 board.py <out_dir> [frames=30] [samples=16]      (bpy module; --reverse is done on the page, not here)
import bpy, math, sys, os, random, mathutils
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'reel-morning-brief', 'blender'))
from common import setup, mat, area, bev, cam_persp

out = sys.argv[1]; N = int(sys.argv[2]) if len(sys.argv) > 2 else 30; SAMPLES = int(sys.argv[3]) if len(sys.argv) > 3 else 16
os.makedirs(out, exist_ok=True)
sc = setup(res=(900, 1000), samples=SAMPLES)
sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.88, 0.84, 1.0, 1)   # lavender ambient (violet ground)
sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.65

def hexc(h, a=1):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c) + (a,)
M = dict(cell=mat('cell', hexc('#fbfdfc'), rough=0.35), head=mat('head', hexc('#e3d6ff'), rough=0.4),
         bad=mat('bad', hexc('#ff5233'), rough=0.35), base=mat('base', hexc('#23142d'), rough=0.55),
         bar=mat('bar', hexc('#ffc31a'), rough=0.3), top=mat('top', hexc('#7a3cff'), rough=0.3),
         sel=mat('sel', hexc('#7a3cff'), rough=0.3))
COLS, ROWS, P, TH = 7, 9, 1.0, 0.16   # columns (x), rows (y, row 0 = front), pitch, tile thickness
random.seed(7)
bpy.ops.mesh.primitive_cube_add(location=(0, 0, -0.18)); base = bpy.context.object
base.scale = (COLS * P / 2 + 0.35, ROWS * P / 2 + 0.35, 0.16); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); base.data.materials.append(M['base']); bev(base, 0.08, 4)

BARS = [1.4, 2.1, 1.7, 2.9, 2.4, 3.6]   # bar heights (cell units) for the six month cells, front row cols 0..5
tiles = []
for j in range(ROWS):
    for i in range(COLS):
        x = (i - (COLS - 1) / 2) * P; y = (j - (ROWS - 1) / 2) * P
        bpy.ops.mesh.primitive_cube_add(location=(x, y, TH / 2)); o = bpy.context.object
        o.scale = (0.44, 0.44, TH / 2); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); bev(o, 0.05, 3)
        head = j == ROWS - 1
        bad = (not head) and random.random() < 0.2
        for mm in (M['head'] if head else M['cell'], M['bad'], M['bar']): o.data.materials.append(mm)   # slots: 0 clean, 1 flagged, 2 bar
        # messy pose: raised, tipped, turned; header row and bar row get milder mess so the frame reads as one sheet
        k = 0.45 if head else 1.0
        mess = dict(z=random.uniform(0.15, 1.1) * k, rx=random.uniform(-28, 28) * k, ry=random.uniform(-28, 28) * k,
                    rz=random.uniform(-35, 35) * k, dx=random.uniform(-0.25, 0.25) * k, dy=random.uniform(-0.25, 0.25) * k)
        tiles.append(dict(o=o, x=x, y=y, i=i, j=j, bad=bad, mess=mess, bar=BARS[i] if (j == 0 and i < len(BARS)) else 0))

# selection frame around the six bar cells (four thin violet rails), fades in by scaling from 0
rails = []
x0 = (0 - (COLS - 1) / 2) * P - 0.5; x1 = (5 - (COLS - 1) / 2) * P + 0.5; y0 = (0 - (ROWS - 1) / 2) * P - 0.5; y1 = y0 + 1.0
for (a, b) in [((x0, y0), (x1, y0)), ((x0, y1), (x1, y1)), ((x0, y0), (x0, y1)), ((x1, y0), (x1, y1))]:
    bpy.ops.mesh.primitive_cube_add(location=((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, TH + 0.03)); r = bpy.context.object
    r.scale = (max(abs(b[0] - a[0]) / 2, 0.04), max(abs(b[1] - a[1]) / 2, 0.04), 0.03); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    r.data.materials.append(M['sel']); rails.append(r)

area((-5, -6, 9), (math.radians(40), 0, math.radians(-35)), 8, 900)
area((7, -3, 6), (math.radians(55), 0, math.radians(60)), 5, 380, (1, 0.93, 0.85))
area((0, 8, 7), (math.radians(-50), 0, 0), 6, 250, (0.85, 0.9, 1))
cam_persp(sc, (7.2, -11.5, 10.5), (0.0, -0.3, 1.1), lens=43)

def ease(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def back(u, s=1.6): u = min(1, max(0, u)); u -= 1; return u * u * ((s + 1) * u + s) + 1
for f in ([int(x) for x in os.environ['ONLY'].split(',')] if os.environ.get('ONLY') else range(N)):
    p = f / (N - 1)
    for t in tiles:
        o, m = t['o'], t['mess']
        d = (t['i'] / COLS + (ROWS - 1 - t['j']) / ROWS) / 2          # diagonal ripple order (back-left first)
        s = ease((p - 0.10 - 0.22 * d) / 0.18)                         # settle: 0 messy -> 1 flat
        jig = 0.04 * math.sin(f * 1.7 + t['i'] * 3 + t['j']) * (1 - s) # tiny idle wobble while messy
        o.location = (t['x'] + m['dx'] * (1 - s), t['y'] + m['dy'] * (1 - s), TH / 2 + m['z'] * (1 - s) + jig)
        o.rotation_euler = (math.radians(m['rx'] * (1 - s)), math.radians(m['ry'] * (1 - s)), math.radians(m['rz'] * (1 - s)))
        h = t['bar'] * back((p - 0.58 - 0.045 * t['i']) / 0.22) if t['bar'] else 0
        o.scale = (1, 1, 1 + h / TH)                                    # extrude upward (cube is centred, so lift by half)
        o.location.z += h / 2
        idx = 2 if h > 0.05 else (1 if t['bad'] and s < 0.6 else 0)    # flagged cells turn clean once settled
        for poly in o.data.polygons: poly.material_index = idx
    sel = ease((p - 0.46) / 0.08) * (1 - ease((p - 0.62) / 0.1))
    for r in rails: r.scale = (max(sel, 0.001),) * 3
    sc.render.filepath = os.path.join(out, f'b{f:02d}.png'); bpy.ops.render.render(write_still=True)
    print('frame', f, flush=True)
print('BOARDDONE', flush=True)
