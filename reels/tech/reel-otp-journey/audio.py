# Score + SFX + voice chain for "Your OTP lived minutes" (3D city, Hindi VO, no host). Run: python3 audio.py  (after: bun site/events.mjs)
# Score ("Monsoon Noir"): rain bed (eases after the CTA starts), D-minor sub drone + slow chord per chapter, a heartbeat sub pulse (84 BPM) while the code travels,
# a tense faster pulse + detuned drone in the scam chapter (R18: serious), a warm major lift under the CTA. No lead line in the speech band;
# voice-activity ducking + a 1.2-4.5 kHz carve. SFX land on the page's own events. Master -14 LUFS / -1.5 dBTP + a mix report (voiced 250 ms windows).
import numpy as np, soundfile as sf, subprocess, json, re, os
from scipy.signal import butter, sosfilt
H = os.path.dirname(os.path.abspath(__file__)); os.chdir(H)
SR = 48000; V = 'hi'; UI = '../../../assets/sfx/uisfx/sounds/'
TMJ = json.loads(open('site/timing.js', encoding='utf8').read().split('=', 1)[1].rstrip(';\n')); END = TMJ['END']
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/voice.wav', '-af',
 'highpass=f=85,equalizer=f=260:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=4,alimiter=limit=0.9',
 '-ar', str(SR), '-ac', '1', 'audio/voice_fx.wav'])
v, _ = sf.read('audio/voice_fx.wav'); v = v if v.ndim == 1 else v.mean(1)
N = int(END * SR); voice = np.zeros(N); voice[:min(N, len(v))] = v[:N]
t = np.arange(N) / SR; rng = np.random.default_rng(31)
def env(a, b, x): return np.clip((x - a) / (b - a), 0, 1)
def gate(a, b, f=.4): return env(a - f, a + f, t) * (1 - env(b - f, b + f, t))
def add(buf, at, x, g=1.0):
    i = int(at * SR)
    if i < 0 or i >= N: return
    L = min(len(x), N - i); buf[i:i + L] += x[:L] * g
def mtf(m): return 440 * 2 ** ((m - 69) / 12)
def lp(x, f): return sosfilt(butter(2, f, fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'bandpass', fs=SR, output='sos'), x)
def click(d=.03, f=2200):
    x = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * f * x) * np.exp(-x * 170) + rng.standard_normal(len(x)) * np.exp(-x * 220) * .3
def thump(f=50, d=.7, dec=6):
    x = np.arange(int(d * SR)) / SR; return np.sin(2 * np.pi * np.cumsum(f + 90 * np.exp(-x * 40)) / SR) * np.exp(-x * dec)
# chords per section (root first): chapters start at 4.7 / 13.7 / 30.2 / 45.5 ; calm 56.3 ; CTA 60.1
SEC = [(0, 4.7, [38, 50, 53, 57]), (4.7, 13.7, [38, 50, 53, 57]), (13.7, 30.2, [34, 46, 50, 53]), (30.2, 45.5, [31, 43, 46, 50]), (45.5, 56.3, [38, 50, 53, 56]), (56.3, 60.1, [38, 50, 54, 57]), (60.1, END + 1, [38, 50, 54, 57])]
drone = np.zeros(N); pad = np.zeros(N)
for a0, a1, ch in SEC:
    g_ = gate(a0, a1, .5); f0 = mtf(ch[0])
    drone += (np.sin(2 * np.pi * f0 * t) + .5 * np.sin(2 * np.pi * 2 * f0 * t + .4) + .3 * np.sin(2 * np.pi * 3 * f0 * t)) * g_ * .20
    for m in ch[1:]:
        f = mtf(m); det = 1.0 if a0 != 45.5 else 1.012      # a slightly detuned pad in the scam chapter
        pad += (np.sin(2 * np.pi * f * t + .3 * np.sin(t * .5 + m)) + .2 * np.sin(2 * np.pi * 2 * f * det * t)) * g_ * .06
