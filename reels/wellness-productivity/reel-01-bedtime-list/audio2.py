# Hack Zone #01 v2 — composed score + physical SFX + mix/master -> audio/final.wav, audio/mix-report.json
# SCORE (66 BPM, F major, lo-fi bedtime): bars are the clock; every musical change lands on a bar line nearest to its story cue.
#   tension  (0 -> notebook): anxious pulse on one high note, a ticking clock, a dissonant Dm(b9) cluster pad, whispering murmur
#   build    (notebook -> quiet): bass + brush groove arrive as the pen starts; Rhodes comping arrives with the first written line
#   release  (quiet): the progression resolves into Fmaj7-Em7-Dm9-Cmaj9 with a celesta lullaby; murmur is gone
#   proof/CTA: full warm groove; the lullaby theme returns an octave up; the last bar rings out on Fmaj7
# SFX are physically modelled from the page's own motion: card taps scale with fall speed, pen scratch follows the pen's real speed (window.PEN),
# the notebook's slide follows its speed (window.NBM), flicks are Doppler whooshes; UI-semantic events use real CC0 samples (assets/sfx/uisfx).
# Run: python3 audio2.py   (needs audio/voice.wav, timing.json, events.json from tools/events.mjs)
import json, re, subprocess, os, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, lfilter, fftconvolve
SR = 48000; rng = np.random.default_rng(5)
TM = json.load(open('timing.json')); EVJ = json.load(open('events.json')); EV = EVJ['EV']; DUR = EVJ['dur']; PEN = EVJ.get('PEN', []); NBM = EVJ.get('NBM', []); N = int((DUR + .3) * SR); words = TM['words']
def sos(kind, f, o=2): return butter(o, f, kind, fs=SR, output='sos')
def lp(x, f, o=2): return sosfilt(sos('low', min(f, SR / 2 - 200), o), x, axis=0)
def hp(x, f, o=2): return sosfilt(sos('high', f, o), x, axis=0)
def bp(x, a, b, o=2): return sosfilt(sos('band', (a, min(b, SR / 2 - 200)), o), x, axis=0)
def tt(d): return np.arange(int(d * SR)) / SR
fr = lambda m: 440 * 2 ** ((m - 69) / 12)
def st(x, pan=0.0): a = (pan + 1) * np.pi / 4; return np.stack([x * np.cos(a), x * np.sin(a)], 1)
def put(buf, x, t, g=1.0):
    if x.ndim == 1: x = st(x)
    i = int(round(t * SR))
    if i < 0: x = x[-i:]; i = 0
    if i >= len(buf) or len(x) == 0: return
    x = x[:len(buf) - i]; buf[i:i + len(x)] += x * g
def adsr(n, a=.005, d=.2, s=.5, r=.15):
    e = np.full(n, s, float); na, nd, nr = max(1, int(a * SR)), int(d * SR), min(n, int(r * SR))
    e[:na] = np.linspace(0, 1, na); k = min(nd, max(0, n - na)); e[na:na + k] = np.linspace(1, s, k)
    if nr > 0: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def smooth(x, att, rel):
    xs = x[::48]; ys = np.zeros_like(xs); s = 0.0; a1, r1 = np.exp(-1 / (att * 1000)), np.exp(-1 / (rel * 1000))
    for i, xi in enumerate(xs): c = a1 if xi > s else r1; s = c * s + (1 - c) * xi; ys[i] = s
    return np.repeat(ys, 48)[:len(x)]
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-20); db = lambda x: 20 * np.log10(np.maximum(x, 1e-9))
ev = lambda k: [e for e in EV if e['k'] == k]
def first(k, d=None):
    l = ev(k); return l[0]['t'] if l else d
