# Rigid-body banana pile: ~260 bananas (the K-40 radioactivity of one adult, ~4,000 Bq / ~15 Bq per banana) pour into a
# dark glass dish under real gravity. Baked Bullet rigid-body physics: nothing is keyframed except the release.
# Renders frames to site/3d/ban/ban_NNN.png (transparent) for the page to scrub by t.
# Run: python3 blender/bananas.py   env: N (count) RES (WxH) SPP FRAMES (e.g. "1-96" or "60") STEP
import bpy, bmesh, math, os, sys, random, mathutils
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(H)
sys.path.insert(0, os.path.join(ROOT, '../../tech/reel-ai-trading-pipeline/blender'))
from common import setup, mat, area, cam_persp
N = int(os.environ.get('N', 260)); W, Hh = [int(v) for v in os.environ.get('RES', '720x800').split('x')]
SPP = int(os.environ.get('SPP', 28)); FR = os.environ.get('FRAMES', '1-96'); STEP = int(os.environ.get('STEP', 1))
OUT = os.path.join(ROOT, 'site/3d/ban'); os.makedirs(OUT, exist_ok=True)
def srgb(h, a=1):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (a,)
sc = setup((W, Hh), SPP); sc.render.film_transparent = True; sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Punchy'
sc.frame_start, sc.frame_end = 1, 112; sc.render.fps = 24
w = sc.world; w.node_tree.nodes['Background'].inputs[1].default_value = .05

# --- one banana mesh: a curved, five-sided tube with tapered, darker tips (length ~19 cm) -------------------------------
def banana_mesh():
    bm = bmesh.new(); SEG, SIDES, L, R = 22, 10, .19, .0215
    rings = []
    for i in range(SEG + 1):
        u = i / SEG; ang = (u - .5) * 1.35                      # bend: arc of ~60 degrees
        cx, cz = math.sin(ang) * .18, (1 - math.cos(ang)) * .18     # centreline on an arc of radius 0.18 m
        r = R * (math.sin(math.pi * min(1, max(0, u * 1.08 - .04))) ** .55) + .0025
        tx, tz = math.cos(ang), math.sin(ang)                     # tangent; normal plane spanned by (-tz, tx) and y
        ring = []
        for k in range(SIDES):
            a = 2 * math.pi * k / SIDES; rr = r * (1 - .07 * (math.cos(5 * a) ** 2))   # five soft ridges
            ring.append(bm.verts.new((cx - tz * math.cos(a) * rr, math.sin(a) * rr, cz + tx * math.cos(a) * rr)))
        rings.append(ring)
    for i in range(SEG):
        for k in range(SIDES): bm.faces.new((rings[i][k], rings[i][(k + 1) % SIDES], rings[i + 1][(k + 1) % SIDES], rings[i + 1][k]))
    bm.faces.new(list(reversed(rings[0]))); bm.faces.new(rings[-1])
    me = bpy.data.meshes.new('banana'); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    return me
