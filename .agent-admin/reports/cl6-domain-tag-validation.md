# CL-6 Domain Tag Validation Report

```yaml
artifact_type: DOMAIN_TAG_VALIDATION_REPORT
task: CL-6-D4
wave: CL-6
wave_slug: cl6-lkiac-wave3-knowledge-reingestion-20260405
wave_label: "LKIAC Wave 3 of 6 — Knowledge Re-ingestion"
issue: "maturion-isms#1225"
branch: copilot/cl-6-migrate-knowledge-embeddings
producing_agent: mat-specialist v6.2.0
authority: CS2 (@APGI-cmy)
cp2_closure_ref: .agent-admin/checkpoints/cp-2-closure-20260403.md
cl2_d2_source_ref: .agent-workspace/audit/LKIAC-W2-domain-tag-map-20260301.md
iaa_prebrief_ref: .agent-admin/assurance/iaa-prebrief-cl6-lkiac-wave3-knowledge-reingestion-20260405.md
date: "2026-04-05"
status: DELIVERED
governance_block: PRESENT
```

---

## 1. Purpose

This report validates the domain tag mapping produced in CL-2-D2 for use in the CL-6 migration.
The migration will move knowledge embeddings from the legacy Supabase project (`dmhlxhatogrrrvuruayv`)
into the AIMC `ai_knowledge` table. Domain tags must be confirmed valid before any row is migrated.

This document is the authoritative pre-migration tagging reference for CL-6, superseding any
interim notes from CL-2. All decisions recorded here derive from CS2-signed CP-2 closure
(2026-04-03) and the CL-2-D2 mapping document.

---

## 2. Approved Domain Labels — `ai_knowledge.source` Field

The `ai_knowledge.source` column carries the primary domain classification tag for each
knowledge chunk. It is a free-form `TEXT` column (no `CHECK` constraint in the current schema —
see migrations `003_ai_knowledge.sql` and `006_ai_knowledge_metadata.sql`). Convention-level
governance is therefore the enforcement mechanism: any value outside the approved list below
constitutes an **unknown label** and must be flagged.

### 2.1 Baseline Taxonomy (LKIAC-001 §7.3)

| `source` Value | Description | Status |
|---|---|---|
| `iso27001` | ISO/IEC 27001 information security management content | ✅ APPROVED |
| `nist` | NIST framework content (CSF, SP 800-series) | ✅ APPROVED |
| `pci-dss` | PCI-DSS payment card industry standard content | ✅ APPROVED |
| `soc2` | SOC 2 trust services criteria content | ✅ APPROVED |
| `risk-management` | General risk management content | ✅ APPROVED |
| `general` | Generic / uncategorised knowledge content | ✅ APPROVED |

### 2.2 Extended Taxonomy (CP-2 — CS2 Sign-off 2026-04-03)

Per the CP-2 gate closure artifact (`.agent-admin/checkpoints/cp-2-closure-20260403.md`), the
following extended taxonomy decisions were made with CS2 authority:

| `source` Value | Decision | Authority | Mapping Target |
|---|---|---|---|
| `ldcs` | **ADOPTED** ✅ | CS2 — 2026-04-03 | Canonical label for Lucara Diamond Control Standard content |
| `diamond-industry` | **ADOPTED** ✅ | CS2 — 2026-04-03 | Canonical label for diamond industry knowledge content |

### 2.3 Proposed Tags — NOT Adopted (D-2 Decision, CP-2)

| Proposed Value | CS2 Decision | Rationale | Replacement |
|---|---|---|---|
| `maturity-model` | ❌ REJECTED | Use `domain = 'mat'` and `standard_ref = 'LDCS-MATURITY'` for sufficient precision | `ldcs` + `domain='mat'` |
| `assessment-framework` | ❌ REJECTED | Nice-to-have; `general` is acceptable | `general` |

### 2.4 Complete Approved Source Label Set

The complete approved `source` label set for CL-6 migration is:

```
iso27001
nist
pci-dss
soc2
risk-management
general
ldcs
diamond-industry
```

