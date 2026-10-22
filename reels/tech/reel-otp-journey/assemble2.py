#!/usr/bin/env python3
"""audio/takes/sNN.wav (voice2.py) -> audio/voice.wav + timing.json (same schema as voice.py: sentences, clauses a/b, words).
Clause boundaries inside a sentence = character share of the Hindi clause text, snapped to the quietest 60 ms within +-0.35 s (a real pause if there is one).
No pause cutting, no tempo change: only edge trimming, a short fade, and level matching per take."""
import os, json, numpy as np, soundfile as sf
H = os.path.dirname(os.path.abspath(__file__)); SR = 24000
S = json.load(open(os.path.join(H, 'script.json')))['sentences']
def env10(x): n = int(.01 * SR); k = len(x) // n; return np.sqrt((x[:k * n].reshape(k, n) ** 2).mean(1))
out = []; t = 0.0; sents = []; TARGET = 0.085
for i, s in enumerate(S):
    a, sr = sf.read(os.path.join(H, 'audio', 'takes', f's{i:02d}.wav')); a = a if a.ndim == 1 else a.mean(1); assert sr == SR
    thr = max(.01, .04 * float(np.abs(a).max())); idx = np.where(np.abs(a) > thr)[0]
    i0 = max(0, int(idx[0]) - int(.02 * SR)); i1 = min(len(a), int(idx[-1]) + int(.12 * SR)); a = a[i0:i1].copy()
    rms = float(np.sqrt(np.mean(a[np.abs(a) > thr] ** 2))); a *= TARGET / max(rms, 1e-6); a = np.clip(a, -.98, .98)
    f = int(.01 * SR); a[:f] *= np.linspace(0, 1, f); a[-f * 3:] *= np.linspace(1, 0, f * 3); L = len(a) / SR
    e = env10(a); clauses = []; chars = [len(c[0].replace('।', '').replace(',', '').replace(':', '').replace(' ', '')) for c in s['c']]; tot = sum(chars); cum = 0; bounds = [0.0]
    for ci in range(len(s['c']) - 1):
        cum += chars[ci]; tb = L * cum / tot; lo = max(0, int((tb - .35) * 100)); hi = min(len(e) - 6, int((tb + .35) * 100))
        if hi > lo: seg = np.convolve(e[lo:hi + 6], np.ones(6) / 6, 'valid'); tb = (lo + int(np.argmin(seg)) + 3) / 100
        bounds.append(tb)
    bounds.append(L); words = []
    for ci, (h, en, ac) in enumerate(s['c']):
        clauses.append(dict(h=h, en=en, ac=ac, a=round(t + bounds[ci] + (0.0 if ci else 0.02), 3), b=round(t + bounds[ci + 1], 3)))
        nw = len(h.replace('।', '').replace(',', '').replace(':', '').replace('-', ' ').split()); w0, w1 = bounds[ci], bounds[ci + 1]
        for k in range(nw): words.append([round(t + w0 + (w1 - w0) * k / nw, 3), round(t + w0 + (w1 - w0) * (k + 1) / nw, 3)])
    sents.append(dict(i=i, p=s['p'], a=round(t, 3), b=round(t + L, 3), clauses=clauses, words=words)); out.append(a); t += L
    pause = .34 if clauses[-1]['h'].endswith(('।', '?')) else .16
    if i < len(S) - 1 and S[i + 1]['p'] != s['p']: pause = .5
    if i < len(S) - 1: out.append(np.zeros(int(pause * SR))); t += pause
wav = np.concatenate(out); sf.write(os.path.join(H, 'audio', 'voice.wav'), wav, SR)
json.dump(dict(dur=round(len(wav) / SR, 3), sentences=sents), open(os.path.join(H, 'timing.json'), 'w'), ensure_ascii=False, indent=1)
print('voice', round(len(wav) / SR, 2), 's;', len(sents), 'sentences')
