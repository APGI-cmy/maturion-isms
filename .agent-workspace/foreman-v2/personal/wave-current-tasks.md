# Wave Current Tasks — Issue #1313

wave: cl-10-routing-governance-ci-enforcement
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md

## Active Wave: CL-10 — Routing Governance CI Enforcement (Re-execution)

### Wave Description
Foreman executes Wave CL-10 per concurrent-prebuild-and-legacy-plan.md §1.4 (Track 1).
Re-execution wave: CL-10-D1 (routing-governance-check.yml) and CL-10-D3
(stub-detection-check.yml) are already in the base branch. CL-10-D2 (sub-module routing
compliance CI check) was the outstanding deliverable — now DELIVERED.

CS2 Authorization: Issue maturion-isms#1313 — Authority: Foreman (delegation per CEP v1.8.0,
CS2 authorized wave-start already issued per maturion-isms#1221).

### Tasks
- [x] T1: Phase 1 Preflight complete
- [x] T2: IAA Pre-Brief — .agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md (SHA 7794c4d)
- [x] T3: Phase 2 Alignment — pre-build gates confirmed
- [x] T4: CL-10-D1 verification — routing-governance-check.yml already in base ✅
- [x] T5: CL-10-D3 verification — stub-detection-check.yml already in base ✅
- [x] T6: CL-10-D2 delegation to integration-builder — sub-module routing compliance CI check
- [x] T7: integration-builder CL-10-D2 handover + QP evaluation (PASS)
- [ ] T8: PREHANDOVER proof committed (Foreman)
- [ ] T9: IAA final audit and token

### Deliverables
| ID | Deliverable | Agent | Status |
|----|------------|-------|--------|
| CL-10-D1 | routing-governance-check.yml | integration-builder | ✅ DONE (in base — 8aa76f4) |
| CL-10-D2 | sub-module-routing-check.yml | integration-builder | ✅ DELIVERED (SHA 8774b79) |
| CL-10-D3 | stub-detection-check.yml | integration-builder | ✅ DONE (in base — 8aa76f4) |

### Tests
- T-C-010-001 through T-C-010-012: 12/12 GREEN ✅

### Previous Wave (Closed)
wave: optimize-iaa-invocation-workflows (Issue #1311)
