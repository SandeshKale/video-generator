# Score + SFX + voice chain for the December box-office war reel. Voice = the stitched Hindi avatar audio (audio/voice_hi.wav).
# Score ("premiere night"): a trailer pulse in D (Phrygian-dominant drone, dhol-style low drum pattern, clock ticks under the
# 6-day countdown), a riser into the King reveal with a brass stab, full drums for the "war", a two-note horn swell on Dunesday,
# a warm major lift for King, a half-time heartbeat while the clapper hangs open and a hit + 0.3 s hole when it shuts, then a
# bright clap groove under the poll/CTA. No lead line in the speech band; ducked by voice activity with a 1.2-4.5 kHz carve.
# SFX land on the page's own events (audio/events.json from site/events.mjs): synth hits + CC0 "cinematic" UI samples (assets/sfx/uisfx).
# Master -14 LUFS / -1.5 dBTP (2-pass loudnorm) + mix report (voice over music+SFX on 250 ms windows inside word spans).
# Run: python3 audio.py
import numpy as np, soundfile as sf, subprocess, json, re, os
from scipy.signal import butter, sosfilt
H = os.path.dirname(os.path.abspath(__file__)); os.chdir(H)
SR = 48000; UI = '../../../assets/sfx/uisfx/sounds/'
TMJ = json.loads(open('site/timing.js', encoding='utf8').read().split('=', 1)[1].rstrip(';\n'))
END = TMJ['END']; S = TMJ['S']; CUE = TMJ['CUE']
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/voice_hi.wav', '-af',
 'highpass=f=85,equalizer=f=260:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=4,alimiter=limit=0.9',
 '-ar', str(SR), '-ac', '1', 'audio/voice_fx.wav'])
v, _ = sf.read('audio/voice_fx.wav'); v = v if v.ndim == 1 else v.mean(1)
N = int(END * SR); voice = np.zeros(N); voice[:min(N, len(v))] = v[:N]
t = np.arange(N) / SR; rng = np.random.default_rng(11)
def env(a, b, x): return np.clip((x - a) / (b - a), 0, 1)
def gate(a, b, f=.15): return env(a - f, a + f, t) * (1 - env(b - f, b + f, t))
def add(buf, at, x, g=1.0):
    i = int(at * SR)
    if i < 0 or i >= N: return
    L = min(len(x), N - i); buf[i:i + L] += x[:L] * g
def mtf(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, f): return sosfilt(butter(2, f, fs=SR, output='sos'), x)
def drum(f=62, d=.5, bend=70, dec=7):   # dhol-style low membrane
    x = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * np.cumsum(f + bend * np.exp(-x * 30)) / SR) * np.exp(-x * dec)
def slap(d=.12):                         # dhol treble side
    L = int(d * SR); x = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 45); return sosfilt(butter(2, [700, 3200], 'bandpass', fs=SR, output='sos'), x)
def tick():
    x = np.arange(int(.03 * SR)) / SR; return np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 160)
def clap():
    L = int(.12 * SR); x = rng.standard_normal(L) * (np.exp(-np.arange(L) / SR * 40) + .6 * np.exp(-np.maximum(0, np.arange(L) / SR - .012) * 60)); return sosfilt(butter(2, [900, 5000], 'bandpass', fs=SR, output='sos'), x)
def brass(fs, d=.6):
    x = np.arange(int(d * SR)) / SR; w = sum(sum(np.sin(2 * np.pi * f * k * x) / k for k in range(1, 10)) for f in fs)
    return lp(w, 1600) * np.minimum(1, x * 30) * np.exp(-x * 3.2)
def horn(f, d=1.6):
    x = np.arange(int(d * SR)) / SR; w = sum(np.sin(2 * np.pi * f * k * x + .2 * np.sin(x * 5)) / k for k in range(1, 8))
    return lp(w, 900) * np.sin(np.pi * np.minimum(1, x / d)) ** 1.5
BPM = 96; beat = 60 / BPM
drone = np.zeros(N); drums = np.zeros(N); ticks = np.zeros(N); stabs = np.zeros(N); lift = np.zeros(N); cta = np.zeros(N)
# drone: D + A, with the Phrygian-dominant colour (Eb, F#) fading in and out slowly; warm D major lift from King onwards
for f, g in ((73.4, .30), (110, .22), (146.8, .12)):
    drone += np.sin(2 * np.pi * f * t + .4 * np.sin(t * .5 + f)) * g
