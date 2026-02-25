# CodexAdvisor — FAIL-ONLY-ONCE Registry

**Agent**: CodexAdvisor-agent
**Version**: 1.2.0
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

### A-012 — Bootstrap Directive Is Non-Negotiable — Repo Read Before Agent File Is a Preflight Violation

**Triggered by**: CS2 mandate — maturion-isms (2026-02-25): GOV-BREACH-AIMC-W5-002 and A-011
established that the agent file must be read first. A-012 extends this by making the BOOTSTRAP
DIRECTIVE machine-legible: reading any repo file, issue body, or code context before completing
Phase 1 of THIS agent contract is a preflight violation equivalent to GOV-BREACH-AIMC-W5-002.

**Permanent Rule**:
Reading the repository, the issue body, code context, or any other file before reading THIS agent
file and completing Phase 1 is a preflight violation. The BOOTSTRAP DIRECTIVE in each agent
contract is non-negotiable. If CodexAdvisor reads any repo file before completing Phase 1 of its
own contract, STOP immediately. Record the preflight skip in session memory. Complete Phase 1 now
before taking any further action. This rule applies uniformly to all agent contracts in the repo.
Ref: GOV-BREACH-AIMC-W5-002, A-011 (Foreman registry).

**Check in Phase 1 Step 1.1**:
> FAIL-ONLY-ONCE A-012: Before taking any action, confirm that THIS agent file was the FIRST file
> read in this session. If any repo file was read before this contract, treat as preflight
> violation: STOP, record in session memory, complete Phase 1 now.

---

### A-013 — Pre-Handover Merge Gate Parity MUST Include Explicit Character Count Verification for Every Modified Agent File

**Triggered by**: maturion-isms PR #553 — BREACH-002 (2026-02-25): Three agent files exceeded the 30,000 char limit (governance-liaison-isms-agent.md at 36,581, ui-builder.md at 30,442, CodexAdvisor-agent.md at 30,177). Violations were caught by CI "Model Scaling Check" workflow, not by CodexAdvisor's pre-handover gate. Root cause: Phase 2 Step 2.5 (size projection) and Phase 3 Step 3.8 (merge gate parity) were not executed because the contract was not read before starting work.

**Permanent Rule**:
Before opening ANY PR that modifies one or more `.github/agents/*.md` files:
1. Run `wc -c .github/agents/*.md` (or equivalent per-file character count for every modified file).
2. Every modified file MUST be at or below 30,000 characters. If any file exceeds 30,000 chars → HALT. Remediate before opening PR.
3. This check is BLOCKING — it is not satisfied by estimation, it requires an actual count.
4. This check is part of Phase 3 Step 3.8 (merge gate parity) AND Phase 4 Step 4.1 (OPOJD gate).
5. Document the exact character count for each modified agent file in the PREHANDOVER proof.

The root cause of PR #553's failure was that the contract was not read before starting (BOOTSTRAP DIRECTIVE violation), which caused Phase 2 Step 2.5 and Phase 3 Step 3.8 to be skipped entirely.

**Check in Phase 3 Step 3.8 (merge gate parity) and Phase 4 Step 4.1 (OPOJD gate)**:
> FAIL-ONLY-ONCE A-013: For every .github/agents/*.md file modified in this PR, run `wc -c <file>` and confirm it is ≤ 30,000 chars. If any file is over → STOP. Remediate. Re-count. Only advance when all modified files are confirmed ≤ 30,000 chars. Document exact counts in PREHANDOVER proof.

**Status**: ACTIVE — enforced every session



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
