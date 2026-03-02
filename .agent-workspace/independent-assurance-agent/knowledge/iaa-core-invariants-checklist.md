# IAA Core Invariants Checklist

**Agent**: independent-assurance-agent
**Version**: 2.2.0
**Status**: ACTIVE
**Last Updated**: 2026-03-02
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
| CORE-016 | IAA tool call evidenced | PREHANDOVER proof must contain a `## IAA Agent Response (verbatim)` section with actual IAA agent output. See **CORE-016 Detail** below. `iaa_audit_token: PENDING` with section present = PASS (ceremony in progress) — not a fabrication failure. | ALL | REJECTION-PACKAGE |
| CORE-017 | No .github/agents/ modifications by unauthorized agent | PR diff must not contain modifications to `.github/agents/` files unless producing agent is CodexAdvisor-agent AND CS2 authorization is documented in PREHANDOVER proof (FAIL-ONLY-ONCE A-005 / A-013) | ALL | REJECTION-PACKAGE |
| CORE-018 | Complete evidence artifact sweep | BEFORE applying any overlay: verify ALL of the following are present and non-empty: (a) PREHANDOVER proof file on branch, (b) session memory file on branch, (c) `iaa_audit_token` field non-empty and non-placeholder, (d) `## IAA Agent Response (verbatim)` section present in PREHANDOVER proof. Any absent/empty/placeholder item = immediate REJECTION-PACKAGE before overlay checks proceed. | ALL | REJECTION-PACKAGE |
| CORE-019 | IAA token cross-verification | When `iaa_audit_token` is not PENDING: (a) verify token format matches `IAA-session-NNN-YYYYMMDD-PASS`, (b) open the referenced IAA session memory file, (c) verify `pr_reviewed` field matches the current PR branch/number being audited, (d) verify session file `verdict` = ASSURANCE-TOKEN. Any mismatch = REJECTION-PACKAGE (enforces A-016 cross-PR reuse and A-017 REJECTION-as-PASS at core level). | ALL | REJECTION-PACKAGE |
| CORE-020 | Zero partial pass rule | Any core or overlay check that cannot be verified due to missing, blank, or unverifiable evidence = REJECTION-PACKAGE for that check. No assumed passes. Absence of evidence = failing check. A PR with partial evidence must not receive ASSURANCE-TOKEN under any category or class. | ALL | REJECTION-PACKAGE |

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

**PENDING is a valid mid-ceremony state (PASS — ceremony in progress)**:
- `iaa_audit_token: PENDING` with `## IAA Agent Response (verbatim)` section present (awaiting population) = PASS (ceremony in progress) — conditional on Post-ASSURANCE-TOKEN ceremony completion.
- Do not fail a PREHANDOVER proof solely because `iaa_audit_token: PENDING` — this is the correct state at invocation time. Distinguish this clearly from PHASE_A_ADVISORY fabrication (see A-006).

**Copy-paste requirement**: The `## IAA Agent Response (verbatim)` section must contain the complete IAA output block copied character-for-character from the IAA tool output — from the opening `ASSURANCE-TOKEN` / `REJECTION-PACKAGE` header to the end of the block. Paraphrasing, summarising, or partial copying is not permitted. Any deviation from the exact IAA output constitutes an INC-IAA-SKIP-001 breach.

**Note**: PHASE_A_ADVISORY is a legitimate outcome — but only when the IAA tool was actually called and the IAA agent itself issued the advisory. A bare date string without IAA session output is always a PHASE_A_ADVISORY FABRICATION breach (FAIL-ONLY-ONCE A-014 / INC-IAA-SKIP-001).

---

## CORE-018 Detail — Complete Evidence Artifact Sweep

CORE-018 is the first check applied on every triggered invocation. Before evaluating any core invariant or overlay:

1. Confirm PREHANDOVER proof file exists on the PR branch
2. Confirm session memory file exists on the PR branch
3. Confirm `iaa_audit_token` field is present in the PREHANDOVER proof AND is non-empty AND is not a generic placeholder ("TODO", "TBD", "placeholder", etc.)
4. Confirm `## IAA Agent Response (verbatim)` section is present in the PREHANDOVER proof (content may be empty ONLY if `iaa_audit_token: PENDING`)

If any of the four conditions fails → REJECTION-PACKAGE immediately. Do not continue to overlay checks.

---

## CORE-019 Detail — IAA Token Cross-Verification

When `iaa_audit_token` is not PENDING and contains `IAA-session-NNN-YYYYMMDD-PASS`:

1. Extract session-NNN and date YYYYMMDD from the token
2. Open `.agent-workspace/independent-assurance-agent/memory/session-NNN-YYYYMMDD.md`
3. If file does not exist → FAIL (phantom token)
4. Read `pr_reviewed` field in that session file
5. Compare `pr_reviewed` to the current PR branch/number being audited
6. If mismatch → FAIL (A-016: cross-PR token reuse)
7. Read `verdict` field in that session file
8. If `verdict = REJECTION-PACKAGE` → FAIL (A-017: REJECTION-as-PASS citation)
9. If all checks pass → PASS

This check MUST be run for EVERY non-PENDING token. Cross-referencing the session file is mandatory — do not accept the token string at face value.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial STUB (placeholder from canon) |
| 2.0.0 | 2026-02-28 | Fully populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md; CORE-016 added (A-014 IAA tool call evidence); CORE-017 added (A-005/A-013 agent file immutability); STUB status removed |
| 2.1.0 | 2026-03-01 | CORE-016: added explicit copy-paste-only requirement — verbatim full block, never paraphrase (maturion-isms#699) |
| 2.2.0 | 2026-03-02 | CORE-016: added PENDING mid-ceremony PASS state clarification (session-083 suggestion); CORE-018 added (complete evidence artifact sweep before overlay checks); CORE-019 added (IAA token cross-verification — A-016/A-017 enforcement at core level); CORE-020 added (zero partial pass rule — any unverifiable check = REJECTION-PACKAGE); CORE-018/019 detail sections added (maturion-isms#IAA-TIER2 Wave 13+) |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
