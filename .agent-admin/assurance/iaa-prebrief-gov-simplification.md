# IAA Pre-Brief — Wave: gov-simplification

**Agent**: independent-assurance-agent
**Contract Version**: 2.5.0
**Knowledge Version**: 3.5.0
**Pre-Brief Date**: 2026-04-13
**Wave**: gov-simplification
**Branch**: copilot/gov-simplification-consolidate-artifact-model
**Issue**: [GOV-SIMPLIFICATION] Consolidate assurance artifact model to reduce per-wave file overhead and enforce governance artifact restrictions
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Wave Summary

This wave consolidates the assurance artifact model to reduce per-wave file overhead.
Current state: `.agent-admin/assurance/` contains **369 files** (106 prebriefs, 199 tokens, 9 prehandovers, 2 invalidated).
Target state: Single `iaa-wave-record-{wave}-{date}.md` per wave containing prebrief, PREHANDOVER, and token sections; revision trail capped at 1 INVALIDATED + 1 final per artifact; CI enforcement of approved file paths.

---

## Overall PR Category Classification

**Category: MIXED** — PR triggers multiple IAA categories simultaneously:

| Triggered Category | Triggering Artifacts |
|-------------------|---------------------|
| AGENT_CONTRACT | `.github/agents/independent-assurance-agent.md` (artifact path patterns in YAML: `pre_brief_artifact_path_pattern`, `token_file_pattern`; Phase 4 Step 4.2b ceremony text) |
| CANON_GOVERNANCE | `governance/canon/IAA_PRE_BRIEF_PROTOCOL.md`, `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`, `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md` |
| CI_WORKFLOW | New `.github/workflows/` file for approved file path enforcement |
| KNOWLEDGE_GOVERNANCE | `.agent-workspace/independent-assurance-agent/knowledge/` files (session-memory-template, core-invariants-checklist, category-overlays, high-frequency-checks if referencing artifact paths) |

**IAA is MANDATORY for this PR. No exemption possible.**

---

## Qualifying Tasks

### T1 — Merge IAA prebrief + token into single wave-record file

| Field | Value |
|-------|-------|
| task_id | T1 |
| task_summary | Merge separate `iaa-prebrief-*.md` and `iaa-token-*.md` files into single `iaa-wave-record-{wave}-{date}.md` file per wave |
| iaa_trigger_category | AGENT_CONTRACT, CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE |
| required_phases | Phase 2 (alignment), Phase 3 (assurance work), Phase 4 (merge gate parity + verdict) |
| required_evidence_artifacts | Updated IAA contract YAML showing new `artifact_path_pattern`; updated canon showing new artifact model; migration script or proof that existing artifacts are accounted for |
| applicable_overlays | AGENT_CONTRACT overlay (AC-01 through AC-07), CANON_GOVERNANCE overlay, KNOWLEDGE_GOVERNANCE overlay |
| specific_rules | FAIL-ONLY-ONCE A-029 (§4.3b artifact immutability) — new model must preserve immutability guarantees. A-001 (IAA invocation evidence) — new unified file must still contain IAA invocation evidence. IAA self-review escalation — if IAA contract changes, IAA reviews the contract but escalates any finding about its own contract structure to CS2. |

### T2 — Embed PREHANDOVER content in wave-record file

| Field | Value |
|-------|-------|
| task_id | T2 |
| task_summary | Embed PREHANDOVER proof content as a section within the unified `iaa-wave-record-{wave}-{date}.md` file instead of standalone `PREHANDOVER-*.md` files |
| iaa_trigger_category | AGENT_CONTRACT, CANON_GOVERNANCE, KNOWLEDGE_GOVERNANCE |
| required_phases | Phase 2, Phase 3, Phase 4 |
| required_evidence_artifacts | Updated artifact model documentation; proof that immutability guarantee (A-029: PREHANDOVER is read-only post-commit) is preserved in new embedded model; updated AGENT_HANDOVER_AUTOMATION.md references if applicable |
| applicable_overlays | AGENT_CONTRACT overlay, CANON_GOVERNANCE overlay |
| specific_rules | A-029 (§4.3b): PREHANDOVER section within unified file must remain immutable after initial commit. The IAA token section is appended in a subsequent commit — the PREHANDOVER section must not be modified by that append. This is the critical design constraint. |

### T3 — Cap revision trail files

