# IAA Wave Record — mmm-p4-wire-framework-flows-20260508

**Wave**: mmm-p4-wire-framework-flows  
**Branch**: copilot/mm-p4-wire-framework-flows  
**Issue**: #1577 — "MMM P4: Wire live Framework onboarding, upload, AI generation, and dashboard flows to deployed Edge Functions"  
**Agent**: independent-assurance-agent  
**Mode**: FINAL ASSURANCE — STOP_AND_FIX

---

## PRE-BRIEF

**Pre-Brief Date**: 2026-05-08  
**Pre-Brief Trigger**: IAA PRE-BRIEF REQUEST (wave-start)

### Step 0.2 — Pre-Brief Output (Canon Format)

```
Qualifying tasks: BLOCKED — requested wave is not declared in .agent-workspace/foreman-v2/personal/wave-current-tasks.md.
                  Provisional qualifying delivery scope from request text: wire live Framework onboarding flow, upload flow, AI generation flow, dashboard flow, and deployed Edge Function bindings.

Applicable overlay: AAWP_MAT (provisional primary for functional delivery) + MIXED/AMBIGUOUS mandatory invocation rule.
                    Additional overlays become mandatory if diff includes: CI workflows (.github/workflows/*), governance canon, or pre-build stage artifacts.

Anti-regression obligations: YES — FAIL-ONLY-ONCE A-001/A-002/A-003/A-015 and A-034/A-035/A-039/A-040/A-041/A-042 apply.
```

### Trigger Categories (Declared)

- **AMBIGUOUS → IAA REQUIRED (mandatory)** until actual diff + wave task register resolves classification.
- **Provisional primary**: **AAWP_MAT** (functional implementation request with live flow wiring).
- **Potential secondary** (diff-dependent): **CI_WORKFLOW**, **CANON_GOVERNANCE**, **PRE_BUILD_STAGE_MODEL**, **MIXED**.

### FAIL-ONLY-ONCE Alignment Checks (Pre-Brief Gate)

1. **A-001**: IAA invocation evidence must be present in final PR artifacts.
2. **A-002**: No class-based exemption claims.
3. **A-003**: Ambiguity resolves to mandatory IAA.
4. **A-015**: Triggered PR requires PREHANDOVER proof + session memory.
5. **A-034/A-035**: Functional Behaviour Registry + niggle patterns mandatory for BUILD/AAWP_MAT scope.
6. **A-039/A-040**: Acceptance-criteria evidence matrix and no evidence-type downgrade.
7. **A-041/A-042**: Diff-first classification + independent risk challenge before any PASS.

### PREHANDOVER Structure Required for Final IAA Invocation

- Governing issue acceptance criteria extracted verbatim.
- Diff-first changed-file list and category derivation.
- Evidence matrix per criterion: required evidence type vs submitted hard artifact.
- Gate set explicitly named (`gate_set_checked` equivalent populated).
- Final-state coherence (no PENDING/in-progress contradictions).
- IAA token/session placeholders must be concrete (no `[pending]` etc. at COMPLETE state).

### Scope Blockers (Must be Cleared Before IAA-FINAL)

- **SB-001 (Hard blocker)**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` must be updated for wave `mmm-p4-wire-framework-flows` with task table and `ceremony_admin_appointed: YES/NO`.
- **SB-002 (Hard blocker)**: Governing issue number must remain declared and consistent across PR artifacts (#1577).
- **SB-003 (Hard blocker)**: Scope declaration parity artifact required with exact changed paths.
- **SB-004 (Hard blocker)**: PREHANDOVER proof + session memory must exist and be git-committed.
- **SB-005 (Hard blocker)**: Runtime evidence obligations must be met for all live Edge Function flows.

### Required Evidence for Functional Delivery Split Verdict

**Track A — Static/Build Evidence (necessary, not sufficient):**
- Route-to-Edge wiring code diff for onboarding/upload/AI/dashboard flows.
- Deployed function binding/config references and environment contract declarations.
- CI/lint/test outputs for touched modules.

**Track B — Runtime/Functional Evidence (required for merge-permit when criteria demand runtime):**
- Live invocation proof for each flow (request/response traces or equivalent hard artifacts).
- End-to-end proof that user-visible flow reaches deployed Edge Functions and returns expected outcomes.
- Failure-path proof (error surfaced, no silent swallow, rollback/recovery where applicable).

**Split verdict rule (pre-declared):**
- If Track A present but Track B missing where required → **BLOCKED_PENDING_RUNTIME_EVIDENCE**.
- PASS eligibility only when acceptance-criteria matrix is complete with hard evidence per criterion (or explicit CS2 waiver artifact).

---

## FINAL ASSURANCE (CURRENT HEAD)

Current state classification: STOP_AND_FIX  
Handover claim status: BLOCKED  
Merge readiness: NO

ADMIN_PASS: yes  
FUNCTIONAL_PASS: no  
VERDICT: ADMIN_ONLY

## TOKEN

PHASE_B_BLOCKING_TOKEN: IAA-session-pr-1578-stop-and-fix-20260508
**Type**: ASSURANCE-TOKEN (FAIL)
**PR**: #1578
**Issue**: #1577
**Reviewed SHA**: 5f06c7eb7465c150305092f82470b540e169b5e0
**Handover Allowed**: no
**Required Action**: STOP_AND_FIX / RCA_REQUIRED

## REJECTION_HISTORY

None at PRE-BRIEF creation time.
