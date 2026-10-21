"""Procedural night city for the OTP reel (Monsoon Noir). Usage: python3 city.py <shot> <out.png> [W H samples]
Colour meaning: amber = the OTP, cyan = network, red = danger. Everything seeded (deterministic)."""
import bpy, math, random, sys, mathutils
SHOT = sys.argv[1]; OUT = sys.argv[2]
W = int(sys.argv[3]) if len(sys.argv) > 3 else 540; H = int(sys.argv[4]) if len(sys.argv) > 4 else 960; SAMP = int(sys.argv[5]) if len(sys.argv) > 5 else 24
random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMP; sc.cycles.use_denoising = True
sc.cycles.max_bounces = 4; sc.cycles.volume_bounces = 0; sc.cycles.volume_step_rate = 2.0
sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.image_settings.file_format = 'PNG'
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
# world: dark teal sky + thin fog
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree
nt.nodes['Background'].inputs[0].default_value = (0.012, 0.05, 0.065, 1); nt.nodes['Background'].inputs[1].default_value = 1.0
vol = nt.nodes.new('ShaderNodeVolumeScatter'); vol.inputs['Density'].default_value = 0.004; vol.inputs['Color'].default_value = (0.35, 0.6, 0.7, 1)
nt.links.new(vol.outputs[0], nt.nodes['World Output'].inputs['Volume'])

def emit(name, col, s):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = col; e.inputs[1].default_value = s
    o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def windows(name, base, lit_a, lit_b, density, scale=(0.3, 0.3, 0.27)):
    """Body: dark glass; windows: floor(object coords) -> white noise -> threshold -> amber/cyan emission."""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = scale
    nt.links.new(tc.outputs['Object'], mp.inputs[0])
    sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(mp.outputs[0], sep.inputs[0])
    # cell id from floor(x),floor(y),floor(z) on wall faces
    fl = nt.nodes.new('ShaderNodeVectorMath'); fl.operation = 'FLOOR'; nt.links.new(mp.outputs[0], fl.inputs[0])
    fr = nt.nodes.new('ShaderNodeVectorMath'); fr.operation = 'FRACTION'; nt.links.new(mp.outputs[0], fr.inputs[0])
    wn = nt.nodes.new('ShaderNodeTexWhiteNoise'); wn.noise_dimensions = '3D'; nt.links.new(fl.outputs[0], wn.inputs['Vector'])
    thr = nt.nodes.new('ShaderNodeMath'); thr.operation = 'GREATER_THAN'; thr.inputs[1].default_value = 1 - density; nt.links.new(wn.outputs['Value'], thr.inputs[0])
    # window pane mask: inside each cell, shrink (0.15..0.85) on z and horizontal
    sx = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(fr.outputs[0], sx.inputs[0])
    def band(ch):
        a = nt.nodes.new('ShaderNodeMath'); a.operation = 'GREATER_THAN'; a.inputs[1].default_value = 0.28; nt.links.new(sx.outputs[ch], a.inputs[0])
        b = nt.nodes.new('ShaderNodeMath'); b.operation = 'LESS_THAN'; b.inputs[1].default_value = 0.72; nt.links.new(sx.outputs[ch], b.inputs[0])
        c = nt.nodes.new('ShaderNodeMath'); c.operation = 'MULTIPLY'; nt.links.new(a.outputs[0], c.inputs[0]); nt.links.new(b.outputs[0], c.inputs[1]); return c
    bz = band('Z'); bxy = nt.nodes.new('ShaderNodeMath'); bxy.operation = 'MULTIPLY'
    bxa = band('X'); bya = band('Y'); mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MAXIMUM'
    nt.links.new(bxa.outputs[0], mx.inputs[0]); nt.links.new(bya.outputs[0], mx.inputs[1])
    nt.links.new(bz.outputs[0], bxy.inputs[0]); nt.links.new(mx.outputs[0], bxy.inputs[1])
    mask = nt.nodes.new('ShaderNodeMath'); mask.operation = 'MULTIPLY'; nt.links.new(thr.outputs[0], mask.inputs[0]); nt.links.new(bxy.outputs[0], mask.inputs[1])
    # colour pick per cell
    pick = nt.nodes.new('ShaderNodeMath'); pick.operation = 'GREATER_THAN'; pick.inputs[1].default_value = 0.5; nt.links.new(wn.outputs['Value'], pick.inputs[0])
    mixc = nt.nodes.new('ShaderNodeMix'); mixc.data_type = 'RGBA'; mixc.inputs[6].default_value = lit_a; mixc.inputs[7].default_value = lit_b; nt.links.new(pick.outputs[0], mixc.inputs[0])
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs[1].default_value = 1.0; nt.links.new(mixc.outputs[2], em.inputs[0])
    bsdf = nt.nodes.new('ShaderNodeBsdfPrincipled'); bsdf.inputs['Base Color'].default_value = base; bsdf.inputs['Roughness'].default_value = 0.25; bsdf.inputs['Metallic'].default_value = 0.6
    mix = nt.nodes.new('ShaderNodeMixShader'); nt.links.new(mask.outputs[0], mix.inputs[0]); nt.links.new(bsdf.outputs[0], mix.inputs[1]); nt.links.new(em.outputs[0], mix.inputs[2])
    o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(mix.outputs[0], o.inputs[0]); return m

