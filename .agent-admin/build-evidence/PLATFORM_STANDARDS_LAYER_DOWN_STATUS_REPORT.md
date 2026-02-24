# Platform Standards Layer-Down Status Report

**Report Type**: Governance Layer-Down Compliance Audit  
**Prepared by**: Governance Liaison (governance-liaison-isms)  
**Session**: session-019-20260224  
**Report Date**: 2026-02-24  
**Scope**: MAT module / maturion-isms repository  
**Issue Reference**: #[Issue — Extract and Report Layer-Down Status for Mandatory Platform Standards]  
**Authority**: GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md, CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md

---

## Executive Summary

This report audits the layer-down and implementation status of all mandatory platform-wide governance standards in the `maturion-isms` repository, with primary focus on the MAT (Manual Audit Tool) module. Standards audited cover AI requirements, watchdog/oversight, tenant isolation, cross-app components, QA/evidence, and supporting canon files.

**Overall Finding**: The maturion-isms repository has **substantially layered-down all mandatory canonical governance standards** into its `governance/canon/` directory. The MAT module references these standards in its architecture and FRS documents and has implemented runtime artefacts for watchdog, tenant isolation (via RLS), and evidence. However, **four compliance gaps** have been identified requiring follow-up action.

---

## 1. Canon Layer-Down Status (governance/canon/ Directory)

All `PUBLIC_API` canon files are expected to be present under `governance/canon/`. The following table reports each standard's presence in this consumer repository.

| Standard File | Canonical Path | Present in This Repo | Canon Version | Effective Date | Layer-Down Status | Notes |
|---|---|---|---|---|---|---|
| `PLATFORM_AI_REQUIREMENTS.md` | `governance/canon/PLATFORM_AI_REQUIREMENTS.md` | ✅ PRESENT | 1.0.0 | 2026-02-19 | PUBLIC_API | Fully layered-down |
| `WATCHDOG_AUTHORITY_AND_SCOPE.md` | `governance/canon/WATCHDOG_AUTHORITY_AND_SCOPE.md` | ✅ PRESENT | 1.0.0 | 2025-12-23 | OPTIONAL | Present; optional layer-down |
| `WATCHDOG_COGNITIVE_OBSERVATION_PROTOCOL.md` | `governance/canon/WATCHDOG_COGNITIVE_OBSERVATION_PROTOCOL.md` | ✅ PRESENT | 1.0.0 | 2025-12-24 | OPTIONAL | Present; optional layer-down |
| `WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` | `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` | ✅ PRESENT | 1.0.0 | 2026-01-13 | PUBLIC_API | Fully layered-down |
| `MANDATORY_CROSS_APP_COMPONENTS.md` | `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` | ✅ PRESENT | 1.0.0 | 2026-02-13 | PUBLIC_API | Fully layered-down |
| `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` | `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` | ✅ PRESENT | 1.0.0 | 2026-02-10 | PUBLIC_API | Fully layered-down |
| `APP_STARTUP_REQUIREMENTS_DECLARATION.md` | `governance/canon/APP_STARTUP_REQUIREMENTS_DECLARATION.md` | ✅ PRESENT | 1.0 | unknown | PUBLIC_API | Fully layered-down |
| `MATURION_RUNTIME_EXECUTION_MONITOR_SPEC.md` | `governance/canon/MATURION_RUNTIME_EXECUTION_MONITOR_SPEC.md` | ✅ PRESENT | unknown | unknown | PUBLIC_API | Layered-down; version TBC |
| `AIMC_STRATEGY.md` | `governance/canon/AIMC_STRATEGY.md` | ✅ PRESENT | — | — | PUBLIC_API | Layered via PR #441 |
| `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` | `governance/canon/ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` | ✅ PRESENT | — | — | PUBLIC_API | Fully layered-down |

**Note on Maturion/ source documents**: The following source specifications exist in `Maturion/` and are **not governance/canon PUBLIC_API files** — they are constitutional source documents that canon files codify. They are NOT expected to be layered as-is into consumer repos:

