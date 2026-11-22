"""Visual-first mockup v2 (Lemo `kino-montage`: real footage in windows, two-tone print grade, one red, diagonal bands).
usage: /usr/bin/python3 mockup2.py SCENE T OUT.png   (SCENE = V1 | V2 | V3; T = 0..1)
Footage: Mixkit free licence clips in /tmp/mkv/h_<id>.mp4 (frames graded to ink->paper by `grade()`, the style's print grade).
Blender 5.3 (bpy), emission-only flat print materials, text through scripts/blender_text.py in a crisp overlay pass."""
import sys, os, math, time, subprocess, bpy
import numpy as np
from PIL import Image
sys.path.insert(0, '/home/user/video-generator/scripts'); import blender_text as BT
SCENE, T, OUT = sys.argv[-3], float(sys.argv[-2]), sys.argv[-1]; t_start = time.time()
PAPER = '#EFE5D3'; INK = '#17122B'; RED = '#F0364F'
BW, BH = 720, 1280; PX = 160.0
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def lin(h):
    c = [x / 255 for x in hx(h)]; return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (1,)
def ss(x): x = max(0, min(1, x)); return x * x * (3 - 2 * x)
def seg(t, a, b): return ss((t - a) / (b - a))
def eo(x): x = max(0, min(1, x)); return 1 - (1 - x) ** 3
# ---- print grade: luminance -> percentile stretch -> S-curve -> ink..paper (style: s = .32, percentiles .7/99.5)
def grade(img, clip_pct=(0.7, 99.5)):
    a = np.asarray(img.convert('L'), dtype=np.float32) / 255.0
    lo, hi = np.percentile(a, clip_pct); a = np.clip((a - lo) / max(hi - lo, 1e-3), 0, 1)
    a = a + .32 * (a - .5) * (1 - np.abs(2 * a - 1)) * 2; a = np.clip(a, 0, 1)
    ink, pap = np.array(hx(INK), np.float32), np.array(hx(PAPER), np.float32)
    return Image.fromarray((ink + (pap - ink) * a[..., None]).astype(np.uint8))
def frame(vid, sec, size, focus=(.5, .5), flip=False):
    """grab a 720p frame of the clip, crop to the window aspect around `focus`, grade, return a PNG path"""
    key = f'/tmp/rl/fr_{vid}_{sec}_{size[0]}x{size[1]}_{focus[0]}_{focus[1]}.png'
    if os.path.exists(key): return key
    raw = f'/tmp/rl/raw_{vid}_{sec}.png'
    if not os.path.exists(raw): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(sec), '-i', f'/tmp/mkv/h_{vid}.mp4', '-frames:v', '1', raw], check=True)
    im = Image.open(raw).convert('RGB'); W, H = im.size; ar = size[0] / size[1]
    if W / H > ar: cw, ch = int(H * ar), H
    else: cw, ch = W, int(W / ar)
    x0 = int(min(max(focus[0] * W - cw / 2, 0), W - cw)); y0 = int(min(max(focus[1] * H - ch / 2, 0), H - ch))
    out = grade(im.crop((x0, y0, x0 + cw, y0 + ch))).resize((size[0] * 2, size[1] * 2), Image.LANCZOS); out.save(key); return key