# ---------- musical clock ----------
BPM = 66; BEAT = 60 / BPM; BAR = 4 * BEAT; T0 = 0.0
def bar_at(t): return int(round((t - T0) / BAR))
def tb(b): return T0 + b * BAR                       # bar index -> time
slide, quiet, rise, clear, recap = first('slide', 9), first('quiet', 24), first('rise', 26), first('clear', 36), first('recap', 36)
B_BUILD, B_QUIET, B_CLEAR = bar_at(slide), bar_at(quiet), bar_at(clear); B_PROOF = max(bar_at(rise), B_QUIET + 1)
NB = int((DUR + .3) / BAR) + 2
# ---------- instruments ----------
def rhodes(m, d, g=.12):
    x = tt(d); f = fr(m); I = 1.4 * np.exp(-x * 3.2) + .2; y = np.sin(2 * np.pi * f * x + I * np.sin(2 * np.pi * f * x)) + .09 * np.sin(2 * np.pi * 14 * f * x) * np.exp(-x * 40)
    y = y * adsr(len(x), .004, .8, .3, min(.5, d * .5)); trem = .5 + .5 * np.sin(2 * np.pi * 4.3 * x); y = lp(y, 3800) * g
    return np.stack([y * (.8 + .2 * trem), y * (.8 + .2 * (1 - trem))], 1)
def bass(m, d, g=.34):
    x = tt(d); f = fr(m); y = (np.sin(2 * np.pi * f * x) + .32 * np.sin(4 * np.pi * f * x) * np.exp(-x * 5)) * adsr(len(x), .006, .35, .55, .12); return lp(np.tanh(1.3 * y), 420) * g
def padn(m, d, g=.05):
    x = tt(d); f = fr(m); y = 0
    for dt_ in (-.0045, 0, .0045): y = y + (2 * ((f * (1 + dt_) * x) % 1) - 1)
    return lp(y / 3, 700) * adsr(len(x), min(1.6, d * .4), .5, .8, min(1.8, d * .45)) * g
def celesta(m, d=1.6, g=.1):
    x = tt(d); f = fr(m); y = (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 3) + .16 * np.sin(2 * np.pi * 5.4 * f * x) * np.exp(-x * 14)) * np.exp(-x * 2.6) * adsr(len(x), .002, .4, .5, .3); return y * g
