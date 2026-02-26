# Architecture Freeze — Wave 9 Self-Learning Loop Migration to AIMC

## 1. Freeze Declaration

| Field | Value |
|---|---|
| **Freeze ID** | ARCH-FREEZE-WAVE9-SLL-20260226 |
| **Date** | 2026-02-26 |
| **Applies to** | Wave 9.2 (Schema) / Wave 9.4 (API) / Wave 9.11 (Legacy Escape Remediation) |
| **Status** | ✅ FROZEN |
| **Frozen by** | foreman-v2-agent (session-060-20260226) |
| **Authority** | CS2 — @APGI-cmy (Johan Ras) — Issue #613 |
| **Governing audit** | `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` — Gap 2: Self-Learning Loop |

**This document is frozen. Any change requires explicit CS2 written approval and an amendment to this document. Silent drift is prohibited (A-001).**

---

## 2. Problem Definition

### 2.1 Current Legacy Self-Learning Mechanisms

The legacy Maturion app (`apps/maturion-maturity-legacy/`) implements a self-learning loop that **bypasses the AIMC gateway entirely**:

| File | Pattern | Risk |
|---|---|---|
| `apps/maturion-maturity-legacy/src/agents/maturion/learning/learningLayer.ts` | Reads/writes `ai_learning_patterns` and `ai_feedback_submissions` tables directly via Supabase client | HIGH — no AIMC governance gate |
| `apps/maturion-maturity-legacy/src/hooks/useAILearningFeedback.ts` | UI hook consuming `ai_feedback_log` table directly | MEDIUM — legacy escape |
| `apps/maturion-maturity-legacy/src/hooks/useAIFeedbackSubmissions.ts` | UI hook consuming `ai_feedback_submissions` directly | MEDIUM — legacy escape |
| `apps/maturion-maturity-legacy/src/hooks/useAILearningPatterns.ts` | UI hook consuming `ai_learning_patterns` directly | MEDIUM — legacy escape |
| `apps/maturion-maturity-legacy/src/hooks/useFeedbackRetrainingWeights.ts` | UI hook consuming training weights directly | MEDIUM — legacy escape |
| `apps/maturion-maturity-legacy/src/hooks/useSmartFeedbackLoop.ts` | Smart feedback loop bypassing AIMC | MEDIUM — legacy escape |

**Root cause**: The self-learning loop was built before AIMC existed. It was never migrated when AIMC was introduced.

### 2.2 "Migrated to AIMC" — Operational Definition

A self-learning loop is considered **fully migrated to AIMC** when ALL of the following are true:

1. User feedback events are submitted via a `FeedbackPipeline` class within `packages/ai-centre/src/feedback/`
2. The `FeedbackPipeline` writes exclusively to a new `ai_feedback_events` table (not legacy tables)
3. Any knowledge base promotion requires ARC (Adaptive Review Committee) approval via a CS2-gated endpoint
4. No production code path can write to `ai_learning_patterns` or `ai_feedback_submissions` without going through AIMC
5. All legacy direct-Supabase learning hooks are documented for deprecation (not removed in this wave — removal tracked in Wave 9.11)
6. Regression tests assert that legacy bypass paths are unreachable from AIMC-mediated flows

---

## 3. Scope

### IN SCOPE — Wave 9.2 / 9.4 / 9.11

| Item | Wave | Deliverable |
|---|---|---|
| New `ai_feedback_events` table (Supabase migration `005_ai_feedback_pipeline.sql`) | 9.2 | Schema |
| RLS policies on `ai_feedback_events` — users insert own, org members read, service role arc-approves | 9.2 | Schema |
| ARC approval status column: `CHECK (arc_status IN ('pending', 'approved', 'rejected'))` | 9.2 | Schema |
| TypeScript types: `FeedbackEvent`, `ARCReviewStatus`, `FeedbackPipelineInterface` | 9.2 | Schema/Types |
| `FeedbackPipeline` class: `submit()`, `listPending()`, `approve()`, `reject()` methods | 9.4 | API |
| `POST /api/ai/feedback` — submit feedback event (authenticated) | 9.4 | API |
| `POST /api/ai/feedback/approve` — ARC-approve a pending event (CS2-gated) | 9.4 | API |
| Unit tests for `FeedbackPipeline` — 100% coverage of submit/listPending/approve/reject | 9.4 | Tests |
| Integration tests for feedback endpoints | 9.4 | Tests |
| Regression suite: assert no legacy bypass path reachable from AIMC flows | 9.11 | Governance |
| Deprecation markers on legacy learning hooks (JSDoc `@deprecated` + migration note) | 9.11 | Governance |
| ARC gate enforcement: `approve()` rejects without CS2/service-role token | 9.11 | Enforcement |
| Wave 9.11 depends on Wave 9.3 (Knowledge Base Inventory) + Wave 9.4 (API) being complete | 9.11 | Dependency |

