#!/usr/bin/env python3
"""India Google Trends check for topic picking (added 16 Oct 2026).
  python3 scripts/gtrends_in.py rss                      # current top ~10 daily trends (public RSS, only 200+/500+ buckets)
  python3 scripts/gtrends_in.py compare "Jailer 2" "Drishyam 3" ...   # relative interest, 7 days hourly (max 5 terms per call)
  python3 scripts/gtrends_in.py ytcharts                 # YouTube Charts India weekly: top songs/videos + biggest risers
The compare mode uses pytrends (pip install pytrends). Google answers 429 after a few calls from this sandbox: keep it to one or two
calls, wait 10+ minutes before retrying, and note that values are relative to the highest term in the same call only."""
import sys, urllib.request, xml.etree.ElementTree as ET
NS = {'ht': 'https://trends.google.com/trending/rss'}
def rss():
    req = urllib.request.Request('https://trends.google.com/trending/rss?geo=IN', headers={'User-Agent': 'Mozilla/5.0'})
    root = ET.fromstring(urllib.request.urlopen(req, timeout=30).read())
    for it in root.iter('item'):
        tr = it.find('ht:approx_traffic', NS); n = it.find('ht:news_item/ht:news_item_title', NS)
        print(it.find('title').text, '|', tr.text if tr is not None else '', '|', (n.text[:90] if n is not None else ''))
def compare(terms):
    from pytrends.request import TrendReq
    p = TrendReq(hl='en-IN', tz=330, timeout=(10, 30)); p.build_payload(terms[:5], geo='IN', timeframe='now 7-d')
    d = p.interest_over_time()
    print('7-day mean :', d[terms[:5]].mean().round(1).to_dict()); print('last 24 h  :', d[terms[:5]].iloc[-24:].mean().round(1).to_dict())
def ytcharts():
    import json
    body = {"context": {"client": {"clientName": "WEB_MUSIC_ANALYTICS", "clientVersion": "2.0", "hl": "en", "gl": "IN"}}, "browseId": "FEmusic_analytics_charts_home",
            "query": "perspective=CHART&chart_params_country_code=in&chart_params_chart_type=TRACKS&chart_params_period_type=WEEKLY"}
    req = urllib.request.Request('https://charts.youtube.com/youtubei/v1/browse?alt=json', data=json.dumps(body).encode(), headers={
        'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://charts.youtube.com/', 'Origin': 'https://charts.youtube.com'})
    d = json.load(urllib.request.urlopen(req, timeout=30)); c = d['contents']['sectionListRenderer']['contents'][0]['musicAnalyticsSectionRenderer']['content']
    print('period:', c['perspectiveMetadata']['entityId'])
    for key, sub in (('trackTypes', 'trackViews'), ('videos', 'videoViews')):
        rows = c[key][0][sub]; print('==', key)
        for e in rows[:10]:
            m = e['chartEntryMetadata']; print(' ', m['currentPosition'], m.get('previousPosition'), (e.get('name') or e.get('title') or '').strip(), [a.get('name') for a in e.get('artists', [])][:2], e['viewCount'], 'wks', m.get('periodsOnChart'), 'chg', m.get('percentViewsChange'))
    print('== risers (tracks)')
    rr = sorted([e for e in c['trackTypes'][0]['trackViews'] if e['chartEntryMetadata'].get('percentViewsChange') is not None], key=lambda e: -e['chartEntryMetadata']['percentViewsChange'])[:8]
    for e in rr: print(' ', f"{e['chartEntryMetadata']['percentViewsChange']*100:+.0f}%", e['name'].strip(), e['viewCount'])
if __name__ == '__main__':
    a = sys.argv[1] if len(sys.argv) > 1 else 'rss'
    rss() if a == 'rss' else ytcharts() if a == 'ytcharts' else compare(sys.argv[2:])
