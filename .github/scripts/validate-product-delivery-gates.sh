#!/bin/bash
# validate-product-delivery-gates.sh
# Purpose: Phase 5 product-delivery hard gates for CTA mapping, endpoint integrity,
#          functional evidence completeness, IAA functional verdict split, and
#          placeholder honesty.
# Authority: maturion-isms#1573

set -euo pipefail

BASE_SHA="${BASE_SHA:-}"
PR_NUMBER="${PR_NUMBER:-}"
PR_LABELS="${PR_LABELS:-}"
PR_BODY="${PR_BODY:-}"
HEAD_SHA="${HEAD_SHA:-$(git rev-parse HEAD 2>/dev/null || echo "")}"
DEFAULT_EVIDENCE_PATH="${FUNCTIONAL_DELIVERY_EVIDENCE_PATH:-}"

echo "=== Product Delivery Gate Suite ==="
echo "Issue: maturion-isms#1573"
echo ""

if [[ "$PR_LABELS" == *"governance"* ]] && [[ "$PR_LABELS" == *"automated"* ]] && [[ "$PR_LABELS" == *"agent:liaison"* ]]; then
  echo "✅ PASS — Automated governance alignment PR bypass."
  exit 0
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
  echo "✅ PASS — No changed files."
  exit 0
fi

is_product_path() {
  local file="$1"
  case "$file" in
    .github/*|governance/*|docs/*|.agent-admin/*|.agent-workspace/*)
      return 1
      ;;
    .functional-delivery/pr-template.md)
      return 1
      ;;
  esac

  [[ "$file" =~ ^supabase/migrations/ ]] && return 0
  [[ "$file" =~ ^supabase/seed/ ]] && return 0
  [[ "$file" =~ ^(apps|packages|supabase/functions|api)/ ]] && [[ "$file" =~ \.(tsx|jsx|ts|js|py|go)$ ]] && return 0
  [[ "$file" =~ ^modules/[^/]+/(src|app|api|frontend|backend|pages?|components?|routes?)/ ]] && [[ "$file" =~ \.(tsx|jsx|ts|js|py|go)$ ]] && return 0
  [[ "$file" =~ \.(tsx|jsx|ts|js|py|go)$ ]] && [[ "$file" =~ (^|/)(src|app|api|pages?|components?|routes?)/ ]] && return 0
  return 1
}

is_live_functional_delivery_evidence_file() {
  local file="$1"
  [[ "$file" =~ ^\.functional-delivery/pr-[0-9]+\.md$ ]]
}

pr_body_claims_product_delivery() {
  [ -n "$PR_BODY" ] || return 1
  # Intentionally broad: this classifier treats PR-body delivery/handover/product-fix language
  # as delivery claims so evidence is required instead of allowing under-detection.
  local claim_patterns=(
    'Functional-Delivery-Artifact:[[:space:]]*[^[:space:]]+'
    'FUNCTIONAL_PASS:[[:space:]]*yes'
    'FULL_FUNCTIONAL_DELIVERY_VERDICT:[[:space:]]*FULL_FUNCTIONAL_DELIVERY([[:space:]]*$)'
    'FULL_FUNCTIONAL_DELIVERY_VERDICT:[[:space:]]*PARTIAL_FUNCTIONAL_DELIVERY([[:space:]]*$)'
    'VERDICT:[[:space:]]*FULL_FUNCTIONAL_DELIVERY([[:space:]]*$)'
    'VERDICT:[[:space:]]*PARTIAL_FUNCTIONAL_DELIVERY([[:space:]]*$)'
    '(^|[[:space:][:punct:]])PARTIAL_FUNCTIONAL_DELIVERY([[:space:]]*$|[[:space:]]*[,.;:!?()])'
    '(^|[[:space:][:punct:]])functional[[:space:]]+delivery([[:space:][:punct:]]|$)'
    '(^|[[:space:][:punct:]])(handover[[:space:]]+readiness|ready[[:space:]]+for[[:space:]]+handover)([[:space:][:punct:]]|$)'
    '(^|[[:space:][:punct:]])product[[:space:]]+fix([[:space:][:punct:]]|$)'
    'Pass/fail result:[[:space:]]*pass([[:space:]]*$)'
  )
  local pattern
  for pattern in "${claim_patterns[@]}"; do
    if echo "$PR_BODY" | grep -qiE "$pattern"; then
      return 0
    fi
  done
  return 1
}

PRODUCT_FACING=false
PRODUCT_FILES=""
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if is_product_path "$file" || is_live_functional_delivery_evidence_file "$file"; then
    PRODUCT_FACING=true
    PRODUCT_FILES="${PRODUCT_FILES}\n${file}"
  fi
done <<< "$CHANGED_FILES"

if [ "$PRODUCT_FACING" = false ] && pr_body_claims_product_delivery; then
  PRODUCT_FACING=true
  PRODUCT_FILES="${PRODUCT_FILES}\n<pr-body-product-delivery-claim>"
fi

if [ "$PRODUCT_FACING" = false ]; then
  echo "ℹ️  Not a product-facing PR by classifier — Phase 5 product gates N/A."
  exit 0
fi

echo "Product-facing scope detected:"
echo -e "$PRODUCT_FILES" | sed '/^$/d' | sed 's/^/  - /'
echo ""

resolve_evidence_path() {
  local from_body=""
  local from_env="$DEFAULT_EVIDENCE_PATH"
  local default_path=""
  if [ -n "$PR_NUMBER" ]; then
    default_path=".functional-delivery/pr-${PR_NUMBER}.md"
  fi

  if [ -n "$PR_BODY" ]; then
    from_body=$(echo "$PR_BODY" | sed -nE 's/.*[Ff]unctional-[Dd]elivery-[Aa]rtifact:[[:space:]]*([^[:space:]]+).*/\1/p' | head -1 || true)
  fi

  for candidate in "$from_env" "$from_body" "$default_path"; do
    [ -n "$candidate" ] || continue
    if [ -f "$candidate" ]; then
      echo "$candidate"
      return 0
    fi
  done
}

