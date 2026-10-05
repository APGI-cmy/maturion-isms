#!/bin/bash
# Regression tests for validate-product-delivery-gates.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_SCRIPT="${SCRIPT_DIR}/validate-product-delivery-gates.sh"
TEST_DIR=$(mktemp -d)
PASS_COUNT=0
FAIL_COUNT=0

echo "=== CS2 Governed Build Gate Router Regression ==="
echo "Test dir: $TEST_DIR"

run_test() {
  local name="$1"
  local expected="$2"
  local setup_fn="$3"
  local expected_class="${4:-}"

  local ws
  ws=$(mktemp -d -p "$TEST_DIR")
  cd "$ws"

  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"
  mkdir -p .github/scripts .github/workflows .functional-delivery .agent-admin/assurance .agent-admin/notes apps/mmm/src apps/mmm/tests api/frameworks supabase/migrations supabase/tests governance/canon Maturion/strategy docs/governance docs/migrations .admin/prs
  cp "${SCRIPT_DIR}/validate-product-delivery-gates.sh" .github/scripts/validate-product-delivery-gates.sh
  cat > README.md <<'EOF'
init
EOF
  git add .
  git commit -q -m "init"
  git branch -M main
  git checkout -q -b test-branch

  TEST_PR_BODY=""
  TEST_PR_LABELS=""
  rm -f .skip-head-sha-rewrite

  "$setup_fn"

  local base_sha head_sha code output pr_body
  base_sha=$(git rev-parse main)
  head_sha=$(git rev-parse HEAD)
  if [ ! -f .skip-head-sha-rewrite ]; then
    python3 - "$head_sha" <<'PYEOF'
import pathlib, re, sys
head_sha = sys.argv[1]
for root, pattern in [
    (pathlib.Path('.functional-delivery'), 'pr-*.md'),
    (pathlib.Path('.agent-admin/assurance'), '*.md'),
]:
    if not root.exists():
        continue
    for path in root.glob(pattern):
        if path.is_file():
            path.write_text(re.sub(r'\bCURRENT_HEAD\b', head_sha, path.read_text()))
PYEOF
  fi

  pr_body="${TEST_PR_BODY:-}"
  set +e
  output=$(BASE_SHA="$base_sha" PR_NUMBER="9999" PR_BODY="$pr_body" PR_LABELS="${TEST_PR_LABELS:-}" HEAD_SHA="$head_sha" bash "$GATE_SCRIPT" 2>&1)
  code=$?
  set -e

  if [ "$code" -ne "$expected" ]; then
    echo "FAIL $name (expected exit $expected got $code)"
    echo "$output" | sed 's/^/   /'
    FAIL_COUNT=$((FAIL_COUNT + 1))
    return
  fi

  if [ -n "$expected_class" ] && ! echo "$output" | grep -qF "Detected PR class: ${expected_class}"; then
    echo "FAIL $name (expected classification '${expected_class}' not found in output)"
    echo "$output" | sed 's/^/   /'
    FAIL_COUNT=$((FAIL_COUNT + 1))
    return
  fi

  echo "PASS $name"
  PASS_COUNT=$((PASS_COUNT + 1))
}

seed_product_change_with_cta() {
  cat > apps/mmm/src/Page.tsx <<'EOF'
export const Page = () => <button onClick={() => fetch('/api/frameworks/init')}>Run</button>;
EOF
  cat > api/frameworks/init.ts <<'EOF'
export default function handler(_req, res) { res.status(200).json({ ok: true }) }
EOF
  cat > apps/mmm/tests/page.test.ts <<'EOF'
it('calls framework init route', () => {
  expect('/api/frameworks/init').toBe('/api/frameworks/init')
})
EOF
}

