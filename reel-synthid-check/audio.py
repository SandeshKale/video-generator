# Score + SFX + mix/master for "Is that clip AI? Google can sometimes tell." (SynthID reel); adapted from reel-claude-in-sheets/audio.py:
# a 104 bpm minor "detective-lite" score (muted bass, snaps, marimba, plucks), four-on-the-floor hook that hits at the word "Google".
# (original header:)  -> audio/final.wav (stereo 48 kHz), audio/preview.mp3,
# audio/mix-report.json and events.json. Built on reel-morning-brief/audio.py (same DSP helpers and mix/master chain); new here:
# a 112 bpm "office pop" score (marimba, pluck, finger snaps) with one style per scene, and real CC0 UI samples from
# assets/sfx/uisfx (soft pack) for the interface sounds. Run: python3 audio.py (needs audio/voice.wav + site/timing.js).
import json, re, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, lfilter, fftconvolve, resample_poly
SR = 48000
tim = open('site/timing.js').read()
SC = json.loads(re.search(r'SC=(\[.*?\]);', tim).group(1)); WD = json.loads(re.search(r'WD=(\[.*?\]);', tim).group(1))
TOTAL = float(re.search(r'TOTAL=([\d.]+)', tim).group(1)); N = int((TOTAL + .4) * SR)
rng = np.random.default_rng(11)
def W(p, k, n=0):
    c = 0
    for w in WD:
        if w['p'] == p and w['k'] == k:
            if c == n: return w['s']
            c += 1
    raise KeyError((p, k))
# ---------- dsp helpers ----------
def sos(kind, f, o=2): return butter(o, f, kind, fs=SR, output='sos')
def lp(x, f, o=2): return sosfilt(sos('low', min(f, SR / 2 - 200), o), x, axis=0)
def hp(x, f, o=2): return sosfilt(sos('high', f, o), x, axis=0)
def bp(x, a, b, o=2): return sosfilt(sos('band', (a, min(b, SR / 2 - 200)), o), x, axis=0)
def tt(d): return np.arange(int(d * SR)) / SR
fr = lambda m: 440 * 2 ** ((m - 69) / 12)
def adsr(n, a=.005, d=.2, s=.5, r=.15):
    e = np.full(n, s, float); na, nd, nr = max(1, int(a * SR)), int(d * SR), min(n, int(r * SR))
    e[:na] = np.linspace(0, 1, na); k = min(nd, max(0, n - na)); e[na:na + k] = np.linspace(1, s, k)
    if nr > 0: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def st(x, pan=0.0):   # mono -> stereo, equal-power pan (-1 left .. +1 right)
    a = (pan + 1) * np.pi / 4; return np.stack([x * np.cos(a), x * np.sin(a)], 1)
def put(buf, x, t, g=1.0, peak=False):
    if x.ndim == 1: x = st(x)
    if peak: t -= np.argmax(np.abs(x).sum(1)) / SR
    i = int(round(t * SR))
    if i < 0: x = x[-i:]; i = 0
    if i >= len(buf) or len(x) == 0: return
    x = x[:len(buf) - i]; buf[i:i + len(x)] += x * g
# ---------- instruments ----------
def epiano(ms, d, g=.05, bright=1.0):     # FM tine electric piano, gentle stereo tremolo
    x = tt(d); y = np.zeros(len(x))
    for m in ms:
        f = fr(m); I = 1.6 * bright * np.exp(-x * 5)
        y += np.sin(2 * np.pi * f * x + I * np.sin(2 * np.pi * f * x)) + .12 * np.sin(2 * np.pi * 7 * f * x) * np.exp(-x * 30)
    y = lp(y * adsr(len(x), .004, .9, .35, min(.6, d * .4)), 5200) * g
    trem = .5 + .5 * np.sin(2 * np.pi * 3.2 * x)
    return np.stack([y * (.75 + .25 * trem), y * (.75 + .25 * (1 - trem))], 1)
def ks(m, d=1.2, g=.12, bright=.5):        # Karplus-Strong plucked string (nylon-ish guitar)
    n = int(d * SR); L = max(2, int(SR / fr(m))); burst = lp(rng.standard_normal(L), 2500 + 5000 * bright)
    x = np.zeros(n); x[:L] = burst; a = np.zeros(L + 2); a[0] = 1; a[L] = -.497; a[L + 1] = -.497
    y = lfilter([1], a, x); return lp(y, 4500) * adsr(n, .001, .05, 1, .2) * g
