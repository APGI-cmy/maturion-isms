#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RULE_SCRIPT="${SCRIPT_DIR}/gate-changing-pr-rule.sh"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$TEST_ROOT"' EXIT
PASS=0
FAIL=0

run_case() {
  local name="$1"
  local expected_exit="$2"
  local expected_text="$3"
  local setup_fn="$4"

  local ws
  ws="$(mktemp -d -p "$TEST_ROOT")"
  pushd "$ws" >/dev/null

  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"
  mkdir -p .github/workflows .github/scripts .admin/prs
  cat > .github/workflows/sample.yml <<'EOF'
name: sample
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
EOF
  cat > .github/scripts/sample.sh <<'EOF'
#!/usr/bin/env bash
echo "ok"
EOF
  chmod +x .github/scripts/sample.sh
  git add .
  git commit -q -m "base"
  git branch -M main
  git checkout -q -b feature

  PR_BODY=""
  PR_COMMENTS_OVERRIDE=""
  PR_LABELS=""
  "$setup_fn"

  local base_sha output exit_code
  base_sha="$(git rev-parse main)"
  set +e
  output="$(
    BASE_SHA="$base_sha" \
    PR_NUMBER="9999" \
    PR_BODY="$PR_BODY" \
    PR_LABELS="$PR_LABELS" \
    PR_COMMENTS_OVERRIDE="$PR_COMMENTS_OVERRIDE" \
    GITHUB_REPOSITORY="APGI-cmy/maturion-isms" \
    bash "$RULE_SCRIPT" 2>&1
  )"
  exit_code=$?
  set -e

  if [[ "$exit_code" -eq "$expected_exit" ]] && grep -q "$expected_text" <<<"$output"; then
    echo "✅ $name"
    PASS=$((PASS + 1))
  else
    echo "❌ $name"
    echo "   expected exit: $expected_exit, actual: $exit_code"
    echo "   expected output to contain: $expected_text"
    echo "   --- output ---"
    echo "$output"
    echo "   --------------"
    FAIL=$((FAIL + 1))
  fi

  popd >/dev/null
}

setup_operational_no_claim() {
  sed -i 's/actions\/checkout@v4/actions\/checkout@v5/' .github/workflows/sample.yml
  git add .github/workflows/sample.yml
  git commit -q -m "workflow operational action bump"
}

setup_operational_with_claim_missing_evidence() {
  setup_operational_no_claim
  PR_BODY="merge-ready: please handover now"
}

setup_strict_logic_change_no_evidence() {
  cat > .github/scripts/pre-handover-checkpoint.sh <<'EOF'
#!/usr/bin/env bash
echo "checkpoint"
EOF
  git add .github/scripts/pre-handover-checkpoint.sh
  git commit -q -m "strict script gate logic change"
}

setup_pure_action_upgrade_with_evidence() {
  setup_operational_no_claim
  PR_COMMENTS_OVERRIDE=$'ACTIONS_DEPRECATION_GATE_RUN_ID: 123456789\nACTIONS_DEPRECATION_GATE_URL: https://github.com/APGI-cmy/maturion-isms/actions/runs/123456789\nAFFECTED_WORKFLOW_RUNS_GREEN_ON_HEAD: yes\nNO_BANNED_ACTION_VERSIONS_REMAIN: yes'
}

setup_operational_with_comment_run_evidence() {
  setup_operational_no_claim
  PR_COMMENTS_OVERRIDE=$'Validated affected workflow on HEAD 82edcaa6252205ab2556c34cc849f2688e394537\nhttps://github.com/APGI-cmy/maturion-isms/actions/runs/26022786232'
}

echo "=== Gate-Changing PR Rule Regression ==="
run_case \
  "operational workflow change + no claim + no evidence => advisory/no hard fail" \
  0 \
  "RESULT: CHECKPOINT_REQUIRED" \
  setup_operational_no_claim

run_case \
  "operational workflow change + explicit handover claim + missing evidence => hard fail" \
  1 \
  "RESULT: STOP_AND_FIX" \
  setup_operational_with_claim_missing_evidence

run_case \
  "strict gate-logic change without evidence => hard fail" \
  1 \
  "STRICT_GATE_LOGIC_CHANGE without required evidence" \
  setup_strict_logic_change_no_evidence

run_case \
  "pure action-version upgrade with concrete proof => pass" \
  0 \
  "PURE_ACTION_VERSION_BUMP_SHORTCUT: PASS" \
  setup_pure_action_upgrade_with_evidence

run_case \
  "operational workflow change + concrete PR comment run evidence => pass" \
  0 \
  "Concrete gate evidence found" \
  setup_operational_with_comment_run_evidence

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi
