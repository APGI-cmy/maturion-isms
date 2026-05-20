#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROUTER_SCRIPT="${SCRIPT_DIR}/admin-control-router.js"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$TEST_ROOT"' EXIT

PASS=0
FAIL=0

json_get() {
  local file="$1"
  local expr="$2"
  python3 - "$file" "$expr" <<'PY'
import json,sys
path,expr=sys.argv[1],sys.argv[2]
data=json.load(open(path))
cur=data
for part in expr.split('.'):
    if part.endswith(']') and '[' in part:
        name,idx=part[:-1].split('[',1)
        if name:
            cur=cur.get(name)
        cur=cur[int(idx)]
    else:
        if isinstance(cur,dict):
            cur=cur.get(part)
        else:
            cur=None
if isinstance(cur,bool):
    print('true' if cur else 'false')
elif cur is None:
    print('null')
elif isinstance(cur,list):
    print(','.join(str(x) for x in cur))
else:
    print(cur)
PY
}

json_has_list_item() {
  local file="$1"
  local expr="$2"
  local needle="$3"
  python3 - "$file" "$expr" "$needle" <<'PY'
import json,sys
path,expr,needle=sys.argv[1],sys.argv[2],sys.argv[3]
data=json.load(open(path))
cur=data
for part in expr.split('.'):
    cur=cur.get(part) if isinstance(cur,dict) else None
if isinstance(cur,list) and needle in [str(x) for x in cur]:
    print('yes')
else:
    print('no')
PY
}

run_case() {
  local name="$1"
  local setup_fn="$2"
  local assert_fn="$3"

  local ws
  ws="$(mktemp -d -p "$TEST_ROOT")"
  pushd "$ws" >/dev/null

  local PR_NUMBER=9001
  local HEAD_REF="feature"
  local BASE_REF="main"
  local PR_TITLE="Router test"
  local PR_BODY="Fixes #1684"
  local PR_DRAFT="false"
  local CURRENT_HEAD_GATES_PASSED="false"
  local IAA_PREFLIGHT_COMPLETE="false"
  local STRICT_GATE_CHANGE_EVIDENCE_COMPLETE="false"
  local ECAP_COMPLETED="false"
  local FOREMAN_ADMIN_ACCEPTED="false"
  local IAA_FINAL_ASSURANCE_ISSUED="false"
  local CODEXADVISOR_CS2_AUTHORIZATION_COMPLETE="false"
  local ACTIVE_IDENTITY_BUNDLE_JSON=""
  local ACTIVE_STATE_JSON=""

  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"
  mkdir -p apps/mmm/src governance/templates .github/workflows .github/agents .agent-admin/control-state \
         .admin/prs .agent-admin/scope-declarations ".agent-admin/prs/pr-${PR_NUMBER}"
  echo "base" > README.md
  cat > ".admin/prs/pr-${PR_NUMBER}.json" <<JSON
{"pr":${PR_NUMBER},"issue":1684,"branch":"${HEAD_REF}","head_sha":"CURRENT_HEAD","base_sha":"CURRENT_BASE"}
JSON
  cat > ".agent-admin/scope-declarations/pr-${PR_NUMBER}.md" <<SCOPE
PR_NUMBER: ${PR_NUMBER}
ISSUE: #1684
BRANCH: ${HEAD_REF}
OWNER: Copilot
DATE_UTC: 2026-05-20T00:00:00Z
FILES_CHANGED: 1
OUT_OF_SCOPE:
- none
SCOPE
  cat > ".agent-admin/prs/pr-${PR_NUMBER}/wave-current-tasks.md" <<WAVE
PR: #${PR_NUMBER}
Branch: ${HEAD_REF}
WAVE_TASKS_PATH: .agent-admin/prs/pr-${PR_NUMBER}/wave-current-tasks.md
WAVE
  git add README.md
  git add .admin/prs ".agent-admin/scope-declarations/pr-${PR_NUMBER}.md" ".agent-admin/prs/pr-${PR_NUMBER}/wave-current-tasks.md"
  git commit -q -m "base"
  git branch -M main
  git checkout -q -b feature

  "$setup_fn"

  local base_sha head_sha state_path output
  base_sha="$(git rev-parse main)"
  head_sha="$(git rev-parse HEAD)"
  state_path="$ws/.agent-admin/control-state/pr-${PR_NUMBER}.json"

  set +e
  output="$(
    PR_NUMBER="$PR_NUMBER" \
    ISSUE_NUMBER="1684" \
    BASE_SHA="$base_sha" \
    HEAD_SHA="$head_sha" \
    HEAD_REF="$HEAD_REF" \
    BASE_REF="$BASE_REF" \
    PR_TITLE="$PR_TITLE" \
    PR_BODY="$PR_BODY" \
    PR_DRAFT="$PR_DRAFT" \
    CURRENT_HEAD_GATES_PASSED="$CURRENT_HEAD_GATES_PASSED" \
    IAA_PREFLIGHT_COMPLETE="$IAA_PREFLIGHT_COMPLETE" \
    STRICT_GATE_CHANGE_EVIDENCE_COMPLETE="$STRICT_GATE_CHANGE_EVIDENCE_COMPLETE" \
    ECAP_COMPLETED="$ECAP_COMPLETED" \
    FOREMAN_ADMIN_ACCEPTED="$FOREMAN_ADMIN_ACCEPTED" \
    IAA_FINAL_ASSURANCE_ISSUED="$IAA_FINAL_ASSURANCE_ISSUED" \
    CODEXADVISOR_CS2_AUTHORIZATION_COMPLETE="$CODEXADVISOR_CS2_AUTHORIZATION_COMPLETE" \
    ACTIVE_IDENTITY_BUNDLE_JSON="$ACTIVE_IDENTITY_BUNDLE_JSON" \
    ACTIVE_STATE_JSON="$ACTIVE_STATE_JSON" \
    CONTROL_STATE_OUTPUT_PATH="$state_path" \
    node "$ROUTER_SCRIPT" 2>&1
  )"
  local exit_code=$?
  set -e

  if [[ $exit_code -ne 0 ]]; then
    echo "❌ $name"
    echo "$output"
    FAIL=$((FAIL+1))
    popd >/dev/null
    return
  fi

  if "$assert_fn" "$state_path" "$output"; then
    echo "✅ $name"
    PASS=$((PASS+1))
  else
    echo "❌ $name"
    echo "$output"
    FAIL=$((FAIL+1))
  fi

  popd >/dev/null
}

