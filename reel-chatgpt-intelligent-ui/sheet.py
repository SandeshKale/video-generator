import sys
from PIL import Image
ts=sys.argv[1:]; n=len(ts); cols=min(n,4); rows=(n+cols-1)//cols; w,h=405,720
W=Image.new('RGB',(cols*w,rows*h),'white')
for i,t in enumerate(ts): W.paste(Image.open(f'/tmp/rc/f_{t}.png').resize((w,h)),((i%cols)*w,(i//cols)*h))
W.save('/tmp/rc/sheet.png')
