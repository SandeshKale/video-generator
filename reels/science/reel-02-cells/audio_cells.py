#!/usr/bin/env python3
"""Sound design for reel #02 "Four million. Every second.": a heartbeat-and-pad score inside the body (low-passed, short plate),
opening to full range when the camera leaves (scene 7), no drums until the payoff, event SFX aligned to the page's own event list.
Usage: python3 audio_cells.py [voice.wav]  ->  audio/final.wav (then loudnorm in the mux step)."""
import numpy as np, os, sys, json, wave
from scipy.signal import butter, sosfilt, resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100
TM = json.load(open(HERE + '/timing.json')); EV = json.load(open(HERE + '/events.json'))
DUR = min(35.0, max(30.0, int((TM['lines'][-1]['b'] + 2.4) * 2 + .999) / 2)); N = int(SR * DUR); T = np.arange(N) / SR
rng = np.random.default_rng(42)
def E(typ): return [e['t'] for e in EV if e['type'] == typ]
def lp(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def put(y, t0, a): i = int(t0 * SR); n = min(len(a), N - i); (y.__setitem__(slice(i, i + n), y[i:i + n] + a[:n]) if n > 0 and i >= 0 else None)
def tone(f, d, amp=.3, decay=6, kind='sin', vib=0):
    n = int(d * SR); x = np.arange(n) / SR; ph = 2 * np.pi * f * x + (np.sin(2 * np.pi * 5 * x) * vib if vib else 0)
    w = np.sin(ph) if kind == 'sin' else (np.sin(ph) + .5 * np.sin(2 * ph) + .25 * np.sin(3 * ph)) / 1.75
    return w * np.exp(-decay * x) * amp
def kick(a=.6, f0=45, f1=95, dec=9, d=.34): n = int(d * SR); x = np.arange(n) / SR; f = f0 + f1 * np.exp(-x * 22); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * dec) * a
def click(a=.3): n = int(.02 * SR); x = np.arange(n) / SR; return hp(rng.standard_normal(n), 2500, 2) * np.exp(-x * 200) * a
def whoosh(d, f0, f1, amp=.5, rise=True):
    n = int(d * SR); noise = rng.standard_normal(n); out = np.zeros(n); blk = 512; zi = None
    for i in range(0, n, blk):
        f = f0 * (f1 / f0) ** (i / n); lo, hi = max(40, f / 1.9), min(SR / 2 - 100, f * 1.9); sos = butter(2, [lo, hi], 'band', fs=SR, output='sos')
        if zi is None: zi = np.zeros((sos.shape[0], 2))
        seg, zi = sosfilt(sos, noise[i:i + blk], zi=zi); out[i:i + blk] = seg
    env = np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * (np.linspace(.3, 1, n) if rise else np.linspace(1, .3, n)); return out / (np.abs(out).max() + 1e-9) * amp * env
def plate(x, mix=.22):   # short, dark "inside the body" reverb: a few decaying comb taps
    y = x.copy()
    for d, g in ((.031, .5), (.047, .42), (.071, .34), (.109, .26), (.163, .18)): k = int(d * SR); y[k:] += lp(x[:-k], 2400, 1) * g
    return x * (1 - mix) + y * mix
BD = sorted(E('tr_push') + E('tr_pull') + E('tr_cross')); TC = E('cross')[0]; L = {l['i']: l for l in TM['lines']}
bed = np.zeros(N); sfx = np.zeros(N)
# ---- heartbeat (60 bpm lub-dub) inside the body, fading as the camera leaves (BD[4] push into the head is the last interior move)
leave = BD[5]
for k in range(int(leave) + 1):
    t = k * 1.0; g = .5 * (1 - seg) if False else .5
    put(bed, t, kick(.42, 38, 60, 11, .28)); put(bed, t + .27, kick(.26, 42, 70, 13, .22))
hb_env = np.clip((leave + .6 - T) / 1.2, 0, 1); bed *= hb_env
# ---- pad: slow chords (Am9, Fmaj7, Cmaj7, G6) with a swell that follows the counter toward 100 M
pad = np.zeros(N); chords = [(110, 164.8, 220, 261.6, 329.6, 392), (87.3, 130.8, 174.6, 220, 261.6, 329.6), (130.8, 196, 261.6, 329.6, 392, 493.9), (98, 146.8, 196, 246.9, 293.7, 392)]
seglen = DUR / len(chords) if False else 6.4
for k in range(int(DUR / seglen) + 1):
    t0 = k * seglen; ch = chords[k % 4]; n = int(min(seglen + 1.2, DUR - t0 + 1) * SR); x = np.arange(n) / SR; w = np.zeros(n)
    for j, f in enumerate(ch): w += np.sin(2 * np.pi * f * x + np.sin(x * .5 + j)) * (.34 / (1 + j * .35)) * (.8 + .2 * np.sin(x * .6 + j))
    w *= np.clip(x / 1.6, 0, 1) * np.clip((seglen + 1.2 - x) / 1.2, 0, 1); put(pad, t0, w)
