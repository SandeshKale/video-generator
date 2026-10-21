# Build site/timing.js for the HINDI voice from the known script (Hindi Whisper garbles words): speech frames from clip energy, phrase boundaries
# snapped to real pauses by character share, words spread by character count. On-screen text stays English: captions are English subtitles per Hindi phrase.
# Run: python3 timing.py
import json, os, re, subprocess
import numpy as np
H = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(H, 'avatar', 'raw')
D = json.load(open(os.path.join(H, 'avatar', 'words.json'), encoding='utf8')); CUTS = D['cuts']; TAIL = D['tail']
PH = [
 [('अभी आपने चाय के बीस रुपये दिए।', 'You just paid twenty rupees for chai.'),
  ('अगले कुछ सेकंड में वो पेमेंट चार सिस्टम से गुज़रता है,', 'In the next few seconds that payment crosses four systems,'),
  ('और रोज़ अस्सी करोड़ से ज़्यादा यूपीआई पेमेंट यही करते हैं।', 'and over 800 million UPI payments do the same every day.'),
  ('चलिए इसे धीमा करके अपना पेमेंट फ़ॉलो करते हैं।', "Let's slow it down and follow yours."),
  ('उसका आईडी नंबर याद रखिए, आख़िर में काम आएगा।', "Remember its ID number. You'll need it at the end.")],
 [('आप पे दबाते हैं।', 'You tap Pay.'), ('आपका ऐप एक रिक्वेस्ट भेजता है:', 'Your app sends one request:'),
  ('आपसे चायवाले के क्यूआर को, बीस रुपये।', "from you to the chai seller's QR, twenty rupees."), ('वो बैंक के पास जाती है,', 'It goes to a bank,'),
  ('फिर सबके बीच में, एनपीसीआई के स्विच पर।', 'then to the middle of everything, the NPCI switch.'),
  ('स्विच आपके पैसे नहीं रखता।', "The switch doesn't hold your money."), ('वो बस बैंकों के बीच मैसेज पहुँचाता है।', 'It only passes messages between banks.')],
 [('पहला मैसेज आपके बैंक को: बीस रुपये काटो।', 'Message one to your bank: take twenty rupees.'),
  ('बैंक बैलेंस और पिन चेक करता है, और हाँ कहता है।', 'It checks your balance and PIN, and says yes.'),
  ('दूसरा मैसेज चायवाले के बैंक को: बीस रुपये जोड़ो।', "Message two to the seller's bank: add twenty rupees."), ('वहाँ से भी हाँ।', 'Another yes.'),
  ('दोनों हाँ उसी रास्ते लौटती हैं,', 'Both yeses come back the same road,'), ('और आपके फ़ोन पर हरा टिक आता है।', 'and your phone shows the green tick.')],
 [('पर कभी बैंक हाँ कहता है,', 'But sometimes your bank says yes,'), ('दूसरी तरफ़ से जवाब नहीं आता।', 'and the other side never answers.'),
  ('पैसे कटे, पेमेंट नहीं हुआ।', 'Money gone, nothing paid.'), ('तब वही आईडी काम आती है।', 'That is when you need that ID.'),
  ('आरबीआई नियम: पैसे पाँच दिन में लौटें,', 'RBI rule: the money must come back in five days,'), ('वरना बैंक को सौ रुपये रोज़ देने होंगे।', 'or the bank owes you a hundred rupees a day.'),
  ('लाइक, शेयर और सब्सक्राइब करिए,', 'Like, share and subscribe'), ('Sandesh Explains को।', 'to Sandesh Explains.')]]
def frames(p):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', os.path.join(RAW, f'p{p}.wav') if os.path.exists(os.path.join(RAW, f'p{p}.wav')) else os.path.join(RAW, f'p{p}.mp4'), '-map', '0:a:0', '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
    x = np.frombuffer(raw, np.float32); n = len(x) // 320; return np.sqrt((x[:n * 320].reshape(n, 320) ** 2).mean(1))
TOK = []; SUBS = []; off = 0.0
for pi, phr in enumerate(PH):
    e = frames(pi + 1); thr = max(.012, .06 * np.percentile(e, 98)); sp = e > thr
    idx = np.where(sp)[0]; first, last = idx[0], idx[-1]
    s2 = sp.copy(); run = 0
    for i in range(first, last + 1):
        if not sp[i]: run += 1
        else:
            if 0 < run < 5: s2[i - run:i] = True
            run = 0
    sp = s2; sf = np.where(sp[first:last + 1])[0] + first
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
def tk(sub, nth=1, exact=False):
    n = 0
    for w, a, b in TOK:
        ww = w.strip('।,:')
        if (ww == sub) if exact else (sub in ww):
            n += 1
            if n == nth: return a
    raise SystemExit(f'token {sub!r} #{nth} not found')
CUE = dict(chai=tk('चाय'), twenty=tk('बीस'), four=tk('चार'), crore=tk('अस्सी'), slow=tk('धीमा'), follow1=tk('फ़ॉलो'), remember=tk('याद'), idn=tk('आईडी'),
           tap=tk('पे', 1, True), request=tk('रिक्वेस्ट'), qr=tk('क्यूआर'), bank=tk('बैंक', 1), switch=tk('स्विच'), npci=tk('एनपीसीआई'), nomoney=tk('नहीं', 1), messages=tk('मैसेज', 2),
           msg1=tk('पहला'), cut=tk('काटो'), balance=tk('बैलेंस'), yes1=tk('हाँ', 1, True), msg2=tk('दूसरा'), add=tk('जोड़ो'), yes2=tk('वहाँ'), back=tk('रास्ते'), tick=tk('हरा'),
           but=tk('कभी'), noreply=tk('जवाब'), gone=tk('कटे'), idagain=tk('आईडी', 2), rbi=tk('आरबीआई'), five=tk('पाँच'), hundred=tk('सौ'), save=tk('लाइक'), share=tk('शेयर'), follow=tk('सब्सक्राइब'), last=TOK[-1][2])
P = list(np.cumsum([0] + CUTS))
S = [0, CUE['tap'] - .15, CUE['tap'] - .15, CUE['msg1'] - .2, CUE['but'] - .2, CUE['follow'] - 1.6]
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', os.path.join(H, 'audio', 'voice.wav'), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
x = np.frombuffer(raw, np.float32); n = int(len(x) / 320); env = np.sqrt((x[:n * 320].reshape(n, 320) ** 2).mean(1)); env = np.minimum(1, env / (np.percentile(env, 98) + 1e-9))
js = 'window.TM=' + json.dumps({'END': END, 'S': [round(float(v), 3) for v in S], 'CUE': {k: round(float(v), 3) for k, v in CUE.items()}, 'CAP': SUBS, 'ENV': [int(round(float(v) * 99)) for v in env]}, ensure_ascii=False) + ';\n'
open(os.path.join(H, 'site', 'timing.js'), 'w', encoding='utf8').write(js)
print('END', END); print(len(SUBS), 'subtitle chunks'); print({k: round(float(v), 2) for k, v in CUE.items()})
