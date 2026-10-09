"""Reach mascot: a procedural cartoon glove, cel-shaded, rendered as RGBA frames.
Pure function of time: every frame is computed from the clip keyframes, nothing accumulates.
Usage:  python3 glove.py still <pose> out.png            (one frame)
        python3 glove.py clip <clip> outdir [fps]        (PNG sequence)
        python3 glove.py sheet out.png                   (all poses, contact sheet)
Runs with the `bpy` pip module (CPU) or on a GPU box (set REACH_GPU=1)."""
import bpy, math, os, sys, json
from mathutils import Vector

RED, BONE, INK = (0.902, 0.224, 0.275), (0.953, 0.925, 0.875), (0.078, 0.067, 0.059)
LIGHT = Vector((-0.45, 0.55, 0.70)).normalized()
RES = int(os.environ.get('REACH_RES', 512))

def lin(c):  # sRGB -> linear
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

def toon_mat(name, base, bands=((0.0, 0.58), (0.18, 1.0), (0.78, 1.16))):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    dot = nt.nodes.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'; dot.inputs[1].default_value = LIGHT
    nt.links.new(geo.outputs['Normal'], dot.inputs[0])
    ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.interpolation = 'CONSTANT'
    els = ramp.color_ramp.elements
    els[0].position, els[1].position = 0.0, bands[1][0]
    els.new(bands[2][0])
    b = lin(base)
    for e, (_, k) in zip(els, bands):
        e.color = (min(b[0] * k, 1), min(b[1] * k, 1), min(b[2] * k, 1), 1)
    nt.links.new(dot.outputs['Value'], ramp.inputs['Fac'])
    em = nt.nodes.new('ShaderNodeEmission'); nt.links.new(ramp.outputs['Color'], em.inputs['Color'])
    out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(em.outputs['Emission'], out.inputs['Surface'])
    return m

