# Build site/timing.js for one voice version from avatar-<v>/words.json (global word times).
# Scene starts and named cues are looked up by spoken word, so a new take (or the Hindi version) re-times everything.
# Run: python3 timing.py en
import json, re, sys, os
V = sys.argv[1] if len(sys.argv) > 1 else 'en'
H = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(H, f'avatar-{V}', 'words.json'), encoding='utf8'))
W = [[p, w, s, e] for p, w, s, e in D['words']]
END = round(sum(D['cuts']) + D['tail'], 3)
norm = lambda w: re.sub(r"[^\w%']", '', w.lower())
def at(word, n=1, after=0.0):
    k = 0
    for p, w, s, e in W:
        if s >= after and norm(w) == word:
            k += 1
            if k == n: return s
    raise SystemExit(f'cue word not found: {word} #{n} after {after}')
if V == 'en':
    S = [0, at("you're"), at('heat'), at('sitting'), at('add'), at('in'), at('you', 1, 33), at('the', 1, 36), at('let'), at('now')]
    CUE = dict(pillow=at('pillow'), night=at('night'), congrats=at('congratulations'), slow=at('slow'), every=at('every'), single=at('single'),
               heat=at('heat'), full=at('full'), enemies=at('enemies'), hundred=at('100'), hours=at('hours'), lying=at('lying'), buffet=at('buffet'),
               gaming=at('gaming'), case=at('case'), pillow2=at('pillow', 2), phone2=at('phone', 2), oven=at('oven'),
               year=at('year'), forty=at('40'), left=at('left'), sixtyfive=at('65%'), twentyfive=at('25'), fortyp=at('40%'), ninetysix=at('96%'),
               notch=at('not', 1, 33), roasting=at('roasting'), fix=at('fix'), eighty=at('80'), limit=at('limit'), sleep=at('sleep'), cool=at('cool'),
               happy=at('happy'), happy2=at('happy', 2), send=at('send'), friend=at('friend'), oven2=at('oven', 2))
    LADDER = dict(rung2='OVEN', rung3='ROASTED', cta='OVEN')
# Captions: chunks of <= 6 words, broken after punctuation; "100 %" style tokens merged for display.
toks = []
for p, w, s, e in W:
    if w == '%' and toks: toks[-1][0] += '%'; toks[-1][2] = e; continue
    toks.append([w, s, e])
C, cur = [], []
for t in toks:
    cur.append(t)
    if re.search(r'[.?!,]$', t[0]) or len(cur) >= 6: C.append(cur); cur = []
if cur: C.append(cur)
CAP = [[c[0][1], c[-1][2], [[w, s] for w, s, e in c]] for c in C]
js = 'window.TM=' + json.dumps({'V': V, 'END': END, 'S': [round(x, 3) for x in S], 'CUE': {k: round(v, 3) for k, v in CUE.items()}, 'LADDER': LADDER, 'CAP': CAP}, ensure_ascii=False) + ';\n'
open(os.path.join(H, 'site', 'timing.js'), 'w', encoding='utf8').write(js)
print('END', END, 'S', S); print(len(CAP), 'caption chunks')
