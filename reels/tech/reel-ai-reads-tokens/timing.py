# avatar/words.json -> site/timing.js (scene starts, words, caption pages split at REAL o200k token boundaries) + events.json (SFX/music hits)
import json, re, tiktoken
enc = tiktoken.get_encoding('o200k_base')
D = json.load(open('avatar/words.json')); cuts = D['cuts']; TAIL = D['tail']
OFF = {1: 0.0}
for p in range(2, 6): OFF[p] = round(OFF[p - 1] + cuts[p - 2], 3)
TOTAL = round(OFF[5] + cuts[4] + TAIL, 3)
W = []
for p, w, s, e in D['words']:
    k = re.sub(r'[.,?!:…]', '', w).lower()
    if not W or W[-1]['p'] != p: w = w[0].upper() + w[1:]
    W.append({'p': p, 'w': w, 'k': k, 's': round(s, 3), 'e': round(e, 3)})
def wtp(p, k, n=0):
    c = 0
    for x in W:
        if x['p'] == p and x['k'] == k:
            if c == n: return x['s']
            c += 1
    raise KeyError((p, k, n))
SC = [0.0, wtp(1, 'to') - .25, wtp(1, "here's") - .3, wtp(2, 'in') - .3, wtp(2, "that's") - .3, OFF[3], wtp(3, 'and') - .3, OFF[4], wtp(4, 'when') - .3, OFF[5], wtp(5, "i'm") - .3]
SC = [round(x, 3) for x in SC]
# caption pages: break at sentence end, part change, or > 34 chars; then tokenize the page text and map tokens -> word index
pages, cur = [], []
for i, x in enumerate(W):
    ln = len(' '.join(W[j]['w'] for j in cur + [i]))
    prev = W[cur[-1]] if cur else None
    if cur and (ln > 34 or re.search(r'[.?!]$', prev['w']) or prev['p'] != x['p']): pages.append(cur); cur = []
    cur.append(i)
if cur: pages.append(cur)
PG = []
for pg in pages:
    text, starts = '', []
    for j, i in enumerate(pg):
        if j: text += ' '
        starts.append(len(text)); text += W[i]['w']
    ids = enc.encode(text); toks, pos = [], 0
    for tid in ids:
        piece = enc.decode([tid]); a = pos; pos += len(piece)
        c = a + (len(piece) - len(piece.lstrip(' ')))       # first non-space char
        wi = max(j for j, st in enumerate(starts) if st <= max(c, 0))
        toks.append([piece, pg[wi]])
    PG.append({'w': pg, 't': toks})
open('site/timing.js', 'w').write('window.SC=%s;window.WD=%s;window.PG=%s;window.TOTAL=%s;window.OFF=%s;\n' % (json.dumps(SC), json.dumps(W, ensure_ascii=False), json.dumps(PG, ensure_ascii=False), TOTAL, json.dumps(OFF)))
print('total', TOTAL, 'scenes', SC); print(len(W), 'words', len(PG), 'pages', max(len(p['t']) for p in PG), 'max tokens/page')
for p in PG: print('  |'.join(t[0] for t in p['t']))
