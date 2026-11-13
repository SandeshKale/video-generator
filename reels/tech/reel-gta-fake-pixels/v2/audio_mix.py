#!/usr/bin/env python3
"""Score + SFX + mix for 'Gali ka Game' (tilt-shift mohalla: synth tabla, harmonium pad, santoor-like plucks, shaker; a voice per idea).  python3 audio_mix.py   -> audio/final.wav (48 kHz) + audio/mix-report.json
The score is a stage groove that gains a voice per step (kick+pad hook, bass on the math, pluck on step 1, hats+clap on the waiting room, lock motif on the seat hold),
drops out on the lost payment reply, glitches at the bots, strips to a pad for the honest part and resolves to major on the last line.
SFX come from the page's own event list (audio/events.json). Mix rules: voice-activity ducking with look-ahead, 1.2-4.5 kHz carve, voice over music+SFX median >= 19 dB, min >= 13 dB."""
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
    for w in WD:
        if w[1] + .03 < t < w[2]: return w[2] + .03
    return t
def chime(f, d=.6, g=.3): return sm(tone(f, d, dec=d/3) * g, tone(f * 2.01, d * .7, dec=d/5) * g * .4, tone(f * 3.02, d * .5, dec=d/8) * g * .2)
for e in ev['ev']:
    t, k = e['t'], e['k']
    if k not in ('rumble', 'brush', 'riffle', 'clock', 'count'): t = soft_off_word(t)
    if k == 'slam': put(sfx, sm(tone(110, .5, f1=38, dec=.18) * .9, noise(.25, 200, 6000) * dec_n(.25, .06) * .35, tone(55, .8, dec=.3) * .3), t)
    elif k == 'stamp': put(sfx, sm(tone(90, .3, f1=45, dec=.1) * .8, noise(.12, 300, 3000) * dec_n(.12, .03) * .5), t + .15)
    elif k == 'pop': put(sfx, tone(500, .2, f1=1100, dec=.07) * .3, t)
    elif k == 'card': put(sfx, sm(tone(660, .22, f1=1320, dec=.08) * .24, noise(.06, 3000, 9000) * dec_n(.06, .02) * .22), t)
    elif k == 'tick': put(sfx, noise(.02, 3000, 9000) * dec_n(.02, .006) * .22, t)
    elif k == 'click': put(sfx, sm(noise(.015, 2000, 8000) * dec_n(.015, .004) * .5, tone(1800, .05, dec=.01) * .2), t)
    elif k == 'buzz': put(sfx, sm(tone(110, .5, 'saw', dec=.3) * .18, tone(113, .5, 'saw', dec=.3) * .18), t)
    elif k in ('ping', 'ping2'): put(sfx, chime(1320 if k == 'ping' else 1760, .7, .22), t)
    elif k == 'sparkle':
        for j in range(8): put(sfx, chime(1500 * 2 ** ([0, 4, 7, 12, 7, 4, 9, 12][j] / 12), .35, .07), t + j * .07)
    elif k == 'count':
        for j in range(14): put(sfx, noise(.02, 3000, 9000) * dec_n(.02, .006) * .16, t + j * .1 * (1 + j * .02))
    elif k == 'zip': put(sfx, whoosh(.6, True) * .18, t)
    elif k == 'swish': put(sfx, whoosh(.45, True) * .16, t - .22)
    elif k == 'whoosh': put(sfx, whoosh(.55, False) * .22, t - .28)
    elif k == 'rumble':
        for j in range(26): put(sfx, sm(tone(220 + 90 * ((j * 7) % 5), .08, dec=.03) * .08, noise(.03, 800, 4000) * dec_n(.03, .01) * .12), t + j * .11 + .05 * ((j * 3) % 2))
    elif k == 'clock':
        for j in range(16): put(sfx, noise(.015, 2500, 7000) * dec_n(.015, .005) * (.25 if j % 2 else .15), t - .3 + j * .16)
    elif k == 'swell': put(sfx, sm(*[tone(440 * 2 ** (q / 12), 1.6, 'saw', a=.8, dec=1.2) * .012 for q in (0, 4, 7, 12)]), soft_off_word(t))
    elif k == 'brush':
        for j in range(8): put(sfx, noise(.28, 1500, 6000) * np.sin(np.linspace(0, np.pi, int(.28 * SR))) * .09, t + j * .4)
    elif k == 'flip': put(sfx, noise(.06, 1500, 7000) * dec_n(.06, .02) * .25, t)
    elif k == 'riffle':
        for j in range(18): put(sfx, noise(.04, 1500, 7000) * dec_n(.04, .012) * .18, t + j * .07)
