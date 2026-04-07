# Wave Current Tasks — foreman-v2-agent

**Wave ID**: mmm-deploy-retention-rule
**Issue**: #1279
**Branch**: copilot/add-deployment-workflow-retention
**Date**: 2026-04-07
**Authorized by**: CS2 (@APGI-cmy) — opened issue #1279 directly
**IAA Category**: PRE_BUILD_STAGE_MODEL
**iaa_prebrief_path**: .agent-admin/assurance/iaa-prebrief-mmm-deploy-retention-rule.md

---

## Wave Summary

Add explicit deployment workflow retention and retargeting rules to the MMM App Description.

## Wave Scope

| File | Change |
|------|--------|
| `modules/MMM/00-app-description/MMM_app_description.md` | Add §30.4 (Deployment Workflow Retention and Retargeting), amend §39P, amend §39R |

## Task Breakdown

| Task ID | Description | Assigned To | Status |
|---------|-------------|-------------|--------|
| T-MMM-1279-001 | Add deployment workflow retention and retargeting rule to MMM App Description | mat-specialist | PENDING |

## Pre-Build Gates Status

| Gate | Stage | Status | Notes |
|------|-------|--------|-------|
| App Description | Stage 1 | THIS WAVE | Creating Stage 1 content |
| Architecture | Stage 5 | DEFERRED | Not yet applicable |
| QA-to-Red | Stage 6 | DEFERRED | No executable deliverables |
| PBFAG | Stage 7 | DEFERRED | Not yet applicable |
| Implementation Plan | Stage 8 | DEFERRED | Not yet applicable |
| Builder Checklist | Stage 9 | DEFERRED | Not yet applicable |
| IAA Pre-Brief | Stage 10 | COMPLETE | iaa-prebrief-mmm-deploy-retention-rule.md |

## Evidence Requirements at Handover

Per IAA Pre-Brief:
- PREHANDOVER proof with Change-Propagation Audit (OVL-PBG-014)
- SCOPE_DECLARATION.md matching this PR's files only
- IAA token from handover invocation

## Active FFA Checks (Blocking)

- OVL-PBG-014: Change-Propagation Audit — MANDATORY in PREHANDOVER proof
- OVL-INJ-001: Pre-Brief artifact exists — SATISFIED
- A-021: All PR artifacts committed before IAA invocation
- A-026/A-028: SCOPE_DECLARATION.md matches this wave only
