# Architecture Freeze — Wave 9.5 Knowledge Base Inventory + ARC Protocol

## 1. Freeze Declaration

| Field | Value |
|---|---|
| **Freeze ID** | ARCH-FREEZE-WAVE9-KB-ARC-20260227 |
| **Date** | 2026-02-27 |
| **Applies to** | Wave 9.2 (ai_knowledge amendment) / Wave 9.5 (Governance + API) |
| **Status** | ✅ FROZEN |
| **Frozen by** | foreman-v2-agent (session-069-20260227) |
| **Authority** | CS2 — @APGI-cmy (Johan Ras) — Issue #658 |
| **Governing audit** | `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` — Gap 3: Knowledge Base Inventory and ARC Approval Protocol |

**This document is frozen. Any change requires explicit CS2 written approval and an amendment to this document. Silent drift is prohibited (A-001).**

---

## 2. Problem Definition

### 2.1 Audit Gap

Post-Wave 8 functionality audit (`governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md`, Gap 3) identified:
- No canonical documentation for the Knowledge Base Inventory
- No machine-readable list of available knowledge items, their approval status, domain/module info, publication/freshness dates, or ARC review outcomes
- No formal ARC Knowledge Promotion Protocol documented for the review, approval, and periodic refresh of knowledge items
- The retriever implementation is not enforced to filter knowledge by ARC approval status

### 2.2 Impacted Subwaves

- **Wave 9.2** (partial completion): `ai_knowledge` table requires additional metadata columns (`domain`, `module`, `standard_ref`, `freshness_date`, `approval_status`)
- **Wave 9.5** (new): Knowledge Base Inventory governance document, ARC Knowledge Promotion Protocol governance document, and KnowledgeRetriever approval filter

---

## 3. Scope

### IN SCOPE — Wave 9.2 (ai_knowledge amendment)

| Item | Wave | Deliverable |
|---|---|---|
| Migration `006_ai_knowledge_metadata.sql` | 9.2 | Adds `domain TEXT`, `module TEXT`, `standard_ref TEXT`, `freshness_date TIMESTAMPTZ`, `approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'retired'))` to `ai_knowledge` |

### IN SCOPE — Wave 9.5

| Item | Deliverable |
|---|---|
| `AIMC_KNOWLEDGE_BASE_INVENTORY.md` | Canonical listing of all knowledge items by domain, module, source, upload date, last-reviewed date, ARC approval status |
| `AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` | Step-by-step workflow: upload → ARC review → approve → tag freshness date → periodic refresh |
| `KnowledgeRetrieverImpl` approval filter | `retrieve()` filters by `approvalStatus === 'approved'`; `pending` and `retired` entries excluded from context |

### OUT OF SCOPE

- Changes to `KnowledgeRetriever` interface signature (retrieve() signature unchanged)
- Wave 9.4 ARC approval endpoint (separate wave)
- Removal of legacy feedback tables (Wave 9.11)

---

## 4. Architecture Specification (LOCKED)

### 4.1 Schema Amendment — Wave 9.2 (`006_ai_knowledge_metadata.sql`)

**Migration file** (locked): `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql`

**New columns on `ai_knowledge`** (locked):
```sql
ALTER TABLE ai_knowledge
  ADD COLUMN IF NOT EXISTS domain          TEXT,
  ADD COLUMN IF NOT EXISTS module          TEXT,
  ADD COLUMN IF NOT EXISTS standard_ref    TEXT,
  ADD COLUMN IF NOT EXISTS freshness_date  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending'
    CHECK (approval_status IN ('pending', 'approved', 'retired'));
```

**Default value** (locked): `approval_status` defaults to `'pending'` (new knowledge not yet ARC-approved).

**Index** (locked): Index on `approval_status` for efficient ARC-status filtered queries.

**Constraints**:
- `approval_status` CHECK constraint: only `'pending'`, `'approved'`, `'retired'` permitted
- All new columns are nullable (backward compatible with existing rows)

### 4.2 KnowledgeRetriever Approval Filter — Wave 9.5

**Interface** (unchanged, Wave 5):
```typescript
export interface KnowledgeRetriever {
  retrieve(query: string, organisationId: string, limit?: number): Promise<KnowledgeEntry[]>;
}
```

