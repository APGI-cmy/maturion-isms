# ECAP — Issue 1787 Descriptor Reconstruction

- **Repository**: `APGI-cmy/maturion-isms`
- **PR**: #1788
- **Issue**: #1787
- **Wave**: `mmm-dmc-descriptor-reconstruction-20260610`
- **Module**: MMM
- **Status**: ECAP FILED / CI RERUN REQUIRED

## 1. Wave Scope

Correct MMM DMC maturity descriptor generation so descriptors are reconstructed into grammatical audit-evidence sentences globally, not produced as copied criterion text plus maturity suffix.

## 2. Primary Artifacts Touched

Pre-build / governance:

- `.agent-admin/scope-declarations/issue-1787-descriptor-reconstruction.md`
- `.agent-admin/builder-appointments/issue-1787-descriptor-reconstruction-builder-contract.md`
- `.agent-workspace/foreman-v2/memory/session-issue-1787-descriptor-reconstruction-20260610.md`
- `.agent-admin/assurance/iaa-prebrief-issue-1787-descriptor-reconstruction.md`
- `.agent-admin/quality/issue-1787-descriptor-reconstruction-foreman-qp.md`
- `modules/MMM/04-architecture/issue-1787-descriptor-reconstruction-addendum.md`
- `modules/MMM/05-qa-to-red/issue-1787-descriptor-reconstruction-qa-to-red.md`

Runtime/test:

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

## 3. Builder Delegation

Implementation was delegated to runtime builder/Copilot after Foreman encountered safe-patching limits in the current session.

Delegated agents recorded in Foreman session memory:

- ui-builder;
- qa-builder;
- copilot-runtime-builder.

## 4. Decisions Made

1. Treat descriptor reconstruction as a global rule.
2. Keep PR #1788 in draft until runtime/test/CI evidence is green.
3. Use issue-specific architecture and QA-to-RED addenda rather than silently changing runtime code.
4. File missing POLC/IAA/ECAP evidence after Copilot handover exposed governance gate failures.

## 5. Evidence Reviewed

- PR #1788 metadata: open, draft, implementation files changed.
- CI run on head `a0564ec64250bea590028ec01e4d5a5878523a71` showed multiple failing checks.
- POLC workflow requires PR-changed Foreman session memory with `agents_delegated_to:` or PREHANDOVER proof builder references where implementation files are present.
- POLC workflow requires IAA pre-brief artifact when implementation files are present.

## 6. Open Risks

1. CI must rerun after governance evidence commits.
2. Runtime tests must be confirmed green on the final head.
3. Live dashboard/deployment checks may still fail because of Vercel preview or pnpm setup/runtime environment conditions; those are not waived by this ECAP.
4. Sign-off lock behavior is currently a documented seam unless a sign-off data model already exists.

## 7. Current Gate Status

This ECAP does not claim merge readiness.

Required before handover:

- all required checks green or CS2 waiver;
- final IAA review;
- PR ready-for-review transition only after Foreman confirms gate state;
- no hidden test debt.

## 8. ECAP Disposition

**ADMIN CEREMONY FILED. MERGE NOT APPROVED.**

The wave is administratively traceable. Final merge depends on CI rerun and IAA final assurance.
