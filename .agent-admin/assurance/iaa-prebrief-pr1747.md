# IAA Pre-Brief — PR #1747

PR: #1747  
Issue: #1731  
Date: 2026-05-28  
Scope: remediation-only

## PRE-BRIEF

- Trigger category: post-review stop-and-fix
- Risk profile: medium
- Product impact: domain approval integrity + workflow status rendering
- Governance impact: preflight evidence parity for product-delivery gates

## Targeted Findings

1. `mmm-domain-approval-action` accepted caller-supplied `domain_id` without explicit org ownership validation before insert/update.
2. `DomainAuditBuilder` signed-off check looked for `approved` only, while endpoint writes `approved_l2`.
3. PR-scoped governance artifacts required by current gates were missing.

## Required Controls

- Validate domain ownership through domain->framework->organisation chain before mutating approval request rows.
- Treat `approved_l2` as signed-off status in domain workflow UI.
- Commit PR evidence package:
  - `.admin/prs/pr-1747.json`
  - `.agent-admin/prs/pr-1747/wave-current-tasks.md`
  - `.agent-admin/scope-declarations/pr-1747.md`
  - `.functional-delivery/pr-1747.md`

## Acceptance Criteria

- Security finding closed: cross-org domain submission blocked with 403.
- Status finding closed: L2-approved domains render as completed/signed-off in workflow cards.
- Gate evidence files present under PR #1747 naming contract.
