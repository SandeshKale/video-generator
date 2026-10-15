#!/usr/bin/env python3
"""Build site/timing.js (word times, cue times, caption chunks) from the final voice-over.
Usage: python3 timing_from_voice.py vo/voice.wav   (voice.wav = the 8 breath-group takes joined by designed silences, see voice/assemble2.py)
Whisper words are aligned to the script by text (difflib), so a misheard word cannot shift a cue. Prints any cue it could not anchor."""
import sys, re, json, difflib
from faster_whisper import WhisperModel
LINES = json.load(open('voice/lines.json'))          # [[id, text], ...]  (spoken form)
DISPLAY = {'q3': 'Three: be specific. Not "taxes". "Call the accountant, ten a.m."', 'q7': "Save this, for tonight. Send it to someone, who's always up at two a.m.",
           'q1': "Brain still running a hundred tabs? Here's a five-minute fix."}
DIG = {'57': ['fifty', 'seven'], '10': ['ten'], '2': ['two'], '100': ['hundred'], '1': ['one'], '3': ['three'], '5': ['five']}
def norm(w): return re.sub(r"[^a-z0-9]", "", w.lower())
def toks(s): return [t for t in (norm(w) for w in s.replace('-', ' ').replace('—', ' ').split()) if t]
src = sys.argv[1]
asr = WhisperModel('small.en', device='cpu', compute_type='int8'); segs, _ = asr.transcribe(src, word_timestamps=True, language='en', vad_filter=False)
flat = []
for s in segs:
    for w in s.words:
        parts = [p for p in re.split(r'[-— ]', w.word.strip()) if p]; n = len(parts) or 1
        for k, p in enumerate(parts):
            a = w.start + (w.end - w.start) * k / n; b = w.start + (w.end - w.start) * (k + 1) / n
            t = norm(p)
            if t in DIG:
                L = DIG[t]
                for q, x in enumerate(L): flat.append((x, a + (b - a) * q / len(L), a + (b - a) * (q + 1) / len(L)))
            elif t: flat.append((t, a, b))
script, owner = [], []
for li, (sid, text) in enumerate(LINES):
    tk = toks(text); script += tk; owner += [li] * len(tk)
sm = difflib.SequenceMatcher(None, [f[0] for f in flat], script, autojunk=False)
tm = [None] * len(script)
for a, b, n in sm.get_matching_blocks():
    for k in range(n): tm[b + k] = (flat[a + k][1], flat[a + k][2])
# interpolate gaps
for i, t in enumerate(tm):
    if t is None:
        l = next((j for j in range(i - 1, -1, -1) if tm[j]), None); r = next((j for j in range(i + 1, len(tm)) if tm[j]), None)
        if l is not None and r is not None: tm[i] = (tm[l][1], tm[r][0]) if tm[r][0] > tm[l][1] else (tm[l][1], tm[l][1] + .15)
        elif l is not None: tm[i] = (tm[l][1], tm[l][1] + .2)
        elif r is not None: tm[i] = (max(0, tm[r][0] - .2), tm[r][0])
words = [{'w': script[i], 's': round(tm[i][0], 3), 'e': round(tm[i][1], 3), 'line': owner[i]} for i in range(len(script)) if tm[i]]
def find(line, word, nth=0):
    c = [w for w in words if LINES[w['line']][0] == line and w['w'] == word]
    if len(c) <= nth: print('WARNING: cue not found', line, word); return None
    return c[nth]
def first(line): return next(w for w in words if LINES[w['line']][0] == line)
def last(line): return [w for w in words if LINES[w['line']][0] == line][-1]
cue = {}
for k, (line, word, edge, nth) in {'one': ('q2', 'one', 's', 0), 'two': ('q2', 'two', 's', 0), 'youEnd': ('q2', 'you', 'e', 0), 'three': ('q3', 'three', 's', 0), 'taxes': ('q3', 'taxes', 's', 0),
    'accountant': ('q3', 'accountant', 's', 0), 'unfinished': ('q4', 'unfinished', 's', 0), 'quiet': ('q4', 'quiet', 's', 0), 'lab': ('q5', 'lab', 's', 0), 'faster': ('q5', 'faster', 's', 0),
    'catch': ('q6', 'catch', 's', 0), 'fifty': ('q6', 'fifty', 's', 0), 'send': ('q7', 'send', 's', 0), 'comment': ('q8', 'comment', 's', 0), 'follow': ('q8', 'follow', 's', 0)}.items():
    w = find(line, word, nth)
    if w: cue[k] = w[edge]
cue['q3End'] = last('q3')['e']; cue['save'] = first('q7')['s']
# caption chunks from DISPLAY text (or the spoken text), aligned word by word
caps = []
for sid, text in LINES:
    disp = DISPLAY.get(sid, text).replace('a.m.', 'a.m.'); dw = disp.split()
    tw = [w for w in words if LINES[w['line']][0] == sid]
    if not tw: continue
    # map display words to timed words in order
    ti = 0; timed = []
    for d in dw:
        n = len(toks(d)) or 1; seg_ = tw[ti:ti + n]; ti += n
        if seg_: timed.append((d, seg_[0]['s'], seg_[-1]['e']))
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
dur = round(max(w['e'] for w in words), 3)
out = {'dur': dur, 'words': words, 'cue': {k: round(v, 3) for k, v in cue.items()}, 'caps': caps}
open('site/timing.js', 'w').write('window.TM = ' + json.dumps(out) + ';'); json.dump(out, open('timing.json', 'w'), indent=1)
print('dur', dur, json.dumps(out['cue']))
for c in caps: print(c)