def kick(g=.5): x = tt(.38); ph = 2 * np.pi * np.cumsum(46 + 90 * np.exp(-x * 30)) / SR; return np.sin(ph) * np.exp(-x * 9) * g
def brush(g=.16): x = tt(.22); n = bp(rng.standard_normal(len(x)), 1200, 7000) * np.minimum(x / .02, 1) * np.exp(-x * 14); return n * g
def shaker(g=.07): x = tt(.07); return hp(rng.standard_normal(len(x)), 6500) * np.exp(-x * 60) * g
def tick_clock(g=.11): x = tt(.05); return (np.sin(2 * np.pi * 1700 * x) * np.exp(-x * 120) + hp(rng.standard_normal(len(x)), 2500) * np.exp(-x * 240) * .6) * g
CH = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60, 64], [48, 52, 55, 59, 62]]; BASS = [41, 40, 38, 36]         # Fmaj7, Em7, Dm9, Cmaj9; bass F E D C
CL = [50, 51, 57, 60]                                                                                                          # tension cluster: D Eb A C
MEL = [[72, 74, 77, 74], [72, 69, 72, None], [74, 72, 69, 72], [67, 69, 72, None]]                                           # lullaby over each bar (C5 D5 F5 D5 ...)
music = np.zeros((N, 2)); drums = np.zeros((N, 2)); padb = np.zeros((N, 2))
for b in range(NB):
    t0 = tb(b)
    if t0 > DUR + .1: break
    cyc = (b - B_QUIET) % 4 if b >= B_QUIET else 0
    if b < B_QUIET:                                           # tension / build: cluster pad, anxious pulse, clock
        for m in CL: put(padb, st(padn(m, BAR + 1.0, .045), -.1), t0, 1)
        if b < B_BUILD:
            for k in range(8): put(music, st(celesta(81, .5, .05 + .02 * (k % 2)), .3), t0 + k * BEAT / 2, 1)   # a nervous high E, repeating
            for k in range(4): put(drums, st(tick_clock(), 0), t0 + k * BEAT, 1)
        else:
            for k in range(4): put(music, st(bass(CL[0] - 12, BEAT * .9, .22), 0), t0 + k * BEAT, 1)             # pulse bass under the build
            for k in range(8): put(drums, st(shaker(.05), .3), t0 + k * BEAT / 2 + (.04 * BEAT if k % 2 else 0), 1)
            if b >= bar_at(first('pen', 11)) : put(drums, st(brush(.12), -.2), t0 + BEAT, 1); put(drums, st(brush(.12), -.2), t0 + 3 * BEAT, 1)
    else:                                                     # release: resolved progression
        ch, bs = CH[cyc], BASS[cyc]
        for j, m in enumerate(ch): put(music, rhodes(m, BAR * .95, .085 if b < B_PROOF else .1), t0 + .012 * j, 1)
        for m in ch[:3]: put(padb, st(padn(m, BAR + 1.2, .035), .1), t0, 1)
        put(music, st(bass(bs, BEAT * 1.6, .32), 0), t0, 1); put(music, st(bass(bs, BEAT * 1.1, .26), 0), t0 + 2.5 * BEAT, 1)
        if b >= B_PROOF - 1 and b < bar_at(DUR - 3):                         # groove from the comparison on
            put(drums, st(kick(.42), 0), t0, 1); put(drums, st(kick(.3), 0), t0 + 2 * BEAT + .5 * BEAT, 1); put(drums, st(brush(.14), -.2), t0 + BEAT, 1); put(drums, st(brush(.14), -.2), t0 + 3 * BEAT, 1)
            for k in range(8): put(drums, st(shaker(.06), .3), t0 + k * BEAT / 2 + (.06 * BEAT if k % 2 else 0), 1)
        mel = MEL[cyc]; oct_ = 12 if b >= B_PROOF + 2 else 0
        for k, m in enumerate(mel):
            if m is None: continue
            if b < B_PROOF and k % 2: continue                                # sparser lullaby while it is still quiet
            put(music, st(celesta(m + oct_, 1.8, .085), .25 + .1 * k), t0 + k * BEAT, 1)
    if t0 > DUR - 3.2 and b >= bar_at(DUR - 3.2):                           # last bar: ring out on Fmaj7
        for j, m in enumerate(CH[0]): put(music, rhodes(m, BAR * 1.4, .1), t0 + .015 * j, 1)
        put(music, st(bass(41, BEAT * 3, .3), 0), t0, 1)
# ---------- murmur: whispering voices; loudness = open loops (cards on the desk) ----------
n_open = np.zeros(N)
drops = sorted(e['t'] for e in ev('drop')); lifts = sorted(e['t'] for e in ev('lift'))
for t_ in drops: n_open[int(t_ * SR):] += 1
for t_ in lifts: n_open[int((t_ + .6) * SR):] -= 1
lvl = np.clip(smooth(n_open, .15, .4) / 8, 0, 1) ** .85
def murmur_voice(seed, pan):
    r = np.random.default_rng(seed); x = r.standard_normal(N); f1, f2 = r.uniform(420, 820), r.uniform(1300, 2300)
    y = bp(x, f1 * .8, f1 * 1.25, 2) + .7 * bp(x, f2 * .85, f2 * 1.2, 2); t = np.arange(N) / SR; syl = np.zeros(N)
    for k in range(3): syl += (.5 + .5 * np.sin(2 * np.pi * r.uniform(2.2, 6.5) * t + r.uniform(0, 6.3))) ** 2
    return st(y * syl / 3 * np.clip(np.sin(2 * np.pi * r.uniform(.12, .35) * t + r.uniform(0, 6.3)) * 1.6 + .4, 0, 1), pan)
