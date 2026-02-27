# AIMC ARC Knowledge Promotion Protocol

**Document Type**: Governance Artefact — Wave 9.5 Deliverable  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Effective Date**: 2026-02-27  
**Owner**: Maturion Engineering Leadership (Johan Ras, CS2)  
**Location**: `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`

**Audit Reference**: Gap 3 — `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md`  
**AAWP Reference**: Wave 9.5 — Governance: Knowledge Base Inventory + ARC Protocol  
**Architecture Reference**: `governance/aimc/freezes/ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md`  
**Schema Reference**: `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql`  
**Inventory Reference**: `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md`

---

## 1. Purpose

This document defines the **ARC (Adaptive Review Committee) Knowledge Promotion Protocol** — the formal, stepwise process for reviewing, approving, refreshing, and retiring knowledge items in the Maturion AIMC Knowledge Base.

No knowledge item may be injected into an AI context window until it has completed this protocol and reached `approved` status. The `KnowledgeRetrieverImpl` enforces this gate at runtime by filtering to `approval_status = 'approved'` only.

---

## 2. ARC Roles and Responsibilities

| Role | Identity | Responsibilities |
|---|---|---|
| **ARC Chair** | CS2 — Johan Ras (@APGI-cmy) | Final approval authority; signs off on all promotions and retirements; handles escalations |
| **Knowledge Uploader** | Any governed agent or authorised team member | Uploads knowledge items; provides domain, module, standard_ref metadata; submits for ARC review |
| **ARC Reviewer** | ARC Chair (or CS2-delegated reviewer) | Reviews pending items; applies the review criteria; approves, rejects, or requests revision |
| **Knowledge Steward** | Foreman (foreman-v2-agent) + Governance Liaison | Monitors freshness dates; flags overdue items; coordinates re-review cycles; updates inventory |

---

## 3. Approval Status Lifecycle

```
         ┌─────────────────────────────────────────────────────────┐
         │                                                         │
[Upload] → PENDING → [ARC Review] → APPROVED → [Freshness Check] ─┤
                   ↘                        ↘                     │
                    REJECTED                 RETIRED               │
                   (re-upload                (manual re-approval   │
                    required)                 required to          │
                                              restore to pending)  │
                                                                   └─────────────────┘
```

| Status | Meaning | Injected into Context? | Transition Triggers |
|---|---|---|---|
| `pending` | Uploaded, awaiting ARC review | ❌ No | Upload event |
| `approved` | ARC-reviewed and accepted | ✅ Yes | ARC Reviewer approves |
| `retired` | No longer current; withdrawn from active use | ❌ No | ARC retires; or 180-day staleness trigger |

---

## 4. Protocol Steps

### Step 1 — Upload

**Actor**: Knowledge Uploader  
**Actions**:
1. Prepare the knowledge content (document excerpt, policy extract, standard reference, etc.)
2. Populate required metadata:
   - `domain`: e.g., `access-control`, `risk-management`, `vulnerability-management`
   - `module`: Maturion module this knowledge serves (`MAT`, `PIT`, `XDETECT`, `Builder`, `Command`, etc.)
   - `standard_ref`: Governing standard reference (e.g., `ISO-27001-A.9.1`, `NIST-SP-800-53-AC-2`)
   - `source`: Source document identifier (e.g., document name, URL, version)
3. Insert the knowledge item into the `ai_knowledge` table via the AIMC API (or service role migration)
4. The database sets `approval_status = 'pending'` by default (migration `006_ai_knowledge_metadata.sql`)
5. Notify ARC Reviewer that a new item is pending review (submit ARC review request)

**Gate**: Knowledge item must NOT be used in any AI interaction until `approval_status = 'approved'`.

---

### Step 2 — ARC Review Request

**Actor**: Knowledge Uploader → ARC Reviewer  
**Actions**:
1. Uploader creates an ARC review request (GitHub issue, comment on AAWP, or direct CS2 notification)
2. Reference:
   - Knowledge item ID (UUID from `ai_knowledge` table)
   - Domain, module, standard_ref
   - Reason for inclusion (what gap this knowledge fills)
   - Supporting evidence (the source document or excerpt)
3. ARC Reviewer acknowledges the request and adds it to the review queue

---

### Step 3 — ARC Review

**Actor**: ARC Reviewer (ARC Chair or delegated reviewer)  
**Review Criteria**:

| Criterion | Requirement |
|---|---|
| **Accuracy** | Content is factually correct and consistent with the referenced standard |
| **Relevance** | Content is relevant to the declared domain, module, and standard_ref |
| **Freshness** | Content reflects the current version of the referenced standard |
| **No sensitive data** | Content contains no PII, credentials, secrets, or organisation-specific confidential data |
| **Format quality** | Content is well-structured, parseable, and suitable for RAG context injection |
| **Scope compliance** | Content falls within the AIMC knowledge scope (governance, compliance, security) |

**Actions**:
1. Review the knowledge item content against all six criteria above
2. Record the review decision in the `ai_knowledge` row:
   - `arc_reviewed_by`: reviewer identity
   - `arc_reviewed_at`: current timestamp
   - `arc_notes`: review notes (mandatory if rejecting)
