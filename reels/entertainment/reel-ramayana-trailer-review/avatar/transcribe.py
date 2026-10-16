# Hindi word timestamps for each avatar clip: avatar/raw/pN.mp4 -> avatar/raw/pN.json [[word,start,end],...]
# Run: /tmp/qwenenv/bin/python -I avatar/transcribe.py   (faster-whisper small, language=hi; hand-fix words.json afterwards)
import json, os, subprocess, glob
from faster_whisper import WhisperModel
H = os.path.dirname(os.path.abspath(__file__)); raw = os.path.join(H, 'raw')
m = WhisperModel('small', device='cpu', compute_type='int8')
for src in sorted(glob.glob(os.path.join(raw, 'p[0-9].mp4'))):
    wav = src.replace('.mp4', '.wav')
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vn', '-ac', '1', '-ar', '16000', wav])
    segs, _ = m.transcribe(wav, language='hi', word_timestamps=True, vad_filter=False)
    W = [[w.word.strip(), round(w.start, 3), round(w.end, 3)] for s in segs for w in s.words]
    json.dump(W, open(src.replace('.mp4', '.json'), 'w'), ensure_ascii=False)
    print(os.path.basename(src), len(W), 'words, last ends', W[-1][2] if W else None)
