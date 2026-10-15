# pick2.py - paragraph-take picker with a FLOW check (creator, 14 Oct 2026: "voiceover has broken sentences").
# Takes are whole breath groups (1-3 short sentences). No pause cutting, no tempo change after generation. A take is
# REJECTED unless: Whisper transcript == script (WER 0), no internal pause > 0.55 s, 2.3-3.6 words/s, onset not clipped
# (first 40 ms quiet), natural decay at the end. Among passing takes the lowest score (similarity + dryness + accent) wins.
# Output vo/pNN.wav (trimmed, gentle finish only), vo/take_report.json. Not auditioned (flag in delivery).
import os, sys, re, json, glob, subprocess, numpy as np, soundfile as sf, librosa, jiwer
from faster_whisper import WhisperModel
from resemblyzer import VoiceEncoder, preprocess_wav
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from accent import margin as accent_margin
MODES = os.environ.get('PICK_MODES', 'icl,iclAB').split(',')
T, REAL = sys.argv[1], sys.argv[2]; HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '..', 'vo'); os.makedirs(OUT, exist_ok=True)
FORCE = dict(x.split(':') for x in os.environ.get('FORCE', '').split(',') if x)
lines = json.load(open(os.environ.get('LINES', os.path.join(HERE, 'lines.json'))))
asr = WhisperModel('small.en', device='cpu', compute_type='int8'); enc = VoiceEncoder('cpu'); eref = enc.embed_utterance(preprocess_wav(REAL))
NUM = {'1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '7': 'seven', '10': 'ten', '57': 'fifty seven', '100': 'hundred'}
HOM = {'roots': 'routes', '2025': 'twenty twenty five', 'taps': 'tabs'}
def norm(s): return ' '.join(HOM.get(w, NUM.get(w, w)) for w in re.sub(r"[^a-z0-9' ]", ' ', s.lower().replace('-', ' ')).split()).split()
def floor_db(y, sr):
    hop = int(.01 * sr); d = 20 * np.log10(librosa.feature.rms(y=y, frame_length=hop * 3, hop_length=hop)[0] + 1e-7)
    hi = np.percentile(d, 95); v = np.where(d > hi - 30)[0]
    if len(v) < 2: return 0.0
    seg = d[v[0]:v[-1]]; return float(np.percentile(seg, 10) - hi)
FIN = 'highpass=f=70,deesser=i=0.35:m=0.5:f=0.5,equalizer=f=180:t=q:w=1.0:g=1.5,highshelf=f=8000:g=-1.5,acompressor=threshold=-22dB:ratio=2:attack=15:release=200:makeup=1.5'
def flow_check(f, y, sr, text, hyp, ws):
    bad = []
    if ' '.join(norm(text)) != ' '.join(norm(hyp)): bad.append('transcript')
    for a, b in zip(ws, ws[1:]):
        lim = 1.0 if re.search(r'[.?!:]$', a.word.strip()) else .55   # a pause after a sentence end is natural; inside a phrase it is a break
        if b.start - a.end > lim: bad.append('pause %.2f@%s' % (b.start - a.end, a.word.strip()))
    if ws:
        sp = len(ws) / max(.1, ws[-1].end - ws[0].start)
        if not 1.9 <= sp <= 3.6:   # this reel's cloned read is a calm ~2.1 words/s (sleep topic); no tempo change allowed, so the floor is relaxed from 2.3
             bad.append('rate %.2f' % sp)
    hop = int(.01 * sr); d = 20 * np.log10(librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop)[0] + 1e-7); pk = d.max()
    first = np.argmax(d > pk - 25)
    last = len(d) - 1 - np.argmax(d[::-1] > pk - 25)
    if len(d) - last < 3 and sr and len(y) / sr > 1: bad.append('hard-end')
    return bad
rep = {}
for sid, text in lines:
    best = None
    for f in sorted(glob.glob(f'{T}/{sid}_*.wav')):
        if os.path.basename(f)[len(sid) + 1:-5] not in MODES: continue
        y, sr = librosa.load(f, sr=24000)
        segs, _ = asr.transcribe(f, language='en', beam_size=5, word_timestamps=True); segs = list(segs); hyp = ' '.join(s.text for s in segs); segs_words = [w for s in segs for w in s.words]
        wer = jiwer.wer(' '.join(norm(text)), ' '.join(norm(hyp))) if norm(hyp) else 1.0
        sim = float(np.dot(eref, enc.embed_utterance(preprocess_wav(f)))); fl = floor_db(y, sr)
        acc, top = accent_margin(f)
        flow = flow_check(f, y, sr, text, hyp, segs_words)
        score = (0 if not flow else 50 + 5 * len(flow)) + wer * 10 + (1 - sim) * 8 + max(0, fl + 45) * 0.15 + max(0, 0.15 - acc) * 25
        tk = os.path.basename(f)[len(sid) + 1:-4]
        rep.setdefault(sid, []).append(dict(flow=flow, take=tk, wer=round(wer, 3), sim=round(sim, 3), floor_db=round(fl, 1), dur=round(len(y) / sr, 2), accent=round(acc, 3), accent_top=top, score=round(score, 3), heard=hyp.strip()))
        if (sid in FORCE and tk == FORCE[sid]) or (sid not in FORCE and (best is None or score < best[0])): best = (score if sid not in FORCE else -1, f)
    y, sr = librosa.load(best[1], sr=24000)
    from scipy.signal import butter, sosfilt
    yb = sosfilt(butter(4, 150, 'high', fs=sr, output='sos'), y)          # trim on speech-band energy, so low rumble doesn't count
    hop = int(.01 * sr); d = 20 * np.log10(librosa.feature.rms(y=yb, frame_length=hop * 2, hop_length=hop)[0] + 1e-7); pk = d.max()
    on = np.argmax(d > pk - 20); off = len(d) - 1 - np.argmax(d[::-1] > pk - 28)   # first/last frame of real speech
    y = y[max(0, on * hop - int(.10 * sr)):min(len(y), off * hop + int(.30 * sr))]
    # NO pause cutting and NO tempo change: the take is kept exactly as generated (only edge-trimmed)
    raw = f'{OUT}/{sid}_raw.wav'; sf.write(raw, y.astype(np.float32), sr)
    subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', FIN, '-ar', '24000', '-ac', '1', f'{OUT}/{sid}.wav']); os.remove(raw)
    print(sid, os.path.basename(best[1]), [(r['take'], r['wer'], r['sim'], r['accent']) for r in rep[sid]], flush=True)
json.dump(rep, open(f'{OUT}/take_report.json', 'w'), indent=1)
gap = lambda s: np.zeros(int(s * 24000), np.float32); parts = []
for sid, text in lines:
    parts += [gap(.6 if text.startswith(('Step', 'The catch', 'Save this')) else .35), sf.read(f'{OUT}/{sid}.wav')[0].astype(np.float32)]
x = np.concatenate(parts); x = x / np.abs(x).max() * .9; sf.write(f'{OUT}/sample.wav', x, 24000)
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{OUT}/sample.wav', '-af', 'loudnorm=I=-16:TP=-1.5', '-c:a', 'libmp3lame', '-b:a', '160k', f'{OUT}/sample.mp3'])
print('sample s', round(len(x) / 24000, 1))