def hull_mat():
    m = bpy.data.materials.new('ink'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    bf = nt.nodes.new('ShaderNodeNewGeometry')
    tr = nt.nodes.new('ShaderNodeBsdfTransparent'); em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (*lin(INK), 1)
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(bf.outputs['Backfacing'], mix.inputs['Fac']); nt.links.new(em.outputs[0], mix.inputs[1]); nt.links.new(tr.outputs[0], mix.inputs[2])
    out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(mix.outputs[0], out.inputs['Surface'])
    return m

def ellipsoid(name, size, loc, mat, parent, hull, seg=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, radius=1.0, location=loc)
    o = bpy.context.active_object; o.name = name; o.scale = size; o.parent = parent
    bpy.ops.object.shade_smooth(); o.data.materials.append(mat)
    if hull:
        s = o.modifiers.new('outline', 'SOLIDIFY'); s.thickness = hull; s.offset = 1; s.use_flip_normals = True; s.material_offset = 1
        o.data.materials.append(HULL)
    return o

def pivot(name, loc, parent):
    e = bpy.data.objects.new(name, None); bpy.context.collection.objects.link(e); e.location = loc; e.parent = parent
    return e

FINGERS = {  # name: (x, base_y, seg lengths, radius)
    'index': (-0.42, 0.70, (0.52, 0.42), 0.185), 'middle': (-0.07, 0.74, (0.58, 0.46), 0.195),
    'ring': (0.28, 0.70, (0.52, 0.42), 0.185), 'pinky': (0.60, 0.58, (0.40, 0.33), 0.16)}
P = {}  # joint pivots by name

def build():
    global HULL
    bpy.ops.wm.read_factory_settings(use_empty=True)
    HULL = hull_mat(); red = toon_mat('red', RED); bone = toon_mat('bone', BONE); ink = toon_mat('inkfill', INK)
    root = pivot('root', (0, 0, 0), None); P['root'] = root
    palm = ellipsoid('palm', (0.80, 0.80, 0.50), (0, 0.15, 0), red, root, 0.05); P['palm'] = palm
    ellipsoid('cuff', (0.60, 0.42, 0.50), (0, -0.62, 0), bone, root, 0.05)
    ellipsoid('stripe', (0.62, 0.07, 0.52), (0, -0.50, 0), ink, root, 0.0)
    for n, (x, by, ls, r) in FINGERS.items():
        a = pivot(n + '1', (x, by, 0.0), root); P[n + '1'] = a
        ellipsoid(n + '_s1', (r, ls[0] / 2 + r * 0.55, r), (0, ls[0] / 2, 0), red, a, 0.04)
        b = pivot(n + '2', (0, ls[0], 0), a); P[n + '2'] = b
        ellipsoid(n + '_s2', (r * 0.95, ls[1] / 2 + r * 0.55, r * 0.95), (0, ls[1] / 2, 0), red, b, 0.04)
    t1 = pivot('thumb1', (-0.62, -0.05, 0.12), root); P['thumb1'] = t1
    ellipsoid('thumb_s1', (0.21, 0.30, 0.20), (0, 0.22, 0), red, t1, 0.04)
    t2 = pivot('thumb2', (0, 0.42, 0), t1); P['thumb2'] = t2
    ellipsoid('thumb_s2', (0.19, 0.27, 0.18), (0, 0.18, 0), red, t2, 0.04)
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'; cam.ortho_scale = 5.6
    co = bpy.data.objects.new('cam', cam); bpy.context.collection.objects.link(co); co.location = (0, 0.15, 8); co.rotation_euler = (0, 0, 0)
    bpy.context.scene.camera = co
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.samples = 6; sc.cycles.use_denoising = False
    sc.cycles.max_bounces = 4
    sc.render.film_transparent = True
    sc.render.resolution_x = sc.render.resolution_y = RES; sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    sc.cycles.filter_width = 1.5
    if os.environ.get('REACH_GPU'):
        pr = bpy.context.preferences.addons['cycles'].preferences
        for t in ('OPTIX', 'CUDA'):
            try: pr.compute_device_type = t; pr.get_devices(); break
            except Exception: pass
        for d in pr.devices: d.use = True
        sc.cycles.device = 'GPU'

D = math.radians
OPEN = dict(index=(5, 8), middle=(4, 8), ring=(6, 10), pinky=(10, 12), thumb=(-35, 15, 20))
def curl(**kw):
    p = {k: v for k, v in OPEN.items()}; p.update(kw); return p
CURL = (84, 88)
POSES = {
    'open':     dict(OPEN),
    'wave':     dict(OPEN),
    'point':    curl(middle=CURL, ring=CURL, pinky=CURL, index=(0, 0), thumb=(-10, 70, 55)),
    'fist':     curl(index=CURL, middle=CURL, ring=CURL, pinky=CURL, thumb=(-10, 75, 60)),
    'thumbsup': curl(index=CURL, middle=CURL, ring=CURL, pinky=CURL, thumb=(-70, -5, 0)),
    'one':      curl(middle=CURL, ring=CURL, pinky=CURL, index=(0, 0), thumb=(-10, 70, 55)),
    'two':      curl(ring=CURL, pinky=CURL, index=(0, 0), middle=(0, 0), thumb=(-10, 70, 55)),
    'three':    curl(pinky=CURL, index=(0, 0), middle=(0, 0), ring=(0, 0), thumb=(-10, 70, 55)),
    'four':     curl(index=(0, 0), middle=(0, 0), ring=(0, 0), pinky=(0, 0), thumb=(-10, 70, 55)),
    'peek':     curl(index=(18, 20), middle=(14, 18), ring=(20, 24), pinky=(24, 26)),
}

def apply(pose, rot=(0, 0, 0), pos=(0, 0, 0), scale=1.0):
    for n in FINGERS:
        a, b = pose[n]; P[n + '1'].rotation_euler = (D(a), 0, 0); P[n + '2'].rotation_euler = (D(b), 0, 0)
    z, a, b = pose['thumb']
    P['thumb1'].rotation_euler = (D(a), D(b), D(z + 32)); P['thumb2'].rotation_euler = (D(a * 0.6), 0, 0)
    r = P['root']; r.rotation_euler = tuple(D(v) for v in rot); r.location = pos; r.scale = (scale,) * 3

def lerp_pose(a, b, u):
    out = {}
    for k in a:
        va, vb = a[k], b[k]; out[k] = tuple(x + (y - x) * u for x, y in zip(va, vb))
    return out

def ease(u): return u * u * (3 - 2 * u)

def sample(keys, t):
    """keys: [{t, pose, rot, pos, scale}] sorted. Pure function of t."""
    if t <= keys[0]['t']: k = keys[0]; return POSES[k['pose']], k.get('rot', (0, 0, 0)), k.get('pos', (0, 0, 0)), k.get('scale', 1.0)
    for a, b in zip(keys, keys[1:]):
        if t <= b['t']:
            u = ease((t - a['t']) / max(b['t'] - a['t'], 1e-6))
            pa, pb = POSES[a['pose']], POSES[b['pose']]
            f = lambda key, d: tuple(x + (y - x) * u for x, y in zip(a.get(key, d), b.get(key, d)))
            return lerp_pose(pa, pb, u), f('rot', (0, 0, 0)), f('pos', (0, 0, 0)), a.get('scale', 1.0) + (b.get('scale', 1.0) - a.get('scale', 1.0)) * u
    k = keys[-1]; return POSES[k['pose']], k.get('rot', (0, 0, 0)), k.get('pos', (0, 0, 0)), k.get('scale', 1.0)

CLIPS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'clips.json')))

def render(path):
    bpy.context.scene.render.filepath = path; bpy.ops.render.render(write_still=True)

if __name__ == '__main__':
    build(); cmd = sys.argv[1]
    if cmd == 'still':
        apply(POSES[sys.argv[2]]); render(sys.argv[3])
    elif cmd == 'sheet':
        from PIL import Image
        names = list(POSES); ims = []
        for n in names:
            apply(POSES[n]); p = f'/tmp/_g_{n}.png'; render(p); ims.append(Image.open(p))
        W = ims[0].width; sh = Image.new('RGBA', (W * 5, W * 2), (243, 236, 223, 255))
        for i, im in enumerate(ims): sh.alpha_composite(im, ((i % 5) * W, (i // 5) * W))
        sh.convert('RGB').save(sys.argv[2])
    elif cmd == 'clip':
        keys = CLIPS[sys.argv[2]]; fps = int(sys.argv[4]) if len(sys.argv) > 4 else 30
        os.makedirs(sys.argv[3], exist_ok=True); dur = keys[-1]['t']; n = int(round(dur * fps))
        for i in range(n + 1):
            apply(*sample(keys, i / fps)); render(f'{sys.argv[3]}/f{i:04d}.png')
