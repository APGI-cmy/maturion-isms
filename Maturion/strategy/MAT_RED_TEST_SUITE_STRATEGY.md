# MAT Red Test Suite — Strategy & Planning

| Field | Value |
|-------|-------|
| **Module** | MAT (Manual Audit Tool) |
| **Version** | v1.0.0 |
| **Status** | Red (all tests failing — implementation not yet built) |
| **Authority** | Derived from MAT System Architecture v1.0.0, FRS v1.0.0, TRS v1.0.0 |
| **Created** | 2026-02-13 |
| **Test Registry** | `governance/TEST_REGISTRY.json` |

---

## 1. Purpose

This document defines the strategy for compiling the MAT red test suite, the serial numbering scheme for test components, and the rationale for coverage decisions. It serves as the planning artifact linking architecture, governance invariants, and test traceability.

All tests in the red test suite are initially **RED** — they define the expected behavior and will fail until the corresponding implementation is built. This follows the governance-mandated QA-to-Red → Build-to-Green workflow.

---

## 2. Approach

### 2.1 Architecture-First Test Derivation

Every test component is derived from one of the following authoritative sources:

1. **Functional Requirements** — `modules/mat/01-frs/functional-requirements.md` (FR-001 to FR-069)
2. **Technical Requirements** — `modules/mat/01.5-trs/technical-requirements-specification.md` (TR-001 to TR-070)
3. **System Architecture** — `modules/mat/02-architecture/system-architecture.md` (components §3.1–§3.6, wiring §3.11, paths §3.12)
4. **Wiring Invariants** — `modules/mat/02-architecture/system-architecture.md` §3.11.4 (5 invariants)
5. **Test Strategy** — `modules/mat/02-architecture/test-strategy.md` (TR-051 to TR-060)

No test exists without a traceable anchor to at least one of these sources.

### 2.2 QA-to-Red Discipline

Per `governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md`:

- Tests are compiled AFTER architecture freeze
- All tests start RED (failing because implementation is missing)
- Tests fail with expected failure mode (e.g., `NotImplementedError`, missing endpoint, missing component)
- Tests are GREEN only when correct implementation is delivered
- No test may be skipped, commented out, or deferred (zero test debt)

### 2.3 Single-Wave Delivery

Per system architecture §3.13, MAT is a single-wave module. All test components are delivered together as a single cohesive suite — no phased rollout.

---

## 3. Serial Numbering Scheme

### 3.1 Format

All test components use the format: **`MAT-T-NNNN`**

Where:
- `MAT` = Module identifier
- `T` = Test component designator
- `NNNN` = 4-digit sequential number (zero-padded)

### 3.2 Range Allocation

| Range | Category | Count |
|-------|----------|-------|
| MAT-T-0001 – MAT-T-0003 | Audit Lifecycle (CAT-01) | 3 |
| MAT-T-0004 – MAT-T-0012 | Criteria Management (CAT-02) | 9 |
| MAT-T-0013 – MAT-T-0022 | Evidence Collection (CAT-03) | 10 |
| MAT-T-0023 – MAT-T-0032 | AI Services (CAT-04) | 10 |
| MAT-T-0033 – MAT-T-0034 | Review Table (CAT-10) | 2 |
| MAT-T-0035 – MAT-T-0042 | Reports & Dashboards (CAT-04/10) | 8 |
| MAT-T-0043 – MAT-T-0053 | Security & RLS (CAT-05) | 11 |
| MAT-T-0054 – MAT-T-0057 | Integration (CAT-02/09) | 4 |
| MAT-T-0058 – MAT-T-0060 | Watchdog & Observability (CAT-07) | 3 |
| MAT-T-0061 – MAT-T-0066 | UI & Accessibility (CAT-10) | 6 |
| MAT-T-0067 – MAT-T-0070 | Data Privacy & Compliance (CAT-12) | 4 |
| MAT-T-0071 – MAT-T-0075 | Performance (CAT-08) | 5 |
| MAT-T-0076 – MAT-T-0078 | Failure Modes (CAT-04/03) | 3 |
| MAT-T-0079 – MAT-T-0094 | Wiring Invariants (CAT-11) | 16 |
| MAT-T-0095 – MAT-T-0098 | Cross-Cutting (CAT-05/07/12) | 4 |

**Total: 98 test components**

### 3.3 Uniqueness Guarantees

