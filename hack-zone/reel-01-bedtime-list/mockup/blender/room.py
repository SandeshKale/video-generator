# Hack Zone #01 mockup: the nightstand world (lamp, notebook, pen, glass of water, moonlit window), rendered as 9:16 plates (beauty + depth).
# VIEW=wide|macro, STATE=warm|dim. Anchors (projected page lines, page corners, lamp, pane arc centre) are written to ../site/room_<view>.json.
import bpy, math, os, sys, json, random, mathutils
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, '/home/user/video-generator/science-channel/reel-02-cells/blender')
from cells_lib import principled, emission, srgb, render_pair, setup
VIEW = os.environ.get('VIEW', 'wide'); STATE = os.environ.get('STATE', 'warm')
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', 'plates'); RES = (int(os.environ.get('W', 810)), int(os.environ.get('H', 1440))); SPP = int(os.environ.get('SPP', 64))
sc = setup(res=RES, samples=SPP); sc.render.film_transparent = False; sc.view_settings.view_transform = 'Standard'
sc.view_settings.look = 'None'; sc.view_settings.exposure = float(os.environ.get('EXPO', -0.2))
w = sc.world; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = srgb('#06141a'); bg.inputs[1].default_value = .35
dim = STATE == 'dim'
def box(name, size, loc, mat, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot); o = bpy.context.object; o.scale = size; o.name = name; o.data.materials.append(mat)
    if bevel:
        bpy.ops.object.transform_apply(scale=True); m = o.modifiers.new('b', 'BEVEL'); m.width = bevel; m.segments = 3
    return o
def cyl(name, r, h, loc, mat, v=48, r2=None):
    if r2 is None: bpy.ops.mesh.primitive_cylinder_add(vertices=v, radius=r, depth=h, location=loc)
    else: bpy.ops.mesh.primitive_cone_add(vertices=v, radius1=r, radius2=r2, depth=h, location=loc)
    o = bpy.context.object; o.name = name; o.data.materials.append(mat); bpy.ops.object.shade_smooth(); return o
def noise_bump(m, scale, strength, rough_var=None):
    nt = m.node_tree; n = nt.nodes; b = n['Principled BSDF']; tc = n.new('ShaderNodeTexCoord'); no = n.new('ShaderNodeTexNoise'); no.inputs['Scale'].default_value = scale; no.inputs['Detail'].default_value = 8
    bu = n.new('ShaderNodeBump'); bu.inputs['Strength'].default_value = strength; nt.links.new(tc.outputs['Object'], no.inputs['Vector']); nt.links.new(no.outputs['Fac'], bu.inputs['Height']); nt.links.new(bu.outputs['Normal'], b.inputs['Normal'])
