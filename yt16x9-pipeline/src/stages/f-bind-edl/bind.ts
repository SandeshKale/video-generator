/**
 * BUILD_PLAN.md section 5 stage F. durationInFrames is ALWAYS derived from
 * the mastered audio -- never guessed upfront ("8-10 minutes" is a planning
 * estimate, not a render parameter). See principle 6, "Audio is the clock."
 */
import { computeDurationInFrames, assertAllCuesResolved, assertNoVoicedGaps, identityDiffersEnough, type Edl, type Identity } from "../../edl/schema";

export function bindDurationAndValidate(edl: Edl, previousIdentity?: Identity): Edl {
  if (edl.audio.durationSec == null) {
    throw new Error("bindDurationAndValidate: edl.audio.durationSec is not set -- master the audio mix before binding the EDL.");
  }

  assertNoVoicedGaps(edl);
  assertAllCuesResolved(edl);

  if (previousIdentity && !identityDiffersEnough(previousIdentity, edl.identity)) {
    throw new Error("EDL identity does not differ from the previously shipped video on >=2 axes -- see BUILD_PLAN.md section 2's per-video identity rule.");
  }

  return {
    ...edl,
    render: {
      ...edl.render,
      durationInFrames: computeDurationInFrames(edl.audio.durationSec, edl.render.tailPadFrames),
    },
  };
}
