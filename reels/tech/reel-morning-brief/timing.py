# Join the finished voice lines (vo/lNN.wav) into audio/voice.wav and write site/timing.js:
#   SC = scene start times, WD = words {p: line, w: display word, k: key, s, e}, PG = caption pages, TOTAL.
# Display words come from voice/lines.json (the script); times from Whisper word timestamps on each finished line,
# aligned by text (difflib; spoken numbers mapped). Run with the qwen venv: /tmp/qwenenv/bin/python timing.py
import json, re, difflib, os, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
SR = 24000
LINES = json.load(open('voice/lines.json'))
SCENE_OF_LINE = [0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9]          # line -> scene (lines 4+5 share the "write the brief" scene)
GAP = [0, .30, .42, .42, .22, .42, .30, .42, .34, .45, .40]  # silence before each line: short, so the read keeps moving
TAIL = 3.4                                                   # hold after the last line (recap + CTA)
LEAD = .28                                                   # a scene starts this long before its first line
NUM = {'1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '7': 'seven', '100': 'hundred'}
key = lambda w: re.sub(r"[^a-z0-9']", '', w.lower())
asr = WhisperModel('small.en', device='cpu', compute_type='int8')
pcm, t, WD, SC, PG = [], 0.0, [], [], []
os.makedirs('audio', exist_ok=True)
for i, (sid, txt) in enumerate(LINES):
    a, sr = sf.read(f'vo/{sid}.wav'); assert sr == SR
    pcm.append(np.zeros(int(GAP[i] * SR), np.float32)); t += GAP[i]
    if SCENE_OF_LINE[i] == len(SC): SC.append(0.0 if i == 0 else round(t - LEAD, 3))
    segs, _ = asr.transcribe(f'vo/{sid}.wav', language='en', word_timestamps=True, beam_size=5)
    wh = [dict(w=w.word.strip(), s=w.start, e=w.end) for sg in segs for w in sg.words]
    disp = txt.split(); dk = [key(w) for w in disp]; hk = [NUM.get(key(w['w']), key(w['w'])) for w in wh]
    times = [None] * len(disp)
    for b in difflib.SequenceMatcher(None, dk, hk, autojunk=False).get_matching_blocks():
        for q in range(b.size): times[b.a + q] = (wh[b.b + q]['s'], wh[b.b + q]['e'])
    for j in range(len(disp)):
        if times[j] is None:
            nx = next((times[q] for q in range(j + 1, len(disp)) if times[q]), None); pv = times[j - 1] if j else None
            if nx: s0 = pv[1] if pv else max(0, nx[0] - .2); times[j] = (min(s0, nx[0]), max(min(s0, nx[0]) + .06, nx[0]))
            else: times[j] = (pv[1], pv[1] + .2)
            print('filled', sid, disp[j])
    base = len(WD)
    for w, (s, e) in zip(disp, times): WD.append(dict(p=i + 1, w=w, k=key(w), s=round(t + s, 3), e=round(t + e, 3)))
    cl, cur = [], []
    for j, w in enumerate(disp):
        cur.append(base + j)
        if w[-1] in '.?:,' or j == len(disp) - 1: cl.append(cur); cur = []
    merged = []
    for c in cl:
        if merged and len(merged[-1]) + len(c) <= 7 and WD[merged[-1][-1]]['w'][-1] not in '.?:': merged[-1] += c
        else: merged.append(c)
    for c in merged:
        k = -(-len(c) // 7); n = -(-len(c) // k)
        for q in range(0, len(c), n): PG.append(c[q:q + n])
    pcm.append(a.astype(np.float32)); t += len(a) / SR
pcm.append(np.zeros(int(TAIL * SR), np.float32)); t += TAIL
sf.write('audio/voice.wav', np.concatenate(pcm), SR)
os.makedirs('site', exist_ok=True)
open('site/timing.js', 'w').write('window.SC=%s;window.WD=%s;window.PG=%s;window.TOTAL=%s;\n' % (json.dumps(SC), json.dumps(WD), json.dumps(PG), round(t, 3)))
print('total', round(t, 2), 'scenes', SC)
