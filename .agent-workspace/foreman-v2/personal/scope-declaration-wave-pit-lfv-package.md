# Scope Declaration — Wave pit-lfv-package-20260512

<!-- Authority: Foreman v2 Phase 2 Step 2.7 | HALT-008 guard -->

| Field | Value |
|-------|-------|
| Wave ID | pit-lfv-package-20260512 |
| PR | #1624 |
| Issue | maturion-isms#1619 |
| Date | 2026-05-12 |
| Author | foreman-v2-agent |

## Approved Artifact Paths

All agent-created files in this wave must match a path in this list. Undeclared paths are blocked by CI governance-artifact-gate.

```
approved_artifact_paths:
  - .admin/prs/pr-1624.json
  - .agent-admin/assurance/iaa-wave-record-pit-lfv-package-20260512-20260512.md
  - .agent-admin/scope-declarations/pr-1624.md
  - .agent-admin/prehandover/proof-pr-1624-pit-lfv-package-20260512.md
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-pit-lfv-package.md
  - modules/pit/05-live-functional-verification/01_FUNCTIONAL_USER_JOURNEY_CONTRACT.md
  - modules/pit/05-live-functional-verification/02_AGENT_ACCESS_MATRIX.md
  - modules/pit/05-live-functional-verification/03_DEPLOYED_VERIFICATION_PLAN.md
  - modules/pit/05-live-functional-verification/04_CTA_BACKEND_STATE_MAP.md
  - modules/pit/05-live-functional-verification/05_TEST_IDENTITY_AND_ROLE_MATRIX.md
  - modules/pit/05-live-functional-verification/06_LIVE_VERIFICATION_WORKFLOW_SPEC.md
  - modules/pit/05-live-functional-verification/07_DASHBOARD_STATE_REFLECTION_GATE.md
  - modules/pit/05-live-functional-verification/08_HANDOVER_EVIDENCE_REQUIREMENTS.md
  - modules/pit/05-live-functional-verification/09_CS2_UI_ACCEPTANCE_CHECKLIST.md
  - modules/pit/05-live-functional-verification/pit-live-verification-workflow.yml
  - modules/pit/BUILD_PROGRESS_TRACKER.md
```

## Out-of-Scope Hard Boundaries

- No application source code (apps/, packages/, src/)
- No active CI workflow files (.github/workflows/)
- No database migrations (supabase/)
- No agent contract files (.github/agents/)
- No build authorization
- No builder appointment
- No Stage 6, 7, 8, 9, 10, 11, or 12 work
