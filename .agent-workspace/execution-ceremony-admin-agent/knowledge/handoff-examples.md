# ECAP Handoff Examples

**Agent**: execution-ceremony-admin-agent
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-04-15
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Ref**: ECAP-001 §5.2, §6.1, §10.3

---

## Purpose

Annotated examples illustrating correct and incorrect ECAP handoff patterns.

---

## EXAMPLE 1 — GOOD HANDOFF ✅

### Scenario

Foreman has completed MMM Stage 4 TRS build. QP PASS. §4.3 parity PASS. Working tree clean.

### Foreman delegation message to ECAP

```
ceremony_admin_appointed: true
appointment_timestamp: 2026-04-15T09:30:00Z
assigned_scope: Prepare Phase 4 ceremony bundle for wave mmm-stage4-trs
expected_return_artifact_paths:
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-059-20260415.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/session-059-20260415.md

QP PASS: Confirmed
§4.3 parity PASS: Confirmed
git status --porcelain: empty (clean)
Scope declaration: .agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-stage4.md
  (includes both ECAP bundle paths)
IAA wave record: .agent-admin/assurance/iaa-wave-record-mmm-stage4-trs-20260415.md (PRE-BRIEF populated)
```

### ECAP Phase 1 output

```
I am execution-ceremony-admin-agent, class: administrator, version 1.0.0.
Role: Execution Ceremony Administrator.
PREFLIGHT COMPLETE. Ready to begin Phase 4 bundle preparation per Foreman delegation.
```

### ECAP Phase 2 output

```
Appointment brief verified: ceremony_admin_appointed: true ✅
appointment_timestamp: 2026-04-15T09:30:00Z ✅
assigned_scope: wave mmm-stage4-trs ✅
expected_return_artifact_paths: 2 paths confirmed ✅

HALT-004 gate: PASS

Three-role split boundaries confirmed. ceremony-admin scope: bundle preparation only.
```

### ECAP Phase 3 — Step 3.1 check

```
IAA wave record: PRESENT with ## PRE-BRIEF ✅
Scope declaration: PRESENT, both ECAP bundle paths confirmed ✅
No standalone prebrief/token/rejection files found ✅
```

### ECAP Phase 3 — Step 3.2 check

```
git status --porcelain: (empty) ✅
git diff --name-only: (empty) ✅
All evidence files committed at HEAD ✅
```

### ECAP handback to Foreman

```
Bundle preparation complete. Returning to Foreman for review.

Bundle contents:
  - PREHANDOVER: .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-059-20260415.md
  - Session memory: .agent-workspace/execution-ceremony-admin-agent/bundles/session-059-20260415.md
  - Evidence: 3 builder deliverables confirmed committed at HEAD
  - Commit-state gate: PASS
  - Merge-gate parity: PASS

Residual notes: none. No administrative defects found.
Phase 4 is Foreman-only. Bundle returned. Standing by.
```

**Why this is correct:**
- Foreman provided complete appointment brief before delegating ✅
- Working tree was clean before ECAP started ✅
- ECAP verified scope declaration paths before writing ✅
- ECAP wrote only to its own bundle paths ✅
- ECAP did not invoke IAA, did not issue verdicts ✅
- ECAP returned bundle cleanly to Foreman ✅

---

## EXAMPLE 2 — BAD HANDOFF ❌

### Scenario

Foreman delegates to ECAP during MMM Stage 4. However: (a) working tree has uncommitted TRS spec changes, (b) appointment brief is missing `appointment_timestamp`, (c) scope declaration does not list ECAP bundle paths.

### Foreman delegation message to ECAP (incomplete)

```
Please prepare the ceremony bundle for MMM Stage 4.
QP PASS. §4.3 parity PASS.
```

### ECAP Phase 1 — Step 1.3a result

```
git status --porcelain output:
 M modules/MMM/03-trs/technical-requirements-specification.md

Uncommitted file detected: modules/MMM/03-trs/technical-requirements-specification.md
Classification: PRIMARY SUBSTANTIVE DELIVERABLE (TRS spec)

HALT-005. Return to Foreman immediately.
ECAP must NOT commit primary substantive deliverables.
Foreman must commit modules/MMM/03-trs/technical-requirements-specification.md
and verify clean working tree before re-delegating.
```

**Why ECAP halted correctly:**
- Uncommitted TRS spec is a primary substantive deliverable ✅
- ECAP did not commit it on Foreman's behalf ✅
- ECAP halted and returned to Foreman with clear HALT-005 output ✅

### What would have happened if ECAP had NOT halted (incorrect behaviour)

If ECAP had committed the TRS spec:
- ECAP would have crossed the role boundary (NO-SUBSTANTIVE-COMMIT-001 violation)
- The commit would not be covered by Foreman's QP sign-off (governance defect)
- The PREHANDOVER proof would record a bundle that was not Foreman-reviewed
- IAA would likely issue a REJECTION-PACKAGE citing boundary violation
- The wave would have to restart ceremony from scratch

### What Foreman must do to fix this

1. Commit the uncommitted TRS spec: `git add modules/MMM/03-trs/technical-requirements-specification.md && git commit -m "fix: commit TRS spec"`
2. Add ECAP bundle paths to scope declaration
3. Provide complete appointment brief including `appointment_timestamp`
4. Re-delegate to ECAP with corrected delegation message

---

**Authority**: CS2 | **Ref**: ECAP-001 §5.2, §6.1, §10.3
