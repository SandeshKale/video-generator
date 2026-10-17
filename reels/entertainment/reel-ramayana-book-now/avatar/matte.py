# Cut the host out of the avatar clips (u2net_human_seg via rembg, Apache-2.0 model) -> site/host.webm (VP9 + alpha, 24 fps, 480x480).
# Full cut-out, background removed only. No burned-in text in these clips, so no inpainting.
# Cuts/timing identical to stitch.py (cut after last word + 0.38 s, 1.5 s freeze tail on the last part). Audio is built separately (stitch.py).
import json, os, subprocess, sys, glob, shutil
import numpy as np, cv2
from PIL import Image
from rembg import new_session, remove
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..'); FPS = 24; TAIL = 1.5
parts = ['p1', 'p2', 'p3', 'p4']; cuts = json.load(open(os.path.join(H, 'words.json')))['cuts']
tmp = '/tmp/rmat'; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
sess = new_session('u2net_human_seg')
S = 544; yy = np.arange(S)[:, None] / S
fade = np.clip((0.74 - yy) / 0.08, 0, 1)          # Part 2 only (burned-in subtitles): 1 above 66%, 0 below 74%
fade_none = np.ones_like(fade)                    # other parts: full cut-out down to the frame edge, background removed only
n = 0; last = None
for k, c in zip(parts, cuts):
    src = os.path.join(H, 'raw', k + '.mp4'); fd = f'{tmp}/{k}'; os.makedirs(fd)
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, '-map', '0:v:0', '-t', f'{c:.4f}', '-vf', f'fps={FPS}', f'{fd}/%04d.png'])
    for f in sorted(glob.glob(fd + '/*.png')):
        im = Image.open(f).convert('RGB'); a = remove(im, session=sess, only_mask=True)
        a = np.asarray(a.resize((S, S))).astype(np.float32) / 255
        a = np.where(a > .5, np.clip((a - .35) / .5, 0, 1), np.clip(a * 1.2, 0, 1) * .6) if False else a
        a = np.clip((a - .12) / .76, 0, 1) * fade_none       # tighten the soft edge a little
        rgb = np.asarray(im)
        rgb = cv2.resize(np.asarray(im), (S, S))
        rgba = np.dstack([rgb, (a * 255).astype(np.uint8)])
        Image.fromarray(rgba, 'RGBA').save(f'{tmp}/f{n:05d}.png'); n += 1; last = f'{tmp}/f{n-1:05d}.png'
    print(k, n, flush=True)
for i in range(int(TAIL * FPS)): shutil.copy(last, f'{tmp}/f{n:05d}.png'); n += 1
out = os.path.join(R, 'site', 'host.webm')
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{tmp}/f%05d.png', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0', '-crf', '24', '-b:v', '0', '-g', '24', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', out])
print('frames', n, 'wrote', out)
