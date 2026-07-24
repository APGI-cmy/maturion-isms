# Builder Appointment — MMM Approval Workflow Foundation QA-to-RED

**Issue:** #1961  
**Wave:** `mmm-approval-workflow-foundation-qa-red`  
**Appointed role:** QA Builder  
**Date:** 2026-07-23

## Upstream authority

- FRS addendum commit: `7ba38474082bf0d3e8d054f45127cc3549a3165a`
- IAA pre-brief commit: `0ace85a0ccce08cc4d68c15cb8792125b31c9063`

This appointment exists before any executable QA-to-RED implementation commit.

## Authorised work

1. Create the QA trace specification for T-MMM-AWF-001 through T-MMM-AWF-018.
2. Add executable tests that fail deterministically because the production approval foundation is incomplete.
3. Inspect existing schema, Edge Functions and UI only to define current gaps.
4. Add no production approval implementation in this wave.
5. Preserve descriptor runtime and unrelated module boundaries.

## Authorised files

- `modules/MMM/05-qa-to-red/approval-workflow-foundation-qa-to-red.md`
- focused tests under `modules/MMM/tests/`
- test-only fixtures/helpers under `modules/MMM/tests/` where necessary
- issue/PR evidence comments

## Prohibited files and actions

- production migrations, Edge Functions or UI changes;
- `.github/agents/` modifications;
- ISMS Portal, PIT or unrelated module code;
- weakened RLS, service-role browser access or skipped security assertions;
- fabricated green evidence.

## Handover requirements

The QA Builder must report exact test commands, deterministic expected failures, red-state classification, changed-file boundary and explicit non-scope confirmation. Build-to-green authority remains withheld until this QA wave is reviewed and merged.