| Field | Value |
|-------|-------|
| task_id | T3 |
| task_summary | Cap revision trail files at one INVALIDATED + one final per artifact type |
| iaa_trigger_category | CANON_GOVERNANCE |
| required_phases | Phase 2, Phase 3, Phase 4 |
| required_evidence_artifacts | Updated GOVERNANCE_ARTIFACT_TAXONOMY.md with cap rule; proof that INVALIDATED-PREFIX-CONVENTION.md is updated or superseded |
| applicable_overlays | CANON_GOVERNANCE overlay |
| specific_rules | Must define what happens when a second INVALIDATION occurs — does the first INVALIDATED file get deleted or archived? Clear lifecycle must be documented. |

### T4 — Update policy docs

| Field | Value |
|-------|-------|
| task_id | T4 |
| task_summary | Update three canon documents: IAA_PRE_BRIEF_PROTOCOL.md, INDEPENDENT_ASSURANCE_AGENT_CANON.md, GOVERNANCE_ARTIFACT_TAXONOMY.md |
| iaa_trigger_category | CANON_GOVERNANCE |
| required_phases | Phase 2, Phase 3, Phase 4 |
| required_evidence_artifacts | Version bumps in all three documents; CANON_INVENTORY.json hash updates; changelog entries |
| applicable_overlays | CANON_GOVERNANCE overlay |
| specific_rules | CANON_INVENTORY.json must be updated with new SHA256 hashes for all three modified canon files. Any placeholder or null hash → HALT-002. Version bump mandatory per canon governance rules. |

### T5 — Archive existing assurance artifacts

| Field | Value |
|-------|-------|
| task_id | T5 |
| task_summary | Move existing `.agent-admin/assurance/` artifacts (369 files) to an `archive/` subdirectory |
| iaa_trigger_category | MIXED (administrative action within governance-scoped directory) |
| required_phases | Phase 2, Phase 3, Phase 4 |
| required_evidence_artifacts | Archive manifest showing file count before/after; proof that no active wave references are broken by the archive operation |
| applicable_overlays | Core invariants only (CORE-013 scope parity, CORE-018 artifact existence) |
| specific_rules | Git history preserves all files — this is a move, not a delete. The archive operation must not break any CI workflow or active wave reference. Confirm no open PRs reference archived paths. |

### T6 — Implement CI workflow for approved file paths

| Field | Value |
|-------|-------|
| task_id | T6 |
| task_summary | Create new GitHub Actions workflow in `.github/workflows/` to enforce that only approved file patterns are created in `.agent-admin/assurance/` |
| iaa_trigger_category | CI_WORKFLOW |
| required_phases | Phase 2, Phase 3, Phase 4 |
| required_evidence_artifacts | Workflow YAML file committed; proof of local workflow validation (YAML syntax, action references, permissions); approved file pattern allowlist defined |
| applicable_overlays | CI_WORKFLOW overlay |
| specific_rules | Workflow must use pinned action versions (SHA or tag), not `@main` or floating refs. Workflow permissions must follow least-privilege. The approved path allowlist must be consistent with the new artifact model (T1-T3). |

### T7 — Update Foreman planning protocol

| Field | Value |
|-------|-------|
| task_id | T7 |
| task_summary | Update Foreman planning protocol with declarative approved artifact paths so Foreman knows the new file patterns at wave-start |
| iaa_trigger_category | KNOWLEDGE_GOVERNANCE (if Foreman knowledge files) or AGENT_CONTRACT (if Foreman contract) |
| required_phases | Phase 2, Phase 3, Phase 4 |
| required_evidence_artifacts | Updated Foreman knowledge file or contract showing new artifact path declarations; consistency check against T6 CI allowlist |
| applicable_overlays | KNOWLEDGE_GOVERNANCE overlay (or AGENT_CONTRACT overlay if contract is modified) |
| specific_rules | Foreman contract modification triggers IAA for ALL agent classes (A-002). If only knowledge files change, KNOWLEDGE_GOVERNANCE overlay applies. Cross-reference with T6 to ensure Foreman's declared paths match CI enforcement paths. |

---

## Anti-Regression Obligations (Step 0.3b)

### Known Recurring Failure Patterns for This Wave

| Pattern | Source | Anti-Regression Obligation | Mechanical Verification |
|---------|--------|---------------------------|------------------------|
| A-021: Ceremony artifacts uncommitted | Sessions 127–165 (most common ceremony failure across all waves) | All ceremony artifacts (unified wave-record file, SCOPE_DECLARATION) must be committed before IAA invocation | `git status` must show clean tree; all `.agent-admin/assurance/` files tracked |
| A-029: PREHANDOVER immutability violation | Sessions 147-150 | New embedded PREHANDOVER section must not be modified after initial commit. Verify via `git diff` between PREHANDOVER commit and token-append commit | Diff of PREHANDOVER section between commits must be empty |
| PREHANDOVER SHA mismatch | Session wave15r-impl | SHA references in PREHANDOVER must correspond to commits containing the claimed artifacts | Verify each cited SHA with `git show --stat <SHA>` |
| CANON_INVENTORY hash staleness | Sessions 132-136 | All three modified canon files must have updated SHA256 hashes in CANON_INVENTORY.json — no null, placeholder, or stale hashes | `jq '.[] | select(.file_hash_sha256 == null or .file_hash_sha256 == "")' governance/CANON_INVENTORY.json` must return empty |
| Scope set management | Sessions 160-165 | SCOPE_DECLARATION must list exactly the files modified — no extras, no missing | Cross-check SCOPE_DECLARATION against `git diff --name-only` |