def sub(m, d, g=.3):
    x = tt(d); y = np.sin(2 * np.pi * fr(m) * x) + .18 * np.sin(4 * np.pi * fr(m) * x)
    return np.tanh(1.4 * y * adsr(len(x), .006, .25, .7, .08)) * g
def pad(ms, d, g=.04, cut=2200):
    x = tt(d); L = np.zeros(len(x)); R = np.zeros(len(x))
    for m in ms:
        f = fr(m)
        for dt, side in ((-.006, 0), (.0, 2), (.007, 1)):
            s = 2 * ((f * (1 + dt) * x + rng.random()) % 1) - 1
            if side in (0, 2): L += s
            if side in (1, 2): R += s
    e = adsr(len(x), .5, .4, .85, min(1.0, d * .4)); return np.stack([lp(L * e, cut), lp(R * e, cut)], 1) * g
def musicbox(m, d=1.4, g=.05):
    x = tt(d); f = fr(m); y = np.sin(2 * np.pi * f * x) + .35 * np.sin(2 * np.pi * 3 * f * x) * np.exp(-x * 9) + .15 * np.sin(2 * np.pi * 5.4 * f * x) * np.exp(-x * 14)
    return y * np.exp(-x * 3.2) * g
def kick(g=.55):
    x = tt(.38); f = 48 + 110 * np.exp(-x * 38); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7.5)
    click = hp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 400) * .35; return np.tanh(1.8 * (y + click)) * g
def clap(g=.2):
    x = tt(.3); n = bp(rng.standard_normal(len(x)), 900, 6500); e = np.zeros(len(x))
    for o in (0, .011, .022): e += np.exp(-np.clip(x - o, 0, None) * 120) * (x >= o)
    e += .6 * np.exp(-x * 18); return n * e * g
def rim(g=.12): x = tt(.08); return (bp(rng.standard_normal(len(x)), 1500, 5000) * .6 + np.sin(2 * np.pi * 820 * x)) * np.exp(-x * 90) * g
def hat(g=.05, d=.045, open_=False):
    x = tt(.32 if open_ else d); return hp(rng.standard_normal(len(x)), 7500) * np.exp(-x * (9 if open_ else 110)) * g
def shaker(g=.04): x = tt(.11); return bp(rng.standard_normal(len(x)), 4500, 12000) * np.sin(np.linspace(0, np.pi, len(x))) ** 2 * g
def crash(g=.05): x = tt(2.0); return hp(rng.standard_normal(len(x)), 5500) * np.exp(-x * 2.2) * g
def riser(d=1.6, g=.07):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n)
    for k in range(10):
        a, b = int(k * n / 10), int((k + 1) * n / 10); f = 400 + 6000 * (k / 9) ** 1.6; out[a:b] = bp(x[a:b], f * .7, f * 1.4)
    return out * np.linspace(0, 1, n) ** 2.2 * g
def subdrop(g=.35): x = tt(1.1); return np.sin(2 * np.pi * np.cumsum(70 * np.exp(-x * 2.2) + 32) / SR) * np.exp(-x * 2.6) * g
def marimba(m, d=.7, g=.06):            # struck bar: fundamental + 4x and 9.9x partials that die fast
    x = tt(d); f = fr(m)
    y = np.sin(2 * np.pi * f * x) + .45 * np.sin(2 * np.pi * 4 * f * x) * np.exp(-x * 22) + .12 * np.sin(2 * np.pi * 9.9 * f * x) * np.exp(-x * 45)
    return y * np.exp(-x * 6.5) * np.minimum(1, x / .002) * g
def snap(g=.16):                           # finger snap: tight band-passed burst + body click
    x = tt(.16); return (bp(rng.standard_normal(len(x)), 1800, 7000) * np.exp(-x * 75) + .5 * np.sin(2 * np.pi * 1450 * x) * np.exp(-x * 140)) * g
