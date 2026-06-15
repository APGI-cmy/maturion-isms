# ISMS W8 Cumulative QA Report

| Field | Value |
|---|---|
| Wave | W8 — Cumulative Regression and PBFAG Rerun |
| Branch | `foreman/isms-w8-cumulative-regression-pbfag` |
| Status | IMPLEMENTED ON BRANCH — PR/CI PENDING |
| Date | 2026-06-11 |

---

## 1. Purpose

This report reconciles W1-W7 evidence for cumulative W8 assessment. W8 is an evidence, regression, and gate-readiness wave. It does not introduce new runtime product functionality.

---

## 2. Prior wave status

| Wave | Scope | Merge evidence | Cumulative QA disposition |
|---|---|---|---|
| W1 | Route registry, public shell, redirects | PR #1776 + correction PR #1779 | Accepted for appointed W1 scope. |
| W2 | Free assessment result flow | PR #1781 | Accepted for appointed W2 scope. |
| W3 | Subscribe, checkout mock, auth, onboarding | PR #1783 | Accepted for appointed W3 scope. |
| W4 | Shared context, entitlement, MMM handoff | PR #1786 | Accepted for appointed W4 scope. |
| W5 | Ask Maturion adapter | PR #1789 | Accepted for appointed W5 scope. |
| W6 | Backend boundary, schema/RLS, audit boundary | PR #1792 | Accepted for appointed W6 scope. |
| W7 | Deployment, runtime, env, CI hardening | PR #1796 | Accepted for appointed W7 scope after merge verification. |

---

## 3. Cumulative RED-to-GREEN mapping

| Domain | Requirement | Evidence disposition |
|---|---|---|
| D1/D2 — Routing/public shell | Public routes, redirects, protected placeholders | W1/W1 correction evidence and later route verification retained. |
| D3 — Free assessment | Public assessment, scoring, report and conversion path | W2 evidence accepted; no W3-W7 change invalidated W2 route. |
| D4 — Subscribe/auth/onboarding | Subscribe, mock checkout, mock auth, onboarding context | W3 evidence accepted; W4-W7 preserve protected-route posture. |
| D5 — Context/entitlement/handoff | Shared context, entitlement checks, maturity setup handoff | W4 evidence accepted; W6 registered future persistence boundary only. |
| D6 — Ask Maturion adapter | Educational public prompts, filtered private context, fallback | W5 evidence accepted; no live provider introduced. |
| D7 — Backend boundary | Edge/backend registry and no unregistered invocation decision | W6 evidence accepted; W7 did not add backend calls. |
| D8 — Schema/RLS | Persistence schema and RLS policies | W6 evidence accepted after RLS hardening. |
| D9 — Audit boundary | Audit table/boundary and no premature writer invocation | W6 evidence accepted; audit writer invocation remains future-gated. |
| D10 — Deployment/runtime/env | Deployment target, SPA fallback, env posture, route verification | W7 evidence accepted; no live deployment claim unless external deployment status confirms. |
| D11 — Cumulative regression/PBFAG | Prior wave QA, completeness/waivers, final readiness decision | This W8 report and PBFAG amendment provide D11 evidence. |

---

## 4. Architecture completeness and waiver disposition

| Area | Status | Disposition |
|---|---|---|
| Public discovery and marketing routes | Complete for W1 scope | Accepted. |
| Free assessment and report | Complete for W2 scope | Accepted as indicative/public marketing report, not formal audit. |
| Subscribe/checkout/auth/onboarding | Complete for W3 scope | Accepted as mock/non-production flow. |
| Entitlement/private handoff | Complete for W4 scope | Accepted as local mock entitlement/handoff surface. |
| Ask Maturion | Complete for W5 scope | Accepted as deterministic local adapter; live provider deferred. |
| Persistence/RLS/audit | Complete for W6 boundary scope | Accepted as schema/RLS/audit boundary; runtime writes deferred. |
| Deployment/runtime hardening | Complete for W7 scope | Accepted as config/runbook/route verification; live deployment status remains external evidence. |
| Production auth/payment | Not implemented | Future-gated; not required for W1-W8 appointed scope. |
| Live AI provider integration | Not implemented | Future-gated; W5 deliberately deterministic. |
| Runtime Supabase writes/audit writer | Not implemented | Future-gated beyond W6 boundary scope. |
| Implementation handover | Not authorized by W8 alone | Requires explicit owner decision after W8 gate review. |

---

## 5. Cumulative risk notes

- The ISMS product is now coherent as a staged public-to-protected journey with governed mock/non-production boundaries.
- Production-grade auth, payment, live AI, runtime persistence, and audit writer behavior remain future-gated and must not be implied by W8.
- W7 deployment configuration selects Vercel and hardens SPA routing, but external deployment preview/live evidence should be attached when available.
- The final handover decision should be explicit, not automatic.

---

## 6. W8 recommendation

W8 can recommend that W1-W7 are accepted for their appointed scopes, subject to PR #1796 merge verification and W8 PR checks/review disposition.

Implementation transfer/handover can be recommended only with the limitations listed above and only if the owner explicitly accepts those limitations.
