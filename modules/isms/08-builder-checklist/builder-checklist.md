# ISMS Stage 9 — Builder Checklist

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact | Builder Checklist |
| Stage | Stage 9 |
| Version | v0.1.0 |
| Wave | `isms-stage9-builder-checklist-20260601` |
| Status | COMPLETE — Checklist artifact only |

---

## 1. Purpose

This checklist translates the Stage 8 Implementation Plan into builder-ready controls.

It does not appoint implementation builders, authorize runtime implementation, or approve implementation handover.

---

## 2. Builder Pre-Start Checklist

Before any implementation wave starts, the builder must confirm:

| ID | Required confirmation | Done |
|---|---|---|
| B-PRE-001 | Read `modules/isms/00-app-description/ISMS_app_description.md` | [ ] |
| B-PRE-002 | Read `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` | [ ] |
| B-PRE-003 | Read `modules/isms/02-frs/functional-requirements.md` | [ ] |
| B-PRE-004 | Read `modules/isms/03-trs/technical-requirements-specification.md` | [ ] |
| B-PRE-005 | Read `modules/isms/04-architecture/architecture-reconciliation-stage5.md` | [ ] |
| B-PRE-006 | Read `modules/isms/04-architecture/architecture-remediation-pack.md` | [ ] |
| B-PRE-007 | Read `modules/isms/05-qa-to-red/qa-to-red-catalog.md` | [ ] |
| B-PRE-008 | Read `modules/isms/06-pbfag/pbfag-amendment-architecture-remediation-acceptance.md` | [ ] |
| B-PRE-009 | Read `modules/isms/07-implementation-plan/implementation-plan.md` | [ ] |
| B-PRE-010 | Read `modules/isms/07-implementation-plan/wave-evidence-plan.md` | [ ] |
| B-PRE-011 | Confirm implementation scope is limited to the appointed wave | [ ] |
| B-PRE-012 | Confirm no runtime work starts without wave-specific builder appointment | [ ] |

---

## 3. Global Builder Invariants

These apply to every future implementation wave.

| ID | Invariant |
|---|---|
| B-INV-001 | Public routes must remain public unless explicitly changed by approved architecture. |
| B-INV-002 | Private routes must require auth and entitlement where applicable. |
| B-INV-003 | No module card may route directly to private module execution from public marketing. |
| B-INV-004 | Free assessment must not dead-end into private `/assessment`. |
| B-INV-005 | Legacy source may be harvested/read but not modified unless explicitly authorized. |
| B-INV-006 | No wave may claim future wiring as complete. |
| B-INV-007 | No direct AI provider integration may bypass the approved Ask Maturion adapter boundary. |
| B-INV-008 | No Supabase persistence may be introduced without schema/RLS review or explicit no-persistence waiver. |
| B-INV-009 | No edge/backend function invocation may exist without registry entry or explicit no-function decision. |
| B-INV-010 | No implementation wave may merge while required PR checks or useful review conversations remain unresolved. |
| B-INV-011 | Documentation-only work must not claim runtime build/test/deploy success unless actually verified. |
| B-INV-012 | Implementation handover remains blocked until later gates authorize it. |

---

## 4. Wave Builder Checklists

## W1 — Route Registry, Public Pages, Redirects

| ID | Builder requirement | Done |
|---|---|---|
| W1-001 | Create or validate central route constants. | [ ] |
| W1-002 | Wire public routes for landing, modules, journey, free assessment, subscribe, auth, and marketing pages. | [ ] |
| W1-003 | Ensure private route placeholders are protected. | [ ] |
| W1-004 | Implement legacy marketing redirects to canonical `/marketing/*` routes. | [ ] |
| W1-005 | Use shared module-card configuration for landing and modules overview. | [ ] |
| W1-006 | Verify module cards route to public marketing pages only. | [ ] |
| W1-007 | Map implementation to Stage 6 D1 and D2 RED tests. | [ ] |
| W1-008 | Capture build, lint, test, and CI evidence. | [ ] |

## W2 — Free Assessment Result Flow

| ID | Builder requirement | Done |
|---|---|---|
| W2-001 | Implement public free assessment entry. | [ ] |
| W2-002 | Capture high-level responses. | [ ] |
| W2-003 | Compute indicative maturity baseline. | [ ] |
| W2-004 | Render result state with conversion path. | [ ] |
| W2-005 | Prevent public result dead-end into private `/assessment`. | [ ] |
| W2-006 | Preserve or explicitly handle refresh/back navigation state. | [ ] |
| W2-007 | Map implementation to Stage 6 D3 RED tests. | [ ] |
| W2-008 | Capture build, lint, test, and CI evidence. | [ ] |

## W3 — Subscribe, Checkout Mock, Auth, Onboarding

| ID | Builder requirement | Done |
|---|---|---|
| W3-001 | Implement subscribe page with package options. | [ ] |
| W3-002 | Accept optional source journey context. | [ ] |
| W3-003 | Implement checkout mock or provider placeholder with explicit non-production status. | [ ] |
| W3-004 | Route unauthenticated checkout success to auth. | [ ] |
| W3-005 | Route authenticated checkout success to onboarding. | [ ] |
| W3-006 | Implement onboarding shell and required fields. | [ ] |
| W3-007 | Validate required onboarding fields. | [ ] |
| W3-008 | Map implementation to Stage 6 D4 RED tests. | [ ] |
| W3-009 | Capture build, lint, test, and CI evidence. | [ ] |

## W4 — Shared Context, Entitlement, MMM Handoff

