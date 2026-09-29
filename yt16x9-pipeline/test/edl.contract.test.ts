/**
 * BUILD_PLAN.md section 10 ("Test strategy — was absent, now mandatory").
 * EDL contract tests: this is the file that should grow every time a bug
 * turns out to be an EDL-shape problem in disguise (per the validation
 * doc's core finding: "every later reliability problem in the original
 * plan is an EDL problem in disguise").
 */
import { describe, expect, test } from "bun:test";
import {
  EdlSchema,
  computeDurationInFrames,
  assertAllCuesResolved,
  assertNoVoicedGaps,
  identityDiffersEnough,
  PIPELINE_FPS,
} from "../src/edl/schema";
import { groupCharsIntoWords } from "../src/stages/e-normalize-mix/captions";

const baseIdentity = {
  palette: ["#0B1220", "#E8F1FF", "#FF4D2E"],
  typePair: ["Neue Haas Grotesk", "IBM Plex Mono"] as [string, string],
  motionMotif: "pipe-and-packet",
  lutId: "kodak2383_d55_v2",
  lutMix: 0.35,
  grainOpacity: 0.08,
};

function baseEdl() {
  return EdlSchema.parse({
    schema: "yt16x9.edl.v1",
    videoId: "test-video",
    identity: baseIdentity,
    script: {
      sentences: [
        { id: "s001", text: "hello", provenance: "FACT", source: "https://example.com", cue: { visual: "GRAPHIC", graphic: "x" } },
      ],
    },
    audio: {},
    captions: { words: [] },
    visuals: [{ sentenceId: "s001", kind: "graphic", fromSec: 0, toSec: 5 }],
    render: { fps: PIPELINE_FPS, width: 1920, height: 1080, tailPadFrames: 30 },
  });
}

describe("EDL contract", () => {
  test("durationInFrames is derived from master audio duration, not guessed", () => {
    expect(computeDurationInFrames(512.44, 30)).toBe(Math.floor(512.44 * 30) + 30);
  });

  test("a cue with no resolved visual is a hard fail", () => {
    const edl = baseEdl();
    edl.visuals = [];
    expect(() => assertAllCuesResolved(edl)).toThrow();
  });

  test("a GAP-provenance sentence can never be voiced", () => {
    const edl = baseEdl();
    edl.script!.sentences[0]!.provenance = "GAP";
    expect(() => assertNoVoicedGaps(edl)).toThrow();
  });

  test("identity must differ from the previous video on >=2 axes", () => {
    const same = { ...baseIdentity };
    expect(identityDiffersEnough(baseIdentity, same)).toBe(false);

    const differentEnough = { ...baseIdentity, lutId: "other-lut", motionMotif: "grid-scan" };
    expect(identityDiffersEnough(baseIdentity, differentEnough)).toBe(true);
  });
});

describe("caption word grouping", () => {
  test("groups characters on whitespace into words with correct time spans", () => {
    const chars = "hi bob".split("");
    const alignment = {
      characters: chars,
      character_start_times_seconds: chars.map((_, i) => i * 0.1),
      character_end_times_seconds: chars.map((_, i) => i * 0.1 + 0.1),
    };
    const words = groupCharsIntoWords(alignment);
    expect(words.map((w) => w.w)).toEqual(["hi", "bob"]);
    expect(words[0]!.t0).toBeCloseTo(0);
  });

  test("drops ElevenLabs v3 audio-tag characters like [whispers]", () => {
    const text = "ok [whispers] now";
    const chars = text.split("");
    const alignment = {
      characters: chars,
      character_start_times_seconds: chars.map((_, i) => i * 0.1),
      character_end_times_seconds: chars.map((_, i) => i * 0.1 + 0.1),
    };
    const words = groupCharsIntoWords(alignment);
    expect(words.map((w) => w.w)).not.toContain("[whispers]");
  });
});
