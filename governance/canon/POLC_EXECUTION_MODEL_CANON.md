# POLC Execution Model Canon

**Version**: 1.0.0
**Authority**: CS2 — Canon alignment: require explicit execution_model for implementation PRs
**Status**: ACTIVE
**Effective Date**: 2026-05-06
**Owner**: Maturion Engineering Leadership (Johan Ras)
**Precedence**: Subordinate only to GOVERNANCE_PURPOSE_AND_SCOPE.md
**Layer-Down Status**: PUBLIC_API — mandatory propagation to all consumer repositories
**Reference Issue**: APGI-cmy/maturion-foreman-governance — Canon alignment: require explicit execution_model for implementation PRs to remove POLC role ambiguity

---

## 1. Purpose

This canon establishes the **explicit execution model** requirement for any PR that changes implementation files.

Prior to this canon, POLC role classification could be inferred after the fact from secondary signals such as runtime identity, PR author, labels, Foreman session memory, or PREHANDOVER proofs. That approach is insufficient. For implementation PRs, the governed execution model must be declared up front in the PR manifest (`execution_model` field). Gates must not guess who was authorised to implement after code has already changed.

**Problem this canon solves**:

```text
implementation files changed
+ shared Copilot runtime identity
+ no builder-governed declaration
+ no Foreman delegation evidence
= unresolved role  ← structurally ambiguous, gates fail as UNRESOLVED
```

**After this canon**:

```text
Implementation files changed, but execution_model is missing.
→ FAIL immediately — declare builder-governed, foreman-orchestrated, or cs2-hotfix-override.
```

---

## 2. Scope

This requirement applies to **any PR in any governed repository** that changes one or more implementation files.

### 2.1 Implementation file definition

For the purposes of this canon, implementation files are files under paths such as:

- `apps/**`
- `src/**`
- `modules/**`
- `lib/**`
- `packages/**` (application code, not governance packages)
- Any file whose change constitutes functional product code rather than governance-control, documentation, or configuration-only changes.

Governance-control paths (`.github/workflows/`, `.github/scripts/`, `.github/agents/`, `governance/canon/`, `governance/policy/`, `*.agent.md`) are separately governed by the governance ceremony model and are not "implementation files" for the purposes of this canon — though they may co-appear in a PR alongside implementation files.

---

## 3. Allowed Execution Models

Any PR changing implementation files MUST declare one of the following three execution models.

### 3.1 `builder-governed`

Use when the implementation PR is directly owned and executed by an authorised builder agent.

**Required manifest fields**:

```json
{
  "execution_model": "builder-governed",
  "implementing_agent": "<builder-agent-id>"
}
```

**Rules**:

- Implementation files are allowed.
- Foreman session memory is **not** required.
- PREHANDOVER / IAA / ECAP ceremony is **not** required unless separately triggered by governance-control path changes.
- Foreman orchestration artifacts are **not** required.
- If Foreman artifacts are present, the PR should either explain why, or use `foreman-orchestrated` instead.

**Rationale**: A builder agent with a valid appointment to the PR owns the implementation directly. The appointment itself is the governance control — no Foreman delegation chain is required.

### 3.2 `foreman-orchestrated`

Use when Foreman scopes and supervises the work but delegates implementation to a builder.

**Required manifest fields**:

```json
{
  "execution_model": "foreman-orchestrated",
  "orchestrating_agent": "foreman-v2",
  "implementing_agent": "<builder-agent-id>"
}
```

**Required delegation evidence**: One of the following must exist:

```yaml
agents_delegated_to:
  - <builder-agent-id>
```

in Foreman session memory (`.agent-workspace/foreman-v2/memory/session-*.md`) or another canon-approved delegation evidence artifact.

**Rules**:

- Foreman MUST NOT implement production code directly — this is the POLC invariant.
- Implementation files are allowed only if valid builder delegation evidence exists.
- The delegated builder named in `agents_delegated_to` SHOULD match `implementing_agent`.
- Missing delegation evidence MUST fail POLC / merge gates.
- If Foreman session memory is absent and no other delegation evidence exists, the gate MUST fail.

**Rationale**: Foreman-orchestrated work requires an auditable delegation chain. Without it, Foreman's POLC boundary cannot be verified.

### 3.3 `cs2-hotfix-override`

Use only for scoped emergency exceptions explicitly approved by CS2.

**Required manifest fields**:

```json
{
  "execution_model": "cs2-hotfix-override",
  "cs2_justification": "<explicit CS2 justification text or issue/PR reference>"
}
```

**Rules**:

