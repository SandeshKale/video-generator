#!/usr/bin/env python3
"""Voiceover for the video: synthesizes each script sentence with Kokoro (CPU),
caches per-sentence wavs by hash, assembles one wav per part, and writes
timing.json (sentence start/end per part) that the scene builder syncs visuals to.
Usage: python tts.py [--voice af_heart] [--speed 0.95]"""
import argparse, hashlib, json, os, time
import numpy as np, soundfile as sf
from kokoro import KPipeline

ap = argparse.ArgumentParser()
ap.add_argument('--voice', default=os.environ.get('VOICE', 'af_heart'))
ap.add_argument('--speed', type=float, default=float(os.environ.get('SPEED', 0.95)))
args = ap.parse_args()

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 24000
LEAD, GAP, TAIL = 0.9, 0.55, 1.1   # lead leaves room for the chapter slate
script = json.load(open(os.path.join(HERE, 'script.json')))
pipe = KPipeline(lang_code='a' if not args.voice.startswith('b') else 'b')
os.makedirs(os.path.join(HERE, 'audio'), exist_ok=True)

def synth(text):
    key = hashlib.sha1(f'{args.voice}|{args.speed}|{text}'.encode()).hexdigest()[:16]
    path = os.path.join(HERE, 'audio', f'sent-{key}.wav')
    if os.path.exists(path):
        a, _ = sf.read(path, dtype='float32'); return a
    chunks = [a for _, _, a in pipe(text, voice=args.voice, speed=args.speed)]
    a = np.concatenate([np.asarray(c, dtype='float32') for c in chunks])
    sf.write(path, a, SR); return a

timing = {'voice': args.voice, 'speed': args.speed, 'parts': []}
t_all = time.time()
for part in script['parts']:
    t0 = time.time()
    buf = [np.zeros(int(LEAD * SR), dtype='float32')]
    cur = LEAD; sents = []
    for i, s in enumerate(part['sentences']):
        a = synth(s)
        dur = len(a) / SR
        sents.append({'start': round(cur, 3), 'end': round(cur + dur, 3), 'text': s})
        buf.append(a); cur += dur
        if i < len(part['sentences']) - 1:
            gap = GAP + (0.15 if len(s.split()) <= 6 else 0)   # a beat after punch lines
            buf.append(np.zeros(int(gap * SR), dtype='float32')); cur += gap
    buf.append(np.zeros(int(TAIL * SR), dtype='float32')); cur += TAIL
    out = os.path.join(HERE, 'audio', f'part-{part["id"]:02d}.wav')
    sf.write(out, np.concatenate(buf), SR)
    timing['parts'].append({'id': part['id'], 'duration': round(cur, 3), 'sentences': sents})
    print(f'part {part["id"]:02d}: {cur:6.1f}s  ({time.time()-t0:.0f}s to synth)', flush=True)
    json.dump(timing, open(os.path.join(HERE, 'timing.json'), 'w'), indent=1)

total = sum(p['duration'] for p in timing['parts'])
print(f'TOTAL {total:.1f}s = {total/60:.2f} min  (synth {time.time()-t_all:.0f}s)', flush=True)
print('DONE')
