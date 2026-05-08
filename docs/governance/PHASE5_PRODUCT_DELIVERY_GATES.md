# Phase 5 Product Delivery Gates

This document describes the hard-gate logic enforced by:

- `.github/scripts/validate-product-delivery-gates.sh`
- `.github/workflows/preflight-evidence-gate.yml` (`preflight/product-delivery-gates`)

## Product-facing classifier

A PR is treated as product-facing when it changes one or more of:

- `apps/**`, `modules/MMM/**`, `packages/**` product code paths
- frontend/runtime code files (`.ts/.tsx/.js/.jsx`) in app/page/component/route/api locations
- `supabase/functions/**`
- markdown files that claim product delivery outcomes (e.g., full functional delivery / functional PASS claims)

Governance-only or admin-only PRs are not classified as product-facing unless they assert product-delivery completion claims.

## Enforced gates

1. **No Dead CTA Gate** — CTA/action patterns require CTA/API mapping evidence.
2. **No Invented Endpoint Gate** — guarded `/api/...` routes require implementation + test + mapping/approval proof.
3. **Functional Delivery Evidence Gate** — requires complete `.functional-delivery/pr-<number>.md` (or approved equivalent).
4. **IAA Functional Verdict Gate** — product-facing assurance must include split fields:
   - `ADMIN_PASS`
   - `FUNCTIONAL_PASS`
   - `VERDICT` (alias accepted: `FULL_FUNCTIONAL_DELIVERY_VERDICT`)
5. **Placeholder Honesty Gate** — blocks functional-pass/full-delivery claims when placeholder/incomplete language remains unless explicit CS2-approved partial scope is declared.

## Evidence template

Use `.functional-delivery/pr-template.md` as the standard artifact template.
