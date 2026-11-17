#!/usr/bin/env python3
"""Score + SFX + mix for the pala (frost) reel: cold glassy pad (own synthesis), breathing air bed, glass bells, soft low pulse; warms slightly on the remedies.
python3 audio_mix.py -> audio/final.wav + audio/mix-report.json. SFX from the page event list (audio/events.json).
Mix rules: voice-activity ducking with look-ahead, 1.2-4.5 kHz carve, audible bed (voice over music median ~16 dB, min >= 12 dB)."""
python3 audio_mix.py -> audio/final.wav (48 kHz) + audio/mix-report.json. SFX come from the page's own event list (audio/events.json).
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
SOFT = ('tick', 'whoosh', 'cloud', 'drop', 'ping')
for e in ev['ev']:
    t, k = e['t'], e['k']
    if k in SOFT: t = soft_off_word(t)
    if k == 'tick': put(sfx, sm(chime(1760, .25, .08), noise(.02, 3000, 9000) * dec_n(.02, .006) * .2), t)
    elif k == 'ping': put(sfx, sm(chime(1318.5, .9, .14), chime(1975.5, .6, .05)), t)
    elif k == 'whoosh': put(sfx, whoosh(.55, False) * .16, t - .28)
    elif k == 'stamp': put(sfx, sm(tone(90, .5, f1=45, dec=.15) * .9, noise(.06, 300, 3000) * dec_n(.06, .02) * .45), t)
    elif k == 'hit': put(sfx, .3 * sm(chime(329.6, 3.0, .5), chime(659.3, 2.4, .25), tone(82.4, 1.4, f1=55, dec=.5) * 1.0, noise(.1, 200, 3000) * dec_n(.1, .04) * .4), t)
    elif k == 'cloud': put(sfx, sm(noise(1.2, 300, 2500) * np.sin(np.linspace(0, np.pi, int(1.2 * SR))) * .06, chime(659.3, 1.0, .05)), t)
    elif k == 'low': put(sfx, tone(65.4, 1.8, f1=55, dec=.8) * .35, t)
    elif k == 'drop': put(sfx, sm(tone(1480, .3, f1=700, dec=.07) * .18, chime(1046.5, .7, .06)), t)
# ---------------- score: cold glass pad in E minor, breathing air, sparse bells, slow low pulse ----------------
BPM = 66; beat = 60 / BPM; music = np.zeros(N, 'float32'); E2 = 82.41
SCALE = [0, 3, 7, 10, 12, 15, 19]
def pad(f, d):
    n = int(d * SR); tt = np.arange(n) / SR; y = np.zeros(n, 'float32')
    for h, a in ((1, 1), (2, .4), (3, .18), (4, .08)): y += (a * np.sin(2 * np.pi * f * h * tt * (1 + .0013 * h) + .8 * np.sin(2 * np.pi * .17 * h * tt))).astype('float32')
    return (y * np.minimum(1, tt / 2.0) * np.minimum(1, (d - tt) / 2.0).clip(0)).astype('float32')
bars = int(DUR / (beat * 8)) + 2
for b_ in range(bars):
    t0 = b_ * beat * 8; root = E2 * 2 ** ([0, 0, -2, -2, 3, 3, -5, 0][b_ % 8] / 12)
    for j, m_ in enumerate((0, 7, 12)): put(music, pad(root * 2 ** (m_ / 12), beat * 9) * .07, t0)
    if b_ % 2 == 1: put(music, chime(root * 8 * 2 ** (SCALE[(b_ * 3) % len(SCALE)] / 12), 2.4, .05), t0 + beat * 2)
    if t0 > 4:
        for q in range(4): put(music, sm(tone(root, beat * .9, f1=root * .8, dec=.3) * .22), t0 + q * beat * 2)
wn = noise(DUR + .1, 300, 2400)[:N]; tt_ = np.arange(N) / SR; music += (wn * (.04 + .03 * np.sin(2 * np.pi * .06 * tt_) + .015 * np.sin(2 * np.pi * .17 * tt_ + 1))).astype('float32')
# a held breath of silence right before the stamp lands (ground frost)
try:
    st_ = [e['t'] for e in ev['ev'] if e['k'] == 'stamp'][0]; hm = np.ones(N, 'float32'); a0 = sec(st_ - .3); a1 = sec(st_ + 1.0); hm[a0:a1] = np.concatenate([np.linspace(1, .12, sec(.2)), np.full(a1 - a0 - sec(.2) - sec(.5), .12, 'float32'), np.linspace(.12, 1, sec(.5))])[:a1 - a0]; music *= hm
except Exception as ex: print('no stamp hole', ex)

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
