#!/bin/bash
# validate-simple-pr-admin.sh
# Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.0.0
# Purpose: Validates .admin/pr.json against the MMM Simple PR Admin Model
#
# Checks performed:
#   1. .admin/pr.json exists
#   2. All required fields are present (pr, issue, type, owner, scope, risk,
#      requires_iaa, requires_ecap, evidence_required, merge_authority)
#   3. issue is a number
#   4. scope is a non-empty list
#   5. type is one of the accepted values
#   6. risk is one of: low, medium, high
#   7. merge_authority is "CS2"
#   8. If governance-control files changed and type requires_iaa/requires_ecap,
#      those booleans must be true
#
# Usage:
#   .github/scripts/validate-simple-pr-admin.sh
#
# Exit codes:
#   0 = PASS
#   1 = FAIL

set -euo pipefail

MANIFEST=".admin/pr.json"
ERRORS=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MMM Simple PR Admin Model Validator"
echo "  Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.0.0"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── CHECK 1: Manifest existence ───────────────────────────────────────────────
echo "── CHECK 1: MANIFEST-EXISTS ──"
if [ ! -f "$MANIFEST" ]; then
  echo "❌ ERROR: $MANIFEST not found."
  echo "   Every governed MMM PR must include .admin/pr.json."
  echo "   See governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md §Manifest"
  exit 1
fi
echo "✅ $MANIFEST found."
echo ""

# Verify python3 is available (required for JSON parsing)
if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ ERROR: python3 is required but not found."
  echo "   Install python3 to use this validator."
  exit 1
fi

# Parse manifest with python (jq may not be available in all environments)
if ! PARSE_ERROR=$(python3 -c "import json,sys; json.load(open('${MANIFEST}'))" 2>&1); then
  echo "❌ ERROR: $MANIFEST is not valid JSON."
  echo "   Parse error: $PARSE_ERROR"
  exit 1
fi

# ── CHECK 2: Required fields ──────────────────────────────────────────────────
echo "── CHECK 2: REQUIRED-FIELDS ──"
REQUIRED_FIELDS='["pr","issue","type","owner","scope","risk","requires_iaa","requires_ecap","evidence_required","merge_authority"]'
MISSING=$(python3 - <<'PYEOF'
import json, sys
manifest = json.load(open(".admin/pr.json"))
required = ["pr","issue","type","owner","scope","risk","requires_iaa","requires_ecap","evidence_required","merge_authority"]
missing = [f for f in required if f not in manifest]
print(",".join(missing))
PYEOF
)
if [ -n "$MISSING" ]; then
  echo "❌ ERROR: Missing required fields: $MISSING"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ All required fields present."
fi
echo ""

# ── CHECK 3: issue is a number ────────────────────────────────────────────────
echo "── CHECK 3: ISSUE-IS-NUMBER ──"
ISSUE_CHECK=$(python3 - <<'PYEOF'
import json
manifest = json.load(open(".admin/pr.json"))
issue = manifest.get("issue", "MISSING")
if not isinstance(issue, int):
    print("FAIL: issue must be a number, got: " + repr(issue))
else:
    print("PASS")
PYEOF
)
if [[ "$ISSUE_CHECK" != "PASS" ]]; then
  echo "❌ ERROR: $ISSUE_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ issue is a number."
fi
echo ""

# ── CHECK 4: scope is a non-empty list ───────────────────────────────────────
echo "── CHECK 4: SCOPE-NON-EMPTY ──"
SCOPE_CHECK=$(python3 - <<'PYEOF'
import json
manifest = json.load(open(".admin/pr.json"))
scope = manifest.get("scope", None)
if scope is None:
    print("FAIL: scope field missing")
elif not isinstance(scope, list):
    print("FAIL: scope must be a list, got: " + type(scope).__name__)
elif len(scope) == 0:
    print("FAIL: scope must not be empty")
else:
    print("PASS: " + str(len(scope)) + " files declared")
PYEOF
)
if [[ "$SCOPE_CHECK" != PASS* ]]; then
  echo "❌ ERROR: $SCOPE_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ $SCOPE_CHECK"