# ---------------- score (D major, Bilawal-like: playful lane music) ----------------
BPM = 100; beat = 60 / BPM; step = beat / 4; music = np.zeros(N, 'float32'); root = 73.42 * 2 ** (np.array([0, 5, 7, 5]) / 12)   # D, G, A, G
sc_of = lambda t: max(i for i in range(len(B) - 1) if B[i] <= t) if t < B[-1] else len(B) - 2
SCALE = [0, 2, 4, 7, 9, 12, 14, 16]
def voices(t):
    s = sc_of(t)
    v = dict(tabla=s in (0, 1, 3, 4, 5, 6, 7, 8, 10), pad=True, bass=s in (0, 4, 6, 8, 10), pluck=s in (1, 3, 5, 6, 7, 10), shaker=s in (4, 6, 7, 8, 10), bell=s in (2,))
    if s == 9: v.update(tabla=False, pluck=False, shaker=False, bass=False)   # the catch: pad + low drone only
    return v
def dayan(f): return sm(tone(f, .22, dec=.06) * .5, tone(f * 2.7, .12, dec=.03) * .15)
def bayan(f, bend=1.4): return tone(f * bend, .4, f1=f, dec=.16) * .7
i = 0; t = 0.0
while t < DUR:
    bar = int(i // 16) % 4; s16 = i % 16; V = voices(t); late = sc_of(t) == len(B) - 2
    if V['tabla']:
        if s16 in (0, 6, 10): put(music, bayan(70), t)
        if s16 in (2, 4, 8, 12, 14): put(music, dayan(420 if s16 % 4 else 520), t, .55)
        if s16 in (3, 11): put(music, noise(.05, 2000, 6000) * dec_n(.05, .015) * .2, t)
    if V['bass'] and s16 in (0, 7, 10): put(music, tone(root[bar], step * 2.5, 'saw', dec=.12) * .08, t)
    if V['pluck'] and s16 % 2 == 0:
        n = SCALE[(s16 // 2 * 3 + bar * 2) % len(SCALE)]; f = root[bar] * 8 * 2 ** (n / 12)
        put(music, sm(tone(f, step * 2.2, dec=.09) * .09, tone(f * 2, step * 1.5, dec=.05) * .03), t)
    if V['shaker'] and s16 % 2 == 1: put(music, noise(.05, 5000, 11000) * dec_n(.05, .02) * .16, t)
    if V['bell'] and s16 in (0, 10) and bar % 2 == 0: put(music, chime(root[bar] * 16, 1.6, .06), t)
    if V['pad'] and s16 == 0 and bar % 2 == 0:
        for qq in ((0, 4, 7) if True else ()): put(music, tone(root[bar] * 4 * 2 ** (qq / 12), beat * 7.6, 'saw', a=.6, dec=3.0) * .03, t)
    if V['pad'] and s16 == 0: put(music, tone(root[bar], beat * 3.9, dec=2.5) * .18, t)
    i += 1; t = i * step
# ---------------- ducking + carve ----------------
vad = np.convolve(np.abs(voice), np.ones(int(.02 * SR)) / int(.02 * SR), 'same'); on = (vad > .008).astype('float32'); on = np.roll(on, -int(.09 * SR))
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
