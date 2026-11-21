#!/usr/bin/env python3
"""Score + SFX + mix for the full landscape video. Code-made score (pad + pluck arp, key/tempo per chapter, silence hole before THE NUMBER),
SFX on scene boundaries and key picture hits, voice-activity ducking with look-ahead, 1.2-4.5 kHz carve on the music, limiter, loudnorm to -14 LUFS.
python3 audio_mix.py -> audio/final.wav + audio/mix-report.json. Not auditioned by ear; numeric report only."""
import json, os, numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt, resample_poly
from scipy.ndimage import uniform_filter1d
R = os.path.dirname(os.path.abspath(__file__)); A = R + '/audio'; SR = 48000
_t = open(R + '/site/timing.js').read(); VT = json.loads(_t[_t.index('=') + 1:].rstrip().rstrip(';')); G = {g['g']: g['t0'] for g in VT['groups']}; DUR = VT['end']; N = int(DUR * SR)
GE = {g: (G[g + 1] if g + 1 in G else DUR) for g in G}; rng = np.random.default_rng(7)
vp = A + '/voice.wav'; v = np.zeros(10, 'float32')
if os.path.exists(vp):
    v, sr0 = sf.read(vp); v = v if v.ndim == 1 else v.mean(1); v = resample_poly(v, SR, sr0).astype('float32')
voice = np.zeros(N, 'float32'); voice[:min(N, len(v))] = v[:N]
def put(buf, x, t, g=1.0):
    i = int(t * SR)
    if i >= len(buf) or i < -len(x): return
    a = max(0, -i); j = min(len(buf), i + len(x)); buf[max(0, i):j] += x[a:a + j - max(0, i)] * g
def tone(f, dur, a=.01, dec=.3, harm=(1, .3, .1)):
    n = int(dur * SR); t = np.arange(n) / SR; x = sum(h * np.sin(2 * np.pi * f * (k + 1) * t) for k, h in enumerate(harm)); e = np.exp(-t / dec); e[:int(a * SR)] *= np.linspace(0, 1, max(1, int(a * SR))); return (x * e).astype('float32')
def noise(dur, lo=None, hi=None):
    x = rng.standard_normal(int(dur * SR)).astype('float32'); sos = butter(3, [lo / (SR / 2), hi / (SR / 2)], btype='band', output='sos'); return sosfilt(sos, x).astype('float32')
def whoosh(dur=.45):
    n = int(dur * SR); x = rng.standard_normal(n).astype('float32'); sw = np.linspace(400, 5000, n); y = np.zeros(n, 'float32')
    for k in range(0, n, 512):
        f = sw[k]; sos = butter(2, [max(80, f * .6) / (SR / 2), min(.99, f * 1.4 / (SR / 2))], btype='band', output='sos'); y[k:k + 512] = sosfilt(sos, x[k:k + 512])
    return (y * np.sin(np.linspace(0, np.pi, n)) ** 1.5 * 2.2).astype('float32')
def thump():
    a = tone(55, .6, .002, .18, (1, .5)) * 1.2; n = noise(.3, 100, 900) * np.exp(-np.arange(int(.3 * SR)) / SR / .05).astype('float32') * .4; a[:len(n)] += n; return a
def tick(f=1800): return tone(f, .12, .001, .03, (1, .4))
def coin(): return (tone(1568, .35, .001, .12, (1, .5, .25)) + tone(2093, .35, .001, .14, (1, .4)) * .7).astype('float32')
sfx = np.zeros(N, 'float32')
for g, t in G.items():
    if g > 1: put(sfx, whoosh(), t - .2, .25)
def hit(g, p, kind):
    t = G[g] + (GE[g] - G[g]) * p; put(sfx, {'thump': thump, 'coin': coin, 'tick': tick}[kind](), t, {'thump': .8, 'coin': .5, 'tick': .5}[kind])
