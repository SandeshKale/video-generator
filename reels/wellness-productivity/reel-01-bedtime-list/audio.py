# Hack Zone #01 score + SFX + mix/master -> audio/final.wav (stereo 48 kHz), audio/mix-report.json.
# The argument of the reel is audible: a murmur of whispering voices ("the open tabs") whose loudness is a function of the number of
# open tabs on screen (14 -> 0, from events.json = the page's own cue list). A warm pad enters as tabs close and resolves in the last 4 s.
# Voice dry and centred; bed carved 1.2-4.5 kHz and ducked under every word; standing targets: voice over bed median >= 19 dB, min >= 13 dB.
# Run: python3 audio.py   (needs audio/voice.wav, timing.json, events.json)
import json, re, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, lfilter, resample_poly
SR = 48000
TM = json.load(open('timing.json')); EVJ = json.load(open('events.json')); EV = EVJ['EV']; DUR = EVJ['dur']; N = int((DUR + .3) * SR)
rng = np.random.default_rng(7); words = TM['words']
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
def smooth(x, att, rel):
    xs = x[::48]; ys = np.zeros_like(xs); s = 0.0; a1, r1 = np.exp(-1 / (att * 1000)), np.exp(-1 / (rel * 1000))
    for i, xi in enumerate(xs): c = a1 if xi > s else r1; s = c * s + (1 - c) * xi; ys[i] = s
    return np.repeat(ys, 48)[:len(x)]
rms = lambda x: np.sqrt(np.mean(x ** 2) + 1e-20); db = lambda x: 20 * np.log10(np.maximum(x, 1e-9))
# ---------- open-tab count n(t) ----------
n_open = np.full(N, 14.0)
for e in sorted([e for e in EV if e['k'] == 'close'], key=lambda e: e['t']): n_open[int(e['t'] * SR):] -= 1
n_s = smooth(n_open, .12, .35); lvl = np.clip(n_s / 14, 0, 1) ** .85
# ---------- murmur: six whispering "voices": noise through slowly moving formants, syllable-rate modulation, spread in the stereo field ----------
def murmur_voice(seed, pan):
    r = np.random.default_rng(seed); x = r.standard_normal(N); f1, f2 = r.uniform(420, 820), r.uniform(1300, 2300)
    y = bp(x, f1 * .8, f1 * 1.25, 2) + .7 * bp(x, f2 * .85, f2 * 1.2, 2)
    t = np.arange(N) / SR; syl = np.zeros(N)
    for k in range(3): syl += (.5 + .5 * np.sin(2 * np.pi * r.uniform(2.2, 6.5) * t + r.uniform(0, 6.3))) ** 2
    gate = np.clip(np.sin(2 * np.pi * r.uniform(.12, .35) * t + r.uniform(0, 6.3)) * 1.6 + .4, 0, 1)    # phrases and pauses
    return st(y * syl / 3 * gate, pan)
mur = sum(murmur_voice(100 + i, p) for i, p in enumerate([-.8, -.5, -.2, .2, .5, .8])); mur = mur / max(1e-9, rms(mur.mean(1))) * 1.0
mur = mur * lvl[:, None]
# ---------- drone + pad ----------
t = np.arange(N) / SR
drone = sum(np.sin(2 * np.pi * f * t + p) * a for f, p, a in [(55, 0, 1), (82.4, 1.3, .55), (110.2, 2.2, .3)]) * (.8 + .2 * np.sin(2 * np.pi * .13 * t))
pad_env = np.clip(1 - n_s / 14, 0, 1) ** 1.3
end0 = float(max(e['t'] for e in EV if e['k'] == 'chip')) - 1.0   # resolve into the end card
pad_env = np.maximum(pad_env, np.clip((t - end0) / 1.5, 0, 1) * .9)
def pad_note(m, det=.004):
    f = fr(m); y = 0
    for d in (-det, 0, det): y = y + (2 * ((f * (1 + d) * t) % 1) - 1)    # detuned saws
    return lp(y / 3, 900)
chord = sum(pad_note(m) for m in (50, 54, 57, 61, 64)) / 5 + .4 * sum(np.sin(2 * np.pi * fr(m) * t) for m in (74, 78)) * np.clip((t - end0) / 2, 0, 1) * .15
pad = chord * pad_env * (.85 + .15 * np.sin(2 * np.pi * .2 * t))
bed = st(drone * .9, 0) * (.5 + .5 * lvl)[:, None] * .6 + st(pad, 0) * 1.1
# ---------- sfx ----------
def noise_burst(d, f0, f1, g=1.0, dec=18): x = tt(d); return bp(rng.standard_normal(len(x)), f0, f1) * np.exp(-x * dec) * g
def click(i): x = tt(.07); f = 1500 + 120 * i; return (np.sin(2 * np.pi * f * x) * np.exp(-x * 90) + hp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 220) * .5) * .9
def scratch(d):
    x = tt(d); m = (.5 + .5 * np.sin(2 * np.pi * rng.uniform(5, 9) * x)) * (np.clip(x / .05, 0, 1)) * np.clip((d - x) / .08, 0, 1)
    return bp(rng.standard_normal(len(x)), 2200, 7000) * m * .55
def swish(d=.35, f0=900, f1=6000):
    x = tt(d); sweep = np.cumsum(f0 + (f1 - f0) * (x / d) ** 2) / SR; n = rng.standard_normal(len(x)); return hp(n, 1200) * np.sin(np.pi * x / d) ** 2 * .5 * (.6 + .4 * np.sin(2 * np.pi * sweep * .0))
