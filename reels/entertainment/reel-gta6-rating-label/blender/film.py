"""GTA VI rating-label reel — full film in Blender (Lemo `kino-montage`, own palette). Every frame is a pure function of t.
usage: /usr/bin/python3 film.py T0 T1 FPS OUTDIR SAMPLES   (skips frames that already exist)
Blender 5.3 (bpy), flat emission print materials, real stock footage (Mixkit, /tmp/mkv/h_<id>.mp4) graded to ink->paper per window,
all text through scripts/blender_text.py in the SAME render at final 1080x1920 (no denoise, no upscale). Scene times come from site/timing.js."""
import sys, os, math, json, time, subprocess, shutil
import numpy as np, bpy
from PIL import Image
sys.path.insert(0, '/home/user/video-generator/scripts'); import blender_text as BT
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T0, T1, FPS, OUT, SAMP = float(sys.argv[-5]), float(sys.argv[-4]), float(sys.argv[-3]), sys.argv[-2], int(sys.argv[-1])
START = 0
s = open(R + '/site/timing.js').read(); TM = json.loads(s[s.index('=') + 1:].rstrip().rstrip(';')); SEN = {x['id']: x for x in TM['sentences']}; DUR = TM['end']
def CW(id, w, n=0):
    k = 0
    for c in TM['cap']:
        if c['s'] == id and ''.join(ch for ch in c['w'].lower() if ch.isalnum()).startswith(w):
            if k == n: return c['t0']
            k += 1
    return SEN[id]['t0'] + .6
PAPER = '#EFE5D3'; INK = '#17122B'; RED = '#F0364F'; PX = 160.0
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def lin(h):
    c = [x / 255 for x in hx(h)]; return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (1,)
def ss(x): x = max(0, min(1, x)); return x * x * (3 - 2 * x)
def seg(t, a, b): return ss((t - a) / max(1e-6, b - a))
def eo(x): x = max(0, min(1, x)); return 1 - (1 - x) ** 3
def ob(x): x = max(0, min(1, x)); c1 = 1.7; return 1 + (c1 + 1) * (x - 1) ** 3 + c1 * (x - 1) ** 2
# ------------------------------------------------------------------ footage windows: graded frame sequences, cached per (clip, size, focus)
SEQ = '/tmp/rl/seq'; os.makedirs(SEQ, exist_ok=True); _seqs = {}
def grade(a, lo, hi):
    a = np.clip((a - lo) / max(hi - lo, 1e-3), 0, 1); a = a + .32 * (a - .5) * (1 - np.abs(2 * a - 1)) * 2; a = np.clip(a, 0, 1)
    ink, pap = np.array(hx(INK), np.float32), np.array(hx(PAPER), np.float32); return (ink + (pap - ink) * a[..., None]).astype(np.uint8)
def seq(vid, size, focus):
    key = f'{vid}_{size[0]}x{size[1]}_{focus[0]}_{focus[1]}'
    if key in _seqs: return _seqs[key]
    d = f'{SEQ}/{key}'
    if not os.path.exists(d + '/done'):
        os.makedirs(d, exist_ok=True); W, H = 1280, 720; ar = size[0] / size[1]
        cw, ch = (int(H * ar), H) if W / H > ar else (W, int(W / ar)); x0 = int(min(max(focus[0] * W - cw / 2, 0), W - cw)); y0 = int(min(max(focus[1] * H - ch / 2, 0), H - ch))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'/tmp/mkv/h_{vid}.mp4', '-vf', f'fps=12,crop={cw}:{ch}:{x0}:{y0},scale={size[0]}:{size[1]}:flags=lanczos,format=gray', '-f', 'rawvideo', f'{d}/raw.gray'], check=True)
        raw = np.fromfile(f'{d}/raw.gray', np.uint8).reshape(-1, size[1], size[0]).astype(np.float32) / 255
        lo, hi = np.percentile(raw[::3], .7), np.percentile(raw[::3], 99.5)
        for i in range(len(raw)): Image.fromarray(grade(raw[i], lo, hi)).save(f'{d}/{i:04d}.png')
        os.remove(f'{d}/raw.gray'); open(d + '/done', 'w').write(str(len(raw)))
    n = int(open(d + '/done').read()); _seqs[key] = (d, n); return _seqs[key]
