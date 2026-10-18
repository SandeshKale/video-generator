# Cut the host out of the avatar clips (rembg u2net_human_seg, Apache-2.0 model) -> site/host_en.webm (VP9 + alpha, 24 fps, 544x544).
# Background removed only, full figure down to the frame edge. Same cuts as stitch.py; 1.5 s frozen tail on the last part.
# Resumable: frames already written in the work dir are kept.
import json, os, subprocess, glob, shutil
import numpy as np, cv2
from PIL import Image
from rembg import new_session, remove
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..'); FPS = 24; TAIL = 1.5
parts = ['p1', 'p2', 'p3', 'p4']; cuts = json.load(open(os.path.join(H, 'words.json')))['cuts']
tmp = '/tmp/bat_mat_en'; os.makedirs(tmp, exist_ok=True)
sess = new_session('u2net_human_seg'); S = 544
n = 0; last = None
for k, c in zip(parts, cuts):
    src = os.path.join(H, 'raw', k + '.mp4'); fd = f'{tmp}/{k}'; os.makedirs(fd, exist_ok=True)
    if not glob.glob(fd + '/*.png'): subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, '-map', '0:v:0', '-t', f'{c:.4f}', '-vf', f'fps={FPS}', f'{fd}/%04d.png'])
    for f in sorted(glob.glob(fd + '/*.png')):
        o = f'{tmp}/f{n:05d}.png'
        if not os.path.exists(o):
            im = Image.open(f).convert('RGB'); a = remove(im, session=sess, only_mask=True)
            a = np.asarray(a.resize((S, S))).astype(np.float32) / 255
            a = np.clip((a - .12) / .76, 0, 1)
            rgb = cv2.resize(np.asarray(im), (S, S))
            Image.fromarray(np.dstack([rgb, (a * 255).astype(np.uint8)]), 'RGBA').save(o)
        n += 1; last = o
    print(k, n, flush=True)
for i in range(int(TAIL * FPS)): shutil.copy(last, f'{tmp}/f{n:05d}.png'); n += 1
out = os.path.join(R, 'site', 'host_en.webm')
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{tmp}/f%05d.png', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0', '-crf', '24', '-b:v', '0', '-g', '24', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', out])
print('frames', n, 'wrote', out)
