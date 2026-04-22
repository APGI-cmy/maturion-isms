# Stage 10 Pre-Brief Ceremony Contract — Proof-of-Operation Examples

**Status**: CANONICAL EXAMPLE | **Version**: 1.0.0 | **Authority**: CS2
**Date**: 2026-04-22
**Governed by**: IAA_PRE_BRIEF_PROTOCOL.md v1.3.0 | INDEPENDENT_ASSURANCE_AGENT_CANON.md §Admin-Ceremony Rejection Triggers

---

## Purpose

Demonstrates how the Wave-Level Admin Ceremony Contract changes IAA review behaviour in three scenarios:
1. A wave that passes cleanly because the declared ceremony contract is fully satisfied
2. A wave that satisfies task-level requirements but fails wave-level ceremony expectations
3. A wave rejected because cross-artifact final-state contradictions were pre-declared and then violated

---

## Example 1 — Clean Pass: Ceremony Contract Fully Satisfied

### Scenario
Wave `widget-delivery-20260422` delivers a new governance canon file.

### Pre-Brief Ceremony Contract (declared at wave start)
**required_admin_ceremony_artifacts**:
- `.agent-admin/assurance/iaa-wave-record-widget-delivery-20260422.md`
- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-widget-delivery-20260422.md`
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-200-widget-delivery-20260422.md`
- `.agent-workspace/foreman-v2/memory/session-200-widget-delivery-20260422.md`

**required_final_state_conditions**:
- All tasks in `wave-current-tasks.md` show status DONE
- `iaa_audit_token` in PREHANDOVER is non-PENDING and matches token in wave record
- `CANON_INVENTORY.json` updated for new/modified canon files

**required_cross_artifact_consistency_checks**:
- Issue number consistent across PREHANDOVER, session memory, wave record
- Token format consistent: `IAA-session-200-widget-delivery-20260422-PASS` in all three locations

**required_acknowledgements**:
- Foreman acknowledges Pre-Brief before delegating to builders
- CS2 authorization documented in wave-current-tasks.md

**required_role_boundaries**:
- PREHANDOVER assembly owned by `execution-ceremony-admin-agent`
- IAA TOKEN section owned by `independent-assurance-agent`

**required_handover_references**:
- `iaa_wave_record_path` in wave-current-tasks.md points to existing wave record
- ART table in PREHANDOVER fully populated (no placeholder slots)

### At Handover — All Items Verified ✅
All declared artifacts present at HEAD commit. All final-state conditions true. Issue number consistent across all three artifacts. Token matches. Foreman acknowledgement documented. Role boundaries respected. ART table populated.

### IAA Review Outcome
IAA cross-references ceremony contract. All ACR-18 through ACR-21 checks: PASS.
Task-level FFA checks: PASS. **Verdict: ASSURANCE-TOKEN**.

---

## Example 2 — Ceremony Failure: Task-Level PASS but Wave-Level Contract FAIL

### Scenario
Wave `config-update-20260422` updates a configuration canon file. All task-level evidence is present and correct. However, the wave-level ceremony contract declared a required cross-artifact consistency check that is violated.

### Pre-Brief Ceremony Contract (declared at wave start)
**required_cross_artifact_consistency_checks**:
- Issue number consistent across PREHANDOVER proof, session memory, and wave record

### At Handover — Consistency Violation Found ❌
- PREHANDOVER proof references issue `#1446`
- Session memory references issue `#1442`
- Wave record references issue `#1446`

Task-level evidence: COMPLETE. All FFA checks: PASS. But declared cross-artifact consistency check FAILS (ACR-20 fires).

### IAA Review Outcome
IAA cross-references ceremony contract. ACR-20 fires: `required_cross_artifact_consistency_checks` violation. Issue number inconsistency between session memory (#1442) and PREHANDOVER (#1446).

**Verdict: REJECTION-PACKAGE**
```
Finding: ACR-20 — Cross-artifact final-state contradiction declared in ceremony contract and found at handover. Session memory references issue #1442; PREHANDOVER and wave record reference #1446. Foreman must reconcile issue number across all three artifacts before resubmission.
```

**Key lesson**: Task-level evidence alone is insufficient if the Pre-Brief declared wave-level ceremony expectations that are violated. The ceremony contract elevates cross-artifact consistency from an advisory check to a hard rejection condition.

---

## Example 3 — Rejection: Declared Final-State Condition Violated

### Scenario
Wave `schema-migration-20260422` delivers a new database migration. The Pre-Brief declared specific final-state conditions. At handover, one declared condition is not met.

### Pre-Brief Ceremony Contract (declared at wave start)
**required_final_state_conditions**:
- `iaa_audit_token` in PREHANDOVER proof is non-PENDING
- `CANON_INVENTORY.json` updated with SHA256 hash for new migration documentation canon
- All tasks in `wave-current-tasks.md` show status DONE

### At Handover — One Condition Unmet ❌
- `iaa_audit_token` in PREHANDOVER: `PENDING_IAA_VERDICT` (not replaced with actual token)
- `CANON_INVENTORY.json` updated: ✅
- All tasks DONE: ✅

### IAA Review Outcome
ACR-19 fires: `required_final_state_conditions` violated. `iaa_audit_token` field reads `PENDING_IAA_VERDICT` — a declared final-state condition requires this to be non-PENDING at handover.

Also: ACR-09 fires independently (pre-final instruction wording in final-state artifact).

**Verdict: REJECTION-PACKAGE**
```
Finding 1 (ACR-19): Declared final-state condition `iaa_audit_token is non-PENDING` not met. Current value: PENDING_IAA_VERDICT. Replace with actual token before resubmission.
Finding 2 (ACR-09): Pre-final instruction wording found in committed PREHANDOVER artifact. Remove all PENDING/instruction placeholder text.
```

**Key lesson**: When a final-state condition is pre-declared in the ceremony contract, the IAA treats a violation as an explicit REJECTION-PACKAGE finding, not a soft advisory. Pre-declaration converts implicit expectations into enforced contracts.

---

## Summary: How Pre-Declaration Changes Review Behaviour

| Without Ceremony Contract | With Ceremony Contract |
|--------------------------|----------------------|
| IAA discovers gaps at final review | Gaps are pre-declared and expected — no surprises |
| Cross-artifact inconsistencies are advisory | Cross-artifact inconsistencies trigger ACR-20 rejection |
| Missing final-state conditions may be treated as minor | Missing declared conditions trigger ACR-19 rejection |
| Role boundary violations discovered late | Role boundaries declared in advance; ACR-21 fires if violated |
| Review scope is implicit | Review scope is explicit from wave start |

The ceremony contract shifts IAA review from **reactive gap discovery** to **declared expectation enforcement**.

---

*Authority: CS2 (Johan Ras) | Version: 1.0.0 | Date: 2026-04-22 | Issue: maturion-isms#1446*