hit(5, .7, 'thump'); hit(16, .6, 'thump'); hit(17, .8, 'thump'); hit(19, .55, 'thump'); hit(34, .85, 'thump'); hit(1, .1, 'coin'); hit(14, .1, 'coin'); hit(38, .5, 'coin')
for i in range(8): hit(10, .1 + i * .09, 'coin')
for i in range(5): hit(1, .56 + i * .03, 'tick')
# score: chapters -> (root Hz, scale intervals, bpm, level)
CH = [(1, 4, 0), (5, 8, 1), (9, 12, 2), (13, 18, 3), (19, 23, 4), (24, 28, 5), (29, 32, 6), (33, 37, 7), (38, 41, 8), (42, 45, 9)]
KEY = {0: (196, [0, 2, 4, 7, 9], 92, .9), 1: (174.6, [0, 3, 5, 7, 10], 84, .8), 2: (220, [0, 2, 4, 7, 9], 100, 1), 3: (164.8, [0, 3, 5, 7, 10], 88, .9), 4: (146.8, [0, 3, 5, 6, 10], 72, .8), 5: (196, [0, 2, 5, 7, 9], 96, 1), 6: (185, [0, 3, 5, 7, 10], 90, .9), 7: (130.8, [0, 3, 5, 7, 10], 66, .8), 8: (196, [0, 2, 4, 7, 9], 90, .9), 9: (220, [0, 2, 4, 7, 9], 100, 1)}
music = np.zeros(N, 'float32')
for g0, g1, ci in CH:
    t0 = G[g0]; t1 = GE[g1]; root, sc, bpm, lv = KEY[ci]; beat = 60 / bpm
    # pad: slowly changing triads
    k = 0; t = t0
    while t < t1:
        deg = [0, 3, 4, 2][k % 4]; f = root * 2 ** (sc[deg % len(sc)] / 12) / 2; d = min(beat * 8, t1 - t + 1.5)
        pad = sum(tone(f * m, d + 1.5, 1.2, d * .6 + .6, (1, .3)) * a for m, a in ((1, .5), (1.5, .35), (2, .3))); put(music, pad.astype('float32'), t, .13 * lv); t += beat * 8; k += 1
    # pluck arp on 8ths, thinner in dark chapters
    n = 0; t = t0
    while t < t1:
        if ci in (4, 7) and n % 2: n += 1; t += beat / 2; continue
        f = root * 2 * 2 ** (sc[(n * 3 + (n // 4)) % len(sc)] / 12); put(music, tone(f, .5, .004, .22, (1, .35, .12)), t, .075 * lv); n += 1; t += beat / 2
    # soft kick on beat from chapter 3 on, absent in chapters 4 and 7 (the honest/dark parts)
    if ci not in (0, 4, 7):
        t = t0
        while t < t1: put(music, tone(48, .25, .003, .08, (1,)) * .8, t, .22 * lv); t += beat
# the silence hole before THE NUMBER (group 33) and under the debt flash
m = np.ones(N, 'float32'); a, b = int((G[33] - .4) * SR), int((G[34] + .6) * SR); m[a:b] = np.linspace(1, .15, b - a) ** 2 if False else .12
music *= uniform_filter1d(m, int(.25 * SR))
# voice-activity ducking with look-ahead + carve
env = np.sqrt(np.maximum(0, uniform_filter1d(voice ** 2, int(.08 * SR)))); act = (env > .006).astype('float32'); act = np.maximum(act, np.roll(act, -int(.12 * SR))); duck = uniform_filter1d(act, int(.25 * SR))
music = music * (1 - .62 * duck); sos = butter(2, [1200 / (SR / 2), 4500 / (SR / 2)], btype='bandstop', output='sos'); mc = sosfilt(sos, music).astype('float32'); music = music * (1 - .5 * duck) + mc * (.5 * duck)
sfx *= (1 - .45 * duck)
mix = voice * 1.0 + music * .9 + sfx * .8; mix = np.tanh(mix * .9) / .9
sf.write(A + '/mix-pre.wav', mix, SR); subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', A + '/mix-pre.wav', '-af', 'loudnorm=I=-14:TP=-1.2:LRA=9', '-ar', '48000', A + '/final.wav'], check=True)
# numeric report: voice over music+SFX on voiced 250 ms windows
fin, _ = sf.read(A + '/final.wav'); rep = {}
if len(v) > 100:
    w = int(.25 * SR); rows = []
    for i in range(0, N - w, w):
        vv = voice[i:i + w]; mm = (music + sfx)[i:i + w]
        if np.sqrt((vv ** 2).mean()) > .02: rows.append(20 * np.log10(np.sqrt((vv ** 2).mean()) / (np.sqrt((mm ** 2).mean()) + 1e-9)))
    if rows: rep = dict(voice_over_music_median_db=round(float(np.median(rows)), 1), min_db=round(float(np.min(rows)), 1), p10_db=round(float(np.percentile(rows, 10)), 1), n=len(rows))
rep['note'] = 'numeric only, not auditioned'; json.dump(rep, open(A + '/mix-report.json', 'w'), indent=1); print(rep)
