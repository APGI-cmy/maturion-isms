# IAA REJECTION-PACKAGE — Session 057 (PS-F Wave)

**artifact_type**: IAA_REJECTION_PACKAGE
**iaa_agent**: independent-assurance-agent
**iaa_version**: 6.2.0
**contract_version**: 2.3.0
**session_id**: session-057-ps-f-iaa-trigger-table-20260407
**date**: 2026-04-07
**adoption_phase**: PHASE_B_BLOCKING
**pr_branch**: copilot/add-new-categories-to-iaa-trigger-table
**issue**: maturion-isms#1270
**wave**: ps-f-iaa-trigger-table-new-categories
**invoking_agent**: CodexAdvisor-agent (session-054)
**producing_agent**: CodexAdvisor-agent
**producing_agent_class**: advisor/overseer
**pr_category**: KNOWLEDGE_GOVERNANCE
**checks_executed**: 37
**checks_passed**: 36
**checks_failed**: 1

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
## PR: copilot/add-new-categories-to-iaa-trigger-table (issue #1270)
## 1 check FAILED. Merge blocked. STOP-AND-FIX required.
## ═══════════════════════════════════════

### FAILURE

**A-026 / CORE-SCOPE-001: SCOPE_DECLARATION.md Not Updated for PS-F Wave**

**Finding**: `SCOPE_DECLARATION.md` at the repository root was not updated for the PS-F wave. The file currently declares wave `ps-b-fail-only-once-v420-20260407` (session-159, issue #1268). The current PR (`copilot/add-new-categories-to-iaa-trigger-table`, issue #1270) has made NO modification to `SCOPE_DECLARATION.md` — it is absent from `git diff --name-only origin/main...HEAD`.

**FAIL-ONLY-ONCE A-026 Rule**: "SCOPE_DECLARATION.md must be updated and committed on every PR branch to exactly match `git diff --name-only origin/main...HEAD` before IAA is invoked."

**A-031 Carve-out Analysis**: A-031 applies only when undeclared files are IAA ceremony artifacts from a PRIOR REJECTION-PACKAGE on this branch. There was no prior rejection on this PR branch. A-031 does NOT apply.

**Merge Gate Parity**: stop-and-fix/enforcement — FAIL (A-026 violation detected locally via `git diff --name-only`).

**Fix Required**: Update `SCOPE_DECLARATION.md` to declare the PS-F wave files before re-invoking IAA. Use A-031 carve-out note for IAA ceremony artifacts (Pre-Brief, this rejection artifact, future IAA token file). The declaration must include:

```
# SCOPE DECLARATION — Wave ps-f-iaa-trigger-table-new-categories

**Agent**: CodexAdvisor-agent
**Wave**: ps-f-iaa-trigger-table-new-categories
**Session**: 054
**Date**: 2026-04-07
**Branch**: copilot/add-new-categories-to-iaa-trigger-table
**Issue**: maturion-isms#1270
**Authority**: CS2 (@APGI-cmy)

## Declared Scope: Files Modified

**Wave Category**: KNOWLEDGE_GOVERNANCE

### Tier 2 Knowledge Files (agent-workspace)

- `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` — v2.3.0 → v2.4.0: LIAISON_ADMIN and GOVERNANCE_AUDIT trigger categories added
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` — Knowledge Version 3.4.0 → 3.5.0: iaa-trigger-table.md v2.4.0 registered

### CodexAdvisor Session Files

- `.agent-workspace/CodexAdvisor-agent/memory/session-054-20260407.md` — Session memory (new)
- `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-codexadvisor-session-054-ps-f-iaa-trigger-table-20260407.md` — PREHANDOVER proof (new)
- `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` — Parking station entry appended

### IAA Ceremony Files (A-031 carve-out)

- `.agent-admin/assurance/iaa-prebrief-ps-f-iaa-trigger-table-20260407.md` — IAA Pre-Brief (committed before changes; A-031 carve-out)
- `.agent-admin/assurance/iaa-rejection-session-057-ps-f-iaa-trigger-table-20260407.md` — IAA Rejection Package from this invocation (A-031 carve-out)
- `.agent-admin/assurance/iaa-token-session-057-ps-f-iaa-trigger-table-20260407.md` — IAA Token (to be committed by IAA after successful re-audit; A-031 carve-out)

### Root

- `SCOPE_DECLARATION.md` — This file (fresh overwrite for PS-F wave)

## Out of Scope

- No production code changes (apps/, modules/, supabase/, packages/)
- No CI workflow changes (.github/workflows/)
- No agent contract changes (.github/agents/)
- No migration or schema changes
```

---

## All Other Checks: PASS

Substantive review notes (for CodexAdvisor awareness on re-invocation):

**GOVERNANCE SUBSTANCE: SOUND** — The trigger table changes are well-designed:

1. **LIAISON_ADMIN category**: Trigger conditions are specific and non-overlapping with AGENT_CONTRACT, CANON_GOVERNANCE, and CI_WORKFLOW. The KNOWLEDGE_GOVERNANCE overlay reference adds appropriate rigor. IAA required: YES — MANDATORY. No bypass pathway identified.

2. **GOVERNANCE_AUDIT category**: Scoped to retrospective-only read-only artifacts. AMBIGUITY RULE interaction explicitly stated. Positioned at step 10 — after all 9 triggering categories. No bypass pathway identified. A PR containing ONLY ceremony artifacts (session memory, PREHANDOVER proofs, IAA token files) being EXEMPT is appropriate behavior: these artifacts document past events and cannot modify governance operational state.

3. **Decision flow**: Correctly ordered. Steps 1–9 (all triggering) before step 10 (GOVERNANCE_AUDIT EXEMPT) before step 11 (EXEMPT/AMBIGUOUS). BLOCKER-003 fully addressed.

4. **Version bump**: v2.3.0 → v2.4.0 correct and consistent between file header and index.md registration.

**SINGLE OBSERVATION (not a blocking finding)**: `.agent-workspace/CodexAdvisor-agent/parking-station/suggestions-log.md` was updated (parking station entry appended) but was not declared in the PREHANDOVER proof's scope declaration section. This does not independently fail any named check (A-026 refers to SCOPE_DECLARATION.md; the PREHANDOVER scope is separate). Recommend declaring it in both SCOPE_DECLARATION.md and PREHANDOVER scope on the next commit for completeness.

---

## Re-Invocation Instructions

1. Update `SCOPE_DECLARATION.md` to declare the PS-F wave files (template provided above).
2. Commit `SCOPE_DECLARATION.md` to the branch.
3. Re-invoke IAA at handover.
4. IAA will re-execute all 37 checks. If SCOPE_DECLARATION.md now matches git diff, ASSURANCE-TOKEN will be issued.
5. No substantive changes to `iaa-trigger-table.md` or `index.md` are required — the governance substance is SOUND.

**This PR must not be merged until IAA re-invoked and ASSURANCE-TOKEN issued.**

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE
**STOP-AND-FIX mandate**: ACTIVE
