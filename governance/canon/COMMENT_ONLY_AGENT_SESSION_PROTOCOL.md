# COMMENT-ONLY AGENT SESSION PROTOCOL

## Status
**Type**: Operational Governance Protocol  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-04-08  
**Owner**: Governance Administrator  
**Precedence**: Subordinate to CONSTITUTION.md; Extends GOVERNANCE_TOKEN_USAGE_REQUIREMENTS.md  
**Layer-Down Status**: PUBLIC_API — Applicable to consumer repositories using Copilot or agent-assisted PR sessions in non-mutating delivery mode  
**Scope**: Copilot / agent-assisted PR sessions operating in non-mutating delivery mode  
**Tier**: Operational governance protocol (not a broad constitutional rule)

---

## 1. Purpose

This protocol canonises the **comment-only / non-mutating agent session mode** as a first-class governance concept.

Governance canon already defines token requirements for write-capable automation (see §8 — Related Canon). However, a distinct operating mode exists in live consumer repos where:

- Copilot or an equivalent agent is **not supposed to push**
- The push restriction is **intentional**
- The desired delivery mode is **OPOJD via PR-thread output / artifacts**
- Workflow setup can still *look* partially write-capable (for example via fallback token expressions), which causes session derailment, non-actionable Git access-denied noise, and interrupted delivery instead of deterministic comment-only completion

This protocol closes the governance gap by requiring that **session mode is explicit, deterministic, and non-ambiguous**.

---

## 2. Session Mode Declaration

### REQ-COS-001: Mandatory Session Mode Declaration

**Statement**: Every agent-assisted workflow or session MUST explicitly declare one of the following session modes before any write-capable or non-write-capable logic executes:

| Mode Token | Description |
|------------|-------------|
| `COMMENT_ONLY` | Push is intentionally unavailable; deliverables are emitted via non-mutating output channels |
| `MUTATION_CAPABLE` | Write operations are permitted; existing token canon applies |

**Severity**: HIGH  
**Enforcement**: Merge gate advisory; operational gate for consumer repos  
**Rationale**: Ambiguous session mode is the root cause of wasted runtime on non-actionable push/token reasoning and of interrupted OPOJD delivery.

---

## 3. COMMENT_ONLY Mode

### REQ-COS-002: Push Unavailability is Intentional

**Statement**: In `COMMENT_ONLY` mode, push is *intentionally* unavailable. The agent MUST treat this as a design invariant, not as an error to recover from.  
**Severity**: HIGH  
**Enforcement**: Operational; push-intercept workflows in consumer repos are the safety-net, not the primary control

### REQ-COS-003: No Push / Commit Recovery Logic

**Statement**: In `COMMENT_ONLY` mode, the agent MUST NOT attempt push recovery, commit recovery, token-fallback reasoning, or any logic that assumes write access may become available during the session.  
**Severity**: HIGH  
**Enforcement**: Merge gate advisory  
**Rationale**: Recovery attempts on an intentionally restricted channel waste runtime and derail OPOJD delivery

### REQ-COS-004: No Token / 403 Reasoning

**Statement**: In `COMMENT_ONLY` mode, the agent MUST NOT spend reasoning cycles on token failures, 403 responses, or Git credential errors. These errors are expected and MUST be ignored.  
**Severity**: HIGH  
**Enforcement**: Operational

### REQ-COS-005: Non-Mutating Output Channels

**Statement**: In `COMMENT_ONLY` mode, all deliverables MUST be emitted via one or more of the following explicitly declared non-mutating output channels:

- PR comments
- Issue comments
- Workflow job summaries
- Uploaded artifacts
- Another output channel explicitly declared in the session preflight

**Severity**: HIGH  
**Enforcement**: Merge gate advisory

### REQ-COS-006: Session Success Definition

**Statement**: In `COMMENT_ONLY` mode, the session MUST be considered successful when output is delivered in the declared non-mutating channel. Failure to push MUST NOT cause the session to be classified as failed.  
**Severity**: HIGH  
**Enforcement**: Operational

---

## 4. MUTATION_CAPABLE Mode

### REQ-COS-007: Existing Token Canon Applies

**Statement**: In `MUTATION_CAPABLE` mode, all requirements in `GOVERNANCE_TOKEN_USAGE_REQUIREMENTS.md` continue to apply without exception:

- `MATURION_BOT_TOKEN` is mandatory for write operations (REQ-TU-001)
- `github.token` / `secrets.GITHUB_TOKEN` are prohibited for mutation steps (REQ-TU-002)
- Token identity evidence step is required before any write operation (REQ-TU-003)
- Explicit `permissions:` declaration is required for write jobs (REQ-TU-004)

**Severity**: CRITICAL  
**Enforcement**: Merge gate block (inherited from GOVERNANCE_TOKEN_USAGE_REQUIREMENTS.md)

### REQ-COS-008: Missing Write Credentials Must Fail Fast

**Statement**: In `MUTATION_CAPABLE` mode, if `MATURION_BOT_TOKEN` is absent or unavailable, the job MUST fail immediately with a clear error message. Token fallback to `github.token` or `secrets.GITHUB_TOKEN` in write-capable paths is PROHIBITED.  
**Severity**: CRITICAL  
**Enforcement**: Merge gate block

---

## 5. Hybrid Ambiguity Prohibited

### REQ-COS-009: No Write-Capable Presentation in Comment-Only Sessions

**Statement**: A workflow or session MUST NOT present itself as write-capable while policy expects comment-only delivery. Specifically:

