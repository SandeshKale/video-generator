"""Crisp text for Blender-first reels (standing fix, 20 Nov 2026).

Why: Blender 3D text (extruded curves) rendered at a reduced size, denoised and upscaled looks soft and thin, has no
Devanagari shaping, and small HUD sizes turn to mush. This module renders every string as a SHAPED, supersampled RGBA
texture (PIL + raqm = real shaping, any weight, Devanagari OK, outline/shadow) and puts it on a camera-facing plane whose
size maps texture pixels to final-frame pixels. Text is then rendered in its OWN overlay pass at FINAL resolution
(film transparent, emission only, NO denoise, few samples) and alpha-composited over the beauty pass, so it is never
upscaled, never denoised and never blurred by depth of field.

Use inside Blender (bpy):
    import sys; sys.path.insert(0, '<repo>/scripts'); import blender_text as BT
    BT.init(W=1080, H=1920)                       # final output size, NOT the beauty-pass size
    lab = BT.label(cam, 'REC 00:15', font=BT.PLEX_SEMI, px=34, fill='#f1f3f8', u=-.44, v=.45, dist=6, outline=('#05070a', 3))
    BT.set_alpha(lab, .5)                         # animate per frame (also lab.hide_render)
    BT.render_overlay(path, labels_visible=[...]) # hides everything else, renders text only
    img = BT.composite(beauty_png, overlay_png, out_png)
Rules: cap-height >= 30 px for HUD, >= 42 px for captions-like lines; weight >= SemiBold; never below 26 px at 1080 wide.
"""
import os, math, hashlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(REPO, 'assets', 'fonts')
CACHE = '/tmp/blender_text_cache'; os.makedirs(CACHE, exist_ok=True)
SS = 3                                    # texture supersampling (texture px per final px)
STATE = dict(W=1080, H=1920)
PLEX_SEMI = os.path.join(FONTS, 'ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff2')
PLEX_BOLD = os.path.join(FONTS, 'ibm-plex-mono', 'ibm-plex-mono-latin-700-normal.woff2')
ANTON = os.path.join(FONTS, 'anton', 'anton-latin-400-normal.woff2')
INTER_BOLD = os.path.join(FONTS, 'inter', 'inter-latin-700-normal.woff2')
INTER_XBOLD = os.path.join(FONTS, 'inter', 'inter-latin-800-normal.woff2')
DEVA_BOLD = os.path.join(FONTS, 'noto-sans-devanagari', 'noto-sans-devanagari-devanagari-700-normal.woff2')
def font_path(*parts): return os.path.join(FONTS, *parts)
def init(W=1080, H=1920): STATE['W'], STATE['H'] = W, H
def _hex(h, a=255): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (a,)
def text_png(s, font, px, fill='#f1f3f8', outline=None, shadow=None, pad=10, tracking=0, ss=SS):
    """Return (png_path, w1x, h1x): shaped text, supersampled `ss` times, transparent, antialiased."""
    key = hashlib.md5(repr((s, font, px, fill, outline, shadow, pad, tracking, ss)).encode()).hexdigest()[:16]; path = f'{CACHE}/{key}.png'
    f = ImageFont.truetype(font, int(px * ss), layout_engine=ImageFont.Layout.RAQM)
    d0 = ImageDraw.Draw(Image.new('RGBA', (8, 8))); l, t, r, b = d0.textbbox((0, 0), s, font=f, features=None); sw = int((outline[1] if outline else 0) * ss)
    P = int(pad * ss) + sw + (int(shadow[1] * ss) if shadow else 0); W = int(r - l) + 2 * P; H = int(b - t) + 2 * P
    if not os.path.exists(path):
        im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        if shadow:   # soft shadow: (colour, blur px at 1x, dy px at 1x)
            sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((P - l, P - t + int(shadow[2] * ss)), s, font=f, fill=_hex(shadow[0], 200)); im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(shadow[1] * ss)))
        d = ImageDraw.Draw(im)
        if outline: d.text((P - l, P - t), s, font=f, fill=_hex(fill), stroke_width=sw, stroke_fill=_hex(outline[0]))
        d.text((P - l, P - t), s, font=f, fill=_hex(fill))
        im.save(path)
    return path, W / ss, H / ss
