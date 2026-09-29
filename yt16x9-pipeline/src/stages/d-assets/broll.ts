/**
 * BUILD_PLAN.md section 5.7. Stock B-roll is SECONDARY illustration, not the
 * primary visual language (see src/stages/h-render/components/GraphicScene.tsx
 * and BUILD_PLAN.md section 2). Pexels: `Authorization: <key>` header, 200
 * req/hr / 20,000/mo. Pixabay: `key` query param, 100 req/60s, and its docs
 * REQUIRE caching search results for 24h -- build that cache before calling
 * live in a loop. Deduplicate by provider ID AND perceptual hash -- the same
 * clip appearing twice in one video is a fail.
 */

const pixabayCache = new Map<string, { result: unknown; cachedAt: number }>();
const PIXABAY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function searchPexelsVideo(_query: string): Promise<{ id: number; uri: string }[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error("PEXELS_API_KEY is not set");
  throw new Error("TODO Week 4: GET https://api.pexels.com/v1/videos/search?query=...&orientation=landscape");
}

export async function searchPixabayVideo(query: string): Promise<{ id: number; uri: string }[]> {
  const cached = pixabayCache.get(query);
  if (cached && Date.now() - cached.cachedAt < PIXABAY_CACHE_TTL_MS) {
    return cached.result as { id: number; uri: string }[];
  }
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) throw new Error("PIXABAY_API_KEY is not set");
  throw new Error("TODO Week 4: GET https://pixabay.com/api/videos/?key=...&q=...&orientation=horizontal, then cache the result.");
}

export function dedupeByIdAndHash<T extends { id: number | string; perceptualHash?: string }>(
  assets: T[],
): T[] {
  const seenIds = new Set<string>();
  const seenHashes = new Set<string>();
  return assets.filter((a) => {
    const idKey = String(a.id);
    if (seenIds.has(idKey)) return false;
    if (a.perceptualHash && seenHashes.has(a.perceptualHash)) return false;
    seenIds.add(idKey);
    if (a.perceptualHash) seenHashes.add(a.perceptualHash);
    return true;
  });
}