# --- materials
wood = principled('wood', '#4a2810', rough=.5, coat=.0); noise_bump(wood, 60, .15)
wall = principled('wall', '#16322f', rough=.9); noise_bump(wall, 40, .08)
brass = principled('brass', '#c79a4a', rough=.28); brass.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 1.0
leather = principled('leather', '#103f39', rough=.55); noise_bump(leather, 120, .35)
paper = principled('paper', '#f4ecd8', rough=.8, sss=.05); noise_bump(paper, 260, .05)
# ruled lines on the paper (wave bands in UV y)
pn = paper.node_tree; pn_n = pn.nodes; uv = pn_n.new('ShaderNodeTexCoord'); wvp = pn_n.new('ShaderNodeTexWave'); wvp.wave_type = 'BANDS'; wvp.bands_direction = 'Y'; wvp.inputs['Scale'].default_value = 24; wvp.inputs['Distortion'].default_value = 0; wvp.inputs['Detail'].default_value = 0
pn.links.new(uv.outputs['UV'], wvp.inputs['Vector']); rr = pn_n.new('ShaderNodeValToRGB'); rr.color_ramp.interpolation = 'CONSTANT'; rr.color_ramp.elements[0].color = srgb('#f4ecd8'); e1 = rr.color_ramp.elements.new(.93); e1.color = srgb('#a9c3c8'); pn.links.new(wvp.outputs['Fac'], rr.inputs['Fac']); pn.links.new(rr.outputs['Color'], pn_n['Principled BSDF'].inputs['Base Color'])
ink = principled('pen', '#0d0f10', rough=.35); ribbon = principled('ribbon', '#ff7a1a', rough=.5)
glass = principled('glass', '#dff6f4', rough=.03); gb = glass.node_tree.nodes['Principled BSDF']; gb.inputs['Transmission Weight'].default_value = 1.0; gb.inputs['IOR'].default_value = 1.45
water = principled('water', '#cfeee9', rough=.02); wb = water.node_tree.nodes['Principled BSDF']; wb.inputs['Transmission Weight'].default_value = 1.0; wb.inputs['IOR'].default_value = 1.33
# --- room
box('wall', (6, .1, 4), (0, 2.25, 1.0), wall); box('floorfront', (6, 4, .05), (0, 0, -.9), principled('dark', '#0a1514', rough=.9))
# nightstand top + body
box('top', (1.5, 1.1, .05), (0, .55, -.025), wood, bevel=.006); box('body', (1.4, 1.0, .85), (0, .55, -.475), principled('wood2', '#2a1a10', rough=.45))
# window (emission sky) + frame
skym = bpy.data.materials.new('sky'); skym.use_nodes = True; sn = skym.node_tree.nodes; sn.clear(); sl = skym.node_tree.links
tcs = sn.new('ShaderNodeTexCoord'); sep = sn.new('ShaderNodeSeparateXYZ'); sl.new(tcs.outputs['UV'], sep.inputs[0])
cr = sn.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = srgb('#122a58'); cr.color_ramp.elements[1].color = srgb('#070d24'); sl.new(sep.outputs['Y'], cr.inputs['Fac'])
mp = sn.new('ShaderNodeMapping'); mp.vector_type = 'POINT'; mp.inputs['Scale'].default_value = (9, 9, 9); mp.inputs['Location'].default_value = (-9 * .32, -9 * .72, 0); sl.new(tcs.outputs['UV'], mp.inputs['Vector'])
moon = sn.new('ShaderNodeTexGradient'); moon.gradient_type = 'SPHERICAL'; sl.new(mp.outputs['Vector'], moon.inputs['Vector'])
cm = sn.new('ShaderNodeValToRGB'); cm.color_ramp.elements[0].position = .52; cm.color_ramp.elements[0].color = (0, 0, 0, 1); cm.color_ramp.elements[1].position = .6; cm.color_ramp.elements[1].color = srgb('#fff4cf'); sl.new(moon.outputs['Fac'], cm.inputs['Fac'])
ad = sn.new('ShaderNodeMix'); ad.data_type = 'RGBA'; ad.blend_type = 'ADD'; ad.inputs['Factor'].default_value = 1.0; sl.new(cr.outputs['Color'], ad.inputs['A']); sl.new(cm.outputs['Color'], ad.inputs['B'])
em = sn.new('ShaderNodeEmission'); em.inputs[1].default_value = .55 if not dim else .8; sl.new(ad.outputs['Result'], em.inputs[0]); oo = sn.new('ShaderNodeOutputMaterial'); sl.new(em.outputs[0], oo.inputs[0])
bpy.ops.mesh.primitive_plane_add(size=1, location=(.35, 2.18, .95), rotation=(math.pi / 2, 0, 0)); sky = bpy.context.object; sky.scale = (.9, 1.1, 1); sky.data.materials.append(skym)
fm = principled('frame', '#0f0a07', rough=.6)
for (sx, sz, lx, lz) in [(1.0, .06, .35, 1.50), (1.0, .06, .35, .40), (.06, 1.16, -.10, .95), (.06, 1.16, .80, .95), (.04, 1.1, .35, .95), (.9, .04, .35, .95)]:
    box('fr', (sx, .08, sz), (lx, 2.13, lz), fm)
# --- lamp
LX, LY = -.36, .86
cyl('lbase', .13, .03, (LX, LY, .015), brass); cyl('lstem', .014, .40, (LX, LY, .22), brass, v=24); cyl('lneck', .03, .04, (LX, LY, .43), brass, v=24)
shade = bpy.data.materials.new('shade'); shade.use_nodes = True; nn = shade.node_tree.nodes; nn.clear(); em2 = nn.new('ShaderNodeEmission'); em2.inputs[0].default_value = srgb('#ff9a3d'); em2.inputs[1].default_value = float(os.environ.get('SHADE', 0.9 if dim else 1.8))
tr = nn.new('ShaderNodeBsdfTranslucent'); tr.inputs[0].default_value = srgb('#f0c78a'); mx = nn.new('ShaderNodeMixShader'); mx.inputs[0].default_value = .0; oo2 = nn.new('ShaderNodeOutputMaterial'); lk = shade.node_tree.links; lk.new(em2.outputs[0], mx.inputs[1]); lk.new(tr.outputs[0], mx.inputs[2]); lk.new(mx.outputs[0], oo2.inputs[0])
cyl('lshade', .20, .26, (LX, LY, .58), shade, v=64, r2=.11)
for (lz, ly, e) in [(.40, LY - .02, 1.0), (.80, LY + .02, .55)]:
    bpy.ops.object.light_add(type='POINT', location=(LX, ly, lz)); pl = bpy.context.object; pl.data.energy = float(os.environ.get('LAMP', 22 if dim else 110)) * e; pl.data.color = (1, .66, .38); pl.data.shadow_soft_size = .06