# ---------- arrangement: 112 bpm "office pop" (marimba + pluck + snaps), one style per scene, bar grid restarts at each cut ----------
BPM = 104; B = 60 / BPM; BAR = 4 * B
PROG = [[45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 53], [40, 44, 47, 52]]     # Am7, Fmaj7, G7, E(add)
ROOT = [33, 29, 31, 28]
MEL = [76, 79, 81, 79, 76, 74, 72, 74]
STY = ['hook', 'drop', 'step', 'step', 'step', 'catch', 'catch', 'approve', 'cta']
sec = [(SC[i], SC[i + 1] if i + 1 < len(SC) else TOTAL, STY[i]) for i in range(len(SC))]
music = np.zeros((N, 2)); drums = np.zeros((N, 2)); bass = np.zeros((N, 2)); kicks = []
def section(t0, t1, style):
    nb = int(np.ceil((t1 - t0) / B)) + 1
    for b in range(nb):
        t = t0 + b * B; bar = b // 4; beat = b % 4; ch = PROG[bar % 4]; rt = ROOT[bar % 4]
        if t > t1 + .05: break
        if style == 'hook':                       # punchy from frame 0: four-on-the-floor, 16th marimba sparkle, hats
            kicks.append(t); put(drums, st(kick(.5)), t)
            for k in range(4): put(music, st(marimba(ch[k % len(ch)] + 24, .4, .05), (-.5, .5, -.25, .25)[k]), t + k * B / 4)
            if beat in (1, 3): put(drums, st(snap(.14), -.1), t)
            for h in range(2): put(drums, st(hat(.04 if h else .055), .3), t + h * B / 2)
            if beat in (0, 2): put(bass, st(sub(rt, B * .9, .28)), t)
            continue
        if style == 'catch':                      # half time, low-passed later in the bus
            if beat == 0: kicks.append(t); put(drums, st(kick(.48)), t); put(bass, st(sub(rt, BAR * .9, .26)), t); put(music, pad(ch, BAR * 1.05, .035, 1000), t)
            if beat == 2: put(drums, st(snap(.12), -.1), t)
            put(music, st(marimba(ch[0] + 12, .9, .03), .2), t + B / 2)
            continue
        light = style == 'approve'
        if beat in (0, 2) or (beat == 3 and style in ('drop', 'cta', 'python') and bar % 2): kicks.append(t); put(drums, st(kick(.36 if light else .5)), t)
        if beat in (1, 3): put(drums, st(snap(.11 if light else .16), -.12), t); put(drums, st(clap(.08 if light else .12), .1), t)
        for h in range(2): put(drums, st(hat(.032 if h else .045), .32), t + h * B / 2)
        if style in ('drop', 'cta', 'apps', 'python'): put(drums, st(shaker(.03), -.35), t + B / 4); put(drums, st(shaker(.024), -.35), t + 3 * B / 4)
        if beat == 0:
            put(bass, st(sub(rt, B * 1.5, .3)), t); put(bass, st(sub(rt + 12, B * .6, .2)), t + B * 2.5)
            put(music, pad(ch, BAR * 1.05, .022 if light else .028, 2200), t)
        # pluck arpeggio on 8ths (16ths in the python scene), marimba answer phrase in drop / apps / cta
        arp = [ch[0] + 12, ch[2] + 12, ch[1] + 12, ch[-1] + 12]
        steps = 4 if style == 'python' else 2
        for h in range(steps):
            put(music, st(ks(arp[(b * steps + h) % 4], .8, .05 if light else .065, .6), (-.45 if h % 2 else .45)), t + h * B / steps)
        if style in ('drop', 'apps', 'cta') and beat % 2 == 0: put(music, st(marimba(MEL[(b // 2) % 8], .8, .035 if style == 'cta' else .05), .15), t + B / 2)
for (t0, t1, s) in sec: section(t0, t1, s)
# drops and hits: a one-beat dropout before the first cut and each "Step" scene, then a downbeat hit on the cut
gate = np.ones(N)
for i in (1, 2, 3, 4, 5, 8):
    c = SC[i]; a, b2 = int((c - B * .9) * SR), int((c - .02) * SR)
    gate[a:b2] = np.minimum(gate[a:b2], np.linspace(1, .08, b2 - a) ** .5)
    put(drums, st(kick(.6 if i in (1, 8) else .3)), c); put(drums, st(crash(.05 if i == 1 else .018), .2), c); put(bass, st(subdrop(.3 if i == 1 else .12)), c)
TELL = W(1, 'google')
put(music, st(riser(1.7, .08)), TELL - 1.7)                # rises into the word 'Google'
put(drums, st(kick(.6)), TELL); put(drums, st(crash(.05), .2), TELL); put(bass, st(subdrop(.45)), TELL)
put(music, st(riser(1.2, .04)), SC[8] - 1.2)              # clue -> CTA lift
put(music, pad([60, 64, 67, 71, 74], 3.2, .03, 2800), TOTAL - 3.2); put(music, st(marimba(84, 2.0, .06), .2), TOTAL - 3.2); put(bass, st(sub(36, 2.8, .26)), TOTAL - 3.2)
for x in (music, drums, bass): x *= gate[:, None]
pump = np.ones(N)
for k in kicks:
    i = int(k * SR); n = min(int(.2 * SR), N - i)
    if n > 0: pump[i:i + n] = np.minimum(pump[i:i + n], 1 - .26 * np.exp(-np.arange(n) / (.055 * SR)))
music *= pump[:, None]; bass *= pump[:, None] ** .7
c0, c1 = SC[5], SC[7]
seg = slice(int(c0 * SR), int(c1 * SR)); music[seg] = lp(music[seg], 1100, 2); drums[seg] = lp(drums[seg], 2500, 2)
def ir(seed):
    r = np.random.default_rng(seed); n = int(1.2 * SR); x = r.standard_normal(n) * np.exp(-np.arange(n) / (.26 * SR))
    x = lp(x, 6500); x[:int(.015 * SR)] = 0; return x / np.sqrt((x ** 2).sum())
wet = np.stack([fftconvolve(music[:, 0], ir(1))[:N], fftconvolve(music[:, 1], ir(2))[:N]], 1)
music = music + .10 * wet
# ---------- SFX: CC0 UI samples (assets/sfx/uisfx, "soft" pack) + a few synth hits, peak-aligned to the page's cue times ----------
EV = []
def E(kind, t, g=1.0): EV.append(dict(k=kind, t=round(t, 3), g=g))
E('swoosh', .05, .8); E('swoosh', .7, .7); E('stamp', TELL + .05, 1.4); E('swoosh', TELL - .3, .6)
E('select', W(2, 'detector')); E('stamp', W(2, 'anyone'))
for i in range(9): E('typing', W(3, 'open') + .1 + i * .13, .5)
E('drop', SC[2] + .55, .6); E('press', W(3, 'com') + .45 + .8 - .45 + .1); E('complete', W(3, 'com') + .55 + .8, .6)
E('drop', W(4, 'image') - .1, .8); E('drop', W(4, 'video') - .1, .8); E('drop', W(4, 'audio') - .1, .8); E('check', SC[3] + 1.2, .6); E('check', SC[3] + 1.7, .6)
E('swoosh', W(5, 'hunts') - .1, .8); E('stamp', W(5, 'google') + .35); E('select', W(5, 'google'), .9)
for k in (0.0, .15, .3): E('select', W(5, 'partners') - 1.0 + k, .7)
E('warning', W(6, 'catch'), .6); E('stamp', W(6, 'watermark')); E('pencil', W(6, 'mean'), .8)
E('stamp', SC[6] + .75, .9); E('stamp', W(7, 'tool') + .2); E('drop', W(7, 'tool') + .6, .7)
E('drop', SC[7] + .15, .5); E('drop', SC[7] + .27, .5); E('drop', SC[7] + .39, .5); E('press', W(8, 'clue') - .1, .8); E('pencil', W(8, 'verdict'), .8)
E('notification', W(9, 'comment')); 
for i in range(5): E('typing', W(9, 'check') + i * .08, .5)
E('success', [w for w in WD if w['p'] == 9][-1]['e'] + .12, .9)
for c in SC[1:]: E('cut', c)
sfx = np.zeros((N, 2)); acc = np.zeros((N, 2))
def load(name):
    o = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', '../assets/sfx/uisfx/sounds/soft/%s.mp3' % name, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(o, np.float32).astype(float)
def stampfx(): x = tt(.35); return np.sin(2 * np.pi * np.cumsum(60 + 90 * np.exp(-x * 30)) / SR) * np.exp(-x * 11) + hp(rng.standard_normal(len(x)), 1500) * np.exp(-x * 60) * .45
def swooshfx(d=.4, a=600, b=6500): n = int(d * SR); x = rng.standard_normal(n); f = np.linspace(a, b, 6); out = np.concatenate([bp(c, fi * .7, fi * 1.4) for c, fi in zip(np.array_split(x, 6), f)]); return out * np.sin(np.linspace(0, np.pi, n)) ** 2
def pencilfx(): x = tt(.35); return bp(rng.standard_normal(len(x)), 2500, 7000) * (.4 + .6 * np.abs(np.sin(2 * np.pi * 7 * x))) * np.sin(np.linspace(0, np.pi, len(x)))
SAMPLE = {k: load(k) for k in ('press', 'check', 'drop', 'complete', 'typing', 'expand', 'select', 'open', 'paste', 'lock', 'unlock', 'warning', 'notification', 'success')}
FX = {'stamp': (stampfx, .17, 0, acc), 'swoosh': (swooshfx, .09, 0, sfx), 'pencil': (pencilfx, .07, -.2, sfx)}
GAIN = {'press': .5, 'check': .35, 'drop': .45, 'complete': .4, 'typing': .3, 'expand': .4, 'select': .4, 'open': .4, 'paste': .35, 'lock': .45, 'unlock': .5,
        'warning': .4, 'notification': .5, 'success': .45}
PAN = {'typing': .25, 'check': -.2, 'select': .2, 'warning': -.15}
for e in EV:
    if e['k'] == 'cut': continue
    if e['k'] in SAMPLE: put(sfx, st(SAMPLE[e['k']], PAN.get(e['k'], 0)), e['t'], GAIN[e['k']] * e['g'], True); continue
    f, g, pn, bus = FX[e['k']]; put(bus, st(f(), pn), e['t'], g * e['g'], True)
json.dump({'sfx': EV, 'SC': SC, 'total': TOTAL, 'bpm': BPM, 'styles': STY}, open('events.json', 'w'))
# ---------- voice: de-harsh the 7 kHz sibilance bump (soothing), a touch of 3 kHz clarity, light compression ----------
# creator feedback: "a lot of reverb ... clean, sharp, right amount of bass": dereverb first (spectral late-reverb suppression), then a soft
# gap expander, +3 dB bass shelf at 130 Hz, -2 dB mud cut at 330 Hz, +3 dB presence at 3.2 kHz, +1.5 dB air at 9 kHz, de-ess, glue compression.
from dereverb import dereverb
import soundfile as sf
_v, _sr = sf.read('audio/voice.wav'); _v = _v if _v.ndim == 1 else _v.mean(1)
_d = dereverb(_v, _sr, rt60=.7, nd_ms=40, over=2.2, gmin=.08)
_act = np.zeros(len(_d)); 
for w in WD: _act[int(max(0, w['s'] - .05) * _sr):int(min(len(_d), (w['e'] + .12) * _sr))] = 1
_g = np.convolve(_act, np.ones(int(.05 * _sr)) / int(.05 * _sr), 'same'); _d = _d * (.12 + .88 * _g)   # -18 dB between words
sf.write('audio/voice_dry.wav', _d.astype('float32'), _sr)
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voice_dry.wav', '-af', 'highpass=f=75,equalizer=f=130:t=q:w=0.9:g=3.0,equalizer=f=330:t=q:w=1.2:g=-2.0,equalizer=f=3200:t=q:w=1.1:g=3.0,highshelf=f=9000:g=1.5,deesser=i=0.45:m=0.6:f=0.55,acompressor=threshold=-24dB:ratio=2.2:attack=6:release=120:makeup=2,loudnorm=I=-17:TP=-2:LRA=6', '-ar', str(SR), '-ac', '1', 'audio/voice_proc.wav'])
_, v = wavfile.read('audio/voice_proc.wav'); v = v.astype('float64') / 32768.0
vo = np.zeros(N); vo[:min(N, len(v))] = v[:N]
act = np.zeros(N)
for w in WD: act[int(max(0, w['s'] - .06) * SR):int(min(N, (w['e'] + .1) * SR))] = 1
def smooth(x, att, rel):
    xs = x[::48]; ys = np.zeros_like(xs); s = 0.0; a1, r1 = np.exp(-1 / (att * 1000)), np.exp(-1 / (rel * 1000))
    for i, xi in enumerate(xs): c = a1 if xi > s else r1; s = c * s + (1 - c) * xi; ys[i] = s
    return np.repeat(ys, 48)[:len(x)]
duck = smooth(act, .03, .28)
def rms(x): return np.sqrt(np.mean(x ** 2) + 1e-20)
def db(x): return 20 * np.log10(np.maximum(x, 1e-9))
vr = rms(vo[act > 0])
# music bus: carve the voice presence band (always -3 dB, plus up to -4 dB more while he talks), glue, then set level
def carve(x, depth): return x - depth * bp(x, 1200, 4500)
mb = hp(music + bass * .78 + drums, 35)                       # tame the sub for headphones; nothing below 35 Hz
mb_c = carve(mb, .35)
mb_c = mb_c - (.35 * duck)[:, None] * bp(mb_c, 1200, 4500)
GAP_DB, DUCK_DB = -5.5, -6.0                                  # music 10.5 dB under the voice in gaps, 19 dB while speaking
mg = 10 ** (GAP_DB / 20) * vr / max(rms(mb_c.mean(1)), 1e-9)
mus = mb_c * mg * (10 ** (DUCK_DB * duck / 20))[:, None]
tail = np.clip((np.arange(N) / SR - (WD[-1]['e'] + .25)) / .6, 0, 1); mus *= (10 ** (3.0 * tail / 20))[:, None]   # outro lift once the voice stops
fx = (carve(sfx, .45) + carve(acc, .3)) * (vr / .2) * (10 ** (-5 * duck / 20))[:, None]
voice = st(vo, 0) * np.sqrt(2)                                  # centred, same level in both channels
mix = voice + mus + fx
# report on every spoken word (before master; master is uniform gain + gentle dynamics)
seps, worst = [], []
for w in WD:
    a, b2 = int(w['s'] * SR), int(w['e'] * SR)
    if b2 - a < int(.08 * SR): continue
    fr10 = int(.01 * SR); fv = [rms(vo[q:q + fr10]) for q in range(a, b2 - fr10, fr10)]; pk = max(fv) if fv else 0
    on = [q for q, x in zip(range(a, b2 - fr10, fr10), fv) if x > pk * 10 ** (-24 / 20)]   # voiced frames of this word only
    if not on: continue
    vv = np.concatenate([vo[q:q + fr10] for q in on]); mm = np.concatenate([(mus[q:q + fr10] + fx[q:q + fr10]).mean(1) for q in on])
    seps.append(db(rms(vv)) - db(rms(mm))); worst.append((round(seps[-1], 1), w['w'], w['s']))
seps = np.array(seps)
# master: gentle tape-style saturation, glue compression, oversampled limiter, 2-pass loudnorm to -14 LUFS / -1 dBTP
mix = np.tanh(mix * 1.15) / 1.15
peak = np.abs(mix).max(); wavfile.write('audio/premaster.wav', SR, (mix / peak * .9 * 32767).astype('int16'))
CH = 'acompressor=threshold=-18dB:ratio=1.8:attack=20:release=250:makeup=1.5,aresample=192000,alimiter=limit=0.7:attack=3:release=60:level=false,aresample=48000'
m1 = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'audio/premaster.wav', '-af', CH + ',loudnorm=I=-14:TP=-1:LRA=8:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
J = json.loads(m1[m1.rindex('{'):m1.rindex('}') + 1])
af = CH + ',loudnorm=I=-14:TP=-1:LRA=8:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (J['input_i'], J['input_tp'], J['input_lra'], J['input_thresh'], J['target_offset'])
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/premaster.wav', '-af', af, '-ar', '48000', '-ac', '2', 'audio/final_ln.wav'])
def ebur(p):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', o)[-1]), float(re.findall(r'LRA:\s+(-?[\d.]+) LU', o)[-1])
I0, _, _ = ebur('audio/final_ln.wav')
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/final_ln.wav', '-af', 'aresample=192000,volume=%.2fdB,alimiter=limit=0.84:attack=2:release=50:level=false,aresample=48000' % (-14.0 - I0), '-ac', '2', 'audio/final.wav'])
subprocess.run(['rm', '-f', 'audio/final_ln.wav'])
I, TP, LRA = ebur('audio/final.wav')
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/final.wav', '-c:a', 'libmp3lame', '-b:a', '192k', 'audio/preview.mp3'])
rep = {'integrated_LUFS': I, 'true_peak_dBTP': TP, 'loudness_range_LU': LRA,
       'voice_over_music+sfx_dB_per_word (voiced frames)': {'median': round(float(np.median(seps)), 1), 'p10': round(float(np.percentile(seps, 10)), 1), 'min': round(float(seps.min()), 1), 'words': int(len(seps))},
       'worst_words': sorted(worst)[:5], 'music_gap_vs_voice_dB': GAP_DB, 'music_duck_while_speaking_dB': DUCK_DB, 'bpm': BPM, 'styles': STY, 'stereo': True,
       'chain': 'voice dry/centred; music: 1.2-4.5 kHz carve (static + voice-keyed), kick sidechain pump, 1.2 s plate on music only; SFX from uisfx (CC0) soft pack; master: tanh saturation, 1.8:1 glue, oversampled limiter, 2-pass loudnorm'}
wavfile.write('audio/music_stem.wav', SR, (np.clip(mus / max(1e-9, np.abs(mix).max()) * .9, -1, 1) * 32767).astype('int16'))
json.dump(rep, open('audio/mix-report.json', 'w'), indent=1); print(json.dumps(rep, indent=1))
