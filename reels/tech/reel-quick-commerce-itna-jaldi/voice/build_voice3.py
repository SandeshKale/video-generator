#!/usr/bin/env python3
"""Hinglish voice-over v3 for 'Itna jaldi kaise?' — ONE voice, no stitching feel.
Feedback on v2 (creator): "breaks in between, feels stitched; 3 different voices; keep the one it starts with".
Causes found in v2 and fixes here:
 1. per-sentence takes from voice DESIGN  -> every take had a different timbre.   Fix: every take after h1 is CLONED from the accepted h1 take
    (the voice the creator liked), and the pick prefers takes whose pitch and MFCC timbre stay close to h1.
 2. clause pauses were made by cutting a take at an energy valley and inserting zeros -> audible breaks.   Fix: NO cutting, NO tempo change;
    sentences are generated in breath groups (1-2 sentences, one take) so the pauses inside a group are the model's own.
 3. digital silence between takes was a tell.   Fix: designed gaps are filled with a continuous room-tone bed (the same bed runs under the whole track),
    takes are level-matched (voiced RMS) and joined with 30 ms equal-power crossfades into the bed.
usage: python3 voice/build_voice3.py [speed=1.18]      env RETRY=g2,g5 re-rolls groups
"""
import os, sys, re, json, time, numpy as np, soundfile as sf, torch, librosa
from rapidfuzz import fuzz
from omnivoice import OmniVoice
from faster_whisper import WhisperModel
torch.set_num_threads(4)
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(H); SPEED = float(sys.argv[1]) if len(sys.argv) > 1 else 1.18
S = {s['id']: s for s in json.load(open(os.path.join(R, 'script.json')))['sentences']}; OUT = os.path.join(R, 'audio'); TK = OUT + '/takes3'; os.makedirs(TK, exist_ok=True)
SR = 24000
GROUPS = [('g1', ['h1']), ('g2', ['h2', 'p1']), ('g3', ['d1a', 'd1b']), ('g4', ['d2']), ('g5', ['d3a', 'd3b']), ('g6', ['w1']), ('g7', ['w2', 's1']), ('g8', ['c1', 'c2'])]
GAP = {'g1': 0.5, 'g2': 0.9, 'g3': 0.9, 'g4': 0.9, 'g5': 0.9, 'g6': 0.6, 'g7': 0.85, 'g8': 0.0}   # designed silence after each group (filled with room tone)
MERGE = {'ट':'त','ठ':'थ','ड':'द','ढ':'ध','ष':'स','श':'स','ण':'न','ञ':'न','ङ':'न','ज़':'ज','फ़':'फ','क़':'क','ख़':'ख','ग़':'ग','ड़':'र','ढ़':'र','ऑ':'ओ','ऐ':'ए','औ':'ओ','ई':'इ','ऊ':'उ','आ':'अ'}
def skel(t):
    t = re.sub(r'[़्ँंःा-ौ॑-॔।,.?!\'"’‘ \-]', '', t); return ''.join(MERGE.get(c, c) for c in t)
TERMS = ['जियोफेंस', 'ब्लिंकिट', 'ज़ेप्टो', 'स्टोर', 'पिन', 'कोड', 'क्रिकेट', 'फ़ोरकास्ट', 'पैकर', 'हैंडहेल्ड', 'बारकोड', 'स्कैन', 'पिजनहोल', 'मार्केटिंग', 'रॉयटर्स', 'सब्सक्राइब']
def f0med(a):
    y = librosa.resample(a, orig_sr=SR, target_sr=16000); f0, _, _ = librosa.pyin(y, fmin=70, fmax=400, sr=16000, frame_length=1024, hop_length=160); f = f0[~np.isnan(f0)]
    return float(np.median(f)) if len(f) > 20 else 0.0
from transformers import AutoFeatureExtractor, WavLMForXVector
_fe = AutoFeatureExtractor.from_pretrained('microsoft/wavlm-base-plus-sv'); _sv = WavLMForXVector.from_pretrained('microsoft/wavlm-base-plus-sv').eval()
def timbre(a):                                   # speaker embedding (WavLM x-vector); similarity to the h1 take is the "same voice" proxy
    y = librosa.resample(a, orig_sr=SR, target_sr=16000)
    with torch.no_grad(): return _sv(**_fe(y, sampling_rate=16000, return_tensors='pt')).embeddings[0]
