# 8 tilt views of one red blood cell (transparent 256x256) for the page's flowing-stream renderer.
import bpy, math, sys, os
sys.path.insert(0, os.path.dirname(__file__)); from cells_lib import *
OUT = os.environ.get('OUT', os.path.join(os.path.dirname(__file__), '..', 'mockup', 'site', 'plates'))
sc = setup(res=(256, 256), samples=int(os.environ.get('SPP', 64))); sc.render.film_transparent = True
sc.view_settings.view_transform = 'Standard'; sc.view_settings.exposure = 0.0
w = sc.world; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = srgb('#3a1a22'); w.node_tree.nodes['Background'].inputs[1].default_value = .6
M = principled('rbc', '#b3141f', rough=.32, sss=.8, sss_col=(1.0, .18, .12), coat=.35, emit='#ff3b2f', emit_s=.12)
me = rbc_mesh(1.0)
cam = bpy.data.cameras.new('c'); cam.type = 'ORTHO'; cam.ortho_scale = 2.7; co = bpy.data.objects.new('c', cam); sc.collection.objects.link(co); sc.camera = co
co.location = (0, -8, 0); co.rotation_euler = (math.pi / 2, 0, 0)
for loc, e, col in [((-4, -5, 4), 900, (1, .86, .8)), ((5, -4, -2), 380, (1, .45, .35)), ((0, 4, 3), 600, (1, .5, .4))]:
    bpy.ops.object.light_add(type='AREA', location=loc); l = bpy.context.object; l.data.energy = e; l.data.size = 5; l.data.color = col
    l.rotation_euler = (mathutils.Vector((0, 0, 0)) - mathutils.Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
ob = add_obj(me, M)
for i in range(8):
    tilt = math.radians(i * 90 / 7); ob.rotation_euler = (tilt, 0, math.radians(18))
    sc.render.filepath = os.path.join(OUT, f'rbc_{i}.png'); bpy.ops.render.render(write_still=True); print('rbc', i, flush=True)
