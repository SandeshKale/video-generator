# Join the chosen voice lines (vo/lNN.wav) into audio/voice.wav with breathing gaps, and write site/timing.js:
#   SC = scene start times, WD = words {p: line, w: display word, k: key, s, e}, PG = caption pages (word indices), TOTAL.
# Display words come from the script (so "A I" shows as "AI"); times come from Whisper on the chosen take.
import json, re, numpy as np, soundfile as sf
SR = 24000
DISPLAY = [
 "You keep explaining the same thing to AI. Teach it once instead.",
 "A skill is a small instruction file Claude pulls out only when needed. Four steps.",
 "Step one. Pick a task you've explained more than twice, like your weekly update.",
 "Step two. Ask Claude: create a skill for my weekly team update. Add the format, the tone, and one example you liked.",
 "Claude writes the skill file. A short name, and a description of what it does, and when.",
 "Step three. Save it, and switch it on in Skills settings. In Claude Code, it's just a folder.",
 "Step four. Test it in a new chat. If Claude doesn't pick it up, sharpen the description.",
 "The clever part? Until it's needed, a skill costs about a hundred tokens. So keep dozens.",
 "The catch. Code execution must be on. Skills don't sync between apps. And only install ones you trust. They can run code.",
 "Never put passwords in one.",
 "Save this, and follow for more."]
SCENE_OF_LINE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9]   # line index -> scene index
GAP = [0, .45, .55, .55, .4, .55, .55, .5, .6, .45, .55]  # silence before each line
TAIL = 3.2                                             # hold after the last line (recap + CTA)
LEAD = .3                                              # a scene starts this long before its first line
tm = json.load(open('vo/timing.json'))
key = lambda w: re.sub(r"[^a-z0-9']", '', w.lower())
pcm, t, WD, SC, PG = [], 0.0, [], [], []
for i, txt in enumerate(DISPLAY):
    sid = f'l{i+1:02d}'; a, sr = sf.read(f'vo/{sid}.wav'); assert sr == SR
    pcm.append(np.zeros(int(GAP[i] * SR), np.float32)); t += GAP[i]
    if SCENE_OF_LINE[i] == len(SC): SC.append(0.0 if i == 0 else round(t - LEAD, 3))
    disp, wh = txt.split(), tm[sid]['words']
    if len(wh) == len(disp): times = [(w['s'], w['e']) for w in wh]
    else:  # proportional by characters across the spoken span
        s0, s1 = wh[0]['s'], wh[-1]['e']; L = [len(w) + 1 for w in disp]; c = np.cumsum([0] + L) / sum(L)
        times = [(s0 + (s1 - s0) * c[j], s0 + (s1 - s0) * c[j + 1]) for j in range(len(disp))]
        print('proportional', sid, len(wh), len(disp))
    base = len(WD)
    for w, (s, e) in zip(disp, times): WD.append(dict(p=i + 1, w=w, k=key(w), s=round(t + s, 3), e=round(t + e, 3)))
    # caption pages: break after sentence punctuation or at 6 words
    page = []
    for j in range(len(disp)):
        page.append(base + j)
        if j == len(disp) - 1 or len(page) >= 6 or (disp[j][-1] in '.?:' and len(page) >= 2): PG.append(page); page = []
    pcm.append(a.astype(np.float32)); t += len(a) / SR
pcm.append(np.zeros(int(TAIL * SR), np.float32)); t += TAIL
x = np.concatenate(pcm); sf.write('audio/voice.wav', x, SR)
open('site/timing.js', 'w').write('window.SC=%s;window.WD=%s;window.PG=%s;window.TOTAL=%s;\n' % (json.dumps(SC), json.dumps(WD), json.dumps(PG), round(t, 3)))
print('total', round(t, 2), 'scenes', SC)
