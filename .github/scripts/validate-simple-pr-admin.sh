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
#   8. requires_iaa and requires_ecap are JSON booleans; EITHER a governance-
#      control type (governance-change, agent-contract-change) OR any changed
#      file matching .github/workflows/**, .github/scripts/**, .github/agents/**,
#      governance/**, or .agent-admin/** requires both flags to be true
#   9. All files changed in git diff are within the declared scope array
#      (.admin/pr.json itself is always implicitly permitted)
#  10. evidence_required is a non-empty list
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

# ── SHARED: Compute git diff for CHECK 8 and CHECK 9 ─────────────────────────
GIT_CHANGED=""
if git rev-parse origin/main >/dev/null 2>&1; then
  GIT_CHANGED=$(git diff --name-only origin/main...HEAD 2>/dev/null || true)
elif git rev-parse main >/dev/null 2>&1; then
  GIT_CHANGED=$(git diff --name-only main...HEAD 2>/dev/null || true)
fi

# ── CHECK 8: requires_iaa/requires_ecap are JSON booleans; governance-control ──
# ── types OR governance-control path changes require both flags to be true ────
#
# Governance-control path prefixes:
#   .github/workflows/   .github/scripts/   .github/agents/
#   governance/          .agent-admin/
echo "── CHECK 8: GOVERNANCE-CONTROL-FLAGS ──"
GOV_CHECK=$(CHANGED_FILES_STR="$GIT_CHANGED" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(".admin/pr.json"))
pr_type = manifest.get("type", "")
requires_iaa = manifest.get("requires_iaa", None)
requires_ecap = manifest.get("requires_ecap", None)
governance_types = ["governance-change", "agent-contract-change"]
gov_prefixes = (
    ".github/workflows/", ".github/scripts/", ".github/agents/",
    "governance/", ".agent-admin/"
)
failures = []
need_flags = False

# Type validation — both fields must be JSON booleans, not strings or null
if not isinstance(requires_iaa, bool):
    failures.append("requires_iaa must be a boolean (true/false), got: " + repr(requires_iaa))
if not isinstance(requires_ecap, bool):
    failures.append("requires_ecap must be a boolean (true/false), got: " + repr(requires_ecap))

if not failures:
    # Detect governance-control files in the git diff (passed via env var)
    raw = os.environ.get("CHANGED_FILES_STR", "")
    changed = [f.strip() for f in raw.splitlines() if f.strip()]
    gov_changed = [f for f in changed if any(f.startswith(p) for p in gov_prefixes)]

    # Flags are required when type is governance-control OR governance-control paths are touched
    need_flags = pr_type in governance_types or bool(gov_changed)

    if need_flags:
        reasons = []
        if pr_type in governance_types:
            reasons.append("type=" + pr_type)
        if gov_changed:
            display = gov_changed[:3]
            suffix = " (..." + str(len(gov_changed) - 3) + " more)" if len(gov_changed) > 3 else ""
            reasons.append("governance-control files changed: " + ", ".join(display) + suffix)
        reason_str = "; ".join(reasons)
        if not requires_iaa:
            failures.append("requires_iaa must be true (" + reason_str + ")")
        if not requires_ecap:
            failures.append("requires_ecap must be true (" + reason_str + ")")

if failures:
    print("FAIL: " + "; ".join(failures))
elif need_flags:
    print("PASS: governance-control flags set correctly")
else:
    print("PASS: type=" + pr_type + " (no governance-control file changes)")
PYEOF
)
if [[ "$GOV_CHECK" != PASS* ]]; then
  echo "❌ ERROR: $GOV_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ $GOV_CHECK"
fi
echo ""

# ── CHECK 9: Changed files are within the declared scope ─────────────────────
echo "── CHECK 9: SCOPE-TO-DIFF ──"
# GIT_CHANGED already computed above (shared with CHECK 8).
# Exclude .admin/pr.json itself — it is always implicitly permitted.

if [ -z "$GIT_CHANGED" ]; then
  echo "ℹ️  No git diff available (no main/origin-main ref found) — scope-to-diff check skipped."
else
  SCOPE_DIFF_CHECK=$(CHANGED_FILES_STR="$GIT_CHANGED" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(".admin/pr.json"))
scope_set = set(manifest.get("scope", []))
# The manifest itself is always implicitly permitted
excluded = {".admin/pr.json"}
raw = os.environ.get("CHANGED_FILES_STR", "").strip()
changed_files = [f.strip() for f in raw.splitlines() if f.strip() and f.strip() not in excluded]
out_of_scope = [f for f in changed_files if f not in scope_set]
if out_of_scope:
    count = len(out_of_scope)
    print("FAIL: " + str(count) + " file(s) changed outside declared scope: " + ", ".join(out_of_scope))
else:
    print("PASS: all " + str(len(changed_files)) + " changed file(s) are within declared scope")
PYEOF
  )
  if [[ "$SCOPE_DIFF_CHECK" != PASS* ]]; then
    echo "❌ ERROR: $SCOPE_DIFF_CHECK"
    echo "   Declared scope: $(python3 -c "import json; m=json.load(open('$MANIFEST')); print(', '.join(m.get('scope', [])))")"
    echo "   See governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md §Manifest"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ $SCOPE_DIFF_CHECK"
  fi
fi
echo ""

# ── CHECK 10: evidence_required is a non-empty list ──────────────────────────
echo "── CHECK 10: EVIDENCE-REQUIRED-NON-EMPTY ──"
EVID_CHECK=$(python3 - <<'PYEOF'
import json
manifest = json.load(open(".admin/pr.json"))
evidence = manifest.get("evidence_required", None)
if evidence is None:
    print("FAIL: evidence_required field missing")
elif not isinstance(evidence, list):
    print("FAIL: evidence_required must be a list, got: " + type(evidence).__name__)
elif len(evidence) == 0:
    print("FAIL: evidence_required must not be empty")
else:
    print("PASS: " + str(len(evidence)) + " evidence item(s) declared")
PYEOF
)
if [[ "$EVID_CHECK" != PASS* ]]; then
  echo "❌ ERROR: $EVID_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ $EVID_CHECK"
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
