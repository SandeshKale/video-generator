import subprocess, glob, os, sys
from PIL import Image, ImageDraw
O = sys.argv[1] if len(sys.argv) > 1 else '/tmp/otpw_prev'; FPS = 12
os.system(f'rm -rf {O}; mkdir -p {O}')
T = [0.3,1.2,2.0,3.0,4.0,5.2,6.6,8.0,10.0,12.0,14.4,15.8,17.4,19.0,20.8,22.4,24.5,27,29.2,30.8,32.6,35,37.2,39.8,41.5,43.5,45.8,47.5,49.5,51.5,52.8,54.2,56,58.5,61,63.5,65.5]
for t in T:
    f = int(round(t * FPS)); subprocess.run(['python3', 'world.py', str(f), str(f), O, '270', '480', '4'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
fs = sorted(glob.glob(O + '/f*.png')); cols = 8; rows = (len(fs) + cols - 1) // cols; S = Image.new('RGB', (270 * cols, 480 * rows))
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB'); d = ImageDraw.Draw(im); d.text((6, 6), 't=%.1f' % (int(f[-8:-4]) / FPS), fill=(255, 255, 255)); S.paste(im, ((i % cols) * 270, (i // cols) * 480))
S.save(O + '/sheet.png'); print(len(fs))
