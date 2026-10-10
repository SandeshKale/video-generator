#!/usr/bin/env python3
"""Cut a T-pose character sheet (c1.png) into rig parts. Writes parts/<name>.png (RGBA, cropped) + parts.json
(for each part: offset in sheet, anchor a (joint start) and b (joint end) in sheet px). Polygons are hand-fitted to c1.png."""
import json, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi
H = os.path.dirname(os.path.abspath(__file__)); os.makedirs(H + '/parts', exist_ok=True)
im = Image.open(H + '/c1.png').convert('RGB'); a = np.asarray(im).astype(int); h, w = a.shape[:2]
# background: flood from the borders on colour distance to the border median
border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]); bg = np.median(border, axis=0)
dist = np.abs(a - bg).sum(2); cand = dist < 38
lab, n = ndi.label(cand); keep = np.zeros_like(cand)
for l in set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]):
    if l: keep |= lab == l
fg = ~keep & ~(dist < 24); fg = ndi.binary_opening(fg, iterations=1)
alpha = Image.fromarray((fg * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))
rgba = im.convert('RGBA'); rgba.putalpha(alpha); rgba.save(H + '/c1_cut.png')
M = lambda pts: [(2 * 416 - x, y) for x, y in pts]
L_up = [(185, 290), (360, 258), (372, 330), (335, 388), (190, 405)]
L_fo = [(60, 210), (215, 210), (290, 285), (285, 345), (195, 335), (150, 332), (70, 270)]
L_leg_u = [(330, 525), (420, 525), (418, 775), (335, 775)]; L_leg_l = [(335, 715), (420, 715), (420, 960), (385, 985), (275, 985), (280, 925), (330, 925)]
P = {
 'torso': ([(338, 215), (498, 215), (522, 330), (522, 548), (330, 548), (322, 330)], (415, 535), (415, 235)),
 'head': ([(335, 30), (497, 30), (497, 238), (335, 238)], (415, 225), (415, 110)),
 'upL': (L_up, (355, 295), (255, 315)), 'foL': (L_fo, (255, 310), (100, 245)),
 'upR': (M(L_up), (477, 295), (577, 315)), 'foR': (M(L_fo), (577, 310), (732, 245)),
 'thL': (L_leg_u, (385, 530), (378, 745)), 'shL': (L_leg_l, (378, 745), (340, 950)),
 'thR': (M(L_leg_u), (447, 530), (454, 745)), 'shR': (M(L_leg_l), (454, 745), (492, 950)),
}
meta = {}
for k, (poly, A, B) in P.items():
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).polygon(poly, fill=255)
    arr = np.asarray(rgba).copy(); arr[..., 3] = (np.asarray(m) / 255 * arr[..., 3]).astype('uint8')
    ys, xs = np.where(arr[..., 3] > 8); x0, x1, y0, y1 = xs.min() - 2, xs.max() + 3, ys.min() - 2, ys.max() + 3
    Image.fromarray(arr[y0:y1, x0:x1]).save(f'{H}/parts/{k}.png'); meta[k] = {'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0), 'a': [A[0] - int(x0), A[1] - int(y0)], 'b': [B[0] - int(x0), B[1] - int(y0)]}
json.dump(meta, open(H + '/parts.json', 'w'), indent=1); print({k: (v['w'], v['h']) for k, v in meta.items()})
# contact sheet of parts
sheet = Image.new('RGB', (1500, 560), (235, 228, 214)); x = 10
for k in P:
    p = Image.open(f'{H}/parts/{k}.png'); s = min(1, 250 / max(p.size)); p = p.resize((int(p.width * s), int(p.height * s))); sheet.paste(p, (x, 10), p); x += p.width + 12
sheet.save('/tmp/w/parts.png')
