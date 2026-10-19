# Score + SFX + voice chain for "You're being shot right now". Voice = the stitched English avatar audio (audio/voice.wav).
# Score ("cloud chamber"): 126 BPM in E minor from frame 0 (kick + sub-bass pulse with sidechain pump, 16th hats), a constant faint
# cloud-chamber crackle, a chord pad that changes per scene (Em C G D ...), half-time feel inside the Earth and the palm,
# a riser into the air shower and into the galaxy, Geiger clicks wherever decays are on screen (a sonification, ~60/s, not the
# real 4,000/s which would be a buzz), and a bright major lift under the CTA after the last word. No lead line in the speech
# band; ducked by voice activity with a 1.2-4.5 kHz carve. SFX land on the page's own events (audio/events.json, site/events.mjs).
# Master -14 LUFS / -1.5 dBTP (2-pass loudnorm) + mix report (voice over music+SFX on 250 ms windows inside word spans).
# Run: python3 audio.py
import numpy as np, soundfile as sf, subprocess, json, re, os
from scipy.signal import butter, sosfilt
H = os.path.dirname(os.path.abspath(__file__)); os.chdir(H)
SR = 48000; UI = '../../../assets/sfx/uisfx/sounds/'
TMJ = json.loads(open('site/timing.js', encoding='utf8').read().split('=', 1)[1].rstrip(';\n'))
END = TMJ['END']; S = TMJ['S']; CUE = TMJ['CUE']
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/voice.wav', '-af',
 'highpass=f=85,equalizer=f=260:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=4,alimiter=limit=0.9',
 '-ar', str(SR), '-ac', '1', 'audio/voice_fx.wav'])
v, _ = sf.read('audio/voice_fx.wav'); v = v if v.ndim == 1 else v.mean(1)
N = int(END * SR); voice = np.zeros(N); voice[:min(N, len(v))] = v[:N]
t = np.arange(N) / SR; rng = np.random.default_rng(4)
def env(a, b, x): return np.clip((x - a) / (b - a), 0, 1)
def gate(a, b, f=.15): return env(a - f, a + f, t) * (1 - env(b - f, b + f, t))
def add(buf, at, x, g=1.0):
    i = int(at * SR)
    if i < 0 or i >= N: return
    L = min(len(x), N - i); buf[i:i + L] += x[:L] * g
