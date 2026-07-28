# BUILD PROGRESS TRACKER

**Module**: MMM (Maturity Model Management)  
**Module Slug**: MMM  
**Last Updated**: 2026-07-28  
**Updated By**: CS2 proxy under issues #1959 and #1961

> **Classification**: ACTIVE — DESCRIPTOR LANE CLOSED; APPROVAL FOUNDATION BUILD-TO-GREEN IN REVIEW
> **Document Role**: PRIMARY LIVE CONTROL DOCUMENT
> **Frozen Implementation Authority**: `modules/MMM/07-implementation-plan/implementation-plan.md` v1.0.0
> **Execution Alignment Addendum**: `modules/MMM/07-implementation-plan/descriptor-runtime-approval-execution-alignment-addendum-2026-07-23.md`
> **Update Rule**: Update immediately after every MMM implementation, security disposition, live-validation result or stage decision.

## 1. Executive Status

The MMM descriptor reasoning and governed-learning lane is implemented, live validated and administratively closed.

The Approval Workflow Foundation has progressed from aligned pre-build authority into build-to-GREEN implementation under issue #1961. The current implementation remains a partial Stage 12 Wave B4 slice; it does not complete the full Framework Lifecycle wave or the later Level 2 workspace, publication and evidence journeys.

Current state:

- descriptor reasoning, persistence/replay, relevance isolation, edit preservation and incomplete-level recovery are live validated;
- descriptor issue chain #1871, #1900, #1908, #1914, #1929, #1936, #1940 and #1957 is closed;
- PR #1958 merged the durable live closure gate;
- PR #1962 merged the executable Approval Workflow Foundation QA authority;
- issue #1959 was confirmed as deployed policy drift, not missing public-helper grants;
- the deployed MMM Supabase project now has zero stale public/unqualified identity-helper policy references;
- public helper RPC execution remains revoked; authenticated policy evaluation uses `app_private` helpers;
- issue #1961 runtime builder has been appointed after the runtime IAA pre-brief;
- the approval foundation build-to-GREEN implementation is on the governed builder branch and requires review/merge before completion is claimed.

## 2. Stage 8 Plan Alignment

The frozen Stage 8 implementation plan remains authoritative.

| Wave | Canonical Scope | Current Position |
|---|---|---|
| B1 | Schema, RLS, migrations | Prior completion evidence remains authoritative; #1959 parity drift corrected |
| B2 | Core API/auth | Prior completion evidence remains authoritative |
| B3 | Core UI/onboarding | Prior completion evidence remains authoritative |
| B4 | Framework lifecycle, review, approval, activation | **Partially implemented**: descriptor lane closed; approval foundation build-to-GREEN in review |
| B5 | Assessment execution/evidence/scoring | Not advanced by this lane |
| B6 | Findings/recommendations/reporting | Not advanced by this lane |
| B7 | AIMC/PIT/KUC integrations | Not advanced by this lane |
| B8 | Cross-cutting security/governance | RLS policy parity strengthened; no full B8 completion claim |
| B9 | Golden-path verification | Not complete |

No full B4, Stage 12, production-readiness or MMM-completion claim is authorised from this foundation slice alone.

## 3. Descriptor Runtime Closure

Merged descriptor sequence:

| PR | Result |
|---:|---|
| #1898 | Descriptor reasoning/governed-learning pre-build authority |
| #1905 | Reasoning and retrieval helper layer |
| #1909 | Criteria Management runtime wiring |
| #1918 | Learning persistence and replay |
| #1931 | Save-before-regenerate protection |
| #1937 | Relevance isolation and non-contamination |
| #1941 | Edit preservation and incomplete-level recovery |
| #1949 | Honest MMM-specific live verification |
| #1958 | Live edit/recovery/save/reload closure proof |

Closure evidence proved:

