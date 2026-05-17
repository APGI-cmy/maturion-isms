# PIT Market-Comparison Feature Inventory

## Status
- Module: PIT (Project Implementation Tracker)
- Scope: Docs-only pre-build remediation follow-up (PR #1651)
- Purpose: Explicit capability-by-capability classification with conservative non-overclaim posture

## Classification Key
- `V1_CONFIRMED`
- `V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED`
- `V1_DESIGN_HARDENING_REQUIRED`
- `FUTURE_VERSION`
- `EXPLICITLY_OUT_OF_SCOPE`

---

## strategic / platform-level differentiators

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| STRAT-001 | Governance-first staged delivery model | Stage-gated PIT readiness chain and governance canon references | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Delivery posture exists in docs; runtime proof remains Stage 6+ evidence dependent. |
| STRAT-002 | Audit-grade traceability posture | Reporting/audit trail requirements (`PIT-FR-080`, `PIT-FR-088`) | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Capability intent is explicit; implementation quality cannot be overclaimed pre-build. |
| STRAT-003 | Cross-role implementation visibility | Role-aware PIT workflow descriptions and reporting posture | V1_DESIGN_HARDENING_REQUIRED | Needs explicit end-to-end UX contract for market-comparison parity claims. |

## project hierarchy and planning

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| PLAN-001 | Program/portfolio/project/task hierarchy | Project + task constructs in PIT FR/UX artifacts | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Core hierarchy appears in v1 scope; verify roll-up behaviour in Stage 6 tests. |
| PLAN-002 | Milestone and dependency-aware planning | Partial planning semantics in workflow specs | V1_DESIGN_HARDENING_REQUIRED | Requires tighter FR/TR language for explicit dependency logic commitments. |

## timeline and scheduling engine

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| TIME-001 | Timeline visualisation baseline | Workflow/UX references to schedule views | V1_DESIGN_HARDENING_REQUIRED | Present conceptually; hard feature contract still needs explicit Stage 1–5 wording. |
| TIME-002 | Scheduling engine with critical-path quality | No explicit technical contract for critical-path engine in current chain | FUTURE_VERSION | Keep as roadmap until canonised into PIT staged artifacts. |

## implementation page / execution UI

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| EXEC-001 | Implementation execution workspace/page | PIT implementation workflow definitions (`PIT-FR-031`, `PIT-FR-034`) | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Execution intent is in-scope; interaction fidelity requires Stage 6 validation. |
| EXEC-002 | Action-oriented execution controls | Partial in UX flow descriptions | V1_DESIGN_HARDENING_REQUIRED | Needs explicit UI control contract to avoid overclaim. |

## assignment, collaboration and invitation

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| COLLAB-001 | Task assignment and ownership | Task management semantics in PIT FR chain | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Assignment posture exists; verify permissioned assignment flows in Stage 6. |
| COLLAB-002 | External invitation workflow | No explicit invitation lifecycle contract in Stage 1–5 PIT set | V1_DESIGN_HARDENING_REQUIRED | Must be hardened before claiming parity with invitation-centric tools. |

## evidence management

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| EVD-001 | Evidence item capture and attachment posture | App Description evidence concepts + PIT workflow docs | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Evidence model exists; storage/validation proof requires later stages. |
| EVD-002 | Evidence chain-of-custody completeness | Audit/export primitives present, full custody contract not explicit | V1_DESIGN_HARDENING_REQUIRED | Needs explicit immutable custody semantics for strong market claim. |

## progress, status, RAG and roll-up

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| PROG-001 | Progress and status tracking | PIT progress/reporting requirements (`PIT-FR-080`, `PIT-FR-118`) | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Confirmed intent; runtime calculation quality must be validated. |
| PROG-002 | RAG status and hierarchical roll-up | Partial posture in reporting concepts | V1_DESIGN_HARDENING_REQUIRED | Requires explicit RAG thresholds/roll-up formulas for deterministic behaviour. |

## dashboards and reporting

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| DASH-001 | Core dashboard/report surfaces | PIT report catalog baseline (`PIT-FR-080`) | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Dashboard/reporting baseline exists; final quality claims deferred. |
| DASH-002 | Executive drill-down reporting maturity | Partial architecture/reporting references | V1_DESIGN_HARDENING_REQUIRED | Needs explicit drill-down contract and acceptance metrics. |

## watchdog and escalation

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| WDG-001 | Exception/watchdog detection | No explicit PIT watchdog engine specification in Stage 1–5 | FUTURE_VERSION | Keep deferred until watchdog semantics are canonised. |
| WDG-002 | Escalation routing and SLA breach actions | Partial governance posture, PIT-specific workflow not explicit | V1_DESIGN_HARDENING_REQUIRED | Requires PIT-level escalation workflow contract. |

## QA and live delivery discipline

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| QA-001 | QA-to-Red then Build-to-Green discipline | Maturion build philosophy and staged PIT readiness model | V1_CONFIRMED | Process requirement is explicit and active. |
| QA-002 | Live validation / LFV completion claimability | LFV tracked separately; not yet canonised/layered into PIT stages as complete | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | LFV is in-flight separately and cannot be claimed complete until canonised/layered into PIT stage chain. |

## AI and automation

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| AI-001 | AI-assisted summarisation in reporting context | Legacy/export references + report posture | V1_DESIGN_HARDENING_REQUIRED | Treat as partial until explicit v1 AI contract and safeguards are staged. |
| AI-002 | Automation workflows (auto-routing/auto-remediation) | No explicit PIT v1 automation engine contract | FUTURE_VERSION | Defer until formal FR/TR inclusion. |

## security, permissions and audit

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| SEC-001 | RBAC and permissioned access posture | Architecture + audit/export governance references | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Role gating intent exists; enforceability must be proven in validation evidence. |
| SEC-002 | Full audit-trail extraction and review | `PIT-FR-088` and related export/reporting references | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Confirmed at requirement level; cannot claim production-grade completeness yet. |

## auth, onboarding and notifications

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| AUTH-001 | Authentication posture (platform-level) | Platform governance and module integration posture | V1_DESIGN_HARDENING_REQUIRED | PIT-specific auth flow commitments should be made explicit to avoid inference overclaim. |
| AUTH-002 | Onboarding flows and user notifications | No fully explicit PIT onboarding/notification contract in Stage 1–5 | FUTURE_VERSION | Keep deferred until formally specified. |

## cross-module ISMS integration

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| XMOD-001 | Integration touchpoints to MAT/PIT ecosystem modules | High-level integration architecture references | V1_DESIGN_HARDENING_REQUIRED | Integration concept is present; interface contracts need explicit hardening. |
| XMOD-002 | Structured callback/event interoperability | Legacy export and integration references in `Maturion/PIT/Architecture/PIT_EXPORT_SPEC_v1.0.md`, no complete PIT v1 callback contract | FUTURE_VERSION | Defer parity claim until canonical payload contracts are staged. |

## compliance and end-result qualities

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| COMP-001 | ISO 27001 / ISO 31000 / NIST CSF standards stance | Canonical governance requirements | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Standards posture is mandated; PIT implementation evidence still pending. |
| COMP-002 | Reproducible compliance artifact package quality | Canon requires compliance artifacts; PIT packaging not fully canonised | V1_DESIGN_HARDENING_REQUIRED | Requires module-specific artifact package hardening for end-result assurance claims. |

## future / deferred capabilities

| Feature ID | Feature / Capability | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| FUT-001 | Advanced predictive planning and optimisation | Mentioned as future evolution themes | FUTURE_VERSION | Deferred until brought into approved PIT staged chain. |
| FUT-002 | Native mobile-first PIT experience | Explicitly outside current v1 scope | EXPLICITLY_OUT_OF_SCOPE | No v1 claim without formal scope change. |

---

## costing classification (required explicit items)

| Feature ID | Required costing item | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| COST-001 | project budget fields | `PIT-FR-035` cost fields and related UX step references | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Explicit at requirement level; runtime validation pending. |
| COST-002 | planned cost | Present as planned/budget intent within PIT cost capture posture | V1_DESIGN_HARDENING_REQUIRED | Needs explicit data definition wording to avoid interpretation variance. |
| COST-003 | actual cost | Partial via implementation progress/evidence posture | V1_DESIGN_HARDENING_REQUIRED | Actual-cost lifecycle not fully explicit in current Stage 1–5 chain. |
| COST-004 | CAPEX/OPEX classification | `PIT-FR-035`, `PIT-FR-053` | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Explicitly captured but still validation-gated. |
| COST-005 | cost variance | Report-level intent only; no explicit variance formula contract | V1_DESIGN_HARDENING_REQUIRED | Requires formal variance rules and thresholds. |
| COST-006 | mitigation value | Legacy ROI/value intent references | FUTURE_VERSION | Not explicit in current canonical v1 PIT requirement set. |
| COST-007 | ROI percentage | Legacy ROI concept (`PIT_TRUE_NORTH_v1.0.md`) | FUTURE_VERSION | Keep non-claimable for v1 until canonised in staged artifacts. |
| COST-008 | cost-to-risk-reduction relationship | Conceptual relationship only; no formal PIT v1 equation/model | FUTURE_VERSION | Requires explicit methodology + acceptance tests. |
| COST-009 | budget approval / override workflow | No explicit PIT v1 budget override control workflow | V1_DESIGN_HARDENING_REQUIRED | Must be added to FR/TR chain before claim. |
| COST-010 | project cost reports | `PIT-FR-080`, `PIT-FR-118` reporting posture | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Reporting exists but output quality remains validation-gated. |
| COST-011 | portfolio cost roll-up | Portfolio summary reporting intent (`PIT-FR-080`) | V1_DESIGN_HARDENING_REQUIRED | Explicit cost roll-up rules need hardening. |
| COST-012 | predictive CAPEX/OPEX forecasting | Marked as future evolution in app description optional sections | FUTURE_VERSION | Explicitly deferred; not a current v1 claim. |

## export classification (required explicit items)

| Feature ID | Required export item | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| EXP-001 | Project Summary PDF | Legacy export spec naming; overlaps with status reporting concept | V1_DESIGN_HARDENING_REQUIRED | Needs explicit v1 artifact contract and naming reconciliation. |
| EXP-002 | Task List CSV/Excel | CSV/Excel format support posture (`PIT-FR-082`) with legacy profile references | V1_DESIGN_HARDENING_REQUIRED | Format support exists; specific packaged output contract not fully explicit. |
| EXP-003 | Timeline/Gantt PDF | Legacy export spec only | FUTURE_VERSION | Not explicit in staged v1 report set. |
| EXP-004 | Timeline/Gantt JSON export | Legacy export spec only | FUTURE_VERSION | Not explicit in staged v1 report set. |
| EXP-005 | Risk-Mitigation Feedback Report | Legacy export spec only | FUTURE_VERSION | Requires formal PIT requirement inclusion. |
| EXP-006 | Control Implementation Pack | Legacy export spec only | FUTURE_VERSION | Depends on explicit compliance packaging design in PIT chain. |
| EXP-007 | Evidence Bundle ZIP | Legacy export spec only | FUTURE_VERSION | Not presently in canonical PIT Stage 1–5 commitments. |
| EXP-008 | AI Weekly Summary | Legacy export concept; no explicit PIT v1 weekly artifact contract | FUTURE_VERSION | Keep deferred until explicit canonisation. |
| EXP-009 | Integration export/callback payloads | Integration concept references; callback payload contract not hardened | V1_DESIGN_HARDENING_REQUIRED | Needs explicit schema/versioning requirements. |
| EXP-010 | Full Project Archive ZIP | Legacy export spec only | FUTURE_VERSION | Not explicit in current PIT v1 chain. |
| EXP-011 | Audit export | `PIT-FR-088` audit trail extract posture | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Explicitly in scope at requirement level; still validation dependent. |
| EXP-012 | Report history and permissions | Partial via role-gated reporting and audit posture | V1_DESIGN_HARDENING_REQUIRED | History retention/permission matrix needs explicit hardening. |

## mobile/offline classification (required explicit items)

| Feature ID | Required mobile/offline item | Current artifact coverage | Scope classification | Notes |
|---|---|---|---|---|
| MOB-001 | responsive web field evidence capture | Responsive UX intent + evidence model posture | V1_CONFIRMED_WITH_STAGE6_VALIDATION_REQUIRED | Confirmed as intent, pending execution proof. |
| MOB-002 | camera/photo/video upload from mobile browser | Evidence attachment intent exists; mobile capture specifics not explicit | V1_DESIGN_HARDENING_REQUIRED | Must be explicitly specified/tested before parity claim. |
| MOB-003 | native mobile app | App description scope boundary excludes native app | EXPLICITLY_OUT_OF_SCOPE | Not claimable in v1 baseline. |
| MOB-004 | offline task execution | No explicit PIT v1 offline execution contract | FUTURE_VERSION | Defer until staged canon inclusion. |
| MOB-005 | offline evidence capture | No explicit PIT v1 offline evidence contract | FUTURE_VERSION | Defer until staged canon inclusion. |
| MOB-006 | background sync | No explicit PIT v1 background sync contract | FUTURE_VERSION | Defer until staged canon inclusion. |
| MOB-007 | push notifications | No explicit PIT v1 notification subsystem contract | FUTURE_VERSION | Defer until staged canon inclusion. |
| MOB-008 | GPS/location capture, if any | No explicit PIT v1 geolocation capture requirement | FUTURE_VERSION | No claim without explicit FR/TR requirements. |
| MOB-009 | QR/barcode field proof, if any | No explicit PIT v1 QR/barcode requirement | FUTURE_VERSION | No claim without explicit FR/TR requirements. |

---

## traceability / hardening notes (explicit constraints)
- This inventory remains conservative and does not promote legacy/reference-only artifacts (`Maturion/PIT/**`) to committed v1 scope.
- LFV is in-flight separately and is not claimable as complete until canonised/layered into PIT stages.
- Stage 6 remains blocked until Stage 5 gate-pass.
- Build Authorization remains **NOT CLEARED**.
- No runtime, DB, deployment, CI, or workflow changes are implied by this document update.
