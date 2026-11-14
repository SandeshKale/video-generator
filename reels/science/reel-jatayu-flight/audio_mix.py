#!/usr/bin/env python3
"""Score + SFX + mix for 'Sooraj ko andar kaise laaye?' (own synthesis: tanpura floor in D, glass bells for light, soft plucks, low frame drum).
python3 audio_mix.py -> audio/final.wav (48 kHz) + audio/mix-report.json. SFX come from the page's own event list (audio/events.json).
Jatayu score: high wind bed, bowed pad in C, santoor-like plucks, slow frame drum; minor until the comeback (scene 9), major after; a hole in the music when the vultures vanish.
Mix rules: voice-activity ducking with look-ahead, 1.2-4.5 kHz carve, voice over music+SFX median >= 19 dB, min >= 13 dB."""
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
    for _ in range(6):                                  # keep stepping past words until the hit lands in a gap
        hit = [w for w in WD if w[1] - .02 < t < w[2]]
        if not hit: return t
        t = hit[0][2] + .03
    return t
def chime(f, d=.6, g=.3): return sm(tone(f, d, dec=d/3) * g, tone(f * 2.01, d * .7, dec=d/5) * g * .4, tone(f * 3.02, d * .5, dec=d/8) * g * .2)
SOFT = ('tick', 'pop', 'glint', 'thud', 'slide', 'relay', 'click', 'bell', 'chime', 'whoosh', 'rise')
HOLES = []
for e in ev['ev']:
    t, k = e['t'], e['k']
    if k in SOFT: t = soft_off_word(t)
    if k == 'pop': put(sfx, tone(520, .18, f1=1040, dec=.06) * .1, t)
    elif k == 'tick': put(sfx, sm(chime(1760, .25, .08), noise(.02, 3000, 9000) * dec_n(.02, .006) * .2), t)
    elif k == 'glint': put(sfx, sm(chime(2349.3, .7, .12), chime(3520, .5, .05)), t)
    elif k == 'bell': put(sfx, sm(chime(587.3, 2.4, .32), chime(1174.7, 1.8, .12), tone(146.8, 1.6, dec=.7) * .2), t)
    elif k == 'chime':
        for j in range(8): put(sfx, chime(1174.7 * 2 ** ([0, 4, 7, 12, 7, 4, 9, 12][j] / 12), .6, .06), t + j * .13)
    elif k == 'rise': put(sfx, sm(whoosh(1.6, True) * .2, tone(146.8, 1.6, 'saw', a=1.2, dec=1.0) * .03), t - .2)
    elif k == 'thud': put(sfx, sm(tone(70, .6, f1=35, dec=.2) * .8, noise(.1, 100, 1200) * dec_n(.1, .03) * .3), t)
    elif k == 'slide': put(sfx, sm(tone(880, 1.1, f1=220, dec=.6) * .12, noise(1.0, 500, 3000) * np.linspace(1, 0, int(1.0 * SR)) * .05), t)
    elif k == 'relay': put(sfx, sm(tone(180, .25, f1=120, dec=.08) * .35, noise(.05, 800, 4000) * dec_n(.05, .015) * .25), t)
    elif k == 'click':
        for j in range(4): put(sfx, sm(noise(.03, 1500, 7000) * dec_n(.03, .008) * .5, tone(1400, .05, dec=.015) * .2), t - .36 + j * .12)
        put(sfx, sm(tone(240, .2, f1=150, dec=.06) * .5, noise(.05, 900, 5000) * dec_n(.05, .012) * .4), t + .12)
    elif k == 'whoosh': put(sfx, whoosh(.55, False) * .2, t - .28)
    elif k == 'hole': HOLES.append(t)
    elif k == 'hit': put(sfx, .3 * sm(chime(293.7, 3.2, .5), chime(587.3, 2.6, .3), tone(73.4, 1.4, f1=50, dec=.5) * 1.1, noise(.12, 150, 2500) * dec_n(.12, .04) * .5, tone(220, 2.4, 'saw', a=.25, dec=1.4, f1=233) * .09), t)
    elif k == 'shutter': put(sfx, sm(noise(.03, 2000, 9000) * dec_n(.03, .008) * .5, tone(900, .05, dec=.015) * .2), t); put(sfx, noise(.04, 1500, 8000) * dec_n(.04, .01) * .4, t + .07)
# ---------------- score (C, our own: wind, bowed pad, santoor-like plucks, frame drum, bells) ----------------
BPM = 76; beat = 60 / BPM; step = beat / 4; music = np.zeros(N, 'float32'); D2 = 65.41
sc_of = lambda t: max(i for i in range(len(B) - 1) if B[i] <= t) if t < B[-1] else len(B) - 2
MINOR = [0, 3, 5, 7, 10, 12, 15, 17]; MAJOR = [0, 2, 4, 7, 9, 12, 14, 16]; RAGA = MINOR
def voices(t):
    s = sc_of(t)
    return dict(drone=True, drum=s not in (8,), pluck=s in (1, 2, 3, 4, 5, 6, 7, 9, 10, 11), bell=s in (0, 1, 5, 9, 10, 11), pulse=s == 6, low=s in (0, 6, 8), dry=s == 8, major=s >= 9)