fi
echo ""

# ── CHECK 5: type is an accepted value ───────────────────────────────────────
# Accepted types defined in:
#   governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md §"Accepted PR types"
echo "── CHECK 5: TYPE-VALID ──"
ACCEPTED_TYPES="product-fix test-only deployment-change database-migration governance-change agent-contract-change"
TYPE_CHECK=$(python3 - <<PYEOF
import json
manifest = json.load(open(".admin/pr.json"))
pr_type = manifest.get("type", "MISSING")
accepted = "$ACCEPTED_TYPES".split()
if pr_type not in accepted:
    print("FAIL: type '" + pr_type + "' is not one of: " + ", ".join(accepted))
else:
    print("PASS: " + pr_type)
PYEOF
)
if [[ "$TYPE_CHECK" != PASS* ]]; then
  echo "❌ ERROR: $TYPE_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ $TYPE_CHECK"
fi
echo ""

# ── CHECK 6: risk is one of low/medium/high ───────────────────────────────────
echo "── CHECK 6: RISK-VALID ──"
RISK_CHECK=$(python3 - <<'PYEOF'
import json
manifest = json.load(open(".admin/pr.json"))
risk = manifest.get("risk", "MISSING")
if risk not in ["low", "medium", "high"]:
    print("FAIL: risk '" + str(risk) + "' must be one of: low, medium, high")
else:
    print("PASS: " + risk)
PYEOF
)
if [[ "$RISK_CHECK" != PASS* ]]; then
  echo "❌ ERROR: $RISK_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ $RISK_CHECK"
fi
echo ""

# ── CHECK 7: merge_authority is CS2 ──────────────────────────────────────────
echo "── CHECK 7: MERGE-AUTHORITY ──"
MA_CHECK=$(python3 - <<'PYEOF'
import json
manifest = json.load(open(".admin/pr.json"))
ma = manifest.get("merge_authority", "MISSING")
if ma != "CS2":
    print("FAIL: merge_authority must be 'CS2', got: " + repr(ma))
else:
    print("PASS")
PYEOF
)
if [[ "$MA_CHECK" != "PASS" ]]; then
  echo "❌ ERROR: $MA_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ merge_authority is CS2."
fi
echo ""

# ── CHECK 8: governance-control types require requires_iaa/requires_ecap ──────
echo "── CHECK 8: GOVERNANCE-CONTROL-FLAGS ──"
GOV_CHECK=$(python3 - <<'PYEOF'
import json
manifest = json.load(open(".admin/pr.json"))
pr_type = manifest.get("type", "")
requires_iaa = manifest.get("requires_iaa", False)
requires_ecap = manifest.get("requires_ecap", False)
governance_types = ["governance-change", "agent-contract-change"]
if pr_type in governance_types:
    failures = []
    if not requires_iaa:
        failures.append("requires_iaa must be true for type=" + pr_type)
    if not requires_ecap:
        failures.append("requires_ecap must be true for type=" + pr_type)
    if failures:
        print("FAIL: " + "; ".join(failures))
    else:
        print("PASS: governance-control flags set correctly")
else:
    print("PASS: type=" + pr_type + " (no governance-control flag requirement)")
PYEOF
)
if [[ "$GOV_CHECK" != PASS* ]]; then
  echo "❌ ERROR: $GOV_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ $GOV_CHECK"
fi
echo ""

# ── SUMMARY ──────────────────────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ PASS — .admin/pr.json is valid."
  echo "   Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.0.0"
  exit 0
else
  echo "❌ FAIL — $ERRORS error(s) found in .admin/pr.json."
  echo "   Fix all errors above before merging."
  echo "   Reference: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.0.0"
  exit 1
fi
