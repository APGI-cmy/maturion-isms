# Proof of Operation — Post-Token Final-State Normalization Hardening

**Document Type**: Governance Proof of Operation  
**Wave**: harden-post-token-normalization  
**Branch**: copilot/harden-post-token-normalization  
**Issue**: #1407 (Harden post-token final-state normalization)  
**Date**: 2026-05-01  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Produced By**: foreman-v2-agent (orchestration) + CodexAdvisor-agent (implementation)  

---

## Purpose

This document demonstrates that the hardened enforcement stack introduced in this wave will
correctly **reject** each of the four failure classes identified in the #1405 escape, and will
**accept** correctly normalized final-state bundles.

The escape observed in #1405 was:

> Token present. But the final-state bundle was not fully normalized —  
> pre-final assembly instructions survived into committed final-state artifacts while the wave
> record simultaneously claimed PASS / merge permitted.

This proof exercises each of the four exact miss classes using concrete artifact excerpts and
traces the failure path through all three enforcement layers (ECAP §4.3e, Foreman QP, IAA).

---

## Scenario 1 — PASS claimed, PREHANDOVER still contains "to be completed by Foreman"

### Artifact excerpt (defective)

```yaml
# In .agent-admin/prehandover/proof-XXXX.md (final-state)
final_state:        COMPLETE
iaa_audit_token:    .agent-admin/assurance/iaa-token-session-070-wave9.1-20260501.md

## IAA Audit Section
to be completed by Foreman after receiving ASSURANCE-TOKEN
```

### Why this is defective

The field `to be completed by Foreman after receiving ASSURANCE-TOKEN` is DENYLIST entry D-01
(POST_TOKEN_VOCABULARY_LAW.md §1). The artifact simultaneously claims `final_state: COMPLETE`
and contains a pre-final assembly instruction. This is the exact #1405 escape pattern.

### Detection path

| Layer | Check | Fired? | Reason |
|-------|-------|--------|--------|
| ECAP §4.3e Check C2 | `grep -iE "to be completed by Foreman" proof-XXXX.md` | **YES — GATE FAILS** | D-02 match in non-superseded PREHANDOVER proof |
| ECAP §4.3e Check H | Final assurance claimed (`final_state: COMPLETE`) + pre-final wording found in same artifact | **YES — GATE FAILS** | H1 cross-artifact inconsistency (artifact is both claimant and survivor) |
| Foreman QP | Post-Token Normalization Checkpoint Row 1: "Accepted PREHANDOVER copy is in post-IAA form" | **FAILED** | Would be marked FAILED at Row 1; `administrative_readiness: REJECTED` |
| IAA ACR-09 | Denylist phrase present in committed final-state artifact | **REJECTION-PACKAGE** | ACR-09 fires; merge blocked |

### Correct post-token form

```yaml
## IAA Audit Section
ASSURANCE-TOKEN issued: IAA-session-070-wave9.1-20260501-PASS
IAA Agent Response (verbatim): [actual verbatim IAA response pasted here]
```

---

## Scenario 2 — PASS claimed, "verbatim IAA response" section contains instruction prose

### Artifact excerpt (defective)

```markdown
### 3.2 IAA Agent Response (verbatim)
<!-- ASSEMBLY_TIME_ONLY: Paste the verbatim IAA response here. Do not summarise. -->
```

### Why this is defective

The `ASSEMBLY_TIME_ONLY` comment block is DENYLIST entry D-15 (POST_TOKEN_VOCABULARY_LAW.md §1).
This template instruction block was never replaced with the actual IAA response before
the artifact was committed with a final-assurance claim.

### Detection path

| Layer | Check | Fired? | Reason |
|-------|-------|--------|--------|
| ECAP §4.3e Check C2 | `grep -iE "ASSEMBLY_TIME_ONLY" iaa-wave-record-*.md` | **YES — GATE FAILS** | D-15 match in wave record |
| ECAP §4.3e Check H | Final assurance claimed + ASSEMBLY_TIME_ONLY block in same artifact set | **YES — GATE FAILS** | H1 fires |
| Foreman QP | Post-Token Normalization Checkpoint Row 5: `IAA Agent Response (verbatim)` sections contain actual IAA response | **FAILED** | Row 5 FAILED |
| IAA ACR-09 | `ASSEMBLY_TIME_ONLY` (D-15) present in committed final-state artifact | **REJECTION-PACKAGE** | ACR-09 fires; merge blocked |

