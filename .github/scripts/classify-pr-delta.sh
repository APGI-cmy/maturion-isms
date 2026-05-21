#!/bin/bash
# Canonical PR delta classifier bridge.
# Reads newline-separated changed file paths from stdin and prints:
#   REBASE_ONLY_DELTA | ADMIN_ONLY_DELTA | SUBSTANTIVE_DELTA | GATE_CHANGE_DELTA
# Classification source of truth is resolve-active-pr-state.js.

set -euo pipefail

FILES_JSON="$(node -e 'const fs=require("fs");const lines=fs.readFileSync(0,"utf8").split(/\n/).map((v)=>v.trim()).filter(Boolean);process.stdout.write(JSON.stringify(lines));')"

CHANGED_FILES_JSON="${FILES_JSON}" BASE_SHA="${BASE_SHA:-}" HEAD_SHA="${HEAD_SHA:-}" \
  node .github/scripts/resolve-active-pr-state.js 2>/dev/null \
  | node -e 'const fs=require("fs");try{const v=JSON.parse(fs.readFileSync(0,"utf8"));process.stdout.write(String(v.delta_type||"SUBSTANTIVE_DELTA"));}catch{process.stdout.write("SUBSTANTIVE_DELTA");}'
