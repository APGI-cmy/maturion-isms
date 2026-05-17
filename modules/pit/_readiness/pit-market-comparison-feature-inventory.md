# PIT Market-Comparison Feature Inventory

## Status
- Module: PIT (Project Implementation Tracker)
- Scope: Docs-only pre-build hardening (PR #1651)
- Purpose: Canonical feature inventory with conservative v1 classification (no overclaim)

## Classification Key
- `V1_CONFIRMED`
- `V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED`
- `V1_DESIGN_HARDENING_REQUIRED`
- `FUTURE_VERSION`
- `EXPLICITLY_OUT_OF_SCOPE`

---

## Capability Group A — Feedback & Improvement Centre

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| FIC-001 | Feedback captured as evidence item content | App Description evidence definitions include feedback records (`modules/pit/00-app-description/app-description.md` §2.1, Evidence wording) | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Feedback can be stored as evidence, but not yet a dedicated centre workflow. |
| FIC-002 | Dedicated PIT Feedback & Improvement Centre UI/workflow | No explicit Stage 1–5 route/FR/TR requirement for a named “Feedback & Improvement Centre” screen | V1_DESIGN_HARDENING_REQUIRED | Needs explicit Stage 2/3/4 wording before it can be treated as committed v1 scope. |
| FIC-003 | Closed-loop conversion of feedback to tracked improvements | Partial via manual project/task creation + source-link patterns (`PIT-FR-031`, `PIT-FR-034`) | V1_DESIGN_HARDENING_REQUIRED | Conversion flow exists in pieces but no explicit end-to-end “feedback→improvement” contract. |

## Capability Group B — Costing, Budget, ROI

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| COST-001 | Project-level CAPEX/OPEX capture | `PIT-FR-035`, UX Step-4 cost fields, App Description cost value proposition | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Functional requirement is explicit; QA-to-Red validation still required pre-build. |
| COST-002 | Task-level CAPEX/OPEX capture | `PIT-FR-053` optional task CAPEX/OPEX | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Captured at task form level; validate persistence and permissions in Stage 6 tests. |
| COST-003 | CAPEX/OPEX summary reporting | `PIT-FR-080` + `PIT-FR-118` + `PIT-TR-068..072` reporting architecture | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Confirmed as report type; output quality/edge cases remain Stage 6+ validation work. |
| COST-004 | Budget control (planned vs actual, threshold controls) | Partial via implementation indicators/progress + report scope; no explicit budget-control rule set | V1_DESIGN_HARDENING_REQUIRED | Needs explicit functional and technical controls (thresholds, alerts, approvals). |
| COST-005 | ROI calculation engine (item-by-item ROI %) | Present in legacy vision (`Maturion/PIT/PIT_TRUE_NORTH_v1.0.md`), not explicit in current Stage 1–5 chain | FUTURE_VERSION | Keep as roadmap candidate; avoid v1 commitment until upstream artifacts add explicit requirements. |
| COST-006 | Predictive CAPEX/OPEX forecasting | Explicitly listed in future evolution (`app-description.md` Optional Section E) | FUTURE_VERSION | Already marked future in canonical app-description chain. |

## Capability Group C — Legacy Export/Report Catalogue (item-by-item)

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| EXP-001 | Project Status Report | `PIT-FR-080`, `PIT-FR-118`, architecture §14 | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Covered in v1 report types. |
| EXP-002 | Portfolio Summary Report | `PIT-FR-080`, `PIT-TR-078` performance target | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Covered in v1 report types. |
| EXP-003 | Task Completion Report | `PIT-FR-080` | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Covered in v1 report types. |
| EXP-004 | Audit Trail Extract / CSV | `PIT-FR-088`, `PIT-TR-075`, architecture §15 | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Covered with role-gated export semantics. |
| EXP-005 | CAPEX/OPEX Summary Report | `PIT-FR-080`, `PIT-FR-118`, architecture §14 | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Covered in v1 report set. |
| EXP-006 | Legacy “Project Summary PDF” profile | Legacy list in `Maturion/PIT/Architecture/PIT_EXPORT_SPEC_v1.0.md` | V1_DESIGN_HARDENING_REQUIRED | Potentially overlaps Project Status Report; naming/content reconciliation still required. |
| EXP-007 | Legacy Task List CSV export | Legacy export spec | V1_DESIGN_HARDENING_REQUIRED | CSV exists as output format, but dedicated “Task List CSV” product contract is not explicit in v1 FR naming. |
| EXP-008 | Legacy Task List Excel export | Legacy export spec + v1 XLSX output format support (`PIT-FR-082`) | V1_DESIGN_HARDENING_REQUIRED | Format support exists; specific legacy artifact contract still not explicit. |
| EXP-009 | Timeline/Gantt PDF export | Legacy export spec only | FUTURE_VERSION | Not explicitly in Stage 1–5 v1 report-type list. |
| EXP-010 | Timeline/Gantt JSON export | Legacy export spec only | FUTURE_VERSION | Not explicitly in Stage 1–5 v1 report-type list. |
| EXP-011 | Risk-Mitigation Feedback Report (PDF) | Legacy export spec only | FUTURE_VERSION | Not explicitly in Stage 1–5 v1 report-type list. |
| EXP-012 | Control Implementation Pack (Excel+PDF) | Legacy export spec only | FUTURE_VERSION | Depends on explicit compliance package design not yet in PIT Stage 1–5 chain. |
| EXP-013 | Evidence Bundle (ZIP) | Legacy export spec only | FUTURE_VERSION | Not explicitly defined in current PIT FRS/TRS/architecture. |
| EXP-014 | AI Weekly Summary export | Legacy export spec only | FUTURE_VERSION | Current v1 supports AI summary inside report generation, not a standalone weekly export artifact. |
| EXP-015 | Integration exports to other modules (JSON) | Legacy export spec + high-level integration architecture | V1_DESIGN_HARDENING_REQUIRED | Integration exists conceptually; export product contract needs explicit FR/TR wording. |
| EXP-016 | Full Project Archive export (ZIP) | Legacy export spec only | FUTURE_VERSION | No explicit v1 requirement in current Stage 1–5 chain. |

## Capability Group D — Compliance Artifact Package & Standards Stance

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| CMP-001 | `COMPLIANCE_SCOPE` artifact posture | Canon requires it (`governance/canon/COMPLIANCE_AND_STANDARDS_GOVERNANCE.md` §4); PIT module artifact not yet canonicalised in Stage 1–5 chain | V1_DESIGN_HARDENING_REQUIRED | Governance requirement exists; PIT-specific artifact package still needs explicit module-level filing plan. |
| CMP-002 | `CONTROL_MAPPING` artifact posture | Canon §4/§5 requires control traceability | V1_DESIGN_HARDENING_REQUIRED | Require PIT-specific mapping artifact linkage to architecture + QA + evidence locations. |
| CMP-003 | `EVIDENCE_CATALOG` artifact posture | Canon §4/§6 requires evidence cataloging | V1_DESIGN_HARDENING_REQUIRED | PIT has evidence concepts, but not yet a canonical PIT compliance catalog artifact package. |
| CMP-004 | `AUDIT_REPORT` reproducibility posture | Canon §4 requires reproducible audit report; PIT has audit/export/report primitives | V1_DESIGN_HARDENING_REQUIRED | Runtime/report primitives exist, but canonical PIT compliance audit report artifact contract not yet explicit. |
| CMP-005 | ISO 27001 stance | Standards baseline mandated in canon §3.1 | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Governance stance is confirmed; PIT control-level implementation proof must come through Stage 6+ traceability and evidence. |
| CMP-006 | ISO 31000 stance | Standards baseline mandated in canon §3.2 | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Governance stance is confirmed; PIT risk-treatment evidence mapping still requires explicit PIT package hardening. |
| CMP-007 | NIST CSF stance | Standards baseline mandated in canon §3.3 | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Governance stance is confirmed; PIT operational mapping and evidence packaging still require Stage 6+ validation outputs. |

## Capability Group E — Mobile / Offline / LFV Posture

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| MOB-001 | Responsive web layouts | UX retrofit verification confirms responsive expectations (`ux-workflow-wiring-spec.md` Section 12 table) | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Responsive intent is explicit; execution remains test/evidence dependent in Stage 6+ and Stage 12 LFV. |
| MOB-002 | Native mobile app | Explicitly out-of-scope in App Description §2.2 item 4 | EXPLICITLY_OUT_OF_SCOPE | Keep out of v1 claims unless approved change-control updates Stage 1+ chain. |
| MOB-003 | Offline mode / offline sync | No explicit v1 contract in current Stage 1–5 chain | V1_DESIGN_HARDENING_REQUIRED | Needs explicit product/technical contract before being treated as near-term v1 commitment. |
| MOB-004 | “Mobile auditor app” legacy concept | Legacy vision text (`Maturion/PIT/PIT_TRUE_NORTH_v1.0.md`) | FUTURE_VERSION | Legacy/reference-only source; not currently in approved v1 pre-build chain. |
| LFV-001 | LFV governance package status | BUILD tracker Stage 5b present; explicit “FUNCTIONAL_PASS not claimable until live deployment evidence” | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | LFV package exists as pre-build evidence. No claim of completed live LFV or functional pass. |

---

## Traceability / Hardening Notes
- This inventory is intentionally conservative and does not promote legacy/reference-only items (`Maturion/PIT/**`) to v1 committed scope.
- No runtime/build/deployment/database/workflow changes are implied by this inventory.
- Stage 6 remains prerequisite for validation artifacts; Stage 5 gate-pass and Build Authorization constraints remain unchanged.
