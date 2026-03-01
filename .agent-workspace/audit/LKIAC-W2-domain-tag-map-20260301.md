# LKIAC Wave 2 — Domain Tagging Mapping Document

**Document ID**: CL-2-D2 + CL-2-D3 (combined)  
**Wave**: CL-2 (LKIAC Wave 2 — Legacy Knowledge Inventory and Domain Tagging Plan)  
**Status**: DRAFT — Awaiting CS2 Review and Sign-off (CP-2)  
**Version**: 1.0.0  
**Date**: 2026-03-01  
**Produced By**: mat-specialist + governance-liaison-isms-agent (delegated via foreman-v2-agent session-078, Wave CL-2)  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Source References**:
- LKIAC-001 §5 Wave 2; §7
- Combined Plan §CL-2 (CL-2-D2 and CL-2-D3)
- `packages/ai-centre/supabase/migrations/003_ai_knowledge.sql` (AIMC `source` field definition)
- `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` (domain/module fields)
- Inventory: `LKIAC-W2-legacy-inventory-20260301.md` (CL-2-D1)

---

## 1. Purpose

This document maps every legacy knowledge label found in the Maturion Maturity legacy Supabase project (`dmhlxhatogrrrvuruayv`) to the corresponding AIMC `source` field value in the `ai_knowledge` table. It is the authoritative pre-migration tagging reference for CL-5 (knowledge re-ingestion).

**AIMC `ai_knowledge` target schema** (migration 003 + 006):
```sql
ai_knowledge (
  id UUID, organisation_id TEXT, content TEXT,
  source TEXT,           -- domain classification (this document governs mapping)
  embedding VECTOR(1536),
  domain TEXT,           -- AIMC domain (e.g., 'mat', 'pit', 'risk-management')
  module TEXT,           -- AIMC module identifier
  standard_ref TEXT,     -- Standards reference (e.g., 'ISO 27001:2022 A.5.1')
  freshness_date TIMESTAMPTZ,
  approval_status TEXT DEFAULT 'pending' -- ARC lifecycle
)
```

---

## 2. Baseline AIMC Source Taxonomy (LKIAC-001 §7.3)

The following `source` values are the AIMC baseline taxonomy as specified in the Combined Plan §CL-2:

| `source` Value | Description |
|---|---|
| `iso27001` | Content aligned to ISO/IEC 27001 information security management standard |
| `nist` | Content aligned to NIST frameworks (CSF, SP 800-series, etc.) |
| `pci-dss` | Content aligned to PCI-DSS payment card industry standard |
| `soc2` | Content aligned to SOC 2 trust services criteria |
| `risk-management` | General risk management content not tied to a specific standard |
| `general` | Generic or uncategorised knowledge content |

---

## 3. Mapping: `document_type` (Primary Label) → AIMC `source`

The `document_type` column is the primary classification label on `ai_documents`. Every knowledge chunk inherits this label from its parent document.

| Legacy `document_type` | Mapped AIMC `source` | Confidence | Mapping Rationale | Action |
|---|---|---|---|---|
| `maturity_model` | `general` | **HIGH** | Maturion LDCS maturity model content is proprietary — not aligned to a specific external standard (ISO/NIST/PCI/SOC2). Maps to `general` pending CS2 decision on extended taxonomy (§7). | Map to `general`. Propose `ldcs` extension tag (see §7). |
| `sector_context` | `general` | **MEDIUM** | Sector context documents may contain ISO-aligned or risk-management content depending on document content. Without live tag inspection, default to `general`. | Map to `general`. Flag for content review post-migration. |
| `scoring_logic` | `general` | **HIGH** | Internal scoring algorithms are proprietary Maturion constructs. No external standard alignment. | Map to `general`. |
| `sop_template` | `general` | **HIGH** | Standard Operating Procedure templates are organisation-specific. No standard-specific alignment. | Map to `general`. |
| `general` | `general` | **HIGH** | Direct passthrough. | Map to `general`. |
| `mps_document` | `general` | **HIGH** | Maturity Practice Statement documents are Maturion LDCS constructs. No external standard alignment at the `document_type` level. Sub-chunks may contain ISO references — use `standard_ref` column for that. | Map to `general`. Populate `standard_ref` field during CL-5 where specific clause references are detectable. |
| `iso_alignment` | `iso27001` | **HIGH** | The label explicitly signals ISO alignment. Maps to `iso27001`. | Map to `iso27001`. **Verify** whether content is specifically ISO 27001 or a broader ISO family (ISO 27002, ISO 27005) — update `standard_ref` accordingly during CL-5. |
| `assessment_framework_component` | `general` | **MEDIUM** | Assessment framework components are LDCS-internal constructs. Could span multiple standards. Maps to `general`. | Map to `general`. Propose `assessment-framework` extension tag (§7) for finer retrieval control. |

