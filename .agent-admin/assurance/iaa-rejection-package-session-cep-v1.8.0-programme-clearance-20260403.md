# IAA Token — Session cep-v1.8.0-programme-clearance-20260403

**Document Type**: IAA_REJECTION_PACKAGE  
**Token Reference**: IAA-session-cep-v1.8.0-programme-clearance-20260403-FAIL  
**Date**: 2026-04-03  
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)  
**Adoption Phase**: PHASE_B_BLOCKING  
**Branch**: copilot/foreman-v2-agent-cep-v1-8-0-update  
**Wave**: cep-v1.8.0-programme-clearance-20260403  
**Invoking Agent**: foreman-v2-agent  
**Producing Agent**: foreman-v2-agent v6.2.0  

---

## Verdict

```
═══════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/foreman-v2-agent-cep-v1-8-0-update
Wave: cep-v1.8.0-programme-clearance-20260403
Date: 2026-04-03

5 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  CORE-018 (A-033): PREHANDOVER proof NOT committed to git branch
    Finding: PREHANDOVER-session-cep-v1.8.0-programme-clearance-20260403.md
    is ABSENT from git ls-tree -r HEAD. File exists on disk (untracked) — never committed.
    Per A-033 (INC-CI-GATEWAY-FIX-001-IAA pattern): disk existence ≠ committed.
    Fix required: git add + git commit + git push for PREHANDOVER proof.

  CORE-015: Session memory NOT committed to git branch
    Finding: session-cep-v1.8.0-programme-clearance-20260403.md
    is ABSENT from git ls-tree -r HEAD. Untracked on disk.
    Fix required: git add + git commit + git push for session memory.

  A-021: Working tree NOT clean at IAA invocation time
    Finding: 5 modified-unstaged files + 4 untracked files at IAA invocation.
    git status shows: wave-current-tasks.md, CEP, AAWP, DEP-008, parking-station all
    modified-unstaged; PREHANDOVER, session memory, cp-2-closure, templates all untracked.
    Per A-021: git commit && git push required BEFORE IAA invocation.
    Fix required: Stage ALL changes, commit, push, then re-invoke IAA.

  A-026: SCOPE_DECLARATION.md not updated for this wave
    Finding: SCOPE_DECLARATION.md still declares Wave DCKIS-IMPL-002 (prior wave).
    Must exactly match git diff --name-only for this wave after all changes are committed.
    Fix required: Update SCOPE_DECLARATION.md after committing all wave artifacts.

  Governance changes NOT committed (CEP v1.8.0, AAWP, DEP-008 v1.4.0)
    Finding: All v1.8.0 governance amendments are in working tree only — not committed.
    PREHANDOVER proof falsely claims "✅ COMMITTED" for all these artifacts.
    Fix required: git add + commit all modified governance files.

SUBSTANTIVE NOTE (informational — not a failure):
  Governance content is SOUND and will PASS substantive checks on re-invocation.
  CEP v1.8.0, DEP-008 additive clarification, CP-2 closure, SB-001 resolution all correct.

This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════════════════════════
```

---

## Checks Executed

| Check | Category | Verdict |
|-------|----------|---------|
| CORE-005 Governance block present | Core | PASS ✅ |
| CORE-006 CANON_INVENTORY alignment | Core | PASS ✅ |
| CORE-007 No placeholder content | Core | PASS ✅ |
| CORE-013 IAA invocation evidence | Core | FAIL ❌ (PREHANDOVER not committed) |
| CORE-014 No class exemption | Core | PASS ✅ |
| CORE-015 Session memory present (committed) | Core | FAIL ❌ |
| CORE-016 IAA verdict evidenced | Core | First invocation exception — blocked by CORE-018 |
| CORE-017 No .github/agents modifications | Core | PASS ✅ |
| CORE-018 Complete evidence sweep (A-033) | Core | FAIL ❌ (PREHANDOVER + session memory not committed) |
| CORE-019 IAA token cross-verification | Core | First Invocation Exception PASS ✅ |
| CORE-020 Zero partial pass rule | Core | Applied correctly ✅ |
| CORE-021 Zero-severity-tolerance | Core | Applied correctly ✅ |
| CORE-023 Workflow integrity ripple | Core | N/A ✅ |
| A-001 IAA invocation evidence | FFA | PASS ✅ |
| A-002 No class exceptions | FFA | PASS ✅ |
| A-021 Commit before IAA | FFA | FAIL ❌ |
| A-026 SCOPE_DECLARATION matches diff | FFA | FAIL ❌ |
| A-029 iaa_audit_token format | FFA | PASS ✅ |
| A-033 git ls-tree verification | FFA | FAIL ❌ |
| OVL-CG-001 Strategy alignment | Overlay | PASS ✅ |
| OVL-CG-002 No contradictions | Overlay | PASS ✅ |
| OVL-CG-003 Enforcement gap | Overlay | PASS ✅ |
| OVL-CG-004 Ripple impact assessed | Overlay | PASS ✅ (substantive) |
| OVL-CG-005 ISMS layer-down scope | Overlay | N/A ✅ |
| OVL-CG-ADM-001 CANON_INVENTORY updated | Overlay | PASS ✅ |
| OVL-CG-ADM-002 Version bump present | Overlay | PASS ✅ (substantive) |
| Merge Gate / merge-gate/verdict | Parity | FAIL ❌ |
| Merge Gate / governance/alignment | Parity | FAIL ❌ |
| Merge Gate / stop-and-fix/enforcement | Parity | FAIL ❌ |

**Total: 19 PASS, 5 FAIL (+ 3 merge gate parity FAIL)**

---

## Fix Summary

**All five failures share the same root cause**: Foreman invoked IAA without first committing all wave artifacts to the branch. The governance content is correct and complete — the failure is exclusively procedural.

**To resolve — execute in order:**
1. `git add governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`
2. `git add governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md`
3. `git add governance/aimc/LKIAC_DEPRECATION_REGISTER.md`
4. `git add .agent-workspace/foreman-v2/personal/wave-current-tasks.md`
5. `git add .agent-workspace/foreman-v2/parking-station/suggestions-log.md`
6. `git add .agent-admin/checkpoints/cp-2-closure-20260403.md`
7. `git add .agent-admin/templates/cl6-wave-start-issue-20260403.md`
8. `git add .agent-workspace/foreman-v2/memory/session-cep-v1.8.0-programme-clearance-20260403.md`
9. `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-cep-v1.8.0-programme-clearance-20260403.md`
10. Update `SCOPE_DECLARATION.md` to list all committed files for this wave
11. `git add SCOPE_DECLARATION.md`
12. `git commit -m "chore(foreman): cep-v1.8.0 programme clearance — governance artifacts committed"`
13. `git push`
14. Re-invoke IAA

---

## IAA Self-Note — Learning

This invocation fires A-033 (INC-CI-GATEWAY-FIX-001-IAA pattern) for the same root cause as the original incident: Foreman created all artifacts on disk during the governance ceremony but did not run `git commit && git push` before invoking IAA. This confirms A-021 and A-033 remain active failure modes. No new FAIL-ONLY-ONCE entry is needed — existing rules cover this pattern.

---

*Produced by independent-assurance-agent v6.2.0 under CS2 authority (Johan Ras / @APGI-cmy).*  
*Authority: PHASE_B_BLOCKING — Hard gate ACTIVE.*  
*PREHANDOVER proof: unchanged (immutable post-commit — per §4.3b).*
