"""Cover hero: scam phone + MALWARE stamp + orbiting file cards (Cycles). usage: python3 cover_hero.py OUT.png"""
import sys, os
OUTP = sys.argv[1]; src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'anim.py')).read().split("if SHOT == 'A':")[0]
sys.argv = ['x', 'A', '1080', '1350', '40']; exec(src, globals())
anim, DUR = shot_A(); anim(3.0)
for o in bpy.data.objects:
    if o.type == 'FONT' and o.data.body in ('GTA 6 MOBILE?', '= VIRUS', 'FAKE INSTALLER · OUR OWN GRAPHIC'): o.hide_render = True
bpy.context.scene.camera.location = (0.05, -2.45, .05); aim(bpy.context.scene.camera, (0.05, -2.45, .05), (0, 0, .02)); bpy.context.scene.camera.data.dof.focus_distance = 2.45
bpy.context.scene.render.resolution_x = 1080; bpy.context.scene.render.resolution_y = 1350; bpy.context.scene.render.filepath = OUTP; bpy.ops.render.render(write_still=True); print('ok')
