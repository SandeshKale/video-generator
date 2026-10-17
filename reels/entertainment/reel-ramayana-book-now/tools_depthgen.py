# site/shots/<id>.jpg (1280x720 trailer stills) -> site/depth/<id>.png (near = bright, 512x288)
import os, glob
from PIL import Image
from transformers import pipeline
import numpy as np
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'site'))
os.makedirs('depth', exist_ok=True)
pipe = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Small-hf', device=-1)
for p in sorted(glob.glob('shots/*.jpg')):
    i = os.path.basename(p)[:-4]; d = f'depth/{i}.png'
    if os.path.exists(d): continue
    im = Image.open(p).convert('RGB'); out = pipe(im)['depth']
    a = np.asarray(out.resize(im.size, Image.BICUBIC)).astype('float32'); a = (a - a.min()) / max(1e-6, a.max() - a.min())
    Image.fromarray((a * 255).astype('uint8')).convert('RGB').resize((512, 288), Image.BICUBIC).save(d); print('depth', i, flush=True)
