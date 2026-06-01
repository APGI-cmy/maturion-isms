#!/bin/bash
# validate-product-delivery-gates.sh
# Purpose: CS2 governed-build gate router for product delivery, database/security
#          remediation, evidence-only, rebase-only, and governance-control PRs.
# Authority: Maturion/strategy/CS2_GOVERNED_BUILD_GATE_REBALANCE_STRATEGY.md

set -euo pipefail

BASE_SHA="${BASE_SHA:-}"
PR_NUMBER="${PR_NUMBER:-}"
PR_LABELS="${PR_LABELS:-}"
PR_BODY="${PR_BODY:-}"
HEAD_SHA="${HEAD_SHA:-$(git rev-parse HEAD 2>/dev/null || echo "") }"
HEAD_SHA="${HEAD_SHA//[[:space:]]/}"
DEFAULT_EVIDENCE_PATH="${FUNCTIONAL_DELIVERY_EVIDENCE_PATH:-}"

log() { printf '%s\n' "$*"; }
fail() { log "FAIL - $*"; exit 1; }
pass() { log "PASS - $*"; exit 0; }

log "=== CS2 Governed Build Gate Router ==="
log "Authority: Maturion/strategy/CS2_GOVERNED_BUILD_GATE_REBALANCE_STRATEGY.md"
log ""

if [[ "$PR_LABELS" == *"governance"* ]] && [[ "$PR_LABELS" == *"automated"* ]] && [[ "$PR_LABELS" == *"agent:liaison"* ]]; then
  pass "Automated governance alignment PR bypass."
fi

compute_changed_files() {
  if [ -n "$BASE_SHA" ]; then
    git diff --name-only "${BASE_SHA}...HEAD" 2>/dev/null || git diff --name-only "${BASE_SHA}" HEAD 2>/dev/null
  elif git rev-parse origin/main >/dev/null 2>&1; then
    git diff --name-only "origin/main...HEAD" 2>/dev/null
  else
    git diff --name-only HEAD~1...HEAD 2>/dev/null || true
  fi
}

CHANGED_FILES="$(compute_changed_files || true)"
if [ -z "$CHANGED_FILES" ]; then
  pass "No changed files."
fi

if [ -z "$HEAD_SHA" ]; then
  fail "HEAD_SHA is required for governed build gate validation."
fi
if ! [[ "$HEAD_SHA" =~ ^[0-9a-fA-F]{40}$ ]]; then
  fail "HEAD_SHA must be a 40-character git SHA."
fi

log "Changed files:"
printf '%s\n' "$CHANGED_FILES" | sed '/^$/d' | sed 's/^/  - /'
log ""

