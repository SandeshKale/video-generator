/**
 * BUILD_PLAN.md section 5.6 (mandatory, new vs. the original plan) +
 * validation doc section 3.5.2. v1 = YouTube Audio Library tracks only,
 * downloaded manually into assets/music/ with license+attribution flags in
 * this ledger -- zero Content ID risk. v2 = Epidemic Sound Partner API
 * (developers.epidemicsound.com, confirmed real but partnership-gated --
 * do not plan on it before a partnership is signed). NEVER Suno/Udio/
 * "no copyright" MP3 sites as a production music bed -- unbounded claim risk.
 *
 * Note (Claude's own addition, not in the source critiques): Audio Library
 * tracks are recognizable precisely because so many channels use them --
 * weigh moving to a channel-safelisted paid library sooner than "when
 * volume justifies it" if a distinct sonic identity matters from video 1.
 */
import { z } from "zod";

export const MusicLedgerEntrySchema = z.object({
  trackId: z.string(),
  filePath: z.string(),
  license: z.literal("AUDIO_LIBRARY"),
  energy: z.enum(["low", "mid", "high"]),
  requiresAttribution: z.boolean(),
  attributionText: z.string().optional(),
});
export type MusicLedgerEntry = z.infer<typeof MusicLedgerEntrySchema>;

export async function selectMusicForChapter(
  ledger: MusicLedgerEntry[],
  desiredEnergy: "low" | "mid" | "high",
): Promise<MusicLedgerEntry> {
  const candidates = ledger.filter((t) => t.energy === desiredEnergy);
  if (candidates.length === 0) {
    throw new Error(`No ledger tracks tagged energy="${desiredEnergy}" -- add tracks to assets/music/ledger.json before this can resolve.`);
  }
  // Math.random() is fine here -- this runs once at asset-build time, not
  // inside MasterVideo's per-frame render path, so it doesn't violate the
  // "pure function of frame" rule in src/stages/h-render/MasterVideo.tsx.
  return candidates[Math.floor(Math.random() * candidates.length)]!;
}
