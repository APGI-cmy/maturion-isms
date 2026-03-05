# IAA Agent Contract Audit Standard

**Version**: 1.0.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Tier**: Tier 2 — IAA Standing Knowledge
**Date**: 2026-03-05
**Applies to**: All agent contract PRs reviewed by independent-assurance-agent
**References**: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` §Agent Contract Integrity Checks, AGCFPP-001, `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## 1. Purpose

This document defines the IAA's evaluation standard for agent contract PRs. It is loaded as Tier 2 knowledge at session start for any invocation where the PR scope includes `.github/agents/*.md` files.

This standard answers three questions:

1. **What must always be intact?** — Non-negotiable protected components that cannot be removed, weakened, or changed without CS2 written authorisation regardless of what else the PR changes.
2. **What is pre-approved?** — Changes that CS2 pre-authorises by approving the upstream governance change (layer-down scope). IAA verifies alignment, not authorship, for these items.
3. **What must IAA actively verify?** — Substance checks IAA must independently evaluate on every AGENT_CONTRACT PR.

---

## 2. Load Trigger

This file MUST be loaded by IAA at Step 2.4 when PR category is `AGENT_CONTRACT`.

When loaded, IAA declares:

> "IAA_AGENT_CONTRACT_AUDIT_STANDARD v1.0.0 loaded.
> Applying pre-approval doctrine and protected-component verification to this AGENT_CONTRACT invocation."

---

## 3. Required Protected Components

The following components must be present, non-empty, and non-weakened in every agent contract file. Their **absence or weakening is an immediate REJECTION-PACKAGE** regardless of any other check outcome.

| Component | Requirement | CORE/OVL Check |
|-----------|-------------|----------------|
| `agent.id` | Present, non-empty, matches filename | CORE-001 |
| `agent.class` | Present, valid class value | CORE-001 |
| `agent.version` | Matches LIVING_AGENT_SYSTEM version in effect | CORE-002 |
| `agent.contract_version` | Present, semver, non-zero | CORE-003 |
| `identity.role` | Present, non-empty, non-stub | CORE-004 |
| `identity.mission` | Present, substantive (>20 chars) | CORE-004 |
| `identity.class_boundary` | Present, substantive (>20 chars) | CORE-004 |
| `governance.protocol` | Present, non-placeholder | CORE-005 |
| `governance.canon_inventory` | Points to valid `governance/CANON_INVENTORY.json` | CORE-005, CORE-006 |
| Self-modification prohibition | A `SELF-MOD-*` prohibition with `enforcement: CONSTITUTIONAL` | CORE-012 |
| Prohibitions block | At least one prohibition with `enforcement: CONSTITUTIONAL` | CORE-008 |
| Merge gate interface | `merge_gate_interface.required_checks` non-empty array; `parity_enforcement: BLOCKING` | CORE-009 |
| Tier 2 knowledge reference | `tier2_knowledge.index` path correct; `index.md` exists at path | CORE-010 |
| Four-phase structure | All four phases present with substantive content | CORE-011 |
| Secret field naming | Uses `secret_env_var:`, never `secret:` in execution_identity blocks | CORE-022 |
| Contract character count | Contract body ≤ 30,000 characters (OVL-AC-ADM-004 / OVL-AC-011) | OVL-AC-ADM-004 |

**Hardening rule**: If any protected component is present in the current `main` branch contract and is absent or weakened in the PR diff → REJECTION-PACKAGE. IAA does not accept any argument that the removal was intentional without explicit CS2 written authorisation in the PREHANDOVER proof.

---

## 4. Pre-Approval Doctrine for Layer-Down Changes

When a governance layer-down is the initiating event for an agent contract PR (i.e., the PR propagates canonical changes from `maturion-foreman-governance`), the following applies:

### 4.1 What Is Pre-Approved

CS2 approving the upstream governance change pre-authorises the following within the scope of that change:

- Structural changes explicitly listed in the layer-down payload (e.g., adding a new YAML block, migrating a Phase body to Tier 2 reference, updating a version field).
- Changes that bring the consumer contract into alignment with the canonical version in `maturion-foreman-governance`.
- Version bumps to `agent.contract_version` that directly correspond to the layer-down delta.

**IAA verification for pre-approved items**: IAA verifies **alignment** (does the change match what the layer-down specifies?) not **authorship** (did the right agent make the change?). Pre-approved items still require CORE check pass.

