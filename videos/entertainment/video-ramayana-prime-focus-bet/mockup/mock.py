"""Mockup shots for the landscape video (Blender Cycles). usage: python3 mock.py SHOT N   (SHOT = HOOK | BEAM | HALL | PROP)
Flat, matte shapes on paper (Bauhaus-shapes language in 3D). Areas are quantity-true; text only as small guiding tags via scripts/blender_text.py."""
import sys, os, math, json, time, bpy, bmesh
sys.path.insert(0, '/home/user/video-generator/scripts'); import blender_text as BT
from mathutils import Vector
SHOT = sys.argv[-2]; N = int(sys.argv[-1]); OUT = '/tmp/vmock/' + SHOT; os.makedirs(OUT, exist_ok=True)
FPS = 12; W0, H0 = 960, 540; BT.init(1920, 1080)
PAPER, VERM, TEAL, GOLD, SAND, INK, OX = '#F3F0E8', '#E8553D', '#0C6B58', '#F2B632', '#D9D3C3', '#1B1E2B', '#8E1F2F'
def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]; return tuple(((x+.055)/1.055)**2.4 if x > .04045 else x/12.92 for x in c) + (1,)
def ss(x): x = max(0, min(1, x)); return x*x*(3-2*x)
def eo(x): x = max(0, min(1, x)); return 1 - (1-x)**3
def ob(x):  # out-back
    x = max(0, min(1, x)); c1 = 1.5; c3 = c1 + 1; return 1 + c3*(x-1)**3 + c1*(x-1)**2
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 16; sc.cycles.use_denoising = True; sc.view_settings.view_transform = 'Standard'; sc.view_settings.exposure = -.2
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = W0, H0, 100
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bgn = w.node_tree.nodes['Background']; bgn.inputs[0].default_value = lin(PAPER); bgn.inputs[1].default_value = .55
def mat(c, r=.85, em=0):
    m = bpy.data.materials.new('m'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = lin(c); b.inputs['Roughness'].default_value = r
    if em: b.inputs['Emission Color'].default_value = lin(c); b.inputs['Emission Strength'].default_value = em
    return m
def box(x, y, z, sx, sy, sz, c, r=.85):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z)); o = bpy.context.object; o.scale = (sx, sy, sz); o.data.materials.append(mat(c, r)); return o
def ground(size=80):
    bpy.ops.mesh.primitive_plane_add(size=size, location=(0, 0, 0)); g = bpy.context.object; g.data.materials.append(mat(PAPER, 1.0)); return g
def lights(key=330, sun=.45):
    l = bpy.data.lights.new('k', 'AREA'); l.energy = key; l.size = 8; o = bpy.data.objects.new('k', l); o.location = (-5, -6, 11); o.rotation_euler = (.55, -.25, -.4); sc.collection.objects.link(o)
    s = bpy.data.lights.new('s', 'SUN'); s.energy = sun; so = bpy.data.objects.new('s', s); so.rotation_euler = (.9, .3, .5); sc.collection.objects.link(so)
def camera(lens=30, fs=5.6):
    cd = bpy.data.cameras.new('c'); cd.lens = lens; cd.dof.use_dof = True; cd.dof.aperture_fstop = fs; cam = bpy.data.objects.new('c', cd); sc.collection.objects.link(cam); sc.camera = cam; return cam
def aim(o, tgt): o.rotation_euler = (Vector(tgt) - o.location).to_track_quat('-Z', 'Y').to_euler()
cam = camera(); LAB = []
def L(text, u, v, ton, toff=None, px=30, fill=INK, font=None, dist=6):
    o = BT.label(cam, text, font or BT.PLEX_SEMI, px, fill=fill, u=u, v=v, dist=dist, outline=(PAPER, 4)); LAB.append((o, ton, toff)); return o
