# Score + SFX + voice chain for the battery roast. Voice = avatar audio (audio/voice_<v>.wav).
# Score: a playful "kitchen" groove (marimba bass + snaps) that gets hotter rung by rung (shaker at MED, brass stabs at OVEN,
# a riser and a low hit into ROAST), then flips to a cool glassy pad + glockenspiel for the fix and a bright reprise on the CTA.
# Ducked by voice activity with a 1.2-4.5 kHz carve. SFX land on the page's own events (audio/events.json, from site/events.mjs),
# mixing synth hits with CC0 UI samples (assets/sfx/uisfx). Master -14 LUFS / -1.5 dBTP (2-pass loudnorm) + mix report.
# Run: python3 audio.py en
import numpy as np, soundfile as sf, subprocess, json, re, sys, os
from scipy.signal import butter, sosfilt
V = sys.argv[1] if len(sys.argv) > 1 else 'en'
SR = 48000; UI = '../../../assets/sfx/uisfx/sounds/'
tm = open('site/timing.js', encoding='utf8').read(); TMJ = json.loads(tm.split('=', 1)[1].rstrip(';\n'))
END = TMJ['END']; S = TMJ['S']; CUE = TMJ['CUE']
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', f'audio/voice_{V}.wav', '-af',
 'highpass=f=85,equalizer=f=260:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=4,alimiter=limit=0.9',
 '-ar', str(SR), '-ac', '1', 'audio/voice_fx.wav'])
v, _ = sf.read('audio/voice_fx.wav'); v = v if v.ndim == 1 else v.mean(1)
N = int(END * SR); voice = np.zeros(N); voice[:min(N, len(v))] = v[:N]
t = np.arange(N) / SR; rng = np.random.default_rng(5)
def env(a, b, x): return np.clip((x - a) / (b - a), 0, 1)
def gate(a, b, f=.15): return env(a - f, a + f, t) * (1 - env(b - f, b + f, t))
def add(buf, at, x, g=1.0):
    i = int(at * SR)
    if i < 0 or i >= N: return
    L = min(len(x), N - i); buf[i:i + L] += x[:L] * g
def mtf(m): return 440 * 2 ** ((m - 69) / 12)
def marimba(f, d=.5):
    x = np.arange(int(d * SR)) / SR; return (np.sin(2 * np.pi * f * x) + .35 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 9)
def glock(f, d=1.2):
    x = np.arange(int(d * SR)) / SR; return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x * 8)) * np.exp(-x * 4)
def snap():
    L = int(.07 * SR); x = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 90); return sosfilt(butter(2, [1500, 6000], 'bandpass', fs=SR, output='sos'), x)
def stab(f, d=.28):
    x = np.arange(int(d * SR)) / SR; w = sum(np.sin(2 * np.pi * f * k * x) / k for k in range(1, 9)); return sosfilt(butter(2, 1800, fs=SR, output='sos'), w) * np.exp(-x * 6) * np.minimum(1, x * 80)
