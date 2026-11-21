#!/usr/bin/env python3
"""timing.js from audio/timeline.json (real voice) or, with --est, from word counts (provisional, for layout work)."""
import json, re, sys, os
H = os.path.dirname(os.path.abspath(__file__)); S = json.load(open(H + '/script.json'))['sentences']
est = '--est' in sys.argv
if est:
    t = 0.0; groups = []; sent = {}
    gs = {}
    for s in S: gs.setdefault(s['g'], []).append(s)
    for g, v in gs.items():
        dur = sum(len(x['B'].split()) for x in v) / 2.7 + .5; groups.append(dict(g=int(g[1:]), t0=round(t, 2))); 
        tot = sum(len(x['A']) for x in v); tt = t
        for x in v: d = (dur - .5) * len(x['A']) / tot; sent[x['id']] = (tt, tt + d, x['A']); tt += d
        t += dur
    end = t + 2.0; sents = [dict(id=k, start=a, end=b, text=c) for k, (a, b, c) in sent.items()]
else:
    T = json.load(open(H + '/audio/timeline.json')); grp = {x['group']: x for x in T['groups']}
    groups = [dict(g=int(k[1:]), t0=round(max(0, grp[k]['start'] - .05), 2)) for k in sorted(grp, key=lambda z: int(z[1:]))]; groups[0]['t0'] = 0
    sents = T['sentences']; end = max(x['end'] for x in T['groups']) + 3.0
caps = []
for s in sents:
    ch = [c.strip() for c in re.split(r'(?<=[.?,])\s+', s['text']) if c.strip()]; out = []
    for c in ch:
        if out and len(out[-1]) + len(c) < 46: out[-1] += ' ' + c
        else: out.append(c)
    tot = sum(len(c) for c in out); t = s['start']
    for c in out: d = (s['end'] - s['start']) * len(c) / tot; caps.append(dict(t0=round(t, 2), t1=round(t + d, 2), text=c)); t += d
open(H + '/site/timing.js', 'w').write('window.VT=' + json.dumps(dict(groups=groups, end=round(end, 2), caps=caps), ensure_ascii=False) + ';')
print(len(groups), 'groups, end', round(end, 1), 's')
