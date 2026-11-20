"""Pumice raft film shots (Blender Cycles). usage: python3 film.py SHOT t0 t1 fps outdir W H samples start
Each frame is a pure function of t. Text = scripts/blender_text.py (crisp overlay pass at FINAL 1080x1920)."""
import sys, os, math, json, random, bpy
sys.path.insert(0, '/home/user/video-generator/scripts'); import blender_text as BT
from mathutils import Vector
SHOT = sys.argv[-9]; T0, T1, FPS = float(sys.argv[-8]), float(sys.argv[-7]), float(sys.argv[-6]); OUT = sys.argv[-5]; W, H = int(sys.argv[-4]), int(sys.argv[-3]); SAMP = int(sys.argv[-2]); START = int(sys.argv[-1])
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(R + '/site/timing.js').read(); TM = json.loads(s[s.index('=') + 1:].rstrip().rstrip(';')); SEN = {x['id']: x for x in TM['sentences']}
def CW(id, w):
    for c in TM['cap']:
        if c['s'] == id and ''.join(ch for ch in c['w'].lower() if ch.isalnum()).startswith(w): return c['t0']
    return SEN[id]['t0'] + 1.0
def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]; return tuple(((x+.055)/1.055)**2.4 if x > .04045 else x/12.92 for x in c) + (1,)
def ss(x): x = max(0, min(1, x)); return x*x*(3-2*x)
def eo(x): x = max(0, min(1, x)); return 1 - (1-x)**3
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMP; sc.cycles.use_denoising = True; sc.view_settings.view_transform = 'AgX'
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = W, H, 100; BT.init(1080, 1920)
def sky(top, hor, st=1.2):
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree; nt.nodes.clear()
    tc = nt.nodes.new('ShaderNodeTexCoord'); sp = nt.nodes.new('ShaderNodeSeparateXYZ'); mp = nt.nodes.new('ShaderNodeMapRange'); cr = nt.nodes.new('ShaderNodeValToRGB'); bg = nt.nodes.new('ShaderNodeBackground'); out = nt.nodes.new('ShaderNodeOutputWorld')
    mp.inputs[1].default_value = -.05; mp.inputs[2].default_value = .8; cr.color_ramp.elements[0].color = lin(hor); cr.color_ramp.elements[1].color = lin(top); bg.inputs[1].default_value = st
    nt.links.new(tc.outputs['Generated'], sp.inputs[0]); nt.links.new(sp.outputs['Z'], mp.inputs[0]); nt.links.new(mp.outputs[0], cr.inputs[0]); nt.links.new(cr.outputs[0], bg.inputs[0]); nt.links.new(bg.outputs[0], out.inputs[0])
def pm(c, r=.5, em=0):
    x = bpy.data.materials.new('m'); x.use_nodes = True; b = x.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = lin(c); b.inputs['Roughness'].default_value = r
    if em: b.inputs['Emission Color'].default_value = lin(c); b.inputs['Emission Strength'].default_value = em
    return x
def sea(col='#1b5f73', size=60):
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=700, y_subdivisions=700, size=size); o = bpy.context.object; bpy.ops.object.shade_smooth()
    m = pm(col, .03); m.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value = .6; o.data.materials.append(m)
    tx = bpy.data.textures.new('n', 'CLOUDS'); tx.noise_scale = .5; tx.noise_depth = 4; d = o.modifiers.new('d', 'DISPLACE'); d.texture = tx; d.strength = .035; return o
def pumice_mat(cav=False):
    x = bpy.data.materials.new('pum'); x.use_nodes = True; n = x.node_tree; bsdf = n.nodes['Principled BSDF']
    tc = n.nodes.new('ShaderNodeTexCoord'); v = n.nodes.new('ShaderNodeTexVoronoi'); v.inputs['Scale'].default_value = 22
    cr = n.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].position = .18; cr.color_ramp.elements[0].color = lin('#3a342d'); cr.color_ramp.elements[1].position = .42; cr.color_ramp.elements[1].color = lin('#cfc5b4')
    bm = n.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = 1.4
    n.links.new(tc.outputs['Object'], v.inputs['Vector']); n.links.new(v.outputs['Distance'], cr.inputs[0]); n.links.new(cr.outputs[0], bsdf.inputs['Base Color']); n.links.new(v.outputs['Distance'], bm.inputs['Height']); n.links.new(bm.outputs[0], bsdf.inputs['Normal']); bsdf.inputs['Roughness'].default_value = .92
    if cav:
        cr.color_ramp.elements[0].color = lin('#ffb347'); cr.color_ramp.elements[1].color = lin('#e9dfcd'); n.links.new(cr.outputs[0], bsdf.inputs['Emission Color']); bsdf.inputs['Emission Strength'].default_value = .7
    return x