### No Recurring Patterns Specific to Artifact Model Consolidation

This is a first-of-kind wave (artifact model restructuring). No prior sessions have addressed this scope. Anti-regression obligations above are general patterns that apply to any governance-heavy PR.

---

## Ceremony-Admin Appointment Check (Step 0.3c)

**Ceremony-admin appointed: UNKNOWN / NOT YET DECLARED.**

The wave `gov-simplification` has not yet been declared in `wave-current-tasks.md`. The `ceremony_admin_appointed` field is absent.

**Pre-Brief records:**
- If `execution-ceremony-admin-agent` is appointed for this wave, IAA will verify at invocation that:
  - (a) ceremony-admin did NOT invoke IAA (Foreman-only)
  - (b) ceremony-admin did NOT issue substantive readiness approval
  - (c) Foreman reviewed the returned bundle before IAA invocation
- If no ceremony-admin is appointed: ECAP three-role split check will be N/A.

---

## Scope Blockers and Constraints

### Critical Design Constraint — A-029 Immutability in Unified File

The most significant architectural risk in this wave is preserving A-029 (§4.3b artifact immutability) within a unified file model:

- **Current model**: PREHANDOVER is a standalone file committed once, then never modified. IAA token is a separate file written after assurance.
- **Proposed model**: Both live in one file. The PREHANDOVER section must be committed first, then the IAA token section appended in a subsequent commit WITHOUT modifying the PREHANDOVER section.
- **IAA will verify**: `git diff` between the PREHANDOVER commit and the token-append commit shows ZERO changes to the PREHANDOVER section. Any diff in that section = FAIL.

### IAA Self-Review Boundary

This wave modifies the IAA's own contract file (`.github/agents/independent-assurance-agent.md`). Per trigger table:
- IAA cannot self-review its own contract changes.
- IAA will review the PR but escalate any finding about its own contract structure to CS2.
- CS2 must provide explicit approval for IAA contract modifications.

### CANON_INVENTORY Hash Update Requirement

Three canon files are being modified. All three must have updated SHA256 hashes in `governance/CANON_INVENTORY.json` before IAA assurance. Stale hashes → HALT-002.

### CI Workflow — First-Time Enforcement

Task T6 introduces a NEW CI workflow. This is a net-new enforcement mechanism. IAA will verify:
- Workflow YAML syntax is valid
- Action references are pinned (not floating)
- Permissions follow least-privilege
- Approved path allowlist is consistent with the new artifact model

---

## Required Evidence at IAA Invocation

When IAA is invoked for assurance on this wave, the following evidence must be present:

1. **SCOPE_DECLARATION** — listing all modified files
2. **Unified wave-record file** — demonstrating the new artifact model
3. **Updated canon files** (3) with version bumps and changelogs
4. **Updated CANON_INVENTORY.json** with fresh SHA256 hashes
5. **CI workflow YAML** — syntactically valid, pinned actions
6. **Updated IAA contract YAML** — new artifact path patterns
7. **Archive manifest** — file count before/after, no broken references
8. **PREHANDOVER proof** — either embedded in unified file or standalone (per the model being implemented)
9. **Foreman knowledge/contract update** — approved artifact paths declared

---

## Pre-Brief Status

| Item | Status |
|------|--------|
| Pre-Brief invocation confirmed | ✅ |
| Wave tasks extracted | ✅ 7 tasks |
| Qualifying tasks | ✅ ALL 7 (zero exempt) |
| Anti-regression obligations declared | ✅ 5 patterns |
| Ceremony-admin check | ⏳ Not yet appointed |
| Scope blockers identified | ✅ 3 critical constraints |
| Required evidence listed | ✅ 9 artifacts |

**Pre-Brief verdict: ALL TASKS QUALIFYING. IAA assurance is MANDATORY for this wave.**

---

**Generated by**: independent-assurance-agent v6.2.0
**Contract**: 2.5.0 | **Knowledge**: 3.5.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
