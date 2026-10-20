# Build site/timing_hi.js for the HINDI voice. Hindi Whisper garbles the words, so times come from the known script instead:
# per part, speech frames are found from the clip energy, each script phrase gets a boundary snapped to the real pauses (matching its share of the
# characters), and words are spread over the phrase's speech time by character count. On-screen text stays English: the captions are English subtitles
# timed to the Hindi phrases. Cues look up Hindi tokens by text (and occurrence), so a new take re-times everything.
# Run: python3 timing_hi.py
import json, os, re, subprocess
import numpy as np
H = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(H, 'avatar-hi', 'raw')
D = json.load(open(os.path.join(H, 'avatar-hi', 'words.json'), encoding='utf8')); CUTS = D['cuts']; TAIL = D['tail']
PH = [  # (hindi phrase, english subtitle)
 [('कोर्ट ने इंटरनेट से कहा:', 'A judge told the internet:'), ('उसका चेहरा हटाओ।', 'take her face down.'),
  ('समांथा रुथ प्रभु एक अक्टूबर को बॉम्बे हाई कोर्ट पहुँचीं,', 'Samantha Ruth Prabhu went to Bombay High Court on October 1,'),
  ('क्योंकि एआई डीपफ़ेक में उनका चेहरा और आवाज़ हर जगह थी।', 'because AI deepfakes of her face and voice were everywhere.'),
  ('इंटरिम ऑर्डर: इन्हें हटाओ।', 'Interim order: remove them.'), ('उनका नाम, उनकी तस्वीर, उनकी आवाज़।', 'Her name, her image, her voice.'), ('सिर्फ़ उनकी।', 'Only hers.')],
 [('और वो अकेली नहीं हैं।', "And she's not alone."), ('जुलाई में प्रीटी ज़िंटा को उसी कोर्ट से यही ऑर्डर मिला।', 'In July, Preity Zinta got the same order from the same court.'),
  ('दो सौ पचहत्तर लिंक:', 'About 275 links:'), ('डीपफ़ेक, एडिटेड फ़ोटो, एआई चैटबॉट।', 'deepfakes, edited photos, AI chatbots.'),
  ('गूगल, मेटा और एक्स को इन्हें हटाना पड़ा।', 'Google, Meta and X had to remove them.'), ('बड़े नाम इसी ढाल की लाइन में हैं।', 'Big names are lining up for the same shield.')],
 [('तो ये है क्या? पर्सनैलिटी राइट्स।', 'So what is it? Personality rights.'), ('आपका चेहरा, आपका नाम, आपकी आवाज़ आपकी है।', 'Your face, name and voice are yours.'),
  ('कोई एआई कंपनी बिना पूछे इन्हें बेच नहीं सकती।', 'No AI company can sell them without asking.'), ('पर ध्यान रहे, ये ऑर्डर इंटरिम है, फ़ाइनल नहीं।', 'But note: this order is interim, not final.'),
  ('अगली सुनवाई दिसंबर में है।', 'The next hearing is in December.'), ('लड़ाई अभी बाक़ी है।', "The fight isn't over.")],
 [('अब असली ट्विस्ट।', 'Now the real twist.'), ('स्टार के पास वकील है, आपके पास वकील नहीं।', "A star has a lawyer. You don't."),
  ('पर आपकी आवाज़ भी क्लोन हो सकती है,', 'But your voice can be cloned too,'), ('बस कुछ सेकंड की रिकॉर्डिंग से।', 'from just a few seconds of recording.'),
  ('वॉइस नोट भेजने से पहले दो बार सोचो।', 'Think twice before sending a voice note.'), ('Sandesh Explains को फ़ॉलो कीजिए।', 'Follow Sandesh Explains.')]]
def frames(p):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', os.path.join(RAW, f'p{p}.wav'), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
    x = np.frombuffer(raw, np.float32); n = len(x) // 320; e = np.sqrt((x[:n * 320].reshape(n, 320) ** 2).mean(1)); return e
