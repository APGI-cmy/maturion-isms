# AIMC Knowledge Base Inventory

**Document Type**: Governance Artefact — Wave 9.5 Deliverable  
**Status**: ACTIVE — initial inventory  
**Version**: 1.0.0  
**Effective Date**: 2026-02-27  
**Owner**: Maturion Engineering Leadership (Johan Ras, CS2)  
**Location**: `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md`

**Audit Reference**: Gap 3 — `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md`  
**AAWP Reference**: Wave 9.5 — Governance: Knowledge Base Inventory + ARC Protocol  
**Architecture Reference**: `governance/aimc/freezes/ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md`  
**Schema Reference**: `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql`

---

## 1. Purpose

This document is the **canonical Knowledge Base Inventory** for the Maturion AIMC (AI Management Centre). It provides a machine-readable listing of all knowledge items stored in the `ai_knowledge` table, their domain and module classification, source documents, approval status under the ARC (Adaptive Review Committee) review process, and freshness dates.

This inventory exists to:
- Provide transparency over what knowledge is available to AIMC-governed AI interactions
- Track ARC approval status for each knowledge item (per ARC Knowledge Promotion Protocol)
- Enable freshness monitoring and periodic review scheduling
- Serve as the authoritative record for audit and compliance purposes

---

## 2. Inventory Schema

Each entry in the inventory corresponds to a row in the `ai_knowledge` table (see `supabase/migrations/006_ai_knowledge_metadata.sql`).

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key (database-generated) |
| `organisation_id` | TEXT | Organisation this knowledge item belongs to (tenant isolation) |
| `domain` | TEXT | Domain classification (e.g., `access-control`, `risk-management`) |
| `module` | TEXT | Maturion module this knowledge supports (e.g., `MAT`, `PIT`, `XDETECT`) |
| `standard_ref` | TEXT | Governing standard reference (e.g., `ISO-27001-A.9`, `NIST-SP-800-53-AC-2`) |
| `source` | TEXT | Source document identifier (free text) |
| `upload_date` | TIMESTAMPTZ | When this knowledge item was uploaded (`created_at` in schema) |
| `freshness_date` | TIMESTAMPTZ | When this knowledge item was last reviewed/refreshed by ARC |
| `approval_status` | TEXT | ARC approval status: `pending` / `approved` / `retired` |
| `arc_reviewed_by` | TEXT | Identity of ARC reviewer (CS2 or delegated ARC member) — recorded in ARC review process |
| `arc_reviewed_at` | TIMESTAMPTZ | Timestamp of ARC review decision — recorded in ARC review process |
| `arc_notes` | TEXT | ARC reviewer notes — recorded in ARC review process |

---

## 3. Approval Status Lifecycle

```
[Upload] → pending → [ARC Review] → approved ─────────→ [Freshness Check] → [Re-review] → approved
                                   ↘ rejected            (every 90 days)  ↘               ↓
                                                                            ────────────→ retired
```

| Status | Meaning | Injected into AI Context? |
|---|---|---|
| `pending` | Uploaded but not yet ARC-reviewed | ❌ No — excluded by KnowledgeRetrieverImpl |
| `approved` | ARC has reviewed and approved | ✅ Yes — included by KnowledgeRetrieverImpl |
| `retired` | No longer current; superseded or withdrawn | ❌ No — excluded by KnowledgeRetrieverImpl |

---

## 4. Current Knowledge Inventory

> **Note**: This table is populated as knowledge items are uploaded and ARC-reviewed.
> At Wave 9.5 delivery (2026-02-27), the foundation schema and inventory tracking are
> established. Knowledge items are added as each Maturion module is connected to AIMC
> (Wave 9.6–9.10 module integration waves). The ARC review process for initial items
> follows the protocol in `AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`.

### 4.1 Domain: Access Control

| ID | Organisation | Domain | Module | Standard Ref | Source | Upload Date | Freshness Date | Approval Status | ARC Reviewed By | ARC Reviewed At |
|---|---|---|---|---|---|---|---|---|---|---|
| — | — | access-control | MAT | ISO-27001-A.9 | — | — | — | pending | — | — |

> No approved entries yet. First entries pending ARC review after Wave 9.6 module integration.

### 4.2 Domain: Risk Management

| ID | Organisation | Domain | Module | Standard Ref | Source | Upload Date | Freshness Date | Approval Status | ARC Reviewed By | ARC Reviewed At |
|---|---|---|---|---|---|---|---|---|---|---|
| — | — | risk-management | MAT | ISO-27001-A.8 | — | — | — | pending | — | — |

> No approved entries yet.

### 4.3 Domain: Vulnerability Management

| ID | Organisation | Domain | Module | Standard Ref | Source | Upload Date | Freshness Date | Approval Status | ARC Reviewed By | ARC Reviewed At |
|---|---|---|---|---|---|---|---|---|---|---|
| — | — | vulnerability-management | PIT | NIST-SP-800-53-RA-5 | — | — | — | pending | — | — |

> No approved entries yet.

### 4.4 Domain: Threat Intelligence

| ID | Organisation | Domain | Module | Standard Ref | Source | Upload Date | Freshness Date | Approval Status | ARC Reviewed By | ARC Reviewed At |
|---|---|---|---|---|---|---|---|---|---|---|
| — | — | threat-intelligence | PIT | NIST-SP-800-53-RA-3 | — | — | — | pending | — | — |

> No approved entries yet.

---

## 5. Freshness Policy

Per the ARC Knowledge Promotion Protocol:
- **Review cadence**: All `approved` knowledge items must be reviewed within **90 days** of their `freshness_date` (or `upload_date` if never refreshed)
- **Standard updates**: When a referenced standard (e.g., ISO 27001) is updated, all items referencing that standard must be re-reviewed regardless of freshness date
- **Staleness trigger**: Items not reviewed within 90 days are flagged for ARC review; items exceeding 180 days without review are automatically set to `retired` status pending manual re-approval
- **Freshness date update**: ARC reviewer must update `freshness_date` to the current date when approving a knowledge item review

---

## 6. ARC Review Summary

| Total Items | Pending | Approved | Retired |
|---|---|---|---|
| 0 | 0 | 0 | 0 |

> Inventory is established at Wave 9.5. Items will be added during Wave 9.6–9.10 module integration.

---

## 7. Traceability

| Requirement | Source |
|---|---|
| Knowledge Base Inventory requirement | Gap 3 — `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` |
| AAWP Wave 9.5 delivery obligation | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` §Wave 9.5 |
| Approval status schema | `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` |
| KnowledgeRetriever filter implementation | `packages/ai-centre/src/memory/KnowledgeRetrieverImpl.ts` |
| ARC review process | `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` |
| Architecture freeze | `governance/aimc/freezes/ARCH_FREEZE-wave9-knowledge-base-inventory-arc-protocol-20260227.md` |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Maintained by**: Foreman (foreman-v2-agent) + Governance Liaison (governance-liaison-isms-agent)  
**Review Schedule**: After each Wave 9 module integration wave; quarterly thereafter
