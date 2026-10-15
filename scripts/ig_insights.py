#!/usr/bin/env python3
"""Instagram performance → next-reel decision, for @sandesh.explains (standing rule in CLAUDE.md).

Uses instaloader (MIT) to read the public stats of every post, matches each post to its reel folder
in this repo by caption similarity, then ranks what works by the tags in insights/reel-tags.json
(genre, company, voice, host, length) and writes insights/report.md.

  # 1) fetch (run on your own machine; Instagram blocks anonymous requests from cloud IPs with 429)
  pip install instaloader
  instaloader --login sandesh.explains          # once; stores a session file locally, password never leaves your machine
  python3 scripts/ig_insights.py fetch --login sandesh.explains
  # 2) analyse (anywhere; reads insights/ig-posts.json, which holds stats only, no credentials)
  python3 scripts/ig_insights.py report

Never commit a session file or a password. insights/ig-posts.json contains only public post stats.
"""
import argparse, difflib, glob, json, os, re, statistics, sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INS = os.path.join(ROOT, 'insights')
POSTS = os.path.join(INS, 'ig-posts.json')
TAGS = os.path.join(INS, 'reel-tags.json')
USER = 'sandesh.explains'


def fetch(login, limit):
    import instaloader
    L = instaloader.Instaloader(download_pictures=False, download_videos=False, download_video_thumbnails=False,
                                download_comments=False, save_metadata=False, quiet=True, max_connection_attempts=2)
    if login:
        L.load_session_from_file(login)  # created by `instaloader --login <user>`; stays on this machine
    p = instaloader.Profile.from_username(L.context, USER)
    out = {'fetched_utc': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'followers': p.followers,
           'posts_total': p.mediacount, 'posts': []}
    for i, post in enumerate(p.get_posts()):
        if i >= limit:
            break
        out['posts'].append({
            'shortcode': post.shortcode, 'date_utc': post.date_utc.isoformat(), 'is_video': post.is_video,
            'typename': post.typename, 'likes': post.likes, 'comments': post.comments,
            'views': post.video_view_count if post.is_video else None,
            'plays': getattr(post, 'video_play_count', None) if post.is_video else None,
            'duration_s': post.video_duration if post.is_video else None,
            'caption': post.caption or '', 'hashtags': post.caption_hashtags,
        })
    os.makedirs(INS, exist_ok=True)
    json.dump(out, open(POSTS, 'w'), indent=1, ensure_ascii=False)
    print(f"saved {len(out['posts'])} posts → {os.path.relpath(POSTS, ROOT)}")


def norm(s):
    s = re.sub(r'[#@]\w+', ' ', s.lower())
    return re.sub(r'[^a-z0-9 ]+', ' ', s).split()


def repo_captions():
    caps = {}
    for f in glob.glob(os.path.join(ROOT, 'reels', '*', '*', 'caption.md')) + glob.glob(os.path.join(ROOT, 'gifs', '*', '*', 'linkedin.md')):
        folder = os.path.basename(os.path.dirname(f))
        caps.setdefault(folder, set(norm(open(f, encoding='utf-8').read())))
    return caps


STOP = set('the a an and or of to in on for is it its it s this that with you your i my me we at as be are was by from not but'.split())


def match(caption, caps):
    """Containment of the post's first ~80 content words in each folder's caption file (robust to edits and reordering)."""
    words = [w for w in norm(caption) if w not in STOP and len(w) > 2][:80]
    if not words:
        return None, 0.0
    best, score = None, 0.0
    for folder, vocab in caps.items():
        r = sum(w in vocab for w in words) / len(words)
        if r > score:
            best, score = folder, r
    return (best, score) if score >= 0.6 else (None, score)


