#!/usr/bin/env python3
"""Lint a reel's avatar-prompts.md against every avatar rule the creator has given so far.

Usage: python3 scripts/check-avatar-prompts.py reel-x/avatar-prompts.md

The rules, their sources and the reasoning behind them live in AVATAR-PROMPT-TEMPLATE.md
("Rules log"). Run this before delivering prompts; a FAIL must be fixed, and a WARN must be
justified in the delivery message.
"""
import re
import sys

REQUIRED = [  # (substring, rule id)
    ('match the photo exactly in every frame', 'R1 identity lock'),
    ('camera locked on a tripod', 'R2 locked camera'),
    ('Keep framing, light and attire identical across all parts', 'R2 continuity across parts'),
    ('always return to the lens', 'R6 gaze on the lens'),
    ('Never stare, never look away', 'R6 gaze on the lens'),
    ('none in the first second', 'R7 blinks'),
    ('At most two small nods', 'R8 restraint: nods'),
    ('slightly restrained gestures', 'R14 hands: subtle, restrained'),
    ('Natural five-finger hands, no pointing at the camera', 'R14 hands: guardrails'),
    ('from mid-chest up', 'R14 framing shows the hands'),
    ('dry, no echo or reverb', 'R15 voice: dry, close-mic'),
    ('Natural pitch movement', 'R15 voice: tonal movement'),
    ('No wide smiles, no raised-brow acting', 'R8 restraint: face'),
    ('at most one lightly stressed word per sentence', 'R9 voice'),
    ('No announcer tone', 'R9 voice'),
    ('PRONUNCIATION:', 'R11 pronunciation line'),
    ('MOOD BY SECTION:', 'R5 mood by section'),
    ('Finish by about 14.2 s', 'R12 timing'),
    ('any on-screen text or subtitles', 'R13 no burned-in text'),
]
HOOK = '0-3s ENTHUSIASTIC AND ENGAGING'
# R16: comedy/roast hosts are expressive (creator: "no deadpan hosting"). A prompt that declares the
# expressive performance block swaps the R8 face line for its own anti-mugging guardrails.
EXPRESSIVE = 'PERFORMANCE (expressive and playful, never over the top):'
EXPRESSIVE_FACE = 'No mugging, no cartoonish faces, no wide-eyed acting'
# R17: when the creator asks for maximum pace (19 Oct 2026: "avatar videos need to be as fast as they can be"), a prompt declares
# FAST and may carry up to ~48 words per 15 s part, delivered quickly but clearly (no rushing that drops syllables).
FAST = 'PACE: FAST AND PUNCHY'
# Words that have needed a respelling before; if one is spoken in a part, its PRONUNCIATION line must cover it.
RISKY = ['Claude', 'Klaw-dex', 'Codex', 'Astra', 'TradingView', 'Co-work', 'Cowork', 'SEBI', 'G P T', 'tokenizer', 'web-hook', 'Pine Script', 'Ollama']


def parts(md):
    out = []
    for m in re.finditer(r'## Part (\d+) of (\d+)[^\n]*\n\n```\n(.*?)\n```', md, re.S):
        out.append((int(m.group(1)), int(m.group(2)), m.group(3)))
    return out


def main(path):
    md = open(path, encoding='utf8').read()
    ps = parts(md)
    fails, warns = [], []
    if not ps:
        print('FAIL: no "## Part N of M" prompt blocks found'); return 1
    first = {}
    for n, tot, body in ps:
        tag = f'P{n}'
        if len(body) > 4000: fails.append(f'{tag}: {len(body)} characters > 4000 (R3 hard limit)')
        elif len(body) > 3400: warns.append(f'{tag}: {len(body)} characters (template guideline ~2.6-3.4k since R14/R15; every extra directive gets over-performed)')
        if 'No hand gestures' in body: fails.append(f'{tag}: says "No hand gestures"; superseded by R14 (subtle, restrained gestures)')
        expressive = EXPRESSIVE in body
        for s, rid in REQUIRED:
            if expressive and rid == 'R8 restraint: face':
                s, rid = EXPRESSIVE_FACE, 'R16 expressive host: anti-mugging guardrail'
            if s not in body: fails.append(f'{tag}: missing "{s}" ({rid})')
        for key in ('IDENTITY:', 'FRAMING:'):
            line = next((l for l in body.splitlines() if l.startswith(key)), '')
            first.setdefault(key, line)
            if line != first[key]: fails.append(f'{tag}: {key} line differs from Part 1 (R2 continuity)')
        mood = next((l for l in body.splitlines() if l.startswith('MOOD BY SECTION:')), '')
        timing = next((l for l in body.splitlines() if l.startswith('TIMING:')), '')
        script = re.search(r'SCRIPT: "(.*?)"\n', body, re.S)
        script = script.group(1) if script else ''
        pron = next((l for l in body.splitlines() if l.startswith('PRONUNCIATION:')), '')
        if n == 1:
            if HOOK not in mood: fails.append(f'P1: hook must start "{HOOK}" (R4: creator asked for an enthusiastic, engaging 0-3 s hook)')
            if 'no shouting, no wide-eyed acting, no head bobbing' not in mood: fails.append('P1: hook lost its natural-limits clause (R4)')
            if 'begin speaking at 0.0 s' not in timing: fails.append('P1: must begin speaking at 0.0 s (R12)')
            cues = len(re.findall(r" on '", mood.split(';', 1)[1] if ';' in mood else ''))
        else:
            if HOOK in mood: fails.append(f'{tag}: the energetic hook belongs to Part 1 only (R4)')
            if 'begin speaking at about 0.3 s' not in timing: warns.append(f'{tag}: approved parts begin at about 0.3 s (R12)')
            cues = len(re.findall(r" on '", mood))
        sections = len(re.findall(r'\d+-\d+s', mood))
        if sections < 2: fails.append(f'{tag}: MOOD needs 2-3 time sections (R5)')
        if cues > max(2, sections): fails.append(f'{tag}: {cues} word-anchored cues in MOOD; max one per section (R5: never per word)')
        if cues == 0: warns.append(f'{tag}: no word-anchored cue; R10 asks expressions/nods to match the script on its key line')
        words = len(script.split())
        cap = 48 if FAST in body else 34
        if words > cap: fails.append(f'{tag}: {words} words; > ~{cap} overruns 15 s at this pace (R12/R17)')
        if FAST in body and words < 36: warns.append(f'{tag}: FAST part with only {words} words; pack it to ~40-46 (R17)')
        if re.search(r'\b(um|uh|erm)\b', script, re.I): fails.append(f'{tag}: synthetic fillers in SCRIPT (R9: no um/uh)')
        if re.search(r'[0-9&%=/@#]', script): fails.append(f'{tag}: digits or symbols in SCRIPT; write them as spoken (R11)')
        for w in RISKY:
            if w.lower() in script.lower() and w.split()[0].lower() not in pron.lower():
                fails.append(f'{tag}: "{w}" is spoken but not in PRONUNCIATION (R11)')
    for f in fails: print('FAIL', f)
    for w in warns: print('WARN', w)
    print(f'{len(ps)} parts · {len(fails)} fail · {len(warns)} warn')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
