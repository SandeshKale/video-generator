"""Earth with India centred for 'The clock that broke India's GPS' (uses assets/space/blender/earth.py: NASA Blue/Black Marble, clouds, stars).
   python3 blender/earth_india.py out.png [W H SPP] [azimuth_deg] [elev_deg] [dist]"""
import bpy, sys, os, math
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.normpath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'assets', 'space', 'blender')); from earth import build_earth
out = sys.argv[1]; W = int(sys.argv[2]) if len(sys.argv) > 2 else 540; H = int(sys.argv[3]) if len(sys.argv) > 3 else 960; SPP = int(sys.argv[4]) if len(sys.argv) > 4 else 24
az = float(sys.argv[5]) if len(sys.argv) > 5 else 80.0; el = float(sys.argv[6]) if len(sys.argv) > 6 else 20.0; dist = float(sys.argv[7]) if len(sys.argv) > 7 else 3.6
build_earth(sun_dir=(math.cos(math.radians(az - 70)), math.sin(math.radians(az - 70)), 0.18), res=(W, H), samples=SPP, night_strength=5.0, cam_dist=6.2, lon_deg=0.0)
sc = bpy.context.scene; cam = sc.camera
d = Vector((math.cos(math.radians(el)) * math.cos(math.radians(az)), math.cos(math.radians(el)) * math.sin(math.radians(az)), math.sin(math.radians(el))))
cam.location = d * dist; cam.rotation_euler = (-cam.location).to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = 40
sc.render.filepath = out; bpy.ops.render.render(write_still=True)
