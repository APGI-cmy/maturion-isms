# MMM Descriptor Runtime and Approval Execution Alignment Addendum

| Field | Value |
|---|---|
| Module | MMM — Maturity Model Management |
| Artifact Type | Stage 8 execution-alignment addendum |
| Issue | #1955 |
| Date | 2026-07-23 |
| Status | ACTIVE EXECUTION ALIGNMENT — documentation authority only |
| CS2 Authority | Johan Ras |
| Frozen Parent Authority | `modules/MMM/07-implementation-plan/implementation-plan.md` v1.0.0 |

## 1. Purpose

This addendum reconciles actual Stage 12 execution with the frozen MMM Stage 8 implementation plan after the descriptor reasoning, governed learning, persistence/replay, relevance isolation, edit preservation, and live-verification hotfix sequence merged.

It also clarifies the approval-workflow foundation state, records the B1–B3 prerequisite evidence required by the frozen sequence, and identifies the next lawful runtime wave.

This document does not replace, rewrite, or reopen the frozen Stage 8 plan. It records execution against that plan.

## 2. Why an Addendum Is Required

The primary MMM progress tracker was last materially aligned on 2026-07-02, when descriptor reasoning and governed learning were still described as pre-build / QA-only work.

Runtime implementation subsequently merged through PRs #1905, #1909, #1918, #1931, #1937, and #1941. PR #1949 then corrected MMM-specific Vercel boundary use and made live verification trustworthy.

Without an execution addendum, the frozen implementation plan and the live tracker appear to disagree:

- the implementation plan correctly defines the complete nine-wave Stage 12 programme;
- the old tracker incorrectly implies that the descriptor runtime has not begun;
- the approval tracker correctly authorises approval foundation work but can be misread as if PR #1846 delivered operational approval runtime;
- the next-wave statement can appear to bypass the frozen B1 → B2 → B3 → B4 sequence unless prerequisite evidence is linked explicitly.

This addendum closes that documentation gap without weakening the frozen plan.

## 3. Frozen Stage 8 Plan Remains Authoritative

The following rules remain unchanged:

1. The Stage 8 implementation plan is the canonical wave decomposition for Stage 12.
2. Every wave must satisfy its named FR, TR, QA, user-journey, backend, frontend, live-preview, and evidence obligations.
3. A partial implementation slice does not complete a whole wave.
4. A UI without operational backend wiring is not complete.
5. Backend contracts without operational user-facing confirmation are not complete.
6. Pre-build artifacts, request builders, stubs, or placeholders do not constitute runtime completion.
7. Each new runtime wave requires fresh scope, assurance pre-brief, builder authority, tests-to-red, build-to-green evidence, and CS2 acceptance.
8. No B4 continuation may begin unless B1, B2, and B3 completion evidence is present and no superseding blocker invalidates that evidence.

## 4. Descriptor Runtime Mapping to Wave B4

The descriptor work maps to Stage 12 Wave B4 because it operates inside framework creation and review, particularly criterion interpretation, maturity descriptor generation, review, editing, persistence, and preparation for approval.

### 4.1 Implemented B4 Descriptor Slice

Merged runtime capability includes:

- source-mode-aware criterion reasoning;
- reconstruction of nominal, gerund, passive, instruction-style, guidance-heavy, and otherwise awkward criteria into observable evidence-state clauses;
- preservation of actor/action/object meaning and evidence-bearing secondary clauses;
- generation of distinct Basic, Reactive, Compliant, Proactive, and Resilient operating states;
- deterministic methodology fallback;
- consent-gated descriptor-learning capture;
- governed learning persistence and retrieval;
- same-criterion replay;
- relevance-gated similar-criterion transformation;
- tenant and global-pattern isolation;
- conflict and lifecycle filtering;
- save-before-regenerate protection;
- preservation of persisted descriptors on first edit;
- incomplete historical descriptor recovery by filling only missing levels;
- honest learning-applied messaging;
- MMM-specific live verification.

### 4.2 B4 Is Not Complete

The merged descriptor slice does not satisfy all B4 completion conditions. Outstanding B4 scope includes, at minimum:

- complete framework-source upload and parse lifecycle;
- complete proposed-to-canonical compile path;
- complete publication runtime;
- durable three-tier approval runtime;
- server-enforced lock and state transitions;
- full version-history and audit evidence across the framework lifecycle;
- all applicable D2 tests and live journey evidence;
- operational typed integration clients and canonical Edge Functions for approval;
- final CS2 acceptance for the complete J-06 to J-08 journey set.

