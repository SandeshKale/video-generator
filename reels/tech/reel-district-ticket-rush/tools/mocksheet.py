import sys
from PIL import Image
out=sys.argv[1]; names=sys.argv[2:]
ims=[Image.open('/tmp/scr/dmock/%s.png'%n).resize((540,960)) for n in names]
s=Image.new('RGB',(540*len(ims),960))
for i,im in enumerate(ims): s.paste(im,(i*540,0))
s.save(out); print(s.size)