| Source Document | Location | Status |
|---|---|---|
| `oversight-system.md` | `Maturion/oversight-system.md` | Constitutional source (in this repo as legacy asset) |
| `maturion-tenant-isolation-standard.md` | `Maturion/maturion-tenant-isolation-standard.md` | Constitutional source (in this repo as legacy asset) |
| `cross-tenant-intelligence-safety-layer-spec.md` | `Maturion/cross-tenant-intelligence-safety-layer-spec.md` | Constitutional source (in this repo as legacy asset) |

---

## 2. MAT Module Implementation Status

This section assesses whether each mandatory governance standard is **referenced in MAT architecture/documentation** and **implemented in runtime code**.

### 2.1 Platform AI Requirements (`PLATFORM_AI_REQUIREMENTS.md`)

| Check | Status | Evidence |
|---|---|---|
| Canon file present in repo | ✅ YES | `governance/canon/PLATFORM_AI_REQUIREMENTS.md` v1.0.0 |
| Referenced in MAT architecture | ✅ YES | `modules/mat/02-architecture/ai-architecture.md` v2.0.0 — AIMC Gateway Pattern |
| Referenced in MAT FRS | ✅ YES | FR-072: Embedded AI Assistant (references MANDATORY_CROSS_APP_COMPONENTS.md §13, AIMC_STRATEGY.md) |
| Referenced in builder contract | ✅ YES | `modules/mat/04-builder-appointment/builder-contract.md` Wave 7–9 |
| Runtime implementation | ⚠️ BLOCKED | MAT AI waves (7–9) are constitutionally blocked pending AIMC waves 3–5 |
| AI Assistant UI component | ⚠️ PARTIAL | `modules/mat/frontend/src/components/common/EmbeddedAIAssistant.tsx` exists as scaffold |
| App-specific AI agent file | ⚠️ ABSENT | No `APP_STARTUP_REQUIREMENTS.md` or dedicated AI agent file found for MAT |
| **Overall Status** | ⚠️ **PARTIAL / BLOCKED** | Architecture aligned; runtime blocked on AIMC dependency |

**Compliance Gap**: MAT does not have an `APP_STARTUP_REQUIREMENTS.md` file explicitly declaring its AI exemption/blocking status per `APP_STARTUP_REQUIREMENTS_DECLARATION.md` requirements. This is a **minor compliance gap** — the AIMC blocker is documented in the AI architecture, but not formally declared in the standard location.

---

### 2.2 Watchdog / Oversight Standards

#### 2.2.1 `WATCHDOG_AUTHORITY_AND_SCOPE.md`

| Check | Status | Evidence |
|---|---|---|
| Canon file present in repo | ✅ YES | `governance/canon/WATCHDOG_AUTHORITY_AND_SCOPE.md` v1.0.0 |
| Layer-down status | ℹ️ OPTIONAL | CANON_INVENTORY marks this as OPTIONAL layer-down |
| Referenced in MAT architecture | ✅ YES | `modules/mat/02-architecture/observability-architecture.md` §4 (Watchdog Implementation) |
| Referenced in MAT FRS | ✅ YES | FR-059: Watchdog Monitoring Metrics; FR-060: Watchdog Alert Thresholds |
| Runtime implementation | ✅ YES | `modules/mat/src/services/watchdog.ts` — full watchdog service with metrics, thresholds, alert routing |
| Tests present | ✅ YES | `modules/mat/tests/watchdog-observability/watchdog-observability.test.ts` |
| **Overall Status** | ✅ **IMPLEMENTED** | Watchdog authority scope respected; runtime service implemented and tested |

#### 2.2.2 `WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md`

| Check | Status | Evidence |
|---|---|---|
| Canon file present in repo | ✅ YES | `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` v1.0.0 |
| Layer-down status | PUBLIC_API | Required in consumer repos |
| Referenced in MAT QA gates | ✅ YES | `.github/workflows/merge-gate-interface.yml` — stop-and-fix enforcement job |
| Quality Integrity Contract enforced | ✅ YES | Merge gate enforces lint, build, test, governance/alignment gates |
| **Overall Status** | ✅ **IMPLEMENTED** | QIW channel enforced via merge gate |

