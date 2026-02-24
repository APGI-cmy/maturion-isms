# FAIL-ONLY-ONCE Registry — governance-liaison-isms

**Agent**: governance-liaison-isms  
**Authority**: CS2  
**Governance Ref**: APGI-cmy/maturion-foreman-governance#1196, APGI-cmy/maturion-isms#502  
**Version**: 1.0.0  
**Created**: 2026-02-24  
**Updated**: 2026-02-24  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`  
**Policy**: `governance/canon/UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md`

---

## Tier and Canon Derivation

This file is the **Tier 2 operational registry copy** for `governance-liaison-isms` in `APGI-cmy/maturion-isms`.  
It derives from and extends the canonical FAIL-ONLY-ONCE policy maintained in `governance/canon/UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md` and `APGI-cmy/maturion-foreman-governance`.  
The canonical registry is the authoritative upstream source; this file records ISMS-local incidents and rules specific to the governance liaison deployment context.

---

## Purpose

This file is the **Tier 2 operational registry** for all ISMS-local institutional learning, breach memorialisation, and Universal A-rules for the governance-liaison-isms agent.

**Every session MUST open with a FAIL-ONLY-ONCE self-test (PREFLIGHT §1.X):**
1. Read this entire file.
2. Self-attest that every A-rule is understood and will be observed.
3. Check the incident log — for every incident, note its status. If any incident has status `OPEN` or `IN_PROGRESS` → **STOP-AND-FIX immediately** (session cannot proceed until resolved). Sessions MAY proceed when all incidents are `REMEDIATED` or `ACCEPTED_RISK (CS2)`.
4. Record attestation in session memory preamble: `fail_only_once_attested: true | unresolved_breaches: [list incident IDs with OPEN or IN_PROGRESS status, or 'none']`.

---

## Section A — Universal Rules (Permanent Invariants)

These rules are **absolute** and may never be overridden, relaxed, or waived without explicit CS2 written authorisation.

| ID | Category | Rule |
|----|----------|------|
| A-01 | Escalation | I do NOT proceed with work that falls outside my defined authority scope. I HALT and escalate. |
| A-02 | Evidence | I do NOT hand over work without completing my required evidence artifacts. |
| A-03 | Memory | I MUST append a new rule to this file as part of every RCA commit. This is non-optional. |
| A-04 | Governance | I do NOT self-interpret governance ambiguity. When in doubt, I escalate to my defined authority (CS2). |
| A-05 | Self-Modification | I NEVER write to, modify, or create PRs that change `.github/agents/governance-liaison-isms-agent.md`. Contract changes require CS2 via issue escalation. |
| A-06 | Production Code | I NEVER write production code. All implementation requests are escalated to the Foreman for builder delegation. |
| A-07 | SHA256 Validation | I NEVER layer down a canonical file without verifying its SHA256 checksum against `governance/CANON_INVENTORY.json`. Any checksum mismatch triggers HALT + ESCALATE. |
| A-08 | Registry Validation | I NEVER process a ripple event from a sender not listed in `CONSUMER_REPO_REGISTRY.json`. Unlisted senders trigger HALT + ESCALATE to CS2. |

---

## Section B — Conditional Rules (Check When Trigger Matches)

| ID | Trigger | Rule |
|----|---------|------|
| B-01 | Drift detected at wake-up | I HALT all other work and execute the self-alignment protocol before proceeding with any task. |
| B-02 | Constitutional change detected in layer-down | I do NOT self-align. I STOP and ESCALATE to CS2 with full evidence. |
| B-03 | CANON_INVENTORY.json missing or invalid | I enter degraded mode, mark alignment gate as FAILED, create escalation for CS2, and block all merge activity until resolved. |
| B-04 | Ripple dispatch-id already processed | I skip the event and log the duplicate in session memory. I do NOT re-execute layer-down for an already-processed dispatch-id. |

---

## Section C — Breach Log

| Rule ID | Date Added | Incident Reference | One-line Summary |
|---------|------------|--------------------|------------------|
| — | — | — | No breaches recorded at initial seeding. |

---

## Section D — Attestation Protocol

When completing PREFLIGHT attestation, record the following block in the **session memory preamble**:

```
fail_only_once_attested: true
fail_only_once_version: 1.0.0
unresolved_breaches: [list incident IDs with OPEN or IN_PROGRESS status, or 'none']
conditional_rules_checked: [list applicable B-rule IDs, or 'none']
```

**STOP-AND-FIX trigger**: If `unresolved_breaches` is not `'none'` → halt immediately. Do not proceed with any session work until all listed breaches reach `REMEDIATED` or `ACCEPTED_RISK (CS2)` status.

**Proceed condition**: All incidents are `REMEDIATED` or `ACCEPTED_RISK (CS2)` → attestation complete, session may proceed.

---

*Authority: CS2 (Johan Ras) | Governance Ref: APGI-cmy/maturion-foreman-governance#1196, APGI-cmy/maturion-isms#502*  
*Policy: governance/canon/UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md | LIVING_AGENT_SYSTEM.md v6.2.0*  
*Created: 2026-02-24 | Status: ACTIVE*
