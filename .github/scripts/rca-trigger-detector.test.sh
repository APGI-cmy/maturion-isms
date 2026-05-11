#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DETECTOR_SCRIPT="${SCRIPT_DIR}/rca-trigger-detector.js"

PASS=0
FAIL=0

run_case() {
  local name="$1"
  local payload="$2"
  local expected_required="$3"
  local expected_failure_class="$4"

  local output required failure_class
  output="$(RCA_TRIGGER_INPUT_JSON="$payload" node "$DETECTOR_SCRIPT")"
  required="$(printf '%s\n' "$output" | node -e 'let data="";process.stdin.on("data",d=>data+=d);process.stdin.on("end",()=>process.stdout.write(JSON.parse(data).required ? "yes" : "no"));')"
  failure_class="$(printf '%s\n' "$output" | node -e 'let data="";process.stdin.on("data",d=>data+=d);process.stdin.on("end",()=>process.stdout.write(JSON.parse(data).failureClass || ""));')"

  if [[ "$required" == "$expected_required" && ( -z "$expected_failure_class" || "$failure_class" == *"$expected_failure_class"* ) ]]; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "❌ $name"
    echo "   expected required=$expected_required class~=$expected_failure_class"
    echo "   got required=$required class=$failure_class"
    FAIL=$((FAIL + 1))
  fi
}

run_case \
  "CS2 RCA_REQUIRED comment -> required" \
  '{"prNumber":1603,"headSha":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","isDraft":false,"actorLogin":"APGI-cmy","eventName":"issue_comment","commentBody":"RCA_REQUIRED","comments":[]}' \
  "yes" \
  "explicit CS2 RCA requirement"

run_case \
  "HANDOVER BLOCKED after handover claim -> required" \
  '{"prNumber":1603,"headSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","isDraft":false,"actorLogin":"github-actions[bot]","eventName":"issue_comment","commentBody":"","comments":[{"body":"handover complete","created_at":"2026-05-11T09:00:00Z"},{"body":"## 🚫 HANDOVER BLOCKED","created_at":"2026-05-11T09:02:00Z"}]}' \
  "yes" \
  "blocked handover after claim"

run_case \
  "Repeated stale CURRENT_HEAD_SHA after corrective push -> required" \
  '{"prNumber":1603,"headSha":"cccccccccccccccccccccccccccccccccccccccc","isDraft":false,"actorLogin":"github-actions[bot]","eventName":"pull_request","commentBody":"","comments":[{"body":"stale CURRENT_HEAD_SHA: 1111111","created_at":"2026-05-11T09:00:00Z"},{"body":"stale CURRENT_HEAD_SHA: 2222222","created_at":"2026-05-11T09:03:00Z"}]}' \
  "yes" \
  "stale-head handover evidence"

run_case \
  "First-pass draft ECAP evidence miss -> no marker" \
  '{"prNumber":1603,"headSha":"dddddddddddddddddddddddddddddddddddddddd","isDraft":true,"actorLogin":"github-actions[bot]","eventName":"pull_request","commentBody":"","comments":[{"body":"ECAP artifact missing","created_at":"2026-05-11T09:00:00Z"}]}' \
  "no" \
  ""

run_case \
  "Clean PR with green checks -> no marker" \
  '{"prNumber":1603,"headSha":"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee","isDraft":false,"actorLogin":"Copilot","eventName":"pull_request","commentBody":"","comments":[]}' \
  "no" \
  ""

run_case \
  "Cosmetic review comment -> no marker" \
  '{"prNumber":1603,"headSha":"ffffffffffffffffffffffffffffffffffffffff","isDraft":false,"actorLogin":"reviewer","eventName":"issue_comment","commentBody":"nit: typo in docs","comments":[{"body":"nit: typo in docs","created_at":"2026-05-11T09:00:00Z"}]}' \
  "no" \
  ""

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi
