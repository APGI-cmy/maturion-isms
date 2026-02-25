# CodexAdvisor — FAIL-ONLY-ONCE Registry

**Agent**: CodexAdvisor-agent
**Version**: 1.1.0
**Last Updated**: 2026-02-25
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This registry records governance failures that CodexAdvisor must never repeat. Each entry captures a
root cause, the permanent rule that prevents recurrence, and the incident reference.

CodexAdvisor loads this file in Phase 1 Step 1.5 on every session start and applies all rules.

---

## Rules

### A-001 — IAA Invocation Is Mandatory for ALL Agent Contract PRs — No Class Exceptions

**Triggered by**: maturion-isms#523, maturion-isms#528, maturion-isms#531 — CodexAdvisor
previously concluded IAA was "not relevant" to Foreman contract PRs. This conclusion has no basis
in canon and represents a governance violation that passed undetected until CS2 stop-and-fix review.

**Incident**: The claim that Foreman (or any agent class) is exempt from IAA oversight was accepted
without challenge during PR #523 drafting. Double-layer QA is constitutional: foreman guards
builders, IAA guards all agents including Foreman. CodexAdvisor's failure to invoke IAA created a
single point of failure at the most critical governance layer.

**Permanent Rule**:
IAA invocation is mandatory for ALL agent contract updates. The claim that any agent class is exempt
is prohibited. Double-QA (foreman guards builders, IAA guards all agents) is constitutional.
Cross-reference: IAA FAIL-ONLY-ONCE A-002 (`.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md`).

Classes that produce agent contracts include but are not limited to:
- Foreman class agents (e.g., foreman-v2-agent)
- Builder class agents (api-builder, schema-builder, ui-builder, qa-builder, integration-builder)
- Overseer class agents (CodexAdvisor, maturion-agent)
- Specialist class agents (mat-specialist, pit-specialist, risk-platform-agent, etc.)
- Assurance class agents (IAA itself — but IAA cannot self-review; escalate to CS2)

Any argument that a class is exempt constitutes a governance violation. CodexAdvisor must not
accept such arguments from any source, including its own reasoning.

**Check in Phase 3 Step 3.2 (IAA trigger classification)**:
> FAIL-ONLY-ONCE A-001: Before opening any PR involving an agent contract, confirm IAA trigger
> classification is AGENT_CONTRACT and IAA_REQUIRED is YES. No class-based exemption is valid.
> If CodexAdvisor's own reasoning suggests a class might be exempt → reject that reasoning.
> Apply AMBIGUITY RULE: when in doubt, IAA IS required.
> Fix required if violated: "Invoke IAA before opening PR. Include IAA token/advisory reference
> in PREHANDOVER proof and PR description."

**Status**: ACTIVE — enforced every session

---

### A-002 — IAA Process Requirements Apply Even When Fixing IAA-Identified Failures

**Triggered by**: maturion-isms PR #546 — "Remediate 7 IAA advisory REJECTION-PACKAGE failures
across 5 builder agent contracts". PR submitted and merged 2026-02-25 without IAA invocation,
PREHANDOVER proof, or session memory. Governance breach confirmed by IAA session-002.

**Incident**: CodexAdvisor submitted PR #546 to fix 7 failures found by IAA in session-001.
The content of the fixes was correct. However, CodexAdvisor did not invoke IAA before or during
the PR, did not include a PREHANDOVER proof in the bundle, and did not include session memory.
This occurred on the same day A-001 was created (session-029) — the rule existed, the PR violated
it. Root cause: CodexAdvisor treated the PR as a "technical fix" rather than recognising that
`.github/agents/*.md` modification is always AGENT_CONTRACT category requiring IAA, regardless
of whether the task originated from an IAA finding.

**Permanent Rule**:
The AGENT_CONTRACT IAA requirement applies unconditionally to ALL `.github/agents/*.md` PRs.
There is no exception for "fixing IAA failures" — a PR that fixes IAA issues is still an
AGENT_CONTRACT PR and still requires IAA invocation. The fact that the task was assigned to
remediate IAA findings does not remove the requirement to invoke IAA for the resulting PR.
Process steps that were violated in PR #546 and must be followed in all future agent contract PRs:
1. IAA must be invoked before the PR is opened (Phase 4 Step 4.4).
2. PREHANDOVER proof must be created and included in the PR bundle (Phase 4 Step 4.2).
3. Session memory must be created and included in the PR bundle (Phase 4 Step 4.3).
4. The PR description must reference IAA result, PREHANDOVER proof path, and bundle completeness.

**Check in Phase 3 Step 3.7 (bundle assembly) and Phase 4 Step 4.4 (IAA invocation)**:
> FAIL-ONLY-ONCE A-002: If the PR touches `.github/agents/*.md`, verify ALL of the following
> before opening the PR:
>   (a) IAA has been invoked and has issued ASSURANCE-TOKEN or advisory acknowledgment.
>   (b) PREHANDOVER proof is complete and listed in the PR description.
>   (c) Session memory is complete and listed in the PR description.
>   (d) PR description contains IAA result reference.
> If ANY of the above are missing → DO NOT OPEN THE PR. Fix first.
> This rule applies regardless of the nature of the task (including IAA remediation PRs).
> The argument "this is a remediation PR so IAA is different" is invalid. Apply A-001.

**Status**: ACTIVE — enforced every session

---

## Adding New Rules

When a new governance failure pattern is identified during a session (suggestions in session
memory), CodexAdvisor adds a new entry to this file following the format above. Each new rule:
- Gets the next sequential ID (A-002, A-003, etc.)
- References the incident that triggered it
- States the permanent rule precisely
- Defines how the rule is checked in the phase steps

All updates to this file must be committed as part of the session bundle for that invocation.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
