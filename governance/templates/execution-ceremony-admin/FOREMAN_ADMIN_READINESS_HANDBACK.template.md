# Foreman Admin-Readiness Handback Summary Template

> **Usage**: Completed by the Foreman at the QP Admin-Compliance Checkpoint (§14.6 of FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md). Commit this as part of the handover evidence set, or embed in the PREHANDOVER proof / ECAP reconciliation summary. Required before IAA invocation for ECAP-involved jobs.

---

# Foreman Admin-Readiness Handback Summary

**Wave / Job**: [wave/job identifier]  
**Foreman Session**: session-NNN  
**ECAP Session**: ecap-session-NNN  
**Date**: YYYY-MM-DD  
**PR**: #[PR number]  
**Issue**: #[issue number]

---

## ECAP Reconciliation Artifacts Reviewed

| Artifact | Path | Reviewed |
|----------|------|---------|
| ECAP reconciliation summary | [path] | ✓/✗ |
| Artifact completeness table | [path or "embedded in reconciliation summary"] | ✓/✗ |
| Cross-artifact consistency table | [path or "embedded in reconciliation summary"] | ✓/✗ |
| Ripple assessment block | [path or "embedded" or "N/A — no PUBLIC_API changes"] | ✓/✗ |
| §4.3e gate run evidence | [path or "confirmed via ECAP reconciliation summary"] | ✓/✗ |

---

## Declared Exceptions Review

| # | Exception Declared by ECAP | Foreman Assessment |
|---|---------------------------|-------------------|
| 1 | [exception description or "None"] | ACCEPTABLE / UNACCEPTABLE / N/A |

**If any exception is UNACCEPTABLE**: The bundle must be returned to ECAP for resolution before this checkpoint can be accepted.

---

## Checkpoint Verdict

| Field | Value |
|-------|-------|
| **substantive_readiness** | `ACCEPTED` \| `REJECTED` |
| **administrative_readiness** | `ACCEPTED` \| `REJECTED` |
| **QP admin-compliance check completed** | `yes` \| `no` |
| **IAA invocation authorized** | `yes` \| `no` |

**Rejection reason** *(if administrative_readiness = REJECTED)*:  
[State every reason precisely — these must be resolved by ECAP before re-submission]

---

## Post-Checkpoint Actions

| If administrative_readiness = ACCEPTED | If administrative_readiness = REJECTED |
|----------------------------------------|----------------------------------------|
| Proceed to §4.3e gate confirmation | Return bundle to ECAP with rejection reasons |
| Proceed to IAA invocation | Do NOT invoke IAA |
| Record this summary in PREHANDOVER proof | Re-run QP checkpoint after ECAP remediation |

---

*Template Version: 1.0.0 | Authority: FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md v1.4.0 §14.6 | Effective: 2026-04-17*