is_evidence_file() {
  local file="$1"
  case "$file" in
    .functional-delivery/pr-[0-9]*.md|.agent-admin/assurance/*.md|.agent-admin/prehandover/*.md|.admin/prs/pr-*.json)
      return 0 ;;
  esac
  return 1
}

is_governance_controlled_path() {
  local file="$1"
  case "$file" in
    governance/canon/*|governance/templates/*|.agent-workspace/independent-assurance-agent/*)
      return 0 ;;
    .github/scripts/*|.github/workflows/*|.github/agents/*)
      return 0 ;;
    Maturion/strategy/*|docs/governance/*)
      return 0 ;;
  esac
  return 1
}

is_database_path() {
  local file="$1"
  case "$file" in
    supabase/migrations/*|supabase/seed/*) return 0 ;;
  esac
  return 1
}

is_app_functional_path() {
  local file="$1"
  case "$file" in
    apps/*|packages/*|supabase/functions/*|api/*)
      [[ "$file" =~ \.(tsx|jsx|ts|js|py|go)$ ]] && return 0 ;;
    modules/*/src/*|modules/*/app/*|modules/*/api/*|modules/*/frontend/*|modules/*/backend/*|modules/*/page*/*|modules/*/component*/*|modules/*/route*/*)
      [[ "$file" =~ \.(tsx|jsx|ts|js|py|go)$ ]] && return 0 ;;
  esac
  [[ "$file" =~ \.(tsx|jsx|ts|js|py|go)$ ]] && [[ "$file" =~ (^|/)(src|app|api|pages?|components?|routes?)/ ]] && return 0
  return 1
}

all_files_match() {
  local fn="$1"
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if ! "$fn" "$file"; then return 1; fi
  done <<< "$CHANGED_FILES"
  return 0
}

any_file_matches() {
  local fn="$1"
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if "$fn" "$file"; then return 0; fi
  done <<< "$CHANGED_FILES"
  return 1
}

all_files_database_or_evidence() {
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if is_database_path "$file" || is_evidence_file "$file"; then continue; fi
    return 1
  done <<< "$CHANGED_FILES"
  return 0
}

all_files_governance_controlled() {
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if is_governance_controlled_path "$file" || is_evidence_file "$file"; then continue; fi
    return 1
  done <<< "$CHANGED_FILES"
  return 0
}

pr_body_explicit_product_claim() {
  [ -n "$PR_BODY" ] || return 1
  local claim_patterns=(
    'Functional-Delivery-Artifact:[[:space:]]*[^[:space:]]+'
    'FUNCTIONAL_PASS:[[:space:]]*yes([[:space:]]*$)'
    'FULL_FUNCTIONAL_DELIVERY_VERDICT:[[:space:]]*FULL_FUNCTIONAL_DELIVERY([[:space:]]*$)'
    'FULL_FUNCTIONAL_DELIVERY_VERDICT:[[:space:]]*PARTIAL_FUNCTIONAL_DELIVERY([[:space:]]*$)'
    'VERDICT:[[:space:]]*FULL_FUNCTIONAL_DELIVERY([[:space:]]*$)'
    'VERDICT:[[:space:]]*PARTIAL_FUNCTIONAL_DELIVERY([[:space:]]*$)'
  )
  local pattern
  for pattern in "${claim_patterns[@]}"; do
    if echo "$PR_BODY" | grep -qiE "$pattern"; then return 0; fi
  done
  return 1
}

pr_body_security_hint() {
  [ -n "$PR_BODY" ] || return 1
  echo "$PR_BODY" | grep -qiE 'security advisor|security remediation|rls|row level security|auth|vulnerab|hardening|leaked password|policy|extension_in_public|function_search_path|supabase advisor'
}

manifest_path_for_pr() {
  if [ -n "$PR_NUMBER" ] && [ -f ".admin/prs/pr-${PR_NUMBER}.json" ]; then
    echo ".admin/prs/pr-${PR_NUMBER}.json"
  elif [ -f ".admin/pr.json" ]; then
    echo ".admin/pr.json"
  fi
}

manifest_field() {
  local field="$1"
  local manifest
  manifest="$(manifest_path_for_pr || true)"
  [ -n "$manifest" ] || return 0
  python3 - "$manifest" "$field" <<'PYEOF' 2>/dev/null || true
import json, sys
path, field = sys.argv[1], sys.argv[2]
try:
    data = json.load(open(path))
except Exception:
    sys.exit(0)
value = data.get(field, data.get('pr_class' if field == 'class' else field, ''))
if isinstance(value, bool):
    print('true' if value else 'false')
elif isinstance(value, (list, dict)):
    import json as _json
    print(_json.dumps(value))
elif value is not None:
    print(str(value))
PYEOF
}

normalize_class() {
  local value="$1"
  value="$(printf '%s' "$value" | tr '[:lower:]' '[:upper:]' | tr ' -' '__')"
  case "$value" in
    APP_FUNCTIONAL_BUILD|FUNCTIONAL|PRODUCT|PRODUCT_FIX) echo "APP_FUNCTIONAL_BUILD" ;;
    DATABASE_MIGRATION|DATABASE|DB_MIGRATION|MIGRATION) echo "DATABASE_MIGRATION" ;;
    SECURITY_REMEDIATION|SECURITY|SECURITY_HARDENING) echo "SECURITY_REMEDIATION" ;;
    GOVERNANCE_CONTROL|GOVERNANCE|GATE_CHANGE) echo "GOVERNANCE_CONTROL" ;;
    AGENT_CONTRACT) echo "AGENT_CONTRACT" ;;
    EVIDENCE_ONLY|ADMIN_ONLY) echo "EVIDENCE_ONLY" ;;
    REBASE_ONLY) echo "REBASE_ONLY" ;;
    CS2_HOTFIX|HOTFIX) echo "CS2_HOTFIX" ;;
    *) echo "" ;;
  esac
}

HAS_APP=false
HAS_DB=false
if any_file_matches is_app_functional_path; then HAS_APP=true; fi
if any_file_matches is_database_path; then HAS_DB=true; fi

MANIFEST_CLASS_RAW="$(manifest_field class || true)"
MANIFEST_CLASS="$(normalize_class "$MANIFEST_CLASS_RAW")"
if [ -n "$MANIFEST_CLASS_RAW" ] && [ -z "$MANIFEST_CLASS" ]; then
  fail "Unknown PR manifest class '$MANIFEST_CLASS_RAW'. Expected one of: APP_FUNCTIONAL_BUILD, DATABASE_MIGRATION, SECURITY_REMEDIATION, GOVERNANCE_CONTROL, AGENT_CONTRACT, EVIDENCE_ONLY, REBASE_ONLY, CS2_HOTFIX."
fi

PR_CLASS=""
CLASS_REASON=""

if [ "$HAS_APP" = true ] || pr_body_explicit_product_claim; then
  PR_CLASS="APP_FUNCTIONAL_BUILD"
  CLASS_REASON="app/runtime path or explicit product-delivery claim"
elif all_files_database_or_evidence && [ "$HAS_DB" = true ]; then
  if pr_body_security_hint || [ "$MANIFEST_CLASS" = "SECURITY_REMEDIATION" ]; then
    PR_CLASS="SECURITY_REMEDIATION"
    CLASS_REASON="database migration with security remediation/advisor context"
  else
    PR_CLASS="DATABASE_MIGRATION"
    CLASS_REASON="database migration/seed change without app runtime source changes"
  fi
elif all_files_match is_evidence_file; then
  PR_CLASS="EVIDENCE_ONLY"
  CLASS_REASON="diff contains only evidence/admin artifacts"
elif all_files_governance_controlled; then
  PR_CLASS="GOVERNANCE_CONTROL"
  CLASS_REASON="diff contains only governance-controlled/documentation strategy paths"
else
  PR_CLASS="EVIDENCE_ONLY"
  CLASS_REASON="no app, database, or governance-control gate payload detected"
fi

if [ -n "$MANIFEST_CLASS" ]; then
  case "$PR_CLASS:$MANIFEST_CLASS" in
    APP_FUNCTIONAL_BUILD:APP_FUNCTIONAL_BUILD|APP_FUNCTIONAL_BUILD:CS2_HOTFIX)
      PR_CLASS="$MANIFEST_CLASS"
      CLASS_REASON="manifest agrees with app/runtime payload or declares CS2 hotfix" ;;
    DATABASE_MIGRATION:DATABASE_MIGRATION|DATABASE_MIGRATION:SECURITY_REMEDIATION|SECURITY_REMEDIATION:SECURITY_REMEDIATION|SECURITY_REMEDIATION:DATABASE_MIGRATION)
      PR_CLASS="$MANIFEST_CLASS"
      CLASS_REASON="manifest agrees with database/security payload" ;;
    GOVERNANCE_CONTROL:GOVERNANCE_CONTROL|GOVERNANCE_CONTROL:AGENT_CONTRACT|EVIDENCE_ONLY:EVIDENCE_ONLY|EVIDENCE_ONLY:REBASE_ONLY)
      PR_CLASS="$MANIFEST_CLASS"
      CLASS_REASON="manifest agrees with non-runtime payload" ;;
    *)
      fail "PR manifest class '$MANIFEST_CLASS' conflicts with changed-file payload class '$PR_CLASS'. Manifest cannot downgrade runtime/database/governance evidence requirements." ;;
  esac
fi

log "Detected PR class: ${PR_CLASS}"
log "Classification reason: ${CLASS_REASON}"
log ""

if [ "$PR_CLASS" = "GOVERNANCE_CONTROL" ] || [ "$PR_CLASS" = "AGENT_CONTRACT" ]; then
  pass "Product delivery gates are not applicable to ${PR_CLASS}. Governance-control gates own this PR."
fi
if [ "$PR_CLASS" = "EVIDENCE_ONLY" ]; then
  pass "Evidence-only PR: product delivery gates are advisory only and no product files changed."
fi
if [ "$PR_CLASS" = "REBASE_ONLY" ]; then
  pass "Rebase-only PR: no fresh product delivery artifact required by this gate."
fi

resolve_evidence_path() {
  local from_body=""
  local from_env="$DEFAULT_EVIDENCE_PATH"
  local default_path=""
  if [ -n "$PR_NUMBER" ]; then default_path=".functional-delivery/pr-${PR_NUMBER}.md"; fi
  if [ -n "$PR_BODY" ]; then
    from_body=$(echo "$PR_BODY" | sed -nE 's/.*[Ff]unctional-[Dd]elivery-[Aa]rtifact:[[:space:]]*([^[:space:]]+).*/\1/p' | head -1 || true)
  fi
  for candidate in "$from_env" "$from_body" "$default_path"; do
    [ -n "$candidate" ] || continue
    if [ -f "$candidate" ]; then echo "$candidate"; return 0; fi
  done
}

