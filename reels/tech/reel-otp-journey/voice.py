#!/usr/bin/env python3
"""Hindi male voice-over (Kokoro hm_omega), ONE take per sentence (no pause cutting, no tempo change), word spans from Kokoro's
pred_dur. Writes audio/voice.wav + timing.json: sentences, clauses (start/end), word spans. usage: PYTHONPATH=/tmp/stub python3 voice.py [--voice hm_omega] [--base 1.12]"""
import argparse, json, os, re, numpy as np, soundfile as sf
from kokoro import KPipeline
ap = argparse.ArgumentParser(); ap.add_argument('--voice', default='hm_omega'); ap.add_argument('--base', type=float, default=1.12); a = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 24000
S = json.load(open(os.path.join(HERE, 'script.json')))['sentences']
pipe = KPipeline(lang_code='h'); vocab = pipe.model.vocab
def synth(text, speed):
    chunks, spans, off = [], [], 0.0
    for r in pipe(text, voice=a.voice, speed=speed):
        au = np.asarray(r.audio, dtype='float32'); dur = r.output.pred_dur.numpy().astype(float); L = len(au) / SR
        ps = r.phonemes; ids = [c for c in ps if c in vocab]; cd = dur[1:1 + len(ids)]; sc = L / dur.sum(); k = 0; t = dur[0] * sc; cur = []; ws = []
        for c in ps:
            if c == ' ':
                if cur: ws.append((cur[0], cur[1])); cur = []
                continue
            if c not in vocab: continue
            d = cd[k] * sc; k += 1
            if not cur: cur = [t, t + d]
            else: cur[1] = t + d
            t += d
        if cur: ws.append((cur[0], cur[1]))
        spans += [(off + s, off + e) for s, e in ws]; chunks.append(au); off += L
    au = np.concatenate(chunks); thr = max(.012, .03 * float(np.abs(au).max())); idx = np.where(np.abs(au) > thr)[0]
    i0 = max(0, int(idx[0]) - int(.02 * SR)); i1 = min(len(au), int(idx[-1]) + int(.06 * SR)); au = au[i0:i1]; sh = i0 / SR
    spans = [(max(0, s - sh), max(0, e - sh)) for s, e in spans]; f = int(.012 * SR); au[:f] *= np.linspace(0, 1, f); au[-f:] *= np.linspace(1, 0, f)
    return au, spans
out = []; t = 0.0; sents = []; GAP = {1: .16, 2: .16, 3: .16, 4: .16}
for si, s in enumerate(S):
    spoken = ' '.join(c[0] for c in s['c']).replace('-', ' '); words = spoken.replace('।', '').replace(',', '').replace(':', '').split()
    n = len(words); sp = a.base * (1.0 if 5 <= n <= 11 else 0.97)
    au, spans = synth(' '.join(words), round(sp, 3))
    if len(spans) != n:
        L = len(au) / SR; tot = sum(len(w) for w in words); x = 0.0; spans = []
        for w in words: d = L * len(w) / tot; spans.append((x, x + d)); x += d
        print('! timing fallback', si, flush=True)
    clauses = []; k = 0
    for h, en, ac in s['c']:
        m = len(h.replace('।', '').replace(',', '').replace(':', '').replace('-', ' ').split()); clauses.append(dict(h=h, en=en, ac=ac, a=round(t + spans[k][0], 3), b=round(t + spans[k + m - 1][1], 3))); k += m
    sents.append(dict(i=si, p=s['p'], a=round(t, 3), b=round(t + len(au) / SR, 3), clauses=clauses, words=[[round(t + x, 3), round(t + y, 3)] for x, y in spans]))
    out.append(au); t += len(au) / SR
    pause = .34 if clauses[-1]['h'].endswith(('।', '?')) else .16
    if si < len(S) - 1 and S[si + 1]['p'] != s['p']: pause = .5
    out.append(np.zeros(int(pause * SR), dtype='float32')); t += pause
    print(si, round(sents[-1]['a'], 2), round(sents[-1]['b'], 2), n, flush=True)
wav = np.concatenate(out); os.makedirs(os.path.join(HERE, 'audio'), exist_ok=True); sf.write(os.path.join(HERE, 'audio', 'voice.wav'), wav, SR)
json.dump(dict(dur=round(len(wav) / SR, 3), sentences=sents), open(os.path.join(HERE, 'timing.json'), 'w'), ensure_ascii=False, indent=1)
print('total', round(len(wav) / SR, 2), 's')
