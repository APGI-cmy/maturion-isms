# IAA Verdict Artifact — Wave CL-4 AIMC Audit Phase A — R2

```yaml
token_type: REJECTION-PACKAGE
session_id: session-wave-cl-4-aimc-audit-phase-a-20260313-R2
date: 2026-03-13
pr_branch: copilot/cl-4-launch-audit-verification
wave: CL-4 — AIMC Audit Phase A: Foundation Verification (Parallel Execution Start)
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent
producing_agent_class: foreman
pr_category: EXEMPT (verified correct)
checks_executed: 24
checks_passed: 23
checks_failed: 1
verdict: REJECTION-PACKAGE
adoption_phase: PHASE_B_BLOCKING
authority: CS2 (Johan Ras / @APGI-cmy)
iaa_version: independent-assurance-agent v6.2.0
r1_token: .agent-admin/assurance/iaa-token-session-wave-cl-4-aimc-audit-phase-a-20260313.md
r1_findings_resolved: "A-026 (self-row) — CONFIRMED PASS; A-028 (stale entries) — CONFIRMED PASS"
r2_new_finding: "A-026 — A-031 carve-out note absent for 3 IAA R1 ceremony files in diff"
```

---

## ═══════════════════════════════════════════════════════════════
## REJECTION-PACKAGE
## PR: copilot/cl-4-launch-audit-verification — Wave CL-4 AIMC Audit Phase A (R2)
## 1 check FAILED. Merge blocked. STOP-AND-FIX required.
## ═══════════════════════════════════════════════════════════════

### FAILURE — A-026 / CORE-021

**Check**: A-026 — SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly

**Finding**: 3 IAA ceremony files from the R1 rejection ceremony are present in
`git diff --name-only origin/main...HEAD` (10 files total) but are not declared in
`SCOPE_DECLARATION.md` (7 files declared), and no A-031 carve-out note is present.

The 3 undeclared files:
1. `.agent-admin/assurance/iaa-token-session-wave-cl-4-aimc-audit-phase-a-20260313.md` — IAA R1 rejection token
2. `.agent-workspace/independent-assurance-agent/memory/session-wave-cl-4-aimc-audit-phase-a-20260313.md` — IAA R1 session memory
3. `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` — IAA R1 parking station update

**A-031 analysis**:
- Identity check: All 3 exclusively match IAA ceremony artifact patterns
  (`.agent-admin/assurance/iaa-token-*.md` and `.agent-workspace/independent-assurance-agent/`) — **PASS**
- Carve-out note check: No A-031 carve-out note in `SCOPE_DECLARATION.md` — **ABSENT ❌**
- Per A-031: "If YES [exclusively IAA ceremony artifacts] but carve-out note absent → A-026 FAIL"

**Fix required (choose either option):**

**Option A — Add A-031 carve-out note (RECOMMENDED — minimal change):**

Add the following section to `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`
immediately after the `## IAA Category: EXEMPT` section:

```markdown
## A-031 Carve-Out

IAA ceremony artifacts from R1 rejection ceremony
(session-wave-cl-4-aimc-audit-phase-a-20260313) committed on this branch are
excluded from the files table above per A-031 carve-out. These are IAA-owned files;
all Foreman deliverables are fully declared above.

Excluded files:
- `.agent-admin/assurance/iaa-token-session-wave-cl-4-aimc-audit-phase-a-20260313.md` (IAA R1 rejection token)
- `.agent-workspace/independent-assurance-agent/memory/session-wave-cl-4-aimc-audit-phase-a-20260313.md` (IAA R1 session memory)
- `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` (IAA R1 parking station update)
```

**Option B — Declare all 3 IAA ceremony files in the existing files table:**

Add 3 rows to the `## Files Modified` table in `SCOPE_DECLARATION.md`:
```
| `.agent-admin/assurance/iaa-token-session-wave-cl-4-aimc-audit-phase-a-20260313.md` | IAA assurance | A-031 — IAA R1 rejection token (ceremony artifact, IAA-owned) |
| `.agent-workspace/independent-assurance-agent/memory/session-wave-cl-4-aimc-audit-phase-a-20260313.md` | IAA memory | A-031 — IAA R1 session memory (ceremony artifact, IAA-owned) |
| `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` | IAA memory | A-031 — IAA R1 parking station update (ceremony artifact, IAA-owned) |
```

---

## What Passed in R2 (23/24)

**R1 A-026 fix (self-row): CONFIRMED RESOLVED ✅**
SCOPE_DECLARATION.md now includes self-row for `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`.

**R1 A-028 fix (stale entries): CONFIRMED RESOLVED ✅**
No stale prior-wave content found. File contains only CL-4 wave header, CL-4 files table (7 rows), and IAA Category: EXEMPT section. All wave17/parsing-instructions/ai-criteria-creation sections removed.

**All other checks (22):**
- CORE-007, CORE-013, CORE-014, CORE-015, CORE-016 (R2 first-invocation exception), CORE-017, CORE-018, CORE-019 (A-030 carve-out), CORE-020, CORE-021, CORE-022, CORE-023: PASS ✅
- OVL-INJ-001, OVL-INJ-ADM-001, OVL-INJ-ADM-002: PASS ✅
- A-021, A-028, A-029, A-031 (identity check): PASS ✅
- Category verification: EXEMPT classification CORRECT — all 10 diff files are governance/orchestration artifacts (3 IAA-owned, 7 Foreman-owned). No triggering content. ✅

---

## Re-Invocation Protocol (R3)

**STOP-AND-FIX**: This PR must not be opened until the A-026/A-031 failure is resolved.

**Required actions before R3:**
1. Edit `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` — add A-031 carve-out note (Option A) or add 3 table rows (Option B)
2. Commit and push the fix
3. Re-invoke IAA: `@independent-assurance-agent [IAA FINAL AUDIT REQUEST — Wave CL-4 R3]` with note "R3 — A-031 carve-out added to SCOPE_DECLARATION"

**Expected R3 outcome**: With this fix applied, all 24 checks should PASS and ASSURANCE-TOKEN will be issued.

**Advisory**: This is a single-line fix (add A-031 section to SCOPE_DECLARATION). The R3 turnaround should be rapid. Both R1 substantive fixes have been confirmed correct — this is the last remaining ceremony compliance item.

---

## ═══════════════════════════════════════════════════════════════
## This PR must not be opened until this failure is resolved
## and IAA re-invoked with ASSURANCE-TOKEN issued.
## Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
## ═══════════════════════════════════════════════════════════════

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA**: independent-assurance-agent v6.2.0
**STOP-AND-FIX Mandate**: ACTIVE
**Date**: 2026-03-13
**R2 Token Reference**: IAA-session-wave-cl-4-aimc-audit-phase-a-20260313-R2-REJECTION
