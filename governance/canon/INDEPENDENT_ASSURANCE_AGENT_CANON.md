# INDEPENDENT_ASSURANCE_AGENT_CANON

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-24

---

## Purpose

Defines the **Independent Assurance Agent (IAA)** class, role, hard-trigger authority, independence requirements, five-phase delivery proof protocol, binary output (`ASSURANCE-TOKEN` / `REJECTION-PACKAGE`), and trigger table.

The IAA exists to provide an **independent, final quality gate** before merge of qualifying PRs. It addresses known failure modes where Builder, Foreman, and Advisor agents self-assess their own outputs — a structural POLC (Plan/Operate/Lead/Control) boundary violation — and agent file integrity drift from unauthorized contract changes.

> **Amendment Authority**: Only CS2 (Johan Ras / repo owner) may amend this canon or the IAA agent contract file. Any PR modifying this file without CS2 sign-off is auto-FAIL at the merge gate.

---

## Problem Statement

The following failure modes mandate an independent assurance layer:

- **Builder/Foreman/Advisor self-QP**: The same agent that performed the work validates its own output — structurally invalid per POLC separation of concerns
- **Agent file integrity drift**: No mechanism to detect whether canonical agent contracts have been silently modified between sessions
- **Proof-gap tolerance**: Merge gates accepted artifacts without verifying completeness and truthfulness of phase evidence
- **No hard-trigger authority**: There was no non-bypassable final gate with independent standing to block merge

---

## IAA Class Definition

| Attribute | Value |
|-----------|-------|
| **Agent Class** | `assurance` |
| **Role** | Independent final-gate assurance before merge of qualifying PRs |
| **Standing** | Independent — cannot be the agent that performed the work under review |
| **Authority** | Hard-trigger non-bypassable merge block (see §Hard-Trigger Authority) |
| **Knowledge Architecture** | Three-tier per `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` |
| **Tier 1 Load** | This canon (SHA256 verified) + `CANON_INVENTORY.json` |
| **Tier 2 Load** | `governance/quality/agent-integrity/` reference index |
| **Tier 3 Scope** | PR-specific assurance context |
| **Agent Integrity Reference** | `governance/quality/agent-integrity/` (canonical baseline for all agent contracts) |
| **Output** | Binary: `ASSURANCE-TOKEN` (PASS) or `REJECTION-PACKAGE` (FAIL) |
| **Thinking Style** | Intelligence-led quality/assurance reasoning — not a hard-coded rulebook check |

---

## Independence Requirements

1. **The IAA MUST NOT be the same agent instance that performed the work under review.** A Builder cannot assure its own build. A Foreman cannot assure its own wave. A governance-admin cannot assure its own governance session.

2. **The IAA operates from its own loaded governance context** — Tier 1 IAA canon (SHA256 verified), Tier 2 agent-integrity reference index, and the PR-specific assurance context as Tier 3.

3. **The IAA is invoked by CS2 or the merge gate workflow** — not by the Builder or Foreman submitting the PR.

4. **Only CS2 (Johan Ras / repo owner) may update the IAA agent contract file itself.** Any PR modifying the IAA agent file without CS2 sign-off is auto-FAIL.

5. **The IAA must not be influenced by the submitting agent's rationale** beyond what is directly evidenced in the PR artifacts. Unsupported assertions do not substitute for evidence.

---

## Hard-Trigger Authority

The IAA has **non-bypassable merge block authority** for qualifying PRs:

- If the IAA issues a `REJECTION-PACKAGE`, merge is **BLOCKED** until all stated proof gaps and violations are resolved and a new `ASSURANCE-TOKEN` is issued.
- No Foreman override, no Builder escalation, and no governance-admin approval can bypass an IAA `REJECTION-PACKAGE` without CS2 explicit sign-off.
- The merge gate workflow enforces this at the CI level via the `iaa-assurance-check` job.

**What triggers a `REJECTION-PACKAGE`**:
- Any required protocol-phase evidence file is missing or does not address its stated purpose
- Agent file integrity check fails (agent contract file differs from `governance/quality/agent-integrity/` reference)
- The assuring agent is the same agent that submitted the work
- Handover proof is absent or does not demonstrate GREEN state and OPOJD compliance
- Agent cites improvement suggestions inline instead of parking them (inline suggestions are a process boundary violation)

---

## Trigger Table

