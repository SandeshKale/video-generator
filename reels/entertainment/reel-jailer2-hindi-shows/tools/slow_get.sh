#!/bin/bash
# Retry Commons downloads slowly (HTTP 429): one attempt per file every ~100 s until each file is a real image.
cd "$(dirname "$0")/../photos"; UA="reel-research/1.0 (kale.sd111@gmail.com)"
declare -A U=( [rajini.jpg]="https://commons.wikimedia.org/wiki/Special:FilePath/Rajinikanth_snapped_at_the_airport.jpg?width=960"
               [multiplex.jpg]="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/PVR_VR_Mall_1.jpg/1280px-PVR_VR_Mall_1.jpg" )
for round in $(seq 1 14); do
  for f in "${!U[@]}"; do
    [ -s "$f" ] && continue
    curl -sS -m 60 -L -A "$UA" -o "$f.tmp" "${U[$f]}"; if head -c 4 "$f.tmp" | grep -q -a -E "JFIF|Exif|PNG"; then mv "$f.tmp" "$f"; echo "got $f" >> slow_get.log; else rm -f "$f.tmp"; fi
    sleep 45
  done
  [ -s rajini.jpg ] && [ -s multiplex.jpg ] && break
  sleep 60
done
echo finished >> slow_get.log
