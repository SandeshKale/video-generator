# Pick the best take per line (Whisper accuracy first, then closeness to the creator's pitch), trim silence,
# write reels/tech/reel-teach-a-skill/vo/lNN.wav + vo/timing.json (word times) + vo/take_report.json + vo/sample.wav (all lines joined).
import os, sys, re, json, glob, shutil, numpy as np, soundfile as sf, librosa, jiwer
from faster_whisper import WhisperModel
V, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
LINES = json.load(open(f'{V}/lines.json'))
asr = WhisperModel('small.en', device='cpu', compute_type='int8')
def norm(s): return re.sub(r"[^a-z0-9' ]", ' ', s.lower().replace('-', ' ').replace('a i', 'ai')).split()
y, sr = sf.read(f'{V}/real_full.wav'); f0, _, _ = librosa.pyin(y.astype(np.float32), fmin=70, fmax=300, sr=sr); REAL = float(np.nanmedian(f0))
print('creator f0', round(REAL, 1))
FORCE = dict(x.split(':') for x in os.environ.get('FORCE', '').split(',') if x)  # e.g. FORCE=l06:A0 (listening/transcript override)
rep, timing = {}, {}
for sid, say, speed in LINES:
    best = None
    for c in sorted(glob.glob(f'{V}/takes/{sid}_*.wav')):
        segs, _ = asr.transcribe(c, language='en', beam_size=5)
        hyp = ' '.join(s.text for s in segs)
        wer = jiwer.wer(' '.join(norm(say)), ' '.join(norm(hyp))) if norm(hyp) else 1.0
        a, r = sf.read(c); f, _, _ = librosa.pyin(a.astype(np.float32), fmin=70, fmax=300, sr=r); med = float(np.nanmedian(f))
        score = wer * 10 + abs(med - REAL) / 20 + (3 if abs(a).max() > 0.99 else 0)
        rep.setdefault(sid, []).append(dict(take=os.path.basename(c), wer=round(wer, 3), f0=round(med, 1), dur=round(len(a) / r, 2), score=round(score, 3), heard=hyp.strip()))
        if best is None or score < best[0]: best = (score, c)
    if sid in FORCE: best = (0, f'{V}/takes/{sid}_{FORCE[sid]}.wav')
    a, r = sf.read(best[1]); idx = librosa.effects.split(a, top_db=40); a = a[max(0, idx[0][0] - int(.03 * r)):min(len(a), idx[-1][1] + int(.08 * r))]
    sf.write(f'{OUT}/{sid}.wav', a.astype(np.float32), r)
    segs, _ = asr.transcribe(f'{OUT}/{sid}.wav', language='en', word_timestamps=True, beam_size=5)
    timing[sid] = dict(dur=round(len(a) / r, 3), words=[dict(w=w.word.strip(), s=round(w.start, 3), e=round(w.end, 3)) for sg in segs for w in sg.words])
    print(sid, os.path.basename(best[1]), [(x['take'][-6:-4], x['wer'], x['f0']) for x in rep[sid]], flush=True)
json.dump(rep, open(f'{OUT}/take_report.json', 'w'), indent=1); json.dump(timing, open(f'{OUT}/timing.json', 'w'), indent=1)
# listening sample: lines joined with natural gaps (0.35 s, 0.6 s before steps and the catch)
gap = lambda s: np.zeros(int(s * 24000), np.float32); parts = []
for sid, say, _ in LINES:
    parts.append(gap(0.6 if say.startswith(('Step', 'The catch', 'Save this')) else 0.35)); parts.append(sf.read(f'{OUT}/{sid}.wav')[0].astype(np.float32))
x = np.concatenate(parts); x = x / max(1e-6, np.abs(x).max()) * 0.9; sf.write(f'{OUT}/sample.wav', x, 24000)
print('sample s', round(len(x) / 24000, 1))