---

## 4. Mapping: `doc_type` (Secondary Label) → AIMC `source`

The `doc_type` column is a secondary label added in September 2025. It overlaps with `document_type` but is derived differently (filename/MIME pattern matching). Use `doc_type` as a **supplementary signal** during CL-5 ingestion — it does not override the `document_type` mapping above but may be used to refine `source` assignment.

| Legacy `doc_type` | Mapped AIMC `source` | Confidence | Mapping Rationale | Action |
|---|---|---|---|---|
| `organization_profile` | `general` | **HIGH** | Organisation profile content is org-specific, no standard alignment. | Map to `general`. Populate `module: 'mat'` in `ai_knowledge.module` (org profiles feed MAT advisor). |
| `diamond_knowledge_pack` | ⚠️ **UNMAPPABLE — CS2 DECISION REQUIRED** | **LOW** | The "Diamond Knowledge Pack" is a Maturion-specific content bundle. Content may cover risk management, sector compliance, diamond industry regulations, or LDCS-specific guidance. Cannot be reliably mapped without content review. | **FLAG FOR CS2** (see §6). Proposed interim: `general`. Proposed new tag: `diamond-industry` (see §7). |
| `web_crawl` | `general` | **MEDIUM** | Web-crawled content is unclassified by nature. Content could span any domain. Without live URL/content analysis, `general` is the safe default. | Map to `general`. Post-migration ARC review should reclassify high-value chunks. |
| `training_slide` | `general` | **HIGH** | Training slides (PowerPoint/similar) are educational content. Unless explicitly ISO/NIST-titled, map to `general`. | Map to `general`. Consider `standard_ref` population if slide titles include specific standard references. |
| `general` | `general` | **HIGH** | Direct passthrough. | Map to `general`. |

---

## 5. Mapping: `org_page_chunks` (Web Crawl) → AIMC `source`

`org_page_chunks` carries no `document_type` or `doc_type` label. Classification must be derived from the parent `org_pages.url` and `org_pages.domain`.

| Classification Approach | Recommended AIMC `source` | Notes |
|---|---|---|
| Default (all `org_page_chunks`) | `general` | Safe default — web crawl content is unclassified |
| URL pattern match: `iso.org/*` | `iso27001` | If URL is from iso.org and path suggests 27001 scope |
| URL pattern match: `nist.gov/*` | `nist` | If URL is from nist.gov |
| URL pattern match: `pcisecuritystandards.org/*` | `pci-dss` | If URL is from PCI SSC |
| URL pattern match: `aicpa.org/*` | `soc2` | If URL is from AICPA (SOC 2 authority) |
| URL pattern match: internal org domain | `general` | Organisation-internal crawled content |

**Decision required**: Should `org_page_chunks` be included in the CL-5 migration scope at all? These chunks are org-specific web content with no structured classification. Recommendation: **include in migration scope but classify all as `source = 'general'`** with `module = 'mat'` and `approval_status = 'pending'` for ARC review.

---

## 6. Unmappable Labels — CS2 Decision Required

The following labels cannot be reliably mapped without CS2 decision or content-level review:

