# MMM Architecture Addendum — Sidebar Context + MPS L1/L2 Approval

## Architecture Intent
This addendum adds a UX shell and approval-control layer without replacing the harvested domain workflow engine.

## Components
- `AuthenticatedAppShell`:
  - single sidebar renderer for all protected routes.
- `OrganisationContextPage`:
  - reads/writes onboarding context JSON and organisation identity fields.
  - uploads customer-specific source documents for Verbatim, Hybrid, and New Generation source strategies.
- `resolveModeSourceContext`:
  - shared frontend resolver used by MPS, Intent, and Criteria generation.
  - loads framework source mode, organisation context, and organisation/framework source documents.
- `DMC Migration Action Panel`:
  - triggers legacy migration and renders run telemetry.
- `Approval Services`:
  - MPS L1 action service.
  - domain L2 review-loop service.

## Data Stores
- `mmm_organisations.context` remains source of organisation context truth.
- `mmm_subject_knowledge_documents` stores both DMC subject knowledge and tenant-scoped Organisation Context source documents; Organisation Context rows use `scope_type=organisation_context` and mode tags.
- `mmm_mps_approval_actions` stores L1 action ledger.
- `mmm_domain_approval_requests` stores domain review loop status.
- `mmm_domain_approval_comments` stores conversation trail per domain review request.

## Route Architecture
- Protected routes are nested under one shell.
- Sidebar links become canonical navigation entry points for authenticated flows.

## Guardrails
- Domain approval lock state blocks lower-level mutation unless returned/reopened.
- All approval transitions are audit-traced.
- MPS modal remains the working surface for Draft→Submit progression:
  - row-level draft edits,
  - L1 action ledger updates,
  - section-level L2 submit transition.
- Preference-learning loop is human-consent gated; accepted edits emit a dedicated AI interaction record for future personalization.
- Subject knowledge and customer context remain separate retrieval domains:
  - DMC subject knowledge teaches Maturion the discipline.
  - Organisation/Framework Context documents teach Maturion the customer and selected source document.
  - Customer context may not bleed into global subject knowledge or another tenant.
- Verbatim, Hybrid, and New Generation are generation strategies applied consistently across MPS, Intent, and Criteria.
- Verbatim quality controls are mandatory:
  - de-duplicate generated MPS rows by normalized source title,
  - resolve criteria from parsed framework artifacts (`mmm_proposed_criteria`) before AI fallback,
  - expose operator-visible consulted-source telemetry in the MPS modal.
