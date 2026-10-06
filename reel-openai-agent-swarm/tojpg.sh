#!/bin/bash
cd "$(dirname "$0")/shots"; for f in *.png; do j="${f%.png}.jpg"; [ -f "$j" ] || ffmpeg -y -loglevel error -i "$f" -q:v 3 "$j"; done; ls *.jpg | wc -l
