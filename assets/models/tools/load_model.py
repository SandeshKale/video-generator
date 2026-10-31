"""Drop a library model into a Blender (bpy) scene. Exec or import from a reel's blender/*.py:

    import sys; sys.path.insert(0, '../../../assets/models/tools'); from load_model import place
    place('procedural/delivery_scooter', loc=(0, 0, 0), rot_z=90, height=1.2)       # scale to a real height (m)
    place('quaternius/streets/Street_Straight', loc=(0, 8, 0), tint=None)
    place('quaternius/simplebuildings/Bank', loc=(10, 0, 0), tint=(0.1, 0.5, 0.9))   # clay packs: give them a colour

`name` = path under assets/models without .glb. glTF is Y-up; Blender's importer converts to Z-up, so loc/rot are Blender
coordinates. `height` rescales the whole model to that Z size; `tint` multiplies every material's base colour (use on the
clay packs); `emission` (r,g,b,strength) sets any material whose name starts with 'EM_'.
Returns the empty that parents the model so the reel can animate it as one object.
"""
import bpy, os, math, mathutils

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

def place(name, loc=(0, 0, 0), rot_z=0.0, height=None, scale=1.0, tint=None, emission=None, collection=None):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.normpath(os.path.join(ROOT, name + '.glb')))
    new = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.objects.new(os.path.basename(name), None); (collection or bpy.context.scene.collection).objects.link(root)
    for o in new:
        if o.parent is None: o.parent = root
    meshes = [o for o in new if o.type == 'MESH']
    bpy.context.view_layer.update()
    if height:
        lo = min((o.matrix_world @ mathutils.Vector(c)).z for o in meshes for c in o.bound_box)
        hi = max((o.matrix_world @ mathutils.Vector(c)).z for o in meshes for c in o.bound_box)
        scale = height / max(hi - lo, 1e-6)
    root.scale = (scale,) * 3; root.rotation_euler = (0, 0, math.radians(rot_z)); root.location = loc
    for o in meshes:
        for slot in o.material_slots:
            m = slot.material
            if not (m and m.use_nodes): continue
            b = m.node_tree.nodes.get('Principled BSDF')
            if not b: continue
            if tint and not m.name.startswith('EM_'):
                c = b.inputs['Base Color'].default_value; b.inputs['Base Color'].default_value = (c[0] * tint[0], c[1] * tint[1], c[2] * tint[2], 1)
            if emission and m.name.startswith('EM_'):
                b.inputs['Emission Color'].default_value = (*emission[:3], 1); b.inputs['Emission Strength'].default_value = emission[3]
    return root
