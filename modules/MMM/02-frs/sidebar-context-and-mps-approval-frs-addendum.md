# MMM FRS Addendum — Sidebar Context + MPS L1/L2 Approval

## Scope
This addendum governs three recovery capabilities:
1. Persistent Organisation Context editing after onboarding completion.
2. Sidebar-first authenticated MMM navigation model.
3. MPS/domain approval lifecycle through L1 (user) and L2 (domain review loop).

## Functional Requirements
- The onboarding wizard remains the initial capture flow only; post-completion edits must occur in a dedicated Organisation Context page.
- All authenticated MMM pages must render within a shared sidebar shell.
- Sidebar must include Organisation Context, Maturity Roadmap, Frameworks, DMC, and Dashboard entries.
- Domain cards must expose mini-dashboard status for:
  - criteria generation progress,
  - approval status,
  - implementation readiness,
  - domain maturity level label.
- MPS workflow must support L1 approval:
  - approve/edit/regenerate/reject with traceable audit records.
- Domain workflow must support L2 loop:
  - submit for review,
  - reviewer return with comments,
  - user resubmit,
  - reviewer final approval and domain lock.

## DMC Functional Requirements
- DMC must operate on AIMC-canonical MMM tables.
- Legacy upload continuity must be restored via an explicit migration action.
- Migration telemetry must show scanned/migrated/deduped/failed counts and failure details.
- DMC errors must be actionable (clear operation-specific diagnostics).
