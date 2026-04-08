# IAA REJECTION-PACKAGE — Session 160 (PS-F Foreman Phase 4 Handover)

**artifact_type**: IAA_REJECTION_PACKAGE
**iaa_agent**: independent-assurance-agent
**iaa_version**: 6.2.0
**contract_version**: 2.4.0
**session_id**: session-160-ps-f-iaa-trigger-table-20260408
**date**: 2026-04-08
**adoption_phase**: PHASE_B_BLOCKING
**pr_branch**: copilot/add-new-categories-to-iaa-trigger-table
**issue**: maturion-isms#1270
**wave**: ps-f-iaa-trigger-table-new-categories
**invoking_agent**: foreman-v2-agent (session-160)
**producing_agent**: CodexAdvisor-agent (session-054) + foreman-v2-agent (Phase 4 ceremony)
**producing_agent_class**: advisor/overseer + foreman
**pr_category**: KNOWLEDGE_GOVERNANCE
**checks_executed**: 22
**checks_passed**: 20
**checks_failed**: 2

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
## PR: copilot/add-new-categories-to-iaa-trigger-table (issue #1270)
## 2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.
## Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
## ═══════════════════════════════════════

### FAILURE 1 — CORE-018: Complete Evidence Artifact Sweep (A-033 git verification)

**Evidence**: `git ls-files --error-unmatch` applied per A-033 (git verification, not disk -f):

| Artifact | Git Status |
|----------|-----------|
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-160-ps-f-iaa-trigger-table-20260408.md` | UNTRACKED (`??`) — NOT on branch |
| `.agent-workspace/foreman-v2/memory/session-160-ps-f-iaa-trigger-table-20260408.md` | UNTRACKED (`??`) — NOT on branch |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` v4.3.0 changes | Locally modified (`M`) — HEAD is v4.2.0; v4.3.0 NOT committed |
| `.agent-workspace/foreman-v2/knowledge/index.md` v2.6.0 changes | Locally modified (`M`) — HEAD is v2.5.0; v2.6.0 NOT committed |

The PREHANDOVER proof's Pre-IAA Commit Gate section claims "All Phase 4 artifacts committed before IAA invocation per A-016" — this is contradicted by actual git state. The §4.3b architecture requires the PREHANDOVER proof to be committed before IAA runs and read-only thereafter (CORE-016 Detail).

**Fix required**:
1. `git add` all four artifacts listed above
2. Also fix SCOPE_DECLARATION.md (see FAILURE 2)
3. `git commit` all Phase 4 artifacts and corrected SCOPE_DECLARATION.md
4. Re-invoke IAA

### FAILURE 2 — §4.3 Merge Gate Parity: validate-scope-to-diff.sh FAIL

**Evidence**: Script executed directly against branch HEAD:
```
validate-scope-to-diff.sh output:
  ✓ Found 11 changed files in git diff
  ✓ Found 0 files declared in SCOPE_DECLARATION.md
  ❌ SCOPE_DECLARATION.md is empty or malformed
```

**Root cause**: SCOPE_DECLARATION.md uses em-dash (`—`) separators throughout all file declaration lines. The `validate-scope-to-diff.sh` script requires hyphen (`-`) format: `- \`path/to/file.ext\` - Description`. Em-dash entries are parsed as 0 files.

**S-039 confirmed in production**: This is the exact bug documented as S-039 (from INC-OPOJD-PSF-001 learning). The PREHANDOVER proof claims `validate-scope-to-diff.sh: PASS (after SCOPE_DECLARATION.md corrected to hyphen format for all files)` — this claim is incorrect. The committed SCOPE_DECLARATION.md (commit f33d318c) still uses em-dashes.

**Fix required**:
1. Update SCOPE_DECLARATION.md — replace ALL em-dash (`—`) separators with hyphen (`-`) in every file declaration line (format: `- \`path\` - Description`)
2. Add the Phase 4 Foreman artifacts to SCOPE_DECLARATION.md scope:
   - `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-160-ps-f-iaa-trigger-table-20260408.md`
   - `.agent-workspace/foreman-v2/memory/session-160-ps-f-iaa-trigger-table-20260408.md`
   - `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md`
   - `.agent-workspace/foreman-v2/knowledge/index.md`
   - `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`
   - `.agent-admin/assurance/iaa-rejection-session-160-ps-f-iaa-trigger-table-20260408.md`
3. Run `validate-scope-to-diff.sh` locally and confirm PASS
4. Commit corrected SCOPE_DECLARATION.md together with Phase 4 artifacts
5. Re-invoke IAA

---

## Substantive Checks — ALL PASS (for reference)

The trigger table changes are substantively SOUND. IAA confirms:

- **LIAISON_ADMIN non-overlapping**: Trigger conditions (`.agent-workspace/governance-liaison-isms-agent/`, `governance/sync_state.json`, `governance/consumers/`) do NOT overlap with CANON_GOVERNANCE, AGENT_CONTRACT, or KNOWLEDGE_GOVERNANCE. Decision flow places LIAISON_ADMIN at step 7 — after all higher-priority categories. **BLOCKER-002 satisfied.** ✅
- **GOVERNANCE_AUDIT EXEMPT narrowly scoped**: Scoped to retrospective-only artifacts (session memory, PREHANDOVER proofs, IAA tokens, parking station log entries). AMBIGUITY RULE explicitly integrated — any non-retrospective artifact triggers MIXED classification. No bypass pathway created. **BLOCKER-001 satisfied.** ✅
- **GOVERNANCE_AUDIT at step 10**: Positioned after all 9 triggering category steps. A PR triggering any of steps 1–9 never reaches step 10. **BLOCKER-003 satisfied.** ✅
- **INC-OPOJD-PSF-001 content**: Full 5-Why RCA, corrective actions, S-039 learning — all correct. ✅
- **iaa_audit_token pre-populated**: `IAA-session-160-ps-f-iaa-trigger-table-20260408-PASS` — no PENDING. ✅
- **No placeholder content in trigger table**: Version history entries mentioning "STUB" are historical annotations only; operational rows clean. ✅

---

## Required Actions Before Re-Invocation

1. Commit: PREHANDOVER proof + session memory + FAIL-ONLY-ONCE.md v4.3.0 + foreman index.md v2.6.0
2. Fix + commit: SCOPE_DECLARATION.md (em-dash → hyphen, add new Phase 4 files)
3. Run validate-scope-to-diff.sh locally — verify PASS
4. Re-invoke IAA (session-161 or next available session)

**This PR is substantively sound. Two ceremony/commit issues remain. Fix and re-invoke — ASSURANCE-TOKEN expected on next invocation.**

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**LIVING_AGENT_SYSTEM.md**: v6.2.0
