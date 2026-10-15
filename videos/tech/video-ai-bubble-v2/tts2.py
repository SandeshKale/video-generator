#!/usr/bin/env python3
"""Beat-level voiceover with word timestamps (Kokoro, CPU). Writes audio/voice.wav + timing.json.
Usage: python tts2.py [--voice af_heart] [--speed 1.04]"""
import argparse, hashlib, json, os, pickle, numpy as np, soundfile as sf
from kokoro import KPipeline
ap = argparse.ArgumentParser(); ap.add_argument('--voice', default='af_heart'); ap.add_argument('--speed', type=float, default=1.04)
a = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 24000
LEAD, GAP_BEAT, GAP_SCENE, TAIL = 0.6, 0.20, 0.42, 1.8
script = json.load(open(os.path.join(HERE, 'script.json')))
pipe = KPipeline(lang_code='a'); os.makedirs(os.path.join(HERE, 'audio', 'cache'), exist_ok=True)
PUNCT = set('.,!?;:—-"\'')

def synth(text):
    key = hashlib.sha1(f'{a.voice}|{a.speed}|{text}'.encode()).hexdigest()[:16]
    path = os.path.join(HERE, 'audio', 'cache', key + '.pkl')
    if os.path.exists(path): return pickle.load(open(path, 'rb'))
    chunks, words, off = [], [], 0.0
    for r in pipe(text, voice=a.voice, speed=a.speed):
        au = np.asarray(r.audio, dtype='float32'); chunks.append(au)
        for t in (r.tokens or []):
            if t.text.strip() and t.text.strip() not in PUNCT and t.start_ts is not None and t.end_ts is not None:
                words.append({'w': t.text, 's': round(off + t.start_ts, 3), 'e': round(off + t.end_ts, 3)})
        off += len(au) / SR
    res = (np.concatenate(chunks), words); pickle.dump(res, open(path, 'wb')); return res

buf = [np.zeros(int(LEAD * SR), dtype='float32')]; cur = LEAD; scenes = []
for si, sc in enumerate(script['scenes']):
    s0 = cur; beats = []
    for bi, text in enumerate(sc['beats']):
        au, words = synth(text); d = len(au) / SR
        beats.append({'i': bi, 'text': text, 'start': round(cur, 3), 'end': round(cur + d, 3),
                      'words': [{'w': w['w'], 's': round(cur + w['s'], 3), 'e': round(cur + w['e'], 3)} for w in words]})
        buf.append(au); cur += d
        gap = GAP_SCENE if bi == len(sc['beats']) - 1 else GAP_BEAT
        if si == len(script['scenes']) - 1 and bi == len(sc['beats']) - 1: gap = TAIL
        buf.append(np.zeros(int(gap * SR), dtype='float32')); cur += gap
    scenes.append({'id': sc['id'], 'shot': sc['shot'], 'start': round(s0, 3), 'end': round(cur, 3), 'beats': beats})
    print(sc['id'], round(cur, 1), flush=True)
sf.write(os.path.join(HERE, 'audio', 'voice.wav'), np.concatenate(buf), SR)
json.dump({'voice': a.voice, 'speed': a.speed, 'total': round(cur, 3), 'scenes': scenes}, open(os.path.join(HERE, 'timing.json'), 'w'), indent=1)
print('TOTAL', round(cur, 1), 's =', round(cur / 60, 2), 'min'); print('DONE')