**KnowledgeEntry type extension** (locked):
```typescript
export interface KnowledgeEntry {
  content: string;
  source?: string;
  approvalStatus?: 'pending' | 'approved' | 'retired';  // NEW: from Wave 9.5
}
```

**Filter contract** (locked):
- Any concrete `KnowledgeRetriever` implementation MUST filter entries to return ONLY those with `approvalStatus === 'approved'`
- Entries with `approvalStatus === 'pending'` MUST be excluded
- Entries with `approvalStatus === 'retired'` MUST be excluded
- Entries with no `approvalStatus` (undefined/null) MUST be treated as `'pending'` and excluded

**Implementation location** (locked):
- `KnowledgeRetrieverImpl` class in `packages/ai-centre/src/memory/KnowledgeRetrieverImpl.ts`
- All existing `MemoryLifecycle` wiring via `KnowledgeRetriever` interface remains unchanged

### 4.3 Governance Documents — Wave 9.5

**`governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md`** (locked location):
- Canonical table of all knowledge items
- Required columns: ID, domain, module, standard_ref, source_document, upload_date, freshness_date, approval_status, arc_reviewed_by, arc_reviewed_at, arc_notes
- Section for ARC review outcomes per item
- Linked to audit gap (Gap 3) and Wave 9.5

**`governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`** (locked location):
- Stepwise ARC review process: upload → review → approve/reject → tag → periodic refresh → retire
- Roles: Knowledge Uploader, ARC Reviewer (CS2), Knowledge Steward
- Approval status lifecycle: `pending` → `approved` → `retired`
- Freshness policy: review required after 90 days or on standard update
- References: AAWP Wave 9.5, Gap 3 audit, `006_ai_knowledge_metadata.sql`

---

## 5. RED Gate QA Requirements (LOCKED)

### 5.1 Wave 9.2 — ai_knowledge Metadata Columns

| Test ID | Description |
|---|---|
| W9.2-T-011 | Migration file `006_ai_knowledge_metadata.sql` exists |
| W9.2-T-012 | Migration contains `ALTER TABLE ai_knowledge` |
| W9.2-T-013 | Migration adds `domain` column (TEXT) |
| W9.2-T-014 | Migration adds `module` column (TEXT) |
| W9.2-T-015 | Migration adds `standard_ref` column (TEXT) |
| W9.2-T-016 | Migration adds `freshness_date` column (TIMESTAMPTZ) |
| W9.2-T-017 | Migration adds `approval_status` with CHECK(pending/approved/retired) |
| W9.2-T-018 | Migration creates index on `approval_status` |

### 5.2 Wave 9.5 — KnowledgeRetriever Approval Filter

| Test ID | Description |
|---|---|
| W9.5-T-001 | `retrieve()` with only `approved` entries returns all of them |
| W9.5-T-002 | `retrieve()` with mixed `approved`/`pending` entries returns only `approved` |
| W9.5-T-003 | `retrieve()` with mixed `approved`/`retired` entries returns only `approved` |
| W9.5-T-004 | `retrieve()` with only `pending` entries returns empty array |
| W9.5-T-005 | `retrieve()` with only `retired` entries returns empty array |
| W9.5-T-006 | `retrieve()` with undefined `approvalStatus` treats as `pending` and excludes |
| W9.5-T-007 | `KnowledgeEntry` type supports `approvalStatus` field |

---

## 6. Dependencies

| Wave | Dependency |
|---|---|
| 9.5 | 9.2 must be Foreman-certified complete before 9.5 wave-start |
| 9.5 api-builder | qa-builder RED tests must be failing before api-builder begins |

---

## 7. Regression Requirements

- All prior wave tests (Wave 1–9.3) PASS GREEN — zero regressions
- `MemoryLifecycle.rag.test.ts` — all 5 tests PASS (backward compat preserved)
- Zero compiler or linter warnings
- Zero skipped or TODO tests

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Source**: AAWP v0.2.0 §Wave 9.2, §Wave 9.5 | AUDIT Gap 3
**Frozen by**: foreman-v2-agent v6.2.0 (session-069-20260227)
**Self-Modification Lock**: SELF-MOD-FM-001 — Any change requires CS2 written approval
