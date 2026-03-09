# IAA Rejection Artifact — session-wave15r-gov — Wave 15R Governance

**Token Reference**: IAA-session-wave15r-gov-20260308-REJECTION
**Date**: 2026-03-08
**IAA Version**: 6.2.0 (contract v2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate active

---

## Invocation Context

| Field | Value |
|-------|-------|
| PR branch | copilot/update-governance-orchestration-wave15 |
| Issue | maturion-isms#996 — gov(wave15): Wave 15 failure documentation + Wave 15R orchestration |
| Invoking agent | foreman-v2-agent (PHASE 4 HANDOVER AUDIT REQUEST) |
| Producing agent | foreman-v2-agent, class: foreman |
| Wave | wave15r-gov |
| Categories | AAWP_MAT + KNOWLEDGE_GOVERNANCE + CI_WORKFLOW (MIXED) |

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/update-governance-orchestration-wave15 | Issue #996
Wave: wave15r-gov | 2026-03-08
9 checks FAILED. Merge blocked. STOP-AND-FIX required.
Token reference: IAA-session-wave15r-gov-20260308-REJECTION
Adoption phase: PHASE_B_BLOCKING — HARD GATE ACTIVE
═══════════════════════════════════════════════════════════════
```

---

## Failures Cited (with Fix Required)

### FAILURE 1 — ROOT CAUSE: A-021 UNCOMMITTED ARTIFACTS
**Checks**: CORE-018 / CERT-001 / CERT-002 / BD-001
**Finding**: ALL nine modified governance files are unstaged working-tree changes. PREHANDOVER proof and session memory are untracked files (??). Remote branch `origin/copilot/update-governance-orchestration-wave15` shows zero diff from main for any substantive content. PREHANDOVER proof self-documents this: git log section reads `[populated at report_progress commit time]` — explicit evidence that IAA was invoked before the commit gate. Per A-021: "Commit and push BEFORE invoking IAA — working-tree-only fix is not a committed fix and will fail IAA audit."

**Files requiring commit:**
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` (modified — not staged)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (modified — not staged)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave15r-gov-20260308.md` (untracked)
- `.agent-workspace/foreman-v2/memory/session-wave15r-gov-20260308.md` (untracked)
- `.github/workflows/deploy-mat-ai-gateway.yml` (modified — not staged)
- `SCOPE_DECLARATION.md` (modified — not staged)
- `modules/mat/00-app-description/app-description.md` (modified — not staged)
- `modules/mat/01-frs/functional-requirements.md` (modified — not staged)
- `modules/mat/01.5-trs/technical-requirements-specification.md` (modified — not staged)
- `modules/mat/03-implementation-plan/implementation-plan.md` (modified — not staged)
- `modules/mat/BUILD_PROGRESS_TRACKER.md` (modified — not staged)

**Fix required**: Stage all files, commit, push to branch. Then re-invoke IAA.

---

### FAILURE 2 — CORE-007: PLACEHOLDER IN PREHANDOVER PROOF
**Finding**: PREHANDOVER proof line 100 contains literal placeholder: `[populated at report_progress commit time]` in the git log section.
**Fix required**: Replace with actual `git log --oneline -5` output after committing.

---

### FAILURE 3 — CORE-015: SESSION MEMORY NOT COMMITTED
**Finding**: Session memory untracked — not committed to branch.
**Fix required**: Resolved by Failure 1 fix (include in commit bundle).

---

### FAILURE 4 — OVL-KG-ADM-003: FOREMAN KNOWLEDGE INDEX STALE
**Finding**: `.agent-workspace/foreman-v2/knowledge/index.md` still lists FAIL-ONLY-ONCE.md at v2.9.0. Actual file is v3.0.0.
**Fix required**: Update foreman knowledge index.md to reference FAIL-ONLY-ONCE.md v3.0.0. Bump index version. Add version history entry. Include in commit bundle.

---

### FAILURE 5 — OVL-CI-005: NO CI EVIDENCE FOR WORKFLOW CHANGE
**Finding**: deploy-mat-ai-gateway.yml modified (trailing newline fix). PREHANDOVER has no CI check run URL or log snippet as required by OVL-CI-005.
**Fix required**: Include YAML validation script output (with timestamp + exit code 0) OR a GitHub Actions CI check run URL in PREHANDOVER Environment Parity section.

---

## Substantive Quality Note

**The governance CONTENT is sound.** All 10 issue acceptance criteria are met in the working tree:
- Wave 15 FAILED section: ✅ Complete
- Wave 15R Batch A/B/C plan: ✅ Complete
- CST HARD GATE between Batch A and B: ✅ Unambiguously declared
- INC-WAVE15-PARSE-001 with state machine + root cause: ✅ Complete
- FR-005 + FR-103 annotated NOT SATISFIED: ✅ Complete
- TR-037 annotated NOT VERIFIED: ✅ Complete
- App Description §6.2 annotated: ✅ Complete
- FAIL-ONLY-ONCE v3.0.0 with INC + S-024: ✅ Complete
- No production code by Foreman: ✅ Confirmed

These all pass on re-invocation once the commit gate is cleared and fixes 4–5 applied.

---

## Re-invocation Instructions

1. Fix Failure 1: Stage all 11 files, commit with message `gov(wave15r): governance documentation + incident registration + Wave 15R orchestration plan`, push to branch
2. Fix Failure 2: Fill git log placeholder with actual output in PREHANDOVER proof
3. Fix Failure 4: Update foreman knowledge index.md → FAIL-ONLY-ONCE v3.0.0
4. Fix Failure 5: Add YAML validation evidence to PREHANDOVER
5. Verify SCOPE_DECLARATION matches `git diff --name-only origin/main...HEAD` (A-026)
6. Re-invoke IAA via PHASE 4 HANDOVER AUDIT REQUEST comment on Issue #996

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | PHASE_B_BLOCKING
**This token is a REJECTION artifact — merge blocked until re-invocation passes.**
