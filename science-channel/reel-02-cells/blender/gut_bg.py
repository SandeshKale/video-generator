# Intestinal lumen plate: a tunnel lined with villi (glossy fingers), warm glow ahead. 9:16, beauty + depth.
import bpy, math, sys, os, random
sys.path.insert(0, os.path.dirname(__file__)); from cells_lib import *
OUT = os.environ.get('OUT', os.path.join(os.path.dirname(__file__), '..', 'mockup', 'site', 'plates')); RES = (int(os.environ.get('W', 810)), int(os.environ.get('H', 1440)))
sc = setup(res=RES, samples=int(os.environ.get('SPP', 48))); sc.render.film_transparent = False; sc.view_settings.view_transform = 'Standard'
nt, out, vol = world_volume(sc, '#ffb48a', .03, .5, bg=(.02, .01, .008), bgs=1.0)
random.seed(4)
# wall
bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=6.4, depth=130, location=(0, 65, 0), rotation=(math.pi / 2, 0, 0)); tube = bpy.context.object
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.flip_normals(); bpy.ops.object.mode_set(mode='OBJECT'); bpy.ops.object.shade_smooth()
tube.data.materials.append(principled('gwall', '#7a2a2c', rough=.5, sss=.6, sss_col=(1, .35, .25), coat=.2))
# one villus mesh: capsule, slightly tapered
bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=1.0)
for v in bm.verts:
    x, y, z = v.co; v.co = (x * .30, y * .30, z * .85 + (.85 if z > 0 else 0) * 1.2 * (z > 0) + .0)   # elongate the upper half into a finger
bm.normal_update(); vme = bpy.data.meshes.new('villus'); bm.to_mesh(vme); bm.free()
for p in vme.polygons: p.use_smooth = True
VM = principled('villus', '#f0a37c', rough=.22, sss=.55, sss_col=(1, .45, .3), coat=.7, emit='#ff7a4a', emit_s=.12); nodes = VM.node_tree.nodes; L = VM.node_tree.links
tc = nodes.new('ShaderNodeTexCoord'); vo = nodes.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 18; L.new(tc.outputs['Object'], vo.inputs['Vector'])
ramp = nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = srgb('#d9785c'); ramp.color_ramp.elements[1].color = srgb('#ffd0a0'); L.new(vo.outputs['Distance'], ramp.inputs['Fac']); L.new(ramp.outputs['Color'], nodes['Principled BSDF'].inputs['Base Color'])
vme.materials.append(VM)
ring_n = 26; Rw = 6.2; n = 0
for iy in range(0, 62):
    y = 1.5 + iy * 1.45
    for k in range(ring_n):
        th = (k + (iy % 2) * .5) / ring_n * 2 * math.pi + random.uniform(-.05, .05)
        pos = mathutils.Vector((math.cos(th) * Rw, y + random.uniform(-.3, .3), math.sin(th) * Rw)); inward = mathutils.Vector((-math.cos(th), 0, -math.sin(th)))
        L_ = random.uniform(.8, 1.25); o = bpy.data.objects.new('v', vme); sc.collection.objects.link(o); o.location = pos
        o.rotation_euler = (inward + mathutils.Vector((random.uniform(-.18, .18), random.uniform(-.25, .25), random.uniform(-.18, .18)))).to_track_quat('Z', 'Y').to_euler(); o.scale = (1.0, 1.0, 1.25 * L_); n += 1
print('villi', n)
bpy.ops.mesh.primitive_uv_sphere_add(radius=9, location=(0, 118, 0)); g = bpy.context.object; g.data.materials.append(emission('glow', '#ffb283', 45))
bpy.ops.object.light_add(type='POINT', location=(0, -2.5, 0.5)); pl = bpy.context.object; pl.data.energy = 1400; pl.data.color = (1, .68, .5); pl.data.shadow_soft_size = 2
bpy.ops.object.light_add(type='POINT', location=(0, 18, 0)); p2 = bpy.context.object; p2.data.energy = 9000; p2.data.color = (1, .7, .52); p2.data.shadow_soft_size = 2.5
cam = bpy.data.cameras.new('c'); cam.sensor_fit = 'VERTICAL'; cam.sensor_height = 24; cam.lens = 22; co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
co.location = (0, -3, 0); co.rotation_euler = (math.pi / 2, 0, 0)
render_pair(sc, os.path.join(OUT, 'gut_bg.png'), os.path.join(OUT, 'gut_bg_depth.png'), co, 3, 90)
print('gut done')
