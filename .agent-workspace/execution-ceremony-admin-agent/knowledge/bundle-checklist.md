# ECAP Bundle Checklist

**Agent**: execution-ceremony-admin-agent
**Knowledge Version**: 1.1.0
**Last Updated**: 2026-05-01
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Ref**: ECAP-001 §3.3, §5.2

---

## Purpose

This checklist defines the complete contents, required fields, handback contents, and
readiness gate for the ceremony bundle before return to Foreman.

---

## Pre-Assembly Gate (must pass before writing any bundle artifact)

| Gate | Check | Action on Failure |
|------|-------|-------------------|
| G-1 | Foreman appointment brief received (all 4 fields present) | HALT-004 → return to Foreman |
| G-2 | `git status --porcelain` empty | HALT-005 if primary deliverables uncommitted |
| G-3 | IAA wave record exists with `## PRE-BRIEF` populated | Flag to Foreman before proceeding |
| G-4 | Scope declaration lists both ECAP bundle paths | BLOCKING HALT → return to Foreman |
| G-5 | CANON_INVENTORY hashes non-placeholder | HALT-002 → return to Foreman |
| G-6 | Post-token normalization confirmed: no pre-final instruction wording in any artifact when branch claims final assurance | BLOCKING HALT — AAP-17/18 → return to Foreman |

---

## Bundle Contents (all required before return to Foreman)

### 1. PREHANDOVER Proof
**Path**: `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-NNN-YYYYMMDD.md`

Required fields:
- Session ID, date, agent version, issue/wave ref
- Wave description and job scope
- QP verdict: PASS (received from Foreman)
- OPOJD: PASS (received from Foreman)
- CANON_INVENTORY: ALIGNED
- Bundle completeness confirmation
- `merge_gate_parity: PASS`
- `iaa_audit_token: IAA-session-NNN-waveY-YYYYMMDD-PASS` (expected reference — IAA writes the actual token)
- `iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-{wave}-{date}.md`
- CS2 authorization evidence

**Prohibited**: Do NOT include any IAA assurance verdict, ASSURANCE-TOKEN, or REJECTION-PACKAGE language.

### 2. Session Memory
**Path**: `.agent-workspace/execution-ceremony-admin-agent/bundles/session-NNN-YYYYMMDD.md`

Mandatory non-blank fields:
- `prior_sessions_reviewed`
- `unresolved_items_from_prior_sessions`
- `roles_invoked`
- `mode_transitions`
- `agents_delegated_to`
- `escalations_triggered`
- `separation_violations_detected`
- `fail_only_once_attested: true`
- `fail_only_once_version`
- `unresolved_breaches`
- `suggestions_for_improvement` (MANDATORY — never blank)

### 3. Evidence Artifact Index
List all evidence artifacts with paths, commit SHAs, and presence confirmation.
Includes: builder deliverables, QP evaluation record, §4.3 parity result, wave-current-tasks state.

### 4. Commit-State Gate Result
Record output of `git status --porcelain` and `git show --name-only HEAD`.
Must be clean (empty porcelain output) or document justified exceptions.

---

## Handback Contents (returned to Foreman via task completion message)

The handback message MUST include:
1. PREHANDOVER proof path
2. Session memory path
3. Evidence artifact paths
4. Commit-state gate result: PASS / FAIL (with detail if FAIL)
5. Any residual notes for Foreman review (administrative — not substantive)
6. Any items explicitly out-of-scope and why

---

## What Must Be Present Before Return to Foreman

All of the following must be present and committed before ECAP returns the bundle:
- [ ] PREHANDOVER proof written to ECAP bundle path (not Foreman memory path)
- [ ] Session memory written to ECAP bundle path (not Foreman memory path)
- [ ] All mandatory session memory fields populated (no blanks)
- [ ] `suggestions_for_improvement` non-blank
- [ ] Evidence artifact index complete
- [ ] Commit-state gate documented
- [ ] Parking station entry appended
- [ ] Post-token normalization check passed: no pre-final instruction wording in final-state artifacts (AAP-17 check)
- [ ] Cross-artifact consistency confirmed: all final-state artifacts tell one coherent post-token story (AAP-18 check)

---

## What ECAP Does NOT Return

ECAP MUST NOT include in the bundle:
- IAA assurance token or verdict
- REJECTION-PACKAGE
- Any `.agent-admin/assurance/` file
- Any commitment to or judgment of substantive quality
- Any instruction to merge or release the merge gate

---

**Authority**: CS2 | **Ref**: ECAP-001 §3.3, GOVERNANCE_ARTIFACT_TAXONOMY.md
