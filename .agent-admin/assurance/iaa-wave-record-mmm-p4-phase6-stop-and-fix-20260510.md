# IAA Wave Record — mmm-p4-phase6-stop-and-fix-20260510

**Wave**: mmm-p4-phase6-stop-and-fix  
**Branch**: copilot/stop-and-fix-mmm-phase-6  
**Issue**: maturion-isms#1577 (STOP_AND_FIX follow-up: MMM P4 Phase 6 closed without live functional delivery)  
**Date Created**: 2026-05-10  
**Created By**: independent-assurance-agent (Phase 0 — PRE-BRIEF mode)  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## PRE-BRIEF

**Invocation Type**: Phase 0 — PRE-BRIEF (`action: "PRE-BRIEF"`)  
**Ceremony Admin Appointed**: NOT_YET_DETERMINABLE (wave task-tracker for `mmm-p4-phase6-stop-and-fix` not found in `.agent-workspace/foreman-v2/personal/`)

### Trigger Categories (pre-brief declaration)

- `AMBIGUOUS` → IAA MANDATORY (trigger table ambiguity rule; no exemption permitted)
- Mixed-scope indicators present from referenced Phase 6 closure context (product code + governance artifacts), but canonical wave task list is absent; final category locking deferred to handover diff verification

### FFA / FAIL-ONLY-ONCE checks to enforce at assurance

1. A-001 — IAA invocation evidence must be present in branch artifacts.
2. A-002 — no class exemptions accepted.
3. A-003 — ambiguity resolves to mandatory IAA invocation.
4. A-021 — committed + pushed evidence only; no working-tree claims.
5. A-026 / A-028 — exact, list-form scope declaration parity with actual diff.
6. A-039 / A-041 — evidence must be artifact-backed and independently diff-verified.
7. Functional anti-regression screen (FUNCTIONAL-BEHAVIOUR-REGISTRY NBR-001..NBR-005) required if code/runtime paths are in scope at handover.

### PREHANDOVER structure required

- `.functional-delivery/pr-<pr>.md` with split verdict fields (`ADMIN_PASS`, `FUNCTIONAL_PASS`, `VERDICT`)
- `.agent-admin/ecap/pr-<pr>-current-head-check-<date>.md`
- `.agent-admin/scope-declarations/pr-<pr>.md`
- `.agent-workspace/<producing-agent>/memory/PREHANDOVER-*.md`
- `.agent-workspace/<producing-agent>/memory/session-*.md`
- `.agent-admin/assurance/iaa-wave-record-mmm-p4-phase6-stop-and-fix-20260510.md` (this record; token appended only by IAA post-verdict)

### Scope blockers (pre-brief)

1. **SB-001 (HARD)**: Canonical wave task tracker for `mmm-p4-phase6-stop-and-fix` is not present at required Foreman path; qualifying-task derivation is incomplete.
2. **SB-002 (HARD)**: `ceremony_admin_appointed` cannot be confirmed for this wave; ACR applicability cannot be finalized.
3. **SB-003 (HARD)**: Final trigger category cannot be locked without authoritative current diff/PR file set for this stop-and-fix wave.

```
Qualifying tasks: [BLOCKED — authoritative wave task list missing for mmm-p4-phase6-stop-and-fix; provisional scope from issue context only]
Applicable overlay: [AMBIGUOUS (IAA mandatory) — final overlay locked at handover after diff classification]
Anti-regression obligations: [yes — FUNCTIONAL-BEHAVIOUR-REGISTRY NBR-001..NBR-005 mandatory if runtime/code paths remain in scope]
```

---

## TOKEN

PHASE_B_BLOCKING_TOKEN: [pending]

---

## REJECTION_HISTORY

*(No rejections logged in PRE-BRIEF mode)*
