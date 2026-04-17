# Correction Addendum Template — execution-ceremony-admin-agent

> **Usage**: Use when a previously committed ceremony artifact contains an administrative error that must be corrected. Copy to `.agent-admin/prehandover/correction-addendum-<PR#>-<date>.md`. Do NOT edit the original committed artifact; use this addendum to declare the correction and reference the superseding artifact.

---

# Correction Addendum — [Wave/Job Identifier]

**Date**: YYYY-MM-DD  
**ECAP Session**: ecap-session-NNN  
**Foreman Session**: session-NNN  
**PR**: #[PR number]  
**Issue**: #[issue number]  
**Addendum Number**: [1, 2, 3 … per PR]

---

## Artifact Being Corrected

| Field | Value |
|-------|-------|
| Original artifact path | [path to committed artifact] |
| Original artifact committed SHA | [first 12 chars of commit where it was committed] |
| Error discovered | YYYY-MM-DD |
| Error discovered by | execution-ceremony-admin-agent / Foreman / IAA |

---

## Error Description

[Precise description of the administrative error. Include: which field/section was wrong, what wrong value it contained, and what the correct value should be.]

---

## Anti-Pattern Reference

| AAP ID | Match |
|--------|-------|
| [AAP-NN if applicable] | YES / NO |

---

## Correction Action

| Step | Action | Status |
|------|--------|--------|
| 1 | [What was corrected] | COMPLETE |
| 2 | [New artifact created at path: ___] | COMPLETE |
| 3 | [Original artifact retained (immutable)] | CONFIRMED |

---

## Superseding Artifact

| Field | Value |
|-------|-------|
| Superseding artifact path | [path to new artifact] |
| Committed | YES |
| Commit SHA | [first 12 chars] |

> **Note**: The original committed artifact has NOT been edited. This addendum and the superseding artifact together constitute the corrected record. The original artifact is retained for audit trail purposes.

---

## Impact Assessment

**Does this correction require a new PREHANDOVER proof?** YES / NO  
*(Required if the corrected artifact is the PREHANDOVER proof or if the correction changes a value declared in the PREHANDOVER proof.)*

**If YES — new PREHANDOVER proof path**: [path]  
**Does this correction require re-running §4.3e gate?** YES / NO  
**Does this correction require re-invoking IAA?** YES / NO  

---

*Template Version: 1.0.0 | Authority: ECAP-001 v1.1.0 | Effective: 2026-04-17*
