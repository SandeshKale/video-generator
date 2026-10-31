#!/usr/bin/env python3
"""Whisper was fed 24 kHz audio as if it were 16 kHz in build_voice3.py, so every word time in qc3.json is 1.5x too long (the text was still right).
This rescales them (x 16/24) and writes absolute word/sentence times for the page: audio/words.json and site/timing.js."""
import json, re, os, numpy as np, soundfile as sf
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = R + '/audio'; SR = 24000
S = json.load(open(R + '/script.json'))['sentences']; sid = {s['id']: s for s in S}
tl = json.load(open(OUT + '/timeline-v3.json')); qc = json.load(open(OUT + '/qc3.json'))
GROUPS = [('g1', ['h1']), ('g2', ['h2', 'p1']), ('g3', ['d1a', 'd1b']), ('g4', ['d2a', 'd2b']), ('g5', ['d3a', 'd3b']), ('g6', ['w1a', 'w1b']), ('g7', ['w2', 's1']), ('g8', ['c1', 'c2'])]
MERGE = {'ट':'त','ठ':'थ','ड':'द','ढ':'ध','ष':'स','श':'स','ण':'न','ञ':'न','ङ':'न','ज़':'ज','फ़':'फ','क़':'क','ख़':'ख','ग़':'ग','ड़':'र','ढ़':'र','ऑ':'ओ','ऐ':'ए','औ':'ओ','ई':'इ','ऊ':'उ','आ':'अ'}
def skel(t):
    t = re.sub(r'[़्ँंःा-ौ॑-॔।,.?!\'"’‘ \-]', '', t); return ''.join(MERGE.get(c, c) for c in t)
gst = {g['group']: g for g in tl['groups']}; words = []; sents = []
for gid, ids in GROUPS:
    a, _ = sf.read(f'{R}/audio/takes3/{gid}.wav'); a = a.astype('float32'); nz = np.where(np.abs(a) > 0.012)[0]; a0 = max(0, nz[0] - int(0.05*SR)) / SR; dur = len(a) / SR
    g0 = gst[gid]['start']; W = []
    for w, s, e in qc[gid]['words']:
        s2 = g0 + s * 2/3 - a0; e2 = g0 + e * 2/3 - a0; W.append([w.strip(), round(max(g0, s2), 3), round(max(g0 + .05, e2), 3), gid])
    words += W
    # sentence spans by skeleton-length share of the group's words
    wk = np.cumsum([max(1, len(skel(w[0]))) for w in W]); tot = wk[-1]; sk = [len(skel(sid[i]['B'])) for i in ids]; acc = 0
    for i, ln in zip(ids, sk):
        k0 = 0 if acc == 0 else int(np.searchsorted(wk, acc / sum(sk) * tot)) + 1; acc += ln; k1 = min(len(W) - 1, int(np.searchsorted(wk, acc / sum(sk) * tot)))
        k0 = min(k0, k1); sents.append(dict(id=i, group=gid, t0=W[k0][1], t1=W[k1][2], k0=len(words) - len(W) + k0, k1=len(words) - len(W) + k1))
# roman caption words spread across each sentence's spoken span, weighted by word length
cap = []
for s in sents:
    toks = sid[s['id']]['cap'].split(); w = [max(2, len(re.sub(r'[^A-Za-z0-9]', '', t))) + 1 for t in toks]; tot = sum(w); t0, t1 = s['t0'], s['t1'] + .05; acc = 0
    for t, ww in zip(toks, w):
        cap.append(dict(w=t, t0=round(t0 + (t1 - t0) * acc / tot, 3), t1=round(t0 + (t1 - t0) * (acc + ww) / tot, 3), s=s['id'])); acc += ww
end = tl['groups'][-1]['end']
json.dump(dict(words=words, sentences=sents, cap=cap, groups=tl['groups'], end=end), open(OUT + '/words.json', 'w'), ensure_ascii=False, indent=1)
open(R + '/site/timing.js', 'w').write('window.TM=' + json.dumps(dict(words=words, sentences=sents, cap=cap, end=end), ensure_ascii=False) + ';')
print('end', end, 'sentences', [(s['id'], s['t0'], s['t1']) for s in sents])
