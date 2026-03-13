# IAA Core Invariants Checklist

**Agent**: independent-assurance-agent
**Version**: 2.9.0
**Status**: ACTIVE
**Last Updated**: 2026-03-13
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## ⚠️ ARCHITECTURE ALIGNMENT NOTE (effective 2026-03-04)

**A-029 (§4.3b Artifact Immutability) supersedes A-025 and changes the PREHANDOVER evidence model.**
Under the new architecture:
- The **PREHANDOVER proof** is committed before the IAA runs and is **read-only** thereafter.
- The `iaa_audit_token` field in the PREHANDOVER proof is pre-populated with the **expected** token reference at commit time (e.g., `IAA-session-NNN-waveY-YYYYMMDD-PASS`).
- The IAA writes its full verdict to a **separate dedicated token file**: `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`.
- The `## IAA Agent Response (verbatim)` section lives in the **token file**, NOT in the PREHANDOVER proof.
- CORE-016 and CORE-018 have been updated below to match this architecture. References to `## IAA Agent Response (verbatim)` in the PREHANDOVER proof are now obsolete.

---

## ⚠️ ORIENTATION MANDATE — READ BEFORE APPLYING THIS CHECKLIST (CS2 Directive — 2026-03-04)

**These checks are the 10% ceremony admin layer.** They verify existence and format only.

IAA's primary obligation (90%) is substance:
- For BUILD PRs: does the delivered code actually work, is it safe, and will it produce a
  functional result first time?
- For GOVERNANCE PRs: does the change align with strategy, avoid contradictions, and close
gaps rather than create them?

**Do NOT spend more than 10% of session effort on the checks in this file.**
A session that produces 20 CORE check findings and zero substantive observations has
inverted the mandate. This checklist exists to prevent ceremony bypass — not to replace
the substantive review.

The only hard-gate checks that justify extended time are:
- CORE-018 (evidence sweep) — binary: present or absent
- CORE-016 (token file) — binary: exists or does not
- CORE-013 (IAA invocation evidence) — binary: present or absent

