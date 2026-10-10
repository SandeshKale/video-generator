#!/bin/bash
cd /home/user/video-generator/reel-plate-reader
while kill -0 358 2>/dev/null; do sleep 20; done
python3 imggen.py prompts2.json > imggen2.log 2>&1
