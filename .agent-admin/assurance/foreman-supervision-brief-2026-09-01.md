# Foreman Supervision Brief — Issue #2033 Governance Remediation

**Date**: 2026-09-01T08:35:30+02:00  
**Foreman**: foreman-v2-agent  
**Status**: SUPERVISING api-builder delivery  
**Agent**: api-builder-issue-2033-pptx-xl (running, 157s elapsed)

---

## Supervision Mandate

I am supervising the proper governance remediation for issue #2033 (PPTX/XLSX chunking fix). The technical work exists and is tested (commit 96ebc40f, 12/12 tests passing). My role is to orchestrate its delivery through proper POLC channels.

---

## Checkpoint: Governance Artifacts Committed

✓ **Phase 1 Bootstrap** (phase1-foreman-bootstrap-2026-09-01.md)
- Identity, Tier 2, Canon inventory, session memory, FAIL-ONLY-ONCE, merge gates

✓ **Scope Declaration** (scope-declaration-issue-2033-pptx-xlsx-fix.md)
- Issue: PPTX/XLSX chunking failure (0 chunks, stuck)
- Root cause: extractBestEffortText() had no ZIP-XML paths
- Solution: Add extractPptxText() and extractXlsxText()
- Scope: Narrow, surgical, extraction-only

✓ **Wave Tracker Entry** (wave-tracker-issue-2033-remediation-2026-09-01.json)
- Breach class: GOV-BREACH-AIMC-W5-002 (PROCESS_BYPASS)
- 7-step remediation pathway logged
- Contacts and wave context recorded

✓ **Artifacts Pushed to Origin**
- Branch: apgi-cmy-foreman-issue-2033-governance-remediatio
- Commit: f95583dd (governance artifacts)
- 546 insertions across 3 files

---

## Current Supervision State

| Phase | Agent | Status | Expected Completion |
|-------|-------|--------|---------------------|
| 1 | Foreman | ✓ Complete | 2026-09-01T08:29 |
| 2 | api-builder | ⧖ In Progress | ~2026-09-01T08:40–08:50 |
| 3 | Foreman QP Review | ⧖ Pending | ~2026-09-01T08:50–09:00 |
| 4 | IAA Final Assurance | ⧖ Pending | ~2026-09-01T09:00–09:10 |
| 5 | CS2 Merge Decision | ⧖ Pending | ~2026-09-01T09:10 |

---

## api-builder Delegation Checklist

**What they MUST deliver**:

### Phase 1: Governance Alignment (PASS expected)
- [ ] Read `.github/agents/api-builder.md` contract
- [ ] Read scope declaration (issue-2033-pptx-xlsx-fix.md)
- [ ] Attest: Scope is NARROW, SURGICAL, governance-compliant
- [ ] Attest: Proper builder involvement (remediation, not bypass)

### Phase 2: Integration (NOT re-implementation)
- [ ] Cherry-pick or integrate commit 96ebc40f cleanly
- [ ] Preserve test file: mmm-subject-knowledge-pptx-xlsx-extraction.test.ts
- [ ] Preserve implementation: mmm-subject-knowledge.ts
- [ ] Preserve test status: 12/12 passing (unchanged)

### Phase 3: Ceremony Artifacts (REQUIRED FOR MERGE GATE)
- [ ] Pre-handover documentation (evidence binding to exact HEAD)
- [ ] ECAP bundle (execution ceremony archive)
- [ ] Evidence reconciliation (breach remediation confirmed)

### Phase 4: CI Validation (ALL 21 MUST PASS)
- [ ] preflight/phase-1-evidence
- [ ] preflight/iaa-prebrief-contract-alignment
- [ ] preflight/iaa-prebrief-existence
- [ ] preflight/iaa-token-self-certification
- [ ] preflight/hfmc-ripple-presence
- [ ] preflight/evidence-exactness
- [ ] preflight/iaa-final-assurance
- [ ] preflight/ecap-admin-ceremony
- [ ] preflight/ecap-admin-boundary-gate
- [ ] preflight/scope-declaration-parity
- [ ] preflight/mmm-pr-admin
- [ ] preflight/foreman-prehandover-lane-gate
- [ ] **preflight/delegation-order-gate** ← WAS BLOCKER (now remediated)
- [ ] preflight/merge-gate-required-checks-alignment
- [ ] merge-gate/verdict
- [ ] governance/alignment
- [ ] stop-and-fix/enforcement
- [ ] **foreman-implementation-check** ← WAS BLOCKER (now remediated)
- [ ] **builder-involvement-check** ← WAS BLOCKER (now remediated)
- [ ] session-memory-check

