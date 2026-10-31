#!/usr/bin/env python3
"""Score + SFX + mix for 'Itna jaldi kaise?'.  python3 audio_mix.py   -> audio/final.wav (48 kHz), audio/mix-report.json
Music: one dark minor groove whose layers switch by scene (so cuts land on the bar); SFX come from the page's own event list (audio/events.json).
Mix rules (CLAUDE.md): voice-activity ducking, 1.2-4.5 kHz carve on the music, voice over music+SFX median >= 19 dB and min >= 13 dB on voiced frames, -14 LUFS."""
import json, os, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt, resample_poly, lfilter
R = os.path.dirname(os.path.abspath(__file__)); A = R + '/audio'; SR = 48000
ev = json.load(open(A + '/events.json')); B = ev['B']; DUR = ev['dur']; N = int(DUR * SR); rng = np.random.default_rng(11)
v, sr0 = sf.read(A + '/voice-v3.wav'); v = v if v.ndim == 1 else v.mean(1); v = resample_poly(v, SR, sr0).astype('float32'); voice = np.zeros(N, 'float32'); voice[:min(N, len(v))] = v[:N]
def sec(t): return int(t * SR)
def env_adsr(n, a=.005, d=.1, s=.0, r=.05):
    e = np.ones(n, 'float32'); na, nd = int(a*SR), int(d*SR); e[:na] = np.linspace(0, 1, max(1, na)); 
    if n > na + nd: e[na:na+nd] = np.linspace(1, s, nd); e[na+nd:] = s
    return e * np.exp(-np.linspace(0, 1, n) * (1/ max(r, .01)) * 0.0) if False else e
def tone(f, dur, shape='sine', a=.004, dec=.15, f1=None):
    n = max(8, int(dur * SR)); t = np.arange(n) / SR; ff = f if f1 is None else np.linspace(f, f1, n); ph = 2*np.pi*np.cumsum(ff)/SR
    x = np.sin(ph) if shape == 'sine' else (np.sign(np.sin(ph)) * .6 if shape == 'square' else 2*((ph/(2*np.pi)) % 1) - 1)
    e = np.exp(-t / max(dec, .01)); e[:int(a*SR)] *= np.linspace(0, 1, max(1, int(a*SR))); return (x * e).astype('float32')
def noise(dur, lo=None, hi=None):
    x = rng.standard_normal(int(dur*SR)).astype('float32')
    if lo or hi:
        sos = butter(3, [lo/(SR/2), hi/(SR/2)] if lo and hi else (hi/(SR/2) if hi else lo/(SR/2)), btype='band' if lo and hi else ('low' if hi else 'high'), output='sos'); x = sosfilt(sos, x).astype('float32')
    return x
def put(buf, x, t, g=1.0):
    i = sec(t)
    if i >= len(buf): return
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j-i] * g
def whoosh(dur=.5, up=True):
    n = int(dur*SR); x = noise(dur); sw = np.linspace(300, 6000, n) if up else np.linspace(6000, 300, n); y = np.zeros(n, 'float32')
    for k in range(0, n, 512):
        f = sw[k]; sos = butter(2, [max(80, f*.6)/(SR/2), min(.99, f*1.4/(SR/2))], btype='band', output='sos'); y[k:k+512] = sosfilt(sos, x[k:k+512])
    e = np.sin(np.linspace(0, np.pi, n))**1.5; return (y * e * 3.0).astype('float32')
# ------------------------------- SFX from the page events -------------------------------
sfx = np.zeros(N, 'float32')
def sm(*xs):
    n = max(len(x) for x in xs); y = np.zeros(n, 'float32')
    for x in xs: y[:len(x)] += x
    return y
