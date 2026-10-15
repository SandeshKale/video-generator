# Capillary interior plate: endothelial wall tunnel with a warm glow at the far end and light haze. 9:16, beauty + depth.
import bpy, math, sys, os, random
sys.path.insert(0, os.path.dirname(__file__)); from cells_lib import *
OUT = os.environ.get('OUT', os.path.join(os.path.dirname(__file__), '..', 'mockup', 'site', 'plates')); RES = (int(os.environ.get('W', 810)), int(os.environ.get('H', 1440)))
sc = setup(res=RES, samples=int(os.environ.get('SPP', 48))); sc.render.film_transparent = False; sc.view_settings.view_transform = 'Standard'; sc.view_settings.exposure = -.6
nt, out, vol = world_volume(sc, '#ff8a6a', .035, .55, bg=(.02, .005, .008), bgs=1.0)
# wall: inward-facing tube with endothelial cell pattern (voronoi bump + colour variation)
bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=6.0, depth=150, location=(0, 65, 0), rotation=(math.pi / 2, 0, 0)); tube = bpy.context.object
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.flip_normals(); bpy.ops.mesh.remove_doubles(); bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.shade_smooth(); mod = tube.modifiers.new('sub', 'SUBSURF'); mod.subdivision_type = 'SIMPLE'; mod.levels = 2; mod.render_levels = 2
W = principled('wall', '#6e1c26', rough=.42, sss=.7, sss_col=(1, .3, .25), coat=.25, emit='#7a1020', emit_s=.22); nodes = W.node_tree.nodes; L = W.node_tree.links
tc = nodes.new('ShaderNodeTexCoord'); vo = nodes.new('ShaderNodeTexVoronoi'); vo.feature = 'DISTANCE_TO_EDGE'; vo.inputs['Scale'].default_value = 5.0
mp = nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1.0, 2.2, 1.0); L.new(tc.outputs['Object'], mp.inputs[0]); L.new(mp.outputs[0], vo.inputs['Vector'])
bump = nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = .55; bump.inputs['Distance'].default_value = .5; L.new(vo.outputs['Distance'], bump.inputs['Height'])
L.new(bump.outputs['Normal'], nodes['Principled BSDF'].inputs['Normal'])
ramp = nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = srgb('#3a0b14'); ramp.color_ramp.elements[1].color = srgb('#a3303a'); L.new(vo.outputs['Distance'], ramp.inputs['Fac']); L.new(ramp.outputs['Color'], nodes['Principled BSDF'].inputs['Base Color'])
tube.data.materials.append(W)
# far-end glow + soft light near camera
bpy.ops.mesh.primitive_uv_sphere_add(radius=4.5, location=(0, 128, 0)); g = bpy.context.object; g.data.materials.append(emission('glow', '#ff7a4a', 2.2))
bpy.ops.object.light_add(type='POINT', location=(0, -3, 1.2)); pl = bpy.context.object; pl.data.energy = 700; pl.data.color = (1, .55, .45); pl.data.shadow_soft_size = 2
bpy.ops.object.light_add(type='POINT', location=(2.5, 14, 2.5)); p2 = bpy.context.object; p2.data.energy = 2500; p2.data.color = (1, .62, .5); p2.data.shadow_soft_size = 3
cam = bpy.data.cameras.new('c'); cam.sensor_fit = 'VERTICAL'; cam.sensor_height = 24; cam.lens = 22; co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
co.location = (0.4, -4, 0.3); co.rotation_euler = (math.pi / 2 - .01, 0, math.radians(2)); cam.dof.use_dof = False
render_pair(sc, os.path.join(OUT, 'cap_bg.png'), os.path.join(OUT, 'cap_bg_depth.png'), co, 3, 90)
print('capillary done')