AREA_K = 0.08   # side = AREA_K * sqrt(value in crore): areas are proportional to the numbers
def side(v): return AREA_K * math.sqrt(v)
facts = {}
if SHOT == 'HOOK':
    lights(); ground(); cam.data.dof.use_dof = False
    sA, sB, sD = side(863.75), side(900.93), side(5062)
    a = box(-4.6, 0, 0, sA, sA, .01, TEAL); b = box(-4.6 + .55, .45, 0, sB, sB, .01, TEAL)   # two overlapping estimates (stacked, slightly different)
    b.data.materials[0] = mat('#0F8F76', .85)                                               # second estimate a shade lighter (same role)
    d = box(3.2, 0, 0, sD, sD, .01, OX)
    facts = {'india_net_sacnilk': (863.75, sA*sA), 'india_net_koimoi': (900.93, sB*sB), 'debt_gross_mar26': (5062, sD*sD)}
    L('Rs 864–901 CR  ·  INDIA NET, EST.', -.38, -.40, .9, dist=7); L('≈ Rs 5,000 CR  ·  DEBT, REPORTED', .12, -.40, 2.2, dist=7)
    def up(t):
        ha = .62*eo((t-.15)/.6); hb = .36*eo((t-.35)/.6); a.scale.z = max(.01, ha); a.location.z = a.scale.z/2; b.scale.z = max(.01, hb); b.location.z = b.scale.z/2
        k = ob((t-1.3)/.7); d.location.x = 3.2 + (1-k)*11; d.scale.z = max(.01, 1.4*eo((t-1.6)/.8)); d.location.z = d.scale.z/2
        p = ss(t/3.0); cam.location = Vector((0, -14.5 + 1.5*p, 3.0 + 4.2*p)); aim(cam, (-.6, 0, .3))
elif SHOT == 'BEAM':
    lights(); ground(); cam.data.dof.use_dof = True
    pivot = box(0, 0, 1.0, .9, .9, 2.0, GOLD); bpy.ops.mesh.primitive_cone_add(vertices=3, radius1=1.3, radius2=.0, depth=4.0, location=(0, 0, 2.0), rotation=(math.pi/2, 0, 0)); pv = bpy.context.object; pv.data.materials.append(mat(GOLD)); pivot.hide_render = True
    beam = box(0, 0, 4.2, 8.0, .35, .28, INK)
    pan_l = box(0, 0, 0, 2.5, 2.5, .08, SAND); pan_r = box(0, 0, 0, 2.5, 2.5, .08, SAND)
    rodL = box(0, 0, 0, .05, .05, 1.0, INK); rodR = box(0, 0, 0, .05, .05, 1.0, INK)
    wP = box(0, 0, 0, side(2885)*.35, side(2885)*.35, .5, VERM)   # payroll, FY24 (area ~ 2,885)
    wI = box(0, 0, 0, side(558)*.35, side(558)*.35, .5, OX)       # finance cost, FY24 (area ~ 558)
    def hollow(sz):                                                # undisclosed weights are drawn as hollow frames, never as a scaled number
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0)); h = bpy.context.object; h.scale = (sz, sz, sz*.6); wf = h.modifiers.new('w', 'WIREFRAME'); wf.thickness = .06; h.data.materials.append(mat(INK)); return h
    hS = hollow(.9); hG = hollow(.9)
    rev = box(0, 0, 0, side(3950)*.35, side(3950)*.35, .3, TEAL)  # FY24 revenue slab
    facts = {'payroll_fy24': (2885, (side(2885)*.35)**2), 'interest_fy24': (558, (side(558)*.35)**2), 'revenue_fy24': (3950, (side(3950)*.35)**2)}
    L('PAYROLL  Rs 2,885 CR', -.40, -.40, 1.0, dist=9); L('REVENUE  Rs 3,950 CR', .14, -.40, 2.6, dist=9)
    def up(t):
        k1 = eo((t-.2)/.5); k2 = eo((t-.6)/.5); k3 = eo((t-1.0)/.5); k4 = eo((t-1.4)/.5)
        load = k1*1.0 + k2*.25 + k3*.35 + k4*.25
        rev_k = eo((t-1.7)/1.1)                       # order book swells: beam levels
        th = (-.11*load*(1 - .95*rev_k)) + .03*math.sin(t*5)*math.exp(-t*.6)*(1-rev_k)
        beam.rotation_euler = (0, th, 0)
        ex = 4.0*math.cos(th); ez = 2.0 + 4.0*math.sin(th)
        L_end = Vector((-ex, 0, 4.2 + 4.0*math.sin(th))); R_end = Vector((ex, 0, 4.2 - 4.0*math.sin(th)))
        hang = 2.3
        for pan, rod, e in ((pan_l, rodL, L_end), (pan_r, rodR, R_end)):
            pan.location = Vector((e.x, 0, e.z - hang)); rod.scale = (.05, .05, hang); rod.location = Vector((e.x, 0, e.z - hang/2))
        base = Vector((L_end.x, 0, L_end.z - hang + .04))
        def drop(o, t0, off, h):                      # weights fall onto the left pan
            k = ob((t - t0)/.55); o.location = base + Vector((off[0], off[1], h/2 + (1-k)*6));
        drop(wP, .2, (-.5, .5, ), 0) if False else None
        wP.location = base + Vector((-.7, .3, .25 + (1-ob((t-.2)/.55))*7)); wI.location = base + Vector((.65, -.2, .25 + (1-ob((t-.6)/.55))*7))
        hS.location = base + Vector((.2, .75, .3 + (1-ob((t-1.0)/.55))*7)); hG.location = base + Vector((-.9, -.65, .3 + (1-ob((t-1.4)/.55))*7))
        rev.scale.z = max(.01, .3 + 1.2*rev_k); rev.location = Vector((R_end.x, 0, R_end.z - hang + .04 + rev.scale.z/2))
        a = -.45 + .5*ss(t/3.0); cam.location = Vector((math.sin(a)*15, -math.cos(a)*15, 4.4)); aim(cam, (0, 0, 2.9)); cam.data.dof.focus_distance = 15
