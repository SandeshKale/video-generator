"""Render-time probe for the supermoon reel (Blender 5.0.1 as the bpy module, Cycles CPU).
Builds the heaviest shot (ghat steps + 300 instanced diyas with emissive flames + a textured moon + sky) and renders N frames, logging seconds/frame.
usage: python3 probe.py [samples=24] [frames=4] [w=1080] [h=1920]"""
import bpy, sys, time, math, random, os
S = int(sys.argv[1]) if len(sys.argv) > 1 else 24; NF = int(sys.argv[2]) if len(sys.argv) > 2 else 4
W = int(sys.argv[3]) if len(sys.argv) > 3 else 1080; H = int(sys.argv[4]) if len(sys.argv) > 4 else 1920
D = os.path.dirname(os.path.abspath(__file__)); TEX = os.path.join(os.path.dirname(D), 'tex'); OUT = '/tmp/moon/probe'; os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = S; sc.cycles.use_denoising = True
sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.max_bounces = 4; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 2; sc.cycles.transmission_bounces = 0; sc.cycles.volume_bounces = 0
sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.05
sc.render.resolution_x = W; sc.render.resolution_y = H; sc.render.resolution_percentage = 100; sc.render.threads = 4; sc.render.fps = 24
sc.view_settings.view_transform = 'AgX'
# world: deep indigo gradient-ish flat colour with a little ambient
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.012, 0.018, 0.05, 1); bg.inputs[1].default_value = 0.6
def mat(name, col, emit=0, rough=.7):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = col; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = col; b.inputs['Emission Strength'].default_value = emit
    return m
# moon with real NASA colour map + displacement map (bump only, cheap)
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=1.0, location=(0, 14, 5.5)); moon = bpy.context.object; bpy.ops.object.shade_smooth()
mm = bpy.data.materials.new('moon'); mm.use_nodes = True; nt = mm.node_tree; b = nt.nodes['Principled BSDF']
tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(os.path.join(TEX, 'moon_color_2k.jpg')); nt.links.new(tx.outputs['Color'], b.inputs['Base Color'])
nt.links.new(tx.outputs['Color'], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = 1.2; b.inputs['Roughness'].default_value = 1.0
moon.data.materials.append(mm); moon.rotation_euler = (math.radians(90), 0, math.radians(-90))
# ghat steps
stone = mat('stone', (0.16, 0.12, 0.1, 1), rough=.9)
for i in range(7):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.3 + i * 1.1, 0.25 + i * -0.12)); o = bpy.context.object; o.scale = (9, 1.1, 0.5); o.data.materials.append(stone)
# diya: lathe bowl + emissive flame, 300 instances via collection instances
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.09); bowl = bpy.context.object; bowl.scale = (1, 1, .45); bowl.data.materials.append(mat('clay', (0.5, 0.2, 0.08, 1), rough=.8))
bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=6, radius=0.035); fl = bpy.context.object; fl.scale = (.8, .8, 1.8); fl.location = (0, 0, .07); fl.data.materials.append(mat('flame', (1.0, 0.55, 0.12, 1), emit=25))
col = bpy.data.collections.new('diya'); bpy.context.scene.collection.children.link(col)
for o in (bowl, fl):
    for c in o.users_collection: c.objects.unlink(o)
    col.objects.link(o)
col.hide_viewport = col.hide_render = True
random.seed(3); N = 300
for i in range(N):
    inst = bpy.data.objects.new(f'd{i}', None); inst.instance_type = 'COLLECTION'; inst.instance_collection = col
    r = i // 50; inst.location = (random.uniform(-4, 4), -0.2 + r * 1.1 + random.uniform(-.3, .3), 0.58 + r * -0.12); inst.scale = (1.4,) * 3; bpy.context.scene.collection.objects.link(inst)
# lights: a weak sun as moonlight
sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 1.0; sun.color = (.7, .8, 1); so = bpy.data.objects.new('sun', sun); so.rotation_euler = (math.radians(55), 0, math.radians(30)); sc.collection.objects.link(so)
cam = bpy.data.cameras.new('c'); cam.lens = 38; co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
co.location = (0, -5.5, 1.2); co.rotation_euler = (math.radians(86), 0, 0)
t0 = time.time(); times = []
for f in range(NF):
    co.location.y = -5.5 + f * 0.1; sc.render.filepath = f'{OUT}/f{f:03d}.png'; t1 = time.time(); bpy.ops.render.render(write_still=True); times.append(time.time() - t1); print(f'frame {f}: {times[-1]:.1f} s', flush=True)
avg = sum(times[1:] or times) / len(times[1:] or times)
print(f'RESULT samples={S} size={W}x{H} first={times[0]:.1f}s avg_after_first={avg:.1f}s -> 60 s @24 fps (1440 frames) ~ {avg*1440/3600:.1f} h; 30 fps (1800) ~ {avg*1800/3600:.1f} h')
