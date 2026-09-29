/**
 * Programmatic legal gates (BUILD_PLAN.md section 8 / hardened spec
 * section 8). These are hard, deterministic filters -- never a Jev call,
 * never a "looks fine" judgment. A result that fails these must never
 * reach an EDL.
 */

export type FreesoundLicense = "Creative Commons 0" | "Attribution" | "Attribution Noncommercial";

export function isFreesoundLicenseSafe(license: string): boolean {
  // Freesound's API returns license as a full URL or name depending on
  // endpoint version -- normalize before calling this. CC-BY-NC is the
  // one hard exclusion: monetized YouTube is commercial use.
  const blocked = ["noncommercial", "nc/", "by-nc"];
  return !blocked.some((b) => license.toLowerCase().includes(b));
}

export function requiresAttribution(license: string): boolean {
  return license.toLowerCase().includes("by") && !license.toLowerCase().includes("cc0");
}

/** Pexels/Pixabay: both ban unaltered standalone resale (not triggered by
 * a produced/edited video) but neither clears third-party rights in
 * identifiable people or brand logos in the footage. v1 = manual review
 * flag only; a real face/logo detector is an explicit [U] in
 * BUILD_PLAN.md section 12 -- don't build one before choosing it deliberately. */
export function flagForManualReview(assetMetadata: { peopleCount?: number; hasRecognizableBrand?: boolean }): boolean {
  return (assetMetadata.peopleCount ?? 0) > 0 || !!assetMetadata.hasRecognizableBrand;
}