m = bpy.data.materials.new('peel'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
b.inputs['Roughness'].default_value = .48; b.inputs['Specular IOR Level'].default_value = .45
tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs[1].default_value = -.095; mr.inputs[2].default_value = .095; nt.links.new(sep.outputs[0], mr.inputs[0])
ramp = nt.nodes.new('ShaderNodeValToRGB'); cr = ramp.color_ramp
cr.elements[0].position = .0; cr.elements[0].color = srgb('#3a2a10'); cr.elements[1].position = 1.; cr.elements[1].color = srgb('#2f2410')
for pos, col in ((.06, '#6b5a18'), (.15, '#f2c014'), (.85, '#f6c81a'), (.95, '#8c9a1e')):
    e = cr.elements.new(pos); e.color = srgb(col)
nt.links.new(mr.outputs[0], ramp.inputs[0])
nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 140; nz.inputs['Detail'].default_value = 3
sp = nt.nodes.new('ShaderNodeMapRange'); sp.inputs[1].default_value = .62; sp.inputs[2].default_value = .72; nt.links.new(nz.outputs['Fac'], sp.inputs[0])
mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.inputs[7].default_value = srgb('#4a3410')
nt.links.new(sp.outputs[0], mix.inputs[0]); nt.links.new(ramp.outputs['Color'], mix.inputs[6]); nt.links.new(mix.outputs[2], b.inputs['Base Color'])
me = banana_mesh(); me.materials.append(m)

# --- dish: dark smoked-glass bowl (passive rigid body, mesh collision) ----------------------------------------------------
bpy.ops.mesh.primitive_uv_sphere_add(radius=.62, location=(0, 0, .62), segments=64, ring_count=32)
bowl = bpy.context.object; bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='DESELECT'); bpy.ops.object.mode_set(mode='OBJECT')
bmb = bmesh.new(); bmb.from_mesh(bowl.data)
bmesh.ops.delete(bmb, geom=[v for v in bmb.verts if v.co.z > -.3], context='VERTS'); bmb.to_mesh(bowl.data); bmb.free()
bowl.location = (0, 0, .62); mod = bowl.modifiers.new('sol', 'SOLIDIFY'); mod.thickness = .012
bpy.ops.object.shade_smooth()
glass = bpy.data.materials.new('glass'); glass.use_nodes = True; gb = glass.node_tree.nodes['Principled BSDF']
gb.inputs['Base Color'].default_value = srgb('#1b2b22'); gb.inputs['Roughness'].default_value = .08; gb.inputs['Transmission Weight'].default_value = .85; gb.inputs['IOR'].default_value = 1.5
bowl.data.materials.append(glass)
bpy.ops.rigidbody.world_add(); rw = sc.rigidbody_world; rw.substeps_per_frame = 20; rw.solver_iterations = 20
rw.point_cache.frame_start, rw.point_cache.frame_end = 1, 112
bpy.context.view_layer.objects.active = bowl; bpy.ops.rigidbody.object_add(); bowl.rigid_body.type = 'PASSIVE'; bowl.rigid_body.collision_shape = 'MESH'; bowl.rigid_body.friction = .7
bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, 0)); fl = bpy.context.object; fl.is_shadow_catcher = True
bpy.ops.rigidbody.object_add(); fl.rigid_body.type = 'PASSIVE'

# --- bananas: released in a loose column above the dish, staggered so they pour rather than drop as one block ----------
random.seed(7); bans = []
for i in range(N):
    o = bpy.data.objects.new(f'b{i}', me); sc.collection.objects.link(o)
    layer, k = divmod(i, 16); gx, gy = k % 4 - 1.5, k // 4 - 1.5  # hopper above the frame: 4x4 per layer, 6.5 cm layers, no overlaps
    o.location = (gx * .2 + random.uniform(-.02, .02), gy * .2 + random.uniform(-.02, .02), 1.95 + layer * .065)
    o.rotation_euler = (random.uniform(-.25, .25), random.uniform(-.25, .25), random.uniform(0, 6.28))
    bpy.context.view_layer.objects.active = o; o.select_set(True); bpy.ops.rigidbody.object_add(); o.select_set(False)
    # release: held ("animated") until its layer's frame, then pure Bullet dynamics; layers open bottom-up so they pour as a stream
    rel = 4 + layer * 4.5 + random.uniform(0, 3); o.rigid_body.kinematic = True; o.keyframe_insert('rigid_body.kinematic', frame=int(rel))
    o.rigid_body.kinematic = False; o.keyframe_insert('rigid_body.kinematic', frame=int(rel) + 1)
    rb = o.rigid_body; rb.collision_shape = 'CONVEX_HULL'; rb.mass = .12; rb.friction = .65; rb.restitution = .08
    rb.linear_damping = .04; rb.angular_damping = .12; rb.collision_margin = .001
    bans.append(o)
bpy.ops.ptcache.bake_all(bake=True); print('baked', flush=True)

# --- light + camera: warm key, uranium-green rim from behind, low three-quarter view into the dish --------------------------
area((-1.4, -1.6, 2.2), (math.radians(50), 0, math.radians(-40)), 1.6, 260, (1, .9, .78))
area((1.2, 1.6, 1.0), (math.radians(-70), 0, math.radians(150)), 1.4, 380, (.55, 1.0, .35))
area((0, -2.2, .6), (math.radians(85), 0, 0), 2.0, 40, (.7, .8, 1))
cam_persp(sc, (0, -2.25, 1.55), (0, 0, .3), 50)
a, z = (FR.split('-') + [None])[:2]; frames = range(int(a), int(z or a) + 1, STEP)
for f in frames:
    sc.frame_set(f); sc.render.filepath = f'{OUT}/ban_{f:03d}.png'; bpy.ops.render.render(write_still=True); print('frame', f, flush=True)