def mtf(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, f): return sosfilt(butter(2, f, fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)
def kick(g=1.0):
    x = np.arange(int(.35 * SR)) / SR; return g * np.sin(2 * np.pi * np.cumsum(48 + 140 * np.exp(-x * 35)) / SR) * np.exp(-x * 9)
def hat(d=.04):
    L = int(d * SR); return hp(rng.standard_normal(L), 8000) * np.exp(-np.arange(L) / SR * 120)
def click():   # Geiger-tube click: a sharp broadband tick with a short ring
    L = int(.012 * SR); x = np.arange(L) / SR; return (rng.standard_normal(L) * np.exp(-x * 900) + np.sin(2 * np.pi * 3100 * x) * np.exp(-x * 500) * .6)
BPM = 126; beat = 60 / BPM
# chord per scene (E minor world; lifts to E major under the CTA)
CH = [[40, 52, 55, 59], [36, 48, 52, 55], [43, 50, 55, 59], [38, 50, 54, 57], [40, 52, 55, 59], [36, 52, 55, 60], [43, 55, 59, 62], [38, 54, 57, 62], [40, 52, 56, 59], [40, 52, 56, 59]]
pad = np.zeros(N); bass = np.zeros(N); drums = np.zeros(N); hats = np.zeros(N); fx = np.zeros(N); crackle = np.zeros(N); geig = np.zeros(N); cta = np.zeros(N)
bnd = S + [END]
for i in range(len(S)):
    g = gate(bnd[i], bnd[i + 1], .12)
    for m in CH[i][1:]:
        f = mtf(m); pad += (np.sin(2 * np.pi * f * t + .3 * np.sin(t * .7 + m)) + .3 * np.sin(2 * np.pi * 2 * f * t)) * g * .09
pad = lp(pad, 900)
half = lambda a: (S[2] - .05 <= a < S[3] - .05) or (S[4] - .05 <= a < S[6] - .05)
a = 0.0; k = 0
while a < END - .2:
    sc = max(i for i in range(len(S)) if S[i] <= a + 1e-6); root = mtf(CH[sc][0] + 12)
    if not half(a) or k % 4 == 0:
        if k % 2 == 0: add(drums, a, kick(), .9)
    if k % 2 == 1: add(bass, a, np.sin(2 * np.pi * root * np.arange(int(beat / 2 * SR)) / SR) * np.exp(-np.arange(int(beat / 2 * SR)) / SR * 6), .5)
    a += beat / 2; k += 1
a = 0.0; k = 0
while a < END - .2:
    add(hats, a, hat(), .25 if k % 4 == 2 else .12); a += beat / 4; k += 1
# sidechain pump from the kick on bass + pad
kenv = np.zeros(N); a = 0.0
while a < END: i = int(a * SR); L = min(int(.3 * SR), N - i); kenv[i:i + L] = np.maximum(kenv[i:i + L], np.exp(-np.arange(L) / SR * 10)); a += beat
pump = 1 - .55 * kenv
# risers into the shower and the galaxy; sub drop on the hook
def riser(a0, a1, g):
    x = np.arange(int((a1 - a0) * SR)) / SR; add(fx, a0, hp(rng.standard_normal(len(x)), 2500) * (x / x[-1]) ** 2.4, g)
riser(CUE['cosmic'] - .6, CUE['smash'], .35); riser(CUE['racing'] - .9, CUE['k800'], .3)
x = np.arange(int(1.2 * SR)) / SR; add(fx, 0, np.sin(2 * np.pi * np.cumsum(70 * np.exp(-x * 1.5) + 30) / SR) * np.exp(-x * 2.2), .7)
# cloud-chamber crackle (constant, sparse) and Geiger clicks where decays are on screen
for at in np.sort(rng.uniform(0, END, int(END * 9))): add(crackle, at, click(), .05 * rng.uniform(.3, 1))
for a0, a1, rate in ((S[5], S[7], 60), (S[9], CUE['follow'], 22)):
    for at in np.sort(rng.uniform(a0, a1, int((a1 - a0) * rate))): add(geig, at, click(), .22 * rng.uniform(.4, 1))
# CTA: bright E-major bell arpeggio after the last word only
mel = [64, 68, 71, 76, 71, 68]; a = CUE['last'] + .06; j = 0
while a < END - .3:
    x = np.arange(int(.35 * SR)) / SR; add(cta, a, (np.sin(2 * np.pi * mtf(mel[j % 6]) * x) + .4 * np.sin(2 * np.pi * 2 * mtf(mel[j % 6]) * x)) * np.exp(-x * 7), .22); a += beat / 2; j += 1
act = np.abs(voice); kk = int(.1 * SR); sm = np.convolve(act, np.ones(kk) / kk, 'same'); on = (sm > 0.01).astype(float)
k2 = int(.22 * SR); duck = np.clip(np.convolve(on, np.ones(k2) / k2, 'same') * 2.2, 0, 1)
music = ((pad * .9 + bass * .6) * pump + drums * (1 - .4 * duck) + hats + fx + crackle + geig * (1 - .35 * duck) + cta)
music *= env(0, .02, t) * (1 - env(END - .4, END, t))
music = sosfilt(butter(2, [1200, 4500], 'bandstop', fs=SR, output='sos'), music)
music *= 10 ** ((-2 - 15 * duck) / 20)
# ---- SFX on the page's events -----------------------------------------------------------------------------------------------------
sfx = np.zeros(N)
def sample(name):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', UI + name + '.mp3', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).astype(float)
SMP = {k: sample(n) for k, n in dict(pop='cinematic/press', chime='cinematic/success', pulse='cinematic/processing').items()}
def noise_sweep(d=.38, lo=400, hi=5000):
    L = int(d * SR); x = rng.standard_normal(L); e = np.sin(np.linspace(0, np.pi, L)) ** 2; out = np.zeros(L); sg = L // 8
    for i in range(8):
        f = lo + (hi - lo) * i / 7; s = slice(i * sg, (i + 1) * sg if i < 7 else L)
        out[s] = sosfilt(butter(2, [max(80, f * .6), min(20000, f * 1.6)], 'bandpass', fs=SR, output='sos'), x)[s]
    return out * e
def hit(f=55, g=1.0, d=.6):
    x = np.arange(int(d * SR)) / SR; return g * (np.sin(2 * np.pi * (f + 110 * np.exp(-x * 40)) * x) * np.exp(-x * 7) + rng.standard_normal(len(x)) * np.exp(-x * 60) * .5)
def tick():
    x = np.arange(int(.03 * SR)) / SR; return np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 160)
