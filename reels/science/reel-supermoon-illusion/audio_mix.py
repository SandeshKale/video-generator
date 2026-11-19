#!/usr/bin/env python3
"""Score + SFX + mix for the supermoon reel. SFX = earshot bank renders (audio/sfx/*.wav) placed on the picture moments; score = slow celestial pad + bell arp (code-made);
optional Openverse CC0 recordings in audio/ov (temple bell, stream) when present. python3 audio_mix.py -> audio/final.wav + audio/mix-report.json.
Mix rules: voice-activity ducking with look-ahead, 1.2-4.5 kHz carve, audible bed (voice over music median ~16 dB, min >= 12 dB)."""
import json, os, re, glob, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
from scipy.ndimage import uniform_filter1d
R = os.path.dirname(os.path.abspath(__file__)); A = R + '/audio'; SR = 48000
_tj = open(R + '/site/timing.js').read(); TMJ = json.loads(_tj[_tj.index('=') + 1:].rstrip().rstrip(';')); S = {s['id']: s['t0'] for s in TMJ['sentences']}; DUR = TMJ['end']; N = int(DUR * SR); rng = np.random.default_rng(5)
vp = A + '/voice.wav'
if os.path.exists(vp):
    v, sr0 = sf.read(vp); v = v if v.ndim == 1 else v.mean(1); v = resample_poly(v, SR, sr0).astype('float32')
else: v, sr0 = np.zeros(10, 'float32'), SR
voice = np.zeros(N, 'float32'); voice[:min(N, len(v))] = v[:N]
def sec(t): return int(t * SR)
def tone(f, dur, shape='sine', a=.004, dec=.15, f1=None):
    n = max(8, int(dur * SR)); t = np.arange(n) / SR; ff = f if f1 is None else np.linspace(f, f1, n); ph = 2*np.pi*np.cumsum(ff)/SR
    x = np.sin(ph) if shape == 'sine' else (np.sign(np.sin(ph)) * .6 if shape == 'square' else 2*((ph/(2*np.pi)) % 1) - 1)
    e = np.exp(-t / max(dec, .01)); e[:int(a*SR)] *= np.linspace(0, 1, max(1, int(a*SR))); return (x * e).astype('float32')
def noise(dur, lo=None, hi=None):
    x = rng.standard_normal(int(dur*SR)).astype('float32')
    if lo or hi:
        sos = butter(3, [lo/(SR/2), hi/(SR/2)] if lo and hi else (hi/(SR/2) if hi else lo/(SR/2)), btype='band' if lo and hi else ('low' if hi else 'high'), output='sos'); x = sosfilt(sos, x).astype('float32')
    return x
def dec_n(n, tau): return np.exp(-np.arange(int(n*SR))/SR/tau).astype('float32')
def sm(*xs):
    n = max(len(x) for x in xs); y = np.zeros(n, 'float32')
    for x in xs: y[:len(x)] += x
    return y
def put(buf, x, t, g=1.0):
    i = sec(t)
    if i >= len(buf) or i < -len(x): return
    a = max(0, -i); j = min(len(buf), i + len(x)); buf[max(0, i):j] += x[a:a + j - max(0, i)] * g
def whoosh(dur=.5, up=True):
    n = int(dur*SR); x = noise(dur); sw = np.linspace(300, 6000, n) if up else np.linspace(6000, 300, n); y = np.zeros(n, 'float32')
    for k in range(0, n, 512):
        f = sw[k]; sos = butter(2, [max(80, f*.6)/(SR/2), min(.99, f*1.4/(SR/2))], btype='band', output='sos'); y[k:k+512] = sosfilt(sos, x[k:k+512])
    return (y * np.sin(np.linspace(0, np.pi, n))**1.5 * 3.0).astype('float32')
# ---------------- SFX ----------------
sfx = np.zeros(N, 'float32')
def ld(name, gain=1.0, maxdur=None):
    p = A + '/sfx/' + name + '.wav'
    if not os.path.exists(p): return np.zeros(10, 'float32')
    x, s = sf.read(p); x = x if x.ndim == 1 else x.mean(1); x = resample_poly(x, SR, s).astype('float32') * gain
    return x[:int(maxdur * SR)] if maxdur else x
sfx = np.zeros(N, 'float32'); WD = json.load(open(A + '/words.json'))['words']
def soft_off_word(t):
    for _ in range(6):
        hit = [w for w in WD if w[1] - .02 < t < w[2]]
        if not hit: return t
        t = hit[0][2] + .03
    return t
def chime(f, d=.6, g=.3): return sm(tone(f, d, dec=d/3) * g, tone(f * 2.01, d * .7, dec=d/5) * g * .4, tone(f * 3.02, d * .5, dec=d/8) * g * .2)
# picture moments (all derived from sentence starts so a new voice re-times them)
for k in ('s2', 's5', 's8'): put(sfx, ld('fit_whoosh.short_bamboo_swish', .5), soft_off_word(S[k] - .25))        # shot changes
put(sfx, ld('riser_swell', .5), S['s3'] - 2.2 + .0); put(sfx, ld('sub', .9), S['s3'] + .0); put(sfx, ld('shimmer_m0', .35), S['s3'] + .1)   # SUPERMOON lands
put(sfx, ld('small_bell', .6), S['s1'] + .2); put(sfx, ld('small_bell', .5), S['s8'] + .1)                          # Dev Deepawali bells (open + faith beat)
put(sfx, ld('click_tink', .6), soft_off_word(S['s5'] + 3.0)); put(sfx, ld('click_tink', .6), soft_off_word(S['s5'] + 3.2))       # calipers lock
put(sfx, ld('impact_swell', .35, 3.0), S['s7'] + 1.5)                                                           # nail covers the moon
put(sfx, chime(1046.5, 1.4, .2), S['s9'] + 2.0)                                                                  # CTA
ovb = glob.glob(A + '/ov/*bell*.wav') + glob.glob(A + '/ov/*temple*.wav'); ovw = glob.glob(A + '/ov/*water*.wav') + glob.glob(A + '/ov/*stream*.wav')
def ovload(p, g):
    x, s = sf.read(p); x = x if x.ndim == 1 else x.mean(1); return resample_poly(x, SR, s).astype('float32') * g
