#!/usr/bin/env python3
"""Copies the shared assets this reel uses into site/ (render.mjs serves only the site folder). python3 tools/prep.py"""
import os, shutil, json, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); A = R + '/../../../assets'; S = R + '/site'
os.makedirs(S + '/fonts', exist_ok=True); os.makedirs(S + '/img', exist_ok=True)
for src, dst in [('fonts/big-shoulders-display/big-shoulders-display-latin-800-normal.woff2', 'bigshoulders-800.woff2'), ('fonts/ibm-plex-mono/ibm-plex-mono-latin-600-normal.woff2', 'plexmono-600.woff2'), ('fonts/ibm-plex-mono/ibm-plex-mono-latin-700-normal.woff2', 'plexmono-700.woff2'), ('fonts/inter/inter-latin-800-normal.woff2', 'inter-800.woff2')]:
    shutil.copy(f'{A}/{src}', f'{S}/fonts/{dst}')
shutil.copy(A + '/animations/hud-parts/hud.js', S + '/hud.js'); shutil.copy(A + '/animations/caption-rig/captions.js', S + '/captions.js')
def inner(path):
    t = open(path).read(); t = re.sub(r'<svg[^>]*>', '', t, 1).replace('</svg>', ''); return t.strip()
ic = {n: inner(f'{A}/icons/tabler/{n}.svg') for n in ['clock', 'rocket', 'alert-triangle', 'device-mobile', 'map-pin', 'thumb-up', 'share', 'bell-ringing', 'check', 'x', 'flame', 'hourglass', 'target', 'wifi', 'flag', 'world', 'certificate', 'bolt']}
open(S + '/icons.js', 'w').write('window.IC=' + json.dumps(ic) + ';')
shutil.copy(R + '/../reel-quick-commerce-itna-jaldi/site/img/india-night.jpg', S + '/img/india-night.jpg')
if os.path.exists(S + '/img/phone.json'): open(S + '/phone.js', 'w').write('window.PHONE=' + open(S + '/img/phone.json').read() + ';')
print('prep ok')

# NOTE: sat.png is cropped to its alpha bbox after rendering (site/satdim.js holds its size)
