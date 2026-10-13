# Score + SFX + mix/master for "Claude just moved into your Google Sheets." -> audio/final.wav (stereo 48 kHz), audio/preview.mp3,
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
BPM = 112; B = 60 / BPM; BAR = 4 * B
PROG = [[48, 52, 55, 59], [43, 47, 50, 57], [45, 48, 52, 55], [41, 45, 48, 52, 55]]     # Cmaj7, G6, Am7, Fmaj9
ROOT = [36, 43, 45, 41]
MEL = [76, 79, 81, 79, 76, 74, 72, 74]
STY = ['hook', 'drop', 'step', 'step', 'step', 'python', 'approve', 'apps', 'catch', 'cta']
sec = [(SC[i], SC[i + 1] if i + 1 < len(SC) else TOTAL, STY[i]) for i in range(len(SC))]
music = np.zeros((N, 2)); drums = np.zeros((N, 2)); bass = np.zeros((N, 2)); kicks = []
def section(t0, t1, style):
    nb = int(np.ceil((t1 - t0) / B)) + 1
    for b in range(nb):
        t = t0 + b * B; bar = b // 4; beat = b % 4; ch = PROG[bar % 4]; rt = ROOT[bar % 4]
        if t > t1 + .05: break
        if style == 'hook':                       # marimba sparkle over a soft pad, a ticking hat: tense, light, no kick yet
            for k in range(4): put(music, st(marimba(ch[k % len(ch)] + 24, .5, .045), (-.5, .5, -.25, .25)[k]), t + k * B / 4)
            if beat == 0: put(music, pad([n + 12 for n in ch], BAR * 1.05, .02, 1800), t)
            put(drums, st(hat(.03), .3), t + B / 2)
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
for i in (1, 2, 3, 4, 9):
    c = SC[i]; a, b2 = int((c - B * .9) * SR), int((c - .02) * SR)
    gate[a:b2] = np.minimum(gate[a:b2], np.linspace(1, .08, b2 - a) ** .5)
    put(drums, st(kick(.6 if i in (1, 9) else .3)), c); put(drums, st(crash(.05 if i == 1 else .018), .2), c); put(bass, st(subdrop(.3 if i == 1 else .12)), c)
put(music, st(riser(1.8, .06)), SC[1] - 1.8)              # hook -> drop
put(music, st(riser(1.2, .04)), SC[9] - 1.2)              # catch -> CTA lift
put(music, pad([60, 64, 67, 71, 74], 3.2, .03, 2800), TOTAL - 3.2); put(music, st(marimba(84, 2.0, .06), .2), TOTAL - 3.2); put(bass, st(sub(36, 2.8, .26)), TOTAL - 3.2)
for x in (music, drums, bass): x *= gate[:, None]
pump = np.ones(N)
for k in kicks:
    i = int(k * SR); n = min(int(.2 * SR), N - i)
    if n > 0: pump[i:i + n] = np.minimum(pump[i:i + n], 1 - .26 * np.exp(-np.arange(n) / (.055 * SR)))
music *= pump[:, None]; bass *= pump[:, None] ** .7
c0, c1 = SC[8], SC[9]
seg = slice(int(c0 * SR), int(c1 * SR)); music[seg] = lp(music[seg], 1100, 2); drums[seg] = lp(drums[seg], 2500, 2)
def ir(seed):
    r = np.random.default_rng(seed); n = int(1.2 * SR); x = r.standard_normal(n) * np.exp(-np.arange(n) / (.26 * SR))
    x = lp(x, 6500); x[:int(.015 * SR)] = 0; return x / np.sqrt((x ** 2).sum())
wet = np.stack([fftconvolve(music[:, 0], ir(1))[:N], fftconvolve(music[:, 1], ir(2))[:N]], 1)
music = music + .26 * wet
# ---------- SFX: CC0 UI samples (assets/sfx/uisfx, "soft" pack) + a few synth hits, peak-aligned to the page's cue times ----------
EV = []
def E(kind, t, g=1.0): EV.append(dict(k=kind, t=round(t, 3), g=g))
E('press', .70); E('check', 1.0, .6); E('check', 1.2, .5); E('drop', 1.62, .7); E('swoosh', 1.95, .8); E('complete', 2.3, .8)
E('stamp', W(2, 'clean')); E('stamp', W(2, 'pivot')); E('stamp', W(2, 'chart'))
for i in range(7): E('typing', SC[2] + .25 + i * .15, .5)
E('press', W(3, 'marketplace') + .25); E('complete', W(3, 'marketplace') + .45, .8)
E('expand', W(4, 'extensions')); E('select', W(4, 'claude', 0)); E('select', W(4, 'claude', 1), .9); E('open', W(4, 'claude', 1) + .45, .8)
for i in range(4): E('typing', SC[4] + .3 + i * .16, .35)
E('pencil', W(5, 'clean')); E('pencil', W(5, 'total')); E('pencil', W(5, 'chart'), .6); E('paste', W(5, 'chart') + .95, .6)
E('pencil', W(6, 'range'), .8)
for i in range(6): E('typing', W(6, 'pulls') + i * .2, .45)
E('swoosh', W(6, 'back') - .1, .7); E('complete', W(6, 'back') + .2, .7)
E('lock', W(7, 'edit'), .7); E('press', W(7, 'back') + .25); E('unlock', W(7, 'back') + .35, .9)
E('drop', W(8, 'docs'), .8); E('drop', W(8, 'slides'), .8)
E('warning', W(9, 'beta'), .7); E('warning', W(9, 'paid'), .7); E('warning', W(9, "admin's"), .7)
E('notification', W(10, 'comment')); E('typing', W(10, 'sheets'), .6); E('typing', W(10, 'sheets') + .1, .5); E('success', [w for w in WD if w['p'] == 10][-1]['e'] + .12, .9)
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
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voice.wav', '-af', 'deesser=i=0.45:m=0.6:f=0.55,equalizer=f=7400:t=q:w=1.4:g=-5,highshelf=f=10000:g=-1.5,equalizer=f=3000:t=q:w=1.5:g=0.8,acompressor=threshold=-24dB:ratio=2.2:attack=6:release=120:makeup=2,loudnorm=I=-17:TP=-2:LRA=6', '-ar', str(SR), '-ac', '1', 'audio/voice_proc.wav'])
_, v = wavfile.read('audio/voice_proc.wav'); v = v.astype('float64') / 32768.0
# the take of line 5 trails off on its last word ("it."): lift that one word by 6 dB with 30 ms ramps so it isn't lost under the music
for (p_, k_) in ((5, 'it'),):
    w_ = [w for w in WD if w['p'] == p_ and w['k'] == k_][-1]; a_, b_ = int((w_['s'] - .02) * SR), int((w_['e'] + .05) * SR); r_ = int(.03 * SR)
    g_ = np.ones(b_ - a_) * 10 ** (6 / 20); g_[:r_] = np.linspace(1, g_[0], r_); g_[-r_:] = np.linspace(g_[0], 1, r_); v[a_:b_] *= g_
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
GAP_DB, DUCK_DB = -10.5, -8.5                                  # music 10.5 dB under the voice in gaps, 19 dB while speaking
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