mur = sum(murmur_voice(100 + i, p) for i, p in enumerate([-.8, -.5, -.2, .2, .5, .8])); mur = mur / max(1e-9, rms(mur.mean(1))) * lvl[:, None]
# ---------- physical SFX ----------
def tap(v, g=1.0):   # a card hitting wood: damped body thump + paper slap; v = impact strength 0..1
    x = tt(.16); y = (np.sin(2 * np.pi * (170 + 40 * v) * x) * np.exp(-x * 38) + .5 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 70)) * .7 + bp(rng.standard_normal(len(x)), 1800, 7000) * np.exp(-x * 90) * .5; return y * g * (.35 + .65 * v)
def whoosh(d=.4, f0=700, f1=3500, g=.5, rev=False):
    x = tt(d); env = np.sin(np.pi * np.clip(x / d, 0, 1)) ** 1.6; n = rng.standard_normal(len(x)); fc = np.linspace(f0, f1, len(x)); y = np.zeros(len(x)); 
    for a, b in zip(range(0, len(x), 480), range(480, len(x) + 480, 480)): c = fc[min(a, len(x) - 1)]; y[a:b] = sosfilt(sos('band', (c * .6, min(c * 1.6, SR / 2 - 200)), 2), n[a:b]) if b - a > 20 else 0
    y = y * env * g; return y[::-1] if rev else y
def sample(pack, name, gain=1.0, rate=1.0):
    p = f'../../../assets/sfx/uisfx/sounds/{pack}/{name}.mp3'; raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    y = np.frombuffer(raw, dtype=np.float32).astype('float64'); return y / max(1e-9, np.abs(y).max()) * gain
sfx = np.zeros((N, 2)); acc = np.zeros((N, 2))
for e in EV:
    k, t_ = e['k'], e['t']
    if k == 'drop': v = 1.0; put(sfx, st(tap(v), -.4 + .12 * e['i'] / 1.0 % 1), t_, .55); put(sfx, st(tap(.35), -.4 + .12 * e['i'] % 1), t_ + .21, .35); put(sfx, st(tap(.12), 0), t_ + .33, .22)   # impact, bounce, settle
    elif k == 'lift': put(sfx, st(bp(rng.standard_normal(int(.18 * SR)), 900, 4500) * np.exp(-tt(.18) * 12) * .4, .2), t_, .35)       # sticky strip peeling
    elif k == 'flick': put(sfx, st(whoosh(.45, 900, 4200, .5), .5), t_, .4)
    elif k == 'slide': pass
    elif k == 'pickup': put(sfx, st(tap(.5, .8), .3), t_, .3); put(sfx, st(bp(rng.standard_normal(int(.25 * SR)), 300, 2200) * np.exp(-tt(.25) * 8) * .3, .3), t_ + .05, .3)
    elif k == 'marker': put(sfx, st(bp(rng.standard_normal(int(.7 * SR)), 1500, 5200) * np.sin(np.pi * tt(.7) / .7) ** 1.4 * .3, -.1), t_, .28)
    elif k == 'strike': put(sfx, st(whoosh(.3, 1500, 6500, .6), -.2), t_, .32)
    elif k == 'tick': put(acc, st(sample('soft', 'check', .9), .1), t_, .3)
    elif k == 'quiet': put(acc, st(sample('soft', 'sleep', .9), 0), t_, .3)
    elif k == 'rise': put(sfx, st(whoosh(1.2, 250, 1800, .5, False), 0), t_, .25)
    elif k == 'bars': put(acc, st(sample('soft', 'progress-step', .8), 0), t_, .2)
    elif k == 'stamp': put(acc, st(tap(1.0, 1.2), 0), t_, .5); put(acc, st(sample('soft', 'badge', .9), .1), t_ + .03, .3)
    elif k == 'dots':
        for j in range(19): put(sfx, st(sample('soft', 'hover', .6) if False else bp(rng.standard_normal(int(.02 * SR)), 2500, 6000) * np.exp(-tt(.02) * 160) * .5, (j % 7 - 3) / 4), t_ + .3 + j * .12, .12)
    elif k == 'clear': put(sfx, st(whoosh(.9, 300, 1600, .5), 0), t_, .28)
    elif k == 'recap': put(acc, st(tap(.9, 1.1), 0), t_ + .05, .4); put(sfx, st(whoosh(.4, 600, 2600, .4, True), 0), t_ - .15, .2)
    elif k == 'chip': put(acc, st(sample('soft', ['select', 'send', 'typing', 'success'][e['n']], .9), (-.3, -.1, .1, .3)[e['n']]), t_, .3)
    elif k == 'swoosh': put(sfx, st(whoosh(.7, 900, 7000, .6), .3), t_, .3)
    elif k == 'type': [put(acc, st(sample('soft', 'typing', .7), .1), t_ + j * (e.get('d', .5) / 7), .08) for j in range(7)]
    elif k == 'press': put(acc, st(sample('soft', 'press', .9), 0), t_, .35); put(acc, st(sample('soft', 'achievement', .9), 0), t_ + .1, .28)
