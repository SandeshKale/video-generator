# shots/<id>.png -> shots/<id>.jpg (q93) + depth/<id>.png (near = bright)
import os, sys, glob
from PIL import Image
from transformers import pipeline
import numpy as np
os.makedirs('depth', exist_ok=True)
pipe = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Small-hf', device=-1)
for p in sorted(glob.glob('shots/*.png')):
    i = os.path.basename(p)[:-4]
    j, d = f'shots/{i}.jpg', f'depth/{i}.png'
    im = Image.open(p).convert('RGB')
    if not os.path.exists(j): im.save(j, quality=93)
    if os.path.exists(d): continue
    out = pipe(im)['depth']
    a = np.asarray(out.resize(im.size, Image.BICUBIC)).astype('float32')
    a = (a - a.min()) / max(1e-6, a.max() - a.min())
    # soften to avoid tearing in parallax
    Image.fromarray((a * 255).astype('uint8')).convert('RGB').resize((im.width // 2, im.height // 2), Image.BICUBIC).save(d)
    print('depth', i, flush=True)
