import sys, math, time, bpy, random
sys.path.insert(0,'/home/user/video-generator/scripts'); import blender_text as BT
from mathutils import Vector
SHOT=sys.argv[-2]; N=int(sys.argv[-1])
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
def lin(h): h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]; return tuple(((x+.055)/1.055)**2.4 if x>.04045 else x/12.92 for x in c)+(1,)
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=24; sc.cycles.use_denoising=True; sc.view_settings.view_transform='AgX'
sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage=540,960,100; BT.init(1080,1920)
# sky: gradient world with bright horizon so water reflects it
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; nt=w.node_tree; nt.nodes.clear()
tc=nt.nodes.new('ShaderNodeTexCoord'); sp=nt.nodes.new('ShaderNodeSeparateXYZ'); mp=nt.nodes.new('ShaderNodeMapRange'); cr=nt.nodes.new('ShaderNodeValToRGB'); bgn=nt.nodes.new('ShaderNodeBackground'); out=nt.nodes.new('ShaderNodeOutputWorld')
mp.inputs[1].default_value=-.05; mp.inputs[2].default_value=.8
cr.color_ramp.elements[0].color=lin('#f0c9a0'); cr.color_ramp.elements[1].color=lin('#2a5f86'); bgn.inputs[1].default_value=1.2
nt.links.new(tc.outputs['Generated'],sp.inputs[0]); nt.links.new(sp.outputs['Z'],mp.inputs[0]); nt.links.new(mp.outputs[0],cr.inputs[0]); nt.links.new(cr.outputs[0],bgn.inputs[0]); nt.links.new(bgn.outputs[0],out.inputs[0])
def pm(c,r=.5,t=0,ior=1.33):
    x=bpy.data.materials.new('m'); x.use_nodes=True; b=x.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value=lin(c); b.inputs['Roughness'].default_value=r
    if t: b.inputs['Transmission Weight'].default_value=t; b.inputs['IOR'].default_value=ior
    return x
