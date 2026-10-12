# Bedroom diorama (cut-away corner room) lit in four states of the same morning: night, blue hour, sunrise, morning.
# The page cross-fades the four renders on its wall clock, so the change reads as time passing rather than a cut.
# Also exports the projected alarm-clock face (centre + radii) and the window rectangle, so the page can draw the clock
# hands and the sky in DOM/SVG exactly over the render. Run: python3 blender/bedroom.py <state|all> [spp]
import bpy, sys, os, json, math, mathutils
from bpy_extras.object_utils import world_to_camera_view
sys.path.insert(0, os.path.dirname(__file__))
from common import setup, mat, area, bev, cam_persp
a = sys.argv[1:]; STATES = ['night', 'bluehour', 'sunrise', 'morning']
which = STATES if (not a or a[0] == 'all') else [a[0]]; SPP = int(a[1]) if len(a) > 1 else 40
OUT = os.path.join(os.path.dirname(__file__), '..', 'site', '3d')

def build(state):
    sc = setup(res=(1080, 1240), samples=SPP)
    bg = sc.world.node_tree.nodes['Background']
    def box(name, loc, size, m, b=0.01, rot=(0, 0, 0)):
        bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
        bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m)
        if b: bev(o, b, 3)
        return o
    WALL = mat('wall', (0.80, 0.74, 0.70, 1), rough=0.9); FLOOR = mat('floor', (0.55, 0.38, 0.26, 1), rough=0.6)
    TRIM = mat('trim', (0.93, 0.90, 0.86, 1), rough=0.5); SHEET = mat('sheet', (0.92, 0.92, 0.95, 1), rough=0.85)
    BLANKET = mat('blanket', (0.22, 0.30, 0.62, 1), rough=0.9); WOOD = mat('wood', (0.46, 0.30, 0.20, 1), rough=0.5)
    SKIN = mat('skin', (0.55, 0.36, 0.26, 1), rough=0.6); HAIR = mat('hair', (0.06, 0.05, 0.05, 1), rough=0.6)
    CLOCKR = mat('clockred', (0.85, 0.22, 0.15, 1), metal=0.2, rough=0.35); CHROME = mat('chrome', (0.85, 0.85, 0.88, 1), metal=1.0, rough=0.2)
    FACE = mat('face', (0.96, 0.94, 0.88, 1), rough=0.6); RUG = mat('rug', (0.85, 0.55, 0.40, 1), rough=0.95)
    # room: floor 4x4, back wall (y=2), left wall (x=-2)
    box('floor', (0, 0, -0.05), (4, 4, 0.1), FLOOR, 0.02)
    box('back', (0, 2.05, 1.4), (4.1, 0.1, 2.9), WALL, 0.02)
    box('left', (-2.05, 0, 1.4), (0.1, 4.1, 2.9), WALL, 0.02)
    box('rug', (0.2, 0.2, 0.005), (2.2, 1.6, 0.01), RUG, 0.005)
    # window in back wall: a hole is faked with an emissive sky pane + frame
    sky = {'night': (0.03, 0.05, 0.16), 'bluehour': (0.18, 0.24, 0.55), 'sunrise': (1.0, 0.55, 0.30), 'morning': (0.75, 0.88, 1.0)}[state]
    skyE = {'night': 0.6, 'bluehour': 1.6, 'sunrise': 4.0, 'morning': 6.0}[state]
    SKY = bpy.data.materials.new('sky'); SKY.use_nodes = True; nt = SKY.node_tree; b0 = nt.nodes['Principled BSDF']
    b0.inputs['Emission Color'].default_value = (*sky, 1); b0.inputs['Emission Strength'].default_value = skyE; b0.inputs['Base Color'].default_value = (*sky, 1)
    WX, WZ, WW, WH = 0.75, 1.65, 1.3, 1.1
    box('skypane', (WX, 1.995, WZ), (WW, 0.02, WH), SKY, 0)
    for dx in (-WW / 2, WW / 2): box('wf', (WX + dx, 1.97, WZ), (0.07, 0.08, WH + 0.07), TRIM, 0.01)
    for dz in (-WH / 2, WH / 2, 0): box('wf', (WX, 1.97, WZ + dz), (WW + 0.07, 0.08, 0.06 if dz else 0.04), TRIM, 0.01)
    box('wfv', (WX, 1.97, WZ), (0.04, 0.08, WH), TRIM, 0.01)
    box('sill', (WX, 1.9, WZ - WH / 2 - 0.06), (WW + 0.25, 0.22, 0.05), TRIM, 0.01)
    # bed against left wall
    box('bedframe', (-1.1, 0.4, 0.18), (1.6, 2.4, 0.36), WOOD, 0.03)
    box('headboard', (-1.1, 1.6, 0.6), (1.6, 0.12, 1.1), WOOD, 0.03)
    box('mattress', (-1.1, 0.4, 0.45), (1.5, 2.3, 0.22), SHEET, 0.06)
    box('pillow', (-1.1, 1.3, 0.62), (0.8, 0.38, 0.14), SHEET, 0.06)
    # sleeper: head on pillow, body lump under blanket
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.15, location=(-1.12, 1.18, 0.78)); bpy.context.object.data.materials.append(SKIN); bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.155, location=(-1.12, 1.24, 0.82)); h = bpy.context.object; h.scale = (1, 0.8, 0.75); h.data.materials.append(HAIR); bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.32, depth=1.5, location=(-1.1, 0.3, 0.62), rotation=(math.pi / 2, 0, 0)); lump = bpy.context.object; lump.scale = (1.25, 1, 1); lump.data.materials.append(BLANKET); bpy.ops.object.shade_smooth()
    box('blanket', (-1.1, 0.25, 0.57), (1.56, 1.75, 0.08), BLANKET, 0.04)
    # nightstand + alarm clock (face toward the camera)
    box('stand', (0.0, 1.45, 0.3), (0.55, 0.5, 0.6), WOOD, 0.02)
    box('drawer', (0.0, 1.195, 0.32), (0.45, 0.02, 0.18), TRIM, 0.01)
    cx, cy, cz, R = 0.0, 1.42, 0.78, 0.13
    rot = mathutils.Euler((math.pi / 2, 0, math.radians(18)))
    bpy.ops.mesh.primitive_cylinder_add(radius=R, depth=0.09, location=(cx, cy, cz), rotation=rot); bpy.context.object.data.materials.append(CLOCKR); bev(bpy.context.object, 0.02, 3)
    fn = mathutils.Vector((0, -0.047, 0)); fn.rotate(mathutils.Euler((0, 0, math.radians(18)))); fpos = mathutils.Vector((cx, cy, cz)) + fn
    bpy.ops.mesh.primitive_cylinder_add(radius=R * 0.82, depth=0.01, location=fpos, rotation=rot); bpy.context.object.data.materials.append(FACE)
    for s in (-1, 1):
        off = mathutils.Vector((s * 0.085, 0, 0.11)); off.rotate(mathutils.Euler((0, 0, math.radians(18))))
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.055, location=mathutils.Vector((cx, cy, cz)) + off); bpy.context.object.scale = (1, 1, 0.6); bpy.context.object.data.materials.append(CHROME); bpy.ops.object.shade_smooth()
        lo = mathutils.Vector((s * 0.08, 0, -0.13)); lo.rotate(mathutils.Euler((0, 0, math.radians(18))))
        bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=0.08, location=mathutils.Vector((cx, cy, cz)) + lo); bpy.context.object.data.materials.append(CHROME)
    # lamp on stand (on only at night/bluehour: a dim warm glow)
    bpy.ops.mesh.primitive_cone_add(radius1=0.12, radius2=0.07, depth=0.16, location=(0.17, 1.55, 0.92)); shade = bpy.context.object
    LAMPM = bpy.data.materials.new('lampshade'); LAMPM.use_nodes = True; lb = LAMPM.node_tree.nodes['Principled BSDF']; lb.inputs['Base Color'].default_value = (0.95, 0.85, 0.65, 1)
    lb.inputs['Emission Color'].default_value = (1.0, 0.7, 0.35, 1); lb.inputs['Emission Strength'].default_value = {'night': 1.2, 'bluehour': 1.0, 'sunrise': 0.0, 'morning': 0.0}[state]
    shade.data.materials.append(LAMPM); box('lampbase', (0.17, 1.55, 0.7), (0.05, 0.05, 0.22), CHROME, 0.005)
    # lighting per state
    if state == 'night':
        bg.inputs[0].default_value = (0.02, 0.03, 0.08, 1); bg.inputs[1].default_value = 0.3
        area((WX, 3.2, 2.0), (math.radians(-70), 0, 0), 1.2, 80, (0.45, 0.55, 1.0))
        bpy.ops.object.light_add(type='POINT', location=(0.17, 1.45, 0.95)); bpy.context.object.data.energy = 18; bpy.context.object.data.color = (1, 0.7, 0.4)
    elif state == 'bluehour':
        bg.inputs[0].default_value = (0.10, 0.13, 0.30, 1); bg.inputs[1].default_value = 0.6
        area((WX, 3.2, 2.0), (math.radians(-70), 0, 0), 1.4, 260, (0.55, 0.62, 1.0))
        bpy.ops.object.light_add(type='POINT', location=(0.17, 1.45, 0.95)); bpy.context.object.data.energy = 10; bpy.context.object.data.color = (1, 0.7, 0.4)
    elif state == 'sunrise':
        bg.inputs[0].default_value = (0.55, 0.40, 0.40, 1); bg.inputs[1].default_value = 0.7
        bpy.ops.object.light_add(type='SUN', location=(WX, 4, 2.2)); s_ = bpy.context.object; s_.data.energy = 4.5; s_.data.color = (1.0, 0.62, 0.35); s_.data.angle = 0.04
        s_.rotation_euler = (math.radians(-46), math.radians(-12), 0)
        area((1.2, -1.6, 2.6), (math.radians(55), 0, math.radians(30)), 2.5, 110, (1.0, 0.82, 0.72))
    else:
        bg.inputs[0].default_value = (0.75, 0.80, 0.90, 1); bg.inputs[1].default_value = 1.0
        bpy.ops.object.light_add(type='SUN', location=(WX, 4, 3)); s_ = bpy.context.object; s_.data.energy = 6; s_.data.color = (1.0, 0.93, 0.82); s_.data.angle = 0.05
        s_.rotation_euler = (math.radians(-38), math.radians(-16), 0)
        area((1.2, -1.6, 2.6), (math.radians(55), 0, math.radians(30)), 2.5, 240, (1.0, 0.97, 0.92))
    # cut a real opening in the back wall so moonlight / sunlight enters through the window
    w = bpy.data.objects['back']; w.hide_render = True
    x0, x1 = WX - WW / 2, WX + WW / 2; z0, z1 = WZ - WH / 2, WZ + WH / 2
    box('back_a', ((-2.05 + x0) / 2, 2.05, 1.4), (x0 + 2.05, 0.1, 2.9), WALL, 0)
    box('back_b', ((x1 + 2.05) / 2, 2.05, 1.4), (2.05 - x1, 0.1, 2.9), WALL, 0)
    box('back_c', (WX, 2.05, (z0 - 0.05) / 2), (WW, 0.1, z0 + 0.05), WALL, 0)
    box('back_d', (WX, 2.05, (z1 + 2.85) / 2), (WW, 0.1, 2.85 - z1), WALL, 0)
    bpy.data.objects.remove(bpy.data.objects['skypane'])            # the opening stays transparent: the page draws the sky behind it
    for n in [o.name for o in bpy.data.objects if o.name.startswith('back_l')]: bpy.data.objects.remove(bpy.data.objects[n])
    # light blockers the camera can't see (ceiling, front and right walls): daylight only enters through the window
    for nm, loc, size in (('ceil', (0, 0, 2.95), (4.3, 4.3, 0.1)), ('front', (0, -2.1, 1.4), (4.3, 0.1, 3.0)), ('right', (2.1, 0, 1.4), (0.1, 4.3, 3.0))):
        o = box(nm, loc, size, WALL, 0); o.visible_camera = False
    cam_persp(sc, (3.6, -3.4, 2.7), (-0.35, 0.7, 0.75), 34)
    bpy.context.view_layer.update()
    # projections for the page
    def P(v):
        q = world_to_camera_view(sc, sc.camera, mathutils.Vector(v)); return [round(q.x * 1080, 1), round((1 - q.y) * 1240, 1)]
    ax = mathutils.Vector((1, 0, 0)); ax.rotate(mathutils.Euler((0, 0, math.radians(18)))); up = mathutils.Vector((0, 0, 1))
    face = {'c': P(fpos + fn * 0.15), 'x': P(fpos + fn * 0.15 + ax * R * 0.82), 'y': P(fpos + fn * 0.15 + up * R * 0.82)}
    win = [P((x0, 1.95, z1)), P((x1, 1.95, z1)), P((x1, 1.95, z0)), P((x0, 1.95, z0))]
    json.dump({'face': face, 'window': win}, open(os.path.join(OUT, 'bedroom.json'), 'w'))
    sc.render.filepath = os.path.join(OUT, 'bed_' + state + '.png'); bpy.ops.render.render(write_still=True); print('wrote', state, flush=True)
for s in which: build(s)
