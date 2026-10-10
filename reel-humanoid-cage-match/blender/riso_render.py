"""Render a rigged Quaternius character with a two-ink riso toon look as RGBA frames (pure function of the frame index).
bpy usage:  python3 riso_render.py <robot|human> <action> <outdir> [--variant coral|yellow|blue] [--yaw DEG] [--step N] [--res 600] [--frames a-b]"""
import bpy, sys, os, math, argparse
from mathutils import Vector
ap = argparse.ArgumentParser(); ap.add_argument('char'); ap.add_argument('action'); ap.add_argument('out')
ap.add_argument('--variant', default='coral'); ap.add_argument('--yaw', type=float, default=-35); ap.add_argument('--step', type=int, default=1)
ap.add_argument('--res', type=int, default=600); ap.add_argument('--frames', default=''); ap.add_argument('--cam', default='')
a = ap.parse_args()
Q = os.environ.get('QDIR', '/tmp/w')
BLEND = {'robot': f'{Q}/itch/robot/Blend/Robot.blend', 'human': f'{Q}/human/Animated Human by @Quaternius/Blend/Animated Human.blend'}[a.char]
INK, BLUE, CORAL, YELLOW, CREAM = (0.078, 0.071, 0.227), (0.169, 0.231, 1.0), (1.0, 0.353, 0.212), (1.0, 0.824, 0.247), (0.965, 0.937, 0.886)
def lin(c): return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)
LIGHT = Vector((-0.5, -0.6, 0.65)).normalized()
bpy.ops.wm.open_mainfile(filepath=BLEND)
sc = bpy.context.scene
# ---------- materials ----------
PAL = {'coral': {'Main': CORAL, 'Grey': CREAM, 'Black': INK}, 'yellow': {'Main': YELLOW, 'Grey': CREAM, 'Black': INK}, 'blue': {'Main': BLUE, 'Grey': CREAM, 'Black': INK}}[a.variant] if a.char == 'robot' else {}
def toon(m):
    img = None
    if a.char == 'human' and m.name == 'Texture':
        from PIL import Image
        src = Image.open(f'{Q}/human/Animated Human by @Quaternius/Blend/Textures/ClothedLightSkin.png').convert('RGB')
        MAP = {(255, 209, 159): (255, 209, 159), (124, 88, 35): (20, 18, 58), (115, 167, 196): (255, 210, 63), (41, 41, 41): (20, 18, 58), (21, 96, 189): (43, 59, 255)}
        if a.variant == 'coralshirt': MAP[(115, 167, 196)] = (255, 90, 54)
        px = src.load()
        for x in range(src.width):
            for y in range(src.height): px[x, y] = MAP.get(px[x, y], px[x, y])
        p = '/tmp/_human_tex.png'; src.save(p); img = bpy.data.images.load(p)
    base = PAL.get(m.name, tuple(m.diffuse_color[:3]))
    nt = m.node_tree if m.use_nodes else None
    m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    N = nt.nodes
    geo = N.new('ShaderNodeNewGeometry'); dot = N.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'; dot.inputs[1].default_value = LIGHT
    nt.links.new(geo.outputs['Normal'], dot.inputs[0])
    ramp = N.new('ShaderNodeValToRGB'); ramp.color_ramp.interpolation = 'CONSTANT'; e = ramp.color_ramp.elements; e[0].position = 0.0; e[1].position = 0.12; e.new(0.8)
    e[0].color = (0, 0, 0, 1); e[1].color = (0.5, 0.5, 0.5, 1); e[2].color = (1, 1, 1, 1)   # bands: shade / mid / light as grey levels
    nt.links.new(dot.outputs['Value'], ramp.inputs['Fac'])
    if img:
        tex = N.new('ShaderNodeTexImage'); tex.image = img; tex.interpolation = 'Closest'; col = tex.outputs['Color']
        uv = N.new('ShaderNodeUVMap'); nt.links.new(uv.outputs['UV'], tex.inputs['Vector'])
    else:
        rgb = N.new('ShaderNodeRGB'); rgb.outputs[0].default_value = (*lin(base), 1); col = rgb.outputs[0]
    # halftone dots in screen space for the shade band
    win = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); nt.links.new(win.outputs['Window'], sep.inputs[0])
    def mul(a_, b_): n = N.new('ShaderNodeMath'); n.operation = 'MULTIPLY'; n.inputs[1].default_value = b_; nt.links.new(a_, n.inputs[0]); return n.outputs[0]
    def sin(x_): n = N.new('ShaderNodeMath'); n.operation = 'SINE'; nt.links.new(x_, n.inputs[0]); return n.outputs[0]
    sx = sin(mul(sep.outputs['X'], 330)); sy = sin(mul(sep.outputs['Y'] if False else sep.outputs['Y'], 330))
    pr = N.new('ShaderNodeMath'); pr.operation = 'MULTIPLY'; nt.links.new(sx, pr.inputs[0]); nt.links.new(sy, pr.inputs[1])
    gt = N.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.35; nt.links.new(pr.outputs[0], gt.inputs[0])
    # colours
    def mix(a_, b_, fac_node=None, fac=0.5, blend='MIX'):
        n = N.new('ShaderNodeMix'); n.data_type = 'RGBA'; n.blend_type = blend
        if fac_node is not None: nt.links.new(fac_node, n.inputs[0])
        else: n.inputs[0].default_value = fac
        nt.links.new(a_, n.inputs[6]); 
        if isinstance(b_, tuple): n.inputs[7].default_value = (*b_, 1)
        else: nt.links.new(b_, n.inputs[7])
        return n.outputs[2]
    shade_a = mix(col, (*lin((0.45, 0.50, 1.0)),), fac=1.0, blend='MULTIPLY')       # bluish shadow
    shade_b = mix(col, (*lin((0.18, 0.22, 0.75)),), fac=1.0, blend='MULTIPLY')       # denser ink where the dots land
    shade = mix(shade_a, shade_b, fac_node=gt.outputs[0])
    light = mix(col, (*lin((1.15, 1.12, 1.05)),), fac=1.0, blend='MULTIPLY')
    # band weights from the ramp (0 / 0.5 / 1)
    lvl = ramp.outputs['Color']; sepc = N.new('ShaderNodeSeparateColor'); nt.links.new(lvl, sepc.inputs[0])
    mid_mix = mix(shade, col, fac_node=sepc.outputs[0])                              # R>0 from mid-up
    # shade (0) -> mid (0.5 -> r=0.5 after gamma ~0.21 ...) use thresholds explicitly:
    th1 = N.new('ShaderNodeMath'); th1.operation = 'GREATER_THAN'; th1.inputs[1].default_value = 0.01; nt.links.new(sepc.outputs[0], th1.inputs[0])
    th2 = N.new('ShaderNodeMath'); th2.operation = 'GREATER_THAN'; th2.inputs[1].default_value = 0.6; nt.links.new(sepc.outputs[0], th2.inputs[0])
    c1 = mix(shade, col, fac_node=th1.outputs[0]); c2 = mix(c1, light, fac_node=th2.outputs[0])
    em = N.new('ShaderNodeEmission'); nt.links.new(c2, em.inputs['Color'])
    out = N.new('ShaderNodeOutputMaterial'); nt.links.new(em.outputs[0], out.inputs['Surface'])
    return m
