import sys
from PIL import Image
# usage: mocksheet.py out.png prefix n  -> row of /tmp/scr/mock/<prefix>_<i>.png
out,pre,n=sys.argv[1],sys.argv[2],int(sys.argv[3])
ims=[Image.open('/tmp/scr/mock/%s_%d.png'%(pre,i+1)).resize((540,960)) for i in range(n)]
s=Image.new('RGB',(540*n,960))
for i,im in enumerate(ims): s.paste(im,(i*540,0))
s.save(out)
