# IAA Wave Record — phase4-tier2-role-guidance-1566

**Agent**: independent-assurance-agent  
**Wave**: phase4-tier2-role-guidance-1566  
**Issue**: maturion-isms#1566  
**Branch**: `copilot/align-operational-role-guidance`  
**Date**: 2026-05-07  
**Adoption Phase**: PHASE_B_BLOCKING

---

## PRE-BRIEF

**IAA Session**: session-prebrief-phase4-tier2-role-guidance-1566-20260507  
**Pre-Brief Mode**: Phase 0 (PRE-BRIEF only; no Phase 1–4 assurance execution)  
**ceremony_admin_appointed**: UNKNOWN (not declared in current wave-current-tasks source)

### Qualifying Tasks

| Task # | Task Description | Trigger Category | Tier |
|---|---|---|---|
| T-01 | Inventory existing Tier 2 role guidance and preservation map | KNOWLEDGE_GOVERNANCE | T2 |
| T-02 | Add/update Admin Ceremony Tier 2 checklist, boundary, risk scan, template | KNOWLEDGE_GOVERNANCE | T2 |
| T-03 | Add/update ECAP Tier 2 checklist, boundary, risk scan, template | KNOWLEDGE_GOVERNANCE | T2 |
| T-04 | Add/update Builder QA Tier 2 checklist, boundary, risk scan, template | KNOWLEDGE_GOVERNANCE | T2 |
| T-05 | Add/update IAA Tier 2 admin quick-scan + functional deep-scan + split verdict template | KNOWLEDGE_GOVERNANCE | T2 |
| T-06 | Add/update Foreman Tier 2 orchestration/role-boundary guidance + assignment matrix template | KNOWLEDGE_GOVERNANCE | T2 |
| T-07 | Operationalize cross-cutting Tier 2 rules and Tier1/Tier3 follow-up assessment | KNOWLEDGE_GOVERNANCE | T2 |

### Trigger Categories

- **Primary**: `KNOWLEDGE_GOVERNANCE` (Tier 2 operational knowledge/checklist/template updates)
- **Escalation trigger**: if any `governance/canon/**` or `governance/CANON_INVENTORY.json` change appears, reclassify to `MIXED` with `CANON_GOVERNANCE` active.
- **Hard prohibition**: `.github/agents/*.md` edits are out of scope unless CS2-approved CodexAdvisor path.

### FAIL-FAST / FAIL-ONLY-ONCE (FFA) Checks

| Check | Requirement | Pre-Brief Result |
|---|---|---|
| A-004 | Bootstrap-first discipline | PASS (IAA bootstrap invoked first) |
| A-003 | Ambiguity resolves to mandatory IAA | ACTIVE (applies if classification drifts) |
| A-005 | No unauthorized `.github/agents/**` contract edits | HARD BLOCKER |
| A-015 | Triggered Tier 2 knowledge work still requires full PREHANDOVER ceremony | REQUIRED |

### PREHANDOVER Structure (required at handover)

1. PREHANDOVER proof with wave checklist and explicit pre-brief linkage.
2. Session memory for producing agent session.
3. Scope declaration aligned to final changed-file set.
4. Current-head SHA recorded and freshness confirmed for evidence.
5. Tier 2 file map + preservation note + conflict-resolution note.
6. Tier 1 / Tier 3 impact assessment conclusion in required format.
7. `iaa_audit_token` field present in PREHANDOVER (expected reference format until IAA final verdict).

### Scope Blockers

- Any `.github/agents/*.md` change without CS2-approved Foreman→CodexAdvisor route.
- Any unplanned Tier 1 canon rewrite (instead of Tier 2 operationalization).
- Missing preservation note for existing Tier 2 assets.
- Missing conflict-precedence handling (Tier1 > Tier2 > Tier3 escalation rule).
- Missing current-head lock/freshness/scope-mutation operational fields.
- Live PR-specific report artifacts created instead of reusable Tier 2 templates/examples.
- Queue dependency not respected (`#1565` not merged, no explicit CS2 override).

### Phase 0 Required Output

Qualifying tasks: [T-01, T-02, T-03, T-04, T-05, T-06, T-07]  
Applicable overlay: [KNOWLEDGE_GOVERNANCE]

---

## TOKEN

```text
PHASE_B_BLOCKING_TOKEN: PENDING
```
