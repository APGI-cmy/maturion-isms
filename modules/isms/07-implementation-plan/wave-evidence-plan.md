# ISMS Stage 8 — Wave Evidence Plan

| Field | Value |
|---|---|
| Product | ISMS |
| Artifact | Wave Evidence Plan |
| Stage | Stage 8 |
| Version | v0.1.0 |
| Wave | `isms-stage8-implementation-plan-20260601` |
| Status | DRAFT — Planning artifact only |

---

## 1. Purpose

This evidence plan defines what each future implementation wave must produce before Foreman can recommend handover.

It does not run tests or approve implementation execution.

---

## 2. Standard Evidence Pack Per Implementation Wave

Each wave must include:

| Evidence | Requirement |
|---|---|
| Scope declaration | Bound the wave and list files/components in scope |
| Builder appointment | Appoint builder with constraints and acceptance criteria |
| RED-to-GREEN mapping | Map Stage 6 RED tests to implemented scope |
| Route/wiring evidence | Demonstrate changed routes and CTAs are wired |
| Build evidence | Include `npm run build` result for `apps/isms-portal` or approved equivalent |
| Lint evidence | Include `npm run lint` result for `apps/isms-portal` or approved equivalent |
| Test evidence | Include `npm run test:run` result or wave-specific test command |
| CI evidence | Inspect PR checks before merge recommendation |
| Foreman QP | Verify scope, wiring, tests, and evidence |
| IAA record | Independent review of wave evidence |
| PR review status | Resolve useful Copilot/Codex review comments |

---

## 3. Wave Evidence Matrix

| Wave | Must Prove | Stage 6 QA Domains |
|---|---|---|
| W1 | Public routes, module cards, redirects, protected placeholders | D1, D2 |
| W2 | Free assessment answer flow, result state, no private dead-end | D3 |
| W3 | Subscribe, checkout mock, auth, onboarding transitions | D4 |
| W4 | Shared context, entitlements, MMM handoff, protected module routes | D5 |
| W5 | Ask Maturion adapter, prompt seeds, context filtering, fallback | D6 |
| W6 | Schema/RLS/audit/env alignment or explicit no-persistence waiver | D8, D9 |
| W7 | Deployment/env/CI hardening and route verification | D10 |
| W8 | Cumulative regression, architecture completeness update, PBFAG rerun | D11 + D1-D10 |

---

## 4. CI Honesty Rule

A wave may not claim CI is passing unless the PR head checks have been inspected and are green or explicitly waived.

Documentation-only PRs must not claim runtime build, lint, or test success unless those commands were actually run.

---

## 5. Handover Rule

No wave handover is allowed when:

- mapped RED tests remain unaddressed without waiver;
- route wiring is incomplete;
- implementation includes placeholders but claims full delivery;
- build/lint/test/CI evidence is missing;
- Copilot/Codex review conversations remain unresolved;
- implementation scope expands beyond the builder appointment.

---

## 6. Stage 8 Disposition

This evidence plan is sufficient for Stage 9 Builder Checklist preparation once the Stage 8 PR is approved and merged.
