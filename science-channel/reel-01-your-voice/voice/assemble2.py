#!/usr/bin/env python3
"""Assemble vo/p1..p8.wav (whole breath-group takes, untouched) into vo/voice.wav with DESIGNED silences only.
Then: python3 timing_from_voice.py vo/voice.wav -> timing.json."""
import os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); VO = os.path.join(HERE, '..', 'vo'); SR = 24000
IDS = ['p1','p2a','p2b','p3','p4','p5','p6','p7','p8']
GAP = {'p1': .35, 'p2a': .30, 'p2b': .35, 'p3': .40, 'p4': .50, 'p5': .45, 'p6': 1.30, 'p7': .55}   # silence AFTER paragraph i (p6 = muffled try-it beat)
parts = [np.zeros(int(.02 * SR), np.float32)]
for i in IDS:
    y, sr = sf.read(os.path.join(VO, f'{i}.wav')); assert sr == SR
    parts += [y.astype(np.float32), np.zeros(int(GAP.get(i, 0) * SR), np.float32)]
x = np.concatenate(parts + [np.zeros(int(.4 * SR), np.float32)]); x = x / np.abs(x).max() * .9
sf.write(os.path.join(VO, 'voice.wav'), x, SR); print('voice.wav', round(len(x) / SR, 2), 's')
