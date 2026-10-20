# Cut the host out of the avatar clips -> site/host.webm (VP9 + alpha, 24 fps, 544x544). Same cuts as stitch.py; 1.5 s frozen tail.
# The clips have a dark bookshelf behind dark hair, so a plain segmentation mask gives a hard "helmet" edge with brown fringe:
#  1 coarse mask: rembg u2net_human_seg (Apache-2.0), fast (~0.4 s/frame)
#  2 temporal stabilising: per-pixel median of the previous/current/next mask, only where the picture is still
#    (moving hands keep their own frame's mask, so nothing lags)
#  3 edge: colour guided filter (He et al.) on the frame recovers soft hair strands; the solid core is forced opaque and
#    anything more than a few px outside the body is forced clear, so no halo can form
#  4 colour decontamination: the bookshelf behind each edge pixel is estimated by inpainting and its brown spill is removed
# Resumable: frames already written in the work dir are kept. BiRefNet was tested and kept finer hair, but ran 9-36 s/frame.
import json, os, subprocess, glob, shutil
import numpy as np, cv2
from PIL import Image
from rembg import new_session, remove
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..'); FPS = 24; TAIL = 1.5; S = 544
parts = ['p1', 'p2', 'p3', 'p4']; cuts = json.load(open(os.path.join(H, 'words.json')))['cuts']
tmp = '/tmp/sam_mat'; os.makedirs(tmp, exist_ok=True)
sess = new_session('u2net_human_seg')

def gf(I, p, r, eps):   # colour guided filter
    mean = lambda x: cv2.blur(x, (2 * r + 1, 2 * r + 1))
    mI = mean(I); mp = mean(p); cov = np.stack([mean(I[..., c] * p) - mI[..., c] * mp for c in range(3)], -1)
    var = np.zeros(I.shape[:2] + (3, 3), np.float32)
    for i in range(3):
        for j in range(3): var[..., i, j] = mean(I[..., i] * I[..., j]) - mI[..., i] * mI[..., j]
    a = np.linalg.solve(var + eps * np.eye(3, dtype=np.float32), cov[..., None])[..., 0]
    return (mean(a) * I).sum(-1) + mean(mp - (a * mI).sum(-1))

def refine(I, p):
    q = gf(I, p, 6, 2e-4); q = np.clip((q - .1) / .82, 0, 1)
    hard = (p > .5).astype(np.uint8)
    q[cv2.erode(hard, np.ones((9, 9), np.uint8)).astype(bool)] = 1
    q[cv2.dilate(hard, np.ones((9, 9), np.uint8)) == 0] = 0
    q = cv2.GaussianBlur(q, (3, 3), 0)
    bg = (q < .02).astype(np.uint8)
    B = cv2.inpaint((I * 255).astype(np.uint8), 1 - bg, 9, cv2.INPAINT_TELEA).astype(np.float32) / 255
    a = q[..., None]; F = np.clip(np.where(a > .02, (I - (1 - a) * B) / np.maximum(a, .02), I), 0, 1); F = np.where(a > .97, I, F)
    return F, q

n = 0; last = None
for k, c in zip(parts, cuts):
    src = os.path.join(H, 'raw', k + '.mp4'); fd = f'{tmp}/{k}'; os.makedirs(fd, exist_ok=True)
    if not glob.glob(fd + '/*.png'): subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', src, '-map', '0:v:0', '-t', f'{c:.4f}', '-vf', f'fps={FPS}', f'{fd}/%04d.png'])
    fs = sorted([f for f in glob.glob(fd + '/[0-9]*.png') if not f.endswith('.m.png')])
    if all(os.path.exists(f'{tmp}/f{n + i:05d}.png') for i in range(len(fs))): n += len(fs); last = f'{tmp}/f{n - 1:05d}.png'; print(k, n, 'cached', flush=True); continue
    ims = [np.asarray(Image.open(f).convert('RGB').resize((S, S)), np.float32) / 255 for f in fs]
    ms = []
    for f in fs:
        mf = f.replace('.png', '.m.png')
        if not os.path.exists(mf): remove(Image.open(f).convert('RGB'), session=sess, only_mask=True).resize((S, S)).save(mf)
        ms.append(np.asarray(Image.open(mf), np.float32) / 255)
    for i in range(len(fs)):
        p = ms[i]
        if 0 < i < len(fs) - 1:
            still = (np.abs(ims[i] - ims[i - 1]).mean(-1) < .03) & (np.abs(ims[i] - ims[i + 1]).mean(-1) < .03)
            p = np.where(still, np.median(np.stack([ms[i - 1], ms[i], ms[i + 1]]), 0), p)
        F, q = refine(ims[i], p.astype(np.float32))
        o = f'{tmp}/f{n:05d}.png'
        Image.fromarray(np.dstack([(F * 255 + .5).astype(np.uint8), (q * 255 + .5).astype(np.uint8)]), 'RGBA').save(o)
        n += 1; last = o
    print(k, n, flush=True)
for i in range(int(TAIL * FPS)): shutil.copy(last, f'{tmp}/f{n:05d}.png'); n += 1
out = os.path.join(R, 'site', 'host.webm')
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{tmp}/f%05d.png', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0', '-crf', '22', '-b:v', '0', '-g', '24', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', out])
print('frames', n, 'wrote', out)
