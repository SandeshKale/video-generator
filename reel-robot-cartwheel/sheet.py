import sys
from PIL import Image
files=sys.argv[2:];w=int(sys.argv[1]);ims=[Image.open(f).convert('RGB') for f in files]
h=int(1920*w/1080);sheet=Image.new('RGB',(w*len(ims),h),'white')
for i,im in enumerate(ims): sheet.paste(im.resize((w,h)),(i*w,0))
sheet.save('sheet.png')