# pen scratch from the real pen motion; notebook slide from its real speed
if PEN:
    pa = np.array(PEN); tp, vp, hp_ = pa[:, 0], pa[:, 1], pa[:, 2]; env = np.zeros(N)
    for t_, v_, h_ in zip(tp, vp, hp_):
        if h_ < 3 and v_ > 40: env[int(t_ * SR):int((t_ + .01) * SR)] = np.clip(v_ / 900, 0, 1)
    env = smooth(env, .01, .03); n = rng.standard_normal(N); grain = bp(n, 2500, 8500) * (.6 + .4 * np.abs(bp(rng.standard_normal(N), 30, 90))) ; sfx += st(grain * env * .2, .1)
if NBM:
    na = np.array(NBM); env = np.zeros(N)
    for t_, v_ in zip(na[:, 0], na[:, 1]): env[int(t_ * SR):int((t_ + .01) * SR)] = np.clip(v_ / 1800, 0, 1)
    env = smooth(env, .02, .06); y = lp(rng.standard_normal(N), 900) * env * .5 + bp(rng.standard_normal(N), 1500, 5000) * env * .1; sfx += st(y, 0)
    tend = na[-1][0]; put(sfx, st(tap(.8, 1.0), 0), tend - .05, .4)
# ---------- reverb on the music bus only ----------
def reverb(x, rt=2.4, wet=.3):
    n = int(rt * SR); t = np.arange(n) / SR; ir = [lp(rng.standard_normal(n) * np.exp(-t * 6.9 / rt), 5000) for _ in range(2)]; ir = np.stack(ir, 1) * 0.02
    wetsig = np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1); return x * (1 - wet) + wetsig * wet * 6
