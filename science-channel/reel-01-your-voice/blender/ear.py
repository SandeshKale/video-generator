# Ear/skull macro for "You've never heard YOU": air route (canal -> eardrum -> ossicles) and the bone block around the cochlea, as an X-ray plate.
# 16 camera positions (wide -> macro), transparent PNGs + projected route points per frame (the page draws the glowing routes on them).
import bpy, math, sys, os, json, mathutils
sys.path.insert(0, os.path.dirname(__file__))
from common import setup, mat
from bpy_extras.object_utils import world_to_camera_view
SPP = int(os.environ.get('SPP', 32)); NF = int(os.environ.get('NF', 16)); OUT = os.environ.get('OUT', os.path.join(os.path.dirname(__file__), '..', 'site', 'ear')); RES = (900, 900)
def srgb(h): h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return tuple(((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92 for v in c) + (1,)
def emis(name, col, s):
    m = bpy.data.materials.new(name); m.use_nodes = True; n = m.node_tree.nodes; n.clear(); e = n.new('ShaderNodeEmission'); e.inputs[0].default_value = srgb(col); e.inputs[1].default_value = s
    o = n.new('ShaderNodeOutputMaterial'); m.node_tree.links.new(e.outputs[0], o.inputs[0]); return m
def glass(name, col, rough=.12, alpha=.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = srgb(col)
    b.inputs['Roughness'].default_value = rough
    for k, v in (('Transmission Weight', .92), ('IOR', 1.45)):
        if k in b.inputs: b.inputs[k].default_value = v
    return m
def tube(pts, r, m, res=10):
    cu = bpy.data.curves.new('t', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = res; cu.use_fill_caps = True
    sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts): sp.points[i].co = (p[0], p[1], p[2], 1)
    sp.use_endpoint_u = True; sp.order_u = 4; ob = bpy.data.objects.new('t', cu); bpy.context.scene.collection.objects.link(ob); ob.data.materials.append(m); return ob
def build():
    sc = setup(res=RES, samples=SPP); w = sc.world.node_tree.nodes['Background']; w.inputs[0].default_value = srgb('#0a1220'); w.inputs[1].default_value = .35; sc.view_settings.exposure = -.3
    BONE = mat('bone', srgb('#e6dcc6'), 0, .35); bb = BONE.node_tree.nodes['Principled BSDF']; bb.inputs['Emission Color'].default_value = srgb('#5ce6ff'); bb.inputs['Emission Strength'].default_value = .35; CYAN = emis('cy', '#5ce6ff', 4.0); CYD = emis('cyd', '#5ce6ff', 1.3); GL = glass('gl', '#9fe8ff', .1); DRUM = mat('drum', srgb('#f1e8d2'), 0, .3)
    # canal (glass tube with a cyan core) + eardrum
    canal = [(-9.5, .3, -.25), (-8, .3, -.05), (-6.5, .3, .15), (-5, .3, .25), (-3.5, .3, .2)]
    tube(canal, .62, GL); tube(canal, .08, CYAN, 6)
    bpy.ops.mesh.primitive_cylinder_add(radius=.7, depth=.06, location=(-3.45, .3, .2), rotation=(0, math.pi / 2, 0)); d = bpy.context.object; d.data.materials.append(DRUM); bpy.ops.object.shade_smooth()
    # ossicles: malleus, incus, stapes as tiny capsules + links
    for a, b, r in [((-3.3, .3, .2), (-2.6, .36, .46), .09), ((-2.6, .36, .46), (-1.9, .32, .36), .1), ((-1.9, .32, .36), (-1.15, .24, .24), .075)]:
        tube([a, ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2 + .1), b], r, BONE, 8)
    for p in [(-2.6, .36, .46), (-1.9, .32, .36)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=.17, location=p, segments=24, ring_count=12); bpy.context.object.data.materials.append(BONE); bpy.ops.object.shade_smooth()
    # cochlea: spiral tube + glow rim
    sp = []; turns = 2.6
    for i in range(0, 61):
        th = i / 60 * turns * 2 * math.pi; r = 1.2 * (1 - i / 60 * .78) + .12; sp.append((r * math.cos(th), .1 + th * .018, .2 + r * math.sin(th)))
    tube(sp, .17, BONE, 12); tube(sp, .06, CYD, 6)
    # temporal-bone "plate": wire cage + faint glass volume
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-3.2, 0, .2)); box = bpy.context.object; box.scale = (11.4, 5.4, 4.6)
    wf = box.modifiers.new('wf', 'WIREFRAME'); wf.thickness = .022; wf.use_replace = True; box.data.materials.append(CYD)
    for loc, rot, size, e, col in [((-3, -9, 8), (math.radians(50), 0, math.radians(8)), 9, 700, (1, .96, .92)), ((-10, -6, 3), (math.radians(80), 0, math.radians(-60)), 8, 520, (.5, .85, 1)), ((6, 4, 4), (math.radians(80), 0, math.radians(140)), 6, 300, (1, .6, .5))]:
        bpy.ops.object.light_add(type='AREA', location=loc, rotation=rot); l = bpy.context.object; l.data.energy = e; l.data.size = size; l.data.color = col
    cam = bpy.data.cameras.new('c'); co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
    air = [(-10.5, .3, -.25)] + canal[1:] + [(-2.6, .36, .46), (-1.9, .32, .36), (-1.15, .24, .24), (-.55, .2, .2)]
    bone = [(2.4, .12, 3.4), (1.8, .14, 2.2), (1.3, .14, 1.4), (.85, .14, .8), (.5, .12, .45)]
    os.makedirs(OUT, exist_ok=True); anchors = {'frames': []}
    P0, T0, L0 = mathutils.Vector((-5.2, -17.5, 6.0)), mathutils.Vector((-3.4, 0, .1)), 46; P1, T1, L1 = mathutils.Vector((2.2, -8.2, 2.4)), mathutils.Vector((-.2, .1, .25)), 62
    for f in range(NF):
        u = f / (NF - 1); e = u * u * (3 - 2 * u); co.location = P0.lerp(P1, e); T = T0.lerp(T1, e); cam.lens = L0 + (L1 - L0) * e
        co.rotation_euler = (T - co.location).to_track_quat('-Z', 'Y').to_euler(); bpy.context.view_layer.update()
        pr = lambda p: [round(v.x * RES[0], 1), round((1 - v.y) * RES[1], 1)] if (v := world_to_camera_view(sc, co, mathutils.Vector(p))) else None
        anchors['frames'].append({'air': [pr(p) for p in air], 'bone': [pr(p) for p in bone], 'coch': pr((0, .1, .2)), 'drum': pr((-3.45, .3, .2)), 'plug': pr((-6.1, .3, .15))})
        sc.render.filepath = os.path.join(OUT, f'ear_{f:02d}.png'); bpy.ops.render.render(write_still=True); print('frame', f, flush=True)
    json.dump(anchors, open(os.path.join(OUT, 'ear.json'), 'w'))
if __name__ == '__main__': build()
