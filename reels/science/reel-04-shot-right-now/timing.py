# Build site/timing.js from avatar/words.json (global word times of the stitched fast English voice).
# Cues are word indices checked against the expected spoken word, so a new take that shifts words fails loudly.
# Display fixes: Whisper heard "lives two microseconds" as "lifts two microsex" (audio says it right) and splits numbers.
# Run: python3 timing.py
import json, os, re
H = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(H, 'avatar', 'words.json'), encoding='utf8'))
W = [list(w) for w in D['words']]; END = round(sum(D['cuts']) + D['tail'], 3)
FIX = {61: 'lives', 63: 'microseconds,', 117: 'tonnes', 21: 'centimetre', 70: 'kilometre.', 141: '1,600', 29: 'And', 31: 'night?'}
for i, w in FIX.items(): W[i][1] = w
CHK = {9: 'hundred', 15: 'thumbnail', 16: 'Neutrinos', 17: '65', 28: 'core', 31: 'night', 37: 'earth', 40: 'bed', 43: 'Now', 44: 'look', 46: '15',
       50: 'cosmic', 52: 'smash', 58: 'muons', 60: 'muon', 67: 'die', 73: 'reaches', 75: 'Why', 76: 'Einstein', 81: 'clock', 84: 'One', 87: 'palm',
       90: 'Now', 92: 'inside', 97: '4', 99: 'potassium', 104: 'decay', 105: "That's", 111: 'bananas', 112: 'Meanwhile', 113: 'Earth', 116: '44',
       120: 'dust', 128: '70', 132: 'And', 136: 'sitting', 139: 'spinning', 141: '1,600', 145: 'orbiting', 147: 'Sun', 149: '107', 152: 'racing',
       155: 'galaxy', 158: '800', 160: 'All', 164: 'now', 167: 'Follow', 169: 'Explains'}
for i, p in CHK.items():
    if not W[i][1].strip('.,?').lower().startswith(p.lower()): raise SystemExit(f'word {i} is {W[i][1]!r}, expected {p!r}: re-check the cue indices')
s = lambda i: round(W[i][2], 3)
e = lambda i: round(W[i][3], 3)
S = [0, s(16), s(29), s(43), s(84), s(90), s(105), s(112), s(132), s(160)]
CUE = dict(hundred=s(9), thumb=s(15), nu=s(16), b65=s(17), core=s(28), night=s(31), earth=s(37), bed=s(40), throughyou=s(41), lookup=s(44), km15=s(46),
           cosmic=s(50), smash=s(52), muons=s(58), muon=s(60), lives=s(61), die=s(67), km1=s(70), reaches=s(73), why=s(75), einstein=s(76), clock=s(81),
           one=s(84), palm=s(87), inside=s(92), k4=s(97), potassium=s(99), decay=s(104), bananas=s(111), earth2=s(113), t44=s(116), dust=s(120),
           k70=s(128), sitting=s(136), spinning=s(139), k1600=s(141), orbiting=s(145), sun=s(147), k107=s(149), racing=s(152), galaxy=s(155),
           k800=s(158), all=s(160), now=s(164), follow=s(167), last=e(169))
# captions: merge split numbers ("4" ",000" -> "4,000"), chunks of <= 5 words broken after punctuation
toks = []
for p, w, a, b in W:
    if re.match(r'^,\d', w) and toks: toks[-1][0] += w; toks[-1][2] = b; continue
    toks.append([w, a, b])
C, cur = [], []
for t in toks:
    cur.append(t)
    if re.search(r'[.?!,]$', t[0]) or len(cur) >= 5: C.append(cur); cur = []
if cur: C.append(cur)
CAP = [[c[0][1], c[-1][2], [[w, round(a, 3)] for w, a, b in c]] for c in C]
js = 'window.TM=' + json.dumps({'END': END, 'S': S, 'CUE': CUE, 'CAP': CAP}, ensure_ascii=False) + ';\n'
open(os.path.join(H, 'site', 'timing.js'), 'w', encoding='utf8').write(js)
print('END', END, 'S', S); print(len(CAP), 'caption chunks')
