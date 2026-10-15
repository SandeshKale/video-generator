#!/usr/bin/env python3
"""Word times, story cues and caption chunks for site2/timing.js from audio/voice.wav (the paragraph read). Run with the qwen venv (faster-whisper)."""
import sys, re, json, difflib
from faster_whisper import WhisperModel
LINES = json.load(open('voice2/lines.json'))
DIG = {'57': ['fifty', 'seven'], '10': ['ten'], '2': ['two'], '100': ['hundred'], '5': ['five'], '1': ['one']}
def norm(w): return re.sub(r"[^a-z0-9]", "", w.lower())
def toks(s): return [t for t in (norm(w) for w in s.replace('-', ' ').split()) if t]
asr = WhisperModel('small.en', device='cpu', compute_type='int8'); segs, _ = asr.transcribe('audio/voice.wav', word_timestamps=True, language='en', vad_filter=False)
flat = []
for s in segs:
    for w in s.words:
        parts = [p for p in re.split(r'[-— ]', w.word.strip()) if p]; n = len(parts) or 1
        for k, p in enumerate(parts):
            a = w.start + (w.end - w.start) * k / n; b = w.start + (w.end - w.start) * (k + 1) / n; t = norm(p)
            if t in DIG:
                for q, x in enumerate(DIG[t]): flat.append((x, a + (b - a) * q / len(DIG[t]), a + (b - a) * (q + 1) / len(DIG[t])))
            elif t: flat.append((t, a, b))
script, owner = [], []
for li, (sid, text) in enumerate(LINES):
    tk = toks(text.replace('a.m.', 'am')); script += tk; owner += [li] * len(tk)
sm = difflib.SequenceMatcher(None, [f[0] for f in flat], script, autojunk=False); tm = [None] * len(script)
for a, b, n in sm.get_matching_blocks():
    for k in range(n): tm[b + k] = (flat[a + k][1], flat[a + k][2])
for i, t in enumerate(tm):
    if t is None:
        l = next((j for j in range(i - 1, -1, -1) if tm[j]), None); r = next((j for j in range(i + 1, len(tm)) if tm[j]), None)
        if l is not None and r is not None: tm[i] = (tm[l][1], tm[r][0]) if tm[r][0] > tm[l][1] else (tm[l][1], tm[l][1] + .15)
        elif l is not None: tm[i] = (tm[l][1], tm[l][1] + .2)
        elif r is not None: tm[i] = (max(0, tm[r][0] - .2), tm[r][0])
words = [{'w': script[i], 's': round(tm[i][0], 3), 'e': round(tm[i][1], 3), 'line': owner[i]} for i in range(len(script)) if tm[i]]
def W(line, word, nth=0, edge='s'):
    c = [w for w in words if LINES[w['line']][0] == line and w['w'] == word]
    if len(c) <= nth: print('WARNING cue not found', line, word, nth); return None
    return c[nth][edge]
cue = {k: v for k, v in {
    'grab': W('c2', 'grab'), 'write': W('c2', 'write'), 'hangEnd': W('c2', 'you', 0, 'e'), 'dont': W('c2', 'dont'), 'taxes': W('c2', 'taxes'), 'next': W('c2', 'next'), 'accountant': W('c2', 'accountant'), 'ten': W('c2', 'ten'),
    'c2End': [w for w in words if LINES[w['line']][0] == 'c2'][-1]['e'], 'unfinished': W('c3', 'unfinished'), 'quiet': W('c3', 'quiets'), 'lab': W('c3', 'lab'), 'faster': W('c3', 'faster'), 'only': W('c4', 'only'), 'fifty': W('c4', 'fifty'),
    'experiment': W('c4', 'experiment'), 'save': W('c5', 'save'), 'send': W('c5', 'send'), 'comment': W('c5', 'comment'), 'follow': W('c5', 'follow', 1) or W('c5', 'follow')}.items() if v is not None}
DISPLAY = {'c2': 'Grab a pen and paper, and write down everything that\'s still hanging over you. But don\'t just write "taxes". Write the next step: call the accountant at ten.', 'c5': "Save this for tonight, send it to someone who's always up at two a.m., and comment TONIGHT for the printable list. Follow for more hacks like this.", 'c4': "It was only fifty-seven healthy adults, so try it as an experiment, not a cure."}
caps = []
for sid, text in LINES:
    dw = DISPLAY.get(sid, text).split(); tw = [w for w in words if LINES[w['line']][0] == sid]
    if not tw: continue
    ti = 0; timed = []
    for d in dw:
        n = len(toks(d.replace('a.m.', 'am'))) or 1; sg = tw[ti:ti + n]; ti += n
        if sg: timed.append((d, sg[0]['s'], sg[-1]['e']))
    chunk = []
    def flush():
        global chunk
        if chunk: caps.append([chunk[0][1] - .04, chunk[-1][2], ' '.join(c[0] for c in chunk)]); chunk = []
    for d, s_, e_ in timed:
        chunk.append((d, s_, e_))
        if re.search(r'[.?!:]["”]?$', d) or (d.endswith(',') and len(chunk) >= 4) or len(chunk) >= 7: flush()
    flush()
for i in range(len(caps) - 1): caps[i][1] = min(caps[i][1] + .35, caps[i + 1][0] - .02) if caps[i + 1][0] - caps[i][1] > .02 else caps[i][1]
caps = [[round(a, 3), round(b, 3), t] for a, b, t in caps]
dur = round(max(w['e'] for w in words), 3); out = {'dur': dur, 'words': words, 'cue': {k: round(v, 3) for k, v in cue.items()}, 'caps': caps}
open('site2/timing.js', 'w').write('window.TM = ' + json.dumps(out) + ';'); json.dump(out, open('timing.json', 'w'), indent=1); print('dur', dur, json.dumps(out['cue']))
for c in caps: print(c)
