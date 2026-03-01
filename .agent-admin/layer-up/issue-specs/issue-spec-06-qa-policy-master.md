# Issue Spec: [Layer-Up] QA_POLICY_MASTER.md → canonical governance

**Target Repository**: APGI-cmy/maturion-foreman-governance  
**Labels**: `layer-up`, `governance-improvement`  
**Priority**: MEDIUM  
**Origin Reference**: APGI-cmy/maturion-isms#707  
**Candidate ID**: 2.3 (from `.agent-admin/layer-up/LAYER_UP_CANDIDATES.md`)

---

## Issue Body

---

## Trigger

**Governance Enhancement Validated** (LAYER_UP_PROTOCOL.md Section 5.7) + **Cross-Repository Pattern Observed** (Section 5.8)  
Policy carries "Constitutional — Canonical Policy, Authority: Supreme, Scope: Universal" status in maturion-isms.

## Evidence

- **File**: `governance/policy/QA_POLICY_MASTER.md` in APGI-cmy/maturion-isms
- **Status in file**: "Constitutional — Canonical Policy, Authority: Supreme, Scope: Universal"
- **Scope claim**: "Applies to all repositories in Maturion ecosystem"

## Current Governance State

No single canonical source of truth for QA, verification, and failure-handling doctrine exists in the canonical governance repository. QA policy is scattered across multiple documents.

## Observed Gap/Conflict/Failure

A "Universal" scope policy marked "Constitutional" and "Supreme" exists only in a consumer repository. Other consumer repos cannot access or enforce this policy. The QA doctrine is fragmented.

## Proposed Governance Improvement

Add `QA_POLICY_MASTER.md` to canonical governance policy directory as the single canonical source of truth for:
1. QA verification standards (what constitutes passing QA)
2. Failure-handling doctrine (what to do when QA fails)
3. Test completeness requirements (no stubs, no skips, real assertions)
4. Integration with OPOJD, STOP_AND_FIX_DOCTRINE, and FULLY_FUNCTIONAL_DELIVERY_STANDARD

**Breaking change**: NO — consolidates existing rules; does not introduce new requirements.

## Impact Assessment

- **Scope**: Universal — all consumer repositories in Maturion ecosystem
- **Urgency**: MEDIUM — consolidation of existing doctrine rather than new enforcement
- **Ripple required**: YES — all consumer repos should reference canonical QA master
- **Conflict signal**: POSSIBLE — review for overlap with existing QA documentation in canonical repo before merge

---

Reference: APGI-cmy/maturion-isms#707