swell = .45 + .75 * np.clip(T / TC, 0, 1) ** 1.4; bed += lp(pad, 1800) * .5 * swell
# ---- payoff: riser into the crossing, sub drop, shimmer, and the only drums in the reel (soft)
put(sfx, TC - 1.15, whoosh(1.15, 400, 7000, .55)); put(sfx, TC - .02, kick(.95, 34, 70, 4.5, 1.4)); put(sfx, TC, tone(41, 2.2, .5, 1.6))
for j, f in enumerate((1568, 2093, 2637, 3136)): put(sfx, TC + .05 + j * .09, tone(f, 1.4, .12, 3.2))
t = TC + .6
while t < DUR - .8: put(bed, t, kick(.3, 40, 80, 9, .3)); put(bed, t + .25, click(.06)); t += .5
# ---- event SFX
for t in E('mil'): put(sfx, t, tone(1760, .5, .08, 7)); put(sfx, t + .06, tone(2637, .45, .06, 8))
for t in E('spark'):   # S2: a rain of tiny sparkles, ~25 a second for 2.2 s
    for s in np.sort(t + rng.uniform(0, 2.4, 55)): put(sfx, s, tone(rng.choice([1568, 2093, 2349, 3136]), .25, rng.uniform(.03, .07), 16))
for t in E('ring'): put(sfx, t, tone(220, 1.1, .16, 2.2, 'saw', 3)); put(sfx, t, whoosh(.9, 300, 1800, .18))
for t in E('swap'): put(sfx, t, tone(660, .35, .12, 9)); put(sfx, t + .05, tone(990, .4, .1, 8)); put(sfx, t, whoosh(.5, 800, 3200, .16))
for t in E('gutwave'): put(sfx, t, whoosh(1.5, 500, 4200, .3))
for t in E('stamp35'): put(sfx, t, tone(70, .5, .6, 7)); put(sfx, t, click(.35)); put(sfx, t, tone(330, .4, .12, 8))
for t in E('flip'): put(sfx, t, click(.28)); put(sfx, t, tone(520, .08, .12, 40))
for t in E('wave5'): put(sfx, t, whoosh(1.5, 400, 5200, .32))
for t in E('strike'): put(sfx, t, hp(rng.standard_normal(int(.22 * SR)), 1200) * np.exp(-np.arange(int(.22 * SR)) / SR * 20) * .4); put(sfx, t, tone(110, .4, .4, 8))
for t in E('neuron'):
    for j, f in enumerate((1318, 1760, 2093, 2637)): put(sfx, t + j * .07, tone(f, 2.0, .11, 2.2))
for t in E('plane'): put(sfx, t, whoosh(.6, 900, 3000, .22)); put(sfx, t + .55, tone(1046, .3, .12, 9)); put(sfx, t + .63, tone(1568, .35, .1, 8))
for t in E('bubble'): put(sfx, t, tone(880, .18, .16, 16)); put(sfx, t + .05, tone(1320, .2, .12, 14))
for t in E('follow'): put(sfx, t, tone(784, .5, .18, 5, 'saw')); put(sfx, t + .05, tone(988, .5, .13, 5)); put(sfx, t + .1, tone(1175, .6, .11, 4))
for t in E('press'): put(sfx, t, click(.5)); put(sfx, t, tone(1568, .35, .14, 9))
for t in E('tr_push'): put(sfx, t - .35, whoosh(.7, 200, 3500, .32)); put(sfx, t - .02, kick(.3, 36, 50, 7, .5))
for t in E('tr_pull'): put(sfx, t - .35, whoosh(.7, 3500, 220, .26, False))
for t in E('tr_cross'): put(sfx, t - .25, whoosh(.5, 900, 2200, .1))
# ---- interior / exterior: inside the body (before the camera leaves) the music+SFX are dark and slightly reverberant
music = bed + sfx; interior = np.clip((leave + .5 - T) / 1.0, 0, 1)
dark = plate(lp(music, 3300, 3), .25); music = music * (1 - interior) + dark * interior
vp = sys.argv[1] if len(sys.argv) > 1 else HERE + '/vo/voice.wav'
import soundfile as sf
v, sr = sf.read(vp); v = v if v.ndim == 1 else v.mean(1); v = resample_poly(v, SR, sr) if sr != SR else v; v = hp(v, 75, 2); vv = np.zeros(N); vv[:min(N, len(v))] = v[:N]; vv = vv / (np.abs(vv).max() + 1e-9) * .85
env = np.abs(vv); env = lp(env, 6, 1); env = np.clip(env / (env.max() + 1e-9) * 3, 0, 1)
gain = .5 * (1 - .6 * env) * np.clip(T / .03, 0, 1) * np.clip((DUR - T) / .5, 0, 1)
mix = vv + music * gain; mix = np.tanh(mix * 1.15) * .8; mix = mix / np.abs(mix).max() * .85
st = np.stack([mix, np.roll(mix, 28) * .98], 1); os.makedirs(HERE + '/audio', exist_ok=True)
with wave.open(HERE + '/audio/final.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
vm = np.abs(vv) > .08; mus = np.abs(music * gain); r = 20 * np.log10((np.sqrt((vv[vm] ** 2).mean()) + 1e-9) / (np.sqrt((mus[vm] ** 2).mean()) + 1e-9)); print('voice over music dB (voiced frames):', round(float(r), 1), '| duration', DUR)
