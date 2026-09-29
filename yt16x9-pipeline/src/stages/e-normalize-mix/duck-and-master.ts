/**
 * Ducking + mastering, in order (BUILD_PLAN.md section 5.8). Pedalboard
 * does NOT do sidechain ducking (spotify/pedalboard#254 is open, unresolved)
 * -- ffmpeg's native sidechaincompress filter does. loudnorm runs LAST, on
 * the already-ducked mix, never before. Tune the ducking threshold against
 * the PRE-loudnorm signal (see the validation doc's additional finding
 * 3.5.3) -- verify with real voice peaks, 0.03 is a starting point only.
 */
import { runFfmpeg } from "../../lib/ffmpeg";

export async function duckMusicUnderVoice(
  musicWavPath: string,
  voiceWavPath: string,
  outPath: string,
  opts: { threshold?: number; ratio?: number; attackMs?: number; releaseMs?: number } = {},
): Promise<void> {
  const { threshold = 0.03, ratio = 8, attackMs = 20, releaseMs = 300 } = opts;
  await runFfmpeg([
    "-i", musicWavPath,
    "-i", voiceWavPath,
    "-filter_complex",
    `[1:a]asplit[sc][vox];[sc][0:a]sidechaincompress=threshold=${threshold}:ratio=${ratio}:attack=${attackMs}:release=${releaseMs}[duck];[duck][vox]amix=inputs=2:normalize=0[a]`,
    "-map", "[a]",
    outPath,
  ]);
}

/** YouTube turns loud files DOWN to ~-14 LUFS; it does not turn quiet files
 * up. Master near -14 to -15 LUFS integrated, true peak <= -1.5 dBTP --
 * never broadcast -23 LUFS. [S, no single official YouTube LUFS spec --
 * measure against real uploads once you have them; see BUILD_PLAN.md
 * section 5.8 and the hardened spec's own [S] flag on this figure.] */
export async function masterLoudness(inPath: string, outPath: string): Promise<void> {
  await runFfmpeg([
    "-i", inPath,
    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
    "-ar", "48000",
    outPath,
  ]);
}

export async function measureLoudnessJson(inPath: string): Promise<{ input_i: string; input_tp: string }> {
  const proc = Bun.spawn(
    ["ffmpeg", "-i", inPath, "-af", "loudnorm=print_format=json", "-f", "null", "-"],
    { stderr: "pipe" },
  );
  const stderr = await new Response(proc.stderr).text();
  await proc.exited;
  const jsonStart = stderr.lastIndexOf("{");
  const jsonEnd = stderr.lastIndexOf("}");
  return JSON.parse(stderr.slice(jsonStart, jsonEnd + 1));
}