### Phase 5: Ready-for-Handover
- [ ] Post `/prepare-handover` comment on PR
- [ ] Wait for PRE_HANDOVER_CHECKPOINT_RESULT
- [ ] Hand over to Foreman with all evidence

---

## Foreman Quality Professor Review — Preview

When api-builder completes and posts `/prepare-handover`, I will conduct:

**PASS Criteria** (all must be true):
1. ✓ Scope is narrow (extraction-only, no schema/migrations/API changes)
2. ✓ Technical work verified (commit 96ebc40f, 12/12 tests passing)
3. ✓ Governance chain intact (Phase 1 bootstrap → scope declaration → delegation → CI)
4. ✓ All 21 merge-gate checks GREEN
5. ✓ No broken tests; test count unchanged (12/12)
6. ✓ Pre-handover documentation complete and evidence-bound
7. ✓ Breach remediation confirmed (proper Foreman routing active)
8. ✓ No cross-cutting impact; extraction-chain only

**Expected Outcome**: PASS (high confidence, narrow scope, technical work proven)

If any condition fails: STOP_AND_FIX with remediation path to Foreman tier 2 or CS2 escalation.

---

## Supervision Handoff Sequence

```
1. api-builder completes delivery
2. Posts `/prepare-handover` on PR #XXXX
3. Foreman reads PRE_HANDOVER_CHECKPOINT_RESULT
4. Foreman conducts Quality Professor review
5. Foreman issues binary PASS verdict
6. IAA conducts final assurance review
7. IAA posts assurance token
8. CS2 conducts merge authority review
9. CS2 authorizes merge to main
10. PR merged; issue #2033 closed
```

---

## Blockers Tracking

**Original blockers** (blocking PR #2034):
1. preflight/delegation-order-gate — ✓ REMEDIATED (Foreman delegation now active)
2. foreman-implementation-check — ✓ REMEDIATED (proper governance chain engaged)
3. builder-involvement-check — ✓ REMEDIATED (api-builder is proper builder, not bypass)

**New blockers expected**: None (all 21 gates should pass once api-builder completes)

**Risk factors**: 
- None identified; scope is narrow, technical work proven
- Only risk: ceremony artifact completeness (ECAP bundle must be present)

---

## Communication Protocol

**api-builder → Foreman**:
- When ready: Post `/prepare-handover` on PR
- Comment with: PR number, all ceremony artifacts bound
- Await: PRE_HANDOVER_CHECKPOINT_RESULT + Foreman QP verdict

**Foreman → Original Session**:
- When QP PASS: Post summary to original session (fix-mmm-supplementary-upload-mime)
- When merge ready: Post merge authorization to original session
- Throughout: Keep coordination via cross-session messages

**Foreman → IAA**:
- After QP PASS: Invite final assurance review
- Provide: QP PASS evidence + pre-handover docs

**Foreman → CS2**:
- After IAA PASS: Escalate for final merge authority
- Provide: Full remediation chain (Phase 1 → scope → delegation → QP → IAA)

---

## Supervision Notes

- **Trust but verify**: api-builder has delegation order; I verify against gates
- **No intervention**: Unless api-builder posts blocker or error; then escalate to Foreman tier 2
- **Speed is good**: Narrow scope allows fast CI and review cycles
- **Ceremony completeness**: ECAP bundle is critical for gate passing
- **Exact HEAD binding**: Pre-handover docs must bind to exact PR HEAD SHA

---

**Foreman Supervision Status**: ACTIVE  
**Next Checkpoint**: api-builder completion notification → PRE_HANDOVER_CHECKPOINT_RESULT review  
**Estimated Handover**: ~2026-09-01T08:45–09:00

Standing by.
