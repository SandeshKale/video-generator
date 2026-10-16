#!/usr/bin/env python3
"""Search Wikimedia Commons for freely licensed photos and print candidates with licence + author (only CC BY / CC BY-SA / CC0 / public domain).
  python3 tools/commons.py "Rajinikanth" [limit]      -> list
  python3 tools/commons.py --get "File:Name.jpg" out.jpg 1400   -> download a 1400 px wide copy + append credit to photos/credits.jsonl
Commons asks for a descriptive User-Agent and polite rates; this sleeps between calls."""
import sys, json, time, urllib.parse, urllib.request, re, os
UA = {'User-Agent': 'reel-research/1.0 (kale.sd111@gmail.com)'}
API = 'https://commons.wikimedia.org/w/api.php'
OK = re.compile(r'^(cc[- ]by(-sa)?[- ]\d|cc0|public domain|pd)', re.I)
def call(**p):
    p['format'] = 'json'; url = API + '?' + urllib.parse.urlencode(p)
    for i in range(4):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))
        except Exception as e: time.sleep(6 + 6 * i)
    raise SystemExit('commons api failed')
def info(titles, width=1400):
    d = call(action='query', titles='|'.join(titles), prop='imageinfo', iiprop='url|extmetadata|size', iiurlwidth=width)
    out = []
    for pg in d['query']['pages'].values():
        ii = (pg.get('imageinfo') or [{}])[0]; md = ii.get('extmetadata', {})
        g = lambda k: re.sub('<[^>]+>', '', md.get(k, {}).get('value', '')).strip()
        out.append(dict(title=pg['title'], lic=g('LicenseShortName'), author=g('Artist'), credit=g('Credit')[:80], w=ii.get('width'), h=ii.get('height'), thumb=ii.get('thumburl'), page=ii.get('descriptionurl'), desc=g('ImageDescription')[:90]))
    return out
def search(q, limit=12):
    d = call(action='query', list='search', srsearch=q, srnamespace=6, srlimit=limit)
    titles = [s['title'] for s in d['query']['search']]
    res = []
    for i in range(0, len(titles), 8): res += info(titles[i:i + 8]); time.sleep(2)
    return [r for r in res if OK.match(r['lic'] or '') and (r['w'] or 0) >= 700]
if __name__ == '__main__':
    if sys.argv[1] == '--get':
        r = info([sys.argv[2]], int(sys.argv[4]) if len(sys.argv) > 4 else 1400)[0]
        urllib.request.urlretrieve(r['thumb'], sys.argv[3]) if False else open(sys.argv[3], 'wb').write(urllib.request.urlopen(urllib.request.Request(r['thumb'], headers=UA), timeout=60).read())
        open(os.path.join(os.path.dirname(sys.argv[3]) or '.', 'credits.jsonl'), 'a').write(json.dumps(dict(file=os.path.basename(sys.argv[3]), title=r['title'], lic=r['lic'], author=r['author'], page=r['page'])) + '\n'); print('saved', r['title'], r['lic'], '|', r['author'])
    else:
        for r in search(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 12): print(f"{r['title']} | {r['lic']} | {r['w']}x{r['h']} | {r['author'][:40]} | {r['desc'][:60]}")
