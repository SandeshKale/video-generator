import bpy, math, sys, mathutils
def setup(res=(900, 1000), samples=36):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = samples; sc.cycles.use_denoising = True
    sc.render.resolution_x, sc.render.resolution_y = res; sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.82, 0.88, 0.95, 1); bg.inputs[1].default_value = 0.5
    sc.view_settings.view_transform = 'Standard'; return sc
def mat(name, col, metal=0.0, rough=0.4):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = col; b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough; return m
def area(loc, rot, size, energy, col=(1, 1, 1)):
    bpy.ops.object.light_add(type='AREA', location=loc, rotation=rot); l = bpy.context.object; l.data.energy = energy; l.data.size = size; l.data.color = col
def wire(sc, points, mat_, r=0.011):
    cu = bpy.data.curves.new('c', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3
    sp = cu.splines.new('POLY'); sp.points.add(len(points) - 1)
    for i, p in enumerate(points): sp.points[i].co = (p[0], p[1], p[2], 1)
    ob = bpy.data.objects.new('w', cu); sc.collection.objects.link(ob); ob.data.materials.append(mat_); return ob
def bev(o, w=0.015, s=3):
    bpy.ops.object.modifier_add(type='BEVEL'); o.modifiers['Bevel'].width = w; o.modifiers['Bevel'].segments = s
def cam_persp(sc, loc, target, lens=55):
    cam = bpy.data.cameras.new('cam'); cam.lens = lens; co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co; co.location = loc
    co.rotation_euler = (mathutils.Vector(target) - co.location).to_track_quat('-Z', 'Y').to_euler()
def cam_ortho(sc, center, scale):
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'; cam.ortho_scale = scale; co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
    co.location = (center[0], -10, center[1]); co.rotation_euler = (math.pi / 2, 0, 0)
def shadow_floor(): 
    bpy.ops.mesh.primitive_plane_add(size=14, location=(0, 0, 0)); bpy.context.object.is_shadow_catcher = True
