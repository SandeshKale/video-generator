#!/usr/bin/env python3
"""Fetch real ICESat-2 ATL03 photons over Adam's Bridge from NASA OpenAltimetry (no login).
Saves research/data/raw_<rgt>_<date>.json (all six beams, classes noise..high; lat, lon, WGS84 ellipsoid height)."""
import json,re,sys,urllib.request,os
BB=(79.20,9.05,79.95,9.35)   # minx,miny,maxx,maxy
H={'User-Agent':'video-generator-research/1.0 (educational explainer)'}
def get(u,t=120):
    return urllib.request.urlopen(urllib.request.Request(u,headers=H),timeout=t).read()
cmr=json.loads(get('https://cmr.earthdata.nasa.gov/search/granules.json?short_name=ATL03&version=007&bounding_box=%s,%s,%s,%s&page_size=2000'%(BB[0],BB[1],BB[2],BB[3])))['feed']['entry']
G=[]
for x in cmr:
    m=re.match(r'ATL03_(\d{4})(\d\d)(\d\d)(\d{6})_(\d{4})(\d\d)(\d\d)',x['title'])
    if m: G.append((int(m.group(5)),'%s-%s-%s'%m.group(1,2,3),m.group(4),int(m.group(6))))
want=[int(a) for a in sys.argv[1:]] or [523,81,150,1095]
os.makedirs('research/data',exist_ok=True)
for rgt,date,hms,cyc in sorted(G,key=lambda g:(g[0],g[1])):
    if rgt not in want: continue
    f='research/data/raw_%04d_%s.json'%(rgt,date)
    if os.path.exists(f): continue
    u='https://openaltimetry.earthdatacloud.nasa.gov/data/api/icesat2/atl03?date=%s&minx=%s&miny=%s&maxx=%s&maxy=%s&trackId=%d&beamName=gt1r&outputFormat=json&client=portal'%(date,BB[0],BB[1],BB[2],BB[3],rgt)
    try:
        b=get(u); open(f,'wb').write(b); print(f,len(b),flush=True)
    except Exception as e: print('fail',rgt,date,e,flush=True)