field_present() { grep -qiE "$2" "$1"; }
require_field() {
  local file="$1" label="$2" pattern="$3"
  if ! field_present "$file" "$pattern"; then fail "$label missing from evidence profile ($file)."; fi
}

EVIDENCE_PATH="$(resolve_evidence_path || true)"

run_database_or_security_profile() {
  local profile="$1"
  if [ -z "$EVIDENCE_PATH" ] || [ ! -f "$EVIDENCE_PATH" ]; then
    fail "${profile} requires a scoped evidence artifact. Expected .functional-delivery/pr-${PR_NUMBER}.md or Functional-Delivery-Artifact path."
  fi
  log "Evidence profile selected: ${profile}"
  log "Evidence artifact: ${EVIDENCE_PATH}"
  require_field "$EVIDENCE_PATH" "Migration purpose / remediation purpose" 'MIGRATION_PURPOSE:|Migration purpose:|REMEDIATION_PURPOSE:|Remediation purpose:'
  require_field "$EVIDENCE_PATH" "Preview migration/database validation" 'PREVIEW_MIGRATION:|Preview migration:|DATABASE_VALIDATION:|Database validation:|Preview validation:'
  require_field "$EVIDENCE_PATH" "Verification SQL/result summary" 'VERIFICATION_SQL:|Verification SQL:|VERIFICATION_RESULT:|Verification result:|Security Advisor:'
  require_field "$EVIDENCE_PATH" "Post-merge checklist" 'POST_MERGE_CHECKLIST:|Post-merge checklist:|Production rollout checklist:|POST_DEPLOY_CHECKLIST:'
  if [ "$profile" = "SECURITY_REMEDIATION" ]; then
    require_field "$EVIDENCE_PATH" "Original security finding/risk source" 'SECURITY_FINDING:|Original finding:|Risk source:|Security Advisor:'
    require_field "$EVIDENCE_PATH" "Access-control impact assessment" 'ACCESS_CONTROL_IMPACT:|Access-control impact:|RLS impact:|Service-role impact:|client-role impact:'
  fi
  if ! grep -qF "$HEAD_SHA" "$EVIDENCE_PATH"; then
    fail "Evidence file must include current HEAD SHA value (${HEAD_SHA})."
  fi
  log "Hard blockers: none"
  log "Advisory findings: UI CTA / full app journey evidence not applicable to ${profile} unless runtime UI/API files changed."
  log ""
  pass "${profile} governed evidence profile satisfied."
}

