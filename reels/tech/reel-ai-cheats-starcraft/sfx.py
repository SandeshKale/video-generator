# New score: five distinct chiptune/synth cues that switch with the story + event-driven SFX, mixed with the voice (sidechain-ducked).
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
CUES = [('A', 'chip alert', *win('s01', 's01')), ('B', 'briefing', *win('s02', 's03')), ('C', 'heist', *win('s04', 's05')),
        ('D', 'reveal', *win('s06', 's07')), ('E', 'outro', *win('s08', 's08'))]
music = np.zeros(N)
def cue(name, t0, t1):
    buf = np.zeros(N); X = 0.9; dur = (t1 - t0) + X
    if name == 'A':   # E minor, 148 bpm: urgent arpeggio, four-on-floor, snare backbeat, riser
        bpm = 148; b = 60 / bpm; roots = [52, 52, 48, 50]
        for k in range(int(dur / (b / 4)) + 1):
            t = t0 + k * b / 4; bar = int(k / 16) % 4; r = roots[bar]
            m = r + 24 + [0, 3, 7, 12, 7, 3, 12, 7][k % 8]
            put(buf, note('p', m, .12, .08, .25, a=.003, d=.05, s=.4, r=.03), t)
            if k % 2 == 0: put(buf, note('t', r - 12, .17, .22, a=.003, d=.05, s=.6, r=.03), t)
            if k % 4 == 0: put(buf, kick(.45), t)
            if k % 8 == 4: put(buf, snare(.3), t)
            if k % 2 == 1: put(buf, hat(.06), t)
        ri = hp(rng.standard_normal(int(dur * SR)), 600) * np.linspace(0, 1, int(dur * SR)) ** 3 * .1; put(buf, ri, t0)
    elif name == 'B':   # C minor, 112 bpm: walking triangle bass, offbeat pulse stabs, light hats
        bpm = 112; b = 60 / bpm; prog = [48, 44, 51, 46]
        for k in range(int(dur / (b / 2)) + 1):
            t = t0 + k * b / 2; bar = int(k / 8) % 4; r = prog[bar]
            put(buf, note('t', r - 12 + [0, 0, 7, 0, 12, 7, 0, 7][k % 8], .25, .3, a=.004, d=.1, s=.6, r=.05), t)
            if k % 2 == 1: put(buf, note('p', r + 12 + [0, 3, 7, 3][k % 4], .18, .06, .125, a=.003, d=.06, s=.3, r=.04), t)
            if k % 2 == 1: put(buf, hat(.05), t)
            if k % 4 == 0: put(buf, kick(.3), t)
        for k in range(int(dur / (b * 4)) + 1):
            for iv in (0, 3, 7): put(buf, lp(note('s', prog[k % 4] + 12 + iv, b * 4, .045, a=.4, d=.6, s=.7, r=.5), 1400), t0 + k * b * 4)
    elif name == 'C':   # F# minor, 96 bpm: pulsing sub, tension pad, clock ticks, stabs, risers
        bpm = 96; b = 60 / bpm; prog = [42, 42, 38, 40]
        for k in range(int(dur / (b / 2)) + 1):
            t = t0 + k * b / 2; bar = int(k / 8) % 4; r = prog[bar]
            put(buf, note('n', r - 12, .22, .38, a=.004, d=.1, s=.7, r=.05), t)
            if k % 2 == 0: put(buf, tick(.12), t)
            if k % 8 == 7: put(buf, note('p', r + 24, .2, .09, .125, a=.003, d=.08, s=.3, r=.05), t)
        for k in range(int(dur / (b * 4)) + 1):
            for iv in (0, 3, 7, 10):
                put(buf, lp(note('s', prog[k % 4] + 12 + iv, b * 4, .04, a=.6, d=.8, s=.6, r=.5), 500 + 500 * min(1, (t0 + k * b * 4 - t0) / dur + .4)), t0 + k * b * 4)
        ri = hp(rng.standard_normal(int(dur * SR)), 900) * np.linspace(0, 1, int(dur * SR)) ** 2.5 * .07; put(buf, ri, t0)
        put(buf, kick(.35), t0 + .02)
    elif name == 'D':   # D major, 84 bpm: bells + warm pad, soft low pulse, shimmer: reflective then hopeful
        bpm = 84; b = 60 / bpm; prog = [50, 55, 47, 52]
        for k in range(int(dur / (b / 2)) + 1):
            t = t0 + k * b / 2; bar = int(k / 8) % 4; r = prog[bar]
            m = r + 24 + [0, 4, 7, 12, 7, 4, 9, 7][k % 8]
            x = tt(.9); bell = (np.sin(2 * np.pi * fr(m) * x) + .35 * np.sin(2 * np.pi * fr(m) * 2.76 * x)) * np.exp(-x * 4.5)
            put(buf, bell, t, .09)
            if k % 4 == 0: put(buf, kick(.22), t)
        for k in range(int(dur / (b * 4)) + 1):
            for iv in (0, 4, 7, 11): put(buf, note('t', prog[k % 4] + iv, b * 4, .06, a=.5, d=.5, s=.7, r=.6), t0 + k * b * 4)
        put(buf, hp(rng.standard_normal(int(dur * SR)), 5000) * .012, t0)
    elif name == 'E':   # G major chiptune outro, 120 bpm: bright lead hook, bouncing bass, resolves
        bpm = 120; b = 60 / bpm; roots = [43, 50, 40, 47]
        mel = [74, 71, 67, 71, 74, 79, 76, 74, 72, 69, 72, 76, 74, 71, 67, 71]
        for k in range(int(dur / (b / 2)) + 1):
            t = t0 + k * b / 2; bar = int(k / 8) % 4; r = roots[bar]
            put(buf, note('p', mel[k % 16], .22, .1, .5, a=.003, d=.08, s=.5, r=.05), t)
            put(buf, note('t', r - 12 + (12 if k % 4 == 2 else 0), .22, .3, a=.004, d=.08, s=.6, r=.04), t)
            if k % 4 == 0: put(buf, kick(.4), t)
            if k % 8 == 4: put(buf, snare(.25), t)
            if k % 2 == 1: put(buf, hat(.05), t)
    w = np.ones(N); 
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
def blip(t, m=84, d=.09, g=.18, kind='p'): put(sfx, note(kind, m, d, g, .25, a=.002, d=.04, s=.5, r=.02), t)
def glitch(t, g=.25):
    for k in range(6):
        n = int(.03 * SR); put(sfx, (rng.standard_normal(n) > 0) * 2. - 1 * np.exp(-np.arange(n) / SR * 30), t + k * .035, g * (1 - k / 7))
