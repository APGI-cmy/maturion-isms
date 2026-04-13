# IAA Verdict Artifact — Wave CL-4 AIMC Audit Phase A

```yaml
token_type: REJECTION-PACKAGE
session_id: session-wave-cl-4-aimc-audit-phase-a-20260313
date: 2026-03-13
pr_branch: copilot/cl-4-launch-audit-verification
wave: CL-4 — AIMC Audit Phase A: Foundation Verification (Parallel Execution Start)
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent
producing_agent_class: foreman
pr_category: EXEMPT (verified correct — but ceremony A-rule violations present)
checks_executed: 24
checks_passed: 22
checks_failed: 2
verdict: REJECTION-PACKAGE
adoption_phase: PHASE_B_BLOCKING
authority: CS2 (Johan Ras / @APGI-cmy)
iaa_version: independent-assurance-agent v6.2.0
```

---

## ═══════════════════════════════════════════════════════════════
## REJECTION-PACKAGE
## PR: copilot/cl-4-launch-audit-verification — Wave CL-4 AIMC Audit Phase A
## 2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.
## ═══════════════════════════════════════════════════════════════

**FAILURES:**

### FAILURE 1 — A-026 / CORE-021

**Check**: A-026 — SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly

**Finding**: `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` is present in the git
diff (7 files total) but is NOT listed in the CL-4 files table within the SCOPE_DECLARATION.
The file does not include itself in its own declaration.

**Fix required**:
Add the following row to the CL-4 `## Files Modified` table in
`.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`:
```
| `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | Governance personal | GOVERNANCE — this file (scope declaration for A-026/A-028) |
```

---

### FAILURE 2 — A-028 / CORE-021

**Check**: A-028 — SCOPE_DECLARATION format compliance — prior-wave entries must be trimmed

**Finding**: `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` contains two
additional `## Files Modified` sections from prior waves that were NOT removed during the
CL-4 "fresh overwrite":

- **Second section (wave17-parsing-instructions)**: Lists files including
  `apps/maturion-maturity-legacy/supabase/migrations/20260311000002_wave17_parsing_instructions.sql`,
  `apps/mat-ai-gateway/services/parsing.py`,
  `supabase/functions/invoke-ai-parse-criteria/index.ts`,
  `modules/mat/frontend/src/components/criteria/ParsingInstructionsModal.tsx`,
  and others — none of which are in the current git diff.

- **Third section (wave-ai-criteria-creation-fix)**: Lists files including
  `apps/maturion-maturity-legacy/supabase/migrations/20260311000001_criteria_add_title_column.sql`,
  `modules/mat/tests/wave17/wave17-criteria-title-fix.test.ts`,
  `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`,
  and others — none of which are in the current git diff.

The file declares "Fresh overwrite: YES (per A-029)" but the overwrite was incomplete —
prior-wave content was not removed.

**Fix required**:
Remove the second and third `## Files Modified` sections (wave17-parsing-instructions and
wave-ai-criteria-creation-fix entries) and their associated `## Out of Scope` sections
from `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`.

After the fix, the file should contain ONLY:
1. The CL-4 wave header block
2. The single CL-4 `## Files Modified` table (with SCOPE_DECLARATION.md itself added per Fix 1)
3. The `## IAA Category: EXEMPT` section

---

## What Passed

For the record: 22 of 24 checks PASSED.

**CERT gate**: CERT-001 through CERT-004 — all PASS  
**Core invariants**: CORE-007, CORE-013, CORE-014, CORE-015, CORE-016 (first invocation exception), CORE-017, CORE-018, CORE-019, CORE-020, CORE-022, CORE-023 — all PASS  
**OVL-INJ**: OVL-INJ-001, OVL-INJ-ADM-001, OVL-INJ-ADM-002 — all PASS  
**A-rules**: A-001, A-021, A-029, A-031 — all PASS  
**Category verification**: EXEMPT classification CORRECT — all 7 git diff files are governance/orchestration artifacts. No triggering content present.

---

## Re-Invocation Protocol

**STOP-AND-FIX**: This PR must not be opened until both failures are resolved.

**Required actions before re-invocation:**
1. Edit `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` — add self-row (Fix 1) and remove prior-wave sections (Fix 2) in a single edit
2. Commit and push all changes
3. Re-invoke IAA: `@independent-assurance-agent [IAA FINAL AUDIT REQUEST — Wave CL-4]` with note "R2 — SCOPE_DECLARATION corrected"

**Expected R2 outcome**: With both fixes applied, all 24 checks should PASS and ASSURANCE-TOKEN will be issued.

**Advisory**: The two fixes are trivial (one table row addition + removal of stale markdown sections). R2 should be a rapid turnaround.

---

## ═══════════════════════════════════════════════════════════════
## This PR must not be opened until all failures are resolved
## and IAA re-invoked with ASSURANCE-TOKEN issued.
## Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
## ═══════════════════════════════════════════════════════════════

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA**: independent-assurance-agent v6.2.0
**STOP-AND-FIX Mandate**: ACTIVE
**Date**: 2026-03-13