def sim(u, v): return float(torch.nn.functional.cosine_similarity(u, v, dim=0))
def longest_silence(a):                          # longest internal silence (s), ignoring the edges
    fr = librosa.util.frame(a, frame_length=480, hop_length=240); r = np.sqrt((fr**2).mean(0)); v = r > r.max()*0.04; idx = np.where(v)[0]
    if len(idx) < 2: return 0.0
    v = v[idx[0]:idx[-1]+1]; best = cur = 0
    for x in v: cur = 0 if x else cur + 1; best = max(best, cur)
    return best * 0.01
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32); wh = WhisperModel('medium', device='cpu', compute_type='int8', cpu_threads=4)
def transcribe(a):
    segs, _ = wh.transcribe(a, language='hi', beam_size=5, word_timestamps=True, condition_on_previous_text=False); words = []
    for s in segs: words += [(w.word, w.start, w.end) for w in (s.words or [])]
    return words
# the voice the creator liked = the first take of v2 (h1)
ref, _ = sf.read(f'{TK}/h1_ref.wav') if os.path.exists(f'{TK}/h1_ref.wav') else sf.read(f'{OUT}/takes/h1.wav')
sf.write(f'{TK}/h1_ref.wav', ref, SR)
PROMPT = m.create_voice_clone_prompt(ref_audio=(torch.tensor(ref.astype('float32')).unsqueeze(0), SR), ref_text=S['h1']['B'])
REF_F0 = f0med(ref.astype('float32')); REF_T = timbre(ref.astype('float32')); print('ref f0', round(REF_F0), flush=True)
def gen(text, seed):
    torch.manual_seed(seed)
    return np.asarray(m.generate(text=text, language='hi', num_step=32, speed=SPEED, voice_clone_prompt=PROMPT)[0]).astype('float32')
qp = OUT + '/qc3.json'; qc = json.load(open(qp)) if os.path.exists(qp) else {}
RETRY = [x for x in os.environ.get('RETRY', '').split(',') if x]
for x in RETRY: qc.pop(x, None)
for gi, (gid, ids) in enumerate(GROUPS):
    wp = f'{TK}/{gid}.wav'
    if gid == 'g1' and not os.path.exists(wp):      # the liked opening take, kept as is
        sf.write(wp, ref, SR); w = transcribe(ref.astype('float32'))
        qc[gid] = dict(score=100, f0=round(REF_F0), tdist=1.0, dur=round(len(ref)/SR, 2), words=[(x[0], round(x[1], 3), round(x[2], 3)) for x in w]); json.dump(qc, open(qp, 'w'), ensure_ascii=False, indent=1)
    if gid in qc and os.path.exists(wp): continue
    text = ' '.join(S[i]['B'] for i in ids); best = None
    for tr in range(6):
        t0 = time.time(); a = gen(text, 2000 + 41*gi + tr); words = transcribe(a); tx = ''.join(w[0] for w in words)
        ratio = fuzz.ratio(skel(text), skel(tx)); terms = [t for t in TERMS if skel(t) in skel(text)]
        hit = float(np.mean([fuzz.partial_ratio(skel(t), skel(tx)) for t in terms])) if terms else 100.0
        f0 = f0med(a); td = sim(timbre(a), REF_T)
        # flow check: no internal gap > 0.7 s (sentence boundaries get the model's own ~0.4-0.6 s), rate in band
        mg = longest_silence(a); rate = len(words) / max(0.1, (words[-1][2] - words[0][1])) if words else 0
        ok_flow = mg <= 0.75 and 2.3 <= rate <= 6.2
        pit = max(0.0, 100 - 3.0*abs(f0 - REF_F0)); tim = max(0.0, min(100.0, (td - 0.80) / 0.20 * 100))
        score = 0.30*ratio + 0.10*hit + 0.30*pit + 0.20*tim + (10 if ok_flow else 0)
        print(gid, tr, f'ratio {ratio:.0f} terms {hit:.0f} f0 {f0:.0f} sim {td:.3f} longest-silence {mg:.2f} rate {rate:.1f} dur {len(a)/SR:.2f}s score {score:.1f} ({time.time()-t0:.0f}s)', flush=True)
        if best is None or score > best[0]: best = (score, a, words, ratio, hit, f0, td, mg)
        if ratio >= 93 and hit >= 90 and abs(f0 - REF_F0) <= 8 and td >= 0.93 and ok_flow: break
    sf.write(wp, best[1], SR)
    qc[gid] = dict(score=round(best[0], 1), ratio=round(best[3], 1), terms=round(best[4], 1), f0=round(best[5]), sim=round(best[6], 3), longest_silence=round(best[7], 2), dur=round(len(best[1])/SR, 2), words=[(w[0], round(w[1], 3), round(w[2], 3)) for w in best[2]])
    json.dump(qc, open(qp, 'w'), ensure_ascii=False, indent=1)
