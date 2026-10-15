#!/usr/bin/env python3
"""Assemble vo/l01..l09.wav into vo/voice.wav with designed silences. The gaps are tuned so that the word "hundred" in line 8
starts ~0.2 s before the page's counter (3.82 M/s x t) crosses 100,000,000 at t = 26.18 s."""
import os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); VO = os.path.join(HERE, '..', 'vo'); SR = 24000
GAP = {1: .35, 2: .55, 3: .45, 4: .55, 5: 1.05, 6: .50, 7: .50, 8: .60}   # silence AFTER line i
parts = [np.zeros(int(.02 * SR), np.float32)]; t = .02
for i in range(1, 10):
    y, sr = sf.read(os.path.join(VO, f'l{i:02d}.wav')); assert sr == SR; y = y.astype(np.float32); print(i, 'a=%.2f b=%.2f' % (t, t + len(y) / SR)); t += len(y) / SR + GAP.get(i, 0)
    parts += [y, np.zeros(int(GAP.get(i, 0) * SR), np.float32)]
x = np.concatenate(parts + [np.zeros(int(.4 * SR), np.float32)]); x = x / np.abs(x).max() * .9
sf.write(os.path.join(VO, 'voice.wav'), x, SR); print('voice.wav', round(len(x) / SR, 2), 's')
