#!/usr/bin/env python3
"""Sound design for the reel #01 preview (no voice yet: the voice-over comes from the avatar clips).
Synth score + event SFX, all aligned to the page's own timeline. Writes mockup/preview_audio.wav"""
import numpy as np, os, sys
from scipy.signal import butter, sosfilt, sosfilt_zi
SR = 44100; DUR = 15.0; N = int(SR * DUR); T = np.arange(N) / SR
rng = np.random.default_rng(11)
def env(t0, t1, a=.01, r=.2, power=1.0):
    e = np.zeros(N); i0, i1 = int(t0 * SR), int(t1 * SR); n = i1 - i0
    x = np.arange(n) / SR; d = t1 - t0
    e[i0:i1] = np.minimum(1, x / a) * np.minimum(1, (d - x) / r) ** power; return np.clip(e, 0, 1)
def lp(x, fc, order=2): return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, order=2): return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)
def sweep_noise(t0, t1, f0, f1, q=1.2, amp=.5):
    n = int((t1 - t0) * SR); out = np.zeros(n); noise = rng.standard_normal(n); blk = 512; zi = None
    for i in range(0, n, blk):
        f = f0 * (f1 / f0) ** (i / n); lo, hi = max(40, f / (1 + 1 / q)), min(SR / 2 - 100, f * (1 + 1 / q))
        sos = butter(2, [lo, hi], 'band', fs=SR, output='sos')
        if zi is None: zi = sosfilt_zi(sos)[None, :, :] * 0 if False else np.zeros((sos.shape[0], 2))
        seg, zi = sosfilt(sos, noise[i:i + blk], zi=zi); out[i:i + blk] = seg
    k = np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * np.linspace(.3, 1, n); out = out / (np.abs(out).max() + 1e-9) * amp * k
    y = np.zeros(N); y[int(t0 * SR):int(t0 * SR) + n] = out; return y
def tone(t0, f, d, a=.3, kind='sin', decay=6):
    n = int(d * SR); x = np.arange(n) / SR; w = np.sin(2 * np.pi * f * x) if kind == 'sin' else np.sign(np.sin(2 * np.pi * f * x)) * .5 + np.sin(2 * np.pi * f * x) * .5
    y = np.zeros(N); i = int(t0 * SR); y[i:i + n] = (w * np.exp(-decay * x) * a)[:N - i]; return y
def kick(t0, a=.6):
    n = int(.32 * SR); x = np.arange(n) / SR; f = 45 + 90 * np.exp(-x * 22); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.zeros(N); i = int(t0 * SR); y[i:i + n] = (np.sin(ph) * np.exp(-x * 9) * a)[:N - i]; return y
def hat(t0, a=.12):
    n = int(.05 * SR); x = np.arange(n) / SR; y = np.zeros(N); i = int(t0 * SR); y[i:i + n] = hp(rng.standard_normal(n), 7000, 2) * np.exp(-x * 70) * a; return y
# ---- music bed
bed = np.zeros(N)
for f, a in [(55, .35), (110, .22), (164.8, .12), (220, .1), (329.6, .06)]:
    bed += np.sin(2 * np.pi * f * T + np.sin(T * .3 + f)) * a * (.75 + .25 * np.sin(T * .4 + f))
bed = lp(bed, 1400) * .55
pulse = np.zeros(N)
beat = .5
for k in range(int(DUR / beat)):
    t = k * beat
    on = (t < 4.3) or (5.3 <= t < 9.2) or (10.2 <= t < 12.9)
    amp = 1.0 if t < 4.3 else (.55 if t < 9.2 else .6)
    if on: pulse += kick(t, .55 * amp)
    if on and t < 4.3: pulse += hat(t + .25, .13) + hat(t, .05)
arp = np.zeros(N)
for k in range(int(4.3 / .25)):
    t = k * .25; f = [329.6, 392, 493.9, 392][k % 4]; arp += tone(t, f, .22, .05, 'sin', 9)
for k in range(int((9.2 - 5.3) / .5)):
    t = 5.3 + k * .5; arp += tone(t, [220, 261.6, 329.6][k % 3], .45, .05, 'sin', 5)
# ---- event SFX
sfx = np.zeros(N)
sfx += sweep_noise(3.9, 4.95, 300, 6500, 1.0, .5) + kick(4.92, .95) + tone(4.92, 38, 1.2, .5, 'sin', 2.5)           # lens push-through
sfx += sweep_noise(9.3, 10.0, 6000, 400, .9, .5) + tone(9.95, 70, .5, .3, 'sin', 5)                                   # whip pan
for t0, f in [(5.5, 880), (6.0, 660), (6.2, 990), (7.5, 440), (7.75, 330), (11.1, 520)]: sfx += tone(t0, f, .22, .12, 'sin', 14)  # panel / bars
sfx += tone(8.3, 90, .5, .55, 'sin', 7) + hp(rng.standard_normal(N) * env(8.3, 8.38, .001, .07), 1500) * .25                # amber stamp
sfx += tone(11.0, 110, .45, .5, 'sin', 8) + hp(rng.standard_normal(N) * env(11.0, 11.05, .001, .04), 2500) * .15          # plug thump
for t0 in (1.3, 1.45): sfx += tone(t0, 1320, .12, .08, 'sin', 25)                                                       # ugh bubble
sfx += tone(.9, 700, .18, .08, 'sin', 14)
swell = lp(sum(np.sin(2 * np.pi * f * T) for f in (110, 164.8, 220, 329.6, 440)), 900) * env(12.9, 15.0, 1.6, .3) * .12  # warm swell
# ---- muffled "try it" gap (12.9-14.6): low-pass + low-shelf the whole mix, the audio demonstrates the claim
mix = bed + pulse * .9 + arp + sfx + swell
m = np.clip((T - 12.8) / .5, 0, 1) * np.clip((14.8 - T) / .4, 0, 1)
low = lp(mix, 420, 4) * 1.5
mix = mix * (1 - m) + low * m
mix = mix * np.clip(T / .03, 0, 1) * np.clip((DUR - T) / .35, 0, 1)
mix = lp(mix, 16000, 2); mix = np.tanh(mix * 1.1) * .75
mix = mix / np.abs(mix).max() * 0.8
st = np.stack([mix, np.roll(mix, 30) * .98], 1)
import wave
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mockup', 'preview_audio.wav')
with wave.open(out, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote', out)