def dec_n(n, tau): return np.exp(-np.arange(int(n*SR))/SR/tau).astype('float32')
for e in ev['ev']:
    t, k = e['t'], e['k']
    if k in ('slam', 'thud'): t += .3
    if k == 'ping': put(sfx, sm(tone(1320, .35, 'sine', dec=.12) * .35, tone(1980, .25, 'sine', dec=.08) * .15), t)
    elif k == 'slam': put(sfx, sm(tone(110, .5, 'sine', f1=38, dec=.18) * 1.0, noise(.25, 200, 6000) * dec_n(.25, .06) * .5, tone(55, .8, 'sine', dec=.3) * .4), t)
    elif k == 'thud': put(sfx, sm(tone(90, .35, 'sine', f1=45, dec=.1) * .9, noise(.12, 100, 1500) * dec_n(.12, .03) * .3), t)
    elif k == 'pop': put(sfx, tone(500, .2, 'sine', f1=1100, dec=.07) * .3, t)
    elif k == 'tab': put(sfx, sm(tone(700, .12, 'square', dec=.05) * .25, tone(1400, .2, 'sine', dec=.1) * .25), t)
    elif k == 'freeze': put(sfx, sm(whoosh(.4, False) * .6, tone(70, .6, 'sine', dec=.25) * .6), t - .05)
    elif k == 'swell': put(sfx, whoosh(.6, True) * .4, t - .5)
    elif k == 'ring': put(sfx, sm(tone(300, .9, 'sine', f1=900, dec=.45) * .3, whoosh(.7, True) * .25), t - .3)
    elif k == 'whoosh': put(sfx, whoosh(.5, True) * .55, t - .25)
    elif k == 'scan': put(sfx, tone(400, .8, 'saw', f1=1800, dec=.5) * .18, t)
    elif k == 'beep': put(sfx, tone(1800, .09, 'square', dec=.04) * .3, t)
    elif k == 'spike': put(sfx, tone(600, .2, 'sine', f1=1300, dec=.08) * .4, t)
    elif k == 'drop': put(sfx, tone(900, .3, 'sine', f1=300, dec=.12) * .45, t)
    elif k == 'flick': put(sfx, noise(.35, 2000, 9000) * (rng.random(int(.35*SR)) > .55) * .22, t)
    elif k == 'neon': put(sfx, sm(noise(.5, 900, 3000) * .1 * np.linspace(1, .2, int(.5*SR)), tone(120, 1.2, 'saw', dec=.6) * .08, tone(880, .35, 'sine', dec=.2) * .25), t)
    elif k == 'tick': put(sfx, noise(.02, 3000, 9000) * dec_n(.02, .006) * .5, t)
for tb in B[1:-1]: put(sfx, whoosh(.4, True) * .3, tb - .5); put(sfx, tone(80, .3, 'sine', f1=45, dec=.1) * .35, tb)       # scene cuts
# ------------------------------- music: layers switch by scene -------------------------------
BPM = 112; beat = 60 / BPM; music = np.zeros(N, 'float32'); root = 55.0 * 2 ** (np.array([0, 0, 3, 0, 5, 3, 7, 5]) / 12)        # A minor-ish bass movement per bar
def scene_of(t): return max(i for i in range(len(B) - 1) if t >= B[i])
LAY = {   # scene -> (kick, hat, bass, arp, pad, clap)
 0: (1, 1, 1, 0, 0, 0), 1: (0, 1, 1, 0, 1, 0), 2: (1, 1, 1, 1, 0, 1), 3: (1, 0, 1, 1, 1, 0), 4: (1, 1, 1, 1, 0, 0), 5: (1, 1, 1, 1, 0, 0),
 6: (1, 1, 1, 0, 1, 1), 7: (0, 0, 1, 0, 1, 0), 8: (0, 1, 0, 1, 1, 0), 9: (1, 1, 1, 1, 1, 1), 10: (1, 1, 1, 1, 1, 1)}
