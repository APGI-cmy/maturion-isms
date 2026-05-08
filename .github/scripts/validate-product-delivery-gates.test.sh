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
  mkdir -p .functional-delivery .agent-admin/assurance apps/mmm/src apps/mmm/tests
  echo "init" > README.md
  git add .
  git commit -q -m "init"
  git branch -M main
  git checkout -q -b test-branch

  "$setup_fn"

  local base_sha head_sha code output
  base_sha=$(git rev-parse main)
  head_sha=$(git rev-parse HEAD)
  set +e
  output=$(BASE_SHA="$base_sha" PR_NUMBER="9999" PR_BODY="" PR_LABELS="" HEAD_SHA="$head_sha" bash "$GATE_SCRIPT" 2>&1)
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

seed_valid_evidence() {
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
Product/user journey: MMM create framework flow
User journey tested: yes
CTA/API map: present
Backend target proof: present
Screenshots or recording: present
Preview/live URL: https://example.invalid
Pass/fail result: pass
Known partials: none
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
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
EOF
}

seed_product_change_with_cta() {
  cat > apps/mmm/src/Page.tsx << 'EOF'
export const Page = () => <button onClick={() => fetch('/api/frameworks/init')}>Run</button>;
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

t2_missing_cta_map_fields() {
  seed_product_change_with_cta
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
Product/user journey: MMM flow
User journey tested: yes
CTA/API map: present
Backend target proof: present
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

t5_placeholder_with_full_claim() {
  seed_product_change_with_cta
  seed_valid_iaa
  cat > .functional-delivery/pr-9999.md << 'EOF'
PR: #9999
Issue: #1573
Current head SHA reviewed: CURRENT_HEAD
Product/user journey: TODO backend wiring remains
User journey tested: yes
CTA/API map: present
Backend target proof: present
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
Product/user journey: TODO backend wiring remains
User journey tested: no
CTA/API map: present
Backend target proof: present
Screenshots or recording: present
Preview/live URL: url
Pass/fail result: partial
Known partials: backend wiring
Known limitations: placeholder wiring remains
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
  git commit -q -m "partial scope declaration"
}
run_test "T6 explicit partial scope with CS2 acceptance -> PASS" 0 t6_partial_scope_allowed

t7_full_valid() {
  seed_product_change_with_cta
  seed_valid_evidence
  seed_valid_iaa
  git add .
  git commit -q -m "full valid case"
}
run_test "T7 full valid product-delivery pack -> PASS" 0 t7_full_valid

echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
