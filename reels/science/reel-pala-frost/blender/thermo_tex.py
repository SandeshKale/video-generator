# face texture for a wall thermometer: scale -20..50 C, red column up to the reading
from PIL import Image, ImageDraw, ImageFont
import sys
def make(path, reading):
    W,H=360,1500; im=Image.new('RGB',(W,H),(238,236,228)); d=ImageDraw.Draw(im)
    try: f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',54); fs=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',40)
    except Exception: f=fs=ImageFont.load_default()
    y0,y1=1240,190   # y of -20 and 50
    Y=lambda c: y0+(y1-y0)*(c+20)/70
    d.rounded_rectangle((4,4,W-4,H-4),radius=40,outline=(150,146,138),width=6)
    for c in range(-20,51):
        y=Y(c); L=70 if c%10==0 else (46 if c%5==0 else 26)
        d.line((W/2+34,y,W/2+34+L,y),fill=(30,30,30),width=5 if c%10==0 else 3); d.line((W/2-34-L,y,W/2-34,y),fill=(30,30,30),width=5 if c%10==0 else 3)
        if c%10==0: d.text((W/2+112,y),str(c),font=f,fill=(20,20,20),anchor='lm')
    d.text((W/2,96),'°C',font=f,fill=(20,20,20),anchor='mm')
    d.rounded_rectangle((W/2-13,y1-40,W/2+13,y0+90),radius=13,fill=(250,250,250),outline=(170,170,170),width=3)
    d.rounded_rectangle((W/2-8,Y(reading),W/2+8,y0+100),radius=8,fill=(214,30,34))
    d.ellipse((W/2-44,y0+70,W/2+44,y0+158),fill=(214,30,34),outline=(150,20,20),width=3)
    im.save(path)
if __name__=='__main__': make(sys.argv[1], float(sys.argv[2]))