EVIDENCE_PATH="$(resolve_evidence_path)"
if [ -z "$EVIDENCE_PATH" ] || [ ! -f "$EVIDENCE_PATH" ]; then
  echo "❌ FAIL — Functional delivery evidence missing."
  echo "   Required default path: .functional-delivery/pr-${PR_NUMBER}.md"
  echo "   Optional equivalent: set FUNCTIONAL_DELIVERY_EVIDENCE_PATH or PR body line 'Functional-Delivery-Artifact: <path>'"
  exit 1
fi

echo "Functional evidence artifact: $EVIDENCE_PATH"

# ---------------------------------------------------------------------------
# Gate 1: No Dead CTA (mapping required when CTA patterns present)
# ---------------------------------------------------------------------------
CTA_SCAN_FILES=""
CTA_PAT='(<button|onClick|fetch\(|navigate\(|supabase\.functions\.invoke)'
while IFS= read -r file; do
  [ -z "$file" ] && continue
  [ -f "$file" ] || continue
  [[ "$file" =~ \.(tsx|jsx|ts|js)$ ]] || continue
  if grep -qE "$CTA_PAT" "$file"; then
    CTA_SCAN_FILES="${CTA_SCAN_FILES}\n${file}"
  fi
done <<< "$CHANGED_FILES"

if [ -n "$CTA_SCAN_FILES" ]; then
  if ! grep -qiE 'CTA.?/visible action|Backend/API/Edge target|Success state|Failure state' "$EVIDENCE_PATH"; then
    echo "❌ FAIL — CTA/action patterns detected but evidence lacks CTA mapping table fields."
    echo -e "$CTA_SCAN_FILES" | sed '/^$/d' | sed 's/^/  - /'
    exit 1
  fi
  echo "✅ No Dead CTA gate: PASS"
else
  echo "ℹ️  No CTA patterns detected in changed product files."
fi

