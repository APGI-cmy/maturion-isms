# CodexAdvisor Agent Contract Requirements Checklist (CodexAdvisor-agent.md)

**Status**: Reference checklist for contract drafting and validation  
**Purpose**: Exhaustive, source-mapped requirements for a compliant CodexAdvisor (Overseer + Agent Factory) agent file.  
**Primary Sources**: `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`, Living Agent System v6.2.0, `governance/canon/AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md`  
**Derived From**: office-app PR #730, PR #748 gold standard overseer checklist structure
**Authority**: CS2 (Johan Ras)

---

## Category 0 — Identity, Bindings & Scope

- [ ] **Frontmatter YAML**: `agent.id=CodexAdvisor-agent`, `agent.class=overseer`, `version: 6.2.0`
- [ ] **Governance protocol**: `governance.protocol=LIVING_AGENT_SYSTEM`, version 6.2.0 binding
- [ ] **Canon inventory binding**: `governance.canon_inventory` points to `governance/CANON_INVENTORY.json` (not `.governance-pack/`)
- [ ] **Expected artifacts**: List all required governance artifacts including `governance/CANON_INVENTORY.json`
- [ ] **Degraded mode**: `degraded_on_placeholder_hashes: true` with escalation semantics
- [ ] **Execution identity**: Maturion Bot credentials, never_push_main: true, write_via_pr_by_default: true
- [ ] **Scope declaration**: Repository list, agent files location (`.github/agents`), approval_required: ALL_ACTIONS
- [ ] **Merge gate interface**: Three required checks listed (merge-gate/verdict, governance/alignment, stop-and-fix/enforcement)

## Category 1 — Authority & Agent Factory Responsibilities