# ---------------- assemble: level-match, crossfade, room-tone bed ----------------
def voiced_rms(a):
    fr = librosa.util.frame(a, frame_length=480, hop_length=240); r = np.sqrt((fr**2).mean(0)); v = r[r > r.max()*0.1]; return float(np.sqrt((v**2).mean())) if len(v) else 1e-4
def room(n, seed=7):
    rng = np.random.default_rng(seed); x = rng.standard_normal(n).astype('float32')
    from scipy.signal import butter, lfilter
    b, a_ = butter(2, [120/(SR/2), 3500/(SR/2)], btype='band'); x = lfilter(b, a_, x).astype('float32'); return x / (np.abs(x).max() + 1e-9)
timeline = []; segs = []; t = 0.0; XF = int(0.03*SR); TARGET = 0.085
pos = []   # (start sample, array)
cur = 0
for gid, ids in GROUPS:
    a, _ = sf.read(f'{TK}/{gid}.wav'); a = a.astype('float32'); a = a * (TARGET / voiced_rms(a))
    nz = np.where(np.abs(a) > 0.012)[0]; a0 = max(0, nz[0] - int(0.05*SR)); a1 = min(len(a), nz[-1] + int(0.12*SR)); a = a[a0:a1]
    n = len(a); a[:XF] *= np.sin(np.linspace(0, np.pi/2, XF))**1; a[-XF:] *= np.cos(np.linspace(0, np.pi/2, XF))
    # per-sentence times inside the group from the word alignment (skeleton-length proportion)
    words = [(w[0], w[1]-a0/SR, w[2]-a0/SR) for w in qc[gid]['words']]; wk = [max(1, len(skel(w[0]))) for w in words]; cw = np.cumsum(wk); tot = cw[-1]; sk = [len(skel(S[i]['B'])) for i in ids]; ct = 0
    for i, ln in zip(ids, sk):
        k0 = int(np.searchsorted(cw, ct/sum(sk)*tot)) if ct else 0; ct += ln; k1 = min(len(words)-1, int(np.searchsorted(cw, ct/sum(sk)*tot)))
        timeline.append(dict(id=i, group=gid, start=round(t + max(0, words[k0][1]), 3), end=round(t + words[k1][2], 3), text=S[i]['A'], cap=S[i].get('cap', '')))
    pos.append((cur, a)); gid_t = dict(group=gid, start=round(t, 3), end=round(t + n/SR, 3), words=[(w[0], round(t + w[1], 3), round(t + w[2], 3)) for w in words]); segs.append(gid_t)
    g = GAP[gid]; cur += n + int(g*SR); t += n/SR + g
total = cur + int(0.3*SR); wave = np.zeros(total, dtype='float32')
for s0, a in pos: wave[s0:s0+len(a)] += a
bed = room(total) * 0.0035                                       # about -49 dBFS band-limited room tone, continuous under everything (also under the pauses)
wave = wave + bed; wave *= 0.89 / np.max(np.abs(wave))
sf.write(f'{OUT}/voice-v3.wav', wave, SR); json.dump(dict(sentences=timeline, groups=segs), open(f'{OUT}/timeline-v3.json', 'w'), ensure_ascii=False, indent=1)
os.system(f'ffmpeg -y -v error -i {OUT}/voice-v3.wav -af loudnorm=I=-16:TP=-1.5:LRA=9 -c:a libmp3lame -q:a 3 {OUT}/voice-v3.mp3')
print('assembled', round(total/SR, 1), 's', flush=True)
