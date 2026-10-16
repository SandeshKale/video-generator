#!/bin/bash
# Slow, polite Commons candidate search (rate limits): one query every 35 s, results in photos/candidates.txt
cd "$(dirname "$0")/.."
: > photos/candidates.txt
for q in "Nelson Dilipkumar" "Rajinikanth film actor" "multiplex cinema lobby India" "movie theatre auditorium empty seats" "cinema ticket counter queue India" "audience cinema hall India" "Sun Pictures" "Chennai cinema theatre"; do
  echo "== $q" >> photos/candidates.txt
  for k in 1 2 3; do python3 tools/commons.py "$q" 12 >> photos/candidates.txt 2>/tmp/cand_err.log && break; sleep 40; done
  sleep 35
done
echo DONE >> photos/candidates.txt
