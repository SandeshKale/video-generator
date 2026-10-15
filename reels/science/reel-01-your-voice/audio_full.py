#!/usr/bin/env python3
"""Full sound design for reel #01, aligned to the page's own events (events.json) and the voice timing (timing.json).
Usage: python3 audio_full.py [voice.wav]   (default vo/voice.wav if present, else vo/scratch.wav)  -> audio/final.wav
The voice-over is the avatar-clip audio (stitched, dereverbed); until it exists the Kokoro scratch voice stands in."""
import numpy as np, os, sys, json, wave
from scipy.signal import butter, sosfilt, resample_poly
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; TM = json.load(open(HERE + '/timing.json')); DUR = min(34.0, max(28.0, int((TM['lines'][-1]['b'] + 1.1) * 2 + .999) / 2)); N = int(SR * DUR); T = np.arange(N) / SR   # same rule as the page (main3.js)
rng = np.random.default_rng(23); EV = json.load(open(HERE + '/events.json'))
def E(typ): return [e['t'] for e in EV if e['type'] == typ]
def lp(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def put(y, t0, a): i = int(t0 * SR); n = min(len(a), N - i); y[i:i + n] += a[:n] if n > 0 else 0
def tone(f, d, amp=.3, decay=6, kind='sin', vib=0):
    n = int(d * SR); x = np.arange(n) / SR; ph = 2 * np.pi * f * x + (np.sin(2 * np.pi * 5 * x) * vib if vib else 0)
    w = np.sin(ph) if kind == 'sin' else (np.sin(ph) + .5 * np.sin(2 * ph) + .25 * np.sin(3 * ph)) / 1.75
    return w * np.exp(-decay * x) * amp
def kick(a=.6): n = int(.32 * SR); x = np.arange(n) / SR; f = 45 + 90 * np.exp(-x * 22); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 9) * a
def hat(a=.12): n = int(.05 * SR); x = np.arange(n) / SR; return hp(rng.standard_normal(n), 7000, 2) * np.exp(-x * 70) * a
def click(a=.3): n = int(.02 * SR); x = np.arange(n) / SR; return hp(rng.standard_normal(n), 2500, 2) * np.exp(-x * 200) * a
def whoosh(d, f0, f1, amp=.5, rise=True):
    n = int(d * SR); noise = rng.standard_normal(n); out = np.zeros(n); blk = 512; zi = None
    for i in range(0, n, blk):
        f = f0 * (f1 / f0) ** (i / n); lo, hi = max(40, f / 1.9), min(SR / 2 - 100, f * 1.9); sos = butter(2, [lo, hi], 'band', fs=SR, output='sos')
        if zi is None: zi = np.zeros((sos.shape[0], 2))
        seg, zi = sosfilt(sos, noise[i:i + blk], zi=zi); out[i:i + blk] = seg
    env = np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * (np.linspace(.3, 1, n) if rise else np.linspace(1, .3, n)); return out / (np.abs(out).max() + 1e-9) * amp * env