- A session declared (or intended) as `COMMENT_ONLY` MUST NOT include token provisioning steps that imply write access is expected
- A `COMMENT_ONLY` session MUST NOT use fallback expressions such as `secrets.MATURION_BOT_TOKEN || github.token` in any step, whether write-capable or not
- A `COMMENT_ONLY` session MUST NOT use `actions/checkout` with a write-capable `token:` parameter in write step positions

**Severity**: HIGH  
**Enforcement**: Merge gate advisory; lint check recommended (see §6)

### REQ-COS-010: No Fallback Expressions in Declared Comment-Only Flows

**Statement**: The pattern `secrets.MATURION_BOT_TOKEN || github.token` (or equivalent fallback chains) is PROHIBITED in any declared `COMMENT_ONLY` session. Such expressions introduce ambiguity about whether the session is write-capable and force agents into non-actionable token reasoning.  
**Severity**: HIGH  
**Enforcement**: Merge gate advisory

---

## 6. Enforcement / Lint Recommendation

This section documents the **follow-up enforcement recommendation** for consumer repos and for a future governance gate.

### 6.1 Recommended Lint Check

Consumer repos SHOULD implement a lint check on `.github/workflows/` files that:

1. Detects any workflow that sets session mode to `COMMENT_ONLY` (via a comment `# SESSION_MODE: COMMENT_ONLY` or equivalent declaration)
2. Scans the workflow for fallback token expressions matching the pattern `\|\|\s*(github\.token|secrets\.GITHUB_TOKEN)`
3. Fails the lint check if a fallback token expression is found in a declared `COMMENT_ONLY` workflow

**Recommended script location**: `.github/scripts/validate-session-mode.sh`  
**Recommended gate name**: `governance/session-mode-check`

### 6.2 Push-Intercept Safety Net

Consumer repos MAY keep push-intercept workflows as safety nets (e.g., a workflow that detects and cancels push attempts). However:

- The push-intercept MUST be treated as a safety net only, not as the primary mode control
- The primary control is the explicit session mode declaration in the setup/preflight step
- Relying on push-intercept recovery instead of upfront declaration is a hybrid-ambiguity anti-pattern

### 6.3 Future Gate Promotion

This enforcement recommendation SHOULD be promoted to a formal merge gate requirement (`governance/session-mode-check`) in a future governance wave once consumer repo adoption of explicit session mode declarations is confirmed. The promotion MUST follow the STOP_AND_FIX_DOCTRINE.md gate promotion process.

---

## 7. Consumer Repository Guidance

Consumer repositories using Copilot or similar agent-assisted PR flows MUST:

1. **Predeclare session mode** in the workflow/session preflight step (REQ-COS-001)
2. **Use `COMMENT_ONLY` mode** when the intended delivery mode is comment/artifact-only and push is intentionally unavailable
3. **Not attempt push recovery** in `COMMENT_ONLY` sessions (REQ-COS-003, REQ-COS-004)
4. **Remove fallback token expressions** from `COMMENT_ONLY` workflows (REQ-COS-010)
5. **Keep push-intercept workflows** as safety nets (§6.2), but not as the primary control
6. **Ensure the primary session design** prevents push attempts up front rather than recovering after failure

### Migration Steps for Existing Copilot Workflows

Consumer repos with existing Copilot agent-assisted PR workflows that currently use push-intercept-only patterns SHOULD migrate as follows:

| Step | Action |
|------|--------|
| 1 | Add a comment or env var to the workflow declaring `SESSION_MODE: COMMENT_ONLY` at the top of the job |
| 2 | Audit the workflow for fallback token expressions (`\|\| github.token`, `\|\| secrets.GITHUB_TOKEN`) and remove them |
| 3 | Audit `actions/checkout` `token:` parameters — remove write-capable token from `COMMENT_ONLY` session checkouts |
| 4 | Confirm the push-intercept workflow remains as a safety net |
| 5 | Test that comment/artifact delivery still succeeds after the above changes |
| 6 | Update `GOVERNANCE_ALIGNMENT.md` in the consumer repo to reference this protocol |

**Migration Required**: NO (no existing workflow is broken by this canon; this is additive governance)  
**Migration Guidance**: Existing consumer repos are encouraged to adopt explicit session mode declarations; the lint check in §6 is advisory until promoted to a gate.

---

## 8. Related Canon

- `GOVERNANCE_TOKEN_USAGE_REQUIREMENTS.md` — Token identity requirements for write-capable (MUTATION_CAPABLE) sessions; REQ-TU-001 through REQ-TU-005
- `MATURION_BOT_EXECUTION_IDENTITY_MODEL.md` — Execution identity model and token rotation
- `STOP_AND_FIX_DOCTRINE.md` — Blocking gate philosophy for future enforcement promotion
- `ZERO_TOLERANCE_FINDING_PROTOCOL.md` — All findings are blocking once gate is promoted
- `AGENT_ENVIRONMENTAL_RESPONSIBILITY_DOCTRINE.md` — Agent responsibility for session setup
- `BOOTSTRAP_EXECUTION_LEARNINGS.md` — Execution learnings including fallback token root causes
- `GOVERNANCE_LAYERDOWN_CONTRACT.md` — Layer-down execution protocol for consumer repos

---

**Authority**: CS2 (Johan Ras) | Contract v2.0.0 | File: governance/canon/COMMENT_ONLY_AGENT_SESSION_PROTOCOL.md
