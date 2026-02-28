# IAA Core Invariants Checklist

**Agent**: independent-assurance-agent
**Version**: 2.0.0
**Status**: ACTIVE
**Last Updated**: 2026-02-28
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This checklist defines the core checks applied to EVERY IAA invocation regardless of PR category.
It is the baseline gate that all PRs must pass before category-specific overlay checks apply.

---

## Core Invariants

All checks below are applied on every qualifying PR invocation.

| Check ID | Check Name | Description | Applies To | Failure Action |
|----------|-----------|-------------|------------|----------------|
| CORE-001 | YAML frontmatter valid | Agent contract YAML is parseable; all required fields (agent.id, agent.class, agent.version, identity.role, identity.mission, identity.class_boundary, governance.protocol, governance.canon_inventory) present and non-empty | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-002 | Agent version correct | agent.version matches the LIVING_AGENT_SYSTEM.md version in effect at this contract revision | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-003 | Contract version present | agent.contract_version is present, non-zero, and in semver format | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-004 | Identity block complete | identity.role, identity.mission, identity.class_boundary all present and non-empty; class_boundary must be longer than 20 characters (not a stub) | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-005 | Governance block present | governance.protocol, governance.version, governance.canon_inventory all present; no placeholder values | ALL | REJECTION-PACKAGE |
| CORE-006 | CANON_INVENTORY alignment | All governance artifacts listed in expected_artifacts exist in governance/CANON_INVENTORY.json with non-null, non-placeholder SHA256 hashes | ALL | REJECTION-PACKAGE |
| CORE-007 | No placeholder content | No stub, TODO, FIXME, or placeholder values in any delivered artifact. Search for: "STUB", "TODO:", "FIXME:", "placeholder", "to be populated", "TBD" | ALL | REJECTION-PACKAGE |
| CORE-008 | Prohibitions block present | At least one prohibition entry present with id, rule, and enforcement fields; at least one prohibition has enforcement: CONSTITUTIONAL | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-009 | Merge gate interface present | merge_gate_interface.required_checks is a non-empty array; parity_required: true; parity_enforcement: BLOCKING | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-010 | Tier 2 knowledge indexed | tier2_knowledge.index path is correct; the referenced index.md exists at the stated path in the repository | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-011 | Four-phase structure present | Contract body contains all four phases (Phase 1 IDENTITY & PREFLIGHT, Phase 2 ALIGNMENT, Phase 3 WORK, Phase 4 HANDOVER) with mandatory evidence output declarations | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-012 | Self-modification lock present | A prohibition with id matching SELF-MOD-* and enforcement: CONSTITUTIONAL is present | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof or IAA token reference present in PR artifacts (FAIL-ONLY-ONCE A-001). For AGENT_CONTRACT PRs: explicit IAA audit token required, not just a reference | ALL | REJECTION-PACKAGE |
| CORE-014 | No class exemption claim | Invoking agent has not claimed class exemption from IAA (FAIL-ONLY-ONCE A-002). Foreman, Builder, Overseer, Specialist — all subject to IAA | ALL | REJECTION-PACKAGE |
| CORE-015 | Session memory present | Session memory artifact included in PR bundle (file path present in PREHANDOVER proof or PR artifact manifest) | ALL | REJECTION-PACKAGE |
| CORE-016 | IAA tool call evidenced | PREHANDOVER proof must contain a `## IAA Agent Response (verbatim)` section with actual IAA agent output. See **CORE-016 Detail** below. | ALL | REJECTION-PACKAGE |
| CORE-017 | No .github/agents/ modifications by unauthorized agent | PR diff must not contain modifications to `.github/agents/` files unless producing agent is CodexAdvisor-agent AND CS2 authorization is documented in PREHANDOVER proof (FAIL-ONLY-ONCE A-005 / A-013) | ALL | REJECTION-PACKAGE |

---

## Applying the Checklist

For each check:
1. Locate the relevant artifact(s) in the PR bundle
2. Apply the check description as stated
3. Record PASS or FAIL with specific evidence
4. Any FAIL → REJECTION-PACKAGE (no partial passes)

**AMBIGUITY RULE**: If uncertain whether a check applies to this PR → apply it. The cost of a false REJECTION-PACKAGE is a fix request. The cost of a missed REJECTION-PACKAGE is a governance breach.

---

## CORE-016 Detail — IAA Tool Call Evidence

CORE-016 applies to every PR. FAIL if:
- The `iaa_audit_token` field value matches the pattern `PHASE_A_ADVISORY — \d{4}-\d{2}-\d{2}` exactly (a self-certified advisory date string), AND
- The `## IAA Agent Response (verbatim)` section is absent from the PREHANDOVER proof, OR
- The `## IAA Agent Response (verbatim)` section exists but contains only the same bare date string and no real IAA output block (`ASSURANCE-TOKEN` / `REJECTION-PACKAGE` header).

PASS if:
- `iaa_audit_token` contains a real IAA session token (`IAA-session-NNN-YYYYMMDD-PASS` format), AND
- `## IAA Agent Response (verbatim)` section contains the verbatim IAA agent output block.

**Note**: PHASE_A_ADVISORY is a legitimate outcome — but only when the IAA tool was actually called and the IAA agent itself issued the advisory. A bare date string without IAA session output is always a PHASE_A_ADVISORY FABRICATION breach (FAIL-ONLY-ONCE A-014 / INC-IAA-SKIP-001).

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial STUB (placeholder from canon) |
| 2.0.0 | 2026-02-28 | Fully populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md; CORE-016 added (A-014 IAA tool call evidence); CORE-017 added (A-005/A-013 agent file immutability); STUB status removed |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