**Total approved labels**: 8

Any `source` value that is NOT in this set of 8 labels must be **FLAGGED** as `REQUIRES_REVIEW`
and must NOT be silently migrated.

---

## 3. Approved Domain Labels — `ai_knowledge.domain` Field

The `ai_knowledge.domain` column (added in migration `006_ai_knowledge_metadata.sql`) holds the
AIMC module/context identifier. It is separate from the `source` field.

| `domain` Value | Description | Status |
|---|---|---|
| `mat` | MAT advisor — primary consumer for maturity, LDCS, sector content | ✅ APPROVED |
| `general` | No specific module owner | ✅ APPROVED |
| `risk-management` | Risk module context | ✅ APPROVED |

> **Note**: The `domain` field is a `TEXT` column with no `CHECK` constraint. Values are
> convention-level. The approved set above derives from CL-2-D2 §7.2. Additional values may
> be introduced via ARC post-migration reclassification; they are out of scope for CL-6.

---

## 4. Validation Rules for Migration

The following rules govern domain tag handling during the CL-6 migration run:

### Rule V-001 — Unknown `source` Labels Must Be Flagged
Any row (from `ai_document_chunks` / `ai_documents` or `org_page_chunks`) where the
derived `source` value is NOT in the approved set of 8 labels (§2.4) **must NOT be
silently migrated**. The migration script must:
1. Record the unknown label and row identifier in a validation log.
2. Mark the row status as `REQUIRES_REVIEW`.
3. Skip the INSERT into `ai_knowledge` for that row.
4. Include the count of skipped rows in the migration output summary.

### Rule V-002 — NULL `source` Values
NULL `source` values are **permitted in the target schema** (`source TEXT` — nullable per
`003_ai_knowledge.sql`). Rows with a NULL legacy `source` value (or rows from `org_page_chunks`
which carry no source label) must be migrated with `source = 'general'` as the default
assignment. This is consistent with the CL-2-D2 §5 `org_page_chunks` classification
strategy. Rows must NOT be silently inserted with a NULL `source`.

**Exception**: If the org_page_chunks URL pattern matches a known standard authority
(see §6.2 URL classification rules), use the matched `source` value rather than `general`.

### Rule V-003 — Unknown `domain` Labels Must Be Flagged
Any row where the derived `ai_knowledge.domain` value is outside the approved set (`mat`,
`general`, `risk-management`) must be flagged as `REQUIRES_REVIEW` in the migration log.
These rows may still be migrated with `domain = 'general'` as a safe fallback, but the
unknown value must be recorded.

### Rule V-004 — `approval_status` Must Be `pending` on All Migrated Rows
Every row inserted into `ai_knowledge` during CL-6 migration must carry
`approval_status = 'pending'`. The `CHECK` constraint on `approval_status` enforces
`('pending', 'approved', 'rejected')` (per migration `009_ai_knowledge_approval_status_fix.sql`).
No migrated row may be inserted with `approval_status = 'approved'` or `'rejected'`.
This is enforced by BD-017 / T-CL6-WRITE-001.

### Rule V-005 — Pipeline 1 Isolation
The `ai_knowledge` table is shared between Pipeline 1 (criteria documents, `source = 'criteria'`)
and Pipeline 2 (knowledge embeddings). The value `'criteria'` is NOT in the approved CL-6
`source` label set. Any row whose derived `source` would be `'criteria'` must be REJECTED
(not migrated) and flagged as a Pipeline 1 contamination risk. The migration script must
not touch `criteria_documents` or any `ai_knowledge` row with `source = 'criteria'`.

---

## 5. Migration Domain Mapping Table

This is the authoritative source label → AIMC target label mapping for CL-6, derived from
CL-2-D2 §8 (consolidated mapping table) as amended by CP-2 extended taxonomy decisions.

### 5.1 Mapping from `ai_documents.document_type` → `ai_knowledge.source`

