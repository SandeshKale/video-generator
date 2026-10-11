# avatar/words.json -> site/timing.js: SC (13 scene starts keyed to spoken words), WD (words), PG (caption pages), TOTAL, OFF
import json, re
D = json.load(open('avatar/words.json')); cuts = D['cuts']; TAIL = D['tail']
OFF = {1: 0.0}
for p in range(2, 7): OFF[p] = round(OFF[p - 1] + cuts[p - 2], 3)
TOTAL = round(OFF[6] + cuts[5] + TAIL, 3)
W = []
for p, w, s, e in D['words']:
    k = re.sub(r'[.,?!:…]', '', w).lower()
    W.append({'p': p, 'w': w, 'k': k, 's': round(s, 3), 'e': round(e, 3)})
def wtp(p, k, n=0):
    c = 0
    for x in W:
        if x['p'] == p and x['k'] == k:
            if c == n: return x['s']
            c += 1
    raise KeyError((p, k, n))
SC = [0.0, wtp(1, 'so') - .25, wtp(1, 'a', 2) - .3, OFF[2], wtp(2, 'now') - .3, OFF[3], wtp(3, 'the', 1) - .3, OFF[4], wtp(4, 'it') - .3,
      OFF[5], wtp(5, 'nothing') - .3, OFF[6], wtp(6, 'paper') - .3]
SC = [round(x, 3) for x in SC]
# caption pages: break at sentence end, part change, or > 50 chars (2 lines max at 46 px)
pages, cur = [], []
for i, x in enumerate(W):
    ln = len(' '.join(W[j]['w'] for j in cur + [i]))
    prev = W[cur[-1]] if cur else None
    if cur and (ln > 50 or re.search(r'[.?!]$', prev['w']) or prev['p'] != x['p']): pages.append(cur); cur = []
    cur.append(i)
if cur: pages.append(cur)
open('site/timing.js', 'w').write('window.SC=%s;window.WD=%s;window.PG=%s;window.TOTAL=%s;window.OFF=%s;\n' % (json.dumps(SC), json.dumps(W), json.dumps(pages), TOTAL, json.dumps(OFF)))
print('total', TOTAL); print('scenes', SC); print('durations', [round(b - a, 2) for a, b in zip(SC, SC[1:] + [TOTAL])])
for p in pages: print('  ', ' '.join(W[i]['w'] for i in p))