BPM = 104; beat = 60 / BPM
heat_end = S[7]   # the fix: groove stops, cool section starts
mus = np.zeros(N); perc = np.zeros(N); brass = np.zeros(N); cool = np.zeros(N)
# hot groove: bass line per bar (Dm - Bb - C - A), snaps on 2 and 4
prog = [[38, 50, 45, 50], [34, 46, 41, 46], [36, 48, 43, 48], [33, 45, 40, 45]]
a = 0.0; k = 0
while a < heat_end - .05:
    bar = (k // 4) % 4; n = prog[bar][k % 4]
    add(mus, a, marimba(mtf(n + 12), .45), .55)
    if k % 2 == 1: add(perc, a, snap(), .5)
    if a >= S[3] - .05: add(perc, a + beat / 2, rng.standard_normal(int(.04 * SR)) * np.exp(-np.arange(int(.04 * SR)) / SR * 120) * .25)   # shaker from MED
    if a >= CUE['oven'] - .05 and k % 4 == 0: add(brass, a, stab(mtf(prog[bar][0] + 24)), .5); add(brass, a, stab(mtf(prog[bar][0] + 31)), .35)
    a += beat; k += 1
# riser into ROAST + low hit
r0, r1 = CUE['roasting'] - 1.6, CUE['roasting']
x = np.arange(int((r1 - r0) * SR)) / SR; rs = sosfilt(butter(2, 2500, fs=SR, output='sos'), rng.standard_normal(len(x))) * (x / x[-1]) ** 2
add(perc, r0, rs, .35)
# cool section: soft pad (F maj7 -> C) + glockenspiel arpeggio, then a bright marimba reprise on the CTA
pad = np.zeros(N)
for f, g in ((174.6, .25), (220, .2), (261.6, .18), (329.6, .14)):
    pad += np.sin(2 * np.pi * f * t + .3 * np.sin(t * .7 + f)) * g
pad *= gate(S[7] + .1, END, .5)
arp = [77, 81, 84, 88, 84, 81]; a = S[7] + .2; k = 0
while a < S[9] - .1: add(cool, a, glock(mtf(arp[k % 6] + 12)), .14); a += beat; k += 1
LASTW = json.load(open(f'avatar-{V}/words.json', encoding='utf8'))['words'][-1][3]
mel = [74, 77, 81, 79, 77, 74, 76, 77]; a = LASTW + .1; k = 0   # the reprise melody waits for the last word (no lead line under the voice)
b = S[9]
while b < LASTW: add(cool, b, marimba(mtf(50 if int((b - S[9]) / beat) % 2 else 45), .4), .3); b += beat
while a < END - 1.2:
    add(cool, a, marimba(mtf(mel[k % 8]), .4), .4)
    if k % 2 == 1: add(perc, a, snap(), .35)
    a += beat / 2 if k % 4 < 2 else beat; k += 1
hot = gate(-1, heat_end, .25)
music = (mus * .9 + perc * .6 + brass * .45) * hot + pad * .24 + cool
music *= env(0, .25, t) * (1 - env(END - 1.6, END, t))
music = sosfilt(butter(2, [1200, 4500], 'bandstop', fs=SR, output='sos'), music)
act = np.abs(voice); kk = int(.1 * SR); sm = np.convolve(act, np.ones(kk) / kk, 'same'); on = (sm > 0.01).astype(float)
k2 = int(.22 * SR); duck = np.clip(np.convolve(on, np.ones(k2) / k2, 'same') * 2.2, 0, 1)
music *= 10 ** ((-2 - 11 * duck) / 20)
# ---- SFX on the page's events ----------------------------------------------------------------------------------------
sfx = np.zeros(N)
def sample(name, g=1.0):
    p = UI + name + '.mp3'
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).astype(float) * g
SMP = {k: sample(n) for k, n in dict(boing='rubber/bonus', pop='rubber/press', party='arcade/achievement', check='arcade/check', toggle='mechanical/toggle-on',
                                       click='mechanical/press', slide='mechanical/drag-start', chime='glass/success', drop='rubber/drop').items()}
def noise_sweep(d=.38, lo=400, hi=5000):
    L = int(d * SR); x = rng.standard_normal(L); e = np.sin(np.linspace(0, np.pi, L)) ** 2
    out = np.zeros(L); seg = L // 8
    for i in range(8):
        f = lo + (hi - lo) * i / 7; s = slice(i * seg, (i + 1) * seg if i < 7 else L)
        out[s] = sosfilt(butter(2, [max(80, f * .6), min(20000, f * 1.6)], 'bandpass', fs=SR, output='sos'), x)[s]
    return out * e
def hit(f=55, g=1.0, d=.45):
    x = np.arange(int(d * SR)) / SR; return g * (np.sin(2 * np.pi * (f + 110 * np.exp(-x * 40)) * x) * np.exp(-x * 9) + rng.standard_normal(len(x)) * np.exp(-x * 60) * .5)
def sizzle(d=1.0):
    L = int(d * SR); x = sosfilt(butter(2, 3500, 'highpass', fs=SR, output='sos'), rng.standard_normal(L)); return x * (rng.random(L) > .7) * np.exp(-np.arange(L) / SR * 2.2)
def bell(f, d=.9):
    x = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * x) * np.exp(-x * 5) + .3 * np.sin(2 * np.pi * f * 3 * x) * np.exp(-x * 9)
def drain(d=.9):
    x = np.arange(int(d * SR)) / SR; f = 900 * np.exp(-x * 1.6); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 2.5)
