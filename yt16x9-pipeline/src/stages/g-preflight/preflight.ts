/**
 * BUILD_PLAN.md section 5.10 ("Human (v1, non-optional)"). Render three
 * `remotion still` frames (hook, mid, payoff) BEFORE the full render, and
 * require a human (or, once error rates are measured, a Jev Noul check on
 * a frame description) to approve them. This is reliability, not
 * caution-for-its-own-sake -- catching a broken/glitched frame here is far
 * cheaper than discovering it after a full 8-10 minute render.
 */
import type { Edl } from "../../edl/schema";

export async function renderPreflightStills(edl: Edl): Promise<{ hook: string; mid: string; payoff: string }> {
  const total = edl.render.durationInFrames ?? 0;
  if (total === 0) throw new Error("renderPreflightStills: edl.render.durationInFrames is unset -- bind the EDL first (src/stages/f-bind-edl).");

  const frames = { hook: Math.round(total * 0.05), mid: Math.round(total * 0.5), payoff: Math.round(total * 0.92) };
  throw new Error(
    `TODO Week 7: for each of frames=${JSON.stringify(frames)}, run ` +
      `\`bunx remotion still src/stages/h-render/index.ts MasterVideo out.png --frame=<n> --props='<edl json>'\` ` +
      `and surface the three PNGs for human (or later, Jev Noul) approval before continuing to full render.`,
  );
}
