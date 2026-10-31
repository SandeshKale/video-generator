"""Realistic Earth for Blender (bpy 5.0): day map + ocean gloss + city lights on the night side + cloud shell + atmosphere rim + star sky.
Built only from assets/space/ (NASA Blue Marble / Black Marble / cloud map, Tycho star map) — see assets/space/README.md for credits.

    from earth import build_earth
    build_earth(sun_dir=(1, -0.55, 0.35), res=(1280, 720))        # then bpy.ops.render.render(...) or animate rotation_euler.z
or:  python3 assets/space/blender/earth.py out.png [lon_deg]       # one test frame

Units: Earth radius = 1.0 BU. Spin the planet with the object named 'Earth' (clouds and atmosphere are children, clouds drift slightly faster
if you also rotate 'Clouds'). Night lights are masked by the sun direction inside the shader, so they stay put on the unlit hemisphere
as the sun moves. Everything is a pure function of the object transforms, so keyframing/`__seek`-style evaluation by time is safe.
"""
import bpy, math, os, sys
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__)); SPACE = os.path.normpath(os.path.join(HERE, '..'))
def P(*a): return os.path.join(SPACE, *a)

def _img(nodes, path, cs='sRGB'):
    n = nodes.new('ShaderNodeTexImage'); n.image = bpy.data.images.load(path); n.image.colorspace_settings.name = cs; n.interpolation = 'Cubic'; return n