| Label | Table | Column | Reason Unmappable | Recommended Action | Interim Mapping |
|---|---|---|---|---|---|
| `diamond_knowledge_pack` | `ai_documents` | `doc_type` | Maturion-specific content bundle with unknown sub-topics. May span risk, sector compliance, LDCS, or diamond industry regulation. Content review required to determine appropriate `source` mapping. | CS2 to review Diamond Knowledge Pack content and authorise either (a) `general`, (b) new `diamond-industry` tag, or (c) content-by-content review during CL-5. | `general` (interim pending CS2 decision) |
| `assessment_framework_component` | `ai_documents` | `document_type` | Could legitimately contain ISO, NIST, or risk-management content depending on which framework component. A single `source` tag may lose fidelity. | Consider whether a `source` of `general` with rich `standard_ref` values captures sufficient granularity. | `general` |
| `tags TEXT[]` (free-form) | `ai_document_chunks` | `tags` | Content of the `tags` array is unknown without live DB access. Tags may introduce additional unmapped labels not visible from schema inspection alone. | Run Q4 from CL-2-D1 §5 to enumerate distinct tag values. Re-evaluate mapping if new labels emerge. | Defer until live count obtained |

---

## 7. Extended Source Taxonomy Proposal (CL-2-D3)

**Produced by**: governance-liaison-isms-agent

The baseline LKIAC-001 §7.3 taxonomy (`iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`, `general`) does not fully cover the Maturion legacy knowledge domain. The following extensions are proposed:

### 7.1 Proposed Extended Tags

| Proposed `source` Value | Justification | Urgency |
|---|---|---|
| `ldcs` | Maturion LDCS (Local Diamonds Compliance Standard) is a distinct regulatory framework used throughout the legacy knowledge base. `maturity_model`, `mps_document`, and `assessment_framework_component` chunks are primarily LDCS-aligned. Treating them as `general` loses retrievability for LDCS-specific queries. | **HIGH** — required for Wave 3 semantic retrieval quality |
| `maturity-model` | The Maturion maturity model (`maturity_model`, `mps_document` document types) is a distinct, queryable knowledge domain. Specialists querying maturity guidance should be able to filter by this source. | **MEDIUM** — improves retrieval precision for MAT advisor |
| `diamond-industry` | Diamond industry sector content (referenced in `diamond_knowledge_pack`) covers regulation, trade, certification, and ESG topics specific to the diamond sector. This is a primary use case for Maturion's clients. | **HIGH** — required before diamond-industry queries are meaningful |
| `assessment-framework` | Assessment framework components (`assessment_framework_component` document type) describe how the framework operates — distinct from the content it assesses. Useful for internal routing. | **LOW** — nice-to-have; `general` is acceptable interim |

### 7.2 Proposed `domain` Field Mapping (AIMC `ai_knowledge.domain`)

The `ai_knowledge` table also has a `domain` column. This should map to the AIMC module that will primarily consume the knowledge chunk:

| Legacy Knowledge Category | Recommended `ai_knowledge.domain` | Notes |
|---|---|---|
| `maturity_model`, `mps_document`, `assessment_framework_component` | `mat` | MAT advisor primary consumer |
| `iso_alignment` | `mat` + `risk-management` | May be consumed by both MAT and risk modules |
| `sector_context`, `diamond_knowledge_pack` | `mat` | Sector context primarily used by MAT maturity assessments |
| `scoring_logic` | `mat` | Internal to MAT scoring |
| `sop_template` | `general` | Organisation-specific; no single module owner |
| `web_crawl`, `training_slide` | `mat` | Default to MAT; ARC review may reclassify |
| `organization_profile` | `mat` | Feeds MAT organisation context |

### 7.3 CS2 Decision Points for Extended Taxonomy

CS2 must decide the following before CL-5 may begin:

| Decision Point | Options | Recommendation |
|---|---|---|
| **D-1**: Adopt `ldcs` as a new `source` tag? | (a) Yes — add to AIMC `source` CHECK constraint; (b) No — use `general` with `standard_ref = 'LDCS'` | Recommend: **(a) Yes** — LDCS is central to Maturion's value proposition and must be retrievable |
| **D-2**: Adopt `maturity-model` as a new `source` tag? | (a) Yes — add to CHECK constraint; (b) No — use `general` | Recommend: **(b) No** — use `domain = 'mat'` and `standard_ref = 'LDCS-MATURITY'` for sufficient precision |
| **D-3**: Adopt `diamond-industry` as a new `source` tag? | (a) Yes — add to CHECK constraint; (b) No — use `general` | Recommend: **(a) Yes** — Diamond Knowledge Pack is a named, queryable asset class |
| **D-4**: Include `org_page_chunks` in CL-5 migration scope? | (a) Yes, all as `source = 'general'`; (b) Yes, URL-based classification; (c) No | Recommend: **(a) Yes, all as `source = 'general'`** — capture value, classify later via ARC |
| **D-5**: Review `diamond_knowledge_pack` content before tagging? | (a) Yes — content review before CL-5; (b) No — tag as `general` and reclassify via ARC | Recommend: **(a) Yes** — defer CL-5 for diamond packs until content reviewed |

