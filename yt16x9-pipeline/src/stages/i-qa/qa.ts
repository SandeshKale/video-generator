/**
 * BUILD_PLAN.md section 5.10. Hard fail = deterministic, no model, checked
 * FIRST. Soft fail = Jev, then human if confidence is low. Never invert
 * this order -- a fuzzy Jev check is not a substitute for ffprobe.
 */
import { runFfprobeJson } from "../../lib/ffmpeg";
import { measureLoudnessJson } from "../e-normalize-mix/duck-and-master";
import type { Edl } from "../../edl/schema";
import { assertAllCuesResolved } from "../../edl/schema";

export type QaResult = { pass: boolean; failures: string[] };

export async function runHardQaSuite(edl: Edl, renderedMp4Path: string): Promise<QaResult> {
  const failures: string[] = [];

  const probe = await runFfprobeJson(["-show_format", "-show_streams", renderedMp4Path]);
  const videoStream = probe.streams?.find((s: any) => s.codec_type === "video");
  if (videoStream?.width !== edl.render.width || videoStream?.height !== edl.render.height) {
    failures.push(`resolution mismatch: got ${videoStream?.width}x${videoStream?.height}`);
  }

  const renderedDuration = Number(probe.format?.duration ?? 0);
  const masterDuration = edl.audio.durationSec ?? 0;
  if (masterDuration > 0 && Math.abs(renderedDuration - masterDuration) > 0.25) {
    failures.push(`duration delta > 250ms: rendered=${renderedDuration}s master=${masterDuration}s`);
  }

  const loudness = await measureLoudnessJson(renderedMp4Path);
  const integrated = Number(loudness.input_i);
  if (integrated < -16 || integrated > -13) {
    failures.push(`integrated loudness ${integrated} LUFS outside [-16, -13] band`);
  }

  try {
    assertAllCuesResolved(edl);
  } catch (e) {
    failures.push((e as Error).message);
  }

  const ncLicenses = edl.legal.licenses.filter((l) => l.license !== "CC0" && l.license !== "CC-BY" && l.license !== "AUDIO_LIBRARY" && l.license !== "SAFELISTED");
  if (ncLicenses.length > 0) {
    failures.push(`license ledger contains disallowed license(s): ${ncLicenses.map((l) => l.id).join(", ")}`);
  }

  // TODO: blackdetect / silencedetect via ffmpeg filters (duration
  // threshold ~0.4s outside planned fades; noise=-40dB duration=2s on
  // voiced regions) -- add once real renders exist to tune thresholds
  // against, not against synthetic silence alone.

  return { pass: failures.length === 0, failures };
}
