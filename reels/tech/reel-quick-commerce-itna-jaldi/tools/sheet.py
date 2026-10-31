import sys
from PIL import Image
ts=sys.argv[2:]; out=sys.argv[1]; n=len(ts); cols=min(6,n); rows=(n+cols-1)//cols; w,h=360,640
W=Image.new('RGB',(w*cols,h*rows),'black')
for i,t in enumerate(ts): W.paste(Image.open(f'/tmp/scr/qc/f_{t}.png').resize((w,h)),((i%cols)*w,(i//cols)*h))
W.save(out)
