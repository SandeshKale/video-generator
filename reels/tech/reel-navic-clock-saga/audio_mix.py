#!/usr/bin/env python3
"""Score + SFX + mix for 'The clock that broke India's GPS'.  python3 audio_mix.py   -> audio/final.wav (48 kHz) + audio/mix-report.json
The score is built from four voices (pad, arp, pulse, bell) that ENTER and LEAVE with the story: the three failed clocks (SFX kind 'stop') remove the bell, the arp
and the pulse one by one, the dark moment ends in near-silence, and the voices return on the turn (own clock, launch) and resolve on the last line.
SFX come from the page's own event list (audio/events.json). Mix rules: voice-activity ducking with look-ahead, 1.2-4.5 kHz carve, voice over music+SFX median >= 19 dB, min >= 13 dB."""
import json, os, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
from scipy.ndimage import uniform_filter1d
R = os.path.dirname(os.path.abspath(__file__)); A = R + '/audio'; SR = 48000
ev = json.load(open(A + '/events.json')); B = ev['B']; DUR = ev['dur']; N = int(DUR * SR); rng = np.random.default_rng(5)
v, sr0 = sf.read(A + '/voice-v3.wav'); v = v if v.ndim == 1 else v.mean(1); v = resample_poly(v, SR, sr0).astype('float32'); voice = np.zeros(N, 'float32'); voice[:min(N, len(v))] = v[:N]
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
for e in ev['ev']:
    t, k = e['t'], e['k']
    if k in ('slam', 'thud'): t += .25
    if k == 'ping': put(sfx, sm(tone(1320, .35, dec=.12) * .3, tone(1980, .25, dec=.08) * .12), t)
    elif k == 'slam': put(sfx, sm(tone(110, .5, f1=38, dec=.18) * .9, noise(.25, 200, 6000) * dec_n(.25, .06) * .4, tone(55, .8, dec=.3) * .35), t)
    elif k == 'thud': put(sfx, sm(tone(90, .35, f1=45, dec=.1) * .8, noise(.12, 100, 1500) * dec_n(.12, .03) * .25), t)
    elif k == 'pop': put(sfx, tone(500, .2, f1=1100, dec=.07) * .3, t)
    elif k == 'tick': put(sfx, noise(.02, 3000, 9000) * dec_n(.02, .006) * .5, t)
    elif k == 'stop': put(sfx, sm(tone(660, .5, f1=110, dec=.25) * .35, noise(.2, 400, 3000) * dec_n(.2, .08) * .2), t)
    elif k == 'buzz': put(sfx, sm(tone(110, .6, 'saw', dec=.35) * .22, tone(113, .6, 'saw', dec=.35) * .22), t)
    elif k == 'drop': put(sfx, tone(900, .3, f1=300, dec=.12) * .4, t)
    elif k == 'whoosh': put(sfx, whoosh(.5, True) * .5, t - .25)
    elif k == 'neon': put(sfx, sm(noise(.5, 900, 3000) * .08 * np.linspace(1, .2, int(.5*SR)), tone(880, .6, dec=.3) * .25, tone(1320, .6, dec=.3) * .15), t)
    elif k == 'rumble': put(sfx, sm(noise(3.0, 40, 400) * np.sin(np.linspace(0, np.pi, int(3.0*SR)))**1.2 * 1.2, tone(48, 3.0, 'saw', a=.5, dec=2.0) * .25), t)
for tb in B[1:-1]: put(sfx, whoosh(.4, True) * .28, tb - .5); put(sfx, tone(80, .3, f1=45, dec=.1) * .3, tb)
# ---------------- score: four voices that enter and leave ----------------
stops = sorted([e['t'] for e in ev['ev'] if e['k'] == 'stop'])[:3]           # the three clock failures
t_dark_end = B[8]; t_turn = B[9]; t_launch = B[10]; t_pay = B[11]; t_end = [e['t'] for e in ev['ev'] if e['k'] == 'neon'][-1]
def alive(voice_name, t):
    if voice_name == 'pad':   return not (t_dark_end - 1.4 < t < t_dark_end + .2)                  # the pad too leaves for the dark moment's silence
    if voice_name == 'bell':  return (t < (stops[0] if stops else 1e9)) or t >= t_turn + 1.0
    if voice_name == 'arp':   return (t < (stops[1] if len(stops) > 1 else 1e9)) or t >= t_turn + 3.0
    if voice_name == 'pulse': return (t < (stops[2] if len(stops) > 2 else 1e9)) or t >= t_launch
    return True
BPM = 96; beat = 60 / BPM; step = beat / 4; music = np.zeros(N, 'float32'); root = 55.0 * 2 ** (np.array([0, 0, 3, 5]) / 12)       # A, A, C, D bass movement, one bar each
i = 0; t = 0.0
while t < DUR:
    bar = int(i // 16) % 4; s16 = i % 16; late = t >= t_pay - 1.0
    if alive('pulse', t) and s16 % 4 == 0 and (B[1] > t or B[4] <= t < B[5] or t >= B[2]): put(music, tone(120, .25, f1=40, dec=.08) * (.8 if t > B[11] else .55), t)
    if alive('arp', t) and not (B[8] - 1.8 < t < B[9]): put(music, tone(root[bar] * 8 * 2 ** ([0, 7, 12, 7, 15, 12, 7, 3][s16 % 8] / 12), step * 1.6, dec=.08) * .11, t)
    if alive('bell', t) and s16 in (0, 8): put(music, sm(tone(root[bar] * 8, 1.2, dec=.5) * .12, tone(root[bar] * 12, 1.2, dec=.35) * .06), t)
    if alive('pad', t) and s16 == 0 and bar % 2 == 0:
        q = (0, 4, 7) if t >= t_end - .5 else (0, 3, 7)                                          # the last line resolves minor -> major
        for qq in q: put(music, tone(root[bar] * 4 * 2 ** (qq / 12), beat * 7.6, 'saw', a=.7, dec=3.2) * .035, t)
    if alive('pad', t) and s16 == 0: put(music, tone(root[bar], beat * 3.9, dec=2.5) * .22, t)
    i += 1; t = i * step
# ---------------- ducking + carve ----------------
vad = np.convolve(np.abs(voice), np.ones(int(.02 * SR)) / int(.02 * SR), 'same'); on = (vad > .02).astype('float32'); on = np.roll(on, -int(.09 * SR))
duck = np.minimum(1, uniform_filter1d(on, int(.18 * SR)) * 1.6); a_ = np.exp(-1 / (.08 * SR)); r_ = np.exp(-1 / (.3 * SR)); g = np.zeros(N, 'float32'); cur = float(duck[0])
for k in range(0, N, 64):
    tg = duck[k]; cur = tg + (cur - tg) * (a_ if tg > cur else r_)**64; g[k:k+64] = cur
MUS = float(os.environ.get('MUS', .2)); SFXG = float(os.environ.get('SFXG', .4))
sos = butter(2, [1200/(SR/2), 4500/(SR/2)], btype='band', output='sos'); music_d = music * MUS * (1 - .94 * g); music_d = music_d - .55 * sosfilt(sos, music_d) * g
sfx_d = sfx * SFXG * (1 - .86 * g)
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
