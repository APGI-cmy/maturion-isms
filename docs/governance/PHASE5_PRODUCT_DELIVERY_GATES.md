# Phase 5 Product Delivery Gates

This document describes the hard-gate logic enforced by:

- `.github/scripts/validate-product-delivery-gates.sh`
- `.github/workflows/preflight-evidence-gate.yml` (`preflight/product-delivery-gates`)

## Product-facing classifier

A PR is treated as product-facing when it changes one or more of:

- `apps/**`, `modules/MMM/**`, `packages/**` product code paths
- frontend/runtime code files (`.ts/.tsx/.js/.jsx`) in app/page/component/route/api locations
- `supabase/functions/**`
- explicit PR body formal claim markers (see below)

### Formal claim markers (always trigger product-facing classification)

These explicit structured fields trigger classification regardless of diff content:
- `Functional-Delivery-Artifact: <path>`
- `FUNCTIONAL_PASS: yes`
- `VERDICT: FULL_FUNCTIONAL_DELIVERY`
- `VERDICT: PARTIAL_FUNCTIONAL_DELIVERY`
- `FULL_FUNCTIONAL_DELIVERY_VERDICT: FULL_FUNCTIONAL_DELIVERY`
- `FULL_FUNCTIONAL_DELIVERY_VERDICT: PARTIAL_FUNCTIONAL_DELIVERY`

### Narrative hint patterns (suppressed for governance-controlled PRs)

For PRs whose diff is **entirely governance-controlled paths** (`governance/canon/**`,
`governance/templates/**`, `.agent-workspace/independent-assurance-agent/**`), the
following narrative patterns do **not** trigger product-facing classification, because
governance PRs routinely discuss these concepts as context without making actual delivery
assertions:

- `functional delivery` (prose phrase)
- `handover readiness` / `ready for handover`
- `product fix`
- standalone `PARTIAL_FUNCTIONAL_DELIVERY`
- `Pass/fail result: pass`

If a governance PR includes these phrases as part of explaining governance rules or
historical context (e.g. `PR #1590 exposed a gap in the functional delivery workflow`),
this will **not** cause product delivery evidence to be required.

Governance-only PRs remain subject to ECAP/IAA/canon-inventory exactness gates. See
`preflight/affected-control-classifier` for the pre-alert classification.

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
