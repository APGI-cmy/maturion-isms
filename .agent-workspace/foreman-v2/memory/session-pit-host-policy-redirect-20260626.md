# Foreman Session Memory - PIT Host Policy Redirect

session_id: `session-pit-host-policy-redirect-20260626`
wave_id: `wave-pit-host-policy-redirect-20260626`
repository: `APGI-cmy/maturion-isms`
branch: `foreman/pit-host-policy-redirect-governed`
pr: `1865`
date: `2026-06-26`
foreman_role: `orchestration-governance-review`

agents_delegated_to:
  - `ui-builder` - implement PIT deployment host canonical redirect in the ISMS portal shell within the bounded host-policy scope.

## Context

PR #1861 fixed the canonical ISMS to PIT entitlement handoff loop. Production evidence then showed the remaining boundary defect: the PIT deployment host still rendered a duplicate ISMS public acquisition landing page.

This wave addresses PIT-RED-BND-007 only.

## Scope

The correction is limited to canonical host policy behavior:

- identify `maturion-pit.vercel.app` as a non-canonical PIT deployment host;
- redirect PIT deployment host requests to the canonical ISMS host equivalent;
- preserve path, query string, and hash;
- avoid altering PIT runtime functionality.

## Governance sequence

1. Scope declaration recorded.
2. IAA pre-brief recorded.
3. Builder appointment recorded for `ui-builder`.
4. `ui-builder` implementation scope limited to the host-policy files listed in the builder appointment.
5. Foreman records QP/evidence posture only and does not claim W8.2 closure.

## Boundaries preserved

- ISMS remains the canonical public acquisition host.
- PIT runtime remains canonical under the ISMS host at `/pit/tracker`.
- No Supabase, billing, payment, entitlement storage, pricing, Vercel workflow ownership, or PIT runtime behavior is changed in this wave.

## Evidence status

Implementation and evidence artifacts are included in PR #1865. Production evidence is still required after deployment before PIT-RED-BND-007 can be marked green.