# ------------------------------------------------------------------ scene state
CAM = None; TXT = []; Z = [0.0]
def reset():
    for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.cameras):
        for b in list(coll): coll.remove(b)
    TXT.clear(); Z[0] = 0.0
def wx(x): return (x - 540) / PX
def wy(y): return (960 - y) / PX
def flat(c):
    m = bpy.data.materials.new('m'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = lin(c); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def tex(path):
    m = bpy.data.materials.new('t'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path); t.interpolation = 'Linear'
    e = nt.nodes.new('ShaderNodeEmission'); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(t.outputs[0], e.inputs[0]); nt.links.new(e.outputs[0], o.inputs[0]); return m
_mc = {}
def M(c):
    if c not in _mc or _mc[c].name not in bpy.data.materials: _mc[c] = flat(c)
    return _mc[c]
def rect(x0, y0, x1, y1, c, rot=0.0, cx=None, cy=None, m=None):
    Z[0] += .002; bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.object; o.scale = ((x1 - x0) / PX, (y1 - y0) / PX, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.location = (wx((x0 + x1) / 2 if cx is None else cx), wy((y0 + y1) / 2 if cy is None else cy), Z[0]); o.rotation_euler[2] = math.radians(rot); o.data.materials.append(m or flat(c)); return o
def tri(p, c):
    Z[0] += .002; me = bpy.data.meshes.new('tri'); me.from_pydata([(wx(x), wy(y), 0) for x, y in p], [], [(0, 1, 2)]); o = bpy.data.objects.new('tri', me); bpy.context.scene.collection.objects.link(o); o.location.z = Z[0]; o.data.materials.append(flat(c)); return o
def window(x0, y0, x1, y1, vid, off, u, focus=(.5, .5), reveal=1.0, ground=PAPER, border=6, bcol=INK):
    if reveal < .01: return
    d, n = seq(vid, (x1 - x0, y1 - y0), focus); fi = int(((off + u) * 12) % n)
    rect(x0 - border, y0 - border, x1 + border, y1 + border, bcol); rect(x0, y0, x1, y1, None, m=tex(f'{d}/{fi:04d}.png'))
    if reveal < .999:                                                       # curtain in the ground colour slides off to the right
        xe = x0 + (x1 - x0) * reveal; rect(xe, y0 - border - 1, x1 + border + 1, y1 + border + 1, ground)
def txt(s, font, px, fill, x, y, align='left', rot=0.0, scale=1.0, alpha=1.0):
    if alpha <= .01: return
    o = BT.label(CAM, s, font, px, fill=fill, u=(x - 540) / 1080, v=(960 - y) / 1920, dist=6, align=align)
    if rot: o.rotation_euler.rotate_axis('Z', math.radians(rot))
    if scale != 1.0: o.scale = (scale, scale, 1)
    if alpha < .99: BT.set_alpha(o, alpha)
    TXT.append(o); return o
def band(cx, cy, L, th, rot, c=RED): return rect(cx - L / 2, cy - th / 2, cx + L / 2, cy + th / 2, c, rot=rot, cx=cx, cy=cy)
def tag(x, y, s, fill=INK, a=1.0): txt(s, MONO, 26, fill, x, y, alpha=a)
ANT = BT.ANTON; MONO = BT.PLEX_SEMI; MONOB = BT.PLEX_BOLD; XB = BT.INTER_XBOLD
STAND = 'STAND-IN FOOTAGE · NOT THE GAME'
def dashed(x0, y0, x1, y1, c=RED, th=5, dash=26, gap=16):
    for (ax, ay, bx, by) in ((x0, y0, x1, y0), (x0, y1, x1, y1), (x0, y0, x0, y1), (x1, y0, x1, y1)):
        L = math.hypot(bx - ax, by - ay); n = int(L // (dash + gap)); ux, uy = (bx - ax) / L, (by - ay) / L
        for i in range(n + 1):
            s0 = i * (dash + gap); s1 = min(L, s0 + dash)
            if s1 > s0: xa, ya, xb, yb = ax + ux * s0, ay + uy * s0, ax + ux * s1, ay + uy * s1; rect(min(xa, xb) - th / 2, min(ya, yb) - th / 2, max(xa, xb) + th / 2, max(ya, yb) + th / 2, c)
# ------------------------------------------------------------------ scenes: (id, start, end, draw(u, t, p))
DESC = [('maardhaad', 'BLOOD AND GORE'), ('tez', 'INTENSE VIOLENCE'), ('gaali', 'STRONG LANGUAGE'), ('nudity', 'NUDITY'), ('mature', 'MATURE HUMOR'), ('nasha', 'USE OF DRUGS AND ALCOHOL'), ('strong', 'STRONG SEXUAL CONTENT')]
STRIP = [(11816, (.3, .6)), (14116, (.5, .5)), (48636, (.5, .5)), (35540, (.4, .5)), (27717, (.5, .5)), (12026, (.45, .6)), (12022, (.5, .55))]
def sc_hook(u, t, p):
    window(170, 250, 918, 840, 11816, 0.0, u, (.35, .62), 1.0)
    t2 = SEN['s2']['t0']; sw = t >= t2; k = ob(seg(t, t2, t2 + .3)) if sw else 1.0
    band(540, 1010, 1500, 170, -18); txt('IN WRITING.' if sw else 'STEAMY SCENES?', XB, 82 if sw else 66, PAPER, 540, 1010, 'center', -18, scale=(.8 + .2 * k) if sw else 1.0)
    rect(170, 1180, 170 + 330, 1250, INK); txt('GTA 6 · RATED', MONO, 30, PAPER, 190, 1215); tag(170, 1290, STAND)
def sc_esrb(u, t, p):
    window(170, 260, 918, 760, 14116, 0.0, u, (.5, .5), eo(seg(u, 0, .35)))
    a = ob(seg(u, .1, .5)); rect(170, 800, 560, 1180, RED); txt('M', ANT, 360 * (.7 + .3 * a), PAPER, 365, 990, 'center', alpha=min(1, a * 2))
    b = ob(seg(t, CW('s3', 'satrah') - .2, CW('s3', 'satrah') + .25)); rect(590, 800, 918, 1180, INK)
    txt('17+', ANT, 150 * (.7 + .3 * b), PAPER, 754, 960, 'center', alpha=min(1, b * 2)); txt('MATURE', MONOB, 34, PAPER, 754, 1100, 'center', alpha=eo(seg(u, .4, .7)))
    tag(170, 1290, 'ESRB · LISTING · ' + STAND, INK)
def sc_seven(u, t, p):
    hot = -1
    for i, (w, _) in enumerate(DESC):
        if t >= CW('s4', w): hot = i
    for i, (v, f) in enumerate(STRIP):
        x0 = 170 + i * 108; a = eo(seg(u, .05 + i * .06, .3 + i * .06)); window(x0, 300, x0 + 92, 1060, v, i * .7, u, f, a, border=5)
        if hot == i and a > .5:
            c = RED; rect(x0 - 12, 290, x0 + 104, 298, c); rect(x0 - 12, 1062, x0 + 104, 1070, c); rect(x0 - 12, 290, x0 - 5, 1070, c); rect(x0 + 97, 290, x0 + 104, 1070, c)
        txt(str(i + 1), MONO, 30, INK, x0 + 46, 1100, 'center')
    if hot >= 0:
        rect(170, 1150, 918, 1250, RED if hot == 6 else INK); txt(DESC[hot][1], MONOB, 42 if len(DESC[hot][1]) < 22 else 40, PAPER, 194, 1200)
    tag(170, 1290, 'ESRB · LISTING · ' + STAND)
def sc_same(u, t, p):
    for i, (v, f) in enumerate(STRIP):
        x0 = 170 + i * 108; window(x0, 300, x0 + 92, 1060, v, 3 + i * .7, u, f, 1.0, border=5)
        k = eo(seg(u, .5 + i * .07, .75 + i * .07))
        if k > .02:
            rect(x0 - 5, 1075, x0 + 97, 1075 + 56 * k, INK); txt('V', MONOB, 30, PAPER, x0 + 46, 1103, 'center', alpha=k)       # tick column: this label is on GTA V too
    c = ob(seg(u, .15, .5)); L = 760 * min(1, c)
    rect(918 - L, 1160, 918, 1250, RED, rot=-3, cx=918 - L / 2, cy=1205)
    if c > .6: txt('SAME 7 AS GTA V', XB, 52, PAPER, 918 - 380, 1205, 'center', -3)
    tag(170, 1300, 'ESRB PAGES · READ 22 NOV')
def sc_words(u, t, p):
    k = ob(seg(u, 0, .35)); rect(170, 420, 918, 840, RED); txt('WORDS.', ANT, 250 * (.75 + .25 * k), PAPER, 544, 640, 'center', alpha=min(1, k * 2))
    window(170, 900, 918, 1200, 48636, 0.0, u, (.5, .45), eo(seg(u, .25, .6)))
    tag(170, 1290, 'NOT NEW LABELS · NEW WORDS · ' + 'STAND-IN FOOTAGE')
def sc_au(u, t, p):
    window(170, 260, 918, 860, 12026, 0.0, u, (.4, .6), eo(seg(u, 0, .35)))
    band(540, 880, 1500, 120, -8)
    k = ob(seg(t, CW('s7', 'sex') - .2, CW('s7', 'sex') + .3)); rect(170, 960, 918, 1150, INK)
    txt('AU / NZ · STORE LISTINGS', MONOB, 30, RED, 194, 1000, alpha=eo(seg(u, .2, .5))); txt('“sex scenes”', XB, 84 * (.8 + .2 * k), PAPER, 194, 1085, alpha=min(1, k * 2))
    tag(170, 1210, 'RATING LEVEL: REPORTS DIFFER · NOT VOICED', INK, eo(seg(u, .8, 1.1))); tag(170, 1290, STAND)
def sc_pegi(u, t, p):
    window(170, 260, 918, 960, 14116, 4.0, u, (.55, .5), eo(seg(u, 0, .3)))
    tb = CW('s8', 'atharah'); k = ob(seg(t, tb - .1, tb + .3)); rect(654, 300, 878, 420, INK) if k > .05 else None
    if k > .05: txt('PEGI 18', ANT, 84 * (.8 + .2 * k), PAPER, 766, 362, 'center', alpha=min(1, k * 2))
    th = CW('s8', 'hata'); b = seg(t, th - .15, th + .25)
    if b > .01: L = 1500 * b; band(540, 760, L, 190, -18); txt('PULLED.', XB, 122, PAPER, 540, 760, 'center', -18, alpha=1.0 if b > .7 else 0)
    c = seg(t, CW('s8', 'ab') - .1, CW('s8', 'ab') + .4)
    if c > .02:
        rect(170, 1030, 918, 1240, INK); rect(190, 1052, 190 + 340 * c, 1064, RED)
        txt('PEGI · SUMMARY REMOVED', MONOB, 30, PAPER, 190, 1100); txt('page today: a short, generic summary', MONO, 28, '#C9BFAE', 190, 1150)
        d = seg(t, CW('s9', 'confirm') - .5, CW('s9', 'confirm')); txt('reported, not confirmed', MONOB, 28, RED, 190, 1200, alpha=d)
    tag(170, 1290, STAND)
def sc_three(u, t, p):
    rows = [(12022, 'M', 'ESRB', .0), (35540, '18', 'PEGI', .15), (27717, 'AU', 'STORE', .3)]
    for i, (v, num, nm, dl) in enumerate(rows):
        y0 = 300 + i * 270; a = eo(seg(u, dl, dl + .35)); window(340, y0, 918, y0 + 230, v, i * 2.0, u, (.5, .5), a)
        rect(170, y0 - 6, 334, y0 + 236, RED if i < 2 else INK); txt(num, ANT, 120, PAPER, 252, y0 + 98, 'center', alpha=a); txt(nm, MONOB, 26, PAPER, 252, y0 + 200, 'center', alpha=a)
        if i == 2 and a > .8: dashed(334, y0 - 12, 922, y0 + 242, RED)
    k = ob(seg(t, CW('s10', 'alag', 1) - .2, CW('s10', 'alag', 1) + .3)); L = 760 * min(1, k)
    if L > 5: rect(918 - L, 1160, 918, 1250, RED, rot=-3, cx=918 - L / 2, cy=1205)
    if k > .6: txt('SAME GAME. NEW WORDS.', XB, 44, PAPER, 918 - 380, 1205, 'center', -3)
    tag(170, 1300, STAND)
def sc_lock(u, t, p):
    window(170, 260, 918, 860, 27717, 2.0, u, (.5, .5), eo(seg(u, 0, .3)))
    k = ob(seg(u, .15, .5)); tri([(540, 880 - 300 * min(1.0, .6 + .4 * k) + 300), (540 - 160, 1180), (540 + 160, 1180)], RED) if False else None
    band(540, 960, 1500, 150, -18); txt('A WARNING.', XB, 80, PAPER, 540, 960, 'center', -18, alpha=eo(seg(u, .1, .4)))
    t2 = CW('s11', 'taala') - .2
    if t >= t2: kk = ob(seg(t, t2, t2 + .3)); band(560, 1120, 1500 * min(1, kk * 1.5), 140, -18, INK); txt('NOT A LOCK.', XB, 76, PAPER, 560, 1120, 'center', -18, alpha=1 if kk > .6 else 0)
    tag(170, 1290, STAND)
def sc_close(u, t, p):
    window(170, 260, 918, 760, 11816, 5.0, u, (.35, .62), eo(seg(u, 0, .35)))
    a = ob(seg(u, .2, .55)); rect(170, 800, 918, 1010, RED); txt('READ THE LABEL.', ANT, 100, PAPER, 194, 905, alpha=min(1, a * 2))
    t2 = CW('s12', 'afwahein') - .6; b = ob(seg(t, t2, t2 + .3)); rect(170, 1040, 918, 1250, INK) if b > .05 else None
    if b > .05: txt('NOT THE RUMOUR.', ANT, 100, PAPER, 194, 1145, alpha=min(1, b * 2))
    tag(170, 1290, STAND)
def sc_cta(u, t, p):
    rect(-300, -300, 1380, 2220, INK, m=None); window(170, 260, 918, 860, 11816, 7.0, u, (.35, .62), 1.0, bcol=RED)
SCN = [('hook', 0.0, 'sc_hook'), ('esrb', SEN['s3']['t0'], 'sc_esrb'), ('seven', SEN['s4']['t0'], 'sc_seven'), ('same', SEN['s5']['t0'], 'sc_same'), ('words', SEN['s6']['t0'], 'sc_words'),
       ('au', SEN['s7']['t0'], 'sc_au'), ('pegi', SEN['s8']['t0'], 'sc_pegi'), ('three', SEN['s10']['t0'], 'sc_three'), ('lock', SEN['s11']['t0'], 'sc_lock'), ('close', SEN['s12']['t0'], 'sc_close'), ('cta', SEN['s13']['t0'], 'sc_cta')]
# the three-board scene should start a hair before its sentence so the numerals land with "ek hi game"
def scene_at(t):
    idx = 0
    for i, (n, st, f) in enumerate(SCN):
        if t >= st - .02: idx = i
    return idx
def draw_frame(t):
    reset(); sc = bpy.context.scene
    cd = bpy.data.cameras.new('c'); cd.lens = 36; global CAM; CAM = bpy.data.objects.new('c', cd); sc.collection.objects.link(CAM); sc.camera = CAM; CAM.location = (0, 0, 12)
    w = bpy.data.worlds.get('w') or bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[1].default_value = 0.0
    i = scene_at(t); name, st, fn = SCN[i]; u = max(0.0, t - st); end = SCN[i + 1][1] if i + 1 < len(SCN) else DUR
    ground = INK if name == 'cta' else PAPER
    rect(-300, -300, 1380, 2220, ground)
    globals()[fn](u, t, u / max(.01, end - st))
    # diagonal wipe at each scene boundary: a red leaning slab crosses the frame, the scene switches at its middle
    for j in range(1, len(SCN)):
        tb = SCN[j][1]
        if tb - .16 <= t <= tb + .20:
            k = (t - (tb - .16)) / .36; cx = -500 + k * 2080; rect(cx - 380, -400, cx + 380, 2300, RED, rot=-14, cx=cx, cy=960)
    sc.render.filepath = ''
def main():
    sc = bpy.context.scene; bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMP; sc.cycles.use_denoising = False; sc.view_settings.view_transform = 'Standard'
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100; sc.render.filter_size = 1.0; BT.init(1080, 1920)
    sc.render.image_settings.file_format = 'PNG'; os.makedirs(OUT, exist_ok=True)
    n = int(round((T1 - T0) * FPS)); t_all = time.time()
    for k in range(START, n):
        t = T0 + k / FPS; f = f'{OUT}/f{int(round(t * FPS)):05d}.png'
        if os.path.exists(f): continue
        t1 = time.time(); draw_frame(t); sc.render.filepath = f; bpy.ops.render.render(write_still=True)
        if k % 20 == 0: print(f'frame {k}/{n} t={t:.2f} {time.time() - t1:.1f}s', flush=True)
    print('DONE', round(time.time() - t_all, 1), 's', flush=True)
main()