case "$PR_CLASS" in
  DATABASE_MIGRATION) run_database_or_security_profile "DATABASE_MIGRATION" ;;
  SECURITY_REMEDIATION) run_database_or_security_profile "SECURITY_REMEDIATION" ;;
esac

if [ "$PR_CLASS" != "APP_FUNCTIONAL_BUILD" ] && [ "$PR_CLASS" != "CS2_HOTFIX" ]; then
  pass "No product delivery gate requirements for PR class ${PR_CLASS}."
fi

if [ "$PR_CLASS" = "CS2_HOTFIX" ]; then
  CS2_JUSTIFICATION="$(manifest_field cs2_justification || true)"
  CS2_JUSTIFICATION="$(printf '%s' "$CS2_JUSTIFICATION" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
  if [ -z "$CS2_JUSTIFICATION" ] || echo "$CS2_JUSTIFICATION" | grep -qiE '^(tbd|todo|n/a|na|placeholder)$'; then
    fail "CS2_HOTFIX requires non-placeholder cs2_justification in the PR manifest."
  fi
fi

if [ -z "$EVIDENCE_PATH" ] || [ ! -f "$EVIDENCE_PATH" ]; then
  fail "APP_FUNCTIONAL_BUILD requires functional delivery evidence. Expected .functional-delivery/pr-${PR_NUMBER}.md or Functional-Delivery-Artifact path."