def tanpura(f, d):   # four strings, slow bloom, rich partials
    n = int(d * SR); tt = np.arange(n) / SR; y = np.zeros(n, 'float32')
    for h in range(1, 7): y += (np.sin(2 * np.pi * f * h * tt * (1 + .0011 * h) + .6 * np.sin(2 * np.pi * .23 * h * tt)) / h ** 1.7).astype('float32')
    return (y * np.minimum(1, tt / 1.4) * np.minimum(1, (d - tt) / 1.2).clip(0)).astype('float32')
def pluck(f):  # sitar-like: bright attack + buzz
    return sm(tone(f, .9, dec=.2) * .5, tone(f * 1.004, .9, dec=.24) * .4, tone(f * 2.002, .5, dec=.09) * .22, tone(f * 4.01, .2, dec=.03) * .1, noise(.012, 4000, 9000) * dec_n(.012, .004) * .1)
i = 0; t = 0.0
while t < DUR:
    s16 = i % 16; bar = int(i // 16); V = voices(t); RAGA = MAJOR if V['major'] else MINOR
    if V['drone'] and s16 == 0 and bar % 2 == 0:
        for j, f in enumerate((D2 * 1.5, D2 * 2, D2 * 2, D2)): put(music, tanpura(f, beat * 8) * (.05 if not V['dry'] else .03), t + j * beat * 2)
    if V['drum'] and not any(w[1] - .15 < t < w[2] + .1 for w in WD if abs(w[1] - t) < 2 and w[0].endswith('।')):
        if s16 in (0, 10): put(music, sm(tone(65, .5, f1=45, dec=.18) * .9, noise(.04, 200, 1200) * dec_n(.04, .01) * .3), t)
        if s16 in (6, 12, 14): put(music, sm(noise(.08, 400, 4000) * dec_n(.08, .03) * .35, tone(220, .12, dec=.04) * .2), t)
    if V['low'] and s16 in (0, 8): put(music, tone(D2 / 2, beat * 1.8, dec=.6) * .25, t)
    if V['pluck'] and s16 % 2 == 0 and s16 not in (6, 14):
        n = RAGA[(s16 // 2 * 3 + bar * 2) % len(RAGA)]; put(music, pluck(D2 * 4 * 2 ** (n / 12)) * .07, t)
    if V['bell'] and s16 == 0 and bar % 2 == 1: put(music, chime(D2 * 16 * 2 ** (RAGA[bar % 5] / 12), 2.2, .05), t)
    if V['pulse'] and s16 % 2 == 0: put(music, tone(D2 * 2 * (1.5 if s16 % 8 == 4 else 1), step * 1.6, 'square', dec=.05) * .035, t)
    if V['dry'] and s16 % 4 == 0: put(music, noise(.015, 2500, 7000) * dec_n(.015, .005) * .12, t)
    i += 1; t = i * step
# wind bed: band noise with a slow swell, a little brighter when the camera is high
wn = noise(DUR + .1, 250, 1800)[:N]; tt_ = np.arange(N) / SR; music += (wn * (.05 + .035 * np.sin(2 * np.pi * .07 * tt_) + .02 * np.sin(2 * np.pi * .19 * tt_ + 1))).astype('float32')
def flute(f, d): 
    n = int(d * SR); tt = np.arange(n) / SR; vib = 1 + .006 * np.sin(2 * np.pi * 5.2 * tt) * np.minimum(1, tt / .3); ph = 2 * np.pi * np.cumsum(f * vib) / SR
    e = np.minimum(1, tt / .08) * np.minimum(1, (d - tt) / .18); return ((np.sin(ph) + .28 * np.sin(2 * ph) + .08 * np.sin(3 * ph)) * e + noise(d, 2000, 7000)[:n] * .03 * e).astype('float32')
SEN = json.load(open(A + '/words.json'))['sentences']; ends = sorted(set(round(x['t1'], 2) for x in SEN)) if isinstance(SEN, list) and SEN and 't1' in SEN[0] else []
for gi, te in enumerate(ends):
    nxt = min([w[1] for w in WD if w[1] > te + .05] or [DUR]); gap = nxt - te
    if gap > .45:
        RG = MAJOR if te >= B[9] else MINOR; n1 = RG[(gi * 3) % len(RG)]; n2 = RG[(gi * 3 + 2) % len(RG)]; put(music, flute(D2 * 8 * 2 ** (n1 / 12), min(.45, gap * .5)) * .5, te + .05); put(music, flute(D2 * 8 * 2 ** (n2 / 12), min(.6, gap * .6)) * .5, te + .05 + min(.4, gap * .45))
# holes: the music drops out for a beat when the light is lost (the miss, the cloud)
hm = np.ones(N, 'float32')
for ht in HOLES:
    a0, a1 = sec(ht - .15), sec(ht + 1.6); n_ = max(1, min(N, a1) - a0); hm[a0:a0 + n_] *= np.concatenate([np.linspace(1, .06, sec(.15)), np.full(max(0, n_ - sec(.15) - sec(.6)), .06, 'float32'), np.linspace(.06, 1, sec(.6))])[:n_]
music *= hm
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
