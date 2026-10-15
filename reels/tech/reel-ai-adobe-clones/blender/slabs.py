# Five glass layer slabs (background / shapes / text / mask / adjustment), rendered face-on (ortho, top-down) on transparent film.
# CSS 3D stacks them with real perspective in the page. Usage: python3 slabs.py outdir
import sys, math; sys.path.insert(0, __file__.rsplit('/', 1)[0])
from common import *
out = sys.argv[1]
def make(name, builder):
    sc = setup((900, 900), 48); init_mats()
    bpy.context.scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.22
    glass = mat('glass', (0.93, 0.97, 1.0, 1), 0.0, 0.05)
    b = glass.node_tree.nodes['Principled BSDF']; b.inputs['Transmission Weight'].default_value = 0.92; b.inputs['IOR'].default_value = 1.45; b.inputs['Alpha'].default_value = 1.0
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0)); s = bpy.context.object; s.scale = (3.0, 3.0, 0.1); s.data.materials.append(glass); bev(s, 0.04, 4)
    builder(sc)
    area((1.5, -2, 5), (math.radians(20), 0, math.radians(10)), 4, 70); area((-3, 2, 4), (math.radians(30), 0, math.radians(-120)), 4, 40)
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'; cam.ortho_scale = 3.3; co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co; co.location = (0, 0, 8); co.rotation_euler = (0, 0, 0)
    sc.render.filepath = f'{out}/slab_{name}.png'; bpy.ops.render.render(write_still=True)
Z = 0.07
def cyl(r, d, loc, m, v=64): bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d, location=loc, vertices=v); o = bpy.context.object; o.data.materials.append(m); return o
def box(sz, loc, m, bw=0.02): bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.scale = sz; o.data.materials.append(m); bev(o, bw, 3); return o
def em(name, col, k=1.0):
    m = mat(name, col, 0, 0.5); b = m.node_tree.nodes['Principled BSDF']; b.inputs['Emission Color'].default_value = col; b.inputs['Emission Strength'].default_value = k; return m
def init_mats():
    global bone, lime, org, ink
    bone = em('bone', (0.94, 0.91, 0.86, 1), 0.12); lime = em('lime', (0.78, 0.95, 0.2, 1), 0.18); org = em('org', (1.0, 0.3, 0.02, 1), 0.2); ink = mat('ink', (0.07, 0.07, 0.06, 1), 0, 0.5)
def bg(sc):
    # checker "transparency grid" in orange/bone
    n = 8
    for i in range(n):
        for j in range(n):
            if (i + j) % 2 == 0: box((2.8 / n, 2.8 / n, 0.02), (-1.4 + (i + .5) * 2.8 / n, -1.4 + (j + .5) * 2.8 / n, Z), org if (i * 3 + j) % 7 == 0 else bone, 0.004)
def shapes(sc):
    cyl(0.7, 0.08, (-0.5, 0.45, Z + .02), lime); box((1.0, 1.0, 0.08), (0.65, -0.35, Z + .02), org, 0.08).rotation_euler = (0, 0, 0.4)
    bpy.ops.mesh.primitive_cone_add(radius1=0.65, radius2=0.0, depth=0.9, location=(-0.6, -0.8, Z + .4), vertices=3); o = bpy.context.object; o.data.materials.append(ink); o.rotation_euler = (math.pi, 0, 0)
def text(sc):
    bpy.ops.object.text_add(location=(-1.15, -0.55, Z)); t = bpy.context.object; t.data.body = 'Aa'; t.data.size = 1.9; t.data.extrude = 0.05; t.data.materials.append(bone)
def mask(sc):
    n = 24
    for i in range(n):
        v = i / (n - 1); m = em('g%d' % i, (v, v, v, 1), 0.05 + 0.3 * v); box((2.8 / n, 2.6, 0.02), (-1.4 + (i + .5) * 2.8 / n, 0, Z), m, 0.002)
    cyl(0.45, 0.06, (0.4, 0.3, Z + .03), lime)
def adj(sc):
    for k, (y, f) in enumerate([(0.8, .7), (0.0, .35), (-0.8, .55)]):
        box((2.3, 0.1, 0.05), (0, y, Z), ink, 0.02); box((2.3 * f, 0.1, 0.06), (-1.15 + 2.3 * f / 2, y, Z + .01), [lime, org, bone][k], 0.02); cyl(0.17, 0.12, (-1.15 + 2.3 * f, y, Z + .05), bone, 48)
for nm, fn in [('bg', bg), ('shapes', shapes), ('text', text), ('mask', mask), ('adj', adj)]: make(nm, fn)
