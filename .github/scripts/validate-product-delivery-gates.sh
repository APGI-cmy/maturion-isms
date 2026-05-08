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

if [[ "$PR_LABELS" == *"CS sign-off: approved"* ]]; then
  echo "✅ PASS — CS2 sign-off label present."
  exit 0
fi

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
  [[ "$file" =~ ^(apps|modules/MMM|packages)/ ]] && return 0
  [[ "$file" =~ \.(tsx|jsx|ts|js)$ ]] && [[ "$file" =~ (src/|app/|pages?/|components?/|routes?/|api/) ]] && return 0
  [[ "$file" =~ ^supabase/functions/ ]] && return 0
  return 1
}

is_claiming_product_delivery_in_doc() {
  local file="$1"
  [ -f "$file" ] || return 1
  [[ "$file" =~ \.md$ ]] || return 1
  grep -qiE 'full functional delivery|functional pass|100% build|one-time build|complete product workflow|FULL_FUNCTIONAL_DELIVERY' "$file"
}

PRODUCT_FACING=false
PRODUCT_FILES=""
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if is_product_path "$file" || is_claiming_product_delivery_in_doc "$file"; then
    PRODUCT_FACING=true
    PRODUCT_FILES="${PRODUCT_FILES}\n${file}"
  fi
done <<< "$CHANGED_FILES"

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

  ls .functional-delivery/pr-*.md 2>/dev/null | head -1 || true
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
    exists_proof=$(grep -R -l -F "$route" supabase apps modules packages api .github 2>/dev/null | grep -vE '\.md$' | head -1 || true)
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
  "Product/user journey:"
  "User journey tested:"
  "CTA/API map:"
  "Backend target proof:"
  "Screenshots or recording:"
  "Preview/live URL:"
  "Pass/fail result:"
  "Known partials:"
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
# Gate 4: IAA functional verdict split (product-facing requires split fields)
# ---------------------------------------------------------------------------
IAA_FILES="$(git diff --name-only --diff-filter=AM "${BASE_SHA:-HEAD~1}...HEAD" 2>/dev/null | grep -E '^\.agent-admin/assurance/(iaa-token-|iaa-wave-record-).+\.md$' || true)"
if [ -z "$IAA_FILES" ]; then
  IAA_FILES="$(ls .agent-admin/assurance/iaa-token-*.md .agent-admin/assurance/iaa-wave-record-*.md 2>/dev/null || true)"
fi

if [ -z "$IAA_FILES" ]; then
  echo "❌ FAIL — Product-facing PR requires IAA assurance artifact with split verdict fields."
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

# ---------------------------------------------------------------------------
# Gate 5: Placeholder honesty
# ---------------------------------------------------------------------------
placeholder_regex='not yet wired|placeholder|TODO backend'
pass_claim_regex='FUNCTIONAL_PASS:[[:space:]]*yes|FULL_FUNCTIONAL_DELIVERY|functional PASS|full functional delivery|100% build|one-time build|complete product workflow'
partial_allowed=false

if grep -qiE 'FUNCTIONAL_PASS:[[:space:]]*no' "$EVIDENCE_PATH" && \
   grep -qiE '(VERDICT|FULL_FUNCTIONAL_DELIVERY_VERDICT):[[:space:]]*PARTIAL_FUNCTIONAL_DELIVERY' "$EVIDENCE_PATH" && \
   grep -qiE 'Partial scope accepted by CS2:[[:space:]]*yes' "$EVIDENCE_PATH"; then
  partial_allowed=true
fi

PLACEHOLDER_FOUND=false
PASS_CLAIM_FOUND=false

while IFS= read -r file; do
  [ -z "$file" ] && continue
  [ -f "$file" ] || continue
  if grep -qiE "$placeholder_regex" "$file"; then
    PLACEHOLDER_FOUND=true
  fi
  if grep -qiE "$pass_claim_regex" "$file"; then
    PASS_CLAIM_FOUND=true
  fi
done <<< "$(printf "%s\n%s\n" "$CHANGED_FILES" "$EVIDENCE_PATH")"

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

if [ -n "$HEAD_SHA" ] && ! grep -qiF "$HEAD_SHA" "$EVIDENCE_PATH"; then
  echo "⚠️  WARNING — Evidence file does not contain current HEAD SHA value ($HEAD_SHA)."
fi

echo ""
echo "✅ PASS — All Phase 5 product delivery hard gates passed."
