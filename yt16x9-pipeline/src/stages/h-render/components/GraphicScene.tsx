/**
 * Placeholder for the "graphic-first" scene components required by
 * BUILD_PLAN.md section 2: original motion graphics (diagrams, kinetic
 * type, labeled systems) as the PRIMARY visual language, with stock B-roll
 * as secondary illustration only. Build 2-3 real scene types here before
 * writing any script-generation code (Week 5 of the roadmap) -- this file
 * intentionally renders a visibly-a-placeholder frame so nobody mistakes a
 * stub for a finished component in a preflight-stills review.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import type { Identity } from "../../../edl/schema";
import type { z } from "zod";
import type { VisualSchema } from "../../../edl/schema";

type Visual = z.infer<typeof VisualSchema>;

export const GraphicScene: React.FC<{ visual: Visual; identity: Identity }> = ({
  visual,
  identity,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity,
        color: identity.palette[1] ?? "#E8F1FF",
        background: identity.palette[0] ?? "#0B1220",
        fontFamily: identity.typePair[1],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
      }}
    >
      TODO: {visual.kind} scene — "{visual.component ?? "unbuilt"}"
    </AbsoluteFill>
  );
};
