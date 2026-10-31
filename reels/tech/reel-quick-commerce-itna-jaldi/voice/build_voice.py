#!/usr/bin/env python3
"""Hinglish voice-over draft for 'Itna jaldi kaise?' (OmniVoice, local CPU).
Method (see docs/HINGLISH-VOICEOVER-GUIDE.md):
 1. generate each sentence as ONE take from the all-Devanagari text (field B): best round-trip accuracy, Indian-accented English words, most expressive pitch;
 2. every line uses voice design with the same description; up to 4 seeds per line, pick by Whisper skeleton score + term hits + pitch closeness to the reel register (135 Hz; question lines exempt) (a clone prompt was tried and lowered accuracy);
 3. the model does not pause at commas, so pauses are INJECTED: at each script comma we cut the single take at the lowest-energy point near the aligned word boundary
    and insert a short silence (reference band 0.15-0.35 s); sentence ends get 0.45-0.7 s, term-reveal/questions/topic changes 0.8-1.1 s;
 4. QA report against the reference measurements (rate, pause histogram, pitch).
usage: python3 voice/build_voice.py [speed=1.18]
"""
import os, sys, re, json, time, numpy as np, soundfile as sf, torch, librosa
from rapidfuzz import fuzz
from omnivoice import OmniVoice
from faster_whisper import WhisperModel
torch.set_num_threads(4)
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(H); SPEED = float(sys.argv[1]) if len(sys.argv) > 1 else 1.18
S = json.load(open(os.path.join(R, 'script.json')))['sentences']; OUT = os.path.join(R, 'audio'); os.makedirs(OUT + '/takes', exist_ok=True)
INS = 'male, middle-aged, low pitch, indian accent'; SR = 24000; REG = 135.0
MERGE = {'ट':'त','ठ':'थ','ड':'द','ढ':'ध','ष':'स','श':'स','ण':'न','ञ':'न','ङ':'न','ज़':'ज','फ़':'फ','क़':'क','ख़':'ख','ग़':'ग','ड़':'र','ढ़':'र','ऑ':'ओ','ऐ':'ए','औ':'ओ','ई':'इ','ऊ':'उ','आ':'अ'}
def skel(t):
    t = re.sub(r'[़्ँंःा-ौ॑-॔।,.?!\'"’‘ \-]', '', t); return ''.join(MERGE.get(c, c) for c in t)
# designed pause after each sentence id (seconds): term reveals, questions and beat changes are longer
GAP = {'h1':0.45,'h2':0.95,'p1':0.85,'d1a':0.85,'d1b':0.9,'d2':0.9,'d3a':0.7,'d3b':0.95,'w1':0.55,'w2':0.95,'s1':0.85,'c1':0.8,'c2':0.0}
CLAUSE_GAP = 0.24
TERMS = ['जियोफेंस', 'ब्लिंकिट', 'ज़ेप्टो', 'स्टोर', 'पिन', 'कोड', 'क्रिकेट', 'फ़ोरकास्ट', 'पैकर', 'हैंडहेल्ड', 'बारकोड', 'स्कैन', 'पिजनहोल', 'मार्केटिंग', 'रॉयटर्स', 'सब्सक्राइब']
def f0med(a):
    y = librosa.resample(a, orig_sr=SR, target_sr=16000); f0, _, _ = librosa.pyin(y, fmin=70, fmax=400, sr=16000, frame_length=1024, hop_length=160); f = f0[~np.isnan(f0)]
    return float(np.median(f)) if len(f) > 20 else 0.0, (float(np.nanstd(12*np.log2(f0/np.nanmedian(f0)))) if len(f) > 20 else 0.0)
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32); wh = WhisperModel('medium', device='cpu', compute_type='int8', cpu_threads=4)
def transcribe(a):
    segs, _ = wh.transcribe(a, language='hi', beam_size=5, word_timestamps=True, condition_on_previous_text=False); words = []
    for s in segs: words += [(w.word, w.start, w.end) for w in (s.words or [])]
    return words
PROMPT = None
def make_prompt(path, text):
    global PROMPT
    a, _ = sf.read(path); PROMPT = m.create_voice_clone_prompt(ref_audio=(torch.tensor(a.astype('float32')).unsqueeze(0), SR), ref_text=text)
def gen(text, seed):
    torch.manual_seed(seed)
    kw = dict(voice_clone_prompt=PROMPT) if PROMPT is not None else dict(instruct=INS)     # line 1: voice design; every later line: cloned from the accepted first take (locks the timbre)
    return np.asarray(m.generate(text=text, language='hi', num_step=32, speed=SPEED, **kw)[0]).astype('float32')
