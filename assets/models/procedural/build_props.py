"""Procedural low-poly props for the reel/GIF library (own work, CC0 — no third-party mesh data).

    python3 assets/models/procedural/build_props.py [name ...]      # default: all
Writes assets/models/procedural/<name>.glb (Y-up, metres, origin on the ground at the object's centre).
Emissive parts (LEDs, screens, windows) use material names starting with 'EM_' so a scene can retune glow;
the phone's screen is a separate quad named 'screen' with a 0..1 UV, ready for a texture (a UI frame, a map).
"""
import bpy, bmesh, math, sys, os
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
_mats = {}

def mat(name, rgb, metal=0.0, rough=0.5, emit=0.0):
    if name in _mats: return _mats[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit:
        b.inputs['Emission Color'].default_value = (*rgb, 1); b.inputs['Emission Strength'].default_value = emit
    _mats[name] = m; return m

def hexc(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x ** 2.2 for x in c)          # sRGB -> linear

def _fin(o, m, bevel=0.0):
    o.data.materials.append(m)
    if bevel:
        bv = o.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 2; bv.limit_method = 'ANGLE'
    return o

def box(n, size, loc, m, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot); o = bpy.context.object; o.name = n
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2); bpy.ops.object.transform_apply(scale=True); return _fin(o, m, bevel)

def cyl(n, r, h, loc, m, axis='Z', verts=24, bevel=0.0, r2=None):
    rot = {'Z': (0, 0, 0), 'X': (0, math.pi / 2, 0), 'Y': (math.pi / 2, 0, 0)}[axis]
    if r2 is None: bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=loc, rotation=rot)
    else: bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=h, location=loc, rotation=rot)
    o = bpy.context.object; o.name = n; return _fin(o, m, bevel)

def sphere(n, r, loc, m, scale=(1, 1, 1), seg=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, radius=r, location=loc); o = bpy.context.object; o.name = n
    o.scale = scale; bpy.ops.object.transform_apply(scale=True); return _fin(o, m)

def rbox(n, size, loc, m, radius, rot=(0, 0, 0)):
    """box with rounded vertical edges (phone/cabinet bodies)."""
    o = box(n, size, loc, m, rot=rot); bv = o.modifiers.new('bv', 'BEVEL'); bv.width = radius; bv.segments = 5; bv.limit_method = 'NONE'
    bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier='bv'); return o

def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True); _mats.clear()

