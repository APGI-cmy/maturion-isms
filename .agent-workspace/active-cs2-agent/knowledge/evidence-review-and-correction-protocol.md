# Active-CS2 — Evidence Review and Correction Protocol

## Review target

Review only bounded evidence returned for the active wave:

- Foreman QP result
- ECAP administrative validation when required
- independent final IAA result
- current checks/conflict/base-sync evidence
- reviewed-content fingerprint and any bounded token-only evidence delta

## Stage-aware rule

Initial dispatch and pre-brief must not require their own future final evidence. Evidence requirements increase only with stage progression.

## Findings packet

When evidence fails, return a packet naming:

- failed obligation
- exact evidence path or check
- owner (`Foreman`, `specialist`, `ECAP`, `human CS2`)
- required re-entry stage
- whether the defect is ordinary remediation or a reserved matter

## Routing boundary

- Ordinary implementation or evidence defects return to Foreman.
- Protected authority, new cost/credential, breaker reset, destructive action, and constitutional ambiguity escalate to human CS2.
- IAA is never used as a correction owner.
