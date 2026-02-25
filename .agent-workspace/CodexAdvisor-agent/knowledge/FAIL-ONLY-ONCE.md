# CodexAdvisor — FAIL-ONLY-ONCE Registry

**Agent**: CodexAdvisor-agent
**Version**: 1.0.0
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