Therefore the correct status is:

> **Wave B4 — partially implemented; descriptor runtime slice merged; approval and complete lifecycle runtime remain open.**

## 5. Descriptor Runtime Traceability

| Authority / Implementation | Role | Execution Result |
|---|---|---|
| PR #1898 | FRS and QA-to-red expansion | Established descriptor reasoning and governed-learning authority |
| PR #1902 | Builder appointment | Authorised bounded runtime implementation |
| PR #1905 | Runtime helper layer | Implemented reasoning and learning-retrieval helpers |
| PR #1909 | UI runtime wiring | Connected Criteria Management to descriptor reasoning |
| PR #1915 | Persistence/replay QA-to-red | Established durable learning and replay acceptance authority |
| PR #1918 | Persistence/replay runtime | Implemented save metadata, retrieval, and replay |
| PR #1930 | Save/regenerate QA-to-red | Established protection against losing unsaved corrections |
| PR #1931 | Save/regenerate runtime | Blocked destructive regeneration and corrected learning workflow |
| PR #1937 | Relevance hotfix | Prevented unrelated-criterion learning contamination |
| PR #1941 | Edit-memory hotfix | Preserved existing levels and recovered incomplete sets |
| PR #1949 | Verification/boundary hotfix | Corrected MMM Vercel secret boundary and false-green/false-red diagnosis |

## 6. Descriptor Closure Condition

The code lane is merged, but final administrative closure requires CS2 live evidence for the incomplete-record scenario addressed by #1941.

Closure evidence must prove:

1. first edit seeds from persisted descriptor rows;
2. consent yes/no does not mutate descriptor content;
3. incomplete-set regeneration preserves all non-empty and edited levels;
4. missing levels are populated;
5. complete dirty sets still block destructive regeneration;
6. save receives five populated levels;
7. reload preserves all five levels;
8. no criterion-specific hard-coding is present.

Once accepted, the descriptor issue chain may be closed or marked superseded with traceability to the merged PR sequence.

## 7. Approval Workflow Pre-Build Alignment

Approval workflow Steps 1–8 remain aligned through:

- functional pre-build contract;
- DB/API contract;
- notification and lock contract;
- approval QA-to-red;
- Level 2 invite/workspace QA-to-red;
- Level 1 response/change-summary QA-to-red;
- Level 3 approval QA-to-red;
- published model QA-to-red;
- evidence modal harvest QA-to-red;
- FRS/TRS/Architecture alignment addendum.

The approved runtime sequence remains:

1. approval foundation runtime;
2. Level 2 invite and scoped workspace;
3. Level 1 response and resubmission;
4. Level 3 final approval;
5. published model view;
6. evidence modal runtime.

## 8. Correct Interpretation of PR #1846

PR #1846 delivered an approval-foundation contract slice. It established:

- canonical function-name constants;
- request and event payload builders;
- non-canonical alias rejection;
- a final-lock mutation guard;
- focused executable contract tests;
- governance scope and builder authority for the foundation lane.

It did not deliver operational approval runtime.

The following remain outstanding:

- database migrations and durable persistence;
- RLS and server-side authorization for approval records;
- canonical Edge Functions;
- server-enforced state machine;
- typed Supabase integration client;
- transactional notification/audit/AI-learning event persistence;
- Level 2, Level 1-response, and Level 3 user journeys;
- operational locks and scoped unlocks;
- live-preview proof of the complete approval foundation.

No completion claim may be derived from #1846 alone.

## 9. B1–B3 Prerequisite Verification

The frozen Stage 8 plan requires B1, B2, and B3 to be complete before B4 continuation. This reconciliation records the existing evidence rather than assuming those prerequisites.

| Prerequisite | Evidence | Recorded Result |
|---|---|---|
| B1 — Schema, RLS, migrations | `modules/MMM/11-build/B1-schema/wave-b1-evidence.md` | `Status: COMPLETE`; schema/RLS/index/storage tests recorded GREEN |
| B2 — Core API | `modules/MMM/11-build/B2-api/wave-b2-evidence.md` | `Status: COMPLETE`; 28/28 tests PASS and closure declaration recorded |
| B3 — Core UI/onboarding | `modules/MMM/11-build/B3-ui/wave-b3-evidence.md` | `Status: COMPLETE`; 59/59 tests GREEN and J-01–J-05 evidence recorded |

