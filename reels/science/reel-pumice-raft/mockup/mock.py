import sys, math, time, bpy, random
sys.path.insert(0,'/home/user/video-generator/scripts'); import blender_text as BT
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
def lin(h): h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]; return tuple(((x+.055)/1.055)**2.4 if x>.04045 else x/12.92 for x in c)+(1,)
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=24; sc.cycles.use_denoising=True
sc.view_settings.view_transform='AgX'
W0,H0=540,960; sc.render.resolution_x,sc.render.resolution_y=W0,H0; sc.render.resolution_percentage=100
BT.init(1080,1920)
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; bg=w.node_tree.nodes['Background']; bg.inputs[0].default_value=lin('#0b2230'); bg.inputs[1].default_value=.8
def mat(c,r=.5,m=0,t=0,ior=1.33):
    x=bpy.data.materials.new('m'); x.use_nodes=True; b=x.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value=lin(c) if isinstance(c,str) else c; b.inputs['Roughness'].default_value=r; b.inputs['Metallic'].default_value=m
    if t: b.inputs['Transmission Weight'].default_value=t; b.inputs['IOR'].default_value=ior
    return x
# water
bpy.ops.mesh.primitive_grid_add(x_subdivisions=160,y_subdivisions=160,size=14); sea=bpy.context.object
sea.data.materials.append(mat('#1d6b78',.05,0,1.0))
dm=sea.modifiers.new('d','DISPLACE'); tx=bpy.data.textures.new('n','CLOUDS'); tx.noise_scale=.9; dm.texture=tx; dm.strength=.06
# stone
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5,radius=.55,location=(0,0,.4)); st=bpy.context.object; st.scale=(1.1,.9,.8)
bpy.ops.object.shade_smooth()
t2=bpy.data.textures.new('v','VORONOI'); t2.noise_scale=.18; d2=st.modifiers.new('d','DISPLACE'); d2.texture=t2; d2.strength=-.18
t3=bpy.data.textures.new('c','CLOUDS'); t3.noise_scale=.5; d3=st.modifiers.new('d3','DISPLACE'); d3.texture=t3; d3.strength=.12
st.data.materials.append(mat('#d9cfc0',.95))
# lights
ln=bpy.data.lights.new('k','AREA'); ln.energy=900; ln.size=3; lo=bpy.data.objects.new('k',ln); lo.location=(2,-2,4); lo.rotation_euler=(.9,.3,.6); sc.collection.objects.link(lo)
sun=bpy.data.lights.new('s','SUN'); sun.energy=2.5; so=bpy.data.objects.new('s',sun); so.rotation_euler=(.7,.2,.5); sc.collection.objects.link(so)
cd=bpy.data.cameras.new('c'); cd.lens=50; cd.dof.use_dof=True; cd.dof.focus_object=st; cd.dof.aperture_fstop=3.2
cam=bpy.data.objects.new('c',cd); sc.collection.objects.link(cam); sc.camera=cam
labs=[BT.label(cam,'DOOBA? NAHI.',BT.ANTON,120,fill='#f1f3f8',u=-.40,v=.36,dist=5,outline=('#05131a',5),align='left'),
      BT.label(cam,'PUMICE · VOLCANIC FROTH',BT.PLEX_SEMI,34,fill='#ffb347',u=-.40,v=.27,dist=5,outline=('#05131a',3)),]
others=[o for o in bpy.data.objects if o not in labs and o.type!='CAMERA']
N=int(sys.argv[-1]) if sys.argv[-1].isdigit() else 24
def ss(x): x=max(0,min(1,x)); return x*x*(3-2*x)
t0=time.time()
for f in range(N):
    t=f/24
    z=3.2-3.0*min(1,t/.35) if t<.35 else .4+.03*math.sin((t-.35)*7)*math.exp(-(t-.35)*1.5)  # drop then bob
    st.location=(0,0,max(.25,z)); st.rotation_euler=(.1*math.sin(t*3),.08*math.sin(t*2.3),t*.35)
    p=ss(t/1.0); cam.location=(0,-5.0+1.2*p,1.6-.5*p); d=(st.location-cam.location+Vector((0,0,.15))); cam.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
    sc.render.filepath=f'/tmp/pm/b{f:03d}.png'; bpy.ops.render.render(write_still=True)
    for l in labs: BT.set_alpha(l, ss((t-.3)/.3))
    sc.camera.data.dof.use_dof=False
    BT.render_overlay(f'/tmp/pm/o{f:03d}.png',labs,others,samples=4); sc.camera.data.dof.use_dof=True
    BT.composite(f'/tmp/pm/b{f:03d}.png',f'/tmp/pm/o{f:03d}.png',f'/tmp/pm/f{f:03d}.png')
print('SPF',(time.time()-t0)/N)
