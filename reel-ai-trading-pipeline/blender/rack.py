# "Patch Bay" rack: 4 eurorack-style modules (BRAIN · SIGNAL · HANDS · SUPERVISOR) on aluminium rails, joined by meaning-coded
# patch cables. STATE n (0..4) = modules 1..n powered (LED on) and cables 1..n plugged. Renders site/3d/rack_<n>.png.
# Run: python3 blender/rack.py "0,2,4" [spp]
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(__file__)); from common import setup, mat, area, bev, cam_persp
STATES = [int(x) for x in (sys.argv[1] if len(sys.argv) > 1 else '0,4').split(',')]; SPP = int(sys.argv[2]) if len(sys.argv) > 2 else 40
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', '3d'); os.makedirs(OUT, exist_ok=True); FONT = '/tmp/bf/ChakraPetch-Bold.ttf'
def srgb(h): h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return tuple(((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92 for v in c) + (1,)
NAMES = ['BRAIN', 'SIGNAL', 'HANDS', 'SUPERVISOR']; CAB = ['#2f7bff', '#ff8a00', '#ff3b3b', '#7ee02a']
def emis(name, col, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = srgb(col)
    b.inputs['Emission Color'].default_value = srgb(col); b.inputs['Emission Strength'].default_value = strength; return m
for STATE in STATES:
    sc = setup(res=(1000, 820), samples=SPP)
    alu = mat('alu', srgb('#c9ced4'), metal=0.9, rough=0.32); rail = mat('rail', srgb('#9aa1a8'), metal=0.95, rough=0.25)
    back = mat('back', srgb('#141619'), metal=0.2, rough=0.7); ink = mat('ink', srgb('#121417'), rough=0.5); knobm = mat('knob', srgb('#1b1e22'), metal=0.3, rough=0.35)
    jackm = mat('jack', srgb('#b9bec4'), metal=1.0, rough=0.2); hole = mat('hole', srgb('#050506'), rough=0.9); ledoff = mat('ledoff', srgb('#3a2a2a'), rough=0.3)
    font = bpy.data.fonts.load(FONT)
    W, Hh, G = 1.05, 3.0, 0.08; X0 = -(4 * W + 3 * G) / 2
    bpy.ops.mesh.primitive_cube_add(size=1); b0 = bpy.context.object; b0.scale = (4 * W + 3 * G + 0.5, 0.2, Hh + 0.7); b0.location = (0, 0.18, 0); b0.data.materials.append(back)
    for z in (Hh / 2 + 0.12, -Hh / 2 - 0.12):
        bpy.ops.mesh.primitive_cube_add(size=1); r = bpy.context.object; r.scale = (4 * W + 3 * G + 0.4, 0.12, 0.2); r.location = (0, 0.02, z); r.data.materials.append(rail); bev(r, 0.02, 2)
    jacks = []
    for i in range(4):
        cx = X0 + W / 2 + i * (W + G)
        bpy.ops.mesh.primitive_cube_add(size=1); p = bpy.context.object; p.scale = (W, 0.06, Hh); p.location = (cx, 0, 0); p.data.materials.append(alu); bev(p, 0.02, 2)
        def txt(s, size, z, m=ink):
            cu = bpy.data.curves.new('t', 'FONT'); cu.body = s; cu.font = font; cu.size = size; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'; cu.extrude = 0.004
            o = bpy.data.objects.new('t', cu); sc.collection.objects.link(o); o.data.materials.append(m); o.location = (cx, -0.035, z); o.rotation_euler = (math.pi / 2, 0, 0)
            bpy.context.view_layer.update()
            if o.dimensions.x > W * 0.86: f = W * 0.86 / o.dimensions.x; o.scale = (f, f, f)
            return o
        txt(str(i + 1), 0.34, Hh / 2 - 0.32); txt(NAMES[i], 0.2, Hh / 2 - 0.62)
        on = i < STATE
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(cx, -0.05, Hh / 2 - 0.86)); led = bpy.context.object; led.data.materials.append(emis('led%d' % i, CAB[i], 9.0) if on else ledoff)
        for k, z in enumerate((0.38, -0.32)):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.2, depth=0.16, location=(cx, -0.1, z), rotation=(math.pi / 2, 0, 0)); kn = bpy.context.object; kn.data.materials.append(knobm); bev(kn, 0.02, 2)
            ang = math.radians((-120 + (200 if on else 30) * (0.55 + 0.3 * k)))
            bpy.ops.mesh.primitive_cube_add(size=1); pt = bpy.context.object; pt.scale = (0.025, 0.02, 0.14); pt.location = (cx + 0.08 * math.sin(ang), -0.19, z + 0.08 * math.cos(ang)); pt.rotation_euler = (0, -ang, 0); pt.data.materials.append(alu)
        for k, z in enumerate((-0.95, -1.25)):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.085, depth=0.06, location=(cx + (-0.22 if k == 0 else 0.22), -0.06, z), rotation=(math.pi / 2, 0, 0)); jk = bpy.context.object; jk.data.materials.append(jackm)
            bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=0.07, location=(cx + (-0.22 if k == 0 else 0.22), -0.075, z), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(hole)
            jacks.append((cx + (-0.22 if k == 0 else 0.22), z))
    # cables: module i OUT (right jack, upper row) -> module i+1 IN (left jack, lower row); cable 4 loops from SUPERVISOR back up to BRAIN (approval)
    def cable(a, b, col, sag):
        cu = bpy.data.curves.new('c', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.035; cu.bevel_resolution = 4
        sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
        pts = [(a[0], -0.16, a[1]), ((a[0] + b[0]) / 2, -0.55, min(a[1], b[1]) - sag), (b[0], -0.16, b[1])]
        for j, p in enumerate(pts): bp = sp.bezier_points[j]; bp.co = p; bp.handle_left_type = bp.handle_right_type = 'AUTO'
        o = bpy.data.objects.new('c', cu); sc.collection.objects.link(o); o.data.materials.append(emis('cab', col, 0.6))
        for p in (pts[0], pts[2]):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.18, location=(p[0], -0.14, p[2]), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(knobm)
    for i in range(STATE):
        if i < 3: cable(jacks[2 * i + 1], jacks[2 * (i + 1)], CAB[i], 0.55 + 0.1 * i)   # module i OUT (right) -> module i+1 IN (left)
        else: cable(jacks[7], jacks[0], CAB[3], 1.15)                                   # SUPERVISOR -> BRAIN: the approval loop
    area((-3, -6, 5), (math.radians(50), 0, math.radians(-25)), 6, 900); area((5, -4, 1), (math.radians(80), 0, math.radians(55)), 4, 320, (0.85, 0.9, 1)); area((0, 3, 5), (math.radians(-45), 0, 0), 5, 200)
    cam_persp(sc, (1.2, -9.6, 1.6), (0, 0, -0.25), lens=50)
    sc.render.filepath = os.path.join(OUT, 'rack_%d.png' % STATE); bpy.ops.render.render(write_still=True)
print('done', STATES)