def label(cam, s, font, px, fill='#f1f3f8', u=0, v=0, dist=6, outline=None, shadow=None, align='left', tracking=0):
    """Camera-parented plane showing the text. u,v in [-.5,.5] of frame (u from left edge of text for align=left, centre for 'center')."""
    import bpy
    from mathutils import Vector
    path, w1, h1 = text_png(s, font, px, fill, outline, shadow)
    W, H = STATE['W'], STATE['H']; vf = 2 * math.atan(18 / cam.data.lens); hh = dist * math.tan(vf / 2); hw = hh * (W / H); wpp = (2 * hh) / H      # world units per final pixel at `dist`
    bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.object; o.scale = (w1 * wpp, h1 * wpp, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    cx = u * 2 * hw + (w1 * wpp / 2 if align == 'left' else 0) - (w1 * wpp if align == 'right' else 0); cy = v * 2 * hh
    bpy.context.view_layer.update(); M = cam.matrix_world; o.location = M @ Vector((cx, cy, -dist)); o.rotation_euler = cam.rotation_euler.copy(); o.parent = cam; o.matrix_parent_inverse = cam.matrix_world.inverted()
    m = bpy.data.materials.new('txt'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(path); tx.interpolation = 'Cubic'; tx.image.alpha_mode = 'STRAIGHT'
    em = nt.nodes.new('ShaderNodeEmission'); tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mix = nt.nodes.new('ShaderNodeMixShader'); mult = nt.nodes.new('ShaderNodeMath'); mult.operation = 'MULTIPLY'; mult.inputs[1].default_value = 1.0; out = nt.nodes.new('ShaderNodeOutputMaterial')
    nt.links.new(tx.outputs['Color'], em.inputs[0]); nt.links.new(tx.outputs['Alpha'], mult.inputs[0]); nt.links.new(mult.outputs[0], mix.inputs[0]); nt.links.new(tr.outputs[0], mix.inputs[1]); nt.links.new(em.outputs[0], mix.inputs[2]); nt.links.new(mix.outputs[0], out.inputs[0])
    o.data.materials.append(m); o['alpha_node'] = mult.name; o.visible_glossy = False; o.visible_diffuse = False; o.visible_shadow = False; o.visible_transmission = False; o.visible_volume_scatter = False
    return o
def set_alpha(o, a): o.data.materials[0].node_tree.nodes[o['alpha_node']].inputs[1].default_value = max(0.0, min(1.0, a))
def render_overlay(path, text_objs, all_objs, samples=4):
    """Render ONLY the given text objects at final resolution: transparent world, no denoise, no DOF. Restores state."""
    import bpy
    sc = bpy.context.scene; keep = {o: o.hide_render for o in all_objs}; st = (sc.render.resolution_x, sc.render.resolution_y, sc.render.film_transparent, sc.cycles.samples, sc.cycles.use_denoising, sc.render.resolution_percentage, sc.view_settings.view_transform)
    dof = sc.camera.data.dof.use_dof
    for o in all_objs: o.hide_render = True
    for o in text_objs: o.hide_render = False
    sc.render.resolution_x, sc.render.resolution_y = STATE['W'], STATE['H']; sc.render.resolution_percentage = 100; sc.render.film_transparent = True; sc.render.image_settings.color_mode = 'RGBA'
    sc.cycles.samples = samples; sc.cycles.use_denoising = False; sc.camera.data.dof.use_dof = False; sc.view_settings.view_transform = 'Standard'; sc.render.filter_size = 1.0
    sc.render.filepath = path; bpy.ops.render.render(write_still=True)
    for o, h in keep.items(): o.hide_render = h
    sc.render.resolution_x, sc.render.resolution_y, sc.render.film_transparent, sc.cycles.samples, sc.cycles.use_denoising, sc.render.resolution_percentage, sc.view_settings.view_transform = st; sc.camera.data.dof.use_dof = dof
def composite(beauty, overlay, out):
    b = Image.open(beauty).convert('RGBA'); W, H = STATE['W'], STATE['H']
    if b.size != (W, H): b = b.resize((W, H), Image.LANCZOS)
    o = Image.open(overlay).convert('RGBA')
    if o.size != (W, H): o = o.resize((W, H), Image.LANCZOS)
    b.alpha_composite(o); b.convert('RGB').save(out); return out