- Requires explicit CS2 sign-off via an approved label, issue reference, or canon-approved approval mechanism.
- Scoped to the current PR only — does not set precedent for future PRs.
- MUST NOT become a general bypass mechanism.
- MUST be rare and fully auditable.
- If the `cs2_justification` field is empty or a placeholder, the gate MUST fail.

**Rationale**: Emergency cases exist where the normal builder/Foreman chain cannot operate. These must be explicitly scoped and approved, not inferred.

---

## 4. Gate Resolution Order

Merge gates that evaluate implementation PRs MUST resolve role authority in this order:

1. Read the active PR manifest (`execution_model` field from `.admin/pr.json` or equivalent governing artifact).
2. If implementation files changed and `execution_model` is **missing** → FAIL immediately with:
   ```
   Implementation files changed, but execution_model is missing.
   Declare builder-governed, foreman-orchestrated, or cs2-hotfix-override.
   ```
3. If `execution_model = builder-governed` → require `implementing_agent`; allow implementation files without Foreman delegation evidence.
4. If `execution_model = foreman-orchestrated` → require `orchestrating_agent`, `implementing_agent`, and valid delegation evidence (`agents_delegated_to` in session memory or approved equivalent). Fail if delegation evidence is absent.
5. If `execution_model = cs2-hotfix-override` → require non-empty `cs2_justification`; require explicit CS2 sign-off.
6. Treat runtime identity (e.g., shared Copilot identity) and PR labels as **secondary compatibility signals only** — not as the source of truth for execution model.

---

## 5. Non-Goals

This canon intentionally does NOT:

- Reintroduce heavy PREHANDOVER / LUIEP ceremony for ordinary product-fix PRs.
- Weaken POLC role separation.
- MUST NOT allow Foreman to implement production code directly.
- Make labels the primary role authority.
- Rely on shared Copilot runtime identity to classify governed role.

---

## 6. Impact on Existing Governance

### 6.1 MMM Simple PR Admin Model

The `.admin/pr.json` schema defined in `MMM_SIMPLE_PR_ADMIN_MODEL.md` MUST be extended to include the `execution_model` field (and its associated required companion fields) for any PR that changes implementation files.

### 6.2 POLC Boundary Validation

The `foreman-implementation-check` and `builder-involvement-check` gates in consumer repositories MUST incorporate execution model resolution as the primary classification step rather than relying on secondary signals.

### 6.3 Role Inference Prohibition

Any agent contract, CI script, or gate that currently classifies governed role from:

- shared Copilot runtime identity,
- PR author alone,
- labels such as `copilot-builder-role`,
- presence/absence of Foreman session memory, or
- presence/absence of PREHANDOVER proof

MUST be updated to use `execution_model` as the primary signal. Secondary signals MAY remain as compatibility checks but MUST NOT be the sole classification mechanism.

---

## 7. Layer-Down Requirement

This canon MUST be layered down into all consumer repositories. At minimum, consumer repositories must:

1. Extend their PR manifest schema to support `execution_model`, `implementing_agent`, `orchestrating_agent`, and `cs2_justification` fields.
2. Update their POLC Boundary Validation gate (or equivalent) to enforce execution model resolution per §4 above.
3. Update `builder-involvement-check` and `foreman-implementation-check` validators to use `execution_model` as primary signal.
4. Review any agent contract that performs role inference from secondary signals and remove or demote that inference logic.

For `APGI-cmy/maturion-isms`, the layer-down must specifically review and update:

- POLC Boundary Validation
- `builder-involvement-check`
- `foreman-implementation-check`
- MMM Simple PR Admin Model validator (`.github/scripts/validate-simple-pr-admin.sh`)
- Handover-claim gate, if it references role authority
- Any agent contract that currently allows role inference from runtime identity, labels, or optional Foreman memory

---

## 8. Acceptance Criteria

- [ ] Governance canon defines explicit execution model requirements for implementation PRs.
- [ ] Canon distinguishes `builder-governed`, `foreman-orchestrated`, and `cs2-hotfix-override` semantics.
- [ ] Canon states that Foreman must not implement production code directly.
- [ ] Canon states that Foreman-orchestrated implementation requires builder delegation evidence.
- [ ] Canon states that builder-governed implementation does not require Foreman artifacts.
- [ ] Canon states that CS2 hotfix override is scoped, explicit, and auditable.
- [ ] Layer-down instruction requires consumer repos to review/update merge gates.
- [ ] `maturion-isms` layer-down explicitly covers POLC Boundary Validation, builder involvement, and Foreman implementation gates.
- [ ] Product-fix PRs remain lightweight unless governance-control path changes require heavier assurance.

---

*Authority: CS2 | Effective: 2026-05-06*