# moonlight through the window
bpy.ops.object.light_add(type='AREA', location=(.35, 2.0, 1.55), rotation=(-math.pi / 2, 0, 0)); ml = bpy.context.object; ml.data.shape = 'RECTANGLE'; ml.data.size = 1.1; ml.data.size_y = 1.7; ml.data.energy = 120 if dim else 18; ml.data.color = (.55, .7, 1.0)
# --- notebook (open), pen, glass
NX, NY, NR = .12, .46, math.radians(-10)
nb = bpy.data.objects.new('nbroot', None); sc.collection.objects.link(nb); nb.location = (NX, NY, 0); nb.rotation_euler = (0, 0, NR)
cv = box('cover', (.64, .47, .016), (0, 0, .008), leather, bevel=.004); cv.parent = nb
def page(name, x0, flip):
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=24, y_subdivisions=32, size=1, calc_uvs=True); o = bpy.context.object; o.name = name; o.scale = (.29, .42, 1); o.location = (x0, 0, .017); o.parent = nb
    me = o.data
    for v in me.vertices:
        u = (v.co.x + .5)
        v.co.z = .006 * (1 - abs(2 * (u if flip else 1 - u) - 1) ** 1.4) * 0 + .008 * ((1 - u) ** 2 if not flip else u ** 2) * .0 + (.004 * (1 - u) if not flip else .004 * u)
    for p in me.polygons: p.use_smooth = True
    o.data.materials.append(paper); return o
pl_ = page('pageL', -.15, False); pr_ = page('pageR', .15, True)
box('ribbon', (.012, .30, .002), (.02, -.04, .021), ribbon, rot=(0, 0, 0)).parent = nb
# pen on the right page (omitted in the macro view: the page's writing pen is a live sprite)
if VIEW == 'wide':
    pen = bpy.data.objects.new('pen', None); sc.collection.objects.link(pen); pen.parent = nb; pen.location = (.17, -.02, .035); pen.rotation_euler = (math.radians(4), math.radians(0), math.radians(58))
    b1 = cyl('penbody', .0065, .15, (0, 0, 0), ink, v=32); b1.rotation_euler = (0, math.pi / 2, 0); b1.parent = pen
    b2 = cyl('pentip', .0065, .02, (-.085, 0, 0), brass, v=32, r2=.0012); b2.rotation_euler = (0, -math.pi / 2, 0); b2.parent = pen
    box('penclip', (.05, .0015, .004), (.045, .0, .008), brass).parent = pen

# glass of water
cyl('glass', .036, .095, (.66, .86, .048), glass, v=48); cyl('water', .033, .06, (.66, .86, .034), water, v=48)
# --- camera
cam = bpy.data.cameras.new('c'); cam.sensor_fit = 'VERTICAL'; cam.sensor_height = 24; co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
if VIEW == 'wide':
    cam.lens = float(os.environ.get('LENS', 26)); co.location = (.05, -.95, .86); tgt = mathutils.Vector((.08, .8, float(os.environ.get('TZ', .42)))); NEAR, FAR = 1.0, 4.5
else:
    cam.lens = 40; co.location = (.26, -.12, .40); tgt = mathutils.Vector((.27, .50, .00)); NEAR, FAR = .25, 2.6
    cam.dof.use_dof = True; cam.dof.focus_distance = (tgt - co.location).length * .92; cam.dof.aperture_fstop = 2.2
co.rotation_euler = (tgt - co.location).to_track_quat('-Z', 'Y').to_euler()
bpy.context.view_layer.update()
# anchors
def proj(p):
    v = world_to_camera_view(sc, co, mathutils.Vector(p)); return [round(v.x, 4), round(1 - v.y, 4), round(v.z, 3)]
anch = {'lamp': proj((LX, LY, .58)), 'window': proj((.35, 2.18, .95)), 'glass': proj((.66, .86, .08))}
# page corners + ruled lines on the right page (page-local coordinates)
M = nb.matrix_world
def wl(x, y, z=.018): return tuple(M @ mathutils.Vector((x, y, z)))
anch['pageR'] = [proj(wl(.15 + sx * .145, sy * .21)) for sx, sy in [(-1, -1), (1, -1), (1, 1), (-1, 1)]]
anch['lines'] = [[proj(wl(.15 - .13, y)), proj(wl(.15 + .13, y))] for y in [(-.17 + i * (.34 / 17)) for i in range(18)]]
anch['pen'] = proj(tuple(M @ mathutils.Vector((.11, -.04, .03))))
json.dump(anch, open(os.path.join(os.path.dirname(__file__), '..', 'site', f'room_{VIEW}.json'), 'w'))
name = f'room_{STATE}' if VIEW == 'wide' else f'page_{STATE}'
render_pair(sc, os.path.join(OUT, name + '.png'), os.path.join(OUT, name + '_depth.png'), co, NEAR, FAR, depth_samples=1)
print('done', name)
