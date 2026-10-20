#!/bin/sh
# usage: sh build.sh en|hi  -> selects that voice version for the page (timing + host video); then render with scripts/render.mjs
V=${1:-en}; D=$(dirname "$0")/site
cp $D/timing_$V.js $D/timing.js
if [ -f $D/host_$V.webm ]; then cp $D/host_$V.webm $D/host.webm; fi
echo "site set to $V"