### OUT OF SCOPE — This Wave

| Item | Reason |
|---|---|
| Physical deletion of legacy learning hooks and tables | Tracked in Wave 9.11 — requires migration planning; not in this wave |
| Migrating historical `ai_feedback_submissions` data | Separate migration wave; out of scope |
| Module integration for PIT, xDetect, Risk, Course Crafter, ISMS Navigator | Tracked in Wave 9.3 / separate module waves |
| Episodic memory (Tier 3) | Wave 9.1 / 9.1-FU (already complete) |
| Knowledge Base Inventory document | Wave 9.3 (separate) |

---

## 4. Locked Interfaces

### 4.1 Schema — Wave 9.2

**Migration file**: `packages/ai-centre/supabase/migrations/005_ai_feedback_pipeline.sql`

**Table**: `ai_feedback_events`

```sql
CREATE TABLE ai_feedback_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id   UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  session_id        TEXT NOT NULL,
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  interaction_id    TEXT NOT NULL,
  feedback_type     TEXT NOT NULL CHECK (feedback_type IN ('positive', 'negative', 'correction', 'flag')),
  rating            INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment           TEXT,
  correction_text   TEXT,
  capability        TEXT NOT NULL,
  agent_id          TEXT NOT NULL,
  arc_status        TEXT NOT NULL DEFAULT 'pending' CHECK (arc_status IN ('pending', 'approved', 'rejected')),
  arc_reviewed_by   TEXT,
  arc_reviewed_at   TIMESTAMPTZ,
  arc_notes         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**RLS Policies (locked)**:
- `ai_feedback_events_insert`: authenticated users insert own rows (user_id = auth.uid())
- `ai_feedback_events_org_select`: org members select rows for their organisation
- `ai_feedback_events_arc_update`: service_role only for UPDATE (arc approval fields)

**TypeScript types** (in `packages/ai-centre/src/types/feedback.ts`):

```typescript
export type ARCReviewStatus = 'pending' | 'approved' | 'rejected';
export type FeedbackType = 'positive' | 'negative' | 'correction' | 'flag';

export interface FeedbackEvent {
  id?: string;
  organisationId: string;
  sessionId: string;
  userId?: string;
  interactionId: string;
  feedbackType: FeedbackType;
  rating?: number;
  comment?: string;
  correctionText?: string;
  capability: string;
  agentId: string;
  arcStatus?: ARCReviewStatus;
  arcReviewedBy?: string;
  arcReviewedAt?: Date;
  arcNotes?: string;
  createdAt?: Date;
}

export interface FeedbackPipelineInterface {
  submit(event: Omit<FeedbackEvent, 'id' | 'arcStatus' | 'createdAt'>): Promise<FeedbackEvent>;
  listPending(organisationId: string): Promise<FeedbackEvent[]>;
  approve(id: string, reviewedBy: string, notes?: string): Promise<FeedbackEvent>;
  reject(id: string, reviewedBy: string, notes?: string): Promise<FeedbackEvent>;
}
```

### 4.2 API — Wave 9.4

**Endpoints (locked)**:

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/ai/feedback` | JWT (user) | Submit a feedback event |
| `POST` | `/api/ai/feedback/approve` | Service role / CS2 token | ARC-approve or reject a pending event |
| `GET` | `/api/ai/feedback/pending` | Service role / CS2 token | List pending feedback events for ARC review |

**Request schema — POST /api/ai/feedback**:
```json
{
  "interactionId": "string (required)",
  "feedbackType": "positive | negative | correction | flag (required)",
  "rating": "integer 1-5 (optional)",
  "comment": "string (optional)",
  "correctionText": "string (required if feedbackType=correction)",
  "capability": "string (required)",
  "agentId": "string (required)"
}
```