musbus = reverb(music + padb, 2.6, .34) + drums
# ---------- voice, ducking, mix ----------
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voice.wav', '-af', 'highpass=f=70,deesser=i=0.35:m=0.5:f=0.5,equalizer=f=160:t=q:w=1.0:g=1.5,equalizer=f=3000:t=q:w=1.5:g=1.0,highshelf=f=9000:g=-1.0,acompressor=threshold=-22dB:ratio=2:attack=15:release=200:makeup=1.5', '-ar', str(SR), '-ac', '1', 'audio/voice_proc.wav'])
_, v = wavfile.read('audio/voice_proc.wav'); v = v.astype('float64') / 32768.0; vo = np.zeros(N); vo[:min(N, len(v))] = v[:N]
act = np.zeros(N)
for w in words: act[int(max(0, w['s'] - .06) * SR):int(min(N, (w['e'] + .1) * SR))] = 1
duck = smooth(act, .03, .28); vr = rms(vo[act > 0]); carve = lambda x, d: x - d * bp(x, 1200, 4500)
bus = hp(musbus + mur * .5, 35); bus = carve(bus, .35); bus = bus - (.35 * duck)[:, None] * bp(bus, 1200, 4500)
GAP_DB, DUCK_DB = float(os.environ.get('GAP_DB', -9)), float(os.environ.get('DUCK_DB', -18))
mg = 10 ** (GAP_DB / 20) * vr / max(rms(bus.mean(1)), 1e-9); mus = bus * mg * (10 ** (DUCK_DB * duck / 20))[:, None]
tail = np.clip((np.arange(N) / SR - (words[-1]['e'] + .3)) / .8, 0, 1); mus *= (10 ** (4.0 * tail / 20))[:, None]                       # the bed swells once the voice stops
fx = (carve(sfx, .3) + carve(acc, .2)) * (vr / .2) * (10 ** (-12 * duck / 20))[:, None]
mix = np.stack([vo, vo], 1) * np.sqrt(2) + mus + fx
seps = []; named = []; FR = int(.02 * SR); bedm = (mus + fx).mean(1)
for w in words:
    a, b2 = int(w['s'] * SR), int(w['e'] * SR)
    if b2 - a < int(.08 * SR): continue
    rr_ = [db(rms(vo[f0:f0 + FR])) - db(rms(bedm[f0:f0 + FR])) for f0 in range(a, b2 - FR, FR) if db(rms(vo[f0:f0 + FR])) > db(vr) - 12]
    if len(rr_) < 3: continue
    seps.append(float(np.median(rr_))); named.append((round(seps[-1], 1), w['w'], round(w['s'], 2)))
seps = np.array(seps); print('worst words:', sorted(named)[:6])
mix = np.tanh(mix * 1.1) / 1.1; peak = np.abs(mix).max(); wavfile.write('audio/premaster.wav', SR, (mix / peak * .9 * 32767).astype('int16'))
CHn = 'acompressor=threshold=-18dB:ratio=1.8:attack=20:release=250:makeup=1.5,aresample=192000,alimiter=limit=0.7:attack=3:release=60:level=false,aresample=48000'
m1 = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'audio/premaster.wav', '-af', CHn + ',loudnorm=I=-14:TP=-1:LRA=8:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
J = json.loads(m1[m1.rindex('{'):m1.rindex('}') + 1]); af = CHn + ',loudnorm=I=-14:TP=-1:LRA=8:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (J['input_i'], J['input_tp'], J['input_lra'], J['input_thresh'], J['target_offset'])
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/premaster.wav', '-af', af, '-ar', '48000', '-ac', '2', 'audio/final_ln.wav'])
def ebur(p):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', o)[-1]), float(re.findall(r'LRA:\s+(-?[\d.]+) LU', o)[-1])
I0, _, _ = ebur('audio/final_ln.wav')
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/final_ln.wav', '-af', 'aresample=192000,volume=%.2fdB,alimiter=limit=0.84:attack=2:release=50:level=false,aresample=48000' % (-14.0 - I0), '-ac', '2', 'audio/final.wav']); subprocess.run(['rm', '-f', 'audio/final_ln.wav'])
I, TP, LRA = ebur('audio/final.wav'); subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/final.wav', '-c:a', 'libmp3lame', '-b:a', '192k', 'audio/preview.mp3'])
wavfile.write('audio/music_only.wav', SR, (np.clip(mus / max(1e-9, np.abs(mus).max()) * .9, -1, 1) * 32767).astype('int16'))
rep = {'integrated_LUFS': I, 'true_peak_dBTP': TP, 'loudness_range_LU': LRA, 'voice_over_bed+sfx_dB_per_word': {'median': round(float(np.median(seps)), 1), 'p10': round(float(np.percentile(seps, 10)), 1), 'min': round(float(seps.min()), 1), 'words': int(len(seps))},
       'music': f'{BPM} BPM F major; bars aligned to story cues (build bar {B_BUILD}, quiet bar {B_QUIET}, proof bar {B_PROOF})', 'targets': 'median >= 19, min >= 13'}
json.dump(rep, open('audio/mix-report.json', 'w'), indent=1); print(json.dumps(rep, indent=1))