drone += (np.sin(2 * np.pi * 155.6 * t) * .07 + np.sin(2 * np.pi * 185 * t) * .06) * (.5 + .5 * np.sin(t * .4))
drone = lp(drone, 700)
for f, g in ((146.8, .14), (185, .12), (220, .11), (293.7, .07)): lift += np.sin(2 * np.pi * f * t + .3 * np.sin(t * .6 + f)) * g
lift = lp(lift, 1100) * gate(S[4] + .2, S[6], .5)
# dhol pattern: DHA . na DHA | . na DHA na  (8th notes), full from the "war" line, sparse before it
pat = [1, 0, 2, 1, 0, 2, 1, 2]
a = 0.0; k = 0
while a < END - 1.0:
    hook = a < S[1] - .05; held = S[6] - .05 <= a < S[7] - .05
    p = pat[k % 8]
    if held:
        if k % 4 == 0: add(drums, a, drum(52, .4, 40, 9), .8); add(drums, a + .16, drum(50, .35, 30, 10), .5)   # heartbeat
    elif hook:
        if k % 4 == 0: add(drums, a, drum(), .75)
        if a < CUE['king'] - .05: add(ticks, a, tick(), .5)
    else:
        if p == 1: add(drums, a, drum(), .85)
        if p == 2: add(drums, a, slap(), .38)
        if a >= S[7] - .05 and k % 4 == 2: add(cta, a, clap(), .5)
    a += beat / 2; k += 1
# riser into the King reveal, stab on "किंग", war hits, Dunesday horns, King stab, clapper hit
r0, r1 = CUE['srk'] - 1.3, CUE['king']
x = np.arange(int((r1 - r0) * SR)) / SR; add(stabs, r0, sosfilt(butter(2, 3000, fs=SR, output='sos'), rng.standard_normal(len(x))) * (x / x[-1]) ** 2.2, .3)
add(stabs, CUE['king'], brass([mtf(50), mtf(57), mtf(62)], .9), .45)
add(stabs, S[2] - .34, brass([mtf(50), mtf(53), mtf(57)], .7), .4)
add(stabs, CUE['dune'], horn(mtf(38)), .33); add(stabs, CUE['aveng2'], horn(mtf(41)), .33)
add(stabs, CUE['king2'], brass([mtf(50), mtf(54), mtf(57)], 1.1), .45)
LASTW = CUE['last']
mel = [62, 66, 69, 74, 69, 66]; a = LASTW + .08; j = 0       # bright arpeggio only after the last word
while a < END - .3: add(cta, a, brass([mtf(mel[j % 6])], .3), .22); a += beat / 2; j += 1
hole = 1 - gate(CUE['change'] + .02, CUE['change'] + .32, .03)
act = np.abs(voice); kk = int(.1 * SR); sm = np.convolve(act, np.ones(kk) / kk, 'same'); on = (sm > 0.01).astype(float)
k2 = int(.22 * SR); duck = np.clip(np.convolve(on, np.ones(k2) / k2, 'same') * 2.2, 0, 1)
music = (drone * .55 + drums * .9 * (1 - .45 * duck) + ticks * .35 + stabs + lift * .28 + cta) * hole
music *= env(0, .05, t) * (1 - env(END - .5, END, t))
music = sosfilt(butter(2, [1200, 4500], 'bandstop', fs=SR, output='sos'), music)
music *= 10 ** ((-4 - 15 * duck) / 20)
# ---- SFX on the page's events -----------------------------------------------------------------------------------------------------
sfx = np.zeros(N)
def sample(name):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', UI + name + '.mp3', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'])
    return np.frombuffer(raw, np.float32).astype(float)
SMP = {k: sample(n) for k, n in dict(pop='cinematic/press', flag='cinematic/drop', chime='cinematic/success', cash='cinematic/purchase', clapx='cinematic/lock',
                                       flip='cinematic/swipe', roll='cinematic/processing').items()}