def export(name):
    for o in list(bpy.context.scene.objects):
        if o.type == 'MESH':
            bpy.context.view_layer.objects.active = o
            for md in list(o.modifiers):
                try: bpy.ops.object.modifier_apply(modifier=md.name)
                except Exception: pass
    out = os.path.join(HERE, name + '.glb')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_apply=True, export_yup=True)
    print('built', name, os.path.getsize(out) // 1024, 'KB', flush=True)

# ---------------------------------------------------------------- props
def server_rack():
    steel = mat('rack_steel', hexc('#1c2026'), 0.7, 0.45); panel = mat('rack_panel', hexc('#0e1114'), 0.5, 0.6)
    trim = mat('rack_trim', hexc('#8b949e'), 0.9, 0.3)
    W, D, H = 0.6, 1.0, 2.0
    for sx in (-1, 1):
        for sy in (-1, 1): box('post', (0.04, 0.04, H), (sx * (W / 2 - 0.02), sy * (D / 2 - 0.02), H / 2), steel)
    box('top', (W, D, 0.04), (0, 0, H), steel); box('base', (W, D, 0.08), (0, 0, 0.04), steel)
    box('back', (W, 0.02, H), (0, D / 2, H / 2), panel)
    box('side_l', (0.02, D, H), (-W / 2, 0, H / 2), panel); box('side_r', (0.02, D, H), (W / 2, 0, H / 2), panel)
    greens = [mat(n, c, 0, 0.4, 6) for n, c in (('EM_green', hexc('#2cff7a')), ('EM_amber', hexc('#ffb02e')), ('EM_blue', hexc('#38a8ff')))]
    z = 0.14
    for i in range(40):
        h = 0.044 * (2 if i % 6 == 5 else 1)
        if z + h > H - 0.09: break
        box('unit', (W - 0.1, 0.06, h - 0.006), (0, -D / 2 + 0.05, z + h / 2), panel, 0.004)
        box('vent', (W - 0.34, 0.01, h * 0.45), (-0.06, -D / 2 + 0.018, z + h / 2), steel)
        box('handle', (0.03, 0.012, h * 0.6), (W / 2 - 0.07, -D / 2 + 0.016, z + h / 2), trim)
        for k in range(3):
            box('led', (0.012, 0.008, 0.008), (W / 2 - 0.12 - k * 0.022, -D / 2 + 0.018, z + h * 0.7), greens[(i + k) % 3])
        z += h + 0.004
    box('door_frame', (W - 0.04, 0.012, 0.03), (0, -D / 2 + 0.01, H - 0.05), trim)

def smartphone():
    ti = mat('phone_titanium', hexc('#8a8782'), 1.0, 0.28); glass = mat('phone_back', hexc('#2b2d30'), 0.2, 0.15)
    black = mat('phone_black', (0.003, 0.003, 0.004), 0.1, 0.3); scr = mat('EM_screen', hexc('#0a1630'), 0.0, 0.1, 0.9)
    lens = mat('phone_lens', (0.002, 0.002, 0.003), 0.3, 0.05); ring = mat('phone_ring', hexc('#bdbab3'), 1.0, 0.25)
    W, H, T = 0.0715, 0.1466, 0.0083
    rbox('frame', (W, T, H), (0, 0, H / 2), ti, 0.011)
    rbox('back_glass', (W - 0.003, 0.0006, H - 0.003), (0, T / 2 + 0.0003, H / 2), glass, 0.010)
    # screen: single quad with 0..1 UV, slightly proud of the frame; faces -Y (viewer side)
    sw, sh = W - 0.0042, H - 0.0042
    me = bpy.data.meshes.new('screen'); o = bpy.data.objects.new('screen', me); bpy.context.collection.objects.link(o)
    bm = bmesh.new(); y = -T / 2 - 0.0002
    vs = [bm.verts.new(v) for v in ((-sw / 2, y, H / 2 - sh / 2), (sw / 2, y, H / 2 - sh / 2), (sw / 2, y, H / 2 + sh / 2), (-sw / 2, y, H / 2 + sh / 2))]
    f = bm.faces.new(vs[::-1]) if False else bm.faces.new(vs); uv = bm.loops.layers.uv.new('UVMap')
    for l, u in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))): l[uv].uv = u
    f.normal_flip(); bm.to_mesh(me); bm.free(); o.data.materials.append(scr)
    pill = rbox('dynamic_island', (0.0215, 0.0006, 0.0062), (0, -T / 2 - 0.0006, H - 0.0095), black, 0.0030)
    box('btn_action', (0.0008, 0.0012, 0.006), (-W / 2 - 0.0003, 0, H - 0.030), ti, 0.0003)
    box('btn_vol_up', (0.0008, 0.0012, 0.011), (-W / 2 - 0.0003, 0, H - 0.044), ti, 0.0003)
    box('btn_vol_dn', (0.0008, 0.0012, 0.011), (-W / 2 - 0.0003, 0, H - 0.059), ti, 0.0003)
    box('btn_power', (0.0008, 0.0012, 0.017), (W / 2 + 0.0003, 0, H - 0.050), ti, 0.0003)
    rbox('camera_plate', (0.036, 0.0035, 0.036), (-W / 2 + 0.0225, T / 2 + 0.0016, H - 0.0225), glass, 0.007)
    for (dx, dz) in ((-0.0085, 0.0085), (-0.0085, -0.0085), (0.0085, 0)):
        cyl('lens_ring', 0.0072, 0.0016, (-W / 2 + 0.0225 + dx, T / 2 + 0.0043, H - 0.0225 + dz), ring, 'Y', 20)
        cyl('lens', 0.0052, 0.0018, (-W / 2 + 0.0225 + dx, T / 2 + 0.0047, H - 0.0225 + dz), lens, 'Y', 20)
    cyl('flash', 0.0030, 0.0012, (-W / 2 + 0.0225 + 0.0105, T / 2 + 0.0035, H - 0.0225 + 0.0105 + 0.0), mat('phone_flash', hexc('#f2e6c4'), 0, 0.4), 'Y', 12)