**Request schema — POST /api/ai/feedback/approve**:
```json
{
  "eventId": "string (required)",
  "decision": "approved | rejected (required)",
  "reviewedBy": "string (required)",
  "notes": "string (optional)"
}
```

**Authorization behaviour (locked)**:
- `/api/ai/feedback` — requires valid JWT (`Authorization: Bearer <token>`); 401 if absent/invalid
- `/api/ai/feedback/approve` — requires `x-arc-token` header matching `process.env.ARC_APPROVAL_TOKEN`; 403 if missing or wrong
- `/api/ai/feedback/pending` — same ARC token requirement as approve

### 4.3 Governance / Remediation — Wave 9.11

**Legacy pathway deprecation (locked)**:
- All hooks in `apps/maturion-maturity-legacy/src/hooks/useAI*.ts` and `useFeedback*.ts` and `useLearning*.ts` and `useSmart*.ts` MUST carry JSDoc `@deprecated` markers with migration path to `FeedbackPipeline`
- `learningLayer.ts` MUST carry `@deprecated` with migration note
- No NEW code may call these legacy hooks

**Hard-failure enforcement (locked)**:
- `FeedbackPipeline.submit()` MUST reject with `AIMCBypassError` if it detects it is being called without an `organisationId` (preventing anonymous bypass)
- `POST /api/ai/feedback/approve` MUST return 403 and log a security warning if ARC token is invalid

**Regression assertions (locked)**:
- Test: `FeedbackPipeline` does NOT import from legacy `learningLayer.ts`
- Test: `FeedbackPipeline.submit()` writes to `ai_feedback_events`, NOT `ai_feedback_submissions` or `ai_learning_patterns`
- Test: `approve()` without valid ARC token returns 403

---

## 5. Dependency Chain

```
Wave 9.2 (Schema) ──► Wave 9.4 (API/FeedbackPipeline)
                                    │
                                    ▼
                       Wave 9.11 depends on Wave 9.3 + Wave 9.4
```

- **Wave 9.4 cannot start until Wave 9.2 schema is GREEN (100% tests passing)**
- **Wave 9.11 cannot start until Wave 9.3 (KB Inventory) and Wave 9.4 (API) are both GREEN**

---

## 6. RED QA Definition

**MANDATORY — No builder may receive a task until the Red QA suite is defined here.**

### 6.1 Wave 9.2 — Schema RED QA

**Test file**: `packages/ai-centre/src/__tests__/schema/wave9.2-feedback-pipeline-schema.test.ts`

| Test ID | Test Name | RED Condition (fails before build) | GREEN Condition (passes after build) |
|---|---|---|---|
| W9.2-T-001 | `migration file 005_ai_feedback_pipeline.sql exists` | File not found | File exists at correct path |
| W9.2-T-002 | `ai_feedback_events table has id column UUID PK` | SQL does not contain expected CREATE TABLE | SQL contains correct column definition |
| W9.2-T-003 | `ai_feedback_events has arc_status CHECK constraint` | SQL missing CHECK constraint | SQL contains `CHECK (arc_status IN ('pending', 'approved', 'rejected'))` |
| W9.2-T-004 | `ai_feedback_events has feedback_type CHECK constraint` | SQL missing CHECK constraint | SQL contains `CHECK (feedback_type IN ('positive', 'negative', 'correction', 'flag'))` |
| W9.2-T-005 | `ai_feedback_events RLS insert policy exists` | SQL missing RLS policy | SQL contains `CREATE POLICY` with correct insert rule |
| W9.2-T-006 | `ai_feedback_events RLS org select policy exists` | SQL missing org select policy | SQL contains org-scoped SELECT policy |
| W9.2-T-007 | `ai_feedback_events RLS arc update policy exists (service_role)` | SQL missing service-role UPDATE policy | SQL contains service_role UPDATE policy |
| W9.2-T-008 | `TypeScript type FeedbackEvent is exported from types/feedback.ts` | File/type does not exist | File exists, FeedbackEvent exported |
| W9.2-T-009 | `TypeScript type ARCReviewStatus is union of pending/approved/rejected` | Type wrong or absent | Correct union type exported |
| W9.2-T-010 | `FeedbackPipelineInterface declares submit/listPending/approve/reject` | Interface absent or incomplete | All 4 methods present with correct signatures |