os.makedirs('/tmp/rl', exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 8; sc.cycles.use_denoising = True
sc.view_settings.view_transform = 'Standard'; sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = BW, BH, 100; BT.init(1080, 1920)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = lin(PAPER); w.node_tree.nodes['Background'].inputs[1].default_value = 0.0
cd = bpy.data.cameras.new('c'); cd.lens = 36; cam = bpy.data.objects.new('c', cd); sc.collection.objects.link(cam); sc.camera = cam; cam.location = (0, 0, 12)
def wx(x): return (x - 540) / PX
def wy(y): return (960 - y) / PX
def flat(c):
    m = bpy.data.materials.new('m'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = lin(c); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def tex(path):
    m = bpy.data.materials.new('t'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path); t.interpolation = 'Cubic'
    e = nt.nodes.new('ShaderNodeEmission'); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(t.outputs[0], e.inputs[0]); nt.links.new(e.outputs[0], o.inputs[0]); return m
Z = [0.0]
def rect(x0, y0, x1, y1, m, rot=0.0, z=None, cx=None, cy=None):
    z = Z[0] if z is None else z; Z[0] += .002
    bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.object; o.scale = ((x1 - x0) / PX, (y1 - y0) / PX, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.location = (wx((x0 + x1) / 2 if cx is None else cx), wy((y0 + y1) / 2 if cy is None else cy), z); o.rotation_euler[2] = math.radians(rot); o.data.materials.append(m); return o
def window(x0, y0, x1, y1, vid, sec, focus=(.5, .5), a=1.0, border=6, bcol=INK):
    """a footage window: ink border then the graded frame, revealed left->right by a (scale in x about the left edge)."""
    if a < .01: return
    xe = x0 + (x1 - x0) * a; rect(x0 - border, y0 - border, xe + border, y1 + border, flat(bcol))
    path = frame(vid, sec, (x1 - x0, y1 - y0), focus)
    if a >= .999: rect(x0, y0, x1, y1, tex(path))
    else:
        im = Image.open(path); cw = max(2, int(im.size[0] * a)); p2 = path.replace('.png', f'_c{cw}.png'); im.crop((0, 0, cw, im.size[1])).save(p2); rect(x0, y0, xe, y1, tex(p2))
TXT = []
def txt(s, font, px, fill, x, y, align='left', rot=0.0, outline=None):
    o = BT.label(cam, s, font, px, fill=fill, u=(x - 540) / 1080, v=(960 - y) / 1920, dist=6, align=align, outline=outline)
    if rot: o.rotation_euler.rotate_axis('Z', math.radians(rot))
    TXT.append(o); return o
HEAD = BT.INK if False else BT.ANTON; MONO = BT.PLEX_SEMI; XB = BT.INTER_XBOLD
rect(-300, -300, 1380, 2220, flat(PAPER), z=-.05)
if SCENE == 'V1':
    # hook: a real Miami-night window, one red diagonal band slammed across, the question as structure
    a = seg(T, .0, .35); window(170, 250, 918, 840, 11816, 3.5, (.35, .62), a)
    b = seg(T, .25, .6); L = 1500 * b
    rect(540 - L / 2, 960, 540 + L / 2, 1130, flat(RED), rot=-18, cx=540, cy=1010)
    if b > .7:
        txt('READ THE', XB, 92, PAPER, 540, 965, 'center', rot=-18); txt('LABEL.', XB, 92, PAPER, 540, 1055, 'center', rot=-18)
    c = seg(T, .5, .8)
    if c > .1:
        rect(170, 1180, 170 + 360 * c, 1250, flat(INK)); txt('RATED  M · 17+', MONO, 30, PAPER, 190, 1215)
    txt('STAND-IN FOOTAGE · REAL MIAMI NIGHT · NOT THE GAME', MONO, 24, INK, 170, 1290)
elif SCENE == 'V2':
    # seven labels = seven film strips; the sixth is marked in red
    clips = [(11816, 3.0, (.3, .6)), (14116, 3.0, (.5, .5)), (48636, 2.0, (.5, .5)), (35540, 4.0, (.4, .5)), (27717, 6.0, (.5, .5)), (12026, 4.0, (.45, .6)), (5391, 3.0, (.5, .5))]
    for i, (v, s, f) in enumerate(clips):
        x0 = 170 + i * 108; a = seg(T, .05 + i * .07, .3 + i * .07); window(x0, 300, x0 + 92, 1060 - (1 - a) * 0, v, s, f, 1.0 if a > .99 else 1.0, border=5)
        if a < .99: pass
        txt(str(i + 1), MONO, 30, INK, x0 + 46, 1100, 'center')
    k = seg(T, .6, .85)
    if k > .02:
        x0 = 170 + 5 * 108; rect(x0 - 12, 290, x0 + 104, 296 + 8, flat(RED)); rect(x0 - 12, 1060 + 6, x0 + 104, 1068 + 6, flat(RED))
        rect(x0 - 12, 290, x0 - 6, 1074, flat(RED)); rect(x0 + 98, 290, x0 + 104, 1074, flat(RED))
        L = 560 * k; rect(918 - L, 1160, 918, 1260, flat(RED), rot=-4, cx=918 - L / 2, cy=1210)
        if k > .8: txt('SAME 7 AS GTA V', XB, 52, PAPER, 918 - 280, 1210, 'center', rot=-4)
    txt('STRONG SEXUAL CONTENT = LABEL 6 OF 7', MONO, 26, INK, 170, 1320) if k > .5 else None
elif SCENE == 'V3':
    # a posted page pulled: the footage window gets a red PULLED band
    a = seg(T, 0, .3); window(170, 260, 918, 960, 14116, 4.0, (.55, .5), a)
    b = seg(T, .35, .65); L = 1500 * b
    rect(540 - L / 2, 700, 540 + L / 2, 880, flat(RED), rot=-18, cx=540, cy=800)
    if b > .7: txt('PULLED.', XB, 120, PAPER, 540, 800, 'center', rot=-18)
    c = seg(T, .6, .9)
    if c > .05:
        rect(170, 1040, 918, 1230, flat(INK)); rect(190, 1062, 190 + 340 * c, 1074, flat(RED))
        txt('PEGI · SUMMARY REMOVED', MONO, 30, PAPER, 190, 1105); txt('reported, not confirmed', MONO, 28, '#C9BFAE', 190, 1160)
    txt('STAND-IN FOOTAGE · NOT THE GAME', MONO, 24, INK, 170, 1290)
bpy.context.view_layer.update()
beauty = OUT.replace('.png', '_b.png'); over = OUT.replace('.png', '_o.png')
geo = [o for o in sc.objects if o.type == 'MESH' and o not in TXT]
for o in TXT: o.hide_render = True
sc.render.filepath = beauty; t0 = time.time(); bpy.ops.render.render(write_still=True); tb = time.time() - t0
for o in TXT: o.hide_render = False
t0 = time.time(); BT.render_overlay(over, TXT, geo); to = time.time() - t0
BT.composite(beauty, over, OUT)
# paper fibre: a fixed seeded noise multiplied over the frame (style: alpha .5, here ±6 levels)
im = np.asarray(Image.open(OUT).convert('RGB'), np.float32); rng = np.random.default_rng(7); n = rng.normal(0, 4.5, im.shape[:2])[..., None]
Image.fromarray(np.clip(im + n, 0, 255).astype(np.uint8)).save(OUT)
print(f'SCENE {SCENE} T={T}: beauty {tb:.1f}s overlay {to:.1f}s total {time.time() - t_start:.1f}s')
