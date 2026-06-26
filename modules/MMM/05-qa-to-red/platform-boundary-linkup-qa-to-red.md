# MMM/ISMS Boundary Linkup QA-to-Red

Status: QA-to-red boundary alignment
Authority: PR #1850 and paired ISMS/MMM platform-module boundary artifacts
Date: 2026-06-24

## Purpose

This QA-to-red artifact aligns MMM linkup testing obligations to the shared ISMS/platform module boundary strategy before implementation.

No runtime implementation is authorized by this artifact.

## Red tests required before build

### T-MMM-BOUNDARY-001 - ISMS public landing owns MMM entry

Given the ISMS public landing or modules overview renders MMM-related entry points,
when a user selects Maturity Roadmap or free assessment,
then the entry must route through the ISMS-owned public route or approved assessment entry.

### T-MMM-BOUNDARY-002 - Free assessment remains ISMS-owned acquisition surface

Given a public free-assessment entry exists,
then MMM must not claim ownership of the public acquisition/trust surface unless CS2 explicitly delegates it.

### T-MMM-BOUNDARY-003 - Subscription/auth/onboarding/dashboard state preserved

Given an MMM handoff requires subscription, authentication, onboarding, or dashboard entitlement state,
then those states must be preserved through the ISMS-owned journey before MMM runtime opens.

### T-MMM-BOUNDARY-004 - Dashboard or approved handoff shows MMM journey state

Given a user has completed the ISMS-owned subscription/authentication/onboarding path required for MMM,
when they reach the dashboard or approved handoff surface,
then the expected MMM journey, entitlement, or handoff state must be visible before MMM runtime opens.

### T-MMM-BOUNDARY-005 - Eligible users reach MMM runtime without loopback

Given an eligible user completes the approved ISMS handoff,
when they open MMM runtime/workflow,
then they must not be unexpectedly returned to subscription, authentication, onboarding, dashboard setup, or public assessment.

### T-MMM-BOUNDARY-006 - Non-entitled or ineligible users route predictably to ISMS-owned surfaces

Given a non-entitled or ineligible user attempts to open MMM runtime or an MMM runtime deep link,
then they must be redirected predictably to the ISMS-owned acquisition, subscription, authentication, onboarding, or dashboard surface appropriate to their state.

### T-MMM-BOUNDARY-007 - MMM host does not duplicate public acquisition loop

Given an MMM-specific host exists,
when public root or acquisition routes are opened,
then the host must redirect to the canonical ISMS host, expose only approved deep links, or follow another CS2-approved host model.

### T-MMM-BOUNDARY-008 - No cross-origin local-storage continuity assumption

Given ISMS and MMM are on different origins,
then tests must not use browser local storage on one origin as proof of entitlement or journey continuity on another origin.

### T-MMM-BOUNDARY-009 - MMM runtime does not alter other module routes

Given MMM runtime/linkup work is implemented,
then PIT, Risk Management, RADAM / Systems Integration, and other module routes must remain unchanged unless a cross-module appointment authorizes the change.

### T-MMM-BOUNDARY-010 - MMM does not become ISMS platform shell

Given MMM linkup or deployment changes are made,
then MMM must not own or duplicate ISMS public landing, modules overview, marketing, subscription, auth, onboarding, dashboard, or entitlement handoff.

## Non-goals

This artifact does not implement routes, UI, entitlement, auth, dashboard, onboarding, or runtime navigation. It defines tests that must exist before future build-to-green linkup work.
