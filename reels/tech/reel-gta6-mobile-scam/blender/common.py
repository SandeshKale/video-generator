"""Shared Blender helpers (Cycles CPU): colours, setup, materials, phone/console props, hud text, thermal two-pass compositing."""
import bpy, sys, math, os, random, time, json
import numpy as np
from mathutils import Vector
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D)
def _lin(v): return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
def hexc(h, a=1): h = h.lstrip('#'); return tuple(_lin(int(h[i:i+2], 16) / 255) for i in (0, 2, 4)) + (a,)
CREAM, TOMATO, GREEN, AMBER, MUTE = hexc('f1f3f8'), hexc('ff4b3a'), hexc('7dffa0'), hexc('ffb21f'), hexc('8d99a6')
class Cfg: W = 720; H = 1280; SMP = 16
def setup(bg='0b0f13', bgs=1.0, raw=False):
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = Cfg.SMP; sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    sc.cycles.max_bounces = 4; sc.render.resolution_x = Cfg.W; sc.render.resolution_y = Cfg.H; sc.render.threads = 4; sc.view_settings.view_transform = 'Raw' if raw else 'AgX'
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; b = w.node_tree.nodes['Background']; b.inputs[0].default_value = hexc(bg) if not raw else (bg, bg, bg, 1); b.inputs[1].default_value = bgs; return sc
def emit(col, s=1.0):
    m = bpy.data.materials.new('e'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = col; e.inputs[1].default_value = s; o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def pbr(col, rough=.5, metal=0, emission=None, es=0):
    m = bpy.data.materials.new('p'); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = col; b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if emission: b.inputs['Emission Color'].default_value = emission; b.inputs['Emission Strength'].default_value = es
    return m
def img_mat(path, emis=1.0):
    m = bpy.data.materials.new('i'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']; tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(path); nt.links.new(tx.outputs['Color'], b.inputs['Base Color']); nt.links.new(tx.outputs['Color'], b.inputs['Emission Color']); b.inputs['Emission Strength'].default_value = emis; b.inputs['Roughness'].default_value = .25; return m
def thermal_mat(base, hot=None, hot_pos=(0, 0.25), hot_r=.5):
    """grayscale temperature emission: value = (T-15)/55 (Raw view). hot = (peak T) Gaussian around hot_pos in object XY."""
    g = (base - 15) / 55.0; m = bpy.data.materials.new('t'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); out = nt.nodes.new('ShaderNodeOutputMaterial'); e = nt.nodes.new('ShaderNodeEmission'); nt.links.new(e.outputs[0], out.inputs[0]); e.inputs[1].default_value = 1.0
    if hot is None: e.inputs[0].default_value = (g, g, g, 1)
    else:
        tc = nt.nodes.new('ShaderNodeTexCoord'); sub = nt.nodes.new('ShaderNodeVectorMath'); sub.operation = 'SUBTRACT'; sub.inputs[1].default_value = (hot_pos[0], hot_pos[1], 0); nt.links.new(tc.outputs['Object'], sub.inputs[0])
        ln = nt.nodes.new('ShaderNodeVectorMath'); ln.operation = 'LENGTH'; nt.links.new(sub.outputs[0], ln.inputs[0]); mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs[1].default_value = 0; mr.inputs[2].default_value = hot_r; mr.inputs[3].default_value = (hot - 15) / 55.0; mr.inputs[4].default_value = g; mr.clamp = True
        nt.links.new(ln.outputs['Value'], mr.inputs[0]); cc = nt.nodes.new('ShaderNodeCombineXYZ'); [nt.links.new(mr.outputs[0], cc.inputs[i]) for i in range(3)]; nt.links.new(cc.outputs[0], e.inputs[0])
    return m
def box(loc, size, mat, bevel=.02):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); o.data.materials.append(mat)
    if bevel: bm = o.modifiers.new('b', 'BEVEL'); bm.width = bevel; bm.segments = 3
    return o
def sun(rot, energy, col=(1, 1, 1)):
    l = bpy.data.lights.new('s', 'SUN'); l.energy = energy; l.color = col[:3]; o = bpy.data.objects.new('s', l); o.rotation_euler = tuple(math.radians(a) for a in rot); bpy.context.scene.collection.objects.link(o); return o
def area(loc, size, energy, col=(1, 1, 1), look=(0, 0, 0)):
    l = bpy.data.lights.new('a', 'AREA'); l.energy = energy; l.size = size; l.color = col[:3]; o = bpy.data.objects.new('a', l); o.location = loc; bpy.context.scene.collection.objects.link(o)
    o.rotation_euler = (Vector(look) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
def camera(loc, look, lens=40, fstop=None, focus=None):
    sc = bpy.context.scene; c = bpy.data.cameras.new('c'); o = bpy.data.objects.new('c', c); sc.collection.objects.link(o); sc.camera = o; o.location = loc; c.lens = lens
    d = Vector(look) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    if fstop: c.dof.use_dof = True; c.dof.aperture_fstop = fstop; c.dof.focus_distance = focus or d.length
    return o
def text(s, loc, size, col, cam, font='plexmono', align='LEFT'):
    bpy.ops.object.text_add(location=loc); o = bpy.context.object; o.data.body = s; o.data.size = size; o.data.font = bpy.data.fonts.load(os.path.join(D, 'fonts', font + '.ttf')); o.data.extrude = size * .05; o.data.align_x = align
    o.data.materials.append(emit(col)); o.rotation_euler = cam.rotation_euler.copy(); o.visible_glossy = False; o.visible_diffuse = False; o.visible_shadow = False; return o
def hud(s, cam, u, v, frac, col, dist=4, font='plexmono', align='LEFT'):
    vf = 2 * math.atan(18 / cam.data.lens); hh = dist * math.tan(vf / 2); hw = hh * (Cfg.W / Cfg.H); bpy.context.view_layer.update(); M = cam.matrix_world
    o = text(s, tuple(M @ Vector((u * 2 * hw, v * 2 * hh, -dist))), frac * 2 * hh, col, cam, font, align); o.parent = cam; o.matrix_parent_inverse = cam.matrix_world.inverted(); return o
def render(path):
    sc = bpy.context.scene; t0 = time.time(); sc.render.filepath = path; bpy.ops.render.render(write_still=True); return time.time() - t0
# ---- 2D helper graphics for screens (our own, generic: no real scam site, no Rockstar art) ----
def card_png(path, lines, accent='#ff4b3a', bg='#14181d', w=512, h=1024, big=None):
    im = Image.new('RGB', (w, h), bg); d = ImageDraw.Draw(im); F = lambda n, s: ImageFont.truetype(os.path.join(D, 'fonts', n + '.ttf'), s)
    d.rectangle([0, 0, w, 70], fill='#0b0e12'); d.text((24, 22), '9:41', font=F('plexmono', 26), fill='#8d99a6')
    y = 140
    if big: d.text((w // 2, y), big, font=F('anton', 92), fill=accent, anchor='mm'); y += 110
    for txt, sz, col in lines: d.text((w // 2, y), txt, font=F('plexmono', sz), fill=col, anchor='mm'); y += sz + 26
    d.rounded_rectangle([60, h - 260, w - 60, h - 150], 18, fill=accent); d.text((w // 2, h - 205), lines[-1][0] if False else 'DOWNLOAD', font=F('anton', 54), fill='#0b0e12', anchor='mm'); im.save(path); return path
IRON = [(0, '#000008'), (.14, '#120554'), (.3, '#4d0894'), (.45, '#991294'), (.6, '#db3352'), (.75, '#fa7812'), (.88, '#ffbf21'), (1, '#fffadb')]
def iron_lut(n=1024):
    xs = np.linspace(0, 1, n); lut = np.zeros((n, 3))
    for i in range(3):
        lut[:, i] = np.interp(xs, [p for p, _ in IRON], [int(c[1 + 2 * i:3 + 2 * i], 16) / 255 for _, c in IRON])
    return lut
def sensor(gray, out_w, out_h, grid=(240, 426), seed=1):
    """gray float HxW in 0..1 (temperature) -> iron palette image with sensor look. returns uint8 RGB (out_h, out_w, 3)"""
    rng = np.random.default_rng(seed); im = Image.fromarray((np.clip(gray, 0, 1) * 65535).astype('uint16')); g = np.asarray(im.resize((grid[0], grid[1]), Image.BOX), float) / 65535
    g = g + rng.normal(0, .006, g.shape) + rng.normal(0, .004, (1, g.shape[1])) ; yy, xx = np.mgrid[0:g.shape[0], 0:g.shape[1]]; g = g - .03 * (((xx / g.shape[1] - .5) ** 2 + (yy / g.shape[0] - .5) ** 2))
    lut = iron_lut(); rgb = (lut[(np.clip(g, 0, 1) * 1023).astype(int)] * 255).astype('uint8'); return np.asarray(Image.fromarray(rgb).resize((out_w, out_h), Image.BICUBIC))
def hudbox(cam, u, v, wf, hf, col, dist=4):
    """screen-anchored flat bar: left edge at u, centre height v, width/height as fractions of frame width/height."""
    vf = 2 * math.atan(18 / cam.data.lens); hh = dist * math.tan(vf / 2); hw = hh * (Cfg.W / Cfg.H); bpy.context.view_layer.update(); M = cam.matrix_world
    o = box(tuple(M @ Vector(((u + wf / 2) * 2 * hw, v * 2 * hh, -dist))), (wf * 2 * hw, hf * 2 * hh, .01), emit(col, 1.0), 0); o.rotation_euler = cam.rotation_euler.copy(); o.parent = cam; o.matrix_parent_inverse = cam.matrix_world.inverted()
    o.visible_glossy = False; o.visible_diffuse = False; o.visible_shadow = False; return o

def facing(cam, roll_deg=0):
    """camera-facing rotation (local x = right, y = up, z = toward camera) plus an in-plane roll."""
    from mathutils import Euler
    return (cam.rotation_euler.to_matrix() @ Euler((0, 0, math.radians(roll_deg))).to_matrix()).to_euler()
