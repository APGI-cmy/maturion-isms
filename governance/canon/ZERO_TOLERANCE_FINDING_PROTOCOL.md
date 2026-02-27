# Zero-Tolerance Finding Protocol

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2 (Johan Ras)
**Effective Date**: 2026-02-27
**Approved By**: CS2 — issue APGI-cmy/maturion-foreman-governance#1200
**Layer-Down Status**: PUBLIC_API — Mandatory ripple to all consumer repositories
**Applies To**: ALL Agents, ALL Agent Classes, ALL Repositories, ALL Sessions, ALL AI/Agent Reviews

---

## 1. Purpose

This protocol canonises the **Zero-Tolerance Finding Principle** for all AI and agent output in the Maturion ecosystem:

> **There are no 'non-blocking', 'low severity', 'advisory', or 'housekeeping/fix later' findings. If an agent or AI review observes an issue, defect, or deviation — regardless of perceived severity — it is immediately blocking for merge/handover and MUST be remediated before proceeding. The only valid exception is explicit written approval by CS2 (governance authority).**

This protocol eradicates the triage/evaluation-for-seriousness step that allowed agents to classify findings as advisory or deferrable. Every finding is a blocker. All handover evidence must be pristine at the moment of handover.

---

## 2. Constitutional Authority

This protocol derives authority from and integrates with:

- **STOP_AND_FIX_DOCTRINE.md** — Zero tolerance for technical debt and immediate remediation mandate
- **WE_ONLY_FAIL_ONCE_DOCTRINE.md** — Constitutional principle: every failure results in structural improvement
- **UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md** — Per-agent preflight attestation and breach registry
- **BUILD_PHILOSOPHY.md** — 100% GREEN philosophy, Zero Test Debt constitutional requirement
- **MERGE_GATE_PHILOSOPHY.md** — All findings must be cleared before merge

**Integration Principle**: This protocol **supersedes** any prior canon language that permitted non-CS2 actors (reviewers, Foreman, agents) to grant 'non-blocking (optional)' exceptions for AI or agent-observed findings. The only exception path is explicit written approval from CS2.

---

## 3. Zero-Tolerance Principle

### 3.1 No Category Below Blocking

Every finding observed by any agent or AI tool is **BLOCKING** by default. There is no lower severity tier:

| ❌ Prohibited Classification | ✅ Mandatory Classification |
|-----------------------------|---------------------------|
| Non-blocking | BLOCKING — fix before proceeding |
| Advisory | BLOCKING — fix before proceeding |
| Low severity | BLOCKING — fix before proceeding |
| Informational only | BLOCKING — fix before proceeding |
| Housekeeping / fix later | BLOCKING — fix before proceeding |
| Nice to have | BLOCKING — fix before proceeding |
| Out of scope for this PR | BLOCKING — fix or CS2 exception |
| Known issue | BLOCKING — fix or CS2 exception |

### 3.2 Mandatory Response to Any Finding

When any agent or AI review produces a finding, one of only two responses is valid:

1. **FIX IT** — Remediate the issue completely before handover or merge. Verify with evidence.
2. **CS2 EXCEPTION** — Stop, document the finding in full, and obtain explicit written approval from CS2 to defer or waive the finding. Without that approval the finding remains blocking.

There is no third option. Silence, labelling a finding as advisory, or categorising it as non-blocking is a **governance violation**.

### 3.3 Scope: ALL AI and Agent Output

This protocol applies to findings from any source, including but not limited to:

- **Agent code review output** (CodexAdvisor, governance-liaison, IAA, any reviewer agent)
- **Automated quality tooling** (linters, static analysis, yamllint, coverage tools, security scanners)
- **CI/CD gate output** (merge gate failures, alignment checks, policy checks)
- **Manual agent inspection** (Foreman review, builder self-review, governance admin review)
- **Assurance output** (IAA REJECTION-PACKAGE findings, proof-gap observations)
- **Watchdog / cognitive hygiene observations**

Any tool or agent that produces a finding — no matter how it characterises that finding — generates a BLOCKING obligation.

### 3.4 No Self-Assessment of Severity

Agents and AI tools MUST NOT assess, classify, or triage findings by perceived severity. The following are prohibited:

- ❌ "This is only a style issue — I'll leave it"
- ❌ "Low risk, not worth blocking the PR"
- ❌ "Reviewer flagged this as non-blocking"
- ❌ "This is advisory — the agent can decide"
- ❌ "Low confidence finding — not actionable"
- ❌ "This is informational, not a defect"
- ❌ "This was pre-existing — not my fault"
- ❌ "Out of scope for this mandate"
- ❌ "I'll fix this in a follow-up PR"
- ❌ "Not introduced by this PR"

