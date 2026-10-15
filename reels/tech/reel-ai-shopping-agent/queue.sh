#!/bin/bash
cd "$(dirname "$0")"
while pgrep -f "imggen.py prompts.json" >/dev/null; do sleep 5; done
python3 imggen.py prompts2.json > imggen2.log 2>&1
python3 depthgen.py > depth.log 2>&1