setup_product_only() {
  mkdir -p apps/mmm/src
  echo "export const value = 1;" > apps/mmm/src/new-feature.ts
  git add apps/mmm/src/new-feature.ts
  git commit -q -m "product change"
  CURRENT_HEAD_GATES_PASSED="true"
}
assert_product_only() {
  local file="$1"
  [[ "$(json_has_list_item "$file" job_class product-fix)" == "yes" ]] || return 1
  [[ "$(json_has_list_item "$file" required_controls CURRENT_HEAD_GATE_PARITY)" == "yes" ]] || return 1
  [[ "$(json_get "$file" next_required_control)" == "NONE" ]] || return 1
  [[ "$(json_get "$file" handover_allowed)" == "true" ]] || return 1
}

setup_protected_governance() {
  mkdir -p governance/templates
  echo "# template" > governance/templates/NEW_TEMPLATE.md
  git add governance/templates/NEW_TEMPLATE.md
  git commit -q -m "governance template change"
  IAA_PREFLIGHT_COMPLETE="true"
}
assert_protected_governance() {
  local file="$1"
  [[ "$(json_has_list_item "$file" job_class governance-change)" == "yes" ]] || return 1
  [[ "$(json_has_list_item "$file" job_class protected-path)" == "yes" ]] || return 1
  [[ "$(json_has_list_item "$file" required_controls ECAP_PROTECTED_PATH_CEREMONY)" == "yes" ]] || return 1
  [[ "$(json_has_list_item "$file" required_controls FOREMAN_ADMIN_READINESS)" == "yes" ]] || return 1
  [[ "$(json_get "$file" next_required_control)" == "ECAP_PROTECTED_PATH_CEREMONY" ]] || return 1
}

setup_gate_change() {
  mkdir -p .github/workflows
  cat > .github/workflows/example.yml <<'YML'
name: test
on: [push]
YML
  git add .github/workflows/example.yml
  git commit -q -m "gate change"
  IAA_PREFLIGHT_COMPLETE="true"
}
assert_gate_change() {
  local file="$1"
  [[ "$(json_has_list_item "$file" job_class gate-change)" == "yes" ]] || return 1
  [[ "$(json_has_list_item "$file" required_controls STRICT_GATE_CHANGE_EVIDENCE)" == "yes" ]] || return 1
  [[ "$(json_get "$file" next_required_control)" == "STRICT_GATE_CHANGE_EVIDENCE" ]] || return 1
}

setup_agent_contract() {
  mkdir -p .github/agents
  echo "contract update" > .github/agents/new-agent.md
  git add .github/agents/new-agent.md
  git commit -q -m "agent contract change"
}
assert_agent_contract() {
  local file="$1"
  [[ "$(json_has_list_item "$file" job_class agent-contract)" == "yes" ]] || return 1
  [[ "$(json_has_list_item "$file" required_controls CODEXADVISOR_CS2_AUTHORIZATION)" == "yes" ]] || return 1
  [[ "$(json_get "$file" next_required_control)" == "CODEXADVISOR_CS2_AUTHORIZATION" ]] || return 1
}

setup_mixed() {
  mkdir -p apps/mmm/src governance/templates
  echo "export const x = 1;" > apps/mmm/src/mixed.ts
  echo "# gov" > governance/templates/MIXED.md
  git add apps/mmm/src/mixed.ts governance/templates/MIXED.md
  git commit -q -m "mixed"
}
assert_mixed() {
  local file="$1"
  [[ "$(json_has_list_item "$file" job_class mixed)" == "yes" ]] || return 1
  [[ "$(json_has_list_item "$file" job_class governance-change)" == "yes" ]] || return 1
}