All other checks: apply once, record PASS/FAIL, move to substance.

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
| CORE-007 | No placeholder content | No stub, TODO, FIXME, or placeholder values in any delivered artifact. Search for: "STUB", "TODO:", "FIXME:", "placeholder", "to be populated", "TBD". **Exempt**: the `iaa_audit_token` field in the PREHANDOVER proof when it contains the expected reference format `IAA-session-NNN-waveY-YYYYMMDD-PASS` (this is a valid pre-populated reference, not a placeholder). Do NOT flag this field unless the value is a bare date string or the word PENDING/TBD. | ALL | REJECTION-PACKAGE |
| CORE-008 | Prohibitions block present | At least one prohibition entry present with id, rule, and enforcement fields; at least one prohibition has enforcement: CONSTITUTIONAL | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-009 | Merge gate interface present | merge_gate_interface.required_checks is a non-empty array; parity_required: true; parity_enforcement: BLOCKING | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-010 | Tier 2 knowledge indexed | tier2_knowledge.index path is correct; the referenced index.md exists at the stated path in the repository | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-011 | Four-phase structure present | Contract body contains all four phases (Phase 1 IDENTITY & PREFLIGHT, Phase 2 ALIGNMENT, Phase 3 WORK, Phase 4 HANDOVER) with mandatory evidence output declarations | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-012 | Self-modification lock present | A prohibition with id matching SELF-MOD-* and enforcement: CONSTITUTIONAL is present | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof or IAA token reference present in PR artifacts (FAIL-ONLY-ONCE A-001). For AGENT_CONTRACT PRs: explicit IAA audit token required, not just a reference | ALL | REJECTION-PACKAGE |
| CORE-014 | No class exemption claim | Invoking agent has not claimed class exemption from IAA (FAIL-ONLY-ONCE A-002). Foreman, Builder, Overseer, Specialist — all subject to IAA | ALL | REJECTION-PACKAGE |
| CORE-015 | Session memory present | Session memory artifact included in PR bundle (file path present in PREHANDOVER proof or PR artifact manifest) | ALL | REJECTION-PACKAGE |
| CORE-016 | IAA verdict evidenced (§4.3b architecture) | A dedicated IAA token file must exist on the branch at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`. This file contains the verbatim IAA output. The PREHANDOVER proof is NOT required to contain a `## IAA Agent Response (verbatim)` section — that requirement is superseded by A-029. See **CORE-016 Detail** below. | ALL | REJECTION-PACKAGE |
| CORE-017 | No .github/agents/ modifications by unauthorized agent | PR diff must not contain modifications to `.github/agents/` files unless producing agent is CodexAdvisor-agent AND CS2 authorization is documented in PREHANDOVER proof (FAIL-ONLY-ONCE A-005 / A-013) | ALL | REJECTION-PACKAGE |
| CORE-018 | Complete evidence artifact sweep | BEFORE applying any overlay: verify ALL of the following are present and non-empty: (a) PREHANDOVER proof file on branch, (b) session memory file on branch, (c) `iaa_audit_token` field in PREHANDOVER proof is non-empty and not a bare placeholder (TBD/TODO/blank), (d) dedicated IAA token file exists at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`. The PREHANDOVER proof is NOT required to contain `## IAA Agent Response (verbatim)` — that section has moved to the token file. Any absent/empty item = immediate REJECTION-PACKAGE before overlay checks proceed. | ALL | REJECTION-PACKAGE |
| CORE-019 | IAA token cross-verification | When `iaa_audit_token` contains `IAA-session-NNN-waveY-YYYYMMDD-PASS` or similar: (a) verify token format is valid, (b) open the dedicated token file `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`, (c) verify it references the current PR branch/number, (d) verify token file verdict = ASSURANCE-TOKEN. **FIRST INVOCATION EXCEPTION**: If the token file does not yet exist AND this is clearly the first IAA invocation for this session number on this PR (no prior session memory exists for session-NNN on this PR), treat CORE-019 as PASS — the token file will be created during Step 4.3 of THIS invocation. Record "First invocation — token file will be created this session" in evidence output. If a session file exists and references a different PR → FAIL (A-016 cross-PR reuse). | ALL | REJECTION-PACKAGE |
| CORE-020 | Zero partial pass rule | Any core or overlay check that cannot be verified due to missing, blank, or unverifiable evidence = REJECTION-PACKAGE for that check. No assumed passes. Absence of evidence = failing check. A PR with partial evidence must not receive ASSURANCE-TOKEN under any category or class. | ALL | REJECTION-PACKAGE |
| CORE-021 | Zero-severity-tolerance | Any finding identified during the assurance review — regardless of perceived severity, wording, or delivery size — MUST produce REJECTION-PACKAGE. Prohibited: using terms "minor", "trivial", "cosmetic", "small", "negligible", "low-impact", "soft-pass", or "acceptable" to characterise a finding as passable. The only valid exception is an explicit written CS2 waiver quoted verbatim in the output. See `IAA_ZERO_SEVERITY_TOLERANCE.md` for full operational guidance. | ALL | REJECTION-PACKAGE |
| CORE-022 | Secret field naming compliance | Agent contract files must use `secret_env_var:` — never `secret:` — in `governance.execution_identity` blocks and any YAML block. Scan the PR diff for the pattern `secret: "` in any `.github/agents/*.md` file (excluding `_archive/`). If found: FAIL. Enforces FAIL-ONLY-ONCE A-024. Prevents CI secret scanner false positives that block all gate checks. | AGENT_CONTRACT | REJECTION-PACKAGE |
| CORE-023 | Workflow integrity ripple check | If the PR touches any file that is referenced by, executed by, or depended upon by `.github/workflows/*.yml` files (including test runners, build scripts, Edge Function paths, schema migration steps, or any path listed in workflow `paths:` triggers), IAA must verify: (a) all affected workflow files remain syntactically valid after the delivered changes, (b) any changed file paths are reflected in workflow `paths:` filters if applicable, (c) no workflow job is silently broken by the delivered changes. **Scope trigger**: applies when the PR diff includes changes to test files, frontend source, Edge Function source, schema migrations, build configuration, or any file type that workflows invoke or reference. If the PR does NOT touch any workflow-adjacent file, IAA records `CORE-023: N/A — no workflow-adjacent changes detected` and proceeds. See **CORE-023 Detail** below. | ALL | REJECTION-PACKAGE |

