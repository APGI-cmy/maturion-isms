# Builder Contract Alignment — Implementation Plan

**Prepared By**: Foreman (FM)
**Date**: 2026-02-16
**Authority**: FM Contract v2.1.0, LIVING_AGENT_SYSTEM.md v6.2.0
**Issue**: #196 — Align All Builder Contracts with Foreman v2.1.0 for Gate Compliance
**Status**: ACTIVE

---

## 1. Objective

Align all builder contracts in `modules/mat/04-builder-appointment/builder-contract.md` with FM v2.1.0 governance requirements, ensuring:
- Gate compliance (POLC boundary gate Check 2: Validate Builder Involvement)
- Session memory protocol for builders
- LAS v6.2.0 category compliance
- Symmetric governance between FM and builders

---

## 2. Implementation Approach

### 2.1 Document Enhancement Strategy

Enhance the existing `modules/mat/04-builder-appointment/builder-contract.md` with:
1. A new **§0: Governance Alignment Protocol (All Builders)** section before individual builder sections
2. Per-builder enhancement sections added to each builder's contract
3. Updated contract metadata (version, LAS binding)
4. A new **§8: Builder Session Memory & Completion Report Protocol** section

### 2.2 Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Single document vs separate files | Single document | Maintain existing structure, reduce file proliferation |
| Enhancement placement | New sections §0 and §8 + per-builder additions | Minimal disruption to existing content |
| Version increment | v1.0.0 → v2.0.0 | Major governance alignment update |

---

## 3. Priority Waves

### Wave 1 (P0 — BLOCKING): Governance Protocol & Session Memory
**Target**: All builders simultaneously

Enhancements:
1. **§0: Governance Alignment Protocol** — Universal governance bindings for all builders
   - LAS v6.2.0 canonical bindings
   - Governance loading requirements
   - Self-alignment rules
2. **§6 Enhancement: Maturion Doctrine Compliance** — Add missing LAS categories
   - Category 0: Identity & Bindings reference
   - Category 2: Governance Loading
   - Category 3: Memory & Evidence
   - Category 4: Ripple & Gates (enhanced)
   - Category 5: Escalation & Stop (enhanced)
3. **§8: Builder Session Memory & Completion Report Protocol**
   - Mandatory session memory per build session
   - Standardized completion report format
   - Evidence bundle requirements
   - Delegation acceptance protocol

### Wave 2 (P0 — BLOCKING): Builder-Only Constraints
**Target**: api-builder, schema-builder, ui-builder first

Per-builder enhancements:
1. **Builder-Only Constraint** section per builder
   - Authorized file paths (explicit)
   - Prohibited file paths (explicit)
   - Structured for gate validation
2. **Merge Gate Awareness** per builder
   - Required gate checks
   - PREHANDOVER proof requirements
   - Evidence artifact expectations

### Wave 3 (P1): Integration & QA Builder Enhancement
**Target**: integration-builder, qa-builder

Same enhancements as Wave 2, adapted for these roles.

---

## 4. Enhancement Specifications

### 4.1 api-builder Enhancement Specification

**Scope**: Highest priority — most active builder, critical path

**Required additions**:
- Builder-Only Constraint with authorized paths: `modules/mat/src/api/**`, `modules/mat/src/edge-functions/**`, `modules/mat/src/ai-gateway/**`, `modules/mat/tests/api/**`
- Prohibited paths: `modules/mat/src/ui/**`, `modules/mat/src/components/**`, database schema files, governance/architecture docs
- Session memory at `.agent-workspace/api-builder/memory/session-NNN-YYYYMMDD.md`
- Completion report at `.agent-workspace/api-builder/TASK_*_COMPLETION_REPORT.md`
- Delegation acceptance acknowledgment

### 4.2 schema-builder Enhancement Specification

**Scope**: Foundation builder — blocks all other builders

**Required additions**:
- Builder-Only Constraint with authorized paths: `modules/mat/src/schema/**`, `modules/mat/src/migrations/**`, `modules/mat/src/seeds/**`, `modules/mat/tests/schema/**`
- Prohibited paths: Edge Functions, UI components, AI services, governance/architecture docs
- Session memory at `.agent-workspace/schema-builder/memory/session-NNN-YYYYMMDD.md`
- Completion report at `.agent-workspace/schema-builder/TASK_*_COMPLETION_REPORT.md`
- Delegation acceptance acknowledgment

### 4.3 ui-builder Enhancement Specification

**Scope**: Active in 4 waves, significant frontend scope

**Required additions**:
- Builder-Only Constraint with authorized paths: `modules/mat/src/ui/**`, `modules/mat/src/components/**`, `modules/mat/tests/ui/**`
- Prohibited paths: Edge Functions, database schema, AI services, governance/architecture docs
- Session memory at `.agent-workspace/ui-builder/memory/session-NNN-YYYYMMDD.md`
- Completion report at `.agent-workspace/ui-builder/TASK_*_COMPLETION_REPORT.md`
- Delegation acceptance acknowledgment

### 4.4 integration-builder Enhancement Specification

**Scope**: Single wave (Wave 5), lower priority

**Required additions**:
- Builder-Only Constraint with authorized paths: `modules/mat/src/integrations/**`, `modules/mat/tests/integrations/**`
- Prohibited paths: Core MAT business logic, UI components, database schema, governance/architecture docs
- Session memory at `.agent-workspace/integration-builder/memory/`
- Completion report protocol

### 4.5 qa-builder Enhancement Specification

**Scope**: Continuous cross-cutting role

**Required additions**:
- Builder-Only Constraint with authorized paths: `modules/mat/tests/**` (all test categories), `modules/mat/src/test-fixtures/**`
- Prohibited paths: Production feature code, governance/architecture docs
- Session memory at `.agent-workspace/qa-builder/memory/`
- Completion report protocol

---

## 5. Delegation Plan (Codex Advisor)

For each high-priority builder, FM will prepare issue specifications for Codex Advisor delegation:

| Builder | Issue Content | Label |
|---------|--------------|-------|
| api-builder | Enhancement specification §4.1 | `ai:codex-executor` |
| schema-builder | Enhancement specification §4.2 | `ai:codex-executor` |
| ui-builder | Enhancement specification §4.3 | `ai:codex-executor` |

**Note**: FM holds decision authority for issue creation but cannot execute GitHub platform actions directly (tooling constraint per Contract §1.3). Issue content is prepared here; execution requires CS2 or Maturion DAI/DAR.

---

## 6. Success Criteria

- [ ] Gap analysis complete (this document's companion)
- [ ] Implementation plan created (this document)
- [ ] Builder contract document enhanced with governance protocol
- [ ] Per-builder constraints added for high-priority builders
- [ ] Session memory protocol added for all builders
- [ ] Completion report protocol standardized
- [ ] Contract metadata updated to v2.0.0
- [ ] FM session memory documents orchestration
- [ ] Enhancement specifications ready for Codex delegation

---

**Implementation Plan Status**: ✅ COMPLETE
**Prepared By**: Foreman (FM)
**Date**: 2026-02-16

---

*END OF IMPLEMENTATION PLAN*