seed_valid_functional_evidence() {
  cat > .functional-delivery/pr-9999.md <<'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: user creates org and framework successfully
ENTRY_POINT: /onboarding
FINAL_EXPECTED_STATE: framework created and visible
USER_CAN_COMPLETE_JOURNEY: yes
Product/user journey: MMM create framework flow
User journey tested: yes
CTA_MAP: present
CTA/API map: present
BACKEND_CAPABILITY_MAP: present
Backend target proof: present
SCHEMA_CONTRACT_CHECK: present
CROSS_FUNCTION_COMPATIBILITY_CHECK: present
ASYNC_JOB_CHECK: present
VISIBLE_STATE_CHECK: present
DEPLOYED_PREVIEW_CHECK: present
DASHBOARD_OR_STATE_REFLECTION_CHECK: present
Screenshots or recording: present
Preview/live URL: https://example.invalid
Pass/fail result: pass
KNOWN_PARTIALS: none
Known partials: none
CS2_PARTIAL_ACCEPTANCE: not_applicable
Known limitations: none
Partial scope accepted by CS2: not_applicable
Builder QA functional report reference: modules/MMM/05-qa-to-red/qa-to-red-catalog.md
ECAP/admin-gate report reference: .agent-admin/prehandover/proof-9999.md
IAA final assurance reference: .agent-admin/assurance/iaa-token-session-9999.md
BUILD_TO_RED_TEST_REFERENCE: T-MMM-S6-001
BUILDER_APPOINTMENT_REFERENCE: modules/MMM/10-builder-appointment/builder-contract.md section 3.2
ROLE_ASSIGNMENT_REFERENCE: .agent-admin/assurance/iaa-wave-record-mmm-stage11-builder-appointment-20260420.md
| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| Create framework | start setup | /framework/create | /api/frameworks/init | frameworks | framework created | error shown | test T-1 |
mmm-framework-init
VERDICT: FULL_FUNCTIONAL_DELIVERY
FUNCTIONAL_PASS: yes
ADMIN_PASS: yes
EOF
}

seed_valid_iaa() {
  cat > .agent-admin/assurance/iaa-token-session-9999.md <<'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-9999-PASS
CURRENT_HEAD_SHA: CURRENT_HEAD
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
}

seed_database_evidence() {
  cat > .functional-delivery/pr-9999.md <<'EOF'
PR: #9999
Issue: Supabase database migration validation
Current head SHA reviewed: CURRENT_HEAD
MIGRATION_PURPOSE: add database object required by the migration wave
PREVIEW_MIGRATION: passed on preview database
VERIFICATION_SQL: select migration validation result
VERIFICATION_RESULT: migration validation returned expected result
POST_MERGE_CHECKLIST: run production migration and smoke-test affected flows
EOF
}

seed_security_evidence() {
  cat > .functional-delivery/pr-9999.md <<'EOF'
PR: #9999
Issue: Supabase Security Advisor remediation
Current head SHA reviewed: CURRENT_HEAD
REMEDIATION_PURPOSE: address SQL-addressable Security Advisor findings
SECURITY_FINDING: Supabase Security Advisor warning export
PREVIEW_MIGRATION: passed on preview branch
Security Advisor: 0 errors, 0 warnings, 0 suggestions after refresh
VERIFICATION_SQL: vector schema, RLS policy, RPC privilege, and storage policy checks
VERIFICATION_RESULT: expected secure state confirmed
ACCESS_CONTROL_IMPACT: anon/authenticated direct RPC execution removed where required; service-role path preserved
POST_MERGE_CHECKLIST: deploy migration, rerun production Advisor, smoke-test org access, free assessment, and parse write-back
EOF
}

seed_migration_plus_support_files() {
  # Migration/security payload plus SQL/Python tests, a workflow file, docs, and
  # an admin note — none of which are app/runtime or recognised evidence paths.
  cat > supabase/migrations/20260601000000_mixed.sql <<'EOF'
create table if not exists public.gate_mixed_test(id uuid primary key);
EOF
  cat > supabase/tests/test_mixed_migration.sql <<'EOF'
select 1;
EOF
  cat > supabase/tests/test_mixed_migration.py <<'EOF'
def test_mixed_migration():
    assert True
EOF
  cat > .github/workflows/mixed-migration-ci.yml <<'EOF'
name: mixed-migration-ci
on: push
jobs:
  noop:
    runs-on: ubuntu-latest
    steps:
      - run: echo ok
EOF
  cat > docs/migrations/mixed-migration-notes.md <<'EOF'
# Mixed migration notes
Documentation only, not an evidence artifact.
EOF
  cat > .agent-admin/notes/mixed-migration-admin-note.md <<'EOF'
Admin note accompanying the migration. Not a recognised evidence-file path.
EOF
}

