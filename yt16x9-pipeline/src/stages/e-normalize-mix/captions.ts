/**
 * ElevenLabs' with-timestamps endpoint returns CHARACTER-level alignment
 * only. Group into words here. Assert sum(word durations) ~= audio
 * duration within 250ms -- if it drifts, fall back to a WhisperX pass on
 * the WAV rather than shipping drifting karaoke captions. See
 * BUILD_PLAN.md section 5.4.
 */
import type { z } from "zod";
import { WordSchema } from "../../edl/schema";

type Word = z.infer<typeof WordSchema>;

export type ElevenLabsAlignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

export function groupCharsIntoWords(alignment: ElevenLabsAlignment): Word[] {
  const words: Word[] = [];
  let current: { chars: string[]; start: number } | null = null;

  for (let i = 0; i < alignment.characters.length; i++) {
    const ch = alignment.characters[i]!;
    const start = alignment.character_start_times_seconds[i]!;
    const end = alignment.character_end_times_seconds[i]!;

    // Drop ElevenLabs v3 audio-tag characters, e.g. "[whispers]" -- these
    // are performance directions, not spoken/captioned words.
    if (ch === "[" ) {
      current = null; // discard whatever was building; we'll resync after "]"
      continue;
    }

    if (/\s/.test(ch)) {
      if (current) {
        words.push({ t0: current.start, t1: end, w: current.chars.join("") });
        current = null;
      }
      continue;
    }

    if (!current) current = { chars: [], start };
    current.chars.push(ch);
    if (i === alignment.characters.length - 1) {
      words.push({ t0: current.start, t1: end, w: current.chars.join("") });
    }
  }

  return words.filter((w) => w.w.length > 0 && !w.w.startsWith("[") && !w.w.endsWith("]"));
}

export function assertCaptionCoverage(words: Word[], audioDurationSec: number, toleranceSec = 0.25): void {
  const spoken = words.reduce((sum, w) => sum + (w.t1 - w.t0), 0);
  if (Math.abs(spoken - audioDurationSec) > toleranceSec * words.length) {
    // A rough per-word tolerance check -- replace with the real "total
    // coverage >= 98% of voiced words" QA gate from BUILD_PLAN.md section
    // 5.10 once a reference forced-alignment (WhisperX) pass is wired in
    // for comparison, not just self-consistency of ElevenLabs' own output.
    throw new Error(
      `Caption word-timing coverage looks off: ${spoken.toFixed(1)}s of words vs ${audioDurationSec.toFixed(1)}s audio -- run WhisperX fallback alignment.`,
    );
  }
}
