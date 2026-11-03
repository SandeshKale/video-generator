import sys
from PIL import Image
# usage: qcsheet.py out.png cols t1 t2 ... -> contact sheet of /tmp/scr/qcd/f_<t>.png at 360 wide
out,cols=sys.argv[1],int(sys.argv[2]); ts=sys.argv[3:]
ims=[Image.open('/tmp/scr/qcd/f_%s.png'%t).resize((360,640)) for t in ts]
rows=(len(ims)+cols-1)//cols; s=Image.new('RGB',(360*cols,640*rows))
for i,im in enumerate(ims): s.paste(im,((i%cols)*360,(i//cols)*640))
s.save(out); print(s.size)
