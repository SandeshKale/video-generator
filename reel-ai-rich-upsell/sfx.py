# Score for the agent-swarm reel: five distinct club/ambient/cinematic cues that switch with the story + event-driven SFX, mixed with the voice (sidechain-ducked).
import json, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 44100
ev = json.load(open('events.json')); tim = json.load(open('timing.json'))
total = tim['total'] + 0.5
N = int(total * SR); rng = np.random.default_rng(11)
def lp(x, f): b, a = butter(2, min(.99, f / (SR / 2)), 'low'); return lfilter(b, a, x)
def hp(x, f): b, a = butter(2, f / (SR / 2), 'high'); return lfilter(b, a, x)
def put(buf, x, t, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= len(buf): return
    x = x[: len(buf) - i]; buf[i:i + len(x)] += x * g
fr = lambda m: 440 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR
def pulse(f, d, duty=.5):
    t = tt(d); return ((f * t) % 1 < duty) * 2.0 - 1
def tri(f, d): t = tt(d); return 2 * np.abs(2 * ((f * t) % 1) - 1) - 1
def saw(f, d): t = tt(d); return 2 * ((f * t) % 1) - 1
def adsr(n, a=.005, d=.15, s=.5, r=.05):
    e = np.ones(n); na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, max(na, 1)); 
    if nd > 0: e[na:na + nd] = np.linspace(1, s, min(nd, max(n - na, 0)))[: max(0, min(nd, n - na))]
    e[na + nd:] = s; 
    if nr > 0 and n > nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def note(kind, m, dur, g=.2, duty=.5, **k):
    f = fr(m)
    w = pulse(f, dur, duty) if kind == 'p' else tri(f, dur) if kind == 't' else saw(f, dur) if kind == 's' else np.sin(2 * np.pi * f * tt(dur))
    return w * adsr(len(w), **k) * g
def kick(g=.5):
    t = tt(.3); return np.sin(2 * np.pi * (46 + 100 * np.exp(-t * 32)) * t) * np.exp(-t * 11) * g
def snare(g=.3):
    t = tt(.2); return (hp(rng.standard_normal(len(t)), 1800) * .8 + np.sin(2 * np.pi * 190 * t) * .4) * np.exp(-t * 20) * g
def hat(g=.1, d=.05): t = tt(d); return hp(rng.standard_normal(len(t)), 7500) * np.exp(-t * 80) * g
def tick(g=.15): t = tt(.04); return np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 90) * g

# ---------- scene windows ----------
S = {s['id']: s for s in ev}
def win(a, b): return S[a]['start'], S[b]['end']
CUES = [('A', 'funk pop', *win('s01', 's01')), ('B', 'bossa lounge', *win('s02', 's03')), ('C', 'detective pulse', *win('s04', 's05')),
        ('D', 'lofi dusk', *win('s06', 's07')), ('E', 'warm resolve', *win('s08', 's09'))]
music = np.zeros(N)
def clap(g=.3):
    t = tt(.18); return hp(rng.standard_normal(len(t)), 1200) * (np.exp(-t * 28) + .6 * np.exp(-((t - .02) ** 2) * 9e4)) * g
def pluck(m, dur=.35, g=.15):
    x = tt(dur); f = fr(m); return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 14)) * np.exp(-x * 9) * g
def pad(ms, dur, g=.05, cut=1500):
    out = np.zeros(int(dur * SR))
    for m in ms: w = saw(fr(m), dur) + saw(fr(m) * 1.004, dur); out += w * adsr(len(w), a=.5, d=.5, s=.7, r=.6)
    return lp(out, cut) * g
def rhodes(m, dur=1.2, g=.07):
    x = tt(dur); f = fr(m); vib = 1 + .003 * np.sin(2 * np.pi * 5 * x)
    return (np.sin(2 * np.pi * f * vib * x) + .35 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 6) + .12 * np.sin(2 * np.pi * 6 * f * x) * np.exp(-x * 14)) * np.exp(-x * 2.2) * g
def rim(g=.12):
    x = tt(.06); return np.sin(2 * np.pi * 1700 * x) * np.exp(-x * 90) * g + hp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 120) * g * .6