fi

log "Evidence profile selected: APP_FUNCTIONAL_BUILD"
log "Functional evidence artifact: $EVIDENCE_PATH"

CTA_SCAN_FILES=""
CTA_PAT='(<button|onClick|fetch\(|navigate\(|supabase\.functions\.invoke)'
while IFS= read -r file; do
  [ -z "$file" ] && continue
  [ -f "$file" ] || continue
  [[ "$file" =~ \.(tsx|jsx|ts|js)$ ]] || continue
  if grep -qE "$CTA_PAT" "$file"; then CTA_SCAN_FILES="${CTA_SCAN_FILES}\n${file}"; fi
done <<< "$CHANGED_FILES"

if [ -n "$CTA_SCAN_FILES" ]; then
  if ! grep -qiE 'CTA.?/visible action|Backend/API/Edge target|Success state|Failure state' "$EVIDENCE_PATH"; then
    log "CTA/action patterns detected:"
    echo -e "$CTA_SCAN_FILES" | sed '/^$/d' | sed 's/^/  - /'
    fail "CTA/action patterns detected but evidence lacks CTA mapping table fields."
  fi
  log "No Dead CTA gate: PASS"
else
  log "No CTA patterns detected in changed product files."
fi

INVENTED_FAIL=false
declare -a GUARDED_ROUTES=("/api/organisations" "/api/frameworks/init" "/api/upload/framework-source" "/api/ai/framework-generate" "/api/qiw/status")
route_capability() {
  case "$1" in
    "/api/organisations") echo "mmm-org-create" ;;
    "/api/frameworks/init") echo "mmm-framework-init" ;;
    "/api/upload/framework-source") echo "mmm-upload-framework-source" ;;
    "/api/ai/framework-generate") echo "mmm-ai-framework-generate" ;;
    "/api/qiw/status") echo "mmm-qiw-status" ;;
    *) echo "" ;;
  esac
}
for route in "${GUARDED_ROUTES[@]}"; do
  route_hit=false
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    [ -f "$file" ] || continue
    [[ "$file" =~ \.(tsx|jsx|ts|js)$ ]] || continue
    if grep -qF "$route" "$file"; then route_hit=true; break; fi
  done <<< "$CHANGED_FILES"
  if [ "$route_hit" = true ]; then
    exists_proof=$(grep -R -l -F "$route" supabase/functions api modules apps packages 2>/dev/null | grep -E '(^supabase/functions/|^api/|/api/|/backend/|/server/|/edge/)' | grep -vE '(^|/)(tests?|__tests__|spec|fixtures?)/|(\.test|\.spec)\.' | grep -vE '\.md$' | head -1 || true)
    if [ -z "$exists_proof" ]; then
      route_without_prefix="${route#/api/}"
      for candidate in "api/${route_without_prefix}.ts" "api/${route_without_prefix}.js" "api/${route_without_prefix}.py" "api/${route_without_prefix}.go" "api/${route_without_prefix}/index.ts" "api/${route_without_prefix}/route.ts"; do
        if [ -f "$candidate" ]; then exists_proof="$candidate"; break; fi
      done
    fi
    test_proof=$(grep -R -l -F "$route" apps modules packages supabase 2>/dev/null | grep -E '(test|spec)\.(ts|tsx|js|jsx|py)$' | head -1 || true)
    capability="$(route_capability "$route")"
    map_proof=""
    if [ -n "$capability" ] && grep -qF "$capability" "$EVIDENCE_PATH" && grep -qF "$route" "$EVIDENCE_PATH"; then
      map_proof="evidence-map"
    elif echo "$PR_BODY" | grep -qiE "Route Approval:[[:space:]]*${route}"; then
      map_proof="pr-body-route-approval"
    fi
    if [ -z "$exists_proof" ] || [ -z "$test_proof" ] || [ -z "$map_proof" ]; then
      log "FAIL - No Invented Endpoint gate for $route"
      [ -z "$exists_proof" ] && log "   Missing proof: exact route implementation exists (non-doc source)."
      [ -z "$test_proof" ] && log "   Missing proof: route is covered in a test/spec file."
      [ -z "$map_proof" ] && log "   Missing proof: route-to-capability mapping or explicit route approval."
      INVENTED_FAIL=true
    fi
  fi
