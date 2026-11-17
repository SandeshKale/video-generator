import json,urllib.request,os,sys,time
UA={'User-Agent':'nerdlogic-reel-research/1.0'}
D=sys.argv[1]
def get(u,p):
    if os.path.exists(p) and os.path.getsize(p)>1000: return
    os.makedirs(os.path.dirname(p),exist_ok=True)
    for a in range(3):
        try: open(p,'wb').write(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=120).read()); return
        except Exception as e: print('retry',u,e); time.sleep(3)
def files(a): return json.loads(urllib.request.urlopen(urllib.request.Request('https://api.polyhaven.com/files/'+a,headers=UA),timeout=60).read())
for m in ['nettle_plant','weed_plant_02','periwinkle_plant','shrub_03','dandelion_01']:
    f=files(m)['gltf']; r='1k' if '1k' in f else sorted(f)[0]; g=f[r]['gltf']
    get(g['url'],f'{D}/{m}/{m}.gltf')
    for rel,inc in g.get('include',{}).items(): get(inc['url'],f'{D}/{m}/{rel}')
    print('model',m,r,flush=True)
for t in ['farm_furrows','farm_soil','brown_mud_02']:
    f=files(t)
    for k in f:
        if k in ('Diffuse','nor_gl','Rough','Displacement','AO','arm'):
            r=f[k].get('2k') or f[k][sorted(f[k])[0]]; j=r.get('jpg') or r.get('png')
            get(j['url'],f'{D}/tex/{t}_{k}.jpg')
    print('tex',t,list(f)[:8],flush=True)
for h in ['satara_night_no_lamps','rogland_clear_night','kloofendal_misty_morning','misty_dawn','bloem_field_sunrise']:
    f=files(h)['hdri']['2k']['hdr']; get(f['url'],f'{D}/hdri/{h}.hdr'); print('hdri',h,flush=True)
    t=files(h).get('tonemapped'); 
    if t: get(t['url'],f'{D}/hdri/{h}.jpg')