elif SHOT == 'HALL':
    lights(key=260, sun=.15); cam.data.dof.use_dof = True
    bpy.ops.mesh.primitive_plane_add(size=120, location=(0, 14, -.01)); g = bpy.context.object; g.data.materials.append(mat('#E9E4D8', 1.0))
    me = bpy.data.meshes.new('seats'); bm = bmesh.new(); cl = bm.loops.layers.color.new('sd'); COLS, ROWS = 50, 40
    for r in range(ROWS):
        for c in range(COLS):
            x = (c - COLS/2)*.72; y = r*.9 + 2; res = bmesh.ops.create_cube(bm, size=1.0)
            for v in res['verts']: v.co = Vector((x + v.co.x*.5, y + v.co.y*.5, .3 + v.co.z*.6))
            for f in {l for v in res['verts'] for l in v.link_faces}:
                for lo in f.loops: lo[cl] = (c/(COLS-1), r/(ROWS-1), 0, 1)
    bm.to_mesh(me); bm.free(); seats = bpy.data.objects.new('seats', me); sc.collection.objects.link(seats)
    m = bpy.data.materials.new('sm'); m.use_nodes = True; n = m.node_tree; n.nodes.clear(); at = n.nodes.new('ShaderNodeAttribute'); at.attribute_name = 'sd'; sp = n.nodes.new('ShaderNodeSeparateColor')
    front = n.nodes.new('ShaderNodeValue'); cmp = n.nodes.new('ShaderNodeMath'); cmp.operation = 'GREATER_THAN'; lit = n.nodes.new('ShaderNodeBsdfPrincipled'); dim = n.nodes.new('ShaderNodeBsdfPrincipled'); mx = n.nodes.new('ShaderNodeMixShader'); out = n.nodes.new('ShaderNodeOutputMaterial')
    lit.inputs['Base Color'].default_value = lin(GOLD); lit.inputs['Emission Color'].default_value = lin(GOLD); lit.inputs['Emission Strength'].default_value = .22; lit.inputs['Roughness'].default_value = .8
    dim.inputs['Base Color'].default_value = lin('#CFC8B8'); dim.inputs['Roughness'].default_value = .9
    n.links.new(at.outputs['Color'], sp.inputs[0]); n.links.new(sp.outputs[0], cmp.inputs[0]); n.links.new(front.outputs[0], cmp.inputs[1]); n.links.new(cmp.outputs[0], mx.inputs[0])  # fac = c > front -> dim (2nd shader), else lit
    n.links.new(lit.outputs[0], mx.inputs[1]); n.links.new(dim.outputs[0], mx.inputs[2]); n.links.new(mx.outputs[0], out.inputs[0]); seats.data.materials.append(m)
    # meter dial: ring + needle
    bpy.ops.mesh.primitive_torus_add(major_radius=1.5, minor_radius=.09, location=(.4, 2.2, 1.7), rotation=(math.pi/2, 0, 0)); ring = bpy.context.object; ring.data.materials.append(mat(INK))
    needle = box(.4, 2.1, 1.7, .06, .06, 1.3, OX); tick = box(.4, 2.1, 1.7, .22, .22, .22, OX)
    L('REVENUE  −14 %  ·  FY24, REPORTED', -.38, -.40, 1.2, dist=14)
    def up(t):
        front.outputs[0].default_value = 1.15 - 1.3*ss((t-.5)/2.2)    # the dark wave sweeps from the right edge to the left
        ang = -1.1 + t*2.4; needle.location = Vector((.4 + math.sin(ang)*.65, 2.1, 1.7 + math.cos(ang)*.65)); needle.rotation_euler = (0, ang, 0)
        p = ss(t/3.0); cam.location = Vector((-6.5 + 3.0*p, -6.0 + 3.6*p, 8.5 - 6.2*p)); aim(cam, (1.6*p, 11.0 - 1.0*p, .4)); cam.data.dof.focus_distance = (cam.location - Vector((1.6*p, 11, .4))).length*.55 + 6
