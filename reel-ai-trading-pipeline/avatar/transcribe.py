# Word-level transcription of the raw avatar clips (faster-whisper base, offline). Writes avatar/raw/<id>.json
import sys, json, os, glob
os.environ.setdefault('HF_HUB_OFFLINE', '1')
from faster_whisper import WhisperModel
m = WhisperModel(os.environ.get('WM','small'), device='cpu', compute_type='int8')
for f in sorted(glob.glob(os.path.join(os.path.dirname(__file__), 'raw', '*.mp4'))):
    segs, info = m.transcribe(f, word_timestamps=True, language='en', vad_filter=False)
    W = [[w.word.strip(), round(w.start, 3), round(w.end, 3)] for s in segs for w in s.words]
    json.dump(W, open(f[:-4] + '.json', 'w'))
    print(os.path.basename(f), ' '.join(w[0] for w in W)); print('   first', W[0][1], 'last end', W[-1][2])