def stone(r=.5, loc=(0, 0, .2), sc_=(1.15, .85, .75), spike=-.07):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=6, radius=r, location=loc); o = bpy.context.object; o.scale = sc_; bpy.ops.object.shade_smooth()
    t2 = bpy.data.textures.new('v', 'VORONOI'); t2.noise_scale = .1; d2 = o.modifiers.new('d', 'DISPLACE'); d2.texture = t2; d2.strength = spike
    t3 = bpy.data.textures.new('c', 'CLOUDS'); t3.noise_scale = .7; d3 = o.modifiers.new('d3', 'DISPLACE'); d3.texture = t3; d3.strength = .14
    o.data.materials.append(pumice_mat()); return o
def sunlight(e=4, rot=(1.15, .2, .6), col=(1, 1, 1)):
    l = bpy.data.lights.new('s', 'SUN'); l.energy = e; l.angle = .02; l.color = col; o = bpy.data.objects.new('s', l); o.rotation_euler = rot; sc.collection.objects.link(o); return o
def camera(lens=45, fs=2.8):
    cd = bpy.data.cameras.new('c'); cd.lens = lens; cd.dof.use_dof = True; cd.dof.aperture_fstop = fs; cam = bpy.data.objects.new('c', cd); sc.collection.objects.link(cam); sc.camera = cam; return cam
def aim(o, tgt): o.rotation_euler = (Vector(tgt) - o.location).to_track_quat('-Z', 'Y').to_euler()
LAB = []   # (obj, t_on, t_off)
def L(text, font, px, fill, u, v, ton, toff=None, dist=5, outline=('#05131a', 4)):
    o = BT.label(sc.camera, text, font, px, fill=fill, u=u, v=v, dist=dist, outline=outline); LAB.append((o, ton, toff)); return o
AMB = '#ffb347'; INK = '#f1f3f8'
cam = camera()
# ---------------- shot builders: each returns update(t) ----------------
def build_STONE():
    sky('#2a5f86', '#f0c9a0'); sunlight(); sea(); st = stone(); cam.data.dof.focus_object = st; sunlight(1.5, (.7, .2, -.8), (.8, .9, 1))
    t_in = CW('s1', 'dooba'); t_ln = CW('s2', 'pumice')
    L('DOOBA? NAHI.', BT.ANTON, 120, INK, -.40, .38, t_in, SEN['s2']['t0'] + 3.5, outline=('#05131a', 5)); L('PUMICE · VOLCANIC FROTH', BT.PLEX_SEMI, 34, AMB, -.40, .30, t_ln)
    def up(t):
        tl = max(0, t - .5); z = 3.0 - 2.85*min(1, t/.5) if t < .5 else .12 + .05*math.sin(tl*8)*math.exp(-tl*1.4)
        st.location = (0, 0, z); st.rotation_euler = (.12*math.sin(t*3), .08*math.sin(t*2.3), t*.4)
        p = ss(t/(T1-T0+.001)); a = -.9 + 1.5*p; r = 4.6 - 1.6*p; cam.location = Vector((math.sin(a)*r, -math.cos(a)*r, .55 + .35*(1-p))); aim(cam, (0, 0, .2))
    return up
def build_CUT():
    sky('#2a5f86', '#f0c9a0'); sunlight(); sea(); st = stone(.5, (0, 0, .2), (1.15, .85, .75)); st.data.materials[0] = pumice_mat()
    bpy.ops.mesh.primitive_cube_add(size=3, location=(0, -1.5, 0)); cube = bpy.context.object; cube.hide_render = True; cube.hide_viewport = True
    bm = st.modifiers.new('cut', 'BOOLEAN'); bm.object = cube; bm.operation = 'DIFFERENCE'
    bpy.ops.mesh.primitive_circle_add(vertices=64, fill_type='NGON', radius=.52, location=(0, .0, .2)); face = bpy.context.object; face.rotation_euler = (math.pi/2, 0, 0); face.scale = (1.1, .75, 1); face.data.materials.append(pumice_mat(True))
    cam.data.dof.focus_object = st; sunlight(2.0, (1.0, 0, -.2), (1, .8, .6))
    L('BULBULE = HALKA', BT.ANTON, 104, INK, -.40, .38, CW('s3', 'bulbule')); L('HAZAARON AIR CELLS · ILLUSTRATIVE CUTAWAY', BT.PLEX_SEMI, 28, AMB, -.40, .31, CW('s3', 'bulbule') + .3)
    def up(t):
        p = ss((t - T0 + 0)/(T1-T0)); st.location = (0, 0, .22 + .02*math.sin(t*2)); face.location = (0, 0, .22 + .02*math.sin(t*2)); cam.location = Vector((.7 - 1.2*p, -3.1 + 1.5*p, .75 + .1*p)); aim(cam, (0, 0, .22))
    return up
