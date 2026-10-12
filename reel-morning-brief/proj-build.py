# site/3d/proj.js: Blender-projected anchor points (bedroom clock face + window, hero clock dial) for the page.
import json
P = {'bedroom': json.load(open('site/3d/bedroom.json')), 'clock': json.load(open('site/3d/clock.json'))}
open('site/3d/proj.js', 'w').write('window.PROJ=' + json.dumps(P) + ';\n'); print(P)