# ---------------------------------------------------------------------------
# Gate 2: No Invented Endpoint (for guarded routes)
# ---------------------------------------------------------------------------
INVENTED_FAIL=false
declare -a GUARDED_ROUTES=(
  "/api/organisations"
  "/api/frameworks/init"
  "/api/upload/framework-source"
  "/api/ai/framework-generate"
  "/api/qiw/status"
)

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
    if grep -qF "$route" "$file"; then
      route_hit=true
      break
    fi
  done <<< "$CHANGED_FILES"

  if [ "$route_hit" = true ]; then
    exists_proof=$(grep -R -l -F "$route" supabase/functions api modules apps packages 2>/dev/null | grep -E '(^supabase/functions/|^api/|/api/|/backend/|/server/|/edge/)' | grep -vE '(^|/)(tests?|__tests__|spec|fixtures?)/|(\.test|\.spec)\.' | grep -vE '\.md$' | head -1 || true)
    if [ -z "$exists_proof" ]; then
      route_without_prefix="${route#/api/}"
      for candidate in \
        "api/${route_without_prefix}.ts" \
        "api/${route_without_prefix}.js" \
        "api/${route_without_prefix}.py" \
        "api/${route_without_prefix}.go" \
        "api/${route_without_prefix}/index.ts" \
        "api/${route_without_prefix}/route.ts"; do
        if [ -f "$candidate" ]; then
          exists_proof="$candidate"
          break
        fi
      done
    fi
    test_proof=$(grep -R -l -F "$route" apps modules packages supabase 2>/dev/null | grep -E '(test|spec)\.(ts|tsx|js|jsx|py)$' | head -1 || true)
    capability="$(route_capability "$route")"
    map_proof=""
    if [ -n "$capability" ] && grep -qiF "$capability" "$EVIDENCE_PATH" && grep -qiF "$route" "$EVIDENCE_PATH"; then
      map_proof="evidence-map"
    elif echo "$PR_BODY" | grep -qiE "Route Approval:[[:space:]]*${route}"; then
      map_proof="pr-body-route-approval"
    fi

    if [ -z "$exists_proof" ] || [ -z "$test_proof" ] || [ -z "$map_proof" ]; then
      echo "❌ FAIL — No Invented Endpoint gate for $route"
      [ -z "$exists_proof" ] && echo "   Missing proof: exact route implementation exists (non-doc source)."
      [ -z "$test_proof" ] && echo "   Missing proof: route is covered in a test/spec file."
      [ -z "$map_proof" ] && echo "   Missing proof: route-to-capability mapping or explicit route approval."
      INVENTED_FAIL=true
    fi
  fi
done

if [ "$INVENTED_FAIL" = true ]; then
  exit 1
fi
echo "✅ No Invented Endpoint gate: PASS"

# ---------------------------------------------------------------------------
# Gate 3: Functional Delivery Evidence completeness
# ---------------------------------------------------------------------------
required_sections=(
  "PR:"
  "Issue:"
  "Current head SHA reviewed:"
  "PROMISED_USER_JOURNEY:"
  "ENTRY_POINT:"
  "FINAL_EXPECTED_STATE:"
  "USER_CAN_COMPLETE_JOURNEY:"
  "Product/user journey:"
  "User journey tested:"
  "CTA_MAP:"
  "CTA/API map:"
  "BACKEND_CAPABILITY_MAP:"
  "Backend target proof:"
  "SCHEMA_CONTRACT_CHECK:"
  "CROSS_FUNCTION_COMPATIBILITY_CHECK:"
  "ASYNC_JOB_CHECK:"
  "VISIBLE_STATE_CHECK:"
  "DEPLOYED_PREVIEW_CHECK:"
  "DASHBOARD_OR_STATE_REFLECTION_CHECK:"
  "Screenshots or recording:"
  "Preview/live URL:"
  "Pass/fail result:"
  "KNOWN_PARTIALS:"
  "Known partials:"
  "CS2_PARTIAL_ACCEPTANCE:"
  "Known limitations:"
  "Partial scope accepted by CS2:"
  "Builder QA functional report reference:"
  "ECAP/admin-gate report reference:"
  "IAA final assurance reference:"
)

for section in "${required_sections[@]}"; do
  if ! grep -qiF "$section" "$EVIDENCE_PATH"; then
    echo "❌ FAIL — Functional evidence missing required section: $section"
    exit 1
  fi
done
echo "✅ Functional Delivery Evidence gate: PASS"

# ---------------------------------------------------------------------------
# Gate 3b: Split verdict and contradiction integrity (evidence-level)
# ---------------------------------------------------------------------------
if ! grep -qiE '^[[:space:]]*(\*\*)?ADMIN_PASS(\*\*)?:[[:space:]]*(yes|no)' "$EVIDENCE_PATH"; then
  echo "❌ FAIL — Evidence missing split verdict field: ADMIN_PASS"
  exit 1
fi
if ! grep -qiE '^[[:space:]]*(\*\*)?FUNCTIONAL_PASS(\*\*)?:[[:space:]]*(yes|no)' "$EVIDENCE_PATH"; then
  echo "❌ FAIL — Evidence missing split verdict field: FUNCTIONAL_PASS"
  exit 1
fi
if ! grep -qiE '^[[:space:]]*(\*\*)?(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT)(\*\*)?:[[:space:]]*(FULL_FUNCTIONAL_DELIVERY|PARTIAL_FUNCTIONAL_DELIVERY|ADMIN_ONLY|FAIL)' "$EVIDENCE_PATH"; then
  echo "❌ FAIL — Evidence missing split verdict field: VERDICT/FULL_FUNCTIONAL_DELIVERY_VERDICT"
  exit 1
fi

