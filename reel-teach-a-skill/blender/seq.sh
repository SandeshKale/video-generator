#!/bin/bash
# Frame sequence for the drawer: d00..d11 = drawer slides out (ease-out, pull 0 -> .85), c1..c5 = the matched card lifts.
# The page cross-fades neighbouring frames, so 12 + 5 renders read as continuous motion. Skips frames already rendered.
cd "$(dirname "$0")/.."
SPP=${SPP:-28}
for i in $(seq 0 11); do
  p=$(python3 -c "u=$i/11; print(round(.85*(1-(1-u)**2.2),4))")
  n=$(printf 'd%02d' $i); [ -f site/3d/$n.png ] || python3 blender/cabinet.py $n $p 0 $SPP hero > /dev/null 2>&1; echo $n $p
done
for j in 1 2 3 4 5; do
  l=$(python3 -c "u=$j/5; print(round(1-(1-u)**2,4))")
  n=c$j; [ -f site/3d/$n.png ] || python3 blender/cabinet.py $n .85 $l $SPP hero > /dev/null 2>&1; echo $n $l
done
echo SEQDONE