### Correct post-token form

```markdown
### 3.2 IAA Agent Response (verbatim)

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> [... actual full IAA response text ...]
> VERDICT: ASSURANCE-TOKEN issued."
```

---

## Scenario 3 — Wave record says PASS / merge permitted; PREHANDOVER says Phase 4 pending

### Artifacts (defective pair)

**Wave record** (`iaa-wave-record-wave9.1-20260501.md`):
```markdown
### 3.1 IAA Verdict
- Verdict: ASSURANCE-TOKEN (PASS)
- Token: IAA-session-070-wave9.1-20260501-PASS
merge permitted subject to CS2 approval
```

**PREHANDOVER proof** (`proof-1407.md`):
```yaml
final_state:            PENDING          # ← pre-final wording
iaa_audit_token:        IAA assurance pending (Phase 4)   # ← D-06 denylist
```

### Why this is defective

The wave record claims ASSURANCE-TOKEN (PASS) / `merge permitted`. The PREHANDOVER proof
simultaneously says `PENDING` (AAP-01) and `IAA assurance pending (Phase 4)` (DENYLIST D-06).
The final-state bundle tells two incompatible stories. This is **exactly the #1405 escape**.

### Detection path

| Layer | Check | Fired? | Reason |
|-------|-------|--------|--------|
| ECAP §4.3e Check C1 | `grep -iE "\bPENDING\b" proof-1407.md` | **YES — GATE FAILS** | AAP-01: `PENDING` in final-state proof |
| ECAP §4.3e Check C2 | `grep -iE "IAA assurance pending" proof-1407.md` | **YES — GATE FAILS** | D-06/D-07 match |
| ECAP §4.3e Check H | Wave record claims `merge permitted`; PREHANDOVER contains D-06 denylist phrase | **YES — GATE FAILS** | H1: cross-artifact inconsistency — claimant = wave record, survivor = PREHANDOVER proof |
| Foreman QP | Post-Token Normalization Checkpoint Row 4: all artifacts tell one coherent post-token story | **FAILED** | Row 4 FAILED |
| IAA ACR-02 | Contradictory final-state wording across ceremony artifacts | **REJECTION-PACKAGE** | ACR-02 fires |
| IAA ACR-09 | Denylist phrase (D-06) in committed PREHANDOVER | **REJECTION-PACKAGE** | ACR-09 fires |
| IAA ACR-10 | Cross-artifact final-state inconsistency | **REJECTION-PACKAGE** | ACR-10 fires |

### Correct post-token form

```yaml
final_state:            COMPLETE
iaa_audit_token:        .agent-admin/assurance/iaa-token-session-070-wave9.1-20260501.md
```

---

## Scenario 4 — Artifact claims "carried forward from harvest map" but silently changes ownership

### Artifact excerpt (defective)

```markdown
## Stage-Governance Model (carried forward verbatim from harvest map)

| Stage | Owner | Approver |
|-------|-------|---------|
| SG-1  | Foreman | Foreman   |   ← CHANGED from "CS2 (independent)"
| SG-2  | Builder | Foreman   |   ← CHANGED from "CS2 (final approval)"
```

The actual canonical harvest map specifies:

```markdown
| SG-1  | Foreman | CS2 (independent)   |
| SG-2  | Builder | CS2 (final approval) |
```

### Why this is defective

The artifact claims the table is "carried forward verbatim" but changes ownership labels in a
way that weakens the CS2 approval requirement. This is DENYLIST entry AAP-19 / ACR-11 and the
exact SG-1/SG-2 drift class observed in #1405.

### Detection path

| Layer | Check | Fired? | Reason |
|-------|-------|--------|--------|
| ECAP §4.3e Check I | `grep -iE "carried forward\|verbatim from" artifact.md` — phrase found; `grep -iE "canonical source:"` — NOT found | **YES — GATE FAILS** | I1 fires: "carried forward" claim without declared canonical source reference |
| Foreman QP | Post-Token Normalization Checkpoint Row 6: "carried forward" claims verified against cited source | **FAILED** | Row 6 FAILED; ownership divergence found |
| IAA ACR-11 | "carried forward" claim diverges from cited canonical source in ownership / gate authority | **REJECTION-PACKAGE** | ACR-11 fires |

### Correct post-token form (option A — fix to match canonical)