def scooter():
    body = mat('sc_body', hexc('#ffc21a'), 0.1, 0.45); dark = mat('sc_dark', hexc('#1a1c21'), 0.2, 0.6); tire = mat('sc_tire', (0.01, 0.01, 0.012), 0, 0.9)
    rim = mat('sc_rim', hexc('#9aa3ad'), 1.0, 0.3); seat = mat('sc_seat', hexc('#26282d'), 0, 0.7); box_m = mat('sc_box', hexc('#ff3d6e'), 0, 0.55)
    lamp = mat('EM_headlight', hexc('#fff4cf'), 0, 0.3, 8); tail = mat('EM_tail', hexc('#ff2a2a'), 0, 0.3, 5)
    L = 1.7
    for x in (-0.62, 0.62):
        cyl('tire', 0.2, 0.1, (x, 0, 0.2), tire, 'Y', 28, 0.012); cyl('rim', 0.11, 0.11, (x, 0, 0.2), rim, 'Y', 20)
    box('floor', (0.62, 0.26, 0.05), (-0.02, 0, 0.26), body, 0.015)
    rbox('rear_body', (0.62, 0.34, 0.34), (-0.52, 0, 0.45), body, 0.07)
    rbox('front_shield', (0.16, 0.30, 0.52), (0.38, 0, 0.5), body, 0.05, rot=(0, math.radians(-14), 0))
    box('seat', (0.52, 0.28, 0.08), (-0.45, 0, 0.67), seat, 0.03)
    box('stem', (0.04, 0.04, 0.45), (0.36, 0, 0.88), dark, 0.01, rot=(0, math.radians(-14), 0))
    box('bar', (0.05, 0.62, 0.04), (0.33, 0, 1.1), dark, 0.015)
    for s in (-1, 1): cyl('grip', 0.025, 0.12, (0.33, s * 0.34, 1.1), seat, 'Y', 10)
    sphere('headlight', 0.06, (0.455, 0, 0.84), lamp, (0.7, 1.1, 1.0), 12)
    box('taillight', (0.02, 0.18, 0.05), (-0.84, 0, 0.5), tail)
    box('fender_f', (0.28, 0.14, 0.03), (0.62, 0, 0.42), body, 0.01)
    rbox('delivery_box', (0.48, 0.48, 0.5), (-0.62, 0, 1.0), box_m, 0.05)
    box('box_lid', (0.5, 0.5, 0.04), (-0.62, 0, 1.27), mat('sc_lid', hexc('#d92a58'), 0, 0.5), 0.01)
    box('box_strap', (0.50, 0.06, 0.52), (-0.62, 0, 1.0), dark)

def gas_stove_with_pot():
    steel = mat('st_steel', hexc('#b9c0c7'), 1.0, 0.3); dark = mat('st_dark', hexc('#15171a'), 0.4, 0.45); knob = mat('st_knob', hexc('#2a2d33'), 0.3, 0.4)
    flame = mat('EM_flame', hexc('#3a7bff'), 0, 0.3, 5); potm = mat('pot_steel', hexc('#c9ced3'), 1.0, 0.22); handle = mat('pot_handle', hexc('#16181b'), 0, 0.6)
    rbox('body', (0.7, 0.45, 0.12), (0, 0, 0.06), steel, 0.015); box('top', (0.7, 0.45, 0.012), (0, 0, 0.126), dark, 0.004)
    for sx in (-0.17, 0.17):
        cyl('burner', 0.075, 0.018, (sx, 0.02, 0.14), dark, 'Z', 24, 0.004); cyl('cap', 0.045, 0.014, (sx, 0.02, 0.157), steel, 'Z', 20)
        for k in range(12):
            a = k / 12 * math.tau; box('flame', (0.014, 0.014, 0.022), (sx + 0.058 * math.cos(a), 0.02 + 0.058 * math.sin(a), 0.172), flame)
        for k in range(4):
            a = k / 4 * math.tau + 0.4; box('grate', (0.12, 0.012, 0.012), (sx + 0.0 , 0.02, 0.19), dark, rot=(0, 0, a))
    for i, sx in enumerate((-0.2, -0.07, 0.07, 0.2)): cyl('knob', 0.03, 0.03, (sx, -0.23, 0.07), knob, 'Y', 16)
    # saucepan on the left burner
    px, py = -0.17, 0.02
    cyl('pot', 0.105, 0.11, (px, py, 0.255), potm, 'Z', 28, 0.004); cyl('pot_lid', 0.108, 0.012, (px, py, 0.316), potm, 'Z', 28, 0.004)
    cyl('lid_knob', 0.018, 0.02, (px, py, 0.332), handle, 'Z', 12)
    box('pot_handle', (0.16, 0.03, 0.02), (px - 0.19, py, 0.29), handle, 0.006)
    # second burner: milk saucepan, small
    cyl('milk_pan', 0.075, 0.07, (0.17, 0.02, 0.235), potm, 'Z', 24, 0.003); box('pan_handle', (0.13, 0.025, 0.015), (0.17 + 0.14, 0.02, 0.255), handle, 0.005)

