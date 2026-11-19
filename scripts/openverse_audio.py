#!/usr/bin/env python3
"""Search and download commercially usable audio from the Openverse API (anonymous, works from this sandbox; openverse.org itself is behind Cloudflare).
usage: python3 scripts/openverse_audio.py search "whoosh" [--n 8] [--cat sound_effect|music] [--max-dur 6]
       python3 scripts/openverse_audio.py get <id> <out_dir>      # downloads the file, appends a credit line to <out_dir>/CREDITS.md
Only licences usable commercially without NonCommercial/NoDerivatives are returned (cc0, pdm, by, by-sa). By/By-SA need the credit line in the caption
(the CREDITS.md line is formatted for pasting). Re-check the licence on the landing page before posting."""
import sys, json, os, re, urllib.request, urllib.parse, time
UA = {'User-Agent': 'nerdlogic-reel-research/1.0 (educational)'}
API = 'https://api.openverse.org/v1/audio/'
def call(url):
    for k in range(4):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()
        except Exception as e:
            if k == 3: raise
            time.sleep(2 + 3 * k)
def search(q, n=8, cat=None, max_dur=None):
    p = {'q': q, 'license_type': 'commercial', 'page_size': 20, 'mature': 'false'}
    if cat: p['category'] = cat
    d = json.loads(call(API + '?' + urllib.parse.urlencode(p)))
    out = []
    for r in d['results']:
        if r['license'] in ('by-nd', 'by-nc', 'by-nc-sa', 'by-nc-nd', 'nc', 'nd'): continue
        dur = (r.get('duration') or 0) / 1000
        if max_dur and dur > max_dur: continue
        out.append(r)
    return out[:n]
def credit(r):
    lic = r['license'].upper() + ' ' + (r.get('license_version') or '')
    return f"- \"{r['title']}\" by {r.get('creator') or 'unknown'} ({r.get('source') or ''}), {lic.strip()}: {r.get('foreign_landing_url')}"
if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    if a[0] == 'search':
        n = int(a[a.index('--n') + 1]) if '--n' in a else 8; cat = a[a.index('--cat') + 1] if '--cat' in a else None; md = float(a[a.index('--max-dur') + 1]) if '--max-dur' in a else None
        for r in search(a[1], n, cat, md): print(r['id'], '|', r['title'][:50], '|', r['license'], '|', f"{(r.get('duration') or 0)/1000:.1f}s", '|', r.get('category'), '|', r.get('creator'))
    elif a[0] == 'get':
        r = json.loads(call(API + a[1] + '/')); os.makedirs(a[2], exist_ok=True)
        ext = os.path.splitext(urllib.parse.urlparse(r['url']).path)[1] or '.mp3'; f = os.path.join(a[2], re.sub(r'[^a-z0-9]+', '-', r['title'].lower())[:40].strip('-') + '-' + a[1][:6] + ext)
        open(f, 'wb').write(call(r['url'])); open(os.path.join(a[2], 'CREDITS.md'), 'a').write(credit(r) + '\n'); print(f); print(credit(r))