def report():
    data = json.load(open(POSTS, encoding='utf-8'))
    tags = json.load(open(TAGS, encoding='utf-8')) if os.path.exists(TAGS) else {}
    caps = repo_captions()
    now = datetime.fromisoformat(data['fetched_utc'])
    rows = []
    for p in data['posts']:
        if not p['is_video']:
            continue
        v = p.get('plays') or p.get('views') or 0
        age_d = max(0.5, (now - datetime.fromisoformat(p['date_utc'])).total_seconds() / 86400)
        folder, conf = match(p['caption'] or '', caps)
        ins = p.get('insights') or {}
        reach = ins.get('reach') or v
        rows.append(dict(p, v=v, age_d=age_d, folder=folder, conf=conf, ins=ins,
                         sspk=1000 * ((ins.get('saves') or 0) + (ins.get('shares') or 0)) / reach if reach and ins else None,
                         fpk=1000 * (ins.get('follows') or 0) / reach if reach and ins.get('follows') is not None else None,
                         hold=(1 - ins['skip_rate']) if ins.get('skip_rate') is not None else None,
                         eng=(p['likes'] + p['comments']) / v if v else 0,
                         cpk=1000 * p['comments'] / v if v else 0))
    # posts younger than 2 days are still climbing: show them, but keep them out of the medians and tag ranking
    mature = [r for r in rows if r['age_d'] >= 2] or rows
    med_v = statistics.median([r['v'] for r in mature]) if mature else 0
    med_e = statistics.median([r['eng'] for r in mature]) if mature else 0
    med_ss = statistics.median([r['sspk'] for r in mature if r['sspk'] is not None] or [0])
    if not med_ss:  # most reels have 0 saves+shares: fall back to the mean so one save still counts
        med_ss = statistics.mean([r['sspk'] for r in mature if r['sspk'] is not None] or [0])
    # small samples: shrink engagement toward the median as if each reel had PRIOR extra views at median rate
    PRIOR = 150
    for r in rows:
        r['eng_s'] = (r['likes'] + r['comments'] + PRIOR * med_e) / (r['v'] + PRIOR)
    for r in rows:
        r['vx'] = r['v'] / med_v if med_v else 0
        r['score'] = 0.7 * r['vx'] + 0.3 * (r['eng_s'] / med_e if med_e else 0)  # reach first, then engagement quality
        if r['sspk'] is not None and med_ss:  # with Insights: saves+shares per reach is the strongest topic signal
            r['score'] = 0.5 * r['vx'] + 0.3 * (r['sspk'] / med_ss) + 0.2 * ((r['hold'] or 0) / 0.6)

    L = [f"# Instagram performance report: @{USER}", '',
         f"Fetched {data['fetched_utc']} · {data['followers']} followers · {len(rows)} reels analysed "
         f"({len(mature)} older than 2 days used for medians) · median views {med_v:,.0f} · median engagement {med_e:.1%}", '',
         '| # | Date | Views | ×median | Likes | Comments | Eng. | Saves+shares /1k reach | Follows /1k | 3-s hold | Avg watch s | Reel folder (match) | Caption start |',
         '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|']
    for i, r in enumerate(sorted(rows, key=lambda r: -r['score']), 1):
        young = ' (young)' if r['age_d'] < 2 else ''
        L.append(f"| {i} | {r['date_utc'][:10]}{young} | {r['v']:,} | {r['vx']:.2f} | {r['likes']:,} | {r['comments']:,} | {r['eng']:.1%} | "
                 f"{'' if r['sspk'] is None else f'{r[chr(115)+chr(115)+chr(112)+chr(107)]:.1f}'} | {'' if r['fpk'] is None else f'{r[chr(102)+chr(112)+chr(107)]:.1f}'} | "
                 f"{'' if r['hold'] is None else f'{r[chr(104)+chr(111)+chr(108)+chr(100)]:.0%}'} | {r['ins'].get('avg_watch_s', '')} | "
                 f"{r['folder'] or '?'} ({r['conf']:.2f}) | {(r['caption'] or '')[:60].replace('|', '/').replace(chr(10), ' ')} |")

    # tag ranking: mean ×median views and engagement per tag value (mature, matched posts only)
    by = {}
    for r in mature:
        t = tags.get(r['folder'] or '', {})
        for k, val in t.items():
            for v in (val if isinstance(val, list) else [val]):
                by.setdefault((k, v), []).append(r)
    L += ['', '## What works (tags from insights/reel-tags.json, posts older than 2 days)', '',
          '| Tag | Value | Reels | Mean ×median views | Mean engagement |', '|---|---|---:|---:|---:|']
    ranked = sorted(by.items(), key=lambda kv: -statistics.mean(x['vx'] for x in kv[1]))
    for (k, v), rs in ranked:
        L.append(f"| {k} | {v} | {len(rs)} | {statistics.mean(x['vx'] for x in rs):.2f} | {statistics.mean(x['eng'] for x in rs):.1%} |")
    unmatched = [r for r in rows if not r['folder']]
    if unmatched:
        L += ['', f"{len(unmatched)} reel(s) could not be matched to a repo folder; add them to reel-tags.json by shortcode if they matter."]
    L += ['', '## How to use this for the next reel', '',
          '1. Prefer tag values with ≥3 reels and mean ×median ≥ 1.2; treat single-reel results as hints, not evidence.',
          '2. Copy the hook pattern (first caption line, on-reel title) of the top 3 reels; avoid the patterns of the bottom 3.',
          '3. Record the evidence used in the new reel\'s script.md ("Why this reel" block) and re-run after it has been live 48 h.']
    out = os.path.join(INS, 'report.md')
    open(out, 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    print('\n'.join(L[:14 + min(10, len(rows))]))
    print(f"\nfull report → {os.path.relpath(out, ROOT)}")


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    f = sub.add_parser('fetch'); f.add_argument('--login'); f.add_argument('--limit', type=int, default=80)
    sub.add_parser('report')
    a = ap.parse_args()
    fetch(a.login, a.limit) if a.cmd == 'fetch' else report()
