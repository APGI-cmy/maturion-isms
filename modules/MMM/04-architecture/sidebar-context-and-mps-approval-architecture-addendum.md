# MMM Architecture Addendum — Sidebar Context + MPS L1/L2 Approval

## Architecture Intent
This addendum adds a UX shell and approval-control layer without replacing the harvested domain workflow engine.

## Components
- `AuthenticatedAppShell`:
  - single sidebar renderer for all protected routes.
- `OrganisationContextPage`:
  - reads/writes onboarding context JSON and organisation identity fields.
- `DMC Migration Action Panel`:
  - triggers legacy migration and renders run telemetry.
- `Approval Services`:
  - MPS L1 action service.
  - domain L2 review-loop service.

## Data Stores
- `mmm_organisations.context` remains source of organisation context truth.
- `mmm_mps_approval_actions` stores L1 action ledger.
- `mmm_domain_approval_requests` stores domain review loop status.
- `mmm_domain_approval_comments` stores conversation trail per domain review request.

## Route Architecture
- Protected routes are nested under one shell.
- Sidebar links become canonical navigation entry points for authenticated flows.

## Guardrails
- Domain approval lock state blocks lower-level mutation unless returned/reopened.
- All approval transitions are audit-traced.
