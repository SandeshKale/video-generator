import numpy as np, cv2, json, sys
src=cv2.imread('/home/user/video-generator/reel-app/public/profile.jpg')
X0,Y0,W,H=500,720,460,380   # working region (source px)
reg=src[Y0:Y0+H,X0:X0+W].copy()
def P(x,y): return np.array([x-X0,y-Y0],np.float32)
# (name, x, y, jaw_follow) control points: follow = fraction of jaw drop d they move with
CP=[('nose',730,715,0),('cheekL',575,765,0),('cheekR',885,765,0),('mouL',600,750,0),('mouR',860,750,0),('mou',730,752,0),
    ('upL',690,791,0),('upR',770,791,0),('up',730,788,-.04),
    ('cL',628,797,.0),('cR',826,797,.0),
    ('lowL',680,822,.9),('lowR',780,822,.9),('low',730,829,.95),('lowCL',650,812,.45),('lowCR',806,812,.45),
    ('goat',730,858,.9),('chin',730,990,.8),('jawL',575,930,.3),('jawR',885,930,.3),('neck',730,1070,.05),('neckL',620,1060,.05),('neckR',840,1060,.05),('edgeL',512,900,0),('edgeR',948,900,0)]
def warp(d,wf):
    p=np.array([[x-X0,y-Y0] for _,x,y,_ in CP],np.float32)
    q=p.copy()
    for i,(n,x,y,f) in enumerate(CP):
        q[i,1]+=d*f
        if n=='cL': q[i,0]+= (1-wf)*60*1.0
        if n=='cR': q[i,0]-= (1-wf)*60*1.0
        if n in('lowCL','low L'): pass
    # backward MLS (affine): for each output pixel v find source via weights on q (dest) -> p (source)
    gx,gy=np.meshgrid(np.arange(W,dtype=np.float32),np.arange(H,dtype=np.float32))
    v=np.stack([gx,gy],-1).reshape(-1,2)
    d2=((v[:,None,:]-q[None])**2).sum(-1)+1e-3
    w=1.0/d2**1.2
    ws=w.sum(1,keepdims=True)
    qs=(w[:,:,None]*q[None]).sum(1)/ws; ps=(w[:,:,None]*p[None]).sum(1)/ws
    qh=q[None]-qs[:,None]; ph=p[None]-ps[:,None]
    # affine: M = (sum w qh^T qh)^-1 (sum w qh^T ph)
    A=np.einsum('ni,nij,nik->njk',w,qh,qh); B=np.einsum('ni,nij,nik->njk',w,qh,ph)
    A+=np.eye(2)[None]*1e-4
    M=np.linalg.solve(A,B)
    vs=np.einsum('nj,njk->nk',v-qs,M)+ps
    mx=vs[:,0].reshape(H,W).astype(np.float32); my=vs[:,1].reshape(H,W).astype(np.float32)
    return cv2.remap(reg,mx,my,cv2.INTER_CUBIC,borderMode=cv2.BORDER_REFLECT)
SH={'X':(0,1,0,0),'A':(0,1,0,0),'B':(9,1,.9,0),'C':(22,.95,.7,.5),'D':(36,1,.55,.8),'E':(18,.78,.4,.3),'F':(13,.58,0,0),'G':(7,1,1,0),'H':(16,.92,.5,1)}
def interior(img,d,wf,teeth,tongue):
    if d<1.5: return img
    cx,cy=730-X0,797-Y0
    rx=int(64*wf+d*.18); top=cy-1; bot=int(cy+d*.98+3)
    m=np.zeros(img.shape[:2],np.float32)
    cv2.ellipse(m,(cx,(top+bot)//2),(rx,max(2,(bot-top)//2)),0,0,360,1,-1)
    m=cv2.GaussianBlur(m,(0,0),1.3)
    yy=np.linspace(0,1,img.shape[0])[:,None,None]
    col=np.zeros_like(img,np.float32); col[:]=(20,14,16)  # BGR dark
    # gradient + warmer toward the bottom
    grad=np.clip((np.arange(img.shape[0])[:,None]-top)/max(1,(bot-top)),0,1)
    col[:,:,2]+=grad*28; col[:,:,1]+=grad*6
    out=img.astype(np.float32)
    # teeth (upper)
    if teeth>.05:
        th=min(14,d*.38+3); tm=np.zeros(img.shape[:2],np.float32)
        cv2.ellipse(tm,(cx,top+int(th*.5)),(int(rx*.8),int(th*.55)),0,0,360,1,-1); tm=cv2.GaussianBlur(tm,(0,0),1.0)*teeth
        tc=np.zeros_like(col); tc[:]=(205,215,228)
        col=col*(1-tm[...,None])+tc*tm[...,None]
    if tongue>.05:
        tm=np.zeros(img.shape[:2],np.float32)
        cv2.ellipse(tm,(cx,bot-int(d*.18)-2),(int(rx*.55),max(2,int(d*.16))),0,0,360,1,-1); tm=cv2.GaussianBlur(tm,(0,0),1.6)*tongue*.85
        tc=np.zeros_like(col); tc[:]=(72,58,128)
        col=col*(1-tm[...,None])+tc*tm[...,None]
    # soft inner shadow at top edge
    out=out*(1-m[...,None])+col*m[...,None]
    return out.clip(0,255).astype(np.uint8)
for k,(d,wf,t,g) in SH.items():
    im=warp(d,wf) if d>0 else reg.copy()
    im=interior(im,d,wf,t,g)
    cv2.imwrite(f'v_{k}.png',im)
print('done')