---

## 8. Full Consolidated Mapping Table

This table consolidates all mappings for use as the migration reference during CL-5:

| Legacy Label Type | Legacy Value | AIMC `source` | AIMC `domain` | Notes |
|---|---|---|---|---|
| `document_type` | `maturity_model` | `general` → `ldcs` (pending D-1) | `mat` | See D-1 decision |
| `document_type` | `sector_context` | `general` | `mat` | Content review recommended |
| `document_type` | `scoring_logic` | `general` | `mat` | Internal construct |
| `document_type` | `sop_template` | `general` | `general` | Org-specific |
| `document_type` | `general` | `general` | `general` | Default passthrough |
| `document_type` | `mps_document` | `general` → `ldcs` (pending D-1) | `mat` | See D-1 decision |
| `document_type` | `iso_alignment` | `iso27001` | `mat` | High confidence |
| `document_type` | `assessment_framework_component` | `general` | `mat` | Could be extended; see D-2 |
| `doc_type` | `organization_profile` | `general` | `mat` | Org-specific context |
| `doc_type` | `diamond_knowledge_pack` | `general` → `diamond-industry` (pending D-3, D-5) | `mat` | CS2 decision required |
| `doc_type` | `web_crawl` | `general` | `general` | URL classification optional |
| `doc_type` | `training_slide` | `general` | `mat` | Default; `standard_ref` if slide titled |
| `doc_type` | `general` | `general` | `general` | Default passthrough |
| `org_page_chunks` | (no label) | `general` | `general` | URL-based refinement possible |
| `criteria_chunks` (deprecated) | (unknown) | ❌ Requires live query | ❌ PENDING — deprecated table; live query required | Residual rows must be assessed |

---

## 9. `source` CHECK Constraint Amendment (if extended tags adopted)

If CS2 approves extensions in §7 (specifically D-1 and D-3), the `ai_knowledge.source` column CHECK constraint must be amended in CL-5 schema preparation:

**Current constraint** (migration 003):
> `source` has no CHECK constraint — it is a free-form TEXT column.

**Existing values in AIMC**: Per Combined Plan §CL-2, the baseline values are `iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`, `general`. These are not enforced by a CHECK constraint in the current schema — they are convention-level.

**Proposed constraint** (if D-1 and D-3 approved):
```sql
-- To be added in CL-5 schema preparation migration
ALTER TABLE ai_knowledge
  ADD CONSTRAINT ai_knowledge_source_check
  CHECK (source IN (
    'iso27001', 'nist', 'pci-dss', 'soc2',
    'risk-management', 'general',
    'ldcs', 'diamond-industry'  -- new tags from CL-2-D3
  ));
```

> **Note**: This amendment should be included in the CL-5 wave scoping as a schema step preceding ingestion.

---

## 10. Sign-off Required

| Sign-off | From | Status |
|---|---|---|
| CP-2: Domain tagging mapping approved | CS2 (@APGI-cmy) | ❌ PENDING |
| D-1: `ldcs` tag adoption decision | CS2 (@APGI-cmy) | ❌ PENDING |
| D-2: `maturity-model` tag decision | CS2 (@APGI-cmy) | ❌ PENDING |
| D-3: `diamond-industry` tag adoption decision | CS2 (@APGI-cmy) | ❌ PENDING |
| D-4: `org_page_chunks` migration scope decision | CS2 (@APGI-cmy) | ❌ PENDING |
| D-5: Diamond Knowledge Pack content review gate | CS2 (@APGI-cmy) | ❌ PENDING |
| Live row counts reviewed | CS2 (@APGI-cmy) | ❌ PENDING — requires live DB query |

> **No migration (CL-5) may begin until all sign-offs above are recorded.**

---

*End of CL-2-D2 + CL-2-D3 — Domain Tagging Mapping Document and Extended Source Taxonomy Proposal*
