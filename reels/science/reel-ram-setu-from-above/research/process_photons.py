#!/usr/bin/env python3
"""Real ICESat-2 ATL03 photons -> seabed profiles across Adam's Bridge.
Per (track,date,beam): keep photons (lat,lon,ellipsoid h) of all confidence classes in the water-column window,
estimate sea surface (mode of dense photons), then a seabed per 30 m along-track bin = lowest dense mode below the surface.
Depth = apparent depth / 1.34 (refraction, near-nadir). Writes data/profiles.json + data/photons_<id>.npy (subset for the 3D cloud)."""
import json,glob,os,sys,numpy as np
OUT={}
def sea(h):
    hh=h[(h>-100)&(h<-92)]
    if len(hh)<200: return None
    H,e=np.histogram(hh,bins=np.arange(-100,-92,0.1)); return (e[H.argmax()]+0.05)
for f in sorted(glob.glob('data/raw_*.json')):
    try: d=json.load(open(f))
    except Exception: continue
    if not d: continue
    rid=os.path.basename(f)[4:-5]
    for t in d:
        P=[];C=[]
        for s in t['series']:
            if s['name'] in('Noise','N/A'): continue
            P+=s['data'];C+=[{'Buffer':1,'Low':2,'Medium':3,'High':4}[s['name']]]*len(s['data'])
        if len(P)<500: continue
        P=np.array(P);C=np.array(C);lat,lon,h=P.T
        ss=sea(h)
        if ss is None: continue
        # along track by latitude (tracks run ~N-S): metres
        y=(lat-9.2)*111320.0
        o=np.argsort(y);y=y[o];lon=lon[o];lat=lat[o];h=h[o];C=C[o]
        bins=np.arange(y.min(),y.max(),30.0)
        prof=[]
        for b0 in bins:
            m=(y>=b0)&(y<b0+30)
            if m.sum()<12: continue
            dep=(ss-h[m])/1.34   # + below surface
            w=(dep>0.6)&(dep<30)
            if w.sum()<8: continue
            H,e=np.histogram(dep[w],bins=np.arange(0.6,30,0.4))
            k=H.argmax()
            if H[k]<5: continue
            # seabed = peak depth; surface density for contrast
            nsurf=((dep>-0.6)&(dep<=0.6)).sum()
            prof.append([round(float(lat[m].mean()),5),round(float(lon[m].mean()),5),round(float(e[k]+0.2),2),int(H[k]),int(nsurf)])
        if len(prof)>8:
            OUT['%s_%s'%(rid,t['beam_name'])]={'ss':round(float(ss),2),'n':int(len(P)),'prof':prof}
json.dump(OUT,open('data/profiles.json','w'))
print(len(OUT),'beam-passes with seabed estimates')
for k,v in list(OUT.items())[:5]: print(k,v['ss'],len(v['prof']))
