# Stitch avatar/raw/p1..p4.mp4 (+ .json word times) into audio/voice.wav (48 kHz mono) and avatar/words.json.
# No pause cutting or tempo change (voice-flow rule): each part is cut only after its last word + 0.38 s.
# The last part gets a 1.5 s silent tail (frozen host) so the CTA holds. The host video is cut out by matte.py with the same cuts.
import json, os, subprocess
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
TAIL = 1.5; PARTS = ['p1', 'p2', 'p3', 'p4']
def run(*a): subprocess.check_call(list(a))
tmp = '/tmp/upi_st'; os.makedirs(tmp, exist_ok=True)
words, cuts, segs, off = [], [], [], 0.0
for pi, k in enumerate(PARTS):
    src = os.path.join(H, 'raw', k + '.mp4'); W = json.load(open(os.path.join(H, 'raw', k + '.json'), encoding='utf8'))
    cut = round(min(15.0, W[-1][2] + 0.38) * 24) / 24
    hold = TAIL if pi == len(PARTS) - 1 else 0
    o = f'{tmp}/{k}.wav'
    run('ffmpeg', '-v', 'error', '-y', '-t', f'{cut:.4f}', '-i', src, '-map', '0:a:0', '-af', 'aresample=48000,pan=mono|c0=c0,afade=t=out:st=%.3f:d=0.06' % (cut - 0.06) + (f',apad=pad_dur={hold}' if hold else ''), '-c:a', 'pcm_s16le', o)
    segs.append(o)
    for ww, s, e in W: words.append([pi + 1, ww, round(s + off, 3), round(e + off, 3)])
    cuts.append(round(cut, 4)); off += cut
open(f'{tmp}/list.txt', 'w').write(''.join(f"file '{s}'\n" for s in segs))
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/list.txt', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', os.path.join(R, 'audio', 'voice.wav'))
json.dump({'words': words, 'cuts': cuts, 'tail': TAIL}, open(os.path.join(H, 'words.json'), 'w'), ensure_ascii=False, indent=0)
print('cuts', cuts, 'total', round(off + TAIL, 3))
