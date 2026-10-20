# Score + SFX + voice chain for "A judge just told the internet: take her face down" (serious tabloid-court tone, R18).
# Run: python3 audio.py en|hi     (voice = the stitched avatar audio of that language; timing = site/timing_<v>.js; events = audio/events_<v>.json)
# Score: 92 BPM in D minor: a low drone + slow bass pulse, a dry rim-click pulse like a typewriter, a minor-pad chord per scene, a riser into the strike,
# a gavel crack + sub thump on the order, rubber-stamp thuds, then a small warm lift under the CTA after the last word. No lead line in the speech band;
# ducked by voice activity with a 1.2-4.5 kHz carve. SFX land on the page's own events (site/events.mjs). Master -14 LUFS / -1.5 dBTP (2-pass loudnorm)
# + a mix report (voice over music+SFX on 250 ms windows inside word spans).
import numpy as np, soundfile as sf, subprocess, json, re, os, sys
from scipy.signal import butter, sosfilt
V = sys.argv[1] if len(sys.argv) > 1 else 'en'
H = os.path.dirname(os.path.abspath(__file__)); os.chdir(H)
SR = 48000; UI = '../../../assets/sfx/uisfx/sounds/'
TMJ = json.loads(open(f'site/timing_{V}.js', encoding='utf8').read().split('=', 1)[1].rstrip(';\n'))
END = TMJ['END']; S = TMJ['S']; CUE = TMJ['CUE']
VF = 'audio/voice.wav' if V == 'en' else 'audio/voice_hi.wav'
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', VF, '-af',
 'highpass=f=85,equalizer=f=260:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=4,alimiter=limit=0.9',
 '-ar', str(SR), '-ac', '1', f'audio/voice_fx_{V}.wav'])
v, _ = sf.read(f'audio/voice_fx_{V}.wav'); v = v if v.ndim == 1 else v.mean(1)
N = int(END * SR); voice = np.zeros(N); voice[:min(N, len(v))] = v[:N]
t = np.arange(N) / SR; rng = np.random.default_rng(20)
def env(a, b, x): return np.clip((x - a) / (b - a), 0, 1)
def gate(a, b, f=.15): return env(a - f, a + f, t) * (1 - env(b - f, b + f, t))
def add(buf, at, x, g=1.0):
    i = int(at * SR)
    if i < 0 or i >= N: return
    L = min(len(x), N - i); buf[i:i + L] += x[:L] * g
def mtf(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, f): return sosfilt(butter(2, f, fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)
def click(d=.03, f=2200):
    x = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * x) * np.exp(-x * 170) + rng.standard_normal(len(x)) * np.exp(-x * 220) * .3
def thump(f=50, d=.7, dec=6):
    x = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * np.cumsum(f + 90 * np.exp(-x * 40)) / SR) * np.exp(-x * dec)
BPM = 92; beat = 60 / BPM
CH = [[38, 50, 53, 57], [38, 50, 53, 57], [34, 46, 50, 53], [36, 48, 52, 55], [31, 43, 47, 50], [38, 50, 53, 57], [34, 46, 50, 55], [38, 50, 54, 57], [38, 50, 54, 57]]
pad = np.zeros(N); bass = np.zeros(N); pulse = np.zeros(N); fx = np.zeros(N); cta = np.zeros(N)
bnd = S + [END]
for i in range(len(S)):
    g = gate(bnd[i], bnd[i + 1], .12)
    for m in CH[min(i, len(CH) - 1)][1:]:
        f = mtf(m); pad += (np.sin(2 * np.pi * f * t + .3 * np.sin(t * .6 + m)) + .25 * np.sin(2 * np.pi * 2 * f * t)) * g * .08
pad = lp(pad, 850)
a = 0.0; k = 0
while a < END - .2:
    sc = max(i for i in range(len(S)) if S[i] <= a + 1e-6); root = mtf(CH[min(sc, len(CH) - 1)][0])
    if k % 4 == 0: add(bass, a, np.sin(2 * np.pi * root * np.arange(int(beat * 1.6 * SR)) / SR) * np.exp(-np.arange(int(beat * 1.6 * SR)) / SR * 2.2), .55)
    if k % 2 == 1: add(pulse, a, click(.025, 3200), .16)
    a += beat / 2; k += 1
kenv = np.zeros(N); a = 0.0
while a < END: i = int(a * SR); L = min(int(.4 * SR), N - i); kenv[i:i + L] = np.maximum(kenv[i:i + L], np.exp(-np.arange(L) / SR * 8)); a += beat * 2
pump = 1 - .3 * kenv
def riser(a0, a1, g):
    x = np.arange(int((a1 - a0) * SR)) / SR; add(fx, a0, hp(rng.standard_normal(len(x)), 2200) * (x / x[-1]) ** 2.2, g)
riser(CUE['interim'] - .6, CUE['remove'] - .08, .3); riser(CUE['cloned'] - .5, CUE['cloned'] + .1, .22)
mel = [62, 65, 69, 74, 69, 65]; a = CUE['last'] + .06; j = 0
while a < END - .3:
    x = np.arange(int(.4 * SR)) / SR; fq = mtf(mel[j % 6]); add(cta, a, (np.sin(2 * np.pi * fq * x) + .35 * np.sin(2 * np.pi * 2 * fq * x)) * np.exp(-x * 6), .2); a += beat / 2; j += 1
