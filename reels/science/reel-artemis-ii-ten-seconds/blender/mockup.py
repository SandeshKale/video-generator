"""Countdown-split mockup (Lemo `countdown`) with REAL NASA Artemis II launch footage. usage: /usr/bin/python3 mockup.py SCENE OUT.png  (SCENE = A | B | C)
A: T-8 s, four cells. B: T-2 s, six cells. C: T+0, one picture, clock inverted. Camera offsets are ESTIMATES for the mockup (sync badge says so).
Beauty and text are one 1080x1920 render of flat emission planes; text via scripts/blender_text.py."""
import sys, os, math, time, subprocess, bpy
import numpy as np
from PIL import Image
sys.path.insert(0, '/home/user/video-generator/scripts'); import blender_text as BT
SCENE, OUT = sys.argv[-2], sys.argv[-1]; t_start = time.time()
GROUND = '#06080A'; PANEL = '#0B0E11'; TEXT = '#F2F5F7'; SEC = '#7C878D'; ORG = '#FF5B1F'; HAIR = '#1D2429'
PX = 160.0
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def lin(h):
    c = [x / 255 for x in hx(h)]; return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (1,)
# camera sources: file, file-time of ignition (T0) -- ESTIMATED for the mockup, badge: S = synced estimate, N = not synced / slow-mo
CAM = {'FLAG': ('/tmp/nasa/flag_s.mp4', 30.9, 'S'), 'VAB ROOF': ('/tmp/nasa/vab_roof_s.mp4', 62.3, 'S'), 'WB-57': ('/tmp/nasa/wb57_s.mp4', 12.0, 'S'),
       'ORION EXT': ('/tmp/nasa/orion_liftoff.mp4', 26.0, 'S'), 'CAUSEWAY': ('/tmp/nasa/causeway_low.mp4', 30.4, 'N'), 'CROWD': ('/tmp/nasa/banana.mp4', 296.0, 'N')}