AMB = (1.0, 0.55, 0.12, 1); CY = (0.1, 0.8, 0.95, 1); RED = (1.0, 0.08, 0.1, 1); WARM = (1.0, 0.75, 0.45, 1)
DIMC = (0.0, 0.32, 0.55, 1); DIMW = (0.75, 0.42, 0.16, 1)
mat_a = windows('winA', (0.02, 0.05, 0.065, 1), DIMC, DIMW, 0.32)
mat_b = windows('winB', (0.03, 0.04, 0.05, 1), DIMC, DIMC, 0.22, scale=(0.25, 0.25, 0.22))
amber = emit('amber', AMB, 14); cyan = emit('cyan', CY, 8); red = emit('red', RED, 12)
road = bpy.data.materials.new('wet'); road.use_nodes = True; b = road.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (0.01, 0.018, 0.022, 1); b.inputs['Roughness'].default_value = 0.12; b.inputs['Metallic'].default_value = 0.3
roof = bpy.data.materials.new('roof'); roof.use_nodes = True; roof.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.03, 0.045, 0.055, 1); roof.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.5

def box(loc, size, m):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(loc[0], loc[1], loc[2] + size[2] / 2)); o = bpy.context.object; o.scale = size; o.data.materials.append(m)
    bpy.ops.object.transform_apply(scale=True); return o
bpy.ops.mesh.primitive_plane_add(size=260, location=(0, 0, 0)); bpy.context.object.data.materials.append(road)
# city grid: blocks 14 wide, roads 8 wide
P = 22; N = 7
buildings = {}
for gx in range(-N, N + 1):
    for gy in range(-N, N + 1):
        x, y = gx * P, gy * P; d = math.hypot(gx, gy)
        if (gx, gy) in [(0, 0), (3, 0), (-2, -3), (1, -2), (2, 3)]: continue
        h = random.uniform(10, 46) * (1.25 - d / 14)
        s = random.uniform(11, 15)
        buildings[(gx, gy)] = box((x, y, 0), (s, s + random.uniform(-2, 2), max(h, 7)), mat_a if random.random() < .6 else mat_b)
# hero: bank tower (0,0), telecom core (3,0), radio tower (-2,-3), gateway yard (1,-2), perch roof (2,3)
bank = box((0, 0, 0), (16, 16, 95), mat_a); box((0, 0, 95), (12, 12, 10), roof)
telecom = box((3 * P, 0, 0), (30, 20, 16), mat_b)
box((1 * P, -2 * P, 0), (22, 14, 8), mat_b)
perch = box((2 * P, 3 * P, 0), (16, 16, 60), mat_a)
# radio tower: lattice-ish tapered pylon
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=5, radius2=0.6, depth=70, location=(-2 * P, -3 * P, 35)); rt = bpy.context.object; rt.data.materials.append(mat_b)
# cyan fibre lanes along roads
def lane(pts, m, r=0.35):
    cu = bpy.data.curves.new('l', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts): sp.points[i].co = (*p, 1)
    ob = bpy.data.objects.new('l', cu); sc.collection.objects.link(ob); ob.data.materials.append(m); return ob
rd = P / 2
lane([(0, 11, 0.4), (0, 4 * P + 11, 0.4)], cyan); lane([(0, 11, 0.4), (3 * P, 11, 0.4), (3 * P, -0.0, 0.4)], cyan)
lane([(3 * P, 11, 0.4), (3 * P, -3 * P + 11, 0.4), (-2 * P + 11, -3 * P + 11, 0.4)], cyan); lane([(P + 11, -2 * P + 11, 0.4), (P + 11, 11, 0.4)], cyan)
lane([(-2 * P + 11, 11, 0.4), (2 * P + 11, 11, 0.4), (2 * P + 11, 3 * P - 9, 0.4)], cyan)
# the OTP: amber 6-digit text on the bank's face + glowing orb
def digits(txt, loc, rot, size):
    bpy.ops.object.text_add(location=loc, rotation=rot); t = bpy.context.object; t.data.body = txt; t.data.size = size; t.data.extrude = size * 0.12; t.data.align_x = 'CENTER'; t.data.materials.append(amber); return t
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(60), 0, math.radians(30))); sun = bpy.context.object; sun.data.energy = 0.25; sun.data.color = (0.5, 0.75, 1)
def pt(loc, col, e, r=12):
    bpy.ops.object.light_add(type='POINT', location=loc); l = bpy.context.object; l.data.energy = e; l.data.color = col; l.data.shadow_soft_size = r; return l