- [ ] **Agent factory capabilities**: Can create/update agent files with PR_PREFERRED mode
- [ ] **30K character limit**: BLOCKING enforcement for GitHub UI selectability (ref: PartPulse PR #265)
- [ ] **Pre-creation validation**: Character count estimation, <25K target with 20% buffer
- [ ] **Checklist enforcement**: MANDATORY 100% coverage before agent file creation
- [ ] **CS2 authorization**: ONLY CS2 may authorize agent file creation/modification
- [ ] **Checklist locations**: All four checklists mapped to `governance/checklists/` (not `.governance-pack/`)
  - Governance Liaison → `governance/checklists/GOVERNANCE_LIAISON_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
  - Foreman → `governance/checklists/FOREMAN_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
  - Builder → `governance/checklists/BUILDER_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
  - CodexAdvisor (self) → `governance/checklists/CODEX_ADVISOR_AGENT_CONTRACT_REQUIREMENTS_CHECKLIST.md`
- [ ] **Living Agent System v6.2.0 template**: 9 mandatory components enforced
- [ ] **56 requirement mappings**: REQ-CM-001 through REQ-AG-004 coverage required
- [ ] **5 validation hooks**: VH-001 through VH-005 implemented
- [ ] **Size reduction strategies**: Use references not duplication, link to canonical docs
- [ ] **LOCKED section metadata**: Lock ID, Authority, Review frequency, Modification Authority

## Category 2 — Advisory Capabilities

- [ ] **Inventory-first alignment**: CANON_INVENTORY hash-compare for drift detection
- [ ] **Evidence-first guidance**: PREHANDOVER proof, RCA on failure, improvement capture
- [ ] **Merge Gate Interface standardization**: Three-check model enforcement
- [ ] **Branch protection alignment**: Verify protection rules match governance requirements

## Category 3 — Governance Loading & Alignment

- [ ] **CANON_INVENTORY access**: Confirm `governance/CANON_INVENTORY.json` accessible (not `.governance-pack/`)
- [ ] **Hash verification**: No placeholder/truncated hashes in PUBLIC_API artifacts
- [ ] **Degraded mode handling**: STOP and escalate when hashes incomplete
- [ ] **Ripple awareness**: Receive-only from canonical source (APGI-cmy/maturion-foreman-governance)
- [ ] **Drift detection**: Hourly fallback if ripple missed
- [ ] **Sync state tracking**: Evidence paths include `.agent-admin/governance/sync_state.json`

## Category 4 — Session Memory & Evidence

- [ ] **Session memory protocol**: Template and path specified (`.agent-workspace/<agent-id>/memory/session-NNN-YYYYMMDD.md`)
- [ ] **Memory rotation**: When >5 sessions, move oldest to `.archive/`
- [ ] **Personal learning files**: `lessons-learned.md` and `patterns.md` maintained
- [ ] **Escalation inbox**: Protocol for creating blocker files when needed
- [ ] **Evidence persistence**: All memory files committed to git (except ephemeral `working-contract.md` and `environment-health.json`)

## Category 5 — Wake-Up & Initialization

- [ ] **Wake-up protocol**: Reference to `.github/scripts/wake-up-protocol.sh` (if implemented)
- [ ] **Working contract**: Review generated contract before proceeding
- [ ] **Environment health check**: Verify CANON_INVENTORY present and complete
- [ ] **Big picture loading**: Governance state, escalations, memory context

## Category 6 — Escalation & Stop Rules

- [ ] **Escalation authority**: CS2 (Johan Ras) for all constitutional matters
- [ ] **Escalation rules**: Contract/authority changes, canon interpretation, missing artifacts, placeholder hashes
- [ ] **Third-repeat failure**: Escalate catastrophic if alignment fails 3 times
- [ ] **Stop triggers**: Missing expected artifacts → stop_and_escalate

## Category 7 — Prohibitions & Guardrails

- [ ] **No execution without approval**: Explicit approval required for ALL_ACTIONS
- [ ] **No weakening governance**: Cannot reduce governance, tests, or merge gate requirements
- [ ] **No pushing to main**: All changes via PRs
- [ ] **No secrets**: Never commit secrets in commits/issues/PRs
- [ ] **No self-extension**: Cannot extend own scope/authority
- [ ] **No self-modification**: Cannot edit own agent contract except with CS2-approved issue
- [ ] **Consumer mode prohibitions**: No modification of `.governance-pack/` (receive-only), no dispatching ripple events, no creating governance canon

## Category 8 — Consumer Repository Mode

- [ ] **Repository type**: Declared as CONSUMER of canonical governance
- [ ] **Canonical source**: APGI-cmy/maturion-foreman-governance
- [ ] **Checklist location**: `governance/checklists/` (NOT `.governance-pack/checklists/`)
- [ ] **Canon inventory**: `governance/CANON_INVENTORY.json` (NOT `.governance-pack/CANON_INVENTORY.json`)
- [ ] **Ripple model**: Receive-only, cannot dispatch
- [ ] **Governance changes**: Must escalate to canonical source

## Category 9 — Compliance & Validation

- [ ] **Living Agent System version**: v6.2.0 specified
- [ ] **Compliance level**: LIVING_AGENT_SYSTEM_v6_2_0 declared
- [ ] **File size validation**: Pre-creation and post-creation character count checks
- [ ] **Violation action**: FAIL_VALIDATION if 30K limit exceeded
- [ ] **Checklist coverage**: 100% before file creation
- [ ] **Reference canonical docs**: Link to maturion-foreman-office-app PR #748 for full templates

## Category 10 — Metadata & Traceability

- [ ] **Canonical home**: APGI-cmy/maturion-foreman-governance specified
- [ ] **Repository copy type**: "consumer" declared
- [ ] **Authority**: CS2 specified
- [ ] **Last updated**: Date stamp maintained
- [ ] **Version tracking**: Living Agent System v6.2.0 referenced throughout

---

## Validation Instructions

**Before declaring CodexAdvisor agent contract complete:**

1. Load this checklist
2. Verify every item above has corresponding evidence in the agent file
3. Confirm path accuracy: `governance/` NOT `.governance-pack/`
4. Verify character count <25,000 (target) or <30,000 (absolute limit)
5. Cross-reference all canonical documents exist and are accessible
6. Validate CANON_INVENTORY.json exists at `governance/CANON_INVENTORY.json`
7. Confirm all four agent type checklists exist in `governance/checklists/`
8. Document any gaps or deviations with escalation to CS2

**Unchecked items = contract not ready for production use.**

---

**Authority**: Living Agent System v6.2.0 | CS2 Agent File Authority Model  
**Last Updated**: 2026-02-12  
**Validation Status**: Ready for use
