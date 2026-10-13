#!/usr/bin/env python3
"""SCRATCH voice only (Kokoro am_michael) so the timeline can be built and timed now. The final voice-over is the avatar-clip audio
(avatar-prompts.md): replace vo/voice.wav and timing.json with the stitched avatar audio + Whisper words (stitch step), then rebuild.
Writes vo/scratch.wav and timing.json: {lines:[{i,text,a,b,words:[{w,s,e}]}], dur}"""
import json, os, numpy as np, soundfile as sf
from kokoro import KPipeline
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 24000
LINES = ["You've never heard your own voice the way everyone else does.", "Two routes to your ears: air, and bone.", "Everyone hears the air. Only you get the bone.", "A recording only catches the air.",
 "One theory says you'd sound higher.", "A 2025 study: most people heard lower.", "Send this to the friend who hates voice notes.", "Now plug your ears and say anything.", "Nobody else will ever hear the version you hear."]
SPOKEN = {5: "A twenty twenty-five study: most people heard lower."}
GAP = {0: .30, 1: .30, 2: .30, 3: 1.15, 4: .30, 5: .55, 6: .55, 7: 1.45}   # silence AFTER line i (designed: 0.8 before L5, 1.4 after L8)
pipe = KPipeline(lang_code='a'); out = np.zeros(int(.02 * SR), dtype='float32'); T = []; PUNCT = set('.,!?;:-"\'')
for i, text in enumerate(LINES):
    chunks, words, off = [], [], 0.0
    for r in pipe(SPOKEN.get(i, text), voice='am_michael', speed=1.04):
        au = np.asarray(r.audio, dtype='float32'); chunks.append(au)
        for t in (r.tokens or []):
            if t.text.strip() and t.text.strip() not in PUNCT and t.start_ts is not None and t.end_ts is not None: words.append({'w': t.text, 's': round(off + t.start_ts, 3), 'e': round(off + t.end_ts, 3)})
        off += len(au) / SR
    au = np.concatenate(chunks); thr = max(.012, .03 * float(np.abs(au).max())); idx = np.where(np.abs(au) > thr)[0]
    i0 = max(0, int(idx[0]) - int(.02 * SR)); i1 = min(len(au), int(idx[-1]) + int(.04 * SR)); au = au[i0:i1]; sh = i0 / SR
    start = len(out) / SR; out = np.concatenate([out, au]); end = len(out) / SR
    T.append({'i': i + 1, 'text': text, 'a': round(start, 3), 'b': round(end, 3), 'words': [{'w': w['w'], 's': round(start + max(0, w['s'] - sh), 3), 'e': round(start + max(0, w['e'] - sh), 3)} for w in words]})
    out = np.concatenate([out, np.zeros(int(GAP.get(i, .3) * SR), dtype='float32')])
sf.write(os.path.join(HERE, 'vo', 'scratch.wav'), out, SR); json.dump({'lines': T, 'dur': round(len(out) / SR, 3)}, open(os.path.join(HERE, 'timing.json'), 'w'), indent=1)
for l in T: print(l['i'], l['a'], l['b'], len(l['words']))
print('dur', len(out) / SR)
