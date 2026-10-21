#!/usr/bin/env python3
"""timing.json (from voice.py) -> site/timing.js : window.TM = {END, CL:[{a,b,en,ac,p}], S:[sentence a,b]}"""
import json, os
H = os.path.dirname(os.path.abspath(__file__)); T = json.load(open(H + '/timing.json'))
CL = [dict(a=c['a'], b=c['b'], en=c['en'], ac=c['ac'], p=s['p']) for s in T['sentences'] for c in s['clauses']]
S = [[s['a'], s['b'], s['p']] for s in T['sentences']]
open(H + '/site/timing.js', 'w').write('window.TM=' + json.dumps(dict(END=66.0, VOICE=T['dur'], CL=CL, S=S), ensure_ascii=False) + ';\n'); print('ok', len(CL))
