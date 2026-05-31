# ISMS Stage 7 — PBFAG Remediation Plan

| Field | Value |
|---|---|
| Product | ISMS |
| Artifact | PBFAG Remediation Plan |
| Stage | Stage 7 |
| Wave | `isms-stage7-pbfag-20260530` |
| Status | ACTIVE — Required before Stage 8 implementation planning |

---

## 1. Purpose

The PBFAG gate failed implementation handover because the pre-build package does not yet support fully functional delivery without builder assumptions.

This remediation plan defines the architecture completion work required before Stage 8 Implementation Plan can responsibly proceed.

---

## 2. Remediation Work Packages

| Package | Artifact | Purpose | Blocks Stage 8? |
|---|---|---|---|
| R-01 | `deployment-runtime-architecture.md` | Define deployment target, runtime entrypoints, build output, static assets, provisioning, rollback | Yes |
| R-02 | `environment-variable-registry.md` | Define env vars, `.env.example` obligations, public/secret classification, validation | Yes |
| R-03 | `supabase-data-architecture.md` | Define persistence model for onboarding, entitlements, free assessment, handoff, audit | Yes if persistence is used |
| R-04 | `rls-and-tenant-isolation-matrix.md` | Define table-level RLS/CRUD/tenant boundary rules | Yes if persistence is used |
| R-05 | `edge-function-registry.md` | Define whether ISMS uses edge functions and map invocations/contracts | Yes |
| R-06 | `ai-capability-architecture.md` | Define Ask Maturion adapter, prompt contracts, context payload, permission filter, fallback | Yes |
| R-07 | `system-wiring-map.md` | Define UI/routes/context/auth/Supabase/AI/audit/checkout/module handoff wiring | Yes |
| R-08 | `e2e-functional-paths.md` | Trace primary/failure/degraded paths end-to-end | Yes |
| R-09 | `error-observability-architecture.md` | Define error taxonomy, logging, monitoring, health checks, redaction, degraded mode | Yes |
| R-10 | `implementation-wave-plan.md` | Define build waves, isolated QA, cumulative regression, no future wiring handoff | Yes |

---

## 3. Remediation Acceptance Criteria

Architecture remediation is sufficient only when:

- every remediation artifact exists;
- each artifact maps back to Stage 6 RED tests;
- the architecture completeness gap analysis can be updated from RED to GREEN or waived item-by-item;
- PBFAG can be rerun with no unresolved builder assumptions;
- implementation handover remains blocked until later stages are also complete.

---

## 4. Recommended Next Branch

Recommended next PR branch:

```text
foreman/stage7-architecture-remediation
```

Recommended PR title:

```text
Remediate ISMS architecture completeness blockers
```

---

## 5. Gate Position

Stage 7 PBFAG does not authorize Stage 8 Implementation Plan yet.

It authorizes architecture remediation work only.