for m in list(bpy.data.materials): toon(m)
hull = bpy.data.materials.new('ink'); hull.use_nodes = True; nt = hull.node_tree; nt.nodes.clear()
g = nt.nodes.new('ShaderNodeNewGeometry'); tr = nt.nodes.new('ShaderNodeBsdfTransparent'); em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (*lin(INK), 1)
mx = nt.nodes.new('ShaderNodeMixShader'); nt.links.new(g.outputs['Backfacing'], mx.inputs[0]); nt.links.new(em.outputs[0], mx.inputs[1]); nt.links.new(tr.outputs[0], mx.inputs[2])
o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(mx.outputs[0], o.inputs['Surface'])
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
# outline hull thickness relative to character height
sc.frame_set(1); dg = bpy.context.evaluated_depsgraph_get()
def bbox():
    lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
    for ob in meshes:
        ev = ob.evaluated_get(dg)
        for c in ev.bound_box:
            w = ev.matrix_world @ Vector(c); lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    return lo, hi
lo, hi = bbox(); H = hi.z - lo.z
for ob in meshes:
    n = len(ob.material_slots)
    for _ in range(n): ob.data.materials.append(hull)
    s = ob.modifiers.new('outline', 'SOLIDIFY'); s.thickness = 0.018 * H / max(ob.matrix_world.to_scale()[0], 1e-3); s.offset = 1; s.use_flip_normals = True; s.material_offset = n
# ---------- scene ----------
arm.rotation_euler[2] = math.radians(a.yaw)
act = bpy.data.actions[a.action]; arm.animation_data_create(); arm.animation_data.action = act
f0, f1 = (int(x) for x in a.frames.split('-')) if a.frames else (int(act.frame_range[0]), int(act.frame_range[1]))
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.type = 'ORTHO'
sc.render.engine = 'CYCLES'; sc.cycles.samples = 6; sc.cycles.use_denoising = False; sc.cycles.filter_width = 1.4; sc.cycles.device = 'CPU'
sc.render.film_transparent = True; sc.render.resolution_x = sc.render.resolution_y = a.res
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'; sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
# frame the union bbox across the clip
LO = Vector((1e9,) * 3); HI = Vector((-1e9,) * 3)
for f in range(f0, f1 + 1, max(1, a.step)):
    sc.frame_set(f); dg = bpy.context.evaluated_depsgraph_get(); l, h = bbox(); LO = Vector(map(min, LO, l)); HI = Vector(map(max, HI, h))
ctr = (LO + HI) / 2; span = max(HI.x - LO.x, HI.z - LO.z, HI.y - LO.y) * 1.12
if a.cam: ctr.x, ctr.z, span = (float(v) for v in a.cam.split(','))
cam.data.ortho_scale = span; cam.location = (ctr.x, ctr.y - 12, ctr.z); cam.rotation_euler = (math.radians(90), 0, 0)
os.makedirs(a.out, exist_ok=True); i = 0
for f in range(f0, f1 + 1, max(1, a.step)):
    sc.frame_set(f); sc.render.filepath = f'{a.out}/f{i:04d}.png'; bpy.ops.render.render(write_still=True); i += 1
print('RENDERED', i, 'frames', 'cam', round(ctr.x, 3), round(ctr.z, 3), round(span, 3))
