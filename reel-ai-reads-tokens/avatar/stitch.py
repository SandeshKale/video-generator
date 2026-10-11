# Stitch the 5 avatar clips into one timeline: site/host.webm (VP9 24 fps, 720x720 face crop), audio/voice.wav (48 kHz mono)
# and avatar/words.json (word times on the final timeline, hand-fixed where Whisper misheard).
# P1 gets a 0.333 s freeze+silence inserted between "Sand" and "esh" (the take only had a ~0.1 s gap).
import json, subprocess, os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
PARTS = ['d1222696', '950dac1c', '6d5bf8a5', 'fcfea71b', '5832162b']
FPS = 24; SPLIT = 215 / FPS; HOLD = 8 / FPS   # P1: split at frame 215 (8.958 s), hold 8 frames
TAIL = 1.5                                      # freeze tail after the last part (CTA hold)
FIX = {('950dac1c', 'hours.'): "R's.", ('950dac1c', "A's."): "R's.", ('5832162b', 'Transiter,'): 'tokenizer,', ('5832162b', 'Transitor,'): 'tokenizer,',
       ('5832162b', 'too.'): 'two.', ('5832162b', '2,'): 'two.', ('6d5bf8a5', '24.'): 'twenty-four.', ('6d5bf8a5', '24'): 'twenty-four'}
def run(*a): subprocess.check_call(list(a))
tmp = '/tmp/bf/st'; os.makedirs(tmp, exist_ok=True)
words, cuts, segs, off = [], [], [], 0.0
for pi, k in enumerate(PARTS):
    src = os.path.join(H, 'raw', k + '.mp4'); W = json.load(open(os.path.join(H, 'raw', k + '.json')))
    last = W[-1][2]; cut = round(min(15.0, last + 0.38) * FPS) / FPS
    pieces = [(0, cut, 0)] if pi else [(0, SPLIT, HOLD), (SPLIT, cut, 0)]
    if pi == len(PARTS) - 1: pieces[-1] = (pieces[-1][0], cut, TAIL)
    for j, (a, b, hold) in enumerate(pieces):
        o = f'{tmp}/p{pi}_{j}.mp4'
        vf = f'fps={FPS},crop=760:760:92:30,scale=720:720' + (f',tpad=stop_mode=clone:stop_duration={hold}' if hold else '')
        af = 'aresample=48000,pan=mono|c0=c0' + (f',apad=pad_dur={hold}' if hold else '')
        run('ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.4f}', '-to', f'{b:.4f}', '-i', src, '-vf', vf, '-af', af, '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-c:a', 'pcm_s16le', o.replace('.mp4', '.mkv'))
        segs.append(o.replace('.mp4', '.mkv'))
    for w, s, e in W:
        w2 = FIX.get((k, w), w)
        if pi == 0 and w2.startswith('Sandesh') and s > 8:   # the split take of the name
            words.append([pi + 1, 'Sand…', s + off, SPLIT + off]); words.append([pi + 1, 'esh.', SPLIT + HOLD + off, e + HOLD + off]); continue
        sh = HOLD if (pi == 0 and s >= SPLIT) else 0
        words.append([pi + 1, w2, round(s + sh + off, 3), round(e + sh + off, 3)])
    plen = cut + (HOLD if pi == 0 else 0); cuts.append(round(plen, 3)); off += plen
open(f'{tmp}/list.txt', 'w').write(''.join(f"file '{s}'\n" for s in segs))
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/list.txt', '-c', 'copy', f'{tmp}/full.mkv')
os.makedirs(os.path.join(R, 'audio'), exist_ok=True)
run('ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/full.mkv', '-vn', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', os.path.join(R, 'audio', 'voice.wav'))
run('ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/full.mkv', '-an', '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-row-mt', '1', '-g', '24', '-deadline', 'good', '-cpu-used', '4', os.path.join(R, 'site', 'host.webm'))
json.dump({'words': words, 'cuts': cuts, 'tail': TAIL}, open(os.path.join(H, 'words.json'), 'w'), indent=0)
print('cuts', cuts, 'total voice', round(off + TAIL, 3))