3. Set `approval_status` to:
   - `approved` — if all criteria are met
   - `rejected` — if criteria are not met (item remains at `pending` pending re-upload)
4. Update the freshness date: `freshness_date = now()` when approving

---

### Step 4 — Approval or Rejection

#### 4a — Approval

**Actor**: ARC Reviewer  
**Actions**:
1. Set `approval_status = 'approved'`
2. Set `freshness_date = now()`
3. Set `arc_reviewed_by`, `arc_reviewed_at`, `arc_notes`
4. Record the approval in `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` (update the relevant domain section)
5. Notify Knowledge Uploader of approval

**Outcome**: Knowledge item is now active and will be returned by `KnowledgeRetrieverImpl.retrieve()`.

#### 4b — Rejection

**Actor**: ARC Reviewer  
**Actions**:
1. Keep `approval_status = 'pending'` (do NOT set to `rejected` in schema — rejected items are re-submitted fresh)
2. Set `arc_reviewed_by`, `arc_reviewed_at`, `arc_notes` (notes MUST describe reason for rejection)
3. Notify Knowledge Uploader with specific remediation requirements
4. Knowledge Uploader may correct the content and re-submit for review (new row or same row updated)

---

### Step 5 — Freshness Monitoring

**Actor**: Knowledge Steward (foreman-v2-agent + governance-liaison-isms-agent)  
**Schedule**: Checked at each wave completion and quarterly

**Triggers for re-review**:
1. **90-day freshness threshold**: `freshness_date` is more than 90 days ago → flag for re-review
2. **180-day staleness**: `freshness_date` is more than 180 days ago → automatically set `approval_status = 'retired'` pending re-approval
3. **Standard version update**: Referenced standard (`standard_ref`) has been updated → all items referencing that standard are flagged for re-review regardless of freshness date

**Process**:
1. Knowledge Steward identifies overdue items from the inventory
2. For 90-day items: submit ARC review request (Step 2) with updated content if applicable
3. For 180-day items: set `approval_status = 'retired'`; submit ARC review request with fresh content upload
4. ARC Reviewer processes re-review per Steps 3–4

---

### Step 6 — Retirement

**Actor**: ARC Reviewer or automatic staleness trigger  
**Triggers**:
- 180-day staleness (automatic)
- Superseded by newer version of standard
- Content found to be inaccurate after approval
- Organisation no longer requires this knowledge domain

**Actions**:
1. Set `approval_status = 'retired'`
2. Set `arc_reviewed_by`, `arc_reviewed_at`, `arc_notes` (mandatory: reason for retirement)
3. Update `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` (mark item as retired)
4. If replacement content is available: upload new item (Step 1) and route through full protocol

**Outcome**: Retired item is excluded from `KnowledgeRetrieverImpl.retrieve()` and no longer injected into AI context windows.

---

## 5. Enforcement Mechanism

The `KnowledgeRetrieverImpl` class (`packages/ai-centre/src/memory/KnowledgeRetrieverImpl.ts`) enforces this protocol at runtime:

```typescript
// Only entries with approvalStatus === 'approved' are returned.
// 'pending', 'retired', and undefined are all excluded.
const approved = this.entries.filter(
  (entry) => entry.approvalStatus === 'approved',
);
```

This ensures that:
- No pending knowledge item is ever injected into an AI context window
- No retired knowledge item is ever injected into an AI context window
- Only ARC-approved knowledge informs AI responses

---

## 6. Protocol Compliance Checklist

Before any knowledge item is used in AI interactions, all of the following must be true:

- [x] Item has been uploaded with complete metadata (domain, module, standard_ref, source)
- [x] ARC review request has been submitted
- [x] ARC Reviewer has completed the review against all six criteria
- [x] `approval_status` is set to `'approved'` in the `ai_knowledge` table
- [x] `freshness_date` is set to the date of ARC approval
- [x] Entry is recorded in `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md`
- [x] Item is within its 90-day freshness window (or has been re-reviewed)

---

## 7. Escalation Path

| Scenario | Escalation |
|---|---|
| ARC Reviewer is unavailable | Escalate to ARC Chair (CS2 — @APGI-cmy) |
| Review criteria are ambiguous for a specific item | ARC Chair makes final determination; documents reasoning in `arc_notes` |
| Bulk upload exceeds review capacity | CS2 approves prioritisation order; lower-priority items remain `pending` |
| Standard update affects many items simultaneously | CS2 issues a bulk re-review directive; all affected items set to `pending` pending re-review |

---

## 8. Traceability

| Requirement | Source |
|---|---|
| ARC Approval Protocol requirement | Gap 3 — `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` |
| AAWP Wave 9.5 delivery obligation | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` §Wave 9.5 |
| Approval status schema | `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` |
| Runtime enforcement | `packages/ai-centre/src/memory/KnowledgeRetrieverImpl.ts` |
| Knowledge inventory | `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` |
| Architecture freeze | `governance/aimc/freezes/ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md` |
| Test coverage | `packages/ai-centre/src/__tests__/memory/KnowledgeRetrieverApproval.test.ts` (W9.5-T-001 through W9.5-T-007) |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Process Owner**: ARC Chair (CS2)  
**Review Schedule**: Annually or when AIMC architecture changes require protocol update