if grep -qiE '^[[:space:]]*(\*\*)?FUNCTIONAL_PASS(\*\*)?:[[:space:]]*yes' "$EVIDENCE_PATH" && \
   ! grep -qiE '^[[:space:]]*(\*\*)?(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT)(\*\*)?:[[:space:]]*FULL_FUNCTIONAL_DELIVERY([[:space:]]*$)' "$EVIDENCE_PATH"; then
  echo "❌ FAIL — FUNCTIONAL_PASS: yes requires VERDICT: FULL_FUNCTIONAL_DELIVERY."
  exit 1
fi

if grep -qiE '^[[:space:]]*(\*\*)?(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT)(\*\*)?:[[:space:]]*FULL_FUNCTIONAL_DELIVERY([[:space:]]*$)' "$EVIDENCE_PATH"; then
  known_partials_value="$(grep -iE '^[[:space:]]*(KNOWN_PARTIALS|Known partials):' "$EVIDENCE_PATH" | head -1 | cut -d: -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' || true)"
  known_partials_value_lower="$(printf '%s' "$known_partials_value" | tr '[:upper:]' '[:lower:]')"
  if [ -n "$known_partials_value" ] && [ "$known_partials_value_lower" != "none" ]; then
    echo "❌ FAIL — FULL_FUNCTIONAL_DELIVERY cannot coexist with known partials."
    exit 1
  fi
  if grep -qiE 'outstanding|pending|not[[:space:]-]verified|incomplete' "$EVIDENCE_PATH"; then
    echo "❌ FAIL — FULL_FUNCTIONAL_DELIVERY cannot coexist with outstanding/pending/not-verified language."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Gate 4: IAA functional verdict split (product-facing requires split fields)
# ---------------------------------------------------------------------------
IAA_FILES="$(git diff --name-only --diff-filter=AM "${BASE_SHA:-HEAD~1}...HEAD" 2>/dev/null | grep -E '^\.agent-admin/assurance/(iaa-token-|iaa-wave-record-).+\.md$' || true)"

if [ -z "$IAA_FILES" ]; then
  echo "❌ FAIL - Product-facing PR requires a PR-diff IAA assurance artifact with split verdict fields."
  echo "   No added/modified IAA token/wave-record file was found in this PR diff."
  exit 1
fi

IAA_VERDICT_OK=false
while IFS= read -r iaa_file; do
  [ -n "$iaa_file" ] || continue
  [ -f "$iaa_file" ] || continue

  has_admin=$(grep -qiE '^[[:space:]]*(\*\*)?ADMIN_PASS(\*\*)?:[[:space:]]*(yes|no)' "$iaa_file" && echo yes || echo no)
  has_functional=$(grep -qiE '^[[:space:]]*(\*\*)?FUNCTIONAL_PASS(\*\*)?:[[:space:]]*(yes|no)' "$iaa_file" && echo yes || echo no)
  has_verdict=$(grep -qiE '^[[:space:]]*(\*\*)?(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT)(\*\*)?:[[:space:]]*(FULL_FUNCTIONAL_DELIVERY|PARTIAL_FUNCTIONAL_DELIVERY|ADMIN_ONLY|FAIL)' "$iaa_file" && echo yes || echo no)

  if [ "$has_admin" = "yes" ] && [ "$has_functional" = "yes" ] && [ "$has_verdict" = "yes" ]; then
    IAA_VERDICT_OK=true
    break
  fi
done <<< "$IAA_FILES"

if [ "$IAA_VERDICT_OK" = false ]; then
  echo "❌ FAIL — IAA Functional Verdict gate: split fields missing."
  echo "   Required fields for product-facing PRs:"
  echo "   - ADMIN_PASS: yes/no"
  echo "   - FUNCTIONAL_PASS: yes/no"
  echo "   - VERDICT: FULL_FUNCTIONAL_DELIVERY | PARTIAL_FUNCTIONAL_DELIVERY | ADMIN_ONLY | FAIL"
  echo "     (FULL_FUNCTIONAL_DELIVERY_VERDICT accepted as alias)"
  exit 1
fi
echo "✅ IAA Functional Verdict gate: PASS"

# Gate 4b: PASS_WITH_CS2_WAIVER must quote explicit CS2 waiver text
# Accepted formats in evidence/templates:
#   CS2 waiver quote: "<explicit waiver text>"
#   CS2_WAIVER_QUOTE: "<explicit waiver text>"
while IFS= read -r iaa_file; do
  [ -n "$iaa_file" ] || continue
  [ -f "$iaa_file" ] || continue
  if grep -qiE 'PASS_WITH_CS2_WAIVER' "$iaa_file"; then
    if ! grep -qiE '((CS2[[:space:]_-]*waiver([[:space:]_-]*(quote|text))?)|CS2_WAIVER_QUOTE)[[:space:]]*:[[:space:]]*".+"' "$iaa_file"; then
      echo "❌ FAIL — PASS_WITH_CS2_WAIVER in $iaa_file requires quoted explicit CS2 waiver text."
      exit 1
    fi
  fi
