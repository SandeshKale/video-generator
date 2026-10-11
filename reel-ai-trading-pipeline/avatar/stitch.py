# Stitch the 6 avatar clips: site/host.webm (VP9 24 fps, 720² face crop), audio/voice.wav (48 kHz mono), avatar/words.json
# (word times on the final timeline, with Whisper's spellings fixed to the on-screen forms: TradingView, F&O, Cowork, …).
import json, subprocess, os, re
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
PARTS = ['f3e9cf77', '7632ed00', 'cfe01a7b', '850efbfb', '06d47667', 'db6f3f14']
FPS = 24; TAIL = 1.6; MAXG = 0.6; PAD = 0.22   # pauses longer than 0.6 s are cut down to ~0.44 s
# sequences of whisper words -> one display word (merged span) ; single-word replacements
MERGE = [(('Trading', 'view'), 'TradingView'), (('Trading', 'Views'), "TradingView's"), (('two', 'factor'), 'two-factor'), (('web', 'hook'), 'webhook'),
         (('co', '-work'), 'Cowork'), (('91', '%'), '91%')]
REPL = {'rich': 'rich', '1.': 'one:', '2.': 'two:', '3,': 'three:', '4.': 'four:', 'Brain.': 'brain.', 'Official': 'official', 'Connector': 'connector', 'Command': 'command',
        'Charts,': 'charts,', 'Run': 'runs', 'Screeners,': 'screeners,', 'Pulls': 'pulls', 'News': 'news', 'Sets': 'sets', 'Alerts.': 'alerts.',
        'Pinescript,': 'Pine Script,', 'Supervisor': 'supervisor.', 'schedule': 'scheduled', 'FNO': 'F&O', 'The': 'the'}
def fix(W):
    out, i = [], 0
    while i < len(W):
        hit = None
        for seq, rep in MERGE:
            if tuple(re.sub(r'[.,]', '', W[j][0]) for j in range(i, min(len(W), i + len(seq)))) == seq: hit = (seq, rep); break
        if hit:
            n = len(hit[0]); last = W[i + n - 1][0]; tail = re.search(r'[.,:!?]*$', last).group(0)
            out.append([hit[1] + tail, W[i][1], W[i + n - 1][2]]); i += n; continue
        w = W[i][0]; w2 = REPL.get(w, w)
        if w == 'The': w2 = 'the' if (i > 0 and re.search(r'^\d[.,]$', W[i - 1][0])) else 'The'
        if w == 'get' and i + 1 < len(W) and W[i + 1][0] == 'rich': out.append(['get-rich', W[i][1], W[i + 1][2]]); i += 2; continue
        out.append([w2, W[i][1], W[i][2]]); i += 1
    return out
def run(*a): subprocess.check_call(list(a))
tmp = '/tmp/bf/st2'; os.makedirs(tmp, exist_ok=True)
words, cuts, segs, off = [], [], [], 0.0
for pi, k in enumerate(PARTS):
    src = os.path.join(H, 'raw', k + '.mp4'); W = fix(json.load(open(os.path.join(H, 'raw', k + '.json'))))
    cut = round(min(15.0, W[-1][2] + 0.38) * FPS) / FPS; hold = TAIL if pi == len(PARTS) - 1 else 0
    keep = [[0.0, None]]
    for a, b in zip(W, W[1:]):
        if b[1] - a[2] > MAXG:
            e = round((a[2] + PAD) * FPS) / FPS; s2 = round((b[1] - PAD) * FPS) / FPS
            keep[-1][1] = e; keep.append([s2, None])
    keep[-1][1] = cut
    def remap(t):
        acc = 0.0
        for a, b in keep:
            if t <= b: return acc + max(0.0, t - a)
            acc += b - a
        return acc
    vparts = ''.join(f'[0:v]trim={a:.4f}:{b:.4f},setpts=PTS-STARTPTS[v{j}];[0:a]atrim={a:.4f}:{b:.4f},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={b - a - 0.012:.4f}:d=0.012[a{j}];' for j, (a, b) in enumerate(keep))
    cat = ''.join(f'[v{j}][a{j}]' for j in range(len(keep))) + f'concat=n={len(keep)}:v=1:a=1[vc][ac]'
    o = f'{tmp}/p{pi}.mkv'
    vf = f'[vc]fps={FPS},crop=480:480:32:0,scale=720:720:flags=lanczos' + (f',tpad=stop_mode=clone:stop_duration={hold}' if hold else '') + '[vo]'
    af = '[ac]aresample=48000,pan=mono|c0=c0' + (f',apad=pad_dur={hold}' if hold else '') + '[ao]'
    run('ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', vparts + cat + ';' + vf + ';' + af, '-map', '[vo]', '-map', '[ao]', '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-c:a', 'pcm_s16le', o)
    segs.append(o)
    for w, s1, e1 in W: words.append([pi + 1, w, round(remap(s1) + off, 3), round(remap(e1) + off, 3)])
    cut = round(sum(b - a for a, b in keep) * FPS) / FPS
    cuts.append(round(cut, 3)); off += cut
open(f'{tmp}/list.txt', 'w').write(''.join(f"file '{s}'\n" for s in segs))
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/list.txt', '-c', 'copy', f'{tmp}/full.mkv')
os.makedirs(os.path.join(R, 'audio'), exist_ok=True); os.makedirs(os.path.join(R, 'site'), exist_ok=True)
run('ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/full.mkv', '-vn', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', os.path.join(R, 'audio', 'voice.wav'))
run('ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/full.mkv', '-an', '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-row-mt', '1', '-g', '24', '-deadline', 'good', '-cpu-used', '4', os.path.join(R, 'site', 'host.webm'))
json.dump({'words': words, 'cuts': cuts, 'tail': TAIL}, open(os.path.join(H, 'words.json'), 'w'), indent=0)
print('cuts', cuts, 'total', round(off + TAIL, 3)); print(' '.join(w[1] for w in words))
