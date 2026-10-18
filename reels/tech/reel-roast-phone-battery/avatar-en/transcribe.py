# English word timestamps for each avatar clip: avatar-en/raw/<name>.mp4 -> <name>.json [[word,start,end],...]
# Run: python3 -I avatar-en/transcribe.py [names...]   (faster-whisper small.en; hand-fix words.json afterwards)
import json, os, subprocess, sys, glob
from faster_whisper import WhisperModel
H = os.path.dirname(os.path.abspath(__file__)); raw = os.path.join(H, 'raw')
m = WhisperModel('small.en', device='cpu', compute_type='int8')
names = sys.argv[1:] or [os.path.basename(f)[:-4] for f in sorted(glob.glob(os.path.join(raw, 'p[0-9].mp4')))]
for n in names:
    src = os.path.join(raw, n + '.mp4'); wav = os.path.join(raw, n + '.wav')
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, '-map', '0:a:0', '-ac', '1', '-ar', '16000', wav])
    segs, _ = m.transcribe(wav, language='en', word_timestamps=True, vad_filter=False)
    W = [[w.word.strip(), round(w.start, 3), round(w.end, 3)] for s in segs for w in s.words]
    json.dump(W, open(os.path.join(raw, n + '.json'), 'w'), ensure_ascii=False)
    print(n, len(W), 'words, last ends', W[-1][2] if W else None, '|', ' '.join(w[0] for w in W))