t = 0.0; step = beat / 4; i = 0
while t < DUR:
    si = scene_of(t); kick, hat, bass, arp, pad, clap = LAY[si]; bar = int(i // 16) % len(root); s16 = i % 16
    if kick and s16 % 4 == 0: put(music, tone(130, .28, 'sine', f1=42, dec=.09) * .9, t)
    if clap and s16 in (4, 12): put(music, noise(.15, 1200, 7000) * dec_n(.15, .05) * .35, t)
    if hat and s16 % 2 == 1: put(music, noise(.05, 6000, None) * dec_n(.05, .012) * .16, t)
    if bass and s16 in (0, 3, 6, 8, 11, 14): put(music, sm(tone(root[bar], step * 1.8, 'saw', dec=.12) * .25, tone(root[bar], step*1.8, 'sine', dec=.15) * .3), t)
    if arp: put(music, tone(root[bar] * 4 * 2 ** ([0, 3, 7, 12, 7, 3, 10, 7][s16 % 8] / 12), step * 1.5, 'saw', dec=.09) * .09, t)
    if pad and s16 == 0 and bar % 2 == 0:
        for q in (0, 3, 7): put(music, tone(root[bar] * 4 * 2 ** (q/12), beat * 7.5, 'saw', a=.6, dec=3.0) * .035, t)
    i += 1; t = i * step
# a held drone under the honest part (scene 7) and a hole + hit on the hook's strike and the freeze
for a_, b_ in [(B[7], B[8])]: put(music, tone(55, b_ - a_, 'saw', a=.5, dec=8) * .09, a_)
def hole(t0, d=.3):
    m = np.ones(N, 'float32'); m[sec(t0):sec(t0 + d)] = np.linspace(.05, 1, sec(t0 + d) - sec(t0)); return m
for e in ev['ev']:
    if e['k'] in ('slam', 'freeze') and e['t'] < 10: music *= hole(e['t'], .35)
# ------------------------------- ducking + carve -------------------------------
vad = np.abs(voice); win = int(.02 * SR); vad = np.convolve(vad, np.ones(win) / win, 'same'); on = (vad > .02).astype('float32'); on = np.roll(on, -int(.09 * SR))
from scipy.ndimage import uniform_filter1d
duck = uniform_filter1d(on, int(.18 * SR)); duck = np.minimum(1, duck * 1.6); a_ = np.exp(-1 / (.08 * SR)); r_ = np.exp(-1 / (.3 * SR)); g = np.zeros(N, 'float32'); cur = float(duck[0])
for k in range(0, N, 64):
    tgt = duck[k]; cur = tgt + (cur - tgt) * (a_ if tgt > cur else r_)**64; g[k:k+64] = cur
MUS = float(os.environ.get('MUS', .22)); music_d = music * MUS * (1 - .94 * g); sos = butter(2, [1200/(SR/2), 4500/(SR/2)], btype='band', output='sos'); music_d = music_d - .55 * sosfilt(sos, music_d) * g
SFXG = float(os.environ.get('SFXG', .5)); sfx_d = sfx * SFXG * (1 - .86 * g)
# gap lift: the music opens a little where there is no voice
mix = voice * 1.0 + music_d * 1.0 + sfx_d * 1.0
pk = np.max(np.abs(mix)); mix = mix / max(1, pk / .89)
sf.write(A + '/mix-pre.wav', mix, SR)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', A + '/mix-pre.wav', '-af', 'loudnorm=I=-14:TP=-1.2:LRA=9', '-ar', '48000', A + '/final.wav'], check=True)
fin, _ = sf.read(A + '/final.wav'); fin = fin if fin.ndim == 1 else fin.mean(1)
# ---- report: voice vs (music+sfx) on voiced 250 ms windows inside words ----
worst = []; W = json.load(open(A + '/words.json'))['words']; sc = len(fin) / len(mix); ratios = []
for w in W:
    for t0 in np.arange(w[1], w[2] - .25, .25):
        a, b = sec(t0), sec(t0 + .25); vv = np.sqrt(np.mean(voice[a:b] ** 2)); oo = np.sqrt(np.mean((music_d[a:b] + sfx_d[a:b]) ** 2)) + 1e-9
        if vv > .01: ratios.append(20 * np.log10(vv / oo)); worst.append((round(20 * np.log10(vv / oo), 1), round(t0, 2), w[0]))
r = dict(median_db=round(float(np.median(ratios)), 1), min_db=round(float(np.min(ratios)), 1), p10_db=round(float(np.percentile(ratios, 10)), 1), n=len(ratios))
out = subprocess.run(['ffmpeg', '-v', 'info', '-i', A + '/final.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
import re; m = re.findall(r'I:\s+(-?[\d.]+) LUFS', out); tp = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', out); r['lufs'] = float(m[-1]) if m else None; r['true_peak_dbfs'] = float(tp[-1]) if tp else None
json.dump(r, open(A + '/mix-report.json', 'w'), indent=1); print(r)
print(sorted(worst)[:8])
for t0 in (43.23, 18.61, 0.0):
    a, b = sec(t0), sec(t0 + .25); print(t0, 'voice', round(float(np.sqrt(np.mean(voice[a:b]**2))), 4), 'music', round(float(np.sqrt(np.mean(music_d[a:b]**2))), 4), 'sfx', round(float(np.sqrt(np.mean(sfx_d[a:b]**2))), 4))
