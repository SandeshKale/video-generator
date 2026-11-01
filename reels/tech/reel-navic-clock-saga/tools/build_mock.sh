#!/bin/bash
# builds site3d/mock.js = head.js + mkDial (tail.js lines 21-22) + mockcode.js   (v4 mockup only)
cd "$(dirname "$0")/../site3d" && { cat head.js; sed -n 21,22p tail.js; cat mockcode.js; } > mock.js && echo built mock.js
