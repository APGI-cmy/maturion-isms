# IAA REJECTION-PACKAGE — Session DCKIS-CL11 | 2026-03-20

**Agent**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Session**: session-dckis-cl11-20260320
**Date**: 2026-03-20
**Wave**: DCKIS-CL11 — Programme Close-Out: LKIAC CEP & Documentation Finalisation
**Branch**: `copilot/update-aimc-lkiac-combined-execution-plan`
**Reviewed PR**: DCKIS-CL11 governance documentation wave
**Invoking Agent**: governance-liaison-isms-agent (delegated by foreman-v2-agent)
**Producing Agent**: governance-liaison-isms-agent
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

```
═══════════════════════════════════════
REJECTION-PACKAGE
PR: DCKIS-CL11 / branch copilot/update-aimc-lkiac-combined-execution-plan
3 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  CORE-013: IAA Invocation Evidence — FAIL ❌
    Finding: PREHANDOVER proof exists on disk at
    `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-dckis-cl11-20260320.md`
    but is UNTRACKED — it has NOT been committed to git HEAD.
    `git ls-tree HEAD` does NOT confirm this file on the branch.
    Per A-021/A-033: verification is via git ls-tree HEAD, not disk presence.
    Fix required: `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-dckis-cl11-20260320.md`
    and commit before re-invoking IAA.

  CORE-015: Session Memory Present — FAIL ❌
    Finding: Session memory `.agent-workspace/foreman-v2/memory/session-dckis-cl11-20260320.md`
    is UNTRACKED — it has NOT been committed to git HEAD.
    Fix required: `git add .agent-workspace/foreman-v2/memory/session-dckis-cl11-20260320.md`
    and commit before re-invoking IAA.

  CORE-018: Complete Evidence Artifact Sweep — FAIL ❌
    Finding: Evidence sweep fails on multiple items:
      (a) PREHANDOVER proof NOT in git HEAD (untracked) — FAIL
      (b) Session memory NOT in git HEAD (untracked) — FAIL
      (c) iaa_audit_token field: `IAA-session-dckis-cl11-20260320-PASS` — PASS (valid pre-populated reference)
      (d) Token file: first invocation exception — N/A
    Additional: CL11 deliverables also NOT committed:
      - `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` (Amendment v1.7.0)
        is a MODIFIED but UNSTAGED/UNCOMMITTED working tree change. git HEAD still shows v1.5.0 header.
      - `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` (v1.3.0 with DEP-001–DEP-007)
        is a MODIFIED but UNSTAGED/UNCOMMITTED working tree change. git HEAD still shows v1.2.0.
      - `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` (CL11 rewrite)
        is MODIFIED but UNSTAGED/UNCOMMITTED.
    Fix required: Commit ALL five artifacts in one commit before re-invoking IAA.

This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate.
═══════════════════════════════════════
```

---

## Full Assurance Work Log

### Check Summary