---

## Applying the Checklist

For each check:
1. Locate the relevant artifact(s) in the PR bundle
2. Apply the check description as stated
3. Record PASS or FAIL with specific evidence
4. Any FAIL → REJECTION-PACKAGE (no partial passes)

**AMBIGUITY RULE**: If uncertain whether a check applies to this PR → apply it. The cost of a false REJECTION-PACKAGE is a fix request. The cost of a missed REJECTION-PACKAGE is a governance breach.

---

## CORE-016 Detail — IAA Verdict Evidence (§4.3b Architecture — Updated 2026-03-04)

**This check has been updated to match the A-029 §4.3b architecture.** The previous requirement for a `## IAA Agent Response (verbatim)` section inside the PREHANDOVER proof is superseded.

### Under the §4.3b Architecture:

The PREHANDOVER proof is committed **before** IAA runs and is **read-only** thereafter. The IAA verdict lives in a separate dedicated file:

**Token file path**: `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`

CORE-016 PASS conditions (§4.3b — post 2026-03-04):
1. `iaa_audit_token` field in PREHANDOVER proof contains a valid expected reference in format `IAA-session-NNN-waveY-YYYYMMDD-PASS` (or `IAA-session-NNN-YYYYMMDD-PASS`), AND
2. Dedicated token file exists at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md`, AND
3. Token file contains the verbatim IAA ASSURANCE-TOKEN output block.

**FIRST INVOCATION EXCEPTION**: If this is the first time IAA is being invoked for session-NNN on this PR, the token file does not yet exist (it will be created during THIS invocation's Step 4.3). In this case:
- Condition 1 must still hold (PREHANDOVER proof must have the expected reference)
- Conditions 2 and 3 are waived for this invocation only — IAA creates the token file as its output
- Record "First invocation — token file will be created this session" in CORE-016 evidence

CORE-016 FAIL conditions:
- `iaa_audit_token` is blank, "TBD", "TODO", or "placeholder" → FAIL
- `iaa_audit_token` contains exactly `PHASE_A_ADVISORY — YYYY-MM-DD` with no real IAA tool call evidence → FAIL (INC-IAA-SKIP-001 / A-006)
- Token file exists but contains no ASSURANCE-TOKEN or REJECTION-PACKAGE header → FAIL (invalid token file)
- Token file exists but references a different PR → FAIL (A-016 cross-PR reuse)

**For pre-2026-03-04 PREHANDOVER proofs** (legacy — PENDING architecture):
PASS if: `iaa_audit_token: PENDING` AND `## IAA Agent Response (verbatim)` section is present with real IAA output. Do not retroactively fail prior sessions for using PENDING.

**PHASE_A_ADVISORY detection (A-006)**:
A bare `PHASE_A_ADVISORY — [date]` in `iaa_audit_token` without a real IAA session output is always a fabrication breach. PHASE_A_ADVISORY is only legitimate when the IAA tool was called and the IAA agent itself issued the advisory — evidenced by a token file or verbatim response section.

---

## CORE-018 Detail — Complete Evidence Artifact Sweep (§4.3b Architecture — Updated 2026-03-04)

CORE-018 is the first check applied on every triggered invocation. Before evaluating any core invariant or overlay:

