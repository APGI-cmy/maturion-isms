# Execution Ceremony Admin Checklist

## Status
**Type**: Tier 2 Governance Checklist  
**Authority**: CS2 — EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md v1.1.0  
**Version**: 1.0.0  
**Effective Date**: 2026-04-17  
**Owner**: execution-ceremony-admin-agent (per-job completion) / Foreman QP (per-job review)  
**Purpose**: Authoritative checklist for ceremony completeness. Used by the `execution-ceremony-admin-agent` before bundle handback and by the Foreman QP checkpoint before IAA invocation.

---

## Instructions

Complete every section in order. Mark each item `[x]` when confirmed or `[N/A]` with a reason when genuinely not applicable. Items marked `[ ]` (incomplete) render the bundle non-compliant for handback.

---

## Section 1: Required Artifact Presence Table

| # | Artifact Class | Required Path Pattern | Present (✓/✗) | Notes / Exception |
|---|---------------|----------------------|--------------|-------------------|
| 1.1 | PREHANDOVER proof | `.agent-admin/prehandover/proof-*.md` | | |
| 1.2 | Session memory | `.agent-workspace/<agent>/memory/session-*.md` | | |
| 1.3 | Gate results (JSON) | `.agent-admin/gates/gate-results-*.json` | | |
| 1.4 | ECAP reconciliation summary | `.agent-admin/prehandover/ecap-reconciliation-*.md` or embedded in PREHANDOVER | | |
| 1.5 | Artifact completeness table | Embedded in reconciliation summary or separate file | | |
| 1.6 | Cross-artifact consistency table | Embedded in reconciliation summary or separate file | | |
| 1.7 | Ripple assessment block | Embedded in reconciliation summary or "N/A — no PUBLIC_API changes" | | |
| 1.8 | Scope declaration | `governance/scope-declaration.md` | | |
| 1.9 | IAA assurance token file | `.agent-admin/assurance/iaa-token-*.md` (if IAA invoked in this job) | | |

---

## Section 2: Required Artifact Commit-State Table

Verify that every artifact in Section 1 is **committed** to the working branch, not just locally present.

| # | Artifact Path | Committed (✓/✗) | HEAD SHA (first 8 chars) | Notes |
|---|--------------|----------------|--------------------------|-------|
| 2.1 | PREHANDOVER proof | | | |
| 2.2 | Session memory | | | |
| 2.3 | Gate results (JSON) | | | |
| 2.4 | ECAP reconciliation summary | | | |
| 2.5 | Scope declaration | | | |

**Verification command**: `git ls-files --error-unmatch <path>` — exits 0 if committed, non-0 if not.

---

## Section 3: Status Normalization Checks (ECAP-CCI-03, ECAP-CCI-04)

Verify that no prohibited provisional wording exists in any final-state artifact.

| # | Check | Verified (✓/✗) | Notes |
|---|-------|---------------|-------|
| 3.1 | No `TODO` in PREHANDOVER proof (where a definitive value is required) | | |
| 3.2 | No `TBD` in PREHANDOVER proof (where a definitive value is required) | | |
| 3.3 | No `PENDING` in PREHANDOVER proof status fields (where PASS/COMPLETE is required) | | |
| 3.4 | No `in progress` or `in-progress` in session memory final-status fields | | |
| 3.5 | All gate checkboxes in PREHANDOVER are definitively marked PASS/FAIL (not "to be confirmed") | | |
| 3.6 | All status markers across PREHANDOVER proof, session memory, and wave record are consistent | | |
| 3.7 | Final-state declaration in PREHANDOVER (`final_state`) is `COMPLETE` or equivalent — not a provisional value | | |

**Scan command**: `grep -rniE "\bTODO\b|\bTBD\b|\bin[ _-]?progress\b|\bPENDING\b" .agent-admin/prehandover/ .agent-workspace/*/memory/session-*.md`

---

## Section 4: Version Normalization Checks (ECAP-QC-003, ECAP-QC-004)

| # | Check | Verified (✓/✗) | Notes |
|---|-------|---------------|-------|
| 4.1 | Every amended CANON_INVENTORY.json entry has `version == canonical_version` | | |
| 4.2 | Every amended CANON_INVENTORY.json entry has `amended_date == today (YYYY-MM-DD)` | | |
| 4.3 | Every amended CANON_INVENTORY.json entry has `file_hash` / `file_hash_sha256` recomputed from current file state | | |
| 4.4 | No mixed version labels within a single document (e.g., one section says v1.2.0 and another says v1.3.0 as the current version of the same file) | | |
| 4.5 | EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md header version matches its CANON_INVENTORY entry | | |
| 4.6 | AGENT_HANDOVER_AUTOMATION.md header version matches its CANON_INVENTORY entry | | |
| 4.7 | Any other amended canon file header version matches its CANON_INVENTORY entry | | |

---

## Section 5: Token / Session / Path Consistency Checks (§3.7)