| Check | Verdict | Notes |
|-------|---------|-------|
| CORE-001 to CORE-004 | N/A ✅ | Not an AGENT_CONTRACT PR |
| CORE-005 | PASS ✅ | No placeholder values; N/A for non-YAML docs |
| CORE-006 | PASS ✅ | CL11-D1/D2 correctly excluded from CANON_INVENTORY |
| CORE-007 | PASS ✅ | No STUB/TODO/FIXME/TBD in deliverables; iaa_audit_token is valid pre-populated reference |
| CORE-008 to CORE-012 | N/A ✅ | Not an AGENT_CONTRACT PR |
| CORE-013 | **FAIL ❌** | PREHANDOVER proof untracked — not committed to git HEAD |
| CORE-014 | PASS ✅ | No class exemption claim |
| CORE-015 | **FAIL ❌** | Session memory untracked — not committed to git HEAD |
| CORE-016 | PASS ✅ | First invocation exception — token file created this session |
| CORE-017 | PASS ✅ | No .github/agents/ modifications |
| CORE-018 | **FAIL ❌** | PREHANDOVER, session memory, and deliverables not committed to git HEAD |
| CORE-019 | PASS ✅ | First invocation exception — token file will be created this session |
| CORE-020 | APPLYING | Failures above produce REJECTION-PACKAGE |
| CORE-021 | PASS ✅ | Zero-severity-tolerance applied — no soft-passing |
| CORE-022 | N/A ✅ | No .github/agents/ files in diff |
| CORE-023 | PASS ✅ | N/A — no workflow-adjacent changes |
| OVL-CG-001 | PASS ✅ | Strategy alignment: v1.7.0 amendment correctly records CL-11 state |
| OVL-CG-002 | PASS ✅ | No contradictions with existing governance |
| OVL-CG-003 | PASS ✅ | Deprecation entries are actionable and traceable |
| OVL-CG-004 | PASS ✅ | Ripple impact explicitly addressed |
| OVL-CG-005 | N/A ✅ | Not a layer-down wave |
| OVL-CG-ADM-001 | PASS ✅ | CANON_INVENTORY correctly not updated |
| OVL-CG-ADM-002 | PASS ✅ | Version bumps present (v1.7.0 and v1.3.0) in working tree content |
| OVL-INJ-001 | PASS ✅ | Pre-brief committed at SHA 4231f8c before deliverable work |

### Merge Gate Parity

| Local Check | Result |
|-------------|--------|
| YAML syntax validation | PASS ✅ |
| Placeholder check | PASS ✅ |
| Checklist compliance (3 fails) | FAIL ❌ |
| Canon hash verification | PASS ✅ |
| Git artifact committed state (A-021/A-033) | FAIL ❌ |

**Merge gate parity: FAIL**

---

## Substantive Advisory (for R2 re-invocation — non-blocking, noted for context)

The actual content of the deliverables is **substantively correct**. When the ceremony failures are resolved and IAA is re-invoked, the following substantive areas are expected to PASS:

- **CL11-D1 content**: Amendment v1.7.0 correctly records the DCKIS programme close-out, entry criterion (PR #1182, SHA 27f1990), CL-11 Knowledge Upload Centre deliverables, and workstream status update. No substantive issues found.
- **CL11-D2 content**: DEP-001 through DEP-007 are properly structured with component details, LKIAC references, current status codes, decommission conditions, and gap registrations. All LKIAC-001 §6 components are now registered. No substantive issues found.
- **CL11-D3 (SCOPE_DECLARATION)**: Correctly rewritten for CL11, prior DCKIS-IMPL-002 entries removed. IAA BLOCKER-1 from pre-brief resolved.
- **IAA BLOCKER-2 (entry criterion)**: PR #1182 (SHA 27f1990) confirmed merged to main. Entry criterion satisfied.

The R2 re-invocation is expected to be straightforward once the commit ceremony is completed.

---

## Required Fix Sequence

1. Commit all five outstanding artifacts in one commit to the branch:
   ```
   git add governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md
   git add governance/aimc/LKIAC_DEPRECATION_REGISTER.md
   git add .agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md
   git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-dckis-cl11-20260320.md
   git add .agent-workspace/foreman-v2/memory/session-dckis-cl11-20260320.md
   git commit -m "DCKIS-CL11: governance deliverables committed — CL11-D1 v1.7.0, CL11-D2 v1.3.0, SCOPE_DECLARATION CL11 rewrite, PREHANDOVER proof, session memory"
   ```
2. Verify via `git ls-tree HEAD` that all five files are tracked.
3. Re-invoke IAA — reference this rejection artifact (SHA of this file) as prior-round evidence.

---

## Checks Count

```yaml
total_checks: 30
checks_passed: 27
checks_failed: 3
merge_gate_parity: FAIL
verdict: REJECTION-PACKAGE
adoption_phase: PHASE_B_BLOCKING
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Produced by**: independent-assurance-agent
**Merge authority**: CS2 ONLY — merge blocked until ASSURANCE-TOKEN issued
