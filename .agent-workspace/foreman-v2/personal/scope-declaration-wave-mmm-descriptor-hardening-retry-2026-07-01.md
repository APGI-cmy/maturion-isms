# SCOPE DECLARATION — wave-mmm-descriptor-hardening-retry-2026-07-01

**Agent**: foreman-v2-agent (orchestration-only, no implementation)  
**Wave**: wave-mmm-descriptor-hardening-retry-2026-07-01  
**Branch**: apgi-cmy-fix-descriptor-gerund-normalization  
**Issue**: #1883  
**Date**: 2026-07-01  
**Authority**: Foreman Tier 1 v6.3.0 + Tier 2 prebuild sequence

## In Scope (Prebuild Only)

- Wave preflight and lock-state artifact updates
- Canonical pre-brief invocation preparation/binding
- Scope and builder-appointment governance artifacts
- QA-to-Red acceptance criteria definition for retry slice
- Delegation-order reference preparation (no implementation commit evidence yet)

## Explicitly Out of Scope

- Product/runtime code changes
- Test implementation changes
- CI/workflow logic changes
- IAA final assurance, ECAP final bundle, or merge-readiness claims
- Any `.github/agents/*.md` changes

## Expected Build Surfaces for Builder (not executed by Foreman)

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

