#!/usr/bin/env python3
"""Hindi voice-over v2: OmniVoice voice design (male, middle-aged, low pitch, indian accent), ONE take per sentence, retries by seed until the Whisper transcript matches
the script (difflib ratio) and the take has no long internal gap. Writes audio/takes/sNN.wav + audio/takes/scores.json. usage: python3 voice2.py [speed]"""
import os, sys, json, time, difflib, numpy as np, soundfile as sf, torch
os.environ['HF_HUB_OFFLINE'] = '1'
from omnivoice import OmniVoice
from faster_whisper import WhisperModel
H = os.path.dirname(os.path.abspath(__file__)); SPEED = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
S = json.load(open(os.path.join(H, 'script.json')))['sentences']; torch.set_num_threads(4)
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32); wh = WhisperModel('small', device='cpu', compute_type='int8')
INS = 'male, middle-aged, low pitch, indian accent'; sc = {}
sp = os.path.join(H, 'audio', 'takes', 'scores.json')
if os.path.exists(sp): sc = json.load(open(sp))
def norm(t): return ''.join(ch for ch in t if ch.isalnum() or ch == ' ').replace('ओटीपी', 'otp').lower()
for i, s in enumerate(S):
    key = f's{i:02d}'
    if key in sc and sc[key]['score'] >= 0.8 and os.path.exists(os.path.join(H, 'audio', 'takes', key + '.wav')): continue
    spoken = ' '.join(c[0] for c in s['c']).replace('-', ' ')
    best = None
    for tr in range(3):
        torch.manual_seed(100 * i + tr); t0 = time.time()
        a = np.asarray(m.generate(text=spoken, instruct=INS, language='hi', num_step=32, speed=SPEED)[0]).astype('float32')
        segs, _ = wh.transcribe(a, language='hi', beam_size=5); tx = ' '.join(x.text for x in segs)
        ratio = difflib.SequenceMatcher(None, norm(spoken), norm(tx)).ratio()
        thr = np.abs(a) > 0.02; idx = np.where(thr)[0]; gap = 0.0
        if len(idx) > 1: gap = float(np.max(np.diff(idx)) / 24000)
        print(key, tr, round(len(a) / 24000, 2), 's', 'score', round(ratio, 2), 'maxgap', round(gap, 2), f'{time.time()-t0:.0f}s', flush=True)
        if best is None or ratio - 0.3 * max(0, gap - 0.5) > best[0]: best = (ratio - 0.3 * max(0, gap - 0.5), a, ratio, gap, tx)
        if ratio >= 0.84 and gap < 0.55: break
    sf.write(os.path.join(H, 'audio', 'takes', key + '.wav'), best[1], 24000); sc[key] = dict(score=round(best[2], 3), gap=round(best[3], 2), dur=round(len(best[1]) / 24000, 2), tx=best[4], text=spoken)
    json.dump(sc, open(sp, 'w'), ensure_ascii=False, indent=1)
print('done')
