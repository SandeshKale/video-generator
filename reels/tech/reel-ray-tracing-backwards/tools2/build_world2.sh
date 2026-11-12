#!/bin/bash
cd "$(dirname "$0")/../site3d2" && cat src/a_engine.js src/b0_builders.js src/b1_world.js src/c_main.js > world.js && (bun build world.js --target=browser >/dev/null 2>&1 && echo built world.js: syntax ok || bun build world.js --target=browser 2>&1 | head -20)