FX = dict(whoosh=lambda: noise_sweep(.42), swish=lambda: noise_sweep(.26, 800, 7000), stamp=lambda: hit(60, 1.0), slam=lambda: hit(45, 1.0, .6), thud=lambda: hit(48, .9),
          slap=lambda: hit(90, .7, .3), sizzle=lambda: sizzle(1.2), ding=lambda: bell(1568), ding2=lambda: bell(1318), drain=lambda: drain(),
          tick=lambda: np.concatenate([bell(1800, .05)] * 1))
GAIN = dict(whoosh=.35, swish=.16, stamp=.75, slam=.8, thud=.55, slap=.55, sizzle=.35, ding=.3, ding2=.3, drain=.35, tick=.25,
            boing=.6, pop=.55, party=.55, check=.55, toggle=.6, click=.5, slide=.5, chime=.5, drop=.6)
ev = json.load(open('audio/events.json'))
for at, kind in ev:
    x = SMP[kind] if kind in SMP else FX[kind]() if kind in FX else None
    if x is None: print('no sound for', kind); continue
    lead = .2 if kind in ('whoosh', 'swish') else 0
    add(sfx, at - lead, x, GAIN.get(kind, .5))
for j in range(10): add(sfx, CUE['hours'] + j * .14, bell(1700, .05), .18)   # hours counter ticks
sfx *= 10 ** (-11 / 20)
sfx *= 10 ** ((-14 * duck) / 20)   # SFX step back under words so no hit masks a syllable
mix = voice + music + sfx
sf.write('audio/premix.wav', mix, SR)
p1 = subprocess.run(['ffmpeg', '-i', 'audio/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
q = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', p1, re.S).group(0))
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (q['input_i'], q['input_tp'], q['input_lra'], q['input_thresh'], q['target_offset']), '-ar', '48000', '-ac', '2', f'audio/mix_{V}.wav'])
# voice over music+SFX, measured on 50 ms frames inside transcribed word spans (breaths and pauses excluded)
WS = json.load(open(f'avatar-{V}/words.json', encoding='utf8'))['words']; inw = np.zeros(N, bool)
for _, _, a0, a1 in WS: inw[int(a0 * SR):int(a1 * SR)] = True
on = on * inw
fr = int(.05 * SR); vals = []; tv = []
for i in range(N // fr):
    sl = slice(i * fr, (i + 1) * fr); a = np.sqrt(np.mean(voice[sl] ** 2))
    if on[sl].mean() > .95 and a > 0.02: b = np.sqrt(np.mean((music + sfx)[sl] ** 2)) + 1e-9; vals.append(20 * np.log10(a / b)); tv.append(i * .05)
worst = sorted(zip(vals, tv))[:8]; print('worst', [(round(a, 1), round(b, 2)) for a, b in worst])
mv = []
for i in range(N // fr):
    sl = slice(i * fr, (i + 1) * fr); a = np.sqrt(np.mean(voice[sl] ** 2))
    if on[sl].mean() > .95 and a > 0.02: mv.append(20 * np.log10(a / (np.sqrt(np.mean(music[sl] ** 2)) + 1e-9)))
w4 = []
for i in range(N // (fr * 5)):
    sl = slice(i * fr * 5, (i + 1) * fr * 5)
    if on[sl].mean() > .9: w4.append(20 * np.log10(np.sqrt(np.mean(voice[sl] ** 2)) / (np.sqrt(np.mean((music + sfx)[sl] ** 2)) + 1e-9)))
rep = {'min_250ms_db': round(float(np.min(w4)), 1), 'music_only_median_db': round(float(np.median(mv)), 1), 'music_only_min_db': round(float(np.min(mv)), 1), 'median_db': round(float(np.median(vals)), 1), 'p5_db': round(float(np.percentile(vals, 5)), 1), 'min_db': round(float(np.min(vals)), 1)}
j = subprocess.run(['ffmpeg', '-i', f'audio/mix_{V}.wav', '-af', 'loudnorm=I=-14:TP=-1.5:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
lj = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', j, re.S).group(0)); rep['LUFS'] = lj['input_i']; rep['TP'] = lj['input_tp']
json.dump(rep, open(f'audio/mix-report_{V}.json', 'w'), indent=1); print(rep)