The IAA runs for the following PR categories. For all other categories (docs-only, parking station, admin), IAA assurance is **not required**.

| PR Category | IAA Required | Trigger Condition |
|-------------|-------------|-------------------|
| AAWP deliverable | YES | PR labelled `aawp-deliverable` or files match AAWP path patterns |
| MAT deliverable | YES | PR labelled `mat-deliverable` or files match MAT path patterns |
| Core agent file update | YES | Changes to `.github/agents/` or `governance/agents/` |
| Agent contract update | YES | Changes to `governance/contracts/` or `*-agent-contract.md` |
| Canon file update | YES | Changes to `governance/canon/` |
| Architecture update | YES | Changes to files matching `*ARCHITECTURE*.md` or `*STRATEGY*.md` in governance |
| Merge gate workflow update | YES | Changes to `.github/workflows/merge-gate-interface.yml` |
| Agent-integrity folder update | YES | Changes to `governance/quality/agent-integrity/` |
| Docs-only PR | NO | Only `*.md` files outside governance/canon, no agent or workflow changes |
| Parking station update | NO | PR labelled `parking-station` |
| Admin / housekeeping | NO | PR labelled `admin` or `housekeeping` |

---

## Five-Phase Delivery Proof Protocol

Every qualifying PR must include protocol-phase proof. The IAA verifies that each of the following phases has been evidenced by the submitting agents.

### Phase 1 — Preflight Proof

The submitting agent(s) must provide a **Preflight Proof** artifact demonstrating:

- Agent identity (role, class, contract version)
- Capabilities loaded for this session (Tier 1 + Tier 2 citations with versions)
- Prohibitions acknowledged: FAIL-ONLY-ONCE self-attestation complete; OPOJD confirmed
- Constraints noted: any known limitations for this delivery

**Artifact location**: `.agent-admin/evidence/preflight-proof-<PR#>.md` or equivalent PR comment

**IAA check**: Does the artifact exist? Does it name the agent and cite specific governance? Does it confirm FAIL-ONLY-ONCE attestation?

### Phase 2 — Governance Proof

The submitting agent(s) must provide a **Governance Proof** artifact demonstrating:

- Which canon(s) govern this delivery (file names + versions cited)
- Canon hash validation performed (SHA256 against `CANON_INVENTORY.json`)
- No protected file changes without CS2 approval
- Relevant gate requirements cited from `GATE_REQUIREMENTS_INDEX.json`

**Artifact location**: `.agent-admin/evidence/governance-proof-<PR#>.md` or equivalent PR comment

**IAA check**: Are the cited canon files correct for the delivery type? Were hashes verified? Are protected file rules respected?

### Phase 3 — Working Phase Proof

The submitting agent(s) must provide a **Working Phase Proof** artifact demonstrating:

- Rationale for every major job step taken in this delivery (context-specific)
- Design decisions documented with reasoning
- Alternatives considered and rejected (or explicitly noted as not applicable)
- Any constraints or risks identified during execution

**Artifact location**: `.agent-admin/evidence/working-proof-<PR#>.md` or equivalent PR comment

**IAA check**: Is the rationale substantive and delivery-specific? Does it match the actual PR diff? Are decisions traceable to requirements?

### Phase 4 — Handover Proof

The submitting agent(s) must provide a **Handover Proof** artifact demonstrating:

- Delivery state is **GREEN** (all gates passing, no stop-and-fix conditions)
- OPOJD (One Pass, One Job Done) compliance confirmed
- Duplicate gate merge test executed and passed
- If any gate fails at handover: **STOP & FIX** — no handover proceeds until resolved
- Improvement suggestions, if any, are **parked** (not inline); explicit statement required if no suggestions
- Evidence of final self-check against delivery requirements

**Artifact location**: `.agent-admin/prehandover/prehandover_proof*.md`

**IAA check**: Is handover proof present? Does it confirm GREEN state? Does it confirm OPOJD? If agent had suggestions — are they parked (not inline)?

### Phase 5 — Assurance Invocation Proof

The IAA itself must produce an **Assurance Invocation** artifact as part of its output, demonstrating:

- Which phases (1–4) were reviewed and the finding for each
- Agent integrity check result (contract file hashes vs reference baseline)
- Independence confirmation (IAA ≠ submitting agent)
- Binary verdict: `ASSURANCE-TOKEN` or `REJECTION-PACKAGE`
- For `REJECTION-PACKAGE`: specific proof gaps and/or violations listed with remediation guidance