t_mixed_migration_support_files_never_evidence_only() {
  seed_migration_plus_support_files
  git add .
  git commit -q -m "mixed migration + tests/workflow/docs/admin, no evidence"
}
run_test "mixed migration+test/workflow/docs/admin never classifies EVIDENCE_ONLY (fails closed, requires DB evidence)" 1 t_mixed_migration_support_files_never_evidence_only "DATABASE_MIGRATION"

t_mixed_migration_support_files_with_db_evidence_passes() {
  seed_migration_plus_support_files
  seed_database_evidence
  git add .
  git commit -q -m "mixed migration + tests/workflow/docs/admin, with database evidence"
}
run_test "mixed migration+test/workflow/docs/admin with database evidence passes as DATABASE_MIGRATION" 0 t_mixed_migration_support_files_with_db_evidence_passes "DATABASE_MIGRATION"

t_mixed_security_support_files_with_security_evidence_passes() {
  seed_migration_plus_support_files
  seed_security_evidence
  TEST_PR_BODY=$'Supabase Security Advisor remediation for RLS and extension hardening, with accompanying tests/workflow/docs/admin files.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "mixed security remediation + tests/workflow/docs/admin, with security evidence"
}
run_test "mixed migration+test/workflow/docs/admin with security hint passes as SECURITY_REMEDIATION" 0 t_mixed_security_support_files_with_security_evidence_passes "SECURITY_REMEDIATION"

t_mixed_migration_plus_runtime_escalates_to_app_functional() {
  seed_migration_plus_support_files
  seed_product_change_with_cta
  git add .
  git commit -q -m "mixed migration plus runtime UI/API change, no functional evidence"
}
run_test "runtime UI/API file mixed with migration still escalates to APP_FUNCTIONAL_BUILD" 1 t_mixed_migration_plus_runtime_escalates_to_app_functional "APP_FUNCTIONAL_BUILD"

t_mixed_migration_plus_runtime_full_valid_passes() {
  seed_migration_plus_support_files
  seed_product_change_with_cta
  seed_valid_functional_evidence
  seed_valid_iaa
  git add .
  git commit -q -m "mixed migration plus runtime UI/API change, full functional evidence"
}
run_test "runtime UI/API file mixed with migration passes APP_FUNCTIONAL_BUILD with full evidence" 0 t_mixed_migration_plus_runtime_full_valid_passes "APP_FUNCTIONAL_BUILD"

t_explicit_functional_claim_escalates_migration_only_diff() {
  cat > supabase/migrations/20260601000001_claim.sql <<'EOF'
create table if not exists public.gate_claim_test(id uuid primary key);
EOF
  TEST_PR_BODY=$'Functional-Delivery-Artifact: .functional-delivery/pr-9999.md'
  export TEST_PR_BODY
  git add .
  git commit -q -m "migration-only diff with explicit formal functional-delivery claim"
}
run_test "explicit formal functional-delivery claim escalates migration-only diff to APP_FUNCTIONAL_BUILD" 1 t_explicit_functional_claim_escalates_migration_only_diff "APP_FUNCTIONAL_BUILD"

t_unknown_manifest_class_fails_closed() {
  seed_migration_plus_support_files
  seed_database_evidence
  cat > .admin/prs/pr-9999.json <<'EOF'
{
  "pr": 9999,
  "class": "NOT_A_REAL_CLASS",
  "owner": "CS2"
}
EOF
  git add .
  git commit -q -m "unknown manifest class"
}
run_test "unknown PR manifest class fails closed" 1 t_unknown_manifest_class_fails_closed

