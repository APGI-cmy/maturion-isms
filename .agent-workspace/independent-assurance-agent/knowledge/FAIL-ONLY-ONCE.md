# IAA FAIL-ONLY-ONCE Registry

**Agent**: independent-assurance-agent
**Version**: 1.0.0
**Last Updated**: 2026-02-25
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This registry records governance failures that IAA must never repeat. Each entry captures a
root cause, the permanent rule that prevents recurrence, and the incident reference.

IAA loads this file in Phase 1 Step 1.5 on every session start and applies all rules.

---

## Rules

### A-001 — IAA Invocation Evidence Must Be Present for All Agent Contract PRs

**Triggered by**: maturion-isms#530 — IAA was not invoked for Foreman contract PR #523
**Incident**: PR #523 merged without IAA audit. IAA was not deployed/instantiated and CodexAdvisor
proceeded without it. This created a single point of failure at the most critical governance layer.

**Permanent Rule**:
For any PR classified as AGENT_CONTRACT, IAA must verify that evidence of its own invocation
(audit token or PREHANDOVER proof referencing IAA) is present in the PR artifacts.
If evidence is absent → issue REJECTION-PACKAGE. Do not grant exceptions.

**Check in Phase 3**:
> FAIL-ONLY-ONCE A-001: Locate PREHANDOVER proof or audit token referencing IAA invocation.
> If present: PASS. If absent: FAIL → Finding: "IAA invocation evidence missing from PR artifacts."
> Fix required: "CodexAdvisor must invoke IAA before opening PR and include IAA token reference."

**Status**: ACTIVE — enforced every invocation

---

### A-002 — IAA Is Mandatory for ALL Agent Contract Classes — No Exceptions

**Triggered by**: maturion-isms#531, maturion-isms#528 — CodexAdvisor previously concluded
IAA was "not relevant" to Foreman contract PRs. This conclusion has no basis in canon.

**Incident**: The claim that Foreman (or any agent class) is exempt from IAA oversight was
accepted without challenge. This is a governance violation. Double-layer QA is constitutional:
foreman guards builders, IAA guards all agents including Foreman.

**Permanent Rule**:
IAA invocation is mandatory for ALL agent contract PRs without class-based exceptions.
Classes that produce agent contracts include but are not limited to:
- Foreman class agents
- Builder class agents (api-builder, schema-builder, ui-builder, qa-builder, integration-builder)
- Overseer class agents (CodexAdvisor, maturion-agent)
- Specialist class agents (mat-specialist, pit-specialist, risk-platform-agent, etc.)
- Assurance class agents (IAA itself — but IAA cannot self-review; escalate to CS2)

Any argument that a class is exempt constitutes a governance violation.
If CodexAdvisor or Foreman claims exemption → issue REJECTION-PACKAGE citing this rule.

**Check in Phase 2**:
> FAIL-ONLY-ONCE A-002: If PR involves any agent contract and invoking agent claims class exemption,
> reject the exemption claim. Apply AMBIGUITY RULE: IAA IS required.

**Status**: ACTIVE — enforced every invocation

---

### A-003 — Ambiguity Resolves to Mandatory Invocation

**Derived from**: maturion-isms#528 and the general IAA canon principle — no specific incident number.
The ambiguity rule is a first-principles deduction from the STOP-AND-FIX mandate: if the correct
action is unclear, the safe default must protect governance integrity, not reduce gatekeeping.
It was codified as a standing rule during the PR #523 / #528 / #531 learning chain.

**Permanent Rule**:
If any ambiguity exists about whether IAA invocation is required, IAA IS required.
Ambiguity includes:
- Unclear PR category (could be AGENT_CONTRACT or EXEMPT)
- Mixed artifacts (some triggering, some not)
- Invoking agent's rationale is incomplete or contradictory
- Trigger table file is missing (use this rule as fallback)

Default: MANDATORY INVOCATION when in doubt.

**Status**: ACTIVE — enforced every invocation

---

## Adding New Rules

When a new governance failure pattern is identified during a session (learning_notes in session
memory), IAA adds a new entry to this file following the format above. Each new rule:
- Gets the next sequential ID (A-004, A-005, etc.)
- References the incident that triggered it
- States the permanent rule precisely
- Defines how the rule is checked in the phase steps

All updates to this file must be committed as part of the session bundle for that invocation.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
