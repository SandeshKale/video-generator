# Join the finished voice lines (vo/lNN.wav, after voice/pick.py + voice/clean.py) into audio/voice.wav and write site/timing.js:
#   SC = scene start times, WD = words {p: line (1-based), w: display word, k: key, s, e}, PG = caption pages, TOTAL.
# One line per scene. Display words come from voice/lines.json; times from Whisper word timestamps on each finished line,
# aligned by text (difflib). Run with the qwen venv: /tmp/qwenenv/bin/python timing.py
import json, re, difflib, os, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
SR = 24000
LINES = json.load(open('voice/lines.json'))
# silence before each line. Line 2 waits for the hook's chart to finish (bars land ~2.65 s); line 5 waits on the menu
# path (scene 4 holds it >= 2.5 s for screenshots); the rest keep the read moving.
GAP = [0, .70, .36, .36, .80, .36, .32, .32, .34, .42]
TAIL = 3.2                                                   # hold after the last line (recap + comment CTA)
LEAD = .12                                                   # a scene starts this long before its line
key = lambda w: re.sub(r"[^a-z0-9']", '', w.lower())
asr = WhisperModel('small.en', device='cpu', compute_type='int8')
pcm, t, WD, SC, PG = [], 0.0, [], [], []
os.makedirs('audio', exist_ok=True)
for i, (sid, txt) in enumerate(LINES):
    a, sr = sf.read(f'vo/{sid}.wav'); assert sr == SR, sr
    a = a if a.ndim == 1 else a.mean(1)
    pcm.append(np.zeros(int(GAP[i] * SR), np.float32)); t += GAP[i]
    SC.append(0.0 if i == 0 else round(t - LEAD, 3))
    segs, _ = asr.transcribe(f'vo/{sid}.wav', language='en', word_timestamps=True, beam_size=5)
    wh = [dict(w=w.word.strip(), s=w.start, e=w.end) for sg in segs for w in sg.words]
    disp = txt.split(); dk = [key(w) for w in disp]; hk = [key(w['w']) for w in wh]
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
    # caption pages: split at punctuation, merge short clauses, at most 6 words per page (two lines at 46 px)
    cl, cur = [], []
    for j, w in enumerate(disp):
        cur.append(base + j)
        if w[-1] in '.?:,' or j == len(disp) - 1: cl.append(cur); cur = []
    merged = []
    for c in cl:
        if merged and len(merged[-1]) + len(c) <= 6 and WD[merged[-1][-1]]['w'][-1] not in '.?:': merged[-1] += c
        else: merged.append(c)
    for c in merged:
        k = -(-len(c) // 6); n = -(-len(c) // k)
        for q in range(0, len(c), n): PG.append(c[q:q + n])
    pcm.append(a.astype(np.float32)); t += len(a) / SR
    print(sid, 'at %.2f-%.2f' % (t - len(a) / SR, t), ' '.join('%s@%.2f' % (w['w'], w['s']) for w in WD[base:]))
pcm.append(np.zeros(int(TAIL * SR), np.float32)); t += TAIL
sf.write('audio/voice.wav', np.concatenate(pcm), SR)
open('site/timing.js', 'w').write('window.SC=%s;window.WD=%s;window.PG=%s;window.TOTAL=%s;\n' % (json.dumps(SC), json.dumps(WD), json.dumps(PG), round(t, 3)))
print('total', round(t, 2), 'scenes', SC)
