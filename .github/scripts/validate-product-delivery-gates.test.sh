#!/bin/bash
# Regression tests for validate-product-delivery-gates.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATE_SCRIPT="${SCRIPT_DIR}/validate-product-delivery-gates.sh"
TEST_DIR=$(mktemp -d)
PASS_COUNT=0
FAIL_COUNT=0

echo "=== Product Delivery Gate Regression ==="
echo "Test dir: $TEST_DIR"

run_test() {
  local name="$1"
  local expected="$2"
  local setup_fn="$3"

  local ws
  ws=$(mktemp -d -p "$TEST_DIR")
  cd "$ws"

  git init -q
  git config user.email "test@example.com"
  git config user.name "Test User"
  mkdir -p .functional-delivery .agent-admin/assurance apps/mmm/src apps/mmm/tests governance/checklists governance/templates docs/governance .agent-workspace/foreman-v2/knowledge
  echo "init" > README.md
  cat > .agent-admin/assurance/iaa-token-historical.md << 'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-historical-PASS
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
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
  if ( [ -d .functional-delivery ] || [ -d .agent-admin/assurance ] ) && [ ! -f .skip-head-sha-rewrite ]; then
    python3 - "$head_sha" <<'PYEOF'
import pathlib, re, sys
head_sha = sys.argv[1]
for root, pattern in [
    (pathlib.Path(".functional-delivery"), "pr-*.md"),
    (pathlib.Path(".agent-admin/assurance"), "*.md"),
]:
    if not root.exists():
        continue
    for path in root.glob(pattern):
        if not path.is_file():
            continue
        content = path.read_text()
        path.write_text(re.sub(r"\bCURRENT_HEAD\b", head_sha, content))
PYEOF
  fi
  pr_body="${TEST_PR_BODY:-}"
  set +e
  output=$(BASE_SHA="$base_sha" PR_NUMBER="9999" PR_BODY="$pr_body" PR_LABELS="${TEST_PR_LABELS:-}" HEAD_SHA="$head_sha" bash "$GATE_SCRIPT" 2>&1)
  code=$?
  set -e

  if [ "$code" -eq "$expected" ]; then
    echo "✅ $name"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "❌ $name (expected $expected got $code)"
    echo "$output" | sed 's/^/   /'
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

t0_governance_only_hardening() {
  cat > governance/checklists/phase4-role-separation-operational-guidance.md << 'EOF'
# Governance-only checklist update
EOF
  cat > governance/templates/iaa-wave-record.template.md << 'EOF'
# Governance-only template update
EOF
  cat > docs/governance/PHASE5_PRODUCT_DELIVERY_GATES.md << 'EOF'
# Governance documentation update
EOF
  cat > .agent-workspace/foreman-v2/knowledge/index.md << 'EOF'
# Tier 2 index update
EOF
  git add .
  git commit -q -m "governance/template-only hardening"
}
run_test "T0 governance/template-only gate-hardening -> PASS / not applicable" 0 t0_governance_only_hardening

t0b_pr_template_only() {
  cat > .functional-delivery/pr-template.md << 'EOF'
PR: #template
Issue: #template
Current head SHA reviewed:
EOF
  git add .
  git commit -q -m "functional-delivery template only"
}
run_test "T0b .functional-delivery/pr-template.md only -> PASS / not applicable" 0 t0b_pr_template_only

t0c_pr_body_examples_not_claim() {
  cat > docs/governance/PHASE5_PRODUCT_DELIVERY_GATES.md << 'EOF'
# Governance documentation update
EOF
  # This line intentionally mirrors non-claim docs/examples where FULL_FUNCTIONAL_DELIVERY
  # is followed by pipe-separated alternatives, not an explicit verdict assertion.
  TEST_PR_BODY=$'Gate docs update only.\n# Required\n#   VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL'
  export TEST_PR_BODY
  git add .
  git commit -q -m "governance docs with non-claim verdict example"
}
run_test "T0c PR body verdict-options example only -> PASS / not applicable" 0 t0c_pr_body_examples_not_claim

t0d_pr_body_partial_option_list_not_claim() {
  cat > docs/governance/PHASE5_PRODUCT_DELIVERY_GATES.md << 'EOF'
# Governance documentation update
EOF
  TEST_PR_BODY=$'Docs-only note.\nOptions: PARTIAL_FUNCTIONAL_DELIVERY, FULL_FUNCTIONAL_DELIVERY'
  export TEST_PR_BODY
  git add .
  git commit -q -m "governance docs with comma-separated partial/full options"
}
run_test "T0d PR body comma-separated partial/full options should not trigger classifier -> PASS" 0 t0d_pr_body_partial_option_list_not_claim

seed_valid_evidence() {
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: user creates org -> creates framework -> uploads/generates source -> review/compile/publish states visible
ENTRY_POINT: /onboarding
FINAL_EXPECTED_STATE: framework review state visible with compile/publish actions wired
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
  cat > .agent-admin/assurance/iaa-token-session-9999.md << 'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-9999-PASS
CURRENT_HEAD_SHA: CURRENT_HEAD
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
}

seed_product_change_with_cta() {
  cat > apps/mmm/src/Page.tsx << 'EOF'
export const Page = () => <button onClick={() => fetch('/api/frameworks/init')}>Run</button>;
EOF
  mkdir -p api/frameworks
  cat > api/frameworks/init.ts << 'EOF'
export default function handler(_req, res) { res.status(200).json({ ok: true }) }
EOF
  cat > apps/mmm/tests/page.test.ts << 'EOF'
it('calls framework init route', () => {
  expect('/api/frameworks/init').toBe('/api/frameworks/init')
})
EOF
}

t1_missing_evidence() {
  seed_product_change_with_cta
  git add .
  git commit -q -m "product change without evidence"
}
run_test "T1 missing functional evidence -> FAIL" 1 t1_missing_evidence

t1d_cs_signoff_label_does_not_bypass_product_gates() {
  seed_product_change_with_cta
  TEST_PR_LABELS='CS sign-off: approved'
  export TEST_PR_LABELS
  git add .
  git commit -q -m "product change with cs sign-off label but no evidence"
}
run_test "T1d CS sign-off label does not bypass product-delivery evidence gates -> FAIL" 1 t1d_cs_signoff_label_does_not_bypass_product_gates

t1c_migration_only_change_requires_product_evidence() {
  mkdir -p supabase/migrations
  cat > supabase/migrations/20260511070000_add_test_table.sql << 'EOF'
create table if not exists test_product_delivery_gate (
  id uuid primary key
);
EOF
  git add .
  git commit -q -m "migration-only schema change without functional evidence"
}
run_test "T1c migration-only schema change is product-facing and requires evidence -> FAIL" 1 t1c_migration_only_change_requires_product_evidence

t1e_pr_body_partial_delivery_claim_requires_evidence() {
  cat > docs/governance/notes.md << 'EOF'
doc-only change
EOF
  TEST_PR_BODY=$'Operational note\nVERDICT: PARTIAL_FUNCTIONAL_DELIVERY'
  export TEST_PR_BODY
  git add .
  git commit -q -m "pr body partial delivery claim without product evidence"
}
run_test "T1e PR-body PARTIAL_FUNCTIONAL_DELIVERY claim triggers evidence requirement -> FAIL" 1 t1e_pr_body_partial_delivery_claim_requires_evidence

t1g_pr_body_standalone_partial_token_requires_evidence() {
  cat > docs/governance/notes.md << 'EOF'
doc-only change
EOF
  TEST_PR_BODY=$'Operational note\nPARTIAL_FUNCTIONAL_DELIVERY'
  export TEST_PR_BODY
  git add .
  git commit -q -m "pr body standalone partial token without product evidence"
}
run_test "T1g PR-body standalone PARTIAL_FUNCTIONAL_DELIVERY token triggers evidence requirement -> FAIL" 1 t1g_pr_body_standalone_partial_token_requires_evidence

t1f_pr_body_handover_claim_requires_evidence() {
  cat > docs/governance/notes.md << 'EOF'
doc-only change
EOF
  TEST_PR_BODY=$'Release status: ready for handover'
  export TEST_PR_BODY
  git add .
  git commit -q -m "pr body handover claim without product evidence"
}
run_test "T1f PR-body handover claim triggers evidence requirement -> FAIL" 1 t1f_pr_body_handover_claim_requires_evidence

t1h_pr_body_handover_readiness_claim_requires_evidence() {
  cat > docs/governance/notes.md << 'EOF'
doc-only change
EOF
  TEST_PR_BODY=$'Release status: handover readiness'
  export TEST_PR_BODY
  git add .
  git commit -q -m "pr body handover readiness claim without product evidence"
}
run_test "T1h PR-body handover readiness claim triggers evidence requirement -> FAIL" 1 t1h_pr_body_handover_readiness_claim_requires_evidence

t1b_missing_pr_specific_evidence_no_stale_fallback() {
  seed_product_change_with_cta
  seed_valid_iaa
  cat > .functional-delivery/pr-1111.md << 'EOF'
PR: #1111
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: stale evidence
ENTRY_POINT: /stale
FINAL_EXPECTED_STATE: stale
USER_CAN_COMPLETE_JOURNEY: yes
Product/user journey: stale evidence
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
Preview/live URL: url
Pass/fail result: pass
KNOWN_PARTIALS: none
Known partials: none
CS2_PARTIAL_ACCEPTANCE: not_applicable
Known limitations: none
Partial scope accepted by CS2: not_applicable
Builder QA functional report reference: ref
ECAP/admin-gate report reference: ref
IAA final assurance reference: ref
| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| cta | intent | route | /api/frameworks/init | obj | ok | fail | ev |
mmm-framework-init
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
ADMIN_PASS: yes
EOF
  git add .
  git commit -q -m "stale non-pr-specific functional evidence only"
}
run_test "T1b stale evidence fallback disabled (must require pr-9999 or explicit path) -> FAIL" 1 t1b_missing_pr_specific_evidence_no_stale_fallback

t2_missing_cta_map_fields() {
  seed_product_change_with_cta
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: MMM flow
ENTRY_POINT: /framework/create
FINAL_EXPECTED_STATE: framework created
USER_CAN_COMPLETE_JOURNEY: yes
Product/user journey: MMM flow
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
Preview/live URL: url
Pass/fail result: pass
Known partials: none
Known limitations: none
Partial scope accepted by CS2: not_applicable
Builder QA functional report reference: ref
ECAP/admin-gate report reference: ref
IAA final assurance reference: ref
EOF
  seed_valid_iaa
  git add .
  git commit -q -m "missing cta table"
}
run_test "T2 CTA pattern without mapping table fields -> FAIL" 1 t2_missing_cta_map_fields

t3_invented_endpoint_without_tests() {
  seed_product_change_with_cta
  seed_valid_evidence
  seed_valid_iaa
  rm -f apps/mmm/tests/page.test.ts
  git add .
  git commit -q -m "route with no test proof"
}
run_test "T3 guarded endpoint no test proof -> FAIL" 1 t3_invented_endpoint_without_tests

t3b_frontend_route_with_test_but_no_backend_impl() {
  cat > apps/mmm/src/Page.tsx << 'EOF'
export const Page = () => <button onClick={() => fetch('/api/organisations')}>Create org</button>;
EOF
  cat > apps/mmm/tests/page.test.ts << 'EOF'
it('references organisations route', () => {
  expect('/api/organisations').toBe('/api/organisations')
})
EOF
  seed_valid_evidence
  seed_valid_iaa
  git add .
  git commit -q -m "frontend route string with test but no backend implementation"
}
run_test "T3b guarded endpoint must have backend implementation proof -> FAIL" 1 t3b_frontend_route_with_test_but_no_backend_impl

t4_iaa_generic_pass_only() {
  seed_product_change_with_cta
  seed_valid_evidence
  cat > .agent-admin/assurance/iaa-token-session-9999.md << 'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-9999-PASS
Verdict: ASSURANCE-TOKEN (PASS)
EOF
  git add .
  git commit -q -m "generic iaa pass only"
}
run_test "T4 IAA token without split verdict fields -> FAIL" 1 t4_iaa_generic_pass_only

t4b_no_iaa_file_in_diff_even_if_repo_has_old_token() {
  seed_product_change_with_cta
  seed_valid_evidence
  git add .
  git commit -q -m "product change without updated iaa artifact"
}
run_test "T4b product PR without PR-diff IAA artifact -> FAIL" 1 t4b_no_iaa_file_in_diff_even_if_repo_has_old_token

t5_placeholder_with_full_claim() {
  seed_product_change_with_cta
  seed_valid_iaa
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: TODO backend wiring remains
ENTRY_POINT: /framework/create
FINAL_EXPECTED_STATE: framework created
USER_CAN_COMPLETE_JOURNEY: yes
Product/user journey: TODO backend wiring remains
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
Preview/live URL: url
Pass/fail result: pass
Known partials: none
Known limitations: placeholder
Partial scope accepted by CS2: no
Builder QA functional report reference: ref
ECAP/admin-gate report reference: ref
IAA final assurance reference: ref
| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| cta | intent | route | /api/frameworks/init | obj | ok | fail | ev |
mmm-framework-init
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
  git add .
  git commit -q -m "placeholder dishonesty"
}
run_test "T5 placeholder language + functional pass claim -> FAIL" 1 t5_placeholder_with_full_claim

t6_partial_scope_allowed() {
  seed_product_change_with_cta
  seed_valid_iaa
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: TODO backend wiring remains
ENTRY_POINT: /framework/create
FINAL_EXPECTED_STATE: partial
USER_CAN_COMPLETE_JOURNEY: no
Product/user journey: TODO backend wiring remains
User journey tested: no
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
Preview/live URL: url
Pass/fail result: partial
KNOWN_PARTIALS: backend wiring
Known partials: backend wiring
CS2_PARTIAL_ACCEPTANCE: yes
Known limitations: placeholder wiring remains
Partial scope accepted by CS2: yes
CS2_WAIVER_QUOTE: "CS2 accepts partial scope for this wave while known partials are tracked."
Builder QA functional report reference: ref
ECAP/admin-gate report reference: ref
IAA final assurance reference: ref
| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| cta | intent | route | /api/frameworks/init | obj | ok | fail | ev |
mmm-framework-init
FUNCTIONAL_PASS: no
VERDICT: PARTIAL_FUNCTIONAL_DELIVERY
ADMIN_PASS: yes
EOF
  git add .
  git commit -q -m "partial scope declaration"
}
run_test "T6 explicit partial scope with CS2 acceptance -> PASS" 0 t6_partial_scope_allowed

t6c_partial_scope_cs2_yes_without_quote_fails() {
  seed_product_change_with_cta
  seed_valid_iaa
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: partial accepted by CS2 but quote missing
ENTRY_POINT: /framework/create
FINAL_EXPECTED_STATE: partial
USER_CAN_COMPLETE_JOURNEY: no
Product/user journey: partial flow
User journey tested: no
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
Preview/live URL: url
Pass/fail result: partial
KNOWN_PARTIALS: backend wiring
Known partials: backend wiring
CS2_PARTIAL_ACCEPTANCE: yes
Known limitations: partial accepted but quote missing
Partial scope accepted by CS2: yes
Builder QA functional report reference: ref
ECAP/admin-gate report reference: ref
IAA final assurance reference: ref
| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| cta | intent | route | /api/frameworks/init | obj | ok | fail | ev |
mmm-framework-init
FUNCTIONAL_PASS: no
VERDICT: PARTIAL_FUNCTIONAL_DELIVERY
ADMIN_PASS: yes
EOF
  git add .
  git commit -q -m "partial scope cs2 yes without waiver quote"
}
run_test "T6c partial scope with CS2 yes but missing CS2_WAIVER_QUOTE -> FAIL" 1 t6c_partial_scope_cs2_yes_without_quote_fails

t6b_ui_placeholder_prop_should_not_trigger_placeholder_honesty() {
  mkdir -p api/frameworks
  cat > apps/mmm/src/Page.tsx << 'EOF'
export const Page = () => <input placeholder="Type framework name" onChange={() => fetch('/api/frameworks/init')} />;
EOF
  cat > apps/mmm/tests/page.test.ts << 'EOF'
it('calls framework init route', () => {
  expect('/api/frameworks/init').toBe('/api/frameworks/init')
})
EOF
  cat > api/frameworks/init.ts << 'EOF'
export default function handler(_req, res) { res.status(200).json({ ok: true }) }
EOF
  seed_valid_evidence
  seed_valid_iaa
  git add .
  git commit -q -m "ui placeholder attribute with complete evidence"
}
run_test "T6b UI placeholder prop alone -> PASS" 0 t6b_ui_placeholder_prop_should_not_trigger_placeholder_honesty

t7a_pass_with_cs2_waiver_without_quote() {
  seed_product_change_with_cta
  seed_valid_evidence
  cat > .agent-admin/assurance/iaa-token-session-9999.md << 'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-9999-PASS_WITH_CS2_WAIVER
ADMIN_PASS: yes
FUNCTIONAL_PASS: no
VERDICT: PARTIAL_FUNCTIONAL_DELIVERY
IAA_EXECUTION_VERDICT: PASS_WITH_CS2_WAIVER
EOF
  git add .
  git commit -q -m "waiver without explicit quote"
}
run_test "T7a PASS_WITH_CS2_WAIVER requires explicit quoted CS2 waiver text -> FAIL" 1 t7a_pass_with_cs2_waiver_without_quote

t7b_functional_no_with_handover_language() {
  seed_product_change_with_cta
  seed_valid_iaa
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: journey partial
ENTRY_POINT: /framework/upload
FINAL_EXPECTED_STATE: pending parse job
USER_CAN_COMPLETE_JOURNEY: no
Product/user journey: incomplete workflow
User journey tested: no
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
Preview/live URL: url
Pass/fail result: partial
KNOWN_PARTIALS: pending parse conversion
Known partials: pending parse conversion
CS2_PARTIAL_ACCEPTANCE: no
Known limitations: workflow incomplete
Partial scope accepted by CS2: no
Builder QA functional report reference: ref
ECAP/admin-gate report reference: ref
IAA final assurance reference: ref
| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| Upload | upload source | route | /api/upload/framework-source | obj | pending | fail | ev |
FUNCTIONAL_PASS: no
ADMIN_PASS: yes
VERDICT: PARTIAL_FUNCTIONAL_DELIVERY
ready for handover
EOF
  git add .
  git commit -q -m "functional no with handover language"
}
run_test "T7b FUNCTIONAL_PASS no cannot include handover/merge acceptance language -> FAIL" 1 t7b_functional_no_with_handover_language

t7c_missing_current_head_sha_in_evidence() {
  seed_product_change_with_cta
  seed_valid_evidence
  seed_valid_iaa
  # Force the test to keep CURRENT_HEAD placeholder so Gate 7 fails explicitly.
  touch .skip-head-sha-rewrite
  git add .
  git commit -q -m "missing reviewed current head sha"
}
run_test "T7c evidence missing current HEAD SHA must fail" 1 t7c_missing_current_head_sha_in_evidence

t7d_iaa_artifact_missing_current_head_sha() {
  seed_product_change_with_cta
  seed_valid_evidence
  cat > .agent-admin/assurance/iaa-token-session-9999.md << 'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-9999-PASS
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
  git add .
  git commit -q -m "iaa artifact missing current head sha binding"
}
run_test "T7d IAA artifact missing current HEAD SHA binding must fail" 1 t7d_iaa_artifact_missing_current_head_sha

t7e_split_verdict_and_head_sha_in_different_iaa_artifacts() {
  seed_product_change_with_cta
  seed_valid_evidence
  cat > .agent-admin/assurance/iaa-token-session-9999.md << 'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-9999-PASS
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
  cat > .agent-admin/assurance/iaa-wave-record-head-only.md << 'EOF'
PHASE_B_BLOCKING_TOKEN: IAA-session-9999-PASS
CURRENT_HEAD_SHA: CURRENT_HEAD
EOF
  git add .
  git commit -q -m "split verdict fields and head sha across different iaa artifacts"
}
run_test "T7e verdict fields and CURRENT_HEAD_SHA split across IAA artifacts must fail" 1 t7e_split_verdict_and_head_sha_in_different_iaa_artifacts

t8_pr1590_dry_run_incomplete_workflow() {
  seed_product_change_with_cta
  seed_valid_iaa
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1590
Current head SHA reviewed: CURRENT_HEAD
PROMISED_USER_JOURNEY: create organisation -> initialise framework -> upload/generate source -> review -> compile -> publish -> dashboard reflects state
ENTRY_POINT: /framework/upload
FINAL_EXPECTED_STATE: compile and publish completed with dashboard state reflected
USER_CAN_COMPLETE_JOURNEY: yes
Product/user journey: MMM full flow
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
Preview/live URL: url
Pass/fail result: pass
KNOWN_PARTIALS: mode A upload only creates pending parse job and compile path not proven
Known partials: mode A upload pending parse only; compile/publish success-failure states not fully evidenced
CS2_PARTIAL_ACCEPTANCE: no
Known limitations: outstanding schema alignment and dashboard reflection pending
Partial scope accepted by CS2: no
Builder QA functional report reference: ref
ECAP/admin-gate report reference: ref
IAA final assurance reference: ref
| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| Upload | upload source | route | /api/upload/framework-source | parse_job | pending parse only | fail | ev |
FUNCTIONAL_PASS: yes
ADMIN_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
  git add .
  git commit -q -m "pr1590 dry run incomplete workflow claims full pass"
}
run_test "T8 dry-run PR#1590-style incomplete workflow must be rejected -> FAIL" 1 t8_pr1590_dry_run_incomplete_workflow

t7_full_valid() {
  seed_product_change_with_cta
  seed_valid_evidence
  seed_valid_iaa
  git add .
  git commit -q -m "full valid case"
}
run_test "T7 full valid product-delivery pack -> PASS" 0 t7_full_valid

# ─── PR#1618-style regression tests ─────────────────────────────────────────
# These tests cover the misclassification observed in PR APGI-cmy/maturion-isms#1618:
# A governance/canon + governance/templates PR whose body discussed "functional delivery"
# concepts (as historical/governance context) was incorrectly classified as product-facing,
# requiring .functional-delivery/pr-<n>.md evidence that was not applicable.

t_gov_canon_with_functional_delivery_body() {
  # Only governance/canon/** and governance/templates/** files changed.
  # PR body contains narrative "functional delivery" language from PR#1618.
  mkdir -p governance/canon governance/templates/lfv
  cat > governance/canon/LIVE_FUNCTIONAL_VERIFICATION_CANON.md << 'EOF'
# Live Functional Verification Canon v1.0.0
Governance-only canon update.
EOF
  cat > governance/templates/lfv/01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md << 'EOF'
# LFV Template: Functional User Journey Contract
Governance-only template.
EOF
  # PR body mirrors PR#1618: discusses functional delivery concepts as governance context,
  # includes a historical reference (#1590), and an explicit Governing-Issue (#1617).
  TEST_PR_BODY=$'Adds mandatory Live Functional Verification package.\n\n**Governance-only PR** — no runtime product code changes. Historical reference: PR APGI-cmy/maturion-isms#1590 exposed a gap in the pre-build assurance model (builds could be CI-green and admin-complete yet have no upfront contract for a deployed live verification pass). This PR closes that gap at the governance/canon level.\n\nGoals: enforce functional delivery workflow. Deployed workflow evidence required. Live verification mandatory for UI/application builds.\n\nGoverning-Issue: APGI-cmy/maturion-isms#1617'
  export TEST_PR_BODY
  mkdir -p governance/templates/lfv
  git add .
  git commit -q -m "PR#1618-style: governance/canon+templates with functional delivery language in body"
}
run_test "T_gov1618 governance/canon+templates + PR#1618-style body (functional delivery language) -> PASS (not product-facing)" 0 t_gov_canon_with_functional_delivery_body

t_gov_canon_explicit_verdict_claim_still_triggers() {
  # If a governance/canon-only PR body contains an EXPLICIT formal claim
  # (VERDICT: FULL_FUNCTIONAL_DELIVERY), it must still be classified as product-facing
  # and require functional delivery evidence.
  mkdir -p governance/canon
  cat > governance/canon/SOME_CANON_UPDATE.md << 'EOF'
# Canon update
EOF
  TEST_PR_BODY=$'Canon update. VERDICT: FULL_FUNCTIONAL_DELIVERY'
  export TEST_PR_BODY
  git add .
  git commit -q -m "governance/canon with explicit VERDICT: FULL_FUNCTIONAL_DELIVERY in body"
}
run_test "T_gov1618b governance/canon-only + explicit VERDICT claim in body -> FAIL (must require evidence)" 1 t_gov_canon_explicit_verdict_claim_still_triggers

t_gov_templates_with_handover_readiness_body() {
  # governance/templates/** only. PR body contains "handover readiness" (narrative pattern).
  # Governance-controlled-only → narrative hint suppressed → not product-facing.
  mkdir -p governance/templates
  cat > governance/templates/SOME_TEMPLATE.md << 'EOF'
# Template update
EOF
  TEST_PR_BODY=$'Template update for handover readiness tracking. Improves the functional delivery evidence checklist.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "governance/templates with handover readiness language in body"
}
run_test "T_gov1618c governance/templates-only + handover readiness language in body -> PASS (not product-facing)" 0 t_gov_templates_with_handover_readiness_body

t_iaa_agent_workspace_with_narrative_body() {
  # .agent-workspace/independent-assurance-agent/** only. PR body has "product fix" language.
  # Governance-controlled-only → narrative hint suppressed → not product-facing.
  mkdir -p .agent-workspace/independent-assurance-agent/knowledge
  cat > .agent-workspace/independent-assurance-agent/knowledge/index.md << 'EOF'
# IAA Tier 2 knowledge index update
EOF
  TEST_PR_BODY=$'IAA knowledge update. This is a product fix for the assurance workflow. Functional delivery standards updated.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "IAA agent workspace with narrative product-fix language in body"
}
run_test "T_gov1618d .agent-workspace/independent-assurance-agent + narrative product-fix language -> PASS (not product-facing)" 0 t_iaa_agent_workspace_with_narrative_body

t_mixed_gov_and_product_code_with_narrative_body() {
  # governance/canon/** AND a product code file changed together.
  # Mixed PR: governance-controlled-only check fails → narrative hints remain active.
  mkdir -p governance/canon apps/mmm/src
  cat > governance/canon/SOME_CANON.md << 'EOF'
# Canon update
EOF
  cat > apps/mmm/src/SomePage.tsx << 'EOF'
export const SomePage = () => <div>page</div>;
EOF
  TEST_PR_BODY=$'Mixed PR: canon update + UI page. Functional delivery note.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "mixed governance/canon + product code with functional delivery in body"
}
run_test "T_gov1618e mixed governance/canon + product code + narrative body -> FAIL (product code present)" 1 t_mixed_gov_and_product_code_with_narrative_body

# ─── PR#1620-style regression tests ─────────────────────────────────────────
# These tests cover the misclassification observed in PR APGI-cmy/maturion-isms#1620:
# A PR changing .github/scripts/** and .github/workflows/** (governance/admin gate
# control-surface work) whose body discussed "functional delivery" narratively was
# incorrectly classified as product-facing, requiring .functional-delivery/pr-N.md.
# Fix: .github/scripts/** and .github/workflows/** are governance-controlled paths;
# narrative hints must be suppressed for them.

t_github_scripts_workflows_with_narrative_functional_delivery_body() {
  # Only .github/scripts/** and .github/workflows/** changed.
  # PR body mentions "functional delivery" and "product delivery" narratively
  # (as PR#1620 does — the PR is about gate tuning, not product delivery).
  mkdir -p .github/scripts .github/workflows
  cat > .github/scripts/validate-product-delivery-gates.sh << 'EOF'
#!/bin/bash
# stub for test
exit 0
EOF
  cat > .github/workflows/preflight-evidence-gate.yml << 'EOF'
# stub workflow for test
name: preflight
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo ok
EOF
  TEST_PR_BODY=$'Tune affected-control classifier and gate classification for governance.\n\nFixes product-delivery gate false-positive on governance/admin gate-control-surface PRs.\nFunctional delivery classification updated. No .functional-delivery/pr-*.md required for gate-only changes.\nProduct delivery gate suppressed for governance-only diff.\nHandover readiness tracking improved.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "PR#1620-style: .github/scripts + .github/workflows with functional delivery language in body"
}
run_test "T_gov1620 .github/scripts+workflows + narrative functional/product-delivery body -> PASS (not product-facing)" 0 t_github_scripts_workflows_with_narrative_functional_delivery_body

t_github_scripts_workflows_explicit_verdict_still_triggers() {
  # Even when only .github/scripts/** is changed, an explicit formal VERDICT claim
  # in the PR body must still trigger product-facing classification.
  mkdir -p .github/scripts
  cat > .github/scripts/some-gate.sh << 'EOF'
#!/bin/bash
exit 0
EOF
  TEST_PR_BODY=$'Gate script update. VERDICT: FULL_FUNCTIONAL_DELIVERY'
  export TEST_PR_BODY
  git add .
  git commit -q -m ".github/scripts with explicit VERDICT: FULL_FUNCTIONAL_DELIVERY in body"
}
run_test "T_gov1620b .github/scripts-only + explicit VERDICT claim in body -> FAIL (must require evidence)" 1 t_github_scripts_workflows_explicit_verdict_still_triggers

t_github_scripts_functional_pass_inline_not_trigger() {
  # PR body contains `FUNCTIONAL_PASS: yes` as backtick-quoted inline text (narrative example),
  # not as a standalone formal field. This should NOT trigger product-facing classification.
  mkdir -p .github/scripts .github/workflows
  cat > .github/scripts/validate-product-delivery-gates.sh << 'EOF'
#!/bin/bash
exit 0
EOF
  cat > .github/workflows/preflight-evidence-gate.yml << 'EOF'
name: Preflight
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [{ run: echo ok }]
EOF
  TEST_PR_BODY=$'Gate fix: explicit formal claims (`FUNCTIONAL_PASS: yes`, `VERDICT: FULL_FUNCTIONAL_DELIVERY`) still trigger product evidence.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "Gate scripts with FUNCTIONAL_PASS: yes as inline backtick narrative in body"
}
run_test "T_gov1620c .github/scripts+workflows + FUNCTIONAL_PASS:yes as inline backtick text -> PASS (not product-facing)" 0 t_github_scripts_functional_pass_inline_not_trigger

t10_governance_pr_narrative_product_fix_no_formal_claim() {
  cat > governance/checklists/product-fix-language-notes.md << 'EOF'
# Governance terminology hardening
This governance-only change documents product fix review terminology for policy alignment.
No shipped fix, feature completion, or user journey change is claimed here.
EOF
  cat > docs/governance/release-language-guidance.md << 'EOF'
# Release language guidance
Guidance for governance reviewers on how to discuss product fix requests without making delivery claims.
EOF
  TEST_PR_BODY=$'Governance documentation update discussing product fix terminology.\nNo product code changed. No formal delivery claim is being made.'
  export TEST_PR_BODY
  git add .
  git commit -q -m "governance: document product fix terminology guidance"
}
run_test "T10 governance-only PR with narrative 'product fix' and no formal claim -> PASS" 0 t10_governance_pr_narrative_product_fix_no_formal_claim

# ─── Rebase-aware evidence gate regression tests ─────────────────────────────
# These tests verify that producer-side gates do not fail solely because runtime
# HEAD changed (rebase) when the PR payload did not substantively change.

# Helper: seed evidence with a literal old SHA (simulates pre-rebase artifact)
seed_old_sha_evidence() {
  local old_sha="$1"
  cat > .functional-delivery/pr-9999.md << EOF
PR: #9999
Issue: #1573
Current head SHA reviewed: ${old_sha}
PROMISED_USER_JOURNEY: user creates org -> creates framework -> uploads/generates source -> review/compile/publish states visible
ENTRY_POINT: /onboarding
FINAL_EXPECTED_STATE: framework review state visible with compile/publish actions wired
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
| CTA / visible action | User intent | UI route/component | Backend/API/Edge target | Data/storage object | Success state | Failure state | Evidence |
|---|---|---|---|---|---|---|---|
| Create framework | start setup | /framework/create | /api/frameworks/init | frameworks | framework created | error shown | test T-1 |
mmm-framework-init
VERDICT: FULL_FUNCTIONAL_DELIVERY
FUNCTIONAL_PASS: yes
ADMIN_PASS: yes
EOF
}

# Helper: seed IAA token with a literal old SHA (simulates pre-rebase artifact)
seed_old_sha_iaa() {
  local old_sha="$1"
  cat > .agent-admin/assurance/iaa-token-session-9999.md << EOF
PHASE_B_BLOCKING_TOKEN: IAA-session-9999-PASS
CURRENT_HEAD_SHA: ${old_sha}
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
}

# T_rebase1: Product evidence exists with old SHA (head A), PR rebased to head B with
# no product payload change — evidence and IAA both committed at same time as product
# files, admin-only rebase commit advances HEAD => PASS
t_rebase1_product_evidence_survives_admin_rebase() {
  seed_product_change_with_cta
  local old_sha
  old_sha="$(git rev-parse HEAD 2>/dev/null || echo "HEAD")"
  # Seed evidence/IAA with the literal SHA at time of product change
  seed_old_sha_evidence "$old_sha"
  seed_old_sha_iaa "$old_sha"
  git add .
  GIT_AUTHOR_DATE="2020-06-01T10:00:00 +0000" GIT_COMMITTER_DATE="2020-06-01T10:00:00 +0000" \
    git commit -q -m "product change + evidence at SHA_A (T0)"
  # Admin-only rebase simulation: add a governance file to advance HEAD
  mkdir -p governance/notes
  echo "# admin note" > governance/notes/rebase-sim.md
  GIT_AUTHOR_DATE="2020-06-01T10:00:01 +0000" GIT_COMMITTER_DATE="2020-06-01T10:00:01 +0000" \
    git add . && GIT_AUTHOR_DATE="2020-06-01T10:00:01 +0000" GIT_COMMITTER_DATE="2020-06-01T10:00:01 +0000" \
    git commit -q -m "admin-only rebase simulation (T1 > T0)"
  # Skip SHA injection so evidence retains the literal old SHA
  touch .skip-head-sha-rewrite
}
run_test "T_rebase1 product delivery evidence survives admin-only rebase (old SHA, no new product change) -> PASS" 0 t_rebase1_product_evidence_survives_admin_rebase

# T_rebase2: Product-facing files changed AFTER evidence was produced with old SHA => FAIL
t_rebase2_product_change_after_evidence_fails() {
  seed_product_change_with_cta
  local old_sha
  old_sha="deadbeef0000000000000000000000000000aa01"
  seed_old_sha_evidence "$old_sha"
  seed_old_sha_iaa "$old_sha"
  GIT_AUTHOR_DATE="2020-06-01T10:00:00 +0000" GIT_COMMITTER_DATE="2020-06-01T10:00:00 +0000" \
    git add . && GIT_AUTHOR_DATE="2020-06-01T10:00:00 +0000" GIT_COMMITTER_DATE="2020-06-01T10:00:00 +0000" \
    git commit -q -m "evidence committed at T0"
  # New product-facing file added AFTER evidence (impl after evidence => stale)
  cat >> apps/mmm/src/Page.tsx << 'EOF'
export const Widget = () => <div>widget</div>;
EOF
  GIT_AUTHOR_DATE="2020-06-02T10:00:00 +0000" GIT_COMMITTER_DATE="2020-06-02T10:00:00 +0000" \
    git add . && GIT_AUTHOR_DATE="2020-06-02T10:00:00 +0000" GIT_COMMITTER_DATE="2020-06-02T10:00:00 +0000" \
    git commit -q -m "new product file after evidence (T1 > T0)"
  touch .skip-head-sha-rewrite
}
run_test "T_rebase2 product-facing files changed after evidence was produced => FAIL" 1 t_rebase2_product_change_after_evidence_fails

# T_rebase3: No .functional-delivery/pr-<PR>.md at all => FAIL (missing evidence still hard-fails)
t_rebase3_no_evidence_file_still_fails() {
  seed_product_change_with_cta
  seed_valid_iaa
  git add .
  git commit -q -m "product change but no functional delivery evidence"
}
run_test "T_rebase3 missing functional evidence remains a hard failure -> FAIL" 1 t_rebase3_no_evidence_file_still_fails

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
