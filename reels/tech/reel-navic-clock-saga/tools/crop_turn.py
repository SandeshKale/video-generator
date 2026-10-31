#!/usr/bin/env python3
"""Reads site/img/satturn/f*.png, trims each to the shared alpha bbox (keeps the frame-0 centre as anchor), writes site/satturn.js with the geometry. python3 tools/crop_turn.py"""
from PIL import Image; import numpy as np, glob, json, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); fs = sorted(glob.glob(R + '/site/img/satturn/f*.png'))
ims = [Image.open(f).convert('RGBA') for f in fs]; W, H = ims[0].size
bb = [0, 0, 0, 0]; box = None; I = int
for im in ims:
    a = np.asarray(im)[:, :, 3] > 8; ys, xs = np.where(a); b = [xs.min(), ys.min(), xs.max() + 1, ys.max() + 1]
    box = b if box is None else [min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3])]
a0 = np.asarray(ims[0])[:, :, 3] > 8; ys, xs = np.where(a0); f0 = [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)]
for f, im in zip(fs, ims): im.crop(box).save(f)
cw, ch = box[2] - box[0], box[3] - box[1]
open(R + '/site/satturn.js', 'w').write('window.SATT=' + json.dumps(dict(n=len(fs), w=int(cw), h=int(ch), f0w=int(f0[2] - f0[0]), f0cx=float((f0[0] + f0[2]) / 2 - box[0]), f0cy=float((f0[1] + f0[3]) / 2 - box[1]))) + ';')
print('box', box, 'frame0', f0, 'out', cw, ch)