def build_SEA():
    sky('#1a2b45', '#f2a873', 1.0); sunlight(3, (1.25, .2, .9), (1, .8, .6)); s_ = sea('#14485c')
    bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=2.4, radius2=.7, depth=2.2, location=(0, 9, -.15)); cone = bpy.context.object; cone.data.materials.append(pm('#2a2623', .9))
    random.seed(3); P = []
    for i in range(420):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=.2, location=(0, 9, .2)); o = bpy.context.object; bpy.ops.object.shade_smooth(); o.data.materials.append(pm('#8a8f94', .95)); P.append((o, random.random(), random.gauss(0, .5), random.gauss(0, .5)))
    L('MAI 2026 · BISMARCK SEA', BT.PLEX_SEMI, 36, AMB, -.40, .38, CW('s4', 'mai')); L('SAMUNDAR KE NEECHE ERUPTION', BT.ANTON, 90, INK, -.40, .31, CW('s4', 'samundar'))
    def up(t):
        p = ss((t - T0)/(T1-T0)); cam.location = Vector((0, -1.5, .5 + 2.6*p)); aim(cam, (0, 9, 1.2 + 2.2*p)); cam.data.dof.focus_distance = 11; cam.data.dof.use_dof = False
        for o, ph, dx, dy in P:
            u = ((t*.22 + ph) % 1); o.location = (dx*(.3 + u*2.6), 9 + dy*(.3+u*1.4), .3 + u*7.0); sc_ = .3 + 1.2*u; o.scale = (sc_, sc_, sc_)
    return up
def build_PLATE():
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = lin('#06131a')
    img = bpy.data.images.load(R + '/research/img/nasa_oli_20260604.jpg')
    bpy.ops.mesh.primitive_plane_add(size=1); pl = bpy.context.object; pl.scale = (14.4, 9.6, 1)
    m = bpy.data.materials.new('p'); m.use_nodes = True; n = m.node_tree; n.nodes.clear(); tx = n.nodes.new('ShaderNodeTexImage'); tx.image = img; em = n.nodes.new('ShaderNodeEmission'); o = n.nodes.new('ShaderNodeOutputMaterial'); n.links.new(tx.outputs[0], em.inputs[0]); n.links.new(em.outputs[0], o.inputs[0]); pl.data.materials.append(m)
    random.seed(4); chips = []
    for i in range(1500):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=.014, location=(0, 0, .03)); c = bpy.context.object; c.data.materials.append(pm('#e8dfcf', .9)); chips.append((c, random.random(), random.gauss(0, 1), random.random()))
    t5 = SEN['s5']['t0']; t7 = SEN['s7']['t0']
    L('BISMARCK SEA · 4 JUN 2026', BT.PLEX_SEMI, 34, AMB, -.40, .40, t5 + .3, SEN['s7']['t0'] - .2)
    L('NASA EARTH OBSERVATORY / LANDSAT 8', BT.PLEX_SEMI, 26, INK, -.40, -.36, t5 + .3); L('PUMICE DOTS DRAWN BY US · ILLUSTRATIVE', BT.PLEX_SEMI, 26, INK, -.40, -.31, t5 + .3)
    L('MAHINON SE SAALON TAK · NASA', BT.PLEX_SEMI, 34, AMB, -.40, .40, t7 + .2); L('2012 RAFT: ~400 KM² AT START', BT.ANTON, 80, INK, -.40, .33, CW('s7', 'chaar'), outline=('#05131a', 5))
    def up(t):
        p = ss((t - T0)/(T1-T0)*1.6); cam.location = Vector((0, -3.2 - 3.5*p, 3.0 + 7*p)); aim(cam, (0, .6, 0)); cam.data.dof.use_dof = False
        spd = .2 + .5*ss((t - t7)/3)
        for c, u, v, w_ in chips:
            x = (u-.5)*13 + t*spd*(.5 + w_); y = v*1.6 + (u-.5)*.8; c.location = (((x + 6.5) % 13) - 6.5, -2.0 + y, .03)
    return up
