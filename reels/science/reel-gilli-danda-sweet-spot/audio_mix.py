#!/usr/bin/env python3
"""Score + SFX + mix for the gilli-danda reel: village-lane groove (dholak-style low hits, shaker, plucked marimba), strike SFX from the page events, event SFX from the page.
python3 audio_mix.py -> audio/final.wav + audio/mix-report.json. SFX come from the page event list (audio/events.json).
Mix rules: voice-activity ducking with look-ahead, 1.2-4.5 kHz carve, audible bed (voice over music median ~16 dB, min >= 12 dB)."""
import json, os, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
from scipy.ndimage import uniform_filter1d
R = os.path.dirname(os.path.abspath(__file__)); A = R + '/audio'; SR = 48000
ev = json.load(open(A + '/events.json')); B = ev['B']; DUR = ev['dur']; N = int(DUR * SR); rng = np.random.default_rng(5)
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
WD = json.load(open(A + '/words.json'))['words']
def soft_off_word(t):
    for _ in range(6):
        hit = [w for w in WD if w[1] - .02 < t < w[2]]
        if not hit: return t
        t = hit[0][2] + .03
    return t
def chime(f, d=.6, g=.3): return sm(tone(f, d, dec=d/3) * g, tone(f * 2.01, d * .7, dec=d/5) * g * .4, tone(f * 3.02, d * .5, dec=d/8) * g * .2)
SOFT = ('tick', 'whoosh', 'ring', 'ping')
turn_t = None
for e in ev['ev']:
    t, k = e['t'], e['k']
    if k in SOFT: t = soft_off_word(t)
    if k == 'hit': put(sfx, .3 * sm(tone(110, .5, f1=55, dec=.18) * .9, noise(.08, 200, 3000) * dec_n(.08, .03) * .5, chime(392, 1.4, .3)), t)
    elif k == 'whoosh': put(sfx, whoosh(.5, True) * .16, t - .12)
    elif k == 'thwack': put(sfx, sm(noise(.05, 700, 5000) * dec_n(.05, .012) * .9, tone(190, .12, f1=110, dec=.04) * .7, tone(520, .09, dec=.03) * .25), t)
    elif k == 'thud': put(sfx, sm(noise(.08, 120, 900) * dec_n(.08, .03) * .6, tone(80, .2, f1=50, dec=.07) * .8), t)
    elif k == 'chime': put(sfx, sm(chime(1046.5, 1.2, .22), chime(1568, .8, .08)), t)
    elif k == 'tick': put(sfx, sm(chime(1568, .25, .08), noise(.02, 3000, 9000) * dec_n(.02, .006) * .2), t)
    elif k == 'bars':
        for j in range(8): put(sfx, tone(520 + j * 40, .08, dec=.03) * .08, t + j * .11)
    elif k == 'balls':
        for j in range(37): put(sfx, sm(noise(.03, 800, 5000) * dec_n(.03, .01) * .2, tone(220, .05, dec=.015) * .08), t + j * .11)
    elif k == 'flash': turn_t = t; put(sfx, sm(tone(60, .8, f1=40, dec=.3) * .9, noise(.25, 150, 4000) * dec_n(.25, .08) * .5), t)
    elif k == 'coins':
        for j in range(33): put(sfx, sm(chime(1976 + (j % 5) * 120, .4, .06), noise(.015, 4000, 9000) * dec_n(.015, .005) * .12), t + j * .075 + .35)
    elif k == 'ring': put(sfx, sm(whoosh(.4, False) * .1, chime(880, .7, .07)), t)
    elif k == 'ping': put(sfx, sm(chime(1318.5, .9, .14), chime(1975.5, .6, .05)), t)
