#!/usr/bin/env python3
"""Assemble vo/p1..p8.wav (whole breath-group takes, untouched) into vo/voice.wav with DESIGNED silences only.
Then: python3 timing_from_voice.py vo/voice.wav -> timing.json."""
import os, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); VO = os.path.join(HERE, '..', 'vo'); SR = 24000
IDS = ['q1','q2','q3','q4','q5','q6','q7','q8']
GAP = {'q1': .30, 'q2': .25, 'q3': .35, 'q4': .45, 'q5': .45, 'q6': .35, 'q7': .30}   # designed silence AFTER each breath group; nothing is cut or sped up
parts = [np.zeros(int(.02 * SR), np.float32)]
for i in IDS:
    y, sr = sf.read(os.path.join(VO, f'{i}.wav')); assert sr == SR
    parts += [y.astype(np.float32), np.zeros(int(GAP.get(i, 0) * SR), np.float32)]
x = np.concatenate(parts + [np.zeros(int(.4 * SR), np.float32)]); x = x / np.abs(x).max() * .9
sf.write(os.path.join(VO, 'voice.wav'), x, SR); print('voice.wav', round(len(x) / SR, 2), 's')
