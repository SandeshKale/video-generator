#!/usr/bin/env python3
"""Copies the shared assets this reel uses into site/ (render.mjs serves only the site folder) and derives India-night data. Run once: python3 tools/prep.py"""
import os, shutil, json, re, numpy as np
from PIL import Image, ImageFilter
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); A = R + '/../../../assets'; S = R + '/site'
os.makedirs(S + '/fonts', exist_ok=True); os.makedirs(S + '/img', exist_ok=True)
for src, dst in [('fonts/antonio/antonio-latin-700-normal.woff2', 'antonio-700.woff2'), ('fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2', 'jbmono-700.woff2'), ('fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2', 'jbmono-500.woff2'), ('fonts/inter/inter-latin-800-normal.woff2', 'inter-800.woff2')]:
    shutil.copy(f'{A}/{src}', f'{S}/fonts/{dst}')
shutil.copy(A + '/animations/hud-parts/hud.js', S + '/hud.js'); shutil.copy(A + '/animations/caption-rig/captions.js', S + '/captions.js')
shutil.copy(R + '/../../../prototypes/reel-app/public/profile.jpg', S + '/img/profile.jpg')
def svg_inner(path):
    t = open(path).read(); t = re.sub(r'<svg[^>]*>', '', t, 1).replace('</svg>', ''); return t.strip()
ic = {}
for n in ['gauge', 'package', 'device-mobile', 'currency-rupee', 'map-pin', 'clock', 'thumb-up', 'share', 'trending-down', 'check', 'x', 'bolt', 'bell-ringing', 'alert-triangle', 'calendar', 'chart-bar']:
    ic[n] = svg_inner(f'{A}/icons/tabler/{n}.svg')
for n in ['building-storefront', 'shopping-bag']:
    p = f'{A}/icons/heroicons/outline/{n}.svg'
    if os.path.exists(p): ic['h-' + n] = svg_inner(p)
open(S + '/icons.js', 'w').write('window.IC=' + json.dumps(ic) + ';')
# India night crop (Black Marble, NASA, public domain) + city-light peaks (positions where the real lights are brightest) for the "store" dots
im = Image.open(A + '/space/earth/black-marble-2012-8192.jpg').convert('L'); W, H = im.size
def px(lon, lat): return ((lon + 180) / 360 * W, (90 - lat) / 180 * H)
x0, y0 = px(66, 38); x1, y1 = px(99, 4); c = im.crop((int(x0), int(y0), int(x1), int(y1))); cw, ch = c.size
a = np.asarray(c.filter(ImageFilter.GaussianBlur(2)), dtype=np.float32); pts = []
from scipy.ndimage import maximum_filter
mx = (a == maximum_filter(a, size=7)) & (a > 70); ys, xs = np.nonzero(mx); order = np.argsort(-a[ys, xs]); rng = np.random.default_rng(3)
sel = [(float(xs[i]) / cw, float(ys[i]) / ch) for i in order[:520]]; rng.shuffle(sel)
json.dump(sel, open(S + '/dots.json', 'w'))
Image.open(A + '/space/earth/black-marble-2012-8192.jpg').crop((int(x0), int(y0), int(x1), int(y1))).resize((1080, int(1080 * ch / cw)), Image.LANCZOS).save(S + '/img/india-night.jpg', quality=88)
open(S + '/dots.js', 'w').write('window.DOTS=' + json.dumps([[round(x, 4), round(y, 4)] for x, y in sel]) + ';')
print('prep ok', len(sel), 'dots', (cw, ch))
if os.path.exists(S + '/img/phone.json'): open(S + '/phone.js', 'w').write('window.PHONE=' + open(S + '/img/phone.json').read() + ';')