# ---------------- score: 120 BPM bulletin groove ----------------
BPM = 98; beat = 60 / BPM; step = beat / 4; music = np.zeros(N, 'float32'); A2 = 98.0
def mallet(f, d=.3): return sm(tone(f, d, dec=d / 3) * .6, tone(f * 4, d * .3, dec=d / 10) * .15)
i = 0; t = 0.0
while t < DUR:
    s16 = i % 16; bar = i // 16
    if s16 in (0, 8): put(music, sm(tone(58, .3, f1=44, dec=.1) * .9, noise(.03, 300, 1500) * dec_n(.03, .01) * .3), t)
    if s16 in (4, 12): put(music, noise(.07, 1500, 7000) * dec_n(.07, .02) * .22, t)
    if s16 % 2 == 0: put(music, noise(.02, 6000, 12000) * dec_n(.02, .006) * .1, t)
    root = A2 * 2 ** ([0, 0, -2, -2, 3, 3, -5, 0][bar % 8] / 12)
    if s16 % 2 == 0: put(music, tone(root, step * 1.7, 'saw', dec=.12) * .1, t)
    if s16 in (2, 6, 10, 14) and (bar % 2 == 1): put(music, mallet(root * 4 * 2 ** ([0, 4, 7, 12][(s16 // 4) % 4] / 12), .28) * .12, t)
    i += 1; t = i * step
if turn_t:   # the music drops for a beat before the purse turn, then a timpani roll
    hm = np.ones(N, 'float32'); a0 = sec(turn_t - .35); a1 = sec(turn_t + .15); hm[a0:a1] = np.linspace(1, .08, a1 - a0); music *= hm

# ---------------- ducking + carve ----------------
vad = np.convolve(np.abs(voice), np.ones(int(.02 * SR)) / int(.02 * SR), 'same'); on = (vad > .008).astype('float32'); on = np.roll(on, -int(.09 * SR))
duck = np.minimum(1, uniform_filter1d(on, int(.18 * SR)) * 1.6); a_ = np.exp(-1 / (.08 * SR)); r_ = np.exp(-1 / (.3 * SR)); g = np.zeros(N, 'float32'); cur = float(duck[0])
for k in range(0, N, 64):
    tg = duck[k]; cur = tg + (cur - tg) * (a_ if tg > cur else r_)**64; g[k:k+64] = cur
MUS = float(os.environ.get('MUS', .2)); SFXG = float(os.environ.get('SFXG', .4))
sos = butter(2, [1200/(SR/2), 4500/(SR/2)], btype='band', output='sos'); music_d = music * MUS * (1 - float(os.environ.get('DUCK', .6)) * g); music_d = music_d - .55 * sosfilt(sos, music_d) * g * .8
sfx_d = sfx * SFXG * (1 - .92 * g)
oth = music_d + sfx_d; venv = np.sqrt(uniform_filter1d(voice.astype('float64') ** 2, int(.25 * SR))); oenv = np.sqrt(uniform_filter1d(oth.astype('float64') ** 2, int(.04 * SR))) + 1e-9
lim = np.where(g > .4, np.minimum(1, np.maximum(venv, .012) / 4.5 / oenv), 1.0); lim = np.minimum(lim, uniform_filter1d(lim, int(.03 * SR))).astype('float32'); music_d = music_d * lim; sfx_d = sfx_d * lim   # keeps voice >= ~13 dB over the bed while speaking
mix = voice + music_d + sfx_d; mix = mix / max(1, np.max(np.abs(mix)) / .89); sf.write(A + '/mix-pre.wav', mix, SR)
M = subprocess.run(['ffmpeg', '-hide_banner', '-i', A + '/mix-pre.wav', '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr; j = json.loads(M[M.rindex('{'):])
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', A + '/mix-pre.wav', '-af', f"loudnorm=I=-14:TP=-1.2:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true", '-ar', '48000', A + '/final.wav'], check=True)
W = json.load(open(A + '/words.json'))['words']; ratios = []; worst = []
for w in W:
    for t0 in np.arange(w[1], w[2] - .25, .25):
        a, b = sec(t0), sec(t0 + .25); vv = np.sqrt(np.mean(voice[a:b] ** 2)); oo = np.sqrt(np.mean((music_d[a:b] + sfx_d[a:b]) ** 2)) + 1e-9
        if vv > .01: ratios.append(20 * np.log10(vv / oo)); worst.append((round(20 * np.log10(vv / oo), 1), round(float(t0), 2), w[0]))
r = dict(median_db=round(float(np.median(ratios)), 1), min_db=round(float(np.min(ratios)), 1), p10_db=round(float(np.percentile(ratios, 10)), 1), n=len(ratios), note='250 ms windows inside words; not auditioned by ear')
out = subprocess.run(['ffmpeg', '-v', 'info', '-i', A + '/final.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
m = re.findall(r'I:\s+(-?[\d.]+) LUFS', out); tp = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', out); r['lufs'] = float(m[-1]) if m else None; r['true_peak_dbfs'] = float(tp[-1]) if tp else None
json.dump(r, open(A + '/mix-report.json', 'w'), indent=1); print(r); print(sorted(worst)[:6])