# sea: big displaced grid (fine ripples) 
bpy.ops.mesh.primitive_grid_add(x_subdivisions=700,y_subdivisions=700,size=60); sea=bpy.context.object; bpy.ops.object.shade_smooth()
sm=pm('#1b5f73',.03); sea.data.materials.append(sm)
tx=bpy.data.textures.new('n','CLOUDS'); tx.noise_scale=.5; tx.noise_depth=4; dm=sea.modifiers.new('d','DISPLACE'); dm.texture=tx; dm.strength=.035
nd=sm.node_tree.nodes; b=nd['Principled BSDF']; b.inputs['Coat Weight'].default_value=.6
# pumice material: cream with dark pores, bump from voronoi
def pumice():
    x=bpy.data.materials.new('pum'); x.use_nodes=True; n=x.node_tree; bsdf=n.nodes['Principled BSDF']
    tc=n.nodes.new('ShaderNodeTexCoord'); v=n.nodes.new('ShaderNodeTexVoronoi'); v.inputs['Scale'].default_value=22; v.feature='DISTANCE_TO_EDGE' if False else 'F1'
    ns=n.nodes.new('ShaderNodeTexNoise'); ns.inputs['Scale'].default_value=9; ns.inputs['Detail'].default_value=8
    cr=n.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position=.18; cr.color_ramp.elements[0].color=lin('#3a342d'); cr.color_ramp.elements[1].position=.42; cr.color_ramp.elements[1].color=lin('#cfc5b4')
    bm=n.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value=1.4
    n.links.new(tc.outputs['Object'],v.inputs['Vector']); n.links.new(tc.outputs['Object'],ns.inputs['Vector'])
    mix=n.nodes.new('ShaderNodeMath'); mix.operation='ADD'; n.links.new(v.outputs['Distance'],mix.inputs[0]); n.links.new(ns.outputs['Fac'],mix.inputs[1]); mix.inputs[1].default_value=0
    mul=n.nodes.new('ShaderNodeMath'); mul.operation='MULTIPLY'; mul.inputs[1].default_value=1.0; n.links.new(v.outputs['Distance'],mul.inputs[0])
    n.links.new(mul.outputs[0],cr.inputs[0]); n.links.new(cr.outputs[0],bsdf.inputs['Base Color']); n.links.new(v.outputs['Distance'],bm.inputs['Height']); n.links.new(bm.outputs[0],bsdf.inputs['Normal']); bsdf.inputs['Roughness'].default_value=.92
    return x
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=6,radius=.5,location=(0,0,.2)); st=bpy.context.object; st.scale=(1.15,.85,.75); bpy.ops.object.shade_smooth()
t2=bpy.data.textures.new('v','VORONOI'); t2.noise_scale=.1; d2=st.modifiers.new('d','DISPLACE'); d2.texture=t2; d2.strength=-.16
t3=bpy.data.textures.new('c','CLOUDS'); t3.noise_scale=.7; d3=st.modifiers.new('d3','DISPLACE'); d3.texture=t3; d3.strength=.16
st.data.materials.append(pumice())
sun=bpy.data.lights.new('s','SUN'); sun.energy=4; sun.angle=.02; so=bpy.data.objects.new('s',sun); so.rotation_euler=(1.15,.2,.6); sc.collection.objects.link(so)
cd=bpy.data.cameras.new('c'); cd.lens=45; cd.dof.use_dof=True; cd.dof.focus_object=st; cd.dof.aperture_fstop=2.8
cam=bpy.data.objects.new('c',cd); sc.collection.objects.link(cam); sc.camera=cam
def ss(x): x=max(0,min(1,x)); return x*x*(3-2*x)
def aim(o,tgt): o.rotation_euler=(tgt-o.location).to_track_quat('-Z','Y').to_euler()
labs=[]; extra=[]
if SHOT=='B':   # dive: sea patch carrying the real NASA plate, crane up to nadir, drifting 3D pumice chips
    st.hide_render=True; sea.hide_render=True; bgw=bpy.data.worlds['w'].node_tree.nodes['Background']; bgw.inputs[0].default_value=lin('#06131a'); [nt.links.remove(l) for l in list(nt.links) if l.to_node==bgw]
    img=bpy.data.images.load('/home/user/video-generator/reels/science/reel-pumice-raft/research/img/nasa_oli_20260604.jpg')
    bpy.ops.mesh.primitive_plane_add(size=1); pl=bpy.context.object; pl.scale=(14.4,9.6,1); pl.location=(0,0,0)
    m=bpy.data.materials.new('p'); m.use_nodes=True; n=m.node_tree; n.nodes.clear(); tx=n.nodes.new('ShaderNodeTexImage'); tx.image=img; em=n.nodes.new('ShaderNodeEmission'); em.inputs[1].default_value=1.0; o=n.nodes.new('ShaderNodeOutputMaterial'); n.links.new(tx.outputs[0],em.inputs[0]); n.links.new(em.outputs[0],o.inputs[0]); pl.data.materials.append(m)
    random.seed(4); chips=[]
    for i in range(3500):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.012,location=(0,0,.03)); c=bpy.context.object; c.data.materials.append(pm('#e8dfcf',.9)); chips.append((c,random.random(),random.gauss(0,1),random.random()))
    ex=[c for c,_,_,_ in chips]+[pl]
    labs=[BT.label(cam,'BISMARCK SEA · 4 JUN 2026',BT.PLEX_SEMI,34,fill='#ffb347',u=-.40,v=.40,dist=5,outline=('#05131a',3)),
          BT.label(cam,'ILLUSTRATIVE PUMICE DOTS · NASA EARTH OBSERVATORY / LANDSAT 8',BT.PLEX_SEMI,26,fill='#f1f3f8',u=-.40,v=-.40,dist=5,outline=('#05131a',3))]
    others=[o for o in bpy.data.objects if o not in labs and o.type!='CAMERA']
    for f in range(N):
        t=f/24; p=ss(t/1.0)
        cam.location=Vector((0,-3.2-3.5*p,3.0+7*p)); aim(cam,Vector((0,.6,0))); sc.camera.data.dof.focus_object=pl
        for c,u,v,w in chips:
            x=(u-.5)*13+t*.2*(.5+w); y=v*1.6+(u-.5)*.8; c.location=(((x+6.5)%13)-6.5,-2.0+y,.03)
        for l in labs: BT.set_alpha(l,ss((t-.1)/.3))
        sc.render.filepath=f'/tmp/pm2/b{f:03d}.png'; bpy.ops.render.render(write_still=True)
        sc.camera.data.dof.use_dof=False; BT.render_overlay(f'/tmp/pm2/o{f:03d}.png',labs,others,samples=4); sc.camera.data.dof.use_dof=True
        BT.composite(f'/tmp/pm2/b{f:03d}.png',f'/tmp/pm2/o{f:03d}.png',f'/tmp/pm2/B{f:03d}.png')
else:
    labs=[BT.label(cam,'DOOBA? NAHI.',BT.ANTON,120,fill='#f1f3f8',u=-.40,v=.38,dist=5,outline=('#05131a',5)),
          BT.label(cam,'PUMICE · VOLCANIC FROTH',BT.PLEX_SEMI,34,fill='#ffb347',u=-.40,v=.30,dist=5,outline=('#05131a',3))]
    others=[o for o in bpy.data.objects if o not in labs and o.type!='CAMERA']
    # ripple rings: small torus emitters
    for f in range(N):
        t=f/24; tl=t-.3
        z=3.0-2.85*min(1,t/.3) if t<.3 else .12+.05*math.sin(tl*8)*math.exp(-tl*1.6)
        st.location=(0,0,z); st.rotation_euler=(.12*math.sin(t*3),.08*math.sin(t*2.3),t*.4)
        a=-.9+1.5*ss(t/1.0); r=4.6-1.6*ss(t/1.0)   # orbit + dolly in, low camera
        cam.location=Vector((math.sin(a)*r,-math.cos(a)*r,.55+.35*(1-ss(t/1.0)))); aim(cam,Vector((0,0,.2)))
        for l in labs: BT.set_alpha(l,ss((t-.3)/.3))
        sc.render.filepath=f'/tmp/pm2/b{f:03d}.png'; bpy.ops.render.render(write_still=True)
        sc.camera.data.dof.use_dof=False; BT.render_overlay(f'/tmp/pm2/o{f:03d}.png',labs,others,samples=4); sc.camera.data.dof.use_dof=True
        BT.composite(f'/tmp/pm2/b{f:03d}.png',f'/tmp/pm2/o{f:03d}.png',f'/tmp/pm2/A{f:03d}.png')
