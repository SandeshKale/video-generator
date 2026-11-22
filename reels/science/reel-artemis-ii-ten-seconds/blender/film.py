"""Artemis II 'ten seconds' reel — full film in Blender (Lemo `countdown`, own palette). Every frame is a pure function of t.
usage: /usr/bin/python3 film.py --prep                    (extract + cache footage frames once)
       /usr/bin/python3 film.py T0 T1 FPS OUTDIR SAMPLES   (skips frames that already exist)
Real NASA footage (/tmp/nasa) as flat emission planes, text through scripts/blender_text.py in the SAME 1080x1920 render. Scene times come from site/timing.js."""
import sys, os, math, json, time, subprocess
PREP = '--prep' in sys.argv
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
s = open(R + '/site/timing.js').read(); TM = json.loads(s[s.index('=') + 1:].rstrip().rstrip(';')); SEN = {x['id']: x for x in TM['sentences']}; DUR = TM['end']
def CW(id, w, n=0):
    k = 0
    for c in TM['cap']:
        if c['s'] == id and ''.join(ch for ch in c['w'].lower() if ch.isalnum()).startswith(w):
            if k == n: return c['t0']
            k += 1
    return SEN[id]['t0'] + .6
Z = SEN['s4']['t0'] - 3.0                                        # film time of liftoff (T0); M = t - Z is the event time in seconds
FPSF = 24                                                         # footage cache rate (film is rendered at 24 fps)
N = '/tmp/nasa'; CACHE = '/tmp/art/seq'; os.makedirs(CACHE, exist_ok=True)
# camera table: file, file-time of T0 (measured: flag = NASA field timer; WB-57 = SRB flash; VAB = first rise; ORION = flame jump), crop (x,y,w,h fractions), focus
CAMS = {
 'FLAG': dict(f='flagm.mp4', t0=30.4, sync=True, crop=(0, 0, 1, 1), focus=(.62, .62)),
 'VAB ROOF': dict(f='vabm.mp4', t0=63.3, sync=True, crop=(0, 0, 1, 1), focus=(.45, .55)),
 'WB-57': dict(f='wbm.mp4', t0=11.6, sync=True, crop=(0, 0, 1, 1), focus=(.45, .6)),
 'ORION CAM': dict(f='orion_liftoff.mp4', t0=20.6, sync=True, crop=(.40, 0, .46, 1), focus=(.5, .5)),
 'CAUSEWAY': dict(f='causes.mp4', t0=0.5, sync=False, crop=(0, 0, 1, 1), focus=(.5, .6), tag='SLOW-MO'),
 'CROWD': dict(f='bananas.mp4', t0=3.0, sync=False, crop=(0, 0, 1, 1), focus=(.5, .5), tag='REACTION'),
}
CLIPS = {'SEP': ('sep.mp4', 236.0, 252.0, (0, 0, 1, 1)), 'CHUTES': ('chutes.mp4', 0.0, 9.5, (0, 0, 1, 1)), 'GSS': ('gss.mp4', 20.0, 40.0, (0, 0, 1, 1)),
         'FLYBY': ('flyby.mp4', 0.0, 57.0, (0, 0, 1, 1)), 'TRAILER': ('trailer.mp4', 5.0, 9.5, (0, 0, 1, 1))}
GRADE = 'eq=contrast=1.07:saturation=0.9:gamma=0.97:brightness=-0.01,colorbalance=rs=-0.02:bs=0.03:rh=0.03:bh=-0.02'
def seqdir(name, ta, tb, crop):
    d = f'{CACHE}/{name}_{ta:.1f}_{tb:.1f}'.replace(' ', '_')
    if not os.path.exists(d + '/done'):
        os.makedirs(d, exist_ok=True); f = (CAMS[name]['f'] if name in CAMS else CLIPS[name][0]); cx, cy, cw, ch = crop
        vf = f'fps={FPSF},crop=iw*{cw}:ih*{ch}:iw*{cx}:ih*{cy},scale=960:-2:flags=lanczos,{GRADE}'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, ta):.3f}', '-t', f'{tb - max(0, ta):.3f}', '-i', f'{N}/{f}', '-vf', vf, '-q:v', '3', f'{d}/%05d.jpg'], check=True)
        open(d + '/done', 'w').write('1')
    return d