def thud(): x = tt(.5); return np.sin(2 * np.pi * (70 + 90 * np.exp(-x * 25)) * x) * np.exp(-x * 7) * .9
def bell(m, d=1.4, g=.5):
    x = tt(d); f = fr(m); return (np.sin(2 * np.pi * f * x) + .45 * np.sin(2 * np.pi * f * 2.01 * x) * np.exp(-x * 3) + .2 * np.sin(2 * np.pi * f * 3.9 * x) * np.exp(-x * 6)) * np.exp(-x * 3.2) * g
def tick(): x = tt(.05); return np.sin(2 * np.pi * 2300 * x) * np.exp(-x * 110) * .6 + hp(rng.standard_normal(len(x)), 2500) * np.exp(-x * 200) * .3
sfx = np.zeros((N, 2)); acc = np.zeros((N, 2))
for e in EV:
    k, tm = e['k'], e['t']
    if k == 'close': put(sfx, st(click(e['i']), (rng.uniform(-.5, .5))), tm, .26)
    elif k == 'pen': put(sfx, st(scratch(max(.2, e.get('d', .7))), .15), tm, .2)
    elif k == 'strike': put(sfx, st(swish(.3, 1500, 7000), -.2), tm, .22)
    elif k == 'stamp': put(acc, st(thud(), 0), tm, .35); put(acc, st(bell(79, 1.6, .5), .1), tm + .02, .12)
    elif k == 'recap': put(sfx, st(noise_burst(.25, 700, 5000, 1, 14), 0), tm, .2)
    elif k == 'chip':
        m = [76, 79, 83, 88][e['n']]; put(acc, st(bell(m, 1.3, .5), (-.3, -.1, .1, .3)[e['n']]), tm, .13)
        if e['n'] == 0: put(sfx, st(click(2), 0), tm, .2)
    elif k == 'swoosh': put(sfx, st(swish(.55, 1000, 8000), .3), tm, .2)
    elif k == 'type':
        for j in range(7): put(sfx, st(tick(), .1), tm + j * (e.get('d', .5) / 7), .2)
    elif k == 'press': put(acc, st(thud(), 0), tm, .22); [put(acc, st(bell(m, 1.8, .5), 0), tm + .05 + j * .09, .09) for j, m in enumerate((88, 91, 95))]
    elif k == 'dive': put(sfx, st(swish(1.2, 300, 3000), 0), tm, .16)
    elif k == 'macro': put(sfx, st(noise_burst(.5, 200, 1500, 1, 6), 0), tm, .12)
    elif k == 'out': put(sfx, st(swish(1.0, 500, 2500), 0), tm, .12)
    elif k == 'proof': put(sfx, st(swish(.9, 600, 4000), .2), tm, .12)
    elif k == 'quiet': put(acc, st(thud() * .6, 0), tm, .18)
# ---------- voice ----------
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voice.wav', '-af', 'highpass=f=70,deesser=i=0.35:m=0.5:f=0.5,equalizer=f=180:t=q:w=1.0:g=1.5,equalizer=f=3000:t=q:w=1.5:g=0.8,highshelf=f=8000:g=-1.5,acompressor=threshold=-22dB:ratio=2:attack=15:release=200:makeup=1.5', '-ar', str(SR), '-ac', '1', 'audio/voice_proc.wav'])
_, v = wavfile.read('audio/voice_proc.wav'); v = v.astype('float64') / 32768.0
vo = np.zeros(N); vo[:min(N, len(v))] = v[:N]
act = np.zeros(N)
for w in words: act[int(max(0, w['s'] - .06) * SR):int(min(N, (w['e'] + .1) * SR))] = 1
duck = smooth(act, .03, .28); vr = rms(vo[act > 0])
carve = lambda x, depth: x - depth * bp(x, 1200, 4500)
mb = hp(mur * 1.0 + bed * 1.0, 35); mb = carve(mb, .4); mb = mb - (.4 * duck)[:, None] * bp(mb, 1200, 4500)
GAP_DB, DUCK_DB = float(__import__('os').environ.get('GAP_DB', -12)), float(__import__('os').environ.get('DUCK_DB', -9))
mg = 10 ** (GAP_DB / 20) * vr / max(rms(mb.mean(1)), 1e-9)
mus = mb * mg * (10 ** (DUCK_DB * duck / 20))[:, None]
fx = (carve(sfx, .45) + carve(acc, .3)) * (vr / .2) * (10 ** (-5 * duck / 20))[:, None]
mix = st(vo, 0) * np.sqrt(2) + mus + fx
seps = []
for w in words:
    a, b2 = int(w['s'] * SR), int(w['e'] * SR)
    if b2 - a < int(.08 * SR): continue
    seps.append(db(rms(vo[a:b2])) - db(rms((mus[a:b2] + fx[a:b2]).mean(1))))
seps = np.array(seps); mix = np.tanh(mix * 1.1) / 1.1
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
rep = {'integrated_LUFS': I, 'true_peak_dBTP': TP, 'loudness_range_LU': LRA, 'voice_over_bed+sfx_dB_per_word': {'median': round(float(np.median(seps)), 1), 'p10': round(float(np.percentile(seps, 10)), 1), 'min': round(float(seps.min()), 1), 'words': int(len(seps))},
       'bed_gap_vs_voice_dB': GAP_DB, 'bed_duck_while_speaking_dB': DUCK_DB, 'murmur': 'six formant-noise whisper voices, level = f(open tabs, 14 -> 0)', 'targets': 'median >= 19, min >= 13 (standing rule)'}
json.dump(rep, open('audio/mix-report.json', 'w'), indent=1); print(json.dumps(rep, indent=1))