1. Confirm PREHANDOVER proof file exists on the PR branch
2. Confirm session memory file exists on the PR branch
3. Confirm `iaa_audit_token` field is present in the PREHANDOVER proof AND is non-empty AND is not a bare placeholder ("TODO", "TBD", "placeholder", blank)
4. **§4.3b check**: Confirm dedicated IAA token file exists at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` OR this is the first invocation for session-NNN on this PR (see First Invocation Exception in CORE-019)

**What is NO LONGER required in CORE-018** (superseded by A-029):
- The PREHANDOVER proof does NOT need to contain `## IAA Agent Response (verbatim)`. That section has moved to the dedicated token file.
- Do NOT fail CORE-018 because the PREHANDOVER proof lacks a verbatim response section.

If conditions 1–3 fail → REJECTION-PACKAGE immediately. Do not continue to overlay checks.
If condition 4 fails and this is NOT the first invocation → REJECTION-PACKAGE.
If condition 4 fails and this IS the first invocation → PASS condition 4 (First Invocation Exception).

---

## CORE-019 Detail — IAA Token Cross-Verification (Updated 2026-03-04)

### Standard path (token file exists):

When `iaa_audit_token` contains `IAA-session-NNN-waveY-YYYYMMDD-PASS` or `IAA-session-NNN-YYYYMMDD-PASS`:

1. Extract session-NNN and date YYYYMMDD from the token
2. Open `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` (or closest matching path)
3. If file does not exist → apply First Invocation Exception (step 4 below) before failing
4. Read PR reference field in that token file
5. Compare PR reference to the current PR branch/number being audited
6. If mismatch → FAIL (A-016: cross-PR token reuse)
7. Read verdict field in that token file
8. If verdict = REJECTION-PACKAGE → FAIL (A-017: REJECTION-as-PASS citation)
9. If all checks pass → PASS

### First Invocation Exception:

If the token file does not exist AND both of the following are true:
- No prior IAA session memory file exists for session-NNN on this PR (`session-NNN-*.md` not found in `.agent-workspace/independent-assurance-agent/memory/`)
- The `iaa_audit_token` in the PREHANDOVER proof matches the session number currently being run

Then: **PASS CORE-019 for this invocation**. Record in evidence: "Session-NNN token file does not yet exist — this is the creating invocation. Token file will be written at Step 4.3." The cross-verification will run on ALL subsequent invocations once the token file exists.

### What this prevents:
- Accepting tokens that were issued for a different PR (A-016)
- Accepting tokens where the underlying session issued REJECTION-PACKAGE (A-017)
- Accepting phantom tokens (no backing session file at all, on re-invocations)

This check MUST be run on every NON-first-invocation. First invocations are exempt by the clause above.

---

## CORE-023 Detail — Workflow Integrity Ripple Check (Added 2026-03-13)

**Governing principle**: Workflow integrity is a handover condition. A delivery that silently breaks a CI pipeline is functionally incomplete even if all other checks pass. The IAA must not treat `.github/workflows/` as out of scope merely because the PR did not directly modify those files — indirect impact through changed paths, renamed functions, or modified test targets counts.

### Scope Trigger — When CORE-023 Applies

CORE-023 is **active** when the PR diff contains changes to any of the following file types or paths:

| File type / path pattern | Reason workflows are affected |
|--------------------------|-------------------------------|
| `modules/*/tests/**` | Workflow test runner jobs reference test file paths and patterns |
| `modules/*/frontend/src/**` | Build workflows compile frontend source; path changes break build steps |
| `supabase/functions/**` | Workflow deploy jobs reference Edge Function paths by name |
| `supabase/migrations/**` | Workflow schema migration jobs run migration files in order |
| `package.json`, `vite.config.*`, `tsconfig.*` | Build/test tooling config — workflow steps invoke these directly |
| Any file listed in a workflow `paths:` trigger filter | A change to a trigger-listed path affects which runs are triggered |

CORE-023 is **N/A** when the PR diff contains only:
- Governance/docs files (`.md` outside `supabase/`, `modules/`)
- Session memory artifacts
- IAA token/ceremony files

### CORE-023 PASS Conditions

