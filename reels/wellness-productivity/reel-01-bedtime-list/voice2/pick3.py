# Flow check + pick for OmniVoice takes: Whisper transcript must equal the script, no break inside a phrase, natural rate; among passes the take closest to the Adam reference wins.
import os, re, sys, json, glob, numpy as np, soundfile as sf, librosa, jiwer
from faster_whisper import WhisperModel
from resemblyzer import VoiceEncoder, preprocess_wav
HERE = os.path.dirname(os.path.abspath(__file__)); lines = json.load(open(f'{HERE}/lines.json'))
asr = WhisperModel('small.en', device='cpu', compute_type='int8'); enc = VoiceEncoder('cpu'); eref = enc.embed_utterance(preprocess_wav(f'{HERE}/ref_adam.wav'))
NUM = {'1': 'one', '2': 'two', '10': 'ten', '57': 'fifty seven', '100': 'hundred', '5': 'five'}
def norm(s): return ' '.join(NUM.get(w, w) for w in re.sub(r"[^a-z0-9' ]", ' ', s.lower().replace('a.m.', 'am').replace('-', ' ')).split()).replace(' a m', ' am').split()
rep = {}; best = {}
for sid, text in lines:
    rows = []
    for f in sorted(glob.glob(f'{HERE}/takes/{sid}_s*.wav')):
        y, sr = librosa.load(f, sr=24000); segs, _ = asr.transcribe(f, language='en', beam_size=5, word_timestamps=True); segs = list(segs); ws = [w for s in segs for w in s.words]; hyp = ' '.join(s.text for s in segs)
        wer = jiwer.wer(' '.join(norm(text)), ' '.join(norm(hyp))) if norm(hyp) else 1.0; bad = []
        if wer > 0: bad.append('transcript %.2f' % wer)
        for a, b in zip(ws, ws[1:]):
            lim = 1.0 if re.search(r'[.?!:]$', a.word.strip()) else .6
            if b.start - a.end > lim: bad.append('pause %.2f@%s' % (b.start - a.end, a.word.strip()))
        sp = len(ws) / max(.1, ws[-1].end - ws[0].start) if ws else 0
        if not 2.4 <= sp <= 4.3: bad.append('rate %.2f' % sp)
        sim = float(np.dot(eref, enc.embed_utterance(preprocess_wav(f)))); rows.append({'take': os.path.basename(f), 'flow': bad, 'sim': round(sim, 3), 'rate': round(sp, 2), 'dur': round(len(y) / 24000, 2), 'heard': hyp.strip()})
    ok = [r for r in rows if not r['flow']] or sorted(rows, key=lambda r: len(r['flow']))[:1]
    b = max(ok, key=lambda r: r['sim']); best[sid] = b['take']; rep[sid] = rows; print(sid, b['take'], 'flow', b['flow'], 'sim', b['sim'], 'rate', b['rate'], 'dur', b['dur'], flush=True)
json.dump({'best': best, 'rows': rep}, open(f'{HERE}/take_report.json', 'w'), indent=1)