def milk_pouch():
    film = mat('mp_film', hexc('#f2f6fb'), 0, 0.35); band = mat('mp_band', hexc('#1f5eff'), 0, 0.4); seal = mat('mp_seal', hexc('#dfe7f2'), 0, 0.5)
    hx, hy, hz = 0.085, 0.030, 0.113
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=20, radius=1.0); o = bpy.context.object; o.name = 'pouch'
    for v in o.data.vertices:    # pillow: full width mid-height, pinched thin toward the sealed top/bottom edges
        x, y, z = v.co; k = abs(z); sg = lambda a: (a > 0) - (a < 0)
        v.co.x = hx * sg(x) * abs(x) ** 0.55; v.co.y = hy * y * (1 - 0.85 * k ** 3); v.co.z = hz * sg(z) * k ** 0.8
    _fin(o, film); o.location = (0, 0, hz + 0.012)
    box('seal_top', (0.17, 0.004, 0.016), (0, 0, 2 * hz + 0.010), seal); box('seal_bot', (0.17, 0.004, 0.016), (0, 0, 0.014), seal)
    box('band', (0.11, 0.002, 0.05), (0, -hy * 1.0, hz + 0.012), band)

def delivery_bag():
    sh = mat('db_shell', hexc('#ff4d2e'), 0, 0.6); dk = mat('db_dark', hexc('#1b1d22'), 0, 0.7); zip_ = mat('db_zip', hexc('#d7dbe0'), 0.8, 0.4)
    rbox('bag', (0.42, 0.42, 0.44), (0, 0, 0.22), sh, 0.04); rbox('lid', (0.43, 0.43, 0.06), (0, 0, 0.46), dk, 0.025)
    box('zip', (0.40, 0.012, 0.012), (0, -0.215, 0.43), zip_)
    for s in (-1, 1): box('strap', (0.04, 0.44, 0.012), (s * 0.12, 0, 0.445), dk)

def cell_tower():
    steel = mat('ct_steel', hexc('#c7cdd4'), 0.8, 0.4); pan = mat('ct_panel', hexc('#e9edf1'), 0, 0.5); red = mat('EM_beacon', hexc('#ff2a2a'), 0, 0.3, 8)
    H = 18.0; legs = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            a = Vector((sx * 1.3, sy * 1.3, 0)); b = Vector((sx * 0.35, sy * 0.35, H)); m = (a + b) / 2
            cyl('leg', 0.07, (b - a).length, m, steel, 'Z', 8)
            o = bpy.context.object; o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = (b - a).to_track_quat('Z', 'Y')
    zs = [i * 2.25 for i in range(8)]
    for z in zs:
        s = 1.3 - (1.3 - 0.35) * z / H
        for (x0, y0, x1, y1) in ((-s, -s, s, -s), (s, -s, s, s), (s, s, -s, s), (-s, s, -s, -s)):
            a = Vector((x0, y0, z)); b = Vector((x1, y1, z + 1.1)); m = (a + b) / 2
            cyl('brace', 0.03, (b - a).length, m, steel, 'Z', 6); o = bpy.context.object; o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = (b - a).to_track_quat('Z', 'Y')
    for k in range(3):   # three sector antenna panels
        a = k / 3 * math.tau + 0.5
        for dz in (0, -0.7):
            box('antenna', (0.38, 0.1, 1.5), (0.7 * math.cos(a), 0.7 * math.sin(a), H - 1.2 + dz), pan, 0.02, rot=(0, 0, a - math.pi / 2))
    cyl('dish', 0.8, 0.12, (0.2, -1.4, H - 4.5), pan, 'Y', 24, r2=0.15)
    sphere('beacon', 0.18, (0, 0, H + 0.4), red)
    cyl('mast', 0.04, 1.0, (0, 0, H + 0.1), steel, 'Z', 8)
    box('shelter', (2.0, 1.6, 1.8), (2.4, 2.0, 0.9), mat('ct_shelter', hexc('#8c959f'), 0.3, 0.6), 0.03)

def map_pin():
    red = mat('pin_red', hexc('#ff3a52'), 0.1, 0.35); white = mat('pin_white', hexc('#f4f6fa'), 0, 0.4)
    cyl('pin_cone', 0.11, 0.26, (0, 0, 0.13), red, 'Z', 32, r2=0.0); o = bpy.context.object; o.rotation_euler = (math.pi, 0, 0); o.location = (0, 0, 0.13)
    sphere('pin_head', 0.12, (0, 0, 0.34), red, seg=32); sphere('pin_dot', 0.05, (0, -0.095, 0.34), white, (1, 0.5, 1), 16)
    cyl('pin_shadow', 0.16, 0.004, (0, 0, 0.002), mat('pin_shadow', (0, 0, 0), 0, 1), 'Z', 32)

BUILDERS = dict(server_rack=server_rack, smartphone=smartphone, delivery_scooter=scooter, gas_stove_with_pot=gas_stove_with_pot,
                milk_pouch=milk_pouch, delivery_bag=delivery_bag, cell_tower=cell_tower, map_pin=map_pin)

if __name__ == '__main__':
    names = [a for a in sys.argv[1:] if a in BUILDERS] or list(BUILDERS)
    for n in names:
        clear(); BUILDERS[n](); export(n)