def buzz():   # a Geiger tube near a source: clicks crowding into a buzz for 0.5 s
    out = np.zeros(int(.6 * SR))
    for at in np.sort(rng.uniform(0, .55, 70)): i = int(at * SR); c = click(); out[i:i + len(c)] += c[:len(out) - i]
    return out * np.minimum(1, np.arange(len(out)) / SR * 8)
def thuds():  # bananas landing in the dish: soft low knocks, denser then sparser
    out = np.zeros(int(3.2 * SR))
    for at in np.sort(rng.beta(1.6, 3, 34) * 3.0):
        i = int(at * SR); x = np.arange(int(.12 * SR)) / SR; y = lp(rng.standard_normal(len(x)), 500) * np.exp(-x * 40) + np.sin(2 * np.pi * 120 * x) * np.exp(-x * 30) * .6
        out[i:i + len(y)] += y[:len(out) - i] * rng.uniform(.4, 1)
    return out
FX = dict(whoosh=lambda: noise_sweep(.42), swish=lambda: noise_sweep(.26, 800, 7000), boom=lambda: hit(46, 1.0, 1.0), hit=lambda: hit(62, .8, .5),
          tick=tick, riser=lambda: noise_sweep(.7, 300, 8000), geiger=lambda: click() * 3, geigerbuzz=buzz, thuds=thuds)
GAIN = dict(whoosh=.35, swish=.16, boom=.8, hit=.6, tick=.25, riser=.3, geiger=1.0, geigerbuzz=.7, thuds=.8, pop=.5, chime=.45, pulse=.3)
ev = json.load(open('audio/events.json'))
for at, kind in ev:
    x = SMP[kind] if kind in SMP else FX[kind]() if kind in FX else None
    if x is None: print('no sound for', kind); continue
    add(sfx, at - (.2 if kind in ('whoosh', 'swish') else .5 if kind == 'riser' else 0), x, GAIN.get(kind, .5))
sfx *= 10 ** (-11 / 20)
sfx *= 10 ** ((-14 * duck) / 20)
mix = voice + music + sfx
sf.write('audio/premix.wav', mix, SR)
p1 = subprocess.run(['ffmpeg', '-i', 'audio/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
q = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', p1, re.S).group(0))
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (q['input_i'], q['input_tp'], q['input_lra'], q['input_thresh'], q['target_offset']), '-ar', '48000', '-ac', '2', 'audio/mix.wav'])
WS = json.load(open('avatar/words.json', encoding='utf8'))['words']; inw = np.zeros(N, bool)
for _, _, a0, a1 in WS: inw[int(a0 * SR):int(a1 * SR)] = True
on = on * inw; fr = int(.05 * SR); w4 = []; mv = []; tw = []
for i in range(N // (fr * 5)):
    sl = slice(i * fr * 5, (i + 1) * fr * 5)
    if on[sl].mean() > .9:
        a = np.sqrt(np.mean(voice[sl] ** 2)); w4.append(20 * np.log10(a / (np.sqrt(np.mean((music + sfx)[sl] ** 2)) + 1e-9))); mv.append(20 * np.log10(a / (np.sqrt(np.mean(music[sl] ** 2)) + 1e-9))); tw.append(i * .25)
print('worst', sorted(zip([round(x, 1) for x in w4], tw))[:8])
rep = {'windows': len(w4), 'median_250ms_db': round(float(np.median(w4)), 1), 'min_250ms_db': round(float(np.min(w4)), 1), 'music_only_median_db': round(float(np.median(mv)), 1), 'music_only_min_db': round(float(np.min(mv)), 1)}
j = subprocess.run(['ffmpeg', '-i', 'audio/mix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
lj = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', j, re.S).group(0)); rep['LUFS'] = lj['input_i']; rep['TP'] = lj['input_tp']
json.dump(rep, open('audio/mix-report.json', 'w'), indent=1); print(rep)
