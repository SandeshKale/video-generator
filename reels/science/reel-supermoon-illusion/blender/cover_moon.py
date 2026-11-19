"""Cover hero: one big lit Moon sphere (NASA CGI Moon Kit colour map) on black, rendered with Cycles. usage: python3 cover_moon.py OUT.png"""
import sys, os
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'film.py')).read(); head = src[:src.index('def parent_cam')]
OUTP = sys.argv[1]; sys.argv = ['x', 'GHAT', '0', '1', '12', '/tmp/moon/cv', '1080', '1080', '48']
exec(head, globals())
import math
sc = setup('02030c', .0)
sun((78, 0, 14), 4.0, (1, .97, .92)); m = sphere(0, 0, 0, 1.0, tex_mat('moon_color_2k.jpg', 1.0), rot=(math.radians(90), 0, math.radians(-110)))
camera((0, -3.05, 0), (0, 0, 0), lens=50)
sc.render.film_transparent = True; sc.render.image_settings.color_mode = 'RGBA'; sc.render.filepath = OUTP; bpy.ops.render.render(write_still=True); print('ok')