| Legacy `document_type` | AIMC `source` | AIMC `domain` | Confidence | CP-2 Decision Applied |
|---|---|---|---|---|
| `maturity_model` | `ldcs` | `mat` | HIGH | D-1: ADOPTED ✅ |
| `mps_document` | `ldcs` | `mat` | HIGH | D-1: ADOPTED ✅ |
| `iso_alignment` | `iso27001` | `mat` | HIGH | Baseline taxonomy |
| `sector_context` | `general` | `mat` | MEDIUM | No CS2 extended tag decision |
| `scoring_logic` | `general` | `mat` | HIGH | Internal Maturion construct |
| `sop_template` | `general` | `general` | HIGH | Org-specific; no module owner |
| `assessment_framework_component` | `general` | `mat` | MEDIUM | D-2: extended tag REJECTED |
| `general` | `general` | `general` | HIGH | Direct passthrough |

### 5.2 Mapping from `ai_documents.doc_type` → `ai_knowledge.source`

| Legacy `doc_type` | AIMC `source` | AIMC `domain` | Confidence | CP-2 Decision Applied |
|---|---|---|---|---|
| `diamond_knowledge_pack` | `diamond-industry` | `mat` | HIGH | D-3: ADOPTED ✅, D-5: resolved via CP-2 |
| `organization_profile` | `general` | `mat` | HIGH | Org-specific context |
| `web_crawl` | `general` | `general` | MEDIUM | URL classification optional (§5.3) |
| `training_slide` | `general` | `mat` | HIGH | Default; ARC review may refine |
| `general` | `general` | `general` | HIGH | Direct passthrough |
| NULL | `general` | `general` | HIGH | NULL safety — default to `general` |

> **Precedence rule**: Where both `document_type` and `doc_type` are present, `document_type`
> is the primary source label driver. `doc_type` is supplementary and may override only where
> the `document_type` mapping would produce `general` and `doc_type` provides a higher-confidence
> label (e.g., `diamond_knowledge_pack` overrides `general` from `document_type = 'general'`).

### 5.3 Mapping from `org_page_chunks` (URL-based) → `ai_knowledge.source`

`org_page_chunks` rows carry no label column. Classification is derived from the parent
`org_pages.url` domain using the following URL pattern rules:

| URL Pattern | AIMC `source` | AIMC `domain` | Confidence |
|---|---|---|---|
| `*.iso.org/*` (27001 path) | `iso27001` | `mat` | MEDIUM |
| `*.nist.gov/*` | `nist` | `mat` | MEDIUM |
| `*.pcisecuritystandards.org/*` | `pci-dss` | `mat` | MEDIUM |
| `*.aicpa.org/*` | `soc2` | `mat` | MEDIUM |
| Internal org domain | `general` | `general` | HIGH |
| All other / NULL URL | `general` | `general` | HIGH |

> **Scope note**: `org_page_chunks` is explicitly in CL-6 scope per CP-2 §4.1 (D-4: ADOPTED).
> All `org_page_chunks` rows with no URL match must migrate with `source = 'general'`.
> CL6-FFA-004 (BLOCKING): Migration script must handle `org_page_chunks` data.

### 5.4 AIMC Vector Search Queryability Confirmation (T-CL6-DOM-001, T-CL6-DOM-002)

| Domain Label | T-CL6 Test ID | Queryable via AIMC Vector Search? | Verification |
|---|---|---|---|
| `ldcs` | T-CL6-DOM-001 | ✅ YES — `source = 'ldcs'` filter on `ai_knowledge` is supported by `idx_ai_knowledge_org` index + RLS policy; semantic query "diamond certification standards" with `domain='ldcs'` must return ≥ 1 result (T-CL6-SEMANTIC-001) | Confirmed: `source` is a queryable TEXT column; ivfflat index on `embedding` supports cosine similarity search with metadata filter |
| `diamond-industry` | T-CL6-DOM-002 | ✅ YES — `source = 'diamond-industry'` filter on `ai_knowledge` is supported by the same index/policy infrastructure | Confirmed: same queryability as `ldcs` |