qc = {}; qp = os.path.join(OUT, 'qc.json')
if os.path.exists(qp): qc = json.load(open(qp))
cands = {}
for i, s in enumerate(S):
    sid, text = s['id'], s['B']; wp = f'{OUT}/takes/{sid}.wav'
    if sid in qc and os.path.exists(wp): continue
    best = None
    for tr in range(3):
        t0 = time.time(); a = gen(text, 1000 + 37*i + tr); words = transcribe(a); tx = ''.join(w[0] for w in words)
        ratio = fuzz.ratio(skel(text), skel(tx)); terms = [t for t in TERMS if skel(t) in skel(text)]; hit = float(np.mean([fuzz.partial_ratio(skel(t), skel(tx)) for t in terms])) if terms else 100.0
        f0, sd = f0med(a); q = text.strip().endswith('?') or '? ' in text
        pit = 100.0 if q else max(0.0, 100 - 2.0*abs(f0 - REG)); score = 0.5*ratio + 0.3*hit + 0.2*pit
        print(sid, tr, f'ratio {ratio:.0f} terms {hit:.0f} f0 {f0:.0f} sd {sd:.2f} dur {len(a)/SR:.2f}s ({time.time()-t0:.0f}s)', flush=True)
        if best is None or score > best[0]: best = (score, a, words, ratio, hit, f0, sd)
        if ratio >= 94 and hit >= 90 and (q or abs(f0 - REG) <= 15): break
    sf.write(wp, best[1], SR); qc[sid] = dict(score=round(best[0], 1), ratio=round(best[3], 1), terms=round(best[4], 1), f0=round(best[5]), pitch_sd=round(best[6], 2), dur=round(len(best[1])/SR, 2), words=[(w[0], round(w[1], 3), round(w[2], 3)) for w in best[2]])
    json.dump(qc, open(qp, 'w'), ensure_ascii=False, indent=1)
# ---- assemble with injected pauses ----
def inject(a, text, words):
    """cut the take at script commas (energy valley near the aligned word boundary) and insert CLAUSE_GAP silence."""
    clauses = [c for c in re.split(r'[,]', re.sub(r'[।?!]', '', text)) if skel(c)]
    if len(clauses) < 2 or not words: return a, 0
    tot = sum(len(skel(c)) for c in clauses); wk = [skel(w[0]) for w in words]; wt = sum(len(x) for x in wk) or 1
    y = np.abs(a); win = int(0.01*SR); env = np.convolve(y, np.ones(win)/win, mode='same'); cum = 0; pieces = []; prev = 0; inserted = 0
    cw = np.cumsum([len(x) for x in wk])
    for c in clauses[:-1]:
        cum += len(skel(c)); frac = cum / tot; k = int(np.searchsorted(cw, frac*wt)); k = min(k, len(words)-1)
        t = words[k][2]; lo, hi = int(max(0, (t-0.10))*SR), int(min(len(a)/SR, t+0.10)*SR)
        if hi - lo < win: continue
        cut = lo + int(np.argmin(env[lo:hi]))
        if cut <= prev + int(0.25*SR): continue
        pieces.append(a[prev:cut]); pieces.append(np.zeros(int(CLAUSE_GAP*SR), dtype='float32')); prev = cut; inserted += 1
    pieces.append(a[prev:]); return np.concatenate(pieces), inserted
def fade(a, ms=6):
    n = int(ms*SR/1000); a = a.copy(); a[:n] *= np.linspace(0, 1, n); a[-n:] *= np.linspace(1, 0, n); return a
timeline = []; chunks = []; t = 0.0
for s in S:
    sid = s['id']; a, _ = sf.read(f'{OUT}/takes/{sid}.wav'); a = a.astype('float32')
    a, n_inj = inject(a, s['B'], [(w[0], w[1], w[2]) for w in qc[sid]['words']])
    # trim leading/trailing silence of the take to 40 ms
    nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0]-int(0.04*SR)): nz[-1]+int(0.06*SR)]; a = fade(a)
    timeline.append(dict(id=sid, start=round(t, 3), end=round(t+len(a)/SR, 3), clauses_cut=n_inj, text=s['A'])); chunks.append(a); t += len(a)/SR
    g = GAP.get(sid, 0.6); chunks.append(np.zeros(int(g*SR), dtype='float32')); t += g
wave = np.concatenate(chunks); peak = np.max(np.abs(wave)); wave = wave * (0.89/peak)
sf.write(f'{OUT}/voice-draft.wav', wave, SR); json.dump(timeline, open(f'{OUT}/timeline.json', 'w'), ensure_ascii=False, indent=1)
os.system(f'ffmpeg -y -v error -i {OUT}/voice-draft.wav -af loudnorm=I=-16:TP=-1.5:LRA=9 -c:a libmp3lame -q:a 3 {OUT}/voice-draft.mp3')
print('assembled', round(len(wave)/SR, 1), 's')