setup_draft() {
  mkdir -p apps/mmm/src
  echo "export const draft = true;" > apps/mmm/src/draft.ts
  git add apps/mmm/src/draft.ts
  git commit -q -m "draft"
  PR_DRAFT="true"
  CURRENT_HEAD_GATES_PASSED="true"
}
assert_draft() {
  local file="$1"
  [[ "$(json_has_list_item "$file" job_class draft-wip)" == "yes" ]] || return 1
  [[ "$(json_get "$file" handover_allowed)" == "false" ]] || return 1
  [[ "$(json_get "$file" merge_allowed)" == "false" ]] || return 1
  [[ "$(json_get "$file" blocking_reason)" == "DRAFT_WIP_PHASE_NOT_COMPLETE" ]] || return 1
}

setup_wrong_identity_bundle() {
  mkdir -p apps/mmm/src
  echo "export const identity = true;" > apps/mmm/src/identity.ts
  git add apps/mmm/src/identity.ts
  git commit -q -m "identity"
  CURRENT_HEAD_GATES_PASSED="true"
  ACTIVE_IDENTITY_BUNDLE_JSON='{"pr":9999,"branch":"wrong-branch","head_sha":"deadbeef"}'
}
assert_wrong_identity_bundle() {
  local file="$1"
  [[ "$(json_get "$file" next_required_control)" == "IDENTITY_BINDING" ]] || return 1
  [[ "$(json_get "$file" blocking_reason)" == "IDENTITY_BINDING" ]] || return 1
  [[ "$(json_get "$file" handover_allowed)" == "false" ]] || return 1
}

setup_docs_only() {
  mkdir -p docs
  echo "# doc" > docs/README.md
  git add docs/README.md
  git commit -q -m "docs change"
  CURRENT_HEAD_GATES_PASSED="true"
}
assert_docs_only() {
  local file="$1"
  [[ "$(json_get "$file" next_required_control)" == "NONE" ]] || return 1
  [[ "$(json_get "$file" handover_allowed)" == "true" ]] || return 1
  [[ "$(json_has_list_item "$file" required_controls IAA_PREFLIGHT)" == "no" ]] || return 1
}

setup_resolver_bootstrap_required() {
  mkdir -p apps/mmm/src
  echo "export const bootstrap = true;" > apps/mmm/src/bootstrap.ts
  git add apps/mmm/src/bootstrap.ts
  git commit -q -m "product change"
  # Inject resolver state that says BOOTSTRAP_REQUIRED
  ACTIVE_STATE_JSON='{"pr":9001,"branch":"feature","next_required_action":"BOOTSTRAP_REQUIRED","delta_type":"SUBSTANTIVE_DELTA","changed_files":[]}'
}
assert_resolver_bootstrap_required() {
  local file="$1"
  [[ "$(json_get "$file" next_required_control)" == "BOOTSTRAP_REQUIRED" ]] || return 1
  [[ "$(json_has_list_item "$file" required_controls BOOTSTRAP_REQUIRED)" == "yes" ]] || return 1
  [[ "$(json_get "$file" handover_allowed)" == "false" ]] || return 1
}

setup_resolver_evidence_stale() {
  mkdir -p apps/mmm/src
  echo "export const stale = true;" > apps/mmm/src/stale.ts
  git add apps/mmm/src/stale.ts
  git commit -q -m "product change"
  # Inject resolver state that says EVIDENCE_STALE
  ACTIVE_STATE_JSON='{"pr":9001,"branch":"feature","next_required_action":"EVIDENCE_STALE","delta_type":"SUBSTANTIVE_DELTA","changed_files":[]}'
}
assert_resolver_evidence_stale() {
  local file="$1"
  [[ "$(json_get "$file" next_required_control)" == "EVIDENCE_STALE" ]] || return 1
  [[ "$(json_has_list_item "$file" required_controls EVIDENCE_STALE)" == "yes" ]] || return 1
  [[ "$(json_get "$file" handover_allowed)" == "false" ]] || return 1
}

echo "=== Admin Control Router Regression ==="
run_case "product-only simple PR" setup_product_only assert_product_only
run_case "docs-only simple PR" setup_docs_only assert_docs_only
run_case "protected governance template PR" setup_protected_governance assert_protected_governance
run_case "gate-changing PR" setup_gate_change assert_gate_change
run_case "agent-contract PR" setup_agent_contract assert_agent_contract
run_case "mixed product + governance PR" setup_mixed assert_mixed
run_case "draft/WIP PR" setup_draft assert_draft
run_case "wrong active identity bundle" setup_wrong_identity_bundle assert_wrong_identity_bundle
run_case "resolver BOOTSTRAP_REQUIRED in required_controls" setup_resolver_bootstrap_required assert_resolver_bootstrap_required
run_case "resolver EVIDENCE_STALE in required_controls" setup_resolver_evidence_stale assert_resolver_evidence_stale

echo ""
echo "Passed: $PASS"
echo "Failed: $FAIL"

if [[ "$FAIL" -ne 0 ]]; then
  exit 1
fi