def web(a, b, sag=0.0):
    mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2 - sag); return lane([a, mid, b], emit('web', (0.9, 0.95, 1, 1), 6), 0.07)
def cam(loc, tgt, lens=22, roll=0):
    cd = bpy.data.cameras.new('c'); cd.lens = lens; cd.dof.use_dof = True; cd.dof.focus_distance = (mathutils.Vector(tgt) - mathutils.Vector(loc)).length; cd.dof.aperture_fstop = 5.6
    co = bpy.data.objects.new('c', cd); sc.collection.objects.link(co); sc.camera = co; co.location = loc
    q = (mathutils.Vector(tgt) - co.location).to_track_quat('-Z', 'Y'); co.rotation_euler = q.to_euler(); co.rotation_euler.rotate_axis('Z', 0)
    co.rotation_euler = (co.matrix_world.to_3x3() @ mathutils.Matrix.Identity(3)).to_euler() if False else co.rotation_euler
    if roll:
        r = mathutils.Matrix.Rotation(math.radians(roll), 3, (mathutils.Vector(tgt) - co.location).normalized()); co.rotation_euler = (r @ q.to_matrix()).to_euler()

if SHOT == 'bank':      # shot 2: mid-swing toward the bank tower, code snapping on its face
    digits('4 8 2 9 1 7', (0, -8.4, 66), (math.pi / 2, 0, 0), 5.2); pt((0, -20, 66), AMB[:3], 20000, 10)
    web((-18, -60, 72), (-8, -8, 80), 3); cam((-30, -100, 58), (0, 0, 66), 24, roll=-9)
elif SHOT == 'road':    # shot 5: high arc over fibre river toward the radio tower
    digits('', (0, 0, 0), (0, 0, 0), 1); pt((-2 * P, -3 * P, 72), CY[:3], 80000, 6)
    orb = emit('orb', AMB, 40); bpy.ops.mesh.primitive_uv_sphere_add(radius=2.2, location=(-2 * P + 14, -3 * P + 11, 24)); bpy.context.object.data.materials.append(orb); pt((-2 * P + 14, -3 * P + 11, 24), AMB[:3], 40000, 3)
    cam((3 * P - 10, 4, 88), (-2 * P, -3 * P, 34), 20, roll=7)
elif SHOT == 'ask':     # shot 8: faceless red silhouette on the perch roof, city behind, red lane pulling the amber code
    px, py, pz = 2 * P, 3 * P, 60
    box((px, py, pz - 0.2), (16, 16, 0.4), roof)
    for sx_, sy_, w_, d_ in [(0, 8, 16, .5), (0, -8, 16, .5), (8, 0, .5, 16), (-8, 0, .5, 16)]: box((px + sx_, py + sy_, pz), (w_, d_, 1.0), roof)
    blk = bpy.data.materials.new('sil'); blk.use_nodes = True; blk.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.004, 0.004, 0.006, 1); blk.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.8
    bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=1.35, location=(px, py - 3, pz + 0.7)); bpy.context.object.data.materials.append(blk)
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.62, radius2=0.42, depth=0.7, location=(px, py - 3, pz + 1.6)); bpy.context.object.data.materials.append(blk)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.27, location=(px, py - 3, pz + 2.15)); bpy.context.object.data.materials.append(blk)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(px - 0.5, py - 3.9, pz + 1.75)); ph = bpy.context.object; ph.scale = (0.2, 0.03, 0.34); ph.rotation_euler = (0, 0, math.radians(20)); ph.data.materials.append(red)
    pt((px - 0.5, py - 4.3, pz + 1.7), RED[:3], 500, 1)
    lane([(px - 0.5, py - 3.9, pz + 1.75), (px - 6, py - 12, pz + 4.5), (px - 12, py - 22, pz + 4)], red, 0.07)
    digits('4 8 2 9 1 7', (px - 12.5, py - 24, pz + 4), (math.pi / 2, 0, math.pi + math.radians(8)), 1.3); pt((px - 12, py - 25, pz + 4.4), AMB[:3], 3000, 2)
    cam((px + 2.8, py + 3.5, pz + 1.5), (px - 7, py - 30, pz - 6), 30, roll=3)
sc.render.filepath = OUT; bpy.ops.render.render(write_still=True)
