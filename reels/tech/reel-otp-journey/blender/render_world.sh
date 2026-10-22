#!/bin/bash
# resumable 2-process render of the route world (720x1280, 16 spp, 15 fps). usage: render_world.sh <outdir> <last_frame>
cd "$(dirname "$0")"; O=${1:-/tmp/otp2_frames}; LAST=${2:-917}; mkdir -p $O; MID=$((LAST/2))
run() { # $1=first $2=last
  for try in 1 2 3 4 5 6; do
    MISS=$(python3 -c "import os;print(','.join(str(i) for i in range($1,$2+1) if not os.path.exists('$O/f%04d.png'%i)))")
    [ -z "$MISS" ] && break
    FPS=15 FRAMES=$MISS THREADS=2 python3 world2.py 0 0 $O 720 1280 14 >> /tmp/otp2_$1.log 2>&1
  done
}
run 0 $MID & P1=$!
run $((MID+1)) $LAST & P2=$!
wait $P1 $P2; echo WORLD_DONE