done
if [ "$INVENTED_FAIL" = true ]; then exit 1; fi
log "No Invented Endpoint gate: PASS"

required_sections=("PR:" "Issue:" "Current head SHA reviewed:" "PROMISED_USER_JOURNEY:" "ENTRY_POINT:" "FINAL_EXPECTED_STATE:" "USER_CAN_COMPLETE_JOURNEY:" "Product/user journey:" "User journey tested:" "CTA_MAP:" "CTA/API map:" "BACKEND_CAPABILITY_MAP:" "Backend target proof:" "SCHEMA_CONTRACT_CHECK:" "CROSS_FUNCTION_COMPATIBILITY_CHECK:" "ASYNC_JOB_CHECK:" "VISIBLE_STATE_CHECK:" "DEPLOYED_PREVIEW_CHECK:" "DASHBOARD_OR_STATE_REFLECTION_CHECK:" "Screenshots or recording:" "Preview/live URL:" "Pass/fail result:" "KNOWN_PARTIALS:" "Known partials:" "CS2_PARTIAL_ACCEPTANCE:" "Known limitations:" "Partial scope accepted by CS2:" "Builder QA functional report reference:" "ECAP/admin-gate report reference:" "IAA final assurance reference:" "BUILD_TO_RED_TEST_REFERENCE:" "BUILDER_APPOINTMENT_REFERENCE:" "ROLE_ASSIGNMENT_REFERENCE:")
for section in "${required_sections[@]}"; do
  if ! grep -qF "$section" "$EVIDENCE_PATH"; then fail "Functional evidence missing required section: $section"; fi
done
log "Functional Delivery Evidence gate: PASS"

if ! grep -qiE '^[[:space:]]*(\*\*)?(BUILD_TO_RED_TEST_REFERENCE|Build-to-Red test reference)(\*\*)?:[[:space:]]*.+$' "$EVIDENCE_PATH"; then fail "Functional evidence missing BUILD_TO_RED_TEST_REFERENCE."; fi
if ! grep -qiE 'T-MMM-S6-[0-9]{3}' "$EVIDENCE_PATH"; then fail "BUILD_TO_RED_TEST_REFERENCE must include at least one T-MMM-S6-### test label."; fi
if ! grep -qiE '^[[:space:]]*(\*\*)?(BUILDER_APPOINTMENT_REFERENCE|Builder appointment reference)(\*\*)?:[[:space:]]*.+$' "$EVIDENCE_PATH"; then fail "Functional evidence missing BUILDER_APPOINTMENT_REFERENCE."; fi
if ! grep -qiE 'modules/MMM/10-builder-appointment/builder-contract\.md' "$EVIDENCE_PATH"; then fail "BUILDER_APPOINTMENT_REFERENCE must cite modules/MMM/10-builder-appointment/builder-contract.md."; fi
if ! grep -qiE '^[[:space:]]*(\*\*)?(ROLE_ASSIGNMENT_REFERENCE|Role assignment reference)(\*\*)?:[[:space:]]*.+$' "$EVIDENCE_PATH"; then fail "Functional evidence missing ROLE_ASSIGNMENT_REFERENCE."; fi
log "Build-to-Red linkage gate: PASS"