drone = lp(drone, 220); pad = lp(pad, 1000)
# rain bed
rain = bp(rng.standard_normal(N), 2500, 9000) * .06 + lp(rng.standard_normal(N), 500) * .03
rain *= 1 - .6 * env(56, 63, t)
# heartbeat pulse
pulse = np.zeros(N)
def beat_train(a0, a1, bpm, g):
    a = a0; b = 60 / bpm
    while a < a1: add(pulse, a, thump(46, .32, 12) * g); add(pulse, a + .16, thump(52, .25, 14) * g * .6); a += b
beat_train(4.7, 29.7, 84, .5); beat_train(30.2, 41.6, 56, .35); beat_train(41.9, 53.5, 112, .6); beat_train(56.3, 60.1, 60, .3)
# tense ticking in the scam chapter
tick = np.zeros(N); a = 45.5
while a < 53.4: add(tick, a, click(.02, 3800), .10); a += 60 / 112 / 2
# CTA lift: warm plucked arpeggio after the last word of the CTA starts (kept soft, in the bed)
cta = np.zeros(N); mel = [62, 66, 69, 74, 69, 66]; a = 60.3; j = 0
while a < END - .2:
    x = np.arange(int(.45 * SR)) / SR; fq = mtf(mel[j % 6]); add(cta, a, (np.sin(2 * np.pi * fq * x) + .3 * np.sin(2 * np.pi * 2 * fq * x)) * np.exp(-x * 5), .12); a += .32; j += 1
act = np.abs(voice); kk = int(.1 * SR); sm = np.convolve(act, np.ones(kk) / kk, 'same'); on = (sm > 0.01).astype(float)
k2 = int(.22 * SR); duck = np.clip(np.convolve(on, np.ones(k2) / k2, 'same') * 2.2, 0, 1)
music = drone * .9 + pad + pulse * (1 - .45 * duck) + tick * (1 - .6 * duck) + cta * (1 - .5 * duck) + rain
music *= env(0, .02, t) * (1 - env(END - .5, END, t))
music = sosfilt(butter(2, [1200, 4500], 'bandstop', fs=SR, output='sos'), music) * .85 + rain * .5
music *= 10 ** ((-1 - 18 * duck) / 20)
sfx = np.zeros(N)
def noise_sweep(d=.38, lo=400, hi=5000, down=False):
    L = int(d * SR); x = rng.standard_normal(L); e = np.sin(np.linspace(0, np.pi, L)) ** 2; out = np.zeros(L); sg = L // 8
    for i in range(8):
        f = lo + (hi - lo) * ((7 - i) if down else i) / 7; s = slice(i * sg, (i + 1) * sg if i < 7 else L)
        out[s] = bp(x, max(80, f * .6), min(20000, f * 1.6))[s]
    return out * e
def mix2(*xs):
    L = max(len(x) for x in xs); o = np.zeros(L)
    for x in xs: o[:len(x)] += x
    return o
