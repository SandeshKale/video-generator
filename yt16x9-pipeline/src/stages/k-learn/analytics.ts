/**
 * BUILD_PLAN.md section 5.12. v2 nice-to-have, not a Week 1-10 blocker.
 * After 48-72h, pull retention curve + CTR from YouTube Analytics and
 * store it against the EDL's chapter timestamps so the next script
 * generation prompt (src/stages/c-script) can reference concrete
 * drop-off data instead of folklore ("last video dropped 18% at 3:10
 * where we stayed on one graphic for 40s").
 */

export async function pullRetentionCurve(_videoId: string): Promise<{ tSec: number; audienceRetentionPct: number }[]> {
  throw new Error("TODO Week 12: YouTube Analytics API, averageViewPercentage + audienceRetention report, keyed by chapter timestamps from the published EDL.");
}