| ID | Builder requirement | Done |
|---|---|---|
| W4-001 | Implement shared ISMS context provider/hook. | [ ] |
| W4-002 | Implement entitlement checks for private module access. | [ ] |
| W4-003 | Route unsubscribed module access to explanation/upgrade path. | [ ] |
| W4-004 | Implement MMM handoff payload to `/maturity/setup`. | [ ] |
| W4-005 | Reserve/protect future PIT, Risk, Incidents, Analytics, Integrations, and Skills routes. | [ ] |
| W4-006 | Emit or prepare handoff audit event hook. | [ ] |
| W4-007 | Map implementation to Stage 6 D5 RED tests. | [ ] |
| W4-008 | Capture build, lint, test, and CI evidence. | [ ] |

## W5 — Ask Maturion Adapter

| ID | Builder requirement | Done |
|---|---|---|
| W5-001 | Implement Ask Maturion adapter boundary. | [ ] |
| W5-002 | Enforce public educational prompt contract. | [ ] |
| W5-003 | Enforce authenticated filtered-context contract. | [ ] |
| W5-004 | Ensure AI cannot bypass route guards or entitlements. | [ ] |
| W5-005 | Add non-blocking AI fallback behavior. | [ ] |
| W5-006 | Add module card prompt seeds or explicit deferred markers. | [ ] |
| W5-007 | Map implementation to Stage 6 D6 RED tests. | [ ] |
| W5-008 | Capture build, lint, test, and CI evidence. | [ ] |

## W6 — Backend Boundary, Persistence, Schema/RLS, Audit

| ID | Builder requirement | Done |
|---|---|---|
| W6-001 | Create or update edge/backend function registry. | [ ] |
| W6-002 | Record explicit no-edge-function decisions where no function is used. | [ ] |
| W6-003 | Define Supabase schema or explicit no-persistence waiver. | [ ] |
| W6-004 | Add migrations where persistence is used. | [ ] |
| W6-005 | Define RLS and tenant isolation policies where persistence is used. | [ ] |
| W6-006 | Create schema-to-hook validation evidence. | [ ] |
| W6-007 | Implement audit writer or explicit non-production stub. | [ ] |
| W6-008 | Update `.env.example` and environment registry as needed. | [ ] |
| W6-009 | Map implementation to Stage 6 D7, D8, and D9 RED tests. | [ ] |
| W6-010 | Capture build, lint, test, and CI evidence. | [ ] |

## W7 — Deployment, Runtime, Env, CI Hardening

| ID | Builder requirement | Done |
|---|---|---|
| W7-001 | Confirm MMM Vercel deployment remains passing. | [ ] |
| W7-002 | Configure or create ISMS Vercel deployment path. | [ ] |
| W7-003 | Confirm ISMS Vercel project uses monorepo pnpm install settings. | [ ] |
| W7-004 | Decide whether ISMS needs a GitHub deployment workflow or Vercel project auto-deploy is sufficient. | [ ] |
| W7-005 | Verify Vercel install reaches build step. | [ ] |
| W7-006 | Verify `pnpm --filter isms-portal build` result. | [ ] |
| W7-007 | Record deployment URL or failure evidence. | [ ] |
| W7-008 | Map implementation to Stage 6 D10 RED tests. | [ ] |
| W7-009 | Capture build, lint, test, and CI evidence. | [ ] |

## W8 — Cumulative Regression and PBFAG Rerun

| ID | Builder requirement | Done |
|---|---|---|
| W8-001 | Run all prior wave QA evidence checks. | [ ] |
| W8-002 | Update architecture completeness status or waivers. | [ ] |
| W8-003 | Rerun or amend PBFAG after implementation evidence. | [ ] |
| W8-004 | Confirm Stage 9 checklist items are completed or explicitly waived. | [ ] |
| W8-005 | Confirm future handover gates remain blocked until authorized. | [ ] |
| W8-006 | Map implementation to Stage 6 D11 and cumulative D1-D10 RED tests. | [ ] |
| W8-007 | Capture build, lint, test, and CI evidence. | [ ] |

---

## 5. Standard Evidence Required for Every Wave

| ID | Evidence | Required |
|---|---|---|
| B-EV-001 | Scope declaration for wave | yes |
| B-EV-002 | Builder appointment for wave | yes |
| B-EV-003 | RED-to-GREEN mapping for affected QA tests | yes |
| B-EV-004 | Route/wiring evidence | when routes/wiring are touched |
| B-EV-005 | Build evidence | yes |
| B-EV-006 | Lint evidence | yes |
| B-EV-007 | Test evidence | yes |
| B-EV-008 | CI status inspection | yes |
| B-EV-009 | Foreman QP | yes |
| B-EV-010 | IAA wave record/token | yes |
| B-EV-011 | Copilot/Codex review disposition | yes |
| B-EV-012 | Vercel/deployment evidence | W7 and any deployment-affecting wave |

---

## 6. Vercel Deployment Checkpoint

Current deployment state entering Stage 9:

| Deployment | Status |
|---|---|
| MMM Vercel deployment | Passing after monorepo config cleanup |
| ISMS Vercel deployment | No GitHub deployment workflow yet; manual Vercel project settings prepared |

Builder must not treat ISMS deployment as verified until the ISMS Vercel project or workflow produces passing evidence.

---

## 7. Stage 9 Disposition

This checklist is sufficient for Stage 10 IAA Pre-Brief preparation after PR approval and CI pass.

It does not authorize implementation execution or implementation handover.