```markdown
## Stage-Governance Model (source: harvest-map.md §SG-ownership v0.2.1)
<!-- canonical source: modules/MMM/harvest-map/harvest-map.md §Stage-Gate-Ownership -->

| Stage | Owner | Approver |
|-------|-------|---------|
| SG-1  | Foreman | CS2 (independent)   |
| SG-2  | Builder | CS2 (final approval) |
```

### Correct post-token form (option B — intentional deviation, CS2-authorized)

```markdown
## Stage-Governance Model (amendment approved by CS2 — deviates from harvest map v0.2.1)
<!-- canonical source: modules/MMM/harvest-map/harvest-map.md §Stage-Gate-Ownership -->
<!-- intentional deviation: CS2 authorization: [issue/comment ref] -->

| Stage | Owner | Approver |
|-------|-------|---------|
| SG-1  | Foreman | Foreman   |   ← intentional amendment, CS2-authorized
```

---

## Summary: Failure Classes Closed

| Failure Class | Detection Mechanism | Enforcement Layer | Result |
|--------------|--------------------|--------------------|--------|
| Post-token pre-final wording (D-01–D-12, D-15; regex-detectable) | §4.3e Check C2 (machine scan, PRE_FINAL_REGEX — gated behind final-assurance-claimed state) | ECAP gate + Foreman QP Row 1–5 + IAA ACR-09 | **BLOCKED at all 3 layers** |
| D-13 blank verbatim-response fields / D-14 mixed-status stage-readiness | Foreman QP Row 2–3 (structural inspection) + IAA ACR-09 | Foreman QP + IAA ACR-09 | **BLOCKED at Foreman QP and IAA layers** |
| Surviving ASSEMBLY_TIME_ONLY template blocks (D-15) | §4.3e Check C2 (`ASSEMBLY_TIME_ONLY` in PRE_FINAL_REGEX) | ECAP gate + ECAP G-6 + IAA ACR-09 | **BLOCKED at all 3 layers** |
| Cross-artifact final-state contradiction | §4.3e Check H (cross-artifact scan, active bundle scope — latest session per workspace, non-superseded proofs, latest wave record) | ECAP gate + Foreman QP Row 4 + IAA ACR-10 | **BLOCKED at all 3 layers** |
| "Carried forward" canonical drift | §4.3e Check I (source-reference flag, active bundle scope) + Foreman QP Row 6 manual | ECAP gate + Foreman QP + IAA ACR-11 | **BLOCKED at all 3 layers** |

---

## Closure Criterion Status

| Criterion | Status |
|-----------|--------|
| Token presence enforcement | ✅ Pre-existing (ACR-01, §4.3b) |
| Post-token vocabulary law (denylist + replacement) | ✅ `POST_TOKEN_VOCABULARY_LAW.md` v1.1.0 |
| Cross-artifact final-state consistency | ✅ §4.3e Check H + ACR-10 + AAP-18 |
| Template instruction non-leakage (ASSEMBLY_TIME_ONLY) | ✅ D-15 in denylist; §4.3e Check C2; §4.3e Check H |
| Canonical-source parity for inherited governance claims | ✅ §4.3e Check I + ACR-11 + AAP-19 |
| Proof of operation on all 4 failure classes | ✅ This document — Scenarios 1–4 above |

---

## Related Artifacts

- `governance/canon/POST_TOKEN_VOCABULARY_LAW.md` v1.1.0
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.5.2 — §4.3e Check C2, H, I (H and I scoped to active bundle)
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.7.0 — ACR-09, ACR-10, ACR-11, ACR-12, ACR-13
- `governance/checklists/execution-ceremony-admin-anti-patterns.md` v1.2.0 — AAP-17, AAP-18, AAP-19
- `governance/templates/execution-ceremony-admin/FOREMAN_ADMIN_READINESS_HANDBACK.template.md` v1.1.0
- `governance/templates/iaa-wave-record.template.md` — §3.2 ASSEMBLY_TIME_ONLY marker
- `.agent-workspace/execution-ceremony-admin-agent/knowledge/bundle-checklist.md` v1.1.0 — G-6
- `#1405` — original escape PR (context)
- `#1407` — this hardening issue

---

*Authority: CS2 (Johan Ras) | Produced: 2026-05-01 | Updated: 2026-04-19 | Wave: harden-post-token-normalization*