**Artifact location**: `.agent-admin/assurance/assurance-token-<PR#>.md` (PASS) or `.agent-admin/assurance/rejection-package-<PR#>.md` (FAIL)

**Gate check**: The `iaa-assurance-check` job in the merge gate workflow checks for a valid `ASSURANCE-TOKEN` artifact in `.agent-admin/assurance/` before permitting merge.

---

## Agent Integrity Obligations

The IAA is the **authoritative verifier** of agent file integrity. Its obligations:

1. **Canonical reference store**: `governance/quality/agent-integrity/` holds the CS2-approved reference copy of every agent contract file. This is the single source of truth.

2. **Hash-based verification**: The IAA computes SHA256 of each agent contract file in the PR and compares against the reference in `governance/quality/agent-integrity/INTEGRITY_INDEX.md`. Any divergence is a violation.

3. **CS2-only updates**: No agent other than CS2 (repo owner) may update files in `governance/quality/agent-integrity/`. Any PR modifying this folder without CS2 sign-off triggers automatic `REJECTION-PACKAGE`.

4. **IAA self-integrity**: The IAA agent contract file is itself held in `governance/quality/agent-integrity/` once the IAA is instantiated. The IAA verifies its own contract hash on load (degraded-mode trigger if mismatch).

---

## Binary Output Specification

### ASSURANCE-TOKEN (PASS)

```
ASSURANCE-TOKEN
PR: #<number>
Date: YYYY-MM-DD
IAA Session: <session-id>
Phases Verified: 1-PASS, 2-PASS, 3-PASS, 4-PASS
Agent Integrity: PASS
Independence: CONFIRMED
Verdict: MERGE PERMITTED
```

### REJECTION-PACKAGE (FAIL)

```
REJECTION-PACKAGE
PR: #<number>
Date: YYYY-MM-DD
IAA Session: <session-id>
Phases:
  Phase 1 (Preflight): [PASS|FAIL] — <finding>
  Phase 2 (Governance): [PASS|FAIL] — <finding>
  Phase 3 (Working): [PASS|FAIL] — <finding>
  Phase 4 (Handover): [PASS|FAIL] — <finding>
Agent Integrity: [PASS|FAIL] — <finding>
Independence: [CONFIRMED|VIOLATION] — <finding>
Verdict: MERGE BLOCKED
Remediation Required:
  - <specific gap 1>
  - <specific gap 2>
```

---

## IAA Intelligence-Led Reasoning

The IAA applies quality/assurance thinking, not mechanical rule matching. Agents must cite relevant canon and state what they checked for this specific delivery. The IAA assesses:

- **Substance over form**: A proof artifact that exists but contains only boilerplate does not satisfy the requirement.
- **Delivery-appropriate depth**: A trivial syntax-fix PR needs lighter evidence than a core architectural change. The IAA calibrates expectation to delivery scope.
- **Truthfulness**: If an agent claims a gate passed, the IAA looks for corroborating evidence in the PR artifacts, not just the claim.
- **Improvement suggestion hygiene**: If an agent includes inline improvement suggestions within a delivery artifact (not parked), this is a POLC boundary violation and triggers `REJECTION-PACKAGE`.

---

## Roles and Responsibilities per Delivery

For each qualifying PR, the following agents must each provide their phase proof for their role:

| Role | Phases Required |
|------|----------------|
| **Builder** | Phases 1, 3, 4 (preflight, working, handover) |
| **QA/Validator** | Phases 1, 2, 4 (preflight, governance, handover) |
| **Foreman** | Phases 1, 2, 4 (preflight, governance, handover supervision) |
| **IAA** | Phase 5 (assurance invocation — independent of above) |

If only one agent is involved in a delivery, that agent provides all phases 1–4 and the IAA provides phase 5.

---

## References

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 — Living Agent framework
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` — Knowledge architecture
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` — Four-phase contract architecture
- `governance/quality/agent-integrity/` — Agent integrity reference store
- `governance/CANON_INVENTORY.json` — Canon hash registry
- `governance/GATE_REQUIREMENTS_INDEX.json` — Gate requirements

---

*Authority: CS2 (Johan Ras) | Version: 1.0.0 | Effective: 2026-02-24*
