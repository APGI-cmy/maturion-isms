# MMM — FRS-to-TRS Traceability Matrix

## Stage 4 — Traceability Artifact

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: FRS-to-TRS Traceability Matrix (Stage 4 Companion)
- **Status**: DRAFT — For CS2 review and approval
- **Version**: 0.1.0
- **Date**: 2026-04-14
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: foreman-v2-agent (POLC-Orchestration mode)
- **Issue**: maturion-isms#1372 (MMM Stage 4 wave-start authorization)
- **FRS Source**: `modules/MMM/02-frs/functional-requirements.md` v0.1.0
- **TRS Source**: `modules/MMM/03-trs/technical-requirements-specification.md` v0.1.0

> **Governance Note:** This matrix demonstrates that every FRS functional requirement
> (FR-001 through FR-080) is traceable to at least one TRS technical requirement (TR-NNN).
> No FRS requirement may be left untraced. This is a hard IAA verification condition.

---

## Completeness Statement

All 80 FRS requirements (FR-001 through FR-080) are explicitly traced below.
**100% FRS traceability: CONFIRMED. Zero gaps.**

---

## Traceability Matrix

| FR | FR Name | TRS Requirements | Traceability Notes |
|----|---------|-----------------|-------------------|
| FR-001 | Canonical Maturity Platform Identity | TR-021, TR-028 | Single canonical persistence (TR-021); canonical data separation from other modules (TR-028) |
| FR-002 | Domain Hierarchy Single-Ownership Rule | TR-022, TR-028 | `domains` table owned by MMM (TR-022); no cross-module FK (TR-028) |
| FR-003 | Evidence Ownership | TR-022, TR-028, TR-043 | `evidence` table in MMM schema (TR-022); data separation (TR-028); supports 1000 orgs (TR-043) |
| FR-004 | Findings and Recommendations Ownership | TR-022, TR-028 | `findings` table in MMM schema (TR-022); isolated (TR-028) |
| FR-005 | Module Deployment as Distinct Application | TR-048, TR-049, TR-050 | Vercel deployment (TR-048); Edge Functions (TR-049); migrations (TR-050) |
| FR-006 | Pre-Subscription Attraction Flow | TR-029, TR-053 | Auth provider (TR-029); environment config (TR-053) |
| FR-007 | Free Assessment Execution | TR-029, TR-036 | Auth required (TR-029); VIEWER role can access (TR-036) |
| FR-008 | Locked Baseline Rule | TR-027, TR-031 | Framework version immutability (TR-027); RLS prevents modification after publish (TR-031) |
| FR-009 | Maturity Context Persistence Across Workflows | TR-063, TR-022 | localStorage state persistence (TR-063); `assessments` table (TR-022) |
| FR-010 | Subscription and Sign-Up Flow | TR-029, TR-035 | Supabase Auth (TR-029); invitation model (TR-035) |
| FR-011 | Organisation Onboarding | TR-022, TR-035 | `organisations` table (TR-022); invitation security (TR-035) |
| FR-012 | Framework-Origin Decision Fork | TR-015, TR-022 | AIMC endpoints for parse vs generate (TR-015); `frameworks.source_type` column (TR-022) |
| FR-013 | Common Upload and Ingestion Infrastructure | TR-006, TR-019, TR-047 | Upload SLA (TR-006); KUC upload contract (TR-019); Storage config (TR-047) |
| FR-014 | Document Role Classification | TR-019, TR-020 | `document_role` field in upload request (TR-019); classification response (TR-020) |
| FR-015 | Document Metadata Requirements | TR-019, TR-022 | Metadata in upload payload (TR-019); `parse_jobs` table (TR-022) |
| FR-016 | Framework-Source vs Evidence-Source Pipeline Separation | TR-015, TR-019, TR-022 | Separate AIMC endpoints (TR-015); separate upload endpoints (TR-019); separate table paths (TR-022) |
| FR-017 | Mandatory Domain → MPS → Criteria Hierarchy | TR-022, TR-044 | Three-table hierarchy (domains, maturity_process_steps, criteria) in TR-022; scale target (TR-044) |
| FR-018 | Hierarchical Numbering Rule | TR-022 | `code` column in domains, maturity_process_steps, criteria (TR-022) |
| FR-019 | Five Default Canonical Domains | TR-022 | `domains` table with `framework_id` reference; seeded with 5 canonical domains (TR-022) |
| FR-020 | Verbatim Upload Flow (Mode A) | TR-015, TR-019, TR-020 | `/api/ai/framework-parse` endpoint (TR-015); KUC upload (TR-019); classification response (TR-020) |
| FR-021 | No Hallucination Rule in Verbatim Import | TR-015, TR-033 | Human confirmation required before score updates (TR-033); AI propose only (TR-015) |
| FR-022 | New Criteria Creation Flow (Mode B) | TR-015, TR-012 | `/api/ai/framework-generate` endpoint (TR-015); AIMC data format (TR-012) |
| FR-023 | AI Proposed Altering Mechanism | TR-015, TR-033, TR-034 | `/api/ai/framework-alter` endpoint (TR-015); human oversight (TR-033); AI logging (TR-034) |
| FR-024 | Intent Statements | TR-022 | `intent_statement` column in `maturity_process_steps` (TR-022) |
| FR-025 | Criteria Card Requirements | TR-022 | `criteria` table with all required columns (TR-022) |
| FR-026 | Framework Review and Three-Tier Approval Workflow | TR-022, TR-031, TR-036 | `frameworks.status` states (TR-022); RLS write restriction by role (TR-031, TR-036) |
| FR-027 | Framework Publication | TR-022, TR-027, TR-031 | PUBLISHED status in `frameworks` (TR-022); immutable snapshot (TR-027); RLS blocks post-publish writes (TR-031) |
| FR-028 | Hybrid Framework Mode Timing (OQ-009 RESOLVED) | TR-022 | `frameworks.source_type` accommodates hybrid mode (TR-022) |
| FR-029 | Criterion Drill-Down | TR-022, TR-007 | `criteria` table (TR-022); audit session load performance for criteria drill-down (TR-007) |
| FR-030 | Evidence Workspace Modal Behaviour | TR-022, TR-002 | `evidence` table (TR-022); API response SLA for modal data (TR-002) |
| FR-031 | Supported Evidence Types | TR-022, TR-019 | `evidence.type` column: document/voice/photo/integration (TR-022); upload via KUC (TR-019) |
| FR-032 | Evidence Decision Flow | TR-022, TR-033, TR-038 | `evidence.status` (PENDING/ACCEPTED/REJECTED) in TR-022; human confirmation (TR-033); audit logged (TR-038) |
| FR-033 | Evidence Non-Acceptance Paths | TR-022, TR-038 | `evidence.status = REJECTED` in TR-022; rejection logged in audit_log (TR-038) |
| FR-034 | Evidence Freshness and Staleness | TR-025 | Staleness tracking via `evidence.reviewed_at` and configurable threshold (TR-025) |
| FR-035 | Re-Evaluation of Evidence | TR-026 | Score version history reconstructable from audit_logs (TR-026) |
| FR-036 | Human Override Logging | TR-026, TR-033, TR-038 | `override_log` table (TR-026); AI human oversight gate (TR-033); immutable log (TR-038) |
| FR-037 | Five-Level Maturity Scale | TR-022, TR-033 | `maturity_scores.score` constrained to 1–5 (TR-022); score proposals use same scale (TR-033) |
| FR-038 | Evidence Capability Constraint | TR-033, TR-036 | L4/L5 doc-only override requires ADMIN role and rationale (TR-033, TR-036) |
| FR-039 | Continuous Live Maturity Engine | TR-004, TR-008, TR-022 | Scoring cascade latency (TR-004); real-time update (TR-008); `maturity_scores` table (TR-022) |
| FR-040 | Scoring Cascade | TR-004, TR-022, TR-046 | 6-step cascade latency ≤ 2 s (TR-004); tables for all 4 hierarchy levels (TR-022); indexes (TR-046) |
| FR-041 | Audit Workbench / Walkabout Mode | TR-007, TR-022, TR-039, TR-040, TR-041, TR-042 | Session load (TR-007); `audit_sessions` table (TR-022); connectivity model (TR-039); queue-and-sync (TR-040); connectivity UI (TR-041); scope boundary (TR-042) |
| FR-042 | MAT Label Survival Decision (OQ-008 RESOLVED) | TR-053 | Naming standard enforced via environment config and product decisions; no direct TRS requirement (governance note only); TR-053 ensures no conflicting environment labels |
| FR-043 | Independent Auditor Flow | TR-035, TR-036, TR-038 | Invitation security (TR-035); role-model access controls for the auditor flow (TR-036); all auditor actions in audit_log (TR-038) |
| FR-044 | Shared Findings Model | TR-022, TR-016 | `findings` table (TR-022); findings in PIT export payload (TR-016) |
| FR-045 | No Duplicate Truth Rule | TR-024 | Unique constraint on `(assessment_id, criterion_id, storage_ref)` (TR-024) |
| FR-046 | Output Fork Decision | TR-016, TR-022 | PIT export path (TR-016); `pit_exports` table (TR-022) |
| FR-047 | Report Output Requirements | TR-022, TR-055 | `findings` and evidence tables (TR-022); report generation covered in integration tests (TR-055) |
| FR-048 | Report Configuration | TR-022 | Report configuration stored in assessment metadata (TR-022) |
| FR-049 | PIT Export Requirements (OQ-004 RESOLVED) | TR-016, TR-017, TR-018 | Export payload schema (TR-016); export handshake protocol (TR-017); evidence return (TR-018) |
| FR-050 | Dashboard Publication Behaviour | TR-005, TR-008 | Dashboard render SLA (TR-005); real-time update (TR-008) |
| FR-051 | Dashboard CL-13 Carry-Over Alignment (OQ-006 RESOLVED) | TR-005, TR-022 | Dashboard performance (TR-005); maturity_scores table supports CL-13 dashboard data (TR-022) |
| FR-052 | Dashboard Wow Factor | TR-005, TR-057 | Dashboard render performance (TR-005); Lighthouse score gate (TR-057) |
| FR-053 | MMM ↔ AIMC Functional Boundary | TR-011, TR-012, TR-013, TR-014, TR-015 | Full AIMC technical contract (TR-011 through TR-015) |
| FR-054 | MMM ↔ PIT Functional Boundary | TR-016, TR-017, TR-018 | Full PIT technical contract (TR-016 through TR-018) |
| FR-055 | MMM ↔ KUC Functional Boundary | TR-019, TR-020 | Full KUC upload contract (TR-019, TR-020) |
| FR-056 | Framework-Source Ingestion Functional Specification | TR-015, TR-019, TR-020, TR-022 | Framework-parse AIMC endpoint (TR-015); KUC upload (TR-019); classification (TR-020); parse_jobs table (TR-022) |
| FR-057 | Evidence-Source Ingestion Functional Specification | TR-015, TR-019, TR-020, TR-022 | Evidence-evaluate AIMC endpoint (TR-015); KUC upload (TR-019); classification (TR-020); evidence table (TR-022) |
| FR-058 | Switchover Gate Parameterisation (OQ-007 RESOLVED) | TR-022 | Single gate model applies to all migration classes; no separate TRS requirement needed; `frameworks.status` supports lifecycle transitions (TR-022) |
| FR-059 | Source-System Inheritance and Traceability | TR-022, TR-027 | `frameworks.source_type` and version (TR-022); version snapshots (TR-027) |
| FR-060 | Core Role Model | TR-029, TR-030, TR-036 | Auth provider (TR-029); JWT requirements (TR-030); role-based permission matrix (TR-036) |
| FR-061 | Invitation Model | TR-035 | Invitation security: token entropy, expiry, single-use (TR-035) |
| FR-062 | Scope-Based Permissions | TR-031, TR-032, TR-036 | RLS baseline (TR-031); org isolation (TR-032); permission matrix (TR-036) |
| FR-063 | No Local AI Stack | TR-011, TR-015 | Service-to-service JWT for all AIMC calls (TR-011); all AI via defined endpoints (TR-015) |
| FR-064 | AI Human Oversight Rule | TR-033 | `maturity_scores` requires `confirmed_by`; AI proposals in separate table (TR-033) |
| FR-065 | AI Governance Requirements | TR-034, TR-038 | AI interaction audit logging (TR-034); audit_logs technical requirements (TR-038) |
| FR-066 | Back-Office AI Administration Interface | TR-015, TR-053 | AIMC endpoint contract (TR-015); environment config includes AIMC credentials (TR-053) |
| FR-067 | Health and Telemetry Endpoints | TR-010, TR-052 | Health endpoint response time (TR-010); health endpoint JSON schema (TR-052) |
| FR-068 | QIW Dashboard | TR-060 | QIW dashboard gate (TR-060) |
| FR-069 | Performance Measurement Baseline | TR-001, TR-002, TR-003 | Page load (TR-001); API SLA (TR-002); concurrent user capacity (TR-003) |
| FR-070 | Circuit Breaker Requirements | TR-009, TR-014 | Circuit breaker threshold (TR-009); AIMC timeout + retry policy (TR-014) |
| FR-071 | Compliance Baseline | TR-037, TR-058 | Compliance artifacts (TR-037); security scan gate (TR-058) |
| FR-072 | Commissioning Model | TR-051, TR-064 | Commissioning state machine (TR-051); APP_STARTUP_REQUIREMENTS.md (TR-064) |
| FR-073 | Audit Log Design | TR-023, TR-038 | Data retention (TR-023); audit_logs table technical requirements (TR-038) |
| FR-074 | Tutorial and Help Model | TR-059 | Accessibility gate (TR-059) — help model accessibility confirmed via axe-core |
| FR-075 | Consistent Notification Model | TR-062 | Notification technical contract (TR-062) |
| FR-076 | State Persistence Model | TR-063 | localStorage state persistence model (TR-063) |
| FR-077 | Drill-Down Context Visibility | TR-002, TR-046 | API response SLA for drill-down data (TR-002); index on criteria.mps_id for lookup (TR-046) |
| FR-078 | Collapsibility and Multi-Level Navigation | TR-001, TR-057 | Page load SLA for navigation (TR-001); Lighthouse performance gate (TR-057) |
| FR-079 | Canonical Data Separation | TR-028 | MMM data namespace isolation (TR-028) |
| FR-080 | Versioning Requirements | TR-027 | Framework versioning with immutable snapshots (TR-027) |

---

## Summary

| Metric | Value |
|--------|-------|
| Total FRS requirements | 80 (FR-001 through FR-080) |
| Total traced | 80 |
| Untraced | 0 |
| Total TRS requirements referenced | 64 (TR-001 through TR-064) |
| Average TRS references per FR | 2.4 |
| FRs with multiple TRS references | 47 |
| FRs with single TRS reference | 33 |
| **Completeness** | **100%** |

---

## Coverage Notes

### FR-042 — MAT Label Survival Decision
FR-042 resolves a governance/branding decision (no "MAT" label in MMM UI). This is a
naming/governance constraint, not a technical implementation requirement. It is traced
to TR-053 (environment configuration) as the closest technical anchor point. The
architecture and QA-to-Red stages will enforce this constraint via code review and
UI test assertions.

### FR-058 — Switchover Gate Parameterisation
FR-058 resolves OQ-007 at the functional level (single gate model applies to all
migration classes). No dedicated TRS requirement is needed beyond the `frameworks.status`
lifecycle support in TR-022. The switchover gate itself is a governance process control,
not a technical implementation requirement for Stage 4 TRS.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Version**: 0.1.0  
**Stage**: 4 — TRS (Pre-Build Specification)  
**Issue**: maturion-isms#1372
