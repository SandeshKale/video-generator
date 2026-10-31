#!/usr/bin/env python3
"""Word / sentence / caption times for the page: audio/words.json + site/timing.js.
Uses the real takes (audio/takes/gN.wav + audio/qc3.json) and, for groups not generated yet, a provisional estimate (flag PROV) so the page can be developed while the voice renders.
Group start times replicate voice/build_voice.py's assembly (trim, designed gap) exactly."""
import json, re, os, numpy as np, soundfile as sf
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); A = R + '/audio'; SR = 24000
SL = json.load(open(R + '/script.json'))['sentences']; S = {s['id']: s for s in SL}
qp = A + '/qc3.json'; qc = json.load(open(qp)) if os.path.exists(qp) else {}
GROUPS = []
for x in SL:
    if not GROUPS or GROUPS[-1][0] != x['g']: GROUPS.append((x['g'], []))
    GROUPS[-1][1].append(x['id'])
GAP = {'g1': 0.55, 'g2': 1.0, 'g3': 0.9, 'g4': 0.8, 'g5': 0.9, 'g6': 1.0, 'g7': 0.8, 'g8': 0.9, 'g9': 0.9, 'g10': 0.9, 'g11': 0.9, 'g12': 0.9, 'g13': 0.6, 'g13b': 1.0, 'g14': 0.0}
MERGE = {'ट':'त','ठ':'थ','ड':'द','ढ':'ध','ष':'स','श':'स','ण':'न','ञ':'न','ङ':'न','ज़':'ज','फ़':'फ','क़':'क','ख़':'ख','ग़':'ग','ड़':'र','ढ़':'र','ऑ':'ओ','ऐ':'ए','औ':'ओ','ई':'इ','ऊ':'उ','आ':'अ'}
def skel(t):
    t = re.sub(r'[़्ँंःा-ौ॑-॔।,.?!\'"’‘ \-]', '', t); return ''.join(MERGE.get(c, c) for c in t)
words = []; sents = []; groups = []; cur = 0.0; prov = []
for gid, ids in GROUPS:
    tp = f'{A}/takes/{gid}.wav'; real = gid in qc and os.path.exists(tp)
    if real:
        a, _ = sf.read(tp); a = a.astype('float32'); nz = np.where(np.abs(a) > 0.012)[0]; a0 = max(0, nz[0] - int(0.05*SR)) / SR; a1 = min(len(a), nz[-1] + int(0.12*SR)) / SR; n = a1 - a0
        W = [[w[0].strip(), w[1] - a0, w[2] - a0] for w in qc[gid]['words']]
    else:
        prov.append(gid); toks = ' '.join(S[i]['B'] for i in ids).split(); n = len(toks) / 4.1; wl = np.array([max(2, len(skel(t))) for t in toks], float); cw = np.cumsum(wl) / wl.sum() * n
        W = [[t, float(c - l / wl.sum() * n), float(c)] for t, c, l in zip(toks, cw, wl)]
    W = [[w[0], round(cur + max(0, w[1]), 3), round(cur + min(n, max(w[1] + .05, w[2])), 3), gid] for w in W]
    k_base = len(words); words += W
    wk = np.cumsum([max(1, len(skel(w[0]))) for w in W]); tot = wk[-1]; sk = [len(skel(S[i]['B'])) for i in ids]; acc = 0
    for i, ln in zip(ids, sk):
        k0 = 0 if acc == 0 else int(np.searchsorted(wk, acc / sum(sk) * tot)) + 1; acc += ln; k1 = min(len(W) - 1, int(np.searchsorted(wk, acc / sum(sk) * tot))); k0 = min(k0, k1)
        sents.append(dict(id=i, group=gid, t0=W[k0][1], t1=W[k1][2], k0=k_base + k0, k1=k_base + k1))
    groups.append(dict(group=gid, start=round(cur, 3), end=round(cur + n, 3), real=real)); cur += n + GAP.get(gid, .9)
cap = []
for s in sents:
    toks = S[s['id']]['cap'].split(); w = [max(2, len(re.sub(r'[^A-Za-z0-9]', '', t))) + 1 for t in toks]; tot = sum(w); t0, t1 = s['t0'], s['t1'] + .05; acc = 0
    for t, ww in zip(toks, w):
        cap.append(dict(w=t, t0=round(t0 + (t1 - t0) * acc / tot, 3), t1=round(t0 + (t1 - t0) * (acc + ww) / tot, 3), s=s['id'])); acc += ww
end = groups[-1]['end'] + 0.45
BT = {x['id']: x['B'] for x in SL}
json.dump(dict(words=words, sentences=sents, cap=cap, groups=groups, end=end, provisional=prov, B=BT), open(A + '/words.json', 'w'), ensure_ascii=False, indent=1)
os.makedirs(R + '/site', exist_ok=True)
open(R + '/site/timing.js', 'w').write('window.TM=' + json.dumps(dict(words=words, sentences=sents, cap=cap, groups=groups, end=end, provisional=prov, B=BT), ensure_ascii=False) + ';')
print('end %.1f s' % end, 'provisional groups:', prov); print([(s['id'], round(s['t0'], 1), round(s['t1'], 1)) for s in sents])