1. For each affected workflow identified: IAA opens the workflow YAML and confirms it is syntactically valid with the delivered changes in place (no broken `run:` paths, no missing referenced files).
2. If the PR renames or moves a file that a workflow references by path: the workflow has been updated to reflect the new path, OR the producing agent has documented in the PREHANDOVER proof that no workflow references the old path (with evidence).
3. No workflow job is left in a state where it would silently pass while skipping the intended check (e.g., a `paths:` filter that no longer matches any delivered file, causing the job to be skipped entirely).

### CORE-023 FAIL Conditions

- A workflow's `run:` step references a file path that no longer exists after the PR changes → FAIL
- A workflow's `paths:` trigger filter no longer matches any file in the PR, causing the gate job to be silently skipped → FAIL
- The PR changes a test file pattern but the workflow `run: vitest` command uses a hardcoded path that now misses those tests → FAIL
- The producing agent's PREHANDOVER proof claims "no workflow impact" but the IAA finds a direct path reference in a workflow YAML that matches a changed file → FAIL

### CORE-023 N/A Recording

When CORE-023 does not apply, IAA records exactly:
> `CORE-023: N/A — no workflow-adjacent changes detected in PR diff.`

This explicit N/A record is required. Silence is not acceptable.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial STUB (placeholder from canon) |
| 2.0.0 | 2026-02-28 | Fully populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md; CORE-016 added (A-014 IAA tool call evidence); CORE-017 added (A-005/A-013 agent file immutability); STUB status removed |
| 2.1.0 | 2026-03-01 | CORE-016: added explicit copy-paste-only requirement — verbatim full block, never paraphrase (maturion-isms#699) |
| 2.2.0 | 2026-03-02 | CORE-016: added PENDING mid-ceremony PASS state clarification (session-083 suggestion); CORE-018 added (complete evidence artifact sweep before overlay checks); CORE-019 added (IAA token cross-verification — A-016/A-017 enforcement at core level); CORE-018/019 detail sections added (maturion-isms#IAA-TIER2 Wave 13+) |
| 2.3.0 | 2026-03-02 | CORE-007: added explicit PENDING carve-out note — do not flag `iaa_audit_token: PENDING` or `## IAA Agent Response (verbatim)` placeholder entries as placeholder violations (maturion-isms#IAA-TIER2) |
| 2.4.0 | 2026-03-02 | CORE-021 added: Zero-Severity-Tolerance enforcement — any finding regardless of perceived severity triggers REJECTION-PACKAGE; prohibited language table enforced (maturion-isms IAA Policy issue) |
| 2.5.0 | 2026-03-03 | CORE-022 added: Secret field naming compliance — `secret:` prohibited in agent contracts; must use `secret_env_var:`; enforces FAIL-ONLY-ONCE A-024 (maturion-isms feature issue, CI scanner failures job 65529138120) |
| 2.6.0 | 2026-03-04 | CORE-016 PENDING carve-out updated — post-2026-03-04 PREHANDOVER proofs must use expected reference format not PENDING (A-029 supersession per §4.3b); CORE-018 note updated accordingly |
| 2.7.0 | 2026-03-04 | **BREAKING FIX**: CORE-016, CORE-018, CORE-019 fully rewritten to match §4.3b architecture (A-029). Verbatim response requirement moved from PREHANDOVER proof to dedicated token file. First Invocation Exception added to CORE-019 to break the circular dependency loop. Architecture Alignment Note added at top of file. CORE-007 carve-out updated for expected reference format. |
| 2.8.0 | 2026-03-04 | Orientation Mandate section added — 90/10 rule codified in checklist; ceremony checks explicitly framed as 10% layer; substantive review as 90% primary obligation (CS2 directive) |
| 2.9.0 | 2026-03-13 | CORE-023 added: Workflow integrity ripple check — IAA must verify CI/CD workflows are not silently broken by workflow-adjacent file changes; scope trigger table, PASS/FAIL conditions, and N/A recording requirement defined (CS2 directive 2026-03-13) |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0