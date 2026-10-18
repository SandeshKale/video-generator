# Build site/timing.js from avatar/words.json (global word times of the stitched Hindi voice).
# Hindi Whisper spellings are unreliable, so cues are word *indices*, each checked against the expected spoken word
# (first letters, loosely): a new take that shifts words fails here instead of silently drifting.
# English captions: each chunk is an English phrase mapped to a Hindi word span; its words are spread across that span.
# Run: python3 timing.py
import json, os, re
H = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(H, 'avatar', 'words.json'), encoding='utf8'))
W = D['words']; END = round(sum(D['cuts']) + D['tail'], 3)
CHK = {0: 'स', 2: 'अ', 9: 'क्रि', 14: 'शा', 16: 'किं', 18: 'ये', 20: 'बो', 25: 'शु', 29: 'प्र', 31: 'फ', 35: 'आ', 38: 'रें', 40: 'फि', 45: 'दू', 47: 'ए',
       52: 'औ', 54: 'किं', 55: 'सु', 60: 'दे', 65: 'ब', 69: 'सा', 72: 'चा', 74: 'शू', 76: 'चो', 84: 'ता', 86: 'ब', 87: 'तो', 92: 'क', 95: 'फ'}
for i, p in CHK.items():
    if not W[i][1].startswith(p): raise SystemExit(f'word {i} is {W[i][1]!r}, expected it to start with {p!r}: re-check the cue indices')
s = lambda i: W[i][2]
e = lambda i: W[i][3]
S = [0, s(18), s(25), s(40), s(52), s(65), s(74), s(87)]
CUE = dict(days=s(1), aveng=s(2), six2=s(6), xmas=s(9), srk=s(14), king=s(16), dec=s(19), war=s(20), jung=s(23),
           d3=s(26), prabhas=s(29), fauzi=s(31), same=s(33), ajay=s(35), ranger=s(38),
           d16=s(41), d18=s(43), dune=s(45), aveng2=s(47), weekend=s(48),
           king2=s(54), suhana=s(55), debut=s(60), papa=s(62),
           budget=s(65), reports=s(66), n350=s(69), n400=s(72), crore=s(73),
           shoot=s(74), hurt=s(76), srk2=s(80), date=s(84), change=s(86),
           q=s(87), which=s(90), comment=s(92), follow=s(95), last=e(96))
PH = [("Just six days!", 0, 1), ("Avengers: Doomsday gets six days,", 2, 7), ("then on Christmas Eve comes", 8, 13), ("Shah Rukh Khan, with King.", 14, 17),
      ("This December is a box-office war.", 18, 24),
      ("It starts on 3 December", 25, 28), ("with Prabhas's Fauzi,", 29, 32), ("and the same day, Ajay Devgn's Ranger.", 33, 39),
      ("Then, 16 to 18 December,", 40, 44), ("Dune and Avengers", 45, 47), ("on the same weekend.", 48, 51),
      ("And then King.", 52, 54), ("Suhana Khan's big-screen debut,", 55, 60), ("alongside her dad.", 61, 64),
      ("Budget, reportedly:", 65, 68), ("₹350 to 400 crore.", 69, 73),
      ("He was injured during the shoot,", 74, 77), ("but Shah Rukh has said", 78, 83), ("the date won't change.", 84, 86),
      ("So which one will you watch first?", 87, 91), ("Comment, and follow.", 92, 96)]
CAP = []
for txt, a, b in PH:
    t0, t1 = s(a), e(b); ws = txt.split(); L = [len(re.sub(r'\W', '', w)) + 2 for w in ws]; tot = sum(L); acc = 0; row = []
    for w, l in zip(ws, L): row.append([w, round(t0 + (t1 - t0) * acc / tot, 3)]); acc += l
    CAP.append([round(t0, 3), round(t1, 3), row])
js = 'window.TM=' + json.dumps({'END': END, 'S': [round(x, 3) for x in S], 'CUE': {k: round(v, 3) for k, v in CUE.items()}, 'CAP': CAP}, ensure_ascii=False) + ';\n'
open(os.path.join(H, 'site', 'timing.js'), 'w', encoding='utf8').write(js)
print('END', END, 'S', [round(x, 2) for x in S]); print(len(CAP), 'caption chunks')