os.makedirs('/tmp/art', exist_ok=True)
def cellimg(name, M, w, h):
    f, t0, _ = CAM[name]; s = max(0, t0 + M); key = f'/tmp/art/{name.replace(" ", "")}_{M:+.2f}_{w}x{h}.png'
    if not os.path.exists(key):
        probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip().split(',')
        W, H = int(probe[0]), int(probe[1]); ar = w / h; cw, ch = (int(H * ar), H) if W / H > ar else (W, int(W / ar)); x0, y0 = (W - cw) // 2, (H - ch) // 2
        grade = 'eq=contrast=1.07:saturation=0.9:gamma=0.97:brightness=-0.01,colorbalance=rs=-0.02:bs=0.03:rh=0.03:bh=-0.02'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{s:.3f}', '-i', f, '-frames:v', '1', '-vf', f'crop={cw}:{ch}:{x0}:{y0},scale={w*2}:{h*2}:flags=lanczos,{grade}', key], check=True)
    return key
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 4; sc.cycles.use_denoising = False; sc.view_settings.view_transform = 'Standard'
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100; sc.render.filter_size = 1.0; BT.init(1080, 1920)
w_ = bpy.data.worlds.new('w'); sc.world = w_; w_.use_nodes = True; w_.node_tree.nodes['Background'].inputs[1].default_value = 0.0
cd = bpy.data.cameras.new('c'); cd.lens = 36; cam = bpy.data.objects.new('c', cd); sc.collection.objects.link(cam); sc.camera = cam; cam.location = (0, 0, 12)
def wx(x): return (x - 540) / PX
def wy(y): return (960 - y) / PX
def flat(c):
    m = bpy.data.materials.new('m'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = lin(c); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def tex(path):
    m = bpy.data.materials.new('t'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path); t.interpolation = 'Linear'
    e = nt.nodes.new('ShaderNodeEmission'); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(t.outputs[0], e.inputs[0]); nt.links.new(e.outputs[0], o.inputs[0]); return m
Z = [0.0]
def rect(x0, y0, x1, y1, c=None, m=None):
    Z[0] += .002; bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.object; o.scale = ((x1 - x0) / PX, (y1 - y0) / PX, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.location = (wx((x0 + x1) / 2), wy((y0 + y1) / 2), Z[0]); o.data.materials.append(m or flat(c)); return o
def txt(s, font, px, fill, x, y, align='left', outline=None):
    return BT.label(cam, s, font, px, fill=fill, u=(x - 540) / 1080, v=(960 - y) / 1920, dist=6, align=align, outline=outline)
BARLOW = BT.font_path('barlow-condensed', 'barlow-condensed-latin-600-normal.woff2'); BARLOWX = BT.font_path('barlow-condensed', 'barlow-condensed-latin-800-normal.woff2'); MONO = BT.PLEX_SEMI; MONOB = BT.PLEX_BOLD; INTER = BT.INTER_XBOLD
def cell(name, M, x0, y0, x1, y1, idx, flash=False):
    w, h = x1 - x0, y1 - y0
    rect(x0 - 1, y0 - 1, x1 + 1, y1 + 1, HAIR); rect(x0, y0, x1, y1, m=tex(cellimg(name, M, w, h)))
    if flash: 
        for (a, b, c, d) in ((x0 - 3, y0 - 3, x1 + 3, y0), (x0 - 3, y1, x1 + 3, y1 + 3), (x0 - 3, y0, x0, y1), (x1, y0, x1 + 3, y1)): rect(a, b, c, d, ORG)
    rect(x0 + 8, y0 + 8, x0 + 8 + 32 + 82 + len(name) * 14 + 16, y0 + 40, '#06080A')
    synced = CAM[name][2] == 'S'; rect(x0 + 14, y0 + 19, x0 + 24, y0 + 29, ORG if synced else SEC)
    TXT.append(txt(f'CAM {idx}', MONOB, 22, TEXT, x0 + 32, y0 + 24)); TXT.append(txt(name, MONO, 22, SEC, x0 + 32 + 82, y0 + 24))
    if not synced: TXT.append(txt('NOT SYNCED · SLOW-MO' if name == 'CAUSEWAY' else 'NOT SYNCED', MONOB, 20, SEC, x0 + 12, y1 - 20))
TXT = []
def clock(M, x, y, big=118, invert=False):
    neg = M < -1e-6; a = abs(M); s = int(a); tenths = int((a - s) * 10)
    digs = f'{s // 60:02d}:{s % 60:02d}'; W0 = big * .46
    if invert: rect(x - 18, y - big * .62, x + 6 * W0 + big * 1.0, y + big * .52, ORG)
    col = '#0A0B0C' if invert else TEXT
    TXT.append(txt('T−' if neg else 'T+', BARLOW, big * .85, '#0A0B0C' if invert else ORG, x, y))
    xx = x + big * .95
    for i, ch in enumerate(digs):
        if ch == ':': TXT.append(txt(':', BARLOW, big, col, xx + i * W0 * .9 + 6, y - 6)); continue
        TXT.append(txt(ch, BARLOW, big, col, xx + (i if i < 2 else i - .2) * W0, y))
    TXT.append(txt(f'.{tenths}', BARLOW, big * .41, '#0A0B0C' if invert else SEC, xx + 5 * W0 + 8, y + big * .12))
    # sub-second bar: ten segments, one emptied per 0.1 s
    for k in range(10):
        on = (k < 10 - tenths) if neg else (k <= tenths)
        rect(x + k * 34, y + big * .62, x + k * 34 + 28, y + big * .62 + 8, (ORG if not invert else '#0A0B0C') if on else HAIR)
rect(-300, -300, 1380, 2220, GROUND)
if SCENE == 'A':
    M = -8.0; clock(M, 170, 330); TXT.append(txt('LAUNCH · KENNEDY SPACE CENTER · 1 APRIL 2026', MONO, 24, SEC, 170, 262))
    cw, ch, gx = 376, 330, 10
    for i, n in enumerate(['FLAG', 'VAB ROOF', 'WB-57', 'ORION EXT']):
        x0 = 156 + (i % 2) * (cw + gx); y0 = 470 + (i // 2) * (ch + gx); cell(n, M, x0, y0, x0 + cw, y0 + ch, i + 1)
    TXT.append(txt('FOOTAGE · NASA', MONO, 22, SEC, 156, 1290))
elif SCENE == 'B':
    M = -2.0; clock(M, 170, 330); TXT.append(txt('LAUNCH · KENNEDY SPACE CENTER · 1 APRIL 2026', MONO, 24, SEC, 170, 262))
    cw, ch, gx = 376, 220, 10
    for i, n in enumerate(['FLAG', 'VAB ROOF', 'WB-57', 'ORION EXT', 'CAUSEWAY', 'CROWD']):
        x0 = 156 + (i % 2) * (cw + gx); y0 = 470 + (i // 2) * (ch + gx); cell(n, M, x0, y0, x0 + cw, y0 + ch, i + 1, flash=(i == 5))
    rect(156, 1200, 918, 1262, '#0B0E11'); rect(166, 1220, 176, 1230, ORG); TXT.append(txt('NASA COMMENTARY', MONOB, 20, ORG, 186, 1225)); TXT.append(txt('…two… one…', MONO, 26, TEXT, 420, 1226))
elif SCENE == 'C':
    M = 0.0; cell('VAB ROOF', M + 3.6, 156, 232, 918, 1090, 1)  # a few seconds after zero, one picture
    clock(M, 170, 1180, big=100, invert=True)
    TXT.append(txt('LIFTOFF', ANTON if False else BARLOWX, 120, '#0A0B0C', 640, 1180)) if False else None
bpy.context.view_layer.update()
sc.render.filepath = OUT; bpy.ops.render.render(write_still=True)
print(f'SCENE {SCENE}: {time.time() - t_start:.1f}s')