### 4.2 What Is NOT Pre-Approved

The following are **never** pre-approved regardless of layer-down scope:

- Removal or weakening of any protected component listed in Section 3.
- Constitutional changes to the self-modification prohibition or authority chain.
- Changes that exceed the declared layer-down scope.
- Any change to `.github/agents/*.md` files made by an agent other than CodexAdvisor with explicit CS2 authorisation (AGCFPP-001 §1).

### 4.3 Verification Step

When reviewing a layer-down AGENT_CONTRACT PR, IAA must:

1. Locate the originating layer-down payload (`.agent-admin/ripple/layer-down-received-*.json` or ripple event reference in PREHANDOVER proof).
2. Confirm the PR diff does not exceed declared layer-down scope.
3. Confirm all protected components remain intact after the changes.
4. If scope is exceeded → REJECTION-PACKAGE citing specific out-of-scope changes.

---

## 5. Mandatory Audit Steps for AGENT_CONTRACT PRs

IAA executes the following steps on every AGENT_CONTRACT PR, in order. No step may be skipped.

### Step AC-01 — AGCFPP-001 Authorisation Verification

Verify that the agent producing the PR is CodexAdvisor-agent with documented CS2 authorisation, per AGCFPP-001 §2.

**Evidence required in PREHANDOVER proof**:
- Producing agent declared as `CodexAdvisor-agent`
- CS2 authorisation reference (issue number or explicit CS2 approval statement)

**On fail**: REJECTION-PACKAGE citing AGCFPP-001 §1 violation. The PR must not merge without CS2 + CodexAdvisor pathway documented.

### Step AC-02 — Protected Components Sweep

Apply every row in Section 3 (Required Protected Components) as an independent check.

For each component:
- Locate the component in the PR diff and in the current branch state
- Confirm it is present, non-empty, and not weakened relative to the version on `main`

**On fail**: REJECTION-PACKAGE with specific component(s) cited.

### Step AC-03 — Pre-Approval Scope Verification (Layer-Down PRs Only)

If this PR is triggered by a governance layer-down:
- Execute Section 4.3 verification steps
- Confirm PR diff is within declared layer-down scope
- Confirm pre-approved changes align with layer-down payload

**On fail**: REJECTION-PACKAGE citing specific out-of-scope lines in diff.

### Step AC-04 — Tier Placement Discipline Verification

Verify that the agent contract correctly respects the THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE:

| Content Type | Correct Tier | Violation |
|--------------|-------------|-----------|
| Constitutional rules, identity, authority | Tier 1 (contract body) | Moving to Tier 2 = violation |
| Operational scripts, checklists, templates | Tier 2 (`.agent-workspace/*/knowledge/`) | Embedding in contract = violation |
| Session state, learning, breach log | Tier 3 (`.agent-workspace/*/memory/`) | Embedding in contract = violation |

**IAA checks**: Does the contract body contain inline scripts, full checklists, or raw templates that belong in Tier 2? Does the contract reference Tier 2 files that do not exist? Either = REJECTION-PACKAGE.

### Step AC-05 — Cross-Agent Ripple Assessment (OVL-AC-012)

Assess whether this agent contract change requires corresponding updates in other contracts or knowledge files.

This is a standing requirement per FAIL-ONLY-ONCE A-023.

IAA must confirm the PREHANDOVER proof contains a `## Ripple Assessment` section or equivalent with one of:
- An explicit `NO DOWNSTREAM RIPPLE REQUIRED` verdict with justification, OR
- A list of downstream files that were updated as part of this PR

**On fail**: REJECTION-PACKAGE citing missing OVL-AC-012 / A-023 ripple assessment.

### Step AC-06 — Core Invariants (CORE-001 through CORE-022)

Execute all applicable CORE checks from `iaa-core-invariants-checklist.md` for the `AGENT_CONTRACT` applies-to column.

Required CORE checks for AGENT_CONTRACT: CORE-001 through CORE-022 (all that are marked `AGENT_CONTRACT` or `ALL`).

### Step AC-07 — AGENT_CONTRACT Overlay (OVL-AC-001 through OVL-AC-ADM-004)

Execute all checks from `iaa-category-overlays.md` AGENT_CONTRACT section:

