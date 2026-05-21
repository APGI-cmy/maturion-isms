# MMM Upload Architecture Alignment Plan (Knowledge Plane Separation)

**Date**: 2026-05-21  
**Issue**: #1720 — Align upload architecture with Subject Knowledge Domain and Framework / Context Domain strategy  
**Strategy anchor**: `Maturion/strategy/Maturion_knowledge_domains_and_runtime_agent_orchestration_strategy.md` (MKD-RAO-001)

---

## 1) Current upload routes and actual behavior (audit)

### Current MMM app (`apps/mmm`)

| Route / Surface | Current behavior | Classification |
|---|---|---|
| `/frameworks/upload` (`FrameworkUploadPage.tsx`) | Initializes framework records and runs framework-source flows via `mmm-framework-init`, `mmm-upload-framework-source`, `mmm-ai-framework-generate` | **Framework Source Upload** (not knowledge upload) |
| Nav label `Upload` (multiple MMM pages) | Routes directly to `/frameworks/upload` | Ambiguous label for framework-source-only behavior |
| `/assessments/:id/evidence/:criterionId` (`EvidenceWorkspacePage.tsx`) | Submits criterion-scoped evidence payloads to evidence endpoint (`/api/upload/evidence`) | **Evidence Upload** |

### Supabase functions currently used by framework-source flow

- `supabase/functions/mmm-framework-init/index.ts`  
- `supabase/functions/mmm-upload-framework-source/index.ts`  
- `supabase/functions/mmm-ai-framework-generate/index.ts`  

These functions are framework lifecycle functions (create/generate/parse-init) and are not subject-knowledge or customer-context ingestion surfaces.

---

## 2) Legacy upload centre capability map

| Legacy asset | Capability observed | Likely target role in aligned architecture |
|---|---|---|
| `apps/maturion-maturity-legacy/src/pages/MaturionUploads.tsx` | Unified upload and management console over `ai_documents` | Primary base for **role-aware upload landing + context/subject upload panels** |
| `apps/maturion-maturity-legacy/src/pages/MaturionKnowledgeBase.tsx` | Knowledge base admin page with upload/processing/management tooling | **Subject Knowledge Upload** (CS2/superuser-controlled) |
| `.../DocumentUploadProcessor.tsx` | Manual chunk/validation/upload processing UI | Subject-knowledge processing/admin tooling |
| `.../MaturionKnowledgeUploadZone.tsx` | Admin upload zone with metadata and document governance controls | Context/knowledge upload zone with role gating |
| `.../UnifiedDocumentUploader.tsx` | Multi-file session uploader with org-context validation/security checks | Candidate shared uploader (context first; superuser extension for subject) |
| `.../DocumentChunkTester.tsx` | Preflight chunk testing/quality checks | QA/admin pre-ingestion tool (subject/context controlled use) |
| `.../useMaturionDocuments.ts` | Upload/list/update/delete against `ai_documents`; invokes `process-ai-document` | Core document ingestion hook; requires explicit plane scoping guardrails |
| `apps/maturion-maturity-legacy/supabase/functions/process-ai-document/index.ts` | Legacy ai_documents processing pipeline | Context/subject processing backend (must be plane-scoped) |
| `apps/maturion-maturity-legacy/supabase/functions/process-document-v2/index.ts` | Enhanced legacy processing pipeline | Context/subject processing backend (must be plane-scoped) |
| `packages/ai-centre/supabase/functions/process-document-v2/index.ts` | Pipeline 2 writes to `ai_knowledge` with strict scope constraints | Subject knowledge ingestion target pattern |

Legacy asset paths in this table are architecture targets based on prior discovery. The implementation wave must re-verify each file against the uploaded legacy source archive before claiming harvest/parity.

---

## 3) Target upload categories (locked)

1. **Subject Knowledge Upload** — CS2/superuser-only authoritative platform/domain knowledge.  
2. **Context Document Upload** — organisation-scoped customer context documents.  
3. **Framework Source Upload** — framework source material for framework/domain/MPS/criteria generation (`/frameworks/upload`).  
4. **Evidence Upload** — assessment/criterion-scoped proof upload only.

---

## 4) Role-aware routing plan

| Role | Allowed upload destinations | Explicitly blocked |
|---|---|---|
| CS2 / superuser | Subject Knowledge Upload, Framework Source Upload, Context support access, Evidence support access | None within authority scope |
| Customer admin / org user | Context Document Upload, Framework Source Upload where product role allows, Evidence Upload | Subject Knowledge Upload |
| Ordinary / unauthorized user | No direct upload surfaces except explicitly granted evidence/context routes | Subject Knowledge Upload and framework-admin routes |

---

## 5) Storage targets and scoping

| Category | Storage target | Scope rule |
|---|---|---|
| Subject Knowledge Upload | AIMC subject store (`ai_knowledge` or successor governed schema) | Global/platform scope, approval-gated before AI runtime use |
| Context Document Upload | Organisation/framework scoped document + embedding stores (`ai_documents` + chunk/embedding layers or successor) | Strict tenant/org scope by default |
| Framework Source Upload | MMM framework-source parse pipeline (`mmm_*` framework + parse job structures and KUC handoff) | Framework lifecycle scoped, not treated as general knowledge corpus |
| Evidence Upload | MMM assessment evidence stores/endpoints (`mmm_evidence` and criterion-scoped evidence flows) | Assessment/criterion scoped; never promoted implicitly |

---

## 6) Approval and promotion rules

- Subject knowledge uploads remain **pending approval** before production AI retrieval/use.
- Customer context defaults to **organisation-scoped context only**.
- No context → subject promotion without explicit **CS2/superuser governed approval**.
- Evidence uploads remain in assessment evidence plane; no implicit migration into context or subject planes.

---

## 7) Proposed UI route labels (remove generic ambiguity)

- `Upload Framework Source` → `/frameworks/upload`
- `Upload Context Documents` → new context-upload route (organisation scoped)
- `Upload Subject Knowledge` → superuser-only route
- `Upload Evidence` → criterion/assessment evidence route
- Optional parent entry: `Upload Centre` (landing page only, must force plane selection before any upload)

---

## 8) First implementation wave decision

**Wave 1 choice**: **Create a role-aware Upload landing page** that routes explicitly to Framework Source / Subject Knowledge / Context / Evidence uploads, while preserving existing `/frameworks/upload` as Framework Source Upload.

No production wiring from legacy upload centre should be merged until this routing and storage-plane contract is in place.
