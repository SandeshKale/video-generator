import sys, math, bpy
from mathutils import Vector
def lin(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]; return tuple(((x+.055)/1.055)**2.4 if x>.04045 else x/12.92 for x in c)+(1,)
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=64; sc.cycles.use_denoising=True; sc.view_settings.view_transform='AgX'
sc.render.resolution_x,sc.render.resolution_y=1080,1200; sc.render.film_transparent=False
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; b=w.node_tree.nodes['Background']; b.inputs[0].default_value=lin('#bfe3ee'); b.inputs[1].default_value=1.3
def mat(c,r):
    x=bpy.data.materials.new('m'); x.use_nodes=True; p=x.node_tree.nodes['Principled BSDF']; p.inputs['Base Color'].default_value=lin(c); p.inputs['Roughness'].default_value=r; return x
bpy.ops.mesh.primitive_grid_add(x_subdivisions=500,y_subdivisions=500,size=60); sea=bpy.context.object; bpy.ops.object.shade_smooth(); m=mat('#0f7f95',.03); m.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value=.6; sea.data.materials.append(m)
tx=bpy.data.textures.new('n','CLOUDS'); tx.noise_scale=.5; tx.noise_depth=4; d=sea.modifiers.new('d','DISPLACE'); d.texture=tx; d.strength=.04
# pumice
x=bpy.data.materials.new('pum'); x.use_nodes=True; n=x.node_tree; bs=n.nodes['Principled BSDF']; tc=n.nodes.new('ShaderNodeTexCoord'); v=n.nodes.new('ShaderNodeTexVoronoi'); v.inputs['Scale'].default_value=22
cr=n.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position=.18; cr.color_ramp.elements[0].color=lin('#3a342d'); cr.color_ramp.elements[1].position=.42; cr.color_ramp.elements[1].color=lin('#d9cfbd')
bm=n.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value=1.4
n.links.new(tc.outputs['Object'],v.inputs['Vector']); n.links.new(v.outputs['Distance'],cr.inputs[0]); n.links.new(cr.outputs[0],bs.inputs['Base Color']); n.links.new(v.outputs['Distance'],bm.inputs['Height']); n.links.new(bm.outputs[0],bs.inputs['Normal']); bs.inputs['Roughness'].default_value=.92
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=6,radius=.55,location=(0,0,.28)); st=bpy.context.object; st.scale=(1.15,.85,.78); bpy.ops.object.shade_smooth()
t2=bpy.data.textures.new('v','VORONOI'); t2.noise_scale=.1; d2=st.modifiers.new('d','DISPLACE'); d2.texture=t2; d2.strength=-.07
t3=bpy.data.textures.new('c','CLOUDS'); t3.noise_scale=.7; d3=st.modifiers.new('d3','DISPLACE'); d3.texture=t3; d3.strength=.14
st.data.materials.append(x)
sun=bpy.data.lights.new('s','SUN'); sun.energy=4.5; so=bpy.data.objects.new('s',sun); so.rotation_euler=(.9,.2,.7); sc.collection.objects.link(so)
cd=bpy.data.cameras.new('c'); cd.lens=60; cd.dof.use_dof=True; cd.dof.focus_object=st; cd.dof.aperture_fstop=4; cam=bpy.data.objects.new('c',cd); sc.collection.objects.link(cam); sc.camera=cam
cam.location=(1.0,-3.9,.75); cam.rotation_euler=(Vector((0,0,.3))-cam.location).to_track_quat('-Z','Y').to_euler()
sc.render.filepath='/home/user/video-generator/reels/science/reel-pumice-raft/tex/cover_stone.png'; bpy.ops.render.render(write_still=True)