| # | Check | Verified (✓/✗) | Notes |
|---|-------|---------------|-------|
| 5.1 | PREHANDOVER proof `session_id` matches the session memory filename session number | | |
| 5.2 | PREHANDOVER proof `iaa_audit_token` references a token file that actually exists on the branch | | |
| 5.3 | PREHANDOVER proof `iaa_audit_token` session ID matches the session ID in the token file | | |
| 5.4 | Session memory references the same PR number as the PREHANDOVER proof | | |
| 5.5 | Session memory references the same wave/job identifier as the PREHANDOVER proof | | |
| 5.6 | All artifact paths cited in session memory exist as committed files on the branch | | |
| 5.7 | PREHANDOVER proof `branch` field matches the actual working branch name | | |
| 5.8 | PREHANDOVER proof `issue` field matches the actual GitHub issue number | | |
| 5.9 | PREHANDOVER proof `pr` field is consistent with the PR number (if PR already exists) | | |

---

## Section 6: Scope Declaration Parity Checks (ECAP-QC-002)

| # | Check | Verified (✓/✗) | Notes |
|---|-------|---------------|-------|
| 6.1 | `governance/scope-declaration.md` exists and is committed | | |
| 6.2 | `FILES_CHANGED` count in scope-declaration.md matches `git diff --name-only origin/main...HEAD \| wc -l` | | |
| 6.3 | Scope declaration was regenerated after any file additions or deletions in this session | | |
| 6.4 | Scope declaration is the last committed file in the branch before IAA invocation | | |

**Verification**:
```bash
DECLARED=$(grep "^FILES_CHANGED:" governance/scope-declaration.md | awk '{print $2}')
ACTUAL=$(git diff --name-only origin/main...HEAD | wc -l | tr -d ' ')
echo "Declared: ${DECLARED} | Actual: ${ACTUAL}"
[ "${DECLARED}" = "${ACTUAL}" ] && echo "✅ MATCH" || echo "❌ MISMATCH"
```

---

## Section 7: Inventory / Hash / Amended-Date Checks (ECAP-QC-003, ECAP-QC-004)

| # | Check | Verified (✓/✗) | Notes |
|---|-------|---------------|-------|
| 7.1 | For every amended file: SHA256 recomputed with `sha256sum <file>` and matches `file_hash_sha256` in CANON_INVENTORY | | |
| 7.2 | For every amended file: `amended_date` in CANON_INVENTORY equals today's date | | |
| 7.3 | `validate-canon-hashes.sh` run with 0 failures | | |
| 7.4 | GOVERNANCE_ARTIFACT_INVENTORY.md updated if any new artifacts were introduced | | |

---

## Section 8: Ripple / Registry Checks (§3.9)

| # | Check | Verified (✓/✗) | Notes |
|---|-------|---------------|-------|
| 8.1 | Identified all changed files with `layer_down_status: PUBLIC_API` in CANON_INVENTORY | | |
| 8.2 | For each PUBLIC_API file: ripple assessment recorded in ECAP reconciliation summary | | |
| 8.3 | Ripple status declared as COMPLETED / DEFERRED / NOT-APPLICABLE for each PUBLIC_API file | | |
| 8.4 | If DEFERRED: downstream issue/PR reference or deferral reason recorded | | |
| 8.5 | CANON_INVENTORY.json updated for all amended canon files (version, hash, amended_date) | | |

---

## Section 9: Final Acceptance Block (ECAP)

The execution-ceremony-admin-agent completes this block before returning the bundle to the Foreman:

```
ECAP Ceremony Bundle Final Acceptance
======================================
Wave / Job: ___________________________
ECAP Session: _________________________
Date: _________________________________
Completed By: execution-ceremony-admin-agent

Section 1 — Artifact Presence:       [ ] COMPLETE  [ ] EXCEPTIONS NOTED
Section 2 — Commit-State:            [ ] COMPLETE  [ ] EXCEPTIONS NOTED
Section 3 — Status Normalization:    [ ] COMPLETE  [ ] EXCEPTIONS NOTED
Section 4 — Version Normalization:   [ ] COMPLETE  [ ] EXCEPTIONS NOTED
Section 5 — Token/Session/Path:      [ ] COMPLETE  [ ] EXCEPTIONS NOTED
Section 6 — Scope Declaration:       [ ] COMPLETE  [ ] EXCEPTIONS NOTED
Section 7 — Inventory/Hash/Date:     [ ] COMPLETE  [ ] N/A (no canon changes)
Section 8 — Ripple/Registry:         [ ] COMPLETE  [ ] N/A (no PUBLIC_API changes)

Declared Exceptions (if any):
_______________________________________________

Final-State Normalization Completed:  [ ] YES  [ ] NO (reason: _______)
Cross-Artifact Reconciliation Done:   [ ] YES  [ ] NO (reason: _______)
Commit-State Truth Verified:          [ ] YES  [ ] NO (reason: _______)

BUNDLE STATUS: [ ] READY FOR FOREMAN REVIEW  [ ] BLOCKED — REQUIRES: _______
```

---

## References

- `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` v1.1.0 — §3.5–§3.9 (duties)
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.4.0 — §4.3e (compliance gate)
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` v1.4.0 — §14.6 (QP checkpoint)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.6.0 — §Admin-Ceremony Rejection Triggers
- `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` — cross-artifact dependencies
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` — auto-fail conditions

---

*Version: 1.0.0 | Effective: 2026-04-17 | Authority: CS2 (Johan Ras)*
