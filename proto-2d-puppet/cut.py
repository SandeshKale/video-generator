#!/usr/bin/env python3
"""Cut a T-pose character sheet (e_22.png) into rig parts. Writes parts/<name>.png (RGBA, cropped) + parts.json
(for each part: offset in sheet, anchor a (joint start) and b (joint end) in sheet px). Polygons are hand-fitted to e_22.png."""
import json, os, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi
H = os.path.dirname(os.path.abspath(__file__)); os.makedirs(H + '/parts', exist_ok=True)
im = Image.open(H + '/e_22.png').convert('RGB'); a = np.asarray(im).astype(int); h, w = a.shape[:2]
# background: flood from the borders on colour distance to the border median
border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]); bg = np.median(border, axis=0)
dist = np.abs(a - bg).sum(2); mx = a.max(2); mn = a.min(2); cand = ((mx - mn) < 24) & (mn > 135)
lab, n = ndi.label(cand); keep = np.zeros_like(cand)
for l in set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]):
    if l: keep |= lab == l
fg = ~keep; fg = ndi.binary_opening(fg, iterations=1)
alpha = Image.fromarray((fg * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))
rgba = im.convert('RGBA'); rgba.putalpha(alpha); rgba.save(H + '/e22_cut.png')
M = lambda pts: [(1200 - x, y) for x, y in pts]
L_up = [(488, 245), (545, 255), (520, 430), (415, 440), (430, 330)]
L_fo = [(405, 415), (522, 415), (505, 515), (492, 535), (492, 620), (420, 620), (415, 525)]
L_leg_u = [(512, 500), (602, 500), (600, 765), (516, 765)]; L_leg_l = [(516, 700), (602, 700), (600, 885), (578, 915), (466, 950), (476, 892), (516, 880)]
P = {
 'torso': ([(500, 205), (700, 205), (692, 300), (690, 508), (510, 508), (508, 300)], (600, 495), (600, 215)),
 'head': ([(528, 42), (672, 42), (672, 210), (528, 210)], (600, 200), (600, 125)),
 'upL': (L_up, (505, 265), (445, 425)), 'foL': (L_fo, (445, 425), (452, 608)),
 'upR': (M(L_up), (695, 265), (755, 425)), 'foR': (M(L_fo), (755, 425), (748, 608)),
 'thL': (L_leg_u, (550, 500), (548, 745)), 'shL': (L_leg_l, (548, 745), (535, 885)),
 'thR': (M(L_leg_u), (650, 500), (652, 745)), 'shR': (M(L_leg_l), (652, 745), (665, 885)),
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
