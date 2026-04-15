# Scope Declaration — Wave mmm-stage6-qa-to-red-20260415

**Wave**: mmm-stage6-qa-to-red-20260415
**Issue**: maturion-isms#1384
**Branch**: copilot/fix-253484265-1108482416-7f518b23-7345-4cfd-a1c8-8403d856d34d
**Date**: 2026-04-15
**Agent**: foreman-v2-agent v6.2.0 (contract 2.12.0)
**CS2 Authorization**: maturion-isms#1384 (opened by @APGI-cmy, 2026-04-15)
**Schema**: SCOPE_DECLARATION_SCHEMA.md §5.7

---

## Wave Description

Two-scope wave authorized by CS2 (issue #1384):
- **Scope A**: Mandatory Stage 5 approval-readiness normalization — update BUILD_PROGRESS_TRACKER and related live MMM control documents so Stage 5 Architecture is cleanly represented for CS2 formal sign-off.
- **Scope B**: Stage 6 QA-to-Red — produce the full RED test suite derived from FRS + TRS + Architecture, covering all 17 Stage 2 user journeys, with QA Catalog alignment confirmed and Foreman sign-off.

---

## APPROVED_ARTIFACT_PATHS:

Scope A artifacts (Foreman governance documentation):
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` - Stage 5 approval-readiness normalization (Current Stage Summary, Governance Compliance, metadata)

Scope B artifacts (Stage 6 QA-to-Red — delegated to qa-builder):
- `modules/MMM/05-qa-to-red/qa-to-red-catalog.md` - Stage 6 primary artifact — RED test catalog with traceability to FRS, TRS, Architecture
- `modules/MMM/05-qa-to-red/journey-coverage.md` - All 17 Stage 2 user journeys mapped to RED test IDs
- `modules/MMM/05-qa-to-red/requirement-traceability.md` - FRS, TRS, and Architecture requirement-to-test traceability matrix
- `modules/MMM/05-qa-to-red/qa-catalog-alignment.md` - QA Catalog alignment confirmation
- `modules/MMM/05-qa-to-red/foreman-signoff-package.md` - Foreman sign-off package (scope, coverage map, gaps, no-implementation statement)

Wave governance artifacts (Foreman):
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Updated for Stage 6 wave
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-mmm-stage6-qa-to-red.md` - This file
- `.agent-admin/assurance/iaa-wave-record-mmm-stage6-qa-to-red-20260415.md` - IAA wave record (PRE-BRIEF + TOKEN sections)

Phase 4 ceremony artifacts:
- `.agent-workspace/foreman-v2/memory/session-mmm-stage6-qa-to-red-20260415.md` - Session memory
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-stage6-qa-to-red-20260415.md` - PREHANDOVER proof

---

## Out of Scope

This wave does NOT authorize:
- Stage 7 PBFAG execution
- Stage 8 Implementation Plan execution
- Stage 9 Builder Checklist execution
- Stage 10 IAA Pre-Brief (builder-level) execution
- Stage 11 Builder Appointment
- Stage 12 implementation/build execution
- Any live code implementation
- Any production deployment
- Any migration execution
- Any modification to `.github/agents/*.md` files

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Foreman**: foreman-v2-agent v6.2.0
