# Wave Current Tasks — PR #1747

Wave: mmm-guided-workflow-legacy-handoff-remediation
PR: #1747
Issue: #1731
Branch: fix/mmm-guided-workflow-legacy-handoff
Date: 2026-05-28

iaa_wave_record_path: .agent-admin/assurance/iaa-prebrief-pr1747.md
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-pr1747.md
agents_delegated_to:
  - ui-builder
  - api-builder

IAA_PREFLIGHT_BRIEF_REVIEWED: yes
IAA_PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-prebrief-pr1747.md
IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP: 2026-05-28T00:00:00Z
FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE: yes
BUILDER_DELEGATION_NOTE: Scope limited to review-found defects (domain ownership enforcement + approved_l2 rendering) and PR governance evidence parity.

## Tasks

1. ✅ Patch domain-approval action to enforce domain ownership by caller organisation.
2. ✅ Patch DomainAuditBuilder signed-off check to recognize approved_l2.
3. ✅ Add PR-scoped governance artifacts (manifest/scope/wave/prebrief/functional-delivery).
4. ⏳ Re-run CI and confirm governance + preflight gates green.
