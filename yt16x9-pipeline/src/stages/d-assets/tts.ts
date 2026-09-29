/**
 * BUILD_PLAN.md section 5.4. ElevenLabs plain (non-websocket) `.../with-timestamps`
 * endpoint -- the full script is known upfront, so streaming only adds
 * latency. Export/transcode immediately to 48kHz 16-bit PCM WAV (CBR) --
 * never hand Remotion a VBR MP3. Group character alignment into words with
 * src/stages/e-normalize-mix/captions.ts. Azure TTS (native word-level
 * WordBoundary events) is the fallback when that's worth more than v3's
 * audio tags.
 */
import type { ElevenLabsAlignment } from "../e-normalize-mix/captions";

export async function synthesizeVoiceWithTimestamps(
  _text: string,
  _voiceId: string,
): Promise<{ audioBase64: string; alignment: ElevenLabsAlignment }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set");
  throw new Error(
    "TODO Week 3: POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps " +
      "with model_id eleven_multilingual_v2 (or eleven_v3 for audio-tag expressiveness). " +
      "Chunk long scripts at paragraph boundaries if a single request degrades; stitch WAVs " +
      "with 80-120ms room-tone crossfades and offset the alignment of later chunks.",
  );
}