def build_LEGEND():
    sky('#3b2a52', '#ff9d6a', .9); sunlight(2.5, (1.35, .2, 1.1), (1, .6, .4)); sea('#3a3558')
    st = stone(.25, (0, -1.5, .1), (1.15, .85, .75)); cam.data.dof.focus_object = st
    for i in range(16):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(-6 + i*.0, 4 + i*2.2, .35)); p = bpy.context.object; p.scale = (.35, .35, 1.3 - i*.03); p.data.materials.append(pm('#120d1c', .9))
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 4 + i*2.2 + 1.1, .85)); d = bpy.context.object; d.scale = (.28, 2.2, .14); d.data.materials.append(pm('#120d1c', .9)); d.location.x = p.location.x
    L('KAHANI · AASTHA', BT.ANTON, 110, INK, -.40, .38, SEN['s8']['t0'] + .3, outline=('#1a0f2a', 5)); L('SCIENCE: TAIRNE WALE PATTHAR ASLI HOTE HAIN', BT.PLEX_SEMI, 26, AMB, -.40, .31, CW('s8', 'vigyan'))
    def up(t):
        p = ss((t - T0)/(T1-T0)); st.location = (0, -1.5, .1 + .03*math.sin(t*2)); st.rotation_euler = (.1*math.sin(t*2.2), .06*math.sin(t*1.7), t*.25)
        cam.location = Vector((-1.6 + 2.2*p, -3.8, .5)); aim(cam, (-.2 + .9*p, -.5, .35))
    return up
def build_BUCKET():
    sky('#cfd8dc', '#f4efe6', 1.0); sunlight(3, (.9, .3, .6)); 
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0)); fl = bpy.context.object; fl.data.materials.append(pm('#c9c2b6', .8))
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=.62, depth=.8, location=(0, 0, .4), end_fill_type='NOTHING'); bk = bpy.context.object; so = bk.modifiers.new('s', 'SOLIDIFY'); so.thickness = .04; bk.data.materials.append(pm('#2f7fb0', .35))
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=.58, depth=.02, location=(0, 0, .55)); wt = bpy.context.object; mw = pm('#5fb0c8', .02); wt.data.materials.append(mw)
    st = stone(.2, (0, 0, .58), (1.2, .8, .6), -.04); cam.data.dof.focus_object = st
    L('APNA PUMICE?', BT.ANTON, 110, '#10222c', -.40, .38, SEN['s9']['t0'] + .2, outline=('#f4efe6', 4)); L('PAANI MEIN DAALKE DEKHO', BT.PLEX_SEMI, 32, '#a85c00', -.40, .31, CW('s9', 'paani'), outline=('#f4efe6', 3))
    def up(t):
        p = ss((t - T0)/(T1-T0)); st.location = (0, 0, .565 + .012*math.sin(t*2.4)); st.rotation_euler = (0, 0, t*.3)
        cam.location = Vector((1.2 + .6*p, -2.4 - 1.8*p, 1.5 + .5*p)); aim(cam, (0, 0, .45))
    return up
up = globals()['build_' + SHOT]()
others = [o for o in bpy.data.objects if o.type != 'CAMERA' and o not in [l[0] for l in LAB]]
os.makedirs(OUT, exist_ok=True); n = int(round((T1 - T0)*FPS))
for f in range(START, n):
    t = T0 + f/FPS; up(t)
    for o, ton, toff in LAB:
        a = ss((t - ton)/.25) * (1 - ss((t - toff)/.25) if toff else 1); BT.set_alpha(o, a); o.hide_render = a <= .001
    sc.render.filepath = f'{OUT}/b{f:05d}.png'; bpy.ops.render.render(write_still=True)
    vis = [o for o, _, _ in LAB if not o.hide_render]
    d = cam.data.dof.use_dof; cam.data.dof.use_dof = False
    for o, _, _ in LAB: o.hide_render = False if o in vis else True
    BT.render_overlay(f'{OUT}/o{f:05d}.png', vis, others, samples=4); cam.data.dof.use_dof = d
    BT.composite(f'{OUT}/b{f:05d}.png', f'{OUT}/o{f:05d}.png', f'{OUT}/f{f:05d}.png'); os.remove(f'{OUT}/b{f:05d}.png'); os.remove(f'{OUT}/o{f:05d}.png')
