#!/usr/bin/env python3
"""Score + SFX + mix for 'Billionaire ka right swipe' (Swipe Deck score: marimba plucks, shaker, wood-block claps, warm pad).  python3 audio_mix.py   -> audio/final.wav (48 kHz) + audio/mix-report.json
The score is a stage groove that gains a voice per step (kick+pad hook, bass on the math, pluck on step 1, hats+clap on the waiting room, lock motif on the seat hold),
drops out on the lost payment reply, glitches at the bots, strips to a pad for the honest part and resolves to major on the last line.
SFX come from the page's own event list (audio/events.json). Mix rules: voice-activity ducking with look-ahead, 1.2-4.5 kHz carve, voice over music+SFX median >= 19 dB, min >= 13 dB."""
import json, os, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
from scipy.ndimage import uniform_filter1d
R = os.path.dirname(os.path.abspath(__file__)); A = R + '/audio'; SR = 48000
ev = json.load(open(A + '/events.json')); B = ev['B']; DUR = ev['dur']; N = int(DUR * SR); rng = np.random.default_rng(5)
vp = A + '/voice-v3.wav'
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
for e in ev['ev']:
    t, k = e['t'], e['k']
    if k in ('whoosh', 'pop', 'ping', 'buzz', 'card', 'drop'):                    # soft cues never sit on top of a word's tail
        for w in WD:
            if w[1] + .03 < t < w[2]: t = w[2] + .03; break
    if k in ('slam',): t += .25
    if k in ('whoosh', 'tick', 'pop', 'ping', 'buzz', 'card', 'drop'):
        w0 = t - .25 if k == 'whoosh' else t; w1 = w0 + (.5 if k == 'whoosh' else .1)
        if any(min(w1, w[2]) - max(w0, w[1]) > .08 for w in WD): continue
    if k == 'ping': put(sfx, sm(tone(1320, .35, dec=.12) * .3, tone(1980, .25, dec=.08) * .12), t)
    elif k == 'slam': put(sfx, sm(tone(110, .5, f1=38, dec=.18) * .9, noise(.25, 200, 6000) * dec_n(.25, .06) * .4, tone(55, .8, dec=.3) * .35), t)
    elif k == 'pop': put(sfx, tone(500, .2, f1=1100, dec=.07) * .3, t)
    elif k == 'card': put(sfx, sm(tone(660, .22, f1=1320, dec=.08) * .26, noise(.06, 3000, 9000) * dec_n(.06, .02) * .25), t)
    elif k == 'tick': put(sfx, noise(.02, 3000, 9000) * dec_n(.02, .006) * .22, t)
    elif k == 'buzz': put(sfx, sm(tone(110, .5, 'saw', dec=.3) * .2, tone(113, .5, 'saw', dec=.3) * .2), t)
    elif k == 'drop': put(sfx, tone(900, .35, f1=250, dec=.14) * .4, t)
    elif k == 'whoosh': put(sfx, whoosh(.5, True) * .5, t - .25)
    elif k == 'rumble': put(sfx, sm(noise(2.4, 40, 500) * np.sin(np.linspace(0, np.pi, int(2.4*SR)))**1.2 * 1.1, tone(48, 2.4, 'saw', a=.5, dec=1.6) * .22), t)
for tb in B[1:-1]: put(sfx, whoosh(.4, True) * .1, tb - .5); put(sfx, tone(80, .3, f1=45, dec=.1) * .3, tb)
# ---------------- score ----------------
BPM = 112; beat = 60 / BPM; step = beat / 4; music = np.zeros(N, 'float32'); root = 55.0 * 2 ** (np.array([3, 0, 8, 10]) / 12)       # C, Am, F, G (one bar each)
sc_of = lambda t: max(i for i in range(len(B) - 1) if B[i] <= t) if t < B[-1] else len(B) - 2
def voices(t):
    s = sc_of(t); v = dict(kick=s in (0, 5, 8, 11), pad=True, bass=s in (1, 2, 3, 4, 5, 6, 7, 8, 11), pluck=s in (0, 1, 3, 4, 6, 7, 10, 11), hat=s in (5, 6, 7, 8, 11), lock=s in (2, 4, 7, 10, 11))
    if s == 9: v.update(kick=False, bass=False, pluck=False, hat=False, lock=False)        # the honest part: pad only
    return v
i = 0; t = 0.0
while t < DUR:
    bar = int(i // 16) % 4; s16 = i % 16; V = voices(t); late = sc_of(t) == 11
    if V['kick'] and s16 % 4 == 0: put(music, tone(120, .25, f1=40, dec=.08) * (.7), t)
    if V['bass'] and s16 % 2 == 0 and s16 % 8 != 6: put(music, tone(root[bar] * (1 if s16 % 8 else 2), step * 1.8, 'saw', dec=.09) * .09, t)
    if V['pluck'] and s16 % 2 == 0: put(music, tone(root[bar] * 8 * 2 ** ([0, 4, 7, 4, 12, 9, 7, 4][(s16 // 2) % 8] / 12), step * 1.6, dec=.07) * .11, t)
    if V['hat'] and s16 % 2 == 1: put(music, noise(.04, 6000, 12000) * dec_n(.04, .012) * .22, t)
    if V['hat'] and s16 in (4, 12): put(music, noise(.12, 1200, 5000) * dec_n(.12, .04) * .3, t)                                     # clap
    if V['lock'] and s16 in (0, 6): put(music, sm(tone(root[bar] * 8, .9, dec=.35) * .12, tone(root[bar] * 12, .9, dec=.25) * .06), t)
    if V['pad'] and s16 == 0 and bar % 2 == 0:
        q = (0, 4, 7) if (late or sc_of(t) != 9) else (0, 3, 7)                                                    # the last scene resolves minor -> major
        for qq in q: put(music, tone(root[bar] * 4 * 2 ** (qq / 12), beat * 7.6, 'saw', a=.7, dec=3.2) * .035, t)
    if V['pad'] and s16 == 0: put(music, tone(root[bar], beat * 3.9, dec=2.5) * .2, t)
    i += 1; t = i * step
# ---------------- ducking + carve ----------------
vad = np.convolve(np.abs(voice), np.ones(int(.02 * SR)) / int(.02 * SR), 'same'); on = (vad > .02).astype('float32'); on = np.roll(on, -int(.09 * SR))
duck = np.minimum(1, uniform_filter1d(on, int(.18 * SR)) * 1.6); a_ = np.exp(-1 / (.08 * SR)); r_ = np.exp(-1 / (.3 * SR)); g = np.zeros(N, 'float32'); cur = float(duck[0])
for k in range(0, N, 64):
    tg = duck[k]; cur = tg + (cur - tg) * (a_ if tg > cur else r_)**64; g[k:k+64] = cur
MUS = float(os.environ.get('MUS', .2)); SFXG = float(os.environ.get('SFXG', .4))
sos = butter(2, [1200/(SR/2), 4500/(SR/2)], btype='band', output='sos'); music_d = music * MUS * (1 - .975 * g); music_d = music_d - .55 * sosfilt(sos, music_d) * g
sfx_d = sfx * SFXG * (1 - .92 * g)
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
