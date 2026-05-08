#!/bin/bash
# validate-simple-pr-admin.sh
# Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.2.0
# Purpose: Validates the MMM PR admin manifest against the MMM Simple PR Admin Model
#
# Manifest resolution order (v1.2.0):
#   1. .admin/prs/pr-${PR_NUMBER}.json  (preferred — per-PR manifest)
#   2. .admin/pr.json                   (legacy fallback — migration period only)
#
# Checks performed:
#   1. Manifest found (per-PR or legacy); fail if both exist for same PR (MANIFEST-CONFLICT)
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
#      (the active manifest path itself is always implicitly permitted)
#  10. evidence_required is a non-empty list
#  13. execution_model: when implementation files are in
#      scope, execution_model must be one of:
#      - builder-governed       (requires implementing_agent)
#      - foreman-orchestrated   (requires orchestrating_agent + implementing_agent)
#      - cs2-hotfix-override    (requires non-empty cs2_justification)
#
# Usage:
#   PR_NUMBER=1545 .github/scripts/validate-simple-pr-admin.sh
#   .github/scripts/validate-simple-pr-admin.sh   # PR_NUMBER optional; legacy fallback used
#
# Environment variables:
#   PR_NUMBER   PR number — used to locate .admin/prs/pr-${PR_NUMBER}.json
#
# Exit codes:
#   0 = PASS
#   1 = FAIL

set -euo pipefail

ERRORS=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  MMM Simple PR Admin Model Validator"
echo "  Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.2.0"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── MANIFEST RESOLUTION ───────────────────────────────────────────────────────
# Preferred: .admin/prs/pr-${PR_NUMBER}.json
# Legacy fallback: .admin/pr.json (migration period only)
PER_PR_MANIFEST=""
LEGACY_MANIFEST=".admin/pr.json"

if [ -n "${PR_NUMBER:-}" ]; then
  PER_PR_MANIFEST=".admin/prs/pr-${PR_NUMBER}.json"
fi

MANIFEST=""
MANIFEST_CONFLICT=false