def typing(t, dur, g=.1):
    for k in range(int(dur * 28)): put(sfx, hp(rng.standard_normal(int(.012 * SR)), 2500) * np.exp(-np.arange(int(.012 * SR)) / SR * 300), t + k / 28, g)
def climb(t, dur, g=.12):
    n = max(2, int(dur * 14))
    for k in range(n): blip(t + k * dur / n, 70 + 24 * k / n, .06, g)
def buzz(t, d=.35, g=.25): put(sfx, saw(110, d) * np.exp(-tt(d) * 4) * g + saw(113, d) * np.exp(-tt(d) * 4) * g, t)
def rewind(t, dur=.9, g=.28):
    n = int(dur * SR); x = tt(dur); f = 2400 * np.exp(-x * 2.4); put(sfx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.linspace(1, .1, n) * .6 + hp(rng.standard_normal(n), 3000) * .1, t, g)
def slide_up(t, dur=.5, g=.2):
    n = int(dur * SR); x = tt(dur); f = 300 * 2 ** (x / dur * 3); put(sfx, np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.linspace(.2, 1, n) * np.exp(-x * 2), t, g)
def coin(t, g=.2): blip(t, 83, .07, g); blip(t + .07, 88, .25, g)
def oneup(t, g=.22):
    for k, m in enumerate([76, 79, 83, 88, 91]): blip(t + k * .09, m, .12, g)
    blip(t + .5, 95, .5, g)
def alarm(t, g=.22):
    for k in range(3): blip(t + k * .16, 88, .09, g, 'p'); blip(t + k * .16 + .08, 76, .07, g * .8, 'p')
def pixel_sweep(t, g=.22):
    for k in range(14): blip(t + k * .018, 96 - k * 2.2, .03, g * .6); 
    whoosh(t, .3, .16, True)

for si, sc in enumerate(ev):
    if si > 0 and sc['start'] > 3: pixel_sweep(sc['start'] - .02)
    for L in sc['layers']:
        t0 = L['t0']; ty = L['type']
        if ty == 'stamp': impact(t0 + .02, .95); glitch(t0 + .05, .3)
        elif ty in ('head', 'eyebrow'): blip(t0, 88, .08, .12)
        elif ty in ('tags', 'list', 'cards', 'rank', 'person'): blip(t0, 79 if ty != 'rank' else 91, .1, .14)
        elif ty in ('arena', 'clock', 'dl', 'term', 'stairs', 'shortcut', 'neck'): blip(t0, 72, .12, .13, 't')
        elif ty == 'cta': oneup(t0, .24)
    for e in sc.get('sfx', []):
        k, t = e['k'], e['t']
        if k == 'type': typing(t, e.get('dur', .4))
        elif k == 'dl': climb(t, e.get('dur', 1.0))
        elif k == 'swap': glitch(t, .35); impact(t, .7); alarm(t + .1)
        elif k == 'hop': blip(t, 76, .1, .2); blip(t + .08, 83, .12, .2)
        elif k == 'buzz': buzz(t)
        elif k == 'rewind': rewind(t)
        elif k == 'jump': slide_up(t); coin(t + .5)
        elif k == 'alarm': alarm(t)
        elif k == 'coin': coin(t)
        elif k == 'hit': impact(t, e.get('g', .6))
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