For sequencing purposes, these evidence artifacts satisfy the documented B1–B3 predecessor requirement for the next bounded B4 continuation.

Before appointing the approval-foundation runtime builder, the new wave must still perform a current-state preflight confirming:

1. the cited B1–B3 evidence files remain present on `main`;
2. no later migration, auth, onboarding, boundary, or governance change has superseded or invalidated them;
3. the approval wave uses the existing canonical schema and routes rather than duplicating them;
4. any discovered prerequisite regression is treated as a blocker and fixed in its owning wave before approval runtime proceeds.

This is a verification condition, not permission to reopen or rebuild B1–B3 without evidence of regression.

## 10. Next Lawful Runtime Wave

Subject to the current-state prerequisite preflight in Section 9 and completion of the normal governance sequence, the next product implementation issue should be titled and scoped around:

> **MMM Approval Workflow Foundation Runtime**

### 10.1 Required Scope

The wave should implement:

- persistence for approval rounds;
- persistence for approvers and invitation acceptance;
- proposed changes and comments;
- approval decisions;
- Level 1 response records;
- notification events;
- audit events;
- organisation-scoped AI-learning events;
- lock state and scoped unlock state;
- canonical Edge Functions;
- typed integration client;
- server-side state transition validation;
- RLS and role enforcement;
- tests-to-red and build-to-green evidence;
- preview/live proof.

### 10.2 Canonical Runtime Surface

The approved function names remain:

- `mmm-approval-round-create`
- `mmm-approval-invite-accept`
- `mmm-approval-workspace-read`
- `mmm-approval-proposed-changes-submit`
- `mmm-approval-decision-submit`
- `mmm-approval-level1-response-submit`
- `mmm-approval-lock-transition`

Alternate names require an explicit contract revision approved by CS2.

### 10.3 Required State Rules

The runtime must enforce:

1. Level 1 preparation/approval does not lock canonical content.
2. Level 2 approval remains partial until all required approvers approve.
3. Any required Level 2 change request prevents domain lock.
4. All required Level 2 approvals lock only the approved domain scope.
5. Level 3 may begin only after the required Level 2 scope is approved.
6. Level 3 change requests temporarily unlock only affected items.
7. Final approval locks the complete approved roadmap/control standard.
8. Post-final mutation is blocked unless a later change-management workflow is authorised.
9. All state transitions create audit events.
10. Relevant approval-loop actions create organisation-scoped AI-learning events without uncontrolled global promotion.

### 10.4 Non-Scope for the Foundation Wave

Unless separately authorised, the foundation wave must not implement:

- full Level 2 workspace UX;
- e-mail delivery/templates;
- Level 3 UI;
- published model view;
- evidence upload/capture runtime;
- AI evidence evaluation;
- PIT, Risk, Incident, RADAM, APW, or other module runtime;
- ISMS public shell or entitlement journey changes.

## 11. Boundary Alignment

The separate-project deployment model remains binding:

- MMM, PIT, and ISMS Portal may share a repository but remain separate applications and Vercel projects.
- Each application owns its own deployment project, routes, environment variables, automation bypass secret, and functional verification lane.
- MMM workflows must use the MMM-specific secret namespace.
- A generic Vercel secret or another application's secret is not an acceptable fallback.
- Cross-application handoff must obey the approved platform/module boundary artifacts.

## 12. Progress Tracker Rule

`modules/MMM/BUILD_PROGRESS_TRACKER.md` remains the primary live control document.

The tracker must be updated when:

- #1941 live validation is accepted or rejected;
- descriptor issues are closed or superseded;
- the B1–B3 prerequisite preflight is recorded for the approval runtime wave;
- the approval foundation runtime issue is opened;
- its governance pack is approved;
- its first implementation PR merges;
- a later approval-workflow wave begins;
- any blocker, boundary change, or completion claim changes.

## 13. Alignment Conclusion

The pre-build chain is structurally aligned.

The documentation mismatch arose because runtime implementation advanced faster than the primary tracker. This addendum and the reconciled tracker restore a single execution narrative:

- descriptor reasoning and governed-learning runtime are implemented as a partial B4 slice;
- live closure evidence remains required;
- B4 is not complete;
- approval Steps 1–8 are pre-build aligned;
- PR #1846 is a contract foundation, not operational approval runtime;
- B1–B3 predecessor evidence is explicitly linked and must pass a current-state preflight;
- approval workflow foundation runtime is the next governed MMM build lane only after that preflight and the normal governance sequence.