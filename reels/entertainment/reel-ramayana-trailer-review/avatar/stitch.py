# Stitch avatar/raw/p1..p4.mp4 (+ .json from transcribe.py) into site/host.webm (VP9 24 fps), audio/voice.wav (48 kHz mono)
# and avatar/words.json. No pause cutting or tempo change (voice-flow rule): each part is cut only after its last word + 0.38 s.
# Crop: env CROP="w:h:x:y" (default: centre square of the clip); the host tile is small and borderless on the page.
import json, os, subprocess
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
FPS = 24; TAIL = 1.5; PARTS = ['p1', 'p2', 'p3', 'p4']; GAP = 0.18   # short breath between parts so the cadence stays continuous
def run(*a): subprocess.check_call(list(a))
def probe(f):
    o = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f]).decode().split(',')
    return int(o[0]), int(o[1])
tmp = '/tmp/rama_st'; os.makedirs(tmp, exist_ok=True)
words, cuts, segs, off = [], [], [], 0.0
for pi, k in enumerate(PARTS):
    src = os.path.join(H, 'raw', k + '.mp4'); W = json.load(open(os.path.join(H, 'raw', k + '.json'), encoding='utf8'))
    w, h = probe(src); side = min(w, h)
    crop = os.environ.get('CROP') or f'{side}:{side}:{(w-side)//2}:0'
    last = W[-1][2]; cut = round(min(15.0, last + 0.38) * FPS) / FPS
    hold = TAIL if pi == len(PARTS) - 1 else 0
    o = f'{tmp}/{k}.mkv'
    vf = f'fps={FPS},crop={crop},scale=720:720' + (f',tpad=stop_mode=clone:stop_duration={hold}' if hold else '')
    af = 'aresample=48000,pan=mono|c0=c0' + (f',apad=pad_dur={hold}' if hold else '')
    run('ffmpeg', '-v', 'error', '-y', '-ss', '0', '-to', f'{cut:.4f}', '-i', src, '-vf', vf, '-af', af, '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-c:a', 'pcm_s16le', o)
    segs.append(o)
    for ww, s, e in W: words.append([pi + 1, ww, round(s + off, 3), round(e + off, 3)])
    cuts.append(round(cut, 3)); off += cut
open(f'{tmp}/list.txt', 'w').write(''.join(f"file '{s}'\n" for s in segs))
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/list.txt', '-c', 'copy', f'{tmp}/full.mkv')
run('ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/full.mkv', '-vn', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', os.path.join(R, 'audio', 'voice.wav'))
run('ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/full.mkv', '-an', '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-row-mt', '1', '-g', '24', '-deadline', 'good', '-cpu-used', '4', os.path.join(R, 'site', 'host.webm'))
json.dump({'words': words, 'cuts': cuts, 'tail': TAIL}, open(os.path.join(H, 'words.json'), 'w'), ensure_ascii=False, indent=0)
print('cuts', cuts, 'total', round(off + TAIL, 3))