# time ranges each cell needs (file seconds), from the plan below
def need():
    out = {}
    for n, c in CAMS.items():
        a = c['t0'] - (Z + 1.0); b = c['t0'] + 8.0
        if n == 'CROWD': a, b = 0.0, 14.0
        if n == 'CAUSEWAY': a, b = 0.0, 40.0
        if n == 'ORION CAM': a = max(a, 0.0)
        out[n] = (max(0.0, a), b)
    out['VAB ROOF'] = (max(0.0, CAMS['VAB ROOF']['t0'] - Z - 1), CAMS['VAB ROOF']['t0'] + 45.0)
    for k, (f, a, b, cr) in CLIPS.items(): out[k] = (a, b)
    return out
if PREP:
    for n, (a, b) in need().items():
        seqdir(n, a, b, CAMS[n]['crop'] if n in CAMS else CLIPS[n][3]); print('prepared', n, round(a, 1), round(b, 1), flush=True)
    sys.exit(0)
import numpy as np, bpy
from PIL import Image
sys.path.insert(0, '/home/user/video-generator/scripts'); import blender_text as BT
T0, T1, FPS, OUT, SAMP = float(sys.argv[-5]), float(sys.argv[-4]), float(sys.argv[-3]), sys.argv[-2], int(sys.argv[-1])
NEED = need()
GROUND = '#06080A'; PANEL = '#0B0E11'; TXT = '#F2F5F7'; SEC = '#7C878D'; ORG = '#FF5B1F'; HAIR = '#26303A'; PX = 160.0
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def lin(h):
    c = [x / 255 for x in hx(h)]; return tuple(((x + .055) / 1.055) ** 2.4 if x > .04045 else x / 12.92 for x in c) + (1,)
def ss(x): x = max(0, min(1, x)); return x * x * (3 - 2 * x)
def seg(t, a, b): return ss((t - a) / max(1e-6, b - a))
def eo(x): x = max(0, min(1, x)); return 1 - (1 - x) ** 3
def ob(x): x = max(0, min(1, x)); c1 = 1.7; return 1 + (c1 + 1) * (x - 1) ** 3 + c1 * (x - 1) ** 2
def lerp(a, b, k): return a + (b - a) * k
CAM = None; TXTO = []; ZZ = [0.0]; _mc = {}
def reset():
    for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.cameras):
        for b in list(coll): coll.remove(b)
    TXTO.clear(); ZZ[0] = 0.0; _mc.clear()
