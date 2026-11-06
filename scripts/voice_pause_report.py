#!/usr/bin/env python3
"""Pause report for a voice-over wav (energy VAD): silence share, pause histogram, stops >= 0.4 s per 3 s, longest run of speech.
Reference (docs/HINGLISH-VOICEOVER-GUIDE.md section 1): ~31% silence, a stop >= 0.4 s about every 3 s, 0.8-1.2 s after named terms/questions/reveals, 0.2-0.3 s at commas, median gap 0.19 s.
usage: python3 scripts/voice_pause_report.py audio/voice-v3.wav"""
import sys, numpy as np, soundfile as sf, librosa
a, sr = sf.read(sys.argv[1]); a = a if a.ndim == 1 else a.mean(1); a = a.astype('float32')
hop = int(.01 * sr); fr = librosa.util.frame(a, frame_length=int(.03 * sr), hop_length=hop); r = np.sqrt((fr ** 2).mean(0)); thr = max(r.max() * .06, np.percentile(r, 20) * 3.0); v = r > thr
# merge speech blips < 60 ms, drop pauses < 80 ms
runs = []; cur = v[0]; n = 0
for x in v:
    if x == cur: n += 1
    else: runs.append((cur, n)); cur = x; n = 1
runs.append((cur, n)); pauses = [n * .01 for c, n in runs[1:-1] if not c and n * .01 >= .08]; speech = [n * .01 for c, n in runs if c]
dur = len(v) * .01; sil = sum(pauses); P = np.array(pauses) if pauses else np.zeros(1)
h = lambda lo, hi: int(((P >= lo) & (P < hi)).sum())
print(f'duration {dur:.1f}s  silence {100 * sil / dur:.0f}%  (reference ~31%)')
print(f'pauses: micro(.08-.2) {h(.08,.2)}  short(.2-.4) {h(.2,.4)}  mid(.4-.8) {h(.4,.8)}  long(.8-1.5) {h(.8,1.5)}  >1.5 {h(1.5,99)}   median {np.median(P):.2f}s')
print(f'stops >= 0.4 s: {h(.4,99)}  ->  one every {dur / max(1, h(.4,99)):.1f} s  (reference: every ~3 s)')
print(f'longest speech run {max(speech):.1f}s  mean run {np.mean(speech):.2f}s')