#### 2.2.3 Oversight System Source (`Maturion/oversight-system.md`)

| Check | Status | Evidence |
|---|---|---|
| Present in repo | ✅ YES | `Maturion/oversight-system.md` (constitutional source, legacy) |
| Implemented as watchdog service | ✅ YES | `modules/mat/src/services/watchdog.ts` implements monitoring/alerting |
| Full three-watchdog system (Guardian/Sentinel/Arbiter) | ❌ NOT IMPLEMENTED | MAT implements application-level watchdog metrics, NOT the full three-watchdog autonomy system |
| **Overall Status** | ⚠️ **PARTIAL** | App-level watchdog implemented; platform-level three-watchdog AI autonomy system is a platform concern (not MAT's responsibility to implement unilaterally) |

**Note**: The full Guardian/Sentinel/Arbiter oversight system described in `oversight-system.md` is a **platform-level AI autonomy safety system**, not an individual module responsibility. MAT's obligation is to expose watchdog metrics and respect oversight signals — which it does.

---

### 2.3 Tenant Isolation (`maturion-tenant-isolation-standard.md`)

| Check | Status | Evidence |
|---|---|---|
| Constitutional source present | ✅ YES | `Maturion/maturion-tenant-isolation-standard.md` (in repo as legacy asset) |
| Cross-tenant safety layer spec | ✅ YES | `Maturion/cross-tenant-intelligence-safety-layer-spec.md` |
| `organisation_id` on all tables | ✅ YES | `modules/mat/02-architecture/data-architecture.md` — all tables have `organisation_id NOT NULL` |
| RLS enabled on all tenant-scoped tables | ✅ YES | `modules/mat/02-architecture/security-architecture.md` §2 — "RLS enabled on ALL tenant-scoped tables" |
| Organisation isolation policy | ✅ YES | `security-architecture.md` — "Organisation isolation: users see only their organisation's data" |
| Runtime RLS implementation | ✅ YES | `modules/mat/src/services/security-rls.ts` — role permissions, RLS policies, encryption config |
| No cross-tenant data leak | ✅ YES | `modules/mat/src/services/data-privacy.ts` — GDPR/POPIA compliance, user-scoped exports |
| Cross-tenant AI contamination prevention | ✅ YES | `ai-architecture.md` — MAT uses AIMC Gateway (no direct AI provider access, no cross-tenant model contamination possible at MAT level) |
| Explicit reference to `maturion-tenant-isolation-standard.md` in MAT docs | ⚠️ ABSENT | No explicit citation of the isolation standard by name in MAT architecture |
| **Overall Status** | ✅ **IMPLEMENTED** (with minor doc gap) | Tenant isolation implemented via RLS and organisation_id scoping; explicit citation of standard name is absent from architecture docs |

**Minor Gap**: The `modules/mat/02-architecture/security-architecture.md` and `data-architecture.md` do not explicitly cite `maturion-tenant-isolation-standard.md` by name. They implement the standard's requirements but do not trace authority. This is a **documentation gap**, not an implementation gap.

---

### 2.4 Mandatory Cross-App Components (`MANDATORY_CROSS_APP_COMPONENTS.md`)

| Category | Requirement | Status | Evidence |
|---|---|---|---|
| **CATEGORY 1: Agent System & Contracts** | Agent contract present | ✅ YES | `.github/agents/` — agent contracts present |
| **CATEGORY 2: Watchdog & Oversight** | Watchdog service | ✅ YES | `modules/mat/src/services/watchdog.ts` |
| **CATEGORY 3: Performance Measurement** | Performance architecture | ✅ YES | `modules/mat/02-architecture/performance-architecture.md` |
| **CATEGORY 4: Observability & Telemetry** | Observability architecture | ✅ YES | `modules/mat/02-architecture/observability-architecture.md` |
| **CATEGORY 5: Feedback & Learning** | RCA documents | ✅ YES | `modules/mat/05-rca/`, `modules/mat/05-build-evidence/RCA_*.md` |
| **CATEGORY 6: Compliance & Evidence** | Evidence bundle structure | ✅ YES | `.agent-admin/prehandover/`, `.agent-admin/gates/` |
| **CATEGORY 7: Startup & Commissioning** | App startup requirements | ❌ MISSING | `APP_STARTUP_REQUIREMENTS.md` **NOT FOUND** for MAT module |
| **CATEGORY 8: Architecture Completeness** | Architecture docs | ✅ YES | `modules/mat/02-architecture/` — 10 architecture documents present |
| **§13: Platform AI Features** | AI assistant, context-aware AI | ⚠️ BLOCKED | Documented; blocked on AIMC upstream dependency |
| Canon file present in repo | ✅ YES | `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` v1.0.0 |
| Referenced in MAT builder contract | ✅ YES | `modules/mat/04-builder-appointment/builder-contract.md` |
| Referenced in MAT FRS | ✅ YES | FR-072 references MANDATORY_CROSS_APP_COMPONENTS.md §13 |
| **Overall Status** | ⚠️ **PARTIAL** | Most categories covered; `APP_STARTUP_REQUIREMENTS.md` missing |

**Compliance Gap**: `APP_STARTUP_REQUIREMENTS.md` per `APP_STARTUP_REQUIREMENTS_DECLARATION.md` is **MISSING** for the MAT module. This file must be created at `modules/mat/APP_STARTUP_REQUIREMENTS.md` (or equivalent declared location). This is a **medium compliance gap**.

---

### 2.5 Evidence Artifact Bundle Standard (`EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`)

| Check | Status | Evidence |
|---|---|---|
| Canon file present in repo | ✅ YES | `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` v1.0.0 |
| `.agent-admin/prehandover/` exists | ✅ YES | Multiple prehandover proof files present |
| `.agent-admin/gates/` exists | ✅ YES | Present in `.agent-admin/` structure |
| `.agent-admin/rca/` exists | ⚠️ PARTIAL | RCA files are under `modules/mat/05-rca/` and `modules/mat/05-build-evidence/`, not `.agent-admin/rca/` |
| `.agent-admin/improvements/` exists | ⚠️ PARTIAL | Improvement files not consistently in standard location |
| `.agent-admin/governance/` exists | ✅ YES | Sync state, ripple log, drift reports present |
| Referenced in MAT builder contract | ✅ YES | Builder contract explicitly cites `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` |
| Machine-readable gate results | ✅ YES | Merge gate workflow produces structured outputs |
| **Overall Status** | ✅ **SUBSTANTIALLY COMPLIANT** | Core evidence structure in place; minor path deviations for RCA files |

---

### 2.6 Additional Canon Standards (Supporting)

| Standard | Canon Present | MAT Reference | Status |
|---|---|---|---|
| `AIMC_STRATEGY.md` | ✅ YES | `ai-architecture.md` — constitutionally required | ✅ Referenced |
| `AUDIT_READINESS_MODEL.md` | ✅ YES | Referenced in governance chain | ✅ Present |
| `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` | ✅ YES | Builder contract | ✅ Referenced |
| `COMMISSIONING_EVIDENCE_MODEL.md` | ✅ YES | Build evidence structure | ✅ Referenced |
| `WE_ONLY_FAIL_ONCE_DOCTRINE.md` | ✅ YES | Builder contract | ✅ Referenced |
| `CASCADING_FAILURE_CIRCUIT_BREAKER.md` | ✅ YES | Present in canon | ✅ Present |
| `COMPLIANCE_AND_STANDARDS_GOVERNANCE.md` | ✅ YES | Present in canon | ✅ Present |
| `GOVERNANCE_VALIDATION_PROTOCOL.md` | ✅ YES | Merge gate | ✅ Referenced |

---

## 3. Compliance Gap Summary

| # | Standard | Gap Type | Severity | Remediation Required |
|---|---|---|---|---|
| CG-001 | `APP_STARTUP_REQUIREMENTS_DECLARATION.md` | `APP_STARTUP_REQUIREMENTS.md` missing for MAT module | **MEDIUM** | YES — Create `modules/mat/APP_STARTUP_REQUIREMENTS.md` declaring MAT's commissioning requirements, AI blocking justification, and startup checks |
| CG-002 | `PLATFORM_AI_REQUIREMENTS.md` | AI implementation blocked on AIMC upstream; blocking justification not formally filed in standard location | **LOW** | YES — Include AI blocking justification in `APP_STARTUP_REQUIREMENTS.md` (resolves with CG-001) |
| CG-003 | `maturion-tenant-isolation-standard.md` | Security and data architecture docs do not explicitly cite the isolation standard by name | **LOW** | RECOMMENDED — Add citation reference in `modules/mat/02-architecture/security-architecture.md` header |
| CG-004 | `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` | RCA files stored in `modules/mat/05-rca/` rather than `.agent-admin/rca/` | **LOW** | RECOMMENDED — Either move RCA files to `.agent-admin/rca/` or add symlink/pointer in `.agent-admin/rca/` |

---

## 4. Remediation Recommendations

### CG-001 + CG-002 (Combined): Create `APP_STARTUP_REQUIREMENTS.md` for MAT

**Priority**: MEDIUM  
**Action**: Create `modules/mat/APP_STARTUP_REQUIREMENTS.md`  
**Authority**: `APP_STARTUP_REQUIREMENTS_DECLARATION.md` §4.2  
**Content must include**:
- MAT module identification and risk profile
- Technical startup checks (Supabase connection, RLS validation, schema migration)
- Security startup checks (auth configuration, RLS policy verification)
- AI feature blocking declaration (AIMC dependency, blocked waves 7–9)
- Commissioning authorization requirements
- Evidence artifacts required for activation

**Suggested PR**: Single PR titled `feat(mat): add APP_STARTUP_REQUIREMENTS.md`

---

### CG-003: Add Tenant Isolation Standard Citation

**Priority**: LOW  
**Action**: Add governance reference citation to `modules/mat/02-architecture/security-architecture.md`  
**Change**: Add `maturion-tenant-isolation-standard.md` to the "Governance" header/authority section  
**Effort**: < 5 lines

---

### CG-004: RCA Evidence Path Alignment

**Priority**: LOW  
**Action**: Create `.agent-admin/rca/` directory with pointer to `modules/mat/05-rca/`  
**Alternative**: Add `.agent-admin/rca/README.md` documenting that MAT RCA files are maintained in `modules/mat/05-rca/` per module-scoped convention  
**Effort**: < 10 lines

---

## 5. Governance Sync State

| Metric | Value |
|---|---|
| Canonical Inventory Version | 1.0.0 (CANON_INVENTORY.json) |
| Last Sync Timestamp | 2026-02-24T11:44:12Z |
| Total PUBLIC_API Canons in Repo | 106 |
| SHA256 Verified | 96 |
| SHA256 Variance Files | 6 (documented in sync_state.json) |
| Drift Detected | false |
| Alignment Status | ALIGNED |
| Canon Source | APGI-cmy/maturion-foreman-governance |

---

## 6. Conclusion

The `maturion-isms` repository is **substantially compliant** with all mandatory platform governance standards. All key `PUBLIC_API` canon files are present and layered-down. The MAT module implements watchdog services, tenant isolation (RLS), evidence bundles, and references governance standards in its architecture and FRS documents.

**Four compliance gaps** have been identified — one medium (missing `APP_STARTUP_REQUIREMENTS.md`) and three low (documentation/path alignment). None of the gaps represent a runtime security or compliance failure; all are documentation or declaration gaps.

**Recommended immediate action**: Create a single follow-up PR to address CG-001 + CG-002 (the `APP_STARTUP_REQUIREMENTS.md` file for MAT). CG-003 and CG-004 can be bundled in the same PR or deferred.

---

## Appendix A: Files Checked

| File Path | Type | Exists |
|---|---|---|
| `governance/canon/PLATFORM_AI_REQUIREMENTS.md` | Canon | ✅ |
| `governance/canon/WATCHDOG_AUTHORITY_AND_SCOPE.md` | Canon | ✅ |
| `governance/canon/WATCHDOG_COGNITIVE_OBSERVATION_PROTOCOL.md` | Canon | ✅ |
| `governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` | Canon | ✅ |
| `governance/canon/MANDATORY_CROSS_APP_COMPONENTS.md` | Canon | ✅ |
| `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` | Canon | ✅ |
| `governance/canon/APP_STARTUP_REQUIREMENTS_DECLARATION.md` | Canon | ✅ |
| `governance/canon/MATURION_RUNTIME_EXECUTION_MONITOR_SPEC.md` | Canon | ✅ |
| `governance/canon/AIMC_STRATEGY.md` | Canon | ✅ |
| `Maturion/oversight-system.md` | Constitutional source | ✅ |
| `Maturion/maturion-tenant-isolation-standard.md` | Constitutional source | ✅ |
| `Maturion/cross-tenant-intelligence-safety-layer-spec.md` | Constitutional source | ✅ |
| `modules/mat/src/services/watchdog.ts` | Runtime | ✅ |
| `modules/mat/src/services/security-rls.ts` | Runtime | ✅ |
| `modules/mat/src/services/data-privacy.ts` | Runtime | ✅ |
| `modules/mat/02-architecture/ai-architecture.md` | Architecture | ✅ |
| `modules/mat/02-architecture/observability-architecture.md` | Architecture | ✅ |
| `modules/mat/02-architecture/security-architecture.md` | Architecture | ✅ |
| `modules/mat/02-architecture/data-architecture.md` | Architecture | ✅ |
| `modules/mat/tests/watchdog-observability/watchdog-observability.test.ts` | Test | ✅ |
| `modules/mat/frontend/src/components/common/EmbeddedAIAssistant.tsx` | UI scaffold | ✅ |
| `modules/mat/APP_STARTUP_REQUIREMENTS.md` | Declaration | ❌ MISSING |
| `.agent-admin/rca/` | Evidence | ⚠️ PARTIAL |

---

## Appendix B: Implementation Plan Gap Analysis

**Reference**: `modules/mat/03-implementation-plan/implementation-plan.md` v1.8.0  
**Question**: Which of the governance standard requirements from this report are accommodated in the MAT build as per the implementation plan?

### B.1 Summary Table

| Governance Requirement | Implementation Plan Coverage | Wave(s) | Build Status |
|---|---|---|---|
| **Tenant Isolation / RLS** | ✅ FULLY COVERED | Wave 0 (Task 0.1) | ✅ GREEN — 172/172 tests pass |
| **Watchdog Service** | ✅ FULLY COVERED | Wave 5 (Task 5.1) | ✅ GREEN — MAT-T-0059–0062 pass |
| **AI Integration (FR-072, PLATFORM_AI_REQUIREMENTS)** | ✅ PLANNED, BLOCKED | Waves 7, 8, 9 | ⛔ BLOCKED — Awaiting AIMC Waves 3, 4, 5 |
| **Evidence Bundle (EVIDENCE_ARTIFACT_BUNDLE_STANDARD)** | ✅ ENFORCED AT EVERY GATE | All waves | ✅ PREHANDOVER proof mandated per wave gate |
| **Deployment & Commissioning (Wave 6 = startup/activation)** | ✅ COVERED | Wave 6 | ⚠️ PARTIAL — QA gate PASS; production pending CS2 access |
| **APP_STARTUP_REQUIREMENTS** | ❌ NOT IN PLAN (pre-existing gap) | Not assigned | ❌ MISSING from implementation plan scope |
| **Tenant Isolation Citation in Architecture Docs** | ❌ NOT IN PLAN | Not assigned | Documentation gap (now fixed in this PR) |
| **Cross-App Commissioning Checks** | ✅ PARTIALLY COVERED | Wave 6 (Task 6.4) | ✅ Security validation + CWT included |

---

### B.2 Detailed Findings

#### B.2.1 Tenant Isolation / RLS — ✅ Fully Accommodated

The implementation plan explicitly covers tenant isolation in **Wave 0, Task 0.1**:

> *"Create RLS policies per `security-architecture.md`"*  
> *"All RLS policies enforce organisation isolation (MAT-T-0042–0050)"*

- **Test coverage**: MAT-T-0042–0050 (9 tests covering RLS policies)
- **Wave 0 status**: ✅ GREEN (31 tests GREEN including all RLS tests)
- **Production validation**: Wave 6 Task 6.4 includes *"Security validation on production (RLS, auth, MFA, CORS)"*

**Gap vs. report**: The implementation plan covers the *implementation* of tenant isolation (RLS + `organisation_id`). It does not explicitly cite `maturion-tenant-isolation-standard.md` by name — which is the documentation gap CG-003, now remediated.

---

#### B.2.2 Watchdog Service — ✅ Fully Accommodated

The implementation plan covers watchdog in **Wave 5, Task 5.1: Watchdog Monitoring**:

> *"Alert threshold definitions (error rates, latency, AI costs)"*  
> *"Watchdog metrics captured for all services (MAT-T-0059)"*  
> *"Alerts trigger at defined thresholds (MAT-T-0060)"*  
> *"Alert routing delivers to correct channels (MAT-T-0061)"*  
> *"Health check endpoints return correct status (MAT-T-0062)"*

- **Test coverage**: MAT-T-0059–0062 (4 tests)
- **Wave 5 status**: ✅ GREEN (13 tests GREEN including MAT-T-0059–0060)
- **Runtime artefact**: `modules/mat/src/services/watchdog.ts` ✅

`WATCHDOG_AUTHORITY_AND_SCOPE.md` and `WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` are respected: the implementation plan specifies that MAT exposes watchdog metrics (read-only observation) and does not implement a full autonomous oversight system (which is a platform-level concern).

---

#### B.2.3 AI Features (PLATFORM_AI_REQUIREMENTS) — ✅ Planned, ⛔ Blocked

The implementation plan covers AI features in three dedicated waves:

| Wave | Scope | AIMC Prerequisite | Build Status |
|---|---|---|---|
| Wave 7 — AIMC Advisory Integration | FR-072: Embedded AI assistant, Maturity Advisor persona | AIMC Wave 3 (Advisory Gateway) | ⛔ BLOCKED |
| Wave 8 — AIMC Analysis Integration | TR-037–038: AI scoring + parsing via AIMC | AIMC Wave 4 (Analysis Gateway) | ⛔ BLOCKED |
| Wave 9 — AIMC Embeddings/RAG | RAG-based criteria search | AIMC Wave 5 (Embeddings/RAG) | ⛔ BLOCKED |

**Key implementation plan language** (v1.7.0 correction):
> *"All builder-facing scope statements now reference AIMC Gateway capability calls exclusively per `AIMC_STRATEGY.md` v1.0.0 and `ai-architecture.md` v2.0.0."*

The AIMC blocking is **intentional and constitutional** — not a compliance gap. The plan correctly prevents premature AI implementation before the platform-level AIMC gateway exists.

**Plan gap**: Neither Wave 7/8/9 nor Wave 6 reference `APP_STARTUP_REQUIREMENTS.md` as a commissioning gate that must be checked before activation — this is the CG-001 gap now remediated.

---

#### B.2.4 Evidence Bundle (EVIDENCE_ARTIFACT_BUNDLE_STANDARD) — ✅ Fully Accommodated

The implementation plan enforces the evidence bundle standard at **every wave gate**:

> *"PREHANDOVER proof compiled"* — required at the close of every wave (Waves 0–6 gate criteria)

Wave-by-wave coverage:
- Each wave gate requires: *"Zero warnings. PREHANDOVER proof compiled."*
- Wave 5.6 gate adds: *"Video walkthrough + screenshots committed to evidence bundle"*
- Wave 6 gate adds: *"Closure evidence documented"*

The `.agent-admin/` structure (`prehandover/`, `gates/`, `governance/`) is established and used.

**Partial gap (CG-004)**: RCA files are stored in `modules/mat/05-rca/` rather than `.agent-admin/rca/`. The implementation plan does not specify the `.agent-admin/rca/` path. A pointer README has been added (this PR) to bridge the gap without moving existing evidence.

---

#### B.2.5 APP_STARTUP_REQUIREMENTS — ❌ Not in Implementation Plan

The implementation plan does **not** include creation of `APP_STARTUP_REQUIREMENTS.md` as a deliverable in any wave.

- **Wave 6** covers deployment and commissioning, including production security validation and CWT — but it does not reference `APP_STARTUP_REQUIREMENTS_DECLARATION.md` or require creation of the startup declaration file.
- The `APP_STARTUP_REQUIREMENTS_DECLARATION.md` canon (v1.0) requires every application to have this file, but it was never added to the MAT build plan.

**Remediation (this PR)**: `modules/mat/APP_STARTUP_REQUIREMENTS.md` created as a standalone governance document. Because it is a governance declaration (not a runtime artefact), it does not require a new implementation wave — it is complete as-is and should be reviewed during Wave 6 commissioning sign-off.

**Recommendation**: The implementation plan should be updated in a future revision to explicitly reference `APP_STARTUP_REQUIREMENTS.md` as a Wave 6 commissioning prerequisite check.

---

#### B.2.6 Deployment & Commissioning (Wave 6) vs. APP_STARTUP_REQUIREMENTS Checks

Wave 6 of the implementation plan covers many of the same checks defined in `APP_STARTUP_REQUIREMENTS.md`, but does so without explicitly referencing it:

| `APP_STARTUP_REQUIREMENTS.md` Check | Implementation Plan Coverage |
|---|---|
| Application builds successfully | Wave 6 Task 6.1 — Vercel provisioning + build verification |
| Test suite passes | Wave 6 Task 6.4 — CWT 100% GREEN on production (all 98 tests) |
| Schema migration applied | Wave 6 Task 6.2 — Staging environment validation |
| Environment variables configured | Wave 6 Task 6.1 — *"Provision all required environment variables"* |
| RLS policies verified | Wave 6 Task 6.4 — *"Security validated on production (RLS cross-org isolation, auth flows, MFA)"* |
| Authentication configuration | Wave 6 Task 6.4 — *"auth flows, MFA"* |
| Watchdog operational | Wave 6 Task 6.4 — *"full audit lifecycle, watchdog monitoring"* |
| AI blocking acknowledged | Wave 7/8/9 — Explicit BLOCKED status with AIMC prerequisite |
| CS2 activation approval | Wave 6 Task 6.4 — *"Formal sign-over completed by governance agent or product owner"* |

**Conclusion**: Wave 6 covers substantially all of the commissioning checks in `APP_STARTUP_REQUIREMENTS.md`. The gap is that these checks were not formally linked to the startup declaration standard, making the process implicit rather than explicit.

---

### B.3 Gap Summary (Implementation Plan vs. Report)

| # | Requirement | In Implementation Plan? | Plan Wave | Remediation |
|---|---|---|---|---|
| RLS / Tenant Isolation | ✅ YES | Wave 0 (Task 0.1) | ✅ COMPLETE |
| Watchdog Service | ✅ YES | Wave 5 (Task 5.1) | ✅ COMPLETE |
| AI Features (PLATFORM_AI_REQUIREMENTS) | ✅ YES (Waves 7–9, BLOCKED) | Waves 7, 8, 9 | ⛔ BLOCKED (by design) |
| Evidence Bundle per Wave | ✅ YES (every gate) | All waves | ✅ COMPLETE |
| Deployment & Security Commissioning | ✅ YES | Wave 6 | ⚠️ QA gate PASS; prod pending CS2 |
| APP_STARTUP_REQUIREMENTS.md creation | ❌ NO | Not assigned | ✅ Created in this PR (governance doc) |
| Tenant isolation citation in arch docs | ❌ NO | Not assigned | ✅ Fixed in this PR (1-line doc change) |
| `.agent-admin/rca/` path alignment | ❌ NO | Not assigned | ✅ Fixed in this PR (pointer README) |

**Overall**: The implementation plan accommodates all *runtime* governance requirements (RLS, watchdog, AI gateway pattern, evidence). The three items not in the plan are documentation/declaration gaps — all resolved in this PR without requiring new implementation waves.

---

*Appendix B added: 2026-02-24 | In response to PR comment requesting implementation plan gap analysis*  
*Reference document: `modules/mat/03-implementation-plan/implementation-plan.md` v1.8.0*