BD = [e['t'] for e in EV if e['type'].startswith('tr_')]; BD.sort()
L = {l['i']: l for l in TM['lines']}
bed = np.zeros(N); sfx = np.zeros(N)
# ---- pad (A minor, slow), swelling per scene; pulse + arp only in the hook, calmer ostinato later
pad = np.zeros(N)
for f, a in [(55, .35), (110, .22), (164.8, .12), (220, .1), (329.6, .06)]: pad += np.sin(2 * np.pi * f * T + np.sin(T * .3 + f)) * a * (.75 + .25 * np.sin(T * .4 + f))
pad = lp(pad, 1400) * .5
quiet = np.ones(N); g5 = (BD[3] + .2, BD[4] - .02)                                   # the guess beat: bed drops away
quiet *= 1 - .8 * np.clip((T - g5[0]) / .15, 0, 1) * np.clip((g5[1] + .1 - T) / .15, 0, 1)
bed += pad * quiet
pulse = np.zeros(N); arp = np.zeros(N)
for k in range(int(BD[0] / .5) + 1): t = k * .5; put(pulse, t, kick(.55)); put(pulse, t + .25, hat(.13)); put(pulse, t, hat(.05))
for k in range(int(BD[0] / .25)): put(arp, k * .25, tone([329.6, 392, 493.9, 392][k % 4], .22, .05, 9))
t = BD[0] + .5
while t < BD[3] - .3: put(pulse, t, kick(.28)); put(arp, t + .25, tone([220, 261.6, 329.6][int(t * 2) % 3], .45, .045, 5)); t += .5
t = BD[4] + .3
while t < BD[5]: put(pulse, t, kick(.3)); put(arp, t + .25, tone([220, 293.7, 349.2][int(t * 2) % 3], .4, .045, 5)); t += .5
t = BD[5] + .4
while t < BD[6] - .2: put(arp, t, tone([392, 440, 523.3, 440][int(t * 4) % 4], .16, .08, 12, 'saw')); put(pulse, t, kick(.18)) if int(t * 4) % 2 == 0 else None; t += .25
for tt in np.arange(BD[3] + .25, BD[4], .33): put(sfx, tt, click(.4))                    # clock ticks while you guess
bed += pulse * .9 + arp
# ---- event SFX
put(sfx, BD[0] - 1.0, whoosh(1.05, 300, 6500, .5)); put(sfx, BD[0] - .05, kick(.95)); put(sfx, BD[0] - .05, tone(38, 1.2, .5, 2.5))   # lens dive
put(sfx, E('air')[0], tone(880, .5, .16, 5)); put(sfx, E('air')[0], tone(1320, .5, .08, 6))
put(sfx, E('bone')[0], tone(220, .9, .22, 3, 'saw', 3)); put(sfx, E('bone')[0], tone(330, .9, .12, 3))
put(sfx, BD[1] - .2, whoosh(.5, 800, 2600, .15))
put(sfx, BD[2] - .35, whoosh(.7, 5000, 300, .5, False))                                   # whip 1
put(sfx, E('snap')[0], hp(rng.standard_normal(int(.25 * SR)), 1200) * np.exp(-np.arange(int(.25 * SR)) / SR * 22) * .5); put(sfx, E('snap')[0], tone(95, .45, .5, 8))
put(sfx, BD[3] - .6, whoosh(.65, 300, 5000, .4))                                         # dive into the mic
put(sfx, BD[4] - .2, whoosh(.45, 600, 3000, .15))
put(sfx, E('guess')[0], tone(660, .3, .12, 9))
for k, f in zip(('bar1', 'tag', 'bar2'), (660, 880, 440)): put(sfx, E(k)[0], tone(f, .25, .14, 12)); put(sfx, E(k)[0] + .2, tone(f * 1.5, .22, .1, 14))
put(sfx, E('stamp')[0], tone(90, .5, .55, 7)); put(sfx, E('stamp')[0], hp(rng.standard_normal(int(.08 * SR)), 1500) * np.exp(-np.arange(int(.08 * SR)) / SR * 50) * .3)
put(sfx, BD[5] - .45, whoosh(.7, 5500, 350, .5, False))                                   # whip 2
put(sfx, E('send')[0], tone(1046, .25, .16, 10)); put(sfx, E('send')[0] + .08, tone(1568, .3, .12, 9))
put(sfx, E('xmark')[0], whoosh(.35, 3000, 500, .3, False)); put(sfx, E('xmark')[0] + .3, tone(150, .3, .3, 9))
put(sfx, BD[6] - .45, whoosh(.7, 400, 4500, .45))                                         # tilt
put(sfx, E('plug')[0], tone(110, .45, .5, 8)); put(sfx, E('plug')[0], click(.25))
swell = lp(sum(np.sin(2 * np.pi * f * T) for f in (110, 164.8, 220, 329.6, 440)), 900) * np.clip((T - E('swell')[0]) / 1.6, 0, 1) * np.clip((BD[7] - T) / .5, 0, 1) * .14
sfx += swell; put(sfx, E('ring')[0], tone(660, 1.6, .2, 2.4, 'saw', 2)); put(sfx, E('ring')[0], tone(1320, 1.2, .08, 3))
put(sfx, BD[7] - .6, whoosh(.65, 300, 6000, .5)); put(sfx, BD[7] - .05, kick(.8)); put(sfx, BD[7] - .05, tone(42, 1.0, .45, 3))
put(sfx, E('follow')[0], tone(784, .5, .2, 5, 'saw')); put(sfx, E('follow')[0], tone(988, .5, .14, 5)); put(sfx, E('follow')[0], tone(1175, .6, .12, 4))
put(sfx, E('press')[0], click(.5)); put(sfx, E('press')[0], tone(1568, .35, .15, 9))
# ---- mix: voice with sidechain ducking, muffled try-it silence (low-pass + low shelf on the whole bed + sfx)
vp = sys.argv[1] if len(sys.argv) > 1 else (HERE + '/vo/voice.wav' if os.path.exists(HERE + '/vo/voice.wav') else HERE + '/vo/scratch.wav')
import soundfile as sf
v, sr = sf.read(vp); v = v if v.ndim == 1 else v.mean(1); v = resample_poly(v, SR, sr) if sr != SR else v; v = hp(v, 75, 2); vv = np.zeros(N); vv[:min(N, len(v))] = v[:N]; vv = vv / (np.abs(vv).max() + 1e-9) * .85
env = np.abs(vv); env = lp(env, 6, 1); env = np.clip(env / (env.max() + 1e-9) * 3, 0, 1)
music = (bed + sfx)
m0, m1 = E('muffle')[0], L[9]['a'] - .02; mm = np.clip((T - m0) / .25, 0, 1) * np.clip((m1 + .25 - T) / .25, 0, 1)
low = lp(music, 420, 4) * 1.6; music = music * (1 - mm) + low * mm
gain = .5 * (1 - .6 * env) * np.clip(T / .03, 0, 1) * np.clip((DUR - T) / .4, 0, 1)
mix = vv * 1.0 + music * gain
mix = np.tanh(mix * 1.15) * .8; mix = mix / np.abs(mix).max() * .85
st = np.stack([mix, np.roll(mix, 28) * .98], 1); os.makedirs(HERE + '/audio', exist_ok=True)
with wave.open(HERE + '/audio/final.wav', 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
# report: voice-over-music level on voiced frames
vm = np.abs(vv) > .08; mus = np.abs(music * gain); r = 20 * np.log10((np.sqrt((vv[vm] ** 2).mean()) + 1e-9) / (np.sqrt((mus[vm] ** 2).mean()) + 1e-9)); print('voice over music dB (voiced frames):', round(float(r), 1)); print('wrote audio/final.wav from', os.path.basename(vp))