act = np.abs(voice); kk = int(.1 * SR); sm = np.convolve(act, np.ones(kk) / kk, 'same'); on = (sm > 0.01).astype(float)
k2 = int(.22 * SR); duck = np.clip(np.convolve(on, np.ones(k2) / k2, 'same') * 2.2, 0, 1)
music = (pad * .9 + bass * .55) * pump + pulse * (1 - .5 * duck) + fx + cta
music *= env(0, .02, t) * (1 - env(END - .4, END, t))
music = sosfilt(butter(2, [1200, 4500], 'bandstop', fs=SR, output='sos'), music)
music *= 10 ** ((3 - 15 * duck) / 20)
sfx = np.zeros(N)
def sample(name):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', UI + name + '.mp3', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).astype(float)
SMP = {k: sample(n) for k, n in dict(pop='cinematic/press', chime='cinematic/success').items()}
def noise_sweep(d=.38, lo=400, hi=5000):
    L = int(d * SR); x = rng.standard_normal(L); e = np.sin(np.linspace(0, np.pi, L)) ** 2; out = np.zeros(L); sg = L // 8
    for i in range(8):
        f = lo + (hi - lo) * i / 7; s = slice(i * sg, (i + 1) * sg if i < 7 else L)
        out[s] = sosfilt(butter(2, [max(80, f * .6), min(20000, f * 1.6)], 'bandpass', fs=SR, output='sos'), x)[s]
    return out * e
def stampfx():   # rubber stamp: a dull wooden thud + a soft paper slap
    x = np.arange(int(.35 * SR)) / SR; return thump(70, .35, 14) * 1.2 + lp(rng.standard_normal(len(x)), 1800) * np.exp(-x * 40) * .5
def gavel():     # hard wood crack + body thump
    x = np.arange(int(.9 * SR)) / SR; crack = sosfilt(butter(2, [900, 5000], 'bandpass', fs=SR, output='sos'), rng.standard_normal(len(x))) * np.exp(-x * 60)
    return crack * 1.5 + thump(62, .9, 7) * 1.1 + np.sin(2 * np.pi * 420 * x) * np.exp(-x * 25) * .3
FX = dict(whoosh=lambda: noise_sweep(.42), swish=lambda: noise_sweep(.26, 800, 7000), boom=lambda: thump(46, 1.0, 5) * 1.2, stamp=stampfx, strike=gavel,
          tick=lambda: click(.03, 2400), riser=lambda: noise_sweep(.7, 300, 8000))
GAIN = dict(whoosh=.35, swish=.16, boom=.8, stamp=.75, strike=.95, tick=.25, riser=.3, pop=.5, chime=.45)
ev = json.load(open(f'audio/events_{V}.json'))
for at, kind in ev:
    x = SMP[kind] if kind in SMP else FX[kind]() if kind in FX else None
    if x is None: print('no sound for', kind); continue
    add(sfx, at - (.2 if kind in ('whoosh', 'swish') else .5 if kind == 'riser' else 0), x, GAIN.get(kind, .5))
sfx *= 10 ** (-11 / 20)
sfx *= 10 ** ((-14 * duck) / 20)
mix = voice + music + sfx
sf.write(f'audio/premix_{V}.wav', mix, SR)
p1 = subprocess.run(['ffmpeg', '-i', f'audio/premix_{V}.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
q = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', p1, re.S).group(0))
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', f'audio/premix_{V}.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (q['input_i'], q['input_tp'], q['input_lra'], q['input_thresh'], q['target_offset']), '-ar', '48000', '-ac', '2', f'audio/mix_{V}.wav'])
# voiced windows from the clip's own speech (Whisper English words, or energy for Hindi, where Whisper text is unreliable)
inw = on > 0
on = on * inw; fr = int(.05 * SR); w4 = []; mv = []; tw = []
for i in range(N // (fr * 5)):
    sl = slice(i * fr * 5, (i + 1) * fr * 5)
    if on[sl].mean() > .9:
        a = np.sqrt(np.mean(voice[sl] ** 2)); w4.append(20 * np.log10(a / (np.sqrt(np.mean((music + sfx)[sl] ** 2)) + 1e-9))); mv.append(20 * np.log10(a / (np.sqrt(np.mean(music[sl] ** 2)) + 1e-9))); tw.append(i * .25)
print('worst', sorted(zip([round(x, 1) for x in w4], tw))[:8])
rep = {'windows': len(w4), 'median_250ms_db': round(float(np.median(w4)), 1), 'min_250ms_db': round(float(np.min(w4)), 1), 'music_only_median_db': round(float(np.median(mv)), 1), 'music_only_min_db': round(float(np.min(mv)), 1)}
j = subprocess.run(['ffmpeg', '-i', f'audio/mix_{V}.wav', '-af', 'loudnorm=I=-14:TP=-1.5:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
lj = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', j, re.S).group(0)); rep['LUFS'] = lj['input_i']; rep['TP'] = lj['input_tp']
json.dump(rep, open(f'audio/mix-report_{V}.json', 'w'), indent=1); print(rep)