def cue(name, t0, t1):
    buf = np.zeros(N); X = 0.9; dur = (t1 - t0) + X
    if name == 'A':   # F minor funk-pop, 112 bpm: syncopated tri bass, 16th hats, backbeat snare, plucked stabs, riser at the end
        bpm = 112; b = 60 / bpm; bass = [41, 41, 0, 44, 0, 41, 39, 0, 41, 0, 44, 0, 46, 0, 44, 41]
        for k in range(int(dur / (b / 4)) + 1):
            t = t0 + k * b / 4; m = bass[k % 16]
            if m: put(buf, note('t', m, .16, .3, a=.003, d=.05, s=.6, r=.03), t)
            if k % 4 == 0: put(buf, kick(.5), t)
            if k % 8 == 4: put(buf, snare(.3), t)
            put(buf, hat(.05 if k % 2 else .08, .04), t)
            if k % 16 in (3, 6, 10, 14): put(buf, pluck(65 + [0, 3, 7, 10][k // 4 % 4], .25, .12), t)
        put(buf, hp(rng.standard_normal(int(dur * SR)), 700) * np.linspace(0, 1, int(dur * SR)) ** 3 * .07, t0)
    elif name == 'B':   # D major7 bossa lounge, 92 bpm: rim clicks, soft kick, walking bass, Rhodes chords
        bpm = 92; b = 60 / bpm; prog = [50, 55, 52, 57]; pat = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0]
        for k in range(int(dur / (b / 4)) + 1):
            t = t0 + k * b / 4; r = prog[int(k / 16) % 4]
            if pat[k % 16]: put(buf, rim(.12), t)
            if k % 8 in (0, 5): put(buf, kick(.28), t)
            if k % 4 == 0: put(buf, note('t', r - 12 + [0, 7, 4, 7][k // 4 % 4], .3, .26, a=.004, d=.1, s=.6, r=.06), t)
            if k % 2 == 0: put(buf, hat(.03, .03), t)
        for k in range(int(dur / (b * 2)) + 1):
            r = prog[k % 4]
            for iv in (0, 4, 7, 11): put(buf, rhodes(r + 12 + iv, b * 2.2, .05), t0 + k * b * 2)
    elif name == 'C':   # A minor detective pulse, 100 bpm: palm-muted pulse, marimba arpeggio, clock ticks, brush snare
        bpm = 100; b = 60 / bpm; prog = [45, 45, 41, 43]
        for k in range(int(dur / (b / 2)) + 1):
            t = t0 + k * b / 2; r = prog[int(k / 8) % 4]
            put(buf, lp(note('p', r, .1, .16, .3, a=.002, d=.04, s=.4, r=.03), 900), t)
            put(buf, pluck(r + 24 + [0, 3, 7, 12, 7, 3, 10, 7][k % 8], .3, .1), t)
            if k % 2 == 0: put(buf, tick(.1), t)
            if k % 4 == 2: put(buf, snare(.16), t)
            if k % 8 == 0: put(buf, kick(.34), t)
        put(buf, pad([prog[0] + 12, prog[0] + 15, prog[0] + 19], dur, .03, 800), t0)
        put(buf, hp(rng.standard_normal(int(dur * SR)), 900) * np.linspace(0, 1, int(dur * SR)) ** 2.2 * .05, t0)
    elif name == 'D':   # lo-fi dusk, 78 bpm swung: dusty kick/snare, slow Rhodes, vinyl noise
        bpm = 78; b = 60 / bpm; prog = [53, 48, 50, 45]
        for k in range(int(dur / (b / 2)) + 1):
            t = t0 + k * b / 2 + (b * .12 if k % 2 else 0)
            if k % 4 == 0: put(buf, kick(.32), t)
            if k % 8 == 4: put(buf, lp(snare(.24), 4500), t)
            if k % 2 == 0: put(buf, hat(.03, .05), t)
        for k in range(int(dur / (b * 4)) + 1):
            r = prog[k % 4]
            for iv, dl in ((0, 0), (3, .06), (7, .12), (10, .18)): put(buf, rhodes(r + 12 + iv, b * 3.6, .06), t0 + k * b * 4 + dl)
            put(buf, note('t', r - 12, b * 3, .22, a=.01, d=.2, s=.6, r=.2), t0 + k * b * 4)
        put(buf, hp(lp(rng.standard_normal(int(dur * SR)), 6000), 1500) * .012, t0)
    elif name == 'E':   # G major resolve, 104 bpm: pluck melody, soft kick, pad, ends open
        bpm = 104; b = 60 / bpm; roots = [43, 50, 40, 47]
        mel = [74, 71, 67, 71, 74, 79, 76, 74, 72, 69, 72, 76, 74, 71, 67, 71]
        for k in range(int(dur / (b / 2)) + 1):
            t = t0 + k * b / 2; r = roots[int(k / 8) % 4]
            put(buf, pluck(mel[k % 16], .5, .12), t)
            if k % 2 == 0: put(buf, note('t', r - 12, .3, .24, a=.004, d=.08, s=.6, r=.05), t)
            if k % 4 == 0: put(buf, kick(.3), t)
            if k % 8 == 4: put(buf, snare(.16), t)
            if k % 2 == 1: put(buf, hat(.03), t)
        for k in range(int(dur / (b * 4)) + 1):
            r = roots[k % 4]; put(buf, pad([r + 12, r + 16, r + 19], b * 4, .05, 2200), t0 + k * b * 4)
    w = np.ones(N)
    a0, a1 = max(0, int((t0 - X / 2) * SR)), int(t0 * SR + X * SR / 2); ramp = np.linspace(0, 1, max(a1 - a0, 1))
    w[:a0] = 0; w[a0:a1] = ramp[: a1 - a0] if a1 <= N else ramp[: N - a0]
    if name == 'A': w[:a1] = 1
    b0 = int((t1 - X / 2) * SR); b1 = int((t1 + X / 2) * SR)
    if name != 'E' and b0 < N:
        n = min(b1, N) - b0; w[b0:b0 + n] = np.linspace(1, 0, b1 - b0)[:n]; w[min(b1, N):] = 0
    return buf * w
for nm, desc, a, b in CUES: music += cue(nm, a, b)
music = lp(music, 10000)
music *= np.minimum((N - np.arange(N)) / (SR * 2.5), 1)

# ---------- sfx ----------
sfx = np.zeros(N)
def whoosh(t, dur=.4, g=.3, up=False):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n)
    for k in range(8):
        a, b2 = int(k * n / 8), int((k + 1) * n / 8); f = 500 + 5500 * ((k / 7) if up else (1 - k / 7)) ** 1.6
        bb, aa = butter(2, [f / (SR / 2) * .6, min(.95, f / (SR / 2) * 1.4)], 'band'); out[a:b2] = lfilter(bb, aa, x[a:b2])
    put(sfx, out * np.sin(np.linspace(0, np.pi, n)) ** 2, t, g)
def impact(t, g=.8):
    x = tt(1.0); put(sfx, np.sin(2 * np.pi * (36 + 80 * np.exp(-x * 18)) * x) * np.exp(-x * 4) + hp(rng.standard_normal(len(x)), 1500) * np.exp(-x * 40) * .4, t, g)
def blip(t, m=84, dur=.09, g=.18, kind='p'): put(sfx, note(kind, m, dur, g, .25, a=.002, d=.04, s=.5, r=.02), t)
def glitch(t, g=.25):
    for k in range(6):
        n = int(.03 * SR); put(sfx, (rng.standard_normal(n) > 0) * 2. - 1 * np.exp(-np.arange(n) / SR * 30), t + k * .035, g * (1 - k / 7))
def typing(t, dur, g=.1):
    for k in range(int(dur * 28)): put(sfx, hp(rng.standard_normal(int(.012 * SR)), 2500) * np.exp(-np.arange(int(.012 * SR)) / SR * 300), t + k / 28, g)
def climb(t, dur, g=.1):
    n = max(2, int(dur * 14))
    for k in range(n): blip(t + k * dur / n, 70 + 24 * k / n, .05, g, 't')
def ping(t, g=.2): blip(t, 88, .35, g, 'n')
def chime(t, g=.22):
    for k, m in enumerate([79, 83, 86, 91]): put(sfx, pluck(m, .9, g), t + k * .1)
def clunk(t, g=.5):
    x = tt(.35); put(sfx, (np.sin(2 * np.pi * 90 * x) + .5 * hp(rng.standard_normal(len(x)), 800)) * np.exp(-x * 16), t, g)
def unlockfx(t, g=.35):
    clunk(t, g * .8); whoosh(t + .05, .5, .22, True)
def stampfx(t, g=.85): impact(t + .02, g); glitch(t + .05, .25)
def pop(t, g=.2): blip(t, 84, .06, g, 'n'); blip(t + .05, 91, .08, g * .8, 'n')
def blocked(t, dur, g=.12):
    for k in range(int(dur / .3)): put(sfx, saw(100, .09) * np.exp(-tt(.09) * 25) * g, t + k * .3)
def slider(t, dur, g=.2):
    n = int(dur * SR); x = tt(dur); f = 900 * 2 ** (-x / dur * 2); put(sfx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.linspace(1, .2, n), t, g)
def alarmfx(t, dur, g=.1):
    for k in range(int(dur / .35)): blip(t + k * .35, 81, .15, g, 'p'); blip(t + k * .35 + .17, 74, .15, g * .9, 'p')
def flapfx(t, dur, g=.1):
    for k in range(int(dur * 18)): put(sfx, hp(rng.standard_normal(int(.01 * SR)), 2200) * np.exp(-np.arange(int(.01 * SR)) / SR * 350) * (1 - k / (dur * 18) * .5), t + k / 18, g)
def wipefx(t, g=.28): whoosh(t, .38, g, True); blip(t + .02, 96, .05, g * .5)

for si, sc in enumerate(ev):
    if si > 0 and sc['start'] > 3: wipefx(sc['start'] - .12)
    for L in sc['layers']:
        if L['type'] == 'eyebrow': blip(L['t0'], 91, .05, .08, 'p')
        elif L['type'] == 'cta': chime(L['t0'], .2)
    for e in sc.get('sfx', []):
        k, t = e['k'], e['t']
        if k == 'type': typing(t, e.get('dur', .4))
        elif k == 'count': climb(t, e.get('dur', 1.0))
        elif k == 'thump': impact(t, .9)
        elif k == 'flap': flapfx(t, e.get('dur', 1.0))
        elif k == 'whoosh': pass
        elif k == 'slam': impact(t, .8)
        elif k == 'swoosh': whoosh(t, .8, .25)
        elif k == 'pop': pop(t)
        elif k == 'ping': ping(t)
        elif k == 'alarm': alarmfx(t, e.get('dur', 1.2))
        elif k == 'glitch': glitch(t, .35); impact(t, .5)
        elif k == 'stamp': stampfx(t)
        elif k == 'lock': clunk(t)
        elif k == 'unlock': unlockfx(t)
        elif k == 'blocked': blocked(t, e.get('dur', 1.2))
        elif k == 'slider': slider(t, e.get('dur', .9))
        elif k == 'tick': blip(t, 96, .05, .15, 'p')
        elif k == 'chime': chime(t)
sfx = hp(lp(sfx, 14000), 30)

pk = lambda x: x / max(1e-6, np.abs(x).max())
voice_sr, v = wavfile.read('audio/voice.wav'); v = v.astype('float32'); v = v / (32768 if v.dtype != 'float32' and np.abs(v).max() > 2 else 1)
if voice_sr != SR:
    import scipy.signal as ss; v = ss.resample_poly(v, SR, voice_sr)
vo = np.zeros(N); vo[: min(N, len(v))] = v[:N]
wavfile.write('audio/music.wav', SR, (pk(music) * .9 * 32767).astype('int16'))
wavfile.write('audio/sfx.wav', SR, (pk(sfx) * .9 * 32767).astype('int16'))
wavfile.write('audio/voice44.wav', SR, (pk(vo) * .95 * 32767).astype('int16'))
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voice44.wav', '-i', 'audio/music.wav', '-i', 'audio/sfx.wav', '-filter_complex',
 '[0:a]asplit=2[v][vs];[1:a]volume=0.5[m];[m][vs]sidechaincompress=threshold=0.02:ratio=8:attack=15:release=300[md];'
 '[2:a]volume=0.7[s];[v]volume=1.0[vv];[vv][md][s]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-15:TP=-1.5:LRA=9[o]',
 '-map', '[o]', '-ar', '44100', '-ac', '1', 'audio/final.wav'])
print('mixed audio/final.wav', total)
