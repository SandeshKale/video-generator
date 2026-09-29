/**
 * Remotion entry point. `durationInFrames` and `defaultProps.edl` below are
 * a hardcoded hello-world fixture (60s, one placeholder scene) so
 * `bun run remotion:studio` and `bun run remotion:render` work out of the
 * box on a fresh checkout -- per BUILD_PLAN.md Week 1 milestone. Replace
 * `defaultProps` with a real EDL loaded from the artifact store once
 * stage F (bind-edl) exists; never hand Remotion a hand-edited EDL object
 * in production code.
 */
import React from "react";
import { Composition } from "remotion";
import { MasterVideo } from "./MasterVideo";
import { EdlSchema, PIPELINE_FPS, PIPELINE_WIDTH, PIPELINE_HEIGHT, type Edl } from "../../edl/schema";

const helloWorldEdl: Edl = EdlSchema.parse({
  schema: "yt16x9.edl.v1",
  videoId: "hello-world",
  identity: {
    palette: ["#0B1220", "#E8F1FF", "#FF4D2E"],
    typePair: ["Neue Haas Grotesk", "IBM Plex Mono"],
    motionMotif: "hello-world",
    lutId: "none",
    lutMix: 0,
    grainOpacity: 0,
  },
  audio: {},
  captions: { words: [] },
  visuals: [
    { sentenceId: "s0", kind: "graphic", component: "Placeholder", fromSec: 0, toSec: 60 },
  ],
  render: { fps: PIPELINE_FPS, width: PIPELINE_WIDTH, height: PIPELINE_HEIGHT, durationInFrames: 60 * PIPELINE_FPS, tailPadFrames: 0 },
});

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MasterVideo"
      component={MasterVideo}
      durationInFrames={helloWorldEdl.render.durationInFrames ?? 60 * PIPELINE_FPS}
      fps={PIPELINE_FPS}
      width={PIPELINE_WIDTH}
      height={PIPELINE_HEIGHT}
      defaultProps={{ edl: helloWorldEdl }}
    />
  );
};
