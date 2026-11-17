import bpy, time, math, sys
bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene; sc.render.engine='CYCLES'; c=sc.cycles; c.device='CPU'; c.samples=int(sys.argv[1]); c.use_denoising=True; c.denoiser='OPENIMAGEDENOISE'
sc.render.resolution_x=int(sys.argv[2]); sc.render.resolution_y=int(sys.argv[3]); sc.render.filepath='/tmp/claude-0/-home-user-video-generator/75fd6380-6aad-5303-a40f-87cfe11bc6e2/scratchpad/bpytest/out.png'
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=7,radius=1.0); o=bpy.context.object
tex=bpy.data.textures.new('n','CLOUDS'); tex.noise_scale=.55; tex.noise_depth=4
m=o.modifiers.new('d','DISPLACE'); m.texture=tex; m.strength=.35
tex2=bpy.data.textures.new('n2','VORONOI'); tex2.noise_scale=.25
m2=o.modifiers.new('d2','DISPLACE'); m2.texture=tex2; m2.strength=.12
mat=bpy.data.materials.new('r'); mat.use_nodes=True; n=mat.node_tree.nodes; l=mat.node_tree.links; b=n['Principled BSDF']
b.inputs['Base Color'].default_value=(.09,.085,.08,1); b.inputs['Roughness'].default_value=.9
nt=n.new('ShaderNodeTexNoise'); nt.inputs['Scale'].default_value=18; nt.inputs['Detail'].default_value=12
bump=n.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.8; l.new(nt.outputs['Fac'],bump.inputs['Height']); l.new(bump.outputs['Normal'],b.inputs['Normal'])
cr=n.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color=(.03,.028,.027,1); cr.color_ramp.elements[1].color=(.2,.18,.16,1); l.new(nt.outputs['Fac'],cr.inputs['Fac']); l.new(cr.outputs['Color'],b.inputs['Base Color'])
o.data.materials.append(mat); bpy.ops.object.shade_smooth()
bpy.ops.object.light_add(type='SUN',rotation=(math.radians(70),0,math.radians(120))); bpy.context.object.data.energy=6; bpy.context.object.data.angle=.01
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs['Color'].default_value=(0,0,0.002,1)
bpy.ops.object.camera_add(location=(2.4,-3.2,.9)); cam=bpy.context.object; sc.camera=cam
d=bpy.context.object.constraints.new('TRACK_TO'); d.target=o; d.track_axis='TRACK_NEGATIVE_Z'; d.up_axis='UP_Y'
cam.data.lens=50
t=time.time(); bpy.ops.render.render(write_still=True); print('RENDER_SECONDS',round(time.time()-t,1))