def bell(f=1568, d=1.2): x = np.arange(int(d * SR)) / SR; return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 2.76 * x)) * np.exp(-x * 4) * np.minimum(1, x * 200)
def stamp(): x = np.arange(int(.35 * SR)) / SR; return mix2(thump(70, .35, 14) * 1.2, lp(rng.standard_normal(len(x)), 1800) * np.exp(-x * 40) * .5)
def crack(): x = np.arange(int(.7 * SR)) / SR; return mix2(bp(rng.standard_normal(len(x)), 900, 5000) * np.exp(-x * 55) * 1.4, thump(60, .7, 8))
def lock(): return mix2(click(.03, 2000), thump(120, .2, 25) * .5, bell(2093, .8) * .3)
def relay(): c = click(.02, 1700); o = np.zeros(int(.3 * SR)); o[:len(c)] += c; o[int(.08 * SR):int(.08 * SR) + len(c)] += c * .8; return mix2(o, thump(70, .3, 18) * .5)
def fade(): x = np.arange(int(1.2 * SR)) / SR; return np.sin(2 * np.pi * np.cumsum(900 * np.exp(-x * 1.6)) / SR) * np.exp(-x * 2.5) * .5
def burn(): x = np.arange(int(2.2 * SR)) / SR; return hp(rng.standard_normal(len(x)), 2500) * (rng.random(len(x)) > .7) * np.exp(-x * 1.4) * .5
def redlane(): x = np.arange(int(1.5 * SR)) / SR; return np.sign(np.sin(2 * np.pi * np.cumsum(60 + 60 * x) / SR)) * np.minimum(1, x * 3) * .4 * np.exp(-x * .8)
def resolve(): return mix2(bell(587, 2.2) * .6, bell(880, 2.2) * .4, bell(1175, 2.0) * .25)
FX = dict(ping=lambda: bell(1568, 1.0), sub=lambda: thump(38, 1.2, 3) * 1.1, whoosh=lambda: noise_sweep(.5), dial=lambda: click(.015, 3200), lock=lock, relay=relay,
          pulse=lambda: mix2(noise_sweep(.9, 300, 6000) * .6, thump(44, .9, 4)), fade=fade, tick=lambda: bell(1760, .6), key=lambda: mix2(click(.02, 1300), thump(150, .1, 40) * .3),
          burn=burn, stamp=stamp, swarm=lambda: noise_sweep(.5, 800, 9000), redlane=redlane, flip=lambda: mix2(click(.03, 2600), noise_sweep(.25, 800, 5000) * .3),
          hit=lambda: mix2(thump(40, 1.2, 4) * 1.2, crack()), snap=crack, resolve=resolve, end=lambda: bell(1175, 1.5) * .6)
GAIN = dict(ping=.5, sub=.7, whoosh=.38, dial=.3, lock=.55, relay=.5, pulse=.5, fade=.4, tick=.2, key=.22, burn=.4, stamp=.6, swarm=.3, redlane=.45, flip=.4, hit=.7, snap=.55, resolve=.5, end=.4)
for at, kind in json.load(open('audio/events.json')):
    x = FX[kind]() if kind in FX else None
    if x is None: print('no sound for', kind); continue
    add(sfx, at - (.25 if kind in ('whoosh', 'pulse') else 0), x, GAIN.get(kind, .5))
sfx *= 10 ** (-11 / 20); sfx *= 10 ** ((-20 * duck) / 20)
mix = voice + music + sfx; sf.write('audio/premix.wav', mix, SR)
p1 = subprocess.run(['ffmpeg', '-i', 'audio/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
q = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', p1, re.S).group(0))
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/premix.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (q['input_i'], q['input_tp'], q['input_lra'], q['input_thresh'], q['target_offset']), '-ar', str(SR), 'audio/mix_hi.wav'])
fr = int(.05 * SR); w4 = []; tw = []
for i in range(N // (fr * 5)):
    sl = slice(i * fr * 5, (i + 1) * fr * 5)
    if on[sl].mean() > .9: a = np.sqrt(np.mean(voice[sl] ** 2)); w4.append(20 * np.log10(a / (np.sqrt(np.mean((music + sfx)[sl] ** 2)) + 1e-9))); tw.append(i * .25)
print('worst', sorted(zip([round(x, 1) for x in w4], tw))[:6])
rep = {'windows': len(w4), 'median_250ms_db': round(float(np.median(w4)), 1), 'min_250ms_db': round(float(np.min(w4)), 1)}
j = subprocess.run(['ffmpeg', '-i', 'audio/mix_hi.wav', '-af', 'loudnorm=I=-14:TP=-1.5:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
lj = json.loads(re.search(r'\{[^}]*input_i[^}]*\}', j, re.S).group(0)); rep['LUFS'] = lj['input_i']; rep['TP'] = lj['input_tp']
json.dump(rep, open('audio/mix-report.json', 'w'), indent=1); print(rep)
