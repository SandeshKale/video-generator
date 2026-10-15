# Shared helpers for the cells reel Blender plates: colour, materials, biconcave red-cell mesh, depth-pass render.
import bpy, bmesh, math, sys, os, mathutils, random
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'reel-01-your-voice', 'blender'))
from common import setup
def srgb(h, a=1.0):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92 for v in c) + (a,)
def principled(name, col, rough=.4, sss=0.0, sss_col=None, coat=0.0, spec=.5, emit=None, emit_s=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = srgb(col); b.inputs['Roughness'].default_value = rough
    for k, v in (('Subsurface Weight', sss), ('Coat Weight', coat), ('Coat Roughness', .15), ('Specular IOR Level', spec)):
        if k in b.inputs: b.inputs[k].default_value = v
    if sss_col and 'Subsurface Radius' in b.inputs: b.inputs['Subsurface Radius'].default_value = sss_col
    if emit: b.inputs['Emission Color'].default_value = srgb(emit); b.inputs['Emission Strength'].default_value = emit_s
    return m
def emission(name, col, s):
    m = bpy.data.materials.new(name); m.use_nodes = True; n = m.node_tree.nodes; n.clear(); e = n.new('ShaderNodeEmission'); e.inputs[0].default_value = srgb(col); e.inputs[1].default_value = s
    o = n.new('ShaderNodeOutputMaterial'); m.node_tree.links.new(e.outputs[0], o.inputs[0]); return m
def rbc_mesh(R=1.0, seg=48, ring=28):
    """Evans-Fung biconcave disc, radius R (7.82 um across in nature; R=1 here), thickness profile in units of R."""
    R0 = 3.91; a0, a1, a2 = .207161, 2.002558, -1.122762
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=ring, radius=1.0)
    for v in bm.verts:
        x, y, z = v.co; r = math.hypot(x, y); rho = min(r, .999)
        half = .5 * math.sqrt(1 - rho * rho) * (a0 + a1 * rho ** 2 + a2 * rho ** 4) * (R0 / R0)   # half thickness / R0 (since rho = r/R)
        v.co = (x * R, y * R, math.copysign(half * R * 1.0, z) if abs(z) > 1e-6 else 0.0)
    bm.normal_update(); me = bpy.data.meshes.new('rbc'); bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    return me
def add_obj(me, mat, loc=(0, 0, 0), rot=(0, 0, 0), scale=1.0, link=True):
    o = bpy.data.objects.new('o', me); bpy.context.scene.collection.objects.link(o); o.location = loc; o.rotation_euler = rot; o.scale = (scale,) * 3
    if mat and len(o.data.materials) == 0: o.data.materials.append(mat)
    return o
def world_volume(sc, col, density, aniso=.4, bg=(0, 0, 0), bgs=0.0):
    w = sc.world; w.use_nodes = True; nt = w.node_tree; nt.nodes.clear()
    bgn = nt.nodes.new('ShaderNodeBackground'); bgn.inputs[0].default_value = (*bg, 1); bgn.inputs[1].default_value = bgs
    vol = nt.nodes.new('ShaderNodeVolumeScatter'); vol.inputs['Color'].default_value = srgb(col); vol.inputs['Density'].default_value = density; vol.inputs['Anisotropy'].default_value = aniso
    out = nt.nodes.new('ShaderNodeOutputWorld'); nt.links.new(bgn.outputs[0], out.inputs['Surface']); nt.links.new(vol.outputs[0], out.inputs['Volume']); return nt, out, vol
def depth_material(cam_obj, near, far):
    """Emission = 1 (near) .. 0 (far) by distance from the camera, so the PNG matches Depth-Anything's convention (bright = near)."""
    m = bpy.data.materials.new('depth'); m.use_nodes = True; n = m.node_tree.nodes; n.clear()
    g = n.new('ShaderNodeNewGeometry'); vm = n.new('ShaderNodeVectorMath'); vm.operation = 'DISTANCE'; vm.inputs[1].default_value = tuple(cam_obj.location)
    mr = n.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = near; mr.inputs['From Max'].default_value = far; mr.inputs['To Min'].default_value = 1.0; mr.inputs['To Max'].default_value = 0.0; mr.clamp = True
    e = n.new('ShaderNodeEmission'); o = n.new('ShaderNodeOutputMaterial'); L = m.node_tree.links
    L.new(g.outputs['Position'], vm.inputs[0]); L.new(vm.outputs['Value'], mr.inputs['Value']); L.new(mr.outputs['Result'], e.inputs['Color']); L.new(e.outputs[0], o.inputs[0]); return m
def render_pair(sc, path_beauty, path_depth, cam_obj, near, far, depth_samples=1):
    sc.render.filepath = path_beauty; bpy.ops.render.render(write_still=True)
    vl = bpy.context.view_layer; vl.material_override = depth_material(cam_obj, near, far)
    old = (sc.cycles.samples, sc.cycles.use_denoising); sc.cycles.samples = depth_samples; sc.cycles.use_denoising = False
    nt = sc.world.node_tree; vlink = [l for l in nt.links if l.to_socket.name == 'Volume']; frm = [(l.from_socket, l.to_socket) for l in vlink]
    for l in vlink: nt.links.remove(l)
    sc.view_settings.view_transform = 'Standard'; sc.render.image_settings.color_mode = 'BW'; sc.render.film_transparent = False
    sc.render.filepath = path_depth; bpy.ops.render.render(write_still=True)
    vl.material_override = None; sc.cycles.samples, sc.cycles.use_denoising = old
    for a, b in frm: nt.links.new(a, b)
