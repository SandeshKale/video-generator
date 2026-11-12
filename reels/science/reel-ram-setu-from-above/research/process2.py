#!/usr/bin/env python3
"""v2 seabed estimator: per 60 m along-track bin, depth of the contiguous above-background photon layer under the sea surface
(apparent depth / 1.34), median-filtered along track. Also writes per-pass land (above-sea) photon fraction.
Output: data/seabed.json {pass: {ss, pts:[[lat,lon,depth_m,conf],..]}}"""
import json,glob,os,numpy as np
from scipy.ndimage import median_filter
OUT={}
def sea(h):
    hh=h[(h>-100)&(h<-92)]
    if len(hh)<300: return None
    H,e=np.histogram(hh,bins=np.arange(-100,-92,0.1)); return e[H.argmax()]+0.05
for f in sorted(glob.glob('data/raw_*.json')):
    try: d=json.load(open(f))
    except Exception: continue
    if not d: continue
    rid=os.path.basename(f)[4:-5]
    for t in d:
        P=[]
        for s in t['series']:
            if s['name'] in('Noise','N/A'): continue
            P+=s['data']
        if len(P)<800: continue
        P=np.array(P);lat,lon,h=P.T
        ss=sea(h)
        if ss is None: continue
        o=np.argsort(lat);lat,lon,h=lat[o],lon[o],h[o]
        y=(lat-9.2)*111320.0
        dep=(ss-h)/1.34
        pts=[]
        for b0 in np.arange(y.min(),y.max(),60.0):
            m=(y>=b0)&(y<b0+60)
            if m.sum()<60: continue
            dd=dep[m]
            edges=np.arange(0.5,32,0.3);H,_=np.histogram(dd,bins=edges)
            bg=np.median(H[-30:]);thr=bg+3*np.sqrt(bg+1)+2
            k=0
            while k<len(H) and H[k]>thr: k+=1
            # skip if surface layer itself empty
            if k==0 or H[:2].sum()<8: continue
            pts.append([float(lat[m].mean()),float(lon[m].mean()),float(edges[k]),int(H[:k].sum())])
        if len(pts)<10: continue
        pts=np.array(pts);pts[:,2]=median_filter(pts[:,2],size=5,mode='nearest')
        OUT['%s_%s'%(rid,t['beam_name'])]={'ss':float(ss),'pts':np.round(pts,5).tolist()}
json.dump(OUT,open('data/seabed.json','w'))
print(len(OUT))