TOK = []    # [token, start, end, global part-offset-adjusted]
SUBS = []   # [start, end, english, [[word,start],...]]
off = 0.0
for pi, phr in enumerate(PH):
    e = frames(pi + 1); thr = max(.012, .06 * np.percentile(e, 98)); sp = e > thr
    sp[:3] = sp[:3]; idx = np.where(sp)[0]; first, last = idx[0], idx[-1]
    # close tiny holes (< 100 ms) so only real pauses count
    s2 = sp.copy(); run = 0
    for i in range(first, last + 1):
        if not sp[i]:
            run += 1
        else:
            if 0 < run < 5: s2[i - run:i] = True
            run = 0
    sp = s2; sf = np.where(sp[first:last + 1])[0] + first                      # speech frame indices
    gaps = []; i = first
    while i <= last:
        if not sp[i]:
            j = i
            while j <= last and not sp[j]: j += 1
            gaps.append(((i + j) / 2, int((sp[first:i]).sum()))); i = j
        else: i += 1
    chars = [len(re.sub(r'\s', '', h)) for h, _ in phr]; tot = sum(chars); N = len(sf)
    bounds = [0]; cum = 0
    for k in range(len(phr) - 1):
        cum += chars[k]; tau = cum / tot * N
        cand = [(abs(c - tau), c) for g, c in gaps if c > bounds[-1] + 3]
        best = min(cand) if cand else None
        bounds.append(best[1] if best and best[0] < .08 * N else int(tau))
    bounds.append(N)
    for k, (h, en) in enumerate(phr):
        a, b = bounds[k], max(bounds[k] + 2, bounds[k + 1]); fr = sf[a:b]
        t0 = fr[0] * .02 + off; t1 = (fr[-1] + 1) * .02 + off
        words = h.split(); wc = [len(re.sub(r'\s', '', w)) for w in words]; wt = sum(wc); acc = 0
        for w, c in zip(words, wc):
            u0 = int(acc / wt * len(fr)); u1 = max(u0 + 1, int((acc + c) / wt * len(fr))); acc += c
            TOK.append([w, round(fr[min(u0, len(fr) - 1)] * .02 + off, 3), round((fr[min(u1, len(fr)) - 1] + 1) * .02 + off, 3)])
        ew = en.split(); ec = [len(w) for w in ew]; et = sum(ec); acc = 0; ws = []
        for w, c in zip(ew, ec): ws.append([w, round(t0 + (t1 - t0) * acc / et, 3)]); acc += c
        SUBS.append([round(t0, 3), round(t1, 3), ws])
    off += CUTS[pi]
END = round(sum(CUTS) + TAIL, 3)
def tk(sub, nth=1):
    n = 0
    for w, a, b in TOK:
        if sub in w:
            n += 1
            if n == nth: return a
    raise SystemExit(f'token {sub!r} #{nth} not found')
CUE = dict(judge=tk('कोर्ट'), internet=tk('इंटरनेट'), take=tk('उसका'), down=tk('हटाओ'), samantha=tk('समांथा'), october=tk('अक्टूबर'), deepfakes=tk('डीपफ़ेक'), voice=tk('आवाज़'),
           everywhere=tk('जगह'), interim=tk('इंटरिम'), order=tk('ऑर्डर'), remove=tk('इन्हें'), name=tk('नाम'), image=tk('तस्वीर'), hervoice=tk('आवाज़', 2), preity=tk('प्रीटी'),
           links=tk('लिंक'), fakes=tk('डीपफ़ेक', 2), morphed=tk('एडिटेड'), chatbots=tk('चैटबॉट'), google=tk('गूगल'), meta=tk('मेटा'), x=tk('एक्स'), pull=tk('हटाना'),
           bollywood=tk('बड़े'), shield=tk('ढाल'), rights=tk('राइट्स'), pface=tk('चेहरा', 3), pname=tk('नाम', 3), pvoice=tk('आवाज़', 3), nocompany=tk('कोई'), asking=tk('पूछे'),
           careful=tk('ध्यान'), interim2=tk('इंटरिम', 2), final=tk('फ़ाइनल'), december=tk('दिसंबर'), fight=tk('लड़ाई'), twist=tk('ट्विस्ट'), lawyer=tk('वकील'), you=tk('आपके'),
           cloned=tk('क्लोन'), seconds=tk('सेकंड'), before=tk('पहले'), note=tk('नोट'), twice=tk('सोचो'), follow=tk('फ़ॉलो'), last=TOK[-1][2])
S = [0, CUE['samantha'], tk('क्योंकि'), tk('अकेली') - .15, CUE['google'], tk('तो'), tk('पर', 1) - .05, tk('अब') - .1, CUE['follow'] - .15]
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', os.path.join(H, 'audio', 'voice_hi.wav'), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
x = np.frombuffer(raw, np.float32); n = int(len(x) / 320); env = np.sqrt((x[:n * 320].reshape(n, 320) ** 2).mean(1)); env = np.minimum(1, env / (np.percentile(env, 98) + 1e-9))
js = 'window.TM=' + json.dumps({'END': END, 'S': [round(v, 3) for v in S], 'CUE': CUE, 'CAP': SUBS, 'ENV': [int(round(v * 99)) for v in env]}, ensure_ascii=False) + ';\n'
open(os.path.join(H, 'site', 'timing_hi.js'), 'w', encoding='utf8').write(js)
print('END', END, 'S', [round(v, 2) for v in S]); print(len(SUBS), 'subtitle chunks'); print({k: round(v, 2) for k, v in CUE.items()})
