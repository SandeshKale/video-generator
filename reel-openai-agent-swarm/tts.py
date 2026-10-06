#!/usr/bin/env python3
"""Sentence-level, prosody-shaped voiceover (Kokoro, CPU) with word timestamps -> audio/voice.wav + timing.json.
Naturalness tweaks vs the flat per-beat read: each sentence synthesized separately with its own speed
(short fragments slower for emphasis, questions slightly slower, long runs slightly faster), pauses sized by
punctuation (period 0.20s, question 0.26s, colon/comma 0.10s), tiny breath-room before numbers, 12 ms fades.
Usage: python tts.py [--voice am_michael] [--base 1.0]"""
import argparse, hashlib, json, os, pickle, re, numpy as np, soundfile as sf
from kokoro import KPipeline
ap = argparse.ArgumentParser(); ap.add_argument('--voice', default='am_adam'); ap.add_argument('--base', type=float, default=1.0)
a = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 24000
LEAD, GAP_SCENE, TAIL = 0.0, 0.20, 3.2
script = json.load(open(os.path.join(HERE, 'script.json')))
pipe = KPipeline(lang_code='a'); os.makedirs(os.path.join(HERE, 'audio', 'cache'), exist_ok=True)
PUNCT = set('.,!?;:—-"\'')
def sentences(text):
    parts = re.findall(r'[^.!?]+[.!?]+|[^.!?]+$', text.strip()); return [p.strip() for p in parts if p.strip()]
def spd(s):
    n = len(s.split())
    sp = a.base
    if n <= 3: sp *= 0.95            # punchy fragments land slower
    elif n >= 22: sp *= 1.04         # long runs a touch faster
    if s.endswith('?'): sp *= 0.97
    if re.search(r'\d|hundred|thousand|million|billion|trillion|percent', s, re.I): sp *= 0.98
    return round(sp, 3)
def pause_after(s, last_in_beat):
    return 0.26 if s.endswith('?') else 0.20 if s.endswith('.') else 0.12
def synth(text, speed):
    key = hashlib.sha1(f'v2|{a.voice}|{speed}|{text}'.encode()).hexdigest()[:16]
    path = os.path.join(HERE, 'audio', 'cache', key + '.pkl')
    if os.path.exists(path): return pickle.load(open(path, 'rb'))
    chunks, words, off = [], [], 0.0
    for r in pipe(text, voice=a.voice, speed=speed):
        au = np.asarray(r.audio, dtype='float32'); chunks.append(au)
        for t in (r.tokens or []):
            if t.text.strip() and t.text.strip() not in PUNCT and t.start_ts is not None and t.end_ts is not None:
                words.append({'w': t.text, 's': round(off + t.start_ts, 3), 'e': round(off + t.end_ts, 3)})
        off += len(au) / SR
    au = np.concatenate(chunks)
    thr = max(.012, .03 * float(np.abs(au).max())); idx = np.where(np.abs(au) > thr)[0]
    if len(idx):  # trim leading/trailing silence (keep 25 ms) and shift word times
        i0 = max(0, int(idx[0]) - int(.025 * SR)); i1 = min(len(au), int(idx[-1]) + int(.04 * SR)); au = au[i0:i1]; sh = i0 / SR
        words = [{'w': w['w'], 's': round(max(0, w['s'] - sh), 3), 'e': round(max(0, w['e'] - sh), 3)} for w in words]
    f = int(.012 * SR); au[:f] *= np.linspace(0, 1, f); au[-f:] *= np.linspace(1, 0, f)
    res = (au, words); pickle.dump(res, open(path, 'wb')); return res
FILL = re.compile(r'\b(um|uh|hmm),?', re.I)
def synth_s(text, speed):
    """Synthesize a sentence; spoken fillers (um/uh/hmm) get their own slower, softer clip with small breaths around them."""
    parts = []; pos = 0
    for m in FILL.finditer(text):
        if text[pos:m.start()].strip(): parts.append(('t', text[pos:m.start()].strip()))
        parts.append(('f', m.group(1).lower())); pos = m.end()
    if text[pos:].strip(): parts.append(('t', text[pos:].strip()))
    if not any(k == 'f' for k, _ in parts): return synth(text, speed)
    outa, words, off = [], [], 0.0
    for i, (k, t) in enumerate(parts):
        if k == 'f':
            au, ws = synth(t, speed * 0.72); au = au * 0.82
            g0 = np.zeros(int(.05 * SR), dtype='float32'); outa.append(g0); off += .05
            ws = [{'w': t + ',', 's': round(off + w['s'], 3), 'e': round(off + w['e'], 3)} for w in ws[:1]] or [{'w': t + ',', 's': off, 'e': off + len(au) / SR}]
            words += ws; outa.append(au); off += len(au) / SR
            g1 = np.zeros(int(.11 * SR), dtype='float32'); outa.append(g1); off += .11
        else:
            au, ws = synth(t, speed); words += [{'w': w['w'], 's': round(off + w['s'], 3), 'e': round(off + w['e'], 3)} for w in ws]; outa.append(au); off += len(au) / SR
            if i < len(parts) - 1: outa.append(np.zeros(int(.04 * SR), dtype='float32')); off += .04
    return np.concatenate(outa), words
buf = [np.zeros(int(LEAD * SR), dtype='float32')]; cur = LEAD; scenes = []
for si, sc in enumerate(script['scenes']):
    s0 = cur; beats = []
    for bi, text in enumerate(sc['beats']):
        b0 = cur; allw = []
        sens = sentences(text)
        for k, s in enumerate(sens):
            au, words = synth_s(s, round(spd(s) * (1.08 if sc['id'] == 's01' else 1.0), 3)); d = len(au) / SR
            allw += [{'w': w['w'], 's': round(cur + w['s'], 3), 'e': round(cur + w['e'], 3)} for w in words]
            buf.append(au); cur += d
            if k < len(sens) - 1:
                g = pause_after(s, False); buf.append(np.zeros(int(g * SR), dtype='float32')); cur += g
        beats.append({'i': bi, 'text': text, 'start': round(b0, 3), 'end': round(cur, 3), 'words': allw})
        gap = GAP_SCENE if bi == len(sc['beats']) - 1 else 0.22
        if si == len(script['scenes']) - 1 and bi == len(sc['beats']) - 1: gap = TAIL
        buf.append(np.zeros(int(gap * SR), dtype='float32')); cur += gap
    scenes.append({'id': sc['id'], 'shot': sc['shot'], 'start': round(s0, 3), 'end': round(cur, 3), 'beats': beats})
    print(sc['id'], round(cur, 1), flush=True)
sf.write(os.path.join(HERE, 'audio', 'voice.wav'), np.concatenate(buf), SR)
json.dump({'voice': a.voice, 'base': a.base, 'total': round(cur, 3), 'scenes': scenes}, open(os.path.join(HERE, 'timing.json'), 'w'), indent=1)
print('TOTAL', round(cur, 1), 's =', round(cur / 60, 2), 'min'); print('DONE')
