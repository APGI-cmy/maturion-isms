# Execution Ceremony Admin Checklist

## Status
**Type**: Tier 2 Governance Checklist  
**Authority**: CS2 — EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md v1.1.0  
**Version**: 1.2.0  
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
| 3.8 | PREHANDOVER proof contains a `## Ripple/Cross-Agent Assessment` section (or equivalent `## Ripple`/`## Cross-Agent` heading) that is **non-empty** — at minimum one concrete impact conclusion row (HFMC-01 / AAP-20) | | |
| 3.9 | All active control artifacts for this wave (wave-current-tasks.md, BUILD_PROGRESS_TRACKER.md current-wave entries, active readiness trackers) are normalized to post-assurance state — no active control artifact for this wave shows `PENDING`, `in progress`, `Phase 4 pending`, `IAA Final Audit: PENDING`, or equivalent pre-final wording for tasks/stages that are now complete (AAP-21 / ACR-15) | | |

**Scan command**: `grep -rniE "\bTODO\b|\bTBD\b|\bin[ _-]?progress\b|\bPENDING\b" .agent-admin/prehandover/ .agent-workspace/*/memory/session-*.md`

**Ripple section check**: `grep -iE "^## Ripple|^## Cross-Agent" .agent-admin/prehandover/proof-*.md`

**Active tracker coherence check (3.9)**: `grep -rniE "\bPENDING\b|\bin[ _-]?progress\b|\bPhase 4 pending\b|\bIAA Final Audit: PENDING\b" <active-control-artifact-paths>` — zero results required for normalized active control artifacts

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
| **5.10** | **Active final-state bundle IAA token/session coherence (AAP-22 / ACR-16):** The IAA session ID declared in the PREHANDOVER proof `iaa_audit_token` field, the latest session memory `iaa_session_reference` field, the wave record `## TOKEN` section, and `wave-current-tasks.md` current-token field **all reference the same IAA session ID**. If any artifact in the active bundle references a different session ID as the authoritative current state, this is an immediate BLOCKED condition. | | |
| **5.11** | **Historical archive separation (AAP-22 / ACR-16):** If multiple IAA session IDs appear anywhere in the bundle (e.g., due to prior rejection rounds), confirm that all but one are confined to: (a) immutable historical rejection-package artifacts, (b) superseded PREHANDOVER proofs declared via `Supersedes:` header, or (c) non-latest session memory files — and that only the current authoritative session ID appears in the active final-state fields. | | |

**Active-bundle coherence scan command**:
```bash
grep -hE "iaa_audit_token|iaa_session_reference|ASSURANCE-TOKEN|IAA-session-" \
  $(ls -t .agent-admin/prehandover/proof-*.md 2>/dev/null | head -1) \
  $(ls -t .agent-workspace/*/memory/session-*.md 2>/dev/null | head -1) \
  .agent-workspace/foreman-v2/personal/wave-current-tasks*.md \
  .agent-admin/assurance/iaa-wave-record-*.md 2>/dev/null \
  | grep -oE "IAA-session-[A-Za-z0-9._-]+" | sort -u
# All resolved session IDs must be identical — one unique result expected
```

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
Section 5.10 — Active-bundle IAA coherence (AAP-22): [ ] ONE SESSION ID CONFIRMED ACROSS ACTIVE BUNDLE  [ ] BLOCKED — token/session incoherence detected
Section 6 — Scope Declaration:       [ ] COMPLETE  [ ] EXCEPTIONS NOTED
Section 7 — Inventory/Hash/Date:     [ ] COMPLETE  [ ] N/A (no canon changes)
Section 8 — Ripple/Registry:         [ ] COMPLETE  [ ] N/A (no PUBLIC_API changes)
Section 9 — Final Acceptance:        [ ] COMPLETE  [ ] EXCEPTIONS NOTED
Section 10 — ART Verification:       [ ] COMPLETE  [ ] EXCEPTIONS NOTED  [ ] N/A (non-ECAP flow)

ART Present and Populated:
  Section 10.1 confirmed — ## Authoritative Reference Table:  [ ] PRESENT AND FULLY POPULATED  [ ] ABSENT — BLOCKED (AAP-23)

Ripple/Cross-Agent Assessment Section:
  Section 3.8 confirmed — ## Ripple/Cross-Agent Assessment:  [ ] PRESENT AND POPULATED  [ ] ABSENT — BLOCKED (AAP-20)

Active Tracker Normalization (check 3.9):
  Section 3.9 confirmed — all active control artifacts normalized:  [ ] PASS  [ ] BLOCKED — stale artifact: _______ (AAP-21)

Declared Exceptions (if any):
_______________________________________________

Final-State Normalization Completed:  [ ] YES  [ ] NO (reason: _______)
Cross-Artifact Reconciliation Done:   [ ] YES  [ ] NO (reason: _______)
Commit-State Truth Verified:          [ ] YES  [ ] NO (reason: _______)

