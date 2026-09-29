/**
 * Every paid API call (ElevenLabs, Flux/fal.ai, Claude/GPT, Jev) is keyed
 * by (videoId, step, inputHash) -- a retry must replay from cache, never
 * re-bill. See BUILD_PLAN.md principle 9. Backed by DATABASE_URL (Postgres)
 * for v1; swap the two functions below for a real client without touching
 * call sites once chosen (postgres.js / drizzle, not decided yet -- see
 * BUILD_PLAN.md section "Open implementation choices").
 */
import { createHash } from "node:crypto";

export function inputHash(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16);
}

export type CacheKey = { videoId: string; step: string; inputHash: string };

// TODO(week 9): back these with Postgres. In-memory stub only proves the
// call-site shape compiles; it provides zero real idempotency across
// process restarts and must not be relied on past local dev.
const memoryCache = new Map<string, unknown>();

function keyToString(k: CacheKey): string {
  return `${k.videoId}:${k.step}:${k.inputHash}`;
}

export async function getCached<T>(key: CacheKey): Promise<T | undefined> {
  return memoryCache.get(keyToString(key)) as T | undefined;
}

export async function setCached<T>(key: CacheKey, value: T): Promise<void> {
  memoryCache.set(keyToString(key), value);
}

/** Wrap any paid call: `await withCache({videoId, step: "tts", inputHash: inputHash(script)}, () => callElevenLabs(script))`. */
export async function withCache<T>(key: CacheKey, fn: () => Promise<T>): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached !== undefined) return cached;
  const result = await fn();
  await setCached(key, result);
  return result;
}