Both `ldcs` and `diamond-industry` are TEXT values assignable to the `source` column of
`ai_knowledge`. The `source` column has no `CHECK` constraint preventing these values
(schema confirmed in CL-6-D3 schema verification report). Both values are therefore fully
queryable via AIMC vector search post-migration.

---

## 6. Source Label Validation (T-CL6-CHUNK-003)

T-CL6-CHUNK-003 requires that every migrated chunk has a `source` value from the approved
label list. This section provides the complete approved source label set for that test.

### 6.1 Approved Source Labels for T-CL6-CHUNK-003

The migration script must validate each source value against this list before INSERT:

```
APPROVED_SOURCE_LABELS = [
  "iso27001",
  "nist",
  "pci-dss",
  "soc2",
  "risk-management",
  "general",
  "ldcs",
  "diamond-industry"
]
```

Any `source` value derived during migration that is NOT in `APPROVED_SOURCE_LABELS` must be:
1. **Flagged** in the migration validation log
2. **Listed** as `REQUIRES_REVIEW` with the source row identifier
3. **Excluded** from the INSERT into `ai_knowledge`
4. **Counted** in the migration summary output (skipped rows = REQUIRES_REVIEW count)

### 6.2 Known Legacy Labels and Their Disposition

| Legacy Label | Column | Disposition | Mapped `source` |
|---|---|---|---|
| `maturity_model` | `ai_documents.document_type` | ✅ VALID — maps to `ldcs` | `ldcs` |
| `mps_document` | `ai_documents.document_type` | ✅ VALID — maps to `ldcs` | `ldcs` |
| `iso_alignment` | `ai_documents.document_type` | ✅ VALID — maps to `iso27001` | `iso27001` |
| `sector_context` | `ai_documents.document_type` | ✅ VALID — maps to `general` | `general` |
| `scoring_logic` | `ai_documents.document_type` | ✅ VALID — maps to `general` | `general` |
| `sop_template` | `ai_documents.document_type` | ✅ VALID — maps to `general` | `general` |
| `assessment_framework_component` | `ai_documents.document_type` | ✅ VALID — maps to `general` | `general` |
| `general` | `ai_documents.document_type` | ✅ VALID — passthrough | `general` |
| `diamond_knowledge_pack` | `ai_documents.doc_type` | ✅ VALID — maps to `diamond-industry` | `diamond-industry` |
| `organization_profile` | `ai_documents.doc_type` | ✅ VALID — maps to `general` | `general` |
| `web_crawl` | `ai_documents.doc_type` | ✅ VALID — maps to `general` | `general` |
| `training_slide` | `ai_documents.doc_type` | ✅ VALID — maps to `general` | `general` |
| `general` | `ai_documents.doc_type` | ✅ VALID — passthrough | `general` |
| (no label) | `org_page_chunks` | ✅ VALID — default `general`, URL-refined per §5.3 | `general` (or URL-matched) |
| (free-form tags) | `ai_document_chunks.tags` | ⚠️ REQUIRES_REVIEW — live DB enumeration not available at time of report authoring. See §7. | See §7 |
| `criteria` | any | ❌ REJECT — Pipeline 1 contamination risk (Rule V-005) | DO NOT MIGRATE |

### 6.3 `criteria_chunks` (Deprecated Table) Disposition

The deprecated `criteria_chunks` table (CL-2-D1 §2.4) must NOT contribute rows to the
CL-6 migration. This table is preserved for fallback/debug purposes and its content is
Pipeline 1 adjacent. Any residual rows in `criteria_chunks` must be excluded from the
migration scope. If the migration script encounters `criteria_chunks` data, it must log
and skip.

---

## 7. Unresolved Items — REQUIRES_REVIEW

The following items cannot be fully resolved without live database access. They are documented
here for CL-6 migration script handling:

