# MAT App V2 — Post-Delivery Gap Analysis & Root Cause Assessment (RCA)

**Document ID**: MAT-RCA-001  
**Module**: MAT (Manual Audit Tool)  
**Version**: v1.0.0  
**Status**: FINAL  
**Author**: Foreman (FM) v2.2.0  
**Created**: 2026-02-23  
**Last Updated**: 2026-02-23  
**Authority**: Post-delivery review directive — Issue [APGI-cmy/maturion-isms#MAT-V2-GAP]

---

## 1. Purpose

This document records the complete Root Cause Assessment (RCA) for all feature and implementation gaps identified after delivery of the MAT App V2. It fulfils the **"we only fail once"** continuous improvement philosophy, ensuring every gap is analysed, its root cause identified, and a concrete preventive action recorded.

This RCA is a permanent governance artifact. It is referenced by:
- `modules/mat/BUILD_PROGRESS_TRACKER.md`
- `modules/mat/03-implementation-plan/implementation-plan.md`
- Future MAT build waves and all post-delivery quality gates

---

## 2. Scope

The gap analysis was conducted against the authoritative requirement set:
- **App Description**: `modules/mat/00-app-description/app-description.md`
- **FRS**: `modules/mat/01-frs/functional-requirements.md` (FR-001–FR-072)
- **TRS**: `modules/mat/01.5-trs/technical-requirements-specification.md` (TR-001–TR-072)
- **Architecture**: `modules/mat/02-architecture/` (13 documents)
- **Red QA Suite**: `governance/TEST_REGISTRY.json` (MAT-T-0001–MAT-T-0098)
- **Implementation Plan**: `modules/mat/03-implementation-plan/implementation-plan.md` (v1.7.0)

---

## 3. Gap Analysis Summary Table

| # | Requirement | Delivered? | Status |
|---|---|---|---|
| G-01 | Create new audit | ✅ | Fully wired |
| G-02 | Upload criteria document | ✅ | Drag/drop, PDF/DOCX |
| G-03 | Domain → MPS → Criteria hierarchy display | ⚠️ | Data layer complete; UI render not verified |
| G-04 | Click criterion → open evidence modal | ⚠️ | Modal opens with mock data, not real DB fetch |
| G-05 | Evidence modal: text/findings | ✅ | Text tab implemented |
| G-06 | Evidence modal: voice recording | ✅ | Audio recording via MediaRecorder |
| G-07 | Evidence modal: photo capture | ❌ | Stub only — button emoji, no camera API |
| G-08 | Evidence modal: video capture | ✅ | Video via MediaRecorder |
| G-09 | Evidence modal: file upload | ✅ | Document tab implemented |
| G-10 | Evidence modal: interview recording | ❌ | Stub only — button emoji, no implementation |
| G-11 | AI evaluates evidence → creates finding | ❌ | AIScoringResults.tsx stub, no AI call wired |
| G-12 | AI maturity rating (1–5) | ⚠️ | ReviewTable reads scores; AI trigger not wired |
| G-13 | Human review table — confirm/override | ✅ | Full confirm/override with justification |
| G-14 | Submit → generate PDF/DOCX report | ⚠️ | UI complete; backend generation not confirmed |
| G-15 | Mobile-first / responsive | ⚠️ | Tailwind responsive classes used; not mobile-native verified |
| G-16 | Offline mode | ❌ | Was in scope; not verified as implemented |

**Legend**: ✅ Complete | ⚠️ Partial / Unverified | ❌ Not implemented / Stub

---

## 4. Root Cause Assessment — Individual Gap Analysis

### G-01: Create New Audit ✅

**Status**: FULLY WIRED — No RCA required.  
**Notes**: Audit creation flow (form, DB write, navigation to audit detail) confirmed working.

---

### G-02: Upload Criteria Document ✅

**Status**: FULLY WIRED — No RCA required.  
**Notes**: Drag-and-drop upload for PDF and DOCX confirmed; document-parser-agent pipeline wired.

---

### G-03: Domain → MPS → Criteria Hierarchy Display ⚠️

**Gap**: The data layer (Supabase schema, RLS, API) for the Domain → MPS → Criteria hierarchy is complete, but the UI render of this hierarchy was not independently verified against live data.

**Root Cause Category**: Implementation Oversight / Insufficient QA Scope  
**Root Cause Detail**: Wave 1 (Criteria Management) delivered the schema and API for criteria ingestion. Wave 5.6 (UI Component Wiring) was intended to wire the UI components to live data. The Red QA suite included API tests (MAT-T-0007–MAT-T-0014) but did not include an explicit end-to-end render verification test asserting that the three-tier hierarchy (Domain → MPS → Criteria) appears correctly in the browser from real Supabase data.

**FRS References**: FR-006 (Criteria hierarchy), FR-007 (MPS grouping), FR-008 (Domain display)  
**TRS References**: TR-006 (UI rendering contract), TR-021 (criteria data fetch)  
**Architecture References**: `ui-component-architecture.md` §4 (CriteriaTree component)

**Recommendation / Prevention**:
1. Add an explicit E2E test: "Given a seeded Supabase instance with criteria, when the user opens the criteria tree view, then all three levels (Domain, MPS, Criteria) render correctly with correct counts."
2. QA-to-Red gate must include render-level tests, not only data-layer tests, before any wave closes.
3. Builder checklist must include a "verify UI renders live data" step as a mandatory close condition.

**Corrective Action for Next Build Phase**: Add test MAT-T-0099 (criteria hierarchy E2E render) to the Red QA suite. Builder must not close Wave 5.6 without this test GREEN.

---

### G-04: Click Criterion → Open Evidence Modal ⚠️

**Gap**: The evidence modal opens but is populated with mock/hardcoded data instead of fetching the real criterion and existing evidence from the database.

**Root Cause Category**: Implementation Oversight / Incomplete Wiring  
**Root Cause Detail**: Wave 5.6 Task 5.6.3 (Evidence Collection Wiring) was scoped to wire the modal to the API, but the implementation stopped at opening the modal with placeholder data. The acceptance criterion in the implementation plan did not explicitly require that *the criterion ID and any existing evidence records be loaded from Supabase before the modal renders*. This created an ambiguous scope boundary that the builder resolved conservatively (show modal = done).

**FRS References**: FR-019 (evidence modal), FR-020 (pre-populate existing evidence), FR-021 (criterion context in modal)  
**TRS References**: TR-019 (evidence fetch on modal open), TR-020 (criterion context API call)  
**Architecture References**: `ui-component-architecture.md` §6 (EvidenceModal), `data-architecture.md` §3 (evidence table)

**Recommendation / Prevention**:
1. Acceptance criteria in the implementation plan must state: "When the modal opens, `GET /api/evidence?criterionId={id}` is called; the criterion title and any prior evidence items are displayed within 500ms."
2. The Red QA suite must include a wiring invariant test (MAT-T-wiring class) asserting the API call occurs on modal open.
3. "Mock data in production path" must be treated as a test debt / handover BLOCKER.

**Corrective Action for Next Build Phase**: Add test MAT-T-0100 (evidence modal fetches real data on open). Wave 5.6 gate cannot close until this is GREEN. Update Wave 5.6 Task 5.6.3 acceptance criteria in implementation plan.

---

### G-05: Evidence Modal — Text/Findings ✅

**Status**: FULLY WIRED — No RCA required.  
**Notes**: Text input tab with findings field confirmed implemented and wired.

---

### G-06: Evidence Modal — Voice Recording ✅

**Status**: FULLY WIRED — No RCA required.  
**Notes**: Audio recording via `MediaRecorder` API confirmed; recording stored and attached to evidence record.

---

### G-07: Evidence Modal — Photo Capture ❌

**Gap**: Photo capture is a stub: a button emoji exists in the UI with no `getUserMedia` / camera API integration.

**Root Cause Category**: Incomplete App Description / Deferred Requirement / Insufficient FRS Detail  
**Root Cause Detail**: The original App Description §6 listed "photo capture" as a media evidence type without specifying the implementation mechanism (camera stream via `getUserMedia`, file input `accept="image/*" capture="camera"`, or native camera intent). The FRS (FR-027: Photo Evidence Capture) specified the feature but TRS TR-027 did not drill into the API surface required. The implementation plan Wave 2 Task 2.3 (Evidence Collection UI) scoped voice, video, and file upload but did not include explicit sub-tasks for camera API integration. The builder implemented a placeholder consistent with the stub pattern used across unimplemented media types.

**FRS References**: FR-027 (photo capture)  
**TRS References**: TR-027 (camera integration)  
**Architecture References**: `ui-component-architecture.md` §6 (EvidenceModal — Photo tab)

**Recommendation / Prevention**:
1. TRS must specify the exact browser API (`getUserMedia` with `{ video: false, audio: false }` for still capture vs. `<input type="file" accept="image/*" capture="camera">` for mobile-native) and the storage path for captured images.
2. Implementation plan sub-tasks must include "Implement camera stream / file capture input; display preview; upload to Supabase Storage; attach to evidence record" as an explicit, individually-testable step.
3. Stub components must include a `TODO: [FEATURE_ID]` comment and a failing test in the Red QA suite so they cannot be shipped as "complete."

**Corrective Action for Next Build Phase**: Create Wave 2 remediation task: "Implement photo capture tab using `<input type='file' accept='image/*' capture='environment'>` (cross-platform) and/or `getUserMedia` (desktop). Upload to `evidence-media` Supabase Storage bucket. Add test MAT-T-0101. Gate: test GREEN before close."

---

### G-08: Evidence Modal — Video Capture ✅

**Status**: FULLY WIRED — No RCA required.  
**Notes**: Video recording via `MediaRecorder` API confirmed; stored and attached.

---

### G-09: Evidence Modal — File Upload ✅

**Status**: FULLY WIRED — No RCA required.  
**Notes**: Document upload tab confirmed; file stored in Supabase Storage.

---

### G-10: Evidence Modal — Interview Recording ❌

**Gap**: Interview recording is a stub: a button emoji exists with no recording implementation.

**Root Cause Category**: Incomplete App Description / Deferred Requirement / Insufficient FRS/TRS Detail  
**Root Cause Detail**: "Interview recording" is conceptually a specialised audio recording mode with additional metadata (interviewee name, date, consent flag). The App Description distinguished it from general voice recording but neither the FRS nor TRS defined the interface contract, consent capture mechanism, or storage schema difference from the standard voice recording tab. With no distinct technical specification, the builder had no basis to implement it differently from voice recording, and created a stub to avoid implementing duplicate functionality without a clear spec.

**FRS References**: FR-028 (interview recording)  
**TRS References**: TR-028 (interview recording — data model, consent)  
**Architecture References**: `ui-component-architecture.md` §6 (EvidenceModal — Interview tab)

**Recommendation / Prevention**:
1. FRS for interview recording must specify: consent capture fields (interviewee name, role, consent checkbox), metadata schema (separate `interview_recordings` table or extended `evidence` record), and whether it reuses `MediaRecorder` or requires a distinct flow.
2. TRS must specify storage path, maximum duration, bitrate requirements, and GDPR/POPIA consent metadata retention.
3. If interview recording shares the `MediaRecorder` pipeline with voice, the FRS must say so explicitly to prevent re-invention.

**Corrective Action for Next Build Phase**: Expand FR-028 and TR-028 with full implementation contract. Create Wave 2 remediation task. Add test MAT-T-0102. Gate: test GREEN before close.

---

### G-11: AI Evaluates Evidence → Creates Finding ❌

**Gap**: `AIScoringResults.tsx` exists as a stub with no AI call wired. No evidence is sent to the AIMC Gateway for scoring.

**Root Cause Category**: Deferred Requirement / Architectural Dependency / AIMC Blocker  
**Root Cause Detail**: Wave 3 (AI Scoring & Human Confirmation) was the designated wave for AI integration. However, at the time Waves 3 and 5.6 were executed, the `@maturion/ai-centre` package (AIMC Gateway) had not been delivered (AIMC Waves 3/4 are upstream prerequisites per `AIMC_STRATEGY.md` v1.0.0 and DEV-MAT-AIMC-001). Consequently, all AI-triggered scoring is constitutionally blocked until AIMC Wave 3 completes and the `@maturion/ai-centre` package exposes the required Gateway methods. The stub is the correct state for a blocked dependency — the gap is that it was not clearly communicated in the delivery status as "BLOCKED, not deferred."

Additionally, the Wave 3 implementation plan acceptance criteria did not define a fallback "manual trigger" path that would allow the review table to function without AI — meaning the entire scoring flow is non-operational in the interim.

**FRS References**: FR-040 (AI evidence evaluation), FR-041 (AI finding creation), FR-042 (AI maturity scoring)  
**TRS References**: TR-040 (AIMC Gateway scoring call), TR-041 (finding schema), TR-042 (maturity score storage)  
**Architecture References**: `ai-architecture.md` v2.0.0 §3 (AIMC Gateway scoring flow)

**Recommendation / Prevention**:
1. The delivery status for any AIMC-blocked feature must be classified as **BLOCKED (upstream dependency)**, not merely "stub." This must appear in the wave gate evidence and be surfaced in BUILD_PROGRESS_TRACKER.md.
2. Waves 7 and 8 in the implementation plan correctly capture this as BLOCKED. The Wave 3 gate should have been held OPEN with a BLOCKED status until AIMC was ready, rather than closed with a stub.
3. A manual scoring pathway (auditor enters score manually without AI) should be defined as a fallback FR so the review table remains usable pending AIMC delivery.

**Corrective Action for Next Build Phase**: Implement Waves 7 and 8 once AIMC upstream waves complete. Add manual scoring fallback as FR-073. Add test MAT-T-0103 (manual scoring path operational when AI unavailable).

---

### G-12: AI Maturity Rating (1–5) ⚠️

**Gap**: The ReviewTable component reads and displays scores, but the trigger that causes the AI to produce those scores is not wired.

**Root Cause Category**: Deferred Requirement / Architectural Dependency (same root cause as G-11)  
**Root Cause Detail**: The ReviewTable was implemented ahead of the AI trigger (Wave 4 vs. Wave 3 in the plan). The display logic is correct; the scoring pipeline is blocked on AIMC. This is a correct sequencing outcome — the display layer was built before the data layer was available — but the absence of test data seeding means the ReviewTable cannot be demonstrated end-to-end.

**FRS References**: FR-043 (maturity rating display), FR-044 (score override)  
**TRS References**: TR-043 (score fetch), TR-044 (override write)  
**Architecture References**: `ui-component-architecture.md` §7 (ReviewTable), `data-architecture.md` §4 (maturity_scores table)

**Recommendation / Prevention**:
1. When a display component is built before its data source, the implementation plan must include a seed-data task to verify the component with realistic data.
2. The Red QA suite must include a "ReviewTable renders seeded scores correctly" test (not dependent on AI being wired).

**Corrective Action for Next Build Phase**: Add seed-data fixture for `maturity_scores` table. Add test MAT-T-0104 (ReviewTable renders seeded scores). Implement AI trigger in Wave 7/8 as planned.

---

### G-13: Human Review Table — Confirm/Override ✅

**Status**: FULLY WIRED — No RCA required.  
**Notes**: Full confirm/override with justification field confirmed implemented.

---

### G-14: Submit → Generate PDF/DOCX Report ⚠️

**Gap**: The submission UI is complete. The backend report generation (PDF/DOCX rendering engine, file storage, download link) was not confirmed as operational.

**Root Cause Category**: Insufficient Acceptance Criteria / Wave Gate Verification Gap  
**Root Cause Detail**: Wave 4 (Dashboards & Reporting) Task 4.2 scoped the reporting backend (api-builder). The implementation plan acceptance criteria stated "report generation endpoint returns 200 with file URL" but did not specify the test fixture content (what audit data triggers a complete report), nor did it require an E2E test that produces a downloadable, valid PDF or DOCX. The Wave 4 gate was closed based on API availability (endpoint returns 200) without verifying the output file is valid and complete.

**FRS References**: FR-051 (PDF report), FR-052 (DOCX report), FR-053 (report download link)  
**TRS References**: TR-051 (report engine), TR-052 (file storage), TR-053 (download URL TTL)  
**Architecture References**: `reporting-architecture.md` §3–§5

**Recommendation / Prevention**:
1. Acceptance criteria for any report generation task must include: "Produce a downloadable PDF/DOCX from a seeded audit; verify file is non-empty and valid; verify download link resolves within TTL."
2. Add an E2E test that seeds a complete audit, submits it, and asserts a valid file is downloadable.

**Corrective Action for Next Build Phase**: Add test MAT-T-0105 (report generation produces valid PDF from seeded audit). Run report generation manually with test data before declaring Wave 4 closed.

---

### G-15: Mobile-First / Responsive ⚠️

**Gap**: Tailwind CSS responsive classes are used throughout, but the application has not been verified on a real mobile device or in mobile viewport simulation.

**Root Cause Category**: Insufficient QA Scope / Missing Device/Viewport Testing  
**Root Cause Detail**: The architecture (`ui-component-architecture.md`) and FRS (FR-065: mobile-responsive) specified responsive design, but the Red QA suite did not include a mobile viewport test or device emulation test. "Uses Tailwind responsive classes" was treated as equivalent to "is mobile-first verified," which is incorrect. Tailwind provides breakpoint utilities; whether the resulting layout is usable on mobile requires explicit viewport verification.

**FRS References**: FR-065 (mobile-responsive)  
**TRS References**: TR-065 (mobile viewport, touch targets ≥ 44px, no horizontal scroll at 375px)  
**Architecture References**: `ui-component-architecture.md` §2 (responsive design), `performance-architecture.md` §5 (mobile performance)

**Recommendation / Prevention**:
1. The Red QA suite must include tests at 375px (mobile) and 768px (tablet) viewport widths asserting no horizontal overflow, touch targets meet 44px minimum, and key flows (create audit, capture evidence, review table) are operable.
2. Wave 5.6 gate must require a Playwright mobile viewport screenshot for each major screen.
3. UI accessibility tests (MAT-T-0067–0081) must include a mobile viewport run.

**Corrective Action for Next Build Phase**: Add tests MAT-T-0106–MAT-T-0108 (mobile viewport: audit creation, evidence modal, review table). Run Playwright with `viewport: { width: 375, height: 812 }` as part of CI.

---

### G-16: Offline Mode ❌

**Gap**: Offline mode (Service Worker, IndexedDB sync queue, background sync) was in scope but was not verified as implemented or functional.

**Root Cause Category**: Incomplete Implementation / Missing Wave Verification  
**Root Cause Detail**: Wave 2 included offline sync (MAT-T-0056–0058). The `offline-sync-architecture.md` defines the full Service Worker, sync protocol, and PWA manifest. However, the offline mode was not demonstrated in the wave gate evidence, and the tests (MAT-T-0056–0058) were not confirmed GREEN. Offline mode is architecturally complex (Service Worker registration, fetch interception, IndexedDB write, background sync registration) and may have been deprioritised during Wave 2 in favour of the online evidence collection path. The wave gate evidence did not record an explicit pass/fail for offline capability.

**FRS References**: FR-060 (offline evidence capture), FR-061 (background sync), FR-062 (conflict resolution)  
**TRS References**: TR-060 (Service Worker), TR-061 (IndexedDB schema), TR-062 (sync protocol)  
**Architecture References**: `offline-sync-architecture.md` (full document)

**Recommendation / Prevention**:
1. Offline mode must be a named deliverable with its own wave gate step: "Disable network in Playwright; capture evidence; re-enable network; confirm sync completes."
2. The Red QA suite tests MAT-T-0056–0058 must be confirmed GREEN before Wave 2 closes.
3. Service Worker registration must be verified in the deployed app (check `navigator.serviceWorker.controller` in browser console) as part of Wave 6 commissioning.

**Corrective Action for Next Build Phase**: Implement and verify offline mode as a dedicated remediation wave (Wave 2 Remediation). Confirm MAT-T-0056–0058 GREEN. Add Service Worker verification to Wave 6 commissioning checklist.

---

## 5. Cross-Cutting Root Causes

The following systemic root causes contributed to multiple gaps:

### RCA-CROSS-01: Stub Components Not Tracked as Test Debt

**Gaps affected**: G-07, G-10, G-11  
**Description**: Stub components (button emojis, empty functions, placeholder JSX) were committed without failing tests in the Red QA suite. This allowed wave gates to close while non-functional code existed in the codebase.  
**Preventive Action**: All stub components must include a corresponding failing test (RED) in the Red QA suite. The test must assert the feature is fully operational, not merely that the component renders. A stub with a failing test will prevent the wave gate from closing; a stub without a test is invisible to the gate.

### RCA-CROSS-02: "API Available" ≠ "Feature Complete"

**Gaps affected**: G-04, G-11, G-12, G-14  
**Description**: Multiple wave gates were closed when the API endpoint existed and returned 200, without verifying that the UI correctly used the API and that the full data flow (API → UI → user experience) was end-to-end verified.  
**Preventive Action**: Wave gate acceptance criteria must require E2E verification (API called from UI → correct data displayed to user), not just unit/integration test of API in isolation.

### RCA-CROSS-03: Insufficient Specification Depth for Complex Media Features

**Gaps affected**: G-07, G-10  
**Description**: Photo capture and interview recording were specified at the "what" level (what the feature does) without specifying the "how" (which browser API, which mobile-native approach, what metadata schema, what GDPR/POPIA consent mechanism). Builders cannot implement features they cannot fully specify.  
**Preventive Action**: For any feature involving hardware APIs (camera, microphone), the TRS must specify the exact API surface, fallback for unsupported devices, and all associated data model fields.

### RCA-CROSS-04: Missing Pre-Build Functionality Assessment Gate

**Gaps affected**: All gaps  
**Description**: There was no formal gate between the Red QA suite completion and the first builder wave that required a comprehensive review of ALL requirements against the test suite to confirm every functional area had a corresponding, operational test before any code was written.  
**Preventive Action**: **A mandatory Pre-Build Functionality Assessment Gate (PBFAG) is added to the governance workflow.** See Section 7 below.

---

## 6. Learning Loop Conclusions ("We Only Fail Once")

| Learning ID | Learning | Governance Change |
|---|---|---|
| LL-RCA-001 | Stub components must have failing RED tests | Red QA suite spec updated: all stubs must have a corresponding failing test |
| LL-RCA-002 | Wave gate closure requires E2E verification, not just API 200 | Wave gate checklist updated: E2E test required in addition to unit/integration tests |
| LL-RCA-003 | Hardware/media FRS must specify browser API surface | FRS/TRS template updated: media features require API surface, fallback, and data model spec |
| LL-RCA-004 | AIMC-blocked features must be explicitly tagged BLOCKED | Delivery status taxonomy updated: BLOCKED (upstream dependency) is a distinct status |
| LL-RCA-005 | Offline mode is complex and requires its own wave gate step | Offline verification step added to Wave 2 gate and Wave 6 commissioning checklist |
| LL-RCA-006 | Mobile viewport must be tested explicitly, not assumed from Tailwind | Red QA suite updated: mobile viewport tests mandatory |
| LL-RCA-007 | Report generation requires E2E file validity test, not just 200 status | Wave 4 acceptance criteria updated |
| LL-RCA-008 | Pre-Build Functionality Assessment Gate (PBFAG) is mandatory | New governance gate added — see Section 7 |

---

## 7. Governance Change: Pre-Build Functionality Assessment Gate (PBFAG)

### 7.1 Definition

The **Pre-Build Functionality Assessment Gate (PBFAG)** is a mandatory governance checkpoint inserted between the Red QA Suite (Stage 2.5) and the first builder wave assignment. No builder may be assigned or begin implementation until PBFAG achieves a PASS verdict.

### 7.2 Gate Procedure

The Foreman must complete the following checklist before any builder ticket is opened:

1. **Requirements Coverage Check**: For every FR in the FRS, confirm at least one test in the Red QA suite directly tests that requirement. Any FR without a corresponding test is a blocker.
2. **Stub/Placeholder Audit**: Review all placeholder components listed in any architecture document. Confirm each has a failing test (RED) in the Red QA suite.
3. **API-to-UI Wiring Check**: For every feature that requires UI-to-API wiring, confirm the Red QA suite includes at least one wiring invariant test (MAT-T-xxxx wiring class) asserting the API call occurs from the UI.
4. **Blocked Features Check**: For every FR that depends on an upstream module (e.g., AIMC), confirm the feature is tagged BLOCKED with an explicit prerequisite gate in the implementation plan.
5. **Hardware/Media API Spec Check**: For every FR involving camera, microphone, or device API, confirm TRS specifies the exact browser API, mobile fallback, and data model.
6. **Offline Mode Check**: If offline mode is in scope, confirm the offline sync architecture is complete and the Red QA suite includes offline scenario tests.
7. **Mobile Viewport Check**: Confirm the Red QA suite includes viewport tests at ≥ 375px width for all major user flows.
8. **Report Generation Check**: If reporting is in scope, confirm the Red QA suite includes an E2E file-validity test (produces non-empty, valid PDF/DOCX from seeded data).

### 7.3 PBFAG Verdict

- **PASS**: All 8 checks pass. Builder appointment may proceed.
- **FAIL**: Any check fails. Foreman must remediate (update FRS, TRS, Red QA suite, or architecture) before re-running the gate. **Builders must not be appointed or begin work until PBFAG PASS is recorded.**

### 7.4 PBFAG Evidence Artifact

The PBFAG result must be recorded as a build evidence artifact at:
`modules/mat/05-build-evidence/PBFAG-{module}-{date}.md`

This artifact is a mandatory prerequisite for all future builder appointment documents.

---

## 8. Remediation Plan — Next Build Phase

The following items require remediation before the MAT App V2 can be considered feature-complete:

| Priority | Gap | Remediation Wave | Test to Add | Blocker? |
|---|---|---|---|---|
| P0 | G-04 (evidence modal mock data) | Wave 5.6 Remediation | MAT-T-0100 | Yes — core user journey |
| P0 | G-11 (AI scoring not wired) | Wave 7 (BLOCKED on AIMC Wave 3) | MAT-T-AIMC-001 | Blocked (upstream) |
| P0 | G-16 (offline mode not verified) | Wave 2 Remediation | MAT-T-0056–0058 | Yes — was in scope |
| P1 | G-03 (hierarchy UI not verified) | Wave 5.6 Remediation | MAT-T-0099 | Yes — core display |
| P1 | G-07 (photo capture stub) | Wave 2 Remediation | MAT-T-0101 | Yes — evidence completeness |
| P1 | G-10 (interview recording stub) | Wave 2 Remediation | MAT-T-0102 | Yes — evidence completeness |
| P1 | G-12 (AI rating trigger not wired) | Wave 7 (BLOCKED on AIMC Wave 3) | MAT-T-0104 | Blocked (upstream) |
| P1 | G-14 (report backend not confirmed) | Wave 4 Remediation | MAT-T-0105 | Yes — delivery criterion |
| P2 | G-15 (mobile viewport not tested) | Wave 5.6 Remediation | MAT-T-0106–0108 | No — quality improvement |

---

## 9. Artifact Update Summary

The following artifacts require updates based on this RCA:

| Artifact | Required Update | Status |
|---|---|---|
| `modules/mat/BUILD_PROGRESS_TRACKER.md` | Add RCA section, PBFAG gate, remediation wave entries, learning loop | IN PROGRESS |
| `modules/mat/03-implementation-plan/implementation-plan.md` | Add PBFAG gate between Stage 2.5 and Stage 3; add remediation wave tasks | IN PROGRESS |
| `modules/mat/01-frs/functional-requirements.md` | Expand FR-027, FR-028 with API surface; add FR-073 (manual scoring fallback) | REQUIRED |
| `modules/mat/01.5-trs/technical-requirements-specification.md` | Expand TR-027, TR-028 with browser API spec, mobile fallback, data model | REQUIRED |
| `governance/TEST_REGISTRY.json` | Add MAT-T-0099–MAT-T-0108 (new RED tests from RCA) | REQUIRED |
| Wave 5.6 Task 5.6.3 acceptance criteria | Add "modal fetches real data from Supabase" as explicit condition | REQUIRED |
| Wave 2 Task 2.3 acceptance criteria | Add explicit photo capture and interview recording sub-tasks | REQUIRED |
| Wave 4 Task 4.2 acceptance criteria | Add E2E report file validity test requirement | REQUIRED |
| Wave 6 commissioning checklist | Add Service Worker verification, mobile viewport check, offline mode verification | REQUIRED |

---

## 10. Sign-Off

**Foreman Verdict**: RCA COMPLETE — all gaps documented, root causes identified, preventive actions recorded, remediation plan defined.

**PBFAG Status**: The Pre-Build Functionality Assessment Gate (PBFAG) is hereby established as a mandatory governance checkpoint for all future MAT build phases and all new module build phases.

**Blocking Status**: The following items are BLOCKERS for declaring MAT App V2 feature-complete:
- G-04 (evidence modal mock data)
- G-16 (offline mode not verified)
- G-03 (hierarchy UI not verified)
- G-07 (photo capture stub)
- G-10 (interview recording stub)
- G-14 (report backend not confirmed)

G-11 and G-12 are BLOCKED on upstream AIMC waves, not on MAT builder action.

**Document Version History**:
- v1.0.0 (2026-02-23): Initial RCA — all 16 gaps analysed, PBFAG established, remediation plan defined.

---

*Reference: Post-delivery review directive, issue tracker, FRS v1.2.0, TRS v1.2.0, Architecture v2.0.0, Implementation Plan v1.7.0, Red QA Suite (MAT-T-0001–MAT-T-0098).*
