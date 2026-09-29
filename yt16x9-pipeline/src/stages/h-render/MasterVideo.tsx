/**
 * MasterVideo is a pure function of (edl, frame) -- same invariant as the
 * existing 9:16 repo's window.__seek(t): no wall-clock, no Date.now(), no
 * unseeded randomness. See BUILD_PLAN.md section 6.
 *
 * One <Sequence> per edl.visuals[] item. Captions come from
 * edl.captions.words (word-level, grouped from ElevenLabs' character-level
 * alignment upstream -- see src/stages/e-normalize-mix/captions.ts), never
 * re-parsed from script text at render time.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, useVideoConfig } from "remotion";
import type { Edl } from "../../edl/schema";
import { GraphicScene } from "./components/GraphicScene";
import { CaptionBand } from "./components/CaptionBand";

export const MasterVideo: React.FC<{ edl: Edl }> = ({ edl }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1220" }}>
      {edl.audio.masterUri ? (
        // Remotion consumes the single pre-mastered mix -- never re-mix
        // stems inside Chromium. See BUILD_PLAN.md section 5.8 step 7.
        <Audio src={edl.audio.masterUri} />
      ) : null}

      {edl.visuals.map((v, i) => {
        const from = Math.round(v.fromSec * fps);
        const durationInFrames = Math.max(1, Math.round((v.toSec - v.fromSec) * fps));
        return (
          <Sequence key={`${v.sentenceId}-${i}`} from={from} durationInFrames={durationInFrames}>
            <GraphicScene visual={v} identity={edl.identity} />
          </Sequence>
        );
      })}

      <CaptionBand words={edl.captions.words} />
    </AbsoluteFill>
  );
};