def noise_sweep(d=.38, lo=400, hi=5000):
    L = int(d * SR); x = rng.standard_normal(L); e = np.sin(np.linspace(0, np.pi, L)) ** 2; out = np.zeros(L); sg = L // 8
    for i in range(8):
        f = lo + (hi - lo) * i / 7; s = slice(i * sg, (i + 1) * sg if i < 7 else L)
        out[s] = sosfilt(butter(2, [max(80, f * .6), min(20000, f * 1.6)], 'bandpass', fs=SR, output='sos'), x)[s]
    return out * e
def hit(f=55, g=1.0, d=.6):
    x = np.arange(int(d * SR)) / SR; return g * (np.sin(2 * np.pi * (f + 110 * np.exp(-x * 40)) * x) * np.exp(-x * 7) + rng.standard_normal(len(x)) * np.exp(-x * 60) * .5)
def woodclap():
    L = int(.09 * SR); x = rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 70); return sosfilt(butter(2, [1200, 6000], 'bandpass', fs=SR, output='sos'), x) * 1.6
def rope():
    x = np.arange(int(.5 * SR)) / SR; return lp(rng.standard_normal(len(x)), 900) * np.exp(-x * 5) * (1 + .5 * np.sin(x * 60))
FX = dict(whoosh=lambda: noise_sweep(.42), swish=lambda: noise_sweep(.26, 800, 7000), boom=lambda: hit(48, 1.0, .9), stamp=lambda: hit(62, .9),
          drum=lambda: drum(58, .6, 80, 5), tick=lambda: tick(), clap=lambda: np.concatenate([woodclap(), np.zeros(int(.02 * SR))]) + 0, rope=rope)
GAIN = dict(whoosh=.35, swish=.16, boom=.8, stamp=.7, drum=.7, tick=.22, clap=1.0, rope=.4, pop=.5, flag=.45, chime=.45, cash=.55, clapx=.5, flip=.45, roll=.35)
ev = json.load(open('audio/events.json'))
for at, kind in ev:
    x = SMP[kind] if kind in SMP else FX[kind]() if kind in FX else None
    if x is None: print('no sound for', kind); continue
    add(sfx, at - (.2 if kind in ('whoosh', 'swish') else 0), x, GAIN.get(kind, .5))
    if kind == 'clap': add(sfx, at, SMP['clapx'], .45); add(sfx, at + .03, hit(52, .9, .8), .7)
sfx *= 10 ** (-11 / 20)
sfx *= 10 ** ((-14 * duck) / 20)
mix = voice + music + sfx
sf.write('audio/premix.wav', mix, SR)
p1 = subprocess.run(['ffmpeg', '-i', 'audio/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
q = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', p1, re.S).group(0))
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (q['input_i'], q['input_tp'], q['input_lra'], q['input_thresh'], q['target_offset']), '-ar', '48000', '-ac', '2', 'audio/mix_hi.wav'])
WS = json.load(open('avatar/words.json', encoding='utf8'))['words']; inw = np.zeros(N, bool)
for _, _, a0, a1 in WS: inw[int(a0 * SR):int(a1 * SR)] = True
on = on * inw; fr = int(.05 * SR); w4 = []; mv = []
for i in range(N // (fr * 5)):
    sl = slice(i * fr * 5, (i + 1) * fr * 5)
    if on[sl].mean() > .9:
        a = np.sqrt(np.mean(voice[sl] ** 2)); w4.append(20 * np.log10(a / (np.sqrt(np.mean((music + sfx)[sl] ** 2)) + 1e-9))); mv.append(20 * np.log10(a / (np.sqrt(np.mean(music[sl] ** 2)) + 1e-9)))
tw=[i*.25 for i in range(N // (fr * 5)) if on[slice(i*fr*5,(i+1)*fr*5)].mean() > .9]; print('worst', sorted(zip([round(x,1) for x in w4], tw))[:10])
rep = {'windows': len(w4), 'median_250ms_db': round(float(np.median(w4)), 1), 'min_250ms_db': round(float(np.min(w4)), 1), 'music_only_median_db': round(float(np.median(mv)), 1), 'music_only_min_db': round(float(np.min(mv)), 1)}
j = subprocess.run(['ffmpeg', '-i', 'audio/mix_hi.wav', '-af', 'loudnorm=I=-14:TP=-1.5:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
lj = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', j, re.S).group(0)); rep['LUFS'] = lj['input_i']; rep['TP'] = lj['input_tp']
json.dump(rep, open('audio/mix-report.json', 'w'), indent=1); print(rep)
