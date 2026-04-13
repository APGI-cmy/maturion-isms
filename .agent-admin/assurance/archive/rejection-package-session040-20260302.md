# IAA REJECTION-PACKAGE — Session 088 — 2026-03-02

**IAA Session**: session-088-20260302
**Token Reference**: N/A — REJECTION-PACKAGE (no ASSURANCE-TOKEN issued)
**Date**: 2026-03-02
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## PR Under Review

| Field | Value |
|-------|-------|
| Branch | `copilot/implement-zero-severity-tolerance` |
| PR Title | "[IAA Policy] Enforce zero-severity-tolerance: any finding, of any size, triggers rejection (Codex implementation)" |
| Triggering Issue | Opened by @APGI-cmy (CS2) |
| Submitting Agent | CodexAdvisor-agent (session-040-20260302) |
| PR Category | CANON_GOVERNANCE + KNOWLEDGE_GOVERNANCE |
| Evidence Bundle | PREHANDOVER-session-040-20260302.md + session-040-20260302.md |

---

## Independence Confirmation

**I (independent-assurance-agent) did not produce any artifact in this PR.** All artifacts were produced by CodexAdvisor-agent (session-040-20260302). Independence requirement: CONFIRMED.

---

## Assurance Check Summary

| Category | Checks Applied | PASS | FAIL |
|----------|---------------|------|------|
| FAIL-ONLY-ONCE learning | 7 | 7 | 0 |
| Core invariants (applicable) | 13 | 13 | 0 |
| Core invariants (N/A — no agent contract) | 8 | N/A | N/A |
| CANON_GOVERNANCE overlay | 6 | 4 | **2** |
| KNOWLEDGE_GOVERNANCE overlay | 5 | 4 | **1** |
| **TOTAL** | **39** | **28** | **3** |

---

## Phase Verification

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 (Preflight Proof) | PASS ✅ | Session memory complete, Phase 1 preflight attestation fully populated, canon inventory verified, breach registry clear |
| Phase 2 (Governance Proof) | **PARTIAL FAIL** | IAA_REQUIRED correctly asserted. Canon and CANON_INVENTORY updated. However: PREHANDOVER lacks required ripple assessment (OVL-CG-004) and drift evidence (OVL-CG-005). |
| Phase 3 (Working Phase Proof) | PASS ✅ | Canon amendments substantive and complete; zero-severity-tolerance rule added correctly; CORE-021 added; IAA_ZERO_SEVERITY_TOLERANCE.md created; index.md updated. Content quality confirmed. |
| Phase 4 (Handover Proof) | **PARTIAL FAIL** | OPOJD gate passed for content. However index.md missing version history table (OVL-KG-003). PREHANDOVER missing OVL-CG-004 and OVL-CG-005 evidence items. |
| Phase 5 (Assurance Invocation) | THIS DOCUMENT — REJECTION-PACKAGE issued |

---

## REJECTION-PACKAGE

