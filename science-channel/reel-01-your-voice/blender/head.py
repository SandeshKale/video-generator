# Porcelain head for "You've never heard YOU": closed, coronal cut-away, cut-away with ear plugs.
# Face looks +X. The cut plane is x=0.02 (through both ears), camera sees it 3/4 from the front.
import bpy, math, sys, os, json, mathutils
sys.path.insert(0, os.path.dirname(__file__))
from common import setup, mat, area, cam_persp
SPP = int(os.environ.get('SPP', 40)); OUT = os.environ.get('OUT', os.path.join(os.path.dirname(__file__), '..', 'mockup', '3d')); ONLY = os.environ.get('ONLY', '')
def srgb(h): h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]; return tuple(((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92 for v in c) + (1,)
RES = (1000, 1100)
def emis(name, col, s):
    m = bpy.data.materials.new(name); m.use_nodes = True; n = m.node_tree.nodes; n.clear(); e = n.new('ShaderNodeEmission'); e.inputs[0].default_value = srgb(col); e.inputs[1].default_value = s
    o = n.new('ShaderNodeOutputMaterial'); m.node_tree.links.new(e.outputs[0], o.inputs[0]); return m
def sph(loc, sc, m, r=1, seg=64):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=seg // 2); o = bpy.context.object; o.scale = sc; bpy.ops.object.shade_smooth(); o.data.materials.append(m); return o
def boolean(a, b, op='DIFFERENCE'):
    md = a.modifiers.new('b', 'BOOLEAN'); md.operation = op; md.object = b; md.solver = 'EXACT'
    bpy.context.view_layer.objects.active = a; bpy.ops.object.modifier_apply(modifier='b'); return a
def flat(loc, ry, rz, m, t=0.004):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=loc, segments=64, ring_count=32); o = bpy.context.object; o.scale = (t, ry, rz); o.data.materials.append(m); return o
def bisect(o, x0, capm):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    o.data.materials.append(capm); ci = len(o.data.materials) - 1
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bisect(plane_co=(x0, 0, 0), plane_no=(1, 0, 0), use_fill=True, clear_inner=False, clear_outer=True)
    bpy.ops.object.mode_set(mode='OBJECT')
    for p in o.data.polygons:
        if all(abs(o.data.vertices[v].co.x - x0) < 1e-4 for v in p.vertices): p.material_index = ci
def build(mode):  # 'closed' | 'cut' | 'cutplug'
    sc = setup(res=RES, samples=SPP)
    w = sc.world.node_tree.nodes['Background']; w.inputs[0].default_value = srgb('#0a1220'); w.inputs[1].default_value = 0.3
    sc.view_settings.exposure = -0.45
    P = mat('porcelain', srgb('#d3dbe5'), 0.0, 0.36); HAIR = mat('hair', srgb('#18202e'), 0.0, 0.55)
    face = mat('face', srgb('#161d2b'), 0.0, 0.5); capm = emis('cap', '#123043', 0.8); bone = mat('bone', srgb('#e3d6bd'), 0.0, 0.5)
    cav = emis('cavity', '#0b1d2b', 0.9); brain = mat('brain', srgb('#2d8aa6'), 0.0, 0.2)
    cyan = emis('cyan', '#52e3ff', 3.0); lime = emis('lime', '#b8ff3d', 2.2)
    objs = []
    cr = sph((0, 0, 0.25), (0.96, 0.86, 1.02), P, seg=96)
    jaw = sph((0.3, 0, -0.5), (0.8, 0.64, 0.82), P, seg=96)
    boolean(cr, jaw, 'UNION'); bpy.data.objects.remove(jaw)
    md = cr.modifiers.new('r', 'REMESH'); md.mode = 'SMOOTH'; md.octree_depth = 8; md.scale = 0.9; md.use_smooth_shade = True
    bpy.context.view_layer.objects.active = cr; bpy.ops.object.modifier_apply(modifier='r')
    sm = cr.modifiers.new('s', 'SMOOTH'); sm.factor = 0.9; sm.iterations = 25; bpy.ops.object.modifier_apply(modifier='s'); bpy.ops.object.shade_smooth()
    objs.append(cr)
    hair = sph((0, 0, 0.25), (1.0, 0.9, 1.065), HAIR, seg=192); objs.append(hair)
    bpy.ops.object.select_all(action='DESELECT'); hair.select_set(True); bpy.context.view_layer.objects.active = hair; bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    hair.data.materials.append(HAIR); bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bisect(plane_co=(0.55, 0, 0.5), plane_no=(-0.35, 0, 0.94), use_fill=True, clear_inner=True, clear_outer=False); bpy.ops.object.mode_set(mode='OBJECT')
    for s in (-1, 1):
        objs.append(sph((-0.02, s * 0.89, -0.12), (0.1, 0.3, 0.42), P, seg=32))
        objs.append(sph((0.92, s * 0.29, 0.1), (0.06, 0.06, 0.06), face, seg=16))
    bpy.ops.mesh.primitive_cone_add(radius1=0.13, radius2=0.03, depth=0.38, location=(1.05, 0, -0.22), rotation=(0, math.radians(95), 0)); no = bpy.context.object; no.data.materials.append(P); bpy.ops.object.shade_smooth(); objs.append(no)
    objs.append(sph((1.075, 0, -0.66), (0.02, 0.17, 0.025), face, seg=24))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.4, depth=1.4, location=(-0.05, 0, -1.5)); ne = bpy.context.object; ne.data.materials.append(P); bpy.ops.object.shade_smooth(); objs.append(ne)
    if mode != 'closed':
        X = 0.0
        for o in objs: bisect(o, X, capm)
        flat((X + 0.012, 0, 0.25), 0.865, 1.02, bone); flat((X + 0.02, 0, 0.25), 0.76, 0.9, cav); flat((X + 0.03, 0, 0.36), 0.52, 0.58, brain)
        for s in (-1, 1):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.36, location=(X + 0.04, s * 0.72, -0.12), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(cyan)
            sph((X + 0.04, s * 0.5, -0.1), (0.1, 0.1, 0.1), cyan, seg=24)
            bpy.ops.mesh.primitive_torus_add(major_radius=0.075, minor_radius=0.026, location=(X + 0.04, s * 0.5, -0.1), rotation=(0, math.pi / 2, 0)); bpy.context.object.data.materials.append(cyan)
            if mode == 'cutplug':
                bpy.ops.mesh.primitive_cylinder_add(radius=0.095, depth=0.2, location=(X + 0.045, s * 0.82, -0.12), rotation=(math.pi / 2, 0, 0)); bpy.context.object.data.materials.append(lime)
    elif ONLY == 'plug':
        pass
    area((3.5, -3, 3.5), (math.radians(55), 0, math.radians(50)), 5, 520, (1, 0.97, 0.94))
    area((-3.5, -2.5, 1.5), (math.radians(80), 0, math.radians(-125)), 5, 520, (0.45, 0.8, 1))
    area((2.5, 3.5, 0.5), (math.radians(90), 0, math.radians(160)), 4, 400, (1, 0.5, 0.45))
    cam_persp(sc, (4.0, -4.4, 0.9), (0.12, 0.0, 0.08), lens=70)
    # projection of anchor points for the page
    bpy.context.view_layer.update(); cam = sc.camera; from bpy_extras.object_utils import world_to_camera_view
    def proj(p):
        v = world_to_camera_view(sc, cam, mathutils.Vector(p)); return [round(v.x * RES[0]), round((1 - v.y) * RES[1])]
    pts = {'mouth': proj((1.09, 0, -0.66)), 'skull': proj((0, 0, 0.25)), 'earNear': proj((-0.02, -0.98, -0.12)), 'earFar': proj((-0.02, 0.98, -0.12)),
           'canalNearIn': proj((0.03, -0.54, -0.08)), 'canalFarIn': proj((0.03, 0.54, -0.08)), 'throat': proj((0.2, 0, -1.0)), 'crown': proj((0, 0, 1.25)), 'chin': proj((0.8, 0, -1.1)),
           'plugNear': proj((0.03, -0.83, -0.1)), 'plugFar': proj((0.03, 0.83, -0.1)), 'jawL': proj((0.1, -0.5, -0.7)), 'jawR': proj((0.1, 0.5, -0.7))}
    sc.render.filepath = os.path.join(OUT, f'head_{mode}.png'); bpy.ops.render.render(write_still=True)
    json.dump(pts, open(os.path.join(OUT, 'head.json'), 'w'))
if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True); build(os.environ.get('MODE', 'closed'))
