#!/usr/bin/env python3
"""Build timing.json (line a/b + words) from the final voice-over (stitched avatar audio) using faster-whisper word timestamps.
Usage: python3 timing_from_voice.py vo/voice.wav [out=timing.json]
Aligns Whisper's words to the script lines by text (difflib), so a mis-heard word does not shift a line. Prints any line it could not anchor."""
import sys, re, json, difflib
from faster_whisper import WhisperModel
LINES = ["While I say this, your body replaces millions of cells.", "About four million. Every second.", "Most are blood cells. A red blood cell lasts about four months.", "Your gut lining? Three to five days.", "A brand-new body every seven years? Not quite.", "Most of your brain's neurons are never replaced.", "Send this to the friend who says they're a new person.", "Since you pressed play: about a hundred million.", "Follow for the next one."]
SPOKEN = {}
def norm(w): return re.sub(r"[^a-z0-9]", "", w.lower().replace("2025", "twentytwentyfive"))
def toks(s): return [t for t in (norm(w) for w in s.replace('-', ' ').split()) if t]
src, out = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else 'timing.json')
model = WhisperModel('small.en', device='cpu', compute_type='int8'); segs, _ = model.transcribe(src, word_timestamps=True, language='en', vad_filter=False)
NUMW = {'4': 'four', '3': 'three', '5': 'five', '7': 'seven', '100': 'hundred'}
W = [(NUMW.get(norm(w.word), norm(w.word)), w.start, w.end) for s in segs for w in s.words if norm(w.word)]
# flatten Whisper tokens: "2025" may come as one token
flat = []
for t, s, e in W:
    if t == 'twentytwentyfive': flat += [('twenty', s, s + (e - s) / 3), ('twenty', s + (e - s) / 3, s + 2 * (e - s) / 3), ('five', s + 2 * (e - s) / 3, e)]
    else: flat.append((t, s, e))
script = []; owner = []
for i, l in enumerate(LINES):
    tk = toks(SPOKEN.get(i, l)); script += tk; owner += [i] * len(tk)
sm = difflib.SequenceMatcher(None, [f[0] for f in flat], script, autojunk=False); first = {}; last = {}
for a, b, n in sm.get_matching_blocks():
    for k in range(n):
        li = owner[b + k]; ws = flat[a + k]; first.setdefault(li, ws[1]); last[li] = ws[2]
res = {'lines': [], 'dur': round(max(f[2] for f in flat), 3)}
for i, l in enumerate(LINES):
    if i not in first: print('WARNING: line', i + 1, 'not anchored'); continue
    ws = [{'w': f[0], 's': round(f[1], 3), 'e': round(f[2], 3)} for f in flat if first[i] - .01 <= f[1] <= last[i] + .01]
    res['lines'].append({'i': i + 1, 'text': l, 'a': round(first[i], 3), 'b': round(last[i], 3), 'words': ws})
json.dump(res, open(out, 'w'), indent=1)
for l in res['lines']: print(l['i'], l['a'], l['b'])
