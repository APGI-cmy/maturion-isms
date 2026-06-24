# MMM TRS Addendum - ISMS Platform Boundary Linkup

Status: pre-build boundary alignment
Authority: PR #1850 and paired ISMS/MMM platform-module boundary artifacts
Date: 2026-06-24

## Authority references

- `modules/isms/prebuild-harvest-package/platform-module-boundary-linkup-strategy.md`
- `modules/MMM/04-architecture/platform-module-boundary-linkup-strategy.md`

## Technical boundary requirements

### TR-BOUNDARY-001 - Consume ISMS identity and entitlement contracts

MMM technical design must consume canonical ISMS identity, entitlement, onboarding, dashboard, and journey-state handoff contracts. MMM must not fork entitlement storage or invent its own public acquisition state model.

### TR-BOUNDARY-002 - No cross-origin local-storage proof

MMM technical design must not rely on browser local storage from a different host/origin as proof of entitlement, authentication, onboarding, or journey continuity.

### TR-BOUNDARY-003 - Module descriptor integration

MMM may provide descriptor fields such as `moduleId`, `displayName`, `marketingRoute`, `runtimeEntryRoute`, `entitlementKey`, `ownerModule`, and `hostMode`. ISMS owns rendering public cards, public routes, dashboard cards, subscription flow, and first runtime handoff.

### TR-BOUNDARY-004 - Runtime route after handoff

MMM runtime routes may be implemented only after approved ISMS handoff state is available. Eligible users must not loop back to subscription/auth/onboarding/public assessment after handoff.

### TR-BOUNDARY-005 - Module host control

If an MMM-specific host exists, it must be governed as redirect-only, deep-link-only, canonical-host-only, or explicitly approved standalone runtime. It must not expose an unmanaged public acquisition shell.

### TR-BOUNDARY-006 - Cross-module implementation prohibition

MMM technical implementation must not change ISMS, PIT, Risk Management, RADAM / Systems Integration, or other module runtime unless CS2 explicitly authorizes a cross-module appointment.