### 6.2 Wave 9.4 — API RED QA

**Test files**:
- `packages/ai-centre/src/__tests__/feedback/FeedbackPipeline.test.ts`
- `api/ai/feedback.test.ts`
- `api/ai/feedback/approve.test.ts`

| Test ID | Test Name | RED Condition | GREEN Condition |
|---|---|---|---|
| W9.4-T-001 | `FeedbackPipeline class exists and is importable` | Import fails | Import succeeds |
| W9.4-T-002 | `FeedbackPipeline.submit() returns FeedbackEvent with pending arc_status` | Method absent or throws | Returns object with `arcStatus: 'pending'` |
| W9.4-T-003 | `FeedbackPipeline.listPending() returns array filtered by arc_status=pending` | Method absent or unfiltered | Returns only pending events |
| W9.4-T-004 | `FeedbackPipeline.approve() sets arc_status to approved` | Method absent or wrong status | Returns event with `arcStatus: 'approved'` |
| W9.4-T-005 | `FeedbackPipeline.reject() sets arc_status to rejected` | Method absent or wrong status | Returns event with `arcStatus: 'rejected'` |
| W9.4-T-006 | `FeedbackPipeline does NOT import from learningLayer.ts` | Import detected (legacy escape) | No import from legacy learning layer |
| W9.4-T-007 | `POST /api/ai/feedback returns 401 with no auth token` | Returns 200 or 500 | Returns 401 |
| W9.4-T-008 | `POST /api/ai/feedback returns 200 with valid payload` | Throws or returns error | Returns 200 with created event |
| W9.4-T-009 | `POST /api/ai/feedback/approve returns 403 with invalid ARC token` | Returns 200 or 500 | Returns 403 |
| W9.4-T-010 | `POST /api/ai/feedback/approve returns 200 with valid ARC token and approves event` | Throws or returns error | Returns 200 with approved event |
| W9.4-T-011 | `FeedbackPipeline.submit() throws AIMCBypassError if organisationId is missing` | Does not throw | Throws `AIMCBypassError` |

### 6.3 Wave 9.11 — Legacy Escape Remediation RED QA

**Test file**: `packages/ai-centre/src/__tests__/governance/wave9.11-legacy-escape.test.ts`

| Test ID | Test Name | RED Condition | GREEN Condition |
|---|---|---|---|
| W9.11-T-001 | `learningLayer.ts has @deprecated JSDoc marker` | No deprecation marker | `@deprecated` present with migration note |
| W9.11-T-002 | `useAILearningFeedback.ts has @deprecated marker` | No deprecation marker | `@deprecated` present |
| W9.11-T-003 | `useAIFeedbackSubmissions.ts has @deprecated marker` | No deprecation marker | `@deprecated` present |
| W9.11-T-004 | `FeedbackPipeline does not reference ai_learning_patterns table` | String found in source | String absent from FeedbackPipeline source |
| W9.11-T-005 | `FeedbackPipeline does not reference ai_feedback_submissions table` | String found in source | String absent from FeedbackPipeline source |
| W9.11-T-006 | `POST /api/ai/feedback/approve returns 403 without ARC token` | Returns non-403 | Returns 403 |
| W9.11-T-007 | `AIMCBypassError class is exported from packages/ai-centre` | Class absent | Class exported with correct name |

---

## 7. Non-Negotiables

- ✅ Zero test debt — no skipped, todo, or placeholder tests
- ✅ Zero deprecation warnings during build
- ✅ No legacy learning path remains unblocked
- ✅ ARC gating enforced on all knowledge promotions
- ✅ 100% GREEN before each wave handover
- ✅ Full functionality per `FULLY_FUNCTIONAL_DELIVERY_STANDARD.md` before any handover

---

## 8. Change Control

Any amendment to this freeze document requires:
1. Explicit written CS2 (@APGI-cmy) approval
2. Amendment entry below
3. No silent drift

### Amendment Log

| Date | Amendment | Approved By |
|---|---|---|
| *(none)* | — | — |

---

**Frozen by**: foreman-v2-agent v6.2.0  
**Session**: session-060-20260226  
**Authority**: CS2 — @APGI-cmy (Johan Ras)  
**Issue**: #613  