```
═══════════════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/implement-zero-severity-tolerance
"[IAA Policy] Enforce zero-severity-tolerance: any finding, of any size,
triggers rejection (Codex implementation)"
Submitting agent: CodexAdvisor-agent (session-040-20260302)
IAA session: session-088-20260302
Date: 2026-03-02

3 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FAILURE 1 — OVL-CG-004: Ripple impact assessed

  Finding:
    PREHANDOVER proof and session memory contain no ripple impact
    assessment for the INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.1.0
    amendment. No explicit "no ripple required" statement with
    justification is present. No list of impacted agents is present.
    Per CORE-020: absence of evidence = failing check.

  Fix required:
    Amend PREHANDOVER proof (PREHANDOVER-session-040-20260302.md) to
    include a ripple assessment section. Either:
    (a) List the agents whose governance documents require updating due
        to the zero-severity-tolerance policy (e.g., foreman-v2-agent,
        CodexAdvisor-agent, other agents that invoke IAA).
    OR
    (b) Include an explicit, justified "no ripple required" statement:
        e.g., "No governance ripple required — zero-severity-tolerance
        is an IAA-internal policy. Agents that invoke IAA interact via
        ASSURANCE-TOKEN / REJECTION-PACKAGE outputs only. No other
        agent's governance document requires updating."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FAILURE 2 — OVL-CG-005: Drift/integrity hash check

  Finding:
    PREHANDOVER proof does not include required drift evidence for the
    modified canon file governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md.
    The PREHANDOVER states "correct SHA256 hash" without providing the
    actual hash value before the change (v1.0.0 state) or after the
    change (v1.1.0 state). No git diff excerpt or change summary is
    present. OVL-CG-005 explicitly states: "Missing or absent drift
    evidence = REJECTION-PACKAGE."

  Fix required:
    Amend PREHANDOVER proof to include, for
    governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md,
    either option (a) or option (b):

    (a) Explicit SHA256 hashes:
        - v1.0.0 (before): [compute from prior committed state or git log]
        - v1.1.0 (after):
          a27874219287133a50fd0a885c5902787fc9ac10f2c34cc62e70ac705a8b4b99

    (b) Git diff excerpt or change summary:
        Example: "Changes to INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.0.0→v1.1.0:
        Added: §Zero-Severity-Tolerance Rule (new section, ~35 lines).
        Added: Zero-tolerance hard-trigger bullet to §Hard-Trigger Authority.
        Added: Delivery-appropriate depth note in §IAA Intelligence-Led Reasoning.
        Added: Amendment History table.
        Updated: Header Status/Version/Date fields."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FAILURE 3 — OVL-KG-003: Version history table updated

  Finding:
    .agent-workspace/independent-assurance-agent/knowledge/index.md v1.5.0
    has no version history table. The file was updated from v1.4.0 to
    v1.5.0 but contains no "## Version History" table section.
    OVL-KG-003 states: "Every modified Tier 2 knowledge file's version
    history table includes an entry for the new version with date and
    change description. Missing or stale version history = REJECTION-PACKAGE."

  Fix required:
    Add a ## Version History table to
    .agent-workspace/independent-assurance-agent/knowledge/index.md.
    The table must include at minimum a v1.5.0 entry, e.g.:

    | Version | Date | Change |
    |---------|------|--------|
    | 1.5.0 | 2026-03-02 | IAA_ZERO_SEVERITY_TOLERANCE.md v1.0.0 added
    |        |            | (Zero-Severity-Tolerance Tier 2 note);
    |        |            | iaa-core-invariants-checklist.md updated to v2.4.0
    |        |            | (CORE-021 added); FAIL-ONLY-ONCE.md noted as v1.3.0 |

    Prior version entries (v1.4.0, v1.3.0, etc.) should also be
    included where the information is known, for complete auditability.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ZERO-SEVERITY-TOLERANCE APPLIED (CORE-021):
  3 findings exist. Per the Zero-Severity-Tolerance Rule (canon §Zero-
  Severity-Tolerance Rule v1.1.0; CORE-021; IAA_ZERO_SEVERITY_TOLERANCE.md):
  any finding regardless of perceived severity triggers REJECTION-PACKAGE.
  No CS2 waiver has been issued for any of these findings.
  Prohibited language NOT used — all findings cited factually.

MERGE GATE PARITY: FAIL — governance alignment checks failed.

This PR must not be opened until all 3 failures are resolved and IAA
is re-invoked. Only a new ASSURANCE-TOKEN from a fresh IAA session
constitutes authorisation to proceed.

Adoption phase: PHASE_B_BLOCKING — this verdict is HARD-BLOCKING.
═══════════════════════════════════════════════════════════════════════
```

---

## Positive Observations (Not findings — informational only)

These observations note quality of the delivered content. They are NOT findings and do NOT affect the verdict.

1. **Content quality**: The zero-severity-tolerance rule is substantively correct and well-structured in both the canon and the Tier 2 operational note. The prohibited language table, machine-readable logic, exception procedure, and INC-ZST-001 breach pattern are all present and coherent.
2. **CORE-021 implementation**: The new CORE-021 check in the invariants checklist correctly implements the policy — clear description, applies to ALL, REJECTION-PACKAGE failure action.
3. **Cross-reference integrity**: All cross-references between canon, Tier 2 note, checklist, and index are consistent and complete.
4. **CANON_INVENTORY hash**: Computed SHA256 of the actual canon file matches the CANON_INVENTORY entry exactly — confirming hash integrity of the update.
5. **PREHANDOVER ceremony**: The ceremony structure is correct — PENDING state properly used, both proof and session memory present.

These observations confirm the substantive content of this PR is sound. The 3 failures are process/evidence gaps in the PREHANDOVER proof and one Tier 2 file structural omission — all are addressable with targeted amendments without content rework.

---

## Re-invocation Guidance

**To resolve and re-invoke:**

1. Amend `PREHANDOVER-session-040-20260302.md`:
   - Add ripple assessment section (OVL-CG-004)
   - Add drift evidence section with SHA256 before/after or git diff (OVL-CG-005)
2. Amend `.agent-workspace/independent-assurance-agent/knowledge/index.md`:
   - Add `## Version History` table with v1.5.0 entry (OVL-KG-003)
3. Commit amendments to branch `copilot/implement-zero-severity-tolerance`
4. Re-invoke IAA via `task(agent_type: "independent-assurance-agent")` with updated evidence bundle
5. Paste verbatim IAA response into PREHANDOVER proof `## IAA Agent Response (verbatim)` section

**Note**: The content of the PR (canon amendment, Tier 2 note, checklist, index update) does NOT require rework — only the PREHANDOVER proof and index.md version history require amendment.

---

## Merge Gate Parity Result

| Check | Local Result |
|-------|-------------|
| Merge Gate Interface / merge-gate/verdict | FAIL ❌ (3 overlay failures) |
| Merge Gate Interface / governance/alignment | FAIL ❌ (drift evidence and ripple assessment absent; index.md version history absent) |
| Merge Gate Interface / stop-and-fix/enforcement | FAIL ❌ (STOP-AND-FIX conditions present) |

**Parity result**: FAIL — local governance checks failed on 3 overlay checks.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy) — Merge authority: CS2 ONLY
**IAA Agent**: independent-assurance-agent v6.2.0
**Session**: session-088-20260302
**Issued**: 2026-03-02
