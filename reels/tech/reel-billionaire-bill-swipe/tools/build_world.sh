#!/bin/bash
cd "$(dirname "$0")/../site3d" && cat src/a_engine.js src/b0_builders.js src/b1_scenes.js src/b2_scenes.js src/c_main.js > world.js && (bun build world.js --target=browser >/dev/null 2>&1 && echo built world.js: syntax ok || bun build world.js --target=browser 2>&1 | head -20)