- Serial numbers are **sequential** and **non-duplicative**
- The canonical registry at `governance/TEST_REGISTRY.json` is the single source of truth
- Collision detection is built into the registry (`integrity.serial_collisions: 0`)
- New test components MUST be assigned the next available serial number

---

## 4. Test Categories

| Category ID | Name | Description | Component Count |
|-------------|------|-------------|-----------------|
| CAT-01 | Audit Lifecycle | Audit creation, status transitions, archival | 6 |
| CAT-02 | Criteria Management | Upload, parsing, approval, numbering | 10 |
| CAT-03 | Evidence Collection | Upload, integrity, review, interviews | 10 |
| CAT-04 | AI Services | Scoring, routing, logging, fallback, reports | 16 |
| CAT-05 | Security & RLS | Auth, MFA, RLS, encryption, audit trail, input validation | 13 |
| CAT-06 | Offline & Sync | Offline capture, sync queue, PWA | 3 |
| CAT-07 | Watchdog & Observability | Metrics, alerts, feedback, realtime | 4 |
| CAT-08 | Performance | Load times, API, AI processing, scalability | 5 |
| CAT-09 | Integration | PIT, Maturity Roadmap, Excel, extensibility | 4 |
| CAT-10 | UI & Accessibility | Responsive, WCAG, i18n, dashboards, components | 13 |
| CAT-11 | Wiring Invariants | Architecture connection registry compliance | 16 |
| CAT-12 | Data Privacy & Compliance | GDPR, POPIA, retention, regulatory, consent | 5 |

---

## 5. Coverage Mapping

### 5.1 FRS Coverage

All 69 functional requirements (FR-001 through FR-069) are covered by at least one test component. The mapping is recorded in `governance/TEST_REGISTRY.json` via the `frs_ref` field on each component.

### 5.2 Architecture Coverage

All 13 end-to-end functional paths (Paths 1–13) from system architecture §3.12 are covered:

| Path | Description | Test Components |
|------|-------------|-----------------|
| Path 1 | Audit Creation | MAT-T-0001, MAT-T-0002 |
| Path 2 | Criteria Upload & AI Parsing | MAT-T-0004 – MAT-T-0009 |
| Path 3 | Evidence Collection | MAT-T-0013 – MAT-T-0019 |
| Path 4 | AI Maturity Scoring | MAT-T-0023 – MAT-T-0027 |
| Path 5 | Report Generation | MAT-T-0035, MAT-T-0036 |
| Path 6 | Excel Export | MAT-T-0037 |
| Path 7 | User Authentication | MAT-T-0049, MAT-T-0050 |
| Path 8 | Dashboard Real-time Updates | MAT-T-0039 – MAT-T-0042, MAT-T-0098 |
| Path 9 | Interview Transcription | MAT-T-0020 – MAT-T-0022 |
| Path 10 | AI Service Failure | MAT-T-0076 |
| Path 11 | Upload Failure | MAT-T-0078 |
| Path 12 | Offline Evidence Capture | MAT-T-0047, MAT-T-0048 |
| Path 13 | AI Degraded Mode | MAT-T-0077 |

### 5.3 Wiring Invariant Coverage

All 5 architecture wiring invariants (§3.11.4) have dedicated test components:

| Invariant | Test Component |
|-----------|---------------|
| No orphan components | MAT-T-0079 |
| No phantom interfaces | MAT-T-0080 |
| No implicit connections | MAT-T-0081 |
| Directional clarity | MAT-T-0082 |
| Failure isolation | MAT-T-0083 |

### 5.4 Connection Registry Coverage

All 14 connections from the connection registry (§3.11.2) are covered by test components MAT-T-0084 through MAT-T-0093, plus cross-references in functional tests.

### 5.5 Watchdog Coverage

Watchdog monitoring (FR-059, FR-060, FR-061) is covered by MAT-T-0058 through MAT-T-0060, plus MAT-T-0098 for realtime dashboard wiring.

### 5.6 Performance Metrics Coverage

Performance requirements from test-strategy.md are covered by MAT-T-0071 through MAT-T-0075.

### 5.7 Cross-App Component Coverage

Cross-app components (PIT integration, Maturity Roadmap integration) are covered by MAT-T-0056 and MAT-T-0057.

---

## 6. Test Type Distribution

| Test Type | Count | Percentage |
|-----------|-------|------------|
| Integration | 55 | 56% |
| Unit | 10 | 10% |
| E2E | 9 | 9% |
| Performance | 7 | 7% |
| Architecture | 7 | 7% |

