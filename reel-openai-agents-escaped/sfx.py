# Procedural music bed + SFX from events.json, mixed with voice (sidechain-ducked) -> audio/final.wav
import json, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 44100
ev = json.load(open('events.json')); tim = json.load(open('timing.json'))
total = tim['total'] + 0.5
N = int(total * SR); rng = np.random.default_rng(7)
def lp(x, f): b, a = butter(2, f / (SR / 2), 'low'); return lfilter(b, a, x)
def hp(x, f): b, a = butter(2, f / (SR / 2), 'high'); return lfilter(b, a, x)
def put(buf, x, t, g=1.0):
    i = int(t * SR)
    if i < 0 or i >= len(buf): return
    x = x[: len(buf) - i]; buf[i:i + len(x)] += x * g
def env(n, a=.005, d=.2, p=3):
    t = np.arange(n) / SR; return np.minimum(t / a, 1) * np.exp(-t / d * p)

# ---------- music: 104 bpm, Am-F-C-G pad + sub + pluck arp + soft hat ----------
bpm = 112; beat = 60 / bpm
music = np.zeros(N)
roots = [57, 57, 53, 52]   # A F C G (midi, bass octave up)
fr = lambda m: 440 * 2 ** ((m - 69) / 12)
bar = beat * 4
nb = int(total / bar) + 1
for b in range(nb):
    t0 = b * bar; r = roots[b % 4]; n = int(bar * SR)
    t = np.arange(n) / SR
    inten = 0.55 + 0.45 * min(1, t0 / (total * .6))
    # sub bass
    sub = np.sin(2 * np.pi * fr(r - 12) * t) * (.9 + .1 * np.sin(2 * np.pi * 2 * t)) * np.minimum(t / .05, 1) * np.minimum((bar - t) / .1, 1)
    put(music, sub, t0, .30)
    # pad (detuned saws, lowpassed)
    pad = np.zeros(n)
    for iv in (0, 7, 12, 15 if b % 4 in (0, 1) else 16):
        for det in (-.15, .15):
            f = fr(r + 12 + iv) * (1 + det * .01)
            pad += ((2 * ((f * t) % 1) - 1)) * .12
    pad = lp(pad, 900 + 700 * inten) * np.minimum(t / .8, 1) * np.minimum((bar - t) / .6, 1)
    put(music, pad, t0, .30)
    # arp pluck 8ths
    for k in range(8):
        m = r + 24 + [0, 7, 12, 7, 15, 12, 7, 3][k] + (0 if b % 4 in (0, 1) else 1 if k == 7 else 0)
        nn = int(.35 * SR); tt = np.arange(nn) / SR
        pl = (np.sin(2 * np.pi * fr(m) * tt) + .4 * np.sin(2 * np.pi * 2 * fr(m) * tt)) * np.exp(-tt * 9)
        put(music, pl, t0 + k * beat / 2, .07 * inten)
    # kick on every beat from bar 2, hats offbeat
    if b >= 1:
        for k in range(4):
            nn = int(.28 * SR); tt = np.arange(nn) / SR
            kick = np.sin(2 * np.pi * (48 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 11)
            put(music, kick, t0 + k * beat, .32 * inten)
            hat = hp(rng.standard_normal(int(.06 * SR)), 7000) * np.exp(-np.arange(int(.06 * SR)) / SR * 70)
            put(music, hat, t0 + k * beat + beat / 2, .06 * inten)
music = lp(music, 9000)
fade = np.minimum(np.arange(N) / (SR * 2), 1) * np.minimum((N - np.arange(N)) / (SR * 4), 1)
music *= fade

# ---------- sfx ----------
sfx = np.zeros(N)
def whoosh(t, dur=.55, g=.5):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n)
    # sweep via block-wise bandpass
    for k in range(8):
        a, b2 = int(k * n / 8), int((k + 1) * n / 8)
        f = 500 + 5500 * (k / 7) ** 1.6
        bb, aa = butter(2, [f / (SR / 2) * .6, min(.95, f / (SR / 2) * 1.4)], 'band'); out[a:b2] = lfilter(bb, aa, x[a:b2])
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    put(sfx, out * e, t, g)
def impact(t, g=.8):
    n = int(1.1 * SR); tt = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (38 + 70 * np.exp(-tt * 18)) * tt) * np.exp(-tt * 4.2)
    crack = hp(rng.standard_normal(n), 1500) * np.exp(-tt * 40) * .35
    put(sfx, boom + crack, t, g)
def tick(t, f=1500, g=.18):
    n = int(.07 * SR); tt = np.arange(n) / SR
    put(sfx, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 55), t, g)
def pop(t, g=.22, f=620):
    n = int(.14 * SR); tt = np.arange(n) / SR
    put(sfx, np.sin(2 * np.pi * (f + 500 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 28), t, g)
def riser(t, dur=.9, g=.28):
    n = int(dur * SR); tt = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 800) * (tt / dur) ** 2
    put(sfx, x, t, g)
def coin(t, g=.16):
    n = int(.25 * SR); tt = np.arange(n) / SR
    put(sfx, (np.sin(2 * np.pi * 1760 * tt) + np.sin(2 * np.pi * 2349 * tt)) * np.exp(-tt * 14), t + 0, g)

for si, sc in enumerate(ev):
    if si > 0: whoosh(sc['start'] - .30, .5, .42)
    for L in sc['layers']:
        t0 = L['t0']; ty = L['type']
        if ty in ('title',): impact(t0, .9)
        elif ty == 'count': riser(t0 - .2, .5, .25); impact(t0 + .25, .6)
        elif ty == 'folder': pop(t0, .25, 300); impact(L.get('tStamp', t0 + .5), .8)
        elif ty in ('tapes', 'toggles', 'wordquote'): pop(t0, .22, 480)
        elif ty in ('dots', 'swarm', 'scanner', 'dns'):
            for k in range(16): tick(t0 + .1 + k * .06, 900 + k * 80, .09)
        elif ty == 'ring': riser(t0, .9, .25); impact(t0 + 1.0, .5)
        elif ty == 'cta': impact(t0, 1.0)
    if sc.get('glitch'):
        for k in range(6): tick(sc['start'] + k * .045, 300 + 700 * (k % 2), .22)
sfx = hp(lp(sfx, 14000), 30)

pk = lambda x: x / max(1e-6, np.abs(x).max())
voice_sr, v = wavfile.read('audio/voice.wav'); v = v.astype('float32'); v = v / (32768 if v.dtype != 'float32' and np.abs(v).max() > 2 else 1)
if voice_sr != SR:
    import scipy.signal as ss; v = ss.resample_poly(v, SR, voice_sr)
vo = np.zeros(N); vo[: min(N, len(v))] = v[:N]
wavfile.write('audio/music.wav', SR, (pk(music) * .9 * 32767).astype('int16'))
wavfile.write('audio/sfx.wav', SR, (pk(sfx) * .9 * 32767).astype('int16'))
wavfile.write('audio/voice44.wav', SR, (pk(vo) * .95 * 32767).astype('int16'))
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voice44.wav', '-i', 'audio/music.wav', '-i', 'audio/sfx.wav', '-filter_complex',
 '[0:a]asplit=2[v][vs];[1:a]volume=0.55[m];[m][vs]sidechaincompress=threshold=0.02:ratio=9:attack=15:release=350[md];'
 '[2:a]volume=0.62[s];[v]volume=1.0[vv];[vv][md][s]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-15:TP=-1.5:LRA=9[o]',
 '-map', '[o]', '-ar', '44100', '-ac', '1', 'audio/final.wav'])
print('mixed audio/final.wav', total)