def build_earth(sun_dir=(1, -0.55, 0.35), res=(1280, 720), samples=48, night_strength=6.0, cam_dist=6.2, lon_deg=-20.0):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.samples = samples; sc.cycles.device = 'CPU'
    sc.render.resolution_x, sc.render.resolution_y = res; sc.view_settings.view_transform = 'AgX'
    sd = Vector(sun_dir).normalized()
    # ---- sky: Tycho star map, dimmed, so the black of space has real stars
    w = bpy.data.worlds.new('space'); sc.world = w; w.use_nodes = True; nt = w.node_tree; nt.nodes.clear()
    tex = _img(nt.nodes, P('stars', 'tycho-star-map-2880.jpg')); env = nt.nodes.new('ShaderNodeTexEnvironment'); env.image = tex.image; nt.nodes.remove(tex)
    bg = nt.nodes.new('ShaderNodeBackground'); out = nt.nodes.new('ShaderNodeOutputWorld')
    lp = nt.nodes.new('ShaderNodeLightPath'); sk = nt.nodes.new('ShaderNodeMapRange'); sk.inputs['To Min'].default_value = 0.015; sk.inputs['To Max'].default_value = 1.6   # stars visible to the camera, ~no sky light on the planet
    nt.links.new(lp.outputs['Is Camera Ray'], sk.inputs['Value']); nt.links.new(sk.outputs['Result'], bg.inputs['Strength'])
    nt.links.new(env.outputs['Color'], bg.inputs['Color']); nt.links.new(bg.outputs['Background'], out.inputs['Surface'])
    # ---- sun
    sun = bpy.data.objects.new('Sun', bpy.data.lights.new('Sun', 'SUN')); sun.data.energy = 5.0; sun.data.angle = math.radians(0.6)
    sun.rotation_euler = (-sd).to_track_quat('-Z', 'Y').to_euler(); sc.collection.objects.link(sun)
    # ---- planet
    bpy.ops.mesh.primitive_uv_sphere_add(segments=192, ring_count=96, radius=1.0); earth = bpy.context.object; earth.name = 'Earth'; bpy.ops.object.shade_smooth()
    m = bpy.data.materials.new('Earth'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); N = nt.nodes; L = nt.links.new
    day = _img(N, P('earth', 'blue-marble-topo-bathy-5400.jpg')); night = _img(N, P('earth', 'black-marble-2012-8192.jpg')); oc = _img(N, P('earth', 'ocean-mask-2048.png'), 'Non-Color')
    bsdf = N.new('ShaderNodeBsdfPrincipled'); bsdf.inputs['Specular IOR Level'].default_value = 0.5
    L(day.outputs['Color'], bsdf.inputs['Base Color'])
    rough = N.new('ShaderNodeMapRange'); rough.inputs['To Min'].default_value = 0.78; rough.inputs['To Max'].default_value = 0.16          # land rough, ocean glossy
    L(oc.outputs['Color'], rough.inputs['Value']); L(rough.outputs['Result'], bsdf.inputs['Roughness'])
    # night factor: 1 on the dark hemisphere, 0 in daylight, soft terminator (dot(N, sun) from the world-space normal)
    geo = N.new('ShaderNodeNewGeometry'); dot = N.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
    dot.inputs[1].default_value = sd; L(geo.outputs['Normal'], dot.inputs[0])
    nf = N.new('ShaderNodeMapRange'); nf.inputs['From Min'].default_value = 0.12; nf.inputs['From Max'].default_value = -0.12; nf.inputs['To Min'].default_value = 0.0; nf.inputs['To Max'].default_value = 1.0; nf.clamp = True
    L(dot.outputs['Value'], nf.inputs['Value'])
    em = N.new('ShaderNodeMath'); em.operation = 'MULTIPLY'; em.inputs[1].default_value = night_strength; L(nf.outputs['Result'], em.inputs[0])
    tint = N.new('ShaderNodeMix'); tint.data_type = 'RGBA'; tint.blend_type = 'MULTIPLY'; tint.inputs['Factor'].default_value = 1.0; tint.inputs['B'].default_value = (1.0, 0.72, 0.36, 1)   # warm sodium glow
    thr = N.new('ShaderNodeMapRange'); thr.data_type = 'FLOAT_VECTOR'; thr.clamp = True                       # the NASA night image carries a dim blue land/ocean underlay: keep only the lights
    thr.inputs['From Min'].default_value = (0.10, 0.10, 0.10); thr.inputs['From Max'].default_value = (0.65, 0.65, 0.65)
    L(night.outputs['Color'], thr.inputs['Vector']); L(thr.outputs['Vector'], tint.inputs['A'])
    L(tint.outputs['Result'], bsdf.inputs['Emission Color']); L(em.outputs['Value'], bsdf.inputs['Emission Strength'])
    o = N.new('ShaderNodeOutputMaterial'); L(bsdf.outputs['BSDF'], o.inputs['Surface']); earth.data.materials.append(m)
    # ---- clouds shell (alpha from the NASA cloud map)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=1.012); cl = bpy.context.object; cl.name = 'Clouds'; bpy.ops.object.shade_smooth(); cl.parent = earth
    cm = bpy.data.materials.new('Clouds'); cm.use_nodes = True; cn = cm.node_tree; cn.nodes.clear(); C = cn.nodes
    ct = _img(C, P('earth', 'clouds-combined-2048.jpg'), 'Non-Color'); cb = C.new('ShaderNodeBsdfPrincipled'); cb.inputs['Roughness'].default_value = 1.0; cb.inputs['Base Color'].default_value = (0.95, 0.96, 1, 1)
    cr = C.new('ShaderNodeMapRange'); cr.inputs['From Min'].default_value = 0.18; cr.inputs['From Max'].default_value = 0.85                         # contrast so open sea shows through
    cn.links.new(ct.outputs['Color'], cr.inputs['Value']); cn.links.new(cr.outputs['Result'], cb.inputs['Alpha']); co = C.new('ShaderNodeOutputMaterial'); cn.links.new(cb.outputs['BSDF'], co.inputs['Surface']); cl.data.materials.append(cm)
    # ---- atmosphere: thin shell, blue emission that grows toward the limb, brighter on the sunlit side
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=1.05); at = bpy.context.object; at.name = 'Atmosphere'; bpy.ops.object.shade_smooth(); at.parent = earth
    am = bpy.data.materials.new('Atmosphere'); am.use_nodes = True; an = am.node_tree; an.nodes.clear(); A = an.nodes
    g0 = A.new('ShaderNodeNewGeometry'); fd = A.new('ShaderNodeVectorMath'); fd.operation = 'DOT_PRODUCT'                       # facing = |N . view|: 1 at the disc centre, 0 at the limb
    an.links.new(g0.outputs['Normal'], fd.inputs[0]); an.links.new(g0.outputs['Incoming'], fd.inputs[1])
    ab = A.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'; an.links.new(fd.outputs['Value'], ab.inputs[0])
    inv = A.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1.0; an.links.new(ab.outputs['Value'], inv.inputs[1])
    pw = A.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 4.0; an.links.new(inv.outputs['Value'], pw.inputs[0])             # rim glow, ~0 except near the limb
    ag = A.new('ShaderNodeNewGeometry'); ad = A.new('ShaderNodeVectorMath'); ad.operation = 'DOT_PRODUCT'; ad.inputs[1].default_value = sd; an.links.new(ag.outputs['Normal'], ad.inputs[0])
    sm = A.new('ShaderNodeMapRange'); sm.inputs['From Min'].default_value = -0.45; sm.inputs['From Max'].default_value = 0.35; sm.inputs['To Min'].default_value = 0.08; sm.inputs['To Max'].default_value = 1.0; sm.clamp = True; an.links.new(ad.outputs['Value'], sm.inputs['Value'])
    mulr = A.new('ShaderNodeMath'); mulr.operation = 'MULTIPLY'; an.links.new(pw.outputs['Value'], mulr.inputs[0]); an.links.new(sm.outputs['Result'], mulr.inputs[1])
    ae = A.new('ShaderNodeEmission'); ae.inputs['Color'].default_value = (0.25, 0.55, 1.0, 1); strength = A.new('ShaderNodeMath'); strength.operation = 'MULTIPLY'; strength.inputs[1].default_value = 5.0
    an.links.new(mulr.outputs['Value'], strength.inputs[0]); an.links.new(strength.outputs['Value'], ae.inputs['Strength'])
    tr = A.new('ShaderNodeBsdfTransparent'); mx = A.new('ShaderNodeMixShader'); an.links.new(mulr.outputs['Value'], mx.inputs['Fac']); an.links.new(tr.outputs['BSDF'], mx.inputs[1]); an.links.new(ae.outputs['Emission'], mx.inputs[2])
    ao = A.new('ShaderNodeOutputMaterial'); an.links.new(mx.outputs['Shader'], ao.inputs['Surface']); at.data.materials.append(am)
    at.visible_shadow = False
    # ---- camera framed on the terminator so day, night lights and the limb all show
    earth.rotation_euler.z = math.radians(lon_deg)
    cam = bpy.data.objects.new('Camera', bpy.data.cameras.new('Camera')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = 50
    side = Vector((-sd.y, sd.x, 0)).normalized()                                                  # perpendicular to the sun, so the terminator runs down the middle
    cam.location = side * cam_dist + Vector((0, 0, 0.35)); cam.rotation_euler = (-cam.location).to_track_quat('-Z', 'Y').to_euler()
    return earth

if __name__ == '__main__':
    out = sys.argv[-2] if len(sys.argv) > 2 and sys.argv[-1].replace('-', '').replace('.', '').isdigit() else sys.argv[-1]
    lon = float(sys.argv[-1]) if sys.argv[-1].replace('-', '').replace('.', '').isdigit() else 70.0
    build_earth(lon_deg=lon, res=(1280, 720), samples=40); bpy.context.scene.render.filepath = out; bpy.ops.render.render(write_still=True)
