#!/bin/bash
# Netlify build wrapper. TinaCMS's local build intermittently deadlocks
# during "Indexing local files" (upstream flakiness, seen locally and in
# CI). Cap each attempt and retry instead of letting the whole deploy
# hit Netlify's ~18-minute limit.
set -o pipefail

for attempt in 1 2 3; do
  echo "=== TinaCMS build attempt ${attempt} ==="
  if timeout -k 10 240 npm run build:cms; then
    echo "TinaCMS build OK on attempt ${attempt}"
    exec npx astro build
  fi
  echo "TinaCMS build attempt ${attempt} failed or timed out; cleaning up"
  pkill -f "tinacms" 2>/dev/null || true
  sleep 2
done

echo "TinaCMS build failed after 3 attempts"
exit 1
