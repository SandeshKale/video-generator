# Build site/timing.js from avatar/words.json (English avatar voice). Cues are word indices checked against the expected word,
# so a new take that shifts words fails loudly. Also writes the voice loudness envelope (real data for the voice-clone scene).
# Run: python3 timing.py
import json, os, re, subprocess
import numpy as np
H = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(H, 'avatar', 'words.json'), encoding='utf8'))
W = [list(w) for w in D['words']]; END = round(sum(D['cuts']) + D['tail'], 3)
FIX = {33: 'interim', 34: 'order?', 62: 'morphed', 92: 'rights.', 20: '1', 163: 'Sandesh', 164: 'Explains.'}
for i, w in FIX.items(): W[i][1] = w
CHK = {1: 'judge', 5: 'internet', 6: 'take', 8: 'face', 10: 'Samantha', 19: 'October', 23: 'deepfakes', 29: 'voice', 31: 'everywhere', 33: 'interim',
       35: 'Remove', 37: 'Her', 39: 'Her', 41: 'Her', 43: 'And', 49: 'Preeti', 59: '275', 61: 'Deepfakes', 62: 'morphed', 65: 'chatbots', 70: 'Google',
       71: 'Meta', 73: 'X', 76: 'pull', 78: 'Bollywood', 86: 'shield', 91: 'Personality', 94: 'face', 96: 'name', 98: 'voice', 101: 'No', 109: 'asking',
       110: 'Careful', 115: 'interim', 117: 'final', 123: 'December', 125: 'fight', 128: "Here's", 135: 'lawyer', 136: 'You', 141: 'your', 145: 'cloned',
       151: 'seconds', 154: 'Before', 159: 'note', 161: 'twice', 162: 'Follow', 164: 'Explains'}
for i, p in CHK.items():
    if not W[i][1].strip('.,?').lower().startswith(p.lower()): raise SystemExit(f'word {i} is {W[i][1]!r}, expected {p!r}: re-check the cue indices')
s = lambda i: round(W[i][2], 3)
e = lambda i: round(W[i][3], 3)
S = [0, s(10), s(21), s(43), s(70), s(87), s(110), s(128), s(162)]   # 9 scenes: hook, case, fakes+order, Preity, platforms, rights, interim, twist, CTA
CUE = dict(judge=s(1), internet=s(5), take=s(6), down=s(9), samantha=s(10), october=s(19), deepfakes=s(23), voice=s(29), everywhere=s(31), interim=s(33), order=s(34),
           remove=s(35), name=s(38), image=s(40), hervoice=s(42), preity=s(49), links=s(59), fakes=s(61), morphed=s(62), chatbots=s(65), google=s(70), meta=s(71),
           x=s(73), pull=s(76), bollywood=s(78), shield=s(86), rights=s(91), pface=s(94), pname=s(96), pvoice=s(98), nocompany=s(101), asking=s(109),
           careful=s(110), interim2=s(115), final=s(117), december=s(123), fight=s(125), twist=s(128), lawyer=s(135), you=s(136), cloned=s(145), seconds=s(151),
           before=s(154), note=s(159), twice=s(161), follow=s(162), last=e(164))
# captions: chunks of <= 5 words broken after punctuation
toks = [[w, a, b] for p, w, a, b in W]
C, cur = [], []
for t in toks:
    cur.append(t)
    if re.search(r'[.?!,]$', t[0]) or len(cur) >= 5: C.append(cur); cur = []
if cur: C.append(cur)
CAP = [[c[0][1], c[-1][2], [[w, round(a, 3)] for w, a, b in c]] for c in C]
# voice envelope: 20 ms RMS windows (0..99) of the stitched voice; the clone scene draws the real shape of the original
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', os.path.join(H, 'audio', 'voice.wav'), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
x = np.frombuffer(raw, np.float32); n = int(len(x) / 320)
env = np.sqrt((x[:n * 320].reshape(n, 320) ** 2).mean(1)); env = np.minimum(1, env / (np.percentile(env, 98) + 1e-9))
ENV = [int(round(v * 99)) for v in env]
js = 'window.TM=' + json.dumps({'END': END, 'S': S, 'CUE': CUE, 'CAP': CAP, 'ENV': ENV}, ensure_ascii=False) + ';\n'
open(os.path.join(H, 'site', 'timing.js'), 'w', encoding='utf8').write(js)
print('END', END, 'S', S); print(len(CAP), 'caption chunks', len(ENV), 'env samples')
