# Score + SFX + mix/master for "I was asleep when Claude wrote this." -> audio/final.wav (stereo 48 kHz), audio/preview.mp3,
# audio/mix-report.json and events.json (the cue sheet the page reads, so visuals and sound share one set of times).
# Brief from the creator: "soothing experience yet punchy enough to keep the viewer hooked".
#  - Soothing: warm 96 bpm morning neo-soul (FM electric piano, Karplus-Strong guitar, soft sub, detuned pad), music-only
#    stereo reverb, voice dry and centred, music carved out of the voice band and ducked smoothly while he speaks.
#  - Punchy: dreamy music-box hook that DROPS into the groove on the first cut; a one-beat dropout + downbeat hit before every
#    "Step N"; tight kick/clap transients; a low-pass half-time catch; the groove returns full for the CTA; SFX on the words.
# Run: python3 audio.py   (needs audio/voice.wav + site/timing.js from timing.py)
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
# ---------- arrangement ----------
BPM = 96; B = 60 / BPM; BAR = 4 * B
PROG = [[53, 57, 60, 64], [57, 60, 64, 67], [50, 53, 57, 60, 64], [46, 50, 53, 57]]     # Fmaj7, Am7, Dm9, Bbmaj7
ROOT = [41, 45, 38, 46]
MEL = [72, 76, 79, 81, 79, 76, 74, 72]
sec = []   # (t0, t1, style) one per scene; the bar grid restarts at every cut so cuts land on downbeats
STY = ['hook', 'drop', 'groove', 'groove', 'lift', 'breath', 'bright', 'groove', 'catch', 'cta']
for i in range(len(SC)): sec.append((SC[i], SC[i + 1] if i + 1 < len(SC) else TOTAL, STY[i]))
music = np.zeros((N, 2)); drums = np.zeros((N, 2)); bass = np.zeros((N, 2)); kicks = []
def section(t0, t1, style):
    nb = int(np.ceil((t1 - t0) / B)) + 1
    for b in range(nb):
        t = t0 + b * B; bar = b // 4; beat = b % 4; ch = PROG[bar % 4]; rt = ROOT[bar % 4]
        if t > t1 + .05: break
        if style == 'hook':
            for k, m in enumerate([ch[0] + 12, ch[2] + 12, ch[1] + 24, ch[3] + 12]):
                put(music, st(musicbox(m, 1.6, .05), (-.4, .4, -.2, .2)[k]), t + k * B / 4)
            if beat == 0: put(music, pad([n + 12 for n in ch], BAR * 1.05, .022, 1600), t)
            continue
        swing = (B / 2) * .12
        if style == 'breath':                     # cloud beat: drums out, pad + slow epiano, rim on 3
            if beat == 0: put(music, epiano(ch, BAR, .045, .7), t); put(music, pad(ch, BAR * 1.05, .03, 1500), t); put(bass, st(sub(rt, BAR * .9, .2)), t)
            if beat == 2: put(drums, st(rim(.08), .3), t)
            continue
        if style == 'catch':                      # half time: kick on 1, clap on 3, low-passed later in the bus
            if beat == 0: kicks.append(t); put(drums, st(kick(.5)), t); put(bass, st(sub(rt, BAR * .9, .26)), t); put(music, pad(ch, BAR * 1.05, .035, 1100), t); put(music, epiano(ch, BAR, .04, .6), t)
            if beat == 2: put(drums, st(clap(.12), -.1), t)
            put(drums, st(hat(.025), .35), t + B / 2)
            continue
        # groove family: drop / groove / lift / bright / cta
        if beat in (0, 2) or (beat == 1 and style in ('lift', 'bright', 'cta') and bar % 2): kicks.append(t); put(drums, st(kick(.5 if beat == 0 else .42)), t)
        if beat in (1, 3): put(drums, st(clap(.16), -.08), t); put(drums, st(rim(.05), .25), t + B * .75)
        for h in range(2): put(drums, st(hat(.038 if h else .05), .32), t + h * B / 2 + (swing if h else 0))
        if style in ('lift', 'bright', 'cta'): put(drums, st(shaker(.035), -.35), t + B / 4); put(drums, st(shaker(.028), -.35), t + 3 * B / 4)
        if style in ('lift', 'cta') and beat == 3: put(drums, st(hat(.035, open_=True), .3), t + B / 2)
        if beat == 0:
            put(music, epiano(ch, BAR * 1.02, .05 if style != 'cta' else .056, 1.0), t)
            put(bass, st(sub(rt, B * 1.6, .3)), t); put(bass, st(sub(rt + (12 if bar % 2 else 7), B * .8, .22)), t + B * 2.5)
            if style in ('bright', 'cta', 'lift'): put(music, pad([n + 12 for n in ch], BAR * 1.05, .02, 2600), t)
        # guitar arpeggio on 8ths (sparser in plain groove)
        arp = [ch[0] + 12, ch[2] + 12, ch[1] + 12, ch[3] + 12]
        for h in range(2):
            if style == 'groove' and h == 1: continue
            put(music, st(ks(arp[(b * 2 + h) % 4], 1.1, .07, .55), (-.45 if h else .45)), t + h * B / 2 + (swing if h else 0))
        if style in ('bright', 'cta') and beat % 2 == 0: put(music, st(musicbox(MEL[(b // 2) % 8], 1.0, .03), .2), t + B / 2)
for (t0, t1, s) in sec: section(t0, t1, s)
# drops and hits: a one-beat dropout before each "Step" scene + the first cut, then a downbeat hit on the cut
gate = np.ones(N)
for i in (1, 2, 3, 4, 6):
    c = SC[i]; a, b2 = int((c - B * .9) * SR), int((c - .02) * SR)
    if i == 1: a = int((c - .35) * SR)
    gate[a:b2] = np.minimum(gate[a:b2], np.linspace(1, .06, b2 - a) ** .5)
    put(drums, st(kick(.6)), c); put(drums, st(crash(.04 if i > 1 else .06), .2), c); put(bass, st(subdrop(.3 if i == 1 else .18)), c)
put(music, st(riser(1.9, .06)), SC[1] - 1.9)              # hook -> drop
put(music, st(riser(1.2, .04)), SC[9] - 1.2)              # catch -> CTA lift
# final chord + bell ring under the CTA hold
put(music, epiano([53, 57, 60, 64, 69], 3.0, .06), TOTAL - 3.0); put(music, pad([65, 69, 72, 76], 3.0, .03, 2800), TOTAL - 3.0)
put(music, st(musicbox(84, 2.6, .05), .2), TOTAL - 3.0); put(bass, st(sub(41, 2.6, .28)), TOTAL - 3.0)
for x in (music, drums, bass): x *= gate[:, None]
# kick sidechain on music + bass (gentle pump = groove without loudness)
pump = np.ones(N)
for k in kicks:
    i = int(k * SR); n = min(int(.22 * SR), N - i)
    if n > 0: pump[i:i + n] = np.minimum(pump[i:i + n], 1 - .28 * np.exp(-np.arange(n) / (.06 * SR)))
music *= pump[:, None]; bass *= pump[:, None] ** .7
# the catch: low-pass the music bus as it begins, open it again at the CTA
c0, c1 = SC[8], SC[9]
seg = slice(int(c0 * SR), int(c1 * SR)); music[seg] = lp(music[seg], 1100, 2); drums[seg] = lp(drums[seg], 2500, 2)
# music reverb (stereo synthetic plate, 1.5 s, darker tail, 18 ms pre-delay) on the music bus only
def ir(seed):
    r = np.random.default_rng(seed); n = int(1.5 * SR); x = r.standard_normal(n) * np.exp(-np.arange(n) / (.32 * SR))
    x = lp(x, 6000); x[:int(.018 * SR)] = 0; return x / np.sqrt((x ** 2).sum())
wet = np.stack([fftconvolve(music[:, 0], ir(1))[:N], fftconvolve(music[:, 1], ir(2))[:N]], 1)
music = music + .32 * wet
# ---------- SFX (cue sheet shared with the page) ----------
EV = []
def E(kind, t, g=1.0, **kw): EV.append(dict(k=kind, t=round(t, 3), g=g, **kw))
def ln(p): return [w for w in WD if w['p'] == p]
# hook: typing of the brief, Claude byline stamp, 7:00 tick + soft alarm chime as the music drops
for i in range(10): E('type', .15 + i * .14, .5)
E('stamp', W(1, 'claude'), .6); E('tick', SC[1] - .55, .7); E('chime', SC[1] - .05, .8)
E('swish', W(2, 'inbox')); E('flip', W(2, 'calendar')); E('whoosh', W(2, 'setup'), .7)
E('click', W(3, 'connect')); E('click', W(3, 'customize')); E('click', W(3, 'connectors')); E('plug', W(3, 'connectors') + .45); E('blip', W(3, 'connectors') + .6, .7)
E('drop', W(4, 'meetings')); E('drop', W(4, 'emails')); E('drop', W(4, 'promised'))
E('scratch', W(5, 'skip'), .8)
for i in range(8): E('type', W(6, 'every') + i * .11, .45)
E('press', W(6, 'schedule')); E('bell', W(6, 'schedule') + .12, .8)
E('air', W(7, 'cloud')); E('low', W(7, 'sleep'), .6)
E('clink', W(8, 'coffee')); E('tick', W(8, 'session'), .6)
E('pencil', W(9, 'draft')); E('lock', W(9, 'okay'))
for k in ('paid', 'account', 'attachments', 'admin'): E('pin', W(10, k))
E('pop', W(11, 'save')); E('chime', W(11, 'follow'), 1.0)
for c in SC[1:]: E('cut', c)
sfx = np.zeros((N, 2)); acc = np.zeros((N, 2))
def typefx(): x = tt(.04); return (hp(rng.standard_normal(len(x)), 2500) * np.exp(-x * 160) * .7 + np.sin(2 * np.pi * 1900 * x) * np.exp(-x * 150) * .3)
def tickfx(): x = tt(.05); return np.sin(2 * np.pi * 3100 * x) * np.exp(-x * 140) + .4 * hp(rng.standard_normal(len(x)), 4000) * np.exp(-x * 300)
def bellfx(m=88, d=1.2): x = tt(d); f = fr(m); return (np.sin(2 * np.pi * f * x) + .5 * np.sin(2 * np.pi * 2.76 * f * x) * np.exp(-x * 3) + .25 * np.sin(2 * np.pi * 5.4 * f * x) * np.exp(-x * 6)) * np.exp(-x * 2.8)
def stampfx(): x = tt(.35); return np.sin(2 * np.pi * np.cumsum(60 + 90 * np.exp(-x * 30)) / SR) * np.exp(-x * 11) + hp(rng.standard_normal(len(x)), 1500) * np.exp(-x * 60) * .45
def swishfx(d=.35, a=800, b=6000): n = int(d * SR); x = rng.standard_normal(n); f = np.linspace(a, b, 6); out = np.concatenate([bp(c, fi * .7, fi * 1.4) for c, fi in zip(np.array_split(x, 6), f)]); return out * np.sin(np.linspace(0, np.pi, n)) ** 2
def clickfx(): x = tt(.03); return np.sin(2 * np.pi * 2300 * x) * np.exp(-x * 220) + hp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 400) * .5
def plugfx(): x = tt(.12); return np.sin(2 * np.pi * 1500 * x) * np.exp(-x * 90) * .6 + lp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 120) * .5 + np.sin(2 * np.pi * 160 * x) * np.exp(-x * 40) * .6
def blipfx(): x = tt(.12); return np.sin(2 * np.pi * (880 + 440 * (x > .05)) * x) * np.exp(-x * 25)
def dropfx(): x = tt(.18); return lp(rng.standard_normal(len(x)), 1800) * np.exp(-x * 40) + np.sin(2 * np.pi * 210 * x) * np.exp(-x * 30) * .5
def scratchfx(): x = tt(.28); return bp(rng.standard_normal(len(x)), 1800, 5000) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 26 * x))) * np.exp(-x * 6)
def pressfx(): x = tt(.09); return np.sin(2 * np.pi * 700 * x) * np.exp(-x * 60)
def airfx(): return swishfx(.9, 300, 3000) * .8
def lowfx(): x = tt(.8); return np.sin(2 * np.pi * 110 * x) * np.exp(-x * 4) * np.minimum(1, x / .05)
def clinkfx(): x = tt(.6); return (np.sin(2 * np.pi * 2650 * x) + .6 * np.sin(2 * np.pi * 4130 * x) + .3 * np.sin(2 * np.pi * 6890 * x)) * np.exp(-x * 9)
def pencilfx(): x = tt(.45); return bp(rng.standard_normal(len(x)), 2500, 7000) * (.4 + .6 * np.abs(np.sin(2 * np.pi * 7 * x))) * np.sin(np.linspace(0, np.pi, len(x)))
def lockfx(): return np.concatenate([clickfx(), np.zeros(int(.04 * SR)), clickfx() * .8])
def pinfx(): x = tt(.25); return np.sin(2 * np.pi * np.cumsum(90 + 120 * np.exp(-x * 40)) / SR) * np.exp(-x * 16) + hp(rng.standard_normal(len(x)), 2500) * np.exp(-x * 120) * .3
def popfx(): x = tt(.14); return np.sin(2 * np.pi * (500 + 2600 * x) * x) * np.exp(-x * 35)
FX = {'type': (typefx, .10, .3), 'tick': (tickfx, .09, .1), 'stamp': (stampfx, .28, 0), 'chime': (None, .07, 0), 'swish': (swishfx, .09, -.3),
      'flip': (lambda: swishfx(.22, 1500, 7000), .08, .3), 'whoosh': (lambda: swishfx(.5, 500, 7000), .10, 0), 'click': (clickfx, .10, .2),
      'plug': (plugfx, .22, 0), 'blip': (blipfx, .06, .2), 'drop': (dropfx, .2, -.2), 'scratch': (scratchfx, .07, .2), 'press': (pressfx, .16, 0),
      'bell': (lambda: bellfx(93, 1.0), .05, .15), 'air': (airfx, .08, 0), 'low': (lowfx, .12, 0), 'clink': (clinkfx, .06, .25),
      'pencil': (pencilfx, .08, -.2), 'lock': (lockfx, .2, 0), 'pin': (pinfx, .26, 0), 'pop': (popfx, .14, 0), 'cut': (None, 0, 0)}
