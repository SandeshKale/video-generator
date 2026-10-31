#!/bin/bash
# renders an N-frame satellite turntable (yaw 0..360) to site/img/satturn/f00.png ...; then tools/crop_turn.py crops all frames to one shared box
cd "$(dirname "$0")/.." || exit 1
PY=${PY:-/tmp/scr/venv-bpy/bin/python}; N=${N:-18}; mkdir -p site/img/satturn
for i in $(seq 0 $((N-1))); do f=$(printf "site/img/satturn/f%02d.png" $i); [ -f $f ] || YAW=$((i*360/N)) LENS=22 SW=1100 SH=560 nice -n 10 $PY blender/space.py sat $f 20 > /tmp/scr/qc/turn_$i.log 2>&1; done
echo done > /tmp/scr/qc/turn.done
