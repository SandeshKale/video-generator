/**
 * Burns in word-level captions from edl.captions.words (already grouped
 * from ElevenLabs character-level alignment -- see
 * src/stages/e-normalize-mix/captions.ts). Keep this band's vertical
 * position inside the on-device-verified safe zone (BUILD_PLAN.md
 * section 11) once real screenshots exist -- the placement below is a
 * starting guess, not a verified value.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const CaptionBand: React.FC<{ words: { t0: number; t1: number; w: string }[] }> = ({
  words,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tSec = frame / fps;

  const activeWindow = words.filter((w) => w.t0 <= tSec + 1.2 && w.t1 >= tSec - 0.2 && w.t0 <= tSec + 3);
  const line = activeWindow
    .slice(0, 8)
    .map((w) => (w.t0 <= tSec && w.t1 >= tSec ? `**${w.w}**` : w.w))
    .join(" ");

  if (!line) return null;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 220 }}>
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          color: "#F1F3F8",
          textShadow: "0 4px 12px rgba(0,0,0,.6), 0 1px 3px rgba(0,0,0,.85)",
          maxWidth: "80%",
          textAlign: "center",
        }}
      >
        {line}
      </div>
    </AbsoluteFill>
  );
};
