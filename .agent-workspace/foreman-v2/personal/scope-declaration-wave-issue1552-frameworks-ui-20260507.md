# Scope Declaration — Wave: issue1552-frameworks-ui-20260507

**Foreman**: foreman-v2-agent v2.15.0
**Wave**: issue1552-frameworks-ui-20260507
**Issue**: maturion-isms#1552
**PR**: #1553
**Date**: 2026-05-07
**Schema Version**: SCOPE_DECLARATION_SCHEMA.md §5.7

---

## Approved Artifact Paths

APPROVED_ARTIFACT_PATHS:
- .agent-workspace/foreman-v2/memory/session-issue1552-frameworks-ui-delegation-20260507.md
- .agent-workspace/foreman-v2/personal/scope-declaration-wave-issue1552-frameworks-ui-20260507.md
- .agent-admin/scope-declarations/pr-1553.md
- .agent-admin/assurance/iaa-token-pr-1553-frameworks-ui-20260507.md
- .admin/prs/pr-1553.json
- apps/mmm/src/index.css
- apps/mmm/src/pages/FrameworkListPage.tsx
- apps/mmm/src/pages/FrameworkUploadPage.tsx

---

## Scope Summary

This wave delegates Frameworks UI implementation (issue #1552 / PR #1553) to ui-builder.
Foreman acts as orchestrator and supervision only — NOT as implementer.
Implementation artifacts are in apps/mmm/src/ (builder-produced).
Governance artifacts are in .agent-workspace/foreman-v2/ and .agent-admin/scope-declarations/.