if [ -n "$PER_PR_MANIFEST" ] && [ -f "$PER_PR_MANIFEST" ]; then
  # Per-PR manifest found — check for conflict with legacy
  if [ -f "$LEGACY_MANIFEST" ]; then
    # Conflict if legacy manifest is also for the same PR number
    LEGACY_PR_NUM=$(python3 -c "
import json, sys
try:
    m = json.load(open('${LEGACY_MANIFEST}'))
    print(str(m.get('pr', '')))
except Exception:
    print('')
" 2>/dev/null || echo "")
    if [ "$LEGACY_PR_NUM" = "$PR_NUMBER" ]; then
      MANIFEST_CONFLICT=true
    fi
  fi
  MANIFEST="$PER_PR_MANIFEST"
elif [ -f "$LEGACY_MANIFEST" ]; then
  MANIFEST="$LEGACY_MANIFEST"
  echo "ℹ️  Using legacy manifest: $LEGACY_MANIFEST"
  if [ -n "${PR_NUMBER:-}" ]; then
    echo "   Migrate to: .admin/prs/pr-${PR_NUMBER}.json"
    echo "   See governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md §Migration"
  fi
  echo ""
fi

# ── CHECK 1: Manifest existence and conflict ──────────────────────────────────
echo "── CHECK 1: MANIFEST-EXISTS ──"
if [ "$MANIFEST_CONFLICT" = "true" ]; then
  echo "❌ ERROR: MANIFEST-CONFLICT — both $PER_PR_MANIFEST and $LEGACY_MANIFEST exist for PR ${PR_NUMBER}."
  echo "   Remove .admin/pr.json when using a per-PR manifest."
  echo "   See governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md §Migration"
  exit 1
fi
if [ -z "$MANIFEST" ]; then
  echo "❌ ERROR: No manifest found."
  if [ -n "${PR_NUMBER:-}" ]; then
    echo "   Expected at: .admin/prs/pr-${PR_NUMBER}.json"
  fi
  echo "   Legacy path: $LEGACY_MANIFEST"
  echo "   Every governed MMM PR must include a manifest."
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
MISSING=$(MANIFEST_PATH="$MANIFEST" python3 - <<'PYEOF'
import json, sys, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
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
ISSUE_CHECK=$(MANIFEST_PATH="$MANIFEST" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
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
SCOPE_CHECK=$(MANIFEST_PATH="$MANIFEST" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
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
TYPE_CHECK=$(MANIFEST_PATH="$MANIFEST" python3 - <<PYEOF
import json, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
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
RISK_CHECK=$(MANIFEST_PATH="$MANIFEST" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
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
MA_CHECK=$(MANIFEST_PATH="$MANIFEST" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
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
GOV_CHECK=$(MANIFEST_PATH="$MANIFEST" CHANGED_FILES_STR="$GIT_CHANGED" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
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
# The active manifest path itself is always implicitly permitted.

if [ -z "$GIT_CHANGED" ]; then
  echo "ℹ️  No git diff available (no main/origin-main ref found) — scope-to-diff check skipped."
else
  SCOPE_DIFF_CHECK=$(MANIFEST_PATH="$MANIFEST" CHANGED_FILES_STR="$GIT_CHANGED" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
scope_set = set(manifest.get("scope", []))
# The active manifest itself is always implicitly permitted
excluded = {os.environ['MANIFEST_PATH']}
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
    echo "   Declared scope: $(MANIFEST_PATH="$MANIFEST" python3 -c "import json,os; m=json.load(open(os.environ['MANIFEST_PATH'])); print(', '.join(m.get('scope', [])))")"
    echo "   See governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md §Manifest"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ $SCOPE_DIFF_CHECK"
  fi
fi
echo ""

# ── CHECK 10: evidence_required is a non-empty list ──────────────────────────
echo "── CHECK 10: EVIDENCE-REQUIRED-NON-EMPTY ──"
EVID_CHECK=$(MANIFEST_PATH="$MANIFEST" python3 - <<'PYEOF'
import json, os
manifest = json.load(open(os.environ['MANIFEST_PATH']))
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

# ── CHECK 13: Execution model requirement ────────────────────────────────────
# Trigger: any implementation files in declared scope:
#   apps/, src/, modules/, lib/, packages/
echo "── CHECK 13: EXECUTION-MODEL ──"
EXEC_MODEL_CHECK=$(MANIFEST_PATH="$MANIFEST" python3 - <<'PYEOF'
import json, os

manifest = json.load(open(os.environ['MANIFEST_PATH']))
scope = manifest.get("scope", [])
if not isinstance(scope, list):
    # CHECK 4 already handles this, but fail closed here as well.
    print("FAIL: scope must be a list before execution_model can be validated")
    raise SystemExit(0)

impl_prefixes = ("apps/", "src/", "modules/", "lib/", "packages/")
impl_paths = [p for p in scope if isinstance(p, str) and any(p.startswith(pref) for pref in impl_prefixes)]

if not impl_paths:
    print("PASS: no implementation files in scope")
    raise SystemExit(0)

allowed = ("builder-governed", "foreman-orchestrated", "cs2-hotfix-override")
execution_model = manifest.get("execution_model", None)

if not isinstance(execution_model, str) or execution_model not in allowed:
    if execution_model is None:
        print("FAIL: implementation files are in scope but execution_model field is missing from manifest. Add execution_model with one of: builder-governed, foreman-orchestrated, cs2-hotfix-override")
    else:
        print("FAIL: execution_model must be one of: " + ", ".join(allowed) + "; got: " + repr(execution_model))
    raise SystemExit(0)

def non_empty_string(value):
    return isinstance(value, str) and value.strip() != ""

if execution_model in ("builder-governed", "foreman-orchestrated"):
    implementing_agent = manifest.get("implementing_agent")
    if not non_empty_string(implementing_agent):
        print("FAIL: implementing_agent is required and must be non-empty when execution_model=" + execution_model)
        raise SystemExit(0)

if execution_model == "foreman-orchestrated":
    orchestrating_agent = manifest.get("orchestrating_agent")
    if not non_empty_string(orchestrating_agent):
        print("FAIL: orchestrating_agent is required and must be non-empty when execution_model=foreman-orchestrated")
        raise SystemExit(0)

if execution_model == "cs2-hotfix-override":
    justification = manifest.get("cs2_justification")
    placeholders = {"tbd", "todo", "na", "n/a", "placeholder"}
    if not non_empty_string(justification) or justification.strip().lower() in placeholders:
        print("FAIL: cs2_justification is required and must be non-empty (not placeholder) when execution_model=cs2-hotfix-override")
        raise SystemExit(0)

print("PASS: execution_model=" + execution_model + " validated for " + str(len(impl_paths)) + " implementation scope path(s)")
PYEOF
)
if [[ "$EXEC_MODEL_CHECK" != PASS* ]]; then
  echo "❌ ERROR: $EXEC_MODEL_CHECK"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ $EXEC_MODEL_CHECK"
fi
echo ""

# ── SUMMARY ──────────────────────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ PASS — $MANIFEST is valid."
  echo "   Authority: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.2.0"
  exit 0
else
  echo "❌ FAIL — $ERRORS error(s) found in $MANIFEST."
  echo "   Fix all errors above before merging."
  echo "   Reference: governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md v1.2.0"
  exit 1
fi