def wx(x): return (x - 540) / PX
def wy(y): return (960 - y) / PX
def flat(c):
    m = bpy.data.materials.new('m'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = lin(c); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(e.outputs[0], o.inputs[0]); return m
def texm(path):
    m = bpy.data.materials.new('t'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(path); t.interpolation = 'Linear'
    e = nt.nodes.new('ShaderNodeEmission'); o = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(t.outputs[0], e.inputs[0]); nt.links.new(e.outputs[0], o.inputs[0]); return m
def M_(c):
    if c not in _mc or _mc[c].name not in bpy.data.materials: _mc[c] = flat(c)
    return _mc[c]
def rect(x0, y0, x1, y1, c, m=None, uv=None):
    ZZ[0] += .002; bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.object; o.scale = (max(.01, x1 - x0) / PX, max(.01, y1 - y0) / PX, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.location = (wx((x0 + x1) / 2), wy((y0 + y1) / 2), ZZ[0]); o.data.materials.append(m or M_(c))
    if uv:                                                                 # (u0, v0, u1, v1) crop of the texture
        u0, v0, u1, v1 = uv; layer = o.data.uv_layers.active
        for li, loop in enumerate(o.data.loops):
            p = o.data.vertices[loop.vertex_index].co; layer.data[li].uv = (u0 if p.x < 0 else u1, v0 if p.y < 0 else v1)
    return o
def line(x0, y0, x1, y1, c, th=1): return rect(x0, y0, x1, y0 + th, c) if y0 == y1 else rect(x0, y0, x0 + th, y1, c)
def box(x0, y0, x1, y1, c=HAIR, th=2):
    rect(x0, y0, x1, y0 + th, c); rect(x0, y1 - th, x1, y1, c); rect(x0, y0, x0 + th, y1, c); rect(x1 - th, y0, x1, y1, c)
ANT = BT.ANTON; MONO = BT.PLEX_SEMI; MONOB = BT.PLEX_BOLD; XB = BT.INTER_XBOLD
def txt(s, font, px, fill, x, y, align='left', alpha=1.0):
    if alpha <= .01: return
    o = BT.label(CAM, s, font, px, fill=fill, u=(x - 540) / 1080, v=(960 - y) / 1920, dist=6, align=align)
    if alpha < .99: BT.set_alpha(o, alpha)
    TXTO.append(o); return o
# ------------------------------------------------------------------ footage cell
_sd = {}
def frame_path(name, tfile):
    a, b = NEED[name]; k = (name, a, b)
    if k not in _sd: _sd[k] = seqdir(name, a, b, CAMS[name]['crop'] if name in CAMS else CLIPS[name][3])
    n = len([x for x in os.listdir(_sd[k]) if x.endswith('.jpg')]); i = int(round((min(max(tfile, a), b) - max(0, a)) * FPSF)) + 1
    return f'{_sd[k]}/{min(max(i, 1), n):05d}.jpg'
def picture(name, tfile, x0, y0, x1, y1, focus=(.5, .5), zoom=1.0):
    p = frame_path(name, tfile); ia = 960 / 540.0 if name not in CAMS or name not in ('ORION CAM',) else (.46 * 1080) / (1 * 608); im = Image.open(p); ia = im.size[0] / im.size[1]
    ca = (x1 - x0) / max(1.0, (y1 - y0)); fw = fh = 1.0 / zoom
    if ca < ia: fw = ca / ia / zoom
    else: fh = ia / ca / zoom
    cx = min(max(focus[0], fw / 2), 1 - fw / 2); cy = min(max(focus[1], fh / 2), 1 - fh / 2)
    return rect(x0, y0, x1, y1, None, m=texm(p), uv=(cx - fw / 2, 1 - (cy + fh / 2), cx + fw / 2, 1 - (cy - fh / 2)))
# ------------------------------------------------------------------ clock block (digits in equal slots; the clock leads)
def clock(m, x0=150, y0=232, x1=918, y1=440, inv=False, label='', sub=''):
    bg = ORG if inv else PANEL; fg = GROUND if inv else TXT; sec = GROUND if inv else SEC
    rect(x0, y0, x1, y1, bg); box(x0, y0, x1, y1, ORG if inv else HAIR, 2)
    neg = m < 0; v = abs(m) if neg else m; tot = int(math.floor(v + 1e-9)); mm, s_ = tot // 60, tot % 60; ten = int((v - tot) * 10)
    ch = ['T', '−' if neg else '+', f'{mm:02d}'[0], f'{mm:02d}'[1], ':', f'{s_:02d}'[0], f'{s_:02d}'[1]]; pitch = 74
    for i, c in enumerate(ch): txt(c, ANT, 140, fg, x0 + 56 + i * pitch, y0 + 108, 'center')
    txt(f'.{ten}', ANT, 76, sec, x0 + 56 + 7 * pitch - 8, y0 + 128, 'left')
    if label: txt(label, MONOB, 24, sec, x0 + 24, y0 + 30, 'left')
    if sub: txt(sub, MONO, 20, sec, x0 + 24, y1 - 20, 'left')
    for i in range(10):                                                   # the 10-segment bar of the current second
        xa = x1 - 24 - (10 - i) * 28; on = i <= ten; rect(xa, y1 - 30, xa + 20, y1 - 14, fg if on else (HAIR if not inv else '#C94410'))
# ------------------------------------------------------------------ cells and layouts
AX0, AY0, AX1, AY1 = 150, 460, 918, 1210
def grid(n):
    g = 16; W = AX1 - AX0; H = AY1 - AY0; w2 = (W - g) / 2
    if n == 1: return [(AX0, AY0, AX1, AY1)]
    if n == 2: return [(AX0, AY0, AX0 + w2, AY1), (AX0 + w2 + g, AY0, AX1, AY1)]
    if n == 3: h = (H - g) / 2; return [(AX0, AY0, AX0 + w2, AY1), (AX0 + w2 + g, AY0, AX1, AY0 + h), (AX0 + w2 + g, AY0 + h + g, AX1, AY1)]
    if n == 4: h = (H - g) / 2; return [(AX0 + (i % 2) * (w2 + g), AY0 + (i // 2) * (h + g), AX0 + (i % 2) * (w2 + g) + w2, AY0 + (i // 2) * (h + g) + h) for i in range(4)]
    h = (H - 2 * g) / 3; return [(AX0 + (i % 2) * (w2 + g), AY0 + (i // 2) * (h + g), AX0 + (i % 2) * (w2 + g) + w2, AY0 + (i // 2) * (h + g) + h) for i in range(6)]
# phases of the countdown scene: (event time M when the layout starts, cameras in order)
PH = [(-999, ['FLAG']), (-19.0, ['VAB ROOF', 'FLAG']), (-14.0, ['VAB ROOF', 'FLAG', 'ORION CAM']), (-10.0, ['VAB ROOF', 'FLAG', 'ORION CAM', 'WB-57']),
      (-5.5, ['VAB ROOF', 'FLAG', 'ORION CAM', 'WB-57', 'CAUSEWAY', 'CROWD']), (-0.6, ['VAB ROOF']), (1.6, ['VAB ROOF', 'WB-57'])]
TR = .5
def layout_at(m):
    i = max(j for j, (ms, _) in enumerate(PH) if m >= ms); ms, cams = PH[i]; cur = grid(len(cams)); out = {}
    k = ss((m - ms) / TR) if i > 0 else 1.0
    prev = {c: r for c, r in zip(PH[i - 1][1], grid(len(PH[i - 1][1])))} if i > 0 else {}
    win = cur[0]
    for c, r in zip(cams, cur):
        if c in prev: p = prev[c]; out[c] = tuple(lerp(p[j], r[j], k) for j in range(4)) + (1.0,)
        else: out[c] = r + (k,)
    if i > 0 and k < 1:
        for c, p in prev.items():
            if c not in out: out[c] = tuple(lerp(p[j], win[j], k) for j in range(4)) + (1 - k,)
    return out
def cell(name, rect_, tfile, a=1.0, focus=None, zoom=1.0, chip=True):
    x0, y0, x1, y1, ra = rect_
    ra = ra * a
    if ra < .03: return
    c = CAMS[name]; f = focus or c['focus']
    if ra < .999: x1 = x0 + (x1 - x0) * ra                               # reveal from the left edge
    picture(name, tfile, x0, y0, x1, y1, f, zoom); box(x0, y0, x1, y1, HAIR, 2)
    if not chip: return
    if (x1 - x0) < 150: return
    wid = 32 + 20 + len(name) * 14 + 14; rect(x0 + 8, y0 + 8, x0 + 8 + wid, y0 + 40, GROUND); rect(x0 + 14, y0 + 16, x0 + 30, y0 + 32, ORG if c['sync'] else SEC)
    txt(name, MONOB, 22, TXT, x0 + 40, y0 + 25)
    if not c['sync']:
        t = 'NOT SYNCED · ' + c.get('tag', ''); w2 = 24 + len(t) * 13; rect(x1 - 8 - w2, y1 - 38, x1 - 8, y1 - 8, GROUND); txt(t, MONO, 20, SEC, x1 - 8 - w2 + 12, y1 - 23)
def strip(txt_l, txt_r='FOOTAGE: NASA', y=1238):
    rect(AX0, y, AX1, y + 46, PANEL); box(AX0, y, AX1, y + 46, HAIR, 1); txt(txt_l, MONO, 22, SEC, AX0 + 16, y + 23); txt(txt_r, MONO, 22, SEC, AX1 - 16 - 13.2 * len(txt_r), y + 23, 'left')
# ------------------------------------------------------------------ scenes
def sc_count(t):
    m = t - Z; inv = m >= 0
    clock(m, inv=inv, label=('1 APRIL · ONE ROCKET · SIX CAMERAS' if t < SEN['s3']['t0'] + 1 else 'ARTEMIS II · LIFTOFF CLOCK'), sub='REAL TIME · 1 s = 1 s')
    L = layout_at(m)
    for name, r in L.items():
        c = CAMS[name]; tf = c['t0'] + m
        if name == 'CAUSEWAY': tf = c['t0'] + max(0, m + 5.0) * 0.5 if m > -5.0 else c['t0']        # slow-mo source: shown, never claimed in sync
        if name == 'CROWD': tf = c['t0'] + max(0.0, m + 5.5)
        foc = c['focus']
        if m > 0 and name == 'VAB ROOF': foc = (.5, lerp(.58, .22, ss(m / 9.0)))
        if m > 0 and name == 'WB-57': foc = (.5, lerp(.62, .35, ss(m / 7.0)))
        cell(name, r, tf, 1.0, foc)
    n_cells = len([1 for r in L.values() if r[4] > .5])
    strip(f'KSC LC-39B · 1 APR 2026 · {n_cells} CELL{"S" if n_cells != 1 else ""}', 'FOOTAGE: NASA')
    if abs(m) < .3 and m > -.3:                                              # the zero flash
        k = 1 - abs(m) / .3; rect(0, 0, 1080, 1920, TXT, m=None) if False else None
def sc_sep(t):
    u = t - SEN['s4']['t0']; m = 480.0 + (t - CW('s4', 'aath'))
    clock(max(m, 480.0), inv=True, label='ARTEMIS II · LIFTOFF CLOCK', sub='SKIPPED AHEAD TO T+8 MIN')
    picture('SEP', 240.0 + (t - CW('s4', 'aath')), AX0, AY0, AX1, AY1, (.45, .5)); box(AX0, AY0, AX1, AY1, HAIR, 2)
    rect(AX0 + 8, AY0 + 8, AX0 + 8 + 330, AY0 + 40, GROUND); rect(AX0 + 14, AY0 + 16, AX0 + 30, AY0 + 32, ORG); txt('ORION · SOLAR-WING CAM', MONOB, 22, TXT, AX0 + 40, AY0 + 25)
    strip('SLS CORE STAGE SEPARATION · T+8 MIN', 'FOOTAGE: NASA')
def head(a, b=''):
    rect(AX0, 232, AX1, 430, PANEL); box(AX0, 232, AX1, 430, HAIR, 2); txt(a, XB, 62, TXT, AX0 + 28, 296, 'left'); txt(b, MONO, 24, SEC, AX0 + 28, 396, 'left')
def sc_splash(t):
    u = t - SEN['s5']['t0']; end = SEN['s6']['t0']
    k = seg(t, SEN['s5']['t0'], CW('s5', 'battees') + .8)                      # mission elapsed counter rolls up to 9 d 1 h 32 min
    d = int(round(9 * k)); h = int(round(1 * k)); mi = int(round(32 * k))
    head('SPLASHDOWN · 10 APR 2026', f'MISSION ELAPSED  {d:02d}D {h:02d}H {mi:02d}M  (COUNT-UP · NOT REAL TIME)')
    first = t < CW('s5', 'orion') + 1.2
    if first: picture('CHUTES', 0.0 + u * .9, AX0, AY0, AX1, AY1, (.5, .5)); lab = 'ORION · WINDOW CAM · 3 MAIN PARACHUTES'
    else: picture('GSS', 20.0 + (t - CW('s5', 'orion') - 1.2), AX0, AY0, AX1, AY1, (.5, .5)); lab = 'SPLASHDOWN · PACIFIC · AIRCRAFT CAM'
    box(AX0, AY0, AX1, AY1, HAIR, 2); rect(AX0 + 8, AY0 + 8, AX0 + 8 + 30 + len(lab) * 13, AY0 + 40, GROUND); rect(AX0 + 14, AY0 + 16, AX0 + 30, AY0 + 32, SEC); txt(lab, MONOB, 22, TXT, AX0 + 40, AY0 + 25)
    strip('9 DAYS 1 H 32 MIN · NASA MISSION PAGE', 'FOOTAGE: NASA')
def sc_dist(t, crescent=False):
    sid = 's7' if crescent else 's6'; u = t - SEN[sid]['t0']
    head('FARTHEST FROM EARTH' if not crescent else 'LOOP, NOT LANDING', 'PRESS-REPORTED (AP) · NASA FIGURE NOT FOUND' if not crescent else 'FLYBY ROUTE · NASA VISUALIZATION')
    if not crescent: ft = 4.0 + u * .9
    else: ft = 22.0 + u * 2.2
    picture('FLYBY', min(ft, 56.5), AX0, AY0, AX1, AY1, (.5, .5)); box(AX0, AY0, AX1, AY1, HAIR, 2)
    if not crescent:
        k = ob(seg(t, CW('s6', 'lakh') - .5, CW('s6', 'lakh') + 1.1)); v = int(252750 * min(1.0, k)); km = v * 1.60934 / 100000.0
        rect(AX0 + 24, AY1 - 300, AX1 - 24, AY1 - 24, GROUND); box(AX0 + 24, AY1 - 300, AX1 - 24, AY1 - 24, ORG, 2)
        txt(f'{v:,}', ANT, 150, TXT, AX0 + 48, AY1 - 190, 'left'); txt('MILES', MONOB, 30, ORG, AX1 - 48, AY1 - 190, 'right')
        txt(f'~ {km:.2f} LAKH KM', XB, 56, TXT, AX0 + 48, AY1 - 84, 'left'); txt('BEATS APOLLO 13 (1970)', MONO, 22, SEC, AX1 - 48, AY1 - 266, 'right')
    else:
        a = ob(seg(t, CW('s7', 'utre') - .3, CW('s7', 'utre') + .3)); rect(AX0, AY1 - 190, AX1, AY1 - 40, ORG); txt('NO LANDING', ANT, 120, GROUND, AX0 + 40, AY1 - 114, 'left', alpha=min(1, a * 2))
    strip('PRESS: AP · 10 APR 2026' if not crescent else 'ARTEMIS II FLEW AROUND THE MOON', 'VISUALIZATION: NASA')
def card(rows, y0, tit, col=ORG):
    rect(AX0, y0, AX1, AY1, PANEL); box(AX0, y0, AX1, AY1, HAIR, 2); rect(AX0, y0, AX0 + 10, AY1, col); txt(tit[0], ANT, 80, TXT, AX0 + 36, y0 + 54, 'left'); txt(tit[1], MONOB, 26, col, AX1 - 24, y0 + 40, 'right')
    for i, (k, v, a) in enumerate(rows):
        if a > .02: y = y0 + 112 + i * 52; txt(k, MONO, 22, SEC, AX0 + 36, y, 'left', alpha=a); txt(v, MONOB, 26, TXT, AX1 - 24, y, 'right', alpha=a)
def sc_a3(t):
    u = t - SEN['s8']['t0']; head('NEXT FLIGHT', 'NASA MISSION PAGES · READ 22 NOV 2026')
    picture('FLYBY', 8.0 + u * 1.0, AX0, AY0, AX1, 820, (.5, .5)); box(AX0, AY0, AX1, 820, HAIR, 2)
    ks = [seg(t, SEN['s8']['t0'] + .2 + i * .45, SEN['s8']['t0'] + .55 + i * .45) for i in range(4)]
    card([('LAUNCH', '2027', ks[0]), ('ORBIT', 'EARTH, NOT THE MOON', ks[1]), ('TEST', 'DOCKING WITH A LANDER', ks[2]), ('CREWED', 'YES · NO MOON TRIP', ks[3])], 840, ('ARTEMIS III', 'MISSION'), ORG)
    strip('NASA: LOW EARTH ORBIT · DOCKING TESTS', 'FOOTAGE: NASA')
def sc_a4(t):
    u = t - SEN['s9']['t0']; head('THE LANDING', 'NASA MISSION PAGES · READ 22 NOV 2026')
    picture('FLYBY', 24.0 + u * 1.2, AX0, AY0, AX1, 820, (.5, .5)); box(AX0, AY0, AX1, 820, HAIR, 2)
    ks = [seg(t, SEN['s9']['t0'] + .2 + i * .5, SEN['s9']['t0'] + .55 + i * .5) for i in range(4)]
    k4 = seg(t, CW('s9', 'badal') - .1, CW('s9', 'badal') + .35)
    card([('TARGET', 'EARLY 2028', ks[0]), ('LANDING', 'MOON SOUTH POLE', ks[1]), ('SURFACE', 'TWO CREW · ABOUT A WEEK', ks[2]), ('NOTE', 'DATES CAN CHANGE', max(ks[3], k4))], 840, ('ARTEMIS IV', 'MISSION'), ORG)
    strip('NASA: SURFACE LANDING · EARLY 2028', 'VISUALIZATION: NASA')
def dim(a):
    ZZ[0] += .002; bpy.ops.mesh.primitive_plane_add(size=1); o = bpy.context.object; o.scale = (1080 / PX, 1920 / PX, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); o.location = (0, 0, ZZ[0])
    m = bpy.data.materials.new('d'); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = (0, 0, 0, 1); tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader'); mx.inputs[0].default_value = a
    out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(e.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], out.inputs[0]); o.data.materials.append(m); return o
def sc_cta(t):
    picture('VAB ROOF', CAMS['VAB ROOF']['t0'] + 3.0 + (t - SEN['s10']['t0']) * .45, 0, 0, 1080, 1920, (.5, .3)); dim(.72)
SCN = [('count', 0.0, sc_count), ('sep', SEN['s4']['t0'] + 3.0 - 3.0 + (CW('s4', 'aath') - SEN['s4']['t0']) - .1, sc_sep), ('splash', SEN['s5']['t0'], sc_splash), ('dist', SEN['s6']['t0'], sc_dist),
       ('loop', SEN['s7']['t0'], lambda t: sc_dist(t, True)), ('a3', SEN['s8']['t0'], sc_a3), ('a4', SEN['s9']['t0'], sc_a4), ('cta', SEN['s10']['t0'], sc_cta)]
def scene_at(t):
    idx = 0
    for i, (n, st, f) in enumerate(SCN):
        if t >= st - .02: idx = i
    return idx
def draw_frame(t):
    reset(); sc = bpy.context.scene
    cd = bpy.data.cameras.new('c'); cd.lens = 36; global CAM; CAM = bpy.data.objects.new('c', cd); sc.collection.objects.link(CAM); sc.camera = CAM; CAM.location = (0, 0, 12)
    w = bpy.data.worlds.get('w') or bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[1].default_value = 0.0
    i = scene_at(t); name, st, fn = SCN[i]
    rect(-300, -300, 1380, 2220, GROUND); fn(t)
    m = t - Z
    if -.12 < m < .5:                                                        # the zero flash: a short orange kick (the cut to one picture)
        k = (1 - m / .5) if m > 0 else (1 + m / .12); rect(0, 0, 1080, 1920, ORG) if False else None
def main():
    sc = bpy.context.scene; bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMP; sc.cycles.use_denoising = False; sc.view_settings.view_transform = 'Standard'
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100; sc.render.filter_size = 1.0; BT.init(1080, 1920)
    sc.render.image_settings.file_format = 'PNG'; os.makedirs(OUT, exist_ok=True)
    n = int(round((T1 - T0) * FPS)); t_all = time.time()
    for k in range(n):
        t = T0 + k / FPS; f = f'{OUT}/f{int(round(t * FPS)):05d}.png'
        if os.path.exists(f): continue
        t1 = time.time(); draw_frame(t); sc.render.filepath = f; bpy.ops.render.render(write_still=True)
        if k % 20 == 0: print(f'frame {k}/{n} t={t:.2f} {time.time() - t1:.1f}s', flush=True)
    print('DONE', round(time.time() - t_all, 1), 's', flush=True)
main()