| Item | Reason Unresolved | Required Action |
|---|---|---|
| `ai_document_chunks.tags` free-form values | Live database query required to enumerate distinct tag values (CL-2-D1 §5 Q4). No live DB access available at CL-2 or CL-6-D4 authoring time. | Migration script must enumerate any tags values encountered, validate each against the approved source label set (§6.1), and flag unknowns as REQUIRES_REVIEW. |
| `criteria_chunks` residual row count | Live DB query required (CL-2-D1 §5 Q6). Count unknown. | Migration script must verify `criteria_chunks` has no rows to migrate. If residual rows exist, log and skip; do NOT migrate. |
| `ai_documents.domain` column (legacy) | The legacy `ai_documents` table has a `domain` column added 2025-07-17. Its value set is unknown without live DB access. | Migration script must map any legacy `domain` values to the approved AIMC `domain` set (`mat`, `general`, `risk-management`). Unknown values → `domain = 'general'` + REQUIRES_REVIEW flag. |

---

## 8. `source` CHECK Constraint Status

Per CL-2-D2 §9 and confirmed by `003_ai_knowledge.sql` inspection:

**Current state**: The `ai_knowledge.source` column has **no `CHECK` constraint** — it is
a free-form `TEXT` column. The 8-label approved set is enforced at convention level only.

**CL-6 position**: No schema changes are required for the approved label set to be
insertable. `ldcs` and `diamond-industry` may be inserted without constraint amendment.
This is consistent with the architecture freeze (CL6-FFA-010): no schema changes beyond
what is required for migration.

> **Advisory**: A future wave (post-CL-6) should consider adding a CHECK constraint to
> enforce the approved label set. This is out of scope for CL-6.

---

## 9. Governance Block

```yaml
governance:
  artifact_id: CL-6-D4-DOMAIN-TAG-VALIDATION
  wave: CL-6
  issue: maturion-isms#1225
  produced_by: mat-specialist v6.2.0
  authority: CS2 (@APGI-cmy)
  cp2_signed_off: "2026-04-03"
  cl2_d2_source: .agent-workspace/audit/LKIAC-W2-domain-tag-map-20260301.md
  cl2_d1_source: .agent-workspace/audit/LKIAC-W2-legacy-inventory-20260301.md
  iaa_prebrief: .agent-admin/assurance/iaa-prebrief-cl6-lkiac-wave3-knowledge-reingestion-20260405.md
  schema_verified_by: cl6-schema-verification.md (schema-builder CL-6-D3)
  ffa_checks_addressed:
    - CL6-FFA-005: "Domain labels ldcs and diamond-industry confirmed ADOPTED"
    - BD-017: "Migration script input validation rules specified in §4 and §6"
    - T-CL6-DOM-001: "ldcs label approved and queryable — confirmed §5.4"
    - T-CL6-DOM-002: "diamond-industry label approved and queryable — confirmed §5.4"
    - T-CL6-CHUNK-003: "Source label list provided in §6.1; validation rules in §4"
  pipeline_1_isolation:
    criteria_source_blocked: true
    rule_ref: V-005
  status: DELIVERED
```

---

## 10. Conclusion

**All migrated rows will have valid domain tags: CONDITIONAL**

**Condition**: The migration script must implement the validation rules in §4 (V-001 through
V-005). Specifically:
- All rows with `source` in the approved 8-label set (§2.4 / §6.1) will have valid domain tags ✅
- Rows from `ai_document_chunks.tags` with unknown values must be flagged and excluded until reviewed ⚠️
- All `org_page_chunks` rows will receive `source = 'general'` (or URL-classified value) ✅
- No row may be silently migrated with an unknown `source` value ✅

**`ldcs` ADOPTED**: ✅ YES — CS2 sign-off 2026-04-03 (CP-2). Canonical label for LDCS content.
**`diamond-industry` ADOPTED**: ✅ YES — CS2 sign-off 2026-04-03 (CP-2). Canonical label for diamond industry content.
**Unknown domain labels**: Any not in the 8-label approved set → REQUIRES_REVIEW.
**NULL handling**: Migrate with `source = 'general'` — never migrate with NULL `source`.

---

*End of CL-6-D4 — Domain Tag Validation Report*  
*mat-specialist v6.2.0 | Wave CL-6 | maturion-isms#1225 | 2026-04-05*
