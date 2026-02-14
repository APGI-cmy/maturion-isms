# Schema Builder Agent File Creation Evidence

**Date**: 2026-02-14  
**Authority**: CodexAdvisor (agent-factory overseer)  
**Task**: Create `.github/agents/schema-builder.md` for MAT module

---

## Execution Summary

✅ **COMPLETE** — Schema builder agent file created successfully

**File**: `.github/agents/schema-builder.md`  
**Character Count**: 13,222 characters (56% below 30,000 limit)  
**Line Count**: 285 lines  
**Format**: YAML frontmatter + Markdown body

---

## Validation Results

### 1. Character Count Validation ✅

- **Target**: < 30,000 characters (GitHub UI selectability requirement)
- **Actual**: 13,222 characters
- **Status**: ✅ PASS (56% below limit)

### 2. YAML Frontmatter Validation ✅

```yaml
✅ YAML frontmatter is valid
✅ Builder ID: schema-builder
✅ Agent class: builder
✅ Contract version: 2.0.0
✅ Governance protocol: LIVING_AGENT_SYSTEM
✅ Handover protocol: gate-first-deterministic
✅ Canonical authorities count: 3
✅ Merge gate checks count: 3
```

### 3. Required YAML Fields ✅

All mandatory fields present:
- ✅ `id: schema-builder`
- ✅ `description` (multi-line)
- ✅ `agent` section (id, class, version, contract_version, model, temperature)
- ✅ `governance` section (protocol, version, canon_inventory, canonical_authorities, handover_protocol, no_debt_rules, evidence_requirements)
- ✅ `bindings` section (canonical_source, governance_baseline, build_philosophy, appointment_protocol, builder_spec)
- ✅ `merge_gate_interface` (3 required checks)
- ✅ `scope` (repository, type, read_access, write_access, escalation_required)
- ✅ `capabilities` (builder_ops, responsibilities, forbidden)
- ✅ `execution_identity` (name, secret, never_push_main, write_via_pr)
- ✅ `prohibitions` (6 items)
- ✅ `metadata` (canonical_home, recruitment_date, status, builder_type)

### 4. Mandatory Markdown Sections ✅

All 12 required sections present:
1. ✅ Quick Onboarding
2. ✅ Governance Bindings
3. ✅ Mission
4. ✅ Maturion Builder Mindset
5. ✅ Constitutional Sandbox Pattern (BL-024)
6. ✅ Scope
7. ✅ One-Time Build | Zero Test Debt | Immediate Remedy
8. ✅ Test & Warning Governance (PR #484)
9. ✅ Gate-First Handover | Enhancement Capture | Appointment Protocol
10. ✅ Mandatory Process Improvement Reflection
11. ✅ IBWR | BL-018/BL-019 | Code Checking | FM State Authority
12. ✅ Schema-Specific Requirements (Wave 0 — Task 0.1)

### 5. Schema-Builder Specific Content ✅

Content accurately reflects `modules/mat/04-builder-appointment/builder-contract.md` Section 1:

- ✅ Builder ID: schema-builder
- ✅ Builder Type: specialized
- ✅ Assigned Waves: Wave 0 (Task 0.1)
- ✅ Scope: Database schema, RLS policies, indexes, migrations, seed data
- ✅ Test Coverage: MAT-T-0083–MAT-T-0098 (16 tests) + MAT-T-0042–MAT-T-0050 (9 tests) = 25 tests
- ✅ Forbidden: Application code, architecture changes, non-spec tables/columns, RLS weakening
- ✅ Read Access: foreman/**, architecture/**, governance/**, modules/mat/02-architecture/**
- ✅ Write Access: supabase/migrations/**, apps/*/db/**, .agent-workspace/schema-builder/**
- ✅ Handover: gate-first-deterministic
- ✅ Key Architecture References: data-architecture.md, security-architecture.md, system-architecture.md, trs-to-architecture-traceability.md

### 6. Maturion Doctrine Compliance ✅

- ✅ Maturion doctrine version: 1.0.0
- ✅ Handover protocol: gate-first-deterministic
- ✅ No debt rules: zero-test-debt-mandatory
- ✅ Evidence requirements: complete-audit-trail-mandatory
- ✅ Canonical authorities: BUILD_PHILOSOPHY.md, ROLE_APPOINTMENT_PROTOCOL.md, builder-contract.md
- ✅ Constitutional Sandbox Pattern section present
- ✅ Maturion Builder Mindset section present
- ✅ One-Time Build Correctness section present

---

## Comparison with api-builder.md

**Structure**: Mirrored precisely from `.github/agents/api-builder.md`  
**Format**: YAML frontmatter + Markdown body (identical structure)  
**Size**: schema-builder.md (13,222 chars) vs api-builder.md (10,116 chars) — both well below 30K limit

**Content Differences** (schema-builder specific):
- Mission: Database schema vs. API routes
- Scope: supabase/migrations/** vs. apps/*/api/**
- Test Coverage: 25 tests (CAT-11 + CAT-05) vs. different test set
- Forbidden: Application code vs. frontend UI
- Key References: data-architecture.md vs. system-architecture.md

---

## Governance Compliance

### Living Agent System v6.2.0 ✅

- ✅ YAML frontmatter conforms to schema
- ✅ Consumer repository mode (correct canon_inventory path)
- ✅ Merge gate interface (3 required checks)
- ✅ Execution identity (Maturion Bot, PR-only writes)
- ✅ Prohibitions include agent contract edit prohibition

### BUILDER_CONTRACT_SCHEMA.md v2.0 ✅

- ✅ All required YAML fields present
- ✅ All Maturion Doctrine fields present
- ✅ All mandatory markdown sections present
- ✅ Constitutional Sandbox Pattern included
- ✅ Maturion Builder Mindset included

### Build Philosophy ✅

- ✅ One-Time Build Correctness section
- ✅ Zero Test Debt section
- ✅ Gate-First Handover section
- ✅ Enhancement Capture protocol
- ✅ IBWR awareness

---

## File Location

```
/home/runner/work/maturion-isms/maturion-isms/.github/agents/schema-builder.md
```

---

## Authority

**Created By**: CodexAdvisor (agent-factory overseer)  
**Authority**: Living Agent System v6.2.0, Agent-Factory Protocol  
**Authorized By**: CS2 (Johan Ras) — awaiting PR approval  
**Date**: 2026-02-14  
**Status**: ✅ READY FOR CS2 REVIEW

---

## Next Steps

1. ✅ File created at `.github/agents/schema-builder.md`
2. ⏳ Commit to git and create PR
3. ⏳ Request CS2 approval (PR review)
4. ⏳ Merge after CS2 approval
5. ⏳ Schema-builder available for Foreman recruitment

---

**End of Evidence**
