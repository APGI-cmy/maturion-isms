# ISMS — Architecture Completeness Gap Analysis

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact Type | Architecture completeness gap analysis |
| Governance Standard | `governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` v1.4 |
| Reviewed Architecture | `modules/isms/04-architecture/architecture.md`; `modules/isms/04-architecture/architecture-reconciliation-stage5.md` |
| Date | 2026-05-30 |
| Status | RED — Architecture incomplete for implementation handover |
| Branch | `foreman/stage5-architecture-completeness-gap` |

---

## 1. Executive Disposition

The ISMS Stage 5 Architecture Reconciliation is acceptable as a pre-build architecture bridge, but it does **not** pass the governance canon architecture completeness gate.

The governing standard says architecture is incomplete and unfit for implementation unless all mandatory completeness domains are explicitly addressed. It also states that a builder must be able to implement without additional research or assumptions, and QA must be derivable directly from architecture without interpretation.

**Decision:**

```text
Architecture completeness status: RED
Implementation handover: NOT APPROVED
Next action: Architecture remediation before implementation handover; Stage 6 QA-to-Red may proceed only as a gap-exposing RED suite, not as proof of build readiness.
```

---

## 2. Source Materials Reviewed

- `governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md`
- `modules/isms/04-architecture/architecture.md`
- `modules/isms/04-architecture/architecture-reconciliation-stage5.md`
- `modules/isms/04-architecture/trs-to-architecture-traceability.md`
- `modules/isms/03-trs/technical-requirements-specification.md`
- `modules/isms/02-frs/functional-requirements.md`
- `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md`
- `modules/isms/BUILD_PROGRESS_TRACKER.md`

---

## 3. Completeness Matrix Against Governance Canon

| Canon Domain | Required by Governance Canon | Current Stage 5 Coverage | Gap Status | Required Fix |
|---|---|---|---|---|
| 3.1 Deployment Target Declaration | Exact deployment platform, version constraints, config, entry point, platform limitations | Target app is named, but deployment platform is not selected | RED | Specify deployment target, build command location, hosting constraints, preview/production behavior |
| 3.2 Runtime Entrypoint and Filesystem Expectations | App entry file, build output, static asset paths, config locations, persistence paths | Component/file targets listed, but runtime entrypoint and build output are not fully specified | RED | Document `src/main.tsx`, `index.html`, `dist/`, public assets, config files, monorepo/package location |
| 3.3 Environment Variables and Provider Constraints | Complete env var list and `.env.example` | TRS requires future env registry, but architecture has no concrete env matrix | RED | Create env registry and `.env.example` policy for Supabase, AI, auth, checkout, deployment |
| 3.4 Database and Migration Strategy | Persistence mechanism, schema location, migration tool, timing, rollback, seed, backup | Entitlement/audit data are conceptual; no Supabase schema or migration strategy | RED | Define Supabase tables, migrations, ownership, rollback, seed/mock data, schema-to-hook gate |
| 3.5 Non-Testable Configuration Failure Boundaries | Runtime-only config, manual verification, failure detection, rollback triggers | Not addressed | RED | Add deployment/runtime verification checklist and rollback triggers |
| 3.6 Integration and External Dependencies | External services, contracts, auth, retry/timeout, degraded mode | AI package mentioned; Supabase/checkout/auth providers not fully specified | RED | Define external dependency registry and failure modes |
| 3.7 Security and Compliance Controls | Auth, authorization, encryption, secrets, input validation, audit logging, compliance mappings | Public/private route boundaries and audit event shape exist; detailed security controls absent | RED | Define auth provider, permission model, input validation, RLS, encryption, compliance mapping |
| 3.8 Performance and Scalability Constraints | Expected load, latency targets, resource limits, scaling strategy | Not addressed | RED | Add initial performance budgets and scalability assumptions |
| 3.9 Error Handling and Observability | Error classes, responses, logging, monitoring, health checks, diagnostics | User-visible errors and audit events mentioned, but no full strategy | RED | Define error taxonomy, logging levels, health checks, monitoring, diagnostics |
| 3.10 Test Strategy and QA Domains | QA domains, unit/integration/e2e scope, test data, environments | Deferred to Stage 6; not yet architecture-derived enough | RED | Define QA domains and test data strategy before QA-to-Red finalization |
| 3.11 Wiring & Interconnectivity | Logical wiring diagram, connection definitions, ownership, startup order, failure cascades | Route and component ownership exists, but no complete wiring diagram or data/control flow | RED | Create system wiring diagram and connection table for routes, context, auth, Supabase, AI, audit |
| 3.12 End-to-End Functional Paths | Full UI-to-observability paths for primary, secondary, failure, degraded scenarios | User journeys exist, but not traced through UI/API/domain/data/external/response/observability | RED | Add E2E path traces for landing, module card, free assessment, subscribe, checkout, auth, onboarding, handoff, AI |
| 3.13 Wave-Based One-Time Build Model | Wave plan, included/excluded components, cumulative wiring, wave and regression QA | Build waves not defined for architecture completeness | RED | Define implementation wave plan and cumulative regression strategy |
| 3.14 Frontend Scaffolding and UI Wiring | Scaffold baseline, routing, state ownership, UI-to-API mapping, auth token path | Partial: target files and route strategy; missing UI-to-API and auth propagation details | RED | Add frontend scaffold, state ownership, UI/API contracts, auth token propagation |
| 3.15 Infrastructure Deployment and Provisioning | Frontend/backend targets, provisioning sequence, env checkpoints, health checks, rollback | Not addressed | RED | Define deployment/provisioning plan, health checks, rollback/redeploy strategy |
| 3.16 Edge Functions / Backend Execution Boundary | Backend execution units, registry, invocation contracts, deployment status | No ISMS edge function registry; repo contains Supabase functions elsewhere but not mapped to ISMS | RED | Create ISMS edge function registry and invocation map, or explicitly state none are used in initial wave |
| 3.17 Data Access / RLS / Tenant Isolation | Access paths, RLS policy coverage, tenant boundary, table usage audit | Mentioned as future gate only; not architecture-complete | RED | Define table-level RLS matrix, table pathway audit, schema-to-hook validation |