if ! grep -qiE '^[[:space:]]*(\*\*)?ADMIN_PASS(\*\*)?:[[:space:]]*(yes|no)' "$EVIDENCE_PATH"; then fail "Evidence missing split verdict field: ADMIN_PASS"; fi
if ! grep -qiE '^[[:space:]]*(\*\*)?FUNCTIONAL_PASS(\*\*)?:[[:space:]]*(yes|no)' "$EVIDENCE_PATH"; then fail "Evidence missing split verdict field: FUNCTIONAL_PASS"; fi
if ! grep -qiE '^[[:space:]]*(\*\*)?(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT)(\*\*)?:[[:space:]]*(FULL_FUNCTIONAL_DELIVERY|PARTIAL_FUNCTIONAL_DELIVERY|ADMIN_ONLY|FAIL)' "$EVIDENCE_PATH"; then fail "Evidence missing split verdict field: VERDICT/FULL_FUNCTIONAL_DELIVERY_VERDICT"; fi
if grep -qiE '^[[:space:]]*(\*\*)?FUNCTIONAL_PASS(\*\*)?:[[:space:]]*yes' "$EVIDENCE_PATH" && ! grep -qiE '^[[:space:]]*(\*\*)?(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT)(\*\*)?:[[:space:]]*FULL_FUNCTIONAL_DELIVERY([[:space:]]*$)' "$EVIDENCE_PATH"; then fail "FUNCTIONAL_PASS: yes requires VERDICT: FULL_FUNCTIONAL_DELIVERY."; fi
if grep -qiE '^[[:space:]]*(\*\*)?(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT)(\*\*)?:[[:space:]]*FULL_FUNCTIONAL_DELIVERY([[:space:]]*$)' "$EVIDENCE_PATH"; then
  known_partials_value="$(grep -iE '^[[:space:]]*(KNOWN_PARTIALS|Known partials):' "$EVIDENCE_PATH" | head -1 | cut -d: -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' || true)"
  known_partials_value_lower="$(printf '%s' "$known_partials_value" | tr '[:upper:]' '[:lower:]')"
  if [ -n "$known_partials_value" ] && [ "$known_partials_value_lower" != "none" ]; then fail "FULL_FUNCTIONAL_DELIVERY cannot coexist with known partials."; fi
  if grep -qiE 'outstanding|pending|not[[:space:]-]verified|incomplete' "$EVIDENCE_PATH"; then fail "FULL_FUNCTIONAL_DELIVERY cannot coexist with outstanding/pending/not-verified language."; fi
fi

IAA_FILES="$(git diff --name-only --diff-filter=AM "${BASE_SHA:-HEAD~1}...HEAD" 2>/dev/null | grep -E '^\.agent-admin/assurance/(iaa-token-|iaa-wave-record-).+\.md$' || true)"
if [ -z "$IAA_FILES" ]; then fail "APP_FUNCTIONAL_BUILD requires a PR-diff IAA assurance artifact with split verdict fields."; fi
IAA_VERDICT_OK=false
IAA_VERDICT_HEAD_BOUND=false
IAA_HEAD_KEY_REGEX='^[[:space:]]*(-[[:space:]]*)?(\*\*)?CURRENT_HEAD_SHA(\*\*)?:[[:space:]]*'
while IFS= read -r iaa_file; do
  [ -n "$iaa_file" ] || continue
  [ -f "$iaa_file" ] || continue
  has_admin=$(grep -qiE '^[[:space:]]*(\*\*)?ADMIN_PASS(\*\*)?:[[:space:]]*(yes|no)' "$iaa_file" && echo yes || echo no)
  has_functional=$(grep -qiE '^[[:space:]]*(\*\*)?FUNCTIONAL_PASS(\*\*)?:[[:space:]]*(yes|no)' "$iaa_file" && echo yes || echo no)
  has_verdict=$(grep -qiE '^[[:space:]]*(\*\*)?(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT)(\*\*)?:[[:space:]]*(FULL_FUNCTIONAL_DELIVERY|PARTIAL_FUNCTIONAL_DELIVERY|ADMIN_ONLY|FAIL)' "$iaa_file" && echo yes || echo no)
  if [ "$has_admin" = "yes" ] && [ "$has_functional" = "yes" ] && [ "$has_verdict" = "yes" ]; then
    IAA_VERDICT_OK=true
    if awk -v sha="$HEAD_SHA" -v keyre="$IAA_HEAD_KEY_REGEX" 'BEGIN { IGNORECASE=1 } { line = $0; sub(/\r$/, "", line); if (line ~ keyre) { sub(keyre, "", line); sub(/[[:space:]]+$/, "", line); if (line == sha) { found = 1; exit 0 } } } END { exit(found ? 0 : 1) }' "$iaa_file"; then
      IAA_VERDICT_HEAD_BOUND=true
      break
    fi
  fi
