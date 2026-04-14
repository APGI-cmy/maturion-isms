# AIMC Phase 2 Audit — Category D (KUC) + Category G (Process) + Governance Gap Review

**Audit ID**: AIMC-P2-D-G-GOV-20260414
**Wave**: aimc-audit-phase-2-20260414
**Branch**: copilot/aimc-audit-phase-2-orchestrate
**Date**: 2026-04-14
**Auditor**: governance-liaison-isms-agent v6.2.0
**Delegated by**: foreman-v2-agent
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-wave-record-aimc-audit-phase-2-20260414.md`
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Scope**: Audit-only — no implementation changes

---

## 1. Category D — Knowledge Upload Centre Readiness

### 1.1 Results Table

| Test ID | Description | Verdict | Evidence | Notes |
|---------|-------------|---------|----------|-------|
| T-D-001 | `ai_knowledge` table has all required metadata columns (`domain`, `module`, `standard_ref`, `freshness_date`, `approval_status`) | ✅ **PASS** | `packages/ai-centre/supabase/migrations/006_ai_knowledge_metadata.sql` | All 5 columns present via `ALTER TABLE ai_knowledge ADD COLUMN IF NOT EXISTS`; `approval_status` has CHECK constraint `IN ('pending','approved','retired')` and index `idx_ai_knowledge_approval_status`; confirmed CL-11-D5 (DCKIS-SCH-001) |
| T-D-002 | ARC Knowledge Promotion Protocol documented (`governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`) | ✅ **PASS** | `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` v1.0.0 (ACTIVE) | Full 6-step protocol documented (Upload → ARC Review Request → ARC Review → Approval/Rejection → Freshness Monitoring → Retirement); roles defined (ARC Chair = CS2, Knowledge Uploader, ARC Reviewer, Knowledge Steward); lifecycle table with status transitions; confirmed CL-11-D6 (DCKIS-GOV-001) |
| T-D-003 | Knowledge Base Inventory populated — at least one approved knowledge item per active module | ⚠️ **FAIL** | `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` v1.0.0 | Inventory structure is in place (schema, lifecycle, 4+ domain sections). **All entries have `approval_status = pending` — zero approved items exist for any module (MAT, PIT, XDETECT, others).** Document note: "No approved entries yet. First entries pending ARC review after Wave 9.6 module integration." CL-12 (module integration) is BLOCKED on CL-11 CP-11 closure. This is a structural gap — framework ready, content absent. |
| T-D-004 | `KnowledgeRetrieverImpl.retrieve()` filters by `approval_status = 'approved'` | ✅ **PASS** | `packages/ai-centre/src/memory/KnowledgeRetrieverImpl.ts`; `packages/ai-centre/src/__tests__/memory/KnowledgeRetrieverApproval.test.ts` (W9.5-T-001–T-007) | Implementation confirmed: `this.entries.filter(entry => entry.approvalStatus === 'approved')`. 7 RED gate tests cover: all-approved, mixed approved/pending, mixed approved/retired, all-pending (empty return), limit parameter, retired-only (empty return), undefined status (excluded). **Caveat**: current implementation is in-memory; Supabase wiring explicitly deferred to future wave (documented in file header). Filter logic itself is correct. |
| T-D-005 | Upload mechanism — documented, governed process for authorised team members to upload knowledge items | ✅ **PASS** | `governance/aimc/AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` v1.1.0 (APPROVED — CP-5 signed off by CS2 2026-03-01) | Comprehensive specification: REST API contract (`POST /api/ai/knowledge/upload`, batch, status), JWT auth/authz, automated ARC trigger protocol, batch semantics, rate limiting, field validation rules. CS2 approval recorded. Confirmed CL-11-D6 (DCKIS-GOV-001). |
| T-D-006 | Upload mechanism — UI/API endpoint for knowledge uploads exists beyond manual DB inserts | ✅ **PASS** | CL-11-D2 COMPLETE per `.agent-workspace/foreman-v2/personal/AIMC_LKIAC_WAVE_STATUS_MATRIX_20260403.md`; DCKIS-IMPL-002, PR #1182 | Upload endpoint and MAT UI components delivered and merged (CL-11-D2: DCKIS-IMPL-002, PR #1182). RED gate tests (T-KU-001–T-KU-012) also COMPLETE (CL-11-D1). **Note**: CP-11 (CS2 approval to unlock CL-12) is still open pending CL-11-D3 and CL-11-D4 resolution — but the endpoint delivery itself (T-D-006 scope) is confirmed complete. |

### 1.2 Category D Summary

| Result | Count |
|--------|-------|
| ✅ PASS | 5 (T-D-001, T-D-002, T-D-004, T-D-005, T-D-006) |
| ⚠️ FAIL | 1 (T-D-003) |
| 🔶 PARTIAL | 0 |

**Category D Overall**: PARTIAL PASS — 5/6 tests pass. T-D-003 fails because no knowledge items have been approved through the ARC review process. The structural framework (schema, protocol, retriever, upload endpoint, specification) is complete; operational population of approved items is pending module integration (CL-12, currently blocked).

---

## 2. Category G — Process Testing (Selected Items)

### 2.1 Results Table

| Test ID | Description | Verdict | Evidence | Notes |
|---------|-------------|---------|----------|-------|
| T-G-001 | ARC workflow — full end-to-end knowledge promotion workflow documented from upload through approval | ✅ **PASS** | `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` v1.0.0 | Complete 6-step workflow: Step 1 (Upload: metadata prep + `approval_status = 'pending'` default), Step 2 (ARC Review Request: GitHub issue/CS2 notification), Step 3 (ARC Review: 6 criteria table), Step 4a (Approval: sets `approved` + `freshness_date`) / Step 4b (Rejection: notes mandatory), Step 5 (Freshness Monitoring: 90-day/180-day triggers), Step 6 (Retirement). All actor roles, gate conditions, and state transitions documented. **Mapping note**: per `AIMC_PHASE1_AUDIT_AND_TEST_PLAN.md`, T-G-001 is assigned as "Persona quarterly review cadence" (`AIMC_PERSONA_LIFECYCLE.md §4.1`). This delegation has scope-mapped T-G-001 to ARC workflow completeness. Both reviews conducted — persona lifecycle §4.1 also PASS (quarterly schedule documented, workflow defined, CI tests in place). No discrepancy in outcome. |
| T-G-005 | Governance documentation completeness — GRS document status; AAWP Wave 9 sign-off | ⚠️ **PARTIAL** | GRS: `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` v0.1.0; AAWP: `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` v0.4.0 | **GAP-005 (OPEN)**: GRS v0.1.0 status is "DRAFT — Awaiting CS2 Sign-Off". No Wave 2 gate closure documented. CS2 sign-off has never been formally recorded in the document. This gap remains open and unresolved. **GAP-006 (RESOLVED)**: AAWP v0.2.0 Wave 9 CS2 sign-off was initially absent from the document itself. AAWP v0.3.0 (2026-03-01) formally records: "CS2 Wave 9 sign-off is formally recorded in this v0.3.0 amendment, clearing all Wave 9 subwaves to proceed per the Combined Execution Plan. This amendment resolves governance gap GOV-006." Current AAWP is v0.4.0 (ACTIVE). GAP-006 is CLOSED. GAP-005 remains the outstanding gap for T-G-005. |

### 2.2 Category G Summary

| Result | Count |
|--------|-------|
| ✅ PASS | 1 (T-G-001) |
| ⚠️ PARTIAL | 1 (T-G-005) |
| ❌ FAIL | 0 |

---

## 3. Governance Gap Status

### 3.1 GOV-001 and GOV-002 — CI Enforcement for Direct Provider Imports

| Gap | Description | Status | Evidence |
|-----|-------------|--------|----------|
| GOV-001 | CI check preventing `import { OpenAI }` from `'openai'` in module code | ✅ **ENFORCED** | `.github/workflows/routing-governance-check.yml` |
| GOV-002 | CI check preventing `import Anthropic` from `'@anthropic-ai/sdk'` in module code | ✅ **ENFORCED** | `.github/workflows/routing-governance-check.yml` |

**Evidence detail** — `routing-governance-check.yml`:
- **Authority**: GOV-001, GOV-002, T-C-010
- **Trigger**: `pull_request` on `modules/**` or `apps/**` paths; `workflow_dispatch`
- **Check 1 (GOV-001)**: `grep` for `from 'openai'` or `from "openai"` in `*.ts`/`*.tsx` files in `modules/` and `apps/`; exits 1 (❌ BANNED) if found
- **Check 2 (GOV-002)**: `grep` for `from '@anthropic-ai/sdk'` or `from "@anthropic-ai/sdk"` in same scope; exits 1 (❌ BANNED) if found
- **Exclusions**: `--exclude-dir=maturion-maturity-legacy` (documented GOV exemption), `--exclude=*.test.ts`, `--exclude=*.spec.ts`
- **CS2 Authorization**: maturion-isms#1221 (2026-04-05); Wave CL-10 (maturion-isms#1227)
- **Additional coverage**: `deploy-mat-vercel.yml` includes inline `T-C-010 CI gate` scanning `modules/` for direct provider SDK imports
- **GOV verdict**: Both GOV-001 and GOV-002 are **ENFORCED** in CI. Provider model string banning is additionally covered by `provider-model-ban.yml` (bans hardcoded model strings like `gpt-4`, `claude-3`, etc. in `modules/mat/src/`).

### 3.2 GOV-005 — AIMC Governance Certification: Wave 9.1–9.11 and Wave 10 Coverage

| Gap | Description | Status | Evidence |
|-----|-------------|--------|----------|
| GOV-005 | Does `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md` cover Waves 9.1–9.11 and Wave 10? | ❌ **NOT YET COVERED** | `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md` (Wave 8 CERTIFIED); wave status matrix CL-14 status |

**Evidence detail**:
- Current `AIMC_GOVERNANCE_CERTIFICATION.md` is explicitly Wave 8 only: **"Wave: 8 — Video Generation + Algorithm Execution"**, Status: CERTIFIED, Date: 2026-02-25
- Covers 8 capabilities (ADVISORY through ALGORITHM_EXECUTION) for Waves 1–8. No Wave 9 or Wave 10 content.
- **CL-14** ("AIMC Governance Certification + AAWP Update") status in wave matrix: **🔒 PENDING — BLOCKED**. Blocked on CL-12 (all 7 modules wired), CL-10, and CL-7. CP-14 is open.
- This is a **known, expected gap** — the certification is designed to be updated at CL-14 delivery, which cannot occur until CL-12 (module integration), CL-10 (upload endpoint final checks), and CL-7 (persona validation) are complete.
- No Wave 10 is yet defined in the AAWP or Combined Execution Plan. The AAWP covers Waves 1–9.11. "Wave 10" does not appear as a formal wave designation in any current governance document.

---

## 4. Findings Summary

### 4.1 Confirmed Evidence (PASS items)

| Item | Evidence Confirmed |
|------|--------------------|
| T-D-001 | `006_ai_knowledge_metadata.sql` adds all 5 required columns with correct constraints |
| T-D-002 | ARC protocol v1.0.0 fully documents 6-step lifecycle; roles and transitions complete |
| T-D-004 | `KnowledgeRetrieverImpl` correctly filters `approvalStatus === 'approved'`; 7 test assertions |
| T-D-005 | KUC spec v1.1.0 APPROVED by CS2 (CP-5, 2026-03-01); governs REST API, auth, ARC trigger, batch, rate limiting |
| T-D-006 | Upload endpoint delivered via CL-11-D2 (DCKIS-IMPL-002, PR #1182); beyond manual DB inserts |
| T-G-001 | ARC workflow fully documented end-to-end; persona quarterly review cadence also confirmed |
| GOV-001 | `routing-governance-check.yml` blocks `from 'openai'` in modules/apps |
| GOV-002 | `routing-governance-check.yml` blocks `from '@anthropic-ai/sdk'` in modules/apps |

### 4.2 Open Gaps

| Gap ID | Category | Severity | Status | Description |
|--------|----------|----------|--------|-------------|
| T-D-003 | Category D | HIGH | **OPEN** | Zero approved knowledge items in `AIMC_KNOWLEDGE_BASE_INVENTORY.md` — all entries `pending`. No active module has at least one approved item. Structural framework complete; operational population blocked on module integration (CL-12). |
| GAP-005 | Category G (T-G-005) | MEDIUM | **OPEN** | GRS (`AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md`) remains DRAFT v0.1.0. CS2 sign-off never formally recorded. The document explicitly states "CS2 review and sign-off (Wave 2 may not commence until this document is approved)". Wave 2 gate closure was never documented. |
| GOV-005 | Governance | MEDIUM | **OPEN (EXPECTED)** | `AIMC_GOVERNANCE_CERTIFICATION.md` covers only Waves 1–8. Waves 9.1–9.11 coverage will be delivered at CL-14 (PENDING/BLOCKED). No Wave 10 formal designation exists in current governance. |

### 4.3 CL-11 Sub-Deliverable Status (Cross-reference)

| Deliverable | Status | Audit Outcome |
|-------------|--------|---------------|
| CL-11-D1: RED gate tests (T-KU-001–T-KU-012) | ✅ COMPLETE | — |
| CL-11-D2: Upload endpoint + MAT UI | ✅ COMPLETE | T-D-006 PASS |
| CL-11-D3: ARC approval endpoint 403 gate (GAP-008) | ✅ AUDITED | PASS — 403 returned on unauthenticated requests; **F-D3-002 escalated**: JWT Bearer path accepts any 3-part token without CS2 identity check (security gap, out-of-scope for T-G-002 binary) |
| CL-11-D4: Episodic memory write path (GAP-009) | ✅ AUDITED | **FAIL** — `EpisodicMemoryAdapter.record()` writes to in-memory array only; no Supabase INSERT to `ai_episodic_events`; explicitly deferred since Wave 9.3; GAP-009 confirmed OPEN |
| CL-11-D5: Schema audit (T-D-001) | ✅ COMPLETE | T-D-001 PASS |
| CL-11-D6: ARC protocol review (T-D-002/T-D-005) | ✅ COMPLETE | T-D-002 + T-D-005 PASS |

**CP-11 status**: OPEN — CL-11-D3 audit PASS (with escalated finding F-D3-002), CL-11-D4 audit FAIL (GAP-009 open). Foreman must determine whether CP-11 can be granted pending GAP-009 remediation, or whether GAP-009 remediation must precede CP-11.

### 4.4 AAWP / GAP-006 Resolution Confirmation

GAP-006 (AAWP v0.2.0 Wave 9 CS2 sign-off not documented in AAWP itself) is **RESOLVED**. AAWP v0.3.0 (2026-03-01) explicitly states: *"CS2 Wave 9 sign-off is formally recorded in this v0.3.0 amendment, clearing all Wave 9 subwaves to proceed per the Combined Execution Plan. This amendment resolves governance gap GOV-006."* Current AAWP is v0.4.0 (ACTIVE). No audit action required on this item.

---

## 5. Recommendations

### 5.1 To Close T-D-003 (FAIL — HIGH priority)

**Action**: Commission a knowledge upload and ARC review wave.

The structural prerequisites are all in place (schema: T-D-001 PASS, retriever: T-D-004 PASS, upload endpoint: T-D-006 PASS, ARC protocol: T-D-002 PASS, KUC spec: T-D-005 PASS). The only gap is that no knowledge items have been uploaded and ARC-approved. The document notes this is expected until module integration completes.

**Recommended path**: 
1. CS2 authorises a knowledge seeding sub-wave (post CL-12 module integration, or in parallel as a governance-only CL-11.5 task)
2. Governance Liaison or Foreman uploads seed knowledge items per the ARC Upload protocol (Step 1 of `AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`)
3. CS2 (as ARC Chair) reviews and approves at least one item per active module
4. Inventory updated with approved items
5. T-D-003 re-audited

**Minimum threshold**: At least one `approval_status = 'approved'` row per module in `AIMC_KNOWLEDGE_BASE_INVENTORY.md`.

### 5.2 To Close GAP-005 / T-G-005 PARTIAL (MEDIUM priority)

**Action**: CS2 formal sign-off on GRS v0.1.0 (or issue an updated GRS v0.2.0 and sign off).

The GRS has been in DRAFT since Wave 1 (2026-02-23). All downstream documents (APS, AAD, AAWP) already exist and waves have been executing. However, the formal Wave 2 gate closure was never documented in the GRS itself.

**Recommended path**:
1. CS2 reviews `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` v0.1.0
2. CS2 issues written sign-off (GitHub issue comment or AAWP amendment)
3. GRS status field updated from `DRAFT — Awaiting CS2 Sign-Off` to `APPROVED — CS2 Sign-Off [date]`
4. If material updates are needed, issue GRS v0.2.0 before signing
5. T-G-005 re-audited

### 5.3 To Close GOV-005 (MEDIUM priority — expected/planned)

**Action**: Complete CL-14 (AIMC Governance Certification + AAWP Update) per the Combined Execution Plan.

This gap is known and the closure path is defined. CL-14 is blocked on CL-12 (all 7 modules wired), CL-10, and CL-7. No immediate action required beyond the existing programme execution sequence.

**Recommended path**: Complete CL-7 → CL-10 → CL-12 → commission CL-14. The certification update for Waves 9.1–9.11 will be produced as a CL-14 deliverable.

### 5.4 To Address F-D3-002 Security Finding (from CL-11-D3 audit)

**Action**: Commission a separate remediation wave for JWT Bearer path hardening on `POST /api/ai/feedback/approve`.

The current JWT path accepts any structurally valid 3-part token without signature verification or CS2 identity check. Given that the `buildFeedbackPipeline()` uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS), this is a meaningful security gap. This was escalated from qa-builder to foreman-v2-agent in the CL-11-D3 audit report.

**Recommended path**: Commission a targeted security fix wave (api-builder) to enforce Supabase JWT sub-claim validation or replace JWT path with `x-arc-token` exclusively.

### 5.5 To Address GAP-009 / CL-11-D4 FAIL (CRITICAL)

**Action**: Commission Supabase write path implementation for `EpisodicMemoryAdapter.record()`.

GAP-009 is confirmed OPEN by CL-11-D4 audit. The `EpisodicMemoryAdapter` writes only to an in-memory array; no records reach `ai_episodic_events` in production. This undermines the AIMC self-learning loop and episodic memory capabilities.

**Required actions** (from CL-11-D4 escalation):
1. Replace `this.store.push(...)` in `EpisodicMemoryAdapter.record()` with Supabase INSERT to `ai_episodic_events`
2. Add `app.current_organisation_id` RLS setting call before insert
3. Retain mandatory SupabaseClient constructor guard
4. Update QA-to-Red tests to inject real/mock Supabase client and assert DB writes

This must be completed and CP-11 obtained before CL-12 module integration can commence.

---

## 6. Audit Methodology Notes

**Note on T-G-001 mapping**: The delegation brief maps T-G-001 to "ARC workflow end-to-end". The canonical `AIMC_PHASE1_AUDIT_AND_TEST_PLAN.md` maps T-G-001 to "Persona quarterly review cadence (`AIMC_PERSONA_LIFECYCLE.md §4.1`)". Both reviews have been conducted. The ARC workflow evidence is at `AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`; the persona lifecycle schedule is at `AIMC_PERSONA_LIFECYCLE.md §4.1`. Both are PASS. The Foreman should note this dual mapping in the consolidated report for T-G-001 and designate which is the authoritative mapping.

**Supabase wiring deferral pattern**: T-D-004 and GAP-009 both involve in-memory implementations with explicitly deferred Supabase backends. The pattern is consistent and intentional (documented in source code). This is a programme execution gap, not a design flaw. The path to production readiness for both is the same: replace in-memory stores with Supabase client calls per the existing migration schemas.

**Evidence chain integrity**: All evidence referenced in this report has been directly verified against the source files in the repository on branch `copilot/aimc-audit-phase-2-orchestrate`. No evidence has been reconstructed or inferred beyond what is present in the source.

---

## 7. Sign-Off

| Field | Value |
|-------|-------|
| **Auditor** | governance-liaison-isms-agent v6.2.0 |
| **Audit date** | 2026-04-14 |
| **Wave** | aimc-audit-phase-2-20260414 |
| **Branch** | copilot/aimc-audit-phase-2-orchestrate |
| **Authority** | CS2 delegation via foreman-v2-agent |
| **IAA status** | Deferred to wave final PR per IAA pre-brief (`iaa-wave-record-aimc-audit-phase-2-20260414.md` §1 — intermediate delegation work not separately triggering IAA) |
| **Status** | COMPLETE — ready for consolidation into `governance/AUDIT/AIMC_PHASE2_AUDIT_CONSOLIDATED_REPORT.md` |

---

*Produced by governance-liaison-isms-agent v6.2.0 | AIMC Audit Phase 2 | 2026-04-14*
*Authority: CS2 (Johan Ras / @APGI-cmy) via foreman-v2-agent delegation*
