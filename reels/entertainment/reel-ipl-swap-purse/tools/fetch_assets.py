#!/usr/bin/env python3
"""Fetch the licence-checked IPL reel photos from Wikimedia Commons, one request at a time with backoff on HTTP 429.
Reads research/photos/SOURCES.json (written by the licence check: title, url, licence, artist, size, sha1), saves each file under
research/photos/, verifies size and sha1, and writes research/photos/CREDITS.md. Run: python3 tools/fetch_assets.py"""
import hashlib, json, os, re, sys, time, urllib.request
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); D = R + '/research/photos'
UA = 'nerdlogic-research/1.0 (reel asset fetch; github.com/SandeshKale/video-generator)'
SRC = json.load(open(D + '/SOURCES.json'))
SHORT = {'Prime Minister Of Bharat Shri Narendra Damodardas Modi with Shri Hardik Pandya': 'hardik-pmo', 'Prime Minister Of Bharat Shri Narendra Damodardas Modi with Arshdeep Singh': 'arshdeep-pmo',
 'Jasprit Bumrah Narendra Modi 2024': 'bumrah-pmo', 'Prime Minister Of Bharat Shri Narendra Damodardas Modi with Shri Rishabh Pant': 'pant-pmo', 'Shreyas Iyer snapped at the airport': 'iyer-bh',
 'Cricketer Ricky Ponting (24079181379)': 'ponting-tv', 'Preity Zinta at IPL Players Auction': 'auction-bh', 'Wankhede Stadium as seen from Marine Lines, Mumbai': 'wankhede-dh', 'Narendra Modi Stadium Ahmedabad': 'ahmedabad-cc0'}
def slug(title): return SHORT[re.sub(r'^File:|\.\w+$', '', title)]
for s in SRC:
    out = f"{D}/{slug(s['title'])}.jpg"
    if os.path.exists(out) and os.path.getsize(out) > 10000: print('ok', os.path.basename(out)); continue
    url = s['url']
    if s['w'] > 1920:   # Wikimedia asks for standard thumbnail widths; 1920 px is plenty for a 1080 px canvas
        base, name = url.rsplit('/', 1); url = base.replace('/commons/', '/commons/thumb/') + '/' + name + '/1920px-' + name
    for att in range(8):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA}); data = urllib.request.urlopen(req, timeout=90).read(); break
        except Exception as e:
            wait = 45 * (att + 1); print('retry', s['title'][:40], e, f'wait {wait}s'); time.sleep(wait)
    else: sys.exit('failed ' + s['title'])
    if s['w'] <= 1920 and hashlib.sha1(data).hexdigest() != s['sha1']: sys.exit('sha1 mismatch ' + s['title'])
    open(out, 'wb').write(data); print('saved', os.path.basename(out), len(data) // 1024, 'KB'); time.sleep(8)
L = ['# Photo credits (licence read on each Commons file page, 18 Nov 2026)', '']
for s in SRC:
    L.append(f"- **{slug(s['title'])}.jpg** — {s['title'][5:]} — {s['artist']} — {s['licence']}" + (f" ({s['licence_url']})" if s['licence_url'] else '') + f" — {s['w']}x{s['h']} — {s['page']}")
L += ['', 'GODL-India: commercial use and adaptation allowed with attribution and the source URL; do not imply government endorsement; no emblems or logos.', 'CC BY: credit author, title and licence, and state that the image was cropped/edited.', 'CC0: no credit required.']
open(D + '/CREDITS.md', 'w').write('\n'.join(L) + '\n'); print('credits written')