t_mismatched_manifest_downgrade_fails_closed() {
  seed_migration_plus_support_files
  seed_database_evidence
  cat > .admin/prs/pr-9999.json <<'EOF'
{
  "pr": 9999,
  "class": "EVIDENCE_ONLY",
  "owner": "CS2"
}
EOF
  git add .
  git commit -q -m "manifest attempts to downgrade database migration to evidence-only"
}
run_test "manifest cannot downgrade a database migration payload to EVIDENCE_ONLY (fails closed)" 1 t_mismatched_manifest_downgrade_fails_closed

t_governance_strategy_only() {
  cat > Maturion/strategy/NOTE.md <<'EOF'
# Strategy update
This discusses functional delivery and handover readiness as governance context only.
EOF
  TEST_PR_BODY=$'Governance strategy only. Discusses functional delivery and handover readiness but does not change product runtime.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "strategy update"
}
run_test "governance/strategy-only PR is not product-delivery gated" 0 t_governance_strategy_only

t_evidence_only() {
  cat > .functional-delivery/pr-9999.md <<'EOF'
PR: #9999
Evidence-only correction.
EOF
  git add .
  git commit -q -m "evidence only"
}
run_test "evidence-only PR is advisory for product gate" 0 t_evidence_only

t_database_missing_profile_evidence() {
  cat > supabase/migrations/20260531000000_test.sql <<'EOF'
create table if not exists public.gate_rebalance_test(id uuid primary key);
EOF
  git add .
  git commit -q -m "database migration without evidence"
}
run_test "database migration without database evidence profile fails" 1 t_database_missing_profile_evidence

t_database_with_profile_evidence() {
  cat > supabase/migrations/20260531000000_test.sql <<'EOF'
create table if not exists public.gate_rebalance_test(id uuid primary key);
EOF
  seed_database_evidence
  git add .
  git commit -q -m "database migration with evidence"
}
run_test "database migration with database evidence profile passes" 0 t_database_with_profile_evidence

t_security_with_profile_evidence() {
  cat > supabase/migrations/20260531000001_security.sql <<'EOF'
create schema if not exists extensions;
EOF
  seed_security_evidence
  TEST_PR_BODY=$'Supabase Security Advisor remediation for RLS and extension hardening.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "security remediation migration with advisor evidence"
}
run_test "security remediation migration uses security evidence profile" 0 t_security_with_profile_evidence

t_product_missing_evidence() {
  seed_product_change_with_cta
  git add .
  git commit -q -m "product change without evidence"
}
run_test "app functional build without evidence fails" 1 t_product_missing_evidence

t_product_full_valid() {
  seed_product_change_with_cta
  seed_valid_functional_evidence
  seed_valid_iaa
  git add .
  git commit -q -m "product change with full governed evidence"
}
run_test "app functional build with full evidence passes" 0 t_product_full_valid

t_product_builder_self_qa_guard() {
  seed_product_change_with_cta
  seed_valid_functional_evidence
  rm -f .agent-admin/assurance/iaa-token-session-9999.md
  git add .
  git commit -q -m "product change without independent iaa"
}
run_test "app functional build still requires independent IAA artifact" 1 t_product_builder_self_qa_guard

t_cs2_hotfix_requires_justification() {
  seed_product_change_with_cta
  seed_valid_functional_evidence
  seed_valid_iaa
  cat > .admin/prs/pr-9999.json <<'EOF'
{
  "pr": 9999,
  "class": "CS2_HOTFIX",
  "owner": "CS2",
  "merge_authority": "CS2",
  "risk": "medium",
  "scope": ["apps/mmm/src/Page.tsx"],
  "cs2_justification": "tbd"
}
EOF
  git add .
  git commit -q -m "hotfix missing justification"
}
run_test "CS2 hotfix manifest cannot use placeholder justification" 1 t_cs2_hotfix_requires_justification

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
