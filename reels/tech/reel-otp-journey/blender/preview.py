import subprocess, glob, os, sys
from PIL import Image, ImageDraw
O = sys.argv[1] if len(sys.argv) > 1 else '/tmp/otpw_prev'; FPS = 12
os.system(f'rm -rf {O}; mkdir -p {O}')
T = [float(x) for x in os.environ.get('TS','0.3,1.2,2.0,3.0,6.6,14.4,17.4,22.4,32.6,35,39.8,51.5,56,63.5').split(',')]
for t in T:
    f = int(round(t * FPS)); subprocess.run(['python3', 'world.py', str(f), str(f), O, '270', '480', '4'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
fs = sorted(glob.glob(O + '/f*.png')); cols = 8; rows = (len(fs) + cols - 1) // cols; S = Image.new('RGB', (270 * cols, 480 * rows))
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB'); d = ImageDraw.Draw(im); d.text((6, 6), 't=%.1f' % (int(f[-8:-4]) / FPS), fill=(255, 255, 255)); S.paste(im, ((i % cols) * 270, (i // cols) * 480))
S.save(O + '/sheet.png'); print(len(fs))