This aligns with the test pyramid: majority integration tests (business logic validation), supported by unit tests (isolated logic), E2E tests (user workflows), performance tests (scalability), and architecture tests (structural compliance).

---

## 7. Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0 (Must Have) | 77 | 79% |
| P1 (Should Have) | 17 | 17% |
| P2 (Nice to Have) | 4 | 4% |

P0 tests must all be GREEN before MAT can be considered deliverable. P1 and P2 tests are required but may follow in a subsequent validation pass.

---

## 8. Governance Cross-References

### 8.1 Independent Assurance Execution Strategy

This red test suite is aligned with the [Independent Assurance Execution Strategy](https://github.com/APGI-cmy/maturion-foreman-governance/blob/main/maturion/strategy/INDEPENDENT_ASSURANCE_EXECUTION_STRATEGY.md):

- **Cross-agent verification**: The test suite is designed to be reviewable by independent governance agents for completeness and coverage
- **Structured critique**: Each test component has explicit acceptance criteria and architectural traceability
- **Evidence-based validation**: Test outcomes reference serial numbers for deterministic audit trail
- **Adversarial pressure**: Architecture invariant tests (CAT-11) enforce structural constraints independently of functional tests

### 8.2 Living Canon Alignment Execution Plan

This strategy aligns with the [Living Canon Alignment Execution Plan](https://github.com/APGI-cmy/maturion-foreman-governance/blob/main/maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md):

- **Proactive compliance**: Tests are compiled before implementation, not after
- **Evidence-first**: All test outcomes produce traceable evidence with serial IDs
- **Stop-and-fix**: Any test failure blocks the build; zero test debt policy
- **Deterministic automation**: Serial numbering and registry enable automated gate validation

### 8.3 QA Catalog Alignment Gate

Per `governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md`, this test suite satisfies:

- **QA Range Existence**: All 98 serial numbers exist in `governance/TEST_REGISTRY.json`
- **Semantic Alignment**: Each test description matches its FRS/TRS/architecture anchor
- **QA ID Collision**: Zero collisions (verified in registry integrity block)
- **Architecture Alignment**: All architecture sections referenced and frozen
- **QA-to-Red Precondition**: All tests start RED

### 8.4 Build Philosophy

Per `BUILD_PHILOSOPHY.md`:

- **One-time build correctness**: Tests define expected behavior before implementation
- **Zero regression**: Test suite prevents regression across all 98 components
- **Build-to-green**: Implementation turns tests from RED to GREEN

---

## 9. Execution Plan

### 9.1 Test Wave Execution

Since MAT is single-wave:

1. **All 98 RED tests** are compiled and registered in `governance/TEST_REGISTRY.json`
2. **Builders implement** features per architecture and FRS
3. **Tests turn GREEN** as implementation is delivered
4. **Gate validation** confirms all 98 tests are GREEN before merge

### 9.2 Evidence Artifacts

For each test run, the following evidence is produced:

- Serial ID of the test component
- Test execution timestamp
- Status: RED (expected before implementation) or GREEN (after implementation)
- Failure reason (if RED): expected failure type
- Architecture reference: link to source requirement

### 9.3 Gate Outcomes

All gate outcomes reference serial IDs from `governance/TEST_REGISTRY.json`. This enables:

- Deterministic compliance verification
- Automated coverage gap detection
- Traceable audit trail from requirement → test → implementation → evidence

---

## 10. Document References

| Document | Location |
|----------|----------|
| MAT System Architecture | `modules/mat/02-architecture/system-architecture.md` |
| MAT FRS | `modules/mat/01-frs/functional-requirements.md` |
| MAT TRS | `modules/mat/01.5-trs/technical-requirements-specification.md` |
| MAT Test Strategy | `modules/mat/02-architecture/test-strategy.md` |
| Test Registry (canonical) | `governance/TEST_REGISTRY.json` |
| QA Catalog Alignment Gate | `governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md` |
| Independent Assurance Strategy | [INDEPENDENT_ASSURANCE_EXECUTION_STRATEGY.md](https://github.com/APGI-cmy/maturion-foreman-governance/blob/main/maturion/strategy/INDEPENDENT_ASSURANCE_EXECUTION_STRATEGY.md) |
| Living Canon Alignment Plan | [LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md](https://github.com/APGI-cmy/maturion-foreman-governance/blob/main/maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md) |

---

*END OF MAT RED TEST SUITE STRATEGY*
