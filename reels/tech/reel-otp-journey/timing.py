#!/usr/bin/env python3
"""timing.json (assemble2.py / voice.py) -> site/timing.js : window.TM = {END, VOICE, CL:[{a,b,en,ac,p}], S, CUE:{name: time}} (END = voice + 3.0 s end-card hold).
CUE names are the same ones blender/world2.py uses (K(sentence, clause, 'a'|'b'))."""
import json, os
H = os.path.dirname(os.path.abspath(__file__)); T = json.load(open(H + '/timing.json')); SS = T['sentences']
def K(si, ci, ab): return SS[si]['clauses'][ci][ab]
CUE = dict(hook_end=K(0, 0, 'b'), a_bank=K(2, 0, 'a'), million=K(1, 1, 'a'), a_gate=K(4, 0, 'a'), a_core=K(4, 1, 'a'), a_tow=K(4, 2, 'a'), tow_end=K(4, 2, 'b'), a_air=K(5, 0, 'a'), a_late=K(5, 1, 'a'),
           a_type=K(6, 0, 'a'), a_match=K(6, 1, 'a'), a_pass=K(6, 2, 'a'), a_dead=K(7, 0, 'a'), a_block=K(7, 1, 'a'), a_guess=K(8, 0, 'a'), a_you=K(9, 0, 'a'), a_theirs=K(9, 1, 'a'), a_rush=K(10, 0, 'a'),
           a_isnt=K(10, 1, 'a'), a_own=K(10, 2, 'a'), own_end=K(10, 2, 'b'), a_never=K(11, 0, 'a'), a_1930=K(12, 0, 'a'), a_cta=K(13, 0, 'a'), voice_end=T['dur'])
CL = [dict(a=c['a'], b=c['b'], en=c['en'], ac=c['ac'], p=s['p']) for s in SS for c in s['clauses']]
END = round(T['dur'] + 3.0, 2)
open(H + '/site/timing.js', 'w').write('window.TM=' + json.dumps(dict(END=END, VOICE=T['dur'], CL=CL, S=[[s['a'], s['b'], s['p']] for s in SS], CUE=CUE), ensure_ascii=False) + ';\n'); print('END', END, 'clauses', len(CL))