1. first edit preserves persisted descriptor values;
2. learning consent does not mutate descriptor text;
3. incomplete recovery fills only missing levels;
4. complete dirty sets block destructive regeneration;
5. all five descriptors save through the real server path;
6. all five survive reload;
7. validation whitespace is not persisted;
8. no reusable learning is recorded when consent is declined.

Descriptor methodology remains binding:

- reconstruct criteria into observable evidence states;
- do not copy criterion wording mechanically into every level;
- strip guidance/reference material from the descriptor subject while preserving it as context;
- record reusable learning only after explicit consent;
- preserve tenant isolation and approved-global-only cross-tenant reuse.

## 4. Approval Foundation Authority

Approval Steps 1–8 and PR #1846 remain valid pre-build/contract authority.

PR #1962 added the executable foundation QA contract under issue #1961, including:

- central Level 1/2/3 state-machine requirement;
- package-completeness gate;
- no self-approval;
- assigned reviewer/approver enforcement;
- tenant isolation;
- immutable transition history;
- idempotency;
- expected-state/version conflict protection;
- Level 3 dependency on current Level 2 approvals;
- signed-version revision/reapproval requirement;
- typed server-truth projection;
- RLS private-helper security invariant;
- descriptor regression protection.

Build-to-GREEN command:

```bash
pnpm vitest run --config modules/MMM/tests/vitest.approval-workflow-foundation.config.ts
```

## 5. Issue #1959 Security Disposition

### Finding

The deployed database already contained hardened `app_private` identity helpers with appropriate authenticated execution and revoked public helper execution. Seven later policies had drifted back to unqualified/public helper references.

### Correction

The production MMM Supabase project was reconciled so all affected policies call:

- `app_private.mmm_current_user_org_id()`;
- `app_private.mmm_current_user_role()` where applicable.

The repository contains the idempotent corrective migration:

- `supabase/migrations/20260724000001_mmm_rls_private_helper_policy_reconciliation.sql`

### Verified invariant

- stale policy references: **0**;
- authenticated execution on private helpers: **allowed**;
- anon execution on private helpers: **denied**;
- authenticated/anon execution on public helpers: **denied**;
- RLS remains enabled;
- no service-role capability is exposed to browser clients.

Issue #1959 may close when the corrective migration merges to `main` and post-merge parity is rechecked.

## 6. Approval Foundation Build-to-GREEN Scope

The current governed implementation includes:

- central approval state machine under `apps/mmm/src/lib/approval/`;
- durable domain/framework approval version and idempotency fields;
- immutable approval transition persistence;
- tenant-scoped read policies;
- hardened Level 1/2 domain action;
- Level 3 framework action;
- server completeness checks;
- no-self-approval and assignment checks;
- optimistic concurrency using expected state/version;
- idempotent replay handling;
- fatal transition/audit persistence errors;
- typed client for server-truth reads and actions;
- framework approval Edge Function registration;
- #1959 repository migration.

## 7. Remaining Approval Sequence

After the foundation PR is independently reviewed, all gates pass, the QA contract is GREEN and CS2 merges it:

1. close #1959 after post-merge database/source parity confirmation;
2. close or advance #1961 according to final build evidence;
3. implement the Level 2 invitation modal and scoped approver workspace;
4. implement Level 1 change-summary response and resubmission UX;
5. implement Level 3 executive approval workspace;
6. implement published maturity-model view;
7. implement evidence-modal runtime;
8. continue B5–B9 according to the frozen Stage 8 plan.

## 8. Non-Scope and Claim Restriction

This lane does not authorise or claim completion of:

- full Level 2 workspace UX;
- e-mail delivery/templates;
- published-model view;
- evidence modal;
- PIT, Risk, Incident, RADAM or APW integration;
- ISMS Portal acquisition/onboarding changes;
- full B4 or Stage 12 completion.

Completion claims require executable GREEN evidence, migration/function deployment proof, current-head governance gates, preview/live validation and CS2 acceptance.