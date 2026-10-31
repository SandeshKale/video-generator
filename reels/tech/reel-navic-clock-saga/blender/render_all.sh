#!/bin/bash
# renders every Blender plate/sprite of the reel into site/img (about 20 min on 4 CPUs while other jobs run)
cd "$(dirname "$0")/.." || exit 1
PY=${PY:-/tmp/scr/venv-bpy/bin/python}; N="nice -n 10"
[ -f site/img/sat.png ] || $N $PY blender/space.py sat site/img/sat.png 48 > /tmp/scr/qc/rn_sat.log 2>&1
[ -f site/img/rocket.png ] || $N $PY blender/space.py rocket site/img/rocket.png 40 > /tmp/scr/qc/rn_rocket.log 2>&1
[ -f site/img/launch.png ] || $N $PY blender/space.py launch site/img/launch.png 40 > /tmp/scr/qc/rn_launch.log 2>&1
[ -f site/img/earth-a.png ] || $N $PY blender/earth_india.py site/img/earth-a.png 1080 1920 40 90 18 3.3 > /tmp/scr/qc/rn_ea.log 2>&1
[ -f site/img/earth-b.png ] || $N $PY blender/earth_india.py site/img/earth-b.png 1080 1920 40 62 30 4.4 > /tmp/scr/qc/rn_eb.log 2>&1
echo done > /tmp/scr/qc/rn_all.done