done <<< "$IAA_FILES"
if [ "$IAA_VERDICT_OK" = false ]; then fail "IAA Functional Verdict gate: split fields missing."; fi
if [ "$IAA_VERDICT_HEAD_BOUND" = false ]; then fail "IAA assurance artifact must bind verdict and CURRENT_HEAD_SHA to current HEAD (${HEAD_SHA})."; fi
log "IAA Functional Verdict and head binding gates: PASS"

cs2_waiver_quote_regex='((CS2[[:space:]_-]*waiver([[:space:]_-]*(quote|text))?)|CS2_WAIVER_QUOTE)[[:space:]]*:[[:space:]]*".+"'
while IFS= read -r iaa_file; do
  [ -n "$iaa_file" ] || continue
  [ -f "$iaa_file" ] || continue
  if grep -qiE 'PASS_WITH_CS2_WAIVER' "$iaa_file" && ! grep -qiE "$cs2_waiver_quote_regex" "$iaa_file"; then fail "PASS_WITH_CS2_WAIVER in $iaa_file requires quoted explicit CS2 waiver text."; fi
done <<< "$IAA_FILES"

placeholder_regex='not yet wired|TODO([[:space:]]+|:[[:space:]]*|_[[:space:]]*|-+[[:space:]]*)backend|placeholder[[:space:]]+(wiring|implementation|backend)|temporary[[:space:]]+(stub|shim)'
pass_claim_regex='FUNCTIONAL_PASS:[[:space:]]*yes|FULL_FUNCTIONAL_DELIVERY|functional PASS|full functional delivery|100% build|one-time build|complete product workflow'
partial_allowed=false
if grep -qiE 'FUNCTIONAL_PASS:[[:space:]]*no' "$EVIDENCE_PATH" && grep -qiE '(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT):[[:space:]]*PARTIAL_FUNCTIONAL_DELIVERY' "$EVIDENCE_PATH" && grep -qiE 'Partial scope accepted by CS2:[[:space:]]*yes' "$EVIDENCE_PATH"; then
  if grep -qiE "$cs2_waiver_quote_regex" "$EVIDENCE_PATH"; then partial_allowed=true; else fail "Partial functional delivery with CS2 acceptance requires quoted explicit CS2 waiver text in functional evidence."; fi
fi
PLACEHOLDER_FOUND=false
PASS_CLAIM_FOUND=false
if grep -qiE "$placeholder_regex" "$EVIDENCE_PATH"; then PLACEHOLDER_FOUND=true; fi
if grep -qiE "$pass_claim_regex" "$EVIDENCE_PATH"; then PASS_CLAIM_FOUND=true; fi
if [ -n "$PR_BODY" ] && echo "$PR_BODY" | grep -qiE "$placeholder_regex"; then PLACEHOLDER_FOUND=true; fi
if [ -n "$PR_BODY" ] && echo "$PR_BODY" | grep -qiE "$pass_claim_regex"; then PASS_CLAIM_FOUND=true; fi
if [ "$PLACEHOLDER_FOUND" = true ] && [ "$PASS_CLAIM_FOUND" = true ] && [ "$partial_allowed" = false ]; then fail "Placeholder/incomplete language found while functional-pass/full-delivery claim exists."; fi
log "Placeholder Honesty gate: PASS"

if grep -qiE '^[[:space:]]*(\*\*)?FUNCTIONAL_PASS(\*\*)?:[[:space:]]*no' "$EVIDENCE_PATH"; then
  if grep -qiE 'code[[:space:]]+quality[[:space:]]+PASS|technically[[:space:]]+correct|no[[:space:]]+regressions' "$EVIDENCE_PATH"; then fail "Product-facing evidence cannot use acceptance language while FUNCTIONAL_PASS: no."; fi
  if grep -qiE 'ready[[:space:]]+for[[:space:]]+handover|merge[[:space:]]+gate[[:space:]]+released|ready[[:space:]]+for[[:space:]]+merge|closure[[:space:]]+approved' "$EVIDENCE_PATH"; then fail "Handover/merge/closure language is prohibited when FUNCTIONAL_PASS: no."; fi
fi
if ! grep -qF "$HEAD_SHA" "$EVIDENCE_PATH"; then fail "Evidence file must include current HEAD SHA value (${HEAD_SHA})."; fi

log ""
pass "All required hard gates passed for PR class ${PR_CLASS}."