---

## 4. Critical Fully Functional Build Delivery Gaps

### FFD-GAP-001 — Architecture is not builder-ready

A builder would still need to make assumptions about deployment platform, environment variables, Supabase schema, auth provider, checkout provider, edge functions, AI adapter, and persistence. This fails the governance implementation-readiness test.

### FFD-GAP-002 — Wiring is incomplete

The architecture names components and routes, but does not yet define full runtime wiring between UI, route guards, context providers, Supabase, edge functions, AI, audit events, subscription entitlements, and module handoffs.

### FFD-GAP-003 — Supabase is not architecturally complete

No ISMS-specific schema, migration plan, table pathway audit, RLS matrix, or schema-to-hook validation exists for onboarding, subscription entitlement, free assessment results, handoff events, or audit events.

### FFD-GAP-004 — AI is not architecturally complete

Ask Maturion is described at a boundary level, but no adapter contract, context payload schema, prompt whitelist, model routing, failure fallback, logging policy, or permission-filtering design exists.

### FFD-GAP-005 — Edge function registry is missing

The repo contains Supabase function assets, but Stage 5 does not identify whether ISMS uses any edge functions, whether new functions are needed, or whether all invocations are registered and deployable.

### FFD-GAP-006 — QA cannot yet be written without interpretation

Stage 6 QA-to-Red can begin as a gap-exposing artifact, but the architecture does not yet allow complete RED QA to be written without assumptions.

### FFD-GAP-007 — Deployment and CI gates are not architecture-complete

Build/lint/test commands are listed, but CI workflow expectations, deployment platform, preview behavior, env validation, health checks, and rollback are not specified.

### FFD-GAP-008 — Free assessment result flow is incomplete

The public free assessment branch is identified as a required pre-subscription practical exercise, but the architecture does not yet define the exact result route, result-state persistence, subscribe/auth/onboarding handoff, or the rule preventing a public result from dead-ending into private `/assessment`.

---

## 5. Required Architecture Remediation Before Implementation Handover

The following remediation artifacts should be added before implementation handover is reconsidered:

1. `modules/isms/04-architecture/deployment-runtime-architecture.md`
2. `modules/isms/04-architecture/environment-variable-registry.md`
3. `modules/isms/04-architecture/supabase-data-architecture.md`
4. `modules/isms/04-architecture/rls-and-tenant-isolation-matrix.md`
5. `modules/isms/04-architecture/edge-function-registry.md`
6. `modules/isms/04-architecture/ai-capability-architecture.md`
7. `modules/isms/04-architecture/system-wiring-map.md`
8. `modules/isms/04-architecture/e2e-functional-paths.md`
9. `modules/isms/04-architecture/error-observability-architecture.md`
10. `modules/isms/04-architecture/implementation-wave-plan.md`

---

## 6. Recommended Gate Decision

| Decision Area | Recommendation |
|---|---|
| Stage 5 status | Keep as approved with conditions for pre-build progression only |
| Architecture completeness gate | RED / incomplete |
| Stage 6 QA-to-Red | May proceed only if it explicitly uses this RED gap analysis as input |
| PBFAG | Must not pass until architecture completeness gaps are closed or explicitly waived |
| Implementation handover | Not approved |
| CI gates | Must be inspected on PR; no merge until checks are green or unavailable checks are honestly documented and waived |

---

## 7. Conclusion

This gap analysis confirms that the previous Stage 5 reconciliation was useful, but not complete enough under the architecture canon for fully functional build delivery.

The correct next Foreman action is to remediate architecture completeness before or alongside Stage 6 QA-to-Red, and to enforce PR-based delivery with CI inspection before merge.