All of these are governance violations. The finding is blocking. Fix it or escalate to CS2 for a written exception.

---

## 4. CS2 Exception Procedure

The only path to a non-blocking finding is **explicit written approval from CS2**. The procedure is:

1. **Document the finding** — Record the finding in full (what it is, where it is, why it cannot be resolved immediately).
2. **Create a CS2 exception request** — File an escalation issue or in-PR comment explicitly requesting an exception, with full context.
3. **Wait for written CS2 approval** — Do NOT proceed until CS2 has explicitly approved the exception in writing (issue comment, PR comment, or signed governance exception document).
4. **Record the exception in PREHANDOVER_PROOF** — The exception and the CS2 approval reference MUST appear in the handover evidence.
5. **Scope the exception narrowly** — The exception covers only the specific finding described. It does not create a general licence to defer future findings.

**Prohibited shortcut**: A reviewer, Foreman, builder, CodexAdvisor, or governance-admin CANNOT grant a non-blocking exception. Only CS2 may.

---

## 5. Enforcement

### 5.1 Merge Gate

Any PR whose PREHANDOVER_PROOF contains unresolved findings without a documented CS2 exception MUST be rejected at the merge gate. Specifically:

- ❌ PREHANDOVER_PROOF that lists "non-blocking" findings → **BLOCKED**
- ❌ PREHANDOVER_PROOF that lists "advisory" findings without CS2 exception reference → **BLOCKED**
- ❌ Evidence that describes a finding as "informational" or "housekeeping" → **BLOCKED**
- ✅ Finding documented as "CS2 exception granted — reference: [issue/comment URL]" → **ALLOWED**

### 5.2 Agent Contracts

All agent contracts that contain language permitting reviewers or non-CS2 actors to grant 'non-blocking (optional)' exceptions are **superseded** by this protocol. Those agents MUST treat all findings as blocking unless a CS2 exception is on file.

### 5.3 FAIL-ONLY-ONCE Registration

Any agent that defers a finding without CS2 approval has committed a governance breach and MUST:

1. Stop work immediately.
2. Create an RCA entry in its `FAIL-ONLY-ONCE.md` registry.
3. Remediate the deferred finding before any further handover.

### 5.4 IAA Enforcement

The **Independent Assurance Agent** MUST issue a `REJECTION-PACKAGE` for any qualifying PR where:

- A finding has been classified as non-blocking, advisory, or informational without a CS2 exception on file.
- The submitting agent has characterised any finding using prohibited language (see §3.4).

---

## 6. Relationship to Existing Canon

| Canon File | Relationship |
|------------|-------------|
| `STOP_AND_FIX_DOCTRINE.md` | This protocol **strengthens** the existing zero-tolerance mandate by removing the "reviewer-granted non-blocking" exception pathway. CS2-only exception now applies. |
| `WE_ONLY_FAIL_ONCE_DOCTRINE.md` | This protocol operationalises the constitutional principle at the finding-classification level. |
| `UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md` | Agents MUST add a rule to their FAIL-ONLY-ONCE registry after any breach of this protocol. |
| `INDEPENDENT_ASSURANCE_AGENT_CANON.md` | IAA REJECTION criteria updated: non-blocking classification without CS2 exception is an auto-FAIL. |
| `MERGE_GATE_PHILOSOPHY.md` | All findings must clear the gate; this protocol enforces the gate at the finding level. |
| `COGNITIVE_HYGIENE_AUTHORITY_MODEL.md` | Watchdog and CHP observations that were previously "advisory, non-blocking" are now BLOCKING unless CS2 grants exception. |

---

## 7. Retroactive Effect

This protocol has **immediate effect** from its effective date. Any ongoing PR, wave, or session that contains uncleaned findings categorised as non-blocking or advisory MUST:

1. Immediately re-classify all findings as BLOCKING.
2. Either remediate them before handover OR obtain CS2 written exception.
3. Update PREHANDOVER_PROOF to reflect the correct blocking status.

There is no grace period.

---

## 8. Related Canon

- `governance/canon/STOP_AND_FIX_DOCTRINE.md` — Zero-tolerance and immediate remediation
- `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md` — Constitutional failure doctrine
- `governance/canon/UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md` — Per-agent breach registry mandate
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` — Binary assurance gate
- `governance/canon/MERGE_GATE_PHILOSOPHY.md` — Merge gate philosophy and enforcement
- `governance/canon/ESCALATION_POLICY.md` — Escalation paths for unresolvable issues

---

**Authority**: CS2 (Johan Ras) | **Issue**: APGI-cmy/maturion-foreman-governance#1200 | **Effective**: 2026-02-27