done <<< "$IAA_FILES"

# ---------------------------------------------------------------------------
# Gate 5: Placeholder honesty
# ---------------------------------------------------------------------------
placeholder_regex='not yet wired|TODO([[:space:]]+|:[[:space:]]*|_[[:space:]]*|-+[[:space:]]*)backend|placeholder[[:space:]]+(wiring|implementation|backend)|temporary[[:space:]]+(stub|shim)'
pass_claim_regex='FUNCTIONAL_PASS:[[:space:]]*yes|FULL_FUNCTIONAL_DELIVERY|functional PASS|full functional delivery|100% build|one-time build|complete product workflow'
partial_allowed=false

if grep -qiE 'FUNCTIONAL_PASS:[[:space:]]*no' "$EVIDENCE_PATH" && \
   grep -qiE '(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT):[[:space:]]*PARTIAL_FUNCTIONAL_DELIVERY' "$EVIDENCE_PATH" && \
   grep -qiE 'Partial scope accepted by CS2:[[:space:]]*yes' "$EVIDENCE_PATH"; then
  partial_allowed=true
fi

PLACEHOLDER_FOUND=false
PASS_CLAIM_FOUND=false

if [ -f "$EVIDENCE_PATH" ] && grep -qiE "$placeholder_regex" "$EVIDENCE_PATH"; then
  PLACEHOLDER_FOUND=true
fi
if [ -f "$EVIDENCE_PATH" ] && grep -qiE "$pass_claim_regex" "$EVIDENCE_PATH"; then
  PASS_CLAIM_FOUND=true
fi
if [ -n "$PR_BODY" ] && echo "$PR_BODY" | grep -qiE "$placeholder_regex"; then
  PLACEHOLDER_FOUND=true
fi
if [ -n "$PR_BODY" ] && echo "$PR_BODY" | grep -qiE "$pass_claim_regex"; then
  PASS_CLAIM_FOUND=true
fi

if [ "$PLACEHOLDER_FOUND" = true ] && [ "$PASS_CLAIM_FOUND" = true ] && [ "$partial_allowed" = false ]; then
  echo "❌ FAIL — Placeholder Honesty gate."
  echo "   Placeholder/incomplete language found while functional-pass/full-delivery claim exists."
  echo "   Allowed partial path requires:"
  echo "   - FUNCTIONAL_PASS: no"
  echo "   - VERDICT (or FULL_FUNCTIONAL_DELIVERY_VERDICT): PARTIAL_FUNCTIONAL_DELIVERY"
  echo "   - Partial scope accepted by CS2: yes"
  exit 1
fi
echo "✅ Placeholder Honesty gate: PASS"

# ---------------------------------------------------------------------------
# Gate 6: False-PASS phrase contradictions and handover language discipline
# ---------------------------------------------------------------------------
if grep -qiE '^[[:space:]]*(\*\*)?FUNCTIONAL_PASS(\*\*)?:[[:space:]]*no' "$EVIDENCE_PATH"; then
  if grep -qiE 'code[[:space:]]+quality[[:space:]]+PASS|technically[[:space:]]+correct|no[[:space:]]+regressions' "$EVIDENCE_PATH"; then
    echo "❌ FAIL — product-facing evidence cannot use acceptance language while FUNCTIONAL_PASS: no."
    exit 1
  fi
  if grep -qiE 'ready[[:space:]]+for[[:space:]]+handover|merge[[:space:]]+gate[[:space:]]+released|ready[[:space:]]+for[[:space:]]+merge|closure[[:space:]]+approved' "$EVIDENCE_PATH"; then
    echo "❌ FAIL — handover/merge/closure language is prohibited when FUNCTIONAL_PASS: no."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Gate 7: Evidence must include current reviewed head SHA
# ---------------------------------------------------------------------------
if [ -n "$HEAD_SHA" ] && ! grep -qiF "$HEAD_SHA" "$EVIDENCE_PATH"; then
  echo "❌ FAIL — Evidence file must include current HEAD SHA value ($HEAD_SHA)."
  exit 1
fi

echo ""
echo "✅ PASS — All Phase 5 product delivery hard gates passed."
