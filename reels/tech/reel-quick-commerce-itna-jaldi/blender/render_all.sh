#!/bin/bash
# renders every Blender plate/sprite of the reel into site/img (about 15 min on 4 CPUs)
cd "$(dirname "$0")/.." || exit 1
PY=${PY:-/tmp/scr/venv-bpy/bin/python}; N="nice -n 10"
for w in scooter pouch bag phone doorstep; do [ -f site/img/$w.png ] || $N $PY blender/sprites.py $w site/img/$w.png 32 > /tmp/scr/qc/r_$w.log 2>&1; done
[ -f site/img/city.png ] || $N $PY blender/city.py site/img/city.png 1080 1920 40 > /tmp/scr/qc/r_city.log 2>&1
[ -f site/img/aisle.png ] || $N $PY blender/aisle_vivid.py site/img/aisle.png 1080 1920 40 > /tmp/scr/qc/r_aisle.log 2>&1
echo done > /tmp/scr/qc/render_all.done