if ovb:
    for p in ovb[:1]:
        if os.path.getsize(p) > 1000: put(sfx, ovload(p, .5), S['s1'] + .3); put(sfx, ovload(p, .4), S['s9'] - .5)
amb = np.zeros(N, 'float32')
if ovw and os.path.getsize(ovw[0]) > 1000:
    w_ = ovload(ovw[0], .06); k = int(np.ceil(N / len(w_))); amb = np.tile(w_, k)[:N]
# ---------------- score: slow celestial pad, 66 BPM ----------------
BPM = 66; beat = 60 / BPM; music = np.zeros(N, 'float32'); A2 = 110.0
def pluck(f, d=.9): return sm(tone(f, d, 'sine', dec=d / 3) * .5, tone(f * 2.003, d * .5, dec=d / 6) * .15)
t = 0.0; bar = 0
while t < DUR:
    root = A2 * 2 ** ([0, -4, -2, -7][bar % 4] / 12); third = 2 ** ((3 if bar % 4 in (0, 2) else 4) / 12)
    put(music, sm(tone(root, beat * 4, 'saw', a=.9, dec=2.4) * .08, tone(root * third, beat * 4, 'saw', a=1.1, dec=2.4) * .06, tone(root * 1.5, beat * 4, 'saw', a=1.2, dec=2.4) * .05, tone(root / 2, beat * 4, 'sine', a=.5, dec=3) * .12), t)
    for j in range(4): put(music, pluck(root * 4 * 2 ** ([0, 7, 12, 7][j] / 12)) * .1, t + j * beat)
    if bar % 2 == 0: put(music, sm(tone(52, .6, f1=40, dec=.25) * .5), t)
    bar += 1; t = bar * beat * 4
music = music + amb
vad = np.convolve(np.abs(voice), np.ones(int(.02 * SR)) / int(.02 * SR), 'same'); on = (vad > .006).astype('float32'); on = np.roll(on, -int(.09 * SR))
duck = np.minimum(1, uniform_filter1d(on, int(.18 * SR)) * 1.6); a_ = np.exp(-1 / (.08 * SR)); r_ = np.exp(-1 / (.3 * SR)); g = np.zeros(N, 'float32'); cur = float(duck[0])
for k in range(0, N, 64):
    tg = duck[k]; cur = tg + (cur - tg) * (a_ if tg > cur else r_)**64; g[k:k+64] = cur
MUS = float(os.environ.get('MUS', .2)); SFXG = float(os.environ.get('SFXG', .4))
sos = butter(2, [1200/(SR/2), 4500/(SR/2)], btype='band', output='sos'); music_d = music * MUS * (1 - float(os.environ.get('DUCK', .6)) * g); music_d = music_d - .55 * sosfilt(sos, music_d) * g * .8
sfx_d = sfx * SFXG * (1 - .92 * g)
oth = music_d + sfx_d; venv = np.sqrt(np.maximum(0, uniform_filter1d(voice.astype('float64') ** 2, int(.25 * SR)))); oenv = np.sqrt(np.maximum(0, uniform_filter1d(oth.astype('float64') ** 2, int(.04 * SR)))) + 1e-9
lim = np.where(g > .4, np.minimum(1, np.maximum(venv, .012) / 4.5 / oenv), 1.0); lim = np.minimum(lim, uniform_filter1d(lim, int(.03 * SR))).astype('float32'); music_d = music_d * lim; sfx_d = sfx_d * lim   # keeps voice >= ~13 dB over the bed while speaking
mix = voice + music_d + sfx_d; mix = mix / max(1, np.max(np.abs(mix)) / .89); sf.write(A + '/mix-pre.wav', mix, SR)
M = subprocess.run(['ffmpeg', '-hide_banner', '-i', A + '/mix-pre.wav', '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr; j = json.loads(M[M.rindex('{'):])
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', A + '/mix-pre.wav', '-af', f"loudnorm=I=-14:TP=-1.2:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true", '-ar', '48000', A + '/final.wav'], check=True)
W = json.load(open(A + '/words.json'))['words']; ratios = []; worst = []
for w in W:
    for t0 in np.arange(w[1], w[2] - .25, .25):
        a, b = sec(t0), sec(t0 + .25); vv = np.sqrt(np.mean(voice[a:b] ** 2)); oo = np.sqrt(np.mean((music_d[a:b] + sfx_d[a:b]) ** 2)) + 1e-9
        if vv > .01 and np.isfinite(oo) and np.isfinite(vv): ratios.append(20 * np.log10(vv / oo)); worst.append((round(20 * np.log10(vv / oo), 1), round(float(t0), 2), w[0]))
r = dict(median_db=round(float(np.median(ratios)), 1), min_db=round(float(np.min(ratios)), 1), p10_db=round(float(np.percentile(ratios, 10)), 1), n=len(ratios), note='250 ms windows inside words; not auditioned by ear')
out = subprocess.run(['ffmpeg', '-v', 'info', '-i', A + '/final.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = re.findall(r'I:\s+(-?[\d.]+) LUFS', out); tp = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', out); r['lufs'] = float(m[-1]) if m else None; r['true_peak_dbfs'] = float(tp[-1]) if tp else None
json.dump(r, open(A + '/mix-report.json', 'w'), indent=1); print(r); print(sorted(worst)[:6])