elif SHOT == 'PROP':
    # proportion check on pixels: orthographic top-down flat render of the HOOK shapes, count coloured pixels
    sc.view_settings.view_transform = 'Standard'; sc.cycles.samples = 1; sc.cycles.use_denoising = False; sc.render.resolution_x, sc.render.resolution_y = 1600, 900
    cam.data.type = 'ORTHO'; cam.data.ortho_scale = 22; cam.location = (0, 0, 20); cam.rotation_euler = (0, 0, 0); cam.data.dof.use_dof = False
    bgn.inputs[0].default_value = (1, 1, 1, 1)
    vals = {'india_net_sacnilk': 863.75, 'india_net_koimoi': 900.93, 'debt_gross_mar26': 5062}; xs = {'india_net_sacnilk': -7.5, 'india_net_koimoi': -2.5, 'debt_gross_mar26': 4.0}
    for k, v in vals.items():
        s_ = side(v); bpy.ops.mesh.primitive_plane_add(size=1, location=(xs[k], 0, 0)); o = bpy.context.object; o.scale = (s_, s_, 1); m = bpy.data.materials.new(k); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = (0, 0, 0, 1); oo = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], oo.inputs[0]); o.data.materials.append(m); o.name = k
    sc.render.filepath = OUT + '/prop.png'; bpy.ops.render.render(write_still=True)
    from PIL import Image; import numpy as np
    im = np.array(Image.open(OUT + '/prop.png').convert('L')); H_, W_ = im.shape; ppu = W_ / 22.0
    res = {}
    for k, v in vals.items():
        cx = int(W_/2 + xs[k]*ppu); half = int(side(v)*ppu/2) + 6; sub = im[H_//2-half:H_//2+half, cx-half:cx+half]; px = int((sub < 128).sum()); res[k] = (v, px/ppu**2)
    base = res['india_net_sacnilk']; print('PROPORTION CHECK (measured area / number, normalised to the first shape):')
    ok = True
    for k, (v, a) in res.items():
        r = (a/base[1]) / (v/base[0]); ok &= abs(r-1) < .01; print(f'  {k:22s} number {v:8.2f}  area {a:7.3f} u²  ratio {r:.4f}')
    print('OK within 1 %' if ok else 'FAIL'); json.dump(res, open(OUT + '/prop.json', 'w')); sys.exit(0)
others = [o for o in bpy.data.objects if o.type != 'CAMERA' and o not in [l[0] for l in LAB]]
t0 = time.time()
for f in range(int(os.environ.get('START', 0)), N):
    t = f/FPS; up(t)
    for o, ton, toff in LAB:
        a = ss((t-ton)/.25)*(1 - ss((t-toff)/.25) if toff else 1); BT.set_alpha(o, a); o.hide_render = a <= .001
    sc.render.filepath = f'{OUT}/b{f:03d}.png'; bpy.ops.render.render(write_still=True)
    vis = [o for o, _, _ in LAB if not o.hide_render]; d = cam.data.dof.use_dof; cam.data.dof.use_dof = False
    BT.render_overlay(f'{OUT}/o{f:03d}.png', vis, others, samples=4); cam.data.dof.use_dof = d
    BT.composite(f'{OUT}/b{f:03d}.png', f'{OUT}/o{f:03d}.png', f'{OUT}/f{f:03d}.png')
print('SPF', (time.time()-t0)/N, flush=True)
if facts: json.dump(facts, open(OUT + '/facts.json', 'w'))