BUNDLE STATUS: [ ] READY FOR FOREMAN REVIEW  [ ] BLOCKED — REQUIRES: _______
```

---

## Section 10: Authoritative Reference Table (ART) Verification

(Implements §4.3f Check M and §4.3f Check N per `AGENT_HANDOVER_AUTOMATION.md` v1.7.0)

These checks apply to ALL handover pathways — ECAP and non-ECAP. They guard against wrong-but-existing references (AAP-23) and renumber/rebase drift (AAP-24) that are structurally invisible to existence-only checks (AAP-03).

| # | Check | Verification Command | Verified (✓/✗) | Notes |
|---|-------|---------------------|----------------|-------|
| 10.1 | `## Authoritative Reference Table` section present and fully populated in PREHANDOVER proof (all 8 reference slots populated, no placeholder values) | `grep -n "## Authoritative Reference Table" .agent-admin/prehandover/proof-*.md` | | |
| 10.2 | Session ID in ART matches session memory filename suffix | `ls .agent-workspace/*/memory/session-*.md \| tail -1 \| xargs basename \| grep -oE "session-[0-9]+"` vs ART `Foreman session ID` slot | | |
| 10.3 | IAA session reference in ART matches token file session ID | `grep "IAA-session-" .agent-admin/assurance/iaa-token-*.md 2>/dev/null \| head -1` vs ART `IAA session reference` slot | | |
| 10.4 | Wave identifier in ART matches `wave-current-tasks.md` `Wave:` field | `grep "^Wave:" .agent-workspace/foreman-v2/personal/wave-current-tasks*.md 2>/dev/null` vs ART `Wave identifier` slot | | |
| 10.5 | PR number in ART matches GitHub PR number | `gh pr view --json number 2>/dev/null` vs ART `PR number` slot | | |
| 10.6 | Branch name in ART matches `git branch --show-current` output | `git branch --show-current` vs ART `Branch name` slot | | |
| 10.7 | PREHANDOVER path in ART matches `git ls-files` confirmation | `git ls-files --error-unmatch "$(grep 'PREHANDOVER file path' "$(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null \| head -1)" \| awk '{print $NF}')"` | | |
| 10.8 | Session memory path in ART matches `git ls-files` confirmation | `git ls-files --error-unmatch "$(grep 'Session memory path' "$(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null \| head -1)" \| awk '{print $NF}')"` | | |
| 10.9 | `art_refresh_required` field present in PREHANDOVER proof YAML; if `YES`, `art_refresh_completed: YES` confirmed | `grep -E "art_refresh_required\|art_refresh_completed" .agent-admin/prehandover/proof-*.md` | | |
| 10.10 | All session/wave/IAA references across active bundle cross-checked against ART values — no wrong-but-existing reference found (AAP-23 / AAP-24) | Manual ART cross-check: compare every reference to session ID, wave, IAA session, PR, branch, PREHANDOVER path, session memory path in PREHANDOVER proof + session memory + wave record against ART slot values | | |

**ART cross-check command**:
```bash
# Extract all session/wave/IAA references from active bundle
grep -hE "session-[0-9]+|IAA-session-|iaa_audit_token|iaa_session_reference|^wave:|^pr:|^branch:" \
  $(git ls-files .agent-admin/prehandover/proof-*.md 2>/dev/null | head -1) \
  $(git ls-files .agent-workspace/*/memory/session-*.md 2>/dev/null | tail -1) \
  2>/dev/null
# All values must match ART authoritative values declared in ## Authoritative Reference Table
```

**Renumber/refresh trigger scan**:
```bash
grep -E "art_refresh_required|art_refresh_completed" .agent-admin/prehandover/proof-*.md 2>/dev/null
# art_refresh_required: YES with art_refresh_completed: NO or absent = auto-fail (AAP-24)
```

---

## References

- `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` v1.1.0 — §3.5–§3.9 (duties)
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.7.0 — §4.3e (compliance gate) + §4.3f (ART verification gate)
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` v1.4.0 — §14.6 (QP checkpoint)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.11.0 — §Admin-Ceremony Rejection Triggers
- `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` — cross-artifact dependencies (R18: renumber refresh)
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` — auto-fail conditions (AAP-23, AAP-24)
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md` v1.3.0 — PREHANDOVER proof template (ART section)
- `governance/templates/liaison-mini-ceremony-pack.md` v1.0.0 — liaison / non-ECAP mini-ceremony pack
- `governance/checklists/liaison-mini-ceremony-checklist.md` v1.0.0 — liaison mini-ceremony execution guide

---

*Version: 1.4.0 | Effective: 2026-04-17 | Amended: 2026-04-21 (v1.4.0) — Added Section 10: Authoritative Reference Table (ART) Verification (§4.3f Check M / Check N — AAP-23/AAP-24/ACR-17); updated Section 9 Final Acceptance Block to include Section 10 and ART presence confirmation; updated References to include v1.7.0 canon and new liaison mini-ceremony files; wave admin-ceremony-hardening-20260421 | Amended: 2026-04-20 (v1.3.0) — Added checks 5.10 and 5.11: active final-state bundle IAA token/session coherence + historical archive separation (AAP-22 / ACR-16 / §4.3e Check L; maturion-isms#1422); updated Section 9 final acceptance block to require explicit AAP-22 coherence confirmation; updated IAA canon reference to v1.10.0 | Amended: 2026-04-19 (v1.2.0) — Added check 3.9: active control artifact normalization required before final handback (AAP-21 / ACR-15 / A-039); updated Section 9 final acceptance block to include active tracker normalization confirmation | Amended: 2026-04-19 (v1.1.0) — Added check 3.8: `## Ripple/Cross-Agent Assessment` section presence in PREHANDOVER proof (HFMC-01 / AAP-20) | Authority: CS2 (Johan Ras)*
