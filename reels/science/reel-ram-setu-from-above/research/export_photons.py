#!/usr/bin/env python3
"""Compact real ICESat-2 photons for the page: picks the densest cycle per ground track, keeps photons (classes Low..High) in the strait window,
height above the local sea surface (cm), writes site3d2/photons.js (base64 uint16 lon,lat + int16 h_cm + uint8 beam/track id) and a stats json."""
import json,glob,os,base64,numpy as np
BB=(79.15,9.00,80.00,9.40)
best={}
for f in glob.glob('research/data/raw_*.json'):
    b=os.path.basename(f)[4:-5];rgt=b[:4]
    n=os.path.getsize(f)
    if n<3e6: continue
    best.setdefault(rgt,[]).append((n,f))
sel=[]
for r,l in best.items():
    l.sort(reverse=True)
    sel.append((r,l[0][1]))
rng=np.random.default_rng(3)
OUT=[];stats={'tracks':{}}
tid=0
for r,f in sorted(sel):
    d=json.load(open(f));date=os.path.basename(f)[9:-5]
    for t in d:
        P=[]
        for s in t['series']:
            if s['name'] in('Noise','N/A','Buffer'):continue
            P+=s['data']
        if len(P)<500:continue
        P=np.array(P);lat,lon,h=P.T
        m=(lat>=BB[1])&(lat<=BB[3])&(lon>=BB[0])&(lon<=BB[2])&(h>-130)&(h<-80)
        P=P[m]
        if len(P)<500:continue
        hh=P[:,2];hist,e=np.histogram(hh[(hh>-100)&(hh<-92)],bins=np.arange(-100,-92,.1));ss=e[hist.argmax()]+.05
        keep=rng.choice(len(P),min(len(P),9000),replace=False)
        Q=P[keep]
        OUT.append((Q[:,1],Q[:,0],(Q[:,2]-ss)*100,np.full(len(Q),tid)))
        stats['tracks'][str(tid)]=dict(rgt=r,date=date,beam=t['beam_name'],n_in_window=int(m.sum()),kept=int(len(Q)),sea_surface_m=round(float(ss),2))
        tid+=1
lon=np.concatenate([o[0] for o in OUT]);lat=np.concatenate([o[1] for o in OUT]);h=np.concatenate([o[2] for o in OUT]);ti=np.concatenate([o[3] for o in OUT])
u=np.round((lon-BB[0])/(BB[2]-BB[0])*65535).astype('<u2');v=np.round((lat-BB[1])/(BB[3]-BB[1])*65535).astype('<u2');hc=np.clip(h,-3000,3000).astype('<i2');ti=ti.astype('u1')
raw=u.tobytes()+v.tobytes()+hc.tobytes()+ti.tobytes()
open('site3d2/photons.js','w').write('window.PHN=%d;window.PHB64="%s";window.PHBB=%s;'%(len(u),base64.b64encode(raw).decode(),json.dumps(BB)))
stats['points']=int(len(u));stats['window_photons_total']=int(sum(t['n_in_window'] for t in stats['tracks'].values()))
json.dump(stats,open('research/photon_stats.json','w'),indent=1);print(stats['points'],len(raw)/1e6,'MB raw',stats['window_photons_total'],'photons in window (selected cycles)');print(json.dumps(stats['tracks'])[:600])
