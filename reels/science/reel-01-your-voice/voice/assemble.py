#!/usr/bin/env python3
"""Assemble the picked, finished lines vo/l01..l10.wav into vo/voice.wav (24 kHz mono) with designed silences:
the guess beat (after L4), the muffled try-it silence (after L8) and a breath before the CTA (after L9).
Then: python3 timing_from_voice.py vo/voice.wav  ->  timing.json."""
import os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); VO = os.path.join(HERE, '..', 'vo'); SR = 24000
GAP = {1: .30, 2: .30, 3: .32, 4: 1.15, 5: .30, 6: .55, 7: .55, 8: 1.45, 9: .70}   # silence AFTER line i
parts = [np.zeros(int(.02 * SR), np.float32)]
for i in range(1, 11):
    y, sr = sf.read(os.path.join(VO, f'l{i:02d}.wav')); assert sr == SR
    parts += [y.astype(np.float32), np.zeros(int(GAP.get(i, .0) * SR), np.float32)]
x = np.concatenate(parts + [np.zeros(int(.4 * SR), np.float32)]); x = x / np.abs(x).max() * .9
sf.write(os.path.join(VO, 'voice.wav'), x, SR); print('voice.wav', round(len(x) / SR, 2), 's')