for e in EV:
    f, g, pn = FX[e['k']]
    if e['k'] == 'chime':
        for i, m in enumerate([81, 84, 88]): put(sfx, st(bellfx(m, 1.4), (-.2, 0, .2)[i]), e['t'] + i * .08, .06 * e['g'], True)
        continue
    if f is None: continue
    put(acc if e['k'] in ('stamp', 'plug', 'pin', 'lock') else sfx, st(f(), pn), e['t'], g * e['g'], True)
json.dump({'sfx': EV, 'SC': SC, 'total': TOTAL, 'bpm': BPM, 'styles': STY}, open('events.json', 'w'))
# ---------- voice: de-harsh the 7 kHz sibilance bump (soothing), a touch of 3 kHz clarity, light compression ----------
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voice.wav', '-af', 'deesser=i=0.45:m=0.6:f=0.55,equalizer=f=7400:t=q:w=1.4:g=-5,highshelf=f=10000:g=-1.5,equalizer=f=3000:t=q:w=1.5:g=0.8,acompressor=threshold=-24dB:ratio=2.2:attack=6:release=120:makeup=2,loudnorm=I=-17:TP=-2:LRA=6', '-ar', str(SR), '-ac', '1', 'audio/voice_proc.wav'])
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
GAP_DB, DUCK_DB = -10.5, -7.5                                  # music 10.5 dB under the voice in gaps, 18 dB while speaking
mg = 10 ** (GAP_DB / 20) * vr / max(rms(mb_c.mean(1)), 1e-9)
mus = mb_c * mg * (10 ** (DUCK_DB * duck / 20))[:, None]
tail = np.clip((np.arange(N) / SR - (WD[-1]['e'] + .25)) / .6, 0, 1); mus *= (10 ** (3.0 * tail / 20))[:, None]   # outro lift once he stops
fx = (carve(sfx, .45) + carve(acc, .3)) * (vr / .2) * (10 ** (-5 * duck / 20))[:, None]
voice = st(vo, 0) * np.sqrt(2)                                  # centred, same level in both channels
mix = voice + mus + fx
# report on every spoken word (before master; master is uniform gain + gentle dynamics)
seps = []
for w in WD:
    a, b2 = int(w['s'] * SR), int(w['e'] * SR)
    if b2 - a < int(.08 * SR): continue
    seps.append(db(rms(vo[a:b2])) - db(rms((mus[a:b2] + fx[a:b2]).mean(1))))
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
       'voice_over_music+sfx_dB_per_word': {'median': round(float(np.median(seps)), 1), 'p10': round(float(np.percentile(seps, 10)), 1), 'min': round(float(seps.min()), 1), 'words': int(len(seps))},
       'music_gap_vs_voice_dB': GAP_DB, 'music_duck_while_speaking_dB': DUCK_DB, 'bpm': BPM, 'styles': STY, 'stereo': True,
       'chain': 'voice dry/centred; music: 1.2-4.5 kHz carve (static + voice-keyed), kick sidechain pump, 1.5 s plate on music only; master: tanh saturation, 1.8:1 glue, oversampled limiter, 2-pass loudnorm'}
wavfile.write('audio/music_stem.wav', SR, (np.clip(mus / max(1e-9, np.abs(mix).max()) * .9, -1, 1) * 32767).astype('int16'))
json.dump(rep, open('audio/mix-report.json', 'w'), indent=1); print(json.dumps(rep, indent=1))