- OVL-AC-001: Strategy alignment
- OVL-AC-002: No contradictions
- OVL-AC-003: Authority boundaries correct
- OVL-AC-004: Delegation safety
- OVL-AC-005: Four-phase structure present
- OVL-AC-006: Self-modification prohibition present
- OVL-AC-007: Ripple/cross-agent impact
- OVL-AC-ADM-001: PREHANDOVER proof exists
- OVL-AC-ADM-002: Session memory exists
- OVL-AC-ADM-003: Tier 2 stub present
- OVL-AC-ADM-004: Character count within limit

---

## 6. Tier Placement Discipline

Reference: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

### 6.1 What Belongs in the Contract (Tier 1)

- Agent identity (id, class, version, role, mission, class_boundary)
- Constitutional authority chain
- Prohibitions block including SELF-MOD lock
- Merge gate interface
- Tier 2 knowledge index reference
- Phase headings and mandatory output declarations (not inline content)
- YAML frontmatter in its entirety

### 6.2 What Belongs in Tier 2 Knowledge

- Operational scripts referenced by Phase steps
- Full checklists (e.g., CORE invariants, overlay checks)
- Session templates
- Breach registries (FAIL-ONLY-ONCE)
- Domain-specific operational standards (including this file)

### 6.3 Contract Bloat Detection

If the contract body exceeds 30,000 characters, IAA must:
1. Flag the bloat (OVL-AC-ADM-004)
2. Identify which Phase content contains inline Tier 2 material that should be migrated
3. Issue REJECTION-PACKAGE with specific migration targets

---

## 7. Decision Matrix

### 7.1 Verdict Criteria

| Condition | Verdict |
|-----------|---------|
| All steps AC-01 through AC-07 PASS, all CORE and overlay checks PASS, merge gate parity PASS | ASSURANCE-TOKEN |
| Any protected component missing or weakened | REJECTION-PACKAGE (immediate, no further review) |
| AGCFPP-001 pathway not documented | REJECTION-PACKAGE (immediate) |
| Any CORE check FAIL | REJECTION-PACKAGE |
| Any overlay check FAIL | REJECTION-PACKAGE |
| Layer-down scope exceeded | REJECTION-PACKAGE |
| Tier placement violation (Tier 2 content inline) | REJECTION-PACKAGE |
| Ripple assessment missing (OVL-AC-012 / A-023) | REJECTION-PACKAGE |
| Evidence artifacts missing or placeholder | REJECTION-PACKAGE |

### 7.2 Zero Partial Pass Rule

Per CORE-020 and FAIL-ONLY-ONCE A-021: There is no partial ASSURANCE-TOKEN. A PR with any REJECTION-PACKAGE finding cannot merge. The IAA issues exactly one of:

- `ASSURANCE-TOKEN` — merge permitted (subject to CS2 approval)
- `REJECTION-PACKAGE` — merge blocked, STOP-AND-FIX required

No intermediate verdict is valid.

### 7.3 Re-Invocation

After a REJECTION-PACKAGE, the producing agent must:
1. Address every cited finding
2. Commit the fix (A-021 — commit before re-invocation)
3. Invoke IAA again with a fresh PREHANDOVER proof for the re-invocation

IAA re-invocation starts from Step AC-01. Prior REJECTION-PACKAGE is documented via correction addendum (A-030) to satisfy CORE-019 on subsequent invocations.

---

## 8. Relationship to Existing Checks

This standard is **additive**. It does not replace CORE checks or AGENT_CONTRACT overlay checks. The relationship is:

```
CORE checks (iaa-core-invariants-checklist.md)       → Ceremony and existence baseline
AGENT_CONTRACT overlay (iaa-category-overlays.md)    → Substance verification
IAA_AGENT_CONTRACT_AUDIT_STANDARD.md (this file)     → Organising framework + pre-approval doctrine
                                                         + protected components checklist
                                                         + tier placement discipline
                                                         + decision matrix
```

All three must be applied on every AGENT_CONTRACT PR.

---

## 9. Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0.0 | 2026-03-05 | governance-liaison-isms (CS2 directive) | Initial version — codifies mandatory audit steps, pre-approval doctrine, protected components, tier discipline, decision matrix per AGCFPP-001 |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Policy Refs**: AGCFPP-001, INDEPENDENT_ASSURANCE_AGENT_CANON.md §Agent Contract Integrity Checks
**Living Agent System**: v6.2.0
