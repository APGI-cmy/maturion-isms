# IAA Wave Record - PIT Host Policy Redirect

Wave: `wave-pit-host-policy-redirect-20260626`
Date: 2026-06-26
Repository: `APGI-cmy/maturion-isms`
Scope record: `.agent-admin/scope-declarations/wave-pit-host-policy-redirect-20260626.md`

## PRE-BRIEF

Schema version: `1.0.0`

Issue: PIT deployment host duplicates the ISMS public acquisition surface.

Branch: `foreman/pit-host-policy-redirect-governed`

Qualifying task:

- Implement canonical-host redirect for the PIT deployment host.

Required build gates:

- Builder Delegation Order Gate
- POLC Boundary Validation
- Routing Governance Check

Expected QA scope:

- PIT deployment host redirects to the canonical ISMS host.
- Canonical ISMS host does not redirect away from itself.
- Path, query string, and hash are preserved during host redirect.

High-risk failure modes:

- PIT deployment host continues rendering duplicate ISMS landing.
- Canonical ISMS host accidentally redirects or loops.
- Runtime deep links lose path or query string during redirect.

Required builder evidence:

- Diff limited to declared host-policy files and evidence.
- Regression tests cover host detection and canonical URL creation.

Required Foreman/QP checks:

- Verify no PIT runtime implementation.
- Verify PIT-RED-BND-007 is addressed by host policy, not entitlement changes.

ECAP required: no.

Final IAA focus:

- Boundary discipline and host policy evidence.

Result: `PREFLIGHT_BRIEF_COMPLETE`

## FINAL ASSURANCE

PENDING.
